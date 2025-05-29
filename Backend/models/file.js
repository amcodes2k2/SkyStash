const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "file",
        default: null
    },
    url: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    isFolder: {
        type: Boolean,
        required: true,
        default: false
    },
    isStarred: {
        type: Boolean,
        required: true,
        default: false
    },
    isTrash: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model("file", fileSchema);