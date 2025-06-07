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
                    deletedSize = parseFloat((deletedSize + deletedDocument.size).toFixed(10));
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
        deletedSize = parseFloat((deletedSize + deletedDocument.size).toFixed(10));    
    }
    catch(error)
    {
        console.log(error);
        throw error;
    }
}

async function emptyTrash(req, res)
{
    try
    {
        const user = req.user;

        const trashedDocuments = await fileModel.find({userId: user._id, isTrash: true});

        for(const trashedDocument of trashedDocuments)
            await helper(user._id, trashedDocument._id);

        
        await userModel.findOneAndUpdate({_id: user._id}, {$set: {spaceConsumed: parseFloat((user.spaceConsumed - deletedSize).toFixed(10))}});

        res.status(200).json({
            success: true,
            deletedSize: deletedSize,
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