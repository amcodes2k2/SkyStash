const fileModel = require("../models/file.js");

async function getTrashed(req, res)
{
    try
    {
        const user = req.user;

        const contents = await fileModel.find({userId: user._id, isTrash: true});

        res.status(200).json({
            success: true,
            contents: contents,
            message: "Contents have been returned."
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

module.exports = getTrashed;