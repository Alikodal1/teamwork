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

function showError(input, message) {
    input.classList.add('invalid');
    document.getElementById(input.id + 'Error').textContent = message;
}