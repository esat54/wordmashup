const Word = require('../models/wordModel');

exports.addWord = async (req, res) => {
    try {
        const { text, translation, exampleSentence, sentenceTranslation, type } = req.body;

        // Validation
        if (!text || !translation || !exampleSentence || !sentenceTranslation || !type) {
            return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
        }

        const word = new Word({ text, translation, exampleSentence, sentenceTranslation, type, addedBy: req.userId });
        await word.save();

        res.status(201).json({
            message: 'Kelime başarıyla eklendi',
            word
        });
    } catch (error) {
        console.error('Kelime ekleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};


exports.getWords = async (req, res) => {
    try {
        const { limit = 20, skip = 0, type, favoriteFilter, unknownFilter, search } = req.query;
        const userId = req.userId;

        let limitNum = 20;
        if (!isNaN(parseInt(limit))) {
            limitNum = parseInt(limit);
        }

        let skipNum = 0;
        if (!isNaN(parseInt(skip))) {
            skipNum = parseInt(skip);
        }

        const filterConditions = [{ addedBy: userId }];

        if (type && type !== "") {
            filterConditions.push({ type });
        }

        if (favoriteFilter === "true") {
            filterConditions.push({ favorite: true });
        } else if (favoriteFilter === "false") {
            filterConditions.push({ favorite: false });
        }

        if (unknownFilter === "true") {
            filterConditions.push({ isUnknown: true });
        }

        if (search && search.trim() !== "") {
            filterConditions.push({
                $or: [
                    { text: { $regex: search, $options: "i" } },
                    { translation: { $regex: search, $options: "i" } },
                ],
            });
        }

        const query =
            filterConditions.length > 1 ? { $and: filterConditions } : filterConditions[0];

        const words = await Word.find(query)
            .sort({ createdAt: -1 })
            .skip(skipNum)
            .limit(limitNum);

        const totalWords = await Word.countDocuments({ addedBy: userId });
        const favoriteWords = await Word.countDocuments({ addedBy: userId, favorite: true });
        const unknownWords = await Word.countDocuments({ addedBy: userId, isUnknown: true });

        res.status(200).json({
            words,
            totalWords,
            favoriteWords,
            unknownWords,
        });
    } catch (error) {
        console.error("getWords error:", error);
        res.status(500).json({ message: "Kelimeler getirilirken hata oluştu" });
    }
};


exports.addtoFavorites = async (req, res) => {
    try {
        const wordId = req.params.wordId;
        const word = await Word.findById(wordId);
        if (!word) {
            return res.status(404).json({ message: 'Kelime bulunamadı' });
        }
        word.favorite = !word.favorite;
        await word.save();
        res.status(200).json({ word });
    } catch (error) {
        console.error('Kelime getirme hatası:', error);
    }
};


exports.addtoUnknown = async (req, res) => {
    try {
        const { wordId } = req.params;

        const word = await Word.findById(wordId);
        if (!word) {
            return res.status(404).json({ message: "Kelime bulunamadı" });
        }

        word.isUnknown = !word.isUnknown;
        await word.save();

        res.status(200).json({
            isUnknown: word.isUnknown,
            word,
        });
    } catch (error) {
        console.error("Unknown toggle hatası:", error);
        res.status(500).json({ message: "Bilinmeyen durumu değiştirilemedi" });
    }
};


exports.deleteWord = async (req, res) => {
    try {
        const wordId = req.params.wordId;
        const word = await Word.findByIdAndDelete(wordId);

        if (!word) {
            return res.status(404).json({ message: 'Kelime bulunamadı' });
        }

        return res.status(200).json({
            message: 'Kelime başarıyla silindi'
        });
    } catch (error) {
        console.error('Kelime silme hatası:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
};


exports.updateNote = async (req, res) => {
    try {
        const { wordId } = req.params;
        const { note } = req.body;

        const word = await Word.findOneAndUpdate(
            { _id: wordId, addedBy: req.userId },
            { note: note ?? '' },
            { new: true }
        );

        if (!word) {
            return res.status(404).json({ message: 'Kelime bulunamadı' });
        }

        return res.status(200).json({ word });
    } catch (error) {
        console.error('Not güncelleme hatası:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
};


exports.getLast7DaysStats = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const dailyStats = [];
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(sevenDaysAgo);
            currentDate.setDate(currentDate.getDate() + i);
            
            const startOfDay = new Date(currentDate);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(currentDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            const count = await Word.countDocuments({
                addedBy: userId,
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });
            
            const dateStr = currentDate.toLocaleDateString('tr-TR', { 
                day: '2-digit', 
                month: '2-digit' 
            });
            
            dailyStats.push({
                date: dateStr,
                count: count
            });
        }

        res.status(200).json({
            dailyStats
        });
    } catch (error) {
        console.error("getLast7DaysStats error:", error);
        res.status(500).json({ message: "İstatistikler getirilirken hata oluştu" });
    }
};


exports.getTypeStats = async (req, res) => {
    try {
        const userId = req.userId;
        
        const types = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'other'];
        
        const typeNames = {
            'noun': 'İsim',
            'verb': 'Fiil',
            'adjective': 'Sıfat',
            'adverb': 'Zarf',
            'preposition': 'Edat',
            'conjunction': 'Bağlaç',
            'pronoun': 'Zamir',
            'other': 'Diğer'
        };
        
        const typeStats = [];
        let totalWords = 0;
        
        for (const type of types) {
            const count = await Word.countDocuments({
                addedBy: userId,
                type: type
            });
            
            if (count > 0) {
                typeStats.push({
                    type: type,
                    name: typeNames[type],
                    count: count
                });
                totalWords += count;
            }
        }

        res.status(200).json({
            typeStats,
            totalWords
        });
    } catch (error) {
        console.error("getTypeStats error:", error);
        res.status(500).json({ message: "Tür istatistikleri getirilirken hata oluştu" });
    }
};


exports.getStreak = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let streak = 0;
        let currentDate = new Date(today);
        
        while (true) {
            const startOfDay = new Date(currentDate);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(currentDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            const count = await Word.countDocuments({
                addedBy: userId,
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });
            
            if (count > 0) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        res.status(200).json({
            streak
        });
    } catch (error) {
        console.error("getStreak error:", error);
        res.status(500).json({ message: "Seri hesaplanırken hata oluştu" });
    }
};