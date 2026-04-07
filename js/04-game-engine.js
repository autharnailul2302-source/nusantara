            const TILE_SIZE = 30;
            // DEBUG_MAP_BOUNDARIES sekarang mengikuti window.GAME_DEBUG dari Admin Panel
            // Gunakan: if (DEBUG_MAP_BOUNDARIES) { ... }  — sama seperti sebelumnya
            Object.defineProperty(window, 'DEBUG_MAP_BOUNDARIES', {
                get: () => !!(window.GAME_DEBUG),
                configurable: true
            });

            function resize() {
                /* UPDATE: FUNGSI RESIZE DINAMIS (FULL SCREEN ADAPTIVE) */

                // Set ukuran canvas sama persis dengan ukuran jendela browser
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                // Tentukan tingkat Zoom (Scale) berdasarkan lebar layar
                // Mobile butuh zoom lebih kecil (objek terlihat lebih besar)
                // Desktop butuh zoom lebih besar (area pandang lebih luas)
                const isMobile = window.innerWidth < 1000;
                const isTablet = window.innerWidth >= 1000 && window.innerWidth < 1300;

                /* UPDATE: ZOOM OUT KAMERA SESUAI REQUEST (AREA PANDANG LEBIH LUAS) */
                // Nilai scale dikecilkan: Semakin kecil nilainya, semakin "Jauh" kameranya (Zoom Out)
                let scale = 2.2; // Desktop (Zoom Out agar lebih luas, sebelumnya 3.0)

                if (isMobile) {
                    /* REVISI: Scale Mobile diperkecil (1.5 -> 1.15) agar area vertikal terlihat lebih banyak */
                    /* Ini mengatasi masalah kasur/lemari terpotong di layar HP yang pendek */
                    scale = 1.35;
                } else if (isTablet) {
                    scale = 1.8; // Tablet (Zoom Out, sebelumnya 2.5)
                }

                // Hitung dimensi logika game berdasarkan ukuran layar & scale
                // Ini membuat game tidak gepeng, tapi menambah/mengurangi area pandang kamera
                GAME_WIDTH = canvas.width / scale;
                GAME_HEIGHT = canvas.height / scale;

                // UPDATE: Mengaktifkan smoothing agar karakter HD terlihat halus (tidak pecah/gerigi)
                // Sebelumnya 'false' (Pixel Art Mode), sekarang 'true' (HD Mode)
                ctx.imageSmoothingEnabled = true;
            }
            window.addEventListener('resize', resize);
            // FIX: Tambahkan Listener Orientasi untuk HP (Fix Gambar Hilang saat Login)
            window.addEventListener('orientationchange', () => {
                setTimeout(resize, 200); // Tunggu rotasi selesai
                setTimeout(resize, 1000); // Cek ulang
            });

            /** ASSETS GENERATION (MAP) */
            const ISLAND_W = 60;
            const ISLAND_H = 40;
            const villageTiles = new Array(ISLAND_W * ISLAND_H).fill(0);

            function fillMap(arr, w, val, x, y, rw, rh) {
                for (let i = 0; i < rh; i++) {
                    for (let j = 0; j < rw; j++) {
                        if (y + i < ISLAND_H && x + j < ISLAND_W) arr[(y + i) * w + (x + j)] = val;
                    }
                }
            }

            // Pulau (Daratan)
            fillMap(villageTiles, ISLAND_W, 1, 5, 5, 50, 30);

            // Decorate with paths (3)
            fillMap(villageTiles, ISLAND_W, 3, 28, 5, 4, 32);
            fillMap(villageTiles, ISLAND_W, 3, 5, 20, 50, 4);

            // --- UPDATE: TILE RERUNTUHAN DIPINDAH KE DEPAN CANDI (KANAN ATAS) ---
            // Hutan (Kiri) - LAMA (DIKOMENTARI/DIHAPUS)
            /*
            for(let i=0; i<4; i++) {
                fillMap(villageTiles, ISLAND_W, 5, 8, 8 + (i*5), 4, 3);
                villageTiles[(8 + (i*5) + 2) * ISLAND_W + 10] = 6; 
            }
            */

            // Area Reruntuhan Baru (Antara Candi dan Dungeon)
            // Lokasi: Sekitar x:46-54, y:11-17
            // UPDATE: Menggunakan ID 7 (Lantai Reruntuhan) bukan 5 (Tanah)
            fillMap(villageTiles, ISLAND_W, 7, 46, 11, 9, 7);

            // Tambahkan Puing-puing Magis (Tile Ungu/Kuno) secara acak di area reruntuhan
            villageTiles[12 * ISLAND_W + 48] = 6;
            villageTiles[14 * ISLAND_W + 52] = 6;
            villageTiles[13 * ISLAND_W + 47] = 6;
            villageTiles[15 * ISLAND_W + 50] = 6;
            villageTiles[12 * ISLAND_W + 53] = 6;

            // Area Akademi (x:38, y:10)
            fillMap(villageTiles, ISLAND_W, 2, 35, 6, 15, 3);
            fillMap(villageTiles, ISLAND_W, 2, 34, 9, 3, 8);
            fillMap(villageTiles, ISLAND_W, 2, 45, 9, 3, 8);
            fillMap(villageTiles, ISLAND_W, 2, 35, 7, 2, 2);
            fillMap(villageTiles, ISLAND_W, 1, 37, 9, 8, 8); // Bersihkan area akademi

            // --- UPDATE: BERSIHKAN AREA BELAKANG KAMPUS UNTUK KAIA (Hapus Pohon) ---
            fillMap(villageTiles, ISLAND_W, 1, 38, 7, 6, 2); // Area X:38-43, Y:7-8 jadi Rumput agar Kaia terlihat

            fillMap(villageTiles, ISLAND_W, 3, 36, 12, 8, 1); // Jalan setapak

            villageTiles[12 * ISLAND_W + 40] = 6;
            fillMap(villageTiles, ISLAND_W, 4, 50, 18, 5, 5);
            villageTiles[20 * ISLAND_W + 52] = 9;

            // Area Guild
            fillMap(villageTiles, ISLAND_W, 1, 40, 24, 10, 10);

            // SPAWN HOUSE DOOR
            villageTiles[10 * ISLAND_W + 18] = 8; // House Door at 18,10

            // --- NEW: LAHAN PERTANIAN DI BELAKANG RUMAH ---
            // Rumah Player ada di x:19, y:7. Kita buat lahan di atasnya (y:3 s/d y:6).
            // Menggunakan Tile ID 5 (Tanah/Earth)
            fillMap(villageTiles, ISLAND_W, 5, 17, 3, 8, 4); // Area Tanah 8x4 petak

            // Buat jalan setapak kecil menuju kebun dari samping rumah
            fillMap(villageTiles, ISLAND_W, 3, 16, 7, 3, 1); // Jalan sambung

            // SAKURA TREES
            const sakuraLocations = [
                { x: 36, y: 13 }, { x: 45, y: 13 }, { x: 13, y: 26 },
                { x: 16, y: 13 }, { x: 40, y: 28 }, { x: 23, y: 18 },
                { x: 24, y: 9 } // NEW: Sebelah Kanan Rumah Player
            ];

            sakuraLocations.forEach(loc => {
                if (loc.x < ISLAND_W && loc.y < ISLAND_H) {
                    villageTiles[loc.y * ISLAND_W + loc.x] = 12; // ID 12 = Sakura Tree
                }
            });

            // ADDED: POHON BESAR MANUAL (Sebelah Kiri Blacksmith)
            villageTiles[29 * ISLAND_W + 31] = 2; // ID 2 = Pohon Besar Biasa
            // ADDED: POHON BESAR MANUAL (Sebelah Kiri Perpustakaan)
            villageTiles[21 * ISLAND_W + 35] = 2;

            const DUNGEON_W = 40;
            const DUNGEON_H = 30;
            // PERBAIKAN: Dungeon Floor Full Lantai, Tembok hanya di pinggir batas map
            const dungeonTiles = Array(DUNGEON_W * DUNGEON_H).fill(4).map((t, i) => {
                const x = i % DUNGEON_W;
                const y = Math.floor(i / DUNGEON_W);
                // Hanya pinggiran map yang jadi tembok pembatas absolut (ID 2)
                if (x === 0 || x === DUNGEON_W - 1 || y === 0 || y === DUNGEON_H - 1) return 2;
                return 4; // Sisanya Full Lantai
            });
            // UPDATE: Menghapus tile ENTER (ID 9) manual di dungeon agar tidak double icon dengan trigger exit
            // dungeonTiles[DUNGEON_W + 2] = 9;  <-- DIHAPUS

            // GENERATE RANDOM ROCKS AS BUILDINGS (OBJECTS)
            // Agar bisa dilewati belakangnya (Z-Index sorting) dan collision di bawah
            const dungeonRocks = [];
            for (let i = 0; i < 40; i++) { // Generate 40 batu acak
                let rx = Math.floor(Math.random() * (DUNGEON_W - 4)) + 2;
                let ry = Math.floor(Math.random() * (DUNGEON_H - 4)) + 2;

                // UPDATE: Jangan spawn batu di area pintu masuk (kiri atas) yang diperluas
                // Agar spawn point player di (5,5) aman dari batu
                if (rx < 8 && ry < 8) continue;

                dungeonRocks.push({
                    id: 'rock_' + i,
                    x: rx,
                    y: ry,
                    w: 1, // Lebar 1 Tile
                    h: 1, // Tinggi 1 Tile
                    type: 'dungeon_rock', // Tipe baru
                    name: 'Batu Besar'
                });
            }

            // HOUSE MAP - DYNAMIC GENERATION HANDLED BY regenerateHouseMap()
            // Initial default map, will be overwritten by regenerateHouseMap()
            const houseTiles = new Array(12 * 10).fill(10);

            // MERCHANT INTERIOR MAP (15x12)
            const MERCH_W = 15;
            const MERCH_H = 12;
            const merchTiles = new Array(MERCH_W * MERCH_H).fill(10); // 10 = Wood
            for (let x = 0; x < MERCH_W; x++) { merchTiles[0 * MERCH_W + x] = 2; merchTiles[(MERCH_H - 1) * MERCH_W + x] = 2; } // Walls
            for (let y = 0; y < MERCH_H; y++) { merchTiles[y * MERCH_W + 0] = 2; merchTiles[y * MERCH_W + (MERCH_W - 1)] = 2; }

            // NEW: LIBRARY INTERIOR MAP (14x12)
            const LIB_W = 14;
            const LIB_H = 12;
            const libTiles = new Array(LIB_W * LIB_H).fill(10); // 10 = Wood Floor
            for (let x = 0; x < LIB_W; x++) { libTiles[0 * LIB_W + x] = 11; libTiles[(LIB_H - 1) * LIB_W + x] = 11; } // Walls (Putih/11)
            for (let y = 0; y < LIB_H; y++) { libTiles[y * LIB_W + 0] = 11; libTiles[y * LIB_W + (LIB_W - 1)] = 11; } // Side Walls
            libTiles[(LIB_H - 1) * LIB_W + 7] = 8; // Door Tile

            // NEW: GUILD INTERIOR MAP (16x14)
            const GUILD_W = 16;
            const GUILD_H = 14;
            const guildTiles = new Array(GUILD_W * GUILD_H).fill(10); // 10 = Wood/Stone Floor
            // Walls (ID 2 untuk dinding batu agar terlihat kokoh)
            for (let x = 0; x < GUILD_W; x++) { guildTiles[0 * GUILD_W + x] = 2; guildTiles[(GUILD_H - 1) * GUILD_W + x] = 2; }
            for (let y = 0; y < GUILD_H; y++) { guildTiles[y * GUILD_W + 0] = 2; guildTiles[y * GUILD_W + (GUILD_W - 1)] = 2; }
            guildTiles[(GUILD_H - 1) * GUILD_W + 8] = 8; // Door Tile

            // NEW: SCHOOL INTERIOR MAP (16x14) - RUANG KELAS
            const SCHOOL_W = 16;
            const SCHOOL_H = 14;
            const schoolTiles = new Array(SCHOOL_W * SCHOOL_H).fill(10); // 10 = Wood Floor
            // Walls (ID 11 = Putih/Tembok Kampus)
            for (let x = 0; x < SCHOOL_W; x++) { schoolTiles[0 * SCHOOL_W + x] = 11; schoolTiles[(SCHOOL_H - 1) * SCHOOL_W + x] = 11; }
            for (let y = 0; y < SCHOOL_H; y++) { schoolTiles[y * SCHOOL_W + 0] = 11; schoolTiles[y * SCHOOL_W + (SCHOOL_W - 1)] = 11; }
            schoolTiles[(SCHOOL_H - 1) * SCHOOL_W + 8] = 8; // Door Tile (Tengah Bawah)

            // --- NEW: CLINIC INTERIOR MAP (14x12) ---
            const CLINIC_W = 14;
            const CLINIC_H = 12;
            const clinicTiles = new Array(CLINIC_W * CLINIC_H).fill(10); // 10 = Floor
            // Walls (ID 11 = Putih/Bersih)
            for (let x = 0; x < CLINIC_W; x++) { clinicTiles[0 * CLINIC_W + x] = 11; clinicTiles[(CLINIC_H - 1) * CLINIC_W + x] = 11; }
            for (let y = 0; y < CLINIC_H; y++) { clinicTiles[y * CLINIC_W + 0] = 11; clinicTiles[y * CLINIC_W + (CLINIC_W - 1)] = 11; }
            clinicTiles[(CLINIC_H - 1) * CLINIC_W + 7] = 8; // Door Tile

            // NEW: BLACKSMITH INTERIOR MAP (14x12)
            const SMITH_W = 14;
            const SMITH_H = 12;
            // UPDATE: Ubah lantai dasar dari 4 (Batu) ke 10 (Kayu/Lantai) agar bisa dicustom
            const smithTiles = new Array(SMITH_W * SMITH_H).fill(10);
            // Walls (ID 2 = Tembok Batu Gelap)
            for (let x = 0; x < SMITH_W; x++) { smithTiles[0 * SMITH_W + x] = 2; smithTiles[(SMITH_H - 1) * SMITH_W + x] = 2; }
            for (let y = 0; y < SMITH_H; y++) { smithTiles[y * SMITH_W + 0] = 2; smithTiles[y * SMITH_W + (SMITH_W - 1)] = 2; }
            smithTiles[(SMITH_H - 1) * SMITH_W + 7] = 8; // Door Tile

            // --- NEW: MENTOR INTERIOR MAP (14x12) ---
            const MENTOR_W = 14;
            const MENTOR_H = 12;
            const mentorTiles = new Array(MENTOR_W * MENTOR_H).fill(10); // 10 = Wood Floor
            // Walls (UPDATE: ID 13 untuk Atas/Bawah, ID 11 untuk Samping - Samakan dengan Rumah Player)
            for (let x = 0; x < MENTOR_W; x++) { mentorTiles[0 * MENTOR_W + x] = 13; mentorTiles[(MENTOR_H - 1) * MENTOR_W + x] = 13; }
            for (let y = 0; y < MENTOR_H; y++) { mentorTiles[y * MENTOR_W + 0] = 11; mentorTiles[y * MENTOR_W + (MENTOR_W - 1)] = 11; }
            mentorTiles[(MENTOR_H - 1) * MENTOR_W + 7] = 8; // Door Tile

            // --- NEW: WEDDING INTERIOR MAP (14x14) ---
            const WEDDING_W = 14;
            const WEDDING_H = 14;
            const weddingTiles = new Array(WEDDING_W * WEDDING_H).fill(10); // 10 = Floor
            // Walls (ID 11 = Putih/Bersih/Suci)
            for (let x = 0; x < WEDDING_W; x++) { weddingTiles[0 * WEDDING_W + x] = 11; weddingTiles[(WEDDING_H - 1) * WEDDING_W + x] = 11; }
            for (let y = 0; y < WEDDING_H; y++) { weddingTiles[y * WEDDING_W + 0] = 11; weddingTiles[y * WEDDING_W + (WEDDING_W - 1)] = 11; }
            weddingTiles[(WEDDING_H - 1) * WEDDING_W + 7] = 8; // Door Tile

            // --- NEW: AYU'S HOUSE INTERIOR (14x12) ---
            const LOVER1_W = 14;
            const LOVER1_H = 12;
            const lover1Tiles = new Array(LOVER1_W * LOVER1_H).fill(10); // 10 = Wood Floor
            // Walls (ID 11 = Tembok Putih/Bersih)
            for (let x = 0; x < LOVER1_W; x++) { lover1Tiles[0 * LOVER1_W + x] = 11; lover1Tiles[(LOVER1_H - 1) * LOVER1_W + x] = 11; }
            for (let y = 0; y < LOVER1_H; y++) { lover1Tiles[y * LOVER1_W + 0] = 11; lover1Tiles[y * LOVER1_W + (LOVER1_W - 1)] = 11; }
            lover1Tiles[(LOVER1_H - 1) * LOVER1_W + 7] = 8; // Door Tile

            // --- NEW: PLAYER SHOP INTERIOR (14x12) FOR ENTREPRENEUR ---
            const PSHOP_W = 14;
            const PSHOP_H = 12;
            const pShopTiles = new Array(PSHOP_W * PSHOP_H).fill(10); // 10 = Wood Floor
            // Walls (ID 11 = Tembok Samping, ID 13 = Tembok Atas/Bawah - Sama seperti Rumah Default)
            // UPDATE: Menggunakan ID 13 untuk tembok atas/bawah agar sama dengan rumah player
            for (let x = 0; x < PSHOP_W; x++) { pShopTiles[0 * PSHOP_W + x] = 13; pShopTiles[(PSHOP_H - 1) * PSHOP_W + x] = 13; }
            for (let y = 0; y < PSHOP_H; y++) { pShopTiles[y * PSHOP_W + 0] = 11; pShopTiles[y * PSHOP_W + (PSHOP_W - 1)] = 11; }
            pShopTiles[(PSHOP_H - 1) * PSHOP_W + 7] = 8; // Door Tile

            // --- NEW: FISHERMAN HOUSE INTERIOR (12x10) ---
            const FISH_W = 12;
            const FISH_H = 10;
            const fishTiles = new Array(FISH_W * FISH_H).fill(10); // 10 = Wood Floor
            // Walls (ID 11 = Tembok)
            for (let x = 0; x < FISH_W; x++) { fishTiles[0 * FISH_W + x] = 11; fishTiles[(FISH_H - 1) * FISH_W + x] = 11; }
            for (let y = 0; y < FISH_H; y++) { fishTiles[y * FISH_W + 0] = 11; fishTiles[y * FISH_W + (FISH_W - 1)] = 11; }
            fishTiles[(FISH_H - 1) * FISH_W + 6] = 8; // Door Tile

            // --- NEW: CANDI INTERIOR MAP (16x16) ---
            const CANDI_W = 16;
            const CANDI_H = 16;
            const candiTiles = new Array(CANDI_W * CANDI_H).fill(4); // 4 = Stone Floor (Dungeon style)

            // Walls (ID 2 = Stone Wall)
            for (let x = 0; x < CANDI_W; x++) { candiTiles[0 * CANDI_W + x] = 2; candiTiles[(CANDI_H - 1) * CANDI_W + x] = 2; }
            for (let y = 0; y < CANDI_H; y++) { candiTiles[y * CANDI_W + 0] = 2; candiTiles[y * CANDI_W + (CANDI_W - 1)] = 2; }

            // Pathway / Karpet Merah/Ungu (Magic Floor ID 6) leading to Altar
            for (let y = 3; y < CANDI_H - 1; y++) {
                candiTiles[y * CANDI_W + 7] = 6;
                candiTiles[y * CANDI_W + 8] = 6; // UPDATE: Dikembalikan jadi 2 kolom (Lebih Lebar)
            }
            // Door Tile (Tengah Bawah) - Disesuaikan agar simetris dengan karpet
            candiTiles[(CANDI_H - 1) * CANDI_W + 7] = 8;
            candiTiles[(CANDI_H - 1) * CANDI_W + 8] = 8;

            // --- UPDATE: MAP RERUNTUHAN YANG LEBIH DETAIL ---
            const RUINS_W = 22;
            const RUINS_H = 16;
            // Campuran Tanah (5) dan Lantai Batu Dungeon (4) untuk kesan reruntuhan
            // UPDATE: Base tile menggunakan ID 7 (Lantai Reruntuhan)
            const ruinsTiles = new Array(RUINS_W * RUINS_H).fill(7);

            // Buat pola reruntuhan (Lantai batu pecah-pecah di tengah)
            for (let y = 2; y < RUINS_H - 2; y++) {
                for (let x = 2; x < RUINS_W - 2; x++) {
                    // 70% kemungkinan jadi lantai batu kuno, sisanya tanah/rumput
                    if (Math.random() > 0.3) ruinsTiles[y * RUINS_W + x] = 4; // 4 = Stone
                }
            }

            // Tambahkan Tembok Pembatas Hutan (ID 2)
            for (let x = 0; x < RUINS_W; x++) { ruinsTiles[0 * RUINS_W + x] = 2; ruinsTiles[(RUINS_H - 1) * RUINS_W + x] = 2; }
            for (let y = 0; y < RUINS_H; y++) { ruinsTiles[y * RUINS_W + 0] = 2; ruinsTiles[y * RUINS_W + (RUINS_W - 1)] = 2; }

            // ══════════════════════════════════════════════════════════════════
            // 🧚‍♀️ KAHYANGAN WILIS — DUNIA WIDADARI TERSEMBUNYI (Lereng Gunung Wilis)
            // Akses: Keris Penjaga + Rafflesia mekar + Ethics ≥ 60
            // ══════════════════════════════════════════════════════════════════
            const SYLVARIA_W = 32;
            const SYLVARIA_H = 24;

            // Tile ID Legend: 0=void, 2=wall/pohon, 4=lantai batu, 5=rumput, 6=magic floor, 9=pintu
            // Kita gunakan: 5=rumput (hijau cerah), 6=magic crystal floor, 2=pohon/tembok, 4=path
            const sylvariaTiles = (() => {
                const arr = new Array(SYLVARIA_W * SYLVARIA_H);
                for (let i = 0; i < arr.length; i++) arr[i] = 5; // Default semua rumput

                const set = (x, y, v) => { if (x >= 0 && x < SYLVARIA_W && y >= 0 && y < SYLVARIA_H) arr[y * SYLVARIA_W + x] = v; };

                // Border pohon-pohon bercahaya
                for (let x = 0; x < SYLVARIA_W; x++) { set(x, 0, 2); set(x, SYLVARIA_H-1, 2); }
                for (let y = 0; y < SYLVARIA_H; y++) { set(0, y, 2); set(SYLVARIA_W-1, y, 2); }

                // Path utama dari bawah (pintu masuk) ke atas (altar peri agung)
                for (let y = 4; y < SYLVARIA_H - 2; y++) {
                    set(15, y, 4); set(16, y, 4); // Path tengah 2 tile lebar
                }

                // Plaza Tengah (Altar Peri Agung) — magic crystal floor
                for (let y = 4; y <= 9; y++) {
                    for (let x = 10; x <= 21; x++) set(x, y, 6);
                }

                // Kolam kristal kiri
                for (let y = 12; y <= 16; y++) for (let x = 4; x <= 8; x++) set(x, y, 6);
                // Kolam kristal kanan
                for (let y = 12; y <= 16; y++) for (let x = 23; x <= 27; x++) set(x, y, 6);

                // Pohon-pohon di dalam map (scattered)
                const treePosArr = [
                    [3,3],[5,3],[28,3],[30,3],[3,10],[5,10],[28,10],[30,10],
                    [3,18],[5,18],[28,18],[30,18],[9,6],[22,6],[9,14],[22,14],
                    [3,6],[30,6],[3,14],[30,14]
                ];
                treePosArr.forEach(([x,y]) => set(x, y, 2));

                // Pintu masuk/keluar di bawah
                set(15, SYLVARIA_H-2, 9); set(16, SYLVARIA_H-2, 9);

                return arr;
            })();

            const ruinsObstacles = [];
            // Tambahkan Pilar/Batu Reruntuhan Acak sebagai Obstacle
            for (let i = 0; i < 10; i++) {
                ruinsObstacles.push({
                    id: `ruin_rock_${i}`,
                    x: Math.floor(Math.random() * (RUINS_W - 4)) + 2,
                    y: Math.floor(Math.random() * (RUINS_H - 6)) + 2, // Hindari area bawah (pintu)
                    w: 1, h: 1,
                    type: 'dungeon_rock', // Menggunakan visual batu
                    name: 'Puing Kuno'
                });
            }

            const maps = {
                'village': {
                    w: ISLAND_W, h: ISLAND_H,
                    tiles: villageTiles,
                    buildings: [
                        /* UPDATE: TITIK ENTRANCE DINAIKKAN (Y-1) AGAR MENEMPEL DI PINTU BANGUNAN (VISUAL LEBIH RAPI) */
                        /* Radius deteksi teleport diperbesar agar pemain bisa masuk saat menyentuh tembok */

                        { id: 'player_house', x: 19, y: 7, w: 4, h: 4, type: 'house_player', entrance: { x: 21, y: 10, map: 'house' }, open24h: true },

                        /* UPDATE: PAPAN MISI JUGA DINAIKKAN */
                        {
                            id: 'papan_misi',
                            x: 12,
                            y: 6,
                            w: 6,
                            h: 5,
                            /* REVERT: Kembalikan ke gambar asli Papan Desa */
                            img: 'images/papandesa.png',
                            entrance: { x: 15, y: 10 },
                            name: "Papan Desa",
                            open24h: true
                        },

                        /* UPDATE: STATUE */
                        {
                            id: 'statue_rank',
                            x: 22,
                            y: 28,
                            w: 6,
                            h: 5,
                            img: 'images/statue.png',
                            entrance: { x: 25, y: 32 },
                            name: "Patung Peringkat",
                            open24h: true
                        },

                        /* UPDATE: SEMUA BANGUNAN LAINNYA (Y Pintu dikurangi 1) */
                        { id: 'school', x: 38, y: 10, w: 6, h: 5, img: 'images/kampus.png', entrance: { x: 41, y: 14, map: 'school_interior' }, name: "Kampus", roleSpecific: 'student', openTime: 700, closeTime: 1800 },
                        { id: 'merchant', x: 26, y: 22, w: 6, h: 5, img: 'images/rumahmerchant.png', entrance: { x: 29, y: 26, map: 'merchant_interior' }, name: "Merchant", openTime: 600, closeTime: 2000 },
                        { id: 'mentor', x: 28, y: 15, w: 6, h: 5, img: 'images/rumahmentor.png', entrance: { x: 31, y: 19, map: 'mentor_interior' }, name: "Rumah Mentor", openTime: 800, closeTime: 2200 },
                        /* NEW: WARNET (BARAT/KIRI KLINIK) */
                        {
                            id: 'warnet',
                            x: 12,
                            y: 16,
                            w: 5,
                            h: 4,
                            img: 'images/warnet.png',
                            entrance: { x: 14, y: 19, map: 'warnet_interior' }, // <--- UPDATE INI 
                            name: "Warnet Desa",
                            openTime: 800,
                            closeTime: 2400
                        },
                        /* REVISI: HAPUS roleSpecific: 'worker' DARI BLACKSMITH AGAR BUKA UNTUK UMUM */
                        /* UPDATE: Jam Tutup diperpanjang sampai 21:00 (Jam 9 Malam) */
                        { id: 'blacksmith', x: 34, y: 27, w: 6, h: 5, img: 'images/rumahblacksmith.png', entrance: { x: 37, y: 31, map: 'blacksmith_interior' }, name: "Blacksmith", openTime: 800, closeTime: 2100 },

                        /* UPDATE: MENGUBAH RUMAH LOVE MENJADI RUMAH AYU */
                        { id: 'lover1_home', x: 14, y: 25, w: 6, h: 5, img: 'images/rumahlove.png', entrance: { x: 17, y: 29, map: 'lover1_interior' }, name: "Rumah Ayu", openTime: 700, closeTime: 2100 },

                        /* MOVED: PERPUSTAKAAN SHIFTED LEFT (Avoiding Dungeon) */
                        /* FIX: Jam Buka Diperbaiki menjadi 2000 (8 Malam) */
                        { id: 'library', x: 38, y: 18, w: 6, h: 5, img: 'images/perpustakaan.png', entrance: { x: 41, y: 22, map: 'library_interior' }, name: "Perpustakaan", openTime: 800, closeTime: 2000 },

                        { id: 'dungeon_gate', x: 48, y: 15, w: 6, h: 6, img: 'images/dungeon.png', entrance: { x: 51, y: 20, map: 'dungeon' }, name: "Dungeon Entrance", open24h: true },
                        { id: 'guild', x: 42, y: 25, w: 7, h: 6, img: 'images/gedungpetualang.png', entrance: { x: 45, y: 30, map: 'guild_interior' }, name: "Gedung Petualang", open24h: true },
                        { id: 'clinic', x: 18, y: 14, w: 5, h: 5, img: 'images/balaipengobatan.png', entrance: { x: 20, y: 18, map: 'clinic_interior' }, name: "Balai Pengobatan", open24h: true },

                        /* UPDATE: WEDDING HALL */
                        /* UPDATE JAM BUKA: DIUBAH JADI 06:00 PAGI */
                        { id: 'wedding', x: 20, y: 22, w: 6, h: 5, img: 'images/balaipernikahan.png', entrance: { x: 23, y: 26, map: 'wedding_interior' }, name: "Balai Pernikahan", roleSpecific: 'family', openTime: 600, closeTime: 1600 },

                        /* UPDATE: PELABUHAN TIDAK DIUBAH KARENA PLAYER BISA JALAN DI ATASNYA */
                        { id: 'port', x: 43, y: 34, w: 7, h: 5, img: 'images/pelabuhan.png', entrance: { x: 46, y: 37, map: 'fishing_action' }, name: "Dermaga Mancing", open24h: true },

                        /* NEW: RUMAH TETANGGA (NELAYAN) - DIAKTIFKAN KEMBALI */
                        /* Posisi: Sebelah kanan rumah player (x:26) */
                        { id: 'fisherman_home', x: 26, y: 7, w: 4, h: 4, img: 'images/rumahwarga.png', entrance: { x: 28, y: 10, map: 'fisherman_interior' }, name: "Rumah Nelayan", openTime: 600, closeTime: 2100 },

                        /* NEW: CANDI KUNO (TAMBAHAN) */
                        /* Posisi: Pojok Kanan Atas (Di atas Dungeon) */
                        {
                            id: 'candi',
                            x: 48,
                            y: 6,
                            w: 6,
                            h: 5,
                            img: 'images/candi.png',
                            entrance: { x: 51, y: 10, map: 'candi_interior' }, // LINK KE INTERIOR BARU
                            name: "Candi Kuno",
                            open24h: true
                        }
                    ],
                    npcs: [
                        /* UPDATE: MENTOR BUDI DIHAPUS DARI LUAR RUMAH (DEFAULT HIDDEN) */
                        /* Kita taruh di koordinat -99 agar tidak terlihat, tapi objeknya ADA untuk dipanggil saat Tutorial */
                        { id: 'mentor', x: -99, y: -99, name: 'Mentor Budi', imgSrc: 'images/mentor.png', type: 'static', schedule: 'always', w: 40, h: 60 },

                        /* UPDATE: DOSEN DIHAPUS DARI LUAR, DIGANTI SARJANA TEKNOLOGI */
                        { id: 'sarjana_tekno', x: 43, y: 16, name: 'Mas Dimas (Teknologi)', imgSrc: 'images/sarjanateknologi.png', type: 'service', schedule: 'day', w: 40, h: 60 },

                        /* NEW: SARJANA SEJARAH (PINDAH KE AREA CANDI) */
                        /* UPDATE: Posisi dipindah ke x:46, y:9 (Sebelah Kiri Candi Kuno) */
                        { id: 'sarjana_sejarah', x: 46, y: 9, name: 'Bu Wulan (Sejarah)', imgSrc: 'images/sarjanasejarah.png', type: 'wander', vx: 0, vy: 0, schedule: 'day', w: 40, h: 60 },

                        /* NEW: SATPAM KAMPUS (Penjaga Gerbang) */
                        /* UPDATE: POSISI DIGESER KE KIRI (38, 16) AGAR TIDAK MENGHALANGI JALAN */
                        /* UPDATE: JADWAL JADI 'ALWAYS' (24 JAM) AGAR BISA NGOBROL MALAM */
                        { id: 'satpam', x: 38, y: 16, name: 'Pak Darmo (Satpam)', imgSrc: 'images/satpam.png', type: 'static', schedule: 'always', w: 40, h: 60 },

                        /* REMOVED: job/mercenary npc */
                        /* MOVED: Trader menggantikan posisi job (x:25, y:27) */
                        /* UPDATE: DIGESER KE BAWAH DAN KANAN (x:31, y:29) AGAR TIDAK MENGHALANGI PINTU MERCHANT */
                        { id: 'trader_outside', x: 31, y: 29, name: 'Bu Lastri (Pedagang Keliling)', imgSrc: 'images/merchant.png', type: 'service', schedule: 'day', w: 40, h: 60 },

                        /* UPDATE: KEPALA BENGKEL PINDAH KE DALAM, DIGANTI ANAKNYA DI LUAR */
                        /* UPDATE: Ukuran Lina disamakan dengan Player (w:40, h:60) */
                        { id: 'child_blacksmith', x: 35, y: 32, name: 'Lina (Anak Besi)', imgSrc: 'images/anakblacksmith.png', type: 'static', vx: 0, vy: 0, schedule: 'day', w: 40, h: 60 },

                        { id: 'lover1girl', x: 14, y: 29, name: 'Ayu (Gadis Desa)', imgSrc: 'images/lover1girl.png', type: 'lover', schedule: 'day', w: 40, h: 60 },
                        /* REMOVED: Satria (Ksatria) dihapus dari luar, dipindah ke dalam Guild */
                        /* UPDATE: PUTRI DIUBAH JADI 'STATIC' AGAR TIDAK FLOATING SESUAI REQUEST */
                        /* UPDATE TERBARU: POSISI DINAIKKAN KE Y:12 AGAR TIDAK TERTUTUP ATAP RUMAH MENTOR */
                        /* REVISI JADWAL PUTRI: SORE (AFTERNOON) DI LUAR, PAGI DI KAMPUS */
                        { id: 'lover2girl', x: 32, y: 12, name: 'Putri (Scholar)', imgSrc: 'images/lover2girl.png', type: 'static', schedule: 'afternoon', w: 40, h: 60 },

                        /* MOVED: CINTA MATRE PINDAH KE INTERIOR (GUILD & PERPUS) */

                        /* DIKEMBALIKAN: Peer 1 (Siswa Laki-laki) */
                        { id: 'peer1', x: 12, y: 12, name: 'Raka - Teman Sekelas', imgSrc: 'images/peer1.png', type: 'wander', vx: 0, vy: 0, schedule: 'day', w: 40, h: 60 },

                        /* DIHAPUS: Tetangga A (Peer 1) yang tinggal di rumah kiri */
                        { id: 'peer2', x: 28, y: 11, name: 'Dewi (Tetangga)', imgSrc: 'images/peer2.png', type: 'wander', vx: 0, vy: 0, schedule: 'day', w: 40, h: 60 },
                        { id: 'peer3', x: 35, y: 30, name: 'Pak Slamet (Petani)', imgSrc: 'images/peer3.png', type: 'wander', vx: 0, vy: 0, schedule: 'day', w: 40, h: 60 },

                        /* UPDATE: POSISI NPC DI DERMAGA MENGIKUTI PERUBAHAN BANGUNAN */
                        { id: 'nelayan', x: 44, y: 36, name: 'Pak Suryo (Nelayan)', imgSrc: 'images/nelayan.png', type: 'wander', vx: 0, vy: 0, schedule: 'day', w: 40, h: 60 },

                        /* MOVED: Bu Nelayan dipindah ke dalam rumahnya (fisherman_interior) */
                        /* {id: 'istrinelayan', x: 43, y: 35, name: 'Bu Tini (Istri Nelayan)', ... }  <-- DIHAPUS DARI LUAR */

                        /* NEW: NPC KERUKUNAN (Dipindah ke Area Lapang Kiri & Jadwal DAY) */
                        /* UPDATE: Tipe diubah jadi 'static' agar diam di tempat & Posisi didekatkan (x:10 & x:11) */
                        /* UPDATE: DIGESER SEDIKIT KE BAWAH (Y:19) KARENA PAPAN TURUN KE Y:7 */
                        { id: 'cewek_islam', x: 10, y: 19, name: 'Aisyah', imgSrc: 'images/cewek-islam.png', type: 'static', vx: 0, vy: 0, schedule: 'day', w: 40, h: 60 },
                        { id: 'cewek_kristen', x: 11, y: 19, name: 'Maria', imgSrc: 'images/cewek-kristen.png', type: 'static', vx: 0, vy: 0, schedule: 'day', w: 40, h: 60 },

                        /* NEW: PEMANCING SORE-MALAM (Update Posisi ke Ujung Dermaga Baru) */
                        /* UPDATE: DIGESER KE BAWAH (Y:38) AGAR LEBIH DI PUCUK */
                        /* UPDATE: UKURAN DIUBAH SESUAI REQUEST (SAMA DENGAN PLAYER 40x60) */
                        /* UPDATE TERBARU: POSISI DIGESER TURUN KE Y:37 SESUAI REQUEST */
                        { id: 'pemancing_misterius', x: 47, y: 37, name: 'Mbah Karto (Pemancing Senja)', imgSrc: 'images/pemancing.png', type: 'service', schedule: 'evening', w: 40, h: 60 },

                        /* NEW: PUTRI DUYUNG (Pinggir Laut - Selatan Kiri Dermaga) */
                        /* UPDATE: Posisi dipindah ke sebelah kiri dermaga (x:38) di air (y:36) */
                        { id: 'putriduyung', x: 38, y: 36, name: 'Putri Duyung', imgSrc: 'images/putriduyung.png', type: 'service', schedule: 'night', w: 40, h: 60 },

                        /* UPDATE: SENIMAN (Dipindah ke bawah Papan Misi - Area Santai) */
                        { id: 'seniman', x: 12, y: 14, name: 'Aryo - Seniman', imgSrc: 'images/seniman.png', type: 'static', schedule: 'day', w: 40, h: 60 },

                        /* UPDATE: PENYANYI (Dipindah ke sebelah Seniman di bawah Papan) */
                        { id: 'penyanyi', x: 13, y: 14, name: 'Nadia - Penyanyi', imgSrc: 'images/penyanyi.png', type: 'static', schedule: 'day', w: 40, h: 60 },

                        /* NEW: PERENANG DI LAUT (Swimmers) */
                        { id: 'swimmer_boy', x: 3, y: 20, name: 'Agus (Perenang)', imgSrc: 'images/pantai-boy.png', type: 'swimmer', vx: 0.5, vy: 0.5, schedule: 'day', w: 40, h: 60 },
                        { id: 'swimmer_girl', x: 50, y: 36, name: 'Dewi (Perenang)', imgSrc: 'images/pantai-girl.png', type: 'swimmer', vx: -0.5, vy: 0, schedule: 'day', w: 40, h: 60 },

                        /* NEW: DEWI ARSA (EVENT RAHASIA BULAN PURNAMA) */
                        /* Muncul di samping Patung Peringkat (Statue ada di x:22, w:6 -> Berakhir di x:28) */
                        /* Kita taruh di x:29 agar di sebelah kanan patung */
                        { id: 'dewi_arsa', x: 29, y: 30, name: 'Dewi Arsa', imgSrc: 'images/dewiarsa.png', type: 'static', schedule: 'custom_fullmoon', w: 40, h: 60 },

                        /* NEW: KURCACI TANI (EVENT PANEN RAYA - MUSIM PANAS) */
                        /* Muncul di hutan belakang sekolah (x:38, y:6) */
                        { id: 'kurcaci_tani', x: 38, y: 6, name: 'Gorki (Kurcaci Tani)', imgSrc: 'images/kurcacitani.png', type: 'static', schedule: 'custom_harvest_festival', w: 32, h: 32 },

                        /* NEW: PERI PANEN (EVENT PESTA ANGGUR - MUSIM GUGUR HARI 15) */
                        /* FIX: Dipindah ke x:40 agar tidak tumpuk dengan Kurcaci Tani */
                        { id: 'peripanen', x: 40, y: 6, name: 'Ratih (Peri Panen)', imgSrc: 'images/peripanen.png', type: 'static', schedule: 'custom_grape_harvest', w: 32, h: 32 },

                        /* === FARM HELPERS: Muncul di ladang SETELAH di-hire, setiap hari ===
                           Koordinat di area ladang (beda dari event NPC di atas) */
                        { id: 'kurcaci_farm', x: 30, y: 7, name: 'Gorki (Kurcaci Tani)', imgSrc: 'images/kurcacitani.png', type: 'static', schedule: 'if_hired_dwarf', w: 28, h: 28 },
                        { id: 'peri_farm',    x: 32, y: 7, name: 'Ratih (Peri Panen)',  imgSrc: 'images/peripanen.png',  type: 'static', schedule: 'if_hired_fairy',  w: 28, h: 28 },

                        /* NEW: NPC ANAK-ANAK (BERMAIN DI DEKAT KAMPUS) */
                        /* UPDATE: Bocah Nakal dipindah ke Dermaga (Bawah Laut Pinggir) */
                        /* Koordinat Dermaga sekitar x:43-50, y:34-39 */
                        { id: 'child_boy_1', x: 46, y: 37, name: 'Bimo (Bocah Nakal)', imgSrc: 'images/anakkecil1.png', type: 'wander', vx: 0, vy: 0, schedule: 'day', w: 32, h: 48 },

                        /* UPDATE: Gadis Kecil dipindah ke Halaman Rumah Mentor (Area Kosong) */
                        /* Koordinat x:30, y:18 (Dekat pintu masuk Rumah Mentor) */
                        { id: 'child_girl_1', x: 30, y: 18, name: 'Rini (Gadis Kecil)', imgSrc: 'images/anakkecil2.png', type: 'wander', vx: 0, vy: 0, schedule: 'day', w: 32, h: 48 },

                        /* NEW: KAIA (SENIOR PSIKOLOGI - GUIDE ADAPTASI) */
                        /* UPDATE: Dipindah ke PAS BELAKANG KAMPUS (Area Rumput Baru) */
                        /* Koordinat x:41, y:8 (Tepat di belakang tengah gedung, tidak ketutup pohon) */
                        { id: 'senior_kaia', x: 41, y: 8, name: 'Kaia (Senior)', imgSrc: 'images/kaia.png', type: 'wander', schedule: 'always', w: 40, h: 60 },

                        /* --- RIVAL CINTA (GENDER SPECIFIC & MOVING) --- */

                        /* RIVAL COWOK (Muncul jika Player Laki-laki) - Nama: Doni */
                        /* UPDATE: RIVAL DIPERBESAR (w:40, h:60) setara Player */
                        { id: 'fake_boy', x: 15, y: 30, name: 'Doni', imgSrc: 'images/rival_boy.png', type: 'wander', schedule: 'morning', genderReq: 'boy', w: 40, h: 60 },
                        { id: 'fake_boy', x: 31, y: 15, name: 'Doni', imgSrc: 'images/rival_boy.png', type: 'wander', schedule: 'afternoon', genderReq: 'boy', w: 40, h: 60 },

                        /* RIVAL CEWEK (Muncul jika Player Perempuan) - Nama: Bella */
                        /* UPDATE: RIVAL DIPERBESAR (w:40, h:60) setara Player */
                        { id: 'fake_girl', x: 19, y: 16, name: 'Bella', imgSrc: 'images/rival_girl.png', type: 'wander', schedule: 'morning', genderReq: 'girl', w: 40, h: 60 },
                        { id: 'fake_girl', x: 40, y: 31, name: 'Bella', imgSrc: 'images/rival_girl.png', type: 'wander', schedule: 'afternoon', genderReq: 'girl', w: 40, h: 60 },

                        /* NEW: KI LAMONG — PENUTUR CERITA RAKYAT LAMONGAN */
                        /* Duduk di bawah pohon dekat Candi Kuno (area historis, x:48, y:8) */
                        /* Jadwal 'always' agar bisa ditemui kapan saja */
                        { id: 'ki_lamong', x: 48, y: 8, name: 'Ki Lamong (Penutur Cerita)', imgSrc: 'images/peer3.png', type: 'static', schedule: 'always', w: 40, h: 60 },

                        /* NEW: MONSTER PENCURI SKRIPSI (Hanya muncul saat Quest Aktif) */
                        /* Lokasi: Depan Candi Kuno (Timur Laut Peta) - UPDATE: DIPINDAHKAN DARI HUTAN */
                        { id: 'monster_skripsi', x: 50, y: 13, name: 'Pencuri Naskah', imgSrc: 'images/monster-thief.png', type: 'static', schedule: 'always', questReq: 'find_draft', w: 45, h: 45 },

                        /* MOVED: Penjaga Dungeon dipindah agak ke depan (y:21) agar sejajar entrance */
                        { id: 'penjagadungeon', x: 46, y: 21, name: 'Siap (Penjaga Dungeon)', imgSrc: 'images/penjagadungeon.png', type: 'service', schedule: 'always', w: 40, h: 60 },

                        /* UPDATE: AYAM DIKECILKAN (20x20) */
                        { id: 'ayam1', x: 15, y: 15, name: 'Jago (Ayam Jantan)', imgSrc: 'images/ayam.png', type: 'animal', sound: 'ayam', vx: 0, vy: 0, cooldown: 0, loveTimer: 0, schedule: 'day', w: 20, h: 20 },
                        { id: 'ayam2', x: 20, y: 18, name: 'Betina (Ayam)', imgSrc: 'images/ayam.png', type: 'animal', sound: 'ayam', vx: 0, vy: 0, cooldown: 0, loveTimer: 0, schedule: 'day', w: 20, h: 20 },

                        { id: 'kambing1', x: 8, y: 20, name: 'Embek (Kambing)', imgSrc: 'images/kambing.png', type: 'animal', sound: 'kambing', vx: 0, vy: 0, cooldown: 0, loveTimer: 0, schedule: 'day', w: 32, h: 32 },
                        { id: 'kambing2', x: 10, y: 22, name: 'Cempe (Kambing)', imgSrc: 'images/kambing.png', type: 'animal', sound: 'kambing', vx: 0, vy: 0, cooldown: 0, loveTimer: 0, schedule: 'day', w: 32, h: 32 },

                        /* UPDATE: SAPI & KUDA DIPERBESAR (50x40) */
                        { id: 'sapi1', x: 45, y: 30, name: 'Moo (Sapi Betina)', imgSrc: 'images/sapi.png', type: 'animal', sound: 'sapi', vx: 0, vy: 0, cooldown: 0, loveTimer: 0, schedule: 'day', w: 50, h: 40 },
                        { id: 'kuda1', x: 40, y: 15, name: 'Jaran (Kuda Coklat)', imgSrc: 'images/kuda.png', type: 'animal', sound: 'kuda', vx: 0, vy: 0, cooldown: 0, loveTimer: 0, schedule: 'day', w: 50, h: 40 }
                    ],
                    objects: [
                        /* UPDATE: Papan Misi & Statue dipindah ke buildings */

                        /* NEW: DEKORASI LAHAN PERTANIAN (BELAKANG RUMAH) */
                        // UPDATE: Papan Tanda digeser ke kanan dan atas (x:26, y:5) agar tidak tertutup pohon
                        // UPDATE: Menggunakan gambar khusus 'papantani.png'
                        // UPDATE: Diperbesar jadi 2x2
                        { x: 27, y: 5, w: 2, h: 2, type: 'sign', icon: '🌾', text: "Lahan ini terbengkalai. Kamu harus mempekerjakan Kurcaci Tani dan Peri Panen untuk membersihkan lahan ini dan mulai bertani.", img: 'images/papantani.png' },
                        // UPDATE: Orang-orangan Sawah dipindah keluar petak (x:15, y:6) agar tidak menutupi tanaman
                        { x: 15, y: 6, w: 2, h: 2, type: 'sign', icon: '🎃', text: "Orang-orangan Sawah: Menjaga tanaman dari burung.", img: 'images/orangsawah.png' },
                        // Petak air kecil untuk menyiram (Tile ID 0 manual atau objek sumur)
                        // UPDATE: Posisi Sumur dipindah ke kiri (x:23, y:6) menggantikan posisi kosong dekat rumah
                        // UPDATE: Sumur diperbesar jadi 2x2
                        { x: 23, y: 8, w: 2, h: 2, type: 'sign', icon: '💧', text: "Sumur Tua: Sumber air untuk menyiram tanaman.", img: 'images/sumur.png' },
                        // --- FIX: MENGEMBALIKAN KOTAK POS YANG HILANG ---
                        // Posisi: Sebelah kanan pintu rumah (x:23, y:10)
                        { x: 23, y: 10, w: 1, h: 1, type: 'mailbox', icon: '📬', img: 'images/pos.png' },



                        // --- [BARU] BONEKA SALJU (HANYA MUNCUL SAAT WINTER) ---
                        // Posisi: Dekat Rumah Player (x:22, y:9)
                        {
                            x: 22, y: 9,
                            w: 1, h: 2,
                            type: 'snowman', // Tipe baru
                            icon: '⛄',
                            name: 'Boneka Salju',
                            img: 'images/snowman.png',
                            seasonReq: 'winter' // SYARAT WAJIB: Hanya muncul saat Winter
                        },
                        // Posisi: Dekat Patung Tengah (x:20, y:28)
                        {
                            x: 20, y: 28,
                            w: 1, h: 2,
                            type: 'snowman',
                            icon: '⛄',
                            name: 'Boneka Salju',
                            img: 'images/snowman.png',
                            seasonReq: 'winter'
                        },
                        // --- NEW: KEBUN BUNGA AYU (DI PINGGIR RUMAH AYU) ---
                        // Posisi Rumah Ayu: x:14, y:25. Kebun ditaruh di kirinya.
                        // UPDATE: Geser ke bawah sedikit (y:27) agar pas dan belakangnya bisa dilewati
                        { x: 10, y: 27, w: 4, h: 3, type: 'sign', icon: '🌻', text: "Kebun Bunga Ayu: Harum semerbak bunga melati dan mawar.", img: 'images/kebunayu.png' },

                        // Meja & Kursi Santai (DIPINDAH KE KANAN & KIRI POHON SAKURA di 16,13)
                        // UPDATE: Ukuran diperbesar (w:2, h:2) setara setengah bangunan
                        { x: 13, y: 13, w: 2, h: 2, type: 'table', icon: '🪑', img: 'images/kursi.png' }, // Kiri Pohon
                        { x: 17, y: 13, w: 2, h: 2, type: 'table', icon: '🪑', img: 'images/kursi.png' }, // Kanan Pohon

                        // --- NEW: BUNGA LIAR (ITEM PICKUP) ---
                        // Tersebar di beberapa titik desa
                        { x: 8, y: 22, w: 1, h: 1, type: 'wild_flower', icon: '🌸', img: 'images/bunga.png', name: 'Bunga Liar' },
                        { x: 15, y: 18, w: 1, h: 1, type: 'wild_flower', icon: '🌸', img: 'images/bunga.png', name: 'Bunga Liar' },
                        { x: 45, y: 10, w: 1, h: 1, type: 'wild_flower', icon: '🌸', img: 'images/bunga.png', name: 'Bunga Liar' },
                        { x: 35, y: 35, w: 1, h: 1, type: 'wild_flower', icon: '🌸', img: 'images/bunga.png', name: 'Bunga Liar' },
                        { x: 5, y: 25, w: 1, h: 1, type: 'wild_flower', icon: '🌸', img: 'images/bunga.png', name: 'Bunga Liar' },
                        { x: 52, y: 30, w: 1, h: 1, type: 'wild_flower', icon: '🌸', img: 'images/bunga.png', name: 'Bunga Liar' }
                    ]
                },
                /* NEW: MERCHANT INTERIOR MAP ADDED */
                'merchant_interior': {
                    w: MERCH_W, h: MERCH_H,
                    tiles: merchTiles,
                    buildings: [
                        { id: 'shop_exit', x: 6, y: 11, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 11 }, name: "Keluar Toko" }
                    ],
                    npcs: [
                        /* UPDATE: NAMA DIUBAH JADI 'MERCHANT' (SESUAI REQUEST) */
                        /* UPDATE: GAMBAR DIGANTI KE job.png UNTUK BOSS TOKO */
                        { id: 'boss_merchant', x: 7, y: 3, name: 'Pak Adi (Bos Merchant)', imgSrc: 'images/job.png', type: 'service', schedule: 'always', w: 40, h: 60 },

                        /* NEW: ISTRI BOS (PEDAGANG KELILING) PINDAH KE DALAM SAAT MALAM */
                        /* Muncul hanya saat 'night' (18:00 ke atas) */
                        { id: 'trader_wife_inside', x: 10, y: 4, name: 'Bu Lastri (Istri Pedagang)', imgSrc: 'images/merchant.png', type: 'static', schedule: 'night', w: 40, h: 60 }
                    ],
                    objects: [
                        /* UPDATE: Meja Kasir dengan gambar images/mejakasir.png */
                        { x: 7, y: 2, type: 'counter', icon: '🪙', img: 'images/mejakasir.png' },

                        /* UPDATE: Gambar Rak diubah menjadi Etalase Besar (Ukuran 2x2) sesuai request */
                        /* Etalase Kiri (Tipe 1 - Barang Umum) */
                        { x: 1, y: 5, w: 2, h: 2, type: 'shelf', icon: '📦', img: 'images/etalasetoko1.png', text: "Etalase Sembako" },
                        { x: 1, y: 8, w: 2, h: 2, type: 'shelf', icon: '📦', img: 'images/etalasetoko1.png', text: "Etalase Perkakas" },

                        /* Etalase Kanan (Tipe 2 - Barang Mewah) */
                        { x: 12, y: 5, w: 2, h: 2, type: 'shelf', icon: '🏺', img: 'images/etalasetoko2.png', text: "Etalase Perhiasan" },
                        { x: 12, y: 8, w: 2, h: 2, type: 'shelf', icon: '🏺', img: 'images/etalasetoko2.png', text: "Etalase Kain Sutra" },

                        { x: 7, y: 11, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: LIBRARY INTERIOR MAP ADDED */
                'library_interior': {
                    w: LIB_W, h: LIB_H,
                    tiles: libTiles,
                    buildings: [
                        { id: 'library_exit', x: 6, y: 11, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 11 }, name: "Keluar Perpus" }
                    ],
                    npcs: [
                        /* UPDATE: Pustakawan diposisikan di tengah belakang meja (x:6.5) dan mundur sedikit (y:1.8) */
                        /* Menggunakan koordinat desimal agar presisi di tengah meja yang lebarnya 2 tile */
                        { id: 'librarian', x: 6.5, y: 1.8, name: 'Bu Ratna (Pustakawan)', imgSrc: 'images/penjagaperpus.png', type: 'service', schedule: 'always', w: 40, h: 60 },

                        /* ADDED: NPC CINTA MATRE (Hanya muncul di Perpus sesuai gender pemain) */
                        /* Siska (cewek matre) muncul jika pemain Cowok - DI PERPUSTAKAAN */
                        { id: 'lover_matre_girl', x: 11, y: 8, name: 'Siska (Sosialita)', imgSrc: 'images/lover_matre_girl.png', type: 'wander', schedule: 'day', genderReq: 'boy', w: 40, h: 60 },

                        /* NEW: NPC KUTUBUKU (Pemberi Quest Skripsi Tahun ke-3) */
                        { id: 'kutubuku', x: 2, y: 8, name: 'Mas Hendra - Kutubuku', imgSrc: 'images/kutubuku.png', type: 'static', schedule: 'day', w: 40, h: 60 }
                    ],
                    objects: [
                        /* UPDATE: MEJA PUSTAKAWAN (Image Baru & Ukuran Diperbesar w:2) */
                        /* Digeser ke x:6 agar posisinya pas di tengah depan NPC (x:7) */
                        { x: 6, y: 3, w: 2, h: 1, type: 'table', icon: '📖', img: 'images/mejapustakawan.png' },

                        /* UPDATE: Ukuran Rak Buku Diperbesar (w:3, h:3) agar terlihat Raksasa & Megah */
                        /* Posisi disesuaikan (x digeser mendekat tembok) agar muat */
                        { x: 1, y: 3, w: 3, h: 3, type: 'bookshelf', icon: '📚', text: "Sejarah Pulau Arsa Vol.1", img: 'images/rakbuku.png' },
                        { x: 10, y: 3, w: 3, h: 3, type: 'bookshelf', icon: '📚', text: "Ensiklopedia Monster", img: 'images/rakbuku.png' },
                        { x: 1, y: 7, w: 3, h: 3, type: 'bookshelf', icon: '📚', text: "Resep Masakan Kuno", img: 'images/rakbuku.png' },
                        { x: 10, y: 7, w: 3, h: 3, type: 'bookshelf', icon: '📚', text: "Legenda Cincin Raja", img: 'images/rakbuku.png' },

                        /* UPDATE: KURSI BACA DIPERBESAR (w:2, h:2) & POSISI DISESUAIKAN AGAR TIDAK DEMPET */
                        { x: 5, y: 5, w: 2, h: 2, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' },
                        { x: 8, y: 5, w: 2, h: 2, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' },
                        { x: 5, y: 8, w: 2, h: 2, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' },
                        { x: 8, y: 8, w: 2, h: 2, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' },

                        /* REVISI: POSISI VAS BUNGA DIPINDAH KE BELAKANG PUSTAKAWAN (y:1) */
                        /* Ditaruh di x:5 dan x:8 agar mengapit pustakawan, tidak menempel tembok atas (y:0) */
                        { x: 5, y: 1, type: 'bookshelf', icon: '🏺', text: "Vas Bunga Putih: Harum bunga melati.", img: 'images/vasputih.png' },
                        { x: 8, y: 1, type: 'bookshelf', icon: '🏺', text: "Vas Bunga Putih: Hiasan yang elegan.", img: 'images/vasputih.png' },

                        { x: 7, y: 11, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: GUILD INTERIOR MAP ADDED (FIX: Masalah Masuk Guild) */
                'guild_interior': {
                    w: GUILD_W, h: GUILD_H,
                    tiles: guildTiles,
                    buildings: [
                        { id: 'guild_exit', x: 7, y: 13, w: 3, h: 1, type: 'trigger', entrance: { x: 8, y: 13 }, name: "Keluar Guild" }
                    ],
                    npcs: [
                        /* UPDATE: GAMBAR GUILD MASTER DIUBAH KE masterguild.png */
                        /* UPDATE: Posisi disesuaikan ke x:7 (Tengah meja 3 petak yang dimulai dari x:6) */
                        /* y: 2.2 agar terlihat berdiri di belakang meja */
                        { id: 'guild_master', x: 7, y: 2.2, name: 'Arya - Guild Master', imgSrc: 'images/masterguild.png', type: 'service', schedule: 'always', w: 40, h: 60 },

                        /* UPDATE: SATRIA (KSATRIA) DIPINDAH KE DALAM SINI (Menggantikan Petualang Veteran) */
                        { id: 'lover2boy', x: 4, y: 8, name: 'Satria (Ksatria)', imgSrc: 'images/lover2boy.png', type: 'lover', schedule: 'always', w: 40, h: 60 },

                        /* ADDED: Rendi (Cowok Matre) muncul jika pemain Cewek - DI GUILD */
                        { id: 'lover_matre_boy', x: 12, y: 8, name: 'Rendi (Anak Sultan)', imgSrc: 'images/lover_matre_boy.png', type: 'wander', schedule: 'day', genderReq: 'girl', w: 40, h: 60 }
                    ],
                    objects: [
                        /* UPDATE: MEJA MASTER GUILD (DIPERBESAR JADI 3x2) */
                        /* Digeser ke x:6 agar posisinya center di ruangan lebar 16 (6,7,8) */
                        { x: 6, y: 2, w: 3, h: 2, type: 'table', icon: '🛡️', img: 'images/mejamasterguild.png', text: "Meja Guild Master: Tempat strategi dan misi rahasia." },

                        /* UPDATE: Papan Guild Diperbesar (w:3, h:2) */
                        /* UPDATE: Menambahkan ID 'guild_board' agar bisa diinteraksi sebagai Bounty Board */
                        { id: 'guild_board', x: 1, y: 5, w: 3, h: 2, type: 'sign', icon: '📜', text: "Papan Bounty Guild", img: 'images/papanguild.png' },

                        /* REVERT: MEJA MAKAN GUILD (Dikembalikan ke ukuran w:2, h:2 agar proporsional) */
                        /* Posisi di kanan */
                        { x: 13, y: 5, w: 2, h: 2, type: 'sign', icon: '🍽️', text: "Meja Perjamuan", img: 'images/mejamakanguild.png' },

                        /* UPDATE: Menambahkan Vas Bunga Putih di Guild (Dekorasi) */
                        { x: 1, y: 10, type: 'bookshelf', icon: '🏺', text: "Vas Bunga Putih: Menambah kesan elegan di markas para petarung.", img: 'images/vasputih.png' },

                        { x: 8, y: 13, type: 'door_out', icon: '🚪' }
                    ]
                },
                'school_interior': {
                    w: SCHOOL_W, h: SCHOOL_H,
                    tiles: schoolTiles,
                    buildings: [
                        { id: 'school_exit', x: 7, y: 13, w: 3, h: 1, type: 'trigger', entrance: { x: 8, y: 13 }, name: "Keluar Kampus" }
                    ],
                    npcs: [
                        // Dosen di depan kelas
                        { id: 'lecture', x: 8, y: 3, name: 'Prof. Wahyu (Dosen)', imgSrc: 'images/lecture.png', type: 'service', schedule: 'day', w: 40, h: 60 },

                        // Mahasiswa yang sedang belajar
                        { id: 'student1', x: 3, y: 7, name: 'Fajar (Mahasiswa)', imgSrc: 'images/mahasiswakiri.png', type: 'wander', schedule: 'day', w: 40, h: 60 },

                        // UPDATE: MAHASISWA MALAS JADI STATIC & DUDUK (DI BELAKANG MEJA KANAN)
                        // Posisi y:5 agar terlihat duduk di balik meja y:6
                        { id: 'student2', x: 12, y: 5, name: 'Galih (Mahasiswa)', imgSrc: 'images/mahasiswakanan.png', type: 'static', schedule: 'day', w: 40, h: 60 },

                        // Teman Love Interest (Putri - Scholar) sering di kampus
                        /* REVISI JADWAL PUTRI: PAGI (MORNING) DI KAMPUS, SORE DI LUAR */
                        { id: 'lover2girl', x: 11, y: 9, name: 'Putri (Scholar)', imgSrc: 'images/lover2girl.png', type: 'lover', schedule: 'morning', w: 40, h: 60 }
                    ],
                    objects: [
                        // Papan Tulis Besar di Depan - UPDATE: Diperbesar (w:4, h:1.5) dan posisi disesuaikan (x:6, y:0.5)
                        { x: 6, y: 0.5, w: 4, h: 1.5, type: 'sign', icon: '📝', img: 'images/papan.png', text: "Materi Hari Ini: \n1. Sejarah Nusantara Arsa \n2. Dasar-dasar Ekonomi \n3. Etika Berpetualang" },

                        // Meja Dosen
                        { x: 8, y: 2, type: 'table', icon: '👨‍🏫', img: 'images/mejadosen.png' },

                        // Barisan Meja Mahasiswa (Kiri) - UPDATE: Pakai images/kursimahasiswa.png
                        { x: 3, y: 6, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' }, { x: 4, y: 6, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' },
                        { x: 3, y: 9, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' }, { x: 4, y: 9, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' },

                        // Barisan Meja Mahasiswa (Kanan) - UPDATE: Pakai images/kursimahasiswa.png
                        { x: 11, y: 6, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' }, { x: 12, y: 6, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' },
                        { x: 11, y: 9, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' }, { x: 12, y: 9, type: 'table', icon: '🪑', img: 'images/kursimahasiswa.png' },

                        // Rak Buku / Referensi di belakang/samping (UPDATE: Ukuran 2x2)
                        { x: 1, y: 3, w: 2, h: 2, type: 'bookshelf', icon: '📚', text: "Ensiklopedia Dunia", img: 'images/rakbuku.png' },
                        /* UPDATE: Posisi rak kanan digeser ke x:13 agar tidak menabrak tembok saat diperlebar */
                        { x: 13, y: 3, w: 2, h: 2, type: 'bookshelf', icon: '📚', text: "Jurnal Ilmiah", img: 'images/rakbuku.png' },

                        /* UPDATE: Mengubah Pot Tanaman Hias menjadi Vas Bunga Putih */
                        { x: 1, y: 10, type: 'bookshelf', icon: '🏺', text: "Vas Bunga Putih", img: 'images/vasputih.png' },

                        { x: 8, y: 13, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: BLACKSMITH INTERIOR ADDED */
                'blacksmith_interior': {
                    w: SMITH_W, h: SMITH_H,
                    tiles: smithTiles,
                    buildings: [
                        { id: 'smith_exit', x: 6, y: 11, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 11 }, name: "Keluar Bengkel" }
                    ],
                    npcs: [
                        { id: 'blacksmith', x: 7, y: 4, name: 'Bang Joko (Bengkel)', imgSrc: 'images/blacksmith.png', type: 'service', schedule: 'always', w: 40, h: 60 },
                        /* NEW: MARINE (PENJAHIT/ISTRI BLACKSMITH) */
                        /* Posisi di sebelah kiri, dekat material */
                        { id: 'marine_tailor', x: 3, y: 5, name: 'Marine (Penjahit)', imgSrc: 'images/marine.png', type: 'service', schedule: 'always', w: 40, h: 60 }
                    ],
                    objects: [
                        /* UPDATE: TUNGKU DENGAN GAMBAR (Diperbesar jadi 2x2) */
                        { x: 2, y: 3, w: 2, h: 2, type: 'sign', icon: '🔥', text: "Tungku Peleburan (Panas!)", img: 'images/tungku.png' },

                        /* UPDATE: RAK SENJATA DENGAN GAMBAR (Diperbesar jadi 2x2) */
                        { x: 11, y: 3, w: 2, h: 2, type: 'sign', icon: '⚔️', text: "Rak Senjata: Pedang, Kapak, dan Zirah.", img: 'images/raksenajata.png' },

                        /* UPDATE: PARON DENGAN GAMBAR */
                        { x: 7, y: 6, type: 'sign', icon: '⚒️', text: "Paron (Anvil) untuk menempa besi.", img: 'images/paron.png' },

                        // Dekorasi material
                        /* UPDATE: BIJIH BESI DENGAN GAMBAR */
                        { x: 2, y: 8, type: 'shelf', icon: '🪨', text: "Tumpukan Bijih Besi", img: 'images/bijihbesi.png' },

                        /* UPDATE: KAYU BAKAR DENGAN GAMBAR */
                        { x: 11, y: 8, type: 'shelf', icon: '🪵', text: "Tumpukan Kayu Bakar", img: 'images/kayubakar.png' },

                        /* UPDATE: MEJA JAHIT MARINE (Dengan Gambar) */
                        { x: 2, y: 5, w: 2, h: 2, type: 'table', icon: '🧵', text: "Meja Jahit: Penuh dengan kain sutra dan benang emas.", img: 'images/mejajahit.png' },

                        { x: 7, y: 11, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: MENTOR INTERIOR ADDED */
                'mentor_interior': {
                    w: MENTOR_W, h: MENTOR_H,
                    tiles: mentorTiles,
                    buildings: [
                        { id: 'mentor_exit', x: 6, y: 11, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 11 }, name: "Keluar Rumah" }
                    ],
                    npcs: [
                        // Gunakan ID 'mentor' agar relationship & dialog sama dengan yang di luar
                        { id: 'mentor', x: 7, y: 4, name: 'Mentor Budi', imgSrc: 'images/mentor.png', type: 'mentor', schedule: 'always', w: 40, h: 60 }
                    ],
                    objects: [
                        /* UPDATE: Rak Buku Mentor Diperbesar jadi 3x3 */
                        { x: 1, y: 3, w: 3, h: 3, type: 'bookshelf', icon: '📚', text: "Ensiklopedia Pendidikan", img: 'images/rakmentor.png' },

                        /* UPDATE: Piala DIKECILKAN jadi 1x1 (Sebelumnya 2x2) */
                        { x: 4, y: 3, w: 1, h: 1, type: 'bookshelf', icon: '🏆', text: "Piala: Guru Terbaik Se-Nusantara", img: 'images/pialamentor.png' },

                        /* UPDATE: Vas Bunga Mentor DIKECILKAN jadi 1x1 (Sebelumnya 2x2) */
                        { x: 11, y: 3, w: 1, h: 1, type: 'shelf', icon: '🏺', text: "Vas Bunga Antik dari Murid", img: 'images/vasmentor.png' },

                        /* UPDATE: Meja Mentor DIKECILKAN jadi 2x1 (Sebelumnya 2x2) */
                        { x: 6, y: 3, w: 2, h: 1, type: 'table', icon: '🪑', img: 'images/mejamentor.png', name: "Meja Mentor" },

                        // Dekorasi Rumah
                        /* UPDATE: GANTI IKON MENJADI GAMBAR TUMPUKAN KERTAS */
                        { x: 2, y: 8, type: 'shelf', icon: '📦', text: "Tumpukan Tugas Siswa", img: 'images/tumpukankertas.png' },

                        /* UPDATE: GANTI IKON MENJADI GAMBAR FOTO MENTOR */
                        { x: 11, y: 8, type: 'shelf', icon: '🖼️', text: "Foto Angkatan Pertama", img: 'images/fotomentor.png' },

                        { x: 7, y: 11, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: CLINIC INTERIOR MAP ADDED */
                'clinic_interior': {
                    w: CLINIC_W, h: CLINIC_H,
                    tiles: clinicTiles,
                    buildings: [
                        { id: 'clinic_exit', x: 6, y: 11, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 11 }, name: "Keluar Klinik" }
                    ],
                    npcs: [
                        /* Dr. Budi (Love Interest) dipindah ke sini */
                        { id: 'lover1boy', x: 7, y: 4, name: 'Dr. Budi', imgSrc: 'images/lover1boy.png', type: 'service', schedule: 'always', w: 40, h: 60 },

                        /* UPDATE: Mengubah Perawat menjadi Pasien Perempuan dengan gambar baru */
                        { id: 'patient_girl', x: 3, y: 5, name: 'Sari (Pasien)', imgSrc: 'images/pasien.png', type: 'wander', schedule: 'day', w: 40, h: 60 }
                    ],
                    objects: [
                        /* Meja Dokter - UPDATE: Menggunakan gambar khusus mejadokter.png */
                        /* UPDATE: UKURAN DIPERBESAR JADI 2x2 DAN POSISI DIGESER AGAR PAS DI TENGAH */
                        { x: 6, y: 3, w: 2, h: 2, type: 'table', icon: '🩺', img: 'images/mejadokter.png' },

                        /* Lemari Obat & Arsip - UPDATE: Menggunakan gambar khusus lemariobat.png & arsiprekammedis.png */
                        { x: 1, y: 3, w: 2, h: 2, type: 'shelf', icon: '💊', text: "Lemari Obat Lengkap", img: 'images/lemariobat.png' },
                        { x: 11, y: 3, w: 2, h: 2, type: 'shelf', icon: '🗄️', text: "Arsip Rekam Medis", img: 'images/arsiprekammedis.png' },

                        /* Bed Pasien (UPDATE: Dikecilkan jadi 2x3 agar tidak melayang) */
                        /* Sebelumnya w:3, h:4 (terlalu besar sehingga shadow jatuh jauh di bawah gambar) */
                        { x: 2, y: 7, w: 2, h: 3, type: 'bed', icon: '🛏️', img: 'images/bedklinik.png', name: "Bed Pasien 1" },
                        { x: 11, y: 7, w: 2, h: 3, type: 'bed', icon: '🛏️', img: 'images/bedklinik.png', name: "Bed Pasien 2" }, // Geser X ke 11 agar simetris

                        { x: 7, y: 11, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: WEDDING INTERIOR ADDED */
                'wedding_interior': {
                    w: WEDDING_W, h: WEDDING_H,
                    tiles: weddingTiles,
                    buildings: [
                        { id: 'wedding_exit', x: 6, y: 13, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 13 }, name: "Keluar Balai" }
                    ],
                    npcs: [
                        /* NPC Penghulu di Altar */
                        /* UPDATE: Ganti gambar Penghulu menjadi modin.png */
                        { id: 'penghulu', x: 6.5, y: 2, name: 'Pak Harun (Penghulu)', imgSrc: 'images/modin.png', type: 'service', schedule: 'always', w: 40, h: 60 }
                    ],
                    objects: [
                        /* NEW: ALTAR/PELAMINAN (DIBELAKANG MEJA MODIN) */
                        /* Posisi y:1 agar berada di belakang meja (y:3) dan penghulu (y:2) */
                        { x: 5.5, y: 1, w: 3, h: 2, type: 'sign', icon: '⛩️', text: "Altar Suci: Tempat janji setia diucapkan di hadapan Tuhan.", img: 'images/altar.png' },

                        /* Altar/Meja Akad di Tengah Depan */
                        /* UPDATE: Mengubah gambar meja menjadi mejamodin.png */
                        /* REVISI: Ukuran diperbesar jadi 3x2 (Sebelumnya 2x1) dan digeser sedikit agar tetap di tengah */
                        { x: 5.5, y: 3, w: 3, h: 2, type: 'table', icon: '📖', img: 'images/mejamodin.png' },

                        /* Kursi Tamu Kiri (Barisan Rapi) */
                        { x: 2, y: 6, type: 'table', icon: '🪑', img: 'images/kursinikah.png' }, { x: 4, y: 6, type: 'table', icon: '🪑', img: 'images/kursinikah.png' },
                        { x: 2, y: 8, type: 'table', icon: '🪑', img: 'images/kursinikah.png' }, { x: 4, y: 8, type: 'table', icon: '🪑', img: 'images/kursinikah.png' },
                        { x: 2, y: 10, type: 'table', icon: '🪑', img: 'images/kursinikah.png' }, { x: 4, y: 10, type: 'table', icon: '🪑', img: 'images/kursinikah.png' },

                        /* Kursi Tamu Kanan (Barisan Rapi) */
                        { x: 9, y: 6, type: 'table', icon: '🪑', img: 'images/kursinikah.png' }, { x: 11, y: 6, type: 'table', icon: '🪑', img: 'images/kursinikah.png' },
                        { x: 9, y: 8, type: 'table', icon: '🪑', img: 'images/kursinikah.png' }, { x: 11, y: 8, type: 'table', icon: '🪑', img: 'images/kursinikah.png' },
                        { x: 9, y: 10, type: 'table', icon: '🪑', img: 'images/kursinikah.png' }, { x: 11, y: 10, type: 'table', icon: '🪑', img: 'images/kursinikah.png' },

                        /* Hiasan Bunga Mewah di Depan */
                        { x: 1, y: 3, type: 'bookshelf', icon: '🏺', text: "Bunga Pernikahan", img: 'images/vasputih.png' },
                        { x: 12, y: 3, type: 'bookshelf', icon: '🏺', text: "Bunga Pernikahan", img: 'images/vasputih.png' },

                        /* Karpet Merah (Imajiner / Menggunakan tile floor biasa tapi area tengah dikosongkan untuk jalan) */

                        { x: 7, y: 13, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: PLAYER SHOP INTERIOR ADDED (RUKO PLAYER) */
                'player_shop_interior': {
                    w: PSHOP_W, h: PSHOP_H,
                    tiles: pShopTiles,
                    buildings: [
                        { id: 'pshop_exit', x: 6, y: 11, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 11 }, name: "Keluar Toko" }
                    ],
                    npcs: [], // Tidak ada NPC karena ini toko player
                    objects: [
                        /* --- AREA PRIVAT (LANTAI ATAS/BELAKANG) --- */

                        /* 1. Kasur Player (Pojok Kiri Atas) - Untuk Tidur & Pulihkan Energi */
                        { x: 1, y: 1, w: 3, h: 4, type: 'bed', icon: '🛏️', img: 'images/bed.png', name: "Kasur Player" },

                        /* 2. Meja Telepon (Tengah Atas) - Untuk Belanja Furnitur/Upgrade */
                        { x: 5, y: 1, w: 2, h: 2, type: 'catalog', icon: '☎️', img: 'images/mejatelpon.png', name: "Meja Telepon" },

                        /* 3. Meja Jurnal/Pembukuan (Pojok Kanan Atas) - Untuk Save Game & Belajar */
                        { x: 11, y: 1, w: 2, h: 2, type: 'diary', icon: '📔', img: 'images/mejabelajar.png', name: "Pembukuan Toko" },

                        /* 4. Kalender (Dinding Atas) - Cek Tanggal & Festival */
                        { x: 9, y: 0, type: 'calendar', icon: '📅', img: 'images/kalender.png' },

                        /* UPDATE: MENAMBAHKAN LEMARI PAKAIAN (WARDROBE) */
                        /* Posisi di x:7, y:0 (Sebelah Meja Telepon) */
                        { x: 7, y: 0, w: 2, h: 3, type: 'shelf', icon: '👗', text: "Lemari Pakaian Bisnis", img: 'images/lemari.png' },

                        /* --- AREA TOKO (LANTAI BAWAH/DEPAN) --- */

                        /* 5. Meja Kasir (Pemisah Ruangan - Menghadap Pintu) */
                        { x: 6, y: 5, w: 2, h: 1, type: 'counter', icon: '🪙', img: 'images/mejakasir.png', name: "Meja Kasir (Kelola)" },

                        /* 6. Rak Display Barang (Kiri & Kanan) */
                        { x: 1, y: 6, w: 2, h: 2, type: 'shelf', icon: '📦', text: "Rak Barang A", img: 'images/rakbuku.png' },
                        { x: 1, y: 9, w: 2, h: 2, type: 'shelf', icon: '📦', text: "Rak Barang B", img: 'images/rakbuku.png' },

                        { x: 11, y: 6, w: 2, h: 2, type: 'shelf', icon: '📦', text: "Rak Barang C", img: 'images/rakbuku.png' },
                        { x: 11, y: 9, w: 2, h: 2, type: 'shelf', icon: '📦', text: "Rak Barang D", img: 'images/rakbuku.png' },

                        /* Pintu Keluar */
                        { x: 7, y: 11, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: AYU'S HOUSE INTERIOR ADDED */
                'lover1_interior': {
                    w: LOVER1_W, h: LOVER1_H,
                    tiles: lover1Tiles,
                    buildings: [
                        { id: 'lover1_exit', x: 6, y: 11, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 11 }, name: "Keluar Rumah" }
                    ],
                    npcs: [
                        /* Ayu (Gadis Desa) di dalam rumahnya - UPDATE: JADWAL JADI MALAM (NIGHT) AGAR TIDAK DOUBLE DENGAN YANG DI LUAR */
                        { id: 'lover1girl', x: 7, y: 4, name: 'Ayu (Gadis Desa)', imgSrc: 'images/lover1girl.png', type: 'lover', schedule: 'night', w: 40, h: 60 },

                        /* NEW: AYA (SAUDARA KEMBAR AYU) - Tetap Always karena dia anak rumahan */
                        /* Posisi di sebelah kiri ruangan */
                        { id: 'aya_twin', x: 4, y: 4, name: 'Aya (Kembaran)', imgSrc: 'images/aya.png', type: 'static', schedule: 'always', w: 40, h: 60 }
                    ],
                    objects: [
                        /* Kasur Ayu - UPDATE: Menggunakan gambar khusus kasurayaayu.png */
                        { x: 1, y: 2, w: 3, h: 4, type: 'bed', icon: '🛏️', img: 'images/kasurayaayu.png', name: "Kasur Ayu" },

                        /* Dapur Sederhana - UPDATE: Menggunakan gambar khusus dapurayaayu.png */
                        /* Digabung menjadi satu objek besar (2x2) */
                        { x: 11, y: 2, w: 2, h: 2, type: 'shelf', icon: '🍳', img: 'images/dapurayaayu.png', text: "Dapur: Bau kue labu yang enak." },

                        /* Meja Makan Kecil - UPDATE: Menggunakan gambar mejaayaayu.png */
                        { x: 11, y: 5, w: 2, h: 2, type: 'table', icon: '🪑', img: 'images/mejaayaayu.png' },

                        /* Banyak Tanaman/Bunga (Ayu suka bunga) */
                        { x: 1, y: 8, type: 'bookshelf', icon: '🌻', text: "Bunga Matahari", img: 'images/vasputih.png' },
                        { x: 3, y: 8, type: 'bookshelf', icon: '🌹', text: "Mawar Merah", img: 'images/vasputih.png' },
                        { x: 10, y: 8, type: 'bookshelf', icon: '🌷', text: "Tulip", img: 'images/vasputih.png' },
                        { x: 12, y: 8, type: 'bookshelf', icon: '🌼', text: "Melati", img: 'images/vasputih.png' },

                        /* Lemari Pakaian - UPDATE: Menggunakan gambar khusus lemariayaayu.png */
                        { x: 4, y: 1, w: 2, h: 3, type: 'shelf', icon: '👗', img: 'images/lemariayaayu.png', text: "Lemari Pakaian Ayu" },

                        { x: 7, y: 11, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: FISHERMAN HOUSE INTERIOR ADDED */
                'fisherman_interior': {
                    w: FISH_W, h: FISH_H,
                    tiles: fishTiles,
                    buildings: [
                        { id: 'fisherman_exit', x: 5, y: 9, w: 3, h: 1, type: 'trigger', entrance: { x: 6, y: 9 }, name: "Keluar Rumah" }
                    ],
                    npcs: [
                        /* Bu Nelayan di dalam rumah (Menjaga rumah saat suami kerja) */
                        { id: 'istrinelayan', x: 6, y: 4, name: 'Bu Tini (Istri Nelayan)', imgSrc: 'images/istrinelayan.png', type: 'wander', schedule: 'always', w: 40, h: 60 }
                    ],
                    objects: [
                        /* Dekorasi Khas Nelayan */
                        { x: 1, y: 2, w: 3, h: 2, type: 'shelf', icon: '🕸️', text: "Jaring Ikan: Sedang dijemur/diperbaiki.", img: 'images/jaringikan.png' },
                        { x: 10, y: 2, type: 'shelf', icon: '🎣', text: "Rak Pancing: Koleksi joran bambu tua.", img: 'images/rakpancing.png' },

                        /* Hasil Tangkapan */
                        { x: 10, y: 5, type: 'shelf', icon: '🐟', text: "Ember Ikan: Bau amis tapi segar!", img: 'images/emberikan.png' },
                        { x: 11, y: 5, type: 'shelf', icon: '🧊', text: "Box Es: Untuk mengawetkan ikan.", img: 'images/boxes.png' },

                        /* Kasur Sederhana */
                        { x: 1, y: 6, w: 2, h: 3, type: 'bed', icon: '🛏️', img: 'images/kasurnelayan.png', name: "Kasur Nelayan" },

                        /* Meja Makan - UPDATE: Diperbesar jadi 2x2 */
                        { x: 6, y: 4, w: 2, h: 2, type: 'table', icon: '🪑', img: 'images/mejamakanikan.png' },

                        /* Piala/Penghargaan - UPDATE: Diperbesar jadi 2x2 */
                        { x: 5, y: 1, w: 2, h: 2, type: 'shelf', icon: '🏆', text: "Piala: Juara Mancing Ikan Mas 2023", img: 'images/rakpialaikan.png' },

                        { x: 6, y: 9, type: 'door_out', icon: '🚪' }
                    ]
                },
                /* NEW: CANDI INTERIOR MAP ADDED */
                'candi_interior': {
                    w: CANDI_W, h: CANDI_H,
                    tiles: candiTiles,
                    buildings: [
                        { id: 'candi_exit', x: 6, y: 15, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 15 }, name: "Keluar Candi" },
                        // Portal Rahasia ke Kahyangan Wilis (hanya muncul jika syarat terpenuhi, cek saat interaksi)
                        { id: 'portal_sylvaria', x: 6, y: 0, w: 5, h: 2, type: 'trigger',
                          entrance: { x: 8, y: 1 }, name: '🌀 Portal Kahyangan Wilis', open24h: true }
                    ],
                    npcs: [
                        /* NEW: DEWI RORO (PENJAGA CANDI) */
                        /* Posisi disesuaikan (x:7.5, y:6.5) agar berdiri pas di depan Altar yang turun */
                        /* UPDATE: SCHEDULE 'night' agar hanya muncul malam sampai pagi (20:00 - 06:00) */
                        { id: 'dewi_roro', x: 7.5, y: 6.5, name: 'Dewi Roro', imgSrc: 'images/roro.png', type: 'static', schedule: 'night', w: 40, h: 60 }
                    ],
                    objects: [
                        // ARCA UTAMA (Di Tengah Atas)
                        // FIX: Ukuran diubah jadi 4x5 (Lebih Tinggi) agar tidak gepeng
                        // Posisi tetap di y:1, tapi karena tingginya 5, dia akan memakan area y:1 s/d y:5
                        { x: 6, y: 1, w: 4, h: 5, type: 'sign', icon: '🗿', text: "Arca Utama: Memancarkan aura ketenangan masa lalu.", img: 'images/arcacandi.png' },

                        // ARTIFAK KUNO (Kiri & Kanan)
                        // UPDATE: Guci Abu sekarang menggunakan gambar 'images/gucicandi.png'
                        // UPDATE TERBARU: Diperbesar jadi 2x2 dan bisa dilewati belakangnya
                        { x: 2, y: 4, w: 2, h: 2, type: 'shelf', icon: '🏺', text: "Guci Abu: Peninggalan dinasti kuno.", img: 'images/gucicandi.png' },
                        // UPDATE: Prasasti Batu sekarang menggunakan gambar 'images/prasasticandi.png'
                        // UPDATE TERBARU: Diperbesar jadi 2x2 dan bisa dilewati belakangnya
                        { x: 13, y: 4, w: 2, h: 2, type: 'shelf', icon: '📜', text: "Prasasti Batu: Tertulis dalam bahasa Sansekerta.", img: 'images/prasasticandi.png' },

                        // UPDATE: Lilin Abadi menggunakan gambar 'images/lilinabadi.png'
                        { x: 2, y: 8, type: 'shelf', icon: '🕯️', text: "Lilin Abadi: Apinya tidak pernah padam.", img: 'images/lilinabadi.png' },
                        { x: 13, y: 8, type: 'shelf', icon: '🕯️', text: "Lilin Abadi: Menerangi kegelapan candi.", img: 'images/lilinabadi.png' },

                        // Meja Persembahan (Kuno) - UPDATE: Menggunakan images/mejaaltar.png
                        // UPDATE: Posisi diturunkan ke y:7 karena patung memanjang sampai y:6
                        // UPDATE TERBARU: Diperbesar jadi 2x2 (h:2) agar bisa dilewati belakangnya
                        { x: 7, y: 7, w: 2, h: 2, type: 'table', icon: '💐', text: "Altar Persembahan", img: 'images/mejaaltar.png' },

                        { x: 7, y: 15, type: 'door_out', icon: '🚪' },
                        // Portal ke Kahyangan Wilis (terlihat seperti arca/altar tambahan di sisi utara)
                        { x: 6, y: 0, w: 5, h: 2, type: 'sign', icon: '🌀',
                          text: 'Retakan Dimensi — Terasa ada angin hangat dari celah ini. Ada sesuatu di baliknya...' }
                    ]
                },


                // --- NEW: WARNET INTERIOR MAP (14x12) ---
                'warnet_interior': {
                    w: 14, h: 12,
                    // Kita pakai lantai kayu (ID 10) dan tembok putih (ID 11) agar terlihat modern
                    tiles: (() => {
                        const arr = new Array(14 * 12).fill(10); // 10 = Lantai Kayu
                        // Buat Tembok Keliling
                        for (let x = 0; x < 14; x++) { arr[0 * 14 + x] = 11; arr[(12 - 1) * 14 + x] = 11; }
                        for (let y = 0; y < 12; y++) { arr[y * 14 + 0] = 11; arr[y * 14 + (14 - 1)] = 11; }
                        arr[(12 - 1) * 14 + 7] = 8; // Pintu Keluar
                        return arr;
                    })(),
                    buildings: [
                        /* FIX: KOORDINAT X DIPERBAIKI DARI 14 KE 6 AGAR SESUAI PINTU (x:7) */
                        { id: 'warnet_exit', x: 6, y: 11, w: 3, h: 1, type: 'trigger', entrance: { x: 7, y: 11 }, name: "Keluar Warnet" }
                    ],
                    npcs: [
                        // OPERATOR (PENJAGA)
                        { id: 'op_warnet', x: 7, y: 3, name: 'Operator (OP)', imgSrc: 'images/penjagawarnet.png', type: 'service', schedule: 'always', w: 40, h: 60 },
                        // MAID (PELAYAN MAKANAN)
                        { id: 'maid_warnet', x: 11, y: 5, name: 'Mela (Maid)', imgSrc: 'images/maidwarnet.png', type: 'service', schedule: 'always', w: 40, h: 60 }
                    ],
                    objects: [
                        // Meja Operator
                        { x: 6, y: 2, w: 2, h: 2, type: 'counter', icon: '💻', img: 'images/mejakasir.png', name: "Server Pusat" },

                        // Bilik Komputer Kiri
                        { x: 2, y: 5, w: 2, h: 2, type: 'table', icon: '🖥️', img: 'images/mejabelajar.png', name: "PC-01 (Gaming)" },
                        { x: 2, y: 8, w: 2, h: 2, type: 'table', icon: '🖥️', img: 'images/mejabelajar.png', name: "PC-02 (Browsing)" },

                        // Bilik Komputer Tengah
                        { x: 5, y: 5, w: 2, h: 2, type: 'table', icon: '🖥️', img: 'images/mejabelajar.png', name: "PC-03 (VIP)" },
                        { x: 5, y: 8, w: 2, h: 2, type: 'table', icon: '🖥️', img: 'images/mejabelajar.png', name: "PC-04 (Umum)" },

                        // Rak Snack/Minuman
                        { x: 11, y: 2, w: 2, h: 2, type: 'shelf', icon: '🥤', text: "Kulkas Minuman Dingin", img: 'images/lemariobat.png' },

                        { x: 7, y: 11, type: 'door_out', icon: '🚪' }
                    ]
                },


                'dungeon': {
                    w: DUNGEON_W, h: DUNGEON_H,
                    tiles: dungeonTiles,
                    npcs: [],
                    objects: [], /* Exit Dungeon dipindah ke buildings agar otomatis */
                    buildings: [
                        ...dungeonRocks, // Batu-batu dungeon
                        { id: 'dungeon_exit', x: 2, y: 2, w: 1, h: 1, type: 'trigger', entrance: { x: 2, y: 2 }, name: "Keluar Dungeon" }
                    ]
                },
                /* UPDATE: BATTLE ARENA (RERUNTUHAN) DENGAN DETAIL BARU */
                'ruins_battle': {
                    w: RUINS_W, h: RUINS_H,
                    tiles: ruinsTiles,
                    npcs: [],
                    buildings: [
                        ...ruinsObstacles, // Puing-puing penghalang
                        { id: 'ruins_exit', x: 10, y: 14, w: 2, h: 1, type: 'trigger', entrance: { x: 11, y: 14 }, name: "Kabur (Keluar)" }
                    ],
                    objects: []
                },

                // ══════════════════════════════════════════════════════════
                // 🧚‍♀️ KAHYANGAN WILIS — AREA RAHASIA
                // Akses: Keris Penjaga + Rafflesia mekar + Ethics ≥ 60
                // ══════════════════════════════════════════════════════════
                'sylvaria': {
                    w: SYLVARIA_W, h: SYLVARIA_H,
                    tiles: sylvariaTiles,
                    buildings: [
                        { id: 'sylvaria_exit', x: 14, y: SYLVARIA_H-2, w: 3, h: 1,
                          type: 'trigger', entrance: { x: 15, y: SYLVARIA_H-2 }, name: '🚪 Kembali ke Candi' },
                        { id: 'altar_sylvaria', x: 12, y: 5, w: 8, h: 4,
                          img: null, entrance: { x: 15, y: 8 }, name: '✨ Altar Peri Agung', open24h: true }
                    ],
                    npcs: [
                        { id: 'sylva_peri', x: 15, y: 7, name: 'Rara Wilis (Ratu Widadari)',
                          imgSrc: 'images/peripanen.png', type: 'static', schedule: 'always', w: 40, h: 55 },
                        { id: 'peri_kecil_1', x: 7, y: 14, name: 'Wening (Widadari Wilis)',
                          imgSrc: 'images/wening.png', type: 'wander', vx: 0.4, vy: 0, schedule: 'always', w: 38, h: 58, noNameTag: true },
                        { id: 'peri_kecil_2', x: 24, y: 14, name: 'Sekar (Widadari Bunga)',
                          imgSrc: 'images/sekar.png', type: 'wander', vx: -0.4, vy: 0, schedule: 'always', w: 38, h: 58, noNameTag: true },
                        { id: 'peri_kecil_3', x: 15, y: 19, name: 'Bening (Widadari Air)',
                          imgSrc: 'images/bening.png', type: 'static', schedule: 'always', w: 38, h: 58, noNameTag: true }
                    ],
                    objects: [
                        { x: 13, y: 5, w: 6, h: 3, type: 'sign', icon: '🌸',
                          text: 'Altar Widadari Agung — Pusat kekuatan Kahyangan Wilis. Retak dan hampir padam.' },
                        { x: 14, y: 2, w: 4, h: 3, type: 'sign', icon: '🌳',
                          text: 'Pohon Beringin Agung Kahyangan Wilis — Sumber kehidupan para Widadari. Daunnya menghitam, kekuatannya memudar...' },
                        { x: 4, y: 13, w: 2, h: 2, type: 'shelf', icon: '💎',
                          text: 'Kristal Brantas — Dulu bersinar terang, kini retak dan kusam.' },
                        { x: 25, y: 13, w: 2, h: 2, type: 'shelf', icon: '💎',
                          text: 'Kristal Brantas — Pecahannya masih mengandung sedikit sihir.' },
                        { x: 4, y: 5, w: 2, h: 2, type: 'sign', icon: '📜',
                          text: '"Kahyangan Wilis ada karena keseimbangan alam dan hati manusia Jawa. Saat keserakahan merajalela di dunia bawah, Kahyangan kami ikut memudar." — Kronik Widadari Pertama' },
                        { x: 26, y: 5, w: 2, h: 2, type: 'sign', icon: '📜',
                          text: '"Mung wong kang nggawa Cahaya Telu — Wani, Tresna Alam, lan Kawicaksanan — kang bisa nggugah Pohon Beringin Agung iki." (Hanya manusia yang membawa Tiga Cahaya yang dapat membangkitkan Beringin Agung.) — Serat Widadari Pertama' },
                        { x: 14, y: SYLVARIA_H-2, type: 'door_out', icon: '🚪' }
                    ]
                },

                'house': {
                    // Init with default, will be regenerated dynamically
                    w: 12, h: 10,
                    tiles: houseTiles,
                    npcs: [],
                    buildings: [
                        {
                            id: 'house_exit',
                            x: 6 - 1, // doorX - 1 (doorX = 6)
                            y: 9, // doorY (h-1)
                            w: 3,
                            h: 1,
                            type: 'trigger',
                            entrance: { x: 6, y: 9 },
                            name: "Keluar Rumah"
                        }
                    ],
                    objects: [
                        /* ADDED: KASUR PLAYER (Interactive Sleep) */
                        /* UPDATE: Ganti gambar kasur jadi bed.png */
                        /* REVISI POSISI: Dinaikkan ke y:0 agar lebih nempel tembok */
                        /* REVISI UKURAN: Dikecilkan jadi 2x3 (Single Bed) agar proporsional */
                        { x: 1, y: 0, w: 2, h: 3, type: 'bed', icon: '🛏️', img: 'images/bed.png', name: "Kasur Empuk" },

                        /* UPDATE: MEJA BUKU HARIAN (Menggantikan Buku Melayang) */
                        /* Posisi disesuaikan agar tidak menumpuk */
                        /* REVISI: Mengganti images/mejabuku.png menjadi images/mejabelajar.png */
                        /* UPDATE UKURAN: Diperbesar kembali jadi 2x2 */
                        /* UPDATE POSISI: Diturunkan ke y:0 */
                        { x: 4, y: 0, w: 2, h: 2, type: 'diary', icon: '📔', img: 'images/mejabelajar.png', name: "Meja Jurnal" },

                        /* NEW: LEMARI PAKAIAN (WARDROBE) */
                        { x: 7, y: 0, w: 2, h: 3, type: 'shelf', icon: '👗', text: "Lemari Pakaian: Berisi seragam dan baju santai.", img: 'images/lemari.png' },

                        /* REVISI POSISI KALENDER: Geser ke x:10 (Pojok Kanan dinding atas) agar tidak mepet */
                        { x: 10, y: 0, type: 'calendar', icon: '📅', img: 'images/kalender.png' },

                        /* UPDATE: MEJA TELEPON (Menggantikan Telepon Melayang) */
                        /* REVISI: Update gambar ke images/mejatelpon.png dan ukuran jadi 2x2 */
                        /* UPDATE POSISI: Dinaikkan ke y:6 agar tidak nempel tembok bawah */
                        { x: 2, y: 6, w: 2, h: 2, type: 'catalog', icon: '☎️', img: 'images/mejatelpon.png', name: "Meja Telepon" }
                    ]
                }
            };

            /** GAME STATE */
            const STATE = {
                screen: 'splash',
                day: 1,
                time: 0,
                season: 'spring',
                weather: 'clear',
                location: 'village',
                camera: { x: 0, y: 0 },
                player: {
                    x: 18 * TILE_SIZE,
                    y: 11 * TILE_SIZE,
                    w: 20, h: 20,
                    color: '#fbbf24',
                    gender: 'boy',
                    spriteIdle: null,
                    spriteWalk: null,
                    // UPDATE: Speed dinaikkan (5 -> 7) agar gerakan terasa lebih cepat dan responsif
                    speed: 7,
                    direction: 'down',
                    hp: 100, maxHp: 100,
                    energy: 100,
                    money: 10000,

                    // NEW: Steps Counter untuk sistem kelelahan berjalan
                    stepsTaken: 0,

                    // NEW STATS
                    level: 1,
                    exp: 0,
                    maxExp: 100,

                    str: 5, // Strength (Fighter/Worker)
                    int: 5, // Intelligence (Mage/Student)
                    reputation: 0, // Reputation (Tanker/Family)
                    biz: 0, // Business Skill (Support/Entrepreneur) -- NEW STAT ADDED

                    married: false,
                    modinVisited: false, // Flag: sudah temui Pak Modin
                    homeRole: 'homemaker', // 'homemaker' = urus RT, 'worker' = bekerja luar
                    divorced: false,     // Flag: pernah cerai (duda/janda)
                    spouseId: null,
                    houseLevel: 1,
                    furniture: [],
                    role: 'none',
                    major: null, // NEW: Jurusan Kuliah

                    jobStatus: 'unemployed',
                    bossReputation: 50,
                    shiftStarted: false,
                    lastWorkedDay: 0,
                    salaryDays: 0,

                    // SISTEM INFO LOWONGAN KERJA (harus cari info dulu sebelum melamar)
                    knownJobs: [],          // ['merchant','bengkel','parttime_bengkel','parttime_jahit','parttime_klinik']
                    jobSearchCount: 0,      // berapa kali sudah cari info
                    lastJobSearchDay: 0,    // hari terakhir cari info

                    // PART-TIME SYSTEM
                    partTimeJob: null,           // null | 'bengkel' | 'penjahit' | 'klinik'
                    partTimeStatus: 'none',      // 'none' | 'working'
                    partTimeShiftStarted: false,
                    partTimeLastWorkedDay: 0,
                    partTimeSalaryDays: 0,
                    todayConflict: null,         // tracker konflik hari ini
                    shownStudentConflicts: [],    // konflik akademik yang sudah ditampilkan
                    shownEntrepreneurConflicts: [], // konflik bisnis yang sudah ditampilkan
                    integrityScore: 100,          // 0-100: turun saat pilih jalan curang, naik saat jujur
                    lowIntegrityWarned: false,    // flag agar warning tidak spam
                    lastRepThreshDay: null,       // tracker notif threshold reputasi

                    // NEW: TRACKING ABSENSI KULIAH
                    lastAttendanceDay: 0,

                    attackCooldown: 0,
                    skillCooldown: 0,
                    isAttacking: false,

                    // NEW: COMBAT COMBO SYSTEM
                    comboCount: 0,      // Hitungan combo saat ini (1, 2, 3)
                    comboWindow: 0,     // Waktu toleransi untuk lanjut ke combo berikutnya

                    // NEW: DAMAGE FEEDBACK STATE
                    hurtTimer: 0,       // Timer untuk animasi berkedip merah



                    reflections: [],
                    messages: [],
                    learnedSubjects: [], // FIX: Inisialisasi Array Mata Pelajaran
                    ethics: 100,
                    relationships: {},
                    inventory: {},
                    // FASE 2: Poin Prestasi & Portofolio Media Pembelajaran
                    achievementPoints: 0,
                    portfolioItems: []
                },
                isPrologue: false,
                gameOverTriggered: false,
                gameFinished: false,
                freeRoamMode: false,
                isDayChanging: false, // FIX: Flag pengaman agar hari tidak ganti ganda

                // QUEST FLAGS
                activeQuest: null, // 'find_draft' etc
                questProgress: {},

                // NEW: TUTORIAL FOCUS TARGET (LIVE TRACKING)
                tutorialFocusTarget: null, // { x: tileX, y: tileY }

                enemies: [],
                particles: [],
                weatherParticles: [],
                // NEW: FLOATING TEXT ARRAY (Damage Numbers)
                floatingTexts: [],

                critters: [],
                lightningTimer: 0,
                shakeTimer: 0,
                lightningX: 0,

                minigame: null,
                fishing: {
                    active: false,
                    barX: 0,
                    barDir: 1,
                    targetStart: 0,
                    targetWidth: 0
                },
                // NEW: Cooldown agar tidak langsung teleport balik saat spawn
                teleportCooldown: 0,
                // NEW: Dungeon Level Tracker
                dungeonLevel: 1,
                bossSpawned: false, // NEW: Status apakah Boss sudah muncul

                // NEW: Flag Peringatan Energi
                lowEnergyWarned: false,

                // NEW: Flag Status Tutorial Dalam Rumah (Mencegah Keluar Pintu)
                tutorialIndoorComplete: false,
                ghosts: [],

                // STATE VIRAL
                viral: {
                    active: null,
                    day: 0
                },

                // --- [BARU] NAMA MENTOR DINAMIS ---
                mentorName: "Mentor Budi"
            };

            const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
            // --- NEW: DEFINISI HARI DALAM SEMINGGU ---
            const DAYS_OF_WEEK = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

            // --- FIX: DEFINISI HARI PER MUSIM (Mencegah Error 'DAYS_PER_SEASON is not defined') ---
            const DAYS_PER_SEASON = 30;

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

            // =============================================
            // ===== SISTEM PET - KATALOG & LOGIKA =====
            // =============================================
            const PET_CATALOG = {
                // === TIER: RARE (Dibeli di toko Satria, pakai AP) ===
                ayam_bekisar: {
                    id: 'ayam_bekisar', name: 'Ayam Bekisar', emoji: '🐔', tier: 'rare',
                    price: 30, description: 'Ayam kebanggaan Jawa Timur. Suaranya merdu!',
                    bonus: { str: 2 }, bonusText: '+2 STR',
                    hp: 80, atk: 12, spd: 10,
                    offsetX: -22, offsetY: 14, size: 22 // posisi ikut player
                },
                kambing_kacang: {
                    id: 'kambing_kacang', name: 'Kambing Kacang', emoji: '🐐', tier: 'rare',
                    price: 40, description: 'Kecil tapi lincah dan tahan banting.',
                    bonus: { hp: 10 }, bonusText: '+10 Max HP',
                    hp: 90, atk: 10, spd: 14,
                    offsetX: -22, offsetY: 14, size: 24
                },
                // === TIER: EPIC ===
                sapi_madura: {
                    id: 'sapi_madura', name: 'Sapi Madura', emoji: '🐄', tier: 'epic',
                    price: 100, description: 'Sapi bertubuh kuat dengan punuk khas Madura.',
                    bonus: { str: 5 }, bonusText: '+5 STR',
                    hp: 140, atk: 18, spd: 7,
                    offsetX: -26, offsetY: 16, size: 28
                },
                kuda_sumbawa: {
                    id: 'kuda_sumbawa', name: 'Kuda Sumbawa', emoji: '🐴', tier: 'epic',
                    price: 130, description: 'Kuda petarung pemberani dari medan laga.',
                    bonus: { str: 3, int: 2 }, bonusText: '+3 STR +2 INT',
                    hp: 120, atk: 22, spd: 18,
                    offsetX: -26, offsetY: 14, size: 28
                },
                elang_jawa: {
                    id: 'elang_jawa', name: 'Elang Jawa', emoji: '🦅', tier: 'epic',
                    price: 120, description: 'Rajawali Jawa, simbol keberanian dan kecerdasan.',
                    bonus: { int: 5 }, bonusText: '+5 INT',
                    hp: 100, atk: 20, spd: 20,
                    offsetX: -20, offsetY: -10, size: 24 // terbang sedikit di atas
                },
                // === TIER: LEGENDARY (Hanya dari battle dengan Satria, hubungan >= 80) ===
                naga_nusantara: {
                    id: 'naga_nusantara', name: 'Naga Nusantara', emoji: '🐲', tier: 'legendary',
                    price: 0, description: 'Makhluk legendaris penjaga Nusantara. Kekuatannya luar biasa!',
                    bonus: { str: 10, int: 10, hp: 20 }, bonusText: '+10 STR +10 INT +20 Max HP',
                    hp: 250, atk: 35, spd: 15,
                    offsetX: -28, offsetY: 10, size: 34
                },
                harimau_sumatra: {
                    id: 'harimau_sumatra', name: 'Harimau Sumatra', emoji: '🐯', tier: 'legendary',
                    price: 0, description: 'Raja hutan Sumatra yang agung dan buas!',
                    bonus: { str: 15, reputation: 10 }, bonusText: '+15 STR +10 Reputasi',
                    hp: 220, atk: 40, spd: 18,
                    offsetX: -26, offsetY: 14, size: 30
                },
                komodo_raksasa: {
                    id: 'komodo_raksasa', name: 'Komodo Raksasa', emoji: '🦎', tier: 'legendary',
                    price: 0, description: 'Reptil purba terbesar di dunia, hanya ada di Indonesia!',
                    bonus: { str: 8, int: 8, biz: 8 }, bonusText: '+8 STR +8 INT +8 BIZ',
                    hp: 200, atk: 32, spd: 12,
                    offsetX: -26, offsetY: 16, size: 28
                }
            };

            const PET_TIER_COLOR = { rare: '#60a5fa', epic: '#a78bfa', legendary: '#fbbf24' };
            const PET_TIER_LABEL = { rare: 'RARE', epic: 'EPIC', legendary: 'LEGENDARY ⭐' };
            const LEGENDARY_PET_IDS = ['naga_nusantara', 'harimau_sumatra', 'komodo_raksasa'];

            // State battle pet
            let PET_BATTLE_STATE = null;

            // State untuk animasi pet follower
            if (!window.PET_FOLLOWER) window.PET_FOLLOWER = { x: 0, y: 0, initialized: false, bobPhase: 0 };

            // --- FUNGSI DRAW PET FOLLOWER DI CANVAS ---
            function drawPetFollower(ctx, p) {
                const activePetId = STATE.player.activePet;
                if (!activePetId || !PET_CATALOG[activePetId]) return;
                const pet = PET_CATALOG[activePetId];

                // Hitung posisi pet (mengikuti player dengan sedikit lag / ekor)
                const f = window.PET_FOLLOWER;
                if (!f.initialized) {
                    f.x = p.x + pet.offsetX;
                    f.y = p.y + pet.offsetY;
                    f.initialized = true;
                }

                // Interpolasi smooth ke target (lag ikut player)
                const targetX = p.x + pet.offsetX - 18;
                const targetY = p.y + pet.offsetY + 5;
                f.x += (targetX - f.x) * 0.08;
                f.y += (targetY - f.y) * 0.08;
                f.bobPhase = (f.bobPhase || 0) + 0.05;

                const bobY = Math.sin(f.bobPhase) * (pet.id === 'elang_jawa' ? 4 : 2);
                const drawX = f.x;
                const drawY = f.y + bobY;
                const s = pet.size || 24;

                ctx.save();

                // Shadow bayangan di bawah pet
                ctx.fillStyle = 'rgba(0,0,0,0.25)';
                ctx.beginPath();
                ctx.ellipse(drawX + s/2, drawY + s + 2, s * 0.4, 3, 0, 0, Math.PI * 2);
                ctx.fill();

                // Gambar emoji pet
                ctx.font = `${s}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Flip ke kiri jika player menghadap kiri
                if (p.direction === 'right') {
                    ctx.scale(-1, 1);
                    ctx.fillText(pet.emoji, -(drawX + s/2), drawY + s/2);
                } else {
                    ctx.fillText(pet.emoji, drawX + s/2, drawY + s/2);
                }

                // Sparkle effect untuk legendary
                if (pet.tier === 'legendary') {
                    ctx.font = '8px Arial';
                    const sparkPhase = Date.now() / 400;
                    const sparkles = ['✨','⭐','✨'];
                    sparkles.forEach((sp, i) => {
                        const sx = drawX + s/2 + Math.cos(sparkPhase + i * 2.1) * (s * 0.7);
                        const sy = drawY + s/2 + Math.sin(sparkPhase + i * 2.1) * (s * 0.6);
                        if (p.direction === 'right') ctx.fillText(sp, -sx, sy);
                        else ctx.fillText(sp, sx, sy);
                    });
                }

                ctx.restore();

                // Label nama pet (kecil di atas)
                ctx.save();
                ctx.font = 'bold 8px Nunito, Arial';
                ctx.textAlign = 'center';
                ctx.fillStyle = PET_TIER_COLOR[pet.tier] || '#fff';
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 3;
                ctx.fillText(pet.name, drawX + s/2, drawY - 4);
                ctx.shadowBlur = 0;
                ctx.restore();
            }

            // --- FUNGSI BUKA TOKO PET SATRIA ---
            function openPetShop(npc) {
                const p = STATE.player;
                const love = p.relationships[npc.id] || 0;
                const myPets = p.pets || [];
                const activePet = p.activePet || null;
                const myAP = p.achievementPoints || 0;

                let shopText = `🐾 Selamat datang di Padepokan Hewan Satria!\n\n🏅 AP Kamu: **${myAP} poin**\nHewan peliharaan memberikan bonus stat permanen & ikut menemanimu!\n\n`;
                if (activePet && PET_CATALOG[activePet]) {
                    const ap = PET_CATALOG[activePet];
                    shopText += `Pet aktif: **${ap.emoji} ${ap.name}** (${ap.bonusText})\n`;
                }

                const opts = [];
                opts.push({ text: '🛒 Beli Pet (Pakai AP)', action: () => showPetBuyMenu(npc) });
                if (myPets.length > 1) opts.push({ text: '🔄 Ganti Pet Aktif', action: () => showPetSwitchMenu(npc) });
                if (myPets.length > 0) opts.push({ text: '📖 Koleksi Petku', action: () => showMyPets(npc) });

                if (love >= 80) {
                    opts.push({ text: '⚔️ Tantang Pet Legendaris!', action: () => startLegendaryPetBattle(npc) });
                } else {
                    opts.push({ text: `🔒 Pet Legendaris [Hubungan ❤️ ${love}/80]`, action: () => showDialogue(npc.name, `Untuk menantang Pet Legendaris, bangun hubungan kuat denganku dulu.\n\nHubunganmu: **${love}/80**`, [{ text: 'Siap!', action: closeDialogue }], npc.imgSrc) });
                }
                opts.push({ text: 'Kembali', action: () => interactNPC(npc) });
                showDialogue('🐾 PADEPOKAN HEWAN SATRIA', shopText, opts, npc.imgSrc);
            }

            function showPetBuyMenu(npc) {
                const p = STATE.player;
                const myPetIds = (p.pets || []);
                const myAP = p.achievementPoints || 0;
                const buyable = Object.values(PET_CATALOG).filter(pet => pet.tier !== 'legendary');

                const opts = buyable.map(pet => {
                    const owned = myPetIds.includes(pet.id);
                    const canAfford = myAP >= pet.price;
                    const label = owned
                        ? `✅ ${pet.emoji} ${pet.name} [SUDAH PUNYA]`
                        : `${pet.emoji} ${pet.name} [${PET_TIER_LABEL[pet.tier]}] - ${pet.price} AP${!canAfford ? ' ⚠️' : ''}`;
                    return {
                        text: label,
                        action: () => {
                            if (owned) { showDialogue(npc.name, `Kamu sudah punya **${pet.name}**!`, [{ text: 'Iya!', action: closeDialogue }], npc.imgSrc); return; }
                            showDialogue('🛒 BELI PET', `${pet.emoji} **${pet.name}**\n\n${pet.description}\n\nBonus: **${pet.bonusText}**\nHarga: **${pet.price} AP**\nAP Kamu: **${myAP} AP**\n\nYakin beli?`, [
                                {
                                    text: `✅ Beli (${pet.price} AP)`,
                                    action: () => {
                                        if (p.achievementPoints < pet.price) { showToast('AP tidak cukup!'); return; }
                                        p.achievementPoints -= pet.price;
                                        if (!p.pets) p.pets = [];
                                        p.pets.push(pet.id);
                                        if (!p.activePet) {
                                            p.activePet = pet.id;
                                            applyPetBonus(pet);
                                            updatePetHUD();
                                            window.PET_FOLLOWER.initialized = false;
                                        }
                                        manualSave();
                                        if (document.getElementById('profile-ap-display')) document.getElementById('profile-ap-display').innerText = p.achievementPoints;
                                        showDialogue(npc.name, `${pet.emoji} **${pet.name}** kini milikmu!\n\n✨ ${pet.bonusText} aktif!\nPetmu akan mengikutimu di map!`, [{ text: '🎉 Terima kasih!', action: closeDialogue }], npc.imgSrc);
                                    }
                                },
                                { text: 'Batal', action: () => showPetBuyMenu(npc) }
                            ], npc.imgSrc);
                        }
                    };
                });
                opts.push({ text: '⬅ Kembali', action: () => openPetShop(npc) });
                showDialogue('🛒 BELI PET', `Pilih hewan:\n🏅 AP Kamu: **${myAP}**\n(Rare murah | Epic kuat | Legendary dari Battle)`, opts, npc.imgSrc);
            }

            function showPetSwitchMenu(npc) {
                const p = STATE.player;
                const myPets = p.pets || [];
                const opts = myPets.map(petId => {
                    const pet = PET_CATALOG[petId];
                    if (!pet) return null;
                    const isActive = p.activePet === petId;
                    return {
                        text: `${isActive ? '✅ ' : ''}${pet.emoji} ${pet.name} [${PET_TIER_LABEL[pet.tier]}] ${isActive ? '← AKTIF' : ''}`,
                        action: () => {
                            if (isActive) { showToast('Pet ini sudah aktif!'); return; }
                            if (p.activePet && PET_CATALOG[p.activePet]) removePetBonus(PET_CATALOG[p.activePet]);
                            p.activePet = petId;
                            applyPetBonus(pet);
                            updatePetHUD();
                            window.PET_FOLLOWER.initialized = false;
                            manualSave();
                            showDialogue(npc ? npc.name : '✨', `${pet.emoji} **${pet.name}** sekarang aktif & mengikutimu!\n\n${pet.bonusText} aktif!`, [{ text: 'Sip!', action: closeDialogue }], npc ? npc.imgSrc : null);
                        }
                    };
                }).filter(Boolean);
                opts.push({ text: '⬅ Kembali', action: npc ? () => openPetShop(npc) : closeDialogue });
                showDialogue('🔄 GANTI PET AKTIF', 'Pilih pet yang ingin diaktifkan:', opts, npc ? npc.imgSrc : null);
            }

            function showMyPets(npc) {
                const p = STATE.player;
                const myPets = p.pets || [];
                let desc = `Koleksi petmu (${myPets.length}):\n\n`;
                myPets.forEach(petId => {
                    const pet = PET_CATALOG[petId];
                    if (!pet) return;
                    const isActive = p.activePet === petId;
                    desc += `${isActive ? '⭐ ' : ''}${pet.emoji} **${pet.name}** [${PET_TIER_LABEL[pet.tier]}]\n  Bonus: ${pet.bonusText}${isActive ? ' ← AKTIF' : ''}\n\n`;
                });
                showDialogue('📖 KOLEKSI PET', desc, [
                    { text: '🔄 Ganti Pet', action: () => showPetSwitchMenu(npc) },
                    { text: '⬅ Kembali', action: npc ? () => openPetShop(npc) : closeDialogue }
                ], npc ? npc.imgSrc : null);
            }

            // --- APPLY / REMOVE PET BONUS ---
            function applyPetBonus(pet) {
                if (!pet || !pet.bonus) return;
                const p = STATE.player;
                if (pet.bonus.str) p.str += pet.bonus.str;
                if (pet.bonus.int) p.int += pet.bonus.int;
                if (pet.bonus.biz) p.biz += pet.bonus.biz;
                if (pet.bonus.reputation) p.reputation += pet.bonus.reputation;
                if (pet.bonus.hp) { p.maxHp = (p.maxHp || 100) + pet.bonus.hp; p.hp = Math.min(p.hp + pet.bonus.hp, p.maxHp); }
                updateHUDInfo();
                showToast(`✨ ${pet.emoji} ${pet.name} aktif! ${pet.bonusText}`);
            }

            function removePetBonus(pet) {
                if (!pet || !pet.bonus) return;
                const p = STATE.player;
                if (pet.bonus.str) p.str = Math.max(0, p.str - pet.bonus.str);
                if (pet.bonus.int) p.int = Math.max(0, p.int - pet.bonus.int);
                if (pet.bonus.biz) p.biz = Math.max(0, p.biz - pet.bonus.biz);
                if (pet.bonus.reputation) p.reputation = Math.max(0, p.reputation - pet.bonus.reputation);
                if (pet.bonus.hp) { p.maxHp = Math.max(10, (p.maxHp || 100) - pet.bonus.hp); p.hp = Math.min(p.hp, p.maxHp); }
                updateHUDInfo();
            }

            // --- UPDATE PET HUD (indikator kecil pojok layar) ---
            function updatePetHUD() {
                const p = STATE.player;
                const hud = document.getElementById('pet-hud-indicator');
                if (!hud) return;
                if (p.activePet && PET_CATALOG[p.activePet]) {
                    const pet = PET_CATALOG[p.activePet];
                    document.getElementById('pet-hud-emoji').textContent = pet.emoji;
                    document.getElementById('pet-hud-name').textContent = pet.name;
                } else {
                    // Tampilkan meski belum ada pet
                    document.getElementById('pet-hud-emoji').textContent = '🥚';
                    document.getElementById('pet-hud-name').textContent = 'Belum ada pet';
                }
                hud.classList.add('visible'); // Selalu tampil
            }

            // --- LEGENDARY PET BATTLE SYSTEM ---
            function startLegendaryPetBattle(npc) {
                const p = STATE.player;
                if (!p.activePet || !PET_CATALOG[p.activePet]) {
                    showDialogue(npc.name, 'Kamu belum punya pet aktif! Beli dulu.', [{ text: 'Oke', action: closeDialogue }], npc.imgSrc);
                    return;
                }
                const available = LEGENDARY_PET_IDS.filter(id => !(p.pets || []).includes(id));
                if (available.length === 0) {
                    showDialogue(npc.name, '✅ Kamu sudah mengalahkan semua Pet Legendaris! Luar biasa!', [{ text: 'Terima kasih!', action: closeDialogue }], npc.imgSrc);
                    return;
                }
                const enemyId = available[Math.floor(Math.random() * available.length)];
                const enemy = PET_CATALOG[enemyId];
                const myPet = PET_CATALOG[p.activePet];
                showDialogue(npc.name, `⚠️ **PET LEGENDARIS MUNCUL!**\n\n${enemy.emoji} **${enemy.name}** menantangmu!\n\nPetmu: **${myPet.emoji} ${myPet.name}**\nHP Enemy: **${enemy.hp}** | ATK: **${enemy.atk}**\n\nAlahkan dia untuk mendapatkannya!`, [
                    { text: '⚔️ MULAI BATTLE!', action: () => { closeDialogue(); initPetBattle(myPet, enemy, npc); } },
                    { text: '❌ Mundur', action: closeDialogue }
                ], npc.imgSrc);
            }

            function initPetBattle(myPet, enemyPet, npc) {
                PET_BATTLE_STATE = {
                    player: { ...myPet, currentHp: myPet.hp, maxHp: myPet.hp },
                    enemy: { ...enemyPet, currentHp: enemyPet.hp, maxHp: enemyPet.hp },
                    turn: 0, npc: npc, locked: false
                };
                document.getElementById('pb-player-emoji').textContent = myPet.emoji;
                document.getElementById('pb-player-name').textContent = myPet.name;
                document.getElementById('pb-player-hp-text').textContent = `${myPet.hp}/${myPet.hp}`;
                document.getElementById('pb-player-hp').style.width = '100%';
                document.getElementById('pb-enemy-emoji').textContent = enemyPet.emoji;
                document.getElementById('pb-enemy-name').textContent = enemyPet.name;
                document.getElementById('pb-enemy-hp-text').textContent = `${enemyPet.hp}/${enemyPet.hp}`;
                document.getElementById('pb-enemy-hp').style.width = '100%';
                document.getElementById('pb-log').textContent = `${myPet.emoji} ${myPet.name} VS ${enemyPet.emoji} ${enemyPet.name}!\nPilih seranganmu!`;
                document.getElementById('pet-battle-overlay').classList.add('active');
            }

            function petBattleAttack(type) {
                if (!PET_BATTLE_STATE || PET_BATTLE_STATE.locked) return;
                PET_BATTLE_STATE.locked = true;
                const bs = PET_BATTLE_STATE;
                const strBonus = Math.floor((STATE.player.str || 5) * 0.5);
                const myAtk = type === 'power'
                    ? Math.floor((bs.player.atk + strBonus) * 2 * (0.7 + Math.random() * 0.6))
                    : Math.floor((bs.player.atk + strBonus) * (0.8 + Math.random() * 0.4));
                const enAtk = Math.floor(bs.enemy.atk * (0.8 + Math.random() * 0.4));
                bs.enemy.currentHp = Math.max(0, bs.enemy.currentHp - myAtk);
                bs.player.currentHp = Math.max(0, bs.player.currentHp - enAtk);
                bs.turn++;
                const pPct = (bs.player.currentHp / bs.player.maxHp) * 100;
                const ePct = (bs.enemy.currentHp / bs.enemy.maxHp) * 100;
                document.getElementById('pb-player-hp').style.width = pPct + '%';
                document.getElementById('pb-enemy-hp').style.width = ePct + '%';
                document.getElementById('pb-player-hp-text').textContent = `${bs.player.currentHp}/${bs.player.maxHp}`;
                document.getElementById('pb-enemy-hp-text').textContent = `${bs.enemy.currentHp}/${bs.enemy.maxHp}`;
                const typeLabel = type === 'power' ? '💥 SERANG KUAT' : '⚔️ Serang';
                document.getElementById('pb-log').textContent = `Turn ${bs.turn}: ${typeLabel}\n${bs.player.emoji} ATK: -${myAtk} HP musuh\n${bs.enemy.emoji} ATK: -${enAtk} HP petmu`;
                setTimeout(() => {
                    if (bs.player.currentHp <= 0) petBattleEnd(false);
                    else if (bs.enemy.currentHp <= 0) petBattleEnd(true);
                    else PET_BATTLE_STATE.locked = false;
                }, 300);
            }

            function petBattleFlee() {
                document.getElementById('pet-battle-overlay').classList.remove('active');
                PET_BATTLE_STATE = null;
                showToast('Kamu melarikan diri dari pertarungan!');
            }

            function petBattleEnd(win) {
                const bs = PET_BATTLE_STATE;
                document.getElementById('pet-battle-overlay').classList.remove('active');
                if (win) {
                    const enemyPet = bs.enemy;
                    const p = STATE.player;
                    if (!p.pets) p.pets = [];
                    p.pets.push(enemyPet.id);
                    const npc = bs.npc;
                    PET_BATTLE_STATE = null;
                    setTimeout(() => {
                        showDialogue('🏆 KEMENANGAN!', `${enemyPet.emoji} **${enemyPet.name}** telah takluk!\n\nPet Legendaris bergabung bersamamu!\nBonus: **${enemyPet.bonusText}**\n\nAktifkan pet ini sekarang?`, [
                            {
                                text: `✅ Aktifkan ${enemyPet.emoji} ${enemyPet.name}`,
                                action: () => {
                                    if (p.activePet && PET_CATALOG[p.activePet]) removePetBonus(PET_CATALOG[p.activePet]);
                                    p.activePet = enemyPet.id;
                                    applyPetBonus(enemyPet);
                                    updatePetHUD();
                                    window.PET_FOLLOWER.initialized = false;
                                    manualSave();
                                    showDialogue(npc ? npc.name : '✨', `${enemyPet.emoji} **${enemyPet.name}** sekarang mengikutimu!\n${enemyPet.bonusText} aktif!`, [{ text: 'Mantap!', action: closeDialogue }], npc ? npc.imgSrc : null);
                                }
                            },
                            { text: 'Simpan dulu', action: () => { manualSave(); closeDialogue(); } }
                        ], null);
                    }, 500);
                } else {
                    PET_BATTLE_STATE = null;
                    setTimeout(() => {
                        showToast('Petmu kalah! Coba lagi setelah memulihkan kondisi.');
                        STATE.player.hp = Math.max(1, STATE.player.hp - 20);
                        updateHUDInfo();
                    }, 500);
                }
            }

            // =============================================
            // ===== END SISTEM PET =====
            // =============================================

            // --- UPDATE: BANK GOMBALAN & TIPE ---
            const GOMBALAN_BANK = [
                { text: "Bapak kamu maling ya? Soalnya kamu mencuri hatiku! 👮", type: "cheesy" },
                { text: "Kamu itu kayak Google. Segala yang kucari ada di kamu. 🌐", type: "cheesy" },
                { text: "Kopi ini pahit, tapi kalau liat kamu langsung jadi manis. ☕", type: "cheesy" },
                { text: "Jalan mundur yuk? Biar kita bisa liat masa lalu kita gak pernah pisah. 🚶", type: "funny" },
                { text: "Cintaku padamu kayak utang. Awalnya kecil, lama-lama gede! 💰", type: "funny" },
                { text: "Kamu berat gak? Soalnya kamu ada di pikiranku terus. 🧠", type: "funny" },
                { text: "Aku tidak butuh peta, karena tujuanku adalah hatimu. 🗺️", type: "romantic" },
                { text: "Jika rindu itu air, aku sudah tenggelam sekarang. 🌊", type: "romantic" },
                { text: "Di matamu, aku melihat masa depan yang indah. ✨", type: "romantic" },
                { text: "Kamu adalah notifikasi favoritku setiap hari. 📱", type: "modern" },
                { text: "Wifi di sini kenceng, tapi koneksi hati kita lebih kuat. 📶", type: "modern" },
                { text: "Ikan hiu makan tomat. I love you so much! 🦈", type: "pantun" }
            ];

            const COMMODITIES = [
                { id: 'gandum', name: 'Gandum', base: 2000, volatility: 0.3 },
                { id: 'beras', name: 'Beras', base: 1500, volatility: 0.25 },
                { id: 'jagung_panen', name: 'Jagung', base: 1200, volatility: 0.2 },
                { id: 'tomat_panen', name: 'Tomat', base: 800, volatility: 0.35 },
                { id: 'bunga_rafflesia', name: 'Rafflesia', base: 50000, volatility: 0.6 },
                { id: 'kain', name: 'Sutra', base: 8000, volatility: 0.5 },
                { id: 'permata', name: 'Berlian', base: 25000, volatility: 0.8 }
            ];

            function getDailyPrice(itemId, basePrice, vol) {
                const seed = (STATE.day * 13) + itemId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                const rand = Math.sin(seed);
                const change = Math.floor(basePrice * vol * rand);
                let finalPrice = basePrice + change;
                return Math.max(Math.floor(basePrice * 0.2), finalPrice);
            }

            // Input
            const keys = {};
            window.addEventListener('keydown', e => {
                keys[e.code] = true;
                if (e.code === 'Space' && STATE.fishing.active) {
                    checkFishing();
                }
            });
            window.addEventListener('keyup', e => keys[e.code] = false);

            // --- REVISI TOTAL: TOUCH TO MOVE SYSTEM (VISUAL FLOATING JOYSTICK) ---
            const inputState = {
                active: false,
                x: 0, // Vektor arah X (-1 s/d 1)
                y: 0  // Vektor arah Y (-1 s/d 1)
            };

            function initTouchControls() {
                const container = document.getElementById('game-container');
                const joystickBase = document.getElementById('virtual-joystick-base');
                const joystickStick = document.getElementById('virtual-joystick-stick');

                // Variabel untuk Floating Joystick
                let startX = 0;
                let startY = 0;
                const maxRadius = 50; // Jarak maksimal stick bisa digeser dari pusat (pixel)

                // Helper untuk reset joystick UI
                const hideJoystick = () => {
                    if (joystickBase) joystickBase.style.display = 'none';
                    inputState.active = false;
                    inputState.x = 0;
                    inputState.y = 0;
                };

                // 1. TOUCH EVENTS (HP/Tablet/IFP)
                container.addEventListener('touchstart', (e) => {
                    // Cek apakah yang disentuh adalah elemen UI (Tombol)?
                    if (e.target.closest('.action-btns') ||
                        e.target.closest('.hud-top') ||
                        e.target.id === 'hud-toggle-btn' ||
                        e.target.closest('.minigame-overlay') ||
                        e.target.closest('#dialogue-wrapper') ||
                        e.target.closest('#inventory-screen') ||
                        e.target.closest('#login-screen') ||
                        e.target.closest('#gender-screen') ||
                        e.target.closest('#game-over-screen') ||
                        e.target.closest('#audio-prompt') ||
                        /* FIX: Tambahkan Splash Screen ke pengecualian agar tombol start bisa diklik */
                        e.target.closest('#splash-screen') ||
                        e.target.closest('#teacher-dashboard') ||
                        /* FIX: TAMBAHKAN LEADERBOARD AGAR BISA SCROLL & KLIK DI HP */
                        e.target.closest('#leaderboard-overlay') ||
                        e.target.tagName === 'INPUT' ||
                        e.target.tagName === 'SELECT' ||
                        e.target.tagName === 'TEXTAREA' ||
                        e.target.closest('.journal-box')) {
                        return;
                    }

                    e.preventDefault();
                    const touch = e.touches[0];

                    // --- FLOATING JOYSTICK LOGIC ---
                    // 1. Set Pusat Joystick di posisi sentuhan awal
                    startX = touch.clientX;
                    startY = touch.clientY;

                    // 2. Tampilkan Visual Joystick di posisi tersebut
                    if (joystickBase) {
                        joystickBase.style.display = 'block';
                        joystickBase.style.left = startX + 'px';
                        joystickBase.style.top = startY + 'px';
                        // Reset stick ke tengah
                        joystickStick.style.transform = `translate(-50%, -50%)`;
                    }

                    inputState.active = true;
                    // Awal sentuh belum ada gerakan (0,0)
                    inputState.x = 0;
                    inputState.y = 0;

                }, { passive: false });

                container.addEventListener('touchmove', (e) => {
                    if (!inputState.active) return;
                    e.preventDefault();
                    const touch = e.touches[0];

                    // 1. Hitung Delta (Jarak dari pusat awal ke posisi jari sekarang)
                    const dx = touch.clientX - startX;
                    const dy = touch.clientY - startY;

                    // 2. Hitung Jarak & Sudut
                    const distance = Math.hypot(dx, dy);
                    const angle = Math.atan2(dy, dx);

                    // 3. Batasi Gerakan Visual Stick (Clamping)
                    const clampDist = Math.min(distance, maxRadius);
                    const stickX = Math.cos(angle) * clampDist;
                    const stickY = Math.sin(angle) * clampDist;

                    // Update Visual Stick
                    if (joystickStick) {
                        joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
                    }

                    // 4. Update Input State (Normalized Vector)
                    // Deadzone kecil (10px) agar karakter tidak gerak sendiri kalau jari goyang dikit
                    if (distance > 10) {
                        inputState.x = Math.cos(angle);
                        inputState.y = Math.sin(angle);
                    } else {
                        inputState.x = 0;
                        inputState.y = 0;
                    }

                }, { passive: false });

                const endTouch = (e) => {
                    hideJoystick();
                };

                container.addEventListener('touchend', endTouch);
                container.addEventListener('touchcancel', endTouch);

                // 2. MOUSE EVENTS (Untuk Testing di PC / Laptop Touchscreen)
                let isMouseDown = false;

                container.addEventListener('mousedown', (e) => {
                    if (e.target.closest('.action-btns') || e.target.closest('.hud-top')) return;

                    isMouseDown = true;
                    startX = e.clientX;
                    startY = e.clientY;

                    if (joystickBase) {
                        joystickBase.style.display = 'block';
                        joystickBase.style.left = startX + 'px';
                        joystickBase.style.top = startY + 'px';
                        joystickStick.style.transform = `translate(-50%, -50%)`;
                    }

                    inputState.active = true;
                    inputState.x = 0;
                    inputState.y = 0;
                });

                window.addEventListener('mousemove', (e) => {
                    if (!isMouseDown) return;

                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    const distance = Math.hypot(dx, dy);
                    const angle = Math.atan2(dy, dx);

                    const clampDist = Math.min(distance, maxRadius);
                    const stickX = Math.cos(angle) * clampDist;
                    const stickY = Math.sin(angle) * clampDist;

                    if (joystickStick) {
                        joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
                    }

                    if (distance > 5) {
                        inputState.x = Math.cos(angle);
                        inputState.y = Math.sin(angle);
                    }
                });

                window.addEventListener('mouseup', () => {
                    isMouseDown = false;
                    hideJoystick();
                });
            }


            // ═══════════════════════════════════════════════════════════════
            // FAIRY VILLAGE MAP — Terintegrasi ke sistem maps utama
            // Ukuran disesuaikan FW=60, FH=40 (sama dengan konstanta global fairy village)
            // ═══════════════════════════════════════════════════════════════
            (function initFairyVillageMap() {
                const FW = 60, FH = 40;
                // Tile 20 = Lantai Peri (semua tile adalah lantai, TANPA border wall)
                const tiles = new Array(FW * FH).fill(20);
                // Tidak ada border/tembok — peta terbuka luas

                // NPC: Rara Wilis di posisi atas tengah, Pohon Energi di bawah tengah
                maps['fairyVillage'] = {
                    w: FW, h: FH,
                    tiles: tiles,
                    buildings: [],
                    objects: [],
                    npcs: [
                        {
                            id: 'rara_wilis',
                            name: 'Rara Wilis',
                            x: 28, y: 17,
                            w: 38, h: 58,
                            imgSrc: 'images/rarawilis.png',
                            sprite: 'images/rarawilis.png',
                            type: 'fairy_npc',
                            schedule: 'always',
                            dialogFn: 'openRaraWilisDialog',
                            solid: true
                        },
                        {
                            id: 'pohon_energi',
                            name: 'Pohon Energi',
                            x: 21, y: 24,
                            w: 38, h: 58,
                            imgSrc: 'images/pohonperi.png',
                            sprite: 'images/pohonperi.png',
                            type: 'static',
                            schedule: 'always',
                            dialogFn: 'collectFairyDust',
                            solid: true
                        },
                        {
                            id: 'fv_wening',
                            name: 'Wening',
                            x: 11, y: 8,
                            w: 38, h: 58,
                            imgSrc: 'images/wening.png',
                            sprite: 'images/wening.png',
                            type: 'wander', vx: 0.3, vy: 0.15,
                            schedule: 'always', noNameTag: true,
                            solid: true
                        },
                        {
                            id: 'fv_sekar',
                            name: 'Sekar',
                            x: 34, y: 6,
                            w: 38, h: 58,
                            imgSrc: 'images/sekar.png',
                            sprite: 'images/sekar.png',
                            type: 'wander', vx: -0.3, vy: 0.15,
                            schedule: 'always', noNameTag: true,
                            solid: true
                        },
                        {
                            id: 'fv_bening',
                            name: 'Bening',
                            x: 41, y: 2,
                            w: 38, h: 58,
                            imgSrc: 'images/bening.png',
                            sprite: 'images/bening.png',
                            type: 'wander', vx: 0.0, vy: 0.2,
                            schedule: 'always', noNameTag: true,
                            solid: true
                        },
                        {
                            id: 'fv_juna',
                            name: 'Juna',
                            x: 22, y: 14,
                            w: 38, h: 58,
                            imgSrc: 'images/juna.png',
                            sprite: 'images/juna.png',
                            type: 'wander', vx: 0.25, vy: 0.25,
                            schedule: 'always', noNameTag: true,
                            solid: true
                        }
                    ]
                };

                // Bangunan sebagai kolider solid dinamis — di-refresh saat openFairyVillage
            })();

            // Panggil inisialisasi Kontrol Baru
            initTouchControls();

            // FIX: Pastikan tombol aksi tidak memicu gerakan
            const btnAction = document.getElementById('btn-action');
            const uiButtons = document.querySelectorAll('.action-btns div, button');

            uiButtons.forEach(btn => {
                // Stop propagation agar sentuhan di tombol tidak tembus ke container game
                btn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
                btn.addEventListener('mousedown', (e) => e.stopPropagation());
            });

            // --- NEW: SKILL BUTTON LISTENER (ULTIMATE) ---
            const btnSkill = document.getElementById('btn-skill');
            if (btnSkill) {
                btnSkill.addEventListener('touchstart', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    handleSkill();
                }, { passive: false });

                btnSkill.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleSkill();
                });
            }

            btnAction.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation(); // PENTING
                if (STATE.fishing.active) checkFishing();
                else handleAction();
            });
            btnAction.addEventListener('click', (e) => {
                e.stopPropagation(); // PENTING
                if (STATE.fishing.active) checkFishing();
                else handleAction();
            });

            function randomizeWeather() {
                STATE.weather = 'clear';
                const rand = Math.random();

                if (STATE.season === 'spring') {
                    if (rand < 0.3) STATE.weather = 'rain';
                    else if (rand < 0.6) STATE.weather = 'sakura';
                } else if (STATE.season === 'summer') {
                    if (rand < 0.25) STATE.weather = 'rain';
                } else if (STATE.season === 'autumn') {
                    if (rand < 0.35) STATE.weather = 'rain';
                    else if (rand < 0.75) STATE.weather = 'fall_leaves';
                } else if (STATE.season === 'winter') {
                    if (rand < 0.6) STATE.weather = 'snow';
                }
                console.log(`Weather updated: ${STATE.weather} (Season: ${STATE.season})`);
            }

            // --- FUNCTION TO REGENERATE HOUSE MAP BASED ON LEVEL ---
            function regenerateHouseMap() {
                try {
                    const level = STATE.player.houseLevel || 1;
                    let w, h;

                    // Perhitungan Ukuran sesuai permintaan (Tile Size = 30px)
                    switch (level) {
                        case 1: w = 12; h = 10; break;
                        case 2: w = 15; h = 12; break;
                        case 3: w = 18; h = 14; break;
                        case 4: w = 22; h = 16; break;
                        case 5: w = 26; h = 20; break;
                        default: w = 12; h = 10; break;
                    }

                    // Generate Tiles
                    const tiles = new Array(w * h).fill(10); // 10 = Wood Floor

                    // Create Walls
                    for (let x = 0; x < w; x++) {
                        tiles[x] = 13; // Top Wall
                        tiles[(h - 1) * w + x] = 13; // Bottom Wall
                    }
                    for (let y = 0; y < h; y++) {
                        tiles[y * w] = 11; // Left Wall
                        tiles[y * w + (w - 1)] = 11; // Right Wall
                    }

                    // Door Position
                    const doorX = Math.floor(w / 2);
                    const doorY = h - 1;
                    tiles[doorY * w + doorX] = 8;

                    // Update Global Map Object
                    maps['house'] = {
                        w: w, h: h, tiles: tiles, npcs: [],
                        buildings: [
                            { id: 'house_exit', x: doorX - 1, y: doorY, w: 3, h: 1, type: 'trigger', entrance: { x: doorX, y: doorY }, name: "Keluar Rumah" }
                        ],
                        objects: (() => {
                            const baseObjs = [
                                { x: 1, y: 0, w: 2, h: 3, type: 'bed', icon: '🛏️', img: 'images/bed.png', name: "Kasur Empuk" },
                                { x: 4, y: 0, w: 2, h: 2, type: 'diary', icon: '📔', img: 'images/mejabelajar.png', name: "Meja Jurnal" },
                                { x: 7, y: 0, w: 2, h: 3, type: 'shelf', icon: '👗', text: "Lemari Pakaian", img: 'images/lemari.png' },
                                { x: w - 2, y: 0, type: 'calendar', icon: '📅', img: 'images/kalender.png' },
                                { x: 2, y: 6, w: 2, h: 2, type: 'catalog', icon: '☎️', img: 'images/mejatelpon.png', name: "Meja Telepon" },
                                { x: 9, y: 0, w: 1, h: 1, type: 'bookshelf', icon: '🏺', text: "Vas Bunga Merah", img: 'images/vasmerah.png' },
                                // 🧹 PAPAN AKTIVITAS RUMAH — selalu bisa diakses untuk masak/bersih/dll
                                { x: 1, y: 5, w: 1, h: 1, type: 'chores', icon: '🧹',
                                  name: "Papan Aktivitas", text: "Tekan untuk membuka menu aktivitas rumah tangga (masak, bersih-bersih, cuci baju, rawat kebun)." }
                            ];
                            if (level >= 3) {
                                baseObjs.push({
                                    x: w - 4, y: 2, w: 3, h: 3,
                                    type: 'kitchen',
                                    icon: '🍳',
                                    img: 'images/dapurayaayu.png',
                                    name: level >= 5 ? "Dapur Mewah 🍽️" : "Dapur"
                                });
                            }
                            return baseObjs;
                        })()
                    };

                    // --- UPDATE: SPAWN PASANGAN DI RUMAH JIKA MENIKAH ---
                    if (STATE.player.married && STATE.player.spouseId) {
                        // --- NEW: CEK APAKAH PASANGAN SEDANG KERJA? (KHUSUS ROLE FAMILY) ---
                        if (STATE.player.role === 'family' && STATE.player.spouseWorkStatus === 'working') {
                            // Spouse is away working (Jangan spawn)
                        } else {
                            const sid = STATE.player.spouseId;
                            let sName = "Pasangan";
                            let sImg = "images/lover1girl.png";

                            if (sid === 'lover1girl') { sName = "Ayu"; sImg = "images/lover1girl.png"; }
                            else if (sid === 'lover2girl') { sName = "Putri"; sImg = "images/lover2girl.png"; }
                            else if (sid === 'lover1boy') { sName = "Dr. Budi"; sImg = "images/lover1boy.png"; }
                            else if (sid === 'lover2boy') { sName = "Satria"; sImg = "images/lover2boy.png"; }

                            maps['house'].npcs.push({
                                id: sid,
                                x: Math.floor(w / 2) + 2,
                                y: Math.floor(h / 2),
                                name: sName,
                                imgSrc: sImg,
                                type: 'wander',
                                schedule: 'always',
                                w: 40, h: 60,
                                vx: 0, vy: 0
                            });
                        }
                    } // <--- FIX: KURUNG KURAWAL INI SEBELUMNYA HILANG

                    console.log(`House Map Regenerated: ${w}x${h}`);
                } catch (e) {
                    console.error("Error regenerating house map:", e);
                }
            }

            // UPDATE: INIT GAME MENJADI ASYNC UNTUK MEMASTIKAN KONEKSI
            async function initGame() {
                try {
                    // ─────────────────────────────────────────────────────────
                    // FIX BLANK SCREEN: Tampilkan canvas SEBELUM resize().
                    // Jika canvas masih display:none (sisa logout), resize() akan
                    // menghasilkan canvas 0×0 → game blank.
                    // ─────────────────────────────────────────────────────────
                    const gcCanvas = document.getElementById('gameCanvas');
                    if (gcCanvas) gcCanvas.style.display = 'block';

                    resize();
                    await DataService.init(true);

                    // Sembunyikan semua layar overlay
                    document.getElementById('start-screen').classList.add('hidden');
                    ['login-screen','title-screen','prologue-screen','gender-screen'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) { el.style.display = 'none'; el.classList.add('hidden'); }
                    });

                    // Pastikan ui-layer tampil
                    const uiLayer = document.getElementById('ui-layer');
                    if (uiLayer) { uiLayer.style.display = 'flex'; uiLayer.classList.remove('hidden'); }

                    AudioService.stopBGM();

                    // FIX: Cancel game loop lama agar tidak ada dua loop berjalan bersamaan
                    if (window.gameLoopId) {
                        cancelAnimationFrame(window.gameLoopId);
                        window.gameLoopId = null;
                    }
                    if (window.saveIntervalId) {
                        clearInterval(window.saveIntervalId);
                        window.saveIntervalId = null;
                    }
                    // Beri jeda kecil agar frame lama benar-benar selesai sebelum loop baru dimulai
                    await new Promise(r => setTimeout(r, 50));

                    // ─────────────────────────────────────────────────────────
                    // FIX LOGIN ULANG: Re-fetch saveData dari Firestore jika
                    // DataService.user.saveData kosong (terjadi setelah logout
                    // lalu login lagi tanpa reload halaman).
                    // Tanpa ini, loadGame() return null → game blank.
                    // ─────────────────────────────────────────────────────────
                    if (DataService.user && !DataService.user.saveData) {
                        // Coba ambil dari localStorage dulu (lebih cepat)
                        const dbLocal = DataService.getDB();
                        const localEntry = dbLocal[DataService.user.email];
                        if (localEntry && localEntry.saveData) {
                            DataService.user = { ...DataService.user, ...localEntry };
                            console.log('[initGame] saveData dipulihkan dari localStorage.');
                        } else if (DataService.mode === 'firebase' && typeof db !== 'undefined' && db) {
                            // Fallback: ambil dari Firestore
                            try {
                                console.log('[initGame] Fetching saveData dari Firestore...');
                                const docSnap = await db
                                    .collection('artifacts')
                                    .doc('nusantara-arsa')
                                    .collection('users')
                                    .doc(DataService.user.email)
                                    .get();
                                if (docSnap.exists) {
                                    const cloudData = docSnap.data();
                                    DataService.user = { ...DataService.user, ...cloudData };
                                    // Simpan ke localStorage agar fetch berikutnya lebih cepat
                                    const dbLocal2 = DataService.getDB();
                                    dbLocal2[DataService.user.email] = {
                                        ...(dbLocal2[DataService.user.email] || {}),
                                        ...cloudData
                                    };
                                    DataService.saveDB(dbLocal2);
                                    console.log('[initGame] saveData berhasil di-fetch dari Firestore.');
                                }
                            } catch (fetchErr) {
                                console.warn('[initGame] Fetch Firestore gagal, lanjut dengan data kosong:', fetchErr);
                            }
                        }
                    }

                    const saved = DataService.loadGame();
                    if (saved) {
                        STATE.day = parseInt(saved.day) || 1;
                        STATE.time = saved.time !== undefined ? saved.time : 600;
                        STATE.season = saved.season || 'spring';
                        STATE.weather = saved.weather || 'clear';

                        STATE.player.hp = saved.hp !== undefined ? saved.hp : 100;
                        STATE.player.maxHp = saved.maxHp || 100;
                        STATE.player.energy = saved.energy !== undefined ? saved.energy : 100;
                        STATE.player.money = saved.money !== undefined ? saved.money : 10000;
                        STATE.player.level = saved.level || 1;
                        STATE.player.exp = saved.exp || 0;

                        STATE.player.str = saved.str || 5;
                        STATE.player.int = saved.int || 5;
                        STATE.player.biz = saved.biz || 0;
                        STATE.player.reputation = saved.reputation || 0;
                        STATE.player.ethics = saved.ethics || 100;

                        STATE.player.role = saved.role || 'none';
                        STATE.player.major = saved.major || null;
                        STATE.player.scholarship = saved.scholarship || false;
                        STATE.player.jobStatus = saved.jobStatus || 'unemployed';
                        STATE.player.bossReputation = saved.bossReputation || 50;
                        STATE.player.jobLevel = saved.jobLevel || 1;

                        STATE.player.shiftStarted = saved.shiftStarted || false;
                        STATE.player.salaryDays = saved.salaryDays || 0;
                        STATE.player.lastAttendanceDay = saved.lastAttendanceDay || 0;

                        // LOAD JOB DISCOVERY
                        STATE.player.knownJobs = saved.knownJobs || [];
                        STATE.player.jobSearchCount = saved.jobSearchCount || 0;
                        STATE.player.lastJobSearchDay = saved.lastJobSearchDay || 0;

                        // LOAD PART-TIME STATE
                        STATE.player.partTimeJob = saved.partTimeJob || null;
                        STATE.player.partTimeStatus = saved.partTimeStatus || 'none';
                        STATE.player.partTimeShiftStarted = saved.partTimeShiftStarted || false;
                        STATE.player.partTimeLastWorkedDay = saved.partTimeLastWorkedDay || 0;
                        STATE.player.partTimeSalaryDays = saved.partTimeSalaryDays || 0;
                        STATE.player.todayConflict = saved.todayConflict || null;
                        STATE.player.lastRepThreshDay = saved.lastRepThreshDay || null;
                        STATE.player.shownStudentConflicts = saved.shownStudentConflicts || [];
                        STATE.player.shownEntrepreneurConflicts = saved.shownEntrepreneurConflicts || [];

                        if (STATE.day === 1 && STATE.player.role === 'none') {
                            STATE.isPrologue = true;
                            STATE.time = 600;
                        } else {
                            STATE.isPrologue = saved.isPrologue !== undefined ? saved.isPrologue : false;
                        }

                        STATE.player.inventory = saved.inventory || {};
                        STATE.player.furniture = saved.furniture || [];
                        STATE.player.houseLevel = saved.houseLevel || 1;
                        STATE.player.hiredDwarf = saved.hiredDwarf || false;
                        STATE.player.hiredFairy = saved.hiredFairy || false;

                        // --- LOAD DATA PET ---
                        STATE.player.pets = saved.pets || [];
                        STATE.player.activePet = saved.activePet || null;
                        // Load gift year flags agar tidak bisa ambil hadiah berkali-kali
                        STATE.player.lastHarvestGiftYear = saved.lastHarvestGiftYear || 0;
                        STATE.player.lastGrapeGiftYear = saved.lastGrapeGiftYear || 0;
                        STATE.player.lastResolutionYear = saved.lastResolutionYear || 0;

                        STATE.player.relationships = saved.relationships || {};
                        STATE.player.married = saved.married || false;
                        STATE.player.spouseId = saved.spouseId || null;
                        STATE.player.modinVisited = saved.modinVisited || false;
                        STATE.player.divorced = saved.divorced || false;

                        STATE.player.activeQuest = saved.activeQuest || null;
                        STATE.questProgress = saved.questProgress || {};
                        STATE.dungeonLevel = saved.dungeonLevel || 1;

                        STATE.player.lastDailyClaim = saved.lastDailyClaim || 0;
                        STATE.player.lastWeeklyClaim = saved.lastWeeklyClaim || 0;
                        STATE.player.lastMonthlyClaim = saved.lastMonthlyClaim || 0;
                        STATE.player.claimedLifeTrial = saved.claimedLifeTrial || false;

                        STATE.player.learnedSubjects = saved.learnedSubjects || [];
                        STATE.player.achievementPoints = saved.achievementPoints || 0;
                        STATE.player.portfolioItems = saved.portfolioItems || [];

                        STATE.player.hasSeenDungeonTutorial = saved.hasSeenDungeonTutorial || false;
                        STATE.player.hasSeenFishingTutorial = saved.hasSeenFishingTutorial || false;

                        // --- FIX: Syntax Error Diperbaiki (Menggunakan Assignment =) ---
                        STATE.player.dailyFishingCount = saved.dailyFishingCount || 0;
                        STATE.player.dailyMonsterKills = saved.dailyMonsterKills || 0;
                        STATE.player.dailyTalkCount = saved.dailyTalkCount || 0;
                        STATE.player.dailyHarvestCount = saved.dailyHarvestCount || 0;
                        // NPC LAST TALK DAY
                        STATE.player.npcLastTalkDay = saved.npcLastTalkDay || {};
                        // TOTAL LIFETIME COUNTERS (untuk Milestone Quest Tahunan)
                        STATE.player.totalFishingCount  = saved.totalFishingCount  || 0;
                        STATE.player.totalMonsterKills  = saved.totalMonsterKills  || 0;
                        STATE.player.totalSellCount     = saved.totalSellCount     || 0;
                        // MILESTONE CLAIMS
                        STATE.player.claimedYear1 = saved.claimedYear1 || false;
                        STATE.player.claimedYear2 = saved.claimedYear2 || false;
                        STATE.player.claimedYear3 = saved.claimedYear3 || false;
                        STATE.player.claimedYear4 = saved.claimedYear4 || false;
                        STATE.player.claimedYear5 = saved.claimedYear5 || false;
                        STATE.player.honorTitle   = saved.honorTitle   || null;

                        // --- FIX: Syntax Error Diperbaiki ---
                        STATE.player.spouseWorkStatus = saved.spouseWorkStatus || 'home';
                        STATE.player.homeRole = saved.homeRole || 'homemaker'; // 'homemaker' = urus RT, 'worker' = kerja luar
                        STATE.player.spouseAngry = saved.spouseAngry || false;
                        // Load marriage conflict system
                        STATE.player.marriedDay = saved.marriedDay || 0;
                        STATE.player.marriageMonth = saved.marriageMonth || 1;
                        STATE.player.marriageConflictLevel = saved.marriageConflictLevel || 0;
                        STATE.player.lastConflictDay = saved.lastConflictDay || 0;
                        STATE.player.monthlyExpenses = saved.monthlyExpenses || 0;
                        STATE.player.lastMarriageBillDay = saved.lastMarriageBillDay || 0;

                        // --- RESTORE BIRTHDAY & SOCIAL REWARD FLAGS ---
                        // Semua key yang berawalan 'birthdayGifted_' dan 'socialRewarded_' disimpan dinamis
                        Object.keys(saved).forEach(key => {
                            if (key.startsWith('birthdayGifted_') || key.startsWith('socialRewarded_')) {
                                STATE.player[key] = saved[key];
                            }
                        });

                        // --- SYNC STATUS KERJA PASANGAN DENGAN WAKTU SAAT LOAD ---
                        if (STATE.player.married && STATE.player.role === 'family') {
                            if (STATE.time >= 730 && STATE.time < 1600) {
                                STATE.player.spouseWorkStatus = 'working';
                            } else {
                                STATE.player.spouseWorkStatus = 'home';
                            }
                        }

                        STATE.viral = saved.viral || { active: null, day: 0 };

                        STATE.player.attackCooldown = 0;
                        STATE.player.isAttacking = false;

                        const genderToLoad = saved.gender || 'boy';
                        selectGender(genderToLoad, true);

                        // Load Outfit
                        STATE.player.outfit = saved.outfit || 'default';
                        if (STATE.player.outfit !== 'default') {
                            let suffix = "";
                            if (STATE.player.outfit === 'wedding') suffix = "-weding";
                            else if (STATE.player.outfit === 'armor') suffix = "-armor";
                            else if (STATE.player.outfit === 'special') suffix = "-special";
                            else if (STATE.player.outfit === 'gempita') suffix = "-special"; // fallback ke special

                            const p = STATE.player;
                            const g = genderToLoad;
                            if (p.spriteIdle) p.spriteIdle.src = `images/${g}-idle${suffix}.png`;
                            if (p.spriteWalk) p.spriteWalk.src = `images/${g}-walk${suffix}.png`;
                            if (p.spriteWalkUp) p.spriteWalkUp.src = `images/${g}-atas${suffix}.png`;
                            if (p.spriteWalkDown) p.spriteWalkDown.src = `images/${g}-bawah${suffix}.png`;
                            if (p.spriteAttack) p.spriteAttack.src = `images/${g}-pukul${suffix}.png`;
                        }

                        if (!saved.weather) randomizeWeather();

                        showToast("System: Data Loaded Completely");
                    } else {
                        if (!STATE.player.spriteIdle) selectGender('boy', true);
                        STATE.isPrologue = true;
                        STATE.gameOverTriggered = false;
                        STATE.gameFinished = false;
                        STATE.freeRoamMode = false;
                        STATE.day = 1;
                        STATE.time = 600;
                        STATE.player.role = 'none';
                        STATE.player.money = 10000;
                        randomizeWeather();
                    }

                    if (DataService.user && DataService.user.role === 'siswa') {
                        DataService.startMessageListener();
                        DataService.startGhostListener();
                        if (DataService.user.mentor) {
                            const realMentorName = await DataService.getMentorName(DataService.user.mentor);
                            STATE.mentorName = realMentorName;
                        }
                    }

                    regenerateHouseMap();
                    updateBagIcon();
                    // Show house level HUD indicator when inside house
                    updateHouseLevelHUD();
                    updatePetHUD(); // Tampilkan pet HUD jika ada pet aktif

                    try {
                        if (document.documentElement.requestFullscreen) {
                            document.documentElement.requestFullscreen().catch((e) => { });
                        }
                    } catch (e) { }

                    STATE.screen = 'play';
                    STATE.location = 'house';

                    // Tampilkan minimap & pet HUD hanya saat ingame
                    const minimapEl = document.getElementById('minimap-container');
                    if (minimapEl) minimapEl.classList.add('ingame');
                    const petHudEl = document.getElementById('pet-hud-indicator');
                    if (petHudEl) petHudEl.classList.add('visible');
                    setTimeout(() => updateMentorBubble(), 500); // Init bubble mentor

                    const hMap = maps['house'];
                    if (hMap) {
                        STATE.player.x = Math.floor(hMap.w / 2) * TILE_SIZE;
                        STATE.player.y = (hMap.h - 3) * TILE_SIZE;
                    } else {
                        STATE.player.x = 100; STATE.player.y = 100;
                    }

                    setTimeout(resize, 100);
                    setTimeout(resize, 500);
                    setTimeout(resize, 1500);

                    gameLoop();

                    ['village', 'mentor_interior'].forEach(mapName => {
                        const map = maps[mapName];
                        if (map && map.npcs) {
                            const mentorNPC = map.npcs.find(n => n.id === 'mentor');
                            if (mentorNPC) {
                                mentorNPC.name = STATE.mentorName;
                            }
                        }
                    });

                    if (STATE.isPrologue) {
                        if (hMap) {
                            STATE.player.x = Math.floor(hMap.w / 2) * TILE_SIZE;
                            STATE.player.y = 4 * TILE_SIZE;
                        }
                        setTimeout(() => startWakeUpSequence(), 1500);
                    } else {
                        setTimeout(() => showDailyQuestPopup(), 1000);
                        updateHUDInfo();
                    }

                    window.saveIntervalId = setInterval(() => {
                        if (STATE.screen === 'play') {
                            manualSave();
                            // Autosave indicator: flash ikon kecil di HUD
                            const ind = document.getElementById('autosave-indicator');
                            if (ind) {
                                ind.style.opacity = '1';
                                setTimeout(() => { ind.style.opacity = '0'; }, 1200);
                            }
                        }
                    }, 15000); // Autosave tiap 15 detik

                    // Simpan saat tab/browser ditutup atau refresh
                    window.onbeforeunload = () => {
                        if (STATE.screen === 'play') {
                            manualSave();
                        }
                    };

                } catch (err) {
                    console.error("CRITICAL ERROR IN INITGAME:", err);
                    alert("Terjadi kesalahan saat memuat game. Coba refresh halaman.\nError: " + err.message);
                }
            }

            // --- NEW: TUTORIAL HELPER FUNCTIONS ---
            function updateHouseLevelHUD() {
                let el = document.getElementById('house-level-hud');
                if (!el) {
                    el = document.createElement('div');
                    el.id = 'house-level-hud';
                    el.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,0.82);color:#fbbf24;font-family:Fredoka,sans-serif;font-size:13px;padding:4px 16px;border-radius:20px;border:1.5px solid #fbbf24;pointer-events:none;z-index:500;display:none;letter-spacing:0.5px;';
                    document.getElementById('game-container').appendChild(el);
                }
                if (STATE.location === 'house') {
                    const hl = STATE.player.houseLevel || 1;
                    const icons = ['🪵','🏡','🏠','🏰','🏯'];
                    el.innerText = `${icons[hl-1]} Rumah Level ${hl}`;
                    el.style.display = 'block';
                    setTimeout(() => { if (el) el.style.display = 'none'; }, 3000);
                } else {
                    el.style.display = 'none';
                }
            }

            function showTutorialFocus(elementId, labelText = null) {
                // 1. Hapus highlight lama
                document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));

                // Pastikan tidak ada target in-game yang aktif agar tidak konflik
                STATE.tutorialFocusTarget = null;

                const target = document.getElementById(elementId);
                const pointer = document.getElementById('tutorial-pointer');
                const label = document.getElementById('pointer-label');

                if (target && pointer) {
                    // 2. Tambah efek highlight ke target
                    target.classList.add('tutorial-highlight');

                    // UPDATE: Set Teks Label (atau sembunyikan jika null)
                    if (label) {
                        if (labelText) {
                            label.innerText = labelText;
                            label.style.display = 'block';
                        } else {
                            label.style.display = 'none';
                        }
                    }

                    // 3. Pindahkan Tangan Penunjuk
                    const rect = target.getBoundingClientRect();
                    // Hitung posisi tengah elemen
                    const centerX = rect.left + (rect.width / 2);
                    const centerY = rect.top + (rect.height / 2);

                    // Reset transform scale ke normal (1) untuk elemen UI
                    pointer.style.transform = "scale(1)";

                    // Atur posisi tangan (sedikit di bawah elemen)
                    // UPDATE: Offset disesuaikan karena ada teks label di atas tangan
                    pointer.style.left = (centerX - 35) + 'px'; // Center horizontal (width ~70px)
                    pointer.style.top = (centerY + 30) + 'px';  // Di bawah elemen

                    pointer.style.display = 'flex'; // Ganti block jadi flex
                }
            }

            // --- NEW HELPER: FOKUS KE OBJEK DALAM GAME (CANVAS) ---
            function showInGameFocus(tileX, tileY, labelText = null) {
                // 1. Hapus highlight UI lama
                document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));

                const pointer = document.getElementById('tutorial-pointer');
                const label = document.getElementById('pointer-label');

                if (pointer) {
                    // 2. Set State Target agar di-update terus menerus di Game Loop
                    STATE.tutorialFocusTarget = { x: tileX, y: tileY };

                    // UPDATE: Set Teks Label
                    if (label) {
                        if (labelText) {
                            label.innerText = labelText;
                            label.style.display = 'block';
                        } else {
                            label.style.display = 'none';
                        }
                    }

                    pointer.style.display = 'flex'; // Ganti block jadi flex

                    // 3. Panggil update sekali secara manual agar langsung muncul di posisi awal (mencegah flicker)
                    updateTutorialPointerPosition();
                }
            }

            function clearTutorialFocus() {
                document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
                const pointer = document.getElementById('tutorial-pointer');
                if (pointer) pointer.style.display = 'none';

                // Reset Target Live Tracking
                STATE.tutorialFocusTarget = null;

                // Kembalikan tombol aksi ke state normal
                const btn = document.getElementById('btn-action');
                if (btn) btn.style.animation = '';
            }

            // --- NEW FUNCTION: UPDATE POSISI POINTER (DIPANGGIL TIAP FRAME) ---
            function updateTutorialPointerPosition() {
                if (!STATE.tutorialFocusTarget) return;

                const pointer = document.getElementById('tutorial-pointer');
                if (!pointer) return;

                // 1. Hitung Scale Factor Real-time
                const scaleFactor = canvas.width / GAME_WIDTH;

                // 2. Ambil Target Tile dari State
                const tileX = STATE.tutorialFocusTarget.x;
                const tileY = STATE.tutorialFocusTarget.y;

                // 3. Hitung Posisi Dunia (Tengah Tile)
                const worldX = (tileX * TILE_SIZE) + (TILE_SIZE / 2);
                const worldY = (tileY * TILE_SIZE) + (TILE_SIZE / 2);

                // 4. Proyeksikan ke Layar (Dikurangi Kamera Saat Ini)
                // FIX: Menggunakan STATE.camera yang selalu update
                const screenX = (worldX - STATE.camera.x) * scaleFactor;
                const screenY = (worldY - STATE.camera.y) * scaleFactor;

                // 5. Update Posisi DOM Element
                // UPDATE: Penyesuaian Offset dan Scale agar pas dengan Zoom Out

                // Offset horizontal (tengah pointer structure)
                // Structure width sekitar 80px (label + padding), jadi offset -40px
                const xOffset = -40;

                // Offset vertikal dinamis (menyesuaikan scale)
                // Semakin kecil scale (zoom out), jarak offset harus disesuaikan agar tidak terlalu jauh
                // Posisi di ATAS tile (karena telunjuk ke bawah/atas) atau DI BAWAH?
                // Icon 👆 menunjuk ke ATAS. Jadi pointer harus ditaruh DI BAWAH target.
                const yOffset = 15 * scaleFactor;

                pointer.style.left = (screenX + xOffset) + 'px';
                pointer.style.top = (screenY + yOffset) + 'px';

                // UPDATE: Skala Ukuran Pointer
                // Agar pointer tidak terlihat raksasa saat kamera zoom out jauh
                // Base scale 1.0, dikalikan faktor zoom dengan clamping
                let dynamicScale = scaleFactor * 0.45;
                // Batasi minimal 0.7 dan maksimal 1.1
                dynamicScale = Math.max(0.7, Math.min(1.1, dynamicScale));

                pointer.style.transform = `scale(${dynamicScale})`;
            }

            function resetInputs() {
                // Reset Keyboard
                Object.keys(keys).forEach(key => keys[key] = false);
                // Reset Touch Joystick
                inputState.active = false;
                inputState.x = 0;
                inputState.y = 0;
            }

            function startWakeUpSequence() {
                // FIX: Kunci pintu saat tutorial dimulai
                STATE.tutorialIndoorComplete = false;

                showToast("🔊 *TOK TOK TOK*");
                if (typeof AudioService !== 'undefined') AudioService.playSFX('knock'); // Play SFX Ketukan
                setTimeout(() => {
                    // UPDATE: Ganti "???" dengan nama mentor dinamis jika perlu, atau biarkan misterius
                    showDialogue("???", "Halo? Nak? Kamu sudah bangun? Hari ini hari pertamamu!", [
                        {
                            text: "(Bangun dari tempat tidur)",
                            action: () => {
                                closeDialogue();

                                // --- START VISUAL TUTORIAL ---
                                setTimeout(() => {
                                    const targetX = 6;
                                    const targetY = 5;

                                    showDialogue("🎮 GERAK",
                                        "📱 HP/Tablet: Geser jari (Joystick)\n💻 PC: WASD atau Tombol Panah\n\n➡️ Jalan ke titik yang ditunjuk!",
                                        [{
                                            text: "Siap! ▶",
                                            action: () => {
                                                closeDialogue();
                                                showInGameFocus(targetX, targetY, "JALAN KESINI 🏃");
                                                showToast("BERJALANLAH KE ARAH TANGAN 👆");

                                                const checkTargetInterval = setInterval(() => {
                                                    const pX = STATE.player.x + (STATE.player.w / 2);
                                                    const pY = STATE.player.y + (STATE.player.h / 2);
                                                    const tX = (targetX * TILE_SIZE) + (TILE_SIZE / 2);
                                                    const tY = (targetY * TILE_SIZE) + (TILE_SIZE / 2);
                                                    const dist = Math.hypot(pX - tX, pY - tY);

                                                    if (dist < 40) {
                                                        clearInterval(checkTargetInterval);
                                                        clearTutorialFocus();
                                                        showToast("BAGUS! ✅");
                                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                                        createParticle(pX, pY, '#4ade80');
                                                        setTimeout(() => {
                                                            resetInputs();
                                                            continueTutorialStep2();
                                                        }, 800);
                                                    }
                                                    if (STATE.screen !== 'play') clearInterval(checkTargetInterval);
                                                }, 200);
                                            }
                                        }]);
                                }, 500);
                            }
                        }
                    ], null);
                }, 1500);
            }

            // TUTORIAL STEP 2 ONWARDS
            function continueTutorialStep2() {
                // STEP 2: TOMBOL AKSI
                const btnAction = document.getElementById('btn-action');
                btnAction.style.display = 'flex';
                btnAction.innerText = '🔴';
                showTutorialFocus('btn-action', "TEKAN INI");

                showDialogue("🔴 TOMBOL AKSI", "Tombol bulat ini adalah tombol interaksi.\n\nFungsinya berubah otomatis:\n💬 Bicara dengan NPC\n🚪 Masuk/Keluar bangunan\n🌾 Berkebun & panen\n📬 Cek surat & papan info\n\n(Fungsi serang ⚔️ akan aktif otomatis saat masuk Dungeon)", [
                    {
                        text: "Oke! ▶",
                        action: () => {
                            btnAction.style.display = 'none';
                            continueTutorialStep4();
                        }
                    }
                ]);
            }

            function continueTutorialStep4() {
                showTutorialFocus('bag-btn', "BUKA TAS");
                showDialogue("🎒 TAS & JURNAL",
                    "🎒 Tas: Lihat & gunakan item.\n📜 Quest: Cek misi harian & target hidup.\n\nSelesaikan misi → dapat Gold & EXP!",
                    [{ text: "Mengerti! ▶", action: () => { continueTutorialStep6(); } }]
                );
            }

            function continueTutorialStep6() {
                tutorialStep_Calendar();
            }

            // --- REFACTORED TUTORIAL STEPS (CHAINED) ---

            function tutorialStep_Calendar() {
                showInGameFocus(10, 0, "KALENDER");
                showDialogue("📅 KALENDER",
                    "Kalender dinding = cek Tanggal, Musim & jadwal Festival/Ulang Tahun Warga.\n\nDatangi festival → hadiah langka!",
                    [{ text: "Oke! ▶", action: () => { tutorialStep_Stats(); } }]
                );
            }

            function tutorialStep_Stats() {
                showTutorialFocus('hud-profile-box', "STATUS");
                showDialogue("📊 STATUS",
                    "Tap foto profil → lihat Kartu Pelajar & stat lengkap.\n\n💪STR · 🧠INT · ❤️REP · 📈BIZ\n\nTingkatkan sesuai jalur hidupmu!",
                    [{ text: "Siap! ▶", action: () => { tutorialStep_ExpEnergy(); } }]
                );
            }

            function tutorialStep_ExpEnergy() {
                showTutorialFocus('hud-profile-box', "STAMINA");
                showDialogue("⚡ STAMINA & EXP",
                    "🟦 EXP penuh → Level Up!\n⚡ Energi habis → PINGSAN (denda uang!).\n\nEnergi berkurang saat berjalan, bekerja, atau bertarung. Tidur = pulih penuh.",
                    [{ text: "Hati-hati! ▶", action: () => { tutorialStep_Telephone(); } }]
                );
            }

            function tutorialStep_Telephone() {
                showInGameFocus(2, 6, "BELANJA");
                showDialogue("☎️ TELEPON",
                    "Telepon rumah = buka Katalog Belanja.\n\nBeli furnitur & upgrade rumah jadi lebih luas & mewah!",
                    [{ text: "Sip! ▶", action: () => { tutorialStep_Wardrobe(); } }]
                );
            }

            function tutorialStep_Wardrobe() {
                showInGameFocus(7, 0, "BAJU");
                showDialogue("👗 LEMARI",
                    "Ganti kostum di sini: Seragam, Baju Pesta, atau Zirah.\n\nPenampilanmu bisa membuka dialog khusus warga desa!",
                    [{ text: "Keren! ▶", action: () => { tutorialStep_Bed(); } }]
                );
            }

            function tutorialStep_Bed() {
                showInGameFocus(2, 1, "TIDUR");
                showDialogue("🛏️ KASUR",
                    "Tidur = ganti hari + pulih penuh.\n\nJangan lupa tulis Jurnal Refleksi dulu sebelum tidur!",
                    [{ text: "Oke! ▶", action: () => { tutorialStep_Diary(); } }]
                );
            }

            function tutorialStep_Diary() {
                showInGameFocus(5, 1, "JURNAL 📔");
                showDialogue("📔 MEJA JURNAL",
                    "Meja belajar = **TULIS JURNAL HARIAN** + Belajar Mandiri (INT naik).\n\nJurnal harian WAJIB diisi setiap hari — ini syarat STATUS WAJIB milikmu!\n\n📝 Cara: Dekati meja → tekan tombol aksi → pilih 'Tulis Jurnal'.\n\nSekarang keluar dan temui Mentor di luar!",
                    [{
                        text: "Ayo Keluar! ▶", action: () => {
                            clearTutorialFocus();
                            closeDialogue();
                            STATE.tutorialIndoorComplete = true;
                            showToast("Pintu Rumah Terbuka 🔓");
                        }
                    }]
                );
            }


            // ═══════════════════════════════════════════════════════
            // 🎉 ANIMASI SELAMAT DATANG (dipanggil sekali di awal game)
            // ═══════════════════════════════════════════════════════
            function playWelcomeAnimation() {
                // Buat overlay animasi
                const overlay = document.createElement('div');
                overlay.id = 'welcome-anim-overlay';
                overlay.style.cssText = `
                    position: fixed; inset: 0; z-index: 99999;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    background: rgba(0,0,0,0); pointer-events: none;
                    overflow: hidden;
                `;

                // Teks utama
                const mainText = document.createElement('div');
                mainText.style.cssText = `
                    font-family: 'Fredoka', sans-serif;
                    font-size: clamp(28px, 8vw, 52px);
                    font-weight: 700;
                    color: #facc15;
                    text-shadow: 0 0 30px #f59e0b, 0 4px 0 #a16207;
                    text-align: center;
                    opacity: 0;
                    transform: scale(0.5) translateY(40px);
                    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    padding: 0 20px;
                    line-height: 1.2;
                `;
                mainText.innerText = '🌟 Selamat Datang di';

                const subText = document.createElement('div');
                subText.style.cssText = `
                    font-family: 'Fredoka', sans-serif;
                    font-size: clamp(32px, 10vw, 64px);
                    font-weight: 700;
                    color: #fff;
                    text-shadow: 0 0 40px #06b6d4, 0 4px 0 #0e7490;
                    text-align: center;
                    opacity: 0;
                    transform: scale(0.3) translateY(60px);
                    transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s;
                    padding: 0 20px;
                    letter-spacing: 2px;
                `;
                subText.innerText = 'NUSANTARA ARSA';

                const tagLine = document.createElement('div');
                tagLine.style.cssText = `
                    font-family: 'Nunito', sans-serif;
                    font-size: clamp(13px, 3.5vw, 18px);
                    color: #a5f3fc;
                    text-align: center;
                    opacity: 0;
                    transition: opacity 0.5s ease 0.6s;
                    margin-top: 10px;
                    padding: 0 30px;
                    letter-spacing: 1px;
                `;
                tagLine.innerText = '✨ Hidupmu. Pilihanmu. Bangkitlah! ✨';

                overlay.appendChild(mainText);
                overlay.appendChild(subText);
                overlay.appendChild(tagLine);
                document.body.appendChild(overlay);

                // Buat confetti/kembang api
                const colors = ['#facc15','#f59e0b','#06b6d4','#10b981','#8b5cf6','#ef4444','#fff','#fbbf24'];
                for (let i = 0; i < 80; i++) {
                    setTimeout(() => {
                        const p = document.createElement('div');
                        const size = 6 + Math.random() * 10;
                        const isCircle = Math.random() > 0.5;
                        p.style.cssText = `
                            position: fixed;
                            width: ${size}px; height: ${size}px;
                            background: ${colors[Math.floor(Math.random()*colors.length)]};
                            border-radius: ${isCircle ? '50%' : '2px'};
                            left: ${Math.random()*100}vw;
                            top: -10px;
                            z-index: 100000;
                            pointer-events: none;
                            opacity: 1;
                            transform: rotate(${Math.random()*360}deg);
                            animation: confettiFall ${1.5 + Math.random()*2}s ease-in forwards;
                        `;
                        document.body.appendChild(p);
                        setTimeout(() => p.remove(), 3500);
                    }, i * 30);
                }

                // Tambahkan CSS animasi confetti jika belum ada
                if (!document.getElementById('confetti-style')) {
                    const st = document.createElement('style');
                    st.id = 'confetti-style';
                    st.textContent = `
                        @keyframes confettiFall {
                            0%   { transform: translateY(0) rotate(0deg) scale(1); opacity:1; }
                            80%  { opacity: 1; }
                            100% { transform: translateY(110vh) rotate(${Math.random()*720}deg) scale(0.5); opacity:0; }
                        }
                        @keyframes welcomePulse {
                            0%, 100% { text-shadow: 0 0 30px #f59e0b, 0 4px 0 #a16207; }
                            50%       { text-shadow: 0 0 60px #fbbf24, 0 4px 0 #a16207, 0 0 100px #fde68a; }
                        }
                    `;
                    document.head.appendChild(st);
                }

                // Buat suara fanfare sintetis (Web Audio API - tidak perlu file MP3)
                function playFanfare() {
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const notes = [523, 659, 784, 1047, 784, 1047, 1319]; // Do Mi Sol Do Sol Do Mi (fanfare)
                        const durations = [0.12, 0.12, 0.12, 0.28, 0.12, 0.12, 0.45];
                        let t = ctx.currentTime + 0.05;

                        notes.forEach((freq, i) => {
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.type = 'triangle';
                            osc.frequency.value = freq;
                            gain.gain.setValueAtTime(0, t);
                            gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
                            gain.gain.linearRampToValueAtTime(0, t + durations[i] - 0.02);
                            osc.start(t);
                            osc.stop(t + durations[i]);
                            t += durations[i] + 0.02;
                        });

                        // Tambahkan suara gemuruh kecil di akhir
                        setTimeout(() => {
                            const noise = ctx.createOscillator();
                            const ngain = ctx.createGain();
                            noise.connect(ngain);
                            ngain.connect(ctx.destination);
                            noise.type = 'sine';
                            noise.frequency.setValueAtTime(200, ctx.currentTime);
                            noise.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);
                            ngain.gain.setValueAtTime(0.2, ctx.currentTime);
                            ngain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
                            noise.start(ctx.currentTime);
                            noise.stop(ctx.currentTime + 0.4);
                        }, 1200);
                    } catch(e) { /* Audio tidak tersedia, skip */ }
                }

                // Sequence animasi
                playFanfare();

                // Fade in overlay background
                setTimeout(() => { overlay.style.background = 'rgba(0,0,0,0.82)'; overlay.style.transition = 'background 0.4s ease'; }, 50);

                // Muncul teks utama
                setTimeout(() => {
                    mainText.style.opacity = '1';
                    mainText.style.transform = 'scale(1) translateY(0)';
                    mainText.style.animation = 'welcomePulse 1.5s ease infinite';
                }, 300);

                // Muncul sub teks
                setTimeout(() => {
                    subText.style.opacity = '1';
                    subText.style.transform = 'scale(1) translateY(0)';
                }, 600);

                // Muncul tagline
                setTimeout(() => { tagLine.style.opacity = '1'; }, 1100);

                // Mulai hilang setelah 3.5 detik
                setTimeout(() => {
                    overlay.style.transition = 'opacity 0.8s ease';
                    overlay.style.opacity = '0';
                    setTimeout(() => { overlay.remove(); }, 800);
                }, 3500);
            }

            function runTutorial() {
                const name = DataService.user ? DataService.user.name : "Siswa";

                showDialogue(STATE.mentorName,
                    "Bangun juga akhirnya, " + name + "!\n\nKamu punya masa Trial 3 Tahun di Pulau ini. Buktikan dirimu — dan kamu bisa lanjut hingga 5 Tahun sebelum dikirim ke Pulau Javana!\n\nSekarang, pilih jalur hidupmu.",
                    [
                        { text: "Jelaskan Stat Dulu", action: () => {
                            showDialogue(STATE.mentorName,
                                "Singkatnya:\n💪STR → Bekerja & Bertarung\n🧠INT → Kuliah & Beasiswa\n📈BIZ → Wirausaha\n❤️REP → Keluarga & Menikah",
                                [{ text: "Paham! Pilih Sekarang ▶", action: () => {
                                    playWelcomeAnimation();
                                    setTimeout(() => openRoleSelection(), 600);
                                }}],
                                'images/mentor.png');
                        }},
                        { text: "Langsung Pilih ▶", action: () => {
                            playWelcomeAnimation();
                            setTimeout(() => openRoleSelection(), 600);
                        }}
                    ],
                    'images/mentor.png'
                );
            }

            function openRoleSelection() {
                // FIX: Menambahkan gambar mentor di menu pemilihan role juga
                showDialogue("TAKDIR HIDUP", "Tentukan spesialisasi awalmu sekarang:\n\n📊 Setiap jalur akan menampilkan data nyata dunia kerja sebelum kamu konfirmasi.", [
                    { text: "⚔️ Bekerja (Fighter) - STR++", action: () => showCareerCheck('worker') },
                    { text: "🎓 Kuliah (Mage) - INT++", action: () => showCareerCheck('student') },
                    { text: "🏪 Wirausaha (Support) - BIZ++", action: () => showCareerCheck('entrepreneur') },
                    /* UPDATE: MENAMBAHKAN KONFIRMASI PERINGATAN UNTUK ROLE MENIKAH */
                    { text: "🏠 Menikah (Family) - REP++", action: () => confirmFamilyRole() }
                ], 'images/mentor.png');
            }

            // --- KONFIRMASI ROLE MENIKAH ---
            function confirmFamilyRole() {
                showDialogue(STATE.mentorName,
                    "✋ Yakin pilih jalur Menikah?\n\nIni bukan hal mudah — ada tanggung jawab finansial & emosional besar. Pikirkan baik-baik!",
                    [
                        { text: "Saya Siap! ✅", action: () => showCareerCheck('family') },
                        { text: "Pikir-pikir dulu...", action: () => openRoleSelection() }
                    ],
                    'images/mentor.png'
                );
            }

            // --- NEW FUNCTION: SET ROLE (FIX: Logika Pemilihan Role Dipisah) ---
            function setRole(role) {
                STATE.player.role = role;

                // Semua pemain dapat ijazah SMA/SMK saat memilih role (baru lulus)
                if (!STATE.player.inventory['ijazah']) {
                    addItem('ijazah', 1);
                    addItem('foto_3x4', 2);
                    setTimeout(() => showToast('🎓 Kamu mendapat Ijazah SMA/SMK & Pas Foto 3×4 — simpan baik-baik untuk melamar kerja!'), 1500);
                }

                /* NEW: Jika memilih Student (UPDATE: Mentor menyuruh ke kampus) */
                if (role === 'student') {
                    STATE.player.int += 5;
                    STATE.player.energy += 20;
                    manualSave();

                    showDialogue(STATE.mentorName,
                        "Cerdas! 🎓\nPergi ke Kampus di timur desa. Daftar ulang & pilih jurusan di sana.\nBuka 07:00–18:00.",
                        [{ text: "Siap! 🎓", action: () => { showToast("Quest: Pergi ke Kampus 🎓"); explainTimeHUD(); } }],
                        'images/mentor.png'
                    );
                    return;
                }

                if (role === 'worker') {
                    STATE.player.str += 5;
                    STATE.player.hp += 20;
                    manualSave();

                    showDialogue(STATE.mentorName,
                        "Tangguh! 💪\nPergi ke Toko Merchant di selatan desa. Bicara Bos & lamar kerja!\nShift mulai 08:00, toko buka 06:00–20:00.",
                        [{ text: "Siap Kerja! 💼", action: () => { showToast("Quest: Lamar Kerja di Merchant 💼"); explainTimeHUD(); } }],
                        'images/mentor.png'
                    );
                    return;
                }

                if (role === 'entrepreneur') {
                    STATE.player.biz += 5;
                    STATE.player.money += 20000;
                    manualSave();
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                    showDialogue(STATE.mentorName,
                        "Brilian! 🏪 Modal awal: +20.000 Gold.\nRumahmu sudah jadi Ruko — mulai jualan dari rumah!\nStok barang? Beli di Merchant (06:00–20:00).",
                        [{
                            text: "Mantap! 🏪", action: () => {
                                const villMap = maps['village'];
                                const houseBuilding = villMap.buildings.find(b => b.id === 'player_house');
                                if (houseBuilding) houseBuilding.loadedImg = null;
                                createParticle(19 * TILE_SIZE, 7 * TILE_SIZE, '#fbbf24');
                                showToast("Rumah berubah jadi Toko! 🏪");
                                explainTimeHUD();
                            }
                        }],
                        'images/mentor.png'
                    );
                    return;
                }

                /* UPDATE: LOGIKA KHUSUS ROLE FAMILY (MENIKAH) */
                else if (role === 'family') {
                    STATE.player.reputation += 20;

                    // NEW: BERIKAN CINCIN KAYU SEBAGAI MODAL AWAL
                    if (!STATE.player.inventory['cincin_kayu']) STATE.player.inventory['cincin_kayu'] = 0;
                    STATE.player.inventory['cincin_kayu']++;

                    // NEW: BERIKAN PAKAIAN NIKAH JUGA
                    if (!STATE.player.inventory['pakaian_nikah']) STATE.player.inventory['pakaian_nikah'] = 0;
                    STATE.player.inventory['pakaian_nikah']++;

                    // UPDATE: SET ACTIVE QUEST AGAR MUNCUL DI JURNAL
                    STATE.player.activeQuest = 'meet_modin';

                    // FIX: PAKSA SIMPAN DATA
                    manualSave();

                    showDialogue(STATE.mentorName,
                        "Jalan mulia! Ini bekal awalmu: Cincin Kayu + Baju Pengantin.\n\nQuest: Pergi ke Balai Pernikahan (selatan desa, dekat sungai). Temui Pak Modin! Buka 06:00–16:00.",
                        [{
                            text: "Otw Halal! 💍",
                            action: () => {
                                showToast("QUEST: Temui Pak Modin di Balai Nikah! 💍");
                                setTimeout(() => {
                                    showDialogue("ITEM SPESIAL! 👘",
                                        "Dapat Baju Pengantin! 👘\nCek lemari pakaian di rumah untuk mencobanya.",
                                        [{ text: "Siap! ▶", action: () => { explainTimeHUD(); } }],
                                        'images/lemari.png'
                                    );
                                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                }, 800);
                            }
                        }],
                        'images/mentor.png'
                    );
                    return; // Berhenti di sini
                }

                // FIX: PAKSA SIMPAN DATA UNTUK ROLE LAINNYA
                manualSave();

                finalizeRoleSetup();
            }

            // --- TUTORIAL WAKTU & PENUTUP ---
            function explainTimeHUD() {
                showTutorialFocus('hud-time-container');
                showDialogue(STATE.mentorName,
                    "⏰ Waktu terus berjalan — 1 jam game ≈ 1 menit nyata.\n\nToko, kampus & balai desa punya jam buka. Begadang lewat 00:00 → bangun kesiangan & lemas!\n\nMusim berganti tiap 28 hari. Cek kalender dinding tiap pagi!",
                    [{ text: "Paham! ▶", action: () => { explainSocial(); } }],
                    'images/mentor.png'
                );
            }

            // --- TUTORIAL KALENDER (dipanggil oleh explainTimeHUD langsung ke social) ---
            function explainCalendar() {
                explainSocial(); // sudah digabung ke explainTimeHUD
            }

            // --- TUTORIAL SOSIALISASI & PENUTUP ---
            function explainSocial() {
                clearTutorialFocus();
                showDialogue(STATE.mentorName,
                    "Satu pesan terakhir: jaga hubunganmu dengan warga pulau ini.\n\nSapa, beri hadiah, dengarkan mereka — itu kunci membuka rahasia tersembunyi.\n\nSemangat, " + (DataService.user ? DataService.user.name : "Nak") + "! 👋",
                    [{ text: "Terima Kasih, Mentor! ▶", action: () => { finishPrologueSequence(); } }],
                    'images/mentor.png'
                );
            }

            // --- NEW: FUNGSI FINALISASI PROLOG (CLEANUP) ---
            function finishPrologueSequence() {
                // 1. Logika Mentor Menghilang
                const villMap = maps['village'];
                const mentor = villMap.npcs.find(n => n.id === 'mentor');
                if (mentor) {
                    mentor.x = -99;
                    mentor.y = -99;
                    mentor.vx = 0;
                    mentor.vy = 0;
                }

                // 2. Buka Kunci Jurnal (Akhiri Status Prologue)
                STATE.isPrologue = false;

                updateHUDInfo();
                closeDialogue();

                // 3. Simpan Ulang & Tampilkan Quest
                manualSave();

                setTimeout(() => {
                    showDailyQuestPopup();
                    showToast("SEMOGA BERHASIL! 👋");
                }, 500);
            }

            // --- NEW: SISTEM UJIAN MASUK KULIAH (EXAM SYSTEM) ---
            let currentExam = {
                major: null,
                score: 0,
                qIndex: 0,
                questions: [],
                timer: 0,      // NEW: Timer
                interval: null // NEW: Interval ID
            };

            // Database Soal (UPDATE: DITAMBAH JADI 10 SOAL LENGKAP PER JURUSAN)
            const EXAM_DB = {
                'teknologi': [
                    // MUDAH
                    { q: "Otak utama komputer yang memproses semua instruksi adalah?", a: "CPU", opts: ["CPU", "GPU", "Harddisk"] },
                    { q: "Apa kepanjangan dari RAM?", a: "Random Access Memory", opts: ["Read Access Memory", "Random Access Memory", "Run All Memory"] },
                    { q: "Sistem bilangan yang hanya menggunakan angka 0 dan 1 disebut?", a: "Biner", opts: ["Desimal", "Biner", "Heksadesimal"] },
                    { q: "Mana yang termasuk perangkat OUTPUT?", a: "Monitor", opts: ["Keyboard", "Mouse", "Monitor"] },
                    { q: "Tombol pintas (shortcut) untuk menyalin data adalah?", a: "Ctrl + C", opts: ["Ctrl + V", "Ctrl + C", "Ctrl + X"] },
                    { q: "Sistem operasi open-source berlambang penguin adalah?", a: "Linux", opts: ["Windows", "MacOS", "Linux"] },
                    { q: "Jaringan komputer global yang menghubungkan seluruh dunia adalah?", a: "Internet", opts: ["Intranet", "Internet", "Ethernet"] },
                    { q: "Komponen penyuplai daya listrik ke seluruh bagian PC adalah?", a: "Power Supply", opts: ["VGA Card", "Motherboard", "Power Supply"] },
                    { q: "Perangkat lunak berbahaya yang bertujuan merusak sistem disebut?", a: "Malware", opts: ["Software", "Hardware", "Malware"] },
                    { q: "Proses mematikan dan menghidupkan ulang komputer disebut?", a: "Restart", opts: ["Shutdown", "Sleep", "Restart"] },
                    // SEDANG
                    { q: "Protokol jaringan yang mengatur pengalamatan IP versi 6 menggunakan berapa bit?", a: "128 bit", opts: ["32 bit", "64 bit", "128 bit"] },
                    { q: "Tipe data yang hanya menyimpan nilai TRUE atau FALSE disebut?", a: "Boolean", opts: ["Integer", "Boolean", "Float"] },
                    { q: "Metode enkripsi yang menggunakan dua kunci (publik & privat) disebut?", a: "Asymmetric Encryption", opts: ["Symmetric Encryption", "Asymmetric Encryption", "Hashing"] },
                    { q: "Berapa nilai maksimum sebuah byte (8 bit) dalam desimal?", a: "255", opts: ["128", "255", "512"] },
                    { q: "Format file yang digunakan untuk database relasional yang paling umum adalah?", a: "SQL", opts: ["CSV", "JSON", "SQL"] },
                    { q: "Konsep pemrograman yang membungkus data dan fungsi dalam satu unit disebut?", a: "Encapsulation", opts: ["Inheritance", "Encapsulation", "Abstraction"] },
                    { q: "Shortcut keyboard untuk membuka Task Manager di Windows adalah?", a: "Ctrl + Shift + Esc", opts: ["Ctrl + Alt + Del", "Ctrl + Shift + Esc", "Win + R"] },
                    { q: "Proses mengubah kode sumber menjadi kode mesin disebut?", a: "Kompilasi", opts: ["Interpretasi", "Kompilasi", "Debugging"] },
                    { q: "Protokol keamanan yang mengenkripsi komunikasi website (https://) adalah?", a: "TLS/SSL", opts: ["FTP", "TLS/SSL", "HTTP"] },
                    { q: "Tipe serangan siber yang menipu pengguna agar mengklik tautan palsu disebut?", a: "Phishing", opts: ["Ransomware", "Phishing", "Brute Force"] },
                    // SULIT
                    { q: "Dalam konsep OOP, kemampuan kelas anak mewarisi sifat kelas induk disebut?", a: "Inheritance", opts: ["Polymorphism", "Inheritance", "Encapsulation"] },
                    { q: "Algoritma pengurutan tercepat secara rata-rata dengan kompleksitas O(n log n) adalah?", a: "Merge Sort", opts: ["Bubble Sort", "Merge Sort", "Insertion Sort"] },
                    { q: "Dalam jaringan, subnet mask 255.255.255.0 berarti ada berapa host yang tersedia?", a: "254 host", opts: ["256 host", "254 host", "128 host"] },
                    { q: "Perbedaan utama antara proses dan thread dalam sistem operasi adalah?", a: "Thread berbagi memori proses induk; proses tidak", opts: ["Thread berbagi memori proses induk; proses tidak", "Proses lebih cepat dari thread", "Thread tidak bisa berjalan bersamaan"] },
                    { q: "Teknologi virtualisasi container yang populer untuk deployment aplikasi adalah?", a: "Docker", opts: ["VMware", "Docker", "Kubernetes"] },
                    { q: "Query SQL untuk menggabungkan dua tabel berdasarkan kolom yang sama disebut?", a: "JOIN", opts: ["UNION", "JOIN", "MERGE"] },
                    { q: "Dalam keamanan jaringan, serangan Man-in-the-Middle (MITM) bertujuan untuk?", a: "Menyadap komunikasi dua pihak", opts: ["Membanjiri server", "Menyadap komunikasi dua pihak", "Mencuri password langsung"] },
                    { q: "Notasi Big-O untuk algoritma yang waktu eksekusinya konstan (tidak bergantung input) adalah?", a: "O(1)", opts: ["O(n)", "O(1)", "O(log n)"] },
                    { q: "Dalam Git, perintah untuk menggabungkan branch fitur ke branch utama adalah?", a: "git merge", opts: ["git push", "git merge", "git commit"] },
                    { q: "Konsep keamanan '3 pilar CIA' dalam siber meliputi Confidentiality, Integrity, dan?", a: "Availability", opts: ["Authentication", "Availability", "Authorization"] }
                ],
                'sejarah': [
                    // MUDAH
                    { q: "Peristiwa penculikan Soekarno-Hatta ke luar kota disebut?", a: "Rengasdengklok", opts: ["Bandung Lautan Api", "Rengasdengklok", "G30S"] },
                    { q: "Organisasi pergerakan nasional pertama yang berdiri tahun 1908 adalah?", a: "Budi Utomo", opts: ["Sarekat Islam", "Budi Utomo", "Indische Partij"] },
                    { q: "Naskah Sumpah Pemuda dibacakan pada tanggal?", a: "28 Oktober 1928", opts: ["17 Agustus 1945", "28 Oktober 1928", "1 Juni 1945"] },
                    { q: "Patih Majapahit yang terkenal dengan Sumpah Palapa adalah?", a: "Gajah Mada", opts: ["Hayam Wuruk", "Gajah Mada", "Ken Arok"] },
                    { q: "Perusahaan dagang Belanda yang memonopoli rempah-rempah adalah?", a: "VOC", opts: ["EIC", "VOC", "NATO"] },
                    { q: "Kerajaan Hindu tertua di Indonesia adalah?", a: "Kutai", opts: ["Tarumanegara", "Kutai", "Sriwijaya"] },
                    { q: "Perang Diponegoro berlangsung di pulau?", a: "Jawa", opts: ["Sumatera", "Jawa", "Sulawesi"] },
                    { q: "Jepang pertama kali mendarat di Indonesia pada tahun?", a: "1942", opts: ["1941", "1942", "1945"] },
                    { q: "Ibukota Indonesia pernah dipindahkan ke Yogyakarta pada tahun?", a: "1946", opts: ["1945", "1946", "1949"] },
                    { q: "Penjahit bendera Merah Putih pertama adalah?", a: "Fatmawati", opts: ["Kartini", "Cut Nyak Dien", "Fatmawati"] },
                    // SEDANG
                    { q: "Sistem tanam paksa (Cultuurstelsel) di Indonesia diterapkan oleh Gubernur Jenderal?", a: "Van den Bosch", opts: ["Daendels", "Van den Bosch", "Raffles"] },
                    { q: "Perjanjian yang mengakui kemerdekaan Indonesia secara de jure tahun 1949 adalah?", a: "KMB (Konferensi Meja Bundar)", opts: ["Perjanjian Linggarjati", "KMB (Konferensi Meja Bundar)", "Perjanjian Renville"] },
                    { q: "Kerajaan Sriwijaya berpusat di wilayah yang sekarang menjadi provinsi?", a: "Sumatera Selatan", opts: ["Sumatera Barat", "Sumatera Selatan", "Riau"] },
                    { q: "Serangan Umum 1 Maret 1949 di Yogyakarta dipimpin oleh?", a: "Soeharto", opts: ["Jenderal Sudirman", "Soeharto", "Sri Sultan HB IX"] },
                    { q: "Kebijakan 'Pintu Terbuka' (Open Door Policy) di Hindia Belanda diterapkan sejak?", a: "1870", opts: ["1830", "1870", "1900"] },
                    { q: "Peristiwa nasionalisasi perusahaan Belanda di Indonesia terjadi pada masa Presiden?", a: "Soekarno", opts: ["Soeharto", "Soekarno", "Habibie"] },
                    { q: "Nama asli Pangeran Diponegoro sebelum bergelar Pangeran adalah?", a: "Mustahar / Ontowiryo", opts: ["Raden Ontowiryo", "Raden Mas Said", "Raden Rangga"] },
                    { q: "Kongres Pemuda II yang melahirkan Sumpah Pemuda diselenggarakan di kota?", a: "Batavia (Jakarta)", opts: ["Surabaya", "Batavia (Jakarta)", "Bandung"] },
                    { q: "Armada laut Kerajaan Majapahit berhasil menguasai Nusantara di bawah pimpinan?", a: "Laksamana Nala", opts: ["Adityawarman", "Laksamana Nala", "Mpu Prapanca"] },
                    { q: "Kebijakan Deklarasi Djuanda tahun 1957 mempertegas bahwa Indonesia adalah negara?", a: "Kepulauan (Nusantara)", opts: ["Federal", "Kepulauan (Nusantara)", "Serikat"] },
                    // SULIT
                    { q: "Pemberontakan PRRI/Permesta tahun 1958 terjadi karena ketidakpuasan daerah terhadap pemerintah pusat dalam hal?", a: "Distribusi kekuasaan dan keuangan", opts: ["Agama dan budaya", "Distribusi kekuasaan dan keuangan", "Kebijakan pertahanan militer"] },
                    { q: "Konsep 'Bhinneka Tunggal Ika' berasal dari kitab kakawin karangan Mpu Tantular berjudul?", a: "Sutasoma", opts: ["Negarakertagama", "Sutasoma", "Pararaton"] },
                    { q: "Sistem ekonomi 'Demokrasi Terpimpin' Soekarno pada 1959 menggantikan sistem ekonomi?", a: "Sistem parlementer liberal", opts: ["Ekonomi terpusat Soviet", "Sistem parlementer liberal", "Ekonomi pasar bebas Barat"] },
                    { q: "Perjanjian Bongaya tahun 1667 yang melemahkan Kerajaan Gowa ditandatangani dengan?", a: "VOC (Belanda)", opts: ["Inggris", "VOC (Belanda)", "Portugis"] },
                    { q: "Dalam Perang Dunia II, Konferensi Postdam 1945 memutuskan bahwa Jepang menyerah kepada?", a: "Sekutu (Allied Forces)", opts: ["Amerika Serikat saja", "Sekutu (Allied Forces)", "Soviet dan Amerika"] },
                    { q: "Kebijakan politik luar negeri Indonesia yang 'bebas aktif' pertama kali dicetuskan oleh?", a: "Hatta (1948)", opts: ["Soekarno", "Hatta (1948)", "Agus Salim"] },
                    { q: "Peristiwa pemberontakan komunis pertama di Indonesia yang gagal terjadi pada tahun?", a: "1926", opts: ["1948", "1926", "1965"] },
                    { q: "Kitab Negarakertagama yang menggambarkan kejayaan Majapahit ditulis oleh?", a: "Mpu Prapanca", opts: ["Mpu Tantular", "Mpu Prapanca", "Mpu Kanwa"] },
                    { q: "Operasi Trikora tahun 1961 bertujuan untuk merebut kembali wilayah?", a: "Irian Barat (Papua)", opts: ["Timor Timur", "Irian Barat (Papua)", "Kalimantan Utara"] },
                    { q: "Krisis ekonomi parah yang memicu reformasi 1998 di Indonesia disebabkan utamanya oleh?", a: "Krisis moneter Asia & utang luar negeri", opts: ["Korupsi pejabat lokal", "Krisis moneter Asia & utang luar negeri", "Bencana alam besar-besaran"] }
                ]
            };

            // --- NEW: DATABASE SOAL KUIS TKJ (INTERAKSI BANGKU KAMPUS) ---
            const TKJ_QUIZ_DB = [
                // MUDAH
                { q: "Kepanjangan dari TKJ adalah?", a: "Teknik Komputer dan Jaringan", opts: ["Teknik Komputer dan Jaringan", "Teknologi Kecepatan Jaringan", "Teknik Komunikasi Jaringan"] },
                { q: "Perangkat yang menghubungkan dua jaringan berbeda segmen adalah?", a: "Router", opts: ["Switch", "Hub", "Router"] },
                { q: "Urutan warna kabel UTP tipe Straight pada pin 1 adalah?", a: "Putih Orange", opts: ["Putih Hijau", "Putih Orange", "Putih Biru"] },
                { q: "Port default untuk layanan HTTP web server adalah?", a: "80", opts: ["21", "80", "443"] },
                { q: "Perintah CLI di Windows untuk memeriksa konektivitas jaringan adalah?", a: "Ping", opts: ["Ping", "Ipconfig", "Tracert"] },
                { q: "Layer OSI ke-1 yang berhubungan dengan kabel dan sinyal listrik adalah?", a: "Physical Layer", opts: ["Network Layer", "Data Link Layer", "Physical Layer"] },
                { q: "IP Address 192.168.10.1 termasuk dalam kelas IP?", a: "C", opts: ["A", "B", "C"] },
                { q: "Server yang menerjemahkan nama domain menjadi IP Address adalah?", a: "DNS Server", opts: ["DHCP Server", "DNS Server", "FTP Server"] },
                { q: "Topologi jaringan dimana setiap node terhubung ke satu perangkat pusat disebut?", a: "Star", opts: ["Bus", "Ring", "Star"] },
                { q: "Protokol standar untuk mengirim email adalah?", a: "SMTP", opts: ["POP3", "IMAP", "SMTP"] },
                { q: "Alat untuk memasang konektor RJ45 ke kabel UTP disebut?", a: "Tang Crimping", opts: ["Tang Potong", "Tang Crimping", "Obeng"] },
                { q: "Jenis kabel yang menggunakan serat kaca untuk transmisi data via cahaya adalah?", a: "Fiber Optic", opts: ["Coaxial", "Fiber Optic", "Twisted Pair"] },
                // SEDANG
                { q: "VLAN (Virtual LAN) digunakan untuk?", a: "Memisahkan segmen jaringan secara logis", opts: ["Mempercepat koneksi internet", "Memisahkan segmen jaringan secara logis", "Mengenkripsi data jaringan"] },
                { q: "Perintah Linux untuk melihat daftar file dan folder di direktori aktif adalah?", a: "ls", opts: ["dir", "ls", "cd"] },
                { q: "Berapa jumlah bit dalam satu alamat IPv4?", a: "32 bit", opts: ["16 bit", "32 bit", "64 bit"] },
                { q: "Protokol yang digunakan untuk transfer file secara aman via SSH adalah?", a: "SFTP", opts: ["FTP", "SFTP", "HTTP"] },
                { q: "Dalam OSI model, layer yang bertanggung jawab untuk enkripsi dan format data adalah?", a: "Presentation Layer", opts: ["Application Layer", "Presentation Layer", "Session Layer"] },
                { q: "Tipe kabel UTP Crossover digunakan untuk menghubungkan?", a: "PC ke PC langsung (peer-to-peer)", opts: ["PC ke Switch", "PC ke PC langsung (peer-to-peer)", "Router ke Switch"] },
                { q: "Fungsi utama DHCP Server dalam jaringan adalah?", a: "Memberikan IP address otomatis ke client", opts: ["Mengatur akses internet", "Memberikan IP address otomatis ke client", "Memfilter konten website"] },
                { q: "Proses enkripsi dua arah yang membutuhkan kunci untuk dekripsi disebut?", a: "Encryption", opts: ["Hashing", "Encryption", "Compression"] },
                { q: "Perintah untuk melihat konfigurasi IP di Linux adalah?", a: "ifconfig / ip addr", opts: ["ipconfig", "ifconfig / ip addr", "netstat"] },
                { q: "Topologi jaringan yang paling toleran terhadap kegagalan node adalah?", a: "Mesh", opts: ["Bus", "Star", "Mesh"] },
                // SULIT
                { q: "Dalam subnetting, berapa jumlah subnet yang bisa dibuat dari network 192.168.1.0/26?", a: "4 subnet", opts: ["2 subnet", "4 subnet", "8 subnet"] },
                { q: "Firewall yang bekerja di layer aplikasi dan dapat memfilter konten disebut?", a: "Application Layer Firewall (WAF)", opts: ["Packet Filter", "Stateful Firewall", "Application Layer Firewall (WAF)"] },
                { q: "Protokol routing yang menggunakan algoritma Dijkstra untuk menentukan jalur terpendek adalah?", a: "OSPF", opts: ["RIP", "OSPF", "BGP"] },
                { q: "Teknik serangan jaringan yang memalsukan ARP reply untuk menyadap traffic disebut?", a: "ARP Spoofing / Poisoning", opts: ["IP Spoofing", "ARP Spoofing / Poisoning", "DNS Hijacking"] },
                { q: "Dalam protokol TCP, 'Three-Way Handshake' terdiri dari urutan?", a: "SYN → SYN-ACK → ACK", opts: ["SYN → ACK → FIN", "SYN → SYN-ACK → ACK", "HELLO → REPLY → CONFIRM"] },
                { q: "Teknologi NAT (Network Address Translation) berfungsi untuk?", a: "Menerjemahkan IP privat ke publik", opts: ["Mengenkripsi paket data", "Menerjemahkan IP privat ke publik", "Mempercepat routing"] },
                { q: "Dalam konfigurasi RAID, tipe RAID yang memberikan redundancy penuh (mirroring) adalah?", a: "RAID 1", opts: ["RAID 0", "RAID 1", "RAID 5"] },
                { q: "Perbedaan utama antara protokol TCP dan UDP adalah?", a: "TCP connection-oriented, UDP connectionless", opts: ["TCP lebih cepat dari UDP", "TCP connection-oriented, UDP connectionless", "UDP lebih aman dari TCP"] },
                { q: "Command 'tracert' (Windows) / 'traceroute' (Linux) digunakan untuk?", a: "Melacak jalur paket data ke tujuan", opts: ["Melihat IP aktif di jaringan", "Melacak jalur paket data ke tujuan", "Mengukur kecepatan internet"] }
            ];

            // --- NEW FUNCTION: START TKJ QUIZ ---
            function startTKJStudy() {
                // Cek Energi
                if (STATE.player.energy < 10) {
                    showToast("Terlalu lelah untuk belajar... (Butuh 10 Energi)");
                    return;
                }

                // Ambil soal acak
                const quiz = TKJ_QUIZ_DB[Math.floor(Math.random() * TKJ_QUIZ_DB.length)];

                // Buat opsi jawaban
                const options = quiz.opts.map(opt => ({
                    text: opt,
                    action: () => {
                        if (opt === quiz.a) {
                            // Jawaban Benar
                            STATE.player.energy -= 10;
                            STATE.player.int += 1; // Naikkan INT
                            gainExp(25); // EXP Lumayan

                            showToast("Benar! INT +1, EXP +25");
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            createParticle(STATE.player.x, STATE.player.y, '#3b82f6'); // Partikel Biru (Teknologi)

                            showDialogue("JAWABAN TEPAT! ✅", `Selamat! Jawabanmu benar: **${quiz.a}**.\n\nWawasan TKJ-mu semakin luas.`, [{ text: "Mantap", action: closeDialogue }], 'images/kursimahasiswa.png');
                        } else {
                            // Jawaban Salah
                            STATE.player.energy = Math.max(0, STATE.player.energy - 5); // Penalti energi dikit
                            showToast("Salah... (Energi -5)");
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                            showDialogue("JAWABAN SALAH ❌", `Sayang sekali, jawaban yang benar adalah: **${quiz.a}**.\n\nJangan menyerah, pelajari lagi materinya!`, [{ text: "Tutup", action: closeDialogue }], 'images/kursimahasiswa.png');
                        }
                    }
                }));

                // Acak urutan tombol agar tidak hapalan posisi
                options.sort(() => Math.random() - 0.5);
                options.push({ text: "Nanti saja", action: closeDialogue });

                showDialogue("KUIS DADAKAN TKJ 💻", `**PERTANYAAN:**\n${quiz.q}`, options, 'images/kursimahasiswa.png');
            }

            // --- FUNGSI BARU: SISTEM SELEKSI JURUSAN & BEASISWA (MISSING FIX) ---
            function selectMajor(major) {
                // Tawarkan Jalur Masuk: Reguler vs Beasiswa
                showDialogue("PILIH JALUR MASUK",
                    `Kamu memilih jurusan **${major.toUpperCase()}**.\n\nApakah kamu ingin mencoba Tes Beasiswa?\n(Syarat: Nilai 100/Benar Semua untuk Gratis UKT)`,
                    [
                        {
                            text: "Coba Tes Beasiswa (Gratis)", action: () => {
                                // UPDATE: CEK COOLDOWN JIKA GAGAL (1 MINGGU / 7 HARI)
                                if (STATE.player.lastExamFailDay && (STATE.day - STATE.player.lastExamFailDay < 7)) {
                                    const daysLeft = 7 - (STATE.day - STATE.player.lastExamFailDay);
                                    showDialogue("AKSES DITOLAK",
                                        `Sistem mencatat kamu baru saja gagal tes.\n\nKebijakan kampus mengharuskan jeda 1 MINGGU sebelum ujian ulang.\nSilakan coba lagi dalam **${daysLeft} HARI** atau masuk jalur Reguler.`,
                                        [{ text: "Baiklah", action: closeDialogue }],
                                        'images/lecture.png'
                                    );
                                    return;
                                }
                                startEntranceExam(major);
                            }
                        },
                        { text: "Jalur Reguler (Bayar nanti)", action: () => confirmMajor(major, false) }
                    ],
                    'images/lecture.png'
                );
            }

            function confirmMajor(major, isScholarship) {
                STATE.player.major = major;
                STATE.player.scholarship = isScholarship;

                // Beri Bonus Stat Awal Sesuai Jurusan
                if (major === 'teknologi') {
                    STATE.player.int += 3;
                } else if (major === 'sejarah') {
                    STATE.player.reputation += 5;
                }

                // FIX: SIMPAN DATA JURUSAN SEGERA
                manualSave();

                updateHUDInfo();
                createParticle(STATE.player.x, STATE.player.y, '#3b82f6');
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                if (isScholarship) {
                    // 🎬 CINEMATIC BEASISWA
                    setTimeout(() => {
                        playCutsceneScholarship(major, () => {
                            showToast(`🏆 Selamat! Kamu resmi mahasiswa ${major.toUpperCase()} — BEASISWA PENUH!`);
                            if (typeof updateMentorBubble === 'function') updateMentorBubble();
                        });
                    }, 400);
                } else {
                    // Dialog biasa untuk jalur reguler
                    showDialogue("PENDAFTARAN BERHASIL",
                        `Selamat! Kamu resmi menjadi mahasiswa **${major.toUpperCase()}**.\nStatus: REGULER 💰\n\nJangan lupa siapkan uang untuk UKT tahunan!`,
                        [{ text: "Siap Kuliah!", action: closeDialogue }],
                        'images/lecture.png'
                    );
                }
            }

            function startEntranceExam(major) {
                currentExam.major = major;
                currentExam.score = 0;
                currentExam.qIndex = 0;

                // UPDATE: Ambil 10 soal acak dari DB untuk ujian beasiswa
                if (!EXAM_DB[major]) {
                    console.error("Exam DB missing for", major);
                    return;
                }
                currentExam.questions = [...EXAM_DB[major]].sort(() => Math.random() - 0.5).slice(0, 10);

                // NEW: Set Timer (90 Detik untuk 10 Soal)
                currentExam.timer = 90;

                // NEW: Mulai Interval Timer
                if (currentExam.interval) clearInterval(currentExam.interval);

                currentExam.interval = setInterval(() => {
                    currentExam.timer--;

                    // Update Judul Dialog secara Real-time agar pemain melihat waktu berjalan
                    const titleEl = document.getElementById('dialogue-title');
                    if (titleEl && titleEl.innerText.includes("UJIAN BEASISWA")) {
                        titleEl.innerText = `UJIAN BEASISWA (${currentExam.qIndex + 1}/${currentExam.questions.length}) - ⏱️ ${currentExam.timer}s`;

                        // Warnai merah jika waktu < 10 detik
                        if (currentExam.timer < 10) titleEl.style.color = '#ef4444';
                        else titleEl.style.color = '#fbbf24';
                    }

                    // Cek Waktu Habis
                    if (currentExam.timer <= 0) {
                        clearInterval(currentExam.interval);
                        finishEntranceExam(true); // true = Timeout Triggered
                    }
                }, 1000);

                nextExamQuestion();
            }

            function nextExamQuestion() {
                // Cek apakah soal sudah habis
                if (currentExam.qIndex >= currentExam.questions.length) {
                    finishEntranceExam(); // Normal Finish
                    return;
                }

                const q = currentExam.questions[currentExam.qIndex];
                const opts = q.opts.map(o => ({
                    text: o,
                    action: () => answerExam(o === q.a)
                }));
                // Acak urutan jawaban
                opts.sort(() => Math.random() - 0.5);

                // Tampilkan Dialog dengan Timer di Judul Awal
                showDialogue(
                    `UJIAN BEASISWA (${currentExam.qIndex + 1}/${currentExam.questions.length}) - ⏱️ ${currentExam.timer}s`,
                    q.q,
                    opts,
                    'images/lecture.png'
                );
            }

            function answerExam(isCorrect) {
                if (isCorrect) currentExam.score++;

                // Feedback suara
                if (typeof AudioService !== 'undefined') AudioService.playSFX(isCorrect ? 'item' : 'hit');

                currentExam.qIndex++;
                // Jeda sedikit agar tidak kaget, lalu lanjut
                setTimeout(nextExamQuestion, 500);
            }

            function finishEntranceExam(isTimeout = false) {
                // Stop Timer
                if (currentExam.interval) clearInterval(currentExam.interval);

                // Syarat Beasiswa: Harus Benar Semua (Score == Jumlah Soal)
                const isPerfect = currentExam.score === currentExam.questions.length;

                let title = "";
                let msg = "";
                let options = [];

                // KONDISI 1: WAKTU HABIS
                if (isTimeout) {
                    title = "WAKTU HABIS! ⏰";
                    msg = `Maaf, waktu 90 detik telah berakhir.\nSkor Akhir: ${currentExam.score}/${currentExam.questions.length}.\n\nAnda dianggap **GAGAL** karena tidak menyelesaikan ujian tepat waktu.`;

                    // Hukuman Cooldown
                    STATE.player.lastExamFailDay = STATE.day;
                    manualSave();

                    options = [
                        { text: "Masuk Reguler", action: () => confirmMajor(currentExam.major, false) },
                        { text: "Coba Lagi Minggu Depan", action: closeDialogue }
                    ];
                }
                // KONDISI 2: LULUS SEMPURNA
                else if (isPerfect) {
                    title = "HASIL UJIAN: LULUS! 🏆";
                    msg = `Luar biasa! Skor: ${currentExam.score}/10.\nSisa Waktu: ${currentExam.timer} detik.\n\nJawabanmu sempurna. Kamu berhak mendapatkan **BEASISWA PENUH**.`;

                    options = [
                        { text: "Ambil Beasiswa", action: () => confirmMajor(currentExam.major, true) }
                    ];
                }
                // KONDISI 3: SELESAI TAPI TIDAK SEMPURNA
                else {
                    // NEW: Catat hari kegagalan dan simpan
                    STATE.player.lastExamFailDay = STATE.day;
                    manualSave();

                    title = "HASIL UJIAN: GAGAL ❌";
                    msg = `Skor: ${currentExam.score}/${currentExam.questions.length}.\nMaaf, syarat beasiswa adalah nilai sempurna (10/10).\n\n**Kamu tidak bisa mengambil tes ulang selama 1 MINGGU.**\nSilakan coba lagi minggu depan atau masuk lewat Jalur Reguler.`;

                    options = [
                        { text: "Masuk Reguler", action: () => confirmMajor(currentExam.major, false) },
                        { text: "Belajar Lagi (Minggu Depan)", action: () => {
                            closeDialogue();
                            // 💡 Tampilkan Konsekuensi Nyata setelah gagal ujian
                            setTimeout(() => showKonsekuensi('student_failed_exam'), 300);
                        }}
                    ];
                }

                showDialogue(title, msg, options, 'images/lecture.png');
            }

            // --- NEW: DATABASE SOAL SIDANG SKRIPSI (LEVEL SULIT/ADVANCED) ---
            const THESIS_DB = {
                'teknologi': [
                    { q: "Apa kompleksitas waktu (Big O) terbaik untuk algoritma Binary Search?", a: "O(log n)", opts: ["O(n)", "O(log n)", "O(n^2)"] },
                    { q: "Manakah yang BUKAN merupakan prinsip dasar OOP?", a: "Compilation", opts: ["Encapsulation", "Polymorphism", "Compilation"] },
                    { q: "Serangan siber yang membanjiri server dengan trafik palsu disebut?", a: "DDoS", opts: ["Phishing", "DDoS", "SQL Injection"] },
                    { q: "Protokol standar untuk transfer halaman web aman adalah?", a: "HTTPS", opts: ["FTP", "HTTP", "HTTPS"] },
                    { q: "Database NoSQL yang menyimpan data dalam format Document adalah?", a: "MongoDB", opts: ["MySQL", "PostgreSQL", "MongoDB"] },
                    { q: "Metode pengembangan software Agile yang menggunakan sprint 2 minggu disebut?", a: "Scrum", opts: ["Waterfall", "Scrum", "Kanban"] },
                    { q: "Dalam desain sistem, 'Load Balancer' berfungsi untuk?", a: "Mendistribusikan traffic ke beberapa server", opts: ["Mengenkripsi data", "Mendistribusikan traffic ke beberapa server", "Menyimpan cache database"] },
                    { q: "Teknik optimasi database yang membuat salinan kolom terindeks untuk mempercepat query disebut?", a: "Indexing", opts: ["Normalization", "Indexing", "Partitioning"] },
                    { q: "Dalam arsitektur microservices, komponen yang mengelola autentikasi dan routing API disebut?", a: "API Gateway", opts: ["Load Balancer", "API Gateway", "Message Broker"] },
                    { q: "Teorema CAP dalam sistem terdistribusi menyatakan bahwa sistem hanya bisa menjamin dua dari tiga: Consistency, Availability, dan?", a: "Partition Tolerance", opts: ["Performance", "Partition Tolerance", "Persistence"] },
                    { q: "Teknik keamanan yang memisahkan data input dari perintah SQL untuk mencegah injeksi disebut?", a: "Prepared Statement / Parameterized Query", opts: ["Input Sanitization biasa", "Prepared Statement / Parameterized Query", "Firewall SQL"] },
                    { q: "Dalam machine learning, 'overfitting' terjadi ketika model?", a: "Terlalu hafal data training, buruk di data baru", opts: ["Tidak cukup dilatih", "Terlalu hafal data training, buruk di data baru", "Dataset terlalu besar"] },
                    { q: "Protokol WebSocket berbeda dari HTTP karena WebSocket?", a: "Koneksi persisten dua arah (full-duplex)", opts: ["Lebih cepat untuk file besar", "Koneksi persisten dua arah (full-duplex)", "Menggunakan port 443 saja"] },
                    { q: "Dalam sistem operasi, 'deadlock' terjadi ketika?", a: "Dua proses saling menunggu resource yang dipegang lawannya", opts: ["CPU terlalu panas", "Dua proses saling menunggu resource yang dipegang lawannya", "Memori RAM habis"] },
                    { q: "Perbedaan 'stack' dan 'heap' dalam manajemen memori adalah?", a: "Stack untuk local variables (auto-managed), heap untuk dynamic allocation (manual)", opts: ["Stack lebih besar dari heap", "Stack untuk local variables (auto-managed), heap untuk dynamic allocation (manual)", "Heap lebih cepat dari stack"] }
                ],
                'sejarah': [
                    { q: "Naskah asli Proklamasi Kemerdekaan Indonesia diketik oleh?", a: "Sayuti Melik", opts: ["Sukarni", "Sayuti Melik", "Laksamana Maeda"] },
                    { q: "Kerajaan Hindu tertua di Indonesia yang terletak di Kalimantan Timur adalah?", a: "Kutai", opts: ["Tarumanegara", "Kutai", "Majapahit"] },
                    { q: "Pangeran Diponegoro ditangkap di kota mana pada tahun 1830?", a: "Magelang", opts: ["Yogyakarta", "Magelang", "Semarang"] },
                    { q: "Organisasi militer bentukan Jepang untuk membantu pertahanan adalah?", a: "PETA", opts: ["Putera", "PETA", "Seinendan"] },
                    { q: "Konferensi Meja Bundar (KMB) yang mengakui kedaulatan Indonesia diadakan di?", a: "Den Haag", opts: ["Jakarta", "Den Haag", "Amsterdam"] },
                    { q: "Konsep 'Trisakti' yang dicetuskan Soekarno terdiri dari berdaulat dalam politik, berdikari dalam ekonomi, dan?", a: "Berkepribadian dalam kebudayaan", opts: ["Merdeka dalam militer", "Berkepribadian dalam kebudayaan", "Mandiri dalam pendidikan"] },
                    { q: "Penyebab utama runtuhnya Kerajaan Majapahit menurut sejarawan adalah?", a: "Perang saudara Paregreg + penyebaran Islam", opts: ["Serangan dari Cina", "Perang saudara Paregreg + penyebaran Islam", "Bencana alam besar"] },
                    { q: "Sistem Ekonomi Gerakan Benteng (1950) bertujuan untuk?", a: "Memajukan pengusaha pribumi (bumiputera)", opts: ["Menasionalisasi perusahaan asing", "Memajukan pengusaha pribumi (bumiputera)", "Mengurangi hutang luar negeri"] },
                    { q: "Supersemar (Surat Perintah 11 Maret 1966) merupakan peralihan kekuasaan dari Soekarno kepada?", a: "Letjen Soeharto", opts: ["Sultan HB IX", "Letjen Soeharto", "Jend. A.H. Nasution"] },
                    { q: "Dalam konteks Perang Dingin, Indonesia bergabung dengan negara-negara non-blok melalui?", a: "Konferensi Asia-Afrika Bandung 1955", opts: ["PBB 1950", "Konferensi Asia-Afrika Bandung 1955", "ASEAN 1967"] },
                    { q: "Politik 'Devide et Impera' yang diterapkan Belanda di Nusantara artinya strategi?", a: "Adu domba untuk memecah belah persatuan", opts: ["Kerja paksa untuk pembangunan", "Adu domba untuk memecah belah persatuan", "Monopoli perdagangan rempah"] },
                    { q: "Akar kata 'Nusantara' dalam bahasa Sansekerta terdiri dari 'Nusa' (pulau) dan 'Antara' yang artinya?", a: "Di antara / seberang", opts: ["Besar dan luas", "Di antara / seberang", "Bangsa yang mulia"] },
                    { q: "Reformasi 1998 berhasil menumbangkan Soeharto setelah berkuasa selama?", a: "32 tahun", opts: ["20 tahun", "32 tahun", "40 tahun"] },
                    { q: "Perbedaan mendasar antara Piagam Jakarta (22 Juni 1945) dan Pembukaan UUD 1945 yang disahkan adalah?", a: "Penghapusan kalimat '...dengan kewajiban menjalankan syariat Islam...'", opts: ["Perubahan nama negara", "Penghapusan kalimat '...dengan kewajiban menjalankan syariat Islam...'", "Penambahan sila ke-6 Pancasila"] },
                    { q: "Masa pemerintahan Orde Baru (1966-1998) berhasil mencapai swasembada beras tahun 1984 melalui program?", a: "Revolusi Hijau (Green Revolution)", opts: ["REPELITA (Rencana Lima Tahun)", "Revolusi Hijau (Green Revolution)", "BIMAS dan INMAS"] }
                ]
            };

            // --- NEW: DATABASE UJIAN KOMPETENSI MANAJER (WORKER ROLE) ---
            const MANAGER_EXAM_DB = [
                // MUDAH
                { q: "Apa prinsip dasar manajemen stok barang agar tidak kadaluarsa?", a: "FIFO (First In First Out)", opts: ["LIFO (Last In First Out)", "FIFO (First In First Out)", "Random Selection"] },
                { q: "Jika pelanggan marah karena barang rusak, apa tindakan profesional pertama?", a: "Meminta maaf & dengarkan", opts: ["Meminta maaf & dengarkan", "Menyalahkan ekspedisi", "Mengusir pelanggan"] },
                { q: "Rumus dasar menghitung Laba (Profit) adalah?", a: "Pendapatan - Beban", opts: ["Aset + Hutang", "Pendapatan - Beban", "Modal x Bunga"] },
                { q: "Apa kunci utama dalam memimpin tim gudang?", a: "Komunikasi & Delegasi", opts: ["Otoriter & Keras", "Komunikasi & Delegasi", "Mengerjakan semua sendiri"] },
                { q: "Jika stok fisik tidak sesuai catatan komputer, apa yang terjadi?", a: "Selisih Stok (Shrinkage)", opts: ["Surplus Anggaran", "Selisih Stok (Shrinkage)", "Keuntungan Ganda"] },
                { q: "Etika kerja: Apa yang harus dilakukan jika melihat rekan kerja mencuri barang?", a: "Lapor ke Atasan", opts: ["Ikut mencuri", "Diam saja", "Lapor ke Atasan"] },
                { q: "Apa tujuan utama dari Stock Opname?", a: "Verifikasi fisik barang", opts: ["Menghabiskan anggaran", "Verifikasi fisik barang", "Liburan karyawan"] },
                // SEDANG
                { q: "Apa yang dimaksud dengan KPI (Key Performance Indicator)?", a: "Tolok ukur capaian kinerja karyawan/tim", opts: ["Jenis bonus gaji karyawan", "Tolok ukur capaian kinerja karyawan/tim", "Sistem absensi digital"] },
                { q: "Dalam manajemen risiko, apa prioritas pertama yang harus dilakukan?", a: "Identifikasi dan analisis risiko", opts: ["Langsung mitigasi semua risiko", "Identifikasi dan analisis risiko", "Asuransikan semua aset"] },
                { q: "Metode pengambilan keputusan yang melibatkan seluruh tim untuk mendapat konsensus disebut?", a: "Brainstorming / musyawarah mufakat", opts: ["Voting mayoritas", "Brainstorming / musyawarah mufakat", "Keputusan sepihak atasan"] },
                { q: "Dalam laporan keuangan, 'Arus Kas' (Cash Flow) penting karena?", a: "Menunjukkan likuiditas usaha secara nyata", opts: ["Menunjukkan nilai aset total perusahaan", "Menunjukkan likuiditas usaha secara nyata", "Digunakan untuk promosi ke bank"] },
                { q: "Teknik manajemen waktu yang membagi tugas jadi: Penting-Mendesak, Penting-Tidak Mendesak, dll disebut?", a: "Matriks Eisenhower", opts: ["Metode Pomodoro", "Matriks Eisenhower", "Sistem GTD (Getting Things Done)"] },
                // SULIT
                { q: "Dalam negosiasi bisnis, strategi 'BATNA' (Best Alternative To Negotiated Agreement) berarti?", a: "Alternatif terbaik jika negosiasi gagal — batas bawah kita", opts: ["Penawaran terbaik yang bisa kita buat", "Alternatif terbaik jika negosiasi gagal — batas bawah kita", "Teknik menekan lawan agar setuju"] },
                { q: "Pemutusan Hubungan Kerja (PHK) oleh perusahaan wajib memberikan pesangon sesuai?", a: "UU Ketenagakerjaan (UU No.13/2003 atau UU Cipta Kerja)", opts: ["Kebijakan internal perusahaan saja", "UU Ketenagakerjaan (UU No.13/2003 atau UU Cipta Kerja)", "Keputusan langsung HRD"] },
                { q: "Analisis SWOT perusahaan mempertimbangkan Strengths, Weaknesses, Opportunities, dan?", a: "Threats", opts: ["Targets", "Threats", "Trends"] },
                { q: "Dalam manajemen rantai pasok (Supply Chain), 'Just-In-Time' (JIT) bertujuan untuk?", a: "Meminimalkan stok berlebih dengan produksi tepat waktu", opts: ["Mempercepat pengiriman ke konsumen akhir", "Meminimalkan stok berlebih dengan produksi tepat waktu", "Menambah buffer stok sebagai cadangan"] },
                { q: "Biaya yang tidak berubah meski volume produksi naik/turun disebut?", a: "Biaya Tetap (Fixed Cost)", opts: ["Biaya Variabel", "Biaya Tetap (Fixed Cost)", "Biaya Marginal"] },
                { q: "Pemimpin yang memberi kebebasan penuh kepada tim tanpa arahan disebut gaya kepemimpinan?", a: "Laissez-Faire", opts: ["Demokratis", "Laissez-Faire", "Transformasional"] },
                { q: "Dalam konteks ISO 9001, dokumen 'SOP' (Standard Operating Procedure) berfungsi untuk?", a: "Menjamin konsistensi proses kerja yang terstandarisasi", opts: ["Menggantikan peran manajer", "Menjamin konsistensi proses kerja yang terstandarisasi", "Syarat administrasi pinjaman bank"] }
            ];

            // --- NEW: LOGIKA UJIAN MANAJER ---
            let currentManagerTest = {
                score: 0,
                qIndex: 0,
                questions: []
            };

            function startManagerExam() {
                currentManagerTest.score = 0;
                currentManagerTest.qIndex = 0;
                // Ambil 5 soal acak
                currentManagerTest.questions = [...MANAGER_EXAM_DB].sort(() => Math.random() - 0.5).slice(0, 5);

                showDialogue("UJI KOMPETENSI MANAJER",
                    "Syarat menjadi Manajer bukan hanya otot, tapi juga otak & etika.\n\nSaya akan ajukan **5 Pertanyaan Manajemen**.\nSyarat Lulus: **Benar Minimal 4**.\n\nSiap diuji?",
                    [
                        { text: "SIAP BOS! (Mulai)", action: nextManagerQuestion },
                        { text: "Belum siap mental", action: closeDialogue }
                    ],
                    'images/job.png'
                );
            }

            function nextManagerQuestion() {
                if (currentManagerTest.qIndex >= currentManagerTest.questions.length) {
                    finishManagerExam();
                    return;
                }

                const qData = currentManagerTest.questions[currentManagerTest.qIndex];
                const opts = qData.opts.map(opt => ({
                    text: opt,
                    action: () => answerManagerQuestion(opt === qData.a)
                })).sort(() => Math.random() - 0.5);

                showDialogue(`UJIAN MANAJER (${currentManagerTest.qIndex + 1}/5)`,
                    `PERTANYAAN:\n\n**"${qData.q}"**`,
                    opts,
                    'images/job.png'
                );
            }

            function answerManagerQuestion(isCorrect) {
                if (isCorrect) {
                    currentManagerTest.score++;
                    showToast("Jawaban Tepat! ✅");
                } else {
                    showToast("Jawaban Kurang Tepat ❌");
                }

                if (typeof AudioService !== 'undefined') AudioService.playSFX(isCorrect ? 'item' : 'hit');

                currentManagerTest.qIndex++;
                setTimeout(() => nextManagerQuestion(), 800);
            }

            function finishManagerExam() {
                const passed = currentManagerTest.score >= 4;

                if (passed) {
                    // PROMOTION LOGIC (MANAJER)
                    STATE.player.jobLevel++;
                    STATE.player.bossReputation += 10; // Bonus Reputasi Besar
                    STATE.player.biz += 5; // Bonus Skill Bisnis

                    // --- NEW: BERIKAN SERTIFIKAT PROFESI ---
                    addItem('sertifikat_manajer', 1);
                    showToast("🎓 DITEMUKAN: Sertifikat Profesi Manajer!");

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(STATE.player.x, STATE.player.y, '#fbbf24');

                    showDialogue("HASIL UJIAN: LULUS!",
                        `Skor: ${currentManagerTest.score}/5.\n\nSelamat! Pengetahuanmu tentang manajemen dan etika sudah mumpuni.\n\nSaya dengan bangga menyerahkan **Sertifikat Profesi** ini dan mengangkatmu menjadi **MANAJER CABANG**!`,
                        [{
                            text: "Terima kasih Bos!", action: () => {
                                closeDialogue();
                                showToast("NAIK PANGKAT: MANAJER! 📈");
                                manualSave();
                            }
                        }],
                        'images/job.png'
                    );
                } else {
                    STATE.player.energy = Math.max(0, STATE.player.energy - 20); // Penalty kelelahan mental
                    showDialogue("HASIL UJIAN: GAGAL",
                        `Skor: ${currentManagerTest.score}/5.\n\nKamu belum siap memimpin. Pelajari lagi tentang bisnis dan etika kerja.\nSeorang Manajer tidak boleh salah ambil keputusan!`,
                        [{ text: "Maaf Bos... (Energy -20)", action: closeDialogue }],
                        'images/job.png'
                    );
                }
            }

            // --- NEW: WORKER MINIGAME LOGIC & DATA ---
            const WORK_ITEMS = [
                { name: "Apel Merah", type: "food", icon: "🍎" },
                { name: "Ikan Segar", type: "food", icon: "🐟" },
                { name: "Roti Gandum", type: "food", icon: "🍞" },
                { name: "Susu Sapi", type: "food", icon: "🥛" },
                { name: "Palu Besi", type: "tool", icon: "🔨" },
                { name: "Kapak Kayu", type: "tool", icon: "🪓" },
                { name: "Cangkul", type: "tool", icon: "⛏️" },
                { name: "Pedang Lama", type: "tool", icon: "⚔️" },
                { name: "Cincin Emas", type: "luxury", icon: "💍" },
                { name: "Kalung Mutiara", type: "luxury", icon: "📿" },
                { name: "Kain Sutra", type: "luxury", icon: "🧣" },
                { name: "Permata Biru", type: "luxury", icon: "💎" }
            ];

            let workState = {
                active: false,
                currentItem: null,
                score: 0,
                timer: 0,
                maxTime: 10, // 10 detik per sesi sortir
                interval: null
            };

            // --- NEW FUNCTION: HANDLE WORKER INTERACTION (Dipanggil dari interactObject) ---
            function handleWorkerInteraction(obj) {
                const p = STATE.player;

                // Validasi Dasar
                if (p.role !== 'worker') {
                    showToast("Hanya Staff Gudang yang boleh menyentuh ini.");
                    return;
                }

                if (!p.shiftStarted) {
                    showDialogue("Pak Hendra (Merchant)", "Kamu belum absen masuk shift! Lapor ke saya dulu baru kerja.", [{ text: "Siap Bos", action: closeDialogue }], 'images/job.png');
                    return;
                }

                // A. Interaksi Rak Gudang (Minigame Sortir)
                if (obj.type === 'shelf') {
                    showDialogue("TUGAS GUDANG", "Ada tumpukan barang baru datang. \nBantu sortir ke rak yang benar agar stok rapi.", [
                        {
                            text: "Mulai Sortir (Energy -5)", action: () => {
                                if (p.energy >= 5) {
                                    p.energy -= 5;
                                    closeDialogue();
                                    startWorkMinigame();
                                } else {
                                    showToast("Terlalu lelah untuk angkat barang...");
                                }
                            }
                        },
                        { text: "Nanti saja", action: closeDialogue }
                    ], 'images/rakbuku.png'); // Pakai gambar rak
                }

                // B. Interaksi Kasir (Event Pelanggan)
                else if (obj.type === 'counter') {
                    triggerCustomerEvent();
                }
            }

            // --- LOGIKA MINIGAME SORTIR ---
            function startWorkMinigame() {
                workState.active = true;
                workState.score = 0;
                workState.timer = workState.maxTime;

                document.getElementById('work-minigame').style.display = 'flex';
                document.getElementById('work-score-val').innerText = "0";
                STATE.screen = 'minigame';

                nextWorkItem();

                // Timer Loop
                if (workState.interval) clearInterval(workState.interval);
                workState.interval = setInterval(() => {
                    workState.timer -= 0.1;
                    const pct = (workState.timer / workState.maxTime) * 100;
                    document.getElementById('work-timer-bar').style.width = pct + "%";

                    if (workState.timer <= 0) {
                        finishWorkMinigame();
                    }
                }, 100);
            }

            function nextWorkItem() {
                const rand = Math.floor(Math.random() * WORK_ITEMS.length);
                workState.currentItem = WORK_ITEMS[rand];

                // Tampilkan Item
                const iconEl = document.getElementById('work-target-icon');
                const nameEl = document.getElementById('work-target-name');

                // Reset animasi
                iconEl.style.animation = 'none';
                iconEl.offsetHeight; /* trigger reflow */
                iconEl.style.animation = 'bounceIn 0.3s';

                iconEl.innerText = workState.currentItem.icon;
                nameEl.innerText = workState.currentItem.name;
            }

            function handleWorkSort(type) {
                if (!workState.active) return;

                if (workState.currentItem.type === type) {
                    // Benar
                    workState.score++;
                    document.getElementById('work-score-val').innerText = workState.score;
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    nextWorkItem();
                } else {
                    // Salah (Penalti Waktu)
                    workState.timer -= 2;
                    showToast("Salah Rak! (-2 Detik)");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                    // Visual shake
                    const card = document.querySelector('.work-card');
                    card.style.transform = "translateX(5px)";
                    setTimeout(() => card.style.transform = "translateX(0)", 100);
                }
            }

            function finishWorkMinigame() {
                clearInterval(workState.interval);
                workState.active = false;
                document.getElementById('work-minigame').style.display = 'none';
                STATE.screen = 'play';

                // Reward Logic
                const bonusMoney = workState.score * 100; // 100G per item
                const bonusExp = workState.score * 10;

                // --- UPDATE: WORKER PERK (TUNJANGAN LEMBUR) ---
                // Jika Role Worker, dapat bonus tambahan tetap
                let perkText = "";
                if (STATE.player.role === 'worker') {
                    bonusMoney += 500;
                    perkText = "\n(Termasuk Tunjangan Lembur +500G)";
                }

                STATE.player.money += bonusMoney;
                gainExp(bonusExp);
                STATE.player.str += 1; // Kerja fisik nambah STR

                // --- UPDATE: SKIP WAKTU KE 16:00 (PULANG KERJA) ---
                // Efek: Setelah kerja keras di minigame, waktu langsung sore dan shift selesai
                STATE.time = 1600;

                // Boss Reaction
                let reaction = "Kerja bagus. Gudang jadi rapi.";
                if (workState.score > 8) {
                    reaction = "Luar biasa! Kamu secepat kilat. Ini bonus untukmu.";
                    STATE.player.bossReputation += 2;
                } else if (workState.score < 3) {
                    reaction = "Lambat sekali... Kamu melamun ya?";
                    STATE.player.bossReputation -= 1;
                }

                showDialogue("LAPORAN KERJA",
                    `Skor: ${workState.score} Item\nBonus Minigame: ${bonusMoney} Gold\n\n(Waktu berlalu cepat saat bekerja... Tiba saatnya pulang pukul 16:00)\n\nBos: "${reaction}"`,
                    [{ text: "Absen Pulang (Terima Gaji)", action: closeDialogue }],
                    'images/job.png'
                );
            }

            function quitWorkMinigame() {
                clearInterval(workState.interval);
                workState.active = false;
                document.getElementById('work-minigame').style.display = 'none';
                STATE.screen = 'play';
            }

            // --- LOGIKA EVENT PELANGGAN (CUSTOMER SERVICE) ---
            function triggerCustomerEvent() {
                // Random Scenario
                const scenarios = [
                    {
                        type: 'angry_price',
                        npc: 'Pelanggan Ibu-ibu',
                        img: 'images/girl.png', // Placeholder
                        text: "Heh! Kenapa harga gandum di sini mahal sekali?! Di toko sebelah cuma 1000G, di sini 2000G! Kamu mau nipu ya?",
                        options: [
                            { text: "Jelaskan Kualitas (INT)", req: { stat: 'int', val: 10 }, outcome: 'success', msg: "Ibu, gandum kami impor premium. Bebas kutu dan lebih wangi.", reward: { rep: 2, tip: 0 } },
                            { text: "Beri Diskon (Rugi 500G)", action: 'discount', outcome: 'neutral', msg: "Ya sudah, khusus Ibu saya potong 500G dari gaji saya.", reward: { rep: 1, tip: 0 } },
                            { text: "Kalau gak punya uang jangan belanja bu", outcome: 'fail', msg: "Kurang ajar! Saya laporkan bosmu!", reward: { rep: -5, tip: 0 } }
                        ]
                    },
                    {
                        type: 'scam_check',
                        npc: 'Pelanggan Curiga',
                        img: 'images/peer3.png',
                        text: "Ini Pedang Besi asli bukan? Kok warnanya agak pudar? Jangan-jangan ini barang rongsokan dari Dungeon yang dicat ulang!",
                        options: [
                            { text: "Tunjukkan Cap Pabrik (BIZ)", req: { stat: 'biz', val: 10 }, outcome: 'success', msg: "Lihat cap ini Pak. Ini buatan Blacksmith Lina asli.", reward: { rep: 2, tip: 200 } },
                            { text: "Sumpah Pak, ini asli!", outcome: 'neutral', msg: "Hmm... ya sudah saya percaya. Awas kalau patah.", reward: { rep: 0, tip: 0 } },
                            { text: "Marah balik", outcome: 'fail', msg: "Pelayan kok galak! Saya gak jadi beli!", reward: { rep: -3, tip: 0 } }
                        ]
                    },
                    {
                        type: 'happy_customer',
                        npc: 'Pelanggan Kaya',
                        img: 'images/lover_matre_boy.png',
                        text: "Pelayanan di sini cepat ya. Tolong bungkuskan 10 Permata, saya buru-buru mau melamar pacar saya.",
                        options: [
                            { text: "Bungkus Rapi (STR)", req: { stat: 'str', val: 15 }, outcome: 'success', msg: "Cepat dan rapi! Ini tip buat kamu.", reward: { rep: 3, tip: 1000 } },
                            { text: "Siap Pak", outcome: 'neutral', msg: "Terima kasih. Kembaliannya ambil saja.", reward: { rep: 1, tip: 100 } }
                        ]
                    }
                ];

                const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

                // Build Options dynamically
                const dialogOpts = scenario.options.map(opt => {
                    let label = opt.text;
                    // Cek requirement stat
                    if (opt.req) label += ` [${opt.req.stat.toUpperCase()} ${opt.req.val}+]`;

                    return {
                        text: label,
                        action: () => {
                            let success = true;

                            // Cek stat requirement
                            if (opt.req) {
                                const pStat = STATE.player[opt.req.stat] || 0;
                                if (pStat < opt.req.val) {
                                    success = false;
                                    showToast(`Gagal! Butuh ${opt.req.stat.toUpperCase()} ${opt.req.val}`);
                                }
                            }

                            // Special Actions
                            if (success && opt.action === 'discount') {
                                if (STATE.player.money >= 500) {
                                    STATE.player.money -= 500;
                                    showToast("Anda menalangi 500G.");
                                } else {
                                    success = false;
                                    showToast("Uangmu tidak cukup untuk nalangin!");
                                }
                            }

                            // Result
                            if (success) {
                                // Apply Rewards
                                STATE.player.bossReputation += opt.reward.rep;
                                if (opt.reward.tip > 0) {
                                    STATE.player.money += opt.reward.tip;
                                    showToast(`Dapat Tip +${opt.reward.tip}G!`);
                                }

                                // Show outcome dialog
                                showDialogue(scenario.npc, opt.msg, [{ text: "Kembali Kerja", action: closeDialogue }], scenario.img);
                            } else {
                                // Failed stat check fallback
                                STATE.player.bossReputation -= 2;
                                showDialogue(scenario.npc, "Kamu ngomong apa sih? Gak jelas! (Pelanggan Kecewa)", [{ text: "Maaf...", action: closeDialogue }], scenario.img);
                            }
                        }
                    };
                });

                dialogOpts.push({
                    text: "Abaikan (Rep -1)", action: () => {
                        STATE.player.bossReputation -= 1;
                        closeDialogue();
                    }
                });

                showDialogue(scenario.npc, scenario.text, dialogOpts, scenario.img);
            }

            // ══════════════════════════════════════════════════════════════
            // 💥 SISTEM KONFLIK TEMPAT KERJA
            // Konflik muncul random saat shift aktif, mempengaruhi bossReputation
            // Rep tinggi → bonus gaji, promosi. Rep rendah → peringatan, pecat.
            // ══════════════════════════════════════════════════════════════

            const WORK_CONFLICTS = {
                // ── FULL-TIME: MERCHANT (boss_merchant / Pak Hendra) ──────────────
                fulltime: [
                    {
                        id: 'fc_telat',
                        title: '⏰ Terlambat Masuk',
                        text: 'Pak Hendra memanggil kamu ke ruangannya.\n\n"Kamu terlambat 30 menit hari ini. Ini bukan pertama kali. Saya butuh penjelasan!"',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🙏 Minta maaf dengan tulus dan berjanji berubah',
                                outcome: 'good',
                                msg: '"Saya hargai kejujuranmu. Tapi jangan terulang lagi! Reputasimu masih bisa saya pertahankan."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Meminta maaf dengan tulus dan berkomitmen memperbaiki diri adalah sikap profesional yang dihargai atasan.'
                            },
                            {
                                text: '📱 Beri alasan macet dan tunjukkan bukti foto',
                                req: { stat: 'int', val: 12 },
                                outcome: 'neutral',
                                msg: '"Hmm, ada buktinya. Oke, kali ini saya maklumi. Tapi cari solusi alternatif ke depannya."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Alasan yang valid perlu didukung bukti. Inisiatif mencari solusi alternatif lebih dihargai daripada sekadar alasan.'
                            },
                            {
                                text: '😤 Protes balik — "Kemarin saya lembur Pak!"',
                                outcome: 'bad',
                                msg: '"Lembur kemarin tidak ada hubungannya dengan keterlambatan hari ini! Surat peringatan pertama kamu terbit!"',
                                rep: -10, money: 0,
                                lesson: '📚 PELAJARAN: Membela diri dengan menyerang balik hanya memperburuk konflik. Di dunia kerja, timing dan cara merespons sangat penting.'
                            }
                        ]
                    },
                    {
                        id: 'fc_rekan',
                        title: '👥 Konflik dengan Rekan Kerja',
                        text: 'Pak Hendra memanggilmu.\n\n"Saya dengar kamu dan Rudi berselisih soal pembagian tugas gudang. Dia bilang kamu tidak mau membantu. Ceritakan versiku."',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🤝 Akui kesalahan dan tawarkan mediasi bersama',
                                outcome: 'good',
                                msg: '"Bagus! Karyawan yang dewasa bisa menyelesaikan konflik secara konstruktif. Saya catat ini positif."',
                                rep: +8, money: 0,
                                lesson: '📚 PELAJARAN: Menyelesaikan konflik secara dewasa dan proaktif menunjukkan kematangan emosional yang sangat dihargai di tempat kerja.'
                            },
                            {
                                text: '📋 Jelaskan pembagian tugas berdasarkan fakta',
                                req: { stat: 'int', val: 15 },
                                outcome: 'neutral',
                                msg: '"Data pembagianmu masuk akal. Saya akan bicara dengan Rudi juga. Tapi cobalah lebih komunikatif ke depannya."',
                                rep: +3, money: 0,
                                lesson: '📚 PELAJARAN: Fakta dan data membantu penyelesaian konflik secara objektif, tapi komunikasi aktif sejak awal mencegah konflik terjadi.'
                            },
                            {
                                text: '🗣️ Balik menyalahkan Rudi sepenuhnya',
                                outcome: 'bad',
                                msg: '"Ini bukan sidang! Saya tidak suka kamu lempar tanggung jawab. Kerja sama tim adalah kewajiban, bukan pilihan!"',
                                rep: -12, money: 0,
                                lesson: '📚 PELAJARAN: Menyalahkan rekan kerja hanya memperburuk hubungan tim. Atasan menghargai karyawan yang mengambil tanggung jawab, bukan yang mencari kambing hitam.'
                            }
                        ]
                    },
                    {
                        id: 'fc_stok',
                        title: '📦 Kesalahan Stok Barang',
                        text: 'Pak Hendra datang dengan wajah tegang.\n\n"Ada ketidakcocokan stok 15 unit Beras Premium. Laporan kamu kemarin bilang stok aman, tapi sekarang kosong. Apa yang terjadi?!"',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🔍 Lakukan audit dan laporkan temuan secara transparan',
                                req: { stat: 'int', val: 10 },
                                outcome: 'good',
                                msg: '"Terima kasih sudah transparan dan proaktif! Ternyata memang ada bug di sistem input. Kamu tidak bersalah, dan saya hargai inisiatifmu."',
                                rep: +10, money: 500,
                                lesson: '📚 PELAJARAN: Transparansi dan inisiatif menyelesaikan masalah adalah karakter karyawan terbaik. Atasan menghargai kejujuran meski hasilnya tidak enak.'
                            },
                            {
                                text: '😓 Minta maaf dan berjanji teliti lebih hati-hati',
                                outcome: 'neutral',
                                msg: '"Baiklah. Saya minta kamu double-check setiap laporan mulai besok. Ini jadi catatan kinerja kamu."',
                                rep: -3, money: 0,
                                lesson: '📚 PELAJARAN: Minta maaf itu penting, tapi tanpa solusi konkret hanya mengurangi kepercayaan. Selalu sertakan rencana perbaikan.'
                            },
                            {
                                text: '🤷 Bilang itu bukan tanggung jawabmu',
                                outcome: 'bad',
                                msg: '"Kamu yang bertugas input stok hari itu! Surat Peringatan resmi keluar sekarang. Jika sekali lagi, kamu saya keluarkan!"',
                                rep: -18, money: -1000,
                                lesson: '📚 PELAJARAN: Menghindari tanggung jawab adalah salah satu alasan paling umum seseorang kehilangan pekerjaan. Kepercayaan atasan dibangun dari akuntabilitas.'
                            }
                        ]
                    },
                    {
                        id: 'fc_lembur',
                        title: '🌙 Diminta Lembur Mendadak',
                        text: 'Pak Hendra menghampirimu menjelang pulang.\n\n"Kita ada kiriman besar malam ini. Kamu bisa lembur 2 jam? Ada kompensasi tentu saja."',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '✅ Setuju lembur dengan semangat',
                                outcome: 'good',
                                msg: '"Luar biasa! Ini yang saya harapkan dari karyawan terbaik. Kompensasi akan saya proses besok."',
                                rep: +10, money: 2000,
                                lesson: '📚 PELAJARAN: Fleksibilitas dan dedikasi saat dibutuhkan membangun reputasi kerja keras yang berharga untuk karir jangka panjang.'
                            },
                            {
                                text: '🤔 Minta kejelasan kompensasi dulu sebelum setuju',
                                req: { stat: 'int', val: 8 },
                                outcome: 'neutral',
                                msg: '"Pertanyaan bagus dan profesional! Lembur 2 jam = 1.500 G. Setuju? Kamu tahu hak kamu."',
                                rep: +4, money: 1500,
                                lesson: '📚 PELAJARAN: Menanyakan kompensasi lembur adalah hak karyawan yang dijamin UU. Karyawan yang paham haknya justru dihormati atasan yang profesional.'
                            },
                            {
                                text: '❌ Menolak tanpa alasan jelas',
                                outcome: 'bad',
                                msg: '"Baik, tidak apa-apa. Tapi saya catat ini dalam evaluasi kinerja kamu. Dedikasi itu penting."',
                                rep: -7, money: 0,
                                lesson: '📚 PELAJARAN: Menolak lembur boleh saja, tapi harus dengan alasan yang jelas. Komunikasi yang baik menjaga hubungan kerja tetap profesional.'
                            }
                        ]
                    },
                    {
                        id: 'fc_gosip',
                        title: '🗣️ Terseret Gosip Kantor',
                        text: 'Pak Hendra memanggilmu dengan serius.\n\n"Saya dengar kamu menyebarkan informasi tentang rencana restrukturisasi perusahaan ke karyawan lain. Apa benar?"',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🤐 Jujur bahwa tidak sengaja dan berjanji menjaga kerahasiaan',
                                outcome: 'good',
                                msg: '"Saya menghargai kejujuranmu. Informasi internal harus dijaga. Kali ini saya maafkan, tapi ingat — kerahasiaan adalah profesionalisme."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Kerahasiaan informasi perusahaan (confidentiality) adalah kewajiban etis setiap karyawan. Melanggar dapat berujung pada pemutusan hubungan kerja.'
                            },
                            {
                                text: '🛡️ Jelaskan bahwa itu hanya diskusi umum, bukan gosip',
                                req: { stat: 'rep', val: 20 },
                                outcome: 'neutral',
                                msg: '"Hmm, reputasimu selama ini baik. Saya percaya niatmu tidak buruk. Tapi hati-hati ke depan."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Reputasi yang baik bisa jadi "tameng" dalam situasi sulit. Membangun kepercayaan sejak awal sangat penting.'
                            },
                            {
                                text: '😠 Menyangkal keras dan balik menuduh rekan lain',
                                outcome: 'bad',
                                msg: '"Kamu menyangkal fakta dan menyerang orang lain. Ini sangat tidak profesional. SP2 kamu terbit hari ini!"',
                                rep: -15, money: 0,
                                lesson: '📚 PELAJARAN: Menyangkal dan menyerang orang lain saat konfrontasi hanya memperburuk situasi. Sikap defensif menghancurkan kepercayaan atasan.'
                            }
                        ]
                    },
                    {
                        id: 'fc_promosi',
                        title: '🏆 Evaluasi Kinerja Tahunan',
                        text: 'Pak Hendra duduk bersamamu.\n\n"Waktunya evaluasi kinerja. Berdasarkan catatan saya, kamu cukup konsisten. Tapi ada hal yang perlu kita diskusikan untuk mendapat promosi..."',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '📊 Presentasi pencapaian dengan data dan rencana ke depan',
                                req: { stat: 'int', val: 15 },
                                outcome: 'good',
                                msg: '"Impressive! Kamu sudah berpikir seperti seorang manajer. Saya rekomendasikan kamu untuk promosi jabatan!"',
                                rep: +20, money: 5000, promote: true,
                                lesson: '📚 PELAJARAN: Evaluasi kinerja adalah kesempatan emas. Karyawan yang datang dengan data pencapaian dan rencana jelas jauh lebih mungkin mendapat promosi.'
                            },
                            {
                                text: '😊 Berterima kasih dan minta feedback perbaikan',
                                outcome: 'neutral',
                                msg: '"Sikap yang baik! Saya suka karyawan yang mau belajar. Kamu masih perlu 1-2 bulan lagi untuk promosi, tapi kamu di jalur yang benar."',
                                rep: +10, money: 1000,
                                lesson: '📚 PELAJARAN: Meminta feedback adalah tanda kematangan profesional. Karyawan yang mau terus belajar lebih cepat berkembang dalam karir.'
                            },
                            {
                                text: '💰 Langsung tuntut kenaikan gaji tanpa diskusi',
                                outcome: 'bad',
                                msg: '"Permintaan kenaikan gaji tanpa prestasi yang mendukung? Kamu perlu introspeksi dulu sebelum tuntut lebih."',
                                rep: -8, money: 0,
                                lesson: '📚 PELAJARAN: Menuntut kenaikan gaji tanpa dasar prestasi yang jelas menunjukkan kurangnya pemahaman tentang dinamika profesional.'
                            }
                        ]
                    }
                ],
                // ── PART-TIME: BENGKEL (Bang Joko) ────────────────────────────────
                bengkel: [
                    {
                        id: 'pt_b_rusak',
                        title: '🔨 Alat Kerja Rusak',
                        text: 'Bang Joko memanggil kamu.\n\n"Palu tempa yang kamu pakai tadi kepala-nya copot dan hampir kena kaki pelanggan. Untung tidak ada yang cedera. Kamu tidak cek dulu sebelum pakai?"',
                        img: 'images/blacksmith.png',
                        options: [
                            {
                                text: '🙏 Minta maaf dan usulkan SOP pengecekan alat rutin',
                                req: { stat: 'int', val: 10 },
                                outcome: 'good',
                                msg: '"Ide yang bagus! Kalau kamu buat SOP-nya, itu inisiatif luar biasa untuk anak magang. Saya tambah bonus hari ini."',
                                rep: +8, money: 500,
                                lesson: '📚 PELAJARAN: Mengubah kesalahan menjadi perbaikan sistem menunjukkan mentalitas problem-solver yang dihargai di tempat kerja manapun.'
                            },
                            {
                                text: '😅 Minta maaf dan berjanji lebih teliti',
                                outcome: 'neutral',
                                msg: '"Oke, lain kali cek dulu kondisi alat sebelum dipakai. Keselamatan kerja bukan main-main di sini."',
                                rep: -2, money: 0,
                                lesson: '📚 PELAJARAN: Keselamatan dan kesehatan kerja (K3) adalah prioritas utama di lingkungan industri. Pengecekan alat adalah prosedur wajib.'
                            },
                            {
                                text: '🤷 "Palu-nya memang sudah longgar dari tadi Bang"',
                                outcome: 'bad',
                                msg: '"Kalau tahu sudah longgar, kenapa tidak lapor?! Ini bukan soal siapa yang salah — ini soal keselamatan orang! Saya kurangi gaji hari ini."',
                                rep: -15, money: -500,
                                lesson: '📚 PELAJARAN: Mengetahui risiko tapi tidak melaporkan adalah kelalaian serius. Di industri, ini bisa berujung pada sanksi hukum, bukan sekadar teguran.'
                            }
                        ]
                    },
                    {
                        id: 'pt_b_pesanan',
                        title: '📋 Pesanan Salah Ukuran',
                        text: 'Bang Joko cemberut.\n\n"Pelanggan tadi komplain. Pedang yang dia pesan ukuran L, tapi yang kamu kerjakan ukuran M. Ini membuang material dan waktu!"',
                        img: 'images/blacksmith.png',
                        options: [
                            {
                                text: '📝 Ambil tanggung jawab dan tawarkan mengerjakan ulang tanpa tambah biaya',
                                req: { stat: 'str', val: 10 },
                                outcome: 'good',
                                msg: '"Nah itu baru namanya bertanggung jawab! Saya suka. Pelanggan puas, reputasi toko terjaga. Bagus!"',
                                rep: +10, money: 0,
                                lesson: '📚 PELAJARAN: Service recovery yang cepat dan tulus bisa mengubah pelanggan yang kecewa menjadi pelanggan setia. Tanggung jawab adalah fondasi kepercayaan.'
                            },
                            {
                                text: '🔍 Cek ulang catatan pesanan dan tunjukkan fakta',
                                outcome: 'neutral',
                                msg: '"Hmm, ternyata catatannya memang ambigu. Kali ini kita sama-sama salah. Besok buat sistem konfirmasi ulang pesanan."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Dokumentasi yang jelas mencegah miskomunikasi. Sistem konfirmasi pesanan adalah standar profesional di bisnis manapun.'
                            },
                            {
                                text: '😤 Bilang pelanggannya yang salah pesan',
                                outcome: 'bad',
                                msg: '"Di toko saya, pelanggan selalu benar! Kamu kerja untuk melayani, bukan berdebat. Awas kalau terulang!"',
                                rep: -12, money: 0,
                                lesson: '📚 PELAJARAN: Mentalitas "pelanggan adalah raja" bukan berarti membiarkan pelanggan salah — tapi memastikan komunikasi berjalan baik sejak awal.'
                            }
                        ]
                    },
                    {
                        id: 'pt_b_senior',
                        title: '😤 Senioritas dan Tekanan',
                        text: 'Roni, pegawai senior bengkel, sering menyuruhmu mengerjakan tugas berat yang bukan bagianmu. Hari ini Bang Joko melihatnya.\n\n"Hei, ada apa ini?"',
                        img: 'images/blacksmith.png',
                        options: [
                            {
                                text: '🗣️ Ceritakan situasi dengan tenang dan objektif',
                                outcome: 'good',
                                msg: '"Terima kasih sudah lapor! Roni memang harus tahu batas. Kamu bagian dari tim ini, bukan bawahan personal siapapun."',
                                rep: +7, money: 0,
                                lesson: '📚 PELAJARAN: Senioritas bukan alasan untuk mengeksploitasi junior. Melaporkan dengan cara yang tepat adalah hak dan langkah yang benar.'
                            },
                            {
                                text: '🤝 Bilang tidak apa-apa, kamu senang membantu',
                                outcome: 'neutral',
                                msg: '"Kamu terlalu baik hati! Ingat, kerja keras itu baik, tapi kenali batasanmu agar tidak terbakar. Saya akan bicara dengan Roni."',
                                rep: +1, money: 0,
                                lesson: '📚 PELAJARAN: Menerima semua beban kerja demi dianggap "baik" bisa berujung burnout. Mengenali batasan adalah bentuk manajemen diri yang sehat.'
                            },
                            {
                                text: '😠 Konfrontasi langsung dan emosional dengan Roni',
                                outcome: 'bad',
                                msg: '"Hei! Jangan ribut di depan pelanggan! Urus masalah kalian di luar waktu kerja. Kamu dapat SP hari ini!"',
                                rep: -10, money: 0,
                                lesson: '📚 PELAJARAN: Konflik di tempat kerja harus diselesaikan melalui jalur yang tepat. Konfrontasi emosional di depan umum merusak citra profesional kamu.'
                            }
                        ]
                    }
                ],
                // ── PART-TIME: PENJAHIT (Marine) ──────────────────────────────────
                penjahit: [
                    {
                        id: 'pt_p_pelanggan',
                        title: '👗 Komplain Jahitan Tidak Rapi',
                        text: 'Marine memanggilmu.\n\n"Bu Sari mengeluh bahwa jahitan di bagian lengan baju pesanannya tidak rapi dan benangnya sudah lepas. Dia sangat kecewa."',
                        img: 'images/marine.png',
                        options: [
                            {
                                text: '🧵 Minta maaf dan segera perbaiki dengan gratis',
                                outcome: 'good',
                                msg: '"Perfect! Pelayanan seperti ini yang membuat pelanggan kembali lagi. Bu Sari malah memuji responsmu. Bagus sekali!"',
                                rep: +10, money: 300,
                                lesson: '📚 PELAJARAN: Pelayanan purna jual yang responsif adalah pembeda bisnis berkualitas. 1 pelanggan puas bisa bawa 10 pelanggan baru.'
                            },
                            {
                                text: '🔍 Periksa apakah itu jahitanmu atau jahitan orang lain',
                                req: { stat: 'int', val: 8 },
                                outcome: 'neutral',
                                msg: '"Ternyata itu hasil jahitan minggu lalu bukan kamu. Tapi kamu harus tetap bantu perbaiki ya — kita satu tim di sini."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Meski bukan kesalahan kamu, membantu menyelesaikan masalah tim menunjukkan solidaritas dan profesionalisme.'
                            },
                            {
                                text: '😤 Bilang itu bukan jahitanmu jadi bukan tanggung jawabmu',
                                outcome: 'bad',
                                msg: '"Di sini, kita bertanggung jawab bersama! Sikap seperti itu tidak ada tempat di usahaku. Kurangi upah hari ini!"',
                                rep: -12, money: -500,
                                lesson: '📚 PELAJARAN: Tanggung jawab kolektif adalah budaya kerja yang penting. Menghindari masalah tim membuat kamu terlihat tidak kooperatif.'
                            }
                        ]
                    },
                    {
                        id: 'pt_p_deadline',
                        title: '⏰ Deadline Pesanan Mendesak',
                        text: 'Marine terlihat panik.\n\n"Ada pesanan baju pengantin yang harus selesai besok pagi, tapi kita ketinggalan! Kamu bisa bantu lembur malam ini?"',
                        img: 'images/marine.png',
                        options: [
                            {
                                text: '✅ Setuju lembur dan bagi strategi pengerjaan efisien',
                                req: { stat: 'int', val: 12 },
                                outcome: 'good',
                                msg: '"Kamu luar biasa! Strategi pembagian pola yang kamu usul memotong waktu 2 jam. Bonus khusus malam ini!"',
                                rep: +12, money: 1500,
                                lesson: '📚 PELAJARAN: Di saat krisis, karyawan yang datang dengan solusi — bukan hanya kesediaan — adalah aset terbesar.'
                            },
                            {
                                text: '✅ Setuju lembur meski lelah',
                                outcome: 'neutral',
                                msg: '"Terima kasih! Kamu tim yang solid. Pesanan selesai tepat waktu dan pelanggan sangat senang."',
                                rep: +8, money: 1000,
                                lesson: '📚 PELAJARAN: Komitmen saat dibutuhkan membangun kepercayaan yang tidak bisa dibeli dengan apapun di lingkungan kerja.'
                            },
                            {
                                text: '❌ Menolak karena sudah terlalu lelah',
                                outcome: 'bad',
                                msg: '"Saya mengerti kamu lelah... tapi pelanggan kita kecewa. Kita kehilangan kepercayaan mereka malam ini."',
                                rep: -5, money: 0,
                                lesson: '📚 PELAJARAN: Menjaga energi itu penting, tapi di momen kritis, pertimbangkan dampak ke tim dan pelanggan. Komunikasi lebih awal bisa mencegah situasi ini.'
                            }
                        ]
                    },
                    {
                        id: 'pt_p_bahan',
                        title: '🧶 Bahan Kain Habis Saat Kritis',
                        text: 'Marine menatap lemari bahan dengan cemas.\n\n"Kain batik tulis untuk pesanan Bu Mira habis! Supplier belum tentu bisa kirim sebelum besok. Kamu ada ide?"',
                        img: 'images/marine.png',
                        options: [
                            {
                                text: '💡 Usulkan alternatif kain yang similar dengan approval pelanggan',
                                req: { stat: 'int', val: 10 },
                                outcome: 'good',
                                msg: '"Ide brilian! Bu Mira setuju dengan alternatifnya malah suka lebih. Kamu sudah berpikir seperti seorang pengusaha!"',
                                rep: +10, money: 800,
                                lesson: '📚 PELAJARAN: Kreativitas dalam menyelesaikan masalah — apalagi yang melibatkan keputusan bersama pelanggan — adalah skill wirausaha tingkat tinggi.'
                            },
                            {
                                text: '📞 Hubungi supplier darurat meski mahal',
                                outcome: 'neutral',
                                msg: '"Sedikit mahal tapi pesanan tetap selesai. Lain kali kita perlu sistem monitoring stok yang lebih baik."',
                                rep: +4, money: 0,
                                lesson: '📚 PELAJARAN: Manajemen stok yang baik mencegah situasi kritis. Selalu siapkan supplier cadangan sebagai antisipasi.'
                            },
                            {
                                text: '🤷 Bilang itu bukan tanggung jawab kamu',
                                outcome: 'bad',
                                msg: '"Di sini semua adalah tanggung jawab tim! Sikap pasif seperti itu tidak berguna di saat krisis."',
                                rep: -10, money: 0,
                                lesson: '📚 PELAJARAN: Bersikap pasif di saat krisis membuat kamu tidak berharga di mata tim. Kontribusi aktif, meski kecil, selalu lebih baik.'
                            }
                        ]
                    }
                ],
                // ── PART-TIME: KLINIK (Dr. Budi) ──────────────────────────────────
                klinik: [
                    {
                        id: 'pt_k_privasi',
                        title: '🔒 Kerahasiaan Data Pasien',
                        text: 'Dr. Budi memanggilmu dengan serius.\n\n"Saya dengar kamu sempat cerita ke temanmu soal kondisi pasien yang tadi datang. Apakah benar?"',
                        img: 'images/lover1boy.png',
                        options: [
                            {
                                text: '🙏 Akui kesalahan dan minta maaf — tidak akan terulang',
                                outcome: 'good',
                                msg: '"Saya hargai kejujuranmu. Kerahasiaan pasien adalah hukum, bukan sekadar aturan. Kali ini saya maafkan. Jangan terulang."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Kerahasiaan data pasien (patient confidentiality) dilindungi oleh UU Kesehatan. Melanggarnya bisa berujung pada sanksi hukum dan pencabutan izin kerja.'
                            },
                            {
                                text: '🛡️ Jelaskan tidak ada identitas spesifik yang disebutkan',
                                req: { stat: 'int', val: 12 },
                                outcome: 'neutral',
                                msg: '"Memang ada gradasi, tapi lebih aman hindari sama sekali. Di bidang kesehatan, privasi adalah prioritas mutlak."',
                                rep: +1, money: 0,
                                lesson: '📚 PELAJARAN: Bahkan data yang "tidak identifiable" tetap bisa melanggar privasi. Standar di bidang kesehatan sangat ketat untuk alasan yang sangat penting.'
                            },
                            {
                                text: '😤 Menyangkal keras bahwa kamu tidak melakukan itu',
                                outcome: 'bad',
                                msg: '"Saya punya konfirmasi dari pihak ketiga. Berbohong membuat situasinya jauh lebih serius. SP tertulis dikeluarkan hari ini!"',
                                rep: -20, money: 0,
                                lesson: '📚 PELAJARAN: Berbohong saat dihadapkan pada bukti adalah kesalahan terbesar. Kejujuran, meski pahit, selalu lebih baik untuk reputasi jangka panjang.'
                            }
                        ]
                    },
                    {
                        id: 'pt_k_salah_obat',
                        title: '💊 Hampir Salah Siapkan Obat',
                        text: 'Dr. Budi menghentikanmu tepat waktu.\n\n"Stop! Obat yang kamu ambil itu Amoxicillin 500mg, bukan yang 250mg untuk pasien anak ini. Kamu hampir buat kesalahan serius!"',
                        img: 'images/lover1boy.png',
                        options: [
                            {
                                text: '😰 Minta maaf dengan sungguh-sungguh dan minta sistem double-check',
                                outcome: 'good',
                                msg: '"Terima kasih sudah jujur dan proaktif. Sistem double-check memang harus kita terapkan. Kamu belajar dari hampir-kesalahan, itu sikap yang benar."',
                                rep: +8, money: 0,
                                lesson: '📚 PELAJARAN: Sistem double-check dalam farmasi adalah standar internasional. Near-miss (hampir salah) harus dilaporkan dan dijadikan pembelajaran, bukan ditutupi.'
                            },
                            {
                                text: '😓 Minta maaf dan bilang masih bingung label obat',
                                outcome: 'neutral',
                                msg: '"Kalau bingung, tanya dulu! Jangan pernah ragu bertanya di bidang medis. Saya akan buatkan panduan pengelompokan obat untukmu."',
                                rep: -3, money: 0,
                                lesson: '📚 PELAJARAN: Di bidang medis, bertanya adalah kewajiban profesional. Tidak tahu dan tidak bertanya adalah kombinasi paling berbahaya.'
                            },
                            {
                                text: '🤥 Pura-pura tahu dan bilang itu tidak akan terjadi lagi',
                                outcome: 'bad',
                                msg: '"Attitude seperti ini yang berbahaya di klinik. Kamu tidak bisa pura-pura di sini. Satu kesalahan bisa renggut nyawa. Kamu saya nonaktifkan hari ini."',
                                rep: -25, money: 0,
                                lesson: '📚 PELAJARAN: Kepura-puraan kompeten (fake it till you make it) tidak berlaku di profesi yang menyangkut keselamatan jiwa. Kejujuran adalah kompetensi pertama.'
                            }
                        ]
                    },
                    {
                        id: 'pt_k_pasien_sulit',
                        title: '😡 Pasien Kasar dan Tidak Sabar',
                        text: 'Seorang pasien marah besar di depanmu.\n\n"Saya sudah nunggu 1 jam lebih! Pelayanan klinik ini payah! Kamu juga tidak ada gunanya di sini!"',
                        img: 'images/lover1boy.png',
                        options: [
                            {
                                text: '💬 Tetap tenang, empati, dan jelaskan situasi antrean',
                                req: { stat: 'reputation', val: 15 },
                                outcome: 'good',
                                msg: 'Pasien mulai tenang. Dr. Budi yang melihat dari jauh tersenyum bangga.\n"Respons terbaikmu sampai saat ini. Kamu punya bakat di bidang ini!"',
                                rep: +12, money: 500,
                                lesson: '📚 PELAJARAN: Empati dan komunikasi yang tenang saat menghadapi pasien yang emosional adalah skill kritis di bidang kesehatan. Ini disebut "de-escalation".'
                            },
                            {
                                text: '🤝 Minta maaf atas penantian dan tawarkan air minum',
                                outcome: 'neutral',
                                msg: '"Kamu berhasil menenangkan situasi. Tindakan kecil seperti menawarkan air menunjukkan kamu peduli pada kenyamanan pasien."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Tindakan kecil yang tulus dalam melayani bisa mengubah pengalaman negatif pasien menjadi positif.'
                            },
                            {
                                text: '😤 Membalas dengan nada defensif',
                                outcome: 'bad',
                                msg: '"Tidak boleh! Di sini pasien adalah prioritas, apapun kondisinya. Attitude seperti itu bisa menghancurkan reputasi klinik!"',
                                rep: -15, money: 0,
                                lesson: '📚 PELAJARAN: Membalas emosi dengan emosi di fasilitas kesehatan adalah pelanggaran etika profesi. Pasien yang sakit secara emosional perlu lebih banyak empati, bukan perlawanan.'
                            }
                        ]
                    }
                ]
            };

            // Tracker konflik hari ini
            function getConflictKey() {
                const jobType = STATE.player.partTimeJob ? 'pt_' + STATE.player.partTimeJob : 'ft';
                return `conflict_day_${STATE.day}_${jobType}`;
            }

            function hasConflictToday() {
                return STATE.player.todayConflict && STATE.player.todayConflict === getConflictKey();
            }

            function markConflictToday() {
                STATE.player.todayConflict = getConflictKey();
            }

            // Pilih konflik random sesuai pekerjaan
            function getRandomConflict(isPartTime, jobKey) {
                let pool;
                if (isPartTime) {
                    pool = WORK_CONFLICTS[jobKey] || [];
                } else {
                    pool = WORK_CONFLICTS.fulltime || [];
                }
                if (pool.length === 0) return null;
                const idx = Math.floor(Math.random() * pool.length);
                return pool[idx];
            }

            // ── TRIGGER KONFLIK KERJA ──────────────────────────────────────────
            function triggerWorkConflict(isPartTime, jobKey) {
                if (hasConflictToday()) return; // Maksimal 1 konflik per hari

                const conflict = getRandomConflict(isPartTime, jobKey);
                if (!conflict) return;

                markConflictToday();

                const jobData = isPartTime ? (PART_TIME_JOBS[jobKey] || {}) : { img: 'images/job.png', name: 'Merchant' };
                const imgSrc = isPartTime ? (jobData.img || 'images/job.png') : 'images/job.png';
                const bossName = isPartTime ? (jobData.name || 'Bos') : 'Pak Hendra (Bos Merchant)';

                const opts = conflict.options.map(opt => {
                    let label = opt.text;
                    if (opt.req) label += ` [${opt.req.stat.toUpperCase()} ${opt.req.val}+]`;

                    return {
                        text: label,
                        action: () => {
                            let success = true;

                            // Cek stat requirement
                            if (opt.req) {
                                const statMap = { str: 'str', int: 'int', biz: 'biz', rep: 'reputation', reputation: 'reputation' };
                                const statKey = statMap[opt.req.stat] || opt.req.stat;
                                const pStat = STATE.player[statKey] || 0;
                                if (pStat < opt.req.val) {
                                    success = false;
                                }
                            }

                            const finalOutcome = success ? opt.outcome : 'bad';
                            const finalRep = success ? opt.rep : -8;
                            const finalMoney = success ? (opt.money || 0) : 0;
                            const finalMsg = success ? opt.msg : `Kemampuanmu belum cukup untuk merespons situasi ini. (Butuh ${opt.req ? opt.req.stat.toUpperCase() + ' ' + opt.req.val : '?'})\n\nBos kecewa dengan responmu.`;
                            const finalLesson = opt.lesson || '';

                            // Terapkan efek reputasi
                            STATE.player.bossReputation = Math.max(0, Math.min(100, (STATE.player.bossReputation || 50) + finalRep));

                            // Terapkan uang bonus/penalti
                            if (finalMoney !== 0) {
                                STATE.player.money = Math.max(0, STATE.player.money + finalMoney);
                                if (finalMoney > 0) showToast(`💰 Bonus Konflik: +${finalMoney.toLocaleString()} G`);
                                else showToast(`💸 Penalti: -${Math.abs(finalMoney).toLocaleString()} G`);
                            }

                            // Promosi jika ada flag
                            const doPromote = success && opt.promote;

                            // Cek ambang batas reputasi
                            const rep = STATE.player.bossReputation;
                            let repMsg = '';
                            if (rep <= 10) {
                                repMsg = '\n\n⚠️ REPUTASI SANGAT RENDAH! Bos mungkin akan memecatmu jika tidak ada perbaikan!';
                            } else if (rep <= 30) {
                                repMsg = '\n\n⚠️ Reputasimu dengan bos menurun drastis. Hati-hati!';
                            } else if (rep >= 90) {
                                repMsg = '\n\n🌟 Reputasimu luar biasa! Bos sangat puas dengan kinerjamu.';
                            }

                            // Icon berdasarkan outcome
                            const outcomeIcon = finalOutcome === 'good' ? '🎉' : finalOutcome === 'neutral' ? '😐' : '😔';

                            closeDialogue();
                            setTimeout(() => {
                                showDialogue(bossName,
                                    `${outcomeIcon} ${finalMsg}${repMsg}\n\n${finalLesson}\n\n📊 Reputasi dengan bos: ${Math.round(STATE.player.bossReputation)}/100`,
                                    [{
                                        text: doPromote ? '🏆 Promosi! Terima kasih Pak!' : 'Mengerti, terima kasih.',
                                        action: () => {
                                            closeDialogue();
                                            if (doPromote) {
                                                const maxLv = 4;
                                                if ((STATE.player.jobLevel || 1) < maxLv) {
                                                    STATE.player.jobLevel = (STATE.player.jobLevel || 1) + 1;
                                                    gainExp(100);
                                                    setTimeout(() => {
                                                        const titles = ['','Magang','Staff Senior','Kepala Gudang','Manajer Cabang'];
                                                        showDialogue('🏆 PROMOSI JABATAN!',
                                                            `Selamat! Kamu resmi dipromosikan!\n\nJabatan baru: **${titles[STATE.player.jobLevel]}**\n\nGaji harianmu otomatis naik mulai besok!\n\n🎊 +100 XP`,
                                                            [{ text: 'Terima kasih!', action: closeDialogue }], imgSrc
                                                        );
                                                    }, 400);
                                                }
                                            }
                                            checkBossReputationThreshold(isPartTime, jobKey, imgSrc, bossName);
                                        }
                                    }], imgSrc
                                );
                            }, 300);
                        }
                    };
                });

                opts.push({
                    text: '🚪 Kabur dari situasi (Rep -5)',
                    action: () => {
                        STATE.player.bossReputation = Math.max(0, (STATE.player.bossReputation || 50) - 5);
                        closeDialogue();
                        showToast('😰 Kamu menghindari konfrontasi. Rep -5');
                        checkBossReputationThreshold(isPartTime, jobKey, imgSrc, bossName);
                    }
                });

                showDialogue(`⚡ KONFLIK KERJA — ${conflict.title}`, conflict.text, opts, imgSrc);
            }

            // ── CEK AMBANG BATAS REPUTASI: BONUS / PERINGATAN / PECAT ───────────
            function checkBossReputationThreshold(isPartTime, jobKey, imgSrc, bossName) {
                const p = STATE.player;
                const rep = p.bossReputation || 50;

                // Jangan spam notifikasi — cek sudah pernah triggered hari ini
                const threshKey = `rep_thresh_${STATE.day}`;
                if (p.lastRepThreshDay === threshKey) return;

                // Dipecat jika rep <= 0
                if (rep <= 0) {
                    p.lastRepThreshDay = threshKey;
                    setTimeout(() => {
                        if (isPartTime) {
                            p.partTimeJob = null;
                            p.partTimeStatus = 'none';
                            p.partTimeShiftStarted = false;
                            showDialogue(`🚨 DIPECAT DARI PART-TIME`,
                                `"Saya sudah cukup sabar. Kamu tidak lagi cocok bekerja di sini.\n\nMulai besok, kamu tidak perlu datang lagi."\n\n💡 Kamu bisa melamar part-time di tempat lain dengan surat lamaran baru.`,
                                [{ text: 'Baik...' , action: closeDialogue }], imgSrc
                            );
                        } else {
                            p.jobStatus = 'fired';
                            p.shiftStarted = false;
                            showDialogue(`🚨 KAMU DIPECAT!`,
                                `Pak Hendra menghampirimu dengan wajah serius.\n\n"Kamu sudah diberikan banyak kesempatan, tapi tidak ada perubahan. Ini surat pemecatan resmimu."\n\n💡 Kamu bisa coba melamar kerja kembali setelah reputasimu pulih.\n\n📚 PELAJARAN: Di dunia nyata, reputasi profesional sangat sulit dibangun kembali setelah hancur. Jaga selalu sikap dan kinerjamu.`,
                                [{ text: 'Baik...' , action: closeDialogue }], imgSrc
                            );
                        }
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                    }, 500);
                    return;
                }

                // Peringatan keras jika rep antara 1–20
                if (rep > 0 && rep <= 20) {
                    p.lastRepThreshDay = threshKey;
                    setTimeout(() => {
                        showDialogue(`⚠️ PERINGATAN KERAS`,
                            `${bossName} memanggil kamu dengan ekspresi serius.\n\n"Reputasimu di sini sangat mengkhawatirkan. Ini peringatan terakhir sebelum saya mengambil keputusan."\n\n📊 Reputasi saat ini: ${Math.round(rep)}/100\n\n💡 Perbaiki sikapmu segera! Selesaikan konflik dengan baik untuk menaikkan reputasi.`,
                            [{ text: 'Saya akan berubah!', action: closeDialogue }], imgSrc
                        );
                    }, 500);
                    return;
                }

                // Bonus gaji jika rep >= 85
                if (rep >= 85) {
                    p.lastRepThreshDay = threshKey;
                    const bonusAmount = isPartTime ? 2000 : 5000;
                    p.money += bonusAmount;
                    setTimeout(() => {
                        showDialogue(`🎉 BONUS KINERJA LUAR BIASA!`,
                            `${bossName} memanggil kamu dengan senyum lebar.\n\n"Kamu adalah karyawan terbaik yang pernah saya punya! Kinerjamu konsisten dan sikapmu profesional. Ini bonus khusus untukmu!"\n\n💰 Bonus Kinerja: +${bonusAmount.toLocaleString()} G\n📊 Reputasi: ${Math.round(rep)}/100\n\n📚 PELAJARAN: Konsistensi dan sikap profesional adalah investasi terbaik dalam karir. Bonus dan promosi datang sendiri pada karyawan yang berintegritas.`,
                            [{ text: 'Terima kasih banyak!', action: closeDialogue }], imgSrc
                        );
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        gainExp(30);
                    }, 500);
                }
            }

            // ── HOOK: PANGGIL KONFLIK SAAT MULAI SHIFT ──────────────────────────
            // Dipanggil dari handleWorkerInteraction (full-time) dan showPartTimeWorkMenu
            function maybeShowWorkConflict(isPartTime, jobKey) {
                if (hasConflictToday()) return;
                // Probabilitas konflik: 65% setiap hari kerja
                const roll = Math.random();
                if (roll < 0.65) {
                    setTimeout(() => triggerWorkConflict(isPartTime, jobKey), 1500);
                }
            }

            // --- NEW: DATABASE MATERI KULIAH (EXPANDED TO 48 TOPICS - 2 YEARS FULL) ---
            // Logika: 1 Tahun = 120 Hari. Kuliah Spesial tiap 5 hari. Total = 24 Materi/Tahun.
            // UPDATE: MATERI LENGKAP & LEBIH MENDALAM (TEORI ASLI)
            const COURSE_MATERIALS = {
                'teknologi': [
                    // --- TAHUN PERTAMA (BASIC & DEV) ---
                    // SEMESTER 1 (Basic Computer Science)
                    {
                        t: "Algoritma & Pemrograman Dasar",
                        c: "DEFINISI:\nUrutan langkah logis penyelesaian masalah yang disusun secara sistematis.\n\n3 SYARAT ALGORITMA:\n1. Finiteness: Harus berhenti setelah sejumlah langkah.\n2. Definiteness: Setiap langkah harus jelas/tidak ambigu.\n3. Effectiveness: Langkah harus sederhana dan dapat dikerjakan.\n\nNOTASI:\n- Pseudocode (Kode semu)\n- Flowchart (Diagram alir)"
                    },
                    {
                        t: "Struktur Data (Data Structures)",
                        c: "KONSEP:\nCara penyimpanan, penyusunan, dan pengaturan data di dalam media penyimpanan komputer.\n\nTIPE DASAR:\n1. Array: Kumpulan data sejenis dengan indeks statis.\n2. Linked List: Rangkaian node yang saling menunjuk (dinamis).\n3. Stack: Tumpukan (LIFO - Last In First Out).\n4. Queue: Antrean (FIFO - First In First Out)."
                    },
                    {
                        t: "Basis Data (Database SQL)",
                        c: "RDBMS (Relational Database):\nPenyimpanan data dalam bentuk tabel yang saling berelasi.\n\nKUNCI UTAMA:\n- Primary Key (PK): Identitas unik setiap baris data.\n- Foreign Key (FK): Kunci tamu untuk menghubungkan antar tabel.\n\nNORMALISASI:\nProses pengelompokan atribut data untuk menghilangkan redundansi dan anomali data."
                    },
                    {
                        t: "Jaringan Komputer Dasar",
                        c: "MODEL OSI (7 LAYER):\n1. Physical (Kabel/Sinyal)\n2. Data Link (MAC Address)\n3. Network (IP Address/Routing)\n4. Transport (TCP/UDP)\n5. Session\n6. Presentation\n7. Application (HTTP/FTP)\n\nIP ADDRESS:\nAlamat unik perangkat dalam jaringan. IPv4 (32-bit) dan IPv6 (128-bit)."
                    },
                    {
                        t: "Keamanan Siber (Cyber Security)",
                        c: "CIA TRIAD:\n1. Confidentiality (Kerahasiaan): Data hanya boleh diakses yang berhak.\n2. Integrity (Keutuhan): Data tidak boleh diubah oleh pihak tak berwenang.\n3. Availability (Ketersediaan): Data harus bisa diakses saat dibutuhkan.\n\nANCAMAN UMUM:\n- Phishing (Pencurian info via manipulasi)\n- Malware (Virus/Ransomware)\n- DDoS (Serangan membanjiri trafik)"
                    },
                    {
                        t: "Kecerdasan Buatan (AI Basics)",
                        c: "DEFINISI:\nSimulasi kecerdasan manusia dalam mesin yang diprogram untuk berpikir dan meniru tindakannya.\n\nCABANG AI:\n1. Machine Learning: Mesin belajar dari data tanpa diprogram eksplisit.\n2. Neural Networks: Meniru cara kerja neuron otak manusia.\n3. NLP: Pemrosesan bahasa alami (teks/suara).\n4. Computer Vision: Analisis gambar/video."
                    },

                    // SEMESTER 2 (Development Skills)
                    {
                        t: "Pemrograman Web (Frontend & Backend)",
                        c: "ARSITEKTUR WEB:\n- Client-Side (Frontend): HTML (Struktur), CSS (Gaya), JS (Interaksi).\n- Server-Side (Backend): Node.js, PHP, Python, Database.\n\nHTTP REQUEST METHODS:\n- GET: Mengambil data.\n- POST: Mengirim data baru.\n- PUT: Update data.\n- DELETE: Hapus data."
                    },
                    {
                        t: "Pemrograman Mobile (Android/iOS)",
                        c: "NATIVE VS HYBRID:\n- Native: Java/Kotlin (Android), Swift (iOS). Performa tinggi, akses hardware penuh.\n- Hybrid/Cross-Platform: Flutter, React Native. Satu kode untuk semua platform.\n\nLIFECYCLE AKTIVITAS:\nCreate -> Start -> Resume -> Pause -> Stop -> Destroy."
                    },
                    {
                        t: "Cloud Computing",
                        c: "LAYANAN CLOUD:\n1. IaaS (Infrastructure): Sewa server/storage virtual (AWS EC2).\n2. PaaS (Platform): Lingkungan development siap pakai (Heroku).\n3. SaaS (Software): Aplikasi jadi via internet (Google Docs).\n\nMANFAAT:\nSkalabilitas (bisa diperbesar kapan saja) dan Efisiensi Biaya (Pay-as-you-go)."
                    },
                    {
                        t: "Internet of Things (IoT)",
                        c: "KONSEP:\nJaringan objek fisik yang tertanam dengan sensor, software, dan teknologi lain untuk bertukar data via internet.\n\nKOMPONEN UTAMA:\n1. Sensor/Actuator (Pengambil data/Penggerak).\n2. Connectivity (Wi-Fi, Bluetooth, Zigbee).\n3. Data Processing (Cloud/Edge).\n4. User Interface (Dashboard/App)."
                    },
                    {
                        t: "Teknologi Blockchain",
                        c: "PRINSIP DASAR:\nBuku besar (ledger) digital yang terdesentralisasi, terdistribusi, dan tidak dapat diubah (immutable).\n\nCARA KERJA:\nTransaksi dicatat dalam 'blok', dienkripsi (hash), dan dirangkai ke blok sebelumnya (chain). Jika satu blok diubah, seluruh rantai rusak (terdeteksi palsu)."
                    },
                    {
                        t: "Big Data Analytics",
                        c: "KARAKTERISTIK 3V:\n1. Volume: Jumlah data sangat besar.\n2. Velocity: Kecepatan data masuk sangat tinggi (real-time).\n3. Variety: Jenis data beragam (teks, video, log).\n\nTUJUAN:\nMenemukan pola tersembunyi, korelasi pasar, dan preferensi pelanggan untuk keputusan bisnis."
                    },

                    // --- TAHUN KEDUA (ADVANCED & SPECIALIZATION) ---
                    // SEMESTER 3 (Engineering & Ethics)
                    {
                        t: "User Interface (UI) & User Experience (UX)",
                        c: "UI (Tampilan):\nFokus pada estetika, warna, tipografi, dan tata letak visual.\n\nUX (Pengalaman):\nFokus pada kemudahan penggunaan, alur pengguna (user flow), dan kepuasan interaksi.\n\nPRINSIP DESAIN:\nKonsistensi, Feedback yang jelas, dan Minimalisir beban kognitif pengguna."
                    },
                    {
                        t: "Software Engineering (RPL)",
                        c: "SDLC (System Development Life Cycle):\n1. Planning (Perencanaan)\n2. Analysis (Analisis Kebutuhan)\n3. Design (Perancangan)\n4. Implementation (Coding)\n5. Testing (Pengujian)\n6. Maintenance (Pemeliharaan)\n\nMODEL:\nWaterfall (Sekuensial) vs Agile (Iteratif/Fleksibel)."
                    },
                    {
                        t: "Sistem Operasi (OS)",
                        c: "FUNGSI UTAMA OS:\n1. Manajemen Proses (Scheduling CPU).\n2. Manajemen Memori (RAM & Virtual Memory).\n3. Manajemen File (File System).\n4. Manajemen I/O (Input Output).\n\nKERNEL:\nInti dari OS yang menghubungkan software aplikasi dengan hardware komputer."
                    },
                    {
                        t: "Arsitektur & Organisasi Komputer",
                        c: "UNIT UTAMA (Von Neumann):\n1. CPU (ALU + Control Unit): Otak pemroses.\n2. Memory: Penyimpanan instruksi/data.\n3. I/O Devices: Perangkat masukan/keluaran.\n\nFETCH-DECODE-EXECUTE:\nSiklus CPU mengambil instruksi dari memori, menerjemahkannya, dan menjalankannya."
                    },
                    {
                        t: "Etika Profesi IT",
                        c: "PRINSIP ETIKA:\n1. Privasi: Menjaga kerahasiaan data pengguna.\n2. Akurasi: Tidak memanipulasi data/fakta.\n3. Properti: Menghargai Hak Kekayaan Intelektual (HAKI).\n4. Akses: Tidak membatasi akses informasi secara diskriminatif.\n\nKASUS:\nPlagiarisme kode, penyebaran malware, penyalahgunaan data user."
                    },
                    {
                        t: "Digital Marketing & SEO",
                        c: "SEO (Search Engine Optimization):\nOptimasi website agar muncul di halaman pertama pencarian organik (Google).\n\nSEM (Search Engine Marketing):\nPemasaran berbayar (Iklan/Ads) di mesin pencari.\n\nMETRIK PENTING:\n- CTR (Click Through Rate)\n- Conversion Rate\n- Bounce Rate"
                    },

                    // SEMESTER 4 (Advanced Tech)
                    {
                        t: "Pengembangan Game (Game Dev)",
                        c: "GAME LOOP:\nSiklus tak berujung: Input -> Update Logika -> Render Grafis.\n\nKOMPONEN:\n- Sprite/Mesh (Visual)\n- Collider/Rigidbody (Fisika)\n- Script (Logika)\n- Audio (Suara)\n\nGENRE:\nRPG, FPS, Platformer, Simulation, Strategy."
                    },
                    {
                        t: "Virtual Reality (VR) & AR",
                        c: "VR (Virtual Reality):\nPengguna masuk sepenuhnya ke dunia digital (Immersive) menggunakan headset.\n\nAR (Augmented Reality):\nMenambahkan objek digital ke dunia nyata (contoh: Filter kamera, Pokemon GO).\n\nMR (Mixed Reality):\nInteraksi objek digital dan fisik secara real-time."
                    },
                    {
                        t: "E-Commerce Systems",
                        c: "MODEL BISNIS:\n- B2B (Business to Business)\n- B2C (Business to Consumer)\n- C2C (Consumer to Consumer - Marketplace)\n\nKEAMANAN TRANSAKSI:\nEnkripsi SSL/TLS, Payment Gateway, dan Two-Factor Authentication (2FA) untuk mencegah penipuan."
                    },
                    {
                        t: "Manajemen Startup Digital",
                        c: "TAHAPAN STARTUP:\n1. Ideation: Validasi ide masalah & solusi.\n2. MVP (Minimum Viable Product): Produk dasar untuk tes pasar.\n3. Product-Market Fit: Produk disukai dan dibutuhkan pasar.\n4. Scaling: Ekspansi pertumbuhan pengguna.\n\nLEAN STARTUP:\nBuild - Measure - Learn (Buat - Ukur - Pelajari)."
                    },
                    {
                        t: "Manajemen Proyek (Agile/Scrum)",
                        c: "AGILE MANIFESTO:\nLebih menghargai individu & interaksi daripada proses & alat. Merespon perubahan daripada mengikuti rencana kaku.\n\nSCRUM FRAMEWORK:\n- Sprint: Siklus kerja pendek (2-4 minggu).\n- Daily Standup: Rapat harian singkat.\n- Roles: Product Owner, Scrum Master, Dev Team."
                    },
                    {
                        t: "Teknologi Masa Depan (Futurism)",
                        c: "TREN MENDATANG:\n1. Quantum Computing: Komputer super cepat berbasis Qubit.\n2. Biotechnology: Integrasi teknologi dengan biologi (Biohacking).\n3. Autonomous Systems: Robot/Kendaraan mandiri.\n4. Green Tech: Teknologi ramah lingkungan untuk keberlanjutan bumi."
                    },

                    // --- TAHUN KETIGA (EXPERT & SPECIALIZATION) ---
                    // SEMESTER 5 (Cloud & DevOps Architecture)
                    {
                        t: "Microservices Architecture",
                        c: "KONSEP:\nMemecah aplikasi besar (Monolith) menjadi layanan-layanan kecil yang independen dan saling berkomunikasi via API.\n\nKELEBIHAN:\n- Independensi Deployment\n- Skalabilitas per fitur\n- Bebas memilih teknologi per service\n\nKEKURANGAN:\nKompleksitas manajemen jaringan dan data."
                    },
                    {
                        t: "Docker & Containerization",
                        c: "CONTAINER:\nUnit standar perangkat lunak yang mengemas kode dan dependensinya agar aplikasi berjalan cepat dan andal di lingkungan komputasi yang berbeda.\n\nDOCKER:\nPlatform terbuka untuk mengembangkan, mengirim, dan menjalankan aplikasi dalam kontainer. Memisahkan aplikasi dari infrastruktur."
                    },
                    {
                        t: "Kubernetes (K8s)",
                        c: "ORCHESTRATION:\nSistem open-source untuk mengotomatisasi deployment, scaling, dan manajemen aplikasi terkontainerisasi.\n\nFITUR UTAMA:\n- Self-healing (Restart container mati)\n- Load balancing (Distribusi trafik)\n- Automated rollouts/rollbacks (Update otomatis)"
                    },
                    {
                        t: "CI/CD Pipeline",
                        c: "CI (Continuous Integration):\nPengembang sering menggabungkan kode ke repositori pusat (Shared Repo). Otomatisasi build dan test.\n\nCD (Continuous Delivery/Deployment):\nOtomatisasi rilis aplikasi ke lingkungan produksi. Memastikan software selalu siap dirilis ke user."
                    },
                    {
                        t: "DevOps Culture",
                        c: "DEFINISI:\nGabungan filosofi budaya, praktik, dan alat yang meningkatkan kemampuan organisasi untuk mengirimkan aplikasi dengan kecepatan tinggi.\n\nTUJUAN:\nMenghapus silo (tembok pemisah) antara tim Development (Pengembang) dan Operations (Operasional IT) agar kolaborasi lebih efisien."
                    },
                    {
                        t: "Cloud Security Architecture",
                        c: "SHARED RESPONSIBILITY:\nPenyedia Cloud (AWS/Google) bertanggung jawab atas keamanan 'of the cloud' (infrastruktur fisik).\nPelanggan bertanggung jawab atas keamanan 'in the cloud' (data, akses, konfigurasi).\n\nBEST PRACTICE:\nEnkripsi data at rest & in transit, IAM (Identity Access Management)."
                    },

                    // SEMESTER 6 (AI & Data Science Deep Dive)
                    {
                        t: "Deep Learning & Neural Networks",
                        c: "NEURAL NETWORK:\nModel komputasi yang terinspirasi dari struktur otak manusia (neuron dan sinapsis).\n\nDEEP LEARNING:\nPembelajaran mesin dengan banyak lapisan (hidden layers) untuk mengekstrak fitur tingkat tinggi dari data mentah. Contoh: Pengenalan wajah, mobil otonom."
                    },
                    {
                        t: "Natural Language Processing (NLP)",
                        c: "FUNGSI:\nMemampukan komputer untuk memahami, menafsirkan, dan memanipulasi bahasa manusia.\n\nAPLIKASI:\n- Chatbot & Virtual Assistant\n- Terjemahan Bahasa (Google Translate)\n- Analisis Sentimen (Cek respon positif/negatif di sosmed)\n- Peringkasan Teks Otomatis."
                    },
                    {
                        t: "Computer Vision",
                        c: "DEFINISI:\nBidang AI yang melatih komputer untuk menafsirkan dan memahami dunia visual (gambar/video).\n\nTEKNOLOGI:\n- Image Classification (Kucing vs Anjing)\n- Object Detection (Deteksi mobil di jalan)\n- Facial Recognition (Kunci HP wajah)\n- Medical Imaging (Deteksi tumor dari X-Ray)."
                    },
                    {
                        t: "Predictive Analytics",
                        c: "METODE:\nMenggunakan data historis, algoritma statistik, dan teknik machine learning untuk mengidentifikasi kemungkinan hasil masa depan.\n\nCONTOH:\n- Prediksi harga saham\n- Prediksi cuaca\n- Rekomendasi produk (Netflix/Spotify)\n- Deteksi potensi kerusakan mesin (Maintenance)."
                    },
                    {
                        t: "Ethical Hacking (Pentesting)",
                        c: "DEFINISI:\nPeretasan yang dilakukan dengan izin untuk menemukan kelemahan keamanan sistem sebelum dieksploitasi oleh peretas jahat.\n\nTAHAPAN:\n1. Reconnaissance (Pengumpulan info)\n2. Scanning (Pemindaian celah)\n3. Gaining Access (Eksploitasi)\n4. Maintaining Access\n5. Clearing Tracks (Hapus jejak)."
                    },
                    {
                        t: "Digital Forensics",
                        c: "TUJUAN:\nMengidentifikasi, memelihara, memulihkan, menganalisis, dan menyajikan fakta tentang bukti digital dalam kasus hukum.\n\nPROSES:\n- Seizure (Penyitaan perangkat)\n- Acquisition (Duplikasi data bit-by-bit)\n- Analysis (Mencari bukti tersembunyi/terhapus)\n- Reporting (Laporan hukum)."
                    },

                    // SEMESTER 7 (Modern Web & Management)
                    {
                        t: "Serverless Computing",
                        c: "KONSEP:\nModel eksekusi cloud di mana penyedia cloud mengelola server secara dinamis. Developer hanya fokus menulis kode fungsi (FaaS - Function as a Service).\n\nKEUNTUNGAN:\n- Tidak perlu manajemen server\n- Scaling otomatis dari nol ke ribuan request\n- Bayar hanya saat kode dijalankan."
                    },
                    {
                        t: "Progressive Web Apps (PWA)",
                        c: "FITUR:\nAplikasi web yang menggunakan fitur browser modern untuk memberikan pengalaman seperti aplikasi native (mobile app).\n\nKELEBIHAN:\n- Bisa diinstall di Home Screen\n- Bisa jalan Offline (Service Workers)\n- Push Notifications\n- Ringan dan cepat."
                    },
                    {
                        t: "GraphQL API",
                        c: "DEFINISI:\nBahasa query untuk API dan runtime untuk memenuhi query tersebut dengan data yang ada.\n\nBEDA DENGAN REST:\n- REST: Banyak endpoint, data fixed (over-fetching/under-fetching).\n- GraphQL: Satu endpoint, client minta data spesifik yang dibutuhkan saja (efisien)."
                    },
                    {
                        t: "Tech Leadership (CTO Role)",
                        c: "TANGGUNG JAWAB:\n- Menentukan visi teknologi perusahaan.\n- Memilih stack teknologi yang tepat.\n- Membangun dan memimpin tim engineering.\n- Menjembatani kebutuhan bisnis dengan solusi teknis.\n\nSKILL:\nKomunikasi, Manajemen Krisis, Mentoring."
                    },
                    {
                        t: "Startup Valuation & Funding",
                        c: "VALUASI:\nNilai ekonomis dari sebuah bisnis startup. Dipengaruhi oleh tim, traksi, ukuran pasar, dan teknologi.\n\nTAHAP PENDANAAN:\n- Bootstrapping (Modal sendiri)\n- Angel Investor\n- Seed Funding\n- Series A, B, C (Venture Capital)\n- IPO (Saham Publik)."
                    },
                    {
                        t: "Hukum IT & HAKI",
                        c: "UU ITE (Indonesia):\nMengatur informasi dan transaksi elektronik. Pasal karet, pencemaran nama baik, akses ilegal.\n\nHAKI (Hak Kekayaan Intelektual):\n- Hak Cipta (Copyright): Kode program, desain UI.\n- Paten: Penemuan teknologi baru.\n- Merek Dagang: Logo/Brand startup."
                    },

                    // SEMESTER 8 (Global Impact & Ethics)
                    {
                        t: "Green Computing",
                        c: "TUJUAN:\nMengurangi dampak lingkungan dari teknologi komputer. Hemat energi dan kurangi limbah elektronik (e-waste).\n\nSTRATEGI:\n- Virtualisasi server (kurangi hardware fisik)\n- Algoritma efisien (kurangi beban CPU/listrik)\n- Daur ulang perangkat keras\n- Data center bertenaga terbarukan."
                    },
                    {
                        t: "Bioinformatics",
                        c: "GABUNGAN:\nBiologi molekuler + Ilmu Komputer + Statistik.\n\nFUNGSI:\nMengelola dan menganalisis data biologis kompleks, seperti sekuensing DNA/RNA.\n\nMANFAAT:\nPenemuan obat baru, pemetaan gen manusia, personalisasi pengobatan medis."
                    },
                    {
                        t: "Smart Cities Implementation",
                        c: "DEFINISI:\nKota yang menggunakan teknologi IoT dan data untuk meningkatkan kualitas layanan publik dan kesejahteraan warga.\n\nCONTOH:\n- Smart Traffic (Lampu merah adaptif)\n- Smart Waste (Tempat sampah lapor penuh)\n- E-Gov (Layanan administrasi online)\n- Smart Energy (Grid listrik efisien)."
                    },
                    {
                        t: "Space Technology Software",
                        c: "TANTANGAN:\nSoftware di luar angkasa harus sangat andal (zero-failure), tahan radiasi, dan beroperasi real-time dengan latensi tinggi.\n\nCONTOH:\n- Sistem navigasi roket (SpaceX)\n- Kontrol rover Mars (NASA)\n- Komunikasi satelit."
                    },
                    {
                        t: "Quantum Computing Advance",
                        c: "QUBIT:\nUnit dasar informasi kuantum. Berbeda dengan Bit (0 atau 1), Qubit bisa 0 dan 1 sekaligus (Superposisi).\n\nPOTENSI:\nMemecahkan masalah yang butuh ribuan tahun bagi superkomputer klasik dalam hitungan detik (contoh: simulasi molekul, pemecahan enkripsi RSA)."
                    },
                    {
                        t: "Transhumanism & Future Ethics",
                        c: "FILOSOFI:\nGerakan yang mendukung penggunaan teknologi untuk meningkatkan kemampuan fisik dan mental manusia (Human 2.0).\n\nISU ETIKA:\n- Kesenjangan sosial (hanya orang kaya yang 'upgrade').\n- Hilangnya esensi kemanusiaan.\n- Chip implan otak (Neuralink)."
                    }
                ],
                'sejarah': [
                    // --- TAHUN PERTAMA (NUSANTARA BASIC) ---
                    // ZAMAN KUNO
                    {
                        t: "Zaman Prasejarah Nusantara",
                        c: "MANUSIA PURBA:\n1. Meganthropus (Manusia Raksasa): Paling tua.\n2. Pithecanthropus (Manusia Kera): Erectus (berjalan tegak).\n3. Homo Sapiens (Manusia Cerdas): Leluhur manusia modern.\n\nKEBUDAYAAN:\n- Paleolitikum (Batu Tua): Nomaden, berburu.\n- Neolitikum (Batu Muda): Menetap, bercocok tanam."
                    },
                    {
                        t: "Kerajaan Kutai Martadipura",
                        c: "LOKASI:\nSungai Mahakam, Kalimantan Timur. Kerajaan Hindu tertua di Indonesia (Abad 4 M).\n\nBUKTI SEJARAH:\n7 Prasasti Yupa (Tiang batu pengikat hewan kurban) bertuliskan huruf Pallawa bahasa Sanskerta.\n\nRAJA TERKENAL:\n- Kudungga (Pendiri)\n- Aswawarman (Pembentuk Wangsa)\n- Mulawarman (Masa Kejayaan, kurban 20.000 sapi)."
                    },
                    {
                        t: "Kemaritiman Sriwijaya",
                        c: "LOKASI:\nPalembang, Sumatera Selatan (Abad 7-13 M). Kerajaan Buddha terbesar.\n\nKEJAYAAN:\n- Menguasai Selat Malaka (Jalur perdagangan dunia).\n- Pusat studi agama Buddha (Dikunjungi I-Tsing).\n- Armada laut yang sangat kuat.\n\nPRASASTI:\nKedukan Bukit, Talang Tuo, Kota Kapur."
                    },
                    {
                        t: "Majapahit & Sumpah Palapa",
                        c: "LOKASI:\nTrowulan, Jawa Timur (1293-1500 M). Kerajaan Hindu-Buddha terbesar pemersatu Nusantara.\n\nTOKOH:\n- Raden Wijaya (Pendiri)\n- Hayam Wuruk (Raja Masa Emas)\n- Gajah Mada (Mahapatih).\n\nSUMPAH PALAPA:\nSumpah Gajah Mada untuk tidak menikmati kemewahan duniawi sebelum menyatukan seluruh pulau Nusantara."
                    },
                    {
                        t: "Masuknya Islam ke Nusantara",
                        c: "TEORI MASUKNYA:\n1. Teori Gujarat (India)\n2. Teori Mekkah (Arab)\n3. Teori Persia (Iran)\n\nSALURAN PENYEBARAN:\n- Perdagangan (Pedagang Muslim)\n- Perkawinan\n- Pendidikan (Pesantren)\n- Kesenian (Wayang Sunan Kalijaga)\n- Tasawuf."
                    },
                    {
                        t: "Kesultanan Demak",
                        c: "SEJARAH:\nKerajaan Islam pertama di Jawa (1478 M). Didirikan oleh Raden Patah (putra Majapahit).\n\nPERAN:\n- Pusat penyebaran Islam di Jawa (Wali Songo).\n- Penyerangan ke Portugis di Malaka (oleh Pati Unus / Pangeran Sabrang Lor).\n\nPENINGGALAN:\nMasjid Agung Demak (Soko Tatal)."
                    },

                    // ZAMAN KOLONIAL
                    {
                        t: "Kolonialisme Portugis & Spanyol",
                        c: "MOTIVASI 3G:\n1. Gold (Kekayaan/Rempah)\n2. Glory (Kejayaan/Wilayah)\n3. Gospel (Penyebaran Agama)\n\nPERISTIWA:\n- 1511: Portugis (Alfonso de Albuquerque) menaklukkan Malaka.\n- 1512: Sampai di Maluku (Pusat Rempah).\n- Perjanjian Saragosa: Pembagian wilayah Spanyol & Portugis."
                    },
                    {
                        t: "VOC (Vereenigde Oostindische Compagnie)",
                        c: "DEFINISI:\nKongsi Dagang Hindia Timur Belanda (1602). Perusahaan multinasional pertama di dunia.\n\nHAK OKTROI (Istimewa):\n- Hak monopoli dagang.\n- Hak mencetak uang.\n- Hak memelihara tentara & perang.\n- Hak memerintah (negara dalam negara).\n\nKEBANGKRUTAN (1799):\nKorupsi pegawai, biaya perang, persaingan dagang."
                    },
                    {
                        t: "Perang Diponegoro (Perang Jawa)",
                        c: "WAKTU:\n1825 - 1830 (5 Tahun).\n\nPENYEBAB:\n- Belanda mematok tanah makam leluhur Pangeran Diponegoro.\n- Penderitaan rakyat akibat pajak.\n\nAKHIR PERANG:\nDiponegoro ditipu saat perundingan di Magelang, ditangkap, dan diasingkan ke Makassar. Perang ini membuat kas Belanda kosong."
                    },
                    {
                        t: "Politik Etis (Balas Budi)",
                        c: "LATAR BELAKANG:\nKritik Van Deventer atas eksploitasi Belanda terhadap pribumi (Tanam Paksa).\n\nTRILOGI VAN DEVENTER:\n1. Irigasi (Pengairan sawah)\n2. Emigrasi (Pemerataan penduduk)\n3. Edukasi (Pendidikan) -> Paling berdampak, melahirkan golongan terpelajar Indonesia."
                    },
                    {
                        t: "Kebangkitan Nasional (1908)",
                        c: "BUDI UTOMO:\nOrganisasi modern pertama (20 Mei 1908) oleh Dr. Sutomo & Wahidin Sudirohusodo.\n\nMAKNA:\nPerubahan pola perjuangan dari:\n- Fisik (Senjata) -> Diplomasi/Intelektual\n- Kedaerahan -> Nasional\n- Tergantung pemimpin -> Terorganisir."
                    },
                    {
                        t: "Sumpah Pemuda (1928)",
                        c: "KONGRES PEMUDA II:\n27-28 Oktober 1928 di Jakarta.\n\nISI SUMPAH:\n1. Bertumpah darah satu: Tanah Indonesia.\n2. Berbangsa satu: Bangsa Indonesia.\n3. Menjunjung bahasa persatuan: Bahasa Indonesia.\n\nLAGU KEBANGSAAN:\nIndonesia Raya pertama kali diperdengarkan oleh W.R. Supratman (biola)."
                    },

                    // ZAMAN KEMERDEKAAN
                    {
                        t: "Pendudukan Jepang (1942-1945)",
                        c: "PROPAGANDA 3A:\nJepang Cahaya, Pelindung, Pemimpin Asia.\n\nDAMPAK NEGATIF:\n- Romusha (Kerja Paksa)\n- Kelaparan & Perampasan hasil bumi\n\nDAMPAK POSITIF:\n- Pelatihan Militer (PETA, Heiho)\n- Penggunaan Bahasa Indonesia\n- Pembentukan BPUPKI & PPKI."
                    },
                    {
                        t: "Perumusan Dasar Negara (BPUPKI)",
                        c: "SIDANG BPUPKI:\nMerumuskan dasar negara Indonesia Merdeka.\n\nLAHIRNYA PANCASILA (1 Juni 1945):\nPidato Ir. Soekarno mengusulkan 5 sila dasar.\n\nPIAGAM JAKARTA (22 Juni):\nRumusan awal Pancasila oleh Panitia Sembilan. Sila 1 kemudian diubah demi persatuan bangsa."
                    },
                    {
                        t: "Proklamasi Kemerdekaan",
                        c: "PERISTIWA RENGASDENGKLOK:\nGolongan Muda menculik Soekarno-Hatta agar segera memproklamasikan kemerdekaan, lepas dari pengaruh Jepang.\n\nDETIK-DETIK PROKLAMASI:\n- Tanggal: 17 Agustus 1945, pukul 10.00 WIB.\n- Lokasi: Jl. Pegangsaan Timur 56, Jakarta.\n- Bendera: Dijahit Fatmawati.\n- Teks: Diketik Sayuti Melik."
                    },
                    {
                        t: "Pertempuran 10 November",
                        c: "LOKASI:\nSurabaya. Perang terbuka terbesar pasca kemerdekaan melawan Sekutu (Inggris).\n\nPENYEBAB:\nTewasnya Jenderal Mallaby dan ultimatum Inggris agar rakyat menyerahkan senjata.\n\nTOKOH:\nBung Tomo (Membakar semangat lewat radio). Diperingati sebagai Hari Pahlawan."
                    },
                    {
                        t: "Diplomasi Mempertahankan Kemerdekaan",
                        c: "PERJUANGAN MEJA PERUNDINGAN:\n1. Linggarjati: Pengakuan de facto Jawa, Sumatera, Madura.\n2. Renville: Wilayah RI makin sempit.\n3. Roem-Roijen: Gencatan senjata.\n4. KMB (Konferensi Meja Bundar): Belanda mengakui kedaulatan Indonesia (RIS)."
                    },
                    {
                        t: "Republik Indonesia Serikat (RIS)",
                        c: "KONSEP:\nIndonesia berubah menjadi negara serikat/federal hasil KMB (1949). Terdiri dari negara-negara bagian buatan Belanda (Boneka).\n\nKEMBALI KE NKRI (1950):\nRakyat menolak RIS dan menuntut kembali ke Negara Kesatuan Republik Indonesia melalui Mosi Integral Natsir."
                    },

                    // --- TAHUN KEDUA ---
                    // SEMESTER 3 (Zaman Modern & Isu Global)
                    {
                        t: "Demokrasi Liberal (1950-1959)",
                        c: "CIRI KHAS:\n- Sistem Parlementer (PM memimpin pemerintahan, Presiden simbol negara).\n- Banyak Partai Politik.\n- Kabinet Jatuh Bangun (7 Kabinet dalam 9 tahun).\n\nDAMPAK:\nKetidakstabilan politik dan pembangunan terhambat, tapi kebebasan pers tinggi."
                    },
                    {
                        t: "Dekrit Presiden 5 Juli 1959",
                        c: "LATAR BELAKANG:\nKegagalan Konstituante menyusun UUD baru dan ketidakstabilan politik.\n\nISI DEKRIT:\n1. Pembubaran Konstituante.\n2. Kembali ke UUD 1945 (UUDS 1950 tidak berlaku).\n3. Pembentukan MPRS dan DPAS.\n\nMenandai dimulainya Demokrasi Terpimpin."
                    },
                    {
                        t: "Peristiwa G30S/PKI (1965)",
                        c: "TRAGEDI NASIONAL:\nPenculikan dan pembunuhan 6 Jenderal dan 1 Perwira TNI AD pada malam 30 September 1965.\n\nDAMPAK:\n- Krisis politik dan ekonomi.\n- Pembubaran PKI.\n- Lahirnya Supersemar (Surat Perintah 11 Maret).\n- Peralihan kekuasaan dari Orde Lama ke Orde Baru."
                    },
                    {
                        t: "Masa Orde Baru (1966-1998)",
                        c: "KEPEMIMPINAN SOEHARTO:\nFokus pada Stabilitas Politik dan Pertumbuhan Ekonomi (Trilogi Pembangunan).\n\nKEBIJAKAN:\n- Repelita (Rencana Pembangunan Lima Tahun).\n- Swasembada Beras.\n- Keluarga Berencana (KB).\n- Dwifungsi ABRI.\n\nAKHIR:\nKrisis Moneter 1997 dan Reformasi 1998."
                    },
                    {
                        t: "Reformasi 1998",
                        c: "PENYEBAB:\n- Krisis Ekonomi (Rupiah anjlok).\n- KKN (Korupsi, Kolusi, Nepotisme).\n- Tuntutan Demokrasi Mahasiswa.\n\nAGENDA REFORMASI:\n1. Adili Soeharto & kroninya.\n2. Amandemen UUD 1945.\n3. Otonomi Daerah.\n4. Penghapusan Dwifungsi ABRI.\n5. Kebebasan Pers."
                    },
                    {
                        t: "Sejarah Kontemporer & Globalisasi",
                        c: "TANTANGAN MASA KINI:\n- Revolusi Industri 4.0.\n- Menjaga identitas bangsa di era digital.\n- Toleransi dan Radikalisme.\n- Peran Indonesia di G20 dan kancah global.\n\nSejarah terus berjalan, dan kitalah penulis bab selanjutnya."
                    },

                    // SEMESTER 4 (Sejarah Tematik)
                    {
                        t: "Sejarah Jalur Rempah",
                        c: "JALUR SUTRA MARITIM:\nJaringan rute perdagangan laut kuno yang menghubungkan Timur (Nusantara/China) dan Barat (Eropa/Timur Tengah).\n\nKOMODITAS:\nCengkeh (Ternate), Pala (Ambon), Lada. Dulu harganya lebih mahal dari emas di Eropa.\n\nDAMPAK:\nNusantara menjadi incaran kolonialisme bangsa Eropa."
                    },
                    {
                        t: "Revolusi Industri Dunia",
                        c: "TAHAPAN:\n1.0: Mesin Uap (Abad 18) - Mekanisasi.\n2.0: Listrik & Assembly Line (Abad 19) - Produksi Massal.\n3.0: Komputer & Otomasi (Abad 20) - IT.\n4.0: Cyber-Physical (Sekarang) - IoT, AI, Big Data.\n\nDAMPAK SOSIAL:\nUrbanisasi, perubahan struktur kerja, dan kesenjangan ekonomi."
                    },
                    {
                        t: "Perang Dunia I (1914-1918)",
                        c: "PENYEBAB:\nPembunuhan Pangeran Franz Ferdinand (Austria) dan sistem aliansi negara Eropa.\n\nPIHAK TERLIBAT:\n- Blok Sekutu (Inggris, Perancis, Rusia, AS).\n- Blok Sentral (Jerman, Austria-Hungaria, Ottoman).\n\nAKIBAT:\nRuntuhnya 4 kekaisaran besar dan lahirnya LBB (Liga Bangsa-Bangsa)."
                    },
                    {
                        t: "Perang Dunia II (1939-1945)",
                        c: "PEMICU:\nInvasi Jerman ke Polandia.\n\nPIHAK:\n- Poros (Jerman, Jepang, Italia).\n- Sekutu (AS, Inggris, Uni Soviet, China).\n\nPERISTIWA KUNCI:\n- Holocaust (Genosida Yahudi).\n- Bom Atom Hiroshima & Nagasaki.\n- Lahirnya PBB (Perserikatan Bangsa-Bangsa)."
                    },
                    {
                        t: "Perang Dingin (Cold War)",
                        c: "DEFINISI:\nKetegangan geopolitik antara Blok Barat (AS - Kapitalis) dan Blok Timur (Uni Soviet - Komunis) tanpa perang fisik langsung (1947-1991).\n\nBENTUK PERSAINGAN:\n- Perlombaan Senjata Nuklir.\n- Perlombaan Luar Angkasa (Space Race).\n- Proxy War (Perang Korea, Vietnam).\n- Spionase (CIA vs KGB)."
                    },
                    {
                        t: "Konferensi Asia Afrika (KAA 1955)",
                        c: "LOKASI:\nGedung Merdeka, Bandung.\n\nTUJUAN:\nMempererat solidaritas negara-negara Asia-Afrika melawan kolonialisme dan neokolonialisme.\n\nHASIL:\nDasasila Bandung. Menjadi cikal bakal Gerakan Non-Blok (GNB).\n\nPERAN INDONESIA:\nTuan rumah dan pelopor (PM Ali Sastroamidjojo)."
                    },

                    // SEMESTER 5 (Sejarah Diplomasi & Regional)
                    {
                        t: "Gerakan Non-Blok (GNB)",
                        c: "PRINSIP:\nTidak memihak Blok Barat maupun Blok Timur dalam Perang Dingin.\n\nPENDIRI:\nSoekarno (Indonesia), Tito (Yugoslavia), Nasser (Mesir), Nehru (Mesir), Nkrumah (Ghana).\n\nTUJUAN:\nMeredakan ketegangan dunia dan memperjuangkan kemerdekaan negara terjajah."
                    },
                    {
                        t: "Sejarah ASEAN",
                        c: "PENDIRIAN:\n8 Agustus 1967 di Bangkok. Oleh 5 Menlu (Adam Malik - Indonesia).\n\nTUJUAN:\nMempercepat pertumbuhan ekonomi, kemajuan sosial, dan perdamaian regional Asia Tenggara.\n\nPRINSIP:\nNon-intervensi (tidak ikut campur urusan dalam negeri anggota)."
                    },
                    {
                        t: "Sejarah Perserikatan Bangsa-Bangsa (PBB)",
                        c: "PENDIRIAN:\n24 Oktober 1945 pasca PD II, menggantikan LBB.\n\nORGAN UTAMA:\n- Majelis Umum\n- Dewan Keamanan (5 Anggota Tetap punya Hak Veto)\n- Mahkamah Internasional\n- Sekretariat.\n\nINDONESIA DI PBB:\nPernah keluar (1965) saat konfrontasi Malaysia, lalu masuk kembali (1966)."
                    },
                    {
                        t: "Integrasi Timor Timur",
                        c: "SEJARAH:\n- 1975: Operasi Seroja, integrasi ke Indonesia (Provinsi ke-27) pasca ditinggal Portugal.\n- 1999: Referendum/Jajak Pendapat di masa Presiden Habibie.\n- Hasil: Mayoritas memilih merdeka -> Lepas menjadi negara Timor Leste."
                    },
                    {
                        t: "Konflik Laut China Selatan",
                        c: "ISU UTAMA:\nKlaim tumpang tindih wilayah perairan dan kepulauan (Spratly & Paracel) oleh China, Vietnam, Filipina, Malaysia, Brunei.\n\nPOSISI INDONESIA:\nBukan negara pengklaim (non-claimant), namun menjaga kedaulatan ZEE di Natuna Utara berdasarkan UNCLOS 1982."
                    },
                    {
                        t: "Sejarah Palestina & Israel",
                        c: "AKAR KONFLIK:\nPerebutan wilayah tanah suci pasca runtuhnya Ottoman dan Mandat Inggris (1948). Deklarasi negara Israel memicu perang Arab-Israel.\n\nISU KUNCI:\nStatus Yerusalem, perbatasan, pengungsi, dan permukiman ilegal.\n\nSIKAP RI:\nMendukung kemerdekaan Palestina (Solusi Dua Negara)."
                    },

                    // SEMESTER 6 (Sejarah Kebudayaan & Sosial)
                    {
                        t: "Sistem Subak Bali (Warisan Dunia)",
                        c: "DEFINISI:\nSistem pengairan sawah (irigasi) tradisional Bali yang berbasis masyarakat dan filosofi Tri Hita Karana (Tuhan, Manusia, Alam).\n\nNILAI:\nDemokratis, adil, dan egaliter. Petani di hilir tetap mendapat air meski di hulu bisa memonopoli. Diakui UNESCO 2012."
                    },
                    {
                        t: "Sejarah Batik Indonesia",
                        c: "MAKNA:\nSeni melukis kain dengan lilin (malam). Setiap motif memiliki filosofi (contoh: Parang = kekuasaan/raja).\n\nPENGAKUAN:\nUNESCO menetapkan Batik sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi pada 2 Oktober 2009 (Hari Batik Nasional)."
                    },
                    {
                        t: "Sejarah Bahasa Indonesia",
                        c: "ASAL USUL:\nBerasal dari Bahasa Melayu Riau (Lingua Franca perdagangan Nusantara).\n\nSUMPAH PEMUDA:\nDiangkat menjadi bahasa persatuan, bukan bahasa Jawa (mayoritas) demi kesetaraan.\n\nPERKEMBANGAN:\nEjaan Van Ophuijsen -> Soewandi -> EYD -> PUEBI."
                    },
                    {
                        t: "Gerakan Emansipasi Wanita",
                        c: "TOKOH:\n- R.A. Kartini (Jepara): Habis Gelap Terbitlah Terang. Pendidikan wanita.\n- Dewi Sartika (Bandung): Sekolah Istri.\n- Cut Nyak Dien (Aceh): Perjuangan fisik perang.\n- Rasuna Said (Padang): Politik dan Pers.\n\nTUJUAN:\nKesetaraan hak pendidikan dan sosial bagi perempuan."
                    },
                    {
                        t: "Sejarah Pendidikan Nasional",
                        c: "ERA KOLONIAL:\nSekolah hanya untuk bangsawan/Eropa (ELS, HIS, STOVIA).\n\nTAMAN SISWA (1922):\nKi Hajar Dewantara mendirikan sekolah untuk rakyat jelata. Semboyan: Ing Ngarso Sung Tulodo, Ing Madyo Mangun Karso, Tut Wuri Handayani.\n\nERA MERDEKA:\nPendidikan untuk semua (Wajib Belajar)."
                    },
                    {
                        t: "Pelestarian Cagar Budaya",
                        c: "DEFINISI:\nWarisan budaya bersifat kebendaan (Benda, Bangunan, Struktur, Situs, Kawasan) yang perlu dilestarikan.\n\nCONTOH:\nCandi Borobudur, Situs Sangiran, Kota Tua Jakarta.\n\nTANTANGAN:\nPencurian artefak, vandalisme, bencana alam, dan pembangunan modern yang merusak situs."
                    }
                ]
            };

            // ... existing selectMajor, startEntranceExam functions ...

            // --- NEW: LOGIKA SIDANG SKRIPSI (THESIS DEFENSE) ---
            let currentDefense = {
                major: null,
                score: 0,
                qIndex: 0,
                questions: []
            };

            function startThesisDefense(major) {
                currentDefense.major = major;
                currentDefense.score = 0;
                currentDefense.qIndex = 0;
                currentDefense.questions = [...THESIS_DB[major]];

                // Acak urutan soal sidang agar tidak hapalan mati
                currentDefense.questions.sort(() => Math.random() - 0.5);

                showDialogue("DOSEN PENGUJI UTAMA",
                    "Selamat datang di Sidang Akhir Skripsi. \n\nSaya akan mengajukan **5 Pertanyaan Kunci** terkait bidang studimu. \n\nSyarat Kelulusan: **Benar Minimal 4 Soal**. \nJika gagal, kamu harus merevisi draft-mu (mengulang sidang nanti).\n\nApakah kamu siap mempertanggungjawabkan karyamu?",
                    [
                        { text: "SAYA SIAP! (Mulai Sidang)", action: nextDefenseQuestion },
                        { text: "Saya baca buku dulu...", action: closeDialogue }
                    ],
                    'images/lecture.png'
                );
            }

            function nextDefenseQuestion() {
                if (currentDefense.qIndex >= currentDefense.questions.length) {
                    finishDefense();
                    return;
                }

                const qData = currentDefense.questions[currentDefense.qIndex];

                const opts = qData.opts.map(opt => {
                    return {
                        text: opt,
                        action: () => answerDefense(opt === qData.a)
                    };
                });

                // Acak posisi jawaban
                opts.sort(() => Math.random() - 0.5);

                // Tampilkan Soal
                showDialogue(
                    `SIDANG SKRIPSI (${currentDefense.qIndex + 1}/5)`,
                    `PERTANYAAN PENGUJI:\n\n**"${qData.q}"**`,
                    opts,
                    'images/lecture.png'
                );
            }

            function answerDefense(isCorrect) {
                if (isCorrect) {
                    currentDefense.score++;
                    showToast("Penguji Mengangguk... (Benar) ✅");
                } else {
                    showToast("Penguji Mengerutkan Dahi... (Salah) ❌");
                    // Hukuman mental (Energy turun dikit)
                    STATE.player.energy = Math.max(0, STATE.player.energy - 5);
                }

                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                currentDefense.qIndex++;
                setTimeout(() => nextDefenseQuestion(), 800);
            }

            function finishDefense() {
                const passed = currentDefense.score >= 4; // Syarat: Benar 4 dari 5

                if (passed) {
                    let reaction = `Nilai Sidang: **${currentDefense.score * 20}** (A).\n\nSelamat! Kamu berhasil mempertahankan skripsimu dengan sangat baik. \n\nSaya dengan bangga menyatakan kamu **LULUS SIDANG SKRIPSI**!`;
                    if (currentDefense.score === 5) reaction += "\n(Nilai Sempurna! Dosen terkesan!)";

                    showDialogue("DOSEN PEMBIMBING", reaction, [{
                        text: "Alhamdulillah! (Terima Ijazah & Gelar)",
                        action: () => {
                            // CONSUME DRAFT
                            if (STATE.player.inventory['draft_proposal'] > 0) {
                                STATE.player.inventory['draft_proposal']--;
                                if (STATE.player.inventory['draft_proposal'] <= 0) delete STATE.player.inventory['draft_proposal'];
                            }

                            // BERI HADIAH KELULUSAN
                            addItem('buku_tesis', 1);

                            const major = currentDefense.major;
                            if (major === 'teknologi') {
                                addItem('ijazah_teknologi', 1);
                            } else {
                                addItem('ijazah_sejarah', 1);
                            }

                            STATE.player.reputation += 50;
                            STATE.player.money += 5000;
                            gainExp(5000);

                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                            closeDialogue();

                            // 🎬 CINEMATIC WISUDA
                            setTimeout(() => {
                                const isScholar = STATE.player.scholarship || false;
                                playCutsceneWisuda(major, isScholar, () => {
                                    // Setelah wisuda, tampilkan toast selamat & update mentor
                                    const gelar = major === 'teknologi' ? 'S.Kom' : 'S.Hum';
                                    showToast(`🎓 Selamat ${gelar}! Kamu telah wisuda!`);
                                    if (typeof updateMentorBubble === 'function') updateMentorBubble();
                                    // Confetti game partikel tambahan
                                    for (let i = 0; i < 30; i++) {
                                        const angle = Math.random() * Math.PI * 2;
                                        STATE.particles.push({
                                            x: STATE.player.x, y: STATE.player.y,
                                            vx: Math.cos(angle) * (2 + Math.random() * 5),
                                            vy: Math.sin(angle) * (2 + Math.random() * 5),
                                            life: 50 + Math.random() * 30,
                                            color: ['#fbbf24','#86efac','#f9a8d4','#ffffff'][Math.floor(Math.random()*4)]
                                        });
                                    }
                                });
                            }, 500);
                        }
                    }], 'images/lecture.png');
                } else {
                    showDialogue("DOSEN PENGUJI",
                        `Skor: ${currentDefense.score}/5. (Tidak Lulus)\n\nMaaf, penguasaan materimu masih kurang. Jawabanmu banyak yang meleset dari teori.\n\n**STATUS: REVISI MAJOR**\nSilakan pelajari lagi materinya dan ajukan sidang ulang nanti.`,
                        [{
                            text: "Siap Pak, saya akan belajar lagi. (Energy -30)", action: () => {
                                STATE.player.energy = Math.max(0, STATE.player.energy - 30);
                                closeDialogue();
                            }
                        }],
                        'images/lecture.png'
                    );
                }
            }

            function finalizeRoleSetup() {
                updateHUDInfo();

                // UPDATE: Karena penjelasan fitur sudah di awal (startWakeUpSequence), 
                // Mentor Budi sekarang hanya memberikan motivasi penutup agar tidak repetitif.
                showDialogue(STATE.mentorName,
                    "Persiapan selesai! Status dasarmu telah ditetapkan.\n\nIngat pesan saya: Rajinlah menulis **Jurnal Refleksi** setiap hari di rumah agar Gurumu bisa menilai perkembanganmu.",
                    [{
                        text: "Siap, Terima Kasih Mentor!",
                        action: () => {
                            // FIX: KEMBALIKAN MENTOR KE POSISI ASAL (HILANG DARI DEPAN RUMAH)
                            // Agar tidak menghalangi jalan atau terlihat aneh setelah tutorial selesai
                            const villMap = maps['village'];
                            const mentor = villMap.npcs.find(n => n.id === 'mentor');
                            if (mentor) {
                                // UPDATE: Pindahkan ke -99 (Hilang dari map desa)
                                mentor.x = -99;
                                mentor.y = -99;
                                // Reset kecepatan gerak jika perlu
                                mentor.vx = 0;
                                mentor.vy = 0;
                            }

                            // FIX: BUKA KUNCI JURNAL (Akhiri Status Prologue)
                            STATE.isPrologue = false;

                            closeDialogue();

                            // FIX: SIMPAN ULANG SETELAH DIALOG DITUTUP (DATA FINAL)
                            manualSave();

                            // Optional: Buka jurnal untuk Worker/Other roles agar sadar misi
                            setTimeout(() => showDailyQuestPopup(), 500);
                        }
                    }],
                    'images/mentor.png'
                );
            }

            function updateHUDInfo() {
                const p = STATE.player;
                const name = DataService.user ? DataService.user.name : "Player";

                // Update Name & Level
                let roleDisplay = "?";
                if (p.role !== 'none') {
                    roleDisplay = p.role.toUpperCase();
                    // Tampilkan jurusan jika ada
                    if (p.role === 'student' && p.major) {
                        roleDisplay += ` (${p.major.substring(0, 3).toUpperCase()})`;
                    }
                }

                // Tampilkan di area nama atau tooltip (opsional, saat ini pakai nama saja di UI)
                document.getElementById('hud-name').innerText = name.length > 8 ? name.substring(0, 6) + ".." : name;
                document.getElementById('level-display').innerText = p.level;

                // FIX: UPDATE MONEY DISPLAY AGAR SINKRON
                // Menggunakan locale 'id-ID' agar format ribuan menggunakan titik (contoh: 36.000)
                document.getElementById('money-display').innerText = p.money.toLocaleString('id-ID');

                // Update Bars Width
                const hpPct = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
                const enPct = Math.max(0, Math.min(100, (p.energy / 100) * 100)); // Energy max is static 100 usually
                const expPct = Math.max(0, Math.min(100, (p.exp / p.maxExp) * 100));

                // UPDATE: TARGET ELEMENT HUD BARU
                const hudHpBar = document.getElementById('hud-hp-bar');
                if (hudHpBar) hudHpBar.style.width = hpPct + "%";

                document.getElementById('energy-bar').style.width = enPct + "%";
                document.getElementById('exp-bar').style.width = expPct + "%";

                // Text inside bars
                const hudHpText = document.getElementById('hud-hp-text');
                if (hudHpText) hudHpText.innerText = Math.floor(p.hp);

                document.getElementById('energy-text').innerText = Math.floor(p.energy);

                // UPDATE: HAPUS LOGIKA COMBAT HUD LAMA
                /*
                const combatHud = document.getElementById('combat-hud');
                if(STATE.location === 'dungeon') {
                    combatHud.style.display = 'flex';
                } else {
                    combatHud.style.display = 'none';
                }
                */

                // ALWAYS UPDATE BAG ICON
                updateBagIcon();
            }

            // --- NEW FUNCTION: UPDATE BAG ICON ---
            function updateBagIcon() {
                const inv = STATE.player.inventory || {};
                // Hitung total item yang jumlahnya > 0
                let totalItems = 0;
                for (let key in inv) {
                    if (inv[key] > 0) totalItems += inv[key];
                }

                const bagBtn = document.getElementById('bag-btn');
                if (totalItems > 0) {
                    bagBtn.style.backgroundImage = "url('images/tas-isi.png')";
                } else {
                    bagBtn.style.backgroundImage = "url('images/tas-kosong.png')";
                }
            }

            // --- NEW FUNCTION: TOGGLE HUD (COLLAPSIBLE) ---
            function toggleHUD() {
                const hud = document.getElementById('main-hud');
                const btn = document.getElementById('hud-toggle-btn');

                // Toggle Class
                hud.classList.toggle('compact-mode');

                // SFX
                if (typeof AudioService !== 'undefined') AudioService.playSFX('bg');

                // Update Button Icon & Position Logic
                if (hud.classList.contains('compact-mode')) {
                    btn.innerText = "▼"; // Panah Bawah (Show)
                    btn.title = "Tampilkan Detail";
                    // Posisi tombol diatur via CSS (.compact-mode ~ #hud-toggle-btn)
                } else {
                    btn.innerText = "▲"; // Panah Atas (Hide)
                    btn.title = "Sembunyikan Stats";
                }
            }

            // --- NEW FUNCTION: TOGGLE INVENTORY SCREEN ---
            function toggleInventory() {
                // UPDATE: Ganti 'bg' menjadi 'item' agar suara lebih terdengar (seperti suara koin/barang)
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const screen = document.getElementById('inventory-screen');
                const isHidden = screen.style.display === 'none' || screen.style.display === '';

                if (isHidden) {
                    screen.style.display = 'flex';
                    updateInventoryStats(); // NEW: Update status saat buka
                    renderInventory();
                    STATE.screen = 'modal'; // Pause game input
                } else {
                    screen.style.display = 'none';
                    STATE.screen = 'play'; // Resume game
                }
            }

            // --- NEW FUNCTION: OPEN PROFILE MODAL ---
            function openProfileModal() {
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const p = STATE.player;
                const userData = DataService.user || { name: "Player", email: "Guest" };

                // 1. Set Basic Info
                document.getElementById('profile-name').innerText = userData.name || "Siswa";
                // Gunakan 6 karakter awal email sebagai ID simulasi
                document.getElementById('profile-id').innerText = (userData.email || "000000").substring(0, 6).toUpperCase();

                // Set Avatar yang sama dengan HUD
                const hudImg = document.getElementById('hud-avatar-img').src;
                document.getElementById('profile-img').src = hudImg;

                // 2. Set Role Badge & Header Color
                const roleBadge = document.getElementById('profile-role-badge');
                const header = document.getElementById('profile-header');
                let roleText = "NOVICE";
                let roleColor = "#64748b"; // Default Grey
                let headerColor = "#334155"; // Default Dark

                if (p.role === 'worker') {
                    roleText = "PEKERJA (FIGHTER)";
                    roleColor = "#ef4444"; headerColor = "#7f1d1d";
                } else if (p.role === 'student') {
                    roleText = "MAHASISWA (MAGE)";
                    roleColor = "#3b82f6"; headerColor = "#1e3a8a";
                    if (p.major) roleText += ` - ${p.major.toUpperCase()}`;
                } else if (p.role === 'entrepreneur') {
                    roleText = "WIRAUSAHA (SUPPORT)";
                    roleColor = "#10b981"; headerColor = "#064e3b";
                } else if (p.role === 'family') {
                    roleText = "KELUARGA (TANKER)";
                    roleColor = "#d946ef"; headerColor = "#701a75";
                }

                roleBadge.innerText = roleText;
                roleBadge.style.background = roleColor;
                header.style.background = headerColor;
                header.style.borderColor = roleColor;

                // Tambah status pernikahan di bawah role badge
                let maritalEl = document.getElementById('profile-marital-status');
                if (!maritalEl) {
                    maritalEl = document.createElement('div');
                    maritalEl.id = 'profile-marital-status';
                    maritalEl.style.cssText = 'font-size:11px; font-weight:700; padding:2px 10px; border-radius:12px; margin-top:4px; display:inline-block;';
                    roleBadge.parentNode.insertBefore(maritalEl, roleBadge.nextSibling);
                }
                if (p.married) {
                    const spouseName = {lover1girl:'Ayu',lover2girl:'Putri',lover1boy:'Dr. Budi',lover2boy:'Satria',lover_matre_girl:'Siska',lover_matre_boy:'Rendi'}[p.spouseId] || 'Pasangan';
                    maritalEl.innerText = `💍 Menikah dgn ${spouseName}`;
                    maritalEl.style.background = '#ec4899';
                    maritalEl.style.color = '#fff';
                } else if (p.divorced) {
                    maritalEl.innerText = p.gender === 'boy' ? '💔 Duda' : '💔 Janda';
                    maritalEl.style.background = '#64748b';
                    maritalEl.style.color = '#fff';
                } else {
                    maritalEl.innerText = '🙍 Single';
                    maritalEl.style.background = 'rgba(255,255,255,0.15)';
                    maritalEl.style.color = '#e2e8f0';
                }

                // 3. Set Stats
                document.getElementById('profile-lvl').innerText = p.level;
                document.getElementById('profile-str').innerText = p.str;
                document.getElementById('profile-int').innerText = p.int;
                document.getElementById('profile-biz').innerText = p.biz;
                document.getElementById('profile-rep').innerText = p.reputation;
                document.getElementById('profile-money').innerText = p.money.toLocaleString('id-ID');
                document.getElementById('profile-jurnal').innerText = (p.reflections || []).length;

                // 4. Update EXP Bar
                const expPct = Math.floor((p.exp / p.maxExp) * 100);
                document.getElementById('profile-exp-bar').style.width = expPct + "%";
                document.getElementById('profile-exp-txt').innerText = `${Math.floor(p.exp)}/${p.maxExp}`;

                // Show Modal
                document.getElementById('profile-modal').style.display = 'flex';
                STATE.screen = 'modal';

                // Populate kelas & mentor
                const kelasEl = document.getElementById('profile-kelas-display');
                const mentorEl = document.getElementById('profile-mentor-display');
                if (kelasEl) kelasEl.innerText = userData.details || p.customKelas || 'Kelas belum diisi';
                if (mentorEl) {
                    const mentorName = p.customMentor || userData.mentorName || 'Guru belum diisi';
                    mentorEl.innerText = mentorName;
                }

                // Update tombol musik
                updateMusicBtn();
            }

            function closeProfileModal() {
                document.getElementById('profile-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            // === FUNGSI MUSIK DARI KARTU PELAJAR ===
            function toggleMusicFromProfile() {
                if (typeof AudioService !== 'undefined') {
                    AudioService.enabled = !AudioService.enabled;
                    if (!AudioService.enabled) {
                        // Matikan semua audio
                        Object.values(AudioService.tracks).forEach(t => { try { t.pause(); } catch(e){} });
                        AudioService.currentTrack = null;
                        AudioService.currentAmbience = null;
                        showToast('🔇 Musik dimatikan');
                    } else {
                        // Nyalakan kembali
                        AudioService.update();
                        showToast('🎵 Musik dinyalakan');
                    }
                    updateMusicBtn();
                    // Simpan preferensi
                    try { localStorage.setItem('musicEnabled', AudioService.enabled ? '1' : '0'); } catch(e){}
                }
            }

            function updateMusicBtn() {
                const btn = document.getElementById('profile-music-btn');
                const btn2 = document.getElementById('profile-music-btn2');
                if (!btn) return;
                const on = typeof AudioService !== 'undefined' ? AudioService.enabled : true;
                btn.innerText = on ? '🎵' : '🔇';
                btn.title = on ? 'Matikan Musik' : 'Nyalakan Musik';
                btn.style.background = on ? 'rgba(255,255,255,0.25)' : 'rgba(239,68,68,0.4)';
                if (btn2) {
                    btn2.innerText = on ? '🎵 MUSIK ON' : '🔇 MUSIK OFF';
                    btn2.style.background = on ? 'linear-gradient(135deg,#1e40af,#1d4ed8)' : 'linear-gradient(135deg,#374151,#1f2937)';
                    btn2.style.borderColor = on ? '#3b82f6' : '#6b7280';
                }
            }

            // === FUNGSI EDIT KELAS & MENTOR ===
            function editProfileKelas() {
                const userData = DataService.user || {};
                const current = STATE.player.customKelas || userData.details || '';
                const input = prompt('Ganti nama kelas:', current);
                if (input !== null && input.trim().length > 0) {
                    STATE.player.customKelas = input.trim();
                    const el = document.getElementById('profile-kelas-display');
                    if (el) el.innerText = input.trim();
                    showToast('✅ Nama kelas diperbarui: ' + input.trim());
                } else if (input !== null) {
                    showToast('⚠️ Nama kelas tidak boleh kosong!');
                }
            }

            // === FUNGSI EDIT MENTOR (DROPDOWN DARI FIREBASE) ===
            async function editProfileMentor() {
                // Buat modal overlay
                let overlay = document.getElementById('mentor-pick-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'mentor-pick-overlay';
                    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:99999;display:flex;align-items:center;justify-content:center;';
                    document.body.appendChild(overlay);
                }
                overlay.innerHTML = `
                    <div style="background:#fefce8;border:4px solid #a16207;border-radius:16px;padding:20px;width:90%;max-width:360px;box-shadow:0 8px 0 #78350f,0 14px 30px rgba(0,0,0,0.4);font-family:'Nunito',sans-serif;">
                        <div style="font-family:'Fredoka',sans-serif;font-size:16px;font-weight:700;color:#422006;margin-bottom:12px;text-align:center;">👩‍🏫 Pilih Guru Pendamping</div>
                        <select id="mentor-pick-select" style="width:100%;padding:10px;border:2px solid #a16207;border-radius:8px;font-size:13px;font-family:'Nunito',sans-serif;background:#fff;color:#422006;margin-bottom:14px;">
                            <option value="">⏳ Memuat daftar guru...</option>
                        </select>
                        <div style="display:flex;gap:8px;">
                            <button onclick="document.getElementById('mentor-pick-overlay').style.display='none'"
                                style="flex:1;padding:10px;background:#e2e8f0;border:2px solid #cbd5e1;border-radius:8px;cursor:pointer;font-weight:700;font-family:'Fredoka',sans-serif;">✖ Batal</button>
                            <button onclick="saveMentorChoice()"
                                style="flex:2;padding:10px;background:linear-gradient(135deg,#065f46,#047857);border:2px solid #10b981;border-radius:8px;color:#fff;cursor:pointer;font-weight:700;font-family:'Fredoka',sans-serif;">✅ Simpan</button>
                        </div>
                    </div>`;
                overlay.style.display = 'flex';

                // Load guru dari Firebase
                const sel = document.getElementById('mentor-pick-select');
                try {
                    const teachers = await DataService.getTeachers();
                    teachers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                    const currentMentor = DataService.user?.mentor || '';
                    sel.innerHTML = '<option value="">-- Pilih Guru Pendamping --</option>';
                    if (teachers.length === 0) {
                        sel.innerHTML += '<option value="" disabled>⚠️ Belum ada guru terdaftar</option>';
                    } else {
                        teachers.forEach(t => {
                            const opt = document.createElement('option');
                            opt.value = t.email;
                            const sekolah = t.school && t.school !== 'Unknown School' && t.school !== 'Unknown' ? ` — ${t.school}` : '';
                            opt.textContent = `👩‍🏫 ${t.name}${sekolah}`;
                            if (t.email === currentMentor) opt.selected = true;
                            sel.appendChild(opt);
                        });
                    }
                } catch(e) {
                    sel.innerHTML = '<option value="">⚠️ Gagal memuat — periksa koneksi</option>';
                }
            }

            async function saveMentorChoice() {
                const sel = document.getElementById('mentor-pick-select');
                if (!sel || !sel.value) { showToast('⚠️ Pilih guru terlebih dahulu!'); return; }
                const email = sel.value;
                const name = sel.options[sel.selectedIndex].textContent.replace('👩‍🏫 ', '').split(' — ')[0].trim();

                // Tutup modal
                const overlay = document.getElementById('mentor-pick-overlay');
                if (overlay) overlay.style.display = 'none';

                // Update lokal
                if (DataService.user) DataService.user.mentor = email;
                STATE.player.customMentor = name;
                STATE.mentorName = name;
                const el = document.getElementById('profile-mentor-display');
                if (el) el.innerText = name;

                // Simpan ke Firebase
                try {
                    if (DataService.mode === 'firebase' && db && DataService.user?.email) {
                        await db.collection('artifacts').doc('nusantara-arsa').collection('users')
                            .doc(DataService.user.email).update({ mentor: email });
                        showToast('✅ Mentor berhasil diperbarui: ' + name);
                    } else {
                        // Fallback lokal
                        const dbLocal = DataService.getDB();
                        if (dbLocal[DataService.user?.email]) {
                            dbLocal[DataService.user.email].mentor = email;
                            DataService.saveDB(dbLocal);
                        }
                        showToast('✅ Mentor disimpan (lokal): ' + name);
                    }
                } catch(e) {
                    console.warn('Gagal simpan mentor ke Firebase:', e);
                    showToast('⚠️ Tersimpan lokal, cek koneksi untuk sinkronisasi');
                }
            }

            // --- NEW FUNCTION: UPDATE STATUS DI INVENTORY ---
            function updateInventoryStats() {
                const p = STATE.player;
                const hpEl = document.getElementById('inv-hp-val');
                const enEl = document.getElementById('inv-energy-val');
                const apEl = document.getElementById('inv-ap-val');
                if (hpEl) hpEl.innerText = Math.floor(p.hp) + "/" + p.maxHp;
                if (enEl) enEl.innerText = Math.floor(p.energy) + "%";
                if (apEl) apEl.innerText = (p.achievementPoints || 0);
                // Update HUD AP badge — tampil untuk SEMUA role
                const hudApVal = document.getElementById('hud-ap-val');
                if (hudApVal) hudApVal.innerText = (p.achievementPoints || 0);
                const hudApBadge = document.getElementById('hud-ap-badge');
                if (hudApBadge) hudApBadge.style.display = 'flex'; // Selalu tampil
                // inv-ap-badge di inventory — tampil semua role juga
                const apBadge = document.getElementById('inv-ap-badge');
                if (apBadge) apBadge.style.display = 'flex';
            }

            // --- NEW FUNCTION: FORCE SYNC (MANUAL BUTTON) ---
            async function forceSync() {
                const icon = document.getElementById('sync-icon');
                const text = document.getElementById('sync-text');
                const btn = document.getElementById('sync-btn');

                // 1. Visual Feedback: Loading
                icon.innerText = "⏳";
                text.innerText = "Mengirim...";
                text.style.color = "#fbbf24"; // Kuning
                btn.style.borderColor = "#fbbf24";

                try {
                    // 2. Lakukan Penyimpanan Manual (Trigger update ke Firebase)
                    await manualSave();

                    // 3. Visual Feedback: Sukses
                    icon.innerText = "✅";
                    text.innerText = "Tersimpan!";
                    text.style.color = "#4ade80"; // Hijau
                    btn.style.borderColor = "#4ade80";

                    // Play SFX
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                } catch (e) {
                    // 4. Visual Feedback: Gagal
                    icon.innerText = "❌";
                    text.innerText = "Gagal (Offline)";
                    text.style.color = "#ef4444"; // Merah
                    btn.style.borderColor = "#ef4444";
                    console.error("Sync failed:", e);
                }

                // 5. Reset Tampilan setelah 2 detik
                setTimeout(() => {
                    icon.innerText = "☁️";
                    text.innerText = "Sync Data";
                    text.style.color = "#94a3b8"; // Kembali Abu-abu
                    btn.style.borderColor = "#334155";
                }, 2000);
            }


            function triggerGameOver() {
                if (STATE.gameOverTriggered) return;
                STATE.gameOverTriggered = true;

                const _mm = document.getElementById('minimap-container');
                if (_mm) _mm.classList.remove('ingame');
                const _ph = document.getElementById('pet-hud-indicator');
                if (_ph) _ph.classList.remove('visible');
                document.getElementById('ui-layer').classList.add('hidden');

                // 🎬 CINEMATIC GAME OVER dulu, baru layar gameover
                playCutsceneGameOver(() => {
                    STATE.screen = 'gameover';
                    const role = STATE.player.role;
                    const reflections = {
                        worker:       "Sebagai seorang Fighter (Pekerja), kamu telah mengerahkan tenaga dan keringatmu. Mungkin hasilnya belum maksimal, tapi kerja kerasmu membentuk karakter yang kuat. Dunia industri memang keras, tapi kamu lebih keras.",
                        student:      "Jalur Mage (Akademisi) yang kamu pilih penuh dengan ilmu. Mungkin nilaimu belum sempurna, atau teorimu belum teruji di lapangan. Namun, wawasan adalah investasi jangka panjang yang tak akan rugi.",
                        entrepreneur: "Menjadi Support (Pebisnis) itu berisiko. Mungkin profitmu belum setinggi langit, atau usahamu mengalami pasang surut. Ingat, kegagalan bisnis adalah biaya kuliah untuk kesuksesan di masa depan.",
                    };
                    document.getElementById('reflection-text').innerText = reflections[role] || "Kamu menjalani hari-harimu tanpa arah yang spesifik. Eksplorasi itu baik, tapi fokus adalah kunci keberhasilan.";
                    const quotes = [
                        "\"Kegagalan hanyalah kesempatan untuk memulai lagi dengan lebih cerdas.\" - Henry Ford",
                        "\"Bukan seberapa sering kamu jatuh, tapi seberapa cepat kamu bangkit.\" - Unknown",
                        "\"Masa depan dimiliki oleh mereka yang percaya pada keindahan mimpi mereka.\" - Eleanor Roosevelt",
                        "\"Jangan takut gagal. Takutlah berada di tempat yang sama tahun depan.\" - Unknown",
                        "\"Setiap ahli dulunya adalah seorang pemula.\" - Helen Hayes"
                    ];
                    document.getElementById('motivation-text').innerText = quotes[Math.floor(Math.random() * quotes.length)];
                    document.getElementById('game-over-screen').style.display = 'flex';
                    DataService.resetSaveData();
                });
            }

            function triggerGameWin() {
                if (STATE.gameFinished) return;
                STATE.gameFinished = true;
                STATE.screen = 'modal';
                document.getElementById('ui-layer').classList.add('hidden');

                // 🎬 CINEMATIC GAME WIN dulu, baru layar ending
                playCutsceneGameWin(() => {
                    const screen     = document.getElementById('ending-screen');
                    const narration  = document.getElementById('ending-narration');
                    const certBox    = document.getElementById('cert-box');
                    const options    = document.getElementById('ending-options');

                    screen.style.display = 'flex';
                    narration.style.display = 'block';
                    narration.style.opacity = 0;
                    setTimeout(() => narration.style.opacity = 1, 500);

                    setTimeout(() => {
                        narration.style.display = 'none';
                        certBox.style.display = 'block';
                        document.getElementById('cert-name').innerText = DataService.user ? DataService.user.name : "Player";
                        document.getElementById('cert-role').innerText = STATE.player.role.toUpperCase();
                        document.getElementById('cert-rep').innerText = STATE.player.reputation;
                        document.getElementById('cert-asset').innerText = STATE.player.money.toLocaleString();
                        setTimeout(() => { options.style.display = 'flex'; }, 2000);
                    }, 4000);
                });
            }

            function continueFreeRoam() {
                STATE.freeRoamMode = true;
                STATE.screen = 'play';
                document.getElementById('ending-screen').style.display = 'none';
                document.getElementById('ui-layer').classList.remove('hidden');
                showToast("🏝️ MODE FREE ROAM AKTIF");
            }

            function finishGame() {
                alert("Terima kasih telah bermain! Data kelulusan telah dikirim ke guru.");
                logout();
            }

            // --- FIX: RESTART GAME SEKARANG MENGGUNAKAN RELOAD UNTUK PEMBERSIHAN TOTAL ---
            async function restartGame() {
                // 1. Visual Feedback
                const btn = document.querySelector('#game-over-screen button');
                if (btn) {
                    btn.innerHTML = "⏳ Wiping Data...";
                    btn.disabled = true;
                }
                document.body.style.cursor = 'wait';

                // 2. Hentikan Loop Game & Auto Save (Penting!)
                if (window.gameLoopId) cancelAnimationFrame(window.gameLoopId);
                if (window.saveIntervalId) clearInterval(window.saveIntervalId);

                try {
                    // 3. Hapus Data Permanen (Cloud & Local Cache)
                    await DataService.resetSaveData();

                    // 4. Force Reload Halaman
                    // Ini adalah cara paling aman. checkSession() akan berjalan saat reload.
                    // Karena Local Storage sudah dibersihkan di langkah 3, checkSession akan
                    // mendeteksi 'saveData = null' dan OTOMATIS memanggil startPrologue().
                    location.reload();

                } catch (e) {
                    console.error("Restart Error:", e);
                    alert("Gagal mereset data. Halaman akan dimuat ulang paksa.");
                    location.reload();
                }
            }

            function returnToTitle() {
                location.reload();
            }

            let lastCollisionTime = 0;

            // --- NEW FUNCTION: HANDLE SKILL (ULTIMATE) ---
            function handleSkill() {
                const p = STATE.player;

                // Cek Cooldown
                if (p.skillCooldown > 0) {
                    showToast("Skill sedang Cooldown!");
                    return;
                }

                // Cek Energi
                if (p.energy < 10) {
                    showToast("Energi tidak cukup! (Butuh 10)");
                    return;
                }

                // Activate Skill
                p.energy -= 10;
                p.skillCooldown = 180; // 3 Detik Cooldown (60 FPS)

                // Logic: AoE Damage
                const range = 120; // Radius ledakan
                const damage = p.str * 4 + 20; // Damage Besar (Base + STR)

                // Visual Effect: Shockwave Ring
                for (let i = 0; i < 36; i++) {
                    const angle = (i * 10) * (Math.PI / 180);
                    STATE.particles.push({
                        x: p.x + 10,
                        y: p.y + 10,
                        vx: Math.cos(angle) * 8, // Menyebar cepat
                        vy: Math.sin(angle) * 8,
                        life: 30,
                        color: '#ef4444', // Merah Api
                        size: 5 + Math.random() * 5,
                        type: 'dust' // Reuse dust logic for circle particles
                    });
                }

                // Screen Shake Effect
                STATE.shakeTimer = 20;

                // SFX
                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // Damage Calculation
                let hitCount = 0;
                STATE.enemies.forEach(en => {
                    const dist = Math.hypot(p.x - en.x, p.y - en.y);
                    if (dist < range) {
                        hitCount++;
                        en.hp -= damage;

                        // Massive Knockback (Terlempar jauh)
                        en.knockback = {
                            x: (en.x - p.x) * 2,
                            y: (en.y - p.y) * 2
                        };

                        spawnFloatingText(en.x, en.y - 30, "🔥 " + damage, "#ef4444", 20);
                        createParticle(en.x, en.y, '#fbbf24'); // Sparks
                    }
                });

                if (hitCount > 0) {
                    showToast(`ULTIMATE! Hit ${hitCount} Musuh!`);
                    spawnFloatingText(p.x, p.y - 40, "BOOM!", "#fbbf24", 24);
                } else {
                    showToast("Skill meleset... (Tidak ada target)");
                }
            }

            // --- FIX: DEFINISI FUNGSI GAMELOOP (WAJIB ADA) ---
            function gameLoop() {
                // 1. Update Logika Game
                update();

                // 2. Render Grafis ke Canvas
                draw();

                // 3. Update Audio System (BGM/SFX)
                if (typeof AudioService !== 'undefined') AudioService.update();

                // 4. FIX: Cek build queue fairy village di setiap frame agar pop-up & bangunan
                //    muncul otomatis meski player sedang tidak berada di fairyVillage
                if (typeof checkBuildQueue === 'function' && STATE.screen === 'play') {
                    checkBuildQueue();
                }

                // 5. Loop Frame berikutnya (60 FPS)
                if (STATE.screen !== 'title' && STATE.screen !== 'login' && STATE.screen !== 'splash') {
                    window.gameLoopId = requestAnimationFrame(gameLoop);
                }
            }

            function update() {

                // UPDATE: PASSIVE INCOME CHECK
                if (STATE.player.role === 'entrepreneur') {
                    updatePassiveIncome();
                }


                // --- FIX: UPDATE POINTER TUTORIAL SELALU (BAHKAN SAAT DIALOG/PAUSE) ---
                // Pindahkan logika ini ke ATAS pengecekan screen !== 'play'
                // Ini memastikan tangan penunjuk tetap muncul dan posisinya benar saat dialog tutorial aktif
                if (STATE.tutorialFocusTarget) {
                    updateTutorialPointerPosition();
                }

                if (STATE.screen !== 'play') return;

                // Removed btnSkill display logic block here

                // --- NEW: UPDATE LIVE TUTORIAL POINTER ---
                // Pastikan pointer selalu menempel pada objek meskipun kamera bergerak
                if (STATE.tutorialFocusTarget) {
                    updateTutorialPointerPosition();
                }

                // --- LOGIKA TOMBOL SKILL (HANYA TAMPIL DI DUNGEON) ---
                const btnSkill = document.getElementById('btn-skill');
                if (btnSkill) {
                    const isCombatZone = (STATE.location === 'dungeon' || STATE.location === 'ruins_battle');
                    if (isCombatZone) {
                        btnSkill.style.display = 'flex';
                        if (STATE.player.skillCooldown > 0) {
                            btnSkill.classList.add('cooldown');
                            const cdSec = Math.ceil(STATE.player.skillCooldown / 60);
                            btnSkill.innerText = cdSec;
                            btnSkill.title = `Cooldown: ${cdSec}s`;
                        } else {
                            btnSkill.classList.remove('cooldown');
                            btnSkill.innerText = '🔥';
                            btnSkill.title = "Ultimate Skill (10 Stamina)";
                        }
                    } else {
                        btnSkill.style.display = 'none';
                    }
                }

                // --- NEW: DECREMENT SKILL COOLDOWN ---
                if (STATE.player.skillCooldown > 0) {
                    STATE.player.skillCooldown--;
                }

                // --- NEW: GLOBAL LOW ENERGY WARNING CHECK ---
                // Cek jika energi kritis (<= 20) dan belum diperingatkan
                if (STATE.player.energy <= 20 && !STATE.lowEnergyWarned) {
                    showToast("⚠️ PERINGATAN: Stamina Kritis! Segera Makan/Istirahat.");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('hit'); // Bunyi alert
                    STATE.lowEnergyWarned = true; // Set flag agar tidak spam
                }
                // Reset flag jika energi sudah diisi kembali (> 20)
                else if (STATE.player.energy > 20) {
                    STATE.lowEnergyWarned = false;
                }

                // UPDATE: Waktu diperlambat (1 Jam Game = 60 Detik Real Time)
                // Rumus: 100 unit (1 jam) / 60 detik / 60 fps ≈ 0.028
                // FIX: Jangan tambah waktu saat proses ganti hari sedang berlangsung
                if (!STATE.isDayChanging) {
                    STATE.time += 0.028;
                }
                // --- FESTIVAL AMBIENT PARTICLES ---
                updateFestivalAmbientParticles();

                if (STATE.player.shiftStarted) {
                    if (STATE.time >= 1600) {
                        STATE.player.shiftStarted = false;
                        STATE.player.salaryDays++;

                        // --- UPDATE: SISTEM GAJI BERJENJANG (CAREER PATH) ---
                        const currentLvl = STATE.player.jobLevel || 1;
                        let dailyWage = 5000; // Lv 1 Magang

                        if (currentLvl === 2) dailyWage = 7500;  // Staff Senior
                        else if (currentLvl === 3) dailyWage = 12000; // Kepala Gudang
                        else if (currentLvl === 4) dailyWage = 25000; // Manajer Cabang

                        // --- NEW: BONUS CINCIN RAJA (PASIF GOLD++) ---
                        let bonusMsg = "";
                        if ((STATE.player.inventory['cincin_legend'] || 0) > 0) {
                            dailyWage = Math.floor(dailyWage * 1.5); // +50% Gaji
                            bonusMsg = " 💍"; // Indikator Bonus
                        }

                        STATE.player.money += dailyWage;
                        STATE.player.energy -= 30;

                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); // SFX Gaji

                        if (STATE.time > 1630) {
                            showToast(`Shift Selesai. Gaji: ${dailyWage.toLocaleString()} G${bonusMsg}`);
                        } else {
                            STATE.player.bossReputation += 1;
                            // AP bonus shift sempurna: 1-5 AP tergantung level jabatan
                            const shiftAP = currentLvl;
                            STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + shiftAP;
                            showToast(`✅ Shift Tepat Waktu! +${dailyWage.toLocaleString()} G | Rep +1 | 🏅 +${shiftAP} AP`);
                        }
                    }
                }

                // --- PART-TIME SHIFT SYSTEM (15:00 - 19:00) ---
                if (STATE.player.partTimeShiftStarted) {
                    if (STATE.time >= 1900) {
                        STATE.player.partTimeShiftStarted = false;
                        STATE.player.partTimeLastWorkedDay = STATE.day;
                        STATE.player.partTimeSalaryDays = (STATE.player.partTimeSalaryDays || 0) + 1;

                        const PT_JOBS = {
                            'bengkel':   { name: '⚒️ Bengkel Besi',   wage: 3500, stat: 'str', statVal: 1 },
                            'penjahit':  { name: '🧵 Tukang Jahit',   wage: 3000, stat: 'int', statVal: 1 },
                            'klinik':    { name: '🩺 Klinik',          wage: 4000, stat: 'rep', statVal: 1 }
                        };
                        const job = PT_JOBS[STATE.player.partTimeJob] || { name: 'Part-Time', wage: 3000, stat: null };
                        STATE.player.money += job.wage;
                        STATE.player.energy -= 20;

                        if (job.stat === 'str') STATE.player.str = (STATE.player.str || 0) + job.statVal;
                        else if (job.stat === 'int') STATE.player.int = (STATE.player.int || 0) + job.statVal;
                        else if (job.stat === 'rep') STATE.player.reputation = (STATE.player.reputation || 0) + job.statVal;

                        STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 1;
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        showToast(`🌙 Part-Time Selesai! ${job.name} +${job.wage.toLocaleString()} G | 🏅 +1 AP`);
                    }
                }

                const totalDays = STATE.day - 1;
                const seasonIndex = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                STATE.season = SEASONS[seasonIndex].toLowerCase();

                const year = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;
                const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;

                // --- NEW: HITUNG NAMA HARI (SENIN-MINGGU) ---
                // (Day 1 = Senin, Day 7 = Minggu, Day 8 = Senin dst)
                const dayName = DAYS_OF_WEEK[(STATE.day - 1) % 7];

                if (!STATE.freeRoamMode) {
                    // FIX: Ubah logika notifikasi Trial Selesai ke Tahun ke-4 (Setelah 3 tahun habis)
                    if (year === 4 && dayInSeason === 1 && STATE.time < 10) {
                        showToast("🔓 MASA TRIAL SELESAI! Semua Akses Terbuka.");
                    }

                    if (year > 5 && !STATE.gameFinished) {
                        triggerGameWin();
                        return;
                    }

                    const daysInYear = DAYS_PER_SEASON * 4;

                    // FIX: Ubah durasi Trial menjadi 3 Tahun (3 * 120 = 360 Hari)
                    // Sebelumnya: 2 * daysInYear (240 Hari)
                    const trialLimit = 3 * daysInYear;

                    const graduationLimit = 5 * daysInYear;

                    let labelText = "";

                    if (STATE.day <= trialLimit) {
                        const left = trialLimit - STATE.day;
                        labelText = `🔒 Trial: ${left} Hari`;
                        document.getElementById('trial-display').style.color = '#ef4444';
                    } else {
                        const left = graduationLimit - STATE.day;
                        labelText = `🎓 Lulus: ${left} Hari`;
                        document.getElementById('trial-display').style.color = '#fbbf24';
                    }

                    document.getElementById('trial-display').innerText = labelText;
                } else {
                    document.getElementById('trial-display').innerText = "∞ Free Roam";
                }

                if (STATE.time >= 2400 && !STATE.isDayChanging) {
                    STATE.time = 0;
                    STATE.day++;

                    // 💔 RELATIONSHIP DECAY: NPC menjauh jika lama tidak disapa
                    try { applyRelationshipDecay(); } catch(e) {}

                    // --- TUTUP FESTIVAL SAAT HARI BERGANTI ---
                    if (STATE.festivalActive) {
                        deactivateFestivalGathering();
                        showToast('🌙 Festival selesai. Warga kembali ke aktivitas masing-masing. Sampai festival berikutnya!');
                    }


                    // --- [KODE PERTANIAN: LOGIKA TUMBUH & SIRAM OTOMATIS (KURCACI)] ---
                    if (STATE.player.farming) {
                        for (const [key, crop] of Object.entries(STATE.player.farming)) {
                            if (crop && crop.type) {
                                // Kurcaci: auto siram sebelum pengecekan tumbuh
                                if (STATE.player.hiredDwarf) {
                                    crop.watered = true;
                                }
                                // Tanaman tumbuh jika sudah disiram
                                if (crop.watered && crop.stage < 3) {
                                    crop.stage++;
                                }
                                // Reset siram SETELAH tumbuh (bukan sebelum)
                                crop.watered = false;
                            }
                        }
                    }

                    // --- [BARU: LOGIKA AUTO PANEN (PERI PANEN)] ---
                    // Jika Peri sudah dihire, cek tanaman yang matang (Stage 3)
                    if (STATE.player.hiredFairy && STATE.player.farming) {
                        let harvestedCount = 0;
                        for (const [key, crop] of Object.entries(STATE.player.farming)) {
                            if (crop && crop.type && crop.stage >= 3) {
                                let item = 'beras';
                                let qty = 1;

                                if (crop.type === 'padi') { item = 'beras'; qty = 3; }
                                else if (crop.type === 'jagung') { item = 'jagung_panen'; qty = 4; }
                                else if (crop.type === 'tomat') { item = 'tomat_panen'; qty = 3; }
                                else if (crop.type === 'rafflesia') { item = 'bunga_rafflesia'; qty = 1; }

                                addItem(item, qty);
                                gainExp(10);
                                harvestedCount++;

                                delete crop.type;
                                delete crop.stage;
                                delete crop.watered;
                            }
                        }
                        if (harvestedCount > 0) {
                            showToast(`Peri Panen: ${harvestedCount} tanaman dipanen otomatis! 🧚‍♀️`);
                        }
                    }
                    // ----------------------------------------------------

                    // RESET SEMUA COUNTER HARIAN (termasuk bonus quest counter)
                    STATE.player.dailyFishingCount  = 0;
                    STATE.player.dailyMonsterKills  = 0;
                    STATE.player.dailyTalkCount     = 0;
                    STATE.player.dailyHarvestCount  = 0;
                    STATE.player.dailySellCount     = 0;  // NEW: counter jual barang
                    STATE.player.dailySelfStudy     = 0;  // NEW: counter belajar mandiri
                    // NOTE: lastDailyClaim TIDAK di-reset di sini karena reset via day number (STATE.day baru)

                    // --- SISTEM KONFLIK PERNIKAHAN DINI ---
                    if (STATE.player.married && !STATE.player.divorced && STATE.player.marriedDay) {
                        setTimeout(() => runMarriageConflictSystem(), 2500);
                    }

                    // --- CEK & AKTIFKAN FESTIVAL HARI INI ---
                    setTimeout(() => checkAndStartFestival(), 1500);

                    // --- FESTIVAL REMINDER H-1 ---
                    setTimeout(() => checkFestivalReminder(), 2000);

                    // --- SISTEM KONFLIK AKADEMIK (STUDENT) ---
                    if (STATE.player.role === 'student' && STATE.player.major) {
                        setTimeout(() => maybeRunStudentConflict(), 3000);
                    }

                    // --- SISTEM KONFLIK WIRAUSAHA (ENTREPRENEUR) ---
                    if (STATE.player.role === 'entrepreneur') {
                        setTimeout(() => maybeRunEntrepreneurConflict(), 3200);
                    }

                    // --- FASE 3: GEMPITA SEASON NOTIFICATION ---
                    // Trigger di musim panas (Summer), hari 5, 14, dan 25 setiap tahun
                    (() => {
                        const totalDays = STATE.day - 1;
                        const seasonIdx = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                        const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;
                        const isSummer = (seasonIdx === 1); // index 0=Spring, 1=Summer, 2=Autumn, 3=Winter

                        if (isSummer && dayInSeason === 5) {
                            setTimeout(() => {
                                showDialogue("📣 PENGUMUMAN — GEMPITA SEASON",
    `🎪 **GEMPITA FESTIVAL — SEMUA JALUR BISA IKUT!**\n\nFestival Desa Nusantara Arsa kini resmi dibuka!\n\n**4 Kategori Lomba:**\n🎓 Akademisi → Portfolio + AP\n⚔️ Pekerja → Karir + Shift sempurna\n💼 Wirausaha → Omzet + BIZ stat\n🏠 Keluarga → Harmoni + AP\n\nSemua role dapat AP dari aktivitas hariannya.\nPengumuman pemenang di hari musim panas ke-25!`,
                                    [{ text: "Siap Berjuang! 🔥", action: closeDialogue }],
                                    null
                                );
                            }, 2000);
                        }

                        if (isSummer && dayInSeason === 14) {
                            setTimeout(() => {
                                const ap = STATE.player.achievementPoints || 0;
                                const pc = (STATE.player.portfolio || []).length;
                                const jc = (STATE.player.reflections || []).length;
                                const role14 = STATE.player.role;
                                let syarat14 = [], met14Items = [];
                                if (role14 === 'student') {
                                    syarat14 = ['Portfolio ≥1','Jurnal ≥5','AP ≥50'];
                                    met14Items = [pc >= 1, jc >= 5, ap >= 50];
                                } else if (role14 === 'worker') {
                                    const jl14 = STATE.player.jobLevel || 1;
                                    syarat14 = ['Karyawan Aktif','Level Jabatan ≥2','AP ≥30'];
                                    met14Items = [STATE.player.jobStatus === 'employed', jl14 >= 2, ap >= 30];
                                } else if (role14 === 'entrepreneur') {
                                    syarat14 = ['BIZ ≥10','Jurnal ≥3','AP ≥30'];
                                    met14Items = [(STATE.player.biz || 0) >= 10, jc >= 3, ap >= 30];
                                } else if (role14 === 'family') {
                                    const sId14 = STATE.player.spouseId;
                                    const love14 = sId14 ? (STATE.player.relationships?.[sId14] || 0) : 0;
                                    syarat14 = ['Sudah Menikah','Cinta ≥50','AP ≥30'];
                                    met14Items = [STATE.player.married, love14 >= 50, ap >= 30];
                                } else { syarat14 = ['Pilih Role dulu!']; met14Items = [false]; }
                                const met14Count = met14Items.filter(Boolean).length;
                                const statusMsg = met14Count === syarat14.length ? '✅ Kamu SUDAH memenuhi semua syarat! Pertahankan!' : `⚠️ Kamu baru memenuhi ${met14Count}/${syarat14.length} syarat. Masih ada 11 hari!`;
                                const detailMsg = syarat14.map((s,i) => `${met14Items[i] ? '🟢' : '🔴'} ${s}`).join('\n');
                                showDialogue("📋 GEMPITA: CEK STATUS FESTIVAL",
                                    `Hari ini adalah batas pengumpulan karya!\n\n**Statusmu (${['none','Akademisi','Pekerja','Wirausaha','Keluarga'].find((v,i)=>['none','student','worker','entrepreneur','family'][i]===role14) || role14}):**\n${detailMsg}\n\n${statusMsg}`,
                                    [{ text: "Oke, Mengerti!", action: closeDialogue }],
                                    null
                                );
                            }, 2000);
                        }

                        if (isSummer && dayInSeason === 25) {
                            setTimeout(async () => {
                                const ap = STATE.player.achievementPoints || 0;
                                const pc = (STATE.player.portfolio || []).length;
                                const jc = (STATE.player.reflections || []).length;
                                const roleF = STATE.player.role;
                                let eligible = false;
                                if (roleF === 'student') eligible = (pc >= 1 && jc >= 5 && ap >= 50);
                                else if (roleF === 'worker') eligible = (STATE.player.jobStatus === 'employed' && (STATE.player.jobLevel || 1) >= 2 && ap >= 30);
                                else if (roleF === 'entrepreneur') eligible = ((STATE.player.biz || 0) >= 10 && jc >= 3 && ap >= 30);
                                else if (roleF === 'family') { const sIdF = STATE.player.spouseId; const loveF = sIdF ? (STATE.player.relationships?.[sIdF] || 0) : 0; eligible = (STATE.player.married && loveF >= 50 && ap >= 30); }

                                if (eligible) {
                                    // Cek ranking di antara semua siswa (ambil dari cache jika ada, atau hitung lokal)
                                    let myRank = 1; // default assume rank 1 jika tidak ada data cloud
                                    try {
                                        const allStudents = await DataService.getAllStudents();
                                        const calcScore = (sd) => {
                                                const r = sd.role || 'none'; const sap = sd.achievementPoints || 0;
                                                const spc = (sd.portfolio||[]).length; const sjc = (sd.reflections||[]).length;
                                                const jl = sd.jobLevel || 1; const bz = sd.biz || 0; const mn = sd.money || 0;
                                                const sId = sd.spouseId; const lv = sId ? (sd.relationships?.[sId] || 0) : 0;
                                                const rep = sd.reputation || 0;
                                                if (r === 'student') return sap + (spc * 20) + (sjc * 5);
                                                if (r === 'worker') return sap + (jl * 30) + ((sd.bossReputation || 0) * 2);
                                                if (r === 'entrepreneur') return sap + (bz * 10) + Math.floor(mn / 1000);
                                                if (r === 'family') return sap + (lv * 2) + rep;
                                                return sap;
                                            };
                                            const myRoleF2 = STATE.player.role;
                                            const ranked = allStudents
                                                .filter(s => {
                                                    const sd = s.saveData || {}; const r = sd.role;
                                                    const sap = sd.achievementPoints || 0; const spc = (sd.portfolio||[]).length; const sjc = (sd.reflections||[]).length;
                                                    if (r !== myRoleF2) return false; // hanya sesama kategori
                                                    if (r === 'student') return sap >= 50 && spc >= 1 && sjc >= 5;
                                                    if (r === 'worker') return sd.jobStatus === 'employed' && (sd.jobLevel||1) >= 2 && sap >= 30;
                                                    if (r === 'entrepreneur') return (sd.biz||0) >= 10 && sjc >= 3 && sap >= 30;
                                                    if (r === 'family') { const sId = sd.spouseId; const lv = sId ? (sd.relationships?.[sId]||0):0; return sd.married && lv >= 50 && sap >= 30; }
                                                    return false;
                                                })
                                                .map(s => ({ email: s.email, score: calcScore(s.saveData || {}) }))
                                                .sort((a, b) => b.score - a.score);
                                            const myScore = calcScore(STATE.player);
                                        const myPos = ranked.findIndex(r => r.email === DataService.user?.email);
                                        if (myPos !== -1) myRank = myPos + 1;
                                    } catch (e) { /* offline fallback */ }

                                    // Reward berdasarkan rank
                                    let rankMsg = "";
                                    let rankBonus = 0;
                                    let rankTitle = "";
                                    let awardToga = false;

                                    if (myRank === 1) {
                                        rankMsg = "🥇 **JUARA 1 — GEMPITA CHAMPION!**\nKamu mendominasi seluruh kelas!";
                                        rankBonus = 300;
                                        rankTitle = "🥇 Gempita Champion";
                                        awardToga = true;
                                        STATE.player.inventory['toga_gempita'] = 1;
                                        STATE.player.inventory['mahkota_gempita'] = 1; // bonus item juara 1
                                        addItem('permata', 3);
                                    } else if (myRank === 2) {
                                        rankMsg = "🥈 **JUARA 2 — GEMPITA RUNNER-UP!**\nHampir sempurna, pertahankan!";
                                        rankBonus = 200;
                                        rankTitle = "🥈 Gempita Runner-up";
                                        awardToga = true;
                                        STATE.player.inventory['toga_gempita'] = 1;
                                        addItem('permata', 2);
                                    } else if (myRank === 3) {
                                        rankMsg = "🥉 **JUARA 3 — GEMPITA THIRD PLACE!**\nKerja keras yang luar biasa!";
                                        rankBonus = 100;
                                        rankTitle = "🥉 Gempita Finalist";
                                        awardToga = true;
                                        STATE.player.inventory['toga_gempita'] = 1;
                                        addItem('permata', 1);
                                    } else {
                                        rankMsg = `📋 **PESERTA GEMPITA (Peringkat #${myRank})**\nKamu lolos seleksi administrasi!`;
                                        rankBonus = 50;
                                        rankTitle = "🏅 Peserta Gempita";
                                    }

                                    STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 100 + rankBonus;
                                    STATE.player.money += rankBonus * 50; // Gold bonus
                                    if (!STATE.player.titles) STATE.player.titles = [];
                                    if (!STATE.player.titles.includes(rankTitle)) STATE.player.titles.push(rankTitle);

                                    const togaMsg = awardToga ? '\n\n👗 **TOGA GEMPITA JUARA** telah masuk ke Lemari Pakaianmu! Buka Lemari untuk mengenakannya.' : '';

                                    showDialogue("🏆 GEMPITA AWARDS — HARI PENGUMUMAN!",
                                        `🎉 **SELAMAT! KAMU LOLOS GEMPITA SEASON!**\n\n${rankMsg}\n\n✅ Portfolio: ${pc} karya | ✅ Jurnal: ${jc} entri | ✅ AP: ${ap} poin\n\n🎁 **HADIAH DITERIMA:**\n• +${100 + rankBonus} Achievement Points\n• +${rankBonus * 50} Gold\n• Gelar: ${rankTitle}${togaMsg}`,
                                        [{ text: "YEAY! Terima Kasih! 🏅", action: () => {
                                            closeDialogue();
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('levelup');
                                        }}],
                                        null
                                    );
                                } else {
                                    showDialogue("🎪 GEMPITA FESTIVAL — HARI PENGUMUMAN",
                                        `Hari Festival telah tiba!\n\nSayangnya, kamu belum memenuhi syarat kategori ${{'student':'🎓 Akademisi','worker':'⚔️ Pekerja','entrepreneur':'💼 Wirausaha','family':'🏠 Keluarga'}[roleF] || roleF}.\n\nAP kamu saat ini: ${ap} poin.\n\nJangan menyerah! Gempita Festival berikutnya akan datang musim panas tahun depan!`,
                                        [{ text: "Tahun Depan Pasti Lolos! 💪", action: closeDialogue }],
                                        null
                                    );
                                }
                            }, 3000);
                        }
                    })();

                    // --- FARM HELPER AMBIENT PARTICLES (per-hari, saat ganti hari) ---
                    if (STATE.player.hiredDwarf || STATE.player.hiredFairy) {
                        setTimeout(() => {
                            if (STATE.location === 'village') {
                                const fMap = MAPS['village'];
                                if (fMap && fMap.npcs) {
                                    fMap.npcs.forEach(npc => {
                                        if (npc.id === 'kurcaci_farm' && STATE.player.hiredDwarf) {
                                            createParticle(npc.x * TILE_SIZE + 14, npc.y * TILE_SIZE, '#86efac');
                                            createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE + 14, '#fbbf24');
                                        }
                                        if (npc.id === 'peri_farm' && STATE.player.hiredFairy) {
                                            createParticle(npc.x * TILE_SIZE + 14, npc.y * TILE_SIZE, '#f9a8d4');
                                            createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE + 14, '#c084fc');
                                        }
                                    });
                                }
                            }
                        }, 500);
                    }

                    if (STATE.player.shiftStarted) {
                        STATE.player.shiftStarted = false;
                        STATE.player.bossReputation -= 5;
                        showToast("Boss Marah: Kamu tidak absen pulang!");
                    }

                    if (STATE.player.salaryDays >= 30) {
                        STATE.player.salaryDays = 0;
                        const rep = STATE.player.bossReputation || 50;
                        const bonus = rep * 100;
                        STATE.player.money += bonus;
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                        // Reaksi bos berdasarkan reputasi
                        let bossMonthMsg = '';
                        if (rep >= 80) {
                            bossMonthMsg = `🌟 Pak Hendra: "Kamu karyawan terbaik bulan ini! Bonus penuh untukmu!" (+${bonus.toLocaleString()} G)`;
                            gainExp(50);
                        } else if (rep >= 50) {
                            bossMonthMsg = `😊 Pak Hendra: "Kerja cukup baik bulan ini. Bonus sesuai performa." (+${bonus.toLocaleString()} G)`;
                        } else if (rep >= 25) {
                            bossMonthMsg = `😐 Pak Hendra: "Kinerja bulan ini mengecewakan. Bonus dipotong." (+${bonus.toLocaleString()} G)\n⚠️ Perbaiki kinerjamu atau jabatanmu terancam!`;
                        } else {
                            bossMonthMsg = `😠 Pak Hendra: "Kamu hampir tidak layak dapat bonus. Ini peringatan keras terakhir!" (+${bonus.toLocaleString()} G)\n🚨 Reputasi kritis! Konflik berikutnya bisa berujung pemecatan!`;
                        }
                        showToast(bossMonthMsg);
                    }

                    // --- NEW: BEASISWA BULANAN (KHUSUS MAHASISWA BERPRESTASI) ---
                    // Trigger setiap awal bulan (Hari 31, 61, 91, dst) -> 1 Bulan = 30 Hari
                    if (STATE.player.role === 'student' && STATE.player.scholarship && (STATE.day - 1) % 30 === 0 && STATE.day > 1) {
                        const scholarshipAmount = 15000;
                        STATE.player.money += scholarshipAmount;

                        // Tampilkan Notifikasi Uang Saku
                        setTimeout(() => {
                            showDialogue("KAMPUS - BAGIAN KEUANGAN",
                                `📧 **TRANSFER BEASISWA MASUK**\n\nHalo Mahasiswa Berprestasi,\nUang saku beasiswa bulanan sebesar **Rp ${scholarshipAmount.toLocaleString()}** telah ditransfer ke rekening Anda.\n\nGunakan untuk biaya hidup dan beli buku pelajaran ya!`,
                                [{ text: "Terima Kasih! (Cair)", action: closeDialogue }],
                                'images/lecture.png'
                            );
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        }, 2500); // Delay sedikit agar muncul setelah notifikasi ganti hari
                    }

                    // --- NEW: SISTEM BAYAR UKT TAHUNAN (UPDATE LOGIKA BEASISWA VS REGULER) ---
                    // Trigger setiap awal tahun baru (Hari 121, 241, dst) -> 1 Tahun = 120 Hari
                    if (STATE.player.role === 'student' && (STATE.day - 1) % 120 === 0 && STATE.day > 1) {
                        const currentYear = Math.ceil(STATE.day / 120);

                        // CEK 1: APAKAH MAHASISWA BEASISWA?
                        if (STATE.player.scholarship) {
                            // JIKA BEASISWA: GRATIS
                            setTimeout(() => {
                                showDialogue("BAGIAN KEUANGAN KAMPUS",
                                    `📢 **PEMBERITAHUAN TAHUN AJARAN BARU**\n\nMemasuki Tahun ke-${currentYear}.\n\nStatus Anda: **PENERIMA BEASISWA**\nBiaya UKT: **GRATIS (Rp 0)**.\n\nPertahankan prestasimu!`,
                                    [{ text: "Alhamdulillah (Lanjut Kuliah)", action: closeDialogue }],
                                    'images/lecture.png'
                                );
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            }, 1500);
                        }
                        // CEK 2: JIKA BUKAN BEASISWA (REGULER)
                        else {
                            const uktAmount = 600000;

                            // Tarik Uang (Bisa Minus/Hutang)
                            STATE.player.money -= uktAmount;

                            // Tampilkan Notifikasi Tagihan
                            setTimeout(() => {
                                let statusMsg = "";
                                let titleMsg = "TAGIHAN UKT OTOMATIS";
                                let iconMsg = "✅ Lunas";

                                if (STATE.player.money < 0) {
                                    statusMsg = `\n\n⚠️ **PERINGATAN KRITIS**:\nSaldo Anda MINUS (${STATE.player.money.toLocaleString()} G). \nSegera lunasi hutang ini atau Ijazah Anda akan ditahan!`;
                                    titleMsg = "TUNGGAKAN UKT";
                                    iconMsg = "❌ Berhutang";
                                }

                                showDialogue("BAGIAN KEUANGAN KAMPUS",
                                    `📢 **PEMBERITAHUAN TAHUN AJARAN BARU**\n\nMemasuki Tahun ke-${currentYear}.\nBiaya UKT (Jalur Reguler) sebesar **Rp ${uktAmount.toLocaleString()}** telah dibebankan ke rekening Anda.\n\nStatus: ${iconMsg}${statusMsg}`,
                                    [{ text: "Mengerti (Lanjut Kuliah)", action: closeDialogue }],
                                    'images/lecture.png'
                                );

                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            }, 1500);
                        }
                    }

                    randomizeWeather();

                    // --- FIX: PASTIKAN TREN HARIAN DIGENERATE SAAT GANTI HARI ---
                    generateDailyTrend();

                    // --- NEW: RESPAWN BUNGA LIAR SETIAP HARI ---
                    spawnWildFlowers();

                    // --- NEW: POPUP QUEST HARIAN SAAT GANTI HARI ---
                    showDailyQuestPopup();

                    // showToast(`Day ${STATE.day} (${STATE.season.toUpperCase()})`); // Toast diganti popup biar lebih jelas
                }

                // --- NEW: FAINTING MECHANIC (PINGSAN KARENA LELAH) ---
                if (STATE.player.energy <= 0) {
                    handleFaint();
                    return; // Hentikan update frame ini
                }

                const btnAction = document.getElementById('btn-action');
                const entranceNear = checkEntranceProximity();

                // LOGIC BARU: Cek Interaksi untuk Visibility Tombol
                let showActionButton = false;
                let actionIcon = '💬';

                // 1. Cek Dungeon (Selalu Muncul untuk Serang)
                if (STATE.location === 'dungeon' || STATE.location === 'ruins_battle') {
                    showActionButton = true;
                    actionIcon = '⚔️';
                }
                // 2. Cek Fishing (Selalu Muncul)
                else if (STATE.fishing.active) {
                    showActionButton = true;
                    actionIcon = '🎣';
                }
                // 3. Cek Interaksi (Bangunan/Pintu)
                else if (entranceNear) {
                    showActionButton = true;
                    // FIX: Custom Icon berdasarkan Tipe Bangunan
                    if (entranceNear.id === 'port') {
                        actionIcon = '🎣';
                    }
                    // UPDATE: Ganti Ikon Pintu jadi Scroll untuk Papan Misi
                    else if (entranceNear.id === 'papan_misi') {
                        actionIcon = '📜';
                    }
                    // UPDATE: Ganti Ikon Pintu jadi Piala untuk Statue
                    else if (entranceNear.id === 'statue_rank') {
                        actionIcon = '🏆';
                    }
                    else {
                        actionIcon = '🚪';
                    }
                }
                // 4. Cek Interaksi (NPC & Object)
                else {
                    // Cek NPC
                    const map = maps[STATE.location];

                    // --- UPDATE: Logic Deteksi NPC (Menggunakan Jarak Radial) ---
                    // Cari NPC terdekat dalam radius interaksi
                    let closestNPC = null;
                    let minNPCDist = 80; // Radius deteksi NPC

                    // FIX fairyVillage: gunakan tile size & posisi runtime yang benar
                    const _btnTS = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;

                    for (let npc of map.npcs) {
                        if (!isNPCActive(npc)) continue;
                        const pCX = STATE.player.x + (STATE.player.w / 2);
                        const pCY = STATE.player.y + (STATE.player.h / 2);

                        let nCX, nCY;
                        if (STATE.location === 'fairyVillage' && typeof fvNpcRuntime !== 'undefined' && fvNpcRuntime[npc.id]) {
                            const rt = fvNpcRuntime[npc.id];
                            nCX = rt.px + 19;
                            nCY = rt.py + 29;
                        } else {
                            nCX = (npc.x * _btnTS) + ((npc.w || 40) / 2);
                            nCY = (npc.y * _btnTS) + ((npc.h || 60) / 2);
                        }

                        const radius = STATE.location === 'fairyVillage' ? _btnTS * 2.5 : 80;
                        const dist = Math.hypot(pCX - nCX, pCY - nCY);
                        if (dist < radius && dist < minNPCDist) {
                            closestNPC = npc;
                            minNPCDist = dist;
                        }
                    }

                    if (closestNPC) {
                        showActionButton = true;
                        if (STATE.player.married && STATE.player.spouseId === closestNPC.id) {
                            actionIcon = '💖';
                        } else if (closestNPC.dialogFn === 'collectFairyDust') {
                            actionIcon = '✨';
                        } else if (closestNPC.dialogFn === 'openIstanaDialog') {
                            actionIcon = '🏰';
                        } else {
                            actionIcon = '💬';
                        }
                        // FIX fairyVillage: simpan nama NPC untuk label tombol
                        if (STATE.location === 'fairyVillage' && closestNPC.name) {
                            btnAction.dataset.fvLabel = actionIcon + ' ' + closestNPC.name;
                        } else {
                            btnAction.dataset.fvLabel = '';
                        }
                    }

                    // Scan Object Nearby (Jika belum ketemu NPC)
                    if (!showActionButton) {
                        // --- FIX: DEFINISI VARIABEL BOUNDING BOX PLAYER ---
                        const buffer = 10;
                        const pLeft = STATE.player.x - buffer;
                        const pRight = STATE.player.x + STATE.player.w + buffer;
                        const pTop = STATE.player.y - buffer;
                        const pBottom = STATE.player.y + STATE.player.h + buffer;

                        for (let obj of map.objects) {
                            // --- FIX: DEFINISI VARIABEL BOUNDING BOX OBJECT ---
                            const oLeft = obj.x * TILE_SIZE;
                            const oRight = (obj.x + (obj.w || 1)) * TILE_SIZE;
                            const oTop = obj.y * TILE_SIZE;
                            const oBottom = (obj.y + (obj.h || 1)) * TILE_SIZE;

                            // --- UPDATE: LOGIKA DETEKSI OBJEK "SENTUH" (BERSENTUHAN) ---
                            // ... existing object detection logic ...
                            const isTouching = (pLeft < oRight && pRight > oLeft &&
                                pTop < oBottom && pBottom > oTop);

                            if (isTouching) {
                                showActionButton = true;
                                // Icon khusus berdasarkan tipe objek
                                if (obj.type === 'mailbox') actionIcon = '📬';
                                else if (obj.type === 'fishing_spot') actionIcon = '🎣';
                                else if (obj.type === 'sign') actionIcon = '🪧';
                                else if (obj.type === 'bookshelf') actionIcon = '📖';
                                else if (obj.type === 'bed') actionIcon = '🛏️';
                                else if (obj.type === 'kitchen') actionIcon = '🍳';
                                else if (obj.type === 'chores') actionIcon = '🧹';
                                else actionIcon = '🖐️';
                                break;
                            }
                        }
                    }

                    // --- NEW: CEK TILE LAHAN PERTANIAN (JIKA TIDAK ADA OBJEK/NPC) ---
                    if (!showActionButton && STATE.location === 'village') {
                        const pTx = Math.floor((STATE.player.x + 10) / TILE_SIZE);
                        const pTy = Math.floor((STATE.player.y + 15) / TILE_SIZE);
                        const tIdx = pTy * ISLAND_W + pTx;

                        // Tile ID 5 adalah Tanah Lahan
                        if (map.tiles[tIdx] === 5) {
                            showActionButton = true;

                            // CEK SYARAT: HARUS SUDAH DAPAT KURCACI TANI
                            if (STATE.player.hiredDwarf) {
                                // Jika sudah punya kurcaci, cek kondisi tanah spesifik
                                const farmKey = `${pTx}_${pTy}`;

                                // Pastikan object farming ada
                                if (!STATE.player.farming) STATE.player.farming = {};
                                const crop = STATE.player.farming[farmKey];

                                if (crop && crop.type) {
                                    // Ada tanaman
                                    if (crop.stage >= 3) {
                                        actionIcon = '🌾'; // Siap Panen
                                        btnAction.title = "Panen Tanaman";
                                    } else if (!crop.watered) {
                                        actionIcon = '💧'; // Perlu Disiram
                                        btnAction.title = "Siram Tanaman";
                                    } else {
                                        actionIcon = '👀'; // Sudah disiram/tumbuh
                                        btnAction.title = "Lihat Tanaman";
                                    }
                                } else if (crop && crop.tilled) {
                                    // Tanah sudah dicangkul, siap tanam
                                    actionIcon = '🌱';
                                    btnAction.title = "Tanam Bibit";
                                } else {
                                    // Tanah biasa, perlu dicangkul
                                    actionIcon = '⛏️';
                                    btnAction.title = "Cangkul Lahan";
                                }
                            } else {
                                // BELUM PUNYA KURCACI -> DISILANG
                                actionIcon = '🚫';
                                btnAction.title = "Lahan Belum Bisa Digunakan";
                            }
                        }
                    }
                }

                // UPDATE DOM BUTTON
                if (showActionButton) {
                    btnAction.style.display = 'flex';
                    // FIX fairyVillage: NPC tetap tampilkan nama, bangunan cukup ikon 🚪
                    if (STATE.location === 'fairyVillage' && btnAction.dataset.fvLabel) {
                        btnAction.innerText = btnAction.dataset.fvLabel;
                        btnAction.style.fontSize = '11px';
                        btnAction.style.padding = '6px 12px';
                    } else {
                        // Sama persis seperti peta utama — hanya ikon, font default bulat
                        btnAction.innerText = actionIcon;
                        btnAction.style.fontSize = '';
                        btnAction.style.padding = '';
                    }

                    // --- NEW: DYNAMIC ACTION TOOLTIP (PENJELASAN FUNGSI TOMBOL) ---
                    if (actionIcon === '⚔️') btnAction.title = "Serang Musuh (Attack)";
                    else if (actionIcon === '⛏️') btnAction.title = "Cangkul Lahan"; // NEW
                    else if (actionIcon === '🚫') btnAction.title = "Lahan Terkunci"; // NEW
                    else if (actionIcon === '🎣') btnAction.title = "Tarik Pancingan";
                    else if (actionIcon === '🚪') btnAction.title = "Masuk/Keluar";
                    else if (actionIcon === '📜') btnAction.title = "Baca Papan Info";
                    else if (actionIcon === '🏆') btnAction.title = "Lihat Peringkat";
                    else if (actionIcon === '💬') btnAction.title = "Sapa Warga";
                    else if (actionIcon === '💖') btnAction.title = "Interaksi Pasangan";
                    else if (actionIcon === '📬') btnAction.title = "Cek Kotak Surat";
                    else if (actionIcon === '🪧') btnAction.title = "Baca Tanda";
                    else if (actionIcon === '📖') btnAction.title = "Baca Buku/Arsip";
                    else if (actionIcon === '🛏️') btnAction.title = "Tidur/Istirahat";
                    else if (actionIcon === '📦') btnAction.title = "Ambil/Sortir Barang";
                    else if (actionIcon === '🪙') btnAction.title = "Manajemen Kasir";
                    else if (actionIcon === '☎️') btnAction.title = "Belanja Katalog";
                    else if (actionIcon === '👗') btnAction.title = "Ganti Pakaian";
                    else if (actionIcon === '📅') btnAction.title = "Cek Kalender";
                    else if (actionIcon === '📓') btnAction.title = "Save/Jurnal";
                    else if (actionIcon === '💊') btnAction.title = "Ambil Obat";
                    else if (actionIcon === '🗄️') btnAction.title = "Cek Arsip";
                    else if (actionIcon === '🏺') btnAction.title = "Lihat Koleksi";
                    else if (actionIcon === '🛡️') btnAction.title = "Lihat Equipment";
                    else if (actionIcon === '🍽️') btnAction.title = "Lihat Makanan";
                    else if (actionIcon === '🍳') btnAction.title = "Masak";
                    else if (actionIcon === '🥘') btnAction.title = "Masak Sup";
                    else if (actionIcon === '🕸️') btnAction.title = "Cek Jaring";
                    else if (actionIcon === '🧊') btnAction.title = "Cek Ikan";
                    else if (actionIcon === '🗿') btnAction.title = "Berdoa";
                    else if (actionIcon === '💐') btnAction.title = "Persembahan";
                    else if (actionIcon === '🕯️') btnAction.title = "Periksa Lilin";
                    else btnAction.title = "Interaksi";

                    // Animasi pop-in kecil jika baru muncul
                    if (btnAction.dataset.visible !== "true") {
                        btnAction.style.animation = "popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                        btnAction.dataset.visible = "true";
                    }
                } else {
                    btnAction.style.display = 'none';
                    btnAction.dataset.visible = "false";
                }

                let hours = Math.floor(STATE.time / 100);
                let minutes = Math.floor((STATE.time % 100) * 0.6);
                let timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                document.getElementById('clock-display').innerText = timeString;

                let timeLabel = "Malam";
                if (hours >= 4 && hours < 10) timeLabel = "Pagi";
                else if (hours >= 10 && hours < 15) timeLabel = "Siang";
                else if (hours >= 15 && hours < 18) timeLabel = "Sore";
                else if (hours >= 18 || hours < 4) timeLabel = "Malam";

                const weatherInd = {
                    'clear': 'Cerah', 'rain': 'Hujan', 'snow': 'Salju',
                    'sakura': 'Bunga Gugur', 'fall_leaves': 'Daun Gugur'
                };
                document.getElementById('weather-display').innerText = `${timeLabel}, ${weatherInd[STATE.weather] || 'Cerah'}`;

                // --- UPDATE: TAMPILKAN HARI DI UI ---
                document.getElementById('full-date-display').innerText = `${dayName}, D${dayInSeason} ${STATE.season.charAt(0).toUpperCase() + STATE.season.slice(1)} Y${year}`;

                if (STATE.location === 'village' && STATE.time < 1800) {

                    // UPDATE: Burung sekarang muncul di Spring, Summer, dan Autumn (Kecuali Winter)
                    if (STATE.season !== 'winter') {
                        if (Math.random() < 0.01) {
                            STATE.critters.push({
                                type: 'bird',
                                x: -50,
                                y: Math.random() * (ISLAND_H * TILE_SIZE) / 2,
                                vx: 2 + Math.random() * 2,
                                vy: (Math.random() - 0.5) * 0.5,
                                life: 1000,
                                flap: 0
                            });
                        }
                    }

                    // --- NEW: SPAWN SILUET IKAN DI LAUT ---
                    // Muncul di semua musim, siang hari
                    if (Math.random() < 0.05) { // 5% chance per frame
                        // Posisi acak di seluruh map
                        const fx = Math.random() * (ISLAND_W * TILE_SIZE);
                        const fy = Math.random() * (ISLAND_H * TILE_SIZE);

                        // Cek apakah posisi tersebut adalah AIR (Tile ID 0)
                        const tx = Math.floor(fx / TILE_SIZE);
                        const ty = Math.floor(fy / TILE_SIZE);
                        const tIdx = ty * ISLAND_W + tx;

                        // Akses array villageTiles global
                        if (villageTiles[tIdx] === 0) {
                            STATE.critters.push({
                                type: 'fish_silhouette',
                                x: fx,
                                y: fy,
                                vx: (Math.random() - 0.5) * 0.8, // Gerakan pelan & tenang
                                vy: (Math.random() - 0.5) * 0.8,
                                life: 600 + Math.random() * 300, // Hidup lama
                                size: 0.8 + Math.random() * 0.6  // Variasi ukuran
                            });
                        }
                    }

                    if (STATE.season === 'autumn') {
                        if (Math.random() < 0.02) {
                            const cx = STATE.camera.x + Math.random() * GAME_WIDTH;
                            const cy = STATE.camera.y + Math.random() * GAME_HEIGHT;
                            STATE.critters.push({
                                type: 'butterfly',
                                x: cx,
                                y: cy,
                                vx: 0,
                                vy: 0,
                                life: 400,
                                color: ['#fbbf24', '#f87171', '#60a5fa'][Math.floor(Math.random() * 3)]
                            });
                        }
                    }
                } else {
                    if (STATE.time >= 1800) STATE.critters = [];
                }

                STATE.critters.forEach((c, i) => {
                    c.life--;
                    if (c.life <= 0) {
                        STATE.critters.splice(i, 1);
                        return;
                    }

                    if (c.type === 'bird') {
                        c.x += c.vx;
                        c.y += c.vy;
                        c.flap += 0.2;
                        if (c.x > (ISLAND_W * TILE_SIZE) + 100) c.life = 0;
                    }
                    // --- NEW: UPDATE GERAKAN IKAN ---
                    else if (c.type === 'fish_silhouette') {
                        c.x += c.vx;
                        c.y += c.vy;

                        // Cek Tile Depan (Agar tidak nabrak daratan)
                        const nextTx = Math.floor((c.x + c.vx * 20) / TILE_SIZE);
                        const nextTy = Math.floor((c.y + c.vy * 20) / TILE_SIZE);
                        const tIdx = nextTy * ISLAND_W + nextTx;

                        // Jika menabrak daratan (bukan air), putar balik perlahan
                        if (villageTiles[tIdx] !== 0) {
                            c.vx *= -1;
                            c.vy *= -1;
                        }

                        // Ubah arah sedikit secara acak agar natural
                        if (Math.random() < 0.01) {
                            c.vx += (Math.random() - 0.5) * 0.2;
                            c.vy += (Math.random() - 0.5) * 0.2;
                        }
                    }
                    else if (c.type === 'butterfly') {
                        c.x += (Math.random() - 0.5) * 2;
                        c.y += (Math.random() - 0.5) * 2;
                    }
                });

                if (STATE.weather !== 'clear' && STATE.location === 'village') {
                    const maxParticles = (STATE.weather === 'rain' || STATE.weather === 'snow') ? 200 : 80;

                    if (STATE.weatherParticles.length < maxParticles) {
                        let pType = STATE.weather;
                        let pVx = 0, pVy = 0;

                        if (pType === 'rain') { pVx = -0.5; pVy = 8 + Math.random() * 2; }
                        else if (pType === 'snow') { pVx = -0.2 + Math.random() * 0.4; pVy = 1 + Math.random(); }
                        else if (pType === 'sakura' || pType === 'fall_leaves') {
                            pVx = Math.random() - 0.5;
                            pVy = 0.5 + Math.random();
                        }

                        STATE.weatherParticles.push({
                            x: Math.random() * canvas.width,
                            y: -10,
                            vx: pVx,
                            vy: pVy,
                            type: pType,
                            swayOffset: Math.random() * 10,
                            life: 300
                        });
                    }
                }

                if (STATE.location !== 'village') STATE.weatherParticles = [];

                STATE.weatherParticles.forEach((p, i) => {
                    if (p.type === 'sakura' || p.type === 'fall_leaves') {
                        p.x += Math.sin(p.y * 0.02 + p.swayOffset) * 0.5 + (Math.random() - 0.5) * 0.2;
                        p.y += p.vy;
                    } else {
                        p.x += p.vx;
                        p.y += p.vy;
                    }

                    if (p.y > canvas.height) {
                        p.y = -10;
                        p.x = Math.random() * canvas.width;
                    }
                });

                let dx = 0, dy = 0;

                // --- UPDATE: MOVEMENT LOGIC (KEYBOARD + TOUCH HYBRID) ---
                if (!STATE.fishing.active && !STATE.minigame) {

                    // 1. Cek Keyboard (WASD / Arrows)
                    if (keys['ArrowUp'] || keys['KeyW']) dy = -1;
                    if (keys['ArrowDown'] || keys['KeyS']) dy = 1;
                    if (keys['ArrowLeft'] || keys['KeyA']) dx = -1;
                    if (keys['ArrowRight'] || keys['KeyD']) dx = 1;

                    // 2. Cek Touchscreen (Jika Keyboard tidak ditekan, atau mau digabung)
                    if (dx === 0 && dy === 0 && inputState.active) {
                        dx = inputState.x;
                        dy = inputState.y;

                        // Threshold kecil agar karakter benar-benar berhenti (Deadzone)
                        if (Math.abs(dx) < 0.1) dx = 0;
                        if (Math.abs(dy) < 0.1) dy = 0;
                    }
                }

                // Normalisasi vektor hanya jika input dari keyboard (karena touch input sudah cos/sin)
                // Jika dx/dy adalah 1/-1 (keyboard), normalisasi. Jika desimal (touch), biarkan (agar kecepatan analog)
                if ((Math.abs(dx) === 1 || Math.abs(dy) === 1) && !inputState.active) {
                    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
                }

                // --- SISTEM KELELAHAN BERJALAN (Walking Fatigue) ---
                // Jika pemain bergerak
                if (dx !== 0 || dy !== 0) {
                    // Tambahkan counter langkah
                    const stepCost = 1;
                    STATE.player.stepsTaken = (STATE.player.stepsTaken || 0) + stepCost;

                    // Setiap 300 frame gerakan (sekitar 5 detik jalan terus menerus), kurangi 1 Energi
                    if (STATE.player.stepsTaken > 300) {
                        if (STATE.player.energy > 0) {
                            STATE.player.energy = Math.max(0, STATE.player.energy - 1);

                            // Visual Feedback kecil agar pemain sadar
                            spawnFloatingText(STATE.player.x, STATE.player.y - 20, "-1 ⚡", "#facc15", 10);

                            // Peringatan jika energi kritis karena jalan
                            if (STATE.player.energy === 20) {
                                showToast("⚠️ Capek banget... butuh makan/istirahat!");
                            }
                        }
                        STATE.player.stepsTaken = 0; // Reset counter
                    }
                }

                const currentSpeed = STATE.player.speed;
                const nextX = STATE.player.x + dx * currentSpeed;
                const nextY = STATE.player.y + dy * currentSpeed;

                // --- CHECK ALL COLLISIONS ---
                const wallX = checkWall(nextX, STATE.player.y);
                const wallY = checkWall(STATE.player.x, nextY);

                // --- UPDATE: Collision Logic diperbaiki di dalam fungsi checkNPCCollision ---
                const npcX = checkNPCCollision(nextX, STATE.player.y);
                const npcY = checkNPCCollision(STATE.player.x, nextY);

                const objX = checkObjectCollision(nextX, STATE.player.y);
                const objY = checkObjectCollision(STATE.player.x, nextY);

                const bldX = checkBuildingCollision(nextX, STATE.player.y);
                const bldY = checkBuildingCollision(STATE.player.x, nextY);

                // --- NEW: MONSTER WALL COLLISION CHECK ---
                const monX = checkEnemyWall(nextX, STATE.player.y);
                const monY = checkEnemyWall(STATE.player.x, nextY);

                if (!wallX && !npcX && !objX && !bldX && !monX) STATE.player.x = nextX;
                if (!wallY && !npcY && !objY && !bldY && !monY) STATE.player.y = nextY;

                // PERBAIKAN: Update Direction untuk 4 Arah (Atas/Bawah/Kiri/Kanan)
                // Sebelumnya hanya Kiri/Kanan, sehingga interaksi Atas/Bawah sering gagal
                if (dx !== 0 || dy !== 0) {
                    if (Math.abs(dx) >= Math.abs(dy)) {
                        STATE.player.direction = dx > 0 ? 'right' : 'left';
                    } else {
                        STATE.player.direction = dy > 0 ? 'down' : 'up';
                    }
                }

                const hitObj = objX || objY;
                if (hitObj && Date.now() - lastCollisionTime > 1500) {
                    lastCollisionTime = Date.now();
                    if (hitObj.type === 'sign') {
                        showToast("📍 " + hitObj.text);
                    } else if (hitObj.type === 'fishing_spot') {
                        showToast("🐟 Area Memancing (Tekan Tombol Aksi)");
                    } else if (hitObj.type === 'counter') {
                        showToast("Meja Kasir. Bicara pada Bos untuk kerja.");
                    }
                }

                STATE.camera.x = STATE.player.x - GAME_WIDTH / 2 + STATE.player.w / 2;
                STATE.camera.y = STATE.player.y - GAME_HEIGHT / 2 + STATE.player.h / 2;

                const curMap = maps[STATE.location];
                const _mapTileSize = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;
                STATE.camera.x = Math.max(0, Math.min(STATE.camera.x, curMap.w * _mapTileSize - GAME_WIDTH));
                STATE.camera.y = Math.max(0, Math.min(STATE.camera.y, curMap.h * _mapTileSize - GAME_HEIGHT));

                curMap.npcs.forEach(npc => {
                    // FIX: fairyVillage NPC dikelola sepenuhnya oleh fvNpcRuntime di drawFairyWorld, skip di sini
                    if (STATE.location === 'fairyVillage') return;

                    const distToPlayer = Math.hypot(STATE.player.x - npc.x * TILE_SIZE, STATE.player.y - npc.y * TILE_SIZE);

                    // --- NEW: EFEK NYANYIAN (BUBBLE NADA) UNTUK DUYUNG, SENIMAN & PENYANYI ---
                    // UPDATE: Ditambahkan 'penyanyi'
                    if ((npc.id === 'putriduyung' || npc.id === 'seniman' || npc.id === 'penyanyi') && isNPCActive(npc)) {
                        // Peluang spawn nada setiap frame (biar tidak terlalu spam)
                        if (Math.random() < 0.05) {
                            let pColor = '#38bdf8'; // Default Biru (Duyung)
                            if (npc.id === 'seniman') pColor = '#fbbf24'; // Emas (Gitar)
                            else if (npc.id === 'penyanyi') pColor = '#e879f9'; // Pink/Ungu (Penyanyi)

                            STATE.particles.push({
                                x: (npc.x * TILE_SIZE) + 15 + (Math.random() * 20 - 10), // Random offset X
                                y: (npc.y * TILE_SIZE) - 10,
                                vx: (Math.random() - 0.5) * 0.5, // Goyang kiri kanan pelan
                                vy: -0.5 - Math.random(), // Naik ke atas
                                life: 80, // Durasi hidup
                                color: pColor,
                                type: 'note', // Tipe khusus untuk render ikon
                                icon: ['🎵', '🎶', '✨', '🎤'][Math.floor(Math.random() * 4)],
                                size: 10 + Math.random() * 5
                            });
                        }
                    }

                    // --- FIX: KEMBALIKAN EFEK NGOBROL AISYAH & MARIA (BERGANTIAN) ---
                    // Logika: Mereka akan spawning bubble "..." bergantian setiap 3 detik
                    if ((npc.id === 'cewek_islam' || npc.id === 'cewek_kristen') && isNPCActive(npc)) {
                        const turnDuration = 3000; // 3 detik per giliran
                        const now = Date.now();
                        const isAisyahTurn = (Math.floor(now / turnDuration) % 2 === 0);

                        // Cek giliran siapa sekarang
                        const myTurn = (npc.id === 'cewek_islam' && isAisyahTurn) || (npc.id === 'cewek_kristen' && !isAisyahTurn);

                        // Spawn bubble jika giliran saya (Peluang 3% per frame agar tidak terlalu rapat)
                        if (myTurn && Math.random() < 0.03) {
                            STATE.particles.push({
                                x: (npc.x * TILE_SIZE) + 20, // Posisi tengah atas kepala
                                y: (npc.y * TILE_SIZE) - 10,
                                vx: 0,
                                vy: -0.2, // Naik pelan
                                life: 70, // Durasi tampil (sekitar 1.2 detik)
                                type: 'chat_bubble',
                                icon: '...'
                            });
                        }
                    }

                    if (npc.type === 'wander' || npc.type === 'animal' || npc.type === 'swimmer') {
                        if (distToPlayer < 60 && npc.type !== 'swimmer') { // Swimmer cuek, gak berhenti kalau didekati (kecuali diajak ngobrol)
                            if (npc.type === 'animal') {
                                if (npc.cooldown <= 0 && distToPlayer < 40) {
                                    npc.cooldown = 120;
                                    npc.loveTimer = 60;

                                    if (AudioService.enabled && AudioService.tracks[npc.sound]) {
                                        AudioService.tracks[npc.sound].currentTime = 0;
                                        AudioService.tracks[npc.sound].play().catch(() => { });
                                    }

                                    createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#ff69b4');
                                }
                            }

                        } else {
                            if (Math.random() < 0.02) {
                                npc.vx = (Math.random() - 0.5) * 2;
                                npc.vy = (Math.random() - 0.5) * 2;
                            }

                            // Khusus Swimmer gerakannya lebih konsisten (berenang)
                            if (npc.type === 'swimmer') {
                                // Random turn sesekali
                                if (Math.random() < 0.01) {
                                    npc.vx = (Math.random() - 0.5) * 1.5;
                                    npc.vy = (Math.random() - 0.5) * 1.5;
                                }

                                // NEW: EFEK CIPRATAN AIR SAAT BERGERAK
                                if (Math.abs(npc.vx) > 0.1 || Math.abs(npc.vy) > 0.1) {
                                    // 30% Chance spawn partikel per frame
                                    if (Math.random() < 0.3) {
                                        STATE.particles.push({
                                            x: (npc.x * TILE_SIZE) + 15 + (Math.random() * 14 - 7), // Sekitar badan
                                            y: (npc.y * TILE_SIZE) + 40, // Di permukaan air (kaki)
                                            vx: (Math.random() - 0.5) * 2, // Menyebar ke samping
                                            vy: -1.5 - Math.random(), // Melompat ke atas
                                            life: 25, // Durasi
                                            color: '#e0f2fe', // Putih kebiruan (buih air)
                                            type: 'splash',
                                            size: 2 + Math.random() * 3
                                        });
                                    }
                                }
                            }

                            let nx = (npc.x * TILE_SIZE) + (npc.vx || 0);
                            let ny = (npc.y * TILE_SIZE) + (npc.vy || 0);

                            // --- FIX: Logic Pengecekan Batas Map & Collision NPC ---

                            if (npc.type === 'swimmer') {
                                // LOGIKA PERENANG: Hanya boleh di Tile 0 (Air)
                                // Cek titik tengah kaki
                                const tX = Math.floor((nx + 15) / TILE_SIZE);
                                const tY = Math.floor((ny + 30) / TILE_SIZE);

                                let canSwim = false;

                                // Pastikan di dalam map
                                if (tX >= 0 && tX < curMap.w && tY >= 0 && tY < curMap.h) {
                                    const tIdx = tY * curMap.w + tX;
                                    const tile = curMap.tiles[tIdx];

                                    // Hanya boleh di air (0)
                                    if (tile === 0) canSwim = true;
                                }

                                if (canSwim) {
                                    npc.x = nx / TILE_SIZE;
                                    npc.y = ny / TILE_SIZE;
                                } else {
                                    // Nabrak darat/batas map, putar balik
                                    npc.vx *= -1;
                                    npc.vy *= -1;
                                }
                            } else {
                                // LOGIKA NPC DARAT (Wander & ANIMAL): JANGAN LEWAT LAUT
                                // FIX: Gunakan ukuran dinamis NPC (w/h) untuk akurasi hitbox
                                const pW = npc.w || 32;
                                const pH = npc.h || 48;
                                const centerX = nx + (pW / 2);
                                const bottomY = ny + pH - 5; // Cek tepat di kaki

                                const tX = Math.floor(centerX / TILE_SIZE);
                                const tY = Math.floor(bottomY / TILE_SIZE);
                                const tIdx = tY * curMap.w + tX;

                                let isWalkable = true;

                                // 1. Cek Batas Map (Penting agar tidak keluar dunia ke area hitam)
                                if (nx < 0 || ny < 0 || nx > (curMap.w * TILE_SIZE) - pW || ny > (curMap.h * TILE_SIZE) - pH) {
                                    isWalkable = false;
                                }
                                // 2. Cek Tile
                                else if (tIdx >= 0 && tIdx < curMap.tiles.length) {
                                    const tile = curMap.tiles[tIdx];

                                    // Cek Laut (Tile 0) -> BLOKIR HEWAN & MANUSIA DARAT
                                    if (tile === 0) {
                                        isWalkable = false;
                                        // FIX SAPI EROR: Izinkan Hewan Masuk Area Dermaga juga
                                        // Hapus syarat '&& npc.type !== 'animal'' agar sapi tidak stuck di perbatasan laut dermaga
                                        if (STATE.location === 'village') {
                                            if (tX >= 43 && tX < 50 && tY >= 34 && tY < 39) {
                                                isWalkable = true;
                                            }
                                        }
                                    }

                                    // Cek Tembok/Pohon (Tile 2, 11, 12)
                                    if (tile === 2 || tile === 11 || tile === 12) {
                                        isWalkable = false;
                                    }
                                } else {
                                    // Index di luar array tiles
                                    isWalkable = false;
                                }

                                if (isWalkable) {
                                    npc.x = nx / TILE_SIZE;
                                    npc.y = ny / TILE_SIZE;
                                } else {
                                    // Nabrak Laut/Tembok -> Putar Balik
                                    npc.vx *= -1;
                                    npc.vy *= -1;

                                    // FIX: SOLUSI ANTI-STUCK SMART (DORONG KE TENGAH)
                                    // Jika NPC menabrak batas laut/tembok, paksa jalan ke arah tengah desa
                                    // Ini mencegah mereka terjebak di pinggiran pantai/dermaga selamanya
                                    if (Math.random() < 0.6) { // Peluang 60% untuk lari ke tengah saat stuck
                                        const centerX = 30 * TILE_SIZE; // Tengah Peta X
                                        const centerY = 20 * TILE_SIZE; // Tengah Peta Y

                                        // Hitung arah ke tengah
                                        const dx = centerX - (npc.x * TILE_SIZE);
                                        const dy = centerY - (npc.y * TILE_SIZE);
                                        const mag = Math.hypot(dx, dy) || 1;

                                        // Beri kecepatan sedikit acak agar natural
                                        const speed = 1 + Math.random();

                                        npc.vx = (dx / mag) * speed;
                                        npc.vy = (dy / mag) * speed;
                                    } else {
                                        // Sisa 40%: Random arah biasa (biar gak semua NPC lari ke tengah barengan)
                                        npc.vx = (Math.random() - 0.5) * 2;
                                        npc.vy = (Math.random() - 0.5) * 2;
                                    }
                                }
                            }
                        }

                        if (npc.cooldown > 0) npc.cooldown--;
                        if (npc.loveTimer > 0) npc.loveTimer--;
                    }
                });

                // --- NEW: AUTO TELEPORT CHECK (Agar tidak perlu klik tombol) ---
                checkAutoTeleport();

                // --- NEW: CEK JAM OPERASIONAL BANGUNAN (KICK OUT SYSTEM) ---
                checkBuildingHours();

                const tx = Math.floor(STATE.player.x / TILE_SIZE);
                const ty = Math.floor(STATE.player.y / TILE_SIZE);
                const tIdx = ty * curMap.w + tx;

                const tile = curMap.tiles[tIdx];

                if (tile === 8 && STATE.location === 'merchant_interior') {
                }
                else if (tile === 8 && STATE.location === 'house') {
                }

                if (STATE.location === 'dungeon' || STATE.location === 'ruins_battle') {
                    // FIX: Jangan update musuh saat dialogue/tutorial sedang terbuka
                    const _dialogueOpen = (function() {
                        const dw = document.getElementById('dialogue-wrapper');
                        if (dw && dw.style.display !== 'none') return true;
                        if (STATE.cutsceneOverride) return true;
                        if (STATE.isPrologue) return true;
                        return false;
                    })();
                    if (!_dialogueOpen) {
                        updateEnemies();
                    }
                }

                if (STATE.fishing.active) {
                    STATE.fishing.barX += 2 * STATE.fishing.barDir;
                    // FIX: Clamping nilai agar tidak stuck (bergetar) di ujung bar
                    if (STATE.fishing.barX >= 100) {
                        STATE.fishing.barX = 100;
                        STATE.fishing.barDir = -1;
                    } else if (STATE.fishing.barX <= 0) {
                        STATE.fishing.barX = 0;
                        STATE.fishing.barDir = 1;
                    }
                    // 🎣 SYNC ke fishing overlay DOM
                    updateFishingOverlayBar();
                }

                if (STATE.player.attackCooldown > 0) STATE.player.attackCooldown--;
                // Removed STATE.player.skillCooldown decrement logic

                // NEW: UPDATE COMBO TIMER
                if (STATE.player.comboWindow > 0) {
                    STATE.player.comboWindow--;
                    if (STATE.player.comboWindow <= 0) {
                        STATE.player.comboCount = 0; // Reset combo jika telat tekan tombol
                    }
                }

                // NEW: UPDATE FLOATING TEXTS
                STATE.floatingTexts.forEach((ft, i) => {
                    ft.y -= 0.5; // Naik ke atas
                    ft.life--;
                    if (ft.life <= 0) STATE.floatingTexts.splice(i, 1);
                });

                // UPDATE HUD VIA FUNCTION NOW
                updateHUDInfo();

                STATE.particles.forEach((p, i) => {
                    p.x += p.vx; p.y += p.vy; p.life--;
                    if (p.life <= 0) STATE.particles.splice(i, 1);
                });

                if (STATE.weather === 'rain' && STATE.location === 'village') {
                    if (Math.random() < 0.005) {
                        STATE.lightningTimer = 15;
                        STATE.shakeTimer = 20;
                        STATE.lightningX = Math.random() * GAME_WIDTH;
                    }
                }

                if (STATE.lightningTimer > 0) STATE.lightningTimer--;
                if (STATE.shakeTimer > 0) STATE.shakeTimer--;

                // NEW: Kurangi cooldown teleport setiap frame
                if (STATE.teleportCooldown > 0) STATE.teleportCooldown--;

                // --- PART-TIME REMINDER: JAM 15:00 ---
                if (STATE.player.partTimeStatus === 'working' && !STATE.player.partTimeShiftStarted) {
                    const ptDayIndex = (STATE.day - 1) % 7;
                    const ptAlreadyWorked = STATE.player.partTimeLastWorkedDay === STATE.day;
                    if (!ptAlreadyWorked && ptDayIndex !== 6) {
                        if (STATE.time >= 1500 && STATE.time < 1502) {
                            const ptJobName = PART_TIME_JOBS[STATE.player.partTimeJob] ? PART_TIME_JOBS[STATE.player.partTimeJob].name : 'Part-Time';
                            showToast(`⏰ Jam 15:00! Waktunya berangkat part-time ke ${ptJobName}. Absen sebelum jam 17:00!`);
                        }
                        if (STATE.time >= 1700 && STATE.time < 1702) {
                            showToast(`⚠️ Jam 17:00 lewat! Kamu terlambat absen part-time hari ini. Gaji tidak masuk.`);
                        }
                    }
                }

                // --- NEW: LOGIKA JADWAL KERJA PASANGAN (ROLE FAMILY) ---
                // Hanya berlaku jika sudah menikah dan role pemain adalah 'family' (Bapak/Ibu RT)
                if (STATE.player.married && STATE.player.role === 'family') {

                    const playerIsWorker = STATE.player.homeRole === 'worker';
                    const p = STATE.player;

                    // 1. PASANGAN / PEMAIN BERANGKAT KERJA JAM 08:00
                    if (STATE.time >= 800 && STATE.time < 810 && p.spouseWorkStatus !== 'working') {
                        p.spouseWorkStatus = 'working';

                        let sImg = 'images/girl.png';
                        const sId = p.spouseId;
                        if (sId === 'lover1girl') sImg = 'images/lover1girl.png';
                        else if (sId === 'lover2girl') sImg = 'images/lover2girl.png';
                        else if (sId === 'lover1boy') sImg = 'images/lover1boy.png';
                        else if (sId === 'lover2boy') sImg = 'images/lover2boy.png';

                        if (playerIsWorker) {
                            // PEMAIN yang bekerja — pasangan tetap di rumah
                            if (STATE.location === 'house') {
                                const sName = SPOUSE_NAMES[sId] || 'Pasangan';
                                showPedagogicalDepartureNotif(sImg, sName);
                            } else {
                                // Player di luar rumah — tampilkan notif pamit yang personal
                                const sNameOut = SPOUSE_NAMES[sId] || 'Pasangan';
                                const conflictLvl = STATE.player.marriageConflictLevel || 0;
                                const pamitMsg = conflictLvl >= 2
                                    ? `"Aku berangkat kerja." — ${sNameOut} mengirim pesan singkat.`
                                    : `💌 ${sNameOut}: "Sayang, aku berangkat kerja dulu ya. Hati-hati di luar! Pulang sebelum jam 16:00 ya ❤️"`;
                                showToast(pamitMsg);
                                // Tampilkan popup kecil di layar dengan gambar pasangan
                                (function showPamitPopup() {
                                    const existing = document.getElementById('pamit-popup-notif');
                                    if (existing) existing.remove();
                                    const div = document.createElement('div');
                                    div.id = 'pamit-popup-notif';
                                    div.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9990;background:rgba(255,253,245,0.97);border:2px solid #a16207;border-radius:14px;padding:10px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 18px rgba(0,0,0,0.25);max-width:320px;width:90%;animation:slideUp 0.3s ease;';
                                    const img = document.createElement('img');
                                    img.src = sImg;
                                    img.style.cssText = 'width:44px;height:44px;object-fit:cover;border-radius:50%;border:2px solid #a16207;flex-shrink:0;';
                                    const txtDiv = document.createElement('div');
                                    txtDiv.style.cssText = 'flex:1;';
                                    const name = document.createElement('div');
                                    name.style.cssText = 'font-family:Fredoka,sans-serif;font-size:13px;font-weight:700;color:#422006;';
                                    name.textContent = sNameOut + ' — Pamit Bekerja';
                                    const msg = document.createElement('div');
                                    msg.style.cssText = 'font-size:11px;color:#78350f;margin-top:2px;line-height:1.4;';
                                    msg.textContent = conflictLvl >= 2 ? '"Aku berangkat." (singkat, tanpa senyum)' : '"Hati-hati ya, sayang! Pulang sebelum jam 16:00 ❤️"';
                                    const closeBtn = document.createElement('button');
                                    closeBtn.textContent = '✕';
                                    closeBtn.style.cssText = 'background:none;border:none;font-size:14px;color:#a16207;cursor:pointer;padding:2px 4px;align-self:flex-start;';
                                    closeBtn.onclick = function() { div.remove(); };
                                    txtDiv.appendChild(name);
                                    txtDiv.appendChild(msg);
                                    div.appendChild(img);
                                    div.appendChild(txtDiv);
                                    div.appendChild(closeBtn);
                                    document.body.appendChild(div);
                                    // Auto-hilang setelah 6 detik
                                    setTimeout(function() { if (div.parentNode) div.remove(); }, 6000);
                                })();
                            }
                        } else {
                            // PASANGAN yang bekerja — hapus dari peta rumah
                            const houseMap = maps['house'];
                            if (houseMap) houseMap.npcs = houseMap.npcs.filter(n => n.id !== p.spouseId);

                            if (STATE.location === 'house') {
                                const sNameDep = SPOUSE_NAMES[sId] || 'Pasangan';
                                const conflictLevel = p.marriageConflictLevel || 0;
                                let depMsg = conflictLevel >= 2
                                    ? '"Aku berangkat." (Singkat, tanpa senyum seperti biasanya)\n\n😔 Ada jarak yang mulai terasa di antara kalian.'
                                    : '"Sayang, aku berangkat kerja dulu ya. Jaga rumah baik-baik. 💼"\n\n"Aku pulang sekitar jam 16:00!"';

                                showDialogue(sNameDep,
                                    depMsg + '\n\n━━━━━━━━━━━━━━━━━━━━\n' +
                                    '📌 KAMU BISA CARI PENGHASILAN TAMBAHAN:\n' +
                                    '🎣 Mancing → Jual ikan ke Merchant\n' +
                                    '⚔️ Dungeon → Jual item drop (hati-hati!)\n' +
                                    '🌙 Part-Time → Bengkel/Jahit/Klinik (15:00–19:00)\n\n' +
                                    '💡 Manfaatkan waktu dengan baik! Kalau kerja part-time, boleh pulang sampai jam 20:00.',
                                    [{
                                        text: 'Hati-hati di jalan!',
                                        action: () => {
                                            closeDialogue();
                                            setTimeout(showDailyHousekeepingMenu, 800);
                                        }
                                    }],
                                    sImg
                                );
                            } else {
                                // Player di luar rumah — pasangan berangkat kerja tanpa bisa diajak bicara
                                const sNameDep2 = SPOUSE_NAMES[sId] || 'Pasangan';
                                const conflictLvl2 = p.marriageConflictLevel || 0;
                                const pamitMsg2 = conflictLvl2 >= 2
                                    ? `😔 ${sNameDep2} sudah berangkat kerja. Kamu tidak sempat melepasnya.`
                                    : `💌 ${sNameDep2}: "Aku berangkat ya sayang, kamu sudah di luar ya? Hati-hati! Aku pulang sekitar jam 16:00 ❤️"`;
                                showToast(pamitMsg2);
                                (function showPamitPopup2() {
                                    const existing2 = document.getElementById('pamit-popup-notif');
                                    if (existing2) existing2.remove();
                                    const div2 = document.createElement('div');
                                    div2.id = 'pamit-popup-notif';
                                    div2.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9990;background:rgba(255,253,245,0.97);border:2px solid #a16207;border-radius:14px;padding:10px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 18px rgba(0,0,0,0.25);max-width:320px;width:90%;';
                                    const img2 = document.createElement('img');
                                    img2.src = sImg;
                                    img2.style.cssText = 'width:44px;height:44px;object-fit:cover;border-radius:50%;border:2px solid #a16207;flex-shrink:0;';
                                    const txtDiv2 = document.createElement('div');
                                    txtDiv2.style.cssText = 'flex:1;';
                                    const name2 = document.createElement('div');
                                    name2.style.cssText = 'font-family:Fredoka,sans-serif;font-size:13px;font-weight:700;color:#422006;';
                                    name2.textContent = sNameDep2 + ' — Berangkat Kerja';
                                    const msg2 = document.createElement('div');
                                    msg2.style.cssText = 'font-size:11px;color:#78350f;margin-top:2px;line-height:1.4;';
                                    msg2.textContent = conflictLvl2 >= 2 ? '(Berangkat tanpa pamit padamu...)' : '"Aku pulang sekitar jam 16:00 ya ❤️"';
                                    const closeBtn2 = document.createElement('button');
                                    closeBtn2.textContent = '✕';
                                    closeBtn2.style.cssText = 'background:none;border:none;font-size:14px;color:#a16207;cursor:pointer;padding:2px 4px;align-self:flex-start;';
                                    closeBtn2.onclick = function() { div2.remove(); };
                                    txtDiv2.appendChild(name2);
                                    txtDiv2.appendChild(msg2);
                                    div2.appendChild(img2);
                                    div2.appendChild(txtDiv2);
                                    div2.appendChild(closeBtn2);
                                    document.body.appendChild(div2);
                                    setTimeout(function() { if (div2.parentNode) div2.remove(); }, 6000);
                                })();
                            }
                        }
                    }

                    // 2. PASANGAN PULANG JAM 16:00 (skenario: pasangan yang kerja)
                    if (!playerIsWorker && STATE.time >= 1600 && STATE.time < 1610 && p.spouseWorkStatus === 'working') {
                        p.spouseWorkStatus = 'home';

                        let sImg = 'images/girl.png';
                        const sId = p.spouseId;
                        const sName = SPOUSE_NAMES[sId] || 'Pasangan';
                        if (sId === 'lover1girl') sImg = 'images/lover1girl.png';
                        else if (sId === 'lover2girl') sImg = 'images/lover2girl.png';
                        else if (sId === 'lover1boy') sImg = 'images/lover1boy.png';
                        else if (sId === 'lover2boy') sImg = 'images/lover2boy.png';

                        regenerateHouseMap();

                        if (STATE.location === 'house') {
                            p.spouseAngry = false;
                            createParticle(p.x, p.y, '#ec4899');
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                            let choresBonusMsg = '';
                            let choresBonusRep = 0;
                            if (p.dailyChores) {
                                if (p.dailyChores.cooking)  { choresBonusMsg += '\nWah, wangi masakan enak! Kamu masak ya? Makasih sayang! 🍲'; choresBonusRep += 2; }
                                if (p.dailyChores.cleaning) { choresBonusMsg += '\nRumah juga bersih banget. Kamu rajin sekali! ✨'; choresBonusRep += 2; }
                                if (p.dailyChores.laundry)  { choresBonusMsg += '\nBaju-bajuku sudah dicuci! Terima kasih ya sayang~ 👔'; choresBonusRep += 1; }
                                if (p.dailyChores.garden)   { choresBonusMsg += '\nTanaman di kebun juga sudah disiram, bagus banget! 🌱'; choresBonusRep += 1; }
                                p.dailyChores = {};
                            }

                            showDialogue(sName,
                                'Aku pulang! 🏠\nSenang sekali melihatmu sudah di rumah menyambutku.' + choresBonusMsg + '\n\n(Hubungan Makin Harmonis ❤️)',
                                [{ text: 'Selamat datang kembali!', action: closeDialogue }],
                                sImg
                            );
                            p.reputation += (2 + choresBonusRep);
                            updateRelationship({ id: sId }, 2 + choresBonusRep, 'Disiplin & Rajin');

                        } else {
                            // Pemain tidak di rumah saat pasangan pulang → marah
                            p.spouseAngry = true;
                            showToast('⚠️ GAWAT! Pasangan pulang jam 16:00 tapi kamu tidak di rumah!');
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                            p.reputation = Math.max(0, p.reputation - 5);
                            updateRelationship({ id: sId }, -5, 'Tidak Ada di Rumah');
                        }
                    }

                    // 3. PEMAIN PULANG KERJA (skenario: pemain yang kerja di luar)
                    //    Batas normal: jam 16:00. Toleransi part-time: jam 20:00.
                    if (playerIsWorker && p.spouseWorkStatus === 'working') {
                        const hasPartTime = p.partTimeStatus === 'working';

                        // Jam 16:00 — mulai ingatkan jika belum di rumah
                        if (STATE.time >= 1600 && STATE.time < 1610 && STATE.location !== 'house') {
                            if (!hasPartTime) {
                                showToast('⏰ Sudah jam 16:00! Pasanganmu menunggu di rumah. Segera pulang!');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                            } else {
                                showToast('⏰ Jam 16:00 — kamu kerja part-time, boleh pulang sampai jam 20:00 ya!');
                            }
                        }

                        // Batas NORMAL jam 16:00 (tanpa part-time)
                        if (!hasPartTime && STATE.time >= 1600 && STATE.time < 1610) {
                            p.spouseWorkStatus = 'home';
                            const sId2 = p.spouseId;
                            let sImg2 = 'images/girl.png';
                            if (sId2 === 'lover1girl') sImg2 = 'images/lover1girl.png';
                            else if (sId2 === 'lover2girl') sImg2 = 'images/lover2girl.png';
                            else if (sId2 === 'lover1boy') sImg2 = 'images/lover1boy.png';
                            else if (sId2 === 'lover2boy') sImg2 = 'images/lover2boy.png';

                            if (STATE.location === 'house') {
                                p.spouseAngry = false;
                                createParticle(p.x, p.y, '#ec4899');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                const spouseName2 = SPOUSE_NAMES[sId2] || 'Pasangan';
                                showDialogue(spouseName2,
                                    'Akhirnya pulang juga! ❤️\nAku sudah tunggu dari tadi sambil masak kesukaanmu.\n\nSyukurlah kamu tepat waktu. Ayo makan malam bareng! 🍽️\n\n(Hubungan Makin Harmonis ❤️)',
                                    [{ text: 'Makasih sayang, masakan kamu pasti enak!', action: closeDialogue }],
                                    sImg2
                                );
                                p.reputation += 3;
                                updateRelationship({ id: sId2 }, 3, 'Pulang Tepat Waktu');
                            } else {
                                // Belum pulang jam 16:00, tanpa part-time
                                p.spouseAngry = true;
                                showToast('⚠️ Sudah jam 16:00! Pasanganmu menunggu di rumah dan mulai khawatir!');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                                p.reputation = Math.max(0, p.reputation - 3);
                                updateRelationship({ id: sId2 }, -3, 'Terlambat Pulang');
                            }
                        }

                        // Batas TOLERANSI part-time: jam 20:00
                        if (hasPartTime && STATE.time >= 2000 && STATE.time < 2010) {
                            p.spouseWorkStatus = 'home';
                            const sId3 = p.spouseId;
                            let sImg3 = 'images/girl.png';
                            if (sId3 === 'lover1girl') sImg3 = 'images/lover1girl.png';
                            else if (sId3 === 'lover2girl') sImg3 = 'images/lover2girl.png';
                            else if (sId3 === 'lover1boy') sImg3 = 'images/lover1boy.png';
                            else if (sId3 === 'lover2boy') sImg3 = 'images/lover2boy.png';
                            const spouseName3 = SPOUSE_NAMES[sId3] || 'Pasangan';

                            if (STATE.location === 'house') {
                                p.spouseAngry = false;
                                createParticle(p.x, p.y, '#ec4899');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                showDialogue(spouseName3,
                                    'Kamu baru pulang ya... sudah malam! 😅\nTapi aku mengerti, kamu kerja part-time tadi kan?\n\nMakasih sudah kerja keras! Ini ada makan malam untukmu. 🍽️\n\n(Hubungan Tetap Harmonis ❤️)',
                                    [{ text: 'Makasih sudah nunggu sayang!', action: closeDialogue }],
                                    sImg3
                                );
                                p.reputation += 2;
                                updateRelationship({ id: sId3 }, 2, 'Pulang dari Part-Time');
                            } else {
                                // Masih belum pulang jam 20:00 meskipun part-time
                                p.spouseAngry = true;
                                showToast('😡 Sudah jam 20:00! Pasanganmu SANGAT marah — bahkan toleransi part-time sudah habis!');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                                p.reputation = Math.max(0, p.reputation - 8);
                                updateRelationship({ id: sId3 }, -10, 'Pulang Sangat Terlambat');
                                p.marriageConflictLevel = Math.min(3, (p.marriageConflictLevel || 0) + 1);
                            }
                        }
                    }
                }

                // --- NEW: UPDATE PERGERAKAN BOT HANTU (AGAR TERLIHAT HIDUP) ---
                if (STATE.ghosts) {
                    STATE.ghosts.forEach(g => {
                        // Hanya gerakkan jika dia adalah Bot dan berada di map yang sama
                        if (g.isBot && g.location === STATE.location) {
                            // Randomly change direction (Wander Behavior)
                            if (Math.random() < 0.02) { // 2% chance per frame
                                g.vx = (Math.random() - 0.5) * 2; // Kecepatan random
                                g.vy = (Math.random() - 0.5) * 2;
                            }

                            // Update Posisi
                            g.x = (g.x || 0) + (g.vx || 0);
                            g.y = (g.y || 0) + (g.vy || 0);

                            // Batas Map Sederhana (Agar tidak lari ke laut/luar layar)
                            // Asumsi batas aman desa (Area tengah)
                            const minX = 5 * TILE_SIZE;
                            const maxX = 55 * TILE_SIZE;
                            const minY = 5 * TILE_SIZE;
                            const maxY = 35 * TILE_SIZE;

                            if (g.x < minX || g.x > maxX) g.vx *= -1; // Pantul tembok
                            if (g.y < minY || g.y > maxY) g.vy *= -1;
                        }
                    });
                }
            }

            // --- NEW FUNCTION: MENU HARIAN IRT (HOUSEKEEPING) ---
