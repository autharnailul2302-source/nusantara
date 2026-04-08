// ══════════════════════════════════════════════════════════════
// Sistem Konflik Akademik (Mahasiswa)
// File: js/11-konflik-akademik.js
// ══════════════════════════════════════════════════════════════
            // 🎓 SISTEM KONFLIK AKADEMIK — ROLE STUDENT
            // Konflik kehidupan kampus: tugas, dosen, teman, tekanan akademik
            // ══════════════════════════════════════════════════════════════

            const STUDENT_CONFLICTS = [
                {
                    id: 'sc_tugas_kelompok',
                    title: '👥 Drama Tugas Kelompok',
                    text: 'Rani, teman sekelompokmu, tiba-tiba kirim pesan:\n\n"Hei, maaf aku tidak bisa bantu tugas kelompok besok. Ada urusan keluarga mendadak. Tolong kerjakan bagianku ya!"\n\nPadahal presentasi tinggal 2 hari lagi dan bagian Rani adalah inti dari presentasi.',
                    img: 'images/peer1.png',
                    reqDay: 2,
                    options: [
                        {
                            text: '📞 Hubungi Rani dan cari solusi bersama',
                            req: { stat: 'reputation', val: 15 },
                            outcome: 'good',
                            rep: +5, int: +1, money: 0,
                            msg: 'Setelah kamu menghubungi Rani, ternyata dia bisa bantu via online malam ini. Presentasi berjalan lancar!\n\n🎯 Nilai tugas kelompok: A\n\n📚 PELAJARAN: Komunikasi proaktif mencegah krisis. Jangan langsung marah — cari solusi dulu.',
                        },
                        {
                            text: '💪 Kerjakan semua sendiri, tunjukkan kamu bisa',
                            req: { stat: 'int', val: 18 },
                            outcome: 'neutral',
                            rep: 0, int: +2, money: 0,
                            msg: 'Kamu kerja keras semalam suntuk dan berhasil menyelesaikan semua bagian. Presentasi berhasil, tapi kamu kelelahan.\n\n📚 PELAJARAN: Mengerjakan semua sendiri bukan solusi berkelanjutan. Delegasi dan komunikasi tim lebih penting.',
                        },
                        {
                            text: '😤 Laporkan Rani ke dosen karena tidak bertanggung jawab',
                            outcome: 'bad',
                            rep: -8, int: 0, money: 0,
                            msg: 'Dosen memang menegur Rani, tapi teman-teman lain melihatmu sebagai "tukang lapor". Reputasimu di kampus menurun.\n\n📚 PELAJARAN: Melaporkan langsung sebelum mencoba komunikasi internal merusak kepercayaan tim. Selesaikan dulu di antara tim.',
                        }
                    ]
                },
                {
                    id: 'sc_dosen_nilai',
                    title: '📝 Nilai Tugas Tidak Adil?',
                    text: 'Prof. Wahyu memberikan nilaimu C untuk esai yang menurutmu sangat baik. Di sisi lain, teman yang esainya kamu rasa lebih sederhana malah dapat B.\n\n"Ini tidak adil!" batinmu.',
                    img: 'images/mejadosen.png',
                    reqDay: 3,
                    options: [
                        {
                            text: '📋 Minta jadwal konsultasi dengan dosen untuk diskusi nilainya',
                            req: { stat: 'int', val: 12 },
                            outcome: 'good',
                            rep: +8, int: +2, money: 0,
                            msg: 'Prof. Wahyu menjelaskan bahwa esaimu kurang dalam analisis kritis meski penyajiannya bagus. Beliau memberi kesempatan revisi!\n\n📚 PELAJARAN: Bertanya dengan santun kepada dosen adalah hak mahasiswa. Protes yang terstruktur menghasilkan solusi, bukan konfrontasi.',
                        },
                        {
                            text: '🤐 Terima saja, mungkin memang ada yang kurang',
                            outcome: 'neutral',
                            rep: +2, int: +1, money: 0,
                            msg: 'Kamu introspeksi dan baca ulang esaimu. Ternyata ada beberapa argumen yang memang kurang kuat. Pelajaran berharga!\n\n📚 PELAJARAN: Menerima kritik dengan lapang dada dan introspeksi adalah fondasi pertumbuhan akademik.',
                        },
                        {
                            text: '😠 Komplain keras di grup kelas dan mention nama dosen',
                            outcome: 'bad',
                            rep: -15, int: 0, money: -500,
                            msg: 'Komplainmu viral di grup kelas. Prof. Wahyu tidak senang dan nilaimu dikoreksi menjadi D. Kamu juga mendapat peringatan dari dekan.\n\n📚 PELAJARAN: Media sosial bukan tempat untuk melampiaskan komplain akademik. Jalur formal selalu lebih efektif dan tidak merusak nama baik.',
                        }
                    ]
                },
                {
                    id: 'sc_contek',
                    title: '📄 Teman Minta Jawaban Ujian',
                    text: 'Saat ujian tengah semester, Doni duduk di sebelahmu dan berbisik:\n\n"Bro, aku blank banget soal nomor 3. Boleh lihat jawabanmu sebentar? Kita teman kan..."\n\nPengawas ujian ada di sudut ruangan.',
                    img: 'images/peer3.png',
                    reqDay: 2,
                    options: [
                        {
                            text: '🙅 Tolak dengan halus: "Maaf, aku tidak mau kita sama-sama kena masalah"',
                            outcome: 'good',
                            rep: +5, int: +2, money: 0,
                            msg: 'Doni sedikit kecewa tapi mengerti. Setelah ujian, kamu tawarkan untuk belajar bareng sebelum ujian berikutnya.\n\n📚 PELAJARAN: Menolak permintaan yang salah adalah integritas. Menawarkan solusi yang benar — belajar bersama — adalah sikap teman sejati.',
                        },
                        {
                            text: '🙈 Pura-pura tidak dengar dan fokus ujianmu',
                            outcome: 'neutral',
                            rep: -2, int: +1, money: 0,
                            msg: 'Doni akhirnya mengerjakan sendiri. Nilai ujianmu bagus, tapi Doni sedikit menjaga jarak darimu.\n\n📚 PELAJARAN: Menghindari konflik memang tidak merusak integritasmu, tapi juga tidak membangun relasi. Komunikasi yang jelas lebih baik.',
                        },
                        {
                            text: '😅 Kasih contekan saja, kasihan dia',
                            outcome: 'bad',
                            rep: -10, int: -2, money: -1000,
                            msg: 'Pengawas melihat kalian. Nilai ujian kalian berdua dibatalkan dan kalian dipanggil ke ruang disiplin. Denda administrasi 1000G.\n\n📚 PELAJARAN: Di universitas, menyontek berujung pada nilai E, skorsing, bahkan Drop Out. Integritas akademik adalah pondasi karir profesional.',
                        }
                    ]
                },
                {
                    id: 'sc_bolos',
                    title: '😴 Dilema Bolos vs Hadir',
                    text: 'Hari ini ada kuliah jam 7 pagi. Kamu kurang tidur karena mengerjakan tugas hingga larut malam. Temanmu Wira mengajak:\n\n"Bro, bolos aja sekarang. Dosennya sering tidak absen juga kok. Nanti aku share catatannya."',
                    img: 'images/peer2.png',
                    reqDay: 2,
                    options: [
                        {
                            text: '🏃 Tetap hadir meski mengantuk',
                            outcome: 'good',
                            rep: +3, int: +2, money: 0,
                            msg: 'Ternyata dosen memberi pengumuman ujian mendadak minggu depan dan membagi materi khusus yang tidak ada di buku! Kehadiran terbayar.\n\n📚 PELAJARAN: Konsistensi hadir kuliah bukan sekadar soal absensi — informasi penting sering hanya disampaikan langsung di kelas.',
                        },
                        {
                            text: '😴 Bolos, tapi buka rekaman kuliah online sebagai gantinya',
                            req: { stat: 'int', val: 15 },
                            outcome: 'neutral',
                            rep: -1, int: +1, money: 0,
                            msg: 'Kamu berhasil memanfaatkan rekaman kuliah dengan baik. Tapi absensimu menipis — satu kali lagi bolos bisa kena sanksi.\n\n📚 PELAJARAN: Self-study membutuhkan disiplin diri yang kuat. Tidak semua orang bisa belajar efektif sendiri — kenali kemampuanmu.',
                        },
                        {
                            text: '😴 Bolos dan tidur seharian',
                            outcome: 'bad',
                            rep: -5, int: -1, money: 0,
                            msg: 'Kamu kebablasan tidur dan ketinggalan pemberitahuan ujian susulan. Absensimu juga sudah di batas minimum — satu bolos lagi dan kamu tidak boleh ikut UAS!\n\n📚 PELAJARAN: Batas absensi 75% di kampus bukan lelucon. Tidak boleh ujian akhir berarti nilai E — yang mengancam beasiswa dan kelulusan.',
                        }
                    ]
                },
                {
                    id: 'sc_mental',
                    title: '😰 Tekanan Akademik & Mental Health',
                    text: 'Sudah 3 hari ini kamu sulit tidur. Tumpukan tugas, deadline skripsi (kalau sudah tahun akhir), dan ekspektasi orang tua terasa berat sekali.\n\nTemanmu Lia menyadari dan bertanya: "Kamu baik-baik saja?"',
                    img: 'images/peer1.png',
                    reqDay: 2,
                    options: [
                        {
                            text: '🗣️ Curhat jujur ke Lia dan minta saran',
                            outcome: 'good',
                            rep: +7, int: 0, money: 0,
                            msg: 'Lia ternyata pernah merasakan hal yang sama. Kalian akhirnya bikin "study group" yang sehat — belajar bersama sekaligus saling support.\n\n📚 PELAJARAN: Mencari dukungan sosial saat tertekan adalah tanda kecerdasan emosional, bukan kelemahan. Support system adalah aset paling berharga di kampus.',
                        },
                        {
                            text: '📅 Buat jadwal belajar yang realistis dan mulai istirahat teratur',
                            req: { stat: 'int', val: 10 },
                            outcome: 'neutral',
                            rep: +2, int: +2, money: 0,
                            msg: 'Kamu mulai terapkan metode Pomodoro: 25 menit fokus, 5 menit istirahat. Produktivitasmu naik dan stresnya berkurang.\n\n📚 PELAJARAN: Manajemen waktu yang baik adalah skill yang lebih berharga daripada kecerdasan mentah. Otak perlu istirahat untuk belajar optimal.',
                        },
                        {
                            text: '😤 "Tidak apa-apa" — terus push diri sendiri tanpa istirahat',
                            outcome: 'bad',
                            rep: -3, int: -1, money: -1000,
                            msg: 'Sepekan kemudian kamu jatuh sakit dan terpaksa absen seminggu. Biaya berobat menguras kantong dan kamu ketinggalan materi banyak.\n\n📚 PELAJARAN: Burnout akademik adalah fenomena nyata. Tubuh yang sakit tidak bisa belajar. Jaga kesehatan fisik dan mental adalah investasi akademis.',
                        }
                    ]
                },
                {
                    id: 'sc_skripsi',
                    title: '📖 Konflik dengan Dosen Pembimbing',
                    text: 'Dosen pembimbingmu, Dr. Hasan, menolak bab 2 skripsimu untuk ketiga kalinya.\n\n"Tinjauan pustakaму tidak cukup mendalam. Tambah minimal 10 jurnal internasional lagi."\n\nKamu sudah revisi dua kali. Kamu mulai frustrasi.',
                    img: 'images/mejadosen.png',
                    reqDay: 3,
                    options: [
                        {
                            text: '📚 Minta panduan jurnal yang spesifik dari dosen dan buat timeline revisi',
                            req: { stat: 'int', val: 20 },
                            outcome: 'good',
                            rep: +10, int: +3, money: 0,
                            msg: 'Dr. Hasan terkesan dengan pendekatanmu yang profesional. Beliau malah membantu mencarikan jurnal yang tepat. Bab 2 akhirnya disetujui!\n\n📚 PELAJARAN: Menghadapi otoritas akademik dengan profesionalisme dan pertanyaan spesifik jauh lebih efektif daripada frustrasi diam-diam.',
                        },
                        {
                            text: '😤 Coba minta ganti dosen pembimbing ke ketua jurusan',
                            outcome: 'neutral',
                            rep: -3, int: 0, money: 0,
                            msg: 'Ketua jurusan menyarankanmu tetap dengan Dr. Hasan tapi memediasi komunikasi. Prosesnya memakan waktu 2 minggu ekstra.\n\n📚 PELAJARAN: Ganti pembimbing adalah opsi terakhir — butuh proses panjang dan seringkali memundurkan jadwal kelulusan.',
                        },
                        {
                            text: '🤫 Copas sedikit dari jurnal tanpa sitasi untuk mempercepat',
                            outcome: 'bad',
                            rep: -20, int: -3, money: -5000,
                            msg: 'Plagiarisme terdeteksi software Turnitin kampus! Skripsimu didiskualifikasi dan kamu harus mengulang dari awal. Kena sanksi administrasi 5000G.\n\n📚 PELAJARAN: Plagiarisme di skripsi berujung sanksi akademik berat hingga pencabutan gelar meski sudah lulus. Integritas akademik adalah harga mati.',
                        }
                    ]
                },
                {
                    id: 'sc_organisasi',
                    title: '🏛️ Tawaran Jadi Ketua Organisasi',
                    text: 'Temanmu mencalonkanmu sebagai Ketua BEM (Badan Eksekutif Mahasiswa). Ini kesempatan emas untuk leadership — tapi juga sangat menyita waktu kuliah.\n\nDosenmu memperingatkan: "IPmu sedang rawan, hati-hati."',
                    img: 'images/peer2.png',
                    reqDay: 2,
                    options: [
                        {
                            text: '⚖️ Terima tapi buat kesepakatan pembagian waktu yang jelas',
                            req: { stat: 'reputation', val: 20 },
                            outcome: 'good',
                            rep: +15, int: +1, money: 500,
                            msg: 'Kamu berhasil menyeimbangkan kepemimpinan BEM dan akademik. Pengalaman organisasimu menjadi nilai tambah besar di CV!\n\n📚 PELAJARAN: Organisasi kampus adalah investasi soft skill yang tidak bisa didapat di ruang kelas — tapi butuh manajemen waktu yang matang.',
                        },
                        {
                            text: '🙏 Tolak dengan sopan dan referensikan teman yang lebih siap',
                            outcome: 'neutral',
                            rep: +3, int: +2, money: 0,
                            msg: 'Kamu memilih fokus akademik. IPmu naik signifikan semester ini. Tapi teman yang kamu rekomendasikan berhasil dan berterima kasih padamu.\n\n📚 PELAJARAN: Mengenali prioritas dan mengakui batasan diri adalah kebijaksanaan. Tidak semua kesempatan bagus harus diambil di waktu yang salah.',
                        },
                        {
                            text: '🏃 Terima semua tanggung jawab tanpa persiapan',
                            outcome: 'bad',
                            rep: +2, int: -2, money: 0,
                            msg: 'Dua minggu kemudian kamu kewalahan. BEM berantakan dan IPmu turun drastis. Bahkan kamu terancam kehilangan beasiswa.\n\n📚 PELAJARAN: Overcommitment tanpa perencanaan adalah salah satu penyebab mahasiswa gagal. Ambil tanggung jawab sesuai kapasitas nyata.',
                        }
                    ]
                },
                {
                    id: 'sc_keuangan',
                    title: '💸 Uang SPP Hampir Habis',
                    text: 'Uangmu hampir tidak cukup untuk bayar UKT semester depan. Orang tuamu sudah berkorban banyak.\n\nTemanmu menawarkan: "Coba ajukan beasiswa Peningkatan Prestasi Akademik — deadline-nya 3 hari lagi."',
                    img: 'images/peer1.png',
                    reqDay: 2,
                    options: [
                        {
                            text: '📝 Langsung kumpulkan berkas dan ajukan beasiswa',
                            req: { stat: 'int', val: 15 },
                            outcome: 'good',
                            rep: +5, int: +2, money: 8000,
                            msg: 'Beasiswamu diterima! Kamu mendapat bantuan biaya kuliah + uang saku.\n\n📚 PELAJARAN: Beasiswa bukan hanya untuk yang "jenius" — tapi untuk yang proaktif dan gigih mencari peluang. Deadline adalah kesempatan yang tidak menunggu.',
                        },
                        {
                            text: '📞 Minta bantuan ke orang tua dulu sambil cari beasiswa',
                            outcome: 'neutral',
                            rep: +1, int: 0, money: 0,
                            msg: 'Orang tuamu membantu meski berat. Kamu berjanji akan lebih mandiri ke depan dan mulai cari kerja part-time.\n\n📚 PELAJARAN: Minta bantuan keluarga sah dan manusiawi — tapi diiringi inisiatif mandiri agar tidak terus bergantung.',
                        },
                        {
                            text: '😰 Diam saja, berharap ada jalan keluar sendiri',
                            outcome: 'bad',
                            rep: -3, int: 0, money: -3000,
                            msg: 'Deadline beasiswa lewat. Kamu terpaksa pinjam uang dengan bunga. Cicilan bulanan kini menambah beban hidupmu.\n\n📚 PELAJARAN: Menunda pengambilan tindakan karena panik adalah jebakan yang mahal. Masalah keuangan kuliah selalu punya solusi — jika dicari aktif.',
                        }
                    ]
                }
            ];

            let studentConflictCooldown = 0;

            function maybeRunStudentConflict() {
                const p = STATE.player;
                if (!p.major) return;
                if (studentConflictCooldown > 0) { studentConflictCooldown--; return; }

                // Konflik muncul tiap 3-5 hari, probabilitas 50%
                const roll = Math.random();
                if (roll > 0.50) return;

                // Pilih konflik yang belum pernah muncul (prioritas) atau random
                const shownIds = p.shownStudentConflicts || [];
                const unshown = STUDENT_CONFLICTS.filter(c => !shownIds.includes(c.id));
                const pool = unshown.length > 0 ? unshown : STUDENT_CONFLICTS;
                const conflict = pool[Math.floor(Math.random() * pool.length)];

                p.shownStudentConflicts = [...(p.shownStudentConflicts || [])];
                if (!p.shownStudentConflicts.includes(conflict.id)) {
                    p.shownStudentConflicts.push(conflict.id);
                }

                studentConflictCooldown = conflict.reqDay || 2;

                const opts = conflict.options.map(opt => {
                    let label = opt.text;
                    if (opt.req) label += ` [${opt.req.stat.toUpperCase().replace('REPUTATION','REP')} ${opt.req.val}+]`;
                    return {
                        text: label,
                        action: () => {
                            let success = true;
                            if (opt.req) {
                                const statMap = { int:'int', reputation:'reputation', str:'str', biz:'biz' };
                                const s = statMap[opt.req.stat] || opt.req.stat;
                                if ((p[s] || 0) < opt.req.val) success = false;
                            }

                            const outcome = success ? opt.outcome : 'bad';
                            const msg = success ? opt.msg : `Kemampuanmu belum cukup untuk pilihan ini (butuh ${opt.req ? opt.req.stat.toUpperCase() + ' ' + opt.req.val : '?'}). Situasinya memburuk.\n\n📚 Terus tingkatkan statmu!`;
                            const repChange = success ? (opt.rep || 0) : -5;
                            const intChange = success ? (opt.int || 0) : 0;
                            const moneyChange = success ? (opt.money || 0) : 0;

                            p.reputation = Math.max(0, (p.reputation || 0) + repChange);
                            p.int = Math.max(0, (p.int || 0) + intChange);
                            if (moneyChange !== 0) {
                                p.money = Math.max(0, p.money + moneyChange);
                                if (moneyChange > 0) showToast(`💰 +${moneyChange.toLocaleString()} G`);
                                else showToast(`💸 ${moneyChange.toLocaleString()} G`);
                            }
                            if (repChange !== 0) showToast(`${repChange > 0 ? '📈' : '📉'} REP ${repChange > 0 ? '+' : ''}${repChange}`);
                            if (intChange !== 0) showToast(`${intChange > 0 ? '🧠' : '😵'} INT ${intChange > 0 ? '+' : ''}${intChange}`);

                            // ── SISTEM INTEGRITAS AKADEMIK ──────────────────────────
                            if (outcome === 'bad') {
                                p.integrityScore = Math.max(0, (p.integrityScore || 100) - 18);
                                showToast(`⚠️ Integritas Akademik: ${p.integrityScore}/100`);
                                if (p.integrityScore < 50 && !p.lowIntegrityWarned) {
                                    p.lowIntegrityWarned = true;
                                    setTimeout(() => {
                                        showDialogue('📋 REPUTASI AKADEMIK MENURUN',
                                            `Rekam jejakmu mulai dikenal negatif di kampus.\n\n🔴 Integritas: ${p.integrityScore}/100\n\nDosen lebih skeptis terhadap pekerjaanmu. Beberapa peluang beasiswa tertutup.\n\n📚 Setiap keputusan curang meninggalkan jejak yang sulit dihapus.`,
                                            [{ text: 'Aku akan berubah...', action: closeDialogue }], 'images/mejadosen.png');
                                    }, 1500);
                                } else if (p.integrityScore < 20 && !p.criticalIntegrityWarned) {
                                    p.criticalIntegrityWarned = true;
                                    const intPenalty = Math.max(1, Math.floor((p.int || 1) * 0.1));
                                    p.int = Math.max(1, (p.int || 1) - intPenalty);
                                    setTimeout(() => {
                                        showDialogue('🚨 SIDANG AKADEMIK',
                                            `Dewan Akademik memanggil kamu!\n\n"Kami menerima laporan berulang tentang perilaku tidak jujur. Ini peringatan keras terakhir."\n\n💔 Integritas: ${p.integrityScore}/100\n📉 INT -${intPenalty} (Konsentrasi belajar menurun akibat tekanan)\n\n📚 Di dunia nyata, catatan akademik yang buruk bisa menutup pintu karir seumur hidup.`,
                                            [{ text: 'Saya mengerti...', action: closeDialogue }], 'images/mejadosen.png');
                                    }, 1500);
                                }
                            } else if (outcome === 'good') {
                                p.integrityScore = Math.min(100, (p.integrityScore || 100) + 5);
                                if (p.integrityScore >= 70) { p.lowIntegrityWarned = false; p.criticalIntegrityWarned = false; }
                            }
                            // ────────────────────────────────────────────────────────

                            if (outcome === 'good') gainExp(20);
                            else if (outcome === 'neutral') gainExp(8);

                            const icon = outcome === 'good' ? '🎉' : outcome === 'neutral' ? '😐' : '😔';
                            closeDialogue();
                            setTimeout(() => {
                                showDialogue('📊 HASIL KEPUTUSAN',
                                    `${icon} ${msg}\n\n📊 REP: ${Math.round(p.reputation || 0)} | INT: ${Math.round(p.int || 0)}`,
                                    [{ text: 'Mengerti, terima kasih!', action: closeDialogue }],
                                    conflict.img
                                );
                            }, 300);
                        }
                    };
                });

                opts.push({ text: '😰 Hindari situasi ini (REP -3)', action: () => {
                    p.reputation = Math.max(0, (p.reputation || 0) - 3);
                    showToast('😰 Kamu menghindari konflik. REP -3');
                    closeDialogue();
                }});

                showDialogue(`🎓 KEHIDUPAN KAMPUS — ${conflict.title}`, conflict.text, opts, conflict.img);
            }

            // ══════════════════════════════════════════════════════════════
