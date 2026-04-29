document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    // Temizlik: Önceki hataları ve sınıfları kaldır
    [username, email, password].forEach(el => {
        el.classList.remove('invalid');
        document.getElementById(el.id + 'Error').textContent = "";
    });

    // Validasyon Kontrolleri [cite: 57]
    if (username.value.trim().length < 3) {
        showError(username, "Kullanıcı adı en az 3 karakter olmalı.");
        isValid = false;
    }

    if (!email.value.includes("@")) {
        showError(email, "Geçerli bir e-posta adresi giriniz.");
        isValid = false;
    }

    if (password.value.length < 6) {
        showError(password, "Şifre en az 6 karakter olmalı.");
        isValid = false;
    }

    if (isValid) {
        console.log("Kayıt verisi hazır:", {user: username.value, mail: email.value});
        // Başarılı kayıt sonrası login'e yönlendir 
        alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
        window.location.href = "login.html"; 
    }
});






// 1. Elemanları Seçme
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('login-password');

// Hata mesajı gösterilecek alanlar
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');

// 2. Form Gönderildiğinde Çalışacak Olay
loginForm.addEventListener('submit', function (e) {
    // Sayfanın yenilenmesini durdur
    e.preventDefault();

    // Hata mesajlarını her denemede temizle
    usernameError.textContent = "";
    passwordError.textContent = "";

    // Değerleri al (Boşlukları temizle)
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    let hasError = false;

    // 3. Basit Boşluk Kontrolü
    if (username === "") {
        usernameError.textContent = "Kullanıcı adı boş bırakılamaz.";
        hasError = true;
    }
    if (password === "") {
        passwordError.textContent = "Şifre boş bırakılamaz.";
        hasError = true;
    }

    if (hasError) return; // Hata varsa devam etme

    // 4. LocalStorage'dan Kullanıcı Bilgilerini Kontrol Etme
    // Arkadaşının Register sayfasında 'users' anahtarıyla bir dizi tuttuğunu varsayıyoruz.
    // Eğer tek bir kullanıcı tutuyorsanız 'user' olarak değiştirebilirsiniz.
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Kullanıcıyı bul
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
        // GİRİŞ BAŞARILI
        alert(`Hoş geldin, ${foundUser.username}!`);
        
        // Giriş yapan kullanıcıyı 'currentUser' olarak sakla (Giriş yapılmış mı kontrolü için)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('activeUser', JSON.stringify(foundUser));

        // Ana sayfaya (Harcama Takip ekranına) yönlendir
        window.location.href = 'index.html';
    } else {
        // GİRİŞ BAŞARISIZ
        passwordError.textContent = "Kullanıcı adı veya şifre hatalı!";
    }
});