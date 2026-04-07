// ========================================================
// js/24_fairy_dialog.js
// Dialog Rara Wilis, Test Modes, Legacy Stubs
// ========================================================

// ═══════════════════════════════════════════════════════════════
// DIALOG RARA WILIS
// ═══════════════════════════════════════════════════════════════
function openRaraWilisDialog() {
    fvActiveDialog = null;
    STATE.screen = 'play';
    const fv = getFairyVillage(), stats = getFairyVillageStats(fv), res = fv.resources;
    const bCount = (fv.buildings||[]).length;
    const qCount = (fv.buildQueue||[]).length;
    const totalBuilt = bCount;

    // ── Tentukan FASE cerita berdasarkan progress ──────────────────
    // Fase 0 = kunjungan pertama (sebelum bangun apapun)
    // Fase 1 = mulai membangun (1-3 bangunan)
    // Fase 2 = berkembang (4-9 bangunan)
    // Fase 3 = hampir pulih (10-15 bangunan)
    // Fase 4 = pulih sepenuhnya (sylvariaQuestComplete)

    const fase = STATE.player.sylvariaQuestComplete ? 4
               : totalBuilt === 0 ? 0
               : totalBuilt <= 3  ? 1
               : totalBuilt <= 9  ? 2
               : 3;

    // ── Salam pembuka sesuai fase ──────────────────────────────────
    const salamBuka = [
        // Fase 0 — Pertama kali, penuh kekhawatiran
        `...Akhirnya ada manusia yang bisa melihat kami.\n\nAku Rara Wilis. Ratu terakhir para Widadari Gunung Wilis.\n\nKahyangan kami... hampir punah. Ratusan tahun yang lalu, bencana besar melanda — tanah longsor raksasa menghancurkan hampir seluruh Kahyangan. Pohon Beringin Agung kami — sumber hidup para Widadari — retak parah.\n\nPara Widadari melarikan diri. Banyak yang tidak selamat. Kini tersisa segelintir saja.\n\nAku tidak punya siapa-siapa lagi. Kecuali... kamu.`,

        // Fase 1 — Ada harapan tipis
        `Kamu kembali... ${fv.fairies.length > 0 ? 'dan kamu membawa Widadari baru!' : ''}\n\nBencana longsor itu meluluhlantakkan tanah kami dalam semalam. Aku masih ingat suara pohon-pohon tumbang, kristal Brantas yang hancur berkeping...\n\nTapi kini, dengan ${totalBuilt} bangunan yang mulai berdiri, ada secercah harapan.\n\n✨ Debu: ${res.debu}  💎 Kristal: ${res.kristal}  🌟 Cahaya: ${res.cahaya}  🍽️ Makanan: ${res.makanan||0}\n👥 Widadari: ${fv.fairies.length}/${stats.totalCap}`,

        // Fase 2 — Mulai bangkit
        `${fv.fairies.length >= 3 ? 'Suara tawa Widadari kecil sudah terdengar lagi...' : 'Kahyangan perlahan bernapas kembali.'}\n\nDulunya tempat ini ramai. Ribuan Widadari menjaga keseimbangan alam Jawa Timur — peri hutan merawat pohon-pohon Wilis, peri bunga membantu penyerbukan ladang manusia.\n\nBencana itu memutus semuanya. Manusia pun lupa kami ada.\n\nKini ada ${totalBuilt} bangunan. Kami mulai bangkit!\n\n✨ ${res.debu}  💎 ${res.kristal}  🌟 ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,

        // Fase 3 — Mendekati pulih
        `Kamu sungguh... luar biasa.\n\nAku tidak menyangka Kahyangan Wilis bisa seramai ini lagi. ${totalBuilt} bangunan sudah berdiri. Para Widadari bernyanyi lagi setiap pagi.\n\nHanya satu hal lagi yang kubutuhkan — energi penuh untuk membangkitkan Pohon Beringin Agung ke kondisi sempurna.\n\nBantu aku menyelesaikan ini. Untuk Wilis. Untuk alam.\n\n✨ ${res.debu}  💎 ${res.kristal}  🌟 ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,

        // Fase 4 — Selesai, rasa syukur
        `Kahyangan Wilis telah pulih sepenuhnya! 🌳✨\n\nPohon Beringin Agung berdaun lebat lagi. Para Widadari menari di antara sinar bulan Wilis.\n\nKamu adalah manusia pertama dalam ratusan tahun yang benar-benar peduli.\n\nKahyangan ini akan terus berdoa untukmu.\n\n✨ ${res.debu}  💎 ${res.kristal}  🌟 ${res.cahaya}  👥 ${fv.fairies.length}`,
    ][fase];

    // ── Susun pilihan menu — simpel, buka modal untuk detail ──────
    const opts = [];
    opts.push({ text: '🏰 Kelola Kahyangan Wilis', action: () => {
        if (typeof closeDialogue === 'function') closeDialogue();
        setTimeout(khOpen, 30);
    }});
    // Konversi Gold → Debu Peri (Serbuk Wilis)
    opts.push({ text: `💰 Tukar Gold → Debu Peri (${STATE.player.gold||0}G)`, action: () => {
        fvActiveDialog = null; STATE.screen = 'play';
        setTimeout(() => {
            const gold = STATE.player.gold || 0;
            const convRates = [
                { g:10,  d:5,  label:'10 Gold → 5 Energi' },
                { g:50,  d:30, label:'50 Gold → 30 Energi' },
                { g:100, d:70, label:'100 Gold → 70 Energi (Bonus!)' },
                { g:500, d:400,label:'500 Gold → 400 Energi (Super Bonus!)' },
            ];
            const available = convRates.filter(r => gold >= r.g);
            if (!available.length) {
                showFVDialog('💰 PENUKARAN ENERGI',
                    `Gold kamu: ${gold}\n\nMinimal butuh 10 Gold untuk ditukar.\n\n✨ Debu Peri (Serbuk Wilis) digunakan untuk membangun & memberi makan para Widadari.\n\n💡 Kumpulkan Gold dari berjualan di kota Arjosari!`,
                    [{ text: 'Mengerti', action: openRaraWilisDialog }],
                    'images/rarawilis.png');
                return;
            }
            const convOpts = available.map(r => ({
                text: `💱 ${r.label}`,
                action: () => {
                    fvActiveDialog=null; STATE.screen='play';
                    setTimeout(()=>{
                        if ((STATE.player.gold||0) >= r.g) {
                            STATE.player.gold -= r.g;
                            getFairyVillage().resources.debu = (getFairyVillage().resources.debu||0) + r.d;
                            updateHUD && updateHUD();
                            showToast(`💱 ${r.g} Gold → +${r.d} ✨ Debu Peri!`);
                        } else { showToast('❌ Gold tidak cukup!'); }
                        openRaraWilisDialog();
                    }, 30);
                }
            }));
            convOpts.push({ text: '🔙 Kembali', action: openRaraWilisDialog });
            showFVDialog('💰 PENUKARAN ENERGI',
                `Gold kamu: ${gold} 💰\nDebu Peri: ${getFairyVillage().resources.debu} ✨\n\n✨ Debu Peri (Serbuk Wilis) adalah sumber daya utama Kahyangan.\nDigunakan untuk membangun bangunan dan memberi makan peri.\n\nPilih jumlah penukaran:`,
                convOpts, 'images/rarawilis.png');
        }, 30);
    }});
    if (fase <= 1) {
        opts.push({ text: '❓ Apa yang terjadi dulu...?', action: () => {
            showFVDialog('RARA WILIS',
                `Seratus tahun yang lalu, manusia-manusia tamak mulai menebang hutan Gunung Wilis tanpa henti.\n\nKeseimbangan alam rusak. Hujan tanpa musim. Tanah kehilangan akarnya.\n\nLalu... malam itu tiba. Longsor terbesar sepanjang sejarah Wilis. Setengah Kahyangan terhapus dalam satu malam.\n\nPohon Beringin Agung — pohon tertua yang menjadi sumber kekuatan kami — terluka parah. Kristal Brantas yang menyimpan energi Kahyangan hancur berserakan.\n\nPara Widadari yang tersisa hanya bisa menangis dan menyaksikan rumah kami runtuh.\n\nKini hanya kamu yang bisa membantu kami membangun kembali.`,
                [{ text: 'Aku akan membantu...', action: openRaraWilisDialog }],
                'images/rarawilis.png'
            );
        }});
    }
    if (fase >= 2) {
        opts.push({ text: '🌿 Cerita tentang Kahyangan...', action: () => {
            const lore = ['','',
                `Kahyangan Wilis terbentang dari puncak Gunung Wilis hingga lembah Brantas di timur.\n\nDulu ada tiga penjuru Kahyangan:\n🌲 Hutan Wilis Utara — dijaga peri hutan\n🌸 Taman Bunga Tengah — dijaga peri bunga\n💧 Sendang Suci Selatan — dijaga peri air\n\nWening, Sekar, dan Bening — tiga Widadari terakhir yang selamat — bersamaku hingga hari ini.`,
                `Pohon Beringin Agung itu bukan sekadar pohon biasa.\n\nIa menyerap energi dari bumi, langit, dan hati manusia yang tulus.\n\nKini dengan bantuanmu, sinarnya mulai kembali. Para Widadari merasakan kehangatan yang sudah lama hilang.`,
                `Kahyangan Wilis kini bersinar kembali seperti ratusan tahun lalu.\n\nTerima kasih... kisah ini akan dikenang para Widadari sepanjang masa.`
            ][fase] || 'Kahyangan Wilis kini bersinar penuh! ✨\nTerima kasih telah memulihkan tempat suci ini.';
            showFVDialog('RARA WILIS', lore, [{ text: 'Aku mengerti...', action: openRaraWilisDialog }], 'images/rarawilis.png');
        }});
    }
    opts.push({ text: '🙏 Terima kasih atas informasinya', action: () => {
        if (typeof closeDialogue === 'function') closeDialogue();
        // Pesan balasan Rara Wilis saat pamit
        const pamitRara = fase >= 4
            ? 'showToast("✨ Kahyangan Wilis selalu menantimu kembali. Terima kasih, Pahlawan Wilis! 🌸")'
            : fase >= 2
            ? 'showToast("🌿 Perjalananmu membawa harapan bagi kami. Sampai jumpa lagi! 🙏")'
            : 'showToast("🌱 Terima kasih sudah mendengarkan kisah kami. Kami menunggumu kembali... ✨")';
        setTimeout(function() { eval(pamitRara); }, 200);
    }});
    opts.push({ text: '🚪 Tinggalkan Kahyangan', action: () => {
        // Tutup dialogue wrapper dulu baru close fairy village
        if (typeof closeDialogue === 'function') closeDialogue();
        setTimeout(() => closeFairyVillage(), 40);
    }});

    // TEST MODE: tombol test kelahiran — muncul jika isTestMode ATAU freeRoamMode aktif
    if (fv.isTestMode || STATE.freeRoamMode) {
        opts.push({ text: '🥚 [TEST] Lahirkan Peri Baru', action: testFairyBirth });
    }

    showFVDialog('RARA WILIS', salamBuka, opts, 'images/rarawilis.png');
}

