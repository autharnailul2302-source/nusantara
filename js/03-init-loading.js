            // UPDATE: FUNGSI INIT PERTAMA KALI
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
                        const loadingDetailEl = document.getElementById('loading-detail');
                        if (loadingDetailEl) loadingDetailEl.style.display = 'none';

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

