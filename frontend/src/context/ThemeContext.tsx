import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";

interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => { },
    mounted: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const isDarkDisabled = router.pathname === '/' || router.pathname === '/login' || router.pathname === '/register';

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = saved === "dark" || (!saved && prefersDark);
        setDarkMode(isDark);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (isDarkDisabled) {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.toggle("dark", darkMode);
        }
    }, [isDarkDisabled, darkMode, mounted]);

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem("theme", next ? "dark" : "light");

        if (!isDarkDisabled) {
            document.documentElement.classList.add("theme-transitioning");
            document.documentElement.classList.toggle("dark", next);
            setTimeout(() => {
                document.documentElement.classList.remove("theme-transitioning");
            }, 50);
        }
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
