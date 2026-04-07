// ========================================================
// js/08_fairy_village_ui.js
// Kahyangan Wilis UI, Fairy Village Map
// ========================================================

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


