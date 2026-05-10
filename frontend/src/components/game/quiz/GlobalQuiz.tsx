
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { AreaChart, BookOpen, ArrowRight, Gamepad2, LayoutDashboard, FileText, FileSearch, FileMinus } from "lucide-react";
import { quizApi } from "@/lib/api";
import WordCard from "./WordCard";
import { useQuizLogic } from "./useQuizLogic";


const CATEGORIES = ["Software", "Technology", "Sport", "Business", "Lifestyle", "Travel"] as const;

function WordCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
            {Array.from({ length: 20 }).map((_, index) => (
                <div
                    key={`global-skeleton-${index}`}
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

export default function GlobalQuiz({ currentView, setCurrentView, canAccessUserQuiz }: any) {
    const [level, setLevel] = useState<string>("Intermediate");
    const [isLevelOpen, setIsLevelOpen] = useState<boolean>(false);
    const [category, setCategory] = useState<string>("");
    const [wordType, setWordType] = useState<string>("");
    const [isTypeOpen, setIsTypeOpen] = useState<boolean>(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
    const randomizedCategories = useMemo(
        () => [...CATEGORIES].sort(() => Math.random() - 0.5),
        []
    );

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
        <div className="w-full flex flex-col-reverse lg:flex-row items-stretch gap-6">
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

            <div className="flex flex-col gap-3 w-full lg:w-[320px]">

                {/* right sidebar 1 (settings & filters ) */}
                <div className="w-full lg:w-[320px] shrink-0 self-start flex flex-col rounded-lg border border-slate-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 shadow-md"
                    onClick={() => {
                        setIsCategoryOpen(false);
                        setIsLevelOpen(false);
                        setIsTypeOpen(false);
                    }}
                >

                    <div className="flex items-center bg-slate-100/70 dark:bg-gray-900/60 border-b border-slate-200 dark:border-gray-700 px-2 py-2">
                        <div className="flex w-full gap-1 rounded-md bg-slate-200/50 dark:bg-gray-800/50 p-1">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setCurrentView("global"); }}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded text-xs font-semibold transition-all ${currentView === "global"
                                    ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-gray-700"
                                    : "text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <AreaChart className="w-3.5 h-3.5" />
                                <span className="truncate">Genel Liste</span>
                            </button>

                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setCurrentView("user"); }}
                                className={`show-if-logged-in flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded text-xs font-semibold transition-all ${currentView === "user"
                                    ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-gray-700"
                                    : "text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span className="truncate">Kullanıcı Listesi</span>
                            </button>
                        </div>
                    </div> {/* quiz Settings */}

                    <div className="px-3 pt-2">
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

                    <div className="p-3 flex flex-col gap-3">
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCategoryOpen(v => !v);
                                    setIsLevelOpen(false);
                                    setIsTypeOpen(false);
                                }}
                                className="text-[10px] font-bold py-2 rounded bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300"
                            >
                                Kategori ↓
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsLevelOpen(v => !v);
                                    setIsCategoryOpen(false);
                                    setIsTypeOpen(false);
                                }}
                                className="text-[10px] font-bold py-2 rounded bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300"
                            >
                                Seviye ↓
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsTypeOpen(v => !v);
                                    setIsCategoryOpen(false);
                                    setIsLevelOpen(false);
                                }}
                                className="text-[10px] font-bold py-2 rounded bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300"
                            >
                                Tür ↓
                            </button>
                        </div>

                        {isCategoryOpen && (
                            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1">
                                <button onClick={() => setCategory("")} className={`text-[10px] font-bold py-1.5 rounded ${category === "" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-gray-700 text-slate-400"}`}>
                                    Tümü
                                </button>
                                {randomizedCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`text-[10px] font-bold py-1.5 rounded ${category === cat ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-gray-700 text-slate-400"}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isLevelOpen && (
                            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1">
                                {LEVELS.map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => setLevel(lvl)}
                                        className={`text-[10px] font-bold py-1.5 rounded ${level === lvl ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-gray-700 text-slate-400"}`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isTypeOpen && (
                            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1">
                                {TYPES.map(type => (
                                    <button
                                        key={type.value}
                                        onClick={() => setWordType(type.value)}
                                        className={`text-[10px] font-bold py-1.5 rounded ${wordType === type.value ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-gray-700 text-slate-400"}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div> {/* filters */}
                </div>

                <div className="hidden lg:flex flex-col gap-3 w-full lg:w-auto flex-1">
                    {/* right sidebar 2 (game hub navigation) */}
                    <div className="w-full lg:w-[320px] shrink-0 self-start flex flex-col rounded-lg border border-slate-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-md overflow-hidden">

                        <div className="p-5 md:p-4 lg:p-5 flex flex-col gap-3 md:gap-2 lg:gap-3 flex-1">

                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 md:h-10 md:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
                                    <Gamepad2 className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] md:text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 truncate whitespace-nowrap">
                                        Oyun Merkezi
                                    </p>
                                    <h3 className="text-sm md:text-xs lg:text-sm font-bold text-slate-900 dark:text-white truncate whitespace-nowrap">
                                        Tüm Oyunlara Dön
                                    </h3>
                                </div>
                            </div>

                            <p className="text-[12px] md:text-[11px] lg:text-[12px] leading-5 md:leading-4 lg:leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">
                                Quiz modundan çıkıp tüm oyun kategorilerine geri dönebilirsin.
                            </p>

                            <Link
                                href="/game"
                                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.98]"
                            >
                                <span className="whitespace-nowrap">Tüm Oyunlara Git</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* right sidebar 3 (dashboard navigation) */}
                    <div className="w-full lg:w-[320px] shrink-0 self-start flex flex-col rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md overflow-hidden mt-auto">
                        <div className="p-5 md:p-4 lg:p-5 flex flex-col gap-4 flex-1">

                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50">
                                    <LayoutDashboard className="w-5 h-5" />
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50">
                                    <FileSearch className="w-5 h-5" />
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50">
                                    <FileMinus className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="text-center px-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                                    Kontrol Paneline Dön
                                </h3>
                                <p className="text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                                    Kendi kelime listelerini oluştur, Oxford 3000 serisiyle çalış, sözlükte kelime ara ve gramer konularını keşfet.
                                </p>
                            </div>

                            <Link
                                href="/dashboard"
                                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.98]"
                            >
                                <span className="whitespace-nowrap">Panele Git</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}