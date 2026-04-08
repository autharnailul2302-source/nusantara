// ══════════════════════════════════════════════════════════════
// Side Quest + Ritual Kahyangan + Ethics
// File: js/15-quest-sidequest.js
// ══════════════════════════════════════════════════════════════
            // 📜 SISTEM SIDE QUEST: KISAH LELUHUR — Fungsi Pendukung
            // ═══════════════════════════════════════════════════════════════════

            function applyFolktalePassives() {
                const p = STATE.player;
                if (p.inventory && p.inventory['keris_penjaga'] && !p.kerisPassiveApplied) {
                    p.kerisPassiveApplied = true;
                    p.str  = (p.str  || 0) + 5;
                    p.int  = (p.int  || 0) + 5;
                    p.spd  = (p.spd  || 0) + 5;
                    p.biz  = (p.biz  || 0) + 5;
                    showToast("⚔️ Keris Penjaga aktif! Semua stat +5");
                }
            }

            // ══════════════════════════════════════════════════════════════
            // 🧚‍♀️ RITUAL PEMULIHAN KAHYANGAN WILIS — Climax Quest
            // ══════════════════════════════════════════════════════════════
            function startSylvariaRitual(npc) {
                const p = STATE.player;
                closeDialogue();
                STATE.screen = 'cutscene';
                STATE.cutsceneOverride = true;

                const slides = [
                    {
                        chapter: '— Kahyangan Wilis · Ritual Pemulihan —',
                        title: 'Wektune Wis Teko',
                        sub: 'Saatnya telah tiba...',
                        narasi: 'Rara Wilis menutup matanya perlahan. Angin dari lereng Gunung Wilis berhenti. Semuanya hening. Bahkan daun-daun kenanga tidak bergerak.',
                        dur: 4500
                    },
                    {
                        chapter: '— Babak I — Lingkaran Widadari —',
                        title: 'Para Widadari Berkumpul',
                        sub: 'Wening · Sekar · Bening',
                        narasi: 'Satu per satu mereka muncul dari balik semak kenanga. Wening dengan sayap hijaunya, Sekar membawa bunga melati, Bening meninggalkan jejak air di tanah kering.',
                        dur: 5000
                    },
                    {
                        chapter: '— Babak II — Kristal Brantas —',
                        title: '💎 Energi Bumi Mengalir',
                        sub: 'Kristal Brantas melebur ke akar Pohon Beringin Agung',
                        narasi: 'Cahaya biru mengalir dari tanah — seperti urat sungai Brantas yang menembus akar-akar tua. Pohon Beringin Agung bergetar pelan.',
                        dur: 5000
                    },
                    {
                        chapter: '— Babak III — Keberanian Jiwa —',
                        title: '⚔️ Kenangan Dungeon Mengalir',
                        sub: 'Setiap pertempuran yang kamu menangkan... tersimpan di sini',
                        narasi: 'Rara Wilis menyentuh dadamu. Cahaya merah membara mengalir keluar — energi keberanian semua pertempuranmu menyatu dengan Pohon Beringin.',
                        dur: 5200
                    },
                    {
                        chapter: '— Babak IV — Cahaya Arsa —',
                        title: '✨ Kebijaksanaan Dewi Arsa',
                        sub: '"Kebaikan yang dilakukan tanpa pamrih... adalah cahaya abadi"',
                        narasi: 'Cahaya emas meledak dari pohon. Sekar menangis. Bening tertawa kecil. Wening memeluk batang pohon yang mulai menghijau.',
                        dur: 5500
                    },
                    {
                        chapter: '— Babak V — Benih Kehidupan —',
                        title: '🌱 Cintamu pada Alam Terbukti',
                        sub: 'Setiap benih yang kamu tanam... adalah doa',
                        narasi: 'Gambar ladangmu muncul di udara seperti ilusi — padi, jagung, tomat yang kamu rawat sendiri. Pohon Beringin Agung menyerapnya dengan rakus.',
                        dur: 5000
                    },
                    {
                        chapter: '— K L I M A K S —',
                        title: 'POHON BERINGIN AGUNG BANGKIT!',
                        sub: 'Kahyangan Wilis... wis urip maneh!',
                        narasi: 'Cabang-cabang hitam meledak menjadi hijau. Bunga kenanga bermekaran. Tembang Widadari terdengar dari seluruh lereng Wilis. Langit berubah jingga keemasan.',
                        dur: 6500
                    },
                    {
                        chapter: '— Epilog —',
                        title: '🌳 Kahyangan Wilis Hidup Kembali',
                        sub: '"Gunung Wilis ora bakal lali marang wong kang tresna alam."',
                        narasi: 'Rara Wilis berbalik padamu, matanya berkaca-kaca. Para Widadari menari di antara kenanga dan beringin yang kini rimbun. Untuk pertama kalinya dalam berabad-abad... Kahyangan Wilis bersinar.',
                        dur: 7000
                    },
                ];

                CinematicEngine.play('kahyangan', slides, () => {
                    STATE.screen = 'play';
                    STATE.cutsceneOverride = false;

                    p.sylvariaQuestComplete = true;
                    p.sylvariaQuest = p.sylvariaQuest || {};
                    p.sylvariaQuest.stage = 99;
                    p.str = (p.str||0)+10; p.int = (p.int||0)+10;
                    p.spd = (p.spd||0)+5;  p.biz = (p.biz||0)+5;
                    p.ethics = (p.ethics||0)+30;
                    p.reputation = (p.reputation||0)+25;
                    gainExp(1000);
                    addItem('mahkota_wilis', 1);
                    const fv = getFairyVillage();
                    fv.resources.debu    = (fv.resources.debu    || 0) + 50;
                    fv.resources.kristal = (fv.resources.kristal || 0) + 3;
                    manualSave();

                    setTimeout(() => {
                        showDialogue('SYLVA — RATU WIDADARI KAHYANGAN WILIS',
                            'Matur nuwun... seribu terima kasih.\n\n' +
                            'Selama berabad-abad aku menunggu di lereng Wilis ini. Dan kamu datang — bukan sebagai ksatria berbaju baja, tapi seseorang yang tulus mencintai alam.\n\n' +
                            '🌟 STR/INT +10 · SPD/BIZ +5 · Ethics +30 · REP +25\n' +
                            '👑 Mahkota Wilis — lambang Bhayangkara Kahyangan\n' +
                            '✨ +50 Serbuk Wilis · +3 Kristal Brantas\n\n' +
                            '"Gunung Wilis ora bakal lali marang wong kang tresna alam."',
                            [{
                                text: '🧚\u200d♀️ Kelola Kahyangan Wilis!',
                                action: () => { closeDialogue(); openFairyVillage(); }
                            }, {
                                text: 'Sampai jumpa lagi, Rara Wilis...',
                                action: closeDialogue
                            }],
                            npc ? npc.imgSrc : null
                        );
                        showToast('🌳 KAHYANGAN WILIS PULIH! Bhayangkara Wilis diakui! EXP +1000!');
                    }, 600);
                });
            }

            // ══════════════════════════════════════════════════════════════
            // 📊 ETHICS BERDAMPAK NYATA — Cek saat NPC dialog & aktivitas
            // ══════════════════════════════════════════════════════════════
            function getEthicsLabel() {
                const e = STATE.player.ethics || 0;
                if (e >= 90) return { label: "Bijaksana", color: "#4ade80" };
                if (e >= 70) return { label: "Baik", color: "#86efac" };
                if (e >= 50) return { label: "Biasa", color: "#fbbf24" };
                if (e >= 30) return { label: "Dipertanyakan", color: "#f97316" };
                return { label: "Gelap", color: "#ef4444" };
            }

            function applyEthicsToNPCPrices() {
                // Dipanggil saat masuk merchant — ethics rendah = markup harga
                const e = STATE.player.ethics || 0;
                if (e < 30) return 1.3; // 30% lebih mahal
                if (e < 50) return 1.1;
                if (e >= 80) return 0.95; // 5% diskon
                return 1.0;
            }

            function handleGulunganMbahLamong() {
                const p = STATE.player;
                if (p.gulunganDibaca) {
                    showToast("📜 Kamu sudah membaca gulungan ini. INT sudah meningkat.");
                    return;
                }
                p.gulunganDibaca = true;
                p.int = (p.int || 0) + 5;
                if (p.inventory['gulungan_mbahlamong'] > 0) p.inventory['gulungan_mbahlamong']--;
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                showDialogue("📜 GULUNGAN MBAH LAMONG",
                    "Kamu membuka gulungan tua itu dengan hati-hati...\n\n\"Ilmu yang tidak diamalkan adalah pohon yang tidak berbuah.\nKekuasaan yang tidak dilandasi kasih adalah pedang yang melukai tuannya sendiri.\nJagalah tanah ini seperti kamu menjaga ibumu — dengan cinta, bukan sekadar kewajiban.\"\n\n— Mbah Lamong\n\n✨ INT +5 permanen — Kebijaksanaan leluhur meresap dalam dirimu!",
                    [{ text: "Luar biasa...", action: closeDialogue }], null);
            }

            // --- NEW FUNCTION: GUILD BOUNTY SYSTEM ---
            function handleGuildMissions() {
                const p = STATE.player;

                // Inisialisasi atau Reset Harian (Jika hari berganti, reset status klaim)
                if (!p.guildMissionClaims || p.guildMissionClaims.day !== STATE.day) {
                    p.guildMissionClaims = {
                        day: STATE.day,
                        hunt: false,
                        collect_iron: false,
                        collect_scroll: false
                    };
                }

                const claims = p.guildMissionClaims;
                const killCount = p.dailyMonsterKills || 0;

                // Cek Stok Item di Tas
                const hasIron = (p.inventory['besi'] || 0) >= 2;
                const hasScroll = (p.inventory['scroll_exp'] || 0) >= 1;

                // --- MISI 1: PEMBURU MONSTER (Daily Kills) ---
                // Target: 3 Kill. Reward: 500 G
                let m1Text = "⚔️ **Misi Pemburu**: Basmi 3 Monster";
                let m1Action = null;

                if (claims.hunt) {
                    m1Text += " (✅ SELESAI)";
                    m1Action = () => showToast("Misi ini sudah diambil hari ini.");
                } else if (killCount >= 3) {
                    m1Text += " (🎁 SIAP KLAIM!)";
                    m1Action = () => claimGuildMission('hunt', 500, null, 0);
                } else {
                    m1Text += ` (❌ Progress: ${killCount}/3)`;
                    m1Action = () => showToast("Kalahkan monster di Dungeon!");
                }

                // --- MISI 2: PENGUMPUL BESI (Item Request) ---
                // Target: 2 Bijih Besi. Reward: 800 G
                let m2Text = "⛏️ **Misi Logam**: Setor 2 Bijih Besi";
                let m2Action = null;

                if (claims.collect_iron) {
                    m2Text += " (✅ SELESAI)";
                    m2Action = () => showToast("Sudah disetor.");
                } else if (hasIron) {
                    m2Text += " (🎁 SIAP SETOR!)";
                    m2Action = () => claimGuildMission('collect_iron', 800, 'besi', 2);
                } else {
                    m2Text += " (❌ Belum Cukup)";
                    m2Action = () => showToast("Cari Bijih Besi (Drop Monster/Boss)");
                }

                // --- MISI 3: PENCARI ILMU (Rare Item Request) ---
                // Target: 1 Gulungan Kuno. Reward: 1500 G
                let m3Text = "📜 **Misi Artefak**: Setor 1 Gulungan Kuno";
                let m3Action = null;

                if (claims.collect_scroll) {
                    m3Text += " (✅ SELESAI)";
                    m3Action = () => showToast("Sudah disetor.");
                } else if (hasScroll) {
                    m3Text += " (🎁 SIAP SETOR!)";
                    m3Action = () => claimGuildMission('collect_scroll', 1500, 'scroll_exp', 1);
                } else {
                    m3Text += " (❌ Belum Punya)";
                    m3Action = () => showToast("Cari Gulungan Kuno (Drop Rare di Dungeon)");
                }

                // Tampilkan Dialog
                const opts = [
                    { text: m1Text, action: m1Action },
                    { text: m2Text, action: m2Action },
                    { text: m3Text, action: m3Action },
                    { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                    { text: "Tutup", action: closeDialogue }
                ];

                showDialogue("GUILD BOUNTY BOARD",
                    "Daftar Buronan & Permintaan Logistik Hari Ini.\n(Reset setiap jam 24:00)",
                    opts,
                    'images/papanguild.png'
                );
            }

            function claimGuildMission(missionKey, rewardGold, itemReq, itemQty) {
                const p = STATE.player;

                // Jika ada syarat item, kurangi dari inventory
                if (itemReq) {
                    if ((p.inventory[itemReq] || 0) < itemQty) {
                        showToast("Item tidak cukup!");
                        return;
                    }
                    p.inventory[itemReq] -= itemQty;
                    if (p.inventory[itemReq] <= 0) delete p.inventory[itemReq];
                }

                // Beri Hadiah
                p.money += rewardGold;
                gainExp(50); // Bonus EXP

                // Tandai Selesai
                p.guildMissionClaims[missionKey] = true;

                // Efek Visual
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                showToast(`Misi Sukses! +${rewardGold} G`);

                // Refresh Menu agar status terupdate
                handleGuildMissions();

                // Auto Save
                manualSave();
            }

            function interactObject(obj) {
                // --- NEW: HANDLING KHUSUS ARTIFAK CANDI (Agar Guci, Prasasti, Altar, Lilin bisa diinteraksi) ---
                if (STATE.location === 'candi_interior' && (obj.type === 'sign' || obj.type === 'shelf' || obj.type === 'table')) {
                    let title = "ARTIFAK KUNO";
                    // Ambil judul dari teks (sebelum titik dua)
                    if (obj.text && obj.text.includes(":")) {
                        title = obj.text.split(":")[0].toUpperCase();
                    } else if (obj.text && obj.text.includes("Altar")) {
                        title = "ALTAR SUCI";
                    }

                    showDialogue(title, obj.text || "...", [{ text: "Tutup", action: closeDialogue }], obj.img);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    return;
                }

                // --- NEW: INTERAKSI BUNGA LIAR (PETIK) ---
                if (obj.type === 'wild_flower') {
                    showDialogue("BUNGA LIAR", "Sekuntum bunga cantik tumbuh di sini. Harumnya segar.", [
                        {
                            text: "Petik 🌸", action: () => {
                                // Tambah Item
                                addItem('bunga', 1);
                                showToast("Memetik Bunga Liar (+1 Bunga)");

                                // Efek Audio & Visual
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                createParticle(obj.x * TILE_SIZE, obj.y * TILE_SIZE, '#f472b6'); // Pink particles

                                // Hapus Objek dari Map
                                const map = maps[STATE.location];
                                const idx = map.objects.indexOf(obj);
                                if (idx > -1) {
                                    map.objects.splice(idx, 1);
                                }

                                // Tutup Dialog
                                closeDialogue();
                            }
                        },
                        { text: "Biarkan Tumbuh", action: closeDialogue }
                    ], 'images/bunga.png'); // Tampilkan gambar bunga di dialog
                    return;
                }

                // --- [BARU] INTERAKSI BONEKA SALJU ---
                else if (obj.type === 'snowman') {
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); // Suara lucu

                    showDialogue("BONEKA SALJU ⛄",
                        "Brrr... Dingin sekali ya? \n(Boneka salju ini tersenyum padamu dengan hidung wortelnya.)",
                        [
                            {
                                text: "Hancurkan (Iseng)",
                                action: () => {
                                    // Hapus boneka salju
                                    const map = maps[STATE.location];
                                    const idx = map.objects.indexOf(obj);
                                    if (idx > -1) {
                                        map.objects.splice(idx, 1);
                                        createParticle(obj.x * TILE_SIZE, obj.y * TILE_SIZE, '#ffffff');
                                        showToast("Kamu menghancurkan boneka salju! 😈");
                                        closeDialogue();
                                    }
                                }
                            },
                            { text: "Lucu sekali", action: closeDialogue }
                        ],
                        obj.img // Tampilkan gambar snowman
                    );
                    return;
                }



                // FIX: Mengubah 'else if' menjadi 'if' karena ini adalah kondisi pertama
                if (obj.type === 'sign') {
                    // --- UPDATE: LOGIKA DINAMIS UNTUK PAPAN MISI ---
                    if (obj.id === 'papan_misi') {
                        const dynamicText = getMissionBoardText();
                        const ptStatus = STATE.player.partTimeStatus;
                        const ptJobName = ptStatus === 'working' && STATE.player.partTimeJob ? (PART_TIME_JOBS[STATE.player.partTimeJob]?.name || 'Part-Time') : null;
                        const knownCount = (STATE.player.knownJobs || []).length;
                        showDialogue("PAPAN PENGUMUMAN", dynamicText, [
                            { text: `📋 Info Lowongan Kerja ${knownCount > 0 ? '('+knownCount+' tersimpan)' : '(Belum ada)'}`, action: () => {
                                closeDialogue();
                                if (knownCount === 0) searchJobFromBoard();
                                else openKnownJobsPanel(null);
                            }},
                            { text: '🔍 Cari Info Lowongan Baru', action: () => { closeDialogue(); openJobSearchMenu(); } },
                            { text: ptJobName ? `🌙 Part-Time: ${ptJobName} (Aktif)` : "🌟 Lihat Lowongan Part-Time", action: () => {
                                closeDialogue();
                                if ((STATE.player.knownJobs||[]).some(j=>j.startsWith('parttime')||j==='bengkel_formal')) openPartTimeLobby();
                                else openJobSearchMenu();
                            }},
                            { text: "Tutup", action: closeDialogue }
                        ], null);
                    }
                    // --- NEW: PAPAN MISI GUILD (BOUNTY) ---
                    else if (obj.id === 'guild_board') {
                        handleGuildMissions();
                    }
                    else {
                        // Sign biasa tetap pakai toast
                        showToast(obj.text);
                    }
                }
                // --- NEW: INTERAKSI BANGKU KAMPUS (BELAJAR TKJ) ---
                else if (obj.type === 'table' && STATE.location === 'school_interior') {
                    const isStudent = STATE.player.role === 'student';
                    const opts = [
                        {
                            text: "🧠 Kerjakan Soal TKJ (Energi -10)",
                            action: () => { closeDialogue(); startTKJStudy(); }
                        }
                    ];
                    if (isStudent) {
                        opts.push({
                            text: "🎨 Buat Media Pembelajaran (Fase 2)",
                            action: () => { closeDialogue(); openMediaLearningQuest(); }
                        });
                        opts.push({
                            text: "📁 Lihat Portofolio Karyaku",
                            action: () => { closeDialogue(); openPortfolioModal(); }
                        });
                    }
                    opts.push({ text: "Duduk santai saja", action: () => { showToast("Duduk beristirahat sejenak..."); closeDialogue(); } });
                    opts.push({ text: "Tutup", action: closeDialogue });

                    showDialogue("BANGKU KAMPUS", isStudent
                        ? "Ingin belajar, mengerjakan soal, atau membuat karya media pembelajaran?"
                        : "Ingin duduk sebentar dan mengasah pengetahuan seputar TKJ (Teknik Komputer & Jaringan)?",
                        opts, 'images/kursimahasiswa.png');
                    return;
                }

                // --- NEW: INTEGRASI LOGIKA KERJA (MERCHANT SHELF & COUNTER) ---
                // Cek dulu apakah ini objek toko dan pemain adalah pekerja
                else if ((obj.type === 'shelf' || obj.type === 'counter') && STATE.location === 'merchant_interior' && STATE.player.role === 'worker') {
                    handleWorkerInteraction(obj);
                    return; // Stop di sini agar tidak lanjut ke logika shelf/counter umum (jika ada)
                }

                // --- NEW: INTERAKSI TOKO PLAYER (MANAJEMEN TOKO) ---
                // FIX: PERBAIKAN LOGIKA AGAR TIDAK MEMBLOKIR OBJEK LAIN (BED, DIARY, DLL)
                // Hanya tangkap interaksi Counter (Kasir) dan Shelf (Rak Barang, KECUALI Lemari)
                else if (STATE.location === 'player_shop_interior' && STATE.player.role === 'entrepreneur' && (obj.type === 'counter' || (obj.type === 'shelf' && !obj.text.includes("Lemari")))) {
                    if (obj.type === 'counter') {
                        // Manajemen Toko (Jaga Lapak Minigame)
                        const income = Math.floor(STATE.player.biz * 10 * (1 + Math.random()));

                        showDialogue("MEJA KASIR", `Level Bisnis: ${Math.floor(STATE.player.biz)}\nApa yang ingin bos lakukan hari ini?`, [
                            {
                                text: "⚡ Jaga Toko (Minigame)",
                                action: () => {
                                    // Cek Energi
                                    if (STATE.player.energy >= 15) {
                                        STATE.player.energy -= 15;
                                        closeDialogue();
                                        startSalesGame(); // Buka Minigame Sales Rush
                                    } else {
                                        showToast("Terlalu lelah untuk jaga toko (Butuh 15 Energi)");
                                    }
                                }
                            },
                            {
                                text: "💰 Ambil Omset Pasif",
                                action: () => {
                                    if (STATE.player.lastShopCollect !== STATE.day) {
                                        STATE.player.money += income;
                                        STATE.player.lastShopCollect = STATE.day;
                                        STATE.player.biz += 1;
                                        const omzetAP = Math.max(1, Math.floor(STATE.player.biz / 5));
                                        STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + omzetAP;
                                        createFloatingText(`+${income} G +${omzetAP}AP`, '#4ade80');
                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                        showDialogue("LAPORAN KEUANGAN", `Pendapatan pasif hari ini: **${income} G**\nSkill Bisnis naik +1.\n\n🏅 +${omzetAP} Achievement Points dari omzet!`, [{ text: "Mantap", action: closeDialogue }], 'images/mejakasir.png');
                                    } else {
                                        showToast("Omset hari ini sudah diambil!");
                                    }
                                }
                            },
                            { text: "Tutup", action: closeDialogue }
                        ], 'images/mejakasir.png');
                        return;
                    } else if (obj.type === 'shelf') {
                        showToast("📦 Rak Display Barang (Stok Otomatis)");
                        return;
                    }
                }

                // --- [BARU] INTERAKSI ETALASE TOKO (BELI ALAT & BARANG) ---
                else if (obj.type === 'shelf' && STATE.location === 'merchant_interior') {
                    // Cek Nama Rak
                    if (obj.text === "Etalase Perkakas") {
                        showDialogue("TOKO PERKAKAS", "Menyediakan alat pertanian berkualitas.", [
                            { text: "⛏️ Beli Cangkul (500 G)", action: () => buyItem('cangkul', 500) },
                            { text: "💦 Beli Penyiram (300 G)", action: () => buyItem('penyiram', 300) }, // Opsional jika mau pakai item
                            { text: "Tutup", action: closeDialogue }
                        ], 'images/etalasetoko1.png');
                        return;
                    }
                    else if (obj.text === "Etalase Sembako") {
                        showDialogue("TOKO SEMBAKO", "Bahan makanan pokok.", [
                            { text: "🍞 Beli Roti (100 G)", action: () => buyItem('gandum', 100) }, // Anggap roti = gandum diolah
                            { text: "🐟 Beli Ikan (150 G)", action: () => buyItem('ikan_segar', 150) },
                            { text: "Tutup", action: closeDialogue }
                        ], 'images/etalasetoko1.png');
                        return;
                    }
                    // Biarkan rak lain menampilkan toast biasa
                    showToast(obj.text);
                    return;
                }

                // --- NEW: INTERAKSI LEMARI PAKAIAN (HOUSE & SHOP) - 4 OUTFIT SYSTEM ---
                // UPDATE: Kondisi ditambahkan untuk support 'player_shop_interior'
                else if (obj.type === 'shelf' && (STATE.location === 'house' || (STATE.location === 'player_shop_interior' && obj.text.includes("Lemari")))) {
                    const p = STATE.player;

                    // Helper ganti baju (lokal scope)
                    const changeOutfit = (type) => {

                        // --- TAMBAHAN BARU: SIMPAN JENIS BAJU KE STATE ---
                        STATE.player.outfit = type;
                        // -------------------------------------------------
                        const gender = p.gender;
                        let suffix = "";
                        let outfitName = "Seragam Sekolah";

                        if (type === 'default') {
                            suffix = "";
                            outfitName = "Seragam Sekolah";
                        } else if (type === 'wedding') {
                            suffix = "-weding"; // Sesuai aset yang ada (typo di aset lama 'weding')
                            outfitName = "Baju Pengantin";
                        } else if (type === 'armor') {
                            suffix = "-armor"; // Aset baru (pastikan file ada atau fallback)
                            outfitName = "Zirah Abadi";
                        } else if (type === 'special') {
                            suffix = "-special"; // Aset baru
                            outfitName = "Kostum Spesial";
                        } else if (type === 'gempita') {
                            suffix = "-special"; // Pakai sprite special sebagai fallback visual
                            outfitName = "🏅 Toga Gempita Juara";
                        }

                        // Update Source Gambar Player
                        // Kita reset src image objek yang sudah ada di STATE.player
                        if (p.spriteIdle) p.spriteIdle.src = `images/${gender}-idle${suffix}.png`;
                        if (p.spriteWalk) p.spriteWalk.src = `images/${gender}-walk${suffix}.png`;
                        if (p.spriteWalkUp) p.spriteWalkUp.src = `images/${gender}-atas${suffix}.png`;
                        if (p.spriteWalkDown) p.spriteWalkDown.src = `images/${gender}-bawah${suffix}.png`;
                        if (p.spriteAttack) p.spriteAttack.src = `images/${gender}-pukul${suffix}.png`;

                        // Setup Fallback Error (Jika gambar baju belum ada, balik ke default)
                        // Cukup pasang di spriteIdle sebagai indikator utama
                        if (p.spriteIdle) {
                            p.spriteIdle.onerror = function () {
                                this.src = `images/${gender}-idle.png`;
                                showToast(`Visual ${outfitName} belum tersedia, kembali ke default.`);
                            };
                        }

                        showToast(`Berganti ke: ${outfitName}`);

                        // Efek Partikel Ganti Baju
                        createParticle(p.x, p.y, '#ffffff');
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                        closeDialogue();
                    };

                    // Menu Pilihan Baju
                    let clothesOpts = [];

                    // 1. Seragam Sekolah (Default) - Selalu Ada
                    clothesOpts.push({
                        text: "Seragam Sekolah (Default)",
                        action: () => changeOutfit('default')
                    });

                    // 2. Baju Nikah (Syarat: Punya item 'pakaian_nikah' ATAU Sudah Menikah)
                    if (p.inventory['pakaian_nikah'] || p.married) {
                        clothesOpts.push({
                            text: "👘 Baju Pengantin",
                            action: () => changeOutfit('wedding')
                        });
                    } else {
                        clothesOpts.push({
                            text: "🔒 ??? (Baju Pengantin)",
                            action: () => showToast("Dapatkan 'Baju Pengantin' dari Marine (Penjahit) atau Misi.")
                        });
                    }

                    // 3. Baju Zirah (Syarat: Punya item 'zirah_legend')
                    if (p.inventory['zirah_legend']) {
                        clothesOpts.push({
                            text: "🛡️ Zirah Abadi",
                            action: () => changeOutfit('armor')
                        });
                    } else {
                        clothesOpts.push({
                            text: "🔒 ??? (Drop Boss Dungeon)",
                            action: () => showToast("Kalahkan Boss Dungeon untuk dapat Zirah Abadi!")
                        });
                    }

                    // 4. Baju Special (Syarat: Level 10 atau Item Khusus)
                    // Kita buat syarat Level 10 sebagai 'Special'
                    if (p.level >= 10 || p.inventory['kostum_special']) {
                        clothesOpts.push({
                            text: "✨ Kostum Spesial (Lv 10)",
                            action: () => changeOutfit('special')
                        });
                    } else {
                        clothesOpts.push({
                            text: "🔒 ??? (Capai Level 10)",
                            action: () => showToast("Tingkatkan Levelmu sampai 10 untuk membuka!")
                        });
                    }

                    // 5. Toga Gempita Juara (Syarat: item 'toga_gempita' di inventory)
                    if (p.inventory['toga_gempita']) {
                        clothesOpts.push({
                            text: "🏅 Toga Gempita Juara (EKSKLUSIF)",
                            action: () => changeOutfit('gempita')
                        });
                    } else {
                        clothesOpts.push({
                            text: "🔒 ??? (Hadiah Juara Gempita Season)",
                            action: () => showToast("Menangkan Gempita Season sebagai peringkat 1-3 untuk mendapatkan Toga Eksklusif ini!")
                        });
                    }

                    clothesOpts.push({ text: "Tutup", action: closeDialogue });

                    showDialogue("LEMARI PAKAIAN", "Pilih pakaian untuk dikenakan hari ini:", clothesOpts, 'images/lemari.png');
                    return;
                } else if (obj.type === 'bookshelf') {
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    showToast(`📖 Membaca: "${obj.text}"`);
                    // Sedikit EXP untuk membaca
                    if (Math.random() < 0.3) {
                        gainExp(1);
                    }
                }
                // UPDATE: Logika Interaksi Kalender (Quest & Goal Tracker)
                else if (obj.type === 'calendar') {
                    // Panggil fungsi UI Kalender Baru
                    openCalendar();
                }
                // UPDATE: Logika Interaksi Kotak Surat (Inbox) dengan Arsip
                else if (obj.type === 'mailbox') {
                    const msgs = STATE.player.messages || [];
                    const unread = msgs.filter(m => !m.read);

                    let dialogueText = "";
                    let actions = [];

                    if (msgs.length === 0) {
                        dialogueText = "Kotak surat kosong. Belum ada pesan dari Guru.";
                        actions = [{ text: "Tutup", action: closeDialogue }];
                    } else {
                        // Tampilkan cuplikan pesan terbaru
                        if (unread.length > 0) {
                            dialogueText = `Anda memiliki ${unread.length} pesan baru!\n\nPesan Terbaru:\n"${msgs[msgs.length - 1].text}"`;
                            actions.push({
                                text: "Tandai Semua Dibaca", action: () => {
                                    STATE.player.messages.forEach(m => m.read = true);
                                    showToast("Semua pesan ditandai dibaca ✅");
                                    // Tetap di dialog agar bisa buka arsip setelah baca
                                    interactObject(obj);
                                }
                            });
                        } else {
                            dialogueText = "Tidak ada pesan baru. \nPesan Terakhir:\n" + `"${msgs[msgs.length - 1].text}"`;
                        }

                        // TOMBOL BUKA ARSIP
                        actions.push({
                            text: "📂 Lihat Arsip Pesan", action: () => {
                                closeDialogue();
                                openMessageArchive();
                            }
                        });

                        actions.push({ text: "Tutup", action: closeDialogue });
                    }

                    showDialogue("KOTAK SURAT", dialogueText, actions, 'images/pos.png');
                }
                /* Dungeon exit is now auto-triggered, removing manual interaction */
                /*
                else if(obj.type === 'dungeon_exit') {
                    showDialogue("KELUAR DUNGEON", "Apakah kamu ingin kembali ke desa?", [
                        {text: "YA", action: () => {
                            STATE.location = 'village';
                            STATE.player.x = 48 * TILE_SIZE; 
                            STATE.player.y = 22 * TILE_SIZE;
                            closeDialogue();
                            showToast("Kembali ke Desa");
                        }},
                        {text: "TIDAK", action: closeDialogue}
                    ], null);
                }
                */
                else if (obj.type === 'fishing_spot') {
                    startFishingMinigame();
                }
                // --- NEW: INTERAKSI KASUR (TIDUR) ---
                else if (obj.type === 'bed') {
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                    const extraOpts = [];
                    // Jika role family atau married — tambah tombol aktivitas rumah
                    if (STATE.player.role === 'family' || STATE.player.married) {
                        extraOpts.push({
                            text: '🏠 Cek Aktivitas Rumah (Masak/Bersih)',
                            action: () => { closeDialogue(); showDailyHousekeepingMenu(); }
                        });
                    }

                    showDialogue("KASUR EMPUK", "Apakah kamu mau tidur sekarang?", [
                        {
                            text: "Ya, Tidur (Save & Next Day) 🛌", action: () => {
                                const hasJournalToday = STATE.player.reflections.some(r => r.day === STATE.day);
                                if (hasJournalToday) {
                                    closeDialogue();
                                    handleSleep();
                                } else {
                                    showDialogue("REFLEKSI HARIAN",
                                        "Sebelum tidur, mari refleksikan harimu sejenak di Jurnal.\n\n(Hadiah: +500 Gold & +50 EXP)",
                                        [{
                                            text: "✍️ Tulis Jurnal",
                                            action: () => { closeDialogue(); openJournalModal(true); }
                                        }, {
                                            text: "Batal Tidur",
                                            action: closeDialogue
                                        }],
                                        'images/buku.png'
                                    );
                                }
                            }
                        },
                        ...extraOpts,
                        { text: "Belum ngantuk", action: closeDialogue }
                    ], 'images/bed.png');
                }
                else if (obj.type === 'diary') {
                    // UPDATE: Ganti 'bg' ke 'item' agar bunyi saat interaksi awal
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                    let questText = "";
                    if (STATE.player.role === 'worker') {
                        questText = "QUEST PEKERJA:\n1. Pergi ke Merchant (Gedung).\n2. Bicara pada Bos & Lamar Kerja.\n3. Masuk kerja jam 08:00 setiap pagi.\n4. Jangan terlambat agar tidak dipecat!";
                    } else if (STATE.player.role === 'student') {
                        questText = "QUEST SISWA:\n1. Masuk Kampus setiap pagi.\n2. Baca buku di rumah untuk INT.\n3. Kejar Beasiswa.";
                    } else if (STATE.player.role === 'entrepreneur') {
                        questText = "QUEST WIRAUSAHA:\n1. Beli murah di Merchant.\n2. Jual saat harga naik di Menu Trading.\n3. Kumpulkan 100k Gold.";
                    } else if (STATE.player.role === 'family') {
                        questText = "QUEST KELUARGA:\n1. Sapa tetangga (Interact).\n2. Cari pasangan di desa.\n3. Nabung untuk nikah.";
                    } else {
                        questText = "Halo! Di meja ini kamu bisa tulis jurnal dan belajar mandiri.";
                    }

                    showDialogue("📔 MEJA JURNAL", questText, [
                        {
                            text: "📝 Tulis Jurnal Harian", action: () => {
                                closeDialogue();
                                openJournalModal();
                            }
                        },
                        {
                            text: "📝 Buat Surat Lamaran Kerja", action: () => {
                                closeDialogue();
                                openStudyDeskLamaranMenu();
                            }
                        },
                        {
                            text: "ℹ️ Penjelasan Status", action: () => {
                                showDialogue("PANDUAN STATUS",
                                    "💪 STR: Kekuatan fisik. Berguna untuk kerja kasar & lawan monster.\n🧠 INT: Kecerdasan. Berguna untuk nilai kuliah & dialog pintar.\n📈 BIZ: Bisnis. Meningkatkan profit dagang & diskon.\n❤️ REP: Reputasi. Penting untuk hubungan sosial & menikah.",
                                    [{ text: "Kembali", action: () => interactObject(obj) }], 'images/buku.png');
                            }
                        },

                        /* --- NEW: MENU BELAJAR MANDIRI --- */
                        {
                            text: "📚 Belajar Mandiri (Energy -15)", action: () => {
                                closeDialogue();
                                openSelfStudyMenu();
                            }
                        },

                        // 🏠 AKTIVITAS RUMAH (khusus role family / sudah menikah)
                        ...(STATE.player.role === 'family' || STATE.player.married ? [{
                            text: "🏠 Aktivitas Rumah (Masak/Bersih/dll)",
                            action: () => { closeDialogue(); showDailyHousekeepingMenu(); }
                        }] : []),

                        { text: "Tutup", action: closeDialogue }
                    ], 'images/buku.png');
                }
                else if (obj.type === 'chores') {
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    showDailyHousekeepingMenu();
                }
                else if (obj.type === 'kitchen') {
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    const p = STATE.player;
                    const houseLevel = p.houseLevel || 1;

                    // Resep masakan ala Harvest Moon - level dapur menentukan pilihan
                    const recipes = [
                        {
                            id: 'nasi_goreng', name: '🍳 Nasi Goreng', energyCost: 10,
                            desc: 'Masak dari bahan sederhana.',
                            effect: () => {
                                p.energy = Math.min(100, p.energy + 30);
                                p.hp = Math.min(p.maxHp, p.hp + 10);
                                showToast('😋 Nasi Goreng siap! +30 Energy, +10 HP');
                            },
                            available: true
                        },
                        {
                            id: 'sup_ayam', name: '🍲 Sup Ayam', energyCost: 15,
                            desc: 'Menyehatkan dan mengenyangkan.',
                            effect: () => {
                                p.energy = Math.min(100, p.energy + 50);
                                p.hp = Math.min(p.maxHp, p.hp + 25);
                                showToast('🍲 Sup Ayam siap! +50 Energy, +25 HP');
                            },
                            available: houseLevel >= 3
                        },
                        {
                            id: 'kue_lapis', name: '🍰 Kue Lapis', energyCost: 20,
                            desc: 'Manis & bikin mood bagus. +REP jika dibagi.',
                            effect: () => {
                                p.energy = Math.min(100, p.energy + 20);
                                p.reputation = (p.reputation || 0) + 5;
                                showToast('🍰 Kue Lapis siap! +20 Energy, +5 REP');
                            },
                            available: houseLevel >= 4
                        },
                        {
                            id: 'rendang', name: '🥩 Rendang Spesial', energyCost: 25,
                            desc: 'Masakan terbaik. Buff stat penuh!',
                            effect: () => {
                                p.energy = Math.min(100, p.energy + 60);
                                p.hp = Math.min(p.maxHp, p.hp + 40);
                                p.str = (p.str || 0) + 1;
                                showToast('🥩 Rendang siap! +60 Energy, +40 HP, +1 STR (hari ini)!');
                            },
                            available: houseLevel >= 5
                        }
                    ];

                    const availableRecipes = recipes.filter(r => r.available);
                    const opts = availableRecipes.map(r => ({
                        text: `${r.name} (Energy -${r.energyCost})`,
                        action: () => {
                            if (p.energy < r.energyCost) {
                                showToast('⚡ Energi tidak cukup untuk memasak!');
                                return;
                            }
                            if (p.dailyChores && p.dailyChores.cooking) {
                                showToast('✅ Sudah memasak hari ini!');
                                return;
                            }
                            p.energy -= r.energyCost;
                            if (!p.dailyChores) p.dailyChores = {};
                            p.dailyChores.cooking = true;
                            r.effect();
                            closeDialogue();
                            DataService.saveGame({ player: p, ...STATE });
                        }
                    }));
                    opts.push({ text: '❌ Tutup', action: closeDialogue });

                    const alreadyCooked = p.dailyChores && p.dailyChores.cooking;
                    const kitchenName = houseLevel >= 5 ? "DAPUR MEWAH 🍽️" : "DAPUR 🍳";
                    const desc = alreadyCooked
                        ? `Sudah memasak hari ini! Istirahat dulu.

(Bisa masak lagi besok)`
                        : `Selamat datang di dapur!
Pilih masakan:

⚡ Energy kamu: ${p.energy}/100`;

                    showDialogue(kitchenName, desc, opts, 'images/dapurayaayu.png');
                }
                else if (obj.type === 'catalog') {
                    const furn = STATE.player.furniture || [];
                    const hasKurcaciHouse = furn.includes('rumah_kurcaci');
                    const hasCarpet = furn.includes('carpet_red');
                    const hasTV = furn.includes('tv_flat');
                    showDialogue("KATALOG BELANJA 🛒", "Beli furnitur untuk memperindah rumahmu:", [
                        {
                            text: hasCarpet ? "✅ Karpet Merah (Sudah punya)" : "🟥 Karpet Merah (50k G)",
                            action: () => {
                                if (hasCarpet) { showToast("Karpet sudah terpasang di rumahmu!"); return; }
                                showDialogue("KARPET MERAH 🟥", "Karpet bulu merah mewah yang bikin lantai rumahmu terasa hangat dan elegan.\n\nHarga: 50.000 G\nEfek: Dekorasi lantai di dalam rumah.", [
                                    { text: "Beli Sekarang", action: () => buyFurniture('carpet_red', 50000) },
                                    { text: "Batal", action: closeDialogue }
                                ], null);
                            }
                        },
                        {
                            text: hasTV ? "✅ TV Layar Datar (Sudah punya)" : "📺 TV Layar Datar (150k G)",
                            action: () => {
                                if (hasTV) { showToast("TV sudah terpasang di dinding rumahmu!"); return; }
                                showDialogue("TV LAYAR DATAR 📺", "Televisi modern 50 inci. Hiburan terbaik setelah seharian kerja keras!\n\nHarga: 150.000 G\nEfek: Dekorasi dinding dalam rumah.", [
                                    { text: "Beli Sekarang", action: () => buyFurniture('tv_flat', 150000) },
                                    { text: "Batal", action: closeDialogue }
                                ], null);
                            }
                        },
                        {
                            text: hasKurcaciHouse ? "✅ Rumah Kurcaci (Sudah punya)" : "🏠 Rumah Kurcaci (150k G) — Syarat rekrut Gorki!",
                            action: () => {
                                if (hasKurcaciHouse) {
                                    showDialogue("RUMAH KURCACI 🏠", "Rumah kurcaci sudah terpasang di sudut rumahmu!\n\n🌱 Gorki si Kurcaci Tani bisa kamu ajak bergabung saat **Festival Panen Raya (Summer Hari 1)**.\nCari Gorki di ladang dekat rumahmu!", [
                                        { text: "Siap!", action: closeDialogue }
                                    ], null);
                                    return;
                                }
                                showDialogue("RUMAH KURCACI 🏠", "Rumah mungil kayu untuk si Kurcaci Tani!\n\n🌱 **SYARAT REKRUT GORKI:**\nKurcaci Tani (Gorki) hanya mau bergabung jika kamu sudah menyiapkan rumah kecil untuknya.\n\n✨ Efek setelah punya:\n• Gorki bisa direkrut saat Festival Panen (Summer Hari 1)\n• Gorki akan **menyiram semua tanaman otomatis** tiap pagi!\n• Rumah kurcaci muncul di sudut dalam rumahmu\n\nHarga: 150.000 G", [
                                        { text: "🏠 Beli Sekarang!", action: () => buyFurniture('rumah_kurcaci', 150000) },
                                        { text: "Batal", action: closeDialogue }
                                    ], null);
                            }
                        },
                        { text: `🏰 UPGRADE RUMAH (LV ${STATE.player.houseLevel + 1})`, action: () => showUpgradeHousePreview() },
                        { text: "Tutup", action: closeDialogue }
                    ], null);
                }
            }

            // --- NEW: LOGIKA SISTEM JURNAL & REWARD ---
            let isSleepPending = false; // Flag global untuk menandai niat tidur

            // =====================================================
