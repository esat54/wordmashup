import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  MessageCircleQuestionMark,
  Pencil,
  RotateCcw,
  SlidersHorizontal,
  Star,
  TextQuote,
  Trash2,
  Volume2,
} from "lucide-react";

import SeoHead from "@/components/SeoHead";
import HomeHeader from "@/components/home/header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { WORDS_PAGE_SEO, wordsPageJsonLd } from "@/lib/seo.config";

const EASE = [0.22, 1, 0.36, 1] as const;

const CONTAINER =
  "mx-auto w-full max-w-[1180px] px-5 sm:px-8";

const EXAMPLE = {
  text: "Surround",
  translation: "Çevrelemek-Kuşatmak",
  type: "Fiil",
  exampleSentence:
    "Beautiful tall trees surround the old garden, creating a peaceful atmosphere for the residents.",
  sentenceTranslation:
    "Eski bahçeyi çevreleyen güzel ve uzun ağaçlar, sakinler için huzurlu bir atmosfer yaratıyor.",
};

const FEATURES = [
  {
    icon: TextQuote,
    title: "Kelimeyi bir cümleyle tamamla.",
    description:
      "Türkçe karşılığının yanına bir İngilizce örnek ve çevirisini ekle. Kelimeyi, kullanıldığı bağlamla birlikte hatırla.",
  },
  {
    icon: SlidersHorizontal,
    title: "Çalışmak istediklerini kolayca bul.",
    description:
      "Favorilerini seç, bilmediğin kelimeleri işaretle. Arama ve filtrelerle tekrar etmek istediğin kelimelere ulaş.",
  },
  {
    icon: Pencil,
    title: "Kartın arkasını kendine ayır.",
    description:
      "Bir çağrışım, kısa açıklama veya kendi örnek cümleni yaz. Her kelimeyi sana ait bir notla kişiselleştir.",
  },
];

const FACE_STYLE = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as const;

type TesterSession = {
  user: {
    name?: string;
    email: string;
  };
  token: string;
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay: reduceMotion ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

function DashboardCardPreview() {
  const reduceMotion = useReducedMotion();

  const [isFlipped, setIsFlipped] = useState(false);
  const [note, setNote] = useState("");

  const noteRef = useRef<HTMLTextAreaElement>(null);
  const pencilRef = useRef<HTMLButtonElement>(null);
  const hasChangedFace = useRef(false);

  useEffect(() => {
    if (!hasChangedFace.current) return;

    const timer = window.setTimeout(
      () => {
        if (isFlipped) {
          noteRef.current?.focus({ preventScroll: true });
        } else {
          pencilRef.current?.focus({ preventScroll: true });
        }
      },
      reduceMotion ? 0 : 560,
    );

    return () => window.clearTimeout(timer);
  }, [isFlipped, reduceMotion]);

  function changeFace(flipped: boolean) {
    hasChangedFace.current = true;
    setIsFlipped(flipped);
  }

  const cornerButton =
    "wm-demo-corner absolute bottom-4 right-4 z-10 " +
    "flex h-[18px] w-[18px] items-center justify-center " +
    "border-0 bg-transparent p-0 text-indigo-600 shadow-none " +
    "opacity-0 transition-opacity duration-200 " +
    "group-hover:opacity-100 group-focus-within:opacity-100 " +
    "focus-visible:opacity-100 hover:text-indigo-800 " +
    "motion-reduce:transition-none";

  return (
    <div
      className="w-full [perspective:1000px]"
      aria-label="Örnek dashboard kelime kartı"
    >
      <style>{`
        @media (hover: none) {
          .wm-demo-corner {
            opacity: 1;
          }
        }
      `}</style>

      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.55,
          ease: [0.4, 0.2, 0.2, 1],
        }}
        className="relative w-full [transform-style:preserve-3d]"
      >
        <div
          inert={isFlipped}
          aria-hidden={isFlipped}
          onClick={() => changeFace(true)}
          style={FACE_STYLE}
          className="group relative cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 transition-[border-color,box-shadow] hover:border-blue-300 hover:shadow-md motion-reduce:transition-none"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                lang="en"
                className="text-base font-semibold text-gray-900"
              >
                {EXAMPLE.text}
              </h3>

              <p className="text-sm text-gray-600">
                {EXAMPLE.translation}
              </p>
            </div>

            <div
              onClick={(event) => event.stopPropagation()}
              className="mt-[2px] flex shrink-0 flex-row gap-1"
              aria-hidden="true"
            >
              <span className="inline-flex text-gray-400 transition-colors hover:text-yellow-500">
                <Star
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                />
              </span>

              <span className="inline-flex text-gray-400 transition-colors hover:text-blue-500">
                <MessageCircleQuestionMark
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                />
              </span>

              <span className="inline-flex text-gray-400 transition-colors duration-200 hover:text-blue-500">
                <Volume2 className="h-[18px] w-[18px]" />
              </span>

              <span className="inline-flex text-gray-400 transition-colors hover:text-red-500">
                <Trash2
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>

          <div className="mb-2 text-xs text-gray-500">
            Tür: {EXAMPLE.type}
          </div>

          <hr className="my-2 border-gray-200" />

          <div className="text-sm text-gray-700">
            <p className="mb-1">
              <strong>Örnek:</strong>{" "}
              <span lang="en">{EXAMPLE.exampleSentence}</span>
            </p>

            <p>
              <strong>Çeviri:</strong>{" "}
              {EXAMPLE.sentenceTranslation}
            </p>
          </div>

          <button
            ref={pencilRef}
            type="button"
            onClick={() => changeFace(true)}
            aria-label="Kartın not yüzünü aç"
            title="Not ekle"
            className={cornerButton}
          >
            <Pencil
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </button>
        </div>

        <div
          inert={!isFlipped}
          aria-hidden={!isFlipped}
          onClick={() => changeFace(false)}
          style={{
            ...FACE_STYLE,
            transform: "rotateY(180deg)",
          }}
          className="group absolute inset-0 flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-gray-50 p-2.5 transition-[border-color,box-shadow] hover:border-blue-300 hover:shadow-md motion-reduce:transition-none"
        >
          <textarea
            ref={noteRef}
            aria-label="Örnek kelime kartının kişisel notu"
            placeholder="Not giriniz"
            maxLength={100}
            value={note}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setNote(event.target.value)}
            className="h-full min-h-0 w-full flex-1 resize-none rounded-lg border border-gray-200 bg-white p-2 pb-9 text-sm leading-relaxed text-gray-700 transition-colors placeholder:text-gray-400 focus:border-indigo-500/50 focus:outline-none focus:ring-0"
          />

          <button
            type="button"
            onClick={() => changeFace(false)}
            aria-label="Kartın ön yüzüne dön"
            title="Geri dön"
            className={cornerButton}
          >
            <RotateCcw
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </button>
        </div>
      </motion.div>

    </div>
  );
}

