import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SEO_CONFIG } from "@/lib/seo.config";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Basic Meta */}
        <meta name="description" content={SEO_CONFIG.description} />
        <meta name="keywords" content={SEO_CONFIG.keywords.join(", ")} />
        <meta name="author" content={SEO_CONFIG.creator} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:site_name" content={SEO_CONFIG.siteName} />
        <meta property="og:locale" content={SEO_CONFIG.locale} />
        <meta property="og:image" content={`${SEO_CONFIG.siteUrl}${SEO_CONFIG.image}`} />

        {/* Fonts & Resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var path = window.location.pathname;
                  var allowDark = path !== '/' && path !== '/login' && path !== '/register';
                  if (allowDark) {
                    var saved = localStorage.getItem('theme');
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    var isDark = saved === 'dark' || (!saved && prefersDark);
                    if (isDark) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </Head>
      <AuthProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}