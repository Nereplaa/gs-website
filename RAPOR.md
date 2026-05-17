# WEB TEKNOLOJİLERİ DERSİ — PROJE RAPORU

**Proje Adı:** Galatasaray Spor Kulübü Fan Web Sitesi  
**Öğrenci:** Alperen Yağmur  
**Kurum:** Kocaeli Sağlık ve Teknoloji Üniversitesi  
**Ders:** Web Teknolojileri  
**Tarih:** 17 Mayıs 2026  

---

## 1. PROJENİN AMACI

Bu proje, derste öğrenilen HTML, CSS, JavaScript ve veritabanı teknolojileri kullanılarak **Galatasaray Spor Kulübü** temalı dinamik bir web sitesi geliştirmeyi amaçlamaktadır. Site; kullanıcı kayıt/giriş sistemi, gerçek zamanlı kadro ve fikstür verileri, haberler, tema değiştirme ve responsive tasarım gibi modern web geliştirme özelliklerini barındırmaktadır.

---

## 2. KULLANILAN TEKNOLOJİLER VE KÜTÜPHANELER

### 2.1 Frontend (İstemci Tarafı)

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **HTML5** | - | Sayfa yapısı ve semantik etiketler (`<nav>`, `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`, `<aside>`, `<figure>`, `<figcaption>`, `<form>`, `<input>`, `<select>`, `<table>`, `<iframe>`, `<button>` vb.) |
| **CSS3** | - | Özel tasarım, CSS değişkenleri (`--gs-red`, `--gs-yellow`), gradientler, animasyonlar (`@keyframes`), mask-image, responsive layout |
| **JavaScript (ES6+)** | - | DOM manipülasyonu, Fetch API ile asenkron veri çekme, oturum yönetimi, form doğrulama, tema değiştirici |
| **Bootstrap 5.3** | CDN | Responsive grid sistemi, navbar, formlar, tablo düzeni |
| **Font Awesome 6.4** | CDN | İkon kütüphanesi (sosyal medya, navigasyon, form ikonları) |

### 2.2 Backend (Sunucu Tarafı)

| Kütüphane | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **Node.js** | v24.x | JavaScript çalıştırma ortamı |
| **Express.js** | 4.19.2 | HTTP sunucu framework'ü, routing, middleware yönetimi |
| **mysql2** | 3.9.7 | MySQL veritabanına bağlantı (promise tabanlı, connection pooling) |
| **bcrypt** | 5.1.1 | Kullanıcı şifrelerinin güvenli hash'lenmesi (salt round: 10) |
| **express-session** | 1.18.0 | Sunucu taraflı oturum yönetimi (cookie tabanlı) |
| **dotenv** | 16.4.5 | `.env` dosyasından ortam değişkenlerini okuma |

### 2.3 Veritabanı

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| **MySQL** | Kullanıcı kayıtları ve haber verilerinin kalıcı depolanması |

### 2.4 Harici API

| API | Kullanım Amacı |
|-----|----------------|
| **SofaScore Public API** | Galatasaray'ın güncel kadro bilgileri ve 2025-2026 sezonu fikstür/maç sonuçları |

---

## 3. SİSTEM MİMARİSİ

Proje klasik bir **istemci-sunucu (client-server)** mimarisine sahiptir:

- **İstemci:** Tarayıcıda çalışan HTML5, CSS3 ve JavaScript kodları. 7 adet sayfa mevcuttur.
- **Sunucu:** Node.js + Express.js ile yazılmış RESTful API. HTTP istekleri karşılar.
- **Veritabanı:** MySQL sunucusu — kullanıcı bilgileri ve haberler burada saklanır.
- **Harici API:** SofaScore — güncel kadro ve fikstür verileri gerçek zamanlı olarak çekilir.

### API Endpoint'leri

| Endpoint | Metot | Açıklama |
|----------|-------|----------|
| `/api/register` | POST | Kullanıcı kaydı (bcrypt hash) |
| `/api/login` | POST | Kullanıcı girişi (oturum başlatma) |
| `/api/logout` | POST | Oturum sonlandırma |
| `/api/me` | GET | Oturum kontrolü |
| `/api/haberler` | GET | Haber listesi (MySQL) |
| `/api/dashboard` | GET | Profil bilgileri |
| `/api/kadro` | GET | Oyuncu kadrosu (SofaScore) |
| `/api/fikstur` | GET | Maç sonuçları (SofaScore) |

---

## 4. VERİTABANI ŞEMASI

### 4.1 `users` Tablosu — Kullanıcı Kayıtları

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| `id` | INT (PK, AI) | Benzersiz kullanıcı kimliği |
| `ad` | VARCHAR(50) | Kullanıcı adı |
| `soyad` | VARCHAR(50) | Kullanıcı soyadı |
| `cinsiyet` | ENUM('Erkek','Kadin') | Cinsiyet (Radio Button) |
| `dogum_yeri` | VARCHAR(100) | Doğum yeri (Text Field) |
| `dogum_tarihi` | DATE | Doğum tarihi (Date Picker) |
| `meslek` | ENUM(9 seçenek) | Meslek (Select/List: Doktor, Mühendis, Hemşire, Öğretmen, Asker, Hakim, Çiftçi, Esnaf, Diğer) |
| `email` | VARCHAR(100) UNIQUE | E-posta (Text Field) |
| `sifre` | VARCHAR(255) | bcrypt ile hash'lenmiş şifre |
| `kayit_tarihi` | TIMESTAMP | Otomatik kayıt zamanı |

