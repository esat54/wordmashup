"use client";

import { useEffect, useState } from "react";
import { Search, Pin, PinOff, X, BookOpen, Loader2, Plus, List, Trash2, Eye } from "lucide-react";
import { grammarApi } from "@/lib/api";

interface GrammarExample {
    en: string;
    tr: string;
}

interface Grammar {
    _id: string;
    category: string;
    title: string;
    description?: string;
    formula?: string;
    rules?: string;
    notes?: string;
    examples?: GrammarExample[];
    isPinned?: boolean;
    isGlobal?: boolean;
}


interface GramerPageProps {
    onGrammarClick?: (id: string, slug: string) => void;
}

export default function GramerPage({ onGrammarClick }: GramerPageProps) {
    const [currentView, setCurrentView] = useState<"list" | "add">("list");
    const [grammars, setGrammars] = useState<Grammar[]>([]);
    const [globalGrammars, setGlobalGrammars] = useState<Grammar[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState<string>("");
    const [formData, setFormData] = useState({
        category: "",
        title: "",
        description: "",
        formula: "",
        rules: "",
        notes: "",
        examples: [{ en: "", tr: "" }]
    });
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        loadCategories();
        loadGrammars();
        loadGlobalGrammars();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        loadGrammars();
    }, [selectedCategory, debouncedSearchTerm]);

    const loadCategories = async () => {
        try {
            const response = await grammarApi.getCategories() as any;
            setCategories(response.categories || []);
        } catch (err: any) {
            console.error("Kategoriler yüklenirken hata:", err);
        }
    };

    const loadGrammars = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await grammarApi.getAllGrammars({
                category: selectedCategory,
                search: debouncedSearchTerm
            }) as any;

            setTimeout(() => {
                setGrammars(response.grammars || []);
                setLoading(false);
            }, 300);
        } catch (err: any) {
            console.error("Gramer konuları yüklenirken hata:", err);
            setError(err.message || "Gramer konuları yüklenirken bir hata oluştu");
            setGrammars([]);
            setLoading(false);
        }
    };

    const loadGlobalGrammars = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await grammarApi.getGlobalGrammars() as any;
            setGlobalGrammars(response.grammars || []);
        } catch (err: any) {
            console.error("Gramer konuları yüklenirken hata:", err);
            setError(err.message || "Hazır Gramer konuları yüklenirken bir hata oluştu");
            setGlobalGrammars([]);
            setLoading(false);
        }
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
            setCategories([...categories, newCategoryName.trim()]);
            setNewCategoryName("");
        }
    };

    const handleDeleteCategory = async (categoryName: string) => {
        if (!window.confirm(`"${categoryName}" kategorisini silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            await grammarApi.deleteCategory(categoryName);
            setCategories(categories.filter(c => c !== categoryName));
            if (selectedCategory === categoryName) {
                setSelectedCategory("all");
            }
            await loadGrammars();
        } catch (err: any) {
            alert(err.message || "Kategori silinirken bir hata oluştu");
        }
    };

    const handleViewClick = (e: React.MouseEvent, grammar: Grammar) => {
        e.stopPropagation();
        if (onGrammarClick) {
            const slug = grammar.title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            onGrammarClick(grammar._id, slug);
        }
    };

    const handleTogglePin = async (e: React.MouseEvent, grammarId: string) => {
        e.stopPropagation();
        try {
            await grammarApi.togglePin(grammarId);
            await loadGrammars();
        } catch (err: any) {
            console.error("Sabitleme hatası:", err);
        }
    };

    const handleDeleteGrammar = async (e: React.MouseEvent, grammarId: string, grammarTitle: string) => {
        e.stopPropagation();
        if (window.confirm(`"${grammarTitle}" gramer konusunu silmek istediğinize emin misiniz?`)) {
            try {
                await grammarApi.deleteGrammar(grammarId);
                await loadGrammars();
            } catch (err: any) {
                console.error("Silme hatası:", err);
                alert(err.message || "Gramer konusu silinirken bir hata oluştu");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveMessage("");

        if (!formData.category || !formData.title) {
            setSaveMessage("Kategori ve başlık zorunludur.");
            return;
        }

        try {
            setSaving(true);
            await grammarApi.createGrammar({
                category: formData.category,
                title: formData.title,
                description: formData.description || undefined,
                formula: formData.formula || undefined,
                rules: formData.rules || undefined,
                notes: formData.notes || undefined,
                examples: formData.examples.filter(ex => ex.en || ex.tr)
            });

            setSaveMessage("Gramer konusu başarıyla eklendi!");
            setFormData({
                category: "",
                title: "",
                description: "",
                formula: "",
                rules: "",
                notes: "",
                examples: [{ en: "", tr: "" }]
            });

            await loadCategories();
            setTimeout(() => {
                setCurrentView("list");
                loadGrammars();
            }, 1500);
        } catch (err: any) {
            setSaveMessage(err.message || "Gramer konusu eklenirken bir hata oluştu");
        } finally {
            setSaving(false);
        }
    };

    const handleFormKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
            e.preventDefault();
        }
    };

    if (currentView === "add") {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gramer</h1>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setCurrentView("list")}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            <List className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="whitespace-nowrap">Gramer listesi</span>
                        </button>
                        <button
                            onClick={() => setCurrentView("add")}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all bg-blue-600 text-white shadow-md"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="whitespace-nowrap">Yeni Konu Ekle</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Konu Ekle</h2>
                    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori Ekle
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddCategory();
                                            }
                                        }}
                                        placeholder="Yeni kategori"
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCategory}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                {categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {categories.map((cat) => (
                                            <span
                                                key={cat}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs"
                                            >
                                                {cat.length > 15 ? cat.substring(0, 15) + "..." : cat}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCategory(cat)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                >
                                    <option value="">Seçiniz</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Başlık <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Gramer konusu başlığı"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kısa Açıklama
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Kartta görünecek kısa açıklama"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none h-[42px]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Formül
                                </label>
                                <input
                                    type="text"
                                    value={formData.formula}
                                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                                    placeholder="Örn: Although + S + V + O"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none font-mono h-[42px]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kurallar
                                </label>
                                <textarea
                                    value={formData.rules}
                                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                    placeholder="Gramer kurallarını buraya yazın..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                                    style={{ whiteSpace: "pre-wrap" }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notlar
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Özel notlarınızı buraya yazın..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                                    style={{ whiteSpace: "pre-wrap" }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-medium text-gray-700">
                                    Örnek Cümleler
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, examples: [...formData.examples, { en: "", tr: "" }] })}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    + Örnek Ekle
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.examples.map((example, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="flex-1 space-y-1.5">
                                            <input
                                                type="text"
                                                value={example.en}
                                                onChange={(e) => {
                                                    const newExamples = [...formData.examples];
                                                    newExamples[index].en = e.target.value;
                                                    setFormData({ ...formData, examples: newExamples });
                                                }}
                                                placeholder="İngilizce cümle"
                                                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={example.tr}
                                                onChange={(e) => {
                                                    const newExamples = [...formData.examples];
                                                    newExamples[index].tr = e.target.value;
                                                    setFormData({ ...formData, examples: newExamples });
                                                }}
                                                placeholder="Türkçe çeviri"
                                                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        {formData.examples.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newExamples = formData.examples.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, examples: newExamples });
                                                }}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors self-start"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {saveMessage && (
                            <div className={`p-3 rounded-lg ${saveMessage.includes("başarıyla")
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"}`}>
                                {saveMessage}
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Gramer Konusu Ekle
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentView("list")}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gramer</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setCurrentView("list")}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all bg-blue-600 text-white shadow-md"
                    >
                        <List className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="whitespace-nowrap">Gramer listesi</span>
                    </button>
                    <button
                        onClick={() => setCurrentView("add")}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="whitespace-nowrap">Yeni Konu Ekle</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Gramer konusu ara..."
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Gramer konuları yükleniyor...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-10">
                        <section> {/* kullanıcı notları */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 bg-blue-50 rounded-lg">
                                    <Plus className="w-4 h-4 text-blue-600" />
                                </div>
                                <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                                    Benim Notlarım
                                </h2>
                            </div>

                            {grammars.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {grammars.map((grammar) => (
                                        <div
                                            key={grammar._id}
                                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-sm"                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs text-gray-500 mb-1">{grammar.category}</div>
                                                    <h3 className="font-semibold text-gray-900 truncate">{grammar.title}</h3>
                                                    {grammar.description && (
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{grammar.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-row gap-1 mt-[2px]">
                                                    <button onClick={(e) => handleViewClick(e, grammar)} className="text-gray-400 hover:text-blue-500 transition-colors" title="Görüntüle"><Eye className="w-[18px] h-[18px]" /></button>
                                                    <button onClick={(e) => handleTogglePin(e, grammar._id)} className={`transition-colors ${grammar.isPinned ? "text-blue-500" : "text-gray-400 hover:text-blue-500"}`} title="Sabitle">{grammar.isPinned ? <Pin className="w-[18px] h-[18px]" /> : <PinOff className="w-[18px] h-[18px]" />}</button>
                                                    <button onClick={(e) => handleDeleteGrammar(e, grammar._id, grammar.title)} className="text-gray-400 hover:text-red-500 transition-colors" title="Sil"><Trash2 className="w-[18px] h-[18px]" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-xl py-8 text-center text-sm text-gray-500">
                                    {searchTerm || selectedCategory !== "all" ? "Arama kriterlerinize uygun not bulunamadı." : "Henüz kendi gramer konunuzu eklemediniz."}
                                </div>
                            )}
                        </section>


                        {globalGrammars.length > 0 && (  // hazır gramer notları
                            <section className="pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                                        <BookOpen className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                                        Hazır Gramer Kütüphanesi
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {globalGrammars.map((global: any) => (
                                        <div
                                            key={global._id}
                                            onClick={(e) => handleViewClick(e, global)}
                                            className="group h-full bg-gray-50/80 rounded-lg p-4 border border-gray-200 hover:border-blue-400/50 hover:bg-blue-50/30 transition-all duration-300 cursor-pointer shadow-sm"
                                        >
                                            <div className="flex flex-col h-full">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                                                            {global.category}
                                                        </span>
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {global.title}
                                                        </h3>
                                                        {global.description && (
                                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                                                {global.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-row gap-1 ml-2">
                                                        <Eye className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors mt-[2px]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}