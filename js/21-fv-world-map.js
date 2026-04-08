// ══════════════════════════════════════════════════════════════
// Fairy Village World Map (BoF4 Style)
// File: js/21-fv-world-map.js
// ══════════════════════════════════════════════════════════════
// 🧚‍♀️ KAHYANGAN WILIS — WORLD MAP MINIGAME (BoF4 Style)
// ═══════════════════════════════════════════════════════════════

// ── DATA BANGUNAN ─────────────────────────────────────────────
// Setiap bangunan punya tier 1→2→3 (upgrade in-place)
// maxWorkers per tier: tier1=1, tier2=2, tier3=3
// upgradeTo = id bangunan tier berikutnya di slot yang sama
// upgradeCost = biaya khusus upgrade (lebih mahal dari bangun baru)
const FAIRY_BUILDINGS = {
    // ── BAWAAN ───────────────────────────────────────────────────
    pohon_energi:    { name:'🌳 Pohon Energi',         tier:0, emoji:'🌳', w:2,h:2, maxWorkers:2, dustPerDay:5,
                       desc:'Sumber energi alam Wilis. Sudah ada sejak awal.', produce:'5 Debu/hari', builtIn:true },

    // ── HUNIAN (melahirkan peri) ──────────────────────────────────
    pondok_peri:     { name:'🏚️ Padepokan Cilik',      tier:1, emoji:'🏚️', w:2,h:2, maxWorkers:1,
                       maxFairies:1, birthChance:0,
                       cost:{debu:20}, upgradeCost:{debu:50,kristal:1},
                       upgradeTo:'rumah_peri',
                       desc:'Tempat tinggal 1 Widadari.', produce:'Kapasitas +1 peri' },
    rumah_peri:      { name:'🏠 Omah Widadari',         tier:2, emoji:'🏠', w:2,h:2, maxWorkers:2,
                       maxFairies:2, birthChance:0.15,
                       cost:{debu:60,kristal:1}, upgradeCost:{debu:100,kristal:2},
                       upgradeTo:'dalem_widadari',
                       desc:'2 Widadari, bayi bisa lahir 15%/hari.', produce:'Kapasitas +2 peri, 15% lahir/hari' },
    dalem_widadari:  { name:'🏡 Dalem Widadari',        tier:3, emoji:'🏡', w:2,h:2, maxWorkers:3,
                       maxFairies:4, birthChance:0.35,
                       cost:{debu:150,kristal:3,cahaya:1},
                       desc:'4 Widadari, bayi lahir 35%/hari.', produce:'Kapasitas +4 peri, 35% lahir/hari' },

    // ── TAMAN (debu + makanan) ────────────────────────────────────
    taman_mini:      { name:'🌸 Taman Bunga',           tier:1, emoji:'🌸', w:2,h:2, maxWorkers:1,
                       dustPerDay:3, foodPerDay:2,
                       cost:{debu:15}, upgradeCost:{debu:45,kristal:1},
                       upgradeTo:'taman_mekar',
                       desc:'Menghasilkan Debu Peri & Makanan tiap hari.', produce:'3 Debu + 2 Makanan/hari' },
    taman_mekar:     { name:'🌺 Kebun Kenanga',          tier:2, emoji:'🌺', w:2,h:2, maxWorkers:2,
                       dustPerDay:8, foodPerDay:5,
                       cost:{debu:50,kristal:1}, upgradeCost:{debu:90,kristal:2},
                       upgradeTo:'kebun_raya',
                       desc:'+8 Debu & +5 Makanan/hari.', produce:'8 Debu + 5 Makanan/hari' },
    kebun_raya:      { name:'🌳 Kebun Raya Wilis',       tier:3, emoji:'🌳', w:2,h:2, maxWorkers:3,
                       dustPerDay:18, foodPerDay:10,
                       cost:{debu:130,kristal:3},
                       desc:'+18 Debu & +10 Makanan/hari.', produce:'18 Debu + 10 Makanan/hari' },

    // ── KOLAM (happiness + debu) ──────────────────────────────────
    kolam_kristal:   { name:'💧 Sendang Suci',           tier:1, emoji:'💧', w:2,h:2, maxWorkers:1,
                       happinessBonus:10,
                       cost:{debu:25}, upgradeCost:{debu:60,kristal:1},
                       upgradeTo:'kolam_agung',
                       desc:'Memancarkan berkah kebahagiaan.', produce:'Happiness +10/hari' },
    kolam_agung:     { name:'🌊 Sendang Agung',          tier:2, emoji:'🌊', w:2,h:2, maxWorkers:2,
                       happinessBonus:25, dustPerDay:5,
                       cost:{debu:80,kristal:2}, upgradeCost:{debu:130,kristal:3},
                       upgradeTo:'telaga_nirmala',
                       desc:'+25 Happiness & +5 Debu/hari.', produce:'Happiness +25 + 5 Debu/hari' },
    telaga_nirmala:  { name:'🌈 Telaga Nirmala',         tier:3, emoji:'🌈', w:2,h:2, maxWorkers:3,
                       happinessBonus:50, dustPerDay:12,
                       cost:{debu:180,kristal:4,cahaya:1},
                       desc:'+50 Happiness & +12 Debu/hari.', produce:'Happiness +50 + 12 Debu/hari' },

    // ── SEKOLAH (XP bonus) ────────────────────────────────────────
    sekolah_peri:    { name:'📚 Padepokan Ilmu',         tier:1, emoji:'📚', w:2,h:2, maxWorkers:1,
                       xpBonus:1.5,
                       cost:{debu:40}, upgradeCost:{debu:80,kristal:1},
                       upgradeTo:'sanggar_tari',
                       desc:'XP peri ×1.5.', produce:'XP peri ×1.5' },
    sanggar_tari:    { name:'🎓 Sanggar Tari',            tier:2, emoji:'🎓', w:2,h:2, maxWorkers:2,
                       xpBonus:2.0,
                       cost:{debu:90,kristal:2}, upgradeCost:{debu:150,kristal:3},
                       upgradeTo:'akademi_agung',
                       desc:'XP peri ×2.0.', produce:'XP peri ×2.0' },
    akademi_agung:   { name:'🏛️ Akademi Agung',          tier:3, emoji:'🏛️', w:2,h:2, maxWorkers:3,
                       xpBonus:3.0, intelBonus:3,
                       cost:{debu:180,kristal:4,cahaya:1},
                       desc:'XP peri ×3.0 & Intel +3/hari.', produce:'XP peri ×3.0 + Intel bonus' },

    // ── PASAR (trading) ───────────────────────────────────────────
    pasar_peri:      { name:'🛒 Pasar Kahyangan',        tier:1, emoji:'🛒', w:2,h:2, maxWorkers:1,
                       enableTrading:true, tradeBonus:1.0,
                       cost:{debu:60}, upgradeCost:{debu:100,kristal:2},
                       upgradeTo:'balai_dagang',
                       desc:'Tukar Debu↔Gold.', produce:'Aktifkan perdagangan' },
    balai_dagang:    { name:'🏪 Balai Dagang',            tier:2, emoji:'🏪', w:2,h:2, maxWorkers:2,
                       enableTrading:true, tradeBonus:1.3,
                       cost:{debu:120,kristal:2}, upgradeCost:{debu:180,kristal:4},
                       upgradeTo:'pusat_niaga',
                       desc:'Tukar Debu↔Gold dengan rate lebih baik.', produce:'Trading rate +30%' },
    pusat_niaga:     { name:'🏦 Pusat Niaga Wilis',       tier:3, emoji:'🏦', w:2,h:2, maxWorkers:3,
                       enableTrading:true, tradeBonus:1.6, kristalFromTrade:1,
                       cost:{debu:220,kristal:5,cahaya:1},
                       desc:'Rate terbaik + dapat Kristal dari trading.', produce:'Trading rate +60% + Kristal' },

    // ── MENARA (multiplier debu) ──────────────────────────────────
    menara_kecil:    { name:'🕯️ Menara Kecil',            tier:1, emoji:'🕯️', w:1,h:3, maxWorkers:1,
                       dustMultiplier:1.2,
                       cost:{debu:60,kristal:1}, upgradeCost:{debu:120,kristal:2},
                       upgradeTo:'menara_wilis',
                       desc:'Semua Debu Peri ×1.2.', produce:'Debu semua bangunan ×1.2' },
    menara_wilis:    { name:'✨ Menara Wilis',             tier:2, emoji:'✨', w:1,h:3, maxWorkers:2,
                       dustMultiplier:1.5,
                       cost:{debu:140,kristal:3}, upgradeCost:{debu:220,kristal:4,cahaya:1},
                       upgradeTo:'menara_cahaya',
                       desc:'Semua Debu Peri ×1.5.', produce:'Debu semua bangunan ×1.5' },
    menara_cahaya:   { name:'🌟 Menara Cahaya',            tier:3, emoji:'🌟', w:1,h:3, maxWorkers:3,
                       dustMultiplier:2.0, cahayaPerWeek:1,
                       cost:{debu:260,kristal:5,cahaya:2},
                       desc:'Debu ×2.0 & +1 Cahaya/minggu.', produce:'Debu ×2.0 + 1 Cahaya/minggu' },

    // ── ISTANA (legacy tier 4, tidak dibangun baru — hanya bisa dari upgrade dalem) ──
    // Dipertahankan untuk save lama
    istana_mini:     { name:'🏰 Puri Agung Wilis',        tier:4, emoji:'🏰', w:3,h:3, maxWorkers:3,
                       maxFairies:8, birthChance:0.50,
                       cost:{debu:400,kristal:8,cahaya:4},
                       desc:'8 Widadari, lahir 50%/hari.', produce:'Kapasitas +8 peri, 50% lahir/hari', legacy:true },
    pohon_kehidupan: { name:'🌳✨ Pohon Beringin Agung',   tier:4, emoji:'🌳', w:3,h:3, maxWorkers:3,
                       dustPerDay:30, cahayaPerWeek:1,
                       cost:{debu:500,kristal:10,cahaya:5},
                       desc:'+30 Debu/hari, +1 Cahaya/minggu.', produce:'30 Debu/hari + 1 Cahaya/minggu', legacy:true },
};

