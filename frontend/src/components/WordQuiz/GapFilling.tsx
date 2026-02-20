"use client";

import { useState, useEffect } from "react";
import { Check, RotateCw, Save, Loader, Volume2, RotateCcw } from "lucide-react";
import { quizApi } from "@/lib/api";

export default function GapFilling() {
    const [words, setWords] = useState<any[]>([]);
    const [saving, setSaving] = useState<number | null>(null);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showLang, setShowLang] = useState<'TR' | 'EN'>("TR");
    const [answers, setAnswers] = useState<string[]>([]);
    const [results, setResults] = useState<(null | boolean)[]>([]);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        fetchWord();
    }, [])

    const fetchWord = async () => {
        try {
            const data = await quizApi.getUserWords() as any;
            setWords(data);
        } catch (error) {
            console.error(error);
            setError("Kelime yüklenirken hata oluştu");
        }
    }

    const handleSaveWord = async (index: number) => {
        if (!user) {
            alert("Kelime kaydetmek için giriş yapmalısınız");
            return;
        }
        try {
            setSaving(index);
            await new Promise(resolve => setTimeout(resolve, 200));

            const data = await quizApi.saveWord({ word: words[index]?.text || "", translation: words[index]?.translation || "" }) as any;

            const newResults = [...results];
            newResults[index] = null;
            setResults(newResults);

            const newAnswers = [...answers];
            newAnswers[index] = "";
            setAnswers(newAnswers);
        } catch (err: any) {
            const errMsg = err.message || "";
            const isAlreadySaved = errMsg.includes("already exists") ||
                errMsg.includes("zaten mevcut") ||
                errMsg.includes("kaydedilmiş") ||
                errMsg.includes("conflict") ||
                err.status === 409;

            if (!isAlreadySaved) {
                alert(errMsg || "Kelime kaydedilirken hata oluştu");
            }
        } finally {
            setSaving(null);
        }
    };

    const handleInputChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSpeechWord = (index: number) => {
        const word = words[index];
        const textToSpeak = word?.text;
        if (textToSpeak) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = "en-US";
            speechSynthesis.speak(utterance);
        }
    };

    const handleCheck = (index: number) => {
        const word = words[index];
        const correct = showLang === "TR"
            ? normalize(word?.text)
            : normalize(word?.translation);
        const userValue = normalize(answers[index]);
        const isCorrect = userValue === correct;
        const newResults = [...results];
        newResults[index] = isCorrect;
        setResults(newResults);
    };

    const handleRetry = (index: number) => {
        const newResults = [...results];
        newResults[index] = null;
        setResults(newResults);
    };

    const handleShuffle = () => {
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        setWords(shuffled);
        setResults(new Array(shuffled.length).fill(null));
        setAnswers(new Array(shuffled.length).fill(""));
    };

    const normalize = (str?: string) => {
        if (!str) return "";
        return str.toLowerCase().split(",")[0].trim();
    };

    return (
        <div className="w-full space-y-4">
            {/* top bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{words.length} Kelime Yüklendi</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleShuffle}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 bg-slate-50 border border-slate-200 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-md transition-all group/refresh shadow-sm"
                        title="Kelimeleri Karıştır"
                    >
                        <RotateCcw className="w-3.5 h-3.5 group-active/refresh:rotate-[-45deg] transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">Yenile</span>
                    </button>
                    <div className="h-4 w-px bg-slate-200 mx-1"></div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={showLang === "EN"}
                        aria-label="Dil değiştir"
                        onClick={() => {
                            setShowLang(prev => (prev === "TR" ? "EN" : "TR"));
                            handleShuffle();
                        }}
                        className={`relative inline-flex items-center w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none 
                        ${showLang === "EN" ? "bg-indigo-500" : "bg-slate-300"} `}
                    >
                        <span className="absolute inset-0 flex justify-between items-center px-2 text-[10px] font-bold uppercase pointer-events-none">
                            <span className={`transition-opacity duration-200 ${showLang === "TR" ? "opacity-100" : "opacity-40"}`}>
                                TR
                            </span>
                            <span className={`transition-opacity duration-200 ${showLang === "EN" ? "opacity-100" : "opacity-40"}`}>
                                EN
                            </span>
                        </span>

                        <span className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300  ${showLang === "EN" ? "translate-x-8" : "translate-x-0"}`} />
                    </button>

                </div>
            </div>

            {/* words list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2">
                {words.map((word, index) => (
                    <div
                        key={index}
                        className="group flex items-center justify-between bg-white border border-slate-200 hover:border-slate-300 rounded p-1.5 shadow-sm"
                    >
                        {/* source word */}
                        <div className="flex flex-col flex-1 min-w-0 px-2">
                            <span className="text-[13px] font-bold text-slate-700 truncate leading-relaxed">
                                {showLang === 'TR'
                                    ? (word?.translation || "") : (word?.text || "")}
                            </span>
                        </div>

                        <div className="h-6 w-px bg-slate-100 mx-1"></div>      {/* didiver */}

                        {/* input field */}
                        <div className="flex flex-col flex-1 min-w-0 px-2">
                            <input
                                type="text"
                                placeholder="Cevabını yaz..."
                                maxLength={20}
                                value={
                                    results[index] === false || results[index] === true
                                        ? (showLang === "TR" ? normalize(word?.text) : normalize(word?.translation))
                                        : (answers[index] || "")
                                }
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                readOnly={results[index] === true}
                                className={`w-full px-2 py-1 rounded border text-[13px] font-bold tracking-tight outline-none disabled:cursor-not-allowed 
                                            ${results[index] === true
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                        : results[index] === false
                                            ? "bg-red-50 border-red-500 text-red-600 font-black italic"
                                            : "bg-white border-slate-200 text-slate-700 focus:border-slate-400"
                                    }`}
                            />
                        </div>

                        {/* action buttons */}
                        <div className="flex items-center">
                            {results[index] === false || results[index] === true ? (
                                <button
                                    className="ml-2 p-1.5 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200"
                                    onClick={() => handleRetry(index)}
                                >
                                    <RotateCw className="w-3.5 h-3.5" />
                                </button>
                            ) : (
                                <button
                                    className={`ml-2 p-1.5 rounded-full transition-colors ${results[index] === true
                                        ? "bg-emerald-100 text-emerald-700 cursor-default"
                                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        }`}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => results[index] !== true && handleCheck(index)}
                                    disabled={results[index] === true}
                                >
                                    <Check className="w-3.5 h-3.5" />
                                </button>
                            )}

                            <button
                                className="ml-2 p-1.5 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleSaveWord(index)}
                                disabled={saving === index}
                            >
                                {saving === index ? (
                                    <Loader className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Save className="w-3.5 h-3.5" />
                                )}
                            </button>

                            <button
                                className="ml-2 p-1.5 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200"
                                onClick={() => handleSpeechWord(index)}
                            >
                                <Volume2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
