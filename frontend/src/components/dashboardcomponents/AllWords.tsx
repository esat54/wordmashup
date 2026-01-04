"use client";

import { useEffect, useState } from "react";
import { Trash2, Star, Search, Loader2, X, Volume2, MessageCircleQuestionMark, ChevronLeft, ChevronRight } from "lucide-react";
import { wordsApi } from "@/lib/api";

const wordTypes = [
  { value: "", label: "Tür" },
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [totalWords, setTotalWords] = useState<number>(0);
  const [words, setWords] = useState<any[]>([]);
  const [limit, setLimit] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [type, setType] = useState<string>("");
  const [favoriteFilter, setFavoriteFilter] = useState<string>("");
  const [unknownFilter, setUnknownFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit, type, favoriteFilter, unknownFilter, debouncedSearchTerm]);

  useEffect(() => {
    loadData();
  }, [limit, currentPage, type, favoriteFilter, unknownFilter, debouncedSearchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * limit;
      const response = await wordsApi.getWords({ limit, skip, type, favoriteFilter, unknownFilter, searchTerm: debouncedSearchTerm, }) as any;

      setTimeout(() => {
        setWords(response.words || []);
        setTotalWords(response.totalWords || 0);
        setLoading(false);
      }, 300);
    } catch (error: any) {
      console.error("Veri yükleme hatası:", error);
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalWords / limit);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleFavorite = async (wordId: string) => {
    try {
      await wordsApi.addtoFavorites(wordId);
      setWords(words.map(w => w._id === wordId ? { ...w, favorite: !w.favorite } : w));
    } catch (error) {
      setMessage("Favori durumu değiştirilemedi.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const toggleUnknown = async (wordId: string) => {
    try {
      await wordsApi.addtoUnknown(wordId);
      setWords(words.map(w =>
        w._id === wordId ? { ...w, isUnknown: !w.isUnknown } : w
      ));
    } catch (error) {
      setMessage("Bilinmeyen durumu değiştirilemedi.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const removeWord = async (wordId: string) => {
    if (!window.confirm("Bu kelimeyi silmek istediğinize emin misiniz?")) return;

    try {
      const response = await wordsApi.deleteWord(wordId) as any;
      setMessage(response.message || "Kelime başarıyla silindi.");

      setTimeout(() => setMessage(""), 3000);

      setWords((prevWords) => prevWords.filter((word) => word._id !== wordId));
      setTotalWords((prev) => prev - 1);
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
      {message && (   // Mesaj kutusu
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700 transition-all">
          <span className="text-sm font-medium">{message}</span>
          <button onClick={() => setMessage("")} className="hover:text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">   {/* İnput Alanı */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Kelime ara (EN/TR)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <select
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {wordTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          value={favoriteFilter}
          onChange={(e) => setFavoriteFilter(e.target.value)}
        >
          <option value="">Favori Durumu</option>
          <option value="true">Favoriler</option>
          <option value="false">Favori Olmayanlar</option>
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          value={unknownFilter}
          onChange={(e) => setUnknownFilter(e.target.value)}
        >
          <option value="">Bilinmeyen Durumu</option>
          <option value="true">Bilinmeyenler</option>
        </select>
      </div>


      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-gray-100 pb-4 sm:border-none sm:pb-0">
        <div className="w-full sm:w-auto flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 sm:border-none sm:bg-transparent sm:p-0 sm:justify-start sm:gap-4">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">Sayfa başına:</span>
          <div className="flex items-center gap-2">
            {[10, 20, 50, 100].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setLimit(item);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${limit === item
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div> {/* Sayfa başına alanı */}

        <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 min-w-[170px] relative">
          <span className="absolute left-3 w-2 h-2 bg-blue-500 rounded-full"></span>
          <div className="flex-1 flex justify-center items-center">
            {loading && words.length === 0 ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <span className="ml-3">Tüm kelimeler: {totalWords}</span>
            )}
          </div>
        </div>  {/* Toplam kelime sayısı */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Kelimeler yükleniyor...</span>
        </div>
      ) : words.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {words.map((word) => (
            <div key={word._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div> 
                  <h3 className="font-semibold text-gray-900">{word.text}</h3>
                  <p className="text-sm text-gray-600">{word.translation}</p>
                </div>
                <div className="flex flex-row gap-1 mt-[2px]"> 
                  <button
                    onClick={() => toggleFavorite(word._id)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <Star
                      className={`w-[18px] h-[18px] ${word.favorite ? "fill-current text-yellow-500" : "text-gray-400"
                        }`}
                    />
                  </button>
                  <button
                    onClick={() => toggleUnknown(word._id)}
                    className={`transition-colors ${word.isUnknown ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
                      }`}
                    title="Bilinmeyen"
                  >
                    <MessageCircleQuestionMark
                      className={`w-[18px] h-[18px] ${word.isUnknown ? "text-blue-500" : ""
                        }`}
                    />
                  </button>
                  <button
                    onClick={() => speak(word.text)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="Dinle"
                  >
                    <Volume2 className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={() => removeWord(word._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Tür: {wordTypes.find((t) => t.value === word.type)?.label || word.type}
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="text-sm text-gray-700">  
                <p className="mb-1">
                  <strong>Örnek:</strong> {word.exampleSentence}
                </p>
                <p>
                  <strong>Çeviri:</strong> {word.sentenceTranslation}
                </p>
              </div>
            </div>
          ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 bg-white rounded-lg border border-gray-200 px-3 py-1.5">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`
                  p-1 rounded transition-colors
                  ${currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`
                  p-1 rounded transition-colors
                  ${currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-600">Kelime bulunamadı</div>
      )}
    </div>
  );
}

