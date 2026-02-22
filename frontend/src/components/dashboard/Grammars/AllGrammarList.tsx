
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Pin, PinOff, BookOpen, Loader2, Plus, Trash2, Eye } from "lucide-react";
import { grammarApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

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

export default function AllGrammarList() {
  const router = useRouter();
  const { isTester } = useAuth();

  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [globalGrammars, setGlobalGrammars] = useState<Grammar[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);



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
      const response = (await grammarApi.getCategories()) as any;
      setCategories(response.categories || []);
    } catch (err: any) {
      console.error("Kategoriler yüklenirken hata:", err);
    }
  };

  const loadGrammars = async () => {
    try {
      setError(null);
      const response = (await grammarApi.getAllGrammars({ category: selectedCategory, search: debouncedSearchTerm })) as any;


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
      const response = (await grammarApi.getGlobalGrammars()) as any;
      setGlobalGrammars(response.grammars || []);
    } catch (err: any) {
      console.error("Gramer konuları yüklenirken hata:", err);
      setError(
        err.message ||
        "Hazır Gramer konuları yüklenirken bir hata oluştu",
      );
      setGlobalGrammars([]);
    }
  };

  const buildSlug = (grammar: Grammar) => {
    const base = (grammar.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${base}-${grammar._id}`;
  };

  const handleViewClick = (e: React.MouseEvent, grammar: Grammar) => {
    e.stopPropagation();
    const slug = buildSlug(grammar);
    const basePath = grammar.isGlobal
      ? "/dashboard/gramer/ortak"
      : "/dashboard/gramer";
    router.push(`${basePath}/${slug}`);
  };

  const handleTogglePin = async (e: React.MouseEvent, grammarId: string,) => {
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
    if (window.confirm(`"${grammarTitle}" gramer konusunu silmek istediğinize emin misiniz?`,)) {
      try {
        await grammarApi.deleteGrammar(grammarId);
        await loadGrammars();
      } catch (err: any) {
        console.error("Silme hatası:", err);
        alert(err.message || "Gramer konusu silinirken bir hata oluştu");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Gramer konusu ara..."
            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
          />
        </div>
        <div className="relative w-full sm:w-[200px] z-30">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="grid w-full cursor-pointer grid-cols-1 rounded-lg bg-white dark:bg-gray-700 py-2 sm:py-2.5 px-3 text-left text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm outline-none focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
          >
            <span className="col-start-1 row-start-1 flex items-center pr-4">
              <span className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                {selectedCategory === "all" ? "Tüm Kategoriler" : selectedCategory}
              </span>
            </span>
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400 dark:text-gray-500">
              <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
            </svg>
          </button>

          {isCategoryOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)}></div>
              <ul className="absolute z-20 right-0 mt-1 max-h-60 w-full min-w-[200px] overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-gray-100 dark:border-gray-700">
                {[
                  { value: "all", label: "Tüm Kategoriler" },
                  ...categories.map(c => ({ value: c, label: c }))
                ].map((c) => (
                  <li
                    key={c.value}
                    className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${selectedCategory === c.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                    onClick={() => { setSelectedCategory(c.value); setIsCategoryOpen(false); }}
                  >
                    <div className="flex items-center">
                      <span className={`block truncate ${selectedCategory === c.value ? 'font-semibold' : 'font-medium'}`}>{c.label}</span>
                    </div>
                    {selectedCategory === c.value && (
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Gramer konuları yükleniyor...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                Benim Notlarım
              </h2>
            </div>

            {grammars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {grammars.map((grammar) => (
                  <div
                    key={grammar._id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {grammar.category}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {grammar.title}
                        </h3>
                        {grammar.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {grammar.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-row gap-1 mt-[2px]">
                        <button
                          onClick={(e) => handleViewClick(e, grammar)}
                          className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-[18px] h-[18px]" />
                        </button>
                        <button
                          onClick={(e) =>
                            handleTogglePin(e, grammar._id)
                          }
                          className={`transition-colors ${grammar.isPinned
                            ? "text-blue-500"
                            : "text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                            }`}
                          title="Sabitle"
                        >
                          {grammar.isPinned ? (
                            <Pin className="w-[18px] h-[18px]" />
                          ) : (
                            <PinOff className="w-[18px] h-[18px]" />
                          )}
                        </button>
                        <button
                          onClick={(e) =>
                            handleDeleteGrammar(
                              e,
                              grammar._id,
                              grammar.title,
                            )
                          }
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-12 text-center">
                {isTester ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                      <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="max-w-[300px] mx-auto">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Kendi gramer notlarınızı eklemek için giriş yapın
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 px-4 leading-relaxed font-medium">
                        Notlarınızı kaydedebilir, sabitleyebilir ve
                        dilediğiniz zaman erişebilirsiniz.
                      </p>
                    </div>
                    <a
                      href="/login"
                      className="mt-2 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 text-xs font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                    >
                      Giriş Yap
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic py-4">
                    {searchTerm || selectedCategory !== "all"
                      ? "Arama kriterlerinize uygun not bulunamadı."
                      : "Henüz kendi gramer konunuzu eklemediniz."}
                  </p>
                )}
              </div>
            )}
          </section>

          {globalGrammars.length > 0 && (
            <section className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                  Hazır Gramer Kütüphanesi
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {globalGrammars.map((global: any) => (
                  <div
                    key={global._id}
                    onClick={(e) => handleViewClick(e, global)}
                    className="group h-full bg-gray-50/80 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-400/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">
                            {global.category}
                          </span>
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {global.title}
                          </h3>
                          {global.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                              {global.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-row gap-1 ml-2">
                          <Eye className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors mt-[2px]" />
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
  );
}