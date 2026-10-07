const OxfordWord = require('../models/OxfordWord');
const OxfordUserProgress = require('../models/OxfordUserProgress');
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.getWordAiSummary = async (req, res) => {
    try {
        const { wordId } = req.params;

        const word = await OxfordWord.findById(wordId);
        if (!word) {
            return res.status(404).json({ message: 'Kelime bulunamadı' });
        }

        if (word.aiSummary) {
            return res.status(200).json(word.aiSummary);
        }

        const genAI = new GoogleGenerativeAI(process.env.OXFORD_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.2,
            }
        });

        const prompt = `Analyze the English word "${word.word}" (Turkish meaning: "${word.translation}").
Return ONLY a valid JSON object. No markdown, no code blocks, no extra text.

Format:
{
  "wordType": "word type in Turkish (e.g. sıfat, isim, fiil, phrasal verb, edat, zarf, bağlaç)",
  "summary": "Short Turkish explanation of the word's core meaning and nuance (2-3 sentences max).",
  "ipa": "/phonetic transcription/",
  "isMostCommon": true or false (is this word the most natural/common choice for this meaning in English?),
  "commonUsageNotes": "Turkish explanation about whether this word is the most common for this meaning, its register (formal/informal/neutral), and any important usage tips.",
  "alternatives": ["alternative1", "alternative2", "alternative3"],
  "examples": [
    {"en": "Medium length B1-B2 level English sentence using '${word.word}'.", "tr": "Turkish translation of that sentence."},
    {"en": "Another B1-B2 level English sentence.", "tr": "Turkish translation."},
    {"en": "Third B1-B2 level English sentence.", "tr": "Turkish translation."}
  ]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("AI JSON parse hatası:", e.message, "Ham yanıt:", text);
            return res.status(500).json({ message: "AI yanıtı işlenirken hata oluştu." });
        }

        // Cache the result in DB
        await OxfordWord.findByIdAndUpdate(wordId, { aiSummary: data });

        return res.status(200).json(data);

    } catch (error) {
        console.error("getWordAiSummary error:", error.message);
        const isQuota = error.message && error.message.includes('429');
        res.status(500).json({
            message: isQuota
                ? "AI şu an yoğun, lütfen birkaç saniye bekleyip tekrar deneyin."
                : "AI özeti alınırken hata oluştu."
        });
    }
};

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
        }).sort({ word: 1 }).lean();

        const wordIds = words.map(w => w._id);
        const userProgress = await OxfordUserProgress.find({
            userId: userId,
            oxfordWordId: { $in: wordIds }
        }).lean();

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
                ...word,
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

exports.getStats = async (req, res) => {
    try {
        const userId = req.userId;

        const [totalWords, learning, mastered] = await Promise.all([
            OxfordWord.countDocuments(),
            OxfordUserProgress.countDocuments({ userId, status: 'learning' }),
            OxfordUserProgress.countDocuments({ userId, status: 'mastered' }),
        ]);

        res.status(200).json({ totalWords, learning, mastered });
    } catch (error) {
        console.error("getStats error:", error);
        res.status(500).json({ message: "İstatistikler getirilirken hata oluştu" });
    }
};
