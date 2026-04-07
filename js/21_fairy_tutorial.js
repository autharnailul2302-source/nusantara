// ========================================================
// js/21_fairy_tutorial.js
// Fairy Village Tutorial
// ========================================================

// ═══════════════════════════════════════════════════════════════
// FAIRY VILLAGE TUTORIAL — Tampil sekali saat pertama masuk
// ═══════════════════════════════════════════════════════════════
const FV_TUTORIAL_STEPS = [
    {
        icon: '✨',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Selamat Datang di Kahyangan Wilis!',
        text: `Aku <b>Rara Wilis</b>, ratu Widadari penjaga tanah Wilis.\n\nDahulu, tempat ini dipenuhi ribuan Widadari yang menjaga keseimbangan alam. Kini hanya tersisa <b>puing-puing</b> dan sebuah Pohon Energi yang hampir padam.\n\n<b>Tugas kamu:</b> Membangun kembali Kahyangan Wilis menjadi desa peri yang makmur! 🌿`,
        highlight: null,
    },
    {
        icon: '🏠',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Apa Itu Kahyangan Wilis?',
        text: `Kahyangan Wilis adalah <b>dunia peri</b> milikmu yang bisa kamu kembangkan.\n\nDi sini kamu bisa:\n• 🏗️ <b>Membangun</b> berbagai bangunan peri\n• 🧚 <b>Merawat</b> para Widadari\n• ✨ <b>Mengumpulkan</b> Serbuk Wilis setiap hari\n• 🥚 <b>Mendapat</b> peri baru yang lahir dari hunian\n\nSemakin berkembang desamu, semakin kuat pengaruhmu di Nusantara Arsa!`,
        highlight: null,
        statsBlock: [
            { icon:'✨', color:'#fde68a', name:'Serbuk Wilis', desc:'Mata uang utama. Kumpulkan dari Pohon Energi & bangunan.' },
            { icon:'💎', color:'#60a5fa', name:'Kristal Brantas', desc:'Langka. Untuk bangunan tier tinggi.' },
            { icon:'🌟', color:'#e879f9', name:'Cahaya Wilis', desc:'Energi spiritual. Dihasilkan dari meditasi peri.' },
            { icon:'🍽️', color:'#4ade80', name:'Makanan', desc:'Peri lapar = sedih. Pastikan stok cukup!' },
        ],
    },
    {
        icon: '🧠',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Stat Para Widadari',
        text: `Setiap Widadari punya <b>3 stat utama</b> yang menentukan kemampuannya:\n\n<span class="tut-tag" style="color:#60a5fa;border-color:#60a5fa">🧠 Intelijen</span> Menentukan kecepatan konstruksi bangunan. Intel tinggi = bangun lebih cepat!\n\n<span class="tut-tag" style="color:#fbbf24;border-color:#fbbf24">⚡ Ketangkasan</span> Luas jelajah di dunia Wilis. Gesit = bisa eksplorasi lebih jauh.\n\n<span class="tut-tag" style="color:#e879f9;border-color:#e879f9">🌟 Semangat</span> Produksi Serbuk Wilis. Semangat tinggi = serbuk ×2!`,
        highlight: null,
    },
    {
        icon: '🏗️',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Cara Membangun',
        text: `Untuk membangun, <b>dekati aku</b> lalu tekan tombol 💬 yang muncul.\n\nPilih <b>"Perintah Bangun"</b> untuk membuka katalog bangunan.\n\nSetiap bangunan butuh <b>waktu & sumber daya</b>:\n• Tier 1 (🟢) → paling mudah, butuh Serbuk Wilis\n• Tier 2 (🔵) → lebih kuat, butuh Kristal\n• Tier 3+ (🟣🟠🟡) → legendaris, syarat kompleks\n\nKamu bisa <b>upgrade</b> bangunan yang sudah ada untuk bonus lebih besar!`,
        highlight: null,
    },
    {
        icon: '🌳',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Pohon Energi — Sumber Kehidupan',
        text: `Di <b>selatan peta</b> ada Pohon Energi yang bercahaya hijau 🌳\n\nSekali per hari, kamu bisa mengumpulkan <b>Serbuk Wilis</b> dari pohon ini.\n\n💡 <b>Bonus serbuk</b> tergantung:\n• Jumlah Widadari yang tinggal\n• Banyaknya bangunan yang aktif\n\nJangan lupa kumpulkan setiap hari! Serbuk adalah kunci semua pembangunan.`,
        highlight: null,
    },
    {
        icon: '🥚',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Kelahiran Peri Baru!',
        text: `Bangunan <b>hunian</b> seperti Padepokan Cilik memiliki kemungkinan <b>melahirkan peri baru</b> setiap hari.\n\n🎉 Saat peri lahir:\n• Kamu akan melihat <b>popup kelahiran</b> dengan sprite unik\n• Setiap peri punya <b>stat acak</b> — bisa lemah, bisa kuat!\n• Kamu bisa <b>memberi nama</b> sebelum menyambutnya\n\n♀️ Peri perempuan: 4 tampilan berbeda\n♂️ Peri laki: 2 tampilan berbeda\n\nPeri yang lahir bisa <b>diganti namanya kapan saja</b> dari menu Para Peri.`,
        highlight: null,
    },
    {
        icon: '🧚',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Merawat Para Widadari',
        text: `Buka menu <b>Para Peri</b> untuk melihat semua Widadari-mu.\n\nDari sana kamu bisa:\n• 🍽️ <b>Beri Makan</b> agar peri tetap bahagia\n• ✏️ <b>Ganti Nama</b> peri yang lahir\n• 📊 Lihat detail <b>stat & mood</b> setiap peri\n• 👷 <b>Tugaskan</b> peri ke bangunan sebagai pekerja\n\n⚠️ Jika stok <b>makanan habis</b>, peri mulai lapar → sedih → malas bekerja.\nBeli makanan dengan Serbuk Wilis di menu yang sama!`,
        highlight: null,
    },
    {
        icon: '🗺️',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Siap Membangun Kahyangan!',
        text: `Kamu sudah siap memulai petualangan di Kahyangan Wilis! 🌟\n\n<b>Langkah pertama:</b>\n1. 🌳 Jalan ke <b>Pohon Energi</b> di selatan peta\n2. ✨ Kumpulkan <b>Serbuk Wilis</b> pertamamu\n3. 🤝 Kembali ke <b>aku (Rara Wilis)</b> di utara\n4. 🏗️ Pilih <b>"Perintah Bangun"</b> dan dirikan bangunan pertama!\n\nMinimap di pojok kanan atas membantumu navigasi 🗺️\n\n<b>Selamat membangun, Penjaga Wilis!</b> ✨`,
        highlight: null,
        isLast: true,
    },
];

