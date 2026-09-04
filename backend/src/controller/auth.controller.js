const userModel=require('../models/user.model'); 
const FoodPartnerModel=require('../models/food-partner.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
async function registerUser(req,res) {
    const    {FullName,email,password,Phone,Address}=req.body;
    const userExists=await userModel.findOne({email});
    if(userExists){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user= await userModel.create({
        FullName,
        email,
        password:hashedPassword,
        Phone,
        Address
    });
    const token=jwt.sign({
        id:user._id,
        }, process.env.JWT_SECRET)
        res.cookie("token",token)
        res.status(201).json({message:"User registered successfully",
        user:{
            id:user._id,
            FullName:user.FullName,
            email:user.email,
            Phone:user.Phone,
            Address:user.Address
        }
    });
}
/*async function loginUser(req,res){
    const {email,password}=req.body;
    const user=await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid email or password"});
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid email or password"});
    }
    const token=jwt.sign({
        id:user._id,
        }, process.env.JWT_SECRET)  
    res.cookie("token",token);
    res.status(200).json({message:"User logged in successfully",
        user:{
            id:user._id,
            FullName:user.FullName,
            email:user.email
        }
    });
}*/
async function loginUser(req, res) {
    console.log("1️⃣ LOGIN CONTROLLER HIT");

    console.log("2️⃣ BODY:", req.body);

    const { email, password } = req.body;

    console.log("3️⃣ BEFORE FINDONE");

    const user = await userModel.findOne({ email });

    console.log("4️⃣ AFTER FINDONE:", user ? "USER FOUND" : "USER NOT FOUND");

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    console.log("5️⃣ BEFORE BCRYPT");

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("6️⃣ AFTER BCRYPT:", isMatch);

    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    console.log("7️⃣ BEFORE JWT");

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
    );

    console.log("8️⃣ JWT CREATED");

    res.cookie("token", token, {
        httpOnly: true
    });

    console.log("9️⃣ RESPONSE SENT");

    return res.status(200).json({
        message: "Login successful",
        token
    });
}

function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({message:"User logged out successfully"});
}

async function registerFoodPartner(req,res) {
    const    {name,email,password,Phone,Address}=req.body;
    const partnerExists=await FoodPartnerModel.findOne({email});
    if(partnerExists){
        return res.status(400).json({message:"Food partner already exists"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const partner= await FoodPartnerModel.create({
        name,
        email,
        password:hashedPassword,
        Phone,
        Address
    });
    const token=jwt.sign({
        id:partner._id,
        }, process.env.JWT_SECRET)
        res.cookie("token",token)
        res.status(201).json({message:"Food partner registered successfully",
        partner:{
            id:partner._id,
            name:partner.name,
            email:partner.email,
            Phone:partner.Phone,
            Address:partner.Address
        }
    });

}

async function loginFoodPartner(req,res){
    const {email,password}=req.body;
    const partner=await FoodPartnerModel.findOne({email});
    if(!partner){
        return res.status(400).json({message:"Invalid email or password"});
    }
    const isPasswordValid=await bcrypt.compare(password,partner.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid email or password"});
    }
    const token=jwt.sign({
        id:partner._id,
        }, process.env.JWT_SECRET)  
    res.cookie("token",token);
    res.status(200).json({message:"Food partner logged in successfully",
        partner:{
            id:partner._id,
            name:partner.name,
            email:partner.email
        }
    });
}


function logoutFoodPartner(req,res){
    res.clearCookie("token");
    res.status(200).json({message:"Food partner logged out successfully"});
}
module.exports={
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};