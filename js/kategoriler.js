const STORAGE_KEY = 'harcamalar_listesi';

const kategoriConfig = {
    'Yemek':      { ikon: 'fa-utensils',     renk: '#d4a017', bg: '#ffeaa7' },
    'Alışveriş':  { ikon: 'fa-bag-shopping', renk: '#636e72', bg: '#dfe6e9' },
    'Ulaşım':     { ikon: 'fa-bus',          renk: '#0056b3', bg: '#cce5ff' },
    'Eğlence':    { ikon: 'fa-gamepad',      renk: '#c0392b', bg: '#ffd6e0' },
    'Sağlık':     { ikon: 'fa-heart-pulse',  renk: '#27ae60', bg: '#d4f5d4' },
    'Fatura':     { ikon: 'fa-file-invoice', renk: '#6c3483', bg: '#ede7f6' },
    'Diğer':      { ikon: 'fa-ellipsis',     renk: '#666',    bg: '#f0f0f0' },
};

function tutarFormatla(tutar) {
    return '₺ ' + parseFloat(tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function render() {
    const veri = localStorage.getItem(STORAGE_KEY);
    const harcamalar = veri ? JSON.parse(veri) : [];

    const toplamlar = {};
    const sayilar = {};

    Object.keys(kategoriConfig).forEach(k => { toplamlar[k] = 0; sayilar[k] = 0; });

    harcamalar.forEach(h => {
        const k = h.kategori in kategoriConfig ? h.kategori : 'Diğer';
        toplamlar[k] += h.tutar;
        sayilar[k]++;
    });

    const genelToplam = Object.values(toplamlar).reduce((a, b) => a + b, 0);

    const grid = document.getElementById('kategoriGrid');
    grid.innerHTML = Object.keys(kategoriConfig).map(k => {
        const cfg = kategoriConfig[k];
        const yuzde = genelToplam > 0 ? ((toplamlar[k] / genelToplam) * 100).toFixed(1) : 0;
        const oran = genelToplam > 0 ? (toplamlar[k] / genelToplam) * 100 : 0;

        return `
        <div class="kategori-kart">
            <div class="kategori-kart-ust">
                <div class="kategori-ikon" style="background:${cfg.bg}; color:${cfg.renk};">
                    <i class="fa-solid ${cfg.ikon}"></i>
                </div>
                <div class="kategori-bilgi">
                    <h3>${k}</h3>
                    <span>${sayilar[k]} işlem</span>
                </div>
            </div>
            <div class="kategori-tutar">${tutarFormatla(toplamlar[k])}</div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width:${oran}%; background:${cfg.renk};"></div>
            </div>
            <div class="kategori-alt">
                <span>Toplam harcamadan pay</span>
                <span>%${yuzde}</span>
            </div>
        </div>`;
    }).join('');

    const aktif = localStorage.getItem('activeUser');
    if (aktif) {
        try {
            const k = JSON.parse(aktif);
            document.getElementById('activeUsername').textContent = k.username || 'Kullanıcı';
        } catch(e) {}
    }
}

render();