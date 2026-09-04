const razorpay = require("./razorpay");

async function initiateRefund(order) {
  // Why a full refund is always correct here: cancellations only happen
  // pre-acceptance (enforced below), so nothing's been spent by the
  // partner yet at this stage.
  const refund = await razorpay.payments.refund(order.paymentId, { amount: order.total * 100 });
  order.paymentStatus = "refunded";
  order.refundId = refund.id;
  await order.save();
  return refund;
}

module.exports = { initiateRefund };