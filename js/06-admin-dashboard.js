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
            // FASE 1 — JURNAL SISWA LENGKAP + FILTER KELAS + RUBRIK PENILAIAN
            // =====================================================================

            // Simpan nilai guru sementara (key: "email_dayIndex")
            const _journalRatings = {}; // cache lokal sebelum disimpan ke Firebase

            function resetJurnalFilter() {
                ['filter-kelas','filter-mentor','filter-siswa'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                ['filter-role','filter-rated'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                renderReflections();
            }

            // Simpan rating guru ke Firebase (path: users/{email}/journalRatings/{dayKey})
            async function saveJournalRating(studentEmail, dayKey, ratings, catatan) {
                const ratingData = { ...ratings, catatan, updatedAt: new Date().toISOString() };
                // Simpan ke cache lokal
                _journalRatings[`${studentEmail}_${dayKey}`] = ratingData;
                // Simpan ke Firebase jika online
                if (typeof db !== 'undefined' && DataService.mode === 'firebase') {
                    try {
                        await db.collection('artifacts').doc('nusantara-arsa')
                            .collection('users').doc(studentEmail)
                            .set({ journalRatings: { [dayKey]: ratingData } }, { merge: true });
                    } catch(e) {
                        console.warn('Gagal simpan rating ke Firebase:', e);
                    }
                }
                // Update cache latestStudentData
                const s = (latestStudentData||[]).find(x => x.email === studentEmail);
                if (s) {
                    if (!s.journalRatings) s.journalRatings = {};
                    s.journalRatings[dayKey] = ratingData;
                }
                // Re-render
                renderReflections();
            }

            // Render bintang interaktif
            function renderStarInput(studentEmail, dayKey, aspect, currentVal, labelColor) {
                let html = `<div style="display:inline-flex; gap:2px; align-items:center;">`;
                for (let i = 1; i <= 5; i++) {
                    const filled = i <= currentVal;
                    html += `<span
                        onclick="setStarRating('${studentEmail}','${dayKey}','${aspect}',${i})"
                        style="font-size:16px; cursor:pointer; color:${filled ? '#f59e0b' : '#d1d5db'}; transition:color 0.1s;"
                        onmouseover="hoverStars('${studentEmail}','${dayKey}','${aspect}',${i})"
                        onmouseout="unhoverStars('${studentEmail}','${dayKey}','${aspect}')"
                        data-star="${studentEmail}|${dayKey}|${aspect}|${i}">★</span>`;
                }
                html += `</div>`;
                return html;
            }

            function hoverStars(email, dayKey, aspect, upTo) {
                for (let i = 1; i <= 5; i++) {
                    const el = document.querySelector(`[data-star="${email}|${dayKey}|${aspect}|${i}"]`);
                    if (el) el.style.color = i <= upTo ? '#fbbf24' : '#d1d5db';
                }
            }
            function unhoverStars(email, dayKey, aspect) {
                const key = `${email}_${dayKey}`;
                const saved = _journalRatings[key] || {};
                const val = saved[aspect] || 0;
                for (let i = 1; i <= 5; i++) {
                    const el = document.querySelector(`[data-star="${email}|${dayKey}|${aspect}|${i}"]`);
                    if (el) el.style.color = i <= val ? '#f59e0b' : '#d1d5db';
                }
            }
            function setStarRating(email, dayKey, aspect, val) {
                const key = `${email}_${dayKey}`;
                if (!_journalRatings[key]) _journalRatings[key] = {};
                _journalRatings[key][aspect] = val;
                // Update tampilan bintang langsung tanpa re-render full
                for (let i = 1; i <= 5; i++) {
                    const el = document.querySelector(`[data-star="${email}|${dayKey}|${aspect}|${i}"]`);
                    if (el) el.style.color = i <= val ? '#f59e0b' : '#d1d5db';
                }
                // Update total badge
                const totalEl = document.getElementById(`rating-total-${email}-${dayKey}`);
                if (totalEl) {
                    const r = _journalRatings[key];
                    const aspects = ['konsistensi','refleksi','kreativitas','relevansi','kedalaman'];
                    const filled = aspects.filter(a => (r[a]||0) > 0).length;
                    const avg = filled > 0 ? (aspects.reduce((s,a) => s+(r[a]||0),0)/filled).toFixed(1) : '-';
                    totalEl.textContent = `Rata-rata: ${avg}/5`;
                }
            }

            function submitJournalRating(btn) {
                const email    = btn.dataset.email;
                const dayKey   = btn.dataset.daykey;
                const cacheKey = btn.dataset.cachekey;
                const r = _journalRatings[cacheKey] || {};
                const catatan = document.getElementById(`catatan-${email}-${dayKey}`)?.value || '';
                const aspects = ['konsistensi','refleksi','kreativitas','relevansi','kedalaman'];
                const allFilled = aspects.every(k => (r[k]||0) > 0);
                if (!allFilled) {
                    alert('Harap isi semua 5 aspek penilaian terlebih dahulu (klik bintang ⭐).');
                    return;
                }
                btn.textContent = '⏳ Menyimpan...';
                btn.disabled = true;
                saveJournalRating(email, dayKey, r, catatan).then(() => {
                    btn.textContent = '✅ Tersimpan!';
                    btn.style.background = '#10b981';
                    setTimeout(() => {
                        btn.textContent = '💾 Simpan Penilaian Jurnal Ini';
                        btn.style.background = '#1e3a5f';
                        btn.disabled = false;
                    }, 2000);
                }).catch(() => {
                    btn.textContent = '❌ Gagal Simpan';
                    btn.style.background = '#ef4444';
                    btn.disabled = false;
                });
            }

            // UPDATE: SYNC REFLECTIONS (FASE 1 LENGKAP)
            function renderReflections() {
                const allStudents = latestStudentData || [];
                const container = document.getElementById('reflections-container');
                if (!container) return;
                container.innerHTML = '';

                // Ambil nilai filter
                const fKelas   = (document.getElementById('filter-kelas')?.value || '').toLowerCase().trim();
                const fRole    = document.getElementById('filter-role')?.value || '';
                const fMentor  = (document.getElementById('filter-mentor')?.value || '').toLowerCase().trim();
                const fSiswa   = (document.getElementById('filter-siswa')?.value || '').toLowerCase().trim();
                const fRated   = document.getElementById('filter-rated')?.value || '';

                const roleLabels = { worker:'⚔️ Pekerja', student:'🎓 Akademisi', entrepreneur:'💼 Wirausaha', family:'🏠 Keluarga', none:'❓ Belum Pilih' };
                const roleColor  = { worker:'#3b82f6', student:'#8b5cf6', entrepreneur:'#10b981', family:'#ec4899', none:'#94a3b8' };
                const aspectLabels = [
                    { key:'konsistensi', label:'Konsistensi',  desc:'Menulis jurnal setiap hari' },
                    { key:'refleksi',    label:'Refleksi',     desc:'Kedalaman introspeksi diri' },
                    { key:'kreativitas', label:'Kreativitas',  desc:'Orisinalitas ekspresi' },
                    { key:'relevansi',   label:'Relevansi',    desc:'Kesesuaian dengan pertanyaan' },
                    { key:'kedalaman',   label:'Kedalaman',    desc:'Panjang & substansi jawaban' }
                ];

                let totalSiswa = 0, totalJurnal = 0, sudahDinilai = 0, belumDinilai = 0;

                // Filter siswa
                const filtered = allStudents.filter(s => {
                    const sd = s.saveData || {};
                    const refs = Array.isArray(sd.reflections) ? sd.reflections : (Array.isArray(s.reflections) ? s.reflections : []);
                    if (refs.length === 0) return false;

                    const sName    = (s.name || '').toLowerCase();
                    const sDetails = (s.details || sd.details || '').toLowerCase();
                    const sMentor  = (s.mentor || sd.mentor || '').toLowerCase();
                    const sRole    = sd.role || 'none';

                    if (fKelas  && !sDetails.includes(fKelas))  return false;
                    if (fMentor && !sMentor.includes(fMentor))  return false;
                    if (fSiswa  && !sName.includes(fSiswa))     return false;
                    if (fRole   && sRole !== fRole)              return false;

                    if (fRated) {
                        const hasAnyRating = refs.some((r,i) => {
                            const k = `${s.email}_day${r.day||i}`;
                            const saved = _journalRatings[k] || (s.journalRatings && s.journalRatings[`day${r.day||i}`]);
                            return saved && Object.values(saved).some(v => typeof v==='number' && v > 0);
                        });
                        if (fRated === 'rated'   && !hasAnyRating) return false;
                        if (fRated === 'unrated' && hasAnyRating)  return false;
                    }
                    return true;
                });

                // Hitung ringkasan
                filtered.forEach(s => {
                    const sd = s.saveData || {};
                    const refs = Array.isArray(sd.reflections) ? sd.reflections : (Array.isArray(s.reflections) ? s.reflections : []);
                    totalSiswa++;
                    totalJurnal += refs.length;
                    const hasRating = refs.some((r,i) => {
                        const k = `${s.email}_day${r.day||i}`;
                        const saved = _journalRatings[k] || (s.journalRatings && s.journalRatings[`day${r.day||i}`]);
                        return saved && Object.values(saved).some(v => typeof v==='number' && v > 0);
                    });
                    if (hasRating) sudahDinilai++; else belumDinilai++;
                });

                // Render ringkasan
                const summaryEl = document.getElementById('journal-summary');
                const badgeEl   = document.getElementById('journal-count-badge');
                if (badgeEl) badgeEl.textContent = `${totalSiswa} siswa · ${totalJurnal} jurnal`;
                if (summaryEl) {
                    const cards = [
                        { icon:'👥', val: totalSiswa,   label:'Siswa Punya Jurnal', color:'#3b82f6', bg:'#eff6ff' },
                        { icon:'📝', val: totalJurnal,  label:'Total Entri Jurnal',  color:'#8b5cf6', bg:'#f5f3ff' },
                        { icon:'✅', val: sudahDinilai, label:'Sudah Dinilai',       color:'#10b981', bg:'#ecfdf5' },
                        { icon:'⏳', val: belumDinilai, label:'Belum Dinilai',       color:'#f59e0b', bg:'#fffbeb' },
                    ];
                    summaryEl.innerHTML = cards.map(c => `
                        <div style="background:${c.bg}; border-radius:10px; padding:14px 16px; border:1px solid ${c.color}33; text-align:center;">
                            <div style="font-size:22px;">${c.icon}</div>
                            <div style="font-size:22px; font-weight:800; color:${c.color}; line-height:1.2;">${c.val}</div>
                            <div style="font-size:10.5px; color:#64748b; margin-top:2px;">${c.label}</div>
                        </div>`).join('');
                }

                if (filtered.length === 0) {
                    container.innerHTML = `<div style="text-align:center; padding:50px; color:#cbd5e1;">
                        <div style="font-size:48px; margin-bottom:10px;">📭</div>
                        <p>Tidak ada jurnal yang cocok dengan filter.</p>
                        <p style="font-size:12px;">Total Siswa Terhubung: <strong>${allStudents.length}</strong></p>
                        <small>Coba ubah atau reset filter di atas.</small>
                    </div>`;
                    return;
                }

                // Render kartu per siswa
                filtered.forEach(s => {
                    const sd       = s.saveData || {};
                    const refs     = Array.isArray(sd.reflections) ? sd.reflections : (Array.isArray(s.reflections) ? s.reflections : []);
                    const sName    = s.name || sd.name || 'Tanpa Nama';
                    const sDetails = s.details || sd.details || '-';
                    const sMentor  = s.mentor || sd.mentor || '-';
                    const sRole    = sd.role || 'none';
                    const sEmail   = s.email || '';
                    const rColor   = roleColor[sRole] || '#94a3b8';
                    const rLabel   = roleLabels[sRole] || sRole;

                    // Hitung rata-rata nilai semua jurnal siswa ini
                    let allAvg = [];
                    refs.forEach((r, i) => {
                        const dayKey = `day${r.day||i}`;
                        const saved  = _journalRatings[`${sEmail}_${dayKey}`] || (s.journalRatings && s.journalRatings[dayKey]) || {};
                        aspectLabels.forEach(a => { if (saved[a.key] > 0) allAvg.push(saved[a.key]); });
                    });
                    const overallAvg = allAvg.length > 0 ? (allAvg.reduce((a,b)=>a+b,0)/allAvg.length).toFixed(1) : null;

                    const card = document.createElement('div');
                    card.className = 'dash-card';
                    card.style.marginBottom = '16px';

                    // ---- HEADER KARTU SISWA ----
                    let html = `
                    <div style="border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                        <div>
                            <h4 style="color:var(--primary); margin:0 0 4px 0; font-size:15px;">${sName}</h4>
                            <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; font-size:11px; color:#64748b;">
                                <span>🏫 ${sDetails}</span>
                                <span>👤 Mentor: ${sMentor}</span>
                                <span style="background:${rColor}22; color:${rColor}; padding:1px 8px; border-radius:20px; font-size:10px; font-weight:700;">${rLabel}</span>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <span class="status-badge" style="background:#eff6ff; color:#1d4ed8; font-size:12px;">${refs.length} Jurnal</span>
                            ${overallAvg ? `<div style="margin-top:4px; font-size:11px; color:#f59e0b; font-weight:700;">⭐ Nilai Rata-rata: ${overallAvg}/5</div>` : '<div style="margin-top:4px; font-size:10px; color:#94a3b8;">Belum ada penilaian</div>'}
                        </div>
                    </div>
                    <div style="max-height:600px; overflow-y:auto; padding-right:4px;">`;

                    // ---- RENDER TIAP ENTRI JURNAL ----
                    [...refs].reverse().forEach((r, idx) => {
                        const actualIdx = refs.length - 1 - idx;
                        const dayKey    = `day${r.day || actualIdx}`;
                        const cacheKey  = `${sEmail}_${dayKey}`;
                        // Load existing rating ke cache jika belum ada
                        if (!_journalRatings[cacheKey] && s.journalRatings && s.journalRatings[dayKey]) {
                            _journalRatings[cacheKey] = s.journalRatings[dayKey];
                        }
                        const saved = _journalRatings[cacheKey] || {};

                        let timeStr = '-';
                        if (r.date) {
                            try { timeStr = new Date(r.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
                            catch(e) { timeStr = r.date; }
                        }

                        const entryRole   = r.role || sRole;
                        const entryColor  = roleColor[entryRole] || rColor;
                        const entryLabel  = roleLabels[entryRole] || entryRole;
                        const rQuestion   = r.question
                            ? `<div style="font-size:11px; color:#475569; font-style:italic; margin:8px 0 6px 0; padding:6px 10px; background:#f1f5f9; border-left:3px solid ${entryColor}; border-radius:0 4px 4px 0;">❓ ${r.question}</div>`
                            : '';

                        // Hitung isi jawaban (panjang karakter sebagai proxy kedalaman)
                        const textLen = (r.text || '').length;
                        const depthColor = textLen > 200 ? '#10b981' : textLen > 80 ? '#f59e0b' : '#ef4444';
                        const depthLabel = textLen > 200 ? 'Mendalam' : textLen > 80 ? 'Cukup' : 'Singkat';

                        // Hitung rata-rata entri ini
                        const entryVals = aspectLabels.map(a => saved[a.key]||0).filter(v=>v>0);
                        const entryAvg  = entryVals.length > 0 ? (entryVals.reduce((a,b)=>a+b,0)/entryVals.length).toFixed(1) : null;
                        const isFullyRated = aspectLabels.every(a => (saved[a.key]||0) > 0);

                        html += `
                        <div style="border:1px solid #e2e8f0; border-radius:10px; margin-bottom:14px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                            <!-- Meta bar -->
                            <div style="background:${entryColor}11; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; border-bottom:1px solid ${entryColor}33;">
                                <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                                    <span style="font-weight:700; color:${entryColor}; font-size:12px;">🗓️ Game Day ${r.day || (actualIdx+1)}</span>
                                    <span style="background:${entryColor}22; color:${entryColor}; padding:1px 7px; border-radius:20px; font-size:10px;">${entryLabel}</span>
                                    <span style="font-size:10px; color:#64748b;">🕒 ${timeStr}</span>
                                    <span style="font-size:10px; background:${depthColor}22; color:${depthColor}; padding:1px 7px; border-radius:20px;">${depthLabel} (${textLen} karakter)</span>
                                </div>
                                <span id="rating-total-${sEmail}-${dayKey}" style="font-size:11px; font-weight:700; color:${isFullyRated?'#10b981':'#94a3b8'};">
                                    ${entryAvg ? `⭐ Rata-rata: ${entryAvg}/5` : (isFullyRated ? '✅ Dinilai' : '⏳ Belum Dinilai')}
                                </span>
                            </div>

                            <!-- Isi Jurnal -->
                            <div style="padding:12px 14px;">
                                ${rQuestion}
                                <p style="margin:0 0 12px 0; font-style:italic; color:#334155; font-family:'Exo 2'; line-height:1.7; white-space:pre-wrap; font-size:12.5px; background:#fafafa; padding:10px 12px; border-radius:6px;">"${r.text || ''}"</p>

                                <!-- RUBRIK PENILAIAN GURU -->
                                <details style="margin-top:4px;">
                                    <summary style="cursor:pointer; font-size:11.5px; font-weight:700; color:#1e3a5f; padding:6px 0; user-select:none;">
                                        📋 Rubrik Penilaian Guru ${isFullyRated ? '<span style="color:#10b981; margin-left:6px;">✅ Sudah Dinilai</span>' : '<span style="color:#f59e0b; margin-left:6px;">⏳ Klik untuk menilai</span>'}
                                    </summary>
                                    <div style="margin-top:10px; padding:12px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                                            ${aspectLabels.map(a => `
                                            <div style="background:#fff; padding:10px 12px; border-radius:8px; border:1px solid #e2e8f0;">
                                                <div style="font-size:11px; font-weight:700; color:#1e3a5f; margin-bottom:2px;">${a.label}</div>
                                                <div style="font-size:10px; color:#94a3b8; margin-bottom:6px;">${a.desc}</div>
                                                ${renderStarInput(sEmail, dayKey, a.key, saved[a.key]||0, entryColor)}
                                            </div>`).join('')}
                                        </div>
                                        <!-- Catatan Guru -->
                                        <div style="margin-bottom:10px;">
                                            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">💬 Catatan / Umpan Balik Guru</label>
                                            <textarea id="catatan-${sEmail}-${dayKey}"
                                                style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; resize:vertical; min-height:60px; box-sizing:border-box; font-family:'Exo 2';"
                                                placeholder="Tulis catatan atau umpan balik untuk siswa ini..."
                                            >${saved.catatan||''}</textarea>
                                        </div>
                                        <!-- Tombol Simpan -->
                                        <button onclick="submitJournalRating(this)"
                                            data-email="${sEmail}"
                                            data-daykey="${dayKey}"
                                            data-cachekey="${cacheKey}"
                                            style="background:#1e3a5f; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-size:12px; cursor:pointer; font-weight:700; width:100%;">
                                            💾 Simpan Penilaian Jurnal Ini
                                        </button>
                                    </div>
                                </details>
                            </div>
                        </div>`;
                    });

                    html += `</div>`; // tutup scroll area
                    card.innerHTML = html;
                    container.appendChild(card);
                });
            }

            // =====================================================================
            // FASE 2 — RENDER PORTOFOLIO DI DASHBOARD GURU
            // =====================================================================

            function resetPortfolioFilter() {
                ['pf-filter-siswa','pf-filter-kelas'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
                ['pf-filter-format','pf-filter-target'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
                renderPortfolio();
            }

            // Simpan catatan guru untuk karya portofolio ke Firebase
            async function savePortfolioNote(studentEmail, karya_id, note) {
                // Update local cache
                const s = (latestStudentData||[]).find(x => x.email === studentEmail);
                if (s && s.saveData && s.saveData.portfolioItems) {
                    const item = s.saveData.portfolioItems.find(i => i.id === karya_id);
                    if (item) item.teacherNote = note;
                }
                // Persist ke Firebase
                if (typeof db !== 'undefined' && DataService.mode === 'firebase') {
                    try {
                        const docRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail);
                        const snap = await docRef.get();
                        if (snap.exists) {
                            const data = snap.data();
                            const saveData = data.saveData || {};
                            const items = (saveData.portfolioItems || []).map(i =>
                                i.id === karya_id ? { ...i, teacherNote: note } : i
                            );
                            await docRef.update({ 'saveData.portfolioItems': items });
                        }
                    } catch(e) { console.warn('Gagal simpan catatan portofolio:', e); }
                }
            }

            function renderPortfolio() {
                const allStudents = latestStudentData || [];
                const container   = document.getElementById('portfolio-container');
                if (!container) return;
                container.innerHTML = '';

                const fSiswa  = (document.getElementById('pf-filter-siswa')?.value || '').toLowerCase().trim();
                const fFormat = document.getElementById('pf-filter-format')?.value || '';
                const fTarget = document.getElementById('pf-filter-target')?.value || '';
                const fKelas  = (document.getElementById('pf-filter-kelas')?.value || '').toLowerCase().trim();

                const formatColors = { video:'#3b82f6', poster:'#10b981', game:'#8b5cf6', kuis:'#f59e0b', modul:'#64748b' };
                const targetColors = { kelas:'#0ea5e9', dosen:'#6366f1', lomba:'#f59e0b', online:'#10b981' };

                let totalKarya = 0, totalAP = 0, karyaLomba = 0;
                let allStudentCards = [];

                allStudents.forEach(s => {
                    const sd     = s.saveData || {};
                    const items  = sd.portfolioItems || [];
                    if (items.length === 0) return;

                    const sName   = s.name || sd.name || 'Tanpa Nama';
                    const sDetails = s.details || sd.details || '-';
                    const sEmail  = s.email || '';
                    if (fSiswa && !sName.toLowerCase().includes(fSiswa)) return;
                    if (fKelas && !sDetails.toLowerCase().includes(fKelas)) return;

                    // Filter items
                    const filtered = items.filter(i => {
                        if (fFormat && i.formatId !== fFormat) return false;
                        if (fTarget && i.targetId !== fTarget) return false;
                        return true;
                    });
                    if (filtered.length === 0) return;

                    filtered.forEach(i => {
                        totalKarya++;
                        totalAP += i.apEarned || 0;
                        if (i.targetId === 'lomba') karyaLomba++;
                    });

                    const studentAP = filtered.reduce((a, i) => a + (i.apEarned||0), 0);

                    let cardHtml = `
                    <div class="dash-card" style="margin-bottom:16px;">
                        <div style="border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                            <div>
                                <h4 style="color:var(--primary); margin:0 0 3px 0;">${sName}</h4>
                                <span style="font-size:11px; color:#64748b;">🏫 ${sDetails}</span>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:12px; font-weight:700; color:#8b5cf6;">🏅 ${studentAP} AP</div>
                                <div style="font-size:11px; color:#64748b;">${filtered.length} karya</div>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">`;

                    filtered.slice().reverse().forEach(item => {
                        const fColor = formatColors[item.formatId] || '#64748b';
                        const tColor = targetColors[item.targetId] || '#64748b';
                        const hasNote = item.teacherNote && item.teacherNote.trim().length > 0;
                        const noteId = `pf-note-${sEmail.replace(/[^a-z0-9]/gi,'_')}-${item.id}`;

                        cardHtml += `
                        <div style="border:1px solid #e2e8f0; border-radius:10px; padding:12px; background:#fafafa; position:relative;">
                            <!-- Badges -->
                            <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px;">
                                <span style="background:${fColor}22; color:${fColor}; font-size:10px; padding:2px 8px; border-radius:20px; font-weight:700;">${item.formatEmoji} ${item.formatLabel}</span>
                                <span style="background:${tColor}22; color:${tColor}; font-size:10px; padding:2px 8px; border-radius:20px;">${item.targetLabel}</span>
                                ${item.targetId==='lomba' ? '<span style="background:#fef9c3; color:#854d0e; font-size:10px; padding:2px 8px; border-radius:20px;">🏆 Lomba</span>' : ''}
                            </div>
                            <!-- Konten -->
                            <div style="font-size:13px; font-weight:700; color:#1e3a5f; margin-bottom:4px;">${item.topicEmoji} ${item.topicLabel}</div>
                            <div style="font-size:10.5px; color:#64748b; margin-bottom:8px;">📅 Game Day ${item.day} &nbsp;·&nbsp; 🏅 +${item.apEarned} AP &nbsp;·&nbsp; 🧠 INT +${item.intEarned}</div>
                            <!-- Catatan Guru -->
                            <div style="margin-top:8px; padding-top:8px; border-top:1px solid #e2e8f0;">
                                <label style="font-size:10.5px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">💬 Catatan Guru:</label>
                                <textarea id="${noteId}"
                                    style="width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; resize:vertical; min-height:45px; box-sizing:border-box; background:${hasNote?'#f0fdf4':'#fff'};"
                                    placeholder="Tulis catatan atau apresiasi..."
                                >${item.teacherNote||''}</textarea>
                                <button onclick="(function(btn){
                                    const note = document.getElementById('${noteId}')?.value || '';
                                    btn.textContent = '⏳';
                                    savePortfolioNote('${sEmail}','${item.id}', note).then(()=>{
                                        btn.textContent = '✅ Tersimpan';
                                        btn.style.background = '#10b981';
                                        document.getElementById('${noteId}').style.background = '#f0fdf4';
                                        setTimeout(()=>{ btn.textContent='💾 Simpan'; btn.style.background='#1e3a5f'; }, 2000);
                                    });
                                })(this)"
                                style="margin-top:5px; background:#1e3a5f; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:11px; cursor:pointer; width:100%;">
                                    💾 Simpan Catatan
                                </button>
                            </div>
                        </div>`;
                    });

                    cardHtml += `</div></div>`;
                    allStudentCards.push(cardHtml);
                });

                // Ringkasan
                const summaryEl = document.getElementById('portfolio-summary');
                const badgeEl   = document.getElementById('portfolio-count-badge');
                if (badgeEl) badgeEl.textContent = `${allStudentCards.length} siswa · ${totalKarya} karya`;
                if (summaryEl) {
                    summaryEl.innerHTML = [
                        { icon:'🎨', val:totalKarya,      label:'Total Karya',     color:'#8b5cf6', bg:'#f5f3ff' },
                        { icon:'🏅', val:totalAP,         label:'Total AP Kelas',  color:'#f59e0b', bg:'#fffbeb' },
                        { icon:'🏆', val:karyaLomba,      label:'Karya Lomba',     color:'#ef4444', bg:'#fef2f2' },
                        { icon:'👩‍🎨', val:allStudentCards.length, label:'Siswa Berkarya', color:'#10b981', bg:'#ecfdf5' },
                    ].map(c => `
                        <div style="background:${c.bg}; border-radius:10px; padding:14px 16px; border:1px solid ${c.color}33; text-align:center;">
                            <div style="font-size:22px;">${c.icon}</div>
                            <div style="font-size:22px; font-weight:800; color:${c.color}; line-height:1.2;">${c.val}</div>
                            <div style="font-size:10.5px; color:#64748b; margin-top:2px;">${c.label}</div>
                        </div>`).join('');
                }

                if (allStudentCards.length === 0) {
                    container.innerHTML = `<div style="text-align:center; padding:50px; color:#cbd5e1;">
                        <div style="font-size:48px; margin-bottom:10px;">🎨</div>
                        <p>Belum ada karya media pembelajaran yang dibuat.</p>
                        <small>Siswa perlu masuk ke Kampus → Bangku Kampus → "Buat Media Pembelajaran"</small>
                    </div>`;
                    return;
                }

                container.innerHTML = allStudentCards.join('');
            }

            // NEW: FUNCTION RENDER VALIDATION / COMPETENCY
            function renderValidation() { // Hapus async
                const students = latestStudentData; // Gunakan Cache
                const tbody = document.getElementById('validation-body');
                tbody.innerHTML = '';

                if (students.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada data siswa.</td></tr>';
                    return;
                }

                students.forEach(s => {
                    const sd = s.saveData || {};

                    // 1. ANALISIS DECISION MAKING (ROLE)
                    let roleScore = 0;
                    let roleText = "Belum Memilih";
                    let roleColor = "#94a3b8"; // Abu-abu

                    if (sd.role && sd.role !== 'none') {
                        roleScore = 100;
                        roleText = sd.role.toUpperCase();

                        // Warna berdasarkan role
                        if (sd.role === 'worker') roleColor = "#ef4444"; // Merah
                        else if (sd.role === 'student') roleColor = "#3b82f6"; // Biru
                        else if (sd.role === 'entrepreneur') roleColor = "#10b981"; // Hijau
                        else if (sd.role === 'family') roleColor = "#d946ef"; // Pink
                    }

                    // 2. ANALISIS FINANCIAL LITERACY
                    // Baseline: 10.000G (Modal Awal)
                    // Target: 50.000G (Bagus), 100.000G (Sangat Bagus)
                    const money = sd.money || 0;
                    let moneyScore = 0;
                    if (money >= 100000) moneyScore = 100;
                    else if (money >= 50000) moneyScore = 85;
                    else if (money >= 20000) moneyScore = 70;
                    else if (money >= 10000) moneyScore = 60; // Standar
                    else moneyScore = 40; // Defisit (Boros)

                    // 3. ANALISIS SKILL DEVELOPMENT
                    // Target Trial: Stat Utama mencapai 50
                    let skillVal = 0;
                    let skillName = "-";

                    if (sd.role === 'worker') { skillVal = sd.str || 0; skillName = "STR"; }
                    else if (sd.role === 'student') { skillVal = sd.int || 0; skillName = "INT"; }
                    else if (sd.role === 'entrepreneur') { skillVal = sd.biz || 0; skillName = "BIZ"; }
                    else if (sd.role === 'family') { skillVal = sd.reputation || 0; skillName = "REP"; }

                    // Hitung persentase skill terhadap target (50)
                    let skillScore = Math.min(100, Math.floor((skillVal / 50) * 100));

                    // Rata-rata Skor Kompetensi
                    const totalScore = Math.floor((roleScore + moneyScore + skillScore) / 3);

                    // Tentukan Grade Warna
                    let scoreColor = "#ef4444"; // Merah (Kurang)
                    if (totalScore >= 80) scoreColor = "#10b981"; // Hijau (Baik)
                    else if (totalScore >= 60) scoreColor = "#f59e0b"; // Kuning (Cukup)

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>
                <strong>${s.name}</strong><br>
                <span style="font-size:10px; color:#64748b;">${s.details}</span>
            </td>
            <td>
                <span style="font-size:11px; font-weight:bold; color:${roleColor}; border:1px solid ${roleColor}; padding:2px 6px; border-radius:4px;">${roleText}</span>
                <div style="font-size:10px; margin-top:2px;">Konsistensi: ${roleScore}%</div>
            </td>
            <td>
                <div style="font-weight:bold; color:#0f172a;">${money.toLocaleString('id-ID')} G</div>
                <div class="bar-container" style="width:80px; height:4px; margin-top:2px;">
                    <div style="width:${moneyScore}%; height:100%; background:#fbbf24;"></div>
                </div>
                <span style="font-size:9px; color:#64748b;">Literasi: ${moneyScore}/100</span>
            </td>
            <td>
                <div style="font-weight:bold; color:#0f172a;">${skillName}: ${skillVal}</div>
                <div class="bar-container" style="width:80px; height:4px; margin-top:2px;">
                    <div style="width:${skillScore}%; height:100%; background:#3b82f6;"></div>
                </div>
                <span style="font-size:9px; color:#64748b;">Progres: ${skillScore}%</span>
            </td>
            <td>
                <div style="font-size:18px; font-weight:900; color:${scoreColor};">${totalScore}</div>
            </td>
        `;
                    tbody.appendChild(tr);
                });
            }

            // NEW: FUNGSI RENDER HALAMAN RESET (ASYNC UPDATE)
            function renderResetPage() { // Hapus async
                const students = latestStudentData; // Gunakan Cache
                const tbody = document.getElementById('reset-body');
                tbody.innerHTML = '';

                if (students.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada data siswa. Pastikan siswa sudah Login dan Save setidaknya sekali.</td></tr>';
                    return;
                }

                students.forEach(s => {
                    const sd = s.saveData || {};
                    const role = sd.role && sd.role !== 'none' ? sd.role.toUpperCase() : 'BELUM PILIH';
                    const progress = `Day ${sd.day || 1} | Lv ${sd.level || 1}`;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td><strong>${s.name}</strong></td>
            <td>${s.details}</td>
            <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${role}</span></td>
            <td>${progress}</td>
            <td>
                <div style="display:flex; gap:5px;">
                    <button class="auth-btn" 
                        style="width:auto; padding:6px 12px; font-size:10px; margin:0; background:linear-gradient(90deg, #f59e0b, #d97706); border:1px solid #b45309;" 
                        onclick="confirmResetStudent('${s.email}', '${s.name}')" title="Hapus Progress (Mulai Ulang)">
                        🔄 RESET
                    </button>
                    <button class="auth-btn" 
                        style="width:auto; padding:6px 12px; font-size:10px; margin:0; background:linear-gradient(90deg, #ef4444, #b91c1c); border:1px solid #7f1d1d;" 
                        onclick="confirmDeleteStudent('${s.email}', '${s.name}')" title="Hapus Akun Permanen">
                        🗑️ HAPUS
                    </button>
                </div>
            </td>
        `;
                    tbody.appendChild(tr);
                });
            }

            // NEW: KONFIRMASI RESET (DATA)
            async function confirmResetStudent(email, name) {
                const isConfirmed = confirm(`⚠️ RESET PROGRESS? ⚠️\n\nAnda akan menghapus SAVE DATA permainan siswa:\n"${name}"\n\nSiswa akan kembali ke awal permainan (Prologue) tapi AKUN TETAP ADA.\n\nLanjutkan?`);

                if (isConfirmed) {
                    document.body.style.cursor = 'wait';
                    try {
                        const result = await DataService.adminResetStudent(email);
                        if (result.success) {
                            alert(`✅ RESET SUKSES!\nData progress ${name} telah di-reset.`);
                            if (typeof refreshDashboardData === 'function') refreshDashboardData();
                            else renderResetPage();
                        } else {
                            alert(`❌ GAGAL RESET!\n${result.msg}`);
                        }
                    } catch (e) {
                        alert("Error: " + e.message);
                    } finally {
                        document.body.style.cursor = 'default';
                    }
                }
            }

            // NEW: KONFIRMASI DELETE (AKUN)
            async function confirmDeleteStudent(email, name) {
                const isConfirmed = confirm(`⛔ HAPUS AKUN PERMANEN? ⛔\n\nAnda akan menghapus SELURUH AKUN siswa:\n\n"${name}" (${email})\n\nSiswa TIDAK BISA LOGIN LAGI dan harus daftar ulang. Semua data hilang selamanya.\n\nLanjutkan Hapus Akun?`);

                if (isConfirmed) {
                    document.body.style.cursor = 'wait';
                    try {
                        const result = await DataService.adminDeleteStudent(email);
                        if (result.success) {
                            alert(`🗑️ AKUN DIHAPUS!\nAkun ${name} telah dihapus permanen dari database.`);
                            // Refresh data dashboard secara paksa
                            if (typeof refreshDashboardData === 'function') refreshDashboardData();
                            else renderResetPage();
                        } else {
                            alert(`❌ GAGAL HAPUS!\n${result.msg}`);
                        }
                    } catch (e) {
                        alert("Error Sistem: " + e.message);
                    } finally {
                        document.body.style.cursor = 'default';
                    }
                }
            }

            // ══════════════════════════════════════════════════════
            // 🔧 DEBUG MODE — Admin Functions
            // ══════════════════════════════════════════════════════
            function renderDebugModePage() {
                const isActive = isDebugModeActive();
                const badge  = document.getElementById('debug-status-badge');
                const detail = document.getElementById('debug-detail-status');

                if (badge) {
                    if (isActive) {
                        badge.innerText = '🟢 AKTIF';
                        badge.style.background    = '#dcfce7';
                        badge.style.color         = '#166534';
                        badge.style.borderColor   = '#4ade80';
                    } else {
                        badge.innerText = '⬜ NON-AKTIF';
                        badge.style.background    = '#f1f5f9';
                        badge.style.color         = '#64748b';
                        badge.style.borderColor   = '#cbd5e1';
                    }
                }

                if (detail) {
                    detail.innerHTML = isActive
                        ? `🧪 Debug mode <b style="color:#166534">AKTIF</b> — Tombol "🧚 Test Peri" dan "👹 Test Skripsi" tampil di HUD game saat kamu main.`
                        : `🔒 Debug mode <b style="color:#64748b">NON-AKTIF</b> — Tombol testing tersembunyi. Mode aman untuk siswa.`;
                }
            }

            function toggleDebugMode(activate) {
                localStorage.setItem(DEBUG_MODE_KEY, activate ? 'true' : 'false');
                renderDebugModePage();
                applyDebugModeToHUD();

                const msg = activate
                    ? '✅ Debug Mode AKTIF!\nTombol Test Peri & Test Skripsi akan muncul di HUD saat kamu masuk game.'
                    : '🔒 Debug Mode DIMATIKAN.\nTombol testing disembunyikan dari HUD game.';
                alert(msg);
            }

            // ═══════════════════════════════════════════════════════
            // 🧭 DASHBOARD BK — BIMBINGAN KONSELING
            // ═══════════════════════════════════════════════════════

            let _bkMsgEmail = '';
            let _bkMsgName  = '';

            const BK_ROLE_CONFIG = {
                worker:       { label: '⚔️ Pekerja',    color: '#2563eb', bg: '#dbeafe', bar: '#3b82f6' },
                student:      { label: '🎓 Akademisi',  color: '#7c3aed', bg: '#ede9fe', bar: '#8b5cf6' },
                entrepreneur: { label: '💼 Wirausaha',  color: '#059669', bg: '#dcfce7', bar: '#10b981' },
                family:       { label: '🏠 Keluarga',   color: '#db2777', bg: '#fce7f3', bar: '#ec4899' },
                none:         { label: '❓ Belum Pilih', color: '#94a3b8', bg: '#f1f5f9', bar: '#cbd5e1' }
            };

            const BK_TEMPLATES = {
                belum_pilih: `Halo [NAMA]! 😊\n\nGuru BK mencatat kamu belum memilih jalur karir di simulasi. Tidak apa-apa — memilih memang butuh keberanian.\n\nYuk kita ngobrol bareng! Ceritakan minat dan impianmu. Bersama-sama kita temukan jalur terbaik untukmu setelah lulus SMK. 💪\n\nSalam,\nGuru BK`,
                rendah:       `Halo [NAMA]! 🌟\n\nSemangat terus ya! Perjalananmu di simulasi memang belum sempurna, tapi ingat — setiap langkah adalah belajar.\n\nGuru BK percaya kamu punya potensi besar. Tetap konsisten, eksplorasi lebih banyak pilihan di game, dan jangan takut mencoba hal baru!\n\nKamu pasti bisa! 💙\n\nSalam,\nGuru BK`,
                eksplorasi:   `Halo [NAMA]! 🔍\n\nApakah kamu sudah menjelajahi semua jalur karir di simulasi?\n\nCobalah eksplorasi jalur yang berbeda: Pekerja (Fighter), Akademisi (Mage), Wirausaha (Support), atau Keluarga (Healer). Setiap jalur mengajarkan skill nyata yang akan berguna di masa depan.\n\nKalau ada pertanyaan tentang karir, jangan ragu datang ke ruang BK ya!\n\nSalam,\nGuru BK`,
                konseling:    `Halo [NAMA]! 👋\n\nGuru BK ingin mengundangmu untuk sesi konseling karir individu.\n\nBerdasarkan data perkembanganmu di simulasi, ada beberapa hal menarik yang ingin kita diskusikan bersama — terutama soal rencana masa depanmu setelah lulus SMK.\n\nSilakan hadir ke ruang BK pada jam istirahat. Terima kasih! 😊\n\nSalam,\nGuru BK`
            };

            function renderBKDashboard() {
                const students = latestStudentData.filter(s => s.role === 'siswa' || (!s.role || s.role === 'siswa'));

                // Hitung distribusi jalur
                const counts = { worker: 0, student: 0, entrepreneur: 0, family: 0, none: 0 };
                const total = students.length || 1;

                students.forEach(s => {
                    const role = (s.saveData && s.saveData.role && s.saveData.role !== 'none') ? s.saveData.role : 'none';
                    if (counts[role] !== undefined) counts[role]++;
                    else counts.none++;
                });

                // Update stat cards
                Object.keys(counts).forEach(role => {
                    const el = document.getElementById('bk-count-' + role);
                    const pEl = document.getElementById('bk-pct-' + role);
                    if (el) el.innerText = counts[role];
                    if (pEl) pEl.innerText = Math.round((counts[role] / total) * 100) + '% siswa';
                });

                // Render bar chart
                const chartEl = document.getElementById('bk-bar-chart');
                if (chartEl) {
                    const roles = ['worker', 'student', 'entrepreneur', 'family', 'none'];
                    const roleNames = { worker: '⚔️ Pekerja (Fighter)', student: '🎓 Akademisi (Mage)', entrepreneur: '💼 Wirausaha (Support)', family: '🏠 Keluarga (Healer)', none: '❓ Belum Memilih' };
                    const roleColors = { worker: '#3b82f6', student: '#8b5cf6', entrepreneur: '#10b981', family: '#ec4899', none: '#cbd5e1' };
                    const maxVal = Math.max(...Object.values(counts), 1);

                    chartEl.innerHTML = roles.map(role => {
                        const pct = Math.round((counts[role] / total) * 100);
                        const barW = Math.round((counts[role] / maxVal) * 100);
                        return `<div class="bk-bar-row">
                            <div class="bk-bar-label">${roleNames[role]}</div>
                            <div class="bk-bar-track">
                                <div class="bk-bar-fill" style="width:${barW}%; background:${roleColors[role]}; min-width:${counts[role]>0?'30px':'0'};">
                                    ${counts[role] > 0 ? pct + '%' : ''}
                                </div>
                            </div>
                            <div class="bk-bar-count">${counts[role]} siswa</div>
                        </div>`;
                    }).join('');
                }

                // Identifikasi siswa prioritas konseling
                const priorityStudents = [];
                const allStudents = [];

                students.forEach(s => {
                    const sd = s.saveData || {};
                    const role = (sd.role && sd.role !== 'none') ? sd.role : 'none';
                    const level = sd.level || 1;
                    const day = sd.day || 1;
                    const reflections = (sd.reflections || []).length;
                    const cfg = BK_ROLE_CONFIG[role] || BK_ROLE_CONFIG.none;
                    const score = calculateGrade(sd);

                    let priority = 'ok';
                    let priorityReason = 'Perkembangan Baik';
                    if (role === 'none') { priority = 'urgent'; priorityReason = 'Belum pilih jalur'; }
                    else if (level < 3 && day > 10) { priority = 'urgent'; priorityReason = 'Progress Lambat'; }
                    else if (score < 40) { priority = 'warning'; priorityReason = 'Skor Kompetensi Rendah'; }
                    else if (reflections === 0 && day > 5) { priority = 'warning'; priorityReason = 'Belum Jurnal'; }

                    const studentEntry = { ...s, sd, role, level, day, cfg, score, priority, priorityReason };
                    allStudents.push(studentEntry);
                    if (priority !== 'ok') priorityStudents.push(studentEntry);
                });

                // Update counter urgent
                const urgentEl = document.getElementById('bk-urgent-count');
                if (urgentEl) urgentEl.innerText = priorityStudents.length + ' siswa';

                // Render priority table
                renderBKPriorityTable(priorityStudents);

                // Render all students table
                renderBKAllTable(allStudents);

                // Jalankan Analitik Prediktif
                runPredictiveAnalytics(allStudents, _predFilter || 'all');
            }

            // ════════════════════════════════════════════════════════
            // ANALITIK PREDIKTIF ENGINE
            // ════════════════════════════════════════════════════════

            let _predFilter = 'all';

            function setPredFilter(filter, btn) {
                _predFilter = filter;
                document.querySelectorAll('.pred-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const students = latestStudentData.filter(s => s.role === 'siswa' || (!s.role));
                const allStudents = students.map(s => {
                    const sd = s.saveData || {};
                    const role = (sd.role && sd.role !== 'none') ? sd.role : 'none';
                    const level = sd.level || 1;
                    const day = sd.day || 1;
                    const score = calculateGrade(sd);
                    const cfg = BK_ROLE_CONFIG[role] || BK_ROLE_CONFIG.none;
                    let priority = 'ok';
                    if (role === 'none') priority = 'urgent';
                    else if (level < 3 && day > 10) priority = 'urgent';
                    else if (score < 40) priority = 'warning';
                    else if ((sd.reflections||[]).length === 0 && day > 5) priority = 'warning';
                    return { ...s, sd, role, level, day, cfg, score, priority };
                });
                runPredictiveAnalytics(allStudents, filter);
            }

            function switchPredTab(tab, btn) {
                document.querySelectorAll('.pred-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.pred-tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const el = document.getElementById('predtab-' + tab);
                if (el) el.classList.add('active');
            }

            function filterStudentsByClass(students, filter) {
                if (filter === 'all') return students;
                return students.filter(s => {
                    const kelas = (s.details || s.sd && s.sd.kelas || '').toLowerCase();
                    if (filter === 'kelas10') return kelas.includes('x') || kelas.includes('10');
                    if (filter === 'kelas11') return kelas.includes('xi') || kelas.includes('11');
                    if (filter === 'kelas12') return kelas.includes('xii') || kelas.includes('12');
                    return true;
                });
            }

            function runPredictiveAnalytics(allStudentsRaw, filter) {
                const students = filterStudentsByClass(allStudentsRaw, filter);
                const total = students.length;

                if (total === 0) {
                    document.getElementById('pred-stat-bars').innerHTML = '<div style="text-align:center;color:#94a3b8;padding:16px;font-size:12px;">Tidak ada data siswa untuk filter ini.</div>';
                    return;
                }

                const counts = { worker: 0, student: 0, entrepreneur: 0, family: 0, none: 0 };
                let totalStr=0, totalInt=0, totalBiz=0, totalRep=0;
                let totalLevel=0, totalDay=0, totalRefl=0;
                let urgentCount=0;

                students.forEach(s => {
                    counts[s.role] = (counts[s.role] || 0) + 1;
                    const sd = s.sd || {};
                    totalStr += (sd.str || 0);
                    totalInt += (sd.int || 0);
                    totalBiz += (sd.biz || 0);
                    totalRep += (sd.reputation || 0);
                    totalLevel += s.level;
                    totalDay += s.day;
                    totalRefl += (sd.reflections || []).length;
                    if (s.priority === 'urgent') urgentCount++;
                });

                const avgStr = totalStr / total;
                const avgInt = totalInt / total;
                const avgBiz = totalBiz / total;
                const avgRep = totalRep / total;
                const decisionPct = Math.round(((total - (counts.none||0)) / total) * 100);
                const engageScore = ((totalLevel / total) * (totalDay / total)).toFixed(1);

                const roleOrder = ['worker','student','entrepreneur','family'];
                const dominantRole = roleOrder.reduce((a, b) => (counts[a]||0) >= (counts[b]||0) ? a : b);
                const dominantCfg = BK_ROLE_CONFIG[dominantRole] || BK_ROLE_CONFIG.none;
                const dominantPct = Math.round(((counts[dominantRole]||0) / total) * 100);

                setInner('pred-dominant-val', dominantCfg.label);
                setInner('pred-dominant-desc', counts[dominantRole] + ' dari ' + total + ' siswa (' + dominantPct + '%)');
                setTrendBadge('pred-dominant-trend', dominantPct >= 40 ? 'up' : dominantPct >= 20 ? 'neutral' : 'down',
                    dominantPct >= 40 ? 'Sangat Dominan' : dominantPct >= 20 ? 'Cukup Merata' : 'Tidak Menonjol');

                setInner('pred-decision-val', decisionPct + '%');
                setTrendBadge('pred-decision-trend', decisionPct >= 70 ? 'up' : decisionPct >= 40 ? 'neutral' : 'down',
                    decisionPct >= 70 ? 'Baik' : decisionPct >= 40 ? 'Sedang' : 'Perlu Perhatian');

                setInner('pred-engage-val', engageScore);
                setTrendBadge('pred-engage-trend', engageScore >= 5 ? 'up' : engageScore >= 2 ? 'neutral' : 'down',
                    engageScore >= 5 ? 'Aktif Bermain' : engageScore >= 2 ? 'Cukup Aktif' : 'Kurang Aktif');

                setInner('pred-risk-val', urgentCount + ' siswa');
                setTrendBadge('pred-risk-trend', urgentCount === 0 ? 'up' : urgentCount <= Math.ceil(total*0.2) ? 'neutral' : 'down',
                    urgentCount === 0 ? 'Aman' : urgentCount <= Math.ceil(total*0.2) ? 'Perlu Dipantau' : 'Kritis');

                const roleNames = { worker: 'Pekerja (Fighter)', student: 'Akademisi (Mage)', entrepreneur: 'Wirausaha (Support)', family: 'Keluarga (Healer)', none: 'Belum Memilih' };
                const roleEmoji = { worker: 'Pekerja', student: 'Akademisi', entrepreneur: 'Wirausaha', family: 'Keluarga', none: 'Belum' };
                const roleColors = { worker: '#3b82f6', student: '#8b5cf6', entrepreneur: '#10b981', family: '#ec4899', none: '#cbd5e1' };
                const maxCount = Math.max(...Object.values(counts), 1);

                const statMap = { worker: avgStr, student: avgInt, entrepreneur: avgBiz, family: avgRep };
                const predictedRole = roleOrder.reduce((a, b) => statMap[a] >= statMap[b] ? a : b);

                const barsEl = document.getElementById('pred-stat-bars');
                barsEl.innerHTML = roleOrder.concat(['none']).map(role => {
                    const cnt = counts[role] || 0;
                    const pct = Math.round((cnt / total) * 100);
                    const barW = Math.round((cnt / maxCount) * 100);
                    const isPredicted = role === predictedRole && (counts.none || 0) > 0;
                    const predTag = isPredicted ? ' <span style="font-size:9px;background:#fef3c7;color:#d97706;padding:1px 6px;border-radius:10px;margin-left:4px;">Prediksi</span>' : '';
                    return '<div class="pred-stat-row">' +
                        '<div class="pred-stat-name">' + roleNames[role] + predTag + '</div>' +
                        '<div class="pred-stat-track"><div class="pred-stat-fill" style="width:' + barW + '%;background:' + roleColors[role] + ';" data-label="' + pct + '%"></div></div>' +
                        '<div class="pred-stat-count">' + cnt + '</div></div>';
                }).join('');

                const trendData = [
                    { role: 'worker',       emoji: 'Pekerja',   name: 'Pekerja',    val: avgStr, color: '#3b82f6' },
                    { role: 'student',      emoji: 'Akademisi', name: 'Akademisi',  val: avgInt, color: '#8b5cf6' },
                    { role: 'entrepreneur', emoji: 'Wirausaha', name: 'Wirausaha',  val: avgBiz, color: '#10b981' },
                    { role: 'family',       emoji: 'Keluarga',  name: 'Keluarga',   val: avgRep, color: '#ec4899' },
                ].sort((a,b) => b.val - a.val);

                const maxStat = Math.max(avgStr, avgInt, avgBiz, avgRep, 1);
                const trendWrap = document.getElementById('pred-trend-wrap');
                const roleEmojiMap = { worker: 'Pekerja', student: 'Akademisi', entrepreneur: 'Wirausaha', family: 'Keluarga' };
                trendWrap.innerHTML = trendData.map((t, i) => {
                    const barPct = Math.round((t.val / maxStat) * 100);
                    const rank = i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : '4th';
                    return '<div class="pred-trend-item">' +
                        '<div class="pred-trend-emoji" style="font-size:18px;font-weight:900;">' + t.name + '</div>' +
                        '<div class="pred-trend-name">' + t.name + '</div>' +
                        '<div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">' + rank + ' Minat</div>' +
                        '<div class="pred-trend-bar-wrap"><div class="pred-trend-bar" style="width:' + barPct + '%;background:' + t.color + ';"></div></div>' +
                        '<div class="pred-trend-pct" style="color:' + t.color + ';">' + t.val.toFixed(1) + '</div>' +
                        '<div style="font-size:9px;color:#94a3b8;margin-top:2px;">rata-rata stat</div>' +
                        '</div>';
                }).join('');

                const hiddenEl = document.getElementById('pred-hidden-profile');
                const topStat = trendData[0];
                const gap = topStat.val - trendData[1].val;
                const gapPct = maxStat > 0 ? Math.round((gap/maxStat)*100) : 0;
                const isMultiMinat = (trendData[0].val - trendData[3].val) < (maxStat * 0.3);
                const chosenDominantMatch = dominantRole === topStat.role;

                hiddenEl.innerHTML =
                    '<strong>Analisis Profil Minat Tersembunyi</strong><br><br>' +
                    (isMultiMinat
                        ? '<span style="color:#d97706;"><strong>Minat Tersebar Merata:</strong></span> Siswa menunjukkan minat seimbang antar jalur (selisih stat hanya ' + gapPct + '%). Banyak siswa masih dalam fase eksplorasi. Rekomendasikan sesi eksplorasi minat lebih lanjut.'
                        : '<span style="color:#16a34a;"><strong>Minat Menonjol pada ' + topStat.name + ':</strong></span> Gap ' + gapPct + '% di atas jalur lain berdasarkan investasi stat.'
                    ) + '<br><br>' +
                    (chosenDominantMatch
                        ? '<span style="color:#16a34a;"><strong>Pilihan Konsisten dengan Perilaku:</strong></span> Jalur terpilih (' + dominantCfg.label + ') sesuai dengan kecenderungan investasi stat. Kelas menunjukkan kesadaran karir yang baik.'
                        : '<span style="color:#dc2626;"><strong>Ketidaksesuaian Pilihan vs Perilaku:</strong></span> Jalur paling dipilih adalah ' + dominantCfg.label + ', namun stat kolektif menunjukkan minat tertinggi pada <strong>' + topStat.name + '</strong>. Pertimbangkan sesi refleksi minat mendalam.'
                    ) + '<br><br>' +
                    '<span style="color:#7c3aed;"><strong>Rata-rata Jurnal Refleksi:</strong></span> ' + (totalRefl/total).toFixed(1) + ' entri/siswa — ' +
                    ((totalRefl/total) >= 2 ? 'Baik, siswa aktif merefleksikan perjalanan karir.' : 'Rendah, dorong siswa untuk lebih aktif menulis jurnal di dalam game.');

                const noChoiceRisk  = Math.round(((counts.none||0) / total) * 100);
                const lowEngageRisk = Math.round((students.filter(s => s.level < 3 && s.day > 7).length / total) * 100);
                const noJournalRisk = Math.round((students.filter(s => (s.sd && s.sd.reflections ? s.sd.reflections : []).length === 0 && s.day > 5).length / total) * 100);
                const lowStatRisk   = Math.round((students.filter(s => Math.max(s.sd ? s.sd.str||0 : 0, s.sd ? s.sd.int||0 : 0, s.sd ? s.sd.biz||0 : 0, s.sd ? s.sd.reputation||0 : 0) < 10).length / total) * 100);

                const riskGrid = document.getElementById('pred-risk-grid');
                const risks = [
                    { title: 'Risiko Kebingungan Karir', desc: 'Belum memilih jalur', pct: noChoiceRisk, count: counts.none||0 },
                    { title: 'Risiko Rendah Engagement', desc: 'Level < 3 padahal sudah > 7 hari', pct: lowEngageRisk, count: students.filter(s => s.level < 3 && s.day > 7).length },
                    { title: 'Risiko Minim Refleksi', desc: 'Belum punya jurnal refleksi', pct: noJournalRisk, count: students.filter(s => (s.sd && s.sd.reflections ? s.sd.reflections : []).length === 0 && s.day > 5).length },
                    { title: 'Risiko Kompetensi Rendah', desc: 'Semua stat utama di bawah 10', pct: lowStatRisk, count: students.filter(s => Math.max(s.sd ? s.sd.str||0 : 0, s.sd ? s.sd.int||0 : 0, s.sd ? s.sd.biz||0 : 0, s.sd ? s.sd.reputation||0 : 0) < 10).length },
                ];

                riskGrid.innerHTML = risks.map(r => {
                    const cls = r.pct >= 50 ? 'risk-high' : r.pct >= 25 ? 'risk-mid' : 'risk-low';
                    const lvl = r.pct >= 50 ? 'Tinggi' : r.pct >= 25 ? 'Sedang' : 'Rendah';
                    return '<div class="pred-risk-card">' +
                        '<div class="pred-risk-title">' + r.title + '</div>' +
                        '<div class="pred-risk-meter"><div class="pred-risk-fill ' + cls + '" style="width:' + r.pct + '%;"></div></div>' +
                        '<div class="pred-risk-meta"><span>' + r.desc + '</span><span><strong>' + r.pct + '%</strong> (' + r.count + ' siswa) &middot; ' + lvl + '</span></div>' +
                        '</div>';
                }).join('');

                const topRiskPct = Math.max(noChoiceRisk, lowEngageRisk, noJournalRisk, lowStatRisk);
                const riskSummary = document.getElementById('pred-risk-summary');
                riskSummary.style.display = 'block';
                if (topRiskPct >= 50) {
                    riskSummary.style.background = '#fff7ed'; riskSummary.style.borderColor = '#fed7aa'; riskSummary.style.color = '#92400e';
                    riskSummary.innerHTML = '<strong>Perhatian Kritis:</strong> Lebih dari setengah siswa menunjukkan indikator risiko yang tinggi. Segera jadwalkan sesi konseling kelompok atau kelas BK khusus.';
                } else if (topRiskPct >= 25) {
                    riskSummary.style.background = '#fefce8'; riskSummary.style.borderColor = '#fef08a'; riskSummary.style.color = '#854d0e';
                    riskSummary.innerHTML = '<strong>Pantauan Aktif Diperlukan:</strong> Sebagian siswa menunjukkan tanda-tanda yang perlu diperhatikan. Lakukan check-in individu untuk siswa prioritas konseling.';
                } else {
                    riskSummary.style.background = '#f0fdf4'; riskSummary.style.borderColor = '#86efac'; riskSummary.style.color = '#166534';
                    riskSummary.innerHTML = '<strong>Kondisi Relatif Baik:</strong> Mayoritas siswa dalam kondisi perkembangan yang positif. Pertahankan program yang berjalan dan terus dorong eksplorasi minat.';
                }

                const actions = [];

                if ((counts.none||0) > 0) {
                    actions.push({ icon: '?', color: '#dc2626', tag: 'tag-urgent', tagText: 'Mendesak',
                        title: 'Sesi Eksplorasi Karir — ' + (counts.none||0) + ' Siswa Belum Memilih',
                        desc: (counts.none||0) + ' siswa (' + noChoiceRisk + '%) belum memilih jalur karir. Rekomendasikan penggunaan menu Eksplorasi di dalam game, atau adakan sesi diskusi kelompok tentang 4 jalur karir.' });
                }

                if (lowEngageRisk >= 20) {
                    actions.push({ icon: 'G', color: '#d97706', tag: 'tag-suggest', tagText: 'Saran',
                        title: 'Tingkatkan Motivasi untuk Siswa Pasif',
                        desc: lowEngageRisk + '% siswa menunjukkan engagement rendah. Kirim pesan motivasi melalui fitur Kirim Pesan BK, atau gunakan template "Motivasi & Semangat".' });
                }

                if (!chosenDominantMatch) {
                    actions.push({ icon: 'R', color: '#7c3aed', tag: 'tag-suggest', tagText: 'Insight',
                        title: 'Diskusi Kesesuaian Minat vs Pilihan Jalur',
                        desc: 'Terdeteksi ketidaksesuaian antara pilihan jalur formal siswa dengan kecenderungan minat berdasarkan investasi stat. Rekomendasikan sesi refleksi diri.' });
                }

                if (noJournalRisk >= 30) {
                    actions.push({ icon: 'J', color: '#0ea5e9', tag: 'tag-suggest', tagText: 'Saran',
                        title: 'Dorong Penulisan Jurnal Refleksi',
                        desc: noJournalRisk + '% siswa belum menulis jurnal refleksi. Ingatkan siswa bahwa jurnal adalah bagian penting dari proses eksplorasi karir dan bisa jadi bahan portofolio P5/BK.' });
                }

                actions.push({ icon: 'I', color: topStat.color, tag: 'tag-info', tagText: 'Info Kelas',
                    title: 'Kelas Cenderung Tertarik pada Jalur ' + topStat.name,
                    desc: 'Berdasarkan analisis investasi stat kolektif, jalur ' + topStat.name + ' memiliki rata-rata stat tertinggi (' + topStat.val.toFixed(1) + '). Pertimbangkan mengundang narasumber terkait karir ini.' });

                if (decisionPct < 50) {
                    actions.push({ icon: 'D', color: '#059669', tag: 'tag-urgent', tagText: 'Jadwal',
                        title: 'Jadwalkan Sesi Pengambilan Keputusan Karir',
                        desc: 'Kurang dari 50% siswa telah membuat keputusan jalur karir. Rekomendasikan sesi BK khusus bertema "Mengenal Diri & Merencanakan Masa Depan".' });
                }

                const actionList = document.getElementById('pred-action-list');
                actionList.innerHTML = actions.map(a =>
                    '<div class="pred-action-item" style="--action-color:' + a.color + ';">' +
                    '<div class="pred-action-content">' +
                    '<div class="pred-action-title">' + a.title + '</div>' +
                    '<div class="pred-action-desc">' + a.desc + '</div>' +
                    '<span class="pred-action-tag ' + a.tag + '">' + a.tagText + '</span>' +
                    '</div></div>'
                ).join('') || '<div style="text-align:center;color:#16a34a;padding:20px;font-size:13px;">Tidak ada rekomendasi mendesak. Kelas dalam kondisi baik!</div>';
            }

            function setInner(id, val) {
                const el = document.getElementById(id);
                if (el) el.innerHTML = val;
            }

            function setTrendBadge(id, type, text) {
                const el = document.getElementById(id);
                if (!el) return;
                el.className = 'pred-insight-trend ' + (type === 'up' ? 'trend-up' : type === 'down' ? 'trend-down' : 'trend-neutral');
                el.innerHTML = (type === 'up' ? 'naik ' : type === 'down' ? 'turun ' : '● ') + text;
            }

            function renderBKPriorityTable(students) {
                const tbody = document.getElementById('bk-priority-body');
                if (!tbody) return;
                if (students.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#16a34a;">
                        ✅ Tidak ada siswa yang membutuhkan konseling mendesak. Semua siswa berkembang dengan baik!
                    </td></tr>`;
                    return;
                }
                // Sort: urgent first
                students.sort((a,b) => (a.priority === 'urgent' ? -1 : 1));
                tbody.innerHTML = students.map(s => {
                    const badgeClass = s.priority === 'urgent' ? 'bk-urgent' : 'bk-warning';
                    const badgeText = s.priority === 'urgent' ? '🚨 Mendesak' : '⚠️ Perlu Perhatian';
                    return `<tr>
                        <td><strong>${s.name}</strong></td>
                        <td style="font-size:11px;">${s.details || '-'}</td>
                        <td><span style="background:${s.cfg.bg}; color:${s.cfg.color}; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;">${s.cfg.label}</span></td>
                        <td style="font-size:12px; color:#374151;">Lv ${s.level} · Hari ${s.day}</td>
                        <td><span class="bk-priority-badge ${badgeClass}">${badgeText}</span><br><span style="font-size:10px; color:#94a3b8;">${s.priorityReason}</span></td>
                        <td><button class="bk-msg-btn" onclick="openBKMsgModal('${s.email}','${s.name.replace(/'/g,"\\'")}')">💬 Pesan</button></td>
                    </tr>`;
                }).join('');
            }

            function renderBKAllTable(students) {
                const tbody = document.getElementById('bk-all-body');
                if (!tbody) return;
                if (students.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#94a3b8; padding:20px;">Belum ada data siswa.</td></tr>';
                    return;
                }
                tbody.innerHTML = students.map((s, i) => {
                    const sd = s.sd || {};
                    const mainStat = s.role === 'worker' ? `STR: ${sd.str||0}` : s.role === 'student' ? `INT: ${sd.int||0}` : s.role === 'entrepreneur' ? `BIZ: ${sd.biz||0}` : s.role === 'family' ? `REP: ${sd.reputation||0}` : '—';
                    const reflCount = (sd.reflections || []).length;
                    return `<tr>
                        <td style="color:#94a3b8;">${i+1}</td>
                        <td><strong>${s.name}</strong></td>
                        <td style="font-size:11px;">${s.details||'-'}</td>
                        <td><span style="background:${s.cfg.bg}; color:${s.cfg.color}; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;">${s.cfg.label}</span></td>
                        <td style="font-size:12px; text-align:center;"><strong>Lv ${s.level}</strong><br><span style="color:#94a3b8; font-size:10px;">Hari ${s.day}</span></td>
                        <td style="font-size:12px; text-align:center; color:#374151;">${mainStat}</td>
                        <td style="font-size:12px; text-align:center;">
                            <span style="background:${reflCount > 0 ? '#dcfce7' : '#fee2e2'}; color:${reflCount > 0 ? '#16a34a' : '#dc2626'}; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:700;">${reflCount} entri</span>
                        </td>
                        <td><button class="bk-msg-btn" onclick="openBKMsgModal('${s.email}','${s.name.replace(/'/g,"\\'")}')">💬 Pesan</button></td>
                    </tr>`;
                }).join('');
            }

            function openBKMsgModal(email, name) {
                _bkMsgEmail = email;
                _bkMsgName  = name;
                document.getElementById('bk-msg-target-name').innerText = 'Kepada: ' + name;
                document.getElementById('bk-msg-text').value = '';
                document.getElementById('bk-msg-modal').style.display = 'flex';
            }

            function closeBKMsgModal() {
                document.getElementById('bk-msg-modal').style.display = 'none';
                _bkMsgEmail = '';
                _bkMsgName  = '';
            }

            function setBKTemplate(key) {
                const tpl = BK_TEMPLATES[key] || '';
                document.getElementById('bk-msg-text').value = tpl.replace('[NAMA]', _bkMsgName.split(' ')[0]);
            }

            async function sendBKMessage() {
                const text = document.getElementById('bk-msg-text').value.trim();
                if (!text) { alert('Tulis pesan terlebih dahulu!'); return; }
                if (!_bkMsgEmail) { alert('Email siswa tidak ditemukan!'); return; }

                const btn = document.querySelector('#bk-msg-modal .bk-msg-btn');
                if (btn) { btn.innerText = '⏳ Mengirim...'; btn.disabled = true; }

                try {
                    await DataService.init(true);
                    const msgPayload = {
                        text: text,
                        from: DataService.user ? DataService.user.name : 'Guru BK',
                        time: Date.now(),
                        read: false
                    };

                    if (DataService.mode === 'firebase' && db) {
                        // FIX: Simpan ke field 'inbox' (bukan saveData.messages)
                        // agar processInbox di sisi siswa bisa mendeteksi & notifikasi realtime
                        const docRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(_bkMsgEmail);
                        const doc = await docRef.get();
                        if (doc.exists) {
                            await docRef.update({
                                inbox: firebase.firestore.FieldValue.arrayUnion(msgPayload)
                            });
                            alert(`✅ Pesan berhasil dikirim ke ${_bkMsgName}!\n\nSiswa akan melihat notifikasi langsung di HP dalam game.`);
                        } else {
                            // Coba buat doc baru jika belum ada
                            await docRef.set({ inbox: [msgPayload] }, { merge: true });
                            alert(`✅ Pesan dikirim ke ${_bkMsgName}!`);
                        }
                    } else {
                        // FIX: Mode lokal - simpan ke inbox bukan saveData.messages
                        const dbLocal = DataService.getDB();
                        if (dbLocal[_bkMsgEmail]) {
                            if (!dbLocal[_bkMsgEmail].inbox) dbLocal[_bkMsgEmail].inbox = [];
                            dbLocal[_bkMsgEmail].inbox.push(msgPayload);
                            DataService.saveDB(dbLocal);
                            alert(`✅ Pesan dikirim ke ${_bkMsgName} (Mode Offline).`);
                        } else {
                            alert('❌ Data siswa tidak ditemukan di Local Storage!');
                        }
                    }
                    closeBKMsgModal();
                } catch (e) {
                    console.error('sendBKMessage error:', e);
                    alert('❌ Gagal mengirim pesan: ' + e.message);
                } finally {
                    if (btn) { btn.innerText = '📨 Kirim Pesan'; btn.disabled = false; }
                }
            }

            function exportBKReport() {
                const students = latestStudentData.filter(s => s.role === 'siswa' || !s.role);
                const now = new Date();
                const dateStr = `${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`;

                const BOM = '\uFEFF'; // UTF-8 BOM agar Excel baca karakter Indonesia
                let csv = BOM + `LAPORAN BIMBINGAN KONSELING - NUSANTARA ARSA\n`;
                csv += `Tanggal Export,${now.toLocaleDateString('id-ID',{dateStyle:'full'})}\n`;
                csv += `Total Siswa,${students.length}\n\n`;
                csv += `"No","Nama Siswa","Kelas / Detail","Jalur Karir","Level","Hari Dimainkan","Skor","Jurnal","Status Prioritas","Keterangan"\n`;

                students.forEach((s, i) => {
                    const sd = s.saveData || {};
                    const role = (sd.role && sd.role !== 'none') ? sd.role : 'none';
                    const cfg = BK_ROLE_CONFIG[role];
                    const level = sd.level || 1;
                    const day = sd.day || 1;
                    const score = calculateGrade(sd);
                    const reflections = (sd.reflections || []).length;

                    let priority = 'Baik';
                    let keterangan = 'Perkembangan baik';
                    if (role === 'none') { priority = 'MENDESAK'; keterangan = 'Belum memilih jalur karir'; }
                    else if (level < 3 && day > 10) { priority = 'MENDESAK'; keterangan = 'Progress lambat - perlu pendampingan'; }
                    else if (score < 40) { priority = 'PERHATIAN'; keterangan = 'Skor kompetensi rendah (' + score + ')'; }
                    else if (reflections === 0 && day > 5) { priority = 'PERHATIAN'; keterangan = 'Belum menulis jurnal refleksi'; }

                    csv += `"${i+1}","${s.name}","${s.details||'-'}","${cfg ? cfg.label.replace(/[⚔️🎓💼🏠❓]/g,'').trim() : 'Belum Pilih'}","${level}","${day}","${score}","${reflections} entri","${priority}","${keterangan}"\n`;
                });

                // Summary
                csv += `\n=== RINGKASAN DISTRIBUSI JALUR ===\n`;
                const counts = { worker: 0, student: 0, entrepreneur: 0, family: 0, none: 0 };
                students.forEach(s => {
                    const r = (s.saveData && s.saveData.role && s.saveData.role !== 'none') ? s.saveData.role : 'none';
                    counts[r] = (counts[r] || 0) + 1;
                });
                csv += `"Pekerja (Fighter)","${counts.worker} siswa (${Math.round(counts.worker/students.length*100)||0}%)"\n`;
                csv += `"Akademisi (Mage)","${counts.student} siswa (${Math.round(counts.student/students.length*100)||0}%)"\n`;
                csv += `"Wirausaha (Support)","${counts.entrepreneur} siswa (${Math.round(counts.entrepreneur/students.length*100)||0}%)"\n`;
                csv += `"Keluarga (Healer)","${counts.family} siswa (${Math.round(counts.family/students.length*100)||0}%)"\n`;
                csv += `"Belum Memilih","${counts.none} siswa (${Math.round(counts.none/students.length*100)||0}%)"\n`;

                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Laporan_BK_NusantaraArsa_${dateStr}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            }

            // ═══ END DASHBOARD BK ═══

            // ═══════════════════════════════════════════════════
            // FASE 3: GEMPITA SEASON — EVENT TAHUNAN
            // ═══════════════════════════════════════════════════

            function renderGempitaLeaderboard() {
                const students = (latestStudentData || []).filter(s => s.role === 'siswa' || !s.role);
                const tbody = document.getElementById('gempita-leaderboard-body');
                if (!tbody) return;

                // Filter params
                const filterName = (document.getElementById('gs-filter-name')?.value || '').toLowerCase();
                const filterStatus = document.getElementById('gs-filter-status')?.value || '';
                const filterKelas = (document.getElementById('gs-filter-kelas')?.value || '').toLowerCase();

                // Hitung skor setiap siswa — scoring per kategori role
                const ranked = students.map(s => {
                    const sd = s.saveData || {};
                    const ap = sd.achievementPoints || 0;
                    const portfolioCount = (sd.portfolio || []).length;
                    const journalCount = (sd.reflections || []).length;
                    const role = sd.role || 'none';
                    const jobLevel = sd.jobLevel || 1;
                    const bossRep = sd.bossReputation || 0;
                    const bizStat = sd.biz || 0;
                    const money = sd.money || 0;
                    const married = sd.married || false;
                    const spouseId = sd.spouseId || null;
                    const spouseLove = spouseId ? (sd.relationships?.[spouseId] || 0) : 0;
                    const reputation = sd.reputation || 0;

                    // ── SKOR & SYARAT PER KATEGORI ──
                    let gempitaScore = 0;
                    let eligible = false;
                    let metItems = [];
                    let totalItems = [];

                    if (role === 'student') {
                        // Akademisi: AP + portofolio*20 + jurnal*5
                        gempitaScore = ap + (portfolioCount * 20) + (journalCount * 5);
                        totalItems = ['Portfolio ≥1', 'Jurnal ≥5', 'AP ≥50'];
                        metItems = [portfolioCount >= 1, journalCount >= 5, ap >= 50];
                        eligible = metItems.every(Boolean);
                    } else if (role === 'worker') {
                        // Pekerja: AP + jobLevel*30 + rep*2
                        gempitaScore = ap + (jobLevel * 30) + (bossRep * 2);
                        totalItems = ['Karyawan Aktif', 'Level Jabatan ≥2', 'AP ≥30'];
                        metItems = [sd.jobStatus === 'employed', jobLevel >= 2, ap >= 30];
                        eligible = metItems.every(Boolean);
                    } else if (role === 'entrepreneur') {
                        // Wirausaha: AP + biz*10 + tabungan/1000
                        gempitaScore = ap + (bizStat * 10) + Math.floor(money / 1000);
                        totalItems = ['BIZ stat ≥10', 'Jurnal ≥3', 'AP ≥30'];
                        metItems = [bizStat >= 10, journalCount >= 3, ap >= 30];
                        eligible = metItems.every(Boolean);
                    } else if (role === 'family') {
                        // Keluarga: AP + cinta*2 + reputasi
                        gempitaScore = ap + (spouseLove * 2) + reputation;
                        totalItems = ['Sudah Menikah', 'Cinta ≥50', 'AP ≥30'];
                        metItems = [married, spouseLove >= 50, ap >= 30];
                        eligible = metItems.every(Boolean);
                    } else {
                        gempitaScore = ap;
                        totalItems = ['Pilih Role'];
                        metItems = [false];
                    }

                    const metCount = metItems.filter(Boolean).length;
                    let status = 'ineligible';
                    if (eligible) status = 'eligible';
                    else if (metCount >= Math.ceil(totalItems.length / 2)) status = 'partial';

                    return { s, sd, ap, portfolioCount, journalCount, role, status, gempitaScore, metCount, metItems, totalItems, eligible };
                }).sort((a, b) => b.gempitaScore - a.gempitaScore);

                // Update stat cards
                const eligible = ranked.filter(r => r.status === 'eligible');
                const totalPortfolio = ranked.reduce((sum, r) => sum + r.portfolioCount, 0);
                const totalJournalComplete = ranked.filter(r => r.journalCount >= 5).length;
                const avgAP = ranked.length > 0 ? Math.round(ranked.reduce((sum, r) => sum + r.ap, 0) / ranked.length) : 0;

                const el = (id, v) => { const e = document.getElementById(id); if (e) e.innerText = v; };
                el('gs-total-registered', eligible.length);
                el('gs-total-portfolio', totalPortfolio);
                el('gs-total-journal', totalJournalComplete);
                el('gs-avg-ap', avgAP);

                // Filter
                const filterRole = document.getElementById('gs-filter-role')?.value || '';
                const filtered = ranked.filter(r => {
                    const name = (r.s.name || '').toLowerCase();
                    const kelas = (r.s.details || '').toLowerCase();
                    if (filterName && !name.includes(filterName)) return false;
                    if (filterKelas && !kelas.includes(filterKelas)) return false;
                    if (filterStatus && r.status !== filterStatus) return false;
                    if (filterRole && r.role !== filterRole) return false;
                    return true;
                });

                tbody.innerHTML = '';

                if (filtered.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#94a3b8; padding:30px; font-size:12px;">Tidak ada siswa yang sesuai filter.</td></tr>`;
                    return;
                }

                // Medal colors for top 3
                const medals = ['🥇', '🥈', '🥉'];
                const rankColors = ['linear-gradient(135deg,#fef9c3,#fde68a)', 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', 'linear-gradient(135deg,#fef3f2,#fde8e8)'];

                filtered.forEach((r, idx) => {
                    // Global rank in full list
                    const globalRank = ranked.indexOf(r) + 1;
                    const medal = globalRank <= 3 ? medals[globalRank - 1] : `#${globalRank}`;
                    const rowBg = globalRank <= 3 ? rankColors[globalRank - 1] : '';

                    const roleLabel = {
                        worker: '⚔️ Pekerja', student: '🎓 Akademisi',
                        entrepreneur: '💼 Wirausaha', family: '🏠 Keluarga', none: '❓ Belum'
                    }[r.role] || '❓ Belum';

                    const statusBadge = {
                        eligible: `<span style="background:#dcfce7; color:#166534; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; white-space:nowrap;">✅ Eligible</span>`,
                        partial: `<span style="background:#fef9c3; color:#854d0e; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; white-space:nowrap;">⚠️ Hampir</span>`,
                        ineligible: `<span style="background:#fee2e2; color:#991b1b; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; white-space:nowrap;">❌ Belum</span>`
                    }[r.status];

                    // Indikator per syarat (per role)
                    const reqIcons = r.metItems.map((met, i) =>
                        (met ? '🟢' : '🔴') + ' ' + r.totalItems[i]
                    ).join(' | ');

                    const tr = document.createElement('tr');
                    if (rowBg) tr.style.background = rowBg;
                    tr.innerHTML = `
                        <td style="text-align:center; font-size:16px; font-family:'Fredoka'; font-weight:700;">${medal}</td>
                        <td>
                            <div style="font-weight:700; font-size:12px; color:#1e293b;">${r.s.name || 'Anonim'}</div>
                            <div style="font-size:10px; color:#64748b; margin-top:1px; font-family:monospace;">${reqIcons}</div>
                        </td>
                        <td style="font-size:11px; color:#475569;">${r.s.details || '-'}</td>
                        <td style="text-align:center; font-size:11px;">${roleLabel}</td>
                        <td style="text-align:center;">
                            <span style="font-size:16px; font-weight:800; color:${r.ap >= 50 ? '#d97706' : '#94a3b8'}; font-family:'Fredoka';">${r.ap}</span>
                            <div style="font-size:9px; color:#94a3b8;">AP</div>
                        </td>
                        <td style="text-align:center;">
                            <span style="font-size:16px; font-weight:700; color:${r.portfolioCount >= 1 ? '#7c3aed' : '#94a3b8'}; font-family:'Fredoka';">${r.portfolioCount}</span>
                            <div style="font-size:9px; color:#94a3b8;">karya</div>
                        </td>
                        <td style="text-align:center;">
                            <span style="font-size:16px; font-weight:700; color:${r.journalCount >= 5 ? '#059669' : '#94a3b8'}; font-family:'Fredoka';">${r.journalCount}</span>
                            <div style="font-size:9px; color:#94a3b8;">entri</div>
                        </td>
                        <td style="text-align:center;">${statusBadge}</td>
                    `;
                    tbody.appendChild(tr);
                });

                // Update countdown timer
                updateGempitaCountdown();
            }

            function updateGempitaCountdown() {
                // Event Gempita: musim panas (Juli - Agustus) setiap tahun
                const now = new Date();
                const currentYear = now.getFullYear();

                // Deadline pendaftaran: 31 Agustus tahun ini atau tahun depan
                let deadline = new Date(`${currentYear}-08-31T23:59:59`);
                if (now > deadline) deadline = new Date(`${currentYear + 1}-08-31T23:59:59`);

                const diff = deadline - now;
                if (diff <= 0) {
                    const el = document.getElementById('gempita-countdown');
                    if (el) el.innerText = 'Sudah Lewat';
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                const el = document.getElementById('gempita-countdown');
                if (el) el.innerText = `${days}h ${hours}j ${minutes}m`;

                const boxEl = document.getElementById('gempita-countdown-box');
                const labelEl = boxEl?.querySelector('div:first-child');
                if (labelEl) labelEl.innerText = days <= 30 ? '⚠️ SEGERA DITUTUP!' : '⏳ PENDAFTARAN DITUTUP';
            }

            function exportGempitaReport() {
                const students = (latestStudentData || []).filter(s => s.role === 'siswa' || !s.role);
                const now = new Date();
                const dateStr = `${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`;

                const BOM = '\uFEFF';
                let csv = BOM + `LAPORAN GEMPITA SEASON - NUSANTARA ARSA\n`;
                csv += `Tanggal Export,${now.toLocaleDateString('id-ID', { dateStyle: 'full' })}\n`;
                csv += `Total Siswa Terdaftar,${students.length}\n\n`;
                csv += `"Rank","Nama Siswa","Kelas","Role","AP (Achievement Points)","Portofolio (Karya)","Jurnal (Entri)","Skor Gempita","Status","Syarat: Portfolio","Syarat: Jurnal 5+","Syarat: AP 50+","Syarat: Akademisi"\n`;

                const ranked = students.map(s => {
                    const sd = s.saveData || {};
                    const ap = sd.achievementPoints || 0;
                    const pc = (sd.portfolio || []).length;
                    const jc = (sd.reflections || []).length;
                    const role = sd.role || 'none';
                    const isAkademisi = role === 'student';
                    const metCount = [pc >= 1, jc >= 5, ap >= 50, isAkademisi].filter(Boolean).length;
                    let status = metCount === 4 ? 'Eligible' : metCount >= 2 ? 'Hampir Memenuhi' : 'Belum Memenuhi';
                    const score = ap + (pc * 20) + (jc * 5);
                    return { s, sd, ap, pc, jc, role, isAkademisi, status, score };
                }).sort((a, b) => b.score - a.score);

                ranked.forEach((r, i) => {
                    const roleLabel = { worker: 'Pekerja', student: 'Akademisi', entrepreneur: 'Wirausaha', family: 'Keluarga', none: 'Belum' }[r.role] || 'Belum';
                    csv += `"${i+1}","${r.s.name}","${r.s.details||'-'}","${roleLabel}","${r.ap}","${r.pc}","${r.jc}","${r.score}","${r.status}","${r.pc>=1?'Ya':'Tidak'}","${r.jc>=5?'Ya':'Tidak'}","${r.ap>=50?'Ya':'Tidak'}","${r.isAkademisi?'Ya':'Tidak'}"\n`;
                });

                const eligible = ranked.filter(r => r.status === 'Eligible');
                csv += `\n=== RINGKASAN ===\n`;
                csv += `"Siswa Eligible Gempita","${eligible.length} siswa"\n`;
                csv += `"Total Karya Portofolio","${ranked.reduce((s,r)=>s+r.pc,0)} karya"\n`;
                csv += `"Rata-rata AP Kelas","${ranked.length > 0 ? Math.round(ranked.reduce((s,r)=>s+r.ap,0)/ranked.length) : 0} AP"\n`;

                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Laporan_GempitaSeason_NusantaraArsa_${dateStr}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);

                showToast && showToast('📥 Laporan Gempita berhasil diunduh!');
            }

            // Filter Gempita by role tab button
            function filterGempitaRole(role) {
                const sel = document.getElementById('gs-filter-role');
                if (sel) { sel.value = role; }
                // Highlight active button
                ['student','worker','entrepreneur','family'].forEach(r => {
                    const btn = document.getElementById('gbtn-' + r);
                    if (!btn) return;
                    if (r === role) {
                        btn.style.opacity = '1'; btn.style.transform = 'scale(1.05)'; btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    } else {
                        btn.style.opacity = '0.55'; btn.style.transform = 'scale(1)'; btn.style.boxShadow = 'none';
                    }
                });
                renderGempitaLeaderboard();
            }

            // ═══ END GEMPITA SEASON ═══

            // UPDATE: ASYNC EXPORT
            function exportToCSV() { // Hapus async
                const students = latestStudentData; // Gunakan Cache
                let csv = "Nama,Kelas,Role,Hari,Uang,Nilai Akhir\n";
                students.forEach(s => {
                    const sd = s.saveData || {};
                    csv += `${s.name},${s.details},${sd.role},${sd.day},${sd.money},${calculateGrade(sd)}\n`;
                });

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Nusantara_Arsa_Data.csv';
                a.click();
            }

            /** ENGINE & CONFIG */
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');

            /* --- LOGIKA DUEL SUIT (BARU) --- */
            let duelState = {
                active: false,
                playerHP: 3,
                rivalHP: 3,
                rivalName: '',
                rivalId: ''
            };

            function startDuel(npc) {
                toggleFullScreen(); // <--- BARIS BARU: Paksa layar penuh di awal

                // 1. Reset State
                duelState.active = true;
                duelState.playerHP = 3;
                duelState.rivalHP = 3;
                duelState.rivalName = npc.name;
                duelState.rivalId = npc.id;

                // 2. Setup Tampilan
                const modal = document.getElementById('duel-minigame');
                const pImg = document.getElementById('duel-p-img');
                const rImg = document.getElementById('duel-r-img');
                const rName = document.getElementById('duel-r-name');

                modal.style.display = 'flex';

                // Load Gambar
                const gender = STATE.player.gender || 'boy';
                pImg.src = gender === 'boy' ? 'images/boy.png' : 'images/girl.png';
                rImg.src = npc.imgSrc || 'images/rival_boy.png';
                rName.innerText = npc.name ? npc.name.split(' ')[0].toUpperCase() : 'RIVAL';

                document.getElementById('duel-status').innerHTML = "Ronde 1: Pilih langkahmu!<br><span style='color:#94a3b8; font-size:12px;'>(Batu mengalahkan Gunting, Gunting mengalahkan Kertas, Kertas mengalahkan Batu)</span>";
                updateDuelUI();

                if (typeof STATE !== 'undefined') STATE.screen = 'minigame';
            }

            function handleDuelMove(pMove) {
                if (!duelState.active) return;

                const moves = ['batu', 'gunting', 'kertas'];
                const rMove = moves[Math.floor(Math.random() * moves.length)];
                let result = 'draw';
                let msg = "";

                if (pMove === rMove) {
                    result = 'draw';
                    msg = "<span style='color:#fbbf24'>Seri! Tidak ada yang terluka.</span>";
                } else if (
                    (pMove === 'batu' && rMove === 'gunting') ||
                    (pMove === 'gunting' && rMove === 'kertas') ||
                    (pMove === 'kertas' && rMove === 'batu')
                ) {
                    result = 'win';
                    duelState.rivalHP--;
                    msg = "<span style='color:#4ade80'>Kamu Menang! Lawan terluka.</span>";
                } else {
                    result = 'lose';
                    duelState.playerHP--;
                    msg = "<span style='color:#ef4444'>Kamu Kalah! Terkena serangan.</span>";
                }

                const icons = { 'batu': '✊', 'gunting': '✌️', 'kertas': '✋' };
                document.getElementById('duel-status').innerHTML = `Kamu: ${icons[pMove]} <b style="margin:0 10px;">VS</b> Rival: ${icons[rMove]}<br>${msg}`;
                updateDuelUI();

                if (duelState.playerHP <= 0 || duelState.rivalHP <= 0) {
                    setTimeout(() => finishDuel(duelState.playerHP > 0), 1000);
                }
            }

            function updateDuelUI() {
                const pPct = (duelState.playerHP / 3) * 100;
                const rPct = (duelState.rivalHP / 3) * 100;
                document.getElementById('duel-p-hp').style.width = pPct + '%';
                document.getElementById('duel-r-hp').style.width = rPct + '%';
            }

            function finishDuel(isWin) {
                // 1. Sembunyikan Arena Duel
                document.getElementById('duel-minigame').style.display = 'none';

                // 2. Siapkan Pesan Menang/Kalah
                let title, msg;
                let pImg = STATE.player.gender === 'boy' ? 'images/boy.png' : 'images/girl.png';

                if (isWin) {
                    title = "MENANG DUEL! 🏆";
                    msg = "Hebat! Kamu berhasil mengalahkan rivalmu.\n\nHadiah:\n+2 Reputasi\n+500 Gold";
                } else {
                    title = "KALAH DUEL... 🤕";
                    msg = "Sayang sekali, strategimu terbaca.\n\nHukuman:\n-20 Energi (Kelelahan)";
                }

                // 3. Tampilkan Dialog Hasil (PENTING: Tombol di sini yang memicu Fullscreen)
                showDialogue(title, msg, [{
                    text: "Lanjut Main (Klik Disini) >>",
                    action: () => {
                        // Update State Game
                        duelState.active = false;
                        STATE.screen = 'play';

                        // Berikan Hadiah/Hukuman
                        if (isWin) {
                            STATE.player.reputation += 2;
                            STATE.player.money += 500;
                            showToast("Hadiah Diterima!");
                        } else {
                            STATE.player.energy = Math.max(0, STATE.player.energy - 20);
                        }

                        // Tutup Dialog & PAKSA FULLSCREEN
                        closeDialogue();
                        toggleFullScreen(); // <--- INI KUNCINYA
                    }
                }], pImg);
            }


            function quitDuel() {
                document.getElementById('duel-minigame').style.display = 'none';
                duelState.active = false;
                STATE.screen = 'play';
                toggleFullScreen(); // Paksa fullscreen saat keluar
            }


