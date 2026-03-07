/**
 * Keep Alive Login Script
 * Render free tier'ın uyku moduna geçmesini engellemek için
 * her 10 dakikada bir WordMashup'a giriş yapar.
 *
 * Gerekli GitHub Secrets:
 *   KEEPALIVE_EMAIL    → Giriş e-postası
 *   KEEPALIVE_PASSWORD → Giriş şifresi
 *
 * NOT: Render Free Tier soğuk başlangıçta ~30 saniye bekletebilir.
 *      Tüm timeout'lar buna göre 60-90 saniyeye ayarlanmıştır.
 */

const { chromium } = require('playwright');

const LOGIN_URL = 'https://www.wordmashup.xyz/login';
const EMAIL = process.env.KEEPALIVE_EMAIL;
const PASSWORD = process.env.KEEPALIVE_PASSWORD;

if (!EMAIL || !PASSWORD) {
    console.error('❌ KEEPALIVE_EMAIL veya KEEPALIVE_PASSWORD environment değişkeni eksik!');
    process.exit(1);
}

(async () => {
    let browser;
    try {
        console.log('🚀 Tarayıcı başlatılıyor...');
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent:
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        });
        const page = await context.newPage();

        // Render soğuk başlangıç için 90 saniye timeout
        console.log(`📄 ${LOGIN_URL} adresine gidiliyor...`);
        await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });

        // Form elemanlarının yüklenmesini bekle
        await page.waitForSelector('#email', { timeout: 60000 });

        // E-posta alanını doldur (selector: #email)
        await page.fill('#email', EMAIL);
        console.log('✉️  E-posta girildi.');

        // Şifre alanını doldur (selector: #password)
        await page.fill('#password', PASSWORD);
        console.log('🔑 Şifre girildi.');

        // Giriş yap butonuna tıkla
        await page.click('button[type="submit"]');
        console.log('🖱️  Giriş yap butonuna tıklandı.');

        // Render backend uyanana kadar bekle — URL /dashboard'a geçene kadar 90sn izin ver
        console.log('⏳ Backend yanıtı bekleniyor (Render soğuk başlangıç ~30sn sürebilir)...');
        await page.waitForURL('**/dashboard**', { timeout: 90000 });

        const currentUrl = page.url();
        console.log(`✅ İşlem tamamlandı. Mevcut URL: ${currentUrl}`);
        console.log('🎉 Keep-alive başarılı! Render uyku moduna geçmeyecek.');
    } catch (err) {
        console.error('❌ Hata oluştu:', err.message);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
})();
