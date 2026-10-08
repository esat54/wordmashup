import SeoHead from "@/components/SeoHead";
import HomeHeader from "@/components/home/header";
import Footer from "@/components/Footer";

export default function OxfordListPage() {
  return (
    <>
      <SeoHead
        title="Oxford 3000 Kelime Listesi"
        description="Oxford 3000 en önemli İngilizce kelimeler listesi. CEFR A1-B2 seviyelerine göre filtrelenebilir kelime kütüphanesi ve takip araçları."
        canonical="https://www.wordmashup.online/oxfordlist"
      />

      <div className="light-page min-h-screen bg-white relative">
        <div className="absolute top-0 left-0 w-full h-screen bg-dot-grid bg-white"></div>
        <div
          className="absolute top-0 left-0 w-full h-screen"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.7) 80%, white 100%)",
          }}
        ></div>
        <div className="relative z-10 min-h-screen flex flex-col">
          <HomeHeader />
          <main className="flex-1" />
          <Footer />
        </div>
      </div>
    </>
  );
}
