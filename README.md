# 🦁 Galatasaray SK Fan Sitesi

Galatasaray Spor Kulübü temalı, dinamik ve modern bir fan web sitesi.

## 🎯 Özellikler

- **Dinamik İçerik:** Haberler MySQL veritabanından, kadro & fikstür SofaScore API'sinden gerçek zamanlı çekilir
- **Kullanıcı Sistemi:** Kayıt ol, giriş yap, profil görüntüle (bcrypt şifreleme)
- **Canlı Kadro:** Tüm Galatasaray oyuncuları infinite scroll marquee ile gösterilir
- **Güncel Fikstür:** 2025-2026 sezonu maç sonuçları ve yaklaşan maçlar
- **Tema Değiştirici:** 4 farklı renk teması (Orijinal, Gece Mavisi, Okyanus, Orman)
- **Responsive Tasarım:** Mobil ve masaüstü uyumlu (Bootstrap 5)

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Veritabanı | MySQL |
| API | SofaScore Public API |
| Güvenlik | bcrypt, express-session |

## 🚀 Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle (DB bilgilerini gir)

# 3. Veritabanını oluştur
mysql -u root -p < database.sql

# 4. Sunucuyu başlat
node server.js
```

Site: `http://localhost:3000` adresinde çalışır.

## 📁 Dosya Yapısı

```
galatasaray-site/
├── server.js          # Express sunucu & API endpoint'leri
├── db.js              # MySQL bağlantı havuzu
├── database.sql       # Veritabanı şeması & örnek veriler
├── package.json       # Node.js bağımlılıkları
├── .env               # Ortam değişkenleri (gizli)
└── public/            # Statik dosyalar
    ├── index.html     # Ana sayfa
    ├── haberler.html  # Haberler sayfası
    ├── hakkimizda.html# Hakkımızda sayfası
    ├── iletisim.html  # İletişim sayfası
    ├── kayit.html     # Kayıt formu
    ├── giris.html     # Giriş formu
    ├── dashboard.html # Kullanıcı profili
    ├── css/style.css  # Tüm stiller
    └── js/
        ├── main.js    # Ortak fonksiyonlar (auth, tema)
        ├── kayit.js   # Kayıt form doğrulama
        └── giris.js   # Giriş form işlemleri
```