// ═══════════════════════════════════════════════════════════════
// DIALOG ISTANA PERI — Puri Agung Wilis
// Dipanggil saat player mendekati & berinteraksi dengan istana peri
// ═══════════════════════════════════════════════════════════════
function openIstanaDialog() {
    const fv = getFairyVillage();
    const stats = getFairyVillageStats(fv);
    const res = fv.resources;
    const bCount = (fv.buildings || []).length;
    const fase = STATE.player.sylvariaQuestComplete ? 4
               : bCount === 0 ? 0
               : bCount <= 3  ? 1
               : bCount <= 9  ? 2
               : 3;

    const narasiIstana = [
        // Fase 0 — Istana masih sepi
        `Puri Agung Wilis... Dulunya tempat ini penuh suara keceriaan para Widadari.\n\nKini hanya ada angin yang berhembus melewati lorong-lorong sepinya.\n\nBantu kami membangun kembali Kahyangan ini, dan Puri ini akan ramai lagi! 🏰`,
        // Fase 1 — Mulai ada harapan
        `Langkah pertama sudah kamu ambil! ${bCount} bangunan sudah berdiri.\n\nPuri ini mulai merasakan kehangatan. Para Widadari mulai mempercayaimu.\n\n✨ Debu: ${res.debu}  💎 Kristal: ${res.kristal}\n🌟 Cahaya: ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,
        // Fase 2 — Berkembang
        `${bCount} bangunan berdiri megah! Kahyangan semakin hidup.\n\nDari sinilah para Widadari mengatur tugas dan menjaga keseimbangan alam Wilis.\n\n✨ Debu: ${res.debu}  💎 Kristal: ${res.kristal}\n🌟 Cahaya: ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,
        // Fase 3 — Hampir pulih
        `Luar biasa! Puri ini kembali bersinar setelah sekian lama gelap.\n\n${bCount} bangunan sudah berdiri. Hanya sedikit lagi untuk pemulihan sempurna!\n\n✨ Debu: ${res.debu}  💎 Kristal: ${res.kristal}\n🌟 Cahaya: ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,
        // Fase 4 — Pulih sempurna
        `🌟 Kahyangan Wilis telah pulih sepenuhnya! 🌟\n\nPuri Agung Wilis kembali menjadi pusat kebudayaan para Widadari.\n\nKamu akan selalu dikenang dalam sejarah Kahyangan, Penjaga Wilis! ✨`,
    ][fase];

    const opts = [];
    // Aksi utama: Kelola Kahyangan (buka modal manajemen penuh)
    opts.push({ text: '🏰 Kelola Kahyangan Wilis', action: () => {
        fvActiveDialog = null;
        setTimeout(khOpen, 30);
    }});
    // Shortcut: Lihat statistik langsung
    opts.push({ text: '📊 Lihat Statistik Kahyangan', action: () => {
        fvActiveDialog = null;
        setTimeout(() => { khOpen(); setTimeout(() => khTab('statistik'), 80); }, 30);
    }});
    // Shortcut: Lihat daftar peri
    opts.push({ text: '🧚 Daftar Para Widadari', action: () => {
        fvActiveDialog = null;
        setTimeout(() => { khOpen(); setTimeout(() => khTab('peri'), 80); }, 30);
    }});
    // Kembali
    opts.push({ text: '🚪 Kembali', action: () => { fvActiveDialog = null; } });

    showFVDialog('🏰 PURI AGUNG WILIS', narasiIstana, opts, 'images/istanaperi.png');
}


const KH_FIXED = ['t1','t2','t3','t4','t5'];
let _khIdx = 0;

function khOpen() {
    if (typeof closeDialogue === 'function') closeDialogue();
    fvActiveDialog = null;
    const m = document.getElementById('kh-modal');
    if (!m) return;
    m.classList.add('open');
    STATE.screen = 'dialogue';
    _khIdx = 0;
    _khRefRes();
    khTab('peri');
}
function khClose() {
    const m = document.getElementById('kh-modal');
    if (m) m.classList.remove('open');
    STATE.screen = 'play';
}

function _khRefRes() {
    const fv = getFairyVillage(), st = getFairyVillageStats(fv);
    const g = id => document.getElementById(id);
    const s = (id, v) => { const el = g(id); if (el) el.textContent = v; };
    s('khr-debu',   fv.resources.debu   || 0);
    s('khr-kristal',fv.resources.kristal|| 0);
    s('khr-cahaya', fv.resources.cahaya || 0);
    s('khr-makan',  fv.resources.makanan|| 0);
    s('khr-pop',    `${fv.fairies.length}/${st.totalCap}`);
    s('kh-fcount',  fv.resources.makanan|| 0);
}

// ── Tooltip helper untuk tab Statistik ──────────────────────────
function _fvTip(id, text) {
    // Tampilkan/sembunyikan tooltip inline di bawah kartu
    const el = document.getElementById('fvtip-' + id);
    if (!el) return;
    const vis = el.style.display === 'block';
    // Sembunyikan semua tooltip dulu
    document.querySelectorAll('.fvstat-tip').forEach(t => t.style.display = 'none');
    if (!vis) el.style.display = 'block';
}

function _fvStatCard(id, emoji, label, value, valColor, borderColor, tipText) {
    return `<div onclick="_fvTip('${id}')" style="cursor:pointer;background:#fff;border-radius:8px;padding:5px 10px;border:1px solid ${borderColor};display:flex;justify-content:space-between;align-items:center;flex-direction:column;gap:2px;position:relative;">
      <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
        <span style="font-size:12px;">${emoji} ${label}</span>
        <div style="display:flex;align-items:center;gap:4px;">
          <b style="font-size:13px;color:${valColor};">${value}</b>
          <span style="font-size:10px;color:#a78bfa;opacity:0.8;">ⓘ</span>
        </div>
      </div>
      <div id="fvtip-${id}" class="fvstat-tip" style="display:none;margin-top:4px;width:100%;background:#1e1b4b;color:#e9d5ff;font-size:10px;border-radius:6px;padding:5px 8px;line-height:1.5;text-align:left;">${tipText}</div>
    </div>`;
}

function _fvStatCardCenter(id, emoji, label, value, valColor, borderColor, tipText) {
    return `<div onclick="_fvTip('${id}')" style="cursor:pointer;background:#fff;border:1px solid ${borderColor};border-radius:8px;padding:6px;text-align:center;position:relative;">
      <div style="font-size:18px;font-weight:800;color:${valColor};">${value}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:3px;">
        <div style="font-size:10px;color:#6b7280;">${label}</div>
        <span style="font-size:10px;color:#a78bfa;opacity:0.8;">ⓘ</span>
      </div>
      <div id="fvtip-${id}" class="fvstat-tip" style="display:none;margin-top:4px;background:#1e1b4b;color:#e9d5ff;font-size:10px;border-radius:6px;padding:5px 8px;line-height:1.5;text-align:left;">${tipText}</div>
    </div>`;
}

function _khRenderStatistik() {
    const fv  = getFairyVillage();
    const st  = getFairyVillageStats(fv);
    const el  = document.getElementById('kh-stat-content');
    if (!el) return;
    const bCount   = (fv.buildings||[]).length;
    const qCount   = (fv.buildQueue||[]).length;
    const topFairy = (fv.fairies||[]).slice().sort((a,b)=>(b.level||1)-(a.level||1))[0];
    const avgLvl   = (fv.fairies||[]).length
        ? ((fv.fairies||[]).reduce((s,f)=>s+(f.level||1),0) / fv.fairies.length).toFixed(1)
        : '–';

    el.innerHTML = `
      <div style="font-family:Fredoka,sans-serif; color:#422006;">
        <div style="font-size:10px;color:#a78bfa;text-align:right;margin-bottom:6px;opacity:0.8;">Ketuk kartu untuk keterangan ⓘ</div>

        <!-- Sumber Daya -->
        <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:6px;">💰 Sumber Daya</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            ${_fvStatCard('debu','✨','Debu Peri', fv.resources.debu||0, '#d97706','#fde68a',
              'Mata uang utama Kahyangan. Dihasilkan peri bekerja di bangunan setiap hari. Dipakai untuk membangun & upgrade semua fasilitas.')}
            ${_fvStatCard('kristal','💎','Kristal', fv.resources.kristal||0, '#2563eb','#bfdbfe',
              'Material langka dari Sungai Brantas. Dibutuhkan untuk bangunan tier 2–3. Bisa didapat dari Kolam Kristal atau event khusus.')}
            ${_fvStatCard('cahaya','🌟','Cahaya', fv.resources.cahaya||0, '#ca8a04','#fef08a',
              'Energi suci peri. Diperlukan untuk bangunan tier 3 & upgrade istana. Dihasilkan Menara Cahaya 1×/minggu.')}
            ${_fvStatCard('makanan','🍽️','Makanan', fv.resources.makanan||0, '#16a34a','#bbf7d0',
              'Konsumsi harian peri. Tiap peri butuh 1 porsi/hari. Jika habis, kebahagiaan peri turun & produksi berhenti. Beli dari Rara Wilis.')}
          </div>
        </div>

        <!-- Populasi Peri -->
        <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:6px;">🧚 Populasi Peri</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
            ${_fvStatCardCenter('pop-aktif','🧚','Peri Aktif', (fv.fairies||[]).length, '#16a34a','#86efac',
              'Jumlah peri yang tinggal di Kahyangan saat ini. Peri baru lahir dari Pondok Peri & bangunan berkapasitas tinggi setiap hari.')}
            ${_fvStatCardCenter('pop-cap','🏠','Kapasitas', st.totalCap||0, '#16a34a','#86efac',
              'Batas maksimal peri yang bisa tinggal. Ditentukan oleh jumlah & tier bangunan hunian. Bangun lebih banyak Pondok/Omah Widadari untuk menambah kapasitas.')}
            ${_fvStatCardCenter('pop-lvl','⭐','Rata-rata Lvl', avgLvl, '#7c3aed','#e9d5ff',
              'Rata-rata level semua peri. Peri naik level saat bekerja & bahagia. Level tinggi meningkatkan produksi debu & peluang lahir peri baru.')}
          </div>
          ${topFairy ? `<div onclick="_fvTip('top-fairy')" style="cursor:pointer;margin-top:8px;background:#fff;border:1px solid #c084fc;border-radius:8px;padding:6px 10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:20px;">🏆</span>
              <div style="flex:1;">
                <div style="font-size:11px;font-weight:700;color:#7c3aed;">${topFairy.name} — Level ${topFairy.level||1}</div>
                <div style="font-size:10px;color:#94a3b8;">Peri Tertinggi Levelnya <span style="color:#a78bfa;">ⓘ</span></div>
              </div>
            </div>
            <div id="fvtip-top-fairy" class="fvstat-tip" style="display:none;margin-top:5px;background:#1e1b4b;color:#e9d5ff;font-size:10px;border-radius:6px;padding:5px 8px;line-height:1.5;">
              Peri dengan level tertinggi di Kahyangan. Semakin tinggi levelnya, semakin besar bonus produksi yang dia berikan ke bangunan tempat dia ditugaskan. Jaga kebahagiaannya agar terus berkembang!
            </div>
          </div>` : ''}
        </div>

        <!-- Infrastruktur -->
        <div style="background:#eff6ff;border:1.5px solid #93c5fd;border-radius:12px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:6px;">🏗️ Infrastruktur</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            ${_fvStatCardCenter('b-aktif','🏘️','Bangunan Aktif', bCount, '#2563eb','#93c5fd',
              'Jumlah bangunan yang sudah selesai dibangun & beroperasi. Setiap bangunan menghasilkan sumber daya & tempat tinggal peri.')}
            ${_fvStatCardCenter('b-antrian','⏳','Dalam Antrian', qCount, '#f59e0b','#fde68a',
              'Bangunan yang sedang dalam proses pembangunan. Setiap bangunan butuh waktu 1 menit untuk selesai. Kamu bisa punya beberapa antrian sekaligus.')}
            ${_fvStatCardCenter('b-debu','⚙️','Debu/Hari', st.dustPerDay||0, '#16a34a','#86efac',
              'Total debu peri yang dihasilkan semua bangunan dalam satu hari permainan. Semakin banyak peri bekerja & semakin tinggi tier bangunan, semakin besar produksinya.')}
            ${_fvStatCardCenter('b-cahaya','🌟','Cahaya/Minggu', st.cahayaPerWeek||0, '#ca8a04','#fef08a',
              'Total cahaya yang dihasilkan bangunan Menara Cahaya setiap minggu. Cahaya sangat langka — kelola dengan bijak untuk upgrade bangunan istimewa.')}
          </div>
        </div>
      </div>`;
}

function khTab(tab) {
    document.querySelectorAll('.kh-tab').forEach((t,i) => t.classList.toggle('on', i===(tab==='peri'?0:tab==='bangunan'?1:2)));
    const tp = document.getElementById('kh-t-peri');
    const tb = document.getElementById('kh-t-bangunan');
    const ts = document.getElementById('kh-t-statistik');
    if (tp) tp.style.display = tab==='peri'      ? 'block' : 'none';
    if (tb) tb.style.display = tab==='bangunan'  ? 'block' : 'none';
    if (ts) ts.style.display = tab==='statistik' ? 'block' : 'none';
    if (tab==='peri')      _khRenderPeri(_khIdx);
    if (tab==='bangunan')  _khRenderBangunan();
    if (tab==='statistik') _khRenderStatistik();
}

// ── TAB PERI ────────────────────────────────────────────────────
function khNav(d) {
    const fv = getFairyVillage();
    _khIdx = Math.max(0, Math.min(fv.fairies.length - 1, _khIdx + d));
    _khRenderPeri(_khIdx);
}

function _khImg(f) {
    const M = { t1:'images/rarawilis.png', t2:'images/wening.png', t3:'images/sekar.png', t4:'images/bening.png', t5:'images/juna.png' };
    if (M[f.id]) return M[f.id];
    // Peri lahir: pakai sprite index dari f.spriteIdx
    if (f.gender === 'girl') {
        const idx = (f.spriteIdx !== undefined ? f.spriteIdx : 0) % 4 + 1;
        return `images/peri_pr${idx}.png`;
    } else {
        const idx = (f.spriteIdx !== undefined ? f.spriteIdx : 0) % 2 + 1;
        return `images/peri_lk${idx}.png`;
    }
}
function _khMoodHTML(f) {
    const h = f.happiness ?? 80;
    const m = f.mood || (h>=70?'happy':h>=40?'neutral':h>=20?'sad':'bad_mood');
    const D = {
        happy:    ['😊 Senang',   'rgba(22,163,74,.12)',  '#15803d'],
        neutral:  ['😐 Biasa',    'rgba(217,119,6,.15)',  '#b45309'],
        sad:      ['😢 Sedih',    'rgba(59,130,246,.12)', '#1d4ed8'],
        bad_mood: ['😠 Bad Mood', 'rgba(239,68,68,.12)',  '#b91c1c'],
    };
    const [label, bg, col] = D[m] || D.happy;
    return `<span class="kh-mood" style="background:${bg};color:${col};border:1.5px solid ${col}">${label}</span>`;
}
function _khBar(pct, col) {
    return `<div class="kh-bt"><div class="kh-bf" style="width:${Math.min(100,Math.round(pct))}%;background:${col}"></div></div>`;
}
function _hintLvl(v, hi, mid) {
    return v >= hi ? 0 : v >= mid ? 1 : 2;
}

function _khRenderPeri(idx) {
    const fv = getFairyVillage();
    const list = fv.fairies;
    const wrap = document.getElementById('kh-fc-wrap');
    const act  = document.getElementById('kh-factions');
    const pg   = document.getElementById('kh-pg');
    const pBtn = document.getElementById('kh-prev');
    const nBtn = document.getElementById('kh-next');
    if (!wrap) return;

    if (!list.length) {
        wrap.innerHTML = `<div class="kh-empty" style="padding:24px 14px"><div class="kh-ej">🧚</div><p class="kh-ep">Belum ada Widadari.<br>Bangun <b>Padepokan Cilik</b> agar peri bisa datang!</p></div>`;
        if (act)  act.innerHTML = '';
        if (pg)   pg.textContent = '0 / 0';
        if (pBtn) pBtn.disabled = true;
        if (nBtn) nBtn.disabled = true;
        return;
    }

    _khIdx = Math.max(0, Math.min(list.length - 1, idx));
    const f = list[_khIdx];
    if (pg)   pg.textContent = `${_khIdx + 1} / ${list.length}`;
    if (pBtn) pBtn.disabled = (_khIdx === 0);
    if (nBtn) nBtn.disabled = (_khIdx === list.length - 1);

    const intel   = f.intel   ?? 10;
    const agility = f.agility ?? 10;
    const spirit  = f.spirit  ?? 10;
    const hp      = f.hp      ?? 80;
    const maxHp   = f.maxHp   ?? 100;
    const hap     = f.happiness ?? 80;
    const lv      = f.level   ?? 1;
    const fixed   = KH_FIXED.includes(f.id);

    const buildHints  = ['⚡ Konstruksi Cepat', '🔧 Konstruksi Normal', '🐢 Konstruksi Lambat'];
    const agilHints   = ['🏃 Jelajah Luas',     '🚶 Jelajah Normal',   '🐌 Jelajah Terbatas'];
    const spiritHints = ['✨ Serbuk ×2',         '✨ Serbuk ×1.5',      '✨ Serbuk ×1'];
    const bh = buildHints[_hintLvl(intel,25,15)];
    const ah = agilHints[_hintLvl(agility,25,15)];
    const sh = spiritHints[_hintLvl(spirit,25,15)];

    wrap.innerHTML = `<div class="kh-fc">
      <div class="kh-prow">
        <img class="kh-port" src="${_khImg(f)}" onerror="this.src='images/rarawilis.png'" alt="${f.name}">
        <div class="kh-finfo">
          <div class="kh-fname">${f.name}${fixed ? ' 🔒' : ''}</div>
          <div class="kh-fsub">${f.gender==='girl'?'🧚‍♀️ Widadari':'🧚‍♂️ Peri'} · Lv.${lv}</div>
          ${_khMoodHTML(f)}
        </div>
      </div>
      <div class="kh-stats">
        <div class="kh-si">
          <div class="kh-slr"><span>❤️ HP</span><span class="kh-sv">${hp}/${maxHp}</span></div>
          ${_khBar(hp/maxHp*100,'#f87171')}
        </div>
        <div class="kh-si">
          <div class="kh-slr"><span>😊 Kebahagiaan</span><span class="kh-sv">${hap}%</span></div>
          ${_khBar(hap,'#4ade80')}
        </div>
        <div class="kh-si">
          <div class="kh-slr"><span>🧠 Intelijen</span><span class="kh-sv">${intel}/30</span></div>
          ${_khBar(intel/30*100,'#60a5fa')}
          <div class="kh-hint">${bh}</div>
        </div>
        <div class="kh-si">
          <div class="kh-slr"><span>⚡ Ketangkasan</span><span class="kh-sv">${agility}/30</span></div>
          ${_khBar(agility/30*100,'#fbbf24')}
          <div class="kh-hint">${ah}</div>
        </div>
        <div class="kh-si">
          <div class="kh-slr"><span>🌟 Semangat</span><span class="kh-sv">${spirit}/30</span></div>
          ${_khBar(spirit/30*100,'#e879f9')}
          <div class="kh-hint">${sh}</div>
        </div>
      </div>
    </div>`;

    if (act) act.innerHTML =
        `<button class="kh-ab" onclick="khFeed()">🍽️ Beri Makan</button>` +
        (!fixed ? `<button class="kh-ab" onclick="khRename()">✏️ Ganti Nama</button>` : '');

    _khRefRes();
}

function khFeed() {
    const fv = getFairyVillage();
    const f  = fv.fairies[_khIdx];
    if (!f) return;
    if ((fv.resources.makanan || 0) >= 1) {
        fv.resources.makanan--;
        f.happiness = Math.min(100, (f.happiness || 80) + 10);
        f.mood = f.happiness >= 70 ? 'happy' : f.happiness >= 40 ? 'neutral' : 'sad';
        showToast(`🍽️ ${f.name} makan! Kebahagiaan: ${f.happiness}%`);
        _khRenderPeri(_khIdx);
    } else {
        showToast('❌ Stok makanan habis! Beli dulu.');
    }
}
function khBuyFood() {
    const fv = getFairyVillage();
    if ((fv.resources.debu || 0) >= 30) {
        fv.resources.debu -= 30;
        fv.resources.makanan = (fv.resources.makanan || 0) + 10;
        showToast('🛒 +10 porsi makanan!');
        _khRefRes();
    } else {
        showToast('❌ Serbuk tidak cukup (butuh 30)!');
    }
}
function khRename() {
    const fv = getFairyVillage();
    const f  = fv.fairies[_khIdx];
    if (!f || KH_FIXED.includes(f.id)) return;
    const n = window.prompt(`Ganti nama "${f.name}":`, f.name);
    if (n && n.trim()) { f.name = n.trim().slice(0, 20); showToast(`✏️ Nama diubah: ${f.name}`); _khRenderPeri(_khIdx); }
}

// ── TAB BANGUNAN ─────────────────────────────────────────────────
function _khRenderBangunan() {
    const fv   = getFairyVillage();
    const built = fv.buildings  || [];
    const queue = fv.buildQueue || [];
    const bl    = document.getElementById('kh-blist');
    const cw    = document.getElementById('kh-catalog-wrap');
    if (!bl) return;
    cw.style.display = 'none';
    bl.style.display = 'flex';
    bl.style.flexDirection = 'column';
    bl.style.gap = '10px';
    bl.style.padding = '12px';

    const now = Date.now();
    let html = '';

    // Queue
    if (queue.length) {
        html += `<div class="kh-sec">⏳ Sedang Dibangun / Upgrade</div>`;
        queue.forEach(q => {
            const b = FAIRY_BUILDINGS[q.bid] || {};
            const s = Math.max(0, Math.ceil((q.finishTime - now) / 1000));
            const lbl = q.isUpgrade ? `⬆️ Upgrade → ${b.name||q.bid}` : (b.name||q.bid);
            html += `<div class="kh-qi">
              <span class="kh-be">${b.emoji||'🏗️'}</span>
              <div style="flex:1"><div class="kh-bn">${lbl}</div>
              <div class="kh-qt">⏳ Selesai dalam ${s}s</div></div>
            </div>`;
        });
    }

    // Built
    if (built.length) {
        html += `<div class="kh-sec">✅ Terbangun (${built.length})</div>`;
        built.forEach((bldg, bldgIdx) => {
            const {bid, workers} = bldg;
            const b = FAIRY_BUILDINGS[bid] || {};
            const maxW = b.maxWorkers || 2;

            // Produksi aktual dengan worker
            const fx = [];
            if (b.maxFairies)     fx.push(`+${b.maxFairies} kap.`);
            if (b.dustPerDay)     fx.push(`+${b.dustPerDay}✨/hr`);
            if (b.foodPerDay)     fx.push(`+${b.foodPerDay}🍽️/hr`);
            if (b.happinessBonus) fx.push(`+${b.happinessBonus}❤️`);
            if (b.birthChance)    fx.push(`${Math.round(b.birthChance*100)}% lahir`);
            if (b.xpBonus)        fx.push(`XP×${b.xpBonus}`);
            if (b.dustMultiplier) fx.push(`✨×${b.dustMultiplier}`);
            if (b.enableTrading)  fx.push(`💱 Trade`);
            if (b.tradeBonus>1)   fx.push(`+${Math.round((b.tradeBonus-1)*100)}% rate`);

            let prodNote = '';
            if (b.dustPerDay && (workers||[]).length > 0) {
                const wk = workers || [];
                const avgSp = wk.reduce((s,id) => {
                    const f = (fv.fairies||[]).find(x=>x.id===id);
                    return s + (f?.spirit||10);
                }, 0) / wk.length;
                const mult = avgSp >= 25 ? 2 : avgSp >= 15 ? 1.5 : 1;
                const actual = Math.round(b.dustPerDay * mult);
                if (actual !== b.dustPerDay) prodNote = ` <span style="color:#4ade80">→${actual}✨</span>`;
            }

            // Worker slots
            let workerHTML = `<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;align-items:center">`;
            workerHTML += `<span style="font-size:10px;color:#a78bfa;font-weight:700">👷 ${(workers||[]).length}/${maxW}:</span>`;
            for (let wi = 0; wi < maxW; wi++) {
                const wid = (workers||[])[wi];
                const wf  = wid ? (fv.fairies||[]).find(f=>f.id===wid) : null;
                if (wf) {
                    workerHTML += `<span style="background:rgba(124,58,237,.3);border:1.5px solid #7c3aed;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:700;color:#e9d5ff;display:flex;align-items:center;gap:4px">
                        🧚 ${wf.name}
                        <button onclick="_khUnassign(${bldgIdx},${wi})" style="background:rgba(239,68,68,.3);border:1px solid #ef4444;color:#fca5a5;border-radius:4px;padding:0 4px;font-size:10px;cursor:pointer;line-height:1.6">✕</button>
                    </span>`;
                } else {
                    workerHTML += `<button onclick="_khAssign(${bldgIdx})" style="background:rgba(255,255,255,.07);border:1.5px dashed rgba(124,58,237,.5);border-radius:8px;padding:2px 9px;font-size:11px;font-weight:700;color:#a78bfa;cursor:pointer">+</button>`;
                }
            }
            workerHTML += '</div>';

            // Tier badge + upgrade button
            const tierColors = ['#4ade80','#60a5fa','#c084fc','#fb923c','#fbbf24'];
            const tierC = tierColors[b.tier] || '#60a5fa';
            const tierBadge = `<span style="background:rgba(0,0,0,.3);border:1px solid ${tierC};color:${tierC};border-radius:6px;padding:1px 7px;font-size:10px;font-weight:700">T${b.tier}</span>`;

            // Cek upgrade
            let upgradeBtn = '';
            if (b.upgradeTo && FAIRY_BUILDINGS[b.upgradeTo]) {
                const nextB = FAIRY_BUILDINGS[b.upgradeTo];
                const uc = b.upgradeCost || {};
                const canUpgrade = Object.entries(uc).every(([k,v]) => (fv.resources[k]||0) >= v);
                const costStr = Object.entries(uc).map(([k,v])=>`${v}${k==='debu'?'✨':k==='kristal'?'💎':'🌟'}`).join(' ');
                const isInQueue = (fv.buildQueue||[]).some(q => q.slotId === bldg.slotId && q.isUpgrade);
                if (isInQueue) {
                    upgradeBtn = `<button disabled style="background:rgba(251,191,36,.1);border:1px solid #fbbf24;color:#fbbf24;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;cursor:not-allowed;margin-top:6px">⏳ Sedang upgrade...</button>`;
                } else {
                    upgradeBtn = `<button onclick="_khUpgrade(${bldgIdx})" style="background:${canUpgrade?'rgba(124,58,237,.25)':'rgba(100,100,100,.15)'};border:1.5px solid ${canUpgrade?'#7c3aed':'#555'};color:${canUpgrade?'#c4b5fd':'#888'};border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;cursor:${canUpgrade?'pointer':'not-allowed'};margin-top:6px">
                        ⬆️ Upgrade → ${nextB.emoji} ${nextB.name.replace(/^[^\s]+\s/,'')} (${costStr})
                    </button>`;
                }
            }

            html += `<div class="kh-bi" style="flex-direction:column;align-items:flex-start;gap:4px">
              <div style="display:flex;align-items:center;gap:10px;width:100%">
                <span class="kh-be" style="border-color:${tierC}">${b.emoji||'🏠'}</span>
                <div style="flex:1">
                  <div style="display:flex;align-items:center;gap:6px">
                    <div class="kh-bn">${b.name||bid}</div>${tierBadge}
                  </div>
                  <div class="kh-bd">${fx.join(' · ')||b.desc||''}${prodNote}</div>
                </div>
              </div>
              ${workerHTML}
              ${upgradeBtn}
            </div>`;
        });
    }

    if (!built.length && !queue.length) {
        html = `<div class="kh-empty">
          <div class="kh-ej">🏚️</div>
          <p class="kh-ep">Belum ada bangunan di Kahyangan Wilis.<br>Mulai membangun untuk menghidupkan kembali!</p>
        </div>`;
    }

    html += `<button class="kh-big-btn" onclick="_khShowCatalog()">🏗️ Bangun Bangunan Baru</button>`;
    bl.innerHTML = html;
    _khRefRes();
}

