import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code2,
  ChevronDown,
} from "lucide-react";

export const isRichTextEmpty = (html?: string | null): boolean => {
  if (!html) return true;
  const stripped = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return stripped.length === 0;
};

export const formatHtmlDisplay = (content?: string | null): string => {
  if (!content) return "";
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }
  return content.replace(/\n/g, "<br />");
};

type FieldKey = "description" | "formula" | "rules" | "notes";

interface GrammarFieldsGroupProps {
  values: {
    description: string;
    formula: string;
    rules: string;
    notes: string;
  };
  onChange: (field: FieldKey, value: string) => void;
}

export default function GrammarFieldsGroup({
  values,
  onChange,
}: GrammarFieldsGroupProps) {
  const [activeField, setActiveField] = useState<FieldKey>("description");
  const [htmlModes, setHtmlModes] = useState<Record<FieldKey, boolean>>({
    description: false,
    formula: false,
    rules: false,
    notes: false,
  });
  const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);

  const editorRefs = {
    description: useRef<HTMLDivElement>(null),
    formula: useRef<HTMLDivElement>(null),
    rules: useRef<HTMLDivElement>(null),
    notes: useRef<HTMLDivElement>(null),
  };

  const textareaRefs = {
    description: useRef<HTMLTextAreaElement>(null),
    formula: useRef<HTMLTextAreaElement>(null),
    rules: useRef<HTMLTextAreaElement>(null),
    notes: useRef<HTMLTextAreaElement>(null),
  };

  const savedRangeRef = useRef<Range | null>(null);

  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;
    if (range) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  useEffect(() => {
    (Object.keys(editorRefs) as FieldKey[]).forEach((key) => {
      const ref = editorRefs[key].current;
      if (ref && !htmlModes[key]) {
        if (ref.innerHTML !== (values[key] || "")) {
          ref.innerHTML = values[key] || "";
        }
      }
    });
  }, [values, htmlModes]);

  const handleInput = useCallback(
    (field: FieldKey) => {
      const ref = editorRefs[field].current;
      if (ref) {
        const html = ref.innerHTML;
        if (html === "<br>" || html === "<p><br></p>" || html === "<p></p>") {
          onChange(field, "");
        } else {
          onChange(field, html);
        }
      }
    },
    [onChange]
  );

  const applySize = (sizeKey: string) => {
    const isHtml = htmlModes[activeField];

    if (isHtml) {
      const textarea = textareaRefs[activeField].current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);

      let openTag = "";
      let closeTag = "";

      if (sizeKey === "p") {
        openTag = "<p>";
        closeTag = "</p>";
      } else if (sizeKey === "large") {
        openTag = '<span style="font-size: 19px; font-weight: 600;">';
        closeTag = "</span>";
      } else if (sizeKey === "medium") {
        openTag = '<span style="font-size: 16px; font-weight: 500;">';
        closeTag = "</span>";
      } else if (sizeKey === "small") {
        openTag = '<span style="font-size: 13px;">';
        closeTag = "</span>";
      }

      const replacement = openTag + (selected || "metin") + closeTag;
      const newText =
        textarea.value.substring(0, start) +
        replacement +
        textarea.value.substring(end);

      onChange(activeField, newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + openTag.length,
          start + openTag.length + (selected ? selected.length : 5)
        );
      }, 0);
      return;
    }

    const ref = editorRefs[activeField].current;
    if (ref) {
      ref.focus();
      restoreSelection();

      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      if (sizeKey === "p") {
        document.execCommand("formatBlock", false, "<p>");
      } else {
        let sizeStyle = "16px";
        let weightStyle = "500";
        if (sizeKey === "large") {
          sizeStyle = "19px";
          weightStyle = "600";
        }
        if (sizeKey === "medium") {
          sizeStyle = "16px";
          weightStyle = "500";
        }
        if (sizeKey === "small") {
          sizeStyle = "13px";
          weightStyle = "normal";
        }

        if (!range.collapsed) {
          const span = document.createElement("span");
          span.style.fontSize = sizeStyle;
          span.style.fontWeight = weightStyle;
          span.appendChild(range.extractContents());
          range.insertNode(span);
        } else {
          const span = document.createElement("span");
          span.style.fontSize = sizeStyle;
          span.style.fontWeight = weightStyle;
          span.innerHTML = "&nbsp;";
          range.insertNode(span);
        }
      }

      saveCurrentSelection();
      handleInput(activeField);
    }
  };

  const executeCommand = (command: string, arg?: string) => {
    const isHtml = htmlModes[activeField];

    if (isHtml) {
      const textarea = textareaRefs[activeField].current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);

      let openTag = "";
      let closeTag = "";

      switch (command) {
        case "bold":
          openTag = "<b>";
          closeTag = "</b>";
          break;
        case "italic":
          openTag = "<i>";
          closeTag = "</i>";
          break;
        case "underline":
          openTag = "<u>";
          closeTag = "</u>";
          break;
        case "ul":
          openTag = "<ul>\n  <li>";
          closeTag = "</li>\n</ul>";
          break;
        case "ol":
          openTag = "<ol>\n  <li>";
          closeTag = "</li>\n</ol>";
          break;
        default:
          return;
      }

      const replacement = openTag + (selected || "metin") + closeTag;
      const newText =
        textarea.value.substring(0, start) +
        replacement +
        textarea.value.substring(end);

      onChange(activeField, newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + openTag.length,
          start + openTag.length + (selected ? selected.length : 5)
        );
      }, 0);
      return;
    }

    const ref = editorRefs[activeField].current;
    if (ref) {
      ref.focus();
      restoreSelection();

      if (command === "ul") {
        document.execCommand("insertUnorderedList");
      } else if (command === "ol") {
        document.execCommand("insertOrderedList");
      } else {
        document.execCommand(command, false, arg);
      }

      saveCurrentSelection();
      handleInput(activeField);
    }
  };

  const toggleHtml = () => {
    setHtmlModes((prev) => ({
      ...prev,
      [activeField]: !prev[activeField],
    }));
  };

  const boxBaseClass =
    "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 transition-colors hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0";

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 transition-colors hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] select-none">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("bold");
              }}
              title="Kalın"
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("italic");
              }}
              title="İtalik"
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("underline");
              }}
              title="Altı Çizili"
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  saveCurrentSelection();
                  setIsSizeMenuOpen((prev) => !prev);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span>Boyut</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isSizeMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSizeMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-1 w-36 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-40 text-xs text-gray-700 dark:text-gray-200">
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applySize("p");
                        setIsSizeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 font-normal"
                    >
                      Paragraf
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applySize("large");
                        setIsSizeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-[13px]"
                    >
                      Büyük
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applySize("medium");
                        setIsSizeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                    >
                      Orta
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applySize("small");
                        setIsSizeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-[11px]"
                    >
                      Küçük
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("ul");
              }}
              title="Madde İşaretli Liste"
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("ol");
              }}
              title="Numaralı Liste"
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleHtml();
              }}
              title={
                htmlModes[activeField]
                  ? "Görsel Moda Geç"
                  : "HTML Kod Moduna Geç"
              }
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                htmlModes[activeField]
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">
                {htmlModes[activeField] ? "Görsel" : "</> HTML"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Kısa açıklama
          </label>
          {htmlModes.description ? (
            <textarea
              ref={textareaRefs.description}
              value={values.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              onFocus={() => setActiveField("description")}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Kartta görünecek özet..."
              style={{ outline: "none", boxShadow: "none" }}
              className="w-full px-4 py-2.5 text-sm font-mono bg-slate-900 text-indigo-200 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 min-h-[75px] resize-y block transition-colors hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
            />
          ) : (
            <div className={boxBaseClass} style={{ outline: "none", boxShadow: "none" }}>
              <div className="relative">
                {isRichTextEmpty(values.description) && (
                  <div className="absolute top-2.5 left-4 text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">
                    Kartta görünecek özet...
                  </div>
                )}
                <div
                  ref={editorRefs.description}
                  contentEditable
                  onFocus={() => setActiveField("description")}
                  onInput={() => handleInput("description")}
                  onMouseUp={saveCurrentSelection}
                  onKeyUp={saveCurrentSelection}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 min-h-[75px] leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Formül
          </label>
          {htmlModes.formula ? (
            <textarea
              ref={textareaRefs.formula}
              value={values.formula || ""}
              onChange={(e) => onChange("formula", e.target.value)}
              onFocus={() => setActiveField("formula")}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Lütfen formül giriniz"
              style={{ outline: "none", boxShadow: "none" }}
              className="w-full px-4 py-2.5 text-sm font-mono bg-slate-900 text-indigo-200 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 min-h-[75px] resize-y block transition-colors hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
            />
          ) : (
            <div className={boxBaseClass} style={{ outline: "none", boxShadow: "none" }}>
              <div className="relative">
                {isRichTextEmpty(values.formula) && (
                  <div className="absolute top-2.5 left-4 text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none font-mono">
                    Lütfen formül giriniz
                  </div>
                )}
                <div
                  ref={editorRefs.formula}
                  contentEditable
                  onFocus={() => setActiveField("formula")}
                  onInput={() => handleInput("formula")}
                  onMouseUp={saveCurrentSelection}
                  onKeyUp={saveCurrentSelection}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="w-full px-4 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 min-h-[75px] leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Kurallar
          </label>
          {htmlModes.rules ? (
            <textarea
              ref={textareaRefs.rules}
              value={values.rules || ""}
              onChange={(e) => onChange("rules", e.target.value)}
              onFocus={() => setActiveField("rules")}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Temel kuralları madde veya paragraf olarak yazın..."
              style={{ outline: "none", boxShadow: "none" }}
              className="w-full px-4 py-2.5 text-sm font-mono bg-slate-900 text-indigo-200 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 min-h-[140px] resize-y block transition-colors hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
            />
          ) : (
            <div className={boxBaseClass} style={{ outline: "none", boxShadow: "none" }}>
              <div className="relative">
                {isRichTextEmpty(values.rules) && (
                  <div className="absolute top-2.5 left-4 text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">
                    Temel kuralları madde veya paragraf olarak yazın...
                  </div>
                )}
                <div
                  ref={editorRefs.rules}
                  contentEditable
                  onFocus={() => setActiveField("rules")}
                  onInput={() => handleInput("rules")}
                  onMouseUp={saveCurrentSelection}
                  onKeyUp={saveCurrentSelection}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 min-h-[140px] leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Notlar
          </label>
          {htmlModes.notes ? (
            <textarea
              ref={textareaRefs.notes}
              value={values.notes || ""}
              onChange={(e) => onChange("notes", e.target.value)}
              onFocus={() => setActiveField("notes")}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="İpuçları, istisnalar, sık hatalar..."
              style={{ outline: "none", boxShadow: "none" }}
              className="w-full px-4 py-2.5 text-sm font-mono bg-slate-900 text-indigo-200 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 min-h-[140px] resize-y block transition-colors hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)]"
            />
          ) : (
            <div className={boxBaseClass} style={{ outline: "none", boxShadow: "none" }}>
              <div className="relative">
                {isRichTextEmpty(values.notes) && (
                  <div className="absolute top-2.5 left-4 text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">
                    İpuçları, istisnalar, sık hatalar...
                  </div>
                )}
                <div
                  ref={editorRefs.notes}
                  contentEditable
                  onFocus={() => setActiveField("notes")}
                  onInput={() => handleInput("notes")}
                  onMouseUp={saveCurrentSelection}
                  onKeyUp={saveCurrentSelection}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 min-h-[140px] leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
