import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HomeHeader() {
  const { user, ready } = useAuth();
  const isLoggedIn = ready && !!user;

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
              <span className="text-xl font-bold text-gray-900">
                Word<span className="text-blue-600">Mashup</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
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