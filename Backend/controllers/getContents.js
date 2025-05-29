const mongoose = require("mongoose");
const fileModel = require("../models/file.js");

async function getContents(req, res)
{
    try
    {
        const user = req.user;
        const parentId = (req.params.parentId !== "null") ? req.params.parentId : null;

        if(parentId)
        {
            if(!mongoose.Types.ObjectId.isValid(parentId))
            {
                return res.status(404).json({
                    success: false,
                    message: "Folder not found."
                });
            }

            const folderDocument = await fileModel.findOne({_id: parentId});

            if(!folderDocument || !folderDocument.isFolder)
            {
                return res.status(404).json({
                    success: false,
                    message: "Folder does not exist."
                });
            }

            if(folderDocument.userId.toString() !== user._id.toString())
            {
                return res.status(400).json({
                    success: false,
                    message: "Folder does not belong to the user."
                });
            }
        }

        const contents = await fileModel.find({parentId: parentId, userId: user._id});

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

module.exports = getContents;