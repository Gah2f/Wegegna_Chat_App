import cloudinary from "../configs/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  const { fullName, password, email, bio } = req.body;
  try {
    if ((!fullName, !email, !bio, !password)) {
      return res.json({ success: false, message: "Missing Details" });

      const user = await User.findOne({ email });
      if (user) {
        return res.json({ success: false, message: "Account already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        bio,
      });

      const token = generateToken(newUser._id);
      res.json({
        success: true,
        userData: newUser,
        token,
        message: "Account created successfully",
      });
    }
  } catch (error) {
    res.json({ success: false, message: "Error occured while sign up" });
    console.log(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    const isPassword = await bcrypt.compare(password, userData.password);

    if (!isPassword) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);

    res.json({ success: true, userData, token, message: "Login successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error.message);
  }
};

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilePicture) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePicture);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: upload.secure_url, bio, fullName },
        { new: true }
      ); 

      res.json({success: true, user: updatedUser}) 
    }
  } catch (error) {
    res.json({success: false, message: error.message});
    console.log(error.message)
  }
};
