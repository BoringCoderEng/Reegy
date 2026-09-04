const express = require('express');
const foodcontroller = require('../controller/food.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage()
});
router.post('/add', authMiddleware.authfoodpartnerMiddleware, upload.single("video"), foodcontroller.addFoodItem);

router.get("/get",authMiddleware.authUserMiddleware , foodcontroller.getFoodItems);

router.post('/like',authMiddleware.authUserMiddleware, foodcontroller.likeFood);

router.post('/food', authMiddleware.authUserMiddleware, foodcontroller.savefood);

router.post('/save', authMiddleware.authUserMiddleware, foodcontroller.getSaveFood);

module.exports = router;