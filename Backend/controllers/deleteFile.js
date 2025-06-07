const mongoose = require("mongoose");

const userModel = require("../models/user.js");
const fileModel = require("../models/file.js");

let deletedSize = 0;

async function helper(userId, fileId)
{
    try
    {
        //fetch the immediate children of the current folder/file
        const childrenDocuments = await fileModel.find({parentId: fileId, userId: userId});

        //delete the children of the current folder/file (if any)
        for(const child of childrenDocuments)
        {
            try
            {
                //if child is a folder, recursively call delete on the child. Otherwise, delete it directly.
                if(child.isFolder === true)
                {
                    await helper(userId, child._id);
                    continue;
                }
                else
                {
                    const deletedDocument = await fileModel.findOneAndDelete({_id: child._id, userId: userId});
                    deletedSize = parseFloat((((deletedSize * 10) + (deletedDocument.size * 10)) / 10).toFixed(10));
                }
            }
            catch(error)
            {
                console.log(error);
                throw error;
            }
        }
        
        //delete folder/file after its children have been deleted in the previous step
        const deletedDocument = await fileModel.findOneAndDelete({_id: fileId, userId: userId});
        deletedSize = parseFloat((((deletedSize * 10) + (deletedDocument.size * 10)) / 10).toFixed(10));
    }
    catch(error)
    {
        console.log(error);
        throw error;
    }
}

async function deleteFile(req, res)
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

        deletedSize = 0;
        await helper(user._id, fileDocument._id);
        await userModel.findOneAndUpdate({_id: user._id}, {$set: {spaceConsumed: parseFloat((((user.spaceConsumed * 10) - (deletedSize * 10)) / 10).toFixed(10))}});

        res.status(200).json({
            success: true,
            deletedSize: deletedSize,
            message: "File/Folder has been deleted."
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

module.exports = deleteFile;