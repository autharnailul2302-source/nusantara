// ══════════════════════════════════════════════════════════════
// Collect Dust + Partikel Effect
// File: js/26-fv-collect-partikel.js
// ══════════════════════════════════════════════════════════════
// COLLECT DUST
// ─────────────────────────────────────────────────────────────
function collectFairyDust() {
    const fv=getFairyVillage(), curDay=STATE.day;
    if (fv.lastCollectDay===curDay) {
        showFVDialog('🌳 POHON ENERGI','Serbuk Wilis hari ini sudah dikumpulkan!\n\nKembali besok ya.',[{text:'OK',action:()=>fvActiveDialog=null}],'🌳'); return;
    }
    const bonus=5+fv.fairies.length*2+(fv.buildings?.length||0);
    fv.resources.debu=(fv.resources.debu||0)+bonus;
    fv.lastCollectDay=curDay;
    updateFVHUD();
    createFVParticles(FV_POHON_POS.x*TS+TS, FV_POHON_POS.y*TS+TS, 15);
    showFVDialog('🌳 POHON ENERGI',`Berhasil! ✨ +${bonus} Serbuk Wilis\n\nTotal Serbuk: ${fv.resources.debu}\n\n💡 Semakin banyak Widadari dan bangunan, semakin banyak serbuk yang bisa dikumpulkan!`,[{text:'Terima kasih!',action:()=>fvActiveDialog=null}],'🌳');
}

// ─────────────────────────────────────────────────────────────
// INTERIOR BANGUNAN — popup saat masuk bangunan
// ─────────────────────────────────────────────────────────────
// ── Building interior BG images per category ──
const FVBI_BG = {
    pohon_energi:    'images/pohonperi.png',
    // Hunian — pakai gambar omah-tier
    pondok_peri:     'images/omah-tier1.png',
    rumah_peri:      'images/omah-tier2.png',
    dalem_widadari:  'images/omah-tier3.png',
    istana_mini:     'images/omah-tier3.png',
    pohon_kehidupan: 'images/pohonperi.png',
    // Taman — pakai gambar taman-tier
    taman_mini:      'images/taman-tier1.png',
    taman_mekar:     'images/taman-tier2.png',
    kebun_raya:      'images/taman-tier3.png',
    // Kolam / Sendang — pakai gambar sendang-tier
    kolam_kristal:   'images/sendang-tier1.png',
    kolam_agung:     'images/sendang-tier2.png',
    telaga_nirmala:  'images/sendang-tier3.png',
    // Sekolah — pakai gambar sekolah-tier
    sekolah_peri:    'images/sekolah-tier1.png',
    sanggar_tari:    'images/sekolah-tier2.png',
    akademi_agung:   'images/sekolah-tier3.png',
    // Pasar — pakai gambar pasar-tier
    pasar_peri:      'images/pasar-tier1.png',
    balai_dagang:    'images/pasar-tier2.png',
    pusat_niaga:     'images/pasar-tier3.png',
    // Menara — pakai gambar menara-tier
    menara_kecil:    'images/menara-tier1.png',
    menara_wilis:    'images/menara-tier2.png',
    menara_cahaya:   'images/menara-tier3.png',
    // Istana
    istana_mini:     'images/istanaperi.png',
};

// Slot index sedang di-assign
let _fvbiAssignSlot = -1;

