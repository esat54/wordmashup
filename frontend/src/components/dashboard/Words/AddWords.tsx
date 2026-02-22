
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kelime Türü *</label>
          <div className="relative w-full z-30">
            <button
              type="button"
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-left"
            >
              <span className={`block truncate ${!formData.type ? 'text-gray-500 dark:text-gray-400' : ''}`}>
                {formData.type ? wordTypes.find(t => t.value === formData.type)?.label : "Seçiniz"}
              </span>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none">
                <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </button>

            {isTypeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsTypeOpen(false)}></div>
                <ul className="absolute z-20 left-0 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-gray-100 dark:border-gray-700">
                  {wordTypes.map((t) => (
                    <li
                      key={t.value}
                      className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${formData.type === t.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                      onClick={() => { setFormData({ ...formData, type: t.value }); setIsTypeOpen(false); }}
                    >
                      <div className="flex items-center">
                        <span className={`block truncate ${formData.type === t.value ? 'font-semibold' : 'font-medium'}`}>{t.label}</span>
                      </div>
                      {formData.type === t.value && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
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