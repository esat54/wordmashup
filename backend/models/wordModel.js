const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    translation: {
        type: String,
        required: true,
        trim: true
    },
    exampleSentence: {
        type: String,
        required: true,
        trim: true
    },
    sentenceTranslation: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'other'],
        trim: true
    },
    favorite: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
