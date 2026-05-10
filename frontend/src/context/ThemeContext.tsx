import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        let isDark = saved === "dark" || (!saved && prefersDark);

        const hasToken = !!localStorage.getItem("token");
        const isGamePath = window.location.pathname.startsWith("/game");

        if (!saved && isGamePath && !hasToken) {
            isDark = false;
        }

        setDarkMode(isDark);

        document.documentElement.classList.toggle("dark", isDark);
        setMounted(true);
    }, []);

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem("theme", next ? "dark" : "light");

        document.documentElement.classList.add("theme-transitioning");
        document.documentElement.classList.toggle("dark", next);
        setTimeout(() => {
            document.documentElement.classList.remove("theme-transitioning");
        }, 50);
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
