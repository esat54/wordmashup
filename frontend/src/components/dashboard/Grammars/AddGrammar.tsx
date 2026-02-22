
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
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);

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
    "w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors focus:outline-none hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">

      <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight mb-4">
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
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors border border-transparent dark:border-gray-600"
            >
              <Plus className="w-4 h-4" />
              Kategori Ekle
            </button>
          </div>
          {loadingCategories ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Kategoriler yükleniyor...</span>
            </div>
          ) : categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  {cat.length > 24 ? cat.slice(0, 24) + "…" : cat}
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    disabled={loadingCategories}
                    className="p-0.5 rounded text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Kategoriyi sil"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Henüz kategori yok. Yukarıdan yeni kategori ekleyin.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
            Konu bilgileri
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Kategori <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative w-full z-30">
                <button
                  type="button"
                  disabled={loadingCategories}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`grid w-full cursor-pointer grid-cols-1 rounded-lg bg-white dark:bg-gray-700 py-2 sm:py-2.5 px-3 sm:px-4 text-left border border-gray-300 dark:border-gray-600 shadow-sm outline-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${loadingCategories ? "opacity-60 cursor-not-allowed" : ""} ${!formData.category ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}
                >
                  <span className="col-start-1 row-start-1 flex items-center pr-4">
                    <span className="block text-sm font-medium truncate">
                      {loadingCategories ? "Yükleniyor..." : formData.category ? formData.category : "Seçin"}
                    </span>
                  </span>
                  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400 dark:text-gray-500">
                    <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
                  </svg>
                </button>

                {isCategoryOpen && categories.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)}></div>
                    <ul className="absolute z-20 left-0 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-gray-100 dark:border-gray-700">
                      {categories.map((cat) => (
                        <li
                          key={cat}
                          className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${formData.category === cat ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                          onClick={() => { setFormData({ ...formData, category: cat }); setIsCategoryOpen(false); }}
                        >
                          <div className="flex items-center">
                            <span className={`block truncate ${formData.category === cat ? 'font-semibold' : 'font-medium'}`}>{cat}</span>
                          </div>
                          {formData.category === cat && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Başlık <span className="text-red-500 dark:text-red-400">*</span>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Örnek cümleler
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-800"
            >
              <Plus className="w-4 h-4" />
              Örnek ekle
            </button>
          </div>
          <div className="space-y-3">
            {formData.examples.map((example, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
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
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/50"
              }`}
          >
            {saveMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
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