const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: "FoodPartner", required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    name: String,
    price: Number,
    quantity: Number,
  }],
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  subtotal: Number,
  deliveryFee: Number,
  tax: Number,
  total: Number,
  paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  paymentId: String,
  refundId: String,
  status: {
    type: String,
    enum: ["placed", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "placed",
  },
  cancelledReason: String,
  statusHistory: [{ status: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);