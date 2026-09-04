const Address = require("../models/address.model");

exports.getAddresses = async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.json(addresses);
};

exports.addAddress = async (req, res) => {
  const { label, line1, city, state, pincode, lat, lng, isDefault } = req.body;

  // Why we unset other defaults first: only one address should ever be
  // "default" at a time — without this, marking a new address as default
  // would leave two addresses both flagged default, and the frontend
  // wouldn't know which one to pre-select at checkout.
  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const address = await Address.create({
    user: req.user._id, label, line1, city, state, pincode, lat, lng, isDefault: !!isDefault,
  });
  res.status(201).json(address);
};

exports.deleteAddress = async (req, res) => {
  const address = await Address.findById(req.params.id);
  if (!address) return res.status(404).json({ message: "Address not found" });
  if (String(address.user) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not your address" });
  }
  await address.deleteOne();
  res.json({ message: "Address removed" });
};