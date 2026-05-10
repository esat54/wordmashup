

import { useState, useEffect, useCallback, useRef } from "react";

interface UseQuizLogicProps {
    fetchFn: () => Promise<any[]>;
    saveFn?: (data: { word: string; translation: string; level?: string }) => Promise<any>;
    wordField?: "text" | "word";
    displayCount?: number;
}

function pickRandom<T>(pool: T[], count: number): T[] {
    const arr = [...pool];
    const n = Math.min(count, arr.length);
    for (let i = arr.length - 1; i > arr.length - n - 1 && i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(arr.length - n);
}

export function useQuizLogic({ fetchFn, saveFn, wordField = "text", displayCount = 20 }: UseQuizLogicProps) {
    const [allWords, setAllWords] = useState<any[]>([]);
    const [words, setWords] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<number | null>(null);
    const [user, setUser] = useState<any>(null);
    const [showLang, setShowLang] = useState<"TR" | "EN">("TR");
    const [answers, setAnswers] = useState<string[]>([]);
    const [results, setResults] = useState<(null | boolean)[]>([]);

    const requestCounter = useRef(0);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const shuffleFromPool = useCallback((pool: any[]) => {
        const selected = pickRandom(pool, displayCount);
        setWords(selected);
        setResults(new Array(selected.length).fill(null));
        setAnswers(new Array(selected.length).fill(""));
    }, [displayCount]);

    const fetchWords = async () => {
        const requestId = ++requestCounter.current;
        setLoading(true);
        setWords([]);

        try {
            const data = await fetchFn();

            if (requestId === requestCounter.current) {
                setAllWords(data);
                shuffleFromPool(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (requestId === requestCounter.current) {
                setLoading(false);
            }
        }
    };

    const normalize = (str?: string) => {
        if (!str) return "";
        return str.toLowerCase().split(",")[0].trim();
    };

    const getWordText = (w: any) => w?.[wordField] || "";
    const getTranslation = (w: any) => w?.translation || "";

    const handleInputChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSpeech = (index: number) => {
        const textToSpeak = getWordText(words[index]);
        if (!textToSpeak) return;

        if (!window.speechSynthesis) {
            alert("Tarayıcınız seslendirme özelliğini desteklemiyor.");
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = "en-US";
        utterance.rate = 0.7;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    };

    const handleCheck = (index: number) => {
        const w = words[index];
        const correct = showLang === "TR"
            ? normalize(getWordText(w))
            : normalize(getTranslation(w));
        const isCorrect = normalize(answers[index]) === correct;
        const newResults = [...results];
        newResults[index] = isCorrect;
        setResults(newResults);
    };

    const handleRetry = (index: number) => {
        const newResults = [...results];
        newResults[index] = null;
        setResults(newResults);
    };

    const handleShuffle = () => {
        shuffleFromPool(allWords);
    };

    const toggleLang = () => {
        setShowLang(prev => (prev === "TR" ? "EN" : "TR"));
        handleShuffle();
    };

    const mapWord = (w: any) => ({
        ...w,
        text: getWordText(w),
        translation: getTranslation(w),
    });

    const handleSaveWord = async (index: number) => {
        if (!saveFn) return;
        if (!user) {
            alert("Kelime kaydetmek için giriş yapmalısınız");
            return;
        }
        try {
            setSaving(index);
            await new Promise(resolve => setTimeout(resolve, 200));
            await saveFn({
                word: mapWord(words[index]).text,
                translation: mapWord(words[index]).translation,
            });
            const newResults = [...results];
            newResults[index] = null;
            setResults(newResults);
            const newAnswers = [...answers];
            newAnswers[index] = "";
            setAnswers(newAnswers);
        } catch (err: any) {
            const errMsg = err.message || "";
            const isAlreadySaved = errMsg.includes("already exists") ||
                errMsg.includes("zaten mevcut") ||
                errMsg.includes("kaydedilmiş") ||
                errMsg.includes("conflict") ||
                err.status === 409;
            if (!isAlreadySaved) {
                alert(errMsg || "Kelime kaydedilirken hata oluştu");
            }
        } finally {
            setSaving(null);
        }
    };

    return {
        words,
        allWords,
        loading,
        saving,
        setSaving,
        user,
        showLang,
        answers,
        results,
        setResults,
        setAnswers,
        fetchWords,
        normalize,
        handleInputChange,
        handleSpeech,
        handleCheck,
        handleRetry,
        handleShuffle,
        handleSaveWord,
        toggleLang,
        mapWord,
    };
}

