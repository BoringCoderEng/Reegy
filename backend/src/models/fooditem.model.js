const mongoose = require('mongoose');
const fooditemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video:{
        type:String,
        required: true
    },
    description: {
        type: String,
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodpartner'
    },
    likeCount:{
        type: Number,
        default: 0
    }
});
const FoodItemModel = mongoose.model('fooditem', fooditemSchema);
module.exports = FoodItemModel;