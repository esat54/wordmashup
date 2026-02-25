

import { useState, useEffect } from "react";
import { Link, RotateCcw } from "lucide-react";
import { quizApi } from "@/lib/api";
import WordCard from "./WordCard";
import { useQuizLogic } from "./useQuizLogic";


const CATEGORIES = ["Software", "Technology", "Sport", "Business", "Lifestyle", "Travel", "Other"] as const;

export default function GlobalQuiz() {
    const [level, setLevel] = useState<string>("Intermediate");
    const [isLevelOpen, setIsLevelOpen] = useState<boolean>(false);
    const [category, setCategory] = useState<string>("");
    const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
    const [wordType, setWordType] = useState<string>("");
    const [isTypeOpen, setIsTypeOpen] = useState<boolean>(false);

    const LEVELS = ["Basic", "Intermediate", "Advanced"] as const;
    const TYPES = [
        { value: "", label: "Tümü" },
        { value: "Noun", label: "Noun" },
        { value: "Verb", label: "Verb" },
        { value: "Adjective", label: "Adjective" },
        { value: "Adverb", label: "Adverb" },
        { value: "Other", label: "Other" }
    ] as const;

    const quiz = useQuizLogic({
        fetchFn: () => quizApi.getGlobalWords(level, category || undefined, wordType || undefined) as Promise<any[]>,
        saveFn: quizApi.saveWord,
        wordField: "word",
    });

    useEffect(() => {
        quiz.fetchWords();
    }, [level, category, wordType]);



    return (
        <div className="w-full space-y-4">

            <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-gray-700 pb-3 lg:flex-row lg:items-center lg:justify-between lg:h-[42px] lg:pb-0">  {/* top bar */}
                <div className="hidden lg:flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 flex-nowrap lg:w-auto lg:overflow-visible lg:pb-0">  {/* category buttons */}
                    <button
                        onClick={() => setCategory("")}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded-md border transition-all whitespace-nowrap flex-shrink-0
                            ${category === "" ? "bg-blue-500 text-white border-blue-500 shadow-sm" : "bg-slate-50 dark:bg-gray-800 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/40"}`}
                    >
                        Tümü
                    </button>
                    {CATEGORIES.map((i) => (
                        <button
                            key={i}
                            onClick={() => setCategory(i)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded-md border transition-all whitespace-nowrap flex-shrink-0
                                ${category === i ? "bg-blue-500 text-white border-blue-500 shadow-sm" : "bg-slate-50 dark:bg-gray-800 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/40"}`}
                        >
                            {i}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full lg:w-auto">  {/* level, category, type select */}

                    <div className="grid grid-cols-3 lg:flex lg:items-center gap-1.5 sm:gap-2 w-full sm:flex-1 md:flex-none md:w-[520px] lg:w-auto">
                        {/* category select */}
                        <div className="relative w-full lg:w-32 lg:hidden z-30">
                            <button
                                type="button"
                                onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsLevelOpen(false); setIsTypeOpen(false); }}
                                className="grid w-full cursor-pointer grid-cols-1 rounded-md bg-white dark:bg-gray-800 py-1 sm:py-1.5 px-1.5 sm:px-3 text-left text-gray-900 dark:text-gray-300 border border-slate-200 dark:border-gray-700 shadow-sm outline-none focus:outline-none focus:border-blue-300 sm:text-xs"
                            >
                                <span className="col-start-1 row-start-1 flex items-center justify-between gap-1 sm:gap-3 pr-4 sm:pr-6">
                                    <span className="block text-[9px] sm:text-[11px] font-bold uppercase tracking-tight text-slate-600 dark:text-gray-400 truncate">{category || "Kategori"}</span>
                                </span>
                                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 dark:text-gray-500 sm:size-4">
                                    <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
                                </svg>
                            </button>

                            {isCategoryOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)}></div>
                                    <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-slate-100 dark:border-gray-700">
                                        <li
                                            className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${category === "" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                                            onClick={() => { setCategory(""); setIsCategoryOpen(false); }}
                                        >
                                            <div className="flex items-center">
                                                <span className={`block truncate text-[11px] uppercase tracking-tight ${category === "" ? 'font-black' : 'font-bold'}`}>Tümü</span>
                                            </div>
                                            {category === "" && (
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
                                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            )}
                                        </li>
                                        {CATEGORIES.map((cat) => (
                                            <li
                                                key={cat}
                                                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${category === cat ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                                                onClick={() => { setCategory(cat); setIsCategoryOpen(false); }}
                                            >
                                                <div className="flex items-center">
                                                    <span className={`block truncate text-[11px] uppercase tracking-tight ${category === cat ? 'font-black' : 'font-bold'}`}>{cat}</span>
                                                </div>
                                                {category === cat && (
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
                                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* level select */}
                        <div className="relative w-full lg:w-32 z-20">
                            <button
                                type="button"
                                onClick={() => { setIsLevelOpen(!isLevelOpen); setIsCategoryOpen(false); setIsTypeOpen(false); }}
                                className="grid w-full cursor-pointer grid-cols-1 rounded-md bg-white dark:bg-gray-800 py-1 sm:py-1.5 px-1.5 sm:px-3 text-left text-gray-900 dark:text-gray-300 border border-slate-200 dark:border-gray-700 shadow-sm outline-none focus:outline-none focus:border-blue-300 sm:text-xs"
                            >
                                <span className="col-start-1 row-start-1 flex items-center justify-between gap-1 sm:gap-3 pr-4 sm:pr-6">
                                    <span className="block text-[9px] sm:text-[11px] font-bold uppercase tracking-tight text-slate-600 dark:text-gray-400 truncate">{level}</span>
                                </span>
                                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 dark:text-gray-500 sm:size-4">
                                    <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
                                </svg>
                            </button>

                            {isLevelOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsLevelOpen(false)}></div>
                                    <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-slate-100 dark:border-gray-700">
                                        {LEVELS.map((lvl) => (
                                            <li
                                                key={lvl}
                                                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${level === lvl ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                                                onClick={() => { setLevel(lvl); setIsLevelOpen(false); }}
                                            >
                                                <div className="flex items-center">
                                                    <span className={`block truncate text-[11px] uppercase tracking-tight ${level === lvl ? 'font-black' : 'font-bold'}`}>{lvl}</span>
                                                </div>
                                                {level === lvl && (
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
                                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* type select */}
                        <div className="relative w-full lg:w-32 z-10">
                            <button
                                type="button"
                                onClick={() => { setIsTypeOpen(!isTypeOpen); setIsCategoryOpen(false); setIsLevelOpen(false); }}
                                className="grid w-full cursor-pointer grid-cols-1 rounded-md bg-white dark:bg-gray-800 py-1 sm:py-1.5 px-1.5 sm:px-3 text-left text-gray-900 dark:text-gray-300 border border-slate-200 dark:border-gray-700 shadow-sm outline-none focus:outline-none focus:border-blue-300 sm:text-xs"
                            >
                                <span className="col-start-1 row-start-1 flex items-center justify-between gap-1 sm:gap-3 pr-4 sm:pr-6">
                                    <span className="block text-[9px] sm:text-[11px] font-bold uppercase tracking-tight text-slate-600 dark:text-gray-400 truncate">
                                        {wordType ? TYPES.find(t => t.value === wordType)?.label : "Tür"}
                                    </span>
                                </span>
                                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 dark:text-gray-500 sm:size-4">
                                    <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
                                </svg>
                            </button>

                            {isTypeOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsTypeOpen(false)}></div>
                                    <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-slate-100 dark:border-gray-700">
                                        {TYPES.map((type) => (
                                            <li
                                                key={type.value}
                                                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${wordType === type.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                                                onClick={() => { setWordType(type.value); setIsTypeOpen(false); }}
                                            >
                                                <div className="flex items-center">
                                                    <span className={`block truncate text-[11px] uppercase tracking-tight ${wordType === type.value ? 'font-black' : 'font-bold'}`}>{type.label}</span>
                                                </div>
                                                {wordType === type.value && (
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
                                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>

                    {/* action buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 border-t border-slate-100 dark:border-gray-700 pt-3 sm:border-t-0 sm:pt-0">
                        <button //refresh 
                            onClick={quiz.handleShuffle}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-gray-400 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-500/40 rounded-md transition-all group/refresh shadow-sm active:scale-95"
                            title="Kelimeleri Karıştır"
                        >
                            <RotateCcw className="w-4 h-4 group-active/refresh:rotate-[-45deg] transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">Yenile</span>
                        </button>

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
            </div>

            {!quiz.loading && !quiz.user && (
                <div className="text-[10px] text-slate-500 dark:text-gray-400 italic text-center mt-2 mb-1 animate-in fade-in duration-500">
                    Kendi kelime listenle quiz yapmak ve gelişimini görmek için seni bekliyoruz. Hemen <a href="/login" className="text-blue-500 dark:text-blue-400 hover:underline">giriş yap</a>!
                </div>
            )}

            {/* loading state */}
            {quiz.loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-xs font-medium text-slate-500 dark:text-gray-400 animate-pulse">Kelimeler Hazırlanıyor...</p>
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