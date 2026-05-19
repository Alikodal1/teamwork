const STORAGE_KEY = 'harcamalar_listesi';

function tutarFormatla(tutar) {
    return '₺ ' + parseFloat(tutar).toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function tarihFormatla(tarihStr) {
    const [yil, ay, gun] = tarihStr.split('-');
    return `${gun}.${ay}.${yil}`;
}

function harcamalariGetir() {
    const veri = localStorage.getItem(STORAGE_KEY);
    if (veri) return JSON.parse(veri);

    const varsayilan = [
        { id: 1,  tarih: '2026-04-24', kategori: 'Ulaşım',    aciklama: 'Otobüs Bileti',      tutar: 50.00 },
        { id: 2,  tarih: '2026-04-23', kategori: 'Alışveriş', aciklama: 'Market Alışverişi',  tutar: 320.00 },
        { id: 3,  tarih: '2026-04-20', kategori: 'Yemek',     aciklama: 'Restoran',           tutar: 180.00 },
        { id: 4,  tarih: '2026-04-18', kategori: 'Fatura',    aciklama: 'Elektrik Faturası',  tutar: 250.00 },
        { id: 5,  tarih: '2026-04-15', kategori: 'Eğlence',   aciklama: 'Sinema Bileti',      tutar: 120.00 },
        { id: 6,  tarih: '2026-04-12', kategori: 'Sağlık',    aciklama: 'Eczane',             tutar: 95.00 },
        { id: 7,  tarih: '2026-03-28', kategori: 'Yemek',     aciklama: 'Yemek Siparişi',     tutar: 145.00 },
        { id: 8,  tarih: '2026-03-25', kategori: 'Ulaşım',    aciklama: 'Taksi',              tutar: 85.00 },
        { id: 9,  tarih: '2026-03-20', kategori: 'Alışveriş', aciklama: 'Giyim',              tutar: 650.00 },
        { id: 10, tarih: '2026-03-15', kategori: 'Fatura',    aciklama: 'İnternet Faturası',  tutar: 199.00 },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(varsayilan));
    return varsayilan;
}

function benzersizId(liste) {
    return liste.length > 0 ? Math.max(...liste.map(h => h.id)) + 1 : 1;
}

function istatistikleriGuncelle(harcamalar) {
    const toplam = harcamalar.reduce((t, h) => t + h.tutar, 0);
    const buAy = new Date().getMonth() + 1;
    const buYil = new Date().getFullYear();
    const buAyki = harcamalar
        .filter(h => {
            const [yil, ay] = h.tarih.split('-').map(Number);
            return ay === buAy && yil === buYil;
        })
        .reduce((t, h) => t + h.tutar, 0);

    document.getElementById('toplamHarcama').textContent = tutarFormatla(toplam);
    document.getElementById('buAykiHarcama').textContent = tutarFormatla(buAyki);
    document.getElementById('toplamIslem').textContent = harcamalar.length + ' Kayıt';
}

function tabloGuncelle(harcamalar, filtre) {
    const tbody = document.getElementById('dashboardTablo');
    const bosKayit = document.getElementById('bosKayit');

    const filtrelenmis = filtre
        ? harcamalar.filter(h => h.kategori === filtre)
        : harcamalar;

    const gosterilecek = [...filtrelenmis]
        .sort((a, b) => b.tarih.localeCompare(a.tarih))
        .slice(0, 10);

    if (gosterilecek.length === 0) {
        tbody.innerHTML = '';
        bosKayit.style.display = 'block';
        return;
    }

    bosKayit.style.display = 'none';
    tbody.innerHTML = gosterilecek.map(h => `
        <tr>
            <td>${tarihFormatla(h.tarih)}</td>
            <td>${h.kategori}</td>
            <td>${h.aciklama}</td>
            <td style="font-weight:700; color:#e17055;">${tutarFormatla(h.tutar)}</td>
        </tr>
    `).join('');
}

function render() {
    const harcamalar = harcamalariGetir();
    const filtre = document.getElementById('kategoriFilter').value;

    istatistikleriGuncelle(harcamalar);
    tabloGuncelle(harcamalar, filtre);

    const aktif = localStorage.getItem('activeUser');
    if (aktif) {
        try {
            const u = JSON.parse(aktif);
            document.getElementById('activeUsername').textContent = u.username || 'Kullanıcı';
        } catch(e) {}
    }
}

function modalAc() {
    document.getElementById('harcamaForm').reset();
    document.getElementById('harcamaTarih').value = new Date().toISOString().split('T')[0];
    document.getElementById('modalOverlay').classList.add('active');
}

function modalKapat() {
    document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('btnHarcamaEkle').addEventListener('click', modalAc);
document.getElementById('modalKapat').addEventListener('click', modalKapat);
document.getElementById('btnIptal').addEventListener('click', modalKapat);

document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) modalKapat();
});

document.getElementById('kategoriFilter').addEventListener('change', render);

document.getElementById('harcamaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const liste = harcamalariGetir();
    const yeni = {
        id:       benzersizId(liste),
        tarih:    document.getElementById('harcamaTarih').value,
        kategori: document.getElementById('harcamaKategori').value,
        aciklama: document.getElementById('harcamaAciklama').value.trim(),
        tutar:    parseFloat(document.getElementById('harcamaTutar').value),
    };

    liste.unshift(yeni);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(liste));

    modalKapat();
    render();
});

render();