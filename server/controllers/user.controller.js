const User = require('../models/user.models');
const Session= require('../models/session.model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const verifyEmail = require('../services/verifyEmail');
const sendOtpEmail = require('../services/sendOtpemail');
const { get } = require('mongoose');
const { promises } = require('nodemailer/lib/xoauth2');
const { cloudinary } = require('../utils/cloudinary');

const registerUser = async (req, res) => {
   try {

    const { firstName, lastName, email, password } = req.body;

  if (!firstName|| !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (user) {
      return res.status(409).json({ 
        success: false,
        message: "User already exists. Please login." });
  }
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
  });
  const token = jwt.sign({ userId: newUser._id, email }, process.env.JWT_SECRET, { expiresIn: '10m' });
  await verifyEmail(email,token);  // email send for verification
  newUser.token = token;
  await newUser.save();

  return res.status(201).json({ 
    success: true,
    message: "User registered successfully", 
    user: newUser,
  });

   } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server Error", 
      error: error.message,
    });

    
   }
}

const verify = async (req, res) => {
 try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token has expired' });
        }
        res.status(401).json({ 
            success: false,
            message: 'token verification failed' });
        
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
        return res.status(404).json({ 
            success: false,
            message: 'User not found' });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({ 
        success: true,
        message: 'Email verified successfully' });
    } catch (error) {  
    res.status(500).json({ 
        success: false,
        message: 'Server Error',
        error: error.message,
    });
    }

}

const reVerify = async (req, res) => {
 try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ 
            success: false,
            message: 'User not found' });
    }
    const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    await verifyEmail(email, token);
    user.token = token;
    await user.save();
    return res.status(200).json({ 
        success: true,
        message: 'Verification email resent successfully',
        token: user.token,
    });
 } catch (error) {
    res.status(500).json({ 
        success: false,
        message: 'Server Error',
        error: error.message,
    });
}  


}

const login = async (req, res) => {
    // Login functionality to be implemented
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                    message: 'Email and password are required' });
            }
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ 
                    success: false,
                    message: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid credentials' });
                }
                if(existingUser.isVerified === false){
                    return res.status(401).json({ 
                        success: false,
                        message: 'Email not verified' });
                }
                //generate token
                const accessToken= jwt.sign({id:existingUser._id}, process.env.JWT_SECRET,{expiresIn: "10d"})
                const refreshToken= jwt.sign({id:existingUser._id}, process.env.JWT_SECRET,{expiresIn: "10d"})

                existingUser.isLoggedIn = true
                await existingUser.save()

                const existingSession = await Session.findOne({userId:existingUser._id})
                if(existingSession){
                    await Session.deleteOne({userId:existingUser._id})
                }

                await Session.create({userId:existingUser._id})
                return res.status(200).json({
                    success:true,
                    message:`welcome back ${existingUser.firstName}`,
                    user:existingUser,
                    accessToken,
                    refreshToken


                })

        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
}

const logout = async (req,res) =>{
    try {
        const userId = req.id;
        await Session.deleteMany({ userId:userId});
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    user.otp = otp;
    user.otpExpiryTime = otpExpiryTime;
    await user.save();

    console.log(`✅ OTP generated for ${normalizedEmail}: ${otp} (expires at ${otpExpiryTime})`);

    await sendOtpEmail(otp, normalizedEmail);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};




const verifyOTP = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase().trim();
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(`🔍 Verifying OTP for ${email}`);
    // console.log("Stored OTP:", user.otp, "| Received OTP:", otp);
    // console.log("Stored Expiry:", user.otpExpiryTime, "| Current Time:", new Date());

    // ✅ Correct field names
    if (!user.otp || !user.otpExpiryTime) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already used. Please request a new OTP.",
      });
    }

    // ✅ Expiry check
    if (new Date(user.otpExpiryTime) < new Date()) {
      user.otp = null;
      user.otpExpiryTime = null;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // ✅ OTP match check
    if (otp.toString().trim() !== user.otp.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ OTP verified successfully
    user.otp = null;
    user.otpExpiryTime = null;
    user.isVerfied = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("❌ Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



const changePassword = async (req, res) => {
    // Change password functionality to be implemented
    try {
        const { newPassword,confirmPassword } = req.body;
        const email = req.params.email;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' });
        }
        if(!newPassword || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Both fields are required"
            });
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));
        user.password = hashedPassword;
        await user.save();
        
        return res.status(200).json({
            success:true,
            message:"Password changed successfully"
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message,
        });
        
    }
}

const allUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const {userId} = req.params.id;
        const user = await User.findById(userId).select("-password -otp -otpExpiryTime -token");
        if (!user) { 
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}

const updateUser = async (req, res) => {
    try {
      const userIdToUpdate = req.params.id;
      const isLoggedInUser = req.user; //from isauthenticated middleware
      const { firstName, lastName,address, city, zipcode, phoneNo, state, role  } = req.body;

      if (isLoggedInUser._id.toString() !== userIdToUpdate && isLoggedInUser.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to update this user',
        });
      }
      let user = await User.findById(userIdToUpdate);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      let profilePicUrl = user.profilePic;
      let profilePicPublicId = user.profilePicPublicId;
       
      if (req.file) {
        if (profilePicPublicId) {
          // Delete previous image from Cloudinary
          await cloudinary.uploader.destroy(profilePicPublicId);
        }
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'profiles' },
            (error, result) => {  
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          stream.end(req.file.buffer);
        });
        profilePicUrl = uploadResult.secure_url;
        profilePicPublicId = uploadResult.public_id;
      }
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.address = address || user.address;
      user.city = city || user.city;
      user.zipcode = zipcode || user.zipcode;
      user.phoneNo = phoneNo || user.phoneNo;
      user.state = state || user.state;
      user.role = role || user.role;
      user.profilePic = profilePicUrl;
      user.profilePicPublicId = profilePicPublicId;

      const updatedUser = await user.save();
      res.status(200).json({
        success: true,
        message: 'User updated successfully',   
        user: updatedUser,
      });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}

module.exports = {
    registerUser,
    verify,
    reVerify,
    login,
    logout,
    forgotPassword,
    verifyOTP,
    changePassword,
    allUsers,
    getUserById,
    updateUser
}