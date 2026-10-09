export const SEO_CONFIG = {
  // Site Information
  siteUrl: "https://www.wordmashup.online",
  siteName: "WordMashup",
  locale: "tr_TR",

  // Default SEO
  title: "WordMashup | AI Destekli Kişisel İngilizce Notebook",
  description:
    "AI destekli akıllı sözlük, Oxford 3000 kelime listesi ve kişiselleştirilmiş gramer notları ile İngilizce öğreniminizi dijitalleştirin. Gelişiminizi grafiklerle takip edin ve kart sistemiyle kelimelerinizi pekiştirin.",
  keywords: [
    "İngilizce öğrenme",
    "Oxford 3000 kelime",
    "AI sözlük",
    "kelime öğrenme",
    "gramer öğrenme",
    "flashcard",
    "İngilizce notebook",
    "WordMashup"
  ],

  // OG & Social
  image: "/og-image.webp",
  imageAlt: "WordMashup - AI Destekli İngilizce Öğrenme Platformu",
  twitterHandle: "",

  // Author
  creator: "WordMashup Team",

  // Default canonical function
  getCanonical: (path: string) => `https://www.wordmashup.online${path}`,
};

export type SeoMetadata = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  ogType?: string;
};

export const OXFORD_LIST_URL = `${SEO_CONFIG.siteUrl}/oxfordlist`;

export const WORDS_PAGE_URL = `${SEO_CONFIG.siteUrl}/words`;

export const WORDS_PAGE_SEO = {
  title: "Kişisel Kelime Defteri",
  description:
    "İngilizce kelimelerinizi Türkçe karşılıkları, örnek cümleleri ve kişisel notlarıyla saklayın. Favorilerinizi ve öğrenmekte olduğunuz kelimeleri filtreleyerek kendi kelime defterinizle çalışın.",
  canonical: WORDS_PAGE_URL,
  keywords: [
    "kişisel kelime defteri",
    "İngilizce kelime öğrenme",
    "İngilizce kelime kartları",
    "örnek cümlelerle İngilizce kelime",
    "kişisel İngilizce kelime listesi",
    "WordMashup",
  ],
};

export const wordsPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${WORDS_PAGE_URL}#webpage`,
      url: WORDS_PAGE_URL,
      name: `${WORDS_PAGE_SEO.title} | WordMashup`,
      description: WORDS_PAGE_SEO.description,
      inLanguage: "tr-TR",
      isPartOf: {
        "@type": "WebSite",
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SEO_CONFIG.siteUrl },
        { "@type": "ListItem", position: 2, name: WORDS_PAGE_SEO.title, item: WORDS_PAGE_URL },
      ],
    },
  ],
};

export const OXFORD_LIST_SEO = {
  title: "Oxford 3000 Kelime Listesi",
  description:
    "Oxford 3000 en sık kullanılan İngilizce kelimeler listesi. CEFR A1–B2 seviyeleri, alfabetik tarama, öğrenme takibi ve yapay zeka destekli kelime kartları ile çalışın.",
  canonical: OXFORD_LIST_URL,
  keywords: [
    "Oxford 3000",
    "Oxford 3000 kelime listesi",
    "Oxford 3000 PDF",
    "en sık kullanılan İngilizce kelimeler",
    "CEFR A1 B2 kelime",
    "İngilizce kelime listesi",
    "kelime kartı",
    "WordMashup",
  ],
};

export const OXFORD_FAQS = [
  {
    q: "Oxford 3000 kelime listesi nedir?",
    a: "Oxford 3000, Oxford University Press’in dil verisine dayanarak seçtiği, İngilizcede en sık ve en yararlı yaklaşık 3000 kelimelik çekirdek listedir. A1’den B2’ye kadar CEFR düzeyleriyle ilişkilendirilir ve günlük konuşma ile yazılı metinlerin büyük bölümünü kapsar.",
  },
  {
    q: "Oxford 3000 ile Oxford 5000 arasındaki fark nedir?",
    a: "Oxford 3000 B2’ye kadar temel dağarcığı hedefler. Oxford 5000, B2–C1 aralığında ek anahtar kelimeler ekler. WordMashup’taki liste, günlük ve sınav İngilizcesi için öncelikli olan 3000 çekirdek kelimeye odaklanır.",
  },
  {
    q: "Bu liste sınavlar için yeterli midir?",
    a: "YDS, YÖKDİL, IELTS ve TOEFL okuma metinlerinin önemli bir kısmı bu çekirdek dağarcığa dayanır. Liste tek başına ileri akademik sözcükleri kapsamaz; ancak kelime çalışmasına sistemli bir temel sağlar.",
  },
  {
    q: "WordMashup’ta Oxford 3000 nasıl çalışılır?",
    a: "Kelimeleri A–Z harflerine göre tarayabilir, öğreniyorum / öğrendim durumunu işaretleyebilir, kişisel not ekleyebilir ve yapay zeka özeti ile örnek cümleleri kart olarak görebilirsiniz.",
  },
];

export const oxfordListJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${OXFORD_LIST_URL}#webpage`,
      url: OXFORD_LIST_URL,
      name: "Oxford 3000 Kelime Listesi | WordMashup",
      description: OXFORD_LIST_SEO.description,
      inLanguage: "tr-TR",
      isPartOf: {
        "@type": "WebSite",
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
      },
      about: {
        "@type": "Thing",
        name: "Oxford 3000",
        description:
          "Oxford University Press tarafından derlenen, İngilizcede en sık ve en yararlı yaklaşık 3000 kelimelik çekirdek liste.",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SEO_CONFIG.siteUrl },
        { "@type": "ListItem", position: 2, name: "Oxford 3000 Kelime Listesi", item: OXFORD_LIST_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: OXFORD_FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "ItemList",
      name: "Oxford 3000 CEFR seviyeleri",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "A1 başlangıç kelimeleri" },
        { "@type": "ListItem", position: 2, name: "A2 temel kullanım kelimeleri" },
        { "@type": "ListItem", position: 3, name: "B1 bağımsız kullanıcı kelimeleri" },
        { "@type": "ListItem", position: 4, name: "B2 üst-orta akademik kelimeler" },
      ],
    },
  ],
};