function _khShowCatalog() {
    const fv  = getFairyVillage();
    const bl  = document.getElementById('kh-blist');
    const cw  = document.getElementById('kh-catalog-wrap');
    if (!cw) return;
    bl.style.display = 'none';
    cw.style.display = 'flex';
    cw.style.flexDirection = 'column';
    cw.style.gap = '10px';
    cw.style.padding = '12px';

    const queueBids = new Set((fv.buildQueue||[]).filter(q=>!q.isUpgrade).map(b=>b.bid));
    const usedSlots = new Set([...(fv.buildings||[]),...(fv.buildQueue||[])].map(b=>b.slotId));
    const noSlot    = FAIRY_SLOTS.filter(s=>!usedSlots.has(s.id)).length === 0;
    const res       = fv.resources;

    let html = `<button class="kh-back-btn" onclick="_khRenderBangunan()">◀ Kembali ke Daftar</button>`;
    html += `<div class="kh-sec" style="margin-top:8px">🏗️ Bangun Baru (Tier 1)</div>`;
    html += `<div style="font-size:11px;color:#a78bfa;padding:0 2px 6px">💡 Tier 2 & 3 dibuka lewat ⬆️ Upgrade pada bangunan yang sudah berdiri.</div>`;

    // Hanya tier 1, bukan builtIn, bukan legacy
    Object.entries(FAIRY_BUILDINGS).filter(([,b]) => b.tier===1 && !b.builtIn && !b.legacy)
    .forEach(([bid, b]) => {
        const isQueue   = queueBids.has(bid);
        const canAfford = Object.entries(b.cost||{}).every(([k,v]) => (res[k]||0) >= v);
        const canBuild  = !isQueue && canAfford && !noSlot;
        const costStr   = Object.entries(b.cost||{}).map(([k,v]) =>
            `${v}${k==='debu'?'✨':k==='kristal'?'💎':'🌟'}`).join(' ');
        const builtCount = (fv.buildings||[]).filter(bd=>bd.bid===bid).length;

        let sc, st;
        if (isQueue)       { sc='done'; st='⏳ Antri'; }
        else if (noSlot)   { sc='no';   st='❌ Slot Penuh'; }
        else if (!canAfford){ sc='no';  st='❌ Debu Kurang'; }
        else               { sc='ok';   st='🔨 Bangun'; }

        const lk = !canBuild ? 'lk' : '';
        const oc = canBuild ? `onclick="_khBuild('${bid}')"` : '';
        const badge = builtCount > 0 ? `<span style="background:rgba(74,222,128,.2);border:1px solid #4ade80;color:#4ade80;border-radius:6px;padding:1px 6px;font-size:10px;margin-left:4px">${builtCount} ada</span>` : '';
        html += `<div class="kh-ci ${lk}" ${oc}>
          <span class="kh-ce">${b.emoji||'🏠'}</span>
          <div style="flex:1">
            <div class="kh-cn">${b.name}${badge}</div>
            <div class="kh-cdesc">${b.desc||''}</div>
            <div style="font-size:10px;color:#4ade80;font-weight:700;margin-top:2px">📦 ${b.produce||''}</div>
            <div class="kh-cc">Biaya: ${costStr||'Gratis'} · ⏳60s · 👷 ${b.maxWorkers||1} slot worker</div>
          </div>
          <span class="kh-cs ${sc}">${st}</span>
        </div>`;
    });
    cw.innerHTML = html;
    _khRefRes();
}

