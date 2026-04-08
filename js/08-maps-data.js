// ══════════════════════════════════════════════════════════════
// Data Peta + Fairy Village Map
// File: js/08-maps-data.js
// ══════════════════════════════════════════════════════════════
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

            // UPDATE: INIT GAME MENJADI ASYNC UNTUK MEMASTIKAN KONEKSI
            async function initGame() {
                try {
                    resize();
                    await DataService.init(true);

                    // FIX: Pastikan semua layar overlay tersembunyi & canvas visible
                    document.getElementById('start-screen').classList.add('hidden');
                    ['login-screen','title-screen','prologue-screen','gender-screen'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) { el.style.display = 'none'; el.classList.add('hidden'); }
                    });

                    // FIX: Pastikan canvas & ui-layer tampil
                    const gcCanvas = document.getElementById('gameCanvas');
                    if (gcCanvas) gcCanvas.style.display = 'block';
                    const uiLayer = document.getElementById('ui-layer');
                    if (uiLayer) { uiLayer.style.display = 'flex'; uiLayer.classList.remove('hidden'); }

                    AudioService.stopBGM();

                    // FIX: Cancel game loop lama agar tidak ada dua loop berjalan bersamaan
                    if (window.gameLoopId) {
                        cancelAnimationFrame(window.gameLoopId);
                        window.gameLoopId = null;
                    }
                    if (window.saveIntervalId) {
                        clearInterval(window.saveIntervalId);
                        window.saveIntervalId = null;
                    }

                    const saved = DataService.loadGame();
                    if (saved) {
                        STATE.day = parseInt(saved.day) || 1;
                        STATE.time = saved.time !== undefined ? saved.time : 600;
                        STATE.season = saved.season || 'spring';
                        STATE.weather = saved.weather || 'clear';

                        STATE.player.hp = saved.hp !== undefined ? saved.hp : 100;
                        STATE.player.maxHp = saved.maxHp || 100;
                        STATE.player.energy = saved.energy !== undefined ? saved.energy : 100;
                        STATE.player.money = saved.money !== undefined ? saved.money : 10000;
                        STATE.player.level = saved.level || 1;
                        STATE.player.exp = saved.exp || 0;

                        STATE.player.str = saved.str || 5;
                        STATE.player.int = saved.int || 5;
                        STATE.player.biz = saved.biz || 0;
                        STATE.player.reputation = saved.reputation || 0;
                        STATE.player.ethics = saved.ethics || 100;

                        STATE.player.role = saved.role || 'none';
                        STATE.player.major = saved.major || null;
                        STATE.player.scholarship = saved.scholarship || false;
                        STATE.player.jobStatus = saved.jobStatus || 'unemployed';
                        STATE.player.bossReputation = saved.bossReputation || 50;
                        STATE.player.jobLevel = saved.jobLevel || 1;

                        STATE.player.shiftStarted = saved.shiftStarted || false;
                        STATE.player.salaryDays = saved.salaryDays || 0;
                        STATE.player.lastAttendanceDay = saved.lastAttendanceDay || 0;

                        // LOAD JOB DISCOVERY
                        STATE.player.knownJobs = saved.knownJobs || [];
                        STATE.player.jobSearchCount = saved.jobSearchCount || 0;
                        STATE.player.lastJobSearchDay = saved.lastJobSearchDay || 0;

                        // LOAD PART-TIME STATE
                        STATE.player.partTimeJob = saved.partTimeJob || null;
                        STATE.player.partTimeStatus = saved.partTimeStatus || 'none';
                        STATE.player.partTimeShiftStarted = saved.partTimeShiftStarted || false;
                        STATE.player.partTimeLastWorkedDay = saved.partTimeLastWorkedDay || 0;
                        STATE.player.partTimeSalaryDays = saved.partTimeSalaryDays || 0;
                        STATE.player.todayConflict = saved.todayConflict || null;
                        STATE.player.lastRepThreshDay = saved.lastRepThreshDay || null;
                        STATE.player.shownStudentConflicts = saved.shownStudentConflicts || [];
                        STATE.player.shownEntrepreneurConflicts = saved.shownEntrepreneurConflicts || [];

                        if (STATE.day === 1 && STATE.player.role === 'none') {
                            STATE.isPrologue = true;
                            STATE.time = 600;
                        } else {
                            STATE.isPrologue = saved.isPrologue !== undefined ? saved.isPrologue : false;
                        }

                        STATE.player.inventory = saved.inventory || {};
                        STATE.player.furniture = saved.furniture || [];
                        STATE.player.houseLevel = saved.houseLevel || 1;
                        STATE.player.hiredDwarf = saved.hiredDwarf || false;
                        STATE.player.hiredFairy = saved.hiredFairy || false;

                        // --- LOAD DATA PET ---
                        STATE.player.pets = saved.pets || [];
                        STATE.player.activePet = saved.activePet || null;
                        // Load gift year flags agar tidak bisa ambil hadiah berkali-kali
                        STATE.player.lastHarvestGiftYear = saved.lastHarvestGiftYear || 0;
                        STATE.player.lastGrapeGiftYear = saved.lastGrapeGiftYear || 0;
                        STATE.player.lastResolutionYear = saved.lastResolutionYear || 0;

                        STATE.player.relationships = saved.relationships || {};
                        STATE.player.married = saved.married || false;
                        STATE.player.spouseId = saved.spouseId || null;
                        STATE.player.modinVisited = saved.modinVisited || false;
                        STATE.player.divorced = saved.divorced || false;

                        STATE.player.activeQuest = saved.activeQuest || null;
                        STATE.questProgress = saved.questProgress || {};
                        STATE.dungeonLevel = saved.dungeonLevel || 1;

                        STATE.player.lastDailyClaim = saved.lastDailyClaim || 0;
                        STATE.player.lastWeeklyClaim = saved.lastWeeklyClaim || 0;
                        STATE.player.lastMonthlyClaim = saved.lastMonthlyClaim || 0;
                        STATE.player.claimedLifeTrial = saved.claimedLifeTrial || false;

                        STATE.player.learnedSubjects = saved.learnedSubjects || [];
                        STATE.player.achievementPoints = saved.achievementPoints || 0;
                        STATE.player.portfolioItems = saved.portfolioItems || [];

                        STATE.player.hasSeenDungeonTutorial = saved.hasSeenDungeonTutorial || false;
                        STATE.player.hasSeenFishingTutorial = saved.hasSeenFishingTutorial || false;

                        // --- FIX: Syntax Error Diperbaiki (Menggunakan Assignment =) ---
                        STATE.player.dailyFishingCount = saved.dailyFishingCount || 0;
                        STATE.player.dailyMonsterKills = saved.dailyMonsterKills || 0;
                        STATE.player.dailyTalkCount = saved.dailyTalkCount || 0;
                        STATE.player.dailyHarvestCount = saved.dailyHarvestCount || 0;
                        // NPC LAST TALK DAY
                        STATE.player.npcLastTalkDay = saved.npcLastTalkDay || {};
                        // TOTAL LIFETIME COUNTERS (untuk Milestone Quest Tahunan)
                        STATE.player.totalFishingCount  = saved.totalFishingCount  || 0;
                        STATE.player.totalMonsterKills  = saved.totalMonsterKills  || 0;
                        STATE.player.totalSellCount     = saved.totalSellCount     || 0;
                        // MILESTONE CLAIMS
                        STATE.player.claimedYear1 = saved.claimedYear1 || false;
                        STATE.player.claimedYear2 = saved.claimedYear2 || false;
                        STATE.player.claimedYear3 = saved.claimedYear3 || false;
                        STATE.player.claimedYear4 = saved.claimedYear4 || false;
                        STATE.player.claimedYear5 = saved.claimedYear5 || false;
                        STATE.player.honorTitle   = saved.honorTitle   || null;

                        // --- FIX: Syntax Error Diperbaiki ---
                        STATE.player.spouseWorkStatus = saved.spouseWorkStatus || 'home';
                        STATE.player.homeRole = saved.homeRole || 'homemaker'; // 'homemaker' = urus RT, 'worker' = kerja luar
                        STATE.player.spouseAngry = saved.spouseAngry || false;
                        // Load marriage conflict system
                        STATE.player.marriedDay = saved.marriedDay || 0;
                        STATE.player.marriageMonth = saved.marriageMonth || 1;
                        STATE.player.marriageConflictLevel = saved.marriageConflictLevel || 0;
                        STATE.player.lastConflictDay = saved.lastConflictDay || 0;
                        STATE.player.monthlyExpenses = saved.monthlyExpenses || 0;
                        STATE.player.lastMarriageBillDay = saved.lastMarriageBillDay || 0;

                        // --- RESTORE BIRTHDAY & SOCIAL REWARD FLAGS ---
                        // Semua key yang berawalan 'birthdayGifted_' dan 'socialRewarded_' disimpan dinamis
                        Object.keys(saved).forEach(key => {
                            if (key.startsWith('birthdayGifted_') || key.startsWith('socialRewarded_')) {
                                STATE.player[key] = saved[key];
                            }
                        });

                        // --- SYNC STATUS KERJA PASANGAN DENGAN WAKTU SAAT LOAD ---
                        if (STATE.player.married && STATE.player.role === 'family') {
                            if (STATE.time >= 730 && STATE.time < 1600) {
                                STATE.player.spouseWorkStatus = 'working';
                            } else {
                                STATE.player.spouseWorkStatus = 'home';
                            }
                        }

                        STATE.viral = saved.viral || { active: null, day: 0 };

                        STATE.player.attackCooldown = 0;
                        STATE.player.isAttacking = false;

                        const genderToLoad = saved.gender || 'boy';
                        selectGender(genderToLoad, true);

                        // Load Outfit
                        STATE.player.outfit = saved.outfit || 'default';
                        if (STATE.player.outfit !== 'default') {
                            let suffix = "";
                            if (STATE.player.outfit === 'wedding') suffix = "-weding";
                            else if (STATE.player.outfit === 'armor') suffix = "-armor";
                            else if (STATE.player.outfit === 'special') suffix = "-special";
                            else if (STATE.player.outfit === 'gempita') suffix = "-special"; // fallback ke special

                            const p = STATE.player;
                            const g = genderToLoad;
                            if (p.spriteIdle) p.spriteIdle.src = `images/${g}-idle${suffix}.png`;
                            if (p.spriteWalk) p.spriteWalk.src = `images/${g}-walk${suffix}.png`;
                            if (p.spriteWalkUp) p.spriteWalkUp.src = `images/${g}-atas${suffix}.png`;
                            if (p.spriteWalkDown) p.spriteWalkDown.src = `images/${g}-bawah${suffix}.png`;
                            if (p.spriteAttack) p.spriteAttack.src = `images/${g}-pukul${suffix}.png`;
                        }

                        if (!saved.weather) randomizeWeather();

                        showToast("System: Data Loaded Completely");
                    } else {
                        if (!STATE.player.spriteIdle) selectGender('boy', true);
                        STATE.isPrologue = true;
                        STATE.gameOverTriggered = false;
                        STATE.gameFinished = false;
                        STATE.freeRoamMode = false;
                        STATE.day = 1;
                        STATE.time = 600;
                        STATE.player.role = 'none';
                        STATE.player.money = 10000;
                        randomizeWeather();
                    }

                    if (DataService.user && DataService.user.role === 'siswa') {
                        DataService.startMessageListener();
                        DataService.startGhostListener();
                        if (DataService.user.mentor) {
                            const realMentorName = await DataService.getMentorName(DataService.user.mentor);
                            STATE.mentorName = realMentorName;
                        }
                    }

                    regenerateHouseMap();
                    updateBagIcon();
                    // Show house level HUD indicator when inside house
                    updateHouseLevelHUD();
                    updatePetHUD(); // Tampilkan pet HUD jika ada pet aktif

                    try {
                        if (document.documentElement.requestFullscreen) {
                            document.documentElement.requestFullscreen().catch((e) => { });
                        }
                    } catch (e) { }

                    STATE.screen = 'play';
                    STATE.location = 'house';

                    // Tampilkan minimap & pet HUD hanya saat ingame
                    const minimapEl = document.getElementById('minimap-container');
                    if (minimapEl) minimapEl.classList.add('ingame');
                    const petHudEl = document.getElementById('pet-hud-indicator');
                    if (petHudEl) petHudEl.classList.add('visible');
                    setTimeout(() => updateMentorBubble(), 500); // Init bubble mentor

                    const hMap = maps['house'];
                    if (hMap) {
                        STATE.player.x = Math.floor(hMap.w / 2) * TILE_SIZE;
                        STATE.player.y = (hMap.h - 3) * TILE_SIZE;
                    } else {
                        STATE.player.x = 100; STATE.player.y = 100;
                    }

                    setTimeout(resize, 100);
                    setTimeout(resize, 500);
                    setTimeout(resize, 1500);

                    // Terapkan debug mode HUD sesuai pengaturan admin
                    applyDebugModeToHUD();

                    gameLoop();

                    ['village', 'mentor_interior'].forEach(mapName => {
                        const map = maps[mapName];
                        if (map && map.npcs) {
                            const mentorNPC = map.npcs.find(n => n.id === 'mentor');
                            if (mentorNPC) {
                                mentorNPC.name = STATE.mentorName;
                            }
                        }
                    });

                    if (STATE.isPrologue) {
                        if (hMap) {
                            STATE.player.x = Math.floor(hMap.w / 2) * TILE_SIZE;
                            STATE.player.y = 4 * TILE_SIZE;
                        }
                        setTimeout(() => startWakeUpSequence(), 1500);
                    } else {
                        setTimeout(() => showDailyQuestPopup(), 1000);
                        updateHUDInfo();
                    }

                    // FIX BUG 3: Interval 10 detik, simpan di screen apapun (tidak hanya 'play')
                    window.saveIntervalId = setInterval(async () => {
                        const activeScreen = STATE.screen;
                        // Simpan selama game aktif (play, modal, dialogue, minigame, cutscene)
                        const isIngame = ['play','modal','dialogue','minigame','cutscene'].includes(activeScreen);
                        if (isIngame && !STATE.isPrologue) {
                            await manualSave();
                            // Autosave indicator
                            const ind = document.getElementById('autosave-indicator');
                            if (ind) {
                                ind.style.opacity = '1';
                                setTimeout(() => { ind.style.opacity = '0'; }, 1200);
                            }
                        }
                    }, 10000); // FIX: 10 detik (lebih sering dari 15)

                    // FIX BUG 4: onbeforeunload tidak bisa async — pakai sync localStorage saja
                    // Cloud save sudah otomatis tiap 10 detik, ini hanya backup lokal terakhir
                    window.onbeforeunload = () => {
                        try {
                            // Sync save ke localStorage langsung (tanpa cloud, karena tab mau tutup)
                            const gameState = {};
                            // Ambil data penting secara langsung tanpa async
                            const dbLocal = DataService.getDB();
                            if (DataService.user && dbLocal[DataService.user.email]) {
                                const existing = dbLocal[DataService.user.email].saveData || {};
                                // Update timestamp saja — data sudah ter-save tiap 10 detik
                                existing.lastActive = Date.now();
                                dbLocal[DataService.user.email].saveData = existing;
                                DataService.saveDB(dbLocal);
                            }
                        } catch(e) {}
                    };

                } catch (err) {
                    console.error("CRITICAL ERROR IN INITGAME:", err);
                    alert("Terjadi kesalahan saat memuat game. Coba refresh halaman.\nError: " + err.message);
                }
            }

            // --- NEW: TUTORIAL HELPER FUNCTIONS ---
            function updateHouseLevelHUD() {
                let el = document.getElementById('house-level-hud');
                if (!el) {
                    el = document.createElement('div');
                    el.id = 'house-level-hud';
                    el.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,0.82);color:#fbbf24;font-family:Fredoka,sans-serif;font-size:13px;padding:4px 16px;border-radius:20px;border:1.5px solid #fbbf24;pointer-events:none;z-index:500;display:none;letter-spacing:0.5px;';
                    document.getElementById('game-container').appendChild(el);
                }
                if (STATE.location === 'house') {
                    const hl = STATE.player.houseLevel || 1;
                    const icons = ['🪵','🏡','🏠','🏰','🏯'];
                    el.innerText = `${icons[hl-1]} Rumah Level ${hl}`;
                    el.style.display = 'block';
                    setTimeout(() => { if (el) el.style.display = 'none'; }, 3000);
                } else {
                    el.style.display = 'none';
                }
            }

            function showTutorialFocus(elementId, labelText = null) {
                // 1. Hapus highlight lama
                document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));

                // Pastikan tidak ada target in-game yang aktif agar tidak konflik
                STATE.tutorialFocusTarget = null;

                const target = document.getElementById(elementId);
                const pointer = document.getElementById('tutorial-pointer');
                const label = document.getElementById('pointer-label');

                if (target && pointer) {
                    // 2. Tambah efek highlight ke target
                    target.classList.add('tutorial-highlight');

                    // UPDATE: Set Teks Label (atau sembunyikan jika null)
                    if (label) {
                        if (labelText) {
                            label.innerText = labelText;
                            label.style.display = 'block';
                        } else {
                            label.style.display = 'none';
                        }
                    }

                    // 3. Pindahkan Tangan Penunjuk
                    const rect = target.getBoundingClientRect();
                    // Hitung posisi tengah elemen
                    const centerX = rect.left + (rect.width / 2);
                    const centerY = rect.top + (rect.height / 2);

                    // Reset transform scale ke normal (1) untuk elemen UI
                    pointer.style.transform = "scale(1)";

                    // Atur posisi tangan (sedikit di bawah elemen)
                    // UPDATE: Offset disesuaikan karena ada teks label di atas tangan
                    pointer.style.left = (centerX - 35) + 'px'; // Center horizontal (width ~70px)
                    pointer.style.top = (centerY + 30) + 'px';  // Di bawah elemen

                    pointer.style.display = 'flex'; // Ganti block jadi flex
                }
            }

            // --- NEW HELPER: FOKUS KE OBJEK DALAM GAME (CANVAS) ---
            function showInGameFocus(tileX, tileY, labelText = null) {
                // 1. Hapus highlight UI lama
                document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));

                const pointer = document.getElementById('tutorial-pointer');
                const label = document.getElementById('pointer-label');

                if (pointer) {
                    // 2. Set State Target agar di-update terus menerus di Game Loop
                    STATE.tutorialFocusTarget = { x: tileX, y: tileY };

                    // UPDATE: Set Teks Label
                    if (label) {
                        if (labelText) {
                            label.innerText = labelText;
                            label.style.display = 'block';
                        } else {
                            label.style.display = 'none';
                        }
                    }

                    pointer.style.display = 'flex'; // Ganti block jadi flex

                    // 3. Panggil update sekali secara manual agar langsung muncul di posisi awal (mencegah flicker)
                    updateTutorialPointerPosition();
                }
            }

            function clearTutorialFocus() {
                document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
                const pointer = document.getElementById('tutorial-pointer');
                if (pointer) pointer.style.display = 'none';

                // Reset Target Live Tracking
                STATE.tutorialFocusTarget = null;

                // Kembalikan tombol aksi ke state normal
                const btn = document.getElementById('btn-action');
                if (btn) btn.style.animation = '';
            }

            // --- NEW FUNCTION: UPDATE POSISI POINTER (DIPANGGIL TIAP FRAME) ---
            function updateTutorialPointerPosition() {
                if (!STATE.tutorialFocusTarget) return;

                const pointer = document.getElementById('tutorial-pointer');
                if (!pointer) return;

                // 1. Hitung Scale Factor Real-time
                const scaleFactor = canvas.width / GAME_WIDTH;

                // 2. Ambil Target Tile dari State
                const tileX = STATE.tutorialFocusTarget.x;
                const tileY = STATE.tutorialFocusTarget.y;

                // 3. Hitung Posisi Dunia (Tengah Tile)
                const worldX = (tileX * TILE_SIZE) + (TILE_SIZE / 2);
                const worldY = (tileY * TILE_SIZE) + (TILE_SIZE / 2);

                // 4. Proyeksikan ke Layar (Dikurangi Kamera Saat Ini)
                // FIX: Menggunakan STATE.camera yang selalu update
                const screenX = (worldX - STATE.camera.x) * scaleFactor;
                const screenY = (worldY - STATE.camera.y) * scaleFactor;

                // 5. Update Posisi DOM Element
                // UPDATE: Penyesuaian Offset dan Scale agar pas dengan Zoom Out

                // Offset horizontal (tengah pointer structure)
                // Structure width sekitar 80px (label + padding), jadi offset -40px
                const xOffset = -40;

                // Offset vertikal dinamis (menyesuaikan scale)
                // Semakin kecil scale (zoom out), jarak offset harus disesuaikan agar tidak terlalu jauh
                // Posisi di ATAS tile (karena telunjuk ke bawah/atas) atau DI BAWAH?
                // Icon 👆 menunjuk ke ATAS. Jadi pointer harus ditaruh DI BAWAH target.
                const yOffset = 15 * scaleFactor;

                pointer.style.left = (screenX + xOffset) + 'px';
                pointer.style.top = (screenY + yOffset) + 'px';

                // UPDATE: Skala Ukuran Pointer
                // Agar pointer tidak terlihat raksasa saat kamera zoom out jauh
                // Base scale 1.0, dikalikan faktor zoom dengan clamping
                let dynamicScale = scaleFactor * 0.45;
                // Batasi minimal 0.7 dan maksimal 1.1
                dynamicScale = Math.max(0.7, Math.min(1.1, dynamicScale));

                pointer.style.transform = `scale(${dynamicScale})`;
            }

            function resetInputs() {
                // Reset Keyboard
                Object.keys(keys).forEach(key => keys[key] = false);
                // Reset Touch Joystick
                inputState.active = false;
                inputState.x = 0;
                inputState.y = 0;
            }

            function startWakeUpSequence() {
                // FIX: Kunci pintu saat tutorial dimulai
                STATE.tutorialIndoorComplete = false;

                showToast("🔊 *TOK TOK TOK*");
                if (typeof AudioService !== 'undefined') AudioService.playSFX('knock'); // Play SFX Ketukan
                setTimeout(() => {
                    // UPDATE: Ganti "???" dengan nama mentor dinamis jika perlu, atau biarkan misterius
                    showDialogue("???", "Halo? Nak? Kamu sudah bangun? Hari ini hari pertamamu!", [
                        {
                            text: "(Bangun dari tempat tidur)",
                            action: () => {
                                closeDialogue();

                                // --- START VISUAL TUTORIAL ---
                                setTimeout(() => {
                                    const targetX = 6;
                                    const targetY = 5;

                                    showDialogue("🎮 GERAK",
                                        "📱 HP/Tablet: Geser jari (Joystick)\n💻 PC: WASD atau Tombol Panah\n\n➡️ Jalan ke titik yang ditunjuk!",
                                        [{
                                            text: "Siap! ▶",
                                            action: () => {
                                                closeDialogue();
                                                showInGameFocus(targetX, targetY, "JALAN KESINI 🏃");
                                                showToast("BERJALANLAH KE ARAH TANGAN 👆");

                                                const checkTargetInterval = setInterval(() => {
                                                    const pX = STATE.player.x + (STATE.player.w / 2);
                                                    const pY = STATE.player.y + (STATE.player.h / 2);
                                                    const tX = (targetX * TILE_SIZE) + (TILE_SIZE / 2);
                                                    const tY = (targetY * TILE_SIZE) + (TILE_SIZE / 2);
                                                    const dist = Math.hypot(pX - tX, pY - tY);

                                                    if (dist < 40) {
                                                        clearInterval(checkTargetInterval);
                                                        clearTutorialFocus();
                                                        showToast("BAGUS! ✅");
                                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                                        createParticle(pX, pY, '#4ade80');
                                                        setTimeout(() => {
                                                            resetInputs();
                                                            continueTutorialStep2();
                                                        }, 800);
                                                    }
                                                    if (STATE.screen !== 'play') clearInterval(checkTargetInterval);
                                                }, 200);
                                            }
                                        }]);
                                }, 500);
                            }
                        }
                    ], null);
                }, 1500);
            }

            // TUTORIAL STEP 2 ONWARDS
            function continueTutorialStep2() {
                // STEP 2: TOMBOL AKSI
                const btnAction = document.getElementById('btn-action');
                btnAction.style.display = 'flex';
                btnAction.innerText = '🔴';
                showTutorialFocus('btn-action', "TEKAN INI");

                showDialogue("🔴 TOMBOL AKSI", "Tombol bulat ini adalah tombol interaksi.\n\nFungsinya berubah otomatis:\n💬 Bicara dengan NPC\n🚪 Masuk/Keluar bangunan\n🌾 Berkebun & panen\n📬 Cek surat & papan info\n\n(Fungsi serang ⚔️ akan aktif otomatis saat masuk Dungeon)", [
                    {
                        text: "Oke! ▶",
                        action: () => {
                            btnAction.style.display = 'none';
                            continueTutorialStep4();
                        }
                    }
                ]);
            }

            function continueTutorialStep4() {
                showTutorialFocus('bag-btn', "BUKA TAS");
                showDialogue("🎒 TAS & JURNAL",
                    "🎒 Tas: Lihat & gunakan item.\n📜 Quest: Cek misi harian & target hidup.\n\nSelesaikan misi → dapat Gold & EXP!",
                    [{ text: "Mengerti! ▶", action: () => { continueTutorialStep6(); } }]
                );
            }

            function continueTutorialStep6() {
                tutorialStep_Calendar();
            }

            // --- REFACTORED TUTORIAL STEPS (CHAINED) ---

            function tutorialStep_Calendar() {
                showInGameFocus(10, 0, "KALENDER");
                showDialogue("📅 KALENDER",
                    "Kalender dinding = cek Tanggal, Musim & jadwal Festival/Ulang Tahun Warga.\n\nDatangi festival → hadiah langka!",
                    [{ text: "Oke! ▶", action: () => { tutorialStep_Stats(); } }]
                );
            }

            function tutorialStep_Stats() {
                showTutorialFocus('hud-profile-box', "STATUS");
                showDialogue("📊 STATUS",
                    "Tap foto profil → lihat Kartu Pelajar & stat lengkap.\n\n💪STR · 🧠INT · ❤️REP · 📈BIZ\n\nTingkatkan sesuai jalur hidupmu!",
                    [{ text: "Siap! ▶", action: () => { tutorialStep_ExpEnergy(); } }]
                );
            }

            function tutorialStep_ExpEnergy() {
                showTutorialFocus('hud-profile-box', "STAMINA");
                showDialogue("⚡ STAMINA & EXP",
                    "🟦 EXP penuh → Level Up!\n⚡ Energi habis → PINGSAN (denda uang!).\n\nEnergi berkurang saat berjalan, bekerja, atau bertarung. Tidur = pulih penuh.",
                    [{ text: "Hati-hati! ▶", action: () => { tutorialStep_Telephone(); } }]
                );
            }

            function tutorialStep_Telephone() {
                showInGameFocus(2, 6, "BELANJA");
                showDialogue("☎️ TELEPON",
                    "Telepon rumah = buka Katalog Belanja.\n\nBeli furnitur & upgrade rumah jadi lebih luas & mewah!",
                    [{ text: "Sip! ▶", action: () => { tutorialStep_Wardrobe(); } }]
                );
            }

            function tutorialStep_Wardrobe() {
                showInGameFocus(7, 0, "BAJU");
                showDialogue("👗 LEMARI",
                    "Ganti kostum di sini: Seragam, Baju Pesta, atau Zirah.\n\nPenampilanmu bisa membuka dialog khusus warga desa!",
                    [{ text: "Keren! ▶", action: () => { tutorialStep_Bed(); } }]
                );
            }

            function tutorialStep_Bed() {
                showInGameFocus(2, 1, "TIDUR");
                showDialogue("🛏️ KASUR",
                    "Tidur = ganti hari + pulih penuh.\n\nJangan lupa tulis Jurnal Refleksi dulu sebelum tidur!",
                    [{ text: "Oke! ▶", action: () => { tutorialStep_Diary(); } }]
                );
            }

            function tutorialStep_Diary() {
                showInGameFocus(5, 1, "JURNAL 📔");
                showDialogue("📔 MEJA JURNAL",
                    "Meja belajar = **TULIS JURNAL HARIAN** + Belajar Mandiri (INT naik).\n\nJurnal harian WAJIB diisi setiap hari — ini syarat STATUS WAJIB milikmu!\n\n📝 Cara: Dekati meja → tekan tombol aksi → pilih 'Tulis Jurnal'.\n\nSekarang keluar dan temui Mentor di luar!",
                    [{
                        text: "Ayo Keluar! ▶", action: () => {
                            clearTutorialFocus();
                            closeDialogue();
                            STATE.tutorialIndoorComplete = true;
                            showToast("Pintu Rumah Terbuka 🔓");
                        }
                    }]
                );
            }


            // ═══════════════════════════════════════════════════════
