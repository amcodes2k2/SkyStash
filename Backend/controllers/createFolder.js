const mongoose = require("mongoose");
const fileModel = require("../models/file.js");

async function folderCreation(req, res)
{
    try
    {
        const user = req.user;
        const parentId = (req.body?.parentId) ? req.body.parentId : null;
        let folderName = (req.body?.folderName) ? req.body.folderName : null;
        
        if(!folderName || folderName.trim() === "")
        {
            return res.status(400).json({
                success: false,
                message: "Folder name cannot be empty."
            });
        }
        folderName = folderName.trim();

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

        const newFolderId = new mongoose.Types.ObjectId();

        const newFolder = {
            _id: newFolderId,
            name: folderName,
            path: `/skystash/${user._id}/folder/${newFolderId}`,
            size: 0,
            userId: user._id,
            parentId: parentId,
            url: "",
            type: "Folder",
            isFolder: true,
            isStarred: false,
            isTrash: false
        };

        const folderDocument = await fileModel.create(newFolder);

        res.status(202).json({
            success: true,
            folderDocument: folderDocument,
            message: "Folder created successfully."
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

module.exports = folderCreation;