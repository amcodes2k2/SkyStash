const fileModel = require("../models/file.js");

async function helper(userId, fileId)
{
    try
    {
        //fetch the immediate children of the current folder/file
        const childrenDocuments = await fileModel.find({parentId: fileId, userId: userId});

        //delete the children of the current folder/file (if any)
        childrenDocuments.forEach(async function(child){
            //if child is a folder, recursively call delete on the child. Otherwise, delete it directly.
            if(child.isFolder === true)
                await helper(userId, child._id);
            else
                await fileModel.findOneAndDelete({_id: child._id, userId: userId});
        });
        
        //delete folder/file after its children have been deleted in the previous step
        await fileModel.findOneAndDelete({_id: fileId, userId: userId});
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function emptyTrash(req, res)
{
    try
    {
        const user = req.user;

        const trashedDocuments = await fileModel.find({userId: user._id, isTrash: true});

        trashedDocuments.forEach(async function(trashedDocument){
            await helper(user._id, trashedDocument._id);
        });

        res.status(200).json({
            success: true,
            message: "Bin has been cleared."
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

module.exports = emptyTrash;