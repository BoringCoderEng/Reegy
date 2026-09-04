console.log("Auth routes loaded");
const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
// user auth API
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

// food partner auth API
router.post('/food-partner/register', authController.registerFoodPartner);
router.post('/food-partner/login', authController.loginFoodPartner);
router.get('/food-partner/logout', authController.logoutFoodPartner);

module.exports = router;