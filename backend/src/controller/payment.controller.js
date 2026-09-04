const razorpay = require("../services/razorpay");
const crypto = require("crypto");
const Cart = require("../models/cart.model");
const { placeOrderFromCart } = require("../services/orderService");
const { getIO } = require("../socket");

exports.createPayment = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.food");
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + 30 + Math.round(subtotal * 0.05);

  // Why compute total on the backend, never trust one from the frontend:
  // a frontend-supplied amount could be edited in dev tools to pay ₹1 for
  // a ₹500 order. The backend is the only source of truth for price.
  const razorpayOrder = await razorpay.orders.create({
    amount: total * 100, // paise, not rupees — avoids float rounding errors
    currency: "INR",
    receipt: `cart_${cart._id}`,
  });

  res.json({ orderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency, keyId: process.env.RAZORPAY_KEY_ID });
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, addressId } = req.body;

  // Why HMAC verification: recreates the signature Razorpay computed with
  // the secret key. If any payment detail was tampered with, it won't match.
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");

  if (expected !== razorpay_signature) return res.status(400).json({ message: "Payment verification failed" });

  const order = await placeOrderFromCart(req.user._id, addressId, {
    paymentMethod: "online", paymentStatus: "paid", paymentId: razorpay_payment_id,
  });

  getIO().to(`partner:${order.foodPartner}`).emit("new-order", order);
  res.json(order);
};