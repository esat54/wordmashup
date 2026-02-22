

import { Check, RotateCw, Save, Loader, Volume2 } from "lucide-react";

interface WordCardProps {
    word: any;
    index: number;
    showLang: "TR" | "EN";
    answer: string;
    result: null | boolean;
    saving: boolean;
    onInputChange: (index: number, value: string) => void;
    onCheck: (index: number) => void;
    onRetry: (index: number) => void;
    onSave: (index: number) => void;
    onSpeak: (index: number) => void;
    normalize: (str?: string) => string;
}

export default function WordCard({ word, index, showLang, answer, result, saving, onInputChange, onCheck, onRetry, onSave, onSpeak, normalize }: WordCardProps) {
    return (
        <div className="group flex items-center justify-between bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-700 rounded p-1.5 shadow-sm">
            {/* source word */}
            <div className="flex flex-col flex-1 min-w-0 px-2">
                <span className="text-[13px] font-bold text-slate-700 dark:text-gray-300 truncate leading-relaxed">
                    {showLang === "TR" ? (word?.translation || "") : (word?.text || "")}
                </span>
            </div>

            <div className="h-6 w-px bg-slate-100 dark:bg-gray-700 mx-1"></div>

            {/* input field */}
            <div className="flex flex-col flex-1 min-w-0 px-2">
                <input
                    type="text"
                    placeholder="Cevabını yaz..."
                    maxLength={20}
                    value={
                        result === false || result === true
                            ? (showLang === "TR" ? normalize(word?.text) : normalize(word?.translation))
                            : (answer || "")
                    }
                    onChange={(e) => onInputChange(index, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && result === null) {
                            e.preventDefault();
                            onCheck(index);
                        }
                    }}
                    readOnly={result === true}
                    className={`w-full px-2 py-1 rounded border text-[13px] font-bold tracking-tight outline-none disabled:cursor-not-allowed 
                        ${result === true
                            ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300"
                            : result === false
                                ? "bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-400 text-red-600 dark:text-red-300 font-black italic"
                                : "bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-slate-400 dark:focus:border-gray-500"}`}
                />
            </div>

            {/* action buttons */}
            <div className="flex items-center">
                {result === false || result === true ? (
                    <button
                        className="ml-2 p-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800/40"
                        onClick={() => onRetry(index)}
                    >
                        <RotateCw className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <button
                        className="ml-2 p-1.5 rounded-full transition-colors bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => onCheck(index)}
                    >
                        <Check className="w-3.5 h-3.5" />
                    </button>
                )}

                <button
                    className="ml-2 p-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onSave(index)}
                    disabled={saving}
                >
                    {saving ? (
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Save className="w-3.5 h-3.5" />
                    )}
                </button>

                <button
                    className="ml-2 p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800/40"
                    onClick={() => onSpeak(index)}
                >
                    <Volume2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
