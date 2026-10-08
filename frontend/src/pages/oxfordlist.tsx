import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/router";
import { ArrowRight, BookOpen, CheckCircle2, Circle, Clock3, ListOrdered, Loader2, Pencil, Sparkles } from "lucide-react";
import SeoHead from "@/components/SeoHead";
import HomeHeader from "@/components/home/header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { OXFORD_LIST_SEO, oxfordListJsonLd } from "@/lib/seo.config";

type WordStatus = null | "learning" | "learned";
const STATUS_LABELS = { empty: "İşaretlenmedi", learning: "Öğreniliyor", learned: "Öğrenildi" };
const WORD_CARDS = [
  { word: "abandon", meaning: "terk etmek", status: "learning" as WordStatus },
  { word: "ability", meaning: "kabiliyet", status: "learned" as WordStatus },
  { word: "able", meaning: "yapabilmek", status: null as WordStatus },
];
const STEPS = [
  { icon: ListOrdered, title: "Alfabetik listeden keşfet", text: "3.000’den fazla İngilizce kelimeyi A–Z sırasıyla incele. Kelimenin Türkçe çevirisini aynı satırda gör." },
  { icon: Sparkles, title: "AI ile kelimeyi aç", text: "AI ikonuna tıkla. Kelimenin özetini, benzer kelimeleri ve o kelimeyle oluşturulan örnek cümleyi birlikte incele." },
  { icon: Circle, title: "Öğrenme durumunu seç", text: "Kelimeyi işaretlemeden bırak, “Öğreniliyor” veya “Öğrenildi” durumuna getir. Çalıştığın kelimelerin ilerlemesini takip et." },
  { icon: Pencil, title: "Kendi notunu ekle", text: "Kalem ikonuyla kelimeye özel not al. Bir çağrışım, kısa açıklama veya kendi örnek cümlenle kelimeyi kişiselleştir." },
];
const EASE = [0.22, 1, 0.36, 1] as const;
const CONTAINER_CLASSES = "mx-auto w-[min(1180px,calc(100%_-_64px))] max-[900px]:w-[calc(100%_-_48px)] max-[700px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)]";

function StatusIcon({ status, size = 19 }: { status: WordStatus; size?: number }) {
  if (status === "learned") return <CheckCircle2 size={size} />;
  if (status === "learning") return <Clock3 size={size} />;
  return <Circle size={size} />;
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: EASE }}>{children}</motion.div>;
}

function ListButton({ onClick, loading, className = "" }: { onClick: () => void; loading: boolean; className?: string }) {
  return <button type="button" onClick={onClick} disabled={loading} aria-busy={loading} className={`inline-flex min-h-12 items-center justify-center gap-[10px] rounded-lg border border-[#111827] bg-[#111827] px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#1f2937] disabled:cursor-wait disabled:opacity-50 motion-reduce:transition-none [&>svg:last-child]:ml-[6px] ${className}`}>
    {loading ? <Loader2 className="animate-spin motion-reduce:animate-none" size={18} aria-hidden="true" /> : <BookOpen size={18} aria-hidden="true" />}
    <span>{loading ? "Liste açılıyor…" : "Oxford Listesine Git"}</span>
    {!loading && <ArrowRight size={18} aria-hidden="true" />}
  </button>;
}

