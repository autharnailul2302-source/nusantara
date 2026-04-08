            // --- FIX: KEMBALIKAN FUNGSI MINIMAP YANG BENAR (SEBELUMNYA SALAH NAMA showDialogue) ---
            function drawMinimap() {
                const miniCanvas = document.getElementById('minimapCanvas');
                if (!miniCanvas) return;

                const minimapContainer = document.getElementById('minimap-container');

                // FIX: fairyVillage kini pakai minimap HTML utama (posisi bawah)
                // Selalu tampilkan minimap saat ingame (termasuk fairyVillage)
                if (minimapContainer) minimapContainer.style.display = '';

                const mCtx = miniCanvas.getContext('2d');
                mCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);

                // ── SPECIAL: Render peta Kahyangan Wilis di minimap HTML ──
                if (STATE.location === 'fairyVillage') {
                    const fv = (typeof getFairyVillage === 'function') ? getFairyVillage() : null;
                    if (!fv) return;

                    const FW2 = (typeof FW !== 'undefined') ? FW : 60;
                    const FH2 = (typeof FH !== 'undefined') ? FH : 40;
                    const TS2 = (typeof TS !== 'undefined') ? TS : 28;
                    const mW = miniCanvas.width, mH = miniCanvas.height;
                    const sx = mW / FW2, sy = mH / FH2;

                    // Background peta peri (hijau gelap)
                    mCtx.fillStyle = '#0f2e13';
                    mCtx.fillRect(0, 0, mW, mH);

                    // Bangunan selesai (biru ungu)
                    (fv.buildings || []).forEach(({slotId}) => {
                        if (typeof FAIRY_SLOTS === 'undefined') return;
                        const s = FAIRY_SLOTS.find(x => x.id === slotId);
                        if (!s) return;
                        mCtx.fillStyle = '#818cf8';
                        mCtx.fillRect(s.x * sx, s.y * sy, Math.max(3, sx * 2 + 1), Math.max(3, sy * 2 + 1));
                    });

                    // Bangunan konstruksi (kuning)
                    (fv.buildQueue || []).forEach(({slotId}) => {
                        if (typeof FAIRY_SLOTS === 'undefined') return;
                        const s = FAIRY_SLOTS.find(x => x.id === slotId);
                        if (!s) return;
                        mCtx.fillStyle = '#fbbf24';
                        mCtx.fillRect(s.x * sx, s.y * sy, Math.max(3, sx * 2 + 1), Math.max(3, sy * 2 + 1));
                    });

                    // Istana Peri (merah muda)
                    if (typeof FV_ISTANA_POS !== 'undefined') {
                        mCtx.fillStyle = '#f9a8d4';
                        mCtx.fillRect(FV_ISTANA_POS.x * sx, FV_ISTANA_POS.y * sy, sx * 3, sy * 3);
                    }

                    // Pohon Energi (hijau terang)
                    if (typeof FV_POHON_POS !== 'undefined') {
                        mCtx.fillStyle = '#4ade80';
                        mCtx.beginPath();
                        mCtx.arc(FV_POHON_POS.x * sx + sx, FV_POHON_POS.y * sy + sy, 4, 0, Math.PI * 2);
                        mCtx.fill();
                    }

                    // Rara Wilis (ungu muda)
                    if (typeof FV_RARA_POS !== 'undefined') {
                        mCtx.fillStyle = '#e9d5ff';
                        mCtx.beginPath();
                        mCtx.arc(FV_RARA_POS.x * sx + sx, FV_RARA_POS.y * sy + sy, 2.5, 0, Math.PI * 2);
                        mCtx.fill();
                    }

                    // Peri wandering (pink / biru)
                    if (typeof fvNpcRuntime !== 'undefined') {
                        (fv.fairies || []).forEach((f, idx) => {
                            const rt = fvNpcRuntime['fairy_' + f.id];
                            const fx = rt ? (rt.px / TS2) * sx : (FV_RARA_POS.x + 2 + idx % 3) * sx;
                            const fy = rt ? (rt.py / TS2) * sy : (FV_RARA_POS.y + 1 + Math.floor(idx / 3)) * sy;
                            mCtx.fillStyle = f.gender === 'girl' ? '#f472b6' : '#60a5fa';
                            mCtx.beginPath();
                            mCtx.arc(fx, fy, 2, 0, Math.PI * 2);
                            mCtx.fill();
                        });
                    }

                    // Player (kuning emas)
                    if (typeof fvPlayer !== 'undefined') {
                        const plx = (fvPlayer.x / TS2) * sx;
                        const ply = (fvPlayer.y / TS2) * sy;
                        mCtx.fillStyle = '#fbbf24';
                        mCtx.beginPath();
                        mCtx.arc(plx, ply, 4, 0, Math.PI * 2);
                        mCtx.fill();
                        mCtx.strokeStyle = '#fff';
                        mCtx.lineWidth = 1.5;
                        mCtx.beginPath();
                        mCtx.arc(plx, ply, 4, 0, Math.PI * 2);
                        mCtx.stroke();
                    }

                    // Label
                    const labelEl = document.getElementById('minimap-label');
                    if (labelEl) labelEl.innerText = '🧚 KAHYANGAN';
                    return;
                }

                // Ambil data map aktif (bisa desa, dungeon, atau interior rumah/toko)
                const currentMap = maps[STATE.location];
                if (!currentMap) return;

                // Hitung dimensi map dalam pixel
                const mapW = currentMap.w * TILE_SIZE;
                const mapH = currentMap.h * TILE_SIZE;

                // Hitung Scale agar map pas di canvas minimap
                // Gunakan Math.min untuk scale agar aspek rasio tetap terjaga jika mapnya kotak/persegi panjang
                // Tapi untuk memenuhi kotak, kita bisa stretch sedikit atau center.
                // Kode sebelumnya menggunakan stretch fill:
                const scaleX = miniCanvas.width / mapW;
                const scaleY = miniCanvas.height / mapH;

                // Update Label Minimap
                const labelEl = document.getElementById('minimap-label');
                if (labelEl) {
                    if (STATE.location === 'dungeon') labelEl.innerText = `LV ${STATE.dungeonLevel}`;
                    else if (STATE.location === 'ruins_battle') labelEl.innerText = '👹 PENCURI NASKAH';
                    else if (STATE.location === 'village') labelEl.innerText = "DESA";
                    else if (STATE.location === 'fairyVillage') labelEl.innerText = "🧚 KAHYANGAN WILIS";
                    else {
                        // Nama lokasi interior
                        let locName = "INDOOR";
                        if (STATE.location === 'house') locName = "RUMAH";
                        else if (STATE.location === 'merchant_interior') locName = "TOKO";
                        else if (STATE.location === 'school_interior') locName = "KAMPUS";
                        else if (STATE.location === 'library_interior') locName = "PERPUS";
                        else if (STATE.location === 'guild_interior') locName = "GUILD";
                        else if (STATE.location === 'candi_interior') locName = "CANDI";
                        else if (STATE.location === 'sylvaria') locName = "🧚‍♀️ KAHYANGAN WILIS";
                        labelEl.innerText = locName;
                    }
                }

                // 1. DRAW BUILDINGS & PORTALS (Termasuk Pintu Keluar/Masuk)
                if (currentMap.buildings) {
                    currentMap.buildings.forEach(b => {
                        // Tentukan Warna di Minimap
                        if (b.id === 'player_house') {
                            mCtx.fillStyle = '#f59e0b'; // Rumah (Emas)
                        } else if (b.type === 'trigger' || b.id.includes('exit') || b.id.includes('next')) {
                            mCtx.fillStyle = '#a855f7'; // Portal/Teleport (Ungu) - Sangat penting di Indoor untuk melihat pintu keluar
                        } else if (b.roleSpecific || b.openTime) {
                            mCtx.fillStyle = '#3b82f6'; // Toko/Bangunan Penting (Biru)
                        } else if (b.type === 'dungeon_rock') {
                            mCtx.fillStyle = '#334155'; // Batu (Abu Gelap)
                        } else {
                            mCtx.fillStyle = '#475569'; // Bangunan Lain (Abu)
                        }

                        const bx = (b.x * TILE_SIZE) * scaleX;
                        const by = (b.y * TILE_SIZE) * scaleY;
                        const bw = (b.w * TILE_SIZE) * scaleX;
                        const bh = (b.h * TILE_SIZE) * scaleY;
                        mCtx.fillRect(bx, by, bw, bh);
                    });
                }

                // 2. NEW: DRAW INTERACTABLE OBJECTS (Benda yang bisa disentuh)
                if (currentMap.objects) {
                    mCtx.fillStyle = '#22d3ee'; // Cyan (Biru Muda Terang)
                    currentMap.objects.forEach(o => {
                        // Objek biasanya 1x1 tile
                        const ox = (o.x * TILE_SIZE) * scaleX;
                        const oy = (o.y * TILE_SIZE) * scaleY;

                        // UPDATE: Support Custom Size di Minimap
                        const ow = ((o.w || 1) * TILE_SIZE) * scaleX;
                        const oh = ((o.h || 1) * TILE_SIZE) * scaleY;

                        // Gambar kotak kecil untuk objek
                        mCtx.fillRect(ox, oy, ow, oh);
                    });
                }

                // 3. DRAW NPCS (Berlaku untuk SEMUA map sekarang, termasuk Indoor)
                if (currentMap.npcs) {
                    currentMap.npcs.forEach(n => {
                        if (!isNPCActive(n)) return;

                        const nx = (n.x * TILE_SIZE) * scaleX;
                        const ny = (n.y * TILE_SIZE) * scaleY;

                        // Titik NPC diperbesar sedikit agar terlihat jelas di map kecil
                        mCtx.fillStyle = '#fff';
                        mCtx.beginPath();
                        mCtx.arc(nx, ny, 2, 0, Math.PI * 2); // Radius 2
                        mCtx.fill();
                    });
                }

                // 4. DRAW ENEMIES (Dungeon + Ruins Battle)
                if (STATE.location === 'dungeon' || STATE.location === 'ruins_battle') {
                    STATE.enemies.forEach(e => {
                        const ex = e.x * scaleX;
                        const ey = e.y * scaleY;
                        const size = e.isBoss ? 4 : 2;
                        mCtx.fillStyle = e.isBoss ? '#b91c1c' : '#ef4444';
                        mCtx.beginPath();
                        mCtx.arc(ex, ey, size, 0, Math.PI * 2);
                        mCtx.fill();
                    });
                }

                // 5. DRAW PLAYER
                const px = STATE.player.x * scaleX;
                const py = STATE.player.y * scaleY;

                // UPDATE: Ganti Dot dengan Kepala Player (Avatar dari HUD)
                const avatarImg = document.getElementById('hud-avatar-img');
                const headSize = 12; // Ukuran kepala di minimap (pixel)

                if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0) {
                    mCtx.save();

                    // 1. Clipping Mask (Membuat gambar jadi bulat)
                    mCtx.beginPath();
                    mCtx.arc(px, py, headSize / 2, 0, Math.PI * 2);
                    mCtx.closePath();
                    mCtx.clip();

                    // 2. Gambar Avatar (Tengah di posisi px, py)
                    mCtx.drawImage(avatarImg, px - headSize / 2, py - headSize / 2, headSize, headSize);

                    mCtx.restore();

                    // 3. Border Emas di sekeliling kepala
                    mCtx.strokeStyle = '#fbbf24'; // Warna Emas
                    mCtx.lineWidth = 1.5;
                    mCtx.beginPath();
                    mCtx.arc(px, py, headSize / 2, 0, Math.PI * 2);
                    mCtx.stroke();

                } else {
                    // Fallback: Player Dot (Jika gambar gagal load)
                    mCtx.fillStyle = '#fbbf24';
                    mCtx.beginPath();
                    mCtx.arc(px, py, 4, 0, Math.PI * 2);
                    mCtx.fill();
                }

                // Player Ring (Radar Effect) - Diperbesar agar melingkupi kepala
                mCtx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
                mCtx.beginPath();
                mCtx.arc(px, py, headSize / 2 + 3, 0, Math.PI * 2);
                mCtx.stroke();
            }


            // --- [KODE BARU: SISTEM PERTANIAN LENGKAP] ---

            // 1. Fungsi Utama Interaksi (Dipanggil saat tombol aksi ditekan di ladang)
            function handleFarmingInteraction(tx, ty) {
                const farmKey = `${tx}_${ty}`;

                // Pastikan data farming aman
                if (!STATE.player.farming) STATE.player.farming = {};
                const crop = STATE.player.farming[farmKey];

                // SKENARIO A: TANAH KOSONG (Sudah Dicangkul) -> MENU PILIH BIBIT
                if (!crop || !crop.type) {
                    if (crop && crop.tilled) {
                        showSeedMenu(tx, ty);
                    } else {
                        showToast("Tanah harus dicangkul dulu! (Gunakan ikon ⛏️)");
                    }
                    return;
                }

                // SKENARIO B: ADA TANAMAN -> MENU PERAWATAN
                const cropName = crop.type.toUpperCase();
                let stageInfo = "🌱 Benih";
                if (crop.stage === 2) stageInfo = "🌿 Tumbuh";
                if (crop.stage === 3) stageInfo = "🌾 Siap Panen";

                // Siapkan Opsi Dialog
                let opts = [];

                // Opsi 1: Panen (Muncul jika Stage 3)
                if (crop.stage >= 3) {
                    opts.push({
                        text: `🌾 PANEN ${cropName} (+EXP)`,
                        action: () => harvestCrop(tx, ty)
                    });
                }
                // Opsi 2: Siram (Muncul jika belum disiram & belum panen)
                else if (!crop.watered) {
                    opts.push({
                        text: `💧 SIRAM AIR (Energi -2)`,
                        action: () => waterCrop(tx, ty)
                    });
                }

                // Opsi 3: Cek Status
                opts.push({
                    text: "👀 Cek Kondisi",
                    action: () => {
                        let statusMsg = `Tanaman: **${cropName}**\nFase: ${stageInfo} (Stage ${crop.stage}/3)\nAir: ${crop.watered ? '✅ Basah (Akan Tumbuh)' : '❌ Kering (Butuh Air)'}`;
                        showDialogue("INFO TANAMAN", statusMsg, [{ text: "Mengerti", action: closeDialogue }], 'images/lahan-liar.png');
                    }
                });

                // Opsi 4: Cabut (Hapus tanaman jika salah tanam)
                opts.push({
                    text: "🗑️ Cabut/Buang Tanaman",
                    action: () => {
                        // Hapus data tanaman, tapi biarkan tanah tetap gembur (tilled)
                        delete STATE.player.farming[farmKey].type;
                        delete STATE.player.farming[farmKey].stage;
                        delete STATE.player.farming[farmKey].watered;

                        showToast("Tanaman dicabut.");
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        closeDialogue();
                        manualSave();
                    }
                });

                opts.push({ text: "Tutup", action: closeDialogue });

                showDialogue(`TANAMAN: ${cropName}`, `Apa yang ingin kamu lakukan?`, opts, 'images/lahan-liar.png');
            }


            // 2. Fungsi Menampilkan Menu Bibit (Cek Isi Tas)
            function showSeedMenu(tx, ty) {
                const inv = STATE.player.inventory || {};
                let opts = [];

                // Daftar bibit yang didukung (UPDATE: Tambah Rafflesia)
                const seeds = [
                    { id: 'bibit_padi', name: 'Padi' },
                    { id: 'bibit_jagung', name: 'Jagung' },
                    { id: 'bibit_tomat', name: 'Tomat' },
                    { id: 'bibit_rafflesia', name: 'RAFFLESIA (Langka!)' } // <--- BARU
                ];

                seeds.forEach(s => {
                    // Cek apakah punya bibit ini di tas
                    if (inv[s.id] > 0) {
                        opts.push({
                            text: `🌱 Tanam ${s.name} (Sisa: ${inv[s.id]})`,
                            action: () => {
                                // Panggil fungsi tanam
                                // Format action: plant_padi, plant_rafflesia, dst.
                                useInventoryItem(s.id, `plant_${s.id.split('_')[1]}`);
                                closeDialogue();
                            }
                        });
                    }
                });

                opts.push({ text: "Batal", action: closeDialogue });

                if (opts.length === 1) { // Cuma ada tombol Batal
                    showDialogue("TIDAK ADA BIBIT", "Tas kamu kosong!\nBeli bibit di **Bu Lastri (Pedagang Keliling)** atau dapatkan Bibit Langka dari Quest.", [{ text: "Oke", action: closeDialogue }], 'images/lahan-liar.png');
                } else {
                    showDialogue("PILIH BIBIT", "Mau tanam apa di petak ini?", opts, 'images/lahan-liar.png');
                }
            }
            // 3. Fungsi Menyiram Tanaman
            function waterCrop(tx, ty) {
                if (STATE.player.energy < 2) {
                    showToast("Energi habis! Makan dulu.");
                    return;
                }

                const farmKey = `${tx}_${ty}`;
                const crop = STATE.player.farming[farmKey];

                if (crop) {
                    STATE.player.energy -= 2;
                    crop.watered = true; // Tandai sudah disiram

                    // Efek Visual
                    createParticle(tx * TILE_SIZE, ty * TILE_SIZE, '#38bdf8'); // Partikel Biru
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                    showToast("Tanaman disiram! 💧");
                    closeDialogue();
                    manualSave();
                }
            }

            // 4. Fungsi Panen
            // 4. Fungsi Panen
            function harvestCrop(tx, ty) {
                const farmKey = `${tx}_${ty}`;
                const crop = STATE.player.farming[farmKey];

                if (crop && crop.stage >= 3) {
                    // Simpan tipe sebelum dihapus
                    const cropType = crop.type;

                    // Tentukan Hasil Panen
                    let resultItem = 'beras';
                    let qty = 1;
                    let xpGain = 15;
                    let particleColor = '#fbbf24';
                    let resultName = 'Beras';

                    if (cropType === 'padi') {
                        resultItem = 'beras'; qty = 3; xpGain = 20; resultName = 'Beras';
                        particleColor = '#fbbf24';
                    } else if (cropType === 'jagung') {
                        resultItem = 'jagung_panen'; qty = 4; xpGain = 25; resultName = 'Jagung';
                        particleColor = '#facc15';
                    } else if (cropType === 'tomat') {
                        resultItem = 'tomat_panen'; qty = 3; xpGain = 15; resultName = 'Tomat';
                        particleColor = '#ef4444';
                    } else if (cropType === 'rafflesia') {
                        resultItem = 'bunga_rafflesia'; qty = 1; xpGain = 500; resultName = 'Rafflesia Arnoldi';
                        particleColor = '#a855f7';
                        showToast("PANEN LEGENDARIS! 🌺");
                    }

                    // Tambah Item ke Tas
                    addItem(resultItem, qty);
                    gainExp(xpGain);

                    // Tambah counter panen harian
                    STATE.player.dailyHarvestCount = (STATE.player.dailyHarvestCount || 0) + 1;

                    // Reset Tanaman (tanah tetap gembur)
                    delete crop.type;
                    delete crop.stage;
                    delete crop.watered;
                    // crop.tilled tetap true

                    // Efek Visual Panen
                    createParticle(tx * TILE_SIZE, ty * TILE_SIZE, particleColor);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                    const msg = cropType === 'rafflesia'
                        ? `LUAR BIASA! Kamu memanen Bunga Rafflesia Arnoldi!\n(+500 EXP)`
                        : `Kamu memanen ${qty}x ${resultName}!\n(+${xpGain} EXP)\n\nJual ke Merchant untuk dapat Gold!`;

                    showDialogue("PANEN RAYA! 🌾", msg, [{ text: "Mantap! ✅", action: closeDialogue }], 'images/lahan-liar.png');

                    manualSave();
                }
            }

            // --- NEW: FUNGSI TAMBAHAN FESTIVAL & LEADERBOARD (PASTE DI BAGIAN BAWAH SEBELUM CLOSING SCRIPT) ---

            // 1. FUNGSI HANDLER LEADERBOARD DARI PATUNG
            function showLeaderboardFromStatue() {
                showDialogue("HALL OF FAME", "Sedang mengambil data peringkat server...", [{text:"Tutup", action:closeDialogue}], 'images/statue.png');

                DataService.getAllStudents().then(students => {
                    let validStudents = students.filter(s => s.saveData);

                    validStudents.sort((a, b) => {
                        const scoreA = calculateGrade(a.saveData);
                        const scoreB = calculateGrade(b.saveData);
                        return scoreB - scoreA;
                    });

                    let rankText = "🏆 PERINGKAT TERTINGGI NUSANTARA ARSA:\n\n";
                    const top3 = validStudents.slice(0, 3);

                    if (top3.length === 0) {
                        rankText += "Belum ada petualang yang terdaftar.";
                    } else {
                        top3.forEach((s, idx) => {
                            const medal = idx === 0 ? "🥇" : (idx === 1 ? "🥈" : "🥉");
                            const score = calculateGrade(s.saveData);
                            const dName = s.name.length > 12 ? s.name.substring(0, 10) + ".." : s.name;
                            const role = s.saveData.role !== 'none' ? s.saveData.role.toUpperCase() : 'NOVICE';
                            rankText += `${medal} ${dName} [${role}] - Skor: ${score}\n`;
                        });
                    }

                    if (DataService.user) {
                        const myRank = validStudents.findIndex(s => s.email === DataService.user.email) + 1;
                        if (myRank > 3) {
                            const myScore = calculateGrade(DataService.user.saveData);
                            rankText += `\n...\n#${myRank} ${DataService.user.name} (Kamu) - Skor: ${myScore}`;
                        } else if (myRank > 0) {
                            rankText += `\n(Kamu berada di Puncak Klasemen!)`;
                        } else {
                            rankText += `\n(Data kamu belum terdaftar di server)`;
                        }
                    }

                    showDialogue("HALL OF FAME", rankText, [{ text: "Saya Pasti Bisa Top 1!", action: closeDialogue }], 'images/statue.png');

                }).catch(err => {
                    console.error("Leaderboard Error:", err);
                    showDialogue("HALL OF FAME", "Gagal terhubung ke server peringkat.\nCek koneksi internetmu.", [{ text: "Tutup", action: closeDialogue }], 'images/statue.png');
                });
            }

            // ══════════════════════════════════════════════════════════════
            // 🎉 SISTEM FESTIVAL DESA — GATHERING WARGA & ANIMASI AMBIENT
            // Festival = hari libur semua aktivitas (kerja, kuliah, part-time)
            // NPC berkumpul di alun-alun, partikel khusus, dialog festival
            // ══════════════════════════════════════════════════════════════

            // Titik kumpul alun-alun (di sekitar patung desa, tile coords)
            const FESTIVAL_GATHER_SPOTS = [
                { x: 22, y: 21 }, { x: 24, y: 21 }, { x: 26, y: 21 },
                { x: 22, y: 23 }, { x: 24, y: 23 }, { x: 26, y: 23 },
                { x: 21, y: 22 }, { x: 27, y: 22 }, { x: 23, y: 22 },
                { x: 25, y: 22 }, { x: 22, y: 20 }, { x: 26, y: 20 }
            ];

            // Data festival: partikel, warna, dekorasi, suasana, NPC dialogues
            const FESTIVAL_DATA = {
                'Tahun Baru': {
                    particles: ['🎆','🎇','✨','🌟','💫'],
                    colors: ['#facc15','#f472b6','#60a5fa','#4ade80','#fb923c'],
                    ambient: 'fireworks',
                    suasana: '🎆 Kembang api mewarnai langit desa! Warga bersorak dan saling berpelukan menyambut tahun baru.',
                    npcDialogues: [
                        'Selamat tahun baru! Semoga resolusimu terwujud ya!',
                        'Wah kembang apinya bagus banget! Saya tiap tahun nonton di sini.',
                        'Tahun baru, semangat baru! Kamu sudah buat resolusi belum?',
                        'Alhamdulillah, masih diberi kesempatan menyambut tahun baru bareng warga desa!',
                        'Hei, ingat — tahun baru bukan cuma soal kembang api. Tapi soal menjadi versi lebih baik dari dirimu!',
                        '💡 HINT: Setelah festival, toko-toko kembali buka. Cek Merchant untuk barang diskon tahun baru!',
                    ],
                    hint: '💡 Kamu mendapat Angpao Tahun Baru! Uang awal yang baik untuk memulai tahun.',
                },
                'Festival Bunga': {
                    particles: ['🌸','🌺','🌹','💐','🌼'],
                    colors: ['#f472b6','#fb923c','#e879f9','#fb7185','#fbbf24'],
                    ambient: 'petals',
                    suasana: '🌸 Kelopak bunga beterbangan di udara! Pasangan-pasangan saling memberikan bunga, anak-anak berlarian.',
                    npcDialogues: [
                        'Hari ini hari kasih sayang! Sudah beri bunga untuk orang tersayang?',
                        'Katanya kalau dapat bunga di festival ini, hubungannya akan lebih kuat!',
                        'Lihat tuh, Ayu dan cowoknya lagi berduaan di pojok sana. Imut banget!',
                        'Aku sengaja beli 10 bunga sebelum festival dimulai. Dijual lagi 3x lipat hehe!',
                        'Festival bunga itu pengingat: jangan tunjukkan cintamu cuma sekali setahun!',
                        '🧚 HINT PERI: Widadari Kahyangan Wilis sangat menyukai bunga! Kembangkan Taman di Kahyangan untuk mengundang lebih banyak peri saat musim semi.',
                        '💡 HINT: Berikan bunga ke pasangan/calon pasangan hari ini — efek +Love DOUBLE!',
                    ],
                    hint: '💡 Efek pemberian hadiah ke love interest hari ini 2x lipat! 🧚 Peri suka bunga — kembangkan Taman di Kahyangan Wilis!',
                },
                'Lomba Pacuan Kuda': {
                    particles: ['🐎','💨','🏆','⚡','🌟'],
                    colors: ['#78350f','#fbbf24','#dc2626','#16a34a','#2563eb'],
                    ambient: 'dust',
                    suasana: '🐎 Derap kaki kuda menggemuruh! Penonton berteriak mendukung jagoan masing-masing. Tanah bergetar penuh semangat.',
                    npcDialogues: [
                        'Si Halilintar yang coklat itu favorit saya! Larinya kayak angin!',
                        'Awas judi! Duit segitu mending buat modal usaha daripada taruhan kuda!',
                        'Tahun lalu saya taruhan Si Kancil dan menang 3x lipat. Tahun ini mau coba lagi!',
                        'Ayah saya dulu joki kuda terkenal. Makanya saya paham kuda yang bagus dari gaya jalannya.',
                        'Kamu tahu tidak, pacuan kuda itu olahraga, seni, dan strategi sekaligus!',
                        '💡 HINT: Taruhan lebih dari 1000G dengan peluang 1/3 menang — strategi atau gambling?',
                    ],
                    hint: '💡 Ada 3 kuda dengan peluang menang sama. Pilih bijak!',
                },
                'Lomba Memasak': {
                    particles: ['🍳','🍲','🌶️','🧄','✨'],
                    colors: ['#f97316','#dc2626','#fbbf24','#16a34a','#fff'],
                    ambient: 'smoke',
                    suasana: '🍳 Aroma masakan wangi memenuhi desa! Para juru masak sibuk di depan tungku. Juri berjalan mencicipi tiap hidangan.',
                    npcDialogues: [
                        'Kamu harus coba soto buatan Bu Marina — kalahkan soto mana pun se-desa!',
                        'Masak itu seni. Bukan soal bahan mahal, tapi soal rasa dan cinta yang dimasukkan.',
                        'Saya pernah juara 1 tiga tahun berturut-turut. Rahasianya? Garam secukupnya!',
                        'Anak muda sekarang jarang bisa masak. Belajar masak itu skill hidup penting lho!',
                        'Ada yang bilang makanan terenak adalah yang dimasak dengan tangan sendiri untuk orang yang kamu cintai.',
                        '💡 HINT: Siapkan Ikan Segar sebelum festival untuk ikut lomba masak!',
                    ],
                    hint: '💡 Butuh Ikan Segar + INT tinggi untuk menang lomba memasak!',
                },
                'Buka Giling': {
                    particles: ['🌾','🌽','🍅','🌻','✨'],
                    colors: ['#fbbf24','#84cc16','#f97316','#16a34a','#78350f'],
                    ambient: 'leaves',
                    suasana: '🌾 Seluruh desa bergotong-royong! Suara giling beras dan tawa warga berpadu menjadi simfoni panen raya yang menggembirakan.',
                    npcDialogues: [
                        'Alhamdulillah, panen tahun ini melimpah! Semoga tahun depan lebih baik lagi.',
                        'Waktu kecil saya suka ikut bapak ke sawah saat panen. Nostalgia sekali...',
                        'Kalau panennya bagus, artinya kerjasama desa kita kompak. Itu yang penting!',
                        'Gorki si kurcaci tani terlihat di utara! Katanya dia cuma muncul setahun sekali saat panen raya.',
                        'Jual hasil panen ke Kepala Desa hari ini — harganya lebih tinggi dari biasanya!',
                        '🧚 HINT PERI: Saat panen melimpah, Widadari Kahyangan Wilis turun dari lereng Gunung Wilis! Buka menu Kahyangan untuk mengumpulkan Serbuk Wilis bonus panen hari ini.',
                        '💡 HINT: Setor minimal 5 hasil panen ke Kepala Desa untuk dapat bonus Gold dan Reputasi!',
                    ],
                    hint: '💡 Kurcaci Gorki muncul di area utara hanya saat Panen Raya! 🧚 Kumpulkan Serbuk Wilis bonus di Kahyangan Wilis hari ini!',
                },
                'Festival Ayam': {
                    particles: ['🐔','🥚','🌟','🏆','🎊'],
                    colors: ['#f97316','#fbbf24','#dc2626','#fff','#84cc16'],
                    ambient: 'feathers',
                    suasana: '🐔 Ayam-ayam cantik dipajang di kandang dekorasi! Penonton menilai postur, bulu, dan suara kokok. Berisik tapi seru!',
                    npcDialogues: [
                        'Ayam Bekisar milik Pak Darmo itu keren banget! Suara kokoknya merdu!',
                        'Festival ayam bukan soal aduan — ini soal perawatan dan keindahan ternak.',
                        'Di Jawa, Ayam Bekisar itu simbol kebanggaan. Punya satu saja sudah prestis!',
                        'Kamu punya ayam? Rawat baik-baik, nanti menang kontes bisa dapat hadiah bagus.',
                        'Harga ayam unggul bisa sampai 10x lipat ayam biasa. Itu bisnis yang menjanjikan!',
                        '💡 HINT: Rawat peliharaan ayam sebelum festival untuk bonus kontes!',
                    ],
                    hint: '💡 Rawat hewan peliharaan tiap hari untuk meningkatkan peluang menang kontes!',
                },
                'Lomba Berenang': {
                    particles: ['💧','🏊','🌊','⚡','🏆'],
                    colors: ['#0ea5e9','#38bdf8','#7dd3fc','#fff','#fbbf24'],
                    ambient: 'bubbles',
                    suasana: '🏊 Pantai desa berubah jadi arena olahraga! Penonton berjajar di tepi pantai, berteriak menyemangati perenang.',
                    npcDialogues: [
                        'Pak Nelayan selalu menang lomba renang ini. Tapi tahun ini kayaknya ada saingan baru!',
                        'Renang itu olahraga paling lengkap — melatih semua otot tubuh secara bersamaan.',
                        'Hati-hati ombaknya! Tahun lalu ada yang kram di tengah jalan — untung tertolong.',
                        'Kalau kamu STR-nya tinggi, coba ikut lomba. Hadiahnya berlian lho!',
                        'Saya tidak bisa renang. Makanya saya hanya nonton sambil makan jagung bakar di pinggir.',
                        '🧚 HINT PERI: Ada yang bilang pernah melihat cahaya ungu di permukaan air malam ini... mungkin itu Widadari dari Kahyangan Wilis yang ikut menyaksikan festival! Kunjungi Kahyangan-mu setelah festival.',
                        '💡 HINT: Butuh STR 15+ dan energi 50 untuk mengalahkan Pak Nelayan!',
                    ],
                    hint: '💡 Tingkatkan STR dengan kerja keras sebelum festival berenang! 🧚 Kunjungi Kahyangan Wilis setelah festival untuk kejutan dari para Widadari!',
                },
                'Festival Kembang Api': {
                    particles: ['🎆','🎇','✨','💥','🌟'],
                    colors: ['#facc15','#f472b6','#60a5fa','#4ade80','#fb923c'],
                    ambient: 'fireworks',
                    suasana: '🎆 Langit malam penuh warna! Satu per satu kembang api meledak membentuk pola indah. Wajah warga berseri-seri.',
                    npcDialogues: [
                        'Kembang api ini biayanya mahal lho — ditanggung swadaya warga. Itu namanya gotong royong!',
                        'Setiap warna kembang api punya makna berbeda. Emas = kemakmuran, Merah = keberanian!',
                        'Waktu kecil saya takut suara kembang api. Sekarang malah jadi yang paling semangat nonton!',
                        'Lihat yang itu! Berbentuk bunga! Siapa yang desain ya?',
                        'Momen indah itu perlu dinikmati. Jangan terus-terusan kerja — sesekali berhenti dan lihat ke atas.',
                        '💡 HINT: Beli kembang api kecil dari Merchant untuk acara spesial pribadimu!',
                    ],
                    hint: '💡 Festival ini terbaik dinikmati bersama orang tersayang — ajak love interest-mu!',
                },
                'Festival Musik': {
                    particles: ['🎵','🎶','🎸','🎺','✨'],
                    colors: ['#a855f7','#ec4899','#3b82f6','#fbbf24','#10b981'],
                    ambient: 'notes',
                    suasana: '🎵 Musik mengalun dari segala arah! Ada band dadakan di panggung utama, pengamen di pojok, dan anak-anak menari spontan.',
                    npcDialogues: [
                        'Penyanyi malam ini kabarnya punya suara emas. Jangan lewatkan penampilannya!',
                        'Musik itu bahasa universal — semua orang bisa merasakannya tanpa perlu kata-kata.',
                        'Saya dulu bercita-cita jadi musisi. Tapi ternyata susah hidup dari musik... Tapi aku tidak menyesal mencoba!',
                        'Ada slot penampil dadakan! Kalau berani naik panggung, bisa dapat reputasi besar!',
                        'REP-mu tinggi? Coba naik panggung dan nyanyi. Kamu mungkin berbakat!',
                        '🧚 HINT PERI: Konon suara musik festival bisa terdengar sampai ke Kahyangan Wilis di lereng Gunung Wilis! Para Widadari menari mengikuti alunan. Buka Kahyangan-mu dan kumpulkan Serbuk Wilis — ada bonus kebahagiaan peri hari ini!',
                        '💡 HINT: Butuh REP 10+ untuk naik panggung. Hadiahnya Reputasi besar!',
                    ],
                    hint: '💡 REP tinggi membuka peluang tampil di panggung utama festival! 🧚 Cek Kahyangan Wilis — peri ikut berbahagia saat festival musik!',
                },
                'Pesta Panen Anggur': {
                    particles: ['🍇','🍷','🌿','✨','🌟'],
                    colors: ['#7c3aed','#9333ea','#c084fc','#fbbf24','#dc2626'],
                    ambient: 'leaves',
                    suasana: '🍇 Anggur ungu memerah di seluruh kebun! Warga memetik bersama sambil bernyanyi. Jus anggur segar dibagikan gratis.',
                    npcDialogues: [
                        'Panen anggur tahun ini terbaik dalam 5 tahun terakhir! Lihat warnanya — sempurna!',
                        'Anggur desa kita terkenal di kota karena dirawat dengan cara tradisional.',
                        'Jus anggur ini bisa meningkatkan energimu — minum satu gelas dan coba deh!',
                        'Dari satu pohon anggur bisa dapat puluhan buah. Pertanian itu investasi jangka panjang.',
                        'Kalau musim panen, semua warga bantu memanen. Ini gotong-royong sejati!',
                        '🧚 HINT PERI: Para Widadari Kahyangan Wilis sangat suka Kristal Brantas yang terbentuk dari embun pagi hari panen anggur! Rajin kunjungi Kahyangan dan bangun bangunan untuk mengundang lebih banyak peri berbakat.',
                        '💡 HINT: Energi bertambah setelah minum jus anggur gratis di festival ini!',
                    ],
                    hint: '💡 Energi +20 gratis dari jus anggur festival! 🧚 Panen anggur menghasilkan Kristal Brantas langka di Kahyangan Wilis!',
                },
                'Festival Domba': {
                    particles: ['🐑','🌿','🎊','🌟','⭐'],
                    colors: ['#fff','#f1f5f9','#fbbf24','#84cc16','#60a5fa'],
                    ambient: 'petals',
                    suasana: '🐑 Domba-domba berbulu lebat berjalan anggun melewati penonton. Warga bertepuk tangan dan tertawa melihat tingkah laku lucu mereka.',
                    npcDialogues: [
                        'Domba Pak Hasan yang putih itu juara tiga tahun berturut-turut. Rahasianya? Dimandikan susu!',
                        'Wool dari domba desa bisa dibuat kain yang hangat dan mahal. Bisnis yang menjanjikan!',
                        'Aku suka domba karena matanya yang lembut. Tidak pernah terlihat marah.',
                        'Festival domba ini juga ajang silaturahmi peternak dari desa tetangga.',
                        'Merawat hewan itu mengajarkan tanggung jawab. Bagus untuk karakter seseorang.',
                        '💡 HINT: Punya peliharaan hewan? Rawat setiap hari untuk unlock event khusus!',
                    ],
                    hint: '💡 Peliharaan yang terawat membuka dialog dan bonus event khusus!',
                },
                'Malam Hantu': {
                    particles: ['👻','🎃','🕷️','🦇','💀'],
                    colors: ['#7c3aed','#f97316','#1e293b','#64748b','#a855f7'],
                    ambient: 'dark_sparks',
                    suasana: '🎃 Lentera labu menyala di sepanjang jalan! Anak-anak berpakaian monster berlarian. Ada yang menjerit kaget di pojok gelap.',
                    npcDialogues: [
                        'Trick or Treat! Kasih permen atau aku ganggu tidurmu! 👻',
                        'Katanya malam ini roh leluhur desa mengunjungi kita. Jadi berbuat baiklah!',
                        'Saya tidak percaya hantu. Tapi malam ini... ada yang aneh di arah candi kuno...',
                        'Kostum hantuku bagus kan? Beli dari penjahit Marine — recommended!',
                        'Jangan sendirian ke arah dungeon malam ini. Beneran, bukan bercanda.',
                        '💡 HINT: Beri Coklat ke anak-anak untuk dapat hadiah misterius!',
                    ],
                    hint: '💡 Beri Coklat ke anak-anak = dapat hadiah acak!',
                },
                'Lomba Mancing Es': {
                    particles: ['🎣','❄️','🐟','💎','⛄'],
                    colors: ['#bae6fd','#e0f2fe','#fff','#60a5fa','#38bdf8'],
                    ambient: 'snow',
                    suasana: '❄️ Danau membeku dengan indah! Para pemancing duduk rapi di tepi lubang es, menunggu dengan sabar. Napas mereka mengepul di udara dingin.',
                    npcDialogues: [
                        'Mancing di es itu butuh kesabaran ekstra. Ikan di bawah lebih lambat geraknya karena dingin.',
                        'Katanya ikan paling besar di danau ini belum pernah tertangkap selama 20 tahun!',
                        'Bawa minimal 3 ikan untuk ikut kompetisi. Aku sudah punya 7!',
                        'Suhu hari ini sangat dingin — jaga energimu. Minum teh hangat dulu sebelum mancing.',
                        'Juara mancing Es tahun lalu dapat Scroll EXP langka. Kamu mau coba menangi itu?',
                        '💡 HINT: Kumpulkan 3+ ikan (besar/biasa/legendaris) untuk ikut kompetisi!',
                    ],
                    hint: '💡 Ikan Legendaris memberi poin tertinggi di kompetisi mancing!',
                },
                'Pesta Sup Hangat': {
                    particles: ['🍲','♨️','🌿','✨','🌟'],
                    colors: ['#f97316','#fbbf24','#dc2626','#84cc16','#fff'],
                    ambient: 'smoke',
                    suasana: '🍲 Aroma sup mengepul dari panci-panci besar! Warga duduk melingkar di meja panjang, berbagi makanan hangat di musim dingin.',
                    npcDialogues: [
                        'Sup hangat di musim dingin seperti ini adalah kebahagiaan paling sederhana!',
                        'Resep sup desa ini sudah diwariskan 7 generasi. Tidak berubah sekalipun.',
                        'Makan bersama adalah ikatan sosial yang paling kuat. Lebih kuat dari kontrak manapun.',
                        'Saya sumbang 10 bahan herbal untuk sup malam ini. Kontribusi kecil untuk kebersamaan.',
                        'Di kampung asal saya, pesta seperti ini namanya kenduri. Sama maknanya — berbagi.',
                        '💡 HINT: Energi dan kesehatan pulih penuh setelah ikut pesta sup bersama!',
                    ],
                    hint: '💡 Energi full setelah makan sup bersama warga!',
                },
                'Malam Bintang': {
                    particles: ['🌟','⭐','✨','🌙','💫'],
                    colors: ['#fbbf24','#fff','#e0f2fe','#a855f7','#60a5fa'],
                    ambient: 'snow',
                    suasana: '🌟 Pohon Natal dan bintang-bintang menghiasi alun-alun! Lagu-lagu damai mengalun pelan. Ada kehangatan di setiap sudut desa.',
                    npcDialogues: [
                        'Selamat Malam Bintang! Semoga kebaikan mengisi hatimu hari ini!',
                        'Kado di bawah pohon itu untuk semua warga. Sudah ambil belum?',
                        'Malam ini adalah tentang syukur dan kebersamaan — apapun latar belakangmu.',
                        'Bintang di langit malam ini sangat terang. Katanya itu pertanda tahun depan akan baik.',
                        'Aku simpan satu kado untuk orang yang paling baik hatiku kenal. Itu kamu!',
                        '🧚 HINT PERI: Di Malam Bintang, Cahaya Wilis — sumber daya paling langka Kahyangan — dapat turun dari bintang-bintang! Cek Pohon Kehidupan di Kahyangan Wilis malam ini jika sudah kamu bangun.',
                        '💡 HINT: Buka kado misterius di bawah pohon — hadiah berganti tiap tahun!',
                    ],
                    hint: '💡 Buka kado tahunan misterius — hadiahnya berganti tiap tahun! 🧚 Malam Bintang = kesempatan langka dapat Cahaya Wilis di Kahyangan!',
                },
                'Malam Akhir Tahun': {
                    particles: ['🎆','🎇','🕛','✨','🌟'],
                    colors: ['#facc15','#f472b6','#60a5fa','#4ade80','#fb923c'],
                    ambient: 'fireworks',
                    suasana: '🕛 Hitungan mundur 10... 9... 8...! Seluruh desa berkumpul menunggu detik pergantian tahun. Ada rasa haru dan harapan bercampur.',
                    npcDialogues: [
                        'Tahun yang penuh pelajaran akan berlalu malam ini. Apa pelajaran terbesar yang kamu dapat?',
                        'Resolusiku tahun depan: lebih banyak menabung dan kurang jajan impulsif!',
                        'Lihat! Kembang api dari kota bisa kelihatan dari sini. Indah sekali!',
                        '10... 9... 8... Sebentar lagi! Siap-siap ya!',
                        'Waktu itu tidak bisa dikembalikan. Tapi kita bisa memilih apa yang kita lakukan dengan waktu yang tersisa.',
                        '💡 HINT: Pergantian tahun membawa reset resolusi dan bonus awal tahun baru besok!',
                    ],
                    hint: '💡 Besok adalah Tahun Baru — angpao menunggu di festival!',
                },
            };

            // Helper: ambil data festival hari ini
            function getTodayFestivalData() {
                const dayInSeason = ((STATE.day - 1) % DAYS_PER_SEASON) + 1;
                const calEvent = CALENDAR_EVENTS[STATE.season]?.[dayInSeason];
                if (!calEvent || calEvent.type !== 'festival') return null;
                // Cari matching FESTIVAL_DATA
                const festName = calEvent.name;
                for (const key of Object.keys(FESTIVAL_DATA)) {
                    if (festName.includes(key)) return { ...FESTIVAL_DATA[key], name: calEvent.name, icon: calEvent.icon };
                }
                // Fallback generic
                return { name: calEvent.name, icon: calEvent.icon, particles:['🎉','✨','🌟'], colors:['#fbbf24','#f472b6','#60a5fa'], ambient:'generic', suasana:'🎉 Warga desa berkumpul merayakan festival bersama!', npcDialogues:['Selamat festival!','Senangnya hari ini!','Ikut merayakan yuk!'], hint:'💡 Nikmati festival bersama warga desa!' };
            }

            // State festival aktif
            STATE.festivalActive = false;
            STATE.festivalNPCPositions = {}; // simpan posisi NPC asli
            STATE.festivalParticleTimer = 0;

            // ── AKTIFKAN FESTIVAL: pindahkan NPC ke alun-alun ──────────────
            function activateFestivalGathering(festData) {
                if (STATE.festivalActive) return;
                STATE.festivalActive = true;

                const map = STATE.maps['village'];
                if (!map || !map.npcs) return;

                // Simpan posisi asli & pindahkan NPC ke spot berkumpul
                map.npcs.forEach((npc, i) => {
                    if (npc.x < 0) return; // Skip hidden NPC
                    STATE.festivalNPCPositions[npc.id] = { x: npc.x, y: npc.y, type: npc.type, schedule: npc.schedule };
                    const spot = FESTIVAL_GATHER_SPOTS[i % FESTIVAL_GATHER_SPOTS.length];
                    npc.x = spot.x + (Math.random() > 0.5 ? 1 : -1); // sedikit variasi
                    npc.y = spot.y + (Math.random() > 0.5 ? 1 : -1);
                    npc.type = 'static'; // berhenti wandering
                });

                // Update dialog NPC dengan dialog festival
                STATE.activeFestivalData = festData;

                // Notif opening ceremony
                setTimeout(() => {
                    showDialogue(`${festData.icon} FESTIVAL DIMULAI! — ${festData.name}`,
                        `${festData.suasana}\n\n` +
                        `🔔 Seluruh aktivitas hari ini LIBUR:\n` +
                        `• Shift kerja ditangguhkan\n• Kuliah diliburkan\n• Part-time tidak ada\n\n` +
                        `Gunakan waktu ini untuk menikmati festival bersama warga!\n\n${festData.hint}`,
                        [
                            { text: '🎉 Bergabung ke Alun-alun!', action: () => {
                                closeDialogue();
                                STATE.player.x = 24 * TILE_SIZE;
                                STATE.player.y = 22 * TILE_SIZE;
                                showToast(`${festData.icon} Selamat datang di ${festData.name}!`);
                                // Burst particles
                                for (let i = 0; i < 15; i++) {
                                    setTimeout(() => {
                                        createParticle(
                                            STATE.player.x + (Math.random()-0.5)*100,
                                            STATE.player.y + (Math.random()-0.5)*60,
                                            festData.colors[Math.floor(Math.random()*festData.colors.length)]
                                        );
                                    }, i * 80);
                                }
                            }},
                            { text: '📅 Lihat Acara Festival', action: () => {
                                closeDialogue();
                                // Buka startFestivalEvent
                                const dayInSeason = ((STATE.day - 1) % DAYS_PER_SEASON) + 1;
                                const calEvent = CALENDAR_EVENTS[STATE.season]?.[dayInSeason];
                                if (calEvent) startFestivalEvent(calEvent);
                            }},
                        ], null
                    );
                }, 1200);
            }

            // ── NONAKTIFKAN FESTIVAL: kembalikan NPC ke posisi asal ────────
            function deactivateFestivalGathering() {
                if (!STATE.festivalActive) return;
                STATE.festivalActive = false;
                const map = STATE.maps['village'];
                if (!map || !map.npcs) return;
                map.npcs.forEach(npc => {
                    const saved = STATE.festivalNPCPositions[npc.id];
                    if (saved) {
                        npc.x = saved.x;
                        npc.y = saved.y;
                        npc.type = saved.type;
                        npc.schedule = saved.schedule;
                    }
                });
                STATE.festivalNPCPositions = {};
                STATE.activeFestivalData = null;
            }

            // ── PARTIKEL AMBIENT FESTIVAL (dipanggil dari game loop) ────────
            function updateFestivalAmbientParticles() {
                if (!STATE.festivalActive || !STATE.activeFestivalData) return;
                if (STATE.location !== 'village') return;
                STATE.festivalParticleTimer = (STATE.festivalParticleTimer || 0) + 1;

                const fest = STATE.activeFestivalData;
                const ambient = fest.ambient || 'generic';
                const colors = fest.colors || ['#fbbf24','#f472b6','#60a5fa'];
                const cam = STATE.camera || { x: 0, y: 0 };
                const W = 480, H = 320;

                // Spawn partikel sesuai tipe
                if (STATE.festivalParticleTimer % 8 === 0) { // setiap 8 frame
                    const numSpawn = 3;
                    for (let i = 0; i < numSpawn; i++) {
                        const px = cam.x + Math.random() * W;
                        const py = cam.y + Math.random() * H * 0.6; // mostly upper half

                        if (ambient === 'fireworks') {
                            // Kembang api: meledak dari bawah
                            if (Math.random() < 0.15) { // burst sesekali
                                const burstX = cam.x + Math.random() * W;
                                const burstY = cam.y + Math.random() * H * 0.4;
                                for (let j = 0; j < 8; j++) {
                                    STATE.particles.push({
                                        x: burstX, y: burstY,
                                        vx: (Math.random()-0.5)*6,
                                        vy: (Math.random()-0.5)*6,
                                        life: 25 + Math.random()*10,
                                        color: colors[Math.floor(Math.random()*colors.length)],
                                        size: 3
                                    });
                                }
                            }
                        } else if (ambient === 'petals') {
                            // Kelopak bunga: jatuh perlahan dengan sedikit drift
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y - 10,
                                vx: (Math.random()-0.5)*1.5,
                                vy: 0.8 + Math.random()*0.8,
                                life: 60 + Math.random()*30,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 4,
                                drift: true
                            });
                        } else if (ambient === 'snow') {
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y - 10,
                                vx: (Math.random()-0.5)*1.2,
                                vy: 0.6 + Math.random()*0.6,
                                life: 80,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 3
                            });
                        } else if (ambient === 'leaves') {
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y - 10,
                                vx: (Math.random()-0.5)*2.5,
                                vy: 1.0 + Math.random()*1.5,
                                life: 50,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 5,
                                spin: true
                            });
                        } else if (ambient === 'notes') {
                            // Musik notes melayang naik
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y + H * 0.8,
                                vx: (Math.random()-0.5)*1.5,
                                vy: -(0.8 + Math.random()*1.2),
                                life: 50,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 4
                            });
                        } else if (ambient === 'bubbles') {
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y + H,
                                vx: (Math.random()-0.5)*1.2,
                                vy: -(1.0 + Math.random()*1.0),
                                life: 45,
                                color: '#7dd3fc',
                                size: 5 + Math.random()*4
                            });
                        } else if (ambient === 'dark_sparks') {
                            // Halloween — gelap + percikan ungu/oranye
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y + Math.random() * H,
                                vx: (Math.random()-0.5)*3,
                                vy: (Math.random()-0.5)*3,
                                life: 20 + Math.random()*15,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 2 + Math.random()*3
                            });
                        } else if (ambient === 'smoke') {
                            // Asap memasak — melayang ke atas
                            STATE.particles.push({
                                x: cam.x + Math.random() * W * 0.5 + W * 0.25,
                                y: cam.y + H * 0.7,
                                vx: (Math.random()-0.5)*0.8,
                                vy: -(0.5 + Math.random()*0.5),
                                life: 70,
                                color: 'rgba(200,200,200,0.4)',
                                size: 7 + Math.random()*5
                            });
                        } else if (ambient === 'dust') {
                            // Debu pacuan kuda
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y + H * 0.8 + Math.random() * H * 0.2,
                                vx: 2 + Math.random()*2,
                                vy: -(0.3 + Math.random()*0.5),
                                life: 25,
                                color: '#d97706',
                                size: 4 + Math.random()*4
                            });
                        } else {
                            // Generic — confetti
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y - 10,
                                vx: (Math.random()-0.5)*2,
                                vy: 1 + Math.random()*1.5,
                                life: 50,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 4
                            });
                        }
                    }
                }
            }

            // ── HOOK: NPC DIALOG SAAT FESTIVAL ─────────────────────────────
            function getFestivalNPCDialogue(npcId) {
                if (!STATE.festivalActive || !STATE.activeFestivalData) return null;
                const dialogues = STATE.activeFestivalData.npcDialogues || [];
                if (dialogues.length === 0) return null;
                // Pilih dialog berdasarkan NPC ID hash (deterministik per hari)
                const hash = (npcId || '').split('').reduce((a,c) => a + c.charCodeAt(0), 0);
                return dialogues[(hash + STATE.day) % dialogues.length];
            }

            // ── TRIGGER FESTIVAL DI AWAL HARI ──────────────────────────────
            // ── REMINDER FESTIVAL H-1 via Sistem Pesan HP ─────────────────
            function checkFestivalReminder() {
                const totalDays = STATE.day - 1; // hari ke-0 based
                const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;
                const seasonIdx = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                const season = SEASONS[seasonIdx];

                // Cek hari BESOK
                const nextDayInSeason = (dayInSeason % DAYS_PER_SEASON) + 1;
                const nextSeasonEvents = CALENDAR_EVENTS[season] || {};
                const tomorrowEvent = nextSeasonEvents[nextDayInSeason];

                if (!tomorrowEvent || tomorrowEvent.type !== 'festival') return;

                // Hindari duplikat reminder di hari yang sama
                const reminderKey = `reminder_${season}_${nextDayInSeason}`;
                if (STATE.player[reminderKey]) return;
                STATE.player[reminderKey] = true;

                // Petunjuk persiapan per festival
                const hints = {
                    'Memasak':   '🐟 Siapkan Ikan Segar di inventory untuk ikut lomba!',
                    'Berenang':  '💪 Pastikan STR kamu ≥15 untuk bisa menang!',
                    'Bunga':     '🌹 Beli bunga dari toko sebelum festival dimulai!',
                    'Panen':     '🌾 Kumpulkan hasil panen untuk disetor ke Kepala Desa!',
                    'Musik':     '🎤 REP ≥10 dibutuhkan untuk tampil di panggung!',
                    'Mancing':   '🎣 Kumpulkan 3 ikan dulu sebelum festival besok!',
                    'Kuda':      '💰 Siapkan 500G untuk taruhan pacuan kuda!',
                    'Ayam':      '🐔 Rawat hewan peliharaan hari ini untuk bonus kontes!',
                    'Tahun Baru':'🎆 Besok libur total — nikmati kembang api bersama warga!',
                };
                let hint = '✨ Hadir di alun-alun untuk bergabung dengan warga!';
                for (const [key, val] of Object.entries(hints)) {
                    if (tomorrowEvent.name.includes(key)) { hint = val; break; }
                }

                // Kirim ke sistem pesan HP yang sudah ada
                if (!STATE.player.messages) STATE.player.messages = [];
                STATE.player.messages.push({
                    from: '📅 Kalender Desa',
                    text: `${tomorrowEvent.icon} BESOK: ${tomorrowEvent.name}!\n\n${hint}\n\nJangan sampai ketinggalan — festival hanya berlangsung 1 hari!`,
                    time: Date.now(),
                    read: false
                });

                // Toast notification
                showToast(`🔔 Reminder: Besok ada ${tomorrowEvent.icon} ${tomorrowEvent.name}! Cek HP untuk tips persiapan.`);
            }

            function checkAndStartFestival() {
                const fest = getTodayFestivalData();
                if (!fest) {
                    // Bukan festival — deactivate jika masih aktif
                    if (STATE.festivalActive) deactivateFestivalGathering();
                    return;
                }
                // Cek apakah sudah pernah start hari ini
                if (STATE.lastFestivalDay === STATE.day) return;
                STATE.lastFestivalDay = STATE.day;
                activateFestivalGathering(fest);
            }

            // ── BLOK SHIFT/KULIAH SAAT FESTIVAL ────────────────────────────
            function isFestivalDayToday() {
                return !!getTodayFestivalData();
            }

            // ── BLOK SHIFT/KULIAH SAAT FESTIVAL ────────────────────────────
            function isFestivalDayToday() {
                return !!getTodayFestivalData();
            }

            // ── HELPER: BUAT OPSI FESTIVAL KHUSUS ROLE ─────────────────────
            function getRoleFestivalOption(festivalType) {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return null;

                const options = {
                    'Musik': {
                        'student': {
                            req: p.int >= 12,
                            text: `🎓 [SISWA] Baca Puisi di Panggung (INT ${p.int})`,
                            reqLabel: 'INT 12+',
                            action: () => {
                                const score = (p.int || 0) + Math.floor(Math.random() * 25);
                                if (score >= 22) {
                                    p.reputation = (p.reputation || 0) + 15; p.int = (p.int || 0) + 2;
                                    showDialogue('🎤 STANDING OVATION!',
                                        'Puisimu tentang tekanan akademik menyentuh hati semua orang!\n\n+15 REP · +2 INT\n\n📚 Keberanian berekspresi di depan umum membangun kepercayaan diri yang tak ternilai.',
                                        [{ text: 'Terharu!', action: closeDialogue }]);
                                } else {
                                    p.reputation = (p.reputation || 0) + 5;
                                    showDialogue('🎵 Penampilan Lumayan',
                                        'Kamu grogi tapi tetap selesai tampil. Penonton bertepuk tangan sopan.\n\n+5 REP\n\n📚 Berani mencoba sudah setengah keberhasilan!',
                                        [{ text: 'Lumayan!', action: closeDialogue }]);
                                }
                            }
                        },
                        'entrepreneur': {
                            req: p.biz >= 8,
                            text: `💼 [WIRAUSAHA] Buka Lapak Merchandise (BIZ ${p.biz})`,
                            reqLabel: 'BIZ 8+',
                            action: () => {
                                const profit = 400 + (p.biz || 0) * 60;
                                p.money += profit; p.biz = (p.biz || 0) + 2;
                                showToast(`💰 Lapak merchandise laris! +${profit} G · +2 BIZ`);
                                closeDialogue();
                            }
                        },
                        'worker': {
                            req: p.str >= 10,
                            text: `⚔️ [PEKERJA] Jadi Security Festival (STR ${p.str})`,
                            reqLabel: 'STR 10+',
                            action: () => {
                                p.money += 350; p.str = (p.str || 0) + 1;
                                showToast('💪 Tugas security selesai! +350G · +1 STR');
                                closeDialogue();
                            }
                        },
                        'family': {
                            req: (p.reputation || 0) >= 15,
                            text: `🏠 [KELUARGA] Ajak Keluarga Nonton Bersama`,
                            reqLabel: 'REP 15+',
                            action: () => {
                                p.reputation = (p.reputation || 0) + 10;
                                const spouseId = p.spouseId;
                                if (spouseId && p.relationships) p.relationships[spouseId] = Math.min(100, (p.relationships[spouseId] || 0) + 8);
                                showToast('❤️ Momen indah bersama keluarga! +10 REP · +8 Love');
                                closeDialogue();
                            }
                        }
                    },
                    'Memasak': {
                        'student': {
                            req: (p.int || 0) >= 15 && (p.inventory['ikan_segar'] || 0) > 0,
                            text: `🎓 [SISWA] Presentasi Teknik Masak (INT ${p.int})`,
                            reqLabel: 'INT 15+ & Ikan',
                            action: () => {
                                p.inventory['ikan_segar'] = (p.inventory['ikan_segar'] || 1) - 1;
                                const score = (p.int || 0) + Math.floor(Math.random() * 20);
                                if (score >= 30) {
                                    p.int = (p.int || 0) + 3; addItem('scroll_exp', 1);
                                    showDialogue('🏆 JUARA INOVASI!', 'Teknik masakmu berbasis sains bikin juri kagum!\n\n+3 INT · Gulungan EXP', [{ text: 'Mantap!', action: closeDialogue }]);
                                } else {
                                    p.int = (p.int || 0) + 1;
                                    showDialogue('📚 Pengalaman Berharga', 'Eksperimenmu menarik meski belum sempurna.\n\n+1 INT', [{ text: 'Belajar terus!', action: closeDialogue }]);
                                }
                            }
                        },
                        'entrepreneur': {
                            req: (p.biz || 0) >= 5,
                            text: `💼 [WIRAUSAHA] Jual Bumbu Rahasia (BIZ ${p.biz})`,
                            reqLabel: 'BIZ 5+',
                            action: () => {
                                const profit = 300 + (p.biz || 0) * 80;
                                p.money += profit; p.biz = (p.biz || 0) + 1;
                                showToast(`🌶️ Bumbu laris! +${profit} G · +1 BIZ`);
                                closeDialogue();
                            }
                        },
                        'worker': {
                            req: (p.str || 0) >= 12,
                            text: `⚔️ [PEKERJA] Jadi Tukang Angkut Peralatan (STR ${p.str})`,
                            reqLabel: 'STR 12+',
                            action: () => {
                                p.money += 400; p.str = (p.str || 0) + 2; p.energy = Math.max(0, p.energy - 20);
                                showToast('💪 Kerja keras terbayar! +400G · +2 STR');
                                closeDialogue();
                            }
                        },
                        'family': {
                            req: true,
                            text: `🏠 [KELUARGA] Masak Bersama Pasangan`,
                            reqLabel: '',
                            action: () => {
                                p.energy = Math.min(100, p.energy + 30); p.reputation = (p.reputation || 0) + 8;
                                const spouseId = p.spouseId;
                                if (spouseId && p.relationships) p.relationships[spouseId] = Math.min(100, (p.relationships[spouseId] || 0) + 12);
                                showToast('❤️ Masak bareng pasangan! +30 Energi · +8 REP · +12 Love');
                                closeDialogue();
                            }
                        }
                    },
                    'Panen': {
                        'student': {
                            req: (p.int || 0) >= 10,
                            text: `🎓 [SISWA] Dokumentasi Proses Panen (INT ${p.int})`,
                            reqLabel: 'INT 10+',
                            action: () => {
                                gainExp(30); p.int = (p.int || 0) + 1;
                                p.achievementPoints = (p.achievementPoints || 0) + 5;
                                showToast('📸 Dokumentasi panen untuk portofolio! +30 EXP · +1 INT · +5 AP');
                                closeDialogue();
                            }
                        },
                        'entrepreneur': {
                            req: (p.biz || 0) >= 5,
                            text: `💼 [WIRAUSAHA] Buka Lapak Dadakan Hasil Panen (BIZ ${p.biz})`,
                            reqLabel: 'BIZ 5+',
                            action: () => {
                                const items = Object.entries(p.inventory || {}).filter(([k,v]) => ['beras','jagung_panen','tomat_panen'].includes(k) && v > 0);
                                if (items.length === 0) { showToast('Tidak ada hasil panen di inventory!'); return; }
                                let totalProfit = 0;
                                items.forEach(([k, v]) => {
                                    const price = k === 'beras' ? 80 : k === 'jagung_panen' ? 60 : 70;
                                    totalProfit += price * v * 2; // Harga festival 2x lipat!
                                    p.inventory[k] = 0;
                                });
                                p.money += totalProfit; p.biz = (p.biz || 0) + 2;
                                showDialogue('🛒 LAPAK LARIS!',
                                    `Semua hasil panenmu terjual dengan harga festival (2x lipat)!\n\n+${totalProfit} G · +2 BIZ\n\n📚 Festival adalah momen pasar terbaik — supply sedikit, demand tinggi!`,
                                    [{ text: 'Cuan!', action: closeDialogue }]);
                            }
                        },
                        'worker': {
                            req: (p.str || 0) >= 8,
                            text: `⚔️ [PEKERJA] Bantu Angkut Hasil Panen (STR ${p.str})`,
                            reqLabel: 'STR 8+',
                            action: () => {
                                const wage = 300 + (p.str || 0) * 40;
                                p.money += wage; p.str = (p.str || 0) + 1;
                                showToast(`💪 Bantu panen selesai! +${wage} G · +1 STR`);
                                closeDialogue();
                            }
                        },
                        'family': {
                            req: true,
                            text: `🏠 [KELUARGA] Gotong Royong Bersama Tetangga`,
                            reqLabel: '',
                            action: () => {
                                p.reputation = (p.reputation || 0) + 15;
                                addItem('beras', 3);
                                showToast('🤝 Gotong royong! +15 REP · +3 Beras');
                                closeDialogue();
                            }
                        }
                    },
                    'Bunga': {
                        'student': {
                            req: (p.int || 0) >= 8,
                            text: `🎓 [SISWA] Tulis Puisi Cinta (INT ${p.int})`,
                            reqLabel: 'INT 8+',
                            action: () => {
                                p.int = (p.int || 0) + 1; p.reputation = (p.reputation || 0) + 8;
                                const spouseId = p.spouseId;
                                if (spouseId && p.relationships) p.relationships[spouseId] = Math.min(100, (p.relationships[spouseId] || 0) + 20);
                                showToast('✍️ Puisi cintamu menyentuh hati! +1 INT · +8 REP · +20 Love');
                                closeDialogue();
                            }
                        },
                        'entrepreneur': {
                            req: (p.inventory['bunga'] || 0) > 0 || (p.biz || 0) >= 5,
                            text: `💼 [WIRAUSAHA] Jual Bunga Harga Festival (3x)`,
                            reqLabel: 'Punya Bunga atau BIZ 5+',
                            action: () => {
                                const jumlah = p.inventory['bunga'] || 0;
                                if (jumlah > 0) {
                                    const profit = jumlah * 300; // 3x harga normal
                                    p.inventory['bunga'] = 0; p.money += profit; p.biz = (p.biz || 0) + 1;
                                    showToast(`🌸 Bunga terjual 3x lipat! +${profit} G · +1 BIZ`);
                                } else {
                                    showToast('Tidak ada bunga di inventory!');
                                }
                                closeDialogue();
                            }
                        },
                        'worker': {
                            req: true,
                            text: `⚔️ [PEKERJA] Bantu Dekorasi Venue Festival`,
                            reqLabel: '',
                            action: () => {
                                p.money += 250; p.reputation = (p.reputation || 0) + 5;
                                showToast('🎀 Dekorasi selesai! +250G · +5 REP');
                                closeDialogue();
                            }
                        },
                        'family': {
                            req: !!p.spouseId,
                            text: `🏠 [KELUARGA] Rayakan Bersama Pasangan (Love 2x)`,
                            reqLabel: 'Sudah menikah',
                            action: () => {
                                const spouseId = p.spouseId;
                                if (spouseId && p.relationships) {
                                    p.relationships[spouseId] = Math.min(100, (p.relationships[spouseId] || 0) + 25);
                                }
                                p.reputation = (p.reputation || 0) + 10;
                                showToast('❤️ Momen romantis! +25 Love · +10 REP');
                                closeDialogue();
                            }
                        }
                    }
                };

                const festOpts = options[festivalType];
                if (!festOpts) return null;
                const roleOpt = festOpts[role];
                if (!roleOpt) return null;

                const reqMet = roleOpt.req;
                const label = reqMet
                    ? roleOpt.text
                    : `${roleOpt.text} [Butuh: ${roleOpt.reqLabel}] 🔒`;

                return {
                    text: label,
                    action: reqMet ? roleOpt.action : () => {
                        showToast(`Butuh ${roleOpt.reqLabel} untuk pilihan ini!`);
                    }
                };
            }

            // 2. LOGIKA EVENT FESTIVAL
            function startFestivalEvent(eventData) {
                const p = STATE.player;
                const name = eventData.name;

                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                createParticle(p.x, p.y, '#facc15');
                createParticle(p.x + 10, p.y - 10, '#f472b6');
                createParticle(p.x - 10, p.y - 10, '#60a5fa');

                // 1. TAHUN BARU
                if (name.includes("Tahun Baru")) {
                    showDialogue("FESTIVAL TAHUN BARU",
                        "Kembang api menghiasi langit siang ini! (Imajiner)\nKepala Desa membagikan **Angpao** untuk modal awal tahun.",
                        [{
                            text: "Terima Angpao (+2000 G)",
                            action: () => {
                                p.money += 2000;
                                showToast("Dapat Angpao 2000G! 🧧");
                                closeDialogue();
                            }
                        }], 'images/statue.png');
                }
                // 2. VALENTINE
                else if (name.includes("Valentine") || name.includes("Bunga")) {
                    const roleOpt = getRoleFestivalOption('Bunga');
                    const bungaOpts = [
                        {
                            text: "Beli Bunga Spesial (100 G)",
                            action: () => {
                                if (p.money >= 100) {
                                    p.money -= 100;
                                    addItem('bunga', 3);
                                    showToast("Dapat 3 Bunga Mawar! 🌹");
                                    showDialogue("ROMANTIS", "Berikan bunga ini pada orang yang kamu sukai. Efek cintanya 2x lipat hari ini!", [{ text: "Siap!", action: closeDialogue }], 'images/bunga.png');
                                } else showToast("Uang tidak cukup.");
                            }
                        },
                        roleOpt,
                        { text: "Hanya melihat-lihat", action: closeDialogue }
                    ].filter(Boolean);
                    showDialogue("FESTIVAL KASIH SAYANG",
                        `Hari ini adalah hari terbaik untuk mengungkapkan perasaan.\nBunga Mawar dijual murah khusus hari ini!\n\n✨ Role ${(p.role||'none').toUpperCase()} punya cara spesial merayakan festival ini!`,
                        bungaOpts, 'images/bunga.png');
                }
                // 3. PACUAN KUDA
                else if (name.includes("Pacuan Kuda")) {
                    const horses = ["Si Kancil (Hitam)", "Bintang (Putih)", "Halilintar (Coklat)"];
                    const opts = horses.map(h => ({
                        text: `Taruhan: ${h} (500 G)`,
                        action: () => {
                            if (p.money >= 500) {
                                p.money -= 500;
                                const winnerIdx = Math.floor(Math.random() * horses.length);
                                const winnerName = horses[winnerIdx];
                                if (h === winnerName) {
                                    const prize = 2000;
                                    p.money += prize;
                                    showDialogue("MENANG BESAR! 🏆", `Kudamu **${h}** finish di posisi pertama!\nHadiah: ${prize} G`, [{ text: "Yesss!", action: closeDialogue }], 'images/kuda.png');
                                } else {
                                    showDialogue("KALAH...", `Pemenangnya adalah **${winnerName}**.\nKudamu finish di posisi terakhir. Uang hangus.`, [{ text: "Sial...", action: closeDialogue }], 'images/kuda.png');
                                }
                            } else showToast("Uang kurang.");
                        }
                    }));
                    opts.push({ text: "Nonton saja", action: closeDialogue });
                    showDialogue("PACUAN KUDA DESA", "Ayo dukung kuda jagoanmu! Tiket taruhan 500 G.", opts, 'images/kuda.png');
                }
                // 4. LOMBA MEMASAK
                else if (name.includes("Memasak")) {
                    const roleOpt = getRoleFestivalOption('Memasak');
                    const opts = [
                        {
                            text: "Ikut Lomba (Butuh Ikan + INT)",
                            action: () => {
                                if ((p.inventory['ikan_segar'] || 0) > 0) {
                                    p.inventory['ikan_segar']--;
                                    const score = Math.floor(Math.random() * 50) + p.int;
                                    if (score > 60) {
                                        addItem('tonic_stamina', 3);
                                        showDialogue("JUARA 1! 👨‍🍳", `Rasanya sempurna! Juri menangis terharu.\nHadiah: **3 Tonic Stamina**.`, [{ text: "Hore!", action: closeDialogue }], 'images/dapurayaayu.png');
                                    } else if (score > 30) {
                                        addItem('gandum', 2);
                                        showDialogue("JUARA HARAPAN", "Rasanya lumayan, tapi kurang asin.\nHadiah: **2 Gandum**.", [{ text: "Lumayan", action: closeDialogue }], 'images/dapurayaayu.png');
                                    } else {
                                        showDialogue("GOSONG...", "Masakanmu gosong. Juri sakit perut. Kamu didiskualifikasi.", [{ text: "Maaf...", action: closeDialogue }], 'images/tungku.png');
                                    }
                                } else {
                                    showToast("Kamu tidak punya Ikan Segar!");
                                }
                            }
                        },
                        roleOpt,
                        {
                            text: "Jadi Penonton (Makan Gratis)", action: () => {
                                p.energy = 100;
                                showToast("Kenyang makan tester! Energi Full.");
                                closeDialogue();
                            }
                        }
                    ].filter(Boolean);
                    showDialogue("KITCHEN STADIUM", `Tema tahun ini: **Sup Ikan**. Juri akan menilai bahan dan skill memasakmu.\n\n✨ Role kamu (${(p.role||'none').toUpperCase()}) punya cara tersendiri untuk berpartisipasi!`, opts, 'images/dapurayaayu.png');
                }
                // 5. FESTIVAL AYAM
                else if (name.includes("Ayam")) {
                    const hasPetChicken = p.dailyTalkCount > 0;
                    if (hasPetChicken) {
                        showDialogue("KONTES AYAM", "Ayam milikmu terlihat sehat dan bahagia! Juri terkesan.", [{
                            text: "Terima Hadiah Telur Emas (500G)",
                            action: () => {
                                p.money += 500;
                                showToast("Hadiah Juara: 500 G");
                                closeDialogue();
                            }
                        }], 'images/ayam.png');
                    } else {
                        showDialogue("KONTES AYAM", "Kamu tidak membawa ayam atau belum merawat ayam hari ini.\nNonton saja ya.", [{ text: "Oke", action: closeDialogue }], 'images/ayam.png');
                    }
                }
                // 6. LOMBA BERENANG
                else if (name.includes("Berenang")) {
                    showDialogue("LOMBA RENANG PANTAI", "Siapa yang paling kuat menahan napas dan berenang ke tengah laut?",
                        [{
                            text: "Ikut Lomba (Butuh 50 Energi)",
                            action: () => {
                                if (p.energy >= 50) {
                                    p.energy -= 40;
                                    if (p.str >= 15) {
                                        addItem('permata', 1);
                                        showDialogue("JUARA RENANG! 🏊", "Ototmu luar biasa! Kamu mengalahkan Pak Nelayan.\nHadiah: **1 Berlian**.", [{ text: "Segar!", action: closeDialogue }], 'images/pantai-boy.png');
                                    } else {
                                        showDialogue("KALAH...", "Kamu kram di tengah jalan dan harus ditolong tim SAR.\nLatih lagi STR-mu.", [{ text: "Malu...", action: closeDialogue }], 'images/pantai-boy.png');
                                    }
                                } else showToast("Energimu kurang untuk lomba.");
                            }
                        }, { text: "Batal", action: closeDialogue }], 'images/pantai-girl.png');
                }
                // 7. HALLOWEEN
                else if (name.includes("Hantu") || name.includes("Halloween")) {
                    showDialogue("MALAM HANTU 🎃", "Anak-anak berkeliaran pakai kostum. 'Trick or Treat!'",
                        [
                            {
                                text: "Beri Permen (Coklat) -> Dapat Hadiah",
                                action: () => {
                                    if ((p.inventory['coklat'] || 0) > 0) {
                                        p.inventory['coklat']--;
                                        const rewards = ['besi', 'kain', 'gandum'];
                                        const reward = rewards[Math.floor(Math.random() * rewards.length)];
                                        addItem(reward, 2);
                                        showDialogue("TRICK OR TREAT!", `Anak-anak senang! Mereka memberimu **2 ${reward.toUpperCase()}** sebagai balasan.`, [{ text: "Seru!", action: closeDialogue }], 'images/anakkecil1.png');
                                    } else {
                                        showToast("Kamu tidak punya Coklat!");
                                    }
                                }
                            },
                            {
                                text: "Minta Permen (Dikasih Sampah)",
                                action: () => {
                                    showDialogue("ZONK", "Kamu kan sudah gede! Nih dikasih bungkusnya aja.", [{ text: "Pelit...", action: closeDialogue }], 'images/monster.png');
                                }
                            }
                        ], 'images/monster.png');
                }
                // 8. MANCING ES
                else if (name.includes("Mancing")) {
                    showDialogue("TURNAMEN MANCING ES", "Danau membeku, ikan-ikan bersembunyi di dalam. Siapa dapat ikan paling banyak?",
                        [{
                            text: "Setor Ikan (Dari Tas)",
                            action: () => {
                                const fish = (p.inventory['ikan_segar'] || 0) + (p.inventory['ikan_besar'] || 0) + (p.inventory['ikan_legendary'] || 0);
                                if (fish >= 3) {
                                    addItem('scroll_exp', 1);
                                    showDialogue("PEMANCING HANDAL 🎣", `Kamu membawa ${fish} ikan! Juri takjub.\nHadiah: **Gulungan Kuno (+EXP)**.`, [{ text: "Mantap", action: closeDialogue }], 'images/rakpialaikan.png');
                                } else {
                                    showDialogue("KURANG...", "Minimal bawa 3 ikan untuk ikut penilaian.", [{ text: "Aku mancing dulu", action: closeDialogue }], 'images/emberikan.png');
                                }
                            }
                        }, { text: "Batal", action: closeDialogue }], 'images/rakpancing.png');
                }
                // 9. NATAL
                else if (name.includes("Natal") || name.includes("Bintang")) {
                    showDialogue("MALAM BINTANG 🌟", "Pohon Natal raksasa berdiri di alun-alun. Ada kado di bawahnya untukmu.",
                        [{
                            text: "Buka Kado Misterius 🎁",
                            action: () => {
                                const year = Math.ceil(STATE.day / 120);
                                if (p.lastXmasYear !== year) {
                                    p.lastXmasYear = year;
                                    const randGift = Math.random() < 0.5 ? 'cincin_kayu' : 'baju_hangat';
                                    if (randGift === 'cincin_kayu') {
                                        addItem('cincin_kayu', 1);
                                        showDialogue("SELAMAT NATAL!", "Kamu mendapat **Cincin Kayu**! Bisa dipakai melamar seseorang.", [{ text: "Terima kasih Santa!", action: closeDialogue }], 'images/lemari.png');
                                    } else {
                                        addItem('kain', 3);
                                        showDialogue("SELAMAT NATAL!", "Kamu mendapat **3 Kain Sutra**! Hangat sekali.", [{ text: "Terima kasih!", action: closeDialogue }], 'images/lemari.png');
                                    }
                                } else {
                                    showToast("Kamu sudah ambil kado tahun ini!");
                                    closeDialogue();
                                }
                            }
                        }], 'images/statue.png');
                }
                // 9. NATAL
                else if (name.includes("Natal") || name.includes("Bintang")) {
                    showDialogue("MALAM BINTANG 🌟", "Pohon Natal raksasa berdiri di alun-alun. Ada kado di bawahnya untukmu.",
                        [{
                            text: "Buka Kado Misterius 🎁",
                            action: () => {
                                const year = Math.ceil(STATE.day / 120);
                                if (p.lastXmasYear !== year) {
                                    p.lastXmasYear = year;
                                    const randGift = Math.random() < 0.5 ? 'cincin_kayu' : 'baju_hangat';
                                    if (randGift === 'cincin_kayu') {
                                        addItem('cincin_kayu', 1);
                                        showDialogue("SELAMAT NATAL!", "Kamu mendapat **Cincin Kayu**! Bisa dipakai melamar seseorang.", [{ text: "Terima kasih Santa!", action: closeDialogue }], 'images/lemari.png');
                                    } else {
                                        addItem('kain', 3);
                                        showDialogue("SELAMAT NATAL!", "Kamu mendapat **3 Kain Sutra**! Hangat sekali.", [{ text: "Terima kasih!", action: closeDialogue }], 'images/lemari.png');
                                    }
                                } else {
                                    showToast("Kamu sudah ambil kado tahun ini!");
                                    closeDialogue();
                                }
                            }
                        }], 'images/statue.png');
                }
                // 10. PANEN RAYA / BUKA GILING
                else if (name.includes("Panen Raya") || name.includes("Buka Giling")) {
                    const kurcaciHint = STATE.player.hiredDwarf
                        ? "✅ Kurcaci Gorki sudah bekerja di ladangmu! Temui dia di area ladang untuk hadiah tahunan 🌾"
                        : "💡 **Kurcaci Tani Gorki** ada di sini hari ini! Cari dia di utara desa — dia hanya muncul setahun sekali!";
                    const roleOpt = getRoleFestivalOption('Panen');
                    const panenOpts = [
                        {
                            text: "Setor Panen (Beras/Jagung/Tomat)",
                            action: () => {
                                const berasQty = p.inventory['beras'] || 0;
                                const jagungQty = p.inventory['jagung_panen'] || 0;
                                const tomatQty = p.inventory['tomat_panen'] || 0;
                                const total = berasQty + jagungQty + tomatQty;
                                if (total >= 5) {
                                    p.inventory['beras'] = 0; p.inventory['jagung_panen'] = 0; p.inventory['tomat_panen'] = 0;
                                    const reward = Math.floor(total * 150);
                                    p.money += reward;
                                    gainExp(30);
                                    p.reputation = (p.reputation || 0) + 10;
                                    showDialogue("🏆 JUARA PANEN!", `Kepala Desa kagum! Kamu menyetor ${total} hasil panen.\n\nHadiah: **+${reward} Gold** + **30 EXP** + **Reputasi +10**\n\n"Petani sejati ada di hatimu, Nak!"`, [{ text: "Hore! 🌾", action: closeDialogue }], 'images/statue.png');
                                } else {
                                    showDialogue("KURANG...", `Kamu perlu minimal 5 hasil panen (Beras/Jagung/Tomat) untuk ikut kompetisi.\n\nPanenmu sekarang: ${total} buah.`, [{ text: "Baik, nanti lagi", action: closeDialogue }], 'images/statue.png');
                                }
                            }
                        },
                        roleOpt,
                        {
                            text: "🕺 Ikut Tarian Panen (Gratis!)",
                            action: () => {
                                p.energy = Math.min((p.energy || 0) + 30, 100);
                                p.reputation = (p.reputation || 0) + 3;
                                gainExp(5);
                                showToast("Energi +30, Reputasi +3! Ikut menari itu menyenangkan! 🎶");
                                closeDialogue();
                            }
                        }
                    ].filter(Boolean);
                    showDialogue("🌾 FESTIVAL PANEN RAYA", `Seluruh desa bergotong-royong memanen hasil bumi!\n\n${kurcaciHint}\n\n✨ Role ${(p.role||'none').toUpperCase()} punya cara tersendiri berkontribusi di sini!`, panenOpts, 'images/orangsawah.png');
                }
                // 11. FESTIVAL MUSIK
                else if (name.includes("Musik")) {
                    const roleOpt = getRoleFestivalOption('Musik');
                    const musikOpts = [
                        {
                            text: "🎤 Naik Panggung! (Butuh REP 10+)",
                            action: () => {
                                if ((p.reputation || 0) >= 10) {
                                    const roll = Math.random();
                                    if (roll > 0.4) {
                                        p.reputation = (p.reputation || 0) + 15;
                                        gainExp(20);
                                        p.money += 1000;
                                        showDialogue("BINTANG MALAM INI ⭐", "Penonton bersorak! Namamu mulai dikenal.\n\n**+15 Reputasi + 20 EXP + 1000 Gold**\n\nKamu mendapat undangan manggung lagi minggu depan!", [{ text: "Terima kasih!", action: closeDialogue }], 'images/penyanyi.png');
                                    } else {
                                        p.reputation = Math.max(0, (p.reputation || 0) - 5);
                                        showDialogue("OFF-KEY... 😬", "Kamu sedikit nervous dan fals. Penonton bersimpati.\n**Reputasi -5**.\nJangan menyerah, latih terus!", [{ text: "Latihan lagi...", action: closeDialogue }], 'images/penyanyi.png');
                                    }
                                } else {
                                    showToast("Kamu butuh Reputasi minimal 10 untuk berani naik panggung!");
                                }
                            }
                        },
                        roleOpt,
                        {
                            text: "🎧 Nikmati Konser (Energi +40)",
                            action: () => {
                                p.energy = Math.min((p.energy || 0) + 40, 100);
                                gainExp(5);
                                showToast("Jiwa tenang setelah menikmati musik. Energi +40! 🎵");
                                closeDialogue();
                            }
                        }
                    ].filter(Boolean);
                    showDialogue("🎵 FESTIVAL MUSIK DESA", `Penyanyi berbakat dari seluruh kota tampil malam ini. Ada slot untuk penampil dadakan!\n\n✨ Role ${(p.role||'none').toUpperCase()} punya cara istimewa menikmati festival ini!`, musikOpts, 'images/penyanyi.png');
                }
                // 12. PESTA PANEN ANGGUR
                else if (name.includes("Anggur")) {
                    const periHint = STATE.player.hiredFairy
                        ? "✅ Peri Sylva sudah bekerja di kebunmu! Temui dia di area ladang untuk hadiah tahunan 🧚‍♀️"
                        : "💡 **Peri Panen Sylva** ada di sini hari ini! Cari dia di utara desa — dia hanya muncul setahun sekali di festival ini!";
                    showDialogue("🍇 PESTA PANEN ANGGUR", `Anggur terbaik dari kebun desa dipamerkan!\n\n${periHint}\n\nAda juga lomba mencicip anggur untuk menebak varietasnya.`,
                        [
                            {
                                text: "🍷 Ikut Lomba Cicip (50G)",
                                action: () => {
                                    if (p.money >= 50) {
                                        p.money -= 50;
                                        const roll = Math.floor(Math.random() * 3);
                                        if (roll === 0) {
                                            addItem('tomat_panen', 5);
                                            p.money += 500;
                                            showDialogue("SOMMELIER HANDAL! 🍷", "Lidahmu sangat peka! Juri takjub.\n\n**Hadiah: 500 Gold + 5 Tomat Segar**", [{ text: "Lezat!", action: closeDialogue }], 'images/dapurayaayu.png');
                                        } else if (roll === 1) {
                                            addItem('gandum', 3);
                                            showDialogue("HAMPIR BENAR!", "Dua dari tiga varian kamu tebak dengan tepat.\n\n**Hadiah: 3 Gandum**", [{ text: "Lumayan!", action: closeDialogue }], 'images/dapurayaayu.png');
                                        } else {
                                            showDialogue("SALAH SEMUA 😅", "Ternyata lidahmu masih perlu dilatih. Uang Pendaftaran hangus.", [{ text: "Hehe...", action: closeDialogue }], 'images/dapurayaayu.png');
                                        }
                                    } else {
                                        showToast("Butuh 50 Gold untuk ikut!");
                                    }
                                }
                            },
                            {
                                text: "🥂 Minum Gratis (Energi +25)",
                                action: () => {
                                    p.energy = Math.min((p.energy || 0) + 25, 100);
                                    showToast("Minuman anggur segar. Energi +25! 🍇");
                                    closeDialogue();
                                }
                            }
                        ], 'images/dapurayaayu.png');
                }
                // 13. FESTIVAL DOMBA
                else if (name.includes("Domba")) {
                    showDialogue("🐑 FESTIVAL DOMBA MUSIM GUGUR", "Para peternak memamerkan domba-domba gemuk mereka. Lomba mencukur domba paling cepat juga digelar!",
                        [
                            {
                                text: "✂️ Ikut Lomba Cukur Domba",
                                action: () => {
                                    if ((p.str || 0) >= 10) {
                                        addItem('kain', 4);
                                        gainExp(15);
                                        showDialogue("TANGAN EMAS! ✂️", "Kamu mencukur domba dalam 45 detik — rekor baru desa!\n\n**Hadiah: 4 Kain Wol + 15 EXP**", [{ text: "Haha seru!", action: closeDialogue }], 'images/statue.png');
                                    } else {
                                        showDialogue("LAMBAT...", "Dombamu kabur sebelum selesai dicukur. Kamu kalah.\nLatih STR-mu lebih keras!", [{ text: "Oke...", action: closeDialogue }], 'images/statue.png');
                                    }
                                }
                            },
                            {
                                text: "🛍️ Beli Wol Murah (3 Kain, 200G)",
                                action: () => {
                                    if (p.money >= 200) {
                                        p.money -= 200;
                                        addItem('kain', 3);
                                        showToast("Dapat 3 Kain Wol murah! 🐑");
                                        closeDialogue();
                                    } else { showToast("Uang tidak cukup."); }
                                }
                            },
                            { text: "Lihat-lihat saja", action: () => { p.energy = Math.min((p.energy||0)+10,100); showToast("Suasana seru! Energi +10"); closeDialogue(); } }
                        ], 'images/statue.png');
                }
                // 14. PESTA SUP HANGAT
                else if (name.includes("Sup Hangat") || name.includes("Sup")) {
                    showDialogue("🍲 PESTA SUP HANGAT MUSIM DINGIN", "Warga desa berkumpul menghangatkan diri. Nenek tua berbagi resep sup ajaib yang bisa memulihkan energi dan semangat.",
                        [
                            {
                                text: "🥣 Minum Sup Ajaib (Gratis!)",
                                action: () => {
                                    const year = Math.ceil(STATE.day / 120);
                                    if (p.lastSoupYear !== year) {
                                        p.lastSoupYear = year;
                                        p.energy = 100;
                                        p.hp = Math.min((p.hp || 100) + 30, 100);
                                        gainExp(10);
                                        showDialogue("SUP NENEK ✨", "Hangat dan nikmat sekali! Sup itu mengandung rempah legendaris.\n\n**Energi PENUH + HP +30 + 10 EXP**\n\n'Nak, hiduplah dengan penuh semangat!'", [{ text: "Terima kasih, Nek!", action: closeDialogue }], 'images/statue.png');
                                    } else {
                                        showToast("Kamu sudah minum sup tahun ini. Ingat, yang berlebihan tidak baik!");
                                        closeDialogue();
                                    }
                                }
                            },
                            {
                                text: "🫂 Duduk Bersama Warga (+REP)",
                                action: () => {
                                    p.reputation = (p.reputation || 0) + 8;
                                    p.energy = Math.min((p.energy || 0) + 20, 100);
                                    showToast("Menghangatkan hati. Reputasi +8, Energi +20 🍲");
                                    closeDialogue();
                                }
                            }
                        ], 'images/statue.png');
                }
                // 15. MALAM AKHIR TAHUN
                else if (name.includes("Akhir Tahun")) {
                    showDialogue("🕛 MALAM AKHIR TAHUN", "Detik-detik pergantian tahun! Warga berkumpul di alun-alun. Semua orang merenungkan perjalanan setahun terakhir.",
                        [
                            {
                                text: "🎆 Nyalakan Kembang Api (500G)",
                                action: () => {
                                    if (p.money >= 500) {
                                        p.money -= 500;
                                        createParticle(p.x, p.y, '#facc15');
                                        createParticle(p.x+20, p.y-20, '#f472b6');
                                        createParticle(p.x-20, p.y-20, '#60a5fa');
                                        p.reputation = (p.reputation || 0) + 12;
                                        gainExp(20);
                                        showDialogue("SELAMAT TAHUN BARU! 🎇", "Kembang api ciptaanmu menerangi langit malam. Warga bersorak!\n\n**Reputasi +12 + 20 EXP**\n\nTahun baru, semangat baru!", [{ text: "YEAY! 🎉", action: closeDialogue }], 'images/statue.png');
                                    } else { showToast("Butuh 500 Gold untuk beli kembang api!"); }
                                }
                            },
                            {
                                text: "📝 Tulis Resolusi Tahun Baru",
                                action: () => {
                                    const year = Math.ceil(STATE.day / 120);
                                    if (p.lastResolutionYear !== year) {
                                        p.lastResolutionYear = year;
                                        STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 10;
                                        showDialogue("RESOLUSI DITULIS ✍️", "Kamu menuliskan mimpi dan targetmu untuk tahun depan.\n\n**+10 AP (Achievement Points)**\n\n'Langkah pertama menuju sukses adalah menuliskan tujuanmu.'", [{ text: "Siap menjalani tahun baru!", action: closeDialogue }], 'images/statue.png');
                                    } else {
                                        showToast("Resolusimu sudah ditulis tahun ini!");
                                        closeDialogue();
                                    }
                                }
                            },
                            {
                                text: "🤝 Kumpul Bersama Teman",
                                action: () => {
                                    p.energy = 100;
                                    p.reputation = (p.reputation || 0) + 5;
                                    showToast("Kebersamaan adalah kekuatan. Energi PENUH + Reputasi +5 🌟");
                                    closeDialogue();
                                }
                            }
                        ], 'images/statue.png');
                }
                // 16. BULAN PURNAMA MERAH (SPECIAL)
                else if (name.includes("Purnama")) {
                    showDialogue("🌕 BULAN PURNAMA MERAH", "Malam ini langit berwarna merah saga. Fenomena langka ini konon memberikan kekuatan misterius bagi yang berani keluar malam.",
                        [
                            {
                                text: "🌙 Meditasi di Bawah Purnama",
                                action: () => {
                                    const bonusStat = Math.floor(Math.random() * 4);
                                    const stats = ['str', 'int', 'reputation', 'biz'];
                                    const statNames = ['STR', 'INT', 'Reputasi', 'BIZ'];
                                    const bonus = 3 + Math.floor(Math.random() * 3);
                                    p[stats[bonusStat]] = (p[stats[bonusStat]] || 0) + bonus;
                                    gainExp(25);
                                    showDialogue("KEKUATAN MISTERIUS ✨", `Cahaya purnama meresap ke dalam dirimu...\n\n**${statNames[bonusStat]} +${bonus}** dan **25 EXP**\n\n"Kamu merasakan sesuatu yang berubah dalam dirimu."`, [{ text: "Luar biasa!", action: closeDialogue }], 'images/statue.png');
                                }
                            },
                            {
                                text: "🏃 Lari di Bawah Bulan (STR+)",
                                action: () => {
                                    p.str = (p.str || 0) + 5;
                                    p.energy = Math.max(0, (p.energy || 100) - 30);
                                    showToast("Berlari di malam purnama! STR +5, Energi -30 🌕");
                                    closeDialogue();
                                }
                            }
                        ], 'images/statue.png');
                }
                // DEFAULT
                else {
                    showDialogue(`MERAYAKAN ${name.toUpperCase()}`,
                        "Kamu menikmati suasana festival yang meriah. Makan enak, musik asik, teman baik.",
                        [{
                            text: "Nikmati (Energi Penuh)",
                            action: () => {
                                p.energy = 100;
                                p.reputation += 2;
                                showToast("Energi Pulih & Reputasi +2");
                                closeDialogue();
                            }
                        }], 'images/statue.png');
                }
            }

            // --- [AKHIR KODE PERTANIAN] ---

            // --- NEW: PWA SERVICE WORKER (FITUR SIMPAN ASET OFFLINE) ---
            // Kode ini membuat browser menyimpan gambar secara agresif agar tidak download ulang
            // [UPDATE] Dinonaktifkan sementara karena Blob URL tidak didukung di lingkungan preview ini
            /*
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                    // Kita gunakan Blob untuk membuat Service Worker tanpa file eksternal (Single File Magic)
                    const swCode = `
                        const CACHE_NAME = 'nusantara-arsa-cache-v1';
                        
                        self.addEventListener('install', event => {
                            self.skipWaiting(); // Langsung aktifkan
                        });
            
                        self.addEventListener('fetch', event => {
                            event.respondWith(
                                caches.match(event.request)
                                    .then(response => {
                                        // 1. Jika ada di Cache, gunakan itu (Hemat Kuota)
                                        if (response) {
                                            return response;
                                        }
                                        // 2. Jika tidak, download dari internet lalu simpan ke Cache
                                        return fetch(event.request).then(
                                            function(networkResponse) {
                                                // Cek validitas respon
                                                if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                                                    return networkResponse;
                                                }
                                                
                                                // Filter: Hanya cache file Gambar dan Audio
                                                if(event.request.url.match(/\\.(png|jpg|jpeg|svg|mp3)$/)) {
                                                    var responseToCache = networkResponse.clone();
                                                    caches.open(CACHE_NAME)
                                                        .then(function(cache) {
                                                            cache.put(event.request, responseToCache);
                                                        });
                                                }
                                                return networkResponse;
                                            }
                                        );
                                    })
                            );
                        });
                    `;
                    
                    // Buat URL virtual untuk script Service Worker
                    const blob = new Blob([swCode], {type: 'text/javascript'});
                    const swUrl = URL.createObjectURL(blob);
                    
                    navigator.serviceWorker.register(swUrl).then(function(registration) {
                        console.log('ServiceWorker PWA registered with scope:', registration.scope);
                    }).catch(function(err) {
                        console.log('ServiceWorker registration failed:', err);
                    });
                });
            }
            */

            // Fungsi untuk memaksa masuk Full Screen kembali
            function resumeFullscreen() {
                var elem = document.documentElement;

                // 1. Minta Fullscreen
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().then(() => {
                        // 2. SETELAH Fullscreen Berhasil, BARU Paksa Landscape
                        // Ini kunci agar layar HP otomatis miring
                        if (screen.orientation && screen.orientation.lock) {
                            screen.orientation.lock('landscape').catch(e => console.log(e));
                        }
                    }).catch(err => {
                        console.log("Gagal Fullscreen: ", err);
                    });
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }

                // 3. Hilangkan layar hitam
                document.getElementById('resume-overlay').style.display = 'none';
            }

            // Event Listener: Mata-mata yang memantau apakah kita pindah tab/aplikasi
            document.addEventListener("visibilitychange", function () {
                // Jika halaman sedang AKTIF (Kita kembali ke tab Chrome ini)
                if (!document.hidden) {
                    console.log("Pengguna kembali ke game.");

                    // Cek: Apakah Fullscreen-nya lepas?
                    // (Biasanya 'null' kalau lepas)
                    if (!document.fullscreenElement && !document.webkitFullscreenElement) {

                        // JIKA LEPAS: Munculkan layar hitam agar user menekan tombol lagi
                        document.getElementById('resume-overlay').style.display = 'flex';
                    }
                }
            });

            // ═══════════════════════════════════════════════════════════
            // 🔊 SISTEM SFX CLICK GLOBAL — Web Audio API (tanpa file)
            // ═══════════════════════════════════════════════════════════
            (function initClickSFX() {
                let _sfxCtx = null;

                function getSfxCtx() {
                    if (!_sfxCtx) {
                        try { _sfxCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
                    }
                    return _sfxCtx;
                }

                const SFX_TYPES = {
                    btn_primary:   { type:'sine',     freq:520, freq2:680, dur:0.09, vol:0.18, sweep:true },
                    btn_secondary: { type:'sine',     freq:380, freq2:320, dur:0.08, vol:0.14, sweep:true },
                    tap:           { type:'triangle', freq:600, freq2:600, dur:0.055,vol:0.12, sweep:false },
                    dialog:        { type:'sine',     freq:440, freq2:660, dur:0.13, vol:0.15, sweep:true },
                    close:         { type:'sine',     freq:580, freq2:380, dur:0.10, vol:0.13, sweep:true },
                    confirm:       { type:'sine',     freq:523, freq2:784, dur:0.12, vol:0.16, sweep:true },
                    default:       { type:'sine',     freq:480, freq2:520, dur:0.07, vol:0.13, sweep:true },
                };

                function playSFXClick(sfxType) {
                    if (typeof AUDIO !== 'undefined' && !AUDIO.enabled) return;
                    const ctx = getSfxCtx();
                    if (!ctx) return;
                    try {
                        if (ctx.state === 'suspended') ctx.resume();
                        const s = SFX_TYPES[sfxType] || SFX_TYPES.default;
                        const osc  = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.type = s.type;
                        const now = ctx.currentTime;
                        osc.frequency.setValueAtTime(s.freq, now);
                        if (s.sweep) osc.frequency.linearRampToValueAtTime(s.freq2, now + s.dur);
                        gain.gain.setValueAtTime(s.vol, now);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + s.dur + 0.03);
                        osc.start(now);
                        osc.stop(now + s.dur + 0.04);
                    } catch(e) {}
                }

                function detectSFXType(el) {
                    if (!el) return 'default';
                    const tag = el.tagName;
                    const cls = (el.className || '').toLowerCase();
                    const id  = (el.id || '').toLowerCase();
                    const txt = (el.textContent || '').trim().toLowerCase().slice(0, 20);
                    if (/close|tutup|keluar|back|batal|cancel/.test(cls + id + txt)) return 'close';
                    if (/confirm|lanjut|mulai|start|submit|kirim|selesai/.test(cls + id + txt)) return 'confirm';
                    if (/modal|dialog|popup|panel/.test(cls + id)) return 'dialog';
                    if (tag === 'BUTTON') {
                        if (/secondary|back|cancel|gray|grey/.test(cls)) return 'btn_secondary';
                        return 'btn_primary';
                    }
                    if (/btn|button|menu|action|tab/.test(cls + id)) return 'btn_primary';
                    if (tag === 'LI' || /item|card|slot|choice|opt/.test(cls + id)) return 'tap';
                    return 'default';
                }

                let _lastSFX = 0;

                document.addEventListener('pointerdown', function(e) {
                    const now = Date.now();
                    if (now - _lastSFX < 80) return;
                    _lastSFX = now;
                    let el = e.target;
                    for (let i = 0; i < 4; i++) {
                        if (!el || el === document.body) break;
                        const tag  = el.tagName;
                        const role = el.getAttribute('role') || '';
                        const cls  = (el.className || '').toLowerCase();
                        const id   = (el.id || '').toLowerCase();
                        const isInteractive = (
                            tag === 'BUTTON' || tag === 'A' || tag === 'LI' ||
                            role === 'button' || el.onclick ||
                            /btn|button|menu|tab|choice|item|card|slot|action/.test(cls + id)
                        );
                        if (isInteractive) {
                            playSFXClick(detectSFXType(el));
                            return;
                        }
                        el = el.parentElement;
                    }
                }, { passive: true });

                window.playSFXClick = playSFXClick;
            })();

            // Tambahan: Kadang di HP orientasi berubah bikin fullscreen lepas
            window.addEventListener("resize", function () {
                // Cek tinggi layar, jika mendadak kecil (status bar muncul), tawarkan fullscreen lagi
                if (window.innerHeight < screen.height * 0.8) {
                    // Jangan langsung paksa (browser blokir), tapi tampilkan tombol overlay jika belum ada
                    // Logic ini opsional, yang utama adalah 'visibilitychange' di atas.
                }
            });

            // --- FITUR BARU: WARNET & FREELANCE ---
            const WARNET_SOAL = [
                { q: "Apa singkatan dari CPU?", a: "Central Processing Unit", b: "Central Process Umbrella", valid: 0 },
                { q: "Bahasa untuk struktur web?", a: "HTML", b: "Snake", valid: 0 },
                { q: "Untuk menghias tampilan web?", a: "CSS", b: "PDF", valid: 0 },
                { q: "1 Byte berapa bit?", a: "10 Bit", b: "8 Bit", valid: 1 },
                { q: "Shortcut Copy?", a: "Ctrl+C", b: "Alt+F4", valid: 0 }
            ];
            let currentWarnetSoal = null;

            // --- UPDATE FUNGSI WARNET MENU (GANTI LOGIKA MAIN GAME) ---
            function openWarnetMenu() {
                showDialogue("WARNET DESA", "Selamat datang! \nKoneksi kencang, PC spek dewa. \nTarif: 500 Gold / Sesi.", [
                    {
                        text: "💻 Kerja Freelance (Dapat Uang)", action: () => {
                            if (STATE.player.money >= 500) {
                                if (STATE.player.energy >= 20) {
                                    STATE.player.money -= 500;
                                    STATE.player.energy -= 20;
                                    closeDialogue();
                                    openWarnetGame(); // Buka Minigame Coding
                                } else showToast("Energi kurang (Butuh 20)");
                            } else showToast("Uang sewa kurang (500 G)");
                        }
                    },
                    {
                        text: "🔍 Cari Info Lowongan Kerja (500G)", action: () => {
                            closeDialogue();
                            searchJobFromWarnet();
                        }
                    },
                    // --- UPDATE: Panggil Game Balap ---
                    {
                        text: "🏎️ Main Balap Liar (Dapat Energi)", action: () => {
                            startRacingGame();
                        }
                    },
                    { text: "Batal", action: closeDialogue }
                ], 'images/warnet.png');
            }

            let raceState = {
                active: false,
                score: 0,
                carX: 130, // Posisi Tengah (Lane 2)
                enemies: [],
                scenery: [], // Pohon/Batu
                speed: 5,
                animationId: null
            };

            function startRacingGame() {
                // Cek Uang
                if (STATE.player.money < 500) {
                    showToast("Uang tidak cukup (Butuh 500 G)");
                    return;
                }

                // Bayar
                STATE.player.money -= 500;

                // Tutup Dialog Menu Warnet
                closeDialogue();

                // Buka Overlay
                document.getElementById('racing-minigame').style.display = 'flex';
                STATE.screen = 'minigame';

                // Reset State
                raceState.score = 0;
                raceState.carX = 130;
                raceState.enemies = [];
                raceState.scenery = [];
                raceState.speed = 4; // Start speed lebih cepat dikit
                raceState.active = false; // Tunggu tap start

                // Update UI Awal
                updateRaceUI();

                // Reset Visual ke Gambar Mobil
                const pCar = document.getElementById('player-car');
                pCar.style.transform = 'none'; // Reset rotasi jika sebelumnya diset oleh error
                // FIX: Terapkan perbaikan yang sama pada string injeksi HTML
                pCar.innerHTML = '<img src="images/player-race.png" style="width: 100%; height: 100%; object-fit: contain;" onerror="var p=this.parentElement; this.style.display=\'none\'; p.innerText=\'🏎️\'; p.style.fontSize=\'40px\'; p.style.transform=\'rotate(-90deg)\'">';
                pCar.classList.remove('explosion');

                // Mulai animasi jalan
                document.getElementById('road-lines').classList.add('road-moving');

                document.getElementById('score-race').innerText = "SKOR: 0";
                document.getElementById('start-msg-race').style.display = 'block';

                // Bersihkan musuh lama & scenery
                const track = document.getElementById('race-track');
                const oldEnemies = track.querySelectorAll('.enemy-car');
                oldEnemies.forEach(e => e.remove());

                const oldScenery = track.querySelectorAll('.scenery-item');
                oldScenery.forEach(s => s.remove());

                // UPDATE: Hapus listener klik manual karena sudah diganti div overlay
                document.getElementById('race-track').onclick = null;
            }

            function initRace() {
                raceState.active = true;
                document.getElementById('start-msg-race').style.display = 'none';
                document.getElementById('race-track').onclick = null; // Hapus listener start
                raceLoop();
            }

            function moveCar(dir) {
                // Jika game belum mulai, tap tombol juga bisa trigger start
                if (!raceState.active && document.getElementById('racing-minigame').style.display === 'flex') {
                    // Jangan start lewat tombol arah
                    return;
                }

                // Pindah Jalur (Kiri/Kanan) sejauh 100px
                raceState.carX += dir * 100;

                // Batasi Jalur (Clamp)
                if (raceState.carX < 30) raceState.carX = 30; // Lane 1
                if (raceState.carX > 230) raceState.carX = 230; // Lane 3

                updateRaceUI();
            }

            function updateRaceUI() {
                const pCar = document.getElementById('player-car');
                pCar.style.left = raceState.carX + 'px';
            }

            function raceLoop() {
                if (!raceState.active) return;

                const track = document.getElementById('race-track');

                // --- 1. SPAWN SCENERY (PINGGIR JALAN) ---
                if (Math.random() < 0.1) { // 10% chance
                    const side = Math.random() < 0.5 ? 'left' : 'right';
                    const type = Math.random() < 0.7 ? '🌲' : '🪨'; // Pohon atau Batu

                    const el = document.createElement('div');
                    el.innerText = type;
                    el.className = 'scenery-item';
                    el.style.position = 'absolute';
                    el.style.top = '-30px';
                    el.style.fontSize = '20px';

                    if (side === 'left') el.style.left = (Math.random() * 10) + 'px';
                    else el.style.right = (Math.random() * 10) + 'px';

                    track.appendChild(el);
                    raceState.scenery.push({ y: -30, el: el });
                }

                // Move Scenery
                for (let i = raceState.scenery.length - 1; i >= 0; i--) {
                    let item = raceState.scenery[i];
                    item.y += raceState.speed;
                    item.el.style.top = item.y + 'px';
                    if (item.y > 420) {
                        item.el.remove();
                        raceState.scenery.splice(i, 1);
                    }
                }

                // --- 2. SPAWN ENEMY (MOBIL/TRUK) ---
                // Peluang spawn meningkat seiring skor
                if (Math.random() < 0.015 + (raceState.score * 0.001)) {
                    spawnEnemyCar();
                }

                // Update posisi musuh
                for (let i = raceState.enemies.length - 1; i >= 0; i--) {
                    let en = raceState.enemies[i];
                    en.y += raceState.speed; // Ikuti kecepatan player seolah player maju

                    // Buat elemen DOM jika belum ada
                    if (!en.el) {
                        en.el = document.createElement('div');
                        en.el.className = 'enemy-car';
                        // en.el.innerText = en.icon; // OLD: Text Only
                        en.el.style.position = 'absolute';
                        en.el.style.fontSize = '35px'; // Ukuran mobil (Fallback Icon)
                        en.el.style.width = '40px';
                        en.el.style.height = '40px';
                        en.el.style.display = 'flex';
                        en.el.style.justifyContent = 'center';
                        en.el.style.alignItems = 'center';

                        // UPDATE: Jangan putar container secara default (Hanya putar jika Fallback ke Icon)
                        // Agar gambar Top-Down tidak miring
                        // en.el.style.transform = 'rotate(-90deg)'; <-- DIHAPUS

                        en.el.style.top = en.y + 'px';
                        en.el.style.left = en.x + 'px';

                        // UPDATE: Render Gambar jika ada, Fallback ke Icon dengan Rotasi
                        if (en.img) {
                            // Jika gambar gagal (onerror), baru kita putar parent-nya -90deg dan tampilkan icon
                            en.el.innerHTML = `<img src="${en.img}" style="width: 100%; height: 100%; object-fit: contain;" onerror="var p=this.parentElement; this.style.display='none'; p.innerText='${en.icon}'; p.style.fontSize='40px'; p.style.transform='rotate(-90deg)'">`;
                        } else {
                            en.el.innerText = en.icon;
                            en.el.style.transform = 'rotate(-90deg)'; // Putar jika hanya icon
                        }

                        // Truk sedikit lebih besar visualnya (Fallback font size)
                        if (en.type === 'truck') en.el.style.fontSize = '45px';

                        track.appendChild(en.el);
                    } else {
                        en.el.style.top = en.y + 'px';
                    }

                    // Cek Tabrakan (Hitbox Sederhana)
                    // Mobil Player Y = Bottom 20px (Sekitar 340-380px dari atas)
                    // X harus sama (satu jalur)
                    if (Math.abs(en.x - raceState.carX) < 20 && en.y > 320 && en.y < 380) {
                        gameOverRace();
                        return;
                    }

                    // Cek Lewat (Score)
                    if (en.y > 420) {
                        en.el.remove(); // Hapus dari DOM
                        raceState.enemies.splice(i, 1); // Hapus dari Array
                        raceState.score++;

                        // Makin lama makin cepat
                        if (raceState.score % 5 === 0) raceState.speed += 0.5;
                    }
                }

                document.getElementById('score-race').innerText = "SKOR: " + raceState.score;
                raceState.animationId = requestAnimationFrame(raceLoop);
            }

            function spawnEnemyCar() {
                // 3 Jalur: 30, 130, 230 (Sesuai posisi player)
                const lanes = [30, 130, 230];
                const x = lanes[Math.floor(Math.random() * lanes.length)];

                // Variasi Musuh (UPDATE: Tambahkan Property Gambar)
                const types = [
                    { icon: '🚛', type: 'truck', img: 'images/truck-race.png' }, // Truk (Besar)
                    { icon: '🚕', type: 'taxi', img: 'images/taxi-race.png' },
                    { icon: '🚙', type: 'suv', img: 'images/suv-race.png' },
                    { icon: '🛵', type: 'bike', img: 'images/bike-race.png' }
                ];
                const chosen = types[Math.floor(Math.random() * types.length)];

                // Jangan spawn jika jalur itu baru saja ada mobil (biar gak numpuk)
                const tooClose = raceState.enemies.some(e => e.x === x && e.y < 80);
                if (!tooClose) {
                    // UPDATE: Push dengan properti img
                    raceState.enemies.push({ x: x, y: -60, el: null, icon: chosen.icon, type: chosen.type, img: chosen.img });
                }
            }

            function gameOverRace() {
                raceState.active = false;
                cancelAnimationFrame(raceState.animationId);

                // Hentikan animasi jalan
                document.getElementById('road-lines').classList.remove('road-moving');

                // EFEK LEDAKAN
                const pCar = document.getElementById('player-car');
                pCar.innerText = '💥'; // Ganti jadi ledakan
                pCar.classList.add('explosion'); // Tambah animasi CSS

                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // Delay agar ledakan terlihat dulu
                setTimeout(() => {
                    // Konversi Skor ke Energi (1 Skor = 1 Energi, Max 100)
                    const energyGain = Math.min(100, raceState.score);
                    STATE.player.energy = Math.min(100, STATE.player.energy + energyGain);

                    // UPDATE: GANTI ALERT DENGAN DIALOGUE AGAR TIDAK KELUAR FULLSCREEN
                    quitRacing(); // Tutup overlay balap dulu

                    showDialogue("TABRAKAN MAUT! 💥",
                        `Mobilmu hancur!\n\nSkor Akhir: **${raceState.score}**\nEnergi Pulih: **+${energyGain}**`,
                        [{
                            text: "Lanjut Main",
                            action: () => {
                                closeDialogue();
                                // Paksa fullscreen lagi jaga-jaga
                                toggleFullScreen();
                            }
                        }],
                        'images/player-race.png'
                    );

                }, 800);
            }

            function quitRacing() {
                raceState.active = false;
                if (raceState.animationId) cancelAnimationFrame(raceState.animationId);
                document.getElementById('racing-minigame').style.display = 'none';
                STATE.screen = 'play';
            }

            function openWarnetGame() {
                STATE.screen = 'minigame';
                document.getElementById('warnet-modal').style.display = 'flex';

                // Pilih Soal Acak
                const idx = Math.floor(Math.random() * WARNET_SOAL.length);
                currentWarnetSoal = WARNET_SOAL[idx];

                // Tampilkan Soal
                document.getElementById('warnet-task-desc').innerText = "KLIEN BERTANYA: " + currentWarnetSoal.q;
                document.getElementById('warnet-code-display').innerText = "PILIH JAWABAN YANG BENAR";
                document.getElementById('btn-code-a').innerText = currentWarnetSoal.a;
                document.getElementById('btn-code-b').innerText = currentWarnetSoal.b;
            }

            function checkWarnetAnswer(pilihan) {
                if (pilihan === currentWarnetSoal.valid) {
                    // Menang
                    const gaji = 1500 + (STATE.player.int * 50);

                    // --- UPDATE: STUDENT PERK (FREELANCER PRO) ---
                    // Mahasiswa Teknologi/Sejarah dapat bayaran lebih tinggi karena skill riset
                    if (STATE.player.role === 'student') {
                        gaji = Math.floor(gaji * 1.5); // +50% Bonus
                        showToast("Bonus Skill Mahasiswa: +50%");
                    }

                    STATE.player.money += gaji;
                    STATE.player.int += 1; // Nambah pinter
                    gainExp(50);
                    showToast(`Project Selesai! Dibayar ${gaji} G`);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    // --- TAMBAHAN EFEK MELAYANG (BARU) ---
                    // Munculkan teks Uang (Warna Hijau)
                    createFloatingText(`+${gaji} G`, '#4ade80');

                    // Munculkan teks EXP (Warna Biru), diberi jeda 0.3 detik agar tidak numpuk dengan teks Uang
                    setTimeout(() => {
                        createFloatingText(`+50 EXP`, '#60a5fa');
                    }, 300);
                    // -----------

                } else {
                    // Kalah
                    showToast("Project Gagal... Klien Marah (Bug!)");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                }
                closeWarnetGame();
            }

            function closeWarnetGame() {
                document.getElementById('warnet-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            // --- FUNGSI MEMBUAT TEKS MELAYANG ---
            function createFloatingText(text, color) {
                // 1. Buat elemen div baru
                const floatEl = document.createElement('div');

                // 2. Beri class CSS yang sudah kita buat di Langkah 1
                floatEl.className = 'floating-text';

                // 3. Masukkan teks dan warnanya
                floatEl.innerText = text;
                floatEl.style.color = color;

                // 4. Masukkan ke dalam halaman utama (body)
                document.body.appendChild(floatEl);

                // 5. Hapus elemen setelah 1.5 detik (sesuai durasi animasi CSS) agar tidak menumpuk di memori
                setTimeout(() => {
                    floatEl.remove();
                }, 1500);
            }

            // ==========================================
            // LOGIKA PASAR GROSIR (NAIK-TURUN)
            // ==========================================

            if (!STATE.player.tradeInventory) STATE.player.tradeInventory = {};

            const TRADE_ITEMS = [
                { id: 'sepatu_b', name: '👟 Sepatu Bekas', basePrice: 500, min: 100, max: 1500 },
                { id: 'kaos_v', name: '👕 Kaos Vintage', basePrice: 200, min: 50, max: 600 },
                { id: 'jam_d', name: '⌚ Jam Digital', basePrice: 800, min: 300, max: 2500 },
                { id: 'snack_k', name: '🍬 Snack Kiloan', basePrice: 50, min: 20, max: 150 }
            ];

            let currentMarketPrices = {};

            function generateMarketPrices() {
                currentMarketPrices = {};
                let chaBonus = (STATE.player.cha || 0) * 0.01;
                if (chaBonus > 0.3) chaBonus = 0.3; // Diskon max 30% dari Charisma

                TRADE_ITEMS.forEach(item => {
                    let rawPrice = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
                    currentMarketPrices[item.id] = {
                        buy: Math.floor(rawPrice * (1 - (chaBonus / 2))),
                        sell: Math.floor(rawPrice * (1 + (chaBonus / 2))),
                        base: item.basePrice
                    };
                });
            }

            function openPasar() {
                STATE.screen = 'minigame';
                document.getElementById('pasar-modal').style.display = 'flex';
                generateMarketPrices();
                renderPasarUI();
            }

            function closePasar() {
                document.getElementById('pasar-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            function refreshPasar() {
                if (STATE.player.money >= 50) {
                    STATE.player.money -= 50;
                    if (typeof createFloatingText === 'function') createFloatingText("-50 G", "#ef4444");
                    generateMarketPrices();
                    renderPasarUI();
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('select');
                } else {
                    if (typeof showToast === 'function') showToast("Uang tidak cukup untuk sogok info pasar!");
                }
            }

            function renderPasarUI() {
                document.getElementById('pasar-uang-player').innerText = `${STATE.player.money} G`;
                const buyList = document.getElementById('pasar-buy-list');
                const sellList = document.getElementById('pasar-sell-list');

                buyList.innerHTML = '';
                sellList.innerHTML = '';

                TRADE_ITEMS.forEach(item => {
                    let prices = currentMarketPrices[item.id];
                    let ownedCount = STATE.player.tradeInventory[item.id] || 0;
                    let priceColor = prices.buy < item.basePrice ? '#ef4444' : '#4ade80';
                    let trendIcon = prices.buy < item.basePrice ? '📉' : '📈';

                    // Toko (Beli)
                    buyList.innerHTML += `
            <div style="background: #334155; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid ${priceColor}">
                <div style="font-size: 14px; margin-bottom: 5px;">${item.name}</div>
                <div style="font-size: 16px; font-weight: bold; color: ${priceColor};">${trendIcon} ${prices.buy} G</div>
                <button onclick="buyTradeItem('${item.id}')" style="margin-top: 8px; width: 100%; padding: 5px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">Beli</button>
            </div>
        `;

                    // Tas (Jual)
                    if (ownedCount > 0) {
                        sellList.innerHTML += `
                <div style="background: #334155; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #3b82f6">
                    <div style="font-size: 14px; margin-bottom: 5px;">${item.name} <span style="background: #eab308; color: black; padding: 2px 5px; border-radius: 10px; font-size: 12px; font-weight:bold;">x${ownedCount}</span></div>
                    <div style="font-size: 16px; font-weight: bold; color: #60a5fa;">Laku: ${prices.sell} G</div>
                    <button onclick="sellTradeItem('${item.id}')" style="margin-top: 8px; width: 100%; padding: 5px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Jual</button>
                </div>
            `;
                    }
                });

                if (sellList.innerHTML === '') {
                    sellList.innerHTML = '<div style="color: #94a3b8; font-style: italic; grid-column: span 2; text-align: center;">Tas daganganmu kosong.</div>';
                }
            }

            function buyTradeItem(itemId) {
                let price = currentMarketPrices[itemId].buy;
                if (STATE.player.money >= price) {
                    STATE.player.money -= price;
                    STATE.player.tradeInventory[itemId] = (STATE.player.tradeInventory[itemId] || 0) + 1;
                    if (typeof createFloatingText === 'function') createFloatingText(`-${price} G`, '#ef4444');
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    renderPasarUI();
                } else {
                    if (typeof showToast === 'function') showToast("Uang tidak cukup!");
                }
            }

            function sellTradeItem(itemId) {
                if (STATE.player.tradeInventory[itemId] > 0) {
                    let price = currentMarketPrices[itemId].sell;
                    STATE.player.tradeInventory[itemId] -= 1;
                    STATE.player.money += price;
                    STATE.player.dailySellCount = (STATE.player.dailySellCount || 0) + 1; // Track bonus quest
                    STATE.player.totalSellCount = (STATE.player.totalSellCount || 0) + 1; // TOTAL LIFETIME
                                    // Entrepreneur dapat AP dari penjualan (1 AP per 3 jual)
                                    if (STATE.player.role === 'entrepreneur') {
                                        const sells = STATE.player.dailySellCount || 0;
                                        if (sells % 3 === 0) {
                                            STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 3;
                                            showToast('💼 Omzet Naik! +3 AP');
                                        }
                                    }

                    if (typeof gainExp === 'function') gainExp(25); // Bonus EXP wirausaha

                    if (typeof createFloatingText === 'function') {
                        createFloatingText(`+${price} G`, '#4ade80');
                        setTimeout(() => { createFloatingText("+25 EXP", "#60a5fa"); }, 300);
                    }

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    renderPasarUI();
                }
            }

            // --- SALES RUSH MINIGAME (JAGA LAPAK) ---
            const SALES_ITEMS = [
                { id: 'roti', name: 'Roti', icon: '🥖' },
                { id: 'susu', name: 'Susu', icon: '🥛' },
                { id: 'sabun', name: 'Sabun', icon: '🧼' },
                { id: 'paket', name: 'Paket', icon: '📦' },
                { id: 'obat', name: 'Obat', icon: '💊' },
                { id: 'lampu', name: 'Lampu', icon: '💡' }
            ];

            let salesState = {
                active: false,
                score: 0,
                lives: 3,
                targetItem: null,
                patience: 100,
                decay: 0.5,
                interval: null
            };

            function startSalesGame() {
                salesState.active = true;
                salesState.score = 0;
                salesState.lives = 3;
                salesState.decay = 0.4; // Initial difficulty

                document.getElementById('sales-minigame').style.display = 'flex';
                STATE.screen = 'minigame';

                updateSalesUI();
                renderSalesButtons();
                nextSalesCustomer();

                if (salesState.interval) clearInterval(salesState.interval);
                salesState.interval = setInterval(salesLoop, 50); // 20 FPS
            }

            function renderSalesButtons() {
                const grid = document.getElementById('sales-grid');
                grid.innerHTML = '';
                SALES_ITEMS.forEach(item => {
                    const btn = document.createElement('button');
                    btn.className = 'auth-btn';
                    btn.style.padding = '8px';
                    btn.style.display = 'flex';
                    btn.style.flexDirection = 'column';
                    btn.style.alignItems = 'center';
                    btn.style.fontSize = '10px';
                    btn.innerHTML = `<span style="font-size:24px; margin-bottom:2px;">${item.icon}</span>${item.name}`;
                    btn.onclick = () => handleSalesClick(item.id);
                    grid.appendChild(btn);
                });
            }

            function nextSalesCustomer() {
                if (!salesState.active) return;

                salesState.patience = 100;
                salesState.decay += 0.05; // Makin lama makin cepat marah

                // Random Item
                salesState.targetItem = SALES_ITEMS[Math.floor(Math.random() * SALES_ITEMS.length)];

                // Tampilkan Bubble
                const bubble = document.getElementById('sales-bubble');
                bubble.innerText = salesState.targetItem.icon;
                bubble.style.transform = 'scale(0)';
                setTimeout(() => bubble.style.transform = 'scale(1)', 100);

                // Random Customer Image
                const customers = ['boy', 'girl', 'peer1', 'peer2', 'peer3', 'lover1girl', 'lover1boy'];
                const randCust = customers[Math.floor(Math.random() * customers.length)];
                const img = document.getElementById('sales-customer-img');
                img.src = `images/${randCust}.png`;
                img.style.transform = 'translateX(50px)';
                setTimeout(() => img.style.transform = 'translateX(0)', 100);
            }

            function salesLoop() {
                if (!salesState.active) return;

                salesState.patience -= salesState.decay;
                const bar = document.getElementById('sales-patience-bar');
                bar.style.width = salesState.patience + "%";

                if (salesState.patience > 50) bar.style.background = '#10b981';
                else if (salesState.patience > 20) bar.style.background = '#facc15';
                else bar.style.background = '#ef4444';

                if (salesState.patience <= 0) {
                    handleSalesMistake("Pelanggan Kabur! 😡");
                }
            }

            function handleSalesClick(id) {
                if (!salesState.active) return;

                if (id === salesState.targetItem.id) {
                    // BENAR
                    salesState.score += 50; // +50 Gold per item
                    createFloatingText("+50 G", "#4ade80");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    updateSalesUI();
                    nextSalesCustomer();
                } else {
                    // SALAH
                    handleSalesMistake("Salah Barang! ❌");
                }
            }

            function handleSalesMistake(msg) {
                salesState.lives--;
                updateSalesUI();
                showToast(msg);
                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // Shake effect
                const box = document.querySelector('#sales-minigame .journal-box');
                box.style.transform = "translateX(5px)";
                setTimeout(() => box.style.transform = "translateX(0)", 100);

                if (salesState.lives <= 0) {
                    endSalesGame();
                } else {
                    nextSalesCustomer();
                }
            }

            function updateSalesUI() {
                document.getElementById('sales-score').innerText = salesState.score;
                document.getElementById('sales-lives').innerText = salesState.lives;
            }

            function endSalesGame() {
                clearInterval(salesState.interval);
                salesState.active = false;
                document.getElementById('sales-minigame').style.display = 'none';
                STATE.screen = 'play';

                // Give Rewards
                STATE.player.money += salesState.score;
                const expGain = Math.floor(salesState.score / 5);
                gainExp(expGain);
                STATE.player.biz += 2; // Skill Bisnis naik

                // Skip Waktu (Kerja memakan waktu)
                STATE.time += 200; // +2 Jam

                showDialogue("REKAP PENJUALAN",
                    `Toko Tutup!\n\n💰 Pendapatan: **${salesState.score} Gold**\n🧠 Pengalaman: **${expGain} EXP**\n📈 Skill Bisnis: **+2**\n\n(Waktu berlalu 2 Jam)`,
                    [{ text: "Mantap!", action: closeDialogue }],
                    'images/mejakasir.png'
                );
            }

            function quitSalesGame() {
                clearInterval(salesState.interval);
                salesState.active = false;
                document.getElementById('sales-minigame').style.display = 'none';
                STATE.screen = 'play';
            }

            // --- NEW: SISTEM PASSIVE INCOME (BISNIS) ---
            const BUSINESS_TIERS = [
                {
                    id: 'gerobak',
                    name: 'Gerobak Kopi Keliling',
                    desc: 'Bisnis pemula. Kopi sachet untuk pekerja.',
                    cost: 5000,
                    income: 10, // per 5 detik
                    reqBiz: 0,
                    icon: '☕',
                    img: 'images/gerobak.png' // Pastikan ada atau fallback
                },
                {
                    id: 'kios',
                    name: 'Kios Pulsa & Snack',
                    desc: 'Ruko kecil di pinggir jalan. Selalu ramai.',
                    cost: 25000,
                    income: 35,
                    reqBiz: 10,
                    icon: '🏪',
                    img: 'images/warnet.png'
                },
                {
                    id: 'minimarket',
                    name: 'Minimarket ArsaMart',
                    desc: 'Toko modern dengan AC. Favorit warga.',
                    cost: 100000,
                    income: 150,
                    reqBiz: 25,
                    icon: '🛒',
                    img: 'images/merchant.png'
                },
                {
                    id: 'mall',
                    name: 'Arsa Grand Mall',
                    desc: 'Pusat perbelanjaan elit. Mesin uang raksasa.',
                    cost: 1000000,
                    income: 1000,
                    reqBiz: 50,
                    icon: '🏢',
                    img: 'images/kampus.png'
                }
            ];

            // Helper: Init Data Bisnis Player
            function initBusinessState() {
                if (!STATE.player.business) {
                    STATE.player.business = {
                        owned: {}, // { 'gerobak': 2, 'kios': 1 }
                        lastCollect: Date.now()
                    };
                }
            }

            // 1. Loop Passive Income (Jalan di Background)
            function updatePassiveIncome() {
                initBusinessState();
                const p = STATE.player;

                // Hitung total income per tick (5 detik)
                let totalIncome = 0;
                BUSINESS_TIERS.forEach(biz => {
                    const count = p.business.owned[biz.id] || 0;
                    totalIncome += count * biz.income;
                });

                if (totalIncome > 0) {
                    // Cek waktu
                    const now = Date.now();
                    if (now - p.business.lastCollect >= 5000) { // 5 Detik
                        const ticks = Math.floor((now - p.business.lastCollect) / 5000);
                        const earn = totalIncome * ticks;

                        p.money += earn;
                        p.business.lastCollect = now;

                        // Visual Feedback (Kecil di pojok, jangan spam toast)
                        // Hanya muncul jika sedang main (screen play)
                        if (STATE.screen === 'play') {
                            spawnFloatingText(STATE.player.x, STATE.player.y - 50, `+${earn} G (Bisnis)`, '#10b981', 10);
                        }
                    }
                } else {
                    p.business.lastCollect = Date.now(); // Reset biar ga numpuk timestamp
                }
            }

            // 2. UI Menu Bisnis
            function openBusinessMenu() {
                initBusinessState();
                const p = STATE.player;

                document.getElementById('business-modal').style.display = 'flex';
                STATE.screen = 'minigame';

                updateBusinessUI();
            }

            function closeBusinessMenu() {
                document.getElementById('business-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            function updateBusinessUI() {
                const p = STATE.player;
                const list = document.getElementById('biz-upgrade-list');
                list.innerHTML = '';

                let totalIncome = 0;
                let totalOwned = 0;

                BUSINESS_TIERS.forEach(biz => {
                    const count = p.business.owned[biz.id] || 0;
                    totalIncome += count * biz.income;
                    totalOwned += count;

                    // Cek Syarat
                    const canBuy = p.money >= biz.cost;
                    const reqMet = p.biz >= biz.reqBiz;

                    let btnStyle = "background:#10b981;";
                    let btnText = `BELI (${biz.cost.toLocaleString()} G)`;
                    let btnAction = `buyBusiness('${biz.id}')`;

                    if (!reqMet) {
                        btnStyle = "background:#334155; color:#64748b; cursor:not-allowed;";
                        btnText = `🔒 Butuh BIZ ${biz.reqBiz}`;
                        btnAction = "";
                    } else if (!canBuy) {
                        btnStyle = "background:#ef4444; opacity:0.7;";
                        btnText = `Uang Kurang`;
                    }

                    const div = document.createElement('div');
                    div.style.cssText = "background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:10px; border:1px solid #334155; display:flex; gap:10px; align-items:center;";

                    div.innerHTML = `
            <div style="font-size:30px;">${biz.icon}</div>
            <div style="flex:1;">
                <div style="font-weight:bold; color:#f1f5f9;">${biz.name} <span style="background:#f59e0b; color:black; padding:1px 6px; border-radius:10px; font-size:10px;">Lvl ${count}</span></div>
                <div style="font-size:10px; color:#94a3b8;">${biz.desc}</div>
                <div style="font-size:11px; color:#4ade80; margin-top:2px;">Income: +${biz.income} G / 5s</div>
            </div>
            <button class="auth-btn" style="width:auto; padding:8px 12px; font-size:10px; ${btnStyle}" onclick="${btnAction}">${btnText}</button>
        `;
                    list.appendChild(div);
                });

                document.getElementById('biz-income-rate').innerText = totalIncome.toLocaleString();
                document.getElementById('biz-total-assets').innerText = totalOwned + " Unit";
            }

            function buyBusiness(id) {
                const p = STATE.player;
                const biz = BUSINESS_TIERS.find(b => b.id === id);

                if (p.money >= biz.cost) {
                    p.money -= biz.cost;
                    p.business.owned[id] = (p.business.owned[id] || 0) + 1;
                    p.biz += 2; // Beli bisnis nambah skill bisnis

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createFloatingText(`-${biz.cost}`, '#ef4444');
                    showToast(`Sukses Membeli ${biz.name}!`);

                    updateBusinessUI();

                    // 💡 CEK KONSEKUENSI: jika sisa uang sangat tipis setelah beli bisnis
                    if (p.money < 500 && p.role === 'entrepreneur') {
                        setTimeout(() => {
                            showKonsekuensi('entrepreneur_broke');
                        }, 800);
                    }
                } else {
                    showToast("Uang tidak cukup!");
                }
            }

            /** * KONFIGURASI TREN SOSMED / VIRAL
             */
            const TRENDS_DB = [
                {
                    id: 'seblak',
                    name: 'Seblak Pedas',
                    newsTitle: 'SEBLAK MELEDAK!',
                    newsBody: 'Jajanan pedas ini bikin siswa sekolah ketagihan. Pedagang kehabisan stok kerupuk!',
                    item: 'kerupuk_mentah',
                    itemName: 'Kerupuk Mentah',
                    desc: 'Bahan utama Seblak.'
                },
                {
                    id: 'latte',
                    name: 'Kopi Gula Aren',
                    newsTitle: 'KOPI SENJA HITS!',
                    newsBody: 'Anak-anak indie mulai menyerbu kedai kopi. Biji kopi jadi langka di pasaran.',
                    item: 'biji_kopi',
                    itemName: 'Biji Kopi',
                    desc: 'Bahan dasar kopi viral.'
                },
                {
                    id: 'lato',
                    name: 'Lato-lato',
                    newsTitle: 'DEMAM TEK-TEK!',
                    newsBody: 'Suara "tek tek" terdengar di mana-mana. Mainan jadul ini viral lagi!',
                    item: 'bola_plastik',
                    itemName: 'Bola Plastik',
                    desc: 'Bahan mainan lato-lato.'
                },
                {
                    id: 'croffle',
                    name: 'Croffle',
                    newsTitle: 'ANTRIAN CROFFLE!',
                    newsBody: 'Perpaduan Croissant dan Waffle ini bikin antrian mengular. Butuh adonan banyak!',
                    item: 'adonan_pastry',
                    itemName: 'Adonan Pastry',
                    desc: 'Bahan kue kekinian.'
                }
            ];

            // ==========================================
            // LOGIKA TREN SOSMED
            // ==========================================

            // ==========================================
            // 2. SISTEM HP & VIRAL
            // ==========================================
            function generateDailyTrend() {
                STATE.viral.active = null; // Reset
                // 40% Peluang Viral
                if (Math.random() < 0.4) {
                    const randIndex = Math.floor(Math.random() * TRENDS_DB.length);
                    STATE.viral.active = TRENDS_DB[randIndex];

                    // Notifikasi Visual
                    const btn = document.getElementById('phone-btn');
                    if (btn) btn.classList.add('phone-ringing');
                    showToast(`🔥 BREAKING NEWS: ${STATE.viral.active.name} VIRAL!`);
                } else {
                    const btn = document.getElementById('phone-btn');
                    if (btn) btn.classList.remove('phone-ringing');
                }
            }

            // --- FIX: FUNGSI YANG HILANG (WAJIB ADA UNTUK INTERAKSI MERCHANT) ---
            function getViralOption(npcId) {
                // Cek apakah ada tren viral aktif hari ini
                if (!STATE.viral.active) return null;

                const trend = STATE.viral.active;
                const p = STATE.player;
                // Cek stok barang viral di tas pemain
                const owned = p.inventory[trend.item] || 0;

                // Harga Jual Barang Viral (Naik 300% dari harga beli 500G -> Jadi 1500G)
                const sellPrice = 1500;

                // Opsi 1: Jika punya barang, muncul tombol JUAL
                if (owned > 0) {
                    return {
                        text: `🔥 JUAL BARANG VIRAL: ${trend.itemName} (x${owned})`,
                        isViral: true,
                        action: () => {
                            showDialogue("PAK ADI — BOS MERCHANT",
                                `Wah! Kamu punya stok **${trend.itemName}**?\nBarang ini lagi dicari semua orang di Sosmed!\n\nSaya berani beli mahal: **${sellPrice.toLocaleString()} G** per item.\n(Normal: ~200 G)`,
                                [
                                    { text: `Jual 1 (+${sellPrice.toLocaleString()} G)`, action: () => sellViralItem(trend.item, sellPrice, 1) },
                                    { text: `Jual Semua (+${(sellPrice * owned).toLocaleString()} G)`, action: () => sellViralItem(trend.item, sellPrice, owned) },
                                    { text: "Tahan Dulu (Tunggu Harga Naik?)", action: () => interactNPC({ id: npcId, name: "Merchant", imgSrc: 'images/job.png' }) }
                                ],
                                'images/job.png'
                            );
                        }
                    };
                }
                // Opsi 2: Jika tidak punya, muncul tombol INFO (Hint) - UPDATE TEKS AGAR LEBIH MENGAJAK
                else {
                    return {
                        text: `🔥 Info Tren Viral (Peluang Cuan!)`,
                        action: () => showDialogue("PAK ADI — BOS MERCHANT", `Dengar-dengar **${trend.itemName}** lagi viral banget hari ini di Sosmed!\n\nGudang saya kosong, tapi permintaannya gila-gilaan.\n\nSiapapun kamu (Mahasiswa/Pekerja/Warga), kalau bisa dapat barangnya dari **Bu Lastri (Pedagang Keliling)**, bawa ke sini. Saya beli 3x lipat!`, [{ text: "Siap Bos, saya carikan!", action: closeDialogue }], 'images/job.png')
                    };
                }
            }

            // ═══════════════════════════════════════════
            // 🎣 FISHING OVERLAY — JS CONTROLLER
            // ═══════════════════════════════════════════
            function showFishingOverlay() {
                const overlay = document.getElementById('fishing-overlay');
                if (!overlay) return;
                overlay.classList.add('active');
                document.body.classList.add('is-fishing');

                // Set zona target di bar
                const targetZone = document.getElementById('fishing-target-zone');
                if (targetZone) {
                    targetZone.style.left = STATE.fishing.targetStart + '%';
                    targetZone.style.width = STATE.fishing.targetWidth + '%';
                }
            }

            function hideFishingOverlay() {
                const overlay = document.getElementById('fishing-overlay');
                if (!overlay) return;
                overlay.classList.remove('active');
                document.body.classList.remove('is-fishing');
            }

            function updateFishingOverlayBar() {
                const indicator = document.getElementById('fishing-indicator');
                if (!indicator) return;
                indicator.style.left = STATE.fishing.barX + '%';

                // Warna indikator berubah hijau saat di zona target
                const inZone = STATE.fishing.barX >= STATE.fishing.targetStart &&
                               STATE.fishing.barX <= (STATE.fishing.targetStart + STATE.fishing.targetWidth);
                if (inZone) {
                    indicator.style.background = 'linear-gradient(to bottom, #fff, #4ade80, #fff)';
                    indicator.style.boxShadow = '0 0 10px #4ade80, 0 0 20px #4ade80, 0 0 4px rgba(255,255,255,0.9)';
                } else {
                    indicator.style.background = 'linear-gradient(to bottom, #fff, #7dd3fc, #fff)';
                    indicator.style.boxShadow = '0 0 10px #fff, 0 0 20px #7dd3fc, 0 0 4px rgba(255,255,255,0.9)';
                }
            }

            function handleFishingBtnClick(e) {
                // Ripple effect
                const btn = document.getElementById('fishing-action-btn');
                if (btn) {
                    const ripple = document.createElement('span');
                    ripple.className = 'fishing-ripple';
                    const rect = btn.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = ((e.clientX || rect.left + rect.width/2) - rect.left - size/2) + 'px';
                    ripple.style.top = ((e.clientY || rect.top + rect.height/2) - rect.top - size/2) + 'px';
                    btn.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                }
                if (STATE.fishing && STATE.fishing.active) checkFishing();
            }

            // ═══════════════════════════════════════════════════════════
            // 💡 SISTEM KONSEKUENSI NYATA
            // Menghubungkan kejadian di game dengan fakta dunia nyata
            // + wajib tulis refleksi sebelum lanjut
            // ═══════════════════════════════════════════════════════════

            // Database fakta & pertanyaan per kondisi
            const KONSEKUENSI_DB = {

                // ── WIRAUSAHA / ENTREPRENEUR ──────────────────────────
                entrepreneur_broke: {
                    icon: '💸',
                    title: 'MODAL HABIS — WIRAUSAHA',
                    fact: '60% UMKM di Indonesia gagal di tahun pertama karena kurang perencanaan modal dan manajemen arus kas. Kamu baru saja mengalaminya dengan aman di sini.',
                    question: 'Di dunia nyata, apa langkah pertama yang kamu ambil sebelum memulai usaha agar tidak kehabisan modal?'
                },
                entrepreneur_debt: {
                    icon: '🏦',
                    title: 'TERJEBAK HUTANG — WIRAUSAHA',
                    fact: 'Hutang usaha yang tidak terencana adalah penyebab ke-2 kebangkrutan UMKM. Bank Indonesia mencatat 42% pelaku usaha pemula tidak memiliki catatan keuangan sederhana.',
                    question: 'Bagaimana cara kamu membedakan "hutang produktif" dan "hutang konsumtif" dalam menjalankan usaha?'
                },
                entrepreneur_low_biz: {
                    icon: '📉',
                    title: 'PENJUALAN STAGNAN — WIRAUSAHA',
                    fact: 'Studi Kemenkop menunjukkan 78% UMKM gagal berkembang karena tidak melakukan inovasi produk dan riset pasar. Pelanggan pergi ke kompetitor yang lebih kreatif.',
                    question: 'Apa satu inovasi konkret yang bisa kamu lakukan untuk membuat produk atau jasamu lebih menarik?'
                },

                // ── PEKERJA / WORKER ──────────────────────────────────
                worker_fired: {
                    icon: '🏭',
                    title: 'REPUTASI BOSS HANCUR — PEKERJA',
                    fact: 'Survei LinkedIn 2023: 89% karyawan dipecat bukan karena kurang skill, melainkan karena soft skill — disiplin, komunikasi, dan sikap kerja yang buruk.',
                    question: 'Apa satu kebiasaan buruk di tempat kerja yang ingin kamu perbaiki, dan bagaimana caranya?'
                },
                worker_low_energy: {
                    icon: '😴',
                    title: 'KELELAHAN — PEKERJA',
                    fact: 'WHO menyebut burnout sebagai fenomena kerja resmi. 40% pekerja muda Indonesia mengalami kelelahan kronis karena tidak menjaga keseimbangan kerja dan istirahat.',
                    question: 'Bagaimana cara kamu menjaga stamina fisik dan mental agar produktif tapi tidak kelelahan?'
                },
                worker_broke: {
                    icon: '💼',
                    title: 'GAJI HABIS SEBELUM AKHIR BULAN',
                    fact: '75% karyawan muda Indonesia menghabiskan gaji dalam 10 hari pertama tanpa tabungan darurat. Ini disebut "Paycheck to Paycheck" — lingkaran yang sulit diputus.',
                    question: 'Jika kamu punya gaji 3 juta, berapa yang akan kamu alokasikan untuk tabungan, kebutuhan pokok, dan hiburan?'
                },

                // ── MAHASISWA / STUDENT ───────────────────────────────
                student_failed_exam: {
                    icon: '📚',
                    title: 'GAGAL UJIAN — MAHASISWA',
                    fact: 'Penelitian Universitas Cambridge: Belajar sistem SKS (belajar banyak di malam terakhir) hanya efektif 23% dibanding belajar terjadwal harian. Otak manusia butuh pengulangan berkala.',
                    question: 'Bagaimana strategi belajarmu selama ini? Apa yang akan kamu ubah agar nilaimu lebih baik?'
                },
                student_debt_ukt: {
                    icon: '🎓',
                    title: 'TUNGGAKAN UKT — MAHASISWA',
                    fact: 'Data Kemendikbud: 1 dari 5 mahasiswa Indonesia terancam DO karena masalah biaya. Perencanaan finansial sejak SMA bisa mencegah ini.',
                    question: 'Apa langkah nyata yang bisa kamu mulai sekarang untuk mempersiapkan biaya kuliah atau melunasi tanggungan?'
                },
                student_low_int: {
                    icon: '🧠',
                    title: 'PRESTASI MENURUN — MAHASISWA',
                    fact: 'Riset Stanford: Menghabiskan >4 jam/hari di medsos menurunkan kemampuan fokus dan nilai akademik rata-rata 1,2 poin. Distraksi digital adalah musuh terbesar pelajar masa kini.',
                    question: 'Berapa jam sehari kamu habiskan untuk belajar vs untuk hiburan digital? Apakah porsinya sudah seimbang?'
                },

                // ── KEHIDUPAN KELUARGA / FAMILY ───────────────────────
                family_broke: {
                    icon: '🏠',
                    title: 'EKONOMI KELUARGA KRITIS',
                    fact: 'BKKBN mencatat 64% perceraian dini di Indonesia dipicu masalah finansial. Menikah tanpa kesiapan ekonomi meningkatkan risiko konflik rumah tangga 3x lipat.',
                    question: 'Menurut kamu, kesiapan apa saja yang harus dipenuhi sebelum seseorang siap membangun keluarga?'
                },
                family_low_rep: {
                    icon: '💔',
                    title: 'HUBUNGAN MEMBURUK — KELUARGA',
                    fact: 'Psikolog Dr. John Gottman menemukan: butuh 5 interaksi positif untuk mengimbangi 1 interaksi negatif dalam hubungan. Konsistensi perhatian kecil lebih kuat dari hadiah besar sesekali.',
                    question: 'Apa satu hal sederhana yang bisa kamu lakukan setiap hari untuk menjaga hubungan baikmu dengan orang-orang terdekat?'
                },

                // ── UMUM (FALLBACK) ────────────────────────────────────
                general_broke: {
                    icon: '💰',
                    title: 'KEUANGAN KRITIS',
                    fact: 'OJK Indonesia: Hanya 38% anak muda Indonesia memiliki tabungan darurat minimal 3 bulan pengeluaran. Literasi keuangan sejak dini adalah kunci kebebasan finansial.',
                    question: 'Langkah keuangan apa yang ingin kamu mulai terapkan mulai hari ini dalam kehidupan nyatamu?'
                },
                general_low_energy: {
                    icon: '⚡',
                    title: 'KEHABISAN ENERGI',
                    fact: 'WHO: Remaja butuh 8-10 jam tidur per malam untuk fungsi otak optimal. Kurang tidur kronis menurunkan kemampuan belajar hingga 40% dan meningkatkan risiko depresi.',
                    question: 'Bagaimana pola istirahatmu selama ini? Apa yang akan kamu ubah untuk menjaga kesehatan fisik dan mentalmu?'
                }
            };

            // State: callback yang dijalankan SETELAH refleksi selesai
            let _konsekuensiCallback = null;
            let _konsekuensiKey = null;

            // ── FUNGSI UTAMA: tampilkan layar konsekuensi ──
            function showKonsekuensi(kondisi, callback) {
                const data = KONSEKUENSI_DB[kondisi] || KONSEKUENSI_DB['general_broke'];
                _konsekuensiCallback = callback || null;
                _konsekuensiKey = kondisi;

                document.getElementById('konsekuensi-icon').innerText = data.icon;
                document.getElementById('konsekuensi-title').innerText = data.title;
                document.getElementById('konsekuensi-fact-text').innerText = data.fact;
                document.getElementById('konsekuensi-question').innerText = data.question;
                document.getElementById('konsekuensi-textarea').value = '';
                document.getElementById('konsekuensi-char-count').innerText = '0 / 20 karakter minimum';
                document.getElementById('konsekuensi-char-count').className = 'konsekuensi-char-count';
                document.getElementById('konsekuensi-submit-btn').disabled = true;

                document.getElementById('konsekuensi-modal').classList.add('active');
                STATE.screen = 'modal';

                setTimeout(() => document.getElementById('konsekuensi-textarea').focus(), 400);
            }

            function updateKonsekuensiChar() {
                const val = document.getElementById('konsekuensi-textarea').value.trim();
                const len = val.length;
                const countEl = document.getElementById('konsekuensi-char-count');
                const btn = document.getElementById('konsekuensi-submit-btn');
                const MIN = 20;
                countEl.innerText = `${len} / ${MIN} karakter minimum`;
                if (len >= MIN) {
                    countEl.className = 'konsekuensi-char-count ok';
                    btn.disabled = false;
                    btn.innerText = 'LANJUTKAN →';
                } else {
                    countEl.className = 'konsekuensi-char-count';
                    btn.disabled = true;
                }
            }

            function submitKonsekuensi() {
                const text = document.getElementById('konsekuensi-textarea').value.trim();
                if (text.length < 20) return;

                // Simpan ke refleksi jurnal player dengan tag khusus
                if (!STATE.player.reflections) STATE.player.reflections = [];
                STATE.player.reflections.push({
                    day: STATE.day,
                    text: `[KONSEKUENSI NYATA — ${_konsekuensiKey}] ${text}`,
                    timestamp: Date.now()
                });
                manualSave();

                document.getElementById('konsekuensi-modal').classList.remove('active');
                STATE.screen = 'play';

                showToast('✅ Refleksi tersimpan! +10 INT');
                STATE.player.int = (STATE.player.int || 0) + 10;

                if (typeof _konsekuensiCallback === 'function') {
                    _konsekuensiCallback();
                    _konsekuensiCallback = null;
                }
            }

            // ── FUNGSI CEK OTOMATIS (dipanggil saat tidur / ganti hari) ──
            function checkKonsekuensiTriggers(onDone) {
                const p = STATE.player;
                const role = p.role;

                // Cek apakah sudah pernah trigger hari ini
                if (p.lastKonsekuensiDay === STATE.day) {
                    if (typeof onDone === 'function') onDone();
                    return;
                }

                let kondisi = null;

                // ── WIRAUSAHA ──
                if (role === 'entrepreneur') {
                    if (p.money <= 0) kondisi = 'entrepreneur_broke';
                    else if (p.money < 0) kondisi = 'entrepreneur_debt';
                    else if ((p.biz || 0) < 10 && STATE.day > 14) kondisi = 'entrepreneur_low_biz';
                }
                // ── PEKERJA ──
                else if (role === 'worker') {
                    if ((p.bossReputation || 0) < 20 && STATE.day > 7) kondisi = 'worker_fired';
                    else if (p.money < 500 && STATE.day > 5) kondisi = 'worker_broke';
                    else if ((p.energy || 100) < 15) kondisi = 'worker_low_energy';
                }
                // ── MAHASISWA ──
                else if (role === 'student') {
                    if (p.money < 0) kondisi = 'student_debt_ukt';
                    else if (p.lastExamFailDay && (STATE.day - p.lastExamFailDay) <= 2) kondisi = 'student_failed_exam';
                    else if ((p.int || 0) < 10 && STATE.day > 10) kondisi = 'student_low_int';
                }
                // ── KELUARGA ──
                else if (role === 'family') {
                    if (p.money < 0) kondisi = 'family_broke';
                    else if ((p.rep || 0) < 10 && STATE.day > 7) kondisi = 'family_low_rep';
                }

                // Fallback umum
                if (!kondisi && p.money < 100 && STATE.day > 3) {
                    kondisi = 'general_broke';
                }

                if (kondisi) {
                    p.lastKonsekuensiDay = STATE.day;
                    showKonsekuensi(kondisi, onDone);
                } else {
                    if (typeof onDone === 'function') onDone();
                }
            }

            // ═══════════════════════════════════════════════════════════
            // 🎯 CAREER REALITY CHECK — DATA & FUNGSI
            // Menampilkan data nyata dunia kerja sebelum siswa
            // mengkonfirmasi pilihan jalur karir mereka
            // ═══════════════════════════════════════════════════════════

            const CAREER_REALITY_DATA = {

                worker: {
                    icon: '⚔️',
                    name: 'JALUR PEKERJA',
                    sub: 'FIGHTER — STR++ / Dunia Kerja Nyata',
                    headerGradient: 'linear-gradient(135deg, #1e3a5f, #1d4ed8, #2563eb)',
                    accentColor: '#3b82f6',
                    stats: [
                        {
                            label: '💵 UMR Jawa Timur 2025',
                            value: 'Rp 2.165.244 / bulan',
                            color: '#60a5fa'
                        },
                        {
                            label: '🏆 UMR Surabaya 2025',
                            value: 'Rp 4.887.540 / bulan',
                            color: '#34d399'
                        },
                        {
                            label: '📊 Persaingan Kerja',
                            value: '1 lowongan untuk\n50–80 pelamar',
                            color: '#f87171'
                        },
                        {
                            label: '📈 Kenaikan Gaji Rata-rata',
                            value: '8–12% per tahun\njika berprestasi',
                            color: '#a78bfa'
                        },
                        {
                            label: '🎓 Sertifikasi Pendongkrak Gaji',
                            value: 'BNSP, LSP-P1, K3 Umum,\nBrevet Pajak, Sertifikasi SMK',
                            color: '#fbbf24',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Disiplin & Tepat Waktu', color: '#1d4ed8', bg: '#dbeafe' },
                        { label: 'Komunikasi Kerja', color: '#1e40af', bg: '#eff6ff' },
                        { label: 'Kerja Tim', color: '#1d4ed8', bg: '#dbeafe' },
                        { label: 'Microsoft Office', color: '#1e40af', bg: '#eff6ff' },
                        { label: 'Manajemen Waktu', color: '#1d4ed8', bg: '#dbeafe' },
                        { label: 'Problem Solving', color: '#1e40af', bg: '#eff6ff' }
                    ],
                    insightLabel: '📊 FAKTA BPS 2024',
                    insightBg: 'rgba(59,130,246,0.08)',
                    insightBorder: 'rgba(59,130,246,0.3)',
                    insightColor: '#93c5fd',
                    insight: 'Lulusan SMK memiliki tingkat penyerapan kerja 62% dalam 1 tahun — tertinggi dibanding lulusan SMA/MA. Kompetensi vokasi + sertifikasi BNSP meningkatkan gaji awal hingga 35%.',
                    confirmColor: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                    confirmShadow: 'rgba(59,130,246,0.4)'
                },

                student: {
                    icon: '🎓',
                    name: 'JALUR MAHASISWA',
                    sub: 'MAGE — INT++ / Dunia Akademik Nyata',
                    headerGradient: 'linear-gradient(135deg, #1a1a2e, #6d28d9, #7c3aed)',
                    accentColor: '#8b5cf6',
                    stats: [
                        {
                            label: '💰 Biaya Kuliah / Semester',
                            value: 'PTN: Rp 500k–5 juta\nPTS: Rp 3–15 juta',
                            color: '#c4b5fd'
                        },
                        {
                            label: '⏱️ Lama Studi S1',
                            value: 'Rata-rata 4,5 tahun\n(target 4 tahun)',
                            color: '#a78bfa'
                        },
                        {
                            label: '📉 Angka DO Nasional',
                            value: '~25% mahasiswa\ntidak sampai wisuda',
                            color: '#f87171'
                        },
                        {
                            label: '💼 Rata-rata Gaji Fresh Graduate',
                            value: 'Rp 3–5 juta/bulan\n(tergantung jurusan)',
                            color: '#34d399'
                        },
                        {
                            label: '🏅 Jurusan Paling Dicari Industri',
                            value: 'Teknologi Informasi, Akuntansi, Teknik Industri,\nKeperawatan, Pendidikan Vokasi',
                            color: '#fbbf24',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Berpikir Kritis', color: '#6d28d9', bg: '#ede9fe' },
                        { label: 'Riset & Analisis', color: '#5b21b6', bg: '#f5f3ff' },
                        { label: 'Manajemen Waktu', color: '#6d28d9', bg: '#ede9fe' },
                        { label: 'Menulis Ilmiah', color: '#5b21b6', bg: '#f5f3ff' },
                        { label: 'Bahasa Inggris', color: '#6d28d9', bg: '#ede9fe' },
                        { label: 'Teknologi Digital', color: '#5b21b6', bg: '#f5f3ff' }
                    ],
                    insightLabel: '🎓 INSIGHT KEMENDIKBUD',
                    insightBg: 'rgba(139,92,246,0.08)',
                    insightBorder: 'rgba(139,92,246,0.3)',
                    insightColor: '#c4b5fd',
                    insight: '1 dari 5 mahasiswa Indonesia tidak menyelesaikan kuliah karena masalah finansial. Siswa yang lulus dengan IPK 3.5+ dan aktif magang mendapat gaji pertama 2× lebih tinggi dari rata-rata.',
                    confirmColor: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
                    confirmShadow: 'rgba(139,92,246,0.4)'
                },

                entrepreneur: {
                    icon: '🏪',
                    name: 'JALUR WIRAUSAHA',
                    sub: 'SUPPORT — BIZ++ / Dunia UMKM Nyata',
                    headerGradient: 'linear-gradient(135deg, #78350f, #d97706, #f59e0b)',
                    accentColor: '#f59e0b',
                    stats: [
                        {
                            label: '💵 Modal Awal UMKM Rata-rata',
                            value: 'Rp 5–50 juta\n(skala mikro: < Rp 5 juta)',
                            color: '#fcd34d'
                        },
                        {
                            label: '📊 Tingkat Keberhasilan Tahun 1',
                            value: 'Hanya 40% bertahan\n60% tutup tahun pertama',
                            color: '#f87171'
                        },
                        {
                            label: '📈 Omset UMKM Sukses',
                            value: 'Rp 10–300 juta/bulan\n(setelah 3 tahun)',
                            color: '#34d399'
                        },
                        {
                            label: '🏦 Akses Modal Usaha',
                            value: 'KUR BRI/BNI: 3–6%/tahun\nDana bergulir Kemenkop',
                            color: '#93c5fd'
                        },
                        {
                            label: '📱 Platform Jualan Digital Terpopuler',
                            value: 'Shopee, TikTok Shop, Instagram, Tokopedia — GRATIS untuk mulai',
                            color: '#a78bfa',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Manajemen Keuangan', color: '#92400e', bg: '#fef3c7' },
                        { label: 'Pemasaran Digital', color: '#78350f', bg: '#fffbeb' },
                        { label: 'Negosiasi', color: '#92400e', bg: '#fef3c7' },
                        { label: 'Kreativitas Produk', color: '#78350f', bg: '#fffbeb' },
                        { label: 'Layanan Pelanggan', color: '#92400e', bg: '#fef3c7' },
                        { label: 'Pencatatan Usaha', color: '#78350f', bg: '#fffbeb' }
                    ],
                    insightLabel: '📊 DATA KEMENKOP 2024',
                    insightBg: 'rgba(245,158,11,0.08)',
                    insightBorder: 'rgba(245,158,11,0.3)',
                    insightColor: '#fcd34d',
                    insight: '65,5 juta UMKM menyumbang 61% PDB Indonesia — tapi 78% tidak punya catatan keuangan. UMKM yang pakai digital marketing tumbuh 3× lebih cepat dari yang tidak.',
                    confirmColor: 'linear-gradient(135deg, #d97706, #f59e0b)',
                    confirmShadow: 'rgba(245,158,11,0.4)'
                },

                family: {
                    icon: '🏠',
                    name: 'JALUR KELUARGA',
                    sub: 'FAMILY — REP++ / Realita Rumah Tangga',
                    headerGradient: 'linear-gradient(135deg, #831843, #db2777, #ec4899)',
                    accentColor: '#ec4899',
                    stats: [
                        {
                            label: '💰 Biaya Hidup Keluarga/Bulan',
                            value: 'Minimum Rp 3–5 juta\n(pasangan + 1 anak)',
                            color: '#f9a8d4'
                        },
                        {
                            label: '📉 Angka Cerai Indonesia',
                            value: '516.000 kasus/tahun\n(naik 54% sejak 2019)',
                            color: '#f87171'
                        },
                        {
                            label: '⚠️ Penyebab Konflik Utama',
                            value: '#1 Masalah Finansial\n#2 Komunikasi buruk',
                            color: '#fbbf24'
                        },
                        {
                            label: '👶 Usia Ideal Menikah (WHO)',
                            value: 'Perempuan ≥ 21 tahun\nLaki-laki ≥ 25 tahun',
                            color: '#34d399'
                        },
                        {
                            label: '💡 Kunci Keluarga Harmonis',
                            value: 'Komunikasi terbuka · Kestabilan finansial · Dukungan emosional · Perencanaan bersama',
                            color: '#a78bfa',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Komunikasi Pasangan', color: '#9d174d', bg: '#fce7f3' },
                        { label: 'Manajemen Anggaran', color: '#831843', bg: '#fdf2f8' },
                        { label: 'Parenting', color: '#9d174d', bg: '#fce7f3' },
                        { label: 'Empati & Sabar', color: '#831843', bg: '#fdf2f8' },
                        { label: 'Problem Solving', color: '#9d174d', bg: '#fce7f3' },
                        { label: 'Perencanaan Masa Depan', color: '#831843', bg: '#fdf2f8' }
                    ],
                    insightLabel: '💔 DATA BKKBN 2024',
                    insightBg: 'rgba(236,72,153,0.08)',
                    insightBorder: 'rgba(236,72,153,0.3)',
                    insightColor: '#f9a8d4',
                    insight: '64% perceraian dini dipicu masalah ekonomi. Remaja yang menikah sebelum 20 tahun memiliki risiko kemiskinan 3× lebih tinggi. Pendidikan & karir yang mapan adalah fondasi keluarga sehat.',
                    confirmColor: 'linear-gradient(135deg, #be185d, #ec4899)',
                    confirmShadow: 'rgba(236,72,153,0.4)'
                }
            };

            let _pendingRole = null; // Role yang menunggu konfirmasi

            // Tampilkan Career Reality Check sebelum setRole dipanggil
            function showCareerCheck(role) {
                const data = CAREER_REALITY_DATA[role];
                if (!data) { setRole(role); return; } // Fallback langsung

                _pendingRole = role;

                // Set header
                const header = document.getElementById('crc-header');
                header.style.background = data.headerGradient;
                document.getElementById('crc-icon').innerText = data.icon;
                document.getElementById('crc-role-name').style.color = '#fff';
                document.getElementById('crc-role-name').innerText = data.name;
                document.getElementById('crc-role-sub').innerText = data.sub;

                // Buat stat cards
                const grid = document.getElementById('crc-stats-grid');
                grid.innerHTML = '';
                data.stats.forEach(s => {
                    const card = document.createElement('div');
                    card.className = 'crc-stat-card' + (s.wide ? ' highlight' : '');
                    card.style.borderColor = s.color + '33';
                    card.innerHTML = `
                        <div class="crc-stat-label" style="color:${s.color}">${s.label}</div>
                        <div class="crc-stat-value" style="white-space:pre-line">${s.value}</div>
                    `;
                    grid.appendChild(card);
                });

                // Buat skill tags
                const skillsEl = document.getElementById('crc-skills');
                skillsEl.innerHTML = '';
                data.skills.forEach(sk => {
                    const tag = document.createElement('span');
                    tag.className = 'crc-skill-tag';
                    tag.style.background = sk.bg;
                    tag.style.color = sk.color;
                    tag.innerText = sk.label;
                    skillsEl.appendChild(tag);
                });

                // Insight
                const insightEl = document.getElementById('crc-insight');
                insightEl.style.background = data.insightBg;
                insightEl.style.borderLeft = `3px solid ${data.insightBorder}`;
                document.getElementById('crc-insight-label').style.color = data.insightColor;
                document.getElementById('crc-insight-label').innerText = data.insightLabel;
                document.getElementById('crc-insight-text').style.color = data.insightColor;
                document.getElementById('crc-insight-text').innerText = data.insight;

                // Tombol konfirmasi
                const btn = document.getElementById('crc-confirm-btn');
                btn.style.background = data.confirmColor;
                btn.style.boxShadow = `0 4px 20px ${data.confirmShadow}`;
                btn.style.color = role === 'entrepreneur' ? '#0f172a' : '#fff';

                document.getElementById('career-check-modal').classList.add('active');
                STATE.screen = 'modal';
            }

            function confirmCareerChoice() {
                document.getElementById('career-check-modal').classList.remove('active');
                STATE.screen = 'play';
                if (_pendingRole) {
                    const role = _pendingRole;
                    _pendingRole = null;
                    setRole(role);
                }
            }

            function cancelCareerCheck() {
                document.getElementById('career-check-modal').classList.remove('active');
                STATE.screen = 'play';
                _pendingRole = null;
                // Kembali ke menu pilih role
                setTimeout(() => openRoleSelection(), 200);
            }

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


            // ═══════════════════════════════════════════
            // 🧚 FAIRY VILLAGE MINIGAME
            // ═══════════════════════════════════════════
