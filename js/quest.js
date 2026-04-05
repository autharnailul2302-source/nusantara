// ═══════════════════════════════════════════
// QUEST.JS — Nusantara Arsa: Rise of Student
// Baris 9442–10672 dari index asli
// ═══════════════════════════════════════════

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
                const imagesToLoad = [];

                // 1. Kumpulkan URL dari Aset Global (Variable Global)
                // Helper untuk mengambil src dari objek aset
                const collectGlobal = (collection) => {
                    Object.values(collection).forEach(img => {
                        if (img && img.src) imagesToLoad.push({ src: img.src }); // Hanya butuh src untuk cache browser
                    });
                };

                collectGlobal(treeAssets);
                collectGlobal(bagAssets);
                collectGlobal(bgSeasons);
                collectGlobal(houseBgAssets);
                collectGlobal(dungeonAssets);
                collectGlobal(wallAssets);
                collectGlobal(grassAssets);
                collectGlobal(farmAssets); // Add Farm Assets to Preloader
                collectGlobal(ruinsAssets); // NEW: Add Ruins Assets
                collectGlobal(candiAssets); // NEW: Add Candi Assets
                collectGlobal(clinicAssets); // NEW: Add Clinic Assets
                collectGlobal(mentorAssets); // NEW: Add Mentor Assets

                // 2. Kumpulkan semua gambar dari Peta (Bangunan, NPC, Objek)
                // FIX: Bungkus dalam Try-Catch dan Cek 'maps' agar tidak error jika map belum siap
                try {
                    if (typeof maps !== 'undefined') {
                        for (const [mapName, mapData] of Object.entries(maps)) {
                            // Buildings
                            if (mapData.buildings) {
                                mapData.buildings.forEach(b => {
                                    if (b.img) imagesToLoad.push({ src: b.img, element: b });
                                });
                            }
                            // NPCs
                            if (mapData.npcs) {
                                mapData.npcs.forEach(n => {
                                    if (n.imgSrc) imagesToLoad.push({ src: n.imgSrc, element: n });
                                });
                            }
                            // Objects
                            if (mapData.objects) {
                                mapData.objects.forEach(o => {
                                    if (o.img) imagesToLoad.push({ src: o.img, element: o });
                                });
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Aset Peta dilewati (Maps belum siap):", e);
                }

                // 3. Tambahkan Aset Player (Gender & Kostum) & UI Penting SECARA MANUAL
                // Agar tidak blank saat ganti baju atau pertama login
                const manualAssets = [
                    // UI & Backgrounds
                    'images/bg.png', 'images/landinggame.png', 'images/lobby.png', 'images/leaderboard.png',
                    'images/tas-isi.png', 'images/tas-kosong.png', 'images/quest-scroll.png',
                    'images/logosmk.png', 'images/loganailul.png', 'images/logotkj.png',

                    // Player Boy
                    'images/boy.png', 'images/boy-idle.png', 'images/boy-walk.png',
                    'images/boy-atas.png', 'images/boy-bawah.png', 'images/boy-pukul.png',
                    'images/boy-idle-weding.png', 'images/boy-walk-weding.png',

                    // Player Girl
                    'images/girl.png', 'images/girl-idle.png', 'images/girl-walk.png',
                    'images/girl-atas.png', 'images/girl-bawah.png', 'images/girl-pukul.png',
                    'images/girl-idle-weding.png', 'images/girl-walk-weding.png',

                    // Item Icons (Penting)
                    'images/ikankecil.png', 'images/ikansedang.png', 'images/ikanbesar.png', 'images/ikanlegendary.png',
                    'images/buku.png', 'images/buku-tesis-teknologi.png', 'images/buku-tesis-sejarah.png',
                    'images/draftskripsi-teknologi.png', 'images/draftskripsi-sejarah.png',
                    'images/sertifikat-manajer.png', 'images/ijazah-teknologi.png', 'images/ijazah-sejarah.png',
                    // NEW: ASSET KURCACI TANI & PERI PANEN
                    'images/kurcacitani.png', 'images/peripanen.png',
                    // NEW: ASSET ORANG SAWAH
                    'images/orangsawah.png',
                    // NEW: ASSET RAFFLESIA ARNOLDI
                    'images/rafflesia.png',
                    // NEW: ASSET RERUNTUHAN (FIX AGAR TIDAK KOSONG)
                    'images/tembok-reruntuhan.png',
                    'images/lantai-reruntuhan.png',
                    // NEW: ASSET LANTAI CANDI
                    'images/lantaicandi.png',
                    'images/lantaimerahcandi.png', // NEW
                    // NEW: ASSET ARCA & GUCI CANDI
                    'images/arcacandi.png',
                    'images/gucicandi.png',
                    // NEW: ASSET LILIN ABADI
                    'images/lilinabadi.png',
                    // NEW: ASSET PRASASTI CANDI
                    'images/prasasticandi.png',
                    // NEW: ASSET MEJA ALTAR CANDI
                    'images/mejaaltar.png',
                    // NEW: ASSET JARING IKAN
                    'images/jaringikan.png',
                    // NEW: ASSET RAK PANCING
                    'images/rakpancing.png',
                    // NEW: ASSET EMBER IKAN
                    'images/emberikan.png',
                    // NEW: ASSET BOXES (BOX ES)
                    'images/boxes.png',
                    // NEW: ASSET KASUR NELAYAN
                    'images/kasurnelayan.png',
                    // NEW: ASSET RAK PIALA IKAN
                    'images/rakpialaikan.png',
                    // NEW: ASSET MEJA MAKAN IKAN
                    'images/mejamakanikan.png',
                    // NEW: ASSET KLINIK BARU
                    'images/mejadokter.png',
                    'images/lemariobat.png',
                    'images/arsiprekammedis.png',
                    // NEW: ASSET KEBUN AYU
                    'images/kebunayu.png',
                    // NEW: ASSET KASUR AYU
                    'images/kasurayaayu.png',
                    // NEW: ASSET LEMARI AYU
                    'images/lemariayaayu.png',
                    // NEW: ASSET MEJA AYU
                    'images/mejaayaayu.png',
                    // NEW: ASSET DAPUR AYU
                    'images/dapurayaayu.png',
                    // NEW: ASSET KAIA & ANAK KECIL (TAMBAHAN MANUAL AGAR TIDAK HILANG)
                    'images/kaia.png',
                    'images/anakkecil1.png',
                    'images/anakkecil2.png',
                    // NEW: ASSET TUMPUKAN KERTAS
                    'images/tumpukankertas.png',
                    // NEW: ASSET FOTO MENTOR
                    'images/fotomentor.png',
                    // NEW: ASSET ALTAR PERNIKAHAN
                    'images/altar.png',
                    // NEW: ASSET TUNGKU
                    'images/tungku.png',
                    // NEW: ASSET PARON
                    'images/paron.png',
                    // NEW: ASSET RAK SENJATA
                    'images/raksenajata.png',
                    // NEW: ASSET MEJA JAHIT
                    'images/mejajahit.png',
                    // NEW: ASSET BIJIH BESI
                    'images/bijihbesi.png',
                    // NEW: ASSET KAYU BAKAR
                    'images/kayubakar.png', // <--- TAMBAHAN KOMA DI SINI
                    // NEW: ASSET BONEKA SALJU
                    'images/snowman.png',

                    // --- [FIX] TAMBAHAN ASET RUMAH AGAR TIDAK BLANK SAAT LOGIN ---
                    'images/warnet.png', // <--- TAMBAHAN BARU: WARNET
                    'images/penjagawarnet.png', // <--- BARU: PENJAGA
                    'images/maidwarnet.png',    // <--- BARU: MAID
                    'images/houselevel1.png',
                    'images/houselevel2.png',
                    'images/houselevel3.png',
                    'images/houselevel4.png',
                    'images/houselevel5.png',
                    'images/tokoplayer.png',
                    'images/player-race.png', // <--- NEW: ASSET MOBIL BALAP
                    // --- NEW: ASSET MUSUH BALAP ---
                    'images/taxi-race.png',
                    'images/bike-race.png',
                    'images/truck-race.png',
                    'images/suv-race.png'
                ];

                // FIX: TAMBAHKAN ASET PROLOGUE AGAR TIDAK BLACK SCREEN SAAT MULAI
                for (let i = 1; i <= 10; i++) {
                    manualAssets.push(`images/scene-${i}.png`);
                }

                manualAssets.forEach(src => imagesToLoad.push({ src: src }));

                // Hilangkan duplikat agar loading lebih efisien
                const uniqueImages = [];
                const seenSrc = new Set();
                imagesToLoad.forEach(item => {
                    // Normalisasi src (kadang browser nambahin base url)
                    // Kita pakai raw src string untuk cek duplikasi
                    if (item.src && !seenSrc.has(item.src)) {
                        seenSrc.add(item.src);
                        uniqueImages.push(item);
                    } else if (item.element) {
                        // Jika duplikat tapi ada referensi elemen map, tetap perlu di-handle referensinya
                        uniqueImages.push(item);
                    }
                });

                const total = uniqueImages.length;
                let loaded = 0;
                const loadingBar = document.getElementById('loading-bar');
                const loadingText = document.getElementById('loading-text');

                // Jika tidak ada aset (aneh), langsung selesai
                if (total === 0) return;

                console.log(`Memulai Preload untuk ${total} Aset Gambar...`);

                // Fungsi Load Satu Gambar
                const loadImage = (item) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();

                        // FIX: PASANG LISTENER DULU SEBELUM SET SRC
                        img.onload = () => {
                            loaded++;
                            const pct = Math.floor((loaded / total) * 100);
                            if (loadingBar) loadingBar.style.width = pct + "%";
                            if (loadingText) loadingText.innerText = `MEMUAT ASET (${loaded}/${total})... ${pct}%`;

                            // Jika ini elemen map, simpan referensi gambar yang SUDAH DILOAD
                            if (item.element) {
                                item.element.loadedImg = img;
                            }
                            resolve();
                        };

                        img.onerror = () => {
                            console.warn("Gagal memuat:", item.src);
                            loaded++;
                            const pct = Math.floor((loaded / total) * 100);
                            if (loadingBar) loadingBar.style.width = pct + "%";
                            if (loadingText) loadingText.innerText = `MEMUAT ASET (${loaded}/${total})... ${pct}%`;

                            // Jangan reject agar game tetap jalan (gunakan fallback nanti)
                            resolve();
                        };

                        // SET SRC TERAKHIR
                        img.src = item.src;
                    });
                };

                // Jalankan semua (Parallel Loading)
                // Kita pakai Promise.all agar browser mengunduh bersamaan
                await Promise.all(uniqueImages.map(item => loadImage(item)));
            }

            // UPDATE: FUNGSI INIT PERTAMA KALI
