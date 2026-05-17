// Check session and update navbar + conditional buttons
async function checkAuth() {
    try {
        const res = await fetch('/api/me');
        const data = await res.json();
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;
        if (data.success) {
            authButtons.innerHTML = `
                <span class="nav-link text-warning fw-bold">${data.user.ad} ${data.user.soyad}</span>
                <a class="nav-link btn-nav-login me-2" href="dashboard.html">Profilim</a>
                <button class="nav-link btn-nav-register" onclick="logout()">Çıkış</button>`;

            const heroUyeOl = document.getElementById('heroUyeOl');
            if (heroUyeOl) heroUyeOl.style.display = 'none';

            const asideCTA = document.getElementById('asideCTA');
            if (asideCTA) asideCTA.style.display = 'none';
        }
    } catch {}
}

async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = 'index.html';
}

// Load news cards
async function loadNews(containerId, limit = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<div class="gs-spinner"></div>';
    try {
        const res = await fetch('/api/haberler');
        const data = await res.json();
        if (!data.success || !data.data.length) {
            container.innerHTML = '<p class="text-center text-muted py-4">Haber bulunamadı.</p>';
            return;
        }
        const icons = ['⚽', '🏆', '🔴', '⭐', '🎯', '🏟️', '📰', '🎉'];
        const news = data.data.slice(0, limit);
        container.innerHTML = news.map((h, i) => `
            <div class="col-md-4 mb-4">
                <article class="news-card">
                    <div class="news-card-img">${icons[i % icons.length]}</div>
                    <div class="news-card-body">
                        <span class="news-category">${h.kategori}</span>
                        <h5 class="news-card-title">${h.baslik}</h5>
                        <p class="news-card-text">${h.icerik.substring(0, 120)}...</p>
                    </div>
                    <div class="news-card-footer">
                        <span><i class="fas fa-calendar-alt me-1"></i>${new Date(h.tarih).toLocaleDateString('tr-TR')}</span>
                        <a href="haberler.html">Devamı &rarr;</a>
                    </div>
                </article>
            </div>`).join('');
    } catch {
        container.innerHTML = '<p class="text-center text-danger py-4">Haberler yüklenirken hata oluştu.</p>';
    }
}

// Theme switcher
function initTheme() {
    const themes = {
        'gs-original': { primary: '#E8252A', secondary: '#FDB913' },
        'gs-dark':     { primary: '#1a1a2e', secondary: '#e94560' },
        'gs-blue':     { primary: '#0d3b6e', secondary: '#1e7fc2' },
        'gs-green':    { primary: '#1a6b3a', secondary: '#28a745' },
    };
    const saved = localStorage.getItem('gs-theme') || 'gs-original';
    applyTheme(themes[saved]);
    document.querySelectorAll('.color-option').forEach(btn => {
        if (btn.dataset.theme === saved) btn.classList.add('active');
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const t = themes[btn.dataset.theme];
            applyTheme(t);
            localStorage.setItem('gs-theme', btn.dataset.theme);
        });
    });
}

function applyTheme(t) {
    document.documentElement.style.setProperty('--gs-red', t.primary);
    document.documentElement.style.setProperty('--primary', t.primary);
    document.documentElement.style.setProperty('--gs-yellow', t.secondary);
    document.documentElement.style.setProperty('--secondary', t.secondary);
}

function toggleThemePanel() {
    document.getElementById('themePanel').classList.toggle('show');
}

document.addEventListener('click', e => {
    const panel = document.getElementById('themePanel');
    const btn = document.querySelector('.theme-btn');
    if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initTheme();
});
