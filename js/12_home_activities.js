// ========================================================
// js/12_home_activities.js
// Menu Aktivitas Rumah Tangga
// ========================================================

            // ═══════════════════════════════════════════════════════════════
            // MENU AKTIVITAS RUMAH TANGGA — Believable & Kontekstual
            // Dipanggil dari: pagi otomatis, papan 🧹, kasur, meja jurnal
            // ═══════════════════════════════════════════════════════════════
            function showDailyHousekeepingMenu() {
                const p       = STATE.player;
                const pImg    = p.gender === 'boy' ? 'images/boy.png' : 'images/girl.png';
                const chores  = p.dailyChores || {};
                const hl      = p.houseLevel || 1;          // rumah level
                const married = !!(p.married && p.spouseId);
                const spouseOut = p.spouseWorkStatus === 'working';
                const hasFarm = p.farming && Object.values(p.farming).some(c => c && c.type);
                const hasKitchen = hl >= 3;   // dapur baru ada di rumah Lv.3+
                const hasGarden  = hl >= 2;   // halaman kecil mulai Lv.2

                // ── Greeting kontekstual ──
                const done   = [chores.cleaning, chores.cooking, chores.laundry, chores.garden || !hasFarm].filter(Boolean).length;
                const total  = [true, hasKitchen, true, hasFarm].filter(Boolean).length;
                let greeting = spouseOut && married
                    ? `Suami/Istri sudah berangkat kerja.\nApa yang mau dikerjakan sekarang?`
                    : `Ada waktu luang. Mau ngapain?`;
                greeting += `\n\n📋 Progress hari ini: ${done}/${total} selesai\n`;
                greeting += `${chores.cleaning ? '✅' : '⬜'} Bersih-bersih\n`;
                if (hasKitchen) greeting += `${chores.cooking  ? '✅' : '⬜'} Masak\n`;
                else            greeting += `🔒 Masak (butuh dapur — Lv.3)\n`;
                greeting += `${chores.laundry  ? '✅' : '⬜'} Cuci baju\n`;
                if (hasFarm)    greeting += `${chores.garden   ? '✅' : '⬜'} Siram tanaman`;

                const opts = [];

                // ════════════════════════════════════
                //  🧹 BERSIH-BERSIH — selalu tersedia
                // ════════════════════════════════════
                if (!chores.cleaning) {
                    opts.push({
                        text: '🧹 Bersih-bersih Rumah (Energi -25)',
                        action: () => {
                            if (p.energy < 25) {
                                showDialogue('😓 TERLALU LELAH',
                                    'Badanmu terlalu lelah untuk beres-beres sekarang.\n\nIstirahat sebentar atau makan dulu biar pulih.',
                                    [{ text: 'Oke...', action: closeDialogue }], pImg);
                                return;
                            }
                            p.energy -= 25;
                            if (!p.dailyChores) p.dailyChores = {};
                            p.dailyChores.cleaning = true;
                            p.reputation = (p.reputation||0) + 2;
                            p.ethics = Math.min(100, (p.ethics||0) + 1);
                            createParticle(p.x, p.y, '#ffffff');
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            const narasi = [
                                'Lantai disapu sampai bersih, debu dilap, bantal dirapikan.\n\nRumah kinclong! Rasanya puas banget. ✨\n\n📈 REP+2 | Ethics+1',
                                'Semua sudut dibersihkan. Jendela dilap hingga bening.\n\nPasangan pasti senang pulang ke rumah yang rapi. ✨\n\n📈 REP+2 | Ethics+1',
                                'Kamar mandi disikat, lantai dipel sampai ngkilap.\n\nCapek, tapi puas — ini namanya tanggung jawab. ✨\n\n📈 REP+2 | Ethics+1',
                            ];
                            showDialogue('✨ BERES-BERES SELESAI!',
                                narasi[Math.floor(Math.random()*narasi.length)],
                                [{ text: 'Alhamdulillah~', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}],
                                pImg);
                        }
                    });
                } else {
                    opts.push({ text: '✅ Rumah sudah bersih hari ini',
                        action: () => showToast('Rumah sudah rapi! Kerja bagus.') });
                }

                // ════════════════════════════════════════════════════════
                //  🍳 MASAK — hanya jika rumah Lv.3+ (ada dapur)
                //  Jika belum ada dapur → alternatif: beli makanan jadi
                // ════════════════════════════════════════════════════════
                if (hasKitchen) {
                    if (!chores.cooking) {
                        opts.push({
                            text: '🍳 Masak untuk Keluarga (Energi -20)',
                            action: () => {
                                if (p.energy < 20) {
                                    showDialogue('😓 TERLALU LELAH', 'Energi kurang untuk memasak.\n\nMakan camilan dulu atau istirahat sebentar.',
                                        [{ text: 'Oke', action: closeDialogue }], pImg);
                                    return;
                                }
                                // Sub-menu pilihan masakan berdasarkan level rumah & bahan
                                const hasIkan  = (p.inventory?.['ikan_segar'] || 0) > 0;
                                const hasTelor = (p.inventory?.['telor'] || 0) > 0;
                                const subOpts  = [];

                                // Nasi goreng — selalu bisa (bahan dapur standar)
                                subOpts.push({
                                    text: '🍳 Nasi Goreng (bahan dapur standar)',
                                    action: () => {
                                        p.energy -= 20;
                                        if (!p.dailyChores) p.dailyChores = {};
                                        p.dailyChores.cooking = true;
                                        p.reputation = (p.reputation||0) + 2;
                                        p.energy = Math.min(100, p.energy + 8);
                                        if (married && p.spouseId) updateRelationship({ id: p.spouseId }, 2, 'Masak untuk Pasangan');
                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                        showDialogue('🍳 NASI GORENG SIAP!',
                                            'Bumbunya harum, nasinya pulen.\n\nKamu bungkus sebagian untuk pasangan, sisanya makan siang sendiri.\n\n❤️ Pasangan pulang ke rumah yang ada masakan hangat.\n\nREP+2 | Hubungan+2',
                                            [{ text: 'Enak!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                    }
                                });

                                // Telor ceplok — jika ada telor di inventory
                                if (hasTelor) {
                                    subOpts.push({
                                        text: '🍳 Telor Ceplok + Nasi (pakai telor)',
                                        action: () => {
                                            p.energy -= 15;
                                            p.inventory['telor'] = Math.max(0, (p.inventory['telor']||0) - 1);
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true;
                                            p.reputation = (p.reputation||0) + 2;
                                            showDialogue('🍳 TELOR CEPLOK SIAP!',
                                                'Simpel tapi bergizi. Telor ceplok gurih dengan nasi putih hangat.\n\n-1 Telor | REP+2',
                                                [{ text: 'Yum!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                        }
                                    });
                                }

                                // Ikan goreng — jika ada ikan di inventory
                                if (hasIkan) {
                                    subOpts.push({
                                        text: '🐟 Ikan Goreng + Sayur (pakai ikan segar)',
                                        action: () => {
                                            p.energy -= 20;
                                            p.inventory['ikan_segar'] = Math.max(0, (p.inventory['ikan_segar']||0) - 1);
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true;
                                            p.reputation = (p.reputation||0) + 3;
                                            p.energy = Math.min(100, p.energy + 12);
                                            if (married && p.spouseId) updateRelationship({ id: p.spouseId }, 3, 'Masak Ikan Segar');
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                            showDialogue('🐟 IKAN GORENG SIAP!',
                                                'Ikan segar digoreng garing, lalapan timun segar di samping.\n\nMakanan bergizi untuk keluarga sehat! 🌿\n\n-1 Ikan Segar | REP+3 | Hubungan+3',
                                                [{ text: 'Mantap!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                        }
                                    });
                                }

                                // Sayur lodeh — mulai Lv.4
                                if (hl >= 4) {
                                    subOpts.push({
                                        text: '🍲 Sayur Lodeh Spesial (Rumah Lv.4)',
                                        action: () => {
                                            p.energy -= 25;
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true;
                                            p.reputation = (p.reputation||0) + 4;
                                            if (married && p.spouseId) updateRelationship({ id: p.spouseId }, 5, 'Masak Spesial');
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                            showDialogue('🍲 SAYUR LODEH SIAP!',
                                                'Masakan rumahan yang bikin rindu kampung halaman.\n\nSantan gurih, sayur segar, tahu tempe. Sempurna!\n\nREP+4 | Hubungan pasangan +5',
                                                [{ text: 'Lezat sekali!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                        }
                                    });
                                }

                                // Rendang — mulai Lv.5
                                if (hl >= 5) {
                                    subOpts.push({
                                        text: '🥩 Rendang (Rumah Lv.5 — masak 2 jam)',
                                        action: () => {
                                            p.energy -= 35;
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true;
                                            p.reputation = (p.reputation||0) + 6;
                                            p.str = (p.str||0) + 1;
                                            if (married && p.spouseId) updateRelationship({ id: p.spouseId }, 8, 'Rendang Spesial');
                                            showDialogue('🥩 RENDANG SIAP!',
                                                'Rendang daging dengan bumbu rempah yang meresap sempurna.\n\nMasak 2 jam penuh tapi hasilnya luar biasa.\n\nTetangga sampai bisa cium baunya dari luar! 😄\n\nREP+6 | STR+1 | Hubungan+8',
                                                [{ text: 'Ini level sultan!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                        }
                                    });
                                }

                                subOpts.push({ text: '← Kembali', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }});
                                showDialogue('🍳 PILIH MASAKAN',
                                    `Dapur siap! Mau masak apa hari ini?\n⚡ Energimu: ${Math.floor(p.energy)}/100\n\n${hasIkan ? '🐟 Ada ikan segar di inventory!' : ''}${hasTelor ? '\n🥚 Ada telor di inventory!' : ''}`,
                                    subOpts, pImg);
                            }
                        });
                    } else {
                        opts.push({ text: '✅ Sudah masak hari ini',
                            action: () => showToast('Masakan sudah siap! Pasangan pasti senang pulang.') });
                    }
                } else {
                    // ── Belum ada dapur → alternatif believable ──
                    opts.push({
                        text: `🍱 Makan Hari Ini (Belum ada dapur — Rumah Lv.${hl})`,
                        action: () => {
                            const hasMakananJadi = (p.inventory?.['nasi_bungkus'] || 0) > 0
                                                || (p.inventory?.['gandum'] || 0) > 0;
                            if (hasMakananJadi) {
                                // Punya makanan di inventory
                                const item = (p.inventory?.['nasi_bungkus']||0) > 0 ? 'nasi_bungkus' : 'gandum';
                                const namaItem = item === 'nasi_bungkus' ? 'Nasi Bungkus' : 'Roti Gandum';
                                showDialogue('🍱 MAKAN DARI STOK',
                                    `Kamu punya ${namaItem} di tas.\n\nMakan dari bungkusan dulu — ini wajar banget untuk rumah sederhana.\n\nKalau mau masak sendiri, nabung buat upgrade rumah ke Lv.3 ya!\n\n⚡ +20 Energi`,
                                    [{
                                        text: `Makan ${namaItem}`,
                                        action: () => {
                                            p.inventory[item] = Math.max(0, (p.inventory[item]||0) - 1);
                                            p.energy = Math.min(100, p.energy + 20);
                                            p.hp = Math.min(p.maxHp||100, (p.hp||100) + 10);
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true; // tandai sudah "makan" hari ini
                                            showToast(`😋 ${namaItem} dimakan. Energi +20, HP +10`);
                                            closeDialogue();
                                        }
                                    },
                                    { text: 'Simpan dulu', action: closeDialogue }],
                                    pImg);
                            } else {
                                showDialogue('🍱 BELUM ADA DAPUR',
                                    `Rumahmu (Lv.${hl}) belum punya dapur, jadi belum bisa masak di rumah.\n\nIni wajar banget untuk awal-awal!\n\nAlternatif makan hari ini:\n🏪 Beli nasi bungkus di Merchant\n🍜 Makan di warung dekat pasar\n🐟 Mancing → makan ikan bakar di luar\n\nMau masak sendiri di rumah?\n→ Upgrade ke Rumah Lv.3 (1.500.000 G)`,
                                    [
                                        { text: '🏪 Pergi ke Merchant', action: () => { closeDialogue(); showToast('Pergi ke Merchant untuk beli makanan...'); }},
                                        { text: '← Kembali', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}
                                    ], pImg);
                            }
                        }
                    });
                }

                // ════════════════════════════════════
                //  👔 CUCI BAJU — selalu tersedia
                // ════════════════════════════════════
                if (!chores.laundry) {
                    opts.push({
                        text: '👔 Cuci & Jemur Baju (Energi -15)',
                        action: () => {
                            if (p.energy < 15) {
                                showToast('Energi kurang untuk cuci baju sekarang...');
                                return;
                            }
                            p.energy -= 15;
                            if (!p.dailyChores) p.dailyChores = {};
                            p.dailyChores.laundry = true;
                            p.reputation = (p.reputation||0) + 1;
                            const narasi = [
                                '👔 Baju dicuci dengan sabun, dibilas bersih, dijemur di bawah matahari.\n\nBau segar! Kehidupan sederhana yang penuh rasa syukur. ☀️\n\nREP+1',
                                '👔 Tumpukan baju kotor akhirnya beres!\n\nDijemur rapi di tali, angin siang bertiup semilir. ☀️\n\nREP+1',
                            ];
                            showDialogue('👔 CUCI BAJU SELESAI',
                                narasi[Math.floor(Math.random()*narasi.length)],
                                [{ text: 'Beres!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}],
                                pImg);
                        }
                    });
                } else {
                    opts.push({ text: '✅ Baju sudah dicuci hari ini',
                        action: () => showToast('Baju sudah bersih dan dijemur!') });
                }

                // ════════════════════════════════════════════════════
                //  🌱 SIRAM TANAMAN — hanya jika punya lahan aktif
                // ════════════════════════════════════════════════════
                if (hasFarm) {
                    const unwatered = Object.values(p.farming).filter(c => c && c.type && !c.watered).length;
                    if (!chores.garden) {
                        const cost = Math.max(10, unwatered * 3);
                        opts.push({
                            text: `🌱 Siram Tanaman (${unwatered} belum disiram, Energi -${cost})`,
                            action: () => {
                                if (unwatered === 0) { showToast('Semua tanaman sudah disiram hari ini!'); return; }
                                if (p.energy < cost) {
                                    showToast(`Energi kurang. Butuh ${cost} untuk siram ${unwatered} tanaman.`);
                                    return;
                                }
                                p.energy -= cost;
                                let count = 0;
                                for (const key in p.farming) {
                                    if (p.farming[key] && p.farming[key].type && !p.farming[key].watered) {
                                        p.farming[key].watered = true;
                                        count++;
                                    }
                                }
                                if (!p.dailyChores) p.dailyChores = {};
                                p.dailyChores.garden = true;
                                showDialogue('🌱 KEBUN SUDAH DISIRAM',
                                    `${count} tanaman berhasil disiram dengan penuh sayang.\n\nTanaman yang terawat = sumber penghasilan tambahan keluarga. 🌿\n\nEnergi -${cost}`,
                                    [{ text: 'Ayo tumbuh subur!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}],
                                    pImg);
                            }
                        });
                    } else {
                        opts.push({ text: '✅ Tanaman sudah disiram hari ini',
                            action: () => showToast('Kebun sudah terawat. Tinggal tunggu panen!') });
                    }
                }

                // ════════════════════════════════════════════════════
                //  💊 JAGA KESEHATAN KELUARGA — muncul jika menikah
                // ════════════════════════════════════════════════════
                if (married && !chores.health_check) {
                    opts.push({
                        text: '💊 Cek Kebutuhan Keluarga (Obat/Vitamin)',
                        action: () => {
                            const hasObat = (p.inventory?.['obat'] || p.inventory?.['tonic_kebal'] || 0) > 0;
                            if (hasObat) {
                                showDialogue('💊 STOK KESEHATAN',
                                    'Kamu punya obat/vitamin di stok.\n\nBagus! Keluarga siap hadapi hari.\n\n✅ Kesehatan keluarga terjaga.',
                                    [{ text: 'Syukurlah!', action: () => {
                                        if (!p.dailyChores) p.dailyChores = {};
                                        p.dailyChores.health_check = true;
                                        p.ethics = Math.min(100, (p.ethics||0) + 1);
                                        closeDialogue();
                                    }}], pImg);
                            } else {
                                showDialogue('💊 STOK HABIS',
                                    'Obat dan vitamin keluarga habis.\n\nPergi ke Klinik atau Merchant untuk beli sebelum ada yang sakit.\n\n💡 Sediakan selalu: Obat dasar, vitamin, plester.',
                                    [
                                        { text: '🏥 Pergi ke Klinik', action: () => { closeDialogue(); showToast('Pergi ke Klinik...'); }},
                                        { text: 'Nanti saja', action: closeDialogue }
                                    ], pImg);
                            }
                        }
                    });
                }

                // ════════════════════════════════════
                //  🛋️ SANTAI + tawari lanjut
                // ════════════════════════════════════
                opts.push({
                    text: '🛋️ Santai Sejenak (Pulihkan +15 Energi)',
                    action: () => {
                        const gain = Math.min(15, 100 - p.energy);
                        p.energy = Math.min(100, p.energy + gain);
                        const santaiTeks = [
                            `Kamu duduk di kursi favorit sambil menyeduh teh.\n\nSuasana rumah yang tenang terasa seperti hadiah kecil.\n\n⚡ +${gain} Energi`,
                            `Kamu berbaring sebentar di kasur.\n\nMata terpejam, pikiran bersih. Sungguh segar!\n\n⚡ +${gain} Energi`,
                            `Kamu membuka jendela dan menghirup udara pagi.\n\nAngin sepoi masuk, pikiran jadi jernih.\n\n⚡ +${gain} Energi`,
                            `Kamu melamun sambil memandang halaman kecil.\n\nAda kupu-kupu di tanaman. Damai sekali.\n\n⚡ +${gain} Energi`,
                        ];
                        showDialogue('🛋️ ISTIRAHAT SEJENAK',
                            santaiTeks[Math.floor(Math.random()*santaiTeks.length)],
                            [{ text: 'Ah, segar~', action: () => {
                                closeDialogue();
                                // Langsung balik ke menu setelah santai
                                setTimeout(() => showDailyHousekeepingMenu(), 300);
                            }}], pImg);
                    }
                });

                // ════════════════════════════════════
                //  😴 TIDUR SIANG — opsional
                // ════════════════════════════════════
                opts.push({
                    text: '😴 Tidur Siang (Energi +40, waktu +2 jam)',
                    action: () => {
                        showDialogue('😴 TIDUR SIANG?',
                            'Tidur siang memulihkan energi lebih banyak, tapi waktu harian berkurang 2 jam.\n\nYakin mau tidur siang sekarang?',
                            [
                                { text: '😴 Tidur siang sekarang', action: () => {
                                    p.energy = Math.min(100, p.energy + 40);
                                    STATE.time = Math.min(STATE.time + 200, 1550);
                                    showToast('😴 Tidur siang... ⚡ Energi +40. Waktu berlalu 2 jam.');
                                    closeDialogue();
                                }},
                                { text: '← Kembali', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}
                            ], pImg);
                    }
                });

                opts.push({ text: '🚪 Tutup Menu', action: closeDialogue });

                showDialogue('🏠 AKTIVITAS RUMAH TANGGA', greeting, opts, pImg);
            }

            // --- NEW: UPDATE PERGERAKAN BOT HANTU (AGAR TERLIHAT HIDUP) ---
            // --- NEW FUNCTION: CHECK AUTO TELEPORT ---
            function checkAutoTeleport() {
                // Jika sedang cooldown, jangan cek teleport (Mencegah loop masuk-keluar)
                if (STATE.teleportCooldown > 0) return;

                const map = maps[STATE.location];
                if (!map.buildings) return;

                // Titik tengah pemain
                const pCenterX = STATE.player.x + (STATE.player.w / 2);
                const pCenterY = STATE.player.y + (STATE.player.h / 2);

                // FIX: gunakan TS untuk fairyVillage agar entrance position benar
                const _epTS = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;
                const _epRadius = (STATE.location === 'fairyVillage') ? _epTS * 1.8 : 50;

                for (let b of map.buildings) {
                    // fv_building: tidak auto-teleport, cukup pakai tombol aksi (updateFVActionBtn)
                    if (b.type === 'fv_building') continue;

                    if (b.entrance) {
                        // Titik tengah entrance (Pintu)
                        const eCenterX = (b.entrance.x * _epTS) + (_epTS / 2);
                        const eCenterY = (b.entrance.y * _epTS) + (_epTS / 2);

                        // Jarak pemain ke titik tengah pintu
                        const dist = Math.hypot(pCenterX - eCenterX, pCenterY - eCenterY);

                        if (dist < _epRadius) {

                            // --- PERUBAHAN 2: Daftar Otomatis Hanya untuk KELUAR ---
                            // Saya telah MENGHAPUS bangunan masuk (seperti 'player_house', 'merchant', dll) dari sini.
                            // Jadi saat mau MASUK, fungsi ini tidak akan jalan (tombol aksi akan muncul gantinya).
                            const autoTeleporters = [
                                // HANYA DAFTAR PINTU KELUAR (EXIT)
                                'house_exit', 'pshop_exit',
                                'dungeon_exit', 'dungeon_next', // Next level dungeon tetap auto biar smooth
                                'shop_exit',
                                'library_exit',
                                'guild_exit',
                                'school_exit',
                                'smith_exit',
                                'mentor_exit',
                                'clinic_exit',
                                'wedding_exit',
                                'lover1_exit',
                                'fisherman_exit',
                                'candi_exit',
                                'ruins_exit',
                                'warnet_exit' // <--- TAMBAHKAN INI
                            ];

                            if (autoTeleporters.includes(b.id)) {
                                processTeleport(b);
                                return; // Stop checking agar tidak double trigger
                            }
                        }
                    }
                }
            }

            // --- NEW FUNCTION: CHECK BUILDING HOURS (PENGUSIRAN OTOMATIS) ---
            function checkBuildingHours() {
                // 1. Filter: Hanya jalankan jika Player berada di Indoor (Bukan Village, House, atau Dungeon)
                // List lokasi aman (tidak ada jam tutup):
                if (STATE.location === 'village' || STATE.location === 'house' || STATE.location === 'dungeon' || STATE.location === 'ruins_battle') return;

                const villageMap = maps['village'];
                if (!villageMap) return;

                // 2. Cari data bangunan berdasarkan lokasi map saat ini
                // Contoh: Jika di 'library_interior', cari bangunan yang punya entrance.map == 'library_interior'
                const building = villageMap.buildings.find(b => b.entrance && b.entrance.map === STATE.location);

                if (building) {
                    // Cek apakah bangunan memiliki jam tutup dan tidak buka 24 jam
                    if (!building.open24h && building.openTime && building.closeTime) {

                        // 3. Logika Waktu: Jika Sekarang >= Jam Tutup ATAU Sekarang < Jam Buka (Kasus begadang)
                        if (STATE.time >= building.closeTime || STATE.time < building.openTime) {
                            // ... (Logic pengusiran) ...

                            // Play SFX Pintu/Alert
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('door');

                            // Format Jam untuk Info (Misal: 800 -> "08:00")
                            const openStr = Math.floor(building.openTime / 100).toString().padStart(2, '0') + ":00";
                            const closeStr = Math.floor(building.closeTime / 100).toString().padStart(2, '0') + ":00";

                            // Tampilkan Notifikasi dengan Jam Operasional
                            showToast(`⛔ ${building.name.toUpperCase()} TUTUP! (Buka ${openStr} - ${closeStr}). Kamu diminta keluar.`);

                            // 4. Teleport Paksa ke Luar (Village)
                            STATE.location = 'village';

                            // Koordinat tujuan: Tepat di depan pintu masuk bangunan (Entrance Y + 1)
                            // Agar pemain muncul di depan pintu, bukan di dalamnya
                            STATE.player.x = building.entrance.x * TILE_SIZE;
                            STATE.player.y = (building.entrance.y + 1) * TILE_SIZE;

                            // Pastikan area spawn bersih dari NPC yang menghalangi
                            clearSpawnZone('village', building.entrance.x, building.entrance.y + 1);

                            // Set cooldown teleport agar tidak glitch masuk lagi
                            STATE.teleportCooldown = 60;

                            // --- NEW: EFEK VISUAL KEBINGUNGAN SAAT DIUSIR ---
                            spawnFloatingText(STATE.player.x + 5, STATE.player.y - 40, "❓❓❓", "#fbbf24", 16);
                            spawnFloatingText(STATE.player.x + 20, STATE.player.y - 25, "😵", "#fff", 18);
                        }
                    }
                }
            }

            // --- NEW FUNCTION: PROCESS TELEPORT (Centralized Logic) ---
            function processTeleport(b) {
                // SET COOLDOWN SETELAH TELEPORT SUKSES
                STATE.teleportCooldown = 60;

                // --- NEW: PLAY DOOR SFX ---
                if (typeof AudioService !== 'undefined') AudioService.playSFX('door');

                // 3. Eksekusi Teleportasi (LOGIKA LENGKAP DIKEMBALIKAN)

                // --- RUMAH PLAYER / TOKO PLAYER ---
                if (b.id === 'player_house') {
                    // Cek Role: Jika Entrepreneur, masuk ke Toko Player
                    if (STATE.player.role === 'entrepreneur') {
                        STATE.location = 'player_shop_interior';
                        STATE.player.x = 7 * TILE_SIZE;
                        /* FIX: Geser Y lebih dalam (ke 9) agar jauh dari pintu (11) */
                        STATE.player.y = 9 * TILE_SIZE;
                        showToast("Masuk Toko Sendiri 🏪");
                    } else {
                        // Role lain masuk rumah biasa
                        STATE.location = 'house';
                        const hMap = maps['house'];
                        const doorX = Math.floor(hMap.w / 2);
                        /* FIX: Geser Y lebih dalam (h-3) agar tidak langsung keluar */
                        const doorY = hMap.h - 3;
                        STATE.player.x = doorX * TILE_SIZE;
                        STATE.player.y = doorY * TILE_SIZE;
                        showToast("Masuk Rumah 🏠");
                        if (typeof updateHouseLevelHUD === 'function') updateHouseLevelHUD();
                    }
                }
                else if (b.id === 'house_exit' || b.id === 'pshop_exit') {
                    // ... (Logika keluar rumah tetap sama) ...
                    if (STATE.isPrologue && !STATE.tutorialIndoorComplete) {
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                        showDialogue("TUTORIAL BELUM SELESAI",
                            "⛔ Eitss... Jangan keluar dulu!\n\nSelesaikan langkah-langkah tutorial di dalam rumah agar kamu paham cara bermain.\n\nIkuti petunjuk tangan 👆.",
                            [{ text: "Baiklah", action: closeDialogue }],
                            'images/mentor.png'
                        );
                        return;
                    }

                    STATE.location = 'village';
                    STATE.player.x = 21 * TILE_SIZE;
                    STATE.player.y = 12 * TILE_SIZE;
                    clearSpawnZone('village', 21, 12);
                    showToast("Keluar");

                    // Event Mentor Hari 1
                    if (STATE.day === 1 && STATE.player.role === 'none') {
                        const villMap = maps['village'];
                        const mentor = villMap.npcs.find(n => n.id === 'mentor');
                        if (mentor) {
                            mentor.x = 21; mentor.y = 14; mentor.vx = 0; mentor.vy = 0;
                            setTimeout(() => { STATE.player.direction = 'down'; runTutorial(); }, 600);
                        }
                    }
                }

                // --- MERCHANT ---
                else if (b.id === 'merchant') {
                    STATE.location = 'merchant_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Merchant 💰");
                }
                else if (b.id === 'shop_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 29 * TILE_SIZE;
                    STATE.player.y = 28 * TILE_SIZE;
                    clearSpawnZone('village', 29, 28);
                    showToast("Keluar Merchant");
                }

                // --- KLINIK ---
                else if (b.id === 'clinic') {
                    STATE.location = 'clinic_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Klinik 🏥");
                }
                else if (b.id === 'clinic_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 20 * TILE_SIZE;
                    STATE.player.y = 19 * TILE_SIZE;
                    clearSpawnZone('village', 20, 19);
                    showToast("Keluar Klinik");
                }

                // --- BLACKSMITH ---
                else if (b.id === 'blacksmith') {
                    STATE.location = 'blacksmith_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Bengkel ⚒️");
                }
                else if (b.id === 'smith_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 37 * TILE_SIZE;
                    STATE.player.y = 32 * TILE_SIZE;
                    clearSpawnZone('village', 37, 32);
                    showToast("Keluar Bengkel");
                }

                // --- RUMAH MENTOR ---
                else if (b.id === 'mentor') {
                    STATE.location = 'mentor_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Bertamu ke Rumah Mentor 🏠");
                }
                else if (b.id === 'mentor_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 31 * TILE_SIZE;
                    STATE.player.y = 21 * TILE_SIZE;
                    clearSpawnZone('village', 31, 21);
                    showToast("Keluar Rumah Mentor");
                }

                // --- PERPUSTAKAAN ---
                else if (b.id === 'library') {
                    STATE.location = 'library_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Perpustakaan 📚");
                }
                else if (b.id === 'library_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 41 * TILE_SIZE;
                    STATE.player.y = 24 * TILE_SIZE;
                    clearSpawnZone('village', 41, 24);
                    showToast("Keluar Perpustakaan");
                }

                // --- GUILD PETUALANG ---
                else if (b.id === 'guild') {
                    STATE.location = 'guild_interior';
                    STATE.player.x = 8 * TILE_SIZE;
                    /* FIX: Geser Y ke 11 (Pintu di 13) */
                    STATE.player.y = 11 * TILE_SIZE;
                    showToast("Masuk Guild Petualang ⚔️");
                }
                else if (b.id === 'guild_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 45 * TILE_SIZE;
                    STATE.player.y = 32 * TILE_SIZE;
                    clearSpawnZone('village', 45, 32);
                    showToast("Keluar Guild");
                }

                // --- KAMPUS ---
                else if (b.id === 'school') {
                    // Cek festival — kampus libur saat festival
                    if (isFestivalDayToday()) {
                        const fest = getTodayFestivalData();
                        showDialogue("SATPAM KAMPUS", `${fest ? fest.icon : '🎉'} KAMPUS LIBUR FESTIVAL!\n\n"${fest ? fest.name : 'Festival Desa'} hari ini. Semua perkuliahan diliburkan. Ayo nikmati festival bersama warga!"\n\n${fest ? fest.hint || '' : ''}`, [{ text: `${fest ? fest.icon : '🎉'} Siap Pak!`, action: () => { closeDialogue(); STATE.player.x = 24 * TILE_SIZE; STATE.player.y = 22 * TILE_SIZE; }}]);
                        return;
                    }
                    const dayIndex = (STATE.day - 1) % 7;
                    if (dayIndex === 5 || dayIndex === 6) {
                        showDialogue("SATPAM KAMPUS", "📢 KAMPUS LIBUR! \nHari Sabtu dan Minggu tidak ada perkuliahan.", [{ text: "Baik Pak", action: closeDialogue }]);
                        return;
                    }
                    if (STATE.time > 830 && STATE.time < 1400) {
                        showDialogue("SATPAM KAMPUS", "⛔ STOP! Kamu terlambat! \nKuliah sudah dimulai. Pintu dikunci.", [{ text: "Pulang dengan Malu", action: closeDialogue }]);
                        return;
                    }

                    STATE.location = 'school_interior';
                    STATE.player.x = 8 * TILE_SIZE;
                    /* FIX: Geser Y ke 11 (Pintu di 13) */
                    STATE.player.y = 11 * TILE_SIZE;

                    if (STATE.time >= 1400) showToast("Kampus Sore (Bebas)");
                    else showToast("Masuk Kampus 🎓");
                }
                else if (b.id === 'school_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 41 * TILE_SIZE;
                    STATE.player.y = 16 * TILE_SIZE;
                    clearSpawnZone('village', 41, 16);
                    showToast("Keluar Kampus");
                }

                // --- RUMAH AYU ---
                else if (b.id === 'lover1_home') {
                    STATE.location = 'lover1_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Bertamu ke Rumah Ayu 🌸");
                }
                else if (b.id === 'lover1_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 17 * TILE_SIZE;
                    STATE.player.y = 30 * TILE_SIZE;
                    clearSpawnZone('village', 17, 30);
                    showToast("Keluar Rumah Ayu");
                }

                // --- RUMAH NELAYAN ---
                else if (b.id === 'fisherman_home') {
                    STATE.location = 'fisherman_interior';
                    STATE.player.x = 6 * TILE_SIZE;
                    /* FIX: Geser Y ke 7 (Pintu di 9) */
                    STATE.player.y = 7 * TILE_SIZE;
                    showToast("Bertamu ke Tetangga (Nelayan) ⚓");
                }
                else if (b.id === 'fisherman_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 28 * TILE_SIZE;
                    STATE.player.y = 11 * TILE_SIZE;
                    clearSpawnZone('village', 28, 11);
                    showToast("Keluar Rumah Nelayan");
                }

                // --- CANDI KUNO ---
                else if (b.id === 'candi') {
                    STATE.location = 'candi_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    STATE.player.y = 13 * TILE_SIZE;
                    showToast("Masuk Candi Kuno 🗿");
                }
                else if (b.id === 'candi_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 51 * TILE_SIZE;
                    STATE.player.y = 11 * TILE_SIZE;
                    clearSpawnZone('village', 51, 11);
                    showToast("Keluar Candi");
                }
                else if (b.id === 'portal_sylvaria') {
                    const p = STATE.player;
                    const hasKeris = !!(p.inventory && p.inventory['keris_penjaga']);
                    const hasRafflesia = !!(p.inventory && (p.inventory['bunga_rafflesia'] || p.inventory['bibit_rafflesia'])) || !!p.rafflesiaBloomed;
                    const ethicsOk = (p.ethics || 0) >= 60;
                    if (!hasKeris) {
                        showDialogue("RETAKAN DIMENSI", "Kamu merasakan getaran misterius dari celah kuno ini...\n\n\"Selesaikan semua Kisah Leluhur dan dapatkan Keris Penjaga dari Ki Lamong.\"\n\nSyarat 1/3: Miliki Keris Penjaga Cerita", [{ text: "Baiklah...", action: closeDialogue }], null);
                        return;
                    }
                    if (!hasRafflesia) {
                        showDialogue("RETAKAN DIMENSI", "Keris Penjagamu bergetar lemah... tapi portal belum terbuka penuh.\n\n\"Tanam dan rawat Bunga Rafflesia Arnoldi dari Dewi Roro.\"\n\nSyarat 2/3: Miliki Bibit / Bunga Rafflesia", [{ text: "Aku akan mencarinya...", action: closeDialogue }], null);
                        return;
                    }
                    if (!ethicsOk) {
                        showDialogue("RETAKAN DIMENSI", "Kerismu menyala, Rafflesia memberi sinyal... tapi ada yang menolakmu.\n\nDunia ini hanya terbuka bagi jiwa yang bijak. Temui Dewi Arsa dan perdalam kebijaksanaanmu.\n\nSyarat 3/3: Ethics >= 60 (saat ini: " + (p.ethics || 0) + ")", [{ text: "Aku harus berbenah...", action: closeDialogue }], null);
                        return;
                    }
                    if (!p.sylvariaFirstVisit) {
                        p.sylvariaFirstVisit = true;
                        STATE.screen = 'cutscene';
                        STATE.cutsceneOverride = true;
                        CinematicEngine.play('portalWilis', [
                            {
                                chapter: '— Retakan Dimensi Terbuka —',
                                title: 'Keris Penjaga Bersinar!',
                                sub: 'Rafflesia merekah · Kebijaksanaan membuka segel kuno...',
                                narasi: 'Tiga kekuatan bersatu: pusaka leluhur, bunga langka dari alam, dan jiwa yang bijaksana. Retakan di dinding candi melebar memancarkan cahaya zamrud.',
                                dur: 5000
                            },
                            {
                                chapter: '— Menuju Lereng Gunung Wilis —',
                                title: '🌀 Kahyangan Wilis',
                                sub: 'Dunia Para Widadari — tersembunyi selama berabad-abad',
                                narasi: 'Kamu melangkah menembus retakan. Udara berubah wangi kenanga dan tanah hujan. Di kejauhan, lereng Gunung Wilis tampak bersinar lembut keemasan...',
                                dur: 5500
                            },
                        ], () => {
                            STATE.screen = 'play';
                            STATE.cutsceneOverride = false;
                            STATE.location = 'sylvaria';
                            STATE.player.x = 15 * TILE_SIZE;
                            STATE.player.y = (SYLVARIA_H - 4) * TILE_SIZE;
                            showToast('✨ Memasuki Kahyangan Wilis — Dunia Para Widadari!');
                        });
                    } else {
                        STATE.location = 'sylvaria';
                        STATE.player.x = 15 * TILE_SIZE;
                        STATE.player.y = (SYLVARIA_H - 4) * TILE_SIZE;
                        showToast('✨ Kembali ke Kahyangan Wilis...');
                    }
                }
                else if (b.id === 'sylvaria_exit') {
                    STATE.location = 'candi_interior';
                    STATE.player.x = 8 * TILE_SIZE;
                    STATE.player.y = 3 * TILE_SIZE;
                    showToast("Kembali ke Candi...");
                }

                // --- BALAI PERNIKAHAN ---
                else if (b.id === 'wedding') {
                    STATE.location = 'wedding_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 11 (Pintu di 13) */
                    STATE.player.y = 11 * TILE_SIZE;
                    showToast("Masuk Balai Pernikahan 💍");
                }
                else if (b.id === 'wedding_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 23 * TILE_SIZE;
                    STATE.player.y = 27 * TILE_SIZE;
                    clearSpawnZone('village', 23, 27);
                    showToast("Keluar Balai");
                }

                // --- WARNET (FIX MASALAH UTAMA) ---
                else if (b.id === 'warnet') {
                    STATE.location = 'warnet_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 (Pintu di 11) - Maju 2 Langkah agar tidak langsung keluar */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Warnet 💻");
                }
                else if (b.id === 'warnet_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 10 * TILE_SIZE;
                    STATE.player.y = 20 * TILE_SIZE;
                    clearSpawnZone('village', 10, 20);
                    showToast("Keluar Warnet");
                }

                // --- DUNGEON ---
                else if (b.id === 'dungeon_gate') {
                    STATE.dungeonLevel = 1;
                    STATE.location = 'dungeon';
                    STATE.player.x = TILE_SIZE * 5;
                    STATE.player.y = TILE_SIZE * 5;
                    createParticle(STATE.player.x, STATE.player.y, '#06b6d4');
                    // FIX: Langsung putar dungeon BGM saat masuk (tidak tunggu update() agar tidak terganjal cutscene)
                    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                        AudioService.playBGM('dungeon');
                    }
                    spawnEnemies();

                    if (!STATE.player.hasSeenDungeonTutorial) {
                        STATE.player.hasSeenDungeonTutorial = true;
                        playCutsceneDungeonEnter(() => {
                            showToast(`🌀 MASUK DUNGEON LEVEL ${STATE.dungeonLevel}...`);
                            setTimeout(() => {
                                showTutorialFocus('btn-action');
                                showDialogue("⚔️ DUNGEON",
                                    "Zona berbahaya! Tombol aksi → ⚔️ Serang musuh.\n🔥 Tombol Api = Ultimate (butuh 10 Energi, cooldown 3 detik).\n\nTips: gunakan Ultimate saat dikepung!",
                                    [{
                                        text: "Siap Bertarung! ⚔️",
                                        action: () => {
                                            clearTutorialFocus();
                                            closeDialogue();
                                            manualSave();
                                        }
                                    }],
                                    'images/penjagadungeon.png'
                                );
                            }, 1000);
                        });
                    } else {
                        showToast(`🌀 WARPING TO DUNGEON LEVEL ${STATE.dungeonLevel}...`);
                    }
                }
                else if (b.id === 'dungeon_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 48 * TILE_SIZE;
                    STATE.player.y = 22 * TILE_SIZE;
                    clearSpawnZone('village', 48, 22);
                    showToast("Keluar Dungeon");
                }
                else if (b.id === 'dungeon_next') {
                    STATE.dungeonLevel++;
                    STATE.location = 'dungeon';
                    STATE.player.x = TILE_SIZE * 5;
                    STATE.player.y = TILE_SIZE * 5;
                    manualSave();
                    showToast(`🌀 WARPING TO LEVEL ${STATE.dungeonLevel}...`);
                    spawnEnemies();
                    // FIX: Langsung mainkan dungeon music saat naik level
                    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                        AudioService.playBGM('dungeon');
                    }
                }
            }

            // --- NEW FUNCTION: ANTI-STUCK SPAWN ---
            function clearSpawnZone(mapId, spawnTileX, spawnTileY) {
                const map = maps[mapId];
                if (!map || !map.npcs) return;

                // Radius aman (dalam satuan tile)
                const safeRadius = 3;

                map.npcs.forEach(npc => {
                    // FIX: Jangan pindahkan NPC Static (Diam) atau Service karena posisinya fixed/diatur designer
                    if (npc.type === 'static' || npc.type === 'service') return;

                    // Hitung jarak NPC ke titik spawn pemain
                    const dist = Math.hypot(npc.x - spawnTileX, npc.y - spawnTileY);

                    // Jika NPC berada terlalu dekat dengan titik spawn (< 3 tile)
                    if (dist < safeRadius) {
                        // Pindahkan NPC menjauh secara paksa
                        // Cari arah menjauh
                        const dirX = npc.x < spawnTileX ? -1 : 1;
                        const dirY = npc.y < spawnTileY ? -1 : 1;

                        // Pindahkan 3-4 tile menjauh
                        let newX = npc.x + (dirX * 4);
                        let newY = npc.y + (dirY * 4);

                        // Pastikan tidak melempar NPC ke luar batas map (sederhana)
                        if (newX < 1) newX = 1;
                        if (newX >= map.w - 1) newX = map.w - 2;
                        if (newY < 1) newY = 1;
                        if (newY >= map.h - 1) newY = map.h - 2;

                        // Terapkan posisi baru
                        npc.x = newX;
                        npc.y = newY;

                        // Hentikan pergerakan sesaat agar tidak langsung balik
                        npc.vx = 0;
                        npc.vy = 0;

                        // Log debug (opsional)
                        // console.log(`Menyingkirkan ${npc.name} dari jalur spawn.`);
                    }
                });
            }

            // REMOVED DUPLICATE updateEnemies FUNCTION HERE (Deleted lines to clean up)

            // --- NEW FUNCTION: SPAWN FINAL BOSS (PHASE 2) ---
            function spawnFinalBoss() {
                STATE.bossSpawned = true;

                // Efek Dramatis
                showToast("👹 THE BOSS HAS AWAKENED!");
                createParticle(20 * TILE_SIZE, 15 * TILE_SIZE, '#7f1d1d');
                createParticle(20 * TILE_SIZE, 15 * TILE_SIZE, '#000');

                // Spawn Boss Besar
                STATE.enemies.push({
                    x: 20 * TILE_SIZE,
                    y: 15 * TILE_SIZE,
                    w: 140, h: 140, // UPDATE: Ukuran Hitbox Lebih Besar (100 -> 140)
                    hp: 5000,
                    maxHp: 5000,
                    speed: 2.0, // Sangat Cepat
                    knockback: { x: 0, y: 0 },
                    color: '#7f1d1d', // Merah darah
                    animOffset: 0,
                    angle: 0,
                    isBoss: true,
                    imgKey: 'boss'
                });
            }

            function checkWall(x, y) {
                const map = maps[STATE.location];
                // FIX: gunakan TS (tile size peta peri) jika di fairyVillage
                const _cwTS = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;
                if (x < 0 || x > map.w * _cwTS || y < 0 || y > map.h * _cwTS) return true;

                const tx = Math.floor((x + 10) / _cwTS);
                const ty = Math.floor((y + 10) / _cwTS);

                if (ty >= map.h || tx >= map.w) return true;

                const t = map.tiles[ty * map.w + tx];

                // UPDATE: Izinkan jalan di air (Tile 0) jika di area Dermaga
                if (t === 0 && STATE.location === 'fairyVillage') {
                    return false; // Tidak ada air di fairy village
                }
                if (STATE.location === 'village' && t === 0) {
                    // Area Dermaga didefinisikan di map (x:43, y:34, w:7, h:5)
                    // Kita izinkan player berjalan di koordinat tile tersebut
                    // UPDATE: Koordinat Y disesuaikan (34 s/d 38)
                    if (tx >= 43 && tx < 50 && ty >= 34 && ty < 39) {
                        return false; // Walkable (Dermaga Kayu)
                    }
                    return true; // Blocked (Laut Lepas)
                }

                // UPDATE: Tambahkan ID 13 (Tembok Bawah) dan 21 (Tembok Peri) sebagai collision
                return (t === 2 || t === 12 || t === 11 || t === 13 || t === 21);
            }

            function checkObjectCollision(x, y) {
                const map = maps[STATE.location];
                for (let obj of map.objects) {
                    if (obj.seasonReq && obj.seasonReq !== STATE.season) continue;

                    const ox = obj.x * TILE_SIZE;
                    const oy = obj.y * TILE_SIZE;
                    const ow = (obj.w || 1) * TILE_SIZE;
                    const oh = (obj.h || 1) * TILE_SIZE;

                    // ── HITBOX OBJEK: hanya zona KAKI (bawah) ──
                    // Semua objek — meja, kursi, kasur, perabotan, pohon, dll —
                    // hanya solid di bagian bawah agar player bisa jalan di belakang.
                    // - Objek tipis (h=1 tile): solid seluruhnya
                    // - Objek tinggi (h>1): solid 40% bawah saja
                    let footH, footTop;

                    const isTall = (obj.h || 1) > 1;
                    if (isTall) {
                        footH   = Math.round(oh * 0.40);
                        footTop = oy + oh - footH;
                    } else {
                        // Objek 1 tile tinggi: solid penuh (tidak ada bagian atas yang bisa dilewati)
                        footH   = oh;
                        footTop = oy;
                    }

                    const pw = 20, ph = 16;

                    if (x + pw > ox && x < ox + ow &&
                        y + ph > footTop && y < footTop + footH) {
                        return obj;
                    }
                }
                return null;
            }

            function checkBuildingCollision(x, y) {
                const map = maps[STATE.location];
                if (!map.buildings) return false;

                const isFV = STATE.location === 'fairyVillage';
                const _bTS = (isFV && typeof TS !== 'undefined') ? TS : TILE_SIZE;
                // Visual scale untuk fairyVillage — gambar 1.8x lebih besar dari hitbox tile
                // Hitbox tetap pakai ukuran tile asli (w*TS), bukan ukuran visual
                const _vs = (isFV && typeof FV_BLDG_VISUAL_SCALE !== 'undefined') ? FV_BLDG_VISUAL_SCALE : 1.0;

                for (let b of map.buildings) {
                    if (b.type === 'trigger' || b.id === 'port') continue;
                    // Hanya bangunan solid yang menghalangi player
                    if (isFV && !b.solid) continue;

                    const bTileW = b.w * _bTS;
                    const bTileH = b.h * _bTS;
                    const bTileX = b.x * _bTS;
                    const bTileY = b.y * _bTS;

                    let footH, footTop, colLeft, colRight;

                    if (b.type === 'dungeon_rock') {
                        // Batu dungeon: hitbox setengah bawah, lebar penuh
                        footH    = Math.round(bTileH * 0.5);
                        footTop  = bTileY + bTileH - footH;
                        colLeft  = bTileX;
                        colRight = bTileX + bTileW;
                    } else if (isFV) {
                        // ── FAIRY VILLAGE: Collision visual (Stardew-style) ──
                        // Gambar dirender lebih besar dari tile (anchor bawah, meluas ke atas).
                        // Player bisa lewat DI BELAKANG bangunan (Y tile < bTileY).
                        // Tapi tidak bisa menembus area visual dari depan/samping.
                        let _fvVS = (typeof FV_BLDG_VISUAL_SCALE !== 'undefined') ? FV_BLDG_VISUAL_SCALE : 1.8;
                        if (b.id === 'fv_istana_bld') _fvVS = 2.2;
                        else if (b.id === 'pohon_energi_bld') _fvVS = 3.5;
                        const _fvVisualH = bTileH * _fvVS;
                        const _fvVisualTop = bTileY + bTileH - _fvVisualH;
                        const _fvVisualW = bTileW * _fvVS;
                        const _fvVisualLeft  = bTileX + bTileW/2 - _fvVisualW/2;
                        const _fvVisualRight = _fvVisualLeft + _fvVisualW;
                        footH    = _fvVisualH;
                        footTop  = _fvVisualTop;
                        colLeft  = _fvVisualLeft;
                        colRight = _fvVisualRight;
                    } else {
                        // ── MAP UTAMA: Hitbox 35% bawah (perilaku lama) ──
                        footH    = Math.max(_bTS, Math.round(bTileH * 0.35));
                        footTop  = bTileY + bTileH - footH;
                        colLeft  = bTileX;
                        colRight = bTileX + bTileW;
                    }

                    // Hitbox player: lebar 20px, tinggi 16px (kaki)
                    const pw = 20, ph = 16;

                    if (x + pw > colLeft && x < colRight &&
                        y + ph > footTop && y < footTop + footH) {
                        return true;
                    }
                }
                return false;
            }

            function checkNPCCollision(x, y) {
                const map = maps[STATE.location];
                for (let npc of map.npcs) {
                    if (!isNPCActive(npc)) continue;

                    const npcW = npc.w || 40;
                    const npcH = npc.h || 60;

                    // FIX: Di fairyVillage, pakai posisi runtime (wandering) bukan posisi tile statis
                    let npcPX, npcPY;
                    if (STATE.location === 'fairyVillage' && typeof fvNpcRuntime !== 'undefined' && fvNpcRuntime[npc.id]) {
                        npcPX = fvNpcRuntime[npc.id].px;
                        npcPY = fvNpcRuntime[npc.id].py;
                    } else {
                        npcPX = npc.x * TILE_SIZE;
                        npcPY = npc.y * TILE_SIZE;
                    }

                    // ── HITBOX NPC: hanya area KAKI (bawah 30% sprite) ──
                    const footH    = Math.round(npcH * 0.30);
                    const footTop  = npcPY + npcH - footH;
                    const footLeft = npcPX + Math.round(npcW * 0.15);
                    const footW    = Math.round(npcW * 0.70);

                    const pw = 20, ph = 16;
                    const colX = x + pw > footLeft && x < footLeft + footW;
                    const colY = y + ph > footTop  && y < footTop  + footH;

                    if (colX && colY) {
                        return npc;
                    }
                }

                // FIX: Collision untuk peri wandering bebas (fv.fairies non-default) di fairyVillage
                if (STATE.location === 'fairyVillage' && typeof fvNpcRuntime !== 'undefined') {
                    const _DEFAULT_FAIRY_IDS = new Set(['t1','t2','t3','t4','t5']);
                    const _fvData2 = (typeof getFairyVillage === 'function') ? getFairyVillage() : null;
                    if (_fvData2 && _fvData2.fairies) {
                        for (const f of _fvData2.fairies) {
                            if (_DEFAULT_FAIRY_IDS.has(f.id)) continue;
                            const rt = fvNpcRuntime['fairy_'+f.id];
                            if (!rt) continue;
                            const nW = 38, nH = 58;
                            const fFootH   = Math.round(nH * 0.30);
                            const fFootTop = rt.py + nH - fFootH;
                            const fFootL   = rt.px + Math.round(nW * 0.15);
                            const fFootW   = Math.round(nW * 0.70);
                            const pw = 20, ph = 16;
                            if (x + pw > fFootL && x < fFootL + fFootW &&
                                y + ph > fFootTop && y < fFootTop + fFootH) {
                                return f;
                            }
                        }
                    }
                }

                return null;
            }

            // --- NEW FUNCTION: CHECK ENEMY WALL COLLISION (DIRECTIONAL) ---
            function checkEnemyWall(x, y) {
                if (STATE.location !== 'dungeon') return false;

                // Perkiraan tengah pemain
                const px = x + 10;
                const py = y + 10;

                for (let en of STATE.enemies) {
                    const ex = en.x + en.w / 2;
                    const ey = en.y + en.h / 2;
                    const dist = Math.hypot(px - ex, py - ey);

                    // Jika sangat dekat (radius tabrakan 25px)
                    if (dist < 25) {
                        // Hitung sudut dari Musuh ke Pemain
                        const angleToPlayer = Math.atan2(py - ey, px - ex);

                        // Hitung selisih sudut hadap Musuh vs Arah ke Pemain
                        // en.angle adalah arah gerak musuh (mengejar pemain)
                        let angleDiff = Math.abs(en.angle - angleToPlayer);

                        // Normalisasi sudut agar range 0-PI
                        if (angleDiff > Math.PI) angleDiff = (2 * Math.PI) - angleDiff;

                        // Logika: Jika pemain berada di DEPAN arah gerak musuh (< 90 derajat / PI/2)
                        // Maka dianggap menabrak "Tembok Slime"
                        // Tapi jika pemain ada di BELAKANG (> 90 derajat), bisa lewat/tembus.

                        // Karena musuh selalu mengejar pemain, 'depan' adalah arah pemain.
                        // Agar pemain BISA lewat belakang, kita harus memberikan sedikit celah
                        // atau mengasumsikan musuh punya inertia putar. 
                        // Namun, untuk game top-down simple, logika "hanya solid dari depan"
                        // berarti jika angleDiff kecil = solid.

                        // KITA BALIK LOGIKANYA untuk gameplay:
                        // Musuh selalu menghadap kita. Jadi kita selalu di depan.
                        // Kecuali kita bergerak lebih cepat memutari dia.

                        // Agar terasa efeknya, kita anggap "Depan" adalah cone 120 derajat.
                        // Sisa 240 derajat (samping/belakang) adalah "Lunak".

                        if (angleDiff < (Math.PI / 3)) { // Cone 60 derajat kiri-kanan (total 120)
                            return true; // SOLID (Tidak bisa lewat)
                        }
                    }
                }
                return false;
            }

            function isNPCActive(npc) {
                // --- UPDATE: LOGIKA PASANGAN MENIKAH (HILANG DARI TEMPAT LAIN) ---
                // Jika sudah menikah, pasangan hanya muncul di Rumah Player (house atau player_shop_interior)
                // Di tempat lain (Village, Kampus, Klinik, dll), mereka akan disembunyikan.
                if (STATE.player.married && STATE.player.spouseId === npc.id) {
                    if (STATE.location !== 'house' && STATE.location !== 'player_shop_interior') {
                        return false;
                    }
                }

                // NEW: Cek Syarat Gender (Untuk Fake Interest/Rival)
                if (npc.genderReq && npc.genderReq !== STATE.player.gender) return false;

                // NEW: Cek Syarat Quest (Untuk Monster Skripsi)
                if (npc.questReq) {
                    if (STATE.player.activeQuest !== npc.questReq) return false;
                }

                // --- NEW: JADWAL KHUSUS DEWI ARSA (SUMMER 23, JAM 00:00-01:00) ---
                if (npc.schedule === 'custom_fullmoon') {
                    // Hitung Data Waktu Saat Ini
                    const totalDays = STATE.day - 1;
                    const seasonIndex = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                    const currentSeason = SEASONS[seasonIndex].toLowerCase();
                    const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;

                    // Syarat 1: Tanggal 23 Musim Panas (Summer)
                    const isDate = (currentSeason === 'summer' && dayInSeason === 23);

                    // Syarat 2: Jam 12 Malam s/d 1 Pagi (00:00 - 01:00)
                    // Di sistem game, jam reset ke 0 saat mencapai 2400. Jadi rentangnya 0 s/d 100.
                    const isTime = (STATE.time >= 0 && STATE.time < 100);

                    return isDate && isTime;
                }

                // --- NEW: JADWAL KHUSUS KURCACI TANI (SUMMER 1, 08:00 - 18:00) ---
                if (npc.schedule === 'custom_harvest_festival') {
                    const totalDays = STATE.day - 1;
                    const seasonIndex = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                    const currentSeason = SEASONS[seasonIndex].toLowerCase();
                    const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;

                    // Syarat 1: Tanggal 1 Musim Panas (Summer)
                    const isDate = (currentSeason === 'summer' && dayInSeason === 1);

                    // Syarat 2: Jam 08:00 s/d 18:00
                    const isTime = (STATE.time >= 800 && STATE.time < 1800);

                    return isDate && isTime;
                }

                // --- FARM HELPER: Kurcaci muncul di ladang setelah di-hire (pagi - sore) ---
                if (npc.schedule === 'if_hired_dwarf') {
                    if (!STATE.player.hiredDwarf) return false;
                    // Muncul pagi-sore (06:00–19:00), waktu kerja normal
                    return STATE.time >= 600 && STATE.time < 1900;
                }

                // --- FARM HELPER: Peri muncul di ladang setelah di-hire (sore - malam) ---
                if (npc.schedule === 'if_hired_fairy') {
                    if (!STATE.player.hiredFairy) return false;
                    // Muncul sore-malam (16:00–24:00), sesuai karakter peri panen malam
                    return STATE.time >= 1600 || STATE.time < 200;
                }

                // --- NEW: JADWAL KHUSUS PERI PANEN (AUTUMN 15, 08:00 - 18:00) ---
                if (npc.schedule === 'custom_grape_harvest') {
                    const totalDays = STATE.day - 1;
                    const seasonIndex = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                    const currentSeason = SEASONS[seasonIndex].toLowerCase();
                    const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;

                    // Syarat 1: Tanggal 15 Musim Gugur (Autumn)
                    const isDate = (currentSeason === 'autumn' && dayInSeason === 15);

                    // Syarat 2: Jam 08:00 s/d 18:00
                    const isTime = (STATE.time >= 800 && STATE.time < 1800);

                    return isDate && isTime;
                }

                if (!npc.schedule || npc.schedule === 'always') return true;

                const isDayTime = STATE.time >= 600 && STATE.time < 2000;

                // ── PERBAIKAN: NPC tanpa jadwal eksplisit mengikuti logika waktu ──
                // Pedagang (merchant/trader) tidak ada tengah malam
                if (npc.type === 'merchant' || npc.type === 'trader' || npc.role === 'merchant') {
                    // Pedagang ada pagi hingga malam (06:00–22:00)
                    return STATE.time >= 600 && STATE.time < 2200;
                }

                if (npc.schedule === 'day') return isDayTime;
                if (npc.schedule === 'night') return !isDayTime;

                // NEW: JADWAL SORE-MALAM (15:00 - 04:00)
                if (npc.schedule === 'evening') {
                    return STATE.time >= 1500 || STATE.time < 400;
                }

                // NEW: JADWAL SPESIFIK RIVAL
                // Morning: 06:00 - 15:00 (Pagi ke Siang)
                if (npc.schedule === 'morning') {
                    return STATE.time >= 600 && STATE.time < 1500;
                }
                // Afternoon: 15:00 - 22:00 (Siang ke Malam)
                if (npc.schedule === 'afternoon') {
                    return STATE.time >= 1500 && STATE.time < 2200;
                }

                return true;
            }

            function checkEntranceProximity() {
                const map = maps[STATE.location];
                if (!map.buildings) return null;

                const pCenterX = STATE.player.x + (STATE.player.w / 2);
                const pCenterY = STATE.player.y + (STATE.player.h / 2);

                // Gunakan TS untuk fairyVillage, TILE_SIZE untuk map lain
                const _ts = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;

                for (let b of map.buildings) {
                    if (b.entrance) {
                        const eCenterX = (b.entrance.x * _ts) + (_ts / 2);
                        const eCenterY = (b.entrance.y * _ts) + (_ts / 2);

                        const dist = Math.hypot(pCenterX - eCenterX, pCenterY - eCenterY);

                        // Radius lebih besar untuk fairy (bangunan lebih besar secara visual)
                        const radius = (STATE.location === 'fairyVillage') ? _ts * 1.5 : 60;
                        if (dist < radius) return b;
                    }
                }
                return null;
            }

            function handleAction() {
                const entranceBuilding = checkEntranceProximity();

                // --- CEK APAKAH TOMBOL ADALAH TOMBOL BLOKIR FARMING (🚫) ---
                const btnAction = document.getElementById('btn-action');
                if (btnAction.innerText === '🚫') {
                    showDialogue("LAHAN TERBENGKALAI",
                        "Tanah ini keras dan dipenuhi akar liar.\nKamu tidak bisa mengolahnya sendirian.\n\n**CARA MEMBUKA LAHAN:**\nAjak **GORKI SI KURCACI TANI** bergabung bersamamu!\n\n📅 Cari Gorki saat **Festival Panen Raya di Musim Panas (Summer Hari 1)**.\nSetelah dia bergabung, seluruh ladang ini bisa kamu gunakan! 🌱",
                        [{ text: "Saya akan mencarinya!", action: closeDialogue }],
                        'images/lahan-liar.png'
                    );
                    return;
                }

                // --- CEK INTERAKSI FARMING LANGSUNG VIA TOMBOL AKSI ---
                if (STATE.location === 'village' && (btnAction.innerText === '⛏️' || btnAction.innerText === '🌱' || btnAction.innerText === '💧' || btnAction.innerText === '🌾' || btnAction.innerText === '👀')) {
                    const pTx = Math.floor((STATE.player.x + 10) / TILE_SIZE);
                    const pTy = Math.floor((STATE.player.y + 15) / TILE_SIZE);

                    // Panggil fungsi farming handler manual
                    // Kita gunakan logika inventory item use_hoe atau plant seed secara otomatis untuk UX yang lebih cepat

                    const farmKey = `${pTx}_${pTy}`;
                    const crop = STATE.player.farming[farmKey];

                    // 1. CANGKUL (⛏️)
                    if (btnAction.innerText === '⛏️') {
                        useInventoryItem('cangkul', 'use_hoe'); // Auto trigger cangkul
                        return;
                    }

                    // 2. TANAM (🌱) -> Buka Menu Bibit
                    if (btnAction.innerText === '🌱') {
                        handleFarmingInteraction(pTx, pTy); // Buka dialog pilih bibit
                        return;
                    }

                    // 3. PANEN / SIRAM / LIHAT (🌾 / 💧 / 👀)
                    if (crop) {
                        handleFarmingInteraction(pTx, pTy);
                        return;
                    }
                }

                if (entranceBuilding) {

                    // ── FAIRY VILLAGE BUILDING — buka interior popup ──
                    if (entranceBuilding.type === 'fv_building' && entranceBuilding._fvSlotId) {
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('door');
                        // Istana permanen — langsung buka dialog Puri Agung
                        if (entranceBuilding._fvSlotId === 'istana_fixed') {
                            if (typeof openIstanaDialog === 'function') openIstanaDialog();
                            return;
                        }
                        const fv = getFairyVillage();
                        const bldg = (fv.buildings||[]).find(bl => bl.slotId === entranceBuilding._fvSlotId);
                        const slot = FAIRY_SLOTS ? FAIRY_SLOTS.find(s=>s.id===entranceBuilding._fvSlotId) : null;
                        if (bldg && slot) {
                            if (bldg.bid === 'istana_mini' || bldg.bid === 'pohon_kehidupan') {
                                if (typeof openRaraWilisDialog === 'function') openRaraWilisDialog();
                            } else {
                                if (typeof openBuildingInterior === 'function') openBuildingInterior(bldg, slot);
                            }
                        }
                        return;
                    }
                    // Cek apakah bangunan ini termasuk tipe auto-teleport
                    // UPDATE: MENAMBAHKAN SCHOOL, GUILD, BLACKSMITH KE DAFTAR AGAR LOGIKA LATE/TUTUP JALAN
                    const teleporters = [
                        'player_house', 'house_exit',
                        'pshop_exit', // FIX: TAMBAHKAN KELUAR TOKO PLAYER KE SINI JUGA (MANUAL BUTTON)
                        'dungeon_gate', 'dungeon_exit', 'dungeon_next',
                        'merchant', 'shop_exit',
                        'library', 'library_exit',
                        'school', 'school_exit',
                        'guild', 'guild_exit',
                        'blacksmith', 'smith_exit',
                        'mentor', 'mentor_exit',
                        'clinic', 'clinic_exit',
                        'wedding', 'wedding_exit', // NEW: Wedding Teleport
                        'lover1_home', 'lover1_exit', // NEW: Ayu's House Teleport
                        'fisherman_home', 'fisherman_exit', // NEW: Fisherman House Teleport
                        'candi', 'candi_exit',
                        'warnet', 'warnet_exit',
                        'portal_sylvaria', 'sylvaria_exit', 'altar_sylvaria'
                    ];

                    if (teleporters.includes(entranceBuilding.id)) {
                        processTeleport(entranceBuilding);
                        return;
                    }

                    // --- LOGIKA BANGUNAN LAIN (YANG BUKA MENU/DIALOG) TETAP DISINI ---

                    // UPDATE: Interaksi Papan Misi (sekarang sebagai Building)
                    if (entranceBuilding.id === 'papan_misi') {
                        const dynamicText = getMissionBoardText();
                        showDialogue("PAPAN PENGUMUMAN", dynamicText, [{ text: "Tutup", action: closeDialogue }], 'images/papandesa.png');
                        return;
                    }

                    // UPDATE: Interaksi Statue Rank (Building) - SINKRONISASI REAL DATA
                    if (entranceBuilding.id === 'statue_rank') {
                        // 1. CEK APAKAH HARI INI ADA FESTIVAL?
                        const dayInSeason = ((STATE.day - 1) % DAYS_PER_SEASON) + 1; // 1-30
                        const eventToday = CALENDAR_EVENTS[STATE.season][dayInSeason];

                        // Jika ada Festival (Bukan cuma ultah), tawarkan opsi
                        if (eventToday && eventToday.type === 'festival') {
                            showDialogue(`🎉 ${eventToday.name.toUpperCase()}`,
                                `Hari ini desa sedang merayakan **${eventToday.name}**!\n\nWarga berkumpul di alun-alun. Apakah kamu ingin berpartisipasi?`,
                                [
                                    {
                                        text: "✨ IKUTI FESTIVAL! (Event)",
                                        action: () => {
                                            closeDialogue();
                                            startFestivalEvent(eventToday);
                                        }
                                    },
                                    {
                                        text: "🏆 Lihat Peringkat Server",
                                        action: () => showLeaderboardFromStatue()
                                    },
                                    { text: "Tutup", action: closeDialogue }
                                ],
                                'images/statue.png'
                            );
                            return;
                        }
                        // Jika tidak ada festival, langsung buka leaderboard
                        showLeaderboardFromStatue();
                        return;
                    }

                    // --- FIX: BAGIAN INI RUSAK DI KODE ANDA, INI PERBAIKANNYA ---
                    if (!entranceBuilding.open24h && entranceBuilding.openTime && entranceBuilding.closeTime) {
                        const t = STATE.time;
                        const open = entranceBuilding.openTime;
                        const close = entranceBuilding.closeTime;

                        if (t < open || t >= close) {
                            const openStr = Math.floor(open / 100).toString().padStart(2, '0') + ":00";
                            const closeStr = Math.floor(close / 100).toString().padStart(2, '0') + ":00";

                            showToast(`🔒 TUTUP! Buka jam ${openStr} - ${closeStr}`);
                            return;
                        }
                    }

                    const totalDays = STATE.day - 1;
                    const year = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;

                    if (entranceBuilding.roleSpecific) {
                        if (entranceBuilding.roleSpecific !== STATE.player.role && year < 3 && !STATE.freeRoamMode) {
                            showToast("🔒 Terkunci! Bangunan ini hanya untuk Role " + entranceBuilding.roleSpecific.toUpperCase() + " (Terbuka Thn 3)");
                            return;
                        }
                    }

                    if (entranceBuilding.id === 'port') {
                        showDialogue("DERMAGA MANCING", "Airnya terlihat tenang. Ingin memancing?", [
                            {
                                text: "Mancing (10 Energy)", action: () => {
                                    closeDialogue();
                                    setTimeout(startFishingMinigame, 100);
                                }
                            },
                            { text: "Nanti saja", action: closeDialogue }
                        ], 'images/pelabuhan.png');
                        return;
                    }
                    else if (entranceBuilding.id === 'ruins_exit') {
                        STATE.location = 'village';
                        STATE.player.x = 50 * TILE_SIZE;
                        STATE.player.y = 15 * TILE_SIZE;
                        STATE.enemies = [];
                        showToast("Kabur dari pertarungan!");
                        return;
                    }
                    else {
                        showToast("Masuk ke " + entranceBuilding.name + " (Interior Segera Hadir)");
                    }
                    return;
                }

                const map = maps[STATE.location];

                // --- UPDATE: LOGIKA INTERAKSI PRIORITASKAN JARAK TERDEKAT (BUKAN ARAH HADAP SAJA) ---

                // 1. CARI NPC TERDEKAT (Radius diperbesar)
                let closestNPC = null;
                let minNPCDist = 60; // Pixel

                // FIX fairyVillage: gunakan fvNpcRuntime untuk posisi NPC wander & TS sebagai tile size
                const _iTS = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;

                for (let npc of map.npcs) {
                    if (!isNPCActive(npc)) continue;

                    const pCX = STATE.player.x + 10;
                    const pCY = STATE.player.y + 10;

                    let nCX, nCY;
                    if (STATE.location === 'fairyVillage' && typeof fvNpcRuntime !== 'undefined' && fvNpcRuntime[npc.id]) {
                        // Posisi aktual dari runtime (sudah bergerak)
                        const rt = fvNpcRuntime[npc.id];
                        nCX = rt.px + 19;
                        nCY = rt.py + 29;
                    } else {
                        nCX = (npc.x * _iTS) + 15;
                        nCY = (npc.y * _iTS) + 30;
                    }

                    const dist = Math.hypot(pCX - nCX, pCY - nCY);
                    const radius = STATE.location === 'fairyVillage' ? _iTS * 2.5 : 60;

                    if (dist < radius && dist < minNPCDist) {
                        closestNPC = npc;
                        minNPCDist = dist; // Cari yang paling dekat
                    }
                }

                if (closestNPC) {
                    interactNPC(closestNPC);
                    return;
                }

                // 2. CARI OBJEK TERDEKAT (YANG BERSENTUHAN)
                // Menggunakan logika yang sama dengan visibility check (Bounding Box Overlap)
                let hitObject = null;

                // Buffer interaksi sedikit lebih besar dari visibility agar klik pasti kena
                const buffer = 10;

                const pLeft = STATE.player.x - buffer;
                const pRight = STATE.player.x + STATE.player.w + buffer;
                const pTop = STATE.player.y - buffer;
                const pBottom = STATE.player.y + STATE.player.h + buffer;

                for (let obj of map.objects) {

                    // --- [BARU] CEK MUSIM SAAT INTERAKSI ---
                    if (obj.seasonReq && obj.seasonReq !== STATE.season) continue;
                    // ---------------------------------------
                    const oLeft = obj.x * TILE_SIZE;
                    const oRight = (obj.x + (obj.w || 1)) * TILE_SIZE;
                    const oTop = obj.y * TILE_SIZE;
                    const oBottom = (obj.y + (obj.h || 1)) * TILE_SIZE;

                    // Cek Overlap
                    if (pLeft < oRight && pRight > oLeft &&
                        pTop < oBottom && pBottom > oTop) {
                        hitObject = obj;
                        break; // Ambil objek pertama yang disentuh
                    }
                }

                if (hitObject) {
                    interactObject(hitObject);
                    return;
                }

                if (STATE.location === 'dungeon' || STATE.location === 'ruins_battle') {
                    if (STATE.player.attackCooldown <= 0) {
                        // UPDATE: Integrasi Stamina untuk Bertarung
                        const attackCost = 2; // Biaya stamina per pukulan

                        if (STATE.player.energy >= attackCost) {
                            STATE.player.energy -= attackCost; // Kurangi stamina

                            // --- NEW: LOGIKA COMBO SYSTEM ---
                            if (STATE.player.comboWindow > 0) {
                                STATE.player.comboCount++;
                                if (STATE.player.comboCount > 3) STATE.player.comboCount = 1;
                            } else {
                                STATE.player.comboCount = 1;
                            }

                            // Set Status Attack
                            STATE.player.isAttacking = true;

                            // Cooldown & Window berbeda tiap tahap combo
                            // Combo 1 & 2 cepat, Combo 3 (Finisher) agak lama recovery-nya
                            let animDuration = 15; // Frame
                            let recoveryTime = 15; // Cooldown
                            let windowTime = 40;   // Waktu untuk input next combo

                            if (STATE.player.comboCount === 3) {
                                recoveryTime = 30; // Finisher butuh istirahat sebentar
                            }

                            STATE.player.attackCooldown = recoveryTime;
                            STATE.player.comboWindow = windowTime;

                            setTimeout(() => STATE.player.isAttacking = false, animDuration * 10); // Sync animasi kasar

                            // Sound Effect Variatif
                            if (typeof AudioService !== 'undefined') {
                                // Reset dulu biar bisa spam
                                if (AudioService.tracks.hit) {
                                    AudioService.tracks.hit.pause();
                                    AudioService.tracks.hit.currentTime = 0;
                                }

                                if (STATE.player.comboCount === 3) {
                                    // Suara lebih berat/panjang untuk finisher (jika ada, pakai 'hit' dgn volume keras)
                                    AudioService.tracks.hit.volume = 1.0;
                                    AudioService.playSFX('hit');
                                } else {
                                    AudioService.tracks.hit.volume = 0.6;
                                    AudioService.playSFX('hit');
                                }
                            }

                            // Damage Calculation
                            let damageMult = 1.0;
                            let rangeMult = 1.0;
                            let knockbackForce = 0.8;

                            if (STATE.player.comboCount === 2) {
                                damageMult = 1.2; // Hit 2: +20% Damage
                            }
                            else if (STATE.player.comboCount === 3) {
                                damageMult = 2.5; // Hit 3: +150% Damage (CRITICAL FINISHER)
                                rangeMult = 1.5;  // Jangkauan lebih luas
                                knockbackForce = 4.0; // Mental jauh
                            }

                            // Hit Detection
                            let hitCount = 0;
                            STATE.enemies.forEach(en => {
                                const dist = Math.hypot(STATE.player.x - en.x, STATE.player.y - en.y);
                                // Base Range 60
                                if (dist < 60 * rangeMult) {
                                    hitCount++;

                                    // Kalkulasi Final Damage
                                    // Base STR + Weapon (Zirah/Cincin logic di handleEnemyDrop, disini attack power)
                                    let baseDmg = STATE.player.str;
                                    let finalDmg = Math.floor(baseDmg * damageMult);

                                    // Random Variation (+- 10%)
                                    finalDmg = Math.floor(finalDmg * (0.9 + Math.random() * 0.2));

                                    en.hp -= finalDmg;
                                    en.knockback = { x: (en.x - STATE.player.x) * knockbackForce, y: (en.y - STATE.player.y) * knockbackForce };
                                    createParticle(en.x, en.y, '#fff');

                                    // NEW: Spawn Floating Text
                                    let color = '#fff';
                                    let size = 10;
                                    if (STATE.player.comboCount === 3) { color = '#facc15'; size = 16; } // Gold & Big for Crit

                                    spawnFloatingText(en.x, en.y - 10, finalDmg, color, size);
                                }
                            });

                            // Jika combo 3 kena tanah (miss), kasih efek getar dikit
                            if (STATE.player.comboCount === 3 && hitCount === 0) {
                                STATE.shakeTimer = 5;
                            }

                        } else {
                            showToast("Terlalu lelah untuk menyerang! (Stamina Habis)");
                        }
                    }
                } else {
                }
            }

            // --- NEW FUNCTION: SPAWN FLOATING TEXT ---
            function spawnFloatingText(x, y, text, color, size) {
                STATE.floatingTexts.push({
                    x: x,
                    y: y,
                    text: text,
                    color: color || '#fff',
                    size: size || 10,
                    life: 40 // Durasi text melayang
                });
            }

            // --- NEW FUNCTION: SPAWN BUNGA LIAR SECARA ACAK ---
            function spawnWildFlowers() {
                const map = maps['village'];
                if (!map || !map.objects) return;

                // Hitung jumlah bunga saat ini
                const currentFlowers = map.objects.filter(o => o.type === 'wild_flower').length;
                const maxFlowers = 15; // Maksimal bunga di map

                // Hanya spawn jika kurang dari batas
                if (currentFlowers < maxFlowers) {
                    // Spawn 2-4 bunga baru setiap hari
                    const spawnCount = Math.floor(Math.random() * 3) + 2;

                    for (let i = 0; i < spawnCount; i++) {
                        // Random posisi (hindari pinggir map)
                        const rx = Math.floor(Math.random() * (map.w - 10)) + 5;
                        const ry = Math.floor(Math.random() * (map.h - 10)) + 5;

                        const idx = ry * map.w + rx;

                        // Cek Tile: Hanya tumbuh di Rumput (1) dan tidak ada bangunan/objek lain
                        // Sederhananya cek tile ID dulu
                        if (map.tiles[idx] === 1) {
                            // Cek collision sederhana dengan objek lain (agar tidak numpuk)
                            const isOccupied = map.objects.some(o => Math.abs(o.x - rx) < 2 && Math.abs(o.y - ry) < 2);
                            const isBuilding = map.buildings.some(b =>
                                rx >= b.x && rx < b.x + b.w &&
                                ry >= b.y && ry < b.y + b.h
                            );

                            if (!isOccupied && !isBuilding) {
                                map.objects.push({
                                    x: rx,
                                    y: ry,
                                    w: 1,
                                    h: 1,
                                    type: 'wild_flower',
                                    icon: '🌸',
                                    img: 'images/bunga.png',
                                    name: 'Bunga Liar'
                                });
                            }
                        }
                    }
                    // console.log(`Spawned wild flowers. Total: ${map.objects.filter(o => o.type === 'wild_flower').length}`);
                }
            }

            // Removed handleSkill() function entirely

            // --- NEW FUNCTION: START GOMBAL MINIGAME ---
            function startGombalGame(npc) {
                // 1. Ambil 3 Gombalan Acak
                const options = [];
                const usedIndices = new Set();

                while (options.length < 3) {
                    const idx = Math.floor(Math.random() * GOMBALAN_BANK.length);
                    if (!usedIndices.has(idx)) {
                        usedIndices.add(idx);
                        options.push(GOMBALAN_BANK[idx]);
                    }
                }

                // 2. Siapkan Opsi Dialog
                const dialogueOpts = options.map(g => {
                    return {
                        text: g.text, // Tampilkan teks gombalan
                        action: () => processGombalChoice(npc, g.type)
                    };
                });

                dialogueOpts.push({ text: "Batal (Malu ah..)", action: () => interactNPC(npc) });

                showDialogue(`RAYU ${npc.name.toUpperCase()}`, "Pilih kata-kata manis yang tepat untuknya:", dialogueOpts, npc.imgSrc);
            }

            // --- NEW FUNCTION: PROCESS GOMBAL RESULT ---
            function processGombalChoice(npc, type) {
                // PREFERENSI TIPE GOMBALAN TIAP NPC
                const preferences = {
                    'lover1girl': { likes: ['cheesy', 'funny', 'pantun'], hates: ['romantic'] },
                    'lover2girl': { likes: ['romantic', 'modern'], hates: ['funny', 'cheesy'] },
                    'lover2boy': { likes: ['romantic'], hates: ['cheesy', 'funny', 'pantun'] },
                    'lover1boy': { likes: ['cheesy', 'funny', 'modern'], hates: ['romantic'] },
                    // NEW: PREFERENSI CINTA MATRE (Hanya suka Modern/Mewah, Benci Pantun/Receh)
                    'lover_matre_girl': { likes: ['modern'], hates: ['pantun', 'cheesy', 'funny'] },
                    'lover_matre_boy': { likes: ['modern', 'romantic'], hates: ['pantun', 'cheesy'] }
                };

                const pref = preferences[npc.id];
                let result = 'neutral';

                if (pref) {
                    if (pref.likes.includes(type)) result = 'success';
                    else if (pref.hates.includes(type)) result = 'fail';
                }

                // UPDATE STAT & REAKSI
                if (result === 'success') {
                    updateRelationship(npc, 2, "Cinta"); // +2

                    let happyText = "Hahaha! Kamu bisa aja! Pipi aku merah nih! 😍";
                    if (npc.id === 'lover2girl') happyText = "I-itu... indah sekali... T-terima kasih... >///<";
                    if (npc.id === 'lover2boy') happyText = "Kata-katamu menyentuh hati saya. Terima kasih.";
                    if (npc.id === 'lover1boy') happyText = "Aduh, saya kena serangan jantung mendadak nih saking manisnya! 😘";

                    showDialogue(npc.name, happyText, [{ text: "Senang kamu suka", action: closeDialogue }], npc.imgSrc);
                }
                else if (result === 'fail') {
                    updateRelationship(npc, -2, "Trust"); // -2 (Turun Trust)

                    let sadText = "Ih, garing banget sih... Gak lucu tau. 😒";
                    if (npc.id === 'lover2girl') sadText = "K-kamu... mempermainkan aku ya? Jahat... T_T";
                    if (npc.id === 'lover2boy') sadText = "Tolong jangan bercanda di saat serius. Itu tidak sopan.";
                    if (npc.id === 'lover1boy') sadText = "Waduh, rayuannya kuno banget. Coba cari referensi lain deh.";

                    showDialogue(npc.name, sadText, [{ text: "Maaf...", action: closeDialogue }], npc.imgSrc);
                }
                else { // Neutral
                    // Tidak naik tidak turun, atau naik dikit
                    showDialogue(npc.name, "Hmm... oke juga. Makasih ya.", [{ text: "Sama-sama", action: closeDialogue }], npc.imgSrc);
                }
            }

            // --- NEW HELPER: GET RANDOM CHAT ---
            function getRandomChat(npcId, loveLevel) {
                const chatData = NPC_CHATS[npcId];
                if (!chatData) return "Halo! Senang bertemu denganmu."; // Fallback

                let pool = [];
                if (loveLevel < 20) pool = chatData.low;
                else if (loveLevel < 80) pool = chatData.mid;
                else pool = chatData.high;

                if (!pool || pool.length === 0) return "Cuaca hari ini cerah ya.";
                return pool[Math.floor(Math.random() * pool.length)];
            }

            // --- NEW: FUNGSI DRAMA PERCERAIAN (GONG) ---
            function handleDivorceSequence(npc) {
                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit'); // Suara sedih/kaget

                // Dialog Pembuka yang Dramatis
                showDialogue(`${npc.name} (Sangat Kecewa)`,
                    "CUKUP! Aku sudah tidak tahan lagi dengan semua ini! 😭\n\nHubungan kita sudah hancur. Kamu tidak pernah menghargaiku, tidak pernah ada waktu, dan ekonomi kita berantakan.\n\nAku rasa... kita sudah tidak bisa diperbaiki lagi.\n\n**AKU MINTA CERAI!**",
                    [
                        {
                            text: "JANGAN! Beri aku kesempatan terakhir! 🙏",
                            action: () => {
                                // Kesempatan Kecil (30%) untuk rujuk jika hoki
                                if (Math.random() < 0.3) {
                                    updateRelationship(npc, 15, "Kesempatan Kedua"); // Balik ke 15
                                    showDialogue(npc.name, "Hhh... (Menghela napas panjang)\n\nBaiklah... demi kenangan manis kita dulu.\nIni **KESEMPATAN TERAKHIR**. Jika kamu mengecewakanku lagi, aku benar-benar pergi!", [{ text: "Terima kasih sayang! Aku janji!", action: closeDialogue }], npc.imgSrc);
                                } else {
                                    showDialogue(npc.name, "Tidak. Hatiku sudah mati untukmu.\nJanji-janjimu sudah basi. Aku tetap ingin pergi.",
                                        [{ text: "...", action: () => finalizeDivorce(npc) }], npc.imgSrc);
                                }
                            }
                        },
                        {
                            text: "Ya sudah, PERGI SANA! (Cerai) 💔",
                            action: () => finalizeDivorce(npc)
                        }
                    ],
                    npc.imgSrc
                );
            }

            function finalizeDivorce(npc) {
                const p = STATE.player;

                // 1. Reset Status Nikah
                p.married = false;
                p.divorced = true; // Flag duda/janda
                const exSpouseId = p.spouseId;
                p.spouseId = null;

                // 2. Hukuman Berat (Gono Gini & Reputasi)
                const alimony = Math.floor(p.money * 0.5); // Bayar 50% harta
                p.money -= alimony;
                p.reputation = 0; // Hancur reputasi di desa

                // Set hubungan jadi musuh (-50 tapi di sistem min 0, jadi kita set 0 dan blokir interaksi nanti)
                if (p.relationships[exSpouseId]) p.relationships[exSpouseId] = 0;

                // 3. Hapus NPC Pasangan dari Rumah
                const houseMap = maps['house'];
                if (houseMap) {
                    houseMap.npcs = houseMap.npcs.filter(n => n.id !== exSpouseId);
                }
                const shopMap = maps['player_shop_interior'];
                if (shopMap) {
                    shopMap.npcs = shopMap.npcs.filter(n => n.id !== exSpouseId);
                }

                // 4. Efek Visual & Audio
                createParticle(p.x, p.y, '#000000'); // Partikel Hitam (Kelam)
                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // 5. Dialog Perpisahan + Cutscene
                showDialogue(npc.name,
                    `Selamat tinggal. Aku akan kembali ke rumah orang tuaku.\n\n(Harta dibagi dua: -${alimony.toLocaleString()} G)\n(Reputasi Hancur: Warga bergosip tentangmu)`,
                    [{
                        text: "(Dia pergi membawa koper...) 🚶‍♀️",
                        action: () => {
                            closeDialogue();
                            // 🎬 CINEMATIC DIVORCE
                            const exName = npc.name.replace(' (Sangat Kecewa)', '').replace(' (Calon)', '');
                            playCutsceneDivorce(exName, () => {
                                regenerateHouseMap();
                                showToast("💔 STATUS: DUDA/JANDA");
                                manualSave();
                                if (typeof updateMentorBubble === 'function') updateMentorBubble();
                            });
                        }
                    }],
                    npc.imgSrc
                );
            }

