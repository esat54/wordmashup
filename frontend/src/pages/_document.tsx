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
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
