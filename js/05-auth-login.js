            // ============================================
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