const FAIRY_NAMES_BOY  = ['Juna','Bagus','Rekso','Lanang','Bimo','Satrio','Wibowo','Agung','Prasetyo','Handoko','Cahyo'];
const FAIRY_NAMES_GIRL = ['Ayu','Wulan','Sekar','Endah','Ratih','Dewi','Larasati','Kinanti','Mawar','Niken'];


// ── LAYOUT SLOT BANGUNAN DI PETA 120×75 (setengah dari sebelumnya) ──
const FW = 60, FH = 40;    // peta lebih kecil — lebih padat & intim
const TS = 40;              // tile diperbesar agar bangunan terlihat jelas seperti peta utama
const FV_SPEED = 2.4;
// Skala visual bangunan: gambar di-render lebih besar dari hitbox tile (Stardew-style)
// Hitbox tetap w*TS × h*TS, tapi gambar di-render FV_BLDG_VISUAL_SCALE × lebih besar
const FV_BLDG_VISUAL_SCALE = 1.8;

// 12 slot bangunan tersebar di peta 60×40
const FAIRY_SLOTS = [
    // Baris atas (y~5) — disesuaikan ke map 45x30
    {id:'s1', x:3,  y:5 }, {id:'s2', x:12, y:5 }, {id:'s3', x:21, y:5 },
    {id:'s4', x:30, y:5 }, {id:'s5', x:39, y:5 },
    // Baris tengah (y~14)
    {id:'s6', x:3,  y:14}, {id:'s7', x:12, y:14}, {id:'s8', x:21, y:14},
    {id:'s9', x:30, y:14}, {id:'s10',x:39, y:14},
    // Baris bawah (y~22)
    {id:'s11',x:8,  y:22}, {id:'s12',x:32, y:22},
];