function _khBuild(bid) {
    const fv = getFairyVillage();
    const b  = FAIRY_BUILDINGS[bid];
    if (!b) return;
    if (!Object.entries(b.cost||{}).every(([k,v]) => (fv.resources[k]||0) >= v)) {
        showToast('❌ Resource tidak cukup!'); return;
    }
    const usedSlots = new Set([...(fv.buildings||[]),...(fv.buildQueue||[])].map(x=>x.slotId));
    const freeSlots = FAIRY_SLOTS.filter(s=>!usedSlots.has(s.id));
    if (!freeSlots.length) { showToast('❌ Semua slot penuh!'); return; }

    Object.entries(b.cost||{}).forEach(([k,v]) => { fv.resources[k] = (fv.resources[k]||0) - v; });
    const px = STATE.player.x, py = STATE.player.y;
    const TS2 = 30;
    const best = freeSlots.sort((a,z) => Math.hypot(a.x*TS2-px,a.y*TS2-py) - Math.hypot(z.x*TS2-px,z.y*TS2-py))[0];
    fv.buildQueue = fv.buildQueue || [];
    fv.buildQueue.push({ slotId: best.id, bid, finishTime: Date.now() + 60000 });
    showToast(`⏳ ${b.name} mulai dibangun! Selesai 60 detik.`);
    _khShowCatalog();
}

