import Head from "next/head";
import { useRouter } from "next/router";
import { SEO_CONFIG, SeoMetadata } from "@/lib/seo.config";

interface SeoHeadProps extends SeoMetadata {
  children?: React.ReactNode;
}

export function SeoHead({
  title,
  description,
  image,
  canonical,
  noindex = false,
  ogType = "website",
}: SeoHeadProps) {
  const router = useRouter();

  const pageTitle = title
    ? `${title} | WordMashup`
    : SEO_CONFIG.title;

  const pageDescription = description || SEO_CONFIG.description;
  const pageImage = image
    ? `${SEO_CONFIG.siteUrl}${image}`
    : `${SEO_CONFIG.siteUrl}${SEO_CONFIG.image}`;
  const pageCanonical = canonical || SEO_CONFIG.getCanonical(router.asPath);

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={SEO_CONFIG.keywords.join(", ")} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageCanonical} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Canonical */}
      <link rel="canonical" href={pageCanonical} />
    </Head>
  );
}

export default SeoHead;