// Posisi NPC & objek penting — proporsional
const FV_RARA_POS  = { x:28, y:17 };   // Rara Wilis — tengah peta
const FV_POHON_POS = { x:21, y:24 };   // Pohon Energi — tengah-bawah
const FV_ISTANA_POS = { x:25, y:8  };  // Istana Peri — tengah-atas peta, tidak terpotong
// Pohon dekoratif pinggir peta
const FV_DECO_TREES = [
    {x:2,y:1},{x:8,y:1},{x:15,y:1},{x:30,y:1},{x:38,y:1},{x:43,y:1},
    {x:1,y:8},{x:43,y:8},{x:1,y:17},{x:43,y:17},{x:1,y:24},{x:43,y:24},
    {x:8,y:27},{x:21,y:28},{x:35,y:27},
];

// ── STATE RUNTIME ──────────────────────────────────────────────
let FVG = null;
let fvCanvas, fvCtx;
let fvCam = { x:0, y:0 };
let fvPlayer = { x:43*TS, y:10*TS, facing:'down' };
let fvKeys = {};
let fvActiveDialog = null;
let fvJoy = { active:false, startX:0, startY:0, dx:0, dy:0 };
let fvLastTime = 0;
let fvParticles = [];
let fvSpriteCache = {}; // Cache sprite image untuk peri wandering
let fvNpcRuntime = {}; // Runtime posisi NPC wandering di fairy village
let fvBuildingImageCache = {}; // Cache offscreen canvas gambar bangunan

