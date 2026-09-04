const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: String,
    line1: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
    isDefault: { type: Boolean, default: false },
});

module.exports = mongoose.model('Address', addressSchema);