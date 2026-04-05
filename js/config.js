// ═══════════════════════════════════════════
// CONFIG.JS — Nusantara Arsa: Rise of Student
// Baris 8664–9441 dari index asli
// ═══════════════════════════════════════════

            const firebaseConfig = {
                apiKey: "AIzaSyAdqApOvuUXrZUO19NfiqZCLSyUYR74w5M",
                authDomain: "waliq-ded98.firebaseapp.com",
                projectId: "waliq-ded98",
                storageBucket: "waliq-ded98.firebasestorage.app",
                messagingSenderId: "915222555864",
                appId: "1:915222555864:web:25320841c97661172e3bad",
                measurementId: "G-K51RW0YQ0M"
            };

            let db;
            let analytics;

            /** * APP FLOW LOGIC */
            const SESSION_KEY = 'sc_session_email';

            // --- GLOBAL LOOP CONTROLLERS (FIX: Mencegah Loop Ganda via Window Object) ---
            // UPDATE: Menggunakan window.variable agar persist saat script reload
            if (window.gameLoopId === undefined) window.gameLoopId = null;
            if (window.saveIntervalId === undefined) window.saveIntervalId = null;

            // --- ASSET LOADER (UPDATED FOR NEW BG & TREES) ---
            // REMOVED: tileset.png loader (deprecated)

            const treeAssets = {
                // shadow: new Image(), // SHADOW DIHAPUS (Tidak diload)
                trunk: new Image(),
                canopy: new Image(),
                sakuraTrunk: new Image(),
                sakuraCanopy: new Image()
            };

            // Fallback Base64 (Jika file gambar tidak ditemukan)
            const treeFallbacks = {
                trunk: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMTIiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjNWQ0MDM3Ii8+PC9zdmc+',
                canopy: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjgiIGZpbGw9IiMxNmEzNGEiIHN0cm9rZT0iIzE0NTMyZCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
                sakuraTrunk: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMTIiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjNWQ0MDM3Ii8+PC9zdmc+',
                sakuraCanopy: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjgiIGZpbGw9IiZmNDcyYjYiIHN0cm9rZT0iI2RiMjc3NyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'
            };

            // NEW: ASSET TAS (Load gambar tas)
            const bagAssets = {
                empty: new Image(),
                full: new Image()
            };
            // Set src
            bagAssets.empty.src = 'images/tas-kosong.png';
            bagAssets.full.src = 'images/tas-isi.png';
            // Fallback visual tas jika gambar tidak ada
            const bagFallback = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHBhdGggZD0iTTIwIDIwIEw0NCAyMCBMNTQgNTAgTDEwIDUwIFoiIGZpbGw9IiM3ODM1MGYiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTI2IDIwIEwyNiAxMCBZMzggMTAgTDM4IDIwIiBzdHJva2U9IiNmZmYiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==';

            bagAssets.empty.onerror = function () { this.src = bagFallback; };
            bagAssets.full.onerror = function () { this.src = bagFallback; }; // Bisa dibedakan warnanya nanti jika mau

            // Load Images (Trunk & Canopy Only)
            ['trunk', 'canopy', 'sakuraTrunk', 'sakuraCanopy'].forEach(key => {
                treeAssets[key].onerror = function () {
                    this.onerror = null; // Anti-loop fix
                    console.warn(`Gagal memuat aset pohon ${key}, menggunakan fallback.`);
                    this.src = treeFallbacks[key];
                };

                // Set src asli
                if (key === 'trunk') treeAssets[key].src = 'images/pohon-trunk.png';
                if (key === 'canopy') treeAssets[key].src = 'images/pohon-kanopi.png';
                if (key === 'sakuraTrunk') treeAssets[key].src = 'images/batang-sakura.png';
                if (key === 'sakuraCanopy') treeAssets[key].src = 'images/pohon-sakura.png';
            });

            // --- NEW: GRASS & PLANT ASSETS ---
            const grassAssets = {
                grass1: new Image(),
                grass2: new Image(),
                flower: new Image()
            };

            // Fallback untuk rumput/bunga (Hijau dan Merah Muda)
            const grassFallbacks = {
                grass1: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMWU0MDVmIi8+PHBhdGggZD0iTTEwIDIwIEwxNSAxMCBMMjAgMjAiIGZpbGw9IiMxNTgwM2QiLz48L3N2Zz4=',
                grass2: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMWU0MDVmIi8+PHBhdGggZD0iTTUgMjUgTDEwIDE1IEwxNSAyNSBNMjAgMjUgTDI1IDE1IEwzMCAyNSIgZmlsbD0iIzE1ODAzZCIvPjwvc3ZnPg==',
                flower: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGNpcmNsZSBjeD0iMTYiIGN5PSIzMCIgcj0iMiIgZmlsbD0iIzE1ODAzZCIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMjQiIHI9IjQiIGZpbGw9IiNmNDcyYjYiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjI0IiByPSIyIiBmaWxsPSIjZmZjMTA3Ii8+PC9zdmc+'
            };

            ['grass1', 'grass2', 'flower'].forEach(key => {
                // ANTI-LOOP FIX
                grassAssets[key].onerror = function () {
                    this.onerror = null; // CRITICAL FIX: Hentikan loop error
                    this.src = grassFallbacks[key];
                };
                if (key === 'grass1') grassAssets[key].src = 'images/rumput.png';
                if (key === 'grass2') grassAssets[key].src = 'images/rumput2.png';
                if (key === 'flower') grassAssets[key].src = 'images/bunga.png';
            });

            // --- NEW: MISC ASSETS (SALJU) ---
            const miscAssets = {
                snowman: new Image()
            };
            miscAssets.snowman.src = 'images/snowman.png';

            // Fallback SVG (Gambar Boneka Salju Sederhana)
            miscAssets.snowman.onerror = function () {
                this.onerror = null;
                // Gambar SVG: Dua bola putih + Hidung Oren + Mata Hitam
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI2NCI+PGNpcmNsZSBjeD0iMTYiIGN5PSI0OCIgcj0iMTQiIGZpbGw9IiNmMmYyZjIiIHN0cm9rZT0iI2RiZTYWZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSIyNCIgcj0iMTAiIGZpbGw9IiNmZmYiIHN0cm9rZT0iI2RiZTYWZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTMiIGN5PSIyMiIgcj0iMSIgZmlsbD0iIzAwMCIvPjxjaXJjbGUgY3g9IjE5IiBjeT0iMjIiIHI9IjEiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNMTY 2NCBMMyA3NiBMNiA2NCIgZmlsbD0iI2Y5NzMwNiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMzYiIHI9IjIiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjQ0IiByPSIyIiBmaWxsPSIjMzMzIi8+PC9zdmc+';
            };

            // --- NEW: FARM ASSETS (LAHAN PERTANIAN) ---
            const farmAssets = {
                lahanLiar: new Image()
            };
            farmAssets.lahanLiar.src = 'images/lahan-liar.png';
            // Fallback visual tanah kotor (SVG Pattern) jika gambar gagal load
            farmAssets.lahanLiar.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjOGI0NTEzIi8+PHBhdGggZD0iTTUgNSBMMjUgMjUgTTEwIDI1IEwyMCA1IiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+';
            };

            // --- NEW: CANDI ASSETS (LANTAI KHUSUS) ---
            const candiAssets = {
                floor: new Image(),
                redFloor: new Image() // NEW: Lantai Merah Candi
            };
            candiAssets.floor.src = 'images/lantaicandi.png';
            candiAssets.redFloor.src = 'images/lantaimerahcandi.png';

            // Fallback visual jika gambar gagal load (Warna Batu Tua)
            candiAssets.floor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNDQ0MDNjIi8+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSJub25lIiBzdHJva2U9IiM1NzUzNGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
            };
            // NEW: Fallback visual lantai merah
            candiAssets.redFloor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjOTkxYjFiIi8+PHBhdGggZD0iTTAgMCBMMzIgMzIgTTE2IDAgTDMyIDE2IE0wIDEwIEwyMiAzMiIgc3Ryb2tlPSIjN2YxZDFkIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==';
            };

            // --- NEW: RUINS ASSETS (LANTAI & TEMBOK RERUNTUHAN) ---
            const ruinsAssets = {
                floor: new Image(),
                wall: new Image() // NEW: Aset Tembok
            };
            ruinsAssets.floor.src = 'images/lantai-reruntuhan.png';
            ruinsAssets.wall.src = 'images/tembok-reruntuhan.png'; // NEW: Set Source Tembok

            // Fallback visual batu pecah/kuno jika gambar gagal load
            ruinsAssets.floor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjN2M3YzdmIi8+PHBhdGggZD0iTTAgMCBMMzIgMzIgTTE2IDAgTDMyIDE2IE0wIDEwIEwyMiAzMiIgc3Ryb2tlPSIjNTA1MDU1IiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==';
            };
            // NEW: Fallback visual tembok reruntuhan
            ruinsAssets.wall.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNDQ0MDNjIi8+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjN2M3YzdmIi8+PHJlY3QgeD0iMTgiIHk9IjE4IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiM3YzdjN2YiLz48cGF0aCBkPSJNMCAzMiBMMzIgMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==';
            };

            // NEW: LOAD SEASONAL BACKGROUNDS
            const bgSeasons = {
                spring: new Image(),
                summer: new Image(),
                autumn: new Image(),
                winter: new Image()
            };

            // Set Sources
            bgSeasons.spring.src = 'images/bg-pulau.png';
            bgSeasons.summer.src = 'images/bg-pulau-panas.png';
            bgSeasons.autumn.src = 'images/bg-pulau-gugur.png';
            bgSeasons.winter.src = 'images/bg-pulau-salju.png';

            // NEW: LOAD HOUSE INTERIORS (LEVEL 1-5)
            const houseBgAssets = {
                level1: new Image(),
                level2: new Image(),
                level3: new Image(),
                level4: new Image(),
                level5: new Image()
            };
            houseBgAssets.level1.src = 'images/rumahindoor_level1.png';
            houseBgAssets.level2.src = 'images/rumahindoor_level2.png';
            houseBgAssets.level3.src = 'images/rumahindoor_level3.png';
            houseBgAssets.level4.src = 'images/rumahindoor_level4.png';
            houseBgAssets.level5.src = 'images/rumahindoor_level5.png';

            // NEW: DUNGEON & MONSTER ASSETS (PREPARATION)
            const dungeonAssets = {
                wall: new Image(),
                floor: new Image(),
                rock: new Image(),
                // UPDATE: Asset Monster Berjenjang
                enemy1: new Image(),
                enemy2: new Image(),
                enemy3: new Image(),
                enemy4: new Image(),
                enemy5: new Image(), // NEW: Monster Level 5
                thief: new Image(),  // NEW: Monster Pencuri Skripsi
                boss: new Image()
            };
            dungeonAssets.wall.src = 'images/dungeon_wall.png';   // Ukuran 30x30
            dungeonAssets.floor.src = 'images/dungeon_floor.png'; // Ukuran 30x30
            dungeonAssets.rock.src = 'images/batudidungeon.png';  // Set gambar batu khusus

            // Load Monster Images
            dungeonAssets.enemy1.src = 'images/monster.png';
            dungeonAssets.enemy2.src = 'images/monster-lvl2.png';
            dungeonAssets.enemy3.src = 'images/monster-lvl3.png';
            dungeonAssets.enemy4.src = 'images/monster-lvl4.png';
            dungeonAssets.enemy5.src = 'images/monster-lvl5.png';
            dungeonAssets.thief.src = 'images/monster-thief.png'; // Monster Skripsi
            dungeonAssets.boss.src = 'images/monster-boss.png';

            // NEW: WALL ASSETS (Custom Walls)
            const wallAssets = {
                school: new Image(),
                schoolFloor: new Image(), // NEW: Aset Lantai Kampus
                libraryFloor: new Image(), // NEW: Aset Lantai Perpus
                libraryWall: new Image(),   // NEW: Aset Tembok Perpus
                guildFloor: new Image(),    // NEW: Aset Lantai Guild
                guildWall: new Image(),      // NEW: Aset Tembok Guild
                houseWall: new Image(),       // NEW: Aset Tembok Rumah Player
                houseWallBottom: new Image(),  // NEW: Aset Tembok Bawah Rumah Player
                blacksmithWall: new Image()   // NEW: Aset Tembok Blacksmith
            };
            wallAssets.school.src = 'images/tiletembokkampus.png';
            wallAssets.schoolFloor.src = 'images/tilelantaikampus.png';
            wallAssets.libraryFloor.src = 'images/tilelantaiperpus.png';
            wallAssets.libraryWall.src = 'images/tiletembokperpus.png';
            wallAssets.guildFloor.src = 'images/tilelantaiguild.png';
            wallAssets.guildWall.src = 'images/tiletembokguild.png';
            wallAssets.houseWall.src = 'images/tiletembokrumahplayer.png';
            wallAssets.houseWallBottom.src = 'images/titletembokbawahplayer.png';
            wallAssets.blacksmithWall.src = 'images/tiletembokblacksmith.png'; // Set Source Baru

            // --- NEW: CLINIC ASSETS (LANTAI KLINIK) ---
            const clinicAssets = {
                floor: new Image()
            };
            clinicAssets.floor.src = 'images/lantaiklinik.png';
            // Fallback visual lantai putih bersih jika gambar gagal load
            clinicAssets.floor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZjFmNWY5Ii8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMmU4ZjAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==';
            };

            // --- NEW: MENTOR ASSETS (LANTAI RUMAH MENTOR) ---
            const mentorAssets = {
                floor: new Image()
            };
            mentorAssets.floor.src = 'images/lantaimentor.png';
            // Fallback visual lantai kayu klasik/elegan jika gambar gagal load
            mentorAssets.floor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNmM0YTNmIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==';
            };

            let bgLoadedCount = 0;
            const onBgLoad = () => {
                bgLoadedCount++;
                console.log(`Background loaded: ${bgLoadedCount}/4`);
            };

            // Attach listeners
            Object.values(bgSeasons).forEach(img => {
                img.onload = onBgLoad;
                img.onerror = () => console.error("Gagal memuat background musiman");
            });

            // --- AUDIO SYSTEM (UPDATED: SEASONAL MUSIC) ---
            const AudioService = {
                enabled: false,
                tracks: {
                    opening: new Audio('audio/opening.mp3'),
                    village: new Audio('audio/audiopulau.mp3'), // Musik Default
                    sea: new Audio('audio/laut.mp3'),
                    rain: new Audio('audio/hujan.mp3'),
                    bird: new Audio('audio/burung.mp3'),
                    night: new Audio('audio/malam.mp3'),

                    // --- NEW: MUSIK MUSIMAN ---
                    spring: new Audio('audio/spring.mp3'),   // Musim Semi
                    summer: new Audio('audio/summer.mp3'),   // Musim Panas
                    autumn: new Audio('audio/fall.mp3'),     // Musim Gugur (Fall)
                    winter: new Audio('audio/winter.mp3'),   // Musim Dingin

                    // Audio Hewan & SFX
                    kambing: new Audio('audio/kambing.mp3'),
                    sapi: new Audio('audio/sapi.mp3'),
                    ayam: new Audio('audio/ayam.mp3'),
                    kuda: new Audio('audio/kuda.mp3'),
                    door: new Audio('audio/door.mp3'),
                    hit: new Audio('audio/pukul.mp3'),
                    item: new Audio('audio/item.mp3'),
                    bg: new Audio('audio/bg.mp3'),
                    chat: new Audio('audio/chat.mp3'),
                    inside: new Audio('audio/inside.mp3'),
                    dungeon: new Audio('audio/dungeon.mp3'),
                    boss: new Audio('audio/boss.mp3'),
                    battle: new Audio('audio/battle.mp3'),       // FIX: BGM battle/combat di dungeon
                    knock: new Audio('audio/knock.mp3'),
                    wedding: new Audio('audio/wedding.mp3'),
                    pulauperi: new Audio('audio/pulauperi.mp3'),
                    insideperi: new Audio('audio/insideperi.mp3') // FIX: Musik dalam bangunan pulau peri
                },
                currentTrack: null,
                currentAmbience: null, // NEW: Track Ambience (Suara Latar)

                init: function () {
                    try {
                        // Set Looping untuk Musik Latar
                        if (this.tracks.opening) this.tracks.opening.loop = true;
                        if (this.tracks.village) this.tracks.village.loop = true;
                        if (this.tracks.night) this.tracks.night.loop = true;
                        if (this.tracks.sea) this.tracks.sea.loop = true;
                        if (this.tracks.rain) this.tracks.rain.loop = true;
                        if (this.tracks.inside) this.tracks.inside.loop = true;
                        if (this.tracks.dungeon) this.tracks.dungeon.loop = true;
                        if (this.tracks.boss) this.tracks.boss.loop = true;
                        if (this.tracks.wedding) this.tracks.wedding.loop = true;

                        // --- MUSIK KAHYANGAN WILIS ---
                        if (this.tracks.pulauperi) this.tracks.pulauperi.loop = true;
                        if (this.tracks.insideperi) this.tracks.insideperi.loop = true;  // FIX: loop dalam bangunan peri
                        if (this.tracks.battle) this.tracks.battle.loop = true;           // FIX: loop battle music

                        // --- NEW: SETTING MUSIK MUSIM ---
                        if (this.tracks.spring) this.tracks.spring.loop = true;
                        if (this.tracks.summer) this.tracks.summer.loop = true;
                        if (this.tracks.autumn) this.tracks.autumn.loop = true;
                        if (this.tracks.winter) this.tracks.winter.loop = true;

                        // Set Volume Default
                        if (this.tracks.opening) this.tracks.opening.volume = 0.5;
                        if (this.tracks.village) this.tracks.village.volume = 0.5;
                        // Ambience Volume (Agak kecil agar tidak menutupi musik)
                        if (this.tracks.night) this.tracks.night.volume = 0.6;
                        if (this.tracks.sea) this.tracks.sea.volume = 0.0;
                        if (this.tracks.rain) this.tracks.rain.volume = 0.4;
                        if (this.tracks.bird) this.tracks.bird.volume = 0.3;

                        // --- NEW: VOLUME MUSIK MUSIM ---
                        if (this.tracks.spring) this.tracks.spring.volume = 0.5;
                        if (this.tracks.summer) this.tracks.summer.volume = 0.5;
                        if (this.tracks.autumn) this.tracks.autumn.volume = 0.5;
                        if (this.tracks.winter) this.tracks.winter.volume = 0.5;

                        // Volume SFX
                        if (this.tracks.kambing) this.tracks.kambing.volume = 0.6;
                        if (this.tracks.sapi) this.tracks.sapi.volume = 0.6;
                        if (this.tracks.ayam) this.tracks.ayam.volume = 0.4;
                        if (this.tracks.kuda) this.tracks.kuda.volume = 0.6;
                        if (this.tracks.door) this.tracks.door.volume = 0.8;
                        if (this.tracks.hit) this.tracks.hit.volume = 0.7;
                        if (this.tracks.item) this.tracks.item.volume = 0.8;
                        if (this.tracks.bg) this.tracks.bg.volume = 0.8;
                        if (this.tracks.chat) this.tracks.chat.volume = 0.8;
                        if (this.tracks.inside) this.tracks.inside.volume = 0.5;
                        if (this.tracks.dungeon) this.tracks.dungeon.volume = 0.6;
                        if (this.tracks.boss) this.tracks.boss.volume = 0.8;
                        if (this.tracks.battle) this.tracks.battle.volume = 0.75;         // FIX: volume battle
                        if (this.tracks.knock) this.tracks.knock.volume = 1.0;
                        if (this.tracks.wedding) this.tracks.wedding.volume = 0.8;
                        if (this.tracks.pulauperi) this.tracks.pulauperi.volume = 0.55;
                        if (this.tracks.insideperi) this.tracks.insideperi.volume = 0.6;  // FIX: volume insideperi
                    } catch (e) {
                        console.warn("Audio Init Error (Non-Fatal):", e);
                    }
                },

                playBGM: function (trackName) {
                    if (!this.enabled) return;
                    // FIX: Jika track sama tapi sudah pause (gagal main sebelumnya), coba play ulang
                    if (this.currentTrack === trackName) {
                        const t = this.tracks[trackName];
                        if (t && t.paused) {
                            t.play().catch(() => {});
                        }
                        return;
                    }

                    // Stop track sebelumnya
                    if (this.currentTrack && this.tracks[this.currentTrack]) {
                        this.tracks[this.currentTrack].pause();
                        this.tracks[this.currentTrack].currentTime = 0;
                    }

                    // Mainkan track baru
                    this.currentTrack = trackName;
                    if (this.tracks[trackName]) {
                        const playPromise = this.tracks[trackName].play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                // console.log("Audio play prevented/interrupted:", error);
                            });
                        }
                    }
                },


                // --- NEW: FUNGSI AMBIENCE (SUARA LATAR) ---
                playAmbience: function (trackName) {
                    if (!this.enabled) return;
                    if (this.currentAmbience === trackName) return;

                    // Stop ambience sebelumnya
                    this.stopAmbience();

                    this.currentAmbience = trackName;
                    if (this.tracks[trackName]) {
                        this.tracks[trackName].play().catch(() => { });
                    }
                },

                stopAmbience: function () {
                    if (this.currentAmbience && this.tracks[this.currentAmbience]) {
                        this.tracks[this.currentAmbience].pause();
                        this.tracks[this.currentAmbience].currentTime = 0;
                    }
                    this.currentAmbience = null;
                },




                playSFX: function (trackName) {
                    if (!this.enabled) return;
                    const track = this.tracks[trackName];
                    if (track) {
                        track.currentTime = 0;
                        track.loop = false;
                        const playPromise = track.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(() => { });
                        }
                    }
                },

                stopBGM: function () {
                    if (this.currentTrack && this.tracks[this.currentTrack]) {
                        this.tracks[this.currentTrack].pause();
                        this.tracks[this.currentTrack].currentTime = 0;
                        this.currentTrack = null;
                    }
                },

                update: function () {
                    if (!this.enabled) return;

                    // 1. UPDATE BGM UTAMA
                    // FIX: Juga update saat screen === 'cutscene' agar musik dungeon/boss
                    // tidak berhenti ketika cutscene dimainkan
                    const _scr = STATE.screen;
                    if (_scr === 'title' || _scr === 'login' || _scr === 'prologue') {
                        this.playBGM('opening');
                    } else if (_scr === 'play' || _scr === 'cutscene') {
                        if (STATE.location === 'village') {
                            // Hanya update musik saat screen benar-benar play (bukan cutscene)
                            if (_scr === 'play') {
                                if (STATE.season === 'spring') {
                                    this.playBGM('spring');
                                } else if (STATE.season === 'summer') {
                                    this.playBGM('summer');
                                } else if (STATE.season === 'autumn') {
                                    this.playBGM('autumn');
                                } else if (STATE.season === 'winter') {
                                    this.playBGM('winter');
                                } else {
                                    this.playBGM('village');
                                }
                                if (STATE.time >= 1800 || STATE.time < 500) {
                                    this.playAmbience('night');
                                } else {
                                    this.stopAmbience();
                                }
                            }
                        } else if (STATE.location === 'dungeon') {
                            this.stopAmbience();
                            if (STATE.bossSpawned) {
                                this.playBGM('boss');
                            } else if (this.tracks.battle && this.tracks.battle.src &&
                                       this.tracks.battle.src !== window.location.href &&
                                       this.tracks.battle.readyState > 0) {
                                this.playBGM('battle');
                            } else {
                                this.playBGM('dungeon');
                            }
                        } else if (STATE.location === 'ruins_battle') {
                            // Monster Pencuri Skripsi — selalu pakai boss music
                            this.stopAmbience();
                            this.playBGM('boss');
                        } else if (STATE.location === 'fairyVillage') {
                            this.stopAmbience();
                            // Jangan override insideperi saat popup interior bangunan sedang terbuka
                            const _fvInteriorOpen = !!document.getElementById('fv-building-interior');
                            if (!_fvInteriorOpen) {
                                this.playBGM('pulauperi');
                            }
                        } else {
                            this.stopAmbience();
                            if (STATE.location === 'wedding_interior') {
                                this.playBGM('wedding');
                            } else {
                                this.playBGM('inside');
                            }
                        }
                    }

                    // 2. UPDATE SFX HUJAN
                    if ((STATE.weather === 'rain' || STATE.weather === 'snow') && STATE.location === 'village') {
                        if (this.tracks.rain && this.tracks.rain.paused) this.tracks.rain.play().catch(() => { });
                    } else {
                        if (this.tracks.rain && !this.tracks.rain.paused) this.tracks.rain.pause();
                    }

                    // 3. UPDATE SFX LAUT (Hanya jika di desa)
                    if (STATE.location === 'village' && this.tracks.sea) {
                        const margin = 15 * TILE_SIZE;
                        const mapW = ISLAND_W * TILE_SIZE;
                        const mapH = ISLAND_H * TILE_SIZE;

                        const distLeft = STATE.player.x;
                        const distRight = mapW - STATE.player.x;
                        const distTop = STATE.player.y;
                        const distBottom = mapH - STATE.player.y;

                        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

                        if (minDist < margin) {
                            if (this.tracks.sea.paused) {
                                const p = this.tracks.sea.play();
                                if (p !== undefined) p.catch(() => { });
                            }
                            const vol = Math.max(0, 1 - (minDist / margin)) * 0.8;
                            this.tracks.sea.volume = vol;
                        } else {
                            if (!this.tracks.sea.paused) {
                                this.tracks.sea.pause();
                                this.tracks.sea.currentTime = 0;
                            }
                        }

                        // 4. UPDATE SFX BURUNG
                        if (STATE.time > 400 && STATE.time < 1800 && STATE.weather === 'clear') {
                            if (Math.random() < 0.005) {
                                if (this.tracks.bird && this.tracks.bird.paused) {
                                    this.tracks.bird.currentTime = 0;
                                    this.tracks.bird.play().catch(() => { });
                                }
                            }
                        }

                    } else {
                        if (this.tracks.sea) this.tracks.sea.pause();
                        if (this.tracks.bird) this.tracks.bird.pause();
                    }
                }
            };

            // KONFIGURASI UKURAN TILE
            const SRC_TILE_SIZE = 32;

            // TILESET MAPPING (ATLAS)
            const TILE_ATLAS = {
                0: { x: 2, y: 0 }, // Water
                1: { x: 0, y: 0 }, // Grass
                5: { x: 1, y: 0 }, // Earth
                6: { x: 3, y: 0 }, // Magic Floor
                4: { x: 4, y: 0 }, // Dungeon Floor
                10: { x: 5, y: 0 } // Wood Floor
            };
            // --- END ASSET LOADER ---

            // --- NEW FUNCTION: SHOW DAILY QUEST ---
            let currentQuestTab = 'daily'; // Track active tab

            function showDailyQuestPopup() {
                // Jangan munculkan di Prologue atau Cutscene
                if (STATE.isPrologue || STATE.screen === 'cutscene') return;

                // UPDATE: Ganti 'bg' ke 'item' agar suara lebih terdengar jelas (klik)
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const popup = document.getElementById('daily-quest-popup');
                const title = document.getElementById('quest-day-title');
                const sub = document.getElementById('quest-season-subtitle');

                // Update Text Header
                title.innerText = `HARI KE-${STATE.day}`;
                // 1 Tahun = 120 Hari (4 Musim x 30 Hari)
                const year = Math.floor((STATE.day - 1) / 120) + 1;
                sub.innerText = `${STATE.season.toUpperCase()} - TAHUN KE-${year}`;

                // Render Content Default (Last Active Tab)
                switchQuestTab(currentQuestTab);

                // Show
                popup.style.display = 'flex';
                STATE.screen = 'modal'; // Pause game input
            }

            // Helper untuk Toggle via Tombol
            function toggleDailyQuest() {
                const popup = document.getElementById('daily-quest-popup');
                if (popup.style.display === 'flex') {
                    closeDailyQuest();
                } else {
                    showDailyQuestPopup();
                }
            }

            // FIX: Menambahkan fungsi closeDailyQuest yang sebelumnya hilang
            function closeDailyQuest() {
                // NEW: Tambahkan SFX saat menutup jurnal agar ada feedback
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const popup = document.getElementById('daily-quest-popup');
                if (popup) popup.style.display = 'none';
                STATE.screen = 'play'; // Resume game
            }

            function switchQuestTab(tabName) {
                currentQuestTab = tabName;

                // Update UI Tabs
                document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
                const activeBtn = document.getElementById('tab-' + tabName);
                if (activeBtn) activeBtn.classList.add('active');

                // Update Content
                const content = document.getElementById('quest-list-content');
                content.innerHTML = getQuestContent(tabName);
            }

            // --- DAILY COMPLETION CHECK (diperbarui sesuai quest baru) ---
            function checkDailyCompletion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;

                // Syarat Wajib Umum
                const condGeneral    = p.energy < 100;
                const hasJournal     = p.reflections && p.reflections.some(r => r.day === STATE.day);
                const hasTalked      = (p.dailyTalkCount || 0) >= 1;
                const hasMonsterKill = (p.dailyMonsterKills || 0) >= 2;
                const hasFishing     = (p.dailyFishingCount || 0) >= 1;

                // Syarat Role Spesifik
                let condRole = false;
                if (role === 'worker') {
                    const isSunday = ((STATE.day - 1) % 7 === 6);
                    condRole = isSunday ? p.energy < 70 : (p.shiftStarted || p.energy < 60);
                } else if (role === 'student') {
                    condRole = (p.lastAttendanceDay === STATE.day) || p.energy < 70 || STATE.location === 'library_interior';
                } else if (role === 'entrepreneur') {
                    const hasStock = Object.values(p.inventory).some(v => v > 0);
                    condRole = hasStock || p.biz >= (p.level * 2);
                } else if (role === 'family') {
                    condRole = p.energy < 80 || (p.dailyTalkCount || 0) >= 2;
                }

                return condGeneral && condRole && hasJournal && hasFishing && hasMonsterKill && hasTalked;
            }

            // --- CEK BERAPA BONUS QUEST YANG SELESAI HARI INI ---
            function countBonusQuestsDone() {
                const p = STATE.player;
                const role = p.role;
                const day = STATE.day;
                const BONUS_POOL_CHECK = {
                    worker: [
                        () => (p.inventory['tonic_stamina'] || 0) >= 1 || (p.inventory['obat'] || 0) >= 1,
                        () => (p.dailyMonsterKills || 0) >= 1,
                        () => (p.dailyTalkCount || 0) >= 3,
                        () => p.money >= 2000,
                        () => (p.furniture || []).length >= 1,
                        () => (p.dailyFishingCount || 0) >= 2,
                        () => p.level >= 1,
                    ],
                    student: [
                        () => Object.keys(p.inventory).some(k => k.includes('buku')),
                        () => STATE.location === 'library_interior',
                        () => (p.inventory['coklat'] || 0) >= 1,
                        () => (p.dailySelfStudy || 0) >= 2,
                        () => (p.dailyTalkCount || 0) >= 2,
                        () => (p.dailyFishingCount || 0) >= 1,
                        () => p.money >= 5000,
                    ],
                    entrepreneur: [
                        () => STATE.location === 'merchant_interior',
                        () => Object.values(p.inventory).some(v => v > 0),
                        () => p.money >= 10000,
                        () => (p.houseLevel || 1) >= 2,
                        () => (p.dailySellCount || 0) >= 1,
                        () => (p.dailyTalkCount || 0) >= 3,
                        () => (p.dailyFishingCount || 0) >= 1,
                    ],
                    family: [
                        () => (p.dailyTalkCount || 0) >= 3,
                        () => Object.values(p.inventory).some(v => v > 0),
                        () => STATE.location === 'guild_interior' || STATE.location === 'merchant_interior',
                        () => STATE.player.farming && Object.values(STATE.player.farming).some(c => c && c.watered),
                        () => (p.dailyFishingCount || 0) >= 1,
                        () => p.money >= 3000,
                        () => (p.dailyMonsterKills || 0) >= 1,
                    ],
                };
                const pool = BONUS_POOL_CHECK[role] || [];
                if (pool.length < 2) return 0;
                const bq1Done = pool[(day - 1) % pool.length]();
                const idx2 = day % pool.length;
                const bq2Done = (idx2 !== (day - 1) % pool.length) && pool[idx2]();
                return (bq1Done ? 1 : 0) + (bq2Done ? 1 : 0);
            }

            // --- NEW HELPER: CHECK WEEKLY COMPLETION ---
            function checkWeeklyCompletion() {
                const p = STATE.player;
                const week = Math.ceil(STATE.day / 7);
                const role = p.role;

                if (role === 'none') return false;

                // 1. Syarat Umum
                const weekLvlTarget = week * 2;
                const condLevel = p.level >= weekLvlTarget;
                const condItem = (p.inventory['ikan_segar'] || 0) >= 1;

                // 2. Syarat Role
                let condRole = false;
                if (role === 'worker') {
                    const targetStr = p.level * 2 + 10;
                    condRole = p.str >= targetStr;
                } else if (role === 'student') {
                    const targetInt = p.level * 2 + 10;
                    const hasSnack = (p.inventory['coklat'] || 0) >= 1;
                    condRole = p.int >= targetInt && hasSnack;
                } else if (role === 'entrepreneur') {
                    const targetBiz = p.level + 5;
                    condRole = p.biz >= targetBiz;
                } else if (role === 'family') {
                    const friendTarget = Math.min(5, Math.ceil(week / 2));
                    const currentFriends = Object.keys(p.relationships).length;
                    condRole = currentFriends >= friendTarget;
                }

                return condLevel && condItem && condRole;
            }

            // --- NEW HELPER: CHECK MONTHLY COMPLETION ---
            function checkMonthlyCompletion() {
                const p = STATE.player;
                const month = Math.ceil(STATE.day / 30);
                const role = p.role;

                if (role === 'none') return false;

                // 1. Syarat Tabungan
                const monthlyMoneyTarget = month * 10000;
                const condMoney = p.money >= monthlyMoneyTarget;

                // 2. Syarat Role
                let condRole = false;
                if (role === 'worker') condRole = p.bossReputation >= 70;
                else if (role === 'student') condRole = Object.keys(p.inventory).some(k => k.includes('buku'));
                else if (role === 'entrepreneur') condRole = p.money >= monthlyMoneyTarget * 1.5;
                else if (role === 'family') condRole = p.reputation >= month * 10;

                // 3. Syarat Musim (Opsional, tapi kita masukkan agar menantang)
                // Sederhana: Harus punya item khas musim atau progress tertentu
                let condSeason = false;
                if (STATE.season === 'spring') condSeason = (p.inventory['bunga'] || 0) > 0;
                else if (STATE.season === 'summer') condSeason = (p.inventory['ikan_segar'] || 0) >= 5;
                else if (STATE.season === 'autumn') condSeason = p.money >= 50000;
                else if (STATE.season === 'winter') condSeason = STATE.dungeonLevel >= 2;

                return condMoney && condRole && condSeason;
            }

            // ═══════════════════════════════════════════════════════════
