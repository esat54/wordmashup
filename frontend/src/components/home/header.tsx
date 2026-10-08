import Link from "next/link";
import { useRouter } from "next/router";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function HomeHeader() {
  const { user, ready } = useAuth();
  const isLoggedIn = ready && !!user;
  const router = useRouter();
  const { toggleDarkMode } = useTheme();

  const isGame = router.pathname?.startsWith("/game") || router.asPath?.startsWith("/game");

  return (
    <header className="relative z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center rounded-lg px-1 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
              aria-label="WordMashup Ana Sayfa"
            >
              <span className={`text-xl font-bold ${isGame ? "text-gray-900 dark:text-white" : "text-gray-900"}`}>
                Word<span className={`text-blue-600 ${isGame ? "dark:text-blue-400" : ""}`}>Mashup</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isGame && (
              <button
                type="button"
                onClick={toggleDarkMode}
                className="inline-flex items-center justify-center p-2 rounded-lg transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 bg-gray-100 hover:bg-gray-200 text-yellow-600 hover:text-yellow-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 dark:hover:text-blue-300"
                title="Tema Değiştir"
                aria-label="Tema Değiştir"
              >
                <span className="sr-only">Tema Değiştir</span>
                <Sun className="w-5 h-5 block dark:hidden" />
                <Moon className="w-5 h-5 hidden dark:block" />
              </button>
            )}

            {ready && (
              isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
                >
                  Panel
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
                >
                  Giriş Yap
                </Link>
              )
            )}
          </div>

        </div>
      </div>
    </header>
  );
}