import Header from "@/components/header";
import HeroArea from "@/components/hero";
import Features from "@/components/features";


export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-white relative">

        <div
          className="absolute top-0 left-0 w-full h-screen bg-dot-grid bg-white"
        ></div>

        <div
          className="absolute top-0 left-0 w-full h-screen"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.7) 80%, white 100%)'
          }}
        ></div>

        <div className="relative z-10">
          <Header />
          <main>
            <HeroArea />
            <Features />
          </main>
        </div>

      </div>
    </>
  )
}