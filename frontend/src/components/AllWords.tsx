"use client";

import { Trash2, Star, Search } from "lucide-react";

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
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sayfa başına:</span>
          {[10, 20, 50].map((limit) => (
            <button
              key={limit}
              className={`px-3 py-1 text-sm rounded ${
                limit === 20
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {limit}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Toplam: 0 kelime
        </div>
      </div>

      <div className="text-center py-12 text-gray-600">Kelime bulunamadı</div>
    </div>
  );
}

