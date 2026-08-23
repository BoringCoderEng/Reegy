const foodpartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/fooditem.model');

async function getFoodPartnerById(req, res) {
    const foodPartnerId= req.params.id;
    const foodPartner = await foodpartnerModel.findById(foodPartnerId);

    if(!foodPartner){
        return res.status(404).json({message: "Food Partner not found"});
    }
    const foodItems = await foodModel.find({ foodPartner: foodPartnerId });

    res.status(200).json({
        message: "Food Partner retrieved successfully",
        foodPartner,
        foodItems
    });
}

module.exports = { getFoodPartnerById };