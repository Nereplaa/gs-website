-- Galatasaray SK Web Sitesi Veritabani
CREATE DATABASE IF NOT EXISTS galatasaray_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE galatasaray_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(50) NOT NULL,
    soyad VARCHAR(50) NOT NULL,
    cinsiyet ENUM('Erkek','Kadin') NOT NULL,
    dogum_yeri VARCHAR(100) NOT NULL,
    dogum_tarihi DATE NOT NULL,
    meslek ENUM('Doktor','Muhendis','Hemsire','Ogretmen','Asker','Hakim','Ciftci','Esnaf','Diger') NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    sifre VARCHAR(255) NOT NULL,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS haberler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    baslik VARCHAR(200) NOT NULL,
    icerik TEXT NOT NULL,
    kategori VARCHAR(50) DEFAULT 'Genel',
    tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO haberler (baslik, icerik, kategori) VALUES
('Galatasaray Superlig Liderligini Pekistiriyor', 'Galatasaray, bu hafta oynanan kritik mac sonrasinda rakibini 3-1 yenerek Superlig liderligini pekistirdi. Icardi hat-trick yaparak macin adamı secildi. Sari-kirmizililar bu galibiyetle puan farkini 8e cikardi ve sampiyonluk yolunda buyuk adim atti.', 'Mac Sonucu'),
('Sampiyonlar Liginde Tarihi Zafer', 'Galatasaray, UEFA Sampiyonlar Ligi grup asamasinda buyuk rakibini 2-1 yenerek tarih yazdi. Ali Sami Yen Spor Kompleksinde 52 bin taraftarin onunde oynanan nefes kesen macta Galatasaray muhtefem ruhunu sahaya yansitti.', 'Avrupa'),
('2026-2027 Sezonu Formasi Tanitildi', 'Galatasaray SK, 2026-2027 sezonu forma tasarimini tanitti. Ikonik sari-kirmizi renkleri modern bir yorumla yeniden tasarlanan forma buyuk begeni topladi. Forma on satis baslangicinda rekor kirildi.', 'Kulup'),
('Altyapidan Milli Takima', 'Galatasaray altyapisindan yetisen genc oyuncu, A Milli Takim kadrosuna alindi. 22 yasindaki oyuncu bu sezon 15 gol ve 10 asist performansiyla dikkat cekiyor. Kulup yonetimi bu basaridan buyuk gurur duyuyor.', 'Oyuncu'),
('Turkiye Kupasi Finali Hazirliklari', 'Galatasaray Turkiye Kupasi final hazirliklarini tum hizyla surduruyor. Teknik direktor, mac oncesi basin toplantisinda takimin morali ve motivasyonunun ust seviyede oldugunu acikladi. Taraftar tribunleri doldurmaya hazirlaniyor.', 'Kupa'),
('Yeni Teknik Direktor ile Ilk Antrenman', 'Galatasaray yeni teknik direktoru liderliginde ilk antrenmani tamamladi. Oyuncularin motivasyonu cok yuksekti. Yeni sistemin takim icin cok uygun oldugu gozlemlendi ve sezonun geri kalaninda iyi sonuclar bekleniyor.', 'Kulup'),
('Galatasaray Taraftar Bulusmasi', 'Galatasaray taraftarlari, bu sezonun en buyuk taraftar bulusmasinda bir araya geldi. Istanbul genelinde duzenlen etkinlige 10 binden fazla taraftar katildi. Sari-kirmizi ask bir kez daha kendini gosterdi.', 'Taraftar'),
('Sampiyonluk Kutlamalari Basladi', 'Galatasaray taraftarlari, takimin 25. lig sampiyonlugunu Istanbulun dort bir yaninda coskunla kutladi. Taksim Meydaninda binlerce taraftar sari-kirmizi bayraklarla bulurtu ve geceye damgasini vurdu.', 'Kutlama');
