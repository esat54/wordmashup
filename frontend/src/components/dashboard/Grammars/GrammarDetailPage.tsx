"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Info, Layout, FileText, TextQuote, Save, X, Pencil, Lightbulb, } from "lucide-react";
import { grammarApi } from "@/lib/api";

type EditableField = "description" | "notes" | "rules" | "formula" | null;

interface GrammarDetailPageProps {
  grammarId: string;
  onBack?: () => void;
}

export default function GrammarDetailPage({ grammarId, onBack }: GrammarDetailPageProps) {
  const router = useRouter();
  const [grammar, setGrammar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editingField, setEditingField] = useState<EditableField>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [notesWidth, setNotesWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    grammarApi.getGrammarById(grammarId).then((res: any) => {
      setGrammar(res);
      setLoading(false);
    });
  }, [grammarId]);

  useEffect(() => {
    if (editingField && textareaRef.current) {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editingField]);

  useEffect(() => {
    if (editingField && textareaRef.current) {
      const textarea = textareaRef.current;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;

      window.scrollTo(0, scrollTop);
    }
  }, [editValue]);
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const bounded = Math.max(20, Math.min(80, percentage));
      setNotesWidth(bounded);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const isEditable = grammar && !grammar.isGlobal;

  const handleFieldClick = (field: EditableField) => {
    if (!isEditable || !field) return;
    setEditingField(field);
    setEditValue(grammar[field] || "");
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleFieldSave = async () => {
    if (!editingField) return;
    try {
      setSaving(true);
      const updateData: any = {};
      updateData[editingField] = editValue;
      const res: any = await grammarApi.updateGrammar(grammarId, updateData);
      setGrammar(res.grammar || { ...grammar, [editingField]: editValue });
      setEditingField(null);
      setEditValue("");
    } catch (err: any) {
      console.error("Güncelleme hatası:", err);
      alert("Güncelleme sırasında bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );

  if (!grammar) return null;

  const renderEditableContent = (
    field: EditableField,
    content: string,
    placeholder: string,
    textClassName: string,
    containerClassName: string = ""
  ) => {
    const isEditing = editingField === field;

    return (
      <div
        className={`${containerClassName} break-words relative transition-all duration-300`}
        style={{ overflowWrap: "anywhere" }}
      >
        {isEditing ? (
          <div className="space-y-3 animate-in fade-in duration-200">
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className={`w-full px-0 py-0 border-0 bg-transparent focus:ring-0 resize-none outline-none shadow-none ${textClassName}`}
              style={{ overflowWrap: "anywhere" }}
            />
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={handleFieldSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Kaydet
                  </>
                )}
              </button>
              <button
                onClick={handleFieldCancel}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
                İptal
              </button>
            </div>
          </div>
        ) : (
          <span className={textClassName}>{content || placeholder}</span>
        )}
      </div>
    );
  };

  const EditTriggerIcon = ({ field }: { field: EditableField }) => {
    if (!isEditable || editingField === field) return null;
    return (
      <button
        onClick={() => handleFieldClick(field)}
        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Düzenle"
      >
        <Pencil className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 antialiased text-slate-900 pb-10">

      {/* header */}
      <header className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                router.push("/dashboard/gramer");
              }
            }}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100 shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
            {grammar.title}
          </h1>
        </div>
        <div>
          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-md uppercase tracking-wider border border-blue-100">
            {grammar.category}
          </span>
        </div>
      </header>

      {/* formula & definition section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <section className={`lg:col-span-4 bg-slate-900 rounded-xl overflow-hidden shadow-md ring-1 ring-slate-900/5 flex flex-col group relative transition-colors duration-300 ${editingField === 'formula' ? 'bg-slate-800' : ''}`}>
          <div className="absolute -bottom-4 -right-4 opacity-[0.07] z-0 pointer-events-none">
            <Lightbulb className="w-32 h-32 text-indigo-100" />
          </div>
          <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between relative z-10">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              YAPI FORMÜLÜ
            </h2>
            <EditTriggerIcon field="formula" />
          </div>

          <div className="p-6 flex-1 relative z-10">
            {editingField === "formula" ? (
              <div className="space-y-3 h-full animate-in fade-in duration-200">
                <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Formül giriniz..."
                  className="w-full bg-transparent border-0 focus:ring-0 text-indigo-300 font-mono text-lg resize-none outline-none shadow-none"
                  style={{ overflowWrap: "anywhere" }}
                />
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                  <button
                    onClick={handleFieldSave}
                    disabled={saving}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-500 transition-colors shadow-sm"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Kaydet"}
                  </button>
                  <button
                    onClick={handleFieldCancel}
                    className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-medium rounded hover:bg-slate-600 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <code
                className="block text-lg font-mono font-medium text-slate-300 leading-relaxed tracking-tight break-words"
                style={{ overflowWrap: "anywhere" }}
              >
                {grammar.formula || "Formül girilmemiş"}
              </code>
            )}
          </div>
        </section>

        <section className={`lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col group transition-colors duration-300 ${editingField === 'description' ? 'bg-indigo-50/10' : ''}`}>
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
              <Layout className="w-4 h-4" /> TANIM
            </h2>
            <EditTriggerIcon field="description" />
          </div>
          <div className="flex-1">
            {renderEditableContent(
              "description",
              grammar.description,
              "Bu yapı için bir açıklama metni bulunmamaktadır.",
              "text-[16px] leading-relaxed text-slate-700 font-medium"
            )}
          </div>
        </section>
      </div>

      {/* notes/rules/divider*/}
      <div
        ref={containerRef}
        className="flex items-stretch relative min-h-[400px]"
        style={{ cursor: isDragging ? 'col-resize' : 'default' }}
      >

        <div
          className="flex flex-col"
          style={{ width: `${notesWidth}%` }}
        >
          <div className="flex items-center mb-4 pb-2 border-b border-[#F1E5BC]">
            <h2 className="text-xs font-bold text-[#854D0E] uppercase flex items-center gap-2 tracking-widest">
              <Info className="w-4 h-4" /> ÖNEMLİ NOTLAR
            </h2>
          </div>
          <div className="bg-[#FFFCF0] rounded-xl p-6 flex-1">
            <span
              className="text-[15px] leading-relaxed text-[#78350f] whitespace-pre-wrap font-semibold italic break-words"
              style={{ overflowWrap: "anywhere" }}
            >
              {grammar.notes || "Bu konu hakkında henüz bir not eklenmedi."}
            </span>
          </div>
        </div>

        <div
          className="w-5 flex flex-col items-center cursor-col-resize z-10 group/divider relative shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 w-px bg-slate-200 left-1/2 -translate-x-1/2 group-hover/divider:bg-indigo-200 transition-colors" />
        </div>

        <div
          className="flex flex-col"
          style={{ width: `${100 - notesWidth}%` }}
        >
          <div className="flex items-center mb-4 pb-2 border-b border-indigo-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
              <FileText className="w-4 h-4 text-blue-600" /> KULLANIM KURALLARI
            </h2>
          </div>
          <div className="bg-indigo-50/50 rounded-xl p-6 flex-1">
            <span
              className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap font-medium break-words"
              style={{ overflowWrap: "anywhere" }}
            >
              {grammar.rules || "Kural bilgisi mevcut değil."}
            </span>
          </div>
        </div>

      </div>

      {/* example sentences*/}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
            <TextQuote className="w-4 h-4" /> ÖRNEK CÜMLELER
          </h2>
          <span className="text-xs font-bold text-slate-500 px-2.5 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
            {grammar.examples?.length || 0} Örnek
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {grammar.examples?.map((ex: any, i: number) => (
            <div
              key={i}
              className="p-6 hover:bg-slate-50/50 transition-colors group relative"
            >
              <div className="absolute top-6 left-3 text-xs font-bold text-slate-200 select-none">
                {(i + 1).toString().padStart(2, '0')}
              </div>
              <div className="pl-6">
                <p
                  className="text-[16px] font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors break-words"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {ex.en}
                </p>
                <p
                  className="text-[14px] text-slate-500 font-medium italic break-words"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {ex.tr}
                </p>
              </div>
            </div>
          ))}
          {(!grammar.examples || grammar.examples.length === 0) && (
            <div className="col-span-full p-8 text-center text-slate-400 italic">
              Bu konu için henüz örnek cümle eklenmemiş.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}