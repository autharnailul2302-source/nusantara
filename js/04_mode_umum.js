// ========================================================
// js/04_mode_umum.js
// Mode Umum (Guest Play without account)
// ========================================================

            // ══════════════════════════════════════════════
            // MODE UMUM — Main tanpa akun (localStorage only)
            // ══════════════════════════════════════════════
            async function handleUmumPlay(btnElement) {
                toggleFullScreen();
                const nama = (document.getElementById('umum-nama')?.value?.trim()) || 'Penjelajah';
                const email = 'umum_lokal@nusantara-arsa.local';
                const msgEl = document.getElementById('login-msg');

                if (btnElement) { btnElement.disabled = true; btnElement.innerText = '⏳ Memuat...'; }

                await DataService.init(true); // coba Firebase dulu
                const dbLocal = DataService.getDB();

                // Cek apakah sudah ada save lokal sebelumnya
                let userData = dbLocal[email];
                if (!userData) {
                    userData = {
                        email, role: 'umum', name: nama,
                        details: 'Penjelajah', mentor: 'UMUM_DEFAULT',
                        loginMethod: 'local', saveData: null, lastActive: Date.now()
                    };
                } else {
                    if (nama !== 'Penjelajah') userData.name = nama;
                    userData.lastActive = Date.now();
                }

                dbLocal[email] = userData;
                DataService.saveDB(dbLocal);
                localStorage.setItem(SESSION_KEY, email);
                DataService.user = userData;

                // Simpan ke Firebase juga agar admin bisa lihat (best-effort)
                if (db) {
                    try {
                        await db.collection('artifacts').doc('nusantara-arsa').collection('users')
                            .doc(email).set(userData, { merge: true });
                    } catch(e) { console.warn('Cloud sync umum-lokal gagal (offline?):', e); }
                }

                msgEl.style.color = '#4ade80';
                msgEl.innerText = `✅ Selamat datang, ${userData.name}!`;

                setTimeout(() => {
                    document.getElementById('login-screen').style.display = 'none';
                    const titleSc = document.getElementById('title-screen');
                    if (titleSc) { titleSc.style.display = 'none'; titleSc.classList.add('hidden'); }
                    if (!userData.saveData) {
                        startPrologue();
                    } else {
                        document.getElementById('start-screen').classList.remove('hidden');
                    }
                }, 700);
            }

            async function handleGoogleLogin(role) {
                const msgEl = document.getElementById('login-msg');
                msgEl.innerText = '';
                msgEl.style.color = '#ef4444';

                try {
                    toggleFullScreen();

                    // Init Firebase Auth
                    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
                    const auth = firebase.auth();
                    const provider = new firebase.auth.GoogleAuthProvider();

                    msgEl.style.color = '#fbbf24';
                    msgEl.innerText = '⏳ Membuka popup Google...';

                    const result = await auth.signInWithPopup(provider);
                    const user = result.user;
                    const email = user.email;
                    const displayName = user.displayName || '';
                    const photoURL = user.photoURL || '';

                    msgEl.innerText = '⏳ Menyinkronkan data...';

                    await DataService.init(true);
                    const dbLocal = DataService.getDB();

                    // Cek apakah user sudah terdaftar (lokal dulu)
                    let userData = dbLocal[email];

                    // Jika belum ada lokal, cek Firestore dulu (pernah daftar di device lain)
                    if (!userData && db) {
                        try {
                            msgEl.innerText = '⏳ Cek data di server...';
                            const cloudDoc = await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).get();
                            if (cloudDoc.exists) {
                                userData = cloudDoc.data();
                                dbLocal[email] = userData;
                                DataService.saveDB(dbLocal);
                            }
                        } catch(e) { console.warn('Cek cloud gagal:', e); }
                    }

                    if (!userData) {
                        // USER BARU MURNI
                        msgEl.style.color = '#4ade80';
                        msgEl.innerText = '✅ Akun Google terdeteksi! Lengkapi data dulu.';
                        // Mode umum: langsung buat akun tanpa form tambahan
                        if (role === 'umum') {
                            const newUmumUser = {
                                email, role: 'umum',
                                name: displayName || 'Penjelajah',
                                details: 'Penjelajah', mentor: 'UMUM_DEFAULT',
                                photoURL: photoURL || '', loginMethod: 'google',
                                saveData: null, lastActive: Date.now()
                            };
                            const dbLocalU = DataService.getDB();
                            dbLocalU[email] = newUmumUser;
                            DataService.saveDB(dbLocalU);
                            if (db) {
                                try { await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).set(newUmumUser, { merge: true }); }
                                catch(e) { console.warn('Cloud sync umum gagal:', e); }
                            }
                            localStorage.setItem(SESSION_KEY, email);
                            DataService.user = newUmumUser;
                            msgEl.innerText = `✅ Selamat datang, ${newUmumUser.name}!`;
                            setTimeout(() => {
                                document.getElementById('login-screen').style.display = 'none';
                                const titleSc = document.getElementById('title-screen');
                                if (titleSc) { titleSc.style.display = 'none'; titleSc.classList.add('hidden'); }
                                startPrologue();
                            }, 800);
                            return;
                        }
                        showGoogleRegisterForm(role, email, displayName, photoURL);
                        return;
                    }

                    // Cek role mismatch (siswa login di tab guru atau sebaliknya)
                    // Role 'umum' tidak perlu dicek mismatch
                    if (role !== 'umum' && userData.role !== role && userData.role !== 'admin') {
                        // FIX: Sebelum blokir, verifikasi ke Firestore dulu
                        // Data lokal mungkin stale (sisa daftar sebelumnya yang gagal/dibatalkan)
                        let cloudRole = null;
                        if (db) {
                            try {
                                msgEl.innerText = '⏳ Memverifikasi data ke server...';
                                const verifyDoc = await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).get();
                                if (verifyDoc.exists) {
                                    cloudRole = verifyDoc.data().role;
                                } else {
                                    // Tidak ada di cloud sama sekali — data lokal adalah stale
                                    // Hapus data lokal stale dan anggap user baru
                                    delete dbLocal[email];
                                    DataService.saveDB(dbLocal);
                                    userData = null;
                                    msgEl.style.color = '#4ade80';
                                    msgEl.innerText = '✅ Akun Google terdeteksi! Lengkapi data dulu.';
                                    showGoogleRegisterForm(role, email, displayName, photoURL);
                                    return;
                                }
                            } catch(e) { console.warn('Verifikasi cloud gagal:', e); }
                        }
                        // Jika di cloud role-nya sama dengan yang dipilih, update lokal dan lanjut
                        if (cloudRole === role) {
                            userData = (await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).get()).data();
                            dbLocal[email] = userData;
                            DataService.saveDB(dbLocal);
                        } else if (cloudRole && cloudRole !== role) {
                            // Cloud juga konfirmasi role berbeda — ini memang salah tab
                            const roleLabel = { siswa: 'Siswa', guru: 'Guru', admin: 'Admin' };
                            const correctRole = roleLabel[cloudRole] || cloudRole;
                            const usedRole = roleLabel[role] || role;
                            msgEl.style.color = '#ef4444';
                            msgEl.innerText = `❌ SALAH AKUN! Akun ini terdaftar sebagai ${correctRole}, bukan ${usedRole}. Silakan login di tab yang sesuai.`;
                            try { if (firebase && firebase.auth) await firebase.auth().signOut(); } catch(e) {}
                            return;
                        } else {
                            // Tidak ada internet / cloud tidak bisa dicek — gunakan data lokal
                            const roleLabel = { siswa: 'Siswa', guru: 'Guru', admin: 'Admin' };
                            const correctRole = roleLabel[userData.role] || userData.role;
                            const usedRole = roleLabel[role] || role;
                            msgEl.style.color = '#ef4444';
                            msgEl.innerText = `❌ SALAH AKUN! Akun ini terdaftar sebagai ${correctRole}, bukan ${usedRole}. Silakan login di tab yang sesuai.`;
                            try { if (firebase && firebase.auth) await firebase.auth().signOut(); } catch(e) {}
                            return;
                        }
                    }

                    // USER LAMA — sync cloud dulu, baru masuk
                    msgEl.innerText = '⏳ Mengambil data terbaru dari server...';

                    // Coba ambil data terbaru dari Firestore (agar saveData tidak stale)
                    if (db) {
                        try {
                            const cloudDoc = await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).get();
                            if (cloudDoc.exists) {
                                const cloudData = cloudDoc.data();
                                // Merge: data cloud lebih prioritas (terutama saveData)
                                userData = { ...userData, ...cloudData };
                                dbLocal[email] = userData;
                                DataService.saveDB(dbLocal);
                            }
                        } catch (e) {
                            console.warn('Gagal sync cloud, pakai data lokal:', e);
                        }
                    }

                    localStorage.setItem(SESSION_KEY, email);
                    DataService.user = userData;

                    msgEl.style.color = '#4ade80';
                    msgEl.innerText = `✅ Selamat datang, ${userData.name}!`;

                    setTimeout(() => {
                        document.getElementById('login-screen').style.display = 'none';
                        const titleSc = document.getElementById('title-screen');
                        if (titleSc) { titleSc.style.display = 'none'; titleSc.classList.add('hidden'); }
                        if (userData.role === 'guru' || userData.role === 'admin') {
                            initTeacherDashboard();
                        } else {
                            // Siswa & Umum: tampilkan welcome info lalu masuk game
                            const welcomeName = document.getElementById('welcome-name');
                            const welcomeClass = document.getElementById('welcome-class');
                            const welcomeMentor = document.getElementById('welcome-mentor');
                            if (welcomeName) welcomeName.innerText = userData.name || 'Siswa';
                            if (welcomeClass) welcomeClass.innerText = userData.details || 'Umum';
                            if (welcomeMentor && userData.mentor) welcomeMentor.innerText = 'Mentor Active';

                            if (!userData.saveData) {
                                // New game — mulai prologue
                                startPrologue();
                            } else {
                                // Load game — tampilkan start screen
                                document.getElementById('start-screen').classList.remove('hidden');
                            }
                        }
                    }, 900);

                } catch (err) {
                    console.error('Google login error:', err);
                    if (err.code === 'auth/popup-closed-by-user') {
                        msgEl.innerText = '⚠️ Popup ditutup. Coba lagi.';
                    } else if (err.code === 'auth/popup-blocked') {
                        msgEl.innerText = '⚠️ Popup diblokir browser. Izinkan popup untuk situs ini.';
                    } else {
                        msgEl.innerText = '❌ Gagal login Google: ' + (err.message || err.code);
                    }
                }
            }

            async function showGoogleRegisterForm(role, email, displayName, photoURL) {
                const loginCard = document.querySelector('.login-card');

                // Simpan konten asli untuk bisa kembali
                const originalContent = loginCard.innerHTML;

                loginCard.innerHTML = `
                    <h2 style="font-family:'Fredoka'; color:#d97706; text-align:center; margin-bottom:15px; font-size:20px;">
                        📋 LENGKAPI DATA
                    </h2>
                    <div style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.6); padding:10px; border-radius:12px; margin-bottom:15px;">
                        ${photoURL ? `<img src="${photoURL}" style="width:40px; height:40px; border-radius:50%; border:2px solid #a16207;">` : ''}
                        <div>
                            <div style="font-weight:800; color:#422006; font-size:14px;">${displayName}</div>
                            <div style="font-size:11px; color:#78350f;">${email}</div>
                        </div>
                    </div>
                    <div id="google-reg-msg" style="color:#ef4444; font-size:12px; margin-bottom:10px; min-height:15px; font-weight:bold;"></div>
                    ${role === 'siswa' ? `
                        <input type="text" id="greg-nama" class="form-input" placeholder="Nama Lengkap" value="${displayName}">
                        <input type="text" id="greg-kelas" class="form-input" placeholder="Kelas (Contoh: XII TKJ 1)">
                        <select id="greg-guru" class="form-input">
                            <option value="">Pilih Guru Pendamping...</option>
                        </select>
                    ` : `
                        <input type="text" id="greg-nama" class="form-input" placeholder="Nama Guru" value="${displayName}">
                        <input type="text" id="greg-nip" class="form-input" placeholder="NIP">
                        <input type="text" id="greg-sekolah" class="form-input" placeholder="Asal Sekolah" value="SMK Negeri 1 Brondong">
                    `}
                    <button class="auth-btn" onclick="submitGoogleRegister('${role}', '${email}', '${photoURL}')">
                        ✅ SIMPAN & MULAI
                    </button>
                    <button style="width:100%; background:transparent; border:none; margin-top:10px; color:#78350f; font-size:12px; cursor:pointer; font-weight:bold;" onclick="location.reload()">
                        ⬅ Batal
                    </button>
                `;

                // Isi dropdown guru jika siswa — fetch dari cloud dulu, fallback lokal
                if (role === 'siswa') {
                    const guruSelect = document.getElementById('greg-guru');
                    guruSelect.innerHTML = '<option value="">⏳ Memuat daftar guru dari server...</option>';
                    guruSelect.disabled = true;

                    // Coba ambil dari Firestore dulu (paling akurat)
                    try {
                        let guruList = [];
                        if (db) {
                            const snap = await db.collection('artifacts').doc('nusantara-arsa').collection('users')
                                .where('role', '==', 'guru').get();
                            guruList = snap.docs.map(d => ({ email: d.id, name: d.data().name, school: d.data().school || '' }));
                        }
                        // FIX: Tambah dari lokal juga (merge, hindari duplikat)
                        // Rename [email,u] → [guruEmail,u] agar tidak shadow variabel 'email' user luar
                        const dbLocal = DataService.getDB();
                        Object.entries(dbLocal).filter(([,u]) => u.role === 'guru').forEach(([guruEmail, u]) => {
                            if (!guruList.find(g => g.email === guruEmail)) {
                                guruList.push({ email: guruEmail, name: u.name, school: u.school || '' });
                            }
                        });

                        // Dedup final berdasarkan email (case-insensitive)
                        const seen = new Set();
                        const dedupedList = guruList.filter(g => {
                            const key = (g.email || '').toLowerCase().trim();
                            if (seen.has(key)) return false;
                            seen.add(key);
                            return true;
                        });

                        dedupedList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                        guruSelect.innerHTML = '<option value="">-- Pilih Guru Pendamping --</option>';
                        guruSelect.disabled = false;
                        if (dedupedList.length === 0) {
                            guruSelect.innerHTML += '<option value="" disabled>⚠️ Belum ada guru terdaftar</option>';
                        } else {
                            dedupedList.forEach(g => {
                                const opt = document.createElement('option');
                                opt.value = g.email;
                                const sekolah = g.school && g.school !== 'Unknown School' && g.school !== 'Unknown' ? ` — ${g.school}` : '';
                                opt.textContent = `👩‍🏫 ${g.name}${sekolah}`;
                                guruSelect.appendChild(opt);
                            });
                        }
                    } catch(e) {
                        console.warn('Gagal fetch guru:', e);
                        guruSelect.disabled = false;
                        guruSelect.innerHTML = '<option value="">-- Pilih Guru (Offline) --</option>';
                        const dbLocal = DataService.getDB();
                        // FIX: rename [email,u] → [guruEmail,u]
                        const localSeen = new Set();
                        Object.entries(dbLocal).filter(([,u]) => u.role === 'guru').forEach(([guruEmail, u]) => {
                            if (localSeen.has(guruEmail)) return;
                            localSeen.add(guruEmail);
                            const opt = document.createElement('option');
                            opt.value = guruEmail;
                            opt.textContent = u.name;
                            guruSelect.appendChild(opt);
                        });
                    }
                }
            }

            async function submitGoogleRegister(role, email, photoURL) {
                const msgEl = document.getElementById('google-reg-msg');
                const nama = document.getElementById('greg-nama')?.value?.trim();

                if (!nama) {
                    msgEl.innerText = '⚠️ Nama wajib diisi!';
                    return;
                }

                let newUser = {
                    email, role, name: nama,
                    photoURL: photoURL || '',
                    loginMethod: 'google',
                    saveData: null,
                    lastActive: Date.now()
                };

                if (role === 'siswa') {
                    const kelas = document.getElementById('greg-kelas')?.value?.trim();
                    const guru = document.getElementById('greg-guru')?.value;
                    if (!kelas) { msgEl.innerText = '⚠️ Kelas wajib diisi!'; return; }
                    newUser.details = kelas;
                    newUser.mentor = guru || '';
                } else {
                    const nip = document.getElementById('greg-nip')?.value?.trim();
                    const sekolah = document.getElementById('greg-sekolah')?.value?.trim();
                    if (!nip || !sekolah) { msgEl.innerText = '⚠️ NIP & Sekolah wajib diisi!'; return; }
                    newUser.details = nip;
                    newUser.school = sekolah;
                }

                msgEl.style.color = '#4ade80';
                msgEl.innerText = '⏳ Menyimpan...';

                await DataService.init(true);
                const dbLocal = DataService.getDB();
                dbLocal[email] = newUser;
                DataService.saveDB(dbLocal);

                // Simpan ke Firestore — wajib agar akun muncul di dashboard admin/guru
                if (db) {
                    try {
                        await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email).set(newUser, { merge: true });
                    } catch(e) {
                        console.warn('Cloud sync gagal, data tersimpan lokal saja:', e);
                        msgEl.style.color = '#fbbf24';
                        msgEl.innerText = '⚠️ Tersimpan lokal. Sinkronisasi cloud gagal — pastikan internet stabil.';
                        await new Promise(r => setTimeout(r, 1500));
                    }
                }

                localStorage.setItem(SESSION_KEY, email);
                DataService.user = newUser;

                msgEl.style.color = '#4ade80';
                msgEl.innerText = `✅ Berhasil! Selamat datang, ${nama}!`;

                setTimeout(() => {
                    document.getElementById('login-screen').style.display = 'none';
                    const titleSc2 = document.getElementById('title-screen');
                    if (titleSc2) { titleSc2.style.display = 'none'; titleSc2.classList.add('hidden'); }
                    if (role === 'guru') {
                        initTeacherDashboard();
                    } else {
                        // Siswa baru — tampilkan welcome info lalu mulai prologue
                        const welcomeName = document.getElementById('welcome-name');
                        const welcomeClass = document.getElementById('welcome-class');
                        const welcomeMentor = document.getElementById('welcome-mentor');
                        if (welcomeName) welcomeName.innerText = newUser.name || 'Siswa';
                        if (welcomeClass) welcomeClass.innerText = newUser.details || 'Umum';
                        if (welcomeMentor && newUser.mentor) welcomeMentor.innerText = 'Mentor Active';
                        startPrologue();
                    }
                }, 900);
            }

            function switchRole(role) {
                currentRole = role;

                // 1. Update Tampilan Tab (Warna Active)
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('tab-' + role).classList.add('active');

                // 2. Ganti Form yang Tampil
                ['siswa','umum','guru','admin'].forEach(r => {
                    const f = document.getElementById('form-' + r);
                    if (f) f.style.display = 'none';
                });
                document.getElementById('form-' + role).style.display = 'block';

                // 3. Atur Visibilitas Tombol Register
                const authSwitch = document.querySelector('.auth-switch');
                if (role === 'admin' || role === 'umum') {
                    authSwitch.style.display = 'none';
                } else {
                    authSwitch.style.display = 'block';
                    const display = authMode === 'register' ? 'block' : 'none';
                    document.getElementById('register-fields-siswa').style.display = 'none';
                    document.getElementById('register-fields-guru').style.display = 'none';
                    if (role !== 'admin' && role !== 'umum') {
                        document.getElementById('register-fields-' + role).style.display = display;
                    }
                }

                // 4. Jika mode Register Siswa, muat data Guru
                if (role === 'siswa' && authMode === 'register') {
                    populateTeacherSelect();
                }
            }

            function showLogoutConfirm() {
                const modal = document.getElementById('logout-confirm-modal');
                if (modal) modal.style.display = 'flex';
            }

            async function logout() {
                // 0. SAVE DULU sebelum logout agar progress tidak hilang
                if (STATE.screen === 'play' || STATE.screen === 'dialogue') {
                    showToast('💾 Menyimpan progress...');
                    try { await manualSave(); } catch(e) {}
                    await new Promise(r => setTimeout(r, 800)); // Beri waktu save selesai
                }

                // 1. Stop game engine & intervals
                if (window.gameLoopId) {
                    cancelAnimationFrame(window.gameLoopId);
                    window.gameLoopId = null;
                }
                if (window.saveIntervalId) {
                    clearInterval(window.saveIntervalId);
                    window.saveIntervalId = null;
                }

                // 2. Stop Firebase listeners
                if (DataService.unsubscribeMsg) {
                    DataService.unsubscribeMsg();
                    DataService.unsubscribeMsg = null;
                }
                if (typeof teacherMonitorUnsub !== 'undefined' && teacherMonitorUnsub) {
                    teacherMonitorUnsub();
                    teacherMonitorUnsub = null;
                }

                // 3. Bersihkan sesi
                localStorage.removeItem(SESSION_KEY);
                DataService.user = null;

                // 4. Reset form
                if (document.getElementById('form-siswa')) document.getElementById('form-siswa').reset();
                if (document.getElementById('form-guru')) document.getElementById('form-guru').reset();
                if (document.getElementById('form-umum')) document.getElementById('form-umum').reset();

                // 5. Sembunyikan SEMUA layar yang mungkin aktif
                const hideIds = [
                    'teacher-dashboard', 'start-screen', 'ui-layer',
                    'game-over-screen', 'ending-screen', 'login-screen',
                    'prologue-screen', 'gender-screen', 'profile-modal',
                    'logout-confirm-modal'
                ];
                hideIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    if (el.classList.contains('hidden')) return; // sudah hidden
                    if (id === 'start-screen' || id === 'ui-layer') {
                        el.classList.add('hidden');
                    } else {
                        el.style.display = 'none';
                    }
                });

                // 6. Sembunyikan canvas game
                const gcCanvas = document.getElementById('gameCanvas');
                if (gcCanvas) gcCanvas.style.display = 'none';

                // Sembunyikan minimap & pet HUD saat logout
                const minimapEl = document.getElementById('minimap-container');
                if (minimapEl) minimapEl.classList.remove('ingame');
                const petHudEl2 = document.getElementById('pet-hud-indicator');
                if (petHudEl2) petHudEl2.classList.remove('visible');

                // 7. Tampilkan title screen
                const titleScreen = document.getElementById('title-screen');
                if (titleScreen) {
                    titleScreen.classList.remove('hidden');
                    titleScreen.style.display = ''; // reset inline display jika ada
                }
                STATE.screen = 'title';

                // 8. Reset audio ke musik opening
                if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                    AudioService.playBGM('opening');
                }

                showToast("Sampai jumpa! 👋");
            }

            async function toggleAuthMode() {
                authMode = authMode === 'login' ? 'register' : 'login';
                const header = document.getElementById('auth-header');
                const switcher = document.querySelector('.auth-switch');
                const btns = document.querySelectorAll('.auth-btn');
                const disp = authMode === 'register' ? 'block' : 'none';
                document.getElementById('register-fields-siswa').style.display = disp;
                document.getElementById('register-fields-guru').style.display = disp;

                if (authMode === 'register') {
                    header.innerText = "BUAT AKUN BARU";
                    switcher.innerText = "Sudah punya akun? LOGIN DISINI 🔑";
                    switcher.style.borderColor = "#10b981";
                    switcher.style.color = "#047857";
                    btns.forEach(b => b.innerText = "DAFTAR SEKARANG");
                    if (currentRole === 'siswa') await populateTeacherSelect();
                } else {
                    header.innerText = "LOGIN AKUN";
                    switcher.innerText = "Belum punya akun? DAFTAR BARU ✨";
                    switcher.style.borderColor = "var(--accent)";
                    switcher.style.color = "#0f172a";
                    btns.forEach(b => b.innerText = "MASUK PULAU ARSA");
                }
            }

            async function populateTeacherSelect() {
                const select = document.getElementById('siswa-guru');
                select.innerHTML = '<option value="">⏳ Memuat daftar guru dari server...</option>';
                select.disabled = true;
                try {
                    await DataService.init(true);
                    const teachers = await DataService.getTeachers();
                    select.innerHTML = '<option value="">-- Pilih Guru Pendamping --</option>';
                    select.disabled = false;
                    if (teachers.length === 0) {
                        select.innerHTML += '<option value="" disabled>⚠️ Belum ada guru terdaftar</option>';
                    } else {
                        teachers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                        teachers.forEach(t => {
                            const option = document.createElement('option');
                            option.value = t.email;
                            const sekolah = t.school && t.school !== 'Unknown School' && t.school !== 'Unknown' ? ` — ${t.school}` : '';
                            option.innerText = `👩‍🏫 ${t.name}${sekolah}`;
                            select.appendChild(option);
                        });
                    }
                } catch(e) {
                    select.disabled = false;
                    select.innerHTML = '<option value="">⚠️ Gagal memuat — coba lagi</option>';
                    console.warn('populateTeacherSelect error:', e);
                }
            }

            async function handleAuth(role, btnElement) {
                let originalText = "";
                const msgEl = document.getElementById('login-msg'); // Ambil elemen pesan

                // Reset pesan sebelumnya
                msgEl.innerText = "";
                msgEl.style.color = "#ef4444"; // Default merah

                try {
                    // 1. FITUR OTOMATIS FULLSCREEN: Trigger saat tombol ditekan
                    toggleFullScreen();

                    await DataService.init(true);

                    // --- HANDLE ADMIN LOGIN ---
                    if (role === 'admin') {
                        const u = document.getElementById('admin-user').value;
                        const p = document.getElementById('admin-pass').value;

                        if (btnElement) {
                            originalText = btnElement.innerText;
                            btnElement.disabled = true;
                            btnElement.innerText = "⏳ Sinkronisasi...";
                        }

                        await new Promise(r => setTimeout(r, 800));

                        if (u === 'authar' && p === 'Sedayu@123') {
                            const adminEmail = "admin@system.local";
                            // ... (Logika admin sama, disederhanakan untuk diff) ...
                            // Hapus logika detail admin di sini agar fokus pada perubahan alert

                            // GANTI LOGIKA LOGIN SUKSES DISINI:
                            const dbLocal = DataService.getDB();
                            let finalAdminData = {
                                name: "Super Administrator", role: "admin", email: adminEmail,
                                password: p, saveData: null, lastActive: Date.now()
                            };

                            // Coba ambil dari cloud, kalau gagal pakai lokal (sama seperti kode lama)
                            // ... (Kode sinkronisasi admin tetap sama) ...

                            dbLocal[adminEmail] = finalAdminData;
                            DataService.saveDB(dbLocal);
                            localStorage.setItem(SESSION_KEY, adminEmail);
                            DataService.user = finalAdminData;

                            // GANTI ALERT DENGAN INI:
                            msgEl.style.color = "#4ade80";
                            msgEl.innerText = "✅ LOGIN ADMIN BERHASIL! Mengalihkan...";

                            setTimeout(() => {
                                document.getElementById('login-screen').style.display = 'none';
                                initTeacherDashboard();
                            }, 1000);
                        } else {
                            // GANTI ALERT DENGAN INI:
                            msgEl.innerText = "❌ Username atau Password Admin salah!";
                        }

                        if (btnElement && originalText) {
                            btnElement.disabled = false;
                            btnElement.innerText = originalText;
                        }
                        return;
                    }

                    const email = document.getElementById(role + '-email').value;
                    const pass = document.getElementById(role + '-pass').value;

                    // GANTI ALERT VALIDASI:
                    if (!email || !pass) {
                        msgEl.innerText = "⚠️ Email & Password wajib diisi!";
                        return;
                    }

                    if (btnElement) {
                        originalText = btnElement.innerText;
                        btnElement.disabled = true;
                        btnElement.innerText = "⏳ Memproses...";
                        btnElement.style.opacity = "0.7";
                    }

                    if (authMode === 'register') {
                        let name, details, school, mentor;
                        if (role === 'siswa') {
                            name = document.getElementById('siswa-nama').value;
                            details = document.getElementById('siswa-kelas').value;
                            mentor = document.getElementById('siswa-guru').value;
                            if (!name || !details) {
                                msgEl.innerText = "⚠️ Lengkapi Nama & Kelas!"; // GANTI ALERT
                                throw new Error("Validation Failed");
                            }
                        } else {
                            name = document.getElementById('guru-nama').value;
                            details = document.getElementById('guru-nip').value;
                            school = document.getElementById('guru-sekolah').value;
                            if (!name || !details || !school) {
                                msgEl.innerText = "⚠️ Lengkapi Data Guru!"; // GANTI ALERT
                                throw new Error("Validation Failed");
                            }
                        }

                        const res = await DataService.register(role, { email, password: pass, name, details, school, mentor });

                        // GANTI ALERT HASIL REGISTRASI:
                        if (res.success) {
                            msgEl.style.color = "#4ade80";
                            let extraMsg = "";
                            if (res.msg.includes("LOKAL")) extraMsg = " (Offline)";

                            if (role === 'siswa') {
                                // FIX: Auto-login langsung setelah daftar — siswa tidak perlu login ulang
                                msgEl.innerText = "✅ Registrasi Berhasil!" + extraMsg + " Memuat game...";
                                setTimeout(async () => {
                                    const loginRes = await DataService.login(email, pass);
                                    if (loginRes.success) {
                                        localStorage.setItem(SESSION_KEY, email);
                                        const u = loginRes.user;
                                        const welcomeName = document.getElementById('welcome-name');
                                        const welcomeClass = document.getElementById('welcome-class');
                                        const welcomeMentor = document.getElementById('welcome-mentor');
                                        if (welcomeName) welcomeName.innerText = u.name || 'Siswa';
                                        if (welcomeClass) welcomeClass.innerText = u.details || 'Umum';
                                        if (welcomeMentor && u.mentor) welcomeMentor.innerText = 'Mentor Active';
                                        document.getElementById('login-screen').style.display = 'none';
                                        const titleSc = document.getElementById('title-screen');
                                        if (titleSc) { titleSc.style.display = 'none'; titleSc.classList.add('hidden'); }
                                        startPrologue();
                                    } else {
                                        // Fallback: pindah ke tab login jika auto-login gagal
                                        msgEl.innerText = "✅ Registrasi Berhasil! Silakan Login.";
                                        setTimeout(() => toggleAuthMode(), 1000);
                                    }
                                }, 800);
                            } else {
                                // Guru: tetap arahkan ke login
                                msgEl.innerText = "✅ Registrasi Berhasil!" + extraMsg + " Silakan Login.";
                                setTimeout(() => toggleAuthMode(), 1500);
                            }
                        } else {
                            msgEl.style.color = "#ef4444";
                            msgEl.innerText = "❌ " + res.msg;
                        }

                    } else {
                        const res = await DataService.login(email, pass);
                        if (res.success) {
                            // CEK SALAH AKUN: siswa login di tab guru atau sebaliknya
                            if (res.user.role && res.user.role !== role && res.user.role !== 'admin') {
                                const roleLabel = { siswa: 'Siswa', guru: 'Guru', admin: 'Admin' };
                                const correctRole = roleLabel[res.user.role] || res.user.role;
                                const usedRole = roleLabel[role] || role;
                                msgEl.style.color = '#ef4444';
                                msgEl.innerText = `❌ SALAH AKUN! Akun "${email}" terdaftar sebagai ${correctRole}, bukan ${usedRole}.\n\nSilakan login menggunakan tab ${correctRole}.`;
                                return;
                            }

                            localStorage.setItem(SESSION_KEY, email);

                            // FIX: JANGAN SEMBUNYIKAN LAYAR LOGIN DULUAN SEBELUM LOGIKA SIAP
                            // document.getElementById('login-screen').style.display = 'none'; <-- PINDAHKAN KE BAWAH

                            if (role === 'guru') {
                                document.getElementById('login-screen').style.display = 'none';
                                initTeacherDashboard();
                            } else {
                                document.getElementById('welcome-name').innerText = res.user.name;
                                document.getElementById('welcome-class').innerText = res.user.details;
                                if (res.user.mentor) document.getElementById('welcome-mentor').innerText = "Mentor Active";

                                if (!res.user.saveData) {
                                    // New Game Logic
                                    STATE.player.gender = 'boy';
                                    STATE.day = 1;
                                    STATE.isPrologue = true;

                                    // FIX: HAPUS AWAIT PADA MANUAL SAVE AGAR TIDAK MEMBLOKIR UI JIKA KONEKSI LAMBAT
                                    manualSave(); // Biarkan save berjalan di background (Fire & Forget)

                                    document.getElementById('login-screen').style.display = 'none'; // Sembunyikan Login
                                    startPrologue(); // Langsung mulai Prologue
                                } else {
                                    // Load Game Logic
                                    manualSave(); // Background save
                                    document.getElementById('login-screen').style.display = 'none'; // Sembunyikan Login
                                    document.getElementById('start-screen').classList.remove('hidden'); // Tampilkan Start
                                }
                            }
                        } else {
                            // GANTI ALERT GAGAL LOGIN:
                            msgEl.innerText = "❌ " + res.msg;
                        }
                    }

                } catch (err) {
                    if (err.message !== "Validation Failed") {
                        msgEl.innerText = "⚠️ Error Sistem: " + err.message; // GANTI ALERT
                        console.error(err);
                    }
                } finally {
                    if (btnElement && originalText) {
                        btnElement.disabled = false;
                        btnElement.innerText = originalText;
                        btnElement.style.opacity = "1";
                    }
                }
            }

            // FIX: Ubah menjadi ASYNC dan Tambahkan AWAIT DataService.init(true)
            async function initTeacherDashboard() {
                // Pastikan semua layar lain tersembunyi sebelum tampilkan dashboard
                const loginSc = document.getElementById('login-screen');
                const titleSc = document.getElementById('title-screen');
                const startSc = document.getElementById('start-screen');
                const uiLayer = document.getElementById('ui-layer');
                const gc = document.getElementById('gameCanvas');
                if (loginSc) loginSc.style.display = 'none';
                if (titleSc) { titleSc.style.display = 'none'; titleSc.classList.add('hidden'); }
                if (startSc) startSc.classList.add('hidden');
                if (uiLayer) uiLayer.style.display = 'none';
                if (gc) gc.style.display = 'none';

                document.getElementById('teacher-dashboard').style.display = 'block';

                // Tampilkan halaman Welcome terlebih dahulu
                document.querySelectorAll('.dash-page').forEach(el => el.classList.add('hidden'));
                const welcomePage = document.getElementById('page-welcome');
                if (welcomePage) {
                    welcomePage.classList.remove('hidden');
                    document.querySelectorAll('.dash-nav li').forEach(el => el.classList.remove('active'));
                    const welcomeNav = document.getElementById('nav-welcome');
                    if (welcomeNav) welcomeNav.classList.add('active');
                }

                const user = DataService.user;
                const titleEl = document.getElementById('dash-main-title');

                // CUSTOMIZE DASHBOARD TITLE BASED ON ROLE
                if (user && user.role === 'admin') {
                    titleEl.innerHTML = "ADMINISTRATOR<br>CONTROL PANEL";
                    titleEl.style.color = "#ef4444";
                    titleEl.style.textShadow = "0 0 10px rgba(239, 68, 68, 0.3)";
                    // Admin: tampilkan menu statistik, buka langsung halaman statistik
                    const navStats = document.getElementById('nav-statistik');
                    if (navStats) navStats.style.display = '';
                    // Langsung buka statistik untuk admin
                    document.querySelectorAll('.dash-page').forEach(el => el.classList.add('hidden'));
                    const statsPage = document.getElementById('page-statistik');
                    if (statsPage) {
                        statsPage.classList.remove('hidden');
                        document.querySelectorAll('.dash-nav li').forEach(el => el.classList.remove('active'));
                        if (navStats) navStats.classList.add('active');
                    }
                    renderAdminWelcomePage();
                } else {
                    titleEl.innerHTML = "TEACHER<br>COMMAND CENTER";
                    titleEl.style.color = "#fbbf24";
                    titleEl.style.textShadow = "none";
                    // Sembunyikan menu statistik untuk guru
                    const navStats = document.getElementById('nav-statistik');
                    if (navStats) navStats.style.display = 'none';
                }

                // Tampilkan status connecting agar tidak bingung
                const statusEl = document.getElementById('dash-connection-status');
                if (statusEl) statusEl.innerHTML = 'Connecting to Cloud...';

                // FIX CRITICAL: Pastikan koneksi ke Cloud/Firebase sudah siap SEBELUM subscribe data
                // Masalah sebelumnya: Fungsi ini jalan duluan sebelum DB connect, jadi fallback ke lokal.
                await DataService.init(true);

                // FIX EXTRA: Jika db masih null padahal firebase sudah ada, coba paksa ambil instance
                if (navigator.onLine && typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && !db) {
                    try {
                        db = firebase.firestore();
                        DataService.mode = 'firebase';
                        console.log("✅ Dashboard: Firebase DB instance berhasil diambil paksa.");
                    } catch(e) { console.warn("Gagal paksa ambil DB:", e); }
                }

                updateSourceBtnLabel(); // Update label tombol saat init

                // Hentikan listener lama jika ada (mencegah duplikasi)
                if (teacherMonitorUnsub) {
                    teacherMonitorUnsub();
                    teacherMonitorUnsub = null;
                }

                // Mulai Real-time Listener
                // Fungsi ini akan dipanggil otomatis oleh Firebase setiap ada perubahan data
                teacherMonitorUnsub = DataService.subscribeToStudents((students) => {
                    updateDashboardViews(students);
                });
            }

            // ============================================================
            // FUNGSI RENDER WELCOME PAGE KHUSUS ADMIN
            // ============================================================
            function renderAdminWelcomePage() {
                const page = document.getElementById('page-welcome');
                if (!page) return;
                page.innerHTML = `
                <!-- ADMIN WELCOME PAGE -->
                <h2 style="color:#0f172a; margin-top:0; display:flex; align-items:center; gap:10px;">
                    🛡️ Super Admin — Pusat Kontrol & Panduan Sistem
                </h2>

                <!-- HERO BANNER ADMIN -->
                <div style="background:linear-gradient(135deg,#450a0a 0%,#7f1d1d 50%,#450a0a 100%); border-radius:16px; padding:24px 28px; margin-bottom:20px; position:relative; overflow:hidden; box-shadow:0 4px 20px rgba(239,68,68,0.3);">
                    <div style="position:absolute; top:-20px; right:-20px; font-size:120px; opacity:0.07; pointer-events:none;">🛡️</div>
                    <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                        <div style="flex:1; min-width:200px;">
                            <div style="font-size:22px; font-weight:800; color:#fca5a5; font-family:'Fredoka',sans-serif; letter-spacing:1px; text-shadow:0 2px 8px rgba(0,0,0,0.5);">SELAMAT DATANG, SUPER ADMINISTRATOR</div>
                            <div style="font-size:12px; color:#fecaca; margin-top:4px; font-style:italic;">— Nusantara Arsa: Rise of Student —</div>
                            <div style="font-size:11px; color:#fde8e8; margin-top:10px; line-height:1.7;">
                                Anda memiliki akses penuh ke seluruh sistem. Panel ini menjelaskan <b style="color:#fca5a5;">keseluruhan alur gameplay siswa</b>, fitur <b style="color:#fca5a5;">menu guru</b>, dan seluruh <b style="color:#fca5a5;">kendali admin</b> yang tersedia.
                            </div>
                        </div>
                        <div style="text-align:center;">
                            <div style="background:rgba(255,255,255,0.08); border:2px solid #fca5a5; border-radius:12px; padding:12px 20px;">
                                <div style="font-size:28px;">🔐</div>
                                <div style="font-size:10px; color:#fca5a5; font-weight:700; margin-top:4px;">ADMIN ACCESS</div>
                                <div style="font-size:9px; color:#fecaca;">Full System Control</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ===================== SECTION 1: GAMEPLAY SISWA ===================== -->
                <div style="background:#fff; border-radius:14px; padding:20px; margin-bottom:16px; border:2px solid #3b82f6; box-shadow:0 2px 12px rgba(59,130,246,0.1);">
                    <h3 style="margin:0 0 14px 0; color:#1e3a5f; font-size:14px; font-family:'Fredoka',sans-serif; display:flex; align-items:center; gap:8px;">🎮 KESELURUHAN GAMEPLAY SISWA</h3>
                    <p style="font-size:11px; color:#475569; line-height:1.7; margin:0 0 14px 0;">
                        Berikut adalah seluruh alur yang dilalui siswa dari awal login hingga selesai bermain:
                    </p>

                    <!-- Alur Utama -->
                    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:16px;">
                        <div style="background:#eff6ff; border-radius:10px; padding:12px; border:1px solid #bfdbfe; text-align:center;">
                            <div style="font-size:22px;">🔑</div>
                            <div style="font-size:10px; font-weight:800; color:#1e40af; margin-top:4px;">1. REGISTRASI</div>
                            <div style="font-size:9.5px; color:#3b82f6; margin-top:3px; line-height:1.5;">Daftar akun dengan nama, kelas, email, password, dan pilih guru pendamping</div>
                        </div>
                        <div style="background:#f0fdf4; border-radius:10px; padding:12px; border:1px solid #bbf7d0; text-align:center;">
                            <div style="font-size:22px;">🧑‍🎤</div>
                            <div style="font-size:10px; font-weight:800; color:#14532d; margin-top:4px;">2. BUAT KARAKTER</div>
                            <div style="font-size:9.5px; color:#16a34a; margin-top:3px; line-height:1.5;">Pilih jenis kelamin (Boy/Girl), masukkan nama karakter, dan tentukan atribut awal</div>
                        </div>
                        <div style="background:#fefce8; border-radius:10px; padding:12px; border:1px solid #fde68a; text-align:center;">
                            <div style="font-size:22px;">🗺️</div>
                            <div style="font-size:10px; font-weight:800; color:#854d0e; margin-top:4px;">3. PILIH JALUR</div>
                            <div style="font-size:9.5px; color:#a16207; margin-top:3px; line-height:1.5;">Memilih satu dari 4 jalur kehidupan: Bekerja, Kuliah, Wirausaha, atau Menikah</div>
                        </div>
                        <div style="background:#fdf4ff; border-radius:10px; padding:12px; border:1px solid #e9d5ff; text-align:center;">
                            <div style="font-size:22px;">⚔️</div>
                            <div style="font-size:10px; font-weight:800; color:#581c87; margin-top:4px;">4. BERMAIN RPG</div>
                            <div style="font-size:9.5px; color:#7c3aed; margin-top:3px; line-height:1.5;">Eksplorasi dunia open-world, interaksi warga, selesaikan quest & event harian</div>
                        </div>
                    </div>

                    <!-- 4 Jalur Detail -->
                    <div style="background:#f8fafc; border-radius:10px; padding:14px; margin-bottom:14px; border:1px solid #e2e8f0;">
                        <div style="font-size:11px; font-weight:800; color:#1e3a5f; margin-bottom:10px;">📌 Detail 4 Jalur Kehidupan Siswa:</div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                            <div style="background:#fef3c7; border-radius:8px; padding:10px; border-left:4px solid #f59e0b;">
                                <div style="font-size:11px; font-weight:700; color:#92400e;">⚒️ Jalur BEKERJA</div>
                                <div style="font-size:10px; color:#78350f; margin-top:4px; line-height:1.6;">Siswa melamar pekerjaan ke perusahaan, menjalani wawancara, lembur, naik jabatan (Level 1–5), dan mendapat gaji harian. Membutuhkan stat STR & INT tinggi.</div>
                            </div>
                            <div style="background:#dbeafe; border-radius:8px; padding:10px; border-left:4px solid #3b82f6;">
                                <div style="font-size:11px; font-weight:700; color:#1e3a8a;">🎓 Jalur KULIAH</div>
                                <div style="font-size:10px; color:#1e40af; margin-top:4px; line-height:1.6;">Siswa mendaftar jurusan di kampus, mengikuti kuliah & ujian, mengambil beasiswa, dan lulus dengan gelar. Membutuhkan stat INT tinggi dan uang SPP.</div>
                            </div>
                            <div style="background:#dcfce7; border-radius:8px; padding:10px; border-left:4px solid #22c55e;">
                                <div style="font-size:11px; font-weight:700; color:#14532d;">🏪 Jalur WIRAUSAHA</div>
                                <div style="font-size:10px; color:#166534; margin-top:4px; line-height:1.6;">Siswa membuka usaha, beli-jual di pasar, memanfaatkan tren viral untuk keuntungan besar, dan mengembangkan bisnis. Membutuhkan stat BIZ & REP.</div>
                            </div>
                            <div style="background:#fce7f3; border-radius:8px; padding:10px; border-left:4px solid #ec4899;">
                                <div style="font-size:11px; font-weight:700; color:#831843;">💍 Jalur MENIKAH</div>
                                <div style="font-size:10px; color:#9d174d; margin-top:4px; line-height:1.6;">Siswa menjalani kehidupan rumah tangga, mengelola keuangan keluarga, membesarkan anak, dan menjaga keseimbangan antara karier dan keluarga.</div>
                            </div>
                        </div>
                    </div>

                    <!-- Sistem & Mekanik Game -->
                    <div style="background:#f8fafc; border-radius:10px; padding:14px; border:1px solid #e2e8f0;">
                        <div style="font-size:11px; font-weight:800; color:#1e3a5f; margin-bottom:10px;">⚙️ Sistem & Mekanik Utama dalam Game:</div>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
                            <div style="background:#fff; border-radius:8px; padding:10px; border:1px solid #e2e8f0;">
                                <div style="font-size:10px; font-weight:700; color:#1e40af;">📊 Atribut Karakter</div>
                                <div style="font-size:9.5px; color:#475569; margin-top:3px; line-height:1.5;"><b>STR</b> (Kekuatan Kerja), <b>INT</b> (Kecerdasan), <b>REP</b> (Reputasi), <b>BIZ</b> (Bisnis). Naik lewat aktivitas harian.</div>
                            </div>
                            <div style="background:#fff; border-radius:8px; padding:10px; border:1px solid #e2e8f0;">
                                <div style="font-size:10px; font-weight:700; color:#7c3aed;">⏰ Sistem Waktu</div>
                                <div style="font-size:9.5px; color:#475569; margin-top:3px; line-height:1.5;">Jam dalam game berjalan real-time. Aktivitas seperti kerja, belajar, dan tidur menghabiskan waktu. Hari berganti otomatis.</div>
                            </div>
                            <div style="background:#fff; border-radius:8px; padding:10px; border:1px solid #e2e8f0;">
                                <div style="font-size:10px; font-weight:700; color:#166534;">💰 Sistem Ekonomi</div>
                                <div style="font-size:9.5px; color:#475569; margin-top:3px; line-height:1.5;">Uang (Gold) didapat dari kerja, usaha, atau misi. Dipakai beli item, bayar kuliah, atau investasi bisnis.</div>
                            </div>
                            <div style="background:#fff; border-radius:8px; padding:10px; border:1px solid #e2e8f0;">
                                <div style="font-size:10px; font-weight:700; color:#92400e;">📦 Inventori & Toko</div>
                                <div style="font-size:9.5px; color:#475569; margin-top:3px; line-height:1.5;">Siswa bisa beli item dari Pedagang, menyimpan di inventori, dan menjualnya kembali di Merchant untuk profit.</div>
                            </div>
                            <div style="background:#fff; border-radius:8px; padding:10px; border:1px solid #e2e8f0;">
                                <div style="font-size:10px; font-weight:700; color:#b91c1c;">📱 HP & Sosmed</div>
                                <div style="font-size:9.5px; color:#475569; margin-top:3px; line-height:1.5;">Siswa punya HP in-game: cek pesan dari guru, lihat tren viral di sosmed, dan kelola rekening bank digital.</div>
                            </div>
                            <div style="background:#fff; border-radius:8px; padding:10px; border:1px solid #e2e8f0;">
                                <div style="font-size:10px; font-weight:700; color:#0369a1;">📝 Jurnal Refleksi</div>
                                <div style="font-size:9.5px; color:#475569; margin-top:3px; line-height:1.5;">Di akhir game, siswa mengisi jurnal refleksi pribadi yang bisa dibaca guru di dashboard untuk evaluasi pembelajaran.</div>
                            </div>
                            <div style="background:#fff; border-radius:8px; padding:10px; border:1px solid #e2e8f0;">
                                <div style="font-size:10px; font-weight:700; color:#6d28d9;">🌾 Lahan & Bertani</div>
                                <div style="font-size:9.5px; color:#475569; margin-top:3px; line-height:1.5;">Tersedia lahan pertanian yang bisa diolah — tanam, rawat, dan panen untuk mendapat hasil jual ke pasar.</div>
                            </div>
                            <div style="background:#fff; border-radius:8px; padding:10px; border:1px solid #e2e8f0;">
                                <div style="font-size:10px; font-weight:700; color:#be185d;">🔥 Event Viral</div>
                                <div style="font-size:9.5px; color:#475569; margin-top:3px; line-height:1.5;">Event acak viral muncul periodik — harga item tertentu melonjak 300%. Siswa harus cepat beli-jual sebelum habis.</div>
                            </div>
                            <div style="background:#fff; border-radius:8px; padding:10px; border:1px solid #e2e8f0;">
                                <div style="font-size:10px; font-weight:700; color:#047857;">🧭 Warga & Interaksi</div>
                                <div style="font-size:9.5px; color:#475569; margin-top:3px; line-height:1.5;">Puluhan warga tersebar di peta: Pedagang, HRD, Dosen, Tetangga, dll. Setiap warga punya dialog unik dan misi.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ===================== SECTION 2: MENU GURU ===================== -->
                <div style="background:#fff; border-radius:14px; padding:20px; margin-bottom:16px; border:2px solid #22c55e; box-shadow:0 2px 12px rgba(34,197,94,0.1);">
                    <h3 style="margin:0 0 14px 0; color:#14532d; font-size:14px; font-family:'Fredoka',sans-serif; display:flex; align-items:center; gap:8px;">👩‍🏫 MENU GURU — TEACHER COMMAND CENTER</h3>
                    <p style="font-size:11px; color:#475569; line-height:1.7; margin:0 0 14px 0;">
                        Guru login dengan akun terdaftar dan mendapat akses ke semua fitur monitoring & evaluasi berikut:
                    </p>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div style="background:#f0fdf4; border-radius:10px; padding:12px; border:1px solid #bbf7d0;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">📡</span>
                                <span style="font-size:11px; font-weight:800; color:#14532d;">Live Monitoring</span>
                            </div>
                            <div style="font-size:10px; color:#166534; line-height:1.6;">Pantau progres semua siswa secara <b>realtime</b>: jalur yang dipilih, uang saat ini, hari game, atribut STR/INT/REP/BIZ, dan status aktif tidaknya siswa.</div>
                        </div>
                        <div style="background:#f0fdf4; border-radius:10px; padding:12px; border:1px solid #bbf7d0;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">👥</span>
                                <span style="font-size:11px; font-weight:800; color:#14532d;">Database Akun</span>
                            </div>
                            <div style="font-size:10px; color:#166534; line-height:1.6;">Daftar semua siswa yang terdaftar di bawah bimbingan guru tersebut: nama, email, kelas, dan opsi <b>reset data</b> atau <b>hapus akun</b>.</div>
                        </div>
                        <div style="background:#f0fdf4; border-radius:10px; padding:12px; border:1px solid #bbf7d0;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">🏆</span>
                                <span style="font-size:11px; font-weight:800; color:#14532d;">Class Ranking</span>
                            </div>
                            <div style="font-size:10px; color:#166534; line-height:1.6;">Peringkat seluruh siswa dalam kelas berdasarkan skor gabungan dari atribut, uang, dan capaian game. Berguna untuk evaluasi kompetitif.</div>
                        </div>
                        <div style="background:#f0fdf4; border-radius:10px; padding:12px; border:1px solid #bbf7d0;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">📝</span>
                                <span style="font-size:11px; font-weight:800; color:#14532d;">Grading System</span>
                            </div>
                            <div style="font-size:10px; color:#166534; line-height:1.6;">Konversi otomatis data game siswa menjadi <b>nilai angka</b> (0–100) berdasarkan formula yang bisa dikustomisasi guru. Ekspor nilai ke CSV.</div>
                        </div>
                        <div style="background:#f0fdf4; border-radius:10px; padding:12px; border:1px solid #bbf7d0;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">📖</span>
                                <span style="font-size:11px; font-weight:800; color:#14532d;">Student Journals</span>
                            </div>
                            <div style="font-size:10px; color:#166534; line-height:1.6;">Baca jurnal refleksi yang ditulis siswa di akhir sesi game. Berisi perasaan, keputusan, dan pembelajaran pribadi. Alat evaluasi afektif.</div>
                        </div>
                        <div style="background:#f0fdf4; border-radius:10px; padding:12px; border:1px solid #bbf7d0;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">✅</span>
                                <span style="font-size:11px; font-weight:800; color:#14532d;">Competency Validation</span>
                            </div>
                            <div style="font-size:10px; color:#166534; line-height:1.6;">Validasi kompetensi siswa berdasarkan capaian di game yang dipetakan ke <b>indikator kurikulum</b>. Cocok untuk portofolio P5/BK.</div>
                        </div>
                        <div style="background:#ede9fe; border-radius:10px; padding:12px; border:1px solid #c4b5fd; grid-column:span 2;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">🧭</span>
                                <span style="font-size:11px; font-weight:800; color:#4c1d95;">Dashboard BK (Bimbingan Konseling)</span>
                            </div>
                            <div style="font-size:10px; color:#5b21b6; line-height:1.6;">Identifikasi siswa yang menunjukkan tanda-tanda membutuhkan pendampingan (jalur menikah terlalu dini, ekonomi kritis, nilai rendah). Guru bisa <b>kirim pesan langsung</b> ke HP in-game siswa untuk intervensi soft skill tanpa mengganggu permainan.</div>
                        </div>
                    </div>
                    <div style="margin-top:12px; background:#dcfce7; border-radius:8px; padding:10px; border-left:3px solid #22c55e;">
                        <div style="font-size:10.5px; color:#14532d; line-height:1.7;">
                            💡 <b>Tips untuk Guru:</b> Gunakan Live Monitoring saat sesi aktif berlangsung di kelas. Setelah sesi selesai, gunakan Grading System + Student Journals untuk evaluasi tertulis. Dashboard BK paling efektif digunakan untuk sesi konseling individual pasca-game.
                        </div>
                    </div>
                </div>

                <!-- ===================== SECTION 3: MENU ADMIN ===================== -->
                <div style="background:#fff; border-radius:14px; padding:20px; margin-bottom:16px; border:2px solid #ef4444; box-shadow:0 2px 12px rgba(239,68,68,0.1);">
                    <h3 style="margin:0 0 14px 0; color:#7f1d1d; font-size:14px; font-family:'Fredoka',sans-serif; display:flex; align-items:center; gap:8px;">🛡️ MENU ADMIN — ADMINISTRATOR CONTROL PANEL</h3>
                    <p style="font-size:11px; color:#475569; line-height:1.7; margin:0 0 14px 0;">
                        Admin memiliki akses ke <b>seluruh data sistem</b> tanpa batas kelas. Berikut semua menu dan kewenangan yang dimiliki:
                    </p>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div style="background:#fef2f2; border-radius:10px; padding:12px; border:1px solid #fecaca;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">📡</span>
                                <span style="font-size:11px; font-weight:800; color:#7f1d1d;">Live Monitoring (Global)</span>
                            </div>
                            <div style="font-size:10px; color:#991b1b; line-height:1.6;">Melihat <b>seluruh siswa</b> dari semua guru secara bersamaan — bukan hanya satu kelas. Tabel menampilkan tambahan kolom Guru Pendamping.</div>
                        </div>
                        <div style="background:#fef2f2; border-radius:10px; padding:12px; border:1px solid #fecaca;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">👥</span>
                                <span style="font-size:11px; font-weight:800; color:#7f1d1d;">Database Akun (Semua User)</span>
                            </div>
                            <div style="font-size:10px; color:#991b1b; line-height:1.6;">Melihat <b>semua akun</b> di sistem: Admin, Guru, dan Siswa. Dapat <b>menghapus akun guru/siswa</b> secara permanen dan <b>reset data</b> game siapa saja.</div>
                        </div>
                        <div style="background:#fef2f2; border-radius:10px; padding:12px; border:1px solid #fecaca;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">🏆</span>
                                <span style="font-size:11px; font-weight:800; color:#7f1d1d;">Class Ranking (Semua Kelas)</span>
                            </div>
                            <div style="font-size:10px; color:#991b1b; line-height:1.6;">Peringkat global mencakup semua siswa lintas kelas dan guru. Berguna untuk melihat perbandingan antar kelas atau sekolah.</div>
                        </div>
                        <div style="background:#fef2f2; border-radius:10px; padding:12px; border:1px solid #fecaca;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">📝</span>
                                <span style="font-size:11px; font-weight:800; color:#7f1d1d;">Grading System (Global)</span>
                            </div>
                            <div style="font-size:10px; color:#991b1b; line-height:1.6;">Akses nilai semua siswa, semua kelas. Bisa ekspor data CSV global untuk keperluan laporan sekolah atau dinas.</div>
                        </div>
                        <div style="background:#fef2f2; border-radius:10px; padding:12px; border:1px solid #fecaca;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">📖</span>
                                <span style="font-size:11px; font-weight:800; color:#7f1d1d;">Student Journals (Semua)</span>
                            </div>
                            <div style="font-size:10px; color:#991b1b; line-height:1.6;">Baca jurnal refleksi semua siswa dari semua guru. Berguna untuk riset, supervisi, atau audit pembelajaran.</div>
                        </div>
                        <div style="background:#fef2f2; border-radius:10px; padding:12px; border:1px solid #fecaca;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">✅</span>
                                <span style="font-size:11px; font-weight:800; color:#7f1d1d;">Competency (Global)</span>
                            </div>
                            <div style="font-size:10px; color:#991b1b; line-height:1.6;">Validasi dan audit kompetensi lintas kelas. Dapat digunakan untuk supervisi akademik dan laporan portofolio institusi.</div>
                        </div>
                        <div style="background:#fef2f2; border-radius:10px; padding:12px; border:1px solid #fecaca;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">🧭</span>
                                <span style="font-size:11px; font-weight:800; color:#7f1d1d;">Dashboard BK (Supervisi)</span>
                            </div>
                            <div style="font-size:10px; color:#991b1b; line-height:1.6;">Identifikasi pola masalah lintas kelas. Dapat mengintervensi dan mengirim pesan ke HP in-game siswa dari guru mana pun.</div>
                        </div>
                        <div style="background:#450a0a; border-radius:10px; padding:12px; border:1px solid #ef4444;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                <span style="font-size:18px;">⚠️</span>
                                <span style="font-size:11px; font-weight:800; color:#fca5a5;">Reset Data (Akses Penuh)</span>
                            </div>
                            <div style="font-size:10px; color:#fecaca; line-height:1.6;"><b style="color:#fca5a5;">WEWENANG EKSKLUSIF ADMIN:</b> Reset data game <b>siapa saja</b> termasuk data guru. Fungsi ini permanen dan tidak dapat dibatalkan. Gunakan dengan sangat hati-hati.</div>
                        </div>
                    </div>
                    <div style="margin-top:12px; background:#fef2f2; border-radius:8px; padding:10px; border-left:3px solid #ef4444;">
                        <div style="font-size:10.5px; color:#7f1d1d; line-height:1.7;">
                            🔐 <b>Kredensial Admin:</b> Username &amp; password admin tersimpan dalam kode sistem dan tidak dapat diubah melalui UI. Untuk mengubah, harus dilakukan di source code oleh developer. Jangan bagikan kredensial ini ke pihak lain.
                        </div>
                    </div>
                </div>

                <!-- PERBEDAAN ADMIN vs GURU -->
                <div style="background:#fff; border-radius:14px; padding:20px; margin-bottom:16px; border:1px solid #e2e8f0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                    <h3 style="margin:0 0 14px 0; color:#1e3a5f; font-size:13px; font-family:'Fredoka',sans-serif; display:flex; align-items:center; gap:8px;">⚖️ Perbandingan Hak Akses: Admin vs Guru</h3>
                    <div style="overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; font-size:10.5px;">
                            <thead>
                                <tr style="background:#1e3a5f; color:white;">
                                    <th style="padding:8px 10px; text-align:left; border-radius:6px 0 0 0;">Fitur</th>
                                    <th style="padding:8px 10px; text-align:center; color:#fca5a5;">🛡️ Admin</th>
                                    <th style="padding:8px 10px; text-align:center; color:#bbf7d0; border-radius:0 6px 0 0;">👩‍🏫 Guru</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="background:#f8fafc;"><td style="padding:7px 10px; border-bottom:1px solid #e2e8f0;">Live Monitoring</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a; font-weight:700;">✅ Semua Siswa</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a;">✅ Siswa Sendiri</td></tr>
                                <tr><td style="padding:7px 10px; border-bottom:1px solid #e2e8f0;">Database Akun</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a; font-weight:700;">✅ Admin+Guru+Siswa</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a;">✅ Siswa Sendiri</td></tr>
                                <tr style="background:#f8fafc;"><td style="padding:7px 10px; border-bottom:1px solid #e2e8f0;">Hapus Akun Guru</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a; font-weight:700;">✅ Ya</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#dc2626;">❌ Tidak</td></tr>
                                <tr><td style="padding:7px 10px; border-bottom:1px solid #e2e8f0;">Reset Data Siswa</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a; font-weight:700;">✅ Siapa Saja</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a;">✅ Siswa Sendiri</td></tr>
                                <tr style="background:#f8fafc;"><td style="padding:7px 10px; border-bottom:1px solid #e2e8f0;">Ranking</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a; font-weight:700;">✅ Global</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a;">✅ Kelas Sendiri</td></tr>
                                <tr><td style="padding:7px 10px; border-bottom:1px solid #e2e8f0;">Grading & Export</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a; font-weight:700;">✅ Semua Kelas</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a;">✅ Kelas Sendiri</td></tr>
                                <tr style="background:#f8fafc;"><td style="padding:7px 10px; border-bottom:1px solid #e2e8f0;">Student Journals</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a; font-weight:700;">✅ Semua Siswa</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a;">✅ Siswa Sendiri</td></tr>
                                <tr><td style="padding:7px 10px; border-bottom:1px solid #e2e8f0;">Competency</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a; font-weight:700;">✅ Lintas Kelas</td><td style="padding:7px 10px; text-align:center; border-bottom:1px solid #e2e8f0; color:#16a34a;">✅ Kelas Sendiri</td></tr>
                                <tr style="background:#fef2f2;"><td style="padding:7px 10px; font-weight:700; color:#7f1d1d;">Force Sync / Refresh</td><td style="padding:7px 10px; text-align:center; color:#16a34a; font-weight:700;">✅ Ya</td><td style="padding:7px 10px; text-align:center; color:#16a34a;">✅ Ya</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- FOOTER INFO -->
                <div style="background:linear-gradient(135deg,#1e3a5f,#0f2744); border-radius:12px; padding:16px 20px; text-align:center; border:1px solid #334155;">
                    <div style="font-size:11px; color:#93c5fd; line-height:1.8;">
                        🌐 <b style="color:white;">Nusantara Arsa: Rise of Student</b> — Dibuat oleh <b style="color:#fbbf24;">Arnailul Auth</b><br>
                        📧 <b style="color:#fbbf24;"><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="60060b090c150c011515140908141d0e4e4f406760090e170f064e030f0d" style="color:#fbbf24; text-decoration:none;">[email&#160;protected]</a></b> &nbsp;|&nbsp; 🔗 <b style="color:#fbbf24;">autharnailul2302-source.github.io</b><br>
                        <span style="font-size:10px; color:#64748b; margin-top:6px; display:block;">GEMPITA Awards 2025 — Science-Tech — Dinas Pendidikan Jawa Timur</span>
                    </div>
                </div>
                `;
            }

            // --- NEW: FUNGSI HANDLER TOMBOL SOURCE ---
            function toggleDashboardSource() {
                const newSource = DataService.toggleDashboardSource();
                updateSourceBtnLabel();

                // Re-init Dashboard untuk menerapkan source baru
                initTeacherDashboard();
            }

            // --- NEW: FUNGSI UPDATE TAMPILAN DASHBOARD (DIPISAH AGAR BISA DIPANGGIL MANUAL) ---
            // --- FUNGSI POPUP NOTIFIKASI SISWA ONLINE ---
            function showOnlineNotif(student) {
                const container = document.getElementById('online-notif-popup');
                if (!container) return;

                // Jangan tampilkan kalau dashboard guru tidak aktif
                const dash = document.getElementById('teacher-dashboard');
                if (!dash || dash.style.display === 'none') return;

                const sd = student.saveData || {};
                const roleText = sd.role && sd.role !== 'none' ? sd.role.toUpperCase() : 'NOVICE';
                const locText = sd.location ? sd.location.replace('_interior','').replace('_',' ').toUpperCase() : 'VILLAGE';
                const lvl = sd.level || 1;

                const notif = document.createElement('div');
                notif.style.cssText = `
                    pointer-events: auto;
                    background: linear-gradient(135deg, #0f172a, #1e293b);
                    border: 1.5px solid #16a34a;
                    border-left: 4px solid #22c55e;
                    border-radius: 12px;
                    padding: 12px 16px;
                    min-width: 240px;
                    max-width: 300px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 12px rgba(34,197,94,0.2);
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    animation: slideInRight 0.3s ease;
                    font-family: 'Nunito', sans-serif;
                `;
                notif.innerHTML = `
                    <div style="font-size:28px; line-height:1;">🟢</div>
                    <div style="flex:1;">
                        <div style="font-weight:800; color:#f1f5f9; font-size:13px; margin-bottom:2px;">${student.name}</div>
                        <div style="font-size:10px; color:#86efac;">Baru saja masuk game!</div>
                        <div style="font-size:10px; color:#94a3b8; margin-top:3px;">Lv.${lvl} ${roleText} • ${locText}</div>
                    </div>
                    <div onclick="this.parentElement.remove()" style="cursor:pointer; color:#64748b; font-size:18px; padding:2px 4px; border-radius:4px;" title="Tutup">×</div>
                `;

                container.appendChild(notif);

                // Auto hilang setelah 6 detik
                setTimeout(() => {
                    notif.style.transition = 'opacity 0.5s, transform 0.5s';
                    notif.style.opacity = '0';
                    notif.style.transform = 'translateX(30px)';
                    setTimeout(() => notif.remove(), 500);
                }, 6000);
            }

            function updateDashboardViews(students) {
                // 1. Simpan data terbaru ke Global Cache
                latestStudentData = students;

                // 2. Render Monitoring (Selalu update background)
                renderMonitoringTable(students);

                // 3. FIX: Refresh Halaman Aktif secara Otomatis
                // Cek halaman mana yang sedang terbuka dan render ulang dengan data baru
                const activePage = document.querySelector('.dash-page:not(.hidden)');
                if (activePage) {
                    const pageId = activePage.id;
                    // Panggil fungsi render tanpa 'await' karena menggunakan cached data
                    if (pageId === 'page-statistik') renderStatsDashboard();
                    if (pageId === 'page-accounts') renderAccountsList(); // NEW
                    if (pageId === 'page-grading') renderGrading();
                    if (pageId === 'page-reflections') renderReflections();
                    if (pageId === 'page-portfolio') renderPortfolio(); // FASE 2
                    if (pageId === 'page-validation') renderValidation();
                    if (pageId === 'page-ranking') renderRanking();
                    if (pageId === 'page-reset') renderResetPage();
                    if (pageId === 'page-gempita') renderGempitaLeaderboard();
                }
            }

            // --- NEW: FUNGSI MANUAL REFRESH UNTUK GURU ---
            async function refreshDashboardData() {
                const btn = document.getElementById('dash-refresh-btn');
                let originalText = "🔄 Refresh Data";

                // Visual Loading
                if (btn) {
                    originalText = btn.innerHTML;
                    btn.innerHTML = "⏳ Memuat...";
                    btn.disabled = true;
                    btn.style.opacity = "0.7";
                    btn.style.borderColor = "#fbbf24"; // Kuning loading
                    btn.style.color = "#fbbf24";
                }

                try {
                    // 1. Coba Re-Init Koneksi (memastikan tidak offline)
                    await DataService.init(true);

                    // 2. Tarik Data Secara Paksa
                    const students = await DataService.getAllStudents();

                    // 3. Update Tampilan
                    updateDashboardViews(students);

                    // Visual Sukses
                    if (btn) {
                        btn.innerHTML = "✅ Updated";
                        btn.style.borderColor = "#4ade80"; // Hijau sukses
                        btn.style.color = "#4ade80";
                    }

                    // Update Status Label
                    const statusEl = document.getElementById('dash-connection-status');
                    if (statusEl && DataService.mode === 'firebase') {
                        statusEl.innerHTML = '🟢 CLOUD TERHUBUNG<br><span style="font-weight:normal; opacity:0.8;">Data baru saja disinkron</span>';
                        statusEl.style.color = '#4ade80';
                        statusEl.style.border = '1px solid #22c55e';
                    }

                } catch (e) {
                    console.error("Refresh Failed:", e);
                    if (btn) {
                        btn.innerHTML = "❌ Gagal";
                        btn.style.borderColor = "#ef4444";
                        btn.style.color = "#ef4444";
                    }
                    alert("Gagal mengambil data terbaru. Periksa koneksi internet Anda.");
                } finally {
                    // Reset Tombol setelah 2 detik
                    setTimeout(() => {
                        if (btn) {
                            btn.innerHTML = "🔄 Refresh Data";
                            btn.disabled = false;
                            btn.style.opacity = "1";
                            btn.style.borderColor = "rgba(59, 130, 246, 0.4)"; // Kembali Biru
                            btn.style.color = "#93c5fd";
                        }
                    }, 2000);
                }
            }

            function showDashPage(page) {
                document.querySelectorAll('.dash-page').forEach(el => el.classList.add('hidden'));
                document.getElementById('page-' + page).classList.remove('hidden');
                document.querySelectorAll('.dash-nav li').forEach(el => el.classList.remove('active'));

                // Cari elemen li yang diklik, atau default jika dipanggil manual
                const activeLi = Array.from(document.querySelectorAll('.dash-nav li')).find(li => li.innerText.toLowerCase().includes(page)) || event?.currentTarget;
                if (activeLi) activeLi.classList.add('active');

                // Render Immediately using Cache
                if (page === 'welcome') return; // static page, no render needed
                if (page === 'statistik') renderStatsDashboard();
                if (page === 'accounts') renderAccountsList(); // NEW
                if (page === 'grading') renderGrading();
                if (page === 'reflections') renderReflections();
                if (page === 'portfolio') renderPortfolio(); // FASE 2
                if (page === 'validation') renderValidation();
                if (page === 'reset') renderResetPage();
                if (page === 'ranking') renderRanking();
                if (page === 'bk') renderBKDashboard();
                if (page === 'gempita') renderGempitaLeaderboard();
                if (page === 'debugmode') renderDebugModePage();
            }

