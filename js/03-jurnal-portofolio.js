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

