const Razorpay = require("razorpay");
// Why one shared instance: the SDK holds your secret key in memory —
// creating a new client per request has no benefit and is wasteful.
module.exports = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });