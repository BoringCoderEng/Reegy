const express = require('express');
const { authUserMiddleware } = require('../middleware/auth.middleware');
const router= express.Router();
const foodPartnerController = require("../controller/food-partner.controller");

router.get("/:id", authUserMiddleware, foodPartnerController.getFoodPartnerById);

module.exports= router;