
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, X, Save, Loader2, AlertCircle, ChevronLeft, ChevronRight, Circle, Clock, CheckCircle2, User } from "lucide-react";
import { oxfordApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface OxfordWord {
  _id: string;
  word: string;
  translation: string;
  status: "new" | "learning" | "mastered";
  userNotes: string;
  categoryId: number;
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const WORDS_PER_PAGE = 50;

const getCategoryIdForLetter = (letter: string): number => {
  const index = letters.indexOf(letter);
  return index + 1;
};

export default function OxfordListPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [allWords, setAllWords] = useState<OxfordWord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<OxfordWord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [globalStats, setGlobalStats] = useState<{ totalWords: number; learning: number; mastered: number } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        console.error("Kullanıcı verisi okunamadı");
      }
    }
  }, []);

  const { isTester } = useAuth();

  const loadStats = async () => {
    try {
      const stats = (await oxfordApi.getStats()) as any;
      setGlobalStats(stats);
    } catch (err) {
      console.error("Stats yüklenirken hata:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadWords(selectedCategory);
    setCurrentPage(1);
  }, [selectedCategory]);

  const totalPages = Math.ceil(allWords.length / WORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * WORDS_PER_PAGE;
  const endIndex = startIndex + WORDS_PER_PAGE;
  const words = allWords.slice(startIndex, endIndex);

  const loadWords = async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = (await oxfordApi.getWordsByCategory(categoryId)) as any;
      setAllWords(response.words || []);
    } catch (err: any) {
      console.error("Kelimeler yüklenirken hata:", err);
      setError(err.message || "Kelimeler yüklenirken bir hata oluştu");
      setAllWords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (word: OxfordWord) => {
    setSelectedWord(word);
    setEditedNotes(word.userNotes || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWord(null);
    setEditedNotes("");
  };

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

  const handleSaveNotes = async () => {
    if (!selectedWord) return;

    try {
      setSaving(true);
      await oxfordApi.updateWordNote(selectedWord._id, editedNotes);

      setAllWords((prevWords) =>
        prevWords.map((w) =>
          w._id === selectedWord._id ? { ...w, userNotes: editedNotes } : w,
        ),
      );

      setSelectedWord({ ...selectedWord, userNotes: editedNotes });
    } catch (err: any) {
      console.error("Not kaydedilirken hata:", err);
      alert("Not kaydedilirken bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    wordId: string,
    newStatus: "new" | "learning" | "mastered",
  ) => {
    try {
      await oxfordApi.updateWordStatus(wordId, newStatus);

      setAllWords((prevWords) =>
        prevWords.map((w) => (w._id === wordId ? { ...w, status: newStatus } : w)),
      );

      if (selectedWord && selectedWord._id === wordId) {
        setSelectedWord({ ...selectedWord, status: newStatus });
      }

      loadStats();
    } catch (err: any) {
      console.error("Durum güncellenirken hata:", err);
      alert("Durum güncellenirken bir hata oluştu");
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">

      <div className="mb-4 space-y-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
          <div className="grid grid-cols-9 gap-1.5 justify-items-center sm:flex sm:justify-between sm:gap-1 sm:flex-nowrap">
            {letters.map((letter) => {
              const categoryId = getCategoryIdForLetter(letter);
              const isActive = selectedCategory === categoryId;
              return (
                <button
                  key={letter}
                  onClick={() => setSelectedCategory(categoryId)}
                  className={`
                    h-8 w-8 sm:flex-1 flex items-center justify-center
                    rounded text-xs font-semibold
                    transition-all duration-200
                    ${isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }
                  `}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {!loading && !error && allWords.length > 0 && (
          <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">

            <div className="flex items-center justify-center gap-1 px-3 py-2 flex-1 md:ml-64">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-1 rounded transition-colors ${currentPage === 1
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 px-1.5 whitespace-nowrap tabular-nums min-w-[60px] text-center">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-1 rounded transition-colors ${currentPage === totalPages
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-stretch divide-x divide-gray-200 dark:divide-gray-700 bg-gray-50/50 dark:bg-gray-800/50 md:bg-transparent">
              <div className="flex items-center justify-center gap-1.5 px-4 py-2 shrink-0 flex-1 md:w-[130px]">
                <Clock className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold whitespace-nowrap tabular-nums">
                  {globalStats?.learning ?? "—"}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 hidden sm:inline">öğreniyorum</span>
              </div>

              <div className="flex items-center justify-center gap-1.5 px-4 py-2 shrink-0 flex-1 md:w-[150px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <span className="text-xs font-semibold whitespace-nowrap tabular-nums">
                  <span className="text-green-600 dark:text-green-400">{globalStats?.mastered ?? "—"}</span>
                  <span className="text-gray-400 dark:text-gray-500"> / {globalStats?.totalWords ?? "—"}</span>
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 hidden sm:inline">öğrenildi</span>
              </div>
            </div>

          </div>
        )}
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Yükleniyor...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => loadWords(selectedCategory)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        ) : words.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Bu harf için kelime bulunamadı</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs w-1/3 md:w-[calc(50%-182px)]">
                      Kelime
                    </th>
                    <th className="px-3 py-2 text-center md:text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs w-1/3 md:w-auto">
                      Çeviri
                    </th>
                    <th className="px-3 py-2 text-right md:text-center font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs w-1/3 md:w-24 pr-4">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {words.map((word) => {
                    const StatusIcon =
                      word.status === "new"
                        ? Circle
                        : word.status === "learning"
                          ? Clock
                          : CheckCircle2;
                    const statusIconColor =
                      word.status === "new"
                        ? "text-gray-400 dark:text-gray-500"
                        : word.status === "learning"
                          ? "text-yellow-500"
                          : "text-green-500";
                    const rowBgColor =
                      word.status === "new"
                        ? ""
                        : word.status === "learning"
                          ? "bg-yellow-50/50 dark:bg-yellow-900/10"
                          : "bg-green-50/50 dark:bg-green-900/10";
                    const hasNotes = word.userNotes && word.userNotes.trim();

                    return (
                      <tr
                        key={word._id}
                        className={`${rowBgColor} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
                      >
                        <td className="px-3 py-2">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{word.word}</span>
                        </td>
                        <td className="px-3 py-2 text-center md:text-left text-gray-700 dark:text-gray-300 text-sm">{word.translation}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end md:justify-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStatus =
                                  word.status === "new"
                                    ? "learning"
                                    : word.status === "learning"
                                      ? "mastered"
                                      : "new";
                                handleStatusChange(word._id, nextStatus);
                              }}
                              className="inline-flex items-center justify-center transition-transform hover:scale-110"
                              title={
                                word.status === "new"
                                  ? "Yeni"
                                  : word.status === "learning"
                                    ? "Öğreniyorum"
                                    : "Öğrendim"
                              }
                            >
                              <StatusIcon className={`w-5 h-5 ${statusIconColor}`} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(word);
                              }}
                              className={`p-1 transition-all hover:scale-110 ${hasNotes
                                ? "text-blue-500 hover:text-blue-600"
                                : "text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                              title="Notları düzenle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedWord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e: any) => e.stopPropagation()}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
                <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {selectedWord.word}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{selectedWord.translation}</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="ml-4 p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum</label>
                    <div className="relative w-full z-30">
                      <button
                        type="button"
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                        className={`
                          flex w-full items-center justify-between text-left cursor-pointer
                          text-sm font-medium px-3 py-2.5 rounded-lg
                          border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                          focus:outline-none focus:ring-1 focus:ring-blue-500 hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] transition-shadow
                          ${selectedWord.status === "new"
                            ? "text-gray-700 dark:text-gray-300"
                            : selectedWord.status === "learning"
                              ? "text-yellow-700 dark:text-yellow-500"
                              : "text-green-700 dark:text-green-500"
                          }
                        `}
                      >
                        <span className="block truncate">
                          {selectedWord.status === "new" ? "Yeni" : selectedWord.status === "learning" ? "Öğreniyorum" : "Öğrendim"}
                        </span>
                        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none">
                          <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" fillRule="evenodd" />
                        </svg>
                      </button>

                      {isStatusOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)}></div>
                          <ul className="absolute z-20 left-0 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 outline-none sm:text-sm border border-gray-100 dark:border-gray-700">
                            {[
                              { value: "new", label: "Yeni", colorClass: "text-gray-700 dark:text-gray-300" },
                              { value: "learning", label: "Öğreniyorum", colorClass: "text-yellow-700 dark:text-yellow-500" },
                              { value: "mastered", label: "Öğrendim", colorClass: "text-green-700 dark:text-green-500" }
                            ].map((statusOption) => (
                              <li
                                key={statusOption.value}
                                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${selectedWord.status === statusOption.value ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                                onClick={() => {
                                  handleStatusChange(selectedWord._id, statusOption.value as "new" | "learning" | "mastered");
                                  setIsStatusOpen(false);
                                }}
                              >
                                <div className="flex items-center">
                                  <span className={`block truncate ${statusOption.colorClass} ${selectedWord.status === statusOption.value ? 'font-semibold' : 'font-medium'}`}>
                                    {statusOption.label}
                                  </span>
                                </div>
                                {selectedWord.status === statusOption.value && (
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
                    <div className="space-y-3">
                      <textarea
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        placeholder="Notlarınızı buraya yazın..."
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 min-h-[150px] max-h-[300px] overflow-y-auto text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        style={{ whiteSpace: "pre-wrap" }}
                      />
                      <div className="flex items-center gap-2">
                        {isTester ? (
                          <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 text-sm font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                          >
                            <User size={16} />
                            Kaydetmek için giriş yapınız
                          </Link>
                        ) : (
                          <>
                            <button
                              onClick={handleSaveNotes}
                              disabled={saving}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Kaydediliyor...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" />
                                  Kaydet
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}