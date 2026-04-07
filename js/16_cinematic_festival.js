// ========================================================
// js/16_cinematic_festival.js
// Cinematic Engine & Festival Desa
// ========================================================

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

            // NEW FUNCTION: DRAW OBJECT (Dipisah dari loop utama draw)
            function drawObject(ctx, o) {
                ctx.fillStyle = 'rgba(0,0,0,0.3)';

                // Bayangan mengikuti ukuran objek
                const shadowW = (o.w || 1) * 12;
                const centerX = (o.x * TILE_SIZE) + ((o.w || 1) * TILE_SIZE / 2);
                const centerY = (o.y * TILE_SIZE) + ((o.h || 1) * TILE_SIZE) - 2;

                ctx.beginPath();
                ctx.ellipse(centerX, centerY, shadowW, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                // Support Gambar untuk Object
                if (o.img) {
                    if (!o.loadedImg) {
                        o.loadedImg = new Image();
                        o.loadedImg.src = o.img;

                        // --- FIX: ADD ERROR HANDLER & FALLBACK FOR OBJECT IMAGES ---
                        o.loadedImg.onerror = function () {
                            this.onerror = null;
                            const src = o.img || "";

                            // Fallback khusus untuk kotak surat (Mailbox Merah)
                            if (o.type === 'mailbox') {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTE0IDMyIEwxNCAxNSBMOSAxNSBMOSAxMCBMMjMgMTAgTDIzIDE1IEwxOCAxNSBMMTggMzIgWiIgZmlsbD0iIzU5MzgxMSIvPjxwYXRoIGQ9Ik02IDUgTDI2IDUgTDI2IDEyIEMyNiAxNCA2IDE0IDYgMTIgWiIgZmlsbD0iI0RDMjYyNiIvPjxyZWN0IHg9IjgiIHk9IjciIHdpZHRoPSIxNiIgaGVpZ2h0PSIyIiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK KASUR (Visual Bed)
                            // UPDATE: Cek juga nama file 'bed' agar fallback tetap jalan jika images/bed.png gagal load
                            else if (src.includes('kasur') || src.includes('bed')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI5NiI+PHJlY3QgeD0iNCIgeT0iMTAiIHdpZHRoPSI1NiIgaGVpZ2h0PSI4MCIgZmlsbD0iIzhCNEMzOSIgcng9IjQiLz48cmVjdCB4PSI4IiB5PSIyNSIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkZGRkZGIiByeD0iMiIvPjxyZWN0IHg9IjgiIHk9IjEyIiB3aWR0aD0iNDgiIGhlaWdodD0iMTIiIGZpbGw9IiNmZmYiIHJ4PSI0Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK MEJA BUKU (Meja Kayu + Buku Biru)
                            /* REVISI: Menambahkan 'mejabelajar' ke kondisi fallback agar tetap aman */
                            else if (src.includes('mejabuku') || src.includes('mejabelajar')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iOCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjOEU1NDJCIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjIwIiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIGZpbGw9IiMzYjgyZjYiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTI2IDQgTDI2IDIwIiBzdHJva2U9IndoaXRlIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK MEJA TELPON (Meja Kayu + Telpon Merah)
                            else if (src.includes('mejatelpon') || src.includes('telpon')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iNCIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzhFNTQyQiIgc3Ryb2tlPSIjNUQ0MDM3Ii8+PHJlY3QgeD0iMTAiIHk9IjQiIHdpZHRoPSIxMiIgaGVpZ2h0PSI4IiBmaWxsPSIjZWY0NDQ0Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK MEJA KASUR (Meja Kayu + Mesin Kasir Abu-abu)
                            else if (src.includes('mejakasir')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxNiIgZmlsbD0iIzhCNEMzOSIgc3Ryb2tlPSIjNUQ0MDM3IiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI4IiB5PSI2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTAiIGZpbGw9IiM5NDkzOTgiIHN0cm9rZT0iIzMzNDE1NSIvPjxyZWN0IHg9IjEyIiB5PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSIyIiBmaWxsPSIjMWU0MDVmIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK ORANG SAWAH (Stick Figure Sederhana)
                            else if (src.includes('orangsawah')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGxpbmUgeDE9IjE2IiB5MT0iNCIgeDI9IjE2IiB5Mj0iMzIiIHN0cm9rZT0iIzhCNEMzOSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjgiIHkxPSIxMiIgeDI9IjI0IiB5Mj0iMTIiIHN0cm9rZT0iIzhCNEMzOSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSI4IiByPSI0IiBmaWxsPSIjZmZjMTA3Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK TUNGKU (Kotak Batu dengan Api)
                            else if (src.includes('tungku')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjNDQ0MDNjIiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iNCIvPjxyZWN0IHg9IjE2IiB5PSIzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMWUxZTFlIi8+PHBhdGggZD0iTTI0IDQ4IEwzMiAzMiBMNDAgNDgiIGZpbGw9IiNlZjQ0NDQiLz48cGF0aCBkPSJNMjggNDggTDM2IDQwIEw0NCA0OCIgZmlsbD0iI2Y1OWUwYiIgb3BhY2l0eT0iMC44Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK PARON (Anvil)
                            else if (src.includes('paron')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTIgMTAgTDMwIDEwIEwyOCAxNCBMMjAgMTYgTDIwIDI2IEwyOCAyNiBMMjggMzAgTDQgMzAgTDQgMjYgTDEyIDI2IEwxMiAxNiBMNCAxMiBaIiBmaWxsPSIjNzg5MDljIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK RAK SENJATA
                            else if (src.includes('raksenjata') || src.includes('raksenajata')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iNCIvPjxsaW5lIHgxPSIxMCIgeTE9IjIwIiB4Mj0iNTQiIHkyPSIyMCIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjQiLz48bGluZSB4MT0iMTAiIHkxPSI0MCIgeDI9IjU0IiB5Mj0iNDAiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTIwIDE1IEwyMCA0NSBNNDQgMTUgTDQ0IDQ1IiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK MEJA JAHIT
                            else if (src.includes('mejajahit')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iNCIgeT0iMTIiIHdpZHRoPSI1NiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzhCNEMzOSIgc3Ryb2tlPSIjNUQ0MDM3IiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIxMCIgeT0iOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjgiIGZpbGw9IiM5NDkzOTgiLz48cGF0aCBkPSJNMzAgMjAgTDUwIDIwIEw0MCA0MCBaIiBmaWxsPSIjZTkxZTYzIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjE1IiByPSIzIiBmaWxsPSIjZmZmIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK BIJIH BESI
                            else if (src.includes('bijihbesi')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTE2IDI0IEw4IDE2IEwxNiA4IEwyNCAxNiBaIiBmaWxsPSIjNzU3NTc1IiBzdHJva2U9IiM0MjQyNDIiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik02IDI0IEwxMCAyOCBMMTggMjggTDIyIDI0IiBmaWxsPSIjNzU3NTc1IiBzdHJva2U9IiM0MjQyNDIiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK KAYU BAKAR
                            else if (src.includes('kayubakar')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGNpcmNsZSBjeD0iMTAiIGN5PSIyMCIgcj0iNiIgZmlsbD0iIzVENDAzNyIgc3Ryb2tlPSIjM2UyNzIzIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIyMiIgY3k9IjIwIiByPSI2IiBmaWxsPSIjNUQ0MDM3IiBzdHJva2U9IiMzZTI3MjMiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTIigcj0iNiIgZmlsbD0iIzVENDAzNyIgc3Ryb2tlPSIjM2UyNzIzIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK LEMARI (Wardrobe tall box)
                            else if (src.includes('lemari')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI5NiI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjkyIiBmaWxsPSIjOEU1NDJCIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjgiIHk9IjYiIHdpZHRoPSIyMiIgaGVpZ2h0PSI4NCIgZmlsbD0iIzhCNEMzOSIgc3Ryb2tlPSIjNUQ0MDM3Ii8+PHJlY3QgeD0iMzQiIHk9IjYiIHdpZHRoPSIyMiIgaGVpZ2h0PSI4NCIgZmlsbD0iIzhCNEMzOSIgc3Ryb2tlPSIjNUQ0MDM3Ii8+PGNpcmNsZSBjeD0iMjYiIGN5PSI1MCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjM4IiBjeT0iNTAiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK VAS MERAH
                            else if (src.includes('vasmerah')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTEwIDI0IEwxMCAxMiBDMTAgNiAyMiA2IDIyIDEyIEwyMiAyNCBDMjIgMzAgMTAgMzAgMTAgMjQgWiIgZmlsbD0iI2VmNDQ0NCIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIiLz48ZWxsaXBzZSBjeD0iMTYiIGN5PSI4IiByeD0iNCIgcnk9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK JARING IKAN
                            else if (src.includes('jaringikan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI2NCI+PHBhdGggZD0iTTAgMCBMOTYgNjQgTTk2IDAgTTAgNjQgTTQ8IDAgTDQ4IDY0IE0wIDMyIEw5NiAzMiBNMjQgMCBMMjQgNjQgTTcyIDAgTDcyIDY0IE0wIDE2IEw5NiAxNiBNMCA0OCBMOTYgNDgiIHN0cm9rZT0iI2EzYTNhMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK RAK PANCING
                            else if (src.includes('rakpancing')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjOEU1NDJiIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSI2IiB5MT0iMjgiIHgyPSIyNiIgeTI9IjQiIHN0cm9rZT0iIzU1NSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjEwIiB5MT0iMjgiIHgyPSIyOCIgeTI9IjEwIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyIiB5MT0iMjgiIHgyPSIyMiIgeTI9IjgiIHN0cm9rZT0iIzU1NSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK EMBER IKAN
                            else if (src.includes('emberikan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTYgMTAgTDggMjggTDI0IDI4IEwyNiAxMCBaIiBmaWxsPSIjOTBBNEFFIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik02IDEwIFExNiAyIDI2IDEwIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCA4IEw4IDQgTDEyIDQgWiIgZmlsbD0iIzY0QjVGNiIvPjxwYXRoIGQ9Ik0yMiA4IEwyMCA0IEwyNCA0IFoiIGZpbGw9IiM2NEI1RjYiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK BOXES (Kotak Biru/Coolbox)
                            else if (src.includes('boxes')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iOCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjIyIiBmaWxsPSIjNjRiNWY2IiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyIiB5MT0iMTQiIHgyPSIzMCIgeTI9IjE0IiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK KASUR NELAYAN
                            else if (src.includes('kasurnelayan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI5NiI+PHJlY3QgeD0iNCIgeT0iMTAiIHdpZHRoPSI1NiIgaGVpZ2h0PSI4MCIgZmlsbD0iIzVENEAzNyIgcng9IjQiLz48cmVjdCB4PSI4IiB5PSIyNSIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjRmNmY4IiByeD0iMiIvPjxyZWN0IHg9IjgiIHk9IjEyIiB3aWR0aD0iNDgiIGhlaWdodD0iMTIiIGZpbGw9IiNjYmQ1ZTEiIHJ4PSI0Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK RAK PIALA IKAN
                            else if (src.includes('rakpialaikan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNNiA2IEwyNiA2IEwyNCAxNiBDMjQgMjAgMjAgMjIgMTYgMjIgQzEyIDIyIDggMjAgOCAxNiBMNiA2IFoiIGZpbGw9IiNGRkQ3MDAiIHN0cm9rZT0iI0I4ODYwQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iMTQiIHk9IjIyIiB3aWR0aD0iNCIgaGVpZ2h0PSI2IiBmaWxsPSIjQjg4NjBCIi8+PHJlY3QgeD0iMTAiIHk9IjI4IiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iIzhCNDUxMyIvPjxjaXJjbGUgY3g9IjI2IiBjeT0iMTAiIHI9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iNiIgY3k9IjEwIiByPSIzIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK MEJA MAKAN IKAN
                            else if (src.includes('mejamakanikan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMTAiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxNCIgZmlsbD0iI0EwNTIyRCIgc3Ryb2tlPSIjNUQ0MDM3IiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNiIgZmlsbD0iI0EwNTIyRCIvPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNiIgZmlsbD0iI0EwNTIyRCIvPjxlbGxpcHNlIGN4PSIxNiIgY3k9IjE2IiByeD0iOCIgcnk9IjMiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNMTIgMTYgTDIwIDE2IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK ARSIP REKAM MEDIS (Laci Besi Abu-abu)
                            else if (src.includes('arsiprekammedis')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjOTRhM2I4IiBzdHJva2U9IiM0NzU1NjkiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIyMCIgaGVpZ2h0PSI2IiBmaWxsPSIjYzFjN2Q2IiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMjAiIGhlaWdodD0iNiIgZmlsbD0iI2MxYzdkNiIgc3Ryb2tlPSIjNjQ3NDhiIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI2IiB5PSIyMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjYiIGZpbGw9IiNjMWM3ZDYiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIxIi8+PGxpbmUgeDE9IjE0IiB5MT0iOSIgeDI9IjE4IiB5Mj0iOSIgc3Ryb2tlPSIjMzM0MTU1IiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMTQiIHkxPSIxNyIgeDI9IjE4IiB5Mj0iMTciIHN0cm9rZT0iIzMzNDE1NSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjE0IiB5MT0iMjUiIHgyPSIxOCIgeTI9IjI1IiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK KEBUN AYU (Taman Bunga)
                            else if (src.includes('kebunayu')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iOTYiPjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSIxMjAiIGhlaWdodD0iODgiIGZpbGw9IiM1ZDQwMzciIHN0cm9rZT0iIzNjMjQxNSIgc3Ryb2tlLXdpZHRoPSI0Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTAiIGZpbGw9IiNlOTFlNjMiLz48Y2lyY2xlIGN4PSI2NCIgY3k9IjMwIiByPSIxMCIgZmlsbD0iI2Y1OWUwYiIvPjxjaXJjbGUgY3g9Ijk4IiBjeT0iMzAiIHI9IjEwIiBmaWxsPSIjM2I4MmY2Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSI2NCIgcj0iMTAiIGZpbGw9IiNmZmViM2IiLz48Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiByPSIxMCIgZmlsbD0iI2U5MWU2MyIvPjxjaXJjbGUgY3g9Ijk4IiBjeT0iNjQiIHI9IjEwIiBmaWxsPSIjZjU5ZTBiIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK PIALA MENTOR (Piala Emas Besar)
                            else if (src.includes('pialamentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNOCA2IEwyNCA2IEwyMiAxNiBDMjIgMjAgMTggMjIgMTYgMjIgQzE0IDIyIDEwIDIwIDEwIDE2IEw4IDYgWiIgZmlsbD0iI0ZGRDcwMCIgc3Ryb2tlPSIjQjg4NjBCIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIxNCIgeT0iMjIiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiNCODg2MEIiLz48cmVjdCB4PSI4IiB5PSIyOCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjQiIGZpbGw9IiM4QjQ1MTMiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjEwIiByPSI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjgiIGN5PSIxMCIgcj0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZDNzAwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTYgMTAgTDE2IDE2IiBzdHJva2U9IiNCODg2MEIiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK VAS MENTOR (Vas Biru Elegan)
                            else if (src.includes('vasmentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTEwIDI0IEwxMCAxMiBDMTAgNiAyMiA2IDIyIDEyIEwyMiAyNCBDMjIgMzAgMTAgMzAgMTAgMjQgWiIgZmlsbD0iIzNiODJmNiIgc3Ryb2tlPSIjMWQ0ZWQ4IiBzdHJva2Utd2lkdGg9IjIiLz48ZWxsaXBzZSBjeD0iMTYiIGN5PSI4IiByeD0iNCIgcnk9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK TUMPUKAN KERTAS (Tumpukan Dokumen Putih)
                            else if (src.includes('tumpukankertas')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iNCIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjY2JkNWUxIiBzdHJva2Utd2lkdGg9IjEiLz48bGluZSB4MT0iOCIgeTE9IjE2IiB4Mj0iMjQiIHkyPSIxNiIgc3Ryb2tlPSIjMDAwIi8+PGxpbmUgeDE9IjgiIHkxPSIyMCIgeDI9IjI0IiB5Mj0iMjAiIHN0cm9rZT0iIzAwMCIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK FOTO MENTOR (Bingkai Foto Kayu)
                            else if (src.includes('fotomentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI0IiBmaWxsPSIjOEU1NDJCIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjYiIHk9IjgiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjQiIGZpbGw9IiM5NDkzOTgiLz48L3N2Zz4=';
                            }
                            // Fallback: RAK BUKU (Gambar Rak dengan Buku Warna-warni) - UPDATE: Tambahkan fallback untuk lemariobat dan rakmentor
                            else if (src.includes('rakbuku') || src.includes('lemariobat') || src.includes('rakmentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjOEU1NDJiIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjUiIHk9IjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIiBmaWxsPSIjZWY0NDQ0Ii8+PHJlY3QgeD0iMTAiIHk9IjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIiBmaWxsPSIjM2I4MmY2Ii8+PHJlY3QgeD0iMTUiIHk9IjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMTBiOTgxIi8+PHJlY3QgeD0iMjAiIHk9IjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIiBmaWxsPSIjZTkxZTYzIi8+PC9zdmc+';
                            }
                            // Fallback: PAPAN TULIS (Hijau/Hitam dengan Bingkai)
                            else if (src.includes('papan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjYwIiBoZWlnaHQ9IjI4IiBmaWxsPSIjMDY0ZTNGIiBzdHJva2U9IiM4YTUwMjUiIHN0cm9rZS13aWR0aD0iNCIvPjx0ZXh0IHg9IjMyIiB5PSIyMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjEyMzwvdGV4dD48L3N2Zz4=';
                            }
                            // Fallback: KURSI (Bentuk Kursi Kayu)
                            else if (src.includes('kursi')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTEwIDIwIEwxMCAxMCBMMjIgMTAgTDIyIDIwIEwyMiAyOCBMMjAgMjggTDIwIDIyIEwxMiAyMiBMMTIgMjggTDEwIDI4IFoiIGZpbGw9IiM4YTUwMjUiIHN0cm9rZT0iIzU5MzUxMSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
                            }
                            // Fallback: MEJA DOSEN (Meja Guru), MEJA DOKTER, ATAU MEJA MENTOR
                            else if (src.includes('mejadosen') || src.includes('mejadokter') || src.includes('mejamentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxMiIgZmlsbD0iIzVENDAzNyIgc3Ryb2tlPSIjM2UyNzIzIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzVENDAzNyIvPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzVENDAzNyIvPjwvc3ZnPg==';
                            }
                            // Fallback: MEJA MODIN (Meja Akad dengan Taplak Putih)
                            else if (src.includes('mejamodin')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxMiIgZmlsbD0iIzVENDAzNyIgc3Ryb2tlPSIjM2UyNzIzIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzVENDAzNyIvPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzVENDAzNyIvPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSIxNiIgaGVpZ2h0PSI0IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjkiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK ALTAR (Gerbang/Dekorasi Bunga)
                            else if (src.includes('altar')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNzYiIGhlaWdodD0iNTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Q0QUYzNyIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTEwIDEwIFEgNDggLTIwIDg2IDEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjYiIGZpbGw9IiNmMjhiODIiLz48Y2lyY2xlIGN4PSI4NiIgY3k9IjEwIiByPSI2IiBmaWxsPSIjZjI4YjgyIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iNTYiIGhlaWdodD0iNDQiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==';
                            }
                            // Fallback Umum (Box Kayu)
                            else {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjOEU1NDJiIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyIiB5MT0iMiIgeDI9IjMwIiB5Mj0iMzAiIHN0cm9rZT0iIzVENDAzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjMwIiB5MT0iMiIgeDI9IjIiIHkyPSIzMCIgc3Ryb2tlPSIjNUQ0MDM3IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
                            }
                        };
                    }

                    if (o.loadedImg.complete && o.loadedImg.naturalWidth !== 0) {
                        // Gambar object sesuai ukuran custom (w/h)
                        const drawW = (o.w || 1) * TILE_SIZE;
                        const drawH = (o.h || 1) * TILE_SIZE;
                        ctx.drawImage(o.loadedImg, o.x * TILE_SIZE, o.y * TILE_SIZE, drawW, drawH);
                    } else {
                        // Fallback Text Icon jika gambar benar-benar gagal
                        ctx.font = '20px Arial';
                        ctx.fillStyle = '#fff';
                        ctx.fillText(o.icon, o.x * TILE_SIZE + 5, o.y * TILE_SIZE + 25);
                    }
                } else {
                    // Default Icon Rendering
                    ctx.font = '20px Arial';
                    ctx.fillStyle = '#fff'; // Pastikan warna terlihat
                    ctx.fillText(o.icon, o.x * TILE_SIZE + 5, o.y * TILE_SIZE + 25);
                }

                // --- NEW: IDENTITAS MAILBOX MELAYANG (Agar Player Tahu Ini Pos) ---
                if (o.type === 'mailbox') {
                    const centerX = (o.x * TILE_SIZE) + (TILE_SIZE / 2);
                    const topY = (o.y * TILE_SIZE) - 15; // Di atas objek

                    // Animasi Melayang (Slow Bobbing)
                    const floatOffset = Math.sin(Date.now() / 500) * 3;

                    ctx.save();
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'center';
                    ctx.shadowColor = 'rgba(0,0,0,0.8)';
                    ctx.shadowBlur = 4;

                    // Gambar Amplop Putih
                    ctx.fillText('✉️', centerX, topY + floatOffset);

                    // Label Kecil "POS" (Opsional, agar lebih jelas)
                    ctx.font = 'bold 8px "Exo 2"';
                    ctx.fillStyle = '#fbbf24'; // Emas
                    ctx.fillText("POS", centerX, topY + floatOffset + 8);

                    ctx.restore();
                }

                // --- NEW: INDIKATOR PESAN BELUM DIBACA (KHUSUS MAILBOX) ---
                if (o.type === 'mailbox') {
                    const msgs = STATE.player.messages || [];
                    const unreadCount = msgs.filter(m => !m.read).length;

                    if (unreadCount > 0) {
                        // Gambar Notifikasi Merah Melayang (Lebih tinggi sedikit agar tidak menumpuk ikon amplop)
                        const bx = (o.x * TILE_SIZE) + (TILE_SIZE / 2) + 10; // Geser ke kanan sedikit
                        const by = (o.y * TILE_SIZE) - 25; // Lebih ke atas

                        const floatY = Math.sin(Date.now() / 200) * 3; // Animasi lebih cepat (urgensi)

                        ctx.fillStyle = '#ef4444'; // Merah
                        ctx.beginPath();
                        ctx.arc(bx, by + floatY, 7, 0, Math.PI * 2);
                        ctx.fill();

                        // Border Putih
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 1.5;
                        ctx.stroke();

                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 10px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        // Tampilkan jumlah pesan jika > 1, jika tidak tanda seru
                        const badgeText = unreadCount > 9 ? '9+' : (unreadCount > 1 ? unreadCount : '!');
                        ctx.fillText(badgeText, bx, by + floatY + 1);
                    }
                }
            }

            function drawBuilding(ctx, b) {
                // Bangunan collision-only di fairy village (sudah ada sprite NPC/gambar khusus) — skip render
                if (b.id === 'rara_wilis_bld' || b.id === 'pohon_energi_bld' || b.id === 'fv_istana_bld') return;

                // FIX: Bangunan Fairy Village — render pakai gambar tier untuk hunian, emoji untuk lainnya
                if (b.id && b.id.startsWith('fv_bld_')) {
                    const _ts = (typeof TS !== 'undefined') ? TS : 40;
                    const _vs = (typeof FV_BLDG_VISUAL_SCALE !== 'undefined') ? FV_BLDG_VISUAL_SCALE : 1.8;
                    const bx = b.x * _ts, by = b.y * _ts;
                    const bw = (b.w || 2) * _ts, bh = (b.h || 2) * _ts;
                    // Visual scale — lebih besar, anchor bawah agar nempel tanah
                    const vw = bw * _vs, vh = bh * _vs;
                    const vx = bx + bw/2 - vw/2;
                    const vy = by + bh - vh;
                    const bid2 = b._fvBid || '';

                    // Gambar bangunan dengan ukuran visual (besar, anchor bawah)
                    const _omahMap = { pondok_peri: 1, rumah_peri: 2, dalem_widadari: 3 };
                    const _omahTier = _omahMap[bid2];
                    let drawn = false;
                    if (_omahTier && typeof FV_OMAH_IMAGES !== 'undefined') {
                        const _img = FV_OMAH_IMAGES[_omahTier];
                        if (_img && _img.complete && _img.naturalWidth > 0) {
                            ctx.drawImage(_img, vx, vy, vw, vh);
                            drawn = true;
                        }
                    }
                    if (!drawn && typeof drawFVBuildingCanvas === 'function') {
                        drawFVBuildingCanvas(ctx, bid2, vx, vy, vw, vh, performance.now());
                        drawn = true;
                    }

                    // ── Label PILL di ATAS bangunan (pakai posisi visual) ──
                    if (b.name) {
                        ctx.save();
                        const labelText = (b._fvEmoji||'🏠') + ' ' + b.name.replace(/^[^ ]+ /,'');
                        ctx.font = 'bold 9px Nunito, sans-serif';
                        const tw = ctx.measureText(labelText).width;
                        const pillW = tw + 16, pillH = 18;
                        const pillX = vx + vw/2 - pillW/2;
                        const pillY = vy - 26; // di atas gambar visual
                        ctx.shadowColor='rgba(0,0,0,0.6)'; ctx.shadowBlur=6; ctx.shadowOffsetY=3;
                        ctx.fillStyle='rgba(30,5,60,0.92)';
                        ctx.beginPath(); ctx.roundRect(pillX, pillY, pillW, pillH, 5); ctx.fill();
                        ctx.shadowBlur=0; ctx.shadowOffsetY=0;
                        const tierColors=['#d97706','#2563eb','#9333ea','#ea580c','#ca8a04'];
                        ctx.strokeStyle=tierColors[b._fvTier||0]||'#9333ea'; ctx.lineWidth=1.5;
                        ctx.beginPath(); ctx.roundRect(pillX, pillY, pillW, pillH, 5); ctx.stroke();
                        ctx.fillStyle='#e9d5ff'; ctx.textAlign='center'; ctx.textBaseline='middle';
                        ctx.fillText(labelText, vx+vw/2, pillY+pillH/2);
                        ctx.textAlign='left'; ctx.textBaseline='alphabetic';
                        ctx.restore();
                    }

                    // ── Portal entrance ──
                    if (b.entrance) {
                        const ex = b.entrance.x * _ts;
                        const ey = b.entrance.y * _ts;
                        const pulse = Math.abs(Math.sin(Date.now()/300));
                        ctx.fillStyle = `rgba(6,182,212,${pulse})`;
                        ctx.beginPath(); ctx.arc(ex+_ts/2, ey+_ts/2, _ts*0.28, 0, Math.PI*2); ctx.fill();
                        ctx.strokeStyle='#fff'; ctx.lineWidth=1;
                        ctx.beginPath(); ctx.arc(ex+_ts/2, ey+_ts/2, _ts*0.28+pulse*6, 0, Math.PI*2); ctx.stroke();
                        ctx.font=`bold 8px Nunito,sans-serif`; ctx.fillStyle='#fff'; ctx.textAlign='center';
                        ctx.fillText('MASUK', ex+_ts/2, ey-4);
                        ctx.textAlign='left';
                    }
                    return;
                }

                if (b.type === 'trigger') {
                    // Trigger invisible, but usually draws entrance circle below
                } else {
                    let src = b.img;

                    if (b.id === 'player_house') {
                        // UPDATE: Jika Role Entrepreneur, ganti gambar rumah jadi Toko Player
                        if (STATE.player.role === 'entrepreneur') {
                            src = 'images/tokoplayer.png';
                        } else {
                            src = `images/houselevel${STATE.player.houseLevel}.png`;
                        }
                    }
                    if (b.id === 'merchant' && STATE.player.role === 'entrepreneur') {
                        // src = 'images/tokoplayer.png'; // REMOVED: Jangan ubah Merchant NPC
                    }
                    // PERBAIKAN: Handle Gambar Batu Dungeon
                    if (b.type === 'dungeon_rock') {
                        // Gunakan aset khusus rock (batudidungeon.png)
                        if (dungeonAssets.rock.complete && dungeonAssets.rock.naturalWidth !== 0) {
                            // Gambar batu sebagai objek
                            ctx.drawImage(dungeonAssets.rock, b.x * TILE_SIZE, b.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                        } else {
                            // Fallback jika gambar belum load (Coba pakai wall dulu atau bentuk bulat)
                            if (dungeonAssets.wall.complete && dungeonAssets.wall.naturalWidth !== 0) {
                                ctx.drawImage(dungeonAssets.wall, b.x * TILE_SIZE, b.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                            } else {
                                ctx.fillStyle = '#1e293b';
                                ctx.beginPath(); ctx.arc(b.x * TILE_SIZE + 15, b.y * TILE_SIZE + 15, 12, 0, Math.PI * 2); ctx.fill();
                            }
                        }
                        return; // Selesai gambar batu, skip sisanya
                    }

                    // --- [FIX] LOGIKA UPDATE GAMBAR DINAMIS ---
                    // Cek: Jika belum ada loadedImg ATAU src-nya sudah berubah (misal habis upgrade rumah)
                    // Maka load ulang gambar baru
                    if (!b.loadedImg || (b.loadedImg.src && !b.loadedImg.src.includes(src))) {
                        b.loadedImg = new Image();
                        b.loadedImg.src = src;
                        b.loadedImg.onerror = function () { this.error = true; };
                    }

                    if (b.loadedImg.complete && !b.loadedImg.error && b.loadedImg.naturalWidth !== 0) {
                        ctx.drawImage(b.loadedImg, b.x * TILE_SIZE, b.y * TILE_SIZE, b.w * TILE_SIZE, b.h * TILE_SIZE);
                    } else {
                        ctx.fillStyle = b.id === 'player_house' ? '#d97706' : '#475569';
                        ctx.fillRect(b.x * TILE_SIZE, b.y * TILE_SIZE, b.w * TILE_SIZE, b.h * TILE_SIZE);
                        ctx.fillStyle = '#fff';
                        ctx.font = '10px Arial';
                        ctx.fillText(b.name || "Building", b.x * TILE_SIZE, b.y * TILE_SIZE + 20);
                    }
                }

                // --- NEW: EFEK SALJU MENEMPEL DI ATAP BANGUNAN ---
                if (STATE.season === 'winter' && STATE.location === 'village' && b.type !== 'trigger' && b.type !== 'dungeon_rock') {
                    ctx.save();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Warna Salju Transparan

                    // Buat bentuk tumpukan salju di atas atap
                    const bx = b.x * TILE_SIZE;
                    const by = b.y * TILE_SIZE;
                    const bw = b.w * TILE_SIZE;

                    // Gambar Ellipse pipih di bagian atas bangunan (Atap)
                    ctx.beginPath();
                    // Pusat di tengah atas bangunan
                    ctx.ellipse(bx + bw / 2, by + 10, bw / 2 - 5, 10, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Tambahkan tetesan es (Icicles) kecil
                    ctx.fillStyle = 'rgba(200, 230, 255, 0.9)';
                    for (let i = 0; i < b.w; i++) {
                        if (i % 2 === 0) { // Selang seling
                            ctx.fillRect(bx + (i * TILE_SIZE) + 10, by + 15, 4, 8 + Math.random() * 5);
                        }
                    }

                    ctx.restore();
                }
                // --------------------------------------------------

                if (b.entrance) {
                    const ex = b.entrance.x * TILE_SIZE;
                    const ey = b.entrance.y * TILE_SIZE;
                    const pulse = Math.abs(Math.sin(Date.now() / 300));

                    // UPDATE: Warna indikator berbeda untuk Exit vs Enter
                    const isExit = b.id.includes('exit') || b.id.includes('out') || (b.name && b.name.toLowerCase().includes('keluar'));

                    // Orange untuk Masuk, Merah/Putih untuk Keluar
                    let indColor = b.id === 'player_house' ? `rgba(251, 191, 36, ${pulse})` : `rgba(6, 182, 212, ${pulse})`;
                    if (isExit) indColor = `rgba(239, 68, 68, ${pulse})`;

                    // NEW: Warna Ungu untuk Portal Next Level
                    if (b.id === 'dungeon_next') indColor = `rgba(147, 51, 234, ${pulse})`; // Purple

                    ctx.fillStyle = indColor;
                    ctx.beginPath();
                    ctx.arc(ex + 15, ey + 15, 10, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(ex + 15, ey + 15, 10 + (pulse * 5), 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.font = 'bold 8px "Exo 2"';
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';

                    // UPDATE: Teks otomatis berubah jadi KELUAR jika ID/Nama mengandung kata kunci exit/keluar
                    let label = isExit ? "KELUAR" : "MASUK";
                    if (b.id === 'dungeon_next') label = "NEXT LVL"; // Label khusus
                    if (b.id === 'papan_misi') label = "LIHAT"; // Label khusus Papan

                    ctx.fillText(label, ex + 15, ey - 5);
                }

                // --- NEW: LABEL BANGUNAN PREMIUM (PILL STYLE) ---
                if (b.name && b.type !== 'trigger' && b.type !== 'dungeon_rock') {
                    ctx.save();

                    const bx = b.x * TILE_SIZE;
                    const by = b.y * TILE_SIZE;
                    const bw = b.w * TILE_SIZE;

                    // Cek Status Buka/Tutup
                    let isClosed = false;
                    let isRenovating = false;

                    if (b.entrance && b.entrance.map && !maps[b.entrance.map]) {
                        isRenovating = true;
                    } else if (b.openTime && b.closeTime && !b.open24h) {
                        if (STATE.time < b.openTime || STATE.time >= b.closeTime) {
                            isClosed = true;
                        }
                    }

                    // --- KONFIGURASI STYLE ---
                    let labelText = b.name.toUpperCase();
                    let bgColor = 'rgba(15, 23, 42, 0.9)'; // Default: Dark Slate (Modis)
                    let borderColor = 'rgba(148, 163, 184, 0.8)'; // Border Abu-abu
                    let textColor = '#f8fafc'; // Putih
                    let icon = '';

                    // Style Khusus Bangunan Utama (Emas)
                    if (b.roleSpecific || b.id === 'player_house') {
                        bgColor = 'rgba(66, 32, 6, 0.95)'; // Coklat Tua
                        borderColor = '#fbbf24'; // Emas
                        textColor = '#fffbeb';
                    }

                    // Style Khusus Status
                    if (isRenovating) {
                        bgColor = 'rgba(113, 63, 18, 0.95)'; // Kuning Tua
                        borderColor = '#fcd34d';
                        icon = '🚧 ';
                    } else if (isClosed) {
                        bgColor = 'rgba(127, 29, 29, 0.95)'; // Merah Tua
                        borderColor = '#ef4444';
                        icon = '🔒 ';
                    } else {
                        // Ikon Bangunan Saat Buka
                        if (b.id.includes('merchant')) icon = '🛒 ';
                        else if (b.id.includes('clinic')) icon = '🏥 ';
                        else if (b.id.includes('school')) icon = '🎓 ';
                        else if (b.id.includes('guild')) icon = '⚔️ ';
                        else if (b.id.includes('blacksmith')) icon = '⚒️ ';
                        else if (b.id.includes('library')) icon = '📚 ';
                        else if (b.id.includes('wedding')) icon = '💍 '; // Sudah ada
                        else if (b.id.includes('port')) icon = '⚓ ';
                    }

                    const fullText = icon + labelText;

                    // Hitung Ukuran Label
                    ctx.font = 'bold 9px "Exo 2", sans-serif'; // Ukuran font pas
                    const textMetrics = ctx.measureText(fullText);
                    const textWidth = textMetrics.width;

                    const paddingX = 8;
                    const paddingY = 4;
                    const pillW = textWidth + (paddingX * 2);
                    const pillH = 18; // Tinggi label

                    // Posisi Label (Tengah bangunan, melayang di atas atap)
                    const pillX = bx + (bw / 2) - (pillW / 2);
                    const pillY = by - 28; // Jarak float dari atap

                    // --- DRAW SHADOW (Efek Melayang) ---
                    ctx.shadowColor = 'rgba(0,0,0,0.6)';
                    ctx.shadowBlur = 6;
                    ctx.shadowOffsetY = 3;

                    // --- DRAW PILL BACKGROUND (Rounded Rect) ---
                    ctx.fillStyle = bgColor;
                    ctx.beginPath();
                    const r = 5; // Radius sudut
                    ctx.moveTo(pillX + r, pillY);
                    ctx.lineTo(pillX + pillW - r, pillY);
                    ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + r);
                    ctx.lineTo(pillX + pillW, pillY + pillH - r);
                    ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - r, pillY + pillH);
                    ctx.lineTo(pillX + r, pillY + pillH);
                    ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - r);
                    ctx.lineTo(pillX, pillY + r);
                    ctx.quadraticCurveTo(pillX, pillY, pillX + r, pillY);
                    ctx.fill();

                    // --- DRAW BORDER ---
                    ctx.shadowBlur = 0; // Hilangkan shadow untuk border agar tajam
                    ctx.shadowOffsetY = 0;
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();

                    // --- DRAW TEXT ---
                    ctx.fillStyle = textColor;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    // Gambar teks di tengah pill
                    ctx.fillText(fullText, pillX + (pillW / 2), pillY + (pillH / 2));

                    // --- DRAW ARROW/POINTER KE BAWAH (Segitiga kecil) ---
                    ctx.fillStyle = bgColor;
                    ctx.beginPath();
                    ctx.moveTo(pillX + (pillW / 2) - 4, pillY + pillH);
                    ctx.lineTo(pillX + (pillW / 2) + 4, pillY + pillH);
                    ctx.lineTo(pillX + (pillW / 2), pillY + pillH + 4);
                    ctx.fill();

                    // Border segitiga (opsional, agar nyatu)
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(pillX + (pillW / 2) - 4, pillY + pillH);
                    ctx.lineTo(pillX + (pillW / 2), pillY + pillH + 4);
                    ctx.lineTo(pillX + (pillW / 2) + 4, pillY + pillH);
                    ctx.stroke();

                    ctx.restore();
                }
            }

            function drawPlayer(ctx, p) {
                // --- NEW: VISUAL SHIELD EFEK (TONIC KEBAL) ---
                if (p.invincible) {
                    ctx.save();
                    const pulse = 1 + Math.sin(Date.now() / 100) * 0.1;
                    ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
                    ctx.scale(pulse, pulse);

                    ctx.strokeStyle = '#60a5fa'; // Cyan/Blue Shield
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, 25, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
                    ctx.fill();
                    ctx.restore();
                }

                // [MOVED] Indikator Keringat dipindah ke bawah setelah sprite digambar

                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.beginPath();
                ctx.ellipse(p.x + 10, p.y + 28, 10, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                let sprite = p.spriteIdle;

                // FIX: Mengganti touchState (yang tidak ada) menjadi inputState.active
                let isMoving = keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight'] ||
                    keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'] ||
                    inputState.active; // Gunakan inputState dari touch controls

                // UPDATE: Prioritas Sprite (Attack > Walk > Idle)
                if (p.isAttacking && p.spriteAttack) {
                    sprite = p.spriteAttack;
                } else if (isMoving) {
                    if (p.direction === 'up' && p.spriteWalkUp) {
                        sprite = p.spriteWalkUp;
                    }
                    else if (p.direction === 'down' && p.spriteWalkDown) {
                        sprite = p.spriteWalkDown;
                    } else {
                        sprite = p.spriteWalk;
                    }
                }

                if (sprite && sprite.complete && sprite.naturalWidth !== 0) {
                    ctx.save();
                    ctx.translate(p.x + p.w / 2, p.y + p.h / 2);

                    // --- NEW: DAMAGE BLINK EFFECT (HURT ANIMATION) ---
                    // Jika sedang sakit (hurtTimer > 0), buat efek berkedip merah
                    if (p.hurtTimer > 0) {
                        p.hurtTimer--; // Kurangi timer setiap frame

                        // Efek guncangan pada sprite
                        const shakeSprite = (Math.random() - 0.5) * 4;
                        ctx.translate(shakeSprite, 0);

                        // Efek Tint Merah (Composite Operation)
                        // Kita gambar sprite normal dulu, lalu tumpuk warna merah di atasnya
                        // Menggunakan globalAlpha untuk kedip
                        if (Math.floor(Date.now() / 50) % 2 === 0) {
                            ctx.globalAlpha = 0.7; // Sedikit transparan
                            // Note: Efek merah murni agak berat di performa canvas standard, 
                            // jadi kita pakai filter sederhana atau opacity + shake sudah cukup terasa.
                            // Jika browser support filter:
                            ctx.filter = 'sepia(1) hue-rotate(-50deg) saturate(5)'; // Merah pekat
                        }
                    }

                    if (!isMoving && !p.isAttacking) {
                        // UPDATE: Efek bernapas diperhalus (0.03 -> 0.015) agar tidak terlihat naik-turun drastis
                        const breathe = 1 + Math.sin(Date.now() / 300) * 0.015;
                        ctx.scale(1, breathe);
                    }

                    if (p.direction === 'left') ctx.scale(-1, 1);

                    if (p.isAttacking) {
                        ctx.drawImage(sprite, -32, -49, 64, 64);
                    } else {
                        // UPDATE: UKURAN PLAYER DISESUAIKAN KE 38x58 (Sesuai Request)
                        // Posisi X digeser -19 (setengah dari 38)
                        // Posisi Y digeser -46 agar kaki tetap menapak pas di bayangan (y+12 dari titik tengah)
                        ctx.drawImage(sprite, -19, -46, 38, 58);
                    }

                    ctx.restore();
                } else {
                    // ... fallback rendering ...
                    ctx.fillStyle = p.color || '#fbbf24';
                    if (p.hurtTimer > 0) ctx.fillStyle = '#ef4444'; // Merah jika sakit (fallback)
                    ctx.fillRect(p.x, p.y, 20, 20);
                    // ...
                }

                // --- UPDATE: VISUAL INDIKATOR STAMINA RENDAH (KERINGAT KECIL DI KEPALA) ---
                // Dipindah ke sini agar digambar DI DEPAN player
                if (p.energy <= 25) {
                    ctx.save();
                    // Animasi naik turun (bobbing)
                    const sweatBob = Math.sin(Date.now() / 200) * 2;

                    // Posisi relatif terhadap kepala (berdasarkan offset sprite visual)
                    // Sprite digambar di y-45 dari tengah, jadi kepala ada di sekitar y-35 dari tengah logic
                    // Kita taruh di dahi sebelah kanan
                    const headX = p.x + (p.w / 2) + 8; // Sedikit di kanan tengah wajah
                    const headY = p.y + (p.h / 2) - 38 + sweatBob; // Area dahi atas

                    ctx.translate(headX, headY);

                    ctx.fillStyle = '#38bdf8'; // Biru Muda (Air)

                    // Gambar Tetesan Keringat Vector Kecil (Manual Path)
                    ctx.beginPath();
                    ctx.arc(0, 0, 2.5, 0, Math.PI * 2); // Bulatan bawah (r=2.5)
                    ctx.moveTo(-2.5, -1);
                    ctx.lineTo(0, -6); // Lancip atas (seperti tetesan air jatuh)
                    ctx.lineTo(2.5, -1);
                    ctx.fill();

                    ctx.restore();
                }

                // --- NEW: HP BAR DI ATAS KEPALA (PREMIUM STYLE) ---
                // UPDATE: SEKARANG MUNCUL DI SEMUA LOKASI (TERMASUK DUNGEON)
                // Menghapus syarat 'if (STATE.location !== 'dungeon')' agar bar melayang selalu muncul
                {
                    // Posisi sedikit lebih tinggi dari kepala sprite (y-55)
                    const barW = 36;
                    const barH = 5;
                    const barX = p.x + 10 - barW / 2;
                    const barY = p.y - 55;

                    const hpPct = Math.max(0, p.hp / p.maxHp);

                    // Warna Dinamis (Hijau -> Kuning -> Merah)
                    let colTop, colBot;
                    if (hpPct > 0.5) { colTop = '#4ade80'; colBot = '#15803d'; } // Hijau Sehat
                    else if (hpPct > 0.25) { colTop = '#facc15'; colBot = '#a16207'; } // Kuning Waspada
                    else { colTop = '#ef4444'; colBot = '#7f1d1d'; } // Merah Bahaya

                    ctx.save();

                    // 1. Shadow Background (Hitam semi-transparan untuk outline)
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    // Gambar background sedikit lebih besar dari bar (+1px border effect)
                    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

                    // 2. Bar Kosong (Abu gelap)
                    ctx.fillStyle = '#334155';
                    ctx.fillRect(barX, barY, barW, barH);

                    if (hpPct > 0) {
                        // 3. Gradient Fill
                        const grad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
                        grad.addColorStop(0, colTop);
                        grad.addColorStop(1, colBot);

                        ctx.fillStyle = grad;
                        const fillW = Math.max(0, barW * hpPct);
                        ctx.fillRect(barX, barY, fillW, barH);

                        // 4. Efek Shine (Kilap di separuh atas)
                        ctx.fillStyle = 'rgba(255,255,255,0.25)';
                        ctx.fillRect(barX, barY, fillW, barH / 2);
                    }

                    // 5. Border Halus
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(barX - 0.5, barY - 0.5, barW + 1, barH + 1);

                    ctx.restore();
                }

                // --- UPDATE: MARKER SEGITIGA (Lebih Tinggi Lagi menyesuaikan Bar baru) ---
                // Marker digeser ke y-68 agar aman di atas HP Bar
                const floatY = Math.sin(Date.now() / 150) * 5;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.moveTo(p.x + 10, p.y - 68 + floatY); // Ujung Bawah
                ctx.lineTo(p.x + 5, p.y - 78 + floatY);  // Kiri Atas
                ctx.lineTo(p.x + 15, p.y - 78 + floatY); // Kanan Atas
                ctx.fill();

                // Shadow/Glow Marker
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;

                if (p.isAttacking) {
                    ctx.save();
                    ctx.translate(p.x + 10, p.y + 10);
                    ctx.rotate(p.direction === 'left' ? -1.5 : 1.5);
                    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(0, 0, 25, -0.5, 0.5); ctx.stroke();
                    ctx.restore();
                }

                // --- DRAW PET FOLLOWER ---
                if (STATE.screen === 'play') drawPetFollower(ctx, p);
            }

            // --- NEW FUNCTION: DRAW GHOST (PEMAIN LAIN & BOT) ---
            function drawGhost(ctx, g) {
                // 1. Setup Visual Hantu (Transparan)
                ctx.save();
                ctx.globalAlpha = 0.6; // Setengah transparan agar terlihat seperti hantu/bayangan

                // Tentukan Posisi
                // (Data hantu x,y adalah koordinat murni dari database)
                const gx = g.x;
                const gy = g.y;

                // 2. Gambar Sprite (Sesuai Gender & Outfit)
                // Kita gunakan logika suffix yang sama dengan player untuk baju
                let suffix = "";
                if (g.outfit === 'wedding') suffix = "-weding";
                else if (g.outfit === 'armor') suffix = "-armor";
                else if (g.outfit === 'special') suffix = "-special";

                let spriteSrc = `images/${g.gender}-idle${suffix}.png`;

                // Karena kita tidak bisa load image sync di sini, kita coba buat Image object baru
                // Browser biasanya mengambil dari cache jika sudah pernah diload player
                const img = new Image();
                img.src = spriteSrc;

                // Default ukuran player
                const pW = 38;
                const pH = 58;

                if (img.complete && img.naturalWidth !== 0) {
                    // Gambar sprite hantu
                    // Offset disesuaikan (-19, -46) agar kaki pas di titik y
                    ctx.drawImage(img, gx, gy - 46, pW, pH);
                } else {
                    // Fallback jika gambar belum siap: Kotak Putih Hantu
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(gx, gy - 20, 20, 20);
                }

                // 3. Gambar Nama (Nametag)
                ctx.globalAlpha = 0.8; // Nama lebih jelas dikit
                ctx.font = 'bold 10px "Exo 2"';
                ctx.textAlign = 'center';

                // Background nama
                const textW = ctx.measureText(g.name).width;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(gx + 10 - (textW / 2) - 4, gy - 60, textW + 8, 14);

                // Teks Nama - UPDATE: Beda Warna untuk Bot vs Real Player
                if (g.isBot) {
                    ctx.fillStyle = '#38bdf8'; // Biru Cyan (Bot)
                } else {
                    ctx.fillStyle = '#4ade80'; // Hijau Terang (Manusia Asli)
                }
                ctx.fillText(g.name, gx + 10, gy - 50);

                // Indikator kecil untuk Real Player
                if (!g.isBot) {
                    ctx.font = '8px Arial';
                    ctx.fillStyle = '#fbbf24'; // Emas
                    ctx.fillText("● ONLINE", gx + 10, gy - 38);
                } else {
                    // Opsional: Label Bot
                    // ctx.font = '8px Arial';
                    // ctx.fillStyle = '#94a3b8';
                    // ctx.fillText("[NPC]", gx + 10, gy - 38);
                }

                ctx.restore();
            }

            // --- FIX: MENAMBAHKAN FUNGSI DRAW NPC YANG HILANG ---
            function drawNPC(ctx, n) {
                // 1. Cek Apakah NPC Aktif (Sesuai Jadwal/Syarat)
                // Jika tidak aktif, jangan gambar apapun
                if (!isNPCActive(n)) return;

                const x = n.x * TILE_SIZE;
                const y = n.y * TILE_SIZE;

                // UPDATE: Gunakan ukuran Custom jika ada, default 32x48
                const dw = n.w || 32;
                const dh = n.h || 48;

                // 2. Gambar Bayangan (Dinamis mengikuti ukuran)
                // Bayangan tetap di tanah (y asli) meskipun NPC melayang
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.beginPath();
                ctx.ellipse(x + dw / 2, y + dh - 5, dw / 3, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                // --- Floating effect untuk fairy NPCs dan dewi_roro ---
                // Rara Wilis: efek nafas saja (tidak naik-turun), yang lain tetap melayang
                let visualY = y;
                if (n.id === 'rara_wilis') {
                    // Tidak ada offset Y — Rara Wilis berdiri di tanah
                    // Efek nafas ditangani lewat alpha/scale saat render
                } else if (n.id === 'dewi_roro' || n.type === 'fairy_npc') {
                    const floatOffset = Math.sin(Date.now() / 500) * 5 - 8;
                    visualY = y + floatOffset;
                }

                // 3. Load & Gambar Sprite NPC
                // Support n.sprite (fairy NPCs) sebagai alias n.imgSrc
                if (!n.imgSrc && n.sprite) n.imgSrc = n.sprite;
                if (!n.loadedImg) {
                    n.loadedImg = new Image();
                    n.loadedImg.src = n.imgSrc || 'images/girl-idle.png';

                    // --- NEW: FALLBACK GAMBAR NPC JIKA GAGAL LOAD ---
                    n.loadedImg.onerror = function () {
                        this.onerror = null;
                        if (n.id === 'pohon_energi') this.src = 'images/pohonperi.png';
                        else if (n.id === 'rara_wilis') this.src = 'images/rarawilis.png';
                        else if (n.id === 'fv_wening' || n.id === 'peri_kecil_1') this.src = 'images/wening.png';
                        else if (n.id === 'fv_sekar'  || n.id === 'peri_kecil_2') this.src = 'images/sekar.png';
                        else if (n.id === 'fv_bening' || n.id === 'peri_kecil_3') this.src = 'images/bening.png';
                        else if (n.id === 'fv_juna') this.src = 'images/juna.png';
                        else if (n.id.includes('kaia')) this.src = 'images/girl-idle.png';
                        else if (n.id.includes('child')) this.src = 'images/boy-idle.png';
                        else if (n.id.includes('lover1girl')) this.src = 'images/girl.png';
                        else this.src = 'images/boy.png';
                        console.warn(`Fallback image loaded for NPC: ${n.name}`);
                    };
                }

                if (n.loadedImg.complete && n.loadedImg.naturalWidth !== 0) {
                    ctx.save();

                    // --- NEW: EFEK CAHAYA BULAN (KHUSUS DEWI ARSA) ---
                    if (n.id === 'dewi_arsa') {
                        // A. Aura Lingkaran Bercahaya (Gradient)
                        const cx = x + dw / 2;
                        const cy = visualY + dh / 2; // Gunakan visualY
                        const pulse = 1 + Math.sin(Date.now() / 600) * 0.15; // Denyut cahaya pelan

                        // Gradient: Putih Terang -> Kuning Pucat -> Transparan
                        const grad = ctx.createRadialGradient(cx, cy, 15, cx, cy, 55 * pulse);
                        grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
                        grad.addColorStop(0.5, 'rgba(254, 240, 138, 0.25)'); // Kuning rembulan
                        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 60, 0, Math.PI * 2);
                        ctx.fill();

                        // B. Efek Kilauan Bintang (Sparkles)
                        // Muncul acak di sekitar area tubuh
                        if (Math.random() < 0.3) { // 30% chance per frame render
                            ctx.fillStyle = '#fff';
                            // Random posisi di sekitar NPC
                            const sx = x + (Math.random() * dw * 1.5) - (dw * 0.25);
                            const sy = visualY + (Math.random() * dh * 1.2) - (dh * 0.1);

                            // Gambar bintang kecil (Cross shape)
                            const size = Math.random() * 3;
                            ctx.fillRect(sx, sy, size, 1);
                            ctx.fillRect(sx + (size / 2) - 0.5, sy - (size / 2) + 0.5, 1, size);
                        }

                        // C. Glow pada Sprite Karakter
                        ctx.shadowColor = '#fef08a'; // Kuning Muda Bercahaya
                        ctx.shadowBlur = 25;
                    }

                    // --- NEW: EFEK CAHAYA BUNGA & SPIRIT (KHUSUS DEWI RORO) ---
                    if (n.id === 'dewi_roro') {
                        // A. Aura Suci (Pink & Putih Lembut)
                        const cx = x + dw / 2;
                        const cy = visualY + dh / 2; // Aura mengikuti posisi melayang
                        const pulse = 1 + Math.sin(Date.now() / 400) * 0.1; // Denyut lebih cepat

                        const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 50 * pulse);
                        grad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
                        grad.addColorStop(0.6, 'rgba(244, 114, 182, 0.3)'); // Pink lembut
                        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 55, 0, Math.PI * 2);
                        ctx.fill();

                        // B. Spawn Partikel Bunga & Spirit Melayang
                        if (Math.random() < 0.2) { // 20% chance per frame
                            // Random: Kadang bunga (Note Icon), Kadang Spirit Orb (Lingkaran)
                            const pType = Math.random() < 0.3 ? 'note' : 'spirit_aura';

                            STATE.particles.push({
                                x: cx + (Math.random() * 50 - 25),
                                y: cy + (Math.random() * 60 - 20),
                                vx: (Math.random() - 0.5) * 0.3, // Goyang horizontal pelan
                                vy: -0.5 - Math.random(), // Naik ke atas
                                life: 80,
                                color: pType === 'note' ? '#fbcfe8' : '#ffffff', // Bunga Pink atau Spirit Putih
                                type: pType,
                                icon: '🌸', // Icon Bunga jika type note
                                size: pType === 'note' ? 10 : (2 + Math.random() * 3) // Ukuran Orb
                            });
                        }

                        // C. Glow Pink pada Karakter
                        ctx.shadowColor = '#f9a8d4'; // Pink Glow
                        ctx.shadowBlur = 20;
                    }

                    // --- BIRTHDAY CAKE ICON ABOVE NPC ON THEIR BIRTHDAY ---
                    if (isNpcBirthdayToday(n.id)) {
                        ctx.save();
                        const floatY = Math.sin(Date.now() / 350) * 4;
                        ctx.font = '18px Arial';
                        ctx.textAlign = 'center';
                        ctx.shadowColor = 'rgba(255,220,0,0.9)';
                        ctx.shadowBlur = 8;
                        ctx.fillText('🎂', x + dw / 2, visualY - 10 + floatY);
                        ctx.restore();
                    }

                    // --- NEW: RENDER IKON HATI DI ATAS KEPALA PASANGAN (JIKA MENIKAH) ---
                    if (STATE.player.married && STATE.player.spouseId === n.id) {
                        ctx.save();
                        const floatY = Math.sin(Date.now() / 400) * 3; // Animasi naik turun halus

                        ctx.font = '16px Arial';
                        ctx.textAlign = 'center';
                        ctx.shadowColor = 'rgba(255,255,255,0.8)';
                        ctx.shadowBlur = 5;

                        // Gambar Hati di atas kepala (y - 20 dari posisi kaki - tinggi sprite)
                        // Tinggi sprite rata-rata ~50px
                        ctx.fillText('💖', x + dw / 2, visualY - dh + 10 + floatY);

                        ctx.restore();
                    }

                    // UPDATE: Logika Animasi (Static vs Moving)
                    // --- EFEK NAFAS & AURA (KHUSUS RARA WILIS) ---
                    if (n.id === 'rara_wilis') {
                        const cx = x + dw / 2;
                        const cy = visualY + dh / 2;
                        // Denyut aura: sangat pelan seperti nafas
                        const breathPulse = 1 + Math.sin(Date.now() / 1200) * 0.12;
                        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 45 * breathPulse);
                        grad.addColorStop(0, 'rgba(216, 180, 254, 0.45)');   // Ungu lembut
                        grad.addColorStop(0.6, 'rgba(167, 139, 250, 0.2)');
                        grad.addColorStop(1, 'rgba(216, 180, 254, 0)');
                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 50, 0, Math.PI * 2);
                        ctx.fill();
                        // Kilau bintang kecil sesekali
                        if (Math.random() < 0.2) {
                            ctx.fillStyle = 'rgba(255,255,255,0.85)';
                            const sx3 = x + (Math.random() * dw * 1.4) - (dw * 0.2);
                            const sy3 = visualY + (Math.random() * dh * 1.1) - (dh * 0.05);
                            ctx.beginPath(); ctx.arc(sx3, sy3, Math.random()*2+0.5, 0, Math.PI*2); ctx.fill();
                        }
                        ctx.shadowColor = '#c4b5fd';
                        ctx.shadowBlur = 18;
                    }

                    // Semua NPC Darat (Static, Wander, Animal) sekarang menggunakan efek BERNAFAS yang sama
                    if (n.type !== 'swimmer') {
                        // Efek Bernapas: Scale Y berubah sedikit (1.0 hingga 1.02) agar terlihat hidup
                        const breathe = 1 + Math.sin(Date.now() / 300) * 0.02;

                        // Brightness seperti player untuk peri kecil
                        const isFairySmall = ['fv_wening','fv_sekar','fv_bening','fv_juna',
                                              'peri_kecil_1','peri_kecil_2','peri_kecil_3'].includes(n.id);
                        if (isFairySmall) ctx.filter = 'brightness(1.25) saturate(1.1)';

                        // Set Pivot ke Kaki Tengah agar tumbuh ke atas (menapak tanah)
                        ctx.translate(Math.round(x + dw / 2), Math.round(visualY + dh - 5));
                        ctx.scale(1, breathe);

                        // Cek Arah Gerak untuk Flip Horizontal
                        if (n.vx < 0) {
                            ctx.scale(-1, 1); // Hadap Kiri
                        }

                        // Gambar Image (Offset negatif karena pivot ada di bawah tengah)
                        ctx.drawImage(n.loadedImg, -dw / 2, -dh, dw, dh);

                        // Reset filter setelah draw peri
                        if (isFairySmall) ctx.filter = 'none';
                    }
                    else {
                        // Khusus NPC Perenang (Swimmer): Tetap mengapung (bobbing) di air
                        const animY = Math.sin(Date.now() / 300) * 2;

                        const drawY = y - 5 + animY;

                        if (n.vx < 0) {
                            ctx.translate(x + dw, drawY);
                            ctx.scale(-1, 1);
                            ctx.drawImage(n.loadedImg, 0, 0, dw, dh);
                        } else {
                            ctx.drawImage(n.loadedImg, x, drawY, dw, dh);
                        }
                    }

                    ctx.restore();
                } else {
                    // Fallback: Kotak Warna jika gambar belum load
                    ctx.fillStyle = '#fca5a5';
                    ctx.fillRect(x + 5, y, dw - 10, dh - 10);
                }

                // Sparkle efek di atas fairy NPC (dialogFn)
                if (n.dialogFn && Math.random() < 0.15) {
                    ctx.fillStyle = 'rgba(255,220,255,0.8)';
                    const sx2 = x + Math.random() * dw;
                    const sy2 = visualY - Math.random() * 20;
                    ctx.beginPath(); ctx.arc(sx2, sy2, 1.5, 0, Math.PI*2); ctx.fill();
                }

                // 4. Nama NPC Fairy (Tampilkan di atas kepala) — skip jika noNameTag
                if (n.dialogFn && !n.noNameTag) {
                    // Nametag pakai posisi y TETAP (bukan visualY) agar tidak ikut naik-turun
                    const nw2 = Math.max(50, (n.name || 'NPC').length * 7 + 10);
                    const ncx = x + dw/2;
                    const ncy2 = y + 4;  // posisi tetap, tidak ikut float
                    ctx.fillStyle = 'rgba(0,0,0,0.65)';
                    ctx.beginPath();
                    if(ctx.roundRect) ctx.roundRect(ncx-nw2/2, ncy2-12, nw2, 14, 4);
                    else ctx.rect(ncx-nw2/2, ncy2-12, nw2, 14);
                    ctx.fill();
                    ctx.fillStyle = '#fde68a';
                    ctx.font = 'bold 9px Nunito,Fredoka,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(n.name || '', ncx, ncy2 - 5);
                    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';

                    // Tanda "!" saat player dekat
                    const pCX2 = STATE.player.x + (STATE.player.w||38)/2;
                    const pCY2 = STATE.player.y + (STATE.player.h||58)/2;
                    const nDist = Math.hypot(pCX2 - (x + dw/2), pCY2 - (visualY + dh/2));
                    if (nDist < 90) {
                        const floatY2 = Math.sin(Date.now() / 200) * 3;
                        ctx.fillStyle = '#fbbf24';
                        ctx.font = 'bold 16px serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('!', ncx, ncy2 - 22 + floatY2);
                        ctx.textAlign = 'left';
                    }
                } else if (n.dialogFn && n.noNameTag) {
                    // Hanya tanda "!" saat player dekat — tanpa nametag
                    const pCX2 = STATE.player.x + (STATE.player.w||38)/2;
                    const pCY2 = STATE.player.y + (STATE.player.h||58)/2;
                    const nDist = Math.hypot(pCX2 - (x + dw/2), pCY2 - (visualY + dh/2));
                    if (nDist < 90) {
                        const ncx = x + dw/2;
                        const ncy2 = y + 4;
                        const floatY2 = Math.sin(Date.now() / 200) * 3;
                        ctx.fillStyle = '#fbbf24';
                        ctx.font = 'bold 16px serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('!', ncx, ncy2 - 22 + floatY2);
                        ctx.textAlign = 'left';
                    }
                }

                // 4b. Nama Warga Biasa & Indikator Quest
                /* UPDATE: LABEL NAMA NPC DIHILANGKAN SESUAI REQUEST (CUKUP BANGUNAN SAJA) */
                /*
                ctx.font = 'bold 8px "Exo 2"';
                ctx.textAlign = 'center';
                
                // Stroke Hitam untuk nama agar terbaca
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.strokeText(n.name, x + dw/2, y - 8);
                
                ctx.fillStyle = '#fff';
                ctx.fillText(n.name, x + dw/2, y - 8);
                */

                // Indikator Quest/Interaksi (Tanda Seru) jika dekat
                // Opsional: Bisa ditambahkan logika jarak jika ingin

                // ─── MENTOR NOTIFICATION BUBBLE ─────────────────────────
                if (n.id === 'mentor' && window._mentorBubble) {
                    const bx = x + dw / 2;
                    const by = visualY - dh - 14;
                    const pulse = 0.85 + Math.sin(Date.now() / 350) * 0.15; // denyut
                    ctx.save();
                    ctx.translate(bx, by);
                    ctx.scale(pulse, pulse);

                    // Balon
                    ctx.fillStyle   = window._mentorBubble.color || '#fbbf24';
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth   = 1.5;
                    ctx.beginPath();
                    ctx.roundRect(-14, -14, 28, 22, 6);
                    ctx.fill();
                    ctx.stroke();

                    // Ekor balon kecil ke bawah
                    ctx.beginPath();
                    ctx.moveTo(-4, 8); ctx.lineTo(0, 16); ctx.lineTo(4, 8);
                    ctx.closePath(); ctx.fill();

                    // Ikon teks
                    ctx.font      = 'bold 12px serif';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'white';
                    ctx.shadowColor = 'rgba(0,0,0,0.4)';
                    ctx.shadowBlur  = 3;
                    ctx.fillText(window._mentorBubble.icon || '!', 0, 2);

                    ctx.restore();
                }
            }

            // --- FIX: MENAMBAHKAN FUNGSI DRAW ENEMY YANG HILANG (INI PENYEBAB MONSTER INVISIBLE) ---
            function drawEnemy(ctx, e) {
                // 1. Gambar Bayangan
                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.beginPath();
                ctx.ellipse(e.x + e.w / 2, e.y + e.h - 2, e.w / 2 - 5, 5, 0, 0, Math.PI * 2);
                ctx.fill();

                // 2. Efek Hit Flash (Kedip saat dipukul)
                if (e.hp < e.maxHp && Math.random() < 0.1) {
                    ctx.globalAlpha = 0.7; // Transparan sebentar
                }

                // 3. Tentukan Gambar Monster (Berdasarkan Tier/Boss)
                let img = null;

                // Cek apakah monster punya key gambar spesifik (enemy1, enemy2, dst)
                if (e.imgKey && dungeonAssets[e.imgKey]) {
                    img = dungeonAssets[e.imgKey];
                }
                // Fallback untuk Boss
                else if (e.isBoss) {
                    img = dungeonAssets.boss;
                }
                // Fallback default
                else {
                    img = dungeonAssets.enemy1;
                }

                if (img && img.complete && img.naturalWidth !== 0) {
                    ctx.save();

                    // Efek Bernapas/Wobble Monster (Agar terlihat hidup)
                    const wobble = Math.sin(Date.now() / 150 + e.animOffset) * 0.05;
                    const scaleX = 1 + wobble;
                    const scaleY = 1 - wobble;

                    // Pivot di tengah monster
                    const cx = e.x + e.w / 2;
                    const cy = e.y + e.h / 2;

                    ctx.translate(cx, cy);
                    // Flip jika musuh bergerak ke kiri (mengejar player di kiri)
                    // Hitung arah berdasarkan posisi player relative
                    if (STATE.player.x < e.x) ctx.scale(-scaleX, scaleY);
                    else ctx.scale(scaleX, scaleY);

                    // Gambar sprite
                    // Pastikan drawImage menggunakan ukuran e.w dan e.h
                    ctx.drawImage(img, -e.w / 2, -e.h / 2, e.w, e.h);

                    ctx.restore();
                } else {
                    // Fallback: Kotak Merah jika gambar gagal load
                    ctx.fillStyle = e.color || '#ef4444';
                    ctx.fillRect(e.x, e.y, e.w, e.h);
                }

                ctx.globalAlpha = 1.0; // Reset Alpha

                // 4. HP Bar Monster
                const hpPct = Math.max(0, e.hp / e.maxHp);
                const barW = e.w;
                const barH = 4;

                // Background Bar
                ctx.fillStyle = '#000';
                ctx.fillRect(e.x, e.y - 10, barW, barH);

                // Fill Bar
                ctx.fillStyle = e.isBoss ? '#b91c1c' : '#fbbf24'; // Merah tua utk Boss, Kuning utk Kroco
                ctx.fillRect(e.x, e.y - 10, barW * hpPct, barH);
            }

            // --- NEW FUNCTION: RENDER INVENTORY (DENGAN ACTION KLIK) ---
            function renderInventory() {
                const grid = document.getElementById('inventory-grid');
                grid.innerHTML = '';

                const inv = STATE.player.inventory || {};
                let hasItem = false;

                // DATABASE ITEM UPDATE: Tambahkan Item Dungeon & Legendary & Consumables
                const ITEM_DB = {
                    // --- NEW: ITEM IJAZAH SARJANA ---
                    'ijazah_teknologi': { name: 'Ijazah S.Kom', icon: '🎓', desc: 'Bukti kelulusan Sarjana Teknologi.', img: 'images/ijazah-teknologi.png' },
                    'ijazah_sejarah': { name: 'Ijazah S.Hum', icon: '📜', desc: 'Bukti kelulusan Sarjana Sejarah.', img: 'images/ijazah-sejarah.png' },

                    // --- NEW: ITEM SERTIFIKAT PEKERJA ---
                    'sertifikat_manajer': { name: 'Sertifikat Profesi', icon: '👔', desc: 'Sertifikat Kompetensi Manajer Profesional (BNSP).', img: 'images/sertifikat-manajer.png' },
                    // --- [FIX] BIBIT RAFFLESIA (AGAR BISA DITANAM) ---
                    'bibit_rafflesia': {
                        name: 'Bibit Rafflesia',
                        icon: '🌰',
                        type: 'consumable',
                        action: 'plant_rafflesia', // <--- PENTING: Aksi menanam
                        desc: 'Bibit bunga legendaris. Tanam di ladang.',
                        img: 'images/biji.png'
                    },
                    // --- NEW: BUNGA RAFFLESIA ARNOLDI (HASIL PANEN) ---
                    'bunga_rafflesia': {
                        name: 'Rafflesia Arnoldi',
                        icon: '🌺',
                        desc: 'Pusaka Alam Legendaris. Hasil panen yang sangat mahal.',
                        img: 'images/rafflesia.png'
                    },


                    // --- UPDATE: IKAN-IKAN BARU ---
                    'ikan_kecil': { name: 'Ikan Kecil', img: 'images/ikankecil.png', type: 'consumable', action: 'eat_fish_small', desc: 'Makan: +10 Energi. Ikan mungil biasa.' },
                    'ikan_sedang': { name: 'Ikan Sedang', img: 'images/ikansedang.png', type: 'consumable', action: 'eat_fish_medium', desc: 'Makan: +25 Energi. Lumayan mengenyangkan.' },
                    'ikan_besar': { name: 'Ikan Besar', img: 'images/ikanbesar.png', type: 'consumable', action: 'eat_fish_large', desc: 'Makan: +50 Energi. Ikan tangkapan mantap!' },
                    'ikan_legendary': { name: 'Ikan Legendaris', img: 'images/ikanlegendary.png', type: 'consumable', action: 'eat_fish_legend', desc: 'Makan: FULL Energi. Sangat langka & mahal!' },

                    // Komoditas & Makanan (Sekarang Bisa Dimakan!)
                    'ikan_segar': { name: 'Ikan Bakar', icon: '🐟', type: 'consumable', action: 'eat_fish', desc: 'Makan: Energi +15' }, // Legacy item
                    'gandum': { name: 'Roti Gandum', icon: '🍞', type: 'consumable', action: 'eat_bread', desc: 'Makan: Energi +20' },
                    'coklat': { name: 'Coklat Bar', icon: '🍫', type: 'consumable', action: 'eat_choco', desc: 'Ngemil: Energi +10' },

                    // --- MAKANAN SIAP MAKAN (Beli di pedagang / merchant) ---
                    'nasi_bungkus': { name: 'Nasi Bungkus', icon: '🍱', type: 'consumable', action: 'eat_nasi_bungkus', desc: 'Makan: Energi +30. Nasi hangat dari warung.' },
                    'telor': { name: 'Telur Ayam', icon: '🥚', type: 'consumable', action: 'eat_telor', desc: 'Bahan masak atau dimakan langsung: Energi +12.' },
                    'tempe': { name: 'Tempe Mentah', icon: '🟫', type: 'consumable', action: 'eat_tempe', desc: 'Bahan masak bergizi. Protein nabati murah meriah.' },
                    'obat': { name: 'Obat Generik', icon: '💊', type: 'consumable', action: 'use_obat', desc: 'Sembuhkan HP +30 saat sakit.' },

                    'kain': { name: 'Kain Sutra', icon: '🧵', desc: 'Bahan tekstil halus.' },
                    'bunga': { name: 'Bunga', icon: '🌹', desc: 'Hadiah romantis.' },

                    // Item Dungeon (Tiered)
                    'besi': { name: 'Bijih Besi', icon: '⛓️', desc: 'Material dasar (Rare).' },
                    'permata': { name: 'Berlian', icon: '💎', desc: 'Batu mulia (Epic).' },
                    'scroll_exp': { name: 'Gulungan Kuno', icon: '📜', desc: 'Berisi ilmu kuno (+EXP).' },

                    // Legendary Boss Drops
                    'zirah_legend': { name: 'Zirah Abadi', icon: '🛡️', desc: 'Armor Legendaris (Pasif: Def++).' },
                    'cincin_legend': { name: 'Cincin Raja', icon: '💍', desc: 'Cincin Legendaris (Pasif: Gold++).' },

                    // --- NEW: ITEM VIRAL (SOSMED TRENDS) ---
                    'kerupuk_mentah': { name: 'Kerupuk Mentah', icon: '⚪', desc: 'Bahan Seblak Viral. Jual ke Merchant saat tren!' },
                    'biji_kopi': { name: 'Biji Kopi', icon: '🫘', desc: 'Bahan Kopi Senja. Wangi aromanya.' },
                    'bola_plastik': { name: 'Lato-lato', icon: '🧶', desc: 'Mainan viral. Tek tek tek!' },
                    'adonan_pastry': { name: 'Adonan Croffle', icon: '🥐', desc: 'Bahan kue Croffle kekinian.' },

                    // NEW: ITEM BIBIT PERTANIAN (UPDATE: DIBUAT CONSUMABLE)
                    'bibit_padi': { name: 'Bibit Padi', icon: '🌾', type: 'consumable', action: 'plant_padi', desc: 'Tanam di lahan. Panen jadi Beras.' },
                    'bibit_jagung': { name: 'Bibit Jagung', icon: '🌽', type: 'consumable', action: 'plant_jagung', desc: 'Bibit jagung manis unggulan. Panen jadi Jagung.' },
                    'bibit_tomat': { name: 'Bibit Tomat', icon: '🍅', type: 'consumable', action: 'plant_tomat', desc: 'Cepat tumbuh dan segar. Panen jadi Tomat.' },
                    'pupuk': { name: 'Pupuk', icon: '💩', type: 'consumable', action: 'use_pupuk', desc: 'Mempercepat pertumbuhan tanaman.' },

                    // --- HASIL PANEN PERTANIAN ---
                    'beras': { name: 'Beras', icon: '🌾', type: 'consumable', action: 'eat_rice', desc: 'Makan: Energi +25. Hasil panen padi.' },
                    'jagung_panen': { name: 'Jagung', icon: '🌽', type: 'consumable', action: 'eat_corn', desc: 'Makan: Energi +20. Hasil panen jagung.' },
                    'tomat_panen': { name: 'Tomat', icon: '🍅', type: 'consumable', action: 'eat_tomato', desc: 'Makan: Energi +15. Hasil panen tomat.' },

                    // NEW: ITEM CINCIN KAYU (ROLE FAMILY)
                    'cincin_kayu': { name: 'Cincin Kayu', icon: '💍', desc: 'Cincin sederhana untuk melamar pasangan.' },
                    // NEW: ITEM PAKAIAN NIKAH (ROLE FAMILY)
                    'pakaian_nikah': { name: 'Baju Pengantin', icon: '👘', desc: 'Busana sakral untuk akad nikah.' },

                    // --- DOKUMEN LAMARAN KERJA ---
                    'ijazah':            { name: 'Ijazah SMA/SMK',       icon: '🎓', desc: 'Bukti kelulusan sekolah. Wajib saat melamar kerja.' },
                    'cv':                { name: 'Curriculum Vitae',      icon: '📋', desc: 'Riwayat hidup & keahlian. Buat di Meja Belajar (500G).' },
                    'foto_3x4':          { name: 'Pas Foto 3×4',          icon: '📸', desc: 'Foto formal 3×4. Dilampirkan saat melamar.' },
                    'ktp':               { name: 'Fotokopi KTP',           icon: '🪪', desc: 'Identitas resmi. Beli di Merchant.' },
                    'surat_sehat':       { name: 'Surat Keterangan Sehat', icon: '🏥', desc: 'Dari Dr. Budi. Wajib untuk melamar di Klinik.' },
                    'skck':              { name: 'SKCK',                   icon: '🚔', desc: 'Surat Kelakuan Baik dari Kepolisian.' },
                    'sertifikat':        { name: 'Sertifikat Keahlian',    icon: '🏆', desc: 'Nilai tambah saat melamar kerja.' },
                    'portofolio':        { name: 'Portofolio Karya',       icon: '🗂️', desc: 'Kumpulan karya untuk melamar di bidang kreatif.' },
                    // Amplop Lamaran (hasil minigame meja belajar)
                    'amplop_merchant':      { name: 'Amplop Lamaran — Merchant',  icon: '📨', desc: '⚠️ Serahkan HANYA ke Pak Hendra di Toko Merchant!' },
                    'amplop_blacksmith':    { name: 'Amplop Lamaran — Bengkel',   icon: '📨', desc: '⚠️ Serahkan HANYA ke Bang Joko di Bengkel!' },
                    'amplop_marine_tailor': { name: 'Amplop Lamaran — Butik',     icon: '📨', desc: '⚠️ Serahkan HANYA ke Bu Marine di Butik!' },
                    'amplop_lover1boy':     { name: 'Amplop Lamaran — Klinik',    icon: '📨', desc: '⚠️ Serahkan HANYA ke Dr. Budi di Klinik!' },

                    // Consumables (Bisa Dipakai)
                    'tonic_stamina': { name: 'Tonic Stamina', icon: '⚡🧪', type: 'consumable', action: 'useStamina', desc: 'Pulihkan 100% Energi.' },
                    'tonic_kebal': { name: 'Tonic Kebal', icon: '🛡️🧪', type: 'consumable', action: 'useImmune', desc: 'Kebal serangan 10 detik.' },

                    // Quest Items (Gambar Dinamis via Logic di bawah)
                    'draft_proposal': { name: 'Draft Skripsi', icon: '📑', desc: 'Bahan proposal (Quest Tahun 3).' },
                    'buku_tesis': { name: 'Buku Tesis', icon: '📖', desc: 'Syarat kelulusan.' },

                    // ══════════════════════════════════════════════════════════
                    // 📜 ITEM EKSKLUSIF — KISAH LELUHUR LAMONGAN
                    // Reward khusus dari side quest folktale Ki Lamong
                    // ══════════════════════════════════════════════════════════
                    'gulungan_mbahlamong': {
                        name: 'Gulungan Mbah Lamong',
                        icon: '📜',
                        type: 'consumable',
                        action: 'baca_gulungan_mbahlamong',
                        desc: 'Tulisan bijak Mbah Lamong. Dibaca: INT+5 permanen (sekali saja).'
                    },
                    'kalung_nelayan': {
                        name: 'Kalung Nelayan Brondong',
                        icon: '🪬',
                        desc: 'Kalung keberuntungan dari Ki Lamong. Pasif: Chance ikan langka +10% saat memancing.'
                    },
                    'keris_penjaga': {
                        name: 'Keris Penjaga Cerita',
                        icon: '⚔️',
                        desc: 'Keris pusaka Ki Lamong. Reward menyelesaikan semua 4 Kisah Leluhur. Pasif: +5 semua stat. Kunci portal Kahyangan Wilis.'
                    },
                    'kalung_mutiara_laut': {
                        name: 'Kalung Mutiara Laut',
                        icon: '🪬',
                        desc: 'Kalung leluhur para peri laut. Tersimpan di palung gelap dungeon. Quest Putri Duyung.'
                    },
                    'cahaya_arsa': {
                        name: 'Cahaya Arsa',
                        icon: '✨',
                        desc: 'Cahaya kebijaksanaan dari Dewi Arsa. Reward kunjungan ke-3 Kahyangan Wilis. Dibutuhkan untuk Ritual Pemulihan Kahyangan Wilis.'
                    },
                    'mahkota_wilis': {
                        name: 'Mahkota Wilis',
                        icon: '👑',
                        desc: 'Mahkota emas-zamrud milik Ratu Widadari Rara Wilis. Diberikan sebagai tanda Bhayangkara Kahyangan Wilis. Pasif: semua stat +10.',
                        use: () => { showToast("Mahkota Wilis bersinar hangat... Kamu adalah Bhayangkara Kahyangan Wilis yang diakui. Matur nuwun! ✨"); }
                    },
                    'kristal_roro': {
                        name: 'Kristal Roro',
                        icon: '💎',
                        desc: 'Kristal biru dari Dewi Roro. Tanda terima kasih atas laporan mekarnya Rafflesia. Kualitas magic tinggi.'
                    }
                };

                for (let key in inv) {
                    if (inv[key] > 0) {
                        hasItem = true;
                        // Clone objek agar tidak merubah DB asli saat modifikasi dinamis
                        let itemData = { ...(ITEM_DB[key] || { name: key.toUpperCase(), icon: '📦', desc: 'Item.' }) };

                        // --- LOGIKA GAMBAR DINAMIS BERDASARKAN JURUSAN ---
                        const major = STATE.player.major || 'teknologi';

                        // 1. UPDATE IMAGE BUKU TESIS
                        if (key === 'buku_tesis') {
                            if (major === 'sejarah') {
                                itemData.img = 'images/buku-tesis-sejarah.png';
                                itemData.name = 'Tesis Sejarah';
                            } else {
                                itemData.img = 'images/buku-tesis-teknologi.png';
                                itemData.name = 'Tesis Teknologi';
                            }
                        }

                        // 2. UPDATE IMAGE DRAFT PROPOSAL (Konsistensi dengan Dialog)
                        if (key === 'draft_proposal') {
                            if (major === 'sejarah') {
                                itemData.img = 'images/draftskripsi-sejarah.png';
                            } else {
                                itemData.img = 'images/draftskripsi-teknologi.png';
                            }
                        }

                        const div = document.createElement('div');
                        div.className = 'inv-item';

                        // Tambahkan efek klik jika consumable
                        if (itemData.type === 'consumable') {
                            div.style.cursor = 'pointer';
                            div.style.borderColor = '#10b981'; // Green border for usable
                            div.onclick = () => useInventoryItem(key, itemData.action);
                            div.title = "KLIK UNTUK MENGGUNAKAN: " + itemData.desc;
                        } else {
                            div.title = itemData.desc || "Item Koleksi";

                            // NEW: KLIK UNTUK LIHAT INFO (PENGGANTI TOOLTIP DI HP)
                            div.onclick = () => {
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                showDialogue(
                                    `INFO: ${itemData.name.toUpperCase()}`,
                                    itemData.desc || "Sebuah item misterius yang ditemukan di Nusantara Arsa.",
                                    [{ text: "Tutup", action: closeDialogue }],
                                    itemData.img
                                );
                            };

                        }

                        // Render Image jika ada (Prioritas), fallback ke Icon Emoji
                        let visualContent = `<div style="font-size:30px; margin-bottom:5px;">${itemData.icon}</div>`;

                        if (itemData.img) {
                            // Fallback icon jika gambar gagal load
                            const fallbackIcon = itemData.icon || '🐟';
                            visualContent = `<img src="${itemData.img}" style="width:32px; height:32px; margin-bottom:5px; object-fit:contain;" 
                                onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
                                <div style="font-size:30px; margin-bottom:5px; display:none;">${fallbackIcon}</div>`;
                        }

                        div.innerHTML = `
                <div class="inv-qty">${inv[key]}</div>
                ${visualContent}
                <span>${itemData.name}</span>
                <span style="font-size:8px; color:#94a3b8; margin-top:2px;">${itemData.type === 'consumable' ? '(Pakai/Makan)' : ''}</span>
            `;
                        grid.appendChild(div);
                    }
                }

                if (!hasItem) {
                    grid.innerHTML = '<div class="inv-empty-msg">Tas Kosong...<br>Belum ada item yang didapat.</div>';
                }
            }

            // --- NEW FUNCTION: USE ITEM LOGIC (EAT & DRINK) ---
            function useInventoryItem(id, action) {
                let consumed = false;

                // 1. TONIC STAMINA (FULL)
                if (action === 'useStamina') {
                    if (STATE.player.energy >= 100) {
                        showToast("Energi sudah penuh!");
                        return;
                    }
                    STATE.player.energy = 100;
                    showToast("⚡ STAMINA PULIH PENUH!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                    spawnFloatingText(STATE.player.x, STATE.player.y - 40, "MAX ENERGY!", "#fbbf24", 16); // Visual Teks
                    consumed = true;
                }
                // 2. TONIC KEBAL
                else if (action === 'useImmune') {
                    if (STATE.player.invincible) {
                        showToast("Efek Kebal Masih Aktif!");
                        return;
                    }
                    STATE.player.invincible = true;
                    STATE.player.shieldTimer = 600; // 10 detik (60fps)
                    showToast("🛡️ MODE KEBAL AKTIF (10 Detik)!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    spawnFloatingText(STATE.player.x, STATE.player.y - 40, "SHIELD ON!", "#60a5fa", 16); // Visual Teks
                    consumed = true;
                }

                // 📜 GULUNGAN MBAH LAMONG (Item Folktale Ki Lamong)
                else if (action === 'baca_gulungan_mbahlamong') {
                    handleGulunganMbahLamong();
                    return; // handleGulungan sudah urus pengurangan sendiri
                }

                // 3. MAKANAN & IKAN (FISH, BREAD, CHOCO)
                else if (action.startsWith('eat_')) {
                    consumed = true;
                    const energyGain = {
                        'eat_fish': 15, 'eat_bread': 20, 'eat_choco': 10,
                        'eat_fish_small': 10, 'eat_fish_medium': 25, 'eat_fish_large': 50, 'eat_fish_legend': 100,
                        'eat_rice': 25, 'eat_corn': 20, 'eat_tomato': 15,
                        'eat_nasi_bungkus': 30, 'eat_telor': 12, 'eat_tempe': 15
                    }[action] || 10;

                    if (STATE.player.energy >= 100) {
                        showToast("Kenyang! (Energi Penuh)");
                        return;
                    }
                    STATE.player.energy = Math.min(100, STATE.player.energy + energyGain);
                    const foodNames = { 'eat_nasi_bungkus':'Nasi bungkus', 'eat_telor':'Telur', 'eat_tempe':'Tempe', 'eat_bread':'Roti', 'eat_fish':'Ikan bakar' };
                    const fn = foodNames[action] || 'Makanan';
                    showToast(`${fn} dimakan! (+${energyGain} Energi) ⚡`);
                    spawnFloatingText(STATE.player.x, STATE.player.y - 40, `+${energyGain} ⚡`, "#4ade80", 14);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                }
                else if (action === 'use_obat') {
                    consumed = true;
                    const healAmt = 30;
                    STATE.player.hp = Math.min(STATE.player.maxHp || 100, (STATE.player.hp || 100) + healAmt);
                    showToast(`💊 Obat diminum. HP +${healAmt}`);
                    spawnFloatingText(STATE.player.x, STATE.player.y - 40, `+${healAmt} HP`, "#f87171", 14);
                }


                // --- [TAMBAHAN BARU] LOGIKA MENCANGKUL (HOE) ---
                else if (action === 'use_hoe') {
                    // 1. Cek Lokasi (Harus di Desa/Luar)
                    if (STATE.location !== 'village') {
                        showToast("Hanya bisa mencangkul di Luar Ruangan!");
                        return;
                    }

                    // 2. Cek Energi (Butuh 5)
                    if (STATE.player.energy < 5) {
                        showToast("Energi tidak cukup! (Butuh 5)");
                        return;
                    }

                    // 3. Hitung Posisi Tile di Bawah Kaki Pemain
                    const tx = Math.floor((STATE.player.x + 10) / TILE_SIZE);
                    const ty = Math.floor((STATE.player.y + 15) / TILE_SIZE);
                    const map = maps['village'];
                    const tIdx = ty * map.w + tx;

                    // 4. Cek Apakah Berdiri di Lahan Pertanian (Tile ID 5)
                    if (map.tiles[tIdx] !== 5) {
                        showToast("Ini bukan lahan pertanian! Cari tanah coklat.");
                        return;
                    }

                    // 5. Cek Status Tanah
                    const farmKey = `${tx}_${ty}`;
                    if (!STATE.player.farming) STATE.player.farming = {};

                    const crop = STATE.player.farming[farmKey];

                    if (crop && (crop.tilled || crop.type)) {
                        showToast("Tanah sudah gembur atau ada tanaman.");
                    } else {
                        // PROSES CANGKUL BERHASIL
                        STATE.player.energy -= 5;

                        // Set status tanah jadi tilled (gembur)
                        STATE.player.farming[farmKey] = { tilled: true };

                        // Efek Visual & Audio
                        createParticle(tx * TILE_SIZE, ty * TILE_SIZE, '#d97706'); // Partikel Tanah Coklat
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        showToast("Tanah berhasil digemburkan! ⛏️");

                        // Simpan Progress
                        manualSave();
                    }

                    // Cangkul adalah ALAT, jadi tidak dikonsumsi (consumed = false)
                    return;
                }







                // --- [TAMBAHAN BARU] LOGIKA MENANAM BIBIT ---
                else if (action.startsWith('plant_')) {
                    // 1. Cek Lokasi (Harus di Desa/Luar)
                    if (STATE.location !== 'village') {
                        showToast("Hanya bisa menanam di Luar Ruangan!");
                        return;
                    }

                    // --- NEW: CEK MUSIM DINGIN (WINTER) ---
                    if (STATE.season === 'winter') {
                        showToast("❄️ Tanah membeku! Tidak bisa menanam di Musim Dingin.");
                        // Mainkan suara error jika ada
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                        return;
                    }
                    // --------------------------------------

                    // 2. Hitung Posisi Tile di Bawah Kaki Pemain
                    // (x+10, y+15 adalah titik tengah kaki player 20x20)
                    const tx = Math.floor((STATE.player.x + 10) / TILE_SIZE);
                    const ty = Math.floor((STATE.player.y + 15) / TILE_SIZE);

                    // 3. Cek Apakah Berdiri di Atas Lahan Pertanian (Tile ID 5)
                    const map = maps['village'];
                    const tIdx = ty * map.w + tx;
                    if (map.tiles[tIdx] !== 5) {
                        showToast("Harus berdiri di Lahan Pertanian (Tanah Coklat)!");
                        return;
                    }

                    // 4. Cek Status Tanah (Harus Tilled & Belum Ada Tanaman)
                    const farmKey = `${tx}_${ty}`;

                    // Safety init
                    if (!STATE.player.farming) STATE.player.farming = {};

                    // Ambil data tanah saat ini
                    const farmData = STATE.player.farming[farmKey];

                    // UPDATE: VALIDASI TANAH GEMBUR
                    // Jika data tanah tidak ada ATAU belum dicangkul (tilled), tolak.
                    if (!farmData || !farmData.tilled) {
                        showToast("Tanah harus dicangkul dulu! (Gunakan Cangkul ⛏️)");
                        return;
                    }

                    // Jika sudah ada tanaman (type terisi), tolak.
                    if (farmData.type) {
                        showToast("Sudah ada tanaman di sini!");
                        return;
                    }

                    // 5. PROSES TANAM
                    // Ambil tipe tanaman dari action (contoh: 'plant_padi' -> 'padi')
                    const cropType = action.split('_')[1];

                    // Update data tanah yang sudah ada (pertahankan status tilled)
                    farmData.type = cropType;
                    farmData.stage = 1;       // 1 = Benih
                    farmData.watered = false; // Reset siram saat tanam baru

                    // Efek Visual & Audio
                    createParticle(tx * TILE_SIZE, ty * TILE_SIZE, '#4ade80'); // Partikel Hijau
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    showToast(`Berhasil menanam ${cropType.toUpperCase()}! 🌱`);

                    consumed = true; // Tandai item berhasil dipakai (untuk dikurangi)

                    // Opsional: Tutup tas otomatis biar langsung kelihatan hasilnya
                    toggleInventory();
                }
                // --- LOGIKA PUPUK (INSTANT GROW) ---
                else if (action === 'use_pupuk') {
                    if (STATE.location !== 'village') {
                        showToast("Hanya bisa dipakai di ladang!");
                        return;
                    }

                    const tx = Math.floor((STATE.player.x + 10) / TILE_SIZE);
                    const ty = Math.floor((STATE.player.y + 15) / TILE_SIZE);
                    const farmKey = `${tx}_${ty}`;

                    if (STATE.player.farming && STATE.player.farming[farmKey]) {
                        const crop = STATE.player.farming[farmKey];
                        if (crop.stage < 3) {
                            crop.stage++; // Langsung tumbuh 1 tahap
                            showToast("Tanaman tumbuh instan! ✨");
                            createParticle(tx * TILE_SIZE, ty * TILE_SIZE, '#fbbf24');
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            consumed = true;
                            toggleInventory();
                        } else {
                            showToast("Tanaman sudah siap panen!");
                        }
                    } else {
                        showToast("Tidak ada tanaman di sini.");
                    }
                }
                // --- [AKHIR TAMBAHAN] ---

                // Kurangi Item jika berhasil dikonsumsi
                if (consumed && STATE.player.inventory[id] > 0) {
                    STATE.player.inventory[id]--;
                    if (STATE.player.inventory[id] <= 0) delete STATE.player.inventory[id];
                    renderInventory(); // Refresh tampilan tas
                }
            }

            // --- NEW FUNCTION: HANDLE DROPS (BOSS & NORMAL) ---
            function handleEnemyDrop(en) {
                const lvl = STATE.dungeonLevel || 1;

                // Gold scale dengan dungeon level
                let gold = (500 + (lvl * 400)) + Math.floor(Math.random() * 500);
                let exp = 15 + (lvl * 10);

                // Bonus Cincin Raja (+50% gold)
                let ringBonusText = "";
                if ((STATE.player.inventory['cincin_legend'] || 0) > 0) {
                    gold = Math.floor(gold * 1.5);
                    ringBonusText = " 💍";
                }

                STATE.player.money += gold;
                STATE.player.reputation += 1;
                STATE.player.dailyMonsterKills = (STATE.player.dailyMonsterKills || 0) + 1;
                STATE.player.totalMonsterKills = (STATE.player.totalMonsterKills || 0) + 1; // TOTAL LIFETIME

                // --- QUEST DROP ---
                if (en.isQuestTarget) {
                    addItem('draft_proposal', 1);
                    STATE.player.activeQuest = null;
                    showDialogue("BERHASIL!", "Kamu menemukan Draft Skripsi yang dicuri!\nKembalikan ke Senior Kutubuku di Perpustakaan.", [
                        { text: "Ok, Kembali ke Desa", action: () => {
                            STATE.location = 'village';
                            STATE.player.x = 50 * TILE_SIZE; STATE.player.y = 15 * TILE_SIZE;
                            closeDialogue();
                            if (typeof AudioService !== 'undefined') AudioService.playBGM('village');
                        }}
                    ], 'images/monster-thief.png');
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    return;
                }

                // --- BOSS DROP ---
                if (en.isBoss) {
                    STATE.player.str += 5; STATE.player.int += 5;
                    STATE.player.biz += 5; STATE.player.reputation += 10;
                    STATE.player.maxHp += 50;
                    STATE.player.hp = STATE.player.maxHp;
                    STATE.player.energy = 100;
                    // 🎬 CINEMATIC BOSS DEFEATED
                    const _bossLvl = STATE.dungeonLevel || 1;
                    setTimeout(() => {
                        playCutsceneBossDefeated(_bossLvl, () => {
                            showToast(`👹 BOSS LV.${_bossLvl} TAKLUK! ALL STATS +5 · MAX HP +50`);
                        });
                    }, 600);
                }

                gainExp(exp);

                // --- DROP ITEM ---
                let dropText = "";
                let floatedItem = "";

                if (en.isBoss) {
                    if (Math.random() <= 0.25) {
                        const hasArmor = (STATE.player.inventory['zirah_legend'] || 0) > 0;
                        const hasRing  = (STATE.player.inventory['cincin_legend'] || 0) > 0;
                        let rareDrop = "";

                        if (!hasArmor) {
                            rareDrop = 'zirah_legend';
                            dropText = "🔥 LEGENDARY DROP: ZIRAH ABADI!";
                            floatedItem = "ZIRAH ABADI";
                        } else if (!hasRing) {
                            rareDrop = 'cincin_legend';
                            dropText = "💍 LEGENDARY DROP: CINCIN RAJA!";
                            floatedItem = "CINCIN RAJA";
                        } else {
                            rareDrop = Math.random() < 0.5 ? 'tonic_stamina' : 'tonic_kebal';
                            dropText = `🧪 DROP LANGKA: ${rareDrop.replace('_',' ').toUpperCase()}!`;
                            floatedItem = rareDrop.replace('_',' ').toUpperCase();
                        }

                        addItem(rareDrop, 1);

                        if (rareDrop === 'zirah_legend') {
                            setTimeout(() => {
                                playCutsceneLegendaryDrop(
                                    'ZIRAH ABADI 🛡️',
                                    'Armor terkuat di seluruh Dungeon.\nPasif: Damage musuh berkurang drastis.\n\n(Cek Lemari Pakaian di rumahmu!)',
                                    () => { if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); }
                                );
                            }, 1200);
                        } else if (rareDrop === 'cincin_legend') {
                            setTimeout(() => {
                                playCutsceneLegendaryDrop(
                                    'CINCIN RAJA 💍',
                                    'Cincin keabadian milik penguasa dungeon.\nPasif: Setiap membunuh musuh, Gold yang didapat 2x lipat.',
                                    () => { if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); }
                                );
                            }, 1200);
                        }
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    } else {
                        dropText = " (Boss Defeated)";
                    }
                } else {
                    // --- NORMAL DROP POOL (themed per level) ---
                    // Chance naik tiap level: 35% base + 5% per level
                    const chance = 0.35 + (lvl * 0.05);

                    if (Math.random() < chance) {
                        // Pool item per dungeon level — makin dalam makin berharga
                        const LOOT_POOLS = {
                            1: [ 'coklat','coklat','gandum','kain','bunga' ],
                            2: [ 'kain','kain','besi','coklat','scroll_exp' ],
                            3: [ 'besi','besi','permata','scroll_exp','tonic_stamina','kalung_mutiara_laut' ],
                            4: [ 'permata','permata','besi','scroll_exp','tonic_stamina','kalung_mutiara_laut' ],
                            5: [ 'permata','scroll_exp','scroll_exp','tonic_stamina','tonic_kebal' ]
                        };
                        const pool = LOOT_POOLS[Math.min(lvl, 5)];
                        const item = pool[Math.floor(Math.random() * pool.length)];

                        // Kalung Mutiara Laut — hanya bisa dapat 1, dan hanya jika quest Putri Duyung aktif
                        if (item === 'kalung_mutiara_laut') {
                            const hasKalung = !!(STATE.player.inventory && STATE.player.inventory['kalung_mutiara_laut']);
                            const questActive = STATE.player.duyungQuestStage === 1;
                            if (!hasKalung && questActive) {
                                addItem('kalung_mutiara_laut', 1);
                                dropText = " & 🪬 KALUNG MUTIARA LAUT! (Quest Putri Duyung)";
                                floatedItem = "KALUNG MUTIARA!";
                                setTimeout(() => showToast("🧜‍♀️ Kalung Putri Duyung ditemukan! Kembalikan ke pantai..."), 1000);
                            } else {
                                // Fallback ke permata
                                addItem('permata', 1);
                                dropText = " & 💎 Berlian";
                                floatedItem = "💎 Berlian";
                            }
                        } else if (item === 'scroll_exp') {
                            gainExp(100);
                            dropText = " & 📜 Gulungan Kuno (+100 EXP)";
                            floatedItem = "+100 EXP";
                        } else {
                            addItem(item, 1);
                            const itemName = { coklat:'🍫 Coklat', gandum:'🍞 Roti', kain:'🧵 Kain Sutra',
                                bunga:'🌹 Bunga', besi:'⛓️ Bijih Besi', permata:'💎 Berlian',
                                tonic_stamina:'⚡ Tonic Stamina', tonic_kebal:'🛡️ Tonic Kebal' }[item] || item;
                            dropText = ` & ${itemName}`;
                            floatedItem = itemName;
                        }
                    }
                }

                showToast(`+${gold.toLocaleString()} G${ringBonusText}${dropText}`);
                spawnFloatingText(en.x, en.y, `+${gold} G${ringBonusText}`, '#fbbf24', 12);
                if (floatedItem) spawnFloatingText(en.x, en.y - 15, floatedItem, '#4ade80', 12);

                createParticle(en.x, en.y, '#fbbf24');
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
            }

            function addItem(id, qty) {
                if (!STATE.player.inventory[id]) STATE.player.inventory[id] = 0;
                STATE.player.inventory[id] += qty;
            }

            // UPDATE ENEMY UNTUK CEK INVINCIBLE & DAMAGE REDUCTION
            function updateEnemies() {
                STATE.enemies.forEach((en, i) => {
                    // ... existing movement logic ...
                    en.x += en.knockback.x; en.y += en.knockback.y;
                    en.knockback.x *= 0.8; en.knockback.y *= 0.8;

                    if (Math.abs(en.knockback.x) < 0.5) {
                        const ang = Math.atan2(STATE.player.y - en.y, STATE.player.x - en.x);
                        en.angle = ang;
                        en.x += Math.cos(ang) * en.speed;
                        en.y += Math.sin(ang) * en.speed;
                    }

                    const d = Math.hypot(STATE.player.x - en.x, STATE.player.y - en.y);

                    // LOGIC HIT PEMAIN
                    if (d < 20) {
                        if (!STATE.player.invincible) {
                            // Damage Calculation dengan Zirah
                            let dmg = 0.5;
                            if (STATE.player.inventory['zirah_legend']) dmg = 0.2; // Diskon damage 60% jika punya zirah

                            STATE.player.hp -= dmg;

                            // --- NEW: TRIGGER DAMAGE EFFECTS ---
                            // Hanya trigger efek visual setiap beberapa frame agar tidak epilepsi (interval 30 frame / 0.5 detik)
                            if (!STATE.player.damageCooldown || STATE.player.damageCooldown <= 0) {

                                // 1. Set Timer Animasi Player (Sprite Merah)
                                STATE.player.hurtTimer = 15; // 15 Frame (~0.25 detik)

                                // 2. Trigger Overlay Merah (CSS Animation)
                                const dmgOverlay = document.getElementById('damage-overlay');
                                if (dmgOverlay) {
                                    dmgOverlay.classList.remove('damage-active');
                                    void dmgOverlay.offsetWidth; // Trigger Reflow
                                    dmgOverlay.classList.add('damage-active');
                                }

                                // 3. Trigger Screen Shake (CSS Animation pada Container)
                                const gameContainer = document.getElementById('game-container');
                                if (gameContainer) {
                                    gameContainer.classList.remove('shake-screen');
                                    void gameContainer.offsetWidth; // Trigger Reflow
                                    gameContainer.classList.add('shake-screen');
                                }

                                // 4. Efek Suara
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                                // 5. Partikel Darah
                                createParticle(STATE.player.x, STATE.player.y, '#ef4444');
                                createParticle(STATE.player.x, STATE.player.y, '#b91c1c');

                                // Cooldown visual agar tidak spamming
                                STATE.player.damageCooldown = 40;
                            }

                            if (STATE.player.damageCooldown > 0) STATE.player.damageCooldown--;

                            // if(Math.random()<0.1) createParticle(STATE.player.x, STATE.player.y, '#ef4444'); // Removed, replaced by deterministic particle above
                            if (STATE.player.hp <= 0) gameOver();
                        } else {
                            // Jika Kebal, Musuh Mental
                            en.knockback = { x: (en.x - STATE.player.x) * 0.5, y: (en.y - STATE.player.y) * 0.5 };
                        }
                    }

                    if (en.hp <= 0) {
                        STATE.enemies.splice(i, 1);
                        // PANGGIL DROP LOGIC BARU
                        handleEnemyDrop(en);
                    }
                });

                // --- NEW: UPDATE SHIELD TIMER ---
                if (STATE.player.shieldTimer > 0) {
                    STATE.player.shieldTimer--;
                    if (STATE.player.shieldTimer <= 0) {
                        STATE.player.invincible = false;
                        showToast("🛡️ Efek Kebal Habis.");
                    }
                }

                // CEK CLEARED CONDITION SEPERTI BIASA
                if (STATE.location === 'dungeon' && STATE.enemies.length === 0) {
                    // FIX: Semua musuh mati → pastikan dungeon ambience kembali (jika boss belum spawn)
                    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                        if (!STATE.bossSpawned && AudioService.currentTrack !== 'dungeon') {
                            AudioService.playBGM('dungeon');
                        }
                    }

                    if (STATE.dungeonLevel === 5 && !STATE.bossSpawned) {
                        spawnFinalBoss();
                        return;
                    }

                    const map = maps['dungeon'];
                    // Cek apakah portal sudah ada
                    const hasPortal = map.buildings.find(b => b.id === 'dungeon_next' || (b.id === 'dungeon_exit' && b.x === 20));

                    if (!hasPortal) {
                        if (STATE.dungeonLevel < 5) {
                            // UPDATE POSISI: Spawn Portal di Dinding Atas (Utara) agar seperti pintu
                            // Koordinat X: 19 (Tengah), Y: 1 (Lantai paling atas)
                            map.buildings.push({
                                id: 'dungeon_next',
                                x: 19, y: 1, w: 2, h: 2,
                                type: 'trigger',
                                entrance: { x: 19.5, y: 1.5, map: 'dungeon' }, // Titik tengah visual
                                name: `Portal Level ${STATE.dungeonLevel + 1}`,
                                open24h: true
                            });

                            // FIX: TAMBAHKAN EFEK SUARA SAAT PORTAL MUNCUL
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                            showToast("🌀 PORTAL TERBUKA! Lanjut ke Level Berikutnya (Cek Dinding Atas).");
                        } else {
                            // Level 5 (Boss) Selesai
                            showToast("🏆 DUNGEON CLEARED! Kamu mengalahkan BOSS!");
                            // Beri hadiah besar
                            STATE.player.money += 50000;
                            STATE.player.reputation += 50;
                            gainExp(500);
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                            // NEW: Munculkan Portal Pulang di Tengah Ruangan (Karena exit di pojok sudah hilang)
                            map.buildings.push({
                                id: 'dungeon_exit',
                                x: 20, y: 15, w: 2, h: 2,
                                type: 'trigger',
                                entrance: { x: 21, y: 16 },
                                name: "KEMBALI KE DESA (MENANG)",
                                open24h: true
                            });
                        }
                    }
                }
            }

            function gameOver() {
                // UPDATE: Gunakan gambar monster atau penjaga dungeon untuk dialog Game Over
                showDialogue("DEFEAT (KALAH)", "Kamu dikalahkan oleh monster ganas...\nPandanganmu menggelap. (Gold berkurang 10%)", [{
                    text: "... (Sadar di Klinik)", action: () => {
                        STATE.player.hp = 100;
                        STATE.player.energy = 50; // Bangun lemas
                        STATE.player.money = Math.floor(STATE.player.money * 0.9);

                        // FIX: UPDATE LOKASI RESPAWN KE DALAM KLINIK (SAMAKAN DENGAN PINGSAN ENERGI)
                        // Sebelumnya: STATE.location = 'village'; (Ini yang bikin muncul di luar)
                        STATE.location = 'clinic_interior';
                        STATE.player.x = 10 * TILE_SIZE; // Samping Bed Kanan
                        STATE.player.y = 8 * TILE_SIZE;
                        STATE.player.direction = 'left';

                        // FIX: Lompati hari (karena pingsan butuh pemulihan)
                        STATE.day = parseInt(STATE.day) + 1;
                        STATE.time = 800; // Bangun jam 08:00 Pagi

                        STATE.enemies = [];
                        closeDialogue();

                        // Update UI Waktu Segera
                        const currentDayName = DAYS_OF_WEEK[(STATE.day - 1) % 7];
                        const totalDays = STATE.day - 1;
                        const year = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;
                        document.getElementById('full-date-display').innerText = `${currentDayName}, D${(totalDays % DAYS_PER_SEASON) + 1} ${STATE.season.toUpperCase()} Y${year}`;
                        document.getElementById('clock-display').innerText = "08:00";

                        showToast("Dirawat Intensif oleh Dr. Budi 🏥");
                        manualSave();

                        // FIX: Munculkan Dialog Dokter Budi di Dalam Klinik
                        setTimeout(() => {
                            showDialogue("DR. BUDI", "Astaga! Kamu terluka parah di Dungeon!\n\nUntung Tim Penyelamat Guild menemukanmu tepat waktu dan membawamu ke sini.\n\nLuka-lukamu cukup serius. Saya sarankan jangan memaksakan diri melawan monster level tinggi jika belum siap.", [{ text: "Terima kasih Dok", action: closeDialogue }], 'images/lover1boy.png');
                        }, 500);

                    }
                }], 'images/monster.png');
            }

            // --- FIX: KEMBALIKAN FUNGSI MINIMAP YANG BENAR (SEBELUMNYA SALAH NAMA showDialogue) ---
            function drawMinimap() {
                const miniCanvas = document.getElementById('minimapCanvas');
                if (!miniCanvas) return;

                const minimapContainer = document.getElementById('minimap-container');

                // FIX: fairyVillage kini pakai minimap HTML utama (posisi bawah)
                // Selalu tampilkan minimap saat ingame (termasuk fairyVillage)
                if (minimapContainer) minimapContainer.style.display = '';

                const mCtx = miniCanvas.getContext('2d');
                mCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);

                // ── SPECIAL: Render peta Kahyangan Wilis di minimap HTML ──
                if (STATE.location === 'fairyVillage') {
                    const fv = (typeof getFairyVillage === 'function') ? getFairyVillage() : null;
                    if (!fv) return;

                    const FW2 = (typeof FW !== 'undefined') ? FW : 60;
                    const FH2 = (typeof FH !== 'undefined') ? FH : 40;
                    const TS2 = (typeof TS !== 'undefined') ? TS : 28;
                    const mW = miniCanvas.width, mH = miniCanvas.height;
                    const sx = mW / FW2, sy = mH / FH2;

                    // Background peta peri (hijau gelap)
                    mCtx.fillStyle = '#0f2e13';
                    mCtx.fillRect(0, 0, mW, mH);

                    // Bangunan selesai (biru ungu)
                    (fv.buildings || []).forEach(({slotId}) => {
                        if (typeof FAIRY_SLOTS === 'undefined') return;
                        const s = FAIRY_SLOTS.find(x => x.id === slotId);
                        if (!s) return;
                        mCtx.fillStyle = '#818cf8';
                        mCtx.fillRect(s.x * sx, s.y * sy, Math.max(3, sx * 2 + 1), Math.max(3, sy * 2 + 1));
                    });

                    // Bangunan konstruksi (kuning)
                    (fv.buildQueue || []).forEach(({slotId}) => {
                        if (typeof FAIRY_SLOTS === 'undefined') return;
                        const s = FAIRY_SLOTS.find(x => x.id === slotId);
                        if (!s) return;
                        mCtx.fillStyle = '#fbbf24';
                        mCtx.fillRect(s.x * sx, s.y * sy, Math.max(3, sx * 2 + 1), Math.max(3, sy * 2 + 1));
                    });

                    // Istana Peri (merah muda)
                    if (typeof FV_ISTANA_POS !== 'undefined') {
                        mCtx.fillStyle = '#f9a8d4';
                        mCtx.fillRect(FV_ISTANA_POS.x * sx, FV_ISTANA_POS.y * sy, sx * 3, sy * 3);
                    }

                    // Pohon Energi (hijau terang)
                    if (typeof FV_POHON_POS !== 'undefined') {
                        mCtx.fillStyle = '#4ade80';
                        mCtx.beginPath();
                        mCtx.arc(FV_POHON_POS.x * sx + sx, FV_POHON_POS.y * sy + sy, 4, 0, Math.PI * 2);
                        mCtx.fill();
                    }

                    // Rara Wilis (ungu muda)
                    if (typeof FV_RARA_POS !== 'undefined') {
                        mCtx.fillStyle = '#e9d5ff';
                        mCtx.beginPath();
                        mCtx.arc(FV_RARA_POS.x * sx + sx, FV_RARA_POS.y * sy + sy, 2.5, 0, Math.PI * 2);
                        mCtx.fill();
                    }

                    // Peri wandering (pink / biru)
                    if (typeof fvNpcRuntime !== 'undefined') {
                        (fv.fairies || []).forEach((f, idx) => {
                            const rt = fvNpcRuntime['fairy_' + f.id];
                            const fx = rt ? (rt.px / TS2) * sx : (FV_RARA_POS.x + 2 + idx % 3) * sx;
                            const fy = rt ? (rt.py / TS2) * sy : (FV_RARA_POS.y + 1 + Math.floor(idx / 3)) * sy;
                            mCtx.fillStyle = f.gender === 'girl' ? '#f472b6' : '#60a5fa';
                            mCtx.beginPath();
                            mCtx.arc(fx, fy, 2, 0, Math.PI * 2);
                            mCtx.fill();
                        });
                    }

                    // Player (kuning emas)
                    if (typeof fvPlayer !== 'undefined') {
                        const plx = (fvPlayer.x / TS2) * sx;
                        const ply = (fvPlayer.y / TS2) * sy;
                        mCtx.fillStyle = '#fbbf24';
                        mCtx.beginPath();
                        mCtx.arc(plx, ply, 4, 0, Math.PI * 2);
                        mCtx.fill();
                        mCtx.strokeStyle = '#fff';
                        mCtx.lineWidth = 1.5;
                        mCtx.beginPath();
                        mCtx.arc(plx, ply, 4, 0, Math.PI * 2);
                        mCtx.stroke();
                    }

                    // Label
                    const labelEl = document.getElementById('minimap-label');
                    if (labelEl) labelEl.innerText = '🧚 KAHYANGAN';
                    return;
                }

                // Ambil data map aktif (bisa desa, dungeon, atau interior rumah/toko)
                const currentMap = maps[STATE.location];
                if (!currentMap) return;

                // Hitung dimensi map dalam pixel
                const mapW = currentMap.w * TILE_SIZE;
                const mapH = currentMap.h * TILE_SIZE;

                // Hitung Scale agar map pas di canvas minimap
                // Gunakan Math.min untuk scale agar aspek rasio tetap terjaga jika mapnya kotak/persegi panjang
                // Tapi untuk memenuhi kotak, kita bisa stretch sedikit atau center.
                // Kode sebelumnya menggunakan stretch fill:
                const scaleX = miniCanvas.width / mapW;
                const scaleY = miniCanvas.height / mapH;

                // Update Label Minimap
                const labelEl = document.getElementById('minimap-label');
                if (labelEl) {
                    if (STATE.location === 'dungeon') labelEl.innerText = `LV ${STATE.dungeonLevel}`;
                    else if (STATE.location === 'ruins_battle') labelEl.innerText = '👹 PENCURI NASKAH';
                    else if (STATE.location === 'village') labelEl.innerText = "DESA";
                    else if (STATE.location === 'fairyVillage') labelEl.innerText = "🧚 KAHYANGAN WILIS";
                    else {
                        // Nama lokasi interior
                        let locName = "INDOOR";
                        if (STATE.location === 'house') locName = "RUMAH";
                        else if (STATE.location === 'merchant_interior') locName = "TOKO";
                        else if (STATE.location === 'school_interior') locName = "KAMPUS";
                        else if (STATE.location === 'library_interior') locName = "PERPUS";
                        else if (STATE.location === 'guild_interior') locName = "GUILD";
                        else if (STATE.location === 'candi_interior') locName = "CANDI";
                        else if (STATE.location === 'sylvaria') locName = "🧚‍♀️ KAHYANGAN WILIS";
                        labelEl.innerText = locName;
                    }
                }

                // 1. DRAW BUILDINGS & PORTALS (Termasuk Pintu Keluar/Masuk)
                if (currentMap.buildings) {
                    currentMap.buildings.forEach(b => {
                        // Tentukan Warna di Minimap
                        if (b.id === 'player_house') {
                            mCtx.fillStyle = '#f59e0b'; // Rumah (Emas)
                        } else if (b.type === 'trigger' || b.id.includes('exit') || b.id.includes('next')) {
                            mCtx.fillStyle = '#a855f7'; // Portal/Teleport (Ungu) - Sangat penting di Indoor untuk melihat pintu keluar
                        } else if (b.roleSpecific || b.openTime) {
                            mCtx.fillStyle = '#3b82f6'; // Toko/Bangunan Penting (Biru)
                        } else if (b.type === 'dungeon_rock') {
                            mCtx.fillStyle = '#334155'; // Batu (Abu Gelap)
                        } else {
                            mCtx.fillStyle = '#475569'; // Bangunan Lain (Abu)
                        }

                        const bx = (b.x * TILE_SIZE) * scaleX;
                        const by = (b.y * TILE_SIZE) * scaleY;
                        const bw = (b.w * TILE_SIZE) * scaleX;
                        const bh = (b.h * TILE_SIZE) * scaleY;
                        mCtx.fillRect(bx, by, bw, bh);
                    });
                }

                // 2. NEW: DRAW INTERACTABLE OBJECTS (Benda yang bisa disentuh)
                if (currentMap.objects) {
                    mCtx.fillStyle = '#22d3ee'; // Cyan (Biru Muda Terang)
                    currentMap.objects.forEach(o => {
                        // Objek biasanya 1x1 tile
                        const ox = (o.x * TILE_SIZE) * scaleX;
                        const oy = (o.y * TILE_SIZE) * scaleY;

                        // UPDATE: Support Custom Size di Minimap
                        const ow = ((o.w || 1) * TILE_SIZE) * scaleX;
                        const oh = ((o.h || 1) * TILE_SIZE) * scaleY;

                        // Gambar kotak kecil untuk objek
                        mCtx.fillRect(ox, oy, ow, oh);
                    });
                }

                // 3. DRAW NPCS (Berlaku untuk SEMUA map sekarang, termasuk Indoor)
                if (currentMap.npcs) {
                    currentMap.npcs.forEach(n => {
                        if (!isNPCActive(n)) return;

                        const nx = (n.x * TILE_SIZE) * scaleX;
                        const ny = (n.y * TILE_SIZE) * scaleY;

                        // Titik NPC diperbesar sedikit agar terlihat jelas di map kecil
                        mCtx.fillStyle = '#fff';
                        mCtx.beginPath();
                        mCtx.arc(nx, ny, 2, 0, Math.PI * 2); // Radius 2
                        mCtx.fill();
                    });
                }

                // 4. DRAW ENEMIES (Dungeon + Ruins Battle)
                if (STATE.location === 'dungeon' || STATE.location === 'ruins_battle') {
                    STATE.enemies.forEach(e => {
                        const ex = e.x * scaleX;
                        const ey = e.y * scaleY;
                        const size = e.isBoss ? 4 : 2;
                        mCtx.fillStyle = e.isBoss ? '#b91c1c' : '#ef4444';
                        mCtx.beginPath();
                        mCtx.arc(ex, ey, size, 0, Math.PI * 2);
                        mCtx.fill();
                    });
                }

                // 5. DRAW PLAYER
                const px = STATE.player.x * scaleX;
                const py = STATE.player.y * scaleY;

                // UPDATE: Ganti Dot dengan Kepala Player (Avatar dari HUD)
                const avatarImg = document.getElementById('hud-avatar-img');
                const headSize = 12; // Ukuran kepala di minimap (pixel)

                if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0) {
                    mCtx.save();

                    // 1. Clipping Mask (Membuat gambar jadi bulat)
                    mCtx.beginPath();
                    mCtx.arc(px, py, headSize / 2, 0, Math.PI * 2);
                    mCtx.closePath();
                    mCtx.clip();

                    // 2. Gambar Avatar (Tengah di posisi px, py)
                    mCtx.drawImage(avatarImg, px - headSize / 2, py - headSize / 2, headSize, headSize);

                    mCtx.restore();

                    // 3. Border Emas di sekeliling kepala
                    mCtx.strokeStyle = '#fbbf24'; // Warna Emas
                    mCtx.lineWidth = 1.5;
                    mCtx.beginPath();
                    mCtx.arc(px, py, headSize / 2, 0, Math.PI * 2);
                    mCtx.stroke();

                } else {
                    // Fallback: Player Dot (Jika gambar gagal load)
                    mCtx.fillStyle = '#fbbf24';
                    mCtx.beginPath();
                    mCtx.arc(px, py, 4, 0, Math.PI * 2);
                    mCtx.fill();
                }

                // Player Ring (Radar Effect) - Diperbesar agar melingkupi kepala
                mCtx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
                mCtx.beginPath();
                mCtx.arc(px, py, headSize / 2 + 3, 0, Math.PI * 2);
                mCtx.stroke();
            }


            // --- [KODE BARU: SISTEM PERTANIAN LENGKAP] ---

            // 1. Fungsi Utama Interaksi (Dipanggil saat tombol aksi ditekan di ladang)
            function handleFarmingInteraction(tx, ty) {
                const farmKey = `${tx}_${ty}`;

                // Pastikan data farming aman
                if (!STATE.player.farming) STATE.player.farming = {};
                const crop = STATE.player.farming[farmKey];

                // SKENARIO A: TANAH KOSONG (Sudah Dicangkul) -> MENU PILIH BIBIT
                if (!crop || !crop.type) {
                    if (crop && crop.tilled) {
                        showSeedMenu(tx, ty);
                    } else {
                        showToast("Tanah harus dicangkul dulu! (Gunakan ikon ⛏️)");
                    }
                    return;
                }

                // SKENARIO B: ADA TANAMAN -> MENU PERAWATAN
                const cropName = crop.type.toUpperCase();
                let stageInfo = "🌱 Benih";
                if (crop.stage === 2) stageInfo = "🌿 Tumbuh";
                if (crop.stage === 3) stageInfo = "🌾 Siap Panen";

                // Siapkan Opsi Dialog
                let opts = [];

                // Opsi 1: Panen (Muncul jika Stage 3)
                if (crop.stage >= 3) {
                    opts.push({
                        text: `🌾 PANEN ${cropName} (+EXP)`,
                        action: () => harvestCrop(tx, ty)
                    });
                }
                // Opsi 2: Siram (Muncul jika belum disiram & belum panen)
                else if (!crop.watered) {
                    opts.push({
                        text: `💧 SIRAM AIR (Energi -2)`,
                        action: () => waterCrop(tx, ty)
                    });
                }

                // Opsi 3: Cek Status
                opts.push({
                    text: "👀 Cek Kondisi",
                    action: () => {
                        let statusMsg = `Tanaman: **${cropName}**\nFase: ${stageInfo} (Stage ${crop.stage}/3)\nAir: ${crop.watered ? '✅ Basah (Akan Tumbuh)' : '❌ Kering (Butuh Air)'}`;
                        showDialogue("INFO TANAMAN", statusMsg, [{ text: "Mengerti", action: closeDialogue }], 'images/lahan-liar.png');
                    }
                });

                // Opsi 4: Cabut (Hapus tanaman jika salah tanam)
                opts.push({
                    text: "🗑️ Cabut/Buang Tanaman",
                    action: () => {
                        // Hapus data tanaman, tapi biarkan tanah tetap gembur (tilled)
                        delete STATE.player.farming[farmKey].type;
                        delete STATE.player.farming[farmKey].stage;
                        delete STATE.player.farming[farmKey].watered;

                        showToast("Tanaman dicabut.");
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        closeDialogue();
                        manualSave();
                    }
                });

                opts.push({ text: "Tutup", action: closeDialogue });

                showDialogue(`TANAMAN: ${cropName}`, `Apa yang ingin kamu lakukan?`, opts, 'images/lahan-liar.png');
            }


            // 2. Fungsi Menampilkan Menu Bibit (Cek Isi Tas)
            function showSeedMenu(tx, ty) {
                const inv = STATE.player.inventory || {};
                let opts = [];

                // Daftar bibit yang didukung (UPDATE: Tambah Rafflesia)
                const seeds = [
                    { id: 'bibit_padi', name: 'Padi' },
                    { id: 'bibit_jagung', name: 'Jagung' },
                    { id: 'bibit_tomat', name: 'Tomat' },
                    { id: 'bibit_rafflesia', name: 'RAFFLESIA (Langka!)' } // <--- BARU
                ];

                seeds.forEach(s => {
                    // Cek apakah punya bibit ini di tas
                    if (inv[s.id] > 0) {
                        opts.push({
                            text: `🌱 Tanam ${s.name} (Sisa: ${inv[s.id]})`,
                            action: () => {
                                // Panggil fungsi tanam
                                // Format action: plant_padi, plant_rafflesia, dst.
                                useInventoryItem(s.id, `plant_${s.id.split('_')[1]}`);
                                closeDialogue();
                            }
                        });
                    }
                });

                opts.push({ text: "Batal", action: closeDialogue });

                if (opts.length === 1) { // Cuma ada tombol Batal
                    showDialogue("TIDAK ADA BIBIT", "Tas kamu kosong!\nBeli bibit di **Bu Lastri (Pedagang Keliling)** atau dapatkan Bibit Langka dari Quest.", [{ text: "Oke", action: closeDialogue }], 'images/lahan-liar.png');
                } else {
                    showDialogue("PILIH BIBIT", "Mau tanam apa di petak ini?", opts, 'images/lahan-liar.png');
                }
            }
            // 3. Fungsi Menyiram Tanaman
            function waterCrop(tx, ty) {
                if (STATE.player.energy < 2) {
                    showToast("Energi habis! Makan dulu.");
                    return;
                }

                const farmKey = `${tx}_${ty}`;
                const crop = STATE.player.farming[farmKey];

                if (crop) {
                    STATE.player.energy -= 2;
                    crop.watered = true; // Tandai sudah disiram

                    // Efek Visual
                    createParticle(tx * TILE_SIZE, ty * TILE_SIZE, '#38bdf8'); // Partikel Biru
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                    showToast("Tanaman disiram! 💧");
                    closeDialogue();
                    manualSave();
                }
            }

            // 4. Fungsi Panen
            // 4. Fungsi Panen
            function harvestCrop(tx, ty) {
                const farmKey = `${tx}_${ty}`;
                const crop = STATE.player.farming[farmKey];

                if (crop && crop.stage >= 3) {
                    // Simpan tipe sebelum dihapus
                    const cropType = crop.type;

                    // Tentukan Hasil Panen
                    let resultItem = 'beras';
                    let qty = 1;
                    let xpGain = 15;
                    let particleColor = '#fbbf24';
                    let resultName = 'Beras';

                    if (cropType === 'padi') {
                        resultItem = 'beras'; qty = 3; xpGain = 20; resultName = 'Beras';
                        particleColor = '#fbbf24';
                    } else if (cropType === 'jagung') {
                        resultItem = 'jagung_panen'; qty = 4; xpGain = 25; resultName = 'Jagung';
                        particleColor = '#facc15';
                    } else if (cropType === 'tomat') {
                        resultItem = 'tomat_panen'; qty = 3; xpGain = 15; resultName = 'Tomat';
                        particleColor = '#ef4444';
                    } else if (cropType === 'rafflesia') {
                        resultItem = 'bunga_rafflesia'; qty = 1; xpGain = 500; resultName = 'Rafflesia Arnoldi';
                        particleColor = '#a855f7';
                        showToast("PANEN LEGENDARIS! 🌺");
                    }

                    // Tambah Item ke Tas
                    addItem(resultItem, qty);
                    gainExp(xpGain);

                    // Tambah counter panen harian
                    STATE.player.dailyHarvestCount = (STATE.player.dailyHarvestCount || 0) + 1;

                    // Reset Tanaman (tanah tetap gembur)
                    delete crop.type;
                    delete crop.stage;
                    delete crop.watered;
                    // crop.tilled tetap true

                    // Efek Visual Panen
                    createParticle(tx * TILE_SIZE, ty * TILE_SIZE, particleColor);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                    const msg = cropType === 'rafflesia'
                        ? `LUAR BIASA! Kamu memanen Bunga Rafflesia Arnoldi!\n(+500 EXP)`
                        : `Kamu memanen ${qty}x ${resultName}!\n(+${xpGain} EXP)\n\nJual ke Merchant untuk dapat Gold!`;

                    showDialogue("PANEN RAYA! 🌾", msg, [{ text: "Mantap! ✅", action: closeDialogue }], 'images/lahan-liar.png');

                    manualSave();
                }
            }

            // --- NEW: FUNGSI TAMBAHAN FESTIVAL & LEADERBOARD (PASTE DI BAGIAN BAWAH SEBELUM CLOSING SCRIPT) ---

            // 1. FUNGSI HANDLER LEADERBOARD DARI PATUNG
            function showLeaderboardFromStatue() {
                showDialogue("HALL OF FAME", "Sedang mengambil data peringkat server...", [{text:"Tutup", action:closeDialogue}], 'images/statue.png');

                DataService.getAllStudents().then(students => {
                    let validStudents = students.filter(s => s.saveData);

                    validStudents.sort((a, b) => {
                        const scoreA = calculateGrade(a.saveData);
                        const scoreB = calculateGrade(b.saveData);
                        return scoreB - scoreA;
                    });

                    let rankText = "🏆 PERINGKAT TERTINGGI NUSANTARA ARSA:\n\n";
                    const top3 = validStudents.slice(0, 3);

                    if (top3.length === 0) {
                        rankText += "Belum ada petualang yang terdaftar.";
                    } else {
                        top3.forEach((s, idx) => {
                            const medal = idx === 0 ? "🥇" : (idx === 1 ? "🥈" : "🥉");
                            const score = calculateGrade(s.saveData);
                            const dName = s.name.length > 12 ? s.name.substring(0, 10) + ".." : s.name;
                            const role = s.saveData.role !== 'none' ? s.saveData.role.toUpperCase() : 'NOVICE';
                            rankText += `${medal} ${dName} [${role}] - Skor: ${score}\n`;
                        });
                    }

                    if (DataService.user) {
                        const myRank = validStudents.findIndex(s => s.email === DataService.user.email) + 1;
                        if (myRank > 3) {
                            const myScore = calculateGrade(DataService.user.saveData);
                            rankText += `\n...\n#${myRank} ${DataService.user.name} (Kamu) - Skor: ${myScore}`;
                        } else if (myRank > 0) {
                            rankText += `\n(Kamu berada di Puncak Klasemen!)`;
                        } else {
                            rankText += `\n(Data kamu belum terdaftar di server)`;
                        }
                    }

                    showDialogue("HALL OF FAME", rankText, [{ text: "Saya Pasti Bisa Top 1!", action: closeDialogue }], 'images/statue.png');

                }).catch(err => {
                    console.error("Leaderboard Error:", err);
                    showDialogue("HALL OF FAME", "Gagal terhubung ke server peringkat.\nCek koneksi internetmu.", [{ text: "Tutup", action: closeDialogue }], 'images/statue.png');
                });
            }

