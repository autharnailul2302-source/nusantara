// ========================================================
// js/14_side_quest.js
// Side Quest: Kisah Leluhur Lamongan
// ========================================================

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

