const phraseModel = require('../models/phraseModel');

exports.getAllPhrases = async (req, res) => {
    try {
        // Only admin can access
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden', message: 'Sadece admin erişebilir' });
        }
        const phrases = await phraseModel.getAllPhrases();
        res.json({ phrases, count: phrases.length });
    } catch (error) {
        console.error('Get phrases error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

exports.createPhrase = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden', message: 'Sadece admin erişebilir' });
        }
        const { question, answer, note, tags } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ error: 'Validation Error', message: 'Soru ve cevap zorunludur' });
        }
        const phrase = await phraseModel.createPhrase({ question, answer, note, tags });
        res.status(201).json({ phrase });
    } catch (error) {
        console.error('Create phrase error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

exports.updatePhrase = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden', message: 'Sadece admin erişebilir' });
        }
        const { id } = req.params;
        const { question, answer, note, tags } = req.body;
        const phrase = await phraseModel.updatePhrase(id, { question, answer, note, tags });
        if (!phrase) {
            return res.status(404).json({ error: 'Not Found', message: 'Kalıp bulunamadı' });
        }
        res.json({ phrase });
    } catch (error) {
        console.error('Update phrase error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

exports.deletePhrase = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden', message: 'Sadece admin erişebilir' });
        }
        const { id } = req.params;
        const phrase = await phraseModel.deletePhrase(id);
        if (!phrase) {
            return res.status(404).json({ error: 'Not Found', message: 'Kalıp bulunamadı' });
        }
        res.json({ message: 'Kalıp silindi' });
    } catch (error) {
        console.error('Delete phrase error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
