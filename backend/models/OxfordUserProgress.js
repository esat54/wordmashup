const mongoose = require("mongoose");

const OxfordUserProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    oxfordWordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OxfordWord",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["new", "learning", "mastered"],
        default: "new"
    },
    userNotes: {
        type: String,
        default: ""
    }
}, { 
    timestamps: true 
});

OxfordUserProgressSchema.index({ userId: 1, oxfordWordId: 1 }, { unique: true });

module.exports = mongoose.model("OxfordUserProgress", OxfordUserProgressSchema);