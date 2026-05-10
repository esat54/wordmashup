import { useState, useEffect } from "react";
import { Search, Volume2, Info, Plus, CheckCircle2, Clock, Circle, Pencil, ChevronLeft, ChevronRight, Lightbulb, Layout, FileText, TextQuote, BookOpen, BookMarked, BarChart3, PieChart, Heart, Calendar } from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const features = [
    { id: 0, title: "Yapay Zeka Sözlük", description: "Kelime analizlerini yapay zeka desteğiyle anında yapın ve örneklerle pekiştirin." },
    { id: 1, title: "Oxford Kelime Listesi", description: "Akademik başarı için en önemli 3000 kelimeye tek tıkla ulaş ve not al." },
    { id: 2, title: "Gramer Yapıları", description: "Kendi gramer notlarınızı oluşturun ve cümlelerle ilişkilendirin." },
    { id: 3, title: "İlerleme Takibi", description: "Gelişiminizi görsel grafiklerle izleyin ve hedeflerinize ulaşın." },
];

export default function Features() {
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (window.innerWidth >= 1024) {
                setActiveTab((prev) => (prev + 1) % features.length);
            }
        }, 4000);
        return () => clearInterval(timer);
    }, []);

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
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">Kelime Dağarcığınızı Güçlendiren Araçlar</h2>
                        <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed opacity-90 italic">"Kişisel kütüphane, yapay zeka destekli analiz ve sistemli dil yönetimi tek bir platformda."</p>
                    </div>
                </div>

                <div className="relative w-full overflow-x-hidden">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center">


                            <div className="lg:col-span-4"> 
                                <div className="lg:hidden mb-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <button onClick={() => setActiveTab((activeTab - 1 + features.length) % features.length)} aria-label="Önceki" className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all"><ChevronLeft className="w-4 h-4 text-white" /></button>
                                        <div className="flex-1 text-center">
                                            <p className="text-base font-bold text-white leading-snug">{features[activeTab].title}</p>
                                            <p className="text-xs text-blue-200 mt-1 leading-relaxed line-clamp-2">{features[activeTab].description}</p>
                                        </div>
                                        <button onClick={() => setActiveTab((activeTab + 1) % features.length)} aria-label="Sonraki" className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all"><ChevronRight className="w-4 h-4 text-white" /></button>
                                    </div>
                                    <div className="flex justify-center gap-1.5 mt-3">
                                        {features.map((_, i) => <button key={i} onClick={() => setActiveTab(i)} aria-label={`Sekme ${i + 1}`} className={`transition-all rounded-full ${activeTab === i ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"}`} />)}
                                    </div>
                                </div>
                                <div className="hidden lg:flex flex-col">
                                    {features.map((f) => (
                                        <div key={f.id} onClick={() => setActiveTab(f.id)} className={`cursor-pointer p-4 rounded-l-xl rounded-r-none transition-all duration-200 border-none ${activeTab === f.id ? "bg-white/10 shadow-none" : "opacity-60 hover:opacity-100 hover:bg-white/5"}`}>
                                            <h3 className="text-base font-bold text-white mb-1">{f.title}</h3>
                                            <p className="text-[13px] text-blue-100 leading-relaxed">{f.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>  

                            <div className="lg:col-span-8">
                                <div className="relative w-full lg:w-[880px] max-w-none">
                                    <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white shadow-2xl">
                                        <div className="relative w-full flex flex-col overflow-hidden p-[3%] gap-[2%] min-h-[320px] sm:min-h-[380px] lg:aspect-[2174/1464] lg:min-h-0">
                                            {/* aI dictionary */}
                                            <div className={`flex-1 rounded-xl ${activeTab === 0 ? "block" : "hidden"}`}>
                                                <div className="flex items-center gap-3 mb-8 bg-slate-100 p-2 rounded-lg border border-slate-200">
                                                    <div className="relative flex-1">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input type="text" readOnly placeholder="Çevirmek istediğiniz kelimeyi veya cümleyi İngilizce/Türkçe giriniz..." aria-label="Arama Kutusu" className="w-full bg-transparent pl-10 pr-4 py-2 text-sm outline-none font-medium text-slate-700" value="like" />
                                                    </div>
                                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">Analiz Et</button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                                                    {[
                                                        { type: "VERB", title: "Hoşlanmak, sevmek", phonetic: "/LAIK/", examples: [{ en: "I like swimming in the ocean.", tr: "Okyanusta yüzmeyi severim." }, { en: "Do you like Italian food?", tr: "İtalyan yemeklerini sever misin?" }, { en: "I like listening to music while working.", tr: "Çalışırken müzik dinlemeyi severim." }] },
                                                        { type: "PREPOSITION", title: "Gibi (benzerlik)", phonetic: "/LAIK/", examples: [{ en: "She looks like her mother.", tr: "Annesine benziyor." }, { en: "It smells like roses in here.", tr: "Burası gül gibi kokuyor." }, { en: "This cake tastes like chocolate.", tr: "Bu kekin tadı çikolata gibi." }] },
                                                        { type: "PREPOSITION", title: "Gibi (örnekleme)", phonetic: "/LAIK/", examples: [{ en: "I like fruits like apples.", tr: "Elma gibi meyveleri severim." }, { en: "I want a car like yours.", tr: "Seninki gibi bir araba istiyorum." }, { en: "Cities like Istanbul and London are very crowded.", tr: "İstanbul ve Londra gibi şehirler çok kalabalıktır." }] }
                                                    ].map((card, idx) => (
                                                        <div key={idx} className={`group flex flex-col bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:border-blue-200 min-h-[400px] ${idx === 2 ? "hidden md:flex" : "flex"}`}>
                                                            <div className="flex justify-between items-start mb-4">
                                                                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">{card.type}</span>
                                                                <button aria-label="Sesli Dinle" className="focus:outline-none"><Volume2 className="w-4 h-4 text-slate-400 hover:text-blue-500 cursor-pointer transition-colors" /></button>
                                                            </div>
                                                            <h4 className="text-lg font-bold text-slate-800 mb-1">{card.title}</h4>
                                                            <span className="text-xs text-slate-400 font-mono mb-6">{card.phonetic}</span>
                                                            <div className="space-y-5 mb-6 flex-1">
                                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight"><Info className="w-3 h-3" /> Örnekler</div>
                                                                {card.examples.map((ex, i) => (
                                                                    <div key={i} className="border-l-2 border-slate-100 pl-3">
                                                                        <p className="text-[13px] text-slate-700 leading-snug font-medium">{ex.en}</p>
                                                                        <p className="text-[12px] text-slate-400 mt-1 italic">{ex.tr}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-100 rounded-lg text-xs font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 mt-auto"><Plus className="w-3 h-3" /> Listeye Ekle</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* oxford word list */}
                                            <div className={`flex-1 rounded-xl flex-col overflow-hidden min-h-0 ${activeTab === 1 ? "flex" : "hidden"}`}>
                                                <div className="bg-white rounded-lg border border-slate-200 p-1.5 shrink-0">
                                                    <div className="hidden sm:flex justify-between gap-1">
                                                        {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((letter) => (
                                                            <button key={letter} className={`flex-1 h-6 flex items-center justify-center rounded text-[10px] font-bold transition-all ${letter === "A" ? "bg-blue-600 text-white shadow-sm" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>{letter}</button>
                                                        ))}
                                                    </div>
                                                    <div className="flex sm:hidden justify-between gap-0.5">
                                                        {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].map((letter) => (
                                                            <button key={letter} className={`flex-1 h-6 flex items-center justify-center rounded text-[9px] font-bold transition-all ${letter === "A" ? "bg-blue-600 text-white shadow-sm" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>{letter}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center shrink-0 mt-2 rounded-lg border border-slate-200 mb-2">
                                                    <div className="w-1/3" />
                                                    <div className="w-1/3  flex items-center justify-center gap-2  py-1">
                                                        <button aria-label="Önceki Sayfa" className="p-0.5 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft className="w-3 h-3 text-slate-400" /></button>
                                                        <span className="text-[10px] font-semibold text-slate-500">1 / 6</span>
                                                        <button aria-label="Sonraki Sayfa" className="p-0.5 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight className="w-3 h-3 text-slate-400" /></button>
                                                    </div>
                                                    <div className="w-1/3" />
                                                </div>
                                                <div className="flex-1 overflow-hidden mt-1">
                                                    <table className="w-full text-sm table-fixed">
                                                        <colgroup><col className="w-1/3" /><col className="w-1/3" /><col className="w-1/3" /></colgroup>
                                                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Kelime</th>
                                                                <th className="px-3 py-2 text-center font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Çeviri</th>
                                                                <th className="px-3 py-2 text-right font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Durum</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {[
                                                                { word: "April", translation: "Nisan", status: "completed" }, { word: "August", translation: "Ağustos", status: "completed" },
                                                                { word: "a", translation: "bir", status: "completed" }, { word: "a couple", translation: "bir çift", status: "pending" },
                                                                { word: "a.m.", translation: "sabah", status: "completed" }, { word: "abandon", translation: "terk etmek", status: "learning" },
                                                                { word: "abandoned", translation: "terkedilmiş", status: "learning" }, { word: "ability", translation: "kabiliyet", status: "completed" },
                                                                { word: "able", translation: "yapabilen", status: "completed" }, { word: "about", translation: "hakkında", status: "completed" },
                                                                { word: "above", translation: "üstünde", status: "completed" }, { word: "abroad", translation: "yurt dışında", status: "learning" },
                                                                { word: "academic", translation: "akademik", status: "completed" }, { word: "accept", translation: "kabul etmek", status: "completed" },
                                                                { word: "access", translation: "erişim", status: "completed" }, { word: "accident", translation: "kaza", status: "completed" },
                                                            ].map((item, idx) => (
                                                                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                                                                    <td className="px-3 py-2"><span className="font-medium text-slate-800 text-[12px]">{item.word}</span></td>
                                                                    <td className="px-3 py-2 text-center text-slate-500 text-[12px]">{item.translation}</td>
                                                                    <td className="px-3 py-2">
                                                                        <div className="flex items-center justify-end gap-1">
                                                                            {item.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                                                                            {item.status === "learning" && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                                                                            {item.status === "pending" && <Circle className="w-3.5 h-3.5 text-slate-300" />}
                                                                            <button aria-label="Düzenle" className="p-0.5 hover:bg-blue-50 rounded transition-colors"><Pencil className="w-3 h-3 text-slate-400 hover:text-blue-500" /></button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* grammar structures */}
                                            <div className={`flex-1 flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar ${activeTab === 2 ? "flex" : "hidden"}`}>
                                                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm shrink-0">
                                                    <h3 className="text-xl font-bold tracking-tight text-slate-800">Present Perfect Tense</h3>
                                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-md uppercase tracking-wider border border-blue-100">Intermediate (B1)</span>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
                                                    <section className="bg-slate-900 rounded-xl overflow-hidden shadow-md group relative p-5 min-h-[140px] flex flex-col justify-center">
                                                        <div className="absolute top-3 left-5 flex items-center gap-2"><Lightbulb className="w-3.5 h-3.5 text-yellow-400" /><h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">YAPI FORMÜLÜ</h2></div>
                                                        <code className="block text-lg font-mono font-medium text-slate-300 leading-relaxed text-center mt-4">Subject + have/has + V3 (Past Participle)</code>
                                                    </section>
                                                    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col group min-h-[140px]">
                                                        <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2"><Layout className="w-3.5 h-3.5 text-blue-600" /><h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TANIM</h2></div>
                                                        <p className="text-[13px] leading-relaxed text-slate-600 font-medium">Geçmişte başlamış ve etkisi hala devam eden veya tam zamanı belirtilmeyen deneyimleri ifade etmek için kullanılır.</p>
                                                    </section>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
                                                    <div className="flex flex-col gap-2">
                                                        <h2 className="text-[10px] font-bold text-[#854D0E] uppercase flex items-center gap-2 tracking-widest px-1"><Info className="w-3.5 h-3.5" /> ÖNEMLİ NOTLAR</h2>
                                                        <div className="bg-[#FFFCF0] border border-[#F1E5BC] rounded-xl p-5 flex-1"><p className="text-[13px] leading-relaxed text-[#78350f] font-semibold italic">"Just, already, yet" gibi zaman zarfları bu tensede fiilden önce veya cümle sonunda sıkça kullanılır.</p></div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <h2 className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest px-1"><FileText className="w-3.5 h-3.5 text-blue-600" /> KULLANIM KURALLARI</h2>
                                                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 flex-1">
                                                            <ul className="text-[13px] space-y-2 text-slate-700 font-medium">
                                                                <li className="flex items-start gap-2">• He/She/It için "has", diğerleri için "have" kullanılır.</li>
                                                                <li className="flex items-start gap-2">• Geçmişte belirsiz bir zamanda yapılan işler için idealdir.</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
                                                    <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
                                                        <h2 className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest"><TextQuote className="w-3.5 h-3.5" /> ÖRNEK CÜMLELER</h2>
                                                        <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-white border border-slate-200 rounded shadow-xs">2 Örnek</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                                        {[{ en: "The paradigm has shifted irreversibly.", tr: "Paradigma geri döndürülemez biçimde değişmiştir." }, { en: "Global markets have remained volatile.", tr: "Küresel piyasalar dalgalı kalmıştır." }].map((ex, i) => (
                                                            <div key={i} className="p-4 hover:bg-slate-50 transition-colors group">
                                                                <p className="text-[14px] font-bold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">{ex.en}</p>
                                                                <p className="text-[12px] text-slate-500 font-medium italic">{ex.tr}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>

                                            {/* progress tracking */}
                                            <div className={`flex-1 flex-col gap-3 overflow-hidden pr-2 ${activeTab === 3 ? "flex" : "hidden"}`}>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                                                    {[
                                                        { label: "TOPLAM KELİME", value: 49, icon: BookOpen },
                                                        { label: "TOPLAM FAVORİ", value: 8, icon: Heart },
                                                        { label: "TOPLAM GRAMER", value: 10, icon: FileText },
                                                        { label: "TOPLAM BUGÜN", value: 5, icon: Calendar }
                                                    ].map((stat, i) => (
                                                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                                                            <div className="p-2.5 bg-slate-50 rounded-lg shrink-0"><stat.icon size={20} className="text-slate-700" /></div>
                                                            <div>
                                                                <div className="text-2xl font-black text-slate-800 leading-none">{stat.value}</div>
                                                                <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 shrink-0">
                                                    <div className="md:col-span-2 lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-[230px] lg:h-[320px] flex flex-col">
                                                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6"><BarChart3 size={14} className="text-blue-500" /> 7 GÜNLÜK ANALİZ</h3>
                                                        <div className="flex-1 w-full [&_*]:outline-none [&_*]:focus:outline-none">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <ReBarChart data={[{ date: "22/02", count: 3 }, { date: "23/02", count: 0 }, { date: "24/02", count: 8 }, { date: "25/02", count: 20 }, { date: "26/02", count: 4 }, { date: "27/02", count: 0 }, { date: "28/02", count: 9 }]} margin={{ top: 5, right: 10, left: 5, bottom: 5 }} barCategoryGap="20%">
                                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                                    <XAxis dataKey="date" type="category" interval={0} tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#d1d5db" tickMargin={8} padding={{ left: 10, right: 10 }} />
                                                                    <YAxis hide />
                                                                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(value: any) => [value, 'Eklenen Kelime']} />
                                                                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} stroke="none" barSize={30} isAnimationActive={false} style={{ outline: 'none' }} />
                                                                </ReBarChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-[230px] md:h-auto md:min-h-[230px] lg:h-[320px] lg:min-h-0 flex flex-col">
                                                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4"><PieChart size={14} className="text-purple-500" /> TÜR DAĞILIMI</h3>
                                                        <div className="flex-1 flex flex-row lg:flex-col gap-3 min-h-0">
                                                            <div className="flex-1 min-w-0">
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <RechartsPieChart>
                                                                        <Pie data={[{ name: 'İsim', count: 17, color: '#8b5cf6' }, { name: 'Fiil', count: 21, color: '#ef4444' }, { name: 'Fiil Öbeği', count: 5, color: '#f87171' }, { name: 'Sıfat', count: 9, color: '#10b981' }, { name: 'Diğer', count: 2, color: '#f59e0b' }]} cx="50%" cy="50%" innerRadius={0} outerRadius={65} paddingAngle={2} dataKey="count" isAnimationActive={false} style={{ outline: 'none' }}>
                                                                            {[{ color: '#8b5cf6' }, { color: '#ef4444' }, { color: '#f87171' }, { color: '#10b981' }, { color: '#f59e0b' }].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" style={{ outline: 'none' }} />)}
                                                                        </Pie>
                                                                        <Tooltip />
                                                                    </RechartsPieChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                            <div className="flex flex-col justify-center lg:justify-start gap-2 w-[90px] lg:w-auto flex-shrink-0 lg:flex-shrink lg:border-t lg:border-slate-50 lg:pt-4 lg:mt-4">
                                                                <div className="text-xs font-bold text-slate-700 mb-1">Toplam: 54</div>
                                                                <div className="lg:grid lg:grid-cols-2 flex flex-col gap-2">
                                                                    {[{ label: "İsim", value: 17, color: "bg-purple-500" }, { label: "Fiil", value: 21, color: "bg-red-500" }, { label: "Fiil Öbeği", value: 5, color: "bg-red-400" }, { label: "Sıfat", value: 9, color: "bg-emerald-500" }, { label: "Diğer", value: 2, color: "bg-amber-500" }].map((item, i) => (
                                                                        <div key={i} className="flex items-center justify-between text-[10px]">
                                                                            <div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} /><span className="text-slate-500 font-medium">{item.label}:</span></div>
                                                                            <span className="text-slate-800 font-bold">{item.value}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                                                        <div className="bg-white border border-slate-200 rounded-xl px-4 pt-4 pb-3 shadow-sm flex flex-col h-full">
                                                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3"><BookMarked size={14} className="text-blue-500" /> SON EKLENEN KELİMELER</h3>
                                                            <div className="grid grid-cols-3 gap-3 flex-1">
                                                                {[{ word: "abandon", tr: "terk etmek" }, { word: "ability", tr: "kabiliyet" }, { word: "academic", tr: "akademik" }].map((item, i) => (
                                                                    <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-center min-h-[60px]">
                                                                        <span className="text-[12px] font-bold text-slate-700 truncate">{item.word}</span>
                                                                        <span className="text-[10px] text-slate-500 truncate">{item.tr}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="bg-white border border-slate-200 rounded-xl px-4 pt-4 pb-3 shadow-sm flex flex-col h-full">
                                                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3"><FileText size={14} className="text-purple-500" /> SON EKLENEN GRAMERLER</h3>
                                                            <div className="grid grid-cols-2 gap-3 flex-1">
                                                                {[{ title: "Present Perfect" }, { title: "Passive Voice" }].map((item, i) => (
                                                                    <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center min-h-[60px]">
                                                                        <span className="text-[12px] font-bold text-slate-700 truncate">{item.title}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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