// =================================================================
// 🧠 Mentor Cerdas & Kisah Leluhur Quest
// =================================================================

            // ═══════════════════════════════════════════════════════════════
            // 🧠 MENTOR CERDAS — Mesin Inferensi Lokal berbasis Data Game
            // Mentor "berpikir" sendiri dari state game tanpa API eksternal
            // ═══════════════════════════════════════════════════════════════


            // ═══════════════════════════════════════════════════════════════
            // 💬 SISTEM MENTOR PROAKTIF
            //  • updateMentorBubble()   — dijalankan tiap hari baru & awal game
            //  • triggerMorningMentor() — auto-dialog pagi (darurat + check-in)
            // ═══════════════════════════════════════════════════════════════

            function updateMentorBubble() {
                const p = STATE.player;
                if (!p) { window._mentorBubble = null; return; }

                const alerts = getMentorAlerts(p);
                const urgent = alerts.filter(a => a.level === 'danger');
                const warn   = alerts.filter(a => a.level === 'warn');

                if (urgent.length > 0) {
                    // Merah — ada yang darurat
                    window._mentorBubble = { icon: '⚠', color: '#ef4444' };
                } else if (warn.length > 0) {
                    // Kuning — ada peringatan
                    window._mentorBubble = { icon: '!', color: '#f59e0b' };
                } else if (STATE.day % 3 === 0) {
                    // Hijau — check-in 3 hari sekali
                    window._mentorBubble = { icon: '💬', color: '#10b981' };
                } else {
                    window._mentorBubble = null;
                }
            }

            // Kumpulkan alerts dari state player — satu sumber kebenaran
            function getMentorAlerts(p) {
                const alerts = [];
                const day = STATE.day || 1;

                if ((p.energy || 100) < 20)
                    alerts.push({ level:'danger', id:'energy',
                        msg:`⚡ Energimu KRITIS (${Math.floor(p.energy||0)}%)! Segera istirahat.` });
                if ((p.hp || 100) < 30)
                    alerts.push({ level:'danger', id:'hp',
                        msg:`❤️ HP-mu berbahaya (${Math.floor(p.hp||0)}/${p.maxHp||100})! Pergi ke Klinik.` });
                if ((p.money || 0) < 2000 && day > 3)
                    alerts.push({ level:'danger', id:'money',
                        msg:`💰 Uangmu hampir habis (${(p.money||0).toLocaleString('id-ID')} G)! Cari penghasilan segera.` });
                if (p.role === 'none' && day > 1)
                    alerts.push({ level:'danger', id:'role',
                        msg:`❓ Kamu belum memilih jalur karier! Temui aku segera.` });

                if ((p.reflections || []).length === 0 && day > 3)
                    alerts.push({ level:'warn', id:'journal',
                        msg:`📝 Belum ada jurnal refleksi. Tulis jurnal = dapat Gold & AP bonus!` });
                if (p.role === 'student' && !p.major && day > 3)
                    alerts.push({ level:'warn', id:'major',
                        msg:`🎓 Kamu pelajar tapi belum daftar jurusan di Kampus!` });
                if (p.role === 'worker' && (p.jobStatus||'unemployed') === 'unemployed' && day > 3)
                    alerts.push({ level:'warn', id:'job',
                        msg:`⚔️ Kamu Pekerja tapi belum punya pekerjaan. Lamar di Merchant!` });
                if ((p.portfolioItems||[]).length === 0 && p.role === 'student' && day > 5)
                    alerts.push({ level:'warn', id:'portfolio',
                        msg:`📁 Belum ada karya portofolio. Buat karya di Kampus!` });

                return alerts;
            }

            // ── TRIGGER PAGI HARI ────────────────────────────────────────
            // Dipanggil setelah animasi bangun tidur selesai
            function triggerMorningMentor() {
                const p = STATE.player;
                if (!p) return;

                const name  = DataService.user ? DataService.user.name : "Siswa";
                const day   = STATE.day || 1;
                const alerts = getMentorAlerts(p);
                const urgent = alerts.filter(a => a.level === 'danger');
                const warn   = alerts.filter(a => a.level === 'warn');

                // Cari NPC mentor untuk gambar
                let mentorNPC = null;
                for (const mk of Object.keys(maps)) {
                    if (maps[mk] && maps[mk].npcs) {
                        const found = maps[mk].npcs.find(n => n.id === 'mentor');
                        if (found) { mentorNPC = found; break; }
                    }
                }
                const mentorImg  = (mentorNPC && mentorNPC.imgSrc) ? mentorNPC.imgSrc : 'images/mentor.png';
                const mentorName = STATE.mentorName || 'Mentor Budi';

                // ── KASUS 1: Darurat — selalu tampil ──────────────────────
                if (urgent.length > 0) {
                    const issueList = urgent.map(a => `• ${a.msg}`).join('\n');
                    showDialogue(
                        `🚨 ${mentorName} — PERINGATAN!`,
                        `${name}, aku melihat kamu dalam kondisi yang mengkhawatirkan pagi ini.\n\n${issueList}\n\nJangan abaikan ini! Selesaikan sekarang sebelum melakukan aktivitas lain.`,
                        [
                            { text: '📊 Lihat Laporan Lengkap', action: () => {
                                if (mentorNPC) showMentorFullReport(mentorNPC, runMentorAnalysis(p, name));
                                else closeDialogue();
                            }},
                            { text: 'Oke, aku akan atasi', action: closeDialogue }
                        ],
                        mentorImg
                    );
                    updateMentorBubble();
                    return;
                }

                // ── KASUS 2: Check-in tiap 3 hari ────────────────────────
                if (day % 3 === 0) {
                    const journals = p.reflections || [];
                    const recentJournal = journals.length > 0
                        ? `Aku sudah membaca ${journals.length} jurnalmu. Terus refleksikan perjalananmu!`
                        : `Kamu belum menulis jurnal. Mulai malam ini ya!`;

                    const warnPart = warn.length > 0
                        ? `\n\n⚠️ Ada ${warn.length} hal yang perlu kamu perhatikan:\n` + warn.map(a=>`• ${a.msg}`).join('\n')
                        : '';

                    showDialogue(
                        `📋 ${mentorName} — Check-in Hari ${day}`,
                        `Selamat pagi, ${name}! Ini hari ke-${day} perjalananmu.\n\n${recentJournal}${warnPart}\n\nMau aku bantu analisis perkembanganmu?`,
                        [
                            { text: '🧠 Ya, analisis sekarang', action: () => {
                                if (mentorNPC) openAIMentor(mentorNPC);
                                else closeDialogue();
                            }},
                            { text: 'Nanti saja', action: closeDialogue }
                        ],
                        mentorImg
                    );
                    updateMentorBubble();
                    return;
                }

                // ── KASUS 3: Ada peringatan (warn only) ───────────────────
                if (warn.length > 0) {
                    const top = warn[0]; // Ambil 1 terpenting
                    showDialogue(
                        `💬 ${mentorName}`,
                        `Pagi, ${name}. Satu hal yang perlu kamu perhatikan hari ini:\n\n${top.msg}\n\nHari ke-${day}. Gunakan waktumu dengan bijak!`,
                        [
                            { text: '📋 Lihat semua saran', action: () => {
                                if (mentorNPC) openAIMentor(mentorNPC);
                                else closeDialogue();
                            }},
                            { text: 'Siap!', action: closeDialogue }
                        ],
                        mentorImg
                    );
                    updateMentorBubble();
                    return;
                }

                // ── KASUS 4: Semua baik — pesan motivasi singkat ──────────
                // Hanya tampil tiap 3 hari, kalau tidak ada peringatan tidak ganggu
                updateMentorBubble(); // Hapus bubble karena semua OK
            }

            function openAIMentor(npc) {
                const p = STATE.player;
                const name = DataService.user ? DataService.user.name : "Siswa";
                const analysis = runMentorAnalysis(p, name);

                // Bangun menu berdasarkan topik yang terdeteksi
                const menuOpts = analysis.topics.map(topic => ({
                    text: topic.label,
                    action: () => showMentorTopic(npc, topic, analysis)
                }));
                menuOpts.push({ text: "Lihat Laporan Lengkap", action: () => showMentorFullReport(npc, analysis) });
                menuOpts.push({ text: "Kembali", action: () => { updateMentorBubble(); interactNPC(npc); } });

                const urgentAlert = analysis.alerts.length > 0
                    ? `\n\n⚠️ ADA ${analysis.alerts.length} HAL MENDESAK yang perlu kita bahas!`
                    : "\n\n✅ Kondisimu terlihat cukup baik hari ini.";

                showDialogue(npc.name,
                    `${name}, aku sudah amati perkembanganmu sejak hari pertama kamu tiba di sini.\n\nHari ke-${STATE.day}, Level ${p.level||1}, Jalur: ${analysis.roleLabel}.${urgentAlert}\n\nMau aku bantu di bagian mana?`,
                    menuOpts, npc.imgSrc
                );
            }

            function showMentorTopic(npc, topic, analysis) {
                showDialogue(npc.name, topic.content, [
                    { text: "💡 Apa yang harus aku lakukan?", action: () => showDialogue(npc.name, topic.action, [
                        { text: "Paham, terima kasih!", action: () => openAIMentor(npc) }
                    ], npc.imgSrc)},
                    { text: "Topik lain", action: () => openAIMentor(npc) }
                ], npc.imgSrc);
            }

            function showMentorFullReport(npc, analysis) {
                const p = STATE.player;
                const report = buildFullReport(p, analysis);
                showDialogue(`📋 LAPORAN MENTOR: ${analysis.name}`, report, [
                    { text: "🤔 Saran Karier", action: () => showDialogue(npc.name, analysis.careerAdvice, [
                        { text: "Kembali ke Laporan", action: () => showMentorFullReport(npc, analysis) }
                    ], npc.imgSrc)},
                    { text: "📖 Analisis Jurnal", action: () => showJournalAnalysis(npc, analysis) },
                    { text: "Selesai", action: () => interactNPC(npc) }
                ], npc.imgSrc);
            }

            function showJournalAnalysis(npc, analysis) {
                const jText = analysis.journalInsight.length > 0
                    ? analysis.journalInsight.join("\n\n")
                    : "Kamu belum menulis jurnal refleksi sama sekali.\n\nJurnal sangat penting! Setiap kali kamu menulis, aku bisa membaca perkembanganmu lebih akurat dan memberikan saran yang lebih tepat.";
                showDialogue(`📖 Analisis Jurnal`, jText, [
                    { text: "Kembali", action: () => showMentorFullReport(npc, analysis) }
                ], npc.imgSrc);
            }

            // ─── MESIN INFERENSI UTAMA ────────────────────────────────────
            function runMentorAnalysis(p, name) {
                const day    = STATE.day || 1;
                const season = ['Semi','Panas','Gugur','Dingin'][Math.floor(((day-1)/30)%4)];
                const year   = Math.floor((day-1)/(30*4)) + 1;

                const str  = p.str  || 1;
                const int  = p.int  || 1;
                const biz  = p.biz  || 1;
                const rep  = p.reputation || 1;
                const hp   = Math.floor(p.hp  || 100);
                const maxHp = p.maxHp || 100;
                const energy = Math.floor(p.energy || 100);
                const money  = p.money || 0;
                const level  = p.level || 1;
                const role   = p.role  || 'none';
                const ap     = p.achievementPoints || 0;
                const journals   = p.reflections    || [];
                const portfolio  = p.portfolioItems || [];
                const jobStatus  = p.jobStatus  || 'unemployed';
                const jobLevel   = p.jobLevel   || 1;
                const isMarried  = p.isMarried  || false;
                const hasMajor   = !!p.major;
                const scholarship= p.scholarship || false;
                const dungLvl   = STATE.dungeonLevel || 1;

                const roleLabel = {worker:'⚔️ Pekerja',student:'🎓 Pelajar',entrepreneur:'🏪 Wirausaha',family:'🏠 Keluarga',none:'❓ Belum Dipilih'}[role] || '❓';

                // ── STAT DOMINAN & LEMAH ─────────────────────────────────
                const statMap = {str, int, biz, rep};
                const statNames = {str:'STR(Fisik)',int:'INT(Akademik)',biz:'BIZ(Bisnis)',rep:'REP(Sosial)'};
                const dominant = Object.entries(statMap).sort((a,b)=>b[1]-a[1])[0];
                const weakest  = Object.entries(statMap).sort((a,b)=>a[1]-b[1])[0];
                const isBalanced = Math.max(str,int,biz,rep) - Math.min(str,int,biz,rep) <= 3;

                // ── ANALISIS JURNAL ───────────────────────────────────────
                const journalKeywords = {
                    mandiri:   ['mandiri','usaha','bisnis','jualan','dagang','modal','untung','rugi'],
                    akademik:  ['belajar','kuliah','nilai','ujian','pintar','cerdas','ilmu','kampus'],
                    kerja:     ['kerja','lelah','gaji','bos','karyawan','skill','tekun','disiplin'],
                    sosial:    ['teman','keluarga','cinta','nikah','bahagia','bersama','tolong'],
                    stress:    ['capek','lelah','bosan','menyerah','susah','sulit','frustrasi','stress'],
                    semangat:  ['semangat','bangkit','bisa','yakin','percaya','kuat','optimis']
                };
                const journalScore = {mandiri:0,akademik:0,kerja:0,sosial:0,stress:0,semangat:0};
                const journalSample = journals.slice(-5);
                journalSample.forEach(j => {
                    const txt = (j.text || '').toLowerCase();
                    Object.entries(journalKeywords).forEach(([cat, words]) => {
                        words.forEach(w => { if (txt.includes(w)) journalScore[cat]++; });
                    });
                });
                const journalDominant = Object.entries(journalScore).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]>0);
                const isStressed = journalScore.stress >= 2;
                const isSemangat = journalScore.semangat >= 2;

                // ── DETEKSI MISMATCH ROLE vs STAT ────────────────────────
                const roleMismatch = (() => {
                    if (role === 'worker'       && int > str * 1.5 && int >= 8) return `INT-mu (${int}) jauh di atas STR (${str}). Otakmu lebih tajam dari ototmu.`;
                    if (role === 'student'      && biz > int * 1.5 && biz >= 8) return `BIZ-mu (${biz}) jauh di atas INT (${int}). Insting bisnismu kuat.`;
                    if (role === 'entrepreneur' && int > biz * 1.5 && int >= 8) return `INT-mu (${int}) melebihi BIZ (${biz}). Kamu berpikir seperti akademisi.`;
                    if (role === 'family'       && rep < 5 && day > 20)         return `REP-mu (${rep}) masih rendah padahal kamu pilih jalur Keluarga.`;
                    return null;
                })();

                // ── DETEKSI JURNAL vs ROLE ────────────────────────────────
                const journalRoleMismatch = (() => {
                    if (role === 'worker'  && journalScore.mandiri >= 2) return `Di jurnalmu, kamu sering menulis soal "mandiri" dan "usaha" — apakah jalur Wirausaha lebih cocok untukmu?`;
                    if (role === 'student' && journalScore.kerja   >= 2) return `Di jurnalmu, kamu banyak bicara soal "kerja" dan "kelelahan" — mungkin ada konflik antara impian dan kenyataan?`;
                    if (role === 'entrepreneur' && journalScore.akademik >= 2) return `Tulisanmu penuh kata "belajar" dan "ilmu" — ada sisi akademis kuat yang belum kamu eksplorasi.`;
                    return null;
                })();

                // ── DETEKSI MASALAH (ALERTS) ─────────────────────────────
                const alerts = [];
                if (energy < 20)                                      alerts.push({ id:'energy',  icon:'🔴', msg:`Energimu KRITIS (${energy}%)! Segera istirahat sebelum pingsan dan kena denda.` });
                if (hp < 30)                                          alerts.push({ id:'hp',       icon:'🔴', msg:`HP-mu berbahaya (${hp}/${maxHp})! Pergi ke Klinik sekarang.` });
                if (money < 2000 && day > 5)                          alerts.push({ id:'money',    icon:'🔴', msg:`Uangmu hampir habis (${money.toLocaleString('id-ID')} G)! Risiko bangkrut.` });
                if (journals.length === 0 && day > 3)                 alerts.push({ id:'journal',  icon:'🟡', msg:`Kamu belum pernah menulis jurnal sejak ${day-1} hari lalu. Jurnal = AP dan bonus reward!` });
                if (role === 'none' && day > 1)                       alerts.push({ id:'role',     icon:'🟡', msg:`Kamu belum memilih jalur karier! Temui aku segera.` });
                if (role === 'student' && !hasMajor && day > 3)       alerts.push({ id:'major',    icon:'🟡', msg:`Kamu pelajar tapi belum daftar jurusan di Kampus!` });
                if (role === 'student' && portfolio.length === 0 && day > 5) alerts.push({ id:'portfolio', icon:'🟡', msg:`Kamu belum punya karya portofolio satu pun. Pergi ke Bangku Kampus!` });
                if (role === 'worker'  && jobStatus === 'unemployed' && day > 3) alerts.push({ id:'job', icon:'🟡', msg:`Kamu Pekerja tapi belum punya pekerjaan! Lamar ke Merchant atau Blacksmith.` });
                if (isMarried && money < 5000)                        alerts.push({ id:'family',   icon:'🟡', msg:`Kamu sudah menikah tapi keuanganmu tipis. Tanggung jawab finansial keluarga penting!` });
                if (isStressed)                                        alerts.push({ id:'stress',   icon:'💜', msg:`Dari jurnalmu, aku membaca kamu sedang kelelahan. Jangan lupakan istirahat dan self-care.` });
                if (roleMismatch)                                      alerts.push({ id:'mismatch', icon:'💡', msg:roleMismatch });
                if (journalRoleMismatch)                               alerts.push({ id:'jmismatch',icon:'💡', msg:journalRoleMismatch });

                // ── TOPIK MENU (berdasarkan kondisi aktual) ───────────────
                const topics = [];

                // Selalu ada: evaluasi stat
                topics.push({
                    label: `📊 Evaluasi Statistikku (${dominant[0].toUpperCase()}:${dominant[1]} Dominan)`,
                    content: buildStatEval(p, dominant, weakest, isBalanced, role),
                    action:  buildStatAction(p, dominant, weakest, role)
                });

                // Saran keuangan
                topics.push({
                    label: `💰 Kondisi Keuangan (${money < 5000 ? '⚠️ Perlu Perhatian' : '✅ Aman'})`,
                    content: buildMoneyAnalysis(money, role, day, p),
                    action:  buildMoneyAction(money, role, p)
                });

                // Kondisi fisik jika ada masalah
                if (energy < 50 || hp < 60) {
                    topics.push({
                        label: `❤️ Kondisi Fisik (${energy < 20 ? '🔴 KRITIS' : '⚠️ Waspada'})`,
                        content: `HP-mu saat ini ${hp}/${maxHp} dan Energi ${energy}%.\n\n${energy < 20 ? 'INI DARURAT! Kamu hampir pingsan. Di game ini, kalau Energi nol kamu akan pingsan otomatis dan kehilangan Gold sebagai "biaya rumah sakit".' : 'Kondisimu mulai menurun. Jangan paksa dirimu terus bekerja.'}\n\n${hp < 50 ? 'HP rendah membuatmu rentan serangan di Dungeon dan bisa mati mendadak.' : ''}`,
                        action: `Segera ke Klinik di desa untuk memulihkan HP (berbayar).\n\nUntuk Energi: Tidur di Kasur Rumah (gratis, skip ke pagi hari).\n\nJangan makan malam lewat jam 22:00 karena Energi regenerasi lebih lambat kalau kamu begadang.`
                    });
                }

                // Saran jurnal
                if (journals.length < 3 && day > 2) {
                    topics.push({
                        label: `📝 Soal Jurnal Refleksi (${journals.length} entri)`,
                        content: buildJournalAdvice(journals, day, isStressed, isSemangat),
                        action: `Tulis jurnal setiap malam sebelum tidur — di Kasur rumah ada opsi "Tidur & Refleksi".\n\nManfaat langsung: +Gold, +EXP, +AP.\nManfaat jangka panjang: aku bisa membaca tulisanmu dan memberikan saran yang lebih akurat.`
                    });
                } else if (journals.length >= 3) {
                    topics.push({
                        label: `📝 Analisis Jurnal (${journals.length} entri ditulis)`,
                        content: buildJournalDeepAnalysis(journals, journalScore, journalDominant, role, name),
                        action: buildJournalNextStep(journalScore, role, journalRoleMismatch)
                    });
                }

                // Saran karier spesifik
                topics.push({
                    label: `🗺️ Saran Karier & Langkah Selanjutnya`,
                    content: buildCareerAdvice(p, role, day, year, season, isBalanced, dominant, weakest),
                    action:  buildCareerAction(p, role, day, hasMajor, scholarship, jobStatus, jobLevel)
                });

                // ── SARAN KARIER UNTUK FULL REPORT ───────────────────────
                const careerAdvice = buildCareerAdvice(p, role, day, year, season, isBalanced, dominant, weakest);

                // ── INSIGHT JURNAL UNTUK FULL REPORT ─────────────────────
                const journalInsight = buildJournalInsightList(journals, journalScore, journalDominant, isStressed, isSemangat, name);

                return { name, roleLabel, alerts, topics, dominant, weakest, isBalanced,
                         careerAdvice, journalInsight, statMap, money, energy, hp,
                         journals, day, year, season, role, isStressed, isSemangat };
            }

            // ─── PEMBUAT KONTEN EVALUASI ──────────────────────────────────

            function buildStatEval(p, dominant, weakest, isBalanced, role) {
                const str=p.str||1, int=p.int||1, biz=p.biz||1, rep=p.reputation||1;
                let text = `📊 Statistik kamu saat ini:\n💪 STR: ${str}  🧠 INT: ${int}  📈 BIZ: ${biz}  ❤️ REP: ${rep}\n\n`;

                if (isBalanced) {
                    text += `Stat-mu cukup seimbang. Ini karakter serbabisa, tapi belum ada spesialisasi yang menonjol.\n`;
                } else {
                    text += `Stat terkuatmu: ${dominant[0].toUpperCase()} (${dominant[1]}) — ini adalah identitas karaktermu.\nStat terlemahmu: ${weakest[0].toUpperCase()} (${weakest[1]}) — perlu ditingkatkan agar tidak jadi kelemahan.\n`;
                }

                const roleStatMap = { worker:'STR', student:'INT', entrepreneur:'BIZ', family:'REP' };
                const primaryStat = roleStatMap[role];
                if (primaryStat) {
                    const primaryVal = p[primaryStat.toLowerCase()] || p['reputation'] || 1;
                    if (primaryVal < 5) text += `\n⚠️ Stat utama jalurmu (${primaryStat}) masih rendah (${primaryVal}). Fokuskan aktivitas yang meningkatkan ${primaryStat}!`;
                    else if (primaryVal >= 15) text += `\n🌟 ${primaryStat}-mu sudah sangat kuat (${primaryVal})! Kamu sudah di jalur yang benar.`;
                }
                return text;
            }

            function buildStatAction(p, dominant, weakest, role) {
                const tips = {
                    str: 'Tingkatkan STR dengan: Kerja kasar di Merchant, Latihan fisik, Bertarung di Dungeon.',
                    int: 'Tingkatkan INT dengan: Kuliah di Kampus, Baca buku di Perpustakaan, Kerjakan tugas akademik.',
                    biz: 'Tingkatkan BIZ dengan: Jual-beli barang di Merchant, Ikut event Viral, Buka usaha.',
                    reputation: 'Tingkatkan REP dengan: Sapa warga setiap hari, Bantu NPC, Hadiri acara sosial desa.'
                };
                return `Fokus tingkatkan stat terkuatmu dulu agar jadi keunggulan nyata.\n\n${tips[dominant[0]] || ''}\n\nStat lemah (${weakest[0].toUpperCase()}) bisa dinaikkan sedikit demi sedikit:\n${tips[weakest[0]] || ''}`;
            }

            function buildMoneyAnalysis(money, role, day, p) {
                let text = `💰 Saldo saat ini: ${money.toLocaleString('id-ID')} Gold\n\n`;
                if      (money < 2000)  text += `🔴 KRITIS! Kamu hampir bangkrut. Di dunia nyata, ini setara orang yang tidak punya tabungan dan tagihan menumpuk. Sangat berbahaya.\n`;
                else if (money < 8000)  text += `🟡 Uangmu terbatas. Cukup untuk hari ini, tapi tidak ada buffer kalau ada kejadian tak terduga (sakit, barang rusak, dll).\n`;
                else if (money < 30000) text += `🟢 Keuanganmu stabil. Kamu punya cadangan yang cukup untuk kebutuhan rutin.\n`;
                else if (money < 100000)text += `💎 Kamu cukup kaya! Sudah waktunya berpikir investasi, bukan hanya menyimpan.\n`;
                else                    text += `👑 Kekayaanmu luar biasa! Di dunia nyata, ini level orang yang sudah bisa "uang bekerja untuk mereka".\n`;

                if (role === 'entrepreneur') {
                    text += `\nSebagai Wirausaha, modal adalah segalanya. Jangan simpan uang terlalu lama — putar!\n`;
                    if (money > 20000) text += `Dengan ${money.toLocaleString('id-ID')} G, kamu bisa buka usaha baru atau beli barang viral untuk dijual kembali.`;
                } else if (role === 'student') {
                    text += `\nJangan lupa: UKT tahunan 600.000 G (atau GRATIS kalau dapat beasiswa). Siapkan dari sekarang!`;
                } else if (role === 'worker') {
                    const dailyGaji = 5000 + ((p.jobLevel||1) * 2000);
                    text += `\nGajimu per hari kerja: ±${dailyGaji.toLocaleString('id-ID')} G (naik seiring Job Level).`;
                }
                return text;
            }

            function buildMoneyAction(money, role, p) {
                if (money < 3000) return `Darurat! Segera cari penghasilan:\n1. Kerja harian di Merchant (tanpa syarat apapun)\n2. Jual item dari inventory yang tidak terpakai\n3. Cari item di alam bebas dan jual ke pedagang`;
                if (role === 'entrepreneur' && money > 20000) return `Strategi Wirausaha:\n1. Cek event Viral di HP — beli barang yang harganya lagi naik\n2. Beli item langka dari Merchant, simpan, jual saat harga naik 3x\n3. Reputasi tinggi = harga jual lebih baik`;
                if (role === 'student') return `Manajemen Keuangan Pelajar:\n1. Hemat — hindari beli item yang tidak penting\n2. Kerjakan Quest harian untuk bonus Gold\n3. Kalau bisa dapat beasiswa, UKT gratis dan dapat uang saku!`;
                return `Tips Menabung:\n1. Sisihkan 30% penghasilan setiap hari\n2. Jangan jajan berlebihan (Energi bisa dipulihkan gratis dengan tidur)\n3. Fokus kegiatan yang memberi Gold + EXP sekaligus`;
            }

            function buildJournalAdvice(journals, day, isStressed, isSemangat) {
                if (journals.length === 0) {
                    return `Kamu sudah ${day-1} hari di sini tapi belum menulis satu pun jurnal refleksi.\n\nDi dunia nyata, orang yang tidak pernah merefleksikan pengalamannya cenderung tidak berkembang — mereka melakukan kesalahan yang sama berulang kali tanpa sadar.\n\nJurnal bukan hanya soal dapat reward Gold & AP. Ini adalah latihan berpikir kritis tentang hidupmu sendiri.`;
                }
                let text = `Kamu sudah menulis ${journals.length} jurnal. `;
                if (isStressed) text += `\n\nAku membaca kata-kata seperti "capek", "sulit", "menyerah" dalam tulisanmu. Itu wajar — semua orang merasakannya. Tapi penting untuk menyadari apakah ini kelelahan sementara atau tanda kamu perlu mengubah strategi.`;
                if (isSemangat) text += `\n\nSemangat dan optimisme terasa kuat dalam tulisanmu. Pertahankan mindset ini!`;
                return text;
            }

            function buildJournalDeepAnalysis(journals, jScore, jDominant, role, name) {
                let text = `Aku sudah membaca ${journals.length} jurnalmu, ${name}.\n\n`;
                if (jDominant.length > 0) {
                    const top = jDominant[0];
                    const catNames = {mandiri:'kemandirian & bisnis', akademik:'akademik & keilmuan', kerja:'kerja keras & karier', sosial:'hubungan sosial & keluarga', stress:'kelelahan & tekanan', semangat:'semangat & optimisme'};
                    text += `Tema terkuat dalam tulisanmu: **${catNames[top[0]] || top[0]}**\n\n`;
                }
                if (jScore.stress >= 2 && jScore.semangat < 2) text += `Aku khawatir — banyak tekanan terdeteksi dalam jurnalmu. Jangan pendam sendiri. Ceritakan ke NPC yang kamu percaya, atau tidur lebih awal.\n\n`;
                if (jScore.mandiri >= 2 && role !== 'entrepreneur') text += `Menarik — kamu sering bicara soal "mandiri" dan "usaha" di jurnal, tapi jalurmu bukan Wirausaha. Apakah ada bagian dirimu yang ingin lebih bebas dan mandiri secara finansial?\n\n`;
                if (jScore.akademik >= 2 && role !== 'student') text += `Jurnalmu penuh kata-kata "belajar" dan "ilmu". Sepertinya kamu punya jiwa pelajar yang kuat meski tidak di jalur Akademisi.\n\n`;
                if (jDominant.length === 0) text += `Jurnalmu belum menunjukkan tema yang kuat. Coba tulis lebih spesifik tentang apa yang kamu rasakan dan pelajari hari ini.\n`;
                return text;
            }

            function buildJournalNextStep(jScore, role, mismatch) {
                if (mismatch) return `${mismatch}\n\nLanjutkan menulis jurnal dengan lebih spesifik:\n- Apa yang kamu pelajari hari ini?\n- Apa keputusan terbesar yang kamu buat?\n- Apakah kamu puas dengan jalurmu sekarang?`;
                return `Teruskan menulis jurnal setiap hari.\n\nTantangan: Di jurnal berikutnya, coba jawab: "Jika aku bisa mengulang 3 hari terakhir, apa yang akan aku lakukan berbeda?"`;
            }

            function buildCareerAdvice(p, role, day, year, season, isBalanced, dominant, weakest) {
                const str=p.str||1, int=p.int||1, biz=p.biz||1, rep=p.reputation||1;
                let text = `📅 Kamu di Tahun ${year} (${season}), Hari ke-${day}.\n\n`;

                if (role === 'worker') {
                    text += `Jalur Pekerja cocok untukmu ${str >= int && str >= biz ? '✅ — STR-mu mendukung' : '⚠️ — tapi STR-mu masih perlu ditingkatkan'}.\n\n`;
                    text += `Di dunia nyata Jawa Timur: Pekerja terampil dengan sertifikasi (las, listrik, konstruksi) bisa bergaji Rp 4-8 juta/bulan. Naik ke manajemen = Rp 10-15 juta.\n`;
                    if (p.jobStatus === 'unemployed') text += `\n⚠️ Kamu belum bekerja! Ini setara pengangguran. Segera lamar pekerjaan.`;
                    else text += `\nJob Level-mu: ${p.jobLevel||1}. ${(p.jobLevel||1) >= 3 ? 'Sudah cukup senior untuk naik jabatan!' : 'Terus tingkatkan performa agar dapat promosi.'}`;
                } else if (role === 'student') {
                    text += `Jalur Pelajar ${int >= 8 ? '✅ sangat cocok' : int >= 5 ? '🟡 cukup cocok' : '⚠️ menantang'} dengan INT-mu (${int}).\n\n`;
                    text += `Di dunia nyata: Lulusan perguruan tinggi di Indonesia rata-rata bergaji 30-50% lebih tinggi dari lulusan SMA. Beasiswa = menghemat ratusan juta!\n`;
                    if (!p.major) text += `\n⚠️ Belum daftar jurusan! Pergi ke Kampus segera.`;
                    else text += `\nJurusan: ${p.major.toUpperCase()}. ${p.scholarship ? '🏆 Kamu penerima beasiswa — pertahankan!' : 'Belum beasiswa. Tingkatkan INT untuk membuka jalur beasiswa.'}`;
                } else if (role === 'entrepreneur') {
                    text += `Jalur Wirausaha ${biz >= int && biz >= str ? '✅ — BIZ-mu mendukung' : '⚠️ — BIZ-mu perlu ditingkatkan'}.\n\n`;
                    text += `Di dunia nyata: UMKM menyumbang 61% GDP Indonesia. Modal kecil bisa jadi besar dengan strategi yang tepat. Kuncinya: modal, jaringan, dan timing.\n`;
                    text += `\nSaldo saat ini: ${(p.money||0).toLocaleString('id-ID')} G. ${p.money > 30000 ? 'Modal cukup untuk ekspansi!' : 'Akumulasikan modal dulu sebelum ekspansi besar.'}`;
                } else if (role === 'family') {
                    text += `Jalur Keluarga ${rep >= 8 ? '✅ — REP-mu solid' : '⚠️ — REP-mu perlu lebih tinggi'}.\n\n`;
                    text += `Di dunia nyata: Keluarga yang sehat butuh financial planning yang matang. Di Indonesia, biaya pernikahan rata-rata Rp 50-150 juta. Setelah menikah, biaya hidup naik drastis.\n`;
                    text += `\n${p.isMarried ? '✅ Sudah menikah. Fokus stabilitas finansial keluargamu.' : `Belum menikah. Siapkan REP tinggi dan uang yang cukup.`}`;
                } else {
                    text += `Kamu belum memilih jalur! Ini sangat penting.\n\nBerdasarkan stat-mu:\n`;
                    const sorted = [{k:'worker',v:str},{k:'student',v:int},{k:'entrepreneur',v:biz},{k:'family',v:rep}].sort((a,b)=>b.v-a.v);
                    text += sorted.map((s,i) => `${i+1}. ${['⚔️ Pekerja','🎓 Pelajar','🏪 Wirausaha','🏠 Keluarga'][['worker','student','entrepreneur','family'].indexOf(s.k)]} (${s.k === 'family'?'REP':s.k.toUpperCase().replace('WORKER','STR').replace('STUDENT','INT').replace('ENTREPRENEUR','BIZ')}: ${s.v})`).join('\n');
                }
                return text;
            }

            function buildCareerAction(p, role, day, hasMajor, scholarship, jobStatus, jobLevel) {
                const year = Math.floor((day-1)/(30*4)) + 1;
                if (role === 'worker') {
                    if (jobStatus === 'unemployed') return `PRIORITAS SEKARANG:\n1. Pergi ke Merchant atau Blacksmith\n2. Lamar pekerjaan (opsi "Lamar Kerja")\n3. Setelah diterima, kerja konsisten setiap hari untuk naik level\n\nTarget: Capai Job Level 3 sebelum akhir Tahun 1.`;
                    return `Target saat ini (Job Lv.${jobLevel}):\n1. Kerja setiap hari tanpa absen\n2. Jangan sampai dipecat (jaga relasi dengan Bos)\n3. Target promosi: Job Level ${jobLevel+1}\n\nJangka panjang: Job Level 5 = Penghasilan maksimal + bonus AP besar.`;
                }
                if (role === 'student') {
                    if (!hasMajor) return `DARURAT: Daftar jurusan di Kampus hari ini!\n\nLangkah:\n1. Pergi ke Kampus (buka dari 07:00-18:00)\n2. Temui Prof. Wahyu\n3. Pilih jurusan sesuai minat\n4. Ikut tes beasiswa untuk UKT gratis!`;
                    return `Rutinitas ideal pelajar:\n1. Kuliah di Kampus setiap pagi\n2. Tulis jurnal refleksi tiap malam\n3. Buat karya portofolio secara rutin\n4. ${scholarship ? 'Pertahankan prestasi untuk beasiswa!' : 'Tingkatkan INT untuk buka jalur beasiswa'}`;
                }
                if (role === 'entrepreneur') return `Strategi Wirausaha Optimal:\n1. Pantau event Viral via HP — beli saat murah, jual saat mahal\n2. Bangun relasi dengan Merchant dan Pedagang kaya\n3. Jangan habiskan modal untuk konsumsi\n4. Target: Modal 50.000 G di akhir Tahun ${year}`;
                if (role === 'family') return `Langkah Keluarga Ideal:\n1. Sapa warga setiap hari (+REP)\n2. Hadiri event sosial desa\n3. Bantu NPC yang membutuhkan\n4. Nabung untuk biaya pernikahan\n5. ${p.isMarried ? 'Jaga komunikasi dengan pasangan dan stabilitas finansial.' : 'Dekati NPC yang kamu suka dan bangun hubungan.'}`;
                return `Pilih jalur karier dulu dengan berbicara ke aku (Mentor)!`;
            }

            function buildFullReport(p, analysis) {
                const str=p.str||1, int=p.int||1, biz=p.biz||1, rep=p.reputation||1;
                let report = `👤 ${analysis.name} | Level ${p.level||1} | Hari ke-${analysis.day}\n`;
                report += `Jalur: ${analysis.roleLabel} | Tahun ${analysis.year} (${analysis.season})\n`;
                report += `─────────────────────────\n`;
                report += `📊 STAT: STR${str} INT${int} BIZ${biz} REP${rep}\n`;
                report += `❤️ HP: ${Math.floor(p.hp||100)}/${p.maxHp||100} | ⚡ Energi: ${Math.floor(p.energy||100)}%\n`;
                report += `💰 Gold: ${(p.money||0).toLocaleString('id-ID')} | 🏅 AP: ${p.achievementPoints||0}\n`;
                report += `📖 Jurnal: ${analysis.journals.length} entri | 📁 Portofolio: ${(p.portfolioItems||[]).length}\n`;
                report += `─────────────────────────\n`;
                if (analysis.alerts.length > 0) {
                    report += `⚠️ PERHATIAN:\n`;
                    analysis.alerts.forEach(a => { report += `${a.icon} ${a.msg}\n`; });
                    report += `─────────────────────────\n`;
                }
                report += `💪 Stat Dominan: ${analysis.dominant[0].toUpperCase()} (${analysis.dominant[1]})\n`;
                report += `📈 Perlu Ditingkatkan: ${analysis.weakest[0].toUpperCase()} (${analysis.weakest[1]})`;
                return report;
            }

            function buildJournalInsightList(journals, jScore, jDominant, isStressed, isSemangat, name) {
                if (journals.length === 0) return [];
                const insights = [];
                const catNames = {mandiri:'Kemandirian & Bisnis', akademik:'Akademik & Ilmu', kerja:'Kerja Keras', sosial:'Sosial & Keluarga', stress:'Tekanan & Kelelahan', semangat:'Semangat & Optimisme'};
                if (jDominant.length > 0) {
                    insights.push(`📊 TEMA DOMINAN JURNALMU:\n` + jDominant.slice(0,3).map(([k,v]) => `• ${catNames[k]||k}: ${v} kemunculan`).join('\n'));
                }
                if (isStressed) insights.push(`💜 DETEKSI TEKANAN:\nKata-kata yang menunjukkan stres/kelelahan ditemukan ${jScore.stress} kali. Jangan abaikan sinyal ini.`);
                if (isSemangat) insights.push(`⭐ SEMANGAT TERDETEKSI:\nOptimisme dan semangat muncul ${jScore.semangat} kali dalam tulisanmu. Pertahankan!`);
                const last = journals[journals.length-1];
                if (last) insights.push(`📝 JURNAL TERAKHIR (Hari ${last.day}):\n"${(last.text||'').substring(0,200)}${(last.text||'').length > 200 ? '...' : ''}"`);
                return insights;
            }

            function normalInteractNPC(npc) {
                const p = STATE.player;
                // Init relasi sesuai kepribadian NPC jika belum pernah bertemu
                initNPCRelationship(npc.id);
                const love = p.relationships[npc.id];

                // --- INTERAKSI BOS MERCHANT (UPDATE BARU) ---
                if (npc.id === 'boss_merchant') {
                    const p = STATE.player;
                    const viralOpt = getViralOption(npc.id); // Helper Viral

                    // --- RESTRIKSI JOB UNTUK NON-WORKER (TRIAL < TAHUN 4) ---
                    const currentYear = Math.ceil(STATE.day / 120);

                    if (p.role !== 'worker' && currentYear < 4 && !STATE.freeRoamMode && p.jobStatus !== 'employed') {
                        let restrictedOpts = [
                            { text: "🍱 Beli Sembako & Makanan", action: () => {
                                showDialogue("SEMBAKO 🛒",
                                    "Kebutuhan makan sehari-hari tersedia di sini:",
                                    [
                                        { text: "🍱 Nasi Bungkus (300 G) — Energi +30", action: () => buyItem('nasi_bungkus', 300) },
                                        { text: "🥚 Telur Ayam (100 G)", action: () => buyItem('telor', 100) },
                                        { text: "🟫 Tempe (150 G)", action: () => buyItem('tempe', 150) },
                                        { text: "🍞 Roti Gandum (200 G) — Energi +20", action: () => buyItem('gandum', 200) },
                                        { text: "💊 Obat Generik (500 G) — HP +30", action: () => buyItem('obat', 500) },
                                        { text: "← Kembali", action: () => interactNPC(npc) }
                                    ], npc.imgSrc);
                            }},
                            { text: "Lihat Pasar Komoditas (Jual/Beli)", action: () => openPasar() },
                            { text: "🪪 Beli Dokumen (KTP/Foto/SKCK)", action: () => openDocumentShop(npc) },
                            {
                                text: "Ngobrol Bisnis", action: () => {
                                    showDialogue(npc.name, "Harga barang di sini berfluktuasi setiap hari tergantung supply dan demand.", [{ text: "Mengerti", action: closeDialogue }], npc.imgSrc);
                                }
                            },
                            { text: "Tutup", action: closeDialogue }
                        ];

                        // INJECT VIRAL JIKA ADA
                        if (viralOpt) restrictedOpts.unshift(viralOpt);

                        showDialogue(npc.name,
                            "Selamat datang! Silakan lihat-lihat barang dagangan kami.\n\n(Catatan: Bos Merchant hanya membuka lowongan kerja untuk Role **Fighter/Pekerja** selama masa Trial 3 Tahun ini. Kamu bisa melamar setelah lulus Trial.)",
                            restrictedOpts,
                            npc.imgSrc
                        );
                        return;
                    }

                    const jobStatus = p.jobStatus || 'unemployed';

                    // --- DEFINISI JENJANG KARIR ---
                    const JOB_TIERS = {
                        1: { title: "Magang", salary: 5000 },
                        2: { title: "Staff Senior", salary: 7500 },
                        3: { title: "Kepala Gudang", salary: 12000 },
                        4: { title: "Manajer Cabang", salary: 25000 }
                    };
                    const currentLvl = p.jobLevel || 1;
                    const currentTitle = JOB_TIERS[currentLvl] ? JOB_TIERS[currentLvl].title : "Magang";

                    if (jobStatus === 'fired') {
                        showDialogue(npc.name, "Kamu sudah saya pecat! Kinerjamu buruk sekali.", [
                            {
                                text: "Saya mohon maaf! (Energy 50)", action: () => {
                                    if (p.energy >= 50) {
                                        p.energy -= 50;
                                        p.bossReputation = 30;
                                        p.jobStatus = 'unemployed';
                                        p.jobLevel = 1;
                                        showToast("Bos luluh... Kamu bisa melamar lagi.");
                                        closeDialogue();
                                    } else showToast("Kurang energi.");
                                }
                            },
                            { text: "Pergi", action: closeDialogue }
                        ], npc.imgSrc);
                        return;
                    }

                    if (jobStatus === 'unemployed') {
                        // --- CEK APAKAH SUDAH DAPAT INFO LOWONGAN ---
                        if (!knowsJob('merchant')) {
                            showDialogue("MERCHANT — PAK HENDRA",
                                "Hei, ada yang bisa saya bantu?\n\n" +
                                "(Pak Hendra memandangmu dengan heran — kamu datang tanpa tahu apa-apa tentang lowongan ini)\n\n" +
                                "\"Kamu mau apa nih? Kami buka lowongan, tapi biasanya pelamar sudah baca dulu pengumuman kami di Papan Desa atau cari info dulu sebelum kesini.\"\n\n" +
                                "💡 Cari info lowongan dulu ya sebelum melamar!",
                                [
                                    { text: "📌 Di mana bisa dapat info lowongan?", action: () => {
                                        showDialogue("PAK HENDRA", 
                                            "\"Baca aja Papan Desa di tengah kampung — ada pengumuman lowongan kami di sana.\"\n\n" +
                                            "\"Atau tanya-tanya warga sekitar, atau coba cari di warnet kalau mau lengkap.\"\n\n" +
                                            "\"Kalau sudah tahu info lowongannya, baru balik ke sini ya!\"",
                                            [{ text: "Siap, makasih Pak!", action: closeDialogue }], npc.imgSrc
                                        );
                                    }},
                                    { text: "Maaf, salah masuk", action: closeDialogue }
                                ], npc.imgSrc
                            );
                            return;
                        }

                        let unemployedOpts = [
                            { text: "📨 Serahkan Surat Lamaran", action: () => submitAmplop('merchant') },
                            { text: "📝 Belum punya? Buat di Meja Belajar", action: () => {
                                showDialogue(npc.name, "Surat lamaran bisa dibuat di **Meja Belajar** di rumahmu.\n\nYang perlu kamu siapkan:\n📄 Ijazah SMA/SMK\n📋 CV\n📸 Pas Foto 3×4\n🪪 KTP\n\nSetelah selesai, bawa amplopnya kemari!", [{text:"Mengerti!", action:closeDialogue}], npc.imgSrc);
                            }},
                            { text: "Saya lihat-lihat dulu", action: closeDialogue }
                        ];
                        if (viralOpt) unemployedOpts.unshift(viralOpt);

                        showDialogue(npc.name, "Kami mencari pekerja disiplin. Shift 08:00 - 16:00. (Senin - Sabtu)\n\n📋 SYARAT MELAMAR:\n• Surat Lamaran + Ijazah SMA/SMK\n• CV, Pas Foto 3×4, KTP\n\n💡 Buat surat lamaran dulu di Meja Belajar di rumahmu, lalu bawa amplopnya kemari!", unemployedOpts, npc.imgSrc);

                    } else if (jobStatus === 'employed') {
                        // --- CEK FESTIVAL (LIBUR FESTIVAL) ---
                        if (isFestivalDayToday()) {
                            const fest = getTodayFestivalData();
                            showDialogue(npc.name, `${fest ? fest.icon : '🎉'} Hari ini **${fest ? fest.name : 'Festival Desa'}**! Toko tutup untuk festival.\n\n"Kita semua warga desa wajib hadir merayakan bersama. Nikmati festivalnya ya!"\n\n${fest ? fest.suasana : ''}`, [{ text: `${fest ? fest.icon : '🎉'} Asyik! Pergi ke festival!`, action: () => { closeDialogue(); STATE.player.x = 24 * TILE_SIZE; STATE.player.y = 22 * TILE_SIZE; showToast(`${fest ? fest.icon : '🎉'} Menuju alun-alun festival!`); }}], npc.imgSrc);
                            return;
                        }
                        // --- CEK HARI LIBUR (MINGGU) ---
                        const dayIndex = (STATE.day - 1) % 7;
                        if (dayIndex === 6) {
                            showDialogue(npc.name, `Halo ${currentTitle}. Hari ini **MINGGU**, gudang libur operasional. \nIstirahatlah!`, [{ text: "Siap Bos!", action: closeDialogue }], npc.imgSrc);
                            return;
                        }

                        // --- MENU UTAMA PEKERJA ---
                        const repDisplay = p.bossReputation || 50;
                        const repEmoji = repDisplay >= 80 ? '🌟' : repDisplay >= 50 ? '😊' : repDisplay >= 25 ? '😐' : '😡';
                        let bossText = `Halo, **${currentTitle}**. Siap bekerja hari ini?\n\n${repEmoji} Reputasimu: ${Math.round(repDisplay)}/100`;
                        let menuOptions = [];

                        // 1. OPSI MULAI SHIFT
                        if (!p.shiftStarted) {
                            // CEK FESTIVAL — libur kerja
                            if (isFestivalDayToday()) {
                                const fest = getTodayFestivalData();
                                bossText = `${fest ? fest.icon : '🎉'} Hari ini adalah ${fest ? fest.name : 'Festival Desa'}!\n\n"Toko tutup hari ini. Kita ikut festival bersama warga. Bekerjalah mulai besok ya!"\n\n😊 Reputasimu: ${Math.round(repDisplay)}/100`;
                                menuOptions.push({ text: `${fest ? fest.icon : '🎉'} Pergi ke Festival!`, action: () => { closeDialogue(); STATE.player.x = 24 * TILE_SIZE; STATE.player.y = 22 * TILE_SIZE; showToast(`${fest ? fest.icon : '🎉'} Selamat menikmati festival!`); }});
                            } else if (STATE.time >= 800 && STATE.time <= 1000) {
                                menuOptions.push({
                                    text: "✅ Mulai Shift (Tepat Waktu)",
                                    action: () => {
                                        p.shiftStarted = true;
                                        p.bossReputation += 1;
                                        showToast("Shift Dimulai 🕗");
                                        closeDialogue();
                                        maybeShowWorkConflict(false, null);
                                    }
                                });
                            } else if (STATE.time > 1000 && STATE.time < 1600) {
                                bossText = "Kamu terlambat!! Cepat masuk kerja atau gaji dipotong!";
                                menuOptions.push({
                                    text: "⚠️ Mulai Shift (Terlambat)",
                                    action: () => {
                                        p.shiftStarted = true;
                                        p.bossReputation -= 5;
                                        showToast("Shift Dimulai (Terlambat) 🕗");
                                        closeDialogue();
                                        maybeShowWorkConflict(false, null);
                                    }
                                });
                            } else {
                                bossText = "Shift kerja belum dimulai (08:00) atau gudang sudah tutup (16:00).";
                            }
                        } else {
                            bossText = "Kenapa malah ngobrol? Kembali ke posisimu!";
                            menuOptions.push({ text: "Siap Bos", action: closeDialogue });
                        }

                        // 2. OPSI PROMOSI & INFO KARIR
                        if (!p.shiftStarted) {
                            menuOptions.push({
                                text: "📈 Info Karir & Promosi",
                                action: () => {
                                    const lvl = p.jobLevel || 1;
                                    let promotionMsg = "";
                                    let canPromote = false;
                                    let nextTitle = "";
                                    let reqStr = 0;
                                    let reqRep = 0;

                                    if (lvl === 1) { nextTitle = "Staff Senior"; reqStr = 20; reqRep = 60; }
                                    else if (lvl === 2) { nextTitle = "Kepala Gudang"; reqStr = 40; reqRep = 80; }
                                    else if (lvl === 3) { nextTitle = "Manajer Cabang"; reqStr = 60; reqRep = 100; }
                                    else { promotionMsg = "Kamu sudah mencapai posisi puncak! **Manajer Cabang**."; }

                                    if (lvl < 4) {
                                        promotionMsg = `**POSISI: ${JOB_TIERS[lvl].title}** (Gaji: ${JOB_TIERS[lvl].salary})\n`;
                                        promotionMsg += `**SYARAT ${nextTitle.toUpperCase()}**:\n`;
                                        promotionMsg += `1. Strength: **${p.str}/${reqStr}** ${p.str >= reqStr ? '✅' : '❌'}\n`;
                                        promotionMsg += `2. Reputasi: **${p.bossReputation}/${reqRep}** ${p.bossReputation >= reqRep ? '✅' : '❌'}\n`;
                                        if (p.str >= reqStr && p.bossReputation >= reqRep) canPromote = true;
                                    }

                                    let promoOpts = [];
                                    if (canPromote) {
                                        if (lvl === 3) {
                                            promoOpts.push({ text: "🧠 UJIAN MANAJER", action: () => { closeDialogue(); startManagerExam(); } });
                                        } else {
                                            promoOpts.push({
                                                text: "✨ AJUKAN PROMOSI",
                                                action: () => {
                                                    p.jobLevel++;
                                                    const promoAP = p.jobLevel * 20;
                                                    p.achievementPoints = (p.achievementPoints || 0) + promoAP;
                                                    showToast(`🏆 NAIK JABATAN! +${promoAP} AP`);
                                                    showDialogue(npc.name, `Selamat! Kamu resmi menjadi **${nextTitle}**.

🏅 +${promoAP} Achievement Points sebagai bukti prestasimu!`, [{ text: "Terima kasih!", action: closeDialogue }], npc.imgSrc);
                                                }
                                            });
                                        }
                                    }
                                    promoOpts.push({ text: "Kembali", action: () => interactNPC(npc) });
                                    showDialogue("JENJANG KARIR", promotionMsg, promoOpts, npc.imgSrc);
                                }
                            });
                        }

                        // INJECT VIRAL
                        if (viralOpt) menuOptions.unshift(viralOpt);

                        // 3. LAPORAN KINERJA & KONFLIK
                        menuOptions.push({
                            text: '📊 Laporan Kinerja & Reputasi',
                            action: () => {
                                const rep = p.bossReputation || 50;
                                const repBar = '█'.repeat(Math.floor(rep/10)) + '░'.repeat(10-Math.floor(rep/10));
                                const repStatus = rep >= 80 ? '🌟 LUAR BIASA' : rep >= 60 ? '😊 BAIK' : rep >= 40 ? '😐 CUKUP' : rep >= 20 ? '⚠️ BURUK' : '🚨 KRITIS';
                                const lvl = p.jobLevel || 1;
                                showDialogue('📊 LAPORAN KINERJA BULANAN',
                                    `**Karyawan: ${p.name || 'Pemain'}**\n**Jabatan: ${JOB_TIERS[lvl]?.title || 'Magang'}**\n\n` +
                                    `📈 REPUTASI: ${Math.round(rep)}/100\n[${repBar}]\nStatus: ${repStatus}\n\n` +
                                    `💰 Gaji Harian: ${(JOB_TIERS[lvl]?.salary || 5000).toLocaleString()} G\n` +
                                    `🏅 Bonus Bulanan: ${(rep * 100).toLocaleString()} G (berbasis reputasi)\n\n` +
                                    `💡 CARA NAIKKAN REPUTASI:\n• Selesaikan konflik kerja dengan bijak\n• Datang tepat waktu\n• Selesaikan minigame kerja dengan skor tinggi\n\n` +
                                    `⚠️ CARA REP TURUN:\n• Terlambat / tidak absen\n• Respon konflik yang buruk\n• Tidak membantu tim`,
                                    [{ text: 'Tutup', action: () => interactNPC(npc) }], npc.imgSrc
                                );
                            }
                        });

                        if (!hasConflictToday()) {
                            menuOptions.push({
                                text: '⚡ Laporkan Masalah Kerja',
                                action: () => { closeDialogue(); triggerWorkConflict(false, null); }
                            });
                        }

                        if (menuOptions.length === 0) menuOptions.push({ text: "Tutup", action: closeDialogue });
                        showDialogue(npc.name, bossText, menuOptions, npc.imgSrc);
                    }
                }


                if (npc.id.includes('lover')) {
                    let isRomanceTarget = false;
                    if (p.gender === 'boy' && npc.id.includes('girl')) isRomanceTarget = true;
                    if (p.gender === 'girl' && npc.id.includes('boy')) isRomanceTarget = true;

                    // Helper judul dialog dengan status relasi baru
                    const getLoveTitle = (name, val) => {
                        const _rl = getRelationLabel(val, npc.id);
                        return `${name} [${_rl.emoji} ${val}]`;
                    };

                    if (isRomanceTarget) {
                        // Cek jika sudah menikah
                        if (p.married && p.spouseId === npc.id) {

                            // --- NEW: CEK AMBANG BATAS CERAI (GONG) ---
                            const spouseLove = p.relationships[npc.id];
                            if (spouseLove <= 0) {
                                handleDivorceSequence(npc);
                                return; // Stop interaksi normal
                            }
                            // ------------------------------------------

                            // --- UPDATE: INTERAKSI RUMAH TANGGA ---
                            let mood = "Bahagia";
                            let moodEmoji = "🥰";

                            // Tentukan mood berdasarkan level cinta terkini
                            if (spouseLove < 20) { mood = "Sangat Kecewa"; moodEmoji = "💔"; }
                            else if (spouseLove < 50) { mood = "Sedih"; moodEmoji = "😢"; }
                            else if (spouseLove < 80) { mood = "Biasa"; moodEmoji = "🙂"; }

                            // Sapaan acak
                            const greetings = [
                                "Halo sayang, ada apa?",
                                "Senang melihatmu di rumah.",
                                "Hari ini capek ya? Semangat!",
                                "Aku bersyukur kita bersama."
                            ];
                            const randGreet = greetings[Math.floor(Math.random() * greetings.length)];

                            showDialogue(`${npc.name} (${mood} ${moodEmoji})`, randGreet, [
                                {
                                    text: "🥰 Ungkapkan Cinta (Makin Sayang)",
                                    action: () => {
                                        // Tambah Cinta
                                        updateRelationship(npc, 5, "Romantis");
                                        createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#ec4899'); // Partikel Pink
                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                                        const responses = [
                                            "Aww! Aku makin cinta sama kamu! ❤️",
                                            "Kamu manis banget sih... jadi malu.",
                                            "Makasih sayang, aku juga cinta kamu selamanya!"
                                        ];
                                        showDialogue(npc.name, responses[Math.floor(Math.random() * responses.length)], [{ text: "Hehe", action: closeDialogue }], npc.imgSrc);
                                    }
                                },
                                {
                                    text: "🎁 Beri Uang Belanja Tambahan (1000G)",
                                    action: () => {
                                        if (p.money >= 1000) {
                                            p.money -= 1000;
                                            updateRelationship(npc, 10, "Nafkah Ekstra"); // Tambah banyak
                                            showToast("Istri/Suami Senang Sekali! 💰");
                                            showDialogue(npc.name, "Wahhh! Makasih banyak sayang! Nanti aku masak makanan kesukaanmu deh! 😘", [{ text: "Sama-sama", action: closeDialogue }], npc.imgSrc);
                                        } else {
                                            showToast("Uangmu tidak cukup!");
                                        }
                                    }
                                },
                                {
                                    text: "😠 Marahi / Cuek (Cinta Berkurang)",
                                    action: () => {
                                        // Kurangi Cinta
                                        updateRelationship(npc, -5, "Pertengkaran");

                                        const sadResponses = [
                                            "Kok kamu tega ngomong gitu? Jahat! 😭",
                                            "Aku capek kalau kamu begini terus...",
                                            "Tega... aku mau nangis di pojokan aja."
                                        ];

                                        showDialogue(npc.name, sadResponses[Math.floor(Math.random() * sadResponses.length)], [{ text: "Biarin (Tutup)", action: closeDialogue }], npc.imgSrc);
                                    }
                                },
                                { text: "Istirahatlah (Tutup)", action: closeDialogue }
                            ], npc.imgSrc);
                        } else {
                            // --- UPDATE: MAIN MENU INTERAKSI (BELUM NIKAH) ---

                            // Greeting sesuai kepribadian NPC
                            const _personalityGreet = getNPCGreeting(npc, love);
                            const randomGreeting = _personalityGreet || getRandomChat(npc.id, love);

                            // Cek Clue Cincin Raja (Hanya muncul sekali-sekali saat High Level)
                            let mainText = randomGreeting;
                            if (love >= 80 && Math.random() < 0.3) {
                                // NEW: Clue Palsu dari Matre
                                if (npc.id.includes('matre')) {
                                    mainText = "Eh, aku dengar kalau nikah itu butuh Cincin Raja yang harganya mahal banget. Cuma, aku gak yakin mau nikah sama kamu sih. Tapi kalau cincinnya buat aku, boleh aja!";
                                }
                                else if (npc.id === 'lover1girl') mainText = "Konon katanya, ada 'Cincin Raja' yang indah banget di Dungeon dalam. Kalau ada cowok yang ngasih itu ke aku... wah, aku pasti langsung bilang IYES! Hehe! ❤️";
                                // ... existing clues ...
                            }

                            // Bar relasi dipisah sebagai htmlSuffix agar tidak tampil sebagai teks mentah
                            const _relBarLover = renderRelationBar(npc.id, love);
                            const _mainWithBar = mainText; // teks plain saja, HTML dipass terpisah

                            const dialogueOpts = [
                                { text: "Beri Hadiah 🎁", action: () => openGiftMenu(npc) },

                                // UPDATE: Opsi Ngobrol Santai (DENGAN LOGIKA MATRE BERTINGKAT)
                                {
                                    text: "Ngobrol Santai", action: () => {
                                        // NEW: LOGIKA MATRE BERTINGKAT
                                        // Jika Matre DAN Love Level >= 20 (Sudah Kenal/Mid), baru minta bayaran
                                        if (npc.id.includes('matre') && love >= 20) {
                                            let cost = 100;
                                            if (love >= 80) cost = 500; // Kalau sudah level cinta, mintanya lebih gila (500G)

                                            if (p.money < cost) {
                                                showDialogue(npc.name, "Duh, kamu lagi bokek ya? Males ah ngobrol kalau gak ada traktiran.", [{ text: "Matre banget...", action: closeDialogue }], npc.imgSrc);
                                                return;
                                            }
                                            // Bayar Biaya Lifestyle
                                            STATE.player.money -= cost;
                                            showToast(`-${cost} Gold (Biaya Gaya Hidup)`);
                                        }

                                        // FIX: Mengubah '>' menjadi '>=' agar sisa energi terakhir bisa digunakan (Lalu pingsan jika habis)
                                        if (STATE.player.energy >= 2) {
                                            STATE.player.energy -= 2;
                                            let chatContent = getRandomChat(npc.id, love);

                                            // Pastikan chat tidak mengulang mainText jika sama
                                            if (chatContent === mainText) chatContent = getRandomChat(npc.id, love);

                                            // UPDATE RELATIONSHIP BENAR-BENAR DIPANGGIL
                                            updateRelationship(npc, 1);

                                            showDialogue(npc.name, chatContent, [{ text: "Dengarkan", action: closeDialogue }], npc.imgSrc);
                                        } else showToast("Terlalu lelah... (Butuh 2 Energi)");
                                    }
                                },

                                // UPDATE: Tombol Minigame Gombal (DENGAN PROTEKSI PERNIKAHAN & LOGIKA PELAKOR MATRE)
                                {
                                    text: "Nge-gombal", action: () => {
                                        // --- NEW: CEK STATUS PERNIKAHAN (ANTI-SELINGKUH) ---
                                        if (STATE.player.married) {
                                            // 1. LOGIKA KHUSUS MATRE (PELAKOR MODE)
                                            if (npc.id.includes('matre')) {
                                                // Tidak mengurangi hubungan, justru menggoda
                                                // Suara Chat/Giggle
                                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                                                let pelakorMsg = "";
                                                if (npc.id === 'lover_matre_girl') { // Siska
                                                    pelakorMsg = "Wah, cincin di jarimu bagus juga... Istrimu pasti bahagia ya punya suami mapan.\n\nSayang sekali kita telat ketemu. Tapi... kalau kamu bosan di rumah, aku selalu siap kok nemenin kamu belanja atau makan enak. \n\nAsal kamu yang bayar, rahasia aman! Kita jadi 'teman spesial' aja gimana? Hihihi. 😉";
                                                } else { // Rendi
                                                    pelakorMsg = "Wih, ternyata sudah sold out. Padahal aku kira kita ada chemistry.\n\nTapi santai aja, aku orangnya asik kok. Kalau suamimu sibuk kerja dan kamu butuh hiburan, telepon aja aku. Kita bisa jalan-jalan berkelas bareng... tentunya pakai budget kamu dong. Deal? 😎";
                                                }

                                                showDialogue(npc.name + " (Menggoda)", pelakorMsg, [{ text: "Duh, bahaya nih...", action: closeDialogue }], npc.imgSrc);
                                                return;
                                            }

                                            // 2. LOGIKA UMUM (NPC BAIK AKAN MARAH)
                                            // Ambil nama pasangan untuk dialog
                                            let spouseName = "Pasanganmu";
                                            const sid = STATE.player.spouseId;
                                            if (sid === 'lover1girl') spouseName = "Ayu";
                                            else if (sid === 'lover2girl') spouseName = "Putri";
                                            else if (sid === 'lover1boy') spouseName = "Dr. Budi";
                                            else if (sid === 'lover2boy') spouseName = "Satria";

                                            // Hukuman: Kurangi Relasi dengan NPC ini
                                            updateRelationship(npc, -5, "Ditolak Keras");

                                            // Efek Suara Marah/Pukul
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                                            showDialogue(npc.name + " (Marah)",
                                                `HEH! Apa-apaan kamu?! 😡\n\nLihat cincin di jarimu itu! Kamu kan sudah menikah dengan **${spouseName}**.\n\nJangan ganjen ya! Pulang sana, ingat orang di rumah yang setia nungguin kamu!\n\n(Dia menolak rayuanmu mentah-mentah)`,
                                                [{ text: "Maaf, aku khilaf...", action: closeDialogue }],
                                                npc.imgSrc
                                            );
                                            return;
                                        }

                                        // Jika Belum Menikah, Lanjut Normal
                                        if (STATE.player.energy >= 3) {
                                            STATE.player.energy -= 3;
                                            startGombalGame(npc);
                                        } else showToast("Kurang energi buat mikir gombalan. (Butuh 3)");
                                    }
                                }
                            ];

                            /* --- NEW: OPSI BEROBAT KHUSUS DR. BUDI --- */
                            if (npc.id === 'lover1boy') {
                                // Masukkan opsi Berobat ke urutan paling atas (unshift)
                                dialogueOpts.unshift({
                                    text: "💉 Berobat (Full Heal - 500G)",
                                    action: () => {
                                        if (STATE.player.money >= 500) {
                                            STATE.player.money -= 500;
                                            STATE.player.hp = STATE.player.maxHp;
                                            STATE.player.energy = 100;
                                            showToast("Sehat Walafiat! ✨");
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                            closeDialogue();
                                        } else showToast("Uang tidak cukup!");
                                    }
                                });

                                // Tambahan Konsultasi
                                dialogueOpts.splice(1, 0, {
                                    text: "🩺 Konsultasi Kesehatan",
                                    action: () => {
                                        showDialogue(npc.name, "Jaga pola makan dan tidur. Jangan terlalu sering begadang di Dungeon ya.", [{ text: "Baik Dok", action: closeDialogue }], npc.imgSrc);
                                    }
                                });
                            }

                            /* --- NEW: OPSI PANDUAN HEWAN KHUSUS SATRIA (KSATRIA) --- */
                            if (npc.id === 'lover2boy') {
                                dialogueOpts.unshift({
                                    text: "🐾 Toko Pet Satria",
                                    action: () => openPetShop(npc)
                                });
                                dialogueOpts.unshift({
                                    text: "🐾 Panduan Hewan & Ternak",
                                    action: () => {
                                        showDialogue(npc.name, "Seorang Ksatria harus memahami alam. Hewan adalah sekutu yang setia jika kau mengerti bahasa mereka. Apa yang ingin kau pelajari?", [
                                            {
                                                text: "Cara Menjinakkan/Merawat", action: () => {
                                                    showDialogue(npc.name, "Hewan di desa ini jinak namun butuh perhatian.\n\n1. **Dekati perlahan** (jangan lari).\n2. Tekan **Tombol Interaksi** saat berada di dekatnya.\n3. Jika muncul tanda ❤️ (Hati), berarti mereka bahagia dan mungkin memberikan hasil ternak.", [{ text: "Siap laksanakan", action: closeDialogue }], npc.imgSrc);
                                                }
                                            },
                                            {
                                                text: "Jenis Hewan Nusantara", action: () => {
                                                    showDialogue(npc.name, "Kenali kekayaan fauna di tanah ini:\n\n🐔 **Ayam Kampung**: Lincah dan mandiri, penghasil telur protein tinggi.\n🐐 **Kambing Etawa**: Tangguh menaki bukit, susunya sangat bergizi.\n🐄 **Sapi Bali**: Hewan pekerja keras, lambang kemakmuran.\n🐎 **Kuda Sumba (Sandalwood)**: Kuda pacu legendaris yang gesit dan setia.", [{ text: "Wah, wawasan baru!", action: closeDialogue }], npc.imgSrc);
                                                }
                                            },
                                            { text: "Kembali", action: () => interactNPC(npc) }
                                        ], npc.imgSrc);
                                    }
                                });
                            }

                            // --- LOGIKA TOMBOL LAMAR DENGAN CINCIN ---
                            const isFamily = (STATE.player.role === 'family');
                            const hasLegendRing = (STATE.player.inventory['cincin_legend'] || 0) > 0;
                            const hasWoodRing = (STATE.player.inventory['cincin_kayu'] || 0) > 0;
                            const modinVisited = STATE.player.modinVisited === true;

                            // BLOKIR CINCIN JIKA SUDAH MENIKAH — tidak tampilkan tombol lamar sama sekali
                            // (tombol hanya muncul jika belum menikah)
                            if (!STATE.player.married) {
                            // Syarat lamar:
                            // Family: sudah temui modin + punya cincin kayu
                            // Non-family: punya cincin legend + love >= 80
                            const canMarry = isFamily ? (modinVisited && hasWoodRing) : (hasLegendRing && love >= 80);

                            // Hint jika role family tapi belum temui modin
                            if (isFamily && !modinVisited && !STATE.player.married) {
                                dialogueOpts.push({
                                    text: "💍 Lamar? (Temui Pak Modin dulu!)",
                                    action: () => showToast("⚠️ Pergi ke Balai Pernikahan dan temui Pak Modin dulu!")
                                });
                            }

                            if (canMarry) {
                                let btnText = isFamily ? "💍 LAMAR (Berikan Cincin Kayu)" : "💍 LAMAR (Berikan Cincin Raja)";
                                dialogueOpts.push({
                                    text: btnText,
                                    action: () => {
                                        // NEW: CEK APAKAH SUDAH MENIKAH (Mencegah Poligami)
                                        if (STATE.player.married) {
                                            showToast("Kamu sudah menikah! Setia dong! 🚫");
                                            return;
                                        }

                                        // NEW: CEK APAKAH INI CINTA MATRE?
                                        if (npc.id.includes('matre')) {
                                            let rejectText = "Hah? Nikah? Sama kamu? \nAduh maaf ya, kita kan cuma teman senang-senang aja. Lagian hartamu belum cukup buat gaya hidupku. \nCincinnya bagus sih, tapi... NO THANKS! Bye! 💔";
                                            if (npc.id === 'lover_matre_boy') rejectText = "Waduh, kamu baper ya? Maaf cantik, aku belum siap berkomitmen dengan ekonomi pas-pasan. Kita TTM-an aja ya. Cincinnya simpan aja buat beli beras.";

                                            updateRelationship(npc, -20, "Patah Hati");
                                            STATE.player.energy = 0; // Lemas seketika

                                            showDialogue(npc.name, rejectText, [{
                                                text: "Sakitnya Tuh Disini... (Pingsan)", action: () => {
                                                    closeDialogue();
                                                    handleFaint(); // Pingsan karena shock
                                                }
                                            }], npc.imgSrc);
                                            return;
                                        }

                                        // ... Logic Lamar Normal (Sukses) ...
                                        if (isFamily) {
                                            STATE.player.inventory['cincin_kayu']--;
                                            if (STATE.player.inventory['cincin_kayu'] <= 0) delete STATE.player.inventory['cincin_kayu'];
                                        } else {
                                            STATE.player.inventory['cincin_legend']--;
                                            if (STATE.player.inventory['cincin_legend'] <= 0) delete STATE.player.inventory['cincin_legend'];
                                        }

                                        // Set Status Menikah
                                        p.married = true;
                                        p.spouseId = npc.id;
                                        p.reputation += 100;
                                        p.money += 10000;
                                        // Track hari menikah untuk sistem konflik
                                        p.marriedDay = STATE.day;
                                        p.marriageMonth = 1;
                                        p.marriageConflictLevel = 0; // 0=honeymoon, 1=mulai muncul masalah, 2=krisis, 3=kritis
                                        p.lastConflictDay = STATE.day;
                                        p.monthlyExpenses = 0; // tagihan bulanan kumulatif

                                        const targetId = npc.id;
                                        const targetName = npc.name.replace(' (Calon)', '');

                                        showFloatingText(npc.x * TILE_SIZE, npc.y * TILE_SIZE - 50, "SHE SAID YES! 💍", '#ec4899');
                                        createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#e74c3c');
                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                                        if (isFamily) {
                                            // Family role sudah dihandle di blok modin
                                            showDialogue(getLoveTitle(npc.name, love), "AKU BERSEDIA! ❤️\n(Kamu menyerahkan cincin. Hubungan kalian kini abadi.)", [{ text: "Bahagia Selamanya", action: closeDialogue }], npc.imgSrc);
                                        } else {
                                            // --- NON-FAMILY: TELEPORT KE BALAI PERNIKAHAN DULU ---
                                            showDialogue(getLoveTitle(targetName, love),
                                                `AKU BERSEDIA! ❤️\n\n"${targetName} menggenggam tanganmu erat.\n\n"Ayo kita segera ke Balai Pernikahan... aku sudah tidak sabar."`,
                                                [{
                                                    text: "Ayo, Sayang! (Pergi ke Balai)",
                                                    action: () => {
                                                        closeDialogue();

                                                        // 1. Ubah sprite player jadi baju pengantin
                                                        const pGender = STATE.player.gender;
                                                        if (STATE.player.spriteIdle) STATE.player.spriteIdle.src = `images/${pGender}-idle-weding.png`;
                                                        if (STATE.player.spriteWalk) STATE.player.spriteWalk.src = `images/${pGender}-walk-weding.png`;
                                                        if (STATE.player.spriteWalkUp) STATE.player.spriteWalkUp.src = `images/${pGender}-atas-weding.png`;
                                                        if (STATE.player.spriteWalkDown) STATE.player.spriteWalkDown.src = `images/${pGender}-bawah-weding.png`;
                                                        if (STATE.player.spriteIdle) {
                                                            STATE.player.spriteIdle.onerror = function () {
                                                                this.src = `images/${pGender}-idle.png`;
                                                            };
                                                        }

                                                        // 2. Spawn pasangan di altar wedding hall pakai baju pengantin
                                                        const weddingImages = {
                                                            'lover1girl': 'images/lover1girl-weding.png',
                                                            'lover2girl': 'images/lover2girl-weding.png',
                                                            'lover1boy': 'images/lover1boy-weding.png',
                                                            'lover2boy': 'images/lover2boy-weding.png'
                                                        };
                                                        const weddingImg = weddingImages[targetId] || 'images/lover1girl-weding.png';
                                                        const wMap = maps['wedding_interior'];
                                                        if (wMap) {
                                                            wMap.npcs = wMap.npcs.filter(n => !n.id.startsWith('lover'));
                                                            wMap.npcs.push({
                                                                id: targetId,
                                                                x: 8.5, y: 3,
                                                                name: targetName + " (Calon)",
                                                                imgSrc: weddingImg,
                                                                type: 'static',
                                                                schedule: 'always',
                                                                w: 40, h: 60
                                                            });
                                                        }

                                                        // 3. Pindah lokasi ke wedding interior
                                                        STATE.location = 'wedding_interior';
                                                        STATE.player.x = 6.5 * TILE_SIZE;
                                                        STATE.player.y = 5 * TILE_SIZE;
                                                        STATE.player.direction = 'up';

                                                        // 4. Partikel & efek masuk
                                                        createParticle(STATE.player.x, STATE.player.y, '#ec4899');
                                                        createParticle(STATE.player.x, STATE.player.y, '#ffffff');
                                                        showToast("Tiba di Balai Pernikahan 💍");

                                                        // 5. Musik wedding
                                                        if (typeof AudioService !== 'undefined') AudioService.playBGM('wedding');

                                                        // 6. Delay sebentar lalu muncul dialog akad dari Modin
                                                        setTimeout(() => {
                                                            const penghulu = maps['wedding_interior'] && maps['wedding_interior'].npcs.find(n => n.id === 'penghulu');
                                                            const penghImg = penghulu ? penghulu.imgSrc : 'images/modin.png';

                                                            showDialogue("BAPAK PENGHULU",
                                                                `MasyaAllah... ${targetName} sudah berdiri di sampingmu dengan pakaian pengantin.\n\nHari ini adalah hari paling sakral dalam hidupmu.\n\nApakah kamu sudah siap melangsungkan akad nikah sekarang?`,
                                                                [
                                                                    {
                                                                        text: "Bismillah, Saya Siap! (Akad)",
                                                                        action: () => {
                                                                            closeDialogue();

                                                                            // Confetti
                                                                            const confettiColors = ['#ef4444', '#f97316', '#facc15', '#4ade80', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'];
                                                                            for (let i = 0; i < 100; i++) {
                                                                                const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                                                                                const speed = 2 + Math.random() * 6;
                                                                                const angle = Math.random() * Math.PI * 2;
                                                                                STATE.particles.push({
                                                                                    x: STATE.player.x + 10, y: STATE.player.y + 10,
                                                                                    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                                                                                    life: 60 + Math.random() * 40, color: color
                                                                                });
                                                                            }

                                                                            // Teks SAH
                                                                            spawnFloatingText(STATE.player.x, STATE.player.y - 60, "SAH!!!", "#fbbf24", 30);
                                                                            spawnFloatingText(STATE.player.x - 40, STATE.player.y - 40, "SAH!", "#ffffff", 15);
                                                                            spawnFloatingText(STATE.player.x + 40, STATE.player.y - 40, "SAH!", "#ffffff", 15);

                                                                            // 🎬 CINEMATIC WEDDING
                                                                            STATE.screen = 'cutscene';
                                                                            STATE.cutsceneOverride = true;
                                                                            playCutsceneWedding(targetName, null);

                                                                            // Cinematic selesai → restore game (via callback playCutsceneWedding)
                                                                            // Override callback untuk restore state
                                                                            const _restoreAfterWedding = () => {
                                                                                STATE.cutsceneOverride = false;
                                                                                STATE.day++;
                                                                                STATE.time = 600;
                                                                                STATE.player.energy = 100;
                                                                                STATE.player.hp = STATE.player.maxHp;
                                                                                if (STATE.player.role === 'entrepreneur') {
                                                                                    STATE.location = 'player_shop_interior';
                                                                                    STATE.player.x = 5 * TILE_SIZE;
                                                                                    STATE.player.y = 3 * TILE_SIZE;
                                                                                } else {
                                                                                    STATE.location = 'house';
                                                                                    STATE.player.x = 3 * TILE_SIZE;
                                                                                    STATE.player.y = 2 * TILE_SIZE;
                                                                                }
                                                                                STATE.player.direction = 'right';
                                                                                regenerateHouseMap();
                                                                                STATE.screen = 'play';
                                                                                manualSave();
                                                                                showToast("Keesokan paginya... ☀️");
                                                                                setTimeout(() => {
                                                                                    const spouse = maps['house'].npcs.find(n => n.id === targetId);
                                                                                    if (spouse) {
                                                                                        createParticle(spouse.x * TILE_SIZE, spouse.y * TILE_SIZE, '#ec4899');
                                                                                        createParticle(STATE.player.x, STATE.player.y, '#ec4899');
                                                                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                                                                        showDialogue(spouse.name,
                                                                                            "Selamat pagi sayang! ❤️\n\nRasanya seperti mimpi kita sudah tinggal serumah.\nAku sangat bahagia bisa melihat wajahmu saat bangun tidur.\n\nOh iya... soal keseharian kita, aku ingin diskusi denganmu.",
                                                                                            [{
                                                                                                text: "Pagi juga cintaku! Ada apa?",
                                                                                                action: () => {
                                                                                                    createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                                                                                                    closeDialogue();
                                                                                                    // Munculkan pilihan peran RT vs Kerja Luar
                                                                                                    setTimeout(() => {
                                                                                                        const pGender = STATE.player.gender;
                                                                                                        const spouseGender = (targetId === 'lover1boy' || targetId === 'lover2boy') ? 'boy' : 'girl';
                                                                                                        const pRoleLabel = pGender === 'boy' ? 'Bapak Rumah Tangga' : 'Ibu Rumah Tangga';
                                                                                                        const spouseRoleLabel = spouseGender === 'boy' ? 'Bapak Rumah Tangga' : 'Ibu Rumah Tangga';
                                                                                                        const pImg2 = pGender === 'boy' ? 'images/boy.png' : 'images/girl.png';
                                                                                                        showDialogue(spouse.name,
                                                                                                            "Sayang... kita perlu memutuskan pembagian peran kita. 🏡\n\nSalah satu dari kita akan mengurus rumah, dan yang lain bekerja di luar.\n\nKamu mau pilih peran yang mana?",
                                                                                                            [
                                                                                                                {
                                                                                                                    text: `🏠 Aku jadi ${pRoleLabel} (Urus Rumah)`,
                                                                                                                    action: () => {
                                                                                                                        STATE.player.homeRole = 'homemaker';
                                                                                                                        closeDialogue();
                                                                                                                        const label = pRoleLabel;
                                                                                                                        showDialogue(pImg2 === 'images/boy.png' ? "SUAMI" : "ISTRI",
                                                                                                                            `Baiklah! Aku akan menjadi **${label}** yang mengurus rumah dengan sepenuh hati. 🏡\n\nPasanganku akan bekerja mencari nafkah, dan aku akan memastikan rumah selalu nyaman saat dia pulang.\n\nTugas harianku: memasak, bersih-bersih, dan menjaga rumah tetap hangat. Ayo semangat! 💪`,
                                                                                                                            [{ text: "Siap! Bismillah~", action: () => { closeDialogue(); showToast(`Peranmu: ${label} 🏠`); } }],
                                                                                                                            pImg2
                                                                                                                        );
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    text: `💼 Aku bekerja di luar, pasanganku jadi ${spouseRoleLabel}`,
                                                                                                                    action: () => {
                                                                                                                        STATE.player.homeRole = 'worker';
                                                                                                                        closeDialogue();
                                                                                                                        showDialogue(spouse.name,
                                                                                                                            `Oke sayang, aku akan menjadi **${spouseRoleLabel}** dan urus rumah di sini ya! 🏡\n\nTapi... kamu harus **pulang sebelum jam 17:00** ya! Jangan sampai telat, aku tunggu di rumah.\n\nKalau kamu terlambat pulang, pasti aku marah-marahin hehe... 😤\n\nSetiap pagi kamu pamit, aku doakan supaya lancar kerjanya! 🙏`,
                                                                                                                            [{ text: "Siap! Aku akan pulang tepat waktu!", action: () => { closeDialogue(); showToast("Kamu berangkat kerja. Pulang sebelum jam 17:00! 💼"); } }],
                                                                                                                            spouse.imgSrc
                                                                                                                        );
                                                                                                                    }
                                                                                                                }
                                                                                                            ],
                                                                                                            spouse.imgSrc
                                                                                                        );
                                                                                                    }, 800);
                                                                                                }
                                                                                            }],
                                                                                            spouse.imgSrc
                                                                                        );
                                                                                    }
                                                                                }, 1500);
                                                                            };
                                                                            // Inject callback ke cinematic yang sudah jalan
                                                                            setTimeout(_restoreAfterWedding, 15500); // ~15.5 detik = durasi 3 slide
                                                                        }
                                                                    },
                                                                    {
                                                                        text: "Sebentar Pak, saya grogi...",
                                                                        action: closeDialogue
                                                                    }
                                                                ],
                                                                penghImg
                                                            );
                                                        }, 800);
                                                    }
                                                }],
                                                npc.imgSrc
                                            );
                                        }
                                    }
                                });
                            } else {
                                // JIKA BELUM MEMENUHI SYARAT
                                let lockText = isFamily ? "🔒 Lamar (Butuh Item: Cincin Kayu)" : "🔒 Lamar (Butuh Cinta 80 & Cincin Raja)";
                                dialogueOpts.push({
                                    text: lockText,
                                    action: () => showToast(isFamily ? "Pastikan kamu punya 'Cincin Kayu'!" : "Syarat bertunangan: Cinta 80+ & 'Cincin Raja'!")
                                });
                            }

                            } else {
                                // SUDAH MENIKAH — tampilkan pesan setia, jangan bisa kasih cincin
                                const spouseNames = {lover1girl:'Ayu',lover2girl:'Putri',lover1boy:'Dr. Budi',lover2boy:'Satria',lover_matre_girl:'Siska',lover_matre_boy:'Rendi'};
                                const mySpouse = spouseNames[STATE.player.spouseId] || 'pasanganmu';
                                dialogueOpts.push({
                                    text: '💍 Lamar? (Kamu sudah menikah!)',
                                    action: () => showDialogue('⚠️ SETIA', `Hei, kamu sudah menikah dengan **${mySpouse}**!\n\nCincin ini bukan milikmu untuk diberikan ke orang lain.\n\nJaga kesetiaan dan hargai pasanganmu. 💍`, [{text:'Iya, aku salah fokus...', action:closeDialogue}], 'images/boy.png')
                                });
                            }

                            dialogueOpts.push({ text: "Dah", action: closeDialogue });

                            showDialogue(getLoveTitle(npc.name, love), _mainWithBar, dialogueOpts, npc.imgSrc, _relBarLover);
                        }
                    } else {
                        // --- NEW: INTERAKSI DOKTER BUDI UNTUK SESAMA COWOK (PASIEN) ---
                        if (npc.id === 'lover1boy') {
                            // Bank Data Tips Kesehatan
                            const HEALTH_TIPS_BANK = [
                                "Jangan lupa minum air putih minimal 2 liter sehari ya, bro. Ginjal itu aset mahal!",
                                "Kalau habis dari Dungeon, pastikan luka lu dibersihkan biar gak infeksi. Tetanus itu gak lucu.",
                                "Tidur itu penting buat regenerasi sel. Jangan mentang-mentang masih muda lu hajar begadang terus.",
                                "Makan 4 sehat 5 sempurna itu bukan mitos SD. Itu bahan bakar buat lu kerja keras.",
                                "Stres bisa bikin imun turun drastis. Sekali-kali mancing atau jalan-jalan lah biar rileks.",
                                "Kurangi gula, bro. Diabetes gak pandang umur. Mending manis di senyum daripada di darah.",
                                "Otot butuh protein. Kalau lu mau kuat bawa pedang berat, banyakin makan ikan atau telur."
                            ];

                            showDialogue(npc.name, "Halo bro! Kelihatan pucat nih. Ada yang bisa saya bantu? Mau berobat, konsultasi, atau cari kerja part-time di sini?", [
                                {
                                    text: "💉 Berobat (Full Heal - 500G)",
                                    action: () => {
                                        if (STATE.player.money >= 500) {
                                            STATE.player.money -= 500;
                                            STATE.player.hp = STATE.player.maxHp;
                                            STATE.player.energy = 100;
                                            showToast("Tubuh Segar Bugar! ✨");
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                            closeDialogue();
                                        } else {
                                            showToast("Waduh, uang lu kurang bro. Sehat itu mahal.");
                                        }
                                    }
                                },
                                {
                                    text: "🏥 Minta Surat Keterangan Sehat (1.000 G)",
                                    action: () => {
                                        const p = STATE.player;
                                        if ((p.inventory['surat_sehat']||0) > 0) {
                                            showToast('Kamu sudah punya Surat Sehat di tas!'); return;
                                        }
                                        if (p.money >= 1000) {
                                            p.money -= 1000;
                                            addItem('surat_sehat', 1);
                                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                            showToast('🏥 Surat Keterangan Sehat masuk ke tas!');
                                            closeDialogue();
                                        } else {
                                            showToast('Uang tidak cukup! Butuh 1.000 G.');
                                        }
                                    }
                                },
                                {
                                    text: "🩺 Minta Tips Kesehatan",
                                    action: () => {
                                        const randomTip = HEALTH_TIPS_BANK[Math.floor(Math.random() * HEALTH_TIPS_BANK.length)];
                                        showDialogue(npc.name, `💡 **TIPS DOKTER:**\n\n"${randomTip}"`, [{ text: "Siap Dok, makasih!", action: closeDialogue }], npc.imgSrc);
                                    }
                                },
                                {
                                    text: STATE.player.partTimeStatus === 'working' && STATE.player.partTimeJob === 'klinik' ? "🩺 [PART-TIME] Absen / Status Kerja" : "🩺 Lamar Part-Time di Klinik",
                                    action: () => {
                                        const isActiveKlinik = STATE.player.partTimeStatus === 'working' && STATE.player.partTimeJob === 'klinik';
                                        if (isActiveKlinik) {
                                            openPartTimeMenu('lover1boy');
                                        } else {
                                            showDialogue('Dr. Budi',
                                                '"Oh, mau bantu kerja di klinik? Boleh!\n\nTapi saya butuh surat lamaran resmi dulu bro. Klinik itu formal, harus ada dokumen lengkap.\n\n📋 Yang saya butuhkan:\n• Surat Lamaran\n• Ijazah SMA/SMK\n• CV, Pas Foto & KTP\n• Surat Keterangan Sehat (wajib!)\n\nBuat di Meja Belajar di rumahmu, lalu bawa amplopnya kemari."',
                                                [
                                                    { text: '📨 Serahkan Amplop Lamaran', action: () => submitAmplop('lover1boy') },
                                                    { text: '📝 Belum buat, nanti ke meja belajar', action: closeDialogue }
                                                ], npc.imgSrc
                                            );
                                        }
                                    }
                                },
                                { text: "Cuma lewat", action: closeDialogue }
                            ], npc.imgSrc);
                            return;
                        }

                        /* --- NEW: INTERAKSI SATRIA UNTUK SESAMA COWOK (MENTOR/BRO) --- */
                        if (npc.id === 'lover2boy') {
                            const love = STATE.player.relationships[npc.id] || 0;
                            showDialogue(npc.name, "Salam hormat! Posturmu tegap hari ini. Tertarik mempelajari ilmu alam dan kepemimpinan?", [
                                {
                                    text: "🐾 Toko Pet Satria",
                                    action: () => openPetShop(npc)
                                },
                                {
                                    text: "🐾 Panduan Hewan (Pet Info)",
                                    action: () => {
                                        showDialogue(npc.name, "Mengurus hewan melatih kesabaran seorang prajurit. Apa yang ingin kau ketahui?", [
                                            {
                                                text: "Cara Berinteraksi", action: () => {
                                                    showDialogue(npc.name, "Kuncinya adalah **Ketenangan**. \nDekati hewan tanpa gerakan mendadak, lalu elus mereka (Tombol Aksi). \nHewan yang bahagia akan memberikan berkah (Resource).", [{ text: "Paham", action: closeDialogue }], npc.imgSrc);
                                                }
                                            },
                                            {
                                                text: "Ensiklopedia Hewan Nusantara", action: () => {
                                                    showDialogue(npc.name, "Ini catatan pengamatanku:\n\n🐔 **Ayam Bekisar**: Suaranya merdu, ikon kebanggaan timur Jawa.\n🐐 **Kambing Kacang**: Kecil tapi lincah dan tahan banting.\n🐄 **Sapi Madura**: Memiliki punuk khas, sangat kuat untuk membajak.\n🐎 **Kuda Sumbawa**: Kuda petarung yang pemberani di medan laga.", [{ text: "Mantap infonya bro!", action: closeDialogue }], npc.imgSrc);
                                                }
                                            },
                                            { text: "Kembali", action: () => interactNPC(npc) }
                                        ], npc.imgSrc);
                                    }
                                },
                                {
                                    text: "Minta Motivasi 💪", action: () => {
                                        const quotes = [
                                            "Pedang menumpul jika tidak diasah, manusia melemah jika tidak diuji.",
                                            "Jangan takut berjalan lambat, takutlah jika hanya berdiri diam.",
                                            "Seorang Ksatria sejati bukan yang tak pernah jatuh, tapi yang selalu bangkit!",
                                            "Keberanian bukan ketiadaan rasa takut, tapi kemampuan untuk melangkah meski gemetar."
                                        ];
                                        showDialogue(npc.name, `"${quotes[Math.floor(Math.random() * quotes.length)]}"`, [{ text: "Terbakar semangat!", action: closeDialogue }], npc.imgSrc);
                                    }
                                },
                                { text: "Cuma lewat", action: closeDialogue }
                            ], npc.imgSrc);
                            return;
                        }

                        showDialogue(npc.name, "Halo kawan! Sukses ujiannya ya.", [{ text: "Sip", action: closeDialogue }], npc.imgSrc);
                    }
                    return;
                } else if (npc.id === 'mentor') {
                    const role = STATE.player.role;

                    // FIX: Jika Role belum dipilih (New Game / Reset), paksa jalankan Tutorial
                    if (role === 'none') {
                        runTutorial();
                        return;
                    }

                    const name = DataService.user ? DataService.user.name : "Siswa";

                    // GUNAKAN npc.name (yang sudah diupdate di initGame)
                    showDialogue(npc.name, `Halo, ${name}. Saya di sini untuk membimbingmu agar tidak tersesat di Pulau Arsa. Apa yang ingin kamu ketahui?`, [
                        {
                            text: "Apa tugasku sekarang? (Role)", action: () => {
                                let advice = "";
                                let specificBuilding = "";

                                if (role === 'worker') {
                                    advice = "Kamu memilih jalur Fighter (Pekerja). Fokus utamamu adalah FISIK & KETERAMPILAN. \n1. Tingkatkan STR dengan bekerja kasar atau berlatih.\n2. Lamar kerja di Merchant (Masuk Gedung).\n3. Jaga hubungan dengan Bos agar tidak dipecat.";
                                    specificBuilding = "Merchant (Interior)";
                                } else if (role === 'student') {
                                    advice = "Kamu memilih jalur Mage (Akademisi). Senjatamu adalah OTAK. \n1. Wajib ke Kampus setiap pagi untuk kuliah.\n2. Tingkatkan INT untuk membuka akses beasiswa.\n3. Jangan terlalu sering main fisik, jaga Energimu untuk belajar.";
                                    specificBuilding = "Kampus";
                                } else if (role === 'entrepreneur') {
                                    advice = "Kamu memilih jalur Support (Wirausaha). Tugasmu memutar UANG. \n1. Beli barang murah di Merchant, jual saat harga naik.\n2. Jangan konsumtif! Setiap Gold adalah modal.\n3. Bangun relasi bisnis dengan warga kaya di desa.";
                                    specificBuilding = "Merchant/Pasar";
                                } else if (role === 'family') {
                                    advice = "Kamu memilih jalur Tanker (Keluarga). Kekuatanmu adalah SOSIAL. \n1. Sapa semua tetangga setiap hari.\n2. Naikkan Reputasi dengan membantu orang.\n3. Fokus menabung untuk biaya pernikahan yang sangat mahal.";
                                    specificBuilding = "Balai Pernikahan";
                                } else {
                                    // Fallback jika lolos pengecekan awal (seharusnya tidak terpanggil karena fix di atas)
                                    runTutorial();
                                    return;
                                }

                                showDialogue(npc.name, advice, [
                                    { text: `Dimana ${specificBuilding}?`, action: () => showToast(`Cek Peta! ${specificBuilding} ada ikon khususnya.`) },
                                    { text: "Siap Laksanakan", action: () => interactNPC(npc) }
                                ], npc.imgSrc);
                            }
                        },

                        // --- NEW: OPSI DIALOG INFO BEASISWA ---
                        {
                            text: "Info Beasiswa & Biaya", action: () => {
                                showDialogue(npc.name,
                                    "Pendidikan itu investasi, tapi biayanya berbeda tergantung otakmu!\n\n📜 **JALUR REGULER**:\n- Syarat: Lulus Ujian (Nilai Minimal).\n- Biaya: Bayar Uang Pangkal & **UKT 600.000 / Tahun**.\n\n🏆 **JALUR BEASISWA**:\n- Syarat: **Nilai Ujian Sempurna (100)**.\n- Benefit: **GRATIS UKT** & dapat **Uang Saku 15.000 / Bulan**!\n\nJadi, belajar yang rajin sebelum ujian masuk!",
                                    [{ text: "Wah, menggiurkan!", action: () => interactNPC(npc) }],
                                    npc.imgSrc
                                );
                            }
                        },

                        {
                            text: "Jelaskan Fungsi Bangunan", action: () => {
                                showDialogue(npc.name, "Setiap bangunan punya fungsi unik:\n🏪 Merchant: Beli/Jual Barang.\n🏫 Kampus: Belajar (INT).\n🏥 Klinik: Pulihkan Kesehatan.\n⚒️ Blacksmith: Info Karir & Upgrade.\n⚔️ Guild: Misi Petualang.\n📚 Perpustakaan: Info Lore & Resep.", [{ text: "Terima kasih", action: () => interactNPC(npc) }], npc.imgSrc);
                            }
                        },

                        {
                            text: "Nasihat Hidup", action: () => {
                                showDialogue(npc.name, "Ingat, Nak. Waktu adalah mata uang paling mahal di sini. Jangan habiskan harimu hanya untuk berjalan-jalan tanpa tujuan. Tentukan target harianmu.", [{ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Siap Mentor", action: closeDialogue }], npc.imgSrc);
                            }
                        },

                        { text: "🤖 Minta Analisis AI", action: () => openAIMentor(npc) },
                        { text: "🔍 Info Lowongan & Karir", action: () => { closeDialogue(); searchJobFromMentor(); } },
                        { text: "Tutup", action: closeDialogue }
                    ], npc.imgSrc);
                }

                // UPDATE: Interaksi Anak Blacksmith (Di Luar)
                else if (npc.id === 'child_blacksmith') {
                    showDialogue(npc.name, "Halo Kak! Ayah sedang sibuk menempa di dalam bengkel. Kalau mau upgrade senjata, masuk saja ya!", [
                        { text: "Wah rajin ya", action: closeDialogue },
                        {
                            text: "Kamu sedang apa?", action: () => {
                                showDialogue(npc.name, "Aku sedang belajar membedakan bijih besi dan batu biasa. Susah juga ya...", [{ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Semangat!", action: closeDialogue }], npc.imgSrc);
                            }
                        }
                    ], npc.imgSrc);
                }

                // --- NEW: INTERAKSI OPERATOR WARNET (MENU KERJA/MAIN) ---
                else if (npc.id === 'op_warnet') {
                    // Panggil fungsi menu warnet yang sudah ada, tapi ganti gambarnya jadi penjaga
                    showDialogue("OPERATOR (OP)", "Selamat datang di Warnet Desa. \nKoneksi lancar, AC dingin, Mie Instan ready. Mau sewa billing?", [
                        {
                            text: "💻 Sewa PC (Kerja/Main)", action: () => {
                                closeDialogue();
                                openWarnetMenu(); // Panggil menu lama
                            }
                        },
                        {
                            text: "🔍 Cari Info Lowongan Kerja (500G)", action: () => {
                                closeDialogue();
                                searchJobFromWarnet();
                            }
                        },
                        {
                            text: "Tanya Paket Malam", action: () => {
                                showDialogue(npc.name, "Paket Malam (Begadang) tersedia dari jam 22:00 - 04:00. Diskon 50% tapi awas masuk angin.", [{ text: "Oke", action: closeDialogue }], npc.imgSrc);
                            }
                        },
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Batal", action: closeDialogue }
                    ], npc.imgSrc);
                }

                // --- NEW: INTERAKSI MAID CAFE (JUAL MAKANAN) ---
                else if (npc.id === 'maid_warnet') {
                    showDialogue(npc.name, "Selamat datang, Master! ❤️ \nMau pesan cemilan atau minuman penyegar untuk menemani main game?", [
                        {
                            text: "☕ Beli Kopi/Tonic (Pulihkan Energi)", action: () => {
                                showDialogue("MENU CAFE", "Pilih menu penyegar:", [
                                    {
                                        text: "Kopi Hitam (200 G) - Energi +20", action: () => {
                                            if (STATE.player.money >= 200) {
                                                STATE.player.money -= 200;
                                                STATE.player.energy = Math.min(100, STATE.player.energy + 20);
                                                showToast("Segar! Energi +20");
                                                closeDialogue();
                                            } else showToast("Uang kurang");
                                        }
                                    },
                                    { text: "Tonic Stamina (1000 G) - Full", action: () => buyItem('tonic_stamina', 1000) },
                                    { text: "Batal", action: () => interactNPC(npc) }
                                ], npc.imgSrc);
                            }
                        },
                        {
                            text: "🍞 Beli Cemilan", action: () => {
                                showDialogue("SNACK MENU", "Cemilan ringan:", [
                                    { text: "Roti Bakar (150 G)", action: () => buyItem('gandum', 150) }, // Anggap gandum = roti
                                    { text: "Coklat (300 G)", action: () => buyItem('coklat', 300) },
                                    { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                                    { text: "Kembali", action: () => interactNPC(npc) }
                                ], npc.imgSrc);
                            }
                        },
                        {
                            text: "Kamu Lucu (Gombal)", action: () => {
                                showDialogue(npc.name, "Hihihi... Master bisa aja. \n(Dia tersenyum malu-malu)", [{ text: "Hehe", action: closeDialogue }], npc.imgSrc);
                            }
                        },
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Dah", action: closeDialogue }
                    ], npc.imgSrc);
                }

                // --- NEW: INTERAKSI GUILD MASTER (FILOSOFI & LORE) ---
                else if (npc.id === 'guild_master') {
                    const pName = DataService.user ? DataService.user.name : "Petualang";

                    showDialogue("ARYA — GUILD MASTER", `Selamat datang di sarang para pemberani, ${pName}. Pedang yang tak pernah ditempa takkan tajam. Apa yang kau cari di sini?`, [
                        {
                            text: "Tentang Pulau Arsa", action: () => {
                                showDialogue("ARYA — GUILD MASTER", "Pulau Arsa adalah kawah candradimuka. Tempat ini bukan surga, tapi neraka pelatihan. \nBanyak yang datang dengan mimpi besar, tapi pulang tanpa nama karena takut pada Dungeon. Hanya mereka yang berani berdarah yang akan diukir sejarahnya.",
                                    [{ text: "Aku siap membuktikan!", action: () => interactNPC(npc) }], npc.imgSrc);
                            }
                        },
                        {
                            text: "Nasihat Kehidupan (Zona Nyaman)", action: () => {
                                showDialogue("ARYA — GUILD MASTER", "Dengar, Nak. Kapal itu paling aman saat di pelabuhan, tapi bukan untuk itu kapal dibuat.\n\nKenyamanan adalah pembunuh impian pelan-pelan. Jika kau takut gagal, takut lelah, atau takut ditolak, kau sudah mati sebelum berperang. \nKeluar dari zona nyamanmu! Ambil risiko, lamar pekerjaan sulit, atau pelajari ilmu baru. Luka hari ini adalah medali untuk esok hari.",
                                    [{ text: "Sangat mendalam...", action: () => interactNPC(npc) }], npc.imgSrc);
                            }
                        },
                        {
                            text: "Mitos Kota Kuno", action: () => {
                                showDialogue("ARYA — GUILD MASTER", "Kau pernah mendengar legenda 'Aethelgard'? Konon, di bawah danau dekat hutan barat, terdapat reruntuhan kota kuno.\n\nMitosnya, di malam bulan darah, kau bisa melihat bayangan menara kota itu di permukaan air. Katanya, itu adalah kota para cendekiawan yang dihukum dewa karena kesombongan mereka. Hati-hati, jangan terlalu lama menatap air di malam hari.",
                                    [{ text: "Menyeramkan...", action: () => interactNPC(npc) }], npc.imgSrc);
                            }
                        },
                        {
                            text: "Dunia Luar (Pulau Lain)", action: () => {
                                showDialogue("ARYA — GUILD MASTER", "Dunia ini luas, Nak! Di seberang lautan ada 'Javanna', metropolis raksasa penuh teknologi canggih.\n\nDi utara ada 'Borneola', hutan purba tempat para Druid menjaga keseimbangan alam. Di timur ada 'Celebesia', kepulauan para pelaut tangguh.\nPulau Arsa hanyalah langkah awalmu. Jadilah yang terbaik di sini, dan tiket menuju Javanna akan menjadi milikmu.",
                                    [{ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Tujuanku Javanna!", action: () => interactNPC(npc) }], npc.imgSrc);
                            }
                        },
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Tutup", action: closeDialogue }
                    ], npc.imgSrc);
                }

                // --- FIX: GANTI IF MENJADI ELSE IF AGAR RANTAI LOGIKA TIDAK PUTUS ---
                // Sebelumnya: if (npc.id === 'trader_outside' ...) -> Ini menyebabkan kode di bawahnya (Else Generic) selalu dijalankan untuk NPC lain
                else if (npc.id === 'trader_outside' || npc.id === 'trader_wife_inside') {

                    // 1. Siapkan Menu Standar (Toko)
                    let opts = [
                        {
                            text: "🍱 Beli Sembako & Makanan", action: () => {
                                showDialogue("SEMBAKO 🛒",
                                    "Belanja kebutuhan makan sehari-hari:\n\n🍱 Nasi Bungkus — sudah matang, langsung makan\n🥚 Telur Ayam — bahan masak serba guna\n🟫 Tempe — protein murah dan bergizi\n🍞 Roti Gandum — camilan mengenyangkan",
                                    [
                                        { text: "🍱 Nasi Bungkus (300 G) — Energi +30", action: () => buyItem('nasi_bungkus', 300) },
                                        { text: "🥚 Telur Ayam (100 G) — bahan masak", action: () => buyItem('telor', 100) },
                                        { text: "🥚 Telur 6 biji (500 G) — hemat!", action: () => {
                                            if (STATE.player.money < 500) { showToast('Uang kurang!'); return; }
                                            STATE.player.money -= 500;
                                            STATE.player.inventory['telor'] = (STATE.player.inventory['telor']||0) + 6;
                                            showToast('🥚 Dapat 6 Telur Ayam! (500G)');
                                            closeDialogue();
                                        }},
                                        { text: "🟫 Tempe (150 G) — bahan masak", action: () => buyItem('tempe', 150) },
                                        { text: "🍞 Roti Gandum (200 G) — Energi +20", action: () => buyItem('gandum', 200) },
                                        { text: "🐟 Ikan Segar (150 G)", action: () => buyItem('ikan_segar', 150) },
                                        { text: "← Kembali", action: () => interactNPC(npc) }
                                    ], npc.imgSrc);
                            }
                        },
                        {
                            text: "🌱 Beli Bibit & Pupuk", action: () => {
                                showDialogue("TOKO BIBIT", "Silakan pilih bibit unggul (Panen 2-3 Hari):", [
                                    { text: "Bibit Padi (500 G) 🌾", action: () => buyItem('bibit_padi', 500) },
                                    { text: "Bibit Jagung (300 G) 🌽", action: () => buyItem('bibit_jagung', 300) },
                                    { text: "Bibit Tomat (250 G) 🍅", action: () => buyItem('bibit_tomat', 250) },
                                    { text: "Pupuk Organik (100 G) 💩", action: () => buyItem('pupuk', 100) },
                                    { text: "Kembali", action: () => interactNPC(npc) }
                                ], npc.imgSrc);
                            }
                        },
                        {
                            text: "📦 Cek Grosir Barang", action: () => {
                                closeDialogue();
                                openPasar();
                            }
                        },
                        {
                            text: "Cara Bertani", action: () => {
                                showDialogue(npc.name, "Mudah kok! Pergi ke lahan di belakang rumahmu:\n1. Gunakan Cangkul.\n2. Tanam Bibit.\n3. Siram tiap pagi.\n4. Panen dan jual!", [{ text: "Siap!", action: closeDialogue }], npc.imgSrc);
                            }
                        },
                    ];

                    // 2. INJECT LOGIKA VIRAL (Jika Ada Tren)
                    // Kita taruh tombol ini PALING ATAS (unshift)
                    if (STATE.viral.active) {
                        const trend = STATE.viral.active;
                        const buyPrice = 500;

                        opts.unshift({
                            // Gunakan class btn-viral untuk highlight merah
                            text: `🔥 STOK VIRAL: ${trend.itemName}`,
                            isViral: true,
                            action: () => {
                                const textJual = (npc.id === 'trader_outside')
                                    ? `Waduh, **${trend.itemName}** lagi dicari banget! Saya cuma punya sedikit.`
                                    : `Suami saya simpan stok **${trend.itemName}** di gudang. Mau beli berapa?`;

                                showDialogue("BARANG VIRAL", textJual, [
                                    { text: `Beli 1 (${buyPrice} G)`, action: () => buyViralItem(trend.item, buyPrice, 1) },
                                    { text: `Beli 5 (${buyPrice * 5} G)`, action: () => buyViralItem(trend.item, buyPrice, 5) },
                                    { text: "Kembali", action: () => interactNPC(npc) },
                                    { text: "Tutup", action: closeDialogue }
                                ], npc.imgSrc);
                            }
                        });
                    } else {
                        opts.push({
                            text: "Ada barang viral?",
                            action: () => showDialogue(npc.name, "Hari ini sepi, gak ada tren aneh-aneh di Sosmed.", [{ text: "Oke", action: closeDialogue }], npc.imgSrc)
                        });
                    }

                    opts.push({ text: "Tutup", action: closeDialogue });

                    // --- TENTUKAN SAPAAN (GREETING) BERDASARKAN SIAPA NPC-NYA ---
                    let greetingText = "";

                    if (npc.id === 'trader_outside') {
                        // Dialog Suami (Luar)
                        greetingText = "Selamat pagi! Saya Bu Lastri, pedagang keliling. Ada bibit, sembako, dan pupuk segar hari ini!\nLahan di belakang rumahmu sayang kalau dibiarkan kosong lho.";
                    } else {
                        // Dialog Istri (Dalam) - Ini yang Anda cari!
                        greetingText = "Sudah malam nak, Bu Lastri baru pulang keliling. Tapi masih ada stok di gudang kalau kamu butuh sesuatu!";
                    }

                    // Tampilkan Dialog Utama dengan Sapaan yang Benar
                    showDialogue(npc.name, greetingText, opts, npc.imgSrc);
                }

                // --- FIX: INTERAKSI ANAK KECIL (BOCAH & GADIS) ---
                // Menangani NPC dengan ID berawalan 'child_' (kecuali child_blacksmith yang sudah dihandle di atas)
                else if (npc.id.startsWith('child_')) {
                    let dialogText = "";
                    let childOpts = [];

                    // 1. BOCAH LAKI-LAKI (NAKAL/AKTIF)
                    if (npc.id.includes('boy')) {
                        const boyTalks = [
                            "Woi! Awas, aku lagi jadi Pesawat Jet! Ngenggg! ✈️",
                            "Kak, pernah liat hantu di Dungeon nggak? Katanya serem lho...",
                            "Cita-citaku mau jadi Guild Master terkuat se-Nusantara!",
                            "Sst... jangan bilang ibuku aku main di pinggir laut ya.",
                            "Aku nemu kerang bagus tadi, tapi capitnya sakit! Aww!"
                        ];
                        dialogText = boyTalks[Math.floor(Math.random() * boyTalks.length)];

                        childOpts = [
                            {
                                text: "🏃 Ajak Main Kejar-kejaran (Energi -5)", action: () => {
                                    if (STATE.player.energy >= 5) {
                                        STATE.player.energy -= 5;
                                        showToast("Hosh... Hosh... Kamu lelah tapi senang!");

                                        // Efek Visual
                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                        createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#fff');

                                        showDialogue(npc.name, "Hahaha! Kakak lambat banget! Wleee! 😝\n(Bocah itu berlari kegirangan)", [{ text: "Awas ya nanti!", action: closeDialogue }], npc.imgSrc);
                                    } else showToast("Kamu terlalu lelah untuk lari.");
                                }
                            },
                            {
                                text: "Nasehati", action: () => {
                                    showDialogue(npc.name, "Iya iya bawel... mirip bapakku aja. 🙄", [{ text: "Hhh..", action: closeDialogue }], npc.imgSrc);
                                }
                            },
                            { text: "Dah", action: closeDialogue }
                        ];
                    }
                    // 2. GADIS KECIL (MANIS/POLOS)
                    else {
                        const girlTalks = [
                            "Kakak, liat deh pita rambutku. Bagus nggak?",
                            "Aku suka bunga. Baunya harum sekali~ 🌸",
                            "Kalau besar nanti aku mau jadi Dokter seperti Dokter Budi!",
                            "Bonekaku ketinggalan di rumah... sedih deh.",
                            "Langitnya biru ya... seperti warna bajumu."
                        ];
                        dialogText = girlTalks[Math.floor(Math.random() * girlTalks.length)];

                        childOpts = [
                            {
                                text: "🥰 Puji Dia", action: () => {
                                    // Tambah sedikit mood/partikel
                                    createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#f472b6');
                                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                                    showDialogue(npc.name, "Hihihi, makasih Kakak! Kakak baik deh. ❤️", [{ text: "Sama-sama", action: closeDialogue }], npc.imgSrc);
                                }
                            },
                            { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        {
                                text: "🍫 Kasih Coklat (Dari Tas)", action: () => {
                                    if ((STATE.player.inventory['coklat'] || 0) > 0) {
                                        STATE.player.inventory['coklat']--;
                                        if (STATE.player.inventory['coklat'] <= 0) delete STATE.player.inventory['coklat'];

                                        showToast("Memberi Coklat (-1)");
                                        createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#fbbf24');
                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                                        showDialogue(npc.name, "Wahhh! Coklat! Nyam nyam... Enak banget! Makasih Kakak! \n(Dia terlihat sangat bahagia)", [{ text: "Senangnya", action: closeDialogue }], npc.imgSrc);
                                    } else {
                                        showToast("Kamu tidak punya Coklat di tas.");
                                    }
                                }
                            },
                            { text: "Dah", action: closeDialogue }
                        ];
                    }

                    showDialogue(npc.name, dialogText, childOpts, npc.imgSrc);
                }

                // --- FIX: MENGEMBALIKAN INTERAKSI AISYAH & MARIA (TOLERANSI) ---
                else if (npc.id === 'cewek_islam' || npc.id === 'cewek_kristen') {
                    const chats = NPC_RELIGIOUS_CHATS[npc.id];
                    let chatText = "Damai sejahtera untukmu.";

                    if (chats && chats.length > 0) {
                        chatText = chats[Math.floor(Math.random() * chats.length)];
                    }

                    // Efek Visual Damai (Biru Muda/Putih)
                    createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#e0f2fe');

                    showDialogue(npc.name, chatText, [
                        {
                            text: "Indahnya Toleransi 🤝", action: () => {
                                // Sedikit reward moral/reputasi (Peluang 50%)
                                if (Math.random() < 0.5) {
                                    STATE.player.reputation += 1;
                                    showToast("Hati menjadi tenang (+1 Reputasi)");
                                }
                                closeDialogue();
                            }
                        },
                        { text: "Terima kasih nasihatnya", action: closeDialogue }
                    ], npc.imgSrc);
                }

                // --- FIX: INTERAKSI SATPAM & NPC UNIK LAINNYA (YANG SEMPAT HILANG) ---

                // 1. SATPAM KAMPUS
                else if (npc.id === 'satpam') {
                    const isNight = STATE.time >= 1800 || STATE.time < 600;
                    if (isNight) {
                        showDialogue(npc.name, "Malam-malam begini masih keluyuran, Nak? \nAngin malam di sini jahat, tapi tidak sejahat putus cinta. Hahaha.\n\n(Satpam terlihat santai sambil menyeruput kopi panas)", [
                            {text: "Bapak belum tidur?", action: () => {
                                showDialogue(npc.name, "Mata ini sudah terlatih terjaga, Nak. \nDulu waktu Bapak seusiamu, Bapak kerja serabutan pagi-siang-malam demi biayai adik-adik sekolah. \n\nLelah? Pasti. Tapi saat melihat mereka jadi sarjana, hilang semua capeknya. Perjuangan itu manis di akhir.", [{text:"Bapak hebat sekali...", action:closeDialogue}], npc.imgSrc);
                            }},
                            {text: "Sedang apa Pak?", action: () => {
                                showDialogue(npc.name, "Biasalah, ngopi sambil dengerin suara jangkrik. Kadang sepi itu menenangkan. \n\nKamu kalau pusing tugas kuliah, istirahatlah sebentar di sini. Dunia gak akan kiamat kok kalau kamu tarik napas sejenak.", [{text:"Terima kasih Pak", action:closeDialogue}], npc.imgSrc);
                            }},
                            {text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                            {text: "Saya cuma lewat", action: closeDialogue}
                        ], npc.imgSrc);
                    } else {
                        showDialogue(npc.name, "STOP! Tunjukkan kartu mahasiswa. \nTugas saya menjaga keamanan kampus dari mahasiswa abadi dan monster liar.", [
                            {text: "Siap Pak (Hormat)", action: () => {
                                showToast("Satpam mengangguk tegas.");
                                closeDialogue();
                            }},
                            {text: "Tanya Aturan Masuk", action: () => {
                                showDialogue(npc.name, "Dengar baik-baik! \n1. Kuliah mulai jam 08:00. \n2. Telat lewat 08:30, gerbang saya kunci! \n3. Dilarang bawa senjata tajam ke dalam kelas, kecuali jurusan Fighter.", [{text:"Siap Pak", action:closeDialogue}], npc.imgSrc);
                            }},
                            {text: "Saya cuma lewat", action: closeDialogue}
                        ], npc.imgSrc);
                    }
                }

                // 2. SENIOR KAIA — Dialog 3 Fase berdasarkan Relationship
                else if (npc.id === 'senior_kaia') {
                    const pRel = STATE.player.relationships[npc.id] || 0;

                    // FASE 1: ANAK BARU (Relationship 0-20) - Pengenalan & Culture Shock
                    if (pRel < 20) {
                        showDialogue(npc.name, "Hai, kamu anak baru itu kan? Kelihatan banget dari cara jalanmu yang masih bingung. \nSini duduk, jangan tegang gitu. Adaptasi di Pulau Arsa itu emang *tricky*.", [
                            {text: "Warga sini kok dingin ya?", action: () => {
                                showDialogue(npc.name, "Nah, itu dia! Warga sini punya **'Trust Issue'**. \nSecara psikologis, mereka gak benci kamu, mereka cuma *defensive*. \n\nTips pertama: **Jangan Baper**. Tetap sapa mereka walau dicuekin. Itu namanya *Exposure Effect*. Makin sering mereka liat mukamu, makin luluh tembok mereka.",
                                [{text: "Ooh gitu... makasih Kak!", action: () => {
                                    updateRelationship(npc, 5, "Mentor");
                                    closeDialogue();
                                }}], npc.imgSrc);
                            }},
                            {text: "Cara biar cepat akrab?", action: () => {
                                showDialogue(npc.name, "Rumus sosial di sini simpel: **Sapa + Bantu + Hadiah**. \nJangan cuma lewat doang. Interaksi itu mata uang sosial. \n\nCoba deh mulai dari hal kecil kayak ngasih Bunga liar ke NPC yang kamu suka. Itu *gesture* kecil tapi *impact*-nya gede.",
                                [{text: "Siap dicoba!", action: closeDialogue}], npc.imgSrc);
                            }},
                            {text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc)},
                            {text: "Dah Kak", action: closeDialogue}
                        ], npc.imgSrc);
                    }

                    // FASE 2: MULAI BERGAUL (Relationship 20-60) - Tips Spesifik & Love Language
                    else if (pRel < 60) {
                        showDialogue(npc.name, "Hei! Kulihat kamu mulai luwes ya keliling desa. Gimana progresnya?", [
                            {text: "Ada yang suka, ada yang enggak...", action: () => {
                                showDialogue(npc.name, "Wajar! Tiap orang punya **'Bahasa Cinta'** beda-beda. \n\nContoh: Si Matre itu tipe *Receiving Gifts* (harus barang mahal). Tapi kalau Pak Nelayan atau Satria, mereka tipe *Acts of Service* (suka kalau kamu rajin kerja/kuat). \n\nKenali pola mereka, jangan pukul rata semua dikasih barang sama.",
                                [{text: "Wah, analisis mantap!", action: () => {
                                    updateRelationship(npc, 2, "Mentor");
                                    closeDialogue();
                                }}], npc.imgSrc);
                            }},
                            {text: "Aku capek basa-basi...", action: () => {
                                showDialogue(npc.name, "Itu namanya *Social Fatigue*. Istirahat dulu gih di kasur. \nIngat, energi kamu (Energy Bar) itu terbatas. \nJangan paksain *People Pleasing* ke semua orang dalam satu hari. Fokus ke 1-2 orang dulu aja.",
                                [{text: "Bener juga...", action: closeDialogue}], npc.imgSrc);
                            }},
                            {text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc)},
                            {text: "Kembali", action: closeDialogue}
                        ], npc.imgSrc);
                    }

                    // FASE 3: DITERIMA MASYARAKAT (Relationship >= 60) - Analisis Perubahan & Validasi
                    else {
                        showDialogue(npc.name, `Wah, aura kamu beda banget sekarang! Lebih percaya diri. \nKamu sadar gak sih perubahan sikap warga ke kamu?`, [
                            {text: "Mereka jadi lebih ramah...", action: () => {
                                showDialogue(npc.name, "Itu fase **'Social Acceptance'**. \nDulu mereka liat kamu sebagai *Outsider* (Orang Asing), sekarang kamu udah jadi *Insider* (Keluarga). \n\nLiat deh, mata mereka kalau ngomong sekarang natap kamu, bukan buang muka. Senyum mereka tulus, bukan sopan santun doang. \nSelamat ya, kamu berhasil menaklukkan hati Pulau Arsa! ❤️",
                                [{text: "Berkat tips Kakak juga!", action: () => {
                                    updateRelationship(npc, 2, "Bestie");
                                    createParticle(npc.x*TILE_SIZE, npc.y*TILE_SIZE, '#fbbf24');
                                    closeDialogue();
                                }}], npc.imgSrc);
                            }},
                            {text: "Tips terakhir dong Kak", action: () => {
                                showDialogue(npc.name, "Sekarang, tinggal maintain aja. Hubungan itu kayak tanaman, harus disiram terus. \n\nOiya, hati-hati sama **Toxic Relationship**. Kalau ada NPC yang cuma manfaatin duit kamu (ehem... si Matre), mending *Cut Off* aja. Kesehatan mentalmu lebih penting!",
                                [{text: "Siap laksanakan!", action: closeDialogue}], npc.imgSrc);
                            }},
                            {text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc)},
                            {text: "Sampai ketemu lagi!", action: closeDialogue}
                        ], npc.imgSrc);
                    }
                }

                // 3. SARJANA (TIPS KULIAH)
                else if (npc.id === 'sarjana_tekno') {
                    showDialogue(npc.name, "Jurusan Teknologi itu masa depan! 💻\nFokus naikkan INT untuk coding. Kalau lulus, gajinya besar lho.", [{ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Wah menarik", action: closeDialogue }], npc.imgSrc);
                }
                else if (npc.id === 'sarjana_sejarah') {
                    // ── FOLKTALE TRACKER ──
                    const sudahDengarLamongan = STATE.player.folktale_lamongan || false;
                    const opsiSejarah = sudahDengarLamongan
                        ? { text: "📜 Asal-Usul Nama Lamongan (✔ Sudah didengar)", action: () => {
                            showDialogue("BU WULAN — SEJARAH",
                                "Masih ingat? Bagus sekali!\n\n\"Lamongan berasal dari nama seorang tokoh bernama Mbah Lamong — seorang ulama dan pemimpin bijak yang membuka wilayah ini. Namanya diabadikan menjadi nama daerah sebagai penghormatan atas jasanya.\"\n\nIni contoh nyata bahwa sejarah lokal sangat kaya. Rajin ke perpustakaan ya!",
                                [{ text: "Siap Bu Wulan!", action: () => interactNPC(npc) }], npc.imgSrc);
                          }}
                        : { text: "📜 Ceritakan asal-usul nama Lamongan!", action: () => {
                            STATE.player.folktale_lamongan = true;
                            STATE.player.int = (STATE.player.int || 0) + 2;
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            showToast("📖 Sejarah Lamongan dipelajari! INT +2");
                            showDialogue("BU WULAN — SEJARAH",
                                "Wah, kamu mau belajar sejarah lokal? Senangnya!\n\n📜 ASAL-USUL NAMA LAMONGAN\n\n\"Menurut catatan sejarah, nama Lamongan berasal dari tokoh bernama Mbah Lamong — seorang pemimpin dan ulama yang dihormati. Beliau dikenal karena mendirikan pemerintahan yang adil dan hidup berdampingan dengan seluruh lapisan masyarakat.\"\n\n\"Kata 'Lamongan' dipercaya merupakan bentuk penghormatan rakyat atas jasa-jasanya. Hingga kini, makam Mbah Lamong masih ada dan sering diziarahi warga sebagai bentuk mengenang sejarah.\"\n\n🏛️ Nilai yang bisa kita pelajari: nama sebuah tempat sering menyimpan cerita besar tentang orang-orang baik di dalamnya.\n\nINT +2 — Pengetahuan sejarahmu bertambah!",
                                [{ text: "Terima kasih ilmunya, Bu Wulan!", action: () => interactNPC(npc) }], npc.imgSrc);
                          }};
                    showDialogue(npc.name, "Sejarah mengajarkan kebijaksanaan. 📜\nBanyak rahasia pulau ini yang tertulis di prasasti kuno.\n\n📍 Aku biasa berkeliling di area **Timur Laut Desa** — dekat reruntuhan kuno. Cari aku di sana saat siang hari ya!\n\nAku punya cerita tentang asal-usul nama daerah ini, lho. Mau dengar?", [
                        opsiSejarah,
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Siap Bu Wulan!", action: closeDialogue }
                    ], npc.imgSrc);
                }

                // ═══════════════════════════════════════════════════════════════
                // 📜 KI LAMONG — PENUTUR CERITA RAKYAT LAMONGAN
                // NPC khusus: duduk di dekat Candi Kuno, bisa ditemui kapan saja
                // Menyimpan 4 cerita rakyat Lamongan yang bisa dibuka satu per satu
                // ═══════════════════════════════════════════════════════════════
                else if (npc.id === 'ki_lamong') {
                    const p = STATE.player;

                    // Tracker cerita
                    const c1 = p.kilamong_c1 || false;
                    const c2 = p.kilamong_c2 || false;
                    const c3 = p.kilamong_c3 || false;
                    const c4 = p.kilamong_c4 || false;

                    const totalDibuka = [c1,c2,c3,c4].filter(Boolean).length;
                    const semuaSelesai = totalDibuka === 4;

                    // Status reward item
                    const sudahKlaimGulungan = !!(p.inventory && (p.inventory['gulungan_mbahlamong'] || p.gulunganDibaca));
                    const sudahKlaimKalung   = !!(p.inventory && p.inventory['kalung_nelayan']);
                    const sudahKlaimKeris    = !!(p.inventory && p.inventory['keris_penjaga']);

                    // Helper klaim reward item
                    function klaimRewardKiLamong(itemId, namaItem, ikon, teksReward, onDone) {
                        addItem(itemId, 1);
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        createParticle(p.x, p.y, '#fbbf24');
                        showToast('🎁 ' + namaItem + ' diterima!');
                        showDialogue("KI LAMONG — PENUTUR CERITA",
                            ikon + " REWARD DITERIMA: " + namaItem.toUpperCase() + "\n\n" + teksReward,
                            [{ text: "Terima kasih, Ki Lamong! 🙏", action: () => onDone() }], npc.imgSrc);
                    }

                    // Salam pembuka dinamis
                    let salamKiLamong = "Nak, duduklah sebentar di sini.\n\nAku Ki Lamong, penjaga cerita tanah leluhur ini. 🌿\n\nSetiap tanah punya cerita. Lamongan menyimpan kisah yang tak ternilai — tentang orang-orang bijak, nelayan pemberani, dan tradisi yang menjaga kita tetap manusia.\n\nMau dengar cerita mana?";
                    if (semuaSelesai && sudahKlaimKeris) salamKiLamong = "Selamat datang kembali, Penjaga Cerita! 🏅\n\nSemua kisah leluhur sudah ada di dalam hatimu. Teruslah hidup dengan nilai-nilai itu.\n\nAku bangga padamu, Nak.";
                    else if (semuaSelesai) salamKiLamong = "Selamat! Kamu sudah mendengar semua kisah leluhur Lamongan. 🏅\n\nKamu layak menerima pusaka terakhir — Keris Penjaga Cerita.\n\nAmbillah, dan jaga nilai-nilai leluhur ini seumur hidupmu.";
                    else if (totalDibuka > 0) salamKiLamong = `Ah, kamu kembali! Bagus. Anak yang haus ilmu selalu mendapat lebih.\n\n${totalDibuka}/4 kisah sudah kamu pelajari. Masih ada ${4-totalDibuka} cerita yang menunggumu. 📜`;

                    // ── HELPER: tampilkan cerita lengkap ──
                    // ── QUIZ REFLEKSI setelah tiap cerita (Breath of Fire style "lesson check") ──
                    function quizRefleksi(judul, pertanyaan, pilihanBenar, pilihanSalah1, pilihanSalah2, onBenar, onSalah) {
                        const opts = [
                            { text: pilihanBenar, action: () => {
                                STATE.player.int = (STATE.player.int||0)+2;
                                showToast("Jawaban tepat! INT +2 (Kamu benar-benar menyerap pelajarannya!)");
                                showDialogue("KI LAMONG — TEPAT!", "Bagus sekali!\n\nJawaban itu menunjukkan kamu benar-benar mendengarkan — bukan sekadar mendengar.\n\nItu yang membedakan orang bijak dari yang lain.", [{text:"Terima kasih, Ki.", action: onBenar}], npc.imgSrc);
                            }},
                            { text: pilihanSalah1, action: () => {
                                showDialogue("KI LAMONG", "Hmm... mungkin ada yang terlewat.\n\nCoba renungkan lagi cerita tadi. Inti dari semua kisah leluhur adalah keseimbangan — antara diri, alam, dan sesama.", [{text:"Aku mengerti sekarang.", action: onSalah}], npc.imgSrc);
                            }},
                            { text: pilihanSalah2, action: () => {
                                showDialogue("KI LAMONG", "Belum tepat, tapi tidak apa-apa.\n\nKisah leluhur memang butuh waktu untuk benar-benar meresap. Yang penting kamu tidak berhenti merenungkannya.", [{text:"Baik, Ki.", action: onSalah}], npc.imgSrc);
                            }}
                        ];
                        // Acak urutan pilihan
                        const shuffled = opts.sort(() => Math.random() - 0.5);
                        showDialogue("KI LAMONG — REFLEKSI: " + judul, pertanyaan, shuffled, npc.imgSrc);
                    }

                    function bacaCeritaKiLamong(judul, isi, rewardText, onDone) {
                        showDialogue("KI LAMONG — PENUTUR CERITA", judul + "\n\n" + isi + "\n\n" + rewardText,
                            [{ text: "Terima kasih, Ki Lamong. Aku renungkan.", action: () => onDone() }], npc.imgSrc);
                    }

                    // ── OPSI CERITA (kondisional) ──
                    const opsiCerita = [];

                    // CERITA 1: Asal-Usul Mbah Lamong
                    if (!c1) {
                        opsiCerita.push({ text: "📜 [BARU] Siapa itu Mbah Lamong?", action: () => {
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            bacaCeritaKiLamong(
                                "📜 KISAH MBAH LAMONG — SANG PENDIRI",
                                "\"Dahulu, sebelum ada nama Lamongan, ada seorang ulama bernama Mbah Lamong. Beliau datang dari kejauhan membawa ilmu, keadilan, dan kebijaksanaan.\n\nDi tanah subur ini, beliau membangun komunitas kecil. Tidak dengan kekerasan — tapi dengan teladan. Saat warga bertengkar, beliau hadir sebagai penengah. Saat gagal panen, beliau berbagi dari simpanannya sendiri.\n\nRakyat yang mencintainya menyebut tanah ini dengan namanya: La-mo-ngan.\"\n\n🏛️ Pesan: Nama yang baik dikenang bukan dari harta, tapi dari kebaikan.",
                                "Renungkan dulu, lalu Ki Lamong akan bertanya padamu...",
                                () => quizRefleksi("MBAH LAMONG",
                                    "Apa pelajaran utama dari kisah Mbah Lamong?",
                                    "Pemimpin sejati dikenang karena teladan & kebaikannya, bukan kekuasaannya",
                                    "Pemimpin harus kaya agar bisa memberi",
                                    "Nama yang terkenal adalah tanda kesuksesan",
                                    () => { p.kilamong_c1 = true; p.int = (p.int||0)+3; showToast("Kisah Mbah Lamong! INT +3 (Jawaban Tepat!)"); interactNPC(npc); },
                                    () => { p.kilamong_c1 = true; p.int = (p.int||0)+1; showToast("Kisah dipelajari! INT +1"); interactNPC(npc); }
                                )
                            );
                        }});
                    } else {
                        opsiCerita.push({ text: "📜 ✔ Mbah Lamong (Ulang)", action: () => bacaCeritaKiLamong("KISAH MBAH LAMONG (Ringkasan)", "\"Lamongan dinamai Mbah Lamong — ulama yang memimpin dengan teladan, bukan kekuasaan.\"", "", () => interactNPC(npc)) });
                    }

                    // CERITA 2: Legenda Nelayan Brondong
                    if (!c2) {
                        opsiCerita.push({ text: "📜 [BARU] Legenda Nelayan Brondong", action: () => {
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            bacaCeritaKiLamong(
                                "🌊 LEGENDA NELAYAN BRONDONG",
                                "\"Di pesisir utara, ada desa nelayan bernama Brondong. Leluhur mereka punya perjanjian tak tertulis dengan laut.\n\nMereka tidak melaut di malam tertentu — bukan karena takut, tapi karena menghormati bahwa laut butuh istirahat dan ikan butuh berkembang biak.\n\nKearifan ini terbukti: generasi demi generasi, nelayan Brondong tidak pernah kehabisan ikan. Laut yang dihormati, memberi kembali berlipat-lipat.\"\n\n🐟 Konsep ini mirip rotasi panen modern. Leluhur kita sudah tahu jauh sebelum sains merumuskannya.",
                                "Renungkan dulu sebelum menjawab...",
                                () => quizRefleksi("NELAYAN BRONDONG",
                                    "Mengapa nelayan Brondong tidak pernah kehabisan ikan turun-temurun?",
                                    "Mereka menghormati alam — tidak menguras lebih dari yang dibutuhkan",
                                    "Mereka punya alat tangkap yang lebih canggih",
                                    "Laut di Brondong memang lebih banyak ikannya",
                                    () => { p.kilamong_c2 = true; p.reputation = (p.reputation||0)+5; showToast("Legenda Brondong! REP +5 (Jawaban Tepat!)"); interactNPC(npc); },
                                    () => { p.kilamong_c2 = true; p.reputation = (p.reputation||0)+2; showToast("Kisah dipelajari! REP +2"); interactNPC(npc); }
                                )
                            );
                        }});
                    } else {
                        opsiCerita.push({ text: "📜 ✔ Nelayan Brondong (Ulang)", action: () => bacaCeritaKiLamong("LEGENDA BRONDONG (Ringkasan)", "\"Nelayan Brondong menghormati laut — tidak serakah. Hasilnya berlimpah turun-temurun.\"", "", () => interactNPC(npc)) });
                    }

                    // CERITA 3: Joko Tingkir
                    if (!c3) {
                        opsiCerita.push({ text: "📜 [BARU] Perjalanan Joko Tingkir", action: () => {
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            bacaCeritaKiLamong(
                                "👑 KISAH JOKO TINGKIR — PEMUDA YANG BANGKIT",
                                "\"Joko Tingkir adalah pemuda dari keluarga sederhana yang pernah diasingkan karena dianggap berbahaya.\n\nNamun alih-alih menyerah, ia belajar, berlatih, dan membuktikan diri. Ia melewati ujian berat — termasuk melewati sungai penuh buaya dengan kekuatan dan keberaniannya.\n\nIa akhirnya menjadi Sultan Hadiwijaya — pemimpin Kerajaan Pajang yang dihormati karena kebijaksanaan dan kerendahan hatinya.\"\n\n💡 Pesan: Diasingkan bukan akhir — bisa jadi awal dari versi terbaik dirimu.",
                                "Renungkan dulu...",
                                () => quizRefleksi("JOKO TINGKIR",
                                    "Apa yang membuat Joko Tingkir akhirnya menjadi pemimpin besar?",
                                    "Ia tidak menyerah meski diasingkan — terus belajar dan membuktikan diri",
                                    "Ia berasal dari keturunan bangsawan tersembunyi",
                                    "Ia mengalahkan musuhnya dengan kekuatan fisik semata",
                                    () => { p.kilamong_c3 = true; p.str = (p.str||0)+2; p.int = (p.int||0)+2; showToast("Kisah Joko Tingkir! STR+2, INT+2 (Tepat!)"); interactNPC(npc); },
                                    () => { p.kilamong_c3 = true; p.str = (p.str||0)+1; showToast("Kisah dipelajari! STR+1"); interactNPC(npc); }
                                )
                            );
                        }});
                    } else {
                        opsiCerita.push({ text: "📜 ✔ Joko Tingkir (Ulang)", action: () => bacaCeritaKiLamong("JOKO TINGKIR (Ringkasan)", "\"Dari diasingkan hingga jadi Sultan — ketekunan dan keberanian mengalahkan segalanya.\"", "", () => interactNPC(npc)) });
                    }

                    // CERITA 4: Tradisi Kupatan
                    if (!c4) {
                        opsiCerita.push({ text: "📜 [BARU] Makna Tradisi Kupatan", action: () => {
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            bacaCeritaKiLamong(
                                "🎋 TRADISI KUPATAN LAMONGAN",
                                "\"Sepekan setelah Idul Fitri, seluruh Lamongan merayakan Kupatan. Setiap rumah membuat ketupat dari anyaman janur kuning.\n\nMakna anyamannya? Rumit dan saling terkait — seperti kesalahan kita. Tapi saat dimasak bersama dan dimakan bersama tetangga, semua kesulitan itu luruh.\n\nKupatan bukan sekadar makanan. Ia adalah cara leluhur mengajarkan bahwa manusia butuh saling memaafkan secara nyata — bukan hanya di dalam hati.\"\n\n🌸 Nilai: Komunal, memaafkan, kebersamaan adalah pondasi masyarakat Lamongan.",
                                "Renungkan maknanya...",
                                () => quizRefleksi("TRADISI KUPATAN",
                                    "Apa makna terdalam dari anyaman ketupat dalam tradisi Kupatan?",
                                    "Kesalahan-kesalahan kita yang saling terkait, luruh saat kita memaafkan bersama",
                                    "Keahlian tangan pengrajin bambu Lamongan yang turun-temurun",
                                    "Simbol kemakmuran panen di musim Idul Fitri",
                                    () => {
                                        p.kilamong_c4 = true;
                                        p.happiness = Math.min(100,(p.happiness||50)+10);
                                        p.ethics = (p.ethics||0)+5;
                                        showToast("Tradisi Kupatan! Happiness +10, Ethics +5 (Tepat!)");
                                        if (p.kilamong_c1 && p.kilamong_c2 && p.kilamong_c3) {
                                            setTimeout(() => {
                                                p.reputation = (p.reputation||0)+10;
                                                showToast("SEMUA KISAH LAMONGAN DIPELAJARI! REP +10 BONUS!");
                                                showDialogue("KI LAMONG — HARU",
                                                    "...Kamu sudah mendengar semuanya.\n\nDan lebih dari itu — kamu merenungkan setiap pelajarannya. Kamu menjawab dengan hati, bukan sekadar hafalan.\n\nSemua kisah leluhur Lamongan:\n✅ Kisah Mbah Lamong\n✅ Legenda Nelayan Brondong\n✅ Perjalanan Joko Tingkir\n✅ Tradisi Kupatan\n\n\"Kini kamu bukan sekadar perantau — kamu sudah punya akar.\"\n\n🏅 Gelar 'Penjaga Cerita Lamongan' diraih! REP +10",
                                                    [{text:"Terima kasih, Ki Lamong! 🙏", action: () => interactNPC(npc)}], npc.imgSrc);
                                            }, 400);
                                        } else { interactNPC(npc); }
                                    },
                                    () => { p.kilamong_c4 = true; p.happiness = Math.min(100,(p.happiness||50)+5); showToast("Tradisi Kupatan dipelajari! Happiness +5"); interactNPC(npc); }
                                )
                            );
                        }});
                    } else {
                        opsiCerita.push({ text: "📜 ✔ Tradisi Kupatan (Ulang)", action: () => bacaCeritaKiLamong("KUPATAN (Ringkasan)", "\"Ketupat yang rumit = kesalahan kita. Dimakan bersama = saling memaafkan secara nyata.\"", "", () => interactNPC(npc)) });
                    }

                    // ── OPSI REWARD ITEM ──

                    // Reward Cerita 1: Gulungan Mbah Lamong
                    if (c1 && !sudahKlaimGulungan) {
                        opsiCerita.push({ text: "🎁 [REWARD] Ambil Gulungan Mbah Lamong!", action: () => {
                            klaimRewardKiLamong('gulungan_mbahlamong', 'Gulungan Mbah Lamong', '📜',
                                "Tulisan tangan Mbah Lamong sendiri.\n\nEfek: Dibaca dari Inventaris → INT +5 permanen.",
                                () => interactNPC(npc));
                        }});
                    }

                    // Reward Cerita 2: Kalung Nelayan
                    if (c2 && !sudahKlaimKalung) {
                        opsiCerita.push({ text: "🎁 [REWARD] Ambil Kalung Nelayan Brondong!", action: () => {
                            klaimRewardKiLamong('kalung_nelayan', 'Kalung Nelayan Brondong', '🪬',
                                "Kalung nelayan turun-temurun.\n\nPasif: Chance ikan langka saat memancing +10%.",
                                () => interactNPC(npc));
                        }});
                    }

                                        // Reward Semua Cerita: Keris Penjaga (setelah semua 4 selesai)
                    if (semuaSelesai && !sudahKlaimKeris) {
                        opsiCerita.push({ text: "⚔️ [REWARD UTAMA] Terima Keris Penjaga Cerita!", action: () => {
                            // CUTSCENE DRAMATIK — Ki Lamong menyerahkan Keris
                            showDialogue("KI LAMONG — SAAT BERSEJARAH",
                                "...Sudah lama aku menunggu momen ini.\n\nAku sudah menjaga keris ini selama 40 tahun. Berharap suatu hari ada yang datang — yang benar-benar mengerti, bukan sekadar mendengar.\n\nDan hari ini... kamu ada di sini.\n\nBerdirilah. Angkat tanganmu.",
                                [{ text: "(Aku berdiri, mengangkat tangan...)", action: () => {
                                    createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#fbbf24');
                                    createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#f59e0b');
                                    setTimeout(() => {
                                        showDialogue("KI LAMONG — PENYERAHAN KERIS",
                                            "Ki Lamong berdiri perlahan. Ia membuka kain pembungkus tua dari balik jubahnya.\n\nDi dalamnya — sebilah keris berkilauan dengan pamor emas dan perak yang bergerak seperti hidup.\n\n\"Ini Keris Penjaga Cerita. Ia tidak memiliki kekuatan untuk membunuh — kekuatannya adalah untuk menjaga. Menjaga kebijaksanaan agar tidak hilang ditelan zaman.\"\n\n\"Kamu layak memilikinya.\"",
                                            [{ text: "(Aku menerima keris itu dengan kedua tangan...)", action: () => {
                                                for(let i=0;i<6;i++) setTimeout(()=>createParticle(npc.x*TILE_SIZE+Math.random()*80-40, npc.y*TILE_SIZE+Math.random()*80-40, i%2===0?'#fbbf24':'#fff'), i*150);
                                                setTimeout(() => {
                                                    klaimRewardKiLamong('keris_penjaga', 'Keris Penjaga Cerita', '⚔️',
                                                        "Keris pusaka Ki Lamong — diberikan hanya kepada Penjaga Cerita sejati.\n\nPasif aktif selamanya:\n⚔️ STR +5 | INT +5 | SPD +5 | BIZ +5\n\nDan lebih dari itu — keris ini adalah kunci menuju sesuatu yang lebih besar...",
                                                        () => {
                                                            applyFolktalePassives();
                                                            setTimeout(() => {
                                                                showDialogue("KI LAMONG — PESAN TERAKHIR",
                                                                    "Sekarang... pergilah ke Candi Kuno.\n\nAda retakan di sisi utara candi — itu pintu menuju Kahyangan Wilis yang lama tertutup.\n\nKeris itu akan membantumu. Tapi keris saja tidak cukup — kamu butuh sesuatu dari alam dan sesuatu dari jiwa.\n\nBicaralah dengan Dewi Roro tentang Rafflesia. Bicaralah dengan Dewi Arsa tentang kebijaksanaan.\n\nDan ketika ketiganya bersatu... retakan itu akan terbuka.",
                                                                    [{text:"Aku mengerti. Terima kasih, Ki Lamong. 🙏", action: closeDialogue}], npc.imgSrc);
                                                            }, 500);
                                                        }
                                                    );
                                                }, 900);
                                            }}], npc.imgSrc);
                                    }, 1200);
                                }}], npc.imgSrc);
                        }});
                    }

                    // Tombol tutup di akhir
                    opsiCerita.push({ text: "Terima kasih, Ki Lamong.", action: closeDialogue });

                    showDialogue("KI LAMONG — PENUTUR CERITA", salamKiLamong, opsiCerita, npc.imgSrc);
                }

                // 3. NELAYAN & PEMANCING & DUYUNG
                else if (npc.id === 'nelayan') {
                    // ── FOLKTALE TRACKER ──
                    const sudahDengarBrondong = STATE.player.folktale_brondong || false;
                    const opsiCerita = sudahDengarBrondong
                        ? { text: "📜 Kisah Nelayan Brondong (✔ Sudah didengar)", action: () => {
                            showDialogue("PAK SURYO — NELAYAN",
                                "Kamu masih ingat ceritanya, nak? Bagus!\n\n\"Konon, para leluhur nelayan Brondong tidak pernah melaut di malam Jumat Legi. Mereka percaya laut punya penguasa yang dihormati — bukan dengan takut, tapi dengan menjaga alam dan tidak serakah.\"\n\nItu sebabnya sampai hari ini, nelayan Lamongan terkenal bijak dalam menangkap ikan — tidak pernah menguras lebih dari yang dibutuhkan.",
                                [{ text: "Terima kasih Pak Suryo", action: () => interactNPC(npc) }], npc.imgSrc);
                          }}
                        : { text: "📜 Ceritakan kisah leluhur nelayan sini!", action: () => {
                            STATE.player.folktale_brondong = true;
                            STATE.player.reputation = (STATE.player.reputation || 0) + 3;
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            showToast("📖 Kisah Brondong dipelajari! REP +3");
                            showDialogue("PAK SURYO — NELAYAN",
                                "Ho ho... kamu mau dengar cerita leluhur? Duduklah sebentar.\n\n📜 LEGENDA NELAYAN BRONDONG\n\n\"Dahulu kala, Desa Brondong adalah tempat di mana para nelayan hidup berdamai dengan laut. Ada seorang nelayan tua bernama Ki Suryo yang bisa berbicara dengan angin. Setiap kali badai akan datang, Ki Suryo memukul kentongan sebanyak tiga kali — pertanda bagi seluruh kampung untuk tidak melaut.\"\n\n\"Karena kebijaksanaannya, tidak ada satu pun kapal dari Brondong yang pernah tenggelam di zamannya. Itulah warisan yang kami jaga hingga kini — laut bukan ditaklukkan, tapi dihormati.\"\n\n🌊 REP +3 — Kamu belajar nilai kearifan lokal nelayan Lamongan!",
                                [{ text: "Luar biasa kisahnya, Pak!", action: () => interactNPC(npc) }], npc.imgSrc);
                          }};
                    showDialogue(npc.name, "Ombak hari ini tenang. Ikan-ikan sedang lapar.\nKalau mau mancing, beli pancingan dulu atau pakai punyaku di ujung dermaga.\n\nOh ya, kamu mau dengar cerita tentang leluhur nelayan di sini tidak?", [
                        opsiCerita,
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Oke Pak, makasih", action: closeDialogue }
                    ], npc.imgSrc);
                }
                else if (npc.id === 'pemancing_misterius') {
                    showDialogue(npc.name, "Angin laut sore ini tenang sekali... 🎣\nIkan-ikan besar biasanya muncul saat matahari terbenam.", [
                        { text: "Jual Ikan (Harga Spesial 2000G)", action: () => {
                            const fish = STATE.player.inventory['ikan_segar'] || 0;
                            if (fish > 0) {
                                const total = fish * 2000;
                                STATE.player.inventory['ikan_segar'] = 0;
                                STATE.player.money += total;
                                showToast(`Terjual ${fish} Ikan seharga ${total.toLocaleString()} G!`);
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                closeDialogue();
                            } else {
                                showDialogue(npc.name, "Embermu kosong, nak. Memancinglah dulu di ujung dermaga.", [{text:"Baiklah", action:closeDialogue}], npc.imgSrc);
                            }
                        }},
                        { text: "Info Jenis Ikan 🐟", action: () => {
                            showDialogue(npc.name,
                                "Di perairan Pulau Arsa ini hidup 4 tingkatan ikan:\n\n" +
                                "🐟 **Ikan Kecil**: Sangat umum. Lumayan untuk ganjal perut (+10 Energi).\n" +
                                "🐠 **Ikan Sedang**: Lebih bertenaga. Enak dibakar (+25 Energi).\n" +
                                "🐡 **Ikan Besar**: Tangkapan mantap! Sangat mengenyangkan (+50 Energi).\n" +
                                "👑 **Ikan Legendaris**: RAJA LAUTAN! Sangat langka, bersisik emas, harganya mahal sekali! (Full Energi)\n\n" +
                                "Berdoalah agar kailmu disambar yang Legendaris.",
                                [{text:"Wah, aku ingin yang Legendary!", action:()=>interactNPC(npc)}], npc.imgSrc);
                        }},
                        { text: "Tips Memancing", action: () => {
                            showDialogue(npc.name, "Kunci memancing adalah sabar. Tekan tombol aksi tepat saat indikator berada di area hijau. Jangan terburu-buru.", [{text:"Terima kasih", action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Sampai jumpa", action: closeDialogue }
                    ], npc.imgSrc);
                }
                else if (npc.id === 'putriduyung') {
                    // ═══ PUTRI DUYUNG — Relationship Quest + Skill Renang + Lore ═══
                    const p = STATE.player;
                    const rel = (p.relationships && p.relationships['putriduyung']) || 0;
                    const duyungQ = p.duyungQuestStage || 0; // 0=belum, 1=diberi kalung, 2=selesai

                    let greet = "Glub... glub... Hai manusia darat! 🧜‍♀️\nJarang sekali ada yang menyapaku di sini.";
                    if (rel >= 20) greet = "Ah, kamu lagi! 🧜‍♀️💙\nAku selalu senang saat kamu datang ke sini. Airnya terasa lebih hangat.";
                    if (rel >= 50) greet = "Kamu benar-benar sering kemari... 🧜‍♀️✨\nAku rasa aku sudah menganggapmu seperti sahabat dari dua dunia yang berbeda.";

                    const dOpts = [];

                    dOpts.push({ text: "Siapa kamu sebenarnya?", action: () => {
                        showDialogue("PUTRI DUYUNG", "Aku penjaga perairan Pulau Arsa.\n\nDahulu, laut di sini penuh kehidupan. Tapi semakin banyak manusia yang tidak peduli — sampah, penangkapan berlebihan — lautku mulai sakit.\n\nAku tinggal di sini sendiri, berharap ada manusia yang mau memahami.\n\nKamu... terlihat berbeda dari yang lain.", [{text:"Aku peduli tentang ini.", action: () => { updateRelationship(npc, 3, "Mendengarkan"); showToast("Hubungan +3"); closeDialogue(); }}], npc.imgSrc);
                    }});

                    // Trade
                    dOpts.push({ text: "Tukar Mutiara (5 Ikan → Berlian)", action: () => {
                        const fishCount = p.inventory['ikan_segar'] || 0;
                        if (fishCount >= 5) {
                            p.inventory['ikan_segar'] -= 5;
                            if (!p.inventory['permata']) p.inventory['permata'] = 0;
                            p.inventory['permata']++;
                            showToast("Tukar Berhasil! Dapat Berlian 💎");
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            showDialogue("PUTRI DUYUNG", "Terima kasih ikannya! Ini hadiah cantik dari dasar laut untukmu. 💎\n\nIkan-ikan itu akan kubiarkan berenang bebas di terumbu karangku.", [{text:"Terima kasih!", action:closeDialogue}], npc.imgSrc);
                        } else {
                            showDialogue("PUTRI DUYUNG", "Kamu belum punya cukup ikan. Bawakan aku 5 Ikan Segar — ikan-ikan itu akan kubebaskan di terumbu karang, bukan kumakan.", [{text:"Oke, aku cari dulu", action:closeDialogue}], npc.imgSrc);
                        }
                    }});

                    // Quest Kalung Laut (unlock rel >= 15)
                    if (rel >= 15 && duyungQ === 0) {
                        dOpts.push({ text: "💙 Ada yang ingin kuceritakan...", action: () => {
                            showDialogue("PUTRI DUYUNG", "Sungguh?\n\nAku... aku punya sebuah kalung mutiara tua. Kalung leluhur para peri laut. Tapi kalung itu jatuh ke palung terdalam saat badai besar dulu.\n\nAku tidak bisa menyelam terlalu dalam sendirian. Butuh bantuan seseorang dari darat.\n\nApakah kamu... mau membantuku?", [
                                { text: "Aku akan membantumu mencarinya!", action: () => {
                                    p.duyungQuestStage = 1;
                                    p.duyungQuestItem = false;
                                    showToast("Quest Putri Duyung dimulai! Cari Kalung Mutiara di Dungeon Lt.3+");
                                    showDialogue("PUTRI DUYUNG", "Terima kasih... kamu baik sekali.\n\nKalung itu mungkin tersimpan di palung gelap — dunia bawah yang penuh monster. Aku rasa di kedalaman Dungeon Pulau ini, di lantai ke-3 atau lebih dalam.\n\nHati-hati ya...", [{text:"Aku akan mencarinya.", action:closeDialogue}], npc.imgSrc);
                                }},
                                { text: "Sepertinya berbahaya...", action: closeDialogue }
                            ], npc.imgSrc);
                        }});
                    } else if (duyungQ === 1) {
                        const hasKalung = !!(p.inventory && p.inventory['kalung_mutiara_laut']);
                        if (hasKalung) {
                            dOpts.push({ text: "💎 Aku menemukan kalungmu!", action: () => {
                                p.inventory['kalung_mutiara_laut'] = 0;
                                delete p.inventory['kalung_mutiara_laut'];
                                p.duyungQuestStage = 2;
                                p.skillRenang = true;
                                updateRelationship(npc, 20, "Quest Selesai");
                                p.reputation = (p.reputation||0)+10;
                                p.ethics = (p.ethics||0)+5;
                                showToast("Quest Selesai! +20 Hubungan, REP +10, Skill Renang terbuka!");
                                showDialogue("PUTRI DUYUNG — HARU",
                                    "...ini... kalung itu sungguh.\n\nAku tidak percaya kamu benar-benar menemukannya. Aku sudah mengira ini hilang selamanya.\n\nKalung ini adalah warisan nenek moyang para peri laut — ia menghubungkan kami dengan Kahyangan Wilis di atas...\n\nKamu sudah melakukan sesuatu yang sangat berarti. Aku tidak tahu bagaimana cara membalasnya. Tapi aku bisa mengajarimu sesuatu.\n\nAku ajarkan teknik renang leluhur peri laut — yang akan membantumu di lomba apapun.",
                                    [{text:"Terima kasih, Putri Duyung... (Skill Renang +)", action:closeDialogue}], npc.imgSrc);
                            }});
                        } else {
                            dOpts.push({ text: "🔍 [Quest] Kalung belum ketemu...", action: () =>
                                showDialogue("PUTRI DUYUNG", "Tidak apa-apa, aku bisa menunggu.\n\nKalung itu ada di palung gelap — mungkin di Dungeon lantai 3 atau lebih dalam. Kadang monster menyembunyikan benda berharga.\n\nHati-hati ya, dan jangan menyerah.", [{text:"Aku pasti menemukannya.", action:closeDialogue}], npc.imgSrc)
                            });
                        }
                    } else if (duyungQ === 2) {
                        dOpts.push({ text: "🧜‍♀️ Tentang Kahyangan Wilis...", action: () =>
                            showDialogue("PUTRI DUYUNG", "Kamu sudah ke sana?\n\nKahyangan Wilis... itu adalah dunia kakak-kakak paraku. Para peri darat dan peri udara.\n\nDahulu kami sering berkunjung melalui jalur bawah laut. Tapi sejak Kahyangan Wilis mulai memudar, jalur itu tertutup.\n\nJika kamu bisa membantu memulihkan Pohon Beringin Agung mereka... mungkin jalur itu bisa terbuka lagi. Dan lautku juga akan ikut sehat.", [{text:"Aku akan berusaha.", action:closeDialogue}], npc.imgSrc)
                        });
                    }

                    if (rel < 15) dOpts.push({ text: "Kamu cantik sekali ✨", action: () => { updateRelationship(npc, 2, "Pujian"); showDialogue("PUTRI DUYUNG", "Hihihi... kamu bisa aja 💙\nHati-hati jangan sampai tenggelam ya.", [{text:"Dah", action:closeDialogue}], npc.imgSrc); }});

                    dOpts.push({ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) });
                    dOpts.push({ text: "Sampai jumpa!", action: closeDialogue });
                    showDialogue("PUTRI DUYUNG", greet, dOpts, npc.imgSrc);
                }
                else if (npc.id.includes('swimmer')) {
                    showDialogue(npc.name, "Byurr! Airnya segar sekali! 🌊\nAyo nyebur, jangan takut basah!", [{ text: "Nanti saja", action: closeDialogue }], npc.imgSrc);
                }

                // 4. SENIMAN & PENYANYI
                else if (npc.id === 'seniman') {
                    const senimanQuotes = [
                        "Warna langit sore ini... inspirasi yang sempurna untuk lukisan abstrakku. 🎨",
                        "Seni itu bukan tentang sempurna, tapi tentang jujur. Karya terbaikmu adalah yang paling tulus.",
                        "Aku sedang melukis potret desa ini. Suatu hari nanti ini akan jadi sejarah berharga.",
                        "Kreativitas itu seperti otot — makin dilatih makin kuat. Jangan takut salah dalam berkarya!"
                    ];
                    showDialogue(npc.name, senimanQuotes[Math.floor(Math.random()*senimanQuotes.length)], [
                        { text: "🎵 Request Lagu (50G) - Energi +20", action: () => {
                            if (STATE.player.money >= 50) {
                                STATE.player.money -= 50;
                                STATE.player.energy = Math.min(100, STATE.player.energy + 20);
                                showToast("🎵 Energi +20 (Musik yang menenangkan)");
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                showDialogue(npc.name, "Terima kasih apresiasinya! Ini lagu spesial buat kamu... 🎶", [{text:"Asik!", action:closeDialogue}], npc.imgSrc);
                            } else {
                                showToast("Uang tidak cukup untuk sawer.");
                            }
                        }},
                        { text: "Puji Musiknya", action: () => {
                            showDialogue(npc.name, "Wah, kamu punya selera bagus. Alat musikku teman setia berkeliling Nusantara.", [{text:"Keren", action:closeDialogue}], npc.imgSrc);
                        }},
                        {text:"🎁 Beri Hadiah", action:()=>openGiftMenu(npc)},
                        {text:"Terus berkarya ya", action:()=>{ STATE.player.reputation=(STATE.player.reputation||0)+1; showToast("REP +1 (Dukung seniman lokal)"); closeDialogue(); }},
                        {text:"Dah", action:closeDialogue}
                    ], npc.imgSrc);
                }
                else if (npc.id === 'penyanyi') {
                    const penyanyiQuotes = [
                        "Do Re Mi Fa Sol... 🎵 Suaraku sedang serak, butuh air jahe hangat.",
                        "Musik itu bahasa universal. Bahkan orang yang tidak bisa bicara pun bisa menyanyi dalam hati.",
                        "Lagi latihan untuk festival musim panas! Doakan suaraku, ya?",
                        "Kamu suka musik? Kalau ada konser nanti, aku akan manggung di alun-alun desa!"
                    ];
                    showDialogue(npc.name, penyanyiQuotes[Math.floor(Math.random()*penyanyiQuotes.length)], [
                        { text: "Suaramu merdu sekali!", action: () => {
                            showDialogue(npc.name, "Terima kasih! Kami sedang berlatih untuk festival desa nanti. Doakan lancar ya!", [{text:"Pasti!",action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "Kalian serasi (Seniman & Penyanyi)", action: () => {
                            showDialogue(npc.name, "Hehe, kami memang partner musik terbaik. Musik menyatukan jiwa kami. 🎵", [{text:"Mantap",action:closeDialogue}], npc.imgSrc);
                        }},
                        {text:"🎁 Beri Hadiah", action:()=>openGiftMenu(npc)},
                        {text:"Semangat!", action:closeDialogue},
                        {text:"Dengar sebentar 🎶", action:()=>{ if(typeof AudioService!=='undefined') AudioService.playSFX('item'); showToast("♪ Suaranya merdu sekali..."); closeDialogue(); }}
                    ], npc.imgSrc);
                }

                // 5. NPC INTERIOR (BLACKSMITH, MARINE, DLL)
                else if (npc.id === 'blacksmith') {
                    const ptJob = STATE.player.partTimeJob;
                    const ptStatus = STATE.player.partTimeStatus;
                    const isMyPT = ptStatus === 'working' && ptJob === 'bengkel';
                    showDialogue("KEPALA BENGKEL", "Dunia kerja butuh bukti, bukan janji. 🔥\nMau konsultasi karir, beli cincin, info tempa senjata, atau cari kerja part-time?", [
                        { text: "⚔️ Beli Cincin (Shop)", action: () => {
                            showDialogue("TOKO BENGKEL", "Saya menempa logam menjadi perhiasan kuat. Mau beli apa?", [
                                { text: "Cincin Kayu (50.000 G) 💍", action: () => buyItem('cincin_kayu', 50000) },
                                { text: "Kembali", action: () => interactNPC(npc) }
                            ], npc.imgSrc);
                        }},
                        { text: "🛡️ Info Tempa Senjata", action: () => {
                            showDialogue("KEPALA BENGKEL", "Kalau kamu bawa **Bijih Besi** bisa kutempa jadi **Pisau Baja**. Kalau bawa **Permata** dari Dungeon... bisa jadi **Zirah Permata**. Carilah dulu bahannya!", [{text:"Siap!", action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "📋 Tentang CV", action: () => {
                            showDialogue("KEPALA BENGKEL", "Buat CV yang jujur dan menarik. Cantumkan skill nyata dan pengalaman organisasi atau magang.", [{text:"Oke siap", action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "💼 Etika Kerja", action: () => {
                            showDialogue("KEPALA BENGKEL", "Datang tepat waktu. Hormati atasan dan rekan kerja. Inisiatif tinggi. Itu kunci bertahan di industri.", [{text:"Siap Bos!", action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: isMyPT ? "⚒️ [PART-TIME] Absen / Status Kerja" : "⚒️ Lamar Part-Time di Bengkel", action: () => {
                            if (isMyPT) { openPartTimeMenu('blacksmith'); }
                            else {
                                showDialogue('KEPALA BENGKEL',
                                    '"Eh, mau kerja part-time?\n\nOke! Tapi saya butuh surat lamaran lengkap dulu. Buat di Meja Belajar di rumahmu, lalu bawa amplopnya kemari.\n\n📋 Yang saya butuhkan:\n• Surat Lamaran\n• Ijazah SMA/SMK\n• CV\n• Pas Foto 3×4\n\nSiap, bawa suratnya ke sini!"',
                                    [
                                        { text: '📨 Serahkan Amplop Lamaran', action: () => submitAmplop('blacksmith') },
                                        { text: '📝 Belum buat, nanti ke meja belajar', action: closeDialogue }
                                    ], npc.imgSrc
                                );
                            }
                        }},
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Tutup", action: closeDialogue }
                    ], npc.imgSrc);
                }
                else if (npc.id === 'marine_tailor') {
                    const isMyPT = STATE.player.partTimeStatus === 'working' && STATE.player.partTimeJob === 'penjahit';
                    showDialogue(npc.name, "Halo! Selamat datang di bengkel kami. 🧵\nSuami saya mengurus besi yang keras, saya yang melembutkannya dengan kain. Butuh sesuatu?", [
                        { text: "👘 Beli Baju Pengantin (150.000 G)", action: () => {
                            showDialogue("BUTIK MARINE", "Baju pengantin buatan saya menggunakan sutra terbaik. Sangat anggun untuk hari bahagiamu.", [
                                { text: "Beli (150.000 G)", action: () => buyItem('pakaian_nikah', 150000) },
                                { text: "Lihat-lihat dulu", action: () => interactNPC(npc) }
                            ], npc.imgSrc);
                        }},
                        { text: "Tentang Suami (Blacksmith)", action: () => {
                            showDialogue(npc.name, "Suami saya terlihat galak, tapi sebenarnya hatinya lembut kok. \nDia suka sekali kalau dibawakan **Bijih Besi** untuk bekerja atau **Tonic Stamina** saat lelah.", [{text:"Terima kasih infonya Bu", action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "Sedang menjahit apa?", action: () => {
                            showDialogue(npc.name, "Saya sedang mengerjakan pesanan jubah untuk Guild Petualang. Kainnya harus anti-gores tapi tetap ringan.", [{text:"Keren sekali...", action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: isMyPT ? "🧵 [PART-TIME] Absen / Status Kerja" : "🧵 Lamar Part-Time di Sini", action: () => {
                            if (isMyPT) { openPartTimeMenu('marine_tailor'); }
                            else {
                                showDialogue(npc.name,
                                    '"Mau kerja part-time di sini? Wah senang!\n\nTapi saya butuh surat lamaran dulu ya. Buat di Meja Belajar di rumahmu.\n\n📋 Yang saya butuhkan:\n• Surat Lamaran\n• Ijazah SMA/SMK\n• CV\n• Pas Foto 3×4\n\nBawa amplopnya ke sini ya!"',
                                    [
                                        { text: '📨 Serahkan Amplop Lamaran', action: () => submitAmplop('marine_tailor') },
                                        { text: '📝 Belum buat, nanti ke meja belajar', action: closeDialogue }
                                    ], npc.imgSrc
                                );
                            }
                        }},
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Dah Bu", action: closeDialogue }
                    ], npc.imgSrc);
                }
                else if (npc.id === 'librarian') {
                    const STUDY_TIPS = [
                        "💡 **Teknik Pomodoro**: Belajar fokus selama 25 menit, lalu istirahat 5 menit. Otak butuh jeda untuk menyerap informasi.",
                        "📖 **Literasi**: Membaca bukan sekadar mengeja huruf, tapi memahami makna dan konteks. Jangan telan informasi mentah-mentah!",
                        "✍️ **Mencatat**: Tulislah poin penting dengan tangan. Koneksi saraf tangan ke otak memperkuat memori jangka panjang.",
                        "🧠 **Feynman Technique**: Cara terbaik menguji pemahamanmu adalah dengan mencoba menjelaskannya kepada orang lain dengan bahasa sederhana.",
                        "📚 **Kutipan**: 'Buku adalah jendela dunia, dan kuncinya adalah membaca.' - Jangan malas buka buku ya!",
                        "🌙 **Tidur**: Jangan begadang SKS (Sistem Kebut Semalam). Tidur yang cukup justru membantu konsolidasi memori hafalanmu.",
                        "🔍 **Validasi**: Di era informasi ini, saringlah berita (hoaks) dengan membaca dari berbagai sumber terpercaya."
                    ];
                    const ARSA_LORE = [
                        "Pulau Arsa ini dulunya bagian dari kerajaan kuno bernama **Aethelgard**. Konon, mereka peradaban yang sangat maju dalam sihir dan teknologi.",
                        "Nama 'Arsa' diambil dari bahasa Sanskerta kuno yang berarti 'Kegembiraan' atau 'Harapan'. Pulau ini adalah harapan terakhir bagi mereka yang ingin memperbaiki hidup.",
                        "Hutan di sebelah barat desa itu... di sana banyak reruntuhan tua. Katanya di bawah tanahnya tersimpan perpustakaan raksasa yang terkubur.",
                        "Dungeon di timur pulau sebenarnya adalah 'Penjara Dimensi'. Monster di sana adalah manifestasi dari emosi negatif manusia masa lalu.",
                        "Ada legenda tentang **Cincin Raja**. Katanya, siapa pun yang memakainya akan memiliki karisma yang tak tertandingi."
                    ];
                    const DEWI_CLUES = [
                        "Sstt... pernah dengar legenda **Dewi Arsa**? Katanya dia roh pelindung pulau ini yang sangat cantik.",
                        "Dewi Arsa sangat pemalu. Dia tidak muncul sembarangan. Dia hanya menampakkan diri saat energi bulan sedang di puncaknya.",
                        "Catatan kuno menyebutkan: 'Sang Dewi akan turun di dekat **Patung Peringkat** saat malam **Bulan Purnama**'.",
                        "Coba cek Kalendermu. Bulan Purnama biasanya terjadi di **Musim Panas (Summer)**, sekitar tanggal **23**. Datanglah tepat tengah malam (00:00).",
                        "Hanya hati yang bersih yang bisa melihatnya. Dan mungkin... dia membawa berkah bagi mereka yang menemukannya."
                    ];
                    showDialogue(npc.name, "Sstt... Harap tenang di dalam perpustakaan. \nBuku adalah teman yang paling setia. Ada yang bisa saya bantu?", [
                        {
                            text: "💡 Minta Tips Belajar",
                            action: () => {
                                const tip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
                                if (Math.random() < 0.3) {
                                    STATE.player.int += 1;
                                    showToast("INT +1 (Wawasan Bertambah)");
                                }
                                showDialogue("CATATAN PUSTAKAWAN", tip, [{text:"Terima kasih ilmunya!", action:()=>interactNPC(npc)}], npc.imgSrc);
                            }
                        },
                        {
                            text: "🏝️ Tentang Pulau Arsa (Lore)",
                            action: () => {
                                const lore = ARSA_LORE[Math.floor(Math.random() * ARSA_LORE.length)];
                                showDialogue("ARSIP KUNO", `"${lore}"`, [{text:"Menarik...", action:()=>interactNPC(npc)}], npc.imgSrc);
                            }
                        },
                        {
                            text: "🤫 Rumor Dewi Arsa",
                            action: () => {
                                const clue = DEWI_CLUES[Math.floor(Math.random() * DEWI_CLUES.length)];
                                showDialogue("BISIKAN PUSTAKAWAN", clue, [{text:"Aku akan mengingatnya", action:()=>interactNPC(npc)}], npc.imgSrc);
                            }
                        },
                        {text: "🎁 Beri Hadiah", action: ()=>openGiftMenu(npc)},
                        {text: "Hanya baca buku", action: closeDialogue}
                    ], npc.imgSrc);
                }
                else if (npc.id === 'kutubuku') {
                    const yearK = Math.ceil(STATE.day / 120);
                    const hasDraftK = (STATE.player.inventory['draft_proposal'] || 0) > 0;

                    if (yearK < 3) {
                        showDialogue(npc.name, "Sstt... Jangan berisik. Aku sedang menyusun Bab 2 skripsiku. \nKembalilah saat kamu sudah **Tahun ke-3** nanti.", [{text:"Maaf kak", action:closeDialogue}], npc.imgSrc);
                    } else if (yearK >= 3 && !hasDraftK && STATE.player.activeQuest !== 'find_draft') {
                        showDialogue(npc.name, "HUWAAAA! Gawat! Gawat sekali! 😭 \nDraft Skripsi-ku yang sudah 90% jadi HILANG!", [
                            { text: "Kenapa bisa hilang kak?", action: () => {
                                showDialogue(npc.name, "Tadi aku sedang riset di **Area Candi Kuno** (Timur Laut). Tiba-tiba ada monster mencuri tasku! \n\nKalau kamu berani ke sana dan mengambilkannya kembali, aku akan berikan salinan Draft-nya untukmu. Itu bisa jadi bahan proposalmu nanti!",
                                [
                                    { text: "Aku akan ambilkan! (Terima Quest)", action: () => {
                                        STATE.player.activeQuest = 'find_draft';
                                        showToast("QUEST DITERIMA: Cari Monster di Depan Candi!");
                                        closeDialogue();
                                    }},
                                    { text: "Takut monster...", action: closeDialogue }
                                ], npc.imgSrc);
                            }}
                        ], npc.imgSrc);
                    } else if (STATE.player.activeQuest === 'find_draft' && !hasDraftK) {
                        showDialogue(npc.name, "Tolong cepat! Monster itu lari ke **Depan Candi Kuno**. \nCari monster yang membawa tas buku!", [{text:"Segera ke sana!", action:closeDialogue}], npc.imgSrc);
                    } else if (hasDraftK) {
                        showDialogue(npc.name, "Terima kasih banyak pahlawan! Kamu menyelamatkan masa depanku. \nSesuai janji, salinan Draft itu buat kamu. Gunakan untuk mengajukan proposal ke Dosen di Tahun ke-4 nanti ya! \n\nOiya, **Tips Skripsi**: Done is better than perfect! Jangan perfectionist nanti tidak kelar-kelar.", [{text:"Sama-sama kak!", action:closeDialogue}], npc.imgSrc);
                    } else {
                        showDialogue(npc.name, "Skripsiku... dimana draft skripsiku... 😭\nAku tidak bisa lulus kalau hilang...", [{text:"Sabar kak", action:closeDialogue}], npc.imgSrc);
                    }
                }
                else if (npc.id === 'aya_twin') {
                    showDialogue(npc.name, "Hai! Jangan salah panggil ya, aku Aya, bukan Ayu. 😄\nKami memang kembar identik, tapi kepribadian kami beda lho.", [
                        { text: "Apa bedanya kamu dan Ayu?", action: () => {
                            showDialogue(npc.name, "Ayu itu anak *outdoor*, dia suka berkebun dan keliling desa menyapa orang. \nKalau aku anak *indoor*, lebih suka beres-beres rumah, memasak, dan membaca buku.", [{text:"Ooh begitu, menarik", action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "Kalian akur?", action: () => {
                            showDialogue(npc.name, "Banget! Walaupun kadang rebutan baju sih. Hehe. \nOiya, kalau kamu cari Ayu, dia biasanya ada di luar rumah atau lagi berkebun.", [{text:"Oke makasih", action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "Masakanmu enak?", action: () => {
                            showDialogue(npc.name, "Tentu saja! Kue Labu buatan Ayu itu resep dari aku lho. \nKapan-kapan mampir lagi ya kalau lapar. 🍰", [{text:"Siap!",action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Dah Aya", action: closeDialogue }
                    ], npc.imgSrc);
                }
                else if (npc.id === 'penghulu') {
                    // Cek Role Family
                    if (STATE.player.role === 'family') {

                        // CLEAR QUEST JIKA SEDANG AKTIF
                        if (STATE.player.activeQuest === 'meet_modin') {
                            STATE.player.activeQuest = null;
                            STATE.player.modinVisited = true; // Flag sudah temui modin
                            createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#d946ef');
                            showToast("Quest Selesai: Bertemu Pak Modin ✅");
                        }

                        // Jika sudah menikah
                        if (STATE.player.married) {
                            showDialogue(npc.name, "Alhamdulillah, kamu sudah menyempurnakan separuh agama. \nJaga pasanganmu baik-baik, sakinah mawaddah warahmah ya!", [{ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) }, { text: "Aamiin", action: closeDialogue }], npc.imgSrc);
                            return;
                        }

                        // Dialog Pertanyaan Komitmen
                        showDialogue(npc.name, "Assalamualaikum, anak muda. Mentor Budi memberitahu bahwa kamu memilih jalan Keluarga.\n\nApakah kamu **BENAR-BENAR YAKIN** ingin menikah? \n\nMenikah itu bukan main-main. Konsekuensinya besar: Kamu wajib menafkahi, setia, dan menjaga perasaan pasanganmu seumur hidup. Siap?",
                            [
                                {
                                    text: "InsyaAllah Saya Siap & Yakin!",
                                    action: () => {
                                        // Dialog Pemilihan Pasangan
                                        const gender = STATE.player.gender;
                                        let opts = [];

                                        // Helper function untuk set tunangan
                                        const setFiance = (targetId, targetName) => {
                                            // Set Relationship ke level Tunangan agar mudah dinikahi nanti
                                            if (!STATE.player.relationships[targetId]) STATE.player.relationships[targetId] = 0;
                                            STATE.player.relationships[targetId] = Math.max(STATE.player.relationships[targetId], 60);

                                            // Beri item Cincin Kayu (Starter Ring)
                                            if (!STATE.player.inventory['cincin_kayu']) STATE.player.inventory['cincin_kayu'] = 0;
                                            STATE.player.inventory['cincin_kayu']++;

                                            // --- UBAH SPRITE PLAYER JADI PENGANTIN ---
                                            const pGender = STATE.player.gender;
                                            if (STATE.player.spriteIdle) STATE.player.spriteIdle.src = `images/${pGender}-idle-weding.png`;
                                            if (STATE.player.spriteWalk) STATE.player.spriteWalk.src = `images/${pGender}-walk-weding.png`;
                                            if (STATE.player.spriteWalkUp) STATE.player.spriteWalkUp.src = `images/${pGender}-atas-weding.png`;
                                            if (STATE.player.spriteWalkDown) STATE.player.spriteWalkDown.src = `images/${pGender}-bawah-weding.png`;

                                            // Fallback jika gambar wedding tidak ditemukan
                                            if (STATE.player.spriteIdle) {
                                                STATE.player.spriteIdle.onerror = function () {
                                                    this.src = `images/${pGender}-idle.png`;
                                                    console.warn("Gambar wedding player tidak ditemukan, kembali ke default.");
                                                };
                                            }

                                            // --- SPAWN PASANGAN DI WEDDING HALL ---
                                            const weddingImages = {
                                                'lover1girl': 'images/lover1girl-weding.png',
                                                'lover2girl': 'images/lover2girl-weding.png',
                                                'lover1boy': 'images/lover1boy-weding.png',
                                                'lover2boy': 'images/lover2boy-weding.png'
                                            };
                                            const weddingImg = weddingImages[targetId] || 'images/lover1girlweding.png';

                                            const wMap = maps['wedding_interior'];
                                            if (wMap) {
                                                wMap.npcs = wMap.npcs.filter(n => !n.id.startsWith('lover'));
                                                wMap.npcs.push({
                                                    id: targetId,
                                                    x: 8.5, y: 3,
                                                    name: targetName + " (Calon)",
                                                    imgSrc: weddingImg,
                                                    type: 'static',
                                                    schedule: 'always',
                                                    w: 40, h: 60
                                                });
                                                createParticle(8.5 * TILE_SIZE, 3 * TILE_SIZE, '#ec4899');
                                                createParticle(8.5 * TILE_SIZE, 3 * TILE_SIZE, '#ffffff');
                                            }

                                            showToast(`Target Terkunci: ${targetName} ❤️`);
                                            createParticle(STATE.player.x, STATE.player.y, '#ec4899');

                                            // Modin langsung menawarkan pernikahan
                                            showDialogue(npc.name, `MasyaAllah, calon pasanganmu **${targetName}** sudah hadir di sampingmu.\n\nLihatlah, dia tampak serasi dengan pakaian pengantin itu.\n\nApakah kamu sudah siap untuk melangsungkan akad nikah sekarang?`,
                                                [
                                                    {
                                                        text: "Bismillah, Saya Siap! (Akad)",
                                                        action: () => {
                                                            // 1. LOGIKA PERNIKAHAN (DATA)
                                                            STATE.player.married = true;
                                                            STATE.player.spouseId = targetId;
                                                            STATE.player.reputation += 100;
                                                            STATE.player.money += 5000;
                                                            // Track hari menikah untuk sistem konflik
                                                            STATE.player.marriedDay = STATE.day;
                                                            STATE.player.marriageMonth = 1;
                                                            STATE.player.marriageConflictLevel = 0;
                                                            STATE.player.lastConflictDay = STATE.day;
                                                            STATE.player.monthlyExpenses = 0;

                                                            // 2. MAINKAN MUSIK & PARTIKEL
                                                            if (typeof AudioService !== 'undefined') {
                                                                AudioService.playBGM('wedding');
                                                                AudioService.playSFX('item');
                                                            }

                                                            // Efek Ledakan Partikel (Confetti)
                                                            const confettiColors = ['#ef4444', '#f97316', '#facc15', '#4ade80', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'];
                                                            for (let i = 0; i < 100; i++) {
                                                                const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                                                                const speed = 2 + Math.random() * 6;
                                                                const angle = Math.random() * Math.PI * 2;
                                                                STATE.particles.push({
                                                                    x: STATE.player.x + 10, y: STATE.player.y + 10,
                                                                    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                                                                    life: 60 + Math.random() * 40, color: color
                                                                });
                                                            }

                                                            // Efek Teks "SAH"
                                                            spawnFloatingText(STATE.player.x, STATE.player.y - 60, "SAH!!!", "#fbbf24", 30);
                                                            spawnFloatingText(STATE.player.x - 40, STATE.player.y - 40, "SAH!", "#ffffff", 15);
                                                            spawnFloatingText(STATE.player.x + 40, STATE.player.y - 40, "SAH!", "#ffffff", 15);

                                                            // 🎬 CINEMATIC WEDDING (Family Route)
                                                            closeDialogue();
                                                            STATE.screen = 'cutscene';
                                                            STATE.cutsceneOverride = true;
                                                            playCutsceneWedding(targetName, null);
                                                            // Restore state setelah cinematic selesai (~15.5s)
                                                            setTimeout(() => {
                                                                STATE.cutsceneOverride = false;
                                                                STATE.day++;
                                                                STATE.time = 600;
                                                                STATE.player.energy = 100;
                                                                STATE.player.hp = STATE.player.maxHp;
                                                                if (STATE.player.role === 'entrepreneur') {
                                                                    STATE.location = 'player_shop_interior';
                                                                    STATE.player.x = 5 * TILE_SIZE;
                                                                    STATE.player.y = 3 * TILE_SIZE;
                                                                } else {
                                                                    STATE.location = 'house';
                                                                    STATE.player.x = 3 * TILE_SIZE;
                                                                    STATE.player.y = 2 * TILE_SIZE;
                                                                }
                                                                STATE.player.direction = 'right';
                                                                regenerateHouseMap();
                                                                STATE.screen = 'play';
                                                                manualSave();
                                                                showToast("Keesokan paginya... ☀️");
                                                                setTimeout(() => {
                                                                    const spouse = maps['house'].npcs.find(n => n.id === targetId);
                                                                    if (spouse) {
                                                                        createParticle(spouse.x * TILE_SIZE, spouse.y * TILE_SIZE, '#ec4899');
                                                                        createParticle(STATE.player.x, STATE.player.y, '#ec4899');
                                                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                                                        showDialogue(spouse.name,
                                                                            "Selamat pagi sayang! ❤️ \n\nRasanya seperti mimpi kita sudah tinggal serumah.\nAku sangat bahagia bisa melihat wajahmu saat bangun tidur.\n\nOh iya... soal keseharian kita, aku ingin diskusi denganmu.",
                                                                            [{
                                                                                text: "Pagi juga cintaku! Ada apa?",
                                                                                action: () => {
                                                                                    createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                                                                                    closeDialogue();
                                                                                    // Munculkan pilihan peran RT vs Kerja Luar
                                                                                    setTimeout(() => {
                                                                                        const pGender = STATE.player.gender;
                                                                                        const spouseGender = (targetId === 'lover1boy' || targetId === 'lover2boy') ? 'boy' : 'girl';
                                                                                        const pRoleLabel = pGender === 'boy' ? 'Bapak Rumah Tangga' : 'Ibu Rumah Tangga';
                                                                                        const spouseRoleLabel = spouseGender === 'boy' ? 'Bapak Rumah Tangga' : 'Ibu Rumah Tangga';
                                                                                        const pImg2 = pGender === 'boy' ? 'images/boy.png' : 'images/girl.png';
                                                                                        showDialogue(spouse.name,
                                                                                            "Sayang... kita perlu memutuskan pembagian peran kita. 🏡\n\nSalah satu dari kita akan mengurus rumah, dan yang lain bekerja di luar.\n\nKamu mau pilih peran yang mana?",
                                                                                            [
                                                                                                {
                                                                                                    text: `🏠 Aku jadi ${pRoleLabel} (Urus Rumah)`,
                                                                                                    action: () => {
                                                                                                        STATE.player.homeRole = 'homemaker';
                                                                                                        closeDialogue();
                                                                                                        showDialogue(pImg2 === 'images/boy.png' ? "SUAMI" : "ISTRI",
                                                                                                            `Baiklah! Aku akan menjadi **${pRoleLabel}** yang mengurus rumah dengan sepenuh hati. 🏡\n\nPasanganku akan bekerja mencari nafkah, dan aku akan memastikan rumah selalu nyaman saat dia pulang.\n\nTugas harianku: memasak, bersih-bersih, dan menjaga rumah tetap hangat. Ayo semangat! 💪`,
                                                                                                            [{ text: "Siap! Bismillah~", action: () => { closeDialogue(); showToast(`Peranmu: ${pRoleLabel} 🏠`); } }],
                                                                                                            pImg2
                                                                                                        );
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    text: `💼 Aku bekerja di luar, pasanganku jadi ${spouseRoleLabel}`,
                                                                                                    action: () => {
                                                                                                        STATE.player.homeRole = 'worker';
                                                                                                        closeDialogue();
                                                                                                        showDialogue(spouse.name,
                                                                                                            `Oke sayang, aku akan menjadi **${spouseRoleLabel}** dan urus rumah di sini ya! 🏡\n\nTapi... kamu harus **pulang sebelum jam 17:00** ya! Jangan sampai telat, aku tunggu di rumah.\n\nKalau kamu terlambat pulang, pasti aku marah-marahin hehe... 😤\n\nSetiap pagi kamu pamit, aku doakan supaya lancar kerjanya! 🙏`,
                                                                                                            [{ text: "Siap! Aku akan pulang tepat waktu!", action: () => { closeDialogue(); showToast("Kamu berangkat kerja. Pulang sebelum jam 17:00! 💼"); } }],
                                                                                                            spouse.imgSrc
                                                                                                        );
                                                                                                    }
                                                                                                }
                                                                                            ],
                                                                                            spouse.imgSrc
                                                                                        );
                                                                                    }, 800);
                                                                                }
                                                                            }],
                                                                            spouse.imgSrc
                                                                        );
                                                                    }
                                                                }, 1500);
                                                            }, 15500);
                                                        }
                                                    },
                                                    {
                                                        text: "Sebentar Pak, saya grogi...",
                                                        action: closeDialogue
                                                    }
                                                ],
                                                npc.imgSrc
                                            );
                                        };

                                        if (gender === 'boy') {
                                            opts = [
                                                { text: "Ayu (Gadis Desa yg Ceria)", action: () => setFiance('lover1girl', 'Ayu') },
                                                { text: "Putri (Mahasiswi Pintar)", action: () => setFiance('lover2girl', 'Putri') }
                                            ];
                                        } else {
                                            opts = [
                                                { text: "Dr. Budi (Dokter Ramah)", action: () => setFiance('lover1boy', 'Dr. Budi') },
                                                { text: "Satria (Ksatria Tegas)", action: () => setFiance('lover2boy', 'Satria') }
                                            ];
                                        }

                                        opts.push({ text: "Saya pikir-pikir dulu...", action: closeDialogue });
                                        showDialogue(npc.name, "Alhamdulillah niatnya sudah lurus.\n\nLalu, **dengan siapa** kamu ingin menikah? Tentukan pilihan hatimu sekarang.", opts, npc.imgSrc);
                                    }
                                },
                                {
                                    text: "Waduh, saya jadi ragu...",
                                    action: () => {
                                        showDialogue(npc.name, "Keraguan adalah tanda belum siap. Pulanglah, tenangkan hatimu dulu.", [{ text: "Baik Pak", action: closeDialogue }], npc.imgSrc);
                                    }
                                }
                            ],
                            npc.imgSrc
                        );
                    } else {
                        // Dialog untuk Non-Family Role — tetap bisa menikah via Cincin Raja
                        showDialogue(npc.name,
                            "Assalamualaikum, selamat datang di Balai Pernikahan.\n\nKamu memilih jalur lain dalam kehidupan, tapi bukan berarti pintumu untuk berkeluarga tertutup.\n\nJika kamu sudah **memiliki Cincin Raja** (dari Dungeon) dan hubunganmu dengan seseorang sudah cukup dalam (Cinta 80+), temui langsung orang yang kamu cintai itu.\n\nPernikahanmu tak harus dimulai dari sini, tapi dari hati.", 
                            [{ text: "Terima kasih, Pak", action: closeDialogue }], 
                            npc.imgSrc
                        );
                    }
                }

                // 6. DUNGEON & MISTIS
                else if (npc.id === 'penjagadungeon') {
                    // --- DIALOG PENJAGA DUNGEON — dibagi 2 halaman menu agar tidak overflow di HP ---
                    function penjagaMenu(page) {
                        if (page === 1) {
                            showDialogue("SIAP — PENJAGA DUNGEON", "Berhenti! Area di depan sangat berbahaya.\nHanya untuk yang bernyali besar. Mau tanya apa?", [
                                {text: "⚔️ Tentang Dungeon", action: () => {
                                    showDialogue("SIAP — PENJAGA DUNGEON", "Dungeon terdiri dari 5 Lantai. Semakin dalam, monster semakin ganas.\nDi Lantai 5, bersemayam Boss penjaga harta karun sesungguhnya.", [{text:"Paham", action:()=>penjagaMenu(1)}], npc.imgSrc);
                                }},
                                {text: "🛡️ Tutorial Combat", action: () => {
                                    showDialogue("SIAP — PENJAGA DUNGEON", "Dasar pemula... Dengar baik-baik!\n\n⚔️ TOMBOL SERANG: Di dalam, tombol aksi berubah jadi Pedang.\n🔥 SISTEM COMBO: Serangan ke-3 adalah FINISHER (Damage Besar).\n⚡ STAMINA: Menyerang butuh tenaga. Jangan spam kalau lelah!", [{text:"Siap Paham!", action:()=>penjagaMenu(1)}], npc.imgSrc);
                                }},
                                {text: "🏆 Info Item Legend", action: () => {
                                    showDialogue("SIAP — PENJAGA DUNGEON", "Harta karun utama Boss Lantai 5:\n\n🛡️ Zirah Abadi — Damage musuh berkurang drastis.\n💍 Cincin Raja — Bonus Gold +50% dan SYARAT WAJIB MENIKAH!\n\nTanpa cincin ini, jangan harap lamaranmu diterima!", [{text:"Penting banget!", action:()=>penjagaMenu(1)}], npc.imgSrc);
                                }},
                                {text: "▶ Info Lainnya...", action: () => penjagaMenu(2)},
                                {text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc)},
                                {text: "Tutup", action: closeDialogue}
                            ], npc.imgSrc);
                        } else {
                            showDialogue("SIAP — PENJAGA DUNGEON", "Ada lagi yang ingin kamu tanyakan?", [
                                {text: "🧪 Drop Boss Lainnya?", action: () => {
                                    showDialogue("SIAP — PENJAGA DUNGEON", "Selain pusaka, Boss menyimpan ramuan langka:\n\n🧪 Tonic Kebal — SHIELD selama 10 detik.\n⚡ Tonic Stamina — Memulihkan tenaga seketika.\n\nSangat berguna saat terdesak!", [{text:"Siap hunting!", action:()=>penjagaMenu(2)}], npc.imgSrc);
                                }},
                                {text: "🎒 Item Monster Biasa?", action: () => {
                                    showDialogue("SIAP — PENJAGA DUNGEON", "Monster biasa menjatuhkan material berharga:\n\n💎 Bijih Besi & Permata — Jual di Merchant, harganya mahal.\n📜 Gulungan Kuno — Baca untuk menambah EXP.\n\nKumpulkan semuanya!", [{text:"Siap!", action:()=>penjagaMenu(2)}], npc.imgSrc);
                                }},
                                {text: "☕ Ngobrol Santai", action: () => {
                                    const quotes = [
                                        "Anak muda, jangan mikirin pacaran dulu! Dompetmu masih tipis. Isi dulu dengan Gold, baru cari jodoh.",
                                        "Cinta butuh biaya. Kalau kamu sukses dan punya rumah mewah, pasangan terbaik akan datang sendiri.",
                                        "Hidup itu seperti Dungeon. Penuh rintangan dan monster. Tapi kalau berani maju, ada harta karun menanti.",
                                        "Menabunglah selagi muda. Investasikan untuk Zirah atau Upgrade Rumah.",
                                        "Sakit hati karena cinta? Obatnya cuma satu: SUKSES. Ayo masuk Dungeon!"
                                    ];
                                    const randQuote = quotes[Math.floor(Math.random() * quotes.length)];
                                    showDialogue("SIAP — PENJAGA DUNGEON", randQuote, [{text:"Siap Pak!", action:closeDialogue}], npc.imgSrc);
                                }},
                                {text: "◀ Kembali", action: () => penjagaMenu(1)},
                                {text: "Tutup", action: closeDialogue}
                            ], npc.imgSrc);
                        }
                    }
                    penjagaMenu(1);
                }
                else if (npc.id === 'monster_skripsi') {
                    showDialogue("PENCURI NASKAH", "Grrr... Mau ambil skripsi ini? 👹\nLangkahi dulu mayatku!", [
                        {
                            text: "SERANG! (Mulai Battle)", action: () => {
                                closeDialogue();
                                startRuinsBattle();
                            }
                        },
                        { text: "Kabur", action: closeDialogue }
                    ], npc.imgSrc);
                }
                else if (npc.id === 'dewi_arsa') {
                    // ═══ DEWI ARSA — Multi-Visit, Ethics-Gated, Quest Chain ═══
                    const p = STATE.player;
                    const visitCount = p.arsaVisitCount || 0;
                    p.arsaVisitCount = visitCount + 1;
                    const blessed = p.arsaBlessed || false;
                    const gotWisdom1 = p.arsaWisdom1 || false;
                    const gotWisdom2 = p.arsaWisdom2 || false;
                    const gotWisdom3 = p.arsaWisdom3 || false;

                    let greeting = "Wahai anak manusia... Kau menemukanku di saat bulan purnama bersinar paling terang. 🌙\n\nSungguh langka ada yang datang ke sini.";
                    if (visitCount === 1) greeting = "Kau kembali... 🌙\n\nAku ingat jiwa yang pernah berdiri di sini. Apa yang ingin kau cari kali ini?";
                    if (visitCount >= 2) greeting = "Tiga kunjungan... kau bukan pengelana biasa. 🌙\n\nJiwa yang berulang kali datang ke sini — itu bukan kebetulan. Aku telah menunggumu.";

                    const opts = [];

                    // Berkah — sekali per musim
                    if (!blessed) {
                        opts.push({ text: "Minta Berkah Bulan Purnama", action: () => {
                            p.arsaBlessed = true;
                            p.hp = p.maxHp; p.energy = 100;
                            addItem('permata', 1);
                            p.ethics = (p.ethics || 0) + 5;
                            showToast("✨ Diberkati Dewi Arsa! HP/Energi pulih, Berlian +1, Ethics +5");
                            createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#fbbf24');
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            showDialogue("DEWI ARSA", "Aku adalah manifestasi roh Pulau Arsa.\nKarena ketulusanmu datang di jam suci ini, terimalah berkahku.\n\nDatanglah lagi di bulan purnama berikutnya...", [{text:"Terima kasih, Dewi.", action:closeDialogue}], npc.imgSrc);
                        }});
                    } else {
                        opts.push({ text: "Minta Berkah (Sudah diterima bulan ini)", action: () => showDialogue("DEWI ARSA", "Berkahku hanya bisa diberikan sekali di setiap bulan purnama, Nak.\n\nKembalilah di purnama berikutnya.", [{text:"Baik, Dewi.", action:closeDialogue}], npc.imgSrc) });
                    }

                    // Kebijaksanaan 1 — gratis
                    if (!gotWisdom1) {
                        opts.push({ text: "Apa itu Kedewasaan?", action: () => {
                            p.arsaWisdom1 = true;
                            p.ethics = (p.ethics || 0) + 8;
                            gainExp(80);
                            showToast("Wawasan Dewi Arsa: Ethics +8, EXP +80");
                            showDialogue("DEWI ARSA — KEBIJAKSANAAN I",
                                "Kedewasaan bukan sekadar bertambahnya angka usia, Nak.\n\nDewasa adalah saat kau berhenti menyalahkan dunia atas lukamu, dan mulai mengambil tanggung jawab untuk menyembuhkannya sendiri.\n\n\"Pohon yang kuat bukan yang tak pernah diterpa badai — melainkan yang akarnya menancap lebih dalam setiap kali badai itu berlalu.\"",
                                [{text:"Aku akan merenungkannya... (Ethics +8)", action:closeDialogue}], npc.imgSrc);
                        }});
                    }

                    // Kebijaksanaan 2 — butuh ethics >= 40
                    if (gotWisdom1 && !gotWisdom2) {
                        const ethOk = (p.ethics || 0) >= 40;
                        opts.push({ text: ethOk ? "Apa itu Kebijaksanaan sejati?" : "🔒 [Ethics ≥ 40] Kebijaksanaan Sejati", action: () => {
                            if (!ethOk) { showToast("Ethics kamu belum cukup. Buat lebih banyak keputusan baik."); return; }
                            p.arsaWisdom2 = true;
                            p.ethics = (p.ethics || 0) + 12;
                            gainExp(150);
                            showToast("Wawasan Dewi Arsa II: Ethics +12, EXP +150");
                            showDialogue("DEWI ARSA — KEBIJAKSANAAN II",
                                "Kebijaksanaan adalah seni mengetahui apa yang harus diabaikan.\n\nIa lahir bukan dari buku-buku tebal, melainkan dari luka yang disembuhkan dengan sadar.\n\n\"Orang bijak tidak pernah berhenti belajar — bukan karena dia bodoh, tapi karena dia tahu betapa luasnya yang belum dia ketahui.\"\n\nPerjalananmu sudah cukup jauh, Nak. Tapi masih ada satu hal terakhir yang perlu kau temukan...",
                                [{text:"Apa itu, Dewi?", action: () => {
                                    showDialogue("DEWI ARSA", "Ada dunia yang tersembunyi di balik dinding candi ini.\n\nSebuah dunia yang sekarat. Para penghuninya menunggu — bukan ksatria berbaju baja — tapi seseorang yang cukup bijak untuk mendengarkan.\n\nKau mungkin sudah merasakannya. Retakan dimensi di pojok utara candi...", [{text:"Aku akan mencarinya...", action:closeDialogue}], npc.imgSrc);
                                }}], npc.imgSrc);
                        }});
                    }

                    // Kebijaksanaan 3 — butuh sudah kunjungi Kahyangan Wilis
                    if (gotWisdom2 && !gotWisdom3 && p.sylvariaFirstVisit) {
                        opts.push({ text: "Aku sudah ke Kahyangan Wilis...", action: () => {
                            p.arsaWisdom3 = true;
                            p.ethics = (p.ethics || 0) + 20;
                            p.reputation = (p.reputation || 0) + 15;
                            gainExp(300);
                            addItem('cahaya_arsa', 1);
                            showToast("✨ Restu Dewi Arsa: Ethics +20, REP +15, EXP +300, Dapat Cahaya Arsa!");
                            showDialogue("DEWI ARSA — RESTU TERAKHIR",
                                "Kau sudah sampai ke Kahyangan Wilis.\n\nKau tahu sekarang — bahwa ada dunia yang bergantung pada pilihan-pilihan kecilmu. Setiap keputusan baik yang kau buat di dunia atas... memberi energi bagi Kahyangan Wilis untuk bertahan.\n\nIni adalah inti dari semua kebijaksanaan:\n\"Kebaikan sejati bukan yang dilakukan agar dilihat. Ia adalah kebaikan yang tetap kau lakukan bahkan saat tidak ada yang menonton.\"\n\nTerimalah Cahaya Arsa — sinarnya akan membantumu di saat tergelap.",
                                [{text:"Aku tidak akan melupakan ini. (Restu Dewi +3 semua stat)", action: () => {
                                    p.str = (p.str||0)+3; p.int = (p.int||0)+3;
                                    p.spd = (p.spd||0)+3; p.biz = (p.biz||0)+3;
                                    showToast("Semua stat +3 — Restu Dewi Arsa");
                                    closeDialogue();
                                }}], npc.imgSrc);
                        }});
                    } else if (gotWisdom2 && !gotWisdom3) {
                        opts.push({ text: "🔒 [Kunjungi Kahyangan Wilis dulu] Restu Terakhir", action: () => showDialogue("DEWI ARSA", "Kau belum sampai ke Kahyangan Wilis.\n\nCari retakan dimensi di sisi utara candi. Buka dengan Keris Penjaga, Rafflesia, dan hati yang bersih.", [{text:"Baiklah...", action:closeDialogue}], npc.imgSrc) });
                    }

                    opts.push({ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) });
                    opts.push({ text: "Hormat & Pamit", action: closeDialogue });
                    showDialogue("DEWI ARSA", greeting, opts, npc.imgSrc);
                }
                else if (npc.id === 'dewi_roro') {
                    // ═══ DEWI RORO — Quest Rafflesia + Follow-Up + Kahyangan Wilis Hint ═══
                    const p = STATE.player;
                    const hasBibit = !!(p.inventory && p.inventory['bibit_rafflesia']);
                    const hasBunga = !!(p.inventory && p.inventory['bunga_rafflesia']) || p.rafflesiaBloomed;
                    const sudahSetor = p.rafflesiaSetorRoro || false;
                    const flowers = p.inventory ? (p.inventory['bunga'] || 0) : 0;
                    const gems = p.inventory ? (p.inventory['permata'] || 0) : 0;

                    const rOpts = [];

                    // Berkah heal
                    rOpts.push({ text: "Minta Berkah (Pulihkan HP & Energi)", action: () => {
                        p.hp = p.maxHp; p.energy = 100;
                        showToast("✨ Diberkati Dewi Roro (Pulih Sepenuhnya)");
                        createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#fbbf24');
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        closeDialogue();
                    }});

                    // Quest Rafflesia
                    if (!hasBibit && !hasBunga && !sudahSetor) {
                        rOpts.push({ text: "🌺 Misi Bunga Abadi (Rafflesia Arnoldi)", action: () => {
                            showDialogue("MISI DEWI RORO",
                                "Aku bisa memanggil Bunga Rafflesia Arnoldi yang legendaris, namun aku butuh energi alam.\n\nSYARAT PERSEMBAHAN:\n🌸 Bunga Liar: " + flowers + "/7\n💎 Berlian: " + gems + "/1\n\n(Bunga Liar tumbuh di desa tiap pagi. Berlian dari Monster/Toko).",
                                [{ text: "Serahkan Persembahan", action: () => {
                                    if (flowers >= 7 && gems >= 1) {
                                        p.inventory['bunga'] -= 7; p.inventory['permata'] -= 1;
                                        if (p.inventory['bunga'] <= 0) delete p.inventory['bunga'];
                                        if (p.inventory['permata'] <= 0) delete p.inventory['permata'];
                                        addItem('bibit_rafflesia', 1);
                                        createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#ef4444');
                                        createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#4ade80');
                                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                        showDialogue("DEWI RORO", "Terimalah benih kehidupan ini... Bibit Rafflesia Arnoldi.\n\nTanamlah di ladangmu dan rawatlah hingga mekar.\n\nAda sesuatu yang istimewa dari bunga ini — ia bukan hanya untuk ladangmu. Ia adalah kunci sesuatu yang jauh lebih besar...", [{text:"Terima Kasih Dewi! (Dapat Bibit)", action:closeDialogue}], 'images/rafflesia.png');
                                        manualSave();
                                    } else { showToast("Syarat belum terpenuhi!"); }
                                }}, { text: "Aku cari dulu...", action: closeDialogue }
                                ], npc.imgSrc);
                        }});
                    } else if (hasBibit && !hasBunga) {
                        rOpts.push({ text: "🌺 Bibit Rafflesia sudah di tangan!", action: () =>
                            showDialogue("DEWI RORO", "Bagus! Bibit itu sudah di tanganmu.\n\nTanamlah di ladang dan siram setiap hari. Rafflesia butuh waktu — tapi mekarnya akan menggetarkan seluruh Pulau Arsa.\n\nAku merasakan... ada sesuatu di candi ini yang ikut menunggu mekarnya bunga itu.", [{text:"Baik, Dewi.", action:closeDialogue}], npc.imgSrc)
                        });
                    } else if (hasBunga && !sudahSetor) {
                        // Follow-up setelah Rafflesia mekar
                        rOpts.push({ text: "🌺 Rafflesia sudah mekar! (Lapor ke Roro)", action: () => {
                            showDialogue("DEWI RORO — REAKSI RAFFLESIA",
                                "...AKU MERASAKANNYA!\n\nRafflesia Arnoldi telah mekar di ladangmu! Energi alam mengalir deras ke dalam bumi candi ini!\n\nKau tidak tahu betapa pentingnya ini. Selama bertahun-tahun, Candi ini kehilangan energinya sedikit demi sedikit.\n\nKini dengan mekarnya Rafflesia — segel Dungeon menguat, dan... ada dimensi lain yang ikut bergetar.\n\nTerimakasih, Penjaga. Ini adalah langkah pertama menuju sesuatu yang jauh lebih besar.",
                                [{ text: "Ada apa dengan dimensi lain?", action: () => {
                                    p.rafflesiaSetorRoro = true;
                                    p.ethics = (p.ethics||0) + 10;
                                    p.reputation = (p.reputation||0) + 10;
                                    addItem('kristal_roro', 1);
                                    showToast("Kristal Roro +1 | Ethics +10 | REP +10");
                                    showDialogue("DEWI RORO", "Di balik dinding utara candi ini... ada retakan dimensi.\n\nDahulu itu hanya celah angin. Tapi dengan energi Rafflesia yang kini mengalir, celah itu hampir menjadi portal.\n\nSiapkan dirimu. Kumpulkan semua kebijaksanaan dari leluhurmu. Lalu datangi retakan itu.\n\nAda yang menunggu di baliknya. Mereka membutuhkan bantuanmu.", [{text:"Aku akan ke sana...", action:closeDialogue}], npc.imgSrc);
                                }}], npc.imgSrc);
                        }});
                    } else if (sudahSetor) {
                        rOpts.push({ text: "🌀 Tentang Portal di Utara Candi", action: () =>
                            showDialogue("DEWI RORO", "Portal itu sudah bereaksi pada Rafflesiamu.\n\nBawa Keris Penjaga dari Ki Lamong, dan pastikan jiwamu telah tertempa — bicara dengan Dewi Arsa jika belum.\n\nRetakan ada di pojok utara candi ini. Sentuhlah dengan niat yang tulus.", [{text:"Aku siap.", action:closeDialogue}], npc.imgSrc)
                        });
                    }

                    rOpts.push({ text: "Tentang Candi & Dungeon", action: () =>
                        showDialogue("DEWI RORO", "Candi ini dibangun ribuan tahun lalu oleh leluhurmu untuk menahan segel Dungeon.\n\nDungeon di timur adalah 'Penjara Dimensi' — monster di sana adalah manifestasi dari emosi negatif manusia masa lalu.\n\nSemakin banyak manusia berbuat jahat di dunia, semakin kuat monster-monster itu. Itulah mengapa etika dan kebijaksanaanmu sangat penting.", [{text:"Terima kasih infonya, Dewi.", action:closeDialogue}], npc.imgSrc)
                    });
                    rOpts.push({ text: "Legenda Roro Jonggrang?", action: () =>
                        showDialogue("DEWI RORO", "Hihihi... Itu kisah dari tanah seberang. Saya hanya memiliki nama yang mirip.\n\nSaya menjaga keseimbangan — bukan meminta seribu candi.", [{text:"Ooh begitu...", action:closeDialogue}], npc.imgSrc)
                    });
                    rOpts.push({ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) });
                    rOpts.push({ text: "Hormat & Pamit", action: closeDialogue });

                    const roroGreet = sudahSetor
                        ? "Selamat datang kembali, Penjaga. 🌸\nEnergiku terasa kuat hari ini berkat Rafflesiaamu.\n\nAda yang bisa kubantu?"
                        : "Selamat datang di Candi Aethelgard, wahai pengelana. 🌸\nSaya Roro, roh penjaga kesucian tempat ini.\n\nApa yang membawamu kemari?";
                    showDialogue("DEWI RORO", roroGreet, rOpts, npc.imgSrc);
                }

                // ══════════════════════════════════════════════════════════════
                // 🧚 SYLVARIA NPC INTERACTIONS — Dunia Peri Tersembunyi
                // ══════════════════════════════════════════════════════════════
                else if (npc.id === 'sylva_peri') {
                    const p = STATE.player;
                    const sq = p.sylvariaQuest || {}; // stage: 0-5
                    const stage = sq.stage || 0;

                    // Hitung progress pemulihan
                    const task1Done = !!sq.task1; // Bawa 3 Kristal Tanah (permata) 
                    const task2Done = !!sq.task2; // Selesaikan Dungeon Lt.4+ (dungeon victory)
                    const task3Done = !!sq.task3; // Bawa Cahaya Arsa dari Dewi Arsa
                    const task4Done = !!sq.task4; // Tanam sesuatu di ladang & tunggu 3 hari
                    const allDone = task1Done && task2Done && task3Done && task4Done;

                    const hasPohonJiwa = p.sylvariaQuestComplete || false;

                    let sylvaGreet = "";
                    if (stage === 0) {
                        sylvaGreet = "...Seorang manusia?\n\nSudah berabad-abad tidak ada manusia yang berhasil menjejakkan kaki di Kahyangan Wilis.\n\nAku Rara Wilis, Ratu terakhir para Widadari. Jika kamu bisa melihat kami... berarti hatimu masih murni.\n\nTapi seperti yang kamu lihat... kami hampir punah.";
                    } else if (stage === 1) {
                        const done = [task1Done,task2Done,task3Done,task4Done].filter(Boolean).length;
                        sylvaGreet = `Kamu kembali! ✨\n\nPohon Beringin Agung kami masih berjuang untuk bertahan.\n\nProgress Pemulihan: ${done}/4 tugas selesai.\n\nBantuan apa yang sudah kamu lakukan?`;
                    } else if (hasPohonJiwa) {
                        sylvaGreet = "Kahyangan Wilis... hidup kembali! 🌳✨\n\nPohon Beringin Agung telah mekar sempurna. Para Widadari kembali menari di antara dedaunan Gunung Wilis.\n\nKamu bukan sekadar tamu. Kamu adalah Pelindung Kahyangan Wilis — Bhayangkara Wilis.";
                    }

                    const sOpts = [];

                    if (stage === 0) {
                        sOpts.push({ text: "Ceritakan tentang Kahyangan Wilis...", action: () => {
                            showDialogue("RARA WILIS — RATU WIDADARI",
                                "Kahyangan Wilis dulunya adalah tempat tinggal para Widadari terbesar di Tanah Jawa.\n\nRibuan peri hidup harmonis — peri hutan menjaga pohon-pohon, peri bunga merawat ladang manusia, peri air membersihkan sungai dan laut.\n\nTapi ratusan tahun lalu, manusia mulai melupakan alam. Penebangan hutan, polusi, keserakahan.\n\nDunia kami membutuhkan keseimbangan antara alam dan manusia. Saat manusia melupakan alam... kami memudar.\n\nKini tinggal aku dan beberapa Widadari muda yang tersisa. Pohon Beringin Agung kami — sumber kehidupan Kahyangan Wilis — hampir padam.",
                                [{text:"Apakah ada cara menyelamatkan Kahyangan Wilis?", action: () => {
                                    showDialogue("RARA WILIS", "Ada.\n\nKahyangan Wilis bisa pulih jika ada manusia yang benar-benar tulus membantu — bukan karena mau mendapat hadiah, tapi karena benar-benar peduli.\n\nDibutuhkan empat hal:\n\n1. Kristal Tanah — energi bumi murni\n2. Keberanian menembus kegelapan\n3. Cahaya Kebijaksanaan jiwa manusia\n4. Benih kehidupan yang ditanam dengan cinta\n\nMaukah kamu mencoba?", [
                                        { text: "Aku akan membantu Kahyangan Wilis!", action: () => {
                                            p.sylvariaQuest = { stage: 1, task1:false, task2:false, task3:false, task4:false };
                                            showToast("Quest Kahyangan Wilis dimulai! Bantu pulihkan dunia Widadari Gunung Wilis!");
                                            showDialogue("RARA WILIS", "...Terima kasih.\n\nDalam hati kecilku, aku tahu ada manusia seperti kamu yang akan datang.\n\nKamu tidak perlu terburu-buru. Pohon Beringin Agung akan bertahan selama ada harapan. Dan kehadiranmu di sini sudah memberikan kami harapan itu.", [{text:"Aku berjanji.", action:closeDialogue}], npc.imgSrc);
                                        }},
                                        { text: "Aku butuh waktu untuk berpikir...", action: closeDialogue }
                                    ], npc.imgSrc);
                                }}], npc.imgSrc);
                        }});
                        sOpts.push({ text: "Siapa peri-peri kecil di sini?", action: () =>
                            showDialogue("RARA WILIS", "Mereka adalah yang tersisa.\n\nWening, Widadari hutan — dulu menjaga ribuan pohon Wilis, kini hanya bisa menjaga satu.\nSekar, Widadari bunga — energinya hampir habis, tapi masih mencoba tersenyum.\nBening, Widadari air — dia yang paling muda. Lahir saat Kahyangan Wilis sudah mulai memudar, belum pernah tahu Kahyangan yang sesungguhnya.\n\nMereka bertahan karena aku bilang akan ada manusia yang datang suatu hari.", [{text:"Aku tidak akan mengecewakan mereka.", action:closeDialogue}], npc.imgSrc)
                        });
                    }

                    if (stage >= 1 && !hasPohonJiwa) {
                        // Task 1: Kristal Tanah (3 permata)
                        if (!task1Done) {
                            const hasGems = (p.inventory && (p.inventory['permata'] || 0) >= 3);
                            sOpts.push({ text: hasGems ? "💎 Serahkan Kristal Tanah (3 Berlian)" : "💎 [Butuh 3 Berlian] Kristal Tanah", action: () => {
                                if (!hasGems) { showToast("Butuh 3 Berlian/Permata! Cari di Dungeon atau Putri Duyung."); return; }
                                p.inventory['permata'] -= 3;
                                if (p.inventory['permata'] <= 0) delete p.inventory['permata'];
                                p.sylvariaQuest.task1 = true;
                                createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#4ade80');
                                showToast("Kristal Tanah diserahkan! Pohon Beringin Agung sedikit bersinar...");
                                showDialogue("RARA WILIS", "Kristal Tanah... energi bumi murni!\n\nAku bisa merasakannya — Pohon Beringin Agung kami menyerap energinya. Daunnya yang hitam mulai sedikit memucat menjadi hijau...\n\nTerima kasih. Ini langkah pertama.", [{text:"Tiga lagi!", action:closeDialogue}], npc.imgSrc);
                            }});
                        } else sOpts.push({ text: "✅ Kristal Tanah — Selesai", action: () => showDialogue("RARA WILIS", "Terima kasih atas Kristal Brantas yang kamu berikan. Pohon Beringin Agung menyerapnya dengan baik.", [{text:"Siap.", action:closeDialogue}], npc.imgSrc) });

                        // Task 2: Selesaikan Dungeon Lt.4+
                        const dungeonOk = (STATE.dungeonLevel || 1) >= 4 || (p.dungeonMaxLevel || 0) >= 4;
                        if (!task2Done) {
                            sOpts.push({ text: dungeonOk ? "⚔️ Laporkan Keberanian (Dungeon Lt.4+)" : "⚔️ [Dungeon Lt.4+] Buktikan Keberanian", action: () => {
                                if (!dungeonOk) { showToast("Taklukkan Dungeon Lantai 4 terlebih dahulu!"); return; }
                                p.sylvariaQuest.task2 = true;
                                p.dungeonMaxLevel = Math.max(p.dungeonMaxLevel || 0, STATE.dungeonLevel || 1);
                                createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#f59e0b');
                                showToast("Keberanian terbukti! Pohon Beringin Agung semakin menguat...");
                                showDialogue("RARA WILIS", "Kamu menembus kegelapan dan bertahan.\n\nPohon Beringin merasakan energi keberanian dari jiwamu. Monster-monster di Dungeon itu adalah manifestasi kegelapan yang sama yang menghancurkan Kahyangan Wilis.\n\nKamu sudah membuktikan: manusia bisa melawan kegelapan dari dalam dirinya sendiri.", [{text:"Dua lagi!", action:closeDialogue}], npc.imgSrc);
                            }});
                        } else sOpts.push({ text: "✅ Keberanian Dungeon — Selesai", action: () => showDialogue("RARA WILIS", "Keberanianmu sudah diakui Pohon Beringin Agung.", [{text:"Siap.", action:closeDialogue}], npc.imgSrc) });

                        // Task 3: Cahaya Arsa
                        const hasCahaya = !!(p.inventory && p.inventory['cahaya_arsa']);
                        if (!task3Done) {
                            sOpts.push({ text: hasCahaya ? "✨ Serahkan Cahaya Arsa" : "✨ [Butuh Cahaya Arsa] Kebijaksanaan Jiwa", action: () => {
                                if (!hasCahaya) { showToast("Dapatkan Cahaya Arsa dari Dewi Arsa (setelah kunjungan ke-3 Kahyangan Wilis)!"); return; }
                                delete p.inventory['cahaya_arsa'];
                                p.sylvariaQuest.task3 = true;
                                createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#fbbf24');
                                createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#fff');
                                showToast("Cahaya Arsa! Pohon Beringin Agung bergetar hebat...");
                                showDialogue("RARA WILIS", "...CAHAYA INI!\n\nIni adalah cahaya kebijaksanaan murni dari Dewi Arsa — sumber kehidupan tertinggi di pulau ini.\n\nPohon Beringin Agung kami menangisinya... senang. Daunnya mulai berwarna hijau cerah!\n\nSatu langkah lagi...", [{text:"Aku pasti bisa!", action:closeDialogue}], npc.imgSrc);
                            }});
                        } else sOpts.push({ text: "✅ Cahaya Arsa — Selesai", action: () => showDialogue("RARA WILIS", "Cahaya Arsa telah menyatu dengan Pohon Beringin Agung.", [{text:"Siap.", action:closeDialogue}], npc.imgSrc) });

                        // Task 4: Benih kehidupan (ladang sudah ada 3+ tanaman)
                        const farmCount = Object.values(p.farming || {}).filter(c => c && c.type).length;
                        const farmOk = farmCount >= 3;
                        if (!task4Done) {
                            sOpts.push({ text: farmOk ? "🌱 Serahkan Benih Kehidupan (Ladang ≥3 Tanaman)" : "🌱 [Tanam 3 tanaman dulu] Benih Kehidupan", action: () => {
                                if (!farmOk) { showToast("Tanam minimal 3 jenis tanaman di ladangmu!"); return; }
                                p.sylvariaQuest.task4 = true;
                                createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#86efac');
                                showToast("Benih Kehidupan terbukti! Kahyangan Wilis mulai berdenyut...");
                                showDialogue("RARA WILIS", "Kamu adalah petani juga?\n\nBenih yang kamu tanam dengan tanganmu sendiri — cinta dan kesabaranmu dalam merawat tanaman — itu adalah bentuk kehidupan paling murni yang bisa manusia berikan.\n\nPohon Beringin Agung menyerap energi itu...\n\nSemua syarat sudah terpenuhi. Saatnya ritual pemulihan.", [{text:"LAKUKAN RITUAL!", action: () => {
                                    // Cek ulang semua task setelah task4 baru di-set
                                    const allTasksDone = !!p.sylvariaQuest.task1 && !!p.sylvariaQuest.task2 && !!p.sylvariaQuest.task3 && !!p.sylvariaQuest.task4;
                                    if (allTasksDone) {
                                        startSylvariaRitual(npc);
                                    } else { closeDialogue(); showToast("Selesaikan semua 4 syarat dulu!"); }
                                }}], npc.imgSrc);
                            }});
                        } else if (allDone) {
                            sOpts.push({ text: "🌳 SEMUA SIAP — RITUAL PEMULIHAN!", action: () => startSylvariaRitual(npc) });
                        } else {
                            sOpts.push({ text: "✅ Benih Kehidupan — Selesai", action: () => showDialogue("RARA WILIS", "Benih kehidupanmu terbukti nyata.", [{text:"Siap.", action:closeDialogue}], npc.imgSrc) });
                        }
                    }

                    if (hasPohonJiwa) {
                        sOpts.push({ text: "🌳 Lihat Pohon Beringin Agung yang sudah pulih", action: () =>
                            showDialogue("RARA WILIS — SELAMAT DATANG DI KAHYANGAN WILIS", "Pohon Beringin Agung bersinar lebih terang dari yang pernah aku ingat!\n\nPara Widadari sudah kembali menari. Wening merawat hutan-hutan Wilis. Sekar membuat kebun kenanga baru. Bening membersihkan sendang suci.\n\nKahyangan Wilis hidup lagi.\n\nSetiap hari, aku mengucap syukur karena ada manusia tulus seperti kamu yang datang ke lereng Wilis ini.", [{text:"Ini indah sekali...", action:closeDialogue}], npc.imgSrc)
                        });
                        sOpts.push({ text: "✨ Minta Berkah Wilis (Harian)", action: () => {
                            const today = STATE.day;
                            if (p.sylvariaBlessed === today) { showToast("Berkah Kahyangan Wilis sudah diterima hari ini!"); return; }
                            p.sylvariaBlessed = today;
                            p.hp = p.maxHp; p.energy = 100;
                            p.str = (p.str||0)+1; p.int = (p.int||0)+1;
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            showToast("Berkah Wilis: Full Heal + STR/INT +1 (sementara)! Matur nuwun!");
                            closeDialogue();
                        }});
                    }

                    sOpts.push({ text: "🧚‍♀️ Kelola Kahyangan Wilis", action: () => { closeDialogue(); openFairyVillage(); } });
                    sOpts.push({ text: "💎 Terima Kristal Brantas (Harian)", action: () => {
                        const today = STATE.day;
                        if (p.sylvariaKristalDay === today) { showToast('Kristal sudah diambil hari ini!'); return; }
                        p.sylvariaKristalDay = today;
                        earnFairyKristal(1);
                        closeDialogue();
                    }});
                    sOpts.push({ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) });
                    sOpts.push({ text: "Pamit dulu...", action: closeDialogue });
                    showDialogue("RARA WILIS — RATU WIDADARI KAHYANGAN WILIS", sylvaGreet, sOpts, npc.imgSrc);
                }

                else if (npc.id === 'peri_kecil_1') {
                    const p = STATE.player;
                    const done = p.sylvariaQuestComplete;
                    showDialogue("WENING — WIDADARI WILIS",
                        done ? "Lihatlah pohon-pohon ini! Daunnya hijau lagi! 🌳\nAku sudah menanam 47 bibit pohon sejak Pohon Beringin Agung pulih.\nKamu yang membuat ini semua mungkin, manusia!"
                             : "Aku... aku bisa merasakannya. Energimu hangat. 🍃\nBelum pernah ada manusia yang sampai ke sini.\nTolong bantu kami... pohon-pohon di sini hampir semuanya layu.",
                        [{ text: "Info Pohon Beringin Agung", action: () => showDialogue("WENING", "Pohon Beringin Agung adalah sumber kehidupan Kahyangan Wilis.\nSeluruh kekuatan kami mengalir dari sana.\nBila Pohon Beringin Agung padam... semua Widadari akan menghilang.\nBicaralah dengan Ratu Rara Wilis untuk tahu cara membantunya.", [{text:"Terima kasih Wening.", action:closeDialogue}], npc.imgSrc) },
                         { text: "Semangat ya Fern!", action: () => { updateRelationship(npc, 2, "Menyemangati"); showToast("Fern tersenyum..."); closeDialogue(); }}
                        ], npc.imgSrc);
                }

                else if (npc.id === 'peri_kecil_2') {
                    const p = STATE.player;
                    const done = p.sylvariaQuestComplete;
                    showDialogue("SEKAR — WIDADARI BUNGA",
                        done ? "Seemuanya indah! 🌸 Taman bungaku sudah penuh lagi!\nKamu tahu tidak, bunga-bunga di Kahyangan Wilis bisa berbicara?\nMereka bilang terima kasih karena kamu datang!"
                             : "Hai... 🌸 Aku Sekar. Energiku tinggal sedikit.\nDunia bunga kami sudah lama tidak mekar.\nRatu Rara Wilis masih percaya ada manusia yang bisa membantu.",
                        [{ text: "Apa favoritmu di Kahyangan Wilis?", action: () => showDialogue("SEKAR", "Favoritku adalah saat hujan.\nDi Kahyangan Wilis, hujan berwarna-warni — tetes airnya memancarkan pelangi kecil.\nSudah lama kami tidak melihat hujan seperti itu...\nSemoga Pohon Beringin Agung bisa pulih.", [{text:"Aku ingin melihat itu suatu hari.", action:closeDialogue}], npc.imgSrc) },
                         { text: "🎁 Beri Bunga", action: () => {
                            if (p.inventory && p.inventory['bunga'] > 0) {
                                p.inventory['bunga']--;
                                updateRelationship(npc, 5, "Memberi Bunga");
                                showToast("Lily sangat bahagia! Hubungan +5");
                                showDialogue("SEKAR", "BUNGA! Kamu membawakanku bunga dari dunia manusia?\nBunganya cantik sekali! Berbeda dari bunga Kahyangan tapi tetap indah!\nTerima kasih, terima kasih, terima kasih! 🌸🌸🌸", [{text:"Sama-sama, Sekar!", action:closeDialogue}], npc.imgSrc);
                            } else showToast("Kamu tidak punya bunga. Cari bunga liar di desa!");
                         }}
                        ], npc.imgSrc);
                }

                else if (npc.id === 'peri_kecil_3') {
                    const p = STATE.player;
                    const done = p.sylvariaQuestComplete;
                    showDialogue("BENING — WIDADARI AIR",
                        done ? "Air kolam kristal sudah jernih! 💧✨\nAku bisa berenang lagi!\nKamu tahu tidak, di bawah kolam ini ada terowongan yang terhubung ke laut?\nSang Putri Duyung saudariku bilang jalurnya sudah terbuka lagi!"
                             : "Halo... 💧 Namaku Bening. Aku peri air termuda di sini.\nAku lahir saat Kahyangan Wilis sudah mulai pudar, jadi aku tidak pernah tahu Kahyangan Wilis yang sesungguhnya.\nTapi Ratu Rara Wilis sering bercerita betapa indahnya dahulu kala...",
                        [{ text: "Apakah kamu takut Kahyangan Wilis punah?", action: () => showDialogue("BENING", "Takut?\n\nDahulu iya. Tapi sejak kamu datang...\n\nAku melihat Ratu Rara Wilis tersenyum untuk pertama kalinya. Wening lebih bersemangat. Sekar menyanyikan tembang yang belum pernah kudengar sebelumnya.\n\nKamu membawa sesuatu yang belum pernah ada di sini sejak lama — harapan.", [{text:"Aku akan terus berusaha.", action: () => { updateRelationship(npc, 3, "Memberi Harapan"); closeDialogue(); }}], npc.imgSrc) },
                         { text: "Tentang Putri Duyung di laut", action: () => showDialogue("BENING", "Putri Duyung adalah saudara jauhku! Peri air bisa berada di laut atau di danau.\nDahulu kami sering bermain bersama melalui terowongan bawah laut.\nTapi sekarang terowongan itu tersumbat karena Pohon Beringin Agung melemah.\nKalau Kahyangan Wilis pulih... mungkin kita bisa bermain lagi!", [{text:"Semangat ya Bening!", action:closeDialogue}], npc.imgSrc) }
                        ], npc.imgSrc);
                }

                // 7. KURCACI & PERI (EVENT)
                else if (npc.id === 'kurcaci_farm') {
                    // Kurcaci di ladang sehari-hari (sudah di-hire)
                    const totalDays = STATE.day - 1;
                    const seasonIdx = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                    const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;
                    const isSummer1 = (seasonIdx === 1 && dayInSeason === 1);

                    // Teks status tanaman
                    const farmEntries = Object.entries(STATE.player.farming || {});
                    const totalPlants = farmEntries.filter(([,c]) => c && c.type).length;
                    const matang = farmEntries.filter(([,c]) => c && c.stage >= 3).length;
                    const tumbuh = farmEntries.filter(([,c]) => c && c.stage > 0 && c.stage < 3).length;
                    const sudahSiram = farmEntries.filter(([,c]) => c && c.watered).length;

                    const statusTanaman = totalPlants > 0
                        ? `📊 Status Ladangmu:\n• ${matang} tanaman siap panen 🌾\n• ${tumbuh} tanaman sedang tumbuh 🌱\n• ${sudahSiram} tanaman sudah disiram 💧`
                        : "📊 Ladangmu masih kosong. Tanam benih dulu!";

                    const greeting = isSummer1
                        ? "Hohoho! Hari ini Festival Panen Raya! Temuiku di dekat patung untuk hadiah spesial ya!"
                        : ["Selamat pagi, Tuan! Sudah kusiram semua tanaman tadi subuh!",
                           "Hari yang cerah untuk berkebun! Tanaman-tanamanmu tumbuh subur~",
                           "Hm-hm-hm~ Menyiram tanaman adalah kebahagiaanku!",
                           "Kurcaci tidak pernah absen bekerja. Kamu bisa andalkan aku!"][Math.floor(Math.random()*4)];

                    showDialogue("🌱 GORKI — KURCACI TANI", `"${greeting}"\n\n${statusTanaman}`,
                        [
                            {
                                text: "Siram Semua Sekarang! (Manual)",
                                action: () => {
                                    let count = 0;
                                    for (const key in STATE.player.farming) {
                                        const crop = STATE.player.farming[key];
                                        if (crop && crop.type && !crop.watered) {
                                            crop.watered = true;
                                            count++;
                                        }
                                    }
                                    showToast(count > 0 ? `Gorki menyiram ${count} tanaman! 💧` : "Semua tanaman sudah disiram!");
                                    closeDialogue();
                                }
                            },
                            { text: "Terima kasih, Gorki!", action: closeDialogue }
                        ], npc.imgSrc);
                } else if (npc.id === 'peri_farm') {
                    // Peri di ladang sehari-hari (sudah di-hire)
                    const farmEntries = Object.entries(STATE.player.farming || {});
                    const matang = farmEntries.filter(([,c]) => c && c.stage >= 3).length;
                    const totalPlants = farmEntries.filter(([,c]) => c && c.type).length;

                    const greeting = ["Hei~ Aku sudah panen tanaman matangmu semalam~",
                        "Malam ini aku akan kembali untuk memanen! Jangan khawatir~",
                        "Bunga-bunga di ladangmu cantik sekali~",
                        "Peri tidak tidur, jadi panenmu tidak pernah terlambat! ✨"][Math.floor(Math.random()*4)];

                    const statusMsg = matang > 0
                        ? `🌾 Ada **${matang} tanaman** siap panen malam ini — Ratih akan mengurusnya!`
                        : totalPlants > 0
                            ? "Belum ada yang matang malam ini, tapi Ratih tetap jaga ladang~ 🌙"
                            : "Ladang masih kosong. Tanam benih dulu ya!";

                    showDialogue("🧚‍♀️ SYLVA — PERI PANEN", `"${greeting}"\n\n${statusMsg}`,
                        [
                            {
                                text: "Panen Sekarang! (Paksa)",
                                action: () => {
                                    let harvested = 0;
                                    for (const key in STATE.player.farming) {
                                        const crop = STATE.player.farming[key];
                                        if (crop && crop.type && crop.stage >= 3) {
                                            let item = 'beras'; let qty = 1;
                                            if (crop.type === 'padi') { item = 'beras'; qty = 3; }
                                            else if (crop.type === 'jagung') { item = 'jagung_panen'; qty = 4; }
                                            else if (crop.type === 'tomat') { item = 'tomat_panen'; qty = 3; }
                                            else if (crop.type === 'rafflesia') { item = 'bunga_rafflesia'; qty = 1; }
                                            addItem(item, qty);
                                            delete crop.type;
                                            crop.stage = 0;
                                            harvested++;
                                        }
                                    }
                                    showToast(harvested > 0 ? `Sylva memanen ${harvested} tanaman! 🧚‍♀️` : "Belum ada tanaman matang.");
                                    closeDialogue();
                                }
                            },
                            { text: "Terima kasih, Ratih~", action: closeDialogue }
                        ], npc.imgSrc);
                }
                else if (npc.id === 'kurcaci_tani') {
                    const year = Math.ceil(STATE.day / 120);
                    if (STATE.player.hiredDwarf) {
                        // Sudah dipekerjakan — beri gift tahunan dari Kurcaci
                        if (STATE.player.lastHarvestGiftYear !== year) {
                            STATE.player.lastHarvestGiftYear = year;
                            const giftAmt = 3 + Math.floor(Math.random() * 3); // 3-5 beras
                            addItem('beras', giftAmt);
                            gainExp(15);
                            showDialogue("GORKI — PANEN RAYA 🌾", `Hohoho! Senang melihatmu lagi, Tuan!\nIni hasil ekstra dari ladang tahun ini — aku simpankan khusus untukmu! 🌾\n\n**HADIAH TAHUNAN:**\n• +${giftAmt} Beras Hasil Panen\n• +15 EXP\n\n(Kurcaci tetap bekerja di ladangmu)`, [{ text: "Terima kasih, Kurcaci! 🌾", action: () => { createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#fbbf24'); closeDialogue(); } }], npc.imgSrc);
                        } else {
                            showDialogue("KURCACI TANI", "Hohoho! Aku sudah siram semua tanamanmu tadi pagi! Sisanya terserah kamu. 🌱\n\n(Kurcaci Tani sudah dipekerjakan — hadiah tahunan sudah diambil)", [{ text: "Bagus, teruskan!", action: closeDialogue }], npc.imgSrc);
                        }
                    } else {
                        const hasKurcaciHouse = (STATE.player.furniture || []).includes('rumah_kurcaci');
                        if (!hasKurcaciHouse) {
                            // Belum punya rumah kurcaci - tolak dulu
                            showDialogue("GORKI — KURCACI TANI", "Hohoho! Festival Panen Raya! 🌾\nNama saya Gorki, Kurcaci Tani terbaik di tiga desa!\n\nAku sangat tertarik bergabung denganmu...\nTapi... 🤔\n\n🏠 **Aku butuh tempat tinggal dulu!**\nSiapkan **Rumah Kurcaci** di rumahmu sebagai syarat. Beli di Katalog (Meja Telepon) — 150.000 G.\n\nKalau sudah siap, temui aku lagi di Festival tahun depan!", [
                                { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Oke, akan kusiapkan!", action: closeDialogue },
                                { text: "Buka Katalog Sekarang", action: () => { closeDialogue(); } }
                            ], npc.imgSrc);
                        } else {
                            showDialogue("GORKI — KURCACI TANI", "Hohoho! Festival Panen Raya! 🌾\nNama saya Gorki, Kurcaci Tani terbaik di tiga desa!\n\nLadang pemula seperti milikmu sangat butuh bantuan!\nKalau kamu ajak aku bergabung, aku bisa **menyiram semua tanamanmu secara otomatis** setiap pagi.\n\n✅ Kamu sudah siapkan Rumah Kurcaci untukku! Aku siap bergabung!\n\nAku hanya muncul **setahun sekali** di Festival ini — jangan lewatkan!", [
                                {
                                    text: "✅ Ajak Gorki Bergabung! (1000G)", action: () => {
                                        if (STATE.player.money >= 1000) {
                                            STATE.player.money -= 1000;
                                            STATE.player.hiredDwarf = true;
                                            createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#fbbf24');
                                            createParticle(npc.x * TILE_SIZE + 20, npc.y * TILE_SIZE - 10, '#86efac');
                                            manualSave();
                                            showDialogue("GORKI BERGABUNG! 🌱", "Hohoho! Aku resmi bergabung bersamamu!\nRumah mungilku di sudut rumahmu sudah kupakai istirahat!\n\nMulai besok, semua tanamanmu akan kusiram tiap pagi sebelum kamu bangun!\n\nJangan lupa beli bibit di toko dan tanam di lahan ya!", [{ text: "Siap, Gorki! 🌾", action: closeDialogue }], npc.imgSrc);
                                        } else showToast("Uang kurang! Butuh 1000 Gold.");
                                    }
                                },
                                { text: "Belum perlu sekarang", action: closeDialogue }
                            ], npc.imgSrc);
                        }
                    }
                } else if (npc.id === 'peripanen') {
                    const year = Math.ceil(STATE.day / 120);
                    if (STATE.player.hiredFairy) {
                        // Sudah dipekerjakan — beri gift tahunan dari Peri
                        if (STATE.player.lastGrapeGiftYear !== year) {
                            STATE.player.lastGrapeGiftYear = year;
                            const giftItems = ['tomat_panen', 'jagung_panen', 'bunga_rafflesia'];
                            const randomGift = giftItems[Math.floor(Math.random() * giftItems.length)];
                            addItem(randomGift, 2);
                            STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 5;
                            showDialogue("PERI PANEN — FESTIVAL ANGGUR 🍇", `Hai, Tuan Kebun! Festival anggur tiba lagi~ ✨\nAku menyimpankan hasil panen terbaik untukmu tahun ini!\n\n**HADIAH TAHUNAN:**\n• +2 ${randomGift.replace('_',' ').toUpperCase()}\n• +5 AP (Achievement Points)\n\n(Peri tetap memanen tanamanmu otomatis setiap hari)`, [{ text: "Makasih, Peri! 🧚‍♀️", action: () => { createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#f472b6'); closeDialogue(); } }], npc.imgSrc);
                        } else {
                            showDialogue("PERI PANEN", "Hei hei! Aku sudah panen semua tanaman matang tadi malam~ 🍇✨\n\n(Hadiah Festival Anggur tahun ini sudah kamu ambil)", [{ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Terima kasih, Peri!", action: closeDialogue }], npc.imgSrc);
                        }
                    } else {
                        const hasKurcaci = STATE.player.hiredDwarf;
                        showDialogue("RATIH — PERI PANEN", `Wangi anggur musim gugur memanggilku~ 🍇\nNama saya Ratih, Peri Panen dari Lereng Wilis!\n\nAku bisa **memanen semua tanaman matangmu otomatis** setiap malam.\n\n${hasKurcaci ? '✅ Bagus! Gorki si Kurcaci sudah bekerja di ladangmu. Dengan aku, lahanmu akan jalan 100% otomatis!' : '⚠️ Tip: Ajak Gorki si Kurcaci Tani dulu di Festival Panen Raya (Summer hari 1) agar ladang makin optimal!'}\n\nAku hanya muncul **setahun sekali** di Festival Anggur ini!`, [
                            {
                                text: "✅ Ajak Ratih Bergabung! (2000G)", action: () => {
                                    if (STATE.player.money >= 2000) {
                                        STATE.player.money -= 2000;
                                        STATE.player.hiredFairy = true;
                                        createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#f472b6');
                                        createParticle(npc.x * TILE_SIZE - 15, npc.y * TILE_SIZE - 15, '#c084fc');
                                        manualSave();
                                        showDialogue("RATIH BERGABUNG! 🧚‍♀️", "Hore! Ratih resmi bergabung bersamamu!\nMulai malam ini, semua tanaman yang matang (Stage 3) akan kupanen otomatis sebelum fajar!\n\nHasil panen akan masuk ke tasmu. Jangan lupa tanam bibit baru ya~", [{ text: "Siap, Ratih! 🍇", action: closeDialogue }], npc.imgSrc);
                                    } else showToast("Uang kurang! Butuh 2000 Gold.");
                                }
                            },
                            { text: "Belum perlu sekarang", action: closeDialogue }
                        ], npc.imgSrc);
                    }
                }

                // --- DIALOG SPESIFIK: RAKA - TEMAN SEKELAS ---
                else if (npc.id === 'peer1') {
                    const rep = STATE.player.reputation || 0;
                    const msgs = rep >= 60
                        ? ["Eh bro! Makasih udah jadi teman terbaik aku di sini. Yuk nanti kita belajar bareng di kampus, EXP-nya double lho!", "Yo! Gue dapet kabar ada ujian mendadak besok. Lo udah siap? Belajar bareng yuk!", "Hei! Gue lagi cari partner buat tugas kelompok. Lo mau?"]
                        : ["Hoi! Salam kenal, aku Raka. Kuliah di sini juga? Kita bisa belajar bareng kapan-kapan!", "Raka nih. Kalau butuh teman belajar, cari aku aja ya!", "Eh, kalau kamu sering ke kampus, nanti kita bisa ketemu di sana ya!"];
                    showDialogue("RAKA — TEMAN SEKELAS", msgs[Math.floor(Math.random() * msgs.length)], [
                        rep >= 30 ? { text: "Yuk belajar bareng!", action: () => { showToast("Belajar bareng Raka! +10 EXP 📚"); STATE.player.exp = (STATE.player.exp || 0) + 10; closeDialogue(); } } : null,
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Sip, makasih Raka!", action: closeDialogue }
                    ].filter(Boolean), npc.imgSrc);
                }

                // --- DIALOG SPESIFIK: BUDI - TETANGGA ---
                else if (npc.id === 'peer2') {
                    const hour = STATE.hour || 8;
                    const msgs = hour < 12
                        ? "Pagi! Aku Budi, tetanggamu. Kalau butuh apa-apa jangan sungkan ya, pintu rumah aku selalu terbuka!"
                        : hour < 17
                        ? "Siang! Lagi sibuk apa? Aku baru pulang dari pasar. Harga sembako naik lagi nih..."
                        : "Sore! Hari yang panjang ya. Istirahat yang cukup biar badan tetap fit!";
                    showDialogue("BUDI — TETANGGA", msgs, [
                        { text: "💬 Tanya Info Lowongan Kerja", action: () => { closeDialogue(); searchJobFromNeighbor(); } },
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Makasih Budi!", action: closeDialogue }
                    ], npc.imgSrc);
                }

                // --- DIALOG SPESIFIK: PAK SLAMET - PETANI ---
                else if (npc.id === 'peer3') {
                    const farming = STATE.player.farming || {};
                    const totalPlants = Object.values(farming).filter(c => c && c.type).length;
                    const msg = totalPlants > 0
                        ? `Slamet aku, petani di sini. Lihat ladangmu udah ada ${totalPlants} tanaman — bagus! Jangan lupa siram tiap pagi, biar hasil panennya maksimal. Musim ini bagus untuk menanam padi!`
                        : "Halo nak! Nama saya Slamet, petani di desa ini sejak 20 tahun lalu. Kamu belum punya tanaman? Coba ke ladangmu, cangkul tanahnya dan tanam bibit. Bertani itu mengasyikkan!";

                    // ── FOLKTALE TRACKER ──
                    const sudahDengarKupatan = STATE.player.folktale_kupatan || false;
                    const opsiKupatan = sudahDengarKupatan
                        ? { text: "📜 Tradisi Kupatan (✔ Sudah didengar)", action: () => {
                            showDialogue("PAK SLAMET — PETANI",
                                "Ha ha, masih ingat ceritanya? Bagus!\n\n\"Kupatan adalah tradisi sepekan setelah Lebaran. Ketupat bukan cuma makanan — bentuk anyamannya yang rumit melambangkan kesalahan manusia yang terbalut maaf. Saat dimakan bersama, artinya kita sudah saling memaafkan.\"\n\nNilai itu yang kami jaga turun-temurun di Lamongan!",
                                [{ text: "Indah sekali maknanya!", action: () => interactNPC(npc) }], npc.imgSrc);
                          }}
                        : { text: "📜 Ceritakan tradisi desa ini, Pak!", action: () => {
                            STATE.player.folktale_kupatan = true;
                            STATE.player.happiness = Math.min(100, (STATE.player.happiness || 50) + 5);
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            showToast("📖 Tradisi Kupatan dipelajari! Happiness +5");
                            showDialogue("PAK SLAMET — PETANI",
                                "Nak, di Lamongan ini ada tradisi yang sudah turun-temurun namanya **Kupatan**.\n\n📜 TRADISI KUPATAN LAMONGAN\n\n\"Sepekan setelah Idul Fitri, seluruh warga berkumpul membuat ketupat bersama-sama. Ketupat dibuat dari janur kuning yang dianyam — rumit dan butuh kesabaran.\"\n\n\"Konon, rumitnya anyaman ketupat melambangkan kesalahan kita yang bertumpuk. Tapi saat dimasak dan dimakan bersama tetangga, artinya semua kesalahan sudah termaafkan.\"\n\n\"Di Lamongan, Kupatan bukan hanya ritual — ini adalah cara leluhur mengajarkan bahwa kebersamaan dan saling memaafkan itu lebih penting dari segalanya.\"\n\n🎋 Happiness +5 — Hatimu hangat mendengar cerita ini!",
                                [{ text: "Terima kasih, Pak Slamet!", action: () => interactNPC(npc) }], npc.imgSrc);
                          }};

                    showDialogue("PAK SLAMET — PETANI", msg, [
                        opsiKupatan,
                        { text: "Tips bertani dong!", action: () => showDialogue("PAK SLAMET — PETANI", "🌾 TIPS BERTANI:\n1. Cangkul tanah dulu sebelum tanam\n2. Siram SETIAP pagi (Stage naik lebih cepat)\n3. Pupuk bisa mempercepat 1 hari\n4. Panen saat Stage 3 (penuh)\n5. Jual di Merchant untuk harga terbaik!", [{ text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Mantap Pak!", action: closeDialogue }], npc.imgSrc) },
                        { text: "Terima kasih Pak Slamet!", action: closeDialogue }
                    ], npc.imgSrc);
                }

                // --- DIALOG SPESIFIK: ARYO - SENIMAN ---
                else if (npc.id === 'seniman') {
                    showDialogue("ARYO — SENIMAN", "Kreativitas adalah jiwa! Aku Aryo, seniman Pulau Arsa.\n\nSeni bukan hanya soal bakat — tapi ketekunan dan keberanian mengekspresikan diri.\n\nJika relasimu denganku sudah cukup dalam, aku bisa melukis potretmu untuk menaikkan Reputasi di desa! 🎨", [
                        { text: "Keren banget, Aryo!", action: closeDialogue },
                        { text: "Lukis potret aku!", action: () => {
                            const rel = (STATE.player.relationships && STATE.player.relationships['seniman']) || 0;
                            if (rel >= 65) {
                                STATE.player.reputation = (STATE.player.reputation || 0) + 20;
                                showDialogue("ARYO — SENIMAN", "🖼️ Potretmu sudah jadi! Karya terbaikku!\n\nReputasimu di desa naik +20! Warga-warga kagum melihat potretmu dipajang di balai desa.", [{ text: "Luar biasa, Aryo!", action: closeDialogue }], npc.imgSrc);
                            } else {
                                showDialogue("ARYO — SENIMAN", `Hmm... hubungan kita belum cukup dalam.\nRelasi kita: ${rel}/65.\n\nDatangi aku lebih sering dan bawa kain sutra sebagai kado — baru aku mau melukismu!`, [{ text: "Baik, aku akan kembali!", action: closeDialogue }], npc.imgSrc);
                            }
                        }}
                    ], npc.imgSrc);
                }

                // --- DIALOG SPESIFIK: NADIA - PENYANYI ---
                else if (npc.id === 'penyanyi') {
                    const hour = STATE.hour || 8;
                    const msg = hour >= 18
                        ? "🎵 La la la~ Malam ini aku tampil di festival! Nanti kalau dengar lagu 'Angin Arsa', itu laguku lho!\n\nMusik bisa mengobati jiwa yang lelah. Apa kamu juga suka bernyanyi?"
                        : "Halo! Aku Nadia, penyanyi desa ini. 🎤\nAku biasanya latihan di sini setiap pagi.\n\nSuara adalah instrumen terbaik — tak perlu beli, cukup dilatih!";
                    showDialogue("NADIA — PENYANYI", msg, [{ text: "Suaramu merdu, Nadia!", action: closeDialogue }], npc.imgSrc);
                }

                // --- FIX: MENGEMBALIKAN INTERAKSI HEWAN (YANG SEMPAT HILANG) ---
                else if (npc.type === 'animal') {
                    // --- INTERAKSI HEWAN (versi asli lengkap) ---
                    let animalSound = "...";
                    if (npc.id.includes('ayam')) animalSound = "Petok petok! 🐔";
                    else if (npc.id.includes('kambing')) animalSound = "Mbekkk! 🐐";
                    else if (npc.id.includes('sapi')) animalSound = "Mooo! 🐄";
                    else if (npc.id.includes('kuda')) animalSound = "Hiihaaa! 🐎";

                    showDialogue(npc.name, `"${animalSound}" \n(Hewan ini menatapmu dengan lucu)`, [
                        {text: "👋 Elus-elus (Pet)", action: () => {
                            // Trigger efek hati visual
                            npc.loveTimer = 60;

                            // Ubah gambar & kembalikan per jenis hewan
                            if (npc.id.includes('sapi')) {
                                npc.imgSrc = 'images/sapi-elus.png';
                                npc.loadedImg = null;
                                setTimeout(() => { npc.imgSrc = 'images/sapi.png'; npc.loadedImg = null; }, 3000);
                            } else if (npc.id.includes('kambing')) {
                                npc.imgSrc = 'images/kambing-elus.png';
                                npc.loadedImg = null;
                                setTimeout(() => { npc.imgSrc = 'images/kambing.png'; npc.loadedImg = null; }, 3000);
                            } else if (npc.id.includes('kuda')) {
                                npc.imgSrc = 'images/kuda-elus.png';
                                npc.loadedImg = null;
                                setTimeout(() => { npc.imgSrc = 'images/kuda.png'; npc.loadedImg = null; }, 3000);
                            } else if (npc.id.includes('ayam')) {
                                npc.imgSrc = 'images/ayam-elus.png';
                                npc.loadedImg = null;
                                setTimeout(() => { npc.imgSrc = 'images/ayam.png'; npc.loadedImg = null; }, 3000);
                            }

                            // Mainkan suara hewan
                            if (AudioService.enabled && AudioService.tracks[npc.sound]) {
                                AudioService.tracks[npc.sound].currentTime = 0;
                                AudioService.tracks[npc.sound].play().catch(()=>{});
                            }

                            createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#ff69b4');

                            // Spawn love bubble di atas kepala
                            STATE.particles.push({
                                x: (npc.x * TILE_SIZE) + (npc.w ? npc.w/2 : 20),
                                y: (npc.y * TILE_SIZE) - 15,
                                vx: 0,
                                vy: -0.5,
                                life: 60,
                                type: 'love_bubble'
                            });

                            showToast(`Kamu mengelus ${npc.name}. Dia terlihat senang! ❤️`);
                            closeDialogue();
                        }},
                        {text: "Tinggalkan", action: closeDialogue}
                    ], npc.imgSrc);
                }

                // --- INTERAKSI MAHASISWA SANTAI (LAZY STUDENT) ---
                else if (npc.id === 'student2') {
                    showDialogue(npc.name, "Hhh... (Menguap) 🥱 \nDosennya ngomong apa sih dari tadi? Aku cuma numpang absen doang.", [
                        { text: "Jangan malas dong", action: () => {
                            showDialogue(npc.name, "Biarin... yang penting lulus. Lagian aku mau jadi Pro Player game aja nanti.", [{text:"Terserah deh",action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "Curhat soal kuliah?", action: () => {
                            showDialogue(npc.name, "Sebenernya... aku takut gagal. Jadi mendingan gak usaha daripada udah usaha tapi tetep gagal. \nNgerti kan?", [{text:"Aku paham...", action:closeDialogue}], npc.imgSrc);
                        }},
                        { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                        { text: "Dah", action: closeDialogue }
                    ], npc.imgSrc);
                }

                // --- INTERAKSI FAKE LOVER (DONI / BELLA) ---
                // Sistem 4 Fase: CHARM → HONEYTRAP → LOVE BOMB → GHOSTING
                else if (npc.id === 'fake_boy' || npc.id === 'fake_girl') {
                    const rel = STATE.player.relationships[npc.id] || 0;
                    const isBoy = npc.id === 'fake_boy';
                    const fakeName = isBoy ? 'Doni' : 'Bella';

                    // === HELPER: Nama lover target yang sedang diincar fake_boy/fake_girl ===
                    // fake_boy incar lover player perempuan (Ayu/Putri), fake_girl incar lover player laki (Satria/Dr.Budi)
                    const loverMap = { lover1girl:'Ayu', lover2girl:'Putri', lover1boy:'Dr. Budi', lover2boy:'Satria' };
                    // Target yang diincar oleh fake NPC ini
                    const targetLoverId = isBoy
                        ? (STATE.player.gender === 'girl' ? 'lover1girl' : 'lover2girl')
                        : (STATE.player.gender === 'boy' ? 'lover2boy' : 'lover1boy');
                    const targetLoverName = loverMap[targetLoverId] || 'seseorang';
                    // Pasangan yang sedang intens diincar sesuai waktu
                    const isAfternoon = (STATE.time || 800) >= 1500;

                    // === ARC KHUSUS: SUDAH MENIKAH → RIVAL JADI SAHABAT ===
                    if (STATE.player.married) {
                        let friendlyText = '';
                        let friendlyOpts = [];
                        if (isBoy) {
                            friendlyText = `Yo! Gimana kehidupan nikah? Enak kan ada yang ngurusin? Hahaha.\n\nJujur gue lega banget kamu udah nikah. Sekarang gue bisa fokus ngejar ${targetLoverName} tanpa takut bersaing sama kamu.\n\nSelamat ya! Gue doain langgeng sampai kakek-nenek. 🤝`;
                            friendlyOpts = [
                                { text: 'Thanks Bro! Kapan nyusul?', action: () => showDialogue(fakeName, `"Hahaha, santai lah. Gue masih mau nikmatin masa muda dulu.\nNanti kalau gue nikah sama ${targetLoverName}, kamu orang pertama yang gue undang!"`, [{text:'Siap! GWS kejar ${targetLoverName}!', action:closeDialogue}], npc.imgSrc) },
                                { text: '💬 Minta Tips Rumah Tangga', action: () => showDialogue(fakeName, `"Waduh, salah orang bro. Gue masih jomblo!\nTapi kata orang, kuncinya satu: Sering ajak jalan pasangan. Cewek/cowok itu butuh perhatian — bukan cuma uang."`, [{text:'Bener juga!', action:closeDialogue}], npc.imgSrc) },
                                { text: 'Dah Bro 👋', action: closeDialogue }
                            ];
                        } else {
                            friendlyText = `Haiii! Ciee pengantin baru~ Auramu beda banget, makin glowing! ✨\n\nSelamat ya! Dulu aku sempet sebel karena takut kamu ambil perhatian ${targetLoverName}. Tapi sekarang sadar, kamu temen yang baik kok.\n\nLanggeng terus sama pasanganmu! 💕`;
                            friendlyOpts = [
                                { text: `Makasih Bella! Kamu semangat kejar ${targetLoverName} ya!`, action: () => showDialogue(fakeName, `"Pasti dong! Sainganku udah berkurang satu, peluangku makin besar hihihi~\nKapan-kapan kita belanja bareng yuk!"`, [{text:'Boleh tuh!', action:closeDialogue}], npc.imgSrc) },
                                { text: '🗣️ Tukar Gosip', action: () => showDialogue(fakeName, `"Tau nggak? Bu Lastri itu ternyata naksir anak Blacksmith lho! Desa ini kecil tapi dramanya banyak banget. Seru abis! 😂"`, [{text:'Walah...',action:closeDialogue}], npc.imgSrc) },
                                { text: 'Dah Bella 👋', action: closeDialogue }
                            ];
                        }
                        showDialogue(`${fakeName} 🤝 (Sahabat Baru)`, friendlyText, friendlyOpts, npc.imgSrc);
                        return;
                    }

                    // === FASE 4: GHOSTING (rel = 100) ===
                    if (rel >= 100) {
                        // Cek apakah sudah di-reveal
                        const revealed = STATE.player[`fakeRevealed_${npc.id}`];

                        if (!revealed) {
                            // MOMEN REVEAL — hanya sekali
                            STATE.player[`fakeRevealed_${npc.id}`] = true;

                            // Cari nama lover asli player
                            const loverNames = {
                                lover1girl:'Ayu', lover2girl:'Putri',
                                lover1boy:'Dr. Budi', lover2boy:'Satria'
                            };
                            const targetLoverId = isBoy
                                ? (STATE.player.gender === 'girl' ? 'lover1girl' : 'lover1boy')
                                : (STATE.player.gender === 'boy' ? 'lover1boy' : 'lover1girl');
                            const realLoverName = loverNames[STATE.player.spouseId] || loverNames[targetLoverId] || 'seseorang';

                            // Hukuman: drain energi & potong gold
                            const lostGold = Math.floor(STATE.player.money * 0.1);
                            STATE.player.money = Math.max(0, STATE.player.money - lostGold);
                            STATE.player.energy = Math.max(0, STATE.player.energy - 20);

                            // Turunkan relasi lover asli jika ada
                            const loverKey = STATE.player.spouseId || targetLoverId;
                            if (STATE.player.relationships[loverKey]) {
                                STATE.player.relationships[loverKey] = Math.max(0, STATE.player.relationships[loverKey] - 15);
                                showToast(`💔 ${loverMap[loverKey] || targetLoverName} mendengar kabar burung... (-15 Relasi)`);
                            }

                            if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                            createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#000000');

                            const revealText = isBoy
                                ? `*${fakeName} berbalik dengan tampang dingin*\n\n"Oke, aku mau jujur sekarang. Aku dekatin kamu bukan karena aku beneran suka.\n\nAku mau bikin ${targetLoverName} cemburu dan nolak kamu. Biar dia fokus ke aku!\n\nTapi ternyata... kamu gak semudah itu. Tapi tetap aja, kita udah selesai. Aku gak suka kamu. Bye! 😏"\n\n(-${lostGold} Gold, -20 Energi, Relasi ${targetLoverName} berkurang)`
                                : `*${fakeName} tersenyum sinis*\n\n"Akhirnya aku bisa jujur. Selama ini aku cuma pura-pura sayang kamu.\n\nTujuanku cuma satu: Ngalahin kamu biar ${targetLoverName} ngerasa kamu gak layak!\n\nSorry ya, tapi game-ku berhasil. Kita done disini. Dah! 💅"\n\n(-${lostGold} Gold, -20 Energi, Relasi ${targetLoverName} berkurang)`;

                            showDialogue(fakeName + ' (TOPENG LEPAS! 🎭)', revealText, [
                                {
                                    text: "Kamu... JAHAT! 😡",
                                    action: () => {
                                        updateRelationship(npc, -30, 'Pengkhianatan');
                                        showDialogue(fakeName, `"Hahaha, iya! Dan kamu gak bisa buktiin apa-apa. Sampai jumpa!" *pergi dengan pede*`, [{text:'(Menahan tangis...)', action:closeDialogue}], npc.imgSrc);
                                    }
                                },
                                {
                                    text: "Aku sudah curiga dari awal.",
                                    action: () => {
                                        showDialogue(fakeName, `"Oh? Kalau gitu kamu juga sama aja dong, pura-pura gak tau. Kita impas." *angkat bahu dan pergi*`, [{text:'Sial...', action:closeDialogue}], npc.imgSrc);
                                    }
                                }
                            ], npc.imgSrc);

                        } else {
                            // Setelah reveal: GHOSTING PENUH — cuek dan menghindari
                            const ghostLines = [
                                "Eh? Oh, kamu. Aku lagi sibuk, lain kali aja ya.",
                                "...Aku gak ada keperluan sama kamu sekarang.",
                                "Udah lupa? Kita udah selesai. Jangan ganggu aku.",
                                "*Membuang muka dan berpura-pura tidak melihat*",
                                "Mau apa? Aku gak mau ngobrol sama kamu.",
                                "Hmph. Masih aja nyamperin. Hopeless banget sih.",
                            ];
                            const ghostText = ghostLines[Math.floor(Math.random() * ghostLines.length)];
                            showDialogue(fakeName + ' (Acuh)', ghostText, [
                                { text: 'Kenapa jadi gini... 💔', action: closeDialogue },
                                { text: 'Terserah kamu.', action: closeDialogue }
                            ], npc.imgSrc);
                        }
                        return;
                    }

                    // === FASE 3: LOVE BOMB (70–99) ===
                    if (rel >= 70) {
                        const randomChat = getRandomChat(npc.id, rel);
                        // Tiap interaksi di fase ini: drain gold
                        const drainAmt = 150 + Math.floor(rel * 2);
                        const canAfford = STATE.player.money >= drainAmt;

                        showDialogue(fakeName + ' 💕 (Fase: Cinta Palsu)', randomChat, [
                            {
                                text: `💸 Traktir ${fakeName} (-${drainAmt} G)`,
                                action: () => {
                                    if (!canAfford) {
                                        showDialogue(fakeName, `"Bokek? Ih, males deh. Aku pergi dulu ya, nanti kalau udah ada uang hubungi aku." *pergi begitu saja*`, [{text:'Astaga...', action:closeDialogue}], npc.imgSrc);
                                        return;
                                    }
                                    STATE.player.money -= drainAmt;
                                    updateRelationship(npc, 3, 'Ditraktir');
                                    showToast(`-${drainAmt} G (Ditraktir ${fakeName})`);
                                    showDialogue(fakeName, `"Makasih sayang~ Kamu memang yang terbaik! 😘 *tapi matanya sesekali melirik ke arah lain*"`, [{text:'Senang bisa bantu...', action:closeDialogue}], npc.imgSrc);
                                }
                            },
                            { text: '🎁 Beri Hadiah', action: () => openGiftMenu(npc) },
                            {
                                text: '💬 Ngobrol Santai',
                                action: () => {
                                    if (STATE.player.energy < 2) { showToast('Terlalu lelah... (Butuh 2 Energi)'); return; }
                                    STATE.player.energy -= 2;
                                    updateRelationship(npc, 1, 'Ngobrol');
                                    const c = getRandomChat(npc.id, rel);
                                    showDialogue(fakeName, c, [{text:'(Tersipu)', action:closeDialogue}], npc.imgSrc);
                                }
                            },
                            { text: 'Sampai nanti~ 👋', action: closeDialogue }
                        ], npc.imgSrc);
                        return;
                    }

                    // === FASE 2: HONEYTRAP (30–69) ===
                    if (rel >= 30) {
                        const randomChat = getRandomChat(npc.id, rel);
                        const talkCost = 75;

                        showDialogue(fakeName + ' 🤍 (Makin Deket...)', randomChat, [
                            {
                                text: '💬 Ngobrol (Bayar Traktiran)',
                                action: () => {
                                    if (STATE.player.money < talkCost) {
                                        showDialogue(fakeName, `"Lho, kamu gak bawa uang? Mana mau aku ngobrol. Capek ah." *cuek*`, [{text:'Haduh...', action:closeDialogue}], npc.imgSrc);
                                        return;
                                    }
                                    STATE.player.money -= talkCost;
                                    if (STATE.player.energy < 2) { showToast('Terlalu lelah!'); return; }
                                    STATE.player.energy -= 2;
                                    updateRelationship(npc, 2, 'Ngobrol');
                                    showToast(`-${talkCost} G (Biaya Traktiran ${fakeName})`);
                                    const c = getRandomChat(npc.id, rel);
                                    showDialogue(fakeName, c, [{text:'Asik juga ya~', action:closeDialogue}], npc.imgSrc);
                                }
                            },
                            { text: '🎁 Beri Hadiah', action: () => openGiftMenu(npc) },
                            {
                                text: '😏 Nge-Gombal',
                                action: () => {
                                    if (STATE.player.energy < 3) { showToast('Kurang energi! (Butuh 3)'); return; }
                                    STATE.player.energy -= 3;
                                    updateRelationship(npc, 3, 'Gombal Berhasil');
                                    const resp = isBoy
                                        ? `"Hahaha, kamu lucu! Gombalannya biasa aja sih... tapi aku suka. Lanjut~ 😏"`
                                        : `"Ih, kamu gitu deh! Gombalan murahan... tapi aku senyum-senyum sendiri. Hm. 😤"`;
                                    showDialogue(fakeName, resp, [{text:'Yes! Berhasil!', action:closeDialogue}], npc.imgSrc);
                                }
                            },
                            { text: 'Aku pergi dulu.', action: closeDialogue }
                        ], npc.imgSrc);
                        return;
                    }

                    // === FASE 1: CHARM (0–29) — manis & PDKT palsu, tapi sesekali sindir lover target ===
                    const isEarlyGame = rel < 10; // Baru kenal, masih jaga image
                    let openingLine = '';
                    if (isEarlyGame) {
                        // Baru kenal: langsung sindir lover target (dari index134)
                        if (isBoy) {
                            openingLine = isAfternoon
                                ? `${targetLoverName} itu seleranya tinggi, bro. Otak pas-pasan kayak kamu gak bakal nyambung ngobrol sama dia.`
                                : `Eh ada kamu. Asal tau aja ya, ${targetLoverName} tuh lebih suka cowok keren kayak gue. Kamu mending balik ke ladang deh.`;
                        } else {
                            openingLine = isAfternoon
                                ? `${targetLoverName} itu butuh pendamping yang tangguh, bukan yang lembek kayak kamu. Jauh-jauh sana!`
                                : `Duh, ngapain sih kamu di sini? ${targetLoverName} lagi sibuk, jangan ganggu dia deh. Aku aja yang nemenin dia.`;
                        }
                    } else {
                        openingLine = getRandomChat(npc.id, rel);
                    }

                    showDialogue(isEarlyGame ? `${fakeName} 😤` : `${fakeName} 😊`, openingLine, [
                        {
                            text: '💬 Ngobrol',
                            action: () => {
                                if (STATE.player.energy < 2) { showToast('Terlalu lelah... (Butuh 2 Energi)'); return; }
                                STATE.player.energy -= 2;
                                updateRelationship(npc, 2, 'Ngobrol');
                                const c = getRandomChat(npc.id, rel);
                                showDialogue(fakeName, c, [{text:'Asik juga orangnya!', action:closeDialogue}], npc.imgSrc);
                            }
                        },
                        {
                            text: '⚔️ Tantang Duel!',
                            action: () => { closeDialogue(); startDuel(npc); }
                        },
                        { text: '🎁 Beri Hadiah', action: () => openGiftMenu(npc) },
                        { text: 'Abaikan saja.', action: closeDialogue }
                    ], npc.imgSrc);
                }

                // --- ELSE BLOCK UNTUK WARGA/GENERIC NPC ---
                else {
                    // --- NEW: FAMILY PERK (BERKAH TETANGGA) ---
                    if (STATE.player.role === 'family' && STATE.player.reputation >= 20 && Math.random() < 0.4) {
                        const gifts = ['gandum', 'ikan_kecil', 'coklat', 'bunga', 'susu'];
                        const gift = gifts[Math.floor(Math.random() * gifts.length)];
                        addItem(gift, 1);
                        createParticle(npc.x * TILE_SIZE, npc.y * TILE_SIZE, '#f472b6');
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        showDialogue(npc.name, "Eh, tetangga teladan! Kebetulan saya punya lebihan **" + gift.toUpperCase().replace('_', ' ') + "** di dapur. \nAmbil saja buat keluarga di rumah ya!", [{ text: "Alhamdulillah, makasih!", action: closeDialogue }], npc.imgSrc);
                        return;
                    }

                    const lifeChats = [
                        "Duh, harga sembako naik lagi. Pintar-pintar atur gaji ya dek.",
                        "Tetangga sebelah sukses karena dia rajin menabung sejak sekolah.",
                        "Hati-hati investasi bodong. Cepat kaya itu mustahil.",
                        "Jangan lupa bayar pajak kalau sudah berpenghasilan nanti.",
                        "Jaga kesehatan. Biaya rumah sakit itu mahal lho."
                    ];

                    // NPC yang tidak menerima hadiah biasa
                    const noGiftIds = ['monster_skripsi','patient_girl'];
                    const isChild = false; // Semua NPC boleh terima hadiah kecuali monster

                    if (!noGiftIds.includes(npc.id) && !isChild) {
                        const love = STATE.player.relationships[npc.id] || 0;
                        const loveLabel = love >= 50 ? `❤️ ${love}` : love >= 20 ? `🤍 ${love}` : `🖤 ${love}`;
                        showDialogue(npc.name, lifeChats[Math.floor(Math.random() * lifeChats.length)] + `

[Hubungan: ${loveLabel}]`, [
                            { text: "🎁 Beri Hadiah", action: () => openGiftMenu(npc) },
                            { text: "Oke, makasih!", action: closeDialogue }
                        ], npc.imgSrc);
                    } else {
                        showDialogue(npc.name, lifeChats[Math.floor(Math.random() * lifeChats.length)], [{ text: "Nasehat Bagus", action: closeDialogue }], npc.imgSrc);
                    }
                }

            }







            function buyItem(item, cost) {
                if (STATE.player.money >= cost) {
                    STATE.player.money -= cost;
                    if (!STATE.player.inventory) STATE.player.inventory = {};
                    if (!STATE.player.inventory[item]) STATE.player.inventory[item] = 0;
                    STATE.player.inventory[item]++;
                    showToast(`Beli ${item} sukses!`);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); // SFX Beli Item
                    closeDialogue();

                    // --- NEW: POPUP SPESIAL SAAT BELI BAJU PENGANTIN ---
                    if (item === 'pakaian_nikah') {
                        setTimeout(() => {
                            showDialogue("ITEM SPESIAL! 👘",
                                "Selamat! Kamu berhasil membeli **BAJU PENGANTIN**.\n\nBusana anggun dari sutra terbaik.\n(Cek Lemari Pakaian di rumah untuk memakainya)",
                                [{ text: "Cantik Sekali!", action: closeDialogue }],
                                'images/lemari.png'
                            );
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        }, 1000);
                    }

                } else showToast("Uang kurang!");
            }

            // --- UPDATE: DYNAMIC GIFT MENU ---
            function openGiftMenu(npc) {
                const inv = STATE.player.inventory || {};
                const opts = [];

                // Daftar item yang bisa dihadiahkan
                const giftableItems = [
                    { id: 'coklat', name: 'Coklat' },
                    { id: 'bunga', name: 'Bunga' },
                    { id: 'ikan_segar', name: 'Ikan Segar' },
                    { id: 'gandum', name: 'Gandum' },
                    { id: 'kain', name: 'Kain Sutra' },
                    { id: 'besi', name: 'Bijih Besi' },
                    { id: 'permata', name: 'Berlian' },
                    { id: 'tonic_stamina', name: 'Tonic Stamina' },
                    { id: 'buku_tesis', name: 'Buku Tesis' }
                ];

                giftableItems.forEach(g => {
                    if (inv[g.id] > 0) {
                        opts.push({
                            text: `${g.name} (x${inv[g.id]})`,
                            action: () => giveGift(npc, g.id)
                        });
                    }
                });

                opts.push({ text: "Kembali", action: () => interactNPC(npc) });

                if (opts.length === 1) showDialogue(npc.name, "Tas kamu kosong! Beli hadiah di Merchant atau cari item dulu.", opts, npc.imgSrc);
                else showDialogue(npc.name, "Mau kasih apa?", opts, npc.imgSrc);
            }

            // --- UPDATE: PREFERENCE & REACTION SYSTEM ---
            function openTradingMenu(npc) {
                const opts = [];

                COMMODITIES.forEach(c => {
                    const currentPrice = getDailyPrice(c.id, c.base, c.volatility);
                    const owned = (STATE.player.inventory[c.id] || 0);

                    let trendIcon = "➖";
                    if (currentPrice < c.base * 0.9) trendIcon = "📉 MURAH";
                    else if (currentPrice > c.base * 1.1) trendIcon = "📈 MAHAL";

                    opts.push({
                        text: `${c.name}: ${currentPrice.toLocaleString()} G (Punya: ${owned}) [${trendIcon}]`,
                        action: () => showCommodityAction(c, currentPrice, npc)
                    });
                });

                opts.push({ text: "Kembali", action: () => interactNPC(npc) });

                showDialogue("PASAR KOMODITAS", `Hari ke-${STATE.day}. Harga berfluktuasi setiap pagi. \nModal: ${STATE.player.money.toLocaleString()} G`, opts, npc.imgSrc);
            }

            function giveGift(npc, item) {
                // 1. DEFINISI KESUKAAN (PREFERENCES)
                const preferences = {
                    'lover1girl': { // AYU (Ceria)
                        likes: ['bunga', 'coklat', 'gandum', 'kain', 'permata'],
                        dislikes: ['besi', 'ikan_segar', 'tonic_stamina']
                    },
                    'lover2girl': { // PUTRI (Pemalu/Scholar)
                        likes: ['buku_tesis', 'bunga', 'permata', 'kain'],
                        dislikes: ['ikan_segar', 'besi', 'tonic_stamina']
                    },
                    'lover2boy': { // SATRIA (Ksatria/Tegas)
                        likes: ['besi', 'tonic_stamina', 'ikan_segar', 'permata'],
                        dislikes: ['bunga', 'coklat', 'kain']
                    },
                    'lover1boy': { // DR. BUDI (Dokter/Loveable)
                        likes: ['ikan_segar', 'gandum', 'tonic_stamina', 'bunga'],
                        dislikes: ['coklat', 'besi']
                    },
                    // NEW: PREFERENSI CINTA MATRE (Hanya Suka Barang Mahal)
                    'lover_matre_girl': {
                        likes: ['permata', 'kain', 'cincin_legend', 'zirah_legend'], // Suka Luxury
                        dislikes: ['ikan_segar', 'besi', 'gandum', 'bunga', 'coklat'] // Gak suka barang murah/biasa
                    },
                    'lover_matre_boy': {
                        likes: ['permata', 'besi', 'tonic_stamina'],
                        dislikes: ['bunga', 'gandum', 'kain']
                    },
                    // === NPC WARGA & TEMAN ===
                    'mentor':        { likes: ['buku_tesis', 'gandum', 'tonic_stamina'], dislikes: ['coklat'] },
                    'sarjana_tekno': { likes: ['buku_tesis', 'tonic_stamina', 'besi'], dislikes: ['bunga', 'ikan_segar'] },
                    'sarjana_sejarah':{ likes: ['buku_tesis', 'bunga', 'kain'], dislikes: ['besi', 'tonic_stamina'] },
                    'satpam':        { likes: ['tonic_stamina', 'ikan_segar', 'gandum'], dislikes: ['bunga', 'kain'] },
                    'peer1':         { likes: ['coklat', 'tonic_stamina', 'ikan_segar'], dislikes: ['buku_tesis'] },
                    'peer2':         { likes: ['bunga', 'coklat', 'kain'], dislikes: ['besi', 'tonic_stamina'] },
                    'peer3':         { likes: ['gandum', 'ikan_segar', 'besi'], dislikes: ['kain', 'permata'] },
                    'nelayan':       { likes: ['ikan_segar', 'tonic_stamina', 'gandum'], dislikes: ['kain', 'buku_tesis'] },
                    'istrinelayan':  { likes: ['bunga', 'coklat', 'kain'], dislikes: ['besi', 'tonic_stamina'] },
                    'cewek_islam':   { likes: ['bunga', 'coklat', 'kain', 'gandum'], dislikes: ['besi'] },
                    'cewek_kristen': { likes: ['bunga', 'coklat', 'permata'], dislikes: ['besi', 'ikan_segar'] },
                    'pemancing_misterius': { likes: ['ikan_segar', 'tonic_stamina'], dislikes: ['buku_tesis', 'kain'] },
                    'putriduyung':   { likes: ['permata', 'bunga', 'kain'], dislikes: ['besi', 'tonic_stamina'] },
                    'seniman':       { likes: ['bunga', 'kain', 'coklat'], dislikes: ['besi', 'tonic_stamina'] },
                    'penyanyi':      { likes: ['bunga', 'coklat', 'permata'], dislikes: ['besi', 'ikan_segar'] },
                    'swimmer_boy':   { likes: ['tonic_stamina', 'ikan_segar', 'coklat'], dislikes: ['buku_tesis'] },
                    'swimmer_girl':  { likes: ['bunga', 'coklat', 'kain'], dislikes: ['besi'] },
                    'senior_kaia':   { likes: ['buku_tesis', 'coklat', 'bunga'], dislikes: ['besi'] },
                    'fake_boy':      { likes: ['permata', 'tonic_stamina'], dislikes: ['bunga', 'gandum'] },
                    'fake_girl':     { likes: ['permata', 'kain', 'coklat'], dislikes: ['besi', 'gandum'] },
                    'kurcaci_tani':  { likes: ['gandum', 'tonic_stamina', 'ikan_segar'], dislikes: ['permata', 'kain'] },
                    'kurcaci_farm':  { likes: ['gandum', 'tonic_stamina', 'ikan_segar'], dislikes: ['permata', 'kain'] },
                    'peripanen':     { likes: ['bunga', 'coklat', 'kain'], dislikes: ['besi', 'tonic_stamina'] },
                    'peri_farm':     { likes: ['bunga', 'coklat', 'kain'], dislikes: ['besi', 'tonic_stamina'] },
                    'trader_outside':{ likes: ['gandum', 'besi', 'ikan_segar'], dislikes: ['bunga', 'kain'] },
                    'trader_wife_inside': { likes: ['kain', 'coklat', 'bunga'], dislikes: ['besi'] },
                    'librarian':     { likes: ['buku_tesis', 'coklat', 'bunga'], dislikes: ['besi', 'tonic_stamina'] },
                    'guild_master':  { likes: ['permata', 'besi', 'tonic_stamina'], dislikes: ['coklat', 'bunga'] },
                    'blacksmith':    { likes: ['besi', 'tonic_stamina', 'gandum'], dislikes: ['bunga', 'kain'] },
                    'marine_tailor': { likes: ['kain', 'bunga', 'coklat'], dislikes: ['besi', 'tonic_stamina'] },
                    'lecture':       { likes: ['buku_tesis', 'coklat', 'gandum'], dislikes: ['besi'] },
                    'student1':      { likes: ['buku_tesis', 'coklat', 'tonic_stamina'], dislikes: ['besi'] },
                    'student2':      { likes: ['coklat', 'ikan_segar', 'tonic_stamina'], dislikes: ['buku_tesis'] },
                    'op_warnet':     { likes: ['coklat', 'tonic_stamina', 'ikan_segar'], dislikes: ['kain'] },
                    'maid_warnet':   { likes: ['bunga', 'coklat', 'kain'], dislikes: ['besi'] },
                    'aya_twin':      { likes: ['bunga', 'coklat', 'kain', 'permata'], dislikes: ['besi'] },
                    'dewi_arsa':     { likes: ['bunga', 'permata', 'kain'], dislikes: ['besi', 'tonic_stamina'] },
                    'dewi_roro':     { likes: ['bunga', 'permata'], dislikes: ['besi', 'ikan_segar'] },
                    'penghulu':      { likes: ['gandum', 'bunga', 'kain'], dislikes: ['besi', 'tonic_stamina'] },
                    'child_blacksmith': { likes: ['coklat', 'bunga'], dislikes: ['besi', 'tonic_stamina'] },
                    'child_boy_1':   { likes: ['coklat', 'ikan_segar'], dislikes: ['buku_tesis', 'kain'] },
                    'child_girl_1':  { likes: ['coklat', 'bunga'], dislikes: ['besi', 'tonic_stamina'] },
                    'penjagadungeon': { likes: ['besi', 'tonic_stamina', 'permata'], dislikes: ['bunga', 'kain', 'coklat'] },
                };

                // 2. TENTUKAN DAMPAK & TIPE REAKSI
                let impact = 1; // Default Neutral (+1)
                let reactionType = 'neutral';

                if (preferences[npc.id]) {
                    if (preferences[npc.id].likes.includes(item)) {
                        impact = 5; // Suka (+5)
                        reactionType = 'love';
                    } else if (preferences[npc.id].dislikes.includes(item)) {
                        impact = -2; // Tidak Suka (-2)
                        reactionType = 'hate';
                    }
                }

                // 3. KURANGI ITEM
                STATE.player.inventory[item]--;
                if (STATE.player.inventory[item] <= 0) delete STATE.player.inventory[item];

                // 4. UPDATE HUBUNGAN VISUAL
                // Gunakan "Cinta" jika naik, "Kecewa" jika turun
                let label = impact > 0 ? "Cinta" : "Kecewa";
                updateRelationship(npc, impact, label);

                // 5. RESPO DIALOG BERDASARKAN KEPRIBADIAN
                let dialogueText = "";

                // --- AYU (CERIA) ---
                if (npc.id === 'lover1girl') {
                    if (reactionType === 'love') dialogueText = "Wahhh! Ini kesukaanku! Kamu tau banget sih! Makasih ya! ❤️";
                    else if (reactionType === 'hate') dialogueText = "Eh... makasih... tapi aku kurang suka ginian. Baunya aneh/nggak cocok buatku. 😅";
                    else dialogueText = "Makasih ya! Kamu baik deh ngasih ini."; // Neutral
                }
                // --- PUTRI (PEMALU) ---
                else if (npc.id === 'lover2girl') {
                    if (reactionType === 'love') dialogueText = "I-ini... beneran buat aku? A-aku suka banget... T-terima kasih... >///<";
                    else if (reactionType === 'hate') dialogueText = "A-anu... maaf... a-aku agak takut sama benda ini... T_T";
                    else dialogueText = "Terima kasih... aku simpan ya."; // Neutral
                }
                // --- SATRIA (TEGAS) ---
                else if (npc.id === 'lover2boy') {
                    if (reactionType === 'love') dialogueText = "Luar biasa! Ini item yang berguna untuk memperkuat diri. Terima kasih atas dukunganmu.";
                    else if (reactionType === 'hate') dialogueText = "Maaf, saya prajurit. Saya tidak butuh benda-benda lembek seperti ini.";
                    else dialogueText = "Terima kasih. Akan saya gunakan sebaik-baiknya."; // Neutral
                }
                // --- DR. BUDI (MANIS) ---
                else if (npc.id === 'lover1boy') {
                    if (reactionType === 'love') dialogueText = "Wah, nutrisinya pas banget! Kamu perhatian banget sama kesehatan saya. Makasih manis! 😘";
                    else if (reactionType === 'hate') dialogueText = "Waduh, ini kurang sehat lho. Jangan sering-sering pegang ginian ya.";
                    else dialogueText = "Makasih ya! Nanti saya cek kegunaannya."; // Neutral
                }
                // --- NEW: RESPON MATRE ---
                else if (npc.id.includes('matre')) {
                    if (reactionType === 'love') dialogueText = "Wahhh! Mahal nih pasti! Kamu emang paling ngerti seleraku. Makasih ya sayang! (Hati: Naik Pesat) 🤑";
                    else if (reactionType === 'hate') dialogueText = "Iuh... apaan ini? Murahan banget. Jauh-jauh deh, nanti tanganku kotor.";
                    else dialogueText = "Hmm, lumayan. Tapi lain kali kasih yang lebih mahal ya?";
                }
                // --- NPC SPESIFIK ===
                else if (npc.id === 'mentor') {
                    if (reactionType === 'love') dialogueText = "Wah, kamu benar-benar murid yang berterima kasih! Ini akan sangat berguna. 📚";
                    else if (reactionType === 'hate') dialogueText = "Hmm... Mentor tidak butuh benda seperti ini. Lebih baik kamu simpan sendiri.";
                    else dialogueText = "Terima kasih, anak didik. Kamu makin dewasa ya.";
                }
                else if (npc.id === 'librarian') {
                    if (reactionType === 'love') dialogueText = "Aduh, Bu Ratna senang sekali! Ini benar-benar hadiah yang tepat untuk pustakawan!";
                    else if (reactionType === 'hate') dialogueText = "Terimakasih, tapi ini kurang sesuai untuk saya. Hehe.";
                    else dialogueText = "Makasih ya! Nanti Bu Ratna simpan di balik meja.";
                }
                else if (npc.id === 'peer1') {
                    if (reactionType === 'love') dialogueText = "Gila bro, nih hadiah cocok banget! Thanks ya, kamu emang best! 🤜🤛";
                    else if (reactionType === 'hate') dialogueText = "Bro... ini kurang berguna buat gue sih. Tapi thanks lah.";
                    else dialogueText = "Oke, lumayan. Gue simpen ya bro.";
                }
                else if (npc.id === 'peer2') {
                    if (reactionType === 'love') dialogueText = "Ih makasih banget! Kamu tau seleraku banget. Kamu teman terbaik! 💛";
                    else if (reactionType === 'hate') dialogueText = "Hm... aku kurang suka ini sih. Tapi tetap makasih ya.";
                    else dialogueText = "Wah, makasih! Aku simpan ya.";
                }
                else if (npc.id === 'peer3') {
                    if (reactionType === 'love') dialogueText = "Hoh! Ini berguna banget buat sawah! Anak muda tapi ngerti kebutuhan petani. Mantap!";
                    else if (reactionType === 'hate') dialogueText = "Waduh... ini kurang pas buat saya. Tapi niat baiknya saya terima.";
                    else dialogueText = "Alhamdulillah. Rejeki anak soleh ini namanya.";
                }
                else if (npc.id === 'nelayan') {
                    if (reactionType === 'love') dialogueText = "Pak Suryo suka banget! Ini cocok buat hidup di laut. Terima kasih banyak!";
                    else if (reactionType === 'hate') dialogueText = "Hehe, kurang cocok buat nelayan saya ini. Tapi makasih ya.";
                    else dialogueText = "Makasih. Ini nanti saya pakai buat melaut.";
                }
                else if (npc.id === 'istrinelayan') {
                    if (reactionType === 'love') dialogueText = "Aduh manisnya! Ibu senang sekali dikasih ini. Kapan-kapan mampir ya!";
                    else if (reactionType === 'hate') dialogueText = "Nak, ini kurang cocok untuk ibu-ibu. Hehe, makasih tetap ya.";
                    else dialogueText = "Makasih nak. Kamu baik sekali.";
                }
                else if (npc.id === 'satpam') {
                    if (reactionType === 'love') dialogueText = "Wah, Pak Darmo senang sekali! Pas banget buat jaga malam. Makasih nak!";
                    else if (reactionType === 'hate') dialogueText = "Lho... ini untuk apa? Satpam gak butuh ginian. Tapi makasih ya.";
                    else dialogueText = "Terima kasih. Pak Darmo terima.";
                }
                else if (npc.id === 'blacksmith') {
                    if (reactionType === 'love') dialogueText = "Nah ini baru namanya orang ngerti kebutuhan pandai besi! Mantap lah! 🔨";
                    else if (reactionType === 'hate') dialogueText = "Hmm... bengkel gak butuh ini. Tapi niat baikmu aku terima.";
                    else dialogueText = "Oke, aku terima. Berguna nanti di bengkel.";
                }
                else if (npc.id === 'guild_master') {
                    if (reactionType === 'love') dialogueText = "Ini hadiah yang layak untuk seorang Guild Master! Terima kasih, Prajurit! ⚔️";
                    else if (reactionType === 'hate') dialogueText = "Guild Master tidak membutuhkan benda lemah seperti ini.";
                    else dialogueText = "Terima kasih. Guild Master menerimanya.";
                }
                else if (npc.id === 'seniman') {
                    if (reactionType === 'love') dialogueText = "Ini... indah sekali! Sama seperti seni — memberi kebahagiaan tanpa syarat. Terima kasih! 🎨";
                    else if (reactionType === 'hate') dialogueText = "Hmm, tidak ada nilai estetika di sini. Tapi aku menghargai niatmu.";
                    else dialogueText = "Terima kasih. Ada inspirasi baru yang muncul dari hadiah ini.";
                }
                else if (npc.id === 'penyanyi') {
                    if (reactionType === 'love') dialogueText = "Kyaa! Ini favorit Nadia! Kamu benar-benar penggemar setia ya! 🎤💖";
                    else if (reactionType === 'hate') dialogueText = "Hmm... bukan taste Nadia sih, tapi tetap dikasih tau ya!";
                    else dialogueText = "Makasih ya! Nadia doakan kamu selalu sehat.";
                }
                else if (npc.id === 'dewi_arsa') {
                    if (reactionType === 'love') dialogueText = "Hadiah yang tulus dari hati yang bersih... Cahaya bulan memberkatimu. ✨";
                    else if (reactionType === 'hate') dialogueText = "Dewi tidak membutuhkan benda duniawi seperti ini.";
                    else dialogueText = "Terima kasih, anak muda. Semoga kebaikanmu kembali padamu.";
                }
                else if (npc.id === 'dewi_roro') {
                    if (reactionType === 'love') dialogueText = "Persembahan yang indah... Candi ini ikut merestui niatmu. 🌸";
                    else if (reactionType === 'hate') dialogueText = "Ini bukan persembahan yang tepat untuk tempat suci.";
                    else dialogueText = "Terima kasih. Roh candi ini menyambutmu.";
                }
                else if (npc.id === 'putriduyung') {
                    if (reactionType === 'love') dialogueText = "Berkilau seperti cahaya di dasar laut! Aku menyukainya... 🌊✨";
                    else if (reactionType === 'hate') dialogueText = "Hmm, di laut kami tidak mengenal benda seperti ini.";
                    else dialogueText = "Terima kasih, manusia yang baik hati.";
                }
                else if (npc.id === 'kurcaci_tani' || npc.id === 'kurcaci_farm') {
                    if (reactionType === 'love') dialogueText = "Hohoho! Ini favorit kurcaci! Badan jadi lebih kuat buat berkebun! Makasih Tuan! 🌱";
                    else if (reactionType === 'hate') dialogueText = "Hohoho... ini bukan untuk kurcaci. Tapi niat baikmu kuterima!";
                    else dialogueText = "Hohoho! Terima kasih Tuan! Kurcaci senang!";
                }
                else if (npc.id === 'peripanen' || npc.id === 'peri_farm') {
                    if (reactionType === 'love') dialogueText = "Waaah~ bunga untuk peri! Kamu sungguh pengertian! Makasih ya Tuan~ 🧚‍♀️💕";
                    else if (reactionType === 'hate') dialogueText = "Hmm~ ini kurang cocok untuk peri tipis seperti aku. Tapi makasih ya~";
                    else dialogueText = "Makasih ya~ Aku simpan di kantong ajaibku!";
                }
                else if (npc.id === 'aya_twin') {
                    if (reactionType === 'love') dialogueText = "Wah, kamu bisa baca selera Aya dengan tepat! Ini favorit Aya! 🌸";
                    else if (reactionType === 'hate') dialogueText = "Hmm, kurang cocok buat Aya sih. Tapi terima kasih ya.";
                    else dialogueText = "Makasih! Aya simpan ya.";
                }
                else if (npc.id === 'lecture') {
                    if (reactionType === 'love') dialogueText = "Wah, hadiah yang tepat dari mahasiswa yang memahami kehidupan akademik. Terima kasih! 📚";
                    else if (reactionType === 'hate') dialogueText = "Hmm, dosen tidak terlalu butuh ini. Tapi apresiasinya saya terima.";
                    else dialogueText = "Terima kasih. Semangat belajar terus ya.";
                }
                else if (npc.id === 'student1' || npc.id === 'student2') {
                    if (reactionType === 'love') dialogueText = "Wah beneran nih? Makasih banget, pas banget lagi butuh ini! 😊";
                    else if (reactionType === 'hate') dialogueText = "Eh... kurang cocok sih buat mahasiswa. Tapi makasih ya!";
                    else dialogueText = "Makasih! Aku simpan buat nanti.";
                }
                else if (npc.id === 'marine_tailor') {
                    if (reactionType === 'love') dialogueText = "Wah, kain berkualitas ini! Marine senang sekali! Cocok untuk koleksi jahitan baru. 🧵";
                    else if (reactionType === 'hate') dialogueText = "Hmm, kurang cocok untuk penjahit. Tapi terima kasih ya!";
                    else dialogueText = "Makasih! Marine simpan ya.";
                }
                else if (npc.id === 'op_warnet') {
                    if (reactionType === 'love') dialogueText = "Bro, makasih banget! Pas banget buat yang kerja malam-malam. Coklat surga nih! 🎮";
                    else if (reactionType === 'hate') dialogueText = "Hmm kurang matching sama vibe warnet. Tapi tetap makasih!";
                    else dialogueText = "Oke bro, makasih. Aku simpen.";
                }
                else if (npc.id === 'maid_warnet') {
                    if (reactionType === 'love') dialogueText = "Kyaa~ Mela suka banget ini! Kamu baik banget sih~! 💕";
                    else if (reactionType === 'hate') dialogueText = "Eh... ini agak kurang cocok buat Mela sih. Tapi makasih ya!";
                    else dialogueText = "Makasih ya~ Mela seneng dikasih hadiah~";
                }
                else if (npc.id === 'trader_outside') {
                    if (reactionType === 'love') dialogueText = "Wah, ini bisa Bu Lastri jual lagi nih! Makasih ya nak! 📦";
                    else if (reactionType === 'hate') dialogueText = "Wah, ini susah dijual. Tapi niatmu baik, makasih ya nak.";
                    else dialogueText = "Makasih! Pasti berguna untuk dagangan Bu Lastri.";
                }
                else if (npc.id === 'trader_wife_inside') {
                    if (reactionType === 'love') dialogueText = "Aduh, Bu Lastri senang sekali! Kamu baik banget nak! 🥰";
                    else if (reactionType === 'hate') dialogueText = "Hmm, kurang cocok selera Bu Lastri. Tapi makasih ya sudah mau ngasih.";
                    else dialogueText = "Makasih nak! Bu Lastri simpan ya.";
                }
                else if (npc.id === 'pemancing_misterius') {
                    if (reactionType === 'love') dialogueText = "...ini langka. Kamu tahu cara memenangkan hati pemancing. 🎣";
                    else if (reactionType === 'hate') dialogueText = "...tidak berguna di tepi sungai. Tapi terima kasih.";
                    else dialogueText = "...terima kasih.";
                }
                else if (npc.id === 'cewek_islam') {
                    if (reactionType === 'love') dialogueText = "Subhanallah, ini indah sekali! Makasih ya, kamu baik banget. Jazakallahu khairan! 🌸";
                    else if (reactionType === 'hate') dialogueText = "Hmm, kurang cocok sih. Tapi makasih ya atas niat baiknya.";
                    else dialogueText = "Makasih ya. Alhamdulillah ada rezeki hari ini.";
                }
                else if (npc.id === 'cewek_kristen') {
                    if (reactionType === 'love') dialogueText = "Oh, ini cantik sekali! Kamu tahu seleraku ya! God bless you! 🌺";
                    else if (reactionType === 'hate') dialogueText = "Hmm, kurang cocok untukku. Tapi terima kasih sudah mau ngasih.";
                    else dialogueText = "Makasih! Kamu baik sekali.";
                }
                else if (npc.id === 'swimmer_boy' || npc.id === 'swimmer_girl') {
                    if (reactionType === 'love') dialogueText = "Nice! Pas banget buat isi energi setelah renang! Makasih bro/sis! 🏊";
                    else if (reactionType === 'hate') dialogueText = "Hmm, kurang cocok buat atlet renang. Tapi makasih ya!";
                    else dialogueText = "Thanks! Aku simpen buat nanti.";
                }
                else if (npc.id === 'senior_kaia') {
                    if (reactionType === 'love') dialogueText = "Hm, selera kamu bagus! Ini memang favoritku. Kamu perhatian sekali~";
                    else if (reactionType === 'hate') dialogueText = "Ini bukan selera senior seperti aku. Tapi aku apresiasi niatnya.";
                    else dialogueText = "Lumayan. Aku simpan ya.";
                }
                else if (npc.id === 'fake_boy' || npc.id === 'fake_girl') {
                    const fRel = STATE.player.relationships[npc.id] || 0;
                    const fName = npc.id === 'fake_boy' ? 'Doni' : 'Bella';
                    if (fRel >= 100) {
                        // Fase ghosting — menolak hadiah
                        dialogueText = `*${fName} mendorong hadiahmu*\n\n"Simpan buat dirimu sendiri. Aku udah gak butuh ini."`;
                    } else if (reactionType === 'love') {
                        if (fRel >= 70) dialogueText = `"Wah~ Akhirnya kamu tau juga apa yang aku suka! 😍 Kamu memang paling mengerti aku... *menyimpan hadiah dengan bangga*"`;
                        else if (fRel >= 30) dialogueText = `"Hm, boleh juga pilihanmu. Aku suka ini. Tapi jangan GR ya, aku cuma seneng hadiahnya. Bukan karena kamu. 😏"`;
                        else dialogueText = `"Oh, ini buat aku? Wah... kamu baik juga ya. Aku suka! Makasih~ 😊"`;
                    } else if (reactionType === 'hate') {
                        if (fRel >= 70) dialogueText = `"Ih, ini apa? Murahan banget! Kalau mau kasih hadiah, yang berkelas dong! Aku bukan orang sembarangan. 😤"`;
                        else dialogueText = `"Hmm... kurang sesuai selera aku sih. Tapi ya, makasih lah."`;
                    } else {
                        dialogueText = `"Oh, ini lumayan. Aku simpen ya. *menerima dengan ekspresi datar*"`;
                    }
                }
                else if (npc.id === 'penghulu') {
                    if (reactionType === 'love') dialogueText = "MasyaAllah, hadiah yang penuh berkah. Semoga kebaikanmu dibalas berlipat ganda. Jazakallahu khairan!";
                    else if (reactionType === 'hate') dialogueText = "Terimakasih, walaupun ini kurang tepat, niat baiknya insyaAllah dicatat.";
                    else dialogueText = "Terimakasih, anak muda. Semoga berkah.";
                }
                else if (npc.id === 'child_blacksmith') {
                    if (reactionType === 'love') dialogueText = "Yeeay! Ini favorit Lina! Makasih Kak, baik banget! 🍬";
                    else if (reactionType === 'hate') dialogueText = "Hmm... Lina gak suka ini. Tapi makasih ya Kak.";
                    else dialogueText = "Makasih Kak! Lina simpan ya!";
                }
                else if (npc.id.startsWith('child_')) {
                    if (reactionType === 'love') dialogueText = "Waaah! Makasih Kak! Ini enak banget! 🍬✨";
                    else if (reactionType === 'hate') dialogueText = "Ih... gak suka. Tapi makasih ya Kak.";
                    else dialogueText = "Makasih Kak! Hehe~";
                }
                else if (npc.id === 'penjagadungeon') {
                    if (reactionType === 'love') dialogueText = "Hmm... tidak disangka ada yang mau bawa hadiah ke penjaga dungeon. Terima kasih, Petualang. Ini berguna! ⚔️";
                    else if (reactionType === 'hate') dialogueText = "Penjaga dungeon tidak butuh barang lemah seperti ini. Simpan saja untuk bekalmu.";
                    else dialogueText = "...Terima kasih. Terus tingkatkan kekuatanmu, Petualang.";
                }
                // --- NPC BIASA FALLBACK ---
                else {
                    if (reactionType === 'love') dialogueText = "Wow! Terima kasih banyak! Persis yang aku suka!";
                    else if (reactionType === 'hate') dialogueText = "Hmm, aku kurang butuh ini. Tapi makasih ya.";
                    else dialogueText = "Terima kasih. Aku simpan ya.";
                }

                showDialogue(npc.name, dialogueText, [{ text: "Sama-sama", action: closeDialogue }], npc.imgSrc);
            }

            // --- NEW: NEGOTIATION MINIGAME LOGIC ---
            let negState = {
                active: false,
                pos: 0,         // Posisi kursor (0 - 100)
                dir: 1,         // Arah (1: Kanan, -1: Kiri)
                speed: 1.5,     // Kecepatan gerak
                targetStart: 0, // Posisi awal zona hijau (0 - 100)
                targetWidth: 15, // Lebar zona hijau
                interval: null,
                callback: null, // Fungsi yang dijalankan setelah selesai (mengembalikan multiplier harga)
                type: 'buy'     // 'buy' atau 'sell'
            };

            function startNegotiation(type, difficulty, onFinish) {
                negState.active = true;
                negState.type = type;
                negState.callback = onFinish;

                // Reset Posisi
                negState.pos = 0;
                negState.dir = 1;

                // Tingkat Kesulitan (Speed & Width)
                if (difficulty === 'hard') {
                    negState.speed = 2.5;
                    negState.targetWidth = 10;
                } else {
                    negState.speed = 1.5;
                    negState.targetWidth = 20;
                }

                // Random Target Zone (Hindari pinggir banget)
                negState.targetStart = 10 + Math.random() * (80 - negState.targetWidth);

                // Update UI Visual
                const targetEl = document.getElementById('neg-target');
                targetEl.style.left = negState.targetStart + '%';
                targetEl.style.width = negState.targetWidth + '%';

                const cursorEl = document.getElementById('neg-cursor');
                cursorEl.style.left = '0%';

                // Tampilkan Overlay
                document.getElementById('negotiation-minigame').style.display = 'flex';
                STATE.screen = 'minigame';

                // Start Loop
                if (negState.interval) clearInterval(negState.interval);
                negState.interval = setInterval(negotiationLoop, 16); // ~60 FPS
            }

            function negotiationLoop() {
                if (!negState.active) return;

                // Gerakkan Kursor
                negState.pos += negState.speed * negState.dir;

                // Pantul di ujung
                if (negState.pos >= 100) {
                    negState.pos = 100;
                    negState.dir = -1;
                } else if (negState.pos <= 0) {
                    negState.pos = 0;
                    negState.dir = 1;
                }

                // Update Visual
                const cursorEl = document.getElementById('neg-cursor');
                cursorEl.style.left = negState.pos + '%';
            }

            function stopNegotiation() {
                if (!negState.active) return;

                negState.active = false;
                clearInterval(negState.interval);

                // Cek Hasil
                const hitStart = negState.pos;
                const targetStart = negState.targetStart;
                const targetEnd = negState.targetStart + negState.targetWidth;

                let isSuccess = false;
                let multiplier = 1.0;
                let msg = "";

                // Cek apakah kursor berhenti di dalam area hijau
                if (hitStart >= targetStart && hitStart <= targetEnd) {
                    isSuccess = true;
                    // Hitung seberapa tengah (Perfect Center = Bonus Lebih)
                    const centerDist = Math.abs((targetStart + negState.targetWidth / 2) - hitStart);
                    const isPerfect = centerDist < (negState.targetWidth / 4); // Sangat tengah

                    if (negState.type === 'buy') {
                        multiplier = isPerfect ? 0.7 : 0.85; // Diskon 30% atau 15%
                        msg = isPerfect ? "PERFECT! DISKON 30% 🔥" : "SUKSES! DISKON 15% ✅";
                    } else {
                        multiplier = isPerfect ? 1.3 : 1.15; // Jual Mahal 30% atau 15%
                        msg = isPerfect ? "PERFECT! HARGA JUAL +30% 🔥" : "SUKSES! HARGA JUAL +15% ✅";
                    }

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(window.innerWidth / 2, window.innerHeight / 2, '#4ade80');
                } else {
                    // GAGAL (Zona Merah)
                    if (negState.type === 'buy') {
                        multiplier = 1.1; // Harga NAIK 10% (Penjual Marah)
                        msg = "GAGAL! PENJUAL MARAH (Harga +10%) 😡";
                    } else {
                        multiplier = 0.9; // Harga Jual TURUN 10%
                        msg = "GAGAL! PEMBELI NAWAR SADIS (Harga -10%) 📉";
                    }

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                    // Efek getar
                    const box = document.querySelector('#negotiation-minigame .journal-box');
                    box.style.transform = "translateX(10px)";
                    setTimeout(() => box.style.transform = "translateX(0)", 100);
                }

                // Tampilkan Hasil Sebentar
                const descEl = document.getElementById('neg-desc');
                const oldText = descEl.innerText;
                descEl.innerHTML = `<b style="font-size:16px; color:${isSuccess ? '#4ade80' : '#ef4444'}">${msg}</b>`;

                setTimeout(() => {
                    // Tutup Minigame
                    document.getElementById('negotiation-minigame').style.display = 'none';
                    descEl.innerText = oldText; // Reset teks

                    // Eksekusi Callback dengan Multiplier baru
                    if (negState.callback) negState.callback(multiplier);

                }, 1500);
            }

            function showCommodityAction(item, price, npc) {
                const p = STATE.player;
                const owned = p.inventory[item.id] || 0;

                // Hitung Harga Awal
                const buy1 = price;
                const buy5 = price * 5;
                const sell1 = Math.floor(price * 0.8); // Harga jual dasar lebih rendah (margin)

                showDialogue(`TRANSAKSI: ${item.name}`,
                    `Harga Pasar: ${price.toLocaleString()} G \n(Normal: ${item.base.toLocaleString()} G) \n\nUangmu: ${p.money.toLocaleString()} G \nStokmu: ${owned}`,
                    [
                        { text: `Beli 1 (-${buy1.toLocaleString()})`, action: () => executeTrade(item.id, buy1, 1, 'buy', npc) },

                        // UPDATE: Beli 5 sekarang memicu Minigame Tawar Menawar
                        {
                            text: `Beli 5 (Grosir & Tawar) 🤝`, action: () => {
                                // Cek dulu apakah uang cukup untuk harga normal (syarat masuk negosiasi)
                                if (p.money >= buy5) {
                                    closeDialogue();
                                    // Mulai Minigame
                                    startNegotiation('buy', 'normal', (multiplier) => {
                                        const finalPricePerUnit = Math.floor(price * multiplier);
                                        // Panggil executeTrade dengan harga baru
                                        executeTrade(item.id, finalPricePerUnit, 5, 'buy', npc, multiplier);
                                    });
                                } else {
                                    showToast("Uang tidak cukup untuk grosir!");
                                }
                            }
                        },

                        { text: `Jual 1 (+${sell1.toLocaleString()})`, action: () => executeTrade(item.id, sell1, 1, 'sell', npc) },

                        // UPDATE: Jual Semua juga memicu Minigame jika jumlah > 1
                        {
                            text: `Jual SEMUA (Nego Harga) 🤝`, action: () => {
                                if (owned > 1) {
                                    closeDialogue();
                                    startNegotiation('sell', 'hard', (multiplier) => {
                                        const finalSellPrice = Math.floor(sell1 * multiplier);
                                        executeTrade(item.id, finalSellPrice, 'all', 'sell', npc, multiplier);
                                    });
                                } else if (owned === 1) {
                                    executeTrade(item.id, sell1, 1, 'sell', npc);
                                } else {
                                    showToast("Kamu tidak punya barang ini!");
                                }
                            }
                        },

                        { text: "Kembali", action: () => openTradingMenu(npc) }
                    ], npc.imgSrc);
            }

            function executeTrade(id, price, qty, type, npc, multiplier = 1.0) {
                const p = STATE.player;
                if (!p.inventory[id]) p.inventory[id] = 0;

                // Helper text untuk hasil negosiasi
                let negoText = "";
                if (multiplier !== 1.0) {
                    const pct = Math.round((multiplier - 1) * 100);
                    if (type === 'buy') {
                        if (pct > 0) negoText = ` (Mahal +${pct}%)`;
                        else negoText = ` (Diskon ${Math.abs(pct)}%)`;
                    } else {
                        if (pct > 0) negoText = ` (Bonus +${pct}%)`;
                        else negoText = ` (Rugi ${Math.abs(pct)}%)`;
                    }
                }

                if (type === 'buy') {
                    const cost = price * qty;
                    // Cek uang lagi untuk harga final
                    if (p.money >= cost) {
                        p.money -= cost;
                        p.inventory[id] += qty;
                        showToast(`Beli ${qty} ${id.toUpperCase()}${negoText}`);
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); // SFX Trading Beli
                    } else {
                        showToast("Uang tidak cukup (Harga Naik!)");
                    }
                } else if (type === 'sell') {
                    let amount = qty;
                    if (qty === 'all') amount = p.inventory[id];

                    if (p.inventory[id] >= amount && amount > 0) {
                        const profit = price * amount;
                        p.inventory[id] -= amount;
                        p.money += profit;
                        showToast(`Jual ${amount} ${id.toUpperCase()}${negoText}`);
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); // SFX Trading Jual
                    } else {
                        showToast("Barang tidak cukup!");
                    }
                }

                // Setelah transaksi, kembali ke menu komoditas
                // Kita cari objek komoditas dari ID untuk refresh harga asli di dialog berikutnya
                const commItem = COMMODITIES.find(c => c.id === id);
                const originalPrice = getDailyPrice(commItem.id, commItem.base, commItem.volatility);

                // Perlu delay sedikit agar toast terbaca sebelum dialog baru muncul
                setTimeout(() => {
                    showCommodityAction(commItem, originalPrice, npc);
                }, 500);
            }

            // --- FIX: MENGHAPUS FUNGSI DUPLIKAT YANG MENYEBABKAN ERROR REPUTASI ---
            // Fungsi giveGift(npc, item, value) di bawah ini telah dihapus karena menimpa logika giveGift utama.
            // Sistem sekarang akan menggunakan fungsi giveGift(npc, item) yang memiliki database likes/dislikes di atas.

            // --- NEW FUNCTION: GENERATE PLAIN TEXT MISSION LIST ---
            function getMissionBoardText() {
                const p = STATE.player;
                const role = p.role;
                const day = STATE.day;

                // Helpers Visual Teks (Tanpa HTML)
                const chk = (cond) => cond ? "✅" : "⬜";
                const prg = (cur, target, unit = '') => `(${cur}/${target}${unit})`;

                let txt = `=== PAPAN MISI (HARI KE-${day}) ===\n\n`;

                // 1. MISI UMUM
                txt += `[UMUM]\n`;
                txt += `${chk(p.energy < 100)} Gunakan Energi (Aktivitas)\n`;

                // 2. MISI ROLE
                if (role !== 'none') {
                    txt += `\n[ROLE: ${role.toUpperCase()}]\n`;
                    if (role === 'worker') {
                        // FIX: Tambahkan Misi Lamar Kerja jika menganggur
                        if (p.jobStatus === 'unemployed') {
                            txt += `${chk(false)} Pergi ke Merchant (Selatan)\n`;
                            txt += `${chk(false)} Lamar Kerja pada Bos\n`;
                        } else {
                            // UPDATE: TEXT HARI AHAD
                            const dayIndex = (day - 1) % 7;
                            if (dayIndex === 6) {
                                txt += `🚫 Libur Kerja (Hari Ahad)\n`;
                            } else {
                                txt += `${chk(p.shiftStarted)} Masuk Shift (08:00-16:00)\n`;
                            }
                            txt += `${chk(p.energy < 50)} Latihan Fisik/Kerja ${chk(p.energy < 50) === "✅" ? "(Selesai)" : "(Belum)"}\n`;
                        }
                    } else if (role === 'student') {
                        // UPDATE: TEKS MISI SAAT LIBUR
                        const dayIndex = (day - 1) % 7;
                        const isWeekend = (dayIndex === 5 || dayIndex === 6);

                        if (isWeekend) {
                            txt += `🚫 Kuliah Libur (Akhir Pekan)\n`;
                        } else {
                            // FIX: Gunakan p.lastAttendanceDay agar konsisten dengan Jurnal Quest
                            const isKuliah = p.lastAttendanceDay === day;
                            txt += `${chk(isKuliah)} Hadir Kuliah (Kampus)\n`;
                        }
                        txt += `${chk(p.energy < 70)} Belajar Mandiri\n`;
                        txt += `${chk(STATE.location === 'library_interior')} Riset di Perpustakaan\n`;
                    } else if (role === 'entrepreneur') {
                        // UPDATE: TEKS MISI WIRAUSAHA DI PAPAN
                        txt += `${chk(STATE.location === 'merchant_interior')} Pantau Harga Pasar (Merchant)\n`;
                        txt += `${chk(Object.values(p.inventory).some(v => v > 0))} Stok Komoditas Dagang\n`;
                        txt += `${chk(p.biz >= p.level * 2)} Riset Bisnis (BIZ)\n`;
                    } else if (role === 'family') {
                        txt += `${chk(p.energy < 80)} Bantu Tetangga\n`;
                        txt += `${chk(false)} Sapa 2 Orang Berbeda\n`;
                    }
                } else {
                    txt += `\n[MISI UTAMA]\n`;
                    txt += `${chk(false)} Temui Mentor Budi\n`;
                    txt += `${chk(false)} Tidur & Pilih Role\n`;
                }

                // 3. TARGET MINGGUAN SINGKAT
                const week = Math.ceil(day / 7);
                const weekLvlTarget = week * 2;
                txt += `\n[MINGGUAN - Week ${week}]\n`;
                txt += `${chk(p.level >= weekLvlTarget)} Capai Level ${weekLvlTarget}\n`;

                // Tambahkan Info Dungeon jika Winter
                if (STATE.season === 'winter') {
                    txt += `\n[MUSIM DINGIN]\n`;
                    txt += `${chk(STATE.dungeonLevel >= 2)} Eksplorasi Dungeon Lt.2\n`;
                }

                // ══════════════════════════════════════════════
                // 📜 SIDE QUEST: KISAH LELUHUR LAMONGAN
                // ══════════════════════════════════════════════
                const c1 = p.kilamong_c1 || false;
                const c2 = p.kilamong_c2 || false;
                const c3 = p.kilamong_c3 || false;
                const c4 = p.kilamong_c4 || false;
                const totalCerita = [c1,c2,c3,c4].filter(Boolean).length;
                const allCeritaDone = totalCerita === 4;

                txt += `\n[📜 KISAH LELUHUR — SIDE QUEST]\n`;
                if (allCeritaDone) {
                    txt += `✅ Semua Kisah Lamongan Selesai! (4/4)\n`;
                    txt += `${chk(!!(p.inventory && p.inventory.keris_penjaga))} Ambil Keris Penjaga dari Ki Lamong\n`;
                } else {
                    txt += `${chk(c1)} Kisah Mbah Lamong (Asal-Usul Lamongan)\n`;
                    txt += `${chk(c2)} Legenda Nelayan Brondong\n`;
                    txt += `${chk(c3)} Perjalanan Joko Tingkir\n`;
                    txt += `${chk(c4)} Tradisi Kupatan Lamongan\n`;
                    txt += `📍 Temui Ki Lamong di dekat Candi Kuno (Timur Laut)\n`;
                }

                return txt;
            }

            // ═══════════════════════════════════════════════════════════════════
            // 📜 SISTEM SIDE QUEST: KISAH LELUHUR — Fungsi Pendukung
            // ═══════════════════════════════════════════════════════════════════

            function applyFolktalePassives() {
                const p = STATE.player;
                if (p.inventory && p.inventory['keris_penjaga'] && !p.kerisPassiveApplied) {
                    p.kerisPassiveApplied = true;
                    p.str  = (p.str  || 0) + 5;
                    p.int  = (p.int  || 0) + 5;
                    p.spd  = (p.spd  || 0) + 5;
                    p.biz  = (p.biz  || 0) + 5;
                    showToast("⚔️ Keris Penjaga aktif! Semua stat +5");
                }
            }

            // ══════════════════════════════════════════════════════════════
            // 🧚‍♀️ RITUAL PEMULIHAN KAHYANGAN WILIS — Climax Quest
            // ══════════════════════════════════════════════════════════════
            function startSylvariaRitual(npc) {
                const p = STATE.player;
                closeDialogue();
                STATE.screen = 'cutscene';
                STATE.cutsceneOverride = true;

                const slides = [
                    {
                        chapter: '— Kahyangan Wilis · Ritual Pemulihan —',
                        title: 'Wektune Wis Teko',
                        sub: 'Saatnya telah tiba...',
                        narasi: 'Rara Wilis menutup matanya perlahan. Angin dari lereng Gunung Wilis berhenti. Semuanya hening. Bahkan daun-daun kenanga tidak bergerak.',
                        dur: 4500
                    },
                    {
                        chapter: '— Babak I — Lingkaran Widadari —',
                        title: 'Para Widadari Berkumpul',
                        sub: 'Wening · Sekar · Bening',
                        narasi: 'Satu per satu mereka muncul dari balik semak kenanga. Wening dengan sayap hijaunya, Sekar membawa bunga melati, Bening meninggalkan jejak air di tanah kering.',
                        dur: 5000
                    },
                    {
                        chapter: '— Babak II — Kristal Brantas —',
                        title: '💎 Energi Bumi Mengalir',
                        sub: 'Kristal Brantas melebur ke akar Pohon Beringin Agung',
                        narasi: 'Cahaya biru mengalir dari tanah — seperti urat sungai Brantas yang menembus akar-akar tua. Pohon Beringin Agung bergetar pelan.',
                        dur: 5000
                    },
                    {
                        chapter: '— Babak III — Keberanian Jiwa —',
                        title: '⚔️ Kenangan Dungeon Mengalir',
                        sub: 'Setiap pertempuran yang kamu menangkan... tersimpan di sini',
                        narasi: 'Rara Wilis menyentuh dadamu. Cahaya merah membara mengalir keluar — energi keberanian semua pertempuranmu menyatu dengan Pohon Beringin.',
                        dur: 5200
                    },
                    {
                        chapter: '— Babak IV — Cahaya Arsa —',
                        title: '✨ Kebijaksanaan Dewi Arsa',
                        sub: '"Kebaikan yang dilakukan tanpa pamrih... adalah cahaya abadi"',
                        narasi: 'Cahaya emas meledak dari pohon. Sekar menangis. Bening tertawa kecil. Wening memeluk batang pohon yang mulai menghijau.',
                        dur: 5500
                    },
                    {
                        chapter: '— Babak V — Benih Kehidupan —',
                        title: '🌱 Cintamu pada Alam Terbukti',
                        sub: 'Setiap benih yang kamu tanam... adalah doa',
                        narasi: 'Gambar ladangmu muncul di udara seperti ilusi — padi, jagung, tomat yang kamu rawat sendiri. Pohon Beringin Agung menyerapnya dengan rakus.',
                        dur: 5000
                    },
                    {
                        chapter: '— K L I M A K S —',
                        title: 'POHON BERINGIN AGUNG BANGKIT!',
                        sub: 'Kahyangan Wilis... wis urip maneh!',
                        narasi: 'Cabang-cabang hitam meledak menjadi hijau. Bunga kenanga bermekaran. Tembang Widadari terdengar dari seluruh lereng Wilis. Langit berubah jingga keemasan.',
                        dur: 6500
                    },
                    {
                        chapter: '— Epilog —',
                        title: '🌳 Kahyangan Wilis Hidup Kembali',
                        sub: '"Gunung Wilis ora bakal lali marang wong kang tresna alam."',
                        narasi: 'Rara Wilis berbalik padamu, matanya berkaca-kaca. Para Widadari menari di antara kenanga dan beringin yang kini rimbun. Untuk pertama kalinya dalam berabad-abad... Kahyangan Wilis bersinar.',
                        dur: 7000
                    },
                ];

                CinematicEngine.play('kahyangan', slides, () => {
                    STATE.screen = 'play';
                    STATE.cutsceneOverride = false;

                    p.sylvariaQuestComplete = true;
                    p.sylvariaQuest = p.sylvariaQuest || {};
                    p.sylvariaQuest.stage = 99;
                    p.str = (p.str||0)+10; p.int = (p.int||0)+10;
                    p.spd = (p.spd||0)+5;  p.biz = (p.biz||0)+5;
                    p.ethics = (p.ethics||0)+30;
                    p.reputation = (p.reputation||0)+25;
                    gainExp(1000);
                    addItem('mahkota_wilis', 1);
                    const fv = getFairyVillage();
                    fv.resources.debu    = (fv.resources.debu    || 0) + 50;
                    fv.resources.kristal = (fv.resources.kristal || 0) + 3;
                    manualSave();

                    setTimeout(() => {
                        showDialogue('SYLVA — RATU WIDADARI KAHYANGAN WILIS',
                            'Matur nuwun... seribu terima kasih.\n\n' +
                            'Selama berabad-abad aku menunggu di lereng Wilis ini. Dan kamu datang — bukan sebagai ksatria berbaju baja, tapi seseorang yang tulus mencintai alam.\n\n' +
                            '🌟 STR/INT +10 · SPD/BIZ +5 · Ethics +30 · REP +25\n' +
                            '👑 Mahkota Wilis — lambang Bhayangkara Kahyangan\n' +
                            '✨ +50 Serbuk Wilis · +3 Kristal Brantas\n\n' +
                            '"Gunung Wilis ora bakal lali marang wong kang tresna alam."',
                            [{
                                text: '🧚\u200d♀️ Kelola Kahyangan Wilis!',
                                action: () => { closeDialogue(); openFairyVillage(); }
                            }, {
                                text: 'Sampai jumpa lagi, Rara Wilis...',
                                action: closeDialogue
                            }],
                            npc ? npc.imgSrc : null
                        );
                        showToast('🌳 KAHYANGAN WILIS PULIH! Bhayangkara Wilis diakui! EXP +1000!');
                    }, 600);
                });
            }

