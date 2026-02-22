import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, isTester, isLoggedIn } = useAuth();

  const targetHref = isLoggedIn ? "/dashboard" : "/login";
  const buttonLabel = isLoggedIn ? "Dashboard" : "Giriş Yap";

  return (
    <header className="relative z-50 mt-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl text-gray-900 font-bold">Word<span className="text-blue-600">Mashup</span></span>
            </Link>
          </div>

          <Link href={targetHref} className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors">
            {buttonLabel}
          </Link>

        </div>
      </div>
    </header>
  );
}