### 4.2 `haberler` Tablosu — Haber İçerikleri

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| `id` | INT (PK, AI) | Haber kimliği |
| `baslik` | VARCHAR(200) | Haber başlığı |
| `icerik` | TEXT | Haber içeriği |
| `kategori` | VARCHAR(50) | Kategori (Maç Sonucu, Avrupa, Kulüp, vb.) |
| `tarih` | TIMESTAMP | Yayın tarihi |

---

## 5. API ENTEGRASYONU — SOFASCORE

### 5.1 Neden SofaScore?

Projede başlangıçta **API-Football (api-sports.io)** kullanılmak istenmiş, ancak ücretsiz plan aşağıdaki kısıtlamalara sahipti:

- Yalnızca 2022-2024 sezon verileri erişilebilir (2025-2026 sezon verisi yok)
- `last` ve `next` parametreleri ücretsiz planda kullanılamaz

Bu nedenle **SofaScore Public API**'ye geçilmiştir. Bu API:

- ✅ 2025-2026 sezonu güncel verilerini sağlar
- ✅ API anahtarı gerektirmez
- ✅ Gerçek zamanlı maç sonuçları ve kadro bilgisi sunar

### 5.2 Kullanılan Endpoint'ler

| Endpoint | Açıklama | Önbellek |
|----------|----------|----------|
| `GET /api/v1/team/3061/players` | Galatasaray güncel kadrosu (30 oyuncu) | 6 saat |
| `GET /api/v1/team/3061/events/last/0` | Son oynanan maçlar (skor dahil) | 6 saat |
| `GET /api/v1/team/3061/events/next/0` | Yaklaşan maçlar | 6 saat |

### 5.3 Önbellek (Cache) Mekanizması

API çağrılarını minimize etmek için sunucu tarafında 6 saatlik in-memory cache kullanılmaktadır. Aynı endpoint'e tekrar istek geldiğinde, önbellek süresi dolmamışsa veritabanından değil bellekten yanıt döner. Bu sayede gereksiz API çağrıları önlenir.

---

## 6. SAYFA YAPISI VE KULLANILAN HTML ETİKETLERİ

### 6.1 Sayfalar

| Sayfa | Dosya | İçerik |
|-------|-------|--------|
| Ana Sayfa | `index.html` | Hero, istatistikler, haberler, fikstür, kadro marquee, video, CTA |
| Haberler | `haberler.html` | Tüm haberler grid görünümünde |
| Hakkımızda | `hakkimizda.html` | Tarihçe, kupalar, zaman çizelgesi |
| İletişim | `iletisim.html` | İletişim formu ve bilgileri |
| Kayıt Ol | `kayit.html` | 8 alanlı kullanıcı kayıt formu |
| Giriş Yap | `giris.html` | E-posta ve şifre ile giriş |
| Profil | `dashboard.html` | Kullanıcı bilgileri (giriş gerektirir) |

### 6.2 Kullanılan HTML Etiketleri (20+)

