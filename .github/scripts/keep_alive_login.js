const { chromium } = require('playwright');

const LOGIN_URL = 'https://www.wordmashup.xyz/login';
const EMAIL = process.env.KEEPALIVE_EMAIL;
const PASSWORD = process.env.KEEPALIVE_PASSWORD;

if (!EMAIL || !PASSWORD) {
    console.error('KEEPALIVE_EMAIL veya KEEPALIVE_PASSWORD environment değişkeni eksik!');
    process.exit(1);
}

(async () => {
    let browser;
    try {
        console.log('Tarayıcı başlatılıyor...');
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent:
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        });
        const page = await context.newPage();

        console.log(`${LOGIN_URL} adresine gidiliyor...`);
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });

        await page.fill('input[type="email"]', EMAIL);
        console.log('E-posta girildi.');

        await page.fill('input[type="password"]', PASSWORD);
        console.log('Şifre girildi.');

        await page.click('button[type="submit"]');
        console.log('Giriş yap butonuna tıklandı.');

        await page.waitForLoadState('networkidle', { timeout: 15000 });

        const currentUrl = page.url();
        console.log(`İşlem tamamlandı. Mevcut URL: ${currentUrl}`);

        if (currentUrl.includes('/login')) {
            console.error('Kimlik bilgilerini kontrol edin.');
            process.exit(1);
        }

        console.log('Keep-alive başarılı!');
    } catch (err) {
        console.error('Hata oluştu:', err.message);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
})();
