// ══════════════════════════════════════════════════════════════
// Sistem Part-Time
// File: js/17-kerja-parttime.js
// ══════════════════════════════════════════════════════════════
            // SISTEM PART-TIME (15:00 - 19:00) — SEMUA ROLE BISA IKUT
            // ============================================================
            const PART_TIME_JOBS = {
                'bengkel': {
                    name: '⚒️ Bengkel Besi (Bang Joko)',
                    desc: 'Bantu tempa logam, bersihkan alat, dan layani pelanggan bengkel.',
                    wage: 3500,
                    stat: 'STR +1',
                    statKey: 'str',
                    hours: '15:00 – 19:00',
                    location: 'Di dalam Bengkel (smithy_interior)',
                    img: 'images/blacksmith.png',
                    npcId: 'blacksmith'
                },
                'penjahit': {
                    name: '🧵 Tukang Jahit (Marine)',
                    desc: 'Bantu potong kain, jahit pesanan, dan rapikan etalase butik.',
                    wage: 3000,
                    stat: 'INT +1',
                    statKey: 'int',
                    hours: '15:00 – 19:00',
                    location: 'Di Rumah Marine (tailor_area)',
                    img: 'images/marine.png',
                    npcId: 'marine_tailor'
                },
                'klinik': {
                    name: '🩺 Klinik (Dr. Budi)',
                    desc: 'Bantu administrasi pasien, siapkan obat, dan dampingi dokter.',
                    wage: 4000,
                    stat: 'REP +1',
                    statKey: 'reputation',
                    hours: '15:00 – 19:00',
                    location: 'Di dalam Klinik (clinic_interior)',
                    img: 'images/lover1boy.png',
                    npcId: 'lover1boy'
                }
            };

            function openPartTimeMenu(npcId) {
                const p = STATE.player;
                const jobKey = Object.keys(PART_TIME_JOBS).find(k => PART_TIME_JOBS[k].npcId === npcId);
                if (!jobKey) return;
                const job = PART_TIME_JOBS[jobKey];

                // Cek sudah kerja part-time di tempat lain
                if (p.partTimeStatus === 'working' && p.partTimeJob !== jobKey) {
                    const currentJobName = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'tempat lain';
                    showDialogue('PART-TIME', `Kamu sudah punya pekerjaan part-time di ${currentJobName}.\n\nKamu hanya bisa kerja part-time di 1 tempat. Resign dulu jika ingin pindah.`, [
                        { text: '❌ Resign dari Part-Time Lama', action: () => resignPartTime(npcId) },
                        { text: 'Batalkan', action: closeDialogue }
                    ], job.img);
                    return;
                }

                if (p.partTimeStatus === 'working' && p.partTimeJob === jobKey) {
                    // Sudah kerja di sini — tampilkan opsi kerja/absen
                    showPartTimeWorkMenu(jobKey);
                    return;
                }

                // Belum punya part-time — tampilkan tawaran
                showDialogue('LOWONGAN PART-TIME', 
                    `🌟 PART-TIME: ${job.name}\n\n` +
                    `📋 Tugas: ${job.desc}\n` +
                    `💰 Upah: ${job.wage.toLocaleString()} G / hari\n` +
                    `📈 Bonus Stat: ${job.stat}\n` +
                    `⏰ Jam Kerja: ${job.hours}\n` +
                    `📍 Lokasi: ${job.location}\n\n` +
                    `Part-time bisa diambil SEMUA role (Pekerja, Akademisi, Wirausaha, Keluarga). ` +
                    `Shift dimulai saat kamu absen masuk antara jam 15:00 – 17:00.`,
                    [
                        { text: '✅ Daftar Part-Time Ini', action: () => applyPartTime(jobKey, job) },
                        { text: 'Tidak Jadi', action: closeDialogue }
                    ], job.img
                );
            }

            function applyPartTime(jobKey, job) {
                const p = STATE.player;
                p.partTimeJob = jobKey;
                p.partTimeStatus = 'working';
                p.partTimeShiftStarted = false;
                closeDialogue();
                showToast(`🎉 Selamat! Kamu resmi jadi karyawan part-time di ${job.name}!`);
                setTimeout(() => {
                    showDialogue('SELAMAT BERGABUNG!',
                        `Kamu sekarang adalah karyawan part-time!\n\n` +
                        `📌 CARA KERJA:\n` +
                        `1. Datang ke lokasi kerja antara jam 15:00 – 17:00\n` +
                        `2. Tekan tombol "Absen Masuk Part-Time" saat bicara dengan bos\n` +
                        `3. Shift otomatis selesai jam 19:00\n` +
                        `4. Upah & bonus stat langsung diterima!\n\n` +
                        `⚠️ Kalau tidak absen, gaji tidak masuk hari itu.`,
                        [{ text: 'Siap bekerja!', action: closeDialogue }], job.img
                    );
                }, 300);
            }

            function resignPartTime(newNpcId) {
                const p = STATE.player;
                p.partTimeJob = null;
                p.partTimeStatus = 'none';
                p.partTimeShiftStarted = false;
                closeDialogue();
                showToast('Kamu sudah resign dari part-time lama.');
                setTimeout(() => {
                    if (newNpcId) {
                        const npc = (STATE.maps[STATE.location] && STATE.maps[STATE.location].npcs || []).find(n => n.id === newNpcId)
                                 || Object.values(STATE.maps).flatMap(m => m.npcs || []).find(n => n.id === newNpcId);
                        if (npc) interactNPC(npc);
                        else openPartTimeMenu(newNpcId);
                    }
                }, 400);
            }

            function showPartTimeWorkMenu(jobKey) {
                const p = STATE.player;
                const job = PART_TIME_JOBS[jobKey];
                const dayIndex = (STATE.day - 1) % 7;
                const isSunday = dayIndex === 6;
                const alreadyWorkedToday = p.partTimeLastWorkedDay === STATE.day;

                if (isSunday) {
                    showDialogue(job.name, 'Hari ini MINGGU, libur part-time. Istirahat yang cukup ya!', [
                        { text: 'Oke, istirahat dulu', action: closeDialogue }
                    ], job.img);
                    return;
                }

                if (alreadyWorkedToday) {
                    showDialogue(job.name, `Shift part-time hari ini sudah selesai! ✅\nKamu sudah mendapat upah ${job.wage.toLocaleString()} G tadi.\n\nSampai besok ya!`, [
                        { text: 'Sampai besok!', action: closeDialogue },
                        { text: '❌ Resign Part-Time', action: () => { resignPartTime(null); } }
                    ], job.img);
                    return;
                }

                if (p.partTimeShiftStarted) {
                    showDialogue(job.name, `Shift part-time sedang berjalan! ⏳\nSelesai jam 19:00.\n\nLanjutkan tugasmu ya!`, [
                        { text: 'Siap!', action: closeDialogue }
                    ], job.img);
                    return;
                }

                const opts = [];

                // Bisa absen hanya jam 15:00 – 17:00
                if (isFestivalDayToday()) {
                    const fest = getTodayFestivalData();
                    opts.push({ text: `${fest ? fest.icon : '🎉'} Hari ini festival — libur part-time!`, action: () => {
                        showToast(`${fest ? fest.icon : '🎉'} ${fest ? fest.name : 'Festival'} — semua aktivitas libur!`);
                        closeDialogue();
                    }});
                } else if (STATE.time >= 1500 && STATE.time < 1700) {
                    opts.push({
                        text: '🟢 Absen Masuk Part-Time (15:00)',
                        action: () => {
                            if (p.energy < 15) {
                                showToast('Energi terlalu rendah untuk kerja part-time!');
                                return;
                            }
                            p.partTimeShiftStarted = true;
                            closeDialogue();
                            showToast(`✅ Absen masuk part-time di ${job.name}! Selesai jam 19:00.`);
                            maybeShowWorkConflict(true, jobKey);
                        }
                    });
                } else if (STATE.time < 1500) {
                    opts.push({ text: `⏰ Shift belum mulai (Datang jam 15:00)`, action: () => closeDialogue() });
                } else {
                    opts.push({ text: `⛔ Terlambat absen (lewat jam 17:00)`, action: () => {
                        showToast('Terlambat! Gaji tidak masuk hari ini.');
                        closeDialogue();
                    }});
                }

                opts.push({ text: '📊 Statistik Part-Time', action: () => {
                    showDialogue('STATISTIK PART-TIME', 
                        `💼 Pekerjaan: ${job.name}\n` +
                        `📅 Total Hari Kerja: ${p.partTimeSalaryDays || 0} hari\n` +
                        `💰 Total Penghasilan: ${((p.partTimeSalaryDays || 0) * job.wage).toLocaleString()} G (estimasi)\n` +
                        `⏰ Jam Kerja: ${job.hours}`,
                        [{ text: 'Tutup', action: () => showPartTimeWorkMenu(jobKey) }], job.img
                    );
                }});
                opts.push({ text: '❌ Resign Part-Time', action: () => {
                    showDialogue('KONFIRMASI RESIGN', `Yakin mau resign dari ${job.name}?\nKamu bisa melamar lagi kapan saja.`, [
                        { text: 'Ya, Resign', action: () => resignPartTime(null) },
                        { text: 'Batal', action: () => showPartTimeWorkMenu(jobKey) }
                    ], job.img);
                }});
                opts.push({ text: 'Tutup', action: closeDialogue });

                showDialogue(`PART-TIME — ${job.name}`, 
                    `Selamat datang kembali! 👋\nShift part-time: ${job.hours}\n\n` +
                    `Status: ${p.partTimeShiftStarted ? '🟢 Sedang Kerja' : '🔴 Belum Absen'}\n` +
                    `Energi kamu: ${Math.round(p.energy)}%`,
                    opts, job.img
                );
            }

            // ================================================================
            // SISTEM INFO LOWONGAN KERJA — Harus cari info dulu sebelum melamar
            // Sumber info: Papan Desa, Warnet (cari di internet), Tetangga/NPC,
            //              Mentor Budi, Koran (jika ada)
            // ================================================================

            // Katalog semua lowongan yang bisa ditemukan
            const JOB_LISTINGS = {
                'merchant': {
                    id: 'merchant',
                    title: '🏪 Staff Gudang — Toko Merchant',
                    employer: 'Pak Hendra (Merchant)',
                    desc: 'Dibutuhkan tenaga sortir gudang, kasir, dan pelayan toko.\nShift pagi 08:00–16:00, Senin–Sabtu.',
                    syarat: '• Min. ijazah SMA/SMK\n• Disiplin & jujur\n• Tidak perlu pengalaman (awal magang)',
                    gaji: '5.000 G/hari (Magang) → naik s/d 25.000 G/hari',
                    lokasi: '📍 Temui Pak Hendra langsung di Toko Merchant (Selatan Desa)',
                    type: 'formal',
                    sources: ['papan','warnet','mentor','tetangga']
                },
                'bengkel_formal': {
                    id: 'bengkel_formal',
                    title: '⚒️ Asisten Pandai Besi — Bengkel Bang Joko',
                    employer: 'Bang Joko (Blacksmith)',
                    desc: 'Bantu tempa logam, rawat alat, dan layani pelanggan bengkel.\nCocok untuk yang kuat fisik.',
                    syarat: '• Min. ijazah SMA/SMK jurusan teknik lebih diutamakan\n• STR minimal cukup kuat\n• Siap kerja kasar',
                    gaji: '3.500 G/hari (Part-Time) atau negosiasi full-time',
                    lokasi: '📍 Masuk ke dalam Bengkel, temui Bang Joko',
                    type: 'parttime',
                    sources: ['papan','tetangga','mentor']
                },
                'parttime_jahit': {
                    id: 'parttime_jahit',
                    title: '🧵 Asisten Penjahit — Butik Marine',
                    employer: 'Marine (Penjahit)',
                    desc: 'Bantu potong pola, jahit pesanan, dan kelola etalase butik.\nCocok untuk yang teliti dan sabar.',
                    syarat: '• Siapapun bisa, lebih baik punya ketelitian\n• Waktu fleksibel sore hari',
                    gaji: '3.000 G/hari (15:00–19:00)',
                    lokasi: '📍 Temui Marine di area tailor (dekat Bengkel)',
                    type: 'parttime',
                    sources: ['papan','warnet','tetangga']
                },
                'parttime_klinik': {
                    id: 'parttime_klinik',
                    title: '🩺 Asisten Administrasi — Klinik Dr. Budi',
                    employer: 'Dr. Budi',
                    desc: 'Bantu daftar pasien, siapkan rekam medis, dan urus kebersihan klinik.\nCocok untuk yang rapi dan komunikatif.',
                    syarat: '• Min. SMA/SMK semua jurusan\n• Ramah dan teliti\n• Upah terbaik di antara part-time',
                    gaji: '4.000 G/hari (15:00–19:00)',
                    lokasi: '📍 Masuk ke Klinik (Balai Pengobatan), temui Dr. Budi',
                    type: 'parttime',
                    sources: ['warnet','mentor','klinik']
                }
            };

            // Cek apakah pemain sudah tahu tentang lowongan ini
            function knowsJob(jobId) {
                return (STATE.player.knownJobs || []).includes(jobId);
            }

            // Tandai lowongan sebagai diketahui
            function discoverJob(jobId) {
                if (!STATE.player.knownJobs) STATE.player.knownJobs = [];
                if (!STATE.player.knownJobs.includes(jobId)) {
                    STATE.player.knownJobs.push(jobId);
                    const job = JOB_LISTINGS[jobId];
                    if (job) {
                        showToast(`📋 Info Lowongan Baru: ${job.title}`);
                        STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 1;
                    }
                }
            }

            // Tampilkan detail satu lowongan
            function showJobDetail(jobId, backFn) {
                const job = JOB_LISTINGS[jobId];
                if (!job) return;
                const p = STATE.player;
                const alreadyApplied = (jobId === 'merchant' || jobId === 'bengkel_formal') 
                    ? p.jobStatus === 'employed' 
                    : p.partTimeStatus === 'working';

                const statusLine = alreadyApplied ? '\n✅ Kamu sudah bekerja di sini!\n' : '';

                showDialogue(`📋 ${job.title}`,
                    `👔 Pemberi Kerja: ${job.employer}\n\n` +
                    `📝 Deskripsi:\n${job.desc}\n\n` +
                    `✅ Syarat:\n${job.syarat}\n\n` +
                    `💰 Gaji: ${job.gaji}\n\n` +
                    `${job.lokasi}` +
                    statusLine,
                    [
                        alreadyApplied 
                            ? { text: '✅ Sudah Bekerja Di Sini', action: closeDialogue }
                            : { text: '🚶 Pergi Melamar Sekarang!', action: () => {
                                closeDialogue();
                                showToast(`Pergi ke: ${job.lokasi.replace('📍 ','')}!`);
                              }},
                        { text: '← Kembali', action: () => { closeDialogue(); if (backFn) backFn(); } }
                    ], 'images/papandesa.png'
                );
            }

            // Panel utama: Daftar semua lowongan yang sudah diketahui
            function openKnownJobsPanel(backFn) {
                const p = STATE.player;
                const known = p.knownJobs || [];

                if (known.length === 0) {
                    showDialogue('📋 INFO LOWONGAN KERJA',
                        'Kamu belum punya info lowongan kerja apapun.\n\n' +
                        '📌 Cara mendapatkan info lowongan:\n' +
                        '• 📌 Baca Papan Desa (di pusat desa)\n' +
                        '• 💻 Cari di Warnet (bayar 500G/sesi)\n' +
                        '• 💬 Tanya warga / tetangga sekitar\n' +
                        '• 👨‍🏫 Konsultasi ke Mentor Budi\n\n' +
                        '💡 Di dunia nyata pun mencari kerja butuh usaha.\n' +
                        'Semakin banyak info, semakin besar peluangmu!',
                        [
                            { text: '📌 Lihat Papan Desa', action: () => { closeDialogue(); searchJobFromBoard(); } },
                            { text: 'Nanti Dulu', action: closeDialogue }
                        ], 'images/papandesa.png'
                    );
                    return;
                }

                // Buat daftar lowongan yang diketahui
                const opts = [];
                known.forEach(jid => {
                    const job = JOB_LISTINGS[jid];
                    if (!job) return;
                    const isWorking = (jid === 'merchant' || jid === 'bengkel_formal')
                        ? p.jobStatus === 'employed'
                        : (p.partTimeStatus === 'working' && p.partTimeJob === jid.replace('bengkel_formal','bengkel').replace('merchant',''));
                    const statusIcon = isWorking ? '✅' : '📋';
                    opts.push({ text: `${statusIcon} ${job.title}`, action: () => showJobDetail(jid, () => openKnownJobsPanel(backFn)) });
                });
                opts.push({ text: '🔍 Cari Info Lowongan Baru', action: () => { closeDialogue(); openJobSearchMenu(); } });
                opts.push({ text: 'Tutup', action: closeDialogue });

                showDialogue(`📋 INFO LOWONGAN (${known.length} tersimpan)`,
                    `Kamu sudah punya info ${known.length} lowongan.\nPilih untuk melihat detail & cara melamar:`,
                    opts, 'images/papandesa.png'
                );
            }

            // Menu pilihan cara mencari info lowongan
            function openJobSearchMenu() {
                const p = STATE.player;
                showDialogue('🔍 CARI INFO LOWONGAN KERJA',
                    'Pilih cara kamu mencari informasi lowongan:\n\n' +
                    '💡 Semakin banyak sumber yang kamu cek,\nsemakin banyak lowongan yang kamu temukan!',
                    [
                        { text: '📌 Baca Papan Desa', action: () => { closeDialogue(); searchJobFromBoard(); } },
                        { text: '💻 Cari di Warnet (500G)', action: () => { closeDialogue(); searchJobFromWarnet(); } },
                        { text: '💬 Tanya Tetangga/Warga', action: () => { closeDialogue(); searchJobFromNeighbor(); } },
                        { text: '👨‍🏫 Konsultasi Mentor Budi', action: () => { closeDialogue(); searchJobFromMentor(); } },
                        { text: '← Kembali', action: closeDialogue }
                    ], 'images/papandesa.png'
                );
            }

            // SUMBER 1: Papan Desa → merchant + bengkel_formal
            function searchJobFromBoard() {
                const p = STATE.player;
                const newJobs = [];
                if (!knowsJob('merchant')) { discoverJob('merchant'); newJobs.push(JOB_LISTINGS['merchant']); }
                if (!knowsJob('bengkel_formal')) { discoverJob('bengkel_formal'); newJobs.push(JOB_LISTINGS['bengkel_formal']); }

                p.jobSearchCount = (p.jobSearchCount || 0) + 1;
                p.lastJobSearchDay = STATE.day;

                if (newJobs.length > 0) {
                    const listStr = newJobs.map(j => `• ${j.title}`).join('\n');
                    showDialogue('📌 PAPAN LOWONGAN DESA',
                        `Kamu membaca pengumuman di Papan Desa dengan seksama...\n\n` +
                        `📋 LOWONGAN BARU DITEMUKAN:\n${listStr}\n\n` +
                        `Info ini sudah tersimpan di daftar lowonganmu!\n\n` +
                        `💡 Papan desa biasanya mencantumkan lowongan formal di sekitar desa. Untuk lowongan part-time yang lebih fleksibel, coba cari di sumber lain.`,
                        [
                            { text: '📋 Lihat Detail Lowongan', action: () => { closeDialogue(); openKnownJobsPanel(null); } },
                            { text: 'Oke, terima kasih!', action: closeDialogue }
                        ], 'images/papandesa.png'
                    );
                } else {
                    showDialogue('📌 PAPAN LOWONGAN DESA',
                        'Kamu sudah membaca semua info di papan ini.\n\nSemua lowongan yang tersedia sudah kamu catat.\n\n💡 Coba cari di sumber lain untuk menemukan lowongan part-time!',
                        [
                            { text: '📋 Lihat Daftar Lowonganku', action: () => { closeDialogue(); openKnownJobsPanel(null); } },
                            { text: 'Oke', action: closeDialogue }
                        ], 'images/papandesa.png'
                    );
                }
            }

            // SUMBER 2: Warnet → semua lowongan, tapi bayar 500G
            function searchJobFromWarnet() {
                const p = STATE.player;
                if (p.money < 500) {
                    showDialogue('💻 WARNET',
                        'Kamu tidak punya cukup uang untuk sewa PC.\n\nBiaya: 500 G/sesi\nUangmu: ' + p.money + ' G\n\n💡 Coba tanya tetangga dulu, itu gratis!',
                        [{ text: 'Oke', action: closeDialogue }], 'images/warnet.png'
                    );
                    return;
                }
                if (p.energy < 10) {
                    showToast('Terlalu lelah untuk mencari-cari di warnet...');
                    return;
                }

                p.money -= 500;
                p.energy -= 10;
                p.jobSearchCount = (p.jobSearchCount || 0) + 1;
                p.lastJobSearchDay = STATE.day;

                const newJobs = [];
                const allJobIds = Object.keys(JOB_LISTINGS);
                allJobIds.forEach(jid => {
                    if (JOB_LISTINGS[jid].sources.includes('warnet') && !knowsJob(jid)) {
                        discoverJob(jid);
                        newJobs.push(JOB_LISTINGS[jid]);
                    }
                });

                if (newJobs.length > 0) {
                    const listStr = newJobs.map(j => `• ${j.title}`).join('\n');
                    showDialogue('💻 HASIL BROWSING WARNET',
                        `Kamu browsing selama 1 jam mencari lowongan kerja...\n\n` +
                        `🔍 Situs yang dikunjungi: JobStreet, Kaskus, Facebook Group Lowongan...\n\n` +
                        `📋 LOWONGAN BARU DITEMUKAN:\n${listStr}\n\n` +
                        `✅ Info tersimpan! Biaya sewa: 500 G\n\n` +
                        `💡 Internet adalah alat pencarian kerja paling powerful zaman ini. Lulusan SMA/SMK yang melek digital punya keunggulan kompetitif!`,
                        [
                            { text: '📋 Lihat Detail Lowongan', action: () => { closeDialogue(); openKnownJobsPanel(null); } },
                            { text: 'Mantap!', action: closeDialogue }
                        ], 'images/warnet.png'
                    );
                } else {
                    showDialogue('💻 HASIL BROWSING WARNET',
                        'Kamu browsing tapi tidak menemukan lowongan baru.\nSemua info yang tersedia sudah kamu catat.\n\nBiaya sewa: 500 G (hangus)\n\n💡 Terkadang kerja keras mencari info tidak langsung membuahkan hasil. Tapi pengalaman mencari itu sendiri melatihmu!',
                        [{ text: 'Oke...', action: closeDialogue }], 'images/warnet.png'
                    );
                }
            }

            // SUMBER 3: Tanya tetangga → parttime random
            function searchJobFromNeighbor() {
                const p = STATE.player;
                const todaySearched = p.lastJobSearchDay === STATE.day && (p.jobSearchCount || 0) >= 3;
                if (todaySearched) {
                    showDialogue('💬 TANYA TETANGGA',
                        'Kamu sudah banyak bertanya hari ini.\nTetangga mulai kelelahan menjawab pertanyaanmu 😅\n\nCoba lagi besok!',
                        [{ text: 'Hehe oke', action: closeDialogue }], 'images/boy.png'
                    );
                    return;
                }

                p.jobSearchCount = (p.jobSearchCount || 0) + 1;
                p.lastJobSearchDay = STATE.day;

                // Tetangga kasih info part-time secara acak
                const partTimeJobs = ['parttime_jahit', 'parttime_klinik', 'bengkel_formal'];
                const unknown = partTimeJobs.filter(jid => !knowsJob(jid));

                const neighborLines = [
                    { name: 'Pak RT', img: 'images/boy.png', intro: '"Eh, kamu lagi nyari kerja? Kebetulan saya dengar..."' },
                    { name: 'Bu Warung', img: 'images/girl.png', intro: '"Aduh anak muda, minta kerja susah sekarang ya... Tapi pernah dengar..."' },
                    { name: 'Mas Sebelah', img: 'images/peer1.png', intro: '"Bro, kemarin aku lihat pengumuman di tembok dekat bengkel..."' },
                ];
                const nb = neighborLines[Math.floor(Math.random() * neighborLines.length)];

                if (unknown.length > 0) {
                    const picked = unknown[Math.floor(Math.random() * unknown.length)];
                    discoverJob(picked);
                    const job = JOB_LISTINGS[picked];
                    showDialogue(`💬 ${nb.name}`,
                        `${nb.intro}\n\n` +
                        `"Kayaknya ${job.employer} lagi butuh bantuan. Kamu bisa coba ke sana!"\n\n` +
                        `📋 INFO LOWONGAN BARU:\n${job.title}\nGaji: ${job.gaji}\n\n` +
                        `💡 Networking (koneksi sosial) adalah salah satu cara paling efektif mencari kerja di Indonesia. Lebih dari 60% lowongan diisi melalui kenalan!`,
                        [
                            { text: '📋 Lihat Detail', action: () => { closeDialogue(); showJobDetail(picked, null); } },
                            { text: 'Makasih infonya!', action: closeDialogue }
                        ], nb.img
                    );
                } else {
                    showDialogue(`💬 ${nb.name}`,
                        `${nb.intro}\n\n"Hmm, tapi kayaknya kamu sudah tahu semua lowongan yang ada di sini deh."\n\n` +
                        `💡 Jaringan pertemananmu di desa ini sudah kamu manfaatkan dengan baik. Coba cari di luar desa lewat warnet!`,
                        [{ text: 'Iya makasih!', action: closeDialogue }], nb.img
                    );
                }
            }

            // SUMBER 4: Mentor Budi → merchant + saran karir
            function searchJobFromMentor() {
                const p = STATE.player;
                const newJobs = [];
                const allJobIds = Object.keys(JOB_LISTINGS);
                allJobIds.forEach(jid => {
                    if (JOB_LISTINGS[jid].sources.includes('mentor') && !knowsJob(jid)) {
                        discoverJob(jid);
                        newJobs.push(JOB_LISTINGS[jid]);
                    }
                });
                p.jobSearchCount = (p.jobSearchCount || 0) + 1;

                const edu = p.role === 'student' 
                    ? 'Karena kamu kuliah, part-time bisa jadi pilihan agar tidak ganggu akademik.'
                    : p.married 
                        ? 'Kamu sudah menikah — stabilitas keuangan adalah prioritas. Kerja formal lebih disarankan untuk jangka panjang.'
                        : 'Mulailah dari yang bisa kamu capai sekarang, lalu terus tingkatkan dirimu.';

                const listStr = newJobs.length > 0 
                    ? `📋 Lowongan yang Mentor rekomendasikan:\n${newJobs.map(j=>`• ${j.title}`).join('\n')}\n\n`
                    : 'Kamu sudah tahu semua lowongan yang Mentor ketahui.\n\n';

                showDialogue('👨‍🏫 MENTOR BUDI — KONSULTASI KARIR',
                    `"Nak, mencari pekerjaan itu seperti belajar — butuh usaha, bukan sekedar menunggu."\n\n` +
                    listStr +
                    `💡 SARAN MENTOR:\n${edu}\n\n` +
                    `"Dengan ijazah SMA/SMK, pintu yang terbuka memang tidak selebar S1. Tapi bukan berarti tertutup. Keterampilan, disiplin, dan attitude-mu yang akan membedakan!"\n\n` +
                    `📊 Fakta: Rata-rata gaji awal SMA/SMK Rp 2–3 juta/bulan. Dengan pengalaman 2–3 tahun bisa mencapai Rp 4–6 juta.`,
                    [
                        newJobs.length > 0 ? { text: '📋 Lihat Lowongan', action: () => { closeDialogue(); openKnownJobsPanel(null); } } : null,
                        { text: 'Terima kasih Mentor!', action: closeDialogue }
                    ].filter(Boolean), 'images/mentor.png'
                );
            }

            function openPartTimeLobby() {
                // Tampilkan semua pilihan tempat part-time
                showDialogue('🌟 PAPAN LOWONGAN PART-TIME',
                    'Cari kerja tambahan? Semua role bisa ambil part-time!\n\n' +
                    '⏰ Jam kerja: 15:00 – 19:00 setiap hari (kecuali Minggu)\n' +
                    '📌 Pilih tempat yang ingin kamu lamar:',
                    [
                        { text: '⚒️ Bengkel Besi (3.500 G/hari, STR+1)', action: () => openPartTimeMenu('blacksmith') },
                        { text: '🧵 Tukang Jahit (3.000 G/hari, INT+1)', action: () => openPartTimeMenu('marine_tailor') },
                        { text: '🩺 Klinik (4.000 G/hari, REP+1)', action: () => openPartTimeMenu('lover1boy') },
                        { text: 'Nanti dulu', action: closeDialogue }
                    ], 'images/bg.png'
                );
            }

            // ================================================================
