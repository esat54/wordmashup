const Word = require('../models/wordModel');

exports.addWord = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('User ID:', req.userId);

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

