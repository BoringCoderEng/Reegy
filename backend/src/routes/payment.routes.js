const router = require("express").Router();
const paymentController = require("../controller/payment.controller");
const {authUserMiddleware}= require("../middleware/auth.middleware");

router.post("/create", authUserMiddleware, paymentController.createPayment);
router.post("/verify", authUserMiddleware, paymentController.verifyPayment);

module.exports = router;