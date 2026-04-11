<script>
function validateForm() {

    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
        alert("Tüm alanlar doldurulmalı!");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Geçerli email giriniz!");
        return false;
    }

    if (password.length < 6) {
        alert("Şifre en az 6 karakter olmalı!");
        return false;
    }

    alert("Kayıt başarılı!");
    return true;
}
</script>