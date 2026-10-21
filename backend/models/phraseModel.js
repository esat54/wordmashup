const mongoose = require('mongoose');

const phraseSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    note: {
        type: String,
        default: '',
        trim: true
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const Phrase = mongoose.model('Phrase', phraseSchema);

exports.getAllPhrases = async () => {
    return await Phrase.find().sort({ createdAt: -1 });
};

exports.createPhrase = async (data) => {
    const phrase = new Phrase(data);
    await phrase.save();
    return phrase;
};

exports.updatePhrase = async (id, data) => {
    return await Phrase.findByIdAndUpdate(id, data, { new: true });
};

exports.deletePhrase = async (id) => {
    return await Phrase.findByIdAndDelete(id);
};
