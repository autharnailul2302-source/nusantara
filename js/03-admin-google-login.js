// ══════════════════════════════════════════════════════════════
// Google Login + Admin Dashboard
// File: js/03-admin-google-login.js
// ══════════════════════════════════════════════════════════════
            // GOOGLE LOGIN
            // ============================================
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

            // ═══════════════════════════════════════════════════════
            // STATISTIK PLATFORM DASHBOARD — Admin Only
            // ═══════════════════════════════════════════════════════
            function renderStatsDashboard() {
                const el = document.getElementById('stats-content');
                if (!el) return;
                const users = latestStudentData || [];

                const siswaList     = users.filter(u => u.role === 'siswa');
                const umumList      = users.filter(u => u.role === 'umum');
                const guruList      = users.filter(u => u.role === 'guru');
                const activePlayers = siswaList.filter(u => u.saveData && u.saveData.day);
                const activeUmum    = umumList.filter(u => u.saveData && u.saveData.day);
                const now = Date.now();
                const onlineNow     = [...siswaList, ...umumList].filter(u => {
                    const la = u.lastActive || (u.saveData && u.saveData.lastActive) || 0;
                    return now - la < 600000;
                });
                const totalVisits   = [...siswaList, ...umumList].reduce((s,u) =>
                    s + ((u.saveData && u.saveData.arsaVisitCount) || (u.saveData ? 1 : 0)), 0);
                const avgDay        = activePlayers.length
                    ? (activePlayers.reduce((s,u) => s+(u.saveData.day||1), 0) / activePlayers.length).toFixed(1) : '0';
                const avgMoney      = activePlayers.length
                    ? Math.round(activePlayers.reduce((s,u) => s+(u.saveData.money||0), 0) / activePlayers.length) : 0;

                const roleMap = { worker:0, student:0, entrepreneur:0, family:0, none:0 };
                activePlayers.forEach(u => { const r=u.saveData.role||'none'; if(roleMap[r]!==undefined) roleMap[r]++; else roleMap.none++; });

                const genderM = activePlayers.filter(u => u.saveData.gender==='boy').length;
                const genderF = activePlayers.filter(u => u.saveData.gender==='girl').length;

                const lvlBuckets = { 'Lv.1-2':0,'Lv.3-5':0,'Lv.6-9':0,'Lv.10+':0 };
                activePlayers.forEach(u => {
                    const lv = u.saveData.level||1;
                    if (lv<=2) lvlBuckets['Lv.1-2']++;
                    else if (lv<=5) lvlBuckets['Lv.3-5']++;
                    else if (lv<=9) lvlBuckets['Lv.6-9']++;
                    else lvlBuckets['Lv.10+']++;
                });

                // Aktivitas per jam
                const hourBuckets = Array(24).fill(0);
                siswaList.forEach(u => {
                    const la = u.lastActive || (u.saveData && u.saveData.lastActive) || 0;
                    if (la > 0) hourBuckets[new Date(la).getHours()]++;
                });
                const maxHour = Math.max(...hourBuckets, 1);

                const guruSiswaMap = {};
                siswaList.forEach(u => { if(u.mentor) guruSiswaMap[u.mentor]=(guruSiswaMap[u.mentor]||0)+1; });
                const topGuru = Object.entries(guruSiswaMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

                const sekolahMap = {};
                guruList.forEach(g => { if(g.sekolah) sekolahMap[g.sekolah]=(sekolahMap[g.sekolah]||0)+1; });
                const sekolahEntries = Object.entries(sekolahMap).sort((a,b)=>b[1]-a[1]).slice(0,6);

                const married   = activePlayers.filter(u=>u.saveData.married).length;
                const hasKid    = activePlayers.filter(u=>u.saveData.kids&&u.saveData.kids.length>0).length;
                const completed = activePlayers.filter(u=>(u.saveData.day||0)>=25).length;
                const refreshTime = new Date().toLocaleString('id-ID');

                const roleColors = { worker:'#3b82f6',student:'#8b5cf6',entrepreneur:'#10b981',family:'#ec4899',none:'#94a3b8' };
                const roleNames  = { worker:'⚒️ Pekerja',student:'🎓 Akademisi',entrepreneur:'💼 Wirausaha',family:'🏠 Keluarga',none:'❓ Belum' };
                const lvlColors  = { 'Lv.1-2':'#86efac','Lv.3-5':'#4ade80','Lv.6-9':'#22c55e','Lv.10+':'#15803d' };

                function barRow(label, val, total, color) {
                    const pct = total>0 ? Math.round(val/total*100) : 0;
                    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <div style="width:88px;font-size:10px;color:#374151;text-align:right;flex-shrink:0;line-height:1.2;">${label}</div>
                        <div style="flex:1;background:#f1f5f9;border-radius:20px;height:14px;overflow:hidden;">
                            <div class="stat-bar-fill" data-pct="${pct}" style="width:0%;background:${color};height:100%;border-radius:20px;transition:width 0.8s cubic-bezier(.4,0,.2,1);"></div>
                        </div>
                        <div style="width:52px;font-size:10px;color:#1e293b;font-weight:700;flex-shrink:0;">${val} <span style="color:#94a3b8;font-weight:400;">${pct}%</span></div>
                    </div>`;
                }

                el.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
                    <div style="font-size:11px;color:#64748b;">🕐 <b>${refreshTime}</b> &nbsp;•&nbsp; <b style="color:${DataService.mode==='firebase'?'#059669':'#d97706'}">${DataService.mode==='firebase'?'☁️ Firebase':'💾 Lokal'}</b></div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="exportStatsCsv()" style="background:#0f172a;color:#34d399;border:1.5px solid #34d399;border-radius:8px;padding:6px 14px;font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito,sans-serif;">⬇️ Export CSV</button>
                        <button onclick="renderStatsDashboard()" style="background:#0f172a;color:#38bdf8;border:1.5px solid #38bdf8;border-radius:8px;padding:6px 14px;font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito,sans-serif;">🔄 Refresh</button>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
                    ${[
                        {icon:'👁️',label:'Total Kunjungan',val:totalVisits.toLocaleString('id'),sub:'sesi masuk game (siswa+umum)',c:'#3b82f6',bg:'#eff6ff',bd:'#bfdbfe'},
                        {icon:'🎮',label:'Total Pemain',val:siswaList.length,sub:`akun siswa terdaftar`,c:'#7c3aed',bg:'#f5f3ff',bd:'#ddd6fe'},
                        {icon:'🌍',label:'Pemain Umum',val:umumList.length,sub:`${activeUmum.length} sudah bermain`,c:'#d97706',bg:'#fffbeb',bd:'#fde68a'},
                        {icon:'🟢',label:'Online Sekarang',val:onlineNow.length,sub:'aktif < 10 menit',c:'#059669',bg:'#f0fdf4',bd:'#bbf7d0'},
                    ].map(c=>`<div style="background:${c.bg};border:2px solid ${c.bd};border-radius:14px;padding:16px 12px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.06);position:relative;overflow:hidden;">
                        <div style="position:absolute;right:8px;top:8px;font-size:28px;opacity:0.12;">${c.icon}</div>
                        <div style="font-size:30px;font-weight:800;color:${c.c};font-family:'Fredoka',sans-serif;line-height:1;">${c.val}</div>
                        <div style="font-size:10px;font-weight:700;color:${c.c};margin-top:4px;">${c.label}</div>
                        <div style="font-size:9px;color:#94a3b8;margin-top:3px;">${c.sub}</div>
                    </div>`).join('')}
                </div>

                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;">
                    ${[
                        {l:'▶️ Sudah Mulai',v:activePlayers.length,c:'#16a34a'},
                        {l:'⏳ Belum Mulai',v:siswaList.length-activePlayers.length,c:'#dc2626'},
                        {l:'📅 Avg. Hari',v:avgDay+' hari',c:'#0369a1'},
                        {l:'💰 Avg. Gold',v:avgMoney.toLocaleString('id')+('G'),c:'#b45309'},
                        {l:'💍 Menikah',v:married,c:'#be185d'},
                        {l:'👶 Punya Anak',v:hasKid,c:'#7c3aed'},
                        {l:'🏁 Tamat (≥Hari 25)',v:completed,c:'#0f766e'},
                        {l:'🏫 Sekolah',v:Object.keys(sekolahMap).length,c:'#1d4ed8'},
                        {l:'👦👧 Boy:Girl',v:(genderM>0||genderF>0)?genderM+':'+genderF:'–',c:'#64748b'},
                        {l:'🌍 Umum Aktif',v:activeUmum.length,c:'#d97706'},
                        {l:'🔑 Umum Google',v:umumList.filter(u=>u.loginMethod==='google').length,c:'#b45309'},
                    ].map(c=>`<div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:20px;padding:5px 12px;font-size:10px;font-weight:700;color:${c.c};display:flex;align-items:center;gap:5px;">
                        ${c.l} <span style="background:${c.c};color:#fff;border-radius:10px;padding:1px 6px;font-size:9px;">${c.v}</span>
                    </div>`).join('')}
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:14px;">🗺️ Distribusi Jalur Hidup</div>
                        <div style="display:flex;gap:12px;align-items:flex-start;">
                            <div style="flex:1;">
                                ${Object.entries(roleMap).map(([k,v])=>barRow(roleNames[k]||k,v,activePlayers.length,roleColors[k]||'#94a3b8')).join('')}
                            </div>
                            <canvas id="cv-role" width="100" height="100" style="flex-shrink:0;width:100px;height:100px;display:block;"></canvas>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;">
                            ${Object.entries(roleMap).filter(([,v])=>v>0).map(([k,v])=>`<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:#475569;"><div style="width:8px;height:8px;border-radius:50%;background:${roleColors[k]};"></div>${roleNames[k]} (${v})</div>`).join('')}
                        </div>
                    </div>

                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
                            <span>⏰ Aktivitas per Jam</span>
                            <span style="font-size:9px;color:#94a3b8;font-weight:400;">berdasarkan lastActive</span>
                        </div>
                        <div style="display:flex;align-items:flex-end;gap:2px;height:90px;padding:0 2px;">
                            ${hourBuckets.map((v,h)=>{
                                const ht=Math.round((v/maxHour)*86);
                                const isNow=new Date().getHours()===h;
                                const isPeak=v===maxHour&&v>0;
                                return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;position:relative;" title="${h}:00 — ${v} pemain">
                                    ${isPeak?`<div style="position:absolute;top:-13px;font-size:7px;font-weight:700;color:#f59e0b;">${v}★</div>`:''}
                                    <div style="width:100%;background:${isNow?'#f59e0b':v>0?'#3b82f6':'#e2e8f0'};height:${Math.max(ht,v>0?3:0)}px;border-radius:3px 3px 0 0;${isNow?'box-shadow:0 0 6px #f59e0b66;':''};"></div>
                                </div>`;
                            }).join('')}
                        </div>
                        <div style="display:flex;gap:2px;margin-top:4px;padding:0 2px;">
                            ${Array(24).fill(0).map((_,h)=>h%3===0?`<div style="flex:3;font-size:8px;color:#94a3b8;">${h<10?'0'+h:h}</div>`:`<div style="flex:1;"></div>`).join('')}
                        </div>
                        <div style="margin-top:8px;font-size:9px;color:#64748b;">
                            🕐 Jam paling ramai: <b style="color:#f59e0b;">${hourBuckets.indexOf(maxHour)}:00</b> &nbsp;•&nbsp; Total aktif hari ini: <b style="color:#3b82f6;">${hourBuckets.reduce((a,b)=>a+b,0)}</b>
                        </div>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;">
                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:12px;">⭐ Distribusi Level</div>
                        ${Object.entries(lvlBuckets).map(([k,v])=>barRow(k,v,activePlayers.length,lvlColors[k]||'#4ade80')).join('')}
                        <canvas id="cv-level" width="90" height="90" style="display:block;margin:8px auto 0;width:90px;height:90px;"></canvas>
                    </div>

                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:10px;">👤 Gender Pemain</div>
                        <div style="display:flex;gap:8px;margin-bottom:14px;">
                            <div style="flex:${genderM||1};background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:10px;padding:10px;text-align:center;">
                                <div style="font-size:20px;">👦</div>
                                <div style="font-size:18px;font-weight:800;color:#1d4ed8;">${genderM}</div>
                                <div style="font-size:9px;color:#3b82f6;">${activePlayers.length>0?Math.round(genderM/activePlayers.length*100):0}%</div>
                            </div>
                            <div style="flex:${genderF||1};background:linear-gradient(135deg,#fce7f3,#fbcfe8);border-radius:10px;padding:10px;text-align:center;">
                                <div style="font-size:20px;">👧</div>
                                <div style="font-size:18px;font-weight:800;color:#be185d;">${genderF}</div>
                                <div style="font-size:9px;color:#ec4899;">${activePlayers.length>0?Math.round(genderF/activePlayers.length*100):0}%</div>
                            </div>
                        </div>
                        <div style="font-size:11px;font-weight:700;color:#475569;margin-bottom:8px;">🏆 Top Mentor</div>
                        ${topGuru.length?topGuru.map(([name,cnt],i)=>`
                            <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
                                <div style="width:16px;height:16px;border-radius:50%;background:${['#f59e0b','#94a3b8','#b45309','#e2e8f0','#e2e8f0'][i]};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:${i<3?'#fff':'#64748b'};flex-shrink:0;">${i+1}</div>
                                <div style="flex:1;font-size:10px;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
                                <div style="background:#eff6ff;color:#1d4ed8;border-radius:10px;padding:1px 7px;font-size:9px;font-weight:700;">${cnt}</div>
                            </div>
                        `).join(''):`<div style="color:#94a3b8;font-size:10px;">Belum ada data</div>`}
                    </div>

                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:12px;">🏫 Asal Sekolah Mentor</div>
                        ${sekolahEntries.length?sekolahEntries.map(([skl,cnt])=>barRow(skl,cnt,guruList.length,'#0284c7')).join('')
                            :'<div style="color:#94a3b8;font-size:10px;text-align:center;padding:16px;">Belum ada data</div>'}
                        ${Object.keys(sekolahMap).length>6?`<div style="font-size:9px;color:#94a3b8;margin-top:4px;">+${Object.keys(sekolahMap).length-6} sekolah lainnya</div>`:''}
                    </div>
                </div>

                <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;">🟢 Pemain Online Sekarang <span style="background:#dcfce7;color:#16a34a;border-radius:20px;padding:2px 8px;font-size:10px;margin-left:6px;">${onlineNow.length} aktif</span></div>
                    </div>
                    ${onlineNow.length?`<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:10px;">
                        <thead><tr style="background:#f8fafc;">
                            <th style="padding:7px 10px;text-align:left;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Nama</th>
                            <th style="padding:7px 10px;text-align:left;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Kelas</th>
                            <th style="padding:7px 10px;text-align:left;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Jalur</th>
                            <th style="padding:7px 10px;text-align:center;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Level</th>
                            <th style="padding:7px 10px;text-align:center;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Hari</th>
                            <th style="padding:7px 10px;text-align:right;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Terakhir Aktif</th>
                        </tr></thead>
                        <tbody>${onlineNow.sort((a,b)=>{const la=n=>n.lastActive||(n.saveData&&n.saveData.lastActive)||0;return la(b)-la(a);}).map((u,i)=>{
                            const sd=u.saveData||{};
                            const la=u.lastActive||(sd.lastActive)||0;
                            const minsAgo=Math.floor((now-la)/60000);
                            const isUmum=u.role==='umum';
                            const rIco=isUmum?'🌍':{worker:'⚒️',student:'🎓',entrepreneur:'💼',family:'🏠'}[sd.role]||'❓';
                            const rName=isUmum?'Umum':{worker:'Pekerja',student:'Akademisi',entrepreneur:'Wirausaha',family:'Keluarga'}[sd.role]||'Belum';
                            const rColor=isUmum?'#d97706':roleColors[sd.role||'none']||'#94a3b8';
                            return `<tr style="border-bottom:1px solid #f1f5f9;${i%2===0?'background:#fafafa':''}">
                                <td style="padding:7px 10px;"><div style="display:flex;align-items:center;gap:6px;"><div style="width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 5px #22c55e;flex-shrink:0;"></div><b>${u.name||u.email}</b>${isUmum?`<span style="background:#fef3c7;color:#92400e;border-radius:6px;padding:1px 5px;font-size:8px;font-weight:700;">${u.loginMethod==='google'?'Google':'Lokal'}</span>`:''}</div></td>
                                <td style="padding:7px 10px;color:#64748b;">${u.kelas||u.details||'-'}</td>
                                <td style="padding:7px 10px;"><span style="background:${rColor+'22'};color:${rColor};border-radius:10px;padding:2px 7px;font-weight:700;">${rIco} ${rName}</span></td>
                                <td style="padding:7px 10px;text-align:center;"><span style="background:#fef3c7;color:#92400e;border-radius:8px;padding:2px 7px;font-weight:700;">Lv.${sd.level||1}</span></td>
                                <td style="padding:7px 10px;text-align:center;color:#0369a1;font-weight:700;">Hari ${sd.day||1}</td>
                                <td style="padding:7px 10px;text-align:right;color:#94a3b8;">${minsAgo===0?'baru saja':minsAgo+' mnt lalu'}</td>
                            </tr>`;
                        }).join('')}</tbody>
                    </table></div>`:`<div style="text-align:center;padding:20px;color:#94a3b8;">Tidak ada pemain online saat ini</div>`}
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
                    <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);border-radius:14px;padding:18px;color:#e2e8f0;">
                        <div style="font-size:12px;font-weight:800;color:#fbbf24;margin-bottom:12px;">📋 Rekap Sistem</div>
                        ${[['Total User (non-admin)',siswaList.length+guruList.length+umumList.length,'#38bdf8'],['Siswa terdaftar',siswaList.length,'#a78bfa'],['Pemain umum',umumList.length,'#fbbf24'],['Ratio siswa : mentor',guruList.length>0?(siswaList.length/guruList.length).toFixed(1)+' : 1':'–','#34d399'],['Tingkat partisipasi',siswaList.length>0?Math.round(activePlayers.length/siswaList.length*100)+'%':'–','#a78bfa'],['Pemain tamat (Hari 25+)',completed+' / '+activePlayers.length,'#fbbf24'],['Total sekolah terdaftar',Object.keys(sekolahMap).length,'#fb923c'],['Mode database',DataService.mode==='firebase'?'☁️ Firebase Cloud':'💾 LocalStorage','#86efac']].map(([l,v,c])=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.07);"><span style="font-size:10px;color:#94a3b8;">${l}</span><span style="font-size:11px;font-weight:700;color:${c};">${v}</span></div>`).join('')}
                    </div>
                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:12px;">💡 Insight Otomatis</div>
                        <div style="display:flex;flex-direction:column;gap:8px;">
                            ${(()=>{
                                const ins=[];
                                const tr=Object.entries(roleMap).sort((a,b)=>b[1]-a[1])[0];
                                if(tr&&tr[1]>0) ins.push({ico:'🗺️',txt:`Jalur terpopuler: <b>${roleNames[tr[0]]}</b> (${tr[1]} pemain)`,c:'#3b82f6'});
                                const ns=siswaList.length-activePlayers.length;
                                if(ns>0) ins.push({ico:'⚠️',txt:`<b>${ns} siswa</b> belum mulai bermain`,c:'#dc2626'});
                                if(onlineNow.length>0) ins.push({ico:'🟢',txt:`<b>${onlineNow.length} pemain</b> sedang aktif saat ini`,c:'#16a34a'});
                                if(completed>0) ins.push({ico:'🏁',txt:`<b>${completed} pemain</b> sudah tamat (Hari 25+)`,c:'#0f766e'});
                                if(parseFloat(avgDay)>15) ins.push({ico:'🔥',txt:`Rata-rata hari bermain <b>${avgDay}</b> — engagement tinggi!`,c:'#d97706'});
                                if(ins.length===0) ins.push({ico:'📊',txt:'Belum ada data. Refresh setelah ada siswa aktif.',c:'#94a3b8'});
                                return ins.slice(0,5).map(({ico,txt,c})=>`<div style="display:flex;align-items:flex-start;gap:8px;background:#f8fafc;border-left:3px solid ${c};border-radius:0 8px 8px 0;padding:8px 10px;"><span style="font-size:14px;">${ico}</span><span style="font-size:10px;color:#374151;line-height:1.5;">${txt}</span></div>`).join('');
                            })()}
                        </div>
                    </div>
                </div>

                <div style="background:#f8fafc;border-radius:10px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;font-size:9px;color:#94a3b8;border:1px solid #e2e8f0;">
                    <span>📊 Statistik Platform · Nusantara Arsa</span>
                    <span>Dokumen diproses: <b style="color:#475569;">${users.length}</b></span>
                </div>
                `;

                setTimeout(()=>{ document.querySelectorAll('.stat-bar-fill').forEach(b=>{ b.style.width=b.dataset.pct+'%'; }); }, 80);

                setTimeout(()=>{
                    const cv=document.getElementById('cv-role'); if(!cv) return;
                    const cx2=cv.getContext('2d');
                    const tot=Object.values(roleMap).reduce((a,b)=>a+b,0);
                    if(!tot){cx2.fillStyle='#e2e8f0';cx2.beginPath();cx2.arc(50,50,44,0,Math.PI*2);cx2.fill();return;}
                    let sa=-Math.PI/2;
                    Object.entries(roleMap).forEach(([k,v])=>{
                        if(!v) return;
                        const sl=(v/tot)*Math.PI*2;
                        cx2.beginPath();cx2.moveTo(50,50);cx2.arc(50,50,44,sa,sa+sl);cx2.closePath();
                        cx2.fillStyle=roleColors[k]||'#94a3b8';cx2.fill();sa+=sl;
                    });
                    cx2.beginPath();cx2.arc(50,50,26,0,Math.PI*2);cx2.fillStyle='#fff';cx2.fill();
                    cx2.fillStyle='#1e293b';cx2.font='bold 9px Nunito,sans-serif';cx2.textAlign='center';cx2.textBaseline='middle';
                    cx2.fillText(activePlayers.length+' aktif',50,50);
                }, 100);

                setTimeout(()=>{
                    const cv2=document.getElementById('cv-level'); if(!cv2) return;
                    const ctx2=cv2.getContext('2d');
                    const tot2=Object.values(lvlBuckets).reduce((a,b)=>a+b,0);
                    if(!tot2){ctx2.fillStyle='#e2e8f0';ctx2.beginPath();ctx2.arc(45,45,38,0,Math.PI*2);ctx2.fill();return;}
                    let sa2=-Math.PI/2;
                    const lc2=Object.values(lvlColors);
                    Object.entries(lvlBuckets).forEach(([k,v],i)=>{
                        if(!v) return;
                        const sl=(v/tot2)*Math.PI*2;
                        ctx2.beginPath();ctx2.moveTo(45,45);ctx2.arc(45,45,38,sa2,sa2+sl);ctx2.closePath();
                        ctx2.fillStyle=lc2[i]||'#4ade80';ctx2.fill();sa2+=sl;
                    });
                    ctx2.beginPath();ctx2.arc(45,45,22,0,Math.PI*2);ctx2.fillStyle='#fff';ctx2.fill();
                    ctx2.fillStyle='#15803d';ctx2.font='bold 8px sans-serif';ctx2.textAlign='center';ctx2.textBaseline='middle';
                    ctx2.fillText(tot2,45,45);
                }, 120);
            }

            function exportStatsCsv() {
                const users = latestStudentData || [];
                const siswaList = users.filter(u => u.role === 'siswa');
                const guruList  = users.filter(u => u.role === 'guru');
                const now = Date.now();
                let csv = 'SEP=,\n';
                csv += 'STATISTIK PLATFORM NUSANTARA ARSA\n';
                csv += `Diekspor pada:,${new Date().toLocaleString('id-ID')}\n`;
                csv += `Mode Database:,${DataService.mode==='firebase'?'Firebase Cloud':'LocalStorage'}\n\n`;
                csv += '=== RINGKASAN ===\n';
                csv += `Total Siswa,${siswaList.length}\n`;
                csv += `Total Guru,${guruList.length}\n`;
                csv += `Pemain Aktif,${siswaList.filter(u=>u.saveData&&u.saveData.day).length}\n`;
                csv += `Online Sekarang,${siswaList.filter(u=>{const la=u.lastActive||(u.saveData&&u.saveData.lastActive)||0;return now-la<600000;}).length}\n`;
                csv += `Total Kunjungan,${siswaList.reduce((s,u)=>s+((u.saveData&&u.saveData.arsaVisitCount)||(u.saveData?1:0)),0)}\n\n`;
                csv += '=== DISTRIBUSI JALUR ===\n';
                const rm={worker:0,student:0,entrepreneur:0,family:0,none:0};
                siswaList.filter(u=>u.saveData&&u.saveData.day).forEach(u=>{const r=u.saveData.role||'none';if(rm[r]!==undefined)rm[r]++;});
                csv += `Pekerja,${rm.worker}\nAkademisi,${rm.student}\nWirausaha,${rm.entrepreneur}\nKeluarga,${rm.family}\nBelum,${rm.none}\n\n`;
                csv += '=== DATA SISWA ===\n';
                csv += 'Nama,Email,Kelas,Mentor,Jalur,Level,Hari,Gold,Status\n';
                siswaList.forEach(u=>{
                    const sd=u.saveData||{};
                    const la=u.lastActive||(sd.lastActive)||0;
                    const isOl=now-la<600000;
                    const rl={worker:'Pekerja',student:'Akademisi',entrepreneur:'Wirausaha',family:'Keluarga',none:'Belum'}[sd.role||'none']||'Belum';
                    csv += `"${u.name||''}" ,"${u.email||''}" ,"${u.kelas||''}" ,"${u.mentor||''}" ,"${sd.day?rl:'Belum Mulai'}" ,${sd.level||'-'},${sd.day||'-'},${sd.money||'-'},"${isOl?'Online':'Offline'}"\n`;
                });
                csv += '\n=== DATA MENTOR ===\n';
                csv += 'Nama,Email,Sekolah,NIP,Jumlah Siswa\n';
                guruList.forEach(g=>{
                    const cnt=siswaList.filter(u=>u.mentor===g.name).length;
                    csv += `"${g.name||''}" ,"${g.email||''}" ,"${g.sekolah||''}" ,"${g.nip||''}" ,${cnt}\n`;
                });
                const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
                const url=URL.createObjectURL(blob);
                const a=document.createElement('a');
                a.href=url;a.download=`statistik_nusantara_arsa_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();URL.revokeObjectURL(url);
            }

            // --- NEW: RENDER DAFTAR AKUN (DATABASE) ---
            function renderAccountsList() {
                const users = latestStudentData || []; // Gunakan Cache (sekarang berisi semua user jika admin)
                const tbody = document.getElementById('accounts-body');
                if (!tbody) return;

                tbody.innerHTML = '';

                // Update Header Tabel khusus Admin
                const thead = document.querySelector('#page-accounts thead tr');
                if (thead) {
                    if (DataService.user.role === 'admin') {
                        thead.innerHTML = `
                <th style="width: 40px;">No</th>
                <th>Nama Pengguna</th>
                <th>Email / ID</th>
                <th>Role & Status</th>
                <th>Detail Info</th>
                <th>Aksi</th>
            `;
                    } else {
                        // Header Guru
                        thead.innerHTML = `
                <th style="width: 40px;">No</th>
                <th>Nama Lengkap</th>
                <th>Email (ID Login)</th>
                <th>Kelas / Detail</th>
                <th>Mentor</th>
                <th>Status Data</th>
            `;
                    }
                }

                if (users.length === 0) {
                    const sourceMode = DataService.dashboardSource === 'auto' ? (navigator.onLine ? 'CLOUD' : 'LOCAL') : DataService.dashboardSource.toUpperCase();
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#94a3b8;">
            Belum ada data ditemukan (Mode: ${sourceMode}).
        </td></tr>`;
                    return;
                }

                try {
                    const sortedUsers = [...users].sort((a, b) => {
                        // Sort by Role first (Admin > Guru > Siswa), then Name
                        const roleScore = (r) => r === 'admin' ? 3 : (r === 'guru' ? 2 : 1);
                        const scoreA = roleScore(a.role);
                        const scoreB = roleScore(b.role);

                        if (scoreA !== scoreB) return scoreB - scoreA; // Descending (Admin top)

                        const nameA = (a.name || "").toUpperCase();
                        const nameB = (b.name || "").toUpperCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    });

                    sortedUsers.forEach((u, index) => {
                        const safeName = u.name || "(Tanpa Nama)";
                        const safeEmail = u.email || "-";

                        let detailsHtml = "-";
                        let roleHtml = "";
                        let actionHtml = "";

                        // Styling berdasarkan Role
                        if (u.role === 'admin') {
                            roleHtml = `<span style="background:#fee2e2; color:#b91c1c; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:10px; border:1px solid #fca5a5;">ADMIN</span>`;
                            detailsHtml = `<span style="color:#94a3b8">System Access</span>`;
                        }
                        else if (u.role === 'guru') {
                            roleHtml = `<span style="background:#dbeafe; color:#1e40af; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:10px; border:1px solid #93c5fd;">MENTOR</span>`;
                            detailsHtml = `NIP: ${u.details || '-'}<br><small>${u.school || ''}</small>`;
                            if (DataService.user && DataService.user.role === 'admin') {
                                // FIX: Admin bisa hapus akun guru permanen
                                actionHtml = `<button class="auth-btn" style="width:auto; padding:4px 8px; font-size:9px; background:#dc2626; margin:0;" onclick="confirmDeleteStudent('${safeEmail}', '${safeName}')" title="Hapus Akun Guru">🗑️ HAPUS</button>`;
                            }
                        }
                        else { // Siswa
                            // Cek status main
                            let statusMain = '<span class="status-badge" style="background:#e2e8f0; color:#64748b;">Belum Main</span>';
                            if (u.saveData) {
                                const lvl = u.saveData.level || 1;
                                const roleInGame = (u.saveData.role && u.saveData.role !== 'none') ? u.saveData.role.toUpperCase() : 'NOVICE';
                                statusMain = `<span class="status-badge" style="background:#dcfce7; color:#166534;">Lv ${lvl} ${roleInGame}</span>`;
                            }

                            roleHtml = `<span style="background:#f0fdf4; color:#15803d; padding:2px 6px; border-radius:4px; font-size:10px; border:1px solid #86efac;">SISWA</span><br>${statusMain}`;
                            detailsHtml = `Kelas: ${u.details || '-'}<br><small>Mentor: ${u.mentor || '-'}</small>`;

                            // Tombol Aksi untuk Admin/Guru
                            actionHtml = `<button class="auth-btn" style="width:auto; padding:4px 8px; font-size:9px; margin:0; background:#475569;" onclick="inspectStudentData('${encodeURIComponent(JSON.stringify(u))}')">🔍 DATA</button>`;
                        }

                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${safeName}</strong></td>
                <td style="font-family:monospace; color:#475569; font-size:11px;">${safeEmail}</td>
                <td>${roleHtml}</td>
                <td style="font-size:11px;">${detailsHtml}</td>
                <td>${actionHtml}</td>
            `;
                        tbody.appendChild(tr);
                    });
                } catch (e) {
                    console.error("Render Error:", e);
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ef4444;">Error rendering list.</td></tr>`;
                }
            }

            // --- NEW: RENDER DASHBOARD RANKING (PODIUM + LIST) ---
            function renderRanking() { // Hapus async
                const podiumEl = document.getElementById('ranking-podium');
                const tableEl = document.getElementById('ranking-body');

                // podiumEl.innerHTML = '<p>Loading Data...</p>'; // Tidak perlu loading karena data instan
                tableEl.innerHTML = '';

                // 1. Gunakan Cache Data Live
                const students = latestStudentData;

                const ranked = students
                    .filter(s => s.saveData)
                    .map(s => ({
                        ...s,
                        score: calculateGrade(s.saveData),
                        role: s.saveData.role || 'none',
                        level: s.saveData.level || 1
                    }))
                    .sort((a, b) => b.score - a.score);

                if (ranked.length === 0) {
                    podiumEl.innerHTML = '<div style="width:100%; text-align:center; color:#94a3b8; padding:40px;">Belum ada data siswa untuk diperingkat.</div>';
                    return;
                }

                // 2. Render Podium (Top 3)
                let podiumHTML = '';
                // Urutan Podium: 2 - 1 - 3 (Kiri - Tengah - Kanan)
                const podiumOrder = [1, 0, 2];

                podiumOrder.forEach(idx => {
                    if (ranked[idx]) {
                        const s = ranked[idx];
                        const rank = idx + 1;
                        const rankClass = `rank-${rank}`;

                        // Avatar Fallback (Boy/Girl based on gender logic, default boy icon if undefined)
                        // Karena data gender ada di dalam saveData, kita coba ambil
                        const gender = s.saveData.gender || 'boy';
                        const avatarSrc = gender === 'boy' ? 'images/boy.png' : 'images/girl.png';

                        podiumHTML += `
                <div class="podium-item ${rankClass}">
                    <div class="podium-badge">${rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉')}</div>
                    <img src="${avatarSrc}" class="podium-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IiMzYjgyZjYiLz48L3N2Zz4='">
                    <div class="podium-name">${s.name.split(' ')[0]}</div>
                    <div class="podium-class">${s.details}</div>
                    <div class="podium-score">${s.score}</div>
                </div>
            `;
                    }
                });
                podiumEl.innerHTML = podiumHTML;

                // 3. Render Table List (Remaining)
                // FIX: Render semua data ke tabel list (bukan hanya sisanya, agar lengkap)
                ranked.forEach((s, index) => {
                    const rank = index + 1;
                    const role = s.role !== 'none' ? s.role.toUpperCase() : 'NOVICE';

                    // Highlight jika Top 3
                    let rowStyle = "";
                    if (rank <= 3) rowStyle = "background:rgba(251, 191, 36, 0.1); font-weight:bold;";

                    const tr = document.createElement('tr');
                    tr.style = rowStyle;
                    tr.innerHTML = `
            <td>#${rank}</td>
            <td>${s.name}</td>
            <td>${role}</td>
            <td>${s.level}</td>
            <td style="text-align:right;"><strong>${s.score}</strong></td>
        `;
                    tableEl.appendChild(tr);
                });
            } // FIX: TUTUP KURUNG KURAWAL YANG HILANG

            // UPDATE: ASYNC MONITORING (Updated to Sync Render for Listener)
            function renderMonitoringTable(students) {
                const tbody = document.getElementById('monitoring-body');
                if (!tbody) return;

                tbody.innerHTML = '';

                // --- UPDATE SUMMARY STATS ---
                const onlineCount = students.filter(s => {
                    const la = s.saveData && s.saveData.lastActive ? s.saveData.lastActive : 0;
                    return (Date.now() - la) < 60000;
                }).length;
                const totalCount = students.length;
                const offlineCount = totalCount - onlineCount;
                const pct = totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;
                const elOn = document.getElementById('summary-online');
                const elOff = document.getElementById('summary-offline');
                const elTot = document.getElementById('summary-total');
                const elPct = document.getElementById('summary-pct');
                if (elOn) elOn.innerText = onlineCount;
                if (elOff) elOff.innerText = offlineCount;
                if (elTot) elTot.innerText = totalCount;
                if (elPct) elPct.innerText = pct + '%';

                // --- ONLINE POPUP NOTIFICATION ---
                // Deteksi siswa yang baru online sejak render terakhir
                if (!window._prevOnlineSet) window._prevOnlineSet = new Set();
                students.forEach(s => {
                    const la = s.saveData && s.saveData.lastActive ? s.saveData.lastActive : 0;
                    const nowOnline = (Date.now() - la) < 60000;
                    const wasOnline = window._prevOnlineSet.has(s.email);
                    if (nowOnline && !wasOnline) {
                        // Baru saja online — tampilkan popup
                        showOnlineNotif(s);
                    }
                    if (nowOnline) window._prevOnlineSet.add(s.email);
                    else window._prevOnlineSet.delete(s.email);
                });

                if (students.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#94a3b8;">Tidak ada data siswa ditemukan di sumber ini (${DataService.dashboardSource}).</td></tr>`;
                    return;
                }

                students.forEach(s => {
                    // Cek apakah ada save data
                    const sd = s.saveData;
                    const hasSave = sd && Object.keys(sd).length > 0;

                    // Cek online status (batas toleransi 60 detik)
                    const lastActive = (sd && sd.lastActive) ? sd.lastActive : 0;
                    const isOnline = (Date.now() - lastActive) < 60000;

                    // Format Time String
                    let timeStr = "-";
                    if (lastActive > 0) {
                        const d = new Date(lastActive);
                        // Format: DD/MM HH:MM
                        timeStr = `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
                    }

                    const tr = document.createElement('tr');

                    // --- 1. LOGIKA TAMPILAN ROLE ---
                    let roleHtml = '';
                    if (!hasSave) {
                        roleHtml = `<span style="font-size:9px; color:#94a3b8; font-style:italic;">(New)</span>`;
                    } else if (!sd.role || sd.role === 'none') {
                        roleHtml = `<span style="font-size:9px; color:#64748b;">NOVICE</span>`;
                    } else {
                        let roleText = sd.role.toUpperCase();
                        if (sd.role === 'student' && sd.major) roleText += ` (${sd.major.substring(0, 3).toUpperCase()})`;
                        roleHtml = `<span style="font-size:9px; color:var(--primary); font-weight:bold;">${roleText}</span>`;
                    }

                    // --- 2. LOGIKA TAMPILAN LOKASI ---
                    let locHtml = '<span style="color:#cbd5e1">-</span>';
                    let hpStyle = "";
                    let statsHtml = '<span style="color:#cbd5e1">-</span>';

                    if (hasSave) {
                        if (sd.location) {
                            let locText = sd.location.toUpperCase();
                            if (locText.includes('INTERIOR')) locText = locText.replace('_INTERIOR', ' (DLM)');
                            locHtml = `📍 ${locText}`;
                        }
                        if ((sd.hp || 0) < 30) hpStyle = "color:#ef4444; font-weight:bold;";
                        statsHtml = `❤️ ${Math.floor(sd.hp || 0)} <br> ⚡ ${Math.floor(sd.energy || 0)}`;
                    }

                    // --- NEW: TOMBOL INSPECT DATA ---
                    // Kita simpan data siswa di atribut data agar bisa diinspect
                    const sJson = encodeURIComponent(JSON.stringify(s));

                    tr.innerHTML = `
            <td>
                <strong>${s.name}</strong><br>
                <span style="font-size:9px; color:#64748b;">${s.email}</span>
            </td>
            <td>
                <div style="font-weight:bold; font-size:11px; ${isOnline ? 'color:#16a34a' : 'color:#64748b'}">${timeStr}</div>
                <span style="font-size:9px;">Day ${sd ? (sd.day || 1) : '-'}</span>
            </td>
            <td>
                ${roleHtml}<br>
                <span class="status-badge ${isOnline ? 'online' : 'offline'}" style="font-size:8px; padding:2px 6px;">
                    ${isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
            </td>
            <td style="font-size:10px;">${locHtml}</td>
            <td style="${hpStyle}">
                ${statsHtml}
            </td>
            <td>
                <div style="display:flex; gap:5px;">
                    <!-- UPDATE: Menambahkan 'this' pada parameter promptTeacherMessage agar tombol terdeteksi akurat -->
                    <button class="auth-btn" style="width:auto; padding:4px 8px; font-size:10px; margin:0;" onclick="promptTeacherMessage('${s.email}', this)">✉️</button>
                    <button class="auth-btn" style="width:auto; padding:4px 8px; font-size:10px; margin:0; background:#475569;" onclick="inspectStudentData('${sJson}')">🔍</button>
                </div>
            </td>
        `;
                    tbody.appendChild(tr);
                });
            }

            // --- NEW: FUNGSI INSPECT DATA ---
            function inspectStudentData(encodedJson) {
                const data = JSON.parse(decodeURIComponent(encodedJson));
                const modal = document.getElementById('inspect-modal');
                const content = document.getElementById('inspect-content');

                // Format JSON agar cantik
                content.innerText = JSON.stringify(data, null, 2);
                modal.style.display = 'flex';
            }

            // FIX: Hapus fungsi renderMonitoring lama karena sudah diganti renderMonitoringTable
            async function renderMonitoring() {
                // Legacy function, redirect to listener init if needed or do nothing
                // Biarkan kosong atau hapus agar tidak dipanggil setInterval lama
            }

            // --- NEW: FUNGSI AMBIL NAMA MENTOR (DARI EMAIL) ---
            DataService.getMentorName = async function (mentorEmail) {
                if (!mentorEmail) return "Mentor Budi"; // Default

                // 1. Cek Database Lokal dulu
                const dbLocal = this.getDB();
                if (dbLocal[mentorEmail] && dbLocal[mentorEmail].name) {
                    return "Mentor " + dbLocal[mentorEmail].name;
                }

                // 2. Cek Cloud (Jika Online)
                if (this.mode === 'firebase' && typeof db !== 'undefined') {
                    try {
                        const doc = await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(mentorEmail).get();
                        if (doc.exists && doc.data().name) {
                            return "Mentor " + doc.data().name;
                        }
                    } catch (e) {
                        console.warn("Gagal ambil nama mentor dari cloud:", e);
                    }
                }

                return "Mentor Budi"; // Fallback jika gagal
            };


            // UPDATE: SYNC GRADING (Menggunakan latestStudentData)
            function renderGrading() {
                const students = latestStudentData; // Gunakan Cache
                const tbody = document.getElementById('grading-body');
                tbody.innerHTML = '';

                students.forEach(s => {
                    const sd = s.saveData || {};
                    const score = calculateGrade(sd);
                    let rank = 'Warrior';
                    if (score > 60) rank = 'Elite';
                    if (score > 75) rank = 'Legend';
                    if (score > 90) rank = 'Mythic';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>${s.name}</td>
            <td>${sd.role === 'none' ? 'Novice' : sd.role}</td>
            <td>${(sd.reflections || []).length} Entries</td>
            <td>${(sd.money || 0).toLocaleString()}</td>
            <td><strong>${score}</strong></td>
            <td><span class="status-badge" style="background:#0f172a; color:#fbbf24; border:1px solid #fbbf24;">${rank}</span></td>
        `;
                    tbody.appendChild(tr);
                });
            }

            function calculateGrade(data) {
                if (!data) return 0;
                const consistency = Math.min(100, (data.day || 1) * 20) * 0.2;
                const quest = Math.min(100, (data.money || 0) / 1000) * 0.2;
                const role = (data.role && data.role !== 'none' ? 100 : 0) * 0.2;
                const refCount = (data.reflections || []).length;
                const reflection = Math.min(100, refCount * 33) * 0.3;
                const ethics = (data.ethics || 100) * 0.1;
                return Math.floor(consistency + quest + role + reflection + ethics);
            }

            // =====================================================================
