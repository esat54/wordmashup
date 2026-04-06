<div align="center">

# 📖 WordMashup

**Kişisel, yapay zekâ destekli İngilizce öğrenme notebook'unuz**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

[🌐 Canlı Demo](https://www.wordmashup.xyz) · [🐛 Hata Bildir](https://github.com/esat54/wordmashup/issues) · [💡 Özellik İste](https://github.com/esat54/wordmashup/issues)

</div>

---

## 🌟 WordMashup Nedir?

WordMashup; kelime defteri, akıllı sözlük, gramer rehberi ve kelime testi özelliklerini tek çatı altında sunan, yapay zekâ destekli bir **İngilizce öğrenme platformudur**.

Kendi cümlelerinizle öğrenin, flashcard sistemiyle pekiştirin, Oxford'un 3000 kelimelik listesini takip edin ve ilerlemenizi istatistiklerle izleyin.

---

## ✨ Özellikler

### 📝 Kişisel Kelime Defteri
- Kelimelerinizi **anlam, örnek cümle ve çevirisiyle** birlikte kaydedin
- Tüm kelimelerinizi tek listede görüntüleyin; **türe, favoriye veya öğrenme durumuna** göre filtreleyin
- Kelimelerinizi **favori** olarak işaretleyin

### 🃏 Flashcard Sistemi
- Kaydettiğiniz kelimeleri **kart çevirme** yöntemiyle tekrar edin
- Günlük tekrar alışkanlığı edinerek **streak (seri)** oluşturun
- Bildiğiniz ve bilmediğiniz kelimeleri ayrıştırarak öğrenmeyi hızlandırın

### 📚 Gramer Rehberi
- Kendi **gramer yapılarınızı** ekleyin: formül, kural, notlar ve İngilizce/Türkçe örneklerle
- Platform tarafından sunulan **hazır gramer içeriklerini** inceleyin
- Önemli yapıları **sabitleyin** ve dilediğiniz zaman hızlıca erişin

### 🤖 Yapay Zekâ Destekli Sözlük
- Bir kelime girin, Yapay zekâ sizin için **3 farklı açıklama ve örnek cümle** üretsin
- Anlamları derinlemesine kavramanıza yardımcı olacak bağlamsal açıklamalar
- Sözlük sonuçlarını doğrudan kelime defterinize ekleyebilme imkânı

### 🎓 Oxford 3000 Kelime Listesi
- Oxford'un belirlediği **3000 temel İngilizce kelimeyi** takip edin
- Her kelimeyi **öğrenildi / öğreniliyor / öğrenilmedi** olarak işaretleyin
- Her kelime için **kişisel not** ekleyin
- Kelimeleri **seviye (A1–C1)** ve **kategori** bazında filtreleyin

### 🎮 Kelime Quizi
- **Seviye** (Basic / Intermediate / Advanced) ve **kategoriye** (Teknoloji, İş, Spor vb.) göre quiz oluşturun
- Kişisel kelime listenizden **özelleştirilmiş sınav** alın
- Doğru/yanlış cevaplarınızı renkli geri bildirimlerle görüntüleyin

### 📊 İstatistikler & İlerleme Takibi
- Günlük çalışma serinizi (streak) takip edin
- Kaç kelime öğrendiğinizi, kaç quiz çözdüğünüzü **grafiklerle** görüntüleyin
- Oxford listesindeki ilerlemenizi yüzde olarak izleyin

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Stil** | Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Veritabanı** | MongoDB, Mongoose |
| **Yapay Zekâ** | Google Gemini API (`@google/generative-ai`) |
| **Auth** | JWT (JSON Web Token), bcrypt |
| **Grafikler** | Recharts |
| **İkonlar** | Lucide React |
| **Güvenlik** | Helmet, express-rate-limit, CORS |

---

## 📁 Proje Yapısı

```
wordmashup/
├── frontend/                   # Next.js uygulaması
│   └── src/
│       ├── pages/
│       │   ├── index.tsx       # Ana sayfa (Landing)
│       │   ├── login.tsx       # Giriş sayfası
│       │   ├── register.tsx    # Kayıt sayfası
│       │   ├── quiz/           # Kelime quiz sayfası
│       │   └── dashboard/      # Uygulama paneli
│       │       ├── index.tsx   # Genel bakış & İstatistikler
│       │       ├── kelimeler.tsx    # Kelime defteri
│       │       ├── gramer/          # Gramer rehberi
│       │       ├── sozluk.tsx       # AI Sözlük
│       │       ├── oxfordliste.tsx  # Oxford 3000 listesi
│       │       └── ayarlar.tsx      # Kullanıcı ayarları
│       └── components/
│           ├── dashboard/
│           │   ├── Words/           # Kelime bileşenleri
│           │   ├── Grammars/        # Gramer bileşenleri
│           │   ├── DashboardHero.tsx
│           │   ├── DictionaryPage.tsx
│           │   ├── OxfordListPage.tsx
│           │   └── SettingsPage.tsx
│           └── WordQuiz/            # Quiz bileşenleri
│
└── backend/                    # Express.js API
    ├── server.js               # Sunucu giriş noktası
    ├── config/
    │   └── db.js               # MongoDB bağlantısı
    ├── models/
    │   ├── authModel.js        # Kullanıcı modeli (streak dahil)
    │   ├── wordModel.js        # Kelime modeli
    │   ├── grammarModel.js     # Gramer modeli
    │   ├── OxfordWord.js       # Oxford kelime modeli
    │   ├── OxfordUserProgress.js  # Oxford ilerleme takibi
    │   ├── wordQuizModel.js    # Quiz kelime modeli
    │   └── SavedQuizWord.js    # Kaydedilen quiz kelimeleri
    ├── routes/
    │   ├── authRoutes.js
    │   ├── wordRoutes.js
    │   ├── dictionaryRoutes.js
    │   ├── grammarRoutes.js
    │   ├── oxfordRoutes.js
    │   └── quizRoutes.js
    ├── controllers/            # İş mantığı
    └── middleware/             # Auth middleware
```

---

## 🚀 Kurulum

### Gereksinimler

Aşağıdakilerin bilgisayarınızda yüklü olduğundan emin olun:

- [Node.js](https://nodejs.org/) v18 veya üzeri
- [npm](https://www.npmjs.com/) v9 veya üzeri
- [MongoDB](https://www.mongodb.com/) (yerel kurulum veya [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) ücretsiz hesabı)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey) (yapay zekâ sözlük özelliği için)

---

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/esat54/wordmashup.git
cd wordmashup
```

---

### 2. Bağımlılıkları Kurun

Tüm bağımlılıkları (frontend + backend) tek komutla kurun:

```bash
npm install
```

---

### 3. Ortam Değişkenlerini Ayarlayın

#### Backend `.env` dosyası

`backend/` klasörünün içinde `.env` adlı bir dosya oluşturun:

```env
PORT=3001
MONGO_URI=mongodb_url_yazınız
JWT_SECRET=gizli_bir_anahtar_yazınız
GEMINI_API_KEY=your_google_gemini_api_key
```

> **Not:** `GEMINI_API_KEY` için [Google AI Studio](https://aistudio.google.com/app/apikey) adresinden ücretsiz API anahtarı alabilirsiniz.

#### Frontend `.env.local` dosyası

`frontend/` klasörünün içinde `.env.local` adlı bir dosya oluşturun:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 4. Uygulamayı Başlatın

#### Her iki uygulamayı aynı anda başlatın (kök dizinden):

```bash
npm run dev
```

#### Ya da ayrı ayrı başlatın:

```bash
# Sadece backend (http://localhost:3001)
npm run dev:backend

# Sadece frontend (http://localhost:3000)
npm run dev:frontend
```

Uygulama açıldıktan sonra tarayıcınızda **http://localhost:3000** adresini açın. 🎉

---

## 🔌 API Rotaları

| Yöntem | Rota | Açıklama |
|--------|------|----------|
| `POST` | `/api/auth/register` | Yeni kullanıcı kaydı |
| `POST` | `/api/auth/login` | Kullanıcı girişi |
| `GET/POST/DELETE` | `/api/words` | Kelime CRUD işlemleri |
| `GET/POST` | `/api/grammar` | Gramer CRUD işlemleri |
| `POST` | `/api/dictionary` | AI sözlük (Gemini) |
| `GET` | `/api/oxford` | Oxford kelime listesi |
| `GET/POST` | `/api/quiz` | Quiz işlemleri |
| `GET` | `/api/health` | Sunucu sağlık kontrolü |

---

## 📜 Kullanılabilir Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Frontend + Backend'i birlikte başlatır |
| `npm run dev:backend` | Yalnızca backend'i başlatır |
| `npm run dev:frontend` | Yalnızca frontend'i başlatır |
| `npm run build` | Production build alır |
| `npm run clean` | Tüm `node_modules` ve build çıktılarını temizler |

---

## 🤝 Katkı Sağlama

Katkılarınızı memnuniyetle karşılıyoruz! Şu adımları izleyin:

1. Bu depoyu **fork** edin
2. Yeni bir **branch** oluşturun: `git checkout -b ozellik/yeni-ozellik`
3. Değişikliklerinizi **commit** edin: `git commit -m 'feat: yeni özellik eklendi'`
4. Branch'inizi **push** edin: `git push origin ozellik/yeni-ozellik`
5. Bir **Pull Request** açın

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.


---



</div>