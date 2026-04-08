            // --- NEW: GLOBAL CALENDAR EVENTS DATABASE ---
            // Moved from interactObject to Global scope for access by Calendar UI
            // ─── NPC BIRTHDAY TABLE (season, day) ────────────────────────
            const NPC_BIRTHDAYS = {
                'mentor':           { season: 'spring',  day: 8,  name: 'Mentor Budi',         img: 'images/mentor.png' },
                'lover1girl':       { season: 'winter',  day: 6,  name: 'Ayu (Gadis Desa)',     img: 'images/lover1girl.png' },
                'lover2girl':       { season: 'autumn',  day: 2,  name: 'Putri (Scholar)',      img: 'images/lover2girl.png' },
                'lover1boy':        { season: 'spring',  day: 4,  name: 'Dr. Budi',             img: 'images/lover1boy.png' },
                'lover2boy':        { season: 'summer',  day: 15, name: 'Satria (Ksatria)',     img: 'images/lover2boy.png' },
                'lover_matre_girl': { season: 'summer',  day: 9,  name: 'Siska (Sosialita)',    img: 'images/lover_matre_girl.png' },
                'lover_matre_boy':  { season: 'spring',  day: 20, name: 'Rendi (Anak Sultan)',  img: 'images/lover_matre_boy.png' },
                'trader_outside':   { season: 'summer',  day: 3,  name: 'Bu Lastri',    img: 'images/merchant.png' },
                'blacksmith':       { season: 'autumn',  day: 12, name: 'Kepala Bengkel',       img: 'images/blacksmith.png' },
                'librarian':        { season: 'winter',  day: 18, name: 'Bu Ratna (Pustakawan)',           img: 'images/penjagaperpus.png' },
                'guild_master':     { season: 'spring',  day: 28, name: 'Guild Master',         img: 'images/masterguild.png' },
                'lecture':          { season: 'autumn',  day: 22, name: 'Dosen Pembimbing',     img: 'images/lecture.png' },
                'sarjana_tekno':    { season: 'winter',  day: 25, name: 'Senior Teknologi',     img: 'images/sarjanateknologi.png' },
                'sarjana_sejarah':  { season: 'spring',  day: 16, name: 'Bu Wulan (Sejarah)',    img: 'images/sarjanasejarah.png' },
                'nelayan':          { season: 'summer',  day: 27, name: 'Pak Suryo',          img: 'images/nelayan.png' },
                'istrinelayan':     { season: 'autumn',  day: 8,  name: 'Bu Nelayan',           img: 'images/istrinelayan.png' },
                'peer1':            { season: 'spring',  day: 12, name: 'Raka - Teman Sekelas',        img: 'images/peer1.png' },
                'peer2':            { season: 'summer',  day: 18, name: 'Dewi - Tetangga',           img: 'images/peer2.png' },
                'peer3':            { season: 'winter',  day: 11, name: 'Pak Slamet - Petani',               img: 'images/peer3.png' },
                'child_blacksmith': { season: 'autumn',  day: 26, name: 'Lina (Anak Besi)',     img: 'images/anakblacksmith.png' },
                'marine_tailor':    { season: 'winter',  day: 3,  name: 'Marine (Penjahit)',    img: 'images/marine.png' },
                'penghulu':         { season: 'summer',  day: 22, name: 'Pak Harun (Penghulu)',       img: 'images/modin.png' },
                'penjagadungeon':   { season: 'autumn',  day: 17, name: 'Siap - Penjaga Dungeon',      img: 'images/penjagadungeon.png' },
                'seniman':          { season: 'spring',  day: 23, name: 'Aryo - Seniman',              img: 'images/seniman.png' },
                'penyanyi':         { season: 'winter',  day: 20, name: 'Nadia - Penyanyi',             img: 'images/penyanyi.png' },
                'senior_kaia':      { season: 'summer',  day: 11, name: 'Kaia (Senior)',        img: 'images/kaia.png' },
                'cewek_islam':      { season: 'spring',  day: 6,  name: 'Aisyah',              img: 'images/cewek-islam.png' },
                'cewek_kristen':    { season: 'autumn',  day: 30, name: 'Maria',               img: 'images/cewek-kristen.png' },
                'aya_twin':         { season: 'winter',  day: 6,  name: 'Aya (Kembaran Ayu)',  img: 'images/aya.png' },
                'dewi_roro':        { season: 'summer',  day: 29, name: 'Dewi Roro',           img: 'images/roro.png' }
            };

            // ─── SOCIAL REWARDS — khusus jika relasi NPC ≥ threshold ────────
            // Item/info rahasia yang diberikan NPC jika sudah sangat akrab
            const NPC_SOCIAL_REWARDS = {
                'mentor': {
                    threshold: 70,
                    type: 'item',
                    itemId: 'scroll_exp',
                    qty: 3,
                    dialogue: "Kamu sudah seperti muridku sendiri. Ambil ini — catatan rahasiaku tentang teknik belajar cepat. Jaga baik-baik ya!",
                    tip: "💡 RAHASIA: Kamu bisa belajar 2x EXP di kampus jika tidur cukup (tidur sebelum jam 22:00)."
                },
                'lover1girl': {
                    threshold: 80,
                    type: 'item',
                    itemId: 'bunga',
                    qty: 5,
                    dialogue: "Ehehe, kamu teman terbaikku! Nih, bunga-bunga dari kebun rahasia di balik rumahku. Jangan kasih tau orang lain ya! 🌸",
                    tip: "💡 RAHASIA: Ada celah pagar di balik rumah Ayu yang tembus ke ladang tersembunyi (x:12, y:34)."
                },
                'lover2girl': {
                    threshold: 75,
                    type: 'item',
                    itemId: 'buku_tesis',
                    qty: 2,
                    dialogue: "A-aku percaya kamu sekarang... ini buku langka dari perpustakaan tua. Di sana ada petunjuk rahasia tentang Candi Kuno.",
                    tip: "💡 RAHASIA: Candi Kuno menyimpan peti tersembunyi. Coba interaksi dinding kanan pukul 03:00."
                },
                'lover2boy': {
                    threshold: 80,
                    type: 'item',
                    itemId: 'tonic_kebal',
                    qty: 2,
                    dialogue: "Kamu sudah membuktikan dirimu, Kawan. Ambil ramuan tempur ini — formula rahasia para ksatria terpilih.",
                    tip: "💡 RAHASIA: Di Dungeon Level 3 ada kamar tersembunyi di pojok kiri-bawah. Serang temboknya."
                },
                'lover1boy': {
                    threshold: 75,
                    type: 'item',
                    itemId: 'tonic_stamina',
                    qty: 3,
                    dialogue: "Percayalah, pasien setia itu lebih berharga dari uang. Ini resep tonik stamina pribadiku, belum pernah aku kasih ke siapapun!",
                    tip: "💡 RAHASIA: Kamu bisa berobat GRATIS di klinik jika HP < 30 dan punya relasi Dr. Budi ≥ 70."
                },
                'trader_outside': {
                    threshold: 65,
                    type: 'item',
                    itemId: 'permata',
                    qty: 1,
                    dialogue: "Pelanggan setia itu emas! Ini berlian yang tidak sengaja aku temukan di jalur dagang. Rahasia kita berdua ya!",
                    tip: "💡 RAHASIA: Pedagang Keliling punya 'stok tersembunyi' — datangi dia tengah malam (pukul 00:00) untuk item langka."
                },
                'blacksmith': {
                    threshold: 70,
                    type: 'item',
                    itemId: 'besi',
                    qty: 5,
                    dialogue: "Kamu sudah kupercaya. Ambil bijih besi premium ini — bukan yang dijual biasa, ini dari vena mineral khusus yang kutambang sendiri.",
                    tip: "💡 RAHASIA: Minta Kepala Bengkel membuat 'Senjata Rahasia' jika punya 10 bijih besi + relasi ≥ 70."
                },
                'librarian': {
                    threshold: 65,
                    type: 'item',
                    itemId: 'buku_tesis',
                    qty: 1,
                    dialogue: "Sst! Koleksi buku ini tidak tercatat di katalog resmi. Ambil diam-diam, dan kembalikan setelah selesai ya.",
                    tip: "💡 RAHASIA: Ada ruang bawah tanah di perpustakaan. Interaksi rak buku paling kanan 3 kali berturut-turut."
                },
                'guild_master': {
                    threshold: 80,
                    type: 'item',
                    itemId: 'scroll_exp',
                    qty: 5,
                    dialogue: "Adventurer sejati tidak butuh titel. Kamu sudah membuktikannya. Ini gulungan misi S-Class — hanya untuk yang terpilih.",
                    tip: "💡 RAHASIA: Kamu bisa akses Dungeon Level 6 (Secret Floor) jika Guild Rank ≥ A dan relasi Guild Master ≥ 80."
                },
                'lecture': {
                    threshold: 70,
                    type: 'item',
                    itemId: 'scroll_exp',
                    qty: 4,
                    dialogue: "Mahasiswa terbaik layak tahu ini — ada beasiswa tersembunyi yang bisa langsung menaikkan INT +10. Cek papan pengumuman kampus setelah Y2.",
                    tip: "💡 RAHASIA: Dosen bisa menulis surat rekomendasi (akses langsung naik 1 karir) jika relasi ≥ 70 dan INT ≥ 50."
                },
                'nelayan': {
                    threshold: 60,
                    type: 'item',
                    itemId: 'ikan_legendary',
                    qty: 1,
                    dialogue: "Aku rela ngasih ikan terbaikku ke kamu! Ikan Legendaris ini sudah 30 tahun aku impikan. Buat kamu saja!",
                    tip: "💡 RAHASIA: Mancing di waktu 04:00–05:00 (subuh) peluang ikan Legendary naik 3x lipat!"
                },
                'peer1': {
                    threshold: 60,
                    type: 'item',
                    itemId: 'coklat',
                    qty: 3,
                    dialogue: "Sahabat terbaik layak dapat yang terbaik! Ini coklat impor koleksi pribadiku. Kita teman selamanya ya!",
                    tip: "💡 RAHASIA: Teman Sekelas bisa diajak belajar bareng — tambah EXP 50% jika belajar di kampus bersama dia."
                },
                'seniman': {
                    threshold: 65,
                    type: 'item',
                    itemId: 'kain',
                    qty: 2,
                    dialogue: "Kamu adalah inspirasiku! Terimalah kain batik motif 'Nusantara Arsa' — karya eksklusifku untuk jiwa yang memahami seni.",
                    tip: "💡 RAHASIA: Seniman bisa membuat 'Lukisan Potret' kamu — menambah Reputasi +20 permanen jika relasinya ≥ 65."
                }
            };

            // Helper: ambil birthday NPC untuk hari ini
            function getTodayBirthdays() {
                const season = STATE.season;
                const dayInSeason = ((STATE.day - 1) % DAYS_PER_SEASON) + 1;
                return Object.entries(NPC_BIRTHDAYS)
                    .filter(([id, b]) => b.season === season && b.day === dayInSeason)
                    .map(([id, b]) => ({ id, ...b }));
            }

            // Helper: cek apakah hari ini adalah ultah NPC tertentu
            function isNpcBirthdayToday(npcId) {
                const b = NPC_BIRTHDAYS[npcId];
                if (!b) return false;
                const season = STATE.season;
                const dayInSeason = ((STATE.day - 1) % DAYS_PER_SEASON) + 1;
                return b.season === season && b.day === dayInSeason;
            }

            // Fungsi beri hadiah saat ulang tahun
            function giveBirthdayGift(npc) {
                const inv = STATE.player.inventory || {};
                const opts = [];
                const giftableItems = [
                    { id: 'coklat', name: '🍫 Coklat' },
                    { id: 'bunga', name: '🌸 Bunga' },
                    { id: 'kain', name: '🧵 Kain Sutra' },
                    { id: 'permata', name: '💎 Berlian' },
                    { id: 'ikan_segar', name: '🐟 Ikan Segar' },
                    { id: 'tonic_stamina', name: '⚡ Tonic Stamina' },
                    { id: 'buku_tesis', name: '📚 Buku' }
                ];
                giftableItems.forEach(g => {
                    if ((inv[g.id] || 0) > 0) {
                        opts.push({
                            text: `${g.name} (x${inv[g.id]})`,
                            action: () => giveBirthdayGiftItem(npc, g.id)
                        });
                    }
                });
                opts.push({ text: "Lain kali saja...", action: () => interactNPC(npc) });

                if (opts.length === 1) {
                    showDialogue(npc.name + " 🎂",
                        "Tas kamu kosong! Tidak ada yang bisa diberikan sebagai kado ulang tahun.\n\nBeli hadiah dulu di Merchant ya!",
                        [{ text: "Oke!", action: closeDialogue }], npc.imgSrc);
                } else {
                    showDialogue(npc.name + " 🎂",
                        "Hari ini ulang tahunku lho! Kamu ingat? 🥹\n\nMau kasih hadiah apa?",
                        opts, npc.imgSrc);
                }
            }

            function giveBirthdayGiftItem(npc, itemId) {
                // Kurangi item
                STATE.player.inventory[itemId]--;
                if (STATE.player.inventory[itemId] <= 0) delete STATE.player.inventory[itemId];

                // Bonus relasi 3x lebih besar saat ulang tahun!
                const baseImpact = 15; // Base birthday bonus
                const pref = {
                    'lover1girl': { likes: ['bunga','coklat','kain','permata'] },
                    'lover2girl': { likes: ['buku_tesis','bunga','permata','kain'] },
                    'lover2boy':  { likes: ['besi','tonic_stamina','ikan_segar','permata'] },
                    'lover1boy':  { likes: ['ikan_segar','gandum','tonic_stamina','bunga'] },
                    'lover_matre_girl': { likes: ['permata','kain'] },
                    'lover_matre_boy':  { likes: ['permata','besi','tonic_stamina'] },
                    'nelayan':    { likes: ['ikan_segar','tonic_stamina'] },
                    'blacksmith': { likes: ['besi','tonic_stamina'] },
                    'librarian':  { likes: ['buku_tesis','kain'] },
                    'lecture':    { likes: ['buku_tesis','coklat'] },
                    'guild_master': { likes: ['permata','besi','tonic_stamina'] },
                    'trader_outside': { likes: ['coklat','kain','permata'] },
                    'seniman':    { likes: ['kain','bunga','coklat'] }
                };

                const isLiked = (pref[npc.id]?.likes || []).includes(itemId);
                const impact = isLiked ? baseImpact + 10 : baseImpact;

                updateRelationship(npc, impact, "Ultah!");

                const itemNames = {
                    coklat:'Coklat', bunga:'Bunga', kain:'Kain Sutra', permata:'Berlian',
                    ikan_segar:'Ikan Segar', tonic_stamina:'Tonic Stamina', buku_tesis:'Buku'
                };
                const itemLabel = itemNames[itemId] || itemId;
                const reaction = isLiked
                    ? `YEAY! ${itemLabel}! Ini kesukaanku! Kamu sungguh mengenalku! Makasih banyak! 🎉❤️

(Hubungan +${impact})`
                    : `Wah, makasih sudah ingat hari ultahku! Hadiah apapun sangat berarti! 🥹

(Hubungan +${impact})`;

                createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                // Cek apakah unlocked social reward setelah beri hadiah
                const newRelVal = STATE.player.relationships[npc.id] || 0;
                const reward = NPC_SOCIAL_REWARDS[npc.id];
                if (reward && newRelVal >= reward.threshold && !STATE.player[`socialRewarded_${npc.id}`]) {
                    STATE.player[`socialRewarded_${npc.id}`] = true;
                    setTimeout(() => {
                        addItem(reward.itemId, reward.qty);
                        showDialogue("✨ HUBUNGAN TERKUAT!",
                            `${npc.name} sangat tersentuh!

"${reward.dialogue}"

🎁 Dapat: ${reward.itemId.replace(/_/g,' ').toUpperCase()} x${reward.qty}

${reward.tip}`,
                            [{ text: "Terima kasih! 🙏", action: closeDialogue }],
                            npc.imgSrc
                        );
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    }, 1200);
                }

                showDialogue(npc.name + " 🎂", reaction,
                    [{ text: "Selamat ulang tahun! 🎂", action: closeDialogue }], npc.imgSrc);
            }

            const CALENDAR_EVENTS = {
                'spring': {
                    1:  { name: "Tahun Baru", type: "festival", icon: "🌸" },
                    4:  { name: "🎂 Ultah Dr. Budi", type: "birthday", icon: "🎂", npcId: "lover1boy" },
                    6:  { name: "🎂 Ultah Aisyah", type: "birthday", icon: "🎂", npcId: "cewek_islam" },
                    8:  { name: "🎂 Ultah Mentor Budi", type: "birthday", icon: "🎂", npcId: "mentor" },
                    12: { name: "🎂 Ultah Raka - Teman Sekelas", type: "birthday", icon: "🎂", npcId: "peer1" },
                    14: { name: "Festival Bunga (Valentine)", type: "festival", icon: "💖" },
                    16: { name: "🎂 Ultah Bu Wulan", type: "birthday", icon: "🎂", npcId: "sarjana_sejarah" },
                    18: { name: "Lomba Pacuan Kuda", type: "festival", icon: "🐎" },
                    20: { name: "🎂 Ultah Rendi (Sultan)", type: "birthday", icon: "🎂", npcId: "lover_matre_boy" },
                    23: { name: "🎂 Ultah Seniman", type: "birthday", icon: "🎂", npcId: "seniman" },
                    25: { name: "Lomba Memasak", type: "festival", icon: "🍳" },
                    28: { name: "🎂 Ultah Guild Master", type: "birthday", icon: "🎂", npcId: "guild_master" }
                },
                'summer': {
                    1:  { name: "Buka Giling (Panen Raya)", type: "festival", icon: "☀️" },
                    3:  { name: "🎂 Ultah Bu Lastri (Pedagang Keliling)", type: "birthday", icon: "🎂", npcId: "trader_outside" },
                    5:  { name: "🏅 Gempita Season: Pendaftaran Dibuka!", type: "special", icon: "🏅", desc: "Event Gempita Awards resmi dibuka! Siswa dengan role Akademisi, portofolio lengkap, dan 50+ AP dapat mendaftar. Raih Poin Prestasi sebanyaknya sebelum hari ke-25!" },
                    7:  { name: "Festival Ayam", type: "festival", icon: "🐔" },
                    9:  { name: "🎂 Ultah Siska (Sosialita)", type: "birthday", icon: "🎂", npcId: "lover_matre_girl" },
                    11: { name: "🎂 Ultah Kaia (Senior)", type: "birthday", icon: "🎂", npcId: "senior_kaia" },
                    14: { name: "🏅 Gempita: Batas Pengumpulan Karya", type: "special", icon: "⭐", desc: "Batas waktu pengumpulan portofolio karya media pembelajaran! Siswa yang sudah mendaftar wajib memiliki minimal 1 karya sebelum hari ini." },
                    15: { name: "🎂 Ultah Satria (Ksatria)", type: "birthday", icon: "🎂", npcId: "lover2boy" },
                    18: { name: "🎂 Ultah Dewi (Tetangga)", type: "birthday", icon: "🎂", npcId: "peer2" },
                    20: { name: "Lomba Berenang", type: "festival", icon: "🏊" },
                    22: { name: "🎂 Ultah Pak Harun", type: "birthday", icon: "🎂", npcId: "penghulu" },
                    23: { name: "Bulan Purnama Merah", type: "special", icon: "🌕" },
                    24: { name: "Festival Kembang Api", type: "festival", icon: "🎆" },
                    25: { name: "🏆 GEMPITA AWARDS — Hari Pengumuman!", type: "special", icon: "🏆", desc: "Hari besar Gempita Awards! Leaderboard Gempita Season diperbarui. Lihat siapa yang meraih posisi teratas berdasarkan AP, portofolio, dan kelengkapan jurnal. Buka Dashboard Guru → Gempita Season untuk melihat hasil akhir!" },
                    27: { name: "🎂 Ultah Pak Nelayan", type: "birthday", icon: "🎂", npcId: "nelayan" },
                    29: { name: "🎂 Ultah Dewi Roro", type: "birthday", icon: "🎂", npcId: "dewi_roro" }
                },
                'autumn': {
                    2:  { name: "🎂 Ultah Putri (Scholar)", type: "birthday", icon: "🎂", npcId: "lover2girl" },
                    5:  { name: "Festival Musik", type: "festival", icon: "🎵" },
                    8:  { name: "🎂 Ultah Bu Nelayan", type: "birthday", icon: "🎂", npcId: "istrinelayan" },
                    12: { name: "🎂 Ultah Kepala Bengkel", type: "birthday", icon: "🎂", npcId: "blacksmith" },
                    15: { name: "Pesta Panen Anggur", type: "festival", icon: "🍇" },
                    17: { name: "🎂 Ultah Penjaga Dungeon", type: "birthday", icon: "🎂", npcId: "penjagadungeon" },
                    21: { name: "Festival Domba", type: "festival", icon: "🐑" },
                    22: { name: "🎂 Ultah Dosen Pembimbing", type: "birthday", icon: "🎂", npcId: "lecture" },
                    26: { name: "🎂 Ultah Lina (Anak Besi)", type: "birthday", icon: "🎂", npcId: "child_blacksmith" },
                    30: { name: "🎂 Ultah Maria + Malam Hantu", type: "birthday", icon: "🎂", npcId: "cewek_kristen" }
                },
                'winter': {
                    3:  { name: "🎂 Ultah Marine (Penjahit)", type: "birthday", icon: "🎂", npcId: "marine_tailor" },
                    6:  { name: "🎂 Ultah Ayu & Aya (Kembar!)", type: "birthday", icon: "🎂", npcId: "lover1girl" },
                    10: { name: "Lomba Mancing Es", type: "festival", icon: "🎣" },
                    11: { name: "🎂 Ultah Petani", type: "birthday", icon: "🎂", npcId: "peer3" },
                    18: { name: "🎂 Ultah Bu Ratna", type: "birthday", icon: "🎂", npcId: "librarian" },
                    19: { name: "Pesta Sup Hangat", type: "festival", icon: "🍲" },
                    20: { name: "🎂 Ultah Penyanyi", type: "birthday", icon: "🎂", npcId: "penyanyi" },
                    24: { name: "Malam Bintang (Natal)", type: "festival", icon: "🌟" },
                    25: { name: "🎂 Ultah Senior Teknologi", type: "birthday", icon: "🎂", npcId: "sarjana_tekno" },
                    30: { name: "Malam Akhir Tahun", type: "festival", icon: "🕛" }
                }
            };

            // --- CALENDAR UI LOGIC ---
            let calViewSeasonIdx = 0;
            let calViewYear = 1;

            function openCalendar() {
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                // Hitung Musim & Tahun Saat Ini sebagai Default View
                const totalDays = STATE.day - 1;
                calViewYear = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;
                const seasonGlobalIdx = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                calViewSeasonIdx = seasonGlobalIdx; // 0=Spring, 1=Summer...

                renderCalendar();

                document.getElementById('calendar-modal').style.display = 'flex';
                STATE.screen = 'modal';
            }

            function closeCalendar() {
                document.getElementById('calendar-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            function changeCalendarMonth(dir) {
                calViewSeasonIdx += dir;

                // Handle Year Rollover
                if (calViewSeasonIdx > 3) {
                    calViewSeasonIdx = 0;
                    calViewYear++;
                } else if (calViewSeasonIdx < 0) {
                    calViewSeasonIdx = 3;
                    calViewYear--;
                    if (calViewYear < 1) { // Batas bawah tahun 1
                        calViewYear = 1;
                        calViewSeasonIdx = 0;
                    }
                }

                // SFX Page Flip
                if (typeof AudioService !== 'undefined') AudioService.playSFX('bg');

                renderCalendar();
            }

            function renderCalendar() {
                const seasonName = SEASONS[calViewSeasonIdx].toLowerCase();
                const seasonDisplayName = SEASONS[calViewSeasonIdx].toUpperCase();

                // Update Header
                document.getElementById('cal-season-text').innerText = seasonDisplayName;
                // Ganti warna header sesuai musim
                const colors = { 'spring': '#f472b6', 'summer': '#facc15', 'autumn': '#fb923c', 'winter': '#60a5fa' };
                document.getElementById('cal-season-text').style.color = colors[seasonName];
                document.getElementById('cal-year-text').innerText = `TAHUN KE-${calViewYear}`;

                // Reset Info Detail
                document.getElementById('cal-detail-date').innerText = "Pilih Tanggal";
                document.getElementById('cal-detail-desc').innerText = "Klik tanggal untuk melihat info.";

                // Render Grid
                const grid = document.getElementById('cal-grid-container');
                // Hapus cell lama (sisa header)
                const oldCells = grid.querySelectorAll('.cal-cell');
                oldCells.forEach(c => c.remove());

                // Hitung Data Hari Ini (Real-time)
                const currentTotalDays = STATE.day - 1;
                const currentYear = Math.floor(currentTotalDays / (DAYS_PER_SEASON * 4)) + 1;
                const currentSeasonIdx = Math.floor((currentTotalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                const currentDayDate = (currentTotalDays % DAYS_PER_SEASON) + 1;

                const isCurrentMonthView = (calViewYear === currentYear && calViewSeasonIdx === currentSeasonIdx);

                // Render 30 Hari
                for (let d = 1; d <= 30; d++) {
                    const cell = document.createElement('div');
                    cell.className = 'cal-cell';

                    // Nomor Tanggal
                    const num = document.createElement('div');
                    num.className = 'cal-num';
                    num.innerText = d;
                    cell.appendChild(num);

                    // Cek Event
                    const eventData = CALENDAR_EVENTS[seasonName][d];
                    if (eventData) {
                        const icon = document.createElement('div');
                        icon.className = 'cal-icon';
                        icon.innerText = eventData.icon;
                        cell.appendChild(icon);

                        // Tambah kelas warna
                        if (eventData.type === 'birthday') {
                            cell.classList.add('birthday');
                            // Dot marker biru
                            const dot = document.createElement('div');
                            dot.className = 'cal-dot';
                            dot.style.background = '#60a5fa';
                            cell.appendChild(dot);
                        } else {
                            cell.classList.add('festival');
                            // Dot marker pink
                            const dot = document.createElement('div');
                            dot.className = 'cal-dot';
                            dot.style.background = '#f472b6';
                            cell.appendChild(dot);
                        }
                    }

                    // Highlight Hari Ini
                    if (isCurrentMonthView && d === currentDayDate) {
                        cell.classList.add('today');
                        cell.title = "HARI INI";
                    }

                    // OnClick Handler
                    cell.onclick = () => {
                        const dayName = DAYS_OF_WEEK[(d - 1) % 7]; // Sederhana: Tgl 1 selalu Senin di game ini? (Asumsi)
                        // Sebenarnya hari bergeser tiap bulan (30 % 7 = 2 sisa), tapi untuk simpel kita pakai index statis atau hitung global
                        // Kita pakai nama hari statis per tanggal saja untuk UI simpel

                        const detailDate = document.getElementById('cal-detail-date');
                        const detailDesc = document.getElementById('cal-detail-desc');

                        detailDate.innerText = `Tanggal ${d} ${seasonDisplayName} (Tahun ${calViewYear})`;

                        if (isCurrentMonthView && d === currentDayDate) {
                            detailDate.innerText += " - HARI INI";
                            detailDate.style.color = "#fbbf24";
                        } else {
                            detailDate.style.color = "white";
                        }

                        if (eventData) {
                            detailDesc.innerHTML = `<span style="font-size:14px">${eventData.icon}</span> <strong>${eventData.name}</strong>`;
                        } else {
                            detailDesc.innerText = "Tidak ada festival khusus pada hari ini.";
                        }

                        // Visual feedback
                        document.querySelectorAll('.cal-cell').forEach(c => c.style.borderColor = '#334155');
                        if (!cell.classList.contains('today')) cell.style.borderColor = 'white';
                    };

                    grid.appendChild(cell);
                }
            }

            // --- UPDATE: BANK CHAT KARAKTER (Berdasarkan Tingkat Hubungan) ---
            const NPC_CHATS = {
                'lover1girl': { // AYU (Ceria/Gadis Desa)
                    low: [ // < 20
                        "Panen wortelku gagal sebagian... sedih deh.",
                        "Kamu murid baru ya? Jangan lupa makan siang lho!",
                        "Tadi aku dikejar ayam jago Pak Kades, kaget banget!",
                        "Langitnya biru banget ya hari ini, jadi pengen main layangan."
                    ],
                    mid: [ // 20 - 79
                        "Eh kamu! Kebetulan, aku baru bikin kue labu. Mau cicip?",
                        "Capek kerja di ladang hilang kalau liat kamu lewat. Hehe!",
                        "Nanti sore jalan-jalan ke sungai yuk? Banyak capung bagus.",
                        "Aku suka cowok yang rajin bekerja keras sepertimu."
                    ],
                    high: [ // >= 80 (Cinta/Siap Nikah)
                        "Setiap liat kamu, rasanya kayak bunga matahari yang kena sinar pagi.",
                        "Aku pengen punya kebun kecil di belakang rumah kita nanti...",
                        "Jangan kerja terlalu keras ya sayang, aku khawatir.",
                        "Kalau kita nikah, aku janji bakal masakin kamu tiap hari! ❤️"
                    ]
                },
                'lover2girl': { // PUTRI (Pemalu/Scholar)
                    low: [
                        "A-anu... permisi... aku mau ke perpustakaan...",
                        "Buku ini... ceritanya sedih sekali...",
                        "K-kamu suka baca buku apa? A-aku suka puisi...",
                        "Di sini agak ramai ya... a-aku kurang nyaman..."
                    ],
                    mid: [
                        "Kamu... pendengar yang baik ya. Aku nyaman ngobrol sama kamu.",
                        "Tadi aku nemu kutipan bagus: 'Cinta itu seperti ilmu, tak bertepi'.",
                        "Boleh a-aku pinjam catatanmu? Tulisanmu rapi...",
                        "Kalau kamu butuh bantuan belajar... bilang saja ya."
                    ],
                    high: [
                        "Jantungku berdebar kencang tiap kamu mendekat... A-apa ini penyakit?",
                        "Aku menulis puisi tentangmu... t-tapi malu membacakannya...",
                        "Kamu adalah novel favoritku yang tak ingin kuakhiri.",
                        "T-tolong jangan tinggalkan aku sendiri lagi ya... ❤️"
                    ]
                },
                'lover2boy': { // SATRIA (Ksatria/Tegas)
                    low: [
                        "Fokus. Disiplin. Itu kunci kekuatan.",
                        "Pedang ini butuh diasah. Permisi.",
                        "Dunia luar itu kejam, persiapkan dirimu.",
                        "Jangan buang waktumu untuk hal tidak berguna."
                    ],
                    mid: [
                        "Kudaku sepertinya menyukaimu. Dia punya insting bagus.",
                        "Latihanmu ada kemajuan. Pertahankan postur itu.",
                        "Saya mulai menghargai tekadmu. Jarang ada orang sepertimu.",
                        "Kalau ke Dungeon, kabari saya. Saya akan memantau."
                    ],
                    high: [
                        "Saya ingin mendedikasikan pedang ini untuk melindungimu.",
                        "Kamu adalah kelemahanku, sekaligus kekuatan terbesarku.",
                        "Berdiri di sampingku. Kita hadapi dunia bersama.",
                        "Saya berjanji setia padamu, demi kehormatan ksatria! ❤️"
                    ]
                },
                'lover1boy': { // DR. BUDI (Dokter/Loveable)
                    low: [
                        "Jangan lupa minum air putih 2 liter sehari ya!",
                        "Wajahmu pucat, kurang tidur atau kurang kasih sayang?",
                        "Saya dokter, tapi saya gak bisa nyembuhin sakit hati lho. Haha!",
                        "Kesehatan itu investasi masa depan."
                    ],
                    mid: [
                        "Detak jantungmu normal, tapi kok pipimu merah pas ketemu saya?",
                        "Saya resepkan 'Senyum 3x Sehari' khusus buat kamu.",
                        "Kamu pasien favorit saya, padahal kamu gak sakit. Hehe.",
                        "Jaga diri baik-baik ya, saya gak mau liat kamu terluka."
                    ],
                    high: [
                        "Diagnosa saya: Saya terkena virus cinta akut, dan kamu penularnya.",
                        "Saya mau jadi dokter pribadi kamu seumur hidup. Gratis!",
                        "Obat lelahku cuma satu: Liat senyum kamu.",
                        "Kamu manis banget, nanti saya diabetes gimana? 😘"
                    ]
                },
                // ============================================================
                // FAKE LOVER SYSTEM: DONI (fake_boy) & BELLA (fake_girl)
                // Fase 1 (0-29): CHARM — manis, perhatian, PDKT palsu
                // Fase 2 (30-69): HONEYTRAP — mulai minta item/gold, flirty tipis
                // Fase 3 (70-99): LOVE BOMB — dramatis, bilang sayang, minta hadiah mahal
                // Fase 4 (100): GHOSTING — tiba-tiba cuek, dingin, menghindar
                // ============================================================
                'fake_boy': { // DONI — Fake Lover untuk Player Perempuan
                    low: [ // Fase CHARM (< 30) — manis dan perhatian
                        "Eh, kamu! Aku perhatiin dari tadi, kayaknya kamu orang yang menarik deh.",
                        "Hei, baru pertama kali kita ngobrol ya? Tapi rasanya udah lama kenal. Aneh ya? Hehe.",
                        "Kamu cantik waktu senyum. Jangan malu-malu gitu dong!",
                        "Aku suka lihat semangat kamu belajar. Jarang lho ada yang sekeras itu.",
                        "Boleh aku temenin duduk di sini? Kayak lagi sepi sendirian.",
                        "Aku sering lihat kamu di sini, tapi baru berani nyapa. Maaf ya, nervous soalnya. Hehe.",
                        "Kalau kamu lagi capek, cerita aja ke aku. Aku pendengar yang baik kok!"
                    ],
                    mid: [ // Fase HONEYTRAP (30-69) — mulai minta, kode-kode
                        "Kamu baik banget sih... aku jadi suka nemenin kamu. Tapi jangan salah paham ya! (Melirik)",
                        "Duh, tadi aku liat batu permata bagus di toko. Tapi uangku pas-pasan nih...",
                        "Kata orang, orang yang sayang itu seneng ngasih hadiah. Kamu setuju gak? Hehe~",
                        "Aku lagi butuh tonic stamina nih, udah hampir habis. Gak ada yang mau beliin? *lirik-lirik*",
                        "Kita makin deket ya... aku seneng. Tapi hm, rasa-rasanya kamu kurang perhatian deh.",
                        "Kalau kamu beneran suka sama aku, pasti tau aku lagi butuh apa. Masa nggak peka sih? 🥺",
                        "Jujur ya... aku mulai ngerasain sesuatu. Tapi aku belum yakin kamu serius atau nggak."
                    ],
                    high: [ // Fase LOVE BOMB (70-99) — dramatis, overconfident
                        "Sayang... aku cuma mau bilang, kamu satu-satunya yang buat aku bahagia. Serius.",
                        "Kita udah deket banget. Kalau kamu beneran sayang, kasih aku sesuatu yang spesial ya 💎",
                        "Aku ngerasa kita itu ditakdirkan ketemu. Cuma... aku butuh bukti kamu juga serius.",
                        "Jangan tinggalkan aku ya. Aku serius nih... *tapi matanya liar lirik lover asli player*",
                        "Kalau cinta itu nyata, harusnya kamu gak keberatan kasih aku yang terbaik kan? ✨",
                        "Aku sayang kamu... tapi aku juga punya mimpi besar. Kamu mau support aku kan?",
                        "Malam ini aku mikirin kamu terus. Besok bawain aku permata ya sebagai tanda cinta! 💕"
                    ]
                },
                'fake_girl': { // BELLA — Fake Lover untuk Player Laki-laki
                    low: [ // Fase CHARM (< 30)
                        "Haii~ Kamu yang namanya itu ya? Aku udah sering denger nama kamu lho!",
                        "Wah, kamu rajin banget ya. Salut deh! Aku suka orang yang ambisius.",
                        "Boleh aku tanya-tanya soal kamu? Kayaknya kamu orangnya seru.",
                        "Kamu kelihatan berbeda dari yang lain. Maksudnya... lebih dewasa gitu.",
                        "Aku lagi sendirian nih, gak ada yang mau temenin. Kamu mau gak? 🥺",
                        "Eh, senyum kamu itu lho... bikin aku gak bisa fokus. Hehe, bercanda!",
                        "Ngobrol sama kamu asik ya. Lain kali boleh ngobrol lagi dong!"
                    ],
                    mid: [ // Fase HONEYTRAP (30-69)
                        "Ih, aku liat kain sutra bagus banget di pasar tadi. Tapi mahal deh... *lirik kamu*",
                        "Kata orang, cowok yang perhatian itu bawaannya sering kasih hadiah. Kamu tipe gitu gak? Hehe~",
                        "Kamu tau gak, aku tuh tipe yang gampang baper kalau ada yang perhatiin. Awas ya! *kedip*",
                        "Duh, coklat impor itu enak banget. Andai ada yang mau beliin... *sigh*",
                        "Aku ngerasa nyaman banget sama kamu. Tapi kamu kurang nunjukkin perhatian deh, sayang~",
                        "Kalau kamu emang niat, harusnya kamu tau aku lagi mau apa. Masa harus bilang dulu? 😏",
                        "Kita makin deket ya... aku seneng. Tapi serius gak sih sama aku?"
                    ],
                    high: [ // Fase LOVE BOMB (70-99)
                        "Aku mau jujur... aku ngerasa kita itu spesial. Tapi aku butuh kepastian dari kamu. 💖",
                        "Sayang, beliin aku permata itu ya. Buat kenangan kita berdua~",
                        "Kamu satu-satunya yang ngerti aku. Jangan sampe ada yang pisahin kita ya!",
                        "Aku bayangin kita jalan berdua ke mana-mana... tapi kamu harus buktiin dulu serius apa enggak.",
                        "Kalau kamu beneran sayang, hadiahnya harus yang mewah dong. Masa murahan? 😤",
                        "Malam ini aku kangen kamu... besok jangan lupa bawain kain sutra atau berlian ya~ 💕",
                        "Aku cinta kamu... *tapi sesekali matanya nyari-nyari lover asli player dari kejauhan*"
                    ]
                },
                // NEW: CHAT KHUSUS CINTA MATRE (Sombong & Materialis) - REVISED
                'lover_matre_girl': { // SISKA
                    low: [ // Fase Awal: Pura-pura Baik (Fake Nice)
                        "Hai! Wah, kamu kelihatan pekerja keras ya. Aku suka semangatmu!",
                        "Senyum kamu manis juga ya. Boleh kenalan dong?",
                        "Udaranya enak ya. Kamu sering jalan-jalan di sini?",
                        "Bajumu rapi deh, pasti orangnya telaten."
                    ],
                    mid: [ // Fase Tengah: Kode Halus (Hinting)
                        "Duh, cuaca panas gini enak minum es kopi mahal nih. *Lirik kamu*",
                        "Tas temanku bagus banget, harganya 50k. Aku cuma bisa mimpi punya itu...",
                        "Jadi orang mandiri itu capek ya. Andai ada yang mau manjaiin aku.",
                        "Kamu kalau jalan-jalan biasanya ke tempat mewah nggak?"
                    ],
                    high: [ // Fase Akhir: Matre Asli (Demanding)
                        "Beb, transfer 500k dong buat skincare. Mukaku kusam nih mikirin kita.",
                        "Masa pacaran jalan kaki? Beli mobil kek, minimal kuda!",
                        "Kalau cinta itu butuh modal. Mana hadiah buatku hari ini?",
                        "Jangan cuma janji manis, aku butuhnya Zirah Emas atau Berlian!"
                    ]
                },
                'lover_matre_boy': { // RENDI
                    low: [ // Fase Awal: Bro-broan Asik
                        "Yo bro! Keren juga gaya lo hari ini. Sukses terus ya!",
                        "Gue liat potensi gede di diri lo. Semangat!",
                        "Asik juga ngobrol sama lo. Kapan-kapan nongkrong yuk.",
                        "Wah, rajin amat. Calon orang sukses nih."
                    ],
                    mid: [ // Fase Tengah: Kode Minjem/Bayarin
                        "Bro, dompet gue ketinggalan di Jet Pribadi. Pinjem 50k dulu bisa?",
                        "Mobil sport gue lagi di bengkel nih. Nebeng donk, tapi lo yang nyetir ya.",
                        "Gue lagi ada proyek besar, tapi butuh suntikan dana dikit...",
                        "Lo kan baik, bayarin makan siang gue dong sekali-kali."
                    ],
                    high: [ // Fase Akhir: Porotin Harta
                        "Sayang, beliin aku jam tangan itu dong. Buktikan cintamu dengan harta!",
                        "Transferin modal usaha dong. Nanti kalau untung... ya buat aku lah.",
                        "Kita cocok deh... selama saldo rekeningmu masih banyak.",
                        "Nikah? Nanti dulu ya, aku masih mau menikmati uangmu."
                    ]
                }
            };

            // --- NEW: BANK DIALOG KERUKUNAN ANTAR AGAMA ---
            const NPC_RELIGIOUS_CHATS = {
                'cewek_islam': [ // AISYAH
                    "Assalamualaikum! Lihat Maria di sana? Dia sahabat terbaikku. Kami berbeda keyakinan, tapi hati kami satu dalam persaudaraan.",
                    "Islam mengajarkan kami: 'Lakum dinukum waliyadin'. Bagimu agamamu, dan bagiku agamaku. Kami saling menghormati tanpa mencampuradukkan ibadah.",
                    "Indah sekali pagi ini. Perbedaan itu seperti pelangi, justru indah karena warnanya tidak sama, kan?",
                    "Kami sering bertukar cerita di sini. Saling menjaga perasaan adalah kunci kedamaian desa ini.",
                    // Nasihat Nikah
                    "Soal jodoh, kalau boleh saran... Menikah itu ibadah terpanjang seumur hidup. Jauh lebih tenang jika satu iman, agar nakhoda dan penumpang satu tujuan.",
                    "Cinta itu anugerah, tapi iman itu fondasi. Menikah seagama akan memudahkanmu mendidik generasi penerus nanti.",
                    "Jangan korbankan aqidah demi cinta sesaat. Carilah pasangan yang bisa membawamu ke Surga bersama-sama."
                ],
                'cewek_kristen': [ // MARIA
                    "Shalom! Damai sejahtera bagimu. Aku dan Aisyah sudah bersahabat sejak kecil.",
                    "Kasih itu sabar, kasih itu murah hati. Tuhan mengajarkan kita untuk mengasihi sesama manusia, apapun latar belakangnya.",
                    "Saat Aisyah puasa, aku tidak makan di depannya. Itu bentuk toleransi sederhana yang kami jaga.",
                    "Kami percaya, hidup rukun itu mendatangkan berkat. Seperti embun yang turun dari gunung.",
                    // Nasihat Nikah
                    "Tentang pasangan hidup... Alkitab mengingatkan: 'Janganlah kamu merupakan pasangan yang tidak seimbang'. Menikah seagama itu fondasi yang kuat.",
                    "Satu iman berarti satu roh. Pernikahan bukan cuma soal perasaan, tapi persekutuan dengan Tuhan. Lebih baik cari yang seiman ya.",
                    "Rumah tangga itu butuh tiang doa yang sama. Carilah seseorang yang bisa bergandengan tangan saat berdoa kepeda-Nya."
                ]
            };

            // --- NEW: BANK DIALOG SISWA BARU (TEMAN SEKELAS - LAKI-LAKI) ---
            const PEER_BOY_CHATS = {
                // FASE 1: ANAK BARU BINGUNG (Relationship < 20)
                low: [
                    "Sst, bro... lu ngerti nggak sih kita disuruh ngapain di sini? Gue cuma dikasih tau 'bertahan hidup' doang. Bingung gue.",
                    "Eh, lu tau nggak cara dapet duit cepet? Bekal gue dari rumah udah mau abis nih buat beli roti.",
                    "Gue kangen masakan nyokap... Di sini makannya ikan bakar mulu, amis bro.",
                    "Itu bangunan gede di tengah apa sih? Guild ya? Serem amat isinya orang bawa pedang semua.",
                    "Lu udah milih Role? Gue galau nih antara jadi Wirausaha atau Kuliah aja... Takut salah pilih.",
                    "Bro, lu tau 'Dungeon' itu dimana? Gue denger ada monster, emang beneran ya? Kok ngeri sih...",
                    "Tadi gue nyasar pas nyari Kampus. Peta di sini ribet banget, mana nggak ada ojek online.",
                    "Lu udah ketemu Mentor Budi? Katanya dia galak ya kalau kita males?"
                ],
                // FASE 2: MULAI BERADAPTASI (Relationship 20 - 79)
                mid: [
                    "Ternyata kerja di Merchant lumayan juga, bro. Capek sih ngangkat barang, tapi dapet duit buat jajan.",
                    "Gue abis dari Perpus, gila bukunya tebel-tebel banget. Tapi ternyata seru juga baca sejarah pulau ini.",
                    "Lu pernah liat hantu di hutan barat nggak? Katanya ada monster nyolong skripsi, aneh banget ya ekosistem sini.",
                    "Gue mulai paham ritme di sini. Pagi kerja, sore mancing, malem tidur. Simpel tapi bikin sehat.",
                    "Eh bro, mending uang lu ditabung deh. Gue kemarin boros beli baju, eh sekarang nggak bisa upgrade rumah.",
                    "Kalau lu mau hemat, mending mancing sendiri di dermaga. Ikan bakarnya lumayan buat ganjel perut.",
                    "Gue denger kalau mau sukses di sini kuncinya cuma satu: Konsisten. Jangan gonta-ganti kerjaan mulu."
                ],
                // FASE 3: SUDAH NYAMAN/SENIOR (Relationship >= 80)
                high: [
                    "Wih, gear lu makin keren aja bro. Udah siap lawan Boss Dungeon lantai 5 kayaknya nih!",
                    "Inget nggak pas kita baru nyampe dulu? Polos banget ya kita, bingung nyari pintu masuk rumah haha.",
                    "Nanti kalau lulus dari pulau ini, gue mau buka bisnis sendiri ah di kota asal. Ilmunya udah dapet di sini.",
                    "Bro, kita harus lulus bareng ya! Kita buktiin ke Mentor Budi kalau kita bisa bertahan 5 tahun!",
                    "Rasanya gue malah nggak mau pulang. Di sini udaranya seger, orangnya ramah-ramah. Betah gue.",
                    "Kalau lu butuh bantuan buat lawan monster, bilang aja. Gue udah latihan fisik dikit-dikit nih!"
                ]
            };

