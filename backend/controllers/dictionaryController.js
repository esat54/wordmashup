const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.analyzeWord = async (req, res) => {
  try {
    const { word } = req.body;

    if (!word || word.trim() === "") {
      return res.status(400).json({ message: "Kelime belirtilmedi." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    });

    const prompt = `Analyze the English word "${word}". Return exactly 3 common meanings with Turkish translations.
Return ONLY a valid JSON array. No markdown, no code blocks, no extra text.

Format:
[
  {
    "meaning": "Turkish meaning",
    "type": "noun/verb/etc",
    "ipa": "/phonetic/",
    "examples": [
      {"en": "English example.", "tr": "Turkish translation."},
      {"en": "Second example.", "tr": "Second translation."}
    ]
  }
]

Word: ${word}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log("Gemini'den gelen ham yanıt:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("AI JSON parse hatası:", e.message, "Ham yanıt:", text);
      return res.status(500).json({ message: "AI yanıtı işlenirken hata oluştu." });
    }

    if (!Array.isArray(data) || data.length === 0) {
      console.error("Geçersiz format");
      return res.status(500).json({ message: "Geçersiz format" });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("Gemini API Hatası:", error.message);
    const isQuota = error.message && error.message.includes('429');
    res.status(500).json({
      message: isQuota
        ? "AI şu an yoğun, lütfen birkaç saniye bekleyip tekrar deneyin."
        : "AI yanıtı alınırken hata oluştu."
    });
  }
};