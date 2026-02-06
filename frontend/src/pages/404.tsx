import Link from "next/link";
import SeoHead from "@/components/SeoHead";

export default function Custom404() {
  return (
    <>
      <SeoHead
        title="Sayfa Bulunamadı"
        description="Aradığınız sayfa bulunamadı. Ana sayfaya dönmek için burayı tıklayın."
        noindex={true}
      />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
            Sayfa Bulunamadı
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Üzgünüz, aradığınız sayfa mevcut değil. Lütfen ana sayfaya dönün.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </>
  );
}
