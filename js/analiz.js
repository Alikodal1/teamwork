const STORAGE_KEY = 'harcamalar_listesi';

const kategoriConfig = {
    'Yemek':      { ikon: 'fa-utensils',     renk: '#d4a017', bg: '#ffeaa7' },
    'Alışveriş':  { ikon: 'fa-bag-shopping', renk: '#636e72', bg: '#dfe6e9' },
    'Ulaşım':     { ikon: 'fa-bus',          renk: '#0056b3', bg: '#cce5ff' },
    'Eğlence':    { ikon: 'fa-gamepad',      renk: '#c0392b', bg: '#ffd6e0' },
    'Sağlık':     { ikon: 'fa-heart-pulse',  renk: '#27ae60', bg: '#d4f5d4' },
    'Fatura':     { ikon: 'fa-file-invoice', renk: '#6c3483', bg: '#ede7f6' },
    'Diğer':      { ikon: 'fa-ellipsis',     renk: '#888',    bg: '#f0f0f0' },
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

    // Sadece harcaması olanları al, büyükten küçüğe sırala
    const sirali = Object.keys(kategoriConfig)
        .filter(k => toplamlar[k] > 0)
        .sort((a, b) => toplamlar[b] - toplamlar[a]);

    // Chart verisi
    const labels = sirali;
    const data   = sirali.map(k => toplamlar[k]);
    const colors = sirali.map(k => kategoriConfig[k].renk);

    // Donut grafik
    const ctx = document.getElementById('analizChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 10,
            }]
        },
        options: {
            cutout: '68%',
            plugins: { legend: { display: false }, tooltip: {
                callbacks: {
                    label: function(ctx) {
                        const yuzde = genelToplam > 0 ? ((ctx.parsed / genelToplam) * 100).toFixed(1) : 0;
                        return ` ${ctx.label}: %${yuzde} (${tutarFormatla(ctx.parsed)})`;
                    }
                }
            }},
        }
    });

    // Ortadaki toplam yazı
    document.getElementById('grafikToplamTutar').textContent = tutarFormatla(genelToplam);

    // Legend
    const legend = document.getElementById('legend');
    legend.innerHTML = sirali.map(k => {
        const yuzde = genelToplam > 0 ? ((toplamlar[k] / genelToplam) * 100).toFixed(1) : 0;
        return `
        <div class="legend-item">
            <div class="legend-sol">
                <div class="legend-nokta" style="background:${kategoriConfig[k].renk};"></div>
                <span>${k}</span>
            </div>
            <span class="legend-yuzde">%${yuzde}</span>
        </div>`;
    }).join('');

    // Sıralama listesi
    const liste = document.getElementById('siralamListesi');
    liste.innerHTML = sirali.map((k, i) => {
        const cfg = kategoriConfig[k];
        const yuzde = genelToplam > 0 ? ((toplamlar[k] / genelToplam) * 100).toFixed(1) : 0;
        return `
        <div class="siralama-item">
            <div class="siralama-no">${i + 1}</div>
            <div class="siralama-ikon" style="background:${cfg.bg}; color:${cfg.renk};">
                <i class="fa-solid ${cfg.ikon}"></i>
            </div>
            <div class="siralama-bilgi">
                <strong>${k}</strong>
                <span>${sayilar[k]} işlem · %${yuzde}</span>
            </div>
            <div class="siralama-tutar">${tutarFormatla(toplamlar[k])}</div>
        </div>`;
    }).join('');

    // Kullanıcı adı
    const aktif = localStorage.getItem('activeUser');
    if (aktif) {
        try {
            const u = JSON.parse(aktif);
            document.getElementById('activeUsername').textContent = u.username || 'Kullanıcı';
        } catch(e) {}
    }
}

render();