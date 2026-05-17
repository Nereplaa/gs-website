document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const alertError = document.getElementById('alertError');
    const alertSuccess = document.getElementById('alertSuccess');

    form.addEventListener('submit', async e => {
        e.preventDefault();
        alertError.style.display = 'none';
        alertSuccess.style.display = 'none';

        const email = document.getElementById('email').value.trim();
        const sifre = document.getElementById('sifre').value;

        if (!email || !sifre) {
            alertError.textContent = 'E-posta ve şifre giriniz.';
            alertError.style.display = 'block';
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Giriş yapılıyor...';

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, sifre })
            });
            const data = await res.json();
            if (data.success) {
                alertSuccess.textContent = `Hoş geldiniz, ${data.user.ad}! Yönlendiriliyorsunuz...`;
                alertSuccess.style.display = 'block';
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                alertError.textContent = data.message;
                alertError.style.display = 'block';
            }
        } catch {
            alertError.textContent = 'Sunucuya bağlanılamadı.';
            alertError.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Giriş Yap';
        }
    });
});
