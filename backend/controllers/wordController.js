const Word = require('../models/wordModel');

exports.addWord = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { text, translation, exampleSentence, sentenceTranslation, type } = req.body;

        // Validation
        if (!text || !translation || !exampleSentence || !sentenceTranslation || !type) {
            return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
        }

        const word = new Word({
            text,
            translation,
            exampleSentence,
            sentenceTranslation,
            type,
            addedBy: req.userId
        });

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
        const words = await Word.find({ addedBy: req.userId });
        res.status(200).json(words);
    } catch (error) {
        console.error('Kelime getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
}


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