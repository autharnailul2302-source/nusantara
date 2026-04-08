// =================================================================
// 📋 Quest Harian / Mingguan / Bulanan / Milestone
// =================================================================

            // --- NEW FUNCTION: SHOW DAILY QUEST ---
            let currentQuestTab = 'daily'; // Track active tab

            function showDailyQuestPopup() {
                // Jangan munculkan di Prologue atau Cutscene
                if (STATE.isPrologue || STATE.screen === 'cutscene') return;

                // UPDATE: Ganti 'bg' ke 'item' agar suara lebih terdengar jelas (klik)
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const popup = document.getElementById('daily-quest-popup');
                const title = document.getElementById('quest-day-title');
                const sub = document.getElementById('quest-season-subtitle');

                // Update Text Header
                title.innerText = `HARI KE-${STATE.day}`;
                // 1 Tahun = 120 Hari (4 Musim x 30 Hari)
                const year = Math.floor((STATE.day - 1) / 120) + 1;
                sub.innerText = `${STATE.season.toUpperCase()} - TAHUN KE-${year}`;

                // Render Content Default (Last Active Tab)
                switchQuestTab(currentQuestTab);

                // Show
                popup.style.display = 'flex';
                STATE.screen = 'modal'; // Pause game input
            }

            // Helper untuk Toggle via Tombol
            function toggleDailyQuest() {
                const popup = document.getElementById('daily-quest-popup');
                if (popup.style.display === 'flex') {
                    closeDailyQuest();
                } else {
                    showDailyQuestPopup();
                }
            }

            // FIX: Menambahkan fungsi closeDailyQuest yang sebelumnya hilang
            function closeDailyQuest() {
                // NEW: Tambahkan SFX saat menutup jurnal agar ada feedback
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const popup = document.getElementById('daily-quest-popup');
                if (popup) popup.style.display = 'none';
                STATE.screen = 'play'; // Resume game
            }

            function switchQuestTab(tabName) {
                currentQuestTab = tabName;

                // Update UI Tabs
                document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
                const activeBtn = document.getElementById('tab-' + tabName);
                if (activeBtn) activeBtn.classList.add('active');

                // Update Content
                const content = document.getElementById('quest-list-content');
                content.innerHTML = getQuestContent(tabName);
            }

            // --- DAILY COMPLETION CHECK (diperbarui sesuai quest baru) ---
            function checkDailyCompletion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;

                // Syarat Wajib Umum
                const condGeneral    = p.energy < 100;
                const hasJournal     = p.reflections && p.reflections.some(r => r.day === STATE.day);
                const hasTalked      = (p.dailyTalkCount || 0) >= 1;
                const hasMonsterKill = (p.dailyMonsterKills || 0) >= 2;
                const hasFishing     = (p.dailyFishingCount || 0) >= 1;

                // Syarat Role Spesifik
                let condRole = false;
                if (role === 'worker') {
                    const isSunday = ((STATE.day - 1) % 7 === 6);
                    condRole = isSunday ? p.energy < 70 : (p.shiftStarted || p.energy < 60);
                } else if (role === 'student') {
                    condRole = (p.lastAttendanceDay === STATE.day) || p.energy < 70 || STATE.location === 'library_interior';
                } else if (role === 'entrepreneur') {
                    const hasStock = Object.values(p.inventory).some(v => v > 0);
                    condRole = hasStock || p.biz >= (p.level * 2);
                } else if (role === 'family') {
                    condRole = p.energy < 80 || (p.dailyTalkCount || 0) >= 2;
                }

                return condGeneral && condRole && hasJournal && hasFishing && hasMonsterKill && hasTalked;
            }

            // --- CEK BERAPA BONUS QUEST YANG SELESAI HARI INI ---
            function countBonusQuestsDone() {
                const p = STATE.player;
                const role = p.role;
                const day = STATE.day;
                const BONUS_POOL_CHECK = {
                    worker: [
                        () => (p.inventory['tonic_stamina'] || 0) >= 1 || (p.inventory['obat'] || 0) >= 1,
                        () => (p.dailyMonsterKills || 0) >= 1,
                        () => (p.dailyTalkCount || 0) >= 3,
                        () => p.money >= 2000,
                        () => (p.furniture || []).length >= 1,
                        () => (p.dailyFishingCount || 0) >= 2,
                        () => p.level >= 1,
                    ],
                    student: [
                        () => Object.keys(p.inventory).some(k => k.includes('buku')),
                        () => STATE.location === 'library_interior',
                        () => (p.inventory['coklat'] || 0) >= 1,
                        () => (p.dailySelfStudy || 0) >= 2,
                        () => (p.dailyTalkCount || 0) >= 2,
                        () => (p.dailyFishingCount || 0) >= 1,
                        () => p.money >= 5000,
                    ],
                    entrepreneur: [
                        () => STATE.location === 'merchant_interior',
                        () => Object.values(p.inventory).some(v => v > 0),
                        () => p.money >= 10000,
                        () => (p.houseLevel || 1) >= 2,
                        () => (p.dailySellCount || 0) >= 1,
                        () => (p.dailyTalkCount || 0) >= 3,
                        () => (p.dailyFishingCount || 0) >= 1,
                    ],
                    family: [
                        () => (p.dailyTalkCount || 0) >= 3,
                        () => Object.values(p.inventory).some(v => v > 0),
                        () => STATE.location === 'guild_interior' || STATE.location === 'merchant_interior',
                        () => STATE.player.farming && Object.values(STATE.player.farming).some(c => c && c.watered),
                        () => (p.dailyFishingCount || 0) >= 1,
                        () => p.money >= 3000,
                        () => (p.dailyMonsterKills || 0) >= 1,
                    ],
                };
                const pool = BONUS_POOL_CHECK[role] || [];
                if (pool.length < 2) return 0;
                const bq1Done = pool[(day - 1) % pool.length]();
                const idx2 = day % pool.length;
                const bq2Done = (idx2 !== (day - 1) % pool.length) && pool[idx2]();
                return (bq1Done ? 1 : 0) + (bq2Done ? 1 : 0);
            }

            // --- NEW HELPER: CHECK WEEKLY COMPLETION ---
            function checkWeeklyCompletion() {
                const p = STATE.player;
                const week = Math.ceil(STATE.day / 7);
                const role = p.role;

                if (role === 'none') return false;

                // 1. Syarat Umum
                const weekLvlTarget = week * 2;
                const condLevel = p.level >= weekLvlTarget;
                const condItem = (p.inventory['ikan_segar'] || 0) >= 1;

                // 2. Syarat Role
                let condRole = false;
                if (role === 'worker') {
                    const targetStr = p.level * 2 + 10;
                    condRole = p.str >= targetStr;
                } else if (role === 'student') {
                    const targetInt = p.level * 2 + 10;
                    const hasSnack = (p.inventory['coklat'] || 0) >= 1;
                    condRole = p.int >= targetInt && hasSnack;
                } else if (role === 'entrepreneur') {
                    const targetBiz = p.level + 5;
                    condRole = p.biz >= targetBiz;
                } else if (role === 'family') {
                    const friendTarget = Math.min(5, Math.ceil(week / 2));
                    const currentFriends = Object.keys(p.relationships).length;
                    condRole = currentFriends >= friendTarget;
                }

                return condLevel && condItem && condRole;
            }

            // --- NEW HELPER: CHECK MONTHLY COMPLETION ---
            function checkMonthlyCompletion() {
                const p = STATE.player;
                const month = Math.ceil(STATE.day / 30);
                const role = p.role;

                if (role === 'none') return false;

                // 1. Syarat Tabungan
                const monthlyMoneyTarget = month * 10000;
                const condMoney = p.money >= monthlyMoneyTarget;

                // 2. Syarat Role
                let condRole = false;
                if (role === 'worker') condRole = p.bossReputation >= 70;
                else if (role === 'student') condRole = Object.keys(p.inventory).some(k => k.includes('buku'));
                else if (role === 'entrepreneur') condRole = p.money >= monthlyMoneyTarget * 1.5;
                else if (role === 'family') condRole = p.reputation >= month * 10;

                // 3. Syarat Musim (Opsional, tapi kita masukkan agar menantang)
                // Sederhana: Harus punya item khas musim atau progress tertentu
                let condSeason = false;
                if (STATE.season === 'spring') condSeason = (p.inventory['bunga'] || 0) > 0;
                else if (STATE.season === 'summer') condSeason = (p.inventory['ikan_segar'] || 0) >= 5;
                else if (STATE.season === 'autumn') condSeason = p.money >= 50000;
                else if (STATE.season === 'winter') condSeason = STATE.dungeonLevel >= 2;

                return condMoney && condRole && condSeason;
            }

            // ═══════════════════════════════════════════════════════════
            // 🏆 SISTEM MILESTONE QUEST TAHUNAN (TAHUN 1 s/d 5)
            // Setiap tahun = 120 hari (30 hari × 4 musim)
            // ═══════════════════════════════════════════════════════════

            // Helper: dapatkan tahun game saat ini
            function getGameYear() {
                return Math.floor((STATE.day - 1) / 120) + 1;
            }

            // --- CEK MILESTONE TAHUN 1 (Fondasi Awal) ---
            function checkYear1Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasTalked5   = (p.totalTalkCount || p.dailyTalkCount || 0) >= 1;
                const hasJournal   = p.reflections && p.reflections.length >= 3;
                const hasMonster   = (p.totalMonsterKills || 0) >= 5;
                const hasFish      = (p.totalFishingCount || 0) >= 3;
                const levelOK      = p.level >= 5;
                if (role === 'worker')      return levelOK && p.str >= 15 && p.money >= 20000 && hasJournal && hasMonster;
                if (role === 'student')     return levelOK && p.int >= 15 && hasJournal && hasFish;
                if (role === 'entrepreneur')return levelOK && p.biz >= 15 && p.money >= 25000 && hasJournal;
                if (role === 'family')      return levelOK && p.reputation >= 15 && Object.keys(p.relationships).length >= 2 && hasJournal;
                return false;
            }

            // --- CEK MILESTONE TAHUN 2 (Berkembang) ---
            function checkYear2Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasJournal5  = p.reflections && p.reflections.length >= 10;
                const hasMonster10 = (p.totalMonsterKills || 0) >= 20;
                const levelOK      = p.level >= 10;
                const hasFarmed    = p.farming && Object.values(p.farming).some(c => c && c.harvested);
                if (role === 'worker')       return levelOK && p.str >= 30 && p.money >= 60000 && p.bossReputation >= 50 && hasJournal5;
                if (role === 'student')      return levelOK && p.int >= 30 && p.major && hasJournal5 && hasFarmed;
                if (role === 'entrepreneur') return levelOK && p.biz >= 30 && p.money >= 80000 && (p.houseLevel || 1) >= 2 && hasJournal5;
                if (role === 'family')       return levelOK && p.reputation >= 30 && Object.keys(p.relationships).length >= 4 && hasJournal5;
                return false;
            }

            // --- CEK MILESTONE TAHUN 3 (Ujian Nyata — LEBIH SULIT) ---
            function checkLifeTrialCompletion() {
                return checkYear3Completion();
            }
            function checkYear3Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasJournal15 = p.reflections && p.reflections.length >= 20;
                const hasMonster30 = (p.totalMonsterKills || 0) >= 50;
                const levelOK      = p.level >= 18;
                const hasFish10    = (p.totalFishingCount || 0) >= 10;
                const hasAP        = (p.achievementPoints || 0) >= 30;
                if (role === 'worker') {
                    return levelOK && p.str >= 50 && p.money >= 120000
                        && p.bossReputation >= 70 && hasJournal15 && hasMonster30
                        && (p.jobStatus === 'promoted' || p.bossReputation >= 80);
                }
                if (role === 'student') {
                    const hasBook = Object.keys(p.inventory).some(k => k.includes('buku') && !k.includes('tesis'));
                    return levelOK && p.int >= 50 && hasBook && hasJournal15 && hasFish10
                        && p.major && hasAP;
                }
                if (role === 'entrepreneur') {
                    return levelOK && p.biz >= 50 && p.money >= 150000
                        && (p.houseLevel || 1) >= 2 && hasJournal15
                        && (p.dailySellCount || p.totalSellCount || 0) >= 10;
                }
                if (role === 'family') {
                    return levelOK && p.reputation >= 50
                        && Object.keys(p.relationships).length >= 6
                        && hasJournal15 && hasFish10
                        && (p.married || Object.values(p.relationships).some(r => r >= 70));
                }
                return false;
            }

            // --- CEK MILESTONE TAHUN 4 (Menjelang Puncak — SANGAT SULIT) ---
            function checkYear4Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasJournal30 = p.reflections && p.reflections.length >= 35;
                const hasAP60      = (p.achievementPoints || 0) >= 60;
                const hasMonster60 = (p.totalMonsterKills || 0) >= 80;
                const levelOK      = p.level >= 25;
                if (role === 'worker') {
                    return levelOK && p.str >= 70 && p.money >= 300000
                        && p.bossReputation >= 90 && hasJournal30 && hasAP60
                        && hasMonster60;
                }
                if (role === 'student') {
                    const hasTesisDraft = !!(p.inventory && (p.inventory['buku_tesis'] || p.inventory['draft_tesis']));
                    return levelOK && p.int >= 70 && hasTesisDraft
                        && hasJournal30 && hasAP60 && p.major;
                }
                if (role === 'entrepreneur') {
                    return levelOK && p.biz >= 70 && p.money >= 400000
                        && (p.houseLevel || 1) >= 3 && hasJournal30 && hasAP60;
                }
                if (role === 'family') {
                    return levelOK && p.reputation >= 70 && p.married
                        && Object.keys(p.relationships).length >= 8
                        && hasJournal30 && hasAP60;
                }
                return false;
            }

            // --- CEK MILESTONE TAHUN 5 (Kelulusan Sejati — ULTRA SULIT) ---
            function checkYear5Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasJournal50 = p.reflections && p.reflections.length >= 50;
                const hasAP100     = (p.achievementPoints || 0) >= 100;
                const hasMonster   = (p.totalMonsterKills || 0) >= 120;
                const levelOK      = p.level >= 30;
                const hasAllFishing= (p.totalFishingCount || 0) >= 20;
                if (role === 'worker') {
                    return levelOK && p.str >= 90 && p.money >= 1000000
                        && p.bossReputation >= 100 && hasJournal50 && hasAP100
                        && hasMonster && hasAllFishing
                        && (p.jobTitle === 'manager' || p.bossReputation >= 100);
                }
                if (role === 'student') {
                    const hasTesis = !!(p.inventory && p.inventory['buku_tesis']);
                    return levelOK && p.int >= 90 && hasTesis && p.major
                        && hasJournal50 && hasAP100 && hasMonster && hasAllFishing;
                }
                if (role === 'entrepreneur') {
                    return levelOK && p.biz >= 90 && p.money >= 1000000
                        && (p.houseLevel || 1) >= 5 && hasJournal50 && hasAP100
                        && hasMonster && hasAllFishing;
                }
                if (role === 'family') {
                    const hasKid = p.children && p.children.length >= 1;
                    return levelOK && p.reputation >= 90 && p.married && hasKid
                        && Object.keys(p.relationships).length >= 10
                        && hasJournal50 && hasAP100 && hasAllFishing;
                }
                return false;
            }

            // --- NEW FUNCTION: CLAIM REWARDS (GENERIC) ---
            function claimReward(type) {
                const p = STATE.player;

                // --- WEEKLY ---
                if (type === 'weekly') {
                    const currentWeek = Math.ceil(STATE.day / 7);
                    if (p.lastWeeklyClaim === currentWeek) {
                        showToast("Reward Minggu ini sudah diambil!");
                        return;
                    }
                    if (!checkWeeklyCompletion()) {
                        showToast("Syarat Mingguan belum terpenuhi!");
                        return;
                    }
                    p.lastWeeklyClaim = currentWeek;
                    p.money += 5000;
                    gainExp(200);
                    addItem('tonic_stamina', 1);
                    showToast("🎁 WEEKLY REWARD: 5000G + 200EXP + Tonic!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#a855f7');
                }

                // --- MONTHLY ---
                else if (type === 'monthly') {
                    const currentMonth = Math.ceil(STATE.day / 30);
                    if (p.lastMonthlyClaim === currentMonth) {
                        showToast("Reward Bulan ini sudah diambil!");
                        return;
                    }
                    if (!checkMonthlyCompletion()) {
                        showToast("Syarat Bulanan belum terpenuhi!");
                        return;
                    }
                    p.lastMonthlyClaim = currentMonth;
                    p.money += 20000;
                    gainExp(1000);
                    addItem('permata', 2);
                    showToast("🎁 MONTHLY REWARD: 20.000G + 1000EXP + 2 Berlian!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#22d3ee');
                }

                // --- MILESTONE TAHUN 1 ---
                else if (type === 'year1') {
                    if (p.claimedYear1) { showToast("Milestone Tahun 1 sudah diklaim!"); return; }
                    if (!checkYear1Completion()) { showToast("Syarat Milestone Tahun 1 belum terpenuhi!"); return; }
                    p.claimedYear1 = true;
                    p.money += 30000;
                    gainExp(1500);
                    addItem('tonic_stamina', 2);
                    p.achievementPoints = (p.achievementPoints || 0) + 15;
                    showToast("🌱 MILESTONE TAHUN 1: 30.000G + 1500EXP + 2 Tonic + 15AP!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#4ade80');
                }

                // --- MILESTONE TAHUN 2 ---
                else if (type === 'year2') {
                    if (p.claimedYear2) { showToast("Milestone Tahun 2 sudah diklaim!"); return; }
                    if (!checkYear2Completion()) { showToast("Syarat Milestone Tahun 2 belum terpenuhi!"); return; }
                    p.claimedYear2 = true;
                    p.money += 60000;
                    gainExp(2500);
                    addItem('tonic_kebal', 1);
                    addItem('permata', 2);
                    p.achievementPoints = (p.achievementPoints || 0) + 25;
                    showToast("🌿 MILESTONE TAHUN 2: 60.000G + 2500EXP + Tonic Kebal + 2 Berlian + 25AP!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#22d3ee');
                }

                // --- MILESTONE TAHUN 3 (life_trial alias) ---
                else if (type === 'life_trial' || type === 'year3') {
                    if (p.claimedLifeTrial) { showToast("Milestone Tahun 3 sudah diklaim!"); return; }
                    if (!checkYear3Completion()) { showToast("Syarat Trial 3 Tahun belum tercapai! Masih banyak yang harus diselesaikan."); return; }
                    p.claimedLifeTrial = true;
                    p.claimedYear3 = true;
                    p.money += 120000;
                    gainExp(5000);
                    addItem('tonic_kebal', 3);
                    addItem('permata', 3);
                    p.achievementPoints = (p.achievementPoints || 0) + 50;
                    showToast("🏆 MILESTONE 3 TAHUN: 120.000G + 5000EXP + 3 Tonic Kebal + 3 Berlian + 50AP!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#e11d48');
                }

                // --- MILESTONE TAHUN 4 ---
                else if (type === 'year4') {
                    if (p.claimedYear4) { showToast("Milestone Tahun 4 sudah diklaim!"); return; }
                    if (!checkYear4Completion()) { showToast("Syarat Milestone Tahun 4 belum terpenuhi! Kamu perlu lebih keras lagi!"); return; }
                    p.claimedYear4 = true;
                    p.money += 250000;
                    gainExp(8000);
                    addItem('tonic_kebal', 5);
                    addItem('permata', 5);
                    p.achievementPoints = (p.achievementPoints || 0) + 80;
                    // Bonus spesial: naikkan semua stat +5
                    p.str = (p.str || 0) + 5;
                    p.int = (p.int || 0) + 5;
                    p.biz = (p.biz || 0) + 5;
                    p.reputation = (p.reputation || 0) + 5;
                    showToast("💎 MILESTONE 4 TAHUN: 250.000G + 8000EXP + All Stat+5 + 80AP!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#a855f7');
                }

                // --- MILESTONE TAHUN 5 (TAMAT SEJATI) ---
                else if (type === 'year5') {
                    if (p.claimedYear5) { showToast("Milestone Tahun 5 sudah diklaim!"); return; }
                    if (!checkYear5Completion()) { showToast("Syarat Kelulusan 5 Tahun belum terpenuhi! Ini ujian terberat — kamu harus sempurna!"); return; }
                    p.claimedYear5 = true;
                    p.money += 500000;
                    gainExp(15000);
                    addItem('tonic_kebal', 10);
                    addItem('permata', 10);
                    p.achievementPoints = (p.achievementPoints || 0) + 200;
                    // Bonus: Gelar Kehormatan
                    const honorTitles = {
                        worker: 'Manajer Senior Berprestasi',
                        student: 'Sarjana Teladan Nusantara',
                        entrepreneur: 'Pengusaha Sukses Pulau Arsa',
                        family: 'Tokoh Masyarakat Terpuji'
                    };
                    p.honorTitle = honorTitles[p.role] || 'Warga Teladan';
                    showToast(`👑 LULUS 5 TAHUN! 500.000G + 15.000EXP + Gelar: ${p.honorTitle}!`);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#fbbf24');
                    // Trigger game ending cinematic
                    setTimeout(() => {
                        showDialogue("🌟 SELAMAT! KAMU TELAH LULUS!", 
                            `"${p.name}, kamu telah menjalani 5 tahun penuh keputusan, perjuangan, dan pertumbuhan.\n\nKamu bukan lagi pemuda yang datang dengan tangan kosong. Kamu adalah ${p.honorTitle}.\n\nPerjuanganmu menginspirasi generasi berikutnya di Pulau Arsa."\n\n— Mentor Budi`,
                            [{ text: "🏆 Lihat Potret Masa Depanku", action: () => { closeDialogue(); openPotretModal(); } },
                             { text: "Lanjutkan Petualangan (Free Roam)", action: closeDialogue }],
                            'images/mentorbudi.png');
                    }, 1500);
                }

                // Refresh UI
                showDailyQuestPopup();
                manualSave();
            }

            // --- CLAIM DAILY REWARD (UPGRADE: Skala naik + bonus quest reward) ---
            function claimDailyReward() {
                if (STATE.player.lastDailyClaim === STATE.day) {
                    showToast("Sudah diklaim hari ini!");
                    return;
                }
                if (!checkDailyCompletion()) {
                    showToast("Selesaikan semua misi wajib dulu!");
                    return;
                }

                const p = STATE.player;
                const role = p.role;

                // Base reward naik seiring hari & level
                const dayBonus   = Math.floor(STATE.day / 7) * 200;     // +200G per minggu
                const levelBonus = p.level * 150;                        // +150G per level
                let goldReward   = 1000 + dayBonus + levelBonus;
                let expReward    = 50 + (p.level * 5);

                // Bonus per role
                const roleBonus = { worker: 500, student: 300, entrepreneur: 700, family: 400 };
                goldReward += roleBonus[role] || 0;

                // Bonus item per role
                const roleItems = {
                    worker:       { id: 'tonic_stamina', qty: 1, label: '+ Tonic Stamina' },
                    student:      { id: 'coklat',        qty: 1, label: '+ Coklat Belajar' },
                    entrepreneur: { id: 'permata',       qty: 1, label: '+ 1 Berlian'      },
                    family:       { id: 'bunga',         qty: 2, label: '+ 2 Bunga'        },
                };
                const bonusItem = roleItems[role];
                if (bonusItem) addItem(bonusItem.id, bonusItem.qty);

                // Bonus quest tambahan (+300G per quest bonus yang selesai)
                const bonusDone = countBonusQuestsDone();
                const bonusGold = bonusDone * 300;
                goldReward += bonusGold;

                // Terapkan reward
                p.money += goldReward;
                gainExp(expReward);
                p.lastDailyClaim = STATE.day;

                // Efek
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                createParticle(p.x, p.y, '#fbbf24');
                if (bonusDone > 0) createParticle(p.x, p.y, '#a855f7');

                const bonusItemLabel = bonusItem ? bonusItem.label : '';
                const bonusQuestLabel = bonusDone > 0 ? ` + ${bonusGold}G Bonus Quest` : '';
                showToast(`🎁 REWARD HARIAN: ${goldReward.toLocaleString('id-ID')}G + ${expReward}XP ${bonusItemLabel}${bonusQuestLabel}!`);

                showDailyQuestPopup();
                manualSave();
            }

            function getQuestContent(tabType) {
                const p = STATE.player;
                const day = STATE.day;
                const season = STATE.season;
                const role = p.role;

                // Helpers Visual
                const check = (cond) => cond ? '<span style="color:#4ade80">✅</span>' : '<span style="color:#94a3b8">⬜</span>';
                const prog = (cur, target, unit = '') => `<span style="font-size:10px; color:#fbbf24; margin-left:4px;">(${cur}/${target}${unit})</span>`;
                // Helper Header Section
                const section = (title, color = '#0284c7') => `<div style="
        background: linear-gradient(90deg, #f1f5f9, transparent);
        color: ${color};
        padding: 6px 8px;
        font-weight: 800;
        font-size: 11px;
        margin: 8px 0 4px 0;
        border-left: 4px solid ${color};
        text-transform: uppercase;
        letter-spacing: 1px;
        border-radius: 4px;
    ">${title}</div>`;

                // Helper Button Generator
                const createClaimBtn = (label, action, isComplete, isClaimed, rewardText) => {
                    let btnStyle = "width:100%; margin-top:10px; padding:10px; font-weight:bold; border-radius:8px; cursor:pointer; font-size:12px; border:none;";
                    let btnText = "";
                    let btnAttr = "";

                    if (isClaimed) {
                        btnStyle += "background:#e2e8f0; color:#94a3b8; cursor:not-allowed; border:1px solid #cbd5e1;";
                        btnText = "✅ SUDAH DIKLAIM";
                    } else if (isComplete) {
                        btnStyle += "background:linear-gradient(90deg, #f59e0b, #d97706); color:white; box-shadow:0 4px 6px rgba(245,158,11,0.3); animation: pulse 1s infinite;";
                        btnText = `🎁 KLAIM ${label}`;
                        btnAttr = `onclick="${action}"`;
                    } else {
                        btnStyle += "background:#f1f5f9; color:#94a3b8; border:1px dashed #cbd5e1; cursor:not-allowed;";
                        btnText = "🔒 SELESAIKAN MISI DULU";
                    }

                    let html = `<button style="${btnStyle}" ${btnAttr} ${isClaimed || !isComplete ? 'disabled' : ''}>${btnText}</button>`;
                    if (!isClaimed) html += `<div style="text-align:center; font-size:10px; color:#d97706; margin-top:4px; font-weight:bold;">${rewardText}</div>`;
                    return html;
                };

                // Data Waktu
                const week = Math.ceil(day / 7);
                const month = Math.ceil(day / 30);

                let html = "";

                // --- 0. STATUS AWAL (Jika Belum Pilih Role) ---
                if (role === 'none') {
                    const mentorFound = p.dailyTalkCount > 0; // Sudah ngobrol = mungkin sudah ketemu mentor
                    return `
            ${section('🛑 MISI AWAL: TENTUKAN JALAN HIDUPMU', '#ef4444')}
            <div style="font-size:10.5px; color:#475569; margin-bottom:8px; line-height:1.5;">
                Kamu baru tiba di Pulau Arsa. Sebelum memulai petualangan sungguhan,<br>
                kamu harus memilih <b>Jalur Karir</b> yang akan menentukan hidupmu di sini!
            </div>
            ${check(mentorFound)} <b>Langkah 1:</b> Temui <b>Mentor Budi</b> di tengah Desa Arsa<br>
            ${check(false)} <b>Langkah 2:</b> Jelajahi Desa — lihat Kampus, Toko, Dermaga<br>
            ${check(false)} <b>Langkah 3:</b> Pulang ke Rumah & <b>Tidur</b> → Pilih Jalurmu<br>
            <div style="margin-top:8px; background:rgba(250,204,21,0.1); border:1px solid #fbbf24; border-radius:6px; padding:6px 8px; font-size:10px; line-height:1.6;">
                <b>✨ 4 Jalur Karir tersedia:</b><br>
                ⚔️ <b>Pekerja</b> — Kerja di toko, kumpulkan gaji, naik jabatan<br>
                🎓 <b>Akademisi</b> — Kuliah, raih beasiswa, selesaikan skripsi<br>
                💼 <b>Wirausaha</b> — Buka usaha, berdagang, kaya dari bisnis<br>
                🏠 <b>Keluarga</b> — Bangun relasi, cari jodoh, hidup bahagia
            </div>
        `;
                }

                // --- TAB 1: HARIAN (DAILY) ---
                if (tabType === 'daily') {
                    html += section('📅 Quest Harian (Reset Tiap Hari)', '#fbbf24');

                    // --- MISI ONBOARDING (tampil prioritas sesuai status role saat ini) ---
                    let onboardingMsg = "";

                    // ── PEKERJA: Belum kerja ──────────────────────────────────────
                    if (role === 'worker' && p.jobStatus === 'unemployed') {
                        onboardingMsg = `<div style="background:rgba(239,68,68,0.12); padding:8px 10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #ef4444; font-size:11px;">
                    <div style="font-weight:800; color:#ef4444; margin-bottom:4px;">⚔️ MISI AWAL PEKERJA: LAMAR KERJA</div>
                    <div style="color:#475569; line-height:1.6;">
                        ${check(false)} Pergi ke <b>Toko Merchant</b> (arah <b>Selatan</b> dari rumah)<br>
                        ${check(false)} Temui <b>Bos / Pak Hendra</b> dan ajukan lamaran kerja<br>
                        ${check(false)} Setelah diterima, masuk <b>Shift jam 08:00</b> setiap hari<br>
                    </div>
                    <div style="font-size:10px; color:#f59e0b; margin-top:4px;">💡 Gaji harian otomatis masuk jika kamu rajin masuk shift!</div>
                </div>`;

                    // ── PEKERJA: Sudah kerja — ingatkan tugas rutin ─────────────
                    } else if (role === 'worker' && p.jobStatus === 'employed') {
                        const dayIdx = (day - 1) % 7;
                        const isSunday = dayIdx === 6;
                        if (!p.shiftStarted && !isSunday) {
                            onboardingMsg = `<div style="background:rgba(239,68,68,0.08); padding:6px 10px; border-radius:6px; margin-bottom:6px; border-left:3px solid #ef4444; font-size:11px; color:#7f1d1d;">
                        ⏰ <b>Shift belum dimulai!</b> Segera ke <b>Toko Merchant</b> sebelum jam 08:00 agar tidak kena sanksi Bos.
                    </div>`;
                        }

                    // ── AKADEMISI: Belum daftar jurusan ─────────────────────────
                    } else if (role === 'student' && !p.major) {
                        onboardingMsg = `<div style="background:rgba(59,130,246,0.12); padding:8px 10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #3b82f6; font-size:11px;">
                    <div style="font-weight:800; color:#3b82f6; margin-bottom:4px;">🎓 MISI AWAL AKADEMISI: DAFTAR KULIAH</div>
                    <div style="color:#475569; line-height:1.6;">
                        ${check(false)} Pergi ke <b>Gedung Kampus</b> (arah <b>Timur</b> dari desa)<br>
                        ${check(false)} Temui <b>Pak Dosen / Bu Dosen</b> di dalam gedung<br>
                        ${check(false)} Pilih <b>jurusan kuliahmu</b> (IPA / IPS / Teknik / dst)<br>
                    </div>
                    <div style="font-size:10px; color:#f59e0b; margin-top:4px;">💡 Kuliah dimulai jam 08:00 setiap hari kerja. Jangan bolos ya!</div>
                </div>`;

                    // ── AKADEMISI: Sudah kuliah — ingatkan jadwal ───────────────
                    } else if (role === 'student' && p.major) {
                        const dayIdx2 = (STATE.day - 1) % 7;
                        const isWeekend = dayIdx2 === 5 || dayIdx2 === 6;
                        if (!isWeekend && p.lastAttendanceDay !== STATE.day) {
                            onboardingMsg = `<div style="background:rgba(59,130,246,0.08); padding:6px 10px; border-radius:6px; margin-bottom:6px; border-left:3px solid #3b82f6; font-size:11px; color:#1e3a8a;">
                        📚 <b>Kuliah belum diabsen hari ini!</b> Segera ke <b>Gedung Kampus</b> jam 08:00 agar tidak dihitung absen.
                    </div>`;
                        }

                    // ── WIRAUSAHA: Belum punya stok barang ──────────────────────
                    } else if (role === 'entrepreneur' && !Object.values(p.inventory).some(v => v > 0)) {
                        onboardingMsg = `<div style="background:rgba(16,185,129,0.12); padding:8px 10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #10b981; font-size:11px;">
                    <div style="font-weight:800; color:#065f46; margin-bottom:4px;">💼 MISI AWAL WIRAUSAHA: BUKA USAHA</div>
                    <div style="color:#475569; line-height:1.6;">
                        ${check(false)} Pergi ke <b>Toko Pedagang</b> (Selatan Desa) — beli modal awal<br>
                        ${check(false)} Pantau <b>Harga Pasar</b> lewat HP (menu Sosmed/Tren Viral)<br>
                        ${check(false)} Jual barang ke <b>Merchant</b> saat harga naik untuk cuan besar!<br>
                    </div>
                    <div style="font-size:10px; color:#f59e0b; margin-top:4px;">💡 Beli murah → jual mahal. Pantau tren viral di HP-mu setiap hari!</div>
                </div>`;

                    // ── WIRAUSAHA: Sudah punya barang — reminder ────────────────
                    } else if (role === 'entrepreneur' && Object.values(p.inventory).some(v => v > 0)) {
                        const hasTrend = STATE.viral && STATE.viral.active;
                        if (hasTrend) {
                            onboardingMsg = `<div style="background:rgba(16,185,129,0.08); padding:6px 10px; border-radius:6px; margin-bottom:6px; border-left:3px solid #10b981; font-size:11px; color:#065f46;">
                        🔥 <b>Ada tren viral hari ini!</b> Cek <b>HP → Sosmed</b> dan manfaatkan harga spesial sekarang!
                    </div>`;
                        }

                    // ── KELUARGA: Quest Modin aktif ──────────────────────────────
                    } else if (role === 'family' && p.activeQuest === 'meet_modin') {
                        onboardingMsg = `<div style="background:rgba(217,70,239,0.12); padding:8px 10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #d946ef; font-size:11px;">
                    <div style="font-weight:800; color:#86198f; margin-bottom:4px;">💍 MISI AKTIF: RESTU PENGHULU</div>
                    <div style="color:#475569; line-height:1.6;">
                        ${check(false)} Pergi ke <b>Balai Pernikahan</b> (arah <b>Selatan</b> Desa)<br>
                        ${check(false)} Temui <b>Bapak Modin</b> (Penghulu Desa) di dalam balai<br>
                        ${check(false)} Dapatkan restu untuk melanjutkan perjalanan keluargamu<br>
                    </div>
                    <div style="font-size:10px; color:#f59e0b; margin-top:4px;">💡 Reputasi (REP) harus cukup tinggi sebelum Pak Modin mau bertemu!</div>
                </div>`;

                    // ── KELUARGA: Belum punya cukup teman ───────────────────────
                    } else if (role === 'family' && Object.keys(p.relationships || {}).length < 2) {
                        onboardingMsg = `<div style="background:rgba(217,70,239,0.08); padding:6px 10px; border-radius:6px; margin-bottom:6px; border-left:3px solid #d946ef; font-size:11px; color:#701a75;">
                        👋 <b>Kamu butuh lebih banyak teman!</b> Sapa warga desa dan bantu mereka untuk membangun reputasimu.
                    </div>`;
                    }

                    if (onboardingMsg) html += onboardingMsg;

                    // =======================================
                    // BONUS QUEST HARIAN BERPUTAR (per hari)
                    // Pool berbeda tiap role, bergilir agar tidak bosan
                    // =======================================
                    const BONUS_QUEST_POOL = {
                        worker: [
                            { label: 'Beli Obat/Tonic di Toko', key: 'bq_tonic', check: () => (p.inventory['tonic_stamina'] || 0) >= 1 || (p.inventory['obat'] || 0) >= 1 },
                            { label: 'Kunjungi Dungeon (Combat)', key: 'bq_dungeon', check: () => (p.dailyMonsterKills || 0) >= 1 },
                            { label: 'Sapa 3 Warga Berbeda', key: 'bq_talk3', check: () => (p.dailyTalkCount || 0) >= 3 },
                            { label: 'Kumpulkan 2.000 Gold hari ini', key: 'bq_gold', check: () => p.money >= 2000 },
                            { label: 'Perbaiki Rumah (Furniture)', key: 'bq_house', check: () => (p.furniture || []).length >= 1 },
                            { label: 'Mancing 2x hari ini 🎣', key: 'bq_fish2', check: () => (p.dailyFishingCount || 0) >= 2 },
                            { label: 'Naik Level (Leveling)', key: 'bq_level', check: () => p.level >= (p.dailyStartLevel || p.level) },
                        ],
                        student: [
                            { label: 'Beli Buku Baru di Toko', key: 'bq_book', check: () => Object.keys(p.inventory).some(k => k.includes('buku')) },
                            { label: 'Kunjungi Perpustakaan', key: 'bq_lib', check: () => STATE.location === 'library_interior' },
                            { label: 'Beli Snack Belajar (Coklat)', key: 'bq_snack', check: () => (p.inventory['coklat'] || 0) >= 1 },
                            { label: 'Belajar Mandiri 2x', key: 'bq_study', check: () => (p.dailySelfStudy || 0) >= 2 },
                            { label: 'Sosialisasi di Kampus', key: 'bq_social', check: () => (p.dailyTalkCount || 0) >= 2 },
                            { label: 'Mancing Santai 🎣', key: 'bq_fish', check: () => (p.dailyFishingCount || 0) >= 1 },
                            { label: 'Kumpulkan 5.000 Gold (UKT)', key: 'bq_ukt', check: () => p.money >= 5000 },
                        ],
                        entrepreneur: [
                            { label: 'Pantau Harga Pasar (ke Merchant)', key: 'bq_market', check: () => STATE.location === 'merchant_interior' },
                            { label: 'Punya Stok Barang Dagangan', key: 'bq_stock', check: () => Object.values(p.inventory).some(v => v > 0) },
                            { label: 'Kumpulkan 10.000 Gold', key: 'bq_10k', check: () => p.money >= 10000 },
                            { label: 'Upgrade Rumah/Toko', key: 'bq_upgrade', check: () => (p.houseLevel || 1) >= 2 },
                            { label: 'Jual Barang ke Merchant', key: 'bq_sell', check: () => (p.dailySellCount || 0) >= 1 },
                            { label: 'Ngobrol 3 Warga (Networking)', key: 'bq_net', check: () => (p.dailyTalkCount || 0) >= 3 },
                            { label: 'Mancing & Jual Ikan 🎣', key: 'bq_fishsell', check: () => (p.dailyFishingCount || 0) >= 1 },
                        ],
                        family: [
                            { label: 'Sapa 3 Warga Desa', key: 'bq_greet', check: () => (p.dailyTalkCount || 0) >= 3 },
                            { label: 'Bawa Hadiah untuk Warga', key: 'bq_gift', check: () => Object.values(p.inventory).some(v => v > 0) },
                            { label: 'Kunjungi Balai Warga', key: 'bq_hall', check: () => STATE.location === 'guild_interior' || STATE.location === 'merchant_interior' },
                            { label: 'Siram Tanaman Keluarga 🌱', key: 'bq_water', check: () => STATE.player.farming && Object.values(STATE.player.farming).some(c => c && c.watered) },
                            { label: 'Mancing Bersama 🎣', key: 'bq_fishfam', check: () => (p.dailyFishingCount || 0) >= 1 },
                            { label: 'Kumpulkan 3.000 Gold (Nafkah)', key: 'bq_nafkah', check: () => p.money >= 3000 },
                            { label: 'Kalahkan Monster (Jaga Desa) ⚔️', key: 'bq_protect', check: () => (p.dailyMonsterKills || 0) >= 1 },
                        ],
                        none: [],
                    };
                    const bqPool = BONUS_QUEST_POOL[role] || [];
                    // Pilih 2 bonus quest berdasarkan hari (deterministik, berputar)
                    const bq1 = bqPool.length > 0 ? bqPool[(day - 1) % bqPool.length] : null;
                    const bq2 = bqPool.length > 1 ? bqPool[day % bqPool.length] : null;

                    // --- QUEST WAJIB UMUM ---
                    html += `<strong style="font-size:11px;">[✅ Wajib Umum]</strong><br>`;
                    html += `${check(p.energy < 100)} Gunakan Energi (Beraktivitas)<br>`;
                    const hasJournal = p.reflections && p.reflections.some(r => r.day === day);
                    html += `${check(hasJournal)} Tulis Jurnal Refleksi 📔<br>`;
                    const talkCount = p.dailyTalkCount || 0;
                    html += `${check(talkCount >= 1)} Sosialisasi (Sapa Warga) ${prog(talkCount, 1)} 🗣️<br>`;
                    const monsterKills = p.dailyMonsterKills || 0;
                    html += `${check(monsterKills >= 2)} Kalahkan Monster ${prog(monsterKills, 2)} ⚔️<br>`;
                    const hasFishing = (p.dailyFishingCount || 0) >= 1;
                    html += `${check(hasFishing)} Mancing Ikan (1x) 🎣<br>`;

                    // Pertanian (opsional jika punya lahan)
                    const hasFarming = STATE.player.farming && Object.values(STATE.player.farming).some(c => c && c.type);
                    if (hasFarming) {
                        const hasWatered = Object.values(STATE.player.farming).some(c => c && c.type && c.watered);
                        const hasHarvested = (p.dailyHarvestCount || 0) >= 1;
                        html += `${check(hasWatered || hasHarvested)} Rawat Tanaman (Siram/Panen) 🌱<br>`;
                    }

                    // --- QUEST ROLE SPESIFIK ---
                    html += `<strong style="font-size:11px;">[🎯 Role: ${role.toUpperCase()}]</strong><br>`;
                    if (role === 'worker') {
                        const dayIndex = (day - 1) % 7;
                        const isSunday = (dayIndex === 6);
                        if (isSunday) {
                            html += `🚫 <span style="color:#64748b; text-decoration:line-through;">Masuk Shift</span> <span style="color:#fbbf24; font-size:10px;">(Libur Ahad)</span><br>`;
                        } else {
                            html += `${check(p.shiftStarted)} Masuk Shift Kerja (08:00-16:00)<br>`;
                        }
                        html += `${check(p.energy < 50)} Kerja Keras (Energy < 50) ${prog(p.energy > 50 ? '⬜' : '✅', '⚡')}<br>`;
                        html += `${check((p.bossReputation || 0) > 0)} Jaga Reputasi Boss ${prog(p.bossReputation || 0, 100)}<br>`;
                        // PART-TIME CHECKLIST
                        if (p.partTimeStatus === 'working') {
                            const ptName = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'Part-Time';
                            html += isSunday
                                ? `🚫 <span style="color:#64748b; text-decoration:line-through;">Part-Time ${ptName}</span> <span style="color:#fbbf24; font-size:10px;">(Libur)</span><br>`
                                : `${check(p.partTimeLastWorkedDay === STATE.day)} Part-Time ${ptName} (15:00-19:00)<br>`;
                        }
                    } else if (role === 'student') {
                        const dayIndex = (STATE.day - 1) % 7;
                        const isWeekend = (dayIndex === 5 || dayIndex === 6);
                        if (isWeekend) {
                            html += `🚫 <span style="color:#64748b; text-decoration:line-through;">Hadir Kuliah</span> <span style="color:#fbbf24; font-size:10px;">(Libur Weekend)</span><br>`;
                        } else {
                            html += `${check(p.lastAttendanceDay === STATE.day)} Hadir Kuliah (08:00-14:00)<br>`;
                        }
                        html += `${check(p.energy < 70)} Belajar Mandiri (Gunakan Buku)<br>`;
                        html += `${check(STATE.location === 'library_interior')} Kunjungi Perpustakaan 📚<br>`;
                        if (p.partTimeStatus === 'working') {
                            const ptNameS = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'Part-Time';
                            html += isWeekend
                                ? `🚫 <span style="color:#64748b; text-decoration:line-through;">Part-Time ${ptNameS}</span> <span style="color:#fbbf24; font-size:10px;">(Libur)</span><br>`
                                : `${check(p.partTimeLastWorkedDay === STATE.day)} Part-Time ${ptNameS} (15:00-19:00)<br>`;
                        }
                    } else if (role === 'entrepreneur') {
                        html += `${check(STATE.location === 'merchant_interior')} Pantau Harga Pasar (Merchant)<br>`;
                        html += `${check(Object.values(p.inventory).some(v => v > 0))} Punya Stok Barang Dagangan<br>`;
                        const targetBiz = p.level * 2;
                        html += `${check(p.biz >= targetBiz)} Asah Skill Bisnis ${prog(p.biz, targetBiz, ' BIZ')}<br>`;
                        if (p.partTimeStatus === 'working') {
                            const ptNameE = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'Part-Time';
                            const dayIdxE = (STATE.day - 1) % 7;
                            html += dayIdxE === 6
                                ? `🚫 <span style="color:#64748b; text-decoration:line-through;">Part-Time ${ptNameE}</span> <span style="color:#fbbf24; font-size:10px;">(Libur)</span><br>`
                                : `${check(p.partTimeLastWorkedDay === STATE.day)} Part-Time ${ptNameE} (15:00-19:00)<br>`;
                        }
                    } else if (role === 'family') {
                        html += `${check(p.energy < 80)} Bantu Tetangga (Beraktivitas)<br>`;
                        html += `${check((p.dailyTalkCount || 0) >= 2)} Sapa 2 Warga Berbeda ${prog(Math.min(p.dailyTalkCount || 0, 2), 2)}<br>`;
                        html += `${check((p.reputation || 0) > 0)} Jaga Reputasi Sosial ${prog(p.reputation || 0, 100)}<br>`;
                        if (p.partTimeStatus === 'working') {
                            const ptNameF = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'Part-Time';
                            const dayIdxF = (STATE.day - 1) % 7;
                            html += dayIdxF === 6
                                ? `🚫 <span style="color:#64748b; text-decoration:line-through;">Part-Time ${ptNameF}</span> <span style="color:#fbbf24; font-size:10px;">(Libur)</span><br>`
                                : `${check(p.partTimeLastWorkedDay === STATE.day)} Part-Time ${ptNameF} (15:00-19:00)<br>`;
                        }
                    }

                    // --- BONUS QUEST HARIAN (berputar tiap hari) ---
                    if (bq1 || bq2) {
                        html += `<strong style="font-size:11px; color:#a855f7;">[⭐ Bonus Hari Ini]</strong> <span style="font-size:9px; color:#94a3b8;">(Berubah tiap hari)</span><br>`;
                        if (bq1) html += `${check(bq1.check())} ${bq1.label} <span style="font-size:9px; color:#a855f7;">(+300G bonus)</span><br>`;
                        if (bq2 && bq2.key !== bq1.key) html += `${check(bq2.check())} ${bq2.label} <span style="font-size:9px; color:#a855f7;">(+300G bonus)</span><br>`;
                    }

                    // --- KISAH LELUHUR REMINDER (harian, jika belum selesai) ---
                    const _c1h = p.kilamong_c1 || false;
                    const _c2h = p.kilamong_c2 || false;
                    const _c3h = p.kilamong_c3 || false;
                    const _c4h = p.kilamong_c4 || false;
                    const _totalH = [_c1h,_c2h,_c3h,_c4h].filter(Boolean).length;
                    const _kerisH = !!(p.inventory && p.inventory['keris_penjaga']);
                    if (_totalH < 4 || !_kerisH) {
                        html += section('📜 Side Quest: Kisah Leluhur', '#92400e');
                        if (_totalH === 0) {
                            html += `<span style="font-size:10px; color:#78350f;">Belum mulai! Temui <b>Ki Lamong</b> di dekat Candi Kuno (Timur Laut) untuk mendengar kisah leluhur Lamongan.</span><br>`;
                        } else if (_totalH < 4) {
                            html += `<span style="font-size:10px; color:#78350f;">Progress: <b>${_totalH}/4</b> kisah. Lanjutkan ke Ki Lamong!</span><br>`;
                            html += `${check(_c1h)} Kisah Mbah Lamong<br>`;
                            html += `${check(_c2h)} Legenda Nelayan Brondong<br>`;
                            html += `${check(_c3h)} Perjalanan Joko Tingkir<br>`;
                            html += `${check(_c4h)} Tradisi Kupatan Lamongan<br>`;
                        } else {
                            html += `✅ Semua kisah selesai! <br>`;
                            html += `${check(_kerisH)} Ambil <b>Keris Penjaga</b> dari Ki Lamong<br>`;
                        }
                    }

                    // --- REWARD BUTTON DAILY ---
                    const isComplete = checkDailyCompletion();
                    const isClaimed = (p.lastDailyClaim === STATE.day);
                    // Hitung perkiraan reward secara dinamis untuk ditampilkan
                    const _dayBonus = Math.floor(day / 7) * 200;
                    const _lvlBonus = p.level * 150;
                    const _roleBonus = { worker: 500, student: 300, entrepreneur: 700, family: 400 };
                    const _estGold = 1000 + _dayBonus + _lvlBonus + (_roleBonus[role] || 0);
                    const _roleItemLabel = { worker: '+ Tonic', student: '+ Coklat', entrepreneur: '+ Berlian', family: '+ Bunga' };
                    html += createClaimBtn("HARIAN", "claimDailyReward()", isComplete, isClaimed,
                        `🏆 ${_estGold.toLocaleString('id-ID')}G+ · ${50 + p.level * 5}XP ${_roleItemLabel[role] || ''} · +600G jika Bonus Quest selesai`);
                }

                // --- TAB 2: MINGGUAN (WEEKLY) ---
                else if (tabType === 'weekly') {
                    html += section(`🗓️ Quest Mingguan (Minggu ke-${week})`, '#a855f7');

                    // Umum
                    const weekLvlTarget = week * 2;
                    html += `${check(p.level >= weekLvlTarget)} Capai Level ${weekLvlTarget} ${prog(p.level, weekLvlTarget)}<br>`;
                    html += `${check(p.inventory['ikan_segar'] >= 1)} Stok Makanan (Ikan) ${prog(p.inventory['ikan_segar'] || 0, 1)}<br>`;

                    // Role Spesifik
                    if (role === 'worker') {
                        const targetStr = p.level * 2 + 10;
                        html += `${check(p.str >= targetStr)} Latihan Intensif (STR) ${prog(p.str, targetStr)}<br>`;
                    } else if (role === 'student') {
                        const targetInt = p.level * 2 + 10;
                        html += `${check(p.int >= targetInt)} Riset Pustaka (INT) ${prog(p.int, targetInt)}<br>`;
                        // ADDED: QUEST LOGISTIK MAHASISWA
                        html += `${check(p.inventory['coklat'] >= 1)} Beli Snack Belajar (Coklat)<br>`;
                    } else if (role === 'entrepreneur') {
                        const targetBiz = p.level + 5;
                        html += `${check(p.biz >= targetBiz)} Analisa Pasar (BIZ) ${prog(p.biz, targetBiz)}<br>`;
                    } else if (role === 'family') {
                        const friendTarget = Math.min(5, Math.ceil(week / 2));
                        const currentFriends = Object.keys(p.relationships).length;
                        html += `${check(currentFriends >= friendTarget)} Cari ${friendTarget} Teman ${prog(currentFriends, friendTarget)}<br>`;
                    }

                    // --- REWARD BUTTON WEEKLY ---
                    const isComplete = checkWeeklyCompletion();
                    const isClaimed = (p.lastWeeklyClaim === week);
                    html += createClaimBtn("MINGGUAN", "claimReward('weekly')", isComplete, isClaimed, "Reward: 5000G + 200 XP + Tonic");
                }

                // --- TAB 3: BULANAN (MONTHLY & SEASONAL) ---
                else if (tabType === 'monthly') {
                    // Bulanan
                    html += section(`🌙 Quest Bulanan (Bulan ke-${month})`, '#22d3ee');
                    const monthlyMoneyTarget = month * 10000;
                    html += `${check(p.money >= monthlyMoneyTarget)} Tabungan ${monthlyMoneyTarget / 1000}k Gold ${prog((p.money / 1000).toFixed(1) + 'k', (monthlyMoneyTarget / 1000) + 'k')}<br>`;

                    if (role === 'worker') html += `${check(p.bossReputation >= 70)} Jadi Pegawai Teladan (Rep Boss 70+)<br>`;
                    if (role === 'student') html += `${check(Object.keys(p.inventory).some(k => k.includes('buku')))} Koleksi Buku Baru<br>`;
                    if (role === 'entrepreneur') html += `${check(p.money >= monthlyMoneyTarget * 1.5)} Omset Dagang Tinggi<br>`;
                    if (role === 'family') html += `${check(p.reputation >= month * 10)} Reputasi Warga Baik ${prog(p.reputation, month * 10)}<br>`;

                    // Musiman (Digabung ke tab Bulanan biar hemat tempat)
                    let seasonColor = '#4ade80';
                    let seasonQuest = "Nikmati keindahan bunga sakura.";
                    let seasonTarget = "";

                    if (season === 'spring') {
                        seasonColor = '#f472b6';
                        seasonQuest = "Waktunya Mencari Bunga & Cinta";
                        seasonTarget = `${check(p.inventory['bunga'] > 0)} Cari Bunga Liar`;
                    } else if (season === 'summer') {
                        seasonColor = '#facc15';
                        seasonQuest = "Waktunya Memancing & Eksplorasi";
                        seasonTarget = `${check(p.inventory['ikan_segar'] >= 5)} Tangkap 5 Ikan`;
                    } else if (season === 'autumn') {
                        seasonColor = '#fb923c';
                        seasonQuest = "Waktunya Panen & Berdagang";
                        seasonTarget = `${check(p.money >= 50000)} Kumpulkan Modal Besar`;
                    } else if (season === 'winter') {
                        seasonColor = '#60a5fa';
                        seasonQuest = "Waktunya Bertahan Hidup (Dungeon)";
                        seasonTarget = `${check(STATE.dungeonLevel >= 2)} Jelajahi Dungeon Lt.2`;
                    }

                    html += section(`🍂 Misi Musim ${season.toUpperCase()}`, seasonColor);
                    html += `<i>"${seasonQuest}"</i><br>`;
                    html += `${seasonTarget}<br>`;

                    // --- REWARD BUTTON MONTHLY ---
                    const isComplete = checkMonthlyCompletion();
                    const isClaimed = (p.lastMonthlyClaim === month);
                    html += createClaimBtn("BULANAN", "claimReward('monthly')", isComplete, isClaimed, "Reward: 20k G + 1000 XP + 2 Berlian");
                }

                // --- TAB 4: JANGKA PANJANG (LIFE TARGETS) ---
                else if (tabType === 'life') {
                    const currentYear = getGameYear();
                    const totalMonsterKills = (p.totalMonsterKills || 0);
                    const totalFishing      = (p.totalFishingCount || 0);
                    const totalJournals     = p.reflections ? p.reflections.length : 0;
                    const totalAP           = p.achievementPoints || 0;

                    // ─── MILESTONE TAHUN 1 ───────────────────────────────────────
                    const y1Done     = p.claimedYear1;
                    const y1Complete = checkYear1Completion();
                    html += section('🌱 MILESTONE TAHUN 1 — Fondasi Awal', y1Done ? '#4ade80' : '#65a30d');
                    html += `<div style="font-size:10px; color:#78350f; margin-bottom:6px; background:rgba(101,163,13,0.08); padding:6px 8px; border-radius:6px; border-left:3px solid #65a30d;">
                        Buktikan kamu bisa bertahan di Pulau Arsa. Selesaikan misi dasar sebelum tahun pertama berakhir.
                    </div>`;
                    html += `${check(p.level >= 5)} Level 5+ ${prog(p.level, 5)}<br>`;
                    html += `${check(totalJournals >= 3)} Tulis 3 Jurnal Refleksi ${prog(totalJournals, 3)}<br>`;
                    html += `${check(totalMonsterKills >= 5)} Kalahkan 5 Monster ${prog(totalMonsterKills, 5)}<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 15)} STR 15+ ${prog(p.str, 15)}<br>`;
                        html += `${check(p.money >= 20000)} Tabung 20.000G ${prog((p.money/1000).toFixed(1)+'k', '20k')}<br>`;
                    } else if (role === 'student') {
                        html += `${check(p.int >= 15)} INT 15+ ${prog(p.int, 15)}<br>`;
                        html += `${check(totalFishing >= 3)} Pancing 3x ${prog(totalFishing, 3)}<br>`;
                    } else if (role === 'entrepreneur') {
                        html += `${check(p.biz >= 15)} BIZ 15+ ${prog(p.biz, 15)}<br>`;
                        html += `${check(p.money >= 25000)} Tabung 25.000G ${prog((p.money/1000).toFixed(1)+'k', '25k')}<br>`;
                    } else if (role === 'family') {
                        html += `${check(p.reputation >= 15)} REP 15+ ${prog(p.reputation, 15)}<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 2)} Punya 2 Teman ${prog(Object.keys(p.relationships).length, 2)}<br>`;
                    }
                    html += createClaimBtn("TAHUN 1", "claimReward('year1')", y1Complete, y1Done, "🌱 Reward: 30.000G + 1500EXP + 2 Tonic + 15AP");

                    // ─── MILESTONE TAHUN 2 ───────────────────────────────────────
                    const y2Done     = p.claimedYear2;
                    const y2Complete = checkYear2Completion();
                    const hasFarmed  = p.farming && Object.values(p.farming).some(c => c && c.harvested);
                    html += section('🌿 MILESTONE TAHUN 2 — Mulai Berkembang', y2Done ? '#4ade80' : '#0ea5e9');
                    html += `<div style="font-size:10px; color:#78350f; margin-bottom:6px; background:rgba(14,165,233,0.08); padding:6px 8px; border-radius:6px; border-left:3px solid #0ea5e9;">
                        Sudah setahun berlalu. Kini saatnya membuktikan dirimu bisa berkembang lebih jauh dari rata-rata.
                    </div>`;
                    html += `${check(p.level >= 10)} Level 10+ ${prog(p.level, 10)}<br>`;
                    html += `${check(totalJournals >= 10)} Tulis 10 Jurnal Refleksi ${prog(totalJournals, 10)}<br>`;
                    html += `${check(totalMonsterKills >= 20)} Kalahkan 20 Monster ${prog(totalMonsterKills, 20)}<br>`;
                    html += `${check(hasFarmed)} Berhasil Panen Tanaman 1x<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 30)} STR 30+ ${prog(p.str, 30)}<br>`;
                        html += `${check(p.money >= 60000)} Tabung 60.000G ${prog((p.money/1000).toFixed(1)+'k', '60k')}<br>`;
                        html += `${check(p.bossReputation >= 50)} Reputasi Bos 50+ ${prog(p.bossReputation || 0, 50)}<br>`;
                    } else if (role === 'student') {
                        html += `${check(p.int >= 30)} INT 30+ ${prog(p.int, 30)}<br>`;
                        html += `${check(!!p.major)} Sudah Daftar Jurusan<br>`;
                    } else if (role === 'entrepreneur') {
                        html += `${check(p.biz >= 30)} BIZ 30+ ${prog(p.biz, 30)}<br>`;
                        html += `${check(p.money >= 80000)} Tabung 80.000G ${prog((p.money/1000).toFixed(1)+'k', '80k')}<br>`;
                        html += `${check((p.houseLevel||1) >= 2)} Upgrade Rumah Lv 2 ${prog(p.houseLevel||1, 2)}<br>`;
                    } else if (role === 'family') {
                        html += `${check(p.reputation >= 30)} REP 30+ ${prog(p.reputation, 30)}<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 4)} Punya 4 Teman ${prog(Object.keys(p.relationships).length, 4)}<br>`;
                    }
                    html += createClaimBtn("TAHUN 2", "claimReward('year2')", y2Complete, y2Done, "🌿 Reward: 60.000G + 2500EXP + Tonic Kebal + 2 Berlian + 25AP");

                    // ─── MILESTONE TAHUN 3 ───────────────────────────────────────
                    const y3Done     = p.claimedLifeTrial || p.claimedYear3;
                    const y3Complete = checkYear3Completion();
                    html += section('⚔️ MILESTONE TAHUN 3 — Ujian Nyata (SULIT)', y3Done ? '#4ade80' : '#f59e0b');
                    html += `<div style="font-size:10px; color:#7c3a0e; margin-bottom:6px; background:rgba(245,158,11,0.12); padding:6px 8px; border-radius:6px; border-left:3px solid #f59e0b;">
                        ⚠️ Ini bukan sekadar bertahan — kamu harus benar-benar membuktikan diri. Semua jalur punya syarat keras di tahun ini.
                    </div>`;
                    html += `${check(p.level >= 18)} Level 18+ ${prog(p.level, 18)}<br>`;
                    html += `${check(totalJournals >= 20)} Tulis 20 Jurnal Refleksi ${prog(totalJournals, 20)}<br>`;
                    html += `${check(totalMonsterKills >= 50)} Kalahkan 50 Monster ${prog(totalMonsterKills, 50)}<br>`;
                    html += `${check(totalFishing >= 10)} Pancing 10x ${prog(totalFishing, 10)}<br>`;
                    html += `${check(totalAP >= 30)} Achievement Points 30+ ${prog(totalAP, 30)}<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 50)} STR 50+ ${prog(p.str, 50)}<br>`;
                        html += `${check(p.money >= 120000)} Tabung 120.000G ${prog((p.money/1000).toFixed(1)+'k','120k')}<br>`;
                        html += `${check(p.bossReputation >= 70)} Reputasi Bos 70+ ${prog(p.bossReputation||0, 70)}<br>`;
                        html += `${check((p.jobStatus==='promoted'||p.bossReputation>=80))} Naik Jabatan / Rep ≥80<br>`;
                    } else if (role === 'student') {
                        const hasBook = Object.keys(p.inventory).some(k => k.includes('buku') && !k.includes('tesis'));
                        html += `${check(p.int >= 50)} INT 50+ ${prog(p.int, 50)}<br>`;
                        html += `${check(!!p.major)} Sudah Pilih Jurusan<br>`;
                        html += `${check(hasBook)} Punya Buku Referensi<br>`;
                    } else if (role === 'entrepreneur') {
                        const totalSell = p.totalSellCount || p.dailySellCount || 0;
                        html += `${check(p.biz >= 50)} BIZ 50+ ${prog(p.biz, 50)}<br>`;
                        html += `${check(p.money >= 150000)} Tabung 150.000G ${prog((p.money/1000).toFixed(1)+'k','150k')}<br>`;
                        html += `${check((p.houseLevel||1) >= 2)} Rumah Lv 2+ ${prog(p.houseLevel||1, 2)}<br>`;
                        html += `${check(totalSell >= 10)} Total 10x Jual Barang ${prog(totalSell, 10)}<br>`;
                    } else if (role === 'family') {
                        const hasLove = Object.values(p.relationships||{}).some(r => r >= 70);
                        html += `${check(p.reputation >= 50)} REP 50+ ${prog(p.reputation, 50)}<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 6)} Punya 6 Teman ${prog(Object.keys(p.relationships).length, 6)}<br>`;
                        html += `${check(p.married || hasLove)} Menikah / Relasi Cinta ≥70<br>`;
                    }
                    html += createClaimBtn("TAHUN 3", "claimReward('year3')", y3Complete, y3Done, "⚔️ Reward: 120.000G + 5000EXP + 3 Tonic Kebal + 3 Berlian + 50AP");

                    // ─── MILESTONE TAHUN 4 ───────────────────────────────────────
                    const y4Done     = p.claimedYear4;
                    const y4Complete = checkYear4Completion();
                    html += section('💎 MILESTONE TAHUN 4 — Menjelang Puncak (SANGAT SULIT)', y4Done ? '#4ade80' : '#8b5cf6');
                    html += `<div style="font-size:10px; color:#4c1d95; margin-bottom:6px; background:rgba(139,92,246,0.10); padding:6px 8px; border-radius:6px; border-left:3px solid #8b5cf6;">
                        🔥 Hampir sampai. Tapi jalan menuju puncak adalah yang paling terjal. Hanya yang benar-benar siap yang bisa melangkah lebih jauh.
                    </div>`;
                    html += `${check(p.level >= 25)} Level 25+ ${prog(p.level, 25)}<br>`;
                    html += `${check(totalJournals >= 35)} Tulis 35 Jurnal Refleksi ${prog(totalJournals, 35)}<br>`;
                    html += `${check(totalMonsterKills >= 80)} Kalahkan 80 Monster ${prog(totalMonsterKills, 80)}<br>`;
                    html += `${check(totalAP >= 60)} Achievement Points 60+ ${prog(totalAP, 60)}<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 70)} STR 70+ ${prog(p.str, 70)}<br>`;
                        html += `${check(p.money >= 300000)} Tabung 300.000G ${prog((p.money/1000).toFixed(1)+'k','300k')}<br>`;
                        html += `${check(p.bossReputation >= 90)} Reputasi Bos 90+ ${prog(p.bossReputation||0, 90)}<br>`;
                    } else if (role === 'student') {
                        const hasTesisDraft = !!(p.inventory && (p.inventory['buku_tesis'] || p.inventory['draft_tesis']));
                        html += `${check(p.int >= 70)} INT 70+ ${prog(p.int, 70)}<br>`;
                        html += `${check(hasTesisDraft)} Punya Draft / Buku Tesis<br>`;
                        html += `${check(!!p.major)} Jurusan Aktif<br>`;
                    } else if (role === 'entrepreneur') {
                        html += `${check(p.biz >= 70)} BIZ 70+ ${prog(p.biz, 70)}<br>`;
                        html += `${check(p.money >= 400000)} Tabung 400.000G ${prog((p.money/1000).toFixed(1)+'k','400k')}<br>`;
                        html += `${check((p.houseLevel||1) >= 3)} Rumah Lv 3+ ${prog(p.houseLevel||1, 3)}<br>`;
                    } else if (role === 'family') {
                        html += `${check(p.reputation >= 70)} REP 70+ ${prog(p.reputation, 70)}<br>`;
                        html += `${check(p.married)} Sudah Menikah<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 8)} Punya 8 Teman ${prog(Object.keys(p.relationships).length, 8)}<br>`;
                    }
                    html += createClaimBtn("TAHUN 4", "claimReward('year4')", y4Complete, y4Done, "💎 Reward: 250.000G + 8000EXP + All Stat+5 + 5 Tonic + 5 Berlian + 80AP");

                    // ─── MILESTONE TAHUN 5 ───────────────────────────────────────
                    const y5Done     = p.claimedYear5;
                    const y5Complete = checkYear5Completion();
                    html += section('👑 MILESTONE TAHUN 5 — KELULUSAN SEJATI (ULTRA SULIT)', y5Done ? '#4ade80' : '#e11d48');
                    html += `<div style="font-size:10px; color:#7f1d1d; margin-bottom:6px; background:rgba(225,29,72,0.08); padding:6px 8px; border-radius:6px; border-left:3px solid #e11d48;">
                        🌟 Inilah momen yang kamu tunggu. 5 tahun perjalanan, keputusan, dan perjuangan berujung di sini. Tidak ada jalan pintas — hanya yang sungguh-sungguh yang layak menyandang gelar kehormatan.
                    </div>`;
                    html += `${check(p.level >= 30)} Level 30+ ${prog(p.level, 30)}<br>`;
                    html += `${check(totalJournals >= 50)} Tulis 50 Jurnal Refleksi ${prog(totalJournals, 50)}<br>`;
                    html += `${check(totalMonsterKills >= 120)} Kalahkan 120 Monster ${prog(totalMonsterKills, 120)}<br>`;
                    html += `${check(totalFishing >= 20)} Pancing 20x ${prog(totalFishing, 20)}<br>`;
                    html += `${check(totalAP >= 100)} Achievement Points 100+ ${prog(totalAP, 100)}<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 90)} STR 90+ ${prog(p.str, 90)}<br>`;
                        html += `${check(p.money >= 1000000)} Aset 1.000.000G ${prog((p.money/1000).toFixed(1)+'k','1000k')}<br>`;
                        html += `${check(p.bossReputation >= 100)} Reputasi Bos 100 (Manajer) ${prog(p.bossReputation||0, 100)}<br>`;
                        html += `${check(p.jobTitle === 'manager' || p.bossReputation >= 100)} Gelar Manajer Senior<br>`;
                    } else if (role === 'student') {
                        const hasTesis = !!(p.inventory && p.inventory['buku_tesis']);
                        html += `${check(p.int >= 90)} INT 90+ ${prog(p.int, 90)}<br>`;
                        html += `${check(hasTesis)} Selesaikan Tesis/Skripsi<br>`;
                        html += `${check(!!p.major)} Jurusan Aktif<br>`;
                    } else if (role === 'entrepreneur') {
                        html += `${check(p.biz >= 90)} BIZ 90+ ${prog(p.biz, 90)}<br>`;
                        html += `${check(p.money >= 1000000)} Aset 1.000.000G ${prog((p.money/1000).toFixed(1)+'k','1000k')}<br>`;
                        html += `${check((p.houseLevel||1) >= 5)} Rumah Mewah Lv 5 ${prog(p.houseLevel||1, 5)}<br>`;
                    } else if (role === 'family') {
                        const hasKid = p.children && p.children.length >= 1;
                        html += `${check(p.reputation >= 90)} REP 90+ ${prog(p.reputation, 90)}<br>`;
                        html += `${check(p.married)} Sudah Menikah<br>`;
                        html += `${check(hasKid)} Punya Anak<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 10)} Punya 10 Teman ${prog(Object.keys(p.relationships).length, 10)}<br>`;
                    }
                    html += createClaimBtn("TAHUN 5 — TAMAT", "claimReward('year5')", y5Complete, y5Done,
                        "👑 Reward MEGA: 500.000G + 15.000EXP + 10 Tonic + 10 Berlian + 200AP + GELAR KEHORMATAN");

                    if (p.honorTitle) {
                        html += `<div style="text-align:center; margin-top:8px; background:rgba(251,191,36,0.15); border:2px solid #fbbf24; border-radius:10px; padding:8px; font-size:12px; color:#78350f; font-weight:800;">
                            👑 GELARMU: "${p.honorTitle}"
                        </div>`;
                    }

                    // ── KISAH LELUHUR (Side Quest Permanen) ──
                    const c1l = p.kilamong_c1 || false;
                    const c2l = p.kilamong_c2 || false;
                    const c3l = p.kilamong_c3 || false;
                    const c4l = p.kilamong_c4 || false;
                    const totalL   = [c1l,c2l,c3l,c4l].filter(Boolean).length;
                    const kerisL   = !!(p.inventory && p.inventory['keris_penjaga']);
                    const gulungL  = !!(p.inventory && (p.inventory['gulungan_mbahlamong'] || p.gulunganDibaca));
                    const kalungL  = !!(p.inventory && p.inventory['kalung_nelayan']);
                    const allDoneL = totalL === 4;

                    html += section('📜 Side Quest: Kisah Leluhur Lamongan', '#92400e');
                    html += `<div style="font-size:10px; color:#78350f; margin-bottom:6px; line-height:1.5;">
                        Temui <b>Ki Lamong</b> di dekat <b>Candi Kuno (Timur Laut)</b> untuk mendengarkan semua kisah leluhur dan meraih Keris Penjaga yang legendaris.
                    </div>`;

                    const pctL = Math.round((totalL / 4) * 100);
                    html += `<div style="background:#f1f5f9; border-radius:6px; height:8px; margin-bottom:6px; overflow:hidden;">
                        <div style="background:linear-gradient(90deg,#d97706,#fbbf24); width:${pctL}%; height:100%; border-radius:6px; transition:width .3s;"></div>
                    </div>`;
                    html += `<div style="text-align:right; font-size:9px; color:#92400e; margin-bottom:4px; font-weight:700;">${totalL}/4 Kisah · ${pctL}%</div>`;

                    html += `${check(c1l)} <b>Kisah Mbah Lamong</b> <span style="font-size:9px; color:#4ade80;">${c1l ? '✓ INT+3' : '→ Reward: INT+3'}</span><br>`;
                    if (c1l) html += `&nbsp;&nbsp;&nbsp;${check(gulungL)} <span style="font-size:10px;">Ambil Gulungan Mbah Lamong (INT+5)</span><br>`;
                    html += `${check(c2l)} <b>Legenda Nelayan Brondong</b> <span style="font-size:9px; color:#4ade80;">${c2l ? '✓ REP+5' : '→ Reward: REP+5'}</span><br>`;
                    if (c2l) html += `&nbsp;&nbsp;&nbsp;${check(kalungL)} <span style="font-size:10px;">Ambil Kalung Nelayan (Mancing +10%)</span><br>`;
                    html += `${check(c3l)} <b>Perjalanan Joko Tingkir</b> <span style="font-size:9px; color:#4ade80;">${c3l ? '✓ STR+2,INT+2' : '→ Reward: STR+2, INT+2'}</span><br>`;
                    html += `${check(c4l)} <b>Tradisi Kupatan Lamongan</b> <span style="font-size:9px; color:#4ade80;">${c4l ? '✓ Happy+10' : '→ Reward: Happiness+10'}</span><br>`;

                    html += `<div style="margin-top:6px; background:${allDoneL && kerisL ? 'rgba(251,191,36,0.15)' : 'rgba(241,245,249,1)'}; border:1px solid ${allDoneL ? '#fbbf24' : '#e2e8f0'}; border-radius:8px; padding:6px 8px;">`;
                    if (allDoneL && kerisL) {
                        html += `<div style="font-size:11px; font-weight:800; color:#92400e;">🏅 PENJAGA CERITA LAMONGAN</div>`;
                        html += `<div style="font-size:10px; color:#78350f;">⚔️ Keris Penjaga aktif: STR+5 · INT+5 · SPD+5 · BIZ+5<br><i>"Pohon yang berakar kuat, tumbuh paling tinggi."</i></div>`;
                    } else if (allDoneL && !kerisL) {
                        html += `<div style="font-size:11px; font-weight:800; color:#d97706;">⚔️ Keris Penjaga menunggumu!</div>`;
                        html += `<div style="font-size:10px; color:#78350f;">${check(false)} Temui Ki Lamong & klaim <b>Keris Penjaga</b> (semua stat +5)</div>`;
                    } else {
                        html += `<div style="font-size:10px; color:#94a3b8;">⚔️ <b>Keris Penjaga</b> (semua stat +5) — klaim setelah semua kisah selesai</div>`;
                    }
                    html += `</div>`;
                }

                // --- TAB 5: RELASI NPC ---
                else if (tabType === 'relasi') {
                    html += section('💞 Status Relasi Warga Desa', '#e11d48');
                    html += `<div style="font-size:10px; color:#78350f; margin-bottom:8px; background:rgba(225,29,72,0.07); padding:7px 9px; border-radius:8px; border-left:3px solid #e11d48; line-height:1.5;">
                        Sapa warga secara rutin agar hubungan tidak mendingin. NPC dengan <b>kepribadian Dingin/Formal</b> butuh lebih banyak usaha untuk bersahabat.<br>
                        <span style="color:#ef4444;">⚠️ Merah = sudah lama tidak disapa!</span>
                    </div>`;
                    html += getRelationPanelHTML();
                }

                return html;
            }

            // --- NEW: SYSTEM PRELOADER ASSET (FIX GAMBAR LAMA MUNCUL DI MOBILE) ---
            async function preloadAllGameAssets() {
                const loadingBar  = document.getElementById('loading-bar');
                const loadingText = document.getElementById('loading-text');

                // ─── HELPER: load satu gambar (resolve selalu, tidak pernah reject) ───
                const loadOne = (src, element = null) => new Promise(resolve => {
                    // Jika browser sudah punya cache (dari Image() yang di-assign di awal script),
                    // skip buat Image baru — cukup tandai element jika ada, lalu resolve.
                    const img = new Image();
                    img.onload = () => {
                        if (element) element.loadedImg = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn("Asset tidak ditemukan:", src);
                        resolve(); // Jangan block game
                    };
                    img.src = src;
                });

                // ─── HELPER: load satu batch, update progress bar setelahnya ───
                const loadBatch = async (items, startPct, endPct) => {
                    const range = endPct - startPct;
                    let done = 0;
                    const total = items.length;
                    if (total === 0) {
                        if (loadingBar)  loadingBar.style.width  = endPct + '%';
                        if (loadingText) loadingText.innerText   = `MEMUAT ASET... ${endPct}%`;
                        return;
                    }
                    await Promise.all(items.map(item => {
                        const p = typeof item === 'string'
                            ? loadOne(item)
                            : loadOne(item.src, item.element);
                        return p.then(() => {
                            done++;
                            const pct = Math.floor(startPct + (done / total) * range);
                            if (loadingBar)  loadingBar.style.width  = pct + '%';
                            if (loadingText) loadingText.innerText   = `MEMUAT ASET... ${pct}%`;
                        });
                    }));
                };

                // ════════════════════════════════════════════════════
                // TAHAP 1 (0–30%): Aset WAJIB — Player & UI Utama
                // ════════════════════════════════════════════════════
                const phase1 = [
                    'images/bg.png', 'images/landinggame.png', 'images/lobby.png',
                    'images/boy.png', 'images/boy-idle.png', 'images/boy-walk.png',
                    'images/boy-atas.png', 'images/boy-bawah.png', 'images/boy-pukul.png',
                    'images/girl.png', 'images/girl-idle.png', 'images/girl-walk.png',
                    'images/girl-atas.png', 'images/girl-bawah.png', 'images/girl-pukul.png',
                    'images/tas-isi.png', 'images/tas-kosong.png',
                    'images/quest-scroll.png', 'images/leaderboard.png',
                    // Background musim (langsung tampil saat masuk village)
                    'images/bg-pulau.png', 'images/bg-pulau-panas.png',
                    'images/bg-pulau-gugur.png', 'images/bg-pulau-salju.png',
                    // Rumah level 1 (starting location)
                    'images/houselevel1.png', 'images/houselevel2.png',
                    'images/houselevel3.png', 'images/houselevel4.png', 'images/houselevel5.png',
                    // Rumah indoor (pertama kali masuk game langsung di rumah)
                    'images/rumahindoor_level1.png', 'images/rumahindoor_level2.png',
                    'images/rumahindoor_level3.png', 'images/rumahindoor_level4.png',
                    'images/rumahindoor_level5.png',
                ];
                await loadBatch(phase1, 0, 30);

                // ════════════════════════════════════════════════════
                // TAHAP 2 (30–60%): Aset MAP — NPC, Bangunan, Objek
                // ════════════════════════════════════════════════════
                const phase2 = [];
                const seenMap = new Set();
                try {
                    if (typeof maps !== 'undefined') {
                        for (const mapData of Object.values(maps)) {
                            if (mapData.buildings) mapData.buildings.forEach(b => {
                                if (b.img && !seenMap.has(b.img)) { seenMap.add(b.img); phase2.push({ src: b.img, element: b }); }
                            });
                            if (mapData.npcs) mapData.npcs.forEach(n => {
                                if (n.imgSrc && !seenMap.has(n.imgSrc)) { seenMap.add(n.imgSrc); phase2.push({ src: n.imgSrc, element: n }); }
                            });
                            if (mapData.objects) mapData.objects.forEach(o => {
                                if (o.img && !seenMap.has(o.img)) { seenMap.add(o.img); phase2.push({ src: o.img, element: o }); }
                            });
                        }
                    }
                } catch(e) { console.warn("Map assets skip:", e); }
                // Tambah tile/wall assets
                const tileAssets = [
                    'images/pohon-trunk.png', 'images/pohon-kanopi.png',
                    'images/batang-sakura.png', 'images/pohon-sakura.png',
                    'images/rumput.png', 'images/rumput2.png', 'images/bunga.png',
                    'images/lahan-liar.png', 'images/lantaicandi.png', 'images/lantaimerahcandi.png',
                    'images/lantai-reruntuhan.png', 'images/tembok-reruntuhan.png',
                    'images/lantaiklinik.png', 'images/lantaimentor.png',
                    'images/tiletembokkampus.png', 'images/tilelantaikampus.png',
                    'images/tilelantaiperpus.png', 'images/tiletembokperpus.png',
                    'images/tilelantaiguild.png', 'images/tiletembokguild.png',
                    'images/tiletembokrumahplayer.png', 'images/titletembokbawahplayer.png',
                    'images/tiletembokblacksmith.png',
                    'images/dungeon_wall.png', 'images/dungeon_floor.png', 'images/batudidungeon.png',
                ];
                tileAssets.forEach(s => { if (!seenMap.has(s)) { seenMap.add(s); phase2.push(s); }});
                await loadBatch(phase2, 30, 60);

                // ════════════════════════════════════════════════════
                // TAHAP 3 (60–85%): Aset ITEM & KARAKTER SEKUNDER
                // ════════════════════════════════════════════════════
                const phase3 = [
                    'images/ikankecil.png', 'images/ikansedang.png', 'images/ikanbesar.png', 'images/ikanlegendary.png',
                    'images/buku.png', 'images/buku-tesis-teknologi.png', 'images/buku-tesis-sejarah.png',
                    'images/draftskripsi-teknologi.png', 'images/draftskripsi-sejarah.png',
                    'images/sertifikat-manajer.png', 'images/ijazah-teknologi.png', 'images/ijazah-sejarah.png',
                    'images/kurcacitani.png', 'images/peripanen.png', 'images/orangsawah.png',
                    'images/rafflesia.png', 'images/arcacandi.png', 'images/gucicandi.png',
                    'images/lilinabadi.png', 'images/prasasticandi.png', 'images/mejaaltar.png',
                    'images/jaringikan.png', 'images/rakpancing.png', 'images/emberikan.png',
                    'images/boxes.png', 'images/kasurnelayan.png', 'images/rakpialaikan.png', 'images/mejamakanikan.png',
                    'images/mejadokter.png', 'images/lemariobat.png', 'images/arsiprekammedis.png',
                    'images/kebunayu.png', 'images/kasurayaayu.png', 'images/lemariayaayu.png',
                    'images/mejaayaayu.png', 'images/dapurayaayu.png',
                    'images/kaia.png', 'images/anakkecil1.png', 'images/anakkecil2.png',
                    'images/tumpukankertas.png', 'images/fotomentor.png', 'images/altar.png',
                    'images/tungku.png', 'images/paron.png', 'images/raksenajata.png',
                    'images/mejajahit.png', 'images/bijihbesi.png', 'images/kayubakar.png', 'images/snowman.png',
                    'images/warnet.png', 'images/penjagawarnet.png', 'images/maidwarnet.png',
                    'images/tokoplayer.png',
                    // Kostum tambahan
                    'images/boy-idle-weding.png', 'images/boy-walk-weding.png',
                    'images/girl-idle-weding.png', 'images/girl-walk-weding.png',
                    // Monster & dungeon
                    'images/monster.png', 'images/monster-lvl2.png', 'images/monster-lvl3.png',
                    'images/monster-lvl4.png', 'images/monster-lvl5.png',
                    'images/monster-thief.png', 'images/monster-boss.png',
                    // Fairy village
                    'images/rarawilis.png', 'images/wening.png', 'images/sekar.png',
                    'images/bening.png', 'images/juna.png', 'images/pohonperi.png',
                    'images/peri_pr1.png', 'images/peri_pr2.png', 'images/peri_pr3.png',
                    'images/peri_pr4.png', 'images/peri_lk1.png', 'images/peri_lk2.png',
                    'images/sendang-tier1.png', 'images/sendang-tier2.png', 'images/sendang-tier3.png',
                    'images/taman-tier1.png', 'images/taman-tier2.png', 'images/taman-tier3.png',
                    'images/sekolah-tier1.png', 'images/sekolah-tier2.png', 'images/sekolah-tier3.png',
                    'images/pasar-tier1.png', 'images/pasar-tier2.png', 'images/pasar-tier3.png',
                    'images/menara-tier1.png', 'images/menara-tier2.png', 'images/menara-tier3.png',
                    'images/istanaperi.png',
                    // Logo & misc
                    'images/logosmk.png', 'images/loganailul.png', 'images/logotkj.png',
                    // Balap
                    'images/player-race.png', 'images/taxi-race.png', 'images/bike-race.png',
                    'images/truck-race.png', 'images/suv-race.png',
                ].filter(s => !seenMap.has(s)); // skip yg sudah di-load di phase2
                await loadBatch(phase3, 60, 85);

                // ════════════════════════════════════════════════════
                // TAHAP 4 (85–100%): Scene Prologue (File besar, load terakhir)
                // ════════════════════════════════════════════════════
                const phase4 = [];
                for (let i = 1; i <= 10; i++) phase4.push(`images/scene-${i}.png`);
                await loadBatch(phase4, 85, 100);

                console.log(`✅ Semua aset selesai dimuat dalam 4 tahap.`);
            }

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
