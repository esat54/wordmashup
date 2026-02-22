import { Menu, User, Sun, Moon, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

interface DashboardHeaderProps {
  user: { name: string; email: string };
  isTester: boolean;
  onOpenMobileMenu: () => void;
  pageTitle: string;
}

export default function DashboardHeader({ user, isTester, onOpenMobileMenu, pageTitle, }: DashboardHeaderProps) {
  const { darkMode, toggleDarkMode, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-7 pt-4 pb-4 lg:pb-0">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:flex items-center">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-center lg:hidden flex-1">
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Word<span className="text-blue-600 dark:text-blue-400">Mashup</span>
          </span>
        </div>

        {/* Right side - Quiz Button, Test Badge/User Badge, Dark Mode Toggle */}
        <div className="flex items-center justify-end gap-3 flex-1">
          <Link
            href="/quiz"
            className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 lg:px-5 lg:py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0"
          >
            <Sparkles className="w-4 h-4" />
            Quiz'e Git
          </Link>

          {isTester ? (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl shadow-sm select-none">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                <div className="absolute w-2 h-2 bg-indigo-400 rounded-full" />
              </div>
              <span className="text-[10px] lg:text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em]">
                TEST ACCOUNT
              </span>
            </div>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                <User size={14} className="text-gray-400 dark:text-gray-500" />
                <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
              </div>
            </>
          )}

          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex items-center w-[52px] h-7 rounded-full focus:outline-none flex-shrink-0 border-2 transition-all duration-300 ${!mounted ? "opacity-0" : "opacity-100"
              } ${darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-slate-200 border-slate-300"
              }`}
            title={darkMode ? "Açık Tema" : "Koyu Tema"}
            aria-pressed={darkMode}
            aria-label="Tema Değiştir"
          >
            <span className="sr-only">Tema Değiştir</span>

            <div className="flex w-full justify-between items-center px-1.5 z-0 pointer-events-none">
              <Sun className={`w-3 h-3 transition-opacity ${darkMode ? "opacity-30 text-gray-500" : "opacity-100 text-yellow-500"}`} />
              <Moon className={`w-3 h-3 transition-opacity ${darkMode ? "opacity-100 text-blue-400" : "opacity-30 text-gray-400"}`} />
            </div>

            <span
              className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center z-10 ${darkMode ? "translate-x-[25px]" : "translate-x-0"
                }`}
            >
              {darkMode ? (
                <Moon className="w-3 h-3 text-gray-800 fill-gray-800" />
              ) : (
                <Sun className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              )}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}