const foodModel = require('../models/fooditem.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');
const LikeModel= require('../models/likes.model')
const SaveModel= require('../models/save.model');
const saveModel = require('../models/save.model');

const addFoodItem = async (req, res) => {
    console.log("req.foodPartner:", req.foodPartner);
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    });
    res.status(201).json({
        message: 'Food item added successfully',
        food: foodItem
    });
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({});
    const foodItemsWithSaveCounts = await Promise.all(foodItems.map(async (foodItem) => ({
        ...foodItem.toObject(),
        saveCount: await SaveModel.countDocuments({ food: foodItem._id })
    })));
    res.status(200).json({
        message: 'Food items retrieved successfully',
        foodItems: foodItemsWithSaveCounts,
        userId: req.user._id
    });
}

async function likeFood(req, res){
    const { userId, foodId } = req.body;
    const user = req.user;

    if (!userId || String(userId) !== String(user._id)) {
        return res.status(400).json({ message: "Invalid user id" });
    }

    const isAlreadyLiked= await LikeModel.findOne({
        user:user._id,
        food: foodId
    })
    if(isAlreadyLiked){
        await LikeModel.deleteOne({
            user:user._id,
            food: foodId
        })

        const food = await foodModel.findByIdAndUpdate(foodId ,{
            $inc: { likeCount: -1}
        }, { new: true });
        return res.status(201).json({
            message: "Food Unliked successfully",
            like: false,
            likeCount: food.likeCount
        })
    }
    const like= await LikeModel.create({
        user: user._id,
        food: foodId
    })
    const food = await foodModel.findByIdAndUpdate(foodId ,{
        $inc: { likeCount: 1}
    }, { new: true });
    res.status(201).json({
        message: "Food Liked successfully",
        like: true,
        likeCount: food.likeCount
    })
    
}

async function savefood(req, res){
    const { userId, foodId } = req.body;
    const user = req.user;

    if (!userId || String(userId) !== String(user._id)) {
        return res.status(400).json({ message: "Invalid user id" });
    }

    const isAlreadySaved= await SaveModel.findOne({
        user:user._id,
        food: foodId
    })
    if(isAlreadySaved){
        await SaveModel.deleteOne({
            user:user._id,
            food: foodId
        })

        const saveCount = await SaveModel.countDocuments({ food: foodId });
        return res.status(201).json({
            message: "Food Unsaved successfully",
            saved: false,
            saveCount
        })
    }
    await SaveModel.create({
        user: user._id,
        food: foodId
    })
    const saveCount = await SaveModel.countDocuments({ food: foodId });
    res.status(201).json({
        message: "Food Saved successfully",
        saved: true,
        saveCount
    })
}

async function getSaveFood(req, res){
    const user= req.user;

    const savedFood=await saveModel.find({user: user._id}).populate('food');
    if(!savedFood || savedFood.length===0){
        return res.status(404).json({message: "No saved foods found"});

    }

    res.status(200).json({
        message:"saved foods retrieved successfully",
        savedFood
    });

}


module.exports={
    addFoodItem,
    getFoodItems,
    likeFood, 
    savefood,
    getSaveFood
}  