const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/verifyJWT.js");

const uploadFile = require("../controllers/uploadFile.js");
router.post("/upload-file", verifyJWT, uploadFile);

const createFolder = require("../controllers/createFolder.js");
router.post("/create-folder", verifyJWT, createFolder);

const getContents = require("../controllers/getContents.js");
router.get("/get-contents/:parentId", verifyJWT, getContents);

const trashFile = require("../controllers/trashFile.js");
router.patch("/trash-file/:fileId", verifyJWT, trashFile);

const starFile = require("../controllers/starFile.js");
router.patch("/star-file/:fileId", verifyJWT, starFile);

const deleteFile = require("../controllers/deleteFile.js");
router.delete("/delete-file/:fileId", verifyJWT, deleteFile);

const emptyTrash = require("../controllers/emptyTrash.js");
router.delete("/empty-trash", verifyJWT, emptyTrash);

module.exports = router;