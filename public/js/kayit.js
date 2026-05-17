document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const alertSuccess = document.getElementById('alertSuccess');
    const alertError = document.getElementById('alertError');

    form.addEventListener('submit', async e => {
        e.preventDefault();
        alertSuccess.style.display = 'none';
        alertError.style.display = 'none';

        if (!validateForm()) return;

        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Kaydediliyor...';

        const body = {
            ad: document.getElementById('ad').value.trim(),
            soyad: document.getElementById('soyad').value.trim(),
            cinsiyet: document.querySelector('input[name="cinsiyet"]:checked')?.value,
            dogum_yeri: document.getElementById('dogum_yeri').value.trim(),
            dogum_tarihi: document.getElementById('dogum_tarihi').value,
            meslek: document.getElementById('meslek').value,
            email: document.getElementById('email').value.trim(),
            sifre: document.getElementById('sifre').value
        };

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                alertSuccess.querySelector('span') ? alertSuccess.querySelector('span').textContent = data.message : alertSuccess.textContent = data.message;
                alertSuccess.style.display = 'block';
                form.reset();
                setTimeout(() => window.location.href = 'giris.html', 2500);
            } else {
                alertError.querySelector('span') ? alertError.querySelector('span').textContent = data.message : alertError.textContent = data.message;
                alertError.style.display = 'block';
            }
        } catch {
            alertError.querySelector('span') ? alertError.querySelector('span').textContent = 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.' : alertError.textContent = 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.';
            alertError.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Kayıt Ol';
        }
    });

    function validateForm() {
        let valid = true;
        clearErrors();

        const ad = document.getElementById('ad').value.trim();
        const soyad = document.getElementById('soyad').value.trim();
        const cinsiyet = document.querySelector('input[name="cinsiyet"]:checked');
        const dogum_yeri = document.getElementById('dogum_yeri').value.trim();
        const dogum_tarihi = document.getElementById('dogum_tarihi').value;
        const meslek = document.getElementById('meslek').value;
        const email = document.getElementById('email').value.trim();
        const sifre = document.getElementById('sifre').value;
        const sifreTekrar = document.getElementById('sifre_tekrar').value;

        if (!ad) { setError('ad', 'Ad alanı zorunludur.'); valid = false; }
        if (!soyad) { setError('soyad', 'Soyad alanı zorunludur.'); valid = false; }
        if (!cinsiyet) { setError('cinsiyetGroup', 'Cinsiyet seçiniz.'); valid = false; }
        if (!dogum_yeri) { setError('dogum_yeri', 'Doğum yeri zorunludur.'); valid = false; }
        if (!dogum_tarihi) { setError('dogum_tarihi', 'Doğum tarihi zorunludur.'); valid = false; }
        if (!meslek) { setError('meslek', 'Meslek seçiniz.'); valid = false; }
        if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('email', 'Geçerli bir e-posta giriniz.'); valid = false; }
        if (!sifre || sifre.length < 6) { setError('sifre', 'Şifre en az 6 karakter olmalıdır.'); valid = false; }
        if (sifre !== sifreTekrar) { setError('sifre_tekrar', 'Şifreler eşleşmiyor.'); valid = false; }

        return valid;
    }

    function setError(fieldId, msg) {
        const el = document.getElementById(fieldId);
        if (el) { el.classList.add('is-invalid'); }
        const err = document.getElementById(fieldId + 'Error');
        if (err) { err.textContent = msg; }
    }

    function clearErrors() {
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }

    // Real-time clear errors on input
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', () => el.classList.remove('is-invalid'));
    });
});
