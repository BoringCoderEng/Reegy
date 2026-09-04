const { placeOrderFromCart } = require("../services/orderService");
const Order = require("../models/order.model");
const { getIO } = require("../socket"); // built in Phase 4 — stub or comment out until then
const { initiateRefund } = require("../services/refund");


exports.placeOrder = async (req, res) => {
  try {
    const order = await placeOrderFromCart(req.user._id, req.body.addressId, {
      paymentMethod: req.body.paymentMethod,
    });
    getIO().to(`partner:${order.foodPartner}`).emit("new-order", order); // enable in Phase 4
    res.status(201).json(order);
  } catch (err) {
    if (err.message === "EMPTY_CART") return res.status(400).json({ message: "Cart is empty" });
    res.status(500).json({ message: "Could not place order" });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  // Why verify ownership: without this, any authenticated partner could
  // update someone else's order by guessing an order id.
  if (String(order.foodPartner) !== String(req.user._id)) return res.status(403).json({ message: "Not your order" });

  order.status = status;
  order.statusHistory.push({ status });
  await order.save();

  getIO().to(`user:${order.user}`).emit("order-status-update", {
    orderId: order._id, status: order.status, statusHistory: order.statusHistory,
  });

  res.json(order);
};

exports.cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (String(order.user) !== String(req.user._id)) return res.status(403).json({ message: "Not your order" });

  // Why only "placed" is cancellable: once accepted, the partner has
  // already started preparing — letting cancellation happen later just
  // shifts the loss onto them. Same rule Swiggy/Zomato use.
  if (order.status !== "placed") return res.status(400).json({ message: "Order can no longer be cancelled" });

  order.status = "cancelled";
  order.statusHistory.push({ status: "cancelled" });
  await order.save();

  if (order.paymentStatus === "paid") await initiateRefund(order);

  getIO().to(`partner:${order.foodPartner}`).emit("order-cancelled", { orderId: order._id });
  res.json(order);
};