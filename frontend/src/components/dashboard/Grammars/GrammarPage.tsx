
import { useState } from "react";
import { Plus, List } from "lucide-react";
import AllGrammarList from "./AllGrammarList";
import AddGrammar from "./AddGrammar";
import { useAuth } from "@/context/AuthContext";

export default function GrammarPage() {
  const [currentView, setCurrentView] = useState<"list" | "add">("list");
  const { isTester } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentView === "list" ? (
            <div className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-blue-600 text-white shadow-md cursor-default">
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Gramer listesi</span>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView("list")}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Gramer listesi</span>
            </button>
          )}

          {isTester ? (
            <div className="relative group flex-1 sm:flex-none">
              <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Yeni Konu Ekle</span>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col items-center z-50">
                <div className="w-1.5 h-1.5 bg-gray-800 rotate-45 -mb-1"></div>
                <div className="bg-gray-800 text-white text-[9px] py-1 px-2.5 rounded-md whitespace-nowrap shadow-lg font-medium tracking-wide">
                  Gramer konusu eklemek için lütfen giriş yapın
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView("add")}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${currentView === "add"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Yeni Konu Ekle</span>
            </button>
          )}
        </div>
      </div>

      {currentView === "list" ? <AllGrammarList /> : <AddGrammar />}
    </div>
  );
}