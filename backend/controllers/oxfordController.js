const OxfordWord = require('../models/OxfordWord');
const OxfordUserProgress = require('../models/OxfordUserProgress');

exports.getWordsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const userId = req.userId;
        
        if (!categoryId) {
            return res.status(400).json({ message: 'categoryId gereklidir' });
        }

        const categoryIdNum = parseInt(categoryId);
        if (isNaN(categoryIdNum) || categoryIdNum < 1 || categoryIdNum > 26) {
            return res.status(400).json({ message: 'Geçersiz categoryId' });
        }

        const targetLetter = String.fromCharCode(64 + categoryIdNum); 
        
        const words = await OxfordWord.find({
            word: { $regex: `^${targetLetter}`, $options: 'i' }
        }).sort({ word: 1 }); 

        const wordIds = words.map(w => w._id);
        const userProgress = await OxfordUserProgress.find({
            userId: userId,
            oxfordWordId: { $in: wordIds }
        });

        const progressMap = {};
        userProgress.forEach(p => {
            progressMap[p.oxfordWordId.toString()] = {
                status: p.status,
                userNotes: p.userNotes
            };
        });

        const wordsWithProgress = words.map(word => {
            const progress = progressMap[word._id.toString()] || {
                status: 'new',
                userNotes: ''
            };
            return {
                ...word.toObject(),
                status: progress.status,
                userNotes: progress.userNotes
            };
        });

        res.status(200).json({
            words: wordsWithProgress,
            count: wordsWithProgress.length,
        });
    } catch (error) {
        console.error("getWordsByCategory error:", error);
        res.status(500).json({ message: "Kelimeler getirilirken hata oluştu" });
    }
};

exports.updateWordNote = async (req, res) => {
    try {
        const { wordId } = req.params;
        const { userNotes } = req.body;
        const userId = req.userId;

        if (userNotes === undefined) {
            return res.status(400).json({ message: 'userNotes gereklidir' });
        }

        const word = await OxfordWord.findById(wordId);
        if (!word) {
            return res.status(404).json({ message: 'Kelime bulunamadı' });
        }

        let progress = await OxfordUserProgress.findOne({
            userId: userId,
            oxfordWordId: wordId
        });

        if (!progress) {
            progress = new OxfordUserProgress({
                userId: userId,
                oxfordWordId: wordId,
                status: 'new',
                userNotes: userNotes || ''
            });
        } else {
            progress.userNotes = userNotes || '';
        }

        await progress.save();

        res.status(200).json({
            message: 'Not güncellendi',
            word: {
                ...word.toObject(),
                status: progress.status,
                userNotes: progress.userNotes
            },
        });
    } catch (error) {
        console.error("updateWordNote error:", error);
        res.status(500).json({ message: "Not güncellenirken hata oluştu" });
    }
};

exports.updateWordStatus = async (req, res) => {
    try {
        const { wordId } = req.params;
        const { status } = req.body;
        const userId = req.userId;

        if (!status || !['new', 'learning', 'mastered'].includes(status)) {
            return res.status(400).json({ message: 'Geçersiz durum değeri' });
        }

        const word = await OxfordWord.findById(wordId);
        if (!word) {
            return res.status(404).json({ message: 'Kelime bulunamadı' });
        }

        let progress = await OxfordUserProgress.findOne({
            userId: userId,
            oxfordWordId: wordId
        });

        if (!progress) {
            progress = new OxfordUserProgress({
                userId: userId,
                oxfordWordId: wordId,
                status: status,
                userNotes: ''
            });
        } else {
            progress.status = status;
        }

        await progress.save();

        res.status(200).json({
            message: 'Durum güncellendi',
            word: {
                ...word.toObject(),
                status: progress.status,
                userNotes: progress.userNotes
            },
        });
    } catch (error) {
        console.error("updateWordStatus error:", error);
        res.status(500).json({ message: "Durum güncellenirken hata oluştu" });
    }
};