// ── ASSIGN / UNASSIGN PERI KE BANGUNAN ──────────────────────────
function _khAssign(bldgIdx) {
    const fv = getFairyVillage();
    const bldg = fv.buildings[bldgIdx];
    if (!bldg) return;
    bldg.workers = bldg.workers || [];
    // FIX: Gunakan maxWorkers dari definisi bangunan (tier 3 = 3 worker), bukan hardcode 2
    const bDef = FAIRY_BUILDINGS[bldg.bid];
    const maxW = bDef?.maxWorkers || 2;
    if (bldg.workers.length >= maxW) { showToast(`❌ Slot sudah penuh (maks ${maxW} peri)!`); return; }

    // Peri yang belum ditugaskan di bangunan ini
    // FIX: Exclude Rara Wilis (t1) — dia NPC utama, bukan worker
    const _EXCLUDED_WORKER_IDS = ['t1'];
    const assignedAll = new Set(fv.buildings.flatMap(b => b.workers||[]));
    const available   = (fv.fairies||[]).filter(f => !bldg.workers.includes(f.id) && !_EXCLUDED_WORKER_IDS.includes(f.id));

    if (!available.length) { showToast('❌ Semua peri sudah ditugaskan!'); return; }

    // Tampilkan picker — simpel list di body bangunan
    const bl = document.getElementById('kh-blist');
    if (!bl) return;

    const b = FAIRY_BUILDINGS[bldg.bid] || {};
    let html = `<div style="padding:14px;display:flex;flex-direction:column;gap:10px">
      <div style="font-family:'Fredoka',sans-serif;font-size:15px;color:#e9d5ff;font-weight:700">👷 Tugaskan Peri ke<br>${b.emoji||''} ${b.name||bldg.bid}</div>
      <div style="font-size:12px;color:#a78bfa">Pilih peri yang akan bekerja di bangunan ini.<br>Semangat tinggi → produksi lebih banyak!</div>`;

    available.forEach(f => {
        const spHint = f.spirit>=25?'✨×2':f.spirit>=15?'✨×1.5':'✨×1';
        const isBusy = assignedAll.has(f.id) ? '<span style="color:#fbbf24;font-size:10px"> (sudah ditugaskan)</span>' : '';
        html += `<div style="background:rgba(255,255,255,.07);border:2px solid rgba(124,58,237,.3);border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:10px;cursor:pointer" onclick="_khDoAssign(${bldgIdx},'${f.id}')">
          <img src="${_khImg(f)}" onerror="this.src='images/rarawilis.png'" style="width:36px;height:46px;object-fit:cover;object-position:top;border-radius:8px;border:2px solid #7c3aed;image-rendering:pixelated">
          <div style="flex:1">
            <div style="font-family:'Fredoka',sans-serif;font-size:14px;color:#e9d5ff;font-weight:700">${f.name}${isBusy}</div>
            <div style="font-size:11px;color:#a78bfa">Lv.${f.level||1} · 🌟${f.spirit} ${spHint}</div>
          </div>
        </div>`;
    });

    html += `<button class="kh-back-btn" onclick="_khRenderBangunan()">◀ Batal</button></div>`;
    bl.innerHTML = html;
}

