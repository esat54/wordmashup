const mongoose = require("mongoose");

const GrammarUserFavoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    grammarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grammar",
        required: true,
        index: true
    },
    isPinned: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

GrammarUserFavoriteSchema.index({ userId: 1, grammarId: 1 }, { unique: true });

module.exports = mongoose.model("GrammarUserFavorite", GrammarUserFavoriteSchema);