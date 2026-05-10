import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Brain, FlipHorizontal, Shuffle, Trophy, Star, Zap, Crown, Medal, Award, Users, Target, Gamepad2, Sparkles, ArrowRight, ChevronRight, ChevronDown } from "lucide-react";
import GameLayout from "@/components/game/GameLayout";

interface Game {
  id: string;
  icon: React.ElementType;
  title: string;
  tagline: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  href: string;
  features: string[];
  previewLabel: string;
}

interface Player {
  rank: number;
  name: string;
  score: number;
  badge: React.ElementType;
  badgeColor: string;
}

const games: Game[] = [
  {
    id: "quiz",
    icon: Brain,
    title: "Word Quiz",
    tagline: "Çoktan Seçmeli Kelime Testi",
    description:
      "4 seçenekten doğru çeviriyi seç, süreye karşı yarış. Kendi kelime listeni veya hazır listeyi kullanarak kelime dağarcığını test et.",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-50 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    href: "/game/quiz",
    features: ["Kişisel Liste", "Oxford 3000", "Zamana Karşı", "Anlık Puan", "Hata Analizi", "Sınırsız Soru", "Zorluk Seçimi"],
    previewLabel: "Quiz'e Başla",
  },
  {
    id: "flashcard",
    icon: FlipHorizontal,
    title: "Flashcards",
    tagline: "Aralıklı Tekrar Kartları",
    description:
      "Kartları çevir, kelimeyi ve anlamını pekiştir. Spaced-repetition yöntemiyle en çok zorlandığın kelimeleri öncelikli olarak çalış.",
    gradient: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-50 dark:bg-sky-900/30",
    iconColor: "text-sky-600 dark:text-sky-400",
    href: "/game/flashcard",
    features: ["Aralıklı Tekrar", "Favorilerim", "Görsel Hafıza", "Sesli Okuma", "İlerleme Takibi", "Özel Desteler"],
    previewLabel: "Yakında Geliyor",
  },
  {
    id: "match",
    icon: Shuffle,
    title: "Match Game",
    tagline: "Kelime Eşleştirme",
    description:
      "Kelimeyi ve anlamını hızla eşleştir. Yarışmacı mod ile günün liderlik tablosuna girmeye çalış ve hafızanı güçlendir.",
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-50 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    href: "/game/match",
    features: ["Hız Modu", "Liderlik Tablosu", "Anlık Sıralama", "Sürükle Bırak", "Günlük Rekabet", "Kombo", "Görsel Eşleşme"],
    previewLabel: "Yakında Geliyor",
  },
];

const topPlayers: Player[] = [
  { rank: 1, name: "Ahmet Y.", score: 4820, badge: Crown, badgeColor: "text-yellow-500" },
  { rank: 2, name: "Zeynep K.", score: 3950, badge: Medal, badgeColor: "text-slate-400" },
  { rank: 3, name: "Mert D.", score: 3410, badge: Award, badgeColor: "text-amber-700" },
  { rank: 4, name: "Selin A.", score: 2780, badge: Star, badgeColor: "text-blue-500" },
  { rank: 5, name: "Emre T.", score: 2340, badge: Star, badgeColor: "text-blue-400" },
];

const stats = [
  { label: "Aktif Oyun", icon: Gamepad2 },
  { label: "Aktif Oyuncu", icon: Users },
  { label: "Ort. Skor", icon: Target },
];

function GameCard({ game }: { game: Game }) {
  const Icon = game.icon;
  return (
    <article
      aria-label={`${game.title} oyunu`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-4 xl:p-6 flex flex-col h-full"
    >
      <div className="flex items-center max-[424px]:justify-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${game.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Icon className={`w-5 h-5 ${game.iconColor}`} aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">{game.title}</h3>
      </div>
      <div className="h-[104px] min-[365px]:h-[78px] min-[500px]:h-[52px] md:h-[78px] lg:h-[130px] min-[1168px]:h-[104px] mb-2 transition-all">
        <p className="text-sm text-center min-[425px]:text-left text-gray-600 dark:text-gray-400 leading-relaxed">
          {game.description}
        </p>
      </div>
      <div className="flex flex-wrap justify-center content-start gap-1.5 lg:gap-1 xl:gap-1.5 mt-3 mb-5 flex-1">
        {game.features.map((f) => (
          <span
            key={f}
            className="inline-flex max-[424px]:flex-auto justify-center items-center text-[10px] lg:text-[9px] xl:text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2.5 lg:px-2 xl:px-2.5 py-1 rounded-md"
          >
            {f}
          </span>
        ))}
      </div>
      <Link
        href={game.href}
        className={`w-full inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 whitespace-nowrap ${game.previewLabel === "Yakında Geliyor" ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}`}
        aria-label={`${game.title} oyna`}
      >
        {game.previewLabel} <ChevronRight className="w-4 h-4 flex-shrink-0" />
      </Link>
    </article>
  );
}

function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col items-center gap-1 shadow-sm text-center"
        >
          <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400 mb-0.5" />
          <div className="h-5 w-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse my-0.5"></div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-tight whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  );
}

