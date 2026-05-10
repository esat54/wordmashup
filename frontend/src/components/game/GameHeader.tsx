import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function GameHeader() {
  const { user, ready } = useAuth();
  const isLoggedIn = ready && !!user;
  const router = useRouter();

  const { darkMode, toggleDarkMode, mounted } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  const isGame = router.pathname.startsWith("/game");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = `sticky top-0 z-50 transition-all duration-300 ${
    scrolled || isGame
      ? "border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
      : "bg-transparent border-transparent"
  }`;

  return (
    <header className={headerClass}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center rounded-lg px-1 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
              aria-label="WordMashup Ana Sayfa"
            >
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Word<span className="text-blue-600 dark:text-blue-400">Mashup</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 ${
                isGame ? "hidden lg:inline-flex" : "inline-flex"
              } bg-gray-200 text-yellow-600 hover:bg-yellow-500 hover:text-white dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900`}
              title="Tema Değiştir"
              aria-label="Tema Değiştir"
            >
              <span className="sr-only">Tema Değiştir</span>
              <Sun className="w-5 h-5 block dark:hidden" />
              <Moon className="w-5 h-5 hidden dark:block" />
            </button>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="show-if-logged-in inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
              >
                Panel
              </Link>
              <Link
                href="/login"
                className="show-if-logged-out inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
              >
                Giriş Yap
              </Link>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
