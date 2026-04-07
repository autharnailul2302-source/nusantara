// ========================================================
// js/11_conflict_system.js
// Konflik Kerja, Akademik, Wirausaha
// ========================================================

            // ══════════════════════════════════════════════════════════════
            // 💥 SISTEM KONFLIK TEMPAT KERJA
            // Konflik muncul random saat shift aktif, mempengaruhi bossReputation
            // Rep tinggi → bonus gaji, promosi. Rep rendah → peringatan, pecat.
            // ══════════════════════════════════════════════════════════════

            const WORK_CONFLICTS = {
                // ── FULL-TIME: MERCHANT (boss_merchant / Pak Hendra) ──────────────
                fulltime: [
                    {
                        id: 'fc_telat',
                        title: '⏰ Terlambat Masuk',
                        text: 'Pak Hendra memanggil kamu ke ruangannya.\n\n"Kamu terlambat 30 menit hari ini. Ini bukan pertama kali. Saya butuh penjelasan!"',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🙏 Minta maaf dengan tulus dan berjanji berubah',
                                outcome: 'good',
                                msg: '"Saya hargai kejujuranmu. Tapi jangan terulang lagi! Reputasimu masih bisa saya pertahankan."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Meminta maaf dengan tulus dan berkomitmen memperbaiki diri adalah sikap profesional yang dihargai atasan.'
                            },
                            {
                                text: '📱 Beri alasan macet dan tunjukkan bukti foto',
                                req: { stat: 'int', val: 12 },
                                outcome: 'neutral',
                                msg: '"Hmm, ada buktinya. Oke, kali ini saya maklumi. Tapi cari solusi alternatif ke depannya."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Alasan yang valid perlu didukung bukti. Inisiatif mencari solusi alternatif lebih dihargai daripada sekadar alasan.'
                            },
                            {
                                text: '😤 Protes balik — "Kemarin saya lembur Pak!"',
                                outcome: 'bad',
                                msg: '"Lembur kemarin tidak ada hubungannya dengan keterlambatan hari ini! Surat peringatan pertama kamu terbit!"',
                                rep: -10, money: 0,
                                lesson: '📚 PELAJARAN: Membela diri dengan menyerang balik hanya memperburuk konflik. Di dunia kerja, timing dan cara merespons sangat penting.'
                            }
                        ]
                    },
                    {
                        id: 'fc_rekan',
                        title: '👥 Konflik dengan Rekan Kerja',
                        text: 'Pak Hendra memanggilmu.\n\n"Saya dengar kamu dan Rudi berselisih soal pembagian tugas gudang. Dia bilang kamu tidak mau membantu. Ceritakan versiku."',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🤝 Akui kesalahan dan tawarkan mediasi bersama',
                                outcome: 'good',
                                msg: '"Bagus! Karyawan yang dewasa bisa menyelesaikan konflik secara konstruktif. Saya catat ini positif."',
                                rep: +8, money: 0,
                                lesson: '📚 PELAJARAN: Menyelesaikan konflik secara dewasa dan proaktif menunjukkan kematangan emosional yang sangat dihargai di tempat kerja.'
                            },
                            {
                                text: '📋 Jelaskan pembagian tugas berdasarkan fakta',
                                req: { stat: 'int', val: 15 },
                                outcome: 'neutral',
                                msg: '"Data pembagianmu masuk akal. Saya akan bicara dengan Rudi juga. Tapi cobalah lebih komunikatif ke depannya."',
                                rep: +3, money: 0,
                                lesson: '📚 PELAJARAN: Fakta dan data membantu penyelesaian konflik secara objektif, tapi komunikasi aktif sejak awal mencegah konflik terjadi.'
                            },
                            {
                                text: '🗣️ Balik menyalahkan Rudi sepenuhnya',
                                outcome: 'bad',
                                msg: '"Ini bukan sidang! Saya tidak suka kamu lempar tanggung jawab. Kerja sama tim adalah kewajiban, bukan pilihan!"',
                                rep: -12, money: 0,
                                lesson: '📚 PELAJARAN: Menyalahkan rekan kerja hanya memperburuk hubungan tim. Atasan menghargai karyawan yang mengambil tanggung jawab, bukan yang mencari kambing hitam.'
                            }
                        ]
                    },
                    {
                        id: 'fc_stok',
                        title: '📦 Kesalahan Stok Barang',
                        text: 'Pak Hendra datang dengan wajah tegang.\n\n"Ada ketidakcocokan stok 15 unit Beras Premium. Laporan kamu kemarin bilang stok aman, tapi sekarang kosong. Apa yang terjadi?!"',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🔍 Lakukan audit dan laporkan temuan secara transparan',
                                req: { stat: 'int', val: 10 },
                                outcome: 'good',
                                msg: '"Terima kasih sudah transparan dan proaktif! Ternyata memang ada bug di sistem input. Kamu tidak bersalah, dan saya hargai inisiatifmu."',
                                rep: +10, money: 500,
                                lesson: '📚 PELAJARAN: Transparansi dan inisiatif menyelesaikan masalah adalah karakter karyawan terbaik. Atasan menghargai kejujuran meski hasilnya tidak enak.'
                            },
                            {
                                text: '😓 Minta maaf dan berjanji teliti lebih hati-hati',
                                outcome: 'neutral',
                                msg: '"Baiklah. Saya minta kamu double-check setiap laporan mulai besok. Ini jadi catatan kinerja kamu."',
                                rep: -3, money: 0,
                                lesson: '📚 PELAJARAN: Minta maaf itu penting, tapi tanpa solusi konkret hanya mengurangi kepercayaan. Selalu sertakan rencana perbaikan.'
                            },
                            {
                                text: '🤷 Bilang itu bukan tanggung jawabmu',
                                outcome: 'bad',
                                msg: '"Kamu yang bertugas input stok hari itu! Surat Peringatan resmi keluar sekarang. Jika sekali lagi, kamu saya keluarkan!"',
                                rep: -18, money: -1000,
                                lesson: '📚 PELAJARAN: Menghindari tanggung jawab adalah salah satu alasan paling umum seseorang kehilangan pekerjaan. Kepercayaan atasan dibangun dari akuntabilitas.'
                            }
                        ]
                    },
                    {
                        id: 'fc_lembur',
                        title: '🌙 Diminta Lembur Mendadak',
                        text: 'Pak Hendra menghampirimu menjelang pulang.\n\n"Kita ada kiriman besar malam ini. Kamu bisa lembur 2 jam? Ada kompensasi tentu saja."',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '✅ Setuju lembur dengan semangat',
                                outcome: 'good',
                                msg: '"Luar biasa! Ini yang saya harapkan dari karyawan terbaik. Kompensasi akan saya proses besok."',
                                rep: +10, money: 2000,
                                lesson: '📚 PELAJARAN: Fleksibilitas dan dedikasi saat dibutuhkan membangun reputasi kerja keras yang berharga untuk karir jangka panjang.'
                            },
                            {
                                text: '🤔 Minta kejelasan kompensasi dulu sebelum setuju',
                                req: { stat: 'int', val: 8 },
                                outcome: 'neutral',
                                msg: '"Pertanyaan bagus dan profesional! Lembur 2 jam = 1.500 G. Setuju? Kamu tahu hak kamu."',
                                rep: +4, money: 1500,
                                lesson: '📚 PELAJARAN: Menanyakan kompensasi lembur adalah hak karyawan yang dijamin UU. Karyawan yang paham haknya justru dihormati atasan yang profesional.'
                            },
                            {
                                text: '❌ Menolak tanpa alasan jelas',
                                outcome: 'bad',
                                msg: '"Baik, tidak apa-apa. Tapi saya catat ini dalam evaluasi kinerja kamu. Dedikasi itu penting."',
                                rep: -7, money: 0,
                                lesson: '📚 PELAJARAN: Menolak lembur boleh saja, tapi harus dengan alasan yang jelas. Komunikasi yang baik menjaga hubungan kerja tetap profesional.'
                            }
                        ]
                    },
                    {
                        id: 'fc_gosip',
                        title: '🗣️ Terseret Gosip Kantor',
                        text: 'Pak Hendra memanggilmu dengan serius.\n\n"Saya dengar kamu menyebarkan informasi tentang rencana restrukturisasi perusahaan ke karyawan lain. Apa benar?"',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🤐 Jujur bahwa tidak sengaja dan berjanji menjaga kerahasiaan',
                                outcome: 'good',
                                msg: '"Saya menghargai kejujuranmu. Informasi internal harus dijaga. Kali ini saya maafkan, tapi ingat — kerahasiaan adalah profesionalisme."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Kerahasiaan informasi perusahaan (confidentiality) adalah kewajiban etis setiap karyawan. Melanggar dapat berujung pada pemutusan hubungan kerja.'
                            },
                            {
                                text: '🛡️ Jelaskan bahwa itu hanya diskusi umum, bukan gosip',
                                req: { stat: 'rep', val: 20 },
                                outcome: 'neutral',
                                msg: '"Hmm, reputasimu selama ini baik. Saya percaya niatmu tidak buruk. Tapi hati-hati ke depan."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Reputasi yang baik bisa jadi "tameng" dalam situasi sulit. Membangun kepercayaan sejak awal sangat penting.'
                            },
                            {
                                text: '😠 Menyangkal keras dan balik menuduh rekan lain',
                                outcome: 'bad',
                                msg: '"Kamu menyangkal fakta dan menyerang orang lain. Ini sangat tidak profesional. SP2 kamu terbit hari ini!"',
                                rep: -15, money: 0,
                                lesson: '📚 PELAJARAN: Menyangkal dan menyerang orang lain saat konfrontasi hanya memperburuk situasi. Sikap defensif menghancurkan kepercayaan atasan.'
                            }
                        ]
                    },
                    {
                        id: 'fc_promosi',
                        title: '🏆 Evaluasi Kinerja Tahunan',
                        text: 'Pak Hendra duduk bersamamu.\n\n"Waktunya evaluasi kinerja. Berdasarkan catatan saya, kamu cukup konsisten. Tapi ada hal yang perlu kita diskusikan untuk mendapat promosi..."',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '📊 Presentasi pencapaian dengan data dan rencana ke depan',
                                req: { stat: 'int', val: 15 },
                                outcome: 'good',
                                msg: '"Impressive! Kamu sudah berpikir seperti seorang manajer. Saya rekomendasikan kamu untuk promosi jabatan!"',
                                rep: +20, money: 5000, promote: true,
                                lesson: '📚 PELAJARAN: Evaluasi kinerja adalah kesempatan emas. Karyawan yang datang dengan data pencapaian dan rencana jelas jauh lebih mungkin mendapat promosi.'
                            },
                            {
                                text: '😊 Berterima kasih dan minta feedback perbaikan',
                                outcome: 'neutral',
                                msg: '"Sikap yang baik! Saya suka karyawan yang mau belajar. Kamu masih perlu 1-2 bulan lagi untuk promosi, tapi kamu di jalur yang benar."',
                                rep: +10, money: 1000,
                                lesson: '📚 PELAJARAN: Meminta feedback adalah tanda kematangan profesional. Karyawan yang mau terus belajar lebih cepat berkembang dalam karir.'
                            },
                            {
                                text: '💰 Langsung tuntut kenaikan gaji tanpa diskusi',
                                outcome: 'bad',
                                msg: '"Permintaan kenaikan gaji tanpa prestasi yang mendukung? Kamu perlu introspeksi dulu sebelum tuntut lebih."',
                                rep: -8, money: 0,
                                lesson: '📚 PELAJARAN: Menuntut kenaikan gaji tanpa dasar prestasi yang jelas menunjukkan kurangnya pemahaman tentang dinamika profesional.'
                            }
                        ]
                    }
                ],
                // ── PART-TIME: BENGKEL (Bang Joko) ────────────────────────────────
                bengkel: [
                    {
                        id: 'pt_b_rusak',
                        title: '🔨 Alat Kerja Rusak',
                        text: 'Bang Joko memanggil kamu.\n\n"Palu tempa yang kamu pakai tadi kepala-nya copot dan hampir kena kaki pelanggan. Untung tidak ada yang cedera. Kamu tidak cek dulu sebelum pakai?"',
                        img: 'images/blacksmith.png',
                        options: [
                            {
                                text: '🙏 Minta maaf dan usulkan SOP pengecekan alat rutin',
                                req: { stat: 'int', val: 10 },
                                outcome: 'good',
                                msg: '"Ide yang bagus! Kalau kamu buat SOP-nya, itu inisiatif luar biasa untuk anak magang. Saya tambah bonus hari ini."',
                                rep: +8, money: 500,
                                lesson: '📚 PELAJARAN: Mengubah kesalahan menjadi perbaikan sistem menunjukkan mentalitas problem-solver yang dihargai di tempat kerja manapun.'
                            },
                            {
                                text: '😅 Minta maaf dan berjanji lebih teliti',
                                outcome: 'neutral',
                                msg: '"Oke, lain kali cek dulu kondisi alat sebelum dipakai. Keselamatan kerja bukan main-main di sini."',
                                rep: -2, money: 0,
                                lesson: '📚 PELAJARAN: Keselamatan dan kesehatan kerja (K3) adalah prioritas utama di lingkungan industri. Pengecekan alat adalah prosedur wajib.'
                            },
                            {
                                text: '🤷 "Palu-nya memang sudah longgar dari tadi Bang"',
                                outcome: 'bad',
                                msg: '"Kalau tahu sudah longgar, kenapa tidak lapor?! Ini bukan soal siapa yang salah — ini soal keselamatan orang! Saya kurangi gaji hari ini."',
                                rep: -15, money: -500,
                                lesson: '📚 PELAJARAN: Mengetahui risiko tapi tidak melaporkan adalah kelalaian serius. Di industri, ini bisa berujung pada sanksi hukum, bukan sekadar teguran.'
                            }
                        ]
                    },
                    {
                        id: 'pt_b_pesanan',
                        title: '📋 Pesanan Salah Ukuran',
                        text: 'Bang Joko cemberut.\n\n"Pelanggan tadi komplain. Pedang yang dia pesan ukuran L, tapi yang kamu kerjakan ukuran M. Ini membuang material dan waktu!"',
                        img: 'images/blacksmith.png',
                        options: [
                            {
                                text: '📝 Ambil tanggung jawab dan tawarkan mengerjakan ulang tanpa tambah biaya',
                                req: { stat: 'str', val: 10 },
                                outcome: 'good',
                                msg: '"Nah itu baru namanya bertanggung jawab! Saya suka. Pelanggan puas, reputasi toko terjaga. Bagus!"',
                                rep: +10, money: 0,
                                lesson: '📚 PELAJARAN: Service recovery yang cepat dan tulus bisa mengubah pelanggan yang kecewa menjadi pelanggan setia. Tanggung jawab adalah fondasi kepercayaan.'
                            },
                            {
                                text: '🔍 Cek ulang catatan pesanan dan tunjukkan fakta',
                                outcome: 'neutral',
                                msg: '"Hmm, ternyata catatannya memang ambigu. Kali ini kita sama-sama salah. Besok buat sistem konfirmasi ulang pesanan."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Dokumentasi yang jelas mencegah miskomunikasi. Sistem konfirmasi pesanan adalah standar profesional di bisnis manapun.'
                            },
                            {
                                text: '😤 Bilang pelanggannya yang salah pesan',
                                outcome: 'bad',
                                msg: '"Di toko saya, pelanggan selalu benar! Kamu kerja untuk melayani, bukan berdebat. Awas kalau terulang!"',
                                rep: -12, money: 0,
                                lesson: '📚 PELAJARAN: Mentalitas "pelanggan adalah raja" bukan berarti membiarkan pelanggan salah — tapi memastikan komunikasi berjalan baik sejak awal.'
                            }
                        ]
                    },
                    {
                        id: 'pt_b_senior',
                        title: '😤 Senioritas dan Tekanan',
                        text: 'Roni, pegawai senior bengkel, sering menyuruhmu mengerjakan tugas berat yang bukan bagianmu. Hari ini Bang Joko melihatnya.\n\n"Hei, ada apa ini?"',
                        img: 'images/blacksmith.png',
                        options: [
                            {
                                text: '🗣️ Ceritakan situasi dengan tenang dan objektif',
                                outcome: 'good',
                                msg: '"Terima kasih sudah lapor! Roni memang harus tahu batas. Kamu bagian dari tim ini, bukan bawahan personal siapapun."',
                                rep: +7, money: 0,
                                lesson: '📚 PELAJARAN: Senioritas bukan alasan untuk mengeksploitasi junior. Melaporkan dengan cara yang tepat adalah hak dan langkah yang benar.'
                            },
                            {
                                text: '🤝 Bilang tidak apa-apa, kamu senang membantu',
                                outcome: 'neutral',
                                msg: '"Kamu terlalu baik hati! Ingat, kerja keras itu baik, tapi kenali batasanmu agar tidak terbakar. Saya akan bicara dengan Roni."',
                                rep: +1, money: 0,
                                lesson: '📚 PELAJARAN: Menerima semua beban kerja demi dianggap "baik" bisa berujung burnout. Mengenali batasan adalah bentuk manajemen diri yang sehat.'
                            },
                            {
                                text: '😠 Konfrontasi langsung dan emosional dengan Roni',
                                outcome: 'bad',
                                msg: '"Hei! Jangan ribut di depan pelanggan! Urus masalah kalian di luar waktu kerja. Kamu dapat SP hari ini!"',
                                rep: -10, money: 0,
                                lesson: '📚 PELAJARAN: Konflik di tempat kerja harus diselesaikan melalui jalur yang tepat. Konfrontasi emosional di depan umum merusak citra profesional kamu.'
                            }
                        ]
                    }
                ],
                // ── PART-TIME: PENJAHIT (Marine) ──────────────────────────────────
                penjahit: [
                    {
                        id: 'pt_p_pelanggan',
                        title: '👗 Komplain Jahitan Tidak Rapi',
                        text: 'Marine memanggilmu.\n\n"Bu Sari mengeluh bahwa jahitan di bagian lengan baju pesanannya tidak rapi dan benangnya sudah lepas. Dia sangat kecewa."',
                        img: 'images/marine.png',
                        options: [
                            {
                                text: '🧵 Minta maaf dan segera perbaiki dengan gratis',
                                outcome: 'good',
                                msg: '"Perfect! Pelayanan seperti ini yang membuat pelanggan kembali lagi. Bu Sari malah memuji responsmu. Bagus sekali!"',
                                rep: +10, money: 300,
                                lesson: '📚 PELAJARAN: Pelayanan purna jual yang responsif adalah pembeda bisnis berkualitas. 1 pelanggan puas bisa bawa 10 pelanggan baru.'
                            },
                            {
                                text: '🔍 Periksa apakah itu jahitanmu atau jahitan orang lain',
                                req: { stat: 'int', val: 8 },
                                outcome: 'neutral',
                                msg: '"Ternyata itu hasil jahitan minggu lalu bukan kamu. Tapi kamu harus tetap bantu perbaiki ya — kita satu tim di sini."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Meski bukan kesalahan kamu, membantu menyelesaikan masalah tim menunjukkan solidaritas dan profesionalisme.'
                            },
                            {
                                text: '😤 Bilang itu bukan jahitanmu jadi bukan tanggung jawabmu',
                                outcome: 'bad',
                                msg: '"Di sini, kita bertanggung jawab bersama! Sikap seperti itu tidak ada tempat di usahaku. Kurangi upah hari ini!"',
                                rep: -12, money: -500,
                                lesson: '📚 PELAJARAN: Tanggung jawab kolektif adalah budaya kerja yang penting. Menghindari masalah tim membuat kamu terlihat tidak kooperatif.'
                            }
                        ]
                    },
                    {
                        id: 'pt_p_deadline',
                        title: '⏰ Deadline Pesanan Mendesak',
                        text: 'Marine terlihat panik.\n\n"Ada pesanan baju pengantin yang harus selesai besok pagi, tapi kita ketinggalan! Kamu bisa bantu lembur malam ini?"',
                        img: 'images/marine.png',
                        options: [
                            {
                                text: '✅ Setuju lembur dan bagi strategi pengerjaan efisien',
                                req: { stat: 'int', val: 12 },
                                outcome: 'good',
                                msg: '"Kamu luar biasa! Strategi pembagian pola yang kamu usul memotong waktu 2 jam. Bonus khusus malam ini!"',
                                rep: +12, money: 1500,
                                lesson: '📚 PELAJARAN: Di saat krisis, karyawan yang datang dengan solusi — bukan hanya kesediaan — adalah aset terbesar.'
                            },
                            {
                                text: '✅ Setuju lembur meski lelah',
                                outcome: 'neutral',
                                msg: '"Terima kasih! Kamu tim yang solid. Pesanan selesai tepat waktu dan pelanggan sangat senang."',
                                rep: +8, money: 1000,
                                lesson: '📚 PELAJARAN: Komitmen saat dibutuhkan membangun kepercayaan yang tidak bisa dibeli dengan apapun di lingkungan kerja.'
                            },
                            {
                                text: '❌ Menolak karena sudah terlalu lelah',
                                outcome: 'bad',
                                msg: '"Saya mengerti kamu lelah... tapi pelanggan kita kecewa. Kita kehilangan kepercayaan mereka malam ini."',
                                rep: -5, money: 0,
                                lesson: '📚 PELAJARAN: Menjaga energi itu penting, tapi di momen kritis, pertimbangkan dampak ke tim dan pelanggan. Komunikasi lebih awal bisa mencegah situasi ini.'
                            }
                        ]
                    },
                    {
                        id: 'pt_p_bahan',
                        title: '🧶 Bahan Kain Habis Saat Kritis',
                        text: 'Marine menatap lemari bahan dengan cemas.\n\n"Kain batik tulis untuk pesanan Bu Mira habis! Supplier belum tentu bisa kirim sebelum besok. Kamu ada ide?"',
                        img: 'images/marine.png',
                        options: [
                            {
                                text: '💡 Usulkan alternatif kain yang similar dengan approval pelanggan',
                                req: { stat: 'int', val: 10 },
                                outcome: 'good',
                                msg: '"Ide brilian! Bu Mira setuju dengan alternatifnya malah suka lebih. Kamu sudah berpikir seperti seorang pengusaha!"',
                                rep: +10, money: 800,
                                lesson: '📚 PELAJARAN: Kreativitas dalam menyelesaikan masalah — apalagi yang melibatkan keputusan bersama pelanggan — adalah skill wirausaha tingkat tinggi.'
                            },
                            {
                                text: '📞 Hubungi supplier darurat meski mahal',
                                outcome: 'neutral',
                                msg: '"Sedikit mahal tapi pesanan tetap selesai. Lain kali kita perlu sistem monitoring stok yang lebih baik."',
                                rep: +4, money: 0,
                                lesson: '📚 PELAJARAN: Manajemen stok yang baik mencegah situasi kritis. Selalu siapkan supplier cadangan sebagai antisipasi.'
                            },
                            {
                                text: '🤷 Bilang itu bukan tanggung jawab kamu',
                                outcome: 'bad',
                                msg: '"Di sini semua adalah tanggung jawab tim! Sikap pasif seperti itu tidak berguna di saat krisis."',
                                rep: -10, money: 0,
                                lesson: '📚 PELAJARAN: Bersikap pasif di saat krisis membuat kamu tidak berharga di mata tim. Kontribusi aktif, meski kecil, selalu lebih baik.'
                            }
                        ]
                    }
                ],
                // ── PART-TIME: KLINIK (Dr. Budi) ──────────────────────────────────
                klinik: [
                    {
                        id: 'pt_k_privasi',
                        title: '🔒 Kerahasiaan Data Pasien',
                        text: 'Dr. Budi memanggilmu dengan serius.\n\n"Saya dengar kamu sempat cerita ke temanmu soal kondisi pasien yang tadi datang. Apakah benar?"',
                        img: 'images/lover1boy.png',
                        options: [
                            {
                                text: '🙏 Akui kesalahan dan minta maaf — tidak akan terulang',
                                outcome: 'good',
                                msg: '"Saya hargai kejujuranmu. Kerahasiaan pasien adalah hukum, bukan sekadar aturan. Kali ini saya maafkan. Jangan terulang."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Kerahasiaan data pasien (patient confidentiality) dilindungi oleh UU Kesehatan. Melanggarnya bisa berujung pada sanksi hukum dan pencabutan izin kerja.'
                            },
                            {
                                text: '🛡️ Jelaskan tidak ada identitas spesifik yang disebutkan',
                                req: { stat: 'int', val: 12 },
                                outcome: 'neutral',
                                msg: '"Memang ada gradasi, tapi lebih aman hindari sama sekali. Di bidang kesehatan, privasi adalah prioritas mutlak."',
                                rep: +1, money: 0,
                                lesson: '📚 PELAJARAN: Bahkan data yang "tidak identifiable" tetap bisa melanggar privasi. Standar di bidang kesehatan sangat ketat untuk alasan yang sangat penting.'
                            },
                            {
                                text: '😤 Menyangkal keras bahwa kamu tidak melakukan itu',
                                outcome: 'bad',
                                msg: '"Saya punya konfirmasi dari pihak ketiga. Berbohong membuat situasinya jauh lebih serius. SP tertulis dikeluarkan hari ini!"',
                                rep: -20, money: 0,
                                lesson: '📚 PELAJARAN: Berbohong saat dihadapkan pada bukti adalah kesalahan terbesar. Kejujuran, meski pahit, selalu lebih baik untuk reputasi jangka panjang.'
                            }
                        ]
                    },
                    {
                        id: 'pt_k_salah_obat',
                        title: '💊 Hampir Salah Siapkan Obat',
                        text: 'Dr. Budi menghentikanmu tepat waktu.\n\n"Stop! Obat yang kamu ambil itu Amoxicillin 500mg, bukan yang 250mg untuk pasien anak ini. Kamu hampir buat kesalahan serius!"',
                        img: 'images/lover1boy.png',
                        options: [
                            {
                                text: '😰 Minta maaf dengan sungguh-sungguh dan minta sistem double-check',
                                outcome: 'good',
                                msg: '"Terima kasih sudah jujur dan proaktif. Sistem double-check memang harus kita terapkan. Kamu belajar dari hampir-kesalahan, itu sikap yang benar."',
                                rep: +8, money: 0,
                                lesson: '📚 PELAJARAN: Sistem double-check dalam farmasi adalah standar internasional. Near-miss (hampir salah) harus dilaporkan dan dijadikan pembelajaran, bukan ditutupi.'
                            },
                            {
                                text: '😓 Minta maaf dan bilang masih bingung label obat',
                                outcome: 'neutral',
                                msg: '"Kalau bingung, tanya dulu! Jangan pernah ragu bertanya di bidang medis. Saya akan buatkan panduan pengelompokan obat untukmu."',
                                rep: -3, money: 0,
                                lesson: '📚 PELAJARAN: Di bidang medis, bertanya adalah kewajiban profesional. Tidak tahu dan tidak bertanya adalah kombinasi paling berbahaya.'
                            },
                            {
                                text: '🤥 Pura-pura tahu dan bilang itu tidak akan terjadi lagi',
                                outcome: 'bad',
                                msg: '"Attitude seperti ini yang berbahaya di klinik. Kamu tidak bisa pura-pura di sini. Satu kesalahan bisa renggut nyawa. Kamu saya nonaktifkan hari ini."',
                                rep: -25, money: 0,
                                lesson: '📚 PELAJARAN: Kepura-puraan kompeten (fake it till you make it) tidak berlaku di profesi yang menyangkut keselamatan jiwa. Kejujuran adalah kompetensi pertama.'
                            }
                        ]
                    },
                    {
                        id: 'pt_k_pasien_sulit',
                        title: '😡 Pasien Kasar dan Tidak Sabar',
                        text: 'Seorang pasien marah besar di depanmu.\n\n"Saya sudah nunggu 1 jam lebih! Pelayanan klinik ini payah! Kamu juga tidak ada gunanya di sini!"',
                        img: 'images/lover1boy.png',
                        options: [
                            {
                                text: '💬 Tetap tenang, empati, dan jelaskan situasi antrean',
                                req: { stat: 'reputation', val: 15 },
                                outcome: 'good',
                                msg: 'Pasien mulai tenang. Dr. Budi yang melihat dari jauh tersenyum bangga.\n"Respons terbaikmu sampai saat ini. Kamu punya bakat di bidang ini!"',
                                rep: +12, money: 500,
                                lesson: '📚 PELAJARAN: Empati dan komunikasi yang tenang saat menghadapi pasien yang emosional adalah skill kritis di bidang kesehatan. Ini disebut "de-escalation".'
                            },
                            {
                                text: '🤝 Minta maaf atas penantian dan tawarkan air minum',
                                outcome: 'neutral',
                                msg: '"Kamu berhasil menenangkan situasi. Tindakan kecil seperti menawarkan air menunjukkan kamu peduli pada kenyamanan pasien."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Tindakan kecil yang tulus dalam melayani bisa mengubah pengalaman negatif pasien menjadi positif.'
                            },
                            {
                                text: '😤 Membalas dengan nada defensif',
                                outcome: 'bad',
                                msg: '"Tidak boleh! Di sini pasien adalah prioritas, apapun kondisinya. Attitude seperti itu bisa menghancurkan reputasi klinik!"',
                                rep: -15, money: 0,
                                lesson: '📚 PELAJARAN: Membalas emosi dengan emosi di fasilitas kesehatan adalah pelanggaran etika profesi. Pasien yang sakit secara emosional perlu lebih banyak empati, bukan perlawanan.'
                            }
                        ]
                    }
                ]
            };

            // Tracker konflik hari ini
            function getConflictKey() {
                const jobType = STATE.player.partTimeJob ? 'pt_' + STATE.player.partTimeJob : 'ft';
                return `conflict_day_${STATE.day}_${jobType}`;
            }

            function hasConflictToday() {
                return STATE.player.todayConflict && STATE.player.todayConflict === getConflictKey();
            }

            function markConflictToday() {
                STATE.player.todayConflict = getConflictKey();
            }

            // Pilih konflik random sesuai pekerjaan
            function getRandomConflict(isPartTime, jobKey) {
                let pool;
                if (isPartTime) {
                    pool = WORK_CONFLICTS[jobKey] || [];
                } else {
                    pool = WORK_CONFLICTS.fulltime || [];
                }
                if (pool.length === 0) return null;
                const idx = Math.floor(Math.random() * pool.length);
                return pool[idx];
            }

            // ── TRIGGER KONFLIK KERJA ──────────────────────────────────────────
            function triggerWorkConflict(isPartTime, jobKey) {
                if (hasConflictToday()) return; // Maksimal 1 konflik per hari

                const conflict = getRandomConflict(isPartTime, jobKey);
                if (!conflict) return;

                markConflictToday();

                const jobData = isPartTime ? (PART_TIME_JOBS[jobKey] || {}) : { img: 'images/job.png', name: 'Merchant' };
                const imgSrc = isPartTime ? (jobData.img || 'images/job.png') : 'images/job.png';
                const bossName = isPartTime ? (jobData.name || 'Bos') : 'Pak Hendra (Bos Merchant)';

                const opts = conflict.options.map(opt => {
                    let label = opt.text;
                    if (opt.req) label += ` [${opt.req.stat.toUpperCase()} ${opt.req.val}+]`;

                    return {
                        text: label,
                        action: () => {
                            let success = true;

                            // Cek stat requirement
                            if (opt.req) {
                                const statMap = { str: 'str', int: 'int', biz: 'biz', rep: 'reputation', reputation: 'reputation' };
                                const statKey = statMap[opt.req.stat] || opt.req.stat;
                                const pStat = STATE.player[statKey] || 0;
                                if (pStat < opt.req.val) {
                                    success = false;
                                }
                            }

                            const finalOutcome = success ? opt.outcome : 'bad';
                            const finalRep = success ? opt.rep : -8;
                            const finalMoney = success ? (opt.money || 0) : 0;
                            const finalMsg = success ? opt.msg : `Kemampuanmu belum cukup untuk merespons situasi ini. (Butuh ${opt.req ? opt.req.stat.toUpperCase() + ' ' + opt.req.val : '?'})\n\nBos kecewa dengan responmu.`;
                            const finalLesson = opt.lesson || '';

                            // Terapkan efek reputasi
                            STATE.player.bossReputation = Math.max(0, Math.min(100, (STATE.player.bossReputation || 50) + finalRep));

                            // Terapkan uang bonus/penalti
                            if (finalMoney !== 0) {
                                STATE.player.money = Math.max(0, STATE.player.money + finalMoney);
                                if (finalMoney > 0) showToast(`💰 Bonus Konflik: +${finalMoney.toLocaleString()} G`);
                                else showToast(`💸 Penalti: -${Math.abs(finalMoney).toLocaleString()} G`);
                            }

                            // Promosi jika ada flag
                            const doPromote = success && opt.promote;

                            // Cek ambang batas reputasi
                            const rep = STATE.player.bossReputation;
                            let repMsg = '';
                            if (rep <= 10) {
                                repMsg = '\n\n⚠️ REPUTASI SANGAT RENDAH! Bos mungkin akan memecatmu jika tidak ada perbaikan!';
                            } else if (rep <= 30) {
                                repMsg = '\n\n⚠️ Reputasimu dengan bos menurun drastis. Hati-hati!';
                            } else if (rep >= 90) {
                                repMsg = '\n\n🌟 Reputasimu luar biasa! Bos sangat puas dengan kinerjamu.';
                            }

                            // Icon berdasarkan outcome
                            const outcomeIcon = finalOutcome === 'good' ? '🎉' : finalOutcome === 'neutral' ? '😐' : '😔';

                            closeDialogue();
                            setTimeout(() => {
                                showDialogue(bossName,
                                    `${outcomeIcon} ${finalMsg}${repMsg}\n\n${finalLesson}\n\n📊 Reputasi dengan bos: ${Math.round(STATE.player.bossReputation)}/100`,
                                    [{
                                        text: doPromote ? '🏆 Promosi! Terima kasih Pak!' : 'Mengerti, terima kasih.',
                                        action: () => {
                                            closeDialogue();
                                            if (doPromote) {
                                                const maxLv = 4;
                                                if ((STATE.player.jobLevel || 1) < maxLv) {
                                                    STATE.player.jobLevel = (STATE.player.jobLevel || 1) + 1;
                                                    gainExp(100);
                                                    setTimeout(() => {
                                                        const titles = ['','Magang','Staff Senior','Kepala Gudang','Manajer Cabang'];
                                                        showDialogue('🏆 PROMOSI JABATAN!',
                                                            `Selamat! Kamu resmi dipromosikan!\n\nJabatan baru: **${titles[STATE.player.jobLevel]}**\n\nGaji harianmu otomatis naik mulai besok!\n\n🎊 +100 XP`,
                                                            [{ text: 'Terima kasih!', action: closeDialogue }], imgSrc
                                                        );
                                                    }, 400);
                                                }
                                            }
                                            checkBossReputationThreshold(isPartTime, jobKey, imgSrc, bossName);
                                        }
                                    }], imgSrc
                                );
                            }, 300);
                        }
                    };
                });

                opts.push({
                    text: '🚪 Kabur dari situasi (Rep -5)',
                    action: () => {
                        STATE.player.bossReputation = Math.max(0, (STATE.player.bossReputation || 50) - 5);
                        closeDialogue();
                        showToast('😰 Kamu menghindari konfrontasi. Rep -5');
                        checkBossReputationThreshold(isPartTime, jobKey, imgSrc, bossName);
                    }
                });

                showDialogue(`⚡ KONFLIK KERJA — ${conflict.title}`, conflict.text, opts, imgSrc);
            }

            // ── CEK AMBANG BATAS REPUTASI: BONUS / PERINGATAN / PECAT ───────────
            function checkBossReputationThreshold(isPartTime, jobKey, imgSrc, bossName) {
                const p = STATE.player;
                const rep = p.bossReputation || 50;

                // Jangan spam notifikasi — cek sudah pernah triggered hari ini
                const threshKey = `rep_thresh_${STATE.day}`;
                if (p.lastRepThreshDay === threshKey) return;

                // Dipecat jika rep <= 0
                if (rep <= 0) {
                    p.lastRepThreshDay = threshKey;
                    setTimeout(() => {
                        if (isPartTime) {
                            p.partTimeJob = null;
                            p.partTimeStatus = 'none';
                            p.partTimeShiftStarted = false;
                            showDialogue(`🚨 DIPECAT DARI PART-TIME`,
                                `"Saya sudah cukup sabar. Kamu tidak lagi cocok bekerja di sini.\n\nMulai besok, kamu tidak perlu datang lagi."\n\n💡 Kamu bisa melamar part-time di tempat lain dengan surat lamaran baru.`,
                                [{ text: 'Baik...' , action: closeDialogue }], imgSrc
                            );
                        } else {
                            p.jobStatus = 'fired';
                            p.shiftStarted = false;
                            showDialogue(`🚨 KAMU DIPECAT!`,
                                `Pak Hendra menghampirimu dengan wajah serius.\n\n"Kamu sudah diberikan banyak kesempatan, tapi tidak ada perubahan. Ini surat pemecatan resmimu."\n\n💡 Kamu bisa coba melamar kerja kembali setelah reputasimu pulih.\n\n📚 PELAJARAN: Di dunia nyata, reputasi profesional sangat sulit dibangun kembali setelah hancur. Jaga selalu sikap dan kinerjamu.`,
                                [{ text: 'Baik...' , action: closeDialogue }], imgSrc
                            );
                        }
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                    }, 500);
                    return;
                }

                // Peringatan keras jika rep antara 1–20
                if (rep > 0 && rep <= 20) {
                    p.lastRepThreshDay = threshKey;
                    setTimeout(() => {
                        showDialogue(`⚠️ PERINGATAN KERAS`,
                            `${bossName} memanggil kamu dengan ekspresi serius.\n\n"Reputasimu di sini sangat mengkhawatirkan. Ini peringatan terakhir sebelum saya mengambil keputusan."\n\n📊 Reputasi saat ini: ${Math.round(rep)}/100\n\n💡 Perbaiki sikapmu segera! Selesaikan konflik dengan baik untuk menaikkan reputasi.`,
                            [{ text: 'Saya akan berubah!', action: closeDialogue }], imgSrc
                        );
                    }, 500);
                    return;
                }

                // Bonus gaji jika rep >= 85
                if (rep >= 85) {
                    p.lastRepThreshDay = threshKey;
                    const bonusAmount = isPartTime ? 2000 : 5000;
                    p.money += bonusAmount;
                    setTimeout(() => {
                        showDialogue(`🎉 BONUS KINERJA LUAR BIASA!`,
                            `${bossName} memanggil kamu dengan senyum lebar.\n\n"Kamu adalah karyawan terbaik yang pernah saya punya! Kinerjamu konsisten dan sikapmu profesional. Ini bonus khusus untukmu!"\n\n💰 Bonus Kinerja: +${bonusAmount.toLocaleString()} G\n📊 Reputasi: ${Math.round(rep)}/100\n\n📚 PELAJARAN: Konsistensi dan sikap profesional adalah investasi terbaik dalam karir. Bonus dan promosi datang sendiri pada karyawan yang berintegritas.`,
                            [{ text: 'Terima kasih banyak!', action: closeDialogue }], imgSrc
                        );
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        gainExp(30);
                    }, 500);
                }
            }

            // ── HOOK: PANGGIL KONFLIK SAAT MULAI SHIFT ──────────────────────────
            // Dipanggil dari handleWorkerInteraction (full-time) dan showPartTimeWorkMenu
            function maybeShowWorkConflict(isPartTime, jobKey) {
                if (hasConflictToday()) return;
                // Probabilitas konflik: 65% setiap hari kerja
                const roll = Math.random();
                if (roll < 0.65) {
                    setTimeout(() => triggerWorkConflict(isPartTime, jobKey), 1500);
                }
            }

            // --- NEW: DATABASE MATERI KULIAH (EXPANDED TO 48 TOPICS - 2 YEARS FULL) ---
            // Logika: 1 Tahun = 120 Hari. Kuliah Spesial tiap 5 hari. Total = 24 Materi/Tahun.
            // UPDATE: MATERI LENGKAP & LEBIH MENDALAM (TEORI ASLI)
            const COURSE_MATERIALS = {
                'teknologi': [
                    // --- TAHUN PERTAMA (BASIC & DEV) ---
                    // SEMESTER 1 (Basic Computer Science)
                    {
                        t: "Algoritma & Pemrograman Dasar",
                        c: "DEFINISI:\nUrutan langkah logis penyelesaian masalah yang disusun secara sistematis.\n\n3 SYARAT ALGORITMA:\n1. Finiteness: Harus berhenti setelah sejumlah langkah.\n2. Definiteness: Setiap langkah harus jelas/tidak ambigu.\n3. Effectiveness: Langkah harus sederhana dan dapat dikerjakan.\n\nNOTASI:\n- Pseudocode (Kode semu)\n- Flowchart (Diagram alir)"
                    },
                    {
                        t: "Struktur Data (Data Structures)",
                        c: "KONSEP:\nCara penyimpanan, penyusunan, dan pengaturan data di dalam media penyimpanan komputer.\n\nTIPE DASAR:\n1. Array: Kumpulan data sejenis dengan indeks statis.\n2. Linked List: Rangkaian node yang saling menunjuk (dinamis).\n3. Stack: Tumpukan (LIFO - Last In First Out).\n4. Queue: Antrean (FIFO - First In First Out)."
                    },
                    {
                        t: "Basis Data (Database SQL)",
                        c: "RDBMS (Relational Database):\nPenyimpanan data dalam bentuk tabel yang saling berelasi.\n\nKUNCI UTAMA:\n- Primary Key (PK): Identitas unik setiap baris data.\n- Foreign Key (FK): Kunci tamu untuk menghubungkan antar tabel.\n\nNORMALISASI:\nProses pengelompokan atribut data untuk menghilangkan redundansi dan anomali data."
                    },
                    {
                        t: "Jaringan Komputer Dasar",
                        c: "MODEL OSI (7 LAYER):\n1. Physical (Kabel/Sinyal)\n2. Data Link (MAC Address)\n3. Network (IP Address/Routing)\n4. Transport (TCP/UDP)\n5. Session\n6. Presentation\n7. Application (HTTP/FTP)\n\nIP ADDRESS:\nAlamat unik perangkat dalam jaringan. IPv4 (32-bit) dan IPv6 (128-bit)."
                    },
                    {
                        t: "Keamanan Siber (Cyber Security)",
                        c: "CIA TRIAD:\n1. Confidentiality (Kerahasiaan): Data hanya boleh diakses yang berhak.\n2. Integrity (Keutuhan): Data tidak boleh diubah oleh pihak tak berwenang.\n3. Availability (Ketersediaan): Data harus bisa diakses saat dibutuhkan.\n\nANCAMAN UMUM:\n- Phishing (Pencurian info via manipulasi)\n- Malware (Virus/Ransomware)\n- DDoS (Serangan membanjiri trafik)"
                    },
                    {
                        t: "Kecerdasan Buatan (AI Basics)",
                        c: "DEFINISI:\nSimulasi kecerdasan manusia dalam mesin yang diprogram untuk berpikir dan meniru tindakannya.\n\nCABANG AI:\n1. Machine Learning: Mesin belajar dari data tanpa diprogram eksplisit.\n2. Neural Networks: Meniru cara kerja neuron otak manusia.\n3. NLP: Pemrosesan bahasa alami (teks/suara).\n4. Computer Vision: Analisis gambar/video."
                    },

                    // SEMESTER 2 (Development Skills)
                    {
                        t: "Pemrograman Web (Frontend & Backend)",
                        c: "ARSITEKTUR WEB:\n- Client-Side (Frontend): HTML (Struktur), CSS (Gaya), JS (Interaksi).\n- Server-Side (Backend): Node.js, PHP, Python, Database.\n\nHTTP REQUEST METHODS:\n- GET: Mengambil data.\n- POST: Mengirim data baru.\n- PUT: Update data.\n- DELETE: Hapus data."
                    },
                    {
                        t: "Pemrograman Mobile (Android/iOS)",
                        c: "NATIVE VS HYBRID:\n- Native: Java/Kotlin (Android), Swift (iOS). Performa tinggi, akses hardware penuh.\n- Hybrid/Cross-Platform: Flutter, React Native. Satu kode untuk semua platform.\n\nLIFECYCLE AKTIVITAS:\nCreate -> Start -> Resume -> Pause -> Stop -> Destroy."
                    },
                    {
                        t: "Cloud Computing",
                        c: "LAYANAN CLOUD:\n1. IaaS (Infrastructure): Sewa server/storage virtual (AWS EC2).\n2. PaaS (Platform): Lingkungan development siap pakai (Heroku).\n3. SaaS (Software): Aplikasi jadi via internet (Google Docs).\n\nMANFAAT:\nSkalabilitas (bisa diperbesar kapan saja) dan Efisiensi Biaya (Pay-as-you-go)."
                    },
                    {
                        t: "Internet of Things (IoT)",
                        c: "KONSEP:\nJaringan objek fisik yang tertanam dengan sensor, software, dan teknologi lain untuk bertukar data via internet.\n\nKOMPONEN UTAMA:\n1. Sensor/Actuator (Pengambil data/Penggerak).\n2. Connectivity (Wi-Fi, Bluetooth, Zigbee).\n3. Data Processing (Cloud/Edge).\n4. User Interface (Dashboard/App)."
                    },
                    {
                        t: "Teknologi Blockchain",
                        c: "PRINSIP DASAR:\nBuku besar (ledger) digital yang terdesentralisasi, terdistribusi, dan tidak dapat diubah (immutable).\n\nCARA KERJA:\nTransaksi dicatat dalam 'blok', dienkripsi (hash), dan dirangkai ke blok sebelumnya (chain). Jika satu blok diubah, seluruh rantai rusak (terdeteksi palsu)."
                    },
                    {
                        t: "Big Data Analytics",
                        c: "KARAKTERISTIK 3V:\n1. Volume: Jumlah data sangat besar.\n2. Velocity: Kecepatan data masuk sangat tinggi (real-time).\n3. Variety: Jenis data beragam (teks, video, log).\n\nTUJUAN:\nMenemukan pola tersembunyi, korelasi pasar, dan preferensi pelanggan untuk keputusan bisnis."
                    },

                    // --- TAHUN KEDUA (ADVANCED & SPECIALIZATION) ---
                    // SEMESTER 3 (Engineering & Ethics)
                    {
                        t: "User Interface (UI) & User Experience (UX)",
                        c: "UI (Tampilan):\nFokus pada estetika, warna, tipografi, dan tata letak visual.\n\nUX (Pengalaman):\nFokus pada kemudahan penggunaan, alur pengguna (user flow), dan kepuasan interaksi.\n\nPRINSIP DESAIN:\nKonsistensi, Feedback yang jelas, dan Minimalisir beban kognitif pengguna."
                    },
                    {
                        t: "Software Engineering (RPL)",
                        c: "SDLC (System Development Life Cycle):\n1. Planning (Perencanaan)\n2. Analysis (Analisis Kebutuhan)\n3. Design (Perancangan)\n4. Implementation (Coding)\n5. Testing (Pengujian)\n6. Maintenance (Pemeliharaan)\n\nMODEL:\nWaterfall (Sekuensial) vs Agile (Iteratif/Fleksibel)."
                    },
                    {
                        t: "Sistem Operasi (OS)",
                        c: "FUNGSI UTAMA OS:\n1. Manajemen Proses (Scheduling CPU).\n2. Manajemen Memori (RAM & Virtual Memory).\n3. Manajemen File (File System).\n4. Manajemen I/O (Input Output).\n\nKERNEL:\nInti dari OS yang menghubungkan software aplikasi dengan hardware komputer."
                    },
                    {
                        t: "Arsitektur & Organisasi Komputer",
                        c: "UNIT UTAMA (Von Neumann):\n1. CPU (ALU + Control Unit): Otak pemroses.\n2. Memory: Penyimpanan instruksi/data.\n3. I/O Devices: Perangkat masukan/keluaran.\n\nFETCH-DECODE-EXECUTE:\nSiklus CPU mengambil instruksi dari memori, menerjemahkannya, dan menjalankannya."
                    },
                    {
                        t: "Etika Profesi IT",
                        c: "PRINSIP ETIKA:\n1. Privasi: Menjaga kerahasiaan data pengguna.\n2. Akurasi: Tidak memanipulasi data/fakta.\n3. Properti: Menghargai Hak Kekayaan Intelektual (HAKI).\n4. Akses: Tidak membatasi akses informasi secara diskriminatif.\n\nKASUS:\nPlagiarisme kode, penyebaran malware, penyalahgunaan data user."
                    },
                    {
                        t: "Digital Marketing & SEO",
                        c: "SEO (Search Engine Optimization):\nOptimasi website agar muncul di halaman pertama pencarian organik (Google).\n\nSEM (Search Engine Marketing):\nPemasaran berbayar (Iklan/Ads) di mesin pencari.\n\nMETRIK PENTING:\n- CTR (Click Through Rate)\n- Conversion Rate\n- Bounce Rate"
                    },

                    // SEMESTER 4 (Advanced Tech)
                    {
                        t: "Pengembangan Game (Game Dev)",
                        c: "GAME LOOP:\nSiklus tak berujung: Input -> Update Logika -> Render Grafis.\n\nKOMPONEN:\n- Sprite/Mesh (Visual)\n- Collider/Rigidbody (Fisika)\n- Script (Logika)\n- Audio (Suara)\n\nGENRE:\nRPG, FPS, Platformer, Simulation, Strategy."
                    },
                    {
                        t: "Virtual Reality (VR) & AR",
                        c: "VR (Virtual Reality):\nPengguna masuk sepenuhnya ke dunia digital (Immersive) menggunakan headset.\n\nAR (Augmented Reality):\nMenambahkan objek digital ke dunia nyata (contoh: Filter kamera, Pokemon GO).\n\nMR (Mixed Reality):\nInteraksi objek digital dan fisik secara real-time."
                    },
                    {
                        t: "E-Commerce Systems",
                        c: "MODEL BISNIS:\n- B2B (Business to Business)\n- B2C (Business to Consumer)\n- C2C (Consumer to Consumer - Marketplace)\n\nKEAMANAN TRANSAKSI:\nEnkripsi SSL/TLS, Payment Gateway, dan Two-Factor Authentication (2FA) untuk mencegah penipuan."
                    },
                    {
                        t: "Manajemen Startup Digital",
                        c: "TAHAPAN STARTUP:\n1. Ideation: Validasi ide masalah & solusi.\n2. MVP (Minimum Viable Product): Produk dasar untuk tes pasar.\n3. Product-Market Fit: Produk disukai dan dibutuhkan pasar.\n4. Scaling: Ekspansi pertumbuhan pengguna.\n\nLEAN STARTUP:\nBuild - Measure - Learn (Buat - Ukur - Pelajari)."
                    },
                    {
                        t: "Manajemen Proyek (Agile/Scrum)",
                        c: "AGILE MANIFESTO:\nLebih menghargai individu & interaksi daripada proses & alat. Merespon perubahan daripada mengikuti rencana kaku.\n\nSCRUM FRAMEWORK:\n- Sprint: Siklus kerja pendek (2-4 minggu).\n- Daily Standup: Rapat harian singkat.\n- Roles: Product Owner, Scrum Master, Dev Team."
                    },
                    {
                        t: "Teknologi Masa Depan (Futurism)",
                        c: "TREN MENDATANG:\n1. Quantum Computing: Komputer super cepat berbasis Qubit.\n2. Biotechnology: Integrasi teknologi dengan biologi (Biohacking).\n3. Autonomous Systems: Robot/Kendaraan mandiri.\n4. Green Tech: Teknologi ramah lingkungan untuk keberlanjutan bumi."
                    },

                    // --- TAHUN KETIGA (EXPERT & SPECIALIZATION) ---
                    // SEMESTER 5 (Cloud & DevOps Architecture)
                    {
                        t: "Microservices Architecture",
                        c: "KONSEP:\nMemecah aplikasi besar (Monolith) menjadi layanan-layanan kecil yang independen dan saling berkomunikasi via API.\n\nKELEBIHAN:\n- Independensi Deployment\n- Skalabilitas per fitur\n- Bebas memilih teknologi per service\n\nKEKURANGAN:\nKompleksitas manajemen jaringan dan data."
                    },
                    {
                        t: "Docker & Containerization",
                        c: "CONTAINER:\nUnit standar perangkat lunak yang mengemas kode dan dependensinya agar aplikasi berjalan cepat dan andal di lingkungan komputasi yang berbeda.\n\nDOCKER:\nPlatform terbuka untuk mengembangkan, mengirim, dan menjalankan aplikasi dalam kontainer. Memisahkan aplikasi dari infrastruktur."
                    },
                    {
                        t: "Kubernetes (K8s)",
                        c: "ORCHESTRATION:\nSistem open-source untuk mengotomatisasi deployment, scaling, dan manajemen aplikasi terkontainerisasi.\n\nFITUR UTAMA:\n- Self-healing (Restart container mati)\n- Load balancing (Distribusi trafik)\n- Automated rollouts/rollbacks (Update otomatis)"
                    },
                    {
                        t: "CI/CD Pipeline",
                        c: "CI (Continuous Integration):\nPengembang sering menggabungkan kode ke repositori pusat (Shared Repo). Otomatisasi build dan test.\n\nCD (Continuous Delivery/Deployment):\nOtomatisasi rilis aplikasi ke lingkungan produksi. Memastikan software selalu siap dirilis ke user."
                    },
                    {
                        t: "DevOps Culture",
                        c: "DEFINISI:\nGabungan filosofi budaya, praktik, dan alat yang meningkatkan kemampuan organisasi untuk mengirimkan aplikasi dengan kecepatan tinggi.\n\nTUJUAN:\nMenghapus silo (tembok pemisah) antara tim Development (Pengembang) dan Operations (Operasional IT) agar kolaborasi lebih efisien."
                    },
                    {
                        t: "Cloud Security Architecture",
                        c: "SHARED RESPONSIBILITY:\nPenyedia Cloud (AWS/Google) bertanggung jawab atas keamanan 'of the cloud' (infrastruktur fisik).\nPelanggan bertanggung jawab atas keamanan 'in the cloud' (data, akses, konfigurasi).\n\nBEST PRACTICE:\nEnkripsi data at rest & in transit, IAM (Identity Access Management)."
                    },

                    // SEMESTER 6 (AI & Data Science Deep Dive)
                    {
                        t: "Deep Learning & Neural Networks",
                        c: "NEURAL NETWORK:\nModel komputasi yang terinspirasi dari struktur otak manusia (neuron dan sinapsis).\n\nDEEP LEARNING:\nPembelajaran mesin dengan banyak lapisan (hidden layers) untuk mengekstrak fitur tingkat tinggi dari data mentah. Contoh: Pengenalan wajah, mobil otonom."
                    },
                    {
                        t: "Natural Language Processing (NLP)",
                        c: "FUNGSI:\nMemampukan komputer untuk memahami, menafsirkan, dan memanipulasi bahasa manusia.\n\nAPLIKASI:\n- Chatbot & Virtual Assistant\n- Terjemahan Bahasa (Google Translate)\n- Analisis Sentimen (Cek respon positif/negatif di sosmed)\n- Peringkasan Teks Otomatis."
                    },
                    {
                        t: "Computer Vision",
                        c: "DEFINISI:\nBidang AI yang melatih komputer untuk menafsirkan dan memahami dunia visual (gambar/video).\n\nTEKNOLOGI:\n- Image Classification (Kucing vs Anjing)\n- Object Detection (Deteksi mobil di jalan)\n- Facial Recognition (Kunci HP wajah)\n- Medical Imaging (Deteksi tumor dari X-Ray)."
                    },
                    {
                        t: "Predictive Analytics",
                        c: "METODE:\nMenggunakan data historis, algoritma statistik, dan teknik machine learning untuk mengidentifikasi kemungkinan hasil masa depan.\n\nCONTOH:\n- Prediksi harga saham\n- Prediksi cuaca\n- Rekomendasi produk (Netflix/Spotify)\n- Deteksi potensi kerusakan mesin (Maintenance)."
                    },
                    {
                        t: "Ethical Hacking (Pentesting)",
                        c: "DEFINISI:\nPeretasan yang dilakukan dengan izin untuk menemukan kelemahan keamanan sistem sebelum dieksploitasi oleh peretas jahat.\n\nTAHAPAN:\n1. Reconnaissance (Pengumpulan info)\n2. Scanning (Pemindaian celah)\n3. Gaining Access (Eksploitasi)\n4. Maintaining Access\n5. Clearing Tracks (Hapus jejak)."
                    },
                    {
                        t: "Digital Forensics",
                        c: "TUJUAN:\nMengidentifikasi, memelihara, memulihkan, menganalisis, dan menyajikan fakta tentang bukti digital dalam kasus hukum.\n\nPROSES:\n- Seizure (Penyitaan perangkat)\n- Acquisition (Duplikasi data bit-by-bit)\n- Analysis (Mencari bukti tersembunyi/terhapus)\n- Reporting (Laporan hukum)."
                    },

                    // SEMESTER 7 (Modern Web & Management)
                    {
                        t: "Serverless Computing",
                        c: "KONSEP:\nModel eksekusi cloud di mana penyedia cloud mengelola server secara dinamis. Developer hanya fokus menulis kode fungsi (FaaS - Function as a Service).\n\nKEUNTUNGAN:\n- Tidak perlu manajemen server\n- Scaling otomatis dari nol ke ribuan request\n- Bayar hanya saat kode dijalankan."
                    },
                    {
                        t: "Progressive Web Apps (PWA)",
                        c: "FITUR:\nAplikasi web yang menggunakan fitur browser modern untuk memberikan pengalaman seperti aplikasi native (mobile app).\n\nKELEBIHAN:\n- Bisa diinstall di Home Screen\n- Bisa jalan Offline (Service Workers)\n- Push Notifications\n- Ringan dan cepat."
                    },
                    {
                        t: "GraphQL API",
                        c: "DEFINISI:\nBahasa query untuk API dan runtime untuk memenuhi query tersebut dengan data yang ada.\n\nBEDA DENGAN REST:\n- REST: Banyak endpoint, data fixed (over-fetching/under-fetching).\n- GraphQL: Satu endpoint, client minta data spesifik yang dibutuhkan saja (efisien)."
                    },
                    {
                        t: "Tech Leadership (CTO Role)",
                        c: "TANGGUNG JAWAB:\n- Menentukan visi teknologi perusahaan.\n- Memilih stack teknologi yang tepat.\n- Membangun dan memimpin tim engineering.\n- Menjembatani kebutuhan bisnis dengan solusi teknis.\n\nSKILL:\nKomunikasi, Manajemen Krisis, Mentoring."
                    },
                    {
                        t: "Startup Valuation & Funding",
                        c: "VALUASI:\nNilai ekonomis dari sebuah bisnis startup. Dipengaruhi oleh tim, traksi, ukuran pasar, dan teknologi.\n\nTAHAP PENDANAAN:\n- Bootstrapping (Modal sendiri)\n- Angel Investor\n- Seed Funding\n- Series A, B, C (Venture Capital)\n- IPO (Saham Publik)."
                    },
                    {
                        t: "Hukum IT & HAKI",
                        c: "UU ITE (Indonesia):\nMengatur informasi dan transaksi elektronik. Pasal karet, pencemaran nama baik, akses ilegal.\n\nHAKI (Hak Kekayaan Intelektual):\n- Hak Cipta (Copyright): Kode program, desain UI.\n- Paten: Penemuan teknologi baru.\n- Merek Dagang: Logo/Brand startup."
                    },

                    // SEMESTER 8 (Global Impact & Ethics)
                    {
                        t: "Green Computing",
                        c: "TUJUAN:\nMengurangi dampak lingkungan dari teknologi komputer. Hemat energi dan kurangi limbah elektronik (e-waste).\n\nSTRATEGI:\n- Virtualisasi server (kurangi hardware fisik)\n- Algoritma efisien (kurangi beban CPU/listrik)\n- Daur ulang perangkat keras\n- Data center bertenaga terbarukan."
                    },
                    {
                        t: "Bioinformatics",
                        c: "GABUNGAN:\nBiologi molekuler + Ilmu Komputer + Statistik.\n\nFUNGSI:\nMengelola dan menganalisis data biologis kompleks, seperti sekuensing DNA/RNA.\n\nMANFAAT:\nPenemuan obat baru, pemetaan gen manusia, personalisasi pengobatan medis."
                    },
                    {
                        t: "Smart Cities Implementation",
                        c: "DEFINISI:\nKota yang menggunakan teknologi IoT dan data untuk meningkatkan kualitas layanan publik dan kesejahteraan warga.\n\nCONTOH:\n- Smart Traffic (Lampu merah adaptif)\n- Smart Waste (Tempat sampah lapor penuh)\n- E-Gov (Layanan administrasi online)\n- Smart Energy (Grid listrik efisien)."
                    },
                    {
                        t: "Space Technology Software",
                        c: "TANTANGAN:\nSoftware di luar angkasa harus sangat andal (zero-failure), tahan radiasi, dan beroperasi real-time dengan latensi tinggi.\n\nCONTOH:\n- Sistem navigasi roket (SpaceX)\n- Kontrol rover Mars (NASA)\n- Komunikasi satelit."
                    },
                    {
                        t: "Quantum Computing Advance",
                        c: "QUBIT:\nUnit dasar informasi kuantum. Berbeda dengan Bit (0 atau 1), Qubit bisa 0 dan 1 sekaligus (Superposisi).\n\nPOTENSI:\nMemecahkan masalah yang butuh ribuan tahun bagi superkomputer klasik dalam hitungan detik (contoh: simulasi molekul, pemecahan enkripsi RSA)."
                    },
                    {
                        t: "Transhumanism & Future Ethics",
                        c: "FILOSOFI:\nGerakan yang mendukung penggunaan teknologi untuk meningkatkan kemampuan fisik dan mental manusia (Human 2.0).\n\nISU ETIKA:\n- Kesenjangan sosial (hanya orang kaya yang 'upgrade').\n- Hilangnya esensi kemanusiaan.\n- Chip implan otak (Neuralink)."
                    }
                ],
                'sejarah': [
                    // --- TAHUN PERTAMA (NUSANTARA BASIC) ---
                    // ZAMAN KUNO
                    {
                        t: "Zaman Prasejarah Nusantara",
                        c: "MANUSIA PURBA:\n1. Meganthropus (Manusia Raksasa): Paling tua.\n2. Pithecanthropus (Manusia Kera): Erectus (berjalan tegak).\n3. Homo Sapiens (Manusia Cerdas): Leluhur manusia modern.\n\nKEBUDAYAAN:\n- Paleolitikum (Batu Tua): Nomaden, berburu.\n- Neolitikum (Batu Muda): Menetap, bercocok tanam."
                    },
                    {
                        t: "Kerajaan Kutai Martadipura",
                        c: "LOKASI:\nSungai Mahakam, Kalimantan Timur. Kerajaan Hindu tertua di Indonesia (Abad 4 M).\n\nBUKTI SEJARAH:\n7 Prasasti Yupa (Tiang batu pengikat hewan kurban) bertuliskan huruf Pallawa bahasa Sanskerta.\n\nRAJA TERKENAL:\n- Kudungga (Pendiri)\n- Aswawarman (Pembentuk Wangsa)\n- Mulawarman (Masa Kejayaan, kurban 20.000 sapi)."
                    },
                    {
                        t: "Kemaritiman Sriwijaya",
                        c: "LOKASI:\nPalembang, Sumatera Selatan (Abad 7-13 M). Kerajaan Buddha terbesar.\n\nKEJAYAAN:\n- Menguasai Selat Malaka (Jalur perdagangan dunia).\n- Pusat studi agama Buddha (Dikunjungi I-Tsing).\n- Armada laut yang sangat kuat.\n\nPRASASTI:\nKedukan Bukit, Talang Tuo, Kota Kapur."
                    },
                    {
                        t: "Majapahit & Sumpah Palapa",
                        c: "LOKASI:\nTrowulan, Jawa Timur (1293-1500 M). Kerajaan Hindu-Buddha terbesar pemersatu Nusantara.\n\nTOKOH:\n- Raden Wijaya (Pendiri)\n- Hayam Wuruk (Raja Masa Emas)\n- Gajah Mada (Mahapatih).\n\nSUMPAH PALAPA:\nSumpah Gajah Mada untuk tidak menikmati kemewahan duniawi sebelum menyatukan seluruh pulau Nusantara."
                    },
                    {
                        t: "Masuknya Islam ke Nusantara",
                        c: "TEORI MASUKNYA:\n1. Teori Gujarat (India)\n2. Teori Mekkah (Arab)\n3. Teori Persia (Iran)\n\nSALURAN PENYEBARAN:\n- Perdagangan (Pedagang Muslim)\n- Perkawinan\n- Pendidikan (Pesantren)\n- Kesenian (Wayang Sunan Kalijaga)\n- Tasawuf."
                    },
                    {
                        t: "Kesultanan Demak",
                        c: "SEJARAH:\nKerajaan Islam pertama di Jawa (1478 M). Didirikan oleh Raden Patah (putra Majapahit).\n\nPERAN:\n- Pusat penyebaran Islam di Jawa (Wali Songo).\n- Penyerangan ke Portugis di Malaka (oleh Pati Unus / Pangeran Sabrang Lor).\n\nPENINGGALAN:\nMasjid Agung Demak (Soko Tatal)."
                    },

                    // ZAMAN KOLONIAL
                    {
                        t: "Kolonialisme Portugis & Spanyol",
                        c: "MOTIVASI 3G:\n1. Gold (Kekayaan/Rempah)\n2. Glory (Kejayaan/Wilayah)\n3. Gospel (Penyebaran Agama)\n\nPERISTIWA:\n- 1511: Portugis (Alfonso de Albuquerque) menaklukkan Malaka.\n- 1512: Sampai di Maluku (Pusat Rempah).\n- Perjanjian Saragosa: Pembagian wilayah Spanyol & Portugis."
                    },
                    {
                        t: "VOC (Vereenigde Oostindische Compagnie)",
                        c: "DEFINISI:\nKongsi Dagang Hindia Timur Belanda (1602). Perusahaan multinasional pertama di dunia.\n\nHAK OKTROI (Istimewa):\n- Hak monopoli dagang.\n- Hak mencetak uang.\n- Hak memelihara tentara & perang.\n- Hak memerintah (negara dalam negara).\n\nKEBANGKRUTAN (1799):\nKorupsi pegawai, biaya perang, persaingan dagang."
                    },
                    {
                        t: "Perang Diponegoro (Perang Jawa)",
                        c: "WAKTU:\n1825 - 1830 (5 Tahun).\n\nPENYEBAB:\n- Belanda mematok tanah makam leluhur Pangeran Diponegoro.\n- Penderitaan rakyat akibat pajak.\n\nAKHIR PERANG:\nDiponegoro ditipu saat perundingan di Magelang, ditangkap, dan diasingkan ke Makassar. Perang ini membuat kas Belanda kosong."
                    },
                    {
                        t: "Politik Etis (Balas Budi)",
                        c: "LATAR BELAKANG:\nKritik Van Deventer atas eksploitasi Belanda terhadap pribumi (Tanam Paksa).\n\nTRILOGI VAN DEVENTER:\n1. Irigasi (Pengairan sawah)\n2. Emigrasi (Pemerataan penduduk)\n3. Edukasi (Pendidikan) -> Paling berdampak, melahirkan golongan terpelajar Indonesia."
                    },
                    {
                        t: "Kebangkitan Nasional (1908)",
                        c: "BUDI UTOMO:\nOrganisasi modern pertama (20 Mei 1908) oleh Dr. Sutomo & Wahidin Sudirohusodo.\n\nMAKNA:\nPerubahan pola perjuangan dari:\n- Fisik (Senjata) -> Diplomasi/Intelektual\n- Kedaerahan -> Nasional\n- Tergantung pemimpin -> Terorganisir."
                    },
                    {
                        t: "Sumpah Pemuda (1928)",
                        c: "KONGRES PEMUDA II:\n27-28 Oktober 1928 di Jakarta.\n\nISI SUMPAH:\n1. Bertumpah darah satu: Tanah Indonesia.\n2. Berbangsa satu: Bangsa Indonesia.\n3. Menjunjung bahasa persatuan: Bahasa Indonesia.\n\nLAGU KEBANGSAAN:\nIndonesia Raya pertama kali diperdengarkan oleh W.R. Supratman (biola)."
                    },

                    // ZAMAN KEMERDEKAAN
                    {
                        t: "Pendudukan Jepang (1942-1945)",
                        c: "PROPAGANDA 3A:\nJepang Cahaya, Pelindung, Pemimpin Asia.\n\nDAMPAK NEGATIF:\n- Romusha (Kerja Paksa)\n- Kelaparan & Perampasan hasil bumi\n\nDAMPAK POSITIF:\n- Pelatihan Militer (PETA, Heiho)\n- Penggunaan Bahasa Indonesia\n- Pembentukan BPUPKI & PPKI."
                    },
                    {
                        t: "Perumusan Dasar Negara (BPUPKI)",
                        c: "SIDANG BPUPKI:\nMerumuskan dasar negara Indonesia Merdeka.\n\nLAHIRNYA PANCASILA (1 Juni 1945):\nPidato Ir. Soekarno mengusulkan 5 sila dasar.\n\nPIAGAM JAKARTA (22 Juni):\nRumusan awal Pancasila oleh Panitia Sembilan. Sila 1 kemudian diubah demi persatuan bangsa."
                    },
                    {
                        t: "Proklamasi Kemerdekaan",
                        c: "PERISTIWA RENGASDENGKLOK:\nGolongan Muda menculik Soekarno-Hatta agar segera memproklamasikan kemerdekaan, lepas dari pengaruh Jepang.\n\nDETIK-DETIK PROKLAMASI:\n- Tanggal: 17 Agustus 1945, pukul 10.00 WIB.\n- Lokasi: Jl. Pegangsaan Timur 56, Jakarta.\n- Bendera: Dijahit Fatmawati.\n- Teks: Diketik Sayuti Melik."
                    },
                    {
                        t: "Pertempuran 10 November",
                        c: "LOKASI:\nSurabaya. Perang terbuka terbesar pasca kemerdekaan melawan Sekutu (Inggris).\n\nPENYEBAB:\nTewasnya Jenderal Mallaby dan ultimatum Inggris agar rakyat menyerahkan senjata.\n\nTOKOH:\nBung Tomo (Membakar semangat lewat radio). Diperingati sebagai Hari Pahlawan."
                    },
                    {
                        t: "Diplomasi Mempertahankan Kemerdekaan",
                        c: "PERJUANGAN MEJA PERUNDINGAN:\n1. Linggarjati: Pengakuan de facto Jawa, Sumatera, Madura.\n2. Renville: Wilayah RI makin sempit.\n3. Roem-Roijen: Gencatan senjata.\n4. KMB (Konferensi Meja Bundar): Belanda mengakui kedaulatan Indonesia (RIS)."
                    },
                    {
                        t: "Republik Indonesia Serikat (RIS)",
                        c: "KONSEP:\nIndonesia berubah menjadi negara serikat/federal hasil KMB (1949). Terdiri dari negara-negara bagian buatan Belanda (Boneka).\n\nKEMBALI KE NKRI (1950):\nRakyat menolak RIS dan menuntut kembali ke Negara Kesatuan Republik Indonesia melalui Mosi Integral Natsir."
                    },

                    // --- TAHUN KEDUA ---
                    // SEMESTER 3 (Zaman Modern & Isu Global)
                    {
                        t: "Demokrasi Liberal (1950-1959)",
                        c: "CIRI KHAS:\n- Sistem Parlementer (PM memimpin pemerintahan, Presiden simbol negara).\n- Banyak Partai Politik.\n- Kabinet Jatuh Bangun (7 Kabinet dalam 9 tahun).\n\nDAMPAK:\nKetidakstabilan politik dan pembangunan terhambat, tapi kebebasan pers tinggi."
                    },
                    {
                        t: "Dekrit Presiden 5 Juli 1959",
                        c: "LATAR BELAKANG:\nKegagalan Konstituante menyusun UUD baru dan ketidakstabilan politik.\n\nISI DEKRIT:\n1. Pembubaran Konstituante.\n2. Kembali ke UUD 1945 (UUDS 1950 tidak berlaku).\n3. Pembentukan MPRS dan DPAS.\n\nMenandai dimulainya Demokrasi Terpimpin."
                    },
                    {
                        t: "Peristiwa G30S/PKI (1965)",
                        c: "TRAGEDI NASIONAL:\nPenculikan dan pembunuhan 6 Jenderal dan 1 Perwira TNI AD pada malam 30 September 1965.\n\nDAMPAK:\n- Krisis politik dan ekonomi.\n- Pembubaran PKI.\n- Lahirnya Supersemar (Surat Perintah 11 Maret).\n- Peralihan kekuasaan dari Orde Lama ke Orde Baru."
                    },
                    {
                        t: "Masa Orde Baru (1966-1998)",
                        c: "KEPEMIMPINAN SOEHARTO:\nFokus pada Stabilitas Politik dan Pertumbuhan Ekonomi (Trilogi Pembangunan).\n\nKEBIJAKAN:\n- Repelita (Rencana Pembangunan Lima Tahun).\n- Swasembada Beras.\n- Keluarga Berencana (KB).\n- Dwifungsi ABRI.\n\nAKHIR:\nKrisis Moneter 1997 dan Reformasi 1998."
                    },
                    {
                        t: "Reformasi 1998",
                        c: "PENYEBAB:\n- Krisis Ekonomi (Rupiah anjlok).\n- KKN (Korupsi, Kolusi, Nepotisme).\n- Tuntutan Demokrasi Mahasiswa.\n\nAGENDA REFORMASI:\n1. Adili Soeharto & kroninya.\n2. Amandemen UUD 1945.\n3. Otonomi Daerah.\n4. Penghapusan Dwifungsi ABRI.\n5. Kebebasan Pers."
                    },
                    {
                        t: "Sejarah Kontemporer & Globalisasi",
                        c: "TANTANGAN MASA KINI:\n- Revolusi Industri 4.0.\n- Menjaga identitas bangsa di era digital.\n- Toleransi dan Radikalisme.\n- Peran Indonesia di G20 dan kancah global.\n\nSejarah terus berjalan, dan kitalah penulis bab selanjutnya."
                    },

                    // SEMESTER 4 (Sejarah Tematik)
                    {
                        t: "Sejarah Jalur Rempah",
                        c: "JALUR SUTRA MARITIM:\nJaringan rute perdagangan laut kuno yang menghubungkan Timur (Nusantara/China) dan Barat (Eropa/Timur Tengah).\n\nKOMODITAS:\nCengkeh (Ternate), Pala (Ambon), Lada. Dulu harganya lebih mahal dari emas di Eropa.\n\nDAMPAK:\nNusantara menjadi incaran kolonialisme bangsa Eropa."
                    },
                    {
                        t: "Revolusi Industri Dunia",
                        c: "TAHAPAN:\n1.0: Mesin Uap (Abad 18) - Mekanisasi.\n2.0: Listrik & Assembly Line (Abad 19) - Produksi Massal.\n3.0: Komputer & Otomasi (Abad 20) - IT.\n4.0: Cyber-Physical (Sekarang) - IoT, AI, Big Data.\n\nDAMPAK SOSIAL:\nUrbanisasi, perubahan struktur kerja, dan kesenjangan ekonomi."
                    },
                    {
                        t: "Perang Dunia I (1914-1918)",
                        c: "PENYEBAB:\nPembunuhan Pangeran Franz Ferdinand (Austria) dan sistem aliansi negara Eropa.\n\nPIHAK TERLIBAT:\n- Blok Sekutu (Inggris, Perancis, Rusia, AS).\n- Blok Sentral (Jerman, Austria-Hungaria, Ottoman).\n\nAKIBAT:\nRuntuhnya 4 kekaisaran besar dan lahirnya LBB (Liga Bangsa-Bangsa)."
                    },
                    {
                        t: "Perang Dunia II (1939-1945)",
                        c: "PEMICU:\nInvasi Jerman ke Polandia.\n\nPIHAK:\n- Poros (Jerman, Jepang, Italia).\n- Sekutu (AS, Inggris, Uni Soviet, China).\n\nPERISTIWA KUNCI:\n- Holocaust (Genosida Yahudi).\n- Bom Atom Hiroshima & Nagasaki.\n- Lahirnya PBB (Perserikatan Bangsa-Bangsa)."
                    },
                    {
                        t: "Perang Dingin (Cold War)",
                        c: "DEFINISI:\nKetegangan geopolitik antara Blok Barat (AS - Kapitalis) dan Blok Timur (Uni Soviet - Komunis) tanpa perang fisik langsung (1947-1991).\n\nBENTUK PERSAINGAN:\n- Perlombaan Senjata Nuklir.\n- Perlombaan Luar Angkasa (Space Race).\n- Proxy War (Perang Korea, Vietnam).\n- Spionase (CIA vs KGB)."
                    },
                    {
                        t: "Konferensi Asia Afrika (KAA 1955)",
                        c: "LOKASI:\nGedung Merdeka, Bandung.\n\nTUJUAN:\nMempererat solidaritas negara-negara Asia-Afrika melawan kolonialisme dan neokolonialisme.\n\nHASIL:\nDasasila Bandung. Menjadi cikal bakal Gerakan Non-Blok (GNB).\n\nPERAN INDONESIA:\nTuan rumah dan pelopor (PM Ali Sastroamidjojo)."
                    },

                    // SEMESTER 5 (Sejarah Diplomasi & Regional)
                    {
                        t: "Gerakan Non-Blok (GNB)",
                        c: "PRINSIP:\nTidak memihak Blok Barat maupun Blok Timur dalam Perang Dingin.\n\nPENDIRI:\nSoekarno (Indonesia), Tito (Yugoslavia), Nasser (Mesir), Nehru (Mesir), Nkrumah (Ghana).\n\nTUJUAN:\nMeredakan ketegangan dunia dan memperjuangkan kemerdekaan negara terjajah."
                    },
                    {
                        t: "Sejarah ASEAN",
                        c: "PENDIRIAN:\n8 Agustus 1967 di Bangkok. Oleh 5 Menlu (Adam Malik - Indonesia).\n\nTUJUAN:\nMempercepat pertumbuhan ekonomi, kemajuan sosial, dan perdamaian regional Asia Tenggara.\n\nPRINSIP:\nNon-intervensi (tidak ikut campur urusan dalam negeri anggota)."
                    },
                    {
                        t: "Sejarah Perserikatan Bangsa-Bangsa (PBB)",
                        c: "PENDIRIAN:\n24 Oktober 1945 pasca PD II, menggantikan LBB.\n\nORGAN UTAMA:\n- Majelis Umum\n- Dewan Keamanan (5 Anggota Tetap punya Hak Veto)\n- Mahkamah Internasional\n- Sekretariat.\n\nINDONESIA DI PBB:\nPernah keluar (1965) saat konfrontasi Malaysia, lalu masuk kembali (1966)."
                    },
                    {
                        t: "Integrasi Timor Timur",
                        c: "SEJARAH:\n- 1975: Operasi Seroja, integrasi ke Indonesia (Provinsi ke-27) pasca ditinggal Portugal.\n- 1999: Referendum/Jajak Pendapat di masa Presiden Habibie.\n- Hasil: Mayoritas memilih merdeka -> Lepas menjadi negara Timor Leste."
                    },
                    {
                        t: "Konflik Laut China Selatan",
                        c: "ISU UTAMA:\nKlaim tumpang tindih wilayah perairan dan kepulauan (Spratly & Paracel) oleh China, Vietnam, Filipina, Malaysia, Brunei.\n\nPOSISI INDONESIA:\nBukan negara pengklaim (non-claimant), namun menjaga kedaulatan ZEE di Natuna Utara berdasarkan UNCLOS 1982."
                    },
                    {
                        t: "Sejarah Palestina & Israel",
                        c: "AKAR KONFLIK:\nPerebutan wilayah tanah suci pasca runtuhnya Ottoman dan Mandat Inggris (1948). Deklarasi negara Israel memicu perang Arab-Israel.\n\nISU KUNCI:\nStatus Yerusalem, perbatasan, pengungsi, dan permukiman ilegal.\n\nSIKAP RI:\nMendukung kemerdekaan Palestina (Solusi Dua Negara)."
                    },

                    // SEMESTER 6 (Sejarah Kebudayaan & Sosial)
                    {
                        t: "Sistem Subak Bali (Warisan Dunia)",
                        c: "DEFINISI:\nSistem pengairan sawah (irigasi) tradisional Bali yang berbasis masyarakat dan filosofi Tri Hita Karana (Tuhan, Manusia, Alam).\n\nNILAI:\nDemokratis, adil, dan egaliter. Petani di hilir tetap mendapat air meski di hulu bisa memonopoli. Diakui UNESCO 2012."
                    },
                    {
                        t: "Sejarah Batik Indonesia",
                        c: "MAKNA:\nSeni melukis kain dengan lilin (malam). Setiap motif memiliki filosofi (contoh: Parang = kekuasaan/raja).\n\nPENGAKUAN:\nUNESCO menetapkan Batik sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi pada 2 Oktober 2009 (Hari Batik Nasional)."
                    },
                    {
                        t: "Sejarah Bahasa Indonesia",
                        c: "ASAL USUL:\nBerasal dari Bahasa Melayu Riau (Lingua Franca perdagangan Nusantara).\n\nSUMPAH PEMUDA:\nDiangkat menjadi bahasa persatuan, bukan bahasa Jawa (mayoritas) demi kesetaraan.\n\nPERKEMBANGAN:\nEjaan Van Ophuijsen -> Soewandi -> EYD -> PUEBI."
                    },
                    {
                        t: "Gerakan Emansipasi Wanita",
                        c: "TOKOH:\n- R.A. Kartini (Jepara): Habis Gelap Terbitlah Terang. Pendidikan wanita.\n- Dewi Sartika (Bandung): Sekolah Istri.\n- Cut Nyak Dien (Aceh): Perjuangan fisik perang.\n- Rasuna Said (Padang): Politik dan Pers.\n\nTUJUAN:\nKesetaraan hak pendidikan dan sosial bagi perempuan."
                    },
                    {
                        t: "Sejarah Pendidikan Nasional",
                        c: "ERA KOLONIAL:\nSekolah hanya untuk bangsawan/Eropa (ELS, HIS, STOVIA).\n\nTAMAN SISWA (1922):\nKi Hajar Dewantara mendirikan sekolah untuk rakyat jelata. Semboyan: Ing Ngarso Sung Tulodo, Ing Madyo Mangun Karso, Tut Wuri Handayani.\n\nERA MERDEKA:\nPendidikan untuk semua (Wajib Belajar)."
                    },
                    {
                        t: "Pelestarian Cagar Budaya",
                        c: "DEFINISI:\nWarisan budaya bersifat kebendaan (Benda, Bangunan, Struktur, Situs, Kawasan) yang perlu dilestarikan.\n\nCONTOH:\nCandi Borobudur, Situs Sangiran, Kota Tua Jakarta.\n\nTANTANGAN:\nPencurian artefak, vandalisme, bencana alam, dan pembangunan modern yang merusak situs."
                    }
                ]
            };

            // ... existing selectMajor, startEntranceExam functions ...

            // --- NEW: LOGIKA SIDANG SKRIPSI (THESIS DEFENSE) ---
            let currentDefense = {
                major: null,
                score: 0,
                qIndex: 0,
                questions: []
            };

            function startThesisDefense(major) {
                currentDefense.major = major;
                currentDefense.score = 0;
                currentDefense.qIndex = 0;
                currentDefense.questions = [...THESIS_DB[major]];

                // Acak urutan soal sidang agar tidak hapalan mati
                currentDefense.questions.sort(() => Math.random() - 0.5);

                showDialogue("DOSEN PENGUJI UTAMA",
                    "Selamat datang di Sidang Akhir Skripsi. \n\nSaya akan mengajukan **5 Pertanyaan Kunci** terkait bidang studimu. \n\nSyarat Kelulusan: **Benar Minimal 4 Soal**. \nJika gagal, kamu harus merevisi draft-mu (mengulang sidang nanti).\n\nApakah kamu siap mempertanggungjawabkan karyamu?",
                    [
                        { text: "SAYA SIAP! (Mulai Sidang)", action: nextDefenseQuestion },
                        { text: "Saya baca buku dulu...", action: closeDialogue }
                    ],
                    'images/lecture.png'
                );
            }

            function nextDefenseQuestion() {
                if (currentDefense.qIndex >= currentDefense.questions.length) {
                    finishDefense();
                    return;
                }

                const qData = currentDefense.questions[currentDefense.qIndex];

                const opts = qData.opts.map(opt => {
                    return {
                        text: opt,
                        action: () => answerDefense(opt === qData.a)
                    };
                });

                // Acak posisi jawaban
                opts.sort(() => Math.random() - 0.5);

                // Tampilkan Soal
                showDialogue(
                    `SIDANG SKRIPSI (${currentDefense.qIndex + 1}/5)`,
                    `PERTANYAAN PENGUJI:\n\n**"${qData.q}"**`,
                    opts,
                    'images/lecture.png'
                );
            }

            function answerDefense(isCorrect) {
                if (isCorrect) {
                    currentDefense.score++;
                    showToast("Penguji Mengangguk... (Benar) ✅");
                } else {
                    showToast("Penguji Mengerutkan Dahi... (Salah) ❌");
                    // Hukuman mental (Energy turun dikit)
                    STATE.player.energy = Math.max(0, STATE.player.energy - 5);
                }

                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                currentDefense.qIndex++;
                setTimeout(() => nextDefenseQuestion(), 800);
            }

            function finishDefense() {
                const passed = currentDefense.score >= 4; // Syarat: Benar 4 dari 5

                if (passed) {
                    let reaction = `Nilai Sidang: **${currentDefense.score * 20}** (A).\n\nSelamat! Kamu berhasil mempertahankan skripsimu dengan sangat baik. \n\nSaya dengan bangga menyatakan kamu **LULUS SIDANG SKRIPSI**!`;
                    if (currentDefense.score === 5) reaction += "\n(Nilai Sempurna! Dosen terkesan!)";

                    showDialogue("DOSEN PEMBIMBING", reaction, [{
                        text: "Alhamdulillah! (Terima Ijazah & Gelar)",
                        action: () => {
                            // CONSUME DRAFT
                            if (STATE.player.inventory['draft_proposal'] > 0) {
                                STATE.player.inventory['draft_proposal']--;
                                if (STATE.player.inventory['draft_proposal'] <= 0) delete STATE.player.inventory['draft_proposal'];
                            }

                            // BERI HADIAH KELULUSAN
                            addItem('buku_tesis', 1);

                            const major = currentDefense.major;
                            if (major === 'teknologi') {
                                addItem('ijazah_teknologi', 1);
                            } else {
                                addItem('ijazah_sejarah', 1);
                            }

                            STATE.player.reputation += 50;
                            STATE.player.money += 5000;
                            gainExp(5000);

                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                            closeDialogue();

                            // 🎬 CINEMATIC WISUDA
                            setTimeout(() => {
                                const isScholar = STATE.player.scholarship || false;
                                playCutsceneWisuda(major, isScholar, () => {
                                    // Setelah wisuda, tampilkan toast selamat & update mentor
                                    const gelar = major === 'teknologi' ? 'S.Kom' : 'S.Hum';
                                    showToast(`🎓 Selamat ${gelar}! Kamu telah wisuda!`);
                                    if (typeof updateMentorBubble === 'function') updateMentorBubble();
                                    // Confetti game partikel tambahan
                                    for (let i = 0; i < 30; i++) {
                                        const angle = Math.random() * Math.PI * 2;
                                        STATE.particles.push({
                                            x: STATE.player.x, y: STATE.player.y,
                                            vx: Math.cos(angle) * (2 + Math.random() * 5),
                                            vy: Math.sin(angle) * (2 + Math.random() * 5),
                                            life: 50 + Math.random() * 30,
                                            color: ['#fbbf24','#86efac','#f9a8d4','#ffffff'][Math.floor(Math.random()*4)]
                                        });
                                    }
                                });
                            }, 500);
                        }
                    }], 'images/lecture.png');
                } else {
                    showDialogue("DOSEN PENGUJI",
                        `Skor: ${currentDefense.score}/5. (Tidak Lulus)\n\nMaaf, penguasaan materimu masih kurang. Jawabanmu banyak yang meleset dari teori.\n\n**STATUS: REVISI MAJOR**\nSilakan pelajari lagi materinya dan ajukan sidang ulang nanti.`,
                        [{
                            text: "Siap Pak, saya akan belajar lagi. (Energy -30)", action: () => {
                                STATE.player.energy = Math.max(0, STATE.player.energy - 30);
                                closeDialogue();
                            }
                        }],
                        'images/lecture.png'
                    );
                }
            }

            function finalizeRoleSetup() {
                updateHUDInfo();

                // UPDATE: Karena penjelasan fitur sudah di awal (startWakeUpSequence), 
                // Mentor Budi sekarang hanya memberikan motivasi penutup agar tidak repetitif.
                showDialogue(STATE.mentorName,
                    "Persiapan selesai! Status dasarmu telah ditetapkan.\n\nIngat pesan saya: Rajinlah menulis **Jurnal Refleksi** setiap hari di rumah agar Gurumu bisa menilai perkembanganmu.",
                    [{
                        text: "Siap, Terima Kasih Mentor!",
                        action: () => {
                            // FIX: KEMBALIKAN MENTOR KE POSISI ASAL (HILANG DARI DEPAN RUMAH)
                            // Agar tidak menghalangi jalan atau terlihat aneh setelah tutorial selesai
                            const villMap = maps['village'];
                            const mentor = villMap.npcs.find(n => n.id === 'mentor');
                            if (mentor) {
                                // UPDATE: Pindahkan ke -99 (Hilang dari map desa)
                                mentor.x = -99;
                                mentor.y = -99;
                                // Reset kecepatan gerak jika perlu
                                mentor.vx = 0;
                                mentor.vy = 0;
                            }

                            // FIX: BUKA KUNCI JURNAL (Akhiri Status Prologue)
                            STATE.isPrologue = false;

                            closeDialogue();

                            // FIX: SIMPAN ULANG SETELAH DIALOG DITUTUP (DATA FINAL)
                            manualSave();

                            // Optional: Buka jurnal untuk Worker/Other roles agar sadar misi
                            setTimeout(() => showDailyQuestPopup(), 500);
                        }
                    }],
                    'images/mentor.png'
                );
            }

            function updateHUDInfo() {
                const p = STATE.player;
                const name = DataService.user ? DataService.user.name : "Player";

                // Update Name & Level
                let roleDisplay = "?";
                if (p.role !== 'none') {
                    roleDisplay = p.role.toUpperCase();
                    // Tampilkan jurusan jika ada
                    if (p.role === 'student' && p.major) {
                        roleDisplay += ` (${p.major.substring(0, 3).toUpperCase()})`;
                    }
                }

                // Tampilkan di area nama atau tooltip (opsional, saat ini pakai nama saja di UI)
                document.getElementById('hud-name').innerText = name.length > 8 ? name.substring(0, 6) + ".." : name;
                document.getElementById('level-display').innerText = p.level;

                // FIX: UPDATE MONEY DISPLAY AGAR SINKRON
                // Menggunakan locale 'id-ID' agar format ribuan menggunakan titik (contoh: 36.000)
                document.getElementById('money-display').innerText = p.money.toLocaleString('id-ID');

                // Update Bars Width
                const hpPct = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
                const enPct = Math.max(0, Math.min(100, (p.energy / 100) * 100)); // Energy max is static 100 usually
                const expPct = Math.max(0, Math.min(100, (p.exp / p.maxExp) * 100));

                // UPDATE: TARGET ELEMENT HUD BARU
                const hudHpBar = document.getElementById('hud-hp-bar');
                if (hudHpBar) hudHpBar.style.width = hpPct + "%";

                document.getElementById('energy-bar').style.width = enPct + "%";
                document.getElementById('exp-bar').style.width = expPct + "%";

                // Text inside bars
                const hudHpText = document.getElementById('hud-hp-text');
                if (hudHpText) hudHpText.innerText = Math.floor(p.hp);

                document.getElementById('energy-text').innerText = Math.floor(p.energy);

                // UPDATE: HAPUS LOGIKA COMBAT HUD LAMA
                /*
                const combatHud = document.getElementById('combat-hud');
                if(STATE.location === 'dungeon') {
                    combatHud.style.display = 'flex';
                } else {
                    combatHud.style.display = 'none';
                }
                */

                // ALWAYS UPDATE BAG ICON
                updateBagIcon();
            }

            // --- NEW FUNCTION: UPDATE BAG ICON ---
            function updateBagIcon() {
                const inv = STATE.player.inventory || {};
                // Hitung total item yang jumlahnya > 0
                let totalItems = 0;
                for (let key in inv) {
                    if (inv[key] > 0) totalItems += inv[key];
                }

                const bagBtn = document.getElementById('bag-btn');
                if (totalItems > 0) {
                    bagBtn.style.backgroundImage = "url('images/tas-isi.png')";
                } else {
                    bagBtn.style.backgroundImage = "url('images/tas-kosong.png')";
                }
            }

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

            // --- FIX: DEFINISI FUNGSI GAMELOOP (WAJIB ADA) ---
            function gameLoop() {
                // 1. Update Logika Game
                update();

                // 2. Render Grafis ke Canvas
                draw();

                // 3. Update Audio System (BGM/SFX)
                if (typeof AudioService !== 'undefined') AudioService.update();

                // 4. FIX: Cek build queue fairy village di setiap frame agar pop-up & bangunan
                //    muncul otomatis meski player sedang tidak berada di fairyVillage
                if (typeof checkBuildQueue === 'function' && STATE.screen === 'play') {
                    checkBuildQueue();
                }

                // 5. Loop Frame berikutnya (60 FPS)
                if (STATE.screen !== 'title' && STATE.screen !== 'login' && STATE.screen !== 'splash') {
                    window.gameLoopId = requestAnimationFrame(gameLoop);
                }
            }

            function update() {

                // UPDATE: PASSIVE INCOME CHECK
                if (STATE.player.role === 'entrepreneur') {
                    updatePassiveIncome();
                }


                // --- FIX: UPDATE POINTER TUTORIAL SELALU (BAHKAN SAAT DIALOG/PAUSE) ---
                // Pindahkan logika ini ke ATAS pengecekan screen !== 'play'
                // Ini memastikan tangan penunjuk tetap muncul dan posisinya benar saat dialog tutorial aktif
                if (STATE.tutorialFocusTarget) {
                    updateTutorialPointerPosition();
                }

                if (STATE.screen !== 'play') return;

                // Removed btnSkill display logic block here

                // --- NEW: UPDATE LIVE TUTORIAL POINTER ---
                // Pastikan pointer selalu menempel pada objek meskipun kamera bergerak
                if (STATE.tutorialFocusTarget) {
                    updateTutorialPointerPosition();
                }

                // --- LOGIKA TOMBOL SKILL (HANYA TAMPIL DI DUNGEON) ---
                const btnSkill = document.getElementById('btn-skill');
                if (btnSkill) {
                    const isCombatZone = (STATE.location === 'dungeon' || STATE.location === 'ruins_battle');
                    if (isCombatZone) {
                        btnSkill.style.display = 'flex';
                        if (STATE.player.skillCooldown > 0) {
                            btnSkill.classList.add('cooldown');
                            const cdSec = Math.ceil(STATE.player.skillCooldown / 60);
                            btnSkill.innerText = cdSec;
                            btnSkill.title = `Cooldown: ${cdSec}s`;
                        } else {
                            btnSkill.classList.remove('cooldown');
                            btnSkill.innerText = '🔥';
                            btnSkill.title = "Ultimate Skill (10 Stamina)";
                        }
                    } else {
                        btnSkill.style.display = 'none';
                    }
                }

                // --- NEW: DECREMENT SKILL COOLDOWN ---
                if (STATE.player.skillCooldown > 0) {
                    STATE.player.skillCooldown--;
                }

                // --- NEW: GLOBAL LOW ENERGY WARNING CHECK ---
                // Cek jika energi kritis (<= 20) dan belum diperingatkan
                if (STATE.player.energy <= 20 && !STATE.lowEnergyWarned) {
                    showToast("⚠️ PERINGATAN: Stamina Kritis! Segera Makan/Istirahat.");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('hit'); // Bunyi alert
                    STATE.lowEnergyWarned = true; // Set flag agar tidak spam
                }
                // Reset flag jika energi sudah diisi kembali (> 20)
                else if (STATE.player.energy > 20) {
                    STATE.lowEnergyWarned = false;
                }

                // UPDATE: Waktu diperlambat (1 Jam Game = 60 Detik Real Time)
                // Rumus: 100 unit (1 jam) / 60 detik / 60 fps ≈ 0.028
                // FIX: Jangan tambah waktu saat proses ganti hari sedang berlangsung
                if (!STATE.isDayChanging) {
                    STATE.time += 0.028;
                }
                // --- FESTIVAL AMBIENT PARTICLES ---
                updateFestivalAmbientParticles();

                if (STATE.player.shiftStarted) {
                    if (STATE.time >= 1600) {
                        STATE.player.shiftStarted = false;
                        STATE.player.salaryDays++;

                        // --- UPDATE: SISTEM GAJI BERJENJANG (CAREER PATH) ---
                        const currentLvl = STATE.player.jobLevel || 1;
                        let dailyWage = 5000; // Lv 1 Magang

                        if (currentLvl === 2) dailyWage = 7500;  // Staff Senior
                        else if (currentLvl === 3) dailyWage = 12000; // Kepala Gudang
                        else if (currentLvl === 4) dailyWage = 25000; // Manajer Cabang

                        // --- NEW: BONUS CINCIN RAJA (PASIF GOLD++) ---
                        let bonusMsg = "";
                        if ((STATE.player.inventory['cincin_legend'] || 0) > 0) {
                            dailyWage = Math.floor(dailyWage * 1.5); // +50% Gaji
                            bonusMsg = " 💍"; // Indikator Bonus
                        }

                        STATE.player.money += dailyWage;
                        STATE.player.energy -= 30;

                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); // SFX Gaji

                        if (STATE.time > 1630) {
                            showToast(`Shift Selesai. Gaji: ${dailyWage.toLocaleString()} G${bonusMsg}`);
                        } else {
                            STATE.player.bossReputation += 1;
                            // AP bonus shift sempurna: 1-5 AP tergantung level jabatan
                            const shiftAP = currentLvl;
                            STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + shiftAP;
                            showToast(`✅ Shift Tepat Waktu! +${dailyWage.toLocaleString()} G | Rep +1 | 🏅 +${shiftAP} AP`);
                        }
                    }
                }

                // --- PART-TIME SHIFT SYSTEM (15:00 - 19:00) ---
                if (STATE.player.partTimeShiftStarted) {
                    if (STATE.time >= 1900) {
                        STATE.player.partTimeShiftStarted = false;
                        STATE.player.partTimeLastWorkedDay = STATE.day;
                        STATE.player.partTimeSalaryDays = (STATE.player.partTimeSalaryDays || 0) + 1;

                        const PT_JOBS = {
                            'bengkel':   { name: '⚒️ Bengkel Besi',   wage: 3500, stat: 'str', statVal: 1 },
                            'penjahit':  { name: '🧵 Tukang Jahit',   wage: 3000, stat: 'int', statVal: 1 },
                            'klinik':    { name: '🩺 Klinik',          wage: 4000, stat: 'rep', statVal: 1 }
                        };
                        const job = PT_JOBS[STATE.player.partTimeJob] || { name: 'Part-Time', wage: 3000, stat: null };
                        STATE.player.money += job.wage;
                        STATE.player.energy -= 20;

                        if (job.stat === 'str') STATE.player.str = (STATE.player.str || 0) + job.statVal;
                        else if (job.stat === 'int') STATE.player.int = (STATE.player.int || 0) + job.statVal;
                        else if (job.stat === 'rep') STATE.player.reputation = (STATE.player.reputation || 0) + job.statVal;

                        STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 1;
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        showToast(`🌙 Part-Time Selesai! ${job.name} +${job.wage.toLocaleString()} G | 🏅 +1 AP`);
                    }
                }

                const totalDays = STATE.day - 1;
                const seasonIndex = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                STATE.season = SEASONS[seasonIndex].toLowerCase();

                const year = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;
                const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;

                // --- NEW: HITUNG NAMA HARI (SENIN-MINGGU) ---
                // (Day 1 = Senin, Day 7 = Minggu, Day 8 = Senin dst)
                const dayName = DAYS_OF_WEEK[(STATE.day - 1) % 7];

                if (!STATE.freeRoamMode) {
                    // FIX: Ubah logika notifikasi Trial Selesai ke Tahun ke-4 (Setelah 3 tahun habis)
                    if (year === 4 && dayInSeason === 1 && STATE.time < 10) {
                        showToast("🔓 MASA TRIAL SELESAI! Semua Akses Terbuka.");
                    }

                    if (year > 5 && !STATE.gameFinished) {
                        triggerGameWin();
                        return;
                    }

                    const daysInYear = DAYS_PER_SEASON * 4;

                    // FIX: Ubah durasi Trial menjadi 3 Tahun (3 * 120 = 360 Hari)
                    // Sebelumnya: 2 * daysInYear (240 Hari)
                    const trialLimit = 3 * daysInYear;

                    const graduationLimit = 5 * daysInYear;

                    let labelText = "";

                    if (STATE.day <= trialLimit) {
                        const left = trialLimit - STATE.day;
                        labelText = `🔒 Trial: ${left} Hari`;
                        document.getElementById('trial-display').style.color = '#ef4444';
                    } else {
                        const left = graduationLimit - STATE.day;
                        labelText = `🎓 Lulus: ${left} Hari`;
                        document.getElementById('trial-display').style.color = '#fbbf24';
                    }

                    document.getElementById('trial-display').innerText = labelText;
                } else {
                    document.getElementById('trial-display').innerText = "∞ Free Roam";
                }

                if (STATE.time >= 2400 && !STATE.isDayChanging) {
                    STATE.time = 0;
                    STATE.day++;

                    // 💔 RELATIONSHIP DECAY: NPC menjauh jika lama tidak disapa
                    try { applyRelationshipDecay(); } catch(e) {}

                    // --- TUTUP FESTIVAL SAAT HARI BERGANTI ---
                    if (STATE.festivalActive) {
                        deactivateFestivalGathering();
                        showToast('🌙 Festival selesai. Warga kembali ke aktivitas masing-masing. Sampai festival berikutnya!');
                    }


                    // --- [KODE PERTANIAN: LOGIKA TUMBUH & SIRAM OTOMATIS (KURCACI)] ---
                    if (STATE.player.farming) {
                        for (const [key, crop] of Object.entries(STATE.player.farming)) {
                            if (crop && crop.type) {
                                // Kurcaci: auto siram sebelum pengecekan tumbuh
                                if (STATE.player.hiredDwarf) {
                                    crop.watered = true;
                                }
                                // Tanaman tumbuh jika sudah disiram
                                if (crop.watered && crop.stage < 3) {
                                    crop.stage++;
                                }
                                // Reset siram SETELAH tumbuh (bukan sebelum)
                                crop.watered = false;
                            }
                        }
                    }

                    // --- [BARU: LOGIKA AUTO PANEN (PERI PANEN)] ---
                    // Jika Peri sudah dihire, cek tanaman yang matang (Stage 3)
                    if (STATE.player.hiredFairy && STATE.player.farming) {
                        let harvestedCount = 0;
                        for (const [key, crop] of Object.entries(STATE.player.farming)) {
                            if (crop && crop.type && crop.stage >= 3) {
                                let item = 'beras';
                                let qty = 1;

                                if (crop.type === 'padi') { item = 'beras'; qty = 3; }
                                else if (crop.type === 'jagung') { item = 'jagung_panen'; qty = 4; }
                                else if (crop.type === 'tomat') { item = 'tomat_panen'; qty = 3; }
                                else if (crop.type === 'rafflesia') { item = 'bunga_rafflesia'; qty = 1; }

                                addItem(item, qty);
                                gainExp(10);
                                harvestedCount++;

                                delete crop.type;
                                delete crop.stage;
                                delete crop.watered;
                            }
                        }
                        if (harvestedCount > 0) {
                            showToast(`Peri Panen: ${harvestedCount} tanaman dipanen otomatis! 🧚‍♀️`);
                        }
                    }
                    // ----------------------------------------------------

                    // RESET SEMUA COUNTER HARIAN (termasuk bonus quest counter)
                    STATE.player.dailyFishingCount  = 0;
                    STATE.player.dailyMonsterKills  = 0;
                    STATE.player.dailyTalkCount     = 0;
                    STATE.player.dailyHarvestCount  = 0;
                    STATE.player.dailySellCount     = 0;  // NEW: counter jual barang
                    STATE.player.dailySelfStudy     = 0;  // NEW: counter belajar mandiri
                    // NOTE: lastDailyClaim TIDAK di-reset di sini karena reset via day number (STATE.day baru)

                    // --- SISTEM KONFLIK PERNIKAHAN DINI ---
                    if (STATE.player.married && !STATE.player.divorced && STATE.player.marriedDay) {
                        setTimeout(() => runMarriageConflictSystem(), 2500);
                    }

                    // --- CEK & AKTIFKAN FESTIVAL HARI INI ---
                    setTimeout(() => checkAndStartFestival(), 1500);

                    // --- FESTIVAL REMINDER H-1 ---
                    setTimeout(() => checkFestivalReminder(), 2000);

                    // --- SISTEM KONFLIK AKADEMIK (STUDENT) ---
                    if (STATE.player.role === 'student' && STATE.player.major) {
                        setTimeout(() => maybeRunStudentConflict(), 3000);
                    }

                    // --- SISTEM KONFLIK WIRAUSAHA (ENTREPRENEUR) ---
                    if (STATE.player.role === 'entrepreneur') {
                        setTimeout(() => maybeRunEntrepreneurConflict(), 3200);
                    }

                    // --- FASE 3: GEMPITA SEASON NOTIFICATION ---
                    // Trigger di musim panas (Summer), hari 5, 14, dan 25 setiap tahun
                    (() => {
                        const totalDays = STATE.day - 1;
                        const seasonIdx = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                        const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;
                        const isSummer = (seasonIdx === 1); // index 0=Spring, 1=Summer, 2=Autumn, 3=Winter

                        if (isSummer && dayInSeason === 5) {
                            setTimeout(() => {
                                showDialogue("📣 PENGUMUMAN — GEMPITA SEASON",
    `🎪 **GEMPITA FESTIVAL — SEMUA JALUR BISA IKUT!**\n\nFestival Desa Nusantara Arsa kini resmi dibuka!\n\n**4 Kategori Lomba:**\n🎓 Akademisi → Portfolio + AP\n⚔️ Pekerja → Karir + Shift sempurna\n💼 Wirausaha → Omzet + BIZ stat\n🏠 Keluarga → Harmoni + AP\n\nSemua role dapat AP dari aktivitas hariannya.\nPengumuman pemenang di hari musim panas ke-25!`,
                                    [{ text: "Siap Berjuang! 🔥", action: closeDialogue }],
                                    null
                                );
                            }, 2000);
                        }

                        if (isSummer && dayInSeason === 14) {
                            setTimeout(() => {
                                const ap = STATE.player.achievementPoints || 0;
                                const pc = (STATE.player.portfolio || []).length;
                                const jc = (STATE.player.reflections || []).length;
                                const role14 = STATE.player.role;
                                let syarat14 = [], met14Items = [];
                                if (role14 === 'student') {
                                    syarat14 = ['Portfolio ≥1','Jurnal ≥5','AP ≥50'];
                                    met14Items = [pc >= 1, jc >= 5, ap >= 50];
                                } else if (role14 === 'worker') {
                                    const jl14 = STATE.player.jobLevel || 1;
                                    syarat14 = ['Karyawan Aktif','Level Jabatan ≥2','AP ≥30'];
                                    met14Items = [STATE.player.jobStatus === 'employed', jl14 >= 2, ap >= 30];
                                } else if (role14 === 'entrepreneur') {
                                    syarat14 = ['BIZ ≥10','Jurnal ≥3','AP ≥30'];
                                    met14Items = [(STATE.player.biz || 0) >= 10, jc >= 3, ap >= 30];
                                } else if (role14 === 'family') {
                                    const sId14 = STATE.player.spouseId;
                                    const love14 = sId14 ? (STATE.player.relationships?.[sId14] || 0) : 0;
                                    syarat14 = ['Sudah Menikah','Cinta ≥50','AP ≥30'];
                                    met14Items = [STATE.player.married, love14 >= 50, ap >= 30];
                                } else { syarat14 = ['Pilih Role dulu!']; met14Items = [false]; }
                                const met14Count = met14Items.filter(Boolean).length;
                                const statusMsg = met14Count === syarat14.length ? '✅ Kamu SUDAH memenuhi semua syarat! Pertahankan!' : `⚠️ Kamu baru memenuhi ${met14Count}/${syarat14.length} syarat. Masih ada 11 hari!`;
                                const detailMsg = syarat14.map((s,i) => `${met14Items[i] ? '🟢' : '🔴'} ${s}`).join('\n');
                                showDialogue("📋 GEMPITA: CEK STATUS FESTIVAL",
                                    `Hari ini adalah batas pengumpulan karya!\n\n**Statusmu (${['none','Akademisi','Pekerja','Wirausaha','Keluarga'].find((v,i)=>['none','student','worker','entrepreneur','family'][i]===role14) || role14}):**\n${detailMsg}\n\n${statusMsg}`,
                                    [{ text: "Oke, Mengerti!", action: closeDialogue }],
                                    null
                                );
                            }, 2000);
                        }

                        if (isSummer && dayInSeason === 25) {
                            setTimeout(async () => {
                                const ap = STATE.player.achievementPoints || 0;
                                const pc = (STATE.player.portfolio || []).length;
                                const jc = (STATE.player.reflections || []).length;
                                const roleF = STATE.player.role;
                                let eligible = false;
                                if (roleF === 'student') eligible = (pc >= 1 && jc >= 5 && ap >= 50);
                                else if (roleF === 'worker') eligible = (STATE.player.jobStatus === 'employed' && (STATE.player.jobLevel || 1) >= 2 && ap >= 30);
                                else if (roleF === 'entrepreneur') eligible = ((STATE.player.biz || 0) >= 10 && jc >= 3 && ap >= 30);
                                else if (roleF === 'family') { const sIdF = STATE.player.spouseId; const loveF = sIdF ? (STATE.player.relationships?.[sIdF] || 0) : 0; eligible = (STATE.player.married && loveF >= 50 && ap >= 30); }

                                if (eligible) {
                                    // Cek ranking di antara semua siswa (ambil dari cache jika ada, atau hitung lokal)
                                    let myRank = 1; // default assume rank 1 jika tidak ada data cloud
                                    try {
                                        const allStudents = await DataService.getAllStudents();
                                        const calcScore = (sd) => {
                                                const r = sd.role || 'none'; const sap = sd.achievementPoints || 0;
                                                const spc = (sd.portfolio||[]).length; const sjc = (sd.reflections||[]).length;
                                                const jl = sd.jobLevel || 1; const bz = sd.biz || 0; const mn = sd.money || 0;
                                                const sId = sd.spouseId; const lv = sId ? (sd.relationships?.[sId] || 0) : 0;
                                                const rep = sd.reputation || 0;
                                                if (r === 'student') return sap + (spc * 20) + (sjc * 5);
                                                if (r === 'worker') return sap + (jl * 30) + ((sd.bossReputation || 0) * 2);
                                                if (r === 'entrepreneur') return sap + (bz * 10) + Math.floor(mn / 1000);
                                                if (r === 'family') return sap + (lv * 2) + rep;
                                                return sap;
                                            };
                                            const myRoleF2 = STATE.player.role;
                                            const ranked = allStudents
                                                .filter(s => {
                                                    const sd = s.saveData || {}; const r = sd.role;
                                                    const sap = sd.achievementPoints || 0; const spc = (sd.portfolio||[]).length; const sjc = (sd.reflections||[]).length;
                                                    if (r !== myRoleF2) return false; // hanya sesama kategori
                                                    if (r === 'student') return sap >= 50 && spc >= 1 && sjc >= 5;
                                                    if (r === 'worker') return sd.jobStatus === 'employed' && (sd.jobLevel||1) >= 2 && sap >= 30;
                                                    if (r === 'entrepreneur') return (sd.biz||0) >= 10 && sjc >= 3 && sap >= 30;
                                                    if (r === 'family') { const sId = sd.spouseId; const lv = sId ? (sd.relationships?.[sId]||0):0; return sd.married && lv >= 50 && sap >= 30; }
                                                    return false;
                                                })
                                                .map(s => ({ email: s.email, score: calcScore(s.saveData || {}) }))
                                                .sort((a, b) => b.score - a.score);
                                            const myScore = calcScore(STATE.player);
                                        const myPos = ranked.findIndex(r => r.email === DataService.user?.email);
                                        if (myPos !== -1) myRank = myPos + 1;
                                    } catch (e) { /* offline fallback */ }

                                    // Reward berdasarkan rank
                                    let rankMsg = "";
                                    let rankBonus = 0;
                                    let rankTitle = "";
                                    let awardToga = false;

                                    if (myRank === 1) {
                                        rankMsg = "🥇 **JUARA 1 — GEMPITA CHAMPION!**\nKamu mendominasi seluruh kelas!";
                                        rankBonus = 300;
                                        rankTitle = "🥇 Gempita Champion";
                                        awardToga = true;
                                        STATE.player.inventory['toga_gempita'] = 1;
                                        STATE.player.inventory['mahkota_gempita'] = 1; // bonus item juara 1
                                        addItem('permata', 3);
                                    } else if (myRank === 2) {
                                        rankMsg = "🥈 **JUARA 2 — GEMPITA RUNNER-UP!**\nHampir sempurna, pertahankan!";
                                        rankBonus = 200;
                                        rankTitle = "🥈 Gempita Runner-up";
                                        awardToga = true;
                                        STATE.player.inventory['toga_gempita'] = 1;
                                        addItem('permata', 2);
                                    } else if (myRank === 3) {
                                        rankMsg = "🥉 **JUARA 3 — GEMPITA THIRD PLACE!**\nKerja keras yang luar biasa!";
                                        rankBonus = 100;
                                        rankTitle = "🥉 Gempita Finalist";
                                        awardToga = true;
                                        STATE.player.inventory['toga_gempita'] = 1;
                                        addItem('permata', 1);
                                    } else {
                                        rankMsg = `📋 **PESERTA GEMPITA (Peringkat #${myRank})**\nKamu lolos seleksi administrasi!`;
                                        rankBonus = 50;
                                        rankTitle = "🏅 Peserta Gempita";
                                    }

                                    STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 100 + rankBonus;
                                    STATE.player.money += rankBonus * 50; // Gold bonus
                                    if (!STATE.player.titles) STATE.player.titles = [];
                                    if (!STATE.player.titles.includes(rankTitle)) STATE.player.titles.push(rankTitle);

                                    const togaMsg = awardToga ? '\n\n👗 **TOGA GEMPITA JUARA** telah masuk ke Lemari Pakaianmu! Buka Lemari untuk mengenakannya.' : '';

                                    showDialogue("🏆 GEMPITA AWARDS — HARI PENGUMUMAN!",
                                        `🎉 **SELAMAT! KAMU LOLOS GEMPITA SEASON!**\n\n${rankMsg}\n\n✅ Portfolio: ${pc} karya | ✅ Jurnal: ${jc} entri | ✅ AP: ${ap} poin\n\n🎁 **HADIAH DITERIMA:**\n• +${100 + rankBonus} Achievement Points\n• +${rankBonus * 50} Gold\n• Gelar: ${rankTitle}${togaMsg}`,
                                        [{ text: "YEAY! Terima Kasih! 🏅", action: () => {
                                            closeDialogue();
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('levelup');
                                        }}],
                                        null
                                    );
                                } else {
                                    showDialogue("🎪 GEMPITA FESTIVAL — HARI PENGUMUMAN",
                                        `Hari Festival telah tiba!\n\nSayangnya, kamu belum memenuhi syarat kategori ${{'student':'🎓 Akademisi','worker':'⚔️ Pekerja','entrepreneur':'💼 Wirausaha','family':'🏠 Keluarga'}[roleF] || roleF}.\n\nAP kamu saat ini: ${ap} poin.\n\nJangan menyerah! Gempita Festival berikutnya akan datang musim panas tahun depan!`,
                                        [{ text: "Tahun Depan Pasti Lolos! 💪", action: closeDialogue }],
                                        null
                                    );
                                }
                            }, 3000);
                        }
                    })();

                    // --- FARM HELPER AMBIENT PARTICLES (per-hari, saat ganti hari) ---
                    if (STATE.player.hiredDwarf || STATE.player.hiredFairy) {
                        setTimeout(() => {
                            if (STATE.location === 'village') {
                                const fMap = MAPS['village'];
                                if (fMap && fMap.npcs) {
                                    fMap.npcs.forEach(npc => {
                                        if (npc.id === 'kurcaci_farm' && STATE.player.hiredDwarf) {
                                            createParticle(npc.x * TILE_SIZE + 14, npc.y * TILE_SIZE, '#86efac');
                                            createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE + 14, '#fbbf24');
                                        }
                                        if (npc.id === 'peri_farm' && STATE.player.hiredFairy) {
                                            createParticle(npc.x * TILE_SIZE + 14, npc.y * TILE_SIZE, '#f9a8d4');
                                            createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE + 14, '#c084fc');
                                        }
                                    });
                                }
                            }
                        }, 500);
                    }

                    if (STATE.player.shiftStarted) {
                        STATE.player.shiftStarted = false;
                        STATE.player.bossReputation -= 5;
                        showToast("Boss Marah: Kamu tidak absen pulang!");
                    }

                    if (STATE.player.salaryDays >= 30) {
                        STATE.player.salaryDays = 0;
                        const rep = STATE.player.bossReputation || 50;
                        const bonus = rep * 100;
                        STATE.player.money += bonus;
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                        // Reaksi bos berdasarkan reputasi
                        let bossMonthMsg = '';
                        if (rep >= 80) {
                            bossMonthMsg = `🌟 Pak Hendra: "Kamu karyawan terbaik bulan ini! Bonus penuh untukmu!" (+${bonus.toLocaleString()} G)`;
                            gainExp(50);
                        } else if (rep >= 50) {
                            bossMonthMsg = `😊 Pak Hendra: "Kerja cukup baik bulan ini. Bonus sesuai performa." (+${bonus.toLocaleString()} G)`;
                        } else if (rep >= 25) {
                            bossMonthMsg = `😐 Pak Hendra: "Kinerja bulan ini mengecewakan. Bonus dipotong." (+${bonus.toLocaleString()} G)\n⚠️ Perbaiki kinerjamu atau jabatanmu terancam!`;
                        } else {
                            bossMonthMsg = `😠 Pak Hendra: "Kamu hampir tidak layak dapat bonus. Ini peringatan keras terakhir!" (+${bonus.toLocaleString()} G)\n🚨 Reputasi kritis! Konflik berikutnya bisa berujung pemecatan!`;
                        }
                        showToast(bossMonthMsg);
                    }

                    // --- NEW: BEASISWA BULANAN (KHUSUS MAHASISWA BERPRESTASI) ---
                    // Trigger setiap awal bulan (Hari 31, 61, 91, dst) -> 1 Bulan = 30 Hari
                    if (STATE.player.role === 'student' && STATE.player.scholarship && (STATE.day - 1) % 30 === 0 && STATE.day > 1) {
                        const scholarshipAmount = 15000;
                        STATE.player.money += scholarshipAmount;

                        // Tampilkan Notifikasi Uang Saku
                        setTimeout(() => {
                            showDialogue("KAMPUS - BAGIAN KEUANGAN",
                                `📧 **TRANSFER BEASISWA MASUK**\n\nHalo Mahasiswa Berprestasi,\nUang saku beasiswa bulanan sebesar **Rp ${scholarshipAmount.toLocaleString()}** telah ditransfer ke rekening Anda.\n\nGunakan untuk biaya hidup dan beli buku pelajaran ya!`,
                                [{ text: "Terima Kasih! (Cair)", action: closeDialogue }],
                                'images/lecture.png'
                            );
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        }, 2500); // Delay sedikit agar muncul setelah notifikasi ganti hari
                    }

                    // --- NEW: SISTEM BAYAR UKT TAHUNAN (UPDATE LOGIKA BEASISWA VS REGULER) ---
                    // Trigger setiap awal tahun baru (Hari 121, 241, dst) -> 1 Tahun = 120 Hari
                    if (STATE.player.role === 'student' && (STATE.day - 1) % 120 === 0 && STATE.day > 1) {
                        const currentYear = Math.ceil(STATE.day / 120);

                        // CEK 1: APAKAH MAHASISWA BEASISWA?
                        if (STATE.player.scholarship) {
                            // JIKA BEASISWA: GRATIS
                            setTimeout(() => {
                                showDialogue("BAGIAN KEUANGAN KAMPUS",
                                    `📢 **PEMBERITAHUAN TAHUN AJARAN BARU**\n\nMemasuki Tahun ke-${currentYear}.\n\nStatus Anda: **PENERIMA BEASISWA**\nBiaya UKT: **GRATIS (Rp 0)**.\n\nPertahankan prestasimu!`,
                                    [{ text: "Alhamdulillah (Lanjut Kuliah)", action: closeDialogue }],
                                    'images/lecture.png'
                                );
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            }, 1500);
                        }
                        // CEK 2: JIKA BUKAN BEASISWA (REGULER)
                        else {
                            const uktAmount = 600000;

                            // Tarik Uang (Bisa Minus/Hutang)
                            STATE.player.money -= uktAmount;

                            // Tampilkan Notifikasi Tagihan
                            setTimeout(() => {
                                let statusMsg = "";
                                let titleMsg = "TAGIHAN UKT OTOMATIS";
                                let iconMsg = "✅ Lunas";

                                if (STATE.player.money < 0) {
                                    statusMsg = `\n\n⚠️ **PERINGATAN KRITIS**:\nSaldo Anda MINUS (${STATE.player.money.toLocaleString()} G). \nSegera lunasi hutang ini atau Ijazah Anda akan ditahan!`;
                                    titleMsg = "TUNGGAKAN UKT";
                                    iconMsg = "❌ Berhutang";
                                }

                                showDialogue("BAGIAN KEUANGAN KAMPUS",
                                    `📢 **PEMBERITAHUAN TAHUN AJARAN BARU**\n\nMemasuki Tahun ke-${currentYear}.\nBiaya UKT (Jalur Reguler) sebesar **Rp ${uktAmount.toLocaleString()}** telah dibebankan ke rekening Anda.\n\nStatus: ${iconMsg}${statusMsg}`,
                                    [{ text: "Mengerti (Lanjut Kuliah)", action: closeDialogue }],
                                    'images/lecture.png'
                                );

                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            }, 1500);
                        }
                    }

                    randomizeWeather();

                    // --- FIX: PASTIKAN TREN HARIAN DIGENERATE SAAT GANTI HARI ---
                    generateDailyTrend();

                    // --- NEW: RESPAWN BUNGA LIAR SETIAP HARI ---
                    spawnWildFlowers();

                    // --- NEW: POPUP QUEST HARIAN SAAT GANTI HARI ---
                    showDailyQuestPopup();

                    // showToast(`Day ${STATE.day} (${STATE.season.toUpperCase()})`); // Toast diganti popup biar lebih jelas
                }

                // --- NEW: FAINTING MECHANIC (PINGSAN KARENA LELAH) ---
                if (STATE.player.energy <= 0) {
                    handleFaint();
                    return; // Hentikan update frame ini
                }

                const btnAction = document.getElementById('btn-action');
                const entranceNear = checkEntranceProximity();

                // LOGIC BARU: Cek Interaksi untuk Visibility Tombol
                let showActionButton = false;
                let actionIcon = '💬';

                // 1. Cek Dungeon (Selalu Muncul untuk Serang)
                if (STATE.location === 'dungeon' || STATE.location === 'ruins_battle') {
                    showActionButton = true;
                    actionIcon = '⚔️';
                }
                // 2. Cek Fishing (Selalu Muncul)
                else if (STATE.fishing.active) {
                    showActionButton = true;
                    actionIcon = '🎣';
                }
                // 3. Cek Interaksi (Bangunan/Pintu)
                else if (entranceNear) {
                    showActionButton = true;
                    // FIX: Custom Icon berdasarkan Tipe Bangunan
                    if (entranceNear.id === 'port') {
                        actionIcon = '🎣';
                    }
                    // UPDATE: Ganti Ikon Pintu jadi Scroll untuk Papan Misi
                    else if (entranceNear.id === 'papan_misi') {
                        actionIcon = '📜';
                    }
                    // UPDATE: Ganti Ikon Pintu jadi Piala untuk Statue
                    else if (entranceNear.id === 'statue_rank') {
                        actionIcon = '🏆';
                    }
                    else {
                        actionIcon = '🚪';
                    }
                }
                // 4. Cek Interaksi (NPC & Object)
                else {
                    // Cek NPC
                    const map = maps[STATE.location];

                    // --- UPDATE: Logic Deteksi NPC (Menggunakan Jarak Radial) ---
                    // Cari NPC terdekat dalam radius interaksi
                    let closestNPC = null;
                    let minNPCDist = 80; // Radius deteksi NPC

                    // FIX fairyVillage: gunakan tile size & posisi runtime yang benar
                    const _btnTS = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;

                    for (let npc of map.npcs) {
                        if (!isNPCActive(npc)) continue;
                        const pCX = STATE.player.x + (STATE.player.w / 2);
                        const pCY = STATE.player.y + (STATE.player.h / 2);

                        let nCX, nCY;
                        if (STATE.location === 'fairyVillage' && typeof fvNpcRuntime !== 'undefined' && fvNpcRuntime[npc.id]) {
                            const rt = fvNpcRuntime[npc.id];
                            nCX = rt.px + 19;
                            nCY = rt.py + 29;
                        } else {
                            nCX = (npc.x * _btnTS) + ((npc.w || 40) / 2);
                            nCY = (npc.y * _btnTS) + ((npc.h || 60) / 2);
                        }

                        const radius = STATE.location === 'fairyVillage' ? _btnTS * 2.5 : 80;
                        const dist = Math.hypot(pCX - nCX, pCY - nCY);
                        if (dist < radius && dist < minNPCDist) {
                            closestNPC = npc;
                            minNPCDist = dist;
                        }
                    }

                    if (closestNPC) {
                        showActionButton = true;
                        if (STATE.player.married && STATE.player.spouseId === closestNPC.id) {
                            actionIcon = '💖';
                        } else if (closestNPC.dialogFn === 'collectFairyDust') {
                            actionIcon = '✨';
                        } else if (closestNPC.dialogFn === 'openIstanaDialog') {
                            actionIcon = '🏰';
                        } else {
                            actionIcon = '💬';
                        }
                        // FIX fairyVillage: simpan nama NPC untuk label tombol
                        if (STATE.location === 'fairyVillage' && closestNPC.name) {
                            btnAction.dataset.fvLabel = actionIcon + ' ' + closestNPC.name;
                        } else {
                            btnAction.dataset.fvLabel = '';
                        }
                    }

                    // Scan Object Nearby (Jika belum ketemu NPC)
                    if (!showActionButton) {
                        // --- FIX: DEFINISI VARIABEL BOUNDING BOX PLAYER ---
                        const buffer = 10;
                        const pLeft = STATE.player.x - buffer;
                        const pRight = STATE.player.x + STATE.player.w + buffer;
                        const pTop = STATE.player.y - buffer;
                        const pBottom = STATE.player.y + STATE.player.h + buffer;

                        for (let obj of map.objects) {
                            // --- FIX: DEFINISI VARIABEL BOUNDING BOX OBJECT ---
                            const oLeft = obj.x * TILE_SIZE;
                            const oRight = (obj.x + (obj.w || 1)) * TILE_SIZE;
                            const oTop = obj.y * TILE_SIZE;
                            const oBottom = (obj.y + (obj.h || 1)) * TILE_SIZE;

                            // --- UPDATE: LOGIKA DETEKSI OBJEK "SENTUH" (BERSENTUHAN) ---
                            // ... existing object detection logic ...
                            const isTouching = (pLeft < oRight && pRight > oLeft &&
                                pTop < oBottom && pBottom > oTop);

                            if (isTouching) {
                                showActionButton = true;
                                // Icon khusus berdasarkan tipe objek
                                if (obj.type === 'mailbox') actionIcon = '📬';
                                else if (obj.type === 'fishing_spot') actionIcon = '🎣';
                                else if (obj.type === 'sign') actionIcon = '🪧';
                                else if (obj.type === 'bookshelf') actionIcon = '📖';
                                else if (obj.type === 'bed') actionIcon = '🛏️';
                                else if (obj.type === 'kitchen') actionIcon = '🍳';
                                else if (obj.type === 'chores') actionIcon = '🧹';
                                else actionIcon = '🖐️';
                                break;
                            }
                        }
                    }

                    // --- NEW: CEK TILE LAHAN PERTANIAN (JIKA TIDAK ADA OBJEK/NPC) ---
                    if (!showActionButton && STATE.location === 'village') {
                        const pTx = Math.floor((STATE.player.x + 10) / TILE_SIZE);
                        const pTy = Math.floor((STATE.player.y + 15) / TILE_SIZE);
                        const tIdx = pTy * ISLAND_W + pTx;

                        // Tile ID 5 adalah Tanah Lahan
                        if (map.tiles[tIdx] === 5) {
                            showActionButton = true;

                            // CEK SYARAT: HARUS SUDAH DAPAT KURCACI TANI
                            if (STATE.player.hiredDwarf) {
                                // Jika sudah punya kurcaci, cek kondisi tanah spesifik
                                const farmKey = `${pTx}_${pTy}`;

                                // Pastikan object farming ada
                                if (!STATE.player.farming) STATE.player.farming = {};
                                const crop = STATE.player.farming[farmKey];

                                if (crop && crop.type) {
                                    // Ada tanaman
                                    if (crop.stage >= 3) {
                                        actionIcon = '🌾'; // Siap Panen
                                        btnAction.title = "Panen Tanaman";
                                    } else if (!crop.watered) {
                                        actionIcon = '💧'; // Perlu Disiram
                                        btnAction.title = "Siram Tanaman";
                                    } else {
                                        actionIcon = '👀'; // Sudah disiram/tumbuh
                                        btnAction.title = "Lihat Tanaman";
                                    }
                                } else if (crop && crop.tilled) {
                                    // Tanah sudah dicangkul, siap tanam
                                    actionIcon = '🌱';
                                    btnAction.title = "Tanam Bibit";
                                } else {
                                    // Tanah biasa, perlu dicangkul
                                    actionIcon = '⛏️';
                                    btnAction.title = "Cangkul Lahan";
                                }
                            } else {
                                // BELUM PUNYA KURCACI -> DISILANG
                                actionIcon = '🚫';
                                btnAction.title = "Lahan Belum Bisa Digunakan";
                            }
                        }
                    }
                }

                // UPDATE DOM BUTTON
                if (showActionButton) {
                    btnAction.style.display = 'flex';
                    // FIX fairyVillage: NPC tetap tampilkan nama, bangunan cukup ikon 🚪
                    if (STATE.location === 'fairyVillage' && btnAction.dataset.fvLabel) {
                        btnAction.innerText = btnAction.dataset.fvLabel;
                        btnAction.style.fontSize = '11px';
                        btnAction.style.padding = '6px 12px';
                    } else {
                        // Sama persis seperti peta utama — hanya ikon, font default bulat
                        btnAction.innerText = actionIcon;
                        btnAction.style.fontSize = '';
                        btnAction.style.padding = '';
                    }

                    // --- NEW: DYNAMIC ACTION TOOLTIP (PENJELASAN FUNGSI TOMBOL) ---
                    if (actionIcon === '⚔️') btnAction.title = "Serang Musuh (Attack)";
                    else if (actionIcon === '⛏️') btnAction.title = "Cangkul Lahan"; // NEW
                    else if (actionIcon === '🚫') btnAction.title = "Lahan Terkunci"; // NEW
                    else if (actionIcon === '🎣') btnAction.title = "Tarik Pancingan";
                    else if (actionIcon === '🚪') btnAction.title = "Masuk/Keluar";
                    else if (actionIcon === '📜') btnAction.title = "Baca Papan Info";
                    else if (actionIcon === '🏆') btnAction.title = "Lihat Peringkat";
                    else if (actionIcon === '💬') btnAction.title = "Sapa Warga";
                    else if (actionIcon === '💖') btnAction.title = "Interaksi Pasangan";
                    else if (actionIcon === '📬') btnAction.title = "Cek Kotak Surat";
                    else if (actionIcon === '🪧') btnAction.title = "Baca Tanda";
                    else if (actionIcon === '📖') btnAction.title = "Baca Buku/Arsip";
                    else if (actionIcon === '🛏️') btnAction.title = "Tidur/Istirahat";
                    else if (actionIcon === '📦') btnAction.title = "Ambil/Sortir Barang";
                    else if (actionIcon === '🪙') btnAction.title = "Manajemen Kasir";
                    else if (actionIcon === '☎️') btnAction.title = "Belanja Katalog";
                    else if (actionIcon === '👗') btnAction.title = "Ganti Pakaian";
                    else if (actionIcon === '📅') btnAction.title = "Cek Kalender";
                    else if (actionIcon === '📓') btnAction.title = "Save/Jurnal";
                    else if (actionIcon === '💊') btnAction.title = "Ambil Obat";
                    else if (actionIcon === '🗄️') btnAction.title = "Cek Arsip";
                    else if (actionIcon === '🏺') btnAction.title = "Lihat Koleksi";
                    else if (actionIcon === '🛡️') btnAction.title = "Lihat Equipment";
                    else if (actionIcon === '🍽️') btnAction.title = "Lihat Makanan";
                    else if (actionIcon === '🍳') btnAction.title = "Masak";
                    else if (actionIcon === '🥘') btnAction.title = "Masak Sup";
                    else if (actionIcon === '🕸️') btnAction.title = "Cek Jaring";
                    else if (actionIcon === '🧊') btnAction.title = "Cek Ikan";
                    else if (actionIcon === '🗿') btnAction.title = "Berdoa";
                    else if (actionIcon === '💐') btnAction.title = "Persembahan";
                    else if (actionIcon === '🕯️') btnAction.title = "Periksa Lilin";
                    else btnAction.title = "Interaksi";

                    // Animasi pop-in kecil jika baru muncul
                    if (btnAction.dataset.visible !== "true") {
                        btnAction.style.animation = "popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                        btnAction.dataset.visible = "true";
                    }
                } else {
                    btnAction.style.display = 'none';
                    btnAction.dataset.visible = "false";
                }

                let hours = Math.floor(STATE.time / 100);
                let minutes = Math.floor((STATE.time % 100) * 0.6);
                let timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                document.getElementById('clock-display').innerText = timeString;

                let timeLabel = "Malam";
                if (hours >= 4 && hours < 10) timeLabel = "Pagi";
                else if (hours >= 10 && hours < 15) timeLabel = "Siang";
                else if (hours >= 15 && hours < 18) timeLabel = "Sore";
                else if (hours >= 18 || hours < 4) timeLabel = "Malam";

                const weatherInd = {
                    'clear': 'Cerah', 'rain': 'Hujan', 'snow': 'Salju',
                    'sakura': 'Bunga Gugur', 'fall_leaves': 'Daun Gugur'
                };
                document.getElementById('weather-display').innerText = `${timeLabel}, ${weatherInd[STATE.weather] || 'Cerah'}`;

                // --- UPDATE: TAMPILKAN HARI DI UI ---
                document.getElementById('full-date-display').innerText = `${dayName}, D${dayInSeason} ${STATE.season.charAt(0).toUpperCase() + STATE.season.slice(1)} Y${year}`;

                if (STATE.location === 'village' && STATE.time < 1800) {

                    // UPDATE: Burung sekarang muncul di Spring, Summer, dan Autumn (Kecuali Winter)
                    if (STATE.season !== 'winter') {
                        if (Math.random() < 0.01) {
                            STATE.critters.push({
                                type: 'bird',
                                x: -50,
                                y: Math.random() * (ISLAND_H * TILE_SIZE) / 2,
                                vx: 2 + Math.random() * 2,
                                vy: (Math.random() - 0.5) * 0.5,
                                life: 1000,
                                flap: 0
                            });
                        }
                    }

                    // --- NEW: SPAWN SILUET IKAN DI LAUT ---
                    // Muncul di semua musim, siang hari
                    if (Math.random() < 0.05) { // 5% chance per frame
                        // Posisi acak di seluruh map
                        const fx = Math.random() * (ISLAND_W * TILE_SIZE);
                        const fy = Math.random() * (ISLAND_H * TILE_SIZE);

                        // Cek apakah posisi tersebut adalah AIR (Tile ID 0)
                        const tx = Math.floor(fx / TILE_SIZE);
                        const ty = Math.floor(fy / TILE_SIZE);
                        const tIdx = ty * ISLAND_W + tx;

                        // Akses array villageTiles global
                        if (villageTiles[tIdx] === 0) {
                            STATE.critters.push({
                                type: 'fish_silhouette',
                                x: fx,
                                y: fy,
                                vx: (Math.random() - 0.5) * 0.8, // Gerakan pelan & tenang
                                vy: (Math.random() - 0.5) * 0.8,
                                life: 600 + Math.random() * 300, // Hidup lama
                                size: 0.8 + Math.random() * 0.6  // Variasi ukuran
                            });
                        }
                    }

                    if (STATE.season === 'autumn') {
                        if (Math.random() < 0.02) {
                            const cx = STATE.camera.x + Math.random() * GAME_WIDTH;
                            const cy = STATE.camera.y + Math.random() * GAME_HEIGHT;
                            STATE.critters.push({
                                type: 'butterfly',
                                x: cx,
                                y: cy,
                                vx: 0,
                                vy: 0,
                                life: 400,
                                color: ['#fbbf24', '#f87171', '#60a5fa'][Math.floor(Math.random() * 3)]
                            });
                        }
                    }
                } else {
                    if (STATE.time >= 1800) STATE.critters = [];
                }

                STATE.critters.forEach((c, i) => {
                    c.life--;
                    if (c.life <= 0) {
                        STATE.critters.splice(i, 1);
                        return;
                    }

                    if (c.type === 'bird') {
                        c.x += c.vx;
                        c.y += c.vy;
                        c.flap += 0.2;
                        if (c.x > (ISLAND_W * TILE_SIZE) + 100) c.life = 0;
                    }
                    // --- NEW: UPDATE GERAKAN IKAN ---
                    else if (c.type === 'fish_silhouette') {
                        c.x += c.vx;
                        c.y += c.vy;

                        // Cek Tile Depan (Agar tidak nabrak daratan)
                        const nextTx = Math.floor((c.x + c.vx * 20) / TILE_SIZE);
                        const nextTy = Math.floor((c.y + c.vy * 20) / TILE_SIZE);
                        const tIdx = nextTy * ISLAND_W + nextTx;

                        // Jika menabrak daratan (bukan air), putar balik perlahan
                        if (villageTiles[tIdx] !== 0) {
                            c.vx *= -1;
                            c.vy *= -1;
                        }

                        // Ubah arah sedikit secara acak agar natural
                        if (Math.random() < 0.01) {
                            c.vx += (Math.random() - 0.5) * 0.2;
                            c.vy += (Math.random() - 0.5) * 0.2;
                        }
                    }
                    else if (c.type === 'butterfly') {
                        c.x += (Math.random() - 0.5) * 2;
                        c.y += (Math.random() - 0.5) * 2;
                    }
                });

                if (STATE.weather !== 'clear' && STATE.location === 'village') {
                    const maxParticles = (STATE.weather === 'rain' || STATE.weather === 'snow') ? 200 : 80;

                    if (STATE.weatherParticles.length < maxParticles) {
                        let pType = STATE.weather;
                        let pVx = 0, pVy = 0;

                        if (pType === 'rain') { pVx = -0.5; pVy = 8 + Math.random() * 2; }
                        else if (pType === 'snow') { pVx = -0.2 + Math.random() * 0.4; pVy = 1 + Math.random(); }
                        else if (pType === 'sakura' || pType === 'fall_leaves') {
                            pVx = Math.random() - 0.5;
                            pVy = 0.5 + Math.random();
                        }

                        STATE.weatherParticles.push({
                            x: Math.random() * canvas.width,
                            y: -10,
                            vx: pVx,
                            vy: pVy,
                            type: pType,
                            swayOffset: Math.random() * 10,
                            life: 300
                        });
                    }
                }

                if (STATE.location !== 'village') STATE.weatherParticles = [];

                STATE.weatherParticles.forEach((p, i) => {
                    if (p.type === 'sakura' || p.type === 'fall_leaves') {
                        p.x += Math.sin(p.y * 0.02 + p.swayOffset) * 0.5 + (Math.random() - 0.5) * 0.2;
                        p.y += p.vy;
                    } else {
                        p.x += p.vx;
                        p.y += p.vy;
                    }

                    if (p.y > canvas.height) {
                        p.y = -10;
                        p.x = Math.random() * canvas.width;
                    }
                });

                let dx = 0, dy = 0;

                // --- UPDATE: MOVEMENT LOGIC (KEYBOARD + TOUCH HYBRID) ---
                if (!STATE.fishing.active && !STATE.minigame) {

                    // 1. Cek Keyboard (WASD / Arrows)
                    if (keys['ArrowUp'] || keys['KeyW']) dy = -1;
                    if (keys['ArrowDown'] || keys['KeyS']) dy = 1;
                    if (keys['ArrowLeft'] || keys['KeyA']) dx = -1;
                    if (keys['ArrowRight'] || keys['KeyD']) dx = 1;

                    // 2. Cek Touchscreen (Jika Keyboard tidak ditekan, atau mau digabung)
                    if (dx === 0 && dy === 0 && inputState.active) {
                        dx = inputState.x;
                        dy = inputState.y;

                        // Threshold kecil agar karakter benar-benar berhenti (Deadzone)
                        if (Math.abs(dx) < 0.1) dx = 0;
                        if (Math.abs(dy) < 0.1) dy = 0;
                    }
                }

                // Normalisasi vektor hanya jika input dari keyboard (karena touch input sudah cos/sin)
                // Jika dx/dy adalah 1/-1 (keyboard), normalisasi. Jika desimal (touch), biarkan (agar kecepatan analog)
                if ((Math.abs(dx) === 1 || Math.abs(dy) === 1) && !inputState.active) {
                    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
                }

                // --- SISTEM KELELAHAN BERJALAN (Walking Fatigue) ---
                // Jika pemain bergerak
                if (dx !== 0 || dy !== 0) {
                    // Tambahkan counter langkah
                    const stepCost = 1;
                    STATE.player.stepsTaken = (STATE.player.stepsTaken || 0) + stepCost;

                    // Setiap 300 frame gerakan (sekitar 5 detik jalan terus menerus), kurangi 1 Energi
                    if (STATE.player.stepsTaken > 300) {
                        if (STATE.player.energy > 0) {
                            STATE.player.energy = Math.max(0, STATE.player.energy - 1);

                            // Visual Feedback kecil agar pemain sadar
                            spawnFloatingText(STATE.player.x, STATE.player.y - 20, "-1 ⚡", "#facc15", 10);

                            // Peringatan jika energi kritis karena jalan
                            if (STATE.player.energy === 20) {
                                showToast("⚠️ Capek banget... butuh makan/istirahat!");
                            }
                        }
                        STATE.player.stepsTaken = 0; // Reset counter
                    }
                }

                const currentSpeed = STATE.player.speed;
                const nextX = STATE.player.x + dx * currentSpeed;
                const nextY = STATE.player.y + dy * currentSpeed;

                // --- CHECK ALL COLLISIONS ---
                const wallX = checkWall(nextX, STATE.player.y);
                const wallY = checkWall(STATE.player.x, nextY);

                // --- UPDATE: Collision Logic diperbaiki di dalam fungsi checkNPCCollision ---
                const npcX = checkNPCCollision(nextX, STATE.player.y);
                const npcY = checkNPCCollision(STATE.player.x, nextY);

                const objX = checkObjectCollision(nextX, STATE.player.y);
                const objY = checkObjectCollision(STATE.player.x, nextY);

                const bldX = checkBuildingCollision(nextX, STATE.player.y);
                const bldY = checkBuildingCollision(STATE.player.x, nextY);

                // --- NEW: MONSTER WALL COLLISION CHECK ---
                const monX = checkEnemyWall(nextX, STATE.player.y);
                const monY = checkEnemyWall(STATE.player.x, nextY);

                if (!wallX && !npcX && !objX && !bldX && !monX) STATE.player.x = nextX;
                if (!wallY && !npcY && !objY && !bldY && !monY) STATE.player.y = nextY;

                // PERBAIKAN: Update Direction untuk 4 Arah (Atas/Bawah/Kiri/Kanan)
                // Sebelumnya hanya Kiri/Kanan, sehingga interaksi Atas/Bawah sering gagal
                if (dx !== 0 || dy !== 0) {
                    if (Math.abs(dx) >= Math.abs(dy)) {
                        STATE.player.direction = dx > 0 ? 'right' : 'left';
                    } else {
                        STATE.player.direction = dy > 0 ? 'down' : 'up';
                    }
                }

                const hitObj = objX || objY;
                if (hitObj && Date.now() - lastCollisionTime > 1500) {
                    lastCollisionTime = Date.now();
                    if (hitObj.type === 'sign') {
                        showToast("📍 " + hitObj.text);
                    } else if (hitObj.type === 'fishing_spot') {
                        showToast("🐟 Area Memancing (Tekan Tombol Aksi)");
                    } else if (hitObj.type === 'counter') {
                        showToast("Meja Kasir. Bicara pada Bos untuk kerja.");
                    }
                }

                STATE.camera.x = STATE.player.x - GAME_WIDTH / 2 + STATE.player.w / 2;
                STATE.camera.y = STATE.player.y - GAME_HEIGHT / 2 + STATE.player.h / 2;

                const curMap = maps[STATE.location];
                const _mapTileSize = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;
                STATE.camera.x = Math.max(0, Math.min(STATE.camera.x, curMap.w * _mapTileSize - GAME_WIDTH));
                STATE.camera.y = Math.max(0, Math.min(STATE.camera.y, curMap.h * _mapTileSize - GAME_HEIGHT));

                curMap.npcs.forEach(npc => {
                    // FIX: fairyVillage NPC dikelola sepenuhnya oleh fvNpcRuntime di drawFairyWorld, skip di sini
                    if (STATE.location === 'fairyVillage') return;

                    const distToPlayer = Math.hypot(STATE.player.x - npc.x * TILE_SIZE, STATE.player.y - npc.y * TILE_SIZE);

                    // --- NEW: EFEK NYANYIAN (BUBBLE NADA) UNTUK DUYUNG, SENIMAN & PENYANYI ---
                    // UPDATE: Ditambahkan 'penyanyi'
                    if ((npc.id === 'putriduyung' || npc.id === 'seniman' || npc.id === 'penyanyi') && isNPCActive(npc)) {
                        // Peluang spawn nada setiap frame (biar tidak terlalu spam)
                        if (Math.random() < 0.05) {
                            let pColor = '#38bdf8'; // Default Biru (Duyung)
                            if (npc.id === 'seniman') pColor = '#fbbf24'; // Emas (Gitar)
                            else if (npc.id === 'penyanyi') pColor = '#e879f9'; // Pink/Ungu (Penyanyi)

                            STATE.particles.push({
                                x: (npc.x * TILE_SIZE) + 15 + (Math.random() * 20 - 10), // Random offset X
                                y: (npc.y * TILE_SIZE) - 10,
                                vx: (Math.random() - 0.5) * 0.5, // Goyang kiri kanan pelan
                                vy: -0.5 - Math.random(), // Naik ke atas
                                life: 80, // Durasi hidup
                                color: pColor,
                                type: 'note', // Tipe khusus untuk render ikon
                                icon: ['🎵', '🎶', '✨', '🎤'][Math.floor(Math.random() * 4)],
                                size: 10 + Math.random() * 5
                            });
                        }
                    }

                    // --- FIX: KEMBALIKAN EFEK NGOBROL AISYAH & MARIA (BERGANTIAN) ---
                    // Logika: Mereka akan spawning bubble "..." bergantian setiap 3 detik
                    if ((npc.id === 'cewek_islam' || npc.id === 'cewek_kristen') && isNPCActive(npc)) {
                        const turnDuration = 3000; // 3 detik per giliran
                        const now = Date.now();
                        const isAisyahTurn = (Math.floor(now / turnDuration) % 2 === 0);

                        // Cek giliran siapa sekarang
                        const myTurn = (npc.id === 'cewek_islam' && isAisyahTurn) || (npc.id === 'cewek_kristen' && !isAisyahTurn);

                        // Spawn bubble jika giliran saya (Peluang 3% per frame agar tidak terlalu rapat)
                        if (myTurn && Math.random() < 0.03) {
                            STATE.particles.push({
                                x: (npc.x * TILE_SIZE) + 20, // Posisi tengah atas kepala
                                y: (npc.y * TILE_SIZE) - 10,
                                vx: 0,
                                vy: -0.2, // Naik pelan
                                life: 70, // Durasi tampil (sekitar 1.2 detik)
                                type: 'chat_bubble',
                                icon: '...'
                            });
                        }
                    }

                    if (npc.type === 'wander' || npc.type === 'animal' || npc.type === 'swimmer') {
                        if (distToPlayer < 60 && npc.type !== 'swimmer') { // Swimmer cuek, gak berhenti kalau didekati (kecuali diajak ngobrol)
                            if (npc.type === 'animal') {
                                if (npc.cooldown <= 0 && distToPlayer < 40) {
                                    npc.cooldown = 120;
                                    npc.loveTimer = 60;

                                    if (AudioService.enabled && AudioService.tracks[npc.sound]) {
                                        AudioService.tracks[npc.sound].currentTime = 0;
                                        AudioService.tracks[npc.sound].play().catch(() => { });
                                    }

                                    createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#ff69b4');
                                }
                            }

                        } else {
                            if (Math.random() < 0.02) {
                                npc.vx = (Math.random() - 0.5) * 2;
                                npc.vy = (Math.random() - 0.5) * 2;
                            }

                            // Khusus Swimmer gerakannya lebih konsisten (berenang)
                            if (npc.type === 'swimmer') {
                                // Random turn sesekali
                                if (Math.random() < 0.01) {
                                    npc.vx = (Math.random() - 0.5) * 1.5;
                                    npc.vy = (Math.random() - 0.5) * 1.5;
                                }

                                // NEW: EFEK CIPRATAN AIR SAAT BERGERAK
                                if (Math.abs(npc.vx) > 0.1 || Math.abs(npc.vy) > 0.1) {
                                    // 30% Chance spawn partikel per frame
                                    if (Math.random() < 0.3) {
                                        STATE.particles.push({
                                            x: (npc.x * TILE_SIZE) + 15 + (Math.random() * 14 - 7), // Sekitar badan
                                            y: (npc.y * TILE_SIZE) + 40, // Di permukaan air (kaki)
                                            vx: (Math.random() - 0.5) * 2, // Menyebar ke samping
                                            vy: -1.5 - Math.random(), // Melompat ke atas
                                            life: 25, // Durasi
                                            color: '#e0f2fe', // Putih kebiruan (buih air)
                                            type: 'splash',
                                            size: 2 + Math.random() * 3
                                        });
                                    }
                                }
                            }

                            let nx = (npc.x * TILE_SIZE) + (npc.vx || 0);
                            let ny = (npc.y * TILE_SIZE) + (npc.vy || 0);

                            // --- FIX: Logic Pengecekan Batas Map & Collision NPC ---

                            if (npc.type === 'swimmer') {
                                // LOGIKA PERENANG: Hanya boleh di Tile 0 (Air)
                                // Cek titik tengah kaki
                                const tX = Math.floor((nx + 15) / TILE_SIZE);
                                const tY = Math.floor((ny + 30) / TILE_SIZE);

                                let canSwim = false;

                                // Pastikan di dalam map
                                if (tX >= 0 && tX < curMap.w && tY >= 0 && tY < curMap.h) {
                                    const tIdx = tY * curMap.w + tX;
                                    const tile = curMap.tiles[tIdx];

                                    // Hanya boleh di air (0)
                                    if (tile === 0) canSwim = true;
                                }

                                if (canSwim) {
                                    npc.x = nx / TILE_SIZE;
                                    npc.y = ny / TILE_SIZE;
                                } else {
                                    // Nabrak darat/batas map, putar balik
                                    npc.vx *= -1;
                                    npc.vy *= -1;
                                }
                            } else {
                                // LOGIKA NPC DARAT (Wander & ANIMAL): JANGAN LEWAT LAUT
                                // FIX: Gunakan ukuran dinamis NPC (w/h) untuk akurasi hitbox
                                const pW = npc.w || 32;
                                const pH = npc.h || 48;
                                const centerX = nx + (pW / 2);
                                const bottomY = ny + pH - 5; // Cek tepat di kaki

                                const tX = Math.floor(centerX / TILE_SIZE);
                                const tY = Math.floor(bottomY / TILE_SIZE);
                                const tIdx = tY * curMap.w + tX;

                                let isWalkable = true;

                                // 1. Cek Batas Map (Penting agar tidak keluar dunia ke area hitam)
                                if (nx < 0 || ny < 0 || nx > (curMap.w * TILE_SIZE) - pW || ny > (curMap.h * TILE_SIZE) - pH) {
                                    isWalkable = false;
                                }
                                // 2. Cek Tile
                                else if (tIdx >= 0 && tIdx < curMap.tiles.length) {
                                    const tile = curMap.tiles[tIdx];

                                    // Cek Laut (Tile 0) -> BLOKIR HEWAN & MANUSIA DARAT
                                    if (tile === 0) {
                                        isWalkable = false;
                                        // FIX SAPI EROR: Izinkan Hewan Masuk Area Dermaga juga
                                        // Hapus syarat '&& npc.type !== 'animal'' agar sapi tidak stuck di perbatasan laut dermaga
                                        if (STATE.location === 'village') {
                                            if (tX >= 43 && tX < 50 && tY >= 34 && tY < 39) {
                                                isWalkable = true;
                                            }
                                        }
                                    }

                                    // Cek Tembok/Pohon (Tile 2, 11, 12)
                                    if (tile === 2 || tile === 11 || tile === 12) {
                                        isWalkable = false;
                                    }
                                } else {
                                    // Index di luar array tiles
                                    isWalkable = false;
                                }

                                if (isWalkable) {
                                    npc.x = nx / TILE_SIZE;
                                    npc.y = ny / TILE_SIZE;
                                } else {
                                    // Nabrak Laut/Tembok -> Putar Balik
                                    npc.vx *= -1;
                                    npc.vy *= -1;

                                    // FIX: SOLUSI ANTI-STUCK SMART (DORONG KE TENGAH)
                                    // Jika NPC menabrak batas laut/tembok, paksa jalan ke arah tengah desa
                                    // Ini mencegah mereka terjebak di pinggiran pantai/dermaga selamanya
                                    if (Math.random() < 0.6) { // Peluang 60% untuk lari ke tengah saat stuck
                                        const centerX = 30 * TILE_SIZE; // Tengah Peta X
                                        const centerY = 20 * TILE_SIZE; // Tengah Peta Y

                                        // Hitung arah ke tengah
                                        const dx = centerX - (npc.x * TILE_SIZE);
                                        const dy = centerY - (npc.y * TILE_SIZE);
                                        const mag = Math.hypot(dx, dy) || 1;

                                        // Beri kecepatan sedikit acak agar natural
                                        const speed = 1 + Math.random();

                                        npc.vx = (dx / mag) * speed;
                                        npc.vy = (dy / mag) * speed;
                                    } else {
                                        // Sisa 40%: Random arah biasa (biar gak semua NPC lari ke tengah barengan)
                                        npc.vx = (Math.random() - 0.5) * 2;
                                        npc.vy = (Math.random() - 0.5) * 2;
                                    }
                                }
                            }
                        }

                        if (npc.cooldown > 0) npc.cooldown--;
                        if (npc.loveTimer > 0) npc.loveTimer--;
                    }
                });

                // --- NEW: AUTO TELEPORT CHECK (Agar tidak perlu klik tombol) ---
                checkAutoTeleport();

                // --- NEW: CEK JAM OPERASIONAL BANGUNAN (KICK OUT SYSTEM) ---
                checkBuildingHours();

                const tx = Math.floor(STATE.player.x / TILE_SIZE);
                const ty = Math.floor(STATE.player.y / TILE_SIZE);
                const tIdx = ty * curMap.w + tx;

                const tile = curMap.tiles[tIdx];

                if (tile === 8 && STATE.location === 'merchant_interior') {
                }
                else if (tile === 8 && STATE.location === 'house') {
                }

                if (STATE.location === 'dungeon' || STATE.location === 'ruins_battle') {
                    // FIX: Jangan update musuh saat dialogue/tutorial sedang terbuka
                    const _dialogueOpen = (function() {
                        const dw = document.getElementById('dialogue-wrapper');
                        if (dw && dw.style.display !== 'none') return true;
                        if (STATE.cutsceneOverride) return true;
                        if (STATE.isPrologue) return true;
                        return false;
                    })();
                    if (!_dialogueOpen) {
                        updateEnemies();
                    }
                }

                if (STATE.fishing.active) {
                    STATE.fishing.barX += 2 * STATE.fishing.barDir;
                    // FIX: Clamping nilai agar tidak stuck (bergetar) di ujung bar
                    if (STATE.fishing.barX >= 100) {
                        STATE.fishing.barX = 100;
                        STATE.fishing.barDir = -1;
                    } else if (STATE.fishing.barX <= 0) {
                        STATE.fishing.barX = 0;
                        STATE.fishing.barDir = 1;
                    }
                    // 🎣 SYNC ke fishing overlay DOM
                    updateFishingOverlayBar();
                }

                if (STATE.player.attackCooldown > 0) STATE.player.attackCooldown--;
                // Removed STATE.player.skillCooldown decrement logic

                // NEW: UPDATE COMBO TIMER
                if (STATE.player.comboWindow > 0) {
                    STATE.player.comboWindow--;
                    if (STATE.player.comboWindow <= 0) {
                        STATE.player.comboCount = 0; // Reset combo jika telat tekan tombol
                    }
                }

                // NEW: UPDATE FLOATING TEXTS
                STATE.floatingTexts.forEach((ft, i) => {
                    ft.y -= 0.5; // Naik ke atas
                    ft.life--;
                    if (ft.life <= 0) STATE.floatingTexts.splice(i, 1);
                });

                // UPDATE HUD VIA FUNCTION NOW
                updateHUDInfo();

                STATE.particles.forEach((p, i) => {
                    p.x += p.vx; p.y += p.vy; p.life--;
                    if (p.life <= 0) STATE.particles.splice(i, 1);
                });

                if (STATE.weather === 'rain' && STATE.location === 'village') {
                    if (Math.random() < 0.005) {
                        STATE.lightningTimer = 15;
                        STATE.shakeTimer = 20;
                        STATE.lightningX = Math.random() * GAME_WIDTH;
                    }
                }

                if (STATE.lightningTimer > 0) STATE.lightningTimer--;
                if (STATE.shakeTimer > 0) STATE.shakeTimer--;

                // NEW: Kurangi cooldown teleport setiap frame
                if (STATE.teleportCooldown > 0) STATE.teleportCooldown--;

                // --- PART-TIME REMINDER: JAM 15:00 ---
                if (STATE.player.partTimeStatus === 'working' && !STATE.player.partTimeShiftStarted) {
                    const ptDayIndex = (STATE.day - 1) % 7;
                    const ptAlreadyWorked = STATE.player.partTimeLastWorkedDay === STATE.day;
                    if (!ptAlreadyWorked && ptDayIndex !== 6) {
                        if (STATE.time >= 1500 && STATE.time < 1502) {
                            const ptJobName = PART_TIME_JOBS[STATE.player.partTimeJob] ? PART_TIME_JOBS[STATE.player.partTimeJob].name : 'Part-Time';
                            showToast(`⏰ Jam 15:00! Waktunya berangkat part-time ke ${ptJobName}. Absen sebelum jam 17:00!`);
                        }
                        if (STATE.time >= 1700 && STATE.time < 1702) {
                            showToast(`⚠️ Jam 17:00 lewat! Kamu terlambat absen part-time hari ini. Gaji tidak masuk.`);
                        }
                    }
                }

                // --- NEW: LOGIKA JADWAL KERJA PASANGAN (ROLE FAMILY) ---
                // Hanya berlaku jika sudah menikah dan role pemain adalah 'family' (Bapak/Ibu RT)
                if (STATE.player.married && STATE.player.role === 'family') {

                    const playerIsWorker = STATE.player.homeRole === 'worker';
                    const p = STATE.player;

                    // 1. PASANGAN / PEMAIN BERANGKAT KERJA JAM 08:00
                    if (STATE.time >= 800 && STATE.time < 810 && p.spouseWorkStatus !== 'working') {
                        p.spouseWorkStatus = 'working';

                        let sImg = 'images/girl.png';
                        const sId = p.spouseId;
                        if (sId === 'lover1girl') sImg = 'images/lover1girl.png';
                        else if (sId === 'lover2girl') sImg = 'images/lover2girl.png';
                        else if (sId === 'lover1boy') sImg = 'images/lover1boy.png';
                        else if (sId === 'lover2boy') sImg = 'images/lover2boy.png';

                        if (playerIsWorker) {
                            // PEMAIN yang bekerja — pasangan tetap di rumah
                            if (STATE.location === 'house') {
                                const sName = SPOUSE_NAMES[sId] || 'Pasangan';
                                showPedagogicalDepartureNotif(sImg, sName);
                            } else {
                                // Player di luar rumah — tampilkan notif pamit yang personal
                                const sNameOut = SPOUSE_NAMES[sId] || 'Pasangan';
                                const conflictLvl = STATE.player.marriageConflictLevel || 0;
                                const pamitMsg = conflictLvl >= 2
                                    ? `"Aku berangkat kerja." — ${sNameOut} mengirim pesan singkat.`
                                    : `💌 ${sNameOut}: "Sayang, aku berangkat kerja dulu ya. Hati-hati di luar! Pulang sebelum jam 16:00 ya ❤️"`;
                                showToast(pamitMsg);
                                // Tampilkan popup kecil di layar dengan gambar pasangan
                                (function showPamitPopup() {
                                    const existing = document.getElementById('pamit-popup-notif');
                                    if (existing) existing.remove();
                                    const div = document.createElement('div');
                                    div.id = 'pamit-popup-notif';
                                    div.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9990;background:rgba(255,253,245,0.97);border:2px solid #a16207;border-radius:14px;padding:10px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 18px rgba(0,0,0,0.25);max-width:320px;width:90%;animation:slideUp 0.3s ease;';
                                    const img = document.createElement('img');
                                    img.src = sImg;
                                    img.style.cssText = 'width:44px;height:44px;object-fit:cover;border-radius:50%;border:2px solid #a16207;flex-shrink:0;';
                                    const txtDiv = document.createElement('div');
                                    txtDiv.style.cssText = 'flex:1;';
                                    const name = document.createElement('div');
                                    name.style.cssText = 'font-family:Fredoka,sans-serif;font-size:13px;font-weight:700;color:#422006;';
                                    name.textContent = sNameOut + ' — Pamit Bekerja';
                                    const msg = document.createElement('div');
                                    msg.style.cssText = 'font-size:11px;color:#78350f;margin-top:2px;line-height:1.4;';
                                    msg.textContent = conflictLvl >= 2 ? '"Aku berangkat." (singkat, tanpa senyum)' : '"Hati-hati ya, sayang! Pulang sebelum jam 16:00 ❤️"';
                                    const closeBtn = document.createElement('button');
                                    closeBtn.textContent = '✕';
                                    closeBtn.style.cssText = 'background:none;border:none;font-size:14px;color:#a16207;cursor:pointer;padding:2px 4px;align-self:flex-start;';
                                    closeBtn.onclick = function() { div.remove(); };
                                    txtDiv.appendChild(name);
                                    txtDiv.appendChild(msg);
                                    div.appendChild(img);
                                    div.appendChild(txtDiv);
                                    div.appendChild(closeBtn);
                                    document.body.appendChild(div);
                                    // Auto-hilang setelah 6 detik
                                    setTimeout(function() { if (div.parentNode) div.remove(); }, 6000);
                                })();
                            }
                        } else {
                            // PASANGAN yang bekerja — hapus dari peta rumah
                            const houseMap = maps['house'];
                            if (houseMap) houseMap.npcs = houseMap.npcs.filter(n => n.id !== p.spouseId);

                            if (STATE.location === 'house') {
                                const sNameDep = SPOUSE_NAMES[sId] || 'Pasangan';
                                const conflictLevel = p.marriageConflictLevel || 0;
                                let depMsg = conflictLevel >= 2
                                    ? '"Aku berangkat." (Singkat, tanpa senyum seperti biasanya)\n\n😔 Ada jarak yang mulai terasa di antara kalian.'
                                    : '"Sayang, aku berangkat kerja dulu ya. Jaga rumah baik-baik. 💼"\n\n"Aku pulang sekitar jam 16:00!"';

                                showDialogue(sNameDep,
                                    depMsg + '\n\n━━━━━━━━━━━━━━━━━━━━\n' +
                                    '📌 KAMU BISA CARI PENGHASILAN TAMBAHAN:\n' +
                                    '🎣 Mancing → Jual ikan ke Merchant\n' +
                                    '⚔️ Dungeon → Jual item drop (hati-hati!)\n' +
                                    '🌙 Part-Time → Bengkel/Jahit/Klinik (15:00–19:00)\n\n' +
                                    '💡 Manfaatkan waktu dengan baik! Kalau kerja part-time, boleh pulang sampai jam 20:00.',
                                    [{
                                        text: 'Hati-hati di jalan!',
                                        action: () => {
                                            closeDialogue();
                                            setTimeout(showDailyHousekeepingMenu, 800);
                                        }
                                    }],
                                    sImg
                                );
                            } else {
                                // Player di luar rumah — pasangan berangkat kerja tanpa bisa diajak bicara
                                const sNameDep2 = SPOUSE_NAMES[sId] || 'Pasangan';
                                const conflictLvl2 = p.marriageConflictLevel || 0;
                                const pamitMsg2 = conflictLvl2 >= 2
                                    ? `😔 ${sNameDep2} sudah berangkat kerja. Kamu tidak sempat melepasnya.`
                                    : `💌 ${sNameDep2}: "Aku berangkat ya sayang, kamu sudah di luar ya? Hati-hati! Aku pulang sekitar jam 16:00 ❤️"`;
                                showToast(pamitMsg2);
                                (function showPamitPopup2() {
                                    const existing2 = document.getElementById('pamit-popup-notif');
                                    if (existing2) existing2.remove();
                                    const div2 = document.createElement('div');
                                    div2.id = 'pamit-popup-notif';
                                    div2.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9990;background:rgba(255,253,245,0.97);border:2px solid #a16207;border-radius:14px;padding:10px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 18px rgba(0,0,0,0.25);max-width:320px;width:90%;';
                                    const img2 = document.createElement('img');
                                    img2.src = sImg;
                                    img2.style.cssText = 'width:44px;height:44px;object-fit:cover;border-radius:50%;border:2px solid #a16207;flex-shrink:0;';
                                    const txtDiv2 = document.createElement('div');
                                    txtDiv2.style.cssText = 'flex:1;';
                                    const name2 = document.createElement('div');
                                    name2.style.cssText = 'font-family:Fredoka,sans-serif;font-size:13px;font-weight:700;color:#422006;';
                                    name2.textContent = sNameDep2 + ' — Berangkat Kerja';
                                    const msg2 = document.createElement('div');
                                    msg2.style.cssText = 'font-size:11px;color:#78350f;margin-top:2px;line-height:1.4;';
                                    msg2.textContent = conflictLvl2 >= 2 ? '(Berangkat tanpa pamit padamu...)' : '"Aku pulang sekitar jam 16:00 ya ❤️"';
                                    const closeBtn2 = document.createElement('button');
                                    closeBtn2.textContent = '✕';
                                    closeBtn2.style.cssText = 'background:none;border:none;font-size:14px;color:#a16207;cursor:pointer;padding:2px 4px;align-self:flex-start;';
                                    closeBtn2.onclick = function() { div2.remove(); };
                                    txtDiv2.appendChild(name2);
                                    txtDiv2.appendChild(msg2);
                                    div2.appendChild(img2);
                                    div2.appendChild(txtDiv2);
                                    div2.appendChild(closeBtn2);
                                    document.body.appendChild(div2);
                                    setTimeout(function() { if (div2.parentNode) div2.remove(); }, 6000);
                                })();
                            }
                        }
                    }

                    // 2. PASANGAN PULANG JAM 16:00 (skenario: pasangan yang kerja)
                    if (!playerIsWorker && STATE.time >= 1600 && STATE.time < 1610 && p.spouseWorkStatus === 'working') {
                        p.spouseWorkStatus = 'home';

                        let sImg = 'images/girl.png';
                        const sId = p.spouseId;
                        const sName = SPOUSE_NAMES[sId] || 'Pasangan';
                        if (sId === 'lover1girl') sImg = 'images/lover1girl.png';
                        else if (sId === 'lover2girl') sImg = 'images/lover2girl.png';
                        else if (sId === 'lover1boy') sImg = 'images/lover1boy.png';
                        else if (sId === 'lover2boy') sImg = 'images/lover2boy.png';

                        regenerateHouseMap();

                        if (STATE.location === 'house') {
                            p.spouseAngry = false;
                            createParticle(p.x, p.y, '#ec4899');
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                            let choresBonusMsg = '';
                            let choresBonusRep = 0;
                            if (p.dailyChores) {
                                if (p.dailyChores.cooking)  { choresBonusMsg += '\nWah, wangi masakan enak! Kamu masak ya? Makasih sayang! 🍲'; choresBonusRep += 2; }
                                if (p.dailyChores.cleaning) { choresBonusMsg += '\nRumah juga bersih banget. Kamu rajin sekali! ✨'; choresBonusRep += 2; }
                                if (p.dailyChores.laundry)  { choresBonusMsg += '\nBaju-bajuku sudah dicuci! Terima kasih ya sayang~ 👔'; choresBonusRep += 1; }
                                if (p.dailyChores.garden)   { choresBonusMsg += '\nTanaman di kebun juga sudah disiram, bagus banget! 🌱'; choresBonusRep += 1; }
                                p.dailyChores = {};
                            }

                            showDialogue(sName,
                                'Aku pulang! 🏠\nSenang sekali melihatmu sudah di rumah menyambutku.' + choresBonusMsg + '\n\n(Hubungan Makin Harmonis ❤️)',
                                [{ text: 'Selamat datang kembali!', action: closeDialogue }],
                                sImg
                            );
                            p.reputation += (2 + choresBonusRep);
                            updateRelationship({ id: sId }, 2 + choresBonusRep, 'Disiplin & Rajin');

                        } else {
                            // Pemain tidak di rumah saat pasangan pulang → marah
                            p.spouseAngry = true;
                            showToast('⚠️ GAWAT! Pasangan pulang jam 16:00 tapi kamu tidak di rumah!');
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                            p.reputation = Math.max(0, p.reputation - 5);
                            updateRelationship({ id: sId }, -5, 'Tidak Ada di Rumah');
                        }
                    }

                    // 3. PEMAIN PULANG KERJA (skenario: pemain yang kerja di luar)
                    //    Batas normal: jam 16:00. Toleransi part-time: jam 20:00.
                    if (playerIsWorker && p.spouseWorkStatus === 'working') {
                        const hasPartTime = p.partTimeStatus === 'working';

                        // Jam 16:00 — mulai ingatkan jika belum di rumah
                        if (STATE.time >= 1600 && STATE.time < 1610 && STATE.location !== 'house') {
                            if (!hasPartTime) {
                                showToast('⏰ Sudah jam 16:00! Pasanganmu menunggu di rumah. Segera pulang!');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                            } else {
                                showToast('⏰ Jam 16:00 — kamu kerja part-time, boleh pulang sampai jam 20:00 ya!');
                            }
                        }

                        // Batas NORMAL jam 16:00 (tanpa part-time)
                        if (!hasPartTime && STATE.time >= 1600 && STATE.time < 1610) {
                            p.spouseWorkStatus = 'home';
                            const sId2 = p.spouseId;
                            let sImg2 = 'images/girl.png';
                            if (sId2 === 'lover1girl') sImg2 = 'images/lover1girl.png';
                            else if (sId2 === 'lover2girl') sImg2 = 'images/lover2girl.png';
                            else if (sId2 === 'lover1boy') sImg2 = 'images/lover1boy.png';
                            else if (sId2 === 'lover2boy') sImg2 = 'images/lover2boy.png';

                            if (STATE.location === 'house') {
                                p.spouseAngry = false;
                                createParticle(p.x, p.y, '#ec4899');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                const spouseName2 = SPOUSE_NAMES[sId2] || 'Pasangan';
                                showDialogue(spouseName2,
                                    'Akhirnya pulang juga! ❤️\nAku sudah tunggu dari tadi sambil masak kesukaanmu.\n\nSyukurlah kamu tepat waktu. Ayo makan malam bareng! 🍽️\n\n(Hubungan Makin Harmonis ❤️)',
                                    [{ text: 'Makasih sayang, masakan kamu pasti enak!', action: closeDialogue }],
                                    sImg2
                                );
                                p.reputation += 3;
                                updateRelationship({ id: sId2 }, 3, 'Pulang Tepat Waktu');
                            } else {
                                // Belum pulang jam 16:00, tanpa part-time
                                p.spouseAngry = true;
                                showToast('⚠️ Sudah jam 16:00! Pasanganmu menunggu di rumah dan mulai khawatir!');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                                p.reputation = Math.max(0, p.reputation - 3);
                                updateRelationship({ id: sId2 }, -3, 'Terlambat Pulang');
                            }
                        }

                        // Batas TOLERANSI part-time: jam 20:00
                        if (hasPartTime && STATE.time >= 2000 && STATE.time < 2010) {
                            p.spouseWorkStatus = 'home';
                            const sId3 = p.spouseId;
                            let sImg3 = 'images/girl.png';
                            if (sId3 === 'lover1girl') sImg3 = 'images/lover1girl.png';
                            else if (sId3 === 'lover2girl') sImg3 = 'images/lover2girl.png';
                            else if (sId3 === 'lover1boy') sImg3 = 'images/lover1boy.png';
                            else if (sId3 === 'lover2boy') sImg3 = 'images/lover2boy.png';
                            const spouseName3 = SPOUSE_NAMES[sId3] || 'Pasangan';

                            if (STATE.location === 'house') {
                                p.spouseAngry = false;
                                createParticle(p.x, p.y, '#ec4899');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                showDialogue(spouseName3,
                                    'Kamu baru pulang ya... sudah malam! 😅\nTapi aku mengerti, kamu kerja part-time tadi kan?\n\nMakasih sudah kerja keras! Ini ada makan malam untukmu. 🍽️\n\n(Hubungan Tetap Harmonis ❤️)',
                                    [{ text: 'Makasih sudah nunggu sayang!', action: closeDialogue }],
                                    sImg3
                                );
                                p.reputation += 2;
                                updateRelationship({ id: sId3 }, 2, 'Pulang dari Part-Time');
                            } else {
                                // Masih belum pulang jam 20:00 meskipun part-time
                                p.spouseAngry = true;
                                showToast('😡 Sudah jam 20:00! Pasanganmu SANGAT marah — bahkan toleransi part-time sudah habis!');
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                                p.reputation = Math.max(0, p.reputation - 8);
                                updateRelationship({ id: sId3 }, -10, 'Pulang Sangat Terlambat');
                                p.marriageConflictLevel = Math.min(3, (p.marriageConflictLevel || 0) + 1);
                            }
                        }
                    }
                }

                // --- NEW: UPDATE PERGERAKAN BOT HANTU (AGAR TERLIHAT HIDUP) ---
                if (STATE.ghosts) {
                    STATE.ghosts.forEach(g => {
                        // Hanya gerakkan jika dia adalah Bot dan berada di map yang sama
                        if (g.isBot && g.location === STATE.location) {
                            // Randomly change direction (Wander Behavior)
                            if (Math.random() < 0.02) { // 2% chance per frame
                                g.vx = (Math.random() - 0.5) * 2; // Kecepatan random
                                g.vy = (Math.random() - 0.5) * 2;
                            }

                            // Update Posisi
                            g.x = (g.x || 0) + (g.vx || 0);
                            g.y = (g.y || 0) + (g.vy || 0);

                            // Batas Map Sederhana (Agar tidak lari ke laut/luar layar)
                            // Asumsi batas aman desa (Area tengah)
                            const minX = 5 * TILE_SIZE;
                            const maxX = 55 * TILE_SIZE;
                            const minY = 5 * TILE_SIZE;
                            const maxY = 35 * TILE_SIZE;

                            if (g.x < minX || g.x > maxX) g.vx *= -1; // Pantul tembok
                            if (g.y < minY || g.y > maxY) g.vy *= -1;
                        }
                    });
                }
            }

            // --- NEW FUNCTION: MENU HARIAN IRT (HOUSEKEEPING) ---
            // ================================================================
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
            // 💼 SISTEM KONFLIK WIRAUSAHA — ROLE ENTREPRENEUR
            // Konflik bisnis nyata: rugi, pesaing, supplier, karyawan, tipu
            // ══════════════════════════════════════════════════════════════

            const ENTREPRENEUR_CONFLICTS = [
                {
                    id: 'ec_supplier',
                    title: '📦 Supplier Tiba-tiba Naik Harga',
                    text: 'Pak Salim, supplier bahan bakumu, mengirim pesan:\n\n"Maaf Bos, harga bahan naik 40% mulai minggu depan. Situasi global. Kalau tidak setuju, terpaksa saya cari pembeli lain."\n\nMarginmu langsung terancam!',
                    img: 'images/merchant.png',
                    reqDay: 3,
                    options: [
                        {
                            text: '🤝 Negosiasi: tawarkan pembayaran lebih cepat demi harga stabil',
                            req: { stat: 'biz', val: 15 },
                            outcome: 'good',
                            biz: +2, money: 0, rep: +3,
                            msg: 'Pak Salim setuju: kamu bayar di muka tiap 2 minggu, harga naik hanya 15% bukan 40%.\n\n📚 PELAJARAN: Negosiasi win-win dengan supplier menjaga rantai bisnis tetap berjalan. Cash flow yang lancar adalah daya tawar terbaik.',
                        },
                        {
                            text: '🔍 Cari supplier alternatif secara paralel',
                            outcome: 'neutral',
                            biz: +1, money: -1000, rep: 0,
                            msg: 'Kamu menemukan supplier baru dengan harga lebih murah, tapi kualitasnya sedikit di bawah. Pelanggan lama mulai berkomentar.\n\n📚 PELAJARAN: Diversifikasi supplier adalah strategi cerdas, tapi kualitas produk tidak boleh dikompromikan demi biaya.',
                        },
                        {
                            text: '😤 Tolak mentah-mentah dan jalan terus tanpa bahan baku',
                            outcome: 'bad',
                            biz: -2, money: -3000, rep: -5,
                            msg: 'Stok barangmu kosong selama seminggu. Pelanggan kecewa dan beberapa pindah ke kompetitor. Kamu rugi besar.\n\n📚 PELAJARAN: Hubungan dengan supplier adalah aset strategis bisnis. Memutus relasi tanpa alternatif = bunuh diri bisnis.',
                        }
                    ]
                },
                {
                    id: 'ec_kompetitor',
                    title: '⚔️ Kompetitor Baru Buka Toko Sebelah',
                    text: 'Sebuah toko baru buka persis di sebelahmu. Pemiliknya, Bos Eko, menjual produk serupa dengan harga 20% lebih murah dan dekorasi lebih menarik.\n\nPelangganmu mulai melirik ke sana.',
                    img: 'images/merchant.png',
                    reqDay: 3,
                    options: [
                        {
                            text: '🎯 Diferensiasi: tambah layanan atau produk unik yang tidak ada di sana',
                            req: { stat: 'biz', val: 18 },
                            outcome: 'good',
                            biz: +3, money: -1000, rep: +5,
                            msg: 'Kamu tambah layanan antar + custom order. Pelangganmu yang loyal malah merekomendasikan ke teman-temannya!\n\n📚 PELAJARAN: Bisnis sehat bukan soal harga termurah — tapi nilai tambah unik yang tidak mudah ditiru kompetitor.',
                        },
                        {
                            text: '🤝 Ajak kolaborasi: saling referral produk yang berbeda',
                            req: { stat: 'reputation', val: 20 },
                            outcome: 'good',
                            biz: +2, money: 500, rep: +8,
                            msg: 'Bos Eko ternyata mau diajak kerja sama! Kalian bagi segmen pasar dan saling referral. Keduanya untung.\n\n📚 PELAJARAN: Kompetitor tidak selalu harus jadi musuh. Kolaborasi yang tepat bisa menciptakan pasar yang lebih besar untuk semua.',
                        },
                        {
                            text: '💸 Turunkan harga lebih rendah untuk memenangkan perang harga',
                            outcome: 'bad',
                            biz: -1, money: -2000, rep: -2,
                            msg: 'Perang harga berlangsung 2 minggu. Keduanya sama-sama merugi. Eko justru kuat bertahan karena modalnya lebih besar.\n\n📚 PELAJARAN: Perang harga (race to the bottom) selalu merugikan yang memulai duluan. Modal lebih besar selalu menang di perang ini.',
                        }
                    ]
                },
                {
                    id: 'ec_karyawan',
                    title: '👨‍💼 Karyawan Kepercayaan Minta Naik Gaji',
                    text: 'Budi, karyawanmu yang paling produktif, datang serius:\n\n"Bos, aku sudah 6 bulan kerja di sini. Penghasilanku tidak cukup lagi. Ada tawaran dari tempat lain yang kasih 30% lebih tinggi. Tapi aku prefer di sini kalau ada solusi."\n\nMenurutmu Budi memang layak, tapi keuanganmu juga sedang ketat.',
                    img: 'images/merchant.png',
                    reqDay: 3,
                    options: [
                        {
                            text: '💰 Naikkan gaji dan tambah bonus performa',
                            req: { stat: 'biz', val: 12 },
                            outcome: 'good',
                            biz: +2, money: -2000, rep: +8,
                            msg: 'Budi sangat senang dan justru merekrut temannya yang juga skilled. Produktivitas timmu naik 40%!\n\n📚 PELAJARAN: Karyawan yang puas bekerja 4x lebih produktif. Kehilangan talent mahal biayanya jauh lebih dari kenaikan gaji.',
                        },
                        {
                            text: '📊 Tawarkan profit sharing daripada kenaikan gaji tetap',
                            req: { stat: 'biz', val: 20 },
                            outcome: 'good',
                            biz: +3, money: 0, rep: +6,
                            msg: 'Budi setuju! Dengan profit sharing, dia justru bekerja lebih keras karena merasa jadi bagian dari bisnis.\n\n📚 PELAJARAN: Profit sharing adalah model kompensasi inovatif yang mengubah karyawan menjadi mitra bisnis yang termotivasi.',
                        },
                        {
                            text: '😤 Bilang: "Tidak ada uangnya, kalau tidak mau ya cari yang lain"',
                            outcome: 'bad',
                            biz: -3, money: 0, rep: -5,
                            msg: 'Budi pergi ke kompetitor. Sebulan kemudian, 2 pelanggan setia ikut pindah karena suka dilayani Budi. Kamu kehilangan lebih banyak dari yang dihemat.\n\n📚 PELAJARAN: "Talent retention" adalah tantangan bisnis terbesar. Kehilangan karyawan kunci bisa menghancurkan hubungan pelanggan.',
                        }
                    ]
                },
                {
                    id: 'ec_hutang',
                    title: '💸 Pelanggan Besar Tidak Mau Bayar',
                    text: 'Pak Herman, pelanggan terbesar yang order senilai 15.000G, sudah menghilang selama 3 minggu. Pesannya tidak dibalas. Barang sudah diterima tapi uang belum masuk.\n\nKamu mulai meragukan itikad baiknya.',
                    img: 'images/merchant.png',
                    reqDay: 3,
                    options: [
                        {
                            text: '📋 Kirim surat tagihan resmi dengan deadline dan konsekuensi hukum',
                            req: { stat: 'biz', val: 15 },
                            outcome: 'good',
                            biz: +2, money: 12000, rep: +3,
                            msg: 'Surat resmi membuat Pak Herman membayar 80% dari tagihan + minta cicil sisanya. Kamu dapat pelajaran berharga soal kontrak.\n\n📚 PELAJARAN: Piutang macet adalah pembunuh arus kas bisnis. Selalu buat perjanjian tertulis dan term pembayaran sebelum kirim barang.',
                        },
                        {
                            text: '🤝 Kunjungi langsung dan cari solusi win-win',
                            outcome: 'neutral',
                            biz: +1, money: 8000, rep: 0,
                            msg: 'Ternyata bisnis Pak Herman juga sedang krisis. Kamu setuju cicil 3 bulan. Dapat sebagian uang, tapi lebih lama.\n\n📚 PELAJARAN: Empati dalam bisnis tetap perlu batas. Cicilan yang disepakati lebih baik daripada piutang yang tidak pasti.',
                        },
                        {
                            text: '😤 Sebar nama buruknya ke semua grup pedagang',
                            outcome: 'bad',
                            biz: -2, money: 0, rep: -10,
                            msg: 'Pak Herman malah balik memfitnahmu di media sosial. Reputasimu ikut tercoreng. Beberapa pelanggan ragu berbisnis denganmu.\n\n📚 PELAJARAN: Penyelesaian sengketa bisnis di luar jalur hukum/resmi seringkali lebih merugikan. Citra bisnis sangat mudah rusak di era digital.',
                        }
                    ]
                },
                {
                    id: 'ec_produk_gagal',
                    title: '📉 Produk Baru Gagal di Pasaran',
                    text: 'Kamu investasikan 10.000G untuk produk baru yang kamu yakin akan laris. Tapi setelah 2 minggu, hampir tidak ada yang beli.\n\nStok menumpuk dan modal terkunci.',
                    img: 'images/merchant.png',
                    reqDay: 3,
                    options: [
                        {
                            text: '🔍 Lakukan riset langsung: tanya pelanggan kenapa tidak beli',
                            req: { stat: 'biz', val: 10 },
                            outcome: 'good',
                            biz: +3, money: 5000, rep: +3,
                            msg: 'Ternyata harganya terlalu mahal dan packagingnya kurang menarik. Kamu revisi dan produk mulai terjual!\n\n📚 PELAJARAN: Validasi pasar SEBELUM produksi adalah prinsip Lean Startup. Failure cepat dan belajar cepat lebih baik dari gagal lambat.',
                        },
                        {
                            text: '🔥 Jual rugi dengan diskon besar untuk clear stok',
                            outcome: 'neutral',
                            biz: 0, money: -3000, rep: +1,
                            msg: 'Stok habis meski rugi. Kamu belajar bahwa riset pasar harus dilakukan sebelum produksi.\n\n📚 PELAJARAN: Cut loss lebih baik daripada hold produk yang tidak laku. Modal yang terkunci tidak bisa diputar untuk peluang lain.',
                        },
                        {
                            text: '😤 Paksa jual dengan harga sama — "Pasti ada yang mau"',
                            outcome: 'bad',
                            biz: -2, money: -8000, rep: -3,
                            msg: '3 bulan kemudian produk masih menumpuk dan kadaluarsa. Kamu rugi total 8000G dan kehilangan slot berjualan yang bisa diisi produk lain.\n\n📚 PELAJARAN: Sunk cost fallacy — jangan mempertahankan keputusan buruk hanya karena sudah terlanjur investasi. Tahu kapan harus berhenti adalah skill bisnis kritis.',
                        }
                    ]
                },
                {
                    id: 'ec_penipuan',
                    title: '🚨 Hampir Kena Penipuan Bisnis',
                    text: 'Seseorang menghubungi dan menawarkan kerjasama:\n\n"Bos, aku bisa supply barang dengan harga 50% di bawah pasaran. Bayar DP 5000G dulu ya, barang langsung dikirim."\n\nHarganya sangat menggiurkan tapi ada yang terasa ganjil.',
                    img: 'images/merchant.png',
                    reqDay: 2,
                    options: [
                        {
                            text: '🔍 Verifikasi identitas dan minta kunjungi gudangnya dulu',
                            req: { stat: 'biz', val: 12 },
                            outcome: 'good',
                            biz: +2, money: 0, rep: +3,
                            msg: 'Ternyata tidak ada gudang! Ini penipuan. Kamu berhasil lolos dan malah melapor ke pedagang lain agar waspada.\n\n📚 PELAJARAN: Tawaran yang terlalu menggiurkan adalah tanda bahaya (red flag). Due diligence sebelum transfer uang adalah SOP bisnis yang wajib.',
                        },
                        {
                            text: '⏸️ Tunda dulu, cari review dari pedagang lain',
                            outcome: 'neutral',
                            biz: +1, money: 0, rep: +1,
                            msg: 'Dari grup pedagang, kamu tahu orang ini sudah pernah menipu 3 pedagang lain. Kamu berhasil menghindar.\n\n📚 PELAJARAN: Komunitas pedagang adalah sistem informasi paling berharga. Jaringan bisnis bukan hanya soal relasi — tapi juga sistem perlindungan.',
                        },
                        {
                            text: '💸 Langsung transfer DP karena harganya sangat bagus',
                            outcome: 'bad',
                            biz: -3, money: -5000, rep: -5,
                            msg: 'Kamu ditipu! Orang itu langsung menghilang setelah menerima DP. Uang 5000G raib.\n\n📚 PELAJARAN: Di dunia bisnis, greed (keserakahan) adalah celah paling besar yang dimanfaatkan penipu. Selalu verifikasi sebelum transfer.',
                        }
                    ]
                },
                {
                    id: 'ec_pajak',
                    title: '📋 Kewajiban Pajak Bisnis',
                    text: 'Petugas dari kantor pajak datang:\n\n"Usahamu sudah cukup besar. Kamu wajib daftar NPWP dan lapor penghasilan. Kalau tidak, kena denda administratif."\n\nKamu tidak pernah memikirkan soal pajak sebelumnya.',
                    img: 'images/merchant.png',
                    reqDay: 2,
                    options: [
                        {
                            text: '✅ Langsung urus NPWP dan minta bimbingan cara lapor pajak',
                            req: { stat: 'biz', val: 10 },
                            outcome: 'good',
                            biz: +3, money: -500, rep: +5,
                            msg: 'Kamu urus semua sesuai prosedur. Petugas bahkan membantu menghitung penghematan pajak legal yang bisa kamu manfaatkan!\n\n📚 PELAJARAN: Bisnis yang taat pajak lebih dipercaya bank dan investor. Pajak bukan beban — tapi tiket akses ke ekosistem bisnis formal.',
                        },
                        {
                            text: '📚 Minta waktu untuk belajar dulu tentang sistem pajak UMKM',
                            outcome: 'neutral',
                            biz: +1, money: -200, rep: +1,
                            msg: 'Kamu dapat perpanjangan waktu. Kamu mulai belajar pajak UMKM dan menyadari banyak insentif yang tidak kamu manfaatkan.\n\n📚 PELAJARAN: UMKM di Indonesia punya banyak fasilitas pajak khusus yang menguntungkan — tapi hanya untuk yang paham dan taat aturan.',
                        },
                        {
                            text: '🙈 Pura-pura tidak tahu dan hindari petugas',
                            outcome: 'bad',
                            biz: -3, money: -5000, rep: -8,
                            msg: 'Denda pajak 5000G dan nama bisnismu masuk daftar pengawas. Sulit dapat izin usaha dan pinjaman bank ke depannya.\n\n📚 PELAJARAN: Tax evasion (penggelapan pajak) adalah kejahatan — bukan pilihan. Konsekuensinya bisa menutup bisnis secara permanen.',
                        }
                    ]
                }
            ];

            let entrepreneurConflictCooldown = 0;

            function maybeRunEntrepreneurConflict() {
                const p = STATE.player;
                if (entrepreneurConflictCooldown > 0) { entrepreneurConflictCooldown--; return; }

                // Konflik muncul tiap 3-4 hari, probabilitas 55%
                if (Math.random() > 0.55) return;

                const shownIds = p.shownEntrepreneurConflicts || [];
                const unshown = ENTREPRENEUR_CONFLICTS.filter(c => !shownIds.includes(c.id));
                const pool = unshown.length > 0 ? unshown : ENTREPRENEUR_CONFLICTS;
                const conflict = pool[Math.floor(Math.random() * pool.length)];

                p.shownEntrepreneurConflicts = [...(p.shownEntrepreneurConflicts || [])];
                if (!p.shownEntrepreneurConflicts.includes(conflict.id)) {
                    p.shownEntrepreneurConflicts.push(conflict.id);
                }

                entrepreneurConflictCooldown = conflict.reqDay || 3;

                const opts = conflict.options.map(opt => {
                    let label = opt.text;
                    if (opt.req) label += ` [${opt.req.stat.toUpperCase()} ${opt.req.val}+]`;
                    return {
                        text: label,
                        action: () => {
                            let success = true;
                            if (opt.req) {
                                const s = opt.req.stat === 'reputation' ? 'reputation' : opt.req.stat;
                                if ((p[s] || 0) < opt.req.val) success = false;
                            }

                            const outcome = success ? opt.outcome : 'bad';
                            const msg = success ? opt.msg : `Kemampuanmu belum memadai (butuh ${opt.req ? opt.req.stat.toUpperCase() + ' ' + opt.req.val : '?'}). Situasi bisnis memburuk.\n\n📚 Tingkatkan stat bisnismu!`;
                            const bizChange = success ? (opt.biz || 0) : -2;
                            const moneyChange = success ? (opt.money || 0) : -1000;
                            const repChange = success ? (opt.rep || 0) : -3;

                            p.biz = Math.max(0, (p.biz || 0) + bizChange);
                            p.reputation = Math.max(0, (p.reputation || 0) + repChange);
                            if (moneyChange !== 0) {
                                p.money = Math.max(0, p.money + moneyChange);
                                if (moneyChange > 0) showToast(`💰 +${moneyChange.toLocaleString()} G`);
                                else showToast(`💸 ${moneyChange.toLocaleString()} G`);
                            }
                            if (bizChange !== 0) showToast(`${bizChange > 0 ? '📈' : '📉'} BIZ ${bizChange > 0 ? '+' : ''}${bizChange}`);
                            if (outcome === 'good') gainExp(25);
                            else if (outcome === 'neutral') gainExp(10);

                            const icon = outcome === 'good' ? '🎉' : outcome === 'neutral' ? '😐' : '😔';
                            closeDialogue();
                            setTimeout(() => {
                                showDialogue('📊 HASIL KEPUTUSAN BISNIS',
                                    `${icon} ${msg}\n\n📊 BIZ: ${Math.round(p.biz || 0)} | REP: ${Math.round(p.reputation || 0)} | Kas: ${p.money.toLocaleString()} G`,
                                    [{ text: 'Pelajaran berharga!', action: closeDialogue }],
                                    conflict.img
                                );
                            }, 300);
                        }
                    };
                });

                opts.push({ text: '🚪 Abaikan masalah ini (BIZ -2, REP -2)', action: () => {
                    p.biz = Math.max(0, (p.biz || 0) - 2);
                    p.reputation = Math.max(0, (p.reputation || 0) - 2);
                    showToast('😰 Masalah bisnis diabaikan. BIZ -2, REP -2');
                    closeDialogue();
                }});

                showDialogue(`💼 TANTANGAN BISNIS — ${conflict.title}`, conflict.text, opts, conflict.img);
            }

            // SISTEM KONFLIK PERNIKAHAN DINI — REALISTIS & PEDAGOGIS
            // Dipanggil setiap pergantian hari pada pernikahan role 'family'
            // ================================================================
            const SPOUSE_NAMES = {
                lover1girl: 'Ayu', lover2girl: 'Putri',
                lover1boy: 'Dr. Budi', lover2boy: 'Satria',
                lover_matre_girl: 'Siska', lover_matre_boy: 'Rendi'
            };
            const SPOUSE_IMG = {
                lover1girl: 'images/lover1girl.png', lover2girl: 'images/lover2girl.png',
                lover1boy: 'images/lover1boy.png',   lover2boy: 'images/lover2boy.png',
                lover_matre_girl: 'images/lover1girl.png', lover_matre_boy: 'images/lover1boy.png'
            };

            function getMarriageMonth() {
                const p = STATE.player;
                if (!p.marriedDay) return 1;
                return Math.floor((STATE.day - p.marriedDay) / 30) + 1;
            }

            function runMarriageConflictSystem() {
                const p = STATE.player;
                if (!p.married || p.divorced) return;

                const sName = SPOUSE_NAMES[p.spouseId] || 'Pasangan';
                const sImg  = SPOUSE_IMG[p.spouseId]  || 'images/girl.png';
                const month = getMarriageMonth();
                p.marriageMonth = month;

                // --- TAGIHAN BULANAN (setiap 30 hari setelah nikah) ---
                const daysSinceMarried = STATE.day - (p.marriedDay || STATE.day);
                const billDue = Math.floor(daysSinceMarried / 30);
                const lastBillPaid = p.lastMarriageBillDay || 0;

                if (billDue > lastBillPaid && daysSinceMarried > 0) {
                    p.lastMarriageBillDay = billDue;
                    // Tagihan makin besar setiap bulan
                    const baseExpense = 8000 + (month * 2000);
                    const sewa   = 4000 + (month * 500);
                    const makan  = 3000 + (month * 300);
                    const listrik = 1000 + (month * 200);
                    const total  = sewa + makan + listrik;

                    p.monthlyExpenses = (p.monthlyExpenses || 0) + total;

                    if (p.money >= total) {
                        p.money -= total;
                        const conflictReduction = Math.max(0, (p.marriageConflictLevel || 0) - 1);
                        p.marriageConflictLevel = conflictReduction;
                        showDialogue(`TAGIHAN BULAN KE-${month}`, 
                            `📋 Tagihan Bulanan Rumah Tangga:\n\n` +
                            `🏠 Sewa/Cicilan Rumah : ${sewa.toLocaleString()} G\n` +
                            `🍚 Kebutuhan Makan    : ${makan.toLocaleString()} G\n` +
                            `💡 Listrik & Air      : ${listrik.toLocaleString()} G\n` +
                            `────────────────────\n` +
                            `💰 Total Terbayar     : ${total.toLocaleString()} G\n\n` +
                            `✅ Sisa Uang: ${p.money.toLocaleString()} G\n\n` +
                            `${sName} tersenyum. "Alhamdulillah, terima kasih sudah menafkahi ya sayang." ❤️`,
                            [{ text: 'Insya Allah selalu ada', action: closeDialogue }], sImg
                        );
                    } else {
                        // Tidak cukup bayar tagihan — konflik naik
                        p.marriageConflictLevel = Math.min(3, (p.marriageConflictLevel || 0) + 1);
                        const shortage = total - p.money;
                        p.money = 0;
                        showDialogue(`⚠️ TAGIHAN BULAN KE-${month} — TIDAK CUKUP`, 
                            `📋 Tagihan Bulan Ini: ${total.toLocaleString()} G\n` +
                            `💸 Uangmu hanya: ${(p.money + shortage).toLocaleString()} G\n` +
                            `❌ Kurang: ${shortage.toLocaleString()} G\n\n` +
                            `${sName} menekan bibirnya.\n"Sayang... kita mau makan apa hari ini? Listrik juga belum dibayar..."\n\n` +
                            `😰 Tekanan Rumah Tangga meningkat! (Level ${p.marriageConflictLevel}/3)\n\n` +
                            `💡 Ijazah SMA/SMK membatasi pilihan kerjamu. Cari penghasilan tambahan dengan:\n` +
                            `• 🎣 Mancing di tepi sungai/laut\n` +
                            `• ⚔️ Serang Dungeon (jual item drop)\n` +
                            `• 🌙 Kerja Part-Time (15:00–19:00)\n` +
                            `• 🛒 Jual barang di Merchant`,
                            [{ text: 'Aku akan cari jalan keluar...', action: closeDialogue }], sImg
                        );
                    }
                }

                // --- EVENT KONFLIK HARIAN (probabilistik) ---
                const lastConflict = p.lastConflictDay || 0;
                const conflictLevel = p.marriageConflictLevel || 0;
                const dayGap = STATE.day - lastConflict;

                // Probabilitas konflik berdasarkan level
                const conflictChance = [0, 0.08, 0.18, 0.35][conflictLevel] || 0;
                if (dayGap >= 3 && Math.random() < conflictChance) {
                    p.lastConflictDay = STATE.day;
                    triggerMarriageConflictEvent(month, conflictLevel, sName, sImg);
                }

                // --- MOMEN MANIS (bulan 1-2, bila konflik rendah) ---
                if (month <= 2 && conflictLevel === 0 && Math.random() < 0.25) {
                    triggerHoneymoonMoment(month, sName, sImg);
                }
            }

            function triggerHoneymoonMoment(month, sName, sImg) {
                const moments = [
                    {
                        title: '🌅 Pagi Pengantin Baru',
                        text: `Pagi itu ${sName} membuatkan sarapan spesial untukmu.\n\n"Aku masak nasi goreng kesukaanmu ya sayang! Eh tapi jangan biasain dimanjain terus, nanti aku kekenyangan masak hehe 😄"\n\nKamu tertawa. Hidup terasa sederhana tapi hangat.\n\n💡 Inilah bulan madu — nikmati, tapi ingat tanggung jawab di depan semakin besar.`
                    },
                    {
                        title: '🌙 Malam Pertama Berumah Tangga',
                        text: `Malam hari, kalian duduk di depan rumah memandang bintang.\n\n${sName}: "Aku sempat takut menikah muda... tapi selama ada kamu, aku yakin kita bisa."\n\nKamu menggenggam tangannya.\n\n💡 Keberanian itu penting. Tapi ingat — cinta perlu ditopang ekonomi yang stabil.`
                    },
                    {
                        title: '💕 Mimpi Bersama',
                        text: `${sName} menunjukkan sebuah gambar rumah dari majalah bekas.\n\n"Sayang, aku ingin kita punya rumah seperti ini suatu hari nanti. Kecil tapi nyaman."\n\nKamu mengangguk. Hatimu penuh harapan — dan sedikit cemas memikirkan biaya.\n\n💡 Mimpi itu gratis. Mewujudkannya butuh kerja keras dan ijazah yang memadai.`
                    },
                    {
                        title: '🍚 Makan Bersama',
                        text: `Menu makan malam hari ini: nasi, tempe goreng, dan sambal terasi.\n\n${sName}: "Maaf ya, belum bisa masak yang lebih enak. Uang belanjanya pas-pasan..."\n\nKamu tersenyum. "Selagi kita makan bersama, sudah cukup."\n\n💡 Realita pernikahan muda: kebahagiaan itu nyata, tapi tekanan finansial juga nyata.`
                    }
                ];
                const m = moments[Math.floor(Math.random() * moments.length)];
                showDialogue(m.title, m.text, [{ text: 'Aku bersyukur 🙏', action: closeDialogue }], sImg);
            }

            function triggerMarriageConflictEvent(month, level, sName, sImg) {
                const p = STATE.player;

                // Bank konflik per level
                const conflicts = {
                    1: [ // Masalah Kecil
                        {
                            title: '💬 Lelah Setelah Kerja',
                            text: `${sName}: "Sayang, kamu kenapa akhir-akhir ini kelihatan lelah terus?"\n\nKamu: "Aku nyari uang buat kita..."\n\n${sName}: "Aku tau... tapi aku juga butuh kamu ada buat ngobrol. Jangan cuma kerja terus ya."\n\n😔 Keintiman berkurang karena kelelahan fisik.\n\n💡 Bekerja keras penting, tapi komunikasi dengan pasangan juga kunci rumah tangga sehat.`,
                            effect: () => { p.reputation -= 2; }
                        },
                        {
                            title: '🛒 Tagihan Dapur Membengkak',
                            text: `${sName} menunjukkan nota belanja.\n\n"Harga beras naik lagi sayang. Sama cabai. Uang belanja bulan ini kurang ${(1500 + month * 300).toLocaleString()} G..."\n\nKamu mengerutkan dahi. Gaji lulusan SMA memang terbatas.\n\n💡 Fakta: Lulusan SMA rata-rata hanya bisa akses pekerjaan upah minimum. Pendidikan lanjut membuka peluang gaji lebih baik.`,
                            effect: () => { if (p.money >= 1500) p.money -= 1500; else p.marriageConflictLevel = Math.min(3, (p.marriageConflictLevel||0)+1); }
                        },
                        {
                            title: '📱 HP Rusak',
                            text: `HP ${sName} tiba-tiba mati total. Tidak bisa dihidupkan.\n\n"Sayang, HP-ku rusak. Aku tidak bisa komunikasi kalau kamu kerja di luar..."\n\nHarga HP bekas yang layak pakai: 5.000 G.\n\n"Kalau tidak ada uang, pakai HP-mu gantian ya..."\n\n💡 Pengeluaran tak terduga adalah tantangan nyata keluarga muda.`,
                            effect: () => { }
                        }
                    ],
                    2: [ // Masalah Serius
                        {
                            title: '😤 Pertengkaran Pertama',
                            text: `Malam itu, ketegangan akhirnya meledak.\n\n${sName}: "Aku capek sayang! Uang habis, kamu kerja terus tapi tetap kurang. Aku takut..."\n\nKamu: "Aku juga capek! Aku kerja keras buat kita!"\n\nHening panjang. Air mata mengalir pelan.\n\n${sName}: "...Maaf. Aku bukan nyalahin kamu. Aku cuma takut kita tidak bisa bertahan."\n\n😰 Ini pertengkaran pertama. Semua pasangan mengalaminya — tapi cara menyelesaikannya yang menentukan.\n\n💡 Data BKKBN: 64% perceraian dini dipicu masalah finansial. Pertengkaran soal uang adalah sinyal bahaya.`,
                            effect: () => { p.reputation -= 5; updateRelationship({ id: p.spouseId }, -10, "Pertengkaran"); }
                        },
                        {
                            title: '🤒 Pasangan Sakit',
                            text: `${sName} demam tinggi dan tidak bisa bangkit dari tempat tidur.\n\nBiaya berobat ke klinik: 2.000 G minimum.\n\n"Sayang, aku tidak enak badan. Kita ada uang untuk ke dokter?"\n\nKamu menghitung sisa uang di dompet dengan berat hati.\n\n💡 Tanpa jaminan kesehatan (BPJS), satu kali sakit bisa menguras tabungan keluarga muda.`,
                            effect: () => { 
                                if (p.money >= 2000) { p.money -= 2000; showToast('Biaya berobat -2.000 G'); }
                                else { p.marriageConflictLevel = Math.min(3, (p.marriageConflictLevel||0)+1); showToast('Uang tidak cukup untuk berobat...'); }
                            }
                        },
                        {
                            title: '🏠 Pemilik Kos Datang',
                            text: `Ketukan keras di pintu.\n\nPemilik kos: "Hei! Sewa bulan ini belum masuk. Sudah telat 5 hari. Kalau tidak bayar minggu ini, saya minta kalian keluar!"\n\nKamu dan ${sName} saling pandang dengan wajah pucat.\n\nSewa yang harus dibayar sekarang: ${(4000 + month * 500).toLocaleString()} G\n\n😱 Terancam kehilangan tempat tinggal!\n\n💡 Tanpa pekerjaan tetap bergaji layak, tekanan seperti ini terus berulang.`,
                            effect: () => { 
                                if (p.money >= 4000) { p.money -= 4000; }
                                else { p.marriageConflictLevel = Math.min(3, (p.marriageConflictLevel||0)+1); p.reputation -= 10; }
                            }
                        }
                    ],
                    3: [ // Krisis
                        {
                            title: '💔 Ambang Perceraian',
                            text: `${sName} duduk dengan wajah lelah dan mata sembab.\n\n"Sayang... aku mau jujur. Aku sudah berpikir lama."\n\nKamu merasakan hatimu berdegup kencang.\n\n"Kita sudah coba keras. Tapi aku tidak sanggup terus hidup dalam tekanan seperti ini. Uang habis, pertengkaran terus, aku takut untuk masa depan anak kita nanti..."\n\n❗ KRISIS PERNIKAHAN — Keputusan ini bisa mengubah hidupmu selamanya.\n\n💡 Ini bukan akhir jika ada komunikasi, niat, dan perubahan nyata. Tapi ini adalah konsekuensi nyata menikah tanpa kesiapan ekonomi.`,
                            effect: () => { updateRelationship({ id: p.spouseId }, -20, "Krisis Pernikahan"); },
                            options: [
                                { text: '💪 "Aku berjanji akan berubah. Beri aku waktu."', action: () => {
                                    p.marriageConflictLevel = 2;
                                    showToast('Kamu berjanji untuk memperbaiki keadaan...');
                                    closeDialogue();
                                }},
                                { text: '😔 Diam dan menunduk', action: () => {
                                    showToast('Keheningan yang menyakitkan...');
                                    closeDialogue();
                                }}
                            ]
                        },
                        {
                            title: '👶 Kabar Kehamilan di Tengah Krisis',
                            text: `${sName} datang dengan wajah campur aduk — bahagia sekaligus cemas.\n\n"Sayang... aku hamil."\n\nKamu terdiam lama.\n\nBahagia? Iya. Tapi juga sadar — biaya persalinan, susu formula, popok, dokter anak...\n\nTaksiran biaya persalinan normal: 15.000–30.000 G.\nBiaya bulanan bayi: +5.000 G/bulan.\n\n💡 Kehamilan tidak terduga adalah realita nyata pernikahan dini. Banyak keluarga muda terpaksa berutang atau bergantung pada orang tua.`,
                            effect: () => { p.monthlyExpenses = (p.monthlyExpenses||0) + 5000; p.marriageConflictLevel = Math.min(3, (p.marriageConflictLevel||0)+1); },
                            options: [
                                { text: '🙏 "Insya Allah kita bisa. Aku akan kerja lebih keras."', action: () => {
                                    p.str = (p.str||5) + 1;
                                    showToast('Tekadmu menguat. STR +1');
                                    closeDialogue();
                                }},
                                { text: '😰 "Aku tidak siap..."', action: () => {
                                    p.marriageConflictLevel = Math.min(3, (p.marriageConflictLevel||0)+1);
                                    closeDialogue();
                                }}
                            ]
                        }
                    ]
                };

                const pool = conflicts[level] || conflicts[1];
                const event = pool[Math.floor(Math.random() * pool.length)];
                if (event.effect) event.effect();

                const opts = event.options || [{ text: 'Aku memahami...', action: closeDialogue }];
                showDialogue(event.title, event.text, opts, sImg);
            }

            // ================================================================
            // NOTIFIKASI PAMIT KERJA PEDAGOGIS (untuk role family + worker yg married)
            // Muncul saat jam 07:30 — menggantikan dialog standar
            // ================================================================
            function showPedagogicalDepartureNotif(sImg, sName) {
                const p = STATE.player;
                const month = getMarriageMonth();
                const conflictLevel = p.marriageConflictLevel || 0;
                const hasPT = p.partTimeStatus === 'working';
                const ptJobName = hasPT && p.partTimeJob ? (PART_TIME_JOBS[p.partTimeJob]?.name || 'Part-Time') : null;

                // Pesan dari pasangan berbeda tergantung bulan & kondisi
                let spouseMsg = '';
                if (month === 1) {
                    spouseMsg = `Sayang, hati-hati ya di jalan! ❤️\nAku sudah siapkan bekalmu.\n\n`;
                } else if (month === 2 && conflictLevel === 0) {
                    spouseMsg = `Semangat sayang! Aku doakan rezekinya lancar. 🙏\n\n`;
                } else if (conflictLevel >= 2) {
                    spouseMsg = `...(${sName} melepasmu pergi tanpa banyak bicara)\n"Hati-hati."\n\n`;
                } else {
                    spouseMsg = `Jangan lupa makan siang ya! Pulang tepat waktu. ❤️\n\n`;
                }

                // Blok edukasi berdasarkan kondisi keuangan
                let eduBlock = '';
                if (p.money < 3000) {
                    eduBlock = `⚠️ KONDISI KEUANGAN KRITIS!\nUangmu tersisa: ${p.money.toLocaleString()} G\n\n`;
                }

                // Pilihan penghasilan untuk lulusan SMA/SMK
                const opts = [];

                // Opsi 1: Kerja utama (jika worker)
                if (p.role === 'worker' && p.jobStatus === 'employed') {
                    opts.push({ text: '💼 Berangkat Shift Utama (08:00–16:00)', action: () => {
                        closeDialogue();
                        showToast('💼 Semangat bekerja! Absen di Merchant.');
                    }});
                }

                // Opsi 2: Cari uang mancing
                opts.push({ text: '🎣 Mancing Dulu (Jual ikan ke Merchant)', action: () => {
                    closeDialogue();
                    showDialogue('💡 TIPS MANCING', 
                        `Mancing adalah sumber penghasilan tambahan yang bisa dilakukan SEMUA orang, tanpa ijazah apapun.\n\n` +
                        `📍 Lokasi: Tepi sungai di Desa atau tepi pantai\n` +
                        `💰 Ikan dijual ke Merchant atau Pedagang\n` +
                        `⚡ Energi berkurang setiap lempar pancing\n\n` +
                        `💡 Fakta: Lulusan SMA/SMK sering mengandalkan pekerjaan informal seperti ini sambil menunggu kesempatan kerja formal.\n` +
                        `Pendidikan vokasi (SMK) yang relevan bisa membuka akses ke pekerjaan dengan upah lebih tinggi.`,
                        [{ text: 'Pergi Mancing!', action: closeDialogue }], sImg
                    );
                }});

                // Opsi 3: Dungeon
                opts.push({ text: '⚔️ Serang Dungeon (Jual item drop)', action: () => {
                    closeDialogue();
                    showDialogue('💡 TIPS DUNGEON',
                        `Dungeon menghasilkan item berharga yang bisa dijual:\n\n` +
                        `💎 Permata → Dijual ke Guild atau Merchant\n` +
                        `🗡️ Senjata Drop → Bisa dijual atau dipakai\n` +
                        `🏅 AP dari membunuh monster\n\n` +
                        `⚠️ Butuh STR & HP yang cukup! Jangan masuk dungeon dalam kondisi lemah.\n\n` +
                        `💡 Di dunia nyata, mencari penghasilan itu seperti menjelajah dungeon: penuh risiko, tapi ada reward bagi yang berani dan siap.`,
                        [{ text: 'Siap Berangkat!', action: closeDialogue }], sImg
                    );
                }});

                // Opsi 4: Part-Time
                if (hasPT) {
                    opts.push({ text: `🌙 Part-Time ${ptJobName} (15:00–19:00)`, action: () => {
                        closeDialogue();
                        showToast(`⏰ Ingat! Part-Time dimulai jam 15:00. Datang tepat waktu!`);
                    }});
                } else {
                    opts.push({ text: '🌟 Cari Kerja Part-Time (Buka Papan Pengumuman)', action: () => {
                        closeDialogue();
                        showDialogue('💡 KERJA PART-TIME',
                            `Sebagai lulusan SMA/SMK, kerja part-time adalah pilihan realistis untuk menambah penghasilan!\n\n` +
                            `📋 Pilihan Part-Time Tersedia:\n` +
                            `⚒️ Bengkel Besi  → 3.500 G/hari + STR +1\n` +
                            `🧵 Tukang Jahit  → 3.000 G/hari + INT +1\n` +
                            `🩺 Klinik        → 4.000 G/hari + REP +1\n\n` +
                            `⏰ Jam kerja: 15:00 – 19:00\n` +
                            `📍 Daftar lewat Papan Pengumuman atau langsung ke NPC tujuan\n\n` +
                            `💡 Data BPS: 43% tenaga kerja Indonesia bekerja di sektor informal. Ijazah SMA/SMK yang relevan membantu masuk ke sektor formal yang lebih stabil.`,
                            [{ text: 'Mengerti!', action: closeDialogue },
                             { text: '🌟 Lihat Lowongan', action: () => { closeDialogue(); openPartTimeLobby(); }}],
                            sImg
                        );
                    }});
                }

                // Opsi melamar kerja formal
                if (p.jobStatus === 'unemployed' || p.role !== 'worker') {
                    opts.push({ text: '📋 Lamar Kerja Formal (Merchant/Bengkel)', action: () => {
                        closeDialogue();
                        showDialogue('💡 PELUANG KERJA FORMAL LULUSAN SMA/SMK',
                            `Dengan ijazah SMA/SMK, kamu bisa melamar ke:\n\n` +
                            `🏪 Merchant (Pak Hendra) → Jadi Staff Gudang\n` +
                            `   Gaji awal: 5.000 G/hari (Magang)\n` +
                            `   Naik jabatan: Staff → Kepala → Manajer\n\n` +
                            `⚒️ Bengkel (Bang Joko) → Part-Time Dahulu\n\n` +
                            `💡 Realita dunia kerja Indonesia:\n` +
                            `• Lulusan SMA bersaing ketat memperebutkan posisi yang sama\n` +
                            `• Keterampilan vokasi dari SMK memberikan nilai lebih\n` +
                            `• Pengalaman & soft skill (disiplin, komunikasi) sangat dinilai\n\n` +
                            `📌 Temui Pak Hendra di Merchant atau Bang Joko di Bengkel untuk melamar!`,
                            [{ text: 'Siap Melamar!', action: closeDialogue }], sImg
                        );
                    }});
                }

                opts.push({ text: `Pamit ya, ${sName}... ❤️`, action: () => {
                    closeDialogue();
                    showToast('Semangat mencari nafkah! 💪');
                }});

                // Pesan edukasi berbasis kondisi finansial
                const financeWarning = p.money < 5000 
                    ? `\n⚠️ Uang tersisa: ${p.money.toLocaleString()} G — Tagihan bulanan mendekat!\nCari penghasilan tambahan hari ini!`
                    : `\n💰 Uang: ${p.money.toLocaleString()} G — Jaga terus ya!`;

                showDialogue(`PAMIT BEKERJA — ${sName}`,
                    spouseMsg +
                    eduBlock +
                    `━━━━━━━━━━━━━━━━━━━━\n` +
                    `📌 PILIHAN MENCARI NAFKAH\n` +
                    `(Lulusan SMA/SMK — Bulan ke-${month})\n` +
                    `━━━━━━━━━━━━━━━━━━━━` +
                    financeWarning,
                    opts, sImg
                );
            }

