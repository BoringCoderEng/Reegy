const Cart = require("../models/cart.model");
const Order = require("../models/order.model");

async function placeOrderFromCart(userId, addressId, paymentInfo) {
  const cart = await Cart.findOne({ user: userId }).populate("items.food");
  if (!cart || cart.items.length === 0) throw new Error("EMPTY_CART");

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = 30;
  const tax = Math.round(subtotal * 0.05);

  const order = await Order.create({
    user: userId,
    foodPartner: cart.items[0].foodPartner,
    items: cart.items.map((i) => ({ food: i.food._id, name: i.food.name, price: i.price, quantity: i.quantity })),
    address: addressId,
    subtotal, deliveryFee, tax, total: subtotal + deliveryFee + tax,
    paymentMethod: paymentInfo.paymentMethod,
    paymentStatus: paymentInfo.paymentStatus || "pending",
    paymentId: paymentInfo.paymentId,
    statusHistory: [{ status: "placed" }],
  });

  await Cart.deleteOne({ user: userId });
  return order;
}

module.exports = { placeOrderFromCart };