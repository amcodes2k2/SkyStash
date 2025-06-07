const mongoose = require("mongoose");
const imagekit = require("../config/ImageKit.js");

const userModel = require("../models/user.js");
const fileModel = require("../models/file.js");

async function fileUpload(req, res)
{
    try
    {
        const user = req.user;
        const file = (req.files) ? Object.values(req.files)[0] : null;
        const parentId = (req.body?.parentId && req.body.parentId !== "null") ? req.body.parentId : null;
        
        if(!file)
        {
            return res.status(400).json({
                success: false,
                message: "File is missing."
            });
        }

        if((Math.round(((file.size) / 1048576) * 100) / 100).toFixed(1) > 4.5)
        {
            return res.status(400).json({
                success: false,
                message: "File size cannot exceed 4.5 MB."
            });
        }

        if(file.mimetype.startsWith("image/") === false && file.mimetype !== "application/pdf")
        {
            return res.status(400).json({
                success: false,
                message: "File must be an image or a pdf."
            });
        }

        if(user.spaceConsumed + (Math.round(((file.size) / 1048576) * 100) / 100).toFixed(1) > 256.0)
        {
            return res.status(400).json({
                success: false,
                message: "Space limit exceeded. Delete some file(s) and try again."
            });
        }

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

        const folderPath = (parentId) ? `/skystash/${user._id}/folder/${parentId}` : `/skystash/${user._id}`;

        const response = await imagekit.upload({
            file: file.data,
            fileName: Date.now() + user._id + "." + file.name.split(".").at(-1),
            folder: folderPath,
            useUniqueFileName: false
        });

        const newFile = {
            name: file.name,
            path: response.filePath,
            size: parseFloat((Math.round(((file.size) / 1048576) * 100) / 100).toFixed(1)),
            userId: user._id,
            parentId: parentId,
            url: response.url,
            type: file.mimetype,
            isFolder: false,
            isStarred: false,
            isTrash: false
        };

        const fileDocument = await fileModel.create(newFile);
        await userModel.findOneAndUpdate({_id: user._id}, {$set: {spaceConsumed: parseFloat((fileDocument.size + user.spaceConsumed).toFixed(10))}});

        res.status(202).json({
            success: true,
            fileDocument: fileDocument,
            message: "File uploaded successfully."
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = fileUpload;