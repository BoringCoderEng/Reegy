const Cart = require("../models/cart.model");
const Food = require("../models/food.model");

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.food");
  res.json(cart || { items: [] });
};

exports.addToCart = async (req, res) => {
  const { foodId, quantity = 1, instructions } = req.body;
  const food = await Food.findById(foodId).populate("foodPartner");
  if (!food) return res.status(404).json({ message: "Food item not found" });

  let cart = await Cart.findOne({ user: req.user._id });

  // Why reject mixed-partner carts: one order = one kitchen = one delivery.
  if (cart && cart.items.length > 0 && String(cart.items[0].foodPartner) !== String(food.foodPartner._id)) {
    return res.status(409).json({ message: "Cart has items from a different partner" });
  }

  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => String(i.food) === foodId);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ food: foodId, foodPartner: food.foodPartner._id, quantity, price: food.price, instructions });

  await cart.save();
  const populated = await cart.populate("items.food");
  res.json(populated);
};

exports.updateCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });
  item.quantity = req.body.quantity;
  await cart.save();
  const populated = await cart.populate("items.food");
  res.json(populated);
};

exports.removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  cart.items.id(req.params.itemId).deleteOne();
  await cart.save();
  const populated = await cart.populate("items.food");
  res.json(populated);
};

exports.clearCart = async (req, res) => {
  await Cart.deleteOne({ user: req.user._id });
  res.json({ message: "Cart cleared" });
};
