const express = require("express");
const crypto = require("crypto");
const router = express.Router();

// Why raw body parsing here specifically: signature verification needs
// the exact bytes Razorpay sent — if Express's json() middleware already
// parsed/re-serialized the body, the signature won't match.
router.post("/razorpay", express.raw({ type: "*/*" }), (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET).update(req.body).digest("hex");
  if (signature !== expected) return res.status(400).send("Invalid signature");

  const event = JSON.parse(req.body);
  if (event.event === "payment.captured") {
    // mark order paid here too, idempotently (webhooks can be delivered
    // more than once) — this catches cases where the browser closed
    // before `handler` in 5.3 ever ran.
  }
  res.json({ received: true });
});

module.exports = router;