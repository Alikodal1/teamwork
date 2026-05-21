const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

const config = {
    user: "sa",
    password: "Password1!",
    server: "localhost",
    port: 50219,
    database: "HesapTakipDB",
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

sql.connect(config)
    .then(() => console.log("SQL bağlantısı başarılı"))
    .catch(err => console.log("SQL bağlantı hatası:", err));

// Rota tekrar orijinal haline: /register
app.post("/register", async (req, res) => {
    const { kullaniciAdi, email, sifre } = req.body;

    try {
        const hashliSifre = await bcrypt.hash(sifre, 10);
        await sql.query`
            INSERT INTO Users (KullaniciAdi, Email, Sifre)
            VALUES (${kullaniciAdi}, ${email}, ${hashliSifre})
        `;
        res.send("Kayıt başarılı");
    } catch (err) {
        console.log(err);
        // Eğer aynı e-posta ile kayıt olunmaya çalışılırsa buraya düşer
        res.status(500).send("Kayıt hatası (Bu e-posta zaten kullanılıyor olabilir)");
    }
});

// Rota tekrar orijinal haline: /login
app.post("/login", async (req, res) => {
    console.log("LOGIN İSTEĞİ GELDİ");
    const { email, sifre } = req.body;

    try {
        const result = await sql.query`
            SELECT * FROM Users WHERE Email = ${email}
        `;

        if (result.recordset.length === 0) {
            return res.status(401).send("Kullanıcı bulunamadı");
        }

        const user = result.recordset[0];
        const sifreDogruMu = await bcrypt.compare(sifre, user.Sifre);

        if (!sifreDogruMu) {
            return res.status(401).send("Şifre yanlış");
        }

        // Giriş düzeltmemiz: Frontend artık JSON bekliyor
        res.json({ success: true, message: "Giriş başarılı" });

    } catch (err) {
        console.log(err);
        res.status(500).send("Sunucu hatası");
    }
});




app.post("/logout", (req, res) => {
    // İleride session veya cookie kullanırsan temizleme işlemlerini buraya yazacağız
    res.json({ success: true, message: "Çıkış başarılı" });
});


// Port tekrar orijinal haline: 3000
app.listen(3000, () => {
    console.log("Server çalışıyor - Port: 3000");
});