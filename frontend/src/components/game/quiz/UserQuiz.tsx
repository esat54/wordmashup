

import { useEffect } from "react";
import { AreaChart, BookOpen, RotateCcw } from "lucide-react";
import { quizApi } from "@/lib/api";
import WordCard from "./WordCard";
import { useQuizLogic } from "./useQuizLogic";

function WordCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
            {Array.from({ length: 20 }).map((_, index) => (
                <div
                    key={`user-skeleton-${index}`}
                    className="h-[52px] rounded-lg border border-slate-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5 shadow-sm"
                >
                    <div className="h-full flex items-center justify-between">
                        <div className="flex flex-col flex-1 min-w-0 px-2">
                            <div className="h-[13px] w-[75%] rounded bg-slate-200 dark:bg-gray-700" />
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:bg-gray-700 mx-1"></div>
                        <div className="flex flex-col flex-1 min-w-0 px-2">
                            <div className="h-6 w-full rounded border border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-700/70" />
                        </div>
                        <div className="flex items-center">
                            <div className="ml-2 h-6 w-6 rounded-full bg-slate-200 dark:bg-gray-700" />
                            <div className="ml-2 h-6 w-6 rounded-full bg-slate-200 dark:bg-gray-700" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function UserQuiz({ currentView, setCurrentView, canAccessUserQuiz }: any) {
    const quiz = useQuizLogic({
        fetchFn: () => quizApi.getUserWords() as Promise<any[]>,
        saveFn: quizApi.saveWord,
        wordField: "text",
        displayCount: 100,
    });

    useEffect(() => {
        quiz.fetchWords();
    }, []);

    return (
        <div className="w-full flex flex-col-reverse lg:flex-row items-start gap-6">
            {/* quiz cards */}
            <div className="flex-1 min-w-0 w-full min-h-[560px] space-y-4">
                {quiz.loading && <WordCardsSkeleton />}

                {!quiz.loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {quiz.words.map((word, index) => (
                            <WordCard
                                key={index}
                                word={quiz.mapWord(word)}
                                index={index}
                                showLang={quiz.showLang}
                                answer={quiz.answers[index] || ""}
                                result={quiz.results[index] ?? null}
                                onInputChange={quiz.handleInputChange}
                                onCheck={quiz.handleCheck}
                                onRetry={quiz.handleRetry}
                                onSpeak={quiz.handleSpeech}
                                normalize={quiz.normalize}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* right sidebar (settings & filters ) */}
            <div className="w-full lg:w-[320px] shrink-0 self-start flex flex-col rounded-lg border border-slate-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 shadow-md overflow-hidden">
                <div className="flex items-center bg-slate-100/70 dark:bg-gray-900/60 border-b border-slate-200 dark:border-gray-700 px-2 py-2">
                    <div className={`grid w-full ${canAccessUserQuiz ? "grid-cols-2" : "grid-cols-1"} gap-1 rounded-md bg-slate-200/50 dark:bg-gray-800/50 p-1`}>
                        <button
                            type="button"
                            onClick={() => setCurrentView("global")}
                            className={`w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded text-xs font-semibold transition-all ${currentView === "global"
                                ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-gray-700"
                                : "text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            <AreaChart className="w-3.5 h-3.5" />
                            <span className="truncate">Genel Liste</span>
                        </button>

                        {canAccessUserQuiz && (
                            <button
                                type="button"
                                onClick={() => setCurrentView("user")}
                                className={`w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded text-xs font-semibold transition-all ${currentView === "user"
                                    ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-gray-700"
                                    : "text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span className="truncate">Kullanıcı Listesi</span>
                            </button>
                        )}
                    </div>
                </div> {/* quiz Settings */}

                <div className="px-3 py-2">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex bg-slate-100 dark:bg-gray-700 rounded-lg p-1"
                    >
                        <button
                            onClick={() => quiz.showLang !== "TR" && quiz.toggleLang()}
                            className={`flex-1 py-2 text-xs font-bold rounded-md transition ${quiz.showLang === "TR"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-500 dark:text-gray-300"
                                }`}
                        >
                            Türkçe
                        </button>

                        <button
                            onClick={() => quiz.showLang !== "EN" && quiz.toggleLang()}
                            className={`flex-1 py-2 text-xs font-bold rounded-md transition ${quiz.showLang === "EN"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-500 dark:text-gray-300"
                                }`}
                        >
                            English
                        </button>
                    </div>
                </div> {/* language toggle */}
            </div>
        </div>
    );
}
