// ══════════════════════════════════════════════════════════════
// Sistem Konflik Wirausaha (Entrepreneur)
// File: js/12-konflik-bisnis.js
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

            // ═══════════════════════════════════════════════════════════════
