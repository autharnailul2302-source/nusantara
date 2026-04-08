            // --- NEW FUNCTION: TOGGLE HUD (COLLAPSIBLE) ---
            function toggleHUD() {
                const hud = document.getElementById('main-hud');
                const btn = document.getElementById('hud-toggle-btn');

                // Toggle Class
                hud.classList.toggle('compact-mode');

                // SFX
                if (typeof AudioService !== 'undefined') AudioService.playSFX('bg');

                // Update Button Icon & Position Logic
                if (hud.classList.contains('compact-mode')) {
                    btn.innerText = "▼"; // Panah Bawah (Show)
                    btn.title = "Tampilkan Detail";
                    // Posisi tombol diatur via CSS (.compact-mode ~ #hud-toggle-btn)
                } else {
                    btn.innerText = "▲"; // Panah Atas (Hide)
                    btn.title = "Sembunyikan Stats";
                }
            }

            // --- NEW FUNCTION: TOGGLE INVENTORY SCREEN ---
            function toggleInventory() {
                // UPDATE: Ganti 'bg' menjadi 'item' agar suara lebih terdengar (seperti suara koin/barang)
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const screen = document.getElementById('inventory-screen');
                const isHidden = screen.style.display === 'none' || screen.style.display === '';

                if (isHidden) {
                    screen.style.display = 'flex';
                    updateInventoryStats(); // NEW: Update status saat buka
                    renderInventory();
                    STATE.screen = 'modal'; // Pause game input
                } else {
                    screen.style.display = 'none';
                    STATE.screen = 'play'; // Resume game
                }
            }

            // --- NEW FUNCTION: OPEN PROFILE MODAL ---
            function openProfileModal() {
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const p = STATE.player;
                const userData = DataService.user || { name: "Player", email: "Guest" };

                // 1. Set Basic Info
                document.getElementById('profile-name').innerText = userData.name || "Siswa";
                // Gunakan 6 karakter awal email sebagai ID simulasi
                document.getElementById('profile-id').innerText = (userData.email || "000000").substring(0, 6).toUpperCase();

                // Set Avatar yang sama dengan HUD
                const hudImg = document.getElementById('hud-avatar-img').src;
                document.getElementById('profile-img').src = hudImg;

                // 2. Set Role Badge & Header Color
                const roleBadge = document.getElementById('profile-role-badge');
                const header = document.getElementById('profile-header');
                let roleText = "NOVICE";
                let roleColor = "#64748b"; // Default Grey
                let headerColor = "#334155"; // Default Dark

                if (p.role === 'worker') {
                    roleText = "PEKERJA (FIGHTER)";
                    roleColor = "#ef4444"; headerColor = "#7f1d1d";
                } else if (p.role === 'student') {
                    roleText = "MAHASISWA (MAGE)";
                    roleColor = "#3b82f6"; headerColor = "#1e3a8a";
                    if (p.major) roleText += ` - ${p.major.toUpperCase()}`;
                } else if (p.role === 'entrepreneur') {
                    roleText = "WIRAUSAHA (SUPPORT)";
                    roleColor = "#10b981"; headerColor = "#064e3b";
                } else if (p.role === 'family') {
                    roleText = "KELUARGA (TANKER)";
                    roleColor = "#d946ef"; headerColor = "#701a75";
                }

                roleBadge.innerText = roleText;
                roleBadge.style.background = roleColor;
                header.style.background = headerColor;
                header.style.borderColor = roleColor;

                // Tambah status pernikahan di bawah role badge
                let maritalEl = document.getElementById('profile-marital-status');
                if (!maritalEl) {
                    maritalEl = document.createElement('div');
                    maritalEl.id = 'profile-marital-status';
                    maritalEl.style.cssText = 'font-size:11px; font-weight:700; padding:2px 10px; border-radius:12px; margin-top:4px; display:inline-block;';
                    roleBadge.parentNode.insertBefore(maritalEl, roleBadge.nextSibling);
                }
                if (p.married) {
                    const spouseName = {lover1girl:'Ayu',lover2girl:'Putri',lover1boy:'Dr. Budi',lover2boy:'Satria',lover_matre_girl:'Siska',lover_matre_boy:'Rendi'}[p.spouseId] || 'Pasangan';
                    maritalEl.innerText = `💍 Menikah dgn ${spouseName}`;
                    maritalEl.style.background = '#ec4899';
                    maritalEl.style.color = '#fff';
                } else if (p.divorced) {
                    maritalEl.innerText = p.gender === 'boy' ? '💔 Duda' : '💔 Janda';
                    maritalEl.style.background = '#64748b';
                    maritalEl.style.color = '#fff';
                } else {
                    maritalEl.innerText = '🙍 Single';
                    maritalEl.style.background = 'rgba(255,255,255,0.15)';
                    maritalEl.style.color = '#e2e8f0';
                }

                // 3. Set Stats
                document.getElementById('profile-lvl').innerText = p.level;
                document.getElementById('profile-str').innerText = p.str;
                document.getElementById('profile-int').innerText = p.int;
                document.getElementById('profile-biz').innerText = p.biz;
                document.getElementById('profile-rep').innerText = p.reputation;
                document.getElementById('profile-money').innerText = p.money.toLocaleString('id-ID');
                document.getElementById('profile-jurnal').innerText = (p.reflections || []).length;

                // 4. Update EXP Bar
                const expPct = Math.floor((p.exp / p.maxExp) * 100);
                document.getElementById('profile-exp-bar').style.width = expPct + "%";
                document.getElementById('profile-exp-txt').innerText = `${Math.floor(p.exp)}/${p.maxExp}`;

                // Show Modal
                document.getElementById('profile-modal').style.display = 'flex';
                STATE.screen = 'modal';

                // Populate kelas & mentor
                const kelasEl = document.getElementById('profile-kelas-display');
                const mentorEl = document.getElementById('profile-mentor-display');
                if (kelasEl) kelasEl.innerText = userData.details || p.customKelas || 'Kelas belum diisi';
                if (mentorEl) {
                    const mentorName = p.customMentor || userData.mentorName || 'Guru belum diisi';
                    mentorEl.innerText = mentorName;
                }

                // Update tombol musik
                updateMusicBtn();
            }

            function closeProfileModal() {
                document.getElementById('profile-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            // === FUNGSI MUSIK DARI KARTU PELAJAR ===
            function toggleMusicFromProfile() {
                if (typeof AudioService !== 'undefined') {
                    AudioService.enabled = !AudioService.enabled;
                    if (!AudioService.enabled) {
                        // Matikan semua audio
                        Object.values(AudioService.tracks).forEach(t => { try { t.pause(); } catch(e){} });
                        AudioService.currentTrack = null;
                        AudioService.currentAmbience = null;
                        showToast('🔇 Musik dimatikan');
                    } else {
                        // Nyalakan kembali
                        AudioService.update();
                        showToast('🎵 Musik dinyalakan');
                    }
                    updateMusicBtn();
                    // Simpan preferensi
                    try { localStorage.setItem('musicEnabled', AudioService.enabled ? '1' : '0'); } catch(e){}
                }
            }

            function updateMusicBtn() {
                const btn = document.getElementById('profile-music-btn');
                const btn2 = document.getElementById('profile-music-btn2');
                if (!btn) return;
                const on = typeof AudioService !== 'undefined' ? AudioService.enabled : true;
                btn.innerText = on ? '🎵' : '🔇';
                btn.title = on ? 'Matikan Musik' : 'Nyalakan Musik';
                btn.style.background = on ? 'rgba(255,255,255,0.25)' : 'rgba(239,68,68,0.4)';
                if (btn2) {
                    btn2.innerText = on ? '🎵 MUSIK ON' : '🔇 MUSIK OFF';
                    btn2.style.background = on ? 'linear-gradient(135deg,#1e40af,#1d4ed8)' : 'linear-gradient(135deg,#374151,#1f2937)';
                    btn2.style.borderColor = on ? '#3b82f6' : '#6b7280';
                }
            }

            // === FUNGSI EDIT KELAS & MENTOR ===
            function editProfileKelas() {
                const userData = DataService.user || {};
                const current = STATE.player.customKelas || userData.details || '';
                const input = prompt('Ganti nama kelas:', current);
                if (input !== null && input.trim().length > 0) {
                    STATE.player.customKelas = input.trim();
                    const el = document.getElementById('profile-kelas-display');
                    if (el) el.innerText = input.trim();
                    showToast('✅ Nama kelas diperbarui: ' + input.trim());
                } else if (input !== null) {
                    showToast('⚠️ Nama kelas tidak boleh kosong!');
                }
            }

            // === FUNGSI EDIT MENTOR (DROPDOWN DARI FIREBASE) ===
            async function editProfileMentor() {
                // Buat modal overlay
                let overlay = document.getElementById('mentor-pick-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'mentor-pick-overlay';
                    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:99999;display:flex;align-items:center;justify-content:center;';
                    document.body.appendChild(overlay);
                }
                overlay.innerHTML = `
                    <div style="background:#fefce8;border:4px solid #a16207;border-radius:16px;padding:20px;width:90%;max-width:360px;box-shadow:0 8px 0 #78350f,0 14px 30px rgba(0,0,0,0.4);font-family:'Nunito',sans-serif;">
                        <div style="font-family:'Fredoka',sans-serif;font-size:16px;font-weight:700;color:#422006;margin-bottom:12px;text-align:center;">👩‍🏫 Pilih Guru Pendamping</div>
                        <select id="mentor-pick-select" style="width:100%;padding:10px;border:2px solid #a16207;border-radius:8px;font-size:13px;font-family:'Nunito',sans-serif;background:#fff;color:#422006;margin-bottom:14px;">
                            <option value="">⏳ Memuat daftar guru...</option>
                        </select>
                        <div style="display:flex;gap:8px;">
                            <button onclick="document.getElementById('mentor-pick-overlay').style.display='none'"
                                style="flex:1;padding:10px;background:#e2e8f0;border:2px solid #cbd5e1;border-radius:8px;cursor:pointer;font-weight:700;font-family:'Fredoka',sans-serif;">✖ Batal</button>
                            <button onclick="saveMentorChoice()"
                                style="flex:2;padding:10px;background:linear-gradient(135deg,#065f46,#047857);border:2px solid #10b981;border-radius:8px;color:#fff;cursor:pointer;font-weight:700;font-family:'Fredoka',sans-serif;">✅ Simpan</button>
                        </div>
                    </div>`;
                overlay.style.display = 'flex';

                // Load guru dari Firebase
                const sel = document.getElementById('mentor-pick-select');
                try {
                    const teachers = await DataService.getTeachers();
                    teachers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                    const currentMentor = DataService.user?.mentor || '';
                    sel.innerHTML = '<option value="">-- Pilih Guru Pendamping --</option>';
                    if (teachers.length === 0) {
                        sel.innerHTML += '<option value="" disabled>⚠️ Belum ada guru terdaftar</option>';
                    } else {
                        teachers.forEach(t => {
                            const opt = document.createElement('option');
                            opt.value = t.email;
                            const sekolah = t.school && t.school !== 'Unknown School' && t.school !== 'Unknown' ? ` — ${t.school}` : '';
                            opt.textContent = `👩‍🏫 ${t.name}${sekolah}`;
                            if (t.email === currentMentor) opt.selected = true;
                            sel.appendChild(opt);
                        });
                    }
                } catch(e) {
                    sel.innerHTML = '<option value="">⚠️ Gagal memuat — periksa koneksi</option>';
                }
            }

            async function saveMentorChoice() {
                const sel = document.getElementById('mentor-pick-select');
                if (!sel || !sel.value) { showToast('⚠️ Pilih guru terlebih dahulu!'); return; }
                const email = sel.value;
                const name = sel.options[sel.selectedIndex].textContent.replace('👩‍🏫 ', '').split(' — ')[0].trim();

                // Tutup modal
                const overlay = document.getElementById('mentor-pick-overlay');
                if (overlay) overlay.style.display = 'none';

                // Update lokal
                if (DataService.user) DataService.user.mentor = email;
                STATE.player.customMentor = name;
                STATE.mentorName = name;
                const el = document.getElementById('profile-mentor-display');
                if (el) el.innerText = name;

                // Simpan ke Firebase
                try {
                    if (DataService.mode === 'firebase' && db && DataService.user?.email) {
                        await db.collection('artifacts').doc('nusantara-arsa').collection('users')
                            .doc(DataService.user.email).update({ mentor: email });
                        showToast('✅ Mentor berhasil diperbarui: ' + name);
                    } else {
                        // Fallback lokal
                        const dbLocal = DataService.getDB();
                        if (dbLocal[DataService.user?.email]) {
                            dbLocal[DataService.user.email].mentor = email;
                            DataService.saveDB(dbLocal);
                        }
                        showToast('✅ Mentor disimpan (lokal): ' + name);
                    }
                } catch(e) {
                    console.warn('Gagal simpan mentor ke Firebase:', e);
                    showToast('⚠️ Tersimpan lokal, cek koneksi untuk sinkronisasi');
                }
            }

            // --- NEW FUNCTION: UPDATE STATUS DI INVENTORY ---
            function updateInventoryStats() {
                const p = STATE.player;
                const hpEl = document.getElementById('inv-hp-val');
                const enEl = document.getElementById('inv-energy-val');
                const apEl = document.getElementById('inv-ap-val');
                if (hpEl) hpEl.innerText = Math.floor(p.hp) + "/" + p.maxHp;
                if (enEl) enEl.innerText = Math.floor(p.energy) + "%";
                if (apEl) apEl.innerText = (p.achievementPoints || 0);
                // Update HUD AP badge — tampil untuk SEMUA role
                const hudApVal = document.getElementById('hud-ap-val');
                if (hudApVal) hudApVal.innerText = (p.achievementPoints || 0);
                const hudApBadge = document.getElementById('hud-ap-badge');
                if (hudApBadge) hudApBadge.style.display = 'flex'; // Selalu tampil
                // inv-ap-badge di inventory — tampil semua role juga
                const apBadge = document.getElementById('inv-ap-badge');
                if (apBadge) apBadge.style.display = 'flex';
            }

            // --- NEW FUNCTION: FORCE SYNC (MANUAL BUTTON) ---
            async function forceSync() {
                const icon = document.getElementById('sync-icon');
                const text = document.getElementById('sync-text');
                const btn = document.getElementById('sync-btn');

                // 1. Visual Feedback: Loading
                icon.innerText = "⏳";
                text.innerText = "Mengirim...";
                text.style.color = "#fbbf24"; // Kuning
                btn.style.borderColor = "#fbbf24";

                try {
                    // 2. Lakukan Penyimpanan Manual (Trigger update ke Firebase)
                    await manualSave();

                    // 3. Visual Feedback: Sukses
                    icon.innerText = "✅";
                    text.innerText = "Tersimpan!";
                    text.style.color = "#4ade80"; // Hijau
                    btn.style.borderColor = "#4ade80";

                    // Play SFX
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                } catch (e) {
                    // 4. Visual Feedback: Gagal
                    icon.innerText = "❌";
                    text.innerText = "Gagal (Offline)";
                    text.style.color = "#ef4444"; // Merah
                    btn.style.borderColor = "#ef4444";
                    console.error("Sync failed:", e);
                }

                // 5. Reset Tampilan setelah 2 detik
                setTimeout(() => {
                    icon.innerText = "☁️";
                    text.innerText = "Sync Data";
                    text.style.color = "#94a3b8"; // Kembali Abu-abu
                    btn.style.borderColor = "#334155";
                }, 2000);
            }


            function triggerGameOver() {
                if (STATE.gameOverTriggered) return;
                STATE.gameOverTriggered = true;

                const _mm = document.getElementById('minimap-container');
                if (_mm) _mm.classList.remove('ingame');
                const _ph = document.getElementById('pet-hud-indicator');
                if (_ph) _ph.classList.remove('visible');
                document.getElementById('ui-layer').classList.add('hidden');

                // 🎬 CINEMATIC GAME OVER dulu, baru layar gameover
                playCutsceneGameOver(() => {
                    STATE.screen = 'gameover';
                    const role = STATE.player.role;
                    const reflections = {
                        worker:       "Sebagai seorang Fighter (Pekerja), kamu telah mengerahkan tenaga dan keringatmu. Mungkin hasilnya belum maksimal, tapi kerja kerasmu membentuk karakter yang kuat. Dunia industri memang keras, tapi kamu lebih keras.",
                        student:      "Jalur Mage (Akademisi) yang kamu pilih penuh dengan ilmu. Mungkin nilaimu belum sempurna, atau teorimu belum teruji di lapangan. Namun, wawasan adalah investasi jangka panjang yang tak akan rugi.",
                        entrepreneur: "Menjadi Support (Pebisnis) itu berisiko. Mungkin profitmu belum setinggi langit, atau usahamu mengalami pasang surut. Ingat, kegagalan bisnis adalah biaya kuliah untuk kesuksesan di masa depan.",
                    };
                    document.getElementById('reflection-text').innerText = reflections[role] || "Kamu menjalani hari-harimu tanpa arah yang spesifik. Eksplorasi itu baik, tapi fokus adalah kunci keberhasilan.";
                    const quotes = [
                        "\"Kegagalan hanyalah kesempatan untuk memulai lagi dengan lebih cerdas.\" - Henry Ford",
                        "\"Bukan seberapa sering kamu jatuh, tapi seberapa cepat kamu bangkit.\" - Unknown",
                        "\"Masa depan dimiliki oleh mereka yang percaya pada keindahan mimpi mereka.\" - Eleanor Roosevelt",
                        "\"Jangan takut gagal. Takutlah berada di tempat yang sama tahun depan.\" - Unknown",
                        "\"Setiap ahli dulunya adalah seorang pemula.\" - Helen Hayes"
                    ];
                    document.getElementById('motivation-text').innerText = quotes[Math.floor(Math.random() * quotes.length)];
                    document.getElementById('game-over-screen').style.display = 'flex';
                    DataService.resetSaveData();
                });
            }

            function triggerGameWin() {
                if (STATE.gameFinished) return;
                STATE.gameFinished = true;
                STATE.screen = 'modal';
                document.getElementById('ui-layer').classList.add('hidden');

                // 🎬 CINEMATIC GAME WIN dulu, baru layar ending
                playCutsceneGameWin(() => {
                    const screen     = document.getElementById('ending-screen');
                    const narration  = document.getElementById('ending-narration');
                    const certBox    = document.getElementById('cert-box');
                    const options    = document.getElementById('ending-options');

                    screen.style.display = 'flex';
                    narration.style.display = 'block';
                    narration.style.opacity = 0;
                    setTimeout(() => narration.style.opacity = 1, 500);

                    setTimeout(() => {
                        narration.style.display = 'none';
                        certBox.style.display = 'block';
                        document.getElementById('cert-name').innerText = DataService.user ? DataService.user.name : "Player";
                        document.getElementById('cert-role').innerText = STATE.player.role.toUpperCase();
                        document.getElementById('cert-rep').innerText = STATE.player.reputation;
                        document.getElementById('cert-asset').innerText = STATE.player.money.toLocaleString();
                        setTimeout(() => { options.style.display = 'flex'; }, 2000);
                    }, 4000);
                });
            }

            function continueFreeRoam() {
                STATE.freeRoamMode = true;
                STATE.screen = 'play';
                document.getElementById('ending-screen').style.display = 'none';
                document.getElementById('ui-layer').classList.remove('hidden');
                showToast("🏝️ MODE FREE ROAM AKTIF");
            }

            function finishGame() {
                alert("Terima kasih telah bermain! Data kelulusan telah dikirim ke guru.");
                logout();
            }

            // --- FIX: RESTART GAME SEKARANG MENGGUNAKAN RELOAD UNTUK PEMBERSIHAN TOTAL ---
            async function restartGame() {
                // 1. Visual Feedback
                const btn = document.querySelector('#game-over-screen button');
                if (btn) {
                    btn.innerHTML = "⏳ Wiping Data...";
                    btn.disabled = true;
                }
                document.body.style.cursor = 'wait';

                // 2. Hentikan Loop Game & Auto Save (Penting!)
                if (window.gameLoopId) cancelAnimationFrame(window.gameLoopId);
                if (window.saveIntervalId) clearInterval(window.saveIntervalId);

                try {
                    // 3. Hapus Data Permanen (Cloud & Local Cache)
                    await DataService.resetSaveData();

                    // 4. Force Reload Halaman
                    // Ini adalah cara paling aman. checkSession() akan berjalan saat reload.
                    // Karena Local Storage sudah dibersihkan di langkah 3, checkSession akan
                    // mendeteksi 'saveData = null' dan OTOMATIS memanggil startPrologue().
                    location.reload();

                } catch (e) {
                    console.error("Restart Error:", e);
                    alert("Gagal mereset data. Halaman akan dimuat ulang paksa.");
                    location.reload();
                }
            }

            function returnToTitle() {
                location.reload();
            }

            let lastCollisionTime = 0;

            // --- NEW FUNCTION: HANDLE SKILL (ULTIMATE) ---
            function handleSkill() {
                const p = STATE.player;

                // Cek Cooldown
                if (p.skillCooldown > 0) {
                    showToast("Skill sedang Cooldown!");
                    return;
                }

                // Cek Energi
                if (p.energy < 10) {
                    showToast("Energi tidak cukup! (Butuh 10)");
                    return;
                }

                // Activate Skill
                p.energy -= 10;
                p.skillCooldown = 180; // 3 Detik Cooldown (60 FPS)

                // Logic: AoE Damage
                const range = 120; // Radius ledakan
                const damage = p.str * 4 + 20; // Damage Besar (Base + STR)

                // Visual Effect: Shockwave Ring
                for (let i = 0; i < 36; i++) {
                    const angle = (i * 10) * (Math.PI / 180);
                    STATE.particles.push({
                        x: p.x + 10,
                        y: p.y + 10,
                        vx: Math.cos(angle) * 8, // Menyebar cepat
                        vy: Math.sin(angle) * 8,
                        life: 30,
                        color: '#ef4444', // Merah Api
                        size: 5 + Math.random() * 5,
                        type: 'dust' // Reuse dust logic for circle particles
                    });
                }

                // Screen Shake Effect
                STATE.shakeTimer = 20;

                // SFX
                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // Damage Calculation
                let hitCount = 0;
                STATE.enemies.forEach(en => {
                    const dist = Math.hypot(p.x - en.x, p.y - en.y);
                    if (dist < range) {
                        hitCount++;
                        en.hp -= damage;

                        // Massive Knockback (Terlempar jauh)
                        en.knockback = {
                            x: (en.x - p.x) * 2,
                            y: (en.y - p.y) * 2
                        };

                        spawnFloatingText(en.x, en.y - 30, "🔥 " + damage, "#ef4444", 20);
                        createParticle(en.x, en.y, '#fbbf24'); // Sparks
                    }
                });

                if (hitCount > 0) {
                    showToast(`ULTIMATE! Hit ${hitCount} Musuh!`);
                    spawnFloatingText(p.x, p.y - 40, "BOOM!", "#fbbf24", 24);
                } else {
                    showToast("Skill meleset... (Tidak ada target)");
                }
            }

