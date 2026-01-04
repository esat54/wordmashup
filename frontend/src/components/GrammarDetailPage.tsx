"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Info, TextQuote, Layout, FileText } from "lucide-react";
import { grammarApi } from "@/lib/api";

export default function GrammarDetailPage({ grammarId, onBack }: { grammarId: string; onBack: () => void }) {
    const [grammar, setGrammar] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        grammarApi.getGrammarById(grammarId).then((res: any) => {
            setGrammar(res);
            setLoading(false);
        });
    }, [grammarId]);

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
    );

    if (!grammar) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-5 antialiased text-slate-900 px-4 sm:px-0">
            <header className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-5">
                    <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100 shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="h-6 w-px bg-slate-200" />
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                        {grammar.title}
                    </h1>
                </div>
                <div>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-md uppercase tracking-wider border border-blue-100">
                        {grammar.category}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-8 space-y-5">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">  {/* tanım ve formül */}
                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 tracking-widest">
                                    <Layout className="w-4 h-4" /> TANIM
                                </h2>
                                <p className="text-[16px] leading-relaxed text-slate-700 font-medium">
                                    {grammar.description || "Bu yapı için bir açıklama metni bulunmamaktadır."}
                                </p>
                            </div>
                            {grammar.formula && (
                                <div className="w-full md:w-auto min-w-[280px] bg-slate-50 border border-slate-200 rounded-lg p-4">
                                    <h2 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">YAPI / FORMÜL</h2>
                                    <code className="text-[15px] font-mono font-bold text-blue-700 break-all leading-tight">
                                        {grammar.formula}
                                    </code>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#FFFCF0] border border-[#F1E5BC] rounded-xl p-6 shadow-sm"> {/* notlar */}
                        <h2 className="text-xs font-bold text-[#854D0E] uppercase mb-4 flex items-center gap-2 tracking-widest">
                            <Info className="w-4 h-4" /> NOTLAR
                        </h2>
                        <div className="text-[16px] leading-relaxed text-[#78350f] whitespace-pre-wrap font-semibold italic">
                            {grammar.notes || "Bu konu hakkında henüz bir not eklenmedi."}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4">  {/* kurallar */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
                        <h2 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2 tracking-widest">
                            <FileText className="w-4 h-4 text-blue-600" /> KULLANIM KURALLARI
                        </h2>
                        <div className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
                            {grammar.rules || "Kural bilgisi mevcut değil."}
                        </div>
                    </div>
                </div>

                <div className="col-span-12">  {/* örnek cümleler */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                                <TextQuote className="w-4 h-4" /> ÖRNEK CÜMLELER
                            </h2>
                            <span className="text-xs font-bold text-slate-400 px-2 py-0.5 border border-slate-200 rounded">
                                {grammar.examples?.length || 0} Örnek
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-slate-100">
                            {grammar.examples?.map((ex: any, i: number) => (
                                <div key={i} className="p-5 hover:bg-slate-50/50 transition-colors group">
                                    <p className="text-[16px] font-bold text-slate-900 mb-1.5 leading-tight group-hover:text-blue-700 transition-colors">
                                        {ex.en}
                                    </p>
                                    <p className="text-[14px] text-slate-500 font-medium italic">
                                        {ex.tr}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}