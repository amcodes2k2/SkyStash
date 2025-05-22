require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const userModel = require("../models/user.js");

async function sendOTP(req, res)
{
    try
    {
        const {user_id, email, type} = req.body;

        if(user_id !== undefined && !mongoose.Types.ObjectId.isValid(user_id))
        {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if(email === "")
        {
            return res.status(404).json({
                success: false,
                message: "All fields must be filled."
            });
        }

        const userDocument = await userModel.findOne({$or: [{_id: user_id}, {email: email}]});

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

        const OTP = otpGenerator.generate(6, {
            specialChars: false,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
        });
        
        const hashedOTP = await bcrypt.hash(OTP, 10);
        await userModel.findOneAndUpdate({_id: userDocument._id}, {$set: {OTP: hashedOTP}});
        await userModel.findOneAndUpdate({_id: userDocument._id}, {$set: {OTPExpiry: Date.now() + 10 * 60 * 1000}});

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: "SkyStash",
            to: userDocument.email,
            subject: `${OTP} is your OTP to verify email - SkyStash`,
            text: `Use code ${OTP} to verify your email. This code expires in 10 minutes.`
        });

        res.status(201).json({
            success: true,
            user_id: userDocument._id,
            message: "OTP has been sent successfully."
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = sendOTP;