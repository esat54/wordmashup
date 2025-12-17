"use client";

import { useState } from "react";
import { Plus, List } from "lucide-react";
import AllWords from "./AllWords";
import AddWords from "./AddWords";

export default function WordsPage() {
  const [currentView, setCurrentView] = useState<"list" | "add">("list");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kelimelerim</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("list")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
              ${currentView === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <List className="w-5 h-5" />  Kelimelerim
          </button>
          <button
            onClick={() => setCurrentView("add")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
              ${currentView === "add" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <Plus className="w-5 h-5" /> Yeni Kelime Ekle
          </button>
        </div>
      </div>

      {currentView === "list" ? <AllWords /> : <AddWords />}
    </div>
  );
}
