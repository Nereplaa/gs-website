require('dotenv').config({ override: true });
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 }
}));

// POST /api/register
app.post('/api/register', async (req, res) => {
    const { ad, soyad, cinsiyet, dogum_yeri, dogum_tarihi, meslek, email, sifre } = req.body;
    if (!ad || !soyad || !cinsiyet || !dogum_yeri || !dogum_tarihi || !meslek || !email || !sifre) {
        return res.status(400).json({ success: false, message: 'Tüm alanları eksiksiz doldurunuz.' });
    }
    try {
        const hashed = await bcrypt.hash(sifre, 10);
        await db.execute(
            'INSERT INTO users (ad, soyad, cinsiyet, dogum_yeri, dogum_tarihi, meslek, email, sifre) VALUES (?,?,?,?,?,?,?,?)',
            [ad, soyad, cinsiyet, dogum_yeri, dogum_tarihi, meslek, email, hashed]
        );
        res.json({ success: true, message: 'Kayıt başarıyla tamamlandı! Giriş yapabilirsiniz.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ success: false, message: 'Bu e-posta adresi zaten kayıtlı.' });
        } else {
            console.error(err);
            res.status(500).json({ success: false, message: 'Sunucu hatası. Lütfen tekrar deneyin.' });
        }
    }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
    const { email, sifre } = req.body;
    if (!email || !sifre) {
        return res.status(400).json({ success: false, message: 'E-posta ve şifre giriniz.' });
    }
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (!rows.length) return res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı.' });
        const ok = await bcrypt.compare(sifre, rows[0].sifre);
        if (!ok) return res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı.' });
        req.session.user = { id: rows[0].id, ad: rows[0].ad, soyad: rows[0].soyad, email: rows[0].email };
        res.json({ success: true, message: 'Giriş başarılı!', user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
    req.session.destroy(() => res.json({ success: true }));
});

// GET /api/me
app.get('/api/me', (req, res) => {
    if (req.session.user) return res.json({ success: true, user: req.session.user });
    res.status(401).json({ success: false });
});

// GET /api/haberler
app.get('/api/haberler', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM haberler ORDER BY tarih DESC LIMIT 20');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Haberler yüklenemedi.' });
    }
});

// GET /api/dashboard - protected
app.get('/api/dashboard', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Giriş yapmalısınız.' });
    try {
        const [rows] = await db.execute(
            'SELECT id, ad, soyad, cinsiyet, dogum_yeri, dogum_tarihi, meslek, email, kayit_tarihi FROM users WHERE id = ?',
            [req.session.user.id]
        );
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Veri yüklenemedi.' });
    }
});
// ===== SofaScore API — Güncel 2025-2026 Veriler =====
// Galatasaray SofaScore Team ID: 3061
const _apiCache = {};
const API_TTL = 6 * 60 * 60 * 1000; // 6 saat önbellek

function fetchSofaScore(urlPath) {
    return new Promise((resolve, reject) => {
        const cached = _apiCache[urlPath];
        if (cached && Date.now() - cached.t < API_TTL) return resolve(cached.d);
        const options = {
            hostname: 'www.sofascore.com',
            path: `/api/v1/${urlPath}`,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        };
        const req = https.get(options, res => {
            let raw = '';
            res.on('data', c => raw += c);
            res.on('end', () => {
                try {
                    const d = JSON.parse(raw);
                    _apiCache[urlPath] = { d, t: Date.now() };
                    resolve(d);
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
    });
}

// GET /api/kadro — Galatasaray güncel kadro (SofaScore)
app.get('/api/kadro', async (req, res) => {
    try {
        const data = await fetchSofaScore('team/3061/players');
        const posMap = { G: 'Goalkeeper', D: 'Defender', M: 'Midfielder', F: 'Attacker' };
        const players = (data.players || []).map(p => ({
            id: p.player.id,
            name: p.player.name,
            age: p.player.dateOfBirthTimestamp
                ? Math.floor((Date.now() / 1000 - p.player.dateOfBirthTimestamp) / 31557600)
                : null,
            number: p.player.shirtNumber || null,
            position: posMap[p.player.position] || p.player.position,
            photo: `https://api.sofascore.app/api/v1/player/${p.player.id}/image`
        }));
        res.json({ success: true, data: players });
    } catch (err) {
        console.error('Kadro API hatası:', err.message);
        res.status(500).json({ success: false, message: 'Kadro verisi alınamadı.' });
    }
});

// GET /api/fikstur — Güncel 2025-2026 sezonu (SofaScore)
app.get('/api/fikstur', async (req, res) => {
    try {
        const [lastData, nextData] = await Promise.all([
            fetchSofaScore('team/3061/events/last/0'),
            fetchSofaScore('team/3061/events/next/0')
        ]);
        const fmt = ts => new Date(ts * 1000).toISOString();
        const mapEvent = e => ({
            fixture: { date: fmt(e.startTimestamp), id: e.id },
            teams: {
                home: { id: e.homeTeam.id, name: e.homeTeam.name },
                away: { id: e.awayTeam.id, name: e.awayTeam.name }
            },
            goals: {
                home: e.homeScore?.current ?? null,
                away: e.awayScore?.current ?? null
            },
            league: { name: e.tournament?.name || '' }
        });
        const gecmis = (lastData.events || []).slice(-5).reverse().map(mapEvent);
        const gelecek = (nextData.events || []).slice(0, 3).map(mapEvent);
        res.json({ success: true, gecmis, gelecek });
    } catch (err) {
        console.error('Fikstür API hatası:', err.message);
        res.status(500).json({ success: false, message: 'Fikstür verisi alınamadı.' });
    }
});

const HTTP_PORT  = process.env.HTTP_PORT  || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// HTTP → HTTPS yönlendirme
http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host.split(':')[0]}:${HTTPS_PORT}${req.url}` });
    res.end();
}).listen(HTTP_PORT, () => console.log(`HTTP  -> https://localhost:${HTTPS_PORT}  (${HTTP_PORT} yönlendirme)`));

// HTTPS sunucu
try {
    const sslOptions = {
        key:  fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
    };
    https.createServer(sslOptions, app).listen(HTTPS_PORT, () =>
        console.log(`HTTPS sunucu calisiyor: https://localhost:${HTTPS_PORT}`)
    );
} catch (err) {
    console.warn('SSL sertifikasi bulunamadi, yalnizca HTTP calisiyor:', err.message);
    app.listen(HTTP_PORT, () => console.log(`HTTP sunucu calisiyor: http://localhost:${HTTP_PORT}`));
}
