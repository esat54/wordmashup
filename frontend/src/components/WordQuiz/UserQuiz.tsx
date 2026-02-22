

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { quizApi } from "@/lib/api";
import WordCard from "./WordCard";
import { useQuizLogic } from "./useQuizLogic";

export default function UserQuiz() {
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
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-3 lg:h-[42px] lg:pb-0">   {/* top bar */}

                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${quiz.loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></span>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-gray-400 uppercase tracking-tight">
                        {quiz.loading ? "Yükleniyor..." : `${quiz.words.length} Kelime Yüklendi`}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button //refresh 
                        onClick={quiz.handleShuffle}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-gray-400 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-500/40 rounded-md transition-all group/refresh shadow-sm active:scale-95"
                        title="Kelimeleri Karıştır"
                    >
                        <RotateCcw className="w-4 h-4 group-active/refresh:rotate-[-45deg] transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">Yenile</span>
                    </button>

                    <div className="block sm:hidden h-5 w-px bg-slate-200 dark:bg-gray-800 mx-0.5"></div>

                    <button //language toggle
                        type="button"
                        role="switch"
                        aria-checked={quiz.showLang === "EN"}
                        aria-label="Dil değiştir"
                        onClick={quiz.toggleLang}
                        className={`relative inline-flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none shadow-inner flex-shrink-0
                        ${quiz.showLang === "EN" ? "bg-blue-500" : "bg-slate-300 dark:bg-gray-600"}`}
                    >
                        <span className="absolute inset-0 flex justify-between items-center px-1.5 text-[9px] font-bold uppercase pointer-events-none">
                            <span className={`transition-opacity duration-200 ${quiz.showLang === "TR" ? "opacity-100" : "opacity-30"}`}>TR</span>
                            <span className={`transition-opacity duration-200 ${quiz.showLang === "EN" ? "opacity-100" : "opacity-30"}`}>EN</span>
                        </span>
                        <span className={`absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${quiz.showLang === "EN" ? "translate-x-7" : "translate-x-0"}`} />
                    </button>
                </div>
            </div>

            {/* loading state */}
            {quiz.loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-xs font-medium text-slate-500 dark:text-gray-400 animate-pulse">Kendi Kelimelerin Hazırlanıyor...</p>
                </div>
            )}

            {/* word cards */}
            {!quiz.loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2">
                    {quiz.words.map((word, index) => (
                        <WordCard
                            key={index}
                            word={quiz.mapWord(word)}
                            index={index}
                            showLang={quiz.showLang}
                            answer={quiz.answers[index] || ""}
                            result={quiz.results[index] ?? null}
                            saving={quiz.saving === index}
                            onInputChange={quiz.handleInputChange}
                            onCheck={quiz.handleCheck}
                            onRetry={quiz.handleRetry}
                            onSave={quiz.handleSaveWord}
                            onSpeak={quiz.handleSpeech}
                            normalize={quiz.normalize}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