function _khDoAssign(bldgIdx, fairyId) {
    const fv   = getFairyVillage();
    const bldg = fv.buildings[bldgIdx];
    if (!bldg) return;
    bldg.workers = bldg.workers || [];
    // FIX: Gunakan maxWorkers dari definisi bangunan, bukan hardcode 2
    const bDef2 = FAIRY_BUILDINGS[bldg.bid];
    const maxW2 = bDef2?.maxWorkers || 2;
    if (bldg.workers.length >= maxW2) { showToast(`❌ Slot penuh (maks ${maxW2} peri)!`); _khRenderBangunan(); return; }
    // FIX: Rara Wilis tidak boleh jadi worker
    if (fairyId === 't1') { showToast('❌ Rara Wilis tidak bisa ditugaskan!'); _khRenderBangunan(); return; }
    if (bldg.workers.includes(fairyId)) { showToast('⚠️ Peri sudah ada di sini!'); _khRenderBangunan(); return; }
    bldg.workers.push(fairyId);
    const f = (fv.fairies||[]).find(x=>x.id===fairyId);
    showToast(`✅ ${f?.name||fairyId} ditugaskan ke bangunan!`);
    _khRenderBangunan();
}

function _khUnassign(bldgIdx, workerSlot) {
    const fv   = getFairyVillage();
    const bldg = fv.buildings[bldgIdx];
    if (!bldg || !bldg.workers) return;
    const fid = bldg.workers[workerSlot];
    bldg.workers.splice(workerSlot, 1);
    const f = (fv.fairies||[]).find(x=>x.id===fid);
    showToast(`↩️ ${f?.name||fid} ditarik dari tugas.`);
    _khRenderBangunan();
}