let _fvTutStep = 0;

function startFairyVillageTutorial() {
    _fvTutStep = 0;
    const el = document.getElementById('fv-tutorial');
    if (el) el.classList.add('active');
    _fvTutRender();
}

function fvTutSkip() {
    _fvTutClose();
    getFairyVillage().fvTutorialDone = true;
    showToast('📖 Tutorial dilewati. Bicara ke Rara Wilis jika butuh panduan!');
}

function fvTutGo(dir) {
    const total = FV_TUTORIAL_STEPS.length;
    _fvTutClearHL();
    _fvTutStep = Math.max(0, Math.min(total - 1, _fvTutStep + dir));
    if (dir > 0 && _fvTutStep === total - 1 && FV_TUTORIAL_STEPS[_fvTutStep].isLast) {
        // On last step, next button becomes "Mulai!"
    }
    if (dir > 0 && _fvTutStep >= total) {
        _fvTutFinish(); return;
    }
    _fvTutRender();
}

function _fvTutRender() {
    const total = FV_TUTORIAL_STEPS.length;
    const step  = FV_TUTORIAL_STEPS[_fvTutStep];
    if (!step) return;

    // Avatar
    const av = document.getElementById('fv-tut-avatar');
    if (av) { av.src = step.avatar || 'images/rarawilis.png'; av.style.display = step.avatar ? '' : 'none'; }

    // Speaker & badge
    const sp = document.getElementById('fv-tut-speaker');
    if (sp) sp.textContent = step.speaker || 'RARA WILIS';
    const bd = document.getElementById('fv-tut-step-badge');
    if (bd) bd.textContent = `Panduan ${_fvTutStep + 1} / ${total}`;

    // Icon
    const ic = document.getElementById('fv-tut-icon');
    if (ic) ic.textContent = step.icon || '✨';

    // Title
    const ti = document.getElementById('fv-tut-title');
    if (ti) ti.textContent = step.title;

    // Text (HTML with <b> and .tut-tag)
    const tx = document.getElementById('fv-tut-text');
    if (tx) {
        let html = (step.text || '').replace(/\n/g, '<br>');
        // Resource/stat block
        if (step.statsBlock) {
            html += '<div class="fv-tut-stats">';
            step.statsBlock.forEach(s => {
                html += `<div class="fv-tut-stat-card">
                    <div class="fv-sc-label">${s.icon}</div>
                    <div class="fv-sc-name" style="color:${s.color}">${s.name}</div>
                    <div class="fv-sc-desc">${s.desc}</div>
                </div>`;
            });
            html += '</div>';
        }
        tx.innerHTML = html;
    }

    // Dots
    const dots = document.getElementById('fv-tut-dots');
    if (dots) {
        dots.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const d = document.createElement('div');
            d.className = 'fv-tut-dot' + (i === _fvTutStep ? ' on' : '');
            dots.appendChild(d);
        }
    }

    // Buttons
    const prev = document.getElementById('fv-tut-prev');
    const next = document.getElementById('fv-tut-next');
    if (prev) prev.disabled = (_fvTutStep === 0);
    if (next) {
        const isLast = _fvTutStep === total - 1;
        next.textContent = isLast ? '🌟 Mulai!' : 'Lanjut ▶';
        next.onclick = isLast ? _fvTutFinish : () => fvTutGo(1);
    }

    // Highlight
    _fvTutClearHL();
    if (step.highlight) {
        setTimeout(() => _fvTutHighlight(step.highlight, step.hlLabel), 200);
    } else {
        _fvTutHidePointer();
    }
}

