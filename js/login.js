document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const successMsg = document.getElementById('loginSuccess');

    let isValid = true;

    // Önceki hataları temizle
    [email, password].forEach(function(el) {
        el.classList.remove('invalid');
        document.getElementById(el.id + 'Error').textContent = "";
    });
    successMsg.textContent = "";

    // Validasyon
    if (!email.value.includes("@")) {
        showLoginError(email, "Geçerli bir e-posta adresi giriniz.");
        isValid = false;
    }

    if (password.value.length < 1) {
        showLoginError(password, "Şifre boş bırakılamaz.");
        isValid = false;
    }

    if (isValid) {
        // Kullanıcı adı ve şifre kontrolü
        if (email.value === "123@gmail.com" && password.value === "123") {
            successMsg.textContent = "Giriş başarılı! Yönlendiriliyorsunuz...";
            setTimeout(function() {
                window.location.href = "index.html";
            }, 1500);
        } else {
            showLoginError(email, "E-posta veya şifre hatalı.");
            showLoginError(password, " ");
        }
    }
});

function showLoginError(input, message) {
    input.classList.add('invalid');
    document.getElementById(input.id + 'Error').textContent = message;
}