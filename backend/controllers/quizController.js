const Word = require('../models/wordModel');
const SavedQuizWord = require('../models/SavedQuizWord');
const WordQuiz = require('../models/wordQuizModel');
const mongoose = require('mongoose');

exports.getUserQuizWords = async (req, res) => {
    try {
        const userId = req.userId;
        const words = await Word.aggregate([
            { $match: { addedBy: new mongoose.Types.ObjectId(userId) } },
            { $sample: { size: 100 } },
            { $project: { text: 1, translation: 1 } }
        ]);
        res.status(200).json(words)
    } catch (error) {
        console.error("getWords error:", error);
        res.status(500).json({ message: "Kelimeler getirilirken hata oluştu" });
    }
}

exports.getGlobalWords = async (req, res) => {
    try {
        const { level, category, type } = req.query;
        const match = {};

        if (level) match.level = level;
        if (category) match.category = category;
        if (type) match.type = type;

        const words = await WordQuiz.aggregate([
            { $match: match },
            { $project: { word: 1, translation: 1, level: 1, category: 1, type: 1 } }
        ]);
        res.status(200).json(words);
    } catch (error) {
        console.error("getGlobalWords error:", error);
        res.status(500).json({ message: "Global kelimeler getirilirken hata oluştu" });
    }
}

exports.saveQuizWord = async (req, res) => {
    try {
        const userId = req.userId;
        const { word, translation } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Giriş yapmalısınız' });
        }
        if (!word || !translation) {
            return res.status(400).json({ message: 'Kelime ve çeviri gereklidir' });
        }

        // same word cant be saved
        const existing = await SavedQuizWord.findOne({ userId, word });
        if (existing) {
            return res.status(409).json({ message: 'Bu kelime zaten kaydedilmiş' });
        }

        const savedWord = new SavedQuizWord({ userId, word, translation });
        await savedWord.save();

        res.status(201).json({
            message: 'Kelime başarıyla kaydedildi',
            word: savedWord
        });
    } catch (error) {
        console.error('Kelime kaydetme hatası:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Bu kelime zaten kaydedilmiş' });
        }
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

