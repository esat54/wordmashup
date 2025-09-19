# wordmashup


WordMashup Kullanım Kılavuzu ve Önemli Uyarılar

🚫 UYARI: Bu proje sadece canlı ortamda çalıştırılmak üzere tasarlanmıştır. Localde çalıştırmak isteyenler, veritabanı bağlantısı, session secret ve diğer gizli bilgiler olmadan uygulamayı başlatamaz. Projeyi izinsiz çoğaltmak veya yayınlamak yasaktır.

Gereksinimler

Bu proje çalıştırmak için aşağıdaki araçlara ihtiyaç vardır:

Node.js sürüm 18 veya üstü

npm (Node package manager) veya yarn

PostgreSQL veritabanı

Git (proje klonlamak için)

Localde denemek isteyen kullanıcılar için veritabanı bağlantısı ve environment değişkenleri doğru şekilde ayarlanmalıdır. Aksi halde uygulama çalışmaz.

Kurulum Adımları

Projeyi GitHub’dan klonlayın:

git clone https://github.com/esat54/wordmashup.git
cd wordmashup


Gerekli bağımlılıkları yükleyin:

npm install


Bu komut, proje içinde tanımlı olan tüm npm paketlerini yükler.

Environment dosyasını oluşturun:
Proje kök dizininde .env adında bir dosya oluşturun ve içine aşağıdaki bilgileri girin:

DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/wordmashup_db"
SESSION_SECRET="gizli_anahtar"


<DB_USER> ve <DB_PASSWORD> yerlerini kendi PostgreSQL kullanıcı bilgilerinizle değiştirin.

SESSION_SECRET güvenlik amaçlı kullanılır, uzun ve tahmin edilemez bir değer seçin.

Prisma ile veritabanını başlatın ve migrate işlemlerini uygulayın:

npx prisma migrate dev --name init


Bu işlem, proje için gerekli tabloları ve yapılandırmaları veritabanına uygular.

Uygulamayı başlatın:

npm run dev


Localde uygulama çalışmaya başlayacaktır.

Tarayıcıdan http://localhost:3000 adresine giderek uygulamayı görüntüleyebilirsiniz.

Önemli Dosya ve Klasörler

src/app.js → Uygulamanın ana giriş noktası

src/routes/ → Tüm route tanımları

src/controllers/ → İş mantığı ve controller fonksiyonları

src/models/ → Veri modelleri ve veritabanı sorguları

public/ → Statik dosyalar (CSS, JS, resimler)

prisma/schema.prisma → Veritabanı şeması

.env → Gizli ayarlar ve environment değişkenleri 

Güvenlik ve Önemli Notlar

.env dosyasını asla GitHub’a yüklemeyin.

Localde çalıştıran kişiler veritabanı ve session ayarlarını doğru yapmazsa uygulama hata verir.

Canlı ortamda uygulama https://www.wordmashup.xyz
 adresinde güvenli bir şekilde çalışmaktadır.

Projeyi izinsiz çoğaltmak veya yayınlamak yasaktır.


Ekstra Notlar

Render üzerinde canlıya alınmış uygulamada sertifikalar ve HTTPS ayarları otomatik olarak sağlanmıştır.

Localde HTTPS kullanmak isterseniz, ek sertifika kurulumu ve reverse proxy ayarları yapmanız gerekir.

Veritabanı migrate işlemleri sırasında hata alırsanız, PostgreSQL’in çalıştığından ve DATABASE_URL bilgilerini doğru girdiğinizden emin olun.

Tüm log ve debug dosyaları .gitignore ile projeye dahil edilmemelidir.