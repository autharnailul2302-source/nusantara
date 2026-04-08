// ══════════════════════════════════════════════════════════════
// Minigame Lamaran Kerja + Lowongan DB
// File: js/18-minigame-lamaran.js
// ══════════════════════════════════════════════════════════════
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

                showDialogue('📝 BUAT SURAT LAMARAN KERJA',
                    `Di meja ini kamu bisa membuat surat lamaran kerja secara lengkap!\n\n` +
                    `📨 Amplop lamaranmu saat ini:\n${amplopList}\n\n` +
                    `📌 STATUS DOKUMEN:\n` +
                    `${hasIjazah ? '✅' : '❌'} Ijazah SMA/SMK\n` +
                    `${hasCV     ? '✅' : '❌'} Curriculum Vitae (CV)\n\n` +
                    `💡 Kamu perlu menyiapkan dokumen sebelum membuat lamaran. ` +
                    `Dokumen bisa dilihat di menu "Buat CV" atau dibeli di Merchant.`,
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
