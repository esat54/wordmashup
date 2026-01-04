"use client";

import { useState } from "react";
import { Plus, List } from "lucide-react";
import AllWords from "./AllWords";
import AddWords from "./AddWords";

export default function WordsPage() {
  const [currentView, setCurrentView] = useState<"list" | "add">("list");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelimelerim</h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView("list")}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
              ${currentView === "list"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <List className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Kelime listesi</span>
          </button>
          <button
            onClick={() => setCurrentView("add")}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
              ${currentView === "add"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Yeni Kelime Ekle</span>
          </button>
        </div>
      </div>

      {currentView === "list" ? <AllWords /> : <AddWords />}
    </div>
  );
}

