const cron = require("node-cron");
const Order = require("../models/order.model");
const { initiateRefund } = require("../services/refund");
const { getIO } = require("../socket");

const RESPONSE_WINDOW_MINUTES = 5;

function startAutoCancelJob() {
  // Why every minute: checking more often (e.g. every 10s) wastes DB
  // queries for no user-noticeable benefit.
  cron.schedule("* * * * *", async () => {
    const cutoff = new Date(Date.now() - RESPONSE_WINDOW_MINUTES * 60 * 1000);
    const staleOrders = await Order.find({ status: "placed", createdAt: { $lt: cutoff } });

    for (const order of staleOrders) {
      order.status = "cancelled";
      order.cancelledReason = "partner_no_response";
      order.statusHistory.push({ status: "cancelled" });
      await order.save();

      if (order.paymentStatus === "paid") await initiateRefund(order);

      getIO().to(`user:${order.user}`).emit("order-status-update", {
        orderId: order._id, status: "cancelled", reason: "Restaurant did not respond in time",
      });
    }
  });
}

module.exports = { startAutoCancelJob };