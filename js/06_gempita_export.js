// =================================================================
// 🎉 Gempita Season & Export CSV
// =================================================================

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
