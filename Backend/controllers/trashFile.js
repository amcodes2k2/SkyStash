const mongoose = require("mongoose");
const fileModel = require("../models/file.js");

async function trashFile(req, res)
{
    try
    {
        const user = req.user;
        const fileId = req.params.fileId;

        if(!mongoose.Types.ObjectId.isValid(fileId))
        {
            return res.status(404).json({
                success: false,
                message: "File/Folder not found."
            });
        }

        const fileDocument = await fileModel.findOne({_id: fileId, userId: user._id});

        if(!fileDocument)
        {
            return res.status(404).json({
                success: false,
                message: "File/Folder not found."
            });
        }

        const updatedFileDocument = await fileModel.findOneAndUpdate({_id: fileDocument._id}, {$set: {isTrash: !fileDocument.isTrash}}, {new: true});

        res.status(200).json({
            success: true,
            updatedFileDocument: updatedFileDocument,
            message: "File/Folder trash status has been updated."
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

module.exports = trashFile;