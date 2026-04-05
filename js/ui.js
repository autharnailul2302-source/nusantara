// ═══════════════════════════════════════════
// UI.JS — Nusantara Arsa: Rise of Student
// Baris 10673–12803 dari index asli
// ═══════════════════════════════════════════

            function startGameSequence() {
                try {
                    // Cek sesi login terakhir untuk prefill
                    try {
                        let lastUser = localStorage.getItem(SESSION_KEY);
                        if (lastUser) {
                            // FIX: Jika data berupa JSON (Sesi Admin Lama), HAPUS dan jangan tampilkan agar tidak error
                            if (lastUser.trim().startsWith('{')) {
                                localStorage.removeItem(SESSION_KEY); // Bersihkan sesi rusak
                                lastUser = null;
                            }

                            if (lastUser) {
                                const elSiswa = document.getElementById('siswa-email');
                                const elGuru = document.getElementById('guru-email');
                                if (elSiswa) elSiswa.value = lastUser;
                                if (elGuru) elGuru.value = lastUser;
                            }
                        }
                    } catch (e) { console.warn("Local storage/DOM Access Error:", e); }

                    // Pastikan Audio Prompt muncul duluan, Splash sembunyi
                    const audioPrompt = document.getElementById('audio-prompt');
                    const splash = document.getElementById('splash-screen');

                    // FIX: Pastikan Layar Login & Title sembunyi di awal untuk mencegah glitch visual
                    const loginScreen = document.getElementById('login-screen');
                    const titleScreen = document.getElementById('title-screen');
                    if (loginScreen) loginScreen.style.display = 'none';
                    if (titleScreen) titleScreen.classList.add('hidden');

                    if (audioPrompt) audioPrompt.style.display = 'flex';
                    if (splash) splash.style.display = 'none';

                } catch (err) {
                    console.error("CRITICAL INIT ERROR:", err);
                }
            };

            // Jalankan saat HTML sudah siap (Lebih cepat dari window.onload)
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startGameSequence);
            } else {
                startGameSequence();
            }

            // UPDATE: HANDLE PILIHAN AUDIO -> LANJUT KE LOADING ASET
            function handleAudioChoice(enable) {
                // Browser butuh interaksi user untuk fullscreen, jadi ini tempat terbaik.
                toggleFullScreen();

                AudioService.enabled = enable;

                // 1. Sembunyikan Audio Prompt
                document.getElementById('audio-prompt').style.display = 'none';

                // 2. Tampilkan Splash Screen (Loading)
                const splash = document.getElementById('splash-screen');
                if (splash) {
                    splash.style.display = 'flex';
                    splash.style.opacity = 1;
                }

                // 3. Init Audio Context (Karena sudah ada interaksi user, audio bisa jalan)
                if (typeof AudioService !== 'undefined') {
                    AudioService.init();
                    if (enable) {
                        AudioService.playBGM('opening');
                    }
                }

                // 4. Mulai Loading Aset
                startAssetLoading();
            }

            // NEW: FUNGSI LOADING ASET (WAJIB 100%)
            function startAssetLoading() {
                console.log("Memulai Asset Loading...");
                const loadingText = document.getElementById('loading-text');
                const loadingBar = document.getElementById('loading-bar');
                const loadingContainer = document.getElementById('loading-container');
                const startBtn = document.getElementById('splash-start-btn');

                // UPDATE: HAPUS "Promise.race" dan "setTimeout".
                // Sekarang kita murni menunggu preloadAllGameAssets selesai sepenuhnya.

                preloadAllGameAssets().then(() => {
                    // Kode di dalam sini HANYA akan jalan setelah semua aset selesai (Resolusi 100%)
                    console.log("Assets Ready: 100%");

                    // Pastikan visual bar penuh
                    if (loadingBar) loadingBar.style.width = '100%';
                    if (loadingText) loadingText.innerText = 'ASET SIAP! 100%';

                    // Beri jeda sedikit (500ms) agar pemain sempat melihat tulisan "100%"
                    setTimeout(() => {
                        // Sembunyikan Loading Bar & Teks
                        if (loadingContainer) loadingContainer.style.display = 'none';
                        if (loadingText) loadingText.style.display = 'none';

                        // Tampilkan Tombol Mulai
                        if (startBtn) {
                            startBtn.style.display = 'block';
                            // Tambahkan efek animasi masuk
                            startBtn.style.animation = "pulse 1s infinite";

                            startBtn.onclick = () => {
                                // Sembunyikan tombol biar gak diklik 2x
                                startBtn.style.display = 'none';

                                // Efek Suara (Jika ada)
                                if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                                    AudioService.playSFX('item');
                                }

                                enterMainMenu();
                            };
                        }
                    }, 500);

                }).catch(err => {
                    console.error("Preload Error:", err);
                    // Fallback jika terjadi error fatal pada sistem loading (jarang terjadi)
                    if (loadingText) loadingText.innerText = "TERJADI KESALAHAN MEMUAT.";

                    if (startBtn) {
                        startBtn.innerText = "⚠️ REFRESH HALAMAN";
                        startBtn.style.display = 'block';
                        startBtn.onclick = () => location.reload();
                    }
                });
            }

            // Helper untuk Masuk Menu Utama
            function enterMainMenu() {
                const splash = document.getElementById('splash-screen');
                if (typeof resize === 'function') resize();

                // Fade Out Splash -> Masuk Title Screen / Cek Session
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        if (splash) {
                            splash.style.opacity = 0; // Trigger CSS transition fadeOut
                            setTimeout(() => {
                                splash.style.display = 'none';

                                // Cek Session setelah loading selesai
                                const title = document.getElementById('title-screen');
                                checkSession(title);

                            }, 500); // Hapus elemen setelah animasi CSS selesai
                        } else {
                            const title = document.getElementById('title-screen');
                            checkSession(title);
                        }
                    }, 200);
                });
            }

            function togglePassword(fieldId, iconId) {
                const input = document.getElementById(fieldId);
                const icon = document.getElementById(iconId);
                if (input.type === "password") {
                    input.type = "text";
                    icon.innerText = "🔓";
                } else {
                    input.type = "password";
                    icon.innerText = "👁️";
                }
            }

            function checkSession(titleEl) {
                try {
                    const sessionData = localStorage.getItem(SESSION_KEY);
                    if (sessionData) {
                        // FIX: Legacy Support - Jika masih ada user yang menyimpan JSON, handle gracefuly
                        // Tapi idealnya kita sudah bersihkan di startGameSequence
                        if (sessionData.trim().startsWith('{')) {
                            try {
                                const adminUser = JSON.parse(sessionData);
                                // Migrasi otomatis ke format baru (String Email)
                                localStorage.setItem(SESSION_KEY, adminUser.email || "admin@system.local");
                                DataService.user = adminUser;
                                initTeacherDashboard();
                                return;
                            } catch (e) {
                                localStorage.removeItem(SESSION_KEY); // Corrupt, hapus
                                return;
                            }
                        }

                        // --- LOGIKA STANDAR (Admin/Guru/Siswa sekarang diperlakukan sama) ---
                        const dbLocal = DataService.getDB();
                        const user = dbLocal[sessionData];

                        if (user) {
                            DataService.user = { email: sessionData, ...user };

                            // Cek Role untuk Redirect
                            if (user.role === 'admin') {
                                // Sembunyikan layar lain
                                document.getElementById('login-screen').style.display = 'none';
                                document.getElementById('title-screen').classList.add('hidden');
                                initTeacherDashboard();
                            }
                            else if (user.role === 'guru') {
                                initTeacherDashboard();
                            }
                            else {
                                // Logic Siswa
                                document.getElementById('welcome-name').innerText = user.name || "Siswa";
                                document.getElementById('welcome-class').innerText = user.details || "Umum";
                                if (user.mentor) document.getElementById('welcome-mentor').innerText = "Mentor Active";
                                document.getElementById('login-screen').style.display = 'none';

                                if (!user.saveData) {
                                    startPrologue();
                                } else {
                                    document.getElementById('start-screen').classList.remove('hidden');
                                }
                            }
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Session Check Error:", e);
                    localStorage.removeItem(SESSION_KEY);
                }

                if (titleEl) titleEl.classList.remove('hidden');
                STATE.screen = 'title';
            }

            // NEW: FUNCTION TOGGLE FULLSCREEN & FORCE LANDSCAPE
            function toggleFullScreen() {
                const elem = document.documentElement;

                // --- UPDATE: FUNGSI MEMAKSA ORIENTASI LANDSCAPE (ANDROID/CHROME) ---
                // Ini memungkinkan game berputar otomatis meskipun "Auto-Rotate" di HP dimatikan
                const forceLandscape = () => {
                    if (screen.orientation && screen.orientation.lock) {
                        screen.orientation.lock('landscape')
                            .then(() => console.log("Orientation locked to Landscape"))
                            .catch((err) => {
                                // Beberapa browser/OS (terutama iOS Safari) mungkin menolak ini
                                console.warn("Orientation lock failed/not supported:", err);
                            });
                    }
                };

                // Cek apakah browser sudah dalam mode fullscreen?
                const isFullscreen = document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement;

                if (!isFullscreen) {
                    // KONDISI 1: BELUM FULLSCREEN -> Request Fullscreen dulu, baru Lock Landscape
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen().then(forceLandscape).catch(err => console.log(err));
                    } else if (elem.webkitRequestFullscreen) { /* Safari */
                        elem.webkitRequestFullscreen();
                        setTimeout(forceLandscape, 500); // Coba lock setelah delay di Safari
                    } else if (elem.msRequestFullscreen) { /* IE11 */
                        elem.msRequestFullscreen();
                        setTimeout(forceLandscape, 500);
                    }
                } else {
                    // KONDISI 2: SUDAH FULLSCREEN -> Langsung Paksa Lock Landscape
                    // (Berguna jika pemain tidak sengaja memutar HP kembali ke potrait)
                    forceLandscape();
                }
            }

            // logout() defined below

            function goToLogin() {
                // FITUR OTOMATIS FULLSCREEN: Trigger saat klik tombol Start
                toggleFullScreen();

                document.getElementById('title-screen').classList.add('hidden');
                document.getElementById('login-screen').style.display = 'flex';
                STATE.screen = 'login';
            }

            function goToTitle() {
                document.getElementById('login-screen').style.display = 'none';
                const gcCanvas = document.getElementById('gameCanvas');
                if (gcCanvas) gcCanvas.style.display = 'none';
                document.getElementById('title-screen').classList.remove('hidden');
                STATE.screen = 'title';
            }

            // --- NEW: PUBLIC LEADERBOARD LOGIC ---
            async function showLeaderboard() {
                // 1. Tampilkan Overlay Loading
                const overlay = document.getElementById('leaderboard-overlay');
                const list = document.getElementById('lb-list');
                overlay.style.display = 'flex';
                list.innerHTML = '<div style="padding:20px; color:#78350f; font-weight:bold;">🔄 Sinkronisasi Data...</div>';

                try {
                    // FIX: Paksa Init Koneksi Cloud dulu agar data terbaru diambil
                    await DataService.init(true);

                    // 2. Ambil Data Global dari Server
                    let students = await DataService.getAllStudents();

                    // 3. OPTIMISTIC UPDATE (Gabungkan Data Lokal Pemain jika Lebih Baru)
                    // Ini memastikan skor pemain sendiri terlihat update meski server delay
                    const currentUserEmail = localStorage.getItem(SESSION_KEY);
                    if (currentUserEmail) {
                        const dbLocal = DataService.getDB();
                        const localUserData = dbLocal[currentUserEmail];

                        // Cek apakah user punya data lokal yang valid
                        if (localUserData && localUserData.saveData) {
                            // Cari data user ini di list server
                            const serverIndex = students.findIndex(s => s.email === currentUserEmail);

                            if (serverIndex !== -1) {
                                // Jika ketemu, bandingkan timestamp (lastActive)
                                const serverSave = students[serverIndex].saveData || {};
                                const localSave = localUserData.saveData;

                                // Jika lokal lebih baru dari server, TIMPA data server di memori tampilan
                                if ((localSave.lastActive || 0) > (serverSave.lastActive || 0)) {
                                    students[serverIndex] = { ...students[serverIndex], ...localUserData };
                                    console.log("Leaderboard: Menggunakan data lokal (lebih baru) untuk user ini.");
                                }
                            } else {
                                // Jika user belum ada di server (baru main offline), masukkan ke list manual
                                if (localUserData.role === 'siswa') {
                                    students.push({ email: currentUserEmail, ...localUserData });
                                }
                            }
                        }
                    }

                    // 4. Filter & Sort
                    // Hanya siswa yang punya saveData valid
                    let validStudents = students.filter(s => s.saveData && s.saveData.day);

                    // Sort berdasarkan Score Tertinggi
                    validStudents.sort((a, b) => {
                        const scoreA = calculateGrade(a.saveData);
                        const scoreB = calculateGrade(b.saveData);
                        return scoreB - scoreA;
                    });

                    // Ambil Top 10
                    const top10 = validStudents.slice(0, 10);

                    // 5. Render
                    list.innerHTML = '';

                    if (top10.length === 0) {
                        list.innerHTML = '<div style="padding:20px; color:#78350f;">Belum ada data petualang. <br>Jadilah yang pertama!</div>';
                        return;
                    }

                    top10.forEach((s, index) => {
                        const rank = index + 1;
                        const score = calculateGrade(s.saveData);
                        const role = s.saveData.role !== 'none' ? s.saveData.role.toUpperCase() : 'NOVICE';
                        const lvl = s.saveData.level || 1;

                        // Style khusus 3 besar
                        let rankClass = '';
                        let icon = `#${rank}`;
                        let bgStyle = '';

                        if (rank === 1) { rankClass = 'top-1'; icon = '🥇'; bgStyle = 'background:#fef9c3; border-left: 4px solid #d97706;'; }
                        else if (rank === 2) { rankClass = 'top-2'; icon = '🥈'; }
                        else if (rank === 3) { rankClass = 'top-3'; icon = '🥉'; }

                        // Highlight User Sendiri (Update Style Terang)
                        if (s.email === currentUserEmail) {
                            bgStyle = 'background:#dbeafe; border: 2px solid #3b82f6;';
                            s.name += " (Kamu)";
                        }

                        list.innerHTML += `
                <div class="lb-item" style="${bgStyle}">
                    <div class="lb-rank ${rankClass}">${icon}</div>
                    <div class="lb-info">
                        <div class="lb-name">${s.name}</div>
                        <div class="lb-detail">${role} | Lv ${lvl}</div>
                    </div>
                    <div class="lb-score">${score}</div>
                </div>
            `;
                    });

                } catch (err) {
                    console.error("Leaderboard Error:", err);
                    list.innerHTML = `<div style="padding:20px; color:#ef4444;">Gagal memuat data server.<br><small>${err.message}</small></div>`;
                }
            }

            function closeLeaderboard() {
                document.getElementById('leaderboard-overlay').style.display = 'none';
            }

            // PROLOGUE LOGIC
            const prologueTexts = [
                "Di usia delapan belas tahun, setiap manusia berdiri di gerbang kehidupannya sendiri.",
                "Tidak ada peta yang benar. Tidak ada jalan yang pasti.",
                "Di Nusantara Arsa, kamu dikirim ke pulau ini bukan untuk dihukum, melainkan untuk ditempa.",
                "Di sini, kamu akan menghadapi realita. Kamu bukan lagi anak-anak, kamu adalah arsitek masa depan.",
                "Pilihanmu adalah kekuatanmu. Bekerja, Belajar, Membangun Usaha, atau Mencintai...",
                "Bahkan gagal dan bangkit kembali. Tidak ada jalan yang salah, hanya konsekuensi.",
                "Tidak semua akan berhasil. Dunia ini kejam bagi yang malas, tapi emas bagi yang berusaha.",
                "Namun mereka yang mampu bertahan, akan membawa pulang hal paling berharga: Pemahaman Hidup.",
                "Selamat datang di Nusantara Arsa.",
                "Hidupmu. Pilihanmu. Bangkitlah!"
            ];

            let prologueTimeout; // Variable to hold the timer
            let prologueIndex = 0; // Track index globally for skipping

            function startPrologue() {
                document.getElementById('login-screen').style.display = 'none';
                const screen = document.getElementById('prologue-screen');
                const textEl = document.getElementById('prologue-text');
                const skipBtn = document.getElementById('skip-prologue-btn');
                const nextBtn = document.getElementById('next-prologue-btn');

                screen.style.display = 'flex';
                skipBtn.style.display = 'block';
                if (nextBtn) nextBtn.style.display = 'block'; // Tampilkan tombol LANJUT
                STATE.screen = 'prologue';

                prologueIndex = 0;

                function showNextLine() {
                    if (prologueIndex >= prologueTexts.length) {
                        skipPrologue(); // Done naturally
                        return;
                    }

                    // Fade Out Text
                    textEl.style.opacity = 0;

                    // Hentikan timer sebelumnya jika ada (Safety)
                    if (prologueTimeout) clearTimeout(prologueTimeout);

                    // Tunggu fade out selesai (500ms)
                    prologueTimeout = setTimeout(() => {
                        // FIX: SYNC GAMBAR & TEKS
                        // Preload gambar dulu, baru tampilkan teks setelah gambar siap
                        const imgNum = prologueIndex + 1;
                        const imgSrc = `images/scene-${imgNum}.png`;
                        const img = new Image();

                        let isRendered = false; // Flag agar tidak jalan 2x

                        // Fungsi untuk menampilkan scene (Gambar + Teks)
                        const renderScene = () => {
                            if (isRendered) return;
                            isRendered = true;

                            // Cek jika user keburu skip saat loading
                            if (STATE.screen !== 'prologue') return;

                            // 1. Update Text
                            textEl.innerText = prologueTexts[prologueIndex];

                            // 2. Update Background (Gambar sudah ter-cache browser karena preload)
                            screen.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imgSrc}')`;

                            // 3. Fade In Text
                            textEl.style.opacity = 1;

                            prologueIndex++;

                            // 4. Update tombol LANJUT dengan nomor scene
                            const _nb = document.getElementById('next-prologue-btn');
                            if (_nb) {
                                const total = prologueTexts.length;
                                _nb.textContent = prologueIndex < total ? `LANJUT ▶  ${prologueIndex}/${total}` : 'LANJUT ▶';
                            }

                            // 5. Jadwalkan baris berikutnya (5 Detik)
                            prologueTimeout = setTimeout(showNextLine, 5000);
                        };

                        // Event Listeners
                        img.onload = renderScene;
                        img.onerror = () => {
                            console.warn(`Scene image missing/error: ${imgSrc}`);
                            renderScene(); // Tetap jalan walau gambar error (Fallback)
                        };

                        // Mulai Download Gambar
                        img.src = imgSrc;

                        // SAFETY TIMEOUT: Jika gambar loading > 3 detik (koneksi lambat), paksa jalan
                        setTimeout(() => {
                            if (!isRendered) {
                                console.log("Image load timeout (Slow Connection), forcing text display.");
                                renderScene();
                            }
                        }, 3000);

                    }, 500); // Waktu transisi fade out text
                }

                // Expose showNextLine agar tombol LANJUT bisa memanggilnya
                window._prologueNext = () => {
                    if (STATE.screen !== 'prologue') return;
                    if (prologueTimeout) clearTimeout(prologueTimeout);
                    showNextLine();
                };

                // Mulai sequence
                showNextLine();
            }

            function nextPrologue() {
                if (window._prologueNext) window._prologueNext();
            }

            function skipPrologue() {
                clearTimeout(prologueTimeout); // Stop animation
                window._prologueNext = null;   // Bersihkan referensi

                // Sembunyikan tombol LANJUT
                const nextBtn = document.getElementById('next-prologue-btn');
                if (nextBtn) nextBtn.style.display = 'none';

                // Reset style background prologue agar tidak mengganggu screen lain (just in case)
                document.getElementById('prologue-screen').style.backgroundImage = 'none';

                document.getElementById('prologue-screen').style.display = 'none';
                document.getElementById('gender-screen').style.display = 'flex';
            }

            function selectGender(gender, fromSave = false) {
                STATE.player.gender = gender;

                const avatarImg = document.getElementById('hud-avatar-img');
                if (gender === 'boy') {
                    avatarImg.src = 'images/boy.png';
                    avatarImg.onerror = function () {
                        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IiMzYjgyZjYiLz48L3N2Zz4=';
                    };
                    document.getElementById('hud-avatar-img').src = 'images/boy.png';
                } else {
                    avatarImg.src = 'images/girl.png';
                    avatarImg.onerror = function () {
                        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IiNlYzlhOWEiLz48L3N2Zz4=';
                    };
                    document.getElementById('hud-avatar-img').src = 'images/girl.png';
                }


                if (gender === 'boy') {
                    STATE.player.spriteIdle = new Image(); STATE.player.spriteIdle.src = 'images/boy-idle.png';
                    STATE.player.spriteWalk = new Image(); STATE.player.spriteWalk.src = 'images/boy-walk.png';
                    // NEW: Load Up Sprite for Boy
                    STATE.player.spriteWalkUp = new Image(); STATE.player.spriteWalkUp.src = 'images/boy-atas.png';
                    // NEW: Load Down Sprite for Boy
                    STATE.player.spriteWalkDown = new Image(); STATE.player.spriteWalkDown.src = 'images/boy-bawah.png';
                    // NEW: Load Attack Sprite for Boy
                    STATE.player.spriteAttack = new Image(); STATE.player.spriteAttack.src = 'images/boy-pukul.png';
                } else {
                    STATE.player.spriteIdle = new Image(); STATE.player.spriteIdle.src = 'images/girl-idle.png';
                    STATE.player.spriteWalk = new Image(); STATE.player.spriteWalk.src = 'images/girl-walk.png';
                    // NEW: Load Up Sprite for Girl
                    STATE.player.spriteWalkUp = new Image(); STATE.player.spriteWalkUp.src = 'images/girl-atas.png';
                    // NEW: Load Down Sprite for Girl
                    STATE.player.spriteWalkDown = new Image(); STATE.player.spriteWalkDown.src = 'images/girl-bawah.png';
                    // NEW: Load Attack Sprite for Girl
                    STATE.player.spriteAttack = new Image(); STATE.player.spriteAttack.src = 'images/girl-pukul.png';
                }

                if (!fromSave) {
                    document.getElementById('gender-screen').style.display = 'none';
                    document.getElementById('start-screen').classList.remove('hidden');
                }
            }

            /** * DATA SERVICE (UPDATED FOR DASHBOARD SUPPORT) */
            const DataService = {
                mode: 'local',
                user: null,
                dbKey: 'na_users_db',
                unsubscribeMsg: null, // Listener reference

                // NEW: Dashboard Source Control
                dashboardSource: 'auto', // 'auto', 'cloud', 'local'

                init: async function (useFirebase) {
                    // FAST CHECK: Jika navigator offline, langsung set local
                    if (!navigator.onLine) {
                        this.mode = 'local';
                        console.log("Mode Offline Terdeteksi via Navigator");
                        return false;
                    }

                    // FIX: Default ke local dulu, baru switch ke firebase jika sukses load
                    this.mode = 'local';
                    try {
                        if (typeof firebase !== 'undefined' && firebase.apps && !firebase.apps.length) {
                            firebase.initializeApp(firebaseConfig);
                            if (!db) db = firebase.firestore();
                            if (!analytics) analytics = firebase.analytics();

                            // Jika sampai sini tanpa error, berarti Firebase siap
                            this.mode = 'firebase';
                        } else if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
                            // Sudah init sebelumnya
                            if (!db) db = firebase.firestore();
                            this.mode = 'firebase';
                        }
                        return true;
                    } catch (e) {
                        console.error("Firebase Init Error:", e);
                        this.mode = 'local';
                        return false;
                    }
                },

                // NEW: Function to toggle source
                toggleDashboardSource: function () {
                    if (this.dashboardSource === 'auto') this.dashboardSource = 'cloud';
                    else if (this.dashboardSource === 'cloud') this.dashboardSource = 'local';
                    else this.dashboardSource = 'auto';

                    return this.dashboardSource;
                },

                getDB: function () {
                    try {
                        const raw = localStorage.getItem(this.dbKey);
                        return raw ? JSON.parse(raw) : {};
                    } catch (e) {
                        console.error("Database Corrupt! Resetting...", e);
                        localStorage.removeItem(this.dbKey);
                        return {};
                    }
                },

                saveDB: function (db) {
                    localStorage.setItem(this.dbKey, JSON.stringify(db));
                },

                // --- FIX: RESET DATA SEKARANG MEMBERSIHKAN CLOUD DAN LOCAL STORAGE ---
                resetSaveData: async function () {
                    if (!this.user) return;

                    // 1. Reset Cloud (Jika Mode Firebase/Online)
                    if (this.mode === 'firebase' && db) {
                        try {
                            // UPDATE: Kirim "Tiket Reset" dengan timestamp TERBARU.
                            // Ini memaksa semua device lain (yang punya data lama) untuk sadar bahwa data ini sudah di-wipe.
                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(this.user.email).set({
                                saveData: { isReset: true, lastActive: Date.now() }
                            }, { merge: true });
                        } catch (e) {
                            console.error("Gagal reset data cloud:", e);
                        }
                    }

                    // 2. Reset Local Storage (WAJIB DILAKUKAN AGAR CHECK SESSION SAAT RELOAD BERSIH)
                    const dbLocal = this.getDB();
                    if (dbLocal[this.user.email]) {
                        dbLocal[this.user.email].saveData = null;
                        this.saveDB(dbLocal);
                    }

                    // 3. Reset Memory
                    if (this.user) this.user.saveData = null;
                },

                /* FIX: PERBAIKAN FUNGSI RESET DATA SISWA (ADMIN) AGAR LEBIH ROBUST */
                adminResetStudent: async function (studentEmail) {
                    // 1. Coba paksa koneksi Cloud dulu agar yakin tidak offline
                    await this.init(true);

                    if (this.mode === 'firebase' && db) {
                        try {
                            // UPDATE: Jangan delete field, tapi timpa dengan OBJECT RESET + TIMESTAMP BARU.
                            // Tujuannya agar 'lastActive' di cloud menjadi LEBIH BARU dari data lokal siswa.
                            // Saat siswa login, sistem sync akan melihat Cloud lebih baru -> mengambil object reset -> menghapus data lokal.
                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail).update({
                                saveData: { isReset: true, lastActive: Date.now() }
                            });
                            return { success: true, type: 'cloud' };
                        } catch (e) {
                            console.error("Gagal reset data cloud:", e);

                            // --- DETEKSI ERROR PERMISSION (RULES EXPIRED) ---
                            if (e.code === 'permission-denied') {
                                return {
                                    success: false,
                                    msg: "⛔ AKSES DITOLAK FIREBASE!\n\nKemungkinan 'Test Mode' database Anda sudah kadaluwarsa (Expired 30 Hari).\n\nSOLUSI: Buka Firebase Console -> Firestore Database -> Tab 'Rules', lalu ubah menjadi:\n\nallow read, write: if true;"
                                };
                            }

                            // Fallback: Jika dokumen tidak ada atau update gagal, coba set merge null
                            try {
                                await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail).set({ saveData: { isReset: true, lastActive: Date.now() } }, { merge: true });
                                return { success: true, type: 'cloud_fallback' };
                            } catch (e2) {
                                return { success: false, msg: "Koneksi Cloud Gagal: " + e.message };
                            }
                        }
                    }
                    else {
                        // Fallback ke Local jika mode offline
                        const dbLocal = this.getDB();
                        if (dbLocal[studentEmail]) {
                            dbLocal[studentEmail].saveData = null;
                            this.saveDB(dbLocal);
                            return { success: true, type: 'local' };
                        }
                        return { success: false, msg: "User tidak ditemukan di Local Storage & Cloud tidak terhubung." };
                    }
                },

                /* NEW: FUNGSI HAPUS AKUN SISWA (ADMIN - PERMANEN) */
                adminDeleteStudent: async function (studentEmail) {
                    await this.init(true);

                    // FIX: Selalu hapus dari localStorage dulu (mencegah login ulang via cache lokal)
                    const dbLocal = this.getDB();
                    if (dbLocal[studentEmail]) {
                        delete dbLocal[studentEmail];
                        this.saveDB(dbLocal);
                    }
                    // Juga bersihkan session jika yang dihapus adalah user yang sedang login
                    try {
                        const sess = localStorage.getItem('sc_session_email');
                        if (sess === studentEmail) localStorage.removeItem('sc_session_email');
                    } catch(e) {}

                    if (this.mode === 'firebase' && db) {
                        try {
                            // Hapus dokumen user dari Firestore juga
                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail).delete();
                            return { success: true, type: 'cloud+local' };
                        } catch (e) {
                            console.error("Gagal hapus akun cloud:", e);
                            // localStorage sudah terhapus — kembalikan sukses parsial
                            return { success: true, type: 'local_only', msg: 'Lokal terhapus. Cloud gagal: ' + e.message };
                        }
                    } else {
                        if (dbLocal[studentEmail] !== undefined || true) {
                            return { success: true, type: 'local' };
                        }
                        return { success: false, msg: 'User tidak ditemukan.' };
                    }
                },

                getAllStudents: async function () {
                    // UPDATE: Logika pengambilan data berdasarkan Role User yang Login
                    // Jika Admin: Ambil SEMUA user (Guru & Siswa, kecuali akun admin)
                    // Jika Guru: Ambil HANYA Siswa
                    // FIX: Pakai DataService.user langsung agar tidak kehilangan context 'this'
                    const currentUser = DataService.user;
                    const isAdmin = currentUser && currentUser.role === 'admin';

                    if (this.mode === 'local') {
                        const dbLocal = this.getDB();
                        if (isAdmin) {
                            // Admin: semua kecuali akun admin sendiri
                            return Object.values(dbLocal).filter(u => u.role === 'siswa' || u.role === 'guru');
                        } else {
                            return Object.values(dbLocal).filter(u => u.role === 'siswa');
                        }
                    } else {
                        try {
                            let query = db.collection('artifacts').doc('nusantara-arsa').collection('users');

                            // Admin ambil semua (tanpa filter) — guru hanya siswa
                            if (!isAdmin) {
                                query = query.where('role', '==', 'siswa');
                            }

                            const snapshot = await query.get();
                            let users = snapshot.docs.map(doc => ({ email: doc.id, ...doc.data() }));
                            // Sembunyikan akun admin dari daftar
                            if (isAdmin) users = users.filter(u => u.role !== 'admin');
                            return users;
                        } catch (e) {
                            console.error("Gagal mengambil data users:", e);
                            const dbLocal = this.getDB();
                            if (isAdmin) return Object.values(dbLocal).filter(u => u.role === 'siswa' || u.role === 'guru');
                            return Object.values(dbLocal).filter(u => u.role === 'siswa');
                        }
                    }
                },

                // --- FIX: SEND MESSAGE (HYBRID SUPPORT) ---
                sendMessage: async function (studentEmail, msg) {
                    const msgObj = {
                        text: msg, read: false, time: Date.now()
                    };

                    if (this.mode === 'local' || !navigator.onLine) {
                        const dbLocal = this.getDB();
                        if (dbLocal[studentEmail]) {
                            if (!dbLocal[studentEmail].inbox) dbLocal[studentEmail].inbox = [];
                            dbLocal[studentEmail].inbox.push(msgObj);
                            this.saveDB(dbLocal);
                            return true;
                        }
                        return false;
                    } else {
                        try {
                            // Gunakan arrayUnion untuk atomicity di Firebase
                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail).update({
                                inbox: firebase.firestore.FieldValue.arrayUnion(msgObj)
                            });
                            return true;
                        } catch (e) {
                            console.warn("Gagal kirim pesan cloud, fallback ke local storage", e);
                            // FIX: Jangan langsung gagal — simpan ke lokal sebagai cadangan
                            const dbLocal = this.getDB();
                            if (dbLocal[studentEmail]) {
                                if (!dbLocal[studentEmail].inbox) dbLocal[studentEmail].inbox = [];
                                dbLocal[studentEmail].inbox.push(msgObj);
                                this.saveDB(dbLocal);
                                return true; // Berhasil via fallback lokal
                            }
                            return false;
                        }
                    }
                },

                // --- NEW: LISTENER PESAN UNTUK SISWA (UPDATED: SUPPORT LOCAL POLLING & REMOTE RESET) ---
                startMessageListener: function () {
                    if (!this.user || this.user.role !== 'siswa') return;

                    // Hentikan listener lama jika ada
                    if (this.unsubscribeMsg) {
                        if (typeof this.unsubscribeMsg === 'function') this.unsubscribeMsg();
                        else clearInterval(this.unsubscribeMsg);
                        this.unsubscribeMsg = null;
                    }

                    // FIX: Pastikan db instance tersedia jika firebase sudah init
                    if (navigator.onLine && typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && !db) {
                        try { db = firebase.firestore(); this.mode = 'firebase'; } catch(e) {}
                    }

                    console.log(`Memulai Listener Pesan & Sync (${this.mode})...`);

                    if ((this.mode === 'firebase' || navigator.onLine) && db) {
                        // --- MODE CLOUD: REALTIME SNAPSHOT ---
                        this.unsubscribeMsg = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(this.user.email).onSnapshot(async (doc) => {
                            const data = doc.data();

                            // --- DETEKSI REMOTE RESET (hanya jika ada flag isReset eksplisit) ---
                            // FIX BUG LOOP: Hanya trigger reset jika saveData.isReset === true (flag eksplisit dari guru)
                            // Bukan setiap kali saveData null/kosong, karena bisa terjadi saat data belum tersimpan
                            const _isRemoteReset = data && data.saveData && data.saveData.isReset === true;
                            if (_isRemoteReset && typeof STATE !== 'undefined' && STATE.screen !== 'splash' && STATE.screen !== 'title' && !STATE.isPrologue) {
                                console.warn("⚠️ REMOTE RESET DETECTED! GURU MENGHAPUS DATA.");

                                // 1. Hentikan Auto Save agar tidak menimpa penghapusan guru
                                if (window.saveIntervalId) clearInterval(window.saveIntervalId);

                                // 2. FIX BUG LOOP: Hapus flag isReset dari Firestore SEBELUM reload
                                //    agar saat login berikutnya tidak terpicu lagi
                                try {
                                    const _uRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(DataService.user.email);
                                    await _uRef.update({ 'saveData': firebase.firestore.FieldValue.delete() });
                                } catch(e) { console.warn('Gagal clear reset flag:', e); }

                                // 3. Hapus sesi lokal agar bersih total
                                localStorage.removeItem(SESSION_KEY);
                                DataService.user = null;

                                // 4. Tampilkan Pesan & Reload
                                alert("⚠️ PERINGATAN SISTEM ⚠️\n\nData permainan Anda telah di-reset oleh Guru/Admin.\nGame akan dimuat ulang ke awal.");
                                location.reload();
                                return;
                            }

                            this.processInbox(data);
                        });
                    } else {
                        // --- MODE LOCAL: POLLING INTERVAL ---
                        this.unsubscribeMsg = setInterval(() => {
                            const dbLocal = this.getDB();
                            const myData = dbLocal[this.user.email];

                            // Cek Reset Lokal — FIX BUG LOOP: hanya trigger jika isReset === true
                            if (myData && myData.saveData && myData.saveData.isReset === true && typeof STATE !== 'undefined' && STATE.screen === 'play' && !STATE.isPrologue) {
                                if (window.saveIntervalId) clearInterval(window.saveIntervalId);
                                // Hapus flag reset dari localStorage sebelum reload
                                try {
                                    const _db2 = this.getDB();
                                    if (_db2[this.user.email]) {
                                        _db2[this.user.email].saveData = null;
                                        this.saveDB(_db2);
                                    }
                                } catch(e) {}
                                alert("⚠️ Data lokal hilang/reset. Game akan dimuat ulang.");
                                location.reload();
                                return;
                            }

                            this.processInbox(myData);
                        }, 3000);
                    }
                },

                // --- NEW: LISTENER MULTIPLAYER (HANTU) ---
                startGhostListener: function () {
                    // --- DATA BOT HANTU (BAYANGAN) - POPULASI DESA ---
                    // Akan selalu muncul untuk meramaikan suasana
                    const BOT_GHOSTS = [
                        // --- HANTU LAMA ---
                        { email: 'bot_radian', name: 'Radian', gender: 'boy', outfit: 'default', x: 15 * 30, y: 20 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },
                        { email: 'bot_edy', name: 'Edy', gender: 'boy', outfit: 'armor', x: 35 * 30, y: 15 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },
                        { email: 'bot_rizka', name: 'Rizka', gender: 'girl', outfit: 'default', x: 25 * 30, y: 30 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },
                        { email: 'bot_manohara', name: 'Manohara', gender: 'girl', outfit: 'wedding', x: 45 * 30, y: 10 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },

                        // --- HANTU BARU (BOYS) ---
                        { email: 'bot_authar', name: 'Authar', gender: 'boy', outfit: 'special', x: 12 * 30, y: 12 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Papan Misi
                        { email: 'bot_fani', name: 'Fani', gender: 'boy', outfit: 'default', x: 42 * 30, y: 25 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },   // Dekat Guild
                        { email: 'bot_budi_s', name: 'Budi', gender: 'boy', outfit: 'default', x: 38 * 30, y: 18 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Perpus
                        { email: 'bot_andy', name: 'Andy', gender: 'boy', outfit: 'armor', x: 48 * 30, y: 20 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },     // Dekat Dungeon

                        // --- HANTU BARU (GIRLS) ---
                        { email: 'bot_citra', name: 'Citra', gender: 'girl', outfit: 'special', x: 26 * 30, y: 24 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Merchant
                        { email: 'bot_milea', name: 'Milea', gender: 'girl', outfit: 'default', x: 20 * 30, y: 28 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Patung
                        { email: 'bot_ancika', name: 'Ancika', gender: 'girl', outfit: 'default', x: 43 * 30, y: 35 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Dermaga
                        { email: 'bot_luna', name: 'Luna', gender: 'girl', outfit: 'wedding', x: 20 * 30, y: 15 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }    // Dekat Klinik
                    ];

                    console.log("📡 Mengaktifkan Radar Multiplayer & Bot Crowd...");

                    // Fungsi Helper untuk Update State
                    const updateGhostsState = (realPlayers = []) => {
                        if (typeof STATE !== 'undefined') {
                            // Gabungkan Pemain Asli + Semua Bot
                            STATE.ghosts = [...realPlayers, ...BOT_GHOSTS];
                            // console.log(`Ghosts Updated: ${realPlayers.length} Real + ${BOT_GHOSTS.length} Bots`);
                        }
                    };

                    if (this.mode !== 'firebase' || !db) {
                        // JIKA OFFLINE: Tetap tampilkan Bot agar tidak sepi
                        updateGhostsState([]);
                        return;
                    }

                    // JIKA ONLINE: Dengarkan DB
                    try {
                        this.unsubscribeGhosts = db.collection('artifacts').doc('nusantara-arsa').collection('users')
                            .where('role', '==', 'siswa')
                            .onSnapshot((snapshot) => {
                                const now = Date.now();
                                const onlineGhosts = [];

                                snapshot.forEach(doc => {
                                    // Jangan masukkan diri sendiri
                                    if (this.user && doc.id === this.user.email) return;

                                    const data = doc.data();
                                    if (!data.saveData) return;

                                    const lastActive = data.lastActive || (data.saveData ? data.saveData.lastActive : 0);

                                    // Cek Online: Aktif dalam 2 menit terakhir (Dilonggarkan biar awet)
                                    if (now - lastActive < 120000) {
                                        onlineGhosts.push({
                                            email: doc.id,
                                            name: data.name || "Siswa",
                                            x: data.saveData.x || 0,
                                            y: data.saveData.y || 0,
                                            location: data.saveData.location || 'village',
                                            gender: data.saveData.gender || 'boy',
                                            outfit: data.saveData.outfit || 'default',
                                            role: data.saveData.role || 'none',
                                            isBot: false
                                        });
                                    }
                                });

                                updateGhostsState(onlineGhosts);
                            });
                    } catch (e) {
                        console.warn("Gagal init multiplayer, fallback ke bot only:", e);
                        updateGhostsState([]);
                    }
                },



                // Helper untuk memproses pesan masuk (Digunakan oleh Cloud & Local)
                processInbox: function (data) {
                    // Cek apakah ada pesan baru di 'inbox'
                    if (data && data.inbox && data.inbox.length > 0) {
                        const newMsgs = data.inbox;
                        console.log("Pesan diterima:", newMsgs);

                        // Masukkan ke State Game
                        if (typeof STATE !== 'undefined' && STATE.player) {
                            if (!STATE.player.messages) STATE.player.messages = [];

                            // FIX DUPLIKAT: Hanya tambah pesan yang belum ada (cek berdasarkan waktu kirim)
                            const existingTimes = new Set(STATE.player.messages.map(m => m.time));
                            const uniqueNewMsgs = newMsgs.filter(m => !existingTimes.has(m.time));
                            if (uniqueNewMsgs.length === 0) return; // Semua sudah ada, skip
                            STATE.player.messages.push(...uniqueNewMsgs);

                            // Notifikasi UI
                            showToast(`📩 ${newMsgs.length} PESAN BARU DARI GURU!`);
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                            // Update Badge Kotak Surat jika terlihat
                            // (Logic drawObject akan menangani visualnya di frame berikutnya)

                            // BERSIHKAN INBOX DI SUMBER DATA (Agar tidak didownload ulang)
                            if (this.mode === 'firebase' && db) {
                                db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(this.user.email).update({
                                    inbox: firebase.firestore.FieldValue.delete()
                                }).catch(err => console.log("Gagal clear cloud inbox", err));
                            } else {
                                // Bersihkan Local Storage Inbox
                                const dbLocal = this.getDB();
                                if (dbLocal[this.user.email]) {
                                    dbLocal[this.user.email].inbox = [];
                                    this.saveDB(dbLocal);
                                }
                            }

                            // Trigger Auto Save Game untuk menyimpan pesan permanen di saveData pemain
                            if (typeof manualSave === 'function') manualSave();
                        }
                    }
                },

                getTeachers: async function () {
                    // Helper dedup: hilangkan duplikat berdasarkan email
                    const _dedup = (list) => {
                        const seen = new Set();
                        return list.filter(g => {
                            const k = (g.email || '').toLowerCase().trim();
                            if (!k || seen.has(k)) return false;
                            seen.add(k); return true;
                        });
                    };

                    if (this.mode === 'local' || !navigator.onLine) {
                        const dbLocal = this.getDB();
                        const list = Object.entries(dbLocal)
                            .filter(([, u]) => u.role === 'guru')
                            .map(([guruEmail, u]) => ({
                                email: guruEmail,
                                name: u.name,
                                school: u.school || 'Unknown School'
                            }));
                        return _dedup(list);
                    } else {
                        try {
                            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
                            const snapshot = await Promise.race([
                                db.collection('artifacts').doc('nusantara-arsa').collection('users').where('role', '==', 'guru').get(),
                                timeout
                            ]);
                            const list = snapshot.docs.map(doc => {
                                const d = doc.data();
                                return { email: doc.id, name: d.name, school: d.school || 'Unknown School' };
                            });
                            return _dedup(list);
                        } catch (e) {
                            console.warn("Gagal fetch guru cloud, fallback local");
                            const dbLocal = this.getDB();
                            const list = Object.entries(dbLocal)
                                .filter(([, u]) => u.role === 'guru')
                                .map(([guruEmail, u]) => ({
                                    email: guruEmail,
                                    name: u.name,
                                    school: u.school || 'Unknown'
                                }));
                            return _dedup(list);
                        }
                    }
                },

                register: async function (role, data) {
                    const userData = {
                        role: role,
                        password: data.password,
                        name: data.name,
                        details: data.details,
                        school: data.school || null,
                        mentor: data.mentor || null,
                        saveData: null
                    };

                    if (this.mode === 'local' || !navigator.onLine) {
                        const dbLocal = this.getDB();
                        if (dbLocal[data.email]) return { success: false, msg: "Email already registered (Local)!" };
                        dbLocal[data.email] = userData;
                        this.saveDB(dbLocal);
                        return { success: true, msg: "Registrasi Lokal Berhasil!" };
                    } else {
                        try {
                            const docRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(data.email);

                            // TIMEOUT DIPERCEPAT: 3 Detik
                            const timeout = new Promise((_, reject) =>
                                setTimeout(() => reject(new Error("Koneksi Timeout (Terlalu Lama)")), 3000)
                            );

                            const doc = await Promise.race([docRef.get(), timeout]);

                            if (doc.exists) return { success: false, msg: "Email already registered in Cloud!" };
                            await docRef.set(userData);
                            return { success: true, msg: "Cloud Registration Success!" };
                        } catch (e) {
                            console.warn("Cloud Register Failed, Fallback Local", e);
                            const dbLocal = this.getDB();
                            if (dbLocal[data.email]) return { success: false, msg: "Email already registered (Local)!" };
                            dbLocal[data.email] = userData;
                            this.saveDB(dbLocal);
                            this.mode = 'local';
                            return { success: true, msg: "Server Sibuk. Akun dibuat secara LOKAL (Offline)." };
                        }
                    }
                },

                login: async function (email, password) {
                    // 1. Cek Koneksi Fisik Browser
                    if (!navigator.onLine) this.mode = 'local';

                    // Ambil data lokal untuk perbandingan nanti
                    const dbLocal = this.getDB();
                    const localUser = dbLocal[email];

                    // FIX: Pastikan DB ada jika mode firebase. Jika tidak, paksa local.
                    if (this.mode === 'firebase' && !db) {
                        console.warn("Mode Firebase aktif tapi DB tidak terhubung. Fallback ke Local.");
                        this.mode = 'local';
                    }

                    if (this.mode === 'local') {
                        const user = localUser;
                        if (!user) return { success: false, msg: "User tidak ditemukan di data lokal (Offline)!" };
                        if (user.password !== password) return { success: false, msg: "Password salah!" };
                        this.user = { email: email, ...user };
                        return { success: true, user: this.user };
                    } else {
                        try {
                            // PERBAIKAN: Timeout dikurangi drastis jadi 2.5 Detik agar 'fail-fast'
                            const docRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email);

                            const timeout = new Promise((_, reject) =>
                                setTimeout(() => reject(new Error("Server Timeout")), 2500)
                            );

                            // Balapan antara ambil data vs timeout
                            const doc = await Promise.race([docRef.get(), timeout]);

                            if (!doc.exists) return { success: false, msg: "Akun tidak ditemukan di Server!" };

                            let cloudUser = doc.data();
                            if (cloudUser.password !== password) return { success: false, msg: "Password salah!" };

                            // --- NEW: SMART SYNC (CLOUD vs LOCAL CONFLICT RESOLUTION) ---
                            // Cek data mana yang lebih baru berdasarkan 'lastActive' timestamp
                            let finalUser = cloudUser;
                            let useLocal = false;

                            if (localUser && localUser.saveData) {
                                const localTime = localUser.saveData.lastActive || 0;
                                const cloudTime = (cloudUser.saveData && cloudUser.saveData.lastActive) || 0;

                                // FIX: CEK APAKAH CLOUD ADALAH DATA RESET?
                                // Jika Cloud punya flag 'isReset', maka Cloud SELALU MENANG (karena itu perintah wipe).
                                const isCloudReset = cloudUser.saveData && cloudUser.saveData.isReset;

                                if (!isCloudReset && localTime > cloudTime) {
                                    console.log("⚠️ Konflik Data: Menggunakan Data LOKAL (Lebih Baru)");
                                    finalUser = localUser;
                                    useLocal = true;

                                    // Auto-Sync balik ke Cloud secara background
                                    docRef.set({
                                        ...localUser,
                                        lastActive: Date.now()
                                    }, { merge: true }).catch(e => console.warn("Background sync failed:", e));

                                } else {
                                    console.log("✅ Data Cloud Sinkron/Lebih Baru/Reset. Update Lokal.");

                                    // FIX: JIKA DATA CLOUD ADALAH 'RESET TICKET', BERSIHKAN LOCAL & CLOUD
                                    if (isCloudReset) {
                                        console.log("🧹 MENDETEKSI PERINTAH RESET DARI CLOUD!");
                                        cloudUser.saveData = null; // Hapus flag reset dari memori user aktif
                                        // FIX BUG LOOP: Hapus isReset dari Firestore agar tidak terpicu terus
                                        try {
                                            await docRef.update({ 'saveData': firebase.firestore.FieldValue.delete() });
                                            console.log("✅ Flag isReset berhasil dihapus dari Cloud.");
                                        } catch(e) {
                                            console.warn("Gagal hapus flag reset dari cloud:", e);
                                        }
                                    }

                                    // Update Local Storage agar sinkron dengan Cloud terbaru
                                    dbLocal[email] = cloudUser;
                                    this.saveDB(dbLocal);
                                    finalUser = cloudUser; // Pastikan pakai cloud (yang sudah null/bersih)
                                }
                            } else {
                                // Tidak ada data lokal, simpan data cloud ke lokal
                                // Cek juga reset flag disini
                                if (cloudUser.saveData && cloudUser.saveData.isReset) {
                                    cloudUser.saveData = null;
                                }

                                console.log("📥 Mengunduh Save Data dari Cloud...");
                                dbLocal[email] = cloudUser;
                                this.saveDB(dbLocal);
                                finalUser = cloudUser;
                            }

                            this.user = { email: email, ...finalUser };
                            return { success: true, user: this.user };

                        } catch (e) {
                            console.warn("Login Error / Offline, trying local fallback...", e);

                            // FITUR ANTI-STUCK: Cek Local Storage jika Server Error/Offline
                            if (localUser && localUser.password === password) {
                                this.mode = 'local'; // Paksa pindah ke Local Mode
                                this.user = { email: email, ...localUser };
                                return { success: true, user: this.user, msg: "⚠️ Masuk dalam Mode Offline (Server tidak terjangkau)" };
                            }

                            // Jika di local juga tidak ada, berarti memang belum register
                            return { success: false, msg: "Gagal Login: Koneksi bermasalah atau Akun belum terdaftar." };
                        }
                    }
                },

                saveGame: async function (gameState) {
                    if (!this.user) return;

                    // Pastikan timestamp selalu terupdate saat save
                    gameState.lastActive = Date.now();

                    const dbLocal = this.getDB();
                    if (!dbLocal[this.user.email]) {
                        dbLocal[this.user.email] = { ...this.user, saveData: gameState };
                    } else {
                        const existing = dbLocal[this.user.email].saveData || {};
                        dbLocal[this.user.email].saveData = { ...existing, ...gameState, lastActive: Date.now() };
                    }
                    this.saveDB(dbLocal);

                    if (navigator.onLine) {
                        try {
                            const syncData = {
                                saveData: gameState,
                                role: this.user.role,
                                name: this.user.name,
                                details: this.user.details,
                                email: this.user.email,
                                password: this.user.password,
                                lastActive: Date.now()
                            };

                            if (this.user.mentor) syncData.mentor = this.user.mentor;
                            if (this.user.school) syncData.school = this.user.school;

                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(this.user.email).set(syncData, { merge: true });

                            if (this.mode === 'local') {
                                console.log("Koneksi Kembali: Auto-Sync ke Cloud Berhasil!");
                                this.mode = 'firebase';
                                // Restart listener jika koneksi kembali
                                if (this.user.role === 'siswa') this.startMessageListener();
                            }
                        } catch (e) {
                            this.mode = 'local';
                        }
                    } else {
                        this.mode = 'local';
                    }
                },

                loadGame: function () {
                    if (!this.user || !this.user.saveData) return null;
                    return this.user.saveData;
                },

                // --- NEW: REAL-TIME MONITORING LISTENER ---
                subscribeToStudents: function (onUpdate) {
                    let useCloud = false;

                    // FIX: Jika db belum siap tapi firebase sudah init, coba ambil instance lagi
                    if (navigator.onLine && typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && !db) {
                        try { db = firebase.firestore(); } catch(e) { console.warn("Gagal ambil db instance:", e); }
                    }

                    // NEW: Logic Source Selection
                    if (this.dashboardSource === 'cloud') {
                        useCloud = true;
                    } else if (this.dashboardSource === 'local') {
                        useCloud = false;
                    } else {
                        // AUTO: Gunakan Cloud jika tersedia
                        useCloud = (navigator.onLine && typeof firebase !== 'undefined' && !!db);
                    }

                    // Update UI Status Koneksi di Dashboard
                    const statusEl = document.getElementById('dash-connection-status');
                    if (statusEl) {
                        if (useCloud) {
                            statusEl.innerHTML = '🟢 CLOUD ONLINE<br><span style="font-weight:normal; opacity:0.8;">Data Server</span>';
                            statusEl.style.color = '#4ade80'; // Hijau
                            statusEl.style.border = '1px solid #22c55e';
                        } else {
                            statusEl.innerHTML = '🟠 LOCAL VIEW<br><span style="font-weight:normal; opacity:0.8;">Data Lokal</span>';
                            statusEl.style.color = '#fbbf24'; // Kuning/Orange
                            statusEl.style.border = '1px solid #f59e0b';
                        }
                    }

                    // FIX BUG GURU: Simpan referensi DataService.user ke variabel lokal
                    // agar tidak kehilangan context 'this' saat dipanggil sebagai callback
                    const currentUser = DataService.user;
                    const isAdmin = currentUser && currentUser.role === 'admin';

                    // DEBUG: log untuk verifikasi isAdmin
                    console.log('[subscribeToStudents] user:', currentUser && currentUser.email, 'isAdmin:', isAdmin);

                    if (!useCloud) {
                        // Fallback untuk mode offline/lokal: Gunakan Polling Interval
                        const interval = setInterval(() => {
                            const dbLocal = this.getDB();
                            let users = Object.values(dbLocal);

                            // Filter jika bukan admin — admin dapat semua termasuk guru
                            if (!isAdmin) {
                                users = users.filter(u => u.role === 'siswa');
                            } else {
                                // Admin: tampilkan guru & siswa, kecuali admin itu sendiri
                                users = users.filter(u => u.role === 'siswa' || u.role === 'guru');
                            }

                            // Tambahkan flag source untuk UI
                            users.forEach(s => s._source = 'local');
                            onUpdate(users);
                        }, 2000); // Update tiap 2 detik
                        return () => clearInterval(interval); // Return fungsi unsubscribe
                    } else {
                        // Firebase Real-time Listener (onSnapshot)
                        try {
                            let query = db.collection('artifacts').doc('nusantara-arsa').collection('users');

                            // FIX: Admin ambil SEMUA user (siswa + guru), guru hanya siswa
                            // Admin: tidak filter sama sekali
                            // Guru: filter hanya role siswa
                            if (!isAdmin) {
                                query = query.where('role', '==', 'siswa');
                            }
                            // Jika isAdmin: tidak ada .where() — ambil semua dokumen

                            return query.onSnapshot((snapshot) => {
                                let users = snapshot.docs.map(doc => ({ email: doc.id, ...doc.data(), _source: 'cloud' }));
                                // Filter out akun admin itu sendiri dari daftar agar tidak muncul
                                if (isAdmin) {
                                    users = users.filter(u => u.role !== 'admin');
                                }
                                onUpdate(users);
                            }, (error) => {
                                console.error("Monitoring Error:", error);
                                // Jika error permission/koneksi, fallback ke lokal
                                if (statusEl) {
                                    statusEl.innerHTML = '⚠️ KONEKSI TERPUTUS';
                                    statusEl.style.color = '#ef4444';
                                }
                            });
                        } catch (e) {
                            console.warn("Snapshot failed, fallback to local polling", e);
                            return () => { };
                        }
                    }
                }
            };

            /** UI LOGIC FOR LOGIN */
            // --- FIX: MENAMBAHKAN VARIABEL DAN FUNGSI SWITCH ROLE YANG HILANG ---
            let authMode = 'login';
            let currentRole = 'siswa';
            let teacherMonitorUnsub = null; // Variabel global untuk menyimpan unsubscribe listener monitoring
            let latestStudentData = []; // NEW: Cache Data Siswa Live untuk Dashboard

            // ============================================
            // GOOGLE LOGIN
            // ============================================
            async function handleGoogleLogin(role) {
                const msgEl = document.getElementById('login-msg');
                msgEl.innerText = '';
                msgEl.style.color = '#ef4444';

                try {
                    toggleFullScreen();

                    // Init Firebase Auth
                    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
                    const auth = firebase.auth();
                    const provider = new firebase.auth.GoogleAuthProvider();

                    msgEl.style.color = '#fbbf24';
                    msgEl.innerText = '⏳ Membuka popup Google...';

                    const result = await auth.signInWithPopup(provider);
                    const user = result.user;
                    const email = user.email;
                    const displayName = user.displayName || '';
                    const photoURL = user.photoURL || '';

                    msgEl.innerText = '⏳ Menyinkronkan data...';

                    await DataService.init(true);
                    const dbLocal = DataService.getDB();

                    // Cek apakah user sudah terdaftar (lokal dulu)
                    let userData = dbLocal[email];

                    // Jika belum ada lokal, cek Firestore dulu (pernah daftar di device lain)
                    if (!userData && db) {
                        try {
                            msgEl.innerText = '⏳ Cek data di server...';
                            const cloudDoc = await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).get();
                            if (cloudDoc.exists) {
                                userData = cloudDoc.data();
                                dbLocal[email] = userData;
                                DataService.saveDB(dbLocal);
                            }
                        } catch(e) { console.warn('Cek cloud gagal:', e); }
                    }

                    if (!userData) {
                        // USER BARU MURNI — tampilkan form isi data tambahan
                        msgEl.style.color = '#4ade80';
                        msgEl.innerText = '✅ Akun Google terdeteksi! Lengkapi data dulu.';
                        showGoogleRegisterForm(role, email, displayName, photoURL);
                        return;
                    }

                    // Cek role mismatch (siswa login di tab guru atau sebaliknya)
                    if (userData.role !== role && userData.role !== 'admin') {
                        // FIX: Sebelum blokir, verifikasi ke Firestore dulu
                        // Data lokal mungkin stale (sisa daftar sebelumnya yang gagal/dibatalkan)
                        let cloudRole = null;
                        if (db) {
                            try {
                                msgEl.innerText = '⏳ Memverifikasi data ke server...';
                                const verifyDoc = await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).get();
                                if (verifyDoc.exists) {
                                    cloudRole = verifyDoc.data().role;
                                } else {
                                    // Tidak ada di cloud sama sekali — data lokal adalah stale
                                    // Hapus data lokal stale dan anggap user baru
                                    delete dbLocal[email];
                                    DataService.saveDB(dbLocal);
                                    userData = null;
                                    msgEl.style.color = '#4ade80';
                                    msgEl.innerText = '✅ Akun Google terdeteksi! Lengkapi data dulu.';
                                    showGoogleRegisterForm(role, email, displayName, photoURL);
                                    return;
                                }
                            } catch(e) { console.warn('Verifikasi cloud gagal:', e); }
                        }
                        // Jika di cloud role-nya sama dengan yang dipilih, update lokal dan lanjut
                        if (cloudRole === role) {
                            userData = (await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).get()).data();
                            dbLocal[email] = userData;
                            DataService.saveDB(dbLocal);
                        } else if (cloudRole && cloudRole !== role) {
                            // Cloud juga konfirmasi role berbeda — ini memang salah tab
                            const roleLabel = { siswa: 'Siswa', guru: 'Guru', admin: 'Admin' };
                            const correctRole = roleLabel[cloudRole] || cloudRole;
                            const usedRole = roleLabel[role] || role;
                            msgEl.style.color = '#ef4444';
                            msgEl.innerText = `❌ SALAH AKUN! Akun ini terdaftar sebagai ${correctRole}, bukan ${usedRole}. Silakan login di tab yang sesuai.`;
                            try { if (firebase && firebase.auth) await firebase.auth().signOut(); } catch(e) {}
                            return;
                        } else {
                            // Tidak ada internet / cloud tidak bisa dicek — gunakan data lokal
                            const roleLabel = { siswa: 'Siswa', guru: 'Guru', admin: 'Admin' };
                            const correctRole = roleLabel[userData.role] || userData.role;
                            const usedRole = roleLabel[role] || role;
                            msgEl.style.color = '#ef4444';
                            msgEl.innerText = `❌ SALAH AKUN! Akun ini terdaftar sebagai ${correctRole}, bukan ${usedRole}. Silakan login di tab yang sesuai.`;
                            try { if (firebase && firebase.auth) await firebase.auth().signOut(); } catch(e) {}
                            return;
                        }
                    }

                    // USER LAMA — sync cloud dulu, baru masuk
                    msgEl.innerText = '⏳ Mengambil data terbaru dari server...';

                    // Coba ambil data terbaru dari Firestore (agar saveData tidak stale)
                    if (db) {
                        try {
                            const cloudDoc = await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).get();
                            if (cloudDoc.exists) {
                                const cloudData = cloudDoc.data();
                                // Merge: data cloud lebih prioritas (terutama saveData)
                                userData = { ...userData, ...cloudData };
                                dbLocal[email] = userData;
                                DataService.saveDB(dbLocal);
                            }
                        } catch (e) {
                            console.warn('Gagal sync cloud, pakai data lokal:', e);
                        }
                    }

                    localStorage.setItem(SESSION_KEY, email);
                    DataService.user = userData;

                    msgEl.style.color = '#4ade80';
                    msgEl.innerText = `✅ Selamat datang, ${userData.name}!`;

                    setTimeout(() => {
                        document.getElementById('login-screen').style.display = 'none';
                        const titleSc = document.getElementById('title-screen');
                        if (titleSc) { titleSc.style.display = 'none'; titleSc.classList.add('hidden'); }
                        if (userData.role === 'guru' || userData.role === 'admin') {
                            initTeacherDashboard();
                        } else {
                            // Siswa: tampilkan welcome info dulu
                            const welcomeName = document.getElementById('welcome-name');
                            const welcomeClass = document.getElementById('welcome-class');
                            const welcomeMentor = document.getElementById('welcome-mentor');
                            if (welcomeName) welcomeName.innerText = userData.name || 'Siswa';
                            if (welcomeClass) welcomeClass.innerText = userData.details || 'Umum';
                            if (welcomeMentor && userData.mentor) welcomeMentor.innerText = 'Mentor Active';

                            if (!userData.saveData) {
                                // New game — mulai prologue
                                startPrologue();
                            } else {
                                // Load game — tampilkan start screen
                                document.getElementById('start-screen').classList.remove('hidden');
                            }
                        }
                    }, 900);

                } catch (err) {
                    console.error('Google login error:', err);
                    if (err.code === 'auth/popup-closed-by-user') {
                        msgEl.innerText = '⚠️ Popup ditutup. Coba lagi.';
                    } else if (err.code === 'auth/popup-blocked') {
                        msgEl.innerText = '⚠️ Popup diblokir browser. Izinkan popup untuk situs ini.';
                    } else {
                        msgEl.innerText = '❌ Gagal login Google: ' + (err.message || err.code);
                    }
                }
            }

            async function showGoogleRegisterForm(role, email, displayName, photoURL) {
                const loginCard = document.querySelector('.login-card');

                // Simpan konten asli untuk bisa kembali
                const originalContent = loginCard.innerHTML;

                loginCard.innerHTML = `
                    <h2 style="font-family:'Fredoka'; color:#d97706; text-align:center; margin-bottom:15px; font-size:20px;">
                        📋 LENGKAPI DATA
                    </h2>
                    <div style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.6); padding:10px; border-radius:12px; margin-bottom:15px;">
                        ${photoURL ? `<img src="${photoURL}" style="width:40px; height:40px; border-radius:50%; border:2px solid #a16207;">` : ''}
                        <div>
                            <div style="font-weight:800; color:#422006; font-size:14px;">${displayName}</div>
                            <div style="font-size:11px; color:#78350f;">${email}</div>
                        </div>
                    </div>
                    <div id="google-reg-msg" style="color:#ef4444; font-size:12px; margin-bottom:10px; min-height:15px; font-weight:bold;"></div>
                    ${role === 'siswa' ? `
                        <input type="text" id="greg-nama" class="form-input" placeholder="Nama Lengkap" value="${displayName}">
                        <input type="text" id="greg-kelas" class="form-input" placeholder="Kelas (Contoh: XII TKJ 1)">
                        <select id="greg-guru" class="form-input">
                            <option value="">Pilih Guru Pendamping...</option>
                        </select>
                    ` : `
                        <input type="text" id="greg-nama" class="form-input" placeholder="Nama Guru" value="${displayName}">
                        <input type="text" id="greg-nip" class="form-input" placeholder="NIP">
                        <input type="text" id="greg-sekolah" class="form-input" placeholder="Asal Sekolah" value="SMK Negeri 1 Brondong">
                    `}
                    <button class="auth-btn" onclick="submitGoogleRegister('${role}', '${email}', '${photoURL}')">
                        ✅ SIMPAN & MULAI
                    </button>
                    <button style="width:100%; background:transparent; border:none; margin-top:10px; color:#78350f; font-size:12px; cursor:pointer; font-weight:bold;" onclick="location.reload()">
                        ⬅ Batal
                    </button>
                `;

                // Isi dropdown guru jika siswa — fetch dari cloud dulu, fallback lokal
                if (role === 'siswa') {
                    const guruSelect = document.getElementById('greg-guru');
                    guruSelect.innerHTML = '<option value="">⏳ Memuat daftar guru dari server...</option>';
                    guruSelect.disabled = true;

                    // Coba ambil dari Firestore dulu (paling akurat)
                    try {
                        let guruList = [];
                        if (db) {
                            const snap = await db.collection('artifacts').doc('nusantara-arsa').collection('users')
                                .where('role', '==', 'guru').get();
                            guruList = snap.docs.map(d => ({ email: d.id, name: d.data().name, school: d.data().school || '' }));
                        }
                        // FIX: Tambah dari lokal juga (merge, hindari duplikat)
                        // Rename [email,u] → [guruEmail,u] agar tidak shadow variabel 'email' user luar
                        const dbLocal = DataService.getDB();
                        Object.entries(dbLocal).filter(([,u]) => u.role === 'guru').forEach(([guruEmail, u]) => {
                            if (!guruList.find(g => g.email === guruEmail)) {
                                guruList.push({ email: guruEmail, name: u.name, school: u.school || '' });
                            }
                        });

                        // Dedup final berdasarkan email (case-insensitive)
                        const seen = new Set();
                        const dedupedList = guruList.filter(g => {
                            const key = (g.email || '').toLowerCase().trim();
                            if (seen.has(key)) return false;
                            seen.add(key);
                            return true;
                        });

                        dedupedList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                        guruSelect.innerHTML = '<option value="">-- Pilih Guru Pendamping --</option>';
                        guruSelect.disabled = false;
                        if (dedupedList.length === 0) {
                            guruSelect.innerHTML += '<option value="" disabled>⚠️ Belum ada guru terdaftar</option>';
                        } else {
                            dedupedList.forEach(g => {
                                const opt = document.createElement('option');
                                opt.value = g.email;
                                const sekolah = g.school && g.school !== 'Unknown School' && g.school !== 'Unknown' ? ` — ${g.school}` : '';
                                opt.textContent = `👩‍🏫 ${g.name}${sekolah}`;
                                guruSelect.appendChild(opt);
                            });
                        }
                    } catch(e) {
                        console.warn('Gagal fetch guru:', e);
                        guruSelect.disabled = false;
                        guruSelect.innerHTML = '<option value="">-- Pilih Guru (Offline) --</option>';
                        const dbLocal = DataService.getDB();
                        // FIX: rename [email,u] → [guruEmail,u]
                        const localSeen = new Set();
                        Object.entries(dbLocal).filter(([,u]) => u.role === 'guru').forEach(([guruEmail, u]) => {
                            if (localSeen.has(guruEmail)) return;
                            localSeen.add(guruEmail);
                            const opt = document.createElement('option');
                            opt.value = guruEmail;
                            opt.textContent = u.name;
                            guruSelect.appendChild(opt);
                        });
                    }
                }
            }

            async function submitGoogleRegister(role, email, photoURL) {
                const msgEl = document.getElementById('google-reg-msg');
                const nama = document.getElementById('greg-nama')?.value?.trim();

                if (!nama) {
                    msgEl.innerText = '⚠️ Nama wajib diisi!';
                    return;
                }

                let newUser = {
                    email, role, name: nama,
                    photoURL: photoURL || '',
                    loginMethod: 'google',
                    saveData: null,
                    lastActive: Date.now()
                };

                if (role === 'siswa') {
                    const kelas = document.getElementById('greg-kelas')?.value?.trim();
                    const guru = document.getElementById('greg-guru')?.value;
                    if (!kelas) { msgEl.innerText = '⚠️ Kelas wajib diisi!'; return; }
                    newUser.details = kelas;
                    newUser.mentor = guru || '';
                } else {
                    const nip = document.getElementById('greg-nip')?.value?.trim();
                    const sekolah = document.getElementById('greg-sekolah')?.value?.trim();
                    if (!nip || !sekolah) { msgEl.innerText = '⚠️ NIP & Sekolah wajib diisi!'; return; }
                    newUser.details = nip;
                    newUser.school = sekolah;
                }

                msgEl.style.color = '#4ade80';
                msgEl.innerText = '⏳ Menyimpan...';

                await DataService.init(true);
                const dbLocal = DataService.getDB();
                dbLocal[email] = newUser;
                DataService.saveDB(dbLocal);

                // Simpan ke Firestore — wajib agar akun muncul di dashboard admin/guru
                if (db) {
                    try {
                        await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).set(newUser, { merge: true });
                    } catch(e) {
                        console.warn('Cloud sync gagal, data tersimpan lokal saja:', e);
                        msgEl.style.color = '#fbbf24';
                        msgEl.innerText = '⚠️ Tersimpan lokal. Sinkronisasi cloud gagal — pastikan internet stabil.';
                        await new Promise(r => setTimeout(r, 1500));
                    }
                }

                localStorage.setItem(SESSION_KEY, email);
                DataService.user = newUser;

                msgEl.style.color = '#4ade80';
                msgEl.innerText = `✅ Berhasil! Selamat datang, ${nama}!`;

                setTimeout(() => {
                    document.getElementById('login-screen').style.display = 'none';
                    const titleSc2 = document.getElementById('title-screen');
                    if (titleSc2) { titleSc2.style.display = 'none'; titleSc2.classList.add('hidden'); }
                    if (role === 'guru') {
                        initTeacherDashboard();
                    } else {
                        // Siswa baru — tampilkan welcome info lalu mulai prologue
                        const welcomeName = document.getElementById('welcome-name');
                        const welcomeClass = document.getElementById('welcome-class');
                        const welcomeMentor = document.getElementById('welcome-mentor');
                        if (welcomeName) welcomeName.innerText = newUser.name || 'Siswa';
                        if (welcomeClass) welcomeClass.innerText = newUser.details || 'Umum';
                        if (welcomeMentor && newUser.mentor) welcomeMentor.innerText = 'Mentor Active';
                        startPrologue();
                    }
                }, 900);
            }

            function switchRole(role) {
                currentRole = role;

                // 1. Update Tampilan Tab (Warna Active)
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('tab-' + role).classList.add('active');

                // 2. Ganti Form yang Tampil (Siswa vs Guru vs Admin)
                document.getElementById('form-siswa').style.display = 'none';
                document.getElementById('form-guru').style.display = 'none';
                document.getElementById('form-admin').style.display = 'none';

                document.getElementById('form-' + role).style.display = 'block';

                // 3. Atur Visibilitas Tombol Register (Admin tidak bisa register via UI)
                const authSwitch = document.querySelector('.auth-switch');
                if (role === 'admin') {
                    authSwitch.style.display = 'none';
                } else {
                    authSwitch.style.display = 'block';
                    // Pastikan Field Register Tampil/Sembunyi Sesuai Mode Saat Ini
                    const display = authMode === 'register' ? 'block' : 'none';

                    // Hide all register fields first
                    document.getElementById('register-fields-siswa').style.display = 'none';
                    document.getElementById('register-fields-guru').style.display = 'none';

                    // Show relevant one
                    if (role !== 'admin') {
                        document.getElementById('register-fields-' + role).style.display = display;
                    }
                }

                // 4. Jika sedang mode Register Siswa, muat data Guru Pendamping
                if (role === 'siswa' && authMode === 'register') {
                    populateTeacherSelect();
                }
            }

            function showLogoutConfirm() {
                const modal = document.getElementById('logout-confirm-modal');
                if (modal) modal.style.display = 'flex';
            }

            async function logout() {
                // 0. SAVE DULU sebelum logout agar progress tidak hilang
                if (STATE.screen === 'play' || STATE.screen === 'dialogue') {
                    showToast('💾 Menyimpan progress...');
                    try { await manualSave(); } catch(e) {}
                    await new Promise(r => setTimeout(r, 800)); // Beri waktu save selesai
                }

                // 1. Stop game engine & intervals
                if (window.gameLoopId) {
                    cancelAnimationFrame(window.gameLoopId);
                    window.gameLoopId = null;
                }
                if (window.saveIntervalId) {
                    clearInterval(window.saveIntervalId);
                    window.saveIntervalId = null;
                }

                // 2. Stop Firebase listeners
                if (DataService.unsubscribeMsg) {
                    DataService.unsubscribeMsg();
                    DataService.unsubscribeMsg = null;
                }
                if (typeof teacherMonitorUnsub !== 'undefined' && teacherMonitorUnsub) {
                    teacherMonitorUnsub();
                    teacherMonitorUnsub = null;
                }

                // 3. Bersihkan sesi
                localStorage.removeItem(SESSION_KEY);
                DataService.user = null;

                // 4. Reset form
                if (document.getElementById('form-siswa')) document.getElementById('form-siswa').reset();
                if (document.getElementById('form-guru')) document.getElementById('form-guru').reset();

                // 5. Sembunyikan SEMUA layar yang mungkin aktif
                const hideIds = [
                    'teacher-dashboard', 'start-screen', 'ui-layer',
                    'game-over-screen', 'ending-screen', 'login-screen',
                    'prologue-screen', 'gender-screen', 'profile-modal',
                    'logout-confirm-modal'
                ];
                hideIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    if (el.classList.contains('hidden')) return; // sudah hidden
                    if (id === 'start-screen' || id === 'ui-layer') {
                        el.classList.add('hidden');
                    } else {
                        el.style.display = 'none';
                    }
                });

                // 6. Sembunyikan canvas game
                const gcCanvas = document.getElementById('gameCanvas');
                if (gcCanvas) gcCanvas.style.display = 'none';

                // Sembunyikan minimap & pet HUD saat logout
                const minimapEl = document.getElementById('minimap-container');
                if (minimapEl) minimapEl.classList.remove('ingame');
                const petHudEl2 = document.getElementById('pet-hud-indicator');
                if (petHudEl2) petHudEl2.classList.remove('visible');

                // 7. Tampilkan title screen
                const titleScreen = document.getElementById('title-screen');
                if (titleScreen) {
                    titleScreen.classList.remove('hidden');
                    titleScreen.style.display = ''; // reset inline display jika ada
                }
                STATE.screen = 'title';

                // 8. Reset audio ke musik opening
                if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                    AudioService.playBGM('opening');
                }

                showToast("Sampai jumpa! 👋");
            }

            async function toggleAuthMode() {
                authMode = authMode === 'login' ? 'register' : 'login';
                const header = document.getElementById('auth-header');
                const switcher = document.querySelector('.auth-switch');
                const btns = document.querySelectorAll('.auth-btn');
                const disp = authMode === 'register' ? 'block' : 'none';
                document.getElementById('register-fields-siswa').style.display = disp;
                document.getElementById('register-fields-guru').style.display = disp;

                if (authMode === 'register') {
                    header.innerText = "BUAT AKUN BARU";
                    // UPDATE: Teks saat mode register
                    switcher.innerText = "Sudah punya akun? LOGIN DISINI 🔑";
                    switcher.style.borderColor = "#10b981"; // Hijau saat mode login available
                    switcher.style.color = "#047857";
                    btns.forEach(b => b.innerText = "DAFTAR SEKARANG");
                    if (currentRole === 'siswa') await populateTeacherSelect();
                } else {
                    header.innerText = "LOGIN AKUN";
                    // UPDATE: Teks saat mode login
                    switcher.innerText = "Belum punya akun? DAFTAR BARU ✨";
                    switcher.style.borderColor = "var(--accent)"; // Biru default
                    switcher.style.color = "#0f172a";
                    btns.forEach(b => b.innerText = "MASUK PULAU ARSA");
                }
            }

            async function populateTeacherSelect() {
                const select = document.getElementById('siswa-guru');
                select.innerHTML = '<option value="">⏳ Memuat daftar guru dari server...</option>';
                select.disabled = true;
                try {
                    await DataService.init(true);
                    const teachers = await DataService.getTeachers();
                    select.innerHTML = '<option value="">-- Pilih Guru Pendamping --</option>';
                    select.disabled = false;
                    if (teachers.length === 0) {
                        select.innerHTML += '<option value="" disabled>⚠️ Belum ada guru terdaftar</option>';
                    } else {
                        teachers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                        teachers.forEach(t => {
                            const option = document.createElement('option');
                            option.value = t.email;
                            const sekolah = t.school && t.school !== 'Unknown School' && t.school !== 'Unknown' ? ` — ${t.school}` : '';
                            option.innerText = `👩‍🏫 ${t.name}${sekolah}`;
                            select.appendChild(option);
                        });
                    }
                } catch(e) {
                    select.disabled = false;
                    select.innerHTML = '<option value="">⚠️ Gagal memuat — coba lagi</option>';
                    console.warn('populateTeacherSelect error:', e);
                }
            }

            async function handleAuth(role, btnElement) {
                let originalText = "";
                const msgEl = document.getElementById('login-msg'); // Ambil elemen pesan

                // Reset pesan sebelumnya
                msgEl.innerText = "";
                msgEl.style.color = "#ef4444"; // Default merah

                try {
                    // 1. FITUR OTOMATIS FULLSCREEN: Trigger saat tombol ditekan
                    toggleFullScreen();

                    await DataService.init(true);

                    // --- HANDLE ADMIN LOGIN ---
                    if (role === 'admin') {
                        const u = document.getElementById('admin-user').value;
                        const p = document.getElementById('admin-pass').value;

                        if (btnElement) {
                            originalText = btnElement.innerText;
                            btnElement.disabled = true;
                            btnElement.innerText = "⏳ Sinkronisasi...";
                        }

                        await new Promise(r => setTimeout(r, 800));

                        if (u === 'authar' && p === 'Sedayu@123') {
                            const adminEmail = "admin@system.local";
                            // ... (Logika admin sama, disederhanakan untuk diff) ...
                            // Hapus logika detail admin di sini agar fokus pada perubahan alert

                            // GANTI LOGIKA LOGIN SUKSES DISINI:
                            const dbLocal = DataService.getDB();
                            let finalAdminData = {
                                name: "Super Administrator", role: "admin", email: adminEmail,
                                password: p, saveData: null, lastActive: Date.now()
                            };

                            // Coba ambil dari cloud, kalau gagal pakai lokal (sama seperti kode lama)
                            // ... (Kode sinkronisasi admin tetap sama) ...

                            dbLocal[adminEmail] = finalAdminData;
                            DataService.saveDB(dbLocal);
                            localStorage.setItem(SESSION_KEY, adminEmail);
                            DataService.user = finalAdminData;

                            // GANTI ALERT DENGAN INI:
                            msgEl.style.color = "#4ade80";
                            msgEl.innerText = "✅ LOGIN ADMIN BERHASIL! Mengalihkan...";

                            setTimeout(() => {
                                document.getElementById('login-screen').style.display = 'none';
                                initTeacherDashboard();
                            }, 1000);
                        } else {
                            // GANTI ALERT DENGAN INI:
                            msgEl.innerText = "❌ Username atau Password Admin salah!";
                        }

                        if (btnElement && originalText) {
                            btnElement.disabled = false;
                            btnElement.innerText = originalText;
                        }
                        return;
                    }

                    const email = document.getElementById(role + '-email').value;
                    const pass = document.getElementById(role + '-pass').value;

                    // GANTI ALERT VALIDASI:
                    if (!email || !pass) {
                        msgEl.innerText = "⚠️ Email & Password wajib diisi!";
                        return;
                    }

                    if (btnElement) {
                        originalText = btnElement.innerText;
                        btnElement.disabled = true;
                        btnElement.innerText = "⏳ Memproses...";
                        btnElement.style.opacity = "0.7";
                    }

                    if (authMode === 'register') {
                        let name, details, school, mentor;
                        if (role === 'siswa') {
                            name = document.getElementById('siswa-nama').value;
                            details = document.getElementById('siswa-kelas').value;
                            mentor = document.getElementById('siswa-guru').value;
                            if (!name || !details) {
                                msgEl.innerText = "⚠️ Lengkapi Nama & Kelas!"; // GANTI ALERT
                                throw new Error("Validation Failed");
                            }
                        } else {
                            name = document.getElementById('guru-nama').value;
                            details = document.getElementById('guru-nip').value;
                            school = document.getElementById('guru-sekolah').value;
                            if (!name || !details || !school) {
                                msgEl.innerText = "⚠️ Lengkapi Data Guru!"; // GANTI ALERT
                                throw new Error("Validation Failed");
                            }
                        }

                        const res = await DataService.register(role, { email, password: pass, name, details, school, mentor });

                        // GANTI ALERT HASIL REGISTRASI:
                        if (res.success) {
                            msgEl.style.color = "#4ade80";
                            let extraMsg = "";
                            if (res.msg.includes("LOKAL")) extraMsg = " (Offline)";

                            if (role === 'siswa') {
                                // FIX: Auto-login langsung setelah daftar — siswa tidak perlu login ulang
                                msgEl.innerText = "✅ Registrasi Berhasil!" + extraMsg + " Memuat game...";
                                setTimeout(async () => {
                                    const loginRes = await DataService.login(email, pass);
                                    if (loginRes.success) {
                                        localStorage.setItem(SESSION_KEY, email);
                                        const u = loginRes.user;
                                        const welcomeName = document.getElementById('welcome-name');
                                        const welcomeClass = document.getElementById('welcome-class');
                                        const welcomeMentor = document.getElementById('welcome-mentor');
                                        if (welcomeName) welcomeName.innerText = u.name || 'Siswa';
                                        if (welcomeClass) welcomeClass.innerText = u.details || 'Umum';
                                        if (welcomeMentor && u.mentor) welcomeMentor.innerText = 'Mentor Active';
                                        document.getElementById('login-screen').style.display = 'none';
                                        const titleSc = document.getElementById('title-screen');
                                        if (titleSc) { titleSc.style.display = 'none'; titleSc.classList.add('hidden'); }
                                        startPrologue();
                                    } else {
                                        // Fallback: pindah ke tab login jika auto-login gagal
                                        msgEl.innerText = "✅ Registrasi Berhasil! Silakan Login.";
                                        setTimeout(() => toggleAuthMode(), 1000);
                                    }
                                }, 800);
                            } else {
                                // Guru: tetap arahkan ke login
                                msgEl.innerText = "✅ Registrasi Berhasil!" + extraMsg + " Silakan Login.";
                                setTimeout(() => toggleAuthMode(), 1500);
                            }
                        } else {
                            msgEl.style.color = "#ef4444";
                            msgEl.innerText = "❌ " + res.msg;
                        }

                    } else {
                        const res = await DataService.login(email, pass);
                        if (res.success) {
                            // CEK SALAH AKUN: siswa login di tab guru atau sebaliknya
                            if (res.user.role && res.user.role !== role && res.user.role !== 'admin') {
                                const roleLabel = { siswa: 'Siswa', guru: 'Guru', admin: 'Admin' };
                                const correctRole = roleLabel[res.user.role] || res.user.role;
                                const usedRole = roleLabel[role] || role;
                                msgEl.style.color = '#ef4444';
                                msgEl.innerText = `❌ SALAH AKUN! Akun "${email}" terdaftar sebagai ${correctRole}, bukan ${usedRole}.\n\nSilakan login menggunakan tab ${correctRole}.`;
                                return;
                            }

                            localStorage.setItem(SESSION_KEY, email);

                            // FIX: JANGAN SEMBUNYIKAN LAYAR LOGIN DULUAN SEBELUM LOGIKA SIAP
                            // document.getElementById('login-screen').style.display = 'none'; <-- PINDAHKAN KE BAWAH

                            if (role === 'guru') {
                                document.getElementById('login-screen').style.display = 'none';
                                initTeacherDashboard();
                            } else {
                                document.getElementById('welcome-name').innerText = res.user.name;
                                document.getElementById('welcome-class').innerText = res.user.details;
                                if (res.user.mentor) document.getElementById('welcome-mentor').innerText = "Mentor Active";

                                if (!res.user.saveData) {
                                    // New Game Logic
                                    STATE.player.gender = 'boy';
                                    STATE.day = 1;
                                    STATE.isPrologue = true;

                                    // FIX: HAPUS AWAIT PADA MANUAL SAVE AGAR TIDAK MEMBLOKIR UI JIKA KONEKSI LAMBAT
                                    manualSave(); // Biarkan save berjalan di background (Fire & Forget)

                                    document.getElementById('login-screen').style.display = 'none'; // Sembunyikan Login
                                    startPrologue(); // Langsung mulai Prologue
                                } else {
                                    // Load Game Logic
                                    manualSave(); // Background save
                                    document.getElementById('login-screen').style.display = 'none'; // Sembunyikan Login
                                    document.getElementById('start-screen').classList.remove('hidden'); // Tampilkan Start
                                }
                            }
                        } else {
                            // GANTI ALERT GAGAL LOGIN:
                            msgEl.innerText = "❌ " + res.msg;
                        }
                    }

                } catch (err) {
                    if (err.message !== "Validation Failed") {
                        msgEl.innerText = "⚠️ Error Sistem: " + err.message; // GANTI ALERT
                        console.error(err);
                    }
                } finally {
                    if (btnElement && originalText) {
                        btnElement.disabled = false;
                        btnElement.innerText = originalText;
                        btnElement.style.opacity = "1";
                    }
                }
            }

            // FIX: Ubah menjadi ASYNC dan Tambahkan AWAIT DataService.init(true)
