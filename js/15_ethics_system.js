// ========================================================
// js/15_ethics_system.js
// Ethics System & Cinematic Engine
// ========================================================

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
            // SISTEM JURNAL BERBASIS ROLE & HARI
            // Pertanyaan berputar tiap hari, unik per jalur karir
            // =====================================================
            const REFLECTION_QUESTIONS_BY_ROLE = {
                none: [
                    "Hari pertamamu di Pulau Arsa! Apa yang paling membuatmu penasaran?",
                    "Kamu belum memilih jalur karir. Setelah menjelajah, jalur apa yang paling menarik bagimu — Pekerja, Akademisi, Wirausaha, atau Keluarga?",
                    "Coba ceritakan, warga mana yang sudah kamu temui hari ini dan apa yang kamu pelajari dari mereka?",
                    "Menurutmu, apa perbedaan antara menjadi Pekerja dan Wirausaha di dunia nyata?",
                    "Kamu masih di awal perjalanan. Apa rencana besarmu di Pulau Arsa?",
                    "Kalau kamu bisa memilih hidup idealmu di dunia nyata, itu seperti apa?",
                    "Sudahkah kamu menemui Mentor Budi? Apa nasehat yang paling berkesan darinya?",
                ],
                worker: [
                    "Hari ini kamu bekerja sebagai pekerja. Apa tugas terberat yang kamu hadapi di shift hari ini?",
                    "Seorang pekerja yang hebat punya disiplin tinggi. Apakah kamu sudah masuk shift tepat waktu hari ini? Ceritakan!",
                    "Bagaimana hubunganmu dengan Bos? Apakah reputasimu sudah meningkat? Apa yang kamu lakukan untuk itu?",
                    "Sebagai pekerja, gaji adalah sumber utama penghasilanmu. Bagaimana kamu mengelola keuanganmu hari ini?",
                    "Apa pekerjaan impianmu di dunia nyata? Apakah jalur Pekerja di game ini mencerminkan pekerjaan itu?",
                    "Pernah merasa lelah dan ingin berhenti bekerja hari ini? Bagaimana kamu mengatasinya?",
                    "Jika kamu adalah manajer toko, apa kebijakan pertama yang kamu terapkan untuk karyawanmu?",
                    "Hari Ahad adalah hari liburmu. Apa yang kamu lakukan untuk mengisi waktu istirahat dengan produktif?",
                    "STR (Kekuatan) adalah stat utama jalur Pekerja. Bagaimana cara kamu meningkatkannya hari ini?",
                    "Apakah ada rekan kerja yang membantumu hari ini? Ceritakan pengalamannya!",
                    "Menurutmu, apa nilai penting yang dipelajari dari menjadi seorang pekerja yang jujur dan tekun?",
                    "Hari ini kamu mendapat gaji. Untuk apa rencana penggunaan uangmu?",
                    "Bagaimana rasanya bekerja keras seharian? Apa yang membuatmu semangat terus?",
                    "Skill apa yang ingin kamu kuasai sebagai pekerja profesional di dunia nyata?",
                ],
                student: [
                    "Hari ini kamu hadir kuliah. Materi apa yang paling menarik yang kamu pelajari dari Dosen?",
                    "Seorang akademisi selalu haus ilmu. Apa buku atau referensi yang ingin kamu baca minggu ini?",
                    "Bagaimana cara kamu menyeimbangkan belajar dan beristirahat? Apakah energimu masih cukup?",
                    "Nilai INT (Kecerdasan) mencerminkan ilmu yang kamu serap. Seberapa banyak kamu belajar hari ini?",
                    "Kalau kamu bisa memilih jurusan di dunia nyata, kamu pilih apa? Mengapa?",
                    "Perpustakaan adalah surganya Akademisi. Apa yang kamu temukan dari riset di perpustakaan hari ini?",
                    "Pernah kesulitan memahami materi kuliah? Bagaimana strategi belajarmu untuk mengatasinya?",
                    "Hari ini weekend, kampus libur. Bagaimana kamu memanfaatkan waktu bebas untuk tetap produktif?",
                    "Apa cita-citamu setelah lulus nanti? Bagaimana game ini membantumu memahami perjalanan itu?",
                    "Apakah kamu sudah mulai tesis? Apa topik yang ingin kamu angkat jika bisa memilih?",
                    "Bagaimana hubunganmu dengan teman-teman di kampus? Apakah kamu sudah banyak bergaul?",
                    "Jelaskan satu hal penting yang kamu pelajari hari ini — baik dari game maupun dari pelajaran sekolahmu!",
                    "Sebagai akademisi, integritas adalah segalanya. Apa keputusan jujur yang kamu buat hari ini?",
                    "Apa tantangan terbesar menjadi seorang pelajar di game ini? Bagaimana kamu mengatasinya?",
                ],
                entrepreneur: [
                    "Hari ini kamu menjalankan bisnis. Apa transaksi atau keputusan dagang paling penting yang kamu buat?",
                    "Seorang wirausaha harus jeli melihat peluang. Apakah ada tren viral di pasar hari ini? Apa yang kamu lakukan?",
                    "Bagaimana kondisi stok barang dagangan kamu? Apakah ada yang perlu segera dibeli atau dijual?",
                    "BIZ (Kemampuan Bisnis) adalah kunci jalurmu. Apa aktivitas yang paling meningkatkan BIZ hari ini?",
                    "Seorang entrepreneur sukses punya mental pantang menyerah. Kegagalan apa yang kamu hadapi hari ini dan pelajaran apa yang kamu ambil?",
                    "Berapa omset yang berhasil kamu kumpulkan hari ini? Apakah sudah mencapai target harianmu?",
                    "Jika kamu bisa membuka bisnis nyata, bisnis apa yang ingin kamu dirikan? Mengapa?",
                    "Strategi apa yang kamu pakai untuk bersaing dengan pedagang lain di pasar?",
                    "Apa perbedaan antara wirausahawan yang sukses dan yang gagal menurutmu?",
                    "Bagaimana kamu mengelola risiko dalam berdagang hari ini? Apakah ada keputusan berisiko yang kamu ambil?",
                    "Rumah adalah aset terpenting Wirausaha. Bagaimana progres upgrade rumahmu sejauh ini?",
                    "Ceritakan satu ide bisnis kreatif yang terlintas di benakmu hari ini!",
                    "Apakah kamu sudah memanfaatkan sistem barter atau investasi di game? Bagaimana hasilnya?",
                    "Apa nilai karakter wirausahawan yang paling ingin kamu miliki di kehidupan nyata?",
                ],
                family: [
                    "Hari ini kamu menjalani peran keluarga. Siapa warga yang paling dekat dengan hatimu di Pulau Arsa?",
                    "Reputasi adalah kunci jalur Keluarga. Apa kebaikan yang kamu lakukan untuk warga desa hari ini?",
                    "Hubungan antar manusia butuh waktu dan perhatian. Sudahkah kamu menyapa 2 orang berbeda hari ini?",
                    "Apa artinya sebuah keluarga yang bahagia bagimu? Apakah sudah mendekati gambaran itu di game?",
                    "Apakah kamu sudah mengunjungi Balai Pernikahan dan menemui Pak Modin? Ceritakan pengalamannya!",
                    "REP (Reputasi) mencerminkan citra sosialmu. Apa yang membuatmu bangga hari ini?",
                    "Hidup bermasyarakat penuh dengan kompromi. Apakah ada konflik atau tantangan sosial yang kamu hadapi hari ini?",
                    "Jika kamu sudah menikah di game, apa hal yang paling berkesan dari perjalanan membangun keluarga itu?",
                    "Bagaimana kamu menjaga keseimbangan antara kebutuhan diri sendiri dan orang-orang sekitarmu?",
                    "Siapa tokoh panutan dalam hidupmu? Apakah ada warga desa yang mengingatkanmu pada tokoh itu?",
                    "Apa impian sederhana yang paling ingin kamu wujudkan bersama keluargamu di masa depan?",
                    "Bagaimana caramu menunjukkan kepedulian kepada orang lain, baik di game maupun di kehidupan nyata?",
                    "Apa pelajaran tentang tanggung jawab yang kamu dapatkan dari jalur Keluarga hari ini?",
                    "Ceritakan momen paling mengharukan yang kamu alami bersama warga desa hari ini!",
                ],
            };

            // Fungsi untuk mendapatkan pertanyaan jurnal sesuai role dan hari
            function getJournalQuestion() {
                const role = (STATE.player && STATE.player.role) ? STATE.player.role : 'none';
                const day = STATE.day || 1;
                const pool = REFLECTION_QUESTIONS_BY_ROLE[role] || REFLECTION_QUESTIONS_BY_ROLE['none'];
                // Deterministik: hari ke-N pakai pertanyaan ke-(N-1) mod panjang pool
                // Sehingga tiap hari beda, tidak acak, tapi berputar
                return pool[(day - 1) % pool.length];
            }

            // Fungsi untuk mendapatkan hint role di jurnal
            function getJournalHint() {
                const role = (STATE.player && STATE.player.role) ? STATE.player.role : 'none';
                const p = STATE.player;
                const hints = {
                    none: "💡 Kamu belum memilih jalur! Temui <b>Mentor Budi</b> di desa, lalu tidur di rumah untuk memilih jalurmu.",
                    worker: p && p.jobStatus === 'unemployed'
                        ? "💡 Kamu belum bekerja! Pergi ke <b>Toko Merchant (Selatan)</b> dan lamar kerja ke Bos."
                        : "💡 Jangan lupa masuk <b>shift kerja (08:00)</b> dan tingkatkan reputasi ke Bos untuk naik jabatan!",
                    student: p && !p.major
                        ? "💡 Kamu belum mendaftar kuliah! Pergi ke <b>Gedung Kampus (Timur)</b> dan pilih jurusanmu."
                        : "💡 Hadir <b>kuliah jam 08:00</b>, kunjungi <b>Perpustakaan</b>, dan belajar mandiri untuk naikkan INT!",
                    entrepreneur: "💡 Pantau tren viral di <b>Sosmed HP</b>, beli murah di <b>Pedagang</b>, jual mahal ke <b>Merchant</b> untuk cuan besar!",
                    family: p && p.activeQuest === 'meet_modin'
                        ? "💡 Quest aktif: Pergi ke <b>Balai Pernikahan (Selatan)</b> dan temui <b>Pak Modin</b>!"
                        : "💡 Perbanyak interaksi dengan warga desa untuk naikkan REP, dan jaga hubungan agar impian berkeluarga terwujud!",
                };
                return hints[role] || hints['none'];
            }

            // JUGA: Fallback array lama (untuk kompatibilitas kode lain yang mungkin mereferensinya)
            const REFLECTION_QUESTIONS = REFLECTION_QUESTIONS_BY_ROLE['none'];

            // --- NEW FUNCTION: BELAJAR MANDIRI ---
            function openSelfStudyMenu() {
                const subjects = STATE.player.learnedSubjects || [];

                if (subjects.length === 0) {
                    showDialogue("CATATAN KOSONG",
                        "Kamu belum memiliki catatan materi kuliah.\n\n**Hadir kuliah** (Jam 08:00 - 14:00) untuk mendapatkan ilmu yang bisa dipelajari ulang di sini.",
                        [{ text: "Baiklah", action: closeDialogue }],
                        'images/buku.png'
                    );
                    return;
                }

                // Buat daftar opsi materi (Ambil 3 terakhir biar gak kepanjangan)
                const opts = [];
                // Reverse agar materi terbaru di atas
                const recentSubjects = [...subjects].reverse().slice(0, 3);

                recentSubjects.forEach(sub => {
                    opts.push({
                        text: `📖 ${sub.t}`,
                        action: () => {
                            if (STATE.player.energy >= 15) {
                                STATE.player.energy -= 15;
                                STATE.player.int += 1; // Reward kecil
                                gainExp(10);
                                STATE.player.dailySelfStudy = (STATE.player.dailySelfStudy || 0) + 1; // Track bonus quest

                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                createParticle(STATE.player.x, STATE.player.y, '#3b82f6');

                                showDialogue(`REVIEW: ${sub.t}`,
                                    `"${sub.c}"\n\n(Kamu mempelajari ulang materi ini. Pemahamanmu semakin dalam!)`,
                                    [{ text: "Selesai Belajar", action: closeDialogue }],
                                    'images/buku.png'
                                );
                            } else {
                                showToast("Energi tidak cukup (Butuh 15)!");
                            }
                        }
                    });
                });

                opts.push({ text: "Kembali", action: closeDialogue });

                showDialogue("BELAJAR MANDIRI", "Pilih materi untuk dipelajari ulang (INT +1, EXP +10):", opts, 'images/buku.png');
            }

            // =====================================================================
            // FASE 2 — QUEST MEDIA PEMBELAJARAN & PORTOFOLIO
            // =====================================================================

            const MEDIA_TOPICS = [
                { id: 'fisika', label: '⚛️ Fisika', emoji: '⚛️', desc: 'Gerak, gaya, energi, dan materi' },
                { id: 'biologi', label: '🌿 Biologi', emoji: '🌿', desc: 'Sel, ekosistem, evolusi' },
                { id: 'matematika', label: '📐 Matematika', emoji: '📐', desc: 'Aljabar, geometri, statistika' },
                { id: 'sejarah', label: '🏛️ Sejarah', emoji: '🏛️', desc: 'Peradaban, revolusi, tokoh' },
                { id: 'bahasa', label: '📝 Bahasa Indonesia', emoji: '📝', desc: 'Sastra, teks, keterampilan berbahasa' },
                { id: 'tkj', label: '💻 Teknik Komputer', emoji: '💻', desc: 'Jaringan, hardware, software' },
                { id: 'ekonomi', label: '💹 Ekonomi', emoji: '💹', desc: 'Pasar, produksi, konsumsi' },
            ];

            const MEDIA_FORMATS = [
                { id: 'video', label: '🎬 Video Animasi', emoji: '🎬', apBonus: 30, intBonus: 2, desc: 'Visual & audio menarik, cocok untuk semua gaya belajar' },
                { id: 'poster', label: '🖼️ Poster Infografis', emoji: '🖼️', apBonus: 20, intBonus: 1, desc: 'Ringkas, mudah dipasang, kaya data visual' },
                { id: 'game', label: '🎮 Game Edukasi', emoji: '🎮', apBonus: 40, intBonus: 3, desc: 'Interaktif dan engaging, tingkat kesulitan tinggi' },
                { id: 'kuis', label: '❓ Kuis Interaktif', emoji: '❓', apBonus: 25, intBonus: 2, desc: 'Evaluasi pemahaman siswa secara langsung' },
                { id: 'modul', label: '📚 Modul Digital', emoji: '📚', apBonus: 20, intBonus: 1, desc: 'Teks lengkap dan terstruktur, bisa diunduh' },
            ];

            // State sementara untuk proses pembuatan media
            let _mediaInProgress = null;

            function openMediaLearningQuest() {
                const p = STATE.player;
                if (p.energy < 20) {
                    showDialogue("TERLALU LELAH", "Kamu butuh minimal 20 Energi untuk membuat media pembelajaran.\n\nIstirahatlah dulu!", [{ text: "Baik", action: closeDialogue }], 'images/buku.png');
                    return;
                }

                // Cek apakah sudah ada karya hari ini
                const today = STATE.day || 1;
                const alreadyToday = (p.portfolioItems || []).some(item => item.day === today);
                if (alreadyToday) {
                    showDialogue("SUDAH CUKUP", `Kamu sudah membuat media pembelajaran hari ini (Hari ${today}).\n\nKembali besok untuk membuat karya baru! 💪`, [{ text: "Oke", action: closeDialogue }], 'images/buku.png');
                    return;
                }

                // Langkah 1: Pilih Topik
                const topicOpts = MEDIA_TOPICS.map(t => ({
                    text: `${t.label}`,
                    action: () => {
                        _mediaInProgress = { topicId: t.id, topicLabel: t.label, topicEmoji: t.emoji };
                        chooseMediaFormat();
                    }
                }));
                topicOpts.push({ text: "❌ Batal", action: closeDialogue });

                showDialogue("🎨 BUAT MEDIA PEMBELAJARAN", "Langkah 1 dari 3: Pilih TOPIK yang ingin kamu buat medianya!", topicOpts, 'images/buku.png');
            }

            function chooseMediaFormat() {
                const formatOpts = MEDIA_FORMATS.map(f => ({
                    text: `${f.label} (+${f.apBonus} AP, INT +${f.intBonus})`,
                    action: () => {
                        _mediaInProgress.formatId    = f.id;
                        _mediaInProgress.formatLabel = f.label;
                        _mediaInProgress.formatEmoji = f.emoji;
                        _mediaInProgress.apBonus     = f.apBonus;
                        _mediaInProgress.intBonus    = f.intBonus;
                        choosePresentationTarget();
                    }
                }));
                formatOpts.push({ text: "⬅ Kembali", action: openMediaLearningQuest });

                showDialogue("🎨 BUAT MEDIA PEMBELAJARAN",
                    `Topik: ${_mediaInProgress.topicLabel}\n\nLangkah 2 dari 3: Pilih FORMAT media yang akan kamu buat!`,
                    formatOpts, 'images/buku.png');
            }

            function choosePresentationTarget() {
                const targets = [
                    { id: 'kelas', label: '👩‍🏫 Presentasi ke Kelas',   desc: 'Tampilkan ke teman sekelas di kampus' },
                    { id: 'dosen', label: '🎓 Presentasi ke Dosen',    desc: 'Dapatkan penilaian dari Dosen pembimbing' },
                    { id: 'lomba', label: '🏆 Ikutkan ke Kompetisi',   desc: 'Submit ke Gempita Awards (AP x2!)' },
                    { id: 'online', label: '🌐 Publikasi Online',       desc: 'Share ke sosmed, raih penonton luas' },
                ];

                const targetOpts = targets.map(t => ({
                    text: `${t.label}`,
                    action: () => {
                        _mediaInProgress.targetId    = t.id;
                        _mediaInProgress.targetLabel = t.label;
                        if (t.id === 'lomba') _mediaInProgress.apBonus = Math.floor(_mediaInProgress.apBonus * 2); // x2 AP untuk lomba
                        finalizeMediaCreation();
                    }
                }));
                targetOpts.push({ text: "⬅ Kembali", action: chooseMediaFormat });

                showDialogue("🎨 BUAT MEDIA PEMBELAJARAN",
                    `Topik: ${_mediaInProgress.topicLabel}\nFormat: ${_mediaInProgress.formatLabel}\n\nLangkah 3 dari 3: Untuk siapa media ini kamu presentasikan?`,
                    targetOpts, 'images/buku.png');
            }

            function finalizeMediaCreation() {
                const p = STATE.player;
                const m = _mediaInProgress;

                // Kurangi energi
                p.energy = Math.max(0, p.energy - 20);
                // Beri reward
                p.int = (p.int || 0) + m.intBonus;
                p.achievementPoints = (p.achievementPoints || 0) + m.apBonus;
                gainExp(30);

                // Simpan ke portofolio
                const karya = {
                    id:          `karya_${Date.now()}`,
                    day:         STATE.day || 1,
                    date:        new Date().toISOString(),
                    topicId:     m.topicId,
                    topicLabel:  m.topicLabel,
                    topicEmoji:  m.topicEmoji,
                    formatId:    m.formatId,
                    formatLabel: m.formatLabel,
                    formatEmoji: m.formatEmoji,
                    targetId:    m.targetId,
                    targetLabel: m.targetLabel,
                    apEarned:    m.apBonus,
                    intEarned:   m.intBonus,
                    teacherNote: '' // akan diisi guru dari dashboard
                };

                if (!p.portfolioItems) p.portfolioItems = [];
                p.portfolioItems.push(karya);
                _mediaInProgress = null;

                // Track bonus quest (reuse dailySelfStudy slot atau buat field baru)
                p.dailyMediaCreation = (p.dailyMediaCreation || 0) + 1;

                // Efek visual
                if (typeof AudioService !== 'undefined') AudioService.playSFX('levelup');
                createParticle(p.x, p.y, '#8b5cf6');
                createParticle(p.x + 10, p.y - 10, '#fbbf24');

                const isLomba = karya.targetId === 'lomba';
                showDialogue("🏆 KARYA SELESAI!",
                    `✅ Media pembelajaran berhasil dibuat!\n\n${karya.topicEmoji} Topik: ${karya.topicLabel}\n${karya.formatEmoji} Format: ${karya.formatLabel}\n🎯 Ditujukan untuk: ${karya.targetLabel}\n\n` +
                    `🏅 +${karya.apEarned} Poin Prestasi\n🧠 INT +${karya.intEarned}\n⭐ EXP +30\n\n` +
                    (isLomba ? `🌟 BONUS LOMBA: AP dikalikan 2!\nKarya ini siap diajukan ke Gempita Awards!` : `Karya tersimpan di Portofoliomu. Guru dapat melihat dan menilainya!`),
                    [
                        { text: "📁 Lihat Portofolio", action: () => { closeDialogue(); openPortfolioModal(); } },
                        { text: "Lanjutkan Bermain", action: closeDialogue }
                    ],
                    'images/buku.png'
                );

                // Autosave
                if (typeof DataService !== 'undefined') DataService.save(STATE.player);
            }

            // --- AP SUMMARY: Universal untuk semua role ---
            function openAPSummary() {
                const p = STATE.player;
                const totalAP = p.achievementPoints || 0;
                const roleLabel = { student: '🎓 Pelajar', worker: '👷 Pekerja', entrepreneur: '💼 Pengusaha', family: '🏠 Keluarga' }[p.role] || '👤 ' + (p.role || 'Pemain');

                // Hitung sumber AP berdasarkan role
                let detail = '';
                if (p.role === 'student') {
                    const karya = (p.portfolioItems || []).length;
                    const jurnal = (p.reflections || []).length;
                    detail = `📚 Karya Portofolio: ${karya}\n📝 Jurnal Refleksi: ${jurnal}`;
                } else if (p.role === 'worker') {
                    detail = `💼 Level Kerja: ${p.jobLevel || 1}\n⭐ Total AP dari pekerjaan & kompetisi`;
                } else if (p.role === 'entrepreneur') {
                    detail = `🏪 Bisnis Aktif: ${p.businessOwned ? 'Ya' : 'Belum ada'}\n⭐ AP dari omzet & event viral`;
                } else {
                    detail = `⭐ AP dari berbagai aktivitas game`;
                }

                // Hitung "tier" prestasi
                let tier = '🥉 Pemula';
                if (totalAP >= 500) tier = '🥇 Master';
                else if (totalAP >= 200) tier = '🥈 Mahir';
                else if (totalAP >= 50) tier = '🏅 Berkembang';

                const actions = [];
                if (p.role === 'student') {
                    actions.push({ text: '📁 Lihat Portofolio', action: () => { closeDialogue(); openPortfolioModal(); } });
                }
                actions.push({ text: 'Tutup', action: closeDialogue });

                showDialogue(`🏅 POIN PRESTASI (AP)`,
                    `Role: ${roleLabel}\n🏅 Total AP: ${totalAP}\n🏆 Peringkat: ${tier}\n\n${detail}\n\n💡 AP digunakan untuk membeli Pet dan naik peringkat leaderboard!`,
                    actions,
                    'images/buku.png'
                );
            }

            function openPortfolioModal() {
                const p = STATE.player;
                const items = p.portfolioItems || [];
                const totalAP = p.achievementPoints || 0;

                if (items.length === 0) {
                    showDialogue("📁 PORTOFOLIO KOSONG",
                        `Kamu belum memiliki karya media pembelajaran.\n\nPergi ke Bangku Kampus → "Buat Media Pembelajaran" untuk mulai berkarya!\n\n🏅 Total Poin Prestasi: ${totalAP} AP`,
                        [{ text: "Tutup", action: closeDialogue }], 'images/buku.png');
                    return;
                }

                // Tampilkan ringkasan dulu lewat dialogue, detail lewat modal HTML
                const formatCount = {};
                items.forEach(i => { formatCount[i.formatLabel] = (formatCount[i.formatLabel] || 0) + 1; });
                const topFormat = Object.entries(formatCount).sort((a,b) => b[1]-a[1])[0]?.[0] || '-';

                showDialogue("📁 PORTOFOLIOMU",
                    `📚 Total Karya: ${items.length}\n🏅 Poin Prestasi (AP): ${totalAP}\n🎨 Format Terfavorit: ${topFormat}\n\n${items.slice(-3).reverse().map(i =>
                        `${i.topicEmoji} ${i.topicLabel} (${i.formatEmoji} ${i.formatLabel}) — Day ${i.day}\n   🏅 +${i.apEarned} AP${i.teacherNote ? `\n   💬 Guru: "${i.teacherNote}"` : ''}`
                    ).join('\n\n')}\n\n(Menampilkan 3 karya terbaru)`,
                    [
                        { text: "🎨 Buat Karya Baru", action: () => { closeDialogue(); openMediaLearningQuest(); } },
                        { text: "Tutup", action: closeDialogue }
                    ],
                    'images/buku.png'
                );
            }

            function openJournalModal(fromSleep = false) {
                isSleepPending = fromSleep;
                const modal = document.getElementById('journal-modal');

                // UPDATE: Pertanyaan berdasarkan role & hari (bukan acak)
                const roleQ = getJournalQuestion();
                const qElement = document.getElementById('journal-question');
                if (qElement) qElement.innerHTML = roleQ;

                // UPDATE: Judul jurnal sesuai role
                const roleTitles = {
                    none: '📔 JURNAL REFLEKSI',
                    worker: '⚔️ JURNAL PEKERJA',
                    student: '🎓 JURNAL AKADEMISI',
                    entrepreneur: '💼 JURNAL WIRAUSAHA',
                    family: '🏠 JURNAL KELUARGA',
                };
                const role = (STATE.player && STATE.player.role) ? STATE.player.role : 'none';
                const titleEl = modal.querySelector('h3');
                if (titleEl) titleEl.innerText = roleTitles[role] || '📔 JURNAL REFLEKSI';

                // UPDATE: Tampilkan/update hint role
                let hintEl = document.getElementById('journal-role-hint');
                if (!hintEl) {
                    hintEl = document.createElement('div');
                    hintEl.id = 'journal-role-hint';
                    hintEl.style.cssText = 'background:rgba(101,163,13,0.12); border-left:3px solid #65a30d; border-radius:6px; padding:8px 10px; margin-bottom:12px; font-size:11.5px; color:#365314; line-height:1.5;';
                    const textarea = document.getElementById('journal-input');
                    if (textarea) textarea.parentNode.insertBefore(hintEl, textarea);
                }
                hintEl.innerHTML = getJournalHint();

                // UPDATE: Info hari
                let dayEl = document.getElementById('journal-day-info');
                if (!dayEl) {
                    dayEl = document.createElement('div');
                    dayEl.id = 'journal-day-info';
                    dayEl.style.cssText = 'font-size:10px; color:#94a3b8; text-align:right; margin-bottom:4px;';
                    const qParent = qElement ? qElement.parentNode : modal.querySelector('.journal-box');
                    if (qParent && qElement) qParent.insertBefore(dayEl, qElement);
                }
                dayEl.innerText = `Hari ke-${STATE.day || 1} · Jalur: ${role === 'none' ? 'Belum Dipilih' : role.charAt(0).toUpperCase() + role.slice(1)}`;

                // Reset textarea
                document.getElementById('journal-input').value = "";
                modal.style.display = 'flex';
                STATE.screen = 'modal';
            }

            function closeJournal() {
                const modal = document.getElementById('journal-modal');
                modal.style.display = 'none';
                STATE.screen = 'play';
                isSleepPending = false; // Reset flag jika batal

                // FIX: Kembalikan ke Fullscreen setelah menutup jurnal (karena keyboard menutup fullscreen)
                toggleFullScreen();
            }
            // --- NEW FUNCTION: MESSAGE ARCHIVE LOGIC ---
            function openMessageArchive() {
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const modal = document.getElementById('message-archive-modal');
                const list = document.getElementById('message-list');
                const msgs = STATE.player.messages || [];

                list.innerHTML = '';

                if (msgs.length === 0) {
                    list.innerHTML = '<div style="text-align:center; color:#94a3b8; padding:20px;">Belum ada pesan yang tersimpan.</div>';
                } else {
                    // Tampilkan dari yang terbaru ke terlama
                    [...msgs].reverse().forEach(m => {
                        // Format Waktu
                        let dateStr = "Waktu Tidak Diketahui";
                        if (m.time) {
                            const date = new Date(m.time);
                            dateStr = `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                        }

                        const div = document.createElement('div');
                        // FIX: Style Pesan di Arsip (Background Putih)
                        div.style.cssText = "background:#fff; padding:12px; margin-bottom:10px; border-left:4px solid var(--secondary); border-radius:6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);";
                        div.innerHTML = `
                <div style="font-size:10px; color:#64748b; display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #f1f5f9; padding-bottom:4px;">
                    <span style="font-weight:bold; color:var(--primary);">DARI: GURU</span>
                    <span>🕒 ${dateStr}</span>
                </div>
                <div style="font-size:13px; color:#334155; line-height:1.5; font-family:'Exo 2'; white-space: pre-wrap; font-weight:500;">${m.text}</div>
            `;
                        list.appendChild(div);
                    });
                }

                modal.style.display = 'flex';
                STATE.screen = 'modal';
            }

            function closeMessageArchive() {
                document.getElementById('message-archive-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            // Helper: hitung reward jurnal berdasarkan panjang teks & role
            function calcJournalReward(text) {
                const len = text.length;
                const role = STATE.player ? STATE.player.role : 'none';

                // Base reward makin besar sesuai panjang tulisan
                let gold, exp, ap, bonusItem = null, bonusQty = 0;

                if (len >= 200) {
                    gold = 1500; exp = 100; ap = 10;
                } else if (len >= 100) {
                    gold = 1000; exp = 75; ap = 7;
                } else if (len >= 50) {
                    gold = 700; exp = 60; ap = 5;
                } else if (len >= 20) {
                    gold = 500; exp = 50; ap = 3;
                } else {
                    return null; // belum cukup
                }
                // Semua role mendapat AP dari refleksi; student tetap sama, non-student +50% bonus
                if (role !== 'student') ap = Math.ceil(ap * 1.5);

                // Bonus item per role
                const roleBonus = {
                    worker:       { item: 'kopi',          qty: 1, label: '☕ Kopi' },
                    student:      { item: 'buku_catatan',  qty: 1, label: '📒 Buku Catatan' },
                    entrepreneur: { item: 'koin_emas',     qty: 1, label: '🪙 Koin Emas' },
                    family:       { item: 'bunga',         qty: 2, label: '💐 Bunga x2' },
                    none:         { item: 'coklat',        qty: 1, label: '🍫 Coklat' },
                };
                const rb = roleBonus[role] || roleBonus['none'];
                bonusItem = rb.item; bonusQty = rb.qty;

                // Bonus extra kalau tulisan panjang
                const streak = STATE.player.reflections ? STATE.player.reflections.length : 0;
                const streakBonus = streak > 0 && streak % 5 === 0; // tiap 5 jurnal

                return { gold, exp, ap, bonusItem, bonusQty, bonusLabel: rb.label, streakBonus, streak: streak + 1 };
            }

            // Update reward preview saat user ngetik
            function updateJournalRewardPreview() {
                const input = document.getElementById('journal-input');
                const previewEl = document.getElementById('journal-reward-text');
                const charEl = document.getElementById('journal-char-count');
                const submitBtn = document.getElementById('journal-submit-btn');
                if (!input || !previewEl) return;

                const text = input.value.trim();
                const len = text.length;
                if (charEl) charEl.textContent = len + ' karakter';

                const reward = calcJournalReward(text);
                if (!reward) {
                    previewEl.textContent = 'Tulis minimal 20 karakter untuk dapat reward~';
                    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.5'; }
                    return;
                }

                const streakTxt = reward.streakBonus ? ` 🔥 Jurnal ke-${reward.streak} → Bonus AP +5!` : '';
                previewEl.innerHTML = `+${reward.gold}G &nbsp;+${reward.exp} EXP &nbsp;+${reward.ap} AP &nbsp;${reward.bonusLabel}${streakTxt}`;
                if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
            }

            function saveJournal() {
                const input = document.getElementById('journal-input');
                const text = input.value.trim();

                const reward = calcJournalReward(text);
                if (!reward) {
                    showToast("Tulis minimal 20 karakter dulu ya!");
                    return;
                }

                // 1. Simpan entri jurnal
                const entry = {
                    day: STATE.day,
                    date: Date.now(),
                    text: text,
                    role: (STATE.player && STATE.player.role) ? STATE.player.role : 'none',
                    question: getJournalQuestion(),
                };
                if (!STATE.player.reflections) STATE.player.reflections = [];
                STATE.player.reflections.push(entry);

                // 2. Beri reward
                STATE.player.money += reward.gold;
                gainExp(reward.exp);
                STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + reward.ap;
                if (reward.bonusItem) addItem(reward.bonusItem, reward.bonusQty);
                if (reward.streakBonus) STATE.player.achievementPoints += 5;

                // 3. Autosave (sudah jalan background tiap 2 detik, tapi paksa sekali lagi untuk jurnal)
                manualSave();

                // 4. Feedback
                if (typeof AudioService !== 'undefined') AudioService.playSFX('levelup');
                createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                createParticle(STATE.player.x + 20, STATE.player.y - 10, '#86efac');

                // 5. Tutup Modal
                const modal = document.getElementById('journal-modal');
                modal.style.display = 'none';
                STATE.screen = 'play';

                // 6. Cek tidur pending
                const streakMsg = reward.streakBonus ? `\n🔥 Jurnal ke-${reward.streak}! Bonus +5 AP!` : '';
                if (isSleepPending) {
                    isSleepPending = false;
                    setTimeout(() => {
                        showDialogue("✅ JURNAL TERKIRIM!", `Guru sudah menerima refleksimu~\n\n🎁 Reward Hari Ini:\n• +${reward.gold} Gold\n• +${reward.exp} EXP\n• +${reward.ap} AP\n• ${reward.bonusLabel}${streakMsg}\n\nLanjut tidur?`, [
                            {
                                text: "Tidur Sekarang 🛌",
                                action: () => { toggleFullScreen(); handleSleep(); }
                            },
                            {
                                text: "Nanti Dulu",
                                action: () => { closeDialogue(); toggleFullScreen(); }
                            }
                        ], 'images/buku.png');
                    }, 300);
                } else {
                    toggleFullScreen();
                    setTimeout(() => {
                        showDialogue("✅ JURNAL TERKIRIM!", `Refleksimu sudah dicatat dan dikirim ke gurumu~\n\n🎁 Reward:\n• +${reward.gold} Gold\n• +${reward.exp} EXP\n• +${reward.ap} AP\n• ${reward.bonusLabel}${streakMsg}`, [
                            { text: "Yay! Terus semangat! 💪", action: closeDialogue }
                        ], 'images/buku.png');
                    }, 300);
                }
            }

            function startFishingMinigame() {
                if (STATE.player.energy < 10) {
                    showToast("Energi tidak cukup!");
                    return;
                }
                STATE.player.energy -= 10;
                STATE.fishing.active = true;
                STATE.fishing.barX = 0;
                STATE.fishing.targetStart = 30 + Math.random() * 40;
                STATE.fishing.targetWidth = 15;
                STATE.screen = 'play';
                showToast("Tekan AKSI (Space/Tombol) saat di Hijau!");
            }

            // --- SEASONAL FISH TABLE ---
            const SEASONAL_FISH = {
                spring: [
                    { id: 'ikan_kecil',     name: '🐟 Ikan Mas Koki',    img: 'images/ikankecil.png',     rarity: 'COMMON',    color: '#cbd5e1', exp: 10,  chance: 50 },
                    { id: 'ikan_sedang',    name: '🐠 Ikan Nila Semi',    img: 'images/ikansedang.png',    rarity: 'UNCOMMON',  color: '#38bdf8', exp: 25,  chance: 32 },
                    { id: 'ikan_besar',     name: '🐡 Ikan Gurame',       img: 'images/ikanbesar.png',     rarity: 'RARE',      color: '#f472b6', exp: 50,  chance: 15 },
                    { id: 'ikan_legendary', name: '✨ Ikan Koi Sakura',   img: 'images/ikanlegendary.png', rarity: 'LEGENDARY', color: '#fbbf24', exp: 200, chance: 3  }
                ],
                summer: [
                    { id: 'ikan_kecil',     name: '🐟 Ikan Bawal',       img: 'images/ikankecil.png',     rarity: 'COMMON',    color: '#cbd5e1', exp: 10,  chance: 50 },
                    { id: 'ikan_sedang',    name: '🐠 Ikan Mujair',       img: 'images/ikansedang.png',    rarity: 'UNCOMMON',  color: '#fbbf24', exp: 25,  chance: 32 },
                    { id: 'ikan_besar',     name: '🐡 Ikan Tuna Muda',    img: 'images/ikanbesar.png',     rarity: 'RARE',      color: '#f97316', exp: 50,  chance: 15 },
                    { id: 'ikan_legendary', name: '✨ Hiu Pelangi',       img: 'images/ikanlegendary.png', rarity: 'LEGENDARY', color: '#fbbf24', exp: 200, chance: 3  }
                ],
                autumn: [
                    { id: 'ikan_kecil',     name: '🐟 Ikan Lele Gugur',  img: 'images/ikankecil.png',     rarity: 'COMMON',    color: '#cbd5e1', exp: 10,  chance: 48 },
                    { id: 'ikan_sedang',    name: '🐠 Ikan Patin',        img: 'images/ikansedang.png',    rarity: 'UNCOMMON',  color: '#f59e0b', exp: 30,  chance: 32 },
                    { id: 'ikan_besar',     name: '🦑 Cumi-cumi Musim',   img: 'images/ikanbesar.png',     rarity: 'RARE',      color: '#a855f7', exp: 60,  chance: 17 },
                    { id: 'ikan_legendary', name: '✨ Belut Emas',        img: 'images/ikanlegendary.png', rarity: 'LEGENDARY', color: '#fbbf24', exp: 200, chance: 3  }
                ],
                winter: [
                    { id: 'ikan_kecil',     name: '🐟 Ikan Salju',       img: 'images/ikankecil.png',     rarity: 'COMMON',    color: '#bfdbfe', exp: 12,  chance: 45 },
                    { id: 'ikan_sedang',    name: '🐠 Ikan Salmon',       img: 'images/ikansedang.png',    rarity: 'UNCOMMON',  color: '#38bdf8', exp: 35,  chance: 32 },
                    { id: 'ikan_besar',     name: '🐋 Ikan Paus Kecil',   img: 'images/ikanbesar.png',     rarity: 'RARE',      color: '#6366f1', exp: 70,  chance: 20 },
                    { id: 'ikan_legendary', name: '✨ Ikan Kristal Es',   img: 'images/ikanlegendary.png', rarity: 'LEGENDARY', color: '#fbbf24', exp: 200, chance: 3  }
                ]
            };

            function checkFishing() {
                if (!STATE.fishing.active) return;
                STATE.fishing.active = false;
                hideFishingOverlay();

                if (STATE.fishing.barX >= STATE.fishing.targetStart && STATE.fishing.barX <= (STATE.fishing.targetStart + STATE.fishing.targetWidth)) {
                    STATE.player.dailyFishingCount = (STATE.player.dailyFishingCount || 0) + 1;
                    STATE.player.totalFishingCount = (STATE.player.totalFishingCount || 0) + 1; // TOTAL LIFETIME

                    // Pilih pool ikan berdasarkan musim
                    const season = STATE.season || 'spring';
                    const pool = SEASONAL_FISH[season] || SEASONAL_FISH.spring;

                    // Roll berdasarkan chance (kumulatif)
                    const rand = Math.random() * 100;
                    let cumulative = 0;
                    let caught = pool[pool.length - 1]; // default: yang terakhir (common)
                    // Cek dari langka ke umum agar tertimpa dengan benar
                    for (let i = 0; i < pool.length; i++) {
                        cumulative += pool[i].chance;
                        if (rand < cumulative) { caught = pool[i]; break; }
                    }

                    if (!STATE.player.inventory[caught.id]) STATE.player.inventory[caught.id] = 0;
                    STATE.player.inventory[caught.id]++;
                    gainExp(caught.exp);

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(STATE.player.x, STATE.player.y, caught.color);

                    const seasonLabel = { spring: '🌸 SEMI', summer: '☀️ PANAS', autumn: '🍂 GUGUR', winter: '❄️ DINGIN' }[season];
                    showDialogue(
                        `TANGKAPAN BERHASIL! ${caught.rarity === 'LEGENDARY' ? '⭐' : ''}`,
                        `Kamu mendapatkan:\n${caught.name}\n[${caught.rarity}] — Musim ${seasonLabel}\n\n+${caught.exp} EXP`,
                        [{ text: "Simpan 🎣", action: closeDialogue }],
                        caught.img
                    );
                } else {
                    showToast("GAGAL... Ikan lepas 🎣");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                }
            }

            // --- NEW FUNCTION: GAIN EXP ---
            function gainExp(amount) {
                STATE.player.exp += amount;
                showToast(`+${amount} EXP`);

                if (STATE.player.exp >= STATE.player.maxExp) {
                    STATE.player.exp = STATE.player.exp - STATE.player.maxExp; // Sisa EXP dibawa ke level berikutnya
                    STATE.player.maxExp = Math.floor(STATE.player.maxExp * 1.5);
                    STATE.player.level++;

                    // 1. Recover HP/Energy (Full Heal saat Level Up)
                    STATE.player.energy = 100;
                    STATE.player.hp = STATE.player.maxHp;

                    // 2. Base Stat Increase (Semua naik sedikit)
                    STATE.player.str += 1;
                    STATE.player.int += 1;
                    STATE.player.biz += 1;
                    STATE.player.reputation += 1;
                    STATE.player.maxHp += 5; // Tambah darah sedikit

                    // 3. Bonus Role Stat (Spesialisasi naik banyak)
                    let bonusText = "";
                    if (STATE.player.role === 'worker') { STATE.player.str += 2; bonusText = "STR++"; }
                    else if (STATE.player.role === 'student') { STATE.player.int += 2; bonusText = "INT++"; }
                    else if (STATE.player.role === 'entrepreneur') { STATE.player.biz += 2; bonusText = "BIZ++"; }
                    else if (STATE.player.role === 'family') { STATE.player.reputation += 2; bonusText = "REP++"; }

                    showToast(`LEVEL UP! LV ${STATE.player.level} (All Stats+1, ${bonusText}) 🆙`);
                    createParticle(STATE.player.x, STATE.player.y, '#6366f1');

                    // 🎬 MILESTONE CUTSCENE (level 5, 10, 15, 20, 30, 50)
                    const _milestones = [5, 10, 15, 20, 30, 50];
                    // Level 5 & 15: milestone kecil tanpa cutscene penuh
                    if (STATE.player.level === 5) {
                        setTimeout(() => {
                            showDialogue('⭐ PENCAPAIAN PERTAMA!',
                                `Level 5 tercapai! Kamu sudah mulai menemukan ritme hidupmu di desa ini.\n\n✨ Semua stat naik!\n💪 HP Max bertambah\n\n📚 "Perjalanan seribu langkah dimulai dari satu langkah kecil." — Lao Tzu`,
                                [{ text: 'Lanjutkan! 🚀', action: closeDialogue }], null);
                        }, 600);
                    } else if (STATE.player.level === 15) {
                        setTimeout(() => {
                            showDialogue('🌟 SEPARUH JALAN!',
                                `Level 15! Warga desa sudah mulai mengenalmu dengan baik.\n\n🎯 Fokus pada jalur ${(STATE.player.role||'pilihanmu').toUpperCase()} untuk bonus maksimal.\n\n📚 "Konsistensi adalah kunci — bukan kecepatan."`,
                                [{ text: 'Siap! 💪', action: closeDialogue }], null);
                        }, 600);
                    } else if (_milestones.includes(STATE.player.level)) {
                        const _mlvl = STATE.player.level;
                        setTimeout(() => {
                            playCutsceneLevelUp(_mlvl, () => {
                                showToast(`🌟 MILESTONE LEVEL ${_mlvl} DIRAIH!`);
                                // Level 10: buka kostum spesial
                                if (_mlvl === 10) {
                                    setTimeout(() => {
                                        showDialogue("HADIAH LEVEL 10! ✨",
                                            "Selamat! Kamu telah mencapai Level 10.\n\nSebagai penghargaan, **KOSTUM SPESIAL** kini telah terbuka di Lemari Pakaianmu!\n\n(Cek Lemari di Rumah untuk memakainya)",
                                            [{ text: "Keren! Terima Kasih!", action: closeDialogue }],
                                            'images/lemari.png'
                                        );
                                    }, 500);
                                }
                            });
                        }, 600);
                    } else if (typeof AudioService !== 'undefined') {
                        AudioService.playSFX('item');
                    }

                    // Update HUD langsung
                    updateHUDInfo();

                    // Auto Save saat level up untuk mengamankan progress
                    manualSave();
                }
            }

            // --- NEW FUNCTION: MANUAL SAVE ---
            async function manualSave() {
                await DataService.saveGame({
                    // 1. Waktu & Lingkungan
                    day: STATE.day,
                    time: STATE.time, // Penting agar tidak reset ke pagi
                    season: STATE.season,
                    weather: STATE.weather,

                    // 2. Status Fisik & Level
                    hp: STATE.player.hp,
                    maxHp: STATE.player.maxHp,
                    energy: STATE.player.energy,
                    money: STATE.player.money,
                    level: STATE.player.level,
                    exp: STATE.player.exp,
                    maxExp: STATE.player.maxExp,
                    gender: STATE.player.gender,

                    // --- TAMBAHAN BARU: SIMPAN DATA OUTFIT ---
                    outfit: STATE.player.outfit,
                    // -----------------------------------------

                    // 3. Role & Career
                    role: STATE.player.role,
                    major: STATE.player.major,
                    scholarship: STATE.player.scholarship,
                    jobStatus: STATE.player.jobStatus,
                    bossReputation: STATE.player.bossReputation,
                    // NEW: SAVE JOB LEVEL
                    jobLevel: STATE.player.jobLevel,

                    shiftStarted: STATE.player.shiftStarted, // Simpan status sedang kerja
                    salaryDays: STATE.player.salaryDays,
                    lastAttendanceDay: STATE.player.lastAttendanceDay,

                    // SAVE JOB DISCOVERY
                    knownJobs: STATE.player.knownJobs || [],
                    jobSearchCount: STATE.player.jobSearchCount || 0,
                    lastJobSearchDay: STATE.player.lastJobSearchDay || 0,

                    // SAVE PART-TIME
                    partTimeJob: STATE.player.partTimeJob,
                    partTimeStatus: STATE.player.partTimeStatus,
                    partTimeShiftStarted: STATE.player.partTimeShiftStarted,
                    partTimeLastWorkedDay: STATE.player.partTimeLastWorkedDay,
                    partTimeSalaryDays: STATE.player.partTimeSalaryDays,
                    todayConflict: STATE.player.todayConflict,
                    shownStudentConflicts: STATE.player.shownStudentConflicts || [],
                    shownEntrepreneurConflicts: STATE.player.shownEntrepreneurConflicts || [],
                    lastRepThreshDay: STATE.player.lastRepThreshDay,

                    // 4. Stats Attribute
                    str: STATE.player.str,
                    int: STATE.player.int,
                    biz: STATE.player.biz,
                    reputation: STATE.player.reputation,
                    ethics: STATE.player.ethics,

                    // 5. Inventory & Aset
                    inventory: STATE.player.inventory, // PENTING: Tas
                    houseLevel: STATE.player.houseLevel,
                    furniture: STATE.player.furniture,
                    // NEW: SIMPAN STATUS KURCACI
                    hiredDwarf: STATE.player.hiredDwarf,
                    hiredFairy: STATE.player.hiredFairy, // <--- TAMBAHKAN INI

                    // 6. Hubungan Sosial
                    relationships: STATE.player.relationships,
                    married: STATE.player.married,
                    spouseId: STATE.player.spouseId,
                    modinVisited: STATE.player.modinVisited || false,
                    divorced: STATE.player.divorced || false,
                    homeRole: STATE.player.homeRole || 'homemaker',
                    // Marriage conflict system save
                    marriedDay: STATE.player.marriedDay || 0,
                    marriageMonth: STATE.player.marriageMonth || 1,
                    marriageConflictLevel: STATE.player.marriageConflictLevel || 0,
                    lastConflictDay: STATE.player.lastConflictDay || 0,
                    monthlyExpenses: STATE.player.monthlyExpenses || 0,
                    lastMarriageBillDay: STATE.player.lastMarriageBillDay || 0,

                    // 7. Quest & Progress Dungeon
                    activeQuest: STATE.player.activeQuest,
                    questProgress: STATE.questProgress,
                    dungeonLevel: STATE.dungeonLevel,

                    // 8. Game State Flags
                    gameFinished: STATE.gameFinished,
                    freeRoamMode: STATE.freeRoamMode,
                    isPrologue: STATE.isPrologue,

                    // 9. Claims & Trackers Reward
                    lastDailyClaim: STATE.player.lastDailyClaim,
                    lastWeeklyClaim: STATE.player.lastWeeklyClaim,
                    lastMonthlyClaim: STATE.player.lastMonthlyClaim,
                    claimedLifeTrial: STATE.player.claimedLifeTrial,
                    lastHarvestGiftYear: STATE.player.lastHarvestGiftYear, // NEW: Simpan Status Hadiah Kurcaci
                    lastGrapeGiftYear: STATE.player.lastGrapeGiftYear, // NEW: Simpan Status Hadiah Peri Panen
                    lastResolutionYear: STATE.player.lastResolutionYear || 0, // NEW: Resolusi Tahun Baru
                    hasSeenDungeonTutorial: STATE.player.hasSeenDungeonTutorial,
                    hasSeenFishingTutorial: STATE.player.hasSeenFishingTutorial, // NEW: Save Fishing Tutorial

                    // NEW: SIMPAN PROGRESS HARIAN
                    dailyFishingCount: STATE.player.dailyFishingCount || 0,
                    dailyMonsterKills: STATE.player.dailyMonsterKills || 0,
                    dailyTalkCount: STATE.player.dailyTalkCount || 0,
                    dailyHarvestCount: STATE.player.dailyHarvestCount || 0,
                    // TOTAL LIFETIME COUNTERS
                    totalFishingCount: STATE.player.totalFishingCount || 0,
                    totalMonsterKills: STATE.player.totalMonsterKills || 0,
                    totalSellCount:    STATE.player.totalSellCount    || 0,
                    // NPC RELATIONSHIP TRACKING
                    npcLastTalkDay: STATE.player.npcLastTalkDay || {},
                    // MILESTONE YEAR CLAIMS
                    claimedYear1: STATE.player.claimedYear1 || false,
                    claimedYear2: STATE.player.claimedYear2 || false,
                    claimedYear3: STATE.player.claimedYear3 || false,
                    claimedYear4: STATE.player.claimedYear4 || false,
                    claimedYear5: STATE.player.claimedYear5 || false,
                    honorTitle:   STATE.player.honorTitle   || null,

                    // 10. Pesan & Jurnal & MATERI KULIAH
                    reflections: STATE.player.reflections,
                    messages: STATE.player.messages,
                    learnedSubjects: STATE.player.learnedSubjects || [], // FIX: Simpan Array Mata Pelajaran
                    achievementPoints: STATE.player.achievementPoints || 0,
                    portfolioItems: STATE.player.portfolioItems || [],

                    // 11. SIMPAN STATE VIRAL
                    viral: STATE.viral,

                    // 12. SIMPAN DATA PET
                    pets: STATE.player.pets || [],
                    activePet: STATE.player.activePet || null
                });
            }

            // --- FIX: FUNGSI MEMANCING YANG DIPERBAIKI (TIDAK DUPLIKAT) ---
            function startFishingMinigame() {
                // --- TUTORIAL MEMANCING (FIRST TIME ONLY) ---
                if (!STATE.player.hasSeenFishingTutorial) {
                    showDialogue("🎣 MEMANCING",
                        "Bar indikator bergerak kanan-kiri.\nTekan TARIK saat garis putih ada di zona HIJAU!\n\nBerhasil = dapat ikan. Meleset = coba lagi.\nSetiap cast butuh 10 Energi.",
                        [{
                            text: "Paham! Mulai Mancing 🎣",
                            action: () => {
                                STATE.player.hasSeenFishingTutorial = true;
                                manualSave();
                                closeDialogue();
                                setTimeout(startFishingMinigame, 500);
                            }
                        }],
                        'images/nelayan.png'
                    );
                    return;
                }

                if (STATE.player.energy < 10) {
                    showToast("Energi tidak cukup!");
                    return;
                }

                // Kurangi Energi & Mulai Minigame
                STATE.player.energy -= 10;
                STATE.fishing.active = true;
                STATE.fishing.barX = 0;
                STATE.fishing.barDir = 1; // FIX: Reset Arah Gerak agar tidak macet
                STATE.fishing.targetStart = 30 + Math.random() * 40;
                STATE.fishing.targetWidth = 15;

                STATE.screen = 'play';
                showToast("Tekan AKSI (Space/Tombol) saat di Hijau!");

                // 🎣 TAMPILKAN FISHING OVERLAY KEREN
                showFishingOverlay();
            }

            // --- FIX: FUNGSI CEK HASIL PANCINGAN (DIPASTIKAN ADA) ---
            // --- NEW FUNCTION: HANDLE FAINT (PINGSAN) ---
            function handleFaint() {
                // FIX: Tambahkan cek flag isDayChanging
                if (STATE.screen === 'cutscene' || STATE.isDayChanging) return;

                // FIX CRITICAL: Panggil closeDialogue DULUAN sebelum set cutscene
                // Karena closeDialogue() mereset screen jadi 'play'
                closeDialogue();

                STATE.screen = 'cutscene';
                STATE.isDayChanging = true; // Kunci proses ganti hari

                showToast("😵 Kamu Pingsan karena kelelahan...");
                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // Overlay Hitam
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0'; overlay.style.left = '0';
                overlay.style.width = '100%'; overlay.style.height = '100%';
                overlay.style.background = 'black';
                overlay.style.zIndex = '9999';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 1s';
                overlay.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:#ef4444; font-family:Cinzel; font-size:24px; flex-direction:column;">
        <h1>PINGSAN</h1>
        <p style="font-size:12px; color:#cbd5e1;">Dibawa ke Klinik oleh Warga...</p>
    </div>`;
                document.body.appendChild(overlay);

                // Fade In
                setTimeout(() => {
                    overlay.style.opacity = '1';
                }, 100);

                setTimeout(() => {
                    // Logic Reset
                    STATE.day = parseInt(STATE.day) + 1;
                    STATE.time = 800; // Bangun jam 8 pagi (telat karena sakit)
                    STATE.player.energy = 50; // Bangun tidak full energy
                    STATE.player.hp = STATE.player.maxHp;

                    // Penalty
                    const penalty = 500;
                    const moneyBefore = STATE.player.money;
                    STATE.player.money = Math.max(0, STATE.player.money - penalty);

                    // 🎬 BANGKRUT: cek apakah money jatuh ke 0
                    if (moneyBefore > 0 && STATE.player.money === 0 && !STATE.player._bangkrutCutscenePlayed) {
                        STATE.player._bangkrutCutscenePlayed = true;
                        setTimeout(() => playCutsceneBangkrut(() => {
                            showToast("💸 BANGKRUT! Cari cara untuk mendapatkan Gold segera!");
                            STATE.player._bangkrutCutscenePlayed = false; // Reset untuk bisa trigger lagi nanti
                        }), 2500);
                    }

                    // Respawn at Clinic (UPDATE: DI DALAM KLINIK - SAMPING KASUR)
                    // Posisi Baru: clinic_interior -> Tile (10, 8) (Samping Bed Kanan, Area Kosong)
                    STATE.location = 'clinic_interior';
                    STATE.player.x = 10 * TILE_SIZE;
                    STATE.player.y = 8 * TILE_SIZE;
                    STATE.player.direction = 'left'; // Menghadap ruangan

                    // Pastikan area spawn bersih (walaupun (10,8) diset kosong)
                    clearSpawnZone('clinic_interior', 10, 8);

                    randomizeWeather();
                    manualSave();

                    // Fade Out & Wake Up
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(overlay)) document.body.removeChild(overlay);

                        showToast("Bangun di Klinik. Biaya: 500G");

                        // Update Date/Time UI immediately
                        const currentDayName = DAYS_OF_WEEK[(STATE.day - 1) % 7];
                        const totalDays = STATE.day - 1;
                        const year = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;
                        document.getElementById('full-date-display').innerText = `${currentDayName}, D${(totalDays % DAYS_PER_SEASON) + 1} ${STATE.season.toUpperCase()} Y${year}`;
                        document.getElementById('clock-display').innerText = "08:00";

                        // Tambahkan Dialog Dokter agar lebih imersif
                        setTimeout(() => {
                            showDialogue("DR. BUDI", "Wah, kamu sudah sadar? Kemarin kamu pingsan di jalan karena kelelahan.\n\nUntung ada warga yang membawamu ke Klinik. Saya sudah mengobati lukamu dan memberikan vitamin.\n\nLain kali, perhatikan batas energimu ya. Kesehatan itu mahal harganya.", [{ text: "Terima kasih Dok", action: closeDialogue }], 'images/lover1boy.png');
                        }, 500);

                        updateHUDInfo();
                        STATE.screen = 'play';
                        STATE.isDayChanging = false; // Buka kunci
                    }, 1000);
                }, 2000);
            }

            // --- NEW FUNCTION: SLEEP LOGIC ---
            function handleSleep() {
                // FIX: Tambahkan cek flag isDayChanging
                if (STATE.screen === 'cutscene' || STATE.isDayChanging) return;

                // 💡 CEK KONSEKUENSI NYATA DULU — wajib refleksi jika ada kondisi kritis
                checkKonsekuensiTriggers(() => {
                    _doSleep();
                });
            }

            function _doSleep() {
                if (STATE.screen === 'cutscene' || STATE.isDayChanging) return;

                // --- NEW: CAPTURE WAKTU TIDUR UNTUK LOGIKA PULANG TELAT ---
                const lastSleepTime = STATE.time;

                closeDialogue();
                STATE.screen = 'cutscene'; // FIX: Stop update loop saat tidur
                STATE.isDayChanging = true; // Kunci proses

                // FIX: Bekukan waktu agar tidak bertambah selama proses ganti hari
                // Safety timeout: jika 10 detik lebih tidak selesai, paksa reset
                const _sleepSafetyTimer = setTimeout(() => {
                    if (STATE.isDayChanging) {
                        STATE.isDayChanging = false;
                        STATE.screen = 'play';
                        console.warn('[Sleep] Safety reset triggered — isDayChanging stuck');
                    }
                }, 10000);

                let oversleep = false;
                // MECHANIC: OVERSLEEP IF ENERGY LOW
                if (STATE.player.energy < 20) {
                    oversleep = true;
                }

                showToast("Zzz... Tidur...");

                // Overlay Hitam Sementara
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0'; overlay.style.left = '0';
                overlay.style.width = '100%'; overlay.style.height = '100%';
                overlay.style.background = 'black';
                overlay.style.zIndex = '9999';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 1s';

                // Hitung hari besok untuk tampilan layar hitam
                const nextDayName = DAYS_OF_WEEK[STATE.day % 7]; // STATE.day sudah +1 nanti, jadi %7 saja (karena array 0-6)

                overlay.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:white; font-family:Cinzel; font-size:24px;">Day ${parseInt(STATE.day) + 1} (${nextDayName})</div>`;
                document.body.appendChild(overlay);

                // Animasi Fade Out
                setTimeout(() => {
                    overlay.style.opacity = '1';

                    // LOGIKA GANTI HARI DI BALIK LAYAR
                    setTimeout(() => {
                        // FIX: Pastikan penambahan hari aman (Integer)
                        STATE.day = parseInt(STATE.day) + 1;

                        if (oversleep) {
                            STATE.time = 1000; // Bangun jam 10:00 (Telat)
                        } else {
                            STATE.time = 600; // Bangun jam 06:00
                        }

                        STATE.player.energy = 100; // Pulihkan Energi
                        STATE.player.hp = STATE.player.maxHp; // Pulihkan HP

                        // FIX: RESET COUNTER HARIAN SAAT TIDUR (agar quest hari baru dimulai fresh)
                        STATE.player.dailyFishingCount  = 0;
                        STATE.player.dailyMonsterKills  = 0;
                        STATE.player.dailyTalkCount     = 0;
                        STATE.player.dailyHarvestCount  = 0;
                        STATE.player.dailySellCount     = 0;
                        STATE.player.dailySelfStudy     = 0;
                        // lastDailyClaim tidak perlu di-reset karena otomatis beda (STATE.day bertambah)

                        // === FAKE LOVER DAILY SABOTAGE MECHANIC ===
                        // Jika fake_boy/fake_girl sudah di fase Love Bomb (70-99),
                        // ada kemungkinan mereka sabotase relasi lover asli player
                        (function checkFakeSabotage() {
                            const fakeIds = ['fake_boy', 'fake_girl'];
                            const loverIds = ['lover1girl','lover2girl','lover1boy','lover2boy'];
                            const loverNames = {lover1girl:'Ayu',lover2girl:'Putri',lover1boy:'Dr. Budi',lover2boy:'Satria'};
                            fakeIds.forEach(fId => {
                                const fRel = STATE.player.relationships[fId] || 0;
                                if (fRel >= 70 && fRel < 100 && !STATE.player[`fakeRevealed_${fId}`]) {
                                    // 30% chance per hari sabotase lover
                                    if (Math.random() < 0.30) {
                                        loverIds.forEach(lId => {
                                            const lRel = STATE.player.relationships[lId] || 0;
                                            if (lRel > 0) {
                                                const dmg = 3 + Math.floor(Math.random() * 5); // 3-7
                                                STATE.player.relationships[lId] = Math.max(0, lRel - dmg);
                                                const fName = fId === 'fake_boy' ? 'Doni' : 'Bella';
                                                const lName = loverNames[lId] || lId;
                                                // Tampilkan notif sabotase lewat pesan HP
                                                if (!STATE.player.messages) STATE.player.messages = [];
                                                STATE.player.messages.push({
                                                    from: lName,
                                                    text: `Hei... aku denger kamu lagi deket sama ${fName}. Aku jadi ragu... apakah kita masih oke? (-${dmg} Relasi)`,
                                                    time: Date.now()
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        })();

                        // Logika Shift Kerja (Jika lupa pulang)
                        if (STATE.player.shiftStarted) {
                            STATE.player.shiftStarted = false;
                            STATE.player.bossReputation -= 5;
                        }

                        randomizeWeather(); // Ubah Cuaca
                        manualSave(); // Simpan Otomatis saat tidur

                        // Animasi Fade In
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(overlay);

                            // Ambil Nama Hari Baru
                            const currentDayName = DAYS_OF_WEEK[(STATE.day - 1) % 7];

                            if (oversleep) {
                                showToast(`⚠️ KESIANGAN! Bangun jam 10:00 karena kelelahan.`);
                            } else {
                                showToast(`Selamat Pagi! Hari ${currentDayName}`);
                            }

                            // Update tampilan tanggal/jam segera (termasuk hari)
                            const totalDays = STATE.day - 1;
                            const year = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;
                            const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;

                            document.getElementById('full-date-display').innerText = `${currentDayName}, D${dayInSeason} ${STATE.season.toUpperCase()} Y${year}`;
                            document.getElementById('clock-display').innerText = oversleep ? "10:00" : "06:00";

                            STATE.screen = 'play'; // FIX: Resume game setelah bangun
                            STATE.isDayChanging = false; // Buka kunci
                            clearTimeout(_sleepSafetyTimer); // Batalkan safety timer

                            // --- BIRTHDAY NOTIFICATION PAGI HARI ---
                            setTimeout(() => {
                                const todayBDs = getTodayBirthdays();
                                if (todayBDs.length > 0) {
                                    const names = todayBDs.map(b => b.name).join(' & ');
                                    showToast('🎂 HARI ULANG TAHUN: ' + names + '! Temui mereka!');
                                    createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                                }
                            }, 1500);

                            // --- NEW: RESPAWN BUNGA LIAR SETIAP PAGI ---
                            spawnWildFlowers();

                            // --- MENTOR MORNING TRIGGER ---
                            setTimeout(() => triggerMorningMentor(), 2200);

                            // --- LOGIKA NAFKAH HARIAN & DRAMA NIKAH MUDA ---
                            if (STATE.player.married && STATE.player.spouseId) {
                                // Cari pasangan di map mana saja (house, player_shop_interior, dll)
                                const spouseId = STATE.player.spouseId;
                                let spouse = null;
                                for (const mapKey of ['house', 'player_shop_interior', 'wedding_interior', 'lover1_interior']) {
                                    if (maps[mapKey]) {
                                        const found = maps[mapKey].npcs.find(n => n.id === spouseId);
                                        if (found) { spouse = found; break; }
                                    }
                                }
                                // Jika pasangan belum di-spawn di rumah, spawn sekarang
                                if (!spouse && maps['house']) {
                                    const spouseImages = {
                                        'lover1girl': 'images/lover1girl.png',
                                        'lover2girl': 'images/lover2girl.png',
                                        'lover1boy': 'images/lover1boy.png',
                                        'lover2boy': 'images/lover2boy.png',
                                        'lover_matre_girl': 'images/lover_matre_girl.png',
                                        'lover_matre_boy': 'images/lover_matre_boy.png'
                                    };
                                    const spouseNames = {
                                        'lover1girl':'Ayu (Gadis Desa)','lover2girl':'Putri (Scholar)',
                                        'lover1boy':'Dr. Budi','lover2boy':'Satria (Ksatria)',
                                        'lover_matre_girl':'Siska','lover_matre_boy':'Rendi'
                                    };
                                    spouse = {
                                        id: spouseId, x: 4, y: 4,
                                        name: spouseNames[spouseId] || 'Pasangan',
                                        imgSrc: spouseImages[spouseId] || 'images/lover1girl.png',
                                        type: 'static', schedule: 'always', w: 40, h: 60
                                    };
                                    maps['house'].npcs.push(spouse);
                                }

                                if (spouse) {
                                    setTimeout(() => {
                                        const dailyCost = 2500;
                                        // CEK TELAT: Pulang setelah jam 18:00 (1800) atau Dini Hari (< 600)
                                        const isLate = lastSleepTime >= 1800 || lastSleepTime < 600;

                                        // 1. TERAPKAN PENALTI DULUAN (SIMULASI DI MEMORI)
                                        // Agar kita bisa cek apakah hubungan jadi 0 gara-gara kejadian semalam
                                        let currentRel = STATE.player.relationships[spouseId] || 0;
                                        let penaltyApplied = 0;

                                        if (isLate) penaltyApplied -= 5;
                                        if (STATE.player.money < dailyCost) penaltyApplied -= 5;

                                        // Update nilai asli di state
                                        if (penaltyApplied !== 0) {
                                            updateRelationship(spouse, penaltyApplied, "Masalah Rumah Tangga");
                                            currentRel = STATE.player.relationships[spouseId]; // Ambil nilai baru
                                        }

                                        // 2. CEK APAKAH INI GONG PERCERAIAN? (Love <= 0)
                                        if (currentRel <= 0) {
                                            handleDivorceSequence(spouse);
                                            manualSave();
                                            return; // Stop flow uang belanja
                                        }

                                        // 3. JIKA MASIH AMAN (>0), LANJUT FLOW NORMAL (Uang Belanja / Drama)

                                        // --- FITUR BARU: RISIKO NIKAH MUDA ---
                                        // Semakin rendah INT (Kedewasaan) & Uang, semakin tinggi peluang Drama
                                        let dramaChance = 0.15; // Base 15%
                                        if (STATE.player.int < 30) dramaChance += 0.25; // +25% jika belum dewasa (INT rendah)
                                        if (STATE.player.money < 20000) dramaChance += 0.20; // +20% jika ekonomi sulit

                                        // Roll Drama (Hanya terjadi jika tidak telat)
                                        const isDrama = Math.random() < dramaChance;

                                        // Cek Saldo
                                        if (STATE.player.money >= dailyCost) {
                                            // Mampu Bayar
                                            STATE.player.money -= dailyCost;

                                            if (isLate) {
                                                // --- PASANGAN MARAH KARENA TELAT ---
                                                updateRelationship(spouse, -5, "Pulang Telat");
                                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit'); // Suara kecewa

                                                showDialogue(spouse.name,
                                                    `Kamu pulang jam berapa kemarin?! 😡\n\nKita kan sudah sepakat **wajib pulang sebelum jam 6 sore**!\nAku nungguin kamu sampai ketiduran.\n\nAku kecewa. (Cinta -5)\n*Dia mengambil 2.500 Gold dengan kasar untuk belanja.*`,
                                                    [{
                                                        text: `Maaf sayang... (Sisa: ${STATE.player.money.toLocaleString()} G)`,
                                                        action: closeDialogue
                                                    }],
                                                    spouse.imgSrc
                                                );
                                            }
                                            else if (isDrama) {
                                                // --- REALITA NIKAH MUDA (DRAMA) ---
                                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit'); // Suara kaget/sedih

                                                const dramas = [
                                                    {
                                                        title: "MENTAL BELUM SIAP",
                                                        text: "Jujur... aku iri liat story teman-temanku. Mereka lagi asik nongkrong dan traveling, sedangkan aku di sini terjebak ngurus rumah.\n\nKadang aku nyesel kita buru-buru nikah... Aku merasa masa mudaku hilang! 😭",
                                                        effect: () => {
                                                            updateRelationship(spouse, -5, "Penyesalan");
                                                            STATE.player.energy = Math.max(0, STATE.player.energy - 30); // Stress bikin lemas
                                                        },
                                                        btn: "Maafkan aku... (Cinta -5, Energi -30)"
                                                    },
                                                    {
                                                        title: "EMOSI LABIL",
                                                        text: "KAMU TUH GAK PEKA BANGET SIH! 😡\n\nAku capek! Aku maunya dimengerti! Jangan diem aja dong!\n\n(Dia marah-marah tanpa alasan jelas. Emosinya sangat tidak stabil hari ini).",
                                                        effect: () => {
                                                            updateRelationship(spouse, -8, "Emosi Labil");
                                                        },
                                                        btn: "Sabar... Sabar... (Cinta -8)"
                                                    },
                                                    {
                                                        title: "GUNCANGAN EKONOMI",
                                                        text: "Uang 2.500 ini cuma cukup buat makan! Belum bayar listrik, belum skincare, belum kuota...\n\nKita tuh miskin banget sih! Aku malu sama tetangga yang mobilnya baru! Kamu harus kerja lebih keras dong!",
                                                        effect: () => {
                                                            updateRelationship(spouse, -5, "Tuntutan Hidup");
                                                            STATE.player.reputation = Math.max(0, STATE.player.reputation - 5);
                                                        },
                                                        btn: "Aku akan berusaha... (Reputasi -5)"
                                                    },
                                                    {
                                                        title: "CEMBURU BUTA",
                                                        text: "Tadi aku liat kamu senyum-senyum sama orang lain di desa.\n\nNgaku! Kamu pasti bosen kan sama aku?! Kamu mau selingkuh ya?!\n\n(Ketidakamanan diri alias Insecure khas remaja yang menikah dini)",
                                                        effect: () => {
                                                            updateRelationship(spouse, -10, "Insecure");
                                                        },
                                                        btn: "Enggak sayang, sumpah! (Cinta -10)"
                                                    }
                                                ];

                                                const drama = dramas[Math.floor(Math.random() * dramas.length)];
                                                drama.effect();

                                                showDialogue(`${spouse.name} (Drama)`,
                                                    `**[REALITA NIKAH MUDA: ${drama.title}]**\n\n"${drama.text}"\n\n*Uang belanja 2.500 G diambil dengan ketus.*`,
                                                    [{
                                                        text: drama.btn,
                                                        action: closeDialogue
                                                    }],
                                                    spouse.imgSrc
                                                );

                                            } else {
                                                // --- PASANGAN BAHAGIA (NORMAL) ---
                                                // Family AP dari harmoni rumah tangga
                                                const harmonyAP = Math.floor((STATE.player.relationships[spouseId] || 0) / 20) + 1;
                                                STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + harmonyAP;
                                                createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                                                showDialogue(spouse.name,
                                                    `Selamat pagi sayang! ❤️\n\nTerima kasih sudah pulang tepat waktu kemarin.\nSeperti biasa, aku ambil **2.500 Gold** untuk belanja pasar ya.\n\nSarapan sudah siap!\n\n🏅 Keluarga Harmonis: +${harmonyAP} AP`,
                                                    [{
                                                        text: `Ikhlas (Sisa: ${STATE.player.money.toLocaleString()} G)`,
                                                        action: () => {
                                                            updateRelationship(spouse, 1);
                                                            closeDialogue();
                                                        }
                                                    }],
                                                    spouse.imgSrc
                                                );
                                            }
                                        } else {
                                            // Tidak Mampu Bayar (Hutang/Minus)
                                            STATE.player.money -= dailyCost; // Saldo jadi minus

                                            // Hukuman Dasar
                                            STATE.player.reputation = Math.max(0, STATE.player.reputation - 5);
                                            updateRelationship(spouse, -5, "Ekonomi Sulit");

                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('hit'); // Suara sedih/hit

                                            let msg = `Selamat pagi... sayang? 😟\n\nUang belanja di laci habis... Tukang sayur sudah menagih.\nAku terpaksa ngutang dulu.`;

                                            if (isLate) {
                                                // Hukuman Ganda jika Telat + Miskin
                                                updateRelationship(spouse, -5, "Combo Telat");
                                                msg = `Sudah pulang telat, uang belanja juga nggak ada?! 😭\n\nKamu niat berumah tangga nggak sih?! Aku malu sama tetangga!`;
                                            }

                                            showDialogue(spouse.name,
                                                msg + `\n\n(Saldo Minus! Reputasi & Cinta Berkurang)`,
                                                [{
                                                    text: `Maafkan aku... (Sisa: ${STATE.player.money.toLocaleString()} G)`,
                                                    action: closeDialogue
                                                }],
                                                spouse.imgSrc
                                            );
                                        }

                                        // Simpan lagi setelah transaksi otomatis
                                        manualSave();
                                    }, 1200); // Jeda setelah bangun tidur
                                }
                            }

                        }, 1000);

                    }, 2000); // Durasi layar hitam
                }, 100);
            }

            // ============================================================
            // SISTEM PART-TIME (15:00 - 19:00) — SEMUA ROLE BISA IKUT
            // ============================================================
            const PART_TIME_JOBS = {
                'bengkel': {
                    name: '⚒️ Bengkel Besi (Bang Joko)',
                    desc: 'Bantu tempa logam, bersihkan alat, dan layani pelanggan bengkel.',
                    wage: 3500,
                    stat: 'STR +1',
                    statKey: 'str',
                    hours: '15:00 – 19:00',
                    location: 'Di dalam Bengkel (smithy_interior)',
                    img: 'images/blacksmith.png',
                    npcId: 'blacksmith'
                },
                'penjahit': {
                    name: '🧵 Tukang Jahit (Marine)',
                    desc: 'Bantu potong kain, jahit pesanan, dan rapikan etalase butik.',
                    wage: 3000,
                    stat: 'INT +1',
                    statKey: 'int',
                    hours: '15:00 – 19:00',
                    location: 'Di Rumah Marine (tailor_area)',
                    img: 'images/marine.png',
                    npcId: 'marine_tailor'
                },
                'klinik': {
                    name: '🩺 Klinik (Dr. Budi)',
                    desc: 'Bantu administrasi pasien, siapkan obat, dan dampingi dokter.',
                    wage: 4000,
                    stat: 'REP +1',
                    statKey: 'reputation',
                    hours: '15:00 – 19:00',
                    location: 'Di dalam Klinik (clinic_interior)',
                    img: 'images/lover1boy.png',
                    npcId: 'lover1boy'
                }
            };

            function openPartTimeMenu(npcId) {
                const p = STATE.player;
                const jobKey = Object.keys(PART_TIME_JOBS).find(k => PART_TIME_JOBS[k].npcId === npcId);
                if (!jobKey) return;
                const job = PART_TIME_JOBS[jobKey];

                // Cek sudah kerja part-time di tempat lain
                if (p.partTimeStatus === 'working' && p.partTimeJob !== jobKey) {
                    const currentJobName = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'tempat lain';
                    showDialogue('PART-TIME', `Kamu sudah punya pekerjaan part-time di ${currentJobName}.\n\nKamu hanya bisa kerja part-time di 1 tempat. Resign dulu jika ingin pindah.`, [
                        { text: '❌ Resign dari Part-Time Lama', action: () => resignPartTime(npcId) },
                        { text: 'Batalkan', action: closeDialogue }
                    ], job.img);
                    return;
                }

                if (p.partTimeStatus === 'working' && p.partTimeJob === jobKey) {
                    // Sudah kerja di sini — tampilkan opsi kerja/absen
                    showPartTimeWorkMenu(jobKey);
                    return;
                }

                // Belum punya part-time — tampilkan tawaran
                showDialogue('LOWONGAN PART-TIME', 
                    `🌟 PART-TIME: ${job.name}\n\n` +
                    `📋 Tugas: ${job.desc}\n` +
                    `💰 Upah: ${job.wage.toLocaleString()} G / hari\n` +
                    `📈 Bonus Stat: ${job.stat}\n` +
                    `⏰ Jam Kerja: ${job.hours}\n` +
                    `📍 Lokasi: ${job.location}\n\n` +
                    `Part-time bisa diambil SEMUA role (Pekerja, Akademisi, Wirausaha, Keluarga). ` +
                    `Shift dimulai saat kamu absen masuk antara jam 15:00 – 17:00.`,
                    [
                        { text: '✅ Daftar Part-Time Ini', action: () => applyPartTime(jobKey, job) },
                        { text: 'Tidak Jadi', action: closeDialogue }
                    ], job.img
                );
            }

            function applyPartTime(jobKey, job) {
                const p = STATE.player;
                p.partTimeJob = jobKey;
                p.partTimeStatus = 'working';
                p.partTimeShiftStarted = false;
                closeDialogue();
                showToast(`🎉 Selamat! Kamu resmi jadi karyawan part-time di ${job.name}!`);
                setTimeout(() => {
                    showDialogue('SELAMAT BERGABUNG!',
                        `Kamu sekarang adalah karyawan part-time!\n\n` +
                        `📌 CARA KERJA:\n` +
                        `1. Datang ke lokasi kerja antara jam 15:00 – 17:00\n` +
                        `2. Tekan tombol "Absen Masuk Part-Time" saat bicara dengan bos\n` +
                        `3. Shift otomatis selesai jam 19:00\n` +
                        `4. Upah & bonus stat langsung diterima!\n\n` +
                        `⚠️ Kalau tidak absen, gaji tidak masuk hari itu.`,
                        [{ text: 'Siap bekerja!', action: closeDialogue }], job.img
                    );
                }, 300);
            }

            function resignPartTime(newNpcId) {
                const p = STATE.player;
                p.partTimeJob = null;
                p.partTimeStatus = 'none';
                p.partTimeShiftStarted = false;
                closeDialogue();
                showToast('Kamu sudah resign dari part-time lama.');
                setTimeout(() => {
                    if (newNpcId) {
                        const npc = (STATE.maps[STATE.location] && STATE.maps[STATE.location].npcs || []).find(n => n.id === newNpcId)
                                 || Object.values(STATE.maps).flatMap(m => m.npcs || []).find(n => n.id === newNpcId);
                        if (npc) interactNPC(npc);
                        else openPartTimeMenu(newNpcId);
                    }
                }, 400);
            }

            function showPartTimeWorkMenu(jobKey) {
                const p = STATE.player;
                const job = PART_TIME_JOBS[jobKey];
                const dayIndex = (STATE.day - 1) % 7;
                const isSunday = dayIndex === 6;
                const alreadyWorkedToday = p.partTimeLastWorkedDay === STATE.day;

                if (isSunday) {
                    showDialogue(job.name, 'Hari ini MINGGU, libur part-time. Istirahat yang cukup ya!', [
                        { text: 'Oke, istirahat dulu', action: closeDialogue }
                    ], job.img);
                    return;
                }

                if (alreadyWorkedToday) {
                    showDialogue(job.name, `Shift part-time hari ini sudah selesai! ✅\nKamu sudah mendapat upah ${job.wage.toLocaleString()} G tadi.\n\nSampai besok ya!`, [
                        { text: 'Sampai besok!', action: closeDialogue },
                        { text: '❌ Resign Part-Time', action: () => { resignPartTime(null); } }
                    ], job.img);
                    return;
                }

                if (p.partTimeShiftStarted) {
                    showDialogue(job.name, `Shift part-time sedang berjalan! ⏳\nSelesai jam 19:00.\n\nLanjutkan tugasmu ya!`, [
                        { text: 'Siap!', action: closeDialogue }
                    ], job.img);
                    return;
                }

                const opts = [];

                // Bisa absen hanya jam 15:00 – 17:00
                if (isFestivalDayToday()) {
                    const fest = getTodayFestivalData();
                    opts.push({ text: `${fest ? fest.icon : '🎉'} Hari ini festival — libur part-time!`, action: () => {
                        showToast(`${fest ? fest.icon : '🎉'} ${fest ? fest.name : 'Festival'} — semua aktivitas libur!`);
                        closeDialogue();
                    }});
                } else if (STATE.time >= 1500 && STATE.time < 1700) {
                    opts.push({
                        text: '🟢 Absen Masuk Part-Time (15:00)',
                        action: () => {
                            if (p.energy < 15) {
                                showToast('Energi terlalu rendah untuk kerja part-time!');
                                return;
                            }
                            p.partTimeShiftStarted = true;
                            closeDialogue();
                            showToast(`✅ Absen masuk part-time di ${job.name}! Selesai jam 19:00.`);
                            maybeShowWorkConflict(true, jobKey);
                        }
                    });
                } else if (STATE.time < 1500) {
                    opts.push({ text: `⏰ Shift belum mulai (Datang jam 15:00)`, action: () => closeDialogue() });
                } else {
                    opts.push({ text: `⛔ Terlambat absen (lewat jam 17:00)`, action: () => {
                        showToast('Terlambat! Gaji tidak masuk hari ini.');
                        closeDialogue();
                    }});
                }

                opts.push({ text: '📊 Statistik Part-Time', action: () => {
                    showDialogue('STATISTIK PART-TIME', 
                        `💼 Pekerjaan: ${job.name}\n` +
                        `📅 Total Hari Kerja: ${p.partTimeSalaryDays || 0} hari\n` +
                        `💰 Total Penghasilan: ${((p.partTimeSalaryDays || 0) * job.wage).toLocaleString()} G (estimasi)\n` +
                        `⏰ Jam Kerja: ${job.hours}`,
                        [{ text: 'Tutup', action: () => showPartTimeWorkMenu(jobKey) }], job.img
                    );
                }});
                opts.push({ text: '❌ Resign Part-Time', action: () => {
                    showDialogue('KONFIRMASI RESIGN', `Yakin mau resign dari ${job.name}?\nKamu bisa melamar lagi kapan saja.`, [
                        { text: 'Ya, Resign', action: () => resignPartTime(null) },
                        { text: 'Batal', action: () => showPartTimeWorkMenu(jobKey) }
                    ], job.img);
                }});
                opts.push({ text: 'Tutup', action: closeDialogue });

                showDialogue(`PART-TIME — ${job.name}`, 
                    `Selamat datang kembali! 👋\nShift part-time: ${job.hours}\n\n` +
                    `Status: ${p.partTimeShiftStarted ? '🟢 Sedang Kerja' : '🔴 Belum Absen'}\n` +
                    `Energi kamu: ${Math.round(p.energy)}%`,
                    opts, job.img
                );
            }

            // ================================================================
            // SISTEM INFO LOWONGAN KERJA — Harus cari info dulu sebelum melamar
            // Sumber info: Papan Desa, Warnet (cari di internet), Tetangga/NPC,
            //              Mentor Budi, Koran (jika ada)
            // ================================================================

            // Katalog semua lowongan yang bisa ditemukan
            const JOB_LISTINGS = {
                'merchant': {
                    id: 'merchant',
                    title: '🏪 Staff Gudang — Toko Merchant',
                    employer: 'Pak Hendra (Merchant)',
                    desc: 'Dibutuhkan tenaga sortir gudang, kasir, dan pelayan toko.\nShift pagi 08:00–16:00, Senin–Sabtu.',
                    syarat: '• Min. ijazah SMA/SMK\n• Disiplin & jujur\n• Tidak perlu pengalaman (awal magang)',
                    gaji: '5.000 G/hari (Magang) → naik s/d 25.000 G/hari',
                    lokasi: '📍 Temui Pak Hendra langsung di Toko Merchant (Selatan Desa)',
                    type: 'formal',
                    sources: ['papan','warnet','mentor','tetangga']
                },
                'bengkel_formal': {
                    id: 'bengkel_formal',
                    title: '⚒️ Asisten Pandai Besi — Bengkel Bang Joko',
                    employer: 'Bang Joko (Blacksmith)',
                    desc: 'Bantu tempa logam, rawat alat, dan layani pelanggan bengkel.\nCocok untuk yang kuat fisik.',
                    syarat: '• Min. ijazah SMA/SMK jurusan teknik lebih diutamakan\n• STR minimal cukup kuat\n• Siap kerja kasar',
                    gaji: '3.500 G/hari (Part-Time) atau negosiasi full-time',
                    lokasi: '📍 Masuk ke dalam Bengkel, temui Bang Joko',
                    type: 'parttime',
                    sources: ['papan','tetangga','mentor']
                },
                'parttime_jahit': {
                    id: 'parttime_jahit',
                    title: '🧵 Asisten Penjahit — Butik Marine',
                    employer: 'Marine (Penjahit)',
                    desc: 'Bantu potong pola, jahit pesanan, dan kelola etalase butik.\nCocok untuk yang teliti dan sabar.',
                    syarat: '• Siapapun bisa, lebih baik punya ketelitian\n• Waktu fleksibel sore hari',
                    gaji: '3.000 G/hari (15:00–19:00)',
                    lokasi: '📍 Temui Marine di area tailor (dekat Bengkel)',
                    type: 'parttime',
                    sources: ['papan','warnet','tetangga']
                },
                'parttime_klinik': {
                    id: 'parttime_klinik',
                    title: '🩺 Asisten Administrasi — Klinik Dr. Budi',
                    employer: 'Dr. Budi',
                    desc: 'Bantu daftar pasien, siapkan rekam medis, dan urus kebersihan klinik.\nCocok untuk yang rapi dan komunikatif.',
                    syarat: '• Min. SMA/SMK semua jurusan\n• Ramah dan teliti\n• Upah terbaik di antara part-time',
                    gaji: '4.000 G/hari (15:00–19:00)',
                    lokasi: '📍 Masuk ke Klinik (Balai Pengobatan), temui Dr. Budi',
                    type: 'parttime',
                    sources: ['warnet','mentor','klinik']
                }
            };

            // Cek apakah pemain sudah tahu tentang lowongan ini
            function knowsJob(jobId) {
                return (STATE.player.knownJobs || []).includes(jobId);
            }

            // Tandai lowongan sebagai diketahui
            function discoverJob(jobId) {
                if (!STATE.player.knownJobs) STATE.player.knownJobs = [];
                if (!STATE.player.knownJobs.includes(jobId)) {
                    STATE.player.knownJobs.push(jobId);
                    const job = JOB_LISTINGS[jobId];
                    if (job) {
                        showToast(`📋 Info Lowongan Baru: ${job.title}`);
                        STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 1;
                    }
                }
            }

            // Tampilkan detail satu lowongan
            function showJobDetail(jobId, backFn) {
                const job = JOB_LISTINGS[jobId];
                if (!job) return;
                const p = STATE.player;
                const alreadyApplied = (jobId === 'merchant' || jobId === 'bengkel_formal') 
                    ? p.jobStatus === 'employed' 
                    : p.partTimeStatus === 'working';

                const statusLine = alreadyApplied ? '\n✅ Kamu sudah bekerja di sini!\n' : '';

                showDialogue(`📋 ${job.title}`,
                    `👔 Pemberi Kerja: ${job.employer}\n\n` +
                    `📝 Deskripsi:\n${job.desc}\n\n` +
                    `✅ Syarat:\n${job.syarat}\n\n` +
                    `💰 Gaji: ${job.gaji}\n\n` +
                    `${job.lokasi}` +
                    statusLine,
                    [
                        alreadyApplied 
                            ? { text: '✅ Sudah Bekerja Di Sini', action: closeDialogue }
                            : { text: '🚶 Pergi Melamar Sekarang!', action: () => {
                                closeDialogue();
                                showToast(`Pergi ke: ${job.lokasi.replace('📍 ','')}!`);
                              }},
                        { text: '← Kembali', action: () => { closeDialogue(); if (backFn) backFn(); } }
                    ], 'images/papandesa.png'
                );
            }

            // Panel utama: Daftar semua lowongan yang sudah diketahui
            function openKnownJobsPanel(backFn) {
                const p = STATE.player;
                const known = p.knownJobs || [];

                if (known.length === 0) {
                    showDialogue('📋 INFO LOWONGAN KERJA',
                        'Kamu belum punya info lowongan kerja apapun.\n\n' +
                        '📌 Cara mendapatkan info lowongan:\n' +
                        '• 📌 Baca Papan Desa (di pusat desa)\n' +
                        '• 💻 Cari di Warnet (bayar 500G/sesi)\n' +
                        '• 💬 Tanya warga / tetangga sekitar\n' +
                        '• 👨‍🏫 Konsultasi ke Mentor Budi\n\n' +
                        '💡 Di dunia nyata pun mencari kerja butuh usaha.\n' +
                        'Semakin banyak info, semakin besar peluangmu!',
                        [
                            { text: '📌 Lihat Papan Desa', action: () => { closeDialogue(); searchJobFromBoard(); } },
                            { text: 'Nanti Dulu', action: closeDialogue }
                        ], 'images/papandesa.png'
                    );
                    return;
                }

                // Buat daftar lowongan yang diketahui
                const opts = [];
                known.forEach(jid => {
                    const job = JOB_LISTINGS[jid];
                    if (!job) return;
                    const isWorking = (jid === 'merchant' || jid === 'bengkel_formal')
                        ? p.jobStatus === 'employed'
                        : (p.partTimeStatus === 'working' && p.partTimeJob === jid.replace('bengkel_formal','bengkel').replace('merchant',''));
                    const statusIcon = isWorking ? '✅' : '📋';
                    opts.push({ text: `${statusIcon} ${job.title}`, action: () => showJobDetail(jid, () => openKnownJobsPanel(backFn)) });
                });
                opts.push({ text: '🔍 Cari Info Lowongan Baru', action: () => { closeDialogue(); openJobSearchMenu(); } });
                opts.push({ text: 'Tutup', action: closeDialogue });

                showDialogue(`📋 INFO LOWONGAN (${known.length} tersimpan)`,
                    `Kamu sudah punya info ${known.length} lowongan.\nPilih untuk melihat detail & cara melamar:`,
                    opts, 'images/papandesa.png'
                );
            }

            // Menu pilihan cara mencari info lowongan
            function openJobSearchMenu() {
                const p = STATE.player;
                showDialogue('🔍 CARI INFO LOWONGAN KERJA',
                    'Pilih cara kamu mencari informasi lowongan:\n\n' +
                    '💡 Semakin banyak sumber yang kamu cek,\nsemakin banyak lowongan yang kamu temukan!',
                    [
                        { text: '📌 Baca Papan Desa', action: () => { closeDialogue(); searchJobFromBoard(); } },
                        { text: '💻 Cari di Warnet (500G)', action: () => { closeDialogue(); searchJobFromWarnet(); } },
                        { text: '💬 Tanya Tetangga/Warga', action: () => { closeDialogue(); searchJobFromNeighbor(); } },
                        { text: '👨‍🏫 Konsultasi Mentor Budi', action: () => { closeDialogue(); searchJobFromMentor(); } },
                        { text: '← Kembali', action: closeDialogue }
                    ], 'images/papandesa.png'
                );
            }

            // SUMBER 1: Papan Desa → merchant + bengkel_formal
            function searchJobFromBoard() {
                const p = STATE.player;
                const newJobs = [];
                if (!knowsJob('merchant')) { discoverJob('merchant'); newJobs.push(JOB_LISTINGS['merchant']); }
                if (!knowsJob('bengkel_formal')) { discoverJob('bengkel_formal'); newJobs.push(JOB_LISTINGS['bengkel_formal']); }

                p.jobSearchCount = (p.jobSearchCount || 0) + 1;
                p.lastJobSearchDay = STATE.day;

                if (newJobs.length > 0) {
                    const listStr = newJobs.map(j => `• ${j.title}`).join('\n');
                    showDialogue('📌 PAPAN LOWONGAN DESA',
                        `Kamu membaca pengumuman di Papan Desa dengan seksama...\n\n` +
                        `📋 LOWONGAN BARU DITEMUKAN:\n${listStr}\n\n` +
                        `Info ini sudah tersimpan di daftar lowonganmu!\n\n` +
                        `💡 Papan desa biasanya mencantumkan lowongan formal di sekitar desa. Untuk lowongan part-time yang lebih fleksibel, coba cari di sumber lain.`,
                        [
                            { text: '📋 Lihat Detail Lowongan', action: () => { closeDialogue(); openKnownJobsPanel(null); } },
                            { text: 'Oke, terima kasih!', action: closeDialogue }
                        ], 'images/papandesa.png'
                    );
                } else {
                    showDialogue('📌 PAPAN LOWONGAN DESA',
                        'Kamu sudah membaca semua info di papan ini.\n\nSemua lowongan yang tersedia sudah kamu catat.\n\n💡 Coba cari di sumber lain untuk menemukan lowongan part-time!',
                        [
                            { text: '📋 Lihat Daftar Lowonganku', action: () => { closeDialogue(); openKnownJobsPanel(null); } },
                            { text: 'Oke', action: closeDialogue }
                        ], 'images/papandesa.png'
                    );
                }
            }

            // SUMBER 2: Warnet → semua lowongan, tapi bayar 500G
            function searchJobFromWarnet() {
                const p = STATE.player;
                if (p.money < 500) {
                    showDialogue('💻 WARNET',
                        'Kamu tidak punya cukup uang untuk sewa PC.\n\nBiaya: 500 G/sesi\nUangmu: ' + p.money + ' G\n\n💡 Coba tanya tetangga dulu, itu gratis!',
                        [{ text: 'Oke', action: closeDialogue }], 'images/warnet.png'
                    );
                    return;
                }
                if (p.energy < 10) {
                    showToast('Terlalu lelah untuk mencari-cari di warnet...');
                    return;
                }

                p.money -= 500;
                p.energy -= 10;
                p.jobSearchCount = (p.jobSearchCount || 0) + 1;
                p.lastJobSearchDay = STATE.day;

                const newJobs = [];
                const allJobIds = Object.keys(JOB_LISTINGS);
                allJobIds.forEach(jid => {
                    if (JOB_LISTINGS[jid].sources.includes('warnet') && !knowsJob(jid)) {
                        discoverJob(jid);
                        newJobs.push(JOB_LISTINGS[jid]);
                    }
                });

                if (newJobs.length > 0) {
                    const listStr = newJobs.map(j => `• ${j.title}`).join('\n');
                    showDialogue('💻 HASIL BROWSING WARNET',
                        `Kamu browsing selama 1 jam mencari lowongan kerja...\n\n` +
                        `🔍 Situs yang dikunjungi: JobStreet, Kaskus, Facebook Group Lowongan...\n\n` +
                        `📋 LOWONGAN BARU DITEMUKAN:\n${listStr}\n\n` +
                        `✅ Info tersimpan! Biaya sewa: 500 G\n\n` +
                        `💡 Internet adalah alat pencarian kerja paling powerful zaman ini. Lulusan SMA/SMK yang melek digital punya keunggulan kompetitif!`,
                        [
                            { text: '📋 Lihat Detail Lowongan', action: () => { closeDialogue(); openKnownJobsPanel(null); } },
                            { text: 'Mantap!', action: closeDialogue }
                        ], 'images/warnet.png'
                    );
                } else {
                    showDialogue('💻 HASIL BROWSING WARNET',
                        'Kamu browsing tapi tidak menemukan lowongan baru.\nSemua info yang tersedia sudah kamu catat.\n\nBiaya sewa: 500 G (hangus)\n\n💡 Terkadang kerja keras mencari info tidak langsung membuahkan hasil. Tapi pengalaman mencari itu sendiri melatihmu!',
                        [{ text: 'Oke...', action: closeDialogue }], 'images/warnet.png'
                    );
                }
            }

            // SUMBER 3: Tanya tetangga → parttime random
            function searchJobFromNeighbor() {
                const p = STATE.player;
                const todaySearched = p.lastJobSearchDay === STATE.day && (p.jobSearchCount || 0) >= 3;
                if (todaySearched) {
                    showDialogue('💬 TANYA TETANGGA',
                        'Kamu sudah banyak bertanya hari ini.\nTetangga mulai kelelahan menjawab pertanyaanmu 😅\n\nCoba lagi besok!',
                        [{ text: 'Hehe oke', action: closeDialogue }], 'images/boy.png'
                    );
                    return;
                }

                p.jobSearchCount = (p.jobSearchCount || 0) + 1;
                p.lastJobSearchDay = STATE.day;

                // Tetangga kasih info part-time secara acak
                const partTimeJobs = ['parttime_jahit', 'parttime_klinik', 'bengkel_formal'];
                const unknown = partTimeJobs.filter(jid => !knowsJob(jid));

                const neighborLines = [
                    { name: 'Pak RT', img: 'images/boy.png', intro: '"Eh, kamu lagi nyari kerja? Kebetulan saya dengar..."' },
                    { name: 'Bu Warung', img: 'images/girl.png', intro: '"Aduh anak muda, minta kerja susah sekarang ya... Tapi pernah dengar..."' },
                    { name: 'Mas Sebelah', img: 'images/peer1.png', intro: '"Bro, kemarin aku lihat pengumuman di tembok dekat bengkel..."' },
                ];
                const nb = neighborLines[Math.floor(Math.random() * neighborLines.length)];

                if (unknown.length > 0) {
                    const picked = unknown[Math.floor(Math.random() * unknown.length)];
                    discoverJob(picked);
                    const job = JOB_LISTINGS[picked];
                    showDialogue(`💬 ${nb.name}`,
                        `${nb.intro}\n\n` +
                        `"Kayaknya ${job.employer} lagi butuh bantuan. Kamu bisa coba ke sana!"\n\n` +
                        `📋 INFO LOWONGAN BARU:\n${job.title}\nGaji: ${job.gaji}\n\n` +
                        `💡 Networking (koneksi sosial) adalah salah satu cara paling efektif mencari kerja di Indonesia. Lebih dari 60% lowongan diisi melalui kenalan!`,
                        [
                            { text: '📋 Lihat Detail', action: () => { closeDialogue(); showJobDetail(picked, null); } },
                            { text: 'Makasih infonya!', action: closeDialogue }
                        ], nb.img
                    );
                } else {
                    showDialogue(`💬 ${nb.name}`,
                        `${nb.intro}\n\n"Hmm, tapi kayaknya kamu sudah tahu semua lowongan yang ada di sini deh."\n\n` +
                        `💡 Jaringan pertemananmu di desa ini sudah kamu manfaatkan dengan baik. Coba cari di luar desa lewat warnet!`,
                        [{ text: 'Iya makasih!', action: closeDialogue }], nb.img
                    );
                }
            }

            // SUMBER 4: Mentor Budi → merchant + saran karir
            function searchJobFromMentor() {
                const p = STATE.player;
                const newJobs = [];
                const allJobIds = Object.keys(JOB_LISTINGS);
                allJobIds.forEach(jid => {
                    if (JOB_LISTINGS[jid].sources.includes('mentor') && !knowsJob(jid)) {
                        discoverJob(jid);
                        newJobs.push(JOB_LISTINGS[jid]);
                    }
                });
                p.jobSearchCount = (p.jobSearchCount || 0) + 1;

                const edu = p.role === 'student' 
                    ? 'Karena kamu kuliah, part-time bisa jadi pilihan agar tidak ganggu akademik.'
                    : p.married 
                        ? 'Kamu sudah menikah — stabilitas keuangan adalah prioritas. Kerja formal lebih disarankan untuk jangka panjang.'
                        : 'Mulailah dari yang bisa kamu capai sekarang, lalu terus tingkatkan dirimu.';

                const listStr = newJobs.length > 0 
                    ? `📋 Lowongan yang Mentor rekomendasikan:\n${newJobs.map(j=>`• ${j.title}`).join('\n')}\n\n`
                    : 'Kamu sudah tahu semua lowongan yang Mentor ketahui.\n\n';

                showDialogue('👨‍🏫 MENTOR BUDI — KONSULTASI KARIR',
                    `"Nak, mencari pekerjaan itu seperti belajar — butuh usaha, bukan sekedar menunggu."\n\n` +
                    listStr +
                    `💡 SARAN MENTOR:\n${edu}\n\n` +
                    `"Dengan ijazah SMA/SMK, pintu yang terbuka memang tidak selebar S1. Tapi bukan berarti tertutup. Keterampilan, disiplin, dan attitude-mu yang akan membedakan!"\n\n` +
                    `📊 Fakta: Rata-rata gaji awal SMA/SMK Rp 2–3 juta/bulan. Dengan pengalaman 2–3 tahun bisa mencapai Rp 4–6 juta.`,
                    [
                        newJobs.length > 0 ? { text: '📋 Lihat Lowongan', action: () => { closeDialogue(); openKnownJobsPanel(null); } } : null,
                        { text: 'Terima kasih Mentor!', action: closeDialogue }
                    ].filter(Boolean), 'images/mentor.png'
                );
            }

            function openPartTimeLobby() {
                // Tampilkan semua pilihan tempat part-time
                showDialogue('🌟 PAPAN LOWONGAN PART-TIME',
                    'Cari kerja tambahan? Semua role bisa ambil part-time!\n\n' +
                    '⏰ Jam kerja: 15:00 – 19:00 setiap hari (kecuali Minggu)\n' +
                    '📌 Pilih tempat yang ingin kamu lamar:',
                    [
                        { text: '⚒️ Bengkel Besi (3.500 G/hari, STR+1)', action: () => openPartTimeMenu('blacksmith') },
                        { text: '🧵 Tukang Jahit (3.000 G/hari, INT+1)', action: () => openPartTimeMenu('marine_tailor') },
                        { text: '🩺 Klinik (4.000 G/hari, REP+1)', action: () => openPartTimeMenu('lover1boy') },
                        { text: 'Nanti dulu', action: closeDialogue }
                    ], 'images/bg.png'
                );
            }

            // ================================================================
            // SISTEM MINIGAME LAMARAN KERJA LENGKAP
            // ================================================================

            // --- DATABASE LOWONGAN ---
            const LOWONGAN_DB = {
                merchant: {
                    id: 'merchant',
                    nama: '🏪 Staff Gudang — Toko Merchant (Pak Hendra)',
                    posisi: 'Staff Gudang / Kasir',
                    npcId: 'merchant',
                    tujuan: 'Yth. Bapak Hendra\nPimpinan Toko Merchant\nDesa Nusantara Arsa',
                    perihal: 'Permohonan Menjadi Karyawan Staff Gudang',
                    syaratLampiran: [
                        { id: 'ijazah',       label: 'Fotokopi Ijazah SMA/SMK',         wajib: true  },
                        { id: 'cv',           label: 'Curriculum Vitae (CV)',             wajib: true  },
                        { id: 'foto_3x4',     label: 'Pas Foto 3×4 (2 lembar)',          wajib: true  },
                        { id: 'ktp',          label: 'Fotokopi KTP',                     wajib: true  },
                        { id: 'surat_sehat',  label: 'Surat Keterangan Sehat',           wajib: false },
                        { id: 'skck',         label: 'SKCK (Surat Kel. Catatan Kepolisian)', wajib: false }
                    ],
                    bodySurat: (nama, skills) =>
                        `Dengan hormat,\n\nYang bertanda tangan di bawah ini:\n` +
                        `Nama  : ${nama}\nAlamat: Desa Nusantara Arsa\n\n` +
                        `Dengan ini mengajukan permohonan untuk dapat diterima sebagai ` +
                        `karyawan pada posisi **Staff Gudang** di Toko Merchant yang Bapak pimpin.\n\n` +
                        `Saya memiliki kemampuan: ${skills || 'kerja keras dan disiplin'}. ` +
                        `Saya siap bekerja penuh waktu sesuai jam yang ditentukan.\n\n` +
                        `Demikian surat lamaran ini saya buat dengan sebenar-benarnya. ` +
                        `Atas perhatian Bapak, saya ucapkan terima kasih.\n\nHormat saya,\n${nama}`,
                    info: 'Jam kerja 08:00–16:00. Gaji awal magang. Bisa naik jabatan hingga Manajer.',
                    rewardJobKey: 'worker_merchant'
                },
                blacksmith: {
                    id: 'blacksmith',
                    nama: '⚒️ Karyawan Part-Time — Bengkel Besi (Bang Joko)',
                    posisi: 'Asisten Bengkel (Part-Time)',
                    npcId: 'blacksmith',
                    tujuan: 'Yth. Bapak Joko\nPemilik Bengkel Besi\nDesa Nusantara Arsa',
                    perihal: 'Permohonan Kerja Part-Time Asisten Bengkel',
                    syaratLampiran: [
                        { id: 'ijazah',      label: 'Fotokopi Ijazah SMA/SMK',  wajib: true  },
                        { id: 'cv',          label: 'Curriculum Vitae (CV)',      wajib: true  },
                        { id: 'foto_3x4',    label: 'Pas Foto 3×4 (1 lembar)',   wajib: true  },
                        { id: 'ktp',         label: 'Fotokopi KTP',              wajib: false },
                        { id: 'sertifikat',  label: 'Sertifikat Skill (Jika Ada)',wajib: false }
                    ],
                    bodySurat: (nama, skills) =>
                        `Dengan hormat,\n\nSaya ${nama}, warga Desa Nusantara Arsa, ` +
                        `bermaksud mengajukan lamaran untuk posisi **Asisten Bengkel Part-Time** ` +
                        `di bengkel yang Bapak kelola.\n\n` +
                        `Saya memiliki fisik yang kuat dan semangat belajar tinggi. ` +
                        `${skills ? 'Kemampuan saya: ' + skills + '.' : ''} ` +
                        `Saya bersedia bekerja pada jam part-time (15:00–19:00) setiap hari kerja.\n\n` +
                        `Atas pertimbangan Bapak, saya ucapkan terima kasih.\n\nHormat saya,\n${nama}`,
                    info: 'Jam kerja 15:00–19:00. Upah harian. Cocok untuk semua role.',
                    rewardJobKey: 'parttime_bengkel'
                },
                marine_tailor: {
                    id: 'marine_tailor',
                    nama: '🧵 Karyawan Part-Time — Butik Marine (Bu Marine)',
                    posisi: 'Asisten Penjahit (Part-Time)',
                    npcId: 'marine_tailor',
                    tujuan: 'Yth. Ibu Marine\nPemilik Butik Jahit\nDesa Nusantara Arsa',
                    perihal: 'Permohonan Kerja Part-Time Asisten Penjahit',
                    syaratLampiran: [
                        { id: 'ijazah',      label: 'Fotokopi Ijazah SMA/SMK',   wajib: true  },
                        { id: 'cv',          label: 'Curriculum Vitae (CV)',       wajib: true  },
                        { id: 'foto_3x4',    label: 'Pas Foto 3×4 (1 lembar)',    wajib: true  },
                        { id: 'portofolio',  label: 'Portofolio Karya (Opsional)', wajib: false },
                        { id: 'ktp',         label: 'Fotokopi KTP',               wajib: false }
                    ],
                    bodySurat: (nama, skills) =>
                        `Dengan hormat,\n\nSaya ${nama}, mengajukan permohonan untuk bergabung ` +
                        `sebagai **Asisten Penjahit Part-Time** di Butik Ibu Marine.\n\n` +
                        `Saya memiliki ketelitian dan kesabaran yang baik. ` +
                        `${skills ? 'Kemampuan tambahan: ' + skills + '.' : ''} ` +
                        `Saya siap belajar dari Ibu dan bekerja dengan sungguh-sungguh.\n\n` +
                        `Terima kasih atas kesempatan yang diberikan.\n\nHormat saya,\n${nama}`,
                    info: 'Jam kerja 15:00–19:00. Cocok bagi yang suka kerajinan tangan.',
                    rewardJobKey: 'parttime_jahit'
                },
                lover1boy: {
                    id: 'lover1boy',
                    nama: '🩺 Asisten Klinik — Dr. Budi',
                    posisi: 'Asisten Administrasi Klinik (Part-Time)',
                    npcId: 'lover1boy',
                    tujuan: 'Yth. Dr. Budi\nDokter Kepala Balai Pengobatan\nDesa Nusantara Arsa',
                    perihal: 'Permohonan Kerja Part-Time Asisten Administrasi Klinik',
                    syaratLampiran: [
                        { id: 'ijazah',       label: 'Fotokopi Ijazah SMA/SMK',     wajib: true  },
                        { id: 'cv',           label: 'Curriculum Vitae (CV)',         wajib: true  },
                        { id: 'foto_3x4',     label: 'Pas Foto 3×4 (2 lembar)',      wajib: true  },
                        { id: 'ktp',          label: 'Fotokopi KTP',                 wajib: true  },
                        { id: 'surat_sehat',  label: 'Surat Keterangan Sehat',       wajib: true  },
                        { id: 'sertifikat',   label: 'Sertifikat P3K / Kesehatan',   wajib: false }
                    ],
                    bodySurat: (nama, skills) =>
                        `Dengan hormat,\n\nSaya ${nama}, mengajukan diri untuk posisi ` +
                        `**Asisten Administrasi Klinik (Part-Time)** di Balai Pengobatan ` +
                        `yang Dokter pimpin.\n\n` +
                        `Saya memiliki kepedulian tinggi terhadap kesehatan masyarakat ` +
                        `dan kemampuan administrasi yang baik. ` +
                        `${skills ? skills + '. ' : ''}` +
                        `Saya siap bekerja dengan profesional dan menjaga privasi pasien.\n\n` +
                        `Atas kepercayaan Dokter, saya haturkan terima kasih.\n\nHormat saya,\n${nama}`,
                    info: 'Jam kerja 15:00–19:00. Butuh Surat Sehat. Upah tertinggi di antara part-time.',
                    rewardJobKey: 'parttime_klinik'
                }
            };

            // --- STATE MINIGAME LAMARAN ---
            let lamaranState = {
                step: 1,           // 1=pilih lowongan, 2=isi surat, 3=lampiran, 4=preview/cetak
                targetId: null,    // ID lowongan yang dipilih
                namaPerlamar: '',
                keahlian: '',
                alasan: '',
                lampiran: {},      // { ijazah: true, cv: false, ... }
                hasilAmplop: null  // item ID amplop yang dihasilkan
            };

            // --- BUKA MINIGAME DARI MEJA BELAJAR ---
            function openLamaranMinigame(targetJobId) {
                lamaranState = { step: 1, targetId: targetJobId || null, namaPerlamar: STATE.player.name || 'Pemain', keahlian: '', alasan: '', lampiran: {}, hasilAmplop: null, susunProgress: 0, susunSelected: [], susunShuffled: null, susunFeedback: '' };
                const el = document.getElementById('lamaran-minigame');
                el.style.display = 'flex';
                // FIX SCROLL HP: aktifkan touch scroll saat modal terbuka
                el.style.touchAction = 'pan-y';
                el.style.overscrollBehavior = 'contain';
                el.scrollTop = 0;
                STATE.screen = 'minigame';
                renderLamaranStep();
            }

            function closeLamaranMinigame() {
                document.getElementById('lamaran-minigame').style.display = 'none';
                STATE.screen = 'play';
                lamaranState = { step: 1, targetId: null, namaPerlamar: '', keahlian: '', alasan: '', lampiran: {}, hasilAmplop: null, susunProgress: 0, susunSelected: [], susunShuffled: null, susunFeedback: '' };
            }

            function renderLamaranStep() {
                const box = document.getElementById('lamaran-box-inner');
                const step = lamaranState.step;

                const progressHTML = [1,2,3,4,5].map(s => {
                    const cls = s < step ? 'done' : s === step ? 'active' : 'inactive';
                    const icons = ['','📋','✍️','🧩','📎','📨'];
                    return `<div class="lamaran-step-dot ${cls}" title="Langkah ${s}">${icons[s]}</div>`;
                }).join('');

                const headerHTML = `
                    <div class="lamaran-header">📝 BUAT SURAT LAMARAN KERJA</div>
                    <div class="lamaran-progress">${progressHTML}</div>
                    <div class="lamaran-step-badge">Langkah ${step} dari 5</div>
                `;

                if (step === 1) renderStep1(box, headerHTML);
                else if (step === 2) renderStep2(box, headerHTML);
                else if (step === 3) renderStep3(box, headerHTML);
                else if (step === 4) renderStep4(box, headerHTML);
                else if (step === 5) renderStep5(box, headerHTML);
            }

            // STEP 1 — Pilih Lowongan
            function renderStep1(box, header) {
                const p = STATE.player;
                const cards = Object.values(LOWONGAN_DB).map(job => {
                    const isSelected = lamaranState.targetId === job.id;
                    // Cek apakah sudah punya amplop untuk lowongan ini
                    const amplopId = 'amplop_' + job.id;
                    const sudahPunya = (p.inventory[amplopId] || 0) > 0;
                    const metReqs = job.syaratLampiran.filter(s => s.wajib).every(s => (p.inventory[s.id] || 0) > 0);
                    return `
                    <div class="lowongan-card ${isSelected ? 'selected' : ''}" onclick="lamaranState.targetId='${job.id}'; renderLamaranStep();">
                        <h5>${job.nama}</h5>
                        <div class="req-list">
                            <b>Posisi:</b> ${job.posisi}<br>
                            <b>Info:</b> ${job.info}<br>
                            <b>Dokumen Wajib:</b> ${job.syaratLampiran.filter(s=>s.wajib).map(s=>`<span class="req-badge ${(p.inventory[s.id]||0)>0?'met':'unmet'}">${s.label}</span>`).join('')}
                            ${sudahPunya ? '<br><span style="color:#16a34a;font-weight:700;">✅ Amplop sudah dibuat!</span>' : ''}
                        </div>
                    </div>`;
                }).join('');

                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>📋 Pilih Lowongan Pekerjaan</h4>
                        <p style="font-size:11px;color:#78350f;margin:0 0 8px 0;">Pilih satu lowongan untuk membuat surat lamaran. Setiap lowongan membutuhkan dokumen berbeda!</p>
                        ${cards}
                    </div>
                    <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin-top:6px;">
                        💡 <b>Tips:</b> Cek dulu dokumen wajib yang kamu miliki (hijau = sudah ada, merah = belum).<br>
                        Dokumen seperti ijazah, CV, dan KTP harus ada di tas (inventory) sebelum bisa dilampirkan!
                    </div>
                    <button class="lamaran-btn" onclick="goLamaranStep2()" ${lamaranState.targetId ? '' : 'disabled style="opacity:0.5"'}>
                        Lanjut: Tulis Surat →
                    </button>
                    <button class="lamaran-btn-sec" onclick="closeLamaranMinigame()">Batal / Keluar</button>
                `;
            }

            function goLamaranStep2() {
                if (!lamaranState.targetId) return;
                lamaranState.step = 2;
                renderLamaranStep();
            }

            // STEP 2 — Isi Badan Surat
            function renderStep2(box, header) {
                const job = LOWONGAN_DB[lamaranState.targetId];
                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>✍️ Isi Identitas Pelamar</h4>
                        <div class="lamaran-field">
                            <label>Nama Lengkap *</label>
                            <input type="text" id="lm-nama" maxlength="30" placeholder="Nama lengkapmu..." value="${lamaranState.namaPerlamar}" oninput="lamaranState.namaPerlamar=this.value">
                        </div>
                        <div class="lamaran-field">
                            <label>Keahlian / Pengalaman</label>
                            <input type="text" id="lm-skill" maxlength="60" placeholder="Contoh: bisa komputer, pernah magang, dll" value="${lamaranState.keahlian}" oninput="lamaranState.keahlian=this.value">
                        </div>
                        <div class="lamaran-field">
                            <label>Alasan Melamar *</label>
                            <textarea id="lm-alasan" maxlength="120" placeholder="Mengapa kamu melamar di tempat ini?" oninput="lamaranState.alasan=this.value">${lamaranState.alasan}</textarea>
                        </div>
                    </div>
                    <div class="lamaran-section">
                        <h4>📌 Ditujukan Kepada</h4>
                        <div style="font-size:11px;color:#78350f;white-space:pre-wrap;line-height:1.6;">${job.tujuan}</div>
                        <div style="font-size:11px;margin-top:6px;"><b>Perihal:</b> ${job.perihal}</div>
                    </div>
                    <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin-top:6px;">
                        💡 <b>Tips Menulis Surat Lamaran:</b><br>
                        • Gunakan bahasa formal dan sopan<br>
                        • Sebutkan posisi yang dilamar dengan jelas<br>
                        • Jelaskan kemampuan yang relevan dengan pekerjaan<br>
                        • Tuliskan alasan yang tulus dan spesifik
                    </div>
                    <button class="lamaran-btn" onclick="goLamaranStep3()">Lanjut: Susun Kalimat Surat →</button>
                    <button class="lamaran-btn-sec" onclick="lamaranState.step=1;renderLamaranStep()">← Kembali</button>
                `;
            }

            function goLamaranStep3() {
                if (!lamaranState.namaPerlamar.trim()) { showToast('Nama tidak boleh kosong!'); return; }
                if (!lamaranState.alasan.trim()) { showToast('Alasan melamar tidak boleh kosong!'); return; }
                lamaranState.step = 3;
                lamaranState.susunSelesai = false;
                lamaranState.susunSelected = [];
                renderLamaranStep();
            }

            // STEP 3 — Susun Kalimat Surat Lamaran

            // Data susun kalimat per level kesulitan
            const SUSUN_SOAL = [
                {
                    soal: ['Dengan', 'hormat,', 'saya', 'bermaksud', 'melamar', 'pekerjaan', 'di', 'perusahaan', 'Bapak/Ibu.'],
                    jawaban: 'Dengan hormat, saya bermaksud melamar pekerjaan di perusahaan Bapak/Ibu.',
                    hint: '💡 Kalimat pembuka surat lamaran yang formal dan sopan.'
                },
                {
                    soal: ['Saya', 'memiliki', 'kemampuan', 'yang', 'sesuai', 'dengan', 'persyaratan', 'yang', 'Bapak/Ibu', 'butuhkan.'],
                    jawaban: 'Saya memiliki kemampuan yang sesuai dengan persyaratan yang Bapak/Ibu butuhkan.',
                    hint: '💡 Kalimat yang menunjukkan kesesuaian kemampuan dengan kebutuhan perusahaan.'
                },
                {
                    soal: ['Besar', 'harapan', 'saya', 'untuk', 'dapat', 'bergabung', 'dan', 'berkontribusi', 'di', 'perusahaan', 'ini.'],
                    jawaban: 'Besar harapan saya untuk dapat bergabung dan berkontribusi di perusahaan ini.',
                    hint: '💡 Kalimat penutup yang menunjukkan antusiasme dan motivasi.'
                }
            ];

            let susunCurrentSoal = 0;

            function renderStep3(box, header) {
                const totalSoal = SUSUN_SOAL.length;
                const soalIdx = lamaranState.susunProgress || 0;

                if (soalIdx >= totalSoal) {
                    // Semua soal selesai
                    box.innerHTML = header + `
                        <div class="lamaran-section" style="text-align:center;">
                            <h4>🎉 Susun Kalimat Selesai!</h4>
                            <div style="font-size:36px;margin:10px 0;">✅</div>
                            <p style="font-size:12px;color:#16a34a;font-weight:700;">Kamu berhasil menyusun semua kalimat surat lamaran dengan benar!</p>
                            <p style="font-size:11px;color:#78350f;">Kalimat yang runtut dan sopan membuat surat lamaranmu lebih profesional dan mudah diterima HRD.</p>
                        </div>
                        <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin:6px 0;">
                            💡 <b>Fakta:</b> Surat lamaran yang terstruktur dengan baik meningkatkan peluang dipanggil interview hingga 3x lipat!
                        </div>
                        <button class="lamaran-btn" onclick="goLamaranStep4()">Lanjut: Lampirkan Dokumen →</button>
                        <button class="lamaran-btn-sec" onclick="lamaranState.step=2;renderLamaranStep()">← Kembali</button>
                    `;
                    return;
                }

                const soal = SUSUN_SOAL[soalIdx];
                if (!lamaranState.susunSelected) lamaranState.susunSelected = [];

                // Acak kata-kata
                if (!lamaranState.susunShuffled || lamaranState.susunShuffledIdx !== soalIdx) {
                    lamaranState.susunShuffled = [...soal.soal].sort(() => Math.random() - 0.5);
                    lamaranState.susunShuffledIdx = soalIdx;
                    lamaranState.susunSelected = [];
                    lamaranState.susunFeedback = '';
                }

                const selected = lamaranState.susunSelected || [];
                const usedSet = new Set(selected.map((w,i) => i + '_' + w));

                // Build result area
                const resultChips = selected.map((w, i) => 
                    `<span class="susun-chip" onclick="susunRemoveWord(${i})">×${w}</span>`
                ).join(' ');

                // Build word pool
                let tempUsed = [...selected];
                const wordChips = lamaranState.susunShuffled.map((w, i) => {
                    const idx = tempUsed.indexOf(w);
                    let isUsed = false;
                    if (idx !== -1) { tempUsed.splice(idx, 1); isUsed = true; }
                    return `<span class="susun-word-chip ${isUsed ? 'used' : ''}" onclick="susunAddWord('${w.replace(/'/g, "\\'")}', ${i})">${w}</span>`;
                }).join('');

                const feedbackHtml = lamaranState.susunFeedback ? 
                    `<div class="susun-feedback" style="background:${lamaranState.susunFeedback.ok ? '#dcfce7;color:#166534' : '#fee2e2;color:#991b1b'}">${lamaranState.susunFeedback.msg}</div>` : '';

                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>🧩 Susun Kalimat Surat Lamaran — Soal ${soalIdx + 1} dari ${totalSoal}</h4>
                        <p style="font-size:11px;color:#78350f;margin:0 0 8px 0;">
                            Ketuk kata-kata di bawah untuk menyusun kalimat yang benar dan sopan!<br>
                            Ketuk kata di kalimat (atas) untuk menghapusnya.
                        </p>
                        <div style="font-size:11px;font-weight:700;color:#78350f;margin-bottom:4px;">✍️ Kalimatmu:</div>
                        <div class="susun-result-area" style="${selected.length === 0 ? 'color:#aaa;font-size:11px;font-weight:400;' : ''}">
                            ${selected.length === 0 ? 'Ketuk kata di bawah untuk mulai menyusun...' : resultChips}
                        </div>
                        <div style="font-size:11px;font-weight:700;color:#78350f;margin:8px 0 4px 0;">📦 Kata-kata tersedia:</div>
                        <div class="susun-word-pool">${wordChips}</div>
                        ${feedbackHtml}
                        <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:6px;margin-top:6px;">${soal.hint}</div>
                    </div>
                    <button class="lamaran-btn" onclick="susunCekJawaban()">✅ Cek Jawaban</button>
                    <button class="lamaran-btn-sec" onclick="susunReset()">🔄 Susun Ulang</button>
                    <button class="lamaran-btn-sec" onclick="lamaranState.step=2;renderLamaranStep()">← Kembali</button>
                `;
            }

            function susunAddWord(word, poolIdx) {
                if (!lamaranState.susunSelected) lamaranState.susunSelected = [];
                lamaranState.susunSelected.push(word);
                lamaranState.susunFeedback = '';
                renderLamaranStep();
            }

            function susunRemoveWord(selectedIdx) {
                if (!lamaranState.susunSelected) return;
                lamaranState.susunSelected.splice(selectedIdx, 1);
                lamaranState.susunFeedback = '';
                renderLamaranStep();
            }

            function susunReset() {
                lamaranState.susunSelected = [];
                lamaranState.susunShuffled = null;
                lamaranState.susunFeedback = '';
                renderLamaranStep();
            }

            function susunCekJawaban() {
                const soalIdx = lamaranState.susunProgress || 0;
                const soal = SUSUN_SOAL[soalIdx];
                const selected = lamaranState.susunSelected || [];
                const jawabanUser = selected.join(' ');
                if (jawabanUser === soal.jawaban) {
                    lamaranState.susunFeedback = { ok: true, msg: '🎉 Benar! Kalimat sudah tepat dan sopan!' };
                    lamaranState.susunProgress = soalIdx + 1;
                    gainExp(5);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    renderLamaranStep();
                } else if (selected.length === 0) {
                    showToast('Susun kalimatnya dulu!');
                } else {
                    lamaranState.susunFeedback = { ok: false, msg: '❌ Belum tepat. Perhatikan urutan dan tanda baca! Coba lagi.' };
                    renderLamaranStep();
                }
            }

            function goLamaranStep4() {
                lamaranState.step = 4;
                renderLamaranStep();
            }

            // STEP 4 — Lampiran Dokumen
            function renderStep4(box, header) {
                const job = LOWONGAN_DB[lamaranState.targetId];
                const p = STATE.player;

                const checkItems = job.syaratLampiran.map(syarat => {
                    const dimiliki = (p.inventory[syarat.id] || 0) > 0;
                    const checked = lamaranState.lampiran[syarat.id] || false;
                    const isMissing = syarat.wajib && !dimiliki;
                    return `
                    <div class="lamaran-checkbox-row ${isMissing && checked ? 'missing' : ''} ${syarat.wajib ? 'required' : ''}">
                        <input type="checkbox" id="cb_${syarat.id}"
                            ${checked ? 'checked' : ''}
                            ${!dimiliki ? 'disabled' : ''}
                            onchange="lamaranState.lampiran['${syarat.id}']=this.checked; renderLamaranStep();">
                        <span>${syarat.label}${syarat.wajib ? '' : ' (Opsional)'}
                            ${dimiliki ? ' <span style="color:#16a34a;">✅ Ada di tas</span>' : ' <span style="color:#dc2626;">❌ Belum ada</span>'}
                        </span>
                    </div>`;
                }).join('');

                // Cek dokumen wajib sudah semua dicentang
                const wajibOk = job.syaratLampiran
                    .filter(s => s.wajib)
                    .every(s => lamaranState.lampiran[s.id] && (p.inventory[s.id] || 0) > 0);

                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>📎 Lampiran Dokumen</h4>
                        <p style="font-size:11px;color:#78350f;margin:0 0 8px 0;">
                            Centang dokumen yang akan kamu lampirkan. Dokumen bertanda * <b>wajib</b> disertakan!
                        </p>
                        ${checkItems}
                    </div>
                    <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin:6px 0;">
                        💡 <b>Cara mendapatkan dokumen:</b><br>
                        📄 <b>Ijazah</b> → Otomatis dimiliki setelah lulus sekolah<br>
                        📋 <b>CV</b> → Buat di Meja Belajar (menu "Buat CV")<br>
                        🪪 <b>KTP</b> → Beli di Kantor Kelurahan / Merchant<br>
                        📸 <b>Foto 3×4</b> → Beli di Merchant (item "Pas Foto")<br>
                        🏥 <b>Surat Sehat</b> → Minta ke Dr. Budi di Klinik<br>
                        📜 <b>SKCK</b> → Minta ke Pak Satpam / Kantor Desa
                    </div>
                    ${!wajibOk ? '<div style="background:#fee2e2;border-radius:8px;padding:8px;font-size:11px;color:#dc2626;margin:4px 0;">⚠️ Masih ada dokumen WAJIB yang belum dilampirkan atau belum ada di tas!</div>' : ''}
                    <button class="lamaran-btn" onclick="goLamaranStep5()" ${wajibOk ? '' : 'disabled style="opacity:0.5"'}>
                        Lanjut: Preview & Cetak Amplop →
                    </button>
                    <button class="lamaran-btn-sec" onclick="lamaranState.step=2;renderLamaranStep()">← Kembali</button>
                `;
            }

            // STEP 5 — Preview & Cetak Amplop
            function goLamaranStep5() {
                const job = LOWONGAN_DB[lamaranState.targetId];
                const p = STATE.player;
                const wajibOk = job.syaratLampiran.filter(s => s.wajib).every(s => lamaranState.lampiran[s.id] && (p.inventory[s.id] || 0) > 0);
                if (!wajibOk) { showToast('Lengkapi dokumen wajib dulu!'); return; }
                lamaranState.step = 5;
                renderLamaranStep();
            }

            function renderStep5(box, header) {
                const job = LOWONGAN_DB[lamaranState.targetId];
                const nama = lamaranState.namaPerlamar || STATE.player.name || 'Pemain';
                const suratBody = job.bodySurat(nama, lamaranState.keahlian);
                const lampiranList = job.syaratLampiran
                    .filter(s => lamaranState.lampiran[s.id])
                    .map(s => `  • ${s.label}`)
                    .join('\n');

                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>📄 Preview Surat Lamaran</h4>
                        <div class="lamaran-preview">${suratBody.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')}</div>
                    </div>
                    <div class="lamaran-section">
                        <h4>📎 Lampiran yang Disertakan</h4>
                        <div style="font-size:11px;white-space:pre-wrap;color:#78350f;">${lampiranList || '(Tidak ada)'}</div>
                    </div>
                    <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin:6px 0;">
                        💡 <b>Ingat!</b> Amplop lamaran ini hanya berlaku untuk:<br>
                        <b>${job.nama}</b><br>
                        Jika diberikan ke tempat lain, lamaran akan <b>ditolak</b>!
                    </div>
                    <div class="lamaran-envelope">📨</div>
                    <button class="lamaran-btn" onclick="cetakAmplop()">
                        ✅ Cetak & Masukkan ke Tas!
                    </button>
                    <button class="lamaran-btn-sec" onclick="lamaranState.step=4;renderLamaranStep()">← Kembali Edit</button>
                    <button class="lamaran-btn-sec" onclick="closeLamaranMinigame()">Batal</button>
                `;
            }

            function cetakAmplop() {
                const job = LOWONGAN_DB[lamaranState.targetId];
                const p = STATE.player;
                const amplopId = 'amplop_' + job.id;

                // Kurangi dokumen wajib dari inventory (digunakan)
                job.syaratLampiran.forEach(s => {
                    if (lamaranState.lampiran[s.id] && (p.inventory[s.id] || 0) > 0) {
                        p.inventory[s.id]--;
                        if (p.inventory[s.id] <= 0) delete p.inventory[s.id];
                    }
                });

                // Tambah amplop ke inventory
                addItem(amplopId, 1);
                gainExp(20);

                // Simpan metadata amplop
                if (!p.amplopMeta) p.amplopMeta = {};
                p.amplopMeta[amplopId] = {
                    targetNpcId: job.npcId,
                    targetNama: job.nama,
                    pelamar: lamaranState.namaPerlamar,
                    rewardJobKey: job.rewardJobKey,
                    lampiran: { ...lamaranState.lampiran }
                };

                closeLamaranMinigame();
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                showToast(`📨 Amplop lamaran "${job.posisi}" masuk ke tas!`);
                setTimeout(() => {
                    showDialogue('📨 AMPLOP LAMARAN SELESAI!',
                        `Surat lamaranmu untuk **${job.nama}** sudah selesai dan masuk ke tas!\n\n` +
                        `📌 SELANJUTNYA:\nBawa amplop ini langsung ke lokasi kerja dan serahkan ke bos/pemiliknya.\n\n` +
                        `⚠️ Jika kamu memberikan amplop ini ke tempat yang salah, lamaran akan DITOLAK.\n\n` +
                        `💡 Cek tas (inventory) kamu — amplop ada di sana sebagai item 📨`,
                        [{ text: 'Siap! Aku akan melamar!', action: closeDialogue }], 'images/buku.png'
                    );
                }, 400);
            }

            // --- CEK AMPLOP SAAT MELAMAR KE NPC ---
            function submitAmplop(npcId) {
                const p = STATE.player;
                if (!p.amplopMeta) p.amplopMeta = {};

                // Cari amplop yang dimiliki player
                const amplopKeys = Object.keys(p.inventory).filter(k => k.startsWith('amplop_') && (p.inventory[k] || 0) > 0);

                if (amplopKeys.length === 0) {
                    showDialogue('📋 TIDAK ADA LAMARAN',
                        `Kamu belum punya surat lamaran!\n\n` +
                        `Buat dulu di **Meja Belajar** di rumahmu:\n` +
                        `1. Dekati meja belajar\n2. Pilih "📝 Buat Surat Lamaran"\n3. Isi dan lengkapi dokumen\n4. Cetak amplop\n5. Bawa ke sini!\n\n` +
                        `💡 Dokumen yang perlu disiapkan:\n• Ijazah SMA/SMK\n• CV\n• Pas Foto 3×4\n• KTP`,
                        [{ text: 'Mengerti, aku siapkan dulu', action: closeDialogue }], 'images/buku.png'
                    );
                    return;
                }

                // Cari amplop yang match dengan NPC ini
                const matchAmplop = amplopKeys.find(k => {
                    const meta = p.amplopMeta[k];
                    return meta && meta.targetNpcId === npcId;
                });

                if (matchAmplop) {
                    // AMPLOP YANG TEPAT!
                    const meta = p.amplopMeta[matchAmplop];
                    p.inventory[matchAmplop]--;
                    if (p.inventory[matchAmplop] <= 0) delete p.inventory[matchAmplop];

                    // Tentukan reward berdasarkan jenis pekerjaan
                    const isPartTime = meta.rewardJobKey && meta.rewardJobKey.startsWith('parttime_');
                    if (isPartTime) {
                        // Part-time: langsung terima & simpan
                        const ptKey = meta.rewardJobKey.replace('parttime_', '');
                        p.partTimeJob = ptKey === 'bengkel' ? 'bengkel' : ptKey === 'jahit' ? 'penjahit' : 'klinik';
                        p.partTimeStatus = 'working';
                        p.partTimeShiftStarted = false;
                        gainExp(30);
                        closeDialogue();
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        setTimeout(() => {
                            showDialogue('🎉 LAMARAN DITERIMA!',
                                `Selamat! Lamaranmu diterima dengan dokumen yang lengkap dan surat yang rapi!\n\n` +
                                `💼 Posisi: ${meta.targetNama}\n⏰ Jam Kerja: 15:00–19:00\n\n` +
                                `Mulai besok, datanglah ke sini sebelum jam 17:00 untuk absen masuk.\n\n` +
                                `💡 Memiliki surat lamaran yang baik meningkatkan peluang diterima kerja secara signifikan di dunia nyata.`,
                                [{ text: 'Terima kasih! Aku semangat!', action: closeDialogue }],
                                (SPOUSE_IMG[npcId] || 'images/boy.png')
                            );
                        }, 300);
                    } else {
                        // Kerja full-time di Merchant
                        p.jobStatus = 'employed';
                        p.bossReputation = 50;
                        gainExp(50);
                        closeDialogue();
                        setTimeout(() => {
                            playCutsceneJobAccepted(() => {
                                showToast('✅ Selamat datang di dunia kerja! Datang jam 08:00 besok.');
                                if (typeof updateMentorBubble === 'function') updateMentorBubble();
                            });
                        }, 300);
                    }
                } else {
                    // Ada amplop, tapi untuk tempat lain
                    const wrongAmplop = p.amplopMeta[amplopKeys[0]];
                    const wrongTarget = wrongAmplop ? wrongAmplop.targetNama : 'tempat lain';

                    showDialogue('❌ LAMARAN SALAH TEMPAT',
                        `Maaf, surat lamaranmu tidak sesuai dengan posisi di sini!\n\n` +
                        `📨 Amplopmu ditujukan untuk:\n**${wrongTarget}**\n\n` +
                        `Tapi kamu menyerahkannya ke:\n**lokasi ini**\n\n` +
                        `❌ Lamaran DITOLAK!\n\n` +
                        `💡 Surat lamaran harus ditujukan spesifik ke tempat yang dilamar. ` +
                        `Di dunia nyata, mengirim CV ke posisi yang tidak sesuai juga akan langsung ditolak.\n\n` +
                        `📌 Bawa amplopmu ke tempat yang tepat, atau buat surat baru di Meja Belajar.`,
                        [{ text: 'Oh maaf, salah tempat...', action: closeDialogue }],
                        (SPOUSE_IMG[npcId] || 'images/boy.png')
                    );
                }
            }

            // --- TAMPILKAN MENU LAMARAN DI MEJA BELAJAR ---
            function openStudyDeskLamaranMenu() {
                const p = STATE.player;
                const amplopKeys = Object.keys(p.inventory || {}).filter(k => k.startsWith('amplop_') && (p.inventory[k] || 0) > 0);
                const amplopList = amplopKeys.map(k => {
                    const meta = p.amplopMeta && p.amplopMeta[k];
                    return meta ? `📨 ${meta.targetNama}` : `📨 ${k}`;
                }).join('\n') || 'Belum ada';

                // Cek apakah punya dokumen dasar
                const hasIjazah = (p.inventory['ijazah'] || 0) > 0;
                const hasCV     = (p.inventory['cv']     || 0) > 0;

                showDialogue('📝 BUAT SURAT LAMARAN KERJA',
                    `Di meja ini kamu bisa membuat surat lamaran kerja secara lengkap!\n\n` +
                    `📨 Amplop lamaranmu saat ini:\n${amplopList}\n\n` +
                    `📌 STATUS DOKUMEN:\n` +
                    `${hasIjazah ? '✅' : '❌'} Ijazah SMA/SMK\n` +
                    `${hasCV     ? '✅' : '❌'} Curriculum Vitae (CV)\n\n` +
                    `💡 Kamu perlu menyiapkan dokumen sebelum membuat lamaran. ` +
                    `Dokumen bisa dilihat di menu "Buat CV" atau dibeli di Merchant.`,
                    [
                        { text: '📝 Buat Surat Lamaran Baru', action: () => { closeDialogue(); openLamaranMinigame(); }},
                        { text: '📋 Buat CV Terlebih Dahulu', action: () => { closeDialogue(); openCVMaker(); }},
                        { text: '❓ Panduan Melamar Kerja', action: () => showPanduanLamaran() },
                        { text: 'Tutup', action: closeDialogue }
                    ], 'images/buku.png'
                );
            }

            function showPanduanLamaran() {
                showDialogue('📚 PANDUAN MELAMAR KERJA',
                    `🎓 DOKUMEN YANG BIASANYA DIMINTA:\n\n` +
                    `📄 Ijazah SMA/SMK — bukti pendidikan terakhir\n` +
                    `📋 CV (Curriculum Vitae) — riwayat hidup & keahlian\n` +
                    `📸 Pas Foto 3×4 — foto formal terbaru\n` +
                    `🪪 KTP — identitas resmi\n` +
                    `🏥 Surat Sehat — dari dokter/puskesmas\n` +
                    `🚔 SKCK — catatan kepolisian bersih\n` +
                    `🏆 Sertifikat — keahlian tambahan\n\n` +
                    `✍️ TIPS SURAT LAMARAN:\n` +
                    `• Tulis tangan atau ketik rapi & formal\n` +
                    `• Sebutkan posisi yang dilamar dengan jelas\n` +
                    `• Jangan salah menulis nama perusahaan!\n` +
                    `• Lampiran harus lengkap sesuai yang diminta\n\n` +
                    `⚠️ KESALAHAN UMUM:\n` +
                    `• Melamar posisi A tapi kirim ke perusahaan B\n` +
                    `• Foto tidak formal (selfie, latar tidak jelas)\n` +
                    `• Lampiran tidak lengkap`,
                    [{ text: 'Paham!', action: () => openStudyDeskLamaranMenu() }], 'images/buku.png'
                );
            }

            function openCVMaker() {
                const p = STATE.player;
                if ((p.inventory['cv'] || 0) > 0) {
                    showToast('Kamu sudah punya CV di tas!');
                    openStudyDeskLamaranMenu();
                    return;
                }
                showDialogue('📋 BUAT CURRICULUM VITAE',
                    `CV (Curriculum Vitae) adalah dokumen yang berisi:\n\n` +
                    `👤 Data Pribadi: Nama, Tempat/Tanggal Lahir, Alamat\n` +
                    `🎓 Riwayat Pendidikan: Nama sekolah & tahun lulus\n` +
                    `💼 Pengalaman Kerja: (jika ada)\n` +
                    `🛠️ Keahlian: Skill yang dikuasai\n` +
                    `🏆 Prestasi: Penghargaan / sertifikat\n\n` +
                    `Biaya membuat CV: 500 G (biaya fotokopi & cetak)\n` +
                    `Uangmu: ${p.money.toLocaleString()} G`,
                    [
                        { text: '✅ Buat CV Sekarang (500 G)', action: () => {
                            if (p.money >= 500) {
                                p.money -= 500;
                                addItem('cv', 1);
                                p.int = (p.int || 0) + 1;
                                closeDialogue();
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                showToast('📋 CV berhasil dibuat! INT +1. CV masuk ke tas.');
                            } else {
                                showToast('Uang tidak cukup! Butuh 500 G.');
                            }
                        }},
                        { text: 'Kembali', action: () => openStudyDeskLamaranMenu() }
                    ], 'images/buku.png'
                );
            }

            function openDocumentShop(npc) {
                const p = STATE.player;
                const imgSrc = npc ? npc.imgSrc : 'images/job.png';
                const docs = [
                    { id: 'foto_3x4', name: '📸 Pas Foto 3×4 (2 lembar)', price: 300 },
                    { id: 'ktp',      name: '🪪 Fotokopi KTP',             price: 500 },
                    { id: 'skck',     name: '🚔 SKCK (Surat Kelakuan Baik)',price: 2000 },
                    { id: 'sertifikat',name:'🏆 Sertifikat Keahlian Umum', price: 5000 },
                ];
                const opts = docs.map(d => ({
                    text: `${d.name} — ${d.price.toLocaleString()} G`,
                    action: () => {
                        if (p.money >= d.price) {
                            p.money -= d.price;
                            addItem(d.id, 1);
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            showToast(`✅ ${d.name.replace(/^[^\s]+\s/,'')} masuk ke tas!`);
                            openDocumentShop(npc);
                        } else {
                            showToast(`Uang tidak cukup! Butuh ${d.price.toLocaleString()} G`);
                        }
                    }
                }));
                opts.push({ text: 'Kembali', action: () => npc ? interactNPC(npc) : closeDialogue() });

                showDialogue('🪪 TOKO DOKUMEN',
                    `📋 Beli dokumen untuk keperluan lamaran kerja.\nUangmu: ${p.money.toLocaleString()} G\n\n💡 Dokumen ini diperlukan saat membuat surat lamaran di Meja Belajar.`,
                    opts, imgSrc
                );
            }


