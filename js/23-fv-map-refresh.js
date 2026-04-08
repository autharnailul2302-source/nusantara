// ══════════════════════════════════════════════════════════════
// Refresh + Init Fairy Village Map
// File: js/23-fv-map-refresh.js
// ══════════════════════════════════════════════════════════════
// REFRESH FAIRY VILLAGE MAP — Perbarui bangunan solid di maps
// ═══════════════════════════════════════════════════════════════
function refreshFairyVillageMap() {
    if (!maps['fairyVillage']) return;
    const fv = getFairyVillage();

    // FIX: Gunakan posisi yang benar dari FV_RARA_POS dan FV_POHON_POS
    // Sebelumnya pakai x:113, y:4 yang SALAH BESAR (di luar peta FW=60!)
    const buildings = [
        {
            id: 'pohon_energi_bld',
            x: FV_POHON_POS.x, y: FV_POHON_POS.y,
            w: 3, h: 3,
            solid: true,
            type: 'fv_building',
            name: 'Pohon Energi'
        },
        {
            // Istana Peri — landmark permanen, solid, punya pintu masuk
            id: 'fv_istana_bld',
            x: FV_ISTANA_POS.x, y: FV_ISTANA_POS.y,
            w: 3, h: 3,
            solid: true,
            type: 'fv_building',
            name: '🏰 Puri Agung Wilis',
            _fvEmoji: '🏰',
            _fvTier: 4,
            _fvBid: 'istana_mini',
            _fvSlotId: 'istana_fixed',
            // Pintu di tengah bawah bangunan
            entrance: { x: FV_ISTANA_POS.x + 1, y: FV_ISTANA_POS.y + 3 },
            open24h: true,
        },
    ];

    // Tambahkan bangunan yang sudah selesai dibangun
    (fv.buildings || []).forEach(b => {
        const slot = FAIRY_SLOTS.find(s => s.id === b.slotId);
        if (!slot) return;
        const bDef = (typeof FAIRY_BUILDINGS !== 'undefined') ? FAIRY_BUILDINGS[b.bid] : null;
        const bw = (bDef && bDef.w) || 2;
        const bh = (bDef && bDef.h) || 2;
        // Entrance di tengah bawah bangunan (seperti map utama)
        const entranceX = slot.x + Math.floor(bw/2);
        const entranceY = slot.y + bh;
        buildings.push({
            id: 'fv_bld_' + b.slotId,
            x: slot.x, y: slot.y,
            w: bw, h: bh,
            solid: true,
            type: 'fv_building',
            name: (bDef && bDef.name) || 'Bangunan',
            _fvEmoji: (bDef && bDef.emoji) || '🏠',
            _fvTier: (bDef && bDef.tier) || 0,
            _fvBid: b.bid,
            _fvSlotId: b.slotId,
            // Entrance trigger — player bisa masuk dari depan pintu
            entrance: { x: entranceX, y: entranceY },
            open24h: true,
        });
    });

    maps['fairyVillage'].buildings = buildings;

    // FIX: Tambahkan NPC trigger Istana Peri jika belum ada
    // NPC ini yang memunculkan dialog "Kelola Kahyangan" saat player mendekati istana
    const _istanaExists = maps['fairyVillage'].npcs.some(n => n.id === 'fv_istana_npc');
    if (!_istanaExists) {
        maps['fairyVillage'].npcs.push({
            id: 'fv_istana_npc',
            name: '🏰 Puri Agung Wilis',
            x: FV_ISTANA_POS.x + 1,
            y: FV_ISTANA_POS.y + 2,
            w: 1, h: 1,
            sprite: '', imgSrc: '',
            noNameTag: true,
            noRender: true,        // jangan digambar — sudah ada gambar istana di drawFairyWorld
            schedule: 'always',
            type: 'fairy_npc',
            dialogFn: 'openIstanaDialog'
        });
    }

    // Update NPC
    maps['fairyVillage'].npcs.forEach(n => {
        n.imgSrc = n.sprite || n.imgSrc;
        n.schedule = 'always';
        n.w = n.w || 38;
        n.h = n.h || 58;
        if (n.id === 'rara_wilis') {
            n.type = 'fairy_npc';
            n.dialogFn = 'openRaraWilisDialog';
        }
        if (n.id === 'pohon_energi') {
            n.dialogFn = 'collectFairyDust';
        }
        if (['fv_wening','fv_sekar','fv_bening','fv_juna'].includes(n.id)) {
            n.type = n.type || 'wander';
            n.dialogFn = 'openFairyNPCDialog_' + n.id;
        }
        // FIX: Istana Peri trigger NPC — selalu set dialogFn
        if (n.id === 'fv_istana_npc') {
            n.type = 'fairy_npc';
            n.dialogFn = 'openIstanaDialog';
            n.noRender = true;
            n.noNameTag = true;
        }
    });
}

