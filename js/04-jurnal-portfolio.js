// ══════════════════════════════════════════════════════════════
// Jurnal Siswa + Portofolio Guru
// File: js/04-jurnal-portfolio.js
// ══════════════════════════════════════════════════════════════
            // FASE 1 — JURNAL SISWA LENGKAP + FILTER KELAS + RUBRIK PENILAIAN
            // =====================================================================

            // Simpan nilai guru sementara (key: "email_dayIndex")
            const _journalRatings = {}; // cache lokal sebelum disimpan ke Firebase

            function resetJurnalFilter() {
                ['filter-kelas','filter-mentor','filter-siswa'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                ['filter-role','filter-rated'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                renderReflections();
            }

            // Simpan rating guru ke Firebase (path: users/{email}/journalRatings/{dayKey})
            async function saveJournalRating(studentEmail, dayKey, ratings, catatan) {
                const ratingData = { ...ratings, catatan, updatedAt: new Date().toISOString() };
                // Simpan ke cache lokal
                _journalRatings[`${studentEmail}_${dayKey}`] = ratingData;
                // Simpan ke Firebase jika online
                if (typeof db !== 'undefined' && DataService.mode === 'firebase') {
                    try {
                        await db.collection('artifacts').doc('nusantara-arsa')
                            .collection('users').doc(studentEmail)
                            .set({ journalRatings: { [dayKey]: ratingData } }, { merge: true });
                    } catch(e) {
                        console.warn('Gagal simpan rating ke Firebase:', e);
                    }
                }
                // Update cache latestStudentData
                const s = (latestStudentData||[]).find(x => x.email === studentEmail);
                if (s) {
                    if (!s.journalRatings) s.journalRatings = {};
                    s.journalRatings[dayKey] = ratingData;
                }
                // Re-render
                renderReflections();
            }

            // Render bintang interaktif
            function renderStarInput(studentEmail, dayKey, aspect, currentVal, labelColor) {
                let html = `<div style="display:inline-flex; gap:2px; align-items:center;">`;
                for (let i = 1; i <= 5; i++) {
                    const filled = i <= currentVal;
                    html += `<span
                        onclick="setStarRating('${studentEmail}','${dayKey}','${aspect}',${i})"
                        style="font-size:16px; cursor:pointer; color:${filled ? '#f59e0b' : '#d1d5db'}; transition:color 0.1s;"
                        onmouseover="hoverStars('${studentEmail}','${dayKey}','${aspect}',${i})"
                        onmouseout="unhoverStars('${studentEmail}','${dayKey}','${aspect}')"
                        data-star="${studentEmail}|${dayKey}|${aspect}|${i}">★</span>`;
                }
                html += `</div>`;
                return html;
            }

            function hoverStars(email, dayKey, aspect, upTo) {
                for (let i = 1; i <= 5; i++) {
                    const el = document.querySelector(`[data-star="${email}|${dayKey}|${aspect}|${i}"]`);
                    if (el) el.style.color = i <= upTo ? '#fbbf24' : '#d1d5db';
                }
            }
            function unhoverStars(email, dayKey, aspect) {
                const key = `${email}_${dayKey}`;
                const saved = _journalRatings[key] || {};
                const val = saved[aspect] || 0;
                for (let i = 1; i <= 5; i++) {
                    const el = document.querySelector(`[data-star="${email}|${dayKey}|${aspect}|${i}"]`);
                    if (el) el.style.color = i <= val ? '#f59e0b' : '#d1d5db';
                }
            }
            function setStarRating(email, dayKey, aspect, val) {
                const key = `${email}_${dayKey}`;
                if (!_journalRatings[key]) _journalRatings[key] = {};
                _journalRatings[key][aspect] = val;
                // Update tampilan bintang langsung tanpa re-render full
                for (let i = 1; i <= 5; i++) {
                    const el = document.querySelector(`[data-star="${email}|${dayKey}|${aspect}|${i}"]`);
                    if (el) el.style.color = i <= val ? '#f59e0b' : '#d1d5db';
                }
                // Update total badge
                const totalEl = document.getElementById(`rating-total-${email}-${dayKey}`);
                if (totalEl) {
                    const r = _journalRatings[key];
                    const aspects = ['konsistensi','refleksi','kreativitas','relevansi','kedalaman'];
                    const filled = aspects.filter(a => (r[a]||0) > 0).length;
                    const avg = filled > 0 ? (aspects.reduce((s,a) => s+(r[a]||0),0)/filled).toFixed(1) : '-';
                    totalEl.textContent = `Rata-rata: ${avg}/5`;
                }
            }

            function submitJournalRating(btn) {
                const email    = btn.dataset.email;
                const dayKey   = btn.dataset.daykey;
                const cacheKey = btn.dataset.cachekey;
                const r = _journalRatings[cacheKey] || {};
                const catatan = document.getElementById(`catatan-${email}-${dayKey}`)?.value || '';
                const aspects = ['konsistensi','refleksi','kreativitas','relevansi','kedalaman'];
                const allFilled = aspects.every(k => (r[k]||0) > 0);
                if (!allFilled) {
                    alert('Harap isi semua 5 aspek penilaian terlebih dahulu (klik bintang ⭐).');
                    return;
                }
                btn.textContent = '⏳ Menyimpan...';
                btn.disabled = true;
                saveJournalRating(email, dayKey, r, catatan).then(() => {
                    btn.textContent = '✅ Tersimpan!';
                    btn.style.background = '#10b981';
                    setTimeout(() => {
                        btn.textContent = '💾 Simpan Penilaian Jurnal Ini';
                        btn.style.background = '#1e3a5f';
                        btn.disabled = false;
                    }, 2000);
                }).catch(() => {
                    btn.textContent = '❌ Gagal Simpan';
                    btn.style.background = '#ef4444';
                    btn.disabled = false;
                });
            }

            // UPDATE: SYNC REFLECTIONS (FASE 1 LENGKAP)
            function renderReflections() {
                const allStudents = latestStudentData || [];
                const container = document.getElementById('reflections-container');
                if (!container) return;
                container.innerHTML = '';

                // Ambil nilai filter
                const fKelas   = (document.getElementById('filter-kelas')?.value || '').toLowerCase().trim();
                const fRole    = document.getElementById('filter-role')?.value || '';
                const fMentor  = (document.getElementById('filter-mentor')?.value || '').toLowerCase().trim();
                const fSiswa   = (document.getElementById('filter-siswa')?.value || '').toLowerCase().trim();
                const fRated   = document.getElementById('filter-rated')?.value || '';

                const roleLabels = { worker:'⚔️ Pekerja', student:'🎓 Akademisi', entrepreneur:'💼 Wirausaha', family:'🏠 Keluarga', none:'❓ Belum Pilih' };
                const roleColor  = { worker:'#3b82f6', student:'#8b5cf6', entrepreneur:'#10b981', family:'#ec4899', none:'#94a3b8' };
                const aspectLabels = [
                    { key:'konsistensi', label:'Konsistensi',  desc:'Menulis jurnal setiap hari' },
                    { key:'refleksi',    label:'Refleksi',     desc:'Kedalaman introspeksi diri' },
                    { key:'kreativitas', label:'Kreativitas',  desc:'Orisinalitas ekspresi' },
                    { key:'relevansi',   label:'Relevansi',    desc:'Kesesuaian dengan pertanyaan' },
                    { key:'kedalaman',   label:'Kedalaman',    desc:'Panjang & substansi jawaban' }
                ];

                let totalSiswa = 0, totalJurnal = 0, sudahDinilai = 0, belumDinilai = 0;

                // Filter siswa
                const filtered = allStudents.filter(s => {
                    const sd = s.saveData || {};
                    const refs = Array.isArray(sd.reflections) ? sd.reflections : (Array.isArray(s.reflections) ? s.reflections : []);
                    if (refs.length === 0) return false;

                    const sName    = (s.name || '').toLowerCase();
                    const sDetails = (s.details || sd.details || '').toLowerCase();
                    const sMentor  = (s.mentor || sd.mentor || '').toLowerCase();
                    const sRole    = sd.role || 'none';

                    if (fKelas  && !sDetails.includes(fKelas))  return false;
                    if (fMentor && !sMentor.includes(fMentor))  return false;
                    if (fSiswa  && !sName.includes(fSiswa))     return false;
                    if (fRole   && sRole !== fRole)              return false;

                    if (fRated) {
                        const hasAnyRating = refs.some((r,i) => {
                            const k = `${s.email}_day${r.day||i}`;
                            const saved = _journalRatings[k] || (s.journalRatings && s.journalRatings[`day${r.day||i}`]);
                            return saved && Object.values(saved).some(v => typeof v==='number' && v > 0);
                        });
                        if (fRated === 'rated'   && !hasAnyRating) return false;
                        if (fRated === 'unrated' && hasAnyRating)  return false;
                    }
                    return true;
                });

                // Hitung ringkasan
                filtered.forEach(s => {
                    const sd = s.saveData || {};
                    const refs = Array.isArray(sd.reflections) ? sd.reflections : (Array.isArray(s.reflections) ? s.reflections : []);
                    totalSiswa++;
                    totalJurnal += refs.length;
                    const hasRating = refs.some((r,i) => {
                        const k = `${s.email}_day${r.day||i}`;
                        const saved = _journalRatings[k] || (s.journalRatings && s.journalRatings[`day${r.day||i}`]);
                        return saved && Object.values(saved).some(v => typeof v==='number' && v > 0);
                    });
                    if (hasRating) sudahDinilai++; else belumDinilai++;
                });

                // Render ringkasan
                const summaryEl = document.getElementById('journal-summary');
                const badgeEl   = document.getElementById('journal-count-badge');
                if (badgeEl) badgeEl.textContent = `${totalSiswa} siswa · ${totalJurnal} jurnal`;
                if (summaryEl) {
                    const cards = [
                        { icon:'👥', val: totalSiswa,   label:'Siswa Punya Jurnal', color:'#3b82f6', bg:'#eff6ff' },
                        { icon:'📝', val: totalJurnal,  label:'Total Entri Jurnal',  color:'#8b5cf6', bg:'#f5f3ff' },
                        { icon:'✅', val: sudahDinilai, label:'Sudah Dinilai',       color:'#10b981', bg:'#ecfdf5' },
                        { icon:'⏳', val: belumDinilai, label:'Belum Dinilai',       color:'#f59e0b', bg:'#fffbeb' },
                    ];
                    summaryEl.innerHTML = cards.map(c => `
                        <div style="background:${c.bg}; border-radius:10px; padding:14px 16px; border:1px solid ${c.color}33; text-align:center;">
                            <div style="font-size:22px;">${c.icon}</div>
                            <div style="font-size:22px; font-weight:800; color:${c.color}; line-height:1.2;">${c.val}</div>
                            <div style="font-size:10.5px; color:#64748b; margin-top:2px;">${c.label}</div>
                        </div>`).join('');
                }

                if (filtered.length === 0) {
                    container.innerHTML = `<div style="text-align:center; padding:50px; color:#cbd5e1;">
                        <div style="font-size:48px; margin-bottom:10px;">📭</div>
                        <p>Tidak ada jurnal yang cocok dengan filter.</p>
                        <p style="font-size:12px;">Total Siswa Terhubung: <strong>${allStudents.length}</strong></p>
                        <small>Coba ubah atau reset filter di atas.</small>
                    </div>`;
                    return;
                }

                // Render kartu per siswa
                filtered.forEach(s => {
                    const sd       = s.saveData || {};
                    const refs     = Array.isArray(sd.reflections) ? sd.reflections : (Array.isArray(s.reflections) ? s.reflections : []);
                    const sName    = s.name || sd.name || 'Tanpa Nama';
                    const sDetails = s.details || sd.details || '-';
                    const sMentor  = s.mentor || sd.mentor || '-';
                    const sRole    = sd.role || 'none';
                    const sEmail   = s.email || '';
                    const rColor   = roleColor[sRole] || '#94a3b8';
                    const rLabel   = roleLabels[sRole] || sRole;

                    // Hitung rata-rata nilai semua jurnal siswa ini
                    let allAvg = [];
                    refs.forEach((r, i) => {
                        const dayKey = `day${r.day||i}`;
                        const saved  = _journalRatings[`${sEmail}_${dayKey}`] || (s.journalRatings && s.journalRatings[dayKey]) || {};
                        aspectLabels.forEach(a => { if (saved[a.key] > 0) allAvg.push(saved[a.key]); });
                    });
                    const overallAvg = allAvg.length > 0 ? (allAvg.reduce((a,b)=>a+b,0)/allAvg.length).toFixed(1) : null;

                    const card = document.createElement('div');
                    card.className = 'dash-card';
                    card.style.marginBottom = '16px';

                    // ---- HEADER KARTU SISWA ----
                    let html = `
                    <div style="border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                        <div>
                            <h4 style="color:var(--primary); margin:0 0 4px 0; font-size:15px;">${sName}</h4>
                            <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; font-size:11px; color:#64748b;">
                                <span>🏫 ${sDetails}</span>
                                <span>👤 Mentor: ${sMentor}</span>
                                <span style="background:${rColor}22; color:${rColor}; padding:1px 8px; border-radius:20px; font-size:10px; font-weight:700;">${rLabel}</span>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <span class="status-badge" style="background:#eff6ff; color:#1d4ed8; font-size:12px;">${refs.length} Jurnal</span>
                            ${overallAvg ? `<div style="margin-top:4px; font-size:11px; color:#f59e0b; font-weight:700;">⭐ Nilai Rata-rata: ${overallAvg}/5</div>` : '<div style="margin-top:4px; font-size:10px; color:#94a3b8;">Belum ada penilaian</div>'}
                        </div>
                    </div>
                    <div style="max-height:600px; overflow-y:auto; padding-right:4px;">`;

                    // ---- RENDER TIAP ENTRI JURNAL ----
                    [...refs].reverse().forEach((r, idx) => {
                        const actualIdx = refs.length - 1 - idx;
                        const dayKey    = `day${r.day || actualIdx}`;
                        const cacheKey  = `${sEmail}_${dayKey}`;
                        // Load existing rating ke cache jika belum ada
                        if (!_journalRatings[cacheKey] && s.journalRatings && s.journalRatings[dayKey]) {
                            _journalRatings[cacheKey] = s.journalRatings[dayKey];
                        }
                        const saved = _journalRatings[cacheKey] || {};

                        let timeStr = '-';
                        if (r.date) {
                            try { timeStr = new Date(r.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
                            catch(e) { timeStr = r.date; }
                        }

                        const entryRole   = r.role || sRole;
                        const entryColor  = roleColor[entryRole] || rColor;
                        const entryLabel  = roleLabels[entryRole] || entryRole;
                        const rQuestion   = r.question
                            ? `<div style="font-size:11px; color:#475569; font-style:italic; margin:8px 0 6px 0; padding:6px 10px; background:#f1f5f9; border-left:3px solid ${entryColor}; border-radius:0 4px 4px 0;">❓ ${r.question}</div>`
                            : '';

                        // Hitung isi jawaban (panjang karakter sebagai proxy kedalaman)
                        const textLen = (r.text || '').length;
                        const depthColor = textLen > 200 ? '#10b981' : textLen > 80 ? '#f59e0b' : '#ef4444';
                        const depthLabel = textLen > 200 ? 'Mendalam' : textLen > 80 ? 'Cukup' : 'Singkat';

                        // Hitung rata-rata entri ini
                        const entryVals = aspectLabels.map(a => saved[a.key]||0).filter(v=>v>0);
                        const entryAvg  = entryVals.length > 0 ? (entryVals.reduce((a,b)=>a+b,0)/entryVals.length).toFixed(1) : null;
                        const isFullyRated = aspectLabels.every(a => (saved[a.key]||0) > 0);

                        html += `
                        <div style="border:1px solid #e2e8f0; border-radius:10px; margin-bottom:14px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                            <!-- Meta bar -->
                            <div style="background:${entryColor}11; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; border-bottom:1px solid ${entryColor}33;">
                                <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                                    <span style="font-weight:700; color:${entryColor}; font-size:12px;">🗓️ Game Day ${r.day || (actualIdx+1)}</span>
                                    <span style="background:${entryColor}22; color:${entryColor}; padding:1px 7px; border-radius:20px; font-size:10px;">${entryLabel}</span>
                                    <span style="font-size:10px; color:#64748b;">🕒 ${timeStr}</span>
                                    <span style="font-size:10px; background:${depthColor}22; color:${depthColor}; padding:1px 7px; border-radius:20px;">${depthLabel} (${textLen} karakter)</span>
                                </div>
                                <span id="rating-total-${sEmail}-${dayKey}" style="font-size:11px; font-weight:700; color:${isFullyRated?'#10b981':'#94a3b8'};">
                                    ${entryAvg ? `⭐ Rata-rata: ${entryAvg}/5` : (isFullyRated ? '✅ Dinilai' : '⏳ Belum Dinilai')}
                                </span>
                            </div>

                            <!-- Isi Jurnal -->
                            <div style="padding:12px 14px;">
                                ${rQuestion}
                                <p style="margin:0 0 12px 0; font-style:italic; color:#334155; font-family:'Exo 2'; line-height:1.7; white-space:pre-wrap; font-size:12.5px; background:#fafafa; padding:10px 12px; border-radius:6px;">"${r.text || ''}"</p>

                                <!-- RUBRIK PENILAIAN GURU -->
                                <details style="margin-top:4px;">
                                    <summary style="cursor:pointer; font-size:11.5px; font-weight:700; color:#1e3a5f; padding:6px 0; user-select:none;">
                                        📋 Rubrik Penilaian Guru ${isFullyRated ? '<span style="color:#10b981; margin-left:6px;">✅ Sudah Dinilai</span>' : '<span style="color:#f59e0b; margin-left:6px;">⏳ Klik untuk menilai</span>'}
                                    </summary>
                                    <div style="margin-top:10px; padding:12px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                                            ${aspectLabels.map(a => `
                                            <div style="background:#fff; padding:10px 12px; border-radius:8px; border:1px solid #e2e8f0;">
                                                <div style="font-size:11px; font-weight:700; color:#1e3a5f; margin-bottom:2px;">${a.label}</div>
                                                <div style="font-size:10px; color:#94a3b8; margin-bottom:6px;">${a.desc}</div>
                                                ${renderStarInput(sEmail, dayKey, a.key, saved[a.key]||0, entryColor)}
                                            </div>`).join('')}
                                        </div>
                                        <!-- Catatan Guru -->
                                        <div style="margin-bottom:10px;">
                                            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">💬 Catatan / Umpan Balik Guru</label>
                                            <textarea id="catatan-${sEmail}-${dayKey}"
                                                style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; resize:vertical; min-height:60px; box-sizing:border-box; font-family:'Exo 2';"
                                                placeholder="Tulis catatan atau umpan balik untuk siswa ini..."
                                            >${saved.catatan||''}</textarea>
                                        </div>
                                        <!-- Tombol Simpan -->
                                        <button onclick="submitJournalRating(this)"
                                            data-email="${sEmail}"
                                            data-daykey="${dayKey}"
                                            data-cachekey="${cacheKey}"
                                            style="background:#1e3a5f; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-size:12px; cursor:pointer; font-weight:700; width:100%;">
                                            💾 Simpan Penilaian Jurnal Ini
                                        </button>
                                    </div>
                                </details>
                            </div>
                        </div>`;
                    });

                    html += `</div>`; // tutup scroll area
                    card.innerHTML = html;
                    container.appendChild(card);
                });
            }

            // =====================================================================
            // FASE 2 — RENDER PORTOFOLIO DI DASHBOARD GURU
            // =====================================================================

            function resetPortfolioFilter() {
                ['pf-filter-siswa','pf-filter-kelas'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
                ['pf-filter-format','pf-filter-target'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
                renderPortfolio();
            }

            // Simpan catatan guru untuk karya portofolio ke Firebase
            async function savePortfolioNote(studentEmail, karya_id, note) {
                // Update local cache
                const s = (latestStudentData||[]).find(x => x.email === studentEmail);
                if (s && s.saveData && s.saveData.portfolioItems) {
                    const item = s.saveData.portfolioItems.find(i => i.id === karya_id);
                    if (item) item.teacherNote = note;
                }
                // Persist ke Firebase
                if (typeof db !== 'undefined' && DataService.mode === 'firebase') {
                    try {
                        const docRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail);
                        const snap = await docRef.get();
                        if (snap.exists) {
                            const data = snap.data();
                            const saveData = data.saveData || {};
                            const items = (saveData.portfolioItems || []).map(i =>
                                i.id === karya_id ? { ...i, teacherNote: note } : i
                            );
                            await docRef.update({ 'saveData.portfolioItems': items });
                        }
                    } catch(e) { console.warn('Gagal simpan catatan portofolio:', e); }
                }
            }

            function renderPortfolio() {
                const allStudents = latestStudentData || [];
                const container   = document.getElementById('portfolio-container');
                if (!container) return;
                container.innerHTML = '';

                const fSiswa  = (document.getElementById('pf-filter-siswa')?.value || '').toLowerCase().trim();
                const fFormat = document.getElementById('pf-filter-format')?.value || '';
                const fTarget = document.getElementById('pf-filter-target')?.value || '';
                const fKelas  = (document.getElementById('pf-filter-kelas')?.value || '').toLowerCase().trim();

                const formatColors = { video:'#3b82f6', poster:'#10b981', game:'#8b5cf6', kuis:'#f59e0b', modul:'#64748b' };
                const targetColors = { kelas:'#0ea5e9', dosen:'#6366f1', lomba:'#f59e0b', online:'#10b981' };

                let totalKarya = 0, totalAP = 0, karyaLomba = 0;
                let allStudentCards = [];

                allStudents.forEach(s => {
                    const sd     = s.saveData || {};
                    const items  = sd.portfolioItems || [];
                    if (items.length === 0) return;

                    const sName   = s.name || sd.name || 'Tanpa Nama';
                    const sDetails = s.details || sd.details || '-';
                    const sEmail  = s.email || '';
                    if (fSiswa && !sName.toLowerCase().includes(fSiswa)) return;
                    if (fKelas && !sDetails.toLowerCase().includes(fKelas)) return;

                    // Filter items
                    const filtered = items.filter(i => {
                        if (fFormat && i.formatId !== fFormat) return false;
                        if (fTarget && i.targetId !== fTarget) return false;
                        return true;
                    });
                    if (filtered.length === 0) return;

                    filtered.forEach(i => {
                        totalKarya++;
                        totalAP += i.apEarned || 0;
                        if (i.targetId === 'lomba') karyaLomba++;
                    });

                    const studentAP = filtered.reduce((a, i) => a + (i.apEarned||0), 0);

                    let cardHtml = `
                    <div class="dash-card" style="margin-bottom:16px;">
                        <div style="border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                            <div>
                                <h4 style="color:var(--primary); margin:0 0 3px 0;">${sName}</h4>
                                <span style="font-size:11px; color:#64748b;">🏫 ${sDetails}</span>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:12px; font-weight:700; color:#8b5cf6;">🏅 ${studentAP} AP</div>
                                <div style="font-size:11px; color:#64748b;">${filtered.length} karya</div>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">`;

                    filtered.slice().reverse().forEach(item => {
                        const fColor = formatColors[item.formatId] || '#64748b';
                        const tColor = targetColors[item.targetId] || '#64748b';
                        const hasNote = item.teacherNote && item.teacherNote.trim().length > 0;
                        const noteId = `pf-note-${sEmail.replace(/[^a-z0-9]/gi,'_')}-${item.id}`;

                        cardHtml += `
                        <div style="border:1px solid #e2e8f0; border-radius:10px; padding:12px; background:#fafafa; position:relative;">
                            <!-- Badges -->
                            <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px;">
                                <span style="background:${fColor}22; color:${fColor}; font-size:10px; padding:2px 8px; border-radius:20px; font-weight:700;">${item.formatEmoji} ${item.formatLabel}</span>
                                <span style="background:${tColor}22; color:${tColor}; font-size:10px; padding:2px 8px; border-radius:20px;">${item.targetLabel}</span>
                                ${item.targetId==='lomba' ? '<span style="background:#fef9c3; color:#854d0e; font-size:10px; padding:2px 8px; border-radius:20px;">🏆 Lomba</span>' : ''}
                            </div>
                            <!-- Konten -->
                            <div style="font-size:13px; font-weight:700; color:#1e3a5f; margin-bottom:4px;">${item.topicEmoji} ${item.topicLabel}</div>
                            <div style="font-size:10.5px; color:#64748b; margin-bottom:8px;">📅 Game Day ${item.day} &nbsp;·&nbsp; 🏅 +${item.apEarned} AP &nbsp;·&nbsp; 🧠 INT +${item.intEarned}</div>
                            <!-- Catatan Guru -->
                            <div style="margin-top:8px; padding-top:8px; border-top:1px solid #e2e8f0;">
                                <label style="font-size:10.5px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">💬 Catatan Guru:</label>
                                <textarea id="${noteId}"
                                    style="width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; resize:vertical; min-height:45px; box-sizing:border-box; background:${hasNote?'#f0fdf4':'#fff'};"
                                    placeholder="Tulis catatan atau apresiasi..."
                                >${item.teacherNote||''}</textarea>
                                <button onclick="(function(btn){
                                    const note = document.getElementById('${noteId}')?.value || '';
                                    btn.textContent = '⏳';
                                    savePortfolioNote('${sEmail}','${item.id}', note).then(()=>{
                                        btn.textContent = '✅ Tersimpan';
                                        btn.style.background = '#10b981';
                                        document.getElementById('${noteId}').style.background = '#f0fdf4';
                                        setTimeout(()=>{ btn.textContent='💾 Simpan'; btn.style.background='#1e3a5f'; }, 2000);
                                    });
                                })(this)"
                                style="margin-top:5px; background:#1e3a5f; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:11px; cursor:pointer; width:100%;">
                                    💾 Simpan Catatan
                                </button>
                            </div>
                        </div>`;
                    });

                    cardHtml += `</div></div>`;
                    allStudentCards.push(cardHtml);
                });

                // Ringkasan
                const summaryEl = document.getElementById('portfolio-summary');
                const badgeEl   = document.getElementById('portfolio-count-badge');
                if (badgeEl) badgeEl.textContent = `${allStudentCards.length} siswa · ${totalKarya} karya`;
                if (summaryEl) {
                    summaryEl.innerHTML = [
                        { icon:'🎨', val:totalKarya,      label:'Total Karya',     color:'#8b5cf6', bg:'#f5f3ff' },
                        { icon:'🏅', val:totalAP,         label:'Total AP Kelas',  color:'#f59e0b', bg:'#fffbeb' },
                        { icon:'🏆', val:karyaLomba,      label:'Karya Lomba',     color:'#ef4444', bg:'#fef2f2' },
                        { icon:'👩‍🎨', val:allStudentCards.length, label:'Siswa Berkarya', color:'#10b981', bg:'#ecfdf5' },
                    ].map(c => `
                        <div style="background:${c.bg}; border-radius:10px; padding:14px 16px; border:1px solid ${c.color}33; text-align:center;">
                            <div style="font-size:22px;">${c.icon}</div>
                            <div style="font-size:22px; font-weight:800; color:${c.color}; line-height:1.2;">${c.val}</div>
                            <div style="font-size:10.5px; color:#64748b; margin-top:2px;">${c.label}</div>
                        </div>`).join('');
                }

                if (allStudentCards.length === 0) {
                    container.innerHTML = `<div style="text-align:center; padding:50px; color:#cbd5e1;">
                        <div style="font-size:48px; margin-bottom:10px;">🎨</div>
                        <p>Belum ada karya media pembelajaran yang dibuat.</p>
                        <small>Siswa perlu masuk ke Kampus → Bangku Kampus → "Buat Media Pembelajaran"</small>
                    </div>`;
                    return;
                }

                container.innerHTML = allStudentCards.join('');
            }

            // NEW: FUNCTION RENDER VALIDATION / COMPETENCY
            function renderValidation() { // Hapus async
                const students = latestStudentData; // Gunakan Cache
                const tbody = document.getElementById('validation-body');
                tbody.innerHTML = '';

                if (students.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada data siswa.</td></tr>';
                    return;
                }

                students.forEach(s => {
                    const sd = s.saveData || {};

                    // 1. ANALISIS DECISION MAKING (ROLE)
                    let roleScore = 0;
                    let roleText = "Belum Memilih";
                    let roleColor = "#94a3b8"; // Abu-abu

                    if (sd.role && sd.role !== 'none') {
                        roleScore = 100;
                        roleText = sd.role.toUpperCase();

                        // Warna berdasarkan role
                        if (sd.role === 'worker') roleColor = "#ef4444"; // Merah
                        else if (sd.role === 'student') roleColor = "#3b82f6"; // Biru
                        else if (sd.role === 'entrepreneur') roleColor = "#10b981"; // Hijau
                        else if (sd.role === 'family') roleColor = "#d946ef"; // Pink
                    }

                    // 2. ANALISIS FINANCIAL LITERACY
                    // Baseline: 10.000G (Modal Awal)
                    // Target: 50.000G (Bagus), 100.000G (Sangat Bagus)
                    const money = sd.money || 0;
                    let moneyScore = 0;
                    if (money >= 100000) moneyScore = 100;
                    else if (money >= 50000) moneyScore = 85;
                    else if (money >= 20000) moneyScore = 70;
                    else if (money >= 10000) moneyScore = 60; // Standar
                    else moneyScore = 40; // Defisit (Boros)

                    // 3. ANALISIS SKILL DEVELOPMENT
                    // Target Trial: Stat Utama mencapai 50
                    let skillVal = 0;
                    let skillName = "-";

                    if (sd.role === 'worker') { skillVal = sd.str || 0; skillName = "STR"; }
                    else if (sd.role === 'student') { skillVal = sd.int || 0; skillName = "INT"; }
                    else if (sd.role === 'entrepreneur') { skillVal = sd.biz || 0; skillName = "BIZ"; }
                    else if (sd.role === 'family') { skillVal = sd.reputation || 0; skillName = "REP"; }

                    // Hitung persentase skill terhadap target (50)
                    let skillScore = Math.min(100, Math.floor((skillVal / 50) * 100));

                    // Rata-rata Skor Kompetensi
                    const totalScore = Math.floor((roleScore + moneyScore + skillScore) / 3);

                    // Tentukan Grade Warna
                    let scoreColor = "#ef4444"; // Merah (Kurang)
                    if (totalScore >= 80) scoreColor = "#10b981"; // Hijau (Baik)
                    else if (totalScore >= 60) scoreColor = "#f59e0b"; // Kuning (Cukup)

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>
                <strong>${s.name}</strong><br>
                <span style="font-size:10px; color:#64748b;">${s.details}</span>
            </td>
            <td>
                <span style="font-size:11px; font-weight:bold; color:${roleColor}; border:1px solid ${roleColor}; padding:2px 6px; border-radius:4px;">${roleText}</span>
                <div style="font-size:10px; margin-top:2px;">Konsistensi: ${roleScore}%</div>
            </td>
            <td>
                <div style="font-weight:bold; color:#0f172a;">${money.toLocaleString('id-ID')} G</div>
                <div class="bar-container" style="width:80px; height:4px; margin-top:2px;">
                    <div style="width:${moneyScore}%; height:100%; background:#fbbf24;"></div>
                </div>
                <span style="font-size:9px; color:#64748b;">Literasi: ${moneyScore}/100</span>
            </td>
            <td>
                <div style="font-weight:bold; color:#0f172a;">${skillName}: ${skillVal}</div>
                <div class="bar-container" style="width:80px; height:4px; margin-top:2px;">
                    <div style="width:${skillScore}%; height:100%; background:#3b82f6;"></div>
                </div>
                <span style="font-size:9px; color:#64748b;">Progres: ${skillScore}%</span>
            </td>
            <td>
                <div style="font-size:18px; font-weight:900; color:${scoreColor};">${totalScore}</div>
            </td>
        `;
                    tbody.appendChild(tr);
                });
            }

            // NEW: FUNGSI RENDER HALAMAN RESET (ASYNC UPDATE)
            function renderResetPage() { // Hapus async
                const students = latestStudentData; // Gunakan Cache
                const tbody = document.getElementById('reset-body');
                tbody.innerHTML = '';

                if (students.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada data siswa. Pastikan siswa sudah Login dan Save setidaknya sekali.</td></tr>';
                    return;
                }

                students.forEach(s => {
                    const sd = s.saveData || {};
                    const role = sd.role && sd.role !== 'none' ? sd.role.toUpperCase() : 'BELUM PILIH';
                    const progress = `Day ${sd.day || 1} | Lv ${sd.level || 1}`;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td><strong>${s.name}</strong></td>
            <td>${s.details}</td>
            <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${role}</span></td>
            <td>${progress}</td>
            <td>
                <div style="display:flex; gap:5px;">
                    <button class="auth-btn" 
                        style="width:auto; padding:6px 12px; font-size:10px; margin:0; background:linear-gradient(90deg, #f59e0b, #d97706); border:1px solid #b45309;" 
                        onclick="confirmResetStudent('${s.email}', '${s.name}')" title="Hapus Progress (Mulai Ulang)">
                        🔄 RESET
                    </button>
                    <button class="auth-btn" 
                        style="width:auto; padding:6px 12px; font-size:10px; margin:0; background:linear-gradient(90deg, #ef4444, #b91c1c); border:1px solid #7f1d1d;" 
                        onclick="confirmDeleteStudent('${s.email}', '${s.name}')" title="Hapus Akun Permanen">
                        🗑️ HAPUS
                    </button>
                </div>
            </td>
        `;
                    tbody.appendChild(tr);
                });
            }

            // NEW: KONFIRMASI RESET (DATA)
            async function confirmResetStudent(email, name) {
                const isConfirmed = confirm(`⚠️ RESET PROGRESS? ⚠️\n\nAnda akan menghapus SAVE DATA permainan siswa:\n"${name}"\n\nSiswa akan kembali ke awal permainan (Prologue) tapi AKUN TETAP ADA.\n\nLanjutkan?`);

                if (isConfirmed) {
                    document.body.style.cursor = 'wait';
                    try {
                        const result = await DataService.adminResetStudent(email);
                        if (result.success) {
                            alert(`✅ RESET SUKSES!\nData progress ${name} telah di-reset.`);
                            if (typeof refreshDashboardData === 'function') refreshDashboardData();
                            else renderResetPage();
                        } else {
                            alert(`❌ GAGAL RESET!\n${result.msg}`);
                        }
                    } catch (e) {
                        alert("Error: " + e.message);
                    } finally {
                        document.body.style.cursor = 'default';
                    }
                }
            }

            // NEW: KONFIRMASI DELETE (AKUN)
            async function confirmDeleteStudent(email, name) {
                const isConfirmed = confirm(`⛔ HAPUS AKUN PERMANEN? ⛔\n\nAnda akan menghapus SELURUH AKUN siswa:\n\n"${name}" (${email})\n\nSiswa TIDAK BISA LOGIN LAGI dan harus daftar ulang. Semua data hilang selamanya.\n\nLanjutkan Hapus Akun?`);

                if (isConfirmed) {
                    document.body.style.cursor = 'wait';
                    try {
                        const result = await DataService.adminDeleteStudent(email);
                        if (result.success) {
                            alert(`🗑️ AKUN DIHAPUS!\nAkun ${name} telah dihapus permanen dari database.`);
                            // Refresh data dashboard secara paksa
                            if (typeof refreshDashboardData === 'function') refreshDashboardData();
                            else renderResetPage();
                        } else {
                            alert(`❌ GAGAL HAPUS!\n${result.msg}`);
                        }
                    } catch (e) {
                        alert("Error Sistem: " + e.message);
                    } finally {
                        document.body.style.cursor = 'default';
                    }
                }
            }

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
