
import { useEffect, useState } from "react";
import { Trash2, Star, Search, Loader2, X, Volume2, MessageCircleQuestionMark, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { wordsApi } from "@/lib/api";

const wordTypes = [
  { value: "", label: "Tür" },
  { value: "noun", label: "İsim" },
  { value: "verb", label: "Fiil" },
  { value: "adjective", label: "Sıfat" },
  { value: "adverb", label: "Zarf" },
  { value: "preposition", label: "Edat" },
  { value: "conjunction", label: "Bağlaç" },
  { value: "pronoun", label: "Zamir" },
  { value: "phrasal_verb", label: "Fiil Öbeği" },
  { value: "other", label: "Diğer" },
];

export default function AllWords() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [totalWords, setTotalWords] = useState<number>(0);
  const [words, setWords] = useState<any[]>([]);
  const [limit, setLimit] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [type, setType] = useState<string>("");
  const [favoriteFilter, setFavoriteFilter] = useState<string>("");
  const [unknownFilter, setUnknownFilter] = useState<string>("");
  const [isTypeOpen, setIsTypeOpen] = useState<boolean>(false);
  const [isFavOpen, setIsFavOpen] = useState<boolean>(false);
  const [isUnknownOpen, setIsUnknownOpen] = useState<boolean>(false);
  const [isFilterGroupOpen, setIsFilterGroupOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit, type, favoriteFilter, unknownFilter, debouncedSearchTerm]);

  useEffect(() => {
    loadData();
  }, [limit, currentPage, type, favoriteFilter, unknownFilter, debouncedSearchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * limit;
      const response = (await wordsApi.getWords({ limit, skip, type, favoriteFilter, unknownFilter, searchTerm: debouncedSearchTerm, })) as any;

      setTimeout(() => {
        setWords(response.words || []);
        setTotalWords(response.totalWords || 0);
        setLoading(false);
      }, 50);
    } catch (error: any) {
      console.error("Veri yükleme hatası:", error);
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalWords / limit);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleFavorite = async (wordId: string) => {
    try {
      await wordsApi.addtoFavorites(wordId);
      setWords(words.map((w) => (w._id === wordId ? { ...w, favorite: !w.favorite } : w)));
    } catch (error) {
      setMessage("Favori durumu değiştirilemedi.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const toggleUnknown = async (wordId: string) => {
    try {
      await wordsApi.addtoUnknown(wordId);
      setWords(
        words.map((w) =>
          w._id === wordId ? { ...w, isUnknown: !w.isUnknown } : w,
        ),
      );
    } catch (error) {
      setMessage("Bilinmeyen durumu değiştirilemedi.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const removeWord = async (wordId: string) => {
    if (!window.confirm("Bu kelimeyi silmek istediğinize emin misiniz?")) return;

    try {
      const response = (await wordsApi.deleteWord(wordId)) as any;
      setMessage(response.message || "Kelime başarıyla silindi.");

      setTimeout(() => setMessage(""), 3000);

      setWords((prevWords) => prevWords.filter((word) => word._id !== wordId));
      setTotalWords((prev) => prev - 1);
    } catch (error: any) {
      console.error("Silme hatası:", error);
      setMessage(error.message || "Silme işlemi sırasında bir hata oluştu");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Tarayıcınız seslendirme özelliğini desteklemiyor.");
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.7;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative">
      {message && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700 dark:border-gray-600 transition-all">
          <span className="text-sm font-medium">{message}</span>
          <button onClick={() => setMessage("")} className="hover:text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="sm:hidden mb-4">
        <button
          type="button"
          onClick={() => {
            setIsFilterGroupOpen(!isFilterGroupOpen);
            setIsTypeOpen(false);
            setIsFavOpen(false);
            setIsUnknownOpen(false);
          }}
          className="w-full flex items-center justify-between gap-2 rounded-lg bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Filtreler & Arama
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isFilterGroupOpen ? 'rotate-180' : ''}`} />
        </button>

        {isFilterGroupOpen && (
          <div className="mt-2 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Kelime ara (EN/TR)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            <div className="relative z-30">
              <button
                type="button"
                onClick={() => { setIsTypeOpen(!isTypeOpen); setIsFavOpen(false); setIsUnknownOpen(false); }}
                className="grid w-full cursor-pointer grid-cols-1 rounded-lg bg-white dark:bg-gray-700 py-2 px-3 text-left text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm outline-none text-sm transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
              >
                <span className="col-start-1 row-start-1 flex items-center pr-4">
                  <span className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                    {type ? wordTypes.find(t => t.value === type)?.label : "Tür"}
                  </span>
                </span>
                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400 dark:text-gray-500">
                  <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </button>
              {isTypeOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsTypeOpen(false)}></div>
                  <ul className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 border border-gray-100 dark:border-gray-700">
                    {wordTypes.map((t) => (
                      <li
                        key={t.value}
                        className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${type === t.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                        onClick={() => { setType(t.value); setIsTypeOpen(false); }}
                      >
                        <span className={`block truncate ${type === t.value ? 'font-semibold' : 'font-medium'}`}>{t.label}</span>
                        {type === t.value && (
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

            <div className="relative z-20">
              <button
                type="button"
                onClick={() => { setIsFavOpen(!isFavOpen); setIsTypeOpen(false); setIsUnknownOpen(false); }}
                className="grid w-full cursor-pointer grid-cols-1 rounded-lg bg-white dark:bg-gray-700 py-2 px-3 text-left text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm outline-none text-sm transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
              >
                <span className="col-start-1 row-start-1 flex items-center pr-4">
                  <span className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                    {favoriteFilter === "true" ? "Favoriler" : favoriteFilter === "false" ? "Favori Olmayanlar" : "Favori Durumu"}
                  </span>
                </span>
                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400 dark:text-gray-500">
                  <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </button>
              {isFavOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFavOpen(false)}></div>
                  <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 border border-gray-100 dark:border-gray-700">
                    {[
                      { value: "", label: "Favori Durumu" },
                      { value: "true", label: "Favoriler" },
                      { value: "false", label: "Favori Olmayanlar" }
                    ].map((f) => (
                      <li
                        key={f.value}
                        className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${favoriteFilter === f.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                        onClick={() => { setFavoriteFilter(f.value); setIsFavOpen(false); }}
                      >
                        <span className={`block truncate ${favoriteFilter === f.value ? 'font-semibold' : 'font-medium'}`}>{f.label}</span>
                        {favoriteFilter === f.value && (
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

            <div className="relative z-10">
              <button
                type="button"
                onClick={() => { setIsUnknownOpen(!isUnknownOpen); setIsTypeOpen(false); setIsFavOpen(false); }}
                className="grid w-full cursor-pointer grid-cols-1 rounded-lg bg-white dark:bg-gray-700 py-2 px-3 text-left text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm outline-none text-sm transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
              >
                <span className="col-start-1 row-start-1 flex items-center pr-4">
                  <span className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                    {unknownFilter === "true" ? "Bilinmeyenler" : "Bilinmeyen Durumu"}
                  </span>
                </span>
                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400 dark:text-gray-500">
                  <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </button>
              {isUnknownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsUnknownOpen(false)}></div>
                  <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 border border-gray-100 dark:border-gray-700">
                    {[
                      { value: "", label: "Bilinmeyen Durumu" },
                      { value: "true", label: "Sadece Bilinmeyenler" }
                    ].map((u) => (
                      <li
                        key={u.value}
                        className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${unknownFilter === u.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                        onClick={() => { setUnknownFilter(u.value); setIsUnknownOpen(false); }}
                      >
                        <span className={`block truncate ${unknownFilter === u.value ? 'font-semibold' : 'font-medium'}`}>{u.label}</span>
                        {unknownFilter === u.value && (
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
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Sayfa başına:</p>
              <div className="flex gap-2">
                {[10, 20, 50, 100].map((item) => (
                  <button
                    key={item}
                    onClick={() => { setLimit(item); setCurrentPage(1); }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${limit === item ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
              {loading && words.length === 0 ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Tüm kelimeler: {totalWords}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hidden sm:flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Kelime ara (EN/TR)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
          />
        </div>
        <div className="grid grid-cols-3 md:flex md:items-center md:justify-end gap-2 sm:gap-3 w-full md:w-auto pb-1 sm:pb-0">
          {/* Type Filter */}
          <div className="relative w-full md:w-[150px] z-20">
            <button
              type="button"
              onClick={() => { setIsTypeOpen(!isTypeOpen); setIsFavOpen(false); setIsUnknownOpen(false); }}
              className="grid w-full cursor-pointer grid-cols-1 rounded-lg bg-white dark:bg-gray-700 py-2 sm:py-2.5 px-2 sm:px-3 text-left text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm outline-none focus:outline-none focus:ring-1 focus:ring-blue-500  sm:text-sm transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
            >
              <span className="col-start-1 row-start-1 flex items-center pr-4">
                <span className="block text-[11px] sm:text-[13px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {type ? wordTypes.find(t => t.value === type)?.label : "Tür"}
                </span>
              </span>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400 dark:text-gray-500">
                <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </button>

            {isTypeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsTypeOpen(false)}></div>
                <ul className="absolute z-20 mt-1 max-h-60 w-full min-w-[120px] overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-gray-100 dark:border-gray-700">
                  {wordTypes.map((t) => (
                    <li
                      key={t.value}
                      className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${type === t.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                      onClick={() => { setType(t.value); setIsTypeOpen(false); }}
                    >
                      <div className="flex items-center">
                        <span className={`block truncate ${type === t.value ? 'font-semibold' : 'font-medium'}`}>{t.label}</span>
                      </div>
                      {type === t.value && (
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

          {/* Favorite Filter */}
          <div className="relative w-full md:w-[170px] z-20">
            <button
              type="button"
              onClick={() => { setIsFavOpen(!isFavOpen); setIsTypeOpen(false); setIsUnknownOpen(false); }}
              className="grid w-full cursor-pointer grid-cols-1 rounded-lg bg-white dark:bg-gray-700 py-2 sm:py-2.5 px-2 sm:px-3 text-left text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm outline-none focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
            >
              <span className="col-start-1 row-start-1 flex items-center pr-4">
                <span className="block text-[11px] sm:text-[13px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {favoriteFilter === "true" ? "Favoriler" : favoriteFilter === "false" ? "Kal.(Fav Değil)" : "Favori Durumu"}
                </span>
              </span>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400 dark:text-gray-500">
                <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </button>

            {isFavOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFavOpen(false)}></div>
                <ul className="absolute z-20 mt-1 max-h-60 w-full min-w-[140px] overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-gray-100 dark:border-gray-700">
                  {[
                    { value: "", label: "Favori Durumu" },
                    { value: "true", label: "Favoriler" },
                    { value: "false", label: "Favori Olmayanlar" }
                  ].map((f) => (
                    <li
                      key={f.value}
                      className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${favoriteFilter === f.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                      onClick={() => { setFavoriteFilter(f.value); setIsFavOpen(false); }}
                    >
                      <div className="flex items-center">
                        <span className={`block truncate ${favoriteFilter === f.value ? 'font-semibold' : 'font-medium'}`}>{f.label}</span>
                      </div>
                      {favoriteFilter === f.value && (
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

          {/* Unknown Filter */}
          <div className="relative w-full md:w-[170px] z-10">
            <button
              type="button"
              onClick={() => { setIsUnknownOpen(!isUnknownOpen); setIsTypeOpen(false); setIsFavOpen(false); }}
              className="grid w-full cursor-pointer grid-cols-1 rounded-lg bg-white dark:bg-gray-700 py-2 sm:py-2.5 px-2 sm:px-3 text-left text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm outline-none focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
            >
              <span className="col-start-1 row-start-1 flex items-center pr-4">
                <span className="block text-[11px] sm:text-[13px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {unknownFilter === "true" ? "Bilinmeyenler" : "Bilinmeyen Durumu"}
                </span>
              </span>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400 dark:text-gray-500">
                <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </button>

            {isUnknownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsUnknownOpen(false)}></div>
                <ul className="absolute z-20 mt-1 max-h-60 w-full min-w-[145px] right-0 sm:right-auto overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-gray-100 dark:border-gray-700">
                  {[
                    { value: "", label: "Bilinmeyen Durumu" },
                    { value: "true", label: "Sadece Bilinmeyenler" }
                  ].map((u) => (
                    <li
                      key={u.value}
                      className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${unknownFilter === u.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                      onClick={() => { setUnknownFilter(u.value); setIsUnknownOpen(false); }}
                    >
                      <div className="flex items-center">
                        <span className={`block truncate ${unknownFilter === u.value ? 'font-semibold' : 'font-medium'}`}>{u.label}</span>
                      </div>
                      {unknownFilter === u.value && (
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
      </div>

      <div className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="w-full sm:w-auto flex items-center justify-between sm:bg-transparent sm:p-0 sm:justify-start sm:gap-4">
          <span className="hidden md:inline text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
            Sayfa başına:
          </span>
          <div className="flex items-center gap-2">
            {[10, 20, 50, 100].map((item) => (
              <button
                key={item}
                onClick={() => { setLimit(item); setCurrentPage(1); }}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${limit === item ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600 min-w-[170px] relative">
          <span className="absolute left-3 w-2 h-2 bg-blue-500 rounded-full"></span>
          <div className="flex-1 flex justify-center items-center">
            {loading && words.length === 0 ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <span className="ml-3">Tüm kelimeler: {totalWords}</span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Kelimeler yükleniyor...</span>
        </div>
      ) : words.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {words.map((word) => (
              <div key={word._id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{word.text}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{word.translation}</p>
                  </div>
                  <div className="flex flex-row gap-1 mt-[2px]">
                    <button
                      onClick={() => toggleFavorite(word._id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-yellow-500 transition-colors"
                    >
                      <Star
                        className={`w-[18px] h-[18px] ${word.favorite ? "fill-current text-yellow-500" : "text-gray-400 dark:text-gray-500"
                          }`}
                      />
                    </button>
                    <button
                      onClick={() => toggleUnknown(word._id)}
                      className={`transition-colors ${word.isUnknown ? "text-blue-500" : "text-gray-400 dark:text-gray-500 hover:text-blue-500"
                        }`}
                      title="Bilinmeyen"
                    >
                      <MessageCircleQuestionMark
                        className={`w-[18px] h-[18px] ${word.isUnknown ? "text-blue-500" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => speak(word.text)}
                      className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors"
                      title="Dinle"
                    >
                      <Volume2 className="w-[18px] h-[18px]" />
                    </button>
                    <button
                      onClick={() => removeWord(word._id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Tür: {wordTypes.find((t) => t.value === word.type)?.label || word.type}
                </div>
                <hr className="my-2 border-gray-200 dark:border-gray-600" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="mb-1">
                    <strong>Örnek:</strong> {word.exampleSentence}
                  </p>
                  <p>
                    <strong>Çeviri:</strong> {word.sentenceTranslation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`
                  p-1 rounded transition-colors
                  ${currentPage === 1
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`
                  p-1 rounded transition-colors
                  ${currentPage === totalPages
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">Kelime bulunamadı</div>
      )}
    </div>
  );
}