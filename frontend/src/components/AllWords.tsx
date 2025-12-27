"use client";

import { useEffect, useState } from "react";
import { Trash2, Star, Search, Loader2, X, Volume2 } from "lucide-react";
import { wordsApi } from "../lib/api";

const wordTypes = [
  { value: "", label: "Tümü" },
  { value: "noun", label: "İsim" },
  { value: "verb", label: "Fiil" },
  { value: "adjective", label: "Sıfat" },
  { value: "adverb", label: "Zarf" },
  { value: "preposition", label: "Edat" },
  { value: "conjunction", label: "Bağlaç" },
  { value: "pronoun", label: "Zamir" },
  { value: "other", label: "Diğer" },
];

export default function AllWords() {
  const [totalWords, setTotalWords] = useState<number>(0);
  const [words, setWords] = useState<any[]>([]);
  const [limit, setLimit] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [limit]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await wordsApi.getWords(limit) as any;

      setTimeout(() => {
        setWords(response.words || []);
        setTotalWords(response.totalCount || 0);
        setLoading(false);
      }, 300);
    } catch (error: any) {
      console.error("Veri yükleme hatası:", error);
      setLoading(false);
    }
  };

  const toggleFavorite = async (wordId: string) => {
    wordsApi.addtoFavorites(wordId);
    const yeniListem = words.map(w =>
      w._id === wordId ? { ...w, favorite: !w.favorite } : w
    );
    setWords(yeniListem);
  };

  const removeWord = async (wordId: string) => {
    if (!window.confirm("Bu kelimeyi silmek istediğinize emin misiniz?")) return;

    try {
      const response = await wordsApi.deleteWord(wordId) as any;
      setMessage(response.message);

      // Mesajı 3 saniye sonra temizle
      setTimeout(() => setMessage(""), 3000);

      setWords(prevWords => prevWords.filter(word => word._id !== wordId));
      setTotalWords(prev => prev - 1);
    } catch (error: any) {
      console.error("Silme hatası:", error);
      setMessage(error.message || "Silme işlemi sırasında bir hata oluştu");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Tarayıcınız seslendirme özelliğini desteklemiyor.");
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.rate = 0.7;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">

      {/* mesaj kutusu */}
      {message && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700 transition-all">
          <span className="text-sm font-medium">{message}</span>
          <button onClick={() => setMessage("")} className="hover:text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Kelime ara..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
          {wordTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
          <option value="">Tümü</option>
          <option value="true">Favoriler</option>
          <option value="false">Favori Olmayanlar</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-gray-100 pb-4 sm:border-none sm:pb-0">

        <div className="w-full sm:w-auto flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 sm:border-none sm:bg-transparent sm:p-0 sm:justify-start sm:gap-4">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">Sayfa başına:</span>
          <div className="flex items-center gap-2">
            {[10, 20, 50].map((item) => (
              <button
                key={item}
                onClick={() => setLimit(item)}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-all ${limit === item
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-100"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-center px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Toplam: {totalWords} kelime
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Kelimeler yükleniyor...</span>
        </div>
      ) : words && words.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {words.map((word) => (
            <div key={word._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{word.text}</h3>
                  <p className="text-sm text-gray-600">{word.translation}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => speak(word.text)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="Dinle"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  <button onClick={() => toggleFavorite(word._id)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <Star className={`w-5 h-5 ${word.favorite ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
                  </button>

                  <button
                    onClick={() => removeWord(word._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Tür: {wordTypes.find(type => type.value === word.type)?.label || word.type}
              </div>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Örnek:</strong> {word.exampleSentence}</p>
                <p><strong>Çeviri:</strong> {word.sentenceTranslation}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">Kelime bulunamadı</div>
      )}
    </div>
  );
}