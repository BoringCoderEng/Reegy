const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // unique: true on order — guarantees one review per order at the DB
  // level, not just app logic, so it holds even if two requests race.
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: "FoodPartner", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);