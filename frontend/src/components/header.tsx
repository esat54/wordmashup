"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-3 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl text-gray-900 font-bold">Word<span className="text-blue-600">Mashup</span></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Giriş Yap
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors">
              Hemen Başla
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}