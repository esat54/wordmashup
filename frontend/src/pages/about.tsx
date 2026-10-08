import SeoHead from "@/components/SeoHead";
import HomeHeader from "@/components/home/header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <SeoHead
        title="Hakkımızda"
        description="WordMashup hakkında. Yapay zeka ve Oxford 3000 metodolojisiyle İngilizce öğrenimini hızlandıran ve kalıcı kılan interaktif platform."
        canonical="https://www.wordmashup.online/about"
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
