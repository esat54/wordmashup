

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AreaChart, BookOpen, Filter } from "lucide-react";
import { quizApi } from "@/lib/api";
import WordCard from "./WordCard";
import { useQuizLogic } from "./useQuizLogic";

function FilterSelect({
    value,
    options,
    onChange,
}: {
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full min-w-0 appearance-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2.5 py-2.5 text-[13px] font-semibold text-gray-700 dark:text-gray-300 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    );
}

function StatusFilterButton({
    value,
    options,
    onChange,
}: {
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}) {
    const selectedIndex = options.findIndex((option) => option.value === value);
    const selectedOption = options[selectedIndex] || options[0];
    const nextOption = options[(selectedIndex + 1) % options.length];

    return (
        <button
            type="button"
            aria-label={`${selectedOption.label}; tıklayarak ${nextOption.label} seç`}
            title={`Sonraki: ${nextOption.label}`}
            onClick={() => onChange(nextOption.value)}
            className={`min-w-0 rounded-lg border px-2.5 py-2.5 text-left text-[13px] font-semibold shadow-sm transition-colors ${value
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
        >
            <span className="block truncate">{selectedOption.label}</span>
        </button>
    );
}

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
    const router = useRouter();
    const [wordType, setWordType] = useState("");
    const [favoriteFilter, setFavoriteFilter] = useState("");
    const [unknownFilter, setUnknownFilter] = useState("");
    const [dateRange, setDateRange] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const skipNextFilteredShuffle = useRef(false);

    const updateFilterQuery = (updates: Record<string, string>) => {
        const query = { ...router.query };
        Object.entries(updates).forEach(([key, value]) => {
            if (value) query[key] = value;
            else delete query[key];
        });
        void router.replace(
            { pathname: router.pathname, query },
            undefined,
            { shallow: true, scroll: false },
        );
    };

    const quiz = useQuizLogic({
        fetchFn: async () => {
            const words = await quizApi.getUserWords() as any[];
            skipNextFilteredShuffle.current = true;
            return words;
        },
        saveFn: quizApi.saveWord,
        wordField: "text",
        displayCount: 100,
    });

    const filteredWords = useMemo(() => {
        const now = new Date();
        let from: Date | null = null;
        let to: Date | null = null;

        if (dateRange === "week") {
            from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (dateRange === "month") {
            const day = now.getDate();
            from = new Date(now);
            from.setDate(1);
            from.setMonth(from.getMonth() - 1);
            const lastDayOfMonth = new Date(
                from.getFullYear(),
                from.getMonth() + 1,
                0
            ).getDate();
            from.setDate(Math.min(day, lastDayOfMonth));
        } else if (dateRange === "custom") {
            if (dateFrom) from = new Date(`${dateFrom}T00:00:00`);
            if (dateTo) to = new Date(`${dateTo}T23:59:59.999`);
        }

        return quiz.allWords.filter((word) => {
            if (wordType && word.type !== wordType) return false;
            if (favoriteFilter === "true" && !word.favorite) return false;
            if (favoriteFilter === "false" && word.favorite) return false;
            if (unknownFilter === "true" && !word.isUnknown) return false;
            if (unknownFilter === "false" && word.isUnknown) return false;

            const createdAt = word.createdAt ? new Date(word.createdAt) : null;
            if (from && (!createdAt || createdAt < from)) return false;
            if (to && (!createdAt || createdAt > to)) return false;

            return true;
        });
    }, [quiz.allWords, wordType, favoriteFilter, unknownFilter, dateRange, dateFrom, dateTo]);

    useEffect(() => {
        quiz.fetchWords();
    }, []);

    useEffect(() => {
        if (!router.isReady) return;

        const getQueryValue = (value: string | string[] | undefined) =>
            Array.isArray(value) ? value[0] || "" : value || "";
        const queryType = getQueryValue(router.query.type);
        const queryFavorite = getQueryValue(router.query.favorite);
        const queryUnknown = getQueryValue(router.query.unknown);
        const queryDateRange = getQueryValue(router.query.dateRange);
        const queryDateFrom = getQueryValue(router.query.dateFrom);
        const queryDateTo = getQueryValue(router.query.dateTo);
        const validTypes = ["noun", "verb", "adjective", "adverb", "preposition", "conjunction", "pronoun", "phrasal_verb", "other"];

        setWordType(validTypes.includes(queryType) ? queryType : "");
        setFavoriteFilter(
            queryFavorite === "favorite" ? "true" :
                queryFavorite === "not-favorite" ? "false" :
                    ["true", "false"].includes(queryFavorite) ? queryFavorite : "",
        );
        setUnknownFilter(
            queryUnknown === "unknown" ? "true" :
                queryUnknown === "known" ? "false" :
                    ["true", "false"].includes(queryUnknown) ? queryUnknown : "",
        );
        setDateRange(["week", "month", "custom"].includes(queryDateRange) ? queryDateRange : "all");
        setDateFrom(/^\d{4}-\d{2}-\d{2}$/.test(queryDateFrom) ? queryDateFrom : "");
        setDateTo(/^\d{4}-\d{2}-\d{2}$/.test(queryDateTo) ? queryDateTo : "");
    }, [router.isReady, router.query]);

    useEffect(() => {
        if (skipNextFilteredShuffle.current) {
            skipNextFilteredShuffle.current = false;
            return;
        }
        quiz.handleShuffle(filteredWords);
    }, [filteredWords, quiz.handleShuffle]);

    const clearFilters = () => {
        setWordType("");
        setFavoriteFilter("");
        setUnknownFilter("");
        setDateRange("all");
        setDateFrom("");
        setDateTo("");
        updateFilterQuery({
            type: "",
            favorite: "",
            unknown: "",
            dateRange: "",
            dateFrom: "",
            dateTo: "",
        });
    };

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

            <aside className="w-full lg:w-[320px] shrink-0 self-start flex flex-col gap-3">
                <div className="flex flex-col rounded-lg border border-slate-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 shadow-md overflow-hidden">
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
                    </div>

                    <div className="px-3 py-2">
                        <div className="w-full flex bg-slate-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => quiz.showLang !== "TR" && quiz.toggleLang(filteredWords)}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition ${quiz.showLang === "TR"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-500 dark:text-gray-300"
                                    }`}
                            >
                                Türkçe
                            </button>

                            <button
                                type="button"
                                onClick={() => quiz.showLang !== "EN" && quiz.toggleLang(filteredWords)}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition ${quiz.showLang === "EN"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-500 dark:text-gray-300"
                                    }`}
                            >
                                English
                            </button>
                        </div>
                    </div>
                </div>

                <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 shadow-md p-3 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-gray-100">
                            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Kelime Filtreleri
                        </h2>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Temizle
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <FilterSelect
                            value={wordType}
                            onChange={(value) => {
                                setWordType(value);
                                updateFilterQuery({ type: value });
                            }}
                            options={[
                                { value: "", label: "Tür" },
                                { value: "noun", label: "İsim" },
                                { value: "verb", label: "Fiil" },
                                { value: "adjective", label: "Sıfat" },
                                { value: "adverb", label: "Zarf" },
                                { value: "preposition", label: "Edat" },
                                { value: "conjunction", label: "Bağlaç" },
                                { value: "pronoun", label: "Zamir" },
                                { value: "phrasal_verb", label: "Fiil Öbeği" },
                                { value: "other", label: "Diğer" },
                            ]}
                        />

                        <FilterSelect
                            value={dateRange}
                            onChange={(value) => {
                                setDateRange(value);
                                updateFilterQuery({
                                    dateRange: value === "all" ? "" : value,
                                    dateFrom: value === "custom" ? dateFrom : "",
                                    dateTo: value === "custom" ? dateTo : "",
                                });
                                if (value !== "custom") {
                                    setDateFrom("");
                                    setDateTo("");
                                }
                            }}
                            options={[
                                { value: "all", label: "Tüm tarihler" },
                                { value: "week", label: "Son 1 hafta" },
                                { value: "month", label: "Son 1 ay" },
                                { value: "custom", label: "Özel tarih" },
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <StatusFilterButton
                            value={favoriteFilter}
                            onChange={(value) => {
                                setFavoriteFilter(value);
                                updateFilterQuery({ favorite: value });
                            }}
                            options={[
                                { value: "", label: "Favori Durumu" },
                                { value: "true", label: "Favoriler" },
                                { value: "false", label: "Favori olmayanlar" },
                            ]}
                        />
                        <StatusFilterButton
                            value={unknownFilter}
                            onChange={(value) => {
                                setUnknownFilter(value);
                                updateFilterQuery({ unknown: value });
                            }}
                            options={[
                                { value: "", label: "Bilinmeyen Durumu" },
                                { value: "true", label: "Bilinmeyenler" },
                                { value: "false", label: "Bilinenler" },
                            ]}
                        />
                    </div>

                    {dateRange === "custom" && (
                        <div className="grid grid-cols-2 gap-2">
                            <label className="block min-w-0 space-y-1">
                                <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300">Başlangıç</span>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(event) => {
                                        setDateFrom(event.target.value);
                                        updateFilterQuery({ dateFrom: event.target.value });
                                    }}
                                    className="w-full min-w-0 rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-2 text-[11px] text-slate-700 dark:text-gray-200 outline-none focus:border-blue-500"
                                />
                            </label>
                            <label className="block min-w-0 space-y-1">
                                <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300">Bitiş</span>
                                <input
                                    type="date"
                                    value={dateTo}
                                    min={dateFrom || undefined}
                                    onChange={(event) => {
                                        setDateTo(event.target.value);
                                        updateFilterQuery({ dateTo: event.target.value });
                                    }}
                                    className="w-full min-w-0 rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-2 text-[11px] text-slate-700 dark:text-gray-200 outline-none focus:border-blue-500"
                                />
                            </label>
                        </div>
                    )}

                    <p className="border-t border-slate-100 dark:border-gray-700 pt-2 text-[11px] text-slate-500 dark:text-gray-400">
                        Filtrelere uyan {filteredWords.length} kelime
                    </p>
                </section>
            </aside>
        </div>
    );
}
