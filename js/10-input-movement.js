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