function CardShowcase() {
  const reduceMotion = useReducedMotion();
  const animated = reduceMotion === false;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 85,
    damping: 22,
    mass: 0.8,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 85,
    damping: 22,
    mass: 0.8,
  });

  const cardX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const cardY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const rotateX = useTransform(smoothY, [-1, 1], [2, -2]);
  const rotateY = useTransform(smoothX, [-1, 1], [-3, 3]);

  return (
    <div
      className="relative isolate flex min-h-[420px] w-full items-center justify-center px-6 [perspective:1100px] max-[700px]:min-h-[370px] max-[700px]:px-2"
      onPointerMove={(event) => {
        if (!animated || event.pointerType !== "mouse") return;

        const bounds = event.currentTarget.getBoundingClientRect();

        pointerX.set(
          Math.max(
            -1,
            Math.min(
              1,
              ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
            ),
          ),
        );

        pointerY.set(
          Math.max(
            -1,
            Math.min(
              1,
              ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
            ),
          ),
        );
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-8 rounded-full bg-blue-50/80 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: animated ? 360 : 0 }}
            transition={{
              duration: animated ? 48 : 0,
              repeat: animated ? Infinity : 0,
              ease: "linear",
            }}
            className="relative h-[410px] w-[410px] rounded-full border border-dashed border-blue-200/60 max-[700px]:h-[310px] max-[700px]:w-[310px]"
          >
            <span className="absolute left-1/2 top-[-4px] h-2 w-2 rounded-full bg-blue-300" />
            <span className="absolute bottom-[48px] right-[48px] h-1.5 w-1.5 rounded-full bg-blue-200" />
          </motion.div>
        </div>

        <div className="absolute left-1/2 top-1/2 h-[325px] w-[325px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/80 max-[700px]:h-[250px] max-[700px]:w-[250px]" />

        <motion.div
          animate={
            animated
              ? { y: [0, -10, 0], rotate: [-9, -6, -9] }
              : { y: 0, rotate: -9 }
          }
          transition={{
            duration: animated ? 7 : 0,
            repeat: animated ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="absolute left-[2%] top-[14%] h-[108px] w-[156px] rounded-lg border border-blue-100 bg-white/90 p-4 shadow-[0_4px_16px_#2563eb06] max-[700px]:left-0 max-[700px]:w-[125px]"
        >
          <div className="mb-4 h-2 w-12 rounded-full bg-blue-200/70" />
          <div className="space-y-2.5">
            <div className="h-1.5 w-full rounded-full bg-gray-100" />
            <div className="h-1.5 w-4/5 rounded-full bg-gray-100" />
            <div className="h-1.5 w-3/5 rounded-full bg-blue-100" />
          </div>
        </motion.div>

        <motion.div
          animate={
            animated
              ? { y: [0, 9, 0], rotate: [8, 5, 8] }
              : { y: 0, rotate: 8 }
          }
          transition={{
            duration: animated ? 8 : 0,
            repeat: animated ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] right-[1%] h-[105px] w-[160px] rounded-lg border border-blue-100 bg-blue-50/80 p-4 max-[700px]:right-0 max-[700px]:w-[125px]"
        >
          <div className="mb-4 h-2 w-10 rounded-full bg-blue-200/70" />
          <div className="space-y-2.5">
            <div className="h-1.5 w-full rounded-full bg-blue-100" />
            <div className="h-1.5 w-4/5 rounded-full bg-blue-100" />
            <div className="h-1.5 w-1/2 rounded-full bg-blue-200/50" />
          </div>
        </motion.div>

        <motion.div
          animate={
            animated
              ? { y: [0, -8, 0], rotate: [7, 11, 7] }
              : { y: 0, rotate: 7 }
          }
          transition={{
            duration: animated ? 5.5 : 0,
            repeat: animated ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="absolute right-[12%] top-[4%] grid h-12 w-12 place-items-center rounded-xl border border-blue-100 bg-white text-blue-500 shadow-[0_4px_16px_#2563eb08] max-[700px]:right-[7%]"
        >
          <BookOpen size={22} />
        </motion.div>

        <motion.div
          animate={
            animated
              ? { y: [0, 8, 0], rotate: [-8, -3, -8] }
              : { y: 0, rotate: -8 }
          }
          transition={{
            duration: animated ? 6.5 : 0,
            repeat: animated ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="absolute bottom-[4%] left-[12%] grid h-11 w-11 place-items-center rounded-xl border border-blue-100 bg-white text-blue-500 shadow-[0_4px_16px_#2563eb08] max-[700px]:left-[7%]"
        >
          <TextQuote size={21} />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-[400px] [transform-style:preserve-3d]"
        style={
          animated
            ? {
              x: cardX,
              y: cardY,
              rotateX,
              rotateY,
            }
            : undefined
        }
      >
        <motion.div
          animate={
            animated
              ? { y: [0, -6, 0], rotate: [0, 0.5, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={{
            duration: animated ? 6 : 0,
            repeat: animated ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="rounded-lg shadow-[0_14px_36px_-22px_rgba(15,23,42,0.3)]"
        >
          <DashboardCardPreview />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function WordsIntroPage() {
  const router = useRouter();
  const { ready, isLoggedIn, isTester, login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function goToWords() {
    if (!ready || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      if (!isLoggedIn && !isTester) {
        const session =
          (await authApi.testerLogin()) as TesterSession;

        if (!session?.user || !session?.token) {
          throw new Error("Demo oturumu açılamadı.");
        }

        login(session.user, session.token);
      }

      await router.push("/dashboard/words");
    } catch {
      setError("Kelime defteri açılamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <SeoHead
        title={WORDS_PAGE_SEO.title}
        description={WORDS_PAGE_SEO.description}
        canonical={WORDS_PAGE_SEO.canonical}
        keywords={WORDS_PAGE_SEO.keywords}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(wordsPageJsonLd) }}
        />
      </SeoHead>

      <div className="light-page relative isolate flex min-h-screen flex-col overflow-x-clip bg-white text-gray-900">
        <div
          className="pointer-events-none absolute left-0 top-0 z-0 h-screen w-full bg-dot-grid bg-white"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-0 z-0 h-screen w-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.7) 80%, white 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-screen flex-col">
          <HomeHeader />

          <main
            id="words-main"
            className="flex-1 [&_svg]:shrink-0 [&_button]:cursor-pointer [&_button:disabled]:cursor-wait"
          >
            <section
              aria-labelledby="words-title"
              className="relative flex flex-col py-10 sm:py-14 lg:py-16 min-[901px]:min-h-[calc(100dvh-4rem)] min-[901px]:py-0"
            >
              <div className={`${CONTAINER} min-[901px]:flex min-[901px]:flex-1 min-[901px]:items-center`}>
                <div className="grid grid-cols-[1fr_1.05fr] items-center gap-16 max-[1100px]:gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-5 min-[901px]:w-full">
                  <Reveal className="max-w-[520px]">
                    <p className="mb-5 text-[10px] font-semibold tracking-[1.8px] text-blue-600">
                      KİŞİSEL KELİME DEFTERİ
                    </p>

                    <h1
                      id="words-title"
                      className="text-[clamp(34px,4.2vw,50px)] font-semibold leading-[1.12] tracking-[-.04em]"
                    >
                      Kelimeleri biriktir.
                      <br />

                      <span className="text-blue-600">
                        Cümlelerinle hatırla.
                      </span>
                    </h1>

                    <h2 className="mt-6 text-xl font-medium leading-[1.4] tracking-[-.02em] sm:text-[23px]">
                      Kelimelerine anlam
                      <br />
                      ve bağlam ekle.
                    </h2>

                    <p className="mt-3 max-w-[440px] text-[15px] leading-[1.8] text-gray-500">
                      İngilizce kelimelerini Türkçe karşılıklarıyla
                      sakla. Kendi örnek cümlelerin ve kişisel
                      notlarınla her kelimeyi tamamla.
                    </p>

                    <p className="mt-3 max-w-[440px] text-sm leading-[1.8] text-gray-500">
                      Favorilerini ayır, zorlandığın kelimeleri
                      işaretle ve ihtiyaç duyduğunda defterine dön.
                    </p>

                    <button
                      type="button"
                      onClick={goToWords}
                      disabled={!ready || isLoading}
                      aria-busy={isLoading}
                      className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 motion-reduce:transition-none"
                    >
                      {isLoading ? (
                        <Loader2
                          size={17}
                          className="animate-spin motion-reduce:animate-none"
                          aria-hidden="true"
                        />
                      ) : (
                        <BookOpen size={17} aria-hidden="true" />
                      )}

                      <span>
                        {isLoading
                          ? "Defter açılıyor…"
                          : "Kelime Defterini Aç"}
                      </span>

                      {!isLoading && (
                        <ArrowRight size={17} aria-hidden="true" />
                      )}
                    </button>

                    {ready && !isLoggedIn && (
                      <p className="mt-3 text-xs leading-relaxed text-gray-400">
                        Kayıt olmadan inceleyebilirsin.
                        <br />

                        <Link
                          href="/register"
                          className="mt-1 inline-block font-medium text-blue-600 transition-colors hover:text-blue-700"
                        >
                          Kendi defterin için hesap oluştur.
                        </Link>
                      </p>
                    )}

                    {error && (
                      <p
                        role="alert"
                        className="mt-3 text-sm text-red-600"
                      >
                        {error}
                      </p>
                    )}
                  </Reveal>

                  <Reveal delay={0.12}>
                    <CardShowcase />
                  </Reveal>
                </div>
              </div>
            </section>

            <section
              aria-labelledby="words-features-title"
              className="border-t border-gray-200 bg-gray-50/70 py-12 sm:py-16"
            >
              <div
                className={`${CONTAINER} grid grid-cols-[.8fr_1.2fr] items-start gap-20 max-[900px]:grid-cols-1 max-[900px]:gap-8`}
              >
                <Reveal>
                  <h2
                    id="words-features-title"
                    className="text-[30px] font-semibold leading-[1.25] tracking-[-.035em] sm:text-[34px]"
                  >
                    Defterin.
                    <br />

                    <span className="text-gray-500">
                      Senin öğrenme düzenin.
                    </span>
                  </h2>

                  <p className="mt-4 max-w-[330px] text-sm leading-[1.8] text-gray-500">
                    Hangi kelimeleri saklayacağına, nasıl
                    hatırlayacağına ve neleri tekrar çalışacağına
                    kendin karar ver.
                  </p>
                </Reveal>

                <div className="divide-y divide-gray-200">
                  {FEATURES.map((feature, index) => (
                    <Reveal
                      key={feature.title}
                      delay={index * 0.06}
                      className="grid grid-cols-[32px_minmax(0,1fr)] gap-4 py-6 first:pt-0 last:pb-0"
                    >
                      <span className="flex h-8 items-center text-blue-600">
                        <feature.icon size={21} aria-hidden="true" />
                      </span>

                      <div>
                        <h3 className="text-base font-semibold leading-relaxed text-gray-900">
                          {feature.title}
                        </h3>

                        <p className="mt-2 max-w-[510px] text-sm leading-[1.8] text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}