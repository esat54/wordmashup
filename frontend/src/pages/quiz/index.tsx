
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

                    <section
                        className="mt-16 border-t border-slate-200 dark:border-gray-700 pt-10 pb-6 animate-[fadeInSeo_0.5s_ease-out_1s_both]"
                    >
                        <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100 mb-4">
                            İngilizce Kelime Quiz ile Öğreniminizi Test Edin
                        </h2>
                        <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                            <p>
                                WordMashup Kelime Quiz modülü, İngilizce kelime bilginizi interaktif testlerle pekiştirmenizi sağlar.
                                Kategorilere ayrılmış genel kelime listelerine dayalı quizler ile en sık kullanılan
                                kelimeleri öğrenirken, kişisel kelime listenizden oluşturulan quizlerle
                                kendi öğrenme hedefinize odaklanabilirsiniz.
                            </p>
                            <p>
                                Her quiz sorusunda İngilizce bir kelime görüntülenir ve doğru Türkçe karşılığını
                                seçmeniz istenir. Doğru ve yanlış cevaplarınız anlık olarak takip edilir;
                                quiz sonunda detaylı istatistiklerinizi görebilirsiniz. Bu sistem, <strong>spaced repetition</strong> (aralıklı tekrar)
                                mantığıyla sürekli pratik yapmanızı kolaylaştırır.
                            </p>
                            <p>
                                Kendi kelime listenizle quiz oluşturabilmek için ücretsiz bir hesap oluşturmanız yeterlidir.
                                Hesabınızla eklediğiniz kelimeleri quizlere dahil edebilir, öğrenme sürecinizi
                                kişiselleştirebilirsiniz. Genel quiz listesi ise giriş yapmadan herkes tarafından kullanılabilir.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