function _fvTutHighlight(elementId, label) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.add('fv-tut-hl');
    const ptr  = document.getElementById('fv-tut-pointer');
    const pLbl = document.getElementById('fv-tut-ptr-label');
    if (!ptr) return;
    if (pLbl) pLbl.textContent = label || 'LIHAT INI';
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    ptr.style.display = 'flex';
    ptr.style.left = (cx - 35) + 'px';
    ptr.style.top  = (cy + rect.height / 2 + 8) + 'px';
}

function _fvTutClearHL() {
    document.querySelectorAll('.fv-tut-hl').forEach(e => e.classList.remove('fv-tut-hl'));
    _fvTutHidePointer();
}
function _fvTutHidePointer() {
    const p = document.getElementById('fv-tut-pointer');
    if (p) p.style.display = 'none';
}

function _fvTutClose() {
    _fvTutClearHL();
    const el = document.getElementById('fv-tutorial');
    if (el) el.classList.remove('active');
}

function _fvTutFinish() {
    _fvTutClose();
    getFairyVillage().fvTutorialDone = true;
    showToast('🌟 Tutorial selesai! Selamat membangun Kahyangan Wilis!');
    // Kasih hint awal
    setTimeout(() => {
        showFVDialog('RARA WILIS',
            '✨ Mulailah dengan jalan ke Pohon Energi di selatan untuk mengumpulkan Serbuk Wilis pertamamu!\n\n🗺️ Gunakan minimap di pojok kanan atas untuk navigasi.',
            [{text:'Siap, Rara!', action:()=>{ if(typeof closeDialogue==='function') closeDialogue(); }}],
            'images/rarawilis.png'
        );
    }, 500);
}

function getFairyVillageStats(fv) {
    let totalCap=0, totalDust=0, totalHappy=0, totalFood=0, dustMult=1, xpMult=1, intelBonus=0;
    (fv.buildings||[]).forEach(({bid, workers}) => {
        const b = FAIRY_BUILDINGS[bid]; if (!b) return;
        if (b.maxFairies)     totalCap    += b.maxFairies;
        if (b.happinessBonus) totalHappy  += b.happinessBonus;
        if (b.dustMultiplier) dustMult     = Math.max(dustMult, b.dustMultiplier);
        if (b.xpBonus)        xpMult       = Math.max(xpMult, b.xpBonus);
        if (b.intelBonus)     intelBonus  += b.intelBonus;

        // Worker bonus berdasarkan semangat peri
        const wk = workers || [];
        const maxW = b.maxWorkers || 2;
        const activeWk = wk.slice(0, maxW);
        let workerBonus = 1;
        if (activeWk.length > 0) {
            const avgSp = activeWk.reduce((s,id) => {
                const f = (fv.fairies||[]).find(x=>x.id===id);
                return s + (f?.spirit||10);
            }, 0) / activeWk.length;
            // Tier 3 = 3 worker bisa dapat bonus lebih tinggi
            const maxBonus = maxW >= 3 ? 2.5 : 2;
            workerBonus = avgSp >= 28 ? maxBonus : avgSp >= 20 ? 2 : avgSp >= 15 ? 1.5 : avgSp >= 10 ? 1.25 : 1;
        }

        if (b.dustPerDay)  totalDust += b.dustPerDay * workerBonus;
        if (b.foodPerDay)  totalFood += b.foodPerDay * workerBonus;
    });
    return {
        totalCap:    Math.max(1, totalCap),
        totalDust:   Math.round(totalDust * dustMult),
        totalHappy:  Math.min(100, totalHappy),
        totalFood:   Math.round(totalFood),
        xpMult,
        intelBonus,
    };
}

