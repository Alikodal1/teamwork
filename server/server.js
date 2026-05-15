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



app.listen(3000, () => {
    console.log("Server çalışıyor");
});