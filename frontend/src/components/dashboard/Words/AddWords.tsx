"use client";

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Kelime Ekle</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${message.includes("başarıyla") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İngilizce Kelime *</label>
            <input
              type="text"
              name="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Türkçe Karşılığı *
            </label>
            <input
              type="text"
              name="translation"
              value={formData.translation}
              onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Örnek Cümle (İngilizce) *
          </label>
          <textarea
            rows={2}
            name="exampleSentence"
            value={formData.exampleSentence}
            onChange={(e) => setFormData({ ...formData, exampleSentence: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cümlenin Türkçesi *
          </label>
          <textarea
            rows={2}
            name="sentenceTranslation"
            value={formData.sentenceTranslation}
            onChange={(e) => setFormData({ ...formData, sentenceTranslation: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kelime Türü *</label>
          <select
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="">Seçiniz</option>
            {wordTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
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