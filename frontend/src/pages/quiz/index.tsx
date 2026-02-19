"use client";

import { useState } from "react";
import { AreaChart, BookOpen, } from "lucide-react";
import GapFilling from "@/components/WordQuiz/GapFilling";
import MyQuizWordList from "@/components/WordQuiz/MyQuizWordList";

export default function QuizPage() {
    const [currentView, setCurrentView] = useState<"play" | "saved">("play");

    const handleViewSwitch = (view: "play" | "saved") => {
        setCurrentView(view);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-6 px-4 font-sans antialiased text-slate-900">
            <div className="max-w-5xl mx-auto">

                {/* header / navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 mb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">Kelime Portalı</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Eğitim Yönetim Paneli</p>
                    </div>

                    <div className="flex bg-slate-200/50 p-1 rounded-md gap-1 mt-4 md:mt-0">
                        <button
                            onClick={() => handleViewSwitch("play")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-semibold transition-all
                            ${currentView === "play"
                                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                    : "text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            <AreaChart className="w-3.5 h-3.5" />
                            PRATİK YAP
                        </button>
                        <button
                            onClick={() => handleViewSwitch("saved")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-semibold transition-all
                            ${currentView === "saved"
                                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                    : "text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            KELİME LİSTESİ
                        </button>
                    </div>
                </div>

                {/* content field */}
                {currentView === "play" ? (
                    <div className=" rounded-lg  min-h-[400px]">
                        <GapFilling />
                    </div>
                ) : (
                    <div className="rounded-lg  min-h-[400px]">
                        <MyQuizWordList />
                    </div>
                )}
            </div>

        </div>
    );
}
