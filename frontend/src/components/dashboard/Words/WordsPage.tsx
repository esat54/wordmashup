"use client";

import { useState, useEffect } from "react";
import { Plus, List } from "lucide-react";
import AllWords from "./AllWords";
import AddWords from "./AddWords";

export default function WordsPage() {
  const [currentView, setCurrentView] = useState<"list" | "add">("list");
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isTester = user?.email === "tester@gmail.com";

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelimelerim</h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView("list")}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
              ${
                currentView === "list"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <List className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Kelime listesi</span>
          </button>

          <div className="relative group flex-1 sm:flex-none">
            <button
              onClick={() => !isTester && setCurrentView("add")}
              disabled={isTester}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
                ${
                  currentView === "add"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
                ${isTester ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Yeni Kelime Ekle</span>
            </button>

            {isTester && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col items-center z-50">
                <div className="w-1.5 h-1.5 bg-gray-800 rotate-45 -mb-1"></div>
                <div className="bg-gray-800 text-white text-[9px] py-1 px-2.5 rounded-md whitespace-nowrap shadow-lg font-medium tracking-wide">
                  Kelime eklemek için lütfen giriş yapın
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {currentView === "list" ? <AllWords /> : <AddWords />}
    </div>
  );
}