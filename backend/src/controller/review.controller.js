const Review = require("../models/review.model");
const Order = require("../models/order.model");
const { recalculateAvgRating } = require("../services/rating");

exports.createReview = async (req, res) => {
  const { orderId, rating, comment } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (String(order.user) !== String(req.user._id)) return res.status(403).json({ message: "Not your order" });
  if (order.status !== "delivered") return res.status(400).json({ message: "You can review only after delivery" });
  if (await Review.findOne({ order: orderId })) return res.status(400).json({ message: "Already reviewed" });

  const review = await Review.create({
    user: req.user._id, order: orderId, food: order.items[0].food, foodPartner: order.foodPartner, rating, comment,
  });

  await recalculateAvgRating(order.foodPartner);
  res.status(201).json(review);
};