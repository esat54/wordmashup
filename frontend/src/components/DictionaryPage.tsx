"use client";

import { useState } from "react";
import { Search, Loader2, Volume2, Plus, BookOpen, X, Info, Sparkles } from "lucide-react";
import { dictionaryApi } from "../lib/api";

export default function DictionaryPage() {
    const [word, setWord] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);
    const [message, setMessage] = useState("");

    const handleSearch = async () => {
        if (!word.trim()) return;

        setLoading(true);
        setResults(null);
        setMessage("");

        try {
            const data = await dictionaryApi.analyzeWord(word) as any;
            setResults(data);

        } catch (error: any) {
            console.error("AI Analiz Hatası:", error);
            setMessage(error.message || "Analiz sırasında bir hata oluştu. Lütfen giriş yaptığınızdan emin olun.");
        } finally {
            setLoading(false);
        }
    };

    const speak = (text: string) => {
        if (typeof window === "undefined") return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sözlük</h1>
            </div>

            {message && (
                <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700">
                    <span className="text-sm font-medium">{message}</span>
                    <button onClick={() => setMessage("")} className="hover:text-gray-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="İngilizce kelime yazın..."
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analiz Et"}
                    </button>
                </div>
            </div>

            {/* Sonuç konteynırı*/}
            <div className="bg-white rounded-lg border border-gray-200 min-h-[500px] flex flex-col relative transition-all overflow-hidden">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                        <p className="text-gray-500 text-sm font-medium animate-pulse uppercase tracking-wider">Kelime Çözümleniyor...</p>
                    </div>
                ) : results ? (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                        {results.map((i, index) => (
                            <div key={index} className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">

                                <div className="p-5 border-b border-gray-100">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded border border-blue-100">
                                            {i.type}
                                        </span>
                                        <button onClick={() => speak(word)} className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <Volume2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {i.meaning}
                                    </h3>
                                    <span className="text-xs font-mono text-gray-400 mt-1 block uppercase font-medium">
                                        {i.ipa}
                                    </span>
                                </div>

                                <div className="p-5 space-y-5 flex-1">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Info className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Örnekler</span>
                                    </div>
                                    <div className="space-y-4">
                                        {i.examples.map((x: any, i: number) => (
                                            <div key={i} className="group/ex cursor-pointer" onClick={() => speak(x.en)}>
                                                <p className="text-sm font-medium text-gray-700 leading-relaxed group-hover/ex:text-blue-600 transition-colors">
                                                    {x.en}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5 italic leading-relaxed">
                                                    {x.tr}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                                    <button
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                        onClick={() => setMessage(`${word} listeye eklendi!`)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Listeye Ekle
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-100">
                            <BookOpen className="w-8 h-8 text-gray-200" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Analiz Bekleniyor</h2>
                        <p className="text-gray-400 max-w-xs mx-auto text-sm">
                            Bir kelime arattığınızda analiz sonuçlarını bu panel üzerinde göreceksiniz.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}