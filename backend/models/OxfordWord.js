const mongoose = require("mongoose");

const OxfordWordSchema = new mongoose.Schema({
    externalId: { type: Number },
    categoryId: { type: Number },
    word: { type: String, required: true },
    translation: { type: String, required: true },
    level: { type: String, default: "Unknown" },
}, { timestamps: true });

module.exports = mongoose.model("OxfordWord", OxfordWordSchema);