function WordScene() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 95, damping: 22, mass: 0.7 });
  const y = useSpring(pointerY, { stiffness: 95, damping: 22, mass: 0.7 });
  const rotateX = useTransform(y, [-1, 1], [4, -4]);
  const rotateY = useTransform(x, [-1, 1], [-5, 5]);
  const boardX = useTransform(x, [-1, 1], [-13, 13]);
  const boardY = useTransform(y, [-1, 1], [-9, 9]);
  const backgroundX = useTransform(x, [-1, 1], [10, -10]);
  const backgroundY = useTransform(y, [-1, 1], [8, -8]);
  const [statuses, setStatuses] = useState<Record<string, WordStatus>>(() => Object.fromEntries(WORD_CARDS.map(card => [card.word, card.status])));


  useEffect(() => {
    if (reduceMotion) { pointerX.set(0); pointerY.set(0); return; }
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX.set(Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1)));
      pointerY.set(Math.max(-1, Math.min(1, event.clientY / window.innerHeight * 2 - 1)));
    };
    const resetPointer = () => { pointerX.set(0); pointerY.set(0); };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("pointerleave", resetPointer);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
    };
  }, [reduceMotion, pointerX, pointerY]);

  function cycleStatus(word: string) {
    setStatuses(previous => ({ ...previous, [word]: previous[word] === null ? "learning" : previous[word] === "learning" ? "learned" : null }));
  }

  return <div className="relative flex min-h-[330px] items-center justify-center py-[35px] [perspective:1100px] max-[900px]:min-h-[300px] max-[900px]:py-[30px] max-[700px]:mx-auto max-[700px]:w-[min(510px,100%)] max-[700px]:min-h-[264px] max-[700px]:py-[27px]">
    <motion.div className="pointer-events-none absolute inset-0" aria-hidden="true" style={reduceMotion ? undefined : { x: backgroundX, y: backgroundY }}>
      <div className="absolute left-1/2 top-1/2 h-[285px] w-[285px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#bfdbfe66] max-[900px]:h-[250px] max-[900px]:w-[250px]" /><div className="absolute left-1/2 top-1/2 h-[355px] w-[355px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#bfdbfe66] opacity-[.65] max-[900px]:h-[305px] max-[900px]:w-[305px]" />
      <div className="absolute right-[18px] top-[-16px] text-[85px] font-bold leading-none text-[#bfdbfe55] [font-family:inherit] [letter-spacing:-4px] max-[700px]:top-[-7px] max-[700px]:text-[72px]">Aa</div><span className="absolute left-[-7px] top-[62px] text-[23px] font-light text-[#93c5fd]">+</span><span className="absolute bottom-[45px] right-[-5px] text-[23px] font-light text-[#93c5fd]">+</span>
    </motion.div>
    <motion.div className="relative z-[2] w-full max-w-[545px] [transform-style:preserve-3d]" style={reduceMotion ? undefined : { rotateX, rotateY, x: boardX, y: boardY }}>
      <div className="flex flex-col gap-[10px]">
        {WORD_CARDS.map((card, index) => {
          const status = statuses[card.word];
          const statusKey = status || "empty";
          return <motion.article key={card.word} className={`grid h-16 min-w-0 grid-cols-[1fr_1fr_100px] items-center gap-[10px] rounded-lg border border-gray-200 bg-white px-4 shadow-[0_2px_6px_#11182708] transition-[background,border-color] duration-200 max-[1100px]:grid-cols-[1fr_1fr_94px] max-[1100px]:gap-[7px] max-[1100px]:px-3 max-[900px]:grid-cols-[1fr_1fr_86px] max-[900px]:gap-[6px] max-[900px]:px-[10px] max-[700px]:h-[58px] max-[700px]:grid-cols-[1fr_1fr_92px] max-[700px]:gap-2 max-[700px]:px-3 max-[380px]:grid-cols-[minmax(68px,1fr)_minmax(61px,1fr)_79px] max-[380px]:gap-1 max-[380px]:px-[9px] motion-reduce:transition-none ${status === "learning" ? "border-amber-100 bg-amber-50" : status === "learned" ? "border-green-100 bg-green-50" : ""}`} initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.15 + index * 0.1, ease: EASE }} aria-label={`${card.word}: ${card.meaning}`}>
            <strong className="min-w-0 text-base font-semibold leading-[1.2] max-[900px]:text-sm max-[380px]:text-[13px]" lang="en">{card.word}</strong><span className="min-w-0 text-sm leading-[1.4] text-gray-600 [overflow-wrap:anywhere] max-[900px]:text-xs max-[380px]:text-[11px]">{card.meaning}</span>
            <div className="flex items-center justify-end gap-1 max-[1100px]:gap-[2px] max-[900px]:gap-px max-[380px]:gap-0 [&_button]:grid [&_button]:h-8 [&_button]:w-[30px] [&_button]:place-items-center [&_button]:rounded-md [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-0 [&_button]:text-[#9ca3af] [&_button]:transition-colors [&_button]:duration-200 [&_button:hover]:bg-gray-100 [&_button]:motion-reduce:transition-none [&_span]:grid [&_span]:h-8 [&_span]:w-[30px] [&_span]:place-items-center [&_span]:rounded-md [&_span]:text-[#9ca3af] [&_span]:transition-colors [&_span]:duration-200 [&_span]:motion-reduce:transition-none [&_svg]:h-[18px] [&_svg]:w-[18px] max-[900px]:[&_button]:w-7 max-[900px]:[&_span]:w-7 max-[700px]:[&_button]:w-[30px] max-[700px]:[&_span]:w-[30px] max-[380px]:[&_button]:w-[26px] max-[380px]:[&_span]:w-[26px] max-[380px]:[&_svg]:h-[17px] max-[380px]:[&_svg]:w-[17px]">
              <span className="hover:bg-blue-50 hover:text-blue-600" aria-hidden="true"><Pencil size={18} /></span>
              <span className="text-violet-500 hover:bg-violet-50 hover:text-violet-600" aria-hidden="true"><Sparkles size={19} /></span>
              <button type="button" onClick={() => cycleStatus(card.word)} className={`${status === "learning" ? "text-yellow-500" : status === "learned" ? "text-green-500" : ""}`} aria-label={`${card.word}: ${STATUS_LABELS[statusKey]}. Durumu değiştir`} title={STATUS_LABELS[statusKey]}><StatusIcon status={status} /></button>
            </div>
          </motion.article>;
        })}
      </div>
    </motion.div>
  </div>;
}

