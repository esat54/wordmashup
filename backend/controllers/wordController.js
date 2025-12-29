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
        const { limit = 20, type, favoriteFilter, search } = req.query;
        const userId = req.userId;

        let limitNum = 20;
        if (typeof limit === 'string') {
            const parsed = parseInt(limit, 10);
            if (!isNaN(parsed) && parsed > 0) {
                limitNum = parsed;
            }
        }

        let filterConditions = [{ addedBy: userId }];

        if (type && type !== "") {
            filterConditions.push({ type: type });
        }

        if (favoriteFilter === "true") {
            filterConditions.push({ favorite: true });
        } else if (favoriteFilter === "false") {
            filterConditions.push({ favorite: false });
        }

        if (search && search.toString().trim() !== "") {
            const searchTerm = search.toString().trim();
            filterConditions.push({
                $or: [
                    { text: { $regex: searchTerm, $options: "i" } },
                    { translation: { $regex: searchTerm, $options: "i" } }
                ]
            });
        }

        const queryFilter = filterConditions.length > 1
            ? { $and: filterConditions }
            : filterConditions[0];

        const words = await Word.find(queryFilter)
            .sort({ createdAt: -1 })
            .limit(limitNum);

        const totalWords = await Word.countDocuments({ addedBy: userId });
        const favoriteWords = await Word.countDocuments({ addedBy: userId, favorite: true });

        res.status(200).json({
            words,
            totalWords,
            favoriteWords
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
}


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