import { useState, useEffect } from "react";
import { Plus, MessageSquare, Edit2, Trash2, ChevronDown, ChevronUp, X, Check, Search } from "lucide-react";
import { phraseApi } from "@/lib/api";
import { useRouter } from "next/router";

interface Phrase {
  _id: string;
  question: string;
  answer: string;
  note?: string;
  tags?: string[];
  createdAt: string;
}

export default function PhrasesPage() {
  const router = useRouter();

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<Phrase | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPhrases();
  }, []);

  const fetchPhrases = async () => {
    setIsLoading(true);
    try {
      const res = await phraseApi.getPhrases() as { phrases: Phrase[] };
      setPhrases(res.phrases || []);
    } catch (e) {
      console.error("Kalıplar yüklenemedi:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingPhrase(null);
    setForm({ question: "", answer: "", note: "" });
    setShowForm(true);
  };

  const openEditForm = (phrase: Phrase) => {
    setEditingPhrase(phrase);
    setForm({ question: phrase.question, answer: phrase.answer, note: phrase.note || "" });
    setShowForm(true);
    setExpandedId(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPhrase(null);
    setForm({ question: "", answer: "", note: "" });
  };

  const handleSubmit = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSubmitting(true);
    try {
      if (editingPhrase) {
        const res = await phraseApi.updatePhrase(editingPhrase._id, form) as { phrase: Phrase };
        setPhrases(prev => prev.map(p => p._id === editingPhrase._id ? res.phrase : p));
      } else {
        const res = await phraseApi.createPhrase(form) as { phrase: Phrase };
        setPhrases(prev => [res.phrase, ...prev]);
      }
      closeForm();
    } catch (e) {
      console.error("Kalıp kaydedilemedi:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await phraseApi.deletePhrase(id);
      setPhrases(prev => prev.filter(p => p._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (e) {
      console.error("Kalıp silinemedi:", e);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = phrases.filter(p =>
    p.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-4 antialiased">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40">
                <MessageSquare size={18} className="text-violet-600 dark:text-violet-400" />
              </span>
              Kalıplarım
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              {phrases.length} kalıp · Kişisel cümle ve ifade arşivin
            </p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-violet-200 dark:shadow-violet-900/30"
          >
            <Plus size={16} />
            Yeni Kalıp Ekle
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-violet-200 dark:border-violet-700/50">
          <div className="flex items-center justify-between p-5 border-b border-violet-100 dark:border-violet-700/30">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              {editingPhrase ? "Kalıbı Düzenle" : "Yeni Kalıp Ekle"}
            </h2>
            <button
              onClick={closeForm}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                Soru / Başlık <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.question}
                onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
                placeholder="Örn: Why do you want to learn English?"
                rows={2}
                className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 focus:border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                Cevap / Kalıp <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.answer}
                onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
                placeholder="Örn: I want to learn English to advance my career and open up global opportunities. When I go abroad in the future I want to be able to express myself well..."
                rows={5}
                className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 focus:border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                Not <span className="text-gray-400 font-normal normal-case">(isteğe bağlı)</span>
              </label>
              <input
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="Bu kalıpla ilgili kişisel notunuz..."
                className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.question.trim() || !form.answer.trim()}
                className="flex items-center gap-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-lg transition-colors"
              >
                <Check size={15} />
                {submitting ? "Kaydediliyor..." : editingPhrase ? "Güncelle" : "Kaydet"}
              </button>
              <button
                onClick={closeForm}
                className="text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {phrases.length > 0 && (
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Kalıplarda ara..."
            className="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all"
          />
        </div>
      )}

      {/* Phrases List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded animate-pulse w-1/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="flex items-center justify-center w-14 h-14 bg-violet-50 dark:bg-violet-900/20 rounded-2xl mx-auto mb-4">
            <MessageSquare size={26} className="text-violet-400" />
          </div>
          {searchTerm ? (
            <>
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">Sonuç bulunamadı</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">"{searchTerm}" ile eşleşen kalıp yok</p>
            </>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">Henüz kalıp yok</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">İlk kalıbını ekleyerek başla</p>
              <button
                onClick={openAddForm}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={15} />
                İlk Kalıbı Ekle
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(phrase => (
            <div
              key={phrase._id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow transition-shadow"
            >
              {/* Question row */}
              <button
                onClick={() => setExpandedId(expandedId === phrase._id ? null : phrase._id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex-1 pr-4 leading-relaxed">
                  {phrase.question}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium hidden sm:block">
                    {new Date(phrase.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" })}
                  </span>
                  {expandedId === phrase._id
                    ? <ChevronUp size={16} className="text-violet-500 dark:text-violet-400" />
                    : <ChevronDown size={16} className="text-gray-400 group-hover:text-violet-500 transition-colors" />
                  }
                </div>
              </button>

              {/* Expanded answer */}
              {expandedId === phrase._id && (
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 px-4 pt-4 pb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {phrase.answer}
                  </p>
                  {phrase.note && (
                    <div className="mt-3 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-800/30 rounded-lg px-3 py-2.5">
                      <span className="text-base leading-none mt-0.5">📝</span>
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">{phrase.note}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditForm(phrase)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Edit2 size={12} />
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(phrase._id)}
                      disabled={deletingId === phrase._id}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                      {deletingId === phrase._id ? "Siliniyor..." : "Sil"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
