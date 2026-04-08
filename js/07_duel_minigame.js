// =================================================================
// ⚔️ Duel Minigame & startGame Init
// =================================================================

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
