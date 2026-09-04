const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: "FoodPartner", required: true },
    quantity: { type: Number, default: 1 },
    price: Number, // snapshot at time of adding — protects against menu price changes mid-cart
    instructions: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);