const STORAGE_KEY = 'harcamalar_listesi';
const SAYFA_BOYUTU = 8;

let harcamalar = [];
let filtreliHarcamalar = [];
let mevcutSayfa = 1;
let silinecekId = null;

const kategoriRenkleri = {
    'Yemek':      { cls: 'badge-yemek',     ikon: 'fa-utensils' },
    'Alışveriş':  { cls: 'badge-alisveris', ikon: 'fa-bag-shopping' },
    'Ulaşım':     { cls: 'badge-ulasim',    ikon: 'fa-bus' },
    'Eğlence':    { cls: 'badge-eglence',   ikon: 'fa-gamepad' },
    'Sağlık':     { cls: 'badge-saglik',    ikon: 'fa-heart-pulse' },
    'Fatura':     { cls: 'badge-fatura',    ikon: 'fa-file-invoice' },
    'Diğer':      { cls: 'badge-diger',     ikon: 'fa-ellipsis' },
};

function kaydet() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(harcamalar));
}

function yukle() {
    const veri = localStorage.getItem(STORAGE_KEY);
    if (veri) {
        harcamalar = JSON.parse(veri);
    } else {
        harcamalar = [
            { id: 1, tarih: '2026-04-24', kategori: 'Ulaşım',    aciklama: 'Otobüs Bileti',       tutar: 50.00 },
            { id: 2, tarih: '2026-04-23', kategori: 'Alışveriş', aciklama: 'Market Alışverişi',   tutar: 320.00 },
            { id: 3, tarih: '2026-04-20', kategori: 'Yemek',     aciklama: 'Restoran',            tutar: 180.00 },
            { id: 4, tarih: '2026-04-18', kategori: 'Fatura',    aciklama: 'Elektrik Faturası',   tutar: 250.00 },
            { id: 5, tarih: '2026-04-15', kategori: 'Eğlence',   aciklama: 'Sinema Bileti',       tutar: 120.00 },
            { id: 6, tarih: '2026-04-12', kategori: 'Sağlık',    aciklama: 'Eczane',              tutar: 95.00 },
            { id: 7, tarih: '2026-03-28', kategori: 'Yemek',     aciklama: 'Yemek Siparişi',      tutar: 145.00 },
            { id: 8, tarih: '2026-03-25', kategori: 'Ulaşım',    aciklama: 'Taksi',               tutar: 85.00 },
            { id: 9, tarih: '2026-03-20', kategori: 'Alışveriş', aciklama: 'Giyim',               tutar: 650.00 },
            { id: 10, tarih: '2026-03-15', kategori: 'Fatura',   aciklama: 'İnternet Faturası',   tutar: 199.00 },
        ];
        kaydet();
    }
}

function benzersizId() {
    return harcamalar.length > 0 ? Math.max(...harcamalar.map(h => h.id)) + 1 : 1;
}

function tarihFormatla(tarihStr) {
    const [yil, ay, gun] = tarihStr.split('-');
    return `${gun}.${ay}.${yil}`;
}