// ── KAHYANGAN: Background Image ────────────────────────────────
let fvBgImage = null;
(function(){
    fvBgImage = new Image();
    fvBgImage.src = 'images/kayangan.png';
})();

// ── POHON ENERGI IMAGE ──
let fvPohonImg = null;
(function(){
    fvPohonImg = new Image();
    fvPohonImg.src = 'images/pohonperi.png';
})();

// ── HUNIAN TIER IMAGES: omah-tier1.png, omah-tier2.png, omah-tier3.png ──
const FV_OMAH_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/omah-tier' + t + '.png';
        FV_OMAH_IMAGES[t] = img;
    });
})();

// ── SENDANG TIER IMAGES: sendang-tier1.png, sendang-tier2.png, sendang-tier3.png ──
const FV_SENDANG_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/sendang-tier' + t + '.png';
        FV_SENDANG_IMAGES[t] = img;
    });
})();

// ── TAMAN TIER IMAGES: taman-tier1.png, taman-tier2.png, taman-tier3.png ──
const FV_TAMAN_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/taman-tier' + t + '.png';
        FV_TAMAN_IMAGES[t] = img;
    });
})();

// ── SEKOLAH TIER IMAGES: sekolah-tier1.png, sekolah-tier2.png, sekolah-tier3.png ──
const FV_SEKOLAH_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/sekolah-tier' + t + '.png';
        FV_SEKOLAH_IMAGES[t] = img;
    });
})();

// ── PASAR TIER IMAGES: pasar-tier1.png, pasar-tier2.png, pasar-tier3.png ──
const FV_PASAR_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/pasar-tier' + t + '.png';
        FV_PASAR_IMAGES[t] = img;
    });
})();

// ── MENARA TIER IMAGES: menara-tier1.png, menara-tier2.png, menara-tier3.png ──
const FV_MENARA_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/menara-tier' + t + '.png';
        FV_MENARA_IMAGES[t] = img;
    });
})();

// ── ISTANA IMAGE: istanaperi.png ──
const FV_ISTANA_IMAGES = {};
(function(){
    const img = new Image();
    img.onerror = function() { console.warn('istanaperi.png gagal load — cek path images/istanaperi.png'); };
    img.src = 'images/istanaperi.png';
    FV_ISTANA_IMAGES[1] = img;
})();

// ── KAHYANGAN: Siang/Malam & Musim ─────────────────────────────
function getFVTimeOfDay() {
    // Sinkron dengan STATE.time dunia manusia (0–2400)
    const t = (typeof STATE !== 'undefined' && STATE.time !== undefined) ? STATE.time : -1;
    if (t >= 0) {
        if (t >= 500  && t < 1200) return 'pagi';
        if (t >= 1200 && t < 1500) return 'siang';
        if (t >= 1500 && t < 1800) return 'sore';
        if (t >= 1800 && t < 2000) return 'senja';
        return 'malam';
    }
    // fallback jam nyata jika STATE belum siap
    const h = new Date().getHours();
    if (h >= 5 && h < 12)  return 'pagi';
    if (h >= 12 && h < 15) return 'siang';
    if (h >= 15 && h < 18) return 'sore';
    if (h >= 18 && h < 20) return 'senja';
    return 'malam';
}
function isFVNight() {
    return getFVTimeOfDay() === 'malam';
}
function getFVSeason() {
    // Sinkron dengan STATE.season dunia manusia
    const s = (typeof STATE !== 'undefined') ? (STATE.season || 'spring') : 'spring';
    if (s === 'spring') return { id:'semi',    label:'Musim Semi 🌸',   color:'#f9a8d4' };
    if (s === 'summer') return { id:'panas',   label:'Musim Panas ☀️',  color:'#fde68a' };
    if (s === 'autumn') return { id:'gugur',   label:'Musim Gugur 🍂',  color:'#fb923c' };
    return                     { id:'dingin',  label:'Musim Dingin ❄️', color:'#bae6fd' };
}

