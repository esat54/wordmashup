const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const rawData = fs.readFileSync(path.join(__dirname, "../data/wordlist.json"));
const dictionary = JSON.parse(rawData);

async function translateText(text, lang = "TR") {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=EN|${lang}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.responseData.translatedText;
}

exports.postDictionary = async (req, res) => {
  const word = req.body.text?.toUpperCase();
  if (!word || !dictionary[word]) return res.json({});

  const entry = dictionary[word];

  const wordTr = await translateText(word);

  const meanings = [];

  for (const m of entry.MEANINGS) {
    const type = m[0];
    const meaning = m[1];
    const meaningTr = await translateText(meaning);
    meanings.push({ type, meaning, translation: meaningTr });
  }

  const synonyms = [];
  for (const s of entry.SYNONYMS) {
    const tr = await translateText(s);
    synonyms.push({ word: s, translation: tr });
  }

  const antonyms = [];
  for (const a of entry.ANTONYMS) {
    const tr = await translateText(a);
    antonyms.push({ word: a, translation: tr });
  }

  res.json({
    word,
    translation: { word: wordTr },
    meanings,
    synonyms,
    antonyms
  });
};


exports.getDictionary = async (req, res) => {
    res.render('dictionarypage')
};
