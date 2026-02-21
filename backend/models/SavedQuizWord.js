const mongoose = require('mongoose');

const savedQuizWordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    word: {
        type: String,
        required: true,
        trim: true
    },
    translation: {
        type: String,
        required: true,
        trim: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

savedQuizWordSchema.index({ userId: 1, word: 1 }, { unique: true });

const SavedQuizWord = mongoose.model('SavedQuizWord', savedQuizWordSchema);

module.exports = SavedQuizWord;
