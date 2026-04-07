// ========================================================
// js/10_tutorial.js
// Tutorial System
// ========================================================

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

