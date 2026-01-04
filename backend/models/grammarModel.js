const mongoose = require("mongoose");

const GrammarSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    formalityBadge: {
        type: String,
        default: ""
    },
    formula: {
        type: String,
        default: ""
    },
    rules: {
        type: String,
        default: ""
    },
    notes: {
        type: String,
        default: ""
    },
    examples: [{
        en: { type: String, default: "" },
        tr: { type: String, default: "" }
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Grammar", GrammarSchema);

