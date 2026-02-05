"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { grammarApi } from "@/lib/api";

interface GrammarExample {
  en: string;
  tr: string;
}

export default function AddGrammar() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    formula: "",
    rules: "",
    notes: "",
    examples: [{ en: "", tr: "" }] as GrammarExample[],
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const [response] = await Promise.all([
        grammarApi.getCategories(),
        new Promise((r) => setTimeout(r, 500)),
      ]);
      setCategories((response as any).categories || []);
    } catch (err: any) {
      console.error("Kategoriler yüklenirken hata:", err);
    } finally {
      setLoadingCategories(false);
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
      setLoadingCategories(true);
      await Promise.all([
        grammarApi.deleteCategory(categoryName),
        new Promise((r) => setTimeout(r, 500)),
      ]);
      setCategories(categories.filter((c) => c !== categoryName));
    } catch (err: any) {
      alert(err.message || "Kategori silinirken bir hata oluştu");
    } finally {
      setLoadingCategories(false);
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
        examples: formData.examples.filter((ex) => ex.en || ex.tr),
      });

      setSaveMessage("Gramer konusu başarıyla eklendi!");
      setFormData({
        category: "",
        title: "",
        description: "",
        formula: "",
        rules: "",
        notes: "",
        examples: [{ en: "", tr: "" }],
      });

      await loadCategories();
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

  const inputBase =
    "w-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

      <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-4">
        Yeni Gramer Konusu Ekle
      </h2>


      <form
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
        className="space-y-8"
      >
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
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
                placeholder="Yeni kategori adı (örn: Conditionals, Tenses)"
                className={inputBase}
              />
            </div>
            <button
              type="button"
              onClick={handleAddCategory}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Kategori Ekle
            </button>
          </div>
          {loadingCategories ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Kategoriler yükleniyor...</span>
            </div>
          ) : categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200"
                >
                  {cat.length > 24 ? cat.slice(0, 24) + "…" : cat}
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    disabled={loadingCategories}
                    className="p-0.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Kategoriyi sil"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Henüz kategori yok. Yukarıdan yeni kategori ekleyin.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Konu bilgileri
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                disabled={loadingCategories}
                className={`${inputBase} cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {loadingCategories ? "Yükleniyor..." : "Seçin"}
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Başlık <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Örn: Third Conditional"
                className={inputBase}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kısa açıklama
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Kartta görünecek özet"
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Formül
              </label>
              <input
                type="text"
                value={formData.formula}
                onChange={(e) =>
                  setFormData({ ...formData, formula: e.target.value })
                }
                placeholder="Örn: If + Past Perfect, would + have + V3"
                className={`${inputBase} font-mono text-sm`}
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kurallar
            </label>
            <textarea
              value={formData.rules}
              onChange={(e) =>
                setFormData({ ...formData, rules: e.target.value })
              }
              placeholder="Temel kuralları madde veya paragraf olarak yazın..."
              rows={6}
              className={`${inputBase} resize-y min-h-[120px]`}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Notlar
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="İpuçları, istisnalar, sık hatalar..."
              rows={6}
              className={`${inputBase} resize-y min-h-[120px]`}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Örnek cümleler
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                İngilizce cümle ve Türkçe çeviri ekleyin.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  examples: [...formData.examples, { en: "", tr: "" }],
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
            >
              <Plus className="w-4 h-4" />
              Örnek ekle
            </button>
          </div>
          <div className="space-y-3">
            {formData.examples.map((example, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50/50"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={example.en}
                    onChange={(e) => {
                      const next = [...formData.examples];
                      next[index].en = e.target.value;
                      setFormData({ ...formData, examples: next });
                    }}
                    placeholder="İngilizce cümle"
                    className={inputBase}
                  />
                  <input
                    type="text"
                    value={example.tr}
                    onChange={(e) => {
                      const next = [...formData.examples];
                      next[index].tr = e.target.value;
                      setFormData({ ...formData, examples: next });
                    }}
                    placeholder="Türkçe çeviri"
                    className={inputBase}
                  />
                </div>
                {formData.examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = formData.examples.filter((_, i) => i !== index);
                      setFormData({ ...formData, examples: next });
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {saveMessage && (
          <div
            role="alert"
            className={`p-4 rounded-lg text-sm font-medium ${saveMessage.includes("başarıyla")
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
              }`}
          >
            {saveMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
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
        </div>
      </form>
    </div>
  );
}