function openBuildingInterior(bldg, slot) {
    const fv  = getFairyVillage();
    const b   = FAIRY_BUILDINGS[bldg.bid];
    if (!b) return;

    // FIX: Putar musik insideperi saat masuk bangunan di pulau peri
    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
        // Force reset agar selalu mulai dari awal saat masuk bangunan
        if (AudioService.tracks.insideperi) {
            AudioService.tracks.insideperi.currentTime = 0;
        }
        // Gunakan currentTrack null dulu agar playBGM tidak di-skip
        if (AudioService.currentTrack === 'insideperi') {
            AudioService.currentTrack = null;
        }
        AudioService.playBGM('insideperi');
    }

    // Peri yang bekerja di sini
    const workers = (bldg.workers || []).map(wid => fv.fairies.find(f=>f.id===wid)).filter(Boolean);
    // Peri yang tidak bekerja di mana pun
    const busyIds = new Set((fv.buildings||[]).flatMap(bl=>bl.workers||[]));
    // FIX: Exclude Rara Wilis (t1) — NPC utama, tidak bisa jadi worker
    const freeFairies = fv.fairies.filter(f => !busyIds.has(f.id) && f.id !== 't1');
    const maxW = b.maxWorkers || 2;

    // Hapus popup lama
    const old = document.getElementById('fv-building-interior');
    if (old) old.remove();

    // Buat popup
    const el = document.createElement('div');
    el.id = 'fv-building-interior';

    // ── Scene: tampilkan peri yg bekerja + slot kosong di dalam scene ──
    const sceneSlots = Array.from({length: maxW}, (_, i) => {
        const wf = workers[i];
        if (wf) {
            const img = _khImg(wf);
            const moodEmoji = (wf.happiness >= 80) ? '😊' : (wf.happiness >= 50) ? '😐' : '😢';
            const activityEmoji = b.dustPerDay ? '✨' : b.foodPerDay ? '🍳' : b.happinessBonus ? '💧' : b.xpBonus ? '📖' : b.enableTrading ? '🛒' : b.dustMultiplier ? '🕯️' : '⚙️';
            return `<div class="fvbi-fairy-slot" title="${wf.name} — Klik untuk kelola" onclick="fvFireWorkerPrompt('${bldg.slotId}',${i})">
                <div class="fvbi-work-badge">${activityEmoji}</div>
                <img src="${img}" onerror="this.src='images/rarawilis.png'" class="fvbi-fairy-slot-img">
                <div class="fvbi-fairy-slot-name">${wf.name} ${moodEmoji}</div>
            </div>`;
        } else {
            const hasFreeFairy = freeFairies.length > 0;
            return `<div class="fvbi-fairy-slot fvbi-fairy-slot-empty" title="${hasFreeFairy ? 'Ketuk untuk tugaskan peri' : 'Tidak ada peri bebas'}" onclick="fvbiOpenAssign(${i})">
                <div class="fvbi-fairy-slot-img" style="display:flex;align-items:center;justify-content:center;font-size:26px;">${hasFreeFairy ? '🧚' : '🌫️'}</div>
                <div class="fvbi-fairy-slot-name" style="font-size:9px;">${hasFreeFairy ? '+ Tugaskan' : 'Kosong'}</div>
            </div>`;
        }
    }).join('');

    // ── Stat chips ──
    const statChips = [];
    statChips.push(`<div class="fvbi-stat-chip"><span>👷</span>${workers.length}/${maxW} Peri</div>`);
    statChips.push(`<div class="fvbi-stat-chip"><span>⭐</span>Tier ${b.tier}</div>`);
    if (b.maxFairies)     statChips.push(`<div class="fvbi-stat-chip"><span>🏠</span>Hunian +${b.maxFairies}</div>`);
    if (b.birthChance)    statChips.push(`<div class="fvbi-stat-chip"><span>👶</span>${Math.round(b.birthChance*100)}% lahir</div>`);
    if (b.dustMultiplier) statChips.push(`<div class="fvbi-stat-chip"><span>✨</span>Debu ×${b.dustMultiplier}</div>`);
    if (b.xpBonus)        statChips.push(`<div class="fvbi-stat-chip"><span>📚</span>XP ×${b.xpBonus}</div>`);
    if (b.enableTrading)  statChips.push(`<div class="fvbi-stat-chip"><span>💱</span>Trading x${b.tradeBonus||1}</div>`);

    // ── Produksi tags ──
    const fx=[];
    if(b.dustPerDay)     fx.push(`+${b.dustPerDay} ✨ Debu/hari`);
    if(b.foodPerDay)     fx.push(`+${b.foodPerDay} 🍽️ Makanan/hari`);
    if(b.happinessBonus) fx.push(`+${b.happinessBonus} ❤️ Happiness/hari`);
    if(b.cahayaPerWeek)  fx.push(`+${b.cahayaPerWeek} 🌟 Cahaya/minggu`);
    if(b.intelBonus)     fx.push(`+${b.intelBonus} 🧠 Intel/hari`);
    const prodHTML = fx.length ? fx.map(f=>`<span class="fvbi-prod-tag">${f}</span>`).join('') : '<span class="fvbi-prod-tag">Pasif</span>';

    // ── Worker list (below scene, detail assign) ──
    const workerCards = Array.from({length: maxW}, (_, i) => {
        const wf = workers[i];
        if (wf) {
            const img = _khImg(wf);
            return `<div class="fvbi-worker filled">
                <img src="${img}" onerror="this.src='images/rarawilis.png'" class="fvbi-wimg">
                <div class="fvbi-winfo">
                    <div class="fvbi-wname">${wf.name} <span style="font-size:10px;opacity:.6;">${wf.gender==='girl'?'♀':'♂'} Lv.${wf.level||1}</span></div>
                    <div class="fvbi-wstat">🧠${wf.intel||0} ⚡${wf.agility||0} 🌟${wf.spirit||0} ❤️${wf.happiness||0}%</div>
                </div>
                <button class="fvbi-wfire" onclick="fvFireWorker('${bldg.slotId}',${i})">✕ Tarik</button>
            </div>`;
        } else {
            const freeOpts = freeFairies.length
                ? freeFairies.map(f=>`<option value="${f.id}">${f.name} (${f.gender==='girl'?'♀':'♂'}) Lv.${f.level||1} 🧠${f.intel||0}</option>`).join('')
                : `<option value="">— Tidak ada peri bebas —</option>`;
            return `<div class="fvbi-worker empty">
                <div class="fvbi-empty-ico">🧚</div>
                <div class="fvbi-empty-label">Slot ${i+1} Kosong</div>
                <select class="fvbi-sel" id="fvbi-sel-${bldg.slotId}-${i}">${freeOpts}</select>
                <button class="fvbi-wassign" onclick="fvAssignWorkerFromInterior('${bldg.slotId}',${i})" ${freeFairies.length?'':'disabled'}>Tugaskan</button>
            </div>`;
        }
    }).join('');

    // ── Assign modal list ──
    const assignItems = freeFairies.length
        ? freeFairies.map(f => {
            const img = _khImg(f);
            return `<div class="fvbi-assign-item" onclick="fvbiDoAssignSlot('${bldg.slotId}',_fvbiAssignSlot,'${f.id}')">
                <img src="${img}" onerror="this.src='images/rarawilis.png'">
                <div class="fvbi-assign-item-info">
                    <div class="fvbi-assign-item-name">${f.name} <span style="font-size:10px;opacity:.6;">${f.gender==='girl'?'♀':'♂'} Lv.${f.level||1}</span></div>
                    <div class="fvbi-assign-item-stat">🧠${f.intel||0} ⚡${f.agility||0} 🌟${f.spirit||0} ❤️${f.happiness||0}%</div>
                </div>
            </div>`;
          }).join('')
        : `<div class="fvbi-assign-empty">Tidak ada peri bebas saat ini 🧚</div>`;

    // ── Narasi suasana per tipe bangunan ──
    const FVBI_NARASI = {
        pondok_peri:    workers.length ? '🌸 Para Widadari beristirahat dengan tenang di sini...' : '🌫️ Bangunan sepi... belum ada Widadari yang tinggal.',
        rumah_peri:     workers.length ? '🏡 Suara tawa lembut terdengar dari dalam rumah...' : '🌫️ Pintu terbuka, tapi rumah masih kosong.',
        dalem_widadari: workers.length ? '✨ Aroma bunga kenanga mengisi tiap sudut dalem...' : '🌫️ Dalem yang megah menunggu sang penghuni.',
        taman_mini:     workers.length ? '🌸 Peri bunga bersenandung sambil merawat tanaman...' : '🌿 Taman segar menunggu tangan teladan peri.',
        taman_mekar:    workers.length ? '🌺 Wangi kenanga menguar, peri sibuk menyiram...' : '🌿 Kebun subur, tapi belum ada yang merawat.',
        kebun_raya:     workers.length ? '🌳 Dedaunan berdesir, para peri bekerja gembira...' : '🌳 Kebun raya menunggu peri-peri rajin.',
        kolam_kristal:  workers.length ? '💧 Suara gemericik air jernih menenangkan jiwa...' : '💧 Sendang yang bening, sepi tanpa penunggu.',
        kolam_agung:    workers.length ? '🌊 Cipratan air suci membawa berkah Kahyangan...' : '🌊 Air sendang beriak-riak menunggu sang peri.',
        telaga_nirmala: workers.length ? '🌈 Cahaya pelangi memantul di permukaan telaga...' : '🌈 Telaga ajaib sepi tanpa penjaganya.',
        sekolah_peri:   workers.length ? '📚 Suara hafalan ilmu bergema di padepokan...' : '📚 Padepokan ilmu sunyi menunggu guru peri.',
        sanggar_tari:   workers.length ? '🎓 Gemerincing gelang peri mengiringi tarian...' : '🎓 Sanggar tari sepi, tunggu peri berbakat.',
        akademi_agung:  workers.length ? '🏛️ Para cendekiawan peri berdiskusi serius...' : '🏛️ Akademi agung menantikan para pelajar.',
        pasar_peri:     workers.length ? '🛒 Riuh transaksi dan tawa para pedagang peri...' : '🛒 Lapak dagang siap, menunggu peri berdagang.',
        balai_dagang:   workers.length ? '🏪 Aroma kayu segar dari balai yang ramai...' : '🏪 Balai dagang menunggu niagawan peri.',
        pusat_niaga:    workers.length ? '🏦 Kristal berkilau ditumpuk rapi di pusat niaga...' : '🏦 Brankas terbuka, menunggu peri bijak.',
        menara_kecil:   workers.length ? '🕯️ Cahaya lilin berkedip lembut di puncak menara...' : '🕯️ Menara berdiri kokoh, belum ada yang menjaga.',
        menara_wilis:   workers.length ? '✨ Sinar Wilis memancar dari puncak menara...' : '✨ Menara Wilis siap, menunggu penjaga setia.',
        menara_cahaya:  workers.length ? '🌟 Cahaya surgawi bersinar terang dari puncak...' : '🌟 Menara cahaya tertinggi, butuh peri kuat.',
        pohon_energi:   '🌳 Pohon Energi berdenyut penuh kekuatan Wilis...',
        pohon_kehidupan:'🌳 Akar pohon beringin agung mengaliri energi Kahyangan...',
    };
    const narasiText = FVBI_NARASI[bldg.bid] || (workers.length ? '✨ Para Widadari sibuk bekerja dengan riang...' : '🌫️ Bangunan ini masih menunggu Widadari penghuni.');

    const bgSrc = FVBI_BG[bldg.bid] || 'images/kayangan.png';

    el.innerHTML = `
        <div id="fvbi-overlay" onclick="closeBuildingInterior()"></div>
        <div id="fvbi-panel">
            <!-- HEADER -->
            <div id="fvbi-header">
                <span id="fvbi-emoji">${b.emoji||'🏠'}</span>
                <div id="fvbi-title-wrap">
                    <div id="fvbi-name">${b.name.replace(/^[^\s]+\s/,'')}</div>
                    <div id="fvbi-tier">Tier ${b.tier} · ${slot?'Slot '+slot.id.toUpperCase():''}</div>
                </div>
                <button id="fvbi-close" onclick="closeBuildingInterior()">✕</button>
            </div>

            <!-- INTERIOR SCENE -->
            <div id="fvbi-scene">
                <img id="fvbi-scene-bg" src="${bgSrc}" onerror="this.style.display='none'" alt="">
                <div id="fvbi-scene-overlay"></div>
                <div id="fvbi-scene-narasi">${narasiText}</div>
                <div id="fvbi-fairy-row">${sceneSlots}</div>

                <!-- Assign overlay (muncul saat klik slot kosong di scene) -->
                <div id="fvbi-assign-modal">
                    <div id="fvbi-assign-title">🧚 Pilih Peri untuk Slot ini</div>
                    <div id="fvbi-assign-list">${assignItems}</div>
                    <button class="fvbi-assign-cancel" onclick="fvbiCloseAssign()">✕ Batal</button>
                </div>
            </div>

            <!-- STAT CHIPS -->
            <div id="fvbi-stat-bar">${statChips.join('')}</div>

            <!-- PRODUKSI -->
            <div id="fvbi-prod">
                <div class="fvbi-sec-label">⚙️ Produksi & Fungsi</div>
                <div id="fvbi-prod-tags">${prodHTML}</div>
            </div>

            <!-- WORKERS DETAIL -->
            <div id="fvbi-workers-section">
                <div class="fvbi-sec-label">👷 Penugasan Peri <span style="font-weight:400;font-size:10px;color:#a78bfa;">(${workers.length}/${maxW} bekerja)</span></div>
                <div id="fvbi-worker-grid">${workerCards}</div>
            </div>

            <!-- DESC -->
            <div id="fvbi-desc">💬 ${b.desc||''}</div>

            <!-- FOOTER ACTIONS -->
            <div id="fvbi-footer">
                ${b.upgradeTo ? `<button class="fvbi-btn-upgrade" onclick="closeBuildingInterior(); setTimeout(()=>openKastilModal?.(), 100);">⬆️ Upgrade Bangunan</button>` : `<div></div>`}
                <button class="fvbi-btn-close" onclick="closeBuildingInterior()">🚪 Keluar</button>
            </div>
        </div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(()=> el.querySelector('#fvbi-panel').classList.add('fvbi-in'));
}

function fvbiOpenAssign(slotIdx) {
    _fvbiAssignSlot = slotIdx;
    const modal = document.getElementById('fvbi-assign-modal');
    if (modal) modal.classList.add('open');
}
function fvbiCloseAssign() {
    const modal = document.getElementById('fvbi-assign-modal');
    if (modal) modal.classList.remove('open');
}
function fvbiDoAssignSlot(slotId, workerIdx, fairyId) {
    fvbiCloseAssign();
    // Re-use existing assign logic
    const fv   = getFairyVillage();
    const bldg = (fv.buildings||[]).find(b=>b.slotId===slotId);
    if (!bldg) return;
    const wid  = fairyId;
    const alreadyWorking = (fv.buildings||[]).some(b=>b.workers&&b.workers.includes(wid));
    if (alreadyWorking) { showToast('Peri ini sudah bekerja di bangunan lain!'); return; }
    if (!bldg.workers) bldg.workers = [];
    bldg.workers[workerIdx] = wid;
    const f = fv.fairies.find(x=>x.id===wid);
    showToast(`✅ ${f?.name||'Peri'} mulai bekerja!`);
    typeof _khRefRes==='function' && _khRefRes();
    closeBuildingInterior();
    const slot = FAIRY_SLOTS.find(s=>s.id===slotId);
    if (slot) setTimeout(()=>openBuildingInterior(bldg,slot), 100);
}
function fvFireWorkerPrompt(slotId, workerIdx) {
    const fv = getFairyVillage();
    const bldg = (fv.buildings||[]).find(b=>b.slotId===slotId);
    if (!bldg) return;
    const wid = bldg.workers[workerIdx];
    const f = fv.fairies.find(x=>x.id===wid);
    if (!f) return;
    // Konfirmasi singkat via toast, lalu fire
    showToast(`🔓 Tekan tombol "Tarik" di daftar bawah untuk menarik ${f.name}.`);
}

function closeBuildingInterior() {
    const el = document.getElementById('fv-building-interior');
    if (!el) return;
    const panel = el.querySelector('#fvbi-panel');
    if (panel) panel.classList.remove('fvbi-in');
    setTimeout(() => el.remove(), 220);
    // FIX: Kembali ke musik pulauperi setelah keluar dari bangunan
    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
        if (AudioService.currentTrack === 'insideperi') {
            AudioService.playBGM('pulauperi');
        }
    }
}

function fvFireWorker(slotId, workerIdx) {
    const fv = getFairyVillage();
    const bldg = (fv.buildings||[]).find(b=>b.slotId===slotId);
    if (!bldg) return;
    const fired = bldg.workers[workerIdx];
    bldg.workers.splice(workerIdx, 1);
    const f = fv.fairies.find(x=>x.id===fired);
    showToast(`🔓 ${f?.name||'Peri'} selesai bertugas di bangunan ini.`);
    closeBuildingInterior();
    // Re-open dengan data terbaru
    const slot = FAIRY_SLOTS.find(s=>s.id===slotId);
    if (slot) setTimeout(()=>openBuildingInterior(bldg,slot), 100);
}

function fvAssignWorkerFromInterior(slotId, workerIdx) {
    const fv   = getFairyVillage();
    const bldg = (fv.buildings||[]).find(b=>b.slotId===slotId);
    if (!bldg) return;
    const sel  = document.getElementById(`fvbi-sel-${slotId}-${workerIdx}`);
    if (!sel || !sel.value) { showToast('Pilih peri dulu!'); return; }
    const wid  = sel.value;
    // Cek sudah bekerja di tempat lain
    const alreadyWorking = (fv.buildings||[]).some(b=>b.workers&&b.workers.includes(wid));
    if (alreadyWorking) { showToast('Peri ini sudah bekerja di bangunan lain!'); return; }
    if (!bldg.workers) bldg.workers = [];
    bldg.workers[workerIdx] = wid;
    const f = fv.fairies.find(x=>x.id===wid);
    showToast(`✅ ${f?.name||'Peri'} mulai bekerja!`);
    _khRefRes && _khRefRes();
    closeBuildingInterior();
    const slot = FAIRY_SLOTS.find(s=>s.id===slotId);
    if (slot) setTimeout(()=>openBuildingInterior(bldg,slot), 100);
}

// ─────────────────────────────────────────────────────────────
// PARTIKEL
// ─────────────────────────────────────────────────────────────
function createFVParticles(wx,wy,count=12) {
    // Konversi world coords ke screen coords
    const sx=wx-fvCam.x, sy=wy-fvCam.y;
    for(let i=0;i<count;i++){
        const angle=Math.random()*Math.PI*2, speed=1+Math.random()*2.5;
        fvParticles.push({x:sx,y:sy,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-1,life:45,maxLife:45,color:`hsl(${260+Math.random()*80},85%,72%)`});
    }
}

// ─────────────────────────────────────────────────────────────
// INPUT — Floating joystick (same as main game)
// ─────────────────────────────────────────────────────────────
function setupFairyInput() {
    document.addEventListener('keydown', fvKeyDown);
    document.addEventListener('keyup',   fvKeyUp);
    if (fvCanvas) {
        fvCanvas.addEventListener('click',      tapFVDialog,     false);
        fvCanvas.addEventListener('touchstart', fvCanvasTouchStart, {passive:false});
        fvCanvas.addEventListener('touchend',   fvCanvasTouchEnd,   {passive:false});
    }
    // Floating joystick — attached to the bottom bar area
    const area = document.getElementById('fv-bottom-bar');
    if (area) {
        area.addEventListener('touchstart', fvJoyTouchStart, {passive:false});
        area.addEventListener('touchmove',  fvJoyTouchMove,  {passive:false});
        area.addEventListener('touchend',   fvJoyTouchEnd,   {passive:false});
        area.addEventListener('mousedown',  fvJoyMouseStart);
        document.addEventListener('mousemove', fvJoyMouseMove);
        document.addEventListener('mouseup',   fvJoyMouseEnd);
    }
}

function removeFairyInput() {
    document.removeEventListener('keydown', fvKeyDown);
    document.removeEventListener('keyup',   fvKeyUp);
    document.removeEventListener('mousemove', fvJoyMouseMove);
    document.removeEventListener('mouseup',   fvJoyMouseEnd);
    // FIX: Hapus juga listener canvas agar tidak menumpuk saat openFairyVillage dipanggil ulang
    if (fvCanvas) {
        fvCanvas.removeEventListener('click',      tapFVDialog);
        fvCanvas.removeEventListener('touchstart', fvCanvasTouchStart);
        fvCanvas.removeEventListener('touchend',   fvCanvasTouchEnd);
    }
}

function fvKeyDown(e){ fvKeys[e.key]=true; if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault(); }
function fvKeyUp(e)  { fvKeys[e.key]=false; }

function fvCanvasTouchStart(e){ e.preventDefault(); tapFVDialog(e); }
function fvCanvasTouchEnd(e)  { e.preventDefault(); }

// Floating joystick — muncul di posisi sentuhan, sama seperti main game
function fvJoyTouchStart(e) {
    e.preventDefault();
    const t=e.touches[0];
    fvJoy.startX=t.clientX; fvJoy.startY=t.clientY;
    fvJoy.active=true; fvJoy.dx=0; fvJoy.dy=0;
    showFVJoyVisual(t.clientX, t.clientY, 0, 0);
}
function fvJoyTouchMove(e) {
    if(!fvJoy.active)return; e.preventDefault();
    const t=e.touches[0];
    let dx=t.clientX-fvJoy.startX, dy=t.clientY-fvJoy.startY;
    const mag=Math.sqrt(dx*dx+dy*dy);
    if(mag>50){dx=dx/mag*50; dy=dy/mag*50;}
    fvJoy.dx=dx; fvJoy.dy=dy;
    showFVJoyVisual(fvJoy.startX, fvJoy.startY, dx, dy);
}
function fvJoyTouchEnd(e) {
    fvJoy.active=false; fvJoy.dx=0; fvJoy.dy=0;
    hideFVJoyVisual();
}
function fvJoyMouseStart(e) {
    fvJoy.startX=e.clientX; fvJoy.startY=e.clientY;
    fvJoy.active=true; fvJoy.dx=0; fvJoy.dy=0;
    showFVJoyVisual(e.clientX, e.clientY, 0, 0);
}
function fvJoyMouseMove(e) {
    if(!fvJoy.active)return;
    let dx=e.clientX-fvJoy.startX, dy=e.clientY-fvJoy.startY;
    const mag=Math.sqrt(dx*dx+dy*dy);
    if(mag>50){dx=dx/mag*50; dy=dy/mag*50;}
    fvJoy.dx=dx; fvJoy.dy=dy;
    showFVJoyVisual(fvJoy.startX, fvJoy.startY, dx, dy);
}
function fvJoyMouseEnd() {
    fvJoy.active=false; fvJoy.dx=0; fvJoy.dy=0;
    hideFVJoyVisual();
}

function showFVJoyVisual(bx,by,dx,dy){
    const base=document.getElementById('fv-joy-base');
    const stick=document.getElementById('fv-joy-stick');
    if(!base||!stick)return;
    const rect=document.getElementById('fv-bottom-bar').getBoundingClientRect();
    base.style.display='block';
    base.style.left=(bx-rect.left-40)+'px';
    base.style.top=(by-rect.top-40)+'px';
    stick.style.left=(40+dx-16)+'px';
    stick.style.top=(40+dy-16)+'px';
}
function hideFVJoyVisual(){
    const base=document.getElementById('fv-joy-base');
    if(base) base.style.display='none';
}

// ─────────────────────────────────────────────────────────────
