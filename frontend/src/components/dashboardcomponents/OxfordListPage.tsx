"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, X, Save, Loader2, AlertCircle, ChevronLeft, ChevronRight, Circle, Clock, CheckCircle2, User } from "lucide-react";
import { oxfordApi } from "@/lib/api";

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
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotes, setEditedNotes] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error("Kullanıcı verisi okunamadı");
            }
        }
    }, []);

    const isTester = user?.email === "tester@gmail.com";

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
            const response = await oxfordApi.getWordsByCategory(categoryId) as any;
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
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedWord(null);
        setIsEditing(false);
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

            setAllWords(prevWords =>
                prevWords.map(w =>
                    w._id === selectedWord._id
                        ? { ...w, userNotes: editedNotes }
                        : w
                )
            );

            setSelectedWord({ ...selectedWord, userNotes: editedNotes });
            setIsEditing(false);
        } catch (err: any) {
            console.error("Not kaydedilirken hata:", err);
            alert("Not kaydedilirken bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (wordId: string, newStatus: "new" | "learning" | "mastered") => {
        try {
            await oxfordApi.updateWordStatus(wordId, newStatus);

            setAllWords(prevWords =>
                prevWords.map(w =>
                    w._id === wordId ? { ...w, status: newStatus } : w
                )
            );

            if (selectedWord && selectedWord._id === wordId) {
                setSelectedWord({ ...selectedWord, status: newStatus });
            }
        } catch (err: any) {
            console.error("Durum güncellenirken hata:", err);
            alert("Durum güncellenirken bir hata oluştu");
        }
    };

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Oxford 3000 Kelime Listesi
                </h1>
            </div>

            <div className="mb-4 space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 p-2">   {/* letter buttons */}
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
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
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
                    <div className="flex items-center justify-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-1.5">  {/* page navigation buttons */}
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`
                            p-1 rounded transition-colors
                            ${currentPage === 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-100"
                                }
                        `}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-gray-600 px-2">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`
                            p-1 rounded transition-colors
                            ${currentPage === totalPages
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-100"
                                }
                        `}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">    {/* table */}
                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            <p className="text-xs text-gray-500">Yükleniyor...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            <p className="text-xs text-red-600">{error}</p>
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
                        <p className="text-sm text-gray-500">Bu harf için kelime bulunamadı</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">
                                            Kelime
                                        </th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">
                                            Çeviri
                                        </th>
                                        <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs w-20">
                                            Durum
                                        </th>
                                        <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs w-12">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {words.map((word) => {
                                        const StatusIcon = word.status === "new" ? Circle :
                                            word.status === "learning" ? Clock :
                                                CheckCircle2;
                                        const statusIconColor = word.status === "new" ? "text-gray-400" :
                                            word.status === "learning" ? "text-yellow-500" :
                                                "text-green-500";
                                        const rowBgColor = word.status === "new" ? "" :
                                            word.status === "learning" ? "bg-yellow-50/50" :
                                                "bg-green-50/50";
                                        const hasNotes = word.userNotes && word.userNotes.trim();
                                        return (
                                            <tr
                                                key={word._id}
                                                className={`${rowBgColor} hover:bg-blue-50 transition-colors`}
                                            >
                                                <td className="px-3 py-2">
                                                    <span className="font-medium text-gray-900 text-sm">{word.word}</span>
                                                </td>
                                                <td className="px-3 py-2 text-gray-700 text-sm">
                                                    {word.translation}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const nextStatus = word.status === "new" ? "learning" :
                                                                word.status === "learning" ? "mastered" : "new";
                                                            handleStatusChange(word._id, nextStatus);
                                                        }}
                                                        className="inline-flex items-center justify-center"
                                                        title={word.status === "new" ? "Yeni" :
                                                            word.status === "learning" ? "Öğreniyorum" : "Öğrendim"}
                                                    >
                                                        <StatusIcon className={`w-5 h-5 ${statusIconColor}`} />
                                                    </button>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditClick(word);
                                                        }}
                                                        className={`p-1 transition-colors ${hasNotes
                                                            ? "text-blue-500 hover:text-blue-600"
                                                            : "text-gray-400 hover:text-blue-600"
                                                            }`}
                                                        title="Notları düzenle"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
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


            <AnimatePresence>    {/* word detail */}
                {isModalOpen && selectedWord && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="fixed inset-0 bg-black/30 z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e: any) => e.stopPropagation()}
                            className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        >
                            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
                                <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-bold text-gray-900 truncate">
                                            {selectedWord.word}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {selectedWord.translation}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleCloseModal}
                                        className="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5">
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Durum
                                        </label>
                                        <select
                                            value={selectedWord.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    selectedWord._id,
                                                    e.target.value as "new" | "learning" | "mastered"
                                                )
                                            }
                                            className={`
                                                w-full text-sm font-medium px-3 py-2.5 rounded-lg
                                                border border-gray-300 bg-white
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                ${selectedWord.status === "new" ? "text-gray-700" :
                                                    selectedWord.status === "learning" ? "text-yellow-700" :
                                                        "text-green-700"}
                                            `}
                                        >
                                            <option value="new">Yeni</option>
                                            <option value="learning">Öğreniyorum</option>
                                            <option value="mastered">Öğrendim</option>
                                        </select>
                                    </div>

                                    <div>
                                        <div className="space-y-3">
                                            <textarea
                                                value={editedNotes}
                                                onChange={(e) => setEditedNotes(e.target.value)}
                                                placeholder="Notlarınızı buraya yazın..."
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 min-h-[150px] max-h-[300px] overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                style={{ whiteSpace: "pre-wrap" }}
                                            />
                                            <div className="flex items-center gap-2">
                                                {isTester ? (
                                                    <Link
                                                        href="/login"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 text-sm font-bold rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"                                                    >
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

                                                        <button
                                                            onClick={() => {
                                                                if (selectedWord) {
                                                                    setEditedNotes(selectedWord.userNotes || "");
                                                                }
                                                            }}
                                                            disabled={saving}
                                                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                                        >
                                                            İptal
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
