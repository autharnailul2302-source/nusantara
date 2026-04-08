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

                        // FIX BUG #4: Logika restore isPrologue yang lebih aman.
                        // Jika saved.isPrologue secara eksplisit false, percayai itu (artinya
                        // pemain sudah selesai pilih job). Hanya reset ke prologue jika
                        // memang benar-benar baru (hari 1 & role none & tidak ada flag isPrologue=false).
                        if (saved.isPrologue === false) {
                            // Pemain sudah melewati prologue — jangan reset
                            STATE.isPrologue = false;
                        } else if (STATE.day === 1 && STATE.player.role === 'none') {
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
                        // FIX BUG #2: Hapus syarat !STATE.isPrologue — auto-save kini aktif
                        // selama role sudah dipilih, meski dialog tutorial belum selesai.
                        const isIngame = ['play','modal','dialogue','minigame','cutscene'].includes(activeScreen);
                        const hasProgress = STATE.player.role !== 'none' || STATE.day > 1;
                        if (isIngame && hasProgress) {
                            await manualSave();
                            // Autosave indicator
                            const ind = document.getElementById('autosave-indicator');
                            if (ind) {
                                ind.style.opacity = '1';
                                setTimeout(() => { ind.style.opacity = '0'; }, 1200);
                            }
                        }
                    }, 10000); // 10 detik

                    // FIX BUG #3: onbeforeunload — simpan STATE terbaru ke localStorage,
                    // bukan cuma update timestamp. Ini mencegah data hilang jika browser
                    // ditutup di tengah dialog tutorial (setelah pilih job).
                    window.onbeforeunload = () => {
                        try {
                            const dbLocal = DataService.getDB();
                            if (DataService.user && dbLocal[DataService.user.email]) {
                                const existing = dbLocal[DataService.user.email].saveData || {};
                                // Simpan field-field kritis yang mungkin berubah sejak auto-save terakhir
                                existing.lastActive    = Date.now();
                                existing.isPrologue    = STATE.isPrologue;
                                existing.role          = STATE.player.role;
                                existing.day           = STATE.day;
                                existing.time          = STATE.time;
                                existing.money         = STATE.player.money;
                                existing.hp            = STATE.player.hp;
                                existing.energy        = STATE.player.energy;
                                existing.level         = STATE.player.level;
                                existing.exp           = STATE.player.exp;
                                existing.str           = STATE.player.str;
                                existing.int           = STATE.player.int;
                                existing.biz           = STATE.player.biz;
                                existing.inventory     = STATE.player.inventory;
                                existing.activeQuest   = STATE.player.activeQuest;
                                existing.relationships = STATE.player.relationships;
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

                // FIX: Langsung set isPrologue = false saat role dipilih
                // Ini mencegah bug "balik ke tutorial" jika browser ditutup
                // sebelum dialog tutorial selesai diklik
                STATE.isPrologue = false;

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

