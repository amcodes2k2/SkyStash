const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    spaceConsumed: {
        type: Number,
        default: 0.0,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    refreshToken: {
        type: String
    },
    OTP: {
        type: String
    },
    OTPExpiry: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpiry: {
        type: Date
    }
});

module.exports = mongoose.model("user", userSchema);