// =================================================================
// 🎮 startGame, resize, Map Setup, initGame
// =================================================================

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

