import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req,res,next)=>{
   try {
    const token = req.headers.token;
    console.log("Token rec: ", req.headers.token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID).select("-password");

    if (!user) return res.json({success: false, message: "User not found"})  
     

    req.user = user;
    next();
   } catch (error) {
    res.json({success: false, message: error.message});
    console.log(error.message)
   }
}