function openFairyVillage() {
    if (!STATE.player.sylvariaQuestComplete) {
        showToast('Selesaikan Quest Kahyangan Wilis dulu!'); return;
    }
    const fv = getFairyVillage();

    // FIX: Reset resource ke starter untuk kunjungan pertama
    // Dilakukan SEBELUM fairyDailyTick agar tidak ter-override
    if (fv.isFirstVisit) {
        fv.resources = { debu:50, kristal:5, cahaya:1, makanan:30 };
        fv.isFirstVisit = false;
        showToast('✨ Selamat datang di Kahyangan Wilis! Kamu mendapat sumber daya awal!');
    }

    // FIX: Hanya jalankan daily tick jika BUKAN kunjungan pertama
    // agar tidak ada popup kelahiran peri yang bentrok dengan tutorial
    if (!fv.fvTutorialDone) {
        // Skip daily tick saat tutorial agar tidak ada interupsi
        fv.lastTickDay = STATE.day; // mark hari ini agar tick tidak jalan
    } else {
        fairyDailyTick(fv);
    }

    // Simpan lokasi & posisi sebelumnya
    window._fvPrevLocation = STATE.location;
    window._fvPrevX = STATE.player.x;
    window._fvPrevY = STATE.player.y;

    // Refresh map peri (bangunan dinamis)
    refreshFairyVillageMap();
    // Reset NPC runtime positions agar fresh
    fvNpcRuntime = {};
    fvSpriteCache['__player__'] = null; // force re-cache player sprite

    // Pindah ke peta peri menggunakan sistem location utama
    STATE.location = 'fairyVillage';
    STATE.screen = 'play';

    // Spawn player di dekat Rara Wilis (tengah peta)
    STATE.player.x = FV_RARA_POS ? (FV_RARA_POS.x + 3) * TS : 140;
    STATE.player.y = FV_RARA_POS ? (FV_RARA_POS.y + 3) * TS : 140;

    // Sembunyikan modal lama (jika masih ada)
    const oldModal = document.getElementById('fairy-village-modal');
    if (oldModal) oldModal.style.display = 'none';

    // Pastikan sprite player ter-load
    if (!STATE.player.spriteIdle) selectGender(STATE.player.gender || 'boy', true);
    // Pastikan tidak ada guard prologue yang memblokir
    STATE.isPrologue = false;
    STATE.screen = 'play';
    // Tutup dialogue jika ada
    const _dw = document.getElementById('dialogue-wrapper');
    if (_dw) _dw.style.display = 'none';

    // ── SET fvCanvas ke gameCanvas utama & start loop ────────────
    const _gc = document.getElementById('gameCanvas');
    if (_gc) {
        fvCanvas = _gc;
        fvCtx    = _gc.getContext('2d');
    }
    fvPlayer = { x: (FV_RARA_POS.x+3)*TS, y: (FV_RARA_POS.y+3)*TS, facing:'down' };
    startFairyLoop();
    updateFVHUD();

    // FIX: Aktifkan minimap HTML utama dengan style peri (border ungu)
    const _mmFv = document.getElementById('minimap-container');
    if (_mmFv) { _mmFv.classList.add('ingame', 'fv-mode'); }

    // ── TUTORIAL PERTAMA KALI ──────────────────────────────────────
    // FIX: Tunda 1000ms agar canvas sudah ter-render sebelum tutorial muncul
    if (!fv.fvTutorialDone) {
        setTimeout(() => startFairyVillageTutorial(), 1000);
    }
}