function tutarFormatla(tutar) {
    return '₺ ' + parseFloat(tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function istatistikleriGuncelle() {
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

function filtreUygula() {
    const arama = document.getElementById('aramaInput').value.toLowerCase();
    const kategori = document.getElementById('kategoriFilter').value;
    const ay = document.getElementById('ayFilter').value;
    const siralama = document.getElementById('siralamaSelect').value;

    filtreliHarcamalar = harcamalar.filter(h => {
        const aramaEsles = !arama ||
            h.aciklama.toLowerCase().includes(arama) ||
            h.kategori.toLowerCase().includes(arama);
        const kategoriEsles = !kategori || h.kategori === kategori;
        const ayEsles = !ay || h.tarih.split('-')[1] === ay.padStart(2, '0');
        return aramaEsles && kategoriEsles && ayEsles;
    });

    if (siralama === 'tarih-desc')   filtreliHarcamalar.sort((a, b) => b.tarih.localeCompare(a.tarih));
    if (siralama === 'tarih-asc')    filtreliHarcamalar.sort((a, b) => a.tarih.localeCompare(b.tarih));
    if (siralama === 'tutar-desc')   filtreliHarcamalar.sort((a, b) => b.tutar - a.tutar);
    if (siralama === 'tutar-asc')    filtreliHarcamalar.sort((a, b) => a.tutar - b.tutar);

    mevcutSayfa = 1;
    tabloRender();
    sayfalamaRender();
}

function tabloRender() {
    const tbody = document.getElementById('harcamalarBody');
    const bosKayit = document.getElementById('bosKayit');
    const tablo = document.getElementById('harcamalarTablosu');

    if (filtreliHarcamalar.length === 0) {
        tablo.style.display = 'none';
        bosKayit.style.display = 'block';
        return;
    }

    tablo.style.display = 'table';
    bosKayit.style.display = 'none';

    const baslangic = (mevcutSayfa - 1) * SAYFA_BOYUTU;
    const bitis = baslangic + SAYFA_BOYUTU;
    const sayfaVerisi = filtreliHarcamalar.slice(baslangic, bitis);

    tbody.innerHTML = sayfaVerisi.map(h => {
        const katInfo = kategoriRenkleri[h.kategori] || kategoriRenkleri['Diğer'];
        return `
        <tr>
            <td>${tarihFormatla(h.tarih)}</td>
            <td>
                <span class="kategori-badge ${katInfo.cls}">
                    <i class="fa-solid ${katInfo.ikon}"></i>
                    ${h.kategori}
                </span>
            </td>
            <td>${h.aciklama}</td>
            <td class="tutar-cell">${tutarFormatla(h.tutar)}</td>
            <td>
                <div class="islemler-cell">
                    <button class="btn-icon btn-icon-edit" title="Düzenle" onclick="harcamaDuzenle(${h.id})">
                        <i class="fa-solid fa-pen-to-square"></i> Düzenle
                    </button>
                    <button class="btn-icon btn-icon-delete" title="Sil" onclick="harcamaSilOnay(${h.id})">
                        <i class="fa-solid fa-trash"></i> Sil
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function sayfalamaRender() {
    const pagination = document.getElementById('pagination');
    const toplamSayfa = Math.ceil(filtreliHarcamalar.length / SAYFA_BOYUTU);

    if (toplamSayfa <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = `<button ${mevcutSayfa === 1 ? 'disabled' : ''} onclick="sayfaDegistir(${mevcutSayfa - 1})">
        <i class="fa-solid fa-chevron-left"></i>
    </button>`;

    for (let i = 1; i <= toplamSayfa; i++) {
        html += `<button class="${i === mevcutSayfa ? 'active' : ''}" onclick="sayfaDegistir(${i})">${i}</button>`;
    }

    html += `<button ${mevcutSayfa === toplamSayfa ? 'disabled' : ''} onclick="sayfaDegistir(${mevcutSayfa + 1})">
        <i class="fa-solid fa-chevron-right"></i>
    </button>`;

    pagination.innerHTML = html;
}

function sayfaDegistir(sayfa) {
    mevcutSayfa = sayfa;
    tabloRender();
    sayfalamaRender();
}

function modalAc(harcama = null) {
    const overlay = document.getElementById('modalOverlay');
    const baslik = document.getElementById('modalBaslik');
    const form = document.getElementById('harcamaForm');

    form.reset();

    if (harcama) {
        baslik.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Harcama Düzenle';
        document.getElementById('harcamaId').value = harcama.id;
        document.getElementById('harcamaTarih').value = harcama.tarih;
        document.getElementById('harcamaKategori').value = harcama.kategori;
        document.getElementById('harcamaAciklama').value = harcama.aciklama;
        document.getElementById('harcamaTutar').value = harcama.tutar;
    } else {
        baslik.innerHTML = '<i class="fa-solid fa-plus"></i> Yeni Harcama';
        document.getElementById('harcamaId').value = '';
        document.getElementById('harcamaTarih').value = new Date().toISOString().split('T')[0];
    }

    overlay.classList.add('active');
}

function modalKapat() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function harcamaDuzenle(id) {
    const harcama = harcamalar.find(h => h.id === id);
    if (harcama) modalAc(harcama);
}

function harcamaSilOnay(id) {
    silinecekId = id;
    document.getElementById('silOnayOverlay').classList.add('active');
}

function silOnayKapat() {
    silinecekId = null;
    document.getElementById('silOnayOverlay').classList.remove('active');
}

document.getElementById('harcamaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('harcamaId').value;
    const yeniHarcama = {
        tarih:     document.getElementById('harcamaTarih').value,
        kategori:  document.getElementById('harcamaKategori').value,
        aciklama:  document.getElementById('harcamaAciklama').value.trim(),
        tutar:     parseFloat(document.getElementById('harcamaTutar').value),
    };

    if (id) {
        const idx = harcamalar.findIndex(h => h.id === parseInt(id));
        if (idx !== -1) harcamalar[idx] = { id: parseInt(id), ...yeniHarcama };
    } else {
        harcamalar.unshift({ id: benzersizId(), ...yeniHarcama });
    }

    kaydet();
    modalKapat();
    istatistikleriGuncelle();
    filtreUygula();
});

document.getElementById('btnSilOnayla').addEventListener('click', function() {
    if (silinecekId !== null) {
        harcamalar = harcamalar.filter(h => h.id !== silinecekId);
        kaydet();
        silOnayKapat();
        istatistikleriGuncelle();
        filtreUygula();
    }
});

document.getElementById('btnYeniHarcama').addEventListener('click', () => modalAc());
document.getElementById('btnYeniHarcama2').addEventListener('click', () => modalAc());
document.getElementById('modalKapat').addEventListener('click', modalKapat);
document.getElementById('btnIptal').addEventListener('click', modalKapat);
document.getElementById('silOnayKapat').addEventListener('click', silOnayKapat);
document.getElementById('btnSilIptal').addEventListener('click', silOnayKapat);

document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) modalKapat();
});
document.getElementById('silOnayOverlay').addEventListener('click', function(e) {
    if (e.target === this) silOnayKapat();
});

document.getElementById('aramaInput').addEventListener('input', filtreUygula);
document.getElementById('kategoriFilter').addEventListener('change', filtreUygula);
document.getElementById('ayFilter').addEventListener('change', filtreUygula);
document.getElementById('siralamaSelect').addEventListener('change', filtreUygula);

const aktifKullanici = localStorage.getItem('activeUser');
if (aktifKullanici) {
    try {
        const kullanici = JSON.parse(aktifKullanici);
        document.getElementById('activeUsername').textContent = kullanici.username || 'Kullanıcı';
    } catch(e) {}
}

yukle();
istatistikleriGuncelle();
filtreUygula();
