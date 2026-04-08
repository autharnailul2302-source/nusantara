// ══════════════════════════════════════════════════════════════
// Jurnal Refleksi + Quest Media
// File: js/16-jurnal-refleksi.js
// ══════════════════════════════════════════════════════════════
            // SISTEM JURNAL BERBASIS ROLE & HARI
            // Pertanyaan berputar tiap hari, unik per jalur karir
            // =====================================================
            const REFLECTION_QUESTIONS_BY_ROLE = {
                none: [
                    "Hari pertamamu di Pulau Arsa! Apa yang paling membuatmu penasaran?",
                    "Kamu belum memilih jalur karir. Setelah menjelajah, jalur apa yang paling menarik bagimu — Pekerja, Akademisi, Wirausaha, atau Keluarga?",
                    "Coba ceritakan, warga mana yang sudah kamu temui hari ini dan apa yang kamu pelajari dari mereka?",
                    "Menurutmu, apa perbedaan antara menjadi Pekerja dan Wirausaha di dunia nyata?",
                    "Kamu masih di awal perjalanan. Apa rencana besarmu di Pulau Arsa?",
                    "Kalau kamu bisa memilih hidup idealmu di dunia nyata, itu seperti apa?",
                    "Sudahkah kamu menemui Mentor Budi? Apa nasehat yang paling berkesan darinya?",
                ],
                worker: [
                    "Hari ini kamu bekerja sebagai pekerja. Apa tugas terberat yang kamu hadapi di shift hari ini?",
                    "Seorang pekerja yang hebat punya disiplin tinggi. Apakah kamu sudah masuk shift tepat waktu hari ini? Ceritakan!",
                    "Bagaimana hubunganmu dengan Bos? Apakah reputasimu sudah meningkat? Apa yang kamu lakukan untuk itu?",
                    "Sebagai pekerja, gaji adalah sumber utama penghasilanmu. Bagaimana kamu mengelola keuanganmu hari ini?",
                    "Apa pekerjaan impianmu di dunia nyata? Apakah jalur Pekerja di game ini mencerminkan pekerjaan itu?",
                    "Pernah merasa lelah dan ingin berhenti bekerja hari ini? Bagaimana kamu mengatasinya?",
                    "Jika kamu adalah manajer toko, apa kebijakan pertama yang kamu terapkan untuk karyawanmu?",
                    "Hari Ahad adalah hari liburmu. Apa yang kamu lakukan untuk mengisi waktu istirahat dengan produktif?",
                    "STR (Kekuatan) adalah stat utama jalur Pekerja. Bagaimana cara kamu meningkatkannya hari ini?",
                    "Apakah ada rekan kerja yang membantumu hari ini? Ceritakan pengalamannya!",
                    "Menurutmu, apa nilai penting yang dipelajari dari menjadi seorang pekerja yang jujur dan tekun?",
                    "Hari ini kamu mendapat gaji. Untuk apa rencana penggunaan uangmu?",
                    "Bagaimana rasanya bekerja keras seharian? Apa yang membuatmu semangat terus?",
                    "Skill apa yang ingin kamu kuasai sebagai pekerja profesional di dunia nyata?",
                ],
                student: [
                    "Hari ini kamu hadir kuliah. Materi apa yang paling menarik yang kamu pelajari dari Dosen?",
                    "Seorang akademisi selalu haus ilmu. Apa buku atau referensi yang ingin kamu baca minggu ini?",
                    "Bagaimana cara kamu menyeimbangkan belajar dan beristirahat? Apakah energimu masih cukup?",
                    "Nilai INT (Kecerdasan) mencerminkan ilmu yang kamu serap. Seberapa banyak kamu belajar hari ini?",
                    "Kalau kamu bisa memilih jurusan di dunia nyata, kamu pilih apa? Mengapa?",
                    "Perpustakaan adalah surganya Akademisi. Apa yang kamu temukan dari riset di perpustakaan hari ini?",
                    "Pernah kesulitan memahami materi kuliah? Bagaimana strategi belajarmu untuk mengatasinya?",
                    "Hari ini weekend, kampus libur. Bagaimana kamu memanfaatkan waktu bebas untuk tetap produktif?",
                    "Apa cita-citamu setelah lulus nanti? Bagaimana game ini membantumu memahami perjalanan itu?",
                    "Apakah kamu sudah mulai tesis? Apa topik yang ingin kamu angkat jika bisa memilih?",
                    "Bagaimana hubunganmu dengan teman-teman di kampus? Apakah kamu sudah banyak bergaul?",
                    "Jelaskan satu hal penting yang kamu pelajari hari ini — baik dari game maupun dari pelajaran sekolahmu!",
                    "Sebagai akademisi, integritas adalah segalanya. Apa keputusan jujur yang kamu buat hari ini?",
                    "Apa tantangan terbesar menjadi seorang pelajar di game ini? Bagaimana kamu mengatasinya?",
                ],
                entrepreneur: [
                    "Hari ini kamu menjalankan bisnis. Apa transaksi atau keputusan dagang paling penting yang kamu buat?",
                    "Seorang wirausaha harus jeli melihat peluang. Apakah ada tren viral di pasar hari ini? Apa yang kamu lakukan?",
                    "Bagaimana kondisi stok barang dagangan kamu? Apakah ada yang perlu segera dibeli atau dijual?",
                    "BIZ (Kemampuan Bisnis) adalah kunci jalurmu. Apa aktivitas yang paling meningkatkan BIZ hari ini?",
                    "Seorang entrepreneur sukses punya mental pantang menyerah. Kegagalan apa yang kamu hadapi hari ini dan pelajaran apa yang kamu ambil?",
                    "Berapa omset yang berhasil kamu kumpulkan hari ini? Apakah sudah mencapai target harianmu?",
                    "Jika kamu bisa membuka bisnis nyata, bisnis apa yang ingin kamu dirikan? Mengapa?",
                    "Strategi apa yang kamu pakai untuk bersaing dengan pedagang lain di pasar?",
                    "Apa perbedaan antara wirausahawan yang sukses dan yang gagal menurutmu?",
                    "Bagaimana kamu mengelola risiko dalam berdagang hari ini? Apakah ada keputusan berisiko yang kamu ambil?",
                    "Rumah adalah aset terpenting Wirausaha. Bagaimana progres upgrade rumahmu sejauh ini?",
                    "Ceritakan satu ide bisnis kreatif yang terlintas di benakmu hari ini!",
                    "Apakah kamu sudah memanfaatkan sistem barter atau investasi di game? Bagaimana hasilnya?",
                    "Apa nilai karakter wirausahawan yang paling ingin kamu miliki di kehidupan nyata?",
                ],
                family: [
                    "Hari ini kamu menjalani peran keluarga. Siapa warga yang paling dekat dengan hatimu di Pulau Arsa?",
                    "Reputasi adalah kunci jalur Keluarga. Apa kebaikan yang kamu lakukan untuk warga desa hari ini?",
                    "Hubungan antar manusia butuh waktu dan perhatian. Sudahkah kamu menyapa 2 orang berbeda hari ini?",
                    "Apa artinya sebuah keluarga yang bahagia bagimu? Apakah sudah mendekati gambaran itu di game?",
                    "Apakah kamu sudah mengunjungi Balai Pernikahan dan menemui Pak Modin? Ceritakan pengalamannya!",
                    "REP (Reputasi) mencerminkan citra sosialmu. Apa yang membuatmu bangga hari ini?",
                    "Hidup bermasyarakat penuh dengan kompromi. Apakah ada konflik atau tantangan sosial yang kamu hadapi hari ini?",
                    "Jika kamu sudah menikah di game, apa hal yang paling berkesan dari perjalanan membangun keluarga itu?",
                    "Bagaimana kamu menjaga keseimbangan antara kebutuhan diri sendiri dan orang-orang sekitarmu?",
                    "Siapa tokoh panutan dalam hidupmu? Apakah ada warga desa yang mengingatkanmu pada tokoh itu?",
                    "Apa impian sederhana yang paling ingin kamu wujudkan bersama keluargamu di masa depan?",
                    "Bagaimana caramu menunjukkan kepedulian kepada orang lain, baik di game maupun di kehidupan nyata?",
                    "Apa pelajaran tentang tanggung jawab yang kamu dapatkan dari jalur Keluarga hari ini?",
                    "Ceritakan momen paling mengharukan yang kamu alami bersama warga desa hari ini!",
                ],
            };

            // Fungsi untuk mendapatkan pertanyaan jurnal sesuai role dan hari
            function getJournalQuestion() {
                const role = (STATE.player && STATE.player.role) ? STATE.player.role : 'none';
                const day = STATE.day || 1;
                const pool = REFLECTION_QUESTIONS_BY_ROLE[role] || REFLECTION_QUESTIONS_BY_ROLE['none'];
                // Deterministik: hari ke-N pakai pertanyaan ke-(N-1) mod panjang pool
                // Sehingga tiap hari beda, tidak acak, tapi berputar
                return pool[(day - 1) % pool.length];
            }

            // Fungsi untuk mendapatkan hint role di jurnal
            function getJournalHint() {
                const role = (STATE.player && STATE.player.role) ? STATE.player.role : 'none';
                const p = STATE.player;
                const hints = {
                    none: "💡 Kamu belum memilih jalur! Temui <b>Mentor Budi</b> di desa, lalu tidur di rumah untuk memilih jalurmu.",
                    worker: p && p.jobStatus === 'unemployed'
                        ? "💡 Kamu belum bekerja! Pergi ke <b>Toko Merchant (Selatan)</b> dan lamar kerja ke Bos."
                        : "💡 Jangan lupa masuk <b>shift kerja (08:00)</b> dan tingkatkan reputasi ke Bos untuk naik jabatan!",
                    student: p && !p.major
                        ? "💡 Kamu belum mendaftar kuliah! Pergi ke <b>Gedung Kampus (Timur)</b> dan pilih jurusanmu."
                        : "💡 Hadir <b>kuliah jam 08:00</b>, kunjungi <b>Perpustakaan</b>, dan belajar mandiri untuk naikkan INT!",
                    entrepreneur: "💡 Pantau tren viral di <b>Sosmed HP</b>, beli murah di <b>Pedagang</b>, jual mahal ke <b>Merchant</b> untuk cuan besar!",
                    family: p && p.activeQuest === 'meet_modin'
                        ? "💡 Quest aktif: Pergi ke <b>Balai Pernikahan (Selatan)</b> dan temui <b>Pak Modin</b>!"
                        : "💡 Perbanyak interaksi dengan warga desa untuk naikkan REP, dan jaga hubungan agar impian berkeluarga terwujud!",
                };
                return hints[role] || hints['none'];
            }

            // JUGA: Fallback array lama (untuk kompatibilitas kode lain yang mungkin mereferensinya)
            const REFLECTION_QUESTIONS = REFLECTION_QUESTIONS_BY_ROLE['none'];

            // --- NEW FUNCTION: BELAJAR MANDIRI ---
            function openSelfStudyMenu() {
                const subjects = STATE.player.learnedSubjects || [];

                if (subjects.length === 0) {
                    showDialogue("CATATAN KOSONG",
                        "Kamu belum memiliki catatan materi kuliah.\n\n**Hadir kuliah** (Jam 08:00 - 14:00) untuk mendapatkan ilmu yang bisa dipelajari ulang di sini.",
                        [{ text: "Baiklah", action: closeDialogue }],
                        'images/buku.png'
                    );
                    return;
                }

                // Buat daftar opsi materi (Ambil 3 terakhir biar gak kepanjangan)
                const opts = [];
                // Reverse agar materi terbaru di atas
                const recentSubjects = [...subjects].reverse().slice(0, 3);

                recentSubjects.forEach(sub => {
                    opts.push({
                        text: `📖 ${sub.t}`,
                        action: () => {
                            if (STATE.player.energy >= 15) {
                                STATE.player.energy -= 15;
                                STATE.player.int += 1; // Reward kecil
                                gainExp(10);
                                STATE.player.dailySelfStudy = (STATE.player.dailySelfStudy || 0) + 1; // Track bonus quest

                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                createParticle(STATE.player.x, STATE.player.y, '#3b82f6');

                                showDialogue(`REVIEW: ${sub.t}`,
                                    `"${sub.c}"\n\n(Kamu mempelajari ulang materi ini. Pemahamanmu semakin dalam!)`,
                                    [{ text: "Selesai Belajar", action: closeDialogue }],
                                    'images/buku.png'
                                );
                            } else {
                                showToast("Energi tidak cukup (Butuh 15)!");
                            }
                        }
                    });
                });

                opts.push({ text: "Kembali", action: closeDialogue });

                showDialogue("BELAJAR MANDIRI", "Pilih materi untuk dipelajari ulang (INT +1, EXP +10):", opts, 'images/buku.png');
            }

            // =====================================================================
            // FASE 2 — QUEST MEDIA PEMBELAJARAN & PORTOFOLIO
            // =====================================================================

            const MEDIA_TOPICS = [
                { id: 'fisika', label: '⚛️ Fisika', emoji: '⚛️', desc: 'Gerak, gaya, energi, dan materi' },
                { id: 'biologi', label: '🌿 Biologi', emoji: '🌿', desc: 'Sel, ekosistem, evolusi' },
                { id: 'matematika', label: '📐 Matematika', emoji: '📐', desc: 'Aljabar, geometri, statistika' },
                { id: 'sejarah', label: '🏛️ Sejarah', emoji: '🏛️', desc: 'Peradaban, revolusi, tokoh' },
                { id: 'bahasa', label: '📝 Bahasa Indonesia', emoji: '📝', desc: 'Sastra, teks, keterampilan berbahasa' },
                { id: 'tkj', label: '💻 Teknik Komputer', emoji: '💻', desc: 'Jaringan, hardware, software' },
                { id: 'ekonomi', label: '💹 Ekonomi', emoji: '💹', desc: 'Pasar, produksi, konsumsi' },
            ];

            const MEDIA_FORMATS = [
                { id: 'video', label: '🎬 Video Animasi', emoji: '🎬', apBonus: 30, intBonus: 2, desc: 'Visual & audio menarik, cocok untuk semua gaya belajar' },
                { id: 'poster', label: '🖼️ Poster Infografis', emoji: '🖼️', apBonus: 20, intBonus: 1, desc: 'Ringkas, mudah dipasang, kaya data visual' },
                { id: 'game', label: '🎮 Game Edukasi', emoji: '🎮', apBonus: 40, intBonus: 3, desc: 'Interaktif dan engaging, tingkat kesulitan tinggi' },
                { id: 'kuis', label: '❓ Kuis Interaktif', emoji: '❓', apBonus: 25, intBonus: 2, desc: 'Evaluasi pemahaman siswa secara langsung' },
                { id: 'modul', label: '📚 Modul Digital', emoji: '📚', apBonus: 20, intBonus: 1, desc: 'Teks lengkap dan terstruktur, bisa diunduh' },
            ];

            // State sementara untuk proses pembuatan media
            let _mediaInProgress = null;

            function openMediaLearningQuest() {
                const p = STATE.player;
                if (p.energy < 20) {
                    showDialogue("TERLALU LELAH", "Kamu butuh minimal 20 Energi untuk membuat media pembelajaran.\n\nIstirahatlah dulu!", [{ text: "Baik", action: closeDialogue }], 'images/buku.png');
                    return;
                }

                // Cek apakah sudah ada karya hari ini
                const today = STATE.day || 1;
                const alreadyToday = (p.portfolioItems || []).some(item => item.day === today);
                if (alreadyToday) {
                    showDialogue("SUDAH CUKUP", `Kamu sudah membuat media pembelajaran hari ini (Hari ${today}).\n\nKembali besok untuk membuat karya baru! 💪`, [{ text: "Oke", action: closeDialogue }], 'images/buku.png');
                    return;
                }

                // Langkah 1: Pilih Topik
                const topicOpts = MEDIA_TOPICS.map(t => ({
                    text: `${t.label}`,
                    action: () => {
                        _mediaInProgress = { topicId: t.id, topicLabel: t.label, topicEmoji: t.emoji };
                        chooseMediaFormat();
                    }
                }));
                topicOpts.push({ text: "❌ Batal", action: closeDialogue });

                showDialogue("🎨 BUAT MEDIA PEMBELAJARAN", "Langkah 1 dari 3: Pilih TOPIK yang ingin kamu buat medianya!", topicOpts, 'images/buku.png');
            }

            function chooseMediaFormat() {
                const formatOpts = MEDIA_FORMATS.map(f => ({
                    text: `${f.label} (+${f.apBonus} AP, INT +${f.intBonus})`,
                    action: () => {
                        _mediaInProgress.formatId    = f.id;
                        _mediaInProgress.formatLabel = f.label;
                        _mediaInProgress.formatEmoji = f.emoji;
                        _mediaInProgress.apBonus     = f.apBonus;
                        _mediaInProgress.intBonus    = f.intBonus;
                        choosePresentationTarget();
                    }
                }));
                formatOpts.push({ text: "⬅ Kembali", action: openMediaLearningQuest });

                showDialogue("🎨 BUAT MEDIA PEMBELAJARAN",
                    `Topik: ${_mediaInProgress.topicLabel}\n\nLangkah 2 dari 3: Pilih FORMAT media yang akan kamu buat!`,
                    formatOpts, 'images/buku.png');
            }

            function choosePresentationTarget() {
                const targets = [
                    { id: 'kelas', label: '👩‍🏫 Presentasi ke Kelas',   desc: 'Tampilkan ke teman sekelas di kampus' },
                    { id: 'dosen', label: '🎓 Presentasi ke Dosen',    desc: 'Dapatkan penilaian dari Dosen pembimbing' },
                    { id: 'lomba', label: '🏆 Ikutkan ke Kompetisi',   desc: 'Submit ke Gempita Awards (AP x2!)' },
                    { id: 'online', label: '🌐 Publikasi Online',       desc: 'Share ke sosmed, raih penonton luas' },
                ];

                const targetOpts = targets.map(t => ({
                    text: `${t.label}`,
                    action: () => {
                        _mediaInProgress.targetId    = t.id;
                        _mediaInProgress.targetLabel = t.label;
                        if (t.id === 'lomba') _mediaInProgress.apBonus = Math.floor(_mediaInProgress.apBonus * 2); // x2 AP untuk lomba
                        finalizeMediaCreation();
                    }
                }));
                targetOpts.push({ text: "⬅ Kembali", action: chooseMediaFormat });

                showDialogue("🎨 BUAT MEDIA PEMBELAJARAN",
                    `Topik: ${_mediaInProgress.topicLabel}\nFormat: ${_mediaInProgress.formatLabel}\n\nLangkah 3 dari 3: Untuk siapa media ini kamu presentasikan?`,
                    targetOpts, 'images/buku.png');
            }

            function finalizeMediaCreation() {
                const p = STATE.player;
                const m = _mediaInProgress;

                // Kurangi energi
                p.energy = Math.max(0, p.energy - 20);
                // Beri reward
                p.int = (p.int || 0) + m.intBonus;
                p.achievementPoints = (p.achievementPoints || 0) + m.apBonus;
                gainExp(30);

                // Simpan ke portofolio
                const karya = {
                    id:          `karya_${Date.now()}`,
                    day:         STATE.day || 1,
                    date:        new Date().toISOString(),
                    topicId:     m.topicId,
                    topicLabel:  m.topicLabel,
                    topicEmoji:  m.topicEmoji,
                    formatId:    m.formatId,
                    formatLabel: m.formatLabel,
                    formatEmoji: m.formatEmoji,
                    targetId:    m.targetId,
                    targetLabel: m.targetLabel,
                    apEarned:    m.apBonus,
                    intEarned:   m.intBonus,
                    teacherNote: '' // akan diisi guru dari dashboard
                };

                if (!p.portfolioItems) p.portfolioItems = [];
                p.portfolioItems.push(karya);
                _mediaInProgress = null;

                // Track bonus quest (reuse dailySelfStudy slot atau buat field baru)
                p.dailyMediaCreation = (p.dailyMediaCreation || 0) + 1;

                // Efek visual
                if (typeof AudioService !== 'undefined') AudioService.playSFX('levelup');
                createParticle(p.x, p.y, '#8b5cf6');
                createParticle(p.x + 10, p.y - 10, '#fbbf24');

                const isLomba = karya.targetId === 'lomba';
                showDialogue("🏆 KARYA SELESAI!",
                    `✅ Media pembelajaran berhasil dibuat!\n\n${karya.topicEmoji} Topik: ${karya.topicLabel}\n${karya.formatEmoji} Format: ${karya.formatLabel}\n🎯 Ditujukan untuk: ${karya.targetLabel}\n\n` +
                    `🏅 +${karya.apEarned} Poin Prestasi\n🧠 INT +${karya.intEarned}\n⭐ EXP +30\n\n` +
                    (isLomba ? `🌟 BONUS LOMBA: AP dikalikan 2!\nKarya ini siap diajukan ke Gempita Awards!` : `Karya tersimpan di Portofoliomu. Guru dapat melihat dan menilainya!`),
                    [
                        { text: "📁 Lihat Portofolio", action: () => { closeDialogue(); openPortfolioModal(); } },
                        { text: "Lanjutkan Bermain", action: closeDialogue }
                    ],
                    'images/buku.png'
                );

                // Autosave
                if (typeof DataService !== 'undefined') DataService.save(STATE.player);
            }

            // --- AP SUMMARY: Universal untuk semua role ---
            function openAPSummary() {
                const p = STATE.player;
                const totalAP = p.achievementPoints || 0;
                const roleLabel = { student: '🎓 Pelajar', worker: '👷 Pekerja', entrepreneur: '💼 Pengusaha', family: '🏠 Keluarga' }[p.role] || '👤 ' + (p.role || 'Pemain');

                // Hitung sumber AP berdasarkan role
                let detail = '';
                if (p.role === 'student') {
                    const karya = (p.portfolioItems || []).length;
                    const jurnal = (p.reflections || []).length;
                    detail = `📚 Karya Portofolio: ${karya}\n📝 Jurnal Refleksi: ${jurnal}`;
                } else if (p.role === 'worker') {
                    detail = `💼 Level Kerja: ${p.jobLevel || 1}\n⭐ Total AP dari pekerjaan & kompetisi`;
                } else if (p.role === 'entrepreneur') {
                    detail = `🏪 Bisnis Aktif: ${p.businessOwned ? 'Ya' : 'Belum ada'}\n⭐ AP dari omzet & event viral`;
                } else {
                    detail = `⭐ AP dari berbagai aktivitas game`;
                }

                // Hitung "tier" prestasi
                let tier = '🥉 Pemula';
                if (totalAP >= 500) tier = '🥇 Master';
                else if (totalAP >= 200) tier = '🥈 Mahir';
                else if (totalAP >= 50) tier = '🏅 Berkembang';

                const actions = [];
                if (p.role === 'student') {
                    actions.push({ text: '📁 Lihat Portofolio', action: () => { closeDialogue(); openPortfolioModal(); } });
                }
                actions.push({ text: 'Tutup', action: closeDialogue });

                showDialogue(`🏅 POIN PRESTASI (AP)`,
                    `Role: ${roleLabel}\n🏅 Total AP: ${totalAP}\n🏆 Peringkat: ${tier}\n\n${detail}\n\n💡 AP digunakan untuk membeli Pet dan naik peringkat leaderboard!`,
                    actions,
                    'images/buku.png'
                );
            }

            function openPortfolioModal() {
                const p = STATE.player;
                const items = p.portfolioItems || [];
                const totalAP = p.achievementPoints || 0;

                if (items.length === 0) {
                    showDialogue("📁 PORTOFOLIO KOSONG",
                        `Kamu belum memiliki karya media pembelajaran.\n\nPergi ke Bangku Kampus → "Buat Media Pembelajaran" untuk mulai berkarya!\n\n🏅 Total Poin Prestasi: ${totalAP} AP`,
                        [{ text: "Tutup", action: closeDialogue }], 'images/buku.png');
                    return;
                }

                // Tampilkan ringkasan dulu lewat dialogue, detail lewat modal HTML
                const formatCount = {};
                items.forEach(i => { formatCount[i.formatLabel] = (formatCount[i.formatLabel] || 0) + 1; });
                const topFormat = Object.entries(formatCount).sort((a,b) => b[1]-a[1])[0]?.[0] || '-';

                showDialogue("📁 PORTOFOLIOMU",
                    `📚 Total Karya: ${items.length}\n🏅 Poin Prestasi (AP): ${totalAP}\n🎨 Format Terfavorit: ${topFormat}\n\n${items.slice(-3).reverse().map(i =>
                        `${i.topicEmoji} ${i.topicLabel} (${i.formatEmoji} ${i.formatLabel}) — Day ${i.day}\n   🏅 +${i.apEarned} AP${i.teacherNote ? `\n   💬 Guru: "${i.teacherNote}"` : ''}`
                    ).join('\n\n')}\n\n(Menampilkan 3 karya terbaru)`,
                    [
                        { text: "🎨 Buat Karya Baru", action: () => { closeDialogue(); openMediaLearningQuest(); } },
                        { text: "Tutup", action: closeDialogue }
                    ],
                    'images/buku.png'
                );
            }

            function openJournalModal(fromSleep = false) {
                isSleepPending = fromSleep;
                const modal = document.getElementById('journal-modal');

                // UPDATE: Pertanyaan berdasarkan role & hari (bukan acak)
                const roleQ = getJournalQuestion();
                const qElement = document.getElementById('journal-question');
                if (qElement) qElement.innerHTML = roleQ;

                // UPDATE: Judul jurnal sesuai role
                const roleTitles = {
                    none: '📔 JURNAL REFLEKSI',
                    worker: '⚔️ JURNAL PEKERJA',
                    student: '🎓 JURNAL AKADEMISI',
                    entrepreneur: '💼 JURNAL WIRAUSAHA',
                    family: '🏠 JURNAL KELUARGA',
                };
                const role = (STATE.player && STATE.player.role) ? STATE.player.role : 'none';
                const titleEl = modal.querySelector('h3');
                if (titleEl) titleEl.innerText = roleTitles[role] || '📔 JURNAL REFLEKSI';

                // UPDATE: Tampilkan/update hint role
                let hintEl = document.getElementById('journal-role-hint');
                if (!hintEl) {
                    hintEl = document.createElement('div');
                    hintEl.id = 'journal-role-hint';
                    hintEl.style.cssText = 'background:rgba(101,163,13,0.12); border-left:3px solid #65a30d; border-radius:6px; padding:8px 10px; margin-bottom:12px; font-size:11.5px; color:#365314; line-height:1.5;';
                    const textarea = document.getElementById('journal-input');
                    if (textarea) textarea.parentNode.insertBefore(hintEl, textarea);
                }
                hintEl.innerHTML = getJournalHint();

                // UPDATE: Info hari
                let dayEl = document.getElementById('journal-day-info');
                if (!dayEl) {
                    dayEl = document.createElement('div');
                    dayEl.id = 'journal-day-info';
                    dayEl.style.cssText = 'font-size:10px; color:#94a3b8; text-align:right; margin-bottom:4px;';
                    const qParent = qElement ? qElement.parentNode : modal.querySelector('.journal-box');
                    if (qParent && qElement) qParent.insertBefore(dayEl, qElement);
                }
                dayEl.innerText = `Hari ke-${STATE.day || 1} · Jalur: ${role === 'none' ? 'Belum Dipilih' : role.charAt(0).toUpperCase() + role.slice(1)}`;

                // Reset textarea
                document.getElementById('journal-input').value = "";
                modal.style.display = 'flex';
                STATE.screen = 'modal';
            }

            function closeJournal() {
                const modal = document.getElementById('journal-modal');
                modal.style.display = 'none';
                STATE.screen = 'play';
                isSleepPending = false; // Reset flag jika batal

                // FIX: Kembalikan ke Fullscreen setelah menutup jurnal (karena keyboard menutup fullscreen)
                toggleFullScreen();
            }
            // --- NEW FUNCTION: MESSAGE ARCHIVE LOGIC ---
            function openMessageArchive() {
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const modal = document.getElementById('message-archive-modal');
                const list = document.getElementById('message-list');
                const msgs = STATE.player.messages || [];

                list.innerHTML = '';

                if (msgs.length === 0) {
                    list.innerHTML = '<div style="text-align:center; color:#94a3b8; padding:20px;">Belum ada pesan yang tersimpan.</div>';
                } else {
                    // Tampilkan dari yang terbaru ke terlama
                    [...msgs].reverse().forEach(m => {
                        // Format Waktu
                        let dateStr = "Waktu Tidak Diketahui";
                        if (m.time) {
                            const date = new Date(m.time);
                            dateStr = `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                        }

                        const div = document.createElement('div');
                        // FIX: Style Pesan di Arsip (Background Putih)
                        div.style.cssText = "background:#fff; padding:12px; margin-bottom:10px; border-left:4px solid var(--secondary); border-radius:6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);";
                        div.innerHTML = `
                <div style="font-size:10px; color:#64748b; display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #f1f5f9; padding-bottom:4px;">
                    <span style="font-weight:bold; color:var(--primary);">DARI: GURU</span>
                    <span>🕒 ${dateStr}</span>
                </div>
                <div style="font-size:13px; color:#334155; line-height:1.5; font-family:'Exo 2'; white-space: pre-wrap; font-weight:500;">${m.text}</div>
            `;
                        list.appendChild(div);
                    });
                }

                modal.style.display = 'flex';
                STATE.screen = 'modal';
            }

            function closeMessageArchive() {
                document.getElementById('message-archive-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            // Helper: hitung reward jurnal berdasarkan panjang teks & role
            function calcJournalReward(text) {
                const len = text.length;
                const role = STATE.player ? STATE.player.role : 'none';

                // Base reward makin besar sesuai panjang tulisan
                let gold, exp, ap, bonusItem = null, bonusQty = 0;

                if (len >= 200) {
                    gold = 1500; exp = 100; ap = 10;
                } else if (len >= 100) {
                    gold = 1000; exp = 75; ap = 7;
                } else if (len >= 50) {
                    gold = 700; exp = 60; ap = 5;
                } else if (len >= 20) {
                    gold = 500; exp = 50; ap = 3;
                } else {
                    return null; // belum cukup
                }
                // Semua role mendapat AP dari refleksi; student tetap sama, non-student +50% bonus
                if (role !== 'student') ap = Math.ceil(ap * 1.5);

                // Bonus item per role
                const roleBonus = {
                    worker:       { item: 'kopi',          qty: 1, label: '☕ Kopi' },
                    student:      { item: 'buku_catatan',  qty: 1, label: '📒 Buku Catatan' },
                    entrepreneur: { item: 'koin_emas',     qty: 1, label: '🪙 Koin Emas' },
                    family:       { item: 'bunga',         qty: 2, label: '💐 Bunga x2' },
                    none:         { item: 'coklat',        qty: 1, label: '🍫 Coklat' },
                };
                const rb = roleBonus[role] || roleBonus['none'];
                bonusItem = rb.item; bonusQty = rb.qty;

                // Bonus extra kalau tulisan panjang
                const streak = STATE.player.reflections ? STATE.player.reflections.length : 0;
                const streakBonus = streak > 0 && streak % 5 === 0; // tiap 5 jurnal

                return { gold, exp, ap, bonusItem, bonusQty, bonusLabel: rb.label, streakBonus, streak: streak + 1 };
            }

            // Update reward preview saat user ngetik
            function updateJournalRewardPreview() {
                const input = document.getElementById('journal-input');
                const previewEl = document.getElementById('journal-reward-text');
                const charEl = document.getElementById('journal-char-count');
                const submitBtn = document.getElementById('journal-submit-btn');
                if (!input || !previewEl) return;

                const text = input.value.trim();
                const len = text.length;
                if (charEl) charEl.textContent = len + ' karakter';

                const reward = calcJournalReward(text);
                if (!reward) {
                    previewEl.textContent = 'Tulis minimal 20 karakter untuk dapat reward~';
                    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.5'; }
                    return;
                }

                const streakTxt = reward.streakBonus ? ` 🔥 Jurnal ke-${reward.streak} → Bonus AP +5!` : '';
                previewEl.innerHTML = `+${reward.gold}G &nbsp;+${reward.exp} EXP &nbsp;+${reward.ap} AP &nbsp;${reward.bonusLabel}${streakTxt}`;
                if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
            }

            function saveJournal() {
                const input = document.getElementById('journal-input');
                const text = input.value.trim();

                const reward = calcJournalReward(text);
                if (!reward) {
                    showToast("Tulis minimal 20 karakter dulu ya!");
                    return;
                }

                // 1. Simpan entri jurnal
                const entry = {
                    day: STATE.day,
                    date: Date.now(),
                    text: text,
                    role: (STATE.player && STATE.player.role) ? STATE.player.role : 'none',
                    question: getJournalQuestion(),
                };
                if (!STATE.player.reflections) STATE.player.reflections = [];
                STATE.player.reflections.push(entry);

                // 2. Beri reward
                STATE.player.money += reward.gold;
                gainExp(reward.exp);
                STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + reward.ap;
                if (reward.bonusItem) addItem(reward.bonusItem, reward.bonusQty);
                if (reward.streakBonus) STATE.player.achievementPoints += 5;

                // 3. Autosave (sudah jalan background tiap 2 detik, tapi paksa sekali lagi untuk jurnal)
                manualSave();

                // 4. Feedback
                if (typeof AudioService !== 'undefined') AudioService.playSFX('levelup');
                createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                createParticle(STATE.player.x + 20, STATE.player.y - 10, '#86efac');

                // 5. Tutup Modal
                const modal = document.getElementById('journal-modal');
                modal.style.display = 'none';
                STATE.screen = 'play';

                // 6. Cek tidur pending
                const streakMsg = reward.streakBonus ? `\n🔥 Jurnal ke-${reward.streak}! Bonus +5 AP!` : '';
                if (isSleepPending) {
                    isSleepPending = false;
                    setTimeout(() => {
                        showDialogue("✅ JURNAL TERKIRIM!", `Guru sudah menerima refleksimu~\n\n🎁 Reward Hari Ini:\n• +${reward.gold} Gold\n• +${reward.exp} EXP\n• +${reward.ap} AP\n• ${reward.bonusLabel}${streakMsg}\n\nLanjut tidur?`, [
                            {
                                text: "Tidur Sekarang 🛌",
                                action: () => { toggleFullScreen(); handleSleep(); }
                            },
                            {
                                text: "Nanti Dulu",
                                action: () => { closeDialogue(); toggleFullScreen(); }
                            }
                        ], 'images/buku.png');
                    }, 300);
                } else {
                    toggleFullScreen();
                    setTimeout(() => {
                        showDialogue("✅ JURNAL TERKIRIM!", `Refleksimu sudah dicatat dan dikirim ke gurumu~\n\n🎁 Reward:\n• +${reward.gold} Gold\n• +${reward.exp} EXP\n• +${reward.ap} AP\n• ${reward.bonusLabel}${streakMsg}`, [
                            { text: "Yay! Terus semangat! 💪", action: closeDialogue }
                        ], 'images/buku.png');
                    }, 300);
                }
            }

            function startFishingMinigame() {
                if (STATE.player.energy < 10) {
                    showToast("Energi tidak cukup!");
                    return;
                }
                STATE.player.energy -= 10;
                STATE.fishing.active = true;
                STATE.fishing.barX = 0;
                STATE.fishing.targetStart = 30 + Math.random() * 40;
                STATE.fishing.targetWidth = 15;
                STATE.screen = 'play';
                showToast("Tekan AKSI (Space/Tombol) saat di Hijau!");
            }

            // --- SEASONAL FISH TABLE ---
            const SEASONAL_FISH = {
                spring: [
                    { id: 'ikan_kecil',     name: '🐟 Ikan Mas Koki',    img: 'images/ikankecil.png',     rarity: 'COMMON',    color: '#cbd5e1', exp: 10,  chance: 50 },
                    { id: 'ikan_sedang',    name: '🐠 Ikan Nila Semi',    img: 'images/ikansedang.png',    rarity: 'UNCOMMON',  color: '#38bdf8', exp: 25,  chance: 32 },
                    { id: 'ikan_besar',     name: '🐡 Ikan Gurame',       img: 'images/ikanbesar.png',     rarity: 'RARE',      color: '#f472b6', exp: 50,  chance: 15 },
                    { id: 'ikan_legendary', name: '✨ Ikan Koi Sakura',   img: 'images/ikanlegendary.png', rarity: 'LEGENDARY', color: '#fbbf24', exp: 200, chance: 3  }
                ],
                summer: [
                    { id: 'ikan_kecil',     name: '🐟 Ikan Bawal',       img: 'images/ikankecil.png',     rarity: 'COMMON',    color: '#cbd5e1', exp: 10,  chance: 50 },
                    { id: 'ikan_sedang',    name: '🐠 Ikan Mujair',       img: 'images/ikansedang.png',    rarity: 'UNCOMMON',  color: '#fbbf24', exp: 25,  chance: 32 },
                    { id: 'ikan_besar',     name: '🐡 Ikan Tuna Muda',    img: 'images/ikanbesar.png',     rarity: 'RARE',      color: '#f97316', exp: 50,  chance: 15 },
                    { id: 'ikan_legendary', name: '✨ Hiu Pelangi',       img: 'images/ikanlegendary.png', rarity: 'LEGENDARY', color: '#fbbf24', exp: 200, chance: 3  }
                ],
                autumn: [
                    { id: 'ikan_kecil',     name: '🐟 Ikan Lele Gugur',  img: 'images/ikankecil.png',     rarity: 'COMMON',    color: '#cbd5e1', exp: 10,  chance: 48 },
                    { id: 'ikan_sedang',    name: '🐠 Ikan Patin',        img: 'images/ikansedang.png',    rarity: 'UNCOMMON',  color: '#f59e0b', exp: 30,  chance: 32 },
                    { id: 'ikan_besar',     name: '🦑 Cumi-cumi Musim',   img: 'images/ikanbesar.png',     rarity: 'RARE',      color: '#a855f7', exp: 60,  chance: 17 },
                    { id: 'ikan_legendary', name: '✨ Belut Emas',        img: 'images/ikanlegendary.png', rarity: 'LEGENDARY', color: '#fbbf24', exp: 200, chance: 3  }
                ],
                winter: [
                    { id: 'ikan_kecil',     name: '🐟 Ikan Salju',       img: 'images/ikankecil.png',     rarity: 'COMMON',    color: '#bfdbfe', exp: 12,  chance: 45 },
                    { id: 'ikan_sedang',    name: '🐠 Ikan Salmon',       img: 'images/ikansedang.png',    rarity: 'UNCOMMON',  color: '#38bdf8', exp: 35,  chance: 32 },
                    { id: 'ikan_besar',     name: '🐋 Ikan Paus Kecil',   img: 'images/ikanbesar.png',     rarity: 'RARE',      color: '#6366f1', exp: 70,  chance: 20 },
                    { id: 'ikan_legendary', name: '✨ Ikan Kristal Es',   img: 'images/ikanlegendary.png', rarity: 'LEGENDARY', color: '#fbbf24', exp: 200, chance: 3  }
                ]
            };

            function checkFishing() {
                if (!STATE.fishing.active) return;
                STATE.fishing.active = false;
                hideFishingOverlay();

                if (STATE.fishing.barX >= STATE.fishing.targetStart && STATE.fishing.barX <= (STATE.fishing.targetStart + STATE.fishing.targetWidth)) {
                    STATE.player.dailyFishingCount = (STATE.player.dailyFishingCount || 0) + 1;
                    STATE.player.totalFishingCount = (STATE.player.totalFishingCount || 0) + 1; // TOTAL LIFETIME

                    // Pilih pool ikan berdasarkan musim
                    const season = STATE.season || 'spring';
                    const pool = SEASONAL_FISH[season] || SEASONAL_FISH.spring;

                    // Roll berdasarkan chance (kumulatif)
                    const rand = Math.random() * 100;
                    let cumulative = 0;
                    let caught = pool[pool.length - 1]; // default: yang terakhir (common)
                    // Cek dari langka ke umum agar tertimpa dengan benar
                    for (let i = 0; i < pool.length; i++) {
                        cumulative += pool[i].chance;
                        if (rand < cumulative) { caught = pool[i]; break; }
                    }

                    if (!STATE.player.inventory[caught.id]) STATE.player.inventory[caught.id] = 0;
                    STATE.player.inventory[caught.id]++;
                    gainExp(caught.exp);

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(STATE.player.x, STATE.player.y, caught.color);

                    const seasonLabel = { spring: '🌸 SEMI', summer: '☀️ PANAS', autumn: '🍂 GUGUR', winter: '❄️ DINGIN' }[season];
                    showDialogue(
                        `TANGKAPAN BERHASIL! ${caught.rarity === 'LEGENDARY' ? '⭐' : ''}`,
                        `Kamu mendapatkan:\n${caught.name}\n[${caught.rarity}] — Musim ${seasonLabel}\n\n+${caught.exp} EXP`,
                        [{ text: "Simpan 🎣", action: closeDialogue }],
                        caught.img
                    );
                } else {
                    showToast("GAGAL... Ikan lepas 🎣");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                }
            }

            // --- NEW FUNCTION: GAIN EXP ---
            function gainExp(amount) {
                STATE.player.exp += amount;
                showToast(`+${amount} EXP`);

                if (STATE.player.exp >= STATE.player.maxExp) {
                    STATE.player.exp = STATE.player.exp - STATE.player.maxExp; // Sisa EXP dibawa ke level berikutnya
                    STATE.player.maxExp = Math.floor(STATE.player.maxExp * 1.5);
                    STATE.player.level++;

                    // 1. Recover HP/Energy (Full Heal saat Level Up)
                    STATE.player.energy = 100;
                    STATE.player.hp = STATE.player.maxHp;

                    // 2. Base Stat Increase (Semua naik sedikit)
                    STATE.player.str += 1;
                    STATE.player.int += 1;
                    STATE.player.biz += 1;
                    STATE.player.reputation += 1;
                    STATE.player.maxHp += 5; // Tambah darah sedikit

                    // 3. Bonus Role Stat (Spesialisasi naik banyak)
                    let bonusText = "";
                    if (STATE.player.role === 'worker') { STATE.player.str += 2; bonusText = "STR++"; }
                    else if (STATE.player.role === 'student') { STATE.player.int += 2; bonusText = "INT++"; }
                    else if (STATE.player.role === 'entrepreneur') { STATE.player.biz += 2; bonusText = "BIZ++"; }
                    else if (STATE.player.role === 'family') { STATE.player.reputation += 2; bonusText = "REP++"; }

                    showToast(`LEVEL UP! LV ${STATE.player.level} (All Stats+1, ${bonusText}) 🆙`);
                    createParticle(STATE.player.x, STATE.player.y, '#6366f1');

                    // 🎬 MILESTONE CUTSCENE (level 5, 10, 15, 20, 30, 50)
                    const _milestones = [5, 10, 15, 20, 30, 50];
                    // Level 5 & 15: milestone kecil tanpa cutscene penuh
                    if (STATE.player.level === 5) {
                        setTimeout(() => {
                            showDialogue('⭐ PENCAPAIAN PERTAMA!',
                                `Level 5 tercapai! Kamu sudah mulai menemukan ritme hidupmu di desa ini.\n\n✨ Semua stat naik!\n💪 HP Max bertambah\n\n📚 "Perjalanan seribu langkah dimulai dari satu langkah kecil." — Lao Tzu`,
                                [{ text: 'Lanjutkan! 🚀', action: closeDialogue }], null);
                        }, 600);
                    } else if (STATE.player.level === 15) {
                        setTimeout(() => {
                            showDialogue('🌟 SEPARUH JALAN!',
                                `Level 15! Warga desa sudah mulai mengenalmu dengan baik.\n\n🎯 Fokus pada jalur ${(STATE.player.role||'pilihanmu').toUpperCase()} untuk bonus maksimal.\n\n📚 "Konsistensi adalah kunci — bukan kecepatan."`,
                                [{ text: 'Siap! 💪', action: closeDialogue }], null);
                        }, 600);
                    } else if (_milestones.includes(STATE.player.level)) {
                        const _mlvl = STATE.player.level;
                        setTimeout(() => {
                            playCutsceneLevelUp(_mlvl, () => {
                                showToast(`🌟 MILESTONE LEVEL ${_mlvl} DIRAIH!`);
                                // Level 10: buka kostum spesial
                                if (_mlvl === 10) {
                                    setTimeout(() => {
                                        showDialogue("HADIAH LEVEL 10! ✨",
                                            "Selamat! Kamu telah mencapai Level 10.\n\nSebagai penghargaan, **KOSTUM SPESIAL** kini telah terbuka di Lemari Pakaianmu!\n\n(Cek Lemari di Rumah untuk memakainya)",
                                            [{ text: "Keren! Terima Kasih!", action: closeDialogue }],
                                            'images/lemari.png'
                                        );
                                    }, 500);
                                }
                            });
                        }, 600);
                    } else if (typeof AudioService !== 'undefined') {
                        AudioService.playSFX('item');
                    }

                    // Update HUD langsung
                    updateHUDInfo();

                    // Auto Save saat level up untuk mengamankan progress
                    manualSave();
                }
            }

            // --- NEW FUNCTION: MANUAL SAVE ---
            async function manualSave() {
                await DataService.saveGame({
                    // 1. Waktu & Lingkungan
                    day: STATE.day,
                    time: STATE.time, // Penting agar tidak reset ke pagi
                    season: STATE.season,
                    weather: STATE.weather,

                    // 2. Status Fisik & Level
                    hp: STATE.player.hp,
                    maxHp: STATE.player.maxHp,
                    energy: STATE.player.energy,
                    money: STATE.player.money,
                    level: STATE.player.level,
                    exp: STATE.player.exp,
                    maxExp: STATE.player.maxExp,
                    gender: STATE.player.gender,

                    // --- TAMBAHAN BARU: SIMPAN DATA OUTFIT ---
                    outfit: STATE.player.outfit,
                    // -----------------------------------------

                    // 3. Role & Career
                    role: STATE.player.role,
                    major: STATE.player.major,
                    scholarship: STATE.player.scholarship,
                    jobStatus: STATE.player.jobStatus,
                    bossReputation: STATE.player.bossReputation,
                    // NEW: SAVE JOB LEVEL
                    jobLevel: STATE.player.jobLevel,

                    shiftStarted: STATE.player.shiftStarted, // Simpan status sedang kerja
                    salaryDays: STATE.player.salaryDays,
                    lastAttendanceDay: STATE.player.lastAttendanceDay,

                    // SAVE JOB DISCOVERY
                    knownJobs: STATE.player.knownJobs || [],
                    jobSearchCount: STATE.player.jobSearchCount || 0,
                    lastJobSearchDay: STATE.player.lastJobSearchDay || 0,

                    // SAVE PART-TIME
                    partTimeJob: STATE.player.partTimeJob,
                    partTimeStatus: STATE.player.partTimeStatus,
                    partTimeShiftStarted: STATE.player.partTimeShiftStarted,
                    partTimeLastWorkedDay: STATE.player.partTimeLastWorkedDay,
                    partTimeSalaryDays: STATE.player.partTimeSalaryDays,
                    todayConflict: STATE.player.todayConflict,
                    shownStudentConflicts: STATE.player.shownStudentConflicts || [],
                    shownEntrepreneurConflicts: STATE.player.shownEntrepreneurConflicts || [],
                    lastRepThreshDay: STATE.player.lastRepThreshDay,

                    // 4. Stats Attribute
                    str: STATE.player.str,
                    int: STATE.player.int,
                    biz: STATE.player.biz,
                    reputation: STATE.player.reputation,
                    ethics: STATE.player.ethics,

                    // 5. Inventory & Aset
                    inventory: STATE.player.inventory, // PENTING: Tas
                    houseLevel: STATE.player.houseLevel,
                    furniture: STATE.player.furniture,
                    // NEW: SIMPAN STATUS KURCACI
                    hiredDwarf: STATE.player.hiredDwarf,
                    hiredFairy: STATE.player.hiredFairy, // <--- TAMBAHKAN INI

                    // 6. Hubungan Sosial
                    relationships: STATE.player.relationships,
                    married: STATE.player.married,
                    spouseId: STATE.player.spouseId,
                    modinVisited: STATE.player.modinVisited || false,
                    divorced: STATE.player.divorced || false,
                    homeRole: STATE.player.homeRole || 'homemaker',
                    // Marriage conflict system save
                    marriedDay: STATE.player.marriedDay || 0,
                    marriageMonth: STATE.player.marriageMonth || 1,
                    marriageConflictLevel: STATE.player.marriageConflictLevel || 0,
                    lastConflictDay: STATE.player.lastConflictDay || 0,
                    monthlyExpenses: STATE.player.monthlyExpenses || 0,
                    lastMarriageBillDay: STATE.player.lastMarriageBillDay || 0,

                    // 7. Quest & Progress Dungeon
                    activeQuest: STATE.player.activeQuest,
                    questProgress: STATE.questProgress,
                    dungeonLevel: STATE.dungeonLevel,

                    // 8. Game State Flags
                    gameFinished: STATE.gameFinished,
                    freeRoamMode: STATE.freeRoamMode,
                    isPrologue: STATE.isPrologue,

                    // 9. Claims & Trackers Reward
                    lastDailyClaim: STATE.player.lastDailyClaim,
                    lastWeeklyClaim: STATE.player.lastWeeklyClaim,
                    lastMonthlyClaim: STATE.player.lastMonthlyClaim,
                    claimedLifeTrial: STATE.player.claimedLifeTrial,
                    lastHarvestGiftYear: STATE.player.lastHarvestGiftYear, // NEW: Simpan Status Hadiah Kurcaci
                    lastGrapeGiftYear: STATE.player.lastGrapeGiftYear, // NEW: Simpan Status Hadiah Peri Panen
                    lastResolutionYear: STATE.player.lastResolutionYear || 0, // NEW: Resolusi Tahun Baru
                    hasSeenDungeonTutorial: STATE.player.hasSeenDungeonTutorial,
                    hasSeenFishingTutorial: STATE.player.hasSeenFishingTutorial, // NEW: Save Fishing Tutorial

                    // NEW: SIMPAN PROGRESS HARIAN
                    dailyFishingCount: STATE.player.dailyFishingCount || 0,
                    dailyMonsterKills: STATE.player.dailyMonsterKills || 0,
                    dailyTalkCount: STATE.player.dailyTalkCount || 0,
                    dailyHarvestCount: STATE.player.dailyHarvestCount || 0,
                    // TOTAL LIFETIME COUNTERS
                    totalFishingCount: STATE.player.totalFishingCount || 0,
                    totalMonsterKills: STATE.player.totalMonsterKills || 0,
                    totalSellCount:    STATE.player.totalSellCount    || 0,
                    // NPC RELATIONSHIP TRACKING
                    npcLastTalkDay: STATE.player.npcLastTalkDay || {},
                    // MILESTONE YEAR CLAIMS
                    claimedYear1: STATE.player.claimedYear1 || false,
                    claimedYear2: STATE.player.claimedYear2 || false,
                    claimedYear3: STATE.player.claimedYear3 || false,
                    claimedYear4: STATE.player.claimedYear4 || false,
                    claimedYear5: STATE.player.claimedYear5 || false,
                    honorTitle:   STATE.player.honorTitle   || null,

                    // 10. Pesan & Jurnal & MATERI KULIAH
                    reflections: STATE.player.reflections,
                    messages: STATE.player.messages,
                    learnedSubjects: STATE.player.learnedSubjects || [], // FIX: Simpan Array Mata Pelajaran
                    achievementPoints: STATE.player.achievementPoints || 0,
                    portfolioItems: STATE.player.portfolioItems || [],

                    // 11. SIMPAN STATE VIRAL
                    viral: STATE.viral,

                    // 12. SIMPAN DATA PET
                    pets: STATE.player.pets || [],
                    activePet: STATE.player.activePet || null
                });
            }

            // --- FIX: FUNGSI MEMANCING YANG DIPERBAIKI (TIDAK DUPLIKAT) ---
            function startFishingMinigame() {
                // --- TUTORIAL MEMANCING (FIRST TIME ONLY) ---
                if (!STATE.player.hasSeenFishingTutorial) {
                    showDialogue("🎣 MEMANCING",
                        "Bar indikator bergerak kanan-kiri.\nTekan TARIK saat garis putih ada di zona HIJAU!\n\nBerhasil = dapat ikan. Meleset = coba lagi.\nSetiap cast butuh 10 Energi.",
                        [{
                            text: "Paham! Mulai Mancing 🎣",
                            action: () => {
                                STATE.player.hasSeenFishingTutorial = true;
                                manualSave();
                                closeDialogue();
                                setTimeout(startFishingMinigame, 500);
                            }
                        }],
                        'images/nelayan.png'
                    );
                    return;
                }

                if (STATE.player.energy < 10) {
                    showToast("Energi tidak cukup!");
                    return;
                }

                // Kurangi Energi & Mulai Minigame
                STATE.player.energy -= 10;
                STATE.fishing.active = true;
                STATE.fishing.barX = 0;
                STATE.fishing.barDir = 1; // FIX: Reset Arah Gerak agar tidak macet
                STATE.fishing.targetStart = 30 + Math.random() * 40;
                STATE.fishing.targetWidth = 15;

                STATE.screen = 'play';
                showToast("Tekan AKSI (Space/Tombol) saat di Hijau!");

                // 🎣 TAMPILKAN FISHING OVERLAY KEREN
                showFishingOverlay();
            }

            // --- FIX: FUNGSI CEK HASIL PANCINGAN (DIPASTIKAN ADA) ---
            // --- NEW FUNCTION: HANDLE FAINT (PINGSAN) ---
            function handleFaint() {
                // FIX: Tambahkan cek flag isDayChanging
                if (STATE.screen === 'cutscene' || STATE.isDayChanging) return;

                // FIX CRITICAL: Panggil closeDialogue DULUAN sebelum set cutscene
                // Karena closeDialogue() mereset screen jadi 'play'
                closeDialogue();

                STATE.screen = 'cutscene';
                STATE.isDayChanging = true; // Kunci proses ganti hari

                showToast("😵 Kamu Pingsan karena kelelahan...");
                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // Overlay Hitam
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0'; overlay.style.left = '0';
                overlay.style.width = '100%'; overlay.style.height = '100%';
                overlay.style.background = 'black';
                overlay.style.zIndex = '9999';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 1s';
                overlay.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:#ef4444; font-family:Cinzel; font-size:24px; flex-direction:column;">
        <h1>PINGSAN</h1>
        <p style="font-size:12px; color:#cbd5e1;">Dibawa ke Klinik oleh Warga...</p>
    </div>`;
                document.body.appendChild(overlay);

                // Fade In
                setTimeout(() => {
                    overlay.style.opacity = '1';
                }, 100);

                setTimeout(() => {
                    // Logic Reset
                    STATE.day = parseInt(STATE.day) + 1;
                    STATE.time = 800; // Bangun jam 8 pagi (telat karena sakit)
                    STATE.player.energy = 50; // Bangun tidak full energy
                    STATE.player.hp = STATE.player.maxHp;

                    // Penalty
                    const penalty = 500;
                    const moneyBefore = STATE.player.money;
                    STATE.player.money = Math.max(0, STATE.player.money - penalty);

                    // 🎬 BANGKRUT: cek apakah money jatuh ke 0
                    if (moneyBefore > 0 && STATE.player.money === 0 && !STATE.player._bangkrutCutscenePlayed) {
                        STATE.player._bangkrutCutscenePlayed = true;
                        setTimeout(() => playCutsceneBangkrut(() => {
                            showToast("💸 BANGKRUT! Cari cara untuk mendapatkan Gold segera!");
                            STATE.player._bangkrutCutscenePlayed = false; // Reset untuk bisa trigger lagi nanti
                        }), 2500);
                    }

                    // Respawn at Clinic (UPDATE: DI DALAM KLINIK - SAMPING KASUR)
                    // Posisi Baru: clinic_interior -> Tile (10, 8) (Samping Bed Kanan, Area Kosong)
                    STATE.location = 'clinic_interior';
                    STATE.player.x = 10 * TILE_SIZE;
                    STATE.player.y = 8 * TILE_SIZE;
                    STATE.player.direction = 'left'; // Menghadap ruangan

                    // Pastikan area spawn bersih (walaupun (10,8) diset kosong)
                    clearSpawnZone('clinic_interior', 10, 8);

                    randomizeWeather();
                    manualSave();

                    // Fade Out & Wake Up
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(overlay)) document.body.removeChild(overlay);

                        showToast("Bangun di Klinik. Biaya: 500G");

                        // Update Date/Time UI immediately
                        const currentDayName = DAYS_OF_WEEK[(STATE.day - 1) % 7];
                        const totalDays = STATE.day - 1;
                        const year = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;
                        document.getElementById('full-date-display').innerText = `${currentDayName}, D${(totalDays % DAYS_PER_SEASON) + 1} ${STATE.season.toUpperCase()} Y${year}`;
                        document.getElementById('clock-display').innerText = "08:00";

                        // Tambahkan Dialog Dokter agar lebih imersif
                        setTimeout(() => {
                            showDialogue("DR. BUDI", "Wah, kamu sudah sadar? Kemarin kamu pingsan di jalan karena kelelahan.\n\nUntung ada warga yang membawamu ke Klinik. Saya sudah mengobati lukamu dan memberikan vitamin.\n\nLain kali, perhatikan batas energimu ya. Kesehatan itu mahal harganya.", [{ text: "Terima kasih Dok", action: closeDialogue }], 'images/lover1boy.png');
                        }, 500);

                        updateHUDInfo();
                        STATE.screen = 'play';
                        STATE.isDayChanging = false; // Buka kunci
                    }, 1000);
                }, 2000);
            }

            // --- NEW FUNCTION: SLEEP LOGIC ---
            function handleSleep() {
                // FIX: Tambahkan cek flag isDayChanging
                if (STATE.screen === 'cutscene' || STATE.isDayChanging) return;

                // 💡 CEK KONSEKUENSI NYATA DULU — wajib refleksi jika ada kondisi kritis
                checkKonsekuensiTriggers(() => {
                    _doSleep();
                });
            }

            function _doSleep() {
                if (STATE.screen === 'cutscene' || STATE.isDayChanging) return;

                // --- NEW: CAPTURE WAKTU TIDUR UNTUK LOGIKA PULANG TELAT ---
                const lastSleepTime = STATE.time;

                closeDialogue();
                STATE.screen = 'cutscene'; // FIX: Stop update loop saat tidur
                STATE.isDayChanging = true; // Kunci proses

                // FIX: Bekukan waktu agar tidak bertambah selama proses ganti hari
                // Safety timeout: jika 10 detik lebih tidak selesai, paksa reset
                const _sleepSafetyTimer = setTimeout(() => {
                    if (STATE.isDayChanging) {
                        STATE.isDayChanging = false;
                        STATE.screen = 'play';
                        console.warn('[Sleep] Safety reset triggered — isDayChanging stuck');
                    }
                }, 10000);

                let oversleep = false;
                // MECHANIC: OVERSLEEP IF ENERGY LOW
                if (STATE.player.energy < 20) {
                    oversleep = true;
                }

                showToast("Zzz... Tidur...");

                // Overlay Hitam Sementara
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0'; overlay.style.left = '0';
                overlay.style.width = '100%'; overlay.style.height = '100%';
                overlay.style.background = 'black';
                overlay.style.zIndex = '9999';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 1s';

                // Hitung hari besok untuk tampilan layar hitam
                const nextDayName = DAYS_OF_WEEK[STATE.day % 7]; // STATE.day sudah +1 nanti, jadi %7 saja (karena array 0-6)

                overlay.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:white; font-family:Cinzel; font-size:24px;">Day ${parseInt(STATE.day) + 1} (${nextDayName})</div>`;
                document.body.appendChild(overlay);

                // Animasi Fade Out
                setTimeout(() => {
                    overlay.style.opacity = '1';

                    // LOGIKA GANTI HARI DI BALIK LAYAR
                    setTimeout(() => {
                        // FIX: Pastikan penambahan hari aman (Integer)
                        STATE.day = parseInt(STATE.day) + 1;

                        if (oversleep) {
                            STATE.time = 1000; // Bangun jam 10:00 (Telat)
                        } else {
                            STATE.time = 600; // Bangun jam 06:00
                        }

                        STATE.player.energy = 100; // Pulihkan Energi
                        STATE.player.hp = STATE.player.maxHp; // Pulihkan HP

                        // FIX: RESET COUNTER HARIAN SAAT TIDUR (agar quest hari baru dimulai fresh)
                        STATE.player.dailyFishingCount  = 0;
                        STATE.player.dailyMonsterKills  = 0;
                        STATE.player.dailyTalkCount     = 0;
                        STATE.player.dailyHarvestCount  = 0;
                        STATE.player.dailySellCount     = 0;
                        STATE.player.dailySelfStudy     = 0;
                        // lastDailyClaim tidak perlu di-reset karena otomatis beda (STATE.day bertambah)

                        // === FAKE LOVER DAILY SABOTAGE MECHANIC ===
                        // Jika fake_boy/fake_girl sudah di fase Love Bomb (70-99),
                        // ada kemungkinan mereka sabotase relasi lover asli player
                        (function checkFakeSabotage() {
                            const fakeIds = ['fake_boy', 'fake_girl'];
                            const loverIds = ['lover1girl','lover2girl','lover1boy','lover2boy'];
                            const loverNames = {lover1girl:'Ayu',lover2girl:'Putri',lover1boy:'Dr. Budi',lover2boy:'Satria'};
                            fakeIds.forEach(fId => {
                                const fRel = STATE.player.relationships[fId] || 0;
                                if (fRel >= 70 && fRel < 100 && !STATE.player[`fakeRevealed_${fId}`]) {
                                    // 30% chance per hari sabotase lover
                                    if (Math.random() < 0.30) {
                                        loverIds.forEach(lId => {
                                            const lRel = STATE.player.relationships[lId] || 0;
                                            if (lRel > 0) {
                                                const dmg = 3 + Math.floor(Math.random() * 5); // 3-7
                                                STATE.player.relationships[lId] = Math.max(0, lRel - dmg);
                                                const fName = fId === 'fake_boy' ? 'Doni' : 'Bella';
                                                const lName = loverNames[lId] || lId;
                                                // Tampilkan notif sabotase lewat pesan HP
                                                if (!STATE.player.messages) STATE.player.messages = [];
                                                STATE.player.messages.push({
                                                    from: lName,
                                                    text: `Hei... aku denger kamu lagi deket sama ${fName}. Aku jadi ragu... apakah kita masih oke? (-${dmg} Relasi)`,
                                                    time: Date.now()
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        })();

                        // Logika Shift Kerja (Jika lupa pulang)
                        if (STATE.player.shiftStarted) {
                            STATE.player.shiftStarted = false;
                            STATE.player.bossReputation -= 5;
                        }

                        randomizeWeather(); // Ubah Cuaca
                        manualSave(); // Simpan Otomatis saat tidur

                        // Animasi Fade In
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(overlay);

                            // Ambil Nama Hari Baru
                            const currentDayName = DAYS_OF_WEEK[(STATE.day - 1) % 7];

                            if (oversleep) {
                                showToast(`⚠️ KESIANGAN! Bangun jam 10:00 karena kelelahan.`);
                            } else {
                                showToast(`Selamat Pagi! Hari ${currentDayName}`);
                            }

                            // Update tampilan tanggal/jam segera (termasuk hari)
                            const totalDays = STATE.day - 1;
                            const year = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;
                            const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;

                            document.getElementById('full-date-display').innerText = `${currentDayName}, D${dayInSeason} ${STATE.season.toUpperCase()} Y${year}`;
                            document.getElementById('clock-display').innerText = oversleep ? "10:00" : "06:00";

                            STATE.screen = 'play'; // FIX: Resume game setelah bangun
                            STATE.isDayChanging = false; // Buka kunci
                            clearTimeout(_sleepSafetyTimer); // Batalkan safety timer

                            // --- BIRTHDAY NOTIFICATION PAGI HARI ---
                            setTimeout(() => {
                                const todayBDs = getTodayBirthdays();
                                if (todayBDs.length > 0) {
                                    const names = todayBDs.map(b => b.name).join(' & ');
                                    showToast('🎂 HARI ULANG TAHUN: ' + names + '! Temui mereka!');
                                    createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                                }
                            }, 1500);

                            // --- NEW: RESPAWN BUNGA LIAR SETIAP PAGI ---
                            spawnWildFlowers();

                            // --- MENTOR MORNING TRIGGER ---
                            setTimeout(() => triggerMorningMentor(), 2200);

                            // --- LOGIKA NAFKAH HARIAN & DRAMA NIKAH MUDA ---
                            if (STATE.player.married && STATE.player.spouseId) {
                                // Cari pasangan di map mana saja (house, player_shop_interior, dll)
                                const spouseId = STATE.player.spouseId;
                                let spouse = null;
                                for (const mapKey of ['house', 'player_shop_interior', 'wedding_interior', 'lover1_interior']) {
                                    if (maps[mapKey]) {
                                        const found = maps[mapKey].npcs.find(n => n.id === spouseId);
                                        if (found) { spouse = found; break; }
                                    }
                                }
                                // Jika pasangan belum di-spawn di rumah, spawn sekarang
                                if (!spouse && maps['house']) {
                                    const spouseImages = {
                                        'lover1girl': 'images/lover1girl.png',
                                        'lover2girl': 'images/lover2girl.png',
                                        'lover1boy': 'images/lover1boy.png',
                                        'lover2boy': 'images/lover2boy.png',
                                        'lover_matre_girl': 'images/lover_matre_girl.png',
                                        'lover_matre_boy': 'images/lover_matre_boy.png'
                                    };
                                    const spouseNames = {
                                        'lover1girl':'Ayu (Gadis Desa)','lover2girl':'Putri (Scholar)',
                                        'lover1boy':'Dr. Budi','lover2boy':'Satria (Ksatria)',
                                        'lover_matre_girl':'Siska','lover_matre_boy':'Rendi'
                                    };
                                    spouse = {
                                        id: spouseId, x: 4, y: 4,
                                        name: spouseNames[spouseId] || 'Pasangan',
                                        imgSrc: spouseImages[spouseId] || 'images/lover1girl.png',
                                        type: 'static', schedule: 'always', w: 40, h: 60
                                    };
                                    maps['house'].npcs.push(spouse);
                                }

                                if (spouse) {
                                    setTimeout(() => {
                                        const dailyCost = 2500;
                                        // CEK TELAT: Pulang setelah jam 18:00 (1800) atau Dini Hari (< 600)
                                        const isLate = lastSleepTime >= 1800 || lastSleepTime < 600;

                                        // 1. TERAPKAN PENALTI DULUAN (SIMULASI DI MEMORI)
                                        // Agar kita bisa cek apakah hubungan jadi 0 gara-gara kejadian semalam
                                        let currentRel = STATE.player.relationships[spouseId] || 0;
                                        let penaltyApplied = 0;

                                        if (isLate) penaltyApplied -= 5;
                                        if (STATE.player.money < dailyCost) penaltyApplied -= 5;

                                        // Update nilai asli di state
                                        if (penaltyApplied !== 0) {
                                            updateRelationship(spouse, penaltyApplied, "Masalah Rumah Tangga");
                                            currentRel = STATE.player.relationships[spouseId]; // Ambil nilai baru
                                        }

                                        // 2. CEK APAKAH INI GONG PERCERAIAN? (Love <= 0)
                                        if (currentRel <= 0) {
                                            handleDivorceSequence(spouse);
                                            manualSave();
                                            return; // Stop flow uang belanja
                                        }

                                        // 3. JIKA MASIH AMAN (>0), LANJUT FLOW NORMAL (Uang Belanja / Drama)

                                        // --- FITUR BARU: RISIKO NIKAH MUDA ---
                                        // Semakin rendah INT (Kedewasaan) & Uang, semakin tinggi peluang Drama
                                        let dramaChance = 0.15; // Base 15%
                                        if (STATE.player.int < 30) dramaChance += 0.25; // +25% jika belum dewasa (INT rendah)
                                        if (STATE.player.money < 20000) dramaChance += 0.20; // +20% jika ekonomi sulit

                                        // Roll Drama (Hanya terjadi jika tidak telat)
                                        const isDrama = Math.random() < dramaChance;

                                        // Cek Saldo
                                        if (STATE.player.money >= dailyCost) {
                                            // Mampu Bayar
                                            STATE.player.money -= dailyCost;

                                            if (isLate) {
                                                // --- PASANGAN MARAH KARENA TELAT ---
                                                updateRelationship(spouse, -5, "Pulang Telat");
                                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit'); // Suara kecewa

                                                showDialogue(spouse.name,
                                                    `Kamu pulang jam berapa kemarin?! 😡\n\nKita kan sudah sepakat **wajib pulang sebelum jam 6 sore**!\nAku nungguin kamu sampai ketiduran.\n\nAku kecewa. (Cinta -5)\n*Dia mengambil 2.500 Gold dengan kasar untuk belanja.*`,
                                                    [{
                                                        text: `Maaf sayang... (Sisa: ${STATE.player.money.toLocaleString()} G)`,
                                                        action: closeDialogue
                                                    }],
                                                    spouse.imgSrc
                                                );
                                            }
                                            else if (isDrama) {
                                                // --- REALITA NIKAH MUDA (DRAMA) ---
                                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit'); // Suara kaget/sedih

                                                const dramas = [
                                                    {
                                                        title: "MENTAL BELUM SIAP",
                                                        text: "Jujur... aku iri liat story teman-temanku. Mereka lagi asik nongkrong dan traveling, sedangkan aku di sini terjebak ngurus rumah.\n\nKadang aku nyesel kita buru-buru nikah... Aku merasa masa mudaku hilang! 😭",
                                                        effect: () => {
                                                            updateRelationship(spouse, -5, "Penyesalan");
                                                            STATE.player.energy = Math.max(0, STATE.player.energy - 30); // Stress bikin lemas
                                                        },
                                                        btn: "Maafkan aku... (Cinta -5, Energi -30)"
                                                    },
                                                    {
                                                        title: "EMOSI LABIL",
                                                        text: "KAMU TUH GAK PEKA BANGET SIH! 😡\n\nAku capek! Aku maunya dimengerti! Jangan diem aja dong!\n\n(Dia marah-marah tanpa alasan jelas. Emosinya sangat tidak stabil hari ini).",
                                                        effect: () => {
                                                            updateRelationship(spouse, -8, "Emosi Labil");
                                                        },
                                                        btn: "Sabar... Sabar... (Cinta -8)"
                                                    },
                                                    {
                                                        title: "GUNCANGAN EKONOMI",
                                                        text: "Uang 2.500 ini cuma cukup buat makan! Belum bayar listrik, belum skincare, belum kuota...\n\nKita tuh miskin banget sih! Aku malu sama tetangga yang mobilnya baru! Kamu harus kerja lebih keras dong!",
                                                        effect: () => {
                                                            updateRelationship(spouse, -5, "Tuntutan Hidup");
                                                            STATE.player.reputation = Math.max(0, STATE.player.reputation - 5);
                                                        },
                                                        btn: "Aku akan berusaha... (Reputasi -5)"
                                                    },
                                                    {
                                                        title: "CEMBURU BUTA",
                                                        text: "Tadi aku liat kamu senyum-senyum sama orang lain di desa.\n\nNgaku! Kamu pasti bosen kan sama aku?! Kamu mau selingkuh ya?!\n\n(Ketidakamanan diri alias Insecure khas remaja yang menikah dini)",
                                                        effect: () => {
                                                            updateRelationship(spouse, -10, "Insecure");
                                                        },
                                                        btn: "Enggak sayang, sumpah! (Cinta -10)"
                                                    }
                                                ];

                                                const drama = dramas[Math.floor(Math.random() * dramas.length)];
                                                drama.effect();

                                                showDialogue(`${spouse.name} (Drama)`,
                                                    `**[REALITA NIKAH MUDA: ${drama.title}]**\n\n"${drama.text}"\n\n*Uang belanja 2.500 G diambil dengan ketus.*`,
                                                    [{
                                                        text: drama.btn,
                                                        action: closeDialogue
                                                    }],
                                                    spouse.imgSrc
                                                );

                                            } else {
                                                // --- PASANGAN BAHAGIA (NORMAL) ---
                                                // Family AP dari harmoni rumah tangga
                                                const harmonyAP = Math.floor((STATE.player.relationships[spouseId] || 0) / 20) + 1;
                                                STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + harmonyAP;
                                                createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                                                showDialogue(spouse.name,
                                                    `Selamat pagi sayang! ❤️\n\nTerima kasih sudah pulang tepat waktu kemarin.\nSeperti biasa, aku ambil **2.500 Gold** untuk belanja pasar ya.\n\nSarapan sudah siap!\n\n🏅 Keluarga Harmonis: +${harmonyAP} AP`,
                                                    [{
                                                        text: `Ikhlas (Sisa: ${STATE.player.money.toLocaleString()} G)`,
                                                        action: () => {
                                                            updateRelationship(spouse, 1);
                                                            closeDialogue();
                                                        }
                                                    }],
                                                    spouse.imgSrc
                                                );
                                            }
                                        } else {
                                            // Tidak Mampu Bayar (Hutang/Minus)
                                            STATE.player.money -= dailyCost; // Saldo jadi minus

                                            // Hukuman Dasar
                                            STATE.player.reputation = Math.max(0, STATE.player.reputation - 5);
                                            updateRelationship(spouse, -5, "Ekonomi Sulit");

                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('hit'); // Suara sedih/hit

                                            let msg = `Selamat pagi... sayang? 😟\n\nUang belanja di laci habis... Tukang sayur sudah menagih.\nAku terpaksa ngutang dulu.`;

                                            if (isLate) {
                                                // Hukuman Ganda jika Telat + Miskin
                                                updateRelationship(spouse, -5, "Combo Telat");
                                                msg = `Sudah pulang telat, uang belanja juga nggak ada?! 😭\n\nKamu niat berumah tangga nggak sih?! Aku malu sama tetangga!`;
                                            }

                                            showDialogue(spouse.name,
                                                msg + `\n\n(Saldo Minus! Reputasi & Cinta Berkurang)`,
                                                [{
                                                    text: `Maafkan aku... (Sisa: ${STATE.player.money.toLocaleString()} G)`,
                                                    action: closeDialogue
                                                }],
                                                spouse.imgSrc
                                            );
                                        }

                                        // Simpan lagi setelah transaksi otomatis
                                        manualSave();
                                    }, 1200); // Jeda setelah bangun tidur
                                }
                            }

                        }, 1000);

                    }, 2000); // Durasi layar hitam
                }, 100);
            }

            // ============================================================
