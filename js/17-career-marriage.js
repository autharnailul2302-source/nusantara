            // ============================================================
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
            // SISTEM MINIGAME LAMARAN KERJA LENGKAP
            // ================================================================

            // --- DATABASE LOWONGAN ---
            const LOWONGAN_DB = {
                merchant: {
                    id: 'merchant',
                    nama: '🏪 Staff Gudang — Toko Merchant (Pak Hendra)',
                    posisi: 'Staff Gudang / Kasir',
                    npcId: 'merchant',
                    tujuan: 'Yth. Bapak Hendra\nPimpinan Toko Merchant\nDesa Nusantara Arsa',
                    perihal: 'Permohonan Menjadi Karyawan Staff Gudang',
                    syaratLampiran: [
                        { id: 'ijazah',       label: 'Fotokopi Ijazah SMA/SMK',         wajib: true  },
                        { id: 'cv',           label: 'Curriculum Vitae (CV)',             wajib: true  },
                        { id: 'foto_3x4',     label: 'Pas Foto 3×4 (2 lembar)',          wajib: true  },
                        { id: 'ktp',          label: 'Fotokopi KTP',                     wajib: true  },
                        { id: 'surat_sehat',  label: 'Surat Keterangan Sehat',           wajib: false },
                        { id: 'skck',         label: 'SKCK (Surat Kel. Catatan Kepolisian)', wajib: false }
                    ],
                    bodySurat: (nama, skills) =>
                        `Dengan hormat,\n\nYang bertanda tangan di bawah ini:\n` +
                        `Nama  : ${nama}\nAlamat: Desa Nusantara Arsa\n\n` +
                        `Dengan ini mengajukan permohonan untuk dapat diterima sebagai ` +
                        `karyawan pada posisi **Staff Gudang** di Toko Merchant yang Bapak pimpin.\n\n` +
                        `Saya memiliki kemampuan: ${skills || 'kerja keras dan disiplin'}. ` +
                        `Saya siap bekerja penuh waktu sesuai jam yang ditentukan.\n\n` +
                        `Demikian surat lamaran ini saya buat dengan sebenar-benarnya. ` +
                        `Atas perhatian Bapak, saya ucapkan terima kasih.\n\nHormat saya,\n${nama}`,
                    info: 'Jam kerja 08:00–16:00. Gaji awal magang. Bisa naik jabatan hingga Manajer.',
                    rewardJobKey: 'worker_merchant'
                },
                blacksmith: {
                    id: 'blacksmith',
                    nama: '⚒️ Karyawan Part-Time — Bengkel Besi (Bang Joko)',
                    posisi: 'Asisten Bengkel (Part-Time)',
                    npcId: 'blacksmith',
                    tujuan: 'Yth. Bapak Joko\nPemilik Bengkel Besi\nDesa Nusantara Arsa',
                    perihal: 'Permohonan Kerja Part-Time Asisten Bengkel',
                    syaratLampiran: [
                        { id: 'ijazah',      label: 'Fotokopi Ijazah SMA/SMK',  wajib: true  },
                        { id: 'cv',          label: 'Curriculum Vitae (CV)',      wajib: true  },
                        { id: 'foto_3x4',    label: 'Pas Foto 3×4 (1 lembar)',   wajib: true  },
                        { id: 'ktp',         label: 'Fotokopi KTP',              wajib: false },
                        { id: 'sertifikat',  label: 'Sertifikat Skill (Jika Ada)',wajib: false }
                    ],
                    bodySurat: (nama, skills) =>
                        `Dengan hormat,\n\nSaya ${nama}, warga Desa Nusantara Arsa, ` +
                        `bermaksud mengajukan lamaran untuk posisi **Asisten Bengkel Part-Time** ` +
                        `di bengkel yang Bapak kelola.\n\n` +
                        `Saya memiliki fisik yang kuat dan semangat belajar tinggi. ` +
                        `${skills ? 'Kemampuan saya: ' + skills + '.' : ''} ` +
                        `Saya bersedia bekerja pada jam part-time (15:00–19:00) setiap hari kerja.\n\n` +
                        `Atas pertimbangan Bapak, saya ucapkan terima kasih.\n\nHormat saya,\n${nama}`,
                    info: 'Jam kerja 15:00–19:00. Upah harian. Cocok untuk semua role.',
                    rewardJobKey: 'parttime_bengkel'
                },
                marine_tailor: {
                    id: 'marine_tailor',
                    nama: '🧵 Karyawan Part-Time — Butik Marine (Bu Marine)',
                    posisi: 'Asisten Penjahit (Part-Time)',
                    npcId: 'marine_tailor',
                    tujuan: 'Yth. Ibu Marine\nPemilik Butik Jahit\nDesa Nusantara Arsa',
                    perihal: 'Permohonan Kerja Part-Time Asisten Penjahit',
                    syaratLampiran: [
                        { id: 'ijazah',      label: 'Fotokopi Ijazah SMA/SMK',   wajib: true  },
                        { id: 'cv',          label: 'Curriculum Vitae (CV)',       wajib: true  },
                        { id: 'foto_3x4',    label: 'Pas Foto 3×4 (1 lembar)',    wajib: true  },
                        { id: 'portofolio',  label: 'Portofolio Karya (Opsional)', wajib: false },
                        { id: 'ktp',         label: 'Fotokopi KTP',               wajib: false }
                    ],
                    bodySurat: (nama, skills) =>
                        `Dengan hormat,\n\nSaya ${nama}, mengajukan permohonan untuk bergabung ` +
                        `sebagai **Asisten Penjahit Part-Time** di Butik Ibu Marine.\n\n` +
                        `Saya memiliki ketelitian dan kesabaran yang baik. ` +
                        `${skills ? 'Kemampuan tambahan: ' + skills + '.' : ''} ` +
                        `Saya siap belajar dari Ibu dan bekerja dengan sungguh-sungguh.\n\n` +
                        `Terima kasih atas kesempatan yang diberikan.\n\nHormat saya,\n${nama}`,
                    info: 'Jam kerja 15:00–19:00. Cocok bagi yang suka kerajinan tangan.',
                    rewardJobKey: 'parttime_jahit'
                },
                lover1boy: {
                    id: 'lover1boy',
                    nama: '🩺 Asisten Klinik — Dr. Budi',
                    posisi: 'Asisten Administrasi Klinik (Part-Time)',
                    npcId: 'lover1boy',
                    tujuan: 'Yth. Dr. Budi\nDokter Kepala Balai Pengobatan\nDesa Nusantara Arsa',
                    perihal: 'Permohonan Kerja Part-Time Asisten Administrasi Klinik',
                    syaratLampiran: [
                        { id: 'ijazah',       label: 'Fotokopi Ijazah SMA/SMK',     wajib: true  },
                        { id: 'cv',           label: 'Curriculum Vitae (CV)',         wajib: true  },
                        { id: 'foto_3x4',     label: 'Pas Foto 3×4 (2 lembar)',      wajib: true  },
                        { id: 'ktp',          label: 'Fotokopi KTP',                 wajib: true  },
                        { id: 'surat_sehat',  label: 'Surat Keterangan Sehat',       wajib: true  },
                        { id: 'sertifikat',   label: 'Sertifikat P3K / Kesehatan',   wajib: false }
                    ],
                    bodySurat: (nama, skills) =>
                        `Dengan hormat,\n\nSaya ${nama}, mengajukan diri untuk posisi ` +
                        `**Asisten Administrasi Klinik (Part-Time)** di Balai Pengobatan ` +
                        `yang Dokter pimpin.\n\n` +
                        `Saya memiliki kepedulian tinggi terhadap kesehatan masyarakat ` +
                        `dan kemampuan administrasi yang baik. ` +
                        `${skills ? skills + '. ' : ''}` +
                        `Saya siap bekerja dengan profesional dan menjaga privasi pasien.\n\n` +
                        `Atas kepercayaan Dokter, saya haturkan terima kasih.\n\nHormat saya,\n${nama}`,
                    info: 'Jam kerja 15:00–19:00. Butuh Surat Sehat. Upah tertinggi di antara part-time.',
                    rewardJobKey: 'parttime_klinik'
                }
            };

            // --- STATE MINIGAME LAMARAN ---
            let lamaranState = {
                step: 1,           // 1=pilih lowongan, 2=isi surat, 3=lampiran, 4=preview/cetak
                targetId: null,    // ID lowongan yang dipilih
                namaPerlamar: '',
                keahlian: '',
                alasan: '',
                lampiran: {},      // { ijazah: true, cv: false, ... }
                hasilAmplop: null  // item ID amplop yang dihasilkan
            };

            // --- BUKA MINIGAME DARI MEJA BELAJAR ---
            function openLamaranMinigame(targetJobId) {
                lamaranState = { step: 1, targetId: targetJobId || null, namaPerlamar: STATE.player.name || 'Pemain', keahlian: '', alasan: '', lampiran: {}, hasilAmplop: null, susunProgress: 0, susunSelected: [], susunShuffled: null, susunFeedback: '' };
                const el = document.getElementById('lamaran-minigame');
                el.style.display = 'flex';
                // FIX SCROLL HP: aktifkan touch scroll saat modal terbuka
                el.style.touchAction = 'pan-y';
                el.style.overscrollBehavior = 'contain';
                el.scrollTop = 0;
                STATE.screen = 'minigame';
                renderLamaranStep();
            }

            function closeLamaranMinigame() {
                document.getElementById('lamaran-minigame').style.display = 'none';
                STATE.screen = 'play';
                lamaranState = { step: 1, targetId: null, namaPerlamar: '', keahlian: '', alasan: '', lampiran: {}, hasilAmplop: null, susunProgress: 0, susunSelected: [], susunShuffled: null, susunFeedback: '' };
            }

            function renderLamaranStep() {
                const box = document.getElementById('lamaran-box-inner');
                const step = lamaranState.step;

                const progressHTML = [1,2,3,4,5].map(s => {
                    const cls = s < step ? 'done' : s === step ? 'active' : 'inactive';
                    const icons = ['','📋','✍️','🧩','📎','📨'];
                    return `<div class="lamaran-step-dot ${cls}" title="Langkah ${s}">${icons[s]}</div>`;
                }).join('');

                const headerHTML = `
                    <div class="lamaran-header">📝 BUAT SURAT LAMARAN KERJA</div>
                    <div class="lamaran-progress">${progressHTML}</div>
                    <div class="lamaran-step-badge">Langkah ${step} dari 5</div>
                `;

                if (step === 1) renderStep1(box, headerHTML);
                else if (step === 2) renderStep2(box, headerHTML);
                else if (step === 3) renderStep3(box, headerHTML);
                else if (step === 4) renderStep4(box, headerHTML);
                else if (step === 5) renderStep5(box, headerHTML);
            }

            // STEP 1 — Pilih Lowongan
            function renderStep1(box, header) {
                const p = STATE.player;
                const cards = Object.values(LOWONGAN_DB).map(job => {
                    const isSelected = lamaranState.targetId === job.id;
                    // Cek apakah sudah punya amplop untuk lowongan ini
                    const amplopId = 'amplop_' + job.id;
                    const sudahPunya = (p.inventory[amplopId] || 0) > 0;
                    const metReqs = job.syaratLampiran.filter(s => s.wajib).every(s => (p.inventory[s.id] || 0) > 0);
                    return `
                    <div class="lowongan-card ${isSelected ? 'selected' : ''}" onclick="lamaranState.targetId='${job.id}'; renderLamaranStep();">
                        <h5>${job.nama}</h5>
                        <div class="req-list">
                            <b>Posisi:</b> ${job.posisi}<br>
                            <b>Info:</b> ${job.info}<br>
                            <b>Dokumen Wajib:</b> ${job.syaratLampiran.filter(s=>s.wajib).map(s=>`<span class="req-badge ${(p.inventory[s.id]||0)>0?'met':'unmet'}">${s.label}</span>`).join('')}
                            ${sudahPunya ? '<br><span style="color:#16a34a;font-weight:700;">✅ Amplop sudah dibuat!</span>' : ''}
                        </div>
                    </div>`;
                }).join('');

                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>📋 Pilih Lowongan Pekerjaan</h4>
                        <p style="font-size:11px;color:#78350f;margin:0 0 8px 0;">Pilih satu lowongan untuk membuat surat lamaran. Setiap lowongan membutuhkan dokumen berbeda!</p>
                        ${cards}
                    </div>
                    <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin-top:6px;">
                        💡 <b>Tips:</b> Cek dulu dokumen wajib yang kamu miliki (hijau = sudah ada, merah = belum).<br>
                        Dokumen seperti ijazah, CV, dan KTP harus ada di tas (inventory) sebelum bisa dilampirkan!
                    </div>
                    <button class="lamaran-btn" onclick="goLamaranStep2()" ${lamaranState.targetId ? '' : 'disabled style="opacity:0.5"'}>
                        Lanjut: Tulis Surat →
                    </button>
                    <button class="lamaran-btn-sec" onclick="closeLamaranMinigame()">Batal / Keluar</button>
                `;
            }

            function goLamaranStep2() {
                if (!lamaranState.targetId) return;
                lamaranState.step = 2;
                renderLamaranStep();
            }

            // STEP 2 — Isi Badan Surat
            function renderStep2(box, header) {
                const job = LOWONGAN_DB[lamaranState.targetId];
                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>✍️ Isi Identitas Pelamar</h4>
                        <div class="lamaran-field">
                            <label>Nama Lengkap *</label>
                            <input type="text" id="lm-nama" maxlength="30" placeholder="Nama lengkapmu..." value="${lamaranState.namaPerlamar}" oninput="lamaranState.namaPerlamar=this.value">
                        </div>
                        <div class="lamaran-field">
                            <label>Keahlian / Pengalaman</label>
                            <input type="text" id="lm-skill" maxlength="60" placeholder="Contoh: bisa komputer, pernah magang, dll" value="${lamaranState.keahlian}" oninput="lamaranState.keahlian=this.value">
                        </div>
                        <div class="lamaran-field">
                            <label>Alasan Melamar *</label>
                            <textarea id="lm-alasan" maxlength="120" placeholder="Mengapa kamu melamar di tempat ini?" oninput="lamaranState.alasan=this.value">${lamaranState.alasan}</textarea>
                        </div>
                    </div>
                    <div class="lamaran-section">
                        <h4>📌 Ditujukan Kepada</h4>
                        <div style="font-size:11px;color:#78350f;white-space:pre-wrap;line-height:1.6;">${job.tujuan}</div>
                        <div style="font-size:11px;margin-top:6px;"><b>Perihal:</b> ${job.perihal}</div>
                    </div>
                    <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin-top:6px;">
                        💡 <b>Tips Menulis Surat Lamaran:</b><br>
                        • Gunakan bahasa formal dan sopan<br>
                        • Sebutkan posisi yang dilamar dengan jelas<br>
                        • Jelaskan kemampuan yang relevan dengan pekerjaan<br>
                        • Tuliskan alasan yang tulus dan spesifik
                    </div>
                    <button class="lamaran-btn" onclick="goLamaranStep3()">Lanjut: Susun Kalimat Surat →</button>
                    <button class="lamaran-btn-sec" onclick="lamaranState.step=1;renderLamaranStep()">← Kembali</button>
                `;
            }

            function goLamaranStep3() {
                if (!lamaranState.namaPerlamar.trim()) { showToast('Nama tidak boleh kosong!'); return; }
                if (!lamaranState.alasan.trim()) { showToast('Alasan melamar tidak boleh kosong!'); return; }
                lamaranState.step = 3;
                lamaranState.susunSelesai = false;
                lamaranState.susunSelected = [];
                renderLamaranStep();
            }

            // STEP 3 — Susun Kalimat Surat Lamaran

            // Data susun kalimat per level kesulitan
            const SUSUN_SOAL = [
                {
                    soal: ['Dengan', 'hormat,', 'saya', 'bermaksud', 'melamar', 'pekerjaan', 'di', 'perusahaan', 'Bapak/Ibu.'],
                    jawaban: 'Dengan hormat, saya bermaksud melamar pekerjaan di perusahaan Bapak/Ibu.',
                    hint: '💡 Kalimat pembuka surat lamaran yang formal dan sopan.'
                },
                {
                    soal: ['Saya', 'memiliki', 'kemampuan', 'yang', 'sesuai', 'dengan', 'persyaratan', 'yang', 'Bapak/Ibu', 'butuhkan.'],
                    jawaban: 'Saya memiliki kemampuan yang sesuai dengan persyaratan yang Bapak/Ibu butuhkan.',
                    hint: '💡 Kalimat yang menunjukkan kesesuaian kemampuan dengan kebutuhan perusahaan.'
                },
                {
                    soal: ['Besar', 'harapan', 'saya', 'untuk', 'dapat', 'bergabung', 'dan', 'berkontribusi', 'di', 'perusahaan', 'ini.'],
                    jawaban: 'Besar harapan saya untuk dapat bergabung dan berkontribusi di perusahaan ini.',
                    hint: '💡 Kalimat penutup yang menunjukkan antusiasme dan motivasi.'
                }
            ];

            let susunCurrentSoal = 0;

            function renderStep3(box, header) {
                const totalSoal = SUSUN_SOAL.length;
                const soalIdx = lamaranState.susunProgress || 0;

                if (soalIdx >= totalSoal) {
                    // Semua soal selesai
                    box.innerHTML = header + `
                        <div class="lamaran-section" style="text-align:center;">
                            <h4>🎉 Susun Kalimat Selesai!</h4>
                            <div style="font-size:36px;margin:10px 0;">✅</div>
                            <p style="font-size:12px;color:#16a34a;font-weight:700;">Kamu berhasil menyusun semua kalimat surat lamaran dengan benar!</p>
                            <p style="font-size:11px;color:#78350f;">Kalimat yang runtut dan sopan membuat surat lamaranmu lebih profesional dan mudah diterima HRD.</p>
                        </div>
                        <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin:6px 0;">
                            💡 <b>Fakta:</b> Surat lamaran yang terstruktur dengan baik meningkatkan peluang dipanggil interview hingga 3x lipat!
                        </div>
                        <button class="lamaran-btn" onclick="goLamaranStep4()">Lanjut: Lampirkan Dokumen →</button>
                        <button class="lamaran-btn-sec" onclick="lamaranState.step=2;renderLamaranStep()">← Kembali</button>
                    `;
                    return;
                }

                const soal = SUSUN_SOAL[soalIdx];
                if (!lamaranState.susunSelected) lamaranState.susunSelected = [];

                // Acak kata-kata
                if (!lamaranState.susunShuffled || lamaranState.susunShuffledIdx !== soalIdx) {
                    lamaranState.susunShuffled = [...soal.soal].sort(() => Math.random() - 0.5);
                    lamaranState.susunShuffledIdx = soalIdx;
                    lamaranState.susunSelected = [];
                    lamaranState.susunFeedback = '';
                }

                const selected = lamaranState.susunSelected || [];
                const usedSet = new Set(selected.map((w,i) => i + '_' + w));

                // Build result area
                const resultChips = selected.map((w, i) => 
                    `<span class="susun-chip" onclick="susunRemoveWord(${i})">×${w}</span>`
                ).join(' ');

                // Build word pool
                let tempUsed = [...selected];
                const wordChips = lamaranState.susunShuffled.map((w, i) => {
                    const idx = tempUsed.indexOf(w);
                    let isUsed = false;
                    if (idx !== -1) { tempUsed.splice(idx, 1); isUsed = true; }
                    return `<span class="susun-word-chip ${isUsed ? 'used' : ''}" onclick="susunAddWord('${w.replace(/'/g, "\\'")}', ${i})">${w}</span>`;
                }).join('');

                const feedbackHtml = lamaranState.susunFeedback ? 
                    `<div class="susun-feedback" style="background:${lamaranState.susunFeedback.ok ? '#dcfce7;color:#166534' : '#fee2e2;color:#991b1b'}">${lamaranState.susunFeedback.msg}</div>` : '';

                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>🧩 Susun Kalimat Surat Lamaran — Soal ${soalIdx + 1} dari ${totalSoal}</h4>
                        <p style="font-size:11px;color:#78350f;margin:0 0 8px 0;">
                            Ketuk kata-kata di bawah untuk menyusun kalimat yang benar dan sopan!<br>
                            Ketuk kata di kalimat (atas) untuk menghapusnya.
                        </p>
                        <div style="font-size:11px;font-weight:700;color:#78350f;margin-bottom:4px;">✍️ Kalimatmu:</div>
                        <div class="susun-result-area" style="${selected.length === 0 ? 'color:#aaa;font-size:11px;font-weight:400;' : ''}">
                            ${selected.length === 0 ? 'Ketuk kata di bawah untuk mulai menyusun...' : resultChips}
                        </div>
                        <div style="font-size:11px;font-weight:700;color:#78350f;margin:8px 0 4px 0;">📦 Kata-kata tersedia:</div>
                        <div class="susun-word-pool">${wordChips}</div>
                        ${feedbackHtml}
                        <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:6px;margin-top:6px;">${soal.hint}</div>
                    </div>
                    <button class="lamaran-btn" onclick="susunCekJawaban()">✅ Cek Jawaban</button>
                    <button class="lamaran-btn-sec" onclick="susunReset()">🔄 Susun Ulang</button>
                    <button class="lamaran-btn-sec" onclick="lamaranState.step=2;renderLamaranStep()">← Kembali</button>
                `;
            }

            function susunAddWord(word, poolIdx) {
                if (!lamaranState.susunSelected) lamaranState.susunSelected = [];
                lamaranState.susunSelected.push(word);
                lamaranState.susunFeedback = '';
                renderLamaranStep();
            }

            function susunRemoveWord(selectedIdx) {
                if (!lamaranState.susunSelected) return;
                lamaranState.susunSelected.splice(selectedIdx, 1);
                lamaranState.susunFeedback = '';
                renderLamaranStep();
            }

            function susunReset() {
                lamaranState.susunSelected = [];
                lamaranState.susunShuffled = null;
                lamaranState.susunFeedback = '';
                renderLamaranStep();
            }

            function susunCekJawaban() {
                const soalIdx = lamaranState.susunProgress || 0;
                const soal = SUSUN_SOAL[soalIdx];
                const selected = lamaranState.susunSelected || [];
                const jawabanUser = selected.join(' ');
                if (jawabanUser === soal.jawaban) {
                    lamaranState.susunFeedback = { ok: true, msg: '🎉 Benar! Kalimat sudah tepat dan sopan!' };
                    lamaranState.susunProgress = soalIdx + 1;
                    gainExp(5);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    renderLamaranStep();
                } else if (selected.length === 0) {
                    showToast('Susun kalimatnya dulu!');
                } else {
                    lamaranState.susunFeedback = { ok: false, msg: '❌ Belum tepat. Perhatikan urutan dan tanda baca! Coba lagi.' };
                    renderLamaranStep();
                }
            }

            function goLamaranStep4() {
                lamaranState.step = 4;
                renderLamaranStep();
            }

            // STEP 4 — Lampiran Dokumen
            function renderStep4(box, header) {
                const job = LOWONGAN_DB[lamaranState.targetId];
                const p = STATE.player;

                const checkItems = job.syaratLampiran.map(syarat => {
                    const dimiliki = (p.inventory[syarat.id] || 0) > 0;
                    const checked = lamaranState.lampiran[syarat.id] || false;
                    const isMissing = syarat.wajib && !dimiliki;
                    return `
                    <div class="lamaran-checkbox-row ${isMissing && checked ? 'missing' : ''} ${syarat.wajib ? 'required' : ''}">
                        <input type="checkbox" id="cb_${syarat.id}"
                            ${checked ? 'checked' : ''}
                            ${!dimiliki ? 'disabled' : ''}
                            onchange="lamaranState.lampiran['${syarat.id}']=this.checked; renderLamaranStep();">
                        <span>${syarat.label}${syarat.wajib ? '' : ' (Opsional)'}
                            ${dimiliki ? ' <span style="color:#16a34a;">✅ Ada di tas</span>' : ' <span style="color:#dc2626;">❌ Belum ada</span>'}
                        </span>
                    </div>`;
                }).join('');

                // Cek dokumen wajib sudah semua dicentang
                const wajibOk = job.syaratLampiran
                    .filter(s => s.wajib)
                    .every(s => lamaranState.lampiran[s.id] && (p.inventory[s.id] || 0) > 0);

                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>📎 Lampiran Dokumen</h4>
                        <p style="font-size:11px;color:#78350f;margin:0 0 8px 0;">
                            Centang dokumen yang akan kamu lampirkan. Dokumen bertanda * <b>wajib</b> disertakan!
                        </p>
                        ${checkItems}
                    </div>
                    <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin:6px 0;">
                        💡 <b>Cara mendapatkan dokumen:</b><br>
                        📄 <b>Ijazah</b> → Otomatis dimiliki setelah lulus sekolah<br>
                        📋 <b>CV</b> → Buat di Meja Belajar (menu "Buat CV")<br>
                        🪪 <b>KTP</b> → Beli di Kantor Kelurahan / Merchant<br>
                        📸 <b>Foto 3×4</b> → Beli di Merchant (item "Pas Foto")<br>
                        🏥 <b>Surat Sehat</b> → Minta ke Dr. Budi di Klinik<br>
                        📜 <b>SKCK</b> → Minta ke Pak Satpam / Kantor Desa
                    </div>
                    ${!wajibOk ? '<div style="background:#fee2e2;border-radius:8px;padding:8px;font-size:11px;color:#dc2626;margin:4px 0;">⚠️ Masih ada dokumen WAJIB yang belum dilampirkan atau belum ada di tas!</div>' : ''}
                    <button class="lamaran-btn" onclick="goLamaranStep5()" ${wajibOk ? '' : 'disabled style="opacity:0.5"'}>
                        Lanjut: Preview & Cetak Amplop →
                    </button>
                    <button class="lamaran-btn-sec" onclick="lamaranState.step=2;renderLamaranStep()">← Kembali</button>
                `;
            }

            // STEP 5 — Preview & Cetak Amplop
            function goLamaranStep5() {
                const job = LOWONGAN_DB[lamaranState.targetId];
                const p = STATE.player;
                const wajibOk = job.syaratLampiran.filter(s => s.wajib).every(s => lamaranState.lampiran[s.id] && (p.inventory[s.id] || 0) > 0);
                if (!wajibOk) { showToast('Lengkapi dokumen wajib dulu!'); return; }
                lamaranState.step = 5;
                renderLamaranStep();
            }

            function renderStep5(box, header) {
                const job = LOWONGAN_DB[lamaranState.targetId];
                const nama = lamaranState.namaPerlamar || STATE.player.name || 'Pemain';
                const suratBody = job.bodySurat(nama, lamaranState.keahlian);
                const lampiranList = job.syaratLampiran
                    .filter(s => lamaranState.lampiran[s.id])
                    .map(s => `  • ${s.label}`)
                    .join('\n');

                box.innerHTML = header + `
                    <div class="lamaran-section">
                        <h4>📄 Preview Surat Lamaran</h4>
                        <div class="lamaran-preview">${suratBody.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')}</div>
                    </div>
                    <div class="lamaran-section">
                        <h4>📎 Lampiran yang Disertakan</h4>
                        <div style="font-size:11px;white-space:pre-wrap;color:#78350f;">${lampiranList || '(Tidak ada)'}</div>
                    </div>
                    <div style="font-size:10px;color:#78350f;background:#fef3c7;border-radius:8px;padding:8px;margin:6px 0;">
                        💡 <b>Ingat!</b> Amplop lamaran ini hanya berlaku untuk:<br>
                        <b>${job.nama}</b><br>
                        Jika diberikan ke tempat lain, lamaran akan <b>ditolak</b>!
                    </div>
                    <div class="lamaran-envelope">📨</div>
                    <button class="lamaran-btn" onclick="cetakAmplop()">
                        ✅ Cetak & Masukkan ke Tas!
                    </button>
                    <button class="lamaran-btn-sec" onclick="lamaranState.step=4;renderLamaranStep()">← Kembali Edit</button>
                    <button class="lamaran-btn-sec" onclick="closeLamaranMinigame()">Batal</button>
                `;
            }

            function cetakAmplop() {
                const job = LOWONGAN_DB[lamaranState.targetId];
                const p = STATE.player;
                const amplopId = 'amplop_' + job.id;

                // Kurangi dokumen wajib dari inventory (digunakan)
                job.syaratLampiran.forEach(s => {
                    if (lamaranState.lampiran[s.id] && (p.inventory[s.id] || 0) > 0) {
                        p.inventory[s.id]--;
                        if (p.inventory[s.id] <= 0) delete p.inventory[s.id];
                    }
                });

                // Tambah amplop ke inventory
                addItem(amplopId, 1);
                gainExp(20);

                // Simpan metadata amplop
                if (!p.amplopMeta) p.amplopMeta = {};
                p.amplopMeta[amplopId] = {
                    targetNpcId: job.npcId,
                    targetNama: job.nama,
                    pelamar: lamaranState.namaPerlamar,
                    rewardJobKey: job.rewardJobKey,
                    lampiran: { ...lamaranState.lampiran }
                };

                closeLamaranMinigame();
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                showToast(`📨 Amplop lamaran "${job.posisi}" masuk ke tas!`);
                setTimeout(() => {
                    showDialogue('📨 AMPLOP LAMARAN SELESAI!',
                        `Surat lamaranmu untuk **${job.nama}** sudah selesai dan masuk ke tas!\n\n` +
                        `📌 SELANJUTNYA:\nBawa amplop ini langsung ke lokasi kerja dan serahkan ke bos/pemiliknya.\n\n` +
                        `⚠️ Jika kamu memberikan amplop ini ke tempat yang salah, lamaran akan DITOLAK.\n\n` +
                        `💡 Cek tas (inventory) kamu — amplop ada di sana sebagai item 📨`,
                        [{ text: 'Siap! Aku akan melamar!', action: closeDialogue }], 'images/buku.png'
                    );
                }, 400);
            }

            // --- CEK AMPLOP SAAT MELAMAR KE NPC ---
            function submitAmplop(npcId) {
                const p = STATE.player;
                if (!p.amplopMeta) p.amplopMeta = {};

                // Cari amplop yang dimiliki player
                const amplopKeys = Object.keys(p.inventory).filter(k => k.startsWith('amplop_') && (p.inventory[k] || 0) > 0);

                if (amplopKeys.length === 0) {
                    showDialogue('📋 TIDAK ADA LAMARAN',
                        `Kamu belum punya surat lamaran!\n\n` +
                        `Buat dulu di **Meja Belajar** di rumahmu:\n` +
                        `1. Dekati meja belajar\n2. Pilih "📝 Buat Surat Lamaran"\n3. Isi dan lengkapi dokumen\n4. Cetak amplop\n5. Bawa ke sini!\n\n` +
                        `💡 Dokumen yang perlu disiapkan:\n• Ijazah SMA/SMK\n• CV\n• Pas Foto 3×4\n• KTP`,
                        [{ text: 'Mengerti, aku siapkan dulu', action: closeDialogue }], 'images/buku.png'
                    );
                    return;
                }

                // Cari amplop yang match dengan NPC ini
                const matchAmplop = amplopKeys.find(k => {
                    const meta = p.amplopMeta[k];
                    return meta && meta.targetNpcId === npcId;
                });

                if (matchAmplop) {
                    // AMPLOP YANG TEPAT!
                    const meta = p.amplopMeta[matchAmplop];
                    p.inventory[matchAmplop]--;
                    if (p.inventory[matchAmplop] <= 0) delete p.inventory[matchAmplop];

                    // Tentukan reward berdasarkan jenis pekerjaan
                    const isPartTime = meta.rewardJobKey && meta.rewardJobKey.startsWith('parttime_');
                    if (isPartTime) {
                        // Part-time: langsung terima & simpan
                        const ptKey = meta.rewardJobKey.replace('parttime_', '');
                        p.partTimeJob = ptKey === 'bengkel' ? 'bengkel' : ptKey === 'jahit' ? 'penjahit' : 'klinik';
                        p.partTimeStatus = 'working';
                        p.partTimeShiftStarted = false;
                        gainExp(30);
                        closeDialogue();
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        setTimeout(() => {
                            showDialogue('🎉 LAMARAN DITERIMA!',
                                `Selamat! Lamaranmu diterima dengan dokumen yang lengkap dan surat yang rapi!\n\n` +
                                `💼 Posisi: ${meta.targetNama}\n⏰ Jam Kerja: 15:00–19:00\n\n` +
                                `Mulai besok, datanglah ke sini sebelum jam 17:00 untuk absen masuk.\n\n` +
                                `💡 Memiliki surat lamaran yang baik meningkatkan peluang diterima kerja secara signifikan di dunia nyata.`,
                                [{ text: 'Terima kasih! Aku semangat!', action: closeDialogue }],
                                (SPOUSE_IMG[npcId] || 'images/boy.png')
                            );
                        }, 300);
                    } else {
                        // Kerja full-time di Merchant
                        p.jobStatus = 'employed';
                        p.bossReputation = 50;
                        gainExp(50);
                        closeDialogue();
                        setTimeout(() => {
                            playCutsceneJobAccepted(() => {
                                showToast('✅ Selamat datang di dunia kerja! Datang jam 08:00 besok.');
                                if (typeof updateMentorBubble === 'function') updateMentorBubble();
                            });
                        }, 300);
                    }
                } else {
                    // Ada amplop, tapi untuk tempat lain
                    const wrongAmplop = p.amplopMeta[amplopKeys[0]];
                    const wrongTarget = wrongAmplop ? wrongAmplop.targetNama : 'tempat lain';

                    showDialogue('❌ LAMARAN SALAH TEMPAT',
                        `Maaf, surat lamaranmu tidak sesuai dengan posisi di sini!\n\n` +
                        `📨 Amplopmu ditujukan untuk:\n**${wrongTarget}**\n\n` +
                        `Tapi kamu menyerahkannya ke:\n**lokasi ini**\n\n` +
                        `❌ Lamaran DITOLAK!\n\n` +
                        `💡 Surat lamaran harus ditujukan spesifik ke tempat yang dilamar. ` +
                        `Di dunia nyata, mengirim CV ke posisi yang tidak sesuai juga akan langsung ditolak.\n\n` +
                        `📌 Bawa amplopmu ke tempat yang tepat, atau buat surat baru di Meja Belajar.`,
                        [{ text: 'Oh maaf, salah tempat...', action: closeDialogue }],
                        (SPOUSE_IMG[npcId] || 'images/boy.png')
                    );
                }
            }

            // --- TAMPILKAN MENU LAMARAN DI MEJA BELAJAR ---
            function openStudyDeskLamaranMenu() {
                const p = STATE.player;
                const amplopKeys = Object.keys(p.inventory || {}).filter(k => k.startsWith('amplop_') && (p.inventory[k] || 0) > 0);
                const amplopList = amplopKeys.map(k => {
                    const meta = p.amplopMeta && p.amplopMeta[k];
                    return meta ? `📨 ${meta.targetNama}` : `📨 ${k}`;
                }).join('\n') || 'Belum ada';

                // Cek apakah punya dokumen dasar
                const hasIjazah = (p.inventory['ijazah'] || 0) > 0;
                const hasCV     = (p.inventory['cv']     || 0) > 0;

                // TUTORIAL OTOMATIS — tampil sekali saat pertama kali buka menu ini
                if (!p.lamaranTutorialSeen) {
                    p.lamaranTutorialSeen = true;
                    showDialogue('📚 PANDUAN MELAMAR KERJA — PERTAMA KALI',
                        `Hei! Sepertinya ini pertama kalimu mau buat surat lamaran kerja. Yuk kenalan dulu!\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━\n` +
                        `📋 DOKUMEN YANG DIBUTUHKAN:\n\n` +
                        `✅ Ijazah SMA/SMK — kamu sudah punya otomatis\n` +
                        `📋 CV — dibuat di meja ini (500 G)\n` +
                        `📸 Pas Foto 3×4 — beli di:\n` +
                        `   🏪 Merchant (Pak Hendra) • 300 G\n` +
                        `   💻 Warnet (Operator) • 300 G\n` +
                        `🪪 Fotokopi KTP — beli di:\n` +
                        `   🏪 Merchant (Pak Hendra) • 500 G\n` +
                        `   💻 Warnet (Operator) • 500 G\n` +
                        `🚔 SKCK (opsional) — beli di Merchant • 2.000 G\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━\n` +
                        `📝 ALUR MELAMAR KERJA:\n\n` +
                        `1️⃣ Beli dokumen yang kurang (Merchant/Warnet)\n` +
                        `2️⃣ Buat CV di meja ini (500 G)\n` +
                        `3️⃣ Buat Surat Lamaran → jadi Amplop 📨\n` +
                        `4️⃣ Bawa amplop ke tempat kerja yang dituju\n` +
                        `5️⃣ Serahkan ke Bos / NPC yang membuka lowongan\n\n` +
                        `💡 Cari info lowongan dulu di Papan Desa!`,
                        [
                            { text: '🛒 Cek Dokumenku Sekarang', action: () => { closeDialogue(); openStudyDeskLamaranMenu(); } },
                            { text: '✅ Paham, Lanjut Buat Lamaran', action: () => { closeDialogue(); openStudyDeskLamaranMenu(); } }
                        ], 'images/buku.png'
                    );
                    return;
                }

                showDialogue('📝 BUAT SURAT LAMARAN KERJA',
                    `Di meja ini kamu bisa membuat surat lamaran kerja secara lengkap!\n\n` +
                    `📨 Amplop lamaranmu saat ini:\n${amplopList}\n\n` +
                    `📌 STATUS DOKUMEN:\n` +
                    `${hasIjazah ? '✅' : '❌'} Ijazah SMA/SMK\n` +
                    `${hasCV     ? '✅' : '❌'} Curriculum Vitae (CV)\n\n` +
                    `💡 Dokumen yang kurang (Pas Foto, KTP, SKCK) bisa dibeli di:\n` +
                    `🏪 Merchant (Pak Hendra) atau 💻 Warnet`,
                    [
                        { text: '📝 Buat Surat Lamaran Baru', action: () => { closeDialogue(); openLamaranMinigame(); }},
                        { text: '📋 Buat CV Terlebih Dahulu', action: () => { closeDialogue(); openCVMaker(); }},
                        { text: '❓ Panduan Melamar Kerja', action: () => showPanduanLamaran() },
                        { text: 'Tutup', action: closeDialogue }
                    ], 'images/buku.png'
                );
            }

            function showPanduanLamaran() {
                showDialogue('📚 PANDUAN MELAMAR KERJA',
                    `🎓 DOKUMEN YANG BIASANYA DIMINTA:\n\n` +
                    `📄 Ijazah SMA/SMK — bukti pendidikan terakhir\n` +
                    `📋 CV (Curriculum Vitae) — riwayat hidup & keahlian\n` +
                    `📸 Pas Foto 3×4 — foto formal terbaru\n` +
                    `🪪 KTP — identitas resmi\n` +
                    `🏥 Surat Sehat — dari dokter/puskesmas\n` +
                    `🚔 SKCK — catatan kepolisian bersih\n` +
                    `🏆 Sertifikat — keahlian tambahan\n\n` +
                    `✍️ TIPS SURAT LAMARAN:\n` +
                    `• Tulis tangan atau ketik rapi & formal\n` +
                    `• Sebutkan posisi yang dilamar dengan jelas\n` +
                    `• Jangan salah menulis nama perusahaan!\n` +
                    `• Lampiran harus lengkap sesuai yang diminta\n\n` +
                    `⚠️ KESALAHAN UMUM:\n` +
                    `• Melamar posisi A tapi kirim ke perusahaan B\n` +
                    `• Foto tidak formal (selfie, latar tidak jelas)\n` +
                    `• Lampiran tidak lengkap`,
                    [{ text: 'Paham!', action: () => openStudyDeskLamaranMenu() }], 'images/buku.png'
                );
            }

            function openCVMaker() {
                const p = STATE.player;
                if ((p.inventory['cv'] || 0) > 0) {
                    showToast('Kamu sudah punya CV di tas!');
                    openStudyDeskLamaranMenu();
                    return;
                }
                showDialogue('📋 BUAT CURRICULUM VITAE',
                    `CV (Curriculum Vitae) adalah dokumen yang berisi:\n\n` +
                    `👤 Data Pribadi: Nama, Tempat/Tanggal Lahir, Alamat\n` +
                    `🎓 Riwayat Pendidikan: Nama sekolah & tahun lulus\n` +
                    `💼 Pengalaman Kerja: (jika ada)\n` +
                    `🛠️ Keahlian: Skill yang dikuasai\n` +
                    `🏆 Prestasi: Penghargaan / sertifikat\n\n` +
                    `Biaya membuat CV: 500 G (biaya fotokopi & cetak)\n` +
                    `Uangmu: ${p.money.toLocaleString()} G`,
                    [
                        { text: '✅ Buat CV Sekarang (500 G)', action: () => {
                            if (p.money >= 500) {
                                p.money -= 500;
                                addItem('cv', 1);
                                p.int = (p.int || 0) + 1;
                                closeDialogue();
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                showToast('📋 CV berhasil dibuat! INT +1. CV masuk ke tas.');
                            } else {
                                showToast('Uang tidak cukup! Butuh 500 G.');
                            }
                        }},
                        { text: 'Kembali', action: () => openStudyDeskLamaranMenu() }
                    ], 'images/buku.png'
                );
            }

            function openDocumentShop(npc) {
                const p = STATE.player;
                const imgSrc = npc ? npc.imgSrc : 'images/job.png';
                const docs = [
                    { id: 'foto_3x4', name: '📸 Pas Foto 3×4 (2 lembar)', price: 300 },
                    { id: 'ktp',      name: '🪪 Fotokopi KTP',             price: 500 },
                    { id: 'skck',     name: '🚔 SKCK (Surat Kelakuan Baik)',price: 2000 },
                    { id: 'sertifikat',name:'🏆 Sertifikat Keahlian Umum', price: 5000 },
                ];
                const opts = docs.map(d => ({
                    text: `${d.name} — ${d.price.toLocaleString()} G`,
                    action: () => {
                        if (p.money >= d.price) {
                            p.money -= d.price;
                            addItem(d.id, 1);
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            showToast(`✅ ${d.name.replace(/^[^\s]+\s/,'')} masuk ke tas!`);
                            openDocumentShop(npc);
                        } else {
                            showToast(`Uang tidak cukup! Butuh ${d.price.toLocaleString()} G`);
                        }
                    }
                }));
                opts.push({ text: 'Kembali', action: () => npc ? interactNPC(npc) : closeDialogue() });

                showDialogue('🪪 TOKO DOKUMEN',
                    `📋 Beli dokumen untuk keperluan lamaran kerja.\nUangmu: ${p.money.toLocaleString()} G\n\n💡 Dokumen ini diperlukan saat membuat surat lamaran di Meja Belajar.`,
                    opts, imgSrc
                );
            }


            // ═══════════════════════════════════════════════════════════
            // 🎬 CINEMATIC ENGINE — Visual Storytelling System
            // ═══════════════════════════════════════════════════════════

            const CinematicEngine = {
                _rafId: null,
                _particleCtx: null,
                _particles: [],
                _theme: {},

                // ── TEMA VISUAL PER MOMEN ────────────────────────────────
                themes: {
                    wedding: {
                        bg: 'linear-gradient(135deg, #1a0533 0%, #3b0764 40%, #7c2d92 100%)',
                        color: '#f9a8d4',
                        chapter: '— Momen Paling Sakral —',
                        particleColors: ['#fce7f3','#f9a8d4','#e879f9','#fbbf24','#ffffff'],
                        particleType: 'hearts',
                    },
                    jobAccepted: {
                        bg: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 50%, #1d4ed8 100%)',
                        color: '#93c5fd',
                        chapter: '— Babak Baru Dimulai —',
                        particleColors: ['#93c5fd','#bfdbfe','#ffffff','#fbbf24'],
                        particleType: 'stars',
                    },
                    divorce: {
                        bg: 'linear-gradient(135deg, #1c0000 0%, #450a0a 50%, #7f1d1d 100%)',
                        color: '#fca5a5',
                        chapter: '— Akhir yang Menyakitkan —',
                        particleColors: ['#fca5a5','#ef4444','#78716c','#44403c'],
                        particleType: 'rain',
                    },
                    graduation: {
                        bg: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
                        color: '#86efac',
                        chapter: '— Hasil Perjuangan —',
                        particleColors: ['#86efac','#fbbf24','#ffffff','#34d399'],
                        particleType: 'stars',
                    },
                    scholarship: {
                        bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0369a1 100%)',
                        color: '#38bdf8',
                        chapter: '— Kerja Keras Terbayar —',
                        particleColors: ['#38bdf8','#7dd3fc','#fbbf24','#ffffff','#bae6fd'],
                        particleType: 'stars',
                    },
                    wisuda: {
                        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)',
                        color: '#fbbf24',
                        chapter: '— Puncak Perjuangan —',
                        particleColors: ['#fbbf24','#fde68a','#ffffff','#86efac','#f9a8d4'],
                        particleType: 'confetti',
                    },
                    bossDefeated: {
                        bg: 'linear-gradient(135deg, #0a0a0a 0%, #1c0533 40%, #6b21a8 80%, #be185d 100%)',
                        color: '#e879f9',
                        chapter: '— Monster Ditaklukkan —',
                        particleColors: ['#e879f9','#fbbf24','#f43f5e','#ffffff','#a855f7'],
                        particleType: 'stars',
                    },
                    gameWin: {
                        bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                        color: '#fde68a',
                        chapter: '— Lima Tahun Berlalu —',
                        particleColors: ['#fde68a','#fbbf24','#ffffff','#86efac','#93c5fd','#f9a8d4'],
                        particleType: 'confetti',
                    },
                    gameOver: {
                        bg: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0f172a 100%)',
                        color: '#94a3b8',
                        chapter: '— Perjalanan Terhenti —',
                        particleColors: ['#475569','#334155','#1e293b','#64748b'],
                        particleType: 'rain',
                    },
                    levelUp: {
                        bg: 'linear-gradient(135deg, #1c1917 0%, #292524 40%, #44403c 70%, #78716c 100%)',
                        color: '#fbbf24',
                        chapter: '— Kamu Semakin Kuat —',
                        particleColors: ['#fbbf24','#fde68a','#ffffff','#fb923c'],
                        particleType: 'stars',
                    },
                    dungeonEnter: {
                        bg: 'linear-gradient(135deg, #000000 0%, #0f0f1a 40%, #1a0a2e 70%, #2d1b4e 100%)',
                        color: '#a78bfa',
                        chapter: '— Zona Berbahaya —',
                        particleColors: ['#a78bfa','#6d28d9','#1e1b4b','#4c1d95'],
                        particleType: 'rain',
                    },
                    legendaryDrop: {
                        bg: 'linear-gradient(135deg, #1a0a00 0%, #431407 40%, #7c2d12 70%, #c2410c 100%)',
                        color: '#fb923c',
                        chapter: '— Item Langka Ditemukan! —',
                        particleColors: ['#fb923c','#fbbf24','#fde68a','#ffffff','#fed7aa'],
                        particleType: 'confetti',
                    },
                    bangkrut: {
                        bg: 'linear-gradient(135deg, #000000 0%, #111827 40%, #1f2937 70%, #374151 100%)',
                        color: '#9ca3af',
                        chapter: '— Titik Terendah —',
                        particleColors: ['#6b7280','#4b5563','#374151','#9ca3af'],
                        particleType: 'rain',
                    },
                    kahyangan: {
                        bg: 'linear-gradient(135deg, #030712 0%, #052e16 25%, #14532d 55%, #0f4c2e 75%, #1a3a2e 100%)',
                        color: '#86efac',
                        chapter: '— Kahyangan Wilis —',
                        particleColors: ['#4ade80','#86efac','#fbbf24','#ffffff','#bfdbfe','#d8b4fe','#6ee7b7'],
                        particleType: 'stars',
                    },
                    portalWilis: {
                        bg: 'linear-gradient(135deg, #0c0a20 0%, #1a0f3d 30%, #2d1b69 60%, #1e3a3a 85%, #052e16 100%)',
                        color: '#a78bfa',
                        chapter: '— Retakan Dimensi —',
                        particleColors: ['#a78bfa','#7c3aed','#4ade80','#ffffff','#86efac'],
                        particleType: 'stars',
                    }
                },

                // ── INIT PARTICLE CANVAS ─────────────────────────────────
                initCanvas() {
                    const canvas = document.getElementById('cs-particles');
                    if (!canvas) return;
                    canvas.width  = window.innerWidth;
                    canvas.height = window.innerHeight;
                    this._particleCtx = canvas.getContext('2d');
                },

                // ── SPAWN PARTICLES ──────────────────────────────────────
                spawnParticles(type, colors) {
                    this._particles = [];
                    const count = type === 'rain' ? 80 : 60;
                    for (let i = 0; i < count; i++) {
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        if (type === 'hearts') {
                            this._particles.push({
                                x: Math.random() * window.innerWidth,
                                y: window.innerHeight + 20,
                                vx: (Math.random() - 0.5) * 1.5,
                                vy: -(1.5 + Math.random() * 2.5),
                                size: 8 + Math.random() * 14,
                                alpha: 0.7 + Math.random() * 0.3,
                                color, type: 'heart',
                                delay: Math.random() * 120
                            });
                        } else if (type === 'stars') {
                            this._particles.push({
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                                vx: (Math.random() - 0.5) * 0.4,
                                vy: (Math.random() - 0.5) * 0.4,
                                size: 2 + Math.random() * 5,
                                alpha: Math.random(),
                                dAlpha: 0.01 + Math.random() * 0.02,
                                color, type: 'star',
                                delay: 0
                            });
                        } else if (type === 'rain') {
                            this._particles.push({
                                x: Math.random() * window.innerWidth,
                                y: -10 - Math.random() * window.innerHeight,
                                vx: 0.5 + Math.random() * 1,
                                vy: 4 + Math.random() * 5,
                                size: 1 + Math.random() * 2,
                                alpha: 0.3 + Math.random() * 0.5,
                                color, type: 'rain',
                                delay: 0
                            });
                        } else if (type === 'confetti') {
                            this._particles.push({
                                x: Math.random() * window.innerWidth,
                                y: -20 - Math.random() * 200,
                                vx: (Math.random() - 0.5) * 3,
                                vy: 2 + Math.random() * 4,
                                size: 6 + Math.random() * 8,
                                rotation: Math.random() * Math.PI * 2,
                                rotSpeed: (Math.random() - 0.5) * 0.2,
                                alpha: 0.8 + Math.random() * 0.2,
                                color, type: 'confetti',
                                delay: Math.random() * 60
                            });
                        }
                    }
                },

                // ── RENDER LOOP ──────────────────────────────────────────
                renderParticles() {
                    const ctx = this._particleCtx;
                    if (!ctx) return;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    this._particles.forEach(p => {
                        if (p.delay > 0) { p.delay--; return; }
                        ctx.save();
                        ctx.globalAlpha = Math.max(0, p.alpha);

                        if (p.type === 'heart') {
                            ctx.fillStyle = p.color;
                            ctx.font = `${p.size}px serif`;
                            ctx.fillText('♥', p.x, p.y);
                            p.x += p.vx;
                            p.y += p.vy;
                            if (p.y < -20) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
                        } else if (p.type === 'star') {
                            ctx.fillStyle = p.color;
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                            ctx.fill();
                            p.alpha += (Math.random() > 0.5 ? 1 : -1) * p.dAlpha;
                            p.alpha = Math.max(0.05, Math.min(1, p.alpha));
                            p.x += p.vx; p.y += p.vy;
                        } else if (p.type === 'rain') {
                            ctx.strokeStyle = p.color;
                            ctx.lineWidth = p.size;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p.x + p.vx * 3, p.y + p.vy * 3);
                            ctx.stroke();
                            p.x += p.vx; p.y += p.vy;
                            if (p.y > window.innerHeight + 10) { p.y = -10; p.x = Math.random() * window.innerWidth; }
                        } else if (p.type === 'confetti') {
                            ctx.save();
                            ctx.translate(p.x, p.y);
                            ctx.rotate(p.rotation);
                            ctx.fillStyle = p.color;
                            ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
                            ctx.restore();
                            p.x += p.vx; p.y += p.vy;
                            p.rotation += p.rotSpeed;
                            p.vy += 0.05; // gravitasi tipis
                            if (p.y > window.innerHeight + 20) {
                                p.y = -20; p.x = Math.random() * window.innerWidth; p.vy = 2 + Math.random() * 4;
                            }
                        }
                        ctx.restore();
                    });

                    this._rafId = requestAnimationFrame(() => this.renderParticles.bind(this)());
                },

                // ── TYPEWRITER NARASI ────────────────────────────────────
                typewrite(el, text, speed = 28, cb) {
                    el.style.opacity = '1';
                    el.innerText = '';
                    let i = 0;
                    const t = setInterval(() => {
                        el.innerText += text[i] || '';
                        i++;
                        if (i >= text.length) { clearInterval(t); if (cb) cb(); }
                    }, speed);
                },

                // ── MAIN PLAY ────────────────────────────────────────────
                play(themeName, slides, onDone) {
                    const theme = this.themes[themeName] || this.themes.wedding;
                    this._theme = theme;
                    this.initCanvas();
                    this.spawnParticles(theme.particleType, theme.particleColors);

                    const layer    = document.getElementById('cutscene-layer');
                    const csBg     = document.getElementById('cs-bg');
                    const csBarT   = document.getElementById('cs-bar-top');
                    const csBarB   = document.getElementById('cs-bar-bottom');
                    const csChapter= document.getElementById('cs-chapter');
                    const csTitle  = document.getElementById('cutscene-text');
                    const csDivider= document.getElementById('cs-divider');
                    const csSub    = document.getElementById('cutscene-sub');
                    const csNarasi = document.getElementById('cs-narasi');

                    if (!layer) { if (onDone) onDone(); return; }

                    // Reset semua elemen
                    [csTitle, csSub, csNarasi, csChapter].forEach(el => {
                        if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.innerText = ''; }
                    });
                    if (csDivider) { csDivider.style.width = '0'; csDivider.style.opacity = '0'; }

                    // Set warna tema ke elemen
                    if (csTitle)   csTitle.style.color   = theme.color;
                    if (csDivider) csDivider.style.background = theme.color;

                    // Tampilkan layer
                    layer.style.display = 'flex';
                    csBg.style.background = theme.bg;
                    requestAnimationFrame(() => { layer.style.opacity = '1'; });

                    // Cinematic bars masuk
                    setTimeout(() => {
                        csBarT.style.height = '60px';
                        csBarB.style.height = '60px';
                    }, 200);

                    // Mulai partikel
                    this.renderParticles();

                    // Jalankan slide sequence
                    this._runSlides(slides, theme, csChapter, csTitle, csDivider, csSub, csNarasi, () => {
                        this._close(layer, csBarT, csBarB, onDone);
                    });
                },

                _runSlides(slides, theme, csChapter, csTitle, csDivider, csSub, csNarasi, onDone) {
                    let idx = 0;
                    const showSlide = () => {
                        if (idx >= slides.length) { onDone(); return; }
                        const slide = slides[idx++];
                        const dur   = slide.dur || 4000;

                        // Chapter label
                        if (csChapter && slide.chapter !== undefined) {
                            csChapter.innerText = slide.chapter || theme.chapter;
                            csChapter.style.opacity = '1';
                        }

                        // Judul (animate in)
                        if (csTitle && slide.title) {
                            csTitle.innerText  = slide.title;
                            csTitle.style.transform = 'translateY(20px)';
                            csTitle.style.opacity   = '0';
                            requestAnimationFrame(() => {
                                csTitle.style.transform = 'translateY(0)';
                                csTitle.style.opacity   = '1';
                            });
                        }

                        // Divider expand
                        setTimeout(() => {
                            if (csDivider) { csDivider.style.width = '180px'; csDivider.style.opacity = '0.6'; }
                        }, 400);

                        // Sub (animate in)
                        if (csSub && slide.sub) {
                            csSub.innerText  = '';
                            csSub.style.transform = 'translateY(10px)';
                            csSub.style.opacity   = '0';
                            setTimeout(() => {
                                csSub.innerText  = slide.sub;
                                csSub.style.transform = 'translateY(0)';
                                csSub.style.opacity   = '1';
                            }, 600);
                        }

                        // Narasi typewriter
                        if (csNarasi && slide.narasi) {
                            csNarasi.innerText = '';
                            csNarasi.style.opacity = '0';
                            setTimeout(() => {
                                this.typewrite(csNarasi, slide.narasi, 30);
                            }, 1000);
                        } else if (csNarasi) {
                            csNarasi.style.opacity = '0';
                            csNarasi.innerText = '';
                        }

                        setTimeout(() => {
                            // Fade out konten sebelum slide berikutnya
                            [csTitle, csSub, csNarasi].forEach(el => {
                                if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(-10px)'; }
                            });
                            if (csDivider) csDivider.style.width = '0';
                            setTimeout(showSlide, 600);
                        }, dur);
                    };
                    showSlide();
                },

                _close(layer, csBarT, csBarB, onDone) {
                    // Tutup bars
                    csBarT.style.height = '0';
                    csBarB.style.height = '0';
                    // Fade out layer
                    setTimeout(() => {
                        layer.style.opacity = '0';
                        setTimeout(() => {
                            layer.style.display = 'none';
                            // Stop particles
                            if (this._rafId) cancelAnimationFrame(this._rafId);
                            this._particles = [];
                            if (this._particleCtx) this._particleCtx.clearRect(0, 0, 9999, 9999);
                            if (onDone) onDone();
                        }, 1500);
                    }, 400);
                }
            };

            // ── CUTSCENE PERNIKAHAN (pengganti cutscene lama) ─────────────
            function playCutsceneWedding(targetName, onDone) {
                const slides = [
                    {
                        chapter: '— Hari yang Paling Ditunggu —',
                        title:   'AKAD NIKAH',
                        sub:     `Dua jiwa, satu ikrar.\nHari ini langit menjadi saksi.`,
                        narasi:  `Di tengah keheningan balai, suara penghulu bergema pelan...\n"Saya terima nikah dan kawinnya..."`,
                        dur: 4500
                    },
                    {
                        chapter: '— Momen yang Tak Terlupakan —',
                        title:   'SAH!',
                        sub:     `${targetName} menggenggam tanganmu.\nAir mata bahagia tak tertahankan.`,
                        narasi:  `Sorak sorai memenuhi ruangan. Bunga-bunga bertaburan dari langit-langit.\nIni bukan akhir — ini adalah awal dari segalanya.`,
                        dur: 4500
                    },
                    {
                        chapter: '— Babak Baru Kehidupan —',
                        title:   'SELAMAT MENEMPUH HIDUP BARU',
                        sub:     `Pernikahan bukan puncak cerita,\nmelainkan halaman pertama babak berikutnya.`,
                        narasi:  `Di dunia nyata, membangun rumah tangga butuh komitmen, komunikasi,\ndan kesiapan finansial. Semoga perjalananmu menjadi inspirasi.`,
                        dur: 5000
                    }
                ];
                CinematicEngine.play('wedding', slides, onDone);
            }

            // ── CUTSCENE DITERIMA KERJA ──────────────────────────────────
            function playCutsceneJobAccepted(onDone) {
                const name  = DataService.user ? DataService.user.name : 'Kamu';
                const slides = [
                    {
                        chapter: '— Keringat yang Terbayar —',
                        title:   'LAMARAN DITERIMA!',
                        sub:     `Kerja keras dan persiapanmu\ntidak sia-sia.`,
                        narasi:  `"${name}, kami terkesan dengan kesungguhanmu."\nSuara Pak Hendra, sang Bos, terdengar tegas namun penuh apresiasi.`,
                        dur: 4500
                    },
                    {
                        chapter: '— Langkah Pertama Karier —',
                        title:   'KARYAWAN BARU',
                        sub:     `Setiap karier besar\ndimulai dari hari pertama kerja.`,
                        narasi:  `Di Indonesia, mendapat pekerjaan pertama adalah pencapaian besar.\nJaga reputasimu, tingkatkan skill, dan buktikan nilaimu setiap hari.`,
                        dur: 4500
                    },
                    {
                        chapter: '— Tantangan Menanti —',
                        title:   'SELAMAT BERGABUNG!',
                        sub:     `Jalur Pekerja terbuka lebar.\nPromosi, kenaikan gaji, dan kepercayaan — semua menunggumu.`,
                        narasi:  `Ingat: pekerjaan bukan hanya tentang gaji,\nmelainkan tentang bagaimana kamu tumbuh sebagai manusia.`,
                        dur: 4500
                    }
                ];
                CinematicEngine.play('jobAccepted', slides, onDone);
            }

            // ── CUTSCENE CERAI / KANDAS ──────────────────────────────────
            function playCutsceneDivorce(spouseName, onDone) {
                const slides = [
                    {
                        chapter: '— Saat Cinta Tak Lagi Cukup —',
                        title:   'BERPISAH',
                        sub:     `Ada luka yang tidak bisa\ndisembuhkan dengan waktu saja.`,
                        narasi:  `${spouseName} menatapmu untuk terakhir kali.\nTidak ada kata-kata yang cukup untuk momen ini.`,
                        dur: 5000
                    },
                    {
                        chapter: '— Pelajaran Berharga —',
                        title:   'SETIAP AKHIR ADALAH AWAL',
                        sub:     `Pernikahan butuh lebih dari sekadar cinta.\nKomunikasi, kepercayaan, dan komitmen adalah pondasinya.`,
                        narasi:  `Di dunia nyata, perceraian adalah salah satu putusan terberat.\nSemoga dari sini, kamu belajar apa yang benar-benar penting.`,
                        dur: 5000
                    }
                ];
                CinematicEngine.play('divorce', slides, onDone);
            }


            // ── CUTSCENE BOSS DUNGEON DIKALAHKAN ─────────────────────────
            function playCutsceneBossDefeated(bossLevel, onDone) {
                const name   = DataService.user ? DataService.user.name : 'Kamu';
                const titles = ['', 'Penjaga Gerbang', 'Raja Kegelapan', 'Iblis Kuno', 'Titan Keabadian', 'RAJA DUNGEON'];
                const bossName = titles[Math.min(bossLevel, 5)] || 'Boss Dungeon';
                const slides = [
                    {
                        chapter: `— Lantai ${bossLevel} Dibersihkan —`,
                        title:   `${bossName.toUpperCase()} DIKALAHKAN!`,
                        sub:     `Deru angin dingin berhenti.\nKegelapan Lantai ${bossLevel} akhirnya tunduk di hadapanmu.`,
                        narasi:  `Nafasmu tersengal. Tanganmu gemetar.\nNamun di matamu — tidak ada ketakutan. Hanya tekad.`,
                        dur: 4500
                    },
                    {
                        chapter: '— Kekuatan Baru —',
                        title:   'SEMUA STAT +5 · MAX HP +50',
                        sub:     `Energi boss menyatu dengan dirimu.\nKamu bukan lagi orang yang sama seperti saat masuk.`,
                        narasi:  `Di dunia nyata, menghadapi tantangan besar dan bertahan\nadalah cara terkuat untuk tumbuh melampaui batas dirimu.`,
                        dur: 4000
                    },
                    {
                        chapter: '— Lantai Berikutnya Menanti —',
                        title:   bossLevel >= 5 ? 'DUNGEON TELAH DITAKLUKKAN!' : `LANTAI ${bossLevel + 1} TERBUKA`,
                        sub:     bossLevel >= 5
                            ? 'Kamu adalah petarung terkuat yang pernah menjejakkan kaki\ndi kedalaman Dungeon Nusantara Arsa.'
                            : `Kegelapan yang lebih dalam menunggumu.\nApakah kamu siap turun lebih jauh?`,
                        narasi:  bossLevel >= 5
                            ? 'Namamu akan dikenang di setiap sudut pulau ini.\nLegenda hidup — bukan karena takdir, tapi karena pilihan.'
                            : `Setiap lantai lebih ganas dari sebelumnya.\nTapi kamu sudah membuktikan: kamu lebih ganas dari mereka semua.`,
                        dur: 5000
                    }
                ];
                CinematicEngine.play('bossDefeated', slides, onDone);
            }

            // ── CUTSCENE GAME WIN — TAMAT 5 TAHUN ────────────────────────
            function playCutsceneGameWin(onDone) {
                const name = DataService.user ? DataService.user.name : 'Kamu';
                const role = STATE.player ? STATE.player.role : 'none';
                const roleEnding = {
                    worker:       { title: 'KARIER YANG MEMBANGGAKAN',   sub: 'Dari nol tanpa pengalaman\nhingga karyawan terbaik — ini perjalananmu.' },
                    student:      { title: 'ILMU YANG TAK TERNILAI',     sub: 'Lima tahun menimba ilmu.\nKini saatnya mengabdi pada dunia.' },
                    entrepreneur: { title: 'BISNIS YANG BERKEMBANG',     sub: 'Modal kecil, tekad besar.\nKamu membuktikan impian bisa jadi kenyataan.' },
                    family:       { title: 'KELUARGA YANG BAHAGIA',      sub: 'Cinta, kepercayaan, dan komitmen.\nItulah warisan terbesar yang kamu bangun.' },
                    none:         { title: 'PERJALANAN YANG BERMAKNA',   sub: 'Setiap langkah punya cerita.\nSetiap hari punya pelajaran.' }
                }[role] || { title: 'TAMAT', sub: '' };

                const slides = [
                    {
                        chapter: '— Lima Tahun di Pulau Arsa —',
                        title:   'PERJALANAN TELAH SELESAI',
                        sub:     `${name}, kamu telah menjalani 5 tahun penuh\nkeputusan, perjuangan, dan pertumbuhan.`,
                        narasi:  `Setiap pilihan yang kamu buat meninggalkan jejak.\nSetiap kegagalan mengajarkan sesuatu yang tidak ada di buku teks.`,
                        dur: 5000
                    },
                    {
                        chapter: `— Jalur ${role.toUpperCase()} —`,
                        title:   roleEnding.title,
                        sub:     roleEnding.sub,
                        narasi:  `Di Pulau Arsa, waktu adalah mata uang.\nKamu telah menggunakannya dengan caramu sendiri — dan itulah yang paling berharga.`,
                        dur: 5000
                    },
                    {
                        chapter: '— Pesan dari Pulau Arsa —',
                        title:   'HIDUP ADALAH PILIHAN',
                        sub:     `Simulasi ini berakhir.\nKehidupan nyatamu — baru saja dimulai.`,
                        narasi:  `Apa yang kamu pelajari di sini — tentang kerja keras, tentang uang,\ntentang hubungan — bawalah ke dunia nyata.\nDunia membutuhkan versimu yang terbaik.`,
                        dur: 6000
                    }
                ];
                CinematicEngine.play('gameWin', slides, onDone);
            }

            // ── CUTSCENE GAME OVER — DRAMATIS ─────────────────────────────
            function playCutsceneGameOver(onDone) {
                const role = STATE.player ? STATE.player.role : 'none';
                const day  = STATE.day || 1;
                const roleMsg = {
                    worker:       `Sebagai Pekerja, kamu telah mencurahkan keringat\nhingga titik terakhir. Itu bukan kegagalan — itu keberanian.`,
                    student:      `Perjalanan akademismu penuh liku.\nNamun ilmu yang sempat kamu serap tidak akan pernah hilang.`,
                    entrepreneur: `Bisnis itu jatuh bangun.\nPebisnis terbesar dunia pun pernah bangkrut sebelum berhasil.`,
                    family:       `Membangun hubungan itu tidak mudah.\nNamun mencoba, itu sudah berarti lebih dari sekadar diam.`,
                    none:         `Kamu sempat ragu menentukan arah.\nDi kehidupan berikutnya — percayalah pada pilihanmu.`
                }[role] || `Petualanganmu berakhir di sini.`;

                const slides = [
                    {
                        chapter: `— Hari ke-${day} —`,
                        title:   'PERJALANAN TERHENTI',
                        sub:     `Kadang bukan soal kalah atau menang.\nTapi seberapa jauh kamu berani melangkah.`,
                        narasi:  `Layar menggelap perlahan...\nSuara langkah kakimu masih bergema di koridor waktu.`,
                        dur: 5000
                    },
                    {
                        chapter: '— Refleksi —',
                        title:   'APA YANG KAMU PELAJARI?',
                        sub:     roleMsg,
                        narasi:  `Kegagalan bukan akhir cerita.\nItu adalah halaman pertama dari babak yang lebih kuat.`,
                        dur: 5500
                    },
                    {
                        chapter: '— Untuk Percobaan Berikutnya —',
                        title:   'BANGKIT LEBIH KUAT',
                        sub:     `"Bukan seberapa sering kamu jatuh,\ntapi seberapa cepat kamu bangkit." — Unknown`,
                        narasi:  `Coba lagi. Kali ini dengan semua pelajaran\nyang sudah kamu bawa dari perjalanan ini.`,
                        dur: 5000
                    }
                ];
                CinematicEngine.play('gameOver', slides, onDone);
            }

            // ── CUTSCENE LEVEL MILESTONE ──────────────────────────────────
            function playCutsceneLevelUp(newLevel, onDone) {
                const name = DataService.user ? DataService.user.name : 'Kamu';
                const milestones = {
                    10: { title: 'LEVEL 10 — PETUALANG SEJATI',  sub: 'Sepuluh level sudah kamu lewati.\nKamu bukan lagi pendatang baru di pulau ini.',     narasi: `Penduduk desa mulai mengenal namamu.\nLangkahmu lebih mantap dari hari pertama kamu tiba.` },
                    20: { title: 'LEVEL 20 — PEJUANG PULAU ARSA', sub: 'Dua puluh level menempa dirimu.\nKekuatan, kecerdasan, dan reputasimu sudah terbukti.', narasi: `Mentor Budi menatapmu dengan bangga dari kejauhan.\n"Ini bukan level biasa," bisiknya.` },
                    30: { title: 'LEVEL 30 — LEGENDA BERJALAN',   sub: 'Di level ini, namamu sudah dikenal\nhingga ke sudut-sudut terpencil Pulau Arsa.',       narasi: `Di dunia nyata, konsistensi selama 30 hari\nlebih berharga dari bakat tanpa latihan.` },
                    50: { title: 'LEVEL 50 — SANG MAESTRO',        sub: 'Puncak kekuatan telah kamu capai.\nSedikit sekali yang berhasil sejauh ini.',           narasi: `Kamu telah melampaui apa yang dianggap mungkin.\nIni bukan batas — ini titik mulai dari sesuatu yang lebih besar.` }
                };
                const m = milestones[newLevel] || {
                    title: `LEVEL ${newLevel} DICAPAI!`,
                    sub:   `Setiap level adalah bukti\nbahwa kamu tidak pernah berhenti tumbuh.`,
                    narasi: `Terus melangkah. Setiap langkah kecil\nmenumpuk menjadi perubahan yang luar biasa.`
                };
                const slides = [
                    {
                        chapter: '— Pertumbuhan Tanpa Henti —',
                        title:   m.title,
                        sub:     m.sub,
                        narasi:  m.narasi,
                        dur: 4500
                    },
                    {
                        chapter: '— Teruslah Bergerak —',
                        title:   'DUNIA MENONTONMU BERKEMBANG',
                        sub:     `${name}, setiap keputusan yang kamu buat\nmembentuk siapa kamu hari ini.`,
                        narasi:  `Level hanyalah angka. Yang sesungguhnya bertumbuh\nadalah cara pikirmu, keberanianmu, dan kebijaksanaanmu.`,
                        dur: 4000
                    }
                ];
                CinematicEngine.play('levelUp', slides, onDone);
            }


            // ── CUTSCENE FIRST DUNGEON ENTER ─────────────────────────────
            function playCutsceneDungeonEnter(onDone) {
                const slides = [
                    {
                        chapter: '— Gerbang Kegelapan —',
                        title:   'DUNGEON NUSANTARA ARSA',
                        sub:     `Aroma batu lembab dan gelap yang tak berujung\nmenyambutmu di ambang pintu.`,
                        narasi:  `Suara langkahmu bergema di keheningan.\nDi sini, tidak ada tempat bagi yang ragu.`,
                        dur: 4000
                    },
                    {
                        chapter: '— Bertahan atau Jatuh —',
                        title:   'DUNIA DI BAWAH PULAU',
                        sub:     `Monster menunggu di setiap sudut kegelapan.\nSatu kesalahan bisa mengakhiri segalanya.`,
                        narasi:  `Ingat: gunakan serangan (⚔️) untuk melawan,\ndan Ultimate (🔥) saat dikepung. Energimu adalah nyawamu.`,
                        dur: 4500
                    }
                ];
                CinematicEngine.play('dungeonEnter', slides, onDone);
            }

            // ── CUTSCENE LEGENDARY ITEM DROP ─────────────────────────────
            function playCutsceneLegendaryDrop(itemName, itemDesc, onDone) {
                const slides = [
                    {
                        chapter: '— Harta Sang Boss —',
                        title:   '✨ LEGENDARY DROP!',
                        sub:     `Cahaya oranye memenuhi ruangan dungeon.\nSesuatu yang tidak semua orang berhasil dapatkan.`,
                        narasi:  `Tangan gemetar saat mengambilnya dari tanah.\nBenda ini bukan sekadar item — ini adalah legenda.`,
                        dur: 4000
                    },
                    {
                        chapter: '— Item Terkuat —',
                        title:   itemName.toUpperCase(),
                        sub:     itemDesc,
                        narasi:  `Di dunia nyata, kerja keras dan ketekunan menghasilkan\nsesuatu yang tidak bisa dibeli dengan uang biasa.\nKamu baru saja membuktikannya.`,
                        dur: 5000
                    }
                ];
                CinematicEngine.play('legendaryDrop', slides, onDone);
            }

            // ── CUTSCENE BANGKRUT ─────────────────────────────────────────
            function playCutsceneBangkrut(onDone) {
                const role  = STATE.player ? STATE.player.role : 'none';
                const day   = STATE.day || 1;
                const msg   = role === 'entrepreneur'
                    ? `Modal habis, utang menumpuk.\nTapi ingat — setiap pengusaha besar pernah di titik ini.`
                    : `Uangmu ludes hingga ke sen terakhir.\nIni bukan akhir — ini pelajaran paling mahal yang pernah kamu dapat.`;

                const slides = [
                    {
                        chapter: `— Hari ke-${day} —`,
                        title:   'BANGKRUT',
                        sub:     msg,
                        narasi:  `Dompetmu kosong. Layar HP tinggal seiprit.\nAngin malam terasa lebih dingin dari biasanya.`,
                        dur: 5000
                    },
                    {
                        chapter: '— Dari Nol Lagi —',
                        title:   'BANGKIT DARI TITIK NOL',
                        sub:     `Sejarah mencatat: Walt Disney, Steve Jobs, dan Elon Musk\npernah bangkrut sebelum mencapai puncak.`,
                        narasi:  `Bangkrut bukan aib — itu data.\nData bahwa strategi yang kamu pakai perlu diubah.\nSekarang kamu lebih tahu dari sebelumnya.`,
                        dur: 5000
                    }
                ];
                CinematicEngine.play('bangkrut', slides, onDone);
            }

            // ── CUTSCENE BEASISWA DITERIMA ────────────────────────────────
            function playCutsceneScholarship(major, onDone) {
                const name = DataService.user ? DataService.user.name : 'Kamu';
                const majorLabel = major === 'teknologi' ? 'Teknologi Informasi' : 'Humaniora & Sejarah';
                const slides = [
                    {
                        chapter: '— Nilai Sempurna! —',
                        title:   'BEASISWA PENUH DIRAIH!',
                        sub:     `${name} membuktikan bahwa kerja keras\ntidak pernah mengkhianati hasil.`,
                        narasi:  `Jari-jarimu gemetar saat membaca hasilnya...\n"Skor: 10/10. Selamat, kamu lolos jalur beasiswa!"`,
                        dur: 4500
                    },
                    {
                        chapter: `— Jurusan ${majorLabel} —`,
                        title:   'MAHASISWA BERPRESTASI',
                        sub:     `UKT gratis. Uang saku bulanan.\nSemua ini hasil dari satu keputusan: belajar sungguh-sungguh.`,
                        narasi:  `Di Indonesia, beasiswa adalah tiket emas bagi anak-anak berprestasi\ntanpa memandang latar belakang ekonomi keluarga.`,
                        dur: 4500
                    },
                    {
                        chapter: '— Amanah Besar Menantimu —',
                        title:   'JAGA PRESTASI INI',
                        sub:     `Beasiswa bukan hadiah — ini kepercayaan.\nBuktikan kamu layak sampai wisuda.`,
                        narasi:  `Setiap bulan, uang saku beasiswamu akan masuk otomatis.\nGunakan dengan bijak — ini investasi negara untukmu.`,
                        dur: 4500
                    }
                ];
                CinematicEngine.play('scholarship', slides, onDone);
            }

            // ── CUTSCENE WISUDA (PUNCAK JALUR PELAJAR) ───────────────────
            function playCutsceneWisuda(major, isScholar, onDone) {
                const name = DataService.user ? DataService.user.name : 'Kamu';
                const gelar = major === 'teknologi' ? 'S.Kom' : 'S.Hum';
                const majorLabel = major === 'teknologi' ? 'Sarjana Komputer' : 'Sarjana Humaniora';
                const scholarLine = isScholar
                    ? 'Kamu wisuda sebagai penerima beasiswa penuh.\nBanggakan orang tuamu!'
                    : 'Kamu membuktikan tekad bisa mengalahkan keterbatasan.';

                const slides = [
                    {
                        chapter: '— Hari yang Dinantikan —',
                        title:   'SIDANG SKRIPSI: LULUS!',
                        sub:     `Semua malam begadang, semua coretan di kertas,\nsemua itu terbayar hari ini.`,
                        narasi:  `"Dengan ini, saya nyatakan kamu LULUS dengan nilai memuaskan."\nSuara dosen pembimbing bergema di ruang sidang yang hening.`,
                        dur: 5000
                    },
                    {
                        chapter: `— ${majorLabel} —`,
                        title:   `SELAMAT, ${gelar}!`,
                        sub:     `${name}, kamu kini resmi bergelar **${gelar}**.\n${scholarLine}`,
                        narasi:  `Toga hitam, topi persegi, dan senyum orang tua di kursi belakang.\nIni bukan akhir belajar — ini awal dari segalanya.`,
                        dur: 5000
                    },
                    {
                        chapter: '— Pesan untuk Masa Depan —',
                        title:   'DUNIA MENUNGGUMU',
                        sub:     `Di Indonesia, hanya ~${major === 'teknologi' ? '12%' : '9%'} penduduk yang berhasil meraih gelar sarjana.\nKamu bagian dari mereka.`,
                        narasi:  `Ilmu tanpa pengamalan adalah pohon tanpa buah.\nBawa ilmumu pulang, dan jadikan kebanggaan daerahmu.`,
                        dur: 5500
                    }
                ];
                CinematicEngine.play('wisuda', slides, onDone);
            }

            function buyFurniture(id, cost) {
                if (STATE.player.money >= cost) {
                    if (!STATE.player.furniture.includes(id)) {
                        STATE.player.money -= cost;
                        STATE.player.furniture.push(id);
                        gainExp(20); // Shopping gives exp
                        showToast("Item terbeli! 🛋️");
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); // SFX Beli Furniture
                        closeDialogue();
                    } else {
                        showToast("Sudah punya item ini!");
                    }
                } else {
                    showToast("Uang tidak cukup!");
                }
            }

            // Deskripsi upgrade per level
            const HOUSE_UPGRADE_INFO = {
                2: { desc: "Rumah meluas! Lantai lebih luas & warna baru.\n🎁 Hadiah: +100 EXP", icon: "🏡" },
                3: { desc: "Rumah makin nyaman! Dapur muncul di dalam rumah.\nBisa memasak tiap hari (Nasi Goreng & Sup Ayam).\n🎁 Hadiah: +200 EXP", icon: "🏠" },
                4: { desc: "Rumah mewah! Dapur upgrade — bisa buat Kue Lapis.\nRuangan makin besar & lantai biru elegan.\n🎁 Hadiah: +300 EXP", icon: "🏰" },
                5: { desc: "RUMAH MEWAH MAKSIMAL! Dapur premium — bisa bikin Rendang.\nLantai emas eksklusif. Rumah terbesar di desa!\n🎁 Hadiah: +500 EXP + 5 REP", icon: "🏯" }
            };

            function showUpgradeHousePreview() {
                const p = STATE.player;
                const nextLevel = p.houseLevel + 1;
                if (p.houseLevel >= 5) { showToast("Level Rumah Maksimal! 🏯"); return; }
                const cost = nextLevel * 500000;
                const info = HOUSE_UPGRADE_INFO[nextLevel];
                showDialogue("ARSITEK 👷", 
                    `UPGRADE RUMAH ke Level ${nextLevel} ${info.icon}\n\nApa yang berubah:\n${info.desc}\n\nBiaya: ${cost.toLocaleString()} Gold\nUangmu: ${p.money.toLocaleString()} Gold`,
                    [
                        { text: `✅ Upgrade Sekarang!`, action: () => upgradeHouse() },
                        { text: "❌ Batal", action: closeDialogue }
                    ]
                );
            }

            function upgradeHouse() {
                const nextLevel = STATE.player.houseLevel + 1;
                const cost = nextLevel * 500000;

                if (STATE.player.houseLevel >= 5) {
                    showToast("Level Rumah Maksimal! 🏯");
                    return;
                }

                if (STATE.player.money >= cost) {
                    STATE.player.money -= cost;
                    STATE.player.houseLevel = nextLevel;
                    const info = HOUSE_UPGRADE_INFO[nextLevel] || { icon: "🏰", desc: "" };

                    // Bonus EXP & REP per level
                    const expBonus = [0, 0, 100, 200, 300, 500];
                    gainExp(expBonus[nextLevel] || 200);
                    if (nextLevel >= 5) {
                        STATE.player.reputation = (STATE.player.reputation || 0) + 5;
                        showToast("✨ +5 REP dari Rumah Mewah!");
                    }

                    // Efek visual
                    for (let i = 0; i < 8; i++) {
                        setTimeout(() => createParticle(
                            18 * TILE_SIZE + (Math.random() - 0.5) * 100,
                            8 * TILE_SIZE + (Math.random() - 0.5) * 100,
                            ['#fbbf24','#34d399','#60a5fa','#f472b6'][Math.floor(Math.random() * 4)]
                        ), i * 80);
                    }

                    // Regenerate map baru dengan ukuran & fitur sesuai level
                    regenerateHouseMap();
                    closeDialogue();
                    updateHUDInfo();

                    // Tampilkan notif upgrade
                    setTimeout(() => {
                        showDialogue(`RUMAH LEVEL ${nextLevel} ${info.icon}`,
                            `Rumahmu berhasil diupgrade!\n\n${info.desc}\n\nSekarang masuk ke dalam rumah untuk melihat perubahannya!`,
                            [{ text: "🏠 Lihat Rumah!", action: closeDialogue }]
                        );
                    }, 300);
                } else {
                    const shortage = (nextLevel * 500000) - STATE.player.money;
                    showDialogue("ARSITEK 👷", 
                        `Uang belum cukup untuk Level ${nextLevel}.\n\nKurang: ${shortage.toLocaleString()} Gold`, 
                        [{ text: "Nanti saja", action: closeDialogue }]
                    );
                }
            }

            // --- NEW FUNCTION: START RUINS BATTLE (QUEST SKRIPSI) ---
            function startRuinsBattle() {
                // 1. Pindah Lokasi ke Arena Reruntuhan
                STATE.location = 'ruins_battle';

                // Spawn Player di bagian bawah tengah
                STATE.player.x = 11 * TILE_SIZE;
                STATE.player.y = 12 * TILE_SIZE;
                STATE.teleportCooldown = 60;

                // 2. Spawn Monster Spesial (Thief)
                STATE.enemies = [];
                STATE.enemies.push({
                    x: 11 * TILE_SIZE, // Tengah
                    y: 5 * TILE_SIZE,  // Atas
                    w: 50, h: 50,      // Sedikit lebih besar dari player
                    hp: 400,           // HP Tebal (Mini Boss)
                    maxHp: 400,
                    speed: 1.4,        // Cukup lincah (Pencuri)
                    knockback: { x: 0, y: 0 },
                    color: '#d97706',
                    animOffset: 0,
                    angle: 0,
                    imgKey: 'thief',   // Gambar Monster Thief
                    isQuestTarget: true // Flag khusus drop item skripsi
                });

                // 3. Efek Visual & Audio
                showToast("⚔️ FIGHT START! Rebut Draft Skripsi!");
                if (typeof AudioService !== 'undefined') AudioService.playBGM('boss'); // Musik Tegang

                // Intro Dialog Singkat dari Monster
                setTimeout(() => {
                    showDialogue("PENCURI NASKAH", "Hehehe! Mau ambil buku ini? Langkahi dulu mayatku!", [{ text: "Maju sini!", action: closeDialogue }], 'images/monster-thief.png');
                }, 500);
            }
            // Expose ke global agar bisa dipanggil dari test mode di luar closure
            window.startRuinsBattle = startRuinsBattle;

            function spawnEnemies() {
                STATE.enemies = [];
                if (STATE.location !== 'dungeon') return;

                // FIX: Pastikan dungeon music berjalan saat musuh spawn
                if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                    if (AudioService.currentTrack !== 'boss') {
                        AudioService.playBGM('dungeon');
                    }
                }

                // Reset Flags
                STATE.bossSpawned = false;

                // Reset Map Buildings
                // LOGIKA BARU: Hapus semua portal dulu, sisakan hanya Batu (Obstacles)
                const map = maps['dungeon'];
                map.buildings = map.buildings.filter(b => b.id.includes('rock'));

                const level = STATE.dungeonLevel || 1;

                // FITUR HARDCORE: Portal Exit hanya ada di Level 1
                // Level 2 ke atas tidak ada jalan kembali kecuali Menang atau Mati (Game Over)
                if (level === 1) {
                    map.buildings.push({
                        id: 'dungeon_exit', x: 2, y: 2, w: 1, h: 1,
                        type: 'trigger', entrance: { x: 2, y: 2 }, name: "Keluar Dungeon"
                    });
                }

                let count = 3 + (level * 2); // Level 1: 5, Level 5: 13
                let hpMulti = level;
                let sizeMulti = 1;

                // --- LOGIKA LEVEL 5 (WAVE 1: ELITE GUARDS) ---
                if (level === 5) {
                    showToast(`💀 LEVEL 5: ELITE GUARDS!`);

                    // Spawn 5 Monster Level 5 (Elite)
                    for (let i = 0; i < 5; i++) {
                        let safeX, safeY;
                        do {
                            safeX = Math.floor((Math.random() * (DUNGEON_W - 4)) + 2);
                            safeY = Math.floor((Math.random() * (DUNGEON_H - 4)) + 2);
                        } while (safeX < 8 && safeY < 8); // Jauh dari pintu masuk

                        STATE.enemies.push({
                            x: safeX * TILE_SIZE,
                            y: safeY * TILE_SIZE,
                            w: 40, h: 40, // Lebih besar dari biasa
                            hp: 300,
                            maxHp: 300,
                            speed: 1.5, // Agak cepat
                            knockback: { x: 0, y: 0 },
                            color: '#1e3a8a', // Biru Tua (Fallback)
                            animOffset: Math.random() * 100,
                            angle: 0,
                            imgKey: 'enemy5' // Gambar Monster Level 5
                        });
                    }
                    return; // Selesai spawn wave 1, boss nanti di updateEnemies
                }

                // --- LOGIKA LEVEL 1-4 ---
                showToast(`💀 DUNGEON LEVEL ${level} START!`);

                for (let i = 0; i < count; i++) {
                    let safeX, safeY;
                    do {
                        safeX = Math.floor((Math.random() * (DUNGEON_W - 4)) + 2);
                        safeY = Math.floor((Math.random() * (DUNGEON_H - 4)) + 2);
                    } while (safeX < 8 && safeY < 8);

                    // --- LOGIKA VARIASI MONSTER BERDASARKAN LEVEL ---
                    // Level 1: Hanya Tier 1
                    // Level 2: Tier 1 & 2
                    // Level 3: Tier 1, 2, 3
                    // Level 4+: Tier 1, 2, 3, 4
                    let maxTier = 1;
                    if (level >= 2) maxTier = 2;
                    if (level >= 3) maxTier = 3;
                    if (level >= 4) maxTier = 4;

                    const tier = Math.floor(Math.random() * maxTier) + 1;

                    // Stats scaling berdasarkan Tier monster juga
                    const tierHpBonus = 1 + (tier * 0.2); // Tier tinggi lebih tebal sedikit

                    STATE.enemies.push({
                        x: safeX * TILE_SIZE,
                        y: safeY * TILE_SIZE,
                        w: 24 + (tier * 2), h: 24 + (tier * 2), // Tier tinggi sedikit lebih besar
                        hp: 50 * hpMulti * tierHpBonus,
                        maxHp: 50 * hpMulti * tierHpBonus,
                        speed: 1.0 + (level * 0.1) + (tier * 0.05),
                        knockback: { x: 0, y: 0 },
                        color: tier === 1 ? '#ef4444' : (tier === 2 ? '#f97316' : (tier === 3 ? '#eab308' : '#84cc16')), // Warna fallback beda-beda
                        animOffset: Math.random() * 100,
                        angle: 0,
                        imgKey: 'enemy' + tier // Set gambar sesuai tier (enemy1, enemy2, dst)
                    });
                }
            }

            function gameOver() {
                showDialogue("DEFEAT", "Kamu dikalahkan monster. Gold berkurang 10%.", [{
                    text: "Respawn (Klinik)", action: () => {
                        STATE.player.hp = 100;
                        STATE.player.energy = 50; // Respawn tired
                        STATE.player.money = Math.floor(STATE.player.money * 0.9);

                        STATE.location = 'village';
                        STATE.player.x = 20 * TILE_SIZE;
                        STATE.player.y = 20 * TILE_SIZE;

                        // FIX: Gunakan parseInt agar hari tidak menjadi string "11" (1+1) saat Game Over
                        STATE.day = parseInt(STATE.day) + 1;

                        STATE.enemies = [];
                        closeDialogue();
                        showToast("Dirawat oleh Dr. Budi ❤️");
                    }
                }], null);
            }

            // ─── DIALOGUE SYSTEM WITH AUTO-PAGINATION ───────────────────
            // Memecah teks panjang jadi halaman-halaman pendek
            // Threshold karakter sebelum dipaginate
            const DIALOGUE_PAGE_LIMIT = 400;

            function splitDialoguePages(text) {
                // Jika teks pendek, langsung 1 halaman
                if (text.length <= DIALOGUE_PAGE_LIMIT) return [text];

                const pages = [];
                // Pecah per paragraf dulu (newline ganda atau single \n)
                const paragraphs = text.split('\n');
                let current = '';

                for (const para of paragraphs) {
                    const candidate = current ? current + '\n' + para : para;
                    if (candidate.length > DIALOGUE_PAGE_LIMIT && current.length > 0) {
                        pages.push(current.trim());
                        current = para;
                    } else {
                        current = candidate;
                    }
                }
                if (current.trim()) pages.push(current.trim());

                // Jika masih ada halaman yang terlalu panjang, pecah per kalimat
                const result = [];
                for (const page of pages) {
                    if (page.length <= DIALOGUE_PAGE_LIMIT) {
                        result.push(page);
                    } else {
                        // Pecah per kalimat
                        const sentences = page.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [page];
                        let chunk = '';
                        for (const s of sentences) {
                            const cand = chunk ? chunk + ' ' + s.trim() : s.trim();
                            if (cand.length > DIALOGUE_PAGE_LIMIT && chunk.length > 0) {
                                result.push(chunk.trim());
                                chunk = s.trim();
                            } else {
                                chunk = cand;
                            }
                        }
                        if (chunk.trim()) result.push(chunk.trim());
                    }
                }
                return result.filter(p => p.length > 0);
            }

            function showDialogue(title, text, opts, imgSrc, htmlSuffix) {
                const box      = document.getElementById('dialogue-wrapper');
                const portrait = document.getElementById('dialogue-portrait');
                const titleEl  = document.getElementById('dialogue-title');
                const textEl   = document.getElementById('dialogue-text');
                const grp      = document.getElementById('dialogue-options');

                // ── Bersihkan state dialog sebelumnya ──────────────────────────
                if (box._typeTimer) { clearInterval(box._typeTimer); box._typeTimer = null; }
                const dlgBox = document.getElementById('dialogue-box');
                if (dlgBox && box._tapHandler) {
                    dlgBox.removeEventListener('click', box._tapHandler);
                    box._tapHandler = null;
                }
                // Reset area teks & opsi
                textEl.innerHTML = '';
                grp.innerHTML = '';

                // Set portrait
                if (imgSrc) {
                    portrait.src = imgSrc;
                    portrait.style.display = 'block';
                } else {
                    portrait.style.display = 'none';
                }

                box.style.display = 'block';
                STATE.screen = 'dialogue';

                // Reset paging pilihan setiap dialogue baru
                box._optPage = 0;
                box._optPageTitle = title;

                const pages = splitDialoguePages(text);
                let pageIndex = 0;

                // ── Helper: escape HTML lalu render **bold** dan *italic* markdown ──
                function renderDlgMD(raw) {
                    return raw
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                        .replace(/\*(.*?)\*/g, '<i>$1</i>')
                        .replace(/\n/g, '<br>');
                }

                // ── Inject htmlSuffix sebagai node terpisah di bawah teks ──────
                function appendSuffix() {
                    if (!htmlSuffix) return;
                    // Hapus suffix lama jika ada, lalu inject baru
                    const old = textEl.querySelector('.dlg-html-suffix');
                    if (old) old.remove();
                    const suf = document.createElement('div');
                    suf.className = 'dlg-html-suffix';
                    suf.innerHTML = htmlSuffix;
                    textEl.appendChild(suf);
                }

                function renderPage(idx) {
                    const isLast = idx >= pages.length - 1;
                    const total  = pages.length;

                    // Bersihkan timer lama
                    if (box._typeTimer) { clearInterval(box._typeTimer); box._typeTimer = null; }

                    // Judul + indikator halaman
                    titleEl.innerText = total > 1
                        ? `${title}  (${idx + 1}/${total})`
                        : title;

                    // Reset teks, siapkan span untuk typewriter
                    textEl.innerHTML = '';
                    const textSpan = document.createElement('span');
                    textEl.appendChild(textSpan);

                    const pageText = pages[idx];
                    const pageChars = [...pageText];
                    let charIdx = 0;

                    // Fungsi selesai typewriter
                    const onTypeDone = () => {
                        box._typeTimer = null;
                        // Render full teks dengan markdown (bukan append karakter)
                        textSpan.innerHTML = renderDlgMD(pageText);
                        // Suffix hanya di halaman terakhir
                        if (isLast) appendSuffix();
                        renderOpts();
                    };

                    // Fungsi skip typewriter
                    const skipType = () => {
                        if (!box._typeTimer) return false; // sudah selesai
                        clearInterval(box._typeTimer);
                        onTypeDone();
                        return true;
                    };

                    // Typewriter — update span innerHTML setiap tick
                    box._typeTimer = setInterval(() => {
                        charIdx++;
                        // Render partial dengan markdown agar ** tidak muncul saat animasi
                        textSpan.innerHTML = renderDlgMD(pageChars.slice(0, charIdx).join(''));
                        if (charIdx >= pageChars.length) {
                            clearInterval(box._typeTimer);
                            onTypeDone();
                        }
                    }, 16);

                    // Tap kotak = skip typewriter atau next page
                    if (box._tapHandler) dlgBox.removeEventListener('click', box._tapHandler);
                    box._tapHandler = (e) => {
                        if (e.target.tagName === 'BUTTON') return;
                        if (skipType()) return; // skip typewriter dulu
                        if (!isLast) { pageIndex++; renderPage(pageIndex); }
                    };
                    dlgBox.addEventListener('click', box._tapHandler);

                    // ── Render tombol ─────────────────────────────────────────
                    function renderOpts() {
                        grp.innerHTML = '';
                        if (!isLast) {
                            // Tombol LANJUT
                            const nextBtn = document.createElement('button');
                            nextBtn.innerText = 'Lanjut ▶';
                            nextBtn.className = 'dlg-next-btn';
                            nextBtn.onclick = () => {
                                if (skipType()) return;
                                pageIndex++;
                                renderPage(pageIndex);
                            };
                            grp.appendChild(nextBtn);
                        } else {
                            // Halaman terakhir — tampilkan pilihan dengan paging
                            const OPTS_PER_PAGE = 4;
                            const totalOptPages = Math.ceil(opts.length / OPTS_PER_PAGE);

                            if (box._optPage === undefined || box._optPageTitle !== title) {
                                box._optPage = 0;
                                box._optPageTitle = title;
                            }

                            function renderOptPage(optPage) {
                                box._optPage = optPage;
                                grp.innerHTML = '';

                                opts.slice(optPage * OPTS_PER_PAGE, (optPage + 1) * OPTS_PER_PAGE).forEach(o => {
                                    const b = document.createElement('button');
                                    b.innerText = o.text;
                                    b.onclick = () => {
                                        if (skipType()) return; // skip typewriter jika masih jalan
                                        o.action();
                                    };
                                    grp.appendChild(b);
                                });

                                if (totalOptPages > 1) {
                                    const navRow = document.createElement('div');
                                    navRow.className = 'dlg-nav-row';
                                    navRow.style.cssText = 'display:flex;gap:6px;margin-top:2px;';
                                    const navStyle = 'flex:1;width:auto!important;background:#1e3a8a;border:2px solid #3b82f6;border-radius:10px;color:#bfdbfe;font-size:11px;padding:7px 6px;font-family:Nunito,sans-serif;font-weight:700;cursor:pointer;text-align:center;box-sizing:border-box;';
                                    if (optPage > 0) {
                                        const bP = document.createElement('button');
                                        bP.innerText = `◀ Hal. ${optPage}/${totalOptPages}`;
                                        bP.style.cssText = navStyle;
                                        bP.onclick = () => renderOptPage(optPage - 1);
                                        navRow.appendChild(bP);
                                    }
                                    if (optPage < totalOptPages - 1) {
                                        const bN = document.createElement('button');
                                        bN.innerText = `Hal. ${optPage + 2}/${totalOptPages} ▶`;
                                        bN.style.cssText = navStyle;
                                        bN.onclick = () => renderOptPage(optPage + 1);
                                        navRow.appendChild(bN);
                                    }
                                    grp.appendChild(navRow);
                                }
                            }

                            renderOptPage(box._optPage || 0);
                        }
                    }

                    // Render tombol langsung jika single-page (bukan typewriter baru)
                    // — tombol muncul setelah typewriter selesai via onTypeDone()
                    // Tapi kalau sudah selesai langsung (teks kosong), render sekarang
                    if (pageChars.length === 0) onTypeDone();
                }

                renderPage(pageIndex);
            }

            function closeDialogue() {
                const box = document.getElementById('dialogue-wrapper');
                if (!box) return;
                // Hentikan typewriter
                if (box._typeTimer) { clearInterval(box._typeTimer); box._typeTimer = null; }
                // Lepas tap handler
                const dlgBox = document.getElementById('dialogue-box');
                if (dlgBox && box._tapHandler) {
                    dlgBox.removeEventListener('click', box._tapHandler);
                    box._tapHandler = null;
                }
                // Bersihkan konten
                const textEl = document.getElementById('dialogue-text');
                if (textEl) textEl.innerHTML = '';
                const grp = document.getElementById('dialogue-options');
                if (grp) grp.innerHTML = '';
                box.style.display = 'none';
                STATE.screen = 'play';
                // Reset input agar tidak ada tombol tertahan
                resetInputs();
            }
            function showToast(msg) {
                const t = document.getElementById('toast');
                t.innerText = msg;
                t.style.opacity = 1;
                setTimeout(() => t.style.opacity = 0, 2000);
            }
            function createParticle(x, y, c) {
                STATE.particles.push({ x: x, y: y, vx: (Math.random() - .5) * 5, vy: (Math.random() - .5) * 5, life: 15, color: c });
            }

            // ── FESTIVAL VISUAL OVERLAY ─────────────────────────────────────
            function drawFestivalOverlay() {
                const fest = STATE.activeFestivalData;
                if (!fest) return;
                const cam = STATE.camera;
                const scaleFactor = canvas.width / GAME_WIDTH;

                ctx.save();
                ctx.scale(scaleFactor, scaleFactor);

                // 1. Banner festival di bagian atas layar (screen space)
                const t = Date.now() / 1000;
                const bannerAlpha = 0.75 + Math.sin(t * 1.5) * 0.15;
                ctx.fillStyle = `rgba(0,0,0,${bannerAlpha * 0.45})`;
                ctx.fillRect(0, 0, GAME_WIDTH, 22);

                // Gradient warna festival di banner
                const grad = ctx.createLinearGradient(0, 0, GAME_WIDTH, 0);
                const festColors = fest.colors || ['#fbbf24', '#f472b6', '#60a5fa'];
                festColors.forEach((c, i) => grad.addColorStop(i / (festColors.length - 1), c + '88'));
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, GAME_WIDTH, 3); // garis tipis warna festival di paling atas

                // Teks nama festival
                ctx.font = 'bold 10px Fredoka, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#fef3c7';
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 4;
                ctx.fillText(`${fest.icon || '🎪'} ${fest.name} ${fest.icon || '🎪'}`, GAME_WIDTH / 2, 15);
                ctx.shadowBlur = 0;
                ctx.textAlign = 'left';

                // 2. Dekorasi di sekitar alun-alun (world space)
                ctx.translate(-cam.x, -cam.y);

                // Titik dekorasi festival di alun-alun (koordinat tile)
                const decorSpots = [
                    { tx: 20, ty: 19 }, { tx: 28, ty: 19 }, { tx: 20, ty: 26 }, { tx: 28, ty: 26 },
                    { tx: 24, ty: 18 }, { tx: 24, ty: 27 },
                ];

                const ambient = fest.ambient || 'generic';
                const decorEmojis = {
                    'fireworks': ['🎆', '🏮', '🎇', '✨'],
                    'petals':    ['🌸', '🌺', '🏮', '🎀'],
                    'smoke':     ['🍳', '🔥', '🏆', '⭐'],
                    'dust':      ['🐎', '🏆', '🎠', '🌟'],
                    'feathers':  ['🐔', '🌟', '🏆', '🎊'],
                    'bubbles':   ['💧', '🏊', '🌊', '🏆'],
                    'snow':      ['❄️', '⛄', '🌟', '🎁'],
                    'leaves':    ['🌾', '🌽', '🍂', '🌻'],
                    'notes':     ['🎵', '🎶', '🎸', '🎪'],
                    'generic':   ['🎉', '🎊', '✨', '🌟'],
                };
                const emojis = decorEmojis[ambient] || decorEmojis['generic'];

                // Animasi oscillation untuk dekorasi
                decorSpots.forEach((spot, i) => {
                    const wx = spot.tx * TILE_SIZE;
                    const wy = spot.ty * TILE_SIZE;

                    // Cek apakah dalam view
                    if (wx < cam.x - 40 || wx > cam.x + GAME_WIDTH + 40) return;
                    if (wy < cam.y - 40 || wy > cam.y + GAME_HEIGHT + 40) return;

                    const bob = Math.sin(t * 2 + i * 0.8) * 4;
                    const emoji = emojis[i % emojis.length];

                    ctx.save();
                    ctx.font = '18px serif';
                    ctx.globalAlpha = 0.85;
                    ctx.fillText(emoji, wx - 6, wy - 8 + bob);
                    ctx.restore();
                });

                // 3. Tenda/Panggung — garis dekorasi di sekitar alun-alun (kotak sederhana)
                const squareX = 19 * TILE_SIZE;
                const squareY = 18 * TILE_SIZE;
                const squareW = 10 * TILE_SIZE;
                const squareH = 10 * TILE_SIZE;

                // Pastikan dalam view sebelum gambar
                if (squareX < cam.x + GAME_WIDTH + 50 && squareX + squareW > cam.x - 50) {
                    // Garis warna festival mengelilingi alun-alun
                    ctx.save();
                    ctx.strokeStyle = festColors[0] || '#fbbf24';
                    ctx.lineWidth = 3;
                    ctx.globalAlpha = 0.4 + Math.sin(t * 2) * 0.15;
                    ctx.setLineDash([8, 6]);
                    ctx.strokeRect(squareX, squareY, squareW, squareH);
                    ctx.setLineDash([]);
                    ctx.restore();

                    // Banner kecil di atas alun-alun
                    ctx.save();
                    ctx.globalAlpha = 0.7;
                    ctx.fillStyle = festColors[0] + 'cc' || '#fbbf24cc';
                    ctx.fillRect(squareX + squareW / 2 - 40, squareY - 18, 80, 14);
                    ctx.font = 'bold 9px Fredoka, sans-serif';
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.fillText('ALUN-ALUN FESTIVAL', squareX + squareW / 2, squareY - 7);
                    ctx.textAlign = 'left';
                    ctx.restore();
                }

                ctx.restore();
            }

            function draw() {
                // FIX: Tambahkan 'cutscene' agar canvas tetap dirender saat animasi pernikahan berjalan
                if (STATE.screen !== 'play' && STATE.screen !== 'dialogue' && STATE.screen !== 'modal' && STATE.screen !== 'minigame' && STATE.screen !== 'cutscene') return;

                ctx.fillStyle = '#0f172a';
                ctx.fillRect(0, 0, canvas.width, canvas.height); // Gunakan canvas.width/height dinamis

                // SAFETY CHECK: Pastikan Map Ada
                if (!maps[STATE.location]) {
                    // Coba refresh fairyVillage map jika belum ada
                    if (STATE.location === 'fairyVillage') refreshFairyVillageMap();
                    if (!maps[STATE.location]) {
                        console.error("Map not found:", STATE.location);
                        ctx.fillStyle = "white";
                        ctx.font = "20px Arial";
                        ctx.fillText("Error: Map Loading Failed", 50, 50);
                        return;
                    }
                }

                ctx.save();

                // --- OPTIMASI: DYNAMIC SCALING ---
                // Hitung skala berdasarkan resolusi canvas saat ini (bisa 2x atau 4x)
                const scaleFactor = canvas.width / GAME_WIDTH;
                ctx.scale(scaleFactor, scaleFactor);

                // FIX: Mengaktifkan smoothing agar sprite NPC HD terlihat halus dan tidak patah-patah
                ctx.imageSmoothingEnabled = true;

                let shakeX = 0;
                let shakeY = 0;
                if (STATE.shakeTimer > 0) {
                    shakeX = (Math.random() - 0.5) * 10;
                    shakeY = (Math.random() - 0.5) * 10;
                }

                ctx.translate(-STATE.camera.x + shakeX, -STATE.camera.y + shakeY);

                const map = maps[STATE.location];

                const scaledWidth = GAME_WIDTH;
                const scaledHeight = GAME_HEIGHT;

                // FIX: gunakan TS untuk fairyVillage agar tile range tepat
                const _renderTS = (STATE.location === 'fairyVillage' && typeof TS !== 'undefined') ? TS : TILE_SIZE;
                const startCol = Math.floor(STATE.camera.x / _renderTS);
                const endCol = startCol + (scaledWidth / _renderTS) + 1;
                const startRow = Math.floor(STATE.camera.y / _renderTS);
                const endRow = startRow + (scaledHeight / _renderTS) + 1;

                let isBgLoaded = false;
                if (STATE.location === 'village') {
                    const bgImg = bgSeasons[STATE.season];

                    if (bgImg && bgImg.complete && bgImg.naturalWidth !== 0) {
                        ctx.drawImage(bgImg, 0, 0, ISLAND_W * TILE_SIZE, ISLAND_H * TILE_SIZE);
                        isBgLoaded = true;
                    } else {
                        if (bgSeasons.spring.complete && bgSeasons.spring.naturalWidth !== 0) {
                            ctx.drawImage(bgSeasons.spring, 0, 0, ISLAND_W * TILE_SIZE, ISLAND_H * TILE_SIZE);
                            isBgLoaded = true;
                        }
                    }
                } else if (STATE.location === 'house') {
                    isBgLoaded = false; // Paksa render sistem Tile
                } else if (STATE.location === 'fairyVillage') {
                    const _fvTS = (typeof TS !== 'undefined') ? TS : 28;
                    const _fvW  = maps['fairyVillage'].w * _fvTS;
                    const _fvH  = maps['fairyVillage'].h * _fvTS;
                    // Gambar kayangan.png 1x saja sebagai 1 gambar utuh (bukan tile berulang)
                    if (typeof fvBgImage !== 'undefined' && fvBgImage && fvBgImage.complete && fvBgImage.naturalWidth > 0) {
                        ctx.drawImage(fvBgImage, 0, 0, _fvW, _fvH);
                    } else {
                        // Fallback gradient ungu gelap
                        const fvGrad = ctx.createLinearGradient(0, 0, 0, _fvH);
                        fvGrad.addColorStop(0, '#0c0620'); fvGrad.addColorStop(1, '#1a0e35');
                        ctx.fillStyle = fvGrad;
                        ctx.fillRect(0, 0, _fvW, _fvH);
                    }
                    // Overlay siang/malam
                    if (typeof getFVTimeOfDay === 'function') {
                        const _ovMap = { pagi:'rgba(255,220,100,0.10)', siang:'rgba(255,255,200,0.06)', sore:'rgba(255,150,60,0.15)', senja:'rgba(180,60,60,0.18)', malam:'rgba(5,0,30,0.48)' };
                        ctx.fillStyle = _ovMap[getFVTimeOfDay()] || 'rgba(5,0,30,0.48)';
                        ctx.fillRect(0, 0, _fvW, _fvH);
                    }
                    isBgLoaded = true;
                }

                for (let y = startRow; y <= endRow; y++) {
                    for (let x = startCol; x <= endCol; x++) {
                        if (y >= 0 && y < map.h && x >= 0 && x < map.w) {
                            const t = map.tiles[y * map.w + x];

                            if (isBgLoaded) {
                                if (STATE.location === 'village') {
                                    // UPDATE: Tambahkan t !== 7 agar Tile Reruntuhan (ID 7) digambar di atas background
                                    if (t !== 9 && t !== 2 && t !== 12 && t !== 1 && t !== 0 && t !== 5 && t !== 7) continue;
                                } else if (STATE.location === 'house') {
                                    // Skip floor (10) and wall (11) if BG is loaded so we see the image
                                    if (t === 10 || t === 11) continue;
                                } else if (STATE.location === 'fairyVillage') {
                                    // Skip semua tile lantai/tembok peri — kayangan.png sudah jadi bg utuh
                                    continue;
                                }
                            }

                            let c = '#0f172a';
                            if (t === 1) c = '#1e293b';
                            if (t === 3) c = '#334155';
                            if (t === 4) c = '#3f3f46'; // Dungeon Floor Base Color
                            if (t === 5) c = '#92400e';
                            if (t === 6) c = '#4c1d95';
                            if (t === 7) c = '#57534e'; // NEW: Ruins Base Color
                            if (t === 9) c = '#000';
                            if (t === 10) c = STATE.player.houseLevel === 2 ? '#fcd34d' : '#78350f';
                            if (t === 11) c = '#f1f5f9';
                            if (t === 8) c = '#d97706';
                            if (t === 20) c = '#0a2010'; // Lantai Peri (Hijau Gelap)
                            if (t === 21) c = '#0a2010'; // Tembok Peri (Transparan visual, solid secara fisik)

                            if (STATE.location === 'village') {
                                if (t === 5) {
                                    if (STATE.season === 'winter') c = '#94a3b8';
                                }
                            }

                            // DRAW TILE BASE
                            ctx.fillStyle = c;

                            // Handle Dungeon/Candi Floor (ID 4)
                            // UPDATE: Memisahkan logika Candi Interior agar menggunakan 'lantaicandi.png'
                            if (t === 4) {
                                if (STATE.location === 'candi_interior') {
                                    // RENDER LANTAI CANDI KHUSUS
                                    if (candiAssets.floor.complete && candiAssets.floor.naturalWidth !== 0) {
                                        ctx.drawImage(candiAssets.floor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    } else {
                                        // Fallback warna batu candi
                                        ctx.fillStyle = '#44403c';
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                }
                                else if (STATE.location === 'dungeon' || STATE.location === 'ruins_battle') {
                                    // RENDER LANTAI DUNGEON BIASA
                                    if (dungeonAssets.floor.complete && dungeonAssets.floor.naturalWidth !== 0) {
                                        ctx.drawImage(dungeonAssets.floor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    } else {
                                        ctx.fillStyle = '#3f3f46'; // Fallback warna lantai jika gambar belum load
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                }
                            }

                            // NEW: HANDLE MAGIC FLOOR / RED CARPET (ID 6)
                            else if (t === 6) {
                                if (STATE.location === 'candi_interior') {
                                    // RENDER LANTAI MERAH CANDI
                                    if (candiAssets.redFloor.complete && candiAssets.redFloor.naturalWidth !== 0) {
                                        ctx.drawImage(candiAssets.redFloor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    } else {
                                        ctx.fillStyle = '#991b1b';
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                } else if (STATE.location === 'sylvaria') {
                                    // 🧚 SYLVARIA CRYSTAL FLOOR — Biru-teal berkilau animasi
                                    const shimmer = Math.sin(Date.now() * 0.003 + x * 0.7 + y * 0.5) * 0.15 + 0.85;
                                    ctx.fillStyle = `rgba(56, 189, 248, ${shimmer})`;
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    // Glitter overlay
                                    ctx.fillStyle = `rgba(186, 230, 253, ${shimmer * 0.4})`;
                                    ctx.fillRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                                } else {
                                    ctx.fillStyle = '#4c1d95';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // 🧚 SYLVARIA GRASS TILE (ID 5) — Hijau zamrud magis
                            else if (t === 5 && STATE.location === 'sylvaria') {
                                const glow = Math.sin(Date.now() * 0.002 + x * 0.5 + y * 0.8) * 0.12 + 0.88;
                                ctx.fillStyle = `rgba(74, 222, 128, ${glow})`;
                                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                // Butiran sihir kecil acak
                                if (Math.random() < 0.003) {
                                    ctx.fillStyle = 'rgba(255,255,255,0.7)';
                                    ctx.fillRect(x*TILE_SIZE + Math.floor(Math.random()*TILE_SIZE), y*TILE_SIZE + Math.floor(Math.random()*TILE_SIZE), 2, 2);
                                }
                            }

                            // NEW: Handle House Floor (ID 10 in House) - Warna lantai berubah sesuai level rumah
                            // UPDATE: Menambahkan 'player_shop_interior' agar lantainya sama dengan rumah
                            else if (t === 10 && (STATE.location === 'house' || STATE.location === 'player_shop_interior')) {
                                const hl = STATE.player.houseLevel || 1;
                                if (wallAssets.schoolFloor.complete && wallAssets.schoolFloor.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.schoolFloor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    // Overlay warna tint per level agar lantai terlihat berbeda
                                    if (hl === 1) { ctx.fillStyle = 'rgba(120,53,15,0.35)'; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
                                    else if (hl === 2) { ctx.fillStyle = 'rgba(252,211,77,0.25)'; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
                                    else if (hl === 3) { ctx.fillStyle = 'rgba(167,243,208,0.2)'; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
                                    else if (hl === 4) { ctx.fillStyle = 'rgba(147,197,253,0.2)'; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
                                    else if (hl === 5) { ctx.fillStyle = 'rgba(253,186,116,0.25)'; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
                                } else {
                                    // Fallback warna solid per level
                                    const floorColors = ['#78350f','#92400e','#065f46','#1e3a8a','#92400e'];
                                    ctx.fillStyle = floorColors[(hl - 1)] || '#78350f';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            /* REVISI: Handle Merchant Floor (ID 10) - Menggunakan images/tilelantaikampus.png */
                            else if (t === 10 && STATE.location === 'merchant_interior') {
                                if (wallAssets.schoolFloor.complete && wallAssets.schoolFloor.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.schoolFloor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback ke warna dasar jika gambar belum load
                                    ctx.fillStyle = '#78350f';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            /* REVISI: Handle Mentor Floor (ID 10) - UPDATE: Menggunakan images/lantaimentor.png */
                            else if (t === 10 && STATE.location === 'mentor_interior') {
                                if (mentorAssets.floor.complete && mentorAssets.floor.naturalWidth !== 0) {
                                    ctx.drawImage(mentorAssets.floor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback ke warna dasar jika gambar belum load
                                    ctx.fillStyle = '#78350f';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle School Floor (ID 10 in School Interior)
                            else if (t === 10 && STATE.location === 'school_interior') {
                                if (wallAssets.schoolFloor.complete && wallAssets.schoolFloor.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.schoolFloor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback ke warna dasar jika gambar belum load
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle Library Floor (ID 10 in Library Interior)
                            else if (t === 10 && STATE.location === 'library_interior') {
                                if (wallAssets.libraryFloor.complete && wallAssets.libraryFloor.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.libraryFloor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback ke warna dasar
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle Guild Floor (ID 10 in Guild Interior)
                            else if (t === 10 && STATE.location === 'guild_interior') {
                                if (wallAssets.guildFloor.complete && wallAssets.guildFloor.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.guildFloor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback ke warna dasar
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle Clinic Floor (ID 10 in Clinic Interior)
                            // UPDATE: Menggunakan images/lantaiklinik.png
                            else if (t === 10 && STATE.location === 'clinic_interior') {
                                if (clinicAssets.floor.complete && clinicAssets.floor.naturalWidth !== 0) {
                                    ctx.drawImage(clinicAssets.floor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback ke warna putih/abu
                                    ctx.fillStyle = '#f8fafc';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle Blacksmith Floor (ID 10 in Blacksmith Interior)
                            // UPDATE: Menggunakan Lantai Mentor (Kayu) agar sama dengan tetangga
                            else if (t === 10 && STATE.location === 'blacksmith_interior') {
                                if (mentorAssets.floor.complete && mentorAssets.floor.naturalWidth !== 0) {
                                    ctx.drawImage(mentorAssets.floor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback ke warna kayu
                                    ctx.fillStyle = '#78350f';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle Guild Wall (ID 2 in Guild Interior)
                            else if (t === 2 && STATE.location === 'guild_interior') {
                                if (wallAssets.guildWall.complete && wallAssets.guildWall.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.guildWall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    ctx.fillStyle = '#475569'; // Fallback warna tembok
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle Blacksmith Wall (ID 2 in Blacksmith Interior)
                            else if (t === 2 && STATE.location === 'blacksmith_interior') {
                                if (wallAssets.blacksmithWall.complete && wallAssets.blacksmithWall.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.blacksmithWall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    ctx.fillStyle = '#262626'; // Fallback warna tembok
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // --- NEW: HANDLE ANIMASI OMBAK LAUT (VILLAGE WATER) ---
                            else if (t === 0 && STATE.location === 'village') {
                                // Jika BG tidak load, gambar warna dasar air
                                if (!isBgLoaded) {
                                    // UPDATE: Ganti warna air jadi BIRU TERANG agar ikan hitam terlihat jelas
                                    ctx.fillStyle = '#0ea5e9'; // Sebelumnya #0f172a (Terlalu gelap)
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }

                                // GAMBAR OMBAK BERGERAK (Visual Effect)
                                // ... existing wave logic ...
                                if (((x * 17 + y * 23) % 7) === 0) {

                                    // Kalkulasi Gerakan Sinusoidal (Naik Turun halus)
                                    const time = Date.now() / 600; // Kecepatan ombak
                                    const waveY = Math.sin(time + x * 0.5) * 2; // Offset Y

                                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'; // Putih Transparan
                                    ctx.lineWidth = 1.5;
                                    ctx.lineCap = 'round';

                                    const wx = x * TILE_SIZE;
                                    const wy = y * TILE_SIZE + 15; // Tengah Tile

                                    ctx.beginPath();
                                    // Gambar kurva gelombang kecil
                                    ctx.moveTo(wx + 5, wy + waveY);
                                    ctx.quadraticCurveTo(wx + 15, wy + waveY - 4, wx + 25, wy + waveY);
                                    ctx.stroke();
                                }
                            }

                            // --- NEW: Handle Ruins Wall (ID 2 in Ruins Battle) ---
                            else if (t === 2 && STATE.location === 'ruins_battle') {
                                // FIX: Gambar background warna dulu agar tidak bolong/hitam jika gambar gagal load
                                ctx.fillStyle = '#57534e'; // Warna batu abu-abu (lebih terang dari background)
                                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                                if (ruinsAssets.wall.complete && ruinsAssets.wall.naturalWidth !== 0) {
                                    ctx.drawImage(ruinsAssets.wall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback texture visual tembok jika gambar belum muncul
                                    ctx.fillStyle = '#292524'; // Detail gelap (batu-batu)
                                    ctx.fillRect(x * TILE_SIZE + 5, y * TILE_SIZE + 5, 10, 10);
                                    ctx.fillRect(x * TILE_SIZE + 15, y * TILE_SIZE + 15, 10, 10);
                                    // Border biar kelihatan tembok
                                    ctx.strokeStyle = '#a8a29e';
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // Handle Dungeon/Candi Wall (ID 2)
                            // UPDATE: Menggunakan tekstur tembok dungeon untuk Candi juga
                            else if (t === 2 && (STATE.location === 'dungeon' || STATE.location === 'candi_interior')) {
                                // PERBAIKAN: Gambar Lantai DULU di bawah Tembok agar batu terlihat 'nempel' di lantai, tidak bolong
                                if (dungeonAssets.floor.complete && dungeonAssets.floor.naturalWidth !== 0) {
                                    ctx.drawImage(dungeonAssets.floor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    ctx.fillStyle = '#3f3f46'; // Fallback warna lantai jika gambar belum load
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }

                                // Baru gambar tembok/batu di atasnya
                                if (dungeonAssets.wall.complete && dungeonAssets.wall.naturalWidth !== 0) {
                                    ctx.drawImage(dungeonAssets.wall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback Wall Style
                                    ctx.fillStyle = '#1e293b'; // Dark Wall
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    ctx.fillStyle = '#000'; // Shadow/Detail
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE + 25, TILE_SIZE, 5);
                                }
                            }

                            // NEW: Handle House Wall (ID 11 in House & Mentor) - UPDATE: Masukkan mentor_interior & player_shop_interior
                            // UPDATE: Menambahkan 'player_shop_interior' agar tembok samping sama dengan rumah
                            else if (t === 11 && (STATE.location === 'house' || STATE.location === 'mentor_interior' || STATE.location === 'player_shop_interior')) {
                                if (wallAssets.houseWall.complete && wallAssets.houseWall.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.houseWall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    ctx.fillStyle = '#f1f5f9';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle House Wall Bottom (ID 13 in House & Mentor) - UPDATE: Masukkan mentor_interior & player_shop_interior
                            // UPDATE: Menambahkan 'player_shop_interior' agar tembok atas/bawah sama dengan rumah
                            else if (t === 13 && (STATE.location === 'house' || STATE.location === 'mentor_interior' || STATE.location === 'player_shop_interior')) {
                                if (wallAssets.houseWallBottom.complete && wallAssets.houseWallBottom.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.houseWallBottom, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    ctx.fillStyle = '#f1f5f9'; // Fallback
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle School Wall (ID 11 in School Interior)
                            else if (t === 11 && STATE.location === 'school_interior') {
                                if (wallAssets.school.complete && wallAssets.school.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.school, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback jika gambar belum diload (Warna Putih/Abu)
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle Library Wall (ID 11 in Library Interior)
                            else if (t === 11 && STATE.location === 'library_interior') {
                                if (wallAssets.libraryWall.complete && wallAssets.libraryWall.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.libraryWall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback jika gambar belum diload
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle Clinic Wall (ID 11 in Clinic Interior)
                            // Menggunakan tembok perpus (putih)
                            else if (t === 11 && STATE.location === 'clinic_interior') {
                                if (wallAssets.libraryWall.complete && wallAssets.libraryWall.naturalWidth !== 0) {
                                    ctx.drawImage(wallAssets.libraryWall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // NEW: Handle Wedding Wall & Floor (ID 11 & 10 in Wedding Interior)
                            else if ((t === 11 || t === 10) && STATE.location === 'wedding_interior') {
                                if (t === 11) { // Wall
                                    if (wallAssets.libraryWall.complete && wallAssets.libraryWall.naturalWidth !== 0) {
                                        ctx.drawImage(wallAssets.libraryWall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    } else {
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                } else if (t === 10) { // Floor
                                    if (wallAssets.libraryFloor.complete && wallAssets.libraryFloor.naturalWidth !== 0) {
                                        ctx.drawImage(wallAssets.libraryFloor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    } else {
                                        // Fallback Floor
                                        ctx.fillStyle = '#fdf2f8'; // Pinkish white
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                }
                            }

                            // NEW: Handle Ayu's House Wall & Floor (ID 11 & 10 in Lover1 Interior)
                            else if ((t === 11 || t === 10) && STATE.location === 'lover1_interior') {
                                if (t === 11) { // Wall (Pakai Wall Rumah Player)
                                    if (wallAssets.houseWall.complete && wallAssets.houseWall.naturalWidth !== 0) {
                                        ctx.drawImage(wallAssets.houseWall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    } else {
                                        ctx.fillStyle = '#fef3c7'; // Cream wall
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                } else if (t === 10) { // Floor (UPDATE: Pakai Lantai Mentor)
                                    if (mentorAssets.floor.complete && mentorAssets.floor.naturalWidth !== 0) {
                                        ctx.drawImage(mentorAssets.floor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    } else {
                                        ctx.fillStyle = '#78350f';
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                }
                            }

                            // NEW: Handle Fisherman House Wall & Floor (ID 11 & 10 in Fisherman Interior)
                            else if ((t === 11 || t === 10) && STATE.location === 'fisherman_interior') {
                                if (t === 11) { // Wall
                                    if (wallAssets.houseWall.complete && wallAssets.houseWall.naturalWidth !== 0) {
                                        ctx.drawImage(wallAssets.houseWall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    } else {
                                        ctx.fillStyle = '#e2e8f0'; // Slate white
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                } else if (t === 10) { // Floor (UPDATE: Pakai Lantai Mentor)
                                    if (mentorAssets.floor.complete && mentorAssets.floor.naturalWidth !== 0) {
                                        ctx.drawImage(mentorAssets.floor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    } else {
                                        ctx.fillStyle = '#b45309';
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                }
                            }

                            // Handle Other Tiles (UPDATE: Exclude t=0/Water from this fallback)
                            else if (t !== 2 && t !== 12 && t !== 4 && t !== 0) {
                                if (!(isBgLoaded && (t === 9 || t === 1))) {
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }
                            }

                            // Handle Trees (Village only for ID 2 & 12)
                            // UPDATE: Hanya gambar pohon jika di Village (Agar tidak muncul di Blacksmith/Guild yang pakai ID 2)
                            if ((t === 2 || t === 12) && STATE.location === 'village') {
                                if (!isBgLoaded) {
                                    ctx.fillStyle = '#1e293b';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }

                                let trunkImg = (t === 12) ? treeAssets.sakuraTrunk : treeAssets.trunk;

                                if (trunkImg && trunkImg.complete && trunkImg.naturalWidth !== 0) {
                                    ctx.drawImage(trunkImg, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    ctx.fillStyle = '#5D4037';
                                    const trunkW = 12; const trunkH = 24;
                                    const tx = x * TILE_SIZE + (TILE_SIZE - trunkW) / 2;
                                    const ty = y * TILE_SIZE + (TILE_SIZE - trunkH);
                                    ctx.fillRect(tx, ty, trunkW, trunkH);
                                }
                            }

                            // FIX: Menghapus syarat !isBgLoaded agar lahan pertanian selalu digambar
                            if (t === 5) {
                                // NEW: Ambil Data Pertanian (Tilled/Crop)
                                const farmKey = `${x}_${y}`;
                                const farmData = STATE.player.farming ? STATE.player.farming[farmKey] : null;

                                // UPDATE: MENGGUNAKAN GAMBAR LAHAN LIAR (images/lahan-liar.png)
                                if (farmAssets.lahanLiar.complete && farmAssets.lahanLiar.naturalWidth !== 0) {
                                    ctx.drawImage(farmAssets.lahanLiar, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                                    // NEW: VISUAL TANAH GEMBUR (TILLED) - Overlay Gelap + Garis
                                    if (farmData && farmData.tilled) {
                                        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Overlay Gelap
                                        ctx.fillRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);

                                        // Garis Bajak (Detail)
                                        ctx.fillStyle = 'rgba(60, 30, 10, 0.4)';
                                        ctx.fillRect(x * TILE_SIZE + 4, y * TILE_SIZE + 8, TILE_SIZE - 8, 2);
                                        ctx.fillRect(x * TILE_SIZE + 4, y * TILE_SIZE + 15, TILE_SIZE - 8, 2);
                                        ctx.fillRect(x * TILE_SIZE + 4, y * TILE_SIZE + 22, TILE_SIZE - 8, 2);
                                    }

                                    // NEW: VISUAL TANAMAN (CROP) & STATUS AIR
                                    if (farmData && farmData.type) {
                                        // Indikator Tanah Basah (Watered)
                                        if (farmData.watered) {
                                            ctx.fillStyle = 'rgba(56, 189, 248, 0.5)'; // Biru Transparan
                                            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                        }

                                        // Ikon Tanaman Berdasarkan Stage
                                        const stage = farmData.stage || 1;
                                        let icon = '🌱'; // Stage 1 (Bibit/Tunas)

                                        if (stage === 2) {
                                            icon = '🌿'; // Stage 2 Default (Tanaman Muda)

                                            // KHUSUS RAFFLESIA: Tampilkan Kuncup/Bunga Mati saat kecil
                                            if (farmData.type === 'rafflesia') icon = '🥀';
                                            // KHUSUS JAGUNG/TOMAT: Tampilkan tanaman hijau lebih besar
                                            else if (farmData.type === 'jagung' || farmData.type === 'tomat') icon = '🌲';
                                        }

                                        if (stage >= 3) { // Stage 3 (Siap Panen - Sempurna)
                                            if (farmData.type === 'padi') icon = '🌾';
                                            else if (farmData.type === 'jagung') icon = '🌽';
                                            else if (farmData.type === 'tomat') icon = '🍅';
                                            else if (farmData.type === 'rafflesia') icon = '🌺'; // Visual Rafflesia Mekar
                                        }

                                        ctx.font = '20px Arial';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        // Shadow biar jelas
                                        ctx.fillStyle = 'rgba(0,0,0,0.5)';
                                        ctx.fillText(icon, x * TILE_SIZE + 16, y * TILE_SIZE + 17);
                                        ctx.fillStyle = '#fff';
                                        ctx.fillText(icon, x * TILE_SIZE + 15, y * TILE_SIZE + 15);
                                    }

                                    // Efek Salju di atas lahan saat Winter
                                    if (STATE.season === 'winter') {
                                        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                    }
                                } else {
                                    // Fallback ke Kotak Coklat Lama (Jika gambar belum load)
                                    ctx.fillStyle = STATE.season === 'winter' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(146, 64, 14, 0.6)';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                                    // Gambar gundukan tanah (detail)
                                    ctx.fillStyle = STATE.season === 'winter' ? '#cbd5e1' : '#d97706';
                                    // Pola gundukan tanah
                                    ctx.fillRect(x * TILE_SIZE + 5, y * TILE_SIZE + 5, TILE_SIZE - 10, TILE_SIZE - 10);
                                }
                            }

                            // NEW: DRAW RUINS FLOOR (ID 7)
                            if (t === 7) {
                                // FIX: LAYERED RENDERING (LANTAI DI ATAS TEMBOK)
                                // Sesuai request: Lantai tetap gambar lama, tapi lubang di tengah diisi tembok.

                                // 1. LAYER BAWAH: Gambar Tembok (Untuk mengisi bagian yang bolong/transparan)
                                if (ruinsAssets.wall.complete && ruinsAssets.wall.naturalWidth !== 0) {
                                    ctx.drawImage(ruinsAssets.wall, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback warna batu jika gambar tembok belum load
                                    ctx.fillStyle = '#57534e';
                                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                }

                                // 2. LAYER ATAS: Gambar Lantai Reruntuhan (Overlay Utama)
                                if (ruinsAssets.floor.complete && ruinsAssets.floor.naturalWidth !== 0) {
                                    ctx.drawImage(ruinsAssets.floor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                                } else {
                                    // Fallback detail jika gambar lantai gagal
                                    ctx.strokeStyle = '#44403c';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(x * TILE_SIZE, y * TILE_SIZE);
                                    ctx.lineTo(x * TILE_SIZE + 10, y * TILE_SIZE + 10);
                                    ctx.stroke();
                                }
                            }

                            if (t === 9) {
                                ctx.fillStyle = '#06b6d4';
                                const pulse = Math.sin(Date.now() / 200) * 2;
                                ctx.beginPath(); ctx.arc(x * TILE_SIZE + 15, y * TILE_SIZE + 15, 10 + pulse, 0, 6.28); ctx.fill();

                                ctx.font = 'bold 8px "Exo 2"';
                                ctx.fillStyle = '#fff';
                                ctx.textAlign = 'center';
                                ctx.fillText("ENTER", x * TILE_SIZE + 15, y * TILE_SIZE - 5 + pulse);
                            }
                        }
                    }
                }

                // --- NEW: RENDER SILUET IKAN (LAYER BAWAH - UNDERWATER) ---
                // Digambar setelah Tiles/Background tapi SEBELUM Objek/Player/Dermaga
                if (STATE.location === 'village') {
                    STATE.critters.forEach(c => {
                        if (c.type === 'fish_silhouette') {
                            ctx.save();
                            ctx.translate(c.x, c.y);

                            // Rotasi sesuai arah gerak
                            const angle = Math.atan2(c.vy, c.vx);
                            ctx.rotate(angle);

                            // UPDATE: Warna dipertegas (Hitam Pekat 0.8) agar kontras dengan air biru
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';

                            // 1. Badan Ikan (Oval)
                            ctx.beginPath();
                            ctx.ellipse(0, 0, 10 * c.size, 4 * c.size, 0, 0, Math.PI * 2);
                            ctx.fill();

                            // 2. Ekor Ikan (Segitiga di belakang)
                            ctx.beginPath();
                            ctx.moveTo(-8 * c.size, 0);
                            ctx.lineTo(-14 * c.size, -4 * c.size);
                            ctx.lineTo(-14 * c.size, 4 * c.size);
                            ctx.fill();

                            // 3. Sirip Samping (Kecil)
                            ctx.beginPath();
                            ctx.moveTo(2 * c.size, 2 * c.size);
                            ctx.lineTo(-2 * c.size, 6 * c.size);
                            ctx.lineTo(-2 * c.size, 2 * c.size);
                            ctx.fill();

                            ctx.restore();
                        }
                    });
                }

                // --- FIX: HAPUS BLOK KODE "GHOST" INI ---
                // Blok kode di bawah ini menggambar objek TANPA cek musim, menyebabkan Snowman muncul terus.
                // Kita hapus karena objek sudah digambar ulang dengan benar di 'renderList' di bawahnya.

                /*
                map.objects.forEach(o => {
                    ctx.fillStyle = 'rgba(0,0,0,0.3)';
                    
                    // UPDATE: Bayangan mengikuti ukuran objek
                    const shadowW = (o.w || 1) * 12;
                    const centerX = (o.x * TILE_SIZE) + ((o.w || 1) * TILE_SIZE / 2);
                    const centerY = (o.y * TILE_SIZE) + ((o.h || 1) * TILE_SIZE) - 2;
                    
                    ctx.beginPath(); 
                    ctx.ellipse(centerX, centerY, shadowW, 4, 0, 0, Math.PI*2); 
                    ctx.fill();
                    
                    // PERBAIKAN: Support Gambar untuk Object (Buku & Telpon)
                    if (o.img) {
                        if (!o.loadedImg) {
                            o.loadedImg = new Image();
                            o.loadedImg.src = o.img;
                        }
                        
                        if (o.loadedImg.complete && o.loadedImg.naturalWidth !== 0) {
                            // UPDATE: Gambar object sesuai ukuran custom (w/h)
                            const drawW = (o.w || 1) * TILE_SIZE;
                            const drawH = (o.h || 1) * TILE_SIZE;
                            ctx.drawImage(o.loadedImg, o.x*TILE_SIZE, o.y*TILE_SIZE, drawW, drawH);
                        } else {
                            // Fallback ke Icon jika gambar belum load/error
                            ctx.font = '20px Arial';
                            ctx.fillText(o.icon, o.x*TILE_SIZE+5, o.y*TILE_SIZE+25);
                        }
                    } else {
                        // Default Icon Rendering
                        ctx.font = '20px Arial';
                        ctx.fillText(o.icon, o.x*TILE_SIZE+5, o.y*TILE_SIZE+25);
                    }
                });
                */

                if (DEBUG_MAP_BOUNDARIES && STATE.location === 'village') {
                    ctx.save();
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 5;
                    /* Gunakan konstanta atau nilai besar untuk debug boundary */
                    ctx.strokeRect(5 * TILE_SIZE, 5 * TILE_SIZE, 50 * TILE_SIZE, 30 * TILE_SIZE);

                    ctx.fillStyle = 'red';
                    ctx.font = 'bold 30px Arial';
                    ctx.fillText("BATAS PULAU", 5 * TILE_SIZE + 20, 5 * TILE_SIZE + 50);
                    ctx.restore();
                }

                if (STATE.location === 'house') {
                    const furn = STATE.player.furniture;
                    if (furn.includes('carpet_red')) {
                        ctx.fillStyle = '#b91c1c';
                        ctx.transform(1, 0, -0.2, 1, 0, 0);
                        ctx.fillRect(4 * TILE_SIZE + 10, 4 * TILE_SIZE, 7 * TILE_SIZE, 4 * TILE_SIZE);
                        ctx.transform(1, 0, 0.2, 1, 0, 0);
                    }
                    if (furn.includes('tv_flat')) {
                        ctx.fillStyle = '#111';
                        ctx.fillRect(6 * TILE_SIZE, 1 * TILE_SIZE + 10, 3 * TILE_SIZE, 5);
                        ctx.fillStyle = '#000';
                        ctx.fillRect(6 * TILE_SIZE, 1 * TILE_SIZE, 3 * TILE_SIZE, 15);
                        ctx.fillStyle = '#222';
                        ctx.fillRect(6 * TILE_SIZE, 1 * TILE_SIZE, 3 * TILE_SIZE, 1);
                    }
                    // --- RUMAH KURCACI (muncul di sudut dalam rumah player jika sudah dibeli) ---
                    if (furn.includes('rumah_kurcaci')) {
                        const houseMap = maps['house'];
                        if (houseMap) {
                            const rx = (houseMap.w - 3) * TILE_SIZE;
                            const ry = (houseMap.h - 4) * TILE_SIZE;
                            const kurcaciImg = new Image();
                            kurcaciImg.src = 'images/kurcacitani.png';
                            // Gambar rumah mungil (kotak kayu kecil)
                            ctx.fillStyle = '#92400e';
                            ctx.fillRect(rx, ry, TILE_SIZE * 2, TILE_SIZE * 2);
                            ctx.fillStyle = '#78350f';
                            ctx.fillRect(rx + 4, ry + 4, TILE_SIZE * 2 - 8, TILE_SIZE * 2 - 8);
                            // Atap segitiga
                            ctx.fillStyle = '#b45309';
                            ctx.beginPath();
                            ctx.moveTo(rx - 4, ry);
                            ctx.lineTo(rx + TILE_SIZE, ry - 14);
                            ctx.lineTo(rx + TILE_SIZE * 2 + 4, ry);
                            ctx.closePath();
                            ctx.fill();
                            // Pintu kecil
                            ctx.fillStyle = '#451a03';
                            ctx.fillRect(rx + TILE_SIZE - 6, ry + TILE_SIZE, 12, TILE_SIZE - 4);
                            // Label
                            ctx.fillStyle = '#fbbf24';
                            ctx.font = 'bold 8px Fredoka';
                            ctx.textAlign = 'center';
                            ctx.fillText('🏠 Rumah Kurcaci', rx + TILE_SIZE, ry - 18);
                            ctx.textAlign = 'left';
                        }
                    }
                }

                let renderList = [];

                // UPDATE: Pindahkan Objek ke RenderList agar support Z-Sorting (Pemain bisa di belakang kursi)
                // Sebelumnya objek digambar langsung sebelum loop ini, sekarang digabung.
                if (map.objects) {
                    map.objects.forEach(o => {
                        if (o.seasonReq && o.seasonReq !== STATE.season) return;

                        // Y-sort: pakai posisi KAKI objek (bawah sprite)
                        const h = (o.h || 1);
                        const sortY = (o.y + h) * TILE_SIZE;

                        renderList.push({
                            type: 'object',
                            y: sortY,
                            data: o
                        });
                    });
                }

                if (map.buildings) {
                    map.buildings.forEach(b => {
                        if (typeof b.y !== 'number' || typeof b.h !== 'number') return;

                        // FIX: Di fairyVillage, bangunan dirender oleh drawFairyWorld() dengan Y-sort
                        // bersama player & peri — skip dari renderList utama agar tidak dobel & Y-sort benar
                        if (STATE.location === 'fairyVillage') return;

                        const _rTS = TILE_SIZE;

                        // Y-sort bangunan: pakai kaki bangunan (y + h)
                        // 'port' (dermaga) digambar sebagai lantai → sort dari atas
                        let sortY = (b.y + b.h) * _rTS;
                        if (b.id === 'port') sortY = b.y * _rTS;

                        renderList.push({
                            type: 'building',
                            y: sortY,
                            data: b
                        });
                    });
                }

                // FIX: Di fairyVillage, player dirender oleh drawFairyWorld() dengan Y-sort bersama peri NPC
                // Agar player tidak selalu di bawah peri, skip dari renderList di sini
                if (STATE.location !== 'fairyVillage') {
                    renderList.push({
                        type: 'player',
                        // Y-sort pakai posisi KAKI player yang sebenarnya
                        // Player sprite digambar: ctx.translate(p.x+p.w/2, p.y+p.h/2) lalu drawImage(-19,-46,38,58)
                        // → kaki sprite ada di p.y + p.h/2 + (58-46) = p.y + 10 + 12 = p.y + 22
                        // Gunakan p.y + 22 agar y-sort tepat di kaki
                        y: STATE.player.y + 22,
                        data: STATE.player
                    });
                }

                // --- NEW: RENDER HANTU PEMAIN LAIN ---
                if (STATE.ghosts && STATE.ghosts.length > 0) {
                    STATE.ghosts.forEach(g => {
                        // Hanya gambar jika berada di lokasi (map) yang sama
                        if (g.location === STATE.location) {
                            renderList.push({
                                type: 'ghost',
                                y: g.y + 20, // Estimasi kaki
                                data: g
                            });
                        }
                    });
                }

                map.npcs.forEach(n => {
                    // FIX: Skip NPC render di fairyVillage — drawFairyWorld() sudah render semua NPC di sana
                    if (STATE.location === 'fairyVillage') return;
                    if (!isNPCActive(n)) return;

                    // Y-sort NPC: pakai posisi KAKI sprite
                    // NPC digambar mulai dari n.y * TILE_SIZE, tinggi sprite = n.h
                    // Kaki ada di bagian bawah: (n.y * TILE_SIZE) + (n.h || 48)
                    // Kurangi sedikit (4px) agar NPC tepat di depan player yang sejajar kaki
                    const npcFootY = (n.y * TILE_SIZE) + (n.h || 48) - 4;

                    renderList.push({
                        type: 'npc',
                        y: npcFootY,
                        data: n
                    });
                });

                if (STATE.location === 'dungeon' || STATE.location === 'ruins_battle') {
                    STATE.enemies.forEach(e => {
                        renderList.push({
                            type: 'enemy',
                            y: e.y + e.h,
                            data: e
                        });
                    });
                }

                renderList.sort((a, b) => a.y - b.y);

                renderList.forEach(item => {
                    try {
                        if (item.type === 'building') drawBuilding(ctx, item.data);
                        else if (item.type === 'player') drawPlayer(ctx, item.data);
                        else if (item.type === 'ghost') drawGhost(ctx, item.data); // <--- TAMBAHAN
                        else if (item.type === 'npc') drawNPC(ctx, item.data);
                        else if (item.type === 'enemy') drawEnemy(ctx, item.data);
                        else if (item.type === 'object') drawObject(ctx, item.data); // NEW: Handle drawObject
                    } catch (e) {
                        console.error("Render error:", e);
                    }
                });

                // ── Fairy Village: render bangunan, peri, partikel, minimap ──
                if (STATE.location === 'fairyVillage' && typeof drawFairyWorld === 'function' && fvCtx) {
                    drawFairyWorld(performance.now());
                }


                // ── Kahyangan Wilis: pakai HUD utama, fv-hud-bar dihapus ──
                {
                    const _fvBar = document.getElementById('fv-hud-bar');
                    if (_fvBar) _fvBar.style.display = 'none'; // Selalu sembunyikan — tidak dipakai lagi
                }

                if (STATE.location === 'village') {
                    for (let y = startRow; y <= endRow; y++) {
                        for (let x = startCol; x <= endCol; x++) {
                            if (y >= 0 && y < map.h && x >= 0 && x < map.w) {
                                const t = map.tiles[y * map.w + x];

                                if (t === 2 || t === 12) {
                                    let canopyImg = (t === 12) ? treeAssets.sakuraCanopy : treeAssets.canopy;

                                    if (canopyImg && canopyImg.complete && canopyImg.naturalWidth !== 0) {

                                        const canopyW = 64;
                                        const canopyH = 64;
                                        const cx = (x * TILE_SIZE) - (canopyW - TILE_SIZE) / 2;
                                        const cy = (y * TILE_SIZE) - (canopyH - 10);

                                        ctx.drawImage(canopyImg, cx, cy, canopyW, canopyH);

                                        // --- NEW: EFEK SALJU MENEMPEL DI POHON ---
                                        if (STATE.season === 'winter') {
                                            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Putih Salju
                                            // Gambar gumpalan salju di atas kanopi
                                            ctx.beginPath();
                                            ctx.arc(cx + canopyW / 2, cy + 20, 15, Math.PI, 0); // Setengah lingkaran atas
                                            ctx.fill();

                                            // Gumpalan kecil tambahan
                                            ctx.beginPath();
                                            ctx.arc(cx + canopyW / 2 - 15, cy + 30, 8, 0, Math.PI * 2);
                                            ctx.fill();
                                            ctx.beginPath();
                                            ctx.arc(cx + canopyW / 2 + 15, cy + 30, 8, 0, Math.PI * 2);
                                            ctx.fill();
                                        }
                                        // -----------------------------------------


                                        if (t === 12 && Math.random() < 0.05) {
                                            createParticle((x * TILE_SIZE) + 16, (y * TILE_SIZE) - 10, '#fbcfe8');
                                        }
                                    } else {
                                        let leafColor = (t === 12) ? '#f472b6' : '#15803d';
                                        if (STATE.season === 'autumn' && t !== 12) leafColor = '#d97706';
                                        // Jika Winter dan tidak ada gambar, ganti warna daun jadi putih
                                        if (STATE.season === 'winter' && t !== 12) leafColor = '#e2e8f0';



                                        ctx.fillStyle = leafColor;
                                        const centerX = x * TILE_SIZE + 16;
                                        const centerY = y * TILE_SIZE - 20;
                                        ctx.beginPath();
                                        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                            }
                        }
                    }
                }

                // --- UPDATE: RENDER CRITTERS UDARA (BIRD & BUTTERFLY) ---
                // Ikan sudah dirender di layer bawah, jadi di sini skip ikan
                STATE.critters.forEach(c => {
                    // SKIP IKAN (Sudah digambar di layer bawah)
                    if (c.type === 'fish_silhouette') return;

                    if (c.type === 'bird') {
                        ctx.strokeStyle = '#fff';
                        if (STATE.time > 1500) ctx.strokeStyle = '#cbd5e1';

                        ctx.lineWidth = 1.5;
                        ctx.beginPath();

                        const flapY = Math.sin(c.flap) * 3;

                        ctx.moveTo(c.x, c.y);
                        ctx.lineTo(c.x - 5, c.y - 2 + flapY);
                        ctx.moveTo(c.x, c.y);
                        ctx.lineTo(c.x + 5, c.y - 2 + flapY);
                        ctx.stroke();

                        ctx.fillStyle = 'rgba(0,0,0,0.1)';
                        ctx.beginPath();
                        ctx.ellipse(c.x - 20, c.y + 40, 4, 2, 0, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    /* LOGIKA IKAN DIHAPUS DARI SINI (PINDAH KE drawFish DI ATAS) */
                    else if (c.type === 'butterfly') {
                        ctx.fillStyle = c.color;
                        const flapW = Math.abs(Math.sin(Date.now() / 100)) * 3;
                        ctx.beginPath();
                        ctx.ellipse(c.x - 2, c.y, flapW, 3, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.ellipse(c.x + 2, c.y, flapW, 3, 0, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                if (STATE.fishing.active) {
                    ctx.save();
                    ctx.translate(STATE.player.x, STATE.player.y - 30);

                    ctx.fillStyle = '#334155';
                    ctx.fillRect(-25, 0, 50, 10);

                    const tStart = (STATE.fishing.targetStart / 100) * 50 - 25;
                    const tWidth = (STATE.fishing.targetWidth / 100) * 50;
                    ctx.fillStyle = '#4ade80';
                    ctx.fillRect(tStart, 0, tWidth, 10);

                    const indX = (STATE.fishing.barX / 100) * 50 - 25;
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(indX, -2, 2, 14);

                    ctx.restore();
                }

                STATE.particles.forEach(p => {
                    // --- UPDATE: RENDER PARTIKEL NADA MUSIK ---
                    if (p.type === 'note') {
                        ctx.save();
                        ctx.font = `bold ${p.size}px Arial`;
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = p.life / 80; // Fade out effect
                        ctx.fillText(p.icon, p.x, p.y);
                        ctx.restore();
                    }
                    // NEW: RENDER PARTIKEL CIPRATAN AIR
                    else if (p.type === 'splash') {
                        ctx.save();
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = p.life / 25; // Fade out seiring umur
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); // Bentuk bulat air
                        ctx.fill();
                        ctx.restore();
                    }
                    // --- NEW: RENDER LOVE BUBBLE (Gelembung Hati) ---
                    else if (p.type === 'love_bubble') {
                        ctx.save();
                        ctx.translate(p.x, p.y);

                        // Animasi Pop-up (Membesar saat muncul)
                        let scale = 1;
                        if (p.life > 50) scale = (60 - p.life) / 10;
                        ctx.scale(scale, scale);

                        // Bubble Background (Lingkaran Putih)
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                        ctx.strokeStyle = '#fda4af'; // Pink pastel border
                        ctx.lineWidth = 2;

                        ctx.beginPath();
                        ctx.arc(0, 0, 14, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();

                        // Ekor Bubble Kecil (Biar kayak chat)
                        ctx.beginPath();
                        ctx.moveTo(0, 12);
                        ctx.lineTo(-4, 18);
                        ctx.lineTo(4, 16);
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                        ctx.fill();

                        // Icon Heart di Tengah
                        ctx.font = "16px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = "#ef4444"; // Merah Hati
                        ctx.fillText("❤️", 0, 2); // Sedikit turun agar pas tengah visual

                        ctx.restore();
                    }
                    // --- FIX: RENDER CHAT BUBBLE (GELEMBUNG BICARA "...") ---
                    else if (p.type === 'chat_bubble') {
                        ctx.save();
                        ctx.translate(p.x, p.y);

                        // Efek Pop-up (Membesar saat muncul)
                        let scale = 1;
                        if (p.life > 60) scale = (70 - p.life) / 10;
                        ctx.scale(scale, scale);

                        // 1. Gambar Bubble Putih (Oval)
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                        ctx.strokeStyle = '#64748b'; // Border abu-abu
                        ctx.lineWidth = 1;

                        ctx.beginPath();
                        ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2); // Lebar 14, Tinggi 10
                        ctx.fill();
                        ctx.stroke();

                        // 2. Ekor Bubble
                        ctx.beginPath();
                        ctx.moveTo(-2, 8);   // Kiri bawah oval
                        ctx.lineTo(-5, 14);  // Ujung ekor
                        ctx.lineTo(2, 9);    // Kanan bawah oval
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                        ctx.fill();
                        // Opsional: stroke ekor (biasanya tidak perlu agar menyatu)

                        // 3. Teks "..." di Tengah
                        ctx.fillStyle = '#0f172a'; // Teks Hitam
                        ctx.font = "bold 12px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText("...", 0, -2); // Sedikit naik agar pas di tengah

                        ctx.restore();
                    }
                    // --- NEW: RENDER DUST PARTICLE (JEJAK LARI) ---
                    else if (p.type === 'dust') {
                        ctx.save();
                        ctx.fillStyle = p.color;
                        // Efek Fade Out: Transparansi berkurang seiring sisa umur (life)
                        ctx.globalAlpha = Math.max(0, p.life / 30);

                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); // Lingkaran debu
                        ctx.fill();

                        // Efek Shrink: Mengecil perlahan
                        if (p.size > 0.5) p.size *= 0.95;

                        ctx.restore();
                    }
                    // --- NEW: RENDER SPIRIT AURA (PARTIKEL DEWI RORO) ---
                    else if (p.type === 'spirit_aura') {
                        ctx.save();
                        ctx.fillStyle = p.color;
                        ctx.shadowColor = p.color;
                        ctx.shadowBlur = 8; // Glow effect
                        ctx.globalAlpha = p.life / 80; // Fade out halus

                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.restore();
                    }
                    else {
                        // Render Partikel Kotak Biasa
                        ctx.fillStyle = p.color;
                        ctx.fillRect(p.x, p.y, 4, 4);
                    }
                });

                // --- NEW: DRAW FLOATING TEXTS ---
                STATE.floatingTexts.forEach(ft => {
                    ctx.save();
                    ctx.font = `bold ${ft.size}px "Exo 2"`;
                    ctx.fillStyle = ft.color;
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 2;
                    ctx.strokeText(ft.text, ft.x, ft.y);
                    ctx.fillText(ft.text, ft.x, ft.y);
                    ctx.restore();
                });

                if (STATE.lightningTimer > 10) {
                    ctx.save();
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.shadowColor = '#fff';
                    ctx.shadowBlur = 20;
                    ctx.beginPath();

                    let lx = STATE.camera.x + (Math.random() * GAME_WIDTH);
                    let ly = STATE.camera.y - 50;

                    ctx.moveTo(lx, ly);
                    while (ly < STATE.camera.y + GAME_HEIGHT) {
                        lx += (Math.random() - 0.5) * 50;
                        ly += (Math.random() * 40) + 20;
                        ctx.lineTo(lx, ly);
                    }
                    ctx.stroke();
                    ctx.restore();
                }

                ctx.restore();

                // ── FESTIVAL VISUAL OVERLAY ─────────────────────────────────
                if (STATE.festivalActive && STATE.activeFestivalData && STATE.location === 'village') {
                    drawFestivalOverlay();
                }

                // 🧚 SYLVARIA AMBIENT OVERLAY — Partikel cahaya mengambang, banner magis
                if (STATE.location === 'sylvaria') {
                    const now = Date.now();
                    const pComp = STATE.player.sylvariaQuestComplete;

                    // Banner atas
                    ctx.save();
                    ctx.fillStyle = pComp ? 'rgba(74,222,128,0.85)' : 'rgba(15,23,42,0.8)';
                    ctx.fillRect(0, 0, GAME_WIDTH, 32);
                    ctx.font = 'bold 14px monospace';
                    ctx.fillStyle = pComp ? '#fff' : '#86efac';
                    ctx.textAlign = 'center';
                    ctx.fillText(pComp ? '🌳 KAHYANGAN WILIS — Hidup Kembali! ✨' : '🌒 KAHYANGAN WILIS — Mohon bantuanmu, Bhayangkara...', GAME_WIDTH / 2, 21);
                    ctx.restore();

                    // Partikel cahaya mengambang
                    if (!STATE._sylvariaParticles) {
                        STATE._sylvariaParticles = Array.from({length: pComp ? 30 : 8}, (_, i) => ({
                            x: Math.random() * GAME_WIDTH,
                            y: Math.random() * GAME_HEIGHT,
                            vy: -(0.3 + Math.random() * 0.4),
                            vx: (Math.random() - 0.5) * 0.3,
                            alpha: Math.random(),
                            size: 2 + Math.random() * 3,
                            color: pComp ? ['#4ade80','#86efac','#fbbf24','#bae6fd'][Math.floor(Math.random()*4)] : '#4ade80'
                        }));
                    }
                    ctx.save();
                    STATE._sylvariaParticles.forEach(p => {
                        p.y += p.vy; p.x += p.vx;
                        p.alpha -= 0.005;
                        if (p.alpha <= 0 || p.y < 0) {
                            p.x = Math.random() * GAME_WIDTH;
                            p.y = GAME_HEIGHT;
                            p.alpha = 0.6 + Math.random() * 0.4;
                            p.color = pComp ? ['#4ade80','#86efac','#fbbf24','#bae6fd'][Math.floor(Math.random()*4)] : '#4ade80';
                        }
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    ctx.globalAlpha = 1;
                    ctx.restore();

                    // Glow pada Pohon Beringin Agung (pojok atas tengah)
                    const treeX = (14 - (STATE.player.x/TILE_SIZE - GAME_WIDTH/TILE_SIZE/2)) * TILE_SIZE;
                    const treeY = (2 - (STATE.player.y/TILE_SIZE - GAME_HEIGHT/TILE_SIZE/2)) * TILE_SIZE;
                    const glowColor = pComp ? 'rgba(74,222,128,' : 'rgba(120,53,15,';
                    const glowPulse = Math.sin(now * 0.002) * 0.15 + 0.25;
                    const grad = ctx.createRadialGradient(treeX + 60, treeY + 45, 5, treeX + 60, treeY + 45, 80);
                    grad.addColorStop(0, glowColor + (glowPulse + 0.2) + ')');
                    grad.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = grad;
                    ctx.fillRect(treeX - 20, treeY - 10, 160, 110);
                }

                let overlayColor = 'rgba(0,0,0,0)';

                if (STATE.location === 'village') {
                    if (STATE.weather === 'rain') {
                        overlayColor = 'rgba(10, 15, 40, 0.5)';

                        if (STATE.time >= 2000 || STATE.time < 400) {
                            overlayColor = 'rgba(5, 5, 20, 0.7)';
                        }
                    }
                    else {
                        if (STATE.time > 1700 && STATE.time < 2000) overlayColor = 'rgba(255, 100, 0, 0.2)';
                        else if (STATE.time >= 2000 || STATE.time < 400) overlayColor = 'rgba(0, 0, 50, 0.5)';
                    }
                }

                if (overlayColor !== 'rgba(0,0,0,0)') {

                    ctx.save();

                    ctx.fillStyle = overlayColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // LOGIKA PENCAHAYAAN (LIGHTING SYSTEM)
                    if (STATE.time >= 1800 || STATE.time < 500 || STATE.weather === 'rain') {

                        // FIX: Hitung Scale Factor Dinamis (Penting untuk Mobile vs PC)
                        // Sebelumnya hardcode * 4, sekarang menyesuaikan canvas.width aktual
                        const scaleFactor = canvas.width / GAME_WIDTH;

                        // 1. CAHAYA PEMAIN (SENTER/OBOR)
                        // Tambahkan shakeX/Y agar cahaya ikut bergetar saat gempa/damage
                        let shakeX = 0, shakeY = 0;
                        if (STATE.shakeTimer > 0) {
                            shakeX = (Math.random() - 0.5) * 10;
                            shakeY = (Math.random() - 0.5) * 10;
                        }

                        const screenX = (STATE.player.x + 10) - STATE.camera.x + shakeX;
                        const screenY = (STATE.player.y + 10) - STATE.camera.y + shakeY;

                        if (screenX > -50 && screenX < GAME_WIDTH + 50 && screenY > -50 && screenY < GAME_HEIGHT + 50) {

                            // UPDATE: Gunakan scaleFactor untuk posisi presisi
                            const realX = screenX * scaleFactor;
                            const realY = screenY * scaleFactor;

                            // UPDATE: Radius juga disesuaikan skala agar proporsional
                            const r1 = 5 * scaleFactor;    // Radius dalam
                            const r2 = 37.5 * scaleFactor; // Radius luar (Cahaya menyebar)

                            const rad = ctx.createRadialGradient(realX, realY, r1, realX, realY, r2);
                            rad.addColorStop(0, 'rgba(255, 255, 200, 0.3)');
                            rad.addColorStop(1, 'rgba(255, 255, 200, 0)');

                            ctx.fillStyle = rad;
                            ctx.globalCompositeOperation = 'overlay';
                            ctx.beginPath();
                            ctx.arc(realX, realY, r2, 0, Math.PI * 2);
                            ctx.fill();
                            // Reset composite sementara agar cahaya bangunan bisa ditumpuk
                            ctx.globalCompositeOperation = 'source-over';
                        }

                        // 2. NEW: CAHAYA BANGUNAN (LAMPU JENDELA/PINTU)
                        if (map.buildings) {
                            ctx.globalCompositeOperation = 'overlay'; // Mode pencampuran cahaya

                            map.buildings.forEach(b => {
                                // Cek apakah bangunan punya jam operasional
                                let isLightsOn = false;

                                // Jika buka 24 jam, lampu nyala terus saat malam
                                if (b.open24h) {
                                    isLightsOn = true;
                                }
                                // Jika punya jam buka/tutup, cek waktu sekarang
                                else if (b.openTime && b.closeTime) {
                                    if (STATE.time >= b.openTime && STATE.time < b.closeTime) {
                                        isLightsOn = true;
                                    }
                                }

                                // Khusus Rumah Player: Selalu nyala
                                if (b.id === 'player_house') isLightsOn = true;

                                if (isLightsOn) {
                                    // Tentukan titik sumber cahaya (Di pintu atau tengah bangunan)
                                    let lightGameX, lightGameY;

                                    if (b.entrance) {
                                        lightGameX = (b.entrance.x * TILE_SIZE) + (TILE_SIZE / 2);
                                        lightGameY = (b.entrance.y * TILE_SIZE) + (TILE_SIZE / 2);
                                    } else {
                                        lightGameX = (b.x * TILE_SIZE) + (b.w * TILE_SIZE / 2);
                                        lightGameY = (b.y * TILE_SIZE) + (b.h * TILE_SIZE / 2);
                                    }

                                    // Konversi ke koordinat layar (+ Shake effect sinkron kamera)
                                    const bScreenX = lightGameX - STATE.camera.x + shakeX;
                                    const bScreenY = lightGameY - STATE.camera.y + shakeY;

                                    // Cek apakah masuk layar (Optimasi render)
                                    if (bScreenX > -100 && bScreenX < GAME_WIDTH + 100 && bScreenY > -100 && bScreenY < GAME_HEIGHT + 100) {
                                        // UPDATE: Gunakan scaleFactor
                                        const realBX = bScreenX * scaleFactor;
                                        const realBY = bScreenY * scaleFactor;

                                        // Efek Kedip Lampu (Sedikit)
                                        const flicker = Math.sin(Date.now() / 200 + b.x) * 5;

                                        // Radius base disesuaikan skala
                                        const baseRadius = 30 * scaleFactor;
                                        const radius = baseRadius + flicker;

                                        // Warna Lampu Hangat (Kuning/Oranye)
                                        const lightGrad = ctx.createRadialGradient(realBX, realBY, 2.5 * scaleFactor, realBX, realBY, radius);
                                        lightGrad.addColorStop(0, 'rgba(255, 220, 100, 0.5)'); // Pusat terang
                                        lightGrad.addColorStop(0.5, 'rgba(255, 180, 50, 0.2)'); // Tengah hangat
                                        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Pinggir transparan

                                        ctx.fillStyle = lightGrad;
                                        ctx.beginPath();
                                        ctx.arc(realBX, realBY, radius, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                            });

                            ctx.globalCompositeOperation = 'source-over'; // Kembalikan ke normal
                        }
                    }
                    ctx.restore();
                }

                if (STATE.lightningTimer > 0) {
                    const flashOpacity = (STATE.lightningTimer / 15) * 0.6;
                    ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                if (STATE.weather !== 'clear' && STATE.location === 'village') {
                    ctx.save();

                    STATE.weatherParticles.forEach(p => {
                        if (p.type === 'rain') {
                            ctx.fillStyle = 'rgba(100, 100, 255, 0.6)';
                            ctx.fillRect(p.x, p.y, 2, 10);
                        }
                        else if (p.type === 'snow') {
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                            ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
                        }
                        else if (p.type === 'sakura') {
                            ctx.fillStyle = '#fbcfe8';
                            ctx.beginPath(); ctx.ellipse(p.x, p.y, 4, 2, Math.PI / 4, 0, Math.PI * 2); ctx.fill();
                        }
                        else if (p.type === 'fall_leaves') {
                            ctx.fillStyle = '#d97706';
                            ctx.beginPath(); ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p.x + 5, p.y + 2); ctx.lineTo(p.x, p.y + 5); ctx.fill();
                        }
                    });
                    ctx.restore();
                }

                // --- FIX: PANGGIL MINIMAP SETIAP FRAME ---
                drawMinimap();
            }

