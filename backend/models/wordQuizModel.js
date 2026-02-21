const mongoose = require('mongoose');

const wordQuizSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        trim: true,
    },
    translation: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: String,
        required: true,
        enum: ['Basic', 'Intermediate', 'Advanced'],
        default: 'Basic'
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['Software', 'Technology', 'Sport', 'Business', 'Lifestyle', 'Travel', 'Other'],
        default: 'Other'
    },
    type: {
        type: String,
        required: true,
        enum: ['Noun', 'Verb', 'Adjective', 'Adverb', 'Other'],
        default: 'Other'
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

wordQuizSchema.index({ level: 1, category: 1, type: 1 });

const WordQuiz = mongoose.model('WordQuiz', wordQuizSchema);

module.exports = WordQuiz;