function fairyDailyTick(fv) {
    const curDay = STATE.day;
    if (fv.lastTickDay === curDay) return;
    fv.lastTickDay = curDay;
    const stats = getFairyVillageStats(fv);

    // ── Produksi Debu Peri ─────────────────────────────────────────
    if (stats.totalDust > 0) {
        fv.resources.debu = (fv.resources.debu||0) + stats.totalDust;
        showToast(`✨ +${stats.totalDust} Debu Peri dari bangunan!`);
    }

    // ── Produksi Makanan dari Taman (sudah dihitung di stats.totalFood) ──
    if (stats.totalFood > 0) {
        fv.resources.makanan = (fv.resources.makanan||0) + stats.totalFood;
    }

    // ── Sistem Makanan: tiap peri makan 1/hari ─────────────────────
    const totalFairies = fv.fairies.length;
    const foodAvail = fv.resources.makanan || 0;
    if (foodAvail >= totalFairies) {
        fv.resources.makanan = foodAvail - totalFairies;
        fv.fairies.forEach(f => {
            f.happiness = Math.min(100, (f.happiness||80) + Math.floor(stats.totalHappy/10) + 5);
            f.mood = f.happiness >= 70 ? 'happy' : f.happiness >= 40 ? 'neutral' : 'sad';
        });
    } else {
        let remaining = foodAvail;
        fv.resources.makanan = 0;
        fv.fairies.forEach(f => {
            if (remaining > 0) { remaining--; f.happiness = Math.min(100,(f.happiness||80)+2); }
            else { f.happiness = Math.max(0,(f.happiness||80)-15); }
            f.mood = f.happiness>=70?'happy':f.happiness>=40?'neutral':f.happiness>=20?'sad':'bad_mood';
        });
        if (totalFairies > 0) showToast('⚠️ Stok makanan habis! Peri-peri mulai lapar...');
    }

    // ── Intel bonus dari Akademi ───────────────────────────────────
    if (stats.intelBonus > 0) {
        fv.fairies.forEach(f => {
            f.intel = Math.min(30, (f.intel||10) + stats.intelBonus);
        });
    }

    // ── Kelahiran peri baru dari hunian ────────────────────────────
    (fv.buildings||[]).forEach(({bid}) => {
        const b = FAIRY_BUILDINGS[bid];
        if (b?.birthChance && Math.random() < b.birthChance && fv.fairies.length < stats.totalCap) {
            const g = Math.random() < 0.6 ? 'girl' : 'boy';
            const names = g==='girl' ? FAIRY_NAMES_GIRL : FAIRY_NAMES_BOY;
            const spriteCount = g === 'girl' ? 4 : 2;
            const spriteIdx = Math.floor(Math.random() * spriteCount);
            const defaultName = names[Math.floor(Math.random()*names.length)];
            // FIX: ganti nama 'stats' menjadi 'newFairyStats' agar tidak shadow outer 'stats'
            const newFairyStats = {
                intel:_fairyStat(), agility:_fairyStat(), spirit:_fairyStat(),
                hp:80+Math.floor(Math.random()*20)
            };
            const newFairy = {
                id: 'f_'+Date.now()+'_'+Math.floor(Math.random()*9999),
                name: defaultName,
                gender:g, level:1, xp:0, happiness:80, mood:'happy',
                intel:newFairyStats.intel, agility:newFairyStats.agility, spirit:newFairyStats.spirit,
                hp:newFairyStats.hp, maxHp:100,
                spriteIdx: spriteIdx,
                isBorn: true,
            };
            fv.fairies.push(newFairy);
            // Tampilkan popup kelahiran dengan opsi ganti nama
            setTimeout(() => showFairyBirthPopup(newFairy, FAIRY_BUILDINGS[bid]?.name||'bangunan'), 300);
        }
    });
}

// ── OPEN / CLOSE ───────────────────────────────────────────────

