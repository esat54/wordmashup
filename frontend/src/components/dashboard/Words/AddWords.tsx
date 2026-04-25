
import { useState } from "react";
import { wordsApi } from "@/lib/api";

const wordTypes = [
  { value: "noun", label: "İsim" },
  { value: "verb", label: "Fiil" },
  { value: "adjective", label: "Sıfat" },
  { value: "adverb", label: "Zarf" },
  { value: "preposition", label: "Edat" },
  { value: "conjunction", label: "Bağlaç" },
  { value: "pronoun", label: "Zamir" },
  { value: "phrasal_verb", label: "Fiil Öbeği" },
  { value: "other", label: "Diğer" },
];

export default function AddWords() {
  const [formData, setFormData] = useState({
    text: "",
    translation: "",
    exampleSentence: "",
    sentenceTranslation: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await wordsApi.addWord(formData);

      setMessage(
        `Kelime başarıyla eklendi! ${JSON.stringify(formData.text)} - ${JSON.stringify(
          formData.translation,
        )}`,
      );

      setFormData({
        text: "",
        translation: "",
        exampleSentence: "",
        sentenceTranslation: "",
        type: "",
      });
    } catch (error: any) {
      setMessage(error.message || "Kelime eklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Yeni Kelime Ekle</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${message.includes("başarıyla") ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
            }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İngilizce Kelime *</label>
            <input
              type="text"
              name="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Türkçe Karşılığı *
            </label>
            <input
              type="text"
              name="translation"
              value={formData.translation}
              onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Örnek Cümle (İngilizce) *
          </label>
          <textarea
            rows={2}
            name="exampleSentence"
            value={formData.exampleSentence}
            onChange={(e) => setFormData({ ...formData, exampleSentence: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cümlenin Türkçesi *
          </label>
          <textarea
            rows={2}
            name="sentenceTranslation"
            value={formData.sentenceTranslation}
            onChange={(e) => setFormData({ ...formData, sentenceTranslation: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Kelime Türü *</label>
          <div className="flex flex-wrap gap-2.5">
            {wordTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: formData.type === t.value ? "" : t.value })}
                className={`flex-1 whitespace-nowrap min-w-[30%] sm:min-w-[18%] lg:min-w-[10%] px-2 sm:px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 border ${
                  formData.type === t.value
                    ? "bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-transparent hover:border-gray-300 dark:border-gray-600/50 dark:hover:border-gray-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Ekleniyor..." : "Ekle"}
        </button>
      </form>
    </div>
  );
}