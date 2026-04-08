            // --- BAGIAN PENTING 2: PAKSA LANDSCAPE SAAT KLIK ---
            function startGame() {
                const elem = document.documentElement;

                // 1. Minta Fullscreen dulu (Browser butuh ini biar bisa lock orientasi)
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().then(forceLandscape).catch(err => {
                        console.log("Fullscreen ditolak, tetap lanjut main.");
                        forceLandscape(); // Tetap coba putar walau gagal fullscreen
                    });
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                    setTimeout(forceLandscape, 500);
                } else {
                    // Jika tidak support fullscreen, langsung coba putar
                    forceLandscape();
                }

                // Sembunyikan judul, tampilkan game
                document.getElementById('title-screen').style.display = 'none';
                document.getElementById('ui-layer').style.display = 'block';

                // Tampilkan canvas kembali (mungkin tersembunyi setelah logout)
                const gcCanvas = document.getElementById('gameCanvas');
                if (gcCanvas) gcCanvas.style.display = 'block';

                // Resize canvas biar pas layar
                resize();
                gameLoop();
            }

            // Fungsi Pengunci Layar (Hanya jalan di HP Android/Chrome Mobile)
            function forceLandscape() {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape')
                        .then(() => console.log("Sukses: Layar terkunci Landscape"))
                        .catch((err) => console.log("Info: Browser ini tidak mendukung kunci layar otomatis (Biasanya iPhone/Safari). Pemain harus putar HP manual."));
                }
            }

            /* UPDATE: UBAH KONSTANTA JADI VARIABEL DINAMIS AGAR RESPONSIF */
            let GAME_WIDTH = 480;
            let GAME_HEIGHT = 270;

            const TILE_SIZE = 30;
            const DEBUG_MAP_BOUNDARIES = false;

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