// ── KAHYANGAN: Partikel Musim — sinkron STATE.season ──────────
let _fvSeasonParts = [];
function _initFVSeasonParts(W, H, count) {
    if (_fvSeasonParts.length >= count) return;
    while (_fvSeasonParts.length < count) {
        _fvSeasonParts.push({
            x: Math.random() * W,
            y: Math.random() * H - H,
            vx: (Math.random() - 0.5) * 0.6,
            vy: 0.4 + Math.random() * 0.8,
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.04,
            size: 3 + Math.random() * 5,
            alpha: 0.5 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
        });
    }
}
function drawFVSeasonParticles(ctx, W, H, t, season) {
    const sid = season ? season.id : 'semi';
    // Reset partikel jika musim berubah
    if (drawFVSeasonParticles._lastSeason !== sid) {
        _fvSeasonParts = [];
        drawFVSeasonParticles._lastSeason = sid;
    }

    const COUNT = 28;
    _initFVSeasonParts(W, H, COUNT);

    ctx.save();
    ctx.translate(-Math.floor(fvCam.x), -Math.floor(fvCam.y));

    _fvSeasonParts.forEach(p => {
        // Update posisi
        p.x  += p.vx + Math.sin(t/1800 + p.phase) * 0.4;
        p.y  += p.vy;
        p.rot += p.rotV;
        if (p.y > FH*TS + 20) { p.y = -10; p.x = Math.random() * FW*TS; }
        if (p.x < 0) p.x = FW*TS;
        if (p.x > FW*TS) p.x = 0;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha * 0.75;

        if (sid === 'semi') {
            // Kelopak sakura — pink lembut
            ctx.fillStyle = '#f9a8d4';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size*0.55, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#fce7f3';
            ctx.beginPath();
            ctx.ellipse(0, -p.size*0.2, p.size*0.5, p.size*0.3, 0, 0, Math.PI*2);
            ctx.fill();
        } else if (sid === 'panas') {
            // Serbuk cahaya / pollen — kuning berkilau
            const pulse = 0.5 + 0.5*Math.sin(t/400 + p.phase);
            ctx.globalAlpha = p.alpha * 0.6 * pulse;
            const grd = ctx.createRadialGradient(0,0,0, 0,0,p.size);
            grd.addColorStop(0, '#fef08a');
            grd.addColorStop(1, 'rgba(253,224,71,0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI*2);
            ctx.fill();
        } else if (sid === 'gugur') {
            // Daun gugur — oranye/merah/coklat
            const leafColors = ['#fb923c','#ef4444','#a16207','#dc2626','#f97316'];
            ctx.fillStyle = leafColors[Math.floor(p.phase*3) % leafColors.length];
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size*0.7, p.size, p.rot*0.5, 0, Math.PI*2);
            ctx.fill();
            // Tulang daun
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size);
            ctx.stroke();
        } else if (sid === 'dingin') {
            // Butir salju — biru-putih lembut
            ctx.fillStyle = '#e0f2fe';
            ctx.strokeStyle = '#bae6fd';
            ctx.lineWidth = 0.5;
            // Kristal salju sederhana
            for (let a=0; a<6; a++) {
                ctx.save();
                ctx.rotate(a * Math.PI/3);
                ctx.beginPath();
                ctx.moveTo(0,0); ctx.lineTo(0, -p.size*1.1);
                ctx.stroke();
                ctx.restore();
            }
            ctx.beginPath();
            ctx.arc(0, 0, p.size*0.3, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    });
    ctx.restore();
}

// ── KAHYANGAN: Kunang-kunang (Fireflies) ────────────────────────
let fvFireflies = [];
function initFVFireflies(W, H) {
    if (fvFireflies.length > 0) return;
    for (let i = 0; i < 35; i++) {
        fvFireflies.push({
            x: Math.random() * (FW * TS),
            y: Math.random() * (FH * TS),
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.6,
        });
    }
}
function updateFVFireflies() {
    fvFireflies.forEach(f => {
        f.x += f.vx + Math.sin(performance.now()/2000 + f.phase) * 0.3;
        f.y += f.vy + Math.cos(performance.now()/1800 + f.phase) * 0.25;
        if (f.x < 0) f.x = FW * TS;
        if (f.x > FW * TS) f.x = 0;
        if (f.y < 0) f.y = FH * TS;
        if (f.y > FH * TS) f.y = 0;
    });
}
function drawFVFireflies(ctx, t) {
    fvFireflies.forEach((f, i) => {
        const pulse = 0.4 + 0.6 * Math.sin(t / 600 + f.phase);
        const r = 2 + pulse * 1.5;
        ctx.save();
        ctx.globalAlpha = pulse * 0.85;
        // Glow
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r * 3);
        grd.addColorStop(0, 'rgba(200,255,120,0.9)');
        grd.addColorStop(1, 'rgba(200,255,120,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
        // Titik inti
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#d9f99d';
        ctx.beginPath();
        ctx.arc(f.x, f.y, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// ── HELPER DATA ────────────────────────────────────────────────
function getFairyVillage() {
    if (!STATE.player.fairyVillage) {
        STATE.player.fairyVillage = {
            resources:    { debu:50, kristal:5, cahaya:1, makanan:30 }, // starter
            buildings:    [],
            buildQueue:   [],
            fairies:      [],
            lastTickDay:  STATE.day,
            lastCollectDay: -1,
            tutorialDone: false,
            fvTutorialDone: false, // FIX: flag yang dicek openFairyVillage
            isFirstVisit: true,    // FIX: flag kunjungan pertama untuk resource reset
        };
    }
    const fv = STATE.player.fairyVillage;
    if (!fv.buildQueue) fv.buildQueue = [];
    if (fv.resources.makanan === undefined) fv.resources.makanan = 20;
    // Migrate: pastikan fvTutorialDone ada (save lama hanya punya tutorialDone)
    if (fv.fvTutorialDone === undefined) fv.fvTutorialDone = false;
    // Migrate: isFirstVisit untuk save lama — anggap sudah pernah kunjung jika ada bangunan
    if (fv.isFirstVisit === undefined) {
        fv.isFirstVisit = !(fv.buildings && fv.buildings.length > 0);
    }
    // Migrate save lama yang masih kosong semua → kasih starter resource
    const r = fv.resources;
    if (!r.debu && !r.kristal && !r.cahaya && !(fv.buildings||[]).length && !(fv.buildQueue||[]).length) {
        fv.resources = { debu:50, kristal:5, cahaya:1, makanan:30 };
    }
    // Migrate peri stats
    (fv.fairies||[]).forEach(f => {
        if (f.intel   === undefined) f.intel   = _fairyStat();
        if (f.agility === undefined) f.agility = _fairyStat();
        if (f.spirit  === undefined) f.spirit  = _fairyStat();
        if (f.hp      === undefined) f.hp      = 80 + Math.floor(Math.random()*20);
        if (f.maxHp   === undefined) f.maxHp   = f.hp;
        if (f.mood    === undefined) f.mood    = 'happy';
    });
    // Migrate buildings — tambah workers []
    (fv.buildings||[]).forEach(b => { if (!b.workers) b.workers = []; });
    return fv;
}
function _fairyStat() { return 10 + Math.floor(Math.random()*20); }

// ── POPUP KELAHIRAN PERI ──────────────────────────────────────────
function showFairyBirthPopup(fairy, buildingName) {
    // Hapus popup sebelumnya jika ada
    const old = document.getElementById('fairy-birth-popup');
    if (old) old.remove();

    const img = fairy.gender === 'girl'
        ? `images/peri_pr${(fairy.spriteIdx||0) % 4 + 1}.png`
        : `images/peri_lk${(fairy.spriteIdx||0) % 2 + 1}.png`;

    const statBar = (val, color) => {
        const pct = Math.round(val/30*100);
        return `<div style="flex:1;height:7px;background:rgba(161,98,7,.15);border-radius:99px;overflow:hidden;border:1px solid rgba(161,98,7,.2)">
            <div style="width:${pct}%;height:100%;background:${color};border-radius:99px;transition:width .4s"></div>
        </div>`;
    };

    const rarity = fairy.intel+fairy.agility+fairy.spirit;
    const rarityLabel = rarity >= 70 ? '⭐ LANGKA!'
                      : rarity >= 50 ? '✨ Bagus'
                      : '🌱 Biasa';
    const rarityColor = rarity >= 70 ? '#d97706' : rarity >= 50 ? '#059669' : '#6b7280';

    const genderLabel = fairy.gender==='girl' ? '🧚‍♀️ Widadari' : '🧚‍♂️ Peri Laki';
    const bname = buildingName.replace(/^[^\s]+\s/,'');

    const el = document.createElement('div');
    el.id = 'fairy-birth-popup';
    el.innerHTML = `
        <div id="fbp-overlay"></div>
        <div id="fbp-scroll-wrap">
            <div id="fbp-card">
                <div id="fbp-sparkle">🌟 ✨ 🌟</div>
                <div id="fbp-title">🥚 Peri Baru Lahir!</div>
                <div id="fbp-sub">dari ${genderLabel} di ${bname}</div>

                <img id="fbp-img"
                    src="${img}"
                    onerror="this.src='images/${fairy.gender==='girl'?'wening':'juna'}.png'"
                    alt="peri baru">

                <div style="display:flex;align-items:center;gap:8px;width:100%">
                    <span style="font-size:11px;font-weight:800;color:${rarityColor};background:${rarityColor}18;border:1.5px solid ${rarityColor}55;border-radius:20px;padding:2px 10px">${rarityLabel}</span>
                    <span style="font-size:11px;color:#a16207;font-weight:600">Total Stat: ${rarity}/90</span>
                </div>

                <div id="fbp-stats">
                    <div class="fbp-stat">
                        <span>🧠 Intel</span>
                        ${statBar(fairy.intel,'#60a5fa')}
                        <span class="fbp-val">${fairy.intel}</span>
                    </div>
                    <div class="fbp-stat">
                        <span>⚡ Gesit</span>
                        ${statBar(fairy.agility,'#fbbf24')}
                        <span class="fbp-val">${fairy.agility}</span>
                    </div>
                    <div class="fbp-stat">
                        <span>🌟 Semangat</span>
                        ${statBar(fairy.spirit,'#f472b6')}
                        <span class="fbp-val">${fairy.spirit}</span>
                    </div>
                </div>

                <div style="width:100%">
                    <div id="fbp-name-label">✏️ Beri Nama:</div>
                    <div id="fbp-name-row">
                        <input id="fbp-name-input" type="text" value="${fairy.name}" maxlength="20" placeholder="Nama peri...">
                    </div>
                    <div style="font-size:10px;color:#a16207;text-align:center;margin-top:3px">Nama bisa diubah lagi nanti dari menu Para Peri</div>
                </div>

                <div id="fbp-btns">
                    <button id="fbp-btn-ok" onclick="confirmFairyBirth('${fairy.id}')">💖 Sambut ke Kahyangan!</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(el);

    // Animasi masuk
    requestAnimationFrame(() => {
        el.querySelector('#fbp-card').classList.add('fbp-in');
        // Partikel kelahiran di peta
        if (typeof createFVParticles === 'function' && typeof fvPlayer !== 'undefined') {
            createFVParticles(fvPlayer.x - (fvCam?.x||0), fvPlayer.y - (fvCam?.y||0), 20);
        }
    });
}

function confirmFairyBirth(fairyId) {
    const fv = getFairyVillage();
    const fairy = fv.fairies.find(f => f.id === fairyId);
    if (fairy) {
        const inp = document.getElementById('fbp-name-input');
        if (inp && inp.value.trim()) {
            fairy.name = inp.value.trim().slice(0,20);
        }
    }
    closeFairyBirthPopup();
    showToast(`🧚 ${fairy ? fairy.name : 'Peri'} telah disambut ke Kahyangan Wilis!`);
    if (typeof _khRenderPeri === 'function') _khRenderPeri(_khIdx || 0);
}

function closeFairyBirthPopup() {
    const el = document.getElementById('fairy-birth-popup');
    if (el) {
        el.querySelector('#fbp-card').classList.remove('fbp-in');
        setTimeout(() => el.remove(), 250);
    }
}

// ═══════════════════════════════════════════════════════════════
