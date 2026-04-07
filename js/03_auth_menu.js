// ========================================================
// js/03_auth_menu.js
// Login, Register, Auth, DataService, Main Menu
// ========================================================

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

                    // ── 1. SELALU simpan ke localStorage dulu (cepat, tidak bisa gagal) ──
                    const dbLocal = this.getDB();
                    if (!dbLocal[this.user.email]) {
                        dbLocal[this.user.email] = { ...this.user, saveData: gameState };
                    } else {
                        const existing = dbLocal[this.user.email].saveData || {};
                        dbLocal[this.user.email].saveData = { ...existing, ...gameState, lastActive: Date.now() };
                    }
                    this.saveDB(dbLocal);
                    // Update in-memory agar loadGame() langsung dapat data terbaru
                    this.user.saveData = { ...(this.user.saveData || {}), ...gameState, lastActive: Date.now() };

                    // ── 2. Upload ke Firebase (dengan cek & retry jika db belum siap) ──
                    if (!navigator.onLine) {
                        this.mode = 'local';
                        return;
                    }

                    try {
                        // FIX BUG 1: Pastikan db ada sebelum pakai — init ulang jika perlu
                        if (!db && typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
                            try { db = firebase.firestore(); this.mode = 'firebase'; } catch(e) {}
                        }
                        if (!db) {
                            console.warn('[saveGame] db tidak tersedia, simpan lokal saja.');
                            this.mode = 'local';
                            return;
                        }

                        const syncData = {
                            saveData: gameState,
                            role:     this.user.role,
                            name:     this.user.name,
                            details:  this.user.details,
                            email:    this.user.email,
                            password: this.user.password,
                            lastActive: Date.now()
                        };
                        if (this.user.mentor) syncData.mentor = this.user.mentor;
                        if (this.user.school) syncData.school = this.user.school;

                        // FIX BUG 2: Timeout 5 detik agar tidak hang
                        const uploadTimeout = new Promise((_, rej) =>
                            setTimeout(() => rej(new Error('Upload timeout')), 5000)
                        );
                        await Promise.race([
                            db.collection('artifacts').doc('nusantara-arsa')
                              .collection('users').doc(this.user.email)
                              .set(syncData, { merge: true }),
                            uploadTimeout
                        ]);

                        if (this.mode === 'local') {
                            console.log('☁️ Auto-Sync ke Cloud Berhasil!');
                            this.mode = 'firebase';
                            if (this.user.role === 'siswa') this.startMessageListener();
                        }

                    } catch (e) {
                        console.warn('[saveGame] Cloud upload gagal, data aman di lokal:', e.message);
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

                            // Filter jika bukan admin — admin dapat semua termasuk guru & umum
                            if (!isAdmin) {
                                users = users.filter(u => u.role === 'siswa');
                            } else {
                                // Admin: tampilkan siswa + guru + umum, kecuali admin sendiri
                                users = users.filter(u => u.role === 'siswa' || u.role === 'guru' || u.role === 'umum');
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
                                // Role umum tetap ditampilkan untuk statistik admin
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
