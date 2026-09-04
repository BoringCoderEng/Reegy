/* const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    Phone:{
        type: String,
        required: true
    },
    Address:{
        type: String,
        required: true
    }
}
,
{
    timestamps: true
})
const userModel = mongoose.model('User', userSchema);
module.exports = userModel; */

const mongoose = require("mongoose");

console.log("user.model.js loaded");

const userSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    Phone: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

console.log("schema created");

const userModel = mongoose.model("User", userSchema);

console.log("User model created");

module.exports = userModel;