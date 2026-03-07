
import Head from "next/head";
import SeoHead from "@/components/SeoHead";
import QuizHeader from "@/components/WordQuiz/QuizHeader";

export default function QuizPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "İngilizce Kelime Quiz | WordMashup",
        description:
            "İngilizce kelime bilginizi test edin. İster kategorilere ayrılmış genel quizler, isterseniz kişisel kelime listenizden oluşturulan quizlerle, doğru-yanlış istatistiklerinizi takip edin.",
        url: "https://www.wordmashup.xyz/quiz",
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
                    name: "Kelime Quiz",
                    item: "https://www.wordmashup.xyz/quiz",
                },
            ],
        },
    };

    return (
        <>
            <SeoHead
                title="İngilizce Kelime Quiz"
                description="İngilizce kelime bilginizi test edin. İster kategorilere ayrılmış genel quizler, isterseniz kişisel kelime listenizden oluşturulan quizlerle, doğru-yanlış istatistiklerinizi takip edin ve öğrenme sürecinizi hızlandırın."
                canonical="https://www.wordmashup.xyz/quiz"
                ogType="website"
            />
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-6 px-4 font-sans antialiased text-slate-900 dark:text-white">
                <div className="max-w-5xl mx-auto">
                    <QuizHeader />
                </div>
            </div>
        </>
    );
}
