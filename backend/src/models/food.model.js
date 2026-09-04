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
    },
    price:{
        type: Number,
        required: true,
        default: 0
    },
    cuisine: {
        type: String
    }
});
fooditemSchema.index({ name: "text", description: "text", cuisine: "text" });

const FoodItemModel = mongoose.model('fooditem', fooditemSchema);
module.exports = FoodItemModel;