import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "@/context/ThemeContext";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const router = useRouter();
  const { darkMode } = useTheme();
  const isDarkGame = router.pathname.startsWith("/game") && darkMode;

  return (
    <footer
      className={`border-t ${
        isDarkGame ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"
      }`}
      aria-label="Site Altbilgisi"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b ${
          isDarkGame ? "border-gray-800" : "border-gray-100"
        }`}>
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className={`text-sm font-bold tracking-tight ${
                isDarkGame ? "text-white" : "text-gray-900"
              }`}
            >
              Word<span className={isDarkGame ? "text-blue-400" : "text-blue-600"}>Mashup</span>
            </Link>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider leading-none ${
              isDarkGame
                ? "bg-blue-900/40 text-blue-400"
                : "bg-blue-100 text-blue-600"
            }`}>
              Beta
            </span>
          </div>

          <nav className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium ${
            isDarkGame ? "text-gray-400" : "text-gray-500"
          }`} aria-label="Altbilgi Gezinti">
            <Link href="/oxfordlist" className={`transition-colors ${isDarkGame ? "hover:text-blue-400" : "hover:text-blue-600"}`}>
              Oxford Liste
            </Link>
            <Link href="/words" className={`transition-colors ${isDarkGame ? "hover:text-blue-400" : "hover:text-blue-600"}`}>
              Kelimelerim
            </Link>
            <Link href="/game" className={`transition-colors ${isDarkGame ? "hover:text-blue-400" : "hover:text-blue-600"}`}>
              Oyunlar & Pratik
            </Link>
            <Link href="/contact" className={`transition-colors ${isDarkGame ? "hover:text-blue-400" : "hover:text-blue-600"}`}>
              İletişim
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/esat54/wordmashup/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isDarkGame
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/esatdlkc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isDarkGame
                  ? "bg-gray-800 text-gray-400 hover:bg-blue-900/40 hover:text-blue-400"
                  : "bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className={`pt-4 flex flex-col sm:flex-row items-center justify-between text-xs gap-2 ${
          isDarkGame ? "text-gray-500" : "text-gray-400"
        }`}>
          <span>© {year} WordMashup. Tüm hakları saklıdır.</span>
          <span>AI Destekli İngilizce Öğrenme Platformu</span>
        </div>
      </div>
    </footer>
  );
}
