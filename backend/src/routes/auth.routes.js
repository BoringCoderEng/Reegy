console.log("Auth routes loaded");
const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
// user auth API
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

// food partner auth API
router.post('/foodpartner/register', authController.registerFoodPartner);
router.post('/foodpartner/login', authController.loginFoodPartner);
router.get('/foodpartner/logout', authController.logoutFoodPartner);

module.exports = router;