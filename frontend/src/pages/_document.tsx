import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var hasToken = !!localStorage.getItem('token');
                  var path = window.location.pathname;
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved === 'dark' || (!saved && prefersDark);
                  
                  if (!saved && path.startsWith('/game') && !hasToken) {
                    isDark = false;
                  }
                  
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }

                  if (hasToken) {
                    document.documentElement.classList.add('is-logged-in');
                  } else {
                    document.documentElement.classList.add('not-logged-in');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