function closeFairyVillage() {
    // 1. Tutup semua layer dialog yang mungkin aktif
    fvActiveDialog = null;
    const dw = document.getElementById('dialogue-wrapper');
    if (dw) {
        // Bersihkan typewriter timer
        if (dw._typeTimer) { clearInterval(dw._typeTimer); dw._typeTimer = null; }
        // Lepas tap handler
        const box = document.getElementById('dialogue-box');
        if (box && dw._tapHandler) {
            box.removeEventListener('click', dw._tapHandler);
            dw._tapHandler = null;
        }
        dw.style.display = 'none';
    }
    // 2. Tutup kh-modal jika terbuka
    const khm = document.getElementById('kh-modal');
    if (khm) khm.classList.remove('open');
    // 3. Tutup tutorial jika aktif
    const tut = document.getElementById('fv-tutorial');
    if (tut) tut.classList.remove('active');
    // 4. Bersihkan highlight tutorial
    document.querySelectorAll('.fv-tut-hl').forEach(e => e.classList.remove('fv-tut-hl'));
    const ptr = document.getElementById('fv-tut-pointer');
    if (ptr) ptr.style.display = 'none';
    // 5. Reset STATE
    STATE.screen = 'play';
    // 6. Kembalikan ke lokasi sebelumnya
    STATE.location = window._fvPrevLocation || 'village';
    STATE.player.x  = window._fvPrevX !== undefined ? window._fvPrevX : 1200;
    STATE.player.y  = window._fvPrevY !== undefined ? window._fvPrevY : 600;
    // 7. Reset input agar tidak ada tombol tertahan
    if (typeof resetInputs === 'function') resetInputs();
    // 7b. Stop fairyLoop dan clear fvCanvas agar tidak bentrok dengan main render
    stopFairyLoop();
    fvCanvas = null; fvCtx = null;
    // 8. FIX: Stop musik pulau peri saat keluar — pause track aktual + reset currentTrack
    if (typeof AudioService !== 'undefined') {
        const stopTrack = (name) => {
            const t = AudioService.tracks && AudioService.tracks[name];
            if (t && !t.paused) { t.pause(); t.currentTime = 0; }
        };
        stopTrack('pulauperi');
        stopTrack('insideperi');
        AudioService.currentTrack = null;
    }
    manualSave();
    // FIX: Lepas class fv-mode dari minimap saat keluar dunia peri
    const _mmFvClose = document.getElementById('minimap-container');
    if (_mmFvClose) _mmFvClose.classList.remove('fv-mode');
    showToast('🏝️ Kembali ke Pulau Arsa');
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
function initFairyWorld() {
    fvCanvas = document.getElementById('fv-canvas');
    if (!fvCanvas) return;
    fvCtx = fvCanvas.getContext('2d');
    resizeFairyCanvas();

    fvPlayer = { x: (FV_RARA_POS.x+3)*TS, y: (FV_RARA_POS.y+3)*TS, facing:'down' };
    fvKeys = {};
    fvActiveDialog = null;
    fvParticles = [];
    fvJoy = { active:false, startX:0, startY:0, dx:0, dy:0 };

    const fv = getFairyVillage();
    // Tutorial lama (2 pesan singkat) dinonaktifkan — digantikan tutorial baru yang lebih lengkap
    if (!fv.tutorialDone) {
        fv.tutorialDone = true; // langsung mark agar tidak muncul, tutorial baru yang akan jalan
    }

    setupFairyInput();
    startFairyLoop();
    updateFVHUD();
}

function resizeFairyCanvas() {
    if (!fvCanvas) return;
    const modal  = document.getElementById('fairy-village-modal');
    const hud    = document.getElementById('fv-hud');
    const bottom = document.getElementById('fv-bottom-bar');
    const w = modal.clientWidth  || 360;
    const h = modal.clientHeight - (hud?.offsetHeight||50) - (bottom?.offsetHeight||110);
    fvCanvas.width  = Math.max(200, w);
    fvCanvas.height = Math.max(150, h);
}

// ═══════════════════════════════════════════════════════════════
