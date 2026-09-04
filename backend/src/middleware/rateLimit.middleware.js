const rateLimit = require("express-rate-limit");

const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10, // generous for a real customer, tight enough to block scripted abuse
  message: { message: "Too many orders placed. Please wait a bit." },
});

module.exports = { orderLimiter };