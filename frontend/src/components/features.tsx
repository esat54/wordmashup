"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const features = [
    {
        id: 0,
        title: "Yapay Zeka Sözlük",
        description: "Kelime analizlerini yapay zeka desteğiyle anında yapın ve örneklerle pekiştirin.",
        image: "/examplaimage1.png",
    },
    {
        id: 1,
        title: "Oxford Listeleri",
        description: "Akademik başarı için en önemli 3000 kelimeye tek tıkla ulaşın.",
        image: "/examplaimage2.png",
    },
    {
        id: 2,
        title: "Gramer Yapıları",
        description: "Kendi gramer notlarınızı oluşturun ve kelimelerle ilişkilendirin.",
        image: "/examplaimage3.png",
    },
    {
        id: 3,
        title: "İlerleme Takibi",
        description: "Gelişiminizi görsel grafiklerle izleyin ve hedeflerinize ulaşın.",
        image: "/examplaimage4.png",
    },
];

export default function HeroArea() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 mb-10 ">
                    <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-slate-600 font-bold text-2xl tracking-tight">+3000</span>
                        <span className="text-slate-400 text-[13px] font-medium mt-1">Oxford Kelime Listesi</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center border-l border-slate-100">
                        <span className="text-slate-600 font-bold text-2xl tracking-tight">+10</span>
                        <span className="text-slate-400 text-[13px] font-medium mt-1">Hazır Gramer Yapısı</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center border-l border-slate-100">
                        <span className="text-slate-600 font-bold text-2xl tracking-tight">AI</span>
                        <span className="text-slate-400 text-[13px] font-medium mt-1">Kelime Analizi</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center border-l border-slate-100">
                        <span className="text-slate-600 font-bold text-2xl tracking-tight">7/24</span>
                        <span className="text-slate-400 text-[13px] font-medium mt-1">Kişisel Arşiv</span>
                    </div>
                </div>
            </div>

            <div className="bg-blue-600 bg-gradient-to-br from-blue-600 to-indigo-700 py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full text-center mb-16">
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
                            Kelime Dağarcığınızı Güçlendiren Araçlar
                        </h2>
                        <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed opacity-90 italic">
                            "Kişisel kütüphane, yapay zeka destekli analiz ve sistemli dil yönetimi tek bir platformda."
                        </p>
                    </div>
                </div>

                <div className="relative w-full overflow-x-hidden">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center">

                            <div className="lg:col-span-4">
                                <div className="lg:hidden flex flex-col items-center text-center mb-10">
                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        {features.map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => setActiveTab(f.id)}
                                                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${activeTab === f.id
                                                    ? "bg-white text-blue-600 shadow-lg"
                                                    : "bg-white/10 text-white border border-white/10"
                                                    }`}
                                            >
                                                {f.title}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="px-4">
                                        <p className="text-sm text-blue-100 leading-relaxed min-h-[40px]">
                                            {features[activeTab].description}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden lg:flex flex-col">
                                    {features.map((feature) => (
                                        <div
                                            key={feature.id}
                                            onClick={() => setActiveTab(feature.id)}
                                            className={`cursor-pointer p-4 rounded-l-xl rounded-r-none transition-all duration-200 border-none ${activeTab === feature.id
                                                ? "bg-white/10 shadow-none"
                                                : "opacity-60 hover:opacity-100 hover:bg-white/5"
                                                }`}
                                        >
                                            <h3 className="text-base font-bold text-white mb-1">
                                                {feature.title}
                                            </h3>
                                            <p className="text-[13px] text-blue-100 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-8">
                                <div className="relative w-full lg:w-[880px] max-w-none">
                                    <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white shadow-2xl border border-white/10">
                                        <div className="relative aspect-[2174/1464] w-full bg-slate-50">
                                            <img
                                                src={features[activeTab].image}
                                                className="w-full h-full object-cover object-left-top"
                                                alt={features[activeTab].title}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}