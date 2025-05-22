const bcrypt = require("bcrypt");
const userModel = require("../models/user.js");

async function resetPassword(req, res)
{
    try
    {
        let {newPassword, confirmPassword, resetPasswordToken} = req.body;

        newPassword = newPassword.trim();
        confirmPassword = confirmPassword.trim();

        if(newPassword === "" || confirmPassword === "")
        {
            return res.status(400).json({
                success: false,
                message: "All fields must be filled."
            });
        }

        if(newPassword !== confirmPassword)
        {
            return res.status(400).json({
                success: false,
                message: "Entered passwords do not match."
            });
        }

        if(newPassword.length < 8)
        {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        const userDocument = await userModel.findOne({resetPasswordToken: resetPasswordToken});

        if(!userDocument)
        {
            return res.status(404).json({
                success: false,
                message: "User does not exist."
            });
        }

        if(Date.now() > userDocument.resetPasswordTokenExpiry)
        {
            return res.status(401).json({
                success: false,
                message: "Reset password token has expired."
            });
        }

        const isNewPasswordSameAsOldPassword = await bcrypt.compare(newPassword, userDocument.password);

        if(isNewPasswordSameAsOldPassword)
        {
            return res.status(400).json({
                success: false,
                message: "New password cannot be same as the old password."
            });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.findOneAndUpdate({_id: userDocument._id}, {$set: {password: newHashedPassword}});

        await userModel.findOneAndUpdate({_id: userDocument._id}, {$set: {resetPasswordToken: null}});
        await userModel.findOneAndUpdate({_id: userDocument._id}, {$set: {resetPasswordTokenExpiry: null}});
        
        res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = resetPassword;