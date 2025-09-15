const wordModel = require('../models/wordModel');

exports.getWords = async (req, res) => {
    try {
        const userId = req.session.userId;
        const words = await wordModel.getWordsByUserId(userId);

        res.render('wordpage', { words }); // words değişkenini sayfaya gönder

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
            return res.status(400).send('İlk olarak giriş yapmalısınız.');
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

        const { id } = req.params; // URL'den gelen id'yi al
        
        await wordModel.deleteWord(id, userId);
        console.log(`Kelime silindi: ${id}`);

        res.redirect('/words'); // Silme işleminden sonra kelime listesi sayfasına yönlendir

    } catch (err) {
        console.error("Kelime silme hatası:", err);
        res.status(500).send('Sunucu hatası');
    }
};