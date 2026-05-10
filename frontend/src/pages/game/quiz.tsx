import Head from "next/head";
import SeoHead from "@/components/SeoHead";
import QuizHeader from "@/components/game/quiz/QuizHeader";
import GameLayout from "@/components/game/GameLayout";

export default function QuizPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "İngilizce Kelime Quiz | WordMashup",
    description:
      "İngilizce kelime bilginizi test edin. İster kategorilere ayrılmış genel quizler, isterseniz kişisel kelime listenizden oluşturulan quizlerle, doğru-yanlış istatistiklerinizi takip edin.",
    url: "https://www.wordmashup.xyz/game/quiz",
    isPartOf: {
      "@type": "WebSite",
      name: "WordMashup",
      url: "https://www.wordmashup.xyz",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ana Sayfa",
          item: "https://www.wordmashup.xyz",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Oyunlar",
          item: "https://www.wordmashup.xyz/game",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Kelime Quiz",
          item: "https://www.wordmashup.xyz/game/quiz",
        },
      ],
    },
  };

  return (
    <>
      <SeoHead
        title="İngilizce Kelime Quiz"
        description="İngilizce kelime bilginizi test edin. İster kategorilere ayrılmış genel quizler, isterseniz kişisel kelime listenizden oluşturulan quizlerle, doğru-yanlış istatistiklerinizi takip edin ve öğrenme sürecinizi hızlandırın."
        canonical="https://www.wordmashup.xyz/game/quiz"
        ogType="website"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <GameLayout>
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-gray-900 py-6 font-sans antialiased text-slate-900 dark:text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <QuizHeader />
          </div>
        </div>
      </GameLayout>
    </>
  );
}
