const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userModel = require("../models/user.js");

async function verifyOTP(req, res)
{
    try
    {
        const {user_id, OTP, type} = req.body;

        if(OTP.trim() === "")
        {
            return res.status(400).json({
                success: false,
                message: "All fields must be filled."
            });
        }

        if(!mongoose.Types.ObjectId.isValid(user_id))
        {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }        

        const userDocument = await userModel.findOne({_id: user_id});

        if(!userDocument)
        {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if(type === "signup" && userDocument.isVerified === true)
        {
            return res.status(400).json({
                success: false,
                message: "User is already verified."
            });
        }

        const isOTPCorrect = await bcrypt.compare(OTP, userDocument.OTP);

        if(!isOTPCorrect)
        {
            return res.status(401).json({
                success: false,
                message: "Incorrect OTP."
            });
        }

        if(Date.now() > userDocument.OTPExpiry)
        {
            return res.status(401).json({
                success: false,
                message: "OTP has expired."
            });
        }

        if(type === "signup")
        {
            await userModel.findOneAndUpdate({_id: user_id}, {$set: {isVerified: true}});

            await userModel.findOneAndUpdate({_id: user_id}, {$set: {OTP: null}});
            await userModel.findOneAndUpdate({_id: user_id}, {$set: {OTPExpiry: null}});

            return res.status(200).json({
                success: true,
                message: "Email verified successfully."
            });
        }
            
        if(type === "reset-password")
        {
            const resetPasswordToken = await bcrypt.hash(user_id, 10);
            const resetPasswordTokenExpiry = Date.now() + 10 * 60 * 1000;

            await userModel.findOneAndUpdate({_id: user_id}, {$set: {resetPasswordToken: resetPasswordToken}});
            await userModel.findOneAndUpdate({_id: user_id}, {$set: {resetPasswordTokenExpiry: resetPasswordTokenExpiry}});

            await userModel.findOneAndUpdate({_id: user_id}, {$set: {OTP: null}});
            await userModel.findOneAndUpdate({_id: user_id}, {$set: {OTPExpiry: null}});

            return res.status(200).json({
                success: true,
                resetPasswordToken: resetPasswordToken,
                message: "Email verified successfully."
            });
        }
    }   
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = verifyOTP;