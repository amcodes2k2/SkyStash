const userModel = require("../models/user.js");

async function logout(req, res)
{
    try
    {
        const user = req.user;
        
        await userModel.findOneAndUpdate({_id: user._id}, {$set: {$refreshToken: null}});

        res.status(200).clearCookie("refreshToken").json({
            success: true,
            message: "User logged out successfully."
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

module.exports = logout;