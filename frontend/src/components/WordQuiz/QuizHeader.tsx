

import { useState } from "react";
import { AreaChart, BookOpen, Home, LayoutDashboard, Moon, Sun } from "lucide-react";
import Link from "next/link";
import UserQuiz from "./UserQuiz";
import GlobalQuiz from "./GlobalQuiz";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

type View = "user" | "global";

export default function QuizHeader() {
    const { user, isTester, ready } = useAuth();
    const canAccessUserQuiz = !!user && !isTester;
    const { darkMode, toggleDarkMode, mounted } = useTheme();

    const [currentView, setCurrentView] = useState<View>("global");

    return (
        <>

            {/* header / navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-gray-700 pb-4 mb-6">
                <div className="flex items-center gap-3">
                    <div>
                        <span className="text-xl text-gray-900 dark:text-white font-bold">Word<span className="text-blue-600 dark:text-blue-400">Mashup</span></span>
                        <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Kelime Quiz Sayfası</p>
                    </div>

                    {ready && (canAccessUserQuiz ? (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition-colors"
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Dashboard'a Git
                        </Link>
                    ) : (
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 dark:text-gray-300 bg-slate-100 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 transition-colors"
                        >
                            <Home className="w-3.5 h-3.5" />
                            Anasayfaya Git
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
                    <button
                        onClick={toggleDarkMode}
                        className={`relative inline-flex items-center w-14 h-7 rounded-full focus:outline-none flex-shrink-0 border-2 transition-opacity duration-0
                                ${!mounted ? "opacity-0" : "opacity-100"}
                                ${darkMode
                                ? "bg-gray-800 border-gray-700 hover:bg-gray-750 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                                : "bg-slate-200 border-slate-300 hover:bg-slate-250 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"}`}
                        title={darkMode ? "Açık Tema" : "Koyu Tema"}
                        aria-pressed={darkMode}
                        aria-label="Tema Değiştir"
                    >
                        <span className="sr-only">Tema Değiştir</span>

                        <div className="flex w-full justify-between items-center px-1.5 z-0 pointer-events-none">
                            <Sun className={`w-3.5 h-3.5 ${darkMode ? 'opacity-30' : 'opacity-100 text-yellow-500'}`} />
                            <Moon className={`w-3.5 h-3.5 ${darkMode ? 'opacity-100 text-blue-400' : 'opacity-30'}`} />
                        </div>

                        <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.2)] transform flex items-center justify-center z-10 
                                ${darkMode ? "translate-x-7" : "translate-x-0"}`}>
                            <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-white to-slate-50">
                                {darkMode ? (
                                    <Moon className="w-3 h-3 text-gray-800 fill-gray-800" />
                                ) : (
                                    <Sun className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                )}
                            </div>
                        </span>
                    </button>

                    <div className="flex w-full sm:w-auto justify-center bg-slate-200/50 dark:bg-gray-800/50 p-1 rounded-md gap-1">
                        <button
                            onClick={() => setCurrentView("global")}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 rounded text-[10px] sm:text-xs font-semibold transition-all
                                ${currentView === "global"
                                    ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-gray-700"
                                    : "text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            <AreaChart className="w-3.5 h-3.5" />
                            <span className="truncate">Genel Liste</span>
                        </button>

                        <div className="relative group flex-1 md:flex-none">
                            <button
                                onClick={() => canAccessUserQuiz && setCurrentView("user")}
                                className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 rounded text-[10px] sm:text-xs font-semibold transition-all
                                    ${currentView === "user"
                                        ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-gray-700"
                                        : "text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700"
                                    } ${!canAccessUserQuiz ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span className="truncate">Kullanıcı Listesi</span>
                            </button>

                            {!canAccessUserQuiz && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-[200px] px-2 py-1.5 bg-slate-800 dark:bg-gray-800 text-white text-[10px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-slate-800 dark:before:border-b-gray-700 text-center shadow-lg">
                                    Kendi kelime listenizi oluşturmak için giriş yapmalısınız.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* content field */}
            <div className="rounded-lg min-h-[500px]">
                {currentView === "user" ? <UserQuiz /> : <GlobalQuiz />}
            </div>
        </>
    );
}
