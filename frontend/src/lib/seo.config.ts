export const SEO_CONFIG = {
  // Site Information
  siteUrl: "https://www.wordmashup.xyz",
  siteName: "WordMashup",
  locale: "tr_TR",
  
  // Default SEO
  title: "WordMashup | AI Destekli Kişisel İngilizce Notebook & Sözlük",
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
  getCanonical: (path: string) => `https://www.wordmashup.xyz${path}`,
};

export type SeoMetadata = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  ogType?: string;
};