// ── UPGRADE BANGUNAN IN-PLACE ────────────────────────────────────
function _khUpgrade(bldgIdx) {
    const fv   = getFairyVillage();
    const bldg = fv.buildings[bldgIdx];
    if (!bldg) return;
    const b    = FAIRY_BUILDINGS[bldg.bid];
    if (!b?.upgradeTo) { showToast('❌ Bangunan ini tidak bisa diupgrade!'); return; }

    const nextBid = b.upgradeTo;
    const nextB   = FAIRY_BUILDINGS[nextBid];
    if (!nextB) { showToast('❌ Data upgrade tidak ditemukan!'); return; }

    // Cek resource
    const uc = b.upgradeCost || {};
    if (!Object.entries(uc).every(([k,v]) => (fv.resources[k]||0) >= v)) {
        const need = Object.entries(uc).map(([k,v])=>`${v}${k==='debu'?'✨':k==='kristal'?'💎':'🌟'}`).join(' ');
        showToast(`❌ Resource kurang! Butuh: ${need}`); return;
    }

    // Cek tidak sedang ada queue di slot ini
    const alreadyQueued = (fv.buildQueue||[]).some(q => q.slotId === bldg.slotId && q.isUpgrade);
    if (alreadyQueued) { showToast('⏳ Slot ini sedang dalam proses upgrade!'); return; }

    // Kurangi resource
    Object.entries(uc).forEach(([k,v]) => { fv.resources[k] = (fv.resources[k]||0) - v; });

    // Tambah ke queue dengan flag isUpgrade + bldgIdx
    fv.buildQueue = fv.buildQueue || [];
    fv.buildQueue.push({
        slotId:     bldg.slotId,
        bid:        nextBid,
        finishTime: Date.now() + BUILD_DURATION_MS,
        isUpgrade:  true,
        bldgIdx:    bldgIdx,   // untuk in-place replacement
    });

    showToast(`⬆️ Upgrade ${b.name} → ${nextB.name} dimulai! (60 detik)`);
    _khRenderBangunan();
}

// backward compat stubs
function openFairyListDialog() { khOpen(); }
function openBuildMenu() { khOpen(); setTimeout(()=>khTab('bangunan'), 60); }
function showFairyCardModal() { khOpen(); }


// ─────────────────────────────────────────────────────────────
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
// HUD
// ─────────────────────────────────────────────────────────────
function updateFVHUD(){
    const fv=getFairyVillage(), stats=getFairyVillageStats(fv);
    const g=id=>document.getElementById(id);
    // Legacy elements (jika ada)
    if(g('fv-hud-debu'))    g('fv-hud-debu').textContent=fv.resources.debu||0;
    if(g('fv-hud-kristal')) g('fv-hud-kristal').textContent=fv.resources.kristal||0;
    if(g('fv-hud-cahaya'))  g('fv-hud-cahaya').textContent=fv.resources.cahaya||0;
    if(g('fv-hud-makanan')) g('fv-hud-makanan').textContent=fv.resources.makanan||0;
    if(g('fv-hud-pop'))     g('fv-hud-pop').textContent=`${fv.fairies.length}/${stats.totalCap}`;
    if(g('fv-hud-queue'))   g('fv-hud-queue').textContent=(fv.buildQueue||[]).length;
    // New top HUD bar
    if(g('fvbar-debu'))    g('fvbar-debu').textContent    = fv.resources.debu    || 0;
    if(g('fvbar-kristal')) g('fvbar-kristal').textContent = fv.resources.kristal || 0;
    if(g('fvbar-cahaya'))  g('fvbar-cahaya').textContent  = fv.resources.cahaya  || 0;
    if(g('fvbar-makanan')) g('fvbar-makanan').textContent = fv.resources.makanan || 0;
    if(g('fvbar-pop'))     g('fvbar-pop').textContent     = `${fv.fairies.length}/${stats.totalCap}`;
    if(g('fvbar-time-label') && typeof getFVTimeOfDay==='function'){
        const _tod3=getFVTimeOfDay(), _sea3=getFVSeason();
        const _ti={pagi:'🌅',siang:'☀️',sore:'🌤️',senja:'🌇',malam:'🌙'};
        g('fvbar-time-label').textContent=(_ti[_tod3]||'🌙')+' '+(_tod3.charAt(0).toUpperCase()+_tod3.slice(1))+'  |  '+_sea3.label;
    }
}

// ─────────────────────────────────────────────────────────────
// TEST MODE
// ─────────────────────────────────────────────────────────────
function openFairyTestMode(){
    const p=STATE.player;
    p.sylvariaQuestComplete=true;
    p.sylvariaQuest={stage:99,task1:true,task2:true,task3:true,task4:true};
    if(!p.spriteIdle) selectGender(p.gender||'boy',true);
    if(!p.name||!p.name.trim()) p.name=document.getElementById('hud-name')?.textContent?.trim()||'Arsa';

    STATE.isPrologue = false;
    STATE.screen = 'play';
    const dialogBox = document.getElementById('dialogue-wrapper');
    if (dialogBox) dialogBox.style.display = 'none';

    const fv = getFairyVillage();
    fv.resources = { debu:9999, kristal:99, cahaya:99, makanan:50 };
    fv.fairies = [
        {id:'t1',name:'Rara Wilis',gender:'girl',level:5,xp:0,happiness:100,mood:'happy',intel:28,agility:22,spirit:30,hp:100,maxHp:100},
        {id:'t2',name:'Wening',    gender:'girl',level:3,xp:0,happiness:90, mood:'happy',intel:20,agility:18,spirit:22,hp:90, maxHp:100},
        {id:'t3',name:'Sekar',     gender:'girl',level:2,xp:0,happiness:85, mood:'happy',intel:16,agility:24,spirit:15,hp:85, maxHp:100},
        {id:'t4',name:'Bening',    gender:'girl',level:1,xp:0,happiness:80, mood:'happy',intel:12,agility:15,spirit:18,hp:80, maxHp:100},
        {id:'t5',name:'Juna',      gender:'boy', level:3,xp:0,happiness:88, mood:'happy',intel:18,agility:25,spirit:14,hp:88, maxHp:100},
    ];
    // Pre-built buildings dengan beberapa worker sudah ditugaskan
    fv.buildings = [
        { slotId:'s1',  bid:'pondok_peri',   workers:['t2'] },
        { slotId:'s7',  bid:'taman_mini',    workers:['t3','t4'] },
        { slotId:'s11', bid:'kolam_kristal', workers:[] },
    ];
    fv.buildQueue = [];
    fv.isTestMode = true;         // tombol test selalu muncul di menu Rara Wilis
    fv.fvTutorialDone = false;    // reset agar tutorial jalan saat masuk
    fv.tutorialDone   = false;    // reset flag lama juga
    fv.isFirstVisit   = false;    // jangan reset resource ke starter (resource sudah di-set di atas)
    refreshFairyVillageMap();
    showToast('🧚 TEST MODE — Masuk Kahyangan Wilis!');
    openFairyVillage();
}

// ══════════════════════════════════════════════════════════════
// 👹 TEST MODE — MONSTER PENCURI SKRIPSI / IJAZAH
// ══════════════════════════════════════════════════════════════
// 👹 TEST MODE — MONSTER PENCURI SKRIPSI / IJAZAH
// Alur: set quest → monster muncul di peta → teleport dekat → klik → battle
// ══════════════════════════════════════════════════════════════
function openSkripsiThiefTestMode() {
    const p = STATE.player;

    // --- 1. Setup dasar player ---
    STATE.isPrologue = false;
    STATE.screen = 'play';
    STATE.isDayChanging = false;

    // Pastikan sprite sudah terpilih
    if (!p.spriteIdle) selectGender(p.gender || 'boy', true);
    if (!p.name || !p.name.trim()) p.name = document.getElementById('hud-name')?.textContent?.trim() || 'Arsa';

    // Tutup semua dialog/modal
    const dialogBox = document.getElementById('dialogue-wrapper');
    if (dialogBox) dialogBox.style.display = 'none';
    if (typeof closeFairyVillage === 'function') closeFairyVillage();

    // --- 2. Boost stat ---
    p.hp = p.maxHp = 200;
    p.energy = 100;
    p.str   = (p.str  || 0) < 30 ? 30 : p.str;
    p.int   = (p.int  || 0) < 20 ? 20 : p.int;
    p.level = (p.level|| 1) < 5  ? 5  : p.level;
    p.role  = p.role || 'student';
    p.attackCooldown = 0; p.skillCooldown = 0;
    p.invincible = false; p.damageCooldown = 0;
    if (typeof STATE.enemies !== 'undefined') STATE.enemies = [];

    // --- 3. Set activeQuest = 'find_draft' agar monster_skripsi muncul di peta ---
    //    (renderer cek STATE.player.activeQuest, bukan p.quests)
    p.activeQuest = 'find_draft';
    if (!p.quests) p.quests = {};
    p.quests['find_draft'] = { status: 'active', day: STATE.day };

    // --- 4. Teleport ke dekat monster (x:50,y:13 di village) ---
    STATE.location = 'village';
    p.x = 47 * TILE_SIZE;
    p.y = 13 * TILE_SIZE;

    // --- 5. Update HUD & tampilkan toast petunjuk ---
    if (typeof updateHUD === 'function') updateHUD();
    showToast('👹 Monster Pencuri Naskah muncul! Dekati dan klik untuk battle!');

    // --- 6. Setelah 600ms tampilkan dialog pengantar singkat ---
    setTimeout(() => {
        showDialogue(
            '👹 TEST MODE — PENCURI NASKAH',
            '🔧 Stat sudah di-boost:\n' +
            `• HP: ${p.hp}/${p.maxHp}  STR: ${p.str}  INT: ${p.int}\n\n` +
            '👁️ Monster Pencuri Naskah sudah muncul di peta!\n' +
            'Dekati lalu klik untuk mulai battle.\n\n' +
            'Atau tekan "⚔️ Langsung Battle!" untuk skip ke arena.',
            [
                {
                    text: '⚔️ Langsung Battle!',
                    action: () => {
                        closeDialogue();
                        setTimeout(() => {
                            if (typeof window.startRuinsBattle === 'function') {
                                window.startRuinsBattle();
                            } else {
                                showToast('⚠️ startRuinsBattle tidak ditemukan!');
                            }
                        }, 200);
                    }
                },
                {
                    text: '🗺️ Oke, Cari Dulu',
                    action: () => {
                        closeDialogue();
                        showToast('📍 Monster ada di sekitar x:50, y:13 — timur laut peta!');
                    }
                }
            ],
            'images/monster-thief.png'
        );
    }, 600);
}

// ── TEST: Trigger kelahiran peri manual (dari menu Rara Wilis di test mode) ──
function testFairyBirth() {
    const fv = getFairyVillage();
    const g = Math.random() < 0.6 ? 'girl' : 'boy';
    const names = g==='girl' ? FAIRY_NAMES_GIRL : FAIRY_NAMES_BOY;
    const spriteIdx = Math.floor(Math.random() * (g==='girl'?4:2));
    const newFairy = {
        id: 'f_test_'+Date.now(),
        name: names[Math.floor(Math.random()*names.length)],
        gender:g, level:1, xp:0, happiness:80, mood:'happy',
        intel:_fairyStat(), agility:_fairyStat(), spirit:_fairyStat(),
        hp:80+Math.floor(Math.random()*20), maxHp:100,
        spriteIdx, isBorn:true,
    };
    fv.fairies.push(newFairy);
    if (typeof closeDialogue==='function') closeDialogue();
    setTimeout(()=>showFairyBirthPopup(newFairy, '🏠 Pondok Peri'), 200);
}

// ─────────────────────────────────────────────────────────────
// LEGACY STUBS
// ─────────────────────────────────────────────────────────────
function earnFairyKristal(amount){
    const fv=getFairyVillage();
    fv.resources.kristal=(fv.resources.kristal||0)+amount;
    showToast(`💎 +${amount} Kristal Brantas!`);
}

        </script>
