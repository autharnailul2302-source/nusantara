// ══════════════════════════════════════════════════════════════
// Dashboard BK + Analitik Prediktif + Gempita Season
// File: js/05-bk-analitik-gempita.js
// ══════════════════════════════════════════════════════════════
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


            // --- BAGIAN PENTING 2: PAKSA LANDSCAPE SAAT KLIK ---
            function startGame() {
                const elem = document.documentElement;

                // 1. Minta Fullscreen dulu (Browser butuh ini biar bisa lock orientasi)
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().then(forceLandscape).catch(err => {
                        console.log("Fullscreen ditolak, tetap lanjut main.");
                        forceLandscape(); // Tetap coba putar walau gagal fullscreen
                    });
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                    setTimeout(forceLandscape, 500);
                } else {
                    // Jika tidak support fullscreen, langsung coba putar
                    forceLandscape();
                }

                // Sembunyikan judul, tampilkan game
                document.getElementById('title-screen').style.display = 'none';
                document.getElementById('ui-layer').style.display = 'block';

                // Tampilkan canvas kembali (mungkin tersembunyi setelah logout)
                const gcCanvas = document.getElementById('gameCanvas');
                if (gcCanvas) gcCanvas.style.display = 'block';

                // Resize canvas biar pas layar
                resize();
                gameLoop();
            }

            // Fungsi Pengunci Layar (Hanya jalan di HP Android/Chrome Mobile)
            function forceLandscape() {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape')
                        .then(() => console.log("Sukses: Layar terkunci Landscape"))
                        .catch((err) => console.log("Info: Browser ini tidak mendukung kunci layar otomatis (Biasanya iPhone/Safari). Pemain harus putar HP manual."));
                }
            }

            /* UPDATE: UBAH KONSTANTA JADI VARIABEL DINAMIS AGAR RESPONSIF */
            let GAME_WIDTH = 480;
            let GAME_HEIGHT = 270;

            const TILE_SIZE = 30;
            const DEBUG_MAP_BOUNDARIES = false;

            function resize() {
                /* UPDATE: FUNGSI RESIZE DINAMIS (FULL SCREEN ADAPTIVE) */

                // Set ukuran canvas sama persis dengan ukuran jendela browser
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                // Tentukan tingkat Zoom (Scale) berdasarkan lebar layar
                // Mobile butuh zoom lebih kecil (objek terlihat lebih besar)
                // Desktop butuh zoom lebih besar (area pandang lebih luas)
                const isMobile = window.innerWidth < 1000;
                const isTablet = window.innerWidth >= 1000 && window.innerWidth < 1300;

                /* UPDATE: ZOOM OUT KAMERA SESUAI REQUEST (AREA PANDANG LEBIH LUAS) */
                // Nilai scale dikecilkan: Semakin kecil nilainya, semakin "Jauh" kameranya (Zoom Out)
                let scale = 2.2; // Desktop (Zoom Out agar lebih luas, sebelumnya 3.0)

                if (isMobile) {
                    /* REVISI: Scale Mobile diperkecil (1.5 -> 1.15) agar area vertikal terlihat lebih banyak */
                    /* Ini mengatasi masalah kasur/lemari terpotong di layar HP yang pendek */
                    scale = 1.35;
                } else if (isTablet) {
                    scale = 1.8; // Tablet (Zoom Out, sebelumnya 2.5)
                }

                // Hitung dimensi logika game berdasarkan ukuran layar & scale
                // Ini membuat game tidak gepeng, tapi menambah/mengurangi area pandang kamera
                GAME_WIDTH = canvas.width / scale;
                GAME_HEIGHT = canvas.height / scale;

                // UPDATE: Mengaktifkan smoothing agar karakter HD terlihat halus (tidak pecah/gerigi)
                // Sebelumnya 'false' (Pixel Art Mode), sekarang 'true' (HD Mode)
                ctx.imageSmoothingEnabled = true;
            }
            window.addEventListener('resize', resize);
            // FIX: Tambahkan Listener Orientasi untuk HP (Fix Gambar Hilang saat Login)
            window.addEventListener('orientationchange', () => {
                setTimeout(resize, 200); // Tunggu rotasi selesai
                setTimeout(resize, 1000); // Cek ulang
            });

            /** ASSETS GENERATION (MAP) */
            const ISLAND_W = 60;
            const ISLAND_H = 40;
            const villageTiles = new Array(ISLAND_W * ISLAND_H).fill(0);

            function fillMap(arr, w, val, x, y, rw, rh) {
                for (let i = 0; i < rh; i++) {
                    for (let j = 0; j < rw; j++) {
                        if (y + i < ISLAND_H && x + j < ISLAND_W) arr[(y + i) * w + (x + j)] = val;
                    }
                }
            }

            // Pulau (Daratan)
            fillMap(villageTiles, ISLAND_W, 1, 5, 5, 50, 30);

            // Decorate with paths (3)
            fillMap(villageTiles, ISLAND_W, 3, 28, 5, 4, 32);
            fillMap(villageTiles, ISLAND_W, 3, 5, 20, 50, 4);

            // --- UPDATE: TILE RERUNTUHAN DIPINDAH KE DEPAN CANDI (KANAN ATAS) ---
            // Hutan (Kiri) - LAMA (DIKOMENTARI/DIHAPUS)
            /*
            for(let i=0; i<4; i++) {
                fillMap(villageTiles, ISLAND_W, 5, 8, 8 + (i*5), 4, 3);
                villageTiles[(8 + (i*5) + 2) * ISLAND_W + 10] = 6; 
            }
            */

            // Area Reruntuhan Baru (Antara Candi dan Dungeon)
            // Lokasi: Sekitar x:46-54, y:11-17
            // UPDATE: Menggunakan ID 7 (Lantai Reruntuhan) bukan 5 (Tanah)
            fillMap(villageTiles, ISLAND_W, 7, 46, 11, 9, 7);

            // Tambahkan Puing-puing Magis (Tile Ungu/Kuno) secara acak di area reruntuhan
            villageTiles[12 * ISLAND_W + 48] = 6;
            villageTiles[14 * ISLAND_W + 52] = 6;
            villageTiles[13 * ISLAND_W + 47] = 6;
            villageTiles[15 * ISLAND_W + 50] = 6;
            villageTiles[12 * ISLAND_W + 53] = 6;

            // Area Akademi (x:38, y:10)
            fillMap(villageTiles, ISLAND_W, 2, 35, 6, 15, 3);
            fillMap(villageTiles, ISLAND_W, 2, 34, 9, 3, 8);
            fillMap(villageTiles, ISLAND_W, 2, 45, 9, 3, 8);
            fillMap(villageTiles, ISLAND_W, 2, 35, 7, 2, 2);
            fillMap(villageTiles, ISLAND_W, 1, 37, 9, 8, 8); // Bersihkan area akademi

            // --- UPDATE: BERSIHKAN AREA BELAKANG KAMPUS UNTUK KAIA (Hapus Pohon) ---
            fillMap(villageTiles, ISLAND_W, 1, 38, 7, 6, 2); // Area X:38-43, Y:7-8 jadi Rumput agar Kaia terlihat

            fillMap(villageTiles, ISLAND_W, 3, 36, 12, 8, 1); // Jalan setapak

            villageTiles[12 * ISLAND_W + 40] = 6;
            fillMap(villageTiles, ISLAND_W, 4, 50, 18, 5, 5);
            villageTiles[20 * ISLAND_W + 52] = 9;

            // Area Guild
            fillMap(villageTiles, ISLAND_W, 1, 40, 24, 10, 10);

            // SPAWN HOUSE DOOR
            villageTiles[10 * ISLAND_W + 18] = 8; // House Door at 18,10

            // --- NEW: LAHAN PERTANIAN DI BELAKANG RUMAH ---
            // Rumah Player ada di x:19, y:7. Kita buat lahan di atasnya (y:3 s/d y:6).
            // Menggunakan Tile ID 5 (Tanah/Earth)
            fillMap(villageTiles, ISLAND_W, 5, 17, 3, 8, 4); // Area Tanah 8x4 petak

            // Buat jalan setapak kecil menuju kebun dari samping rumah
            fillMap(villageTiles, ISLAND_W, 3, 16, 7, 3, 1); // Jalan sambung

            // SAKURA TREES
            const sakuraLocations = [
                { x: 36, y: 13 }, { x: 45, y: 13 }, { x: 13, y: 26 },
                { x: 16, y: 13 }, { x: 40, y: 28 }, { x: 23, y: 18 },
                { x: 24, y: 9 } // NEW: Sebelah Kanan Rumah Player
            ];

            sakuraLocations.forEach(loc => {
                if (loc.x < ISLAND_W && loc.y < ISLAND_H) {
                    villageTiles[loc.y * ISLAND_W + loc.x] = 12; // ID 12 = Sakura Tree
                }
            });

            // ADDED: POHON BESAR MANUAL (Sebelah Kiri Blacksmith)
            villageTiles[29 * ISLAND_W + 31] = 2; // ID 2 = Pohon Besar Biasa
            // ADDED: POHON BESAR MANUAL (Sebelah Kiri Perpustakaan)
            villageTiles[21 * ISLAND_W + 35] = 2;

            const DUNGEON_W = 40;
            const DUNGEON_H = 30;
            // PERBAIKAN: Dungeon Floor Full Lantai, Tembok hanya di pinggir batas map
            const dungeonTiles = Array(DUNGEON_W * DUNGEON_H).fill(4).map((t, i) => {
                const x = i % DUNGEON_W;
                const y = Math.floor(i / DUNGEON_W);
                // Hanya pinggiran map yang jadi tembok pembatas absolut (ID 2)
                if (x === 0 || x === DUNGEON_W - 1 || y === 0 || y === DUNGEON_H - 1) return 2;
                return 4; // Sisanya Full Lantai
            });
            // UPDATE: Menghapus tile ENTER (ID 9) manual di dungeon agar tidak double icon dengan trigger exit
            // dungeonTiles[DUNGEON_W + 2] = 9;  <-- DIHAPUS

            // GENERATE RANDOM ROCKS AS BUILDINGS (OBJECTS)
            // Agar bisa dilewati belakangnya (Z-Index sorting) dan collision di bawah
            const dungeonRocks = [];
            for (let i = 0; i < 40; i++) { // Generate 40 batu acak
                let rx = Math.floor(Math.random() * (DUNGEON_W - 4)) + 2;
                let ry = Math.floor(Math.random() * (DUNGEON_H - 4)) + 2;

                // UPDATE: Jangan spawn batu di area pintu masuk (kiri atas) yang diperluas
                // Agar spawn point player di (5,5) aman dari batu
                if (rx < 8 && ry < 8) continue;

                dungeonRocks.push({
                    id: 'rock_' + i,
                    x: rx,
                    y: ry,
                    w: 1, // Lebar 1 Tile
                    h: 1, // Tinggi 1 Tile
                    type: 'dungeon_rock', // Tipe baru
                    name: 'Batu Besar'
                });
            }

            // HOUSE MAP - DYNAMIC GENERATION HANDLED BY regenerateHouseMap()
            // Initial default map, will be overwritten by regenerateHouseMap()
            const houseTiles = new Array(12 * 10).fill(10);

            // MERCHANT INTERIOR MAP (15x12)
            const MERCH_W = 15;
            const MERCH_H = 12;
            const merchTiles = new Array(MERCH_W * MERCH_H).fill(10); // 10 = Wood
            for (let x = 0; x < MERCH_W; x++) { merchTiles[0 * MERCH_W + x] = 2; merchTiles[(MERCH_H - 1) * MERCH_W + x] = 2; } // Walls
            for (let y = 0; y < MERCH_H; y++) { merchTiles[y * MERCH_W + 0] = 2; merchTiles[y * MERCH_W + (MERCH_W - 1)] = 2; }

            // NEW: LIBRARY INTERIOR MAP (14x12)
            const LIB_W = 14;
            const LIB_H = 12;
            const libTiles = new Array(LIB_W * LIB_H).fill(10); // 10 = Wood Floor
            for (let x = 0; x < LIB_W; x++) { libTiles[0 * LIB_W + x] = 11; libTiles[(LIB_H - 1) * LIB_W + x] = 11; } // Walls (Putih/11)
            for (let y = 0; y < LIB_H; y++) { libTiles[y * LIB_W + 0] = 11; libTiles[y * LIB_W + (LIB_W - 1)] = 11; } // Side Walls
            libTiles[(LIB_H - 1) * LIB_W + 7] = 8; // Door Tile

            // NEW: GUILD INTERIOR MAP (16x14)
            const GUILD_W = 16;
            const GUILD_H = 14;
            const guildTiles = new Array(GUILD_W * GUILD_H).fill(10); // 10 = Wood/Stone Floor
            // Walls (ID 2 untuk dinding batu agar terlihat kokoh)
            for (let x = 0; x < GUILD_W; x++) { guildTiles[0 * GUILD_W + x] = 2; guildTiles[(GUILD_H - 1) * GUILD_W + x] = 2; }
            for (let y = 0; y < GUILD_H; y++) { guildTiles[y * GUILD_W + 0] = 2; guildTiles[y * GUILD_W + (GUILD_W - 1)] = 2; }
            guildTiles[(GUILD_H - 1) * GUILD_W + 8] = 8; // Door Tile

            // NEW: SCHOOL INTERIOR MAP (16x14) - RUANG KELAS
            const SCHOOL_W = 16;
            const SCHOOL_H = 14;
            const schoolTiles = new Array(SCHOOL_W * SCHOOL_H).fill(10); // 10 = Wood Floor
            // Walls (ID 11 = Putih/Tembok Kampus)
            for (let x = 0; x < SCHOOL_W; x++) { schoolTiles[0 * SCHOOL_W + x] = 11; schoolTiles[(SCHOOL_H - 1) * SCHOOL_W + x] = 11; }
            for (let y = 0; y < SCHOOL_H; y++) { schoolTiles[y * SCHOOL_W + 0] = 11; schoolTiles[y * SCHOOL_W + (SCHOOL_W - 1)] = 11; }
            schoolTiles[(SCHOOL_H - 1) * SCHOOL_W + 8] = 8; // Door Tile (Tengah Bawah)

            // --- NEW: CLINIC INTERIOR MAP (14x12) ---
            const CLINIC_W = 14;
            const CLINIC_H = 12;
            const clinicTiles = new Array(CLINIC_W * CLINIC_H).fill(10); // 10 = Floor
            // Walls (ID 11 = Putih/Bersih)
            for (let x = 0; x < CLINIC_W; x++) { clinicTiles[0 * CLINIC_W + x] = 11; clinicTiles[(CLINIC_H - 1) * CLINIC_W + x] = 11; }
            for (let y = 0; y < CLINIC_H; y++) { clinicTiles[y * CLINIC_W + 0] = 11; clinicTiles[y * CLINIC_W + (CLINIC_W - 1)] = 11; }
            clinicTiles[(CLINIC_H - 1) * CLINIC_W + 7] = 8; // Door Tile

            // NEW: BLACKSMITH INTERIOR MAP (14x12)
            const SMITH_W = 14;
            const SMITH_H = 12;
            // UPDATE: Ubah lantai dasar dari 4 (Batu) ke 10 (Kayu/Lantai) agar bisa dicustom
            const smithTiles = new Array(SMITH_W * SMITH_H).fill(10);
            // Walls (ID 2 = Tembok Batu Gelap)
            for (let x = 0; x < SMITH_W; x++) { smithTiles[0 * SMITH_W + x] = 2; smithTiles[(SMITH_H - 1) * SMITH_W + x] = 2; }
            for (let y = 0; y < SMITH_H; y++) { smithTiles[y * SMITH_W + 0] = 2; smithTiles[y * SMITH_W + (SMITH_W - 1)] = 2; }
            smithTiles[(SMITH_H - 1) * SMITH_W + 7] = 8; // Door Tile

            // --- NEW: MENTOR INTERIOR MAP (14x12) ---
            const MENTOR_W = 14;
            const MENTOR_H = 12;
            const mentorTiles = new Array(MENTOR_W * MENTOR_H).fill(10); // 10 = Wood Floor
            // Walls (UPDATE: ID 13 untuk Atas/Bawah, ID 11 untuk Samping - Samakan dengan Rumah Player)
            for (let x = 0; x < MENTOR_W; x++) { mentorTiles[0 * MENTOR_W + x] = 13; mentorTiles[(MENTOR_H - 1) * MENTOR_W + x] = 13; }
            for (let y = 0; y < MENTOR_H; y++) { mentorTiles[y * MENTOR_W + 0] = 11; mentorTiles[y * MENTOR_W + (MENTOR_W - 1)] = 11; }
            mentorTiles[(MENTOR_H - 1) * MENTOR_W + 7] = 8; // Door Tile

            // --- NEW: WEDDING INTERIOR MAP (14x14) ---
            const WEDDING_W = 14;
            const WEDDING_H = 14;
            const weddingTiles = new Array(WEDDING_W * WEDDING_H).fill(10); // 10 = Floor
            // Walls (ID 11 = Putih/Bersih/Suci)
            for (let x = 0; x < WEDDING_W; x++) { weddingTiles[0 * WEDDING_W + x] = 11; weddingTiles[(WEDDING_H - 1) * WEDDING_W + x] = 11; }
            for (let y = 0; y < WEDDING_H; y++) { weddingTiles[y * WEDDING_W + 0] = 11; weddingTiles[y * WEDDING_W + (WEDDING_W - 1)] = 11; }
            weddingTiles[(WEDDING_H - 1) * WEDDING_W + 7] = 8; // Door Tile

            // --- NEW: AYU'S HOUSE INTERIOR (14x12) ---
            const LOVER1_W = 14;
            const LOVER1_H = 12;
            const lover1Tiles = new Array(LOVER1_W * LOVER1_H).fill(10); // 10 = Wood Floor
            // Walls (ID 11 = Tembok Putih/Bersih)
            for (let x = 0; x < LOVER1_W; x++) { lover1Tiles[0 * LOVER1_W + x] = 11; lover1Tiles[(LOVER1_H - 1) * LOVER1_W + x] = 11; }
            for (let y = 0; y < LOVER1_H; y++) { lover1Tiles[y * LOVER1_W + 0] = 11; lover1Tiles[y * LOVER1_W + (LOVER1_W - 1)] = 11; }
            lover1Tiles[(LOVER1_H - 1) * LOVER1_W + 7] = 8; // Door Tile

            // --- NEW: PLAYER SHOP INTERIOR (14x12) FOR ENTREPRENEUR ---
            const PSHOP_W = 14;
            const PSHOP_H = 12;
            const pShopTiles = new Array(PSHOP_W * PSHOP_H).fill(10); // 10 = Wood Floor
            // Walls (ID 11 = Tembok Samping, ID 13 = Tembok Atas/Bawah - Sama seperti Rumah Default)
            // UPDATE: Menggunakan ID 13 untuk tembok atas/bawah agar sama dengan rumah player
            for (let x = 0; x < PSHOP_W; x++) { pShopTiles[0 * PSHOP_W + x] = 13; pShopTiles[(PSHOP_H - 1) * PSHOP_W + x] = 13; }
            for (let y = 0; y < PSHOP_H; y++) { pShopTiles[y * PSHOP_W + 0] = 11; pShopTiles[y * PSHOP_W + (PSHOP_W - 1)] = 11; }
            pShopTiles[(PSHOP_H - 1) * PSHOP_W + 7] = 8; // Door Tile

            // --- NEW: FISHERMAN HOUSE INTERIOR (12x10) ---
            const FISH_W = 12;
            const FISH_H = 10;
            const fishTiles = new Array(FISH_W * FISH_H).fill(10); // 10 = Wood Floor
            // Walls (ID 11 = Tembok)
            for (let x = 0; x < FISH_W; x++) { fishTiles[0 * FISH_W + x] = 11; fishTiles[(FISH_H - 1) * FISH_W + x] = 11; }
            for (let y = 0; y < FISH_H; y++) { fishTiles[y * FISH_W + 0] = 11; fishTiles[y * FISH_W + (FISH_W - 1)] = 11; }
            fishTiles[(FISH_H - 1) * FISH_W + 6] = 8; // Door Tile

            // --- NEW: CANDI INTERIOR MAP (16x16) ---
            const CANDI_W = 16;
            const CANDI_H = 16;
            const candiTiles = new Array(CANDI_W * CANDI_H).fill(4); // 4 = Stone Floor (Dungeon style)

            // Walls (ID 2 = Stone Wall)
            for (let x = 0; x < CANDI_W; x++) { candiTiles[0 * CANDI_W + x] = 2; candiTiles[(CANDI_H - 1) * CANDI_W + x] = 2; }
            for (let y = 0; y < CANDI_H; y++) { candiTiles[y * CANDI_W + 0] = 2; candiTiles[y * CANDI_W + (CANDI_W - 1)] = 2; }

            // Pathway / Karpet Merah/Ungu (Magic Floor ID 6) leading to Altar
            for (let y = 3; y < CANDI_H - 1; y++) {
                candiTiles[y * CANDI_W + 7] = 6;
                candiTiles[y * CANDI_W + 8] = 6; // UPDATE: Dikembalikan jadi 2 kolom (Lebih Lebar)
            }
            // Door Tile (Tengah Bawah) - Disesuaikan agar simetris dengan karpet
            candiTiles[(CANDI_H - 1) * CANDI_W + 7] = 8;
            candiTiles[(CANDI_H - 1) * CANDI_W + 8] = 8;

            // --- UPDATE: MAP RERUNTUHAN YANG LEBIH DETAIL ---
            const RUINS_W = 22;
            const RUINS_H = 16;
            // Campuran Tanah (5) dan Lantai Batu Dungeon (4) untuk kesan reruntuhan
            // UPDATE: Base tile menggunakan ID 7 (Lantai Reruntuhan)
            const ruinsTiles = new Array(RUINS_W * RUINS_H).fill(7);

            // Buat pola reruntuhan (Lantai batu pecah-pecah di tengah)
            for (let y = 2; y < RUINS_H - 2; y++) {
                for (let x = 2; x < RUINS_W - 2; x++) {
                    // 70% kemungkinan jadi lantai batu kuno, sisanya tanah/rumput
                    if (Math.random() > 0.3) ruinsTiles[y * RUINS_W + x] = 4; // 4 = Stone
                }
            }

            // Tambahkan Tembok Pembatas Hutan (ID 2)
            for (let x = 0; x < RUINS_W; x++) { ruinsTiles[0 * RUINS_W + x] = 2; ruinsTiles[(RUINS_H - 1) * RUINS_W + x] = 2; }
            for (let y = 0; y < RUINS_H; y++) { ruinsTiles[y * RUINS_W + 0] = 2; ruinsTiles[y * RUINS_W + (RUINS_W - 1)] = 2; }

            // ══════════════════════════════════════════════════════════════════