| # | Etiket | Kullanım Yeri |
|---|--------|--------------|
| 1 | `<nav>` | Tüm sayfalarda navigasyon çubuğu |
| 2 | `<header>` | Ana sayfa hero bölümü |
| 3 | `<main>` | Ana içerik alanı |
| 4 | `<footer>` | Alt bilgi ve sosyal medya linkleri |
| 5 | `<section>` | İçerik bölümleri (haberler, fikstür, kadro, video) |
| 6 | `<article>` | Haber kartları |
| 7 | `<aside>` | Üyelik çağrısı (CTA) bölümü |
| 8 | `<figure>` / `<figcaption>` | Oyuncu kartları |
| 9 | `<form>` | Kayıt ve giriş formları |
| 10 | `<input>` (text, email, password, radio, date) | Form alanları |
| 11 | `<select>` / `<option>` | Meslek seçimi |
| 12 | `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<td>` | Fikstür tablosu |
| 13 | `<iframe>` | YouTube video embed |
| 14 | `<button>` | Form gönderme, tema değiştirme |
| 15 | `<ul>` / `<li>` | Footer linkleri |
| 16 | `<a>` | Navigasyon ve sosyal medya bağlantıları |
| 17 | `<span>` | Badge'ler ve istatistik sayıları |
| 18 | `<img>` | Oyuncu fotoğrafları (API'den dinamik) |
| 19 | `<label>` | Form etiketleri |
| 20 | `<div>` | Genel konteyner |

---

## 7. ÖNE ÇIKAN ÖZELLİKLER

### 7.1 Oturum Yönetimi ve Koşullu Arayüz

Kullanıcı giriş yaptığında:
- Navbar'daki "Giriş Yap / Kayıt Ol" butonları gizlenir
- Yerine kullanıcı adı, "Profilim" ve "Çıkış" butonları gösterilir
- Ana sayfadaki "Üye Ol" ve alt kısımdaki "Ücretsiz Kayıt Ol / Giriş Yap" butonları gizlenir

### 7.2 Kadro Marquee (Sonsuz Kaydırma)

Oyuncular yatay olarak otomatik kayan bir şerit halinde gösterilir. CSS `@keyframes marqueeScroll` animasyonu ile sürekli sola kayar, kartlar iki kez kopyalanarak kesintisiz döngü sağlanır. Fare üzerine gelindiğinde animasyon durur, kenarlar mask-image ile fade-out efektine sahiptir.

### 7.3 Tema Değiştirici

4 farklı tema renk paleti sunulur: Galatasaray Orijinal, Gece Mavisi, Okyanus ve Orman. Seçim localStorage'a kaydedilir ve sayfa yenilendiğinde korunur.

### 7.4 Form Doğrulama

Kayıt formunda hem istemci tarafı hem sunucu tarafı doğrulama yapılır: boş alan kontrolü, e-posta formatı kontrolü (regex), şifre minimum uzunluk (6 karakter), şifre eşleşme kontrolü ve duplicate e-posta kontrolü (MySQL UNIQUE constraint).

---

## 8. GÜVENLİK ÖNLEMLERİ

| Önlem | Uygulama |
|-------|----------|
| **Şifre Hashleme** | bcrypt (salt rounds: 10) — düz metin şifre asla saklanmaz |
| **Oturum Güvenliği** | express-session, HttpOnly cookie, 24 saat süre sınırı |
| **SQL Injection Koruması** | mysql2 parameterized queries (prepared statements) |
| **Ortam Değişkenleri** | Hassas bilgiler (DB şifresi, session secret) `.env` dosyasında |

---

## 9. GELİŞTİRME SÜRECİ VE YAŞANAN ZORLUKLAR

### 9.1 API Seçimi Süreci

Projede en büyük zorluk doğru futbol API'sini bulmak olmuştur:

1. İlk olarak RapidAPI üzerindeki API-Football denenmiş, ancak hizmet yapısı değiştiği için bağlantı kurulamadı.
2. Doğrudan api-sports.io üzerinden kayıt yapılarak API-Football kullanıldı, fakat ücretsiz plan sadece 2022-2024 verilerini destekliyordu.
3. Son olarak SofaScore Public API'ye geçildi ve güncel 2025-2026 sezonu verileri başarıyla çekildi.

### 9.2 Galatasaray Takım ID Karışıklığı

API-Football'da Galatasaray'ın ID'si başlangıçta yanlış kodlanmıştı (357 yerine 645). Bu durum boş veri döndürülmesine neden oluyordu. API üzerinden isim sorgusu yapılarak doğru ID tespit edildi.

### 9.3 Port Çakışması

Geliştirme sırasında `EADDRINUSE` hatası sıkça yaşandı. Eski Node.js süreçlerinin arka planda asılı kalmasından kaynaklanıyordu.

---

## 10. PROJE İSTERLERİNİN KARŞILANMA DURUMU

| # | İster | Durum |
|---|-------|-------|
| 1 | Konu seçimi (spor kulübü) | ✅ Galatasaray SK |
| 2 | Dinamik web sitesi | ✅ API + veritabanı entegrasyonu |
| 3 | HTML, JavaScript, CSS kullanımı | ✅ Tüm sayfalarda |
| 4 | Veritabanı (MySQL) | ✅ users + haberler tabloları |
| 5 | En az 14 farklı HTML etiketi | ✅ 20+ etiket |
| 6 | Kullanıcı kaydı ve bilgi saklama | ✅ 8 alan, bcrypt şifreleme |
| 7 | Uygun form nesneleri (Radio, Select, Text, Date) | ✅ Her alan için uygun nesne |
| 8 | Eksik bilgi uyarıları | ✅ İstemci + sunucu doğrulama |
| 9 | Kayıt başarı/hata mesajları | ✅ Yeşil/kırmızı alert kutuları |
| 10 | Stil ve renk değiştirilebilmesi | ✅ 4 tema seçeneği (localStorage) |
| 11 | Bootstrap kullanımı (ek puan) | ✅ Bootstrap 5.3 |
| 12 | Kimlik doğrulama (ek puan) | ✅ Giriş/çıkış, oturum yönetimi |

---

## 11. SONUÇ

Galatasaray SK Fan Web Sitesi, modern web teknolojilerini (HTML5, CSS3, ES6+ JavaScript, Node.js, MySQL) kullanarak tam fonksiyonel, güvenli ve görsel olarak zengin bir dinamik web uygulaması olarak başarıyla geliştirilmiştir. Projede SofaScore API entegrasyonu ile gerçek zamanlı futbol verileri, bcrypt ile güvenli kullanıcı sistemi, CSS animasyonları ile modern arayüz ve responsive tasarım ile tüm cihazlarda uyumlu görünüm sağlanmıştır. Proje, ödev dokümanında belirtilen tüm zorunlu isterleri ve ek puan kriterlerini eksiksiz karşılamaktadır.
