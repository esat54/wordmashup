const wordModel = require('../models/wordModel');

exports.getWords = async (req, res) => {
    try {
        const userId = req.session.userId;

        let allWords = [];
        let dailyWords = [];
        let user = null;


        if (userId) {
            allWords = await wordModel.getWordsByUserId(userId);
            dailyWords = await wordModel.getDailyWordsByUserId(userId);
            user = {
                id: req.session.userId,
                username: req.session.username,
                createdDate: req.session.createdDate
            };
        }

        res.render('wordpage', { allWords, dailyWords, user });

    } catch (error) {
        console.error(error);
        res.status(500).send('Sunucu hatası');
    }
};




exports.postWords = async (req, res) => {
    try {
        const { word, meaning, note } = req.body;
        console.log(req.body);

        const userId = req.session.userId;

        if (!userId) {
            req.session.message = "İlk olarak giriş yapmalısınız";
            return res.redirect('/login');
        }

        const wordcount = await wordModel.getTodayWordCount(userId);
        if (wordcount >= 10) {
            return res.status(400).send('Günlük 10 kelime sınırına ulaştınız.');
        }


        if (!word || !meaning) {
            return res.status(400).send('Kelime ve anlam alanları zorunludur.');
        }
        
        const newword = await wordModel.createWord({ word, meaning, note, userId })
        console.log('Yeni kelime eklendi:', newword);

        res.redirect('words');

    } catch (err) {
        console.log(err)
    }
};


exports.deleteWords = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).send('Giriş yapmalısınız.');
        }

        const { id } = req.params;

        await wordModel.deleteWord(id, userId);
        console.log(`Kelime silindi: ${id}`);

        res.redirect('/words');

    } catch (err) {
        console.error("Kelime silme hatası:", err);
        res.status(500).send('Sunucu hatası');
    }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).send('Giriş yapmalısınız.');
        }

        const { id } = req.params;

        await wordModel.toggleFavorite(id, userId);
        console.log(`Kelime favori durumu değiştirildi: ${id}`);

        res.redirect('/words');

    } catch (err) {
        console.error("Favori durumu değiştirme hatası:", err);
        res.status(500).send('Sunucu hatası');
    }
};