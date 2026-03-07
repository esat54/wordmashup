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

const LIGHT_ONLY_PATHS = ['/', '/login', '/register'];

function applyTheme(pathname: string, darkMode: boolean) {
    const isLightOnly = LIGHT_ONLY_PATHS.includes(pathname);
    if (isLightOnly) {
        document.documentElement.classList.remove("dark");
    } else {
        document.documentElement.classList.toggle("dark", darkMode);
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const isDarkDisabled = LIGHT_ONLY_PATHS.includes(router.pathname);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = saved === "dark" || (!saved && prefersDark);
        setDarkMode(isDark);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const handleRouteStart = (url: string) => {
            const pathname = url.split('?')[0];
            applyTheme(pathname, darkMode);
        };

        const handleRouteComplete = (url: string) => {
            const pathname = url.split('?')[0];
            applyTheme(pathname, darkMode);
        };

        router.events.on("routeChangeStart", handleRouteStart);
        router.events.on("routeChangeComplete", handleRouteComplete);

        return () => {
            router.events.off("routeChangeStart", handleRouteStart);
            router.events.off("routeChangeComplete", handleRouteComplete);
        };
    }, [mounted, darkMode, router.events]);

    useEffect(() => {
        if (!mounted) return;
        applyTheme(router.pathname, darkMode);
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