function PersonalizationCard() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg">
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-100">
            Kişiselleştir
          </span>
        </div>
        <p className="text-sm font-semibold leading-relaxed text-white/90">
          Tüm oyunlarda kendi kaydettiğin kelimeleri kullanabilirsin!
        </p>
        <Link
          href="/dashboard/words"
          className="inline-flex items-center gap-1.5 mt-1 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
          aria-label="Kelime arşivine git"
        >
          Kelimelerimi Gör <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function LeaderboardCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Günün Liderleri</span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
            <div className="flex-1 h-3 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="w-8 h-3 rounded bg-slate-200 dark:bg-slate-800 shrink-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GameHubPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PAGE_TITLE = "Oyunlar | WordMashup – İngilizce Öğrenme Oyunları";
  const PAGE_DESCRIPTION =
    "WordMashup oyun merkezi: Word Quiz, Flashcards ve Match Game ile İngilizce kelime dağarcığını oyunlaştırılmış yöntemlerle güçlendir.";

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta
          name="keywords"
          content="İngilizce oyunları, kelime oyunu, flashcard, word quiz, eşleştirme oyunu, İngilizce öğren"
        />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>

      <GameLayout>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" role="main">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            <div className="lg:col-span-3 flex flex-col gap-8">
              <section aria-labelledby="games-heading">
                <div className="relative bg-slate-900 dark:bg-slate-900/50 rounded-lg p-8 sm:p-10 shadow-2xl flex flex-col gap-4 overflow-hidden border border-slate-800 dark:border-white/5 backdrop-blur-sm">
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500/20 dark:bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

                  <div className="relative z-10 flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Gamepad2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-blue-400 font-bold tracking-widest text-[10px] sm:text-xs uppercase">WordMashup Arcade</span>
                  </div>

                  <h1 id="games-heading" className="relative z-10 text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                    İngilizceyi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Oynayarak</span> Öğren
                  </h1>

                  <p className="relative z-10 text-slate-300 text-sm sm:text-base leading-relaxed mt-2 font-medium">
                    Ezberlemeyi bırak. Oyun seç, kendi listeni kullan ve kelime hazneni eğlenerek geliştir.
                  </p>
                </div>
              </section>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
                aria-expanded={sidebarOpen}
                aria-controls="sidebar-panel"
              >
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  İstatistikler &amp; Liderlik
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`}
                />
              </button>

              {sidebarOpen && (
                <div id="sidebar-panel" className="lg:hidden flex flex-col gap-4">
                  <StatsRow />
                  <PersonalizationCard />
                  <LeaderboardCard />
                </div>
              )}

              <section aria-labelledby="game-cards-heading">
                <h2 id="game-cards-heading" className="sr-only">Oyun Kartları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="seo-heading"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sm:p-8 shadow-sm"
              >
                <div className="flex flex-col gap-6 sm:gap-8">
                  <div className="text-center max-w-3xl mx-auto">
                    <h2 id="seo-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      WordMashup ile İngilizce Kelime Öğrenme Oyunları
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      Sıkıcı ezber yöntemlerini geride bırakın. WordMashup, etkileşimli oyunlar aracılığıyla kelime dağarcığınızı geliştirmenize yardımcı olan bir eğitim platformudur. Hem yeni başlayanlar hem de ileri seviye kullanıcılar için tasarlanan aktif öğrenme metotları sayesinde kelimeleri kalıcı olarak hafızanıza kazıyabilirsiniz.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Brain className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">İngilizce Quiz Testleri</h3>
                          <p>Word Quiz ile kendinizi test edin. Süreye karşı yarışarak ekrandaki kelimelerin doğru Türkçe karşılıklarını bulun ve Oxford 3000 listesiyle sınavlara daha etkili hazırlanın.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FlipHorizontal className="w-5 h-5 text-sky-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Flashcard Uygulaması</h3>
                          <p>Aralıklı tekrar (spaced repetition) sistemiyle çalışan bilgi kartları sayesinde zorlandığınız kelimeleri daha sık görerek görsel hafızanızı çalıştırın ve kalıcı olarak öğrenin.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Shuffle className="w-5 h-5 text-violet-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Kelime Eşleştirme Oyunu</h3>
                          <p>Dikkat ve hız gerektiren eşleştirme oyunu ile kelimeleri anlamlarıyla sürükleyip bırakarak eşleştirin. Bu mod sayesinde reflekslerinizi geliştirin ve hatırlama sürenizi hızlandırın.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Trophy className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Kendi Kelime Listeniz</h3>
                          <p>Sadece kendi eklediğiniz kelimelerden oluşan havuzlarla oynayarak tamamen kişiselleştirilmiş bir deneyim yaşayın. Liderlik tablosunda yükselerek motivasyonunuzu koruyun.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside
              aria-label="İstatistikler ve Liderlik"
              className="hidden lg:flex lg:col-span-1 flex-col gap-5 sticky top-24 self-start"
            >
              <StatsRow />
              <PersonalizationCard />
              <LeaderboardCard />
            </aside>
          </div>
        </main>
      </GameLayout>
    </>
  );
}
