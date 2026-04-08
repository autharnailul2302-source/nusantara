// =================================================================
// 🔧 Debug Mode, BK Dashboard & Analitik Prediktif
// =================================================================

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

