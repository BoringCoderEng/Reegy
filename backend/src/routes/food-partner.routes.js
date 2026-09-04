const express = require('express');
const { authUserMiddleware } = require('../middleware/auth.middleware');
const router= express.Router();
const partnerOnly = require("../middleware/partnerOnly.middleware");
const foodPartnerController = require("../controller/food-partner.controller");
const orderController = require("../controller/order.controller");

router.get(
    "/orders",
    authUserMiddleware,
    partnerOnly,
    foodPartnerController.getMyOrders
);
router.patch("/orders/:id/status", authUserMiddleware, partnerOnly, orderController.updateOrderStatus);
router.get("/:id/storefront", foodPartnerController.getPartnerStorefront);
router.get("/:id", authUserMiddleware, foodPartnerController.getPartnerStorefront);


module.exports= router;