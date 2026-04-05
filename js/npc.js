// ═══════════════════════════════════════════
// NPC.JS — Nusantara Arsa: Rise of Student
// Baris 18833–20234 dari index asli
// ═══════════════════════════════════════════

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

                    window.saveIntervalId = setInterval(() => {
                        if (STATE.screen === 'play') {
                            manualSave();
                            // Autosave indicator: flash ikon kecil di HUD
                            const ind = document.getElementById('autosave-indicator');
                            if (ind) {
                                ind.style.opacity = '1';
                                setTimeout(() => { ind.style.opacity = '0'; }, 1200);
                            }
                        }
                    }, 15000); // Autosave tiap 15 detik

                    // Simpan saat tab/browser ditutup atau refresh
                    window.onbeforeunload = () => {
                        if (STATE.screen === 'play') {
                            manualSave();
                        }
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

