const router = require("express").Router();
const orderController = require("../controller/order.controller");
const { authUserMiddleware } = require("../middleware/auth.middleware");
const validate  = require("../middleware/validate.middleware");
const { placeOrderSchema } = require("../validators/order.validator");
const { orderLimiter } = require("../middleware/rateLimit.middleware");

router.post("/", authUserMiddleware, orderLimiter, validate(placeOrderSchema),orderController.placeOrder);
router.get("/my", authUserMiddleware, orderController.getMyOrders);
router.get("/:id", authUserMiddleware, orderController.getOrderById);
router.post("/:id/cancel", authUserMiddleware, orderController.cancelOrder);

module.exports = router;