const fileModel = require("../models/file.js");

async function getStarred(req, res)
{
    try
    {
        const user = req.user;

        const contents = await fileModel.find({userId: user._id, isStarred: true, isTrash: false});

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

module.exports = getStarred;