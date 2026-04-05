// ═══════════════════════════════════════════
// AKADEMI.JS — Nusantara Arsa: Rise of Student
// Baris 24537–26200 dari index asli
// ═══════════════════════════════════════════

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

            // ═══════════════════════════════════════════════════════════════
            // MENU AKTIVITAS RUMAH TANGGA — Believable & Kontekstual
            // Dipanggil dari: pagi otomatis, papan 🧹, kasur, meja jurnal
            // ═══════════════════════════════════════════════════════════════
            function showDailyHousekeepingMenu() {
                const p       = STATE.player;
                const pImg    = p.gender === 'boy' ? 'images/boy.png' : 'images/girl.png';
                const chores  = p.dailyChores || {};
                const hl      = p.houseLevel || 1;          // rumah level
                const married = !!(p.married && p.spouseId);
                const spouseOut = p.spouseWorkStatus === 'working';
                const hasFarm = p.farming && Object.values(p.farming).some(c => c && c.type);
                const hasKitchen = hl >= 3;   // dapur baru ada di rumah Lv.3+
                const hasGarden  = hl >= 2;   // halaman kecil mulai Lv.2

                // ── Greeting kontekstual ──
                const done   = [chores.cleaning, chores.cooking, chores.laundry, chores.garden || !hasFarm].filter(Boolean).length;
                const total  = [true, hasKitchen, true, hasFarm].filter(Boolean).length;
                let greeting = spouseOut && married
                    ? `Suami/Istri sudah berangkat kerja.\nApa yang mau dikerjakan sekarang?`
                    : `Ada waktu luang. Mau ngapain?`;
                greeting += `\n\n📋 Progress hari ini: ${done}/${total} selesai\n`;
                greeting += `${chores.cleaning ? '✅' : '⬜'} Bersih-bersih\n`;
                if (hasKitchen) greeting += `${chores.cooking  ? '✅' : '⬜'} Masak\n`;
                else            greeting += `🔒 Masak (butuh dapur — Lv.3)\n`;
                greeting += `${chores.laundry  ? '✅' : '⬜'} Cuci baju\n`;
                if (hasFarm)    greeting += `${chores.garden   ? '✅' : '⬜'} Siram tanaman`;

                const opts = [];

                // ════════════════════════════════════
                //  🧹 BERSIH-BERSIH — selalu tersedia
                // ════════════════════════════════════
                if (!chores.cleaning) {
                    opts.push({
                        text: '🧹 Bersih-bersih Rumah (Energi -25)',
                        action: () => {
                            if (p.energy < 25) {
                                showDialogue('😓 TERLALU LELAH',
                                    'Badanmu terlalu lelah untuk beres-beres sekarang.\n\nIstirahat sebentar atau makan dulu biar pulih.',
                                    [{ text: 'Oke...', action: closeDialogue }], pImg);
                                return;
                            }
                            p.energy -= 25;
                            if (!p.dailyChores) p.dailyChores = {};
                            p.dailyChores.cleaning = true;
                            p.reputation = (p.reputation||0) + 2;
                            p.ethics = Math.min(100, (p.ethics||0) + 1);
                            createParticle(p.x, p.y, '#ffffff');
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            const narasi = [
                                'Lantai disapu sampai bersih, debu dilap, bantal dirapikan.\n\nRumah kinclong! Rasanya puas banget. ✨\n\n📈 REP+2 | Ethics+1',
                                'Semua sudut dibersihkan. Jendela dilap hingga bening.\n\nPasangan pasti senang pulang ke rumah yang rapi. ✨\n\n📈 REP+2 | Ethics+1',
                                'Kamar mandi disikat, lantai dipel sampai ngkilap.\n\nCapek, tapi puas — ini namanya tanggung jawab. ✨\n\n📈 REP+2 | Ethics+1',
                            ];
                            showDialogue('✨ BERES-BERES SELESAI!',
                                narasi[Math.floor(Math.random()*narasi.length)],
                                [{ text: 'Alhamdulillah~', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}],
                                pImg);
                        }
                    });
                } else {
                    opts.push({ text: '✅ Rumah sudah bersih hari ini',
                        action: () => showToast('Rumah sudah rapi! Kerja bagus.') });
                }

                // ════════════════════════════════════════════════════════
                //  🍳 MASAK — hanya jika rumah Lv.3+ (ada dapur)
                //  Jika belum ada dapur → alternatif: beli makanan jadi
                // ════════════════════════════════════════════════════════
                if (hasKitchen) {
                    if (!chores.cooking) {
                        opts.push({
                            text: '🍳 Masak untuk Keluarga (Energi -20)',
                            action: () => {
                                if (p.energy < 20) {
                                    showDialogue('😓 TERLALU LELAH', 'Energi kurang untuk memasak.\n\nMakan camilan dulu atau istirahat sebentar.',
                                        [{ text: 'Oke', action: closeDialogue }], pImg);
                                    return;
                                }
                                // Sub-menu pilihan masakan berdasarkan level rumah & bahan
                                const hasIkan  = (p.inventory?.['ikan_segar'] || 0) > 0;
                                const hasTelor = (p.inventory?.['telor'] || 0) > 0;
                                const subOpts  = [];

                                // Nasi goreng — selalu bisa (bahan dapur standar)
                                subOpts.push({
                                    text: '🍳 Nasi Goreng (bahan dapur standar)',
                                    action: () => {
                                        p.energy -= 20;
                                        if (!p.dailyChores) p.dailyChores = {};
                                        p.dailyChores.cooking = true;
                                        p.reputation = (p.reputation||0) + 2;
                                        p.energy = Math.min(100, p.energy + 8);
                                        if (married && p.spouseId) updateRelationship({ id: p.spouseId }, 2, 'Masak untuk Pasangan');
                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                        showDialogue('🍳 NASI GORENG SIAP!',
                                            'Bumbunya harum, nasinya pulen.\n\nKamu bungkus sebagian untuk pasangan, sisanya makan siang sendiri.\n\n❤️ Pasangan pulang ke rumah yang ada masakan hangat.\n\nREP+2 | Hubungan+2',
                                            [{ text: 'Enak!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                    }
                                });

                                // Telor ceplok — jika ada telor di inventory
                                if (hasTelor) {
                                    subOpts.push({
                                        text: '🍳 Telor Ceplok + Nasi (pakai telor)',
                                        action: () => {
                                            p.energy -= 15;
                                            p.inventory['telor'] = Math.max(0, (p.inventory['telor']||0) - 1);
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true;
                                            p.reputation = (p.reputation||0) + 2;
                                            showDialogue('🍳 TELOR CEPLOK SIAP!',
                                                'Simpel tapi bergizi. Telor ceplok gurih dengan nasi putih hangat.\n\n-1 Telor | REP+2',
                                                [{ text: 'Yum!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                        }
                                    });
                                }

                                // Ikan goreng — jika ada ikan di inventory
                                if (hasIkan) {
                                    subOpts.push({
                                        text: '🐟 Ikan Goreng + Sayur (pakai ikan segar)',
                                        action: () => {
                                            p.energy -= 20;
                                            p.inventory['ikan_segar'] = Math.max(0, (p.inventory['ikan_segar']||0) - 1);
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true;
                                            p.reputation = (p.reputation||0) + 3;
                                            p.energy = Math.min(100, p.energy + 12);
                                            if (married && p.spouseId) updateRelationship({ id: p.spouseId }, 3, 'Masak Ikan Segar');
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                            showDialogue('🐟 IKAN GORENG SIAP!',
                                                'Ikan segar digoreng garing, lalapan timun segar di samping.\n\nMakanan bergizi untuk keluarga sehat! 🌿\n\n-1 Ikan Segar | REP+3 | Hubungan+3',
                                                [{ text: 'Mantap!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                        }
                                    });
                                }

                                // Sayur lodeh — mulai Lv.4
                                if (hl >= 4) {
                                    subOpts.push({
                                        text: '🍲 Sayur Lodeh Spesial (Rumah Lv.4)',
                                        action: () => {
                                            p.energy -= 25;
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true;
                                            p.reputation = (p.reputation||0) + 4;
                                            if (married && p.spouseId) updateRelationship({ id: p.spouseId }, 5, 'Masak Spesial');
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                            showDialogue('🍲 SAYUR LODEH SIAP!',
                                                'Masakan rumahan yang bikin rindu kampung halaman.\n\nSantan gurih, sayur segar, tahu tempe. Sempurna!\n\nREP+4 | Hubungan pasangan +5',
                                                [{ text: 'Lezat sekali!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                        }
                                    });
                                }

                                // Rendang — mulai Lv.5
                                if (hl >= 5) {
                                    subOpts.push({
                                        text: '🥩 Rendang (Rumah Lv.5 — masak 2 jam)',
                                        action: () => {
                                            p.energy -= 35;
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true;
                                            p.reputation = (p.reputation||0) + 6;
                                            p.str = (p.str||0) + 1;
                                            if (married && p.spouseId) updateRelationship({ id: p.spouseId }, 8, 'Rendang Spesial');
                                            showDialogue('🥩 RENDANG SIAP!',
                                                'Rendang daging dengan bumbu rempah yang meresap sempurna.\n\nMasak 2 jam penuh tapi hasilnya luar biasa.\n\nTetangga sampai bisa cium baunya dari luar! 😄\n\nREP+6 | STR+1 | Hubungan+8',
                                                [{ text: 'Ini level sultan!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}], pImg);
                                        }
                                    });
                                }

                                subOpts.push({ text: '← Kembali', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }});
                                showDialogue('🍳 PILIH MASAKAN',
                                    `Dapur siap! Mau masak apa hari ini?\n⚡ Energimu: ${Math.floor(p.energy)}/100\n\n${hasIkan ? '🐟 Ada ikan segar di inventory!' : ''}${hasTelor ? '\n🥚 Ada telor di inventory!' : ''}`,
                                    subOpts, pImg);
                            }
                        });
                    } else {
                        opts.push({ text: '✅ Sudah masak hari ini',
                            action: () => showToast('Masakan sudah siap! Pasangan pasti senang pulang.') });
                    }
                } else {
                    // ── Belum ada dapur → alternatif believable ──
                    opts.push({
                        text: `🍱 Makan Hari Ini (Belum ada dapur — Rumah Lv.${hl})`,
                        action: () => {
                            const hasMakananJadi = (p.inventory?.['nasi_bungkus'] || 0) > 0
                                                || (p.inventory?.['gandum'] || 0) > 0;
                            if (hasMakananJadi) {
                                // Punya makanan di inventory
                                const item = (p.inventory?.['nasi_bungkus']||0) > 0 ? 'nasi_bungkus' : 'gandum';
                                const namaItem = item === 'nasi_bungkus' ? 'Nasi Bungkus' : 'Roti Gandum';
                                showDialogue('🍱 MAKAN DARI STOK',
                                    `Kamu punya ${namaItem} di tas.\n\nMakan dari bungkusan dulu — ini wajar banget untuk rumah sederhana.\n\nKalau mau masak sendiri, nabung buat upgrade rumah ke Lv.3 ya!\n\n⚡ +20 Energi`,
                                    [{
                                        text: `Makan ${namaItem}`,
                                        action: () => {
                                            p.inventory[item] = Math.max(0, (p.inventory[item]||0) - 1);
                                            p.energy = Math.min(100, p.energy + 20);
                                            p.hp = Math.min(p.maxHp||100, (p.hp||100) + 10);
                                            if (!p.dailyChores) p.dailyChores = {};
                                            p.dailyChores.cooking = true; // tandai sudah "makan" hari ini
                                            showToast(`😋 ${namaItem} dimakan. Energi +20, HP +10`);
                                            closeDialogue();
                                        }
                                    },
                                    { text: 'Simpan dulu', action: closeDialogue }],
                                    pImg);
                            } else {
                                showDialogue('🍱 BELUM ADA DAPUR',
                                    `Rumahmu (Lv.${hl}) belum punya dapur, jadi belum bisa masak di rumah.\n\nIni wajar banget untuk awal-awal!\n\nAlternatif makan hari ini:\n🏪 Beli nasi bungkus di Merchant\n🍜 Makan di warung dekat pasar\n🐟 Mancing → makan ikan bakar di luar\n\nMau masak sendiri di rumah?\n→ Upgrade ke Rumah Lv.3 (1.500.000 G)`,
                                    [
                                        { text: '🏪 Pergi ke Merchant', action: () => { closeDialogue(); showToast('Pergi ke Merchant untuk beli makanan...'); }},
                                        { text: '← Kembali', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}
                                    ], pImg);
                            }
                        }
                    });
                }

                // ════════════════════════════════════
                //  👔 CUCI BAJU — selalu tersedia
                // ════════════════════════════════════
                if (!chores.laundry) {
                    opts.push({
                        text: '👔 Cuci & Jemur Baju (Energi -15)',
                        action: () => {
                            if (p.energy < 15) {
                                showToast('Energi kurang untuk cuci baju sekarang...');
                                return;
                            }
                            p.energy -= 15;
                            if (!p.dailyChores) p.dailyChores = {};
                            p.dailyChores.laundry = true;
                            p.reputation = (p.reputation||0) + 1;
                            const narasi = [
                                '👔 Baju dicuci dengan sabun, dibilas bersih, dijemur di bawah matahari.\n\nBau segar! Kehidupan sederhana yang penuh rasa syukur. ☀️\n\nREP+1',
                                '👔 Tumpukan baju kotor akhirnya beres!\n\nDijemur rapi di tali, angin siang bertiup semilir. ☀️\n\nREP+1',
                            ];
                            showDialogue('👔 CUCI BAJU SELESAI',
                                narasi[Math.floor(Math.random()*narasi.length)],
                                [{ text: 'Beres!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}],
                                pImg);
                        }
                    });
                } else {
                    opts.push({ text: '✅ Baju sudah dicuci hari ini',
                        action: () => showToast('Baju sudah bersih dan dijemur!') });
                }

                // ════════════════════════════════════════════════════
                //  🌱 SIRAM TANAMAN — hanya jika punya lahan aktif
                // ════════════════════════════════════════════════════
                if (hasFarm) {
                    const unwatered = Object.values(p.farming).filter(c => c && c.type && !c.watered).length;
                    if (!chores.garden) {
                        const cost = Math.max(10, unwatered * 3);
                        opts.push({
                            text: `🌱 Siram Tanaman (${unwatered} belum disiram, Energi -${cost})`,
                            action: () => {
                                if (unwatered === 0) { showToast('Semua tanaman sudah disiram hari ini!'); return; }
                                if (p.energy < cost) {
                                    showToast(`Energi kurang. Butuh ${cost} untuk siram ${unwatered} tanaman.`);
                                    return;
                                }
                                p.energy -= cost;
                                let count = 0;
                                for (const key in p.farming) {
                                    if (p.farming[key] && p.farming[key].type && !p.farming[key].watered) {
                                        p.farming[key].watered = true;
                                        count++;
                                    }
                                }
                                if (!p.dailyChores) p.dailyChores = {};
                                p.dailyChores.garden = true;
                                showDialogue('🌱 KEBUN SUDAH DISIRAM',
                                    `${count} tanaman berhasil disiram dengan penuh sayang.\n\nTanaman yang terawat = sumber penghasilan tambahan keluarga. 🌿\n\nEnergi -${cost}`,
                                    [{ text: 'Ayo tumbuh subur!', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}],
                                    pImg);
                            }
                        });
                    } else {
                        opts.push({ text: '✅ Tanaman sudah disiram hari ini',
                            action: () => showToast('Kebun sudah terawat. Tinggal tunggu panen!') });
                    }
                }

                // ════════════════════════════════════════════════════
                //  💊 JAGA KESEHATAN KELUARGA — muncul jika menikah
                // ════════════════════════════════════════════════════
                if (married && !chores.health_check) {
                    opts.push({
                        text: '💊 Cek Kebutuhan Keluarga (Obat/Vitamin)',
                        action: () => {
                            const hasObat = (p.inventory?.['obat'] || p.inventory?.['tonic_kebal'] || 0) > 0;
                            if (hasObat) {
                                showDialogue('💊 STOK KESEHATAN',
                                    'Kamu punya obat/vitamin di stok.\n\nBagus! Keluarga siap hadapi hari.\n\n✅ Kesehatan keluarga terjaga.',
                                    [{ text: 'Syukurlah!', action: () => {
                                        if (!p.dailyChores) p.dailyChores = {};
                                        p.dailyChores.health_check = true;
                                        p.ethics = Math.min(100, (p.ethics||0) + 1);
                                        closeDialogue();
                                    }}], pImg);
                            } else {
                                showDialogue('💊 STOK HABIS',
                                    'Obat dan vitamin keluarga habis.\n\nPergi ke Klinik atau Merchant untuk beli sebelum ada yang sakit.\n\n💡 Sediakan selalu: Obat dasar, vitamin, plester.',
                                    [
                                        { text: '🏥 Pergi ke Klinik', action: () => { closeDialogue(); showToast('Pergi ke Klinik...'); }},
                                        { text: 'Nanti saja', action: closeDialogue }
                                    ], pImg);
                            }
                        }
                    });
                }

                // ════════════════════════════════════
                //  🛋️ SANTAI + tawari lanjut
                // ════════════════════════════════════
                opts.push({
                    text: '🛋️ Santai Sejenak (Pulihkan +15 Energi)',
                    action: () => {
                        const gain = Math.min(15, 100 - p.energy);
                        p.energy = Math.min(100, p.energy + gain);
                        const santaiTeks = [
                            `Kamu duduk di kursi favorit sambil menyeduh teh.\n\nSuasana rumah yang tenang terasa seperti hadiah kecil.\n\n⚡ +${gain} Energi`,
                            `Kamu berbaring sebentar di kasur.\n\nMata terpejam, pikiran bersih. Sungguh segar!\n\n⚡ +${gain} Energi`,
                            `Kamu membuka jendela dan menghirup udara pagi.\n\nAngin sepoi masuk, pikiran jadi jernih.\n\n⚡ +${gain} Energi`,
                            `Kamu melamun sambil memandang halaman kecil.\n\nAda kupu-kupu di tanaman. Damai sekali.\n\n⚡ +${gain} Energi`,
                        ];
                        showDialogue('🛋️ ISTIRAHAT SEJENAK',
                            santaiTeks[Math.floor(Math.random()*santaiTeks.length)],
                            [{ text: 'Ah, segar~', action: () => {
                                closeDialogue();
                                // Langsung balik ke menu setelah santai
                                setTimeout(() => showDailyHousekeepingMenu(), 300);
                            }}], pImg);
                    }
                });

                // ════════════════════════════════════
                //  😴 TIDUR SIANG — opsional
                // ════════════════════════════════════
                opts.push({
                    text: '😴 Tidur Siang (Energi +40, waktu +2 jam)',
                    action: () => {
                        showDialogue('😴 TIDUR SIANG?',
                            'Tidur siang memulihkan energi lebih banyak, tapi waktu harian berkurang 2 jam.\n\nYakin mau tidur siang sekarang?',
                            [
                                { text: '😴 Tidur siang sekarang', action: () => {
                                    p.energy = Math.min(100, p.energy + 40);
                                    STATE.time = Math.min(STATE.time + 200, 1550);
                                    showToast('😴 Tidur siang... ⚡ Energi +40. Waktu berlalu 2 jam.');
                                    closeDialogue();
                                }},
                                { text: '← Kembali', action: () => { closeDialogue(); showDailyHousekeepingMenu(); }}
                            ], pImg);
                    }
                });

                opts.push({ text: '🚪 Tutup Menu', action: closeDialogue });

                showDialogue('🏠 AKTIVITAS RUMAH TANGGA', greeting, opts, pImg);
            }

            // --- NEW: UPDATE PERGERAKAN BOT HANTU (AGAR TERLIHAT HIDUP) ---
            // --- NEW FUNCTION: CHECK AUTO TELEPORT ---
            function checkAutoTeleport() {
                // Jika sedang cooldown, jangan cek teleport (Mencegah loop masuk-keluar)
                if (STATE.teleportCooldown > 0) return;

                const map = maps[STATE.location];
                if (!map.buildings) return;

                // Titik tengah pemain
                const pCenterX = STATE.player.x + (STATE.player.w / 2);
                const pCenterY = STATE.player.y + (STATE.player.h / 2);

                // FIX: gunakan TS untuk fairyVillage agar entrance position benar
                const _epTS = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;
                const _epRadius = (STATE.location === 'fairyVillage') ? _epTS * 1.8 : 50;

                for (let b of map.buildings) {
                    // fv_building: tidak auto-teleport, cukup pakai tombol aksi (updateFVActionBtn)
                    if (b.type === 'fv_building') continue;

                    if (b.entrance) {
                        // Titik tengah entrance (Pintu)
                        const eCenterX = (b.entrance.x * _epTS) + (_epTS / 2);
                        const eCenterY = (b.entrance.y * _epTS) + (_epTS / 2);

                        // Jarak pemain ke titik tengah pintu
                        const dist = Math.hypot(pCenterX - eCenterX, pCenterY - eCenterY);

                        if (dist < _epRadius) {

                            // --- PERUBAHAN 2: Daftar Otomatis Hanya untuk KELUAR ---
                            // Saya telah MENGHAPUS bangunan masuk (seperti 'player_house', 'merchant', dll) dari sini.
                            // Jadi saat mau MASUK, fungsi ini tidak akan jalan (tombol aksi akan muncul gantinya).
                            const autoTeleporters = [
                                // HANYA DAFTAR PINTU KELUAR (EXIT)
                                'house_exit', 'pshop_exit',
                                'dungeon_exit', 'dungeon_next', // Next level dungeon tetap auto biar smooth
                                'shop_exit',
                                'library_exit',
                                'guild_exit',
                                'school_exit',
                                'smith_exit',
                                'mentor_exit',
                                'clinic_exit',
                                'wedding_exit',
                                'lover1_exit',
                                'fisherman_exit',
                                'candi_exit',
                                'ruins_exit',
                                'warnet_exit' // <--- TAMBAHKAN INI
                            ];

                            if (autoTeleporters.includes(b.id)) {
                                processTeleport(b);
                                return; // Stop checking agar tidak double trigger
                            }
                        }
                    }
                }
            }

            // --- NEW FUNCTION: CHECK BUILDING HOURS (PENGUSIRAN OTOMATIS) ---
            function checkBuildingHours() {
                // 1. Filter: Hanya jalankan jika Player berada di Indoor (Bukan Village, House, atau Dungeon)
                // List lokasi aman (tidak ada jam tutup):
                if (STATE.location === 'village' || STATE.location === 'house' || STATE.location === 'dungeon' || STATE.location === 'ruins_battle') return;

                const villageMap = maps['village'];
                if (!villageMap) return;

                // 2. Cari data bangunan berdasarkan lokasi map saat ini
                // Contoh: Jika di 'library_interior', cari bangunan yang punya entrance.map == 'library_interior'
                const building = villageMap.buildings.find(b => b.entrance && b.entrance.map === STATE.location);

                if (building) {
                    // Cek apakah bangunan memiliki jam tutup dan tidak buka 24 jam
                    if (!building.open24h && building.openTime && building.closeTime) {

                        // 3. Logika Waktu: Jika Sekarang >= Jam Tutup ATAU Sekarang < Jam Buka (Kasus begadang)
                        if (STATE.time >= building.closeTime || STATE.time < building.openTime) {
                            // ... (Logic pengusiran) ...

                            // Play SFX Pintu/Alert
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('door');

                            // Format Jam untuk Info (Misal: 800 -> "08:00")
                            const openStr = Math.floor(building.openTime / 100).toString().padStart(2, '0') + ":00";
                            const closeStr = Math.floor(building.closeTime / 100).toString().padStart(2, '0') + ":00";

                            // Tampilkan Notifikasi dengan Jam Operasional
                            showToast(`⛔ ${building.name.toUpperCase()} TUTUP! (Buka ${openStr} - ${closeStr}). Kamu diminta keluar.`);

                            // 4. Teleport Paksa ke Luar (Village)
                            STATE.location = 'village';

                            // Koordinat tujuan: Tepat di depan pintu masuk bangunan (Entrance Y + 1)
                            // Agar pemain muncul di depan pintu, bukan di dalamnya
                            STATE.player.x = building.entrance.x * TILE_SIZE;
                            STATE.player.y = (building.entrance.y + 1) * TILE_SIZE;

                            // Pastikan area spawn bersih dari NPC yang menghalangi
                            clearSpawnZone('village', building.entrance.x, building.entrance.y + 1);

                            // Set cooldown teleport agar tidak glitch masuk lagi
                            STATE.teleportCooldown = 60;

                            // --- NEW: EFEK VISUAL KEBINGUNGAN SAAT DIUSIR ---
                            spawnFloatingText(STATE.player.x + 5, STATE.player.y - 40, "❓❓❓", "#fbbf24", 16);
                            spawnFloatingText(STATE.player.x + 20, STATE.player.y - 25, "😵", "#fff", 18);
                        }
                    }
                }
            }

            // --- NEW FUNCTION: PROCESS TELEPORT (Centralized Logic) ---
            function processTeleport(b) {
                // SET COOLDOWN SETELAH TELEPORT SUKSES
                STATE.teleportCooldown = 60;

                // --- NEW: PLAY DOOR SFX ---
                if (typeof AudioService !== 'undefined') AudioService.playSFX('door');

                // 3. Eksekusi Teleportasi (LOGIKA LENGKAP DIKEMBALIKAN)

                // --- RUMAH PLAYER / TOKO PLAYER ---
                if (b.id === 'player_house') {
                    // Cek Role: Jika Entrepreneur, masuk ke Toko Player
                    if (STATE.player.role === 'entrepreneur') {
                        STATE.location = 'player_shop_interior';
                        STATE.player.x = 7 * TILE_SIZE;
                        /* FIX: Geser Y lebih dalam (ke 9) agar jauh dari pintu (11) */
                        STATE.player.y = 9 * TILE_SIZE;
                        showToast("Masuk Toko Sendiri 🏪");
                    } else {
                        // Role lain masuk rumah biasa
                        STATE.location = 'house';
                        const hMap = maps['house'];
                        const doorX = Math.floor(hMap.w / 2);
                        /* FIX: Geser Y lebih dalam (h-3) agar tidak langsung keluar */
                        const doorY = hMap.h - 3;
                        STATE.player.x = doorX * TILE_SIZE;
                        STATE.player.y = doorY * TILE_SIZE;
                        showToast("Masuk Rumah 🏠");
                        if (typeof updateHouseLevelHUD === 'function') updateHouseLevelHUD();
                    }
                }
                else if (b.id === 'house_exit' || b.id === 'pshop_exit') {
                    // ... (Logika keluar rumah tetap sama) ...
                    if (STATE.isPrologue && !STATE.tutorialIndoorComplete) {
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                        showDialogue("TUTORIAL BELUM SELESAI",
                            "⛔ Eitss... Jangan keluar dulu!\n\nSelesaikan langkah-langkah tutorial di dalam rumah agar kamu paham cara bermain.\n\nIkuti petunjuk tangan 👆.",
                            [{ text: "Baiklah", action: closeDialogue }],
                            'images/mentor.png'
                        );
                        return;
                    }

                    STATE.location = 'village';
                    STATE.player.x = 21 * TILE_SIZE;
                    STATE.player.y = 12 * TILE_SIZE;
                    clearSpawnZone('village', 21, 12);
                    showToast("Keluar");

                    // Event Mentor Hari 1
                    if (STATE.day === 1 && STATE.player.role === 'none') {
                        const villMap = maps['village'];
                        const mentor = villMap.npcs.find(n => n.id === 'mentor');
                        if (mentor) {
                            mentor.x = 21; mentor.y = 14; mentor.vx = 0; mentor.vy = 0;
                            setTimeout(() => { STATE.player.direction = 'down'; runTutorial(); }, 600);
                        }
                    }
                }

                // --- MERCHANT ---
                else if (b.id === 'merchant') {
                    STATE.location = 'merchant_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Merchant 💰");
                }
                else if (b.id === 'shop_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 29 * TILE_SIZE;
                    STATE.player.y = 28 * TILE_SIZE;
                    clearSpawnZone('village', 29, 28);
                    showToast("Keluar Merchant");
                }

                // --- KLINIK ---
                else if (b.id === 'clinic') {
                    STATE.location = 'clinic_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Klinik 🏥");
                }
                else if (b.id === 'clinic_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 20 * TILE_SIZE;
                    STATE.player.y = 19 * TILE_SIZE;
                    clearSpawnZone('village', 20, 19);
                    showToast("Keluar Klinik");
                }

                // --- BLACKSMITH ---
                else if (b.id === 'blacksmith') {
                    STATE.location = 'blacksmith_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Bengkel ⚒️");
                }
                else if (b.id === 'smith_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 37 * TILE_SIZE;
                    STATE.player.y = 32 * TILE_SIZE;
                    clearSpawnZone('village', 37, 32);
                    showToast("Keluar Bengkel");
                }

                // --- RUMAH MENTOR ---
                else if (b.id === 'mentor') {
                    STATE.location = 'mentor_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Bertamu ke Rumah Mentor 🏠");
                }
                else if (b.id === 'mentor_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 31 * TILE_SIZE;
                    STATE.player.y = 21 * TILE_SIZE;
                    clearSpawnZone('village', 31, 21);
                    showToast("Keluar Rumah Mentor");
                }

                // --- PERPUSTAKAAN ---
                else if (b.id === 'library') {
                    STATE.location = 'library_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Perpustakaan 📚");
                }
                else if (b.id === 'library_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 41 * TILE_SIZE;
                    STATE.player.y = 24 * TILE_SIZE;
                    clearSpawnZone('village', 41, 24);
                    showToast("Keluar Perpustakaan");
                }

                // --- GUILD PETUALANG ---
                else if (b.id === 'guild') {
                    STATE.location = 'guild_interior';
                    STATE.player.x = 8 * TILE_SIZE;
                    /* FIX: Geser Y ke 11 (Pintu di 13) */
                    STATE.player.y = 11 * TILE_SIZE;
                    showToast("Masuk Guild Petualang ⚔️");
                }
                else if (b.id === 'guild_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 45 * TILE_SIZE;
                    STATE.player.y = 32 * TILE_SIZE;
                    clearSpawnZone('village', 45, 32);
                    showToast("Keluar Guild");
                }

                // --- KAMPUS ---
                else if (b.id === 'school') {
                    // Cek festival — kampus libur saat festival
                    if (isFestivalDayToday()) {
                        const fest = getTodayFestivalData();
                        showDialogue("SATPAM KAMPUS", `${fest ? fest.icon : '🎉'} KAMPUS LIBUR FESTIVAL!\n\n"${fest ? fest.name : 'Festival Desa'} hari ini. Semua perkuliahan diliburkan. Ayo nikmati festival bersama warga!"\n\n${fest ? fest.hint || '' : ''}`, [{ text: `${fest ? fest.icon : '🎉'} Siap Pak!`, action: () => { closeDialogue(); STATE.player.x = 24 * TILE_SIZE; STATE.player.y = 22 * TILE_SIZE; }}]);
                        return;
                    }
                    const dayIndex = (STATE.day - 1) % 7;
                    if (dayIndex === 5 || dayIndex === 6) {
                        showDialogue("SATPAM KAMPUS", "📢 KAMPUS LIBUR! \nHari Sabtu dan Minggu tidak ada perkuliahan.", [{ text: "Baik Pak", action: closeDialogue }]);
                        return;
                    }
                    if (STATE.time > 830 && STATE.time < 1400) {
                        showDialogue("SATPAM KAMPUS", "⛔ STOP! Kamu terlambat! \nKuliah sudah dimulai. Pintu dikunci.", [{ text: "Pulang dengan Malu", action: closeDialogue }]);
                        return;
                    }

                    STATE.location = 'school_interior';
                    STATE.player.x = 8 * TILE_SIZE;
                    /* FIX: Geser Y ke 11 (Pintu di 13) */
                    STATE.player.y = 11 * TILE_SIZE;

                    if (STATE.time >= 1400) showToast("Kampus Sore (Bebas)");
                    else showToast("Masuk Kampus 🎓");
                }
                else if (b.id === 'school_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 41 * TILE_SIZE;
                    STATE.player.y = 16 * TILE_SIZE;
                    clearSpawnZone('village', 41, 16);
                    showToast("Keluar Kampus");
                }

                // --- RUMAH AYU ---
                else if (b.id === 'lover1_home') {
                    STATE.location = 'lover1_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Bertamu ke Rumah Ayu 🌸");
                }
                else if (b.id === 'lover1_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 17 * TILE_SIZE;
                    STATE.player.y = 30 * TILE_SIZE;
                    clearSpawnZone('village', 17, 30);
                    showToast("Keluar Rumah Ayu");
                }

                // --- RUMAH NELAYAN ---
                else if (b.id === 'fisherman_home') {
                    STATE.location = 'fisherman_interior';
                    STATE.player.x = 6 * TILE_SIZE;
                    /* FIX: Geser Y ke 7 (Pintu di 9) */
                    STATE.player.y = 7 * TILE_SIZE;
                    showToast("Bertamu ke Tetangga (Nelayan) ⚓");
                }
                else if (b.id === 'fisherman_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 28 * TILE_SIZE;
                    STATE.player.y = 11 * TILE_SIZE;
                    clearSpawnZone('village', 28, 11);
                    showToast("Keluar Rumah Nelayan");
                }

                // --- CANDI KUNO ---
                else if (b.id === 'candi') {
                    STATE.location = 'candi_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    STATE.player.y = 13 * TILE_SIZE;
                    showToast("Masuk Candi Kuno 🗿");
                }
                else if (b.id === 'candi_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 51 * TILE_SIZE;
                    STATE.player.y = 11 * TILE_SIZE;
                    clearSpawnZone('village', 51, 11);
                    showToast("Keluar Candi");
                }
                else if (b.id === 'portal_sylvaria') {
                    const p = STATE.player;
                    const hasKeris = !!(p.inventory && p.inventory['keris_penjaga']);
                    const hasRafflesia = !!(p.inventory && (p.inventory['bunga_rafflesia'] || p.inventory['bibit_rafflesia'])) || !!p.rafflesiaBloomed;
                    const ethicsOk = (p.ethics || 0) >= 60;
                    if (!hasKeris) {
                        showDialogue("RETAKAN DIMENSI", "Kamu merasakan getaran misterius dari celah kuno ini...\n\n\"Selesaikan semua Kisah Leluhur dan dapatkan Keris Penjaga dari Ki Lamong.\"\n\nSyarat 1/3: Miliki Keris Penjaga Cerita", [{ text: "Baiklah...", action: closeDialogue }], null);
                        return;
                    }
                    if (!hasRafflesia) {
                        showDialogue("RETAKAN DIMENSI", "Keris Penjagamu bergetar lemah... tapi portal belum terbuka penuh.\n\n\"Tanam dan rawat Bunga Rafflesia Arnoldi dari Dewi Roro.\"\n\nSyarat 2/3: Miliki Bibit / Bunga Rafflesia", [{ text: "Aku akan mencarinya...", action: closeDialogue }], null);
                        return;
                    }
                    if (!ethicsOk) {
                        showDialogue("RETAKAN DIMENSI", "Kerismu menyala, Rafflesia memberi sinyal... tapi ada yang menolakmu.\n\nDunia ini hanya terbuka bagi jiwa yang bijak. Temui Dewi Arsa dan perdalam kebijaksanaanmu.\n\nSyarat 3/3: Ethics >= 60 (saat ini: " + (p.ethics || 0) + ")", [{ text: "Aku harus berbenah...", action: closeDialogue }], null);
                        return;
                    }
                    if (!p.sylvariaFirstVisit) {
                        p.sylvariaFirstVisit = true;
                        STATE.screen = 'cutscene';
                        STATE.cutsceneOverride = true;
                        CinematicEngine.play('portalWilis', [
                            {
                                chapter: '— Retakan Dimensi Terbuka —',
                                title: 'Keris Penjaga Bersinar!',
                                sub: 'Rafflesia merekah · Kebijaksanaan membuka segel kuno...',
                                narasi: 'Tiga kekuatan bersatu: pusaka leluhur, bunga langka dari alam, dan jiwa yang bijaksana. Retakan di dinding candi melebar memancarkan cahaya zamrud.',
                                dur: 5000
                            },
                            {
                                chapter: '— Menuju Lereng Gunung Wilis —',
                                title: '🌀 Kahyangan Wilis',
                                sub: 'Dunia Para Widadari — tersembunyi selama berabad-abad',
                                narasi: 'Kamu melangkah menembus retakan. Udara berubah wangi kenanga dan tanah hujan. Di kejauhan, lereng Gunung Wilis tampak bersinar lembut keemasan...',
                                dur: 5500
                            },
                        ], () => {
                            STATE.screen = 'play';
                            STATE.cutsceneOverride = false;
                            STATE.location = 'sylvaria';
                            STATE.player.x = 15 * TILE_SIZE;
                            STATE.player.y = (SYLVARIA_H - 4) * TILE_SIZE;
                            showToast('✨ Memasuki Kahyangan Wilis — Dunia Para Widadari!');
                        });
                    } else {
                        STATE.location = 'sylvaria';
                        STATE.player.x = 15 * TILE_SIZE;
                        STATE.player.y = (SYLVARIA_H - 4) * TILE_SIZE;
                        showToast('✨ Kembali ke Kahyangan Wilis...');
                    }
                }
                else if (b.id === 'sylvaria_exit') {
                    STATE.location = 'candi_interior';
                    STATE.player.x = 8 * TILE_SIZE;
                    STATE.player.y = 3 * TILE_SIZE;
                    showToast("Kembali ke Candi...");
                }

                // --- BALAI PERNIKAHAN ---
                else if (b.id === 'wedding') {
                    STATE.location = 'wedding_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 11 (Pintu di 13) */
                    STATE.player.y = 11 * TILE_SIZE;
                    showToast("Masuk Balai Pernikahan 💍");
                }
                else if (b.id === 'wedding_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 23 * TILE_SIZE;
                    STATE.player.y = 27 * TILE_SIZE;
                    clearSpawnZone('village', 23, 27);
                    showToast("Keluar Balai");
                }

                // --- WARNET (FIX MASALAH UTAMA) ---
                else if (b.id === 'warnet') {
                    STATE.location = 'warnet_interior';
                    STATE.player.x = 7 * TILE_SIZE;
                    /* FIX: Geser Y ke 9 (Pintu di 11) - Maju 2 Langkah agar tidak langsung keluar */
                    STATE.player.y = 9 * TILE_SIZE;
                    showToast("Masuk Warnet 💻");
                }
                else if (b.id === 'warnet_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 10 * TILE_SIZE;
                    STATE.player.y = 20 * TILE_SIZE;
                    clearSpawnZone('village', 10, 20);
                    showToast("Keluar Warnet");
                }

                // --- DUNGEON ---
                else if (b.id === 'dungeon_gate') {
                    STATE.dungeonLevel = 1;
                    STATE.location = 'dungeon';
                    STATE.player.x = TILE_SIZE * 5;
                    STATE.player.y = TILE_SIZE * 5;
                    createParticle(STATE.player.x, STATE.player.y, '#06b6d4');
                    // FIX: Langsung putar dungeon BGM saat masuk (tidak tunggu update() agar tidak terganjal cutscene)
                    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                        AudioService.playBGM('dungeon');
                    }
                    spawnEnemies();

                    if (!STATE.player.hasSeenDungeonTutorial) {
                        STATE.player.hasSeenDungeonTutorial = true;
                        playCutsceneDungeonEnter(() => {
                            showToast(`🌀 MASUK DUNGEON LEVEL ${STATE.dungeonLevel}...`);
                            setTimeout(() => {
                                showTutorialFocus('btn-action');
                                showDialogue("⚔️ DUNGEON",
                                    "Zona berbahaya! Tombol aksi → ⚔️ Serang musuh.\n🔥 Tombol Api = Ultimate (butuh 10 Energi, cooldown 3 detik).\n\nTips: gunakan Ultimate saat dikepung!",
                                    [{
                                        text: "Siap Bertarung! ⚔️",
                                        action: () => {
                                            clearTutorialFocus();
                                            closeDialogue();
                                            manualSave();
                                        }
                                    }],
                                    'images/penjagadungeon.png'
                                );
                            }, 1000);
                        });
                    } else {
                        showToast(`🌀 WARPING TO DUNGEON LEVEL ${STATE.dungeonLevel}...`);
                    }
                }
                else if (b.id === 'dungeon_exit') {
                    STATE.location = 'village';
                    STATE.player.x = 48 * TILE_SIZE;
                    STATE.player.y = 22 * TILE_SIZE;
                    clearSpawnZone('village', 48, 22);
                    showToast("Keluar Dungeon");
                }
                else if (b.id === 'dungeon_next') {
                    STATE.dungeonLevel++;
                    STATE.location = 'dungeon';
                    STATE.player.x = TILE_SIZE * 5;
                    STATE.player.y = TILE_SIZE * 5;
                    manualSave();
                    showToast(`🌀 WARPING TO LEVEL ${STATE.dungeonLevel}...`);
                    spawnEnemies();
                    // FIX: Langsung mainkan dungeon music saat naik level
                    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                        AudioService.playBGM('dungeon');
                    }
                }
            }

            // --- NEW FUNCTION: ANTI-STUCK SPAWN ---
            function clearSpawnZone(mapId, spawnTileX, spawnTileY) {
                const map = maps[mapId];
                if (!map || !map.npcs) return;

                // Radius aman (dalam satuan tile)
                const safeRadius = 3;

                map.npcs.forEach(npc => {
                    // FIX: Jangan pindahkan NPC Static (Diam) atau Service karena posisinya fixed/diatur designer
                    if (npc.type === 'static' || npc.type === 'service') return;

                    // Hitung jarak NPC ke titik spawn pemain
                    const dist = Math.hypot(npc.x - spawnTileX, npc.y - spawnTileY);

                    // Jika NPC berada terlalu dekat dengan titik spawn (< 3 tile)
                    if (dist < safeRadius) {
                        // Pindahkan NPC menjauh secara paksa
                        // Cari arah menjauh
                        const dirX = npc.x < spawnTileX ? -1 : 1;
                        const dirY = npc.y < spawnTileY ? -1 : 1;

                        // Pindahkan 3-4 tile menjauh
                        let newX = npc.x + (dirX * 4);
                        let newY = npc.y + (dirY * 4);

                        // Pastikan tidak melempar NPC ke luar batas map (sederhana)
                        if (newX < 1) newX = 1;
                        if (newX >= map.w - 1) newX = map.w - 2;
                        if (newY < 1) newY = 1;
                        if (newY >= map.h - 1) newY = map.h - 2;

                        // Terapkan posisi baru
                        npc.x = newX;
                        npc.y = newY;

                        // Hentikan pergerakan sesaat agar tidak langsung balik
                        npc.vx = 0;
                        npc.vy = 0;

                        // Log debug (opsional)
                        // console.log(`Menyingkirkan ${npc.name} dari jalur spawn.`);
                    }
                });
            }

            // REMOVED DUPLICATE updateEnemies FUNCTION HERE (Deleted lines to clean up)

            // --- NEW FUNCTION: SPAWN FINAL BOSS (PHASE 2) ---
            function spawnFinalBoss() {
                STATE.bossSpawned = true;

                // Efek Dramatis
                showToast("👹 THE BOSS HAS AWAKENED!");
                createParticle(20 * TILE_SIZE, 15 * TILE_SIZE, '#7f1d1d');
                createParticle(20 * TILE_SIZE, 15 * TILE_SIZE, '#000');

                // Spawn Boss Besar
                STATE.enemies.push({
                    x: 20 * TILE_SIZE,
                    y: 15 * TILE_SIZE,
                    w: 140, h: 140, // UPDATE: Ukuran Hitbox Lebih Besar (100 -> 140)
                    hp: 5000,
                    maxHp: 5000,
                    speed: 2.0, // Sangat Cepat
                    knockback: { x: 0, y: 0 },
                    color: '#7f1d1d', // Merah darah
                    animOffset: 0,
                    angle: 0,
                    isBoss: true,
                    imgKey: 'boss'
                });
            }

            function checkWall(x, y) {
                const map = maps[STATE.location];
                // FIX: gunakan TS (tile size peta peri) jika di fairyVillage
                const _cwTS = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;
                if (x < 0 || x > map.w * _cwTS || y < 0 || y > map.h * _cwTS) return true;

                const tx = Math.floor((x + 10) / _cwTS);
                const ty = Math.floor((y + 10) / _cwTS);

                if (ty >= map.h || tx >= map.w) return true;

                const t = map.tiles[ty * map.w + tx];

                // UPDATE: Izinkan jalan di air (Tile 0) jika di area Dermaga
                if (t === 0 && STATE.location === 'fairyVillage') {
                    return false; // Tidak ada air di fairy village
                }
                if (STATE.location === 'village' && t === 0) {
                    // Area Dermaga didefinisikan di map (x:43, y:34, w:7, h:5)
                    // Kita izinkan player berjalan di koordinat tile tersebut
                    // UPDATE: Koordinat Y disesuaikan (34 s/d 38)
                    if (tx >= 43 && tx < 50 && ty >= 34 && ty < 39) {
                        return false; // Walkable (Dermaga Kayu)
                    }
                    return true; // Blocked (Laut Lepas)
                }

                // UPDATE: Tambahkan ID 13 (Tembok Bawah) dan 21 (Tembok Peri) sebagai collision
                return (t === 2 || t === 12 || t === 11 || t === 13 || t === 21);
            }

            function checkObjectCollision(x, y) {
                const map = maps[STATE.location];
                for (let obj of map.objects) {
                    if (obj.seasonReq && obj.seasonReq !== STATE.season) continue;

                    const ox = obj.x * TILE_SIZE;
                    const oy = obj.y * TILE_SIZE;
                    const ow = (obj.w || 1) * TILE_SIZE;
                    const oh = (obj.h || 1) * TILE_SIZE;

                    // ── HITBOX OBJEK: hanya zona KAKI (bawah) ──
                    // Semua objek — meja, kursi, kasur, perabotan, pohon, dll —
                    // hanya solid di bagian bawah agar player bisa jalan di belakang.
                    // - Objek tipis (h=1 tile): solid seluruhnya
                    // - Objek tinggi (h>1): solid 40% bawah saja
                    let footH, footTop;

                    const isTall = (obj.h || 1) > 1;
                    if (isTall) {
                        footH   = Math.round(oh * 0.40);
                        footTop = oy + oh - footH;
                    } else {
                        // Objek 1 tile tinggi: solid penuh (tidak ada bagian atas yang bisa dilewati)
                        footH   = oh;
                        footTop = oy;
                    }

                    const pw = 20, ph = 16;

                    if (x + pw > ox && x < ox + ow &&
                        y + ph > footTop && y < footTop + footH) {
                        return obj;
                    }
                }
                return null;
            }

            function checkBuildingCollision(x, y) {
                const map = maps[STATE.location];
                if (!map.buildings) return false;

                const isFV = STATE.location === 'fairyVillage';
                const _bTS = (isFV && typeof TS !== 'undefined') ? TS : TILE_SIZE;
                // Visual scale untuk fairyVillage — gambar 1.8x lebih besar dari hitbox tile
                // Hitbox tetap pakai ukuran tile asli (w*TS), bukan ukuran visual
                const _vs = (isFV && typeof FV_BLDG_VISUAL_SCALE !== 'undefined') ? FV_BLDG_VISUAL_SCALE : 1.0;

                for (let b of map.buildings) {
                    if (b.type === 'trigger' || b.id === 'port') continue;
                    // Hanya bangunan solid yang menghalangi player
                    if (isFV && !b.solid) continue;

                    const bTileW = b.w * _bTS;
                    const bTileH = b.h * _bTS;
                    const bTileX = b.x * _bTS;
                    const bTileY = b.y * _bTS;

                    let footH, footTop, colLeft, colRight;

                    if (b.type === 'dungeon_rock') {
                        // Batu dungeon: hitbox setengah bawah, lebar penuh
                        footH    = Math.round(bTileH * 0.5);
                        footTop  = bTileY + bTileH - footH;
                        colLeft  = bTileX;
                        colRight = bTileX + bTileW;
