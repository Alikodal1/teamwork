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
    .then(() => {
        console.log("SQL bağlantısı başarılı");
    })
    .catch(err => {
        console.log("SQL bağlantı hatası:");
        console.log(err);
    });

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
        res.status(500).send("Hata oluştu");

    }

});


app.post("/login", async (req, res) => {     //login form isimli form gönderildiğinde bu kod çalışacak.

    console.log("LOGIN İSTEĞİ GELDİ");

    const { email, sifre } = req.body;

    try {

        const result = await sql.query`
            SELECT * FROM Users
            WHERE Email = ${email}
        `;

        if (result.recordset.length === 0) {

            return res
                .status(401)
                .send("Kullanıcı bulunamadı");

        }

        const user = result.recordset[0];

        const sifreDogruMu =
            await bcrypt.compare(sifre, user.Sifre);

        if (!sifreDogruMu) {

            return res
                .status(401)
                .send("Şifre yanlış");

        }

        res.send("Giriş başarılı");

    } catch (err) {

        console.log(err);

        res
            .status(500)
            .send("Sunucu hatası");

    }

});





app.listen(3000, () => {
    console.log("Server çalışıyor");
});