export default function OxfordListMarketingPage() {
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const hero = heroRef.current;
    if (!header || !hero) return;
    const syncHeaderHeight = () => hero.style.setProperty("--ox-header-height", `${header.getBoundingClientRect().height}px`);
    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const goToList = async () => {
    if (isLoggedIn) {
      router.push("/dashboard/oxford");
      return;
    }
    try {
      setIsLoading(true);
      const data = (await authApi.testerLogin()) as any;
      login(data.user, data.token);
      router.push("/dashboard/oxford");
    } catch (error) {
      console.error("Tester login error:", error);
      setIsLoading(false);
    }
  };

  return <>
    <SeoHead title={OXFORD_LIST_SEO.title} description={OXFORD_LIST_SEO.description} canonical={OXFORD_LIST_SEO.canonical} keywords={OXFORD_LIST_SEO.keywords}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(oxfordListJsonLd) }} /></SeoHead>
    <div className="light-page relative overflow-x-clip bg-white text-[#111827] [color-scheme:light]">
      <div className="relative isolate bg-white">
        <div className="pointer-events-none absolute inset-0 z-[-2] bg-[radial-gradient(#9ca3af44_.9px,transparent_.9px)] opacity-[.65] [background-size:22px_22px]" aria-hidden="true" /><div className="pointer-events-none absolute right-0 top-[45px] z-[-1] h-[540px] w-[min(700px,75%)] bg-[radial-gradient(ellipse,#dbeafe55,transparent_67%)]" aria-hidden="true" />
        <div className="relative z-20 [&_header]:!bg-transparent [&_header]:![background-image:none] [&_header>div:first-child]:!bg-transparent [&_header>div:first-child]:![background-image:none]" ref={headerRef}><HomeHeader /></div>
        <main id="ox-main" className="[&_button]:cursor-pointer [&_button:disabled]:cursor-wait [&_button:disabled]:opacity-50 [&_button:focus-visible]:outline-[3px] [&_button:focus-visible]:outline-[#60a5fa] [&_button:focus-visible]:outline-offset-4 [&_svg]:shrink-0">
          <section className="relative bg-transparent pt-[50px] max-[900px]:pt-9 max-[700px]:pt-7 min-[901px]:flex min-[901px]:min-h-[calc(100dvh-var(--ox-header-height,80px))] min-[901px]:flex-col min-[901px]:pt-0" ref={heroRef} aria-labelledby="ox-hero-title">
            <div className={`${CONTAINER_CLASSES} grid grid-cols-[.9fr_1.1fr] items-center gap-[60px] pb-[45px] max-[1100px]:gap-[35px] max-[900px]:grid-cols-[.95fr_1.05fr] max-[900px]:gap-6 max-[700px]:grid-cols-1 max-[700px]:gap-[14px] max-[700px]:pb-[23px] min-[901px]:min-h-0 min-[901px]:flex-1 min-[901px]:py-[clamp(20px,4vh,64px)]`}>
              <Reveal className="py-[10px]"><h1 id="ox-hero-title" className="text-[48px] font-bold leading-[1.2] tracking-[-.025em] max-[900px]:text-[40px] max-[700px]:text-4xl"><span className="relative isolate inline-block text-blue-600 after:absolute after:bottom-[3px] after:left-0 after:right-0 after:z-[-1] after:h-[10px] after:-skew-y-[2deg] after:bg-blue-100 after:content-['']">Oxford</span> Liste</h1><p className="mt-[18px] text-xl font-medium leading-[1.5] text-gray-700 max-[900px]:text-lg max-[700px]:mt-4 max-[700px]:text-lg">Kelimelerin bir arada.<br /><span className="text-blue-600">İlerlemen gözünün önünde.</span></p><p className="mt-[18px] max-w-[450px] text-base leading-[1.75] text-gray-600 max-[1100px]:text-[15px] max-[900px]:text-sm max-[700px]:mt-4 max-[700px]:max-w-[460px] max-[700px]:text-base"><strong className="font-semibold text-gray-700">3.000’den fazla İngilizce kelimeyi</strong> alfabetik sırayla keşfet. <span className="text-blue-600">AI özetleri, benzer kelimeler ve örnek cümlelerle</span> öğren; durumunu işaretle, kendi notunu ekle.</p><div className="mt-[25px] max-[700px]:mt-[23px]"><ListButton onClick={goToList} loading={isLoading} className="max-[900px]:px-5 max-[900px]:text-sm max-[700px]:px-5 max-[700px]:text-base" /></div></Reveal>
              <Reveal delay={0.08}><WordScene /></Reveal>
            </div>
            <div className={`${CONTAINER_CLASSES} grid grid-cols-4 gap-6 border-t border-gray-200 py-[25px] pb-7 max-[1100px]:gap-[15px] max-[900px]:gap-[15px] max-[700px]:grid-cols-4 max-[700px]:gap-x-2 max-[700px]:gap-y-0 max-[700px]:py-[18px] max-[700px]:pb-5 max-[380px]:gap-x-1 min-[901px]:flex-none`}>{[{ value: "3.000+", label: "İngilizce kelime", detail: "Türkçe çevirisiyle birlikte" }, { value: "A–Z", label: "alfabetik liste", detail: "Düzenli, kolay keşif" }, { value: "3", label: "öğrenme durumu", detail: "Kendi ilerlemeni takip et" }, { value: "AI", label: "kelime desteği", detail: "Özet, benzerleri ve cümle" }].map(stat => <div className="min-w-0 flex items-center gap-[14px] max-[1100px]:gap-[10px] max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[7px] max-[700px]:gap-1" key={stat.label}><strong className="shrink-0 whitespace-nowrap text-[28px] font-bold tracking-[-.025em] max-[1100px]:text-[25px] max-[900px]:text-[25px] max-[700px]:min-w-0 max-[700px]:text-[19px] max-[380px]:text-base">{stat.value}</strong><div className="flex min-w-0 flex-col gap-1"><span className="text-xs font-semibold text-gray-600 max-[1100px]:text-[11px] max-[700px]:text-[9px] max-[380px]:text-[8px]">{stat.label}</span><small className="text-[10px] leading-[1.5] text-gray-400 max-[1100px]:text-[9px] max-[700px]:text-[8px] max-[380px]:text-[7px]">{stat.detail}</small></div></div>)}</div>
          </section>
          <div className="bg-gray-50">
            <section id="ox-nasil" className="border-t border-gray-200 bg-gray-50 py-16 pb-14 max-[900px]:py-[54px] max-[900px]:pb-12 max-[700px]:py-[46px]" aria-labelledby="ox-method-title"><div className={CONTAINER_CLASSES}>
              <Reveal className="mb-[30px] flex items-end justify-between gap-[45px] max-[900px]:gap-[30px] max-[700px]:mb-[26px] max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-[17px]"><div><span className="mb-[14px] block text-[10px] font-bold leading-[1.5] text-blue-600 [letter-spacing:1.2px]">BİR SATIRDAN DAHA FAZLASI</span><h2 id="ox-method-title" className="text-[32px] font-bold leading-[1.3] tracking-[-.025em] max-[700px]:text-[28px] max-[380px]:text-[26px]">Keşfet. Anla. İşaretle.<br /><span className="text-gray-600">Kendine bir not bırak.</span></h2></div></Reveal>
              <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[900px]:gap-[14px] max-[380px]:grid-cols-1">{STEPS.map((step, index) => <Reveal key={step.title} delay={index * 0.06} className="rounded-lg border border-gray-200 bg-white px-5 py-[22px] shadow-[0_1px_3px_#11182708] max-[1100px]:px-4 max-[900px]:p-[22px] max-[700px]:px-[17px] max-[700px]:py-[19px] max-[380px]:p-[21px]"><div className="mb-5 flex items-center justify-between max-[700px]:mb-[17px]"><span className="text-xs font-semibold text-gray-400 [letter-spacing:1px]">0{index + 1}</span><span className={`grid h-9 w-9 place-items-center rounded-lg ${index === 1 ? "bg-violet-50 text-violet-600" : index === 2 ? "bg-amber-50 text-yellow-500" : index === 3 ? "bg-blue-50 text-blue-500" : "bg-blue-50 text-blue-600"}`}><step.icon size={21} /></span></div><h3 className="mb-[10px] text-base font-semibold leading-[1.5] max-[700px]:text-[15px] max-[380px]:text-base">{step.title}</h3><p className="text-sm leading-[1.625] text-gray-500 max-[700px]:text-[13px] max-[380px]:text-sm">{step.text}</p></Reveal>)}</div>
            </div></section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  </>;
}
