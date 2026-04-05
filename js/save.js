// ═══════════════════════════════════════════
// SAVE.JS — Nusantara Arsa: Rise of Student
// Baris 42312–44553 dari index asli
// ═══════════════════════════════════════════

            // --- NEW: PWA SERVICE WORKER (FITUR SIMPAN ASET OFFLINE) ---
            // Kode ini membuat browser menyimpan gambar secara agresif agar tidak download ulang
            // [UPDATE] Dinonaktifkan sementara karena Blob URL tidak didukung di lingkungan preview ini
            /*
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                    // Kita gunakan Blob untuk membuat Service Worker tanpa file eksternal (Single File Magic)
                    const swCode = `
                        const CACHE_NAME = 'nusantara-arsa-cache-v1';
                        
                        self.addEventListener('install', event => {
                            self.skipWaiting(); // Langsung aktifkan
                        });
            
                        self.addEventListener('fetch', event => {
                            event.respondWith(
                                caches.match(event.request)
                                    .then(response => {
                                        // 1. Jika ada di Cache, gunakan itu (Hemat Kuota)
                                        if (response) {
                                            return response;
                                        }
                                        // 2. Jika tidak, download dari internet lalu simpan ke Cache
                                        return fetch(event.request).then(
                                            function(networkResponse) {
                                                // Cek validitas respon
                                                if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                                                    return networkResponse;
                                                }
                                                
                                                // Filter: Hanya cache file Gambar dan Audio
                                                if(event.request.url.match(/\\.(png|jpg|jpeg|svg|mp3)$/)) {
                                                    var responseToCache = networkResponse.clone();
                                                    caches.open(CACHE_NAME)
                                                        .then(function(cache) {
                                                            cache.put(event.request, responseToCache);
                                                        });
                                                }
                                                return networkResponse;
                                            }
                                        );
                                    })
                            );
                        });
                    `;
                    
                    // Buat URL virtual untuk script Service Worker
                    const blob = new Blob([swCode], {type: 'text/javascript'});
                    const swUrl = URL.createObjectURL(blob);
                    
                    navigator.serviceWorker.register(swUrl).then(function(registration) {
                        console.log('ServiceWorker PWA registered with scope:', registration.scope);
                    }).catch(function(err) {
                        console.log('ServiceWorker registration failed:', err);
                    });
                });
            }
            */

            // Fungsi untuk memaksa masuk Full Screen kembali
            function resumeFullscreen() {
                var elem = document.documentElement;

                // 1. Minta Fullscreen
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().then(() => {
                        // 2. SETELAH Fullscreen Berhasil, BARU Paksa Landscape
                        // Ini kunci agar layar HP otomatis miring
                        if (screen.orientation && screen.orientation.lock) {
                            screen.orientation.lock('landscape').catch(e => console.log(e));
                        }
                    }).catch(err => {
                        console.log("Gagal Fullscreen: ", err);
                    });
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }

                // 3. Hilangkan layar hitam
                document.getElementById('resume-overlay').style.display = 'none';
            }

            // Event Listener: Mata-mata yang memantau apakah kita pindah tab/aplikasi
            document.addEventListener("visibilitychange", function () {
                // Jika halaman sedang AKTIF (Kita kembali ke tab Chrome ini)
                if (!document.hidden) {
                    console.log("Pengguna kembali ke game.");

                    // Cek: Apakah Fullscreen-nya lepas?
                    // (Biasanya 'null' kalau lepas)
                    if (!document.fullscreenElement && !document.webkitFullscreenElement) {

                        // JIKA LEPAS: Munculkan layar hitam agar user menekan tombol lagi
                        document.getElementById('resume-overlay').style.display = 'flex';
                    }
                }
            });

            // ═══════════════════════════════════════════════════════════
            // 🔊 SISTEM SFX CLICK GLOBAL — Web Audio API (tanpa file)
            // ═══════════════════════════════════════════════════════════
            (function initClickSFX() {
                let _sfxCtx = null;

                function getSfxCtx() {
                    if (!_sfxCtx) {
                        try { _sfxCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
                    }
                    return _sfxCtx;
                }

                const SFX_TYPES = {
                    btn_primary:   { type:'sine',     freq:520, freq2:680, dur:0.09, vol:0.18, sweep:true },
                    btn_secondary: { type:'sine',     freq:380, freq2:320, dur:0.08, vol:0.14, sweep:true },
                    tap:           { type:'triangle', freq:600, freq2:600, dur:0.055,vol:0.12, sweep:false },
                    dialog:        { type:'sine',     freq:440, freq2:660, dur:0.13, vol:0.15, sweep:true },
                    close:         { type:'sine',     freq:580, freq2:380, dur:0.10, vol:0.13, sweep:true },
                    confirm:       { type:'sine',     freq:523, freq2:784, dur:0.12, vol:0.16, sweep:true },
                    default:       { type:'sine',     freq:480, freq2:520, dur:0.07, vol:0.13, sweep:true },
                };

                function playSFXClick(sfxType) {
                    if (typeof AUDIO !== 'undefined' && !AUDIO.enabled) return;
                    const ctx = getSfxCtx();
                    if (!ctx) return;
                    try {
                        if (ctx.state === 'suspended') ctx.resume();
                        const s = SFX_TYPES[sfxType] || SFX_TYPES.default;
                        const osc  = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.type = s.type;
                        const now = ctx.currentTime;
                        osc.frequency.setValueAtTime(s.freq, now);
                        if (s.sweep) osc.frequency.linearRampToValueAtTime(s.freq2, now + s.dur);
                        gain.gain.setValueAtTime(s.vol, now);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + s.dur + 0.03);
                        osc.start(now);
                        osc.stop(now + s.dur + 0.04);
                    } catch(e) {}
                }

                function detectSFXType(el) {
                    if (!el) return 'default';
                    const tag = el.tagName;
                    const cls = (el.className || '').toLowerCase();
                    const id  = (el.id || '').toLowerCase();
                    const txt = (el.textContent || '').trim().toLowerCase().slice(0, 20);
                    if (/close|tutup|keluar|back|batal|cancel/.test(cls + id + txt)) return 'close';
                    if (/confirm|lanjut|mulai|start|submit|kirim|selesai/.test(cls + id + txt)) return 'confirm';
                    if (/modal|dialog|popup|panel/.test(cls + id)) return 'dialog';
                    if (tag === 'BUTTON') {
                        if (/secondary|back|cancel|gray|grey/.test(cls)) return 'btn_secondary';
                        return 'btn_primary';
                    }
                    if (/btn|button|menu|action|tab/.test(cls + id)) return 'btn_primary';
                    if (tag === 'LI' || /item|card|slot|choice|opt/.test(cls + id)) return 'tap';
                    return 'default';
                }

                let _lastSFX = 0;

                document.addEventListener('pointerdown', function(e) {
                    const now = Date.now();
                    if (now - _lastSFX < 80) return;
                    _lastSFX = now;
                    let el = e.target;
                    for (let i = 0; i < 4; i++) {
                        if (!el || el === document.body) break;
                        const tag  = el.tagName;
                        const role = el.getAttribute('role') || '';
                        const cls  = (el.className || '').toLowerCase();
                        const id   = (el.id || '').toLowerCase();
                        const isInteractive = (
                            tag === 'BUTTON' || tag === 'A' || tag === 'LI' ||
                            role === 'button' || el.onclick ||
                            /btn|button|menu|tab|choice|item|card|slot|action/.test(cls + id)
                        );
                        if (isInteractive) {
                            playSFXClick(detectSFXType(el));
                            return;
                        }
                        el = el.parentElement;
                    }
                }, { passive: true });

                window.playSFXClick = playSFXClick;
            })();

            // Tambahan: Kadang di HP orientasi berubah bikin fullscreen lepas
            window.addEventListener("resize", function () {
                // Cek tinggi layar, jika mendadak kecil (status bar muncul), tawarkan fullscreen lagi
                if (window.innerHeight < screen.height * 0.8) {
                    // Jangan langsung paksa (browser blokir), tapi tampilkan tombol overlay jika belum ada
                    // Logic ini opsional, yang utama adalah 'visibilitychange' di atas.
                }
            });

            // --- FITUR BARU: WARNET & FREELANCE ---
            const WARNET_SOAL = [
                { q: "Apa singkatan dari CPU?", a: "Central Processing Unit", b: "Central Process Umbrella", valid: 0 },
                { q: "Bahasa untuk struktur web?", a: "HTML", b: "Snake", valid: 0 },
                { q: "Untuk menghias tampilan web?", a: "CSS", b: "PDF", valid: 0 },
                { q: "1 Byte berapa bit?", a: "10 Bit", b: "8 Bit", valid: 1 },
                { q: "Shortcut Copy?", a: "Ctrl+C", b: "Alt+F4", valid: 0 }
            ];
            let currentWarnetSoal = null;

            // --- UPDATE FUNGSI WARNET MENU (GANTI LOGIKA MAIN GAME) ---
            function openWarnetMenu() {
                showDialogue("WARNET DESA", "Selamat datang! \nKoneksi kencang, PC spek dewa. \nTarif: 500 Gold / Sesi.", [
                    {
                        text: "💻 Kerja Freelance (Dapat Uang)", action: () => {
                            if (STATE.player.money >= 500) {
                                if (STATE.player.energy >= 20) {
                                    STATE.player.money -= 500;
                                    STATE.player.energy -= 20;
                                    closeDialogue();
                                    openWarnetGame(); // Buka Minigame Coding
                                } else showToast("Energi kurang (Butuh 20)");
                            } else showToast("Uang sewa kurang (500 G)");
                        }
                    },
                    {
                        text: "🔍 Cari Info Lowongan Kerja (500G)", action: () => {
                            closeDialogue();
                            searchJobFromWarnet();
                        }
                    },
                    // --- UPDATE: Panggil Game Balap ---
                    {
                        text: "🏎️ Main Balap Liar (Dapat Energi)", action: () => {
                            startRacingGame();
                        }
                    },
                    { text: "Batal", action: closeDialogue }
                ], 'images/warnet.png');
            }

            let raceState = {
                active: false,
                score: 0,
                carX: 130, // Posisi Tengah (Lane 2)
                enemies: [],
                scenery: [], // Pohon/Batu
                speed: 5,
                animationId: null
            };

            function startRacingGame() {
                // Cek Uang
                if (STATE.player.money < 500) {
                    showToast("Uang tidak cukup (Butuh 500 G)");
                    return;
                }

                // Bayar
                STATE.player.money -= 500;

                // Tutup Dialog Menu Warnet
                closeDialogue();

                // Buka Overlay
                document.getElementById('racing-minigame').style.display = 'flex';
                STATE.screen = 'minigame';

                // Reset State
                raceState.score = 0;
                raceState.carX = 130;
                raceState.enemies = [];
                raceState.scenery = [];
                raceState.speed = 4; // Start speed lebih cepat dikit
                raceState.active = false; // Tunggu tap start

                // Update UI Awal
                updateRaceUI();

                // Reset Visual ke Gambar Mobil
                const pCar = document.getElementById('player-car');
                pCar.style.transform = 'none'; // Reset rotasi jika sebelumnya diset oleh error
                // FIX: Terapkan perbaikan yang sama pada string injeksi HTML
                pCar.innerHTML = '<img src="images/player-race.png" style="width: 100%; height: 100%; object-fit: contain;" onerror="var p=this.parentElement; this.style.display=\'none\'; p.innerText=\'🏎️\'; p.style.fontSize=\'40px\'; p.style.transform=\'rotate(-90deg)\'">';
                pCar.classList.remove('explosion');

                // Mulai animasi jalan
                document.getElementById('road-lines').classList.add('road-moving');

                document.getElementById('score-race').innerText = "SKOR: 0";
                document.getElementById('start-msg-race').style.display = 'block';

                // Bersihkan musuh lama & scenery
                const track = document.getElementById('race-track');
                const oldEnemies = track.querySelectorAll('.enemy-car');
                oldEnemies.forEach(e => e.remove());

                const oldScenery = track.querySelectorAll('.scenery-item');
                oldScenery.forEach(s => s.remove());

                // UPDATE: Hapus listener klik manual karena sudah diganti div overlay
                document.getElementById('race-track').onclick = null;
            }

            function initRace() {
                raceState.active = true;
                document.getElementById('start-msg-race').style.display = 'none';
                document.getElementById('race-track').onclick = null; // Hapus listener start
                raceLoop();
            }

            function moveCar(dir) {
                // Jika game belum mulai, tap tombol juga bisa trigger start
                if (!raceState.active && document.getElementById('racing-minigame').style.display === 'flex') {
                    // Jangan start lewat tombol arah
                    return;
                }

                // Pindah Jalur (Kiri/Kanan) sejauh 100px
                raceState.carX += dir * 100;

                // Batasi Jalur (Clamp)
                if (raceState.carX < 30) raceState.carX = 30; // Lane 1
                if (raceState.carX > 230) raceState.carX = 230; // Lane 3

                updateRaceUI();
            }

            function updateRaceUI() {
                const pCar = document.getElementById('player-car');
                pCar.style.left = raceState.carX + 'px';
            }

            function raceLoop() {
                if (!raceState.active) return;

                const track = document.getElementById('race-track');

                // --- 1. SPAWN SCENERY (PINGGIR JALAN) ---
                if (Math.random() < 0.1) { // 10% chance
                    const side = Math.random() < 0.5 ? 'left' : 'right';
                    const type = Math.random() < 0.7 ? '🌲' : '🪨'; // Pohon atau Batu

                    const el = document.createElement('div');
                    el.innerText = type;
                    el.className = 'scenery-item';
                    el.style.position = 'absolute';
                    el.style.top = '-30px';
                    el.style.fontSize = '20px';

                    if (side === 'left') el.style.left = (Math.random() * 10) + 'px';
                    else el.style.right = (Math.random() * 10) + 'px';

                    track.appendChild(el);
                    raceState.scenery.push({ y: -30, el: el });
                }

                // Move Scenery
                for (let i = raceState.scenery.length - 1; i >= 0; i--) {
                    let item = raceState.scenery[i];
                    item.y += raceState.speed;
                    item.el.style.top = item.y + 'px';
                    if (item.y > 420) {
                        item.el.remove();
                        raceState.scenery.splice(i, 1);
                    }
                }

                // --- 2. SPAWN ENEMY (MOBIL/TRUK) ---
                // Peluang spawn meningkat seiring skor
                if (Math.random() < 0.015 + (raceState.score * 0.001)) {
                    spawnEnemyCar();
                }

                // Update posisi musuh
                for (let i = raceState.enemies.length - 1; i >= 0; i--) {
                    let en = raceState.enemies[i];
                    en.y += raceState.speed; // Ikuti kecepatan player seolah player maju

                    // Buat elemen DOM jika belum ada
                    if (!en.el) {
                        en.el = document.createElement('div');
                        en.el.className = 'enemy-car';
                        // en.el.innerText = en.icon; // OLD: Text Only
                        en.el.style.position = 'absolute';
                        en.el.style.fontSize = '35px'; // Ukuran mobil (Fallback Icon)
                        en.el.style.width = '40px';
                        en.el.style.height = '40px';
                        en.el.style.display = 'flex';
                        en.el.style.justifyContent = 'center';
                        en.el.style.alignItems = 'center';

                        // UPDATE: Jangan putar container secara default (Hanya putar jika Fallback ke Icon)
                        // Agar gambar Top-Down tidak miring
                        // en.el.style.transform = 'rotate(-90deg)'; <-- DIHAPUS

                        en.el.style.top = en.y + 'px';
                        en.el.style.left = en.x + 'px';

                        // UPDATE: Render Gambar jika ada, Fallback ke Icon dengan Rotasi
                        if (en.img) {
                            // Jika gambar gagal (onerror), baru kita putar parent-nya -90deg dan tampilkan icon
                            en.el.innerHTML = `<img src="${en.img}" style="width: 100%; height: 100%; object-fit: contain;" onerror="var p=this.parentElement; this.style.display='none'; p.innerText='${en.icon}'; p.style.fontSize='40px'; p.style.transform='rotate(-90deg)'">`;
                        } else {
                            en.el.innerText = en.icon;
                            en.el.style.transform = 'rotate(-90deg)'; // Putar jika hanya icon
                        }

                        // Truk sedikit lebih besar visualnya (Fallback font size)
                        if (en.type === 'truck') en.el.style.fontSize = '45px';

                        track.appendChild(en.el);
                    } else {
                        en.el.style.top = en.y + 'px';
                    }

                    // Cek Tabrakan (Hitbox Sederhana)
                    // Mobil Player Y = Bottom 20px (Sekitar 340-380px dari atas)
                    // X harus sama (satu jalur)
                    if (Math.abs(en.x - raceState.carX) < 20 && en.y > 320 && en.y < 380) {
                        gameOverRace();
                        return;
                    }

                    // Cek Lewat (Score)
                    if (en.y > 420) {
                        en.el.remove(); // Hapus dari DOM
                        raceState.enemies.splice(i, 1); // Hapus dari Array
                        raceState.score++;

                        // Makin lama makin cepat
                        if (raceState.score % 5 === 0) raceState.speed += 0.5;
                    }
                }

                document.getElementById('score-race').innerText = "SKOR: " + raceState.score;
                raceState.animationId = requestAnimationFrame(raceLoop);
            }

            function spawnEnemyCar() {
                // 3 Jalur: 30, 130, 230 (Sesuai posisi player)
                const lanes = [30, 130, 230];
                const x = lanes[Math.floor(Math.random() * lanes.length)];

                // Variasi Musuh (UPDATE: Tambahkan Property Gambar)
                const types = [
                    { icon: '🚛', type: 'truck', img: 'images/truck-race.png' }, // Truk (Besar)
                    { icon: '🚕', type: 'taxi', img: 'images/taxi-race.png' },
                    { icon: '🚙', type: 'suv', img: 'images/suv-race.png' },
                    { icon: '🛵', type: 'bike', img: 'images/bike-race.png' }
                ];
                const chosen = types[Math.floor(Math.random() * types.length)];

                // Jangan spawn jika jalur itu baru saja ada mobil (biar gak numpuk)
                const tooClose = raceState.enemies.some(e => e.x === x && e.y < 80);
                if (!tooClose) {
                    // UPDATE: Push dengan properti img
                    raceState.enemies.push({ x: x, y: -60, el: null, icon: chosen.icon, type: chosen.type, img: chosen.img });
                }
            }

            function gameOverRace() {
                raceState.active = false;
                cancelAnimationFrame(raceState.animationId);

                // Hentikan animasi jalan
                document.getElementById('road-lines').classList.remove('road-moving');

                // EFEK LEDAKAN
                const pCar = document.getElementById('player-car');
                pCar.innerText = '💥'; // Ganti jadi ledakan
                pCar.classList.add('explosion'); // Tambah animasi CSS

                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // Delay agar ledakan terlihat dulu
                setTimeout(() => {
                    // Konversi Skor ke Energi (1 Skor = 1 Energi, Max 100)
                    const energyGain = Math.min(100, raceState.score);
                    STATE.player.energy = Math.min(100, STATE.player.energy + energyGain);

                    // UPDATE: GANTI ALERT DENGAN DIALOGUE AGAR TIDAK KELUAR FULLSCREEN
                    quitRacing(); // Tutup overlay balap dulu

                    showDialogue("TABRAKAN MAUT! 💥",
                        `Mobilmu hancur!\n\nSkor Akhir: **${raceState.score}**\nEnergi Pulih: **+${energyGain}**`,
                        [{
                            text: "Lanjut Main",
                            action: () => {
                                closeDialogue();
                                // Paksa fullscreen lagi jaga-jaga
                                toggleFullScreen();
                            }
                        }],
                        'images/player-race.png'
                    );

                }, 800);
            }

            function quitRacing() {
                raceState.active = false;
                if (raceState.animationId) cancelAnimationFrame(raceState.animationId);
                document.getElementById('racing-minigame').style.display = 'none';
                STATE.screen = 'play';
            }

            function openWarnetGame() {
                STATE.screen = 'minigame';
                document.getElementById('warnet-modal').style.display = 'flex';

                // Pilih Soal Acak
                const idx = Math.floor(Math.random() * WARNET_SOAL.length);
                currentWarnetSoal = WARNET_SOAL[idx];

                // Tampilkan Soal
                document.getElementById('warnet-task-desc').innerText = "KLIEN BERTANYA: " + currentWarnetSoal.q;
                document.getElementById('warnet-code-display').innerText = "PILIH JAWABAN YANG BENAR";
                document.getElementById('btn-code-a').innerText = currentWarnetSoal.a;
                document.getElementById('btn-code-b').innerText = currentWarnetSoal.b;
            }

            function checkWarnetAnswer(pilihan) {
                if (pilihan === currentWarnetSoal.valid) {
                    // Menang
                    const gaji = 1500 + (STATE.player.int * 50);

                    // --- UPDATE: STUDENT PERK (FREELANCER PRO) ---
                    // Mahasiswa Teknologi/Sejarah dapat bayaran lebih tinggi karena skill riset
                    if (STATE.player.role === 'student') {
                        gaji = Math.floor(gaji * 1.5); // +50% Bonus
                        showToast("Bonus Skill Mahasiswa: +50%");
                    }

                    STATE.player.money += gaji;
                    STATE.player.int += 1; // Nambah pinter
                    gainExp(50);
                    showToast(`Project Selesai! Dibayar ${gaji} G`);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    // --- TAMBAHAN EFEK MELAYANG (BARU) ---
                    // Munculkan teks Uang (Warna Hijau)
                    createFloatingText(`+${gaji} G`, '#4ade80');

                    // Munculkan teks EXP (Warna Biru), diberi jeda 0.3 detik agar tidak numpuk dengan teks Uang
                    setTimeout(() => {
                        createFloatingText(`+50 EXP`, '#60a5fa');
                    }, 300);
                    // -----------

                } else {
                    // Kalah
                    showToast("Project Gagal... Klien Marah (Bug!)");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                }
                closeWarnetGame();
            }

            function closeWarnetGame() {
                document.getElementById('warnet-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            // --- FUNGSI MEMBUAT TEKS MELAYANG ---
            function createFloatingText(text, color) {
                // 1. Buat elemen div baru
                const floatEl = document.createElement('div');

                // 2. Beri class CSS yang sudah kita buat di Langkah 1
                floatEl.className = 'floating-text';

                // 3. Masukkan teks dan warnanya
                floatEl.innerText = text;
                floatEl.style.color = color;

                // 4. Masukkan ke dalam halaman utama (body)
                document.body.appendChild(floatEl);

                // 5. Hapus elemen setelah 1.5 detik (sesuai durasi animasi CSS) agar tidak menumpuk di memori
                setTimeout(() => {
                    floatEl.remove();
                }, 1500);
            }

            // ==========================================
            // LOGIKA PASAR GROSIR (NAIK-TURUN)
            // ==========================================

            if (!STATE.player.tradeInventory) STATE.player.tradeInventory = {};

            const TRADE_ITEMS = [
                { id: 'sepatu_b', name: '👟 Sepatu Bekas', basePrice: 500, min: 100, max: 1500 },
                { id: 'kaos_v', name: '👕 Kaos Vintage', basePrice: 200, min: 50, max: 600 },
                { id: 'jam_d', name: '⌚ Jam Digital', basePrice: 800, min: 300, max: 2500 },
                { id: 'snack_k', name: '🍬 Snack Kiloan', basePrice: 50, min: 20, max: 150 }
            ];

            let currentMarketPrices = {};

            function generateMarketPrices() {
                currentMarketPrices = {};
                let chaBonus = (STATE.player.cha || 0) * 0.01;
                if (chaBonus > 0.3) chaBonus = 0.3; // Diskon max 30% dari Charisma

                TRADE_ITEMS.forEach(item => {
                    let rawPrice = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
                    currentMarketPrices[item.id] = {
                        buy: Math.floor(rawPrice * (1 - (chaBonus / 2))),
                        sell: Math.floor(rawPrice * (1 + (chaBonus / 2))),
                        base: item.basePrice
                    };
                });
            }

            function openPasar() {
                STATE.screen = 'minigame';
                document.getElementById('pasar-modal').style.display = 'flex';
                generateMarketPrices();
                renderPasarUI();
            }

            function closePasar() {
                document.getElementById('pasar-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            function refreshPasar() {
                if (STATE.player.money >= 50) {
                    STATE.player.money -= 50;
                    if (typeof createFloatingText === 'function') createFloatingText("-50 G", "#ef4444");
                    generateMarketPrices();
                    renderPasarUI();
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('select');
                } else {
                    if (typeof showToast === 'function') showToast("Uang tidak cukup untuk sogok info pasar!");
                }
            }

            function renderPasarUI() {
                document.getElementById('pasar-uang-player').innerText = `${STATE.player.money} G`;
                const buyList = document.getElementById('pasar-buy-list');
                const sellList = document.getElementById('pasar-sell-list');

                buyList.innerHTML = '';
                sellList.innerHTML = '';

                TRADE_ITEMS.forEach(item => {
                    let prices = currentMarketPrices[item.id];
                    let ownedCount = STATE.player.tradeInventory[item.id] || 0;
                    let priceColor = prices.buy < item.basePrice ? '#ef4444' : '#4ade80';
                    let trendIcon = prices.buy < item.basePrice ? '📉' : '📈';

                    // Toko (Beli)
                    buyList.innerHTML += `
            <div style="background: #334155; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid ${priceColor}">
                <div style="font-size: 14px; margin-bottom: 5px;">${item.name}</div>
                <div style="font-size: 16px; font-weight: bold; color: ${priceColor};">${trendIcon} ${prices.buy} G</div>
                <button onclick="buyTradeItem('${item.id}')" style="margin-top: 8px; width: 100%; padding: 5px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">Beli</button>
            </div>
        `;

                    // Tas (Jual)
                    if (ownedCount > 0) {
                        sellList.innerHTML += `
                <div style="background: #334155; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #3b82f6">
                    <div style="font-size: 14px; margin-bottom: 5px;">${item.name} <span style="background: #eab308; color: black; padding: 2px 5px; border-radius: 10px; font-size: 12px; font-weight:bold;">x${ownedCount}</span></div>
                    <div style="font-size: 16px; font-weight: bold; color: #60a5fa;">Laku: ${prices.sell} G</div>
                    <button onclick="sellTradeItem('${item.id}')" style="margin-top: 8px; width: 100%; padding: 5px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Jual</button>
                </div>
            `;
                    }
                });

                if (sellList.innerHTML === '') {
                    sellList.innerHTML = '<div style="color: #94a3b8; font-style: italic; grid-column: span 2; text-align: center;">Tas daganganmu kosong.</div>';
                }
            }

            function buyTradeItem(itemId) {
                let price = currentMarketPrices[itemId].buy;
                if (STATE.player.money >= price) {
                    STATE.player.money -= price;
                    STATE.player.tradeInventory[itemId] = (STATE.player.tradeInventory[itemId] || 0) + 1;
                    if (typeof createFloatingText === 'function') createFloatingText(`-${price} G`, '#ef4444');
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    renderPasarUI();
                } else {
                    if (typeof showToast === 'function') showToast("Uang tidak cukup!");
                }
            }

            function sellTradeItem(itemId) {
                if (STATE.player.tradeInventory[itemId] > 0) {
                    let price = currentMarketPrices[itemId].sell;
                    STATE.player.tradeInventory[itemId] -= 1;
                    STATE.player.money += price;
                    STATE.player.dailySellCount = (STATE.player.dailySellCount || 0) + 1; // Track bonus quest
                    STATE.player.totalSellCount = (STATE.player.totalSellCount || 0) + 1; // TOTAL LIFETIME
                                    // Entrepreneur dapat AP dari penjualan (1 AP per 3 jual)
                                    if (STATE.player.role === 'entrepreneur') {
                                        const sells = STATE.player.dailySellCount || 0;
                                        if (sells % 3 === 0) {
                                            STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 3;
                                            showToast('💼 Omzet Naik! +3 AP');
                                        }
                                    }

                    if (typeof gainExp === 'function') gainExp(25); // Bonus EXP wirausaha

                    if (typeof createFloatingText === 'function') {
                        createFloatingText(`+${price} G`, '#4ade80');
                        setTimeout(() => { createFloatingText("+25 EXP", "#60a5fa"); }, 300);
                    }

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    renderPasarUI();
                }
            }

            // --- SALES RUSH MINIGAME (JAGA LAPAK) ---
            const SALES_ITEMS = [
                { id: 'roti', name: 'Roti', icon: '🥖' },
                { id: 'susu', name: 'Susu', icon: '🥛' },
                { id: 'sabun', name: 'Sabun', icon: '🧼' },
                { id: 'paket', name: 'Paket', icon: '📦' },
                { id: 'obat', name: 'Obat', icon: '💊' },
                { id: 'lampu', name: 'Lampu', icon: '💡' }
            ];

            let salesState = {
                active: false,
                score: 0,
                lives: 3,
                targetItem: null,
                patience: 100,
                decay: 0.5,
                interval: null
            };

            function startSalesGame() {
                salesState.active = true;
                salesState.score = 0;
                salesState.lives = 3;
                salesState.decay = 0.4; // Initial difficulty

                document.getElementById('sales-minigame').style.display = 'flex';
                STATE.screen = 'minigame';

                updateSalesUI();
                renderSalesButtons();
                nextSalesCustomer();

                if (salesState.interval) clearInterval(salesState.interval);
                salesState.interval = setInterval(salesLoop, 50); // 20 FPS
            }

            function renderSalesButtons() {
                const grid = document.getElementById('sales-grid');
                grid.innerHTML = '';
                SALES_ITEMS.forEach(item => {
                    const btn = document.createElement('button');
                    btn.className = 'auth-btn';
                    btn.style.padding = '8px';
                    btn.style.display = 'flex';
                    btn.style.flexDirection = 'column';
                    btn.style.alignItems = 'center';
                    btn.style.fontSize = '10px';
                    btn.innerHTML = `<span style="font-size:24px; margin-bottom:2px;">${item.icon}</span>${item.name}`;
                    btn.onclick = () => handleSalesClick(item.id);
                    grid.appendChild(btn);
                });
            }

            function nextSalesCustomer() {
                if (!salesState.active) return;

                salesState.patience = 100;
                salesState.decay += 0.05; // Makin lama makin cepat marah

                // Random Item
                salesState.targetItem = SALES_ITEMS[Math.floor(Math.random() * SALES_ITEMS.length)];

                // Tampilkan Bubble
                const bubble = document.getElementById('sales-bubble');
                bubble.innerText = salesState.targetItem.icon;
                bubble.style.transform = 'scale(0)';
                setTimeout(() => bubble.style.transform = 'scale(1)', 100);

                // Random Customer Image
                const customers = ['boy', 'girl', 'peer1', 'peer2', 'peer3', 'lover1girl', 'lover1boy'];
                const randCust = customers[Math.floor(Math.random() * customers.length)];
                const img = document.getElementById('sales-customer-img');
                img.src = `images/${randCust}.png`;
                img.style.transform = 'translateX(50px)';
                setTimeout(() => img.style.transform = 'translateX(0)', 100);
            }

            function salesLoop() {
                if (!salesState.active) return;

                salesState.patience -= salesState.decay;
                const bar = document.getElementById('sales-patience-bar');
                bar.style.width = salesState.patience + "%";

                if (salesState.patience > 50) bar.style.background = '#10b981';
                else if (salesState.patience > 20) bar.style.background = '#facc15';
                else bar.style.background = '#ef4444';

                if (salesState.patience <= 0) {
                    handleSalesMistake("Pelanggan Kabur! 😡");
                }
            }

            function handleSalesClick(id) {
                if (!salesState.active) return;

                if (id === salesState.targetItem.id) {
                    // BENAR
                    salesState.score += 50; // +50 Gold per item
                    createFloatingText("+50 G", "#4ade80");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    updateSalesUI();
                    nextSalesCustomer();
                } else {
                    // SALAH
                    handleSalesMistake("Salah Barang! ❌");
                }
            }

            function handleSalesMistake(msg) {
                salesState.lives--;
                updateSalesUI();
                showToast(msg);
                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // Shake effect
                const box = document.querySelector('#sales-minigame .journal-box');
                box.style.transform = "translateX(5px)";
                setTimeout(() => box.style.transform = "translateX(0)", 100);

                if (salesState.lives <= 0) {
                    endSalesGame();
                } else {
                    nextSalesCustomer();
                }
            }

            function updateSalesUI() {
                document.getElementById('sales-score').innerText = salesState.score;
                document.getElementById('sales-lives').innerText = salesState.lives;
            }

            function endSalesGame() {
                clearInterval(salesState.interval);
                salesState.active = false;
                document.getElementById('sales-minigame').style.display = 'none';
                STATE.screen = 'play';

                // Give Rewards
                STATE.player.money += salesState.score;
                const expGain = Math.floor(salesState.score / 5);
                gainExp(expGain);
                STATE.player.biz += 2; // Skill Bisnis naik

                // Skip Waktu (Kerja memakan waktu)
                STATE.time += 200; // +2 Jam

                showDialogue("REKAP PENJUALAN",
                    `Toko Tutup!\n\n💰 Pendapatan: **${salesState.score} Gold**\n🧠 Pengalaman: **${expGain} EXP**\n📈 Skill Bisnis: **+2**\n\n(Waktu berlalu 2 Jam)`,
                    [{ text: "Mantap!", action: closeDialogue }],
                    'images/mejakasir.png'
                );
            }

            function quitSalesGame() {
                clearInterval(salesState.interval);
                salesState.active = false;
                document.getElementById('sales-minigame').style.display = 'none';
                STATE.screen = 'play';
            }

            // --- NEW: SISTEM PASSIVE INCOME (BISNIS) ---
            const BUSINESS_TIERS = [
                {
                    id: 'gerobak',
                    name: 'Gerobak Kopi Keliling',
                    desc: 'Bisnis pemula. Kopi sachet untuk pekerja.',
                    cost: 5000,
                    income: 10, // per 5 detik
                    reqBiz: 0,
                    icon: '☕',
                    img: 'images/gerobak.png' // Pastikan ada atau fallback
                },
                {
                    id: 'kios',
                    name: 'Kios Pulsa & Snack',
                    desc: 'Ruko kecil di pinggir jalan. Selalu ramai.',
                    cost: 25000,
                    income: 35,
                    reqBiz: 10,
                    icon: '🏪',
                    img: 'images/warnet.png'
                },
                {
                    id: 'minimarket',
                    name: 'Minimarket ArsaMart',
                    desc: 'Toko modern dengan AC. Favorit warga.',
                    cost: 100000,
                    income: 150,
                    reqBiz: 25,
                    icon: '🛒',
                    img: 'images/merchant.png'
                },
                {
                    id: 'mall',
                    name: 'Arsa Grand Mall',
                    desc: 'Pusat perbelanjaan elit. Mesin uang raksasa.',
                    cost: 1000000,
                    income: 1000,
                    reqBiz: 50,
                    icon: '🏢',
                    img: 'images/kampus.png'
                }
            ];

            // Helper: Init Data Bisnis Player
            function initBusinessState() {
                if (!STATE.player.business) {
                    STATE.player.business = {
                        owned: {}, // { 'gerobak': 2, 'kios': 1 }
                        lastCollect: Date.now()
                    };
                }
            }

            // 1. Loop Passive Income (Jalan di Background)
            function updatePassiveIncome() {
                initBusinessState();
                const p = STATE.player;

                // Hitung total income per tick (5 detik)
                let totalIncome = 0;
                BUSINESS_TIERS.forEach(biz => {
                    const count = p.business.owned[biz.id] || 0;
                    totalIncome += count * biz.income;
                });

                if (totalIncome > 0) {
                    // Cek waktu
                    const now = Date.now();
                    if (now - p.business.lastCollect >= 5000) { // 5 Detik
                        const ticks = Math.floor((now - p.business.lastCollect) / 5000);
                        const earn = totalIncome * ticks;

                        p.money += earn;
                        p.business.lastCollect = now;

                        // Visual Feedback (Kecil di pojok, jangan spam toast)
                        // Hanya muncul jika sedang main (screen play)
                        if (STATE.screen === 'play') {
                            spawnFloatingText(STATE.player.x, STATE.player.y - 50, `+${earn} G (Bisnis)`, '#10b981', 10);
                        }
                    }
                } else {
                    p.business.lastCollect = Date.now(); // Reset biar ga numpuk timestamp
                }
            }

            // 2. UI Menu Bisnis
            function openBusinessMenu() {
                initBusinessState();
                const p = STATE.player;

                document.getElementById('business-modal').style.display = 'flex';
                STATE.screen = 'minigame';

                updateBusinessUI();
            }

            function closeBusinessMenu() {
                document.getElementById('business-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            function updateBusinessUI() {
                const p = STATE.player;
                const list = document.getElementById('biz-upgrade-list');
                list.innerHTML = '';

                let totalIncome = 0;
                let totalOwned = 0;

                BUSINESS_TIERS.forEach(biz => {
                    const count = p.business.owned[biz.id] || 0;
                    totalIncome += count * biz.income;
                    totalOwned += count;

                    // Cek Syarat
                    const canBuy = p.money >= biz.cost;
                    const reqMet = p.biz >= biz.reqBiz;

                    let btnStyle = "background:#10b981;";
                    let btnText = `BELI (${biz.cost.toLocaleString()} G)`;
                    let btnAction = `buyBusiness('${biz.id}')`;

                    if (!reqMet) {
                        btnStyle = "background:#334155; color:#64748b; cursor:not-allowed;";
                        btnText = `🔒 Butuh BIZ ${biz.reqBiz}`;
                        btnAction = "";
                    } else if (!canBuy) {
                        btnStyle = "background:#ef4444; opacity:0.7;";
                        btnText = `Uang Kurang`;
                    }

                    const div = document.createElement('div');
                    div.style.cssText = "background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:10px; border:1px solid #334155; display:flex; gap:10px; align-items:center;";

                    div.innerHTML = `
            <div style="font-size:30px;">${biz.icon}</div>
            <div style="flex:1;">
                <div style="font-weight:bold; color:#f1f5f9;">${biz.name} <span style="background:#f59e0b; color:black; padding:1px 6px; border-radius:10px; font-size:10px;">Lvl ${count}</span></div>
                <div style="font-size:10px; color:#94a3b8;">${biz.desc}</div>
                <div style="font-size:11px; color:#4ade80; margin-top:2px;">Income: +${biz.income} G / 5s</div>
            </div>
            <button class="auth-btn" style="width:auto; padding:8px 12px; font-size:10px; ${btnStyle}" onclick="${btnAction}">${btnText}</button>
        `;
                    list.appendChild(div);
                });

                document.getElementById('biz-income-rate').innerText = totalIncome.toLocaleString();
                document.getElementById('biz-total-assets').innerText = totalOwned + " Unit";
            }

            function buyBusiness(id) {
                const p = STATE.player;
                const biz = BUSINESS_TIERS.find(b => b.id === id);

                if (p.money >= biz.cost) {
                    p.money -= biz.cost;
                    p.business.owned[id] = (p.business.owned[id] || 0) + 1;
                    p.biz += 2; // Beli bisnis nambah skill bisnis

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createFloatingText(`-${biz.cost}`, '#ef4444');
                    showToast(`Sukses Membeli ${biz.name}!`);

                    updateBusinessUI();

                    // 💡 CEK KONSEKUENSI: jika sisa uang sangat tipis setelah beli bisnis
                    if (p.money < 500 && p.role === 'entrepreneur') {
                        setTimeout(() => {
                            showKonsekuensi('entrepreneur_broke');
                        }, 800);
                    }
                } else {
                    showToast("Uang tidak cukup!");
                }
            }

            /** * KONFIGURASI TREN SOSMED / VIRAL
             */
            const TRENDS_DB = [
                {
                    id: 'seblak',
                    name: 'Seblak Pedas',
                    newsTitle: 'SEBLAK MELEDAK!',
                    newsBody: 'Jajanan pedas ini bikin siswa sekolah ketagihan. Pedagang kehabisan stok kerupuk!',
                    item: 'kerupuk_mentah',
                    itemName: 'Kerupuk Mentah',
                    desc: 'Bahan utama Seblak.'
                },
                {
                    id: 'latte',
                    name: 'Kopi Gula Aren',
                    newsTitle: 'KOPI SENJA HITS!',
                    newsBody: 'Anak-anak indie mulai menyerbu kedai kopi. Biji kopi jadi langka di pasaran.',
                    item: 'biji_kopi',
                    itemName: 'Biji Kopi',
                    desc: 'Bahan dasar kopi viral.'
                },
                {
                    id: 'lato',
                    name: 'Lato-lato',
                    newsTitle: 'DEMAM TEK-TEK!',
                    newsBody: 'Suara "tek tek" terdengar di mana-mana. Mainan jadul ini viral lagi!',
                    item: 'bola_plastik',
                    itemName: 'Bola Plastik',
                    desc: 'Bahan mainan lato-lato.'
                },
                {
                    id: 'croffle',
                    name: 'Croffle',
                    newsTitle: 'ANTRIAN CROFFLE!',
                    newsBody: 'Perpaduan Croissant dan Waffle ini bikin antrian mengular. Butuh adonan banyak!',
                    item: 'adonan_pastry',
                    itemName: 'Adonan Pastry',
                    desc: 'Bahan kue kekinian.'
                }
            ];

            // ==========================================
            // LOGIKA TREN SOSMED
            // ==========================================

            // ==========================================
            // 2. SISTEM HP & VIRAL
            // ==========================================
            function generateDailyTrend() {
                STATE.viral.active = null; // Reset
                // 40% Peluang Viral
                if (Math.random() < 0.4) {
                    const randIndex = Math.floor(Math.random() * TRENDS_DB.length);
                    STATE.viral.active = TRENDS_DB[randIndex];

                    // Notifikasi Visual
                    const btn = document.getElementById('phone-btn');
                    if (btn) btn.classList.add('phone-ringing');
                    showToast(`🔥 BREAKING NEWS: ${STATE.viral.active.name} VIRAL!`);
                } else {
                    const btn = document.getElementById('phone-btn');
                    if (btn) btn.classList.remove('phone-ringing');
                }
            }

            // --- FIX: FUNGSI YANG HILANG (WAJIB ADA UNTUK INTERAKSI MERCHANT) ---
            function getViralOption(npcId) {
                // Cek apakah ada tren viral aktif hari ini
                if (!STATE.viral.active) return null;

                const trend = STATE.viral.active;
                const p = STATE.player;
                // Cek stok barang viral di tas pemain
                const owned = p.inventory[trend.item] || 0;

                // Harga Jual Barang Viral (Naik 300% dari harga beli 500G -> Jadi 1500G)
                const sellPrice = 1500;

                // Opsi 1: Jika punya barang, muncul tombol JUAL
                if (owned > 0) {
                    return {
                        text: `🔥 JUAL BARANG VIRAL: ${trend.itemName} (x${owned})`,
                        isViral: true,
                        action: () => {
                            showDialogue("PAK ADI — BOS MERCHANT",
                                `Wah! Kamu punya stok **${trend.itemName}**?\nBarang ini lagi dicari semua orang di Sosmed!\n\nSaya berani beli mahal: **${sellPrice.toLocaleString()} G** per item.\n(Normal: ~200 G)`,
                                [
                                    { text: `Jual 1 (+${sellPrice.toLocaleString()} G)`, action: () => sellViralItem(trend.item, sellPrice, 1) },
                                    { text: `Jual Semua (+${(sellPrice * owned).toLocaleString()} G)`, action: () => sellViralItem(trend.item, sellPrice, owned) },
                                    { text: "Tahan Dulu (Tunggu Harga Naik?)", action: () => interactNPC({ id: npcId, name: "Merchant", imgSrc: 'images/job.png' }) }
                                ],
                                'images/job.png'
                            );
                        }
                    };
                }
                // Opsi 2: Jika tidak punya, muncul tombol INFO (Hint) - UPDATE TEKS AGAR LEBIH MENGAJAK
                else {
                    return {
                        text: `🔥 Info Tren Viral (Peluang Cuan!)`,
                        action: () => showDialogue("PAK ADI — BOS MERCHANT", `Dengar-dengar **${trend.itemName}** lagi viral banget hari ini di Sosmed!\n\nGudang saya kosong, tapi permintaannya gila-gilaan.\n\nSiapapun kamu (Mahasiswa/Pekerja/Warga), kalau bisa dapat barangnya dari **Bu Lastri (Pedagang Keliling)**, bawa ke sini. Saya beli 3x lipat!`, [{ text: "Siap Bos, saya carikan!", action: closeDialogue }], 'images/job.png')
                    };
                }
            }

            // ═══════════════════════════════════════════
            // 🎣 FISHING OVERLAY — JS CONTROLLER
            // ═══════════════════════════════════════════
            function showFishingOverlay() {
                const overlay = document.getElementById('fishing-overlay');
                if (!overlay) return;
                overlay.classList.add('active');
                document.body.classList.add('is-fishing');

                // Set zona target di bar
                const targetZone = document.getElementById('fishing-target-zone');
                if (targetZone) {
                    targetZone.style.left = STATE.fishing.targetStart + '%';
                    targetZone.style.width = STATE.fishing.targetWidth + '%';
                }
            }

            function hideFishingOverlay() {
                const overlay = document.getElementById('fishing-overlay');
                if (!overlay) return;
                overlay.classList.remove('active');
                document.body.classList.remove('is-fishing');
            }

            function updateFishingOverlayBar() {
                const indicator = document.getElementById('fishing-indicator');
                if (!indicator) return;
                indicator.style.left = STATE.fishing.barX + '%';

                // Warna indikator berubah hijau saat di zona target
                const inZone = STATE.fishing.barX >= STATE.fishing.targetStart &&
                               STATE.fishing.barX <= (STATE.fishing.targetStart + STATE.fishing.targetWidth);
                if (inZone) {
                    indicator.style.background = 'linear-gradient(to bottom, #fff, #4ade80, #fff)';
                    indicator.style.boxShadow = '0 0 10px #4ade80, 0 0 20px #4ade80, 0 0 4px rgba(255,255,255,0.9)';
                } else {
                    indicator.style.background = 'linear-gradient(to bottom, #fff, #7dd3fc, #fff)';
                    indicator.style.boxShadow = '0 0 10px #fff, 0 0 20px #7dd3fc, 0 0 4px rgba(255,255,255,0.9)';
                }
            }

            function handleFishingBtnClick(e) {
                // Ripple effect
                const btn = document.getElementById('fishing-action-btn');
                if (btn) {
                    const ripple = document.createElement('span');
                    ripple.className = 'fishing-ripple';
                    const rect = btn.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = ((e.clientX || rect.left + rect.width/2) - rect.left - size/2) + 'px';
                    ripple.style.top = ((e.clientY || rect.top + rect.height/2) - rect.top - size/2) + 'px';
                    btn.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                }
                if (STATE.fishing && STATE.fishing.active) checkFishing();
            }

            // ═══════════════════════════════════════════════════════════
            // 💡 SISTEM KONSEKUENSI NYATA
            // Menghubungkan kejadian di game dengan fakta dunia nyata
            // + wajib tulis refleksi sebelum lanjut
            // ═══════════════════════════════════════════════════════════

            // Database fakta & pertanyaan per kondisi
            const KONSEKUENSI_DB = {

                // ── WIRAUSAHA / ENTREPRENEUR ──────────────────────────
                entrepreneur_broke: {
                    icon: '💸',
                    title: 'MODAL HABIS — WIRAUSAHA',
                    fact: '60% UMKM di Indonesia gagal di tahun pertama karena kurang perencanaan modal dan manajemen arus kas. Kamu baru saja mengalaminya dengan aman di sini.',
                    question: 'Di dunia nyata, apa langkah pertama yang kamu ambil sebelum memulai usaha agar tidak kehabisan modal?'
                },
                entrepreneur_debt: {
                    icon: '🏦',
                    title: 'TERJEBAK HUTANG — WIRAUSAHA',
                    fact: 'Hutang usaha yang tidak terencana adalah penyebab ke-2 kebangkrutan UMKM. Bank Indonesia mencatat 42% pelaku usaha pemula tidak memiliki catatan keuangan sederhana.',
                    question: 'Bagaimana cara kamu membedakan "hutang produktif" dan "hutang konsumtif" dalam menjalankan usaha?'
                },
                entrepreneur_low_biz: {
                    icon: '📉',
                    title: 'PENJUALAN STAGNAN — WIRAUSAHA',
                    fact: 'Studi Kemenkop menunjukkan 78% UMKM gagal berkembang karena tidak melakukan inovasi produk dan riset pasar. Pelanggan pergi ke kompetitor yang lebih kreatif.',
                    question: 'Apa satu inovasi konkret yang bisa kamu lakukan untuk membuat produk atau jasamu lebih menarik?'
                },

                // ── PEKERJA / WORKER ──────────────────────────────────
                worker_fired: {
                    icon: '🏭',
                    title: 'REPUTASI BOSS HANCUR — PEKERJA',
                    fact: 'Survei LinkedIn 2023: 89% karyawan dipecat bukan karena kurang skill, melainkan karena soft skill — disiplin, komunikasi, dan sikap kerja yang buruk.',
                    question: 'Apa satu kebiasaan buruk di tempat kerja yang ingin kamu perbaiki, dan bagaimana caranya?'
                },
                worker_low_energy: {
                    icon: '😴',
                    title: 'KELELAHAN — PEKERJA',
                    fact: 'WHO menyebut burnout sebagai fenomena kerja resmi. 40% pekerja muda Indonesia mengalami kelelahan kronis karena tidak menjaga keseimbangan kerja dan istirahat.',
                    question: 'Bagaimana cara kamu menjaga stamina fisik dan mental agar produktif tapi tidak kelelahan?'
                },
                worker_broke: {
                    icon: '💼',
                    title: 'GAJI HABIS SEBELUM AKHIR BULAN',
                    fact: '75% karyawan muda Indonesia menghabiskan gaji dalam 10 hari pertama tanpa tabungan darurat. Ini disebut "Paycheck to Paycheck" — lingkaran yang sulit diputus.',
                    question: 'Jika kamu punya gaji 3 juta, berapa yang akan kamu alokasikan untuk tabungan, kebutuhan pokok, dan hiburan?'
                },

                // ── MAHASISWA / STUDENT ───────────────────────────────
                student_failed_exam: {
                    icon: '📚',
                    title: 'GAGAL UJIAN — MAHASISWA',
                    fact: 'Penelitian Universitas Cambridge: Belajar sistem SKS (belajar banyak di malam terakhir) hanya efektif 23% dibanding belajar terjadwal harian. Otak manusia butuh pengulangan berkala.',
                    question: 'Bagaimana strategi belajarmu selama ini? Apa yang akan kamu ubah agar nilaimu lebih baik?'
                },
                student_debt_ukt: {
                    icon: '🎓',
                    title: 'TUNGGAKAN UKT — MAHASISWA',
                    fact: 'Data Kemendikbud: 1 dari 5 mahasiswa Indonesia terancam DO karena masalah biaya. Perencanaan finansial sejak SMA bisa mencegah ini.',
                    question: 'Apa langkah nyata yang bisa kamu mulai sekarang untuk mempersiapkan biaya kuliah atau melunasi tanggungan?'
                },
                student_low_int: {
                    icon: '🧠',
                    title: 'PRESTASI MENURUN — MAHASISWA',
                    fact: 'Riset Stanford: Menghabiskan >4 jam/hari di medsos menurunkan kemampuan fokus dan nilai akademik rata-rata 1,2 poin. Distraksi digital adalah musuh terbesar pelajar masa kini.',
                    question: 'Berapa jam sehari kamu habiskan untuk belajar vs untuk hiburan digital? Apakah porsinya sudah seimbang?'
                },

                // ── KEHIDUPAN KELUARGA / FAMILY ───────────────────────
                family_broke: {
                    icon: '🏠',
                    title: 'EKONOMI KELUARGA KRITIS',
                    fact: 'BKKBN mencatat 64% perceraian dini di Indonesia dipicu masalah finansial. Menikah tanpa kesiapan ekonomi meningkatkan risiko konflik rumah tangga 3x lipat.',
                    question: 'Menurut kamu, kesiapan apa saja yang harus dipenuhi sebelum seseorang siap membangun keluarga?'
                },
                family_low_rep: {
                    icon: '💔',
                    title: 'HUBUNGAN MEMBURUK — KELUARGA',
                    fact: 'Psikolog Dr. John Gottman menemukan: butuh 5 interaksi positif untuk mengimbangi 1 interaksi negatif dalam hubungan. Konsistensi perhatian kecil lebih kuat dari hadiah besar sesekali.',
                    question: 'Apa satu hal sederhana yang bisa kamu lakukan setiap hari untuk menjaga hubungan baikmu dengan orang-orang terdekat?'
                },

                // ── UMUM (FALLBACK) ────────────────────────────────────
                general_broke: {
                    icon: '💰',
                    title: 'KEUANGAN KRITIS',
                    fact: 'OJK Indonesia: Hanya 38% anak muda Indonesia memiliki tabungan darurat minimal 3 bulan pengeluaran. Literasi keuangan sejak dini adalah kunci kebebasan finansial.',
                    question: 'Langkah keuangan apa yang ingin kamu mulai terapkan mulai hari ini dalam kehidupan nyatamu?'
                },
                general_low_energy: {
                    icon: '⚡',
                    title: 'KEHABISAN ENERGI',
                    fact: 'WHO: Remaja butuh 8-10 jam tidur per malam untuk fungsi otak optimal. Kurang tidur kronis menurunkan kemampuan belajar hingga 40% dan meningkatkan risiko depresi.',
                    question: 'Bagaimana pola istirahatmu selama ini? Apa yang akan kamu ubah untuk menjaga kesehatan fisik dan mentalmu?'
                }
            };

            // State: callback yang dijalankan SETELAH refleksi selesai
            let _konsekuensiCallback = null;
            let _konsekuensiKey = null;

            // ── FUNGSI UTAMA: tampilkan layar konsekuensi ──
            function showKonsekuensi(kondisi, callback) {
                const data = KONSEKUENSI_DB[kondisi] || KONSEKUENSI_DB['general_broke'];
                _konsekuensiCallback = callback || null;
                _konsekuensiKey = kondisi;

                document.getElementById('konsekuensi-icon').innerText = data.icon;
                document.getElementById('konsekuensi-title').innerText = data.title;
                document.getElementById('konsekuensi-fact-text').innerText = data.fact;
                document.getElementById('konsekuensi-question').innerText = data.question;
                document.getElementById('konsekuensi-textarea').value = '';
                document.getElementById('konsekuensi-char-count').innerText = '0 / 20 karakter minimum';
                document.getElementById('konsekuensi-char-count').className = 'konsekuensi-char-count';
                document.getElementById('konsekuensi-submit-btn').disabled = true;

                document.getElementById('konsekuensi-modal').classList.add('active');
                STATE.screen = 'modal';

                setTimeout(() => document.getElementById('konsekuensi-textarea').focus(), 400);
            }

            function updateKonsekuensiChar() {
                const val = document.getElementById('konsekuensi-textarea').value.trim();
                const len = val.length;
                const countEl = document.getElementById('konsekuensi-char-count');
                const btn = document.getElementById('konsekuensi-submit-btn');
                const MIN = 20;
                countEl.innerText = `${len} / ${MIN} karakter minimum`;
                if (len >= MIN) {
                    countEl.className = 'konsekuensi-char-count ok';
                    btn.disabled = false;
                    btn.innerText = 'LANJUTKAN →';
                } else {
                    countEl.className = 'konsekuensi-char-count';
                    btn.disabled = true;
                }
            }

            function submitKonsekuensi() {
                const text = document.getElementById('konsekuensi-textarea').value.trim();
                if (text.length < 20) return;

                // Simpan ke refleksi jurnal player dengan tag khusus
                if (!STATE.player.reflections) STATE.player.reflections = [];
                STATE.player.reflections.push({
                    day: STATE.day,
                    text: `[KONSEKUENSI NYATA — ${_konsekuensiKey}] ${text}`,
                    timestamp: Date.now()
                });
                manualSave();

                document.getElementById('konsekuensi-modal').classList.remove('active');
                STATE.screen = 'play';

                showToast('✅ Refleksi tersimpan! +10 INT');
                STATE.player.int = (STATE.player.int || 0) + 10;

                if (typeof _konsekuensiCallback === 'function') {
                    _konsekuensiCallback();
                    _konsekuensiCallback = null;
                }
            }

            // ── FUNGSI CEK OTOMATIS (dipanggil saat tidur / ganti hari) ──
            function checkKonsekuensiTriggers(onDone) {
                const p = STATE.player;
                const role = p.role;

                // Cek apakah sudah pernah trigger hari ini
                if (p.lastKonsekuensiDay === STATE.day) {
                    if (typeof onDone === 'function') onDone();
                    return;
                }

                let kondisi = null;

                // ── WIRAUSAHA ──
                if (role === 'entrepreneur') {
                    if (p.money <= 0) kondisi = 'entrepreneur_broke';
                    else if (p.money < 0) kondisi = 'entrepreneur_debt';
                    else if ((p.biz || 0) < 10 && STATE.day > 14) kondisi = 'entrepreneur_low_biz';
                }
                // ── PEKERJA ──
                else if (role === 'worker') {
                    if ((p.bossReputation || 0) < 20 && STATE.day > 7) kondisi = 'worker_fired';
                    else if (p.money < 500 && STATE.day > 5) kondisi = 'worker_broke';
                    else if ((p.energy || 100) < 15) kondisi = 'worker_low_energy';
                }
                // ── MAHASISWA ──
                else if (role === 'student') {
                    if (p.money < 0) kondisi = 'student_debt_ukt';
                    else if (p.lastExamFailDay && (STATE.day - p.lastExamFailDay) <= 2) kondisi = 'student_failed_exam';
                    else if ((p.int || 0) < 10 && STATE.day > 10) kondisi = 'student_low_int';
                }
                // ── KELUARGA ──
                else if (role === 'family') {
                    if (p.money < 0) kondisi = 'family_broke';
                    else if ((p.rep || 0) < 10 && STATE.day > 7) kondisi = 'family_low_rep';
                }

                // Fallback umum
                if (!kondisi && p.money < 100 && STATE.day > 3) {
                    kondisi = 'general_broke';
                }

                if (kondisi) {
                    p.lastKonsekuensiDay = STATE.day;
                    showKonsekuensi(kondisi, onDone);
                } else {
                    if (typeof onDone === 'function') onDone();
                }
            }

            // ═══════════════════════════════════════════════════════════
            // 🎯 CAREER REALITY CHECK — DATA & FUNGSI
            // Menampilkan data nyata dunia kerja sebelum siswa
            // mengkonfirmasi pilihan jalur karir mereka
            // ═══════════════════════════════════════════════════════════

            const CAREER_REALITY_DATA = {

                worker: {
                    icon: '⚔️',
                    name: 'JALUR PEKERJA',
                    sub: 'FIGHTER — STR++ / Dunia Kerja Nyata',
                    headerGradient: 'linear-gradient(135deg, #1e3a5f, #1d4ed8, #2563eb)',
                    accentColor: '#3b82f6',
                    stats: [
                        {
                            label: '💵 UMR Jawa Timur 2025',
                            value: 'Rp 2.165.244 / bulan',
                            color: '#60a5fa'
                        },
                        {
                            label: '🏆 UMR Surabaya 2025',
                            value: 'Rp 4.887.540 / bulan',
                            color: '#34d399'
                        },
                        {
                            label: '📊 Persaingan Kerja',
                            value: '1 lowongan untuk\n50–80 pelamar',
                            color: '#f87171'
                        },
                        {
                            label: '📈 Kenaikan Gaji Rata-rata',
                            value: '8–12% per tahun\njika berprestasi',
                            color: '#a78bfa'
                        },
                        {
                            label: '🎓 Sertifikasi Pendongkrak Gaji',
                            value: 'BNSP, LSP-P1, K3 Umum,\nBrevet Pajak, Sertifikasi SMK',
                            color: '#fbbf24',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Disiplin & Tepat Waktu', color: '#1d4ed8', bg: '#dbeafe' },
                        { label: 'Komunikasi Kerja', color: '#1e40af', bg: '#eff6ff' },
                        { label: 'Kerja Tim', color: '#1d4ed8', bg: '#dbeafe' },
                        { label: 'Microsoft Office', color: '#1e40af', bg: '#eff6ff' },
                        { label: 'Manajemen Waktu', color: '#1d4ed8', bg: '#dbeafe' },
                        { label: 'Problem Solving', color: '#1e40af', bg: '#eff6ff' }
                    ],
                    insightLabel: '📊 FAKTA BPS 2024',
                    insightBg: 'rgba(59,130,246,0.08)',
                    insightBorder: 'rgba(59,130,246,0.3)',
                    insightColor: '#93c5fd',
                    insight: 'Lulusan SMK memiliki tingkat penyerapan kerja 62% dalam 1 tahun — tertinggi dibanding lulusan SMA/MA. Kompetensi vokasi + sertifikasi BNSP meningkatkan gaji awal hingga 35%.',
                    confirmColor: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                    confirmShadow: 'rgba(59,130,246,0.4)'
                },

                student: {
                    icon: '🎓',
                    name: 'JALUR MAHASISWA',
                    sub: 'MAGE — INT++ / Dunia Akademik Nyata',
                    headerGradient: 'linear-gradient(135deg, #1a1a2e, #6d28d9, #7c3aed)',
                    accentColor: '#8b5cf6',
                    stats: [
                        {
                            label: '💰 Biaya Kuliah / Semester',
                            value: 'PTN: Rp 500k–5 juta\nPTS: Rp 3–15 juta',
                            color: '#c4b5fd'
                        },
                        {
                            label: '⏱️ Lama Studi S1',
                            value: 'Rata-rata 4,5 tahun\n(target 4 tahun)',
                            color: '#a78bfa'
                        },
                        {
                            label: '📉 Angka DO Nasional',
                            value: '~25% mahasiswa\ntidak sampai wisuda',
                            color: '#f87171'
                        },
                        {
                            label: '💼 Rata-rata Gaji Fresh Graduate',
                            value: 'Rp 3–5 juta/bulan\n(tergantung jurusan)',
                            color: '#34d399'
                        },
                        {
                            label: '🏅 Jurusan Paling Dicari Industri',
                            value: 'Teknologi Informasi, Akuntansi, Teknik Industri,\nKeperawatan, Pendidikan Vokasi',
                            color: '#fbbf24',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Berpikir Kritis', color: '#6d28d9', bg: '#ede9fe' },
                        { label: 'Riset & Analisis', color: '#5b21b6', bg: '#f5f3ff' },
                        { label: 'Manajemen Waktu', color: '#6d28d9', bg: '#ede9fe' },
                        { label: 'Menulis Ilmiah', color: '#5b21b6', bg: '#f5f3ff' },
                        { label: 'Bahasa Inggris', color: '#6d28d9', bg: '#ede9fe' },
                        { label: 'Teknologi Digital', color: '#5b21b6', bg: '#f5f3ff' }
                    ],
                    insightLabel: '🎓 INSIGHT KEMENDIKBUD',
                    insightBg: 'rgba(139,92,246,0.08)',
                    insightBorder: 'rgba(139,92,246,0.3)',
                    insightColor: '#c4b5fd',
                    insight: '1 dari 5 mahasiswa Indonesia tidak menyelesaikan kuliah karena masalah finansial. Siswa yang lulus dengan IPK 3.5+ dan aktif magang mendapat gaji pertama 2× lebih tinggi dari rata-rata.',
                    confirmColor: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
                    confirmShadow: 'rgba(139,92,246,0.4)'
                },

                entrepreneur: {
                    icon: '🏪',
                    name: 'JALUR WIRAUSAHA',
                    sub: 'SUPPORT — BIZ++ / Dunia UMKM Nyata',
                    headerGradient: 'linear-gradient(135deg, #78350f, #d97706, #f59e0b)',
                    accentColor: '#f59e0b',
                    stats: [
                        {
                            label: '💵 Modal Awal UMKM Rata-rata',
                            value: 'Rp 5–50 juta\n(skala mikro: < Rp 5 juta)',
                            color: '#fcd34d'
                        },
                        {
                            label: '📊 Tingkat Keberhasilan Tahun 1',
                            value: 'Hanya 40% bertahan\n60% tutup tahun pertama',
                            color: '#f87171'
                        },
                        {
                            label: '📈 Omset UMKM Sukses',
                            value: 'Rp 10–300 juta/bulan\n(setelah 3 tahun)',
                            color: '#34d399'
                        },
                        {
                            label: '🏦 Akses Modal Usaha',
                            value: 'KUR BRI/BNI: 3–6%/tahun\nDana bergulir Kemenkop',
                            color: '#93c5fd'
                        },
                        {
                            label: '📱 Platform Jualan Digital Terpopuler',
                            value: 'Shopee, TikTok Shop, Instagram, Tokopedia — GRATIS untuk mulai',
                            color: '#a78bfa',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Manajemen Keuangan', color: '#92400e', bg: '#fef3c7' },
                        { label: 'Pemasaran Digital', color: '#78350f', bg: '#fffbeb' },
                        { label: 'Negosiasi', color: '#92400e', bg: '#fef3c7' },
                        { label: 'Kreativitas Produk', color: '#78350f', bg: '#fffbeb' },
                        { label: 'Layanan Pelanggan', color: '#92400e', bg: '#fef3c7' },
                        { label: 'Pencatatan Usaha', color: '#78350f', bg: '#fffbeb' }
                    ],
                    insightLabel: '📊 DATA KEMENKOP 2024',
                    insightBg: 'rgba(245,158,11,0.08)',
                    insightBorder: 'rgba(245,158,11,0.3)',
                    insightColor: '#fcd34d',
                    insight: '65,5 juta UMKM menyumbang 61% PDB Indonesia — tapi 78% tidak punya catatan keuangan. UMKM yang pakai digital marketing tumbuh 3× lebih cepat dari yang tidak.',
                    confirmColor: 'linear-gradient(135deg, #d97706, #f59e0b)',
                    confirmShadow: 'rgba(245,158,11,0.4)'
                },

                family: {
                    icon: '🏠',
                    name: 'JALUR KELUARGA',
                    sub: 'FAMILY — REP++ / Realita Rumah Tangga',
                    headerGradient: 'linear-gradient(135deg, #831843, #db2777, #ec4899)',
                    accentColor: '#ec4899',
                    stats: [
                        {
                            label: '💰 Biaya Hidup Keluarga/Bulan',
                            value: 'Minimum Rp 3–5 juta\n(pasangan + 1 anak)',
                            color: '#f9a8d4'
                        },
                        {
                            label: '📉 Angka Cerai Indonesia',
                            value: '516.000 kasus/tahun\n(naik 54% sejak 2019)',
                            color: '#f87171'
                        },
                        {
                            label: '⚠️ Penyebab Konflik Utama',
                            value: '#1 Masalah Finansial\n#2 Komunikasi buruk',
                            color: '#fbbf24'
                        },
                        {
                            label: '👶 Usia Ideal Menikah (WHO)',
                            value: 'Perempuan ≥ 21 tahun\nLaki-laki ≥ 25 tahun',
                            color: '#34d399'
                        },
                        {
                            label: '💡 Kunci Keluarga Harmonis',
                            value: 'Komunikasi terbuka · Kestabilan finansial · Dukungan emosional · Perencanaan bersama',
                            color: '#a78bfa',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Komunikasi Pasangan', color: '#9d174d', bg: '#fce7f3' },
                        { label: 'Manajemen Anggaran', color: '#831843', bg: '#fdf2f8' },
                        { label: 'Parenting', color: '#9d174d', bg: '#fce7f3' },
                        { label: 'Empati & Sabar', color: '#831843', bg: '#fdf2f8' },
                        { label: 'Problem Solving', color: '#9d174d', bg: '#fce7f3' },
                        { label: 'Perencanaan Masa Depan', color: '#831843', bg: '#fdf2f8' }
                    ],
                    insightLabel: '💔 DATA BKKBN 2024',
                    insightBg: 'rgba(236,72,153,0.08)',
                    insightBorder: 'rgba(236,72,153,0.3)',
                    insightColor: '#f9a8d4',
                    insight: '64% perceraian dini dipicu masalah ekonomi. Remaja yang menikah sebelum 20 tahun memiliki risiko kemiskinan 3× lebih tinggi. Pendidikan & karir yang mapan adalah fondasi keluarga sehat.',
                    confirmColor: 'linear-gradient(135deg, #be185d, #ec4899)',
                    confirmShadow: 'rgba(236,72,153,0.4)'
                }
            };

            let _pendingRole = null; // Role yang menunggu konfirmasi

            // Tampilkan Career Reality Check sebelum setRole dipanggil
            function showCareerCheck(role) {
                const data = CAREER_REALITY_DATA[role];
                if (!data) { setRole(role); return; } // Fallback langsung

                _pendingRole = role;

                // Set header
                const header = document.getElementById('crc-header');
                header.style.background = data.headerGradient;
                document.getElementById('crc-icon').innerText = data.icon;
                document.getElementById('crc-role-name').style.color = '#fff';
                document.getElementById('crc-role-name').innerText = data.name;
                document.getElementById('crc-role-sub').innerText = data.sub;

                // Buat stat cards
                const grid = document.getElementById('crc-stats-grid');
                grid.innerHTML = '';
                data.stats.forEach(s => {
                    const card = document.createElement('div');
                    card.className = 'crc-stat-card' + (s.wide ? ' highlight' : '');
                    card.style.borderColor = s.color + '33';
                    card.innerHTML = `
                        <div class="crc-stat-label" style="color:${s.color}">${s.label}</div>
                        <div class="crc-stat-value" style="white-space:pre-line">${s.value}</div>
                    `;
                    grid.appendChild(card);
                });

                // Buat skill tags
                const skillsEl = document.getElementById('crc-skills');
                skillsEl.innerHTML = '';
                data.skills.forEach(sk => {
                    const tag = document.createElement('span');
                    tag.className = 'crc-skill-tag';
                    tag.style.background = sk.bg;
                    tag.style.color = sk.color;
                    tag.innerText = sk.label;
                    skillsEl.appendChild(tag);
                });

                // Insight
                const insightEl = document.getElementById('crc-insight');
                insightEl.style.background = data.insightBg;
                insightEl.style.borderLeft = `3px solid ${data.insightBorder}`;
                document.getElementById('crc-insight-label').style.color = data.insightColor;
                document.getElementById('crc-insight-label').innerText = data.insightLabel;
                document.getElementById('crc-insight-text').style.color = data.insightColor;
                document.getElementById('crc-insight-text').innerText = data.insight;

                // Tombol konfirmasi
                const btn = document.getElementById('crc-confirm-btn');
                btn.style.background = data.confirmColor;
                btn.style.boxShadow = `0 4px 20px ${data.confirmShadow}`;
                btn.style.color = role === 'entrepreneur' ? '#0f172a' : '#fff';

                document.getElementById('career-check-modal').classList.add('active');
                STATE.screen = 'modal';
            }

            function confirmCareerChoice() {
                document.getElementById('career-check-modal').classList.remove('active');
                STATE.screen = 'play';
                if (_pendingRole) {
                    const role = _pendingRole;
                    _pendingRole = null;
                    setRole(role);
                }
            }

            function cancelCareerCheck() {
                document.getElementById('career-check-modal').classList.remove('active');
                STATE.screen = 'play';
                _pendingRole = null;
                // Kembali ke menu pilih role
                setTimeout(() => openRoleSelection(), 200);
            }

            // ═══════════════════════════════════════════════════════════
            // 📋 POTRET MASA DEPANKU — ENGINE LAPORAN AKHIR
            // ═══════════════════════════════════════════════════════════

            // Warna tema per jalur
            const POTRET_THEME = {
                worker:       { bg: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #3b82f6 100%)', accent: '#3b82f6', light: '#dbeafe', text: '#1e40af', seal: '#1d4ed8' },
                student:      { bg: 'linear-gradient(135deg, #1a1a2e 0%, #6d28d9 60%, #8b5cf6 100%)', accent: '#8b5cf6', light: '#ede9fe', text: '#5b21b6', seal: '#6d28d9' },
                entrepreneur: { bg: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #f59e0b 100%)', accent: '#f59e0b', light: '#fef3c7', text: '#92400e', seal: '#d97706' },
                family:       { bg: 'linear-gradient(135deg, #831843 0%, #db2777 60%, #ec4899 100%)', accent: '#ec4899', light: '#fce7f3', text: '#9d174d', seal: '#be185d' },
                none:         { bg: 'linear-gradient(135deg, #1e293b 0%, #334155 60%, #475569 100%)', accent: '#94a3b8', light: '#f1f5f9', text: '#64748b', seal: '#334155' }
            };

            // Nama jalur dalam bahasa Indonesia
            const ROLE_LABEL = {
                worker: '⚔️ Pekerja (Fighter)',
                student: '🎓 Mahasiswa (Mage)',
                entrepreneur: '🏪 Wirausaha (Support)',
                family: '🏠 Keluarga (Family)',
                none: '❓ Belum Memilih'
            };

            // Definisi kompetensi yang diukur per jalur
            function getKompetensi(p) {
                const role = p.role || 'none';
                const str = p.str || 0;
                const int = p.int || 0;
                const biz = p.biz || 0;
                const rep = p.reputation || 0;
                const maxStat = 100;

                const base = [
                    { name: 'Physical Strength', label: 'STR', val: str, max: maxStat, color: '#ef4444', bg: '#fef2f2' },
                    { name: 'Intelligence',       label: 'INT', val: int, max: maxStat, color: '#3b82f6', bg: '#eff6ff' },
                    { name: 'Business Acumen',    label: 'BIZ', val: biz, max: maxStat, color: '#10b981', bg: '#f0fdf4' },
                    { name: 'Reputation / Sosial',label: 'REP', val: rep, max: 200,     color: '#ec4899', bg: '#fdf4ff' },
                ];

                // Tambah kompetensi turunan
                const journalCount = (p.reflections || []).length;
                const fishingCount = p.totalFishingCount || p.dailyFishingCount || 0;
                const houseLevel   = p.houseLevel || 1;

                base.push(
                    { name: 'Refleksi Diri',   label: '📝', val: Math.min(journalCount * 10, 100), max: 100, color: '#f59e0b', bg: '#fffbeb' },
                    { name: 'Gaya Hidup Sehat', label: '🎣', val: Math.min(fishingCount * 5, 100),  max: 100, color: '#06b6d4', bg: '#ecfeff' },
                );

                if (role === 'entrepreneur' || role === 'family') {
                    base.push({ name: 'Aset & Properti', label: '🏠', val: Math.min(houseLevel * 20, 100), max: 100, color: '#d97706', bg: '#fef3c7' });
                }
                if (role === 'worker') {
                    const bossRep = p.bossReputation || 50;
                    base.push({ name: 'Work Ethic', label: '💼', val: Math.min(bossRep, 100), max: 100, color: '#1d4ed8', bg: '#dbeafe' });
                }

                return base;
            }

            // Hitung bintang (1–5) dari nilai 0–100
            function toBintang(val, max) {
                const pct = Math.min(val / max, 1);
                const stars = Math.round(pct * 5);
                const filled = '⭐'.repeat(stars);
                const empty = '☆'.repeat(5 - stars);
                return { stars, filled, empty, pct };
            }

            // Buat teks rekomendasi personal
            function buildRekomendasi(p, kompetensi) {
                const role = p.role || 'none';
                const name = (DataService.user && DataService.user.name) ? DataService.user.name.split(' ')[0] : 'Kamu';
                const money = p.money || 0;
                const int   = p.int || 0;
                const biz   = p.biz || 0;
                const str   = p.str || 0;
                const rep   = p.reputation || 0;
                const reflCount = (p.reflections || []).length;

                // Cari kompetensi terkuat & terlemah
                const sorted = [...kompetensi].sort((a,b) => (b.val/b.max) - (a.val/a.max));
                const terkuat = sorted[0];
                const terlemah = sorted[sorted.length - 1];

                let rekom = '';

                if (role === 'entrepreneur') {
                    if (biz >= 40 && money >= 50000) {
                        rekom = `<strong>${name}</strong> menunjukkan naluri wirausaha yang kuat. Kamu sudah membuktikan bisa mengelola modal dan tumbuh. Di dunia nyata, kamu cocok mengembangkan usaha berbasis <strong>digital marketing</strong> atau <strong>kuliner kreatif</strong>.\n\nPertimbangkan ikut <strong>pelatihan UMKM Kemenkop</strong> atau program <strong>Young Entrepreneur SMK</strong> sebelum lulus.`;
                    } else if (biz < 20) {
                        rekom = `<strong>${name}</strong> memilih jalur wirausaha, namun skill bisnis masih perlu diasah. Di dunia nyata, <strong>60% UMKM gagal di tahun pertama</strong> karena lemah manajemen keuangan.\n\nRekomendasi: Pelajari <strong>pembukuan sederhana</strong> dan ikuti <strong>Prakerja digital marketing</strong> untuk memperkuat pondasimu.`;
                    } else {
                        rekom = `<strong>${name}</strong> punya potensi wirausaha yang berkembang. Fokuskan pada penguatan jaringan bisnis (REP) dan pencatatan keuangan.\n\nDi dunia nyata, pertimbangkan bergabung dengan <strong>komunitas UMKM lokal</strong> atau ikut program inkubasi bisnis SMK.`;
                    }
                } else if (role === 'worker') {
                    const bossRep = p.bossReputation || 50;
                    if (str >= 40 && bossRep >= 70) {
                        rekom = `<strong>${name}</strong> terbukti disiplin dan beretos kerja tinggi — modal terpenting di dunia kerja nyata. Dengan reputasi kerja yang baik, kamu cocok mengejar karir di bidang <strong>manufaktur, logistik, atau teknik</strong>.\n\nTingkatkan nilai dengan mengambil <strong>sertifikasi BNSP</strong> atau <strong>magang industri</strong> sebelum lulus.`;
                    } else if (bossRep < 30) {
                        rekom = `<strong>${name}</strong> perlu meningkatkan etos kerja dan kedisiplinan. Di dunia nyata, <strong>89% karyawan kehilangan pekerjaan karena soft skill</strong>, bukan karena kurang pintar.\n\nFokus pada: tepat waktu, komunikasi yang baik, dan konsistensi dalam menyelesaikan tugas.`;
                    } else {
                        rekom = `<strong>${name}</strong> menunjukkan kemampuan bekerja yang solid. Untuk naik level, pertimbangkan mengambil <strong>sertifikasi kompetensi LSP-P1</strong> yang relevan dengan jurusanmu di SMK.`;
                    }
                } else if (role === 'student') {
                    if (int >= 50) {
                        rekom = `<strong>${name}</strong> memiliki kecerdasan akademik di atas rata-rata. Berbekal INT tinggi, kamu cocok melanjutkan ke <strong>PTN favorit</strong> melalui jalur prestasi atau SNBT.\n\nPrioritaskan <strong>persiapan UTBK sejak kelas 11</strong> dan aktif di organisasi untuk memperkuat REP (soft skill).`;
                    } else if (reflCount < 3) {
                        rekom = `<strong>${name}</strong> masih perlu meningkatkan kebiasaan refleksi diri. Hanya menulis <strong>${reflCount} jurnal</strong> selama bermain — padahal refleksi adalah kunci belajar mandiri.\n\nRekomendasi: Biasakan jurnal harian dan diskusi dengan guru atau teman sebaya untuk mempercepat pertumbuhan.`;
                    } else {
                        rekom = `<strong>${name}</strong> aktif merefleksikan perjalanan belajarnya (${reflCount} jurnal). Di dunia nyata, kebiasaan ini adalah ciri pelajar mandiri yang sukses di perguruan tinggi.\n\nPertimbangkan jalur <strong>vokasi lanjut (D3/D4)</strong> yang sesuai jurusan SMK-mu.`;
                    }
                } else if (role === 'family') {
                    if (rep >= 80 && money >= 30000) {
                        rekom = `<strong>${name}</strong> berhasil menjaga keseimbangan kehidupan keluarga dan finansial — kombinasi yang langka. Di dunia nyata, kesuksesan berkeluarga butuh kematangan emosi dan finansial.\n\nRekomendasi: Pelajari <strong>perencanaan keuangan keluarga</strong> dan ikuti program <strong>BKKBN Generasi Berencana</strong>.`;
                    } else {
                        rekom = `<strong>${name}</strong> memilih jalur keluarga, namun masih ada tantangan yang belum terselesaikan. Ingat: di dunia nyata, <strong>64% perpisahan dini dipicu masalah finansial</strong>.\n\nFokuskan dulu pada: pendidikan yang selesai, karir yang stabil, lalu membangun keluarga yang siap.`;
                    }
                } else {
                    rekom = `<strong>${name}</strong> belum menentukan jalur karir secara jelas. Di dunia nyata, menunda keputusan bisa berarti kehilangan kesempatan.\n\nMulailah dengan kenali dirimu: apa yang kamu nikmati, apa keahlianmu, dan bayangkan dirimu 5 tahun ke depan.`;
                }

                // Tambah insight terlemah
                rekom += `\n\n📌 Area yang perlu dikembangkan: <strong>${terlemah.name}</strong> — tingkatkan dengan latihan konsisten.`;

                return rekom.replace(/\n/g, '<br>');
            }

            // Hitung predikat kelulusan
            function getPredikat(p) {
                const score = (p.str||0) + (p.int||0) + (p.biz||0) + Math.min(p.reputation||0, 100) + (p.level||1)*5;
                const refleksi = (p.reflections||[]).length;
                const money = p.money || 0;

                if (score >= 200 && money >= 100000 && refleksi >= 5) return { label: '🏆 MANUSIA SEUTUHNYA',       color: '#b45309' };
                if (score >= 150 && money >= 50000)                   return { label: '⭐ PRIBADI YANG BERKEMBANG',  color: '#1d4ed8' };
                if (score >= 100)                                      return { label: '📈 KARAKTER YANG MENEMPA',    color: '#059669' };
                if (score >= 60)                                       return { label: '🌱 BENIH MASA DEPAN',          color: '#d97706' };
                return                                                        { label: '🌅 MASIH DALAM PERJALANAN',   color: '#94a3b8' };
            }

            // ── FUNGSI UTAMA: Generate & Tampilkan Laporan ──
            function showPotretMasaDepan() {
                const p   = STATE.player;
                const name = (DataService.user && DataService.user.name) ? DataService.user.name : 'Siswa';
                const role = p.role || 'none';
                const theme = POTRET_THEME[role] || POTRET_THEME.none;

                // Header
                document.getElementById('potret-header').style.background = theme.bg;
                document.getElementById('potret-player-name').innerText = name.toUpperCase();
                const totalDays = STATE.day - 1;
                const year = Math.floor(totalDays / (30*4)) + 1;
                document.getElementById('potret-day-badge').innerText = `Hari ke-${totalDays} · Tahun ${year} · ${new Date().getFullYear()}`;

                // Identitas
                document.getElementById('pr-jalur').innerText = ROLE_LABEL[role] || role;
                document.getElementById('pr-days').innerText = `${totalDays} hari game`;
                document.getElementById('pr-level').innerText = `Level ${p.level || 1}`;
                document.getElementById('pr-aset').innerHTML = `<span style="color:#d97706">Rp ${(p.money||0).toLocaleString()} G</span>`;

                // Status spesial
                const statusParts = [];
                // Status pernikahan
                if (p.married) {
                    statusParts.push('💍 Sudah Menikah');
                } else if (p.divorced) {
                    const isDuda = (STATE.player.gender === 'boy');
                    statusParts.push(isDuda ? '💔 Duda' : '💔 Janda');
                } else {
                    statusParts.push('🙍 Single');
                }
                if ((p.houseLevel||1)>=3) statusParts.push(`🏠 Rumah Lv.${p.houseLevel}`);
                if (p.jobStatus === 'employed') statusParts.push('💼 Karyawan Aktif');
                if ((p.bossReputation||0) >= 80) statusParts.push('🏅 Pegawai Teladan');
                document.getElementById('pr-status').innerText = statusParts.length ? statusParts.join(' · ') : '—';
                document.getElementById('pr-row-status').style.display = statusParts.length ? 'flex' : 'none';

                const reflCount = (p.reflections || []).length;
                document.getElementById('pr-jurnal').innerText = `${reflCount} entri refleksi`;

                // Kompetensi grid
                const kompetensi = getKompetensi(p);
                const grid = document.getElementById('potret-comp-grid');
                grid.innerHTML = '';
                kompetensi.forEach(k => {
                    const b = toBintang(k.val, k.max);
                    const pct = Math.round(b.pct * 100);
                    const card = document.createElement('div');
                    card.className = 'potret-comp-card';
                    card.style.background = k.bg;
                    card.style.borderColor = k.color + '40';
                    card.innerHTML = `
                        <div class="potret-comp-name" style="color:${k.color}">${k.label} ${k.name}</div>
                        <div class="potret-bar-bg">
                            <div class="potret-bar-fill" style="width:${pct}%; background:${k.color}"></div>
                        </div>
                        <div class="potret-bar-val">${b.filled}${b.empty} ${pct}/100</div>
                    `;
                    grid.appendChild(card);
                });

                // Kuat & lemah
                const sortedComp = [...kompetensi].sort((a,b) => (b.val/b.max) - (a.val/a.max));
                const kuat   = sortedComp[0];
                const lemah  = sortedComp[sortedComp.length-1];
                const kuatPct  = Math.round((kuat.val/kuat.max)*100);
                const lemahPct = Math.round((lemah.val/lemah.max)*100);
                const bKuat  = toBintang(kuat.val, kuat.max);
                const bLemah = toBintang(lemah.val, lemah.max);

                document.getElementById('pr-kuat').innerHTML =
                    `${kuat.name} <span class="potret-stars">${bKuat.filled}</span> (${kuatPct}%)`;
                document.getElementById('pr-lemah').innerHTML =
                    `${lemah.name} <span style="color:#ef4444">${bLemah.filled}${bLemah.empty}</span> (${lemahPct}%)`;

                // Badges
                const badgeEl = document.getElementById('pr-badges');
                badgeEl.innerHTML = '';
                [
                    { cond: (p.reflections||[]).length >= 5,  label: '📝 Refleksi Aktif',    color:'#d97706', bg:'#fef3c7' },
                    { cond: (p.biz||0) >= 30,                 label: '💡 Jiwa Wirausaha',    color:'#059669', bg:'#d1fae5' },
                    { cond: (p.int||0) >= 30,                 label: '🧠 Intelek',            color:'#6d28d9', bg:'#ede9fe' },
                    { cond: (p.str||0) >= 30,                 label: '💪 Pekerja Keras',      color:'#dc2626', bg:'#fee2e2' },
                    { cond: (p.reputation||0) >= 50,          label: '🤝 Sosialita',          color:'#db2777', bg:'#fce7f3' },
                    { cond: p.married,                        label: '💍 Berkeluarga',         color:'#0369a1', bg:'#e0f2fe' },
                    { cond: (p.houseLevel||1) >= 3,           label: '🏠 Pemilik Properti',  color:'#78350f', bg:'#fef3c7' },
                    { cond: (p.bossReputation||0) >= 70,      label: '🏅 Teladan Kerja',      color:'#1d4ed8', bg:'#dbeafe' },
                ].filter(b => b.cond).forEach(b => {
                    const span = document.createElement('span');
                    span.className = 'potret-badge';
                    span.style.color = b.color;
                    span.style.background = b.bg;
                    span.innerText = b.label;
                    badgeEl.appendChild(span);
                });

                // Rekomendasi
                document.getElementById('potret-rekomendasi').style.borderLeftColor = theme.accent;
                document.getElementById('pr-rekom').innerHTML = buildRekomendasi(p, kompetensi);

                // Predikat & Seal
                const predikat = getPredikat(p);
                document.getElementById('pr-predikat').innerText = predikat.label;
                document.getElementById('pr-predikat').style.color = predikat.color;
                document.getElementById('pr-seal-circle').style.borderColor = theme.seal;
                document.getElementById('pr-seal-circle').style.color = theme.seal;
                document.getElementById('pr-seal-year').innerText = new Date().getFullYear();

                // Tampilkan modal
                document.getElementById('potret-modal').classList.add('active');
                STATE.screen = 'modal';
            }

            function closePotret() {
                document.getElementById('potret-modal').classList.remove('active');
                STATE.screen = 'play';
            }

            // Salin teks laporan ke clipboard
            function sharePotret() {
                const p    = STATE.player;
                const name = (DataService.user && DataService.user.name) ? DataService.user.name : 'Siswa';
                const role = ROLE_LABEL[p.role] || '?';
                const pred = getPredikat(p);
                const kompetensi = getKompetensi(p);
                const sorted = [...kompetensi].sort((a,b)=>(b.val/b.max)-(a.val/a.max));
                const kuat  = sorted[0];
                const lemah = sorted[sorted.length-1];
                const bKuat  = toBintang(kuat.val, kuat.max);
                const bLemah = toBintang(lemah.val, lemah.max);

                const teks =
`━━━━━━━━━━━━━━━━━━━━━━━
POTRET MASA DEPANKU: ${name.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━
Jalur yang dipilih : ${role}
Aset akhir         : Rp ${(p.money||0).toLocaleString()} G
Level              : ${p.level || 1}
Predikat           : ${pred.label}
━━━━━━━━━━━━━━━━━━━━━━━
Kompetensi kuat    : ${kuat.name} ${bKuat.filled} (${Math.round((kuat.val/kuat.max)*100)}%)
Perlu dikembangkan : ${lemah.name} ${bLemah.filled} (${Math.round((lemah.val/lemah.max)*100)}%)
Jurnal refleksi    : ${(p.reflections||[]).length} entri
━━━━━━━━━━━━━━━━━━━━━━━
🎓 Rekomendasi Mentor:
${document.getElementById('pr-rekom').innerText.substring(0,180)}...
━━━━━━━━━━━━━━━━━━━━━━━
[ Nusantara Arsa · ${new Date().getFullYear()} ]`;

                navigator.clipboard.writeText(teks)
                    .then(() => showToast('✅ Laporan tersalin ke clipboard!'))
                    .catch(() => showToast('❌ Salin gagal, coba cetak langsung.'));
            }

            function togglePhone() {
                const modal = document.getElementById('phone-modal');
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    STATE.screen = 'play';
                } else {
                    modal.style.display = 'flex';
                    STATE.screen = 'modal';
                    // Reset Notif
                    document.getElementById('phone-btn').classList.remove('phone-ringing');
                    // Update Jam
                    const h = Math.floor(STATE.time / 100).toString().padStart(2, '0');
                    const m = Math.floor((STATE.time % 100) * 0.6).toString().padStart(2, '0');
                    document.getElementById('phone-clock').innerText = `${h}:${m}`;

                    // FIX: Reset View Pastikan Home nyala, yang lain MATI semua
                    document.getElementById('phone-screen-home').style.display = 'block';
                    document.getElementById('phone-screen-sosmed').style.display = 'none';
                    document.getElementById('phone-screen-messages').style.display = 'none';
                    document.getElementById('phone-screen-bank').style.display = 'none';
                }
            }

            // --- FIX: FUNGSI TOMBOL HOME/BACK DI HP ---
            function closePhoneApp() {
                // Sembunyikan SEMUA aplikasi yang mungkin terbuka
                document.getElementById('phone-screen-sosmed').style.display = 'none';
                document.getElementById('phone-screen-messages').style.display = 'none';
                document.getElementById('phone-screen-bank').style.display = 'none';

                // Tampilkan kembali layar utama HP
                document.getElementById('phone-screen-home').style.display = 'block';
            }

            // --- QUICK PET SWITCH (dipanggil dari tap ikon pet di HUD) ---
            function openQuickPetSwitch() {
                const p = STATE.player;
                const myPets = p.pets || [];
                if (myPets.length === 0) {
                    showToast('Belum punya pet! Temui Satria (Ksatria) untuk beli pet.');
                    return;
                }
                if (myPets.length === 1) {
                    const pet = PET_CATALOG[myPets[0]];
                    showToast(`${pet ? pet.emoji + ' ' + pet.name : 'Pet'} adalah satu-satunya petmu!`);
                    return;
                }
                // Tampilkan menu ganti pet (tanpa NPC)
                showPetSwitchMenu(null);
            }

            // --- NEW: FUNGSI BUKA APLIKASI PESAN DI DALAM HP ---
            function openMessagesApp() {
                document.getElementById('phone-screen-home').style.display = 'none';
                document.getElementById('phone-screen-messages').style.display = 'block';

                const list = document.getElementById('phone-messages-list');
                const msgs = STATE.player.messages || [];

                list.innerHTML = '';

                if (msgs.length === 0) {
                    list.innerHTML = '<div style="text-align:center; color:#94a3b8; padding:20px; font-size:12px;">Kotak masuk kosong.</div>';
                } else {
                    // Tampilkan pesan terbaru di atas (Reverse)
                    [...msgs].reverse().forEach(m => {
                        // Format Waktu Simpel
                        let dateStr = "Baru saja";
                        if (m.time) {
                            const date = new Date(m.time);
                            // Format: HH:MM
                            dateStr = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                        }

                        const bubble = document.createElement('div');
                        // Style ala Bubble Chat
                        bubble.style.cssText = `
                background: #fff; 
                padding: 10px; 
                margin-bottom: 8px; 
                border-radius: 0 12px 12px 12px; 
                border-left: 4px solid #3b82f6; 
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                font-family: 'Exo 2', sans-serif;
            `;

                        bubble.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; align-items:center;">
                    <span style="font-weight:bold; color:#3b82f6; font-size:11px;">👩‍🏫 ${m.from || 'Guru Pembimbing'}</span>
                    <span style="font-size:9px; color:#94a3b8;">${dateStr}</span>
                </div>
                <div style="font-size:12px; color:#334155; line-height:1.4;">${m.text}</div>
            `;
                        list.appendChild(bubble);
                    });

                    // Tandai semua dibaca saat membuka aplikasi
                    STATE.player.messages.forEach(m => m.read = true);
                }
            }

            // --- FIX: FUNGSI BUKA PESAN DARI HP ---
            function openMessageArchiveFromPhone() {
                togglePhone(); // Tutup HP dulu karena Arsip Pesan adalah Overlay besar
                setTimeout(() => openMessageArchive(), 200); // Buka arsip pesan
            }

            function openSosmedApp() {
                document.getElementById('phone-screen-home').style.display = 'none';
                document.getElementById('phone-screen-sosmed').style.display = 'block';

                const feed = document.getElementById('viral-news-feed');
                feed.innerHTML = '';

                if (STATE.viral.active) {
                    const t = STATE.viral.active;
                    feed.innerHTML = `
            <div class="news-card">
                <span class="news-tag">🔥 VIRAL NOW</span>
                <div class="news-title">${t.newsTitle}</div>
                <div class="news-body">${t.newsBody}</div>
                <div style="margin-top:10px; font-size:10px; background:#e2e8f0; padding:5px; border-radius:4px;">
                    <strong>TIPS BISNIS:</strong><br>
                    Harga jual <b>${t.itemName}</b> naik 300% hari ini!<br>
                    (Beli di Pedagang, Jual di Merchant)
                </div>
            </div>
        `;
                } else {
                    feed.innerHTML = `<div style="text-align:center; padding:20px; color:#64748b;">Tidak ada tren viral hari ini.</div>`;
                }
            }


            // ==========================================
            // 3. LOGIKA INTERAKSI (YANG DIGABUNGKAN)
            // ==========================================

            // Fungsi Beli Barang Viral (Dipanggil dari interactNPC)
            function buyViralItem(itemId, price, qty) {
                const cost = price * qty;
                if (STATE.player.money >= cost) {
                    STATE.player.money -= cost;
                    if (!STATE.player.inventory[itemId]) STATE.player.inventory[itemId] = 0;
                    STATE.player.inventory[itemId] += qty;
                    showToast(`Membeli ${qty} item!`);
                    updateMoneyUI();
                    closeDialogue();
                } else {
                    showToast("Uang tidak cukup!");
                }
            }

            // Fungsi Jual Barang Viral (Dipanggil dari interactNPC)
            function sellViralItem(itemId, price, qty) {
                if (STATE.player.inventory[itemId] >= qty) {
                    STATE.player.inventory[itemId] -= qty;
                    const total = price * qty;
                    STATE.player.money += total;
                    if (STATE.player.inventory[itemId] <= 0) delete STATE.player.inventory[itemId];
                    // Track untuk bonus quest harian
                    STATE.player.dailySellCount = (STATE.player.dailySellCount || 0) + 1;

                    showToast(`CUAN BESAR! +${total} G`);
                    updateMoneyUI();
                    closeDialogue();
                }
            }

            function updateMoneyUI() {
                document.getElementById('money-display').innerText = STATE.player.money;
            }



            // --- NEW: FUNGSI APLIKASI BANKING ---
            function openBankApp() {
                document.getElementById('phone-screen-home').style.display = 'none';
                document.getElementById('phone-screen-bank').style.display = 'block';

                // 1. Update Saldo
                const balance = STATE.player.money || 0;
                document.getElementById('bank-balance-display').innerText = balance.toLocaleString('id-ID');

                // 2. Generate Dummy History (Mutasi)
                // Karena kita tidak menyimpan log transaksi detail, kita buat dummy berdasarkan aktivitas terakhir
                const historyList = document.getElementById('bank-history-list');
                historyList.innerHTML = '';

                // Buat data dummy yang terlihat realistis
                const transactions = [
                    { desc: "Bunga Tabungan", amount: Math.floor(balance * 0.001), type: "in", date: "Hari Ini" },
                    { desc: "Biaya Admin", amount: 500, type: "out", date: "Kemarin" },
                ];

                // Tambahkan histori kerja jika ada
                if (STATE.player.jobStatus === 'employed') {
                    transactions.unshift({ desc: "Gaji Harian", amount: 5000 + (STATE.player.jobLevel * 2000), type: "in", date: "Hari Ini" });
                }

                transactions.forEach(trx => {
                    const item = document.createElement('div');
                    item.className = 'trx-item';
                    item.innerHTML = `
            <div>
                <div class="trx-date">${trx.date}</div>
                <div class="trx-desc">${trx.desc}</div>
            </div>
            <div class="trx-amount ${trx.type === 'in' ? 'trx-in' : 'trx-out'}">
			${trx.type === 'in' ? '+' : '-'} Rp ${trx.amount.toLocaleString('id-ID')}
            </div>
        `;
                    historyList.appendChild(item);
                });
            }


            // ═══════════════════════════════════════════
