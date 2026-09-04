const router = require("express").Router();
const cartController = require("../controller/cart.controller");
const { authUserMiddleware } = require("../middleware/auth.middleware");

router.get("/", authUserMiddleware, cartController.getCart);
router.post("/add", authUserMiddleware, cartController.addToCart);
router.patch("/:itemId", authUserMiddleware, cartController.updateCartItem);
router.delete("/:itemId", authUserMiddleware, cartController.removeCartItem);
router.post("/clear", authUserMiddleware, cartController.clearCart);

module.exports = router;