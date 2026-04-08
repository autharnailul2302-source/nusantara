// ══════════════════════════════════════════════════════════════
// Sistem Peliharaan (PET_CATALOG)
// File: js/07-pet-system.js
// ══════════════════════════════════════════════════════════════
            // ===== SISTEM PET - KATALOG & LOGIKA =====
            // =============================================
            const PET_CATALOG = {
                // === TIER: RARE (Dibeli di toko Satria, pakai AP) ===
                ayam_bekisar: {
                    id: 'ayam_bekisar', name: 'Ayam Bekisar', emoji: '🐔', tier: 'rare',
                    price: 30, description: 'Ayam kebanggaan Jawa Timur. Suaranya merdu!',
                    bonus: { str: 2 }, bonusText: '+2 STR',
                    hp: 80, atk: 12, spd: 10,
                    offsetX: -22, offsetY: 14, size: 22 // posisi ikut player
                },
                kambing_kacang: {
                    id: 'kambing_kacang', name: 'Kambing Kacang', emoji: '🐐', tier: 'rare',
                    price: 40, description: 'Kecil tapi lincah dan tahan banting.',
                    bonus: { hp: 10 }, bonusText: '+10 Max HP',
                    hp: 90, atk: 10, spd: 14,
                    offsetX: -22, offsetY: 14, size: 24
                },
                // === TIER: EPIC ===
                sapi_madura: {
                    id: 'sapi_madura', name: 'Sapi Madura', emoji: '🐄', tier: 'epic',
                    price: 100, description: 'Sapi bertubuh kuat dengan punuk khas Madura.',
                    bonus: { str: 5 }, bonusText: '+5 STR',
                    hp: 140, atk: 18, spd: 7,
                    offsetX: -26, offsetY: 16, size: 28
                },
                kuda_sumbawa: {
                    id: 'kuda_sumbawa', name: 'Kuda Sumbawa', emoji: '🐴', tier: 'epic',
                    price: 130, description: 'Kuda petarung pemberani dari medan laga.',
                    bonus: { str: 3, int: 2 }, bonusText: '+3 STR +2 INT',
                    hp: 120, atk: 22, spd: 18,
                    offsetX: -26, offsetY: 14, size: 28
                },
                elang_jawa: {
                    id: 'elang_jawa', name: 'Elang Jawa', emoji: '🦅', tier: 'epic',
                    price: 120, description: 'Rajawali Jawa, simbol keberanian dan kecerdasan.',
                    bonus: { int: 5 }, bonusText: '+5 INT',
                    hp: 100, atk: 20, spd: 20,
                    offsetX: -20, offsetY: -10, size: 24 // terbang sedikit di atas
                },
                // === TIER: LEGENDARY (Hanya dari battle dengan Satria, hubungan >= 80) ===
                naga_nusantara: {
                    id: 'naga_nusantara', name: 'Naga Nusantara', emoji: '🐲', tier: 'legendary',
                    price: 0, description: 'Makhluk legendaris penjaga Nusantara. Kekuatannya luar biasa!',
                    bonus: { str: 10, int: 10, hp: 20 }, bonusText: '+10 STR +10 INT +20 Max HP',
                    hp: 250, atk: 35, spd: 15,
                    offsetX: -28, offsetY: 10, size: 34
                },
                harimau_sumatra: {
                    id: 'harimau_sumatra', name: 'Harimau Sumatra', emoji: '🐯', tier: 'legendary',
                    price: 0, description: 'Raja hutan Sumatra yang agung dan buas!',
                    bonus: { str: 15, reputation: 10 }, bonusText: '+15 STR +10 Reputasi',
                    hp: 220, atk: 40, spd: 18,
                    offsetX: -26, offsetY: 14, size: 30
                },
                komodo_raksasa: {
                    id: 'komodo_raksasa', name: 'Komodo Raksasa', emoji: '🦎', tier: 'legendary',
                    price: 0, description: 'Reptil purba terbesar di dunia, hanya ada di Indonesia!',
                    bonus: { str: 8, int: 8, biz: 8 }, bonusText: '+8 STR +8 INT +8 BIZ',
                    hp: 200, atk: 32, spd: 12,
                    offsetX: -26, offsetY: 16, size: 28
                }
            };

            const PET_TIER_COLOR = { rare: '#60a5fa', epic: '#a78bfa', legendary: '#fbbf24' };
            const PET_TIER_LABEL = { rare: 'RARE', epic: 'EPIC', legendary: 'LEGENDARY ⭐' };
            const LEGENDARY_PET_IDS = ['naga_nusantara', 'harimau_sumatra', 'komodo_raksasa'];

            // State battle pet
            let PET_BATTLE_STATE = null;

            // State untuk animasi pet follower
            if (!window.PET_FOLLOWER) window.PET_FOLLOWER = { x: 0, y: 0, initialized: false, bobPhase: 0 };

            // --- FUNGSI DRAW PET FOLLOWER DI CANVAS ---
            function drawPetFollower(ctx, p) {
                const activePetId = STATE.player.activePet;
                if (!activePetId || !PET_CATALOG[activePetId]) return;
                const pet = PET_CATALOG[activePetId];

                // Hitung posisi pet (mengikuti player dengan sedikit lag / ekor)
                const f = window.PET_FOLLOWER;
                if (!f.initialized) {
                    f.x = p.x + pet.offsetX;
                    f.y = p.y + pet.offsetY;
                    f.initialized = true;
                }

                // Interpolasi smooth ke target (lag ikut player)
                const targetX = p.x + pet.offsetX - 18;
                const targetY = p.y + pet.offsetY + 5;
                f.x += (targetX - f.x) * 0.08;
                f.y += (targetY - f.y) * 0.08;
                f.bobPhase = (f.bobPhase || 0) + 0.05;

                const bobY = Math.sin(f.bobPhase) * (pet.id === 'elang_jawa' ? 4 : 2);
                const drawX = f.x;
                const drawY = f.y + bobY;
                const s = pet.size || 24;

                ctx.save();

                // Shadow bayangan di bawah pet
                ctx.fillStyle = 'rgba(0,0,0,0.25)';
                ctx.beginPath();
                ctx.ellipse(drawX + s/2, drawY + s + 2, s * 0.4, 3, 0, 0, Math.PI * 2);
                ctx.fill();

                // Gambar emoji pet
                ctx.font = `${s}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Flip ke kiri jika player menghadap kiri
                if (p.direction === 'right') {
                    ctx.scale(-1, 1);
                    ctx.fillText(pet.emoji, -(drawX + s/2), drawY + s/2);
                } else {
                    ctx.fillText(pet.emoji, drawX + s/2, drawY + s/2);
                }

                // Sparkle effect untuk legendary
                if (pet.tier === 'legendary') {
                    ctx.font = '8px Arial';
                    const sparkPhase = Date.now() / 400;
                    const sparkles = ['✨','⭐','✨'];
                    sparkles.forEach((sp, i) => {
                        const sx = drawX + s/2 + Math.cos(sparkPhase + i * 2.1) * (s * 0.7);
                        const sy = drawY + s/2 + Math.sin(sparkPhase + i * 2.1) * (s * 0.6);
                        if (p.direction === 'right') ctx.fillText(sp, -sx, sy);
                        else ctx.fillText(sp, sx, sy);
                    });
                }

                ctx.restore();

                // Label nama pet (kecil di atas)
                ctx.save();
                ctx.font = 'bold 8px Nunito, Arial';
                ctx.textAlign = 'center';
                ctx.fillStyle = PET_TIER_COLOR[pet.tier] || '#fff';
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 3;
                ctx.fillText(pet.name, drawX + s/2, drawY - 4);
                ctx.shadowBlur = 0;
                ctx.restore();
            }

            // --- FUNGSI BUKA TOKO PET SATRIA ---
            function openPetShop(npc) {
                const p = STATE.player;
                const love = p.relationships[npc.id] || 0;
                const myPets = p.pets || [];
                const activePet = p.activePet || null;
                const myAP = p.achievementPoints || 0;

                let shopText = `🐾 Selamat datang di Padepokan Hewan Satria!\n\n🏅 AP Kamu: **${myAP} poin**\nHewan peliharaan memberikan bonus stat permanen & ikut menemanimu!\n\n`;
                if (activePet && PET_CATALOG[activePet]) {
                    const ap = PET_CATALOG[activePet];
                    shopText += `Pet aktif: **${ap.emoji} ${ap.name}** (${ap.bonusText})\n`;
                }

                const opts = [];
                opts.push({ text: '🛒 Beli Pet (Pakai AP)', action: () => showPetBuyMenu(npc) });
                if (myPets.length > 1) opts.push({ text: '🔄 Ganti Pet Aktif', action: () => showPetSwitchMenu(npc) });
                if (myPets.length > 0) opts.push({ text: '📖 Koleksi Petku', action: () => showMyPets(npc) });

                if (love >= 80) {
                    opts.push({ text: '⚔️ Tantang Pet Legendaris!', action: () => startLegendaryPetBattle(npc) });
                } else {
                    opts.push({ text: `🔒 Pet Legendaris [Hubungan ❤️ ${love}/80]`, action: () => showDialogue(npc.name, `Untuk menantang Pet Legendaris, bangun hubungan kuat denganku dulu.\n\nHubunganmu: **${love}/80**`, [{ text: 'Siap!', action: closeDialogue }], npc.imgSrc) });
                }
                opts.push({ text: 'Kembali', action: () => interactNPC(npc) });
                showDialogue('🐾 PADEPOKAN HEWAN SATRIA', shopText, opts, npc.imgSrc);
            }

            function showPetBuyMenu(npc) {
                const p = STATE.player;
                const myPetIds = (p.pets || []);
                const myAP = p.achievementPoints || 0;
                const buyable = Object.values(PET_CATALOG).filter(pet => pet.tier !== 'legendary');

                const opts = buyable.map(pet => {
                    const owned = myPetIds.includes(pet.id);
                    const canAfford = myAP >= pet.price;
                    const label = owned
                        ? `✅ ${pet.emoji} ${pet.name} [SUDAH PUNYA]`
                        : `${pet.emoji} ${pet.name} [${PET_TIER_LABEL[pet.tier]}] - ${pet.price} AP${!canAfford ? ' ⚠️' : ''}`;
                    return {
                        text: label,
                        action: () => {
                            if (owned) { showDialogue(npc.name, `Kamu sudah punya **${pet.name}**!`, [{ text: 'Iya!', action: closeDialogue }], npc.imgSrc); return; }
                            showDialogue('🛒 BELI PET', `${pet.emoji} **${pet.name}**\n\n${pet.description}\n\nBonus: **${pet.bonusText}**\nHarga: **${pet.price} AP**\nAP Kamu: **${myAP} AP**\n\nYakin beli?`, [
                                {
                                    text: `✅ Beli (${pet.price} AP)`,
                                    action: () => {
                                        if (p.achievementPoints < pet.price) { showToast('AP tidak cukup!'); return; }
                                        p.achievementPoints -= pet.price;
                                        if (!p.pets) p.pets = [];
                                        p.pets.push(pet.id);
                                        if (!p.activePet) {
                                            p.activePet = pet.id;
                                            applyPetBonus(pet);
                                            updatePetHUD();
                                            window.PET_FOLLOWER.initialized = false;
                                        }
                                        manualSave();
                                        if (document.getElementById('profile-ap-display')) document.getElementById('profile-ap-display').innerText = p.achievementPoints;
                                        showDialogue(npc.name, `${pet.emoji} **${pet.name}** kini milikmu!\n\n✨ ${pet.bonusText} aktif!\nPetmu akan mengikutimu di map!`, [{ text: '🎉 Terima kasih!', action: closeDialogue }], npc.imgSrc);
                                    }
                                },
                                { text: 'Batal', action: () => showPetBuyMenu(npc) }
                            ], npc.imgSrc);
                        }
                    };
                });
                opts.push({ text: '⬅ Kembali', action: () => openPetShop(npc) });
                showDialogue('🛒 BELI PET', `Pilih hewan:\n🏅 AP Kamu: **${myAP}**\n(Rare murah | Epic kuat | Legendary dari Battle)`, opts, npc.imgSrc);
            }

            function showPetSwitchMenu(npc) {
                const p = STATE.player;
                const myPets = p.pets || [];
                const opts = myPets.map(petId => {
                    const pet = PET_CATALOG[petId];
                    if (!pet) return null;
                    const isActive = p.activePet === petId;
                    return {
                        text: `${isActive ? '✅ ' : ''}${pet.emoji} ${pet.name} [${PET_TIER_LABEL[pet.tier]}] ${isActive ? '← AKTIF' : ''}`,
                        action: () => {
                            if (isActive) { showToast('Pet ini sudah aktif!'); return; }
                            if (p.activePet && PET_CATALOG[p.activePet]) removePetBonus(PET_CATALOG[p.activePet]);
                            p.activePet = petId;
                            applyPetBonus(pet);
                            updatePetHUD();
                            window.PET_FOLLOWER.initialized = false;
                            manualSave();
                            showDialogue(npc ? npc.name : '✨', `${pet.emoji} **${pet.name}** sekarang aktif & mengikutimu!\n\n${pet.bonusText} aktif!`, [{ text: 'Sip!', action: closeDialogue }], npc ? npc.imgSrc : null);
                        }
                    };
                }).filter(Boolean);
                opts.push({ text: '⬅ Kembali', action: npc ? () => openPetShop(npc) : closeDialogue });
                showDialogue('🔄 GANTI PET AKTIF', 'Pilih pet yang ingin diaktifkan:', opts, npc ? npc.imgSrc : null);
            }

            function showMyPets(npc) {
                const p = STATE.player;
                const myPets = p.pets || [];
                let desc = `Koleksi petmu (${myPets.length}):\n\n`;
                myPets.forEach(petId => {
                    const pet = PET_CATALOG[petId];
                    if (!pet) return;
                    const isActive = p.activePet === petId;
                    desc += `${isActive ? '⭐ ' : ''}${pet.emoji} **${pet.name}** [${PET_TIER_LABEL[pet.tier]}]\n  Bonus: ${pet.bonusText}${isActive ? ' ← AKTIF' : ''}\n\n`;
                });
                showDialogue('📖 KOLEKSI PET', desc, [
                    { text: '🔄 Ganti Pet', action: () => showPetSwitchMenu(npc) },
                    { text: '⬅ Kembali', action: npc ? () => openPetShop(npc) : closeDialogue }
                ], npc ? npc.imgSrc : null);
            }

            // --- APPLY / REMOVE PET BONUS ---
            function applyPetBonus(pet) {
                if (!pet || !pet.bonus) return;
                const p = STATE.player;
                if (pet.bonus.str) p.str += pet.bonus.str;
                if (pet.bonus.int) p.int += pet.bonus.int;
                if (pet.bonus.biz) p.biz += pet.bonus.biz;
                if (pet.bonus.reputation) p.reputation += pet.bonus.reputation;
                if (pet.bonus.hp) { p.maxHp = (p.maxHp || 100) + pet.bonus.hp; p.hp = Math.min(p.hp + pet.bonus.hp, p.maxHp); }
                updateHUDInfo();
                showToast(`✨ ${pet.emoji} ${pet.name} aktif! ${pet.bonusText}`);
            }

            function removePetBonus(pet) {
                if (!pet || !pet.bonus) return;
                const p = STATE.player;
                if (pet.bonus.str) p.str = Math.max(0, p.str - pet.bonus.str);
                if (pet.bonus.int) p.int = Math.max(0, p.int - pet.bonus.int);
                if (pet.bonus.biz) p.biz = Math.max(0, p.biz - pet.bonus.biz);
                if (pet.bonus.reputation) p.reputation = Math.max(0, p.reputation - pet.bonus.reputation);
                if (pet.bonus.hp) { p.maxHp = Math.max(10, (p.maxHp || 100) - pet.bonus.hp); p.hp = Math.min(p.hp, p.maxHp); }
                updateHUDInfo();
            }

            // --- UPDATE PET HUD (indikator kecil pojok layar) ---
            function updatePetHUD() {
                const p = STATE.player;
                const hud = document.getElementById('pet-hud-indicator');
                if (!hud) return;
                if (p.activePet && PET_CATALOG[p.activePet]) {
                    const pet = PET_CATALOG[p.activePet];
                    document.getElementById('pet-hud-emoji').textContent = pet.emoji;
                    document.getElementById('pet-hud-name').textContent = pet.name;
                } else {
                    // Tampilkan meski belum ada pet
                    document.getElementById('pet-hud-emoji').textContent = '🥚';
                    document.getElementById('pet-hud-name').textContent = 'Belum ada pet';
                }
                hud.classList.add('visible'); // Selalu tampil
            }

            // --- LEGENDARY PET BATTLE SYSTEM ---
            function startLegendaryPetBattle(npc) {
                const p = STATE.player;
                if (!p.activePet || !PET_CATALOG[p.activePet]) {
                    showDialogue(npc.name, 'Kamu belum punya pet aktif! Beli dulu.', [{ text: 'Oke', action: closeDialogue }], npc.imgSrc);
                    return;
                }
                const available = LEGENDARY_PET_IDS.filter(id => !(p.pets || []).includes(id));
                if (available.length === 0) {
                    showDialogue(npc.name, '✅ Kamu sudah mengalahkan semua Pet Legendaris! Luar biasa!', [{ text: 'Terima kasih!', action: closeDialogue }], npc.imgSrc);
                    return;
                }
                const enemyId = available[Math.floor(Math.random() * available.length)];
                const enemy = PET_CATALOG[enemyId];
                const myPet = PET_CATALOG[p.activePet];
                showDialogue(npc.name, `⚠️ **PET LEGENDARIS MUNCUL!**\n\n${enemy.emoji} **${enemy.name}** menantangmu!\n\nPetmu: **${myPet.emoji} ${myPet.name}**\nHP Enemy: **${enemy.hp}** | ATK: **${enemy.atk}**\n\nAlahkan dia untuk mendapatkannya!`, [
                    { text: '⚔️ MULAI BATTLE!', action: () => { closeDialogue(); initPetBattle(myPet, enemy, npc); } },
                    { text: '❌ Mundur', action: closeDialogue }
                ], npc.imgSrc);
            }

            function initPetBattle(myPet, enemyPet, npc) {
                PET_BATTLE_STATE = {
                    player: { ...myPet, currentHp: myPet.hp, maxHp: myPet.hp },
                    enemy: { ...enemyPet, currentHp: enemyPet.hp, maxHp: enemyPet.hp },
                    turn: 0, npc: npc, locked: false
                };
                document.getElementById('pb-player-emoji').textContent = myPet.emoji;
                document.getElementById('pb-player-name').textContent = myPet.name;
                document.getElementById('pb-player-hp-text').textContent = `${myPet.hp}/${myPet.hp}`;
                document.getElementById('pb-player-hp').style.width = '100%';
                document.getElementById('pb-enemy-emoji').textContent = enemyPet.emoji;
                document.getElementById('pb-enemy-name').textContent = enemyPet.name;
                document.getElementById('pb-enemy-hp-text').textContent = `${enemyPet.hp}/${enemyPet.hp}`;
                document.getElementById('pb-enemy-hp').style.width = '100%';
                document.getElementById('pb-log').textContent = `${myPet.emoji} ${myPet.name} VS ${enemyPet.emoji} ${enemyPet.name}!\nPilih seranganmu!`;
                document.getElementById('pet-battle-overlay').classList.add('active');
            }

            function petBattleAttack(type) {
                if (!PET_BATTLE_STATE || PET_BATTLE_STATE.locked) return;
                PET_BATTLE_STATE.locked = true;
                const bs = PET_BATTLE_STATE;
                const strBonus = Math.floor((STATE.player.str || 5) * 0.5);
                const myAtk = type === 'power'
                    ? Math.floor((bs.player.atk + strBonus) * 2 * (0.7 + Math.random() * 0.6))
                    : Math.floor((bs.player.atk + strBonus) * (0.8 + Math.random() * 0.4));
                const enAtk = Math.floor(bs.enemy.atk * (0.8 + Math.random() * 0.4));
                bs.enemy.currentHp = Math.max(0, bs.enemy.currentHp - myAtk);
                bs.player.currentHp = Math.max(0, bs.player.currentHp - enAtk);
                bs.turn++;
                const pPct = (bs.player.currentHp / bs.player.maxHp) * 100;
                const ePct = (bs.enemy.currentHp / bs.enemy.maxHp) * 100;
                document.getElementById('pb-player-hp').style.width = pPct + '%';
                document.getElementById('pb-enemy-hp').style.width = ePct + '%';
                document.getElementById('pb-player-hp-text').textContent = `${bs.player.currentHp}/${bs.player.maxHp}`;
                document.getElementById('pb-enemy-hp-text').textContent = `${bs.enemy.currentHp}/${bs.enemy.maxHp}`;
                const typeLabel = type === 'power' ? '💥 SERANG KUAT' : '⚔️ Serang';
                document.getElementById('pb-log').textContent = `Turn ${bs.turn}: ${typeLabel}\n${bs.player.emoji} ATK: -${myAtk} HP musuh\n${bs.enemy.emoji} ATK: -${enAtk} HP petmu`;
                setTimeout(() => {
                    if (bs.player.currentHp <= 0) petBattleEnd(false);
                    else if (bs.enemy.currentHp <= 0) petBattleEnd(true);
                    else PET_BATTLE_STATE.locked = false;
                }, 300);
            }

            function petBattleFlee() {
                document.getElementById('pet-battle-overlay').classList.remove('active');
                PET_BATTLE_STATE = null;
                showToast('Kamu melarikan diri dari pertarungan!');
            }

            function petBattleEnd(win) {
                const bs = PET_BATTLE_STATE;
                document.getElementById('pet-battle-overlay').classList.remove('active');
                if (win) {
                    const enemyPet = bs.enemy;
                    const p = STATE.player;
                    if (!p.pets) p.pets = [];
                    p.pets.push(enemyPet.id);
                    const npc = bs.npc;
                    PET_BATTLE_STATE = null;
                    setTimeout(() => {
                        showDialogue('🏆 KEMENANGAN!', `${enemyPet.emoji} **${enemyPet.name}** telah takluk!\n\nPet Legendaris bergabung bersamamu!\nBonus: **${enemyPet.bonusText}**\n\nAktifkan pet ini sekarang?`, [
                            {
                                text: `✅ Aktifkan ${enemyPet.emoji} ${enemyPet.name}`,
                                action: () => {
                                    if (p.activePet && PET_CATALOG[p.activePet]) removePetBonus(PET_CATALOG[p.activePet]);
                                    p.activePet = enemyPet.id;
                                    applyPetBonus(enemyPet);
                                    updatePetHUD();
                                    window.PET_FOLLOWER.initialized = false;
                                    manualSave();
                                    showDialogue(npc ? npc.name : '✨', `${enemyPet.emoji} **${enemyPet.name}** sekarang mengikutimu!\n${enemyPet.bonusText} aktif!`, [{ text: 'Mantap!', action: closeDialogue }], npc ? npc.imgSrc : null);
                                }
                            },
                            { text: 'Simpan dulu', action: () => { manualSave(); closeDialogue(); } }
                        ], null);
                    }, 500);
                } else {
                    PET_BATTLE_STATE = null;
                    setTimeout(() => {
                        showToast('Petmu kalah! Coba lagi setelah memulihkan kondisi.');
                        STATE.player.hp = Math.max(1, STATE.player.hp - 20);
                        updateHUDInfo();
                    }, 500);
                }
            }

            // =============================================
            // ===== END SISTEM PET =====
            // =============================================

            // --- UPDATE: BANK GOMBALAN & TIPE ---
            const GOMBALAN_BANK = [
                { text: "Bapak kamu maling ya? Soalnya kamu mencuri hatiku! 👮", type: "cheesy" },
                { text: "Kamu itu kayak Google. Segala yang kucari ada di kamu. 🌐", type: "cheesy" },
                { text: "Kopi ini pahit, tapi kalau liat kamu langsung jadi manis. ☕", type: "cheesy" },
                { text: "Jalan mundur yuk? Biar kita bisa liat masa lalu kita gak pernah pisah. 🚶", type: "funny" },
                { text: "Cintaku padamu kayak utang. Awalnya kecil, lama-lama gede! 💰", type: "funny" },
                { text: "Kamu berat gak? Soalnya kamu ada di pikiranku terus. 🧠", type: "funny" },
                { text: "Aku tidak butuh peta, karena tujuanku adalah hatimu. 🗺️", type: "romantic" },
                { text: "Jika rindu itu air, aku sudah tenggelam sekarang. 🌊", type: "romantic" },
                { text: "Di matamu, aku melihat masa depan yang indah. ✨", type: "romantic" },
                { text: "Kamu adalah notifikasi favoritku setiap hari. 📱", type: "modern" },
                { text: "Wifi di sini kenceng, tapi koneksi hati kita lebih kuat. 📶", type: "modern" },
                { text: "Ikan hiu makan tomat. I love you so much! 🦈", type: "pantun" }
            ];

            const COMMODITIES = [
                { id: 'gandum', name: 'Gandum', base: 2000, volatility: 0.3 },
                { id: 'beras', name: 'Beras', base: 1500, volatility: 0.25 },
                { id: 'jagung_panen', name: 'Jagung', base: 1200, volatility: 0.2 },
                { id: 'tomat_panen', name: 'Tomat', base: 800, volatility: 0.35 },
                { id: 'bunga_rafflesia', name: 'Rafflesia', base: 50000, volatility: 0.6 },
                { id: 'kain', name: 'Sutra', base: 8000, volatility: 0.5 },
                { id: 'permata', name: 'Berlian', base: 25000, volatility: 0.8 }
            ];

            function getDailyPrice(itemId, basePrice, vol) {
                const seed = (STATE.day * 13) + itemId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                const rand = Math.sin(seed);
                const change = Math.floor(basePrice * vol * rand);
                let finalPrice = basePrice + change;
                return Math.max(Math.floor(basePrice * 0.2), finalPrice);
            }

            // Input
            const keys = {};
            window.addEventListener('keydown', e => {
                keys[e.code] = true;
                if (e.code === 'Space' && STATE.fishing.active) {
                    checkFishing();
                }
            });
            window.addEventListener('keyup', e => keys[e.code] = false);

            // --- REVISI TOTAL: TOUCH TO MOVE SYSTEM (VISUAL FLOATING JOYSTICK) ---
            const inputState = {
                active: false,
                x: 0, // Vektor arah X (-1 s/d 1)
                y: 0  // Vektor arah Y (-1 s/d 1)
            };

            function initTouchControls() {
                const container = document.getElementById('game-container');
                const joystickBase = document.getElementById('virtual-joystick-base');
                const joystickStick = document.getElementById('virtual-joystick-stick');

                // Variabel untuk Floating Joystick
                let startX = 0;
                let startY = 0;
                const maxRadius = 50; // Jarak maksimal stick bisa digeser dari pusat (pixel)

                // Helper untuk reset joystick UI
                const hideJoystick = () => {
                    if (joystickBase) joystickBase.style.display = 'none';
                    inputState.active = false;
                    inputState.x = 0;
                    inputState.y = 0;
                };

                // 1. TOUCH EVENTS (HP/Tablet/IFP)
                container.addEventListener('touchstart', (e) => {
                    // Cek apakah yang disentuh adalah elemen UI (Tombol)?
                    if (e.target.closest('.action-btns') ||
                        e.target.closest('.hud-top') ||
                        e.target.id === 'hud-toggle-btn' ||
                        e.target.closest('.minigame-overlay') ||
                        e.target.closest('#dialogue-wrapper') ||
                        e.target.closest('#inventory-screen') ||
                        e.target.closest('#login-screen') ||
                        e.target.closest('#gender-screen') ||
                        e.target.closest('#game-over-screen') ||
                        e.target.closest('#audio-prompt') ||
                        /* FIX: Tambahkan Splash Screen ke pengecualian agar tombol start bisa diklik */
                        e.target.closest('#splash-screen') ||
                        e.target.closest('#teacher-dashboard') ||
                        /* FIX: TAMBAHKAN LEADERBOARD AGAR BISA SCROLL & KLIK DI HP */
                        e.target.closest('#leaderboard-overlay') ||
                        e.target.tagName === 'INPUT' ||
                        e.target.tagName === 'SELECT' ||
                        e.target.tagName === 'TEXTAREA' ||
                        e.target.closest('.journal-box')) {
                        return;
                    }

                    e.preventDefault();
                    const touch = e.touches[0];

                    // --- FLOATING JOYSTICK LOGIC ---
                    // 1. Set Pusat Joystick di posisi sentuhan awal
                    startX = touch.clientX;
                    startY = touch.clientY;

                    // 2. Tampilkan Visual Joystick di posisi tersebut
                    if (joystickBase) {
                        joystickBase.style.display = 'block';
                        joystickBase.style.left = startX + 'px';
                        joystickBase.style.top = startY + 'px';
                        // Reset stick ke tengah
                        joystickStick.style.transform = `translate(-50%, -50%)`;
                    }

                    inputState.active = true;
                    // Awal sentuh belum ada gerakan (0,0)
                    inputState.x = 0;
                    inputState.y = 0;

                }, { passive: false });

                container.addEventListener('touchmove', (e) => {
                    if (!inputState.active) return;
                    e.preventDefault();
                    const touch = e.touches[0];

                    // 1. Hitung Delta (Jarak dari pusat awal ke posisi jari sekarang)
                    const dx = touch.clientX - startX;
                    const dy = touch.clientY - startY;

                    // 2. Hitung Jarak & Sudut
                    const distance = Math.hypot(dx, dy);
                    const angle = Math.atan2(dy, dx);

                    // 3. Batasi Gerakan Visual Stick (Clamping)
                    const clampDist = Math.min(distance, maxRadius);
                    const stickX = Math.cos(angle) * clampDist;
                    const stickY = Math.sin(angle) * clampDist;

                    // Update Visual Stick
                    if (joystickStick) {
                        joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
                    }

                    // 4. Update Input State (Normalized Vector)
                    // Deadzone kecil (10px) agar karakter tidak gerak sendiri kalau jari goyang dikit
                    if (distance > 10) {
                        inputState.x = Math.cos(angle);
                        inputState.y = Math.sin(angle);
                    } else {
                        inputState.x = 0;
                        inputState.y = 0;
                    }

                }, { passive: false });

                const endTouch = (e) => {
                    hideJoystick();
                };

                container.addEventListener('touchend', endTouch);
                container.addEventListener('touchcancel', endTouch);

                // 2. MOUSE EVENTS (Untuk Testing di PC / Laptop Touchscreen)
                let isMouseDown = false;

                container.addEventListener('mousedown', (e) => {
                    if (e.target.closest('.action-btns') || e.target.closest('.hud-top')) return;

                    isMouseDown = true;
                    startX = e.clientX;
                    startY = e.clientY;

                    if (joystickBase) {
                        joystickBase.style.display = 'block';
                        joystickBase.style.left = startX + 'px';
                        joystickBase.style.top = startY + 'px';
                        joystickStick.style.transform = `translate(-50%, -50%)`;
                    }

                    inputState.active = true;
                    inputState.x = 0;
                    inputState.y = 0;
                });

                window.addEventListener('mousemove', (e) => {
                    if (!isMouseDown) return;

                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    const distance = Math.hypot(dx, dy);
                    const angle = Math.atan2(dy, dx);

                    const clampDist = Math.min(distance, maxRadius);
                    const stickX = Math.cos(angle) * clampDist;
                    const stickY = Math.sin(angle) * clampDist;

                    if (joystickStick) {
                        joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
                    }

                    if (distance > 5) {
                        inputState.x = Math.cos(angle);
                        inputState.y = Math.sin(angle);
                    }
                });

                window.addEventListener('mouseup', () => {
                    isMouseDown = false;
                    hideJoystick();
                });
            }


            // ═══════════════════════════════════════════════════════════════
