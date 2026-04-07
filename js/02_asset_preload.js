// ========================================================
// js/02_asset_preload.js
// Preload & Asset Management
// ========================================================

            async function preloadAllGameAssets() {
                const loadingBar  = document.getElementById('loading-bar');
                const loadingText = document.getElementById('loading-text');

                // ─── HELPER: load satu gambar (resolve selalu, tidak pernah reject) ───
                const loadOne = (src, element = null) => new Promise(resolve => {
                    // Jika browser sudah punya cache (dari Image() yang di-assign di awal script),
                    // skip buat Image baru — cukup tandai element jika ada, lalu resolve.
                    const img = new Image();
                    img.onload = () => {
                        if (element) element.loadedImg = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn("Asset tidak ditemukan:", src);
                        resolve(); // Jangan block game
                    };
                    img.src = src;
                });

                // ─── HELPER: load satu batch, update progress bar setelahnya ───
                const loadBatch = async (items, startPct, endPct) => {
                    const range = endPct - startPct;
                    let done = 0;
                    const total = items.length;
                    if (total === 0) {
                        if (loadingBar)  loadingBar.style.width  = endPct + '%';
                        if (loadingText) loadingText.innerText   = `MEMUAT ASET... ${endPct}%`;
                        return;
                    }
                    await Promise.all(items.map(item => {
                        const p = typeof item === 'string'
                            ? loadOne(item)
                            : loadOne(item.src, item.element);
                        return p.then(() => {
                            done++;
                            const pct = Math.floor(startPct + (done / total) * range);
                            if (loadingBar)  loadingBar.style.width  = pct + '%';
                            if (loadingText) loadingText.innerText   = `MEMUAT ASET... ${pct}%`;
                        });
                    }));
                };

                // ════════════════════════════════════════════════════
                // TAHAP 1 (0–30%): Aset WAJIB — Player & UI Utama
                // ════════════════════════════════════════════════════
                const phase1 = [
                    'images/bg.png', 'images/landinggame.png', 'images/lobby.png',
                    'images/boy.png', 'images/boy-idle.png', 'images/boy-walk.png',
                    'images/boy-atas.png', 'images/boy-bawah.png', 'images/boy-pukul.png',
                    'images/girl.png', 'images/girl-idle.png', 'images/girl-walk.png',
                    'images/girl-atas.png', 'images/girl-bawah.png', 'images/girl-pukul.png',
                    'images/tas-isi.png', 'images/tas-kosong.png',
                    'images/quest-scroll.png', 'images/leaderboard.png',
                    // Background musim (langsung tampil saat masuk village)
                    'images/bg-pulau.png', 'images/bg-pulau-panas.png',
                    'images/bg-pulau-gugur.png', 'images/bg-pulau-salju.png',
                    // Rumah level 1 (starting location)
                    'images/houselevel1.png', 'images/houselevel2.png',
                    'images/houselevel3.png', 'images/houselevel4.png', 'images/houselevel5.png',
                    // Rumah indoor (pertama kali masuk game langsung di rumah)
                    'images/rumahindoor_level1.png', 'images/rumahindoor_level2.png',
                    'images/rumahindoor_level3.png', 'images/rumahindoor_level4.png',
                    'images/rumahindoor_level5.png',
                ];
                await loadBatch(phase1, 0, 30);

                // ════════════════════════════════════════════════════
                // TAHAP 2 (30–60%): Aset MAP — NPC, Bangunan, Objek
                // ════════════════════════════════════════════════════
                const phase2 = [];
                const seenMap = new Set();
                try {
                    if (typeof maps !== 'undefined') {
                        for (const mapData of Object.values(maps)) {
                            if (mapData.buildings) mapData.buildings.forEach(b => {
                                if (b.img && !seenMap.has(b.img)) { seenMap.add(b.img); phase2.push({ src: b.img, element: b }); }
                            });
                            if (mapData.npcs) mapData.npcs.forEach(n => {
                                if (n.imgSrc && !seenMap.has(n.imgSrc)) { seenMap.add(n.imgSrc); phase2.push({ src: n.imgSrc, element: n }); }
                            });
                            if (mapData.objects) mapData.objects.forEach(o => {
                                if (o.img && !seenMap.has(o.img)) { seenMap.add(o.img); phase2.push({ src: o.img, element: o }); }
                            });
                        }
                    }
                } catch(e) { console.warn("Map assets skip:", e); }
                // Tambah tile/wall assets
                const tileAssets = [
                    'images/pohon-trunk.png', 'images/pohon-kanopi.png',
                    'images/batang-sakura.png', 'images/pohon-sakura.png',
                    'images/rumput.png', 'images/rumput2.png', 'images/bunga.png',
                    'images/lahan-liar.png', 'images/lantaicandi.png', 'images/lantaimerahcandi.png',
                    'images/lantai-reruntuhan.png', 'images/tembok-reruntuhan.png',
                    'images/lantaiklinik.png', 'images/lantaimentor.png',
                    'images/tiletembokkampus.png', 'images/tilelantaikampus.png',
                    'images/tilelantaiperpus.png', 'images/tiletembokperpus.png',
                    'images/tilelantaiguild.png', 'images/tiletembokguild.png',
                    'images/tiletembokrumahplayer.png', 'images/titletembokbawahplayer.png',
                    'images/tiletembokblacksmith.png',
                    'images/dungeon_wall.png', 'images/dungeon_floor.png', 'images/batudidungeon.png',
                ];
                tileAssets.forEach(s => { if (!seenMap.has(s)) { seenMap.add(s); phase2.push(s); }});
                await loadBatch(phase2, 30, 60);

                // ════════════════════════════════════════════════════
                // TAHAP 3 (60–85%): Aset ITEM & KARAKTER SEKUNDER
                // ════════════════════════════════════════════════════
                const phase3 = [
                    'images/ikankecil.png', 'images/ikansedang.png', 'images/ikanbesar.png', 'images/ikanlegendary.png',
                    'images/buku.png', 'images/buku-tesis-teknologi.png', 'images/buku-tesis-sejarah.png',
                    'images/draftskripsi-teknologi.png', 'images/draftskripsi-sejarah.png',
                    'images/sertifikat-manajer.png', 'images/ijazah-teknologi.png', 'images/ijazah-sejarah.png',
                    'images/kurcacitani.png', 'images/peripanen.png', 'images/orangsawah.png',
                    'images/rafflesia.png', 'images/arcacandi.png', 'images/gucicandi.png',
                    'images/lilinabadi.png', 'images/prasasticandi.png', 'images/mejaaltar.png',
                    'images/jaringikan.png', 'images/rakpancing.png', 'images/emberikan.png',
                    'images/boxes.png', 'images/kasurnelayan.png', 'images/rakpialaikan.png', 'images/mejamakanikan.png',
                    'images/mejadokter.png', 'images/lemariobat.png', 'images/arsiprekammedis.png',
                    'images/kebunayu.png', 'images/kasurayaayu.png', 'images/lemariayaayu.png',
                    'images/mejaayaayu.png', 'images/dapurayaayu.png',
                    'images/kaia.png', 'images/anakkecil1.png', 'images/anakkecil2.png',
                    'images/tumpukankertas.png', 'images/fotomentor.png', 'images/altar.png',
                    'images/tungku.png', 'images/paron.png', 'images/raksenajata.png',
                    'images/mejajahit.png', 'images/bijihbesi.png', 'images/kayubakar.png', 'images/snowman.png',
                    'images/warnet.png', 'images/penjagawarnet.png', 'images/maidwarnet.png',
                    'images/tokoplayer.png',
                    // Kostum tambahan
                    'images/boy-idle-weding.png', 'images/boy-walk-weding.png',
                    'images/girl-idle-weding.png', 'images/girl-walk-weding.png',
                    // Monster & dungeon
                    'images/monster.png', 'images/monster-lvl2.png', 'images/monster-lvl3.png',
                    'images/monster-lvl4.png', 'images/monster-lvl5.png',
                    'images/monster-thief.png', 'images/monster-boss.png',
                    // Fairy village
                    'images/rarawilis.png', 'images/wening.png', 'images/sekar.png',
                    'images/bening.png', 'images/juna.png', 'images/pohonperi.png',
                    'images/peri_pr1.png', 'images/peri_pr2.png', 'images/peri_pr3.png',
                    'images/peri_pr4.png', 'images/peri_lk1.png', 'images/peri_lk2.png',
                    'images/sendang-tier1.png', 'images/sendang-tier2.png', 'images/sendang-tier3.png',
                    'images/taman-tier1.png', 'images/taman-tier2.png', 'images/taman-tier3.png',
                    'images/sekolah-tier1.png', 'images/sekolah-tier2.png', 'images/sekolah-tier3.png',
                    'images/pasar-tier1.png', 'images/pasar-tier2.png', 'images/pasar-tier3.png',
                    'images/menara-tier1.png', 'images/menara-tier2.png', 'images/menara-tier3.png',
                    'images/istanaperi.png',
                    // Logo & misc
                    'images/logosmk.png', 'images/loganailul.png', 'images/logotkj.png',
                    // Balap
                    'images/player-race.png', 'images/taxi-race.png', 'images/bike-race.png',
                    'images/truck-race.png', 'images/suv-race.png',
                ].filter(s => !seenMap.has(s)); // skip yg sudah di-load di phase2
                await loadBatch(phase3, 60, 85);

                // ════════════════════════════════════════════════════
                // TAHAP 4 (85–100%): Scene Prologue (File besar, load terakhir)
                // ════════════════════════════════════════════════════
                const phase4 = [];
                for (let i = 1; i <= 10; i++) phase4.push(`images/scene-${i}.png`);
                await loadBatch(phase4, 85, 100);

                console.log(`✅ Semua aset selesai dimuat dalam 4 tahap.`);
            }

            // UPDATE: FUNGSI INIT PERTAMA KALI
            function startGameSequence() {
