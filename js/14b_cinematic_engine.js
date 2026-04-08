// =================================================================
// 🎬 Cinematic Engine — Visual Storytelling System
// =================================================================

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
