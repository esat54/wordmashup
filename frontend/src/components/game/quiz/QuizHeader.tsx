import { useState } from "react";
import { AreaChart, BookOpen, LayoutDashboard, LogIn, Moon, Sun } from "lucide-react";
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
            <div className="rounded-lg min-h-[500px]">
                {currentView === "user" ? (
                    canAccessUserQuiz ? (
                        <UserQuiz currentView={currentView} setCurrentView={setCurrentView} canAccessUserQuiz={canAccessUserQuiz} />
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[400px] gap-5 text-center px-4">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                <LogIn className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-gray-100 mb-1">Giriş Yapmanız Gerekiyor</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400 max-w-xs">
                                    Kendi kelime listenizle quiz oluşturmak için hesabınıza giriş yapın.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition-colors"
                                >
                                    Hesap Oluştur
                                </Link>
                            </div>
                        </div>
                    )
                ) : (
                    <GlobalQuiz currentView={currentView} setCurrentView={setCurrentView} canAccessUserQuiz={canAccessUserQuiz} />
                )}
            </div>
        </>
    );
}