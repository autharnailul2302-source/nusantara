// ========================================================
// js/19_report_engine.js
// Potret Masa Depanku - Laporan Akhir
// ========================================================

            // ═══════════════════════════════════════════════════════════
            // 📋 POTRET MASA DEPANKU — ENGINE LAPORAN AKHIR
            // ═══════════════════════════════════════════════════════════

            // Warna tema per jalur
            const POTRET_THEME = {
                worker:       { bg: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #3b82f6 100%)', accent: '#3b82f6', light: '#dbeafe', text: '#1e40af', seal: '#1d4ed8' },
                student:      { bg: 'linear-gradient(135deg, #1a1a2e 0%, #6d28d9 60%, #8b5cf6 100%)', accent: '#8b5cf6', light: '#ede9fe', text: '#5b21b6', seal: '#6d28d9' },
                entrepreneur: { bg: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #f59e0b 100%)', accent: '#f59e0b', light: '#fef3c7', text: '#92400e', seal: '#d97706' },
                family:       { bg: 'linear-gradient(135deg, #831843 0%, #db2777 60%, #ec4899 100%)', accent: '#ec4899', light: '#fce7f3', text: '#9d174d', seal: '#be185d' },
                none:         { bg: 'linear-gradient(135deg, #1e293b 0%, #334155 60%, #475569 100%)', accent: '#94a3b8', light: '#f1f5f9', text: '#64748b', seal: '#334155' }
            };

            // Nama jalur dalam bahasa Indonesia
            const ROLE_LABEL = {
                worker: '⚔️ Pekerja (Fighter)',
                student: '🎓 Mahasiswa (Mage)',
                entrepreneur: '🏪 Wirausaha (Support)',
                family: '🏠 Keluarga (Family)',
                none: '❓ Belum Memilih'
            };

            // Definisi kompetensi yang diukur per jalur
            function getKompetensi(p) {
                const role = p.role || 'none';
                const str = p.str || 0;
                const int = p.int || 0;
                const biz = p.biz || 0;
                const rep = p.reputation || 0;
                const maxStat = 100;

                const base = [
                    { name: 'Physical Strength', label: 'STR', val: str, max: maxStat, color: '#ef4444', bg: '#fef2f2' },
                    { name: 'Intelligence',       label: 'INT', val: int, max: maxStat, color: '#3b82f6', bg: '#eff6ff' },
                    { name: 'Business Acumen',    label: 'BIZ', val: biz, max: maxStat, color: '#10b981', bg: '#f0fdf4' },
                    { name: 'Reputation / Sosial',label: 'REP', val: rep, max: 200,     color: '#ec4899', bg: '#fdf4ff' },
                ];

                // Tambah kompetensi turunan
                const journalCount = (p.reflections || []).length;
                const fishingCount = p.totalFishingCount || p.dailyFishingCount || 0;
                const houseLevel   = p.houseLevel || 1;

                base.push(
                    { name: 'Refleksi Diri',   label: '📝', val: Math.min(journalCount * 10, 100), max: 100, color: '#f59e0b', bg: '#fffbeb' },
                    { name: 'Gaya Hidup Sehat', label: '🎣', val: Math.min(fishingCount * 5, 100),  max: 100, color: '#06b6d4', bg: '#ecfeff' },
                );

                if (role === 'entrepreneur' || role === 'family') {
                    base.push({ name: 'Aset & Properti', label: '🏠', val: Math.min(houseLevel * 20, 100), max: 100, color: '#d97706', bg: '#fef3c7' });
                }
                if (role === 'worker') {
                    const bossRep = p.bossReputation || 50;
                    base.push({ name: 'Work Ethic', label: '💼', val: Math.min(bossRep, 100), max: 100, color: '#1d4ed8', bg: '#dbeafe' });
                }

                return base;
            }

            // Hitung bintang (1–5) dari nilai 0–100
            function toBintang(val, max) {
                const pct = Math.min(val / max, 1);
                const stars = Math.round(pct * 5);
                const filled = '⭐'.repeat(stars);
                const empty = '☆'.repeat(5 - stars);
                return { stars, filled, empty, pct };
            }

            // Buat teks rekomendasi personal
            function buildRekomendasi(p, kompetensi) {
                const role = p.role || 'none';
                const name = (DataService.user && DataService.user.name) ? DataService.user.name.split(' ')[0] : 'Kamu';
                const money = p.money || 0;
                const int   = p.int || 0;
                const biz   = p.biz || 0;
                const str   = p.str || 0;
                const rep   = p.reputation || 0;
                const reflCount = (p.reflections || []).length;

                // Cari kompetensi terkuat & terlemah
                const sorted = [...kompetensi].sort((a,b) => (b.val/b.max) - (a.val/a.max));
                const terkuat = sorted[0];
                const terlemah = sorted[sorted.length - 1];

                let rekom = '';

                if (role === 'entrepreneur') {
                    if (biz >= 40 && money >= 50000) {
                        rekom = `<strong>${name}</strong> menunjukkan naluri wirausaha yang kuat. Kamu sudah membuktikan bisa mengelola modal dan tumbuh. Di dunia nyata, kamu cocok mengembangkan usaha berbasis <strong>digital marketing</strong> atau <strong>kuliner kreatif</strong>.\n\nPertimbangkan ikut <strong>pelatihan UMKM Kemenkop</strong> atau program <strong>Young Entrepreneur SMK</strong> sebelum lulus.`;
                    } else if (biz < 20) {
                        rekom = `<strong>${name}</strong> memilih jalur wirausaha, namun skill bisnis masih perlu diasah. Di dunia nyata, <strong>60% UMKM gagal di tahun pertama</strong> karena lemah manajemen keuangan.\n\nRekomendasi: Pelajari <strong>pembukuan sederhana</strong> dan ikuti <strong>Prakerja digital marketing</strong> untuk memperkuat pondasimu.`;
                    } else {
                        rekom = `<strong>${name}</strong> punya potensi wirausaha yang berkembang. Fokuskan pada penguatan jaringan bisnis (REP) dan pencatatan keuangan.\n\nDi dunia nyata, pertimbangkan bergabung dengan <strong>komunitas UMKM lokal</strong> atau ikut program inkubasi bisnis SMK.`;
                    }
                } else if (role === 'worker') {
                    const bossRep = p.bossReputation || 50;
                    if (str >= 40 && bossRep >= 70) {
                        rekom = `<strong>${name}</strong> terbukti disiplin dan beretos kerja tinggi — modal terpenting di dunia kerja nyata. Dengan reputasi kerja yang baik, kamu cocok mengejar karir di bidang <strong>manufaktur, logistik, atau teknik</strong>.\n\nTingkatkan nilai dengan mengambil <strong>sertifikasi BNSP</strong> atau <strong>magang industri</strong> sebelum lulus.`;
                    } else if (bossRep < 30) {
                        rekom = `<strong>${name}</strong> perlu meningkatkan etos kerja dan kedisiplinan. Di dunia nyata, <strong>89% karyawan kehilangan pekerjaan karena soft skill</strong>, bukan karena kurang pintar.\n\nFokus pada: tepat waktu, komunikasi yang baik, dan konsistensi dalam menyelesaikan tugas.`;
                    } else {
                        rekom = `<strong>${name}</strong> menunjukkan kemampuan bekerja yang solid. Untuk naik level, pertimbangkan mengambil <strong>sertifikasi kompetensi LSP-P1</strong> yang relevan dengan jurusanmu di SMK.`;
                    }
                } else if (role === 'student') {
                    if (int >= 50) {
                        rekom = `<strong>${name}</strong> memiliki kecerdasan akademik di atas rata-rata. Berbekal INT tinggi, kamu cocok melanjutkan ke <strong>PTN favorit</strong> melalui jalur prestasi atau SNBT.\n\nPrioritaskan <strong>persiapan UTBK sejak kelas 11</strong> dan aktif di organisasi untuk memperkuat REP (soft skill).`;
                    } else if (reflCount < 3) {
                        rekom = `<strong>${name}</strong> masih perlu meningkatkan kebiasaan refleksi diri. Hanya menulis <strong>${reflCount} jurnal</strong> selama bermain — padahal refleksi adalah kunci belajar mandiri.\n\nRekomendasi: Biasakan jurnal harian dan diskusi dengan guru atau teman sebaya untuk mempercepat pertumbuhan.`;
                    } else {
                        rekom = `<strong>${name}</strong> aktif merefleksikan perjalanan belajarnya (${reflCount} jurnal). Di dunia nyata, kebiasaan ini adalah ciri pelajar mandiri yang sukses di perguruan tinggi.\n\nPertimbangkan jalur <strong>vokasi lanjut (D3/D4)</strong> yang sesuai jurusan SMK-mu.`;
                    }
                } else if (role === 'family') {
                    if (rep >= 80 && money >= 30000) {
                        rekom = `<strong>${name}</strong> berhasil menjaga keseimbangan kehidupan keluarga dan finansial — kombinasi yang langka. Di dunia nyata, kesuksesan berkeluarga butuh kematangan emosi dan finansial.\n\nRekomendasi: Pelajari <strong>perencanaan keuangan keluarga</strong> dan ikuti program <strong>BKKBN Generasi Berencana</strong>.`;
                    } else {
                        rekom = `<strong>${name}</strong> memilih jalur keluarga, namun masih ada tantangan yang belum terselesaikan. Ingat: di dunia nyata, <strong>64% perpisahan dini dipicu masalah finansial</strong>.\n\nFokuskan dulu pada: pendidikan yang selesai, karir yang stabil, lalu membangun keluarga yang siap.`;
                    }
                } else {
                    rekom = `<strong>${name}</strong> belum menentukan jalur karir secara jelas. Di dunia nyata, menunda keputusan bisa berarti kehilangan kesempatan.\n\nMulailah dengan kenali dirimu: apa yang kamu nikmati, apa keahlianmu, dan bayangkan dirimu 5 tahun ke depan.`;
                }

                // Tambah insight terlemah
                rekom += `\n\n📌 Area yang perlu dikembangkan: <strong>${terlemah.name}</strong> — tingkatkan dengan latihan konsisten.`;

                return rekom.replace(/\n/g, '<br>');
            }

            // Hitung predikat kelulusan
            function getPredikat(p) {
                const score = (p.str||0) + (p.int||0) + (p.biz||0) + Math.min(p.reputation||0, 100) + (p.level||1)*5;
                const refleksi = (p.reflections||[]).length;
                const money = p.money || 0;

                if (score >= 200 && money >= 100000 && refleksi >= 5) return { label: '🏆 MANUSIA SEUTUHNYA',       color: '#b45309' };
                if (score >= 150 && money >= 50000)                   return { label: '⭐ PRIBADI YANG BERKEMBANG',  color: '#1d4ed8' };
                if (score >= 100)                                      return { label: '📈 KARAKTER YANG MENEMPA',    color: '#059669' };
                if (score >= 60)                                       return { label: '🌱 BENIH MASA DEPAN',          color: '#d97706' };
                return                                                        { label: '🌅 MASIH DALAM PERJALANAN',   color: '#94a3b8' };
            }

            // ── FUNGSI UTAMA: Generate & Tampilkan Laporan ──
            function showPotretMasaDepan() {
                const p   = STATE.player;
                const name = (DataService.user && DataService.user.name) ? DataService.user.name : 'Siswa';
                const role = p.role || 'none';
                const theme = POTRET_THEME[role] || POTRET_THEME.none;

                // Header
                document.getElementById('potret-header').style.background = theme.bg;
                document.getElementById('potret-player-name').innerText = name.toUpperCase();
                const totalDays = STATE.day - 1;
                const year = Math.floor(totalDays / (30*4)) + 1;
                document.getElementById('potret-day-badge').innerText = `Hari ke-${totalDays} · Tahun ${year} · ${new Date().getFullYear()}`;

                // Identitas
                document.getElementById('pr-jalur').innerText = ROLE_LABEL[role] || role;
                document.getElementById('pr-days').innerText = `${totalDays} hari game`;
                document.getElementById('pr-level').innerText = `Level ${p.level || 1}`;
                document.getElementById('pr-aset').innerHTML = `<span style="color:#d97706">Rp ${(p.money||0).toLocaleString()} G</span>`;

                // Status spesial
                const statusParts = [];
                // Status pernikahan
                if (p.married) {
                    statusParts.push('💍 Sudah Menikah');
                } else if (p.divorced) {
                    const isDuda = (STATE.player.gender === 'boy');
                    statusParts.push(isDuda ? '💔 Duda' : '💔 Janda');
                } else {
                    statusParts.push('🙍 Single');
                }
                if ((p.houseLevel||1)>=3) statusParts.push(`🏠 Rumah Lv.${p.houseLevel}`);
                if (p.jobStatus === 'employed') statusParts.push('💼 Karyawan Aktif');
                if ((p.bossReputation||0) >= 80) statusParts.push('🏅 Pegawai Teladan');
                document.getElementById('pr-status').innerText = statusParts.length ? statusParts.join(' · ') : '—';
                document.getElementById('pr-row-status').style.display = statusParts.length ? 'flex' : 'none';

                const reflCount = (p.reflections || []).length;
                document.getElementById('pr-jurnal').innerText = `${reflCount} entri refleksi`;

                // Kompetensi grid
                const kompetensi = getKompetensi(p);
                const grid = document.getElementById('potret-comp-grid');
                grid.innerHTML = '';
                kompetensi.forEach(k => {
                    const b = toBintang(k.val, k.max);
                    const pct = Math.round(b.pct * 100);
                    const card = document.createElement('div');
                    card.className = 'potret-comp-card';
                    card.style.background = k.bg;
                    card.style.borderColor = k.color + '40';
                    card.innerHTML = `
                        <div class="potret-comp-name" style="color:${k.color}">${k.label} ${k.name}</div>
                        <div class="potret-bar-bg">
                            <div class="potret-bar-fill" style="width:${pct}%; background:${k.color}"></div>
                        </div>
                        <div class="potret-bar-val">${b.filled}${b.empty} ${pct}/100</div>
                    `;
                    grid.appendChild(card);
                });

                // Kuat & lemah
                const sortedComp = [...kompetensi].sort((a,b) => (b.val/b.max) - (a.val/a.max));
                const kuat   = sortedComp[0];
                const lemah  = sortedComp[sortedComp.length-1];
                const kuatPct  = Math.round((kuat.val/kuat.max)*100);
                const lemahPct = Math.round((lemah.val/lemah.max)*100);
                const bKuat  = toBintang(kuat.val, kuat.max);
                const bLemah = toBintang(lemah.val, lemah.max);

                document.getElementById('pr-kuat').innerHTML =
                    `${kuat.name} <span class="potret-stars">${bKuat.filled}</span> (${kuatPct}%)`;
                document.getElementById('pr-lemah').innerHTML =
                    `${lemah.name} <span style="color:#ef4444">${bLemah.filled}${bLemah.empty}</span> (${lemahPct}%)`;

                // Badges
                const badgeEl = document.getElementById('pr-badges');
                badgeEl.innerHTML = '';
                [
                    { cond: (p.reflections||[]).length >= 5,  label: '📝 Refleksi Aktif',    color:'#d97706', bg:'#fef3c7' },
                    { cond: (p.biz||0) >= 30,                 label: '💡 Jiwa Wirausaha',    color:'#059669', bg:'#d1fae5' },
                    { cond: (p.int||0) >= 30,                 label: '🧠 Intelek',            color:'#6d28d9', bg:'#ede9fe' },
                    { cond: (p.str||0) >= 30,                 label: '💪 Pekerja Keras',      color:'#dc2626', bg:'#fee2e2' },
                    { cond: (p.reputation||0) >= 50,          label: '🤝 Sosialita',          color:'#db2777', bg:'#fce7f3' },
                    { cond: p.married,                        label: '💍 Berkeluarga',         color:'#0369a1', bg:'#e0f2fe' },
                    { cond: (p.houseLevel||1) >= 3,           label: '🏠 Pemilik Properti',  color:'#78350f', bg:'#fef3c7' },
                    { cond: (p.bossReputation||0) >= 70,      label: '🏅 Teladan Kerja',      color:'#1d4ed8', bg:'#dbeafe' },
                ].filter(b => b.cond).forEach(b => {
                    const span = document.createElement('span');
                    span.className = 'potret-badge';
                    span.style.color = b.color;
                    span.style.background = b.bg;
                    span.innerText = b.label;
                    badgeEl.appendChild(span);
                });

                // Rekomendasi
                document.getElementById('potret-rekomendasi').style.borderLeftColor = theme.accent;
                document.getElementById('pr-rekom').innerHTML = buildRekomendasi(p, kompetensi);

                // Predikat & Seal
                const predikat = getPredikat(p);
                document.getElementById('pr-predikat').innerText = predikat.label;
                document.getElementById('pr-predikat').style.color = predikat.color;
                document.getElementById('pr-seal-circle').style.borderColor = theme.seal;
                document.getElementById('pr-seal-circle').style.color = theme.seal;
                document.getElementById('pr-seal-year').innerText = new Date().getFullYear();

                // Tampilkan modal
                document.getElementById('potret-modal').classList.add('active');
                STATE.screen = 'modal';
            }

            function closePotret() {
                document.getElementById('potret-modal').classList.remove('active');
                STATE.screen = 'play';
            }

            // Salin teks laporan ke clipboard
            function sharePotret() {
                const p    = STATE.player;
                const name = (DataService.user && DataService.user.name) ? DataService.user.name : 'Siswa';
                const role = ROLE_LABEL[p.role] || '?';
                const pred = getPredikat(p);
                const kompetensi = getKompetensi(p);
                const sorted = [...kompetensi].sort((a,b)=>(b.val/b.max)-(a.val/a.max));
                const kuat  = sorted[0];
                const lemah = sorted[sorted.length-1];
                const bKuat  = toBintang(kuat.val, kuat.max);
                const bLemah = toBintang(lemah.val, lemah.max);

                const teks =
`━━━━━━━━━━━━━━━━━━━━━━━
POTRET MASA DEPANKU: ${name.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━
Jalur yang dipilih : ${role}
Aset akhir         : Rp ${(p.money||0).toLocaleString()} G
Level              : ${p.level || 1}
Predikat           : ${pred.label}
━━━━━━━━━━━━━━━━━━━━━━━
Kompetensi kuat    : ${kuat.name} ${bKuat.filled} (${Math.round((kuat.val/kuat.max)*100)}%)
Perlu dikembangkan : ${lemah.name} ${bLemah.filled} (${Math.round((lemah.val/lemah.max)*100)}%)
Jurnal refleksi    : ${(p.reflections||[]).length} entri
━━━━━━━━━━━━━━━━━━━━━━━
🎓 Rekomendasi Mentor:
${document.getElementById('pr-rekom').innerText.substring(0,180)}...
━━━━━━━━━━━━━━━━━━━━━━━
[ Nusantara Arsa · ${new Date().getFullYear()} ]`;

                navigator.clipboard.writeText(teks)
                    .then(() => showToast('✅ Laporan tersalin ke clipboard!'))
                    .catch(() => showToast('❌ Salin gagal, coba cetak langsung.'));
            }

            function togglePhone() {
                const modal = document.getElementById('phone-modal');
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    STATE.screen = 'play';
                } else {
                    modal.style.display = 'flex';
                    STATE.screen = 'modal';
                    // Reset Notif
                    document.getElementById('phone-btn').classList.remove('phone-ringing');
                    // Update Jam
                    const h = Math.floor(STATE.time / 100).toString().padStart(2, '0');
                    const m = Math.floor((STATE.time % 100) * 0.6).toString().padStart(2, '0');
                    document.getElementById('phone-clock').innerText = `${h}:${m}`;

                    // FIX: Reset View Pastikan Home nyala, yang lain MATI semua
                    document.getElementById('phone-screen-home').style.display = 'block';
                    document.getElementById('phone-screen-sosmed').style.display = 'none';
                    document.getElementById('phone-screen-messages').style.display = 'none';
                    document.getElementById('phone-screen-bank').style.display = 'none';
                }
            }

            // --- FIX: FUNGSI TOMBOL HOME/BACK DI HP ---
            function closePhoneApp() {
                // Sembunyikan SEMUA aplikasi yang mungkin terbuka
                document.getElementById('phone-screen-sosmed').style.display = 'none';
                document.getElementById('phone-screen-messages').style.display = 'none';
                document.getElementById('phone-screen-bank').style.display = 'none';

                // Tampilkan kembali layar utama HP
                document.getElementById('phone-screen-home').style.display = 'block';
            }

            // --- QUICK PET SWITCH (dipanggil dari tap ikon pet di HUD) ---
            function openQuickPetSwitch() {
                const p = STATE.player;
                const myPets = p.pets || [];
                if (myPets.length === 0) {
                    showToast('Belum punya pet! Temui Satria (Ksatria) untuk beli pet.');
                    return;
                }
                if (myPets.length === 1) {
                    const pet = PET_CATALOG[myPets[0]];
                    showToast(`${pet ? pet.emoji + ' ' + pet.name : 'Pet'} adalah satu-satunya petmu!`);
                    return;
                }
                // Tampilkan menu ganti pet (tanpa NPC)
                showPetSwitchMenu(null);
            }

            // --- NEW: FUNGSI BUKA APLIKASI PESAN DI DALAM HP ---
            function openMessagesApp() {
                document.getElementById('phone-screen-home').style.display = 'none';
                document.getElementById('phone-screen-messages').style.display = 'block';

                const list = document.getElementById('phone-messages-list');
                const msgs = STATE.player.messages || [];

                list.innerHTML = '';

                if (msgs.length === 0) {
                    list.innerHTML = '<div style="text-align:center; color:#94a3b8; padding:20px; font-size:12px;">Kotak masuk kosong.</div>';
                } else {
                    // Tampilkan pesan terbaru di atas (Reverse)
                    [...msgs].reverse().forEach(m => {
                        // Format Waktu Simpel
                        let dateStr = "Baru saja";
                        if (m.time) {
                            const date = new Date(m.time);
                            // Format: HH:MM
                            dateStr = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                        }

                        const bubble = document.createElement('div');
                        // Style ala Bubble Chat
                        bubble.style.cssText = `
                background: #fff; 
                padding: 10px; 
                margin-bottom: 8px; 
                border-radius: 0 12px 12px 12px; 
                border-left: 4px solid #3b82f6; 
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                font-family: 'Exo 2', sans-serif;
            `;

                        bubble.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; align-items:center;">
                    <span style="font-weight:bold; color:#3b82f6; font-size:11px;">👩‍🏫 ${m.from || 'Guru Pembimbing'}</span>
                    <span style="font-size:9px; color:#94a3b8;">${dateStr}</span>
                </div>
                <div style="font-size:12px; color:#334155; line-height:1.4;">${m.text}</div>
            `;
                        list.appendChild(bubble);
                    });

                    // Tandai semua dibaca saat membuka aplikasi
                    STATE.player.messages.forEach(m => m.read = true);
                }
            }

            // --- FIX: FUNGSI BUKA PESAN DARI HP ---
            function openMessageArchiveFromPhone() {
                togglePhone(); // Tutup HP dulu karena Arsip Pesan adalah Overlay besar
                setTimeout(() => openMessageArchive(), 200); // Buka arsip pesan
            }

            function openSosmedApp() {
                document.getElementById('phone-screen-home').style.display = 'none';
                document.getElementById('phone-screen-sosmed').style.display = 'block';

                const feed = document.getElementById('viral-news-feed');
                feed.innerHTML = '';

                if (STATE.viral.active) {
                    const t = STATE.viral.active;
                    feed.innerHTML = `
            <div class="news-card">
                <span class="news-tag">🔥 VIRAL NOW</span>
                <div class="news-title">${t.newsTitle}</div>
                <div class="news-body">${t.newsBody}</div>
                <div style="margin-top:10px; font-size:10px; background:#e2e8f0; padding:5px; border-radius:4px;">
                    <strong>TIPS BISNIS:</strong><br>
                    Harga jual <b>${t.itemName}</b> naik 300% hari ini!<br>
                    (Beli di Pedagang, Jual di Merchant)
                </div>
            </div>
        `;
                } else {
                    feed.innerHTML = `<div style="text-align:center; padding:20px; color:#64748b;">Tidak ada tren viral hari ini.</div>`;
                }
            }


            // ==========================================
            // 3. LOGIKA INTERAKSI (YANG DIGABUNGKAN)
            // ==========================================

            // Fungsi Beli Barang Viral (Dipanggil dari interactNPC)
            function buyViralItem(itemId, price, qty) {
                const cost = price * qty;
                if (STATE.player.money >= cost) {
                    STATE.player.money -= cost;
                    if (!STATE.player.inventory[itemId]) STATE.player.inventory[itemId] = 0;
                    STATE.player.inventory[itemId] += qty;
                    showToast(`Membeli ${qty} item!`);
                    updateMoneyUI();
                    closeDialogue();
                } else {
                    showToast("Uang tidak cukup!");
                }
            }

            // Fungsi Jual Barang Viral (Dipanggil dari interactNPC)
            function sellViralItem(itemId, price, qty) {
                if (STATE.player.inventory[itemId] >= qty) {
                    STATE.player.inventory[itemId] -= qty;
                    const total = price * qty;
                    STATE.player.money += total;
                    if (STATE.player.inventory[itemId] <= 0) delete STATE.player.inventory[itemId];
                    // Track untuk bonus quest harian
                    STATE.player.dailySellCount = (STATE.player.dailySellCount || 0) + 1;

                    showToast(`CUAN BESAR! +${total} G`);
                    updateMoneyUI();
                    closeDialogue();
                }
            }

            function updateMoneyUI() {
                document.getElementById('money-display').innerText = STATE.player.money;
            }



            // --- NEW: FUNGSI APLIKASI BANKING ---
            function openBankApp() {
                document.getElementById('phone-screen-home').style.display = 'none';
                document.getElementById('phone-screen-bank').style.display = 'block';

                // 1. Update Saldo
                const balance = STATE.player.money || 0;
                document.getElementById('bank-balance-display').innerText = balance.toLocaleString('id-ID');

                // 2. Generate Dummy History (Mutasi)
                // Karena kita tidak menyimpan log transaksi detail, kita buat dummy berdasarkan aktivitas terakhir
                const historyList = document.getElementById('bank-history-list');
                historyList.innerHTML = '';

                // Buat data dummy yang terlihat realistis
                const transactions = [
                    { desc: "Bunga Tabungan", amount: Math.floor(balance * 0.001), type: "in", date: "Hari Ini" },
                    { desc: "Biaya Admin", amount: 500, type: "out", date: "Kemarin" },
                ];

                // Tambahkan histori kerja jika ada
                if (STATE.player.jobStatus === 'employed') {
                    transactions.unshift({ desc: "Gaji Harian", amount: 5000 + (STATE.player.jobLevel * 2000), type: "in", date: "Hari Ini" });
                }

                transactions.forEach(trx => {
                    const item = document.createElement('div');
                    item.className = 'trx-item';
                    item.innerHTML = `
            <div>
                <div class="trx-date">${trx.date}</div>
                <div class="trx-desc">${trx.desc}</div>
            </div>
            <div class="trx-amount ${trx.type === 'in' ? 'trx-in' : 'trx-out'}">
			${trx.type === 'in' ? '+' : '-'} Rp ${trx.amount.toLocaleString('id-ID')}
            </div>
        `;
                    historyList.appendChild(item);
                });
            }


