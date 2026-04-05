            // LOGIKA PASAR GROSIR (NAIK-TURUN)
            // ==========================================

            if (!STATE.player.tradeInventory) STATE.player.tradeInventory = {};

            const TRADE_ITEMS = [
                { id: 'sepatu_b', name: '👟 Sepatu Bekas', basePrice: 500, min: 100, max: 1500 },
                { id: 'kaos_v', name: '👕 Kaos Vintage', basePrice: 200, min: 50, max: 600 },
                { id: 'jam_d', name: '⌚ Jam Digital', basePrice: 800, min: 300, max: 2500 },
                { id: 'snack_k', name: '🍬 Snack Kiloan', basePrice: 50, min: 20, max: 150 }
            ];

            let currentMarketPrices = {};

            function generateMarketPrices() {
                currentMarketPrices = {};
                let chaBonus = (STATE.player.cha || 0) * 0.01;
                if (chaBonus > 0.3) chaBonus = 0.3; // Diskon max 30% dari Charisma

                TRADE_ITEMS.forEach(item => {
                    let rawPrice = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
                    currentMarketPrices[item.id] = {
                        buy: Math.floor(rawPrice * (1 - (chaBonus / 2))),
                        sell: Math.floor(rawPrice * (1 + (chaBonus / 2))),
                        base: item.basePrice
                    };
                });
            }

            function openPasar() {
                STATE.screen = 'minigame';
                document.getElementById('pasar-modal').style.display = 'flex';
                generateMarketPrices();
                renderPasarUI();
            }

            function closePasar() {
                document.getElementById('pasar-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            function refreshPasar() {
                if (STATE.player.money >= 50) {
                    STATE.player.money -= 50;
                    if (typeof createFloatingText === 'function') createFloatingText("-50 G", "#ef4444");
                    generateMarketPrices();
                    renderPasarUI();
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('select');
                } else {
                    if (typeof showToast === 'function') showToast("Uang tidak cukup untuk sogok info pasar!");
                }
            }

            function renderPasarUI() {
                document.getElementById('pasar-uang-player').innerText = `${STATE.player.money} G`;
                const buyList = document.getElementById('pasar-buy-list');
                const sellList = document.getElementById('pasar-sell-list');

                buyList.innerHTML = '';
                sellList.innerHTML = '';

                TRADE_ITEMS.forEach(item => {
                    let prices = currentMarketPrices[item.id];
                    let ownedCount = STATE.player.tradeInventory[item.id] || 0;
                    let priceColor = prices.buy < item.basePrice ? '#ef4444' : '#4ade80';
                    let trendIcon = prices.buy < item.basePrice ? '📉' : '📈';

                    // Toko (Beli)
                    buyList.innerHTML += `
            <div style="background: #334155; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid ${priceColor}">
                <div style="font-size: 14px; margin-bottom: 5px;">${item.name}</div>
                <div style="font-size: 16px; font-weight: bold; color: ${priceColor};">${trendIcon} ${prices.buy} G</div>
                <button onclick="buyTradeItem('${item.id}')" style="margin-top: 8px; width: 100%; padding: 5px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">Beli</button>
            </div>
        `;

                    // Tas (Jual)
                    if (ownedCount > 0) {
                        sellList.innerHTML += `
                <div style="background: #334155; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #3b82f6">
                    <div style="font-size: 14px; margin-bottom: 5px;">${item.name} <span style="background: #eab308; color: black; padding: 2px 5px; border-radius: 10px; font-size: 12px; font-weight:bold;">x${ownedCount}</span></div>
                    <div style="font-size: 16px; font-weight: bold; color: #60a5fa;">Laku: ${prices.sell} G</div>
                    <button onclick="sellTradeItem('${item.id}')" style="margin-top: 8px; width: 100%; padding: 5px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Jual</button>
                </div>
            `;
                    }
                });

                if (sellList.innerHTML === '') {
                    sellList.innerHTML = '<div style="color: #94a3b8; font-style: italic; grid-column: span 2; text-align: center;">Tas daganganmu kosong.</div>';
                }
            }

            function buyTradeItem(itemId) {
                let price = currentMarketPrices[itemId].buy;
                if (STATE.player.money >= price) {
                    STATE.player.money -= price;
                    STATE.player.tradeInventory[itemId] = (STATE.player.tradeInventory[itemId] || 0) + 1;
                    if (typeof createFloatingText === 'function') createFloatingText(`-${price} G`, '#ef4444');
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    renderPasarUI();
                } else {
                    if (typeof showToast === 'function') showToast("Uang tidak cukup!");
                }
            }

            function sellTradeItem(itemId) {
                if (STATE.player.tradeInventory[itemId] > 0) {
                    let price = currentMarketPrices[itemId].sell;
                    STATE.player.tradeInventory[itemId] -= 1;
                    STATE.player.money += price;
                    STATE.player.dailySellCount = (STATE.player.dailySellCount || 0) + 1; // Track bonus quest
                    STATE.player.totalSellCount = (STATE.player.totalSellCount || 0) + 1; // TOTAL LIFETIME
                                    // Entrepreneur dapat AP dari penjualan (1 AP per 3 jual)
                                    if (STATE.player.role === 'entrepreneur') {
                                        const sells = STATE.player.dailySellCount || 0;
                                        if (sells % 3 === 0) {
                                            STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 3;
                                            showToast('💼 Omzet Naik! +3 AP');
                                        }
                                    }

                    if (typeof gainExp === 'function') gainExp(25); // Bonus EXP wirausaha

                    if (typeof createFloatingText === 'function') {
                        createFloatingText(`+${price} G`, '#4ade80');
                        setTimeout(() => { createFloatingText("+25 EXP", "#60a5fa"); }, 300);
                    }

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    renderPasarUI();
                }
            }

            // --- SALES RUSH MINIGAME (JAGA LAPAK) ---
            const SALES_ITEMS = [
                { id: 'roti', name: 'Roti', icon: '🥖' },
                { id: 'susu', name: 'Susu', icon: '🥛' },
                { id: 'sabun', name: 'Sabun', icon: '🧼' },
                { id: 'paket', name: 'Paket', icon: '📦' },
                { id: 'obat', name: 'Obat', icon: '💊' },
                { id: 'lampu', name: 'Lampu', icon: '💡' }
            ];

            let salesState = {
                active: false,
                score: 0,
                lives: 3,
                targetItem: null,
                patience: 100,
                decay: 0.5,
                interval: null
            };

            function startSalesGame() {
                salesState.active = true;
                salesState.score = 0;
                salesState.lives = 3;
                salesState.decay = 0.4; // Initial difficulty

                document.getElementById('sales-minigame').style.display = 'flex';
                STATE.screen = 'minigame';

                updateSalesUI();
                renderSalesButtons();
                nextSalesCustomer();

                if (salesState.interval) clearInterval(salesState.interval);
                salesState.interval = setInterval(salesLoop, 50); // 20 FPS
            }

            function renderSalesButtons() {
                const grid = document.getElementById('sales-grid');
                grid.innerHTML = '';
                SALES_ITEMS.forEach(item => {
                    const btn = document.createElement('button');
                    btn.className = 'auth-btn';
                    btn.style.padding = '8px';
                    btn.style.display = 'flex';
                    btn.style.flexDirection = 'column';
                    btn.style.alignItems = 'center';
                    btn.style.fontSize = '10px';
                    btn.innerHTML = `<span style="font-size:24px; margin-bottom:2px;">${item.icon}</span>${item.name}`;
                    btn.onclick = () => handleSalesClick(item.id);
                    grid.appendChild(btn);
                });
            }

            function nextSalesCustomer() {
                if (!salesState.active) return;

                salesState.patience = 100;
                salesState.decay += 0.05; // Makin lama makin cepat marah

                // Random Item
                salesState.targetItem = SALES_ITEMS[Math.floor(Math.random() * SALES_ITEMS.length)];

                // Tampilkan Bubble
                const bubble = document.getElementById('sales-bubble');
                bubble.innerText = salesState.targetItem.icon;
                bubble.style.transform = 'scale(0)';
                setTimeout(() => bubble.style.transform = 'scale(1)', 100);

                // Random Customer Image
                const customers = ['boy', 'girl', 'peer1', 'peer2', 'peer3', 'lover1girl', 'lover1boy'];
                const randCust = customers[Math.floor(Math.random() * customers.length)];
                const img = document.getElementById('sales-customer-img');
                img.src = `images/${randCust}.png`;
                img.style.transform = 'translateX(50px)';
                setTimeout(() => img.style.transform = 'translateX(0)', 100);
            }

            function salesLoop() {
                if (!salesState.active) return;

                salesState.patience -= salesState.decay;
                const bar = document.getElementById('sales-patience-bar');
                bar.style.width = salesState.patience + "%";

                if (salesState.patience > 50) bar.style.background = '#10b981';
                else if (salesState.patience > 20) bar.style.background = '#facc15';
                else bar.style.background = '#ef4444';

                if (salesState.patience <= 0) {
                    handleSalesMistake("Pelanggan Kabur! 😡");
                }
            }

            function handleSalesClick(id) {
                if (!salesState.active) return;

                if (id === salesState.targetItem.id) {
                    // BENAR
                    salesState.score += 50; // +50 Gold per item
                    createFloatingText("+50 G", "#4ade80");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    updateSalesUI();
                    nextSalesCustomer();
                } else {
                    // SALAH
                    handleSalesMistake("Salah Barang! ❌");
                }
            }

            function handleSalesMistake(msg) {
                salesState.lives--;
                updateSalesUI();
                showToast(msg);
                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                // Shake effect
                const box = document.querySelector('#sales-minigame .journal-box');
                box.style.transform = "translateX(5px)";
                setTimeout(() => box.style.transform = "translateX(0)", 100);

                if (salesState.lives <= 0) {
                    endSalesGame();
                } else {
                    nextSalesCustomer();
                }
            }

            function updateSalesUI() {
                document.getElementById('sales-score').innerText = salesState.score;
                document.getElementById('sales-lives').innerText = salesState.lives;
            }

            function endSalesGame() {
                clearInterval(salesState.interval);
                salesState.active = false;
                document.getElementById('sales-minigame').style.display = 'none';
                STATE.screen = 'play';

                // Give Rewards
                STATE.player.money += salesState.score;
                const expGain = Math.floor(salesState.score / 5);
                gainExp(expGain);
                STATE.player.biz += 2; // Skill Bisnis naik

                // Skip Waktu (Kerja memakan waktu)
                STATE.time += 200; // +2 Jam

                showDialogue("REKAP PENJUALAN",
                    `Toko Tutup!\n\n💰 Pendapatan: **${salesState.score} Gold**\n🧠 Pengalaman: **${expGain} EXP**\n📈 Skill Bisnis: **+2**\n\n(Waktu berlalu 2 Jam)`,
                    [{ text: "Mantap!", action: closeDialogue }],
                    'images/mejakasir.png'
                );
            }

            function quitSalesGame() {
                clearInterval(salesState.interval);
                salesState.active = false;
                document.getElementById('sales-minigame').style.display = 'none';
                STATE.screen = 'play';
            }

            // --- NEW: SISTEM PASSIVE INCOME (BISNIS) ---
            const BUSINESS_TIERS = [
                {
                    id: 'gerobak',
                    name: 'Gerobak Kopi Keliling',
                    desc: 'Bisnis pemula. Kopi sachet untuk pekerja.',
                    cost: 5000,
                    income: 10, // per 5 detik
                    reqBiz: 0,
                    icon: '☕',
                    img: 'images/gerobak.png' // Pastikan ada atau fallback
                },
                {
                    id: 'kios',
                    name: 'Kios Pulsa & Snack',
                    desc: 'Ruko kecil di pinggir jalan. Selalu ramai.',
                    cost: 25000,
                    income: 35,
                    reqBiz: 10,
                    icon: '🏪',
                    img: 'images/warnet.png'
                },
                {
                    id: 'minimarket',
                    name: 'Minimarket ArsaMart',
                    desc: 'Toko modern dengan AC. Favorit warga.',
                    cost: 100000,
                    income: 150,
                    reqBiz: 25,
                    icon: '🛒',
                    img: 'images/merchant.png'
                },
                {
                    id: 'mall',
                    name: 'Arsa Grand Mall',
                    desc: 'Pusat perbelanjaan elit. Mesin uang raksasa.',
                    cost: 1000000,
                    income: 1000,
                    reqBiz: 50,
                    icon: '🏢',
                    img: 'images/kampus.png'
                }
            ];

            // Helper: Init Data Bisnis Player
            function initBusinessState() {
                if (!STATE.player.business) {
                    STATE.player.business = {
                        owned: {}, // { 'gerobak': 2, 'kios': 1 }
                        lastCollect: Date.now()
                    };
                }
            }

            // 1. Loop Passive Income (Jalan di Background)
            function updatePassiveIncome() {
                initBusinessState();
                const p = STATE.player;

                // Hitung total income per tick (5 detik)
                let totalIncome = 0;
                BUSINESS_TIERS.forEach(biz => {
                    const count = p.business.owned[biz.id] || 0;
                    totalIncome += count * biz.income;
                });

                if (totalIncome > 0) {
                    // Cek waktu
                    const now = Date.now();
                    if (now - p.business.lastCollect >= 5000) { // 5 Detik
                        const ticks = Math.floor((now - p.business.lastCollect) / 5000);
                        const earn = totalIncome * ticks;

                        p.money += earn;
                        p.business.lastCollect = now;

                        // Visual Feedback (Kecil di pojok, jangan spam toast)
                        // Hanya muncul jika sedang main (screen play)
                        if (STATE.screen === 'play') {
                            spawnFloatingText(STATE.player.x, STATE.player.y - 50, `+${earn} G (Bisnis)`, '#10b981', 10);
                        }
                    }
                } else {
                    p.business.lastCollect = Date.now(); // Reset biar ga numpuk timestamp
                }
            }

            // 2. UI Menu Bisnis
            function openBusinessMenu() {
                initBusinessState();
                const p = STATE.player;

                document.getElementById('business-modal').style.display = 'flex';
                STATE.screen = 'minigame';

                updateBusinessUI();
            }

            function closeBusinessMenu() {
                document.getElementById('business-modal').style.display = 'none';
                STATE.screen = 'play';
            }

            function updateBusinessUI() {
                const p = STATE.player;
                const list = document.getElementById('biz-upgrade-list');
                list.innerHTML = '';

                let totalIncome = 0;
                let totalOwned = 0;

                BUSINESS_TIERS.forEach(biz => {
                    const count = p.business.owned[biz.id] || 0;
                    totalIncome += count * biz.income;
                    totalOwned += count;

                    // Cek Syarat
                    const canBuy = p.money >= biz.cost;
                    const reqMet = p.biz >= biz.reqBiz;

                    let btnStyle = "background:#10b981;";
                    let btnText = `BELI (${biz.cost.toLocaleString()} G)`;
                    let btnAction = `buyBusiness('${biz.id}')`;

                    if (!reqMet) {
                        btnStyle = "background:#334155; color:#64748b; cursor:not-allowed;";
                        btnText = `🔒 Butuh BIZ ${biz.reqBiz}`;
                        btnAction = "";
                    } else if (!canBuy) {
                        btnStyle = "background:#ef4444; opacity:0.7;";
                        btnText = `Uang Kurang`;
                    }

                    const div = document.createElement('div');
                    div.style.cssText = "background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:10px; border:1px solid #334155; display:flex; gap:10px; align-items:center;";

                    div.innerHTML = `
            <div style="font-size:30px;">${biz.icon}</div>
            <div style="flex:1;">
                <div style="font-weight:bold; color:#f1f5f9;">${biz.name} <span style="background:#f59e0b; color:black; padding:1px 6px; border-radius:10px; font-size:10px;">Lvl ${count}</span></div>
                <div style="font-size:10px; color:#94a3b8;">${biz.desc}</div>
                <div style="font-size:11px; color:#4ade80; margin-top:2px;">Income: +${biz.income} G / 5s</div>
            </div>
            <button class="auth-btn" style="width:auto; padding:8px 12px; font-size:10px; ${btnStyle}" onclick="${btnAction}">${btnText}</button>
        `;
                    list.appendChild(div);
                });

                document.getElementById('biz-income-rate').innerText = totalIncome.toLocaleString();
                document.getElementById('biz-total-assets').innerText = totalOwned + " Unit";
            }

            function buyBusiness(id) {
                const p = STATE.player;
                const biz = BUSINESS_TIERS.find(b => b.id === id);

                if (p.money >= biz.cost) {
                    p.money -= biz.cost;
                    p.business.owned[id] = (p.business.owned[id] || 0) + 1;
                    p.biz += 2; // Beli bisnis nambah skill bisnis

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createFloatingText(`-${biz.cost}`, '#ef4444');
                    showToast(`Sukses Membeli ${biz.name}!`);

                    updateBusinessUI();

                    // 💡 CEK KONSEKUENSI: jika sisa uang sangat tipis setelah beli bisnis
                    if (p.money < 500 && p.role === 'entrepreneur') {
                        setTimeout(() => {
                            showKonsekuensi('entrepreneur_broke');
                        }, 800);
                    }
                } else {
                    showToast("Uang tidak cukup!");
                }
            }

            /** * KONFIGURASI TREN SOSMED / VIRAL
             */
            const TRENDS_DB = [
                {
                    id: 'seblak',
                    name: 'Seblak Pedas',
                    newsTitle: 'SEBLAK MELEDAK!',
                    newsBody: 'Jajanan pedas ini bikin siswa sekolah ketagihan. Pedagang kehabisan stok kerupuk!',
                    item: 'kerupuk_mentah',
                    itemName: 'Kerupuk Mentah',
                    desc: 'Bahan utama Seblak.'
                },
                {
                    id: 'latte',
                    name: 'Kopi Gula Aren',
                    newsTitle: 'KOPI SENJA HITS!',
                    newsBody: 'Anak-anak indie mulai menyerbu kedai kopi. Biji kopi jadi langka di pasaran.',
                    item: 'biji_kopi',
                    itemName: 'Biji Kopi',
                    desc: 'Bahan dasar kopi viral.'
                },
                {
                    id: 'lato',
                    name: 'Lato-lato',
                    newsTitle: 'DEMAM TEK-TEK!',
                    newsBody: 'Suara "tek tek" terdengar di mana-mana. Mainan jadul ini viral lagi!',
                    item: 'bola_plastik',
                    itemName: 'Bola Plastik',
                    desc: 'Bahan mainan lato-lato.'
                },
                {
                    id: 'croffle',
                    name: 'Croffle',
                    newsTitle: 'ANTRIAN CROFFLE!',
                    newsBody: 'Perpaduan Croissant dan Waffle ini bikin antrian mengular. Butuh adonan banyak!',
                    item: 'adonan_pastry',
                    itemName: 'Adonan Pastry',
                    desc: 'Bahan kue kekinian.'
                }
            ];

            // ==========================================
            // LOGIKA TREN SOSMED
            // ==========================================

            // ==========================================
            // 2. SISTEM HP & VIRAL
            // ==========================================
            function generateDailyTrend() {
                STATE.viral.active = null; // Reset
                // 40% Peluang Viral
                if (Math.random() < 0.4) {
                    const randIndex = Math.floor(Math.random() * TRENDS_DB.length);
                    STATE.viral.active = TRENDS_DB[randIndex];

                    // Notifikasi Visual
                    const btn = document.getElementById('phone-btn');
                    if (btn) btn.classList.add('phone-ringing');
                    showToast(`🔥 BREAKING NEWS: ${STATE.viral.active.name} VIRAL!`);
                } else {
                    const btn = document.getElementById('phone-btn');
                    if (btn) btn.classList.remove('phone-ringing');
                }
            }

            // --- FIX: FUNGSI YANG HILANG (WAJIB ADA UNTUK INTERAKSI MERCHANT) ---
            function getViralOption(npcId) {
                // Cek apakah ada tren viral aktif hari ini
                if (!STATE.viral.active) return null;

                const trend = STATE.viral.active;
                const p = STATE.player;
                // Cek stok barang viral di tas pemain
                const owned = p.inventory[trend.item] || 0;

                // Harga Jual Barang Viral (Naik 300% dari harga beli 500G -> Jadi 1500G)
                const sellPrice = 1500;

                // Opsi 1: Jika punya barang, muncul tombol JUAL
                if (owned > 0) {
                    return {
                        text: `🔥 JUAL BARANG VIRAL: ${trend.itemName} (x${owned})`,
                        isViral: true,
                        action: () => {
                            showDialogue("PAK ADI — BOS MERCHANT",
                                `Wah! Kamu punya stok **${trend.itemName}**?\nBarang ini lagi dicari semua orang di Sosmed!\n\nSaya berani beli mahal: **${sellPrice.toLocaleString()} G** per item.\n(Normal: ~200 G)`,
                                [
                                    { text: `Jual 1 (+${sellPrice.toLocaleString()} G)`, action: () => sellViralItem(trend.item, sellPrice, 1) },
                                    { text: `Jual Semua (+${(sellPrice * owned).toLocaleString()} G)`, action: () => sellViralItem(trend.item, sellPrice, owned) },
                                    { text: "Tahan Dulu (Tunggu Harga Naik?)", action: () => interactNPC({ id: npcId, name: "Merchant", imgSrc: 'images/job.png' }) }
                                ],
                                'images/job.png'
                            );
                        }
                    };
                }
                // Opsi 2: Jika tidak punya, muncul tombol INFO (Hint) - UPDATE TEKS AGAR LEBIH MENGAJAK
                else {
                    return {
                        text: `🔥 Info Tren Viral (Peluang Cuan!)`,
                        action: () => showDialogue("PAK ADI — BOS MERCHANT", `Dengar-dengar **${trend.itemName}** lagi viral banget hari ini di Sosmed!\n\nGudang saya kosong, tapi permintaannya gila-gilaan.\n\nSiapapun kamu (Mahasiswa/Pekerja/Warga), kalau bisa dapat barangnya dari **Bu Lastri (Pedagang Keliling)**, bawa ke sini. Saya beli 3x lipat!`, [{ text: "Siap Bos, saya carikan!", action: closeDialogue }], 'images/job.png')
                    };
                }
            }

            // ═══════════════════════════════════════════
            // 🎣 FISHING OVERLAY — JS CONTROLLER
            // ═══════════════════════════════════════════
            function showFishingOverlay() {
                const overlay = document.getElementById('fishing-overlay');
                if (!overlay) return;
                overlay.classList.add('active');
                document.body.classList.add('is-fishing');

                // Set zona target di bar
                const targetZone = document.getElementById('fishing-target-zone');
                if (targetZone) {
                    targetZone.style.left = STATE.fishing.targetStart + '%';
                    targetZone.style.width = STATE.fishing.targetWidth + '%';
                }
            }

            function hideFishingOverlay() {
                const overlay = document.getElementById('fishing-overlay');
                if (!overlay) return;
                overlay.classList.remove('active');
                document.body.classList.remove('is-fishing');
            }

            function updateFishingOverlayBar() {
                const indicator = document.getElementById('fishing-indicator');
                if (!indicator) return;
                indicator.style.left = STATE.fishing.barX + '%';

                // Warna indikator berubah hijau saat di zona target
                const inZone = STATE.fishing.barX >= STATE.fishing.targetStart &&
                               STATE.fishing.barX <= (STATE.fishing.targetStart + STATE.fishing.targetWidth);
                if (inZone) {
                    indicator.style.background = 'linear-gradient(to bottom, #fff, #4ade80, #fff)';
                    indicator.style.boxShadow = '0 0 10px #4ade80, 0 0 20px #4ade80, 0 0 4px rgba(255,255,255,0.9)';
                } else {
                    indicator.style.background = 'linear-gradient(to bottom, #fff, #7dd3fc, #fff)';
                    indicator.style.boxShadow = '0 0 10px #fff, 0 0 20px #7dd3fc, 0 0 4px rgba(255,255,255,0.9)';
                }
            }

            function handleFishingBtnClick(e) {
                // Ripple effect
                const btn = document.getElementById('fishing-action-btn');
                if (btn) {
                    const ripple = document.createElement('span');
                    ripple.className = 'fishing-ripple';
                    const rect = btn.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = ((e.clientX || rect.left + rect.width/2) - rect.left - size/2) + 'px';
                    ripple.style.top = ((e.clientY || rect.top + rect.height/2) - rect.top - size/2) + 'px';
                    btn.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                }
                if (STATE.fishing && STATE.fishing.active) checkFishing();
            }

            // ═══════════════════════════════════════════════════════════
            // 💡 SISTEM KONSEKUENSI NYATA
            // Menghubungkan kejadian di game dengan fakta dunia nyata
            // + wajib tulis refleksi sebelum lanjut
            // ═══════════════════════════════════════════════════════════

            // Database fakta & pertanyaan per kondisi
            const KONSEKUENSI_DB = {

                // ── WIRAUSAHA / ENTREPRENEUR ──────────────────────────
                entrepreneur_broke: {
                    icon: '💸',
                    title: 'MODAL HABIS — WIRAUSAHA',
                    fact: '60% UMKM di Indonesia gagal di tahun pertama karena kurang perencanaan modal dan manajemen arus kas. Kamu baru saja mengalaminya dengan aman di sini.',
                    question: 'Di dunia nyata, apa langkah pertama yang kamu ambil sebelum memulai usaha agar tidak kehabisan modal?'
                },
                entrepreneur_debt: {
                    icon: '🏦',
                    title: 'TERJEBAK HUTANG — WIRAUSAHA',
                    fact: 'Hutang usaha yang tidak terencana adalah penyebab ke-2 kebangkrutan UMKM. Bank Indonesia mencatat 42% pelaku usaha pemula tidak memiliki catatan keuangan sederhana.',
                    question: 'Bagaimana cara kamu membedakan "hutang produktif" dan "hutang konsumtif" dalam menjalankan usaha?'
                },
                entrepreneur_low_biz: {
                    icon: '📉',
                    title: 'PENJUALAN STAGNAN — WIRAUSAHA',
                    fact: 'Studi Kemenkop menunjukkan 78% UMKM gagal berkembang karena tidak melakukan inovasi produk dan riset pasar. Pelanggan pergi ke kompetitor yang lebih kreatif.',
                    question: 'Apa satu inovasi konkret yang bisa kamu lakukan untuk membuat produk atau jasamu lebih menarik?'
                },

                // ── PEKERJA / WORKER ──────────────────────────────────
                worker_fired: {
                    icon: '🏭',
                    title: 'REPUTASI BOSS HANCUR — PEKERJA',
                    fact: 'Survei LinkedIn 2023: 89% karyawan dipecat bukan karena kurang skill, melainkan karena soft skill — disiplin, komunikasi, dan sikap kerja yang buruk.',
                    question: 'Apa satu kebiasaan buruk di tempat kerja yang ingin kamu perbaiki, dan bagaimana caranya?'
                },
                worker_low_energy: {
                    icon: '😴',
                    title: 'KELELAHAN — PEKERJA',
                    fact: 'WHO menyebut burnout sebagai fenomena kerja resmi. 40% pekerja muda Indonesia mengalami kelelahan kronis karena tidak menjaga keseimbangan kerja dan istirahat.',
                    question: 'Bagaimana cara kamu menjaga stamina fisik dan mental agar produktif tapi tidak kelelahan?'
                },
                worker_broke: {
                    icon: '💼',
                    title: 'GAJI HABIS SEBELUM AKHIR BULAN',
                    fact: '75% karyawan muda Indonesia menghabiskan gaji dalam 10 hari pertama tanpa tabungan darurat. Ini disebut "Paycheck to Paycheck" — lingkaran yang sulit diputus.',
                    question: 'Jika kamu punya gaji 3 juta, berapa yang akan kamu alokasikan untuk tabungan, kebutuhan pokok, dan hiburan?'
                },

                // ── MAHASISWA / STUDENT ───────────────────────────────
                student_failed_exam: {
                    icon: '📚',
                    title: 'GAGAL UJIAN — MAHASISWA',
                    fact: 'Penelitian Universitas Cambridge: Belajar sistem SKS (belajar banyak di malam terakhir) hanya efektif 23% dibanding belajar terjadwal harian. Otak manusia butuh pengulangan berkala.',
                    question: 'Bagaimana strategi belajarmu selama ini? Apa yang akan kamu ubah agar nilaimu lebih baik?'
                },
                student_debt_ukt: {
                    icon: '🎓',
                    title: 'TUNGGAKAN UKT — MAHASISWA',
                    fact: 'Data Kemendikbud: 1 dari 5 mahasiswa Indonesia terancam DO karena masalah biaya. Perencanaan finansial sejak SMA bisa mencegah ini.',
                    question: 'Apa langkah nyata yang bisa kamu mulai sekarang untuk mempersiapkan biaya kuliah atau melunasi tanggungan?'
                },
                student_low_int: {
                    icon: '🧠',
                    title: 'PRESTASI MENURUN — MAHASISWA',
                    fact: 'Riset Stanford: Menghabiskan >4 jam/hari di medsos menurunkan kemampuan fokus dan nilai akademik rata-rata 1,2 poin. Distraksi digital adalah musuh terbesar pelajar masa kini.',
                    question: 'Berapa jam sehari kamu habiskan untuk belajar vs untuk hiburan digital? Apakah porsinya sudah seimbang?'
                },

                // ── KEHIDUPAN KELUARGA / FAMILY ───────────────────────
                family_broke: {
                    icon: '🏠',
                    title: 'EKONOMI KELUARGA KRITIS',
                    fact: 'BKKBN mencatat 64% perceraian dini di Indonesia dipicu masalah finansial. Menikah tanpa kesiapan ekonomi meningkatkan risiko konflik rumah tangga 3x lipat.',
                    question: 'Menurut kamu, kesiapan apa saja yang harus dipenuhi sebelum seseorang siap membangun keluarga?'
                },
                family_low_rep: {
                    icon: '💔',
                    title: 'HUBUNGAN MEMBURUK — KELUARGA',
                    fact: 'Psikolog Dr. John Gottman menemukan: butuh 5 interaksi positif untuk mengimbangi 1 interaksi negatif dalam hubungan. Konsistensi perhatian kecil lebih kuat dari hadiah besar sesekali.',
                    question: 'Apa satu hal sederhana yang bisa kamu lakukan setiap hari untuk menjaga hubungan baikmu dengan orang-orang terdekat?'
                },

                // ── UMUM (FALLBACK) ────────────────────────────────────
                general_broke: {
                    icon: '💰',
                    title: 'KEUANGAN KRITIS',
                    fact: 'OJK Indonesia: Hanya 38% anak muda Indonesia memiliki tabungan darurat minimal 3 bulan pengeluaran. Literasi keuangan sejak dini adalah kunci kebebasan finansial.',
                    question: 'Langkah keuangan apa yang ingin kamu mulai terapkan mulai hari ini dalam kehidupan nyatamu?'
                },
                general_low_energy: {
                    icon: '⚡',
                    title: 'KEHABISAN ENERGI',
                    fact: 'WHO: Remaja butuh 8-10 jam tidur per malam untuk fungsi otak optimal. Kurang tidur kronis menurunkan kemampuan belajar hingga 40% dan meningkatkan risiko depresi.',
                    question: 'Bagaimana pola istirahatmu selama ini? Apa yang akan kamu ubah untuk menjaga kesehatan fisik dan mentalmu?'
                }
            };

            // State: callback yang dijalankan SETELAH refleksi selesai
            let _konsekuensiCallback = null;
            let _konsekuensiKey = null;

            // ── FUNGSI UTAMA: tampilkan layar konsekuensi ──
            function showKonsekuensi(kondisi, callback) {
                const data = KONSEKUENSI_DB[kondisi] || KONSEKUENSI_DB['general_broke'];
                _konsekuensiCallback = callback || null;
                _konsekuensiKey = kondisi;

                document.getElementById('konsekuensi-icon').innerText = data.icon;
                document.getElementById('konsekuensi-title').innerText = data.title;
                document.getElementById('konsekuensi-fact-text').innerText = data.fact;
                document.getElementById('konsekuensi-question').innerText = data.question;
                document.getElementById('konsekuensi-textarea').value = '';
                document.getElementById('konsekuensi-char-count').innerText = '0 / 20 karakter minimum';
                document.getElementById('konsekuensi-char-count').className = 'konsekuensi-char-count';
                document.getElementById('konsekuensi-submit-btn').disabled = true;

                document.getElementById('konsekuensi-modal').classList.add('active');
                STATE.screen = 'modal';

                setTimeout(() => document.getElementById('konsekuensi-textarea').focus(), 400);
            }

            function updateKonsekuensiChar() {
                const val = document.getElementById('konsekuensi-textarea').value.trim();
                const len = val.length;
                const countEl = document.getElementById('konsekuensi-char-count');
                const btn = document.getElementById('konsekuensi-submit-btn');
                const MIN = 20;
                countEl.innerText = `${len} / ${MIN} karakter minimum`;
                if (len >= MIN) {
                    countEl.className = 'konsekuensi-char-count ok';
                    btn.disabled = false;
                    btn.innerText = 'LANJUTKAN →';
                } else {
                    countEl.className = 'konsekuensi-char-count';
                    btn.disabled = true;
                }
            }

            function submitKonsekuensi() {
                const text = document.getElementById('konsekuensi-textarea').value.trim();
                if (text.length < 20) return;

                // Simpan ke refleksi jurnal player dengan tag khusus
                if (!STATE.player.reflections) STATE.player.reflections = [];
                STATE.player.reflections.push({
                    day: STATE.day,
                    text: `[KONSEKUENSI NYATA — ${_konsekuensiKey}] ${text}`,
                    timestamp: Date.now()
                });
                manualSave();

                document.getElementById('konsekuensi-modal').classList.remove('active');
                STATE.screen = 'play';

                showToast('✅ Refleksi tersimpan! +10 INT');
                STATE.player.int = (STATE.player.int || 0) + 10;

                if (typeof _konsekuensiCallback === 'function') {
                    _konsekuensiCallback();
                    _konsekuensiCallback = null;
                }
            }

            // ── FUNGSI CEK OTOMATIS (dipanggil saat tidur / ganti hari) ──
            function checkKonsekuensiTriggers(onDone) {
                const p = STATE.player;
                const role = p.role;

                // Cek apakah sudah pernah trigger hari ini
                if (p.lastKonsekuensiDay === STATE.day) {
                    if (typeof onDone === 'function') onDone();
                    return;
                }

                let kondisi = null;

                // ── WIRAUSAHA ──
                if (role === 'entrepreneur') {
                    if (p.money <= 0) kondisi = 'entrepreneur_broke';
                    else if (p.money < 0) kondisi = 'entrepreneur_debt';
                    else if ((p.biz || 0) < 10 && STATE.day > 14) kondisi = 'entrepreneur_low_biz';
                }
                // ── PEKERJA ──
                else if (role === 'worker') {
                    if ((p.bossReputation || 0) < 20 && STATE.day > 7) kondisi = 'worker_fired';
                    else if (p.money < 500 && STATE.day > 5) kondisi = 'worker_broke';
                    else if ((p.energy || 100) < 15) kondisi = 'worker_low_energy';
                }
                // ── MAHASISWA ──
                else if (role === 'student') {
                    if (p.money < 0) kondisi = 'student_debt_ukt';
                    else if (p.lastExamFailDay && (STATE.day - p.lastExamFailDay) <= 2) kondisi = 'student_failed_exam';
                    else if ((p.int || 0) < 10 && STATE.day > 10) kondisi = 'student_low_int';
                }
                // ── KELUARGA ──
                else if (role === 'family') {
                    if (p.money < 0) kondisi = 'family_broke';
                    else if ((p.rep || 0) < 10 && STATE.day > 7) kondisi = 'family_low_rep';
                }

                // Fallback umum
                if (!kondisi && p.money < 100 && STATE.day > 3) {
                    kondisi = 'general_broke';
                }

                if (kondisi) {
                    p.lastKonsekuensiDay = STATE.day;
                    showKonsekuensi(kondisi, onDone);
                } else {
                    if (typeof onDone === 'function') onDone();
                }
            }

            // ═══════════════════════════════════════════════════════════
            // 🎯 CAREER REALITY CHECK — DATA & FUNGSI
            // Menampilkan data nyata dunia kerja sebelum siswa
            // mengkonfirmasi pilihan jalur karir mereka
            // ═══════════════════════════════════════════════════════════

            const CAREER_REALITY_DATA = {

                worker: {
                    icon: '⚔️',
                    name: 'JALUR PEKERJA',
                    sub: 'FIGHTER — STR++ / Dunia Kerja Nyata',
                    headerGradient: 'linear-gradient(135deg, #1e3a5f, #1d4ed8, #2563eb)',
                    accentColor: '#3b82f6',
                    stats: [
                        {
                            label: '💵 UMR Jawa Timur 2025',
                            value: 'Rp 2.165.244 / bulan',
                            color: '#60a5fa'
                        },
                        {
                            label: '🏆 UMR Surabaya 2025',
                            value: 'Rp 4.887.540 / bulan',
                            color: '#34d399'
                        },
                        {
                            label: '📊 Persaingan Kerja',
                            value: '1 lowongan untuk\n50–80 pelamar',
                            color: '#f87171'
                        },
                        {
                            label: '📈 Kenaikan Gaji Rata-rata',
                            value: '8–12% per tahun\njika berprestasi',
                            color: '#a78bfa'
                        },
                        {
                            label: '🎓 Sertifikasi Pendongkrak Gaji',
                            value: 'BNSP, LSP-P1, K3 Umum,\nBrevet Pajak, Sertifikasi SMK',
                            color: '#fbbf24',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Disiplin & Tepat Waktu', color: '#1d4ed8', bg: '#dbeafe' },
                        { label: 'Komunikasi Kerja', color: '#1e40af', bg: '#eff6ff' },
                        { label: 'Kerja Tim', color: '#1d4ed8', bg: '#dbeafe' },
                        { label: 'Microsoft Office', color: '#1e40af', bg: '#eff6ff' },
                        { label: 'Manajemen Waktu', color: '#1d4ed8', bg: '#dbeafe' },
                        { label: 'Problem Solving', color: '#1e40af', bg: '#eff6ff' }
                    ],
                    insightLabel: '📊 FAKTA BPS 2024',
                    insightBg: 'rgba(59,130,246,0.08)',
                    insightBorder: 'rgba(59,130,246,0.3)',
                    insightColor: '#93c5fd',
                    insight: 'Lulusan SMK memiliki tingkat penyerapan kerja 62% dalam 1 tahun — tertinggi dibanding lulusan SMA/MA. Kompetensi vokasi + sertifikasi BNSP meningkatkan gaji awal hingga 35%.',
                    confirmColor: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                    confirmShadow: 'rgba(59,130,246,0.4)'
                },

                student: {
                    icon: '🎓',
                    name: 'JALUR MAHASISWA',
                    sub: 'MAGE — INT++ / Dunia Akademik Nyata',
                    headerGradient: 'linear-gradient(135deg, #1a1a2e, #6d28d9, #7c3aed)',
                    accentColor: '#8b5cf6',
                    stats: [
                        {
                            label: '💰 Biaya Kuliah / Semester',
                            value: 'PTN: Rp 500k–5 juta\nPTS: Rp 3–15 juta',
                            color: '#c4b5fd'
                        },
                        {
                            label: '⏱️ Lama Studi S1',
                            value: 'Rata-rata 4,5 tahun\n(target 4 tahun)',
                            color: '#a78bfa'
                        },
                        {
                            label: '📉 Angka DO Nasional',
                            value: '~25% mahasiswa\ntidak sampai wisuda',
                            color: '#f87171'
                        },
                        {
                            label: '💼 Rata-rata Gaji Fresh Graduate',
                            value: 'Rp 3–5 juta/bulan\n(tergantung jurusan)',
                            color: '#34d399'
                        },
                        {
                            label: '🏅 Jurusan Paling Dicari Industri',
                            value: 'Teknologi Informasi, Akuntansi, Teknik Industri,\nKeperawatan, Pendidikan Vokasi',
                            color: '#fbbf24',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Berpikir Kritis', color: '#6d28d9', bg: '#ede9fe' },
                        { label: 'Riset & Analisis', color: '#5b21b6', bg: '#f5f3ff' },
                        { label: 'Manajemen Waktu', color: '#6d28d9', bg: '#ede9fe' },
                        { label: 'Menulis Ilmiah', color: '#5b21b6', bg: '#f5f3ff' },
                        { label: 'Bahasa Inggris', color: '#6d28d9', bg: '#ede9fe' },
                        { label: 'Teknologi Digital', color: '#5b21b6', bg: '#f5f3ff' }
                    ],
                    insightLabel: '🎓 INSIGHT KEMENDIKBUD',
                    insightBg: 'rgba(139,92,246,0.08)',
                    insightBorder: 'rgba(139,92,246,0.3)',
                    insightColor: '#c4b5fd',
                    insight: '1 dari 5 mahasiswa Indonesia tidak menyelesaikan kuliah karena masalah finansial. Siswa yang lulus dengan IPK 3.5+ dan aktif magang mendapat gaji pertama 2× lebih tinggi dari rata-rata.',
                    confirmColor: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
                    confirmShadow: 'rgba(139,92,246,0.4)'
                },

                entrepreneur: {
                    icon: '🏪',
                    name: 'JALUR WIRAUSAHA',
                    sub: 'SUPPORT — BIZ++ / Dunia UMKM Nyata',
                    headerGradient: 'linear-gradient(135deg, #78350f, #d97706, #f59e0b)',
                    accentColor: '#f59e0b',
                    stats: [
                        {
                            label: '💵 Modal Awal UMKM Rata-rata',
                            value: 'Rp 5–50 juta\n(skala mikro: < Rp 5 juta)',
                            color: '#fcd34d'
                        },
                        {
                            label: '📊 Tingkat Keberhasilan Tahun 1',
                            value: 'Hanya 40% bertahan\n60% tutup tahun pertama',
                            color: '#f87171'
                        },
                        {
                            label: '📈 Omset UMKM Sukses',
                            value: 'Rp 10–300 juta/bulan\n(setelah 3 tahun)',
                            color: '#34d399'
                        },
                        {
                            label: '🏦 Akses Modal Usaha',
                            value: 'KUR BRI/BNI: 3–6%/tahun\nDana bergulir Kemenkop',
                            color: '#93c5fd'
                        },
                        {
                            label: '📱 Platform Jualan Digital Terpopuler',
                            value: 'Shopee, TikTok Shop, Instagram, Tokopedia — GRATIS untuk mulai',
                            color: '#a78bfa',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Manajemen Keuangan', color: '#92400e', bg: '#fef3c7' },
                        { label: 'Pemasaran Digital', color: '#78350f', bg: '#fffbeb' },
                        { label: 'Negosiasi', color: '#92400e', bg: '#fef3c7' },
                        { label: 'Kreativitas Produk', color: '#78350f', bg: '#fffbeb' },
                        { label: 'Layanan Pelanggan', color: '#92400e', bg: '#fef3c7' },
                        { label: 'Pencatatan Usaha', color: '#78350f', bg: '#fffbeb' }
                    ],
                    insightLabel: '📊 DATA KEMENKOP 2024',
                    insightBg: 'rgba(245,158,11,0.08)',
                    insightBorder: 'rgba(245,158,11,0.3)',
                    insightColor: '#fcd34d',
                    insight: '65,5 juta UMKM menyumbang 61% PDB Indonesia — tapi 78% tidak punya catatan keuangan. UMKM yang pakai digital marketing tumbuh 3× lebih cepat dari yang tidak.',
                    confirmColor: 'linear-gradient(135deg, #d97706, #f59e0b)',
                    confirmShadow: 'rgba(245,158,11,0.4)'
                },

                family: {
                    icon: '🏠',
                    name: 'JALUR KELUARGA',
                    sub: 'FAMILY — REP++ / Realita Rumah Tangga',
                    headerGradient: 'linear-gradient(135deg, #831843, #db2777, #ec4899)',
                    accentColor: '#ec4899',
                    stats: [
                        {
                            label: '💰 Biaya Hidup Keluarga/Bulan',
                            value: 'Minimum Rp 3–5 juta\n(pasangan + 1 anak)',
                            color: '#f9a8d4'
                        },
                        {
                            label: '📉 Angka Cerai Indonesia',
                            value: '516.000 kasus/tahun\n(naik 54% sejak 2019)',
                            color: '#f87171'
                        },
                        {
                            label: '⚠️ Penyebab Konflik Utama',
                            value: '#1 Masalah Finansial\n#2 Komunikasi buruk',
                            color: '#fbbf24'
                        },
                        {
                            label: '👶 Usia Ideal Menikah (WHO)',
                            value: 'Perempuan ≥ 21 tahun\nLaki-laki ≥ 25 tahun',
                            color: '#34d399'
                        },
                        {
                            label: '💡 Kunci Keluarga Harmonis',
                            value: 'Komunikasi terbuka · Kestabilan finansial · Dukungan emosional · Perencanaan bersama',
                            color: '#a78bfa',
                            wide: true
                        }
                    ],
                    skills: [
                        { label: 'Komunikasi Pasangan', color: '#9d174d', bg: '#fce7f3' },
                        { label: 'Manajemen Anggaran', color: '#831843', bg: '#fdf2f8' },
                        { label: 'Parenting', color: '#9d174d', bg: '#fce7f3' },
                        { label: 'Empati & Sabar', color: '#831843', bg: '#fdf2f8' },
                        { label: 'Problem Solving', color: '#9d174d', bg: '#fce7f3' },
                        { label: 'Perencanaan Masa Depan', color: '#831843', bg: '#fdf2f8' }
                    ],
                    insightLabel: '💔 DATA BKKBN 2024',
                    insightBg: 'rgba(236,72,153,0.08)',
                    insightBorder: 'rgba(236,72,153,0.3)',
                    insightColor: '#f9a8d4',
                    insight: '64% perceraian dini dipicu masalah ekonomi. Remaja yang menikah sebelum 20 tahun memiliki risiko kemiskinan 3× lebih tinggi. Pendidikan & karir yang mapan adalah fondasi keluarga sehat.',
                    confirmColor: 'linear-gradient(135deg, #be185d, #ec4899)',
                    confirmShadow: 'rgba(236,72,153,0.4)'
                }
            };

            let _pendingRole = null; // Role yang menunggu konfirmasi

            // Tampilkan Career Reality Check sebelum setRole dipanggil
            function showCareerCheck(role) {
                const data = CAREER_REALITY_DATA[role];
                if (!data) { setRole(role); return; } // Fallback langsung

                _pendingRole = role;

                // Set header
                const header = document.getElementById('crc-header');
                header.style.background = data.headerGradient;
                document.getElementById('crc-icon').innerText = data.icon;
                document.getElementById('crc-role-name').style.color = '#fff';
                document.getElementById('crc-role-name').innerText = data.name;
                document.getElementById('crc-role-sub').innerText = data.sub;

                // Buat stat cards
                const grid = document.getElementById('crc-stats-grid');
                grid.innerHTML = '';
                data.stats.forEach(s => {
                    const card = document.createElement('div');
                    card.className = 'crc-stat-card' + (s.wide ? ' highlight' : '');
                    card.style.borderColor = s.color + '33';
                    card.innerHTML = `
                        <div class="crc-stat-label" style="color:${s.color}">${s.label}</div>
                        <div class="crc-stat-value" style="white-space:pre-line">${s.value}</div>
                    `;
                    grid.appendChild(card);
                });

                // Buat skill tags
                const skillsEl = document.getElementById('crc-skills');
                skillsEl.innerHTML = '';
                data.skills.forEach(sk => {
                    const tag = document.createElement('span');
                    tag.className = 'crc-skill-tag';
                    tag.style.background = sk.bg;
                    tag.style.color = sk.color;
                    tag.innerText = sk.label;
                    skillsEl.appendChild(tag);
                });

                // Insight
                const insightEl = document.getElementById('crc-insight');
                insightEl.style.background = data.insightBg;
                insightEl.style.borderLeft = `3px solid ${data.insightBorder}`;
                document.getElementById('crc-insight-label').style.color = data.insightColor;
                document.getElementById('crc-insight-label').innerText = data.insightLabel;
                document.getElementById('crc-insight-text').style.color = data.insightColor;
                document.getElementById('crc-insight-text').innerText = data.insight;

                // Tombol konfirmasi
                const btn = document.getElementById('crc-confirm-btn');
                btn.style.background = data.confirmColor;
                btn.style.boxShadow = `0 4px 20px ${data.confirmShadow}`;
                btn.style.color = role === 'entrepreneur' ? '#0f172a' : '#fff';

                document.getElementById('career-check-modal').classList.add('active');
                STATE.screen = 'modal';
            }

            function confirmCareerChoice() {
                document.getElementById('career-check-modal').classList.remove('active');
                STATE.screen = 'play';
                if (_pendingRole) {
                    const role = _pendingRole;
                    _pendingRole = null;
                    setRole(role);
                }
            }

            function cancelCareerCheck() {
                document.getElementById('career-check-modal').classList.remove('active');
                STATE.screen = 'play';
                _pendingRole = null;
                // Kembali ke menu pilih role
                setTimeout(() => openRoleSelection(), 200);
            }

            // ═══════════════════════════════════════════════════════════
            // 📋 POTRET MASA DEPANKU — ENGINE LAPORAN AKHIR
            // ═══════════════════════════════════════════════════════════

            // Warna tema per jalur
            const POTRET_THEME = {
                worker:       { bg: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #3b82f6 100%)', accent: '#3b82f6', light: '#dbeafe', text: '#1e40af', seal: '#1d4ed8' },
                student:      { bg: 'linear-gradient(135deg, #1a1a2e 0%, #6d28d9 60%, #8b5cf6 100%)', accent: '#8b5cf6', light: '#ede9fe', text: '#5b21b6', seal: '#6d28d9' },
                entrepreneur: { bg: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #f59e0b 100%)', accent: '#f59e0b', light: '#fef3c7', text: '#92400e', seal: '#d97706' },
                family:       { bg: 'linear-gradient(135deg, #831843 0%, #db2777 60%, #ec4899 100%)', accent: '#ec4899', light: '#fce7f3', text: '#9d174d', seal: '#be185d' },
                none:         { bg: 'linear-gradient(135deg, #1e293b 0%, #334155 60%, #475569 100%)', accent: '#94a3b8', light: '#f1f5f9', text: '#64748b', seal: '#334155' }
            };

            // Nama jalur dalam bahasa Indonesia
            const ROLE_LABEL = {
                worker: '⚔️ Pekerja (Fighter)',
                student: '🎓 Mahasiswa (Mage)',
                entrepreneur: '🏪 Wirausaha (Support)',
                family: '🏠 Keluarga (Family)',
                none: '❓ Belum Memilih'
            };

            // Definisi kompetensi yang diukur per jalur
            function getKompetensi(p) {
                const role = p.role || 'none';
                const str = p.str || 0;
                const int = p.int || 0;
                const biz = p.biz || 0;
                const rep = p.reputation || 0;
                const maxStat = 100;

                const base = [
                    { name: 'Physical Strength', label: 'STR', val: str, max: maxStat, color: '#ef4444', bg: '#fef2f2' },
                    { name: 'Intelligence',       label: 'INT', val: int, max: maxStat, color: '#3b82f6', bg: '#eff6ff' },
                    { name: 'Business Acumen',    label: 'BIZ', val: biz, max: maxStat, color: '#10b981', bg: '#f0fdf4' },
                    { name: 'Reputation / Sosial',label: 'REP', val: rep, max: 200,     color: '#ec4899', bg: '#fdf4ff' },
                ];

                // Tambah kompetensi turunan
                const journalCount = (p.reflections || []).length;
                const fishingCount = p.totalFishingCount || p.dailyFishingCount || 0;
                const houseLevel   = p.houseLevel || 1;

                base.push(
                    { name: 'Refleksi Diri',   label: '📝', val: Math.min(journalCount * 10, 100), max: 100, color: '#f59e0b', bg: '#fffbeb' },
                    { name: 'Gaya Hidup Sehat', label: '🎣', val: Math.min(fishingCount * 5, 100),  max: 100, color: '#06b6d4', bg: '#ecfeff' },
                );

                if (role === 'entrepreneur' || role === 'family') {
                    base.push({ name: 'Aset & Properti', label: '🏠', val: Math.min(houseLevel * 20, 100), max: 100, color: '#d97706', bg: '#fef3c7' });
                }
                if (role === 'worker') {
                    const bossRep = p.bossReputation || 50;
                    base.push({ name: 'Work Ethic', label: '💼', val: Math.min(bossRep, 100), max: 100, color: '#1d4ed8', bg: '#dbeafe' });
                }

                return base;
            }

            // Hitung bintang (1–5) dari nilai 0–100
            function toBintang(val, max) {
                const pct = Math.min(val / max, 1);
                const stars = Math.round(pct * 5);
                const filled = '⭐'.repeat(stars);
                const empty = '☆'.repeat(5 - stars);
                return { stars, filled, empty, pct };
            }

            // Buat teks rekomendasi personal
            function buildRekomendasi(p, kompetensi) {
                const role = p.role || 'none';
                const name = (DataService.user && DataService.user.name) ? DataService.user.name.split(' ')[0] : 'Kamu';
                const money = p.money || 0;
                const int   = p.int || 0;
                const biz   = p.biz || 0;
                const str   = p.str || 0;
                const rep   = p.reputation || 0;
                const reflCount = (p.reflections || []).length;

                // Cari kompetensi terkuat & terlemah
                const sorted = [...kompetensi].sort((a,b) => (b.val/b.max) - (a.val/a.max));
                const terkuat = sorted[0];
                const terlemah = sorted[sorted.length - 1];

                let rekom = '';

                if (role === 'entrepreneur') {
                    if (biz >= 40 && money >= 50000) {
                        rekom = `<strong>${name}</strong> menunjukkan naluri wirausaha yang kuat. Kamu sudah membuktikan bisa mengelola modal dan tumbuh. Di dunia nyata, kamu cocok mengembangkan usaha berbasis <strong>digital marketing</strong> atau <strong>kuliner kreatif</strong>.\n\nPertimbangkan ikut <strong>pelatihan UMKM Kemenkop</strong> atau program <strong>Young Entrepreneur SMK</strong> sebelum lulus.`;
                    } else if (biz < 20) {
                        rekom = `<strong>${name}</strong> memilih jalur wirausaha, namun skill bisnis masih perlu diasah. Di dunia nyata, <strong>60% UMKM gagal di tahun pertama</strong> karena lemah manajemen keuangan.\n\nRekomendasi: Pelajari <strong>pembukuan sederhana</strong> dan ikuti <strong>Prakerja digital marketing</strong> untuk memperkuat pondasimu.`;
                    } else {
                        rekom = `<strong>${name}</strong> punya potensi wirausaha yang berkembang. Fokuskan pada penguatan jaringan bisnis (REP) dan pencatatan keuangan.\n\nDi dunia nyata, pertimbangkan bergabung dengan <strong>komunitas UMKM lokal</strong> atau ikut program inkubasi bisnis SMK.`;
                    }
                } else if (role === 'worker') {
                    const bossRep = p.bossReputation || 50;
                    if (str >= 40 && bossRep >= 70) {
                        rekom = `<strong>${name}</strong> terbukti disiplin dan beretos kerja tinggi — modal terpenting di dunia kerja nyata. Dengan reputasi kerja yang baik, kamu cocok mengejar karir di bidang <strong>manufaktur, logistik, atau teknik</strong>.\n\nTingkatkan nilai dengan mengambil <strong>sertifikasi BNSP</strong> atau <strong>magang industri</strong> sebelum lulus.`;
                    } else if (bossRep < 30) {
                        rekom = `<strong>${name}</strong> perlu meningkatkan etos kerja dan kedisiplinan. Di dunia nyata, <strong>89% karyawan kehilangan pekerjaan karena soft skill</strong>, bukan karena kurang pintar.\n\nFokus pada: tepat waktu, komunikasi yang baik, dan konsistensi dalam menyelesaikan tugas.`;
                    } else {
                        rekom = `<strong>${name}</strong> menunjukkan kemampuan bekerja yang solid. Untuk naik level, pertimbangkan mengambil <strong>sertifikasi kompetensi LSP-P1</strong> yang relevan dengan jurusanmu di SMK.`;
                    }
                } else if (role === 'student') {
                    if (int >= 50) {
                        rekom = `<strong>${name}</strong> memiliki kecerdasan akademik di atas rata-rata. Berbekal INT tinggi, kamu cocok melanjutkan ke <strong>PTN favorit</strong> melalui jalur prestasi atau SNBT.\n\nPrioritaskan <strong>persiapan UTBK sejak kelas 11</strong> dan aktif di organisasi untuk memperkuat REP (soft skill).`;
                    } else if (reflCount < 3) {
                        rekom = `<strong>${name}</strong> masih perlu meningkatkan kebiasaan refleksi diri. Hanya menulis <strong>${reflCount} jurnal</strong> selama bermain — padahal refleksi adalah kunci belajar mandiri.\n\nRekomendasi: Biasakan jurnal harian dan diskusi dengan guru atau teman sebaya untuk mempercepat pertumbuhan.`;
                    } else {
                        rekom = `<strong>${name}</strong> aktif merefleksikan perjalanan belajarnya (${reflCount} jurnal). Di dunia nyata, kebiasaan ini adalah ciri pelajar mandiri yang sukses di perguruan tinggi.\n\nPertimbangkan jalur <strong>vokasi lanjut (D3/D4)</strong> yang sesuai jurusan SMK-mu.`;
                    }
                } else if (role === 'family') {
                    if (rep >= 80 && money >= 30000) {
                        rekom = `<strong>${name}</strong> berhasil menjaga keseimbangan kehidupan keluarga dan finansial — kombinasi yang langka. Di dunia nyata, kesuksesan berkeluarga butuh kematangan emosi dan finansial.\n\nRekomendasi: Pelajari <strong>perencanaan keuangan keluarga</strong> dan ikuti program <strong>BKKBN Generasi Berencana</strong>.`;
                    } else {
                        rekom = `<strong>${name}</strong> memilih jalur keluarga, namun masih ada tantangan yang belum terselesaikan. Ingat: di dunia nyata, <strong>64% perpisahan dini dipicu masalah finansial</strong>.\n\nFokuskan dulu pada: pendidikan yang selesai, karir yang stabil, lalu membangun keluarga yang siap.`;
                    }
                } else {
                    rekom = `<strong>${name}</strong> belum menentukan jalur karir secara jelas. Di dunia nyata, menunda keputusan bisa berarti kehilangan kesempatan.\n\nMulailah dengan kenali dirimu: apa yang kamu nikmati, apa keahlianmu, dan bayangkan dirimu 5 tahun ke depan.`;
                }

                // Tambah insight terlemah
                rekom += `\n\n📌 Area yang perlu dikembangkan: <strong>${terlemah.name}</strong> — tingkatkan dengan latihan konsisten.`;

                return rekom.replace(/\n/g, '<br>');
            }

            // Hitung predikat kelulusan
            function getPredikat(p) {
                const score = (p.str||0) + (p.int||0) + (p.biz||0) + Math.min(p.reputation||0, 100) + (p.level||1)*5;
                const refleksi = (p.reflections||[]).length;
                const money = p.money || 0;

                if (score >= 200 && money >= 100000 && refleksi >= 5) return { label: '🏆 MANUSIA SEUTUHNYA',       color: '#b45309' };
                if (score >= 150 && money >= 50000)                   return { label: '⭐ PRIBADI YANG BERKEMBANG',  color: '#1d4ed8' };
                if (score >= 100)                                      return { label: '📈 KARAKTER YANG MENEMPA',    color: '#059669' };
                if (score >= 60)                                       return { label: '🌱 BENIH MASA DEPAN',          color: '#d97706' };
                return                                                        { label: '🌅 MASIH DALAM PERJALANAN',   color: '#94a3b8' };
            }

            // ── FUNGSI UTAMA: Generate & Tampilkan Laporan ──
            function showPotretMasaDepan() {
                const p   = STATE.player;
                const name = (DataService.user && DataService.user.name) ? DataService.user.name : 'Siswa';
                const role = p.role || 'none';
                const theme = POTRET_THEME[role] || POTRET_THEME.none;

                // Header
                document.getElementById('potret-header').style.background = theme.bg;
                document.getElementById('potret-player-name').innerText = name.toUpperCase();
                const totalDays = STATE.day - 1;
                const year = Math.floor(totalDays / (30*4)) + 1;
                document.getElementById('potret-day-badge').innerText = `Hari ke-${totalDays} · Tahun ${year} · ${new Date().getFullYear()}`;

                // Identitas
                document.getElementById('pr-jalur').innerText = ROLE_LABEL[role] || role;
                document.getElementById('pr-days').innerText = `${totalDays} hari game`;
                document.getElementById('pr-level').innerText = `Level ${p.level || 1}`;
                document.getElementById('pr-aset').innerHTML = `<span style="color:#d97706">Rp ${(p.money||0).toLocaleString()} G</span>`;

                // Status spesial
                const statusParts = [];
                // Status pernikahan
                if (p.married) {
                    statusParts.push('💍 Sudah Menikah');
                } else if (p.divorced) {
                    const isDuda = (STATE.player.gender === 'boy');
                    statusParts.push(isDuda ? '💔 Duda' : '💔 Janda');
                } else {
                    statusParts.push('🙍 Single');
                }
                if ((p.houseLevel||1)>=3) statusParts.push(`🏠 Rumah Lv.${p.houseLevel}`);
                if (p.jobStatus === 'employed') statusParts.push('💼 Karyawan Aktif');
                if ((p.bossReputation||0) >= 80) statusParts.push('🏅 Pegawai Teladan');
                document.getElementById('pr-status').innerText = statusParts.length ? statusParts.join(' · ') : '—';
                document.getElementById('pr-row-status').style.display = statusParts.length ? 'flex' : 'none';

                const reflCount = (p.reflections || []).length;
                document.getElementById('pr-jurnal').innerText = `${reflCount} entri refleksi`;

                // Kompetensi grid
                const kompetensi = getKompetensi(p);
                const grid = document.getElementById('potret-comp-grid');
                grid.innerHTML = '';
                kompetensi.forEach(k => {
                    const b = toBintang(k.val, k.max);
                    const pct = Math.round(b.pct * 100);
                    const card = document.createElement('div');
                    card.className = 'potret-comp-card';
                    card.style.background = k.bg;
                    card.style.borderColor = k.color + '40';
                    card.innerHTML = `
                        <div class="potret-comp-name" style="color:${k.color}">${k.label} ${k.name}</div>
                        <div class="potret-bar-bg">
                            <div class="potret-bar-fill" style="width:${pct}%; background:${k.color}"></div>
                        </div>
                        <div class="potret-bar-val">${b.filled}${b.empty} ${pct}/100</div>
                    `;
                    grid.appendChild(card);
                });

                // Kuat & lemah
                const sortedComp = [...kompetensi].sort((a,b) => (b.val/b.max) - (a.val/a.max));
                const kuat   = sortedComp[0];
                const lemah  = sortedComp[sortedComp.length-1];
                const kuatPct  = Math.round((kuat.val/kuat.max)*100);
                const lemahPct = Math.round((lemah.val/lemah.max)*100);
                const bKuat  = toBintang(kuat.val, kuat.max);
                const bLemah = toBintang(lemah.val, lemah.max);

                document.getElementById('pr-kuat').innerHTML =
                    `${kuat.name} <span class="potret-stars">${bKuat.filled}</span> (${kuatPct}%)`;
                document.getElementById('pr-lemah').innerHTML =
                    `${lemah.name} <span style="color:#ef4444">${bLemah.filled}${bLemah.empty}</span> (${lemahPct}%)`;

                // Badges
                const badgeEl = document.getElementById('pr-badges');
                badgeEl.innerHTML = '';
                [
                    { cond: (p.reflections||[]).length >= 5,  label: '📝 Refleksi Aktif',    color:'#d97706', bg:'#fef3c7' },
                    { cond: (p.biz||0) >= 30,                 label: '💡 Jiwa Wirausaha',    color:'#059669', bg:'#d1fae5' },
                    { cond: (p.int||0) >= 30,                 label: '🧠 Intelek',            color:'#6d28d9', bg:'#ede9fe' },
                    { cond: (p.str||0) >= 30,                 label: '💪 Pekerja Keras',      color:'#dc2626', bg:'#fee2e2' },
                    { cond: (p.reputation||0) >= 50,          label: '🤝 Sosialita',          color:'#db2777', bg:'#fce7f3' },
                    { cond: p.married,                        label: '💍 Berkeluarga',         color:'#0369a1', bg:'#e0f2fe' },
                    { cond: (p.houseLevel||1) >= 3,           label: '🏠 Pemilik Properti',  color:'#78350f', bg:'#fef3c7' },
                    { cond: (p.bossReputation||0) >= 70,      label: '🏅 Teladan Kerja',      color:'#1d4ed8', bg:'#dbeafe' },
                ].filter(b => b.cond).forEach(b => {
                    const span = document.createElement('span');
                    span.className = 'potret-badge';
                    span.style.color = b.color;
                    span.style.background = b.bg;
                    span.innerText = b.label;
                    badgeEl.appendChild(span);
                });

                // Rekomendasi
                document.getElementById('potret-rekomendasi').style.borderLeftColor = theme.accent;
                document.getElementById('pr-rekom').innerHTML = buildRekomendasi(p, kompetensi);

                // Predikat & Seal
                const predikat = getPredikat(p);
                document.getElementById('pr-predikat').innerText = predikat.label;
                document.getElementById('pr-predikat').style.color = predikat.color;
                document.getElementById('pr-seal-circle').style.borderColor = theme.seal;
                document.getElementById('pr-seal-circle').style.color = theme.seal;
                document.getElementById('pr-seal-year').innerText = new Date().getFullYear();

                // Tampilkan modal
                document.getElementById('potret-modal').classList.add('active');
                STATE.screen = 'modal';
            }

            function closePotret() {
                document.getElementById('potret-modal').classList.remove('active');
                STATE.screen = 'play';
            }

            // Salin teks laporan ke clipboard
            function sharePotret() {
                const p    = STATE.player;
                const name = (DataService.user && DataService.user.name) ? DataService.user.name : 'Siswa';
                const role = ROLE_LABEL[p.role] || '?';
                const pred = getPredikat(p);
                const kompetensi = getKompetensi(p);
                const sorted = [...kompetensi].sort((a,b)=>(b.val/b.max)-(a.val/a.max));
                const kuat  = sorted[0];
                const lemah = sorted[sorted.length-1];
                const bKuat  = toBintang(kuat.val, kuat.max);
                const bLemah = toBintang(lemah.val, lemah.max);

                const teks =
`━━━━━━━━━━━━━━━━━━━━━━━
POTRET MASA DEPANKU: ${name.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━
Jalur yang dipilih : ${role}
Aset akhir         : Rp ${(p.money||0).toLocaleString()} G
Level              : ${p.level || 1}
Predikat           : ${pred.label}
━━━━━━━━━━━━━━━━━━━━━━━
Kompetensi kuat    : ${kuat.name} ${bKuat.filled} (${Math.round((kuat.val/kuat.max)*100)}%)
Perlu dikembangkan : ${lemah.name} ${bLemah.filled} (${Math.round((lemah.val/lemah.max)*100)}%)
Jurnal refleksi    : ${(p.reflections||[]).length} entri
━━━━━━━━━━━━━━━━━━━━━━━
🎓 Rekomendasi Mentor:
${document.getElementById('pr-rekom').innerText.substring(0,180)}...
━━━━━━━━━━━━━━━━━━━━━━━
[ Nusantara Arsa · ${new Date().getFullYear()} ]`;

                navigator.clipboard.writeText(teks)
                    .then(() => showToast('✅ Laporan tersalin ke clipboard!'))
                    .catch(() => showToast('❌ Salin gagal, coba cetak langsung.'));
            }

            function togglePhone() {
                const modal = document.getElementById('phone-modal');
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    STATE.screen = 'play';
                } else {
                    modal.style.display = 'flex';
                    STATE.screen = 'modal';
                    // Reset Notif
                    document.getElementById('phone-btn').classList.remove('phone-ringing');
                    // Update Jam
                    const h = Math.floor(STATE.time / 100).toString().padStart(2, '0');
                    const m = Math.floor((STATE.time % 100) * 0.6).toString().padStart(2, '0');
                    document.getElementById('phone-clock').innerText = `${h}:${m}`;

                    // FIX: Reset View Pastikan Home nyala, yang lain MATI semua
                    document.getElementById('phone-screen-home').style.display = 'block';
                    document.getElementById('phone-screen-sosmed').style.display = 'none';
                    document.getElementById('phone-screen-messages').style.display = 'none';
                    document.getElementById('phone-screen-bank').style.display = 'none';
                }
            }

            // --- FIX: FUNGSI TOMBOL HOME/BACK DI HP ---
            function closePhoneApp() {
                // Sembunyikan SEMUA aplikasi yang mungkin terbuka
                document.getElementById('phone-screen-sosmed').style.display = 'none';
                document.getElementById('phone-screen-messages').style.display = 'none';
                document.getElementById('phone-screen-bank').style.display = 'none';

                // Tampilkan kembali layar utama HP
                document.getElementById('phone-screen-home').style.display = 'block';
            }

            // --- QUICK PET SWITCH (dipanggil dari tap ikon pet di HUD) ---
            function openQuickPetSwitch() {
                const p = STATE.player;
                const myPets = p.pets || [];
                if (myPets.length === 0) {
                    showToast('Belum punya pet! Temui Satria (Ksatria) untuk beli pet.');
                    return;
                }
                if (myPets.length === 1) {
                    const pet = PET_CATALOG[myPets[0]];
                    showToast(`${pet ? pet.emoji + ' ' + pet.name : 'Pet'} adalah satu-satunya petmu!`);
                    return;
                }
                // Tampilkan menu ganti pet (tanpa NPC)
                showPetSwitchMenu(null);
            }

            // --- NEW: FUNGSI BUKA APLIKASI PESAN DI DALAM HP ---
            function openMessagesApp() {
                document.getElementById('phone-screen-home').style.display = 'none';
                document.getElementById('phone-screen-messages').style.display = 'block';

                const list = document.getElementById('phone-messages-list');
                const msgs = STATE.player.messages || [];

                list.innerHTML = '';

                if (msgs.length === 0) {
                    list.innerHTML = '<div style="text-align:center; color:#94a3b8; padding:20px; font-size:12px;">Kotak masuk kosong.</div>';
                } else {
                    // Tampilkan pesan terbaru di atas (Reverse)
                    [...msgs].reverse().forEach(m => {
                        // Format Waktu Simpel
                        let dateStr = "Baru saja";
                        if (m.time) {
                            const date = new Date(m.time);
                            // Format: HH:MM
                            dateStr = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                        }

                        const bubble = document.createElement('div');
                        // Style ala Bubble Chat
                        bubble.style.cssText = `
                background: #fff; 
                padding: 10px; 
                margin-bottom: 8px; 
                border-radius: 0 12px 12px 12px; 
                border-left: 4px solid #3b82f6; 
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                font-family: 'Exo 2', sans-serif;
            `;

                        bubble.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; align-items:center;">
                    <span style="font-weight:bold; color:#3b82f6; font-size:11px;">👩‍🏫 ${m.from || 'Guru Pembimbing'}</span>
                    <span style="font-size:9px; color:#94a3b8;">${dateStr}</span>
                </div>
                <div style="font-size:12px; color:#334155; line-height:1.4;">${m.text}</div>
            `;
                        list.appendChild(bubble);
                    });

                    // Tandai semua dibaca saat membuka aplikasi
                    STATE.player.messages.forEach(m => m.read = true);
                }
            }

            // --- FIX: FUNGSI BUKA PESAN DARI HP ---
            function openMessageArchiveFromPhone() {
                togglePhone(); // Tutup HP dulu karena Arsip Pesan adalah Overlay besar
                setTimeout(() => openMessageArchive(), 200); // Buka arsip pesan
            }

            function openSosmedApp() {
                document.getElementById('phone-screen-home').style.display = 'none';
                document.getElementById('phone-screen-sosmed').style.display = 'block';

                const feed = document.getElementById('viral-news-feed');
                feed.innerHTML = '';

                if (STATE.viral.active) {
                    const t = STATE.viral.active;
                    feed.innerHTML = `
            <div class="news-card">
                <span class="news-tag">🔥 VIRAL NOW</span>
                <div class="news-title">${t.newsTitle}</div>
                <div class="news-body">${t.newsBody}</div>
                <div style="margin-top:10px; font-size:10px; background:#e2e8f0; padding:5px; border-radius:4px;">
                    <strong>TIPS BISNIS:</strong><br>
                    Harga jual <b>${t.itemName}</b> naik 300% hari ini!<br>
                    (Beli di Pedagang, Jual di Merchant)
                </div>
            </div>
        `;
                } else {
                    feed.innerHTML = `<div style="text-align:center; padding:20px; color:#64748b;">Tidak ada tren viral hari ini.</div>`;
                }
            }


            // ==========================================
            // 3. LOGIKA INTERAKSI (YANG DIGABUNGKAN)
            // ==========================================

            // Fungsi Beli Barang Viral (Dipanggil dari interactNPC)
            function buyViralItem(itemId, price, qty) {
                const cost = price * qty;
                if (STATE.player.money >= cost) {
                    STATE.player.money -= cost;
                    if (!STATE.player.inventory[itemId]) STATE.player.inventory[itemId] = 0;
                    STATE.player.inventory[itemId] += qty;
                    showToast(`Membeli ${qty} item!`);
                    updateMoneyUI();
                    closeDialogue();
                } else {
                    showToast("Uang tidak cukup!");
                }
            }

            // Fungsi Jual Barang Viral (Dipanggil dari interactNPC)
            function sellViralItem(itemId, price, qty) {
                if (STATE.player.inventory[itemId] >= qty) {
                    STATE.player.inventory[itemId] -= qty;
                    const total = price * qty;
                    STATE.player.money += total;
                    if (STATE.player.inventory[itemId] <= 0) delete STATE.player.inventory[itemId];
                    // Track untuk bonus quest harian
                    STATE.player.dailySellCount = (STATE.player.dailySellCount || 0) + 1;

                    showToast(`CUAN BESAR! +${total} G`);
                    updateMoneyUI();
                    closeDialogue();
                }
            }

            function updateMoneyUI() {
                document.getElementById('money-display').innerText = STATE.player.money;
            }



            // --- NEW: FUNGSI APLIKASI BANKING ---
            function openBankApp() {
                document.getElementById('phone-screen-home').style.display = 'none';
                document.getElementById('phone-screen-bank').style.display = 'block';

                // 1. Update Saldo
                const balance = STATE.player.money || 0;
                document.getElementById('bank-balance-display').innerText = balance.toLocaleString('id-ID');

                // 2. Generate Dummy History (Mutasi)
                // Karena kita tidak menyimpan log transaksi detail, kita buat dummy berdasarkan aktivitas terakhir
                const historyList = document.getElementById('bank-history-list');
                historyList.innerHTML = '';

                // Buat data dummy yang terlihat realistis
                const transactions = [
                    { desc: "Bunga Tabungan", amount: Math.floor(balance * 0.001), type: "in", date: "Hari Ini" },
                    { desc: "Biaya Admin", amount: 500, type: "out", date: "Kemarin" },
                ];

                // Tambahkan histori kerja jika ada
                if (STATE.player.jobStatus === 'employed') {
                    transactions.unshift({ desc: "Gaji Harian", amount: 5000 + (STATE.player.jobLevel * 2000), type: "in", date: "Hari Ini" });
                }

                transactions.forEach(trx => {
                    const item = document.createElement('div');
                    item.className = 'trx-item';
                    item.innerHTML = `
            <div>
                <div class="trx-date">${trx.date}</div>
                <div class="trx-desc">${trx.desc}</div>
            </div>
            <div class="trx-amount ${trx.type === 'in' ? 'trx-in' : 'trx-out'}">
			${trx.type === 'in' ? '+' : '-'} Rp ${trx.amount.toLocaleString('id-ID')}
            </div>
        `;
                    historyList.appendChild(item);
                });
            }


            // ═══════════════════════════════════════════
            // 🧚 FAIRY VILLAGE MINIGAME
            // ═══════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// 🧚‍♀️ KAHYANGAN WILIS — WORLD MAP MINIGAME (BoF4 Style)
// ═══════════════════════════════════════════════════════════════

// ── DATA BANGUNAN ─────────────────────────────────────────────
// Setiap bangunan punya tier 1→2→3 (upgrade in-place)
// maxWorkers per tier: tier1=1, tier2=2, tier3=3
// upgradeTo = id bangunan tier berikutnya di slot yang sama
// upgradeCost = biaya khusus upgrade (lebih mahal dari bangun baru)
const FAIRY_BUILDINGS = {
    // ── BAWAAN ───────────────────────────────────────────────────
    pohon_energi:    { name:'🌳 Pohon Energi',         tier:0, emoji:'🌳', w:2,h:2, maxWorkers:2, dustPerDay:5,
                       desc:'Sumber energi alam Wilis. Sudah ada sejak awal.', produce:'5 Debu/hari', builtIn:true },

    // ── HUNIAN (melahirkan peri) ──────────────────────────────────
    pondok_peri:     { name:'🏚️ Padepokan Cilik',      tier:1, emoji:'🏚️', w:2,h:2, maxWorkers:1,
                       maxFairies:1, birthChance:0,
                       cost:{debu:20}, upgradeCost:{debu:50,kristal:1},
                       upgradeTo:'rumah_peri',
                       desc:'Tempat tinggal 1 Widadari.', produce:'Kapasitas +1 peri' },
    rumah_peri:      { name:'🏠 Omah Widadari',         tier:2, emoji:'🏠', w:2,h:2, maxWorkers:2,
                       maxFairies:2, birthChance:0.15,
                       cost:{debu:60,kristal:1}, upgradeCost:{debu:100,kristal:2},
                       upgradeTo:'dalem_widadari',
                       desc:'2 Widadari, bayi bisa lahir 15%/hari.', produce:'Kapasitas +2 peri, 15% lahir/hari' },
    dalem_widadari:  { name:'🏡 Dalem Widadari',        tier:3, emoji:'🏡', w:2,h:2, maxWorkers:3,
                       maxFairies:4, birthChance:0.35,
                       cost:{debu:150,kristal:3,cahaya:1},
                       desc:'4 Widadari, bayi lahir 35%/hari.', produce:'Kapasitas +4 peri, 35% lahir/hari' },

    // ── TAMAN (debu + makanan) ────────────────────────────────────
    taman_mini:      { name:'🌸 Taman Bunga',           tier:1, emoji:'🌸', w:2,h:2, maxWorkers:1,
                       dustPerDay:3, foodPerDay:2,
                       cost:{debu:15}, upgradeCost:{debu:45,kristal:1},
                       upgradeTo:'taman_mekar',
                       desc:'Menghasilkan Debu Peri & Makanan tiap hari.', produce:'3 Debu + 2 Makanan/hari' },
    taman_mekar:     { name:'🌺 Kebun Kenanga',          tier:2, emoji:'🌺', w:2,h:2, maxWorkers:2,
                       dustPerDay:8, foodPerDay:5,
                       cost:{debu:50,kristal:1}, upgradeCost:{debu:90,kristal:2},
                       upgradeTo:'kebun_raya',
                       desc:'+8 Debu & +5 Makanan/hari.', produce:'8 Debu + 5 Makanan/hari' },
    kebun_raya:      { name:'🌳 Kebun Raya Wilis',       tier:3, emoji:'🌳', w:2,h:2, maxWorkers:3,
                       dustPerDay:18, foodPerDay:10,
                       cost:{debu:130,kristal:3},
                       desc:'+18 Debu & +10 Makanan/hari.', produce:'18 Debu + 10 Makanan/hari' },

    // ── KOLAM (happiness + debu) ──────────────────────────────────
    kolam_kristal:   { name:'💧 Sendang Suci',           tier:1, emoji:'💧', w:2,h:2, maxWorkers:1,
                       happinessBonus:10,
                       cost:{debu:25}, upgradeCost:{debu:60,kristal:1},
                       upgradeTo:'kolam_agung',
                       desc:'Memancarkan berkah kebahagiaan.', produce:'Happiness +10/hari' },
    kolam_agung:     { name:'🌊 Sendang Agung',          tier:2, emoji:'🌊', w:2,h:2, maxWorkers:2,
                       happinessBonus:25, dustPerDay:5,
                       cost:{debu:80,kristal:2}, upgradeCost:{debu:130,kristal:3},
                       upgradeTo:'telaga_nirmala',
                       desc:'+25 Happiness & +5 Debu/hari.', produce:'Happiness +25 + 5 Debu/hari' },
    telaga_nirmala:  { name:'🌈 Telaga Nirmala',         tier:3, emoji:'🌈', w:2,h:2, maxWorkers:3,
                       happinessBonus:50, dustPerDay:12,
                       cost:{debu:180,kristal:4,cahaya:1},
                       desc:'+50 Happiness & +12 Debu/hari.', produce:'Happiness +50 + 12 Debu/hari' },

    // ── SEKOLAH (XP bonus) ────────────────────────────────────────
    sekolah_peri:    { name:'📚 Padepokan Ilmu',         tier:1, emoji:'📚', w:2,h:2, maxWorkers:1,
                       xpBonus:1.5,
                       cost:{debu:40}, upgradeCost:{debu:80,kristal:1},
                       upgradeTo:'sanggar_tari',
                       desc:'XP peri ×1.5.', produce:'XP peri ×1.5' },
    sanggar_tari:    { name:'🎓 Sanggar Tari',            tier:2, emoji:'🎓', w:2,h:2, maxWorkers:2,
                       xpBonus:2.0,
                       cost:{debu:90,kristal:2}, upgradeCost:{debu:150,kristal:3},
                       upgradeTo:'akademi_agung',
                       desc:'XP peri ×2.0.', produce:'XP peri ×2.0' },
    akademi_agung:   { name:'🏛️ Akademi Agung',          tier:3, emoji:'🏛️', w:2,h:2, maxWorkers:3,
                       xpBonus:3.0, intelBonus:3,
                       cost:{debu:180,kristal:4,cahaya:1},
                       desc:'XP peri ×3.0 & Intel +3/hari.', produce:'XP peri ×3.0 + Intel bonus' },

    // ── PASAR (trading) ───────────────────────────────────────────
    pasar_peri:      { name:'🛒 Pasar Kahyangan',        tier:1, emoji:'🛒', w:2,h:2, maxWorkers:1,
                       enableTrading:true, tradeBonus:1.0,
                       cost:{debu:60}, upgradeCost:{debu:100,kristal:2},
                       upgradeTo:'balai_dagang',
                       desc:'Tukar Debu↔Gold.', produce:'Aktifkan perdagangan' },
    balai_dagang:    { name:'🏪 Balai Dagang',            tier:2, emoji:'🏪', w:2,h:2, maxWorkers:2,
                       enableTrading:true, tradeBonus:1.3,
                       cost:{debu:120,kristal:2}, upgradeCost:{debu:180,kristal:4},
                       upgradeTo:'pusat_niaga',
                       desc:'Tukar Debu↔Gold dengan rate lebih baik.', produce:'Trading rate +30%' },
    pusat_niaga:     { name:'🏦 Pusat Niaga Wilis',       tier:3, emoji:'🏦', w:2,h:2, maxWorkers:3,
                       enableTrading:true, tradeBonus:1.6, kristalFromTrade:1,
                       cost:{debu:220,kristal:5,cahaya:1},
                       desc:'Rate terbaik + dapat Kristal dari trading.', produce:'Trading rate +60% + Kristal' },

    // ── MENARA (multiplier debu) ──────────────────────────────────
    menara_kecil:    { name:'🕯️ Menara Kecil',            tier:1, emoji:'🕯️', w:1,h:3, maxWorkers:1,
                       dustMultiplier:1.2,
                       cost:{debu:60,kristal:1}, upgradeCost:{debu:120,kristal:2},
                       upgradeTo:'menara_wilis',
                       desc:'Semua Debu Peri ×1.2.', produce:'Debu semua bangunan ×1.2' },
    menara_wilis:    { name:'✨ Menara Wilis',             tier:2, emoji:'✨', w:1,h:3, maxWorkers:2,
                       dustMultiplier:1.5,
                       cost:{debu:140,kristal:3}, upgradeCost:{debu:220,kristal:4,cahaya:1},
                       upgradeTo:'menara_cahaya',
                       desc:'Semua Debu Peri ×1.5.', produce:'Debu semua bangunan ×1.5' },
    menara_cahaya:   { name:'🌟 Menara Cahaya',            tier:3, emoji:'🌟', w:1,h:3, maxWorkers:3,
                       dustMultiplier:2.0, cahayaPerWeek:1,
                       cost:{debu:260,kristal:5,cahaya:2},
                       desc:'Debu ×2.0 & +1 Cahaya/minggu.', produce:'Debu ×2.0 + 1 Cahaya/minggu' },

    // ── ISTANA (legacy tier 4, tidak dibangun baru — hanya bisa dari upgrade dalem) ──
    // Dipertahankan untuk save lama
    istana_mini:     { name:'🏰 Puri Agung Wilis',        tier:4, emoji:'🏰', w:3,h:3, maxWorkers:3,
                       maxFairies:8, birthChance:0.50,
                       cost:{debu:400,kristal:8,cahaya:4},
                       desc:'8 Widadari, lahir 50%/hari.', produce:'Kapasitas +8 peri, 50% lahir/hari', legacy:true },
    pohon_kehidupan: { name:'🌳✨ Pohon Beringin Agung',   tier:4, emoji:'🌳', w:3,h:3, maxWorkers:3,
                       dustPerDay:30, cahayaPerWeek:1,
                       cost:{debu:500,kristal:10,cahaya:5},
                       desc:'+30 Debu/hari, +1 Cahaya/minggu.', produce:'30 Debu/hari + 1 Cahaya/minggu', legacy:true },
};

const FAIRY_NAMES_BOY  = ['Juna','Bagus','Rekso','Lanang','Bimo','Satrio','Wibowo','Agung','Prasetyo','Handoko','Cahyo'];
const FAIRY_NAMES_GIRL = ['Ayu','Wulan','Sekar','Endah','Ratih','Dewi','Larasati','Kinanti','Mawar','Niken'];


// ── LAYOUT SLOT BANGUNAN DI PETA 120×75 (setengah dari sebelumnya) ──
const FW = 60, FH = 40;    // peta lebih kecil — lebih padat & intim
const TS = 40;              // tile diperbesar agar bangunan terlihat jelas seperti peta utama
const FV_SPEED = 2.4;
// Skala visual bangunan: gambar di-render lebih besar dari hitbox tile (Stardew-style)
// Hitbox tetap w*TS × h*TS, tapi gambar di-render FV_BLDG_VISUAL_SCALE × lebih besar
const FV_BLDG_VISUAL_SCALE = 1.8;

// 12 slot bangunan tersebar di peta 60×40
const FAIRY_SLOTS = [
    // Baris atas (y~5) — disesuaikan ke map 45x30
    {id:'s1', x:3,  y:5 }, {id:'s2', x:12, y:5 }, {id:'s3', x:21, y:5 },
    {id:'s4', x:30, y:5 }, {id:'s5', x:39, y:5 },
    // Baris tengah (y~14)
    {id:'s6', x:3,  y:14}, {id:'s7', x:12, y:14}, {id:'s8', x:21, y:14},
    {id:'s9', x:30, y:14}, {id:'s10',x:39, y:14},
    // Baris bawah (y~22)
    {id:'s11',x:8,  y:22}, {id:'s12',x:32, y:22},
];

// Posisi NPC & objek penting — proporsional
const FV_RARA_POS  = { x:28, y:17 };   // Rara Wilis — tengah peta
const FV_POHON_POS = { x:21, y:24 };   // Pohon Energi — tengah-bawah
const FV_ISTANA_POS = { x:25, y:8  };  // Istana Peri — tengah-atas peta, tidak terpotong
// Pohon dekoratif pinggir peta
const FV_DECO_TREES = [
    {x:2,y:1},{x:8,y:1},{x:15,y:1},{x:30,y:1},{x:38,y:1},{x:43,y:1},
    {x:1,y:8},{x:43,y:8},{x:1,y:17},{x:43,y:17},{x:1,y:24},{x:43,y:24},
    {x:8,y:27},{x:21,y:28},{x:35,y:27},
];

// ── STATE RUNTIME ──────────────────────────────────────────────
let FVG = null;
let fvCanvas, fvCtx;
let fvCam = { x:0, y:0 };
let fvPlayer = { x:43*TS, y:10*TS, facing:'down' };
let fvKeys = {};
let fvActiveDialog = null;
let fvJoy = { active:false, startX:0, startY:0, dx:0, dy:0 };
let fvLastTime = 0;
let fvParticles = [];
let fvSpriteCache = {}; // Cache sprite image untuk peri wandering
let fvNpcRuntime = {}; // Runtime posisi NPC wandering di fairy village
let fvBuildingImageCache = {}; // Cache offscreen canvas gambar bangunan

// ── KAHYANGAN: Background Image ────────────────────────────────
let fvBgImage = null;
(function(){
    fvBgImage = new Image();
    fvBgImage.src = 'images/kayangan.png';
})();

// ── POHON ENERGI IMAGE ──
let fvPohonImg = null;
(function(){
    fvPohonImg = new Image();
    fvPohonImg.src = 'images/pohonperi.png';
})();

// ── HUNIAN TIER IMAGES: omah-tier1.png, omah-tier2.png, omah-tier3.png ──
const FV_OMAH_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/omah-tier' + t + '.png';
        FV_OMAH_IMAGES[t] = img;
    });
})();

// ── SENDANG TIER IMAGES: sendang-tier1.png, sendang-tier2.png, sendang-tier3.png ──
const FV_SENDANG_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/sendang-tier' + t + '.png';
        FV_SENDANG_IMAGES[t] = img;
    });
})();

// ── TAMAN TIER IMAGES: taman-tier1.png, taman-tier2.png, taman-tier3.png ──
const FV_TAMAN_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/taman-tier' + t + '.png';
        FV_TAMAN_IMAGES[t] = img;
    });
})();

// ── SEKOLAH TIER IMAGES: sekolah-tier1.png, sekolah-tier2.png, sekolah-tier3.png ──
const FV_SEKOLAH_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/sekolah-tier' + t + '.png';
        FV_SEKOLAH_IMAGES[t] = img;
    });
})();

// ── PASAR TIER IMAGES: pasar-tier1.png, pasar-tier2.png, pasar-tier3.png ──
const FV_PASAR_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/pasar-tier' + t + '.png';
        FV_PASAR_IMAGES[t] = img;
    });
})();

// ── MENARA TIER IMAGES: menara-tier1.png, menara-tier2.png, menara-tier3.png ──
const FV_MENARA_IMAGES = {};
(function(){
    [1,2,3].forEach(function(t){
        const img = new Image();
        img.src = 'images/menara-tier' + t + '.png';
        FV_MENARA_IMAGES[t] = img;
    });
})();

// ── ISTANA IMAGE: istanaperi.png ──
const FV_ISTANA_IMAGES = {};
(function(){
    const img = new Image();
    img.onerror = function() { console.warn('istanaperi.png gagal load — cek path images/istanaperi.png'); };
    img.src = 'images/istanaperi.png';
    FV_ISTANA_IMAGES[1] = img;
})();

// ── KAHYANGAN: Siang/Malam & Musim ─────────────────────────────
function getFVTimeOfDay() {
    // Sinkron dengan STATE.time dunia manusia (0–2400)
    const t = (typeof STATE !== 'undefined' && STATE.time !== undefined) ? STATE.time : -1;
    if (t >= 0) {
        if (t >= 500  && t < 1200) return 'pagi';
        if (t >= 1200 && t < 1500) return 'siang';
        if (t >= 1500 && t < 1800) return 'sore';
        if (t >= 1800 && t < 2000) return 'senja';
        return 'malam';
    }
    // fallback jam nyata jika STATE belum siap
    const h = new Date().getHours();
    if (h >= 5 && h < 12)  return 'pagi';
    if (h >= 12 && h < 15) return 'siang';
    if (h >= 15 && h < 18) return 'sore';
    if (h >= 18 && h < 20) return 'senja';
    return 'malam';
}
function isFVNight() {
    return getFVTimeOfDay() === 'malam';
}
function getFVSeason() {
    // Sinkron dengan STATE.season dunia manusia
    const s = (typeof STATE !== 'undefined') ? (STATE.season || 'spring') : 'spring';
    if (s === 'spring') return { id:'semi',    label:'Musim Semi 🌸',   color:'#f9a8d4' };
    if (s === 'summer') return { id:'panas',   label:'Musim Panas ☀️',  color:'#fde68a' };
    if (s === 'autumn') return { id:'gugur',   label:'Musim Gugur 🍂',  color:'#fb923c' };
    return                     { id:'dingin',  label:'Musim Dingin ❄️', color:'#bae6fd' };
}

// ── KAHYANGAN: Partikel Musim — sinkron STATE.season ──────────
let _fvSeasonParts = [];
function _initFVSeasonParts(W, H, count) {
    if (_fvSeasonParts.length >= count) return;
    while (_fvSeasonParts.length < count) {
        _fvSeasonParts.push({
            x: Math.random() * W,
            y: Math.random() * H - H,
            vx: (Math.random() - 0.5) * 0.6,
            vy: 0.4 + Math.random() * 0.8,
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.04,
            size: 3 + Math.random() * 5,
            alpha: 0.5 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
        });
    }
}
function drawFVSeasonParticles(ctx, W, H, t, season) {
    const sid = season ? season.id : 'semi';
    // Reset partikel jika musim berubah
    if (drawFVSeasonParticles._lastSeason !== sid) {
        _fvSeasonParts = [];
        drawFVSeasonParticles._lastSeason = sid;
    }

    const COUNT = 28;
    _initFVSeasonParts(W, H, COUNT);

    ctx.save();
    ctx.translate(-Math.floor(fvCam.x), -Math.floor(fvCam.y));

    _fvSeasonParts.forEach(p => {
        // Update posisi
        p.x  += p.vx + Math.sin(t/1800 + p.phase) * 0.4;
        p.y  += p.vy;
        p.rot += p.rotV;
        if (p.y > FH*TS + 20) { p.y = -10; p.x = Math.random() * FW*TS; }
        if (p.x < 0) p.x = FW*TS;
        if (p.x > FW*TS) p.x = 0;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha * 0.75;

        if (sid === 'semi') {
            // Kelopak sakura — pink lembut
            ctx.fillStyle = '#f9a8d4';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size*0.55, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#fce7f3';
            ctx.beginPath();
            ctx.ellipse(0, -p.size*0.2, p.size*0.5, p.size*0.3, 0, 0, Math.PI*2);
            ctx.fill();
        } else if (sid === 'panas') {
            // Serbuk cahaya / pollen — kuning berkilau
            const pulse = 0.5 + 0.5*Math.sin(t/400 + p.phase);
            ctx.globalAlpha = p.alpha * 0.6 * pulse;
            const grd = ctx.createRadialGradient(0,0,0, 0,0,p.size);
            grd.addColorStop(0, '#fef08a');
            grd.addColorStop(1, 'rgba(253,224,71,0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI*2);
            ctx.fill();
        } else if (sid === 'gugur') {
            // Daun gugur — oranye/merah/coklat
            const leafColors = ['#fb923c','#ef4444','#a16207','#dc2626','#f97316'];
            ctx.fillStyle = leafColors[Math.floor(p.phase*3) % leafColors.length];
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size*0.7, p.size, p.rot*0.5, 0, Math.PI*2);
            ctx.fill();
            // Tulang daun
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size);
            ctx.stroke();
        } else if (sid === 'dingin') {
            // Butir salju — biru-putih lembut
            ctx.fillStyle = '#e0f2fe';
            ctx.strokeStyle = '#bae6fd';
            ctx.lineWidth = 0.5;
            // Kristal salju sederhana
            for (let a=0; a<6; a++) {
                ctx.save();
                ctx.rotate(a * Math.PI/3);
                ctx.beginPath();
                ctx.moveTo(0,0); ctx.lineTo(0, -p.size*1.1);
                ctx.stroke();
                ctx.restore();
            }
            ctx.beginPath();
            ctx.arc(0, 0, p.size*0.3, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    });
    ctx.restore();
}

// ── KAHYANGAN: Kunang-kunang (Fireflies) ────────────────────────
let fvFireflies = [];
function initFVFireflies(W, H) {
    if (fvFireflies.length > 0) return;
    for (let i = 0; i < 35; i++) {
        fvFireflies.push({
            x: Math.random() * (FW * TS),
            y: Math.random() * (FH * TS),
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.6,
        });
    }
}
function updateFVFireflies() {
    fvFireflies.forEach(f => {
        f.x += f.vx + Math.sin(performance.now()/2000 + f.phase) * 0.3;
        f.y += f.vy + Math.cos(performance.now()/1800 + f.phase) * 0.25;
        if (f.x < 0) f.x = FW * TS;
        if (f.x > FW * TS) f.x = 0;
        if (f.y < 0) f.y = FH * TS;
        if (f.y > FH * TS) f.y = 0;
    });
}
function drawFVFireflies(ctx, t) {
    fvFireflies.forEach((f, i) => {
        const pulse = 0.4 + 0.6 * Math.sin(t / 600 + f.phase);
        const r = 2 + pulse * 1.5;
        ctx.save();
        ctx.globalAlpha = pulse * 0.85;
        // Glow
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r * 3);
        grd.addColorStop(0, 'rgba(200,255,120,0.9)');
        grd.addColorStop(1, 'rgba(200,255,120,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
        // Titik inti
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#d9f99d';
        ctx.beginPath();
        ctx.arc(f.x, f.y, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// ── HELPER DATA ────────────────────────────────────────────────
function getFairyVillage() {
    if (!STATE.player.fairyVillage) {
        STATE.player.fairyVillage = {
            resources:    { debu:50, kristal:5, cahaya:1, makanan:30 }, // starter
            buildings:    [],
            buildQueue:   [],
            fairies:      [],
            lastTickDay:  STATE.day,
            lastCollectDay: -1,
            tutorialDone: false,
            fvTutorialDone: false, // FIX: flag yang dicek openFairyVillage
            isFirstVisit: true,    // FIX: flag kunjungan pertama untuk resource reset
        };
    }
    const fv = STATE.player.fairyVillage;
    if (!fv.buildQueue) fv.buildQueue = [];
    if (fv.resources.makanan === undefined) fv.resources.makanan = 20;
    // Migrate: pastikan fvTutorialDone ada (save lama hanya punya tutorialDone)
    if (fv.fvTutorialDone === undefined) fv.fvTutorialDone = false;
    // Migrate: isFirstVisit untuk save lama — anggap sudah pernah kunjung jika ada bangunan
    if (fv.isFirstVisit === undefined) {
        fv.isFirstVisit = !(fv.buildings && fv.buildings.length > 0);
    }
    // Migrate save lama yang masih kosong semua → kasih starter resource
    const r = fv.resources;
    if (!r.debu && !r.kristal && !r.cahaya && !(fv.buildings||[]).length && !(fv.buildQueue||[]).length) {
        fv.resources = { debu:50, kristal:5, cahaya:1, makanan:30 };
    }
    // Migrate peri stats
    (fv.fairies||[]).forEach(f => {
        if (f.intel   === undefined) f.intel   = _fairyStat();
        if (f.agility === undefined) f.agility = _fairyStat();
        if (f.spirit  === undefined) f.spirit  = _fairyStat();
        if (f.hp      === undefined) f.hp      = 80 + Math.floor(Math.random()*20);
        if (f.maxHp   === undefined) f.maxHp   = f.hp;
        if (f.mood    === undefined) f.mood    = 'happy';
    });
    // Migrate buildings — tambah workers []
    (fv.buildings||[]).forEach(b => { if (!b.workers) b.workers = []; });
    return fv;
}
function _fairyStat() { return 10 + Math.floor(Math.random()*20); }

// ── POPUP KELAHIRAN PERI ──────────────────────────────────────────
function showFairyBirthPopup(fairy, buildingName) {
    // Hapus popup sebelumnya jika ada
    const old = document.getElementById('fairy-birth-popup');
    if (old) old.remove();

    const img = fairy.gender === 'girl'
        ? `images/peri_pr${(fairy.spriteIdx||0) % 4 + 1}.png`
        : `images/peri_lk${(fairy.spriteIdx||0) % 2 + 1}.png`;

    const statBar = (val, color) => {
        const pct = Math.round(val/30*100);
        return `<div style="flex:1;height:7px;background:rgba(161,98,7,.15);border-radius:99px;overflow:hidden;border:1px solid rgba(161,98,7,.2)">
            <div style="width:${pct}%;height:100%;background:${color};border-radius:99px;transition:width .4s"></div>
        </div>`;
    };

    const rarity = fairy.intel+fairy.agility+fairy.spirit;
    const rarityLabel = rarity >= 70 ? '⭐ LANGKA!'
                      : rarity >= 50 ? '✨ Bagus'
                      : '🌱 Biasa';
    const rarityColor = rarity >= 70 ? '#d97706' : rarity >= 50 ? '#059669' : '#6b7280';

    const genderLabel = fairy.gender==='girl' ? '🧚‍♀️ Widadari' : '🧚‍♂️ Peri Laki';
    const bname = buildingName.replace(/^[^\s]+\s/,'');

    const el = document.createElement('div');
    el.id = 'fairy-birth-popup';
    el.innerHTML = `
        <div id="fbp-overlay"></div>
        <div id="fbp-scroll-wrap">
            <div id="fbp-card">
                <div id="fbp-sparkle">🌟 ✨ 🌟</div>
                <div id="fbp-title">🥚 Peri Baru Lahir!</div>
                <div id="fbp-sub">dari ${genderLabel} di ${bname}</div>

                <img id="fbp-img"
                    src="${img}"
                    onerror="this.src='images/${fairy.gender==='girl'?'wening':'juna'}.png'"
                    alt="peri baru">

                <div style="display:flex;align-items:center;gap:8px;width:100%">
                    <span style="font-size:11px;font-weight:800;color:${rarityColor};background:${rarityColor}18;border:1.5px solid ${rarityColor}55;border-radius:20px;padding:2px 10px">${rarityLabel}</span>
                    <span style="font-size:11px;color:#a16207;font-weight:600">Total Stat: ${rarity}/90</span>
                </div>

                <div id="fbp-stats">
                    <div class="fbp-stat">
                        <span>🧠 Intel</span>
                        ${statBar(fairy.intel,'#60a5fa')}
                        <span class="fbp-val">${fairy.intel}</span>
                    </div>
                    <div class="fbp-stat">
                        <span>⚡ Gesit</span>
                        ${statBar(fairy.agility,'#fbbf24')}
                        <span class="fbp-val">${fairy.agility}</span>
                    </div>
                    <div class="fbp-stat">
                        <span>🌟 Semangat</span>
                        ${statBar(fairy.spirit,'#f472b6')}
                        <span class="fbp-val">${fairy.spirit}</span>
                    </div>
                </div>

                <div style="width:100%">
                    <div id="fbp-name-label">✏️ Beri Nama:</div>
                    <div id="fbp-name-row">
                        <input id="fbp-name-input" type="text" value="${fairy.name}" maxlength="20" placeholder="Nama peri...">
                    </div>
                    <div style="font-size:10px;color:#a16207;text-align:center;margin-top:3px">Nama bisa diubah lagi nanti dari menu Para Peri</div>
                </div>

                <div id="fbp-btns">
                    <button id="fbp-btn-ok" onclick="confirmFairyBirth('${fairy.id}')">💖 Sambut ke Kahyangan!</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(el);

    // Animasi masuk
    requestAnimationFrame(() => {
        el.querySelector('#fbp-card').classList.add('fbp-in');
        // Partikel kelahiran di peta
        if (typeof createFVParticles === 'function' && typeof fvPlayer !== 'undefined') {
            createFVParticles(fvPlayer.x - (fvCam?.x||0), fvPlayer.y - (fvCam?.y||0), 20);
        }
    });
}

function confirmFairyBirth(fairyId) {
    const fv = getFairyVillage();
    const fairy = fv.fairies.find(f => f.id === fairyId);
    if (fairy) {
        const inp = document.getElementById('fbp-name-input');
        if (inp && inp.value.trim()) {
            fairy.name = inp.value.trim().slice(0,20);
        }
    }
    closeFairyBirthPopup();
    showToast(`🧚 ${fairy ? fairy.name : 'Peri'} telah disambut ke Kahyangan Wilis!`);
    if (typeof _khRenderPeri === 'function') _khRenderPeri(_khIdx || 0);
}

function closeFairyBirthPopup() {
    const el = document.getElementById('fairy-birth-popup');
    if (el) {
        el.querySelector('#fbp-card').classList.remove('fbp-in');
        setTimeout(() => el.remove(), 250);
    }
}

// ═══════════════════════════════════════════════════════════════
// FAIRY VILLAGE TUTORIAL — Tampil sekali saat pertama masuk
// ═══════════════════════════════════════════════════════════════
const FV_TUTORIAL_STEPS = [
    {
        icon: '✨',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Selamat Datang di Kahyangan Wilis!',
        text: `Aku <b>Rara Wilis</b>, ratu Widadari penjaga tanah Wilis.\n\nDahulu, tempat ini dipenuhi ribuan Widadari yang menjaga keseimbangan alam. Kini hanya tersisa <b>puing-puing</b> dan sebuah Pohon Energi yang hampir padam.\n\n<b>Tugas kamu:</b> Membangun kembali Kahyangan Wilis menjadi desa peri yang makmur! 🌿`,
        highlight: null,
    },
    {
        icon: '🏠',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Apa Itu Kahyangan Wilis?',
        text: `Kahyangan Wilis adalah <b>dunia peri</b> milikmu yang bisa kamu kembangkan.\n\nDi sini kamu bisa:\n• 🏗️ <b>Membangun</b> berbagai bangunan peri\n• 🧚 <b>Merawat</b> para Widadari\n• ✨ <b>Mengumpulkan</b> Serbuk Wilis setiap hari\n• 🥚 <b>Mendapat</b> peri baru yang lahir dari hunian\n\nSemakin berkembang desamu, semakin kuat pengaruhmu di Nusantara Arsa!`,
        highlight: null,
        statsBlock: [
            { icon:'✨', color:'#fde68a', name:'Serbuk Wilis', desc:'Mata uang utama. Kumpulkan dari Pohon Energi & bangunan.' },
            { icon:'💎', color:'#60a5fa', name:'Kristal Brantas', desc:'Langka. Untuk bangunan tier tinggi.' },
            { icon:'🌟', color:'#e879f9', name:'Cahaya Wilis', desc:'Energi spiritual. Dihasilkan dari meditasi peri.' },
            { icon:'🍽️', color:'#4ade80', name:'Makanan', desc:'Peri lapar = sedih. Pastikan stok cukup!' },
        ],
    },
    {
        icon: '🧠',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Stat Para Widadari',
        text: `Setiap Widadari punya <b>3 stat utama</b> yang menentukan kemampuannya:\n\n<span class="tut-tag" style="color:#60a5fa;border-color:#60a5fa">🧠 Intelijen</span> Menentukan kecepatan konstruksi bangunan. Intel tinggi = bangun lebih cepat!\n\n<span class="tut-tag" style="color:#fbbf24;border-color:#fbbf24">⚡ Ketangkasan</span> Luas jelajah di dunia Wilis. Gesit = bisa eksplorasi lebih jauh.\n\n<span class="tut-tag" style="color:#e879f9;border-color:#e879f9">🌟 Semangat</span> Produksi Serbuk Wilis. Semangat tinggi = serbuk ×2!`,
        highlight: null,
    },
    {
        icon: '🏗️',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Cara Membangun',
        text: `Untuk membangun, <b>dekati aku</b> lalu tekan tombol 💬 yang muncul.\n\nPilih <b>"Perintah Bangun"</b> untuk membuka katalog bangunan.\n\nSetiap bangunan butuh <b>waktu & sumber daya</b>:\n• Tier 1 (🟢) → paling mudah, butuh Serbuk Wilis\n• Tier 2 (🔵) → lebih kuat, butuh Kristal\n• Tier 3+ (🟣🟠🟡) → legendaris, syarat kompleks\n\nKamu bisa <b>upgrade</b> bangunan yang sudah ada untuk bonus lebih besar!`,
        highlight: null,
    },
    {
        icon: '🌳',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Pohon Energi — Sumber Kehidupan',
        text: `Di <b>selatan peta</b> ada Pohon Energi yang bercahaya hijau 🌳\n\nSekali per hari, kamu bisa mengumpulkan <b>Serbuk Wilis</b> dari pohon ini.\n\n💡 <b>Bonus serbuk</b> tergantung:\n• Jumlah Widadari yang tinggal\n• Banyaknya bangunan yang aktif\n\nJangan lupa kumpulkan setiap hari! Serbuk adalah kunci semua pembangunan.`,
        highlight: null,
    },
    {
        icon: '🥚',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Kelahiran Peri Baru!',
        text: `Bangunan <b>hunian</b> seperti Padepokan Cilik memiliki kemungkinan <b>melahirkan peri baru</b> setiap hari.\n\n🎉 Saat peri lahir:\n• Kamu akan melihat <b>popup kelahiran</b> dengan sprite unik\n• Setiap peri punya <b>stat acak</b> — bisa lemah, bisa kuat!\n• Kamu bisa <b>memberi nama</b> sebelum menyambutnya\n\n♀️ Peri perempuan: 4 tampilan berbeda\n♂️ Peri laki: 2 tampilan berbeda\n\nPeri yang lahir bisa <b>diganti namanya kapan saja</b> dari menu Para Peri.`,
        highlight: null,
    },
    {
        icon: '🧚',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Merawat Para Widadari',
        text: `Buka menu <b>Para Peri</b> untuk melihat semua Widadari-mu.\n\nDari sana kamu bisa:\n• 🍽️ <b>Beri Makan</b> agar peri tetap bahagia\n• ✏️ <b>Ganti Nama</b> peri yang lahir\n• 📊 Lihat detail <b>stat & mood</b> setiap peri\n• 👷 <b>Tugaskan</b> peri ke bangunan sebagai pekerja\n\n⚠️ Jika stok <b>makanan habis</b>, peri mulai lapar → sedih → malas bekerja.\nBeli makanan dengan Serbuk Wilis di menu yang sama!`,
        highlight: null,
    },
    {
        icon: '🗺️',
        speaker: 'RARA WILIS',
        avatar: 'images/rarawilis.png',
        title: 'Siap Membangun Kahyangan!',
        text: `Kamu sudah siap memulai petualangan di Kahyangan Wilis! 🌟\n\n<b>Langkah pertama:</b>\n1. 🌳 Jalan ke <b>Pohon Energi</b> di selatan peta\n2. ✨ Kumpulkan <b>Serbuk Wilis</b> pertamamu\n3. 🤝 Kembali ke <b>aku (Rara Wilis)</b> di utara\n4. 🏗️ Pilih <b>"Perintah Bangun"</b> dan dirikan bangunan pertama!\n\nMinimap di pojok kanan atas membantumu navigasi 🗺️\n\n<b>Selamat membangun, Penjaga Wilis!</b> ✨`,
        highlight: null,
        isLast: true,
    },
];

let _fvTutStep = 0;

function startFairyVillageTutorial() {
    _fvTutStep = 0;
    const el = document.getElementById('fv-tutorial');
    if (el) el.classList.add('active');
    _fvTutRender();
}

function fvTutSkip() {
    _fvTutClose();
    getFairyVillage().fvTutorialDone = true;
    showToast('📖 Tutorial dilewati. Bicara ke Rara Wilis jika butuh panduan!');
}

function fvTutGo(dir) {
    const total = FV_TUTORIAL_STEPS.length;
    _fvTutClearHL();
    _fvTutStep = Math.max(0, Math.min(total - 1, _fvTutStep + dir));
    if (dir > 0 && _fvTutStep === total - 1 && FV_TUTORIAL_STEPS[_fvTutStep].isLast) {
        // On last step, next button becomes "Mulai!"
    }
    if (dir > 0 && _fvTutStep >= total) {
        _fvTutFinish(); return;
    }
    _fvTutRender();
}

function _fvTutRender() {
    const total = FV_TUTORIAL_STEPS.length;
    const step  = FV_TUTORIAL_STEPS[_fvTutStep];
    if (!step) return;

    // Avatar
    const av = document.getElementById('fv-tut-avatar');
    if (av) { av.src = step.avatar || 'images/rarawilis.png'; av.style.display = step.avatar ? '' : 'none'; }

    // Speaker & badge
    const sp = document.getElementById('fv-tut-speaker');
    if (sp) sp.textContent = step.speaker || 'RARA WILIS';
    const bd = document.getElementById('fv-tut-step-badge');
    if (bd) bd.textContent = `Panduan ${_fvTutStep + 1} / ${total}`;

    // Icon
    const ic = document.getElementById('fv-tut-icon');
    if (ic) ic.textContent = step.icon || '✨';

    // Title
    const ti = document.getElementById('fv-tut-title');
    if (ti) ti.textContent = step.title;

    // Text (HTML with <b> and .tut-tag)
    const tx = document.getElementById('fv-tut-text');
    if (tx) {
        let html = (step.text || '').replace(/\n/g, '<br>');
        // Resource/stat block
        if (step.statsBlock) {
            html += '<div class="fv-tut-stats">';
            step.statsBlock.forEach(s => {
                html += `<div class="fv-tut-stat-card">
                    <div class="fv-sc-label">${s.icon}</div>
                    <div class="fv-sc-name" style="color:${s.color}">${s.name}</div>
                    <div class="fv-sc-desc">${s.desc}</div>
                </div>`;
            });
            html += '</div>';
        }
        tx.innerHTML = html;
    }

    // Dots
    const dots = document.getElementById('fv-tut-dots');
    if (dots) {
        dots.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const d = document.createElement('div');
            d.className = 'fv-tut-dot' + (i === _fvTutStep ? ' on' : '');
            dots.appendChild(d);
        }
    }

    // Buttons
    const prev = document.getElementById('fv-tut-prev');
    const next = document.getElementById('fv-tut-next');
    if (prev) prev.disabled = (_fvTutStep === 0);
    if (next) {
        const isLast = _fvTutStep === total - 1;
        next.textContent = isLast ? '🌟 Mulai!' : 'Lanjut ▶';
        next.onclick = isLast ? _fvTutFinish : () => fvTutGo(1);
    }

    // Highlight
    _fvTutClearHL();
    if (step.highlight) {
        setTimeout(() => _fvTutHighlight(step.highlight, step.hlLabel), 200);
    } else {
        _fvTutHidePointer();
    }
}

function _fvTutHighlight(elementId, label) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.add('fv-tut-hl');
    const ptr  = document.getElementById('fv-tut-pointer');
    const pLbl = document.getElementById('fv-tut-ptr-label');
    if (!ptr) return;
    if (pLbl) pLbl.textContent = label || 'LIHAT INI';
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    ptr.style.display = 'flex';
    ptr.style.left = (cx - 35) + 'px';
    ptr.style.top  = (cy + rect.height / 2 + 8) + 'px';
}

function _fvTutClearHL() {
    document.querySelectorAll('.fv-tut-hl').forEach(e => e.classList.remove('fv-tut-hl'));
    _fvTutHidePointer();
}
function _fvTutHidePointer() {
    const p = document.getElementById('fv-tut-pointer');
    if (p) p.style.display = 'none';
}

function _fvTutClose() {
    _fvTutClearHL();
    const el = document.getElementById('fv-tutorial');
    if (el) el.classList.remove('active');
}

function _fvTutFinish() {
    _fvTutClose();
    getFairyVillage().fvTutorialDone = true;
    showToast('🌟 Tutorial selesai! Selamat membangun Kahyangan Wilis!');
    // Kasih hint awal
    setTimeout(() => {
        showFVDialog('RARA WILIS',
            '✨ Mulailah dengan jalan ke Pohon Energi di selatan untuk mengumpulkan Serbuk Wilis pertamamu!\n\n🗺️ Gunakan minimap di pojok kanan atas untuk navigasi.',
            [{text:'Siap, Rara!', action:()=>{ if(typeof closeDialogue==='function') closeDialogue(); }}],
            'images/rarawilis.png'
        );
    }, 500);
}

function getFairyVillageStats(fv) {
    let totalCap=0, totalDust=0, totalHappy=0, totalFood=0, dustMult=1, xpMult=1, intelBonus=0;
    (fv.buildings||[]).forEach(({bid, workers}) => {
        const b = FAIRY_BUILDINGS[bid]; if (!b) return;
        if (b.maxFairies)     totalCap    += b.maxFairies;
        if (b.happinessBonus) totalHappy  += b.happinessBonus;
        if (b.dustMultiplier) dustMult     = Math.max(dustMult, b.dustMultiplier);
        if (b.xpBonus)        xpMult       = Math.max(xpMult, b.xpBonus);
        if (b.intelBonus)     intelBonus  += b.intelBonus;

        // Worker bonus berdasarkan semangat peri
        const wk = workers || [];
        const maxW = b.maxWorkers || 2;
        const activeWk = wk.slice(0, maxW);
        let workerBonus = 1;
        if (activeWk.length > 0) {
            const avgSp = activeWk.reduce((s,id) => {
                const f = (fv.fairies||[]).find(x=>x.id===id);
                return s + (f?.spirit||10);
            }, 0) / activeWk.length;
            // Tier 3 = 3 worker bisa dapat bonus lebih tinggi
            const maxBonus = maxW >= 3 ? 2.5 : 2;
            workerBonus = avgSp >= 28 ? maxBonus : avgSp >= 20 ? 2 : avgSp >= 15 ? 1.5 : avgSp >= 10 ? 1.25 : 1;
        }

        if (b.dustPerDay)  totalDust += b.dustPerDay * workerBonus;
        if (b.foodPerDay)  totalFood += b.foodPerDay * workerBonus;
    });
    return {
        totalCap:    Math.max(1, totalCap),
        totalDust:   Math.round(totalDust * dustMult),
        totalHappy:  Math.min(100, totalHappy),
        totalFood:   Math.round(totalFood),
        xpMult,
        intelBonus,
    };
}

function fairyDailyTick(fv) {
    const curDay = STATE.day;
    if (fv.lastTickDay === curDay) return;
    fv.lastTickDay = curDay;
    const stats = getFairyVillageStats(fv);

    // ── Produksi Debu Peri ─────────────────────────────────────────
    if (stats.totalDust > 0) {
        fv.resources.debu = (fv.resources.debu||0) + stats.totalDust;
        showToast(`✨ +${stats.totalDust} Debu Peri dari bangunan!`);
    }

    // ── Produksi Makanan dari Taman (sudah dihitung di stats.totalFood) ──
    if (stats.totalFood > 0) {
        fv.resources.makanan = (fv.resources.makanan||0) + stats.totalFood;
    }

    // ── Sistem Makanan: tiap peri makan 1/hari ─────────────────────
    const totalFairies = fv.fairies.length;
    const foodAvail = fv.resources.makanan || 0;
    if (foodAvail >= totalFairies) {
        fv.resources.makanan = foodAvail - totalFairies;
        fv.fairies.forEach(f => {
            f.happiness = Math.min(100, (f.happiness||80) + Math.floor(stats.totalHappy/10) + 5);
            f.mood = f.happiness >= 70 ? 'happy' : f.happiness >= 40 ? 'neutral' : 'sad';
        });
    } else {
        let remaining = foodAvail;
        fv.resources.makanan = 0;
        fv.fairies.forEach(f => {
            if (remaining > 0) { remaining--; f.happiness = Math.min(100,(f.happiness||80)+2); }
            else { f.happiness = Math.max(0,(f.happiness||80)-15); }
            f.mood = f.happiness>=70?'happy':f.happiness>=40?'neutral':f.happiness>=20?'sad':'bad_mood';
        });
        if (totalFairies > 0) showToast('⚠️ Stok makanan habis! Peri-peri mulai lapar...');
    }

    // ── Intel bonus dari Akademi ───────────────────────────────────
    if (stats.intelBonus > 0) {
        fv.fairies.forEach(f => {
            f.intel = Math.min(30, (f.intel||10) + stats.intelBonus);
        });
    }

    // ── Kelahiran peri baru dari hunian ────────────────────────────
    (fv.buildings||[]).forEach(({bid}) => {
        const b = FAIRY_BUILDINGS[bid];
        if (b?.birthChance && Math.random() < b.birthChance && fv.fairies.length < stats.totalCap) {
            const g = Math.random() < 0.6 ? 'girl' : 'boy';
            const names = g==='girl' ? FAIRY_NAMES_GIRL : FAIRY_NAMES_BOY;
            const spriteCount = g === 'girl' ? 4 : 2;
            const spriteIdx = Math.floor(Math.random() * spriteCount);
            const defaultName = names[Math.floor(Math.random()*names.length)];
            // FIX: ganti nama 'stats' menjadi 'newFairyStats' agar tidak shadow outer 'stats'
            const newFairyStats = {
                intel:_fairyStat(), agility:_fairyStat(), spirit:_fairyStat(),
                hp:80+Math.floor(Math.random()*20)
            };
            const newFairy = {
                id: 'f_'+Date.now()+'_'+Math.floor(Math.random()*9999),
                name: defaultName,
                gender:g, level:1, xp:0, happiness:80, mood:'happy',
                intel:newFairyStats.intel, agility:newFairyStats.agility, spirit:newFairyStats.spirit,
                hp:newFairyStats.hp, maxHp:100,
                spriteIdx: spriteIdx,
                isBorn: true,
            };
            fv.fairies.push(newFairy);
            // Tampilkan popup kelahiran dengan opsi ganti nama
            setTimeout(() => showFairyBirthPopup(newFairy, FAIRY_BUILDINGS[bid]?.name||'bangunan'), 300);
        }
    });
}

// ── OPEN / CLOSE ───────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
// REFRESH FAIRY VILLAGE MAP — Perbarui bangunan solid di maps
// ═══════════════════════════════════════════════════════════════
function refreshFairyVillageMap() {
    if (!maps['fairyVillage']) return;
    const fv = getFairyVillage();

    // FIX: Gunakan posisi yang benar dari FV_RARA_POS dan FV_POHON_POS
    // Sebelumnya pakai x:113, y:4 yang SALAH BESAR (di luar peta FW=60!)
    const buildings = [
        {
            id: 'pohon_energi_bld',
            x: FV_POHON_POS.x, y: FV_POHON_POS.y,
            w: 3, h: 3,
            solid: true,
            type: 'fv_building',
            name: 'Pohon Energi'
        },
        {
            // Istana Peri — landmark permanen, solid, punya pintu masuk
            id: 'fv_istana_bld',
            x: FV_ISTANA_POS.x, y: FV_ISTANA_POS.y,
            w: 3, h: 3,
            solid: true,
            type: 'fv_building',
            name: '🏰 Puri Agung Wilis',
            _fvEmoji: '🏰',
            _fvTier: 4,
            _fvBid: 'istana_mini',
            _fvSlotId: 'istana_fixed',
            // Pintu di tengah bawah bangunan
            entrance: { x: FV_ISTANA_POS.x + 1, y: FV_ISTANA_POS.y + 3 },
            open24h: true,
        },
    ];

    // Tambahkan bangunan yang sudah selesai dibangun
    (fv.buildings || []).forEach(b => {
        const slot = FAIRY_SLOTS.find(s => s.id === b.slotId);
        if (!slot) return;
        const bDef = (typeof FAIRY_BUILDINGS !== 'undefined') ? FAIRY_BUILDINGS[b.bid] : null;
        const bw = (bDef && bDef.w) || 2;
        const bh = (bDef && bDef.h) || 2;
        // Entrance di tengah bawah bangunan (seperti map utama)
        const entranceX = slot.x + Math.floor(bw/2);
        const entranceY = slot.y + bh;
        buildings.push({
            id: 'fv_bld_' + b.slotId,
            x: slot.x, y: slot.y,
            w: bw, h: bh,
            solid: true,
            type: 'fv_building',
            name: (bDef && bDef.name) || 'Bangunan',
            _fvEmoji: (bDef && bDef.emoji) || '🏠',
            _fvTier: (bDef && bDef.tier) || 0,
            _fvBid: b.bid,
            _fvSlotId: b.slotId,
            // Entrance trigger — player bisa masuk dari depan pintu
            entrance: { x: entranceX, y: entranceY },
            open24h: true,
        });
    });

    maps['fairyVillage'].buildings = buildings;

    // FIX: Tambahkan NPC trigger Istana Peri jika belum ada
    // NPC ini yang memunculkan dialog "Kelola Kahyangan" saat player mendekati istana
    const _istanaExists = maps['fairyVillage'].npcs.some(n => n.id === 'fv_istana_npc');
    if (!_istanaExists) {
        maps['fairyVillage'].npcs.push({
            id: 'fv_istana_npc',
            name: '🏰 Puri Agung Wilis',
            x: FV_ISTANA_POS.x + 1,
            y: FV_ISTANA_POS.y + 2,
            w: 1, h: 1,
            sprite: '', imgSrc: '',
            noNameTag: true,
            noRender: true,        // jangan digambar — sudah ada gambar istana di drawFairyWorld
            schedule: 'always',
            type: 'fairy_npc',
            dialogFn: 'openIstanaDialog'
        });
    }

    // Update NPC
    maps['fairyVillage'].npcs.forEach(n => {
        n.imgSrc = n.sprite || n.imgSrc;
        n.schedule = 'always';
        n.w = n.w || 38;
        n.h = n.h || 58;
        if (n.id === 'rara_wilis') {
            n.type = 'fairy_npc';
            n.dialogFn = 'openRaraWilisDialog';
        }
        if (n.id === 'pohon_energi') {
            n.dialogFn = 'collectFairyDust';
        }
        if (['fv_wening','fv_sekar','fv_bening','fv_juna'].includes(n.id)) {
            n.type = n.type || 'wander';
            n.dialogFn = 'openFairyNPCDialog_' + n.id;
        }
        // FIX: Istana Peri trigger NPC — selalu set dialogFn
        if (n.id === 'fv_istana_npc') {
            n.type = 'fairy_npc';
            n.dialogFn = 'openIstanaDialog';
            n.noRender = true;
            n.noNameTag = true;
        }
    });
}

function openFairyVillage() {
    if (!STATE.player.sylvariaQuestComplete) {
        showToast('Selesaikan Quest Kahyangan Wilis dulu!'); return;
    }
    const fv = getFairyVillage();

    // FIX: Reset resource ke starter untuk kunjungan pertama
    // Dilakukan SEBELUM fairyDailyTick agar tidak ter-override
    if (fv.isFirstVisit) {
        fv.resources = { debu:50, kristal:5, cahaya:1, makanan:30 };
        fv.isFirstVisit = false;
        showToast('✨ Selamat datang di Kahyangan Wilis! Kamu mendapat sumber daya awal!');
    }

    // FIX: Hanya jalankan daily tick jika BUKAN kunjungan pertama
    // agar tidak ada popup kelahiran peri yang bentrok dengan tutorial
    if (!fv.fvTutorialDone) {
        // Skip daily tick saat tutorial agar tidak ada interupsi
        fv.lastTickDay = STATE.day; // mark hari ini agar tick tidak jalan
    } else {
        fairyDailyTick(fv);
    }

    // Simpan lokasi & posisi sebelumnya
    window._fvPrevLocation = STATE.location;
    window._fvPrevX = STATE.player.x;
    window._fvPrevY = STATE.player.y;

    // Refresh map peri (bangunan dinamis)
    refreshFairyVillageMap();
    // Reset NPC runtime positions agar fresh
    fvNpcRuntime = {};
    fvSpriteCache['__player__'] = null; // force re-cache player sprite

    // Pindah ke peta peri menggunakan sistem location utama
    STATE.location = 'fairyVillage';
    STATE.screen = 'play';

    // Spawn player di dekat Rara Wilis (tengah peta)
    STATE.player.x = FV_RARA_POS ? (FV_RARA_POS.x + 3) * TS : 140;
    STATE.player.y = FV_RARA_POS ? (FV_RARA_POS.y + 3) * TS : 140;

    // Sembunyikan modal lama (jika masih ada)
    const oldModal = document.getElementById('fairy-village-modal');
    if (oldModal) oldModal.style.display = 'none';

    // Pastikan sprite player ter-load
    if (!STATE.player.spriteIdle) selectGender(STATE.player.gender || 'boy', true);
    // Pastikan tidak ada guard prologue yang memblokir
    STATE.isPrologue = false;
    STATE.screen = 'play';
    // Tutup dialogue jika ada
    const _dw = document.getElementById('dialogue-wrapper');
    if (_dw) _dw.style.display = 'none';

    // ── SET fvCanvas ke gameCanvas utama & start loop ────────────
    const _gc = document.getElementById('gameCanvas');
    if (_gc) {
        fvCanvas = _gc;
        fvCtx    = _gc.getContext('2d');
    }
    fvPlayer = { x: (FV_RARA_POS.x+3)*TS, y: (FV_RARA_POS.y+3)*TS, facing:'down' };
    startFairyLoop();
    updateFVHUD();

    // FIX: Aktifkan minimap HTML utama dengan style peri (border ungu)
    const _mmFv = document.getElementById('minimap-container');
    if (_mmFv) { _mmFv.classList.add('ingame', 'fv-mode'); }

    // ── TUTORIAL PERTAMA KALI ──────────────────────────────────────
    // FIX: Tunda 1000ms agar canvas sudah ter-render sebelum tutorial muncul
    if (!fv.fvTutorialDone) {
        setTimeout(() => startFairyVillageTutorial(), 1000);
    }
}

function closeFairyVillage() {
    // 1. Tutup semua layer dialog yang mungkin aktif
    fvActiveDialog = null;
    const dw = document.getElementById('dialogue-wrapper');
    if (dw) {
        // Bersihkan typewriter timer
        if (dw._typeTimer) { clearInterval(dw._typeTimer); dw._typeTimer = null; }
        // Lepas tap handler
        const box = document.getElementById('dialogue-box');
        if (box && dw._tapHandler) {
            box.removeEventListener('click', dw._tapHandler);
            dw._tapHandler = null;
        }
        dw.style.display = 'none';
    }
    // 2. Tutup kh-modal jika terbuka
    const khm = document.getElementById('kh-modal');
    if (khm) khm.classList.remove('open');
    // 3. Tutup tutorial jika aktif
    const tut = document.getElementById('fv-tutorial');
    if (tut) tut.classList.remove('active');
    // 4. Bersihkan highlight tutorial
    document.querySelectorAll('.fv-tut-hl').forEach(e => e.classList.remove('fv-tut-hl'));
    const ptr = document.getElementById('fv-tut-pointer');
    if (ptr) ptr.style.display = 'none';
    // 5. Reset STATE
    STATE.screen = 'play';
    // 6. Kembalikan ke lokasi sebelumnya
    STATE.location = window._fvPrevLocation || 'village';
    STATE.player.x  = window._fvPrevX !== undefined ? window._fvPrevX : 1200;
    STATE.player.y  = window._fvPrevY !== undefined ? window._fvPrevY : 600;
    // 7. Reset input agar tidak ada tombol tertahan
    if (typeof resetInputs === 'function') resetInputs();
    // 7b. Stop fairyLoop dan clear fvCanvas agar tidak bentrok dengan main render
    stopFairyLoop();
    fvCanvas = null; fvCtx = null;
    // 8. FIX: Stop musik pulau peri saat keluar — pause track aktual + reset currentTrack
    if (typeof AudioService !== 'undefined') {
        const stopTrack = (name) => {
            const t = AudioService.tracks && AudioService.tracks[name];
            if (t && !t.paused) { t.pause(); t.currentTime = 0; }
        };
        stopTrack('pulauperi');
        stopTrack('insideperi');
        AudioService.currentTrack = null;
    }
    manualSave();
    // FIX: Lepas class fv-mode dari minimap saat keluar dunia peri
    const _mmFvClose = document.getElementById('minimap-container');
    if (_mmFvClose) _mmFvClose.classList.remove('fv-mode');
    showToast('🏝️ Kembali ke Pulau Arsa');
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
function initFairyWorld() {
    fvCanvas = document.getElementById('fv-canvas');
    if (!fvCanvas) return;
    fvCtx = fvCanvas.getContext('2d');
    resizeFairyCanvas();

    fvPlayer = { x: (FV_RARA_POS.x+3)*TS, y: (FV_RARA_POS.y+3)*TS, facing:'down' };
    fvKeys = {};
    fvActiveDialog = null;
    fvParticles = [];
    fvJoy = { active:false, startX:0, startY:0, dx:0, dy:0 };

    const fv = getFairyVillage();
    // Tutorial lama (2 pesan singkat) dinonaktifkan — digantikan tutorial baru yang lebih lengkap
    if (!fv.tutorialDone) {
        fv.tutorialDone = true; // langsung mark agar tidak muncul, tutorial baru yang akan jalan
    }

    setupFairyInput();
    startFairyLoop();
    updateFVHUD();
}

function resizeFairyCanvas() {
    if (!fvCanvas) return;
    const modal  = document.getElementById('fairy-village-modal');
    const hud    = document.getElementById('fv-hud');
    const bottom = document.getElementById('fv-bottom-bar');
    const w = modal.clientWidth  || 360;
    const h = modal.clientHeight - (hud?.offsetHeight||50) - (bottom?.offsetHeight||110);
    fvCanvas.width  = Math.max(200, w);
    fvCanvas.height = Math.max(150, h);
}

// ═══════════════════════════════════════════════════════════════
// GAME LOOP
// ═══════════════════════════════════════════════════════════════
function startFairyLoop() {
    stopFairyLoop();
    fvLastTime = performance.now();
    FVG = requestAnimationFrame(fairyLoop);
}
function stopFairyLoop() {
    if (FVG) { cancelAnimationFrame(FVG); FVG = null; }
}

function fairyLoop(ts) {
    if (STATE.location !== 'fairyVillage') { FVG=null; return; }
    const dt = Math.min(32, ts - fvLastTime);
    fvLastTime = ts;
    checkBuildQueue();
    updateFairyPlayer(dt);
    // Cek daily tick
    const fv = getFairyVillage();
    if (fv.lastTickDay !== STATE.day) {
        fairyDailyTick(fv);
    }
    // drawFairyWorld dipanggil oleh main render loop
    FVG = requestAnimationFrame(fairyLoop);
}

// ═══════════════════════════════════════════════════════════════
// BUILD QUEUE — waktu nyata: 1 hari game = 60 detik
// ═══════════════════════════════════════════════════════════════
const BUILD_DURATION_MS = 60 * 1000; // 60 detik real per bangunan

function checkBuildQueue() {
    const fv = getFairyVillage();
    if (!fv.buildQueue || fv.buildQueue.length === 0) return;
    const now = Date.now();
    const done = fv.buildQueue.filter(q => now >= q.finishTime);
    if (done.length === 0) return;
    done.forEach(q => {
        const slot = FAIRY_SLOTS.find(s=>s.id===q.slotId);
        const bDef = FAIRY_BUILDINGS[q.bid];
        const bName = bDef?.name || 'Bangunan';
        const bEmoji = bDef?.emoji || '🏠';
        if (q.isUpgrade) {
            const existing = fv.buildings.find(b => b.slotId === q.slotId);
            if (existing) {
                const oldName = FAIRY_BUILDINGS[existing.bid]?.name || existing.bid;
                existing.bid = q.bid;
                const newMax = FAIRY_BUILDINGS[q.bid]?.maxWorkers || 2;
                if ((existing.workers||[]).length > newMax) existing.workers = existing.workers.slice(0, newMax);
                if (slot && STATE.location === 'fairyVillage') createFVParticles(slot.x*TS+TS, slot.y*TS+TS, 30);
                // FIX: Pop-up upgrade selesai
                showToast(`⬆️ ${oldName} berhasil diupgrade jadi ${bName}!`);
                if (typeof showDialogue === 'function') {
                    showDialogue('✨ Upgrade Selesai!',
                        `${bEmoji} ${bName} telah selesai diupgrade!\n\nBangunan kini lebih kuat dan bisa menampung lebih banyak peri. Kunjungi Kahyangan Wilis untuk melihatnya!`,
                        [{ text: 'Mantap! 🎉', action: () => { if(typeof closeDialogue==='function') closeDialogue(); } }],
                        null);
                }
            }
        } else {
            // Bangunan baru
            fv.buildings.push({ slotId: q.slotId, bid: q.bid, workers: [] });
            if (slot && STATE.location === 'fairyVillage') createFVParticles(slot.x*TS+TS, slot.y*TS+TS, 20);
            // FIX: Pop-up bangunan selesai dengan info bangunan
            showToast(`✅ ${bName} selesai dibangun di Kahyangan Wilis!`);
            if (typeof showDialogue === 'function') {
                showDialogue(`${bEmoji} Bangunan Selesai!`,
                    `${bName} telah selesai dibangun di Kahyangan Wilis!\n\n${bDef?.desc || ''}\n\n🏗️ Tugaskan peri untuk mulai bekerja di bangunan ini agar menghasilkan sumber daya.`,
                    [{ text: '🧚 Lihat Sekarang', action: () => {
                        if(typeof closeDialogue==='function') closeDialogue();
                        if (STATE.location === 'fairyVillage' && typeof openKhModal==='function') openKhModal();
                    }},
                    { text: 'Nanti Saja', action: () => { if(typeof closeDialogue==='function') closeDialogue(); } }],
                    null);
            }
        }
    });
    fv.buildQueue = fv.buildQueue.filter(q => now < q.finishTime);
    // FIX: Refresh peta setelah bangunan selesai agar langsung muncul di peta
    if (typeof refreshFairyVillageMap === 'function') refreshFairyVillageMap();
    updateFVHUD();
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// UPDATE PLAYER DI FAIRY VILLAGE
// Player movement sudah dihandle main game loop
// Fungsi ini hanya update facing dan action button
// ═══════════════════════════════════════════════════════════════
function updateFairyPlayer(dt) {
    // Sync fvPlayer dari STATE.player
    fvPlayer.x = STATE.player.x;
    fvPlayer.y = STATE.player.y;

    // Update facing dari input (untuk animasi sprite)
    if (fvKeys['ArrowLeft'] ||fvKeys['a']) fvPlayer.facing='left';
    else if (fvKeys['ArrowRight']||fvKeys['d']) fvPlayer.facing='right';
    else if (fvKeys['ArrowUp']   ||fvKeys['w']) fvPlayer.facing='up';
    else if (fvKeys['ArrowDown'] ||fvKeys['s']) fvPlayer.facing='down';

    if (fvJoy.active) {
        const mag = Math.sqrt(fvJoy.dx*fvJoy.dx + fvJoy.dy*fvJoy.dy);
        if (mag > 8) {
            if (Math.abs(fvJoy.dx)>Math.abs(fvJoy.dy)) fvPlayer.facing = fvJoy.dx>0?'right':'left';
            else fvPlayer.facing = fvJoy.dy>0?'down':'up';
        }
    }

    updateFVActionBtn();
}

function updateFVActionBtn() {
    // fv-action-btn hanya untuk Rara Wilis & Pohon Energi
    // Bangunan sudah handle via btn-action utama (checkEntranceProximity)
    const btn = document.getElementById('fv-action-btn');
    if (!btn) return;
    const px = fvPlayer.x, py = fvPlayer.y;

    // Rara Wilis
    const rx = FV_RARA_POS.x*TS+TS, ry = FV_RARA_POS.y*TS+TS;
    if (Math.hypot(px-rx, py-ry) < TS*2.5) {
        btn.style.display='block';
        btn.textContent='💬 Bicara dengan Rara Wilis';
        btn.onclick = openRaraWilisDialog;
        return;
    }

    // Pohon Energi
    const tx = FV_POHON_POS.x*TS+TS, ty = FV_POHON_POS.y*TS+TS;
    if (Math.hypot(px-tx, py-ty) < TS*2.5) {
        btn.style.display='block';
        btn.textContent='✨ Kumpulkan Serbuk Wilis';
        btn.onclick = collectFairyDust;
        return;
    }

    // Peri NPC wandering (Wening, Sekar, Bening, Juna)
    // Posisi runtime diambil dari fvNpcRuntime karena mereka bergerak
    const _fvWanderNPCs = [
        { id:'fv_wening', label:'💬 Bicara dengan Wening',  fn: openFairyNPCDialog_fv_wening },
        { id:'fv_sekar',  label:'💬 Bicara dengan Sekar',   fn: openFairyNPCDialog_fv_sekar  },
        { id:'fv_bening', label:'💬 Bicara dengan Bening',  fn: openFairyNPCDialog_fv_bening },
        { id:'fv_juna',   label:'💬 Bicara dengan Juna',    fn: openFairyNPCDialog_fv_juna   },
    ];
    for (const npcDef of _fvWanderNPCs) {
        const rt = fvNpcRuntime[npcDef.id];
        if (!rt) continue;
        if (Math.hypot(px - (rt.px + 19), py - (rt.py + 29)) < TS * 2.5) {
            btn.style.display = 'block';
            btn.textContent = npcDef.label;
            btn.onclick = npcDef.fn;
            return;
        }
    }

    btn.style.display='none';
}

// ═══════════════════════════════════════════════════════════════
// DRAW
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// DRAW BANGUNAN KAHYANGAN — Canvas Asset per Tipe
// ═══════════════════════════════════════════════════════════════
function drawFVBuildingCanvas(ctx, bid, bx, by, bw, bh, t) {
    ctx.save();
    const cx = bx + bw/2;
    // ──────────────── HELPER ────────────────
    function wall(color, rx=0, ry=bh*0.35, rw=bw, rh=bh*0.65, r=4) {
        ctx.fillStyle=color;
        ctx.beginPath(); ctx.roundRect(bx+rx, by+ry, rw, rh, r); ctx.fill();
    }
    function roof(color, peakX=cx, peakY=by, leftX=bx-2, rightX=bx+bw+2, baseY=by+bh*0.4) {
        ctx.fillStyle=color;
        ctx.beginPath(); ctx.moveTo(leftX,baseY); ctx.lineTo(peakX,peakY); ctx.lineTo(rightX,baseY); ctx.closePath(); ctx.fill();
    }
    function door(color, dw=bw*0.22, dh=bh*0.28, dx=cx-bw*0.11) {
        ctx.fillStyle=color;
        ctx.beginPath(); ctx.roundRect(dx, by+bh-dh, dw, dh, [3,3,0,0]); ctx.fill();
    }
    function window_(color, wx_, wy_, ww=bw*0.15, wh=bh*0.13) {
        ctx.fillStyle='rgba(200,230,255,0.6)';
        ctx.beginPath(); ctx.roundRect(wx_, wy_, ww, wh, 2); ctx.fill();
        ctx.strokeStyle=color; ctx.lineWidth=1;
        ctx.beginPath(); ctx.roundRect(wx_, wy_, ww, wh, 2); ctx.stroke();
        // Cross
        ctx.beginPath(); ctx.moveTo(wx_+ww/2,wy_); ctx.lineTo(wx_+ww/2,wy_+wh);
        ctx.moveTo(wx_,wy_+wh/2); ctx.lineTo(wx_+ww,wy_+wh/2); ctx.stroke();
    }
    function outlineBldg(color) {
        ctx.strokeStyle=color; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,4); ctx.stroke();
    }

    // ──────────────── HUNIAN ────────────────
    // ──────────────── HUNIAN (pakai gambar omah-tier1/2/3.png) ────────────────
    if (bid==='pondok_peri') {
        const img1 = FV_OMAH_IMAGES[1];
        if (img1 && img1.complete && img1.naturalWidth > 0) {
            ctx.drawImage(img1, bx, by, bw, bh);
        } else {
            // Fallback canvas jika gambar belum load
            wall('#d4a96a');
            roof('#a0752a', cx, by-2, bx-3, bx+bw+3, by+bh*0.38);
            door('#7c4b1a', bw*0.24, bh*0.32);
            outlineBldg('#8b5e2a');
        }
    } else if (bid==='rumah_peri') {
        const img2 = FV_OMAH_IMAGES[2];
        if (img2 && img2.complete && img2.naturalWidth > 0) {
            ctx.drawImage(img2, bx, by, bw, bh);
        } else {
            wall('#e8d5b0');
            roof('#c0392b', cx, by-4, bx-4, bx+bw+4, by+bh*0.37);
            door('#5d3a1a', bw*0.25, bh*0.33);
            outlineBldg('#c0392b');
        }
    } else if (bid==='dalem_widadari') {
        const img3 = FV_OMAH_IMAGES[3];
        if (img3 && img3.complete && img3.naturalWidth > 0) {
            ctx.drawImage(img3, bx, by, bw, bh);
        } else {
            wall('#f5e6cc');
            roof('#8B4513', cx, by-6, bx-6, bx+bw+6, by+bh*0.32);
            roof('#a0522d', cx, by+bh*0.22, bx-2, bx+bw+2, by+bh*0.4);
            door('#4a2a0d', bw*0.26, bh*0.35);
            outlineBldg('#8B4513');
        }

    // ──────────────── TAMAN ────────────────
    } else if (bid==='taman_mini') {
        const imgT1 = FV_TAMAN_IMAGES[1];
        if (imgT1 && imgT1.complete && imgT1.naturalWidth > 0) {
            const srcAR = 700/400; const dstAR = bw/bh;
            let sx=0,sy=0,sw=700,sh=400;
            if (srcAR > dstAR) { sw=Math.round(400*dstAR); sx=Math.round((700-sw)/2); }
            else { sh=Math.round(700/dstAR); sy=Math.round((400-sh)/2); }
            ctx.drawImage(imgT1, sx,sy,sw,sh, bx,by,bw,bh);
        } else {
            // Fallback canvas
            ctx.fillStyle='#4a7c2f';
            ctx.beginPath(); ctx.roundRect(bx, by+bh*0.5, bw, bh*0.5, [0,0,4,4]); ctx.fill();
            ctx.fillStyle='#2d5a1b';
            ctx.beginPath(); ctx.roundRect(bx, by+bh*0.5, bw, bh*0.06, 0); ctx.fill();
            ctx.strokeStyle='#8b6914'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.roundRect(bx+1, by+bh*0.48, bw-2, bh*0.52, 3); ctx.stroke();
            for(let i=0;i<4;i++) {
                ctx.beginPath(); ctx.moveTo(bx+bw*0.12+i*bw*0.23, by+bh*0.48); ctx.lineTo(bx+bw*0.12+i*bw*0.23, by+bh); ctx.stroke();
            }
            const flowerColors=['#f472b6','#facc15','#fb923c','#a78bfa'];
            for(let i=0;i<5;i++) {
                const fx2=bx+bw*0.1+i*(bw*0.18), fy2=by+bh*0.62;
                ctx.fillStyle=flowerColors[i%4];
                for(let p=0;p<5;p++) {
                    const ang=p*Math.PI*2/5;
                    ctx.beginPath(); ctx.arc(fx2+Math.cos(ang)*4, fy2+Math.sin(ang)*4+Math.sin(t/800+i)*1.5, 3, 0, Math.PI*2); ctx.fill();
                }
                ctx.fillStyle='#fef08a'; ctx.beginPath(); ctx.arc(fx2, fy2+Math.sin(t/800+i)*1.5, 2.5, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle='#16a34a'; ctx.lineWidth=1.5; ctx.strokeStyle='#16a34a';
                ctx.beginPath(); ctx.moveTo(fx2, fy2+4+Math.sin(t/800+i)*1.5); ctx.lineTo(fx2, by+bh-2); ctx.stroke();
            }
        }
    } else if (bid==='taman_mekar') {
        const imgT2 = FV_TAMAN_IMAGES[2];
        if (imgT2 && imgT2.complete && imgT2.naturalWidth > 0) {
            const srcAR = 700/400; const dstAR = bw/bh;
            let sx=0,sy=0,sw=700,sh=400;
            if (srcAR > dstAR) { sw=Math.round(400*dstAR); sx=Math.round((700-sw)/2); }
            else { sh=Math.round(700/dstAR); sy=Math.round((400-sh)/2); }
            ctx.drawImage(imgT2, sx,sy,sw,sh, bx,by,bw,bh);
        } else {
            // Fallback canvas
            ctx.fillStyle='#3a6b22';
            ctx.beginPath(); ctx.roundRect(bx, by+bh*0.45, bw, bh*0.55, [0,0,4,4]); ctx.fill();
            ctx.fillStyle='#9ca3af';
            for(let i=0;i<3;i++) { ctx.beginPath(); ctx.arc(cx+(-1+i)*bw*0.2, by+bh*0.78, bw*0.07, 0, Math.PI*2); ctx.fill(); }
            [[bx+bw*0.12, by+bh*0.5],[bx+bw*0.78, by+bh*0.5]].forEach(([tx2,ty2])=>{
                ctx.fillStyle='#5c3d1e'; ctx.fillRect(tx2, ty2+bh*0.18, bw*0.06, bh*0.18);
                ctx.fillStyle='#15803d'; ctx.beginPath(); ctx.arc(tx2+bw*0.03, ty2, bw*0.1, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle='#22c55e'; ctx.beginPath(); ctx.arc(tx2+bw*0.03, ty2-bh*0.04, bw*0.07, 0, Math.PI*2); ctx.fill();
            });
            const flC=['#fde68a','#f9a8d4','#a5f3fc','#bbf7d0'];
            for(let i=0;i<8;i++) {
                const fx2=bx+bw*0.08+i*(bw*0.11), fy2=by+bh*0.62+Math.sin(i)*bh*0.06;
                ctx.fillStyle=flC[i%4]; ctx.beginPath(); ctx.arc(fx2, fy2, 4, 0, Math.PI*2); ctx.fill();
            }
            ctx.strokeStyle='#16a34a'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.roundRect(bx+1, by+bh*0.44, bw-2, bh*0.56, 4); ctx.stroke();
        }
    } else if (bid==='kebun_raya') {
        const imgT3 = FV_TAMAN_IMAGES[3];
        if (imgT3 && imgT3.complete && imgT3.naturalWidth > 0) {
            const srcAR = 700/400; const dstAR = bw/bh;
            let sx=0,sy=0,sw=700,sh=400;
            if (srcAR > dstAR) { sw=Math.round(400*dstAR); sx=Math.round((700-sw)/2); }
            else { sh=Math.round(700/dstAR); sy=Math.round((400-sh)/2); }
            ctx.drawImage(imgT3, sx,sy,sw,sh, bx,by,bw,bh);
        } else {
            // Fallback canvas
            ctx.fillStyle='#166534';
            ctx.beginPath(); ctx.roundRect(bx, by+bh*0.4, bw, bh*0.6, [0,0,4,4]); ctx.fill();
            ctx.fillStyle='#7c5c2e'; ctx.fillRect(cx-bw*0.12, by+bh*0.38, bw*0.24, bh*0.08);
            ctx.fillRect(cx-bw*0.12, by+bh*0.4, bw*0.04, bh*0.2);
            ctx.fillRect(cx+bw*0.08, by+bh*0.4, bw*0.04, bh*0.2);
            const gC=['#16a34a','#22c55e','#4ade80','#15803d'];
            for(let i=0;i<12;i++) {
                const fx2=bx+bw*0.06+i*(bw*0.08), fy2=by+bh*0.55+Math.sin(i*1.3)*bh*0.1;
                ctx.fillStyle=gC[i%4]; ctx.beginPath(); ctx.arc(fx2, fy2, 4+Math.sin(i)*1.5, 0, Math.PI*2); ctx.fill();
            }
            ctx.strokeStyle='#15803d'; ctx.lineWidth=1.5;
            ctx.beginPath(); ctx.roundRect(bx+1, by+bh*0.39, bw-2, bh*0.61, 4); ctx.stroke();
        }

    // ──────────────── KOLAM ────────────────
    } else if (bid==='kolam_kristal') {
        const imgS1 = FV_SENDANG_IMAGES[1];
        if (imgS1 && imgS1.complete && imgS1.naturalWidth > 0) {
            const srcAR=700/400,dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if(srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgS1,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            ctx.fillStyle='#e0f2fe'; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.68,bw*0.4,bh*0.28,0,0,Math.PI*2); ctx.fill();
            const shimmer=0.4+0.3*Math.sin(t/500);
            ctx.fillStyle=`rgba(56,189,248,${shimmer})`; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.68,bw*0.32,bh*0.21,0,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle='#0284c7'; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.68,bw*0.4,bh*0.28,0,0,Math.PI*2); ctx.stroke();
            for(let i=0;i<6;i++){const ang=i*Math.PI/3;ctx.fillStyle='#94a3b8';ctx.beginPath();ctx.arc(cx+Math.cos(ang)*bw*0.38,by+bh*0.68+Math.sin(ang)*bh*0.26,4,0,Math.PI*2);ctx.fill();}
            ctx.fillStyle='#7c5c2e'; ctx.beginPath(); ctx.roundRect(cx-bw*0.18,by+bh*0.32,bw*0.36,bh*0.14,3); ctx.fill();
            ctx.fillStyle='#fef9c3'; ctx.font=`bold ${bh*0.08}px Nunito,sans-serif`; ctx.textAlign='center';
            ctx.fillText('Sendang',cx,by+bh*0.42); ctx.textAlign='left';
        }
    } else if (bid==='kolam_agung') {
        const imgS2 = FV_SENDANG_IMAGES[2];
        if (imgS2 && imgS2.complete && imgS2.naturalWidth > 0) {
            const srcAR=700/400,dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if(srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgS2,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            ctx.fillStyle='#bfdbfe'; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.65,bw*0.44,bh*0.31,0,0,Math.PI*2); ctx.fill();
            const sh2=0.45+0.3*Math.sin(t/450);
            ctx.fillStyle=`rgba(14,165,233,${sh2})`; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.65,bw*0.36,bh*0.24,0,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle='#0369a1'; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.65,bw*0.44,bh*0.31,0,0,Math.PI*2); ctx.stroke();
        }
    } else if (bid==='telaga_nirmala') {
        const imgS3 = FV_SENDANG_IMAGES[3];
        if (imgS3 && imgS3.complete && imgS3.naturalWidth > 0) {
            const srcAR=700/400,dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if(srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgS3,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            const telGrd=ctx.createRadialGradient(cx,by+bh*0.62,0,cx,by+bh*0.62,bw*0.46);
            telGrd.addColorStop(0,'rgba(232,121,249,0.9)'); telGrd.addColorStop(0.4,'rgba(56,189,248,0.8)');
            telGrd.addColorStop(0.8,'rgba(74,222,128,0.6)'); telGrd.addColorStop(1,'rgba(251,191,36,0.3)');
            ctx.fillStyle=telGrd; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.62,bw*0.46,bh*0.34,0,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle='#a855f7'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.62,bw*0.46,bh*0.34,0,0,Math.PI*2); ctx.stroke();
        }

    // ──────────────── SEKOLAH ────────────────
    } else if (bid==='sekolah_peri') {
        const imgSk1 = FV_SEKOLAH_IMAGES[1];
        if (imgSk1 && imgSk1.complete && imgSk1.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgSk1,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fef9c3');
            roof('#6366f1', cx, by-3, bx-3, bx+bw+3, by+bh*0.38);
            ctx.fillStyle='#4f46e5'; ctx.beginPath(); ctx.roundRect(bx-3, by+bh*0.36, bw+6, bh*0.05, 1); ctx.fill();
            ctx.fillStyle='#1e3a5f'; ctx.beginPath(); ctx.roundRect(cx-bw*0.18, by+bh*0.42, bw*0.36, bh*0.16, 2); ctx.fill();
            ctx.fillStyle='#93c5fd'; ctx.font=`${bh*0.08}px serif`; ctx.textAlign='center';
            ctx.fillText('📚', cx, by+bh*0.54); ctx.textAlign='left';
            door('#4338ca', bw*0.24, bh*0.31);
            window_('#4f46e5', bx+bw*0.08, by+bh*0.44); window_('#4f46e5', bx+bw*0.68, by+bh*0.44);
            outlineBldg('#6366f1');
        }
    } else if (bid==='sanggar_tari') {
        const imgSk2 = FV_SEKOLAH_IMAGES[2];
        if (imgSk2 && imgSk2.complete && imgSk2.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgSk2,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fdf4ff');
            roof('#9333ea', cx, by-5, bx-4, bx+bw+4, by+bh*0.36);
            ctx.fillStyle='#7e22ce'; ctx.beginPath(); ctx.roundRect(bx-4, by+bh*0.34, bw+8, bh*0.05, 1); ctx.fill();
            ctx.fillStyle='rgba(167,139,250,0.3)'; ctx.beginPath(); ctx.arc(cx, by+bh*0.55, bw*0.2, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle='#a855f7'; ctx.font=`${bh*0.2}px serif`; ctx.textAlign='center';
            ctx.fillText('🎭', cx, by+bh*0.62); ctx.textAlign='left';
            door('#6b21a8', bw*0.25, bh*0.32);
            window_('#9333ea', bx+bw*0.07, by+bh*0.44); window_('#9333ea', bx+bw*0.67, by+bh*0.44);
            outlineBldg('#9333ea');
        }
    } else if (bid==='akademi_agung') {
        const imgSk3 = FV_SEKOLAH_IMAGES[3];
        if (imgSk3 && imgSk3.complete && imgSk3.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgSk3,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fefce8');
            for(let i=0;i<4;i++){ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.roundRect(bx+bw*0.08+i*bw*0.24,by+bh*0.35,bw*0.08,bh*0.65,2);ctx.fill();}
            roof('#1d4ed8', cx, by-7, bx-5, bx+bw+5, by+bh*0.33);
            roof('#2563eb', cx, by+bh*0.2, bx-2, bx+bw+2, by+bh*0.38);
            door('#1e3a8a', bw*0.26, bh*0.36); outlineBldg('#2563eb');
        }

    // ──────────────── PASAR ────────────────
    } else if (bid==='pasar_peri') {
        const imgPs1 = FV_PASAR_IMAGES[1];
        if (imgPs1 && imgPs1.complete && imgPs1.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgPs1,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fef3c7');
            ctx.fillStyle='#dc2626'; ctx.beginPath(); ctx.moveTo(bx-2,by+bh*0.42); ctx.lineTo(cx,by+bh*0.2); ctx.lineTo(bx+bw+2,by+bh*0.42); ctx.closePath(); ctx.fill();
            ctx.fillStyle='#7c3aed'; ctx.beginPath(); ctx.roundRect(cx-bw*0.25,by+bh*0.55,bw*0.5,bh*0.18,2); ctx.fill();
            ctx.fillStyle='#fde68a'; ctx.font=`${bh*0.12}px serif`; ctx.textAlign='center';
            ctx.fillText('🛒', cx, by+bh*0.68); ctx.textAlign='left';
            outlineBldg('#dc2626');
        }
    } else if (bid==='balai_dagang') {
        const imgPs2 = FV_PASAR_IMAGES[2];
        if (imgPs2 && imgPs2.complete && imgPs2.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgPs2,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fff7ed');
            roof('#ea580c', cx, by-4, bx-3, bx+bw+3, by+bh*0.37);
            ctx.fillStyle='#1e3a5f'; ctx.beginPath(); ctx.roundRect(cx-bw*0.22,by+bh*0.4,bw*0.44,bh*0.16,3); ctx.fill();
            ctx.fillStyle='#fde68a'; ctx.font=`${bh*0.11}px serif`; ctx.textAlign='center';
            ctx.fillText('🏪', cx, by+bh*0.53); ctx.textAlign='left';
            door('#7c2d12', bw*0.24, bh*0.33); outlineBldg('#ea580c');
        }
    } else if (bid==='pusat_niaga') {
        const imgPs3 = FV_PASAR_IMAGES[3];
        if (imgPs3 && imgPs3.complete && imgPs3.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgPs3,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fefce8');
            ctx.fillStyle='#d4a72c'; ctx.beginPath(); ctx.roundRect(bx+bw*0.1,by+bh*0.05,bw*0.8,bh*0.35,[4,4,0,0]); ctx.fill();
            ctx.fillStyle='#b45309'; ctx.beginPath(); ctx.roundRect(bx,by+bh*0.38,bw,bh*0.62,[0,0,4,4]); ctx.fill();
            ctx.fillStyle='#fbbf24'; ctx.font=`${bh*0.18}px serif`; ctx.textAlign='center';
            ctx.fillText('🏦', cx, by+bh*0.7); ctx.textAlign='left';
            outlineBldg('#b45309');
        }

    // ──────────────── MENARA ────────────────
    } else if (bid==='menara_kecil') {
        const imgMn1 = FV_MENARA_IMAGES[1];
        if (imgMn1 && imgMn1.complete && imgMn1.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgMn1,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            const mw=bw*0.45, mx2=cx-mw/2;
            ctx.fillStyle='#d1d5db'; ctx.beginPath(); ctx.roundRect(mx2,by+bh*0.25,mw,bh*0.75,3); ctx.fill();
            ctx.fillStyle='#6b7280'; ctx.beginPath(); ctx.moveTo(cx,by); ctx.lineTo(mx2-2,by+bh*0.27); ctx.lineTo(mx2+mw+2,by+bh*0.27); ctx.closePath(); ctx.fill();
            const glCandle=0.5+0.4*Math.sin(t/400);
            ctx.fillStyle=`rgba(254,240,138,${glCandle})`; ctx.beginPath(); ctx.arc(cx,by+bh*0.45,mw*0.2,0,Math.PI*2); ctx.fill();
            outlineBldg('#6b7280');
        }
    } else if (bid==='menara_wilis') {
        const imgMn2 = FV_MENARA_IMAGES[2];
        if (imgMn2 && imgMn2.complete && imgMn2.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgMn2,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            const mw=bw*0.5, mx2=cx-mw/2;
            ctx.fillStyle='#c7d2fe'; ctx.beginPath(); ctx.roundRect(mx2,by+bh*0.2,mw,bh*0.8,3); ctx.fill();
            ctx.fillStyle='#4f46e5'; ctx.beginPath(); ctx.moveTo(cx,by-2); ctx.lineTo(mx2-3,by+bh*0.22); ctx.lineTo(mx2+mw+3,by+bh*0.22); ctx.closePath(); ctx.fill();
            const glW=0.6+0.4*Math.sin(t/350);
            ctx.fillStyle=`rgba(199,210,254,${glW})`; ctx.beginPath(); ctx.arc(cx,by+bh*0.4,mw*0.22,0,Math.PI*2); ctx.fill();
            outlineBldg('#6366f1');
        }
    } else if (bid==='menara_cahaya') {
        const imgMn3 = FV_MENARA_IMAGES[3];
        if (imgMn3 && imgMn3.complete && imgMn3.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgMn3,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            const mw=bw*0.5, mx2=cx-mw/2;
            const mGrd=ctx.createLinearGradient(mx2,by,mx2+mw,by+bh);
            mGrd.addColorStop(0,'#fef9c3'); mGrd.addColorStop(1,'#fbbf24');
            ctx.fillStyle=mGrd; ctx.beginPath(); ctx.roundRect(mx2,by+bh*0.18,mw,bh*0.82,3); ctx.fill();
            ctx.fillStyle='#d97706'; ctx.beginPath(); ctx.moveTo(cx,by-5); ctx.lineTo(mx2-3,by+bh*0.2); ctx.lineTo(mx2+mw+3,by+bh*0.2); ctx.closePath(); ctx.fill();
            outlineBldg('#d97706');
        }

    // ──────────────── ISTANA / LEGACY ────────────────
    } else if (bid==='istana_mini') {
        const imgIs1 = FV_ISTANA_IMAGES[1];
        if (imgIs1 && imgIs1.complete && imgIs1.naturalWidth > 0) {
            // FIX: gambar langsung tanpa crop — sesuaikan ke ukuran slot
            ctx.drawImage(imgIs1, bx, by, bw, bh);
        } else {
            wall('#fef9c3');
            [[bx,by+bh*0.15,bw*0.22],[bx+bw*0.78,by+bh*0.15,bw*0.22]].forEach(([tx2,ty2,tw2])=>{
                ctx.fillStyle='#e2e8f0'; ctx.beginPath(); ctx.roundRect(tx2,ty2,tw2,bh*0.85,2); ctx.fill();
                ctx.fillStyle='#94a3b8'; ctx.beginPath(); ctx.moveTo(tx2,ty2); ctx.lineTo(tx2+tw2/2,by); ctx.lineTo(tx2+tw2,ty2); ctx.closePath(); ctx.fill();
            });
            wall('#fef9c3', bw*0.2, bh*0.28, bw*0.6, bh*0.72, 3);
            roof('#7c3aed', cx, by+bh*0.15, bx+bw*0.18, bx+bw*0.82, by+bh*0.35);
            door('#4c1d95', bw*0.22, bh*0.3, cx-bw*0.11);
            outlineBldg('#7c3aed');
        }
    } else {
        // Default fallback — kotak warna
        const bgC=['#fef3c7','#dbeafe','#f3e8ff','#ffedd5','#fef9c3'];
        const bdC=['#d97706','#2563eb','#9333ea','#ea580c','#ca8a04'];
        const tier=(FAIRY_BUILDINGS[bid]?.tier)||0;
        ctx.fillStyle=bgC[tier]||'#fef3c7';
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,5); ctx.fill();
        ctx.strokeStyle=bdC[tier]||'#d97706'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,5); ctx.stroke();
        ctx.font=`${Math.min(bw,bh)*0.55}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(FAIRY_BUILDINGS[bid]?.emoji||'🏠', cx, by+bh*0.5);
        ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    }

    // Nama bangunan di bawah (semua tipe)
    const bDef=FAIRY_BUILDINGS[bid];
    if (bDef) {
        const nameStr = bDef.name.replace(/^[^\s]+\s/,'').slice(0,14);
        ctx.font=`bold ${Math.max(5,bh*0.095)}px Nunito,sans-serif`;
        const nw2 = ctx.measureText(nameStr).width+6;
        ctx.fillStyle='rgba(0,0,0,0.55)';
        ctx.beginPath(); ctx.roundRect(cx-nw2/2, by+bh+1, nw2, 9, 2); ctx.fill();
        ctx.fillStyle='#fef9c3'; ctx.textAlign='center';
        ctx.fillText(nameStr, cx, by+bh+8);
        ctx.textAlign='left';
    }
    ctx.restore();
}

// ── Pohon Energi — Canvas drawn ──────────────────────────────
function drawFVPohonEnergi(ctx, px, py, TS2, t) {
    ctx.save();
    const cx2=px+TS2, cy2=py+TS2;
    // Akar / tanah
    ctx.fillStyle='rgba(74,222,128,0.2)';
    ctx.beginPath(); ctx.ellipse(cx2, py+TS2*1.9, TS2*1.4, TS2*0.45, 0, 0, Math.PI*2); ctx.fill();
    // Batang
    const trunkGrd = ctx.createLinearGradient(cx2-TS2*0.2, py, cx2+TS2*0.2, py);
    trunkGrd.addColorStop(0,'#5c3d1e'); trunkGrd.addColorStop(0.5,'#7c5c2e'); trunkGrd.addColorStop(1,'#5c3d1e');
    ctx.fillStyle=trunkGrd;
    ctx.beginPath();
    ctx.moveTo(cx2-TS2*0.22, py+TS2*1.8);
    ctx.lineTo(cx2-TS2*0.15, py+TS2*0.7);
    ctx.lineTo(cx2+TS2*0.15, py+TS2*0.7);
    ctx.lineTo(cx2+TS2*0.22, py+TS2*1.8);
    ctx.closePath(); ctx.fill();
    // Kanopi 3 lapis (dari bawah ke atas)
    const sway=Math.sin(t/1200)*2;
    [[TS2*1.15,'#14532d',0],[TS2*1.0,'#15803d',TS2*0.18],[TS2*0.78,'#22c55e',TS2*0.32]].forEach(([r,col,dy3])=>{
        const grd2=ctx.createRadialGradient(cx2+sway,cy2-dy3,0,cx2+sway,cy2-dy3,r);
        grd2.addColorStop(0,col); grd2.addColorStop(1,col+'88');
        ctx.fillStyle=grd2;
        ctx.beginPath(); ctx.arc(cx2+sway, cy2-dy3, r, 0, Math.PI*2); ctx.fill();
    });
    // Partikel debu emas mengambang
    for(let i=0;i<8;i++) {
        const ang=i*Math.PI*2/8+t/2500;
        const r2=TS2*0.7+Math.sin(t/600+i)*TS2*0.25;
        const gl=0.4+0.5*Math.sin(t/500+i*0.7);
        ctx.fillStyle=`rgba(251,191,36,${gl})`;
        ctx.beginPath(); ctx.arc(cx2+sway+Math.cos(ang)*r2, cy2-TS2*0.3+Math.sin(ang)*r2*0.5, 2+Math.sin(t/400+i), 0, Math.PI*2); ctx.fill();
    }
    // Label
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.font='bold 7px Nunito,sans-serif'; ctx.textAlign='center';
    const lw=ctx.measureText('Pohon Energi').width+6;
    ctx.fillRect(cx2-lw/2, py+TS2*2.0, lw, 10);
    ctx.fillStyle='#4ade80'; ctx.fillText('Pohon Energi', cx2, py+TS2*2.08);
    ctx.textAlign='left'; ctx.restore();
}

function drawFairyWorld(ts) {
    if (!fvCtx) return;
    const ctx = fvCtx;
    // Pakai GAME_WIDTH/GAME_HEIGHT (logical size, sudah discale main loop)
    const W = (typeof GAME_WIDTH !== 'undefined') ? GAME_WIDTH : (fvCanvas ? fvCanvas.width : 480);
    const H = (typeof GAME_HEIGHT !== 'undefined') ? GAME_HEIGHT : (fvCanvas ? fvCanvas.height : 270);
    const fv = getFairyVillage();
    const t = ts || performance.now();
    const now = Date.now();

    // ── Sinkronkan fvCam dengan STATE.camera (diupdate main loop) ──
    fvCam.x = STATE.camera.x;
    fvCam.y = STATE.camera.y;

    // ── Sinkronkan fvPlayer dengan STATE.player ──
    fvPlayer.x = STATE.player.x;
    fvPlayer.y = STATE.player.y;

    // ── LABEL WAKTU & MUSIM (screen space - kompensasi kamera) ──────
    const _tod = getFVTimeOfDay();
    const _season = getFVSeason();
    const _todLabel = { pagi:'🌅 Pagi', siang:'☀️ Siang', sore:'🌤️ Sore', senja:'🌇 Senja', malam:'🌙 Malam' };
    ctx.save();
    // Kompensasi translate kamera agar label tetap di pojok kiri atas layar
    ctx.translate(Math.floor(fvCam.x), Math.floor(fvCam.y));
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(6, 6, 170, 22);
    ctx.fillStyle = '#fef9c3';
    ctx.fillText((_todLabel[_tod]||'🌙 Malam') + '  |  ' + _season.label, 10, 10);
    ctx.restore();

    // Viewport culling (berdasarkan fvCam yang sudah sync STATE.camera)
    const visX0 = Math.floor(fvCam.x/TS)-1, visX1 = visX0+Math.ceil(W/TS)+2;
    const visY0 = Math.floor(fvCam.y/TS)-1, visY1 = visY0+Math.ceil(H/TS)+2;

    // Ground tiles — hanya tampil jika kayangan.png TIDAK berhasil dimuat
    if (!(fvBgImage && fvBgImage.complete && fvBgImage.naturalWidth > 0)) {
        for (let ty=Math.max(0,visY0); ty<Math.min(FH,visY1); ty++) {
            for (let tx=Math.max(0,visX0); tx<Math.min(FW,visX1); tx++) {
                const even=(tx+ty)%2===0;
                ctx.fillStyle = even?'#1c3a20':'#1f4024';
                ctx.fillRect(tx*TS, ty*TS, TS, TS);
            }
        }

        // Main path — jalur utama (hanya tanpa bg)
        ctx.fillStyle='#2a1e10';
        for (let tx=0;tx<FW;tx++) ctx.fillRect(tx*TS, Math.floor(FH/2)*TS, TS, TS*2);
        for (let ty=0;ty<FH;ty++) ctx.fillRect(Math.floor(FW/2)*TS, ty*TS, TS*2, TS);

        // Secondary paths
        ctx.fillStyle='#251a0c';
        [8,20,30].forEach(ty=> { for(let tx=0;tx<FW;tx++) ctx.fillRect(tx*TS,ty*TS,TS,TS); });
    }

    // Stars — hanya muncul saat senja & malam (sinkron dunia manusia)
    if (_tod === 'senja' || _tod === 'malam') {
        const _starAlpha = _tod === 'malam' ? 0.55 : 0.25; // senja redup, malam terang
        ctx.fillStyle='rgba(255,255,220,1)';
        for (let i=0;i<80;i++) {
            const sx=((i*173+20)%(FW*TS)), sy=((i*97+10)%(FH*TS));
            const pulse = 0.3+0.5*Math.sin(t/800+i*1.3);
            ctx.globalAlpha=pulse*_starAlpha; ctx.fillRect(sx,sy,2,2);
        }
        ctx.globalAlpha=1;
    }

    // Slot markers (kosong)
    const builtSlots   = new Set((fv.buildings||[]).map(b=>b.slotId));
    const queueSlots   = new Set((fv.buildQueue||[]).map(b=>b.slotId));
    FAIRY_SLOTS.forEach(slot => {
        if (builtSlots.has(slot.id) || queueSlots.has(slot.id)) return;
        ctx.strokeStyle='rgba(167,139,250,0.25)'; ctx.lineWidth=1;
        ctx.setLineDash([3,4]);
        ctx.strokeRect(slot.x*TS+1, slot.y*TS+1, TS*2-2, TS*2-2);
        ctx.setLineDash([]);
    });

    // Bangunan dalam antrian (animasi konstruksi)
    (fv.buildQueue||[]).forEach(({slotId, bid, finishTime}) => {
        const slot = FAIRY_SLOTS.find(s=>s.id===slotId); if (!slot) return;
        const b = FAIRY_BUILDINGS[bid]; if (!b) return;
        const bx=slot.x*TS, by=slot.y*TS, bw=TS*2, bh=TS*2;
        const progress = 1 - Math.max(0, (finishTime-now)/BUILD_DURATION_MS);

        // Background
        ctx.fillStyle='rgba(30,20,10,0.8)';
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,4); ctx.fill();
        ctx.strokeStyle='#f59e0b'; ctx.lineWidth=1.5;
        ctx.setLineDash([4,3]); ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,4); ctx.stroke(); ctx.setLineDash([]);

        // Progress bar
        ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(bx+3,by+bh-8,bw-6,5);
        ctx.fillStyle='#f59e0b'; ctx.fillRect(bx+3,by+bh-8,(bw-6)*progress,5);

        // Emoji + label
        ctx.font=`${TS*0.8}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.globalAlpha=0.5+0.4*Math.sin(t/400);
        ctx.fillText(b.emoji||'🏗️', bx+bw/2, by+bh/2-4);
        ctx.globalAlpha=1;
        ctx.fillStyle='#fbbf24'; ctx.font='6px sans-serif';
        const secsLeft = Math.max(0, Math.ceil((finishTime-now)/1000));
        ctx.fillText(`${secsLeft}s`, bx+bw/2, by+8);
        ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    });

    // ── Dekorasi pohon pinggir peta (render sebelum bangunan) ──
    FV_DECO_TREES.forEach(({x,y},i) => {
        if ((fv.buildings?.length||0) <= i*2) return;
        const sway = Math.sin(t/1500+i)*2;
        const ts2 = TS * 1.5; // pohon dekorasi lebih besar dari tile
        const cx = x*TS + TS*0.5, cy = y*TS + TS*0.5;
        // Batang
        ctx.fillStyle='#7c5c2e';
        ctx.fillRect(cx - ts2*0.06 + sway*0.3, cy + ts2*0.1, ts2*0.12, ts2*0.55);
        // Kanopi 3 lapis lebih besar
        [[0,'#14532d',ts2*0.52],[ts2*0.06,'#15803d',ts2*0.42],[ts2*0.13,'#22c55e',ts2*0.28]].forEach(([dy2,col,r])=>{
            ctx.fillStyle=col;
            ctx.beginPath();
            ctx.arc(cx + sway*0.5, cy - ts2*0.1 + dy2, r, 0, Math.PI*2);
            ctx.fill();
        });
    });

    // Bangunan dirender oleh main loop via drawBuilding — tidak perlu render ulang di sini

    // ── ISTANA PERI — landmark permanen, selalu tampil penuh seperti bangunan lain ──
    {
        const isHitW = TS*3, isHitH = TS*3;
        const isVS   = 2.2;
        const isVW   = isHitW * isVS, isVH = isHitH * isVS;
        const isX    = FV_ISTANA_POS.x * TS, isY = FV_ISTANA_POS.y * TS;
        const isVX   = isX + isHitW/2 - isVW/2;
        const isVY   = isY + isHitH   - isVH; // anchor bawah

        const imgIs = FV_ISTANA_IMAGES[1];
        if (imgIs && imgIs.complete && imgIs.naturalWidth > 0) {
            ctx.drawImage(imgIs, isVX, isVY, isVW, isVH);
        } else {
            // Fallback canvas — istana megah tanpa efek transparan
            const cx2 = isVX + isVW/2;
            // Badan utama
            ctx.fillStyle = '#fef9c3';
            ctx.beginPath(); ctx.roundRect(isVX + isVW*0.1, isVY + isVH*0.3, isVW*0.8, isVH*0.7, 6); ctx.fill();
            // Menara kiri-kanan
            [[isVX, isVY+isVH*0.15, isVW*0.22],[isVX+isVW*0.78, isVY+isVH*0.15, isVW*0.22]].forEach(([tx3,ty3,tw3])=>{
                ctx.fillStyle = '#e2e8f0';
                ctx.beginPath(); ctx.roundRect(tx3, ty3, tw3, isVH*0.85, 3); ctx.fill();
                ctx.fillStyle = '#7c3aed';
                ctx.beginPath(); ctx.moveTo(tx3,ty3); ctx.lineTo(tx3+tw3/2,isVY); ctx.lineTo(tx3+tw3,ty3); ctx.closePath(); ctx.fill();
            });
            // Atap tengah
            ctx.fillStyle = '#7c3aed';
            ctx.beginPath(); ctx.moveTo(isVX+isVW*0.18,isVY+isVH*0.35); ctx.lineTo(cx2,isVY+isVH*0.1); ctx.lineTo(isVX+isVW*0.82,isVY+isVH*0.35); ctx.closePath(); ctx.fill();
            // Pintu
            ctx.fillStyle = '#4c1d95';
            ctx.beginPath(); ctx.roundRect(cx2 - isVW*0.1, isVY+isVH*0.72, isVW*0.2, isVH*0.28, [4,4,0,0]); ctx.fill();
            // Jendela kiri-kanan
            ctx.fillStyle = 'rgba(200,230,255,0.8)';
            ctx.beginPath(); ctx.roundRect(isVX+isVW*0.2, isVY+isVH*0.45, isVW*0.12, isVH*0.13, 2); ctx.fill();
            ctx.beginPath(); ctx.roundRect(isVX+isVW*0.68, isVY+isVH*0.45, isVW*0.12, isVH*0.13, 2); ctx.fill();
            // Emoji
            ctx.font = `${isVH*0.22}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText('🏰', cx2, isVY + isVH*0.22);
            ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        }

        // Label nama — selalu tampil seperti bangunan lain
        ctx.font = 'bold 9px Nunito,sans-serif';
        const _iLabel = '🏰 Puri Agung Wilis';
        const _iLW = ctx.measureText(_iLabel).width + 10;
        ctx.fillStyle = 'rgba(30,5,60,0.85)';
        ctx.beginPath(); ctx.roundRect(isX + isHitW/2 - _iLW/2, isVY - 16, _iLW, 13, 4); ctx.fill();
        ctx.fillStyle = '#fde68a'; ctx.textAlign = 'center';
        ctx.fillText(_iLabel, isX + isHitW/2, isVY - 5);
        ctx.textAlign = 'left';

        // Tanda seru jika player dekat (sama seperti Pohon Energi)
        const distIs = Math.hypot(fvPlayer.x - (isX + TS), fvPlayer.y - (isY + TS));
        if (distIs < TS * 4) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('!', isX + isHitW/2, isVY - 22);
            ctx.textAlign = 'left';
        }
    }

    // ── Pohon Energi — pakai gambar pohonperi.png, paling besar di peta ──
    const poHitW = TS*3, poHitH = TS*3;
    const poVS = 3.5; // pohon paling besar
    const poVW = poHitW * poVS, poVH = poHitH * poVS;
    const poX = FV_POHON_POS.x*TS, poY = FV_POHON_POS.y*TS;
    const poVX = poX + poHitW/2 - poVW/2;
    const poVY = poY + poHitH - poVH; // anchor bawah
    if (fvPohonImg && fvPohonImg.complete && fvPohonImg.naturalWidth > 0) {
        ctx.drawImage(fvPohonImg, poVX, poVY, poVW, poVH);
    } else {
        // Fallback canvas jika gambar belum load
        drawFVPohonEnergi(ctx, poVX, poVY, poVW/2, t);
    }
    const distP = Math.hypot(fvPlayer.x-(poX+TS), fvPlayer.y-(poY+TS));
    if (distP < TS*3.5) {
        ctx.fillStyle='#fbbf24'; ctx.font='bold 22px sans-serif'; ctx.textAlign='center';
        ctx.fillText('!', poX+poHitW/2, poVY-10);
        ctx.textAlign='left';
    }

    // ── Rara Wilis aura ──
    const raraX=FV_RARA_POS.x*TS, raraY=FV_RARA_POS.y*TS;
    const aura=0.10+0.10*Math.sin(t/500);
    const raraGrd = ctx.createRadialGradient(raraX+TS,raraY+TS,0,raraX+TS,raraY+TS,TS*2);
    raraGrd.addColorStop(0,`rgba(167,139,250,${aura*2})`);
    raraGrd.addColorStop(1,'rgba(167,139,250,0)');
    ctx.fillStyle=raraGrd; ctx.beginPath();
    ctx.arc(raraX+TS, raraY+TS, TS*2, 0, Math.PI*2); ctx.fill();

    // ── Update NPC runtime positions & collect all Y-sorted drawables ──
    // Init NPC runtime jika belum ada
    const _fvMapNpcs = (typeof maps!=='undefined' && maps['fairyVillage']) ? maps['fairyVillage'].npcs : [];
    _fvMapNpcs.forEach(n => {
        if (!fvNpcRuntime[n.id]) {
            fvNpcRuntime[n.id] = {
                px: n.x * TS,
                py: n.y * TS,
                vx: (n.vx||0) * TS * 0.015,
                vy: (n.vy||0) * TS * 0.015,
                facing: 'down',
                timer: Math.random()*200
            };
        }
    });
    // Update wander NPCs
    const _fvPx = typeof fvPlayer !== 'undefined' ? fvPlayer.x : -9999;
    const _fvPy = typeof fvPlayer !== 'undefined' ? fvPlayer.y : -9999;
    _fvMapNpcs.forEach(n => {
        if (n.type !== 'wander') return;
        const rt = fvNpcRuntime[n.id];
        if (!rt) return;

        // FIX: Stop NPC saat player dekat (radius TS*2.5) — sama seperti NPC darat main game
        const _nCX = rt.px + 19, _nCY = rt.py + 29;
        const _distToPlayer = Math.hypot(_fvPx + 10 - _nCX, _fvPy + 10 - _nCY);
        if (_distToPlayer < TS * 2.5) {
            rt.vx = 0; rt.vy = 0; // berhenti
            n._rtx = rt.px / TS; n._rty = rt.py / TS;
            return;
        }

        rt.timer = (rt.timer||0) - 1;
        if (rt.timer <= 0) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 0.3 + Math.random()*0.4;
            rt.vx = Math.cos(angle)*spd;
            rt.vy = Math.sin(angle)*spd;
            rt.timer = 80 + Math.random()*160;
            if (Math.abs(rt.vx) > Math.abs(rt.vy)) rt.facing = rt.vx>0?'right':'left';
            else rt.facing = rt.vy>0?'down':'up';
        }
        const nx = rt.px + rt.vx;
        const ny = rt.py + rt.vy;
        // Bounce di batas peta
        rt.px = Math.max(TS, Math.min((FW-3)*TS, nx));
        rt.py = Math.max(TS, Math.min((FH-3)*TS, ny));
        if (nx<=TS || nx>=(FW-3)*TS) { rt.vx *= -1; rt.facing = rt.vx>0?'right':'left'; }
        if (ny<=TS || ny>=(FH-3)*TS) { rt.vy *= -1; rt.facing = rt.vy>0?'down':'up'; }
        n._rtx = rt.px / TS;
        n._rty = rt.py / TS;
    });

    // ── Y-sorted draw: Bangunan + NPC map + fairies + player ──
    const _drawables = [];

    // ── BANGUNAN: masuk ke Y-sort agar player bisa di depan/belakang bangunan ──
    const _fvMap = maps['fairyVillage'];
    if (_fvMap && _fvMap.buildings) {
        _fvMap.buildings.forEach(b => {
            if (typeof b.y !== 'number') return;
            // sortY = kaki bangunan (baris tile paling bawah)
            const sortY = (b.y + b.h) * TS;
            _drawables.push({ sortY, type: 'fv_building', b });
        });
    }

    // NPC dari maps['fairyVillage'] (Rara Wilis, peri kecil)
    _fvMapNpcs.forEach(n => {
        const rt = fvNpcRuntime[n.id];
        const px_ = rt ? rt.px : n.x * TS;
        const py_ = rt ? rt.py : n.y * TS;
        // Ukuran NPC sama dengan map utama: 38x58
        const nW = n.w || 38, nH = n.h || 58;
        _drawables.push({ sortY: py_ + nH, type:'npc', n, px:px_, py:py_, nW, nH, rt });
    });

    // Peri wandering (dari fv.fairies)
    // Skip peri default (t1–t5: Rara Wilis, Wening, Sekar, Bening, Juna)
    // karena mereka sudah dirender sebagai NPC peta (maps['fairyVillage'].npcs)
    const _DEFAULT_FAIRY_IDS = ['t1','t2','t3','t4','t5'];
    fv.fairies.forEach((f,i)=>{
        if (_DEFAULT_FAIRY_IDS.includes(f.id)) return; // sudah jadi NPC peta, skip
        if (!fvNpcRuntime['fairy_'+f.id]) {
            fvNpcRuntime['fairy_'+f.id] = {
                px: (8+i*9)*TS + (Math.random()-0.5)*TS*4,
                py: (5+i%5*7)*TS + (Math.random()-0.5)*TS*3,
                vx: (Math.random()-0.5)*0.5,
                vy: (Math.random()-0.5)*0.5,
                timer: Math.random()*180,
                facing: 'down',
                stopped: false
            };
        }
        const rt = fvNpcRuntime['fairy_'+f.id];
        // FIX: Stop saat player dekat (sama seperti NPC darat main game)
        const _bfCX = rt.px + 19, _bfCY = rt.py + 29;
        const _bfDist = Math.hypot(_fvPx + 10 - _bfCX, _fvPy + 10 - _bfCY);
        if (_bfDist < TS * 2.5) {
            rt.vx = 0; rt.vy = 0;
        } else {
            rt.timer = (rt.timer||0) - 1;
            if (rt.timer <= 0) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 0.25 + Math.random()*0.35;
                rt.vx = Math.cos(angle)*spd; rt.vy = Math.sin(angle)*spd;
                rt.timer = 100 + Math.random()*200;
                rt.facing = Math.abs(rt.vx)>Math.abs(rt.vy) ? (rt.vx>0?'right':'left') : (rt.vy>0?'down':'up');
            }
            const _bfNx = rt.px+rt.vx, _bfNy = rt.py+rt.vy;
            rt.px = Math.max(TS, Math.min((FW-3)*TS, _bfNx));
            rt.py = Math.max(TS, Math.min((FH-3)*TS, _bfNy));
            if (_bfNx<=TS || _bfNx>=(FW-3)*TS) { rt.vx*=-1; rt.facing = rt.vx>0?'right':'left'; }
            if (_bfNy<=TS || _bfNy>=(FH-3)*TS) { rt.vy*=-1; rt.facing = rt.vy>0?'down':'up'; }
        }
        _drawables.push({ sortY: rt.py+TS*1.2, type:'fairy', f, px:rt.px, py:rt.py });
    });

    // FIX: Masukkan player ke _drawables agar Y-sort bersama peri & NPC
    // Kaki player ada di: p.y + p.h/2 + 12 = p.y + 22
    _drawables.push({
        sortY: fvPlayer.y + 22,
        type: 'player_fv',
        px: fvPlayer.x,
        py: fvPlayer.y
    });

    // Sort by Y — player, peri, NPC semua diurutkan bersama
    _drawables.sort((a,b2) => a.sortY - b2.sortY);

    // Draw semua termasuk player
    _drawables.forEach(d => {
        if (d.type === 'fv_building') {
            // Render bangunan via drawBuilding (fungsi utama — sama persis map utama)
            if (typeof drawBuilding === 'function') drawBuilding(ctx, d.b);
            return;
        } else if (d.type === 'player_fv') {
            // Render player dengan drawPlayer — ukuran & animasi identik map utama (38×58)
            if (typeof drawPlayer === 'function') drawPlayer(ctx, STATE.player);
            return;
        } else if (d.type === 'npc') {
            const {n, px:nx2, py:ny2, nW, nH} = d;
            // FIX: Skip NPC yang ditandai noRender (misal trigger invisible istana)
            if (n.noRender) return;
            // Shadow di tanah (tetap di posisi kaki, tidak ikut animasi)
            ctx.fillStyle='rgba(0,0,0,0.3)';
            ctx.beginPath(); ctx.ellipse(nx2+nW/2, ny2+nH-5, nW/3, 4, 0, 0, Math.PI*2); ctx.fill();
            // Animasi nafas saja (sama seperti NPC darat di main game) — TIDAK melayang
            const _fvBreathe = 1 + Math.sin(Date.now()/300) * 0.015;
            // Load sprite
            if (!n.imgSrc && n.sprite) n.imgSrc = n.sprite;
            if (!n.loadedImg) {
                n.loadedImg = new Image();
                n.loadedImg.src = n.imgSrc || 'images/rarawilis.png';
            }
            if (n.loadedImg.complete && n.loadedImg.naturalWidth>0) {
                ctx.save();
                // Pivot di kaki tengah agar tumbuh ke atas (sama persis main game drawNPC)
                ctx.translate(Math.round(nx2+nW/2), Math.round(ny2+nH-5));
                ctx.scale(1, _fvBreathe);
                ctx.drawImage(n.loadedImg, -nW/2, -nH, nW, nH);
                ctx.restore();
            } else {
                ctx.font=`${nH*0.6}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
                ctx.fillText('🧚', nx2+nW/2, ny2+nH/2);
                ctx.textAlign='left'; ctx.textBaseline='alphabetic';
            }
            // Nametag (posisi tetap, tidak bergerak)
            if (!n.noNameTag && n.name) {
                ctx.font='bold 9px Nunito,sans-serif';
                const _nw2 = ctx.measureText(n.name).width+6;
                ctx.fillStyle='rgba(30,5,60,0.7)';
                ctx.fillRect(nx2+nW/2-_nw2/2, ny2-14, _nw2, 12);
                ctx.fillStyle='#e9d5ff'; ctx.textAlign='center';
                ctx.fillText(n.name, nx2+nW/2, ny2-4);
                ctx.textAlign='left';
            }
            // Sparkle Rara Wilis
            if (n.id==='rara_wilis') {
                const sz=0.4+0.3*Math.sin(t/300);
                ctx.fillStyle=`rgba(255,220,80,${sz})`;
                ctx.font=`${TS*0.7}px serif`; ctx.textAlign='center';
                ctx.fillText('✨', nx2+nW/2, ny2-16);
                ctx.textAlign='left';
            }
        } else if (d.type === 'fairy') {
            const {f, px:fx, py:fy} = d;
            // Animasi nafas saja — TIDAK melayang (sama seperti NPC darat)
            const _fvBreathe2 = 1 + Math.sin(Date.now()/300) * 0.015;
            // Shadow di tanah
            ctx.fillStyle='rgba(0,0,0,0.25)';
            ctx.beginPath(); ctx.ellipse(fx+19, fy+58-5, 13, 4, 0, 0, Math.PI*2); ctx.fill();
            // Sprite peri ukuran 38×58
            const imgSrc3 = _khImg(f);
            const cached3 = fvSpriteCache[imgSrc3];
            if (cached3 && cached3.complete && cached3.naturalWidth>0) {
                ctx.save();
                ctx.translate(Math.round(fx+19), Math.round(fy+53));
                ctx.scale(1, _fvBreathe2);
                ctx.drawImage(cached3, -19, -58, 38, 58);
                ctx.restore();
            } else {
                if (!cached3) { const i2=new Image(); i2.src=imgSrc3; fvSpriteCache[imgSrc3]=i2; }
                ctx.font=`38px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
                ctx.fillText(f.gender==='boy'?'🧚‍♂️':'🧚‍♀️', fx+19, fy+29);
                ctx.textAlign='left'; ctx.textBaseline='alphabetic';
            }
            // Nametag peri (posisi tetap)
            ctx.font='bold 9px Nunito,sans-serif';
            const _fw = ctx.measureText(f.name||'').width+6;
            ctx.fillStyle='rgba(30,5,60,0.7)';
            ctx.fillRect(fx+19-_fw/2, fy-14, _fw, 12);
            ctx.fillStyle='#f9a8d4'; ctx.textAlign='center';
            ctx.fillText(f.name||'', fx+19, fy-4);
            ctx.textAlign='left';
        }
    });

    // Partikel
    fvParticles = fvParticles.filter(p=>p.life>0);
    fvParticles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.06; p.life--;
        ctx.globalAlpha=p.life/p.maxLife;
        ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,3,3);
    });
    ctx.globalAlpha=1;

    // Kunang-kunang — muncul saat senja & malam
    if (_tod === 'senja' || _tod === 'malam') {
        drawFVFireflies(ctx, t);
    }

    // ── PARTIKEL MUSIM — sinkron STATE.season dunia manusia ─────
    drawFVSeasonParticles(ctx, W, H, t, _season);

    // Dialog overlay
    if (fvActiveDialog) drawFVDialog(ctx, W, H);

    // Timer bar (screen space - kompensasi kamera)
    // FIX: drawFVMinimap dihapus — minimap HTML utama (#minimap-container) yang dipakai
    ctx.save();
    ctx.translate(Math.floor(fvCam.x), Math.floor(fvCam.y));
    drawFVBuildTimerBar(ctx, W, fv, now);
    ctx.restore();
}

// ── Timer bar konstruksi ───────────────────────────────────────
function drawFVBuildTimerBar(ctx, W, fv, now) {
    if (!fv.buildQueue || fv.buildQueue.length === 0) return;
    const q = fv.buildQueue[0];
    const b = FAIRY_BUILDINGS[q.bid];
    const prog = Math.min(1, 1-(q.finishTime-now)/BUILD_DURATION_MS);
    const secsLeft = Math.max(0, Math.ceil((q.finishTime-now)/1000));

    ctx.fillStyle='rgba(0,0,0,0.65)';
    ctx.beginPath(); ctx.roundRect(10,10,200,22,6); ctx.fill();
    ctx.fillStyle='#f59e0b'; ctx.fillRect(12,18,Math.floor(196*prog),8);
    ctx.fillStyle='#1a0a00'; ctx.fillRect(12+Math.floor(196*prog),18,196-Math.floor(196*prog),8);
    ctx.fillStyle='#fde68a'; ctx.font='bold 9px sans-serif';
    ctx.fillText(`🏗️ ${b?.emoji||''} ${b?.name||'Bangunan'} — ${secsLeft}s lagi`, 14, 15);
}

// ── Dialog ─────────────────────────────────────────────────────
function drawFVDialog(ctx, W, H) {
    const d = fvActiveDialog;
    const bx=8, by=H-175, bw=W-16, bh=167;
    ctx.fillStyle='rgba(6,3,18,0.96)';
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,10); ctx.fill();
    ctx.strokeStyle='#7c3aed'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,10); ctx.stroke();

    // Portrait
    ctx.fillStyle='rgba(124,58,237,0.2)';
    ctx.beginPath(); ctx.roundRect(bx+8,by+8,48,48,8); ctx.fill();
    ctx.font='26px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(d.portrait||'👸', bx+32, by+32);

    // Name
    ctx.fillStyle='#fde68a'; ctx.font='bold 11px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    ctx.fillText(d.name, bx+62, by+20);

    // Text wrap
    ctx.fillStyle='#e2e8f0'; ctx.font='10px sans-serif';
    wrapFVText(ctx, d.text, bw-70).slice(0,6).forEach((ln,i)=> ctx.fillText(ln, bx+62, by+34+i*13));

    // Options
    if (d.options?.length) {
        d.options.forEach((opt,i)=>{
            const oy=by+bh-28+(i-d.options.length+1)*22;
            ctx.fillStyle=`rgba(124,58,237,0.3)`;
            ctx.beginPath(); ctx.roundRect(bx+8,oy,bw-16,18,5); ctx.fill();
            ctx.strokeStyle='rgba(167,139,250,0.4)'; ctx.lineWidth=0.8;
            ctx.beginPath(); ctx.roundRect(bx+8,oy,bw-16,18,5); ctx.stroke();
            ctx.fillStyle='#c4b5fd'; ctx.font='bold 9px sans-serif';
            ctx.fillText('▶ '+opt.text, bx+14, oy+13);
        });
    } else {
        ctx.fillStyle='#64748b'; ctx.font='9px sans-serif'; ctx.textAlign='right';
        ctx.fillText('Tap untuk lanjut ▶', bx+bw-10, by+bh-8);
        ctx.textAlign='left';
    }
}

function wrapFVText(ctx, text, maxW) {
    const lines=[];
    text.split('\n').forEach(para=>{
        if (!para.trim()) { lines.push(''); return; }
        const words=para.split(' '); let cur='';
        words.forEach(w=>{ const t=cur?cur+' '+w:w; if(ctx.measureText(t).width>maxW){ if(cur)lines.push(cur); cur=w; } else cur=t; });
        if(cur) lines.push(cur);
    });
    return lines;
}

function tapFVDialog(e) {
    if (!fvActiveDialog) return;
    const d=fvActiveDialog;
    if (d.options?.length) {
        const W=fvCanvas.width, H=fvCanvas.height;
        const bx=8, by=H-175, bw=W-16, bh=167;
        const rect=fvCanvas.getBoundingClientRect();
        const tapX=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
        const tapY=(e.touches?e.touches[0].clientY:e.clientY)-rect.top;
        d.options.forEach((opt,i)=>{
            const oy=by+bh-28+(i-d.options.length+1)*22;
            if(tapX>bx+8&&tapX<bx+bw-8&&tapY>oy&&tapY<oy+18){ fvActiveDialog=null; opt.action?.(); }
        });
    } else { fvActiveDialog=null; }
    e.stopPropagation();
}

function showFVDialog(name,text,options,portrait) {
    // Gunakan sistem dialogue utama (showDialogue) karena fairy village
    // berjalan di atas game canvas utama, bukan modal terpisah.
    if (typeof showDialogue === 'function') {
        // Tentukan portrait image berdasarkan nama/portrait parameter
        let imgSrc = null;
        if (portrait === '👸' || name.includes('RARA') || name.includes('Rara')) {
            imgSrc = 'images/rarawilis.png';
        } else if (portrait === '🌳' || name.includes('POHON')) {
            imgSrc = 'images/pohonperi.png';
        } else if (name === 'WENING' || name === 'Wening') {
            imgSrc = 'images/wening.png';
        } else if (name === 'SEKAR' || name === 'Sekar') {
            imgSrc = 'images/sekar.png';
        } else if (name === 'BENING' || name === 'Bening') {
            imgSrc = 'images/bening.png';
        } else if (name === 'JUNA' || name === 'Juna') {
            imgSrc = 'images/juna.png';
        } else if (portrait === '🧚‍♀️' || name.includes('WIDADARI')) {
            imgSrc = 'images/rarawilis.png';
        }
        const opts = (options||[]).map(o=>({
            text: o.text,
            action: ()=>{
                if (typeof closeDialogue === 'function') closeDialogue();
                if (typeof o.action === 'function') setTimeout(()=>o.action(), 30);
            }
        }));
        if (opts.length===0) opts.push({text:'Tutup', action: ()=>{ if(typeof closeDialogue==='function') closeDialogue(); }});
        showDialogue(name, text, opts, imgSrc);
        return;
    }
    // Fallback lama (hanya aktif jika fairy-village-modal dipakai)
    fvActiveDialog={name,text,options:options||null,portrait:portrait||'👸'};
}

// ─────────────────────────────────────────────────────────────
// DIALOG NPC PERI KECIL — FAIRY VILLAGE
// ─────────────────────────────────────────────────────────────
function openFairyNPCDialog_fv_wening() {
    showFVDialog('WENING', `Selamat datang kembali! 🌿\n\nAku Wening, Widadari penjaga hutan Wilis.\n\nDulu aku merawat ribuan pohon di lereng Gunung Wilis. Sekarang aku baru bisa merawat yang tersisa... tapi dengan bantuanmu, hutan itu perlahan tumbuh kembali.\n\n🌲 Pohon-pohon muda sudah mulai bertunas di sisi utara. Aku merasakan energinya!`,
        [{ text: 'Teruskan perjuanganmu, Wening!', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } },
         { text: 'Kembali', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } }],
        'images/wening.png');
}
function openFairyNPCDialog_fv_sekar() {
    showFVDialog('SEKAR', `Hei! 🌸\n\nNamaku Sekar — aku peri bunga. Tugasku memastikan setiap bunga di Kahyangan Wilis mekar pada waktunya.\n\nSejak Kahyangan hampir punah, bunganya pun layu. Tapi lihat — kenanga dan melati di sudut selatan mulai mekar lagi!\n\n🌺 Aku sedang menanam taman bunga baru di dekat Pohon Beringin. Doakan berhasil ya!`,
        [{ text: 'Taman bungamu pasti indah, Sekar!', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } },
         { text: 'Kembali', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } }],
        'images/sekar.png');
}
function openFairyNPCDialog_fv_bening() {
    showFVDialog('BENING', `Oh! Kamu mau bicara denganku? 💧\n\nAku Bening... Widadari air termuda di sini. Aku lahir saat Kahyangan sudah mulai pudar, jadi aku tidak pernah tahu Kahyangan yang penuh.\n\nTapi Rara Wilis dan Kak Wening sering bercerita betapa indahnya dulu...\n\n💙 Kalau Kahyangan pulih sepenuhnya, aku ingin membuka kembali Sendang Suci Selatan!`,
        [{ text: 'Aku yakin kamu bisa, Bening!', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } },
         { text: 'Kembali', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } }],
        'images/bening.png');
}
function openFairyNPCDialog_fv_juna() {
    showFVDialog('JUNA', `Hei, manusia! Jarang ada yang mau ngobrol sama peri cowok. 😄\n\nAku Juna — peri angin. Tugasku membawa serbuk bunga dan benih pohon ke seluruh penjuru Wilis lewat hembusan angin.\n\nWaktu longsor terjadi, aku sedang terbang jauh... jadi aku selamat. Tapi aku merasa bersalah tidak bisa menyelamatkan yang lain.\n\n🌬️ Kini aku kembali untuk membantu membangun Kahyangan bersama kalian!`,
        [{ text: 'Jangan menyesal, Juna. Kamu ada sekarang!', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } },
         { text: 'Kembali', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } }],
        'images/juna.png');
}

// ═══════════════════════════════════════════════════════════════
// DIALOG RARA WILIS
// ═══════════════════════════════════════════════════════════════
function openRaraWilisDialog() {
    fvActiveDialog = null;
    STATE.screen = 'play';
    const fv = getFairyVillage(), stats = getFairyVillageStats(fv), res = fv.resources;
    const bCount = (fv.buildings||[]).length;
    const qCount = (fv.buildQueue||[]).length;
    const totalBuilt = bCount;

    // ── Tentukan FASE cerita berdasarkan progress ──────────────────
    // Fase 0 = kunjungan pertama (sebelum bangun apapun)
    // Fase 1 = mulai membangun (1-3 bangunan)
    // Fase 2 = berkembang (4-9 bangunan)
    // Fase 3 = hampir pulih (10-15 bangunan)
    // Fase 4 = pulih sepenuhnya (sylvariaQuestComplete)

    const fase = STATE.player.sylvariaQuestComplete ? 4
               : totalBuilt === 0 ? 0
               : totalBuilt <= 3  ? 1
               : totalBuilt <= 9  ? 2
               : 3;

    // ── Salam pembuka sesuai fase ──────────────────────────────────
    const salamBuka = [
        // Fase 0 — Pertama kali, penuh kekhawatiran
        `...Akhirnya ada manusia yang bisa melihat kami.\n\nAku Rara Wilis. Ratu terakhir para Widadari Gunung Wilis.\n\nKahyangan kami... hampir punah. Ratusan tahun yang lalu, bencana besar melanda — tanah longsor raksasa menghancurkan hampir seluruh Kahyangan. Pohon Beringin Agung kami — sumber hidup para Widadari — retak parah.\n\nPara Widadari melarikan diri. Banyak yang tidak selamat. Kini tersisa segelintir saja.\n\nAku tidak punya siapa-siapa lagi. Kecuali... kamu.`,

        // Fase 1 — Ada harapan tipis
        `Kamu kembali... ${fv.fairies.length > 0 ? 'dan kamu membawa Widadari baru!' : ''}\n\nBencana longsor itu meluluhlantakkan tanah kami dalam semalam. Aku masih ingat suara pohon-pohon tumbang, kristal Brantas yang hancur berkeping...\n\nTapi kini, dengan ${totalBuilt} bangunan yang mulai berdiri, ada secercah harapan.\n\n✨ Debu: ${res.debu}  💎 Kristal: ${res.kristal}  🌟 Cahaya: ${res.cahaya}  🍽️ Makanan: ${res.makanan||0}\n👥 Widadari: ${fv.fairies.length}/${stats.totalCap}`,

        // Fase 2 — Mulai bangkit
        `${fv.fairies.length >= 3 ? 'Suara tawa Widadari kecil sudah terdengar lagi...' : 'Kahyangan perlahan bernapas kembali.'}\n\nDulunya tempat ini ramai. Ribuan Widadari menjaga keseimbangan alam Jawa Timur — peri hutan merawat pohon-pohon Wilis, peri bunga membantu penyerbukan ladang manusia.\n\nBencana itu memutus semuanya. Manusia pun lupa kami ada.\n\nKini ada ${totalBuilt} bangunan. Kami mulai bangkit!\n\n✨ ${res.debu}  💎 ${res.kristal}  🌟 ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,

        // Fase 3 — Mendekati pulih
        `Kamu sungguh... luar biasa.\n\nAku tidak menyangka Kahyangan Wilis bisa seramai ini lagi. ${totalBuilt} bangunan sudah berdiri. Para Widadari bernyanyi lagi setiap pagi.\n\nHanya satu hal lagi yang kubutuhkan — energi penuh untuk membangkitkan Pohon Beringin Agung ke kondisi sempurna.\n\nBantu aku menyelesaikan ini. Untuk Wilis. Untuk alam.\n\n✨ ${res.debu}  💎 ${res.kristal}  🌟 ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,

        // Fase 4 — Selesai, rasa syukur
        `Kahyangan Wilis telah pulih sepenuhnya! 🌳✨\n\nPohon Beringin Agung berdaun lebat lagi. Para Widadari menari di antara sinar bulan Wilis.\n\nKamu adalah manusia pertama dalam ratusan tahun yang benar-benar peduli.\n\nKahyangan ini akan terus berdoa untukmu.\n\n✨ ${res.debu}  💎 ${res.kristal}  🌟 ${res.cahaya}  👥 ${fv.fairies.length}`,
    ][fase];

    // ── Susun pilihan menu — simpel, buka modal untuk detail ──────
    const opts = [];
    opts.push({ text: '🏰 Kelola Kahyangan Wilis', action: () => {
        if (typeof closeDialogue === 'function') closeDialogue();
        setTimeout(khOpen, 30);
    }});
    // Konversi Gold → Debu Peri (Serbuk Wilis)
    opts.push({ text: `💰 Tukar Gold → Debu Peri (${STATE.player.gold||0}G)`, action: () => {
        fvActiveDialog = null; STATE.screen = 'play';
        setTimeout(() => {
            const gold = STATE.player.gold || 0;
            const convRates = [
                { g:10,  d:5,  label:'10 Gold → 5 Energi' },
                { g:50,  d:30, label:'50 Gold → 30 Energi' },
                { g:100, d:70, label:'100 Gold → 70 Energi (Bonus!)' },
                { g:500, d:400,label:'500 Gold → 400 Energi (Super Bonus!)' },
            ];
            const available = convRates.filter(r => gold >= r.g);
            if (!available.length) {
                showFVDialog('💰 PENUKARAN ENERGI',
                    `Gold kamu: ${gold}\n\nMinimal butuh 10 Gold untuk ditukar.\n\n✨ Debu Peri (Serbuk Wilis) digunakan untuk membangun & memberi makan para Widadari.\n\n💡 Kumpulkan Gold dari berjualan di kota Arjosari!`,
                    [{ text: 'Mengerti', action: openRaraWilisDialog }],
                    'images/rarawilis.png');
                return;
            }
            const convOpts = available.map(r => ({
                text: `💱 ${r.label}`,
                action: () => {
                    fvActiveDialog=null; STATE.screen='play';
                    setTimeout(()=>{
                        if ((STATE.player.gold||0) >= r.g) {
                            STATE.player.gold -= r.g;
                            getFairyVillage().resources.debu = (getFairyVillage().resources.debu||0) + r.d;
                            updateHUD && updateHUD();
                            showToast(`💱 ${r.g} Gold → +${r.d} ✨ Debu Peri!`);
                        } else { showToast('❌ Gold tidak cukup!'); }
                        openRaraWilisDialog();
                    }, 30);
                }
            }));
            convOpts.push({ text: '🔙 Kembali', action: openRaraWilisDialog });
            showFVDialog('💰 PENUKARAN ENERGI',
                `Gold kamu: ${gold} 💰\nDebu Peri: ${getFairyVillage().resources.debu} ✨\n\n✨ Debu Peri (Serbuk Wilis) adalah sumber daya utama Kahyangan.\nDigunakan untuk membangun bangunan dan memberi makan peri.\n\nPilih jumlah penukaran:`,
                convOpts, 'images/rarawilis.png');
        }, 30);
    }});
    if (fase <= 1) {
        opts.push({ text: '❓ Apa yang terjadi dulu...?', action: () => {
            showFVDialog('RARA WILIS',
                `Seratus tahun yang lalu, manusia-manusia tamak mulai menebang hutan Gunung Wilis tanpa henti.\n\nKeseimbangan alam rusak. Hujan tanpa musim. Tanah kehilangan akarnya.\n\nLalu... malam itu tiba. Longsor terbesar sepanjang sejarah Wilis. Setengah Kahyangan terhapus dalam satu malam.\n\nPohon Beringin Agung — pohon tertua yang menjadi sumber kekuatan kami — terluka parah. Kristal Brantas yang menyimpan energi Kahyangan hancur berserakan.\n\nPara Widadari yang tersisa hanya bisa menangis dan menyaksikan rumah kami runtuh.\n\nKini hanya kamu yang bisa membantu kami membangun kembali.`,
                [{ text: 'Aku akan membantu...', action: openRaraWilisDialog }],
                'images/rarawilis.png'
            );
        }});
    }
    if (fase >= 2) {
        opts.push({ text: '🌿 Cerita tentang Kahyangan...', action: () => {
            const lore = ['','',
                `Kahyangan Wilis terbentang dari puncak Gunung Wilis hingga lembah Brantas di timur.\n\nDulu ada tiga penjuru Kahyangan:\n🌲 Hutan Wilis Utara — dijaga peri hutan\n🌸 Taman Bunga Tengah — dijaga peri bunga\n💧 Sendang Suci Selatan — dijaga peri air\n\nWening, Sekar, dan Bening — tiga Widadari terakhir yang selamat — bersamaku hingga hari ini.`,
                `Pohon Beringin Agung itu bukan sekadar pohon biasa.\n\nIa menyerap energi dari bumi, langit, dan hati manusia yang tulus.\n\nKini dengan bantuanmu, sinarnya mulai kembali. Para Widadari merasakan kehangatan yang sudah lama hilang.`,
                `Kahyangan Wilis kini bersinar kembali seperti ratusan tahun lalu.\n\nTerima kasih... kisah ini akan dikenang para Widadari sepanjang masa.`
            ][fase] || 'Kahyangan Wilis kini bersinar penuh! ✨\nTerima kasih telah memulihkan tempat suci ini.';
            showFVDialog('RARA WILIS', lore, [{ text: 'Aku mengerti...', action: openRaraWilisDialog }], 'images/rarawilis.png');
        }});
    }
    opts.push({ text: '🙏 Terima kasih atas informasinya', action: () => {
        if (typeof closeDialogue === 'function') closeDialogue();
        // Pesan balasan Rara Wilis saat pamit
        const pamitRara = fase >= 4
            ? 'showToast("✨ Kahyangan Wilis selalu menantimu kembali. Terima kasih, Pahlawan Wilis! 🌸")'
            : fase >= 2
            ? 'showToast("🌿 Perjalananmu membawa harapan bagi kami. Sampai jumpa lagi! 🙏")'
            : 'showToast("🌱 Terima kasih sudah mendengarkan kisah kami. Kami menunggumu kembali... ✨")';
        setTimeout(function() { eval(pamitRara); }, 200);
    }});
    opts.push({ text: '🚪 Tinggalkan Kahyangan', action: () => {
        // Tutup dialogue wrapper dulu baru close fairy village
        if (typeof closeDialogue === 'function') closeDialogue();
        setTimeout(() => closeFairyVillage(), 40);
    }});

    // TEST MODE: tombol test kelahiran — muncul jika isTestMode ATAU freeRoamMode aktif
    if (fv.isTestMode || STATE.freeRoamMode) {
        opts.push({ text: '🥚 [TEST] Lahirkan Peri Baru', action: testFairyBirth });
    }

    showFVDialog('RARA WILIS', salamBuka, opts, 'images/rarawilis.png');
}

// ═══════════════════════════════════════════════════════════════
// DIALOG ISTANA PERI — Puri Agung Wilis
// Dipanggil saat player mendekati & berinteraksi dengan istana peri
// ═══════════════════════════════════════════════════════════════
function openIstanaDialog() {
    const fv = getFairyVillage();
    const stats = getFairyVillageStats(fv);
    const res = fv.resources;
    const bCount = (fv.buildings || []).length;
    const fase = STATE.player.sylvariaQuestComplete ? 4
               : bCount === 0 ? 0
               : bCount <= 3  ? 1
               : bCount <= 9  ? 2
               : 3;

    const narasiIstana = [
        // Fase 0 — Istana masih sepi
        `Puri Agung Wilis... Dulunya tempat ini penuh suara keceriaan para Widadari.\n\nKini hanya ada angin yang berhembus melewati lorong-lorong sepinya.\n\nBantu kami membangun kembali Kahyangan ini, dan Puri ini akan ramai lagi! 🏰`,
        // Fase 1 — Mulai ada harapan
        `Langkah pertama sudah kamu ambil! ${bCount} bangunan sudah berdiri.\n\nPuri ini mulai merasakan kehangatan. Para Widadari mulai mempercayaimu.\n\n✨ Debu: ${res.debu}  💎 Kristal: ${res.kristal}\n🌟 Cahaya: ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,
        // Fase 2 — Berkembang
        `${bCount} bangunan berdiri megah! Kahyangan semakin hidup.\n\nDari sinilah para Widadari mengatur tugas dan menjaga keseimbangan alam Wilis.\n\n✨ Debu: ${res.debu}  💎 Kristal: ${res.kristal}\n🌟 Cahaya: ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,
        // Fase 3 — Hampir pulih
        `Luar biasa! Puri ini kembali bersinar setelah sekian lama gelap.\n\n${bCount} bangunan sudah berdiri. Hanya sedikit lagi untuk pemulihan sempurna!\n\n✨ Debu: ${res.debu}  💎 Kristal: ${res.kristal}\n🌟 Cahaya: ${res.cahaya}  👥 ${fv.fairies.length}/${stats.totalCap}`,
        // Fase 4 — Pulih sempurna
        `🌟 Kahyangan Wilis telah pulih sepenuhnya! 🌟\n\nPuri Agung Wilis kembali menjadi pusat kebudayaan para Widadari.\n\nKamu akan selalu dikenang dalam sejarah Kahyangan, Penjaga Wilis! ✨`,
    ][fase];

    const opts = [];
    // Aksi utama: Kelola Kahyangan (buka modal manajemen penuh)
    opts.push({ text: '🏰 Kelola Kahyangan Wilis', action: () => {
        fvActiveDialog = null;
        setTimeout(khOpen, 30);
    }});
    // Shortcut: Lihat statistik langsung
    opts.push({ text: '📊 Lihat Statistik Kahyangan', action: () => {
        fvActiveDialog = null;
        setTimeout(() => { khOpen(); setTimeout(() => khTab('statistik'), 80); }, 30);
    }});
    // Shortcut: Lihat daftar peri
    opts.push({ text: '🧚 Daftar Para Widadari', action: () => {
        fvActiveDialog = null;
        setTimeout(() => { khOpen(); setTimeout(() => khTab('peri'), 80); }, 30);
    }});
    // Kembali
    opts.push({ text: '🚪 Kembali', action: () => { fvActiveDialog = null; } });

    showFVDialog('🏰 PURI AGUNG WILIS', narasiIstana, opts, 'images/istanaperi.png');
}


const KH_FIXED = ['t1','t2','t3','t4','t5'];
let _khIdx = 0;

function khOpen() {
    if (typeof closeDialogue === 'function') closeDialogue();
    fvActiveDialog = null;
    const m = document.getElementById('kh-modal');
    if (!m) return;
    m.classList.add('open');
    STATE.screen = 'dialogue';
    _khIdx = 0;
    _khRefRes();
    khTab('peri');
}
function khClose() {
    const m = document.getElementById('kh-modal');
    if (m) m.classList.remove('open');
    STATE.screen = 'play';
}

function _khRefRes() {
    const fv = getFairyVillage(), st = getFairyVillageStats(fv);
    const g = id => document.getElementById(id);
    const s = (id, v) => { const el = g(id); if (el) el.textContent = v; };
    s('khr-debu',   fv.resources.debu   || 0);
    s('khr-kristal',fv.resources.kristal|| 0);
    s('khr-cahaya', fv.resources.cahaya || 0);
    s('khr-makan',  fv.resources.makanan|| 0);
    s('khr-pop',    `${fv.fairies.length}/${st.totalCap}`);
    s('kh-fcount',  fv.resources.makanan|| 0);
}

// ── Tooltip helper untuk tab Statistik ──────────────────────────
function _fvTip(id, text) {
    // Tampilkan/sembunyikan tooltip inline di bawah kartu
    const el = document.getElementById('fvtip-' + id);
    if (!el) return;
    const vis = el.style.display === 'block';
    // Sembunyikan semua tooltip dulu
    document.querySelectorAll('.fvstat-tip').forEach(t => t.style.display = 'none');
    if (!vis) el.style.display = 'block';
}

function _fvStatCard(id, emoji, label, value, valColor, borderColor, tipText) {
    return `<div onclick="_fvTip('${id}')" style="cursor:pointer;background:#fff;border-radius:8px;padding:5px 10px;border:1px solid ${borderColor};display:flex;justify-content:space-between;align-items:center;flex-direction:column;gap:2px;position:relative;">
      <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
        <span style="font-size:12px;">${emoji} ${label}</span>
        <div style="display:flex;align-items:center;gap:4px;">
          <b style="font-size:13px;color:${valColor};">${value}</b>
          <span style="font-size:10px;color:#a78bfa;opacity:0.8;">ⓘ</span>
        </div>
      </div>
      <div id="fvtip-${id}" class="fvstat-tip" style="display:none;margin-top:4px;width:100%;background:#1e1b4b;color:#e9d5ff;font-size:10px;border-radius:6px;padding:5px 8px;line-height:1.5;text-align:left;">${tipText}</div>
    </div>`;
}

function _fvStatCardCenter(id, emoji, label, value, valColor, borderColor, tipText) {
    return `<div onclick="_fvTip('${id}')" style="cursor:pointer;background:#fff;border:1px solid ${borderColor};border-radius:8px;padding:6px;text-align:center;position:relative;">
      <div style="font-size:18px;font-weight:800;color:${valColor};">${value}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:3px;">
        <div style="font-size:10px;color:#6b7280;">${label}</div>
        <span style="font-size:10px;color:#a78bfa;opacity:0.8;">ⓘ</span>
      </div>
      <div id="fvtip-${id}" class="fvstat-tip" style="display:none;margin-top:4px;background:#1e1b4b;color:#e9d5ff;font-size:10px;border-radius:6px;padding:5px 8px;line-height:1.5;text-align:left;">${tipText}</div>
    </div>`;
}

function _khRenderStatistik() {
    const fv  = getFairyVillage();
    const st  = getFairyVillageStats(fv);
    const el  = document.getElementById('kh-stat-content');
    if (!el) return;
    const bCount   = (fv.buildings||[]).length;
    const qCount   = (fv.buildQueue||[]).length;
    const topFairy = (fv.fairies||[]).slice().sort((a,b)=>(b.level||1)-(a.level||1))[0];
    const avgLvl   = (fv.fairies||[]).length
        ? ((fv.fairies||[]).reduce((s,f)=>s+(f.level||1),0) / fv.fairies.length).toFixed(1)
        : '–';

    el.innerHTML = `
      <div style="font-family:Fredoka,sans-serif; color:#422006;">
        <div style="font-size:10px;color:#a78bfa;text-align:right;margin-bottom:6px;opacity:0.8;">Ketuk kartu untuk keterangan ⓘ</div>

        <!-- Sumber Daya -->
        <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:6px;">💰 Sumber Daya</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            ${_fvStatCard('debu','✨','Debu Peri', fv.resources.debu||0, '#d97706','#fde68a',
              'Mata uang utama Kahyangan. Dihasilkan peri bekerja di bangunan setiap hari. Dipakai untuk membangun & upgrade semua fasilitas.')}
            ${_fvStatCard('kristal','💎','Kristal', fv.resources.kristal||0, '#2563eb','#bfdbfe',
              'Material langka dari Sungai Brantas. Dibutuhkan untuk bangunan tier 2–3. Bisa didapat dari Kolam Kristal atau event khusus.')}
            ${_fvStatCard('cahaya','🌟','Cahaya', fv.resources.cahaya||0, '#ca8a04','#fef08a',
              'Energi suci peri. Diperlukan untuk bangunan tier 3 & upgrade istana. Dihasilkan Menara Cahaya 1×/minggu.')}
            ${_fvStatCard('makanan','🍽️','Makanan', fv.resources.makanan||0, '#16a34a','#bbf7d0',
              'Konsumsi harian peri. Tiap peri butuh 1 porsi/hari. Jika habis, kebahagiaan peri turun & produksi berhenti. Beli dari Rara Wilis.')}
          </div>
        </div>

        <!-- Populasi Peri -->
        <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:6px;">🧚 Populasi Peri</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
            ${_fvStatCardCenter('pop-aktif','🧚','Peri Aktif', (fv.fairies||[]).length, '#16a34a','#86efac',
              'Jumlah peri yang tinggal di Kahyangan saat ini. Peri baru lahir dari Pondok Peri & bangunan berkapasitas tinggi setiap hari.')}
            ${_fvStatCardCenter('pop-cap','🏠','Kapasitas', st.totalCap||0, '#16a34a','#86efac',
              'Batas maksimal peri yang bisa tinggal. Ditentukan oleh jumlah & tier bangunan hunian. Bangun lebih banyak Pondok/Omah Widadari untuk menambah kapasitas.')}
            ${_fvStatCardCenter('pop-lvl','⭐','Rata-rata Lvl', avgLvl, '#7c3aed','#e9d5ff',
              'Rata-rata level semua peri. Peri naik level saat bekerja & bahagia. Level tinggi meningkatkan produksi debu & peluang lahir peri baru.')}
          </div>
          ${topFairy ? `<div onclick="_fvTip('top-fairy')" style="cursor:pointer;margin-top:8px;background:#fff;border:1px solid #c084fc;border-radius:8px;padding:6px 10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:20px;">🏆</span>
              <div style="flex:1;">
                <div style="font-size:11px;font-weight:700;color:#7c3aed;">${topFairy.name} — Level ${topFairy.level||1}</div>
                <div style="font-size:10px;color:#94a3b8;">Peri Tertinggi Levelnya <span style="color:#a78bfa;">ⓘ</span></div>
              </div>
            </div>
            <div id="fvtip-top-fairy" class="fvstat-tip" style="display:none;margin-top:5px;background:#1e1b4b;color:#e9d5ff;font-size:10px;border-radius:6px;padding:5px 8px;line-height:1.5;">
              Peri dengan level tertinggi di Kahyangan. Semakin tinggi levelnya, semakin besar bonus produksi yang dia berikan ke bangunan tempat dia ditugaskan. Jaga kebahagiaannya agar terus berkembang!
            </div>
          </div>` : ''}
        </div>

        <!-- Infrastruktur -->
        <div style="background:#eff6ff;border:1.5px solid #93c5fd;border-radius:12px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:6px;">🏗️ Infrastruktur</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            ${_fvStatCardCenter('b-aktif','🏘️','Bangunan Aktif', bCount, '#2563eb','#93c5fd',
              'Jumlah bangunan yang sudah selesai dibangun & beroperasi. Setiap bangunan menghasilkan sumber daya & tempat tinggal peri.')}
            ${_fvStatCardCenter('b-antrian','⏳','Dalam Antrian', qCount, '#f59e0b','#fde68a',
              'Bangunan yang sedang dalam proses pembangunan. Setiap bangunan butuh waktu 1 menit untuk selesai. Kamu bisa punya beberapa antrian sekaligus.')}
            ${_fvStatCardCenter('b-debu','⚙️','Debu/Hari', st.dustPerDay||0, '#16a34a','#86efac',
              'Total debu peri yang dihasilkan semua bangunan dalam satu hari permainan. Semakin banyak peri bekerja & semakin tinggi tier bangunan, semakin besar produksinya.')}
            ${_fvStatCardCenter('b-cahaya','🌟','Cahaya/Minggu', st.cahayaPerWeek||0, '#ca8a04','#fef08a',
              'Total cahaya yang dihasilkan bangunan Menara Cahaya setiap minggu. Cahaya sangat langka — kelola dengan bijak untuk upgrade bangunan istimewa.')}
          </div>
        </div>
      </div>`;
}

function khTab(tab) {
    document.querySelectorAll('.kh-tab').forEach((t,i) => t.classList.toggle('on', i===(tab==='peri'?0:tab==='bangunan'?1:2)));
    const tp = document.getElementById('kh-t-peri');
    const tb = document.getElementById('kh-t-bangunan');
    const ts = document.getElementById('kh-t-statistik');
    if (tp) tp.style.display = tab==='peri'      ? 'block' : 'none';
    if (tb) tb.style.display = tab==='bangunan'  ? 'block' : 'none';
    if (ts) ts.style.display = tab==='statistik' ? 'block' : 'none';
    if (tab==='peri')      _khRenderPeri(_khIdx);
    if (tab==='bangunan')  _khRenderBangunan();
    if (tab==='statistik') _khRenderStatistik();
}

// ── TAB PERI ────────────────────────────────────────────────────
function khNav(d) {
    const fv = getFairyVillage();
    _khIdx = Math.max(0, Math.min(fv.fairies.length - 1, _khIdx + d));
    _khRenderPeri(_khIdx);
}

function _khImg(f) {
    const M = { t1:'images/rarawilis.png', t2:'images/wening.png', t3:'images/sekar.png', t4:'images/bening.png', t5:'images/juna.png' };
    if (M[f.id]) return M[f.id];
    // Peri lahir: pakai sprite index dari f.spriteIdx
    if (f.gender === 'girl') {
        const idx = (f.spriteIdx !== undefined ? f.spriteIdx : 0) % 4 + 1;
        return `images/peri_pr${idx}.png`;
    } else {
        const idx = (f.spriteIdx !== undefined ? f.spriteIdx : 0) % 2 + 1;
        return `images/peri_lk${idx}.png`;
    }
}
function _khMoodHTML(f) {
    const h = f.happiness ?? 80;
    const m = f.mood || (h>=70?'happy':h>=40?'neutral':h>=20?'sad':'bad_mood');
    const D = {
        happy:    ['😊 Senang',   'rgba(22,163,74,.12)',  '#15803d'],
        neutral:  ['😐 Biasa',    'rgba(217,119,6,.15)',  '#b45309'],
        sad:      ['😢 Sedih',    'rgba(59,130,246,.12)', '#1d4ed8'],
        bad_mood: ['😠 Bad Mood', 'rgba(239,68,68,.12)',  '#b91c1c'],
    };
    const [label, bg, col] = D[m] || D.happy;
    return `<span class="kh-mood" style="background:${bg};color:${col};border:1.5px solid ${col}">${label}</span>`;
}
function _khBar(pct, col) {
    return `<div class="kh-bt"><div class="kh-bf" style="width:${Math.min(100,Math.round(pct))}%;background:${col}"></div></div>`;
}
function _hintLvl(v, hi, mid) {
    return v >= hi ? 0 : v >= mid ? 1 : 2;
}

function _khRenderPeri(idx) {
    const fv = getFairyVillage();
    const list = fv.fairies;
    const wrap = document.getElementById('kh-fc-wrap');
    const act  = document.getElementById('kh-factions');
    const pg   = document.getElementById('kh-pg');
    const pBtn = document.getElementById('kh-prev');
    const nBtn = document.getElementById('kh-next');
    if (!wrap) return;

    if (!list.length) {
        wrap.innerHTML = `<div class="kh-empty" style="padding:24px 14px"><div class="kh-ej">🧚</div><p class="kh-ep">Belum ada Widadari.<br>Bangun <b>Padepokan Cilik</b> agar peri bisa datang!</p></div>`;
        if (act)  act.innerHTML = '';
        if (pg)   pg.textContent = '0 / 0';
        if (pBtn) pBtn.disabled = true;
        if (nBtn) nBtn.disabled = true;
        return;
    }

    _khIdx = Math.max(0, Math.min(list.length - 1, idx));
    const f = list[_khIdx];
    if (pg)   pg.textContent = `${_khIdx + 1} / ${list.length}`;
    if (pBtn) pBtn.disabled = (_khIdx === 0);
    if (nBtn) nBtn.disabled = (_khIdx === list.length - 1);

    const intel   = f.intel   ?? 10;
    const agility = f.agility ?? 10;
    const spirit  = f.spirit  ?? 10;
    const hp      = f.hp      ?? 80;
    const maxHp   = f.maxHp   ?? 100;
    const hap     = f.happiness ?? 80;
    const lv      = f.level   ?? 1;
    const fixed   = KH_FIXED.includes(f.id);

    const buildHints  = ['⚡ Konstruksi Cepat', '🔧 Konstruksi Normal', '🐢 Konstruksi Lambat'];
    const agilHints   = ['🏃 Jelajah Luas',     '🚶 Jelajah Normal',   '🐌 Jelajah Terbatas'];
    const spiritHints = ['✨ Serbuk ×2',         '✨ Serbuk ×1.5',      '✨ Serbuk ×1'];
    const bh = buildHints[_hintLvl(intel,25,15)];
    const ah = agilHints[_hintLvl(agility,25,15)];
    const sh = spiritHints[_hintLvl(spirit,25,15)];

    wrap.innerHTML = `<div class="kh-fc">
      <div class="kh-prow">
        <img class="kh-port" src="${_khImg(f)}" onerror="this.src='images/rarawilis.png'" alt="${f.name}">
        <div class="kh-finfo">
          <div class="kh-fname">${f.name}${fixed ? ' 🔒' : ''}</div>
          <div class="kh-fsub">${f.gender==='girl'?'🧚‍♀️ Widadari':'🧚‍♂️ Peri'} · Lv.${lv}</div>
          ${_khMoodHTML(f)}
        </div>
      </div>
      <div class="kh-stats">
        <div class="kh-si">
          <div class="kh-slr"><span>❤️ HP</span><span class="kh-sv">${hp}/${maxHp}</span></div>
          ${_khBar(hp/maxHp*100,'#f87171')}
        </div>
        <div class="kh-si">
          <div class="kh-slr"><span>😊 Kebahagiaan</span><span class="kh-sv">${hap}%</span></div>
          ${_khBar(hap,'#4ade80')}
        </div>
        <div class="kh-si">
          <div class="kh-slr"><span>🧠 Intelijen</span><span class="kh-sv">${intel}/30</span></div>
          ${_khBar(intel/30*100,'#60a5fa')}
          <div class="kh-hint">${bh}</div>
        </div>
        <div class="kh-si">
          <div class="kh-slr"><span>⚡ Ketangkasan</span><span class="kh-sv">${agility}/30</span></div>
          ${_khBar(agility/30*100,'#fbbf24')}
          <div class="kh-hint">${ah}</div>
        </div>
        <div class="kh-si">
          <div class="kh-slr"><span>🌟 Semangat</span><span class="kh-sv">${spirit}/30</span></div>
          ${_khBar(spirit/30*100,'#e879f9')}
          <div class="kh-hint">${sh}</div>
        </div>
      </div>
    </div>`;

    if (act) act.innerHTML =
        `<button class="kh-ab" onclick="khFeed()">🍽️ Beri Makan</button>` +
        (!fixed ? `<button class="kh-ab" onclick="khRename()">✏️ Ganti Nama</button>` : '');

    _khRefRes();
}

function khFeed() {
    const fv = getFairyVillage();
    const f  = fv.fairies[_khIdx];
    if (!f) return;
    if ((fv.resources.makanan || 0) >= 1) {
        fv.resources.makanan--;
        f.happiness = Math.min(100, (f.happiness || 80) + 10);
        f.mood = f.happiness >= 70 ? 'happy' : f.happiness >= 40 ? 'neutral' : 'sad';
        showToast(`🍽️ ${f.name} makan! Kebahagiaan: ${f.happiness}%`);
        _khRenderPeri(_khIdx);
    } else {
        showToast('❌ Stok makanan habis! Beli dulu.');
    }
}
function khBuyFood() {
    const fv = getFairyVillage();
    if ((fv.resources.debu || 0) >= 30) {
        fv.resources.debu -= 30;
        fv.resources.makanan = (fv.resources.makanan || 0) + 10;
        showToast('🛒 +10 porsi makanan!');
        _khRefRes();
    } else {
        showToast('❌ Serbuk tidak cukup (butuh 30)!');
    }
}
function khRename() {
    const fv = getFairyVillage();
    const f  = fv.fairies[_khIdx];
    if (!f || KH_FIXED.includes(f.id)) return;
    const n = window.prompt(`Ganti nama "${f.name}":`, f.name);
    if (n && n.trim()) { f.name = n.trim().slice(0, 20); showToast(`✏️ Nama diubah: ${f.name}`); _khRenderPeri(_khIdx); }
}

// ── TAB BANGUNAN ─────────────────────────────────────────────────
function _khRenderBangunan() {
    const fv   = getFairyVillage();
    const built = fv.buildings  || [];
    const queue = fv.buildQueue || [];
    const bl    = document.getElementById('kh-blist');
    const cw    = document.getElementById('kh-catalog-wrap');
    if (!bl) return;
    cw.style.display = 'none';
    bl.style.display = 'flex';
    bl.style.flexDirection = 'column';
    bl.style.gap = '10px';
    bl.style.padding = '12px';

    const now = Date.now();
    let html = '';

    // Queue
    if (queue.length) {
        html += `<div class="kh-sec">⏳ Sedang Dibangun / Upgrade</div>`;
        queue.forEach(q => {
            const b = FAIRY_BUILDINGS[q.bid] || {};
            const s = Math.max(0, Math.ceil((q.finishTime - now) / 1000));
            const lbl = q.isUpgrade ? `⬆️ Upgrade → ${b.name||q.bid}` : (b.name||q.bid);
            html += `<div class="kh-qi">
              <span class="kh-be">${b.emoji||'🏗️'}</span>
              <div style="flex:1"><div class="kh-bn">${lbl}</div>
              <div class="kh-qt">⏳ Selesai dalam ${s}s</div></div>
            </div>`;
        });
    }

    // Built
    if (built.length) {
        html += `<div class="kh-sec">✅ Terbangun (${built.length})</div>`;
        built.forEach((bldg, bldgIdx) => {
            const {bid, workers} = bldg;
            const b = FAIRY_BUILDINGS[bid] || {};
            const maxW = b.maxWorkers || 2;

            // Produksi aktual dengan worker
            const fx = [];
            if (b.maxFairies)     fx.push(`+${b.maxFairies} kap.`);
            if (b.dustPerDay)     fx.push(`+${b.dustPerDay}✨/hr`);
            if (b.foodPerDay)     fx.push(`+${b.foodPerDay}🍽️/hr`);
            if (b.happinessBonus) fx.push(`+${b.happinessBonus}❤️`);
            if (b.birthChance)    fx.push(`${Math.round(b.birthChance*100)}% lahir`);
            if (b.xpBonus)        fx.push(`XP×${b.xpBonus}`);
            if (b.dustMultiplier) fx.push(`✨×${b.dustMultiplier}`);
            if (b.enableTrading)  fx.push(`💱 Trade`);
            if (b.tradeBonus>1)   fx.push(`+${Math.round((b.tradeBonus-1)*100)}% rate`);

            let prodNote = '';
            if (b.dustPerDay && (workers||[]).length > 0) {
                const wk = workers || [];
                const avgSp = wk.reduce((s,id) => {
                    const f = (fv.fairies||[]).find(x=>x.id===id);
                    return s + (f?.spirit||10);
                }, 0) / wk.length;
                const mult = avgSp >= 25 ? 2 : avgSp >= 15 ? 1.5 : 1;
                const actual = Math.round(b.dustPerDay * mult);
                if (actual !== b.dustPerDay) prodNote = ` <span style="color:#4ade80">→${actual}✨</span>`;
            }

            // Worker slots
            let workerHTML = `<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;align-items:center">`;
            workerHTML += `<span style="font-size:10px;color:#a78bfa;font-weight:700">👷 ${(workers||[]).length}/${maxW}:</span>`;
            for (let wi = 0; wi < maxW; wi++) {
                const wid = (workers||[])[wi];
                const wf  = wid ? (fv.fairies||[]).find(f=>f.id===wid) : null;
                if (wf) {
                    workerHTML += `<span style="background:rgba(124,58,237,.3);border:1.5px solid #7c3aed;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:700;color:#e9d5ff;display:flex;align-items:center;gap:4px">
                        🧚 ${wf.name}
                        <button onclick="_khUnassign(${bldgIdx},${wi})" style="background:rgba(239,68,68,.3);border:1px solid #ef4444;color:#fca5a5;border-radius:4px;padding:0 4px;font-size:10px;cursor:pointer;line-height:1.6">✕</button>
                    </span>`;
                } else {
                    workerHTML += `<button onclick="_khAssign(${bldgIdx})" style="background:rgba(255,255,255,.07);border:1.5px dashed rgba(124,58,237,.5);border-radius:8px;padding:2px 9px;font-size:11px;font-weight:700;color:#a78bfa;cursor:pointer">+</button>`;
                }
            }
            workerHTML += '</div>';

            // Tier badge + upgrade button
            const tierColors = ['#4ade80','#60a5fa','#c084fc','#fb923c','#fbbf24'];
            const tierC = tierColors[b.tier] || '#60a5fa';
            const tierBadge = `<span style="background:rgba(0,0,0,.3);border:1px solid ${tierC};color:${tierC};border-radius:6px;padding:1px 7px;font-size:10px;font-weight:700">T${b.tier}</span>`;

            // Cek upgrade
            let upgradeBtn = '';
            if (b.upgradeTo && FAIRY_BUILDINGS[b.upgradeTo]) {
                const nextB = FAIRY_BUILDINGS[b.upgradeTo];
                const uc = b.upgradeCost || {};
                const canUpgrade = Object.entries(uc).every(([k,v]) => (fv.resources[k]||0) >= v);
                const costStr = Object.entries(uc).map(([k,v])=>`${v}${k==='debu'?'✨':k==='kristal'?'💎':'🌟'}`).join(' ');
                const isInQueue = (fv.buildQueue||[]).some(q => q.slotId === bldg.slotId && q.isUpgrade);
                if (isInQueue) {
                    upgradeBtn = `<button disabled style="background:rgba(251,191,36,.1);border:1px solid #fbbf24;color:#fbbf24;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;cursor:not-allowed;margin-top:6px">⏳ Sedang upgrade...</button>`;
                } else {
                    upgradeBtn = `<button onclick="_khUpgrade(${bldgIdx})" style="background:${canUpgrade?'rgba(124,58,237,.25)':'rgba(100,100,100,.15)'};border:1.5px solid ${canUpgrade?'#7c3aed':'#555'};color:${canUpgrade?'#c4b5fd':'#888'};border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;cursor:${canUpgrade?'pointer':'not-allowed'};margin-top:6px">
                        ⬆️ Upgrade → ${nextB.emoji} ${nextB.name.replace(/^[^\s]+\s/,'')} (${costStr})
                    </button>`;
                }
            }

            html += `<div class="kh-bi" style="flex-direction:column;align-items:flex-start;gap:4px">
              <div style="display:flex;align-items:center;gap:10px;width:100%">
                <span class="kh-be" style="border-color:${tierC}">${b.emoji||'🏠'}</span>
                <div style="flex:1">
                  <div style="display:flex;align-items:center;gap:6px">
                    <div class="kh-bn">${b.name||bid}</div>${tierBadge}
                  </div>
                  <div class="kh-bd">${fx.join(' · ')||b.desc||''}${prodNote}</div>
                </div>
              </div>
              ${workerHTML}
              ${upgradeBtn}
            </div>`;
        });
    }

    if (!built.length && !queue.length) {
        html = `<div class="kh-empty">
          <div class="kh-ej">🏚️</div>
          <p class="kh-ep">Belum ada bangunan di Kahyangan Wilis.<br>Mulai membangun untuk menghidupkan kembali!</p>
        </div>`;
    }

    html += `<button class="kh-big-btn" onclick="_khShowCatalog()">🏗️ Bangun Bangunan Baru</button>`;
    bl.innerHTML = html;
    _khRefRes();
}

function _khShowCatalog() {
    const fv  = getFairyVillage();
    const bl  = document.getElementById('kh-blist');
    const cw  = document.getElementById('kh-catalog-wrap');
    if (!cw) return;
    bl.style.display = 'none';
    cw.style.display = 'flex';
    cw.style.flexDirection = 'column';
    cw.style.gap = '10px';
    cw.style.padding = '12px';

    const queueBids = new Set((fv.buildQueue||[]).filter(q=>!q.isUpgrade).map(b=>b.bid));
    const usedSlots = new Set([...(fv.buildings||[]),...(fv.buildQueue||[])].map(b=>b.slotId));
    const noSlot    = FAIRY_SLOTS.filter(s=>!usedSlots.has(s.id)).length === 0;
    const res       = fv.resources;

    let html = `<button class="kh-back-btn" onclick="_khRenderBangunan()">◀ Kembali ke Daftar</button>`;
    html += `<div class="kh-sec" style="margin-top:8px">🏗️ Bangun Baru (Tier 1)</div>`;
    html += `<div style="font-size:11px;color:#a78bfa;padding:0 2px 6px">💡 Tier 2 & 3 dibuka lewat ⬆️ Upgrade pada bangunan yang sudah berdiri.</div>`;

    // Hanya tier 1, bukan builtIn, bukan legacy
    Object.entries(FAIRY_BUILDINGS).filter(([,b]) => b.tier===1 && !b.builtIn && !b.legacy)
    .forEach(([bid, b]) => {
        const isQueue   = queueBids.has(bid);
        const canAfford = Object.entries(b.cost||{}).every(([k,v]) => (res[k]||0) >= v);
        const canBuild  = !isQueue && canAfford && !noSlot;
        const costStr   = Object.entries(b.cost||{}).map(([k,v]) =>
            `${v}${k==='debu'?'✨':k==='kristal'?'💎':'🌟'}`).join(' ');
        const builtCount = (fv.buildings||[]).filter(bd=>bd.bid===bid).length;

        let sc, st;
        if (isQueue)       { sc='done'; st='⏳ Antri'; }
        else if (noSlot)   { sc='no';   st='❌ Slot Penuh'; }
        else if (!canAfford){ sc='no';  st='❌ Debu Kurang'; }
        else               { sc='ok';   st='🔨 Bangun'; }

        const lk = !canBuild ? 'lk' : '';
        const oc = canBuild ? `onclick="_khBuild('${bid}')"` : '';
        const badge = builtCount > 0 ? `<span style="background:rgba(74,222,128,.2);border:1px solid #4ade80;color:#4ade80;border-radius:6px;padding:1px 6px;font-size:10px;margin-left:4px">${builtCount} ada</span>` : '';
        html += `<div class="kh-ci ${lk}" ${oc}>
          <span class="kh-ce">${b.emoji||'🏠'}</span>
          <div style="flex:1">
            <div class="kh-cn">${b.name}${badge}</div>
            <div class="kh-cdesc">${b.desc||''}</div>
            <div style="font-size:10px;color:#4ade80;font-weight:700;margin-top:2px">📦 ${b.produce||''}</div>
            <div class="kh-cc">Biaya: ${costStr||'Gratis'} · ⏳60s · 👷 ${b.maxWorkers||1} slot worker</div>
          </div>
          <span class="kh-cs ${sc}">${st}</span>
        </div>`;
    });
    cw.innerHTML = html;
    _khRefRes();
}

function _khBuild(bid) {
    const fv = getFairyVillage();
    const b  = FAIRY_BUILDINGS[bid];
    if (!b) return;
    if (!Object.entries(b.cost||{}).every(([k,v]) => (fv.resources[k]||0) >= v)) {
        showToast('❌ Resource tidak cukup!'); return;
    }
    const usedSlots = new Set([...(fv.buildings||[]),...(fv.buildQueue||[])].map(x=>x.slotId));
    const freeSlots = FAIRY_SLOTS.filter(s=>!usedSlots.has(s.id));
    if (!freeSlots.length) { showToast('❌ Semua slot penuh!'); return; }

    Object.entries(b.cost||{}).forEach(([k,v]) => { fv.resources[k] = (fv.resources[k]||0) - v; });
    const px = STATE.player.x, py = STATE.player.y;
    const TS2 = 30;
    const best = freeSlots.sort((a,z) => Math.hypot(a.x*TS2-px,a.y*TS2-py) - Math.hypot(z.x*TS2-px,z.y*TS2-py))[0];
    fv.buildQueue = fv.buildQueue || [];
    fv.buildQueue.push({ slotId: best.id, bid, finishTime: Date.now() + 60000 });
    showToast(`⏳ ${b.name} mulai dibangun! Selesai 60 detik.`);
    _khShowCatalog();
}

// ── ASSIGN / UNASSIGN PERI KE BANGUNAN ──────────────────────────
function _khAssign(bldgIdx) {
    const fv = getFairyVillage();
    const bldg = fv.buildings[bldgIdx];
    if (!bldg) return;
    bldg.workers = bldg.workers || [];
    // FIX: Gunakan maxWorkers dari definisi bangunan (tier 3 = 3 worker), bukan hardcode 2
    const bDef = FAIRY_BUILDINGS[bldg.bid];
    const maxW = bDef?.maxWorkers || 2;
    if (bldg.workers.length >= maxW) { showToast(`❌ Slot sudah penuh (maks ${maxW} peri)!`); return; }

    // Peri yang belum ditugaskan di bangunan ini
    // FIX: Exclude Rara Wilis (t1) — dia NPC utama, bukan worker
    const _EXCLUDED_WORKER_IDS = ['t1'];
    const assignedAll = new Set(fv.buildings.flatMap(b => b.workers||[]));
    const available   = (fv.fairies||[]).filter(f => !bldg.workers.includes(f.id) && !_EXCLUDED_WORKER_IDS.includes(f.id));

    if (!available.length) { showToast('❌ Semua peri sudah ditugaskan!'); return; }

    // Tampilkan picker — simpel list di body bangunan
    const bl = document.getElementById('kh-blist');
    if (!bl) return;

    const b = FAIRY_BUILDINGS[bldg.bid] || {};
    let html = `<div style="padding:14px;display:flex;flex-direction:column;gap:10px">
      <div style="font-family:'Fredoka',sans-serif;font-size:15px;color:#e9d5ff;font-weight:700">👷 Tugaskan Peri ke<br>${b.emoji||''} ${b.name||bldg.bid}</div>
      <div style="font-size:12px;color:#a78bfa">Pilih peri yang akan bekerja di bangunan ini.<br>Semangat tinggi → produksi lebih banyak!</div>`;

    available.forEach(f => {
        const spHint = f.spirit>=25?'✨×2':f.spirit>=15?'✨×1.5':'✨×1';
        const isBusy = assignedAll.has(f.id) ? '<span style="color:#fbbf24;font-size:10px"> (sudah ditugaskan)</span>' : '';
        html += `<div style="background:rgba(255,255,255,.07);border:2px solid rgba(124,58,237,.3);border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:10px;cursor:pointer" onclick="_khDoAssign(${bldgIdx},'${f.id}')">
          <img src="${_khImg(f)}" onerror="this.src='images/rarawilis.png'" style="width:36px;height:46px;object-fit:cover;object-position:top;border-radius:8px;border:2px solid #7c3aed;image-rendering:pixelated">
          <div style="flex:1">
            <div style="font-family:'Fredoka',sans-serif;font-size:14px;color:#e9d5ff;font-weight:700">${f.name}${isBusy}</div>
            <div style="font-size:11px;color:#a78bfa">Lv.${f.level||1} · 🌟${f.spirit} ${spHint}</div>
          </div>
        </div>`;
    });

    html += `<button class="kh-back-btn" onclick="_khRenderBangunan()">◀ Batal</button></div>`;
    bl.innerHTML = html;
}

function _khDoAssign(bldgIdx, fairyId) {
    const fv   = getFairyVillage();
    const bldg = fv.buildings[bldgIdx];
    if (!bldg) return;
    bldg.workers = bldg.workers || [];
    // FIX: Gunakan maxWorkers dari definisi bangunan, bukan hardcode 2
    const bDef2 = FAIRY_BUILDINGS[bldg.bid];
    const maxW2 = bDef2?.maxWorkers || 2;
    if (bldg.workers.length >= maxW2) { showToast(`❌ Slot penuh (maks ${maxW2} peri)!`); _khRenderBangunan(); return; }
    // FIX: Rara Wilis tidak boleh jadi worker
    if (fairyId === 't1') { showToast('❌ Rara Wilis tidak bisa ditugaskan!'); _khRenderBangunan(); return; }
    if (bldg.workers.includes(fairyId)) { showToast('⚠️ Peri sudah ada di sini!'); _khRenderBangunan(); return; }
    bldg.workers.push(fairyId);
    const f = (fv.fairies||[]).find(x=>x.id===fairyId);
    showToast(`✅ ${f?.name||fairyId} ditugaskan ke bangunan!`);
    _khRenderBangunan();
}

function _khUnassign(bldgIdx, workerSlot) {
    const fv   = getFairyVillage();
    const bldg = fv.buildings[bldgIdx];
    if (!bldg || !bldg.workers) return;
    const fid = bldg.workers[workerSlot];
    bldg.workers.splice(workerSlot, 1);
    const f = (fv.fairies||[]).find(x=>x.id===fid);
    showToast(`↩️ ${f?.name||fid} ditarik dari tugas.`);
    _khRenderBangunan();
}

// ── UPGRADE BANGUNAN IN-PLACE ────────────────────────────────────
function _khUpgrade(bldgIdx) {
    const fv   = getFairyVillage();
    const bldg = fv.buildings[bldgIdx];
    if (!bldg) return;
    const b    = FAIRY_BUILDINGS[bldg.bid];
    if (!b?.upgradeTo) { showToast('❌ Bangunan ini tidak bisa diupgrade!'); return; }

    const nextBid = b.upgradeTo;
    const nextB   = FAIRY_BUILDINGS[nextBid];
    if (!nextB) { showToast('❌ Data upgrade tidak ditemukan!'); return; }

    // Cek resource
    const uc = b.upgradeCost || {};
    if (!Object.entries(uc).every(([k,v]) => (fv.resources[k]||0) >= v)) {
        const need = Object.entries(uc).map(([k,v])=>`${v}${k==='debu'?'✨':k==='kristal'?'💎':'🌟'}`).join(' ');
        showToast(`❌ Resource kurang! Butuh: ${need}`); return;
    }

    // Cek tidak sedang ada queue di slot ini
    const alreadyQueued = (fv.buildQueue||[]).some(q => q.slotId === bldg.slotId && q.isUpgrade);
    if (alreadyQueued) { showToast('⏳ Slot ini sedang dalam proses upgrade!'); return; }

    // Kurangi resource
    Object.entries(uc).forEach(([k,v]) => { fv.resources[k] = (fv.resources[k]||0) - v; });

    // Tambah ke queue dengan flag isUpgrade + bldgIdx
    fv.buildQueue = fv.buildQueue || [];
    fv.buildQueue.push({
        slotId:     bldg.slotId,
        bid:        nextBid,
        finishTime: Date.now() + BUILD_DURATION_MS,
        isUpgrade:  true,
        bldgIdx:    bldgIdx,   // untuk in-place replacement
    });

    showToast(`⬆️ Upgrade ${b.name} → ${nextB.name} dimulai! (60 detik)`);
    _khRenderBangunan();
}

// backward compat stubs
function openFairyListDialog() { khOpen(); }
function openBuildMenu() { khOpen(); setTimeout(()=>khTab('bangunan'), 60); }
function showFairyCardModal() { khOpen(); }


// ─────────────────────────────────────────────────────────────
// COLLECT DUST
// ─────────────────────────────────────────────────────────────
function collectFairyDust() {
    const fv=getFairyVillage(), curDay=STATE.day;
    if (fv.lastCollectDay===curDay) {
        showFVDialog('🌳 POHON ENERGI','Serbuk Wilis hari ini sudah dikumpulkan!\n\nKembali besok ya.',[{text:'OK',action:()=>fvActiveDialog=null}],'🌳'); return;
    }
    const bonus=5+fv.fairies.length*2+(fv.buildings?.length||0);
    fv.resources.debu=(fv.resources.debu||0)+bonus;
    fv.lastCollectDay=curDay;
    updateFVHUD();
    createFVParticles(FV_POHON_POS.x*TS+TS, FV_POHON_POS.y*TS+TS, 15);
    showFVDialog('🌳 POHON ENERGI',`Berhasil! ✨ +${bonus} Serbuk Wilis\n\nTotal Serbuk: ${fv.resources.debu}\n\n💡 Semakin banyak Widadari dan bangunan, semakin banyak serbuk yang bisa dikumpulkan!`,[{text:'Terima kasih!',action:()=>fvActiveDialog=null}],'🌳');
}

// ─────────────────────────────────────────────────────────────
// INTERIOR BANGUNAN — popup saat masuk bangunan
// ─────────────────────────────────────────────────────────────
// ── Building interior BG images per category ──
const FVBI_BG = {
    pohon_energi:    'images/pohonperi.png',
    // Hunian — pakai gambar omah-tier
    pondok_peri:     'images/omah-tier1.png',
    rumah_peri:      'images/omah-tier2.png',
    dalem_widadari:  'images/omah-tier3.png',
    istana_mini:     'images/omah-tier3.png',
    pohon_kehidupan: 'images/pohonperi.png',
    // Taman — pakai gambar taman-tier
    taman_mini:      'images/taman-tier1.png',
    taman_mekar:     'images/taman-tier2.png',
    kebun_raya:      'images/taman-tier3.png',
    // Kolam / Sendang — pakai gambar sendang-tier
    kolam_kristal:   'images/sendang-tier1.png',
    kolam_agung:     'images/sendang-tier2.png',
    telaga_nirmala:  'images/sendang-tier3.png',
    // Sekolah — pakai gambar sekolah-tier
    sekolah_peri:    'images/sekolah-tier1.png',
    sanggar_tari:    'images/sekolah-tier2.png',
    akademi_agung:   'images/sekolah-tier3.png',
    // Pasar — pakai gambar pasar-tier
    pasar_peri:      'images/pasar-tier1.png',
    balai_dagang:    'images/pasar-tier2.png',
    pusat_niaga:     'images/pasar-tier3.png',
    // Menara — pakai gambar menara-tier
    menara_kecil:    'images/menara-tier1.png',
    menara_wilis:    'images/menara-tier2.png',
    menara_cahaya:   'images/menara-tier3.png',
    // Istana
    istana_mini:     'images/istanaperi.png',
};

// Slot index sedang di-assign
let _fvbiAssignSlot = -1;

function openBuildingInterior(bldg, slot) {
    const fv  = getFairyVillage();
    const b   = FAIRY_BUILDINGS[bldg.bid];
    if (!b) return;

    // FIX: Putar musik insideperi saat masuk bangunan di pulau peri
    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
        // Force reset agar selalu mulai dari awal saat masuk bangunan
        if (AudioService.tracks.insideperi) {
            AudioService.tracks.insideperi.currentTime = 0;
        }
        // Gunakan currentTrack null dulu agar playBGM tidak di-skip
        if (AudioService.currentTrack === 'insideperi') {
            AudioService.currentTrack = null;
        }
        AudioService.playBGM('insideperi');
    }

    // Peri yang bekerja di sini
    const workers = (bldg.workers || []).map(wid => fv.fairies.find(f=>f.id===wid)).filter(Boolean);
    // Peri yang tidak bekerja di mana pun
    const busyIds = new Set((fv.buildings||[]).flatMap(bl=>bl.workers||[]));
    // FIX: Exclude Rara Wilis (t1) — NPC utama, tidak bisa jadi worker
    const freeFairies = fv.fairies.filter(f => !busyIds.has(f.id) && f.id !== 't1');
    const maxW = b.maxWorkers || 2;

    // Hapus popup lama
    const old = document.getElementById('fv-building-interior');
    if (old) old.remove();

    // Buat popup
    const el = document.createElement('div');
    el.id = 'fv-building-interior';

    // ── Scene: tampilkan peri yg bekerja + slot kosong di dalam scene ──
    const sceneSlots = Array.from({length: maxW}, (_, i) => {
        const wf = workers[i];
        if (wf) {
            const img = _khImg(wf);
            const moodEmoji = (wf.happiness >= 80) ? '😊' : (wf.happiness >= 50) ? '😐' : '😢';
            const activityEmoji = b.dustPerDay ? '✨' : b.foodPerDay ? '🍳' : b.happinessBonus ? '💧' : b.xpBonus ? '📖' : b.enableTrading ? '🛒' : b.dustMultiplier ? '🕯️' : '⚙️';
            return `<div class="fvbi-fairy-slot" title="${wf.name} — Klik untuk kelola" onclick="fvFireWorkerPrompt('${bldg.slotId}',${i})">
                <div class="fvbi-work-badge">${activityEmoji}</div>
                <img src="${img}" onerror="this.src='images/rarawilis.png'" class="fvbi-fairy-slot-img">
                <div class="fvbi-fairy-slot-name">${wf.name} ${moodEmoji}</div>
            </div>`;
        } else {
            const hasFreeFairy = freeFairies.length > 0;
            return `<div class="fvbi-fairy-slot fvbi-fairy-slot-empty" title="${hasFreeFairy ? 'Ketuk untuk tugaskan peri' : 'Tidak ada peri bebas'}" onclick="fvbiOpenAssign(${i})">
                <div class="fvbi-fairy-slot-img" style="display:flex;align-items:center;justify-content:center;font-size:26px;">${hasFreeFairy ? '🧚' : '🌫️'}</div>
                <div class="fvbi-fairy-slot-name" style="font-size:9px;">${hasFreeFairy ? '+ Tugaskan' : 'Kosong'}</div>
            </div>`;
        }
    }).join('');

    // ── Stat chips ──
    const statChips = [];
    statChips.push(`<div class="fvbi-stat-chip"><span>👷</span>${workers.length}/${maxW} Peri</div>`);
    statChips.push(`<div class="fvbi-stat-chip"><span>⭐</span>Tier ${b.tier}</div>`);
    if (b.maxFairies)     statChips.push(`<div class="fvbi-stat-chip"><span>🏠</span>Hunian +${b.maxFairies}</div>`);
    if (b.birthChance)    statChips.push(`<div class="fvbi-stat-chip"><span>👶</span>${Math.round(b.birthChance*100)}% lahir</div>`);
    if (b.dustMultiplier) statChips.push(`<div class="fvbi-stat-chip"><span>✨</span>Debu ×${b.dustMultiplier}</div>`);
    if (b.xpBonus)        statChips.push(`<div class="fvbi-stat-chip"><span>📚</span>XP ×${b.xpBonus}</div>`);
    if (b.enableTrading)  statChips.push(`<div class="fvbi-stat-chip"><span>💱</span>Trading x${b.tradeBonus||1}</div>`);

    // ── Produksi tags ──
    const fx=[];
    if(b.dustPerDay)     fx.push(`+${b.dustPerDay} ✨ Debu/hari`);
    if(b.foodPerDay)     fx.push(`+${b.foodPerDay} 🍽️ Makanan/hari`);
    if(b.happinessBonus) fx.push(`+${b.happinessBonus} ❤️ Happiness/hari`);
    if(b.cahayaPerWeek)  fx.push(`+${b.cahayaPerWeek} 🌟 Cahaya/minggu`);
    if(b.intelBonus)     fx.push(`+${b.intelBonus} 🧠 Intel/hari`);
    const prodHTML = fx.length ? fx.map(f=>`<span class="fvbi-prod-tag">${f}</span>`).join('') : '<span class="fvbi-prod-tag">Pasif</span>';

    // ── Worker list (below scene, detail assign) ──
    const workerCards = Array.from({length: maxW}, (_, i) => {
        const wf = workers[i];
        if (wf) {
            const img = _khImg(wf);
            return `<div class="fvbi-worker filled">
                <img src="${img}" onerror="this.src='images/rarawilis.png'" class="fvbi-wimg">
                <div class="fvbi-winfo">
                    <div class="fvbi-wname">${wf.name} <span style="font-size:10px;opacity:.6;">${wf.gender==='girl'?'♀':'♂'} Lv.${wf.level||1}</span></div>
                    <div class="fvbi-wstat">🧠${wf.intel||0} ⚡${wf.agility||0} 🌟${wf.spirit||0} ❤️${wf.happiness||0}%</div>
                </div>
                <button class="fvbi-wfire" onclick="fvFireWorker('${bldg.slotId}',${i})">✕ Tarik</button>
            </div>`;
        } else {
            const freeOpts = freeFairies.length
                ? freeFairies.map(f=>`<option value="${f.id}">${f.name} (${f.gender==='girl'?'♀':'♂'}) Lv.${f.level||1} 🧠${f.intel||0}</option>`).join('')
                : `<option value="">— Tidak ada peri bebas —</option>`;
            return `<div class="fvbi-worker empty">
                <div class="fvbi-empty-ico">🧚</div>
                <div class="fvbi-empty-label">Slot ${i+1} Kosong</div>
                <select class="fvbi-sel" id="fvbi-sel-${bldg.slotId}-${i}">${freeOpts}</select>
                <button class="fvbi-wassign" onclick="fvAssignWorkerFromInterior('${bldg.slotId}',${i})" ${freeFairies.length?'':'disabled'}>Tugaskan</button>
            </div>`;
        }
    }).join('');

    // ── Assign modal list ──
    const assignItems = freeFairies.length
        ? freeFairies.map(f => {
            const img = _khImg(f);
            return `<div class="fvbi-assign-item" onclick="fvbiDoAssignSlot('${bldg.slotId}',_fvbiAssignSlot,'${f.id}')">
                <img src="${img}" onerror="this.src='images/rarawilis.png'">
                <div class="fvbi-assign-item-info">
                    <div class="fvbi-assign-item-name">${f.name} <span style="font-size:10px;opacity:.6;">${f.gender==='girl'?'♀':'♂'} Lv.${f.level||1}</span></div>
                    <div class="fvbi-assign-item-stat">🧠${f.intel||0} ⚡${f.agility||0} 🌟${f.spirit||0} ❤️${f.happiness||0}%</div>
                </div>
            </div>`;
          }).join('')
        : `<div class="fvbi-assign-empty">Tidak ada peri bebas saat ini 🧚</div>`;

    // ── Narasi suasana per tipe bangunan ──
    const FVBI_NARASI = {
        pondok_peri:    workers.length ? '🌸 Para Widadari beristirahat dengan tenang di sini...' : '🌫️ Bangunan sepi... belum ada Widadari yang tinggal.',
        rumah_peri:     workers.length ? '🏡 Suara tawa lembut terdengar dari dalam rumah...' : '🌫️ Pintu terbuka, tapi rumah masih kosong.',
        dalem_widadari: workers.length ? '✨ Aroma bunga kenanga mengisi tiap sudut dalem...' : '🌫️ Dalem yang megah menunggu sang penghuni.',
        taman_mini:     workers.length ? '🌸 Peri bunga bersenandung sambil merawat tanaman...' : '🌿 Taman segar menunggu tangan teladan peri.',
        taman_mekar:    workers.length ? '🌺 Wangi kenanga menguar, peri sibuk menyiram...' : '🌿 Kebun subur, tapi belum ada yang merawat.',
        kebun_raya:     workers.length ? '🌳 Dedaunan berdesir, para peri bekerja gembira...' : '🌳 Kebun raya menunggu peri-peri rajin.',
        kolam_kristal:  workers.length ? '💧 Suara gemericik air jernih menenangkan jiwa...' : '💧 Sendang yang bening, sepi tanpa penunggu.',
        kolam_agung:    workers.length ? '🌊 Cipratan air suci membawa berkah Kahyangan...' : '🌊 Air sendang beriak-riak menunggu sang peri.',
        telaga_nirmala: workers.length ? '🌈 Cahaya pelangi memantul di permukaan telaga...' : '🌈 Telaga ajaib sepi tanpa penjaganya.',
        sekolah_peri:   workers.length ? '📚 Suara hafalan ilmu bergema di padepokan...' : '📚 Padepokan ilmu sunyi menunggu guru peri.',
        sanggar_tari:   workers.length ? '🎓 Gemerincing gelang peri mengiringi tarian...' : '🎓 Sanggar tari sepi, tunggu peri berbakat.',
        akademi_agung:  workers.length ? '🏛️ Para cendekiawan peri berdiskusi serius...' : '🏛️ Akademi agung menantikan para pelajar.',
        pasar_peri:     workers.length ? '🛒 Riuh transaksi dan tawa para pedagang peri...' : '🛒 Lapak dagang siap, menunggu peri berdagang.',
        balai_dagang:   workers.length ? '🏪 Aroma kayu segar dari balai yang ramai...' : '🏪 Balai dagang menunggu niagawan peri.',
        pusat_niaga:    workers.length ? '🏦 Kristal berkilau ditumpuk rapi di pusat niaga...' : '🏦 Brankas terbuka, menunggu peri bijak.',
        menara_kecil:   workers.length ? '🕯️ Cahaya lilin berkedip lembut di puncak menara...' : '🕯️ Menara berdiri kokoh, belum ada yang menjaga.',
        menara_wilis:   workers.length ? '✨ Sinar Wilis memancar dari puncak menara...' : '✨ Menara Wilis siap, menunggu penjaga setia.',
        menara_cahaya:  workers.length ? '🌟 Cahaya surgawi bersinar terang dari puncak...' : '🌟 Menara cahaya tertinggi, butuh peri kuat.',
        pohon_energi:   '🌳 Pohon Energi berdenyut penuh kekuatan Wilis...',
        pohon_kehidupan:'🌳 Akar pohon beringin agung mengaliri energi Kahyangan...',
    };
    const narasiText = FVBI_NARASI[bldg.bid] || (workers.length ? '✨ Para Widadari sibuk bekerja dengan riang...' : '🌫️ Bangunan ini masih menunggu Widadari penghuni.');

    const bgSrc = FVBI_BG[bldg.bid] || 'images/kayangan.png';

    el.innerHTML = `
        <div id="fvbi-overlay" onclick="closeBuildingInterior()"></div>
        <div id="fvbi-panel">
            <!-- HEADER -->
            <div id="fvbi-header">
                <span id="fvbi-emoji">${b.emoji||'🏠'}</span>
                <div id="fvbi-title-wrap">
                    <div id="fvbi-name">${b.name.replace(/^[^\s]+\s/,'')}</div>
                    <div id="fvbi-tier">Tier ${b.tier} · ${slot?'Slot '+slot.id.toUpperCase():''}</div>
                </div>
                <button id="fvbi-close" onclick="closeBuildingInterior()">✕</button>
            </div>

            <!-- INTERIOR SCENE -->
            <div id="fvbi-scene">
                <img id="fvbi-scene-bg" src="${bgSrc}" onerror="this.style.display='none'" alt="">
                <div id="fvbi-scene-overlay"></div>
                <div id="fvbi-scene-narasi">${narasiText}</div>
                <div id="fvbi-fairy-row">${sceneSlots}</div>

                <!-- Assign overlay (muncul saat klik slot kosong di scene) -->
                <div id="fvbi-assign-modal">
                    <div id="fvbi-assign-title">🧚 Pilih Peri untuk Slot ini</div>
                    <div id="fvbi-assign-list">${assignItems}</div>
                    <button class="fvbi-assign-cancel" onclick="fvbiCloseAssign()">✕ Batal</button>
                </div>
            </div>

            <!-- STAT CHIPS -->
            <div id="fvbi-stat-bar">${statChips.join('')}</div>

            <!-- PRODUKSI -->
            <div id="fvbi-prod">
                <div class="fvbi-sec-label">⚙️ Produksi & Fungsi</div>
                <div id="fvbi-prod-tags">${prodHTML}</div>
            </div>

            <!-- WORKERS DETAIL -->
            <div id="fvbi-workers-section">
                <div class="fvbi-sec-label">👷 Penugasan Peri <span style="font-weight:400;font-size:10px;color:#a78bfa;">(${workers.length}/${maxW} bekerja)</span></div>
                <div id="fvbi-worker-grid">${workerCards}</div>
            </div>

            <!-- DESC -->
            <div id="fvbi-desc">💬 ${b.desc||''}</div>

            <!-- FOOTER ACTIONS -->
            <div id="fvbi-footer">
                ${b.upgradeTo ? `<button class="fvbi-btn-upgrade" onclick="closeBuildingInterior(); setTimeout(()=>openKastilModal?.(), 100);">⬆️ Upgrade Bangunan</button>` : `<div></div>`}
                <button class="fvbi-btn-close" onclick="closeBuildingInterior()">🚪 Keluar</button>
            </div>
        </div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(()=> el.querySelector('#fvbi-panel').classList.add('fvbi-in'));
}

function fvbiOpenAssign(slotIdx) {
    _fvbiAssignSlot = slotIdx;
    const modal = document.getElementById('fvbi-assign-modal');
    if (modal) modal.classList.add('open');
}
function fvbiCloseAssign() {
    const modal = document.getElementById('fvbi-assign-modal');
    if (modal) modal.classList.remove('open');
}
function fvbiDoAssignSlot(slotId, workerIdx, fairyId) {
    fvbiCloseAssign();
    // Re-use existing assign logic
    const fv   = getFairyVillage();
    const bldg = (fv.buildings||[]).find(b=>b.slotId===slotId);
    if (!bldg) return;
    const wid  = fairyId;
    const alreadyWorking = (fv.buildings||[]).some(b=>b.workers&&b.workers.includes(wid));
    if (alreadyWorking) { showToast('Peri ini sudah bekerja di bangunan lain!'); return; }
    if (!bldg.workers) bldg.workers = [];
    bldg.workers[workerIdx] = wid;
    const f = fv.fairies.find(x=>x.id===wid);
    showToast(`✅ ${f?.name||'Peri'} mulai bekerja!`);
    typeof _khRefRes==='function' && _khRefRes();
    closeBuildingInterior();
    const slot = FAIRY_SLOTS.find(s=>s.id===slotId);
    if (slot) setTimeout(()=>openBuildingInterior(bldg,slot), 100);
}
function fvFireWorkerPrompt(slotId, workerIdx) {
    const fv = getFairyVillage();
    const bldg = (fv.buildings||[]).find(b=>b.slotId===slotId);
    if (!bldg) return;
    const wid = bldg.workers[workerIdx];
    const f = fv.fairies.find(x=>x.id===wid);
    if (!f) return;
    // Konfirmasi singkat via toast, lalu fire
    showToast(`🔓 Tekan tombol "Tarik" di daftar bawah untuk menarik ${f.name}.`);
}

function closeBuildingInterior() {
    const el = document.getElementById('fv-building-interior');
    if (!el) return;
    const panel = el.querySelector('#fvbi-panel');
    if (panel) panel.classList.remove('fvbi-in');
    setTimeout(() => el.remove(), 220);
    // FIX: Kembali ke musik pulauperi setelah keluar dari bangunan
    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
        if (AudioService.currentTrack === 'insideperi') {
            AudioService.playBGM('pulauperi');
        }
    }
}

function fvFireWorker(slotId, workerIdx) {
    const fv = getFairyVillage();
    const bldg = (fv.buildings||[]).find(b=>b.slotId===slotId);
    if (!bldg) return;
    const fired = bldg.workers[workerIdx];
    bldg.workers.splice(workerIdx, 1);
    const f = fv.fairies.find(x=>x.id===fired);
    showToast(`🔓 ${f?.name||'Peri'} selesai bertugas di bangunan ini.`);
    closeBuildingInterior();
    // Re-open dengan data terbaru
    const slot = FAIRY_SLOTS.find(s=>s.id===slotId);
    if (slot) setTimeout(()=>openBuildingInterior(bldg,slot), 100);
}

function fvAssignWorkerFromInterior(slotId, workerIdx) {
    const fv   = getFairyVillage();
    const bldg = (fv.buildings||[]).find(b=>b.slotId===slotId);
    if (!bldg) return;
    const sel  = document.getElementById(`fvbi-sel-${slotId}-${workerIdx}`);
    if (!sel || !sel.value) { showToast('Pilih peri dulu!'); return; }
    const wid  = sel.value;
    // Cek sudah bekerja di tempat lain
    const alreadyWorking = (fv.buildings||[]).some(b=>b.workers&&b.workers.includes(wid));
    if (alreadyWorking) { showToast('Peri ini sudah bekerja di bangunan lain!'); return; }
    if (!bldg.workers) bldg.workers = [];
    bldg.workers[workerIdx] = wid;
    const f = fv.fairies.find(x=>x.id===wid);
    showToast(`✅ ${f?.name||'Peri'} mulai bekerja!`);
    _khRefRes && _khRefRes();
    closeBuildingInterior();
    const slot = FAIRY_SLOTS.find(s=>s.id===slotId);
    if (slot) setTimeout(()=>openBuildingInterior(bldg,slot), 100);
}

// ─────────────────────────────────────────────────────────────
// PARTIKEL
// ─────────────────────────────────────────────────────────────
function createFVParticles(wx,wy,count=12) {
    // Konversi world coords ke screen coords
    const sx=wx-fvCam.x, sy=wy-fvCam.y;
    for(let i=0;i<count;i++){
        const angle=Math.random()*Math.PI*2, speed=1+Math.random()*2.5;
        fvParticles.push({x:sx,y:sy,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-1,life:45,maxLife:45,color:`hsl(${260+Math.random()*80},85%,72%)`});
    }
}

// ─────────────────────────────────────────────────────────────
// INPUT — Floating joystick (same as main game)
// ─────────────────────────────────────────────────────────────
function setupFairyInput() {
    document.addEventListener('keydown', fvKeyDown);
    document.addEventListener('keyup',   fvKeyUp);
    if (fvCanvas) {
        fvCanvas.addEventListener('click',      tapFVDialog,     false);
        fvCanvas.addEventListener('touchstart', fvCanvasTouchStart, {passive:false});
        fvCanvas.addEventListener('touchend',   fvCanvasTouchEnd,   {passive:false});
    }
    // Floating joystick — attached to the bottom bar area
    const area = document.getElementById('fv-bottom-bar');
    if (area) {
        area.addEventListener('touchstart', fvJoyTouchStart, {passive:false});
        area.addEventListener('touchmove',  fvJoyTouchMove,  {passive:false});
        area.addEventListener('touchend',   fvJoyTouchEnd,   {passive:false});
        area.addEventListener('mousedown',  fvJoyMouseStart);
        document.addEventListener('mousemove', fvJoyMouseMove);
        document.addEventListener('mouseup',   fvJoyMouseEnd);
    }
}

function removeFairyInput() {
    document.removeEventListener('keydown', fvKeyDown);
    document.removeEventListener('keyup',   fvKeyUp);
    document.removeEventListener('mousemove', fvJoyMouseMove);
    document.removeEventListener('mouseup',   fvJoyMouseEnd);
    // FIX: Hapus juga listener canvas agar tidak menumpuk saat openFairyVillage dipanggil ulang
    if (fvCanvas) {
        fvCanvas.removeEventListener('click',      tapFVDialog);
        fvCanvas.removeEventListener('touchstart', fvCanvasTouchStart);
        fvCanvas.removeEventListener('touchend',   fvCanvasTouchEnd);
    }
}

function fvKeyDown(e){ fvKeys[e.key]=true; if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault(); }
function fvKeyUp(e)  { fvKeys[e.key]=false; }

function fvCanvasTouchStart(e){ e.preventDefault(); tapFVDialog(e); }
function fvCanvasTouchEnd(e)  { e.preventDefault(); }

// Floating joystick — muncul di posisi sentuhan, sama seperti main game
function fvJoyTouchStart(e) {
    e.preventDefault();
    const t=e.touches[0];
    fvJoy.startX=t.clientX; fvJoy.startY=t.clientY;
    fvJoy.active=true; fvJoy.dx=0; fvJoy.dy=0;
    showFVJoyVisual(t.clientX, t.clientY, 0, 0);
}
function fvJoyTouchMove(e) {
    if(!fvJoy.active)return; e.preventDefault();
    const t=e.touches[0];
    let dx=t.clientX-fvJoy.startX, dy=t.clientY-fvJoy.startY;
    const mag=Math.sqrt(dx*dx+dy*dy);
    if(mag>50){dx=dx/mag*50; dy=dy/mag*50;}
    fvJoy.dx=dx; fvJoy.dy=dy;
    showFVJoyVisual(fvJoy.startX, fvJoy.startY, dx, dy);
}
function fvJoyTouchEnd(e) {
    fvJoy.active=false; fvJoy.dx=0; fvJoy.dy=0;
    hideFVJoyVisual();
}
function fvJoyMouseStart(e) {
    fvJoy.startX=e.clientX; fvJoy.startY=e.clientY;
    fvJoy.active=true; fvJoy.dx=0; fvJoy.dy=0;
    showFVJoyVisual(e.clientX, e.clientY, 0, 0);
}
function fvJoyMouseMove(e) {
    if(!fvJoy.active)return;
    let dx=e.clientX-fvJoy.startX, dy=e.clientY-fvJoy.startY;
    const mag=Math.sqrt(dx*dx+dy*dy);
    if(mag>50){dx=dx/mag*50; dy=dy/mag*50;}
    fvJoy.dx=dx; fvJoy.dy=dy;
    showFVJoyVisual(fvJoy.startX, fvJoy.startY, dx, dy);
}
function fvJoyMouseEnd() {
    fvJoy.active=false; fvJoy.dx=0; fvJoy.dy=0;
    hideFVJoyVisual();
}

function showFVJoyVisual(bx,by,dx,dy){
    const base=document.getElementById('fv-joy-base');
    const stick=document.getElementById('fv-joy-stick');
    if(!base||!stick)return;
    const rect=document.getElementById('fv-bottom-bar').getBoundingClientRect();
    base.style.display='block';
    base.style.left=(bx-rect.left-40)+'px';
    base.style.top=(by-rect.top-40)+'px';
    stick.style.left=(40+dx-16)+'px';
    stick.style.top=(40+dy-16)+'px';
}
function hideFVJoyVisual(){
    const base=document.getElementById('fv-joy-base');
    if(base) base.style.display='none';
}

// ─────────────────────────────────────────────────────────────
// HUD
// ─────────────────────────────────────────────────────────────
function updateFVHUD(){
    const fv=getFairyVillage(), stats=getFairyVillageStats(fv);
    const g=id=>document.getElementById(id);
    // Legacy elements (jika ada)
    if(g('fv-hud-debu'))    g('fv-hud-debu').textContent=fv.resources.debu||0;
    if(g('fv-hud-kristal')) g('fv-hud-kristal').textContent=fv.resources.kristal||0;
    if(g('fv-hud-cahaya'))  g('fv-hud-cahaya').textContent=fv.resources.cahaya||0;
    if(g('fv-hud-makanan')) g('fv-hud-makanan').textContent=fv.resources.makanan||0;
    if(g('fv-hud-pop'))     g('fv-hud-pop').textContent=`${fv.fairies.length}/${stats.totalCap}`;
    if(g('fv-hud-queue'))   g('fv-hud-queue').textContent=(fv.buildQueue||[]).length;
    // New top HUD bar
    if(g('fvbar-debu'))    g('fvbar-debu').textContent    = fv.resources.debu    || 0;
    if(g('fvbar-kristal')) g('fvbar-kristal').textContent = fv.resources.kristal || 0;
    if(g('fvbar-cahaya'))  g('fvbar-cahaya').textContent  = fv.resources.cahaya  || 0;
    if(g('fvbar-makanan')) g('fvbar-makanan').textContent = fv.resources.makanan || 0;
    if(g('fvbar-pop'))     g('fvbar-pop').textContent     = `${fv.fairies.length}/${stats.totalCap}`;
    if(g('fvbar-time-label') && typeof getFVTimeOfDay==='function'){
        const _tod3=getFVTimeOfDay(), _sea3=getFVSeason();
        const _ti={pagi:'🌅',siang:'☀️',sore:'🌤️',senja:'🌇',malam:'🌙'};
        g('fvbar-time-label').textContent=(_ti[_tod3]||'🌙')+' '+(_tod3.charAt(0).toUpperCase()+_tod3.slice(1))+'  |  '+_sea3.label;
    }
}

// ─────────────────────────────────────────────────────────────
// TEST MODE
// ─────────────────────────────────────────────────────────────
function openFairyTestMode(){
    const p=STATE.player;
    p.sylvariaQuestComplete=true;
    p.sylvariaQuest={stage:99,task1:true,task2:true,task3:true,task4:true};
    if(!p.spriteIdle) selectGender(p.gender||'boy',true);
    if(!p.name||!p.name.trim()) p.name=document.getElementById('hud-name')?.textContent?.trim()||'Arsa';

    STATE.isPrologue = false;
    STATE.screen = 'play';
    const dialogBox = document.getElementById('dialogue-wrapper');
    if (dialogBox) dialogBox.style.display = 'none';

    const fv = getFairyVillage();
    fv.resources = { debu:9999, kristal:99, cahaya:99, makanan:50 };
    fv.fairies = [
        {id:'t1',name:'Rara Wilis',gender:'girl',level:5,xp:0,happiness:100,mood:'happy',intel:28,agility:22,spirit:30,hp:100,maxHp:100},
        {id:'t2',name:'Wening',    gender:'girl',level:3,xp:0,happiness:90, mood:'happy',intel:20,agility:18,spirit:22,hp:90, maxHp:100},
        {id:'t3',name:'Sekar',     gender:'girl',level:2,xp:0,happiness:85, mood:'happy',intel:16,agility:24,spirit:15,hp:85, maxHp:100},
        {id:'t4',name:'Bening',    gender:'girl',level:1,xp:0,happiness:80, mood:'happy',intel:12,agility:15,spirit:18,hp:80, maxHp:100},
        {id:'t5',name:'Juna',      gender:'boy', level:3,xp:0,happiness:88, mood:'happy',intel:18,agility:25,spirit:14,hp:88, maxHp:100},
    ];
    // Pre-built buildings dengan beberapa worker sudah ditugaskan
    fv.buildings = [
        { slotId:'s1',  bid:'pondok_peri',   workers:['t2'] },
        { slotId:'s7',  bid:'taman_mini',    workers:['t3','t4'] },
        { slotId:'s11', bid:'kolam_kristal', workers:[] },
    ];
    fv.buildQueue = [];
    fv.isTestMode = true;         // tombol test selalu muncul di menu Rara Wilis
    fv.fvTutorialDone = false;    // reset agar tutorial jalan saat masuk
    fv.tutorialDone   = false;    // reset flag lama juga
    fv.isFirstVisit   = false;    // jangan reset resource ke starter (resource sudah di-set di atas)
    refreshFairyVillageMap();
    showToast('🧚 TEST MODE — Masuk Kahyangan Wilis!');
    openFairyVillage();
}

// ══════════════════════════════════════════════════════════════
// 👹 TEST MODE — MONSTER PENCURI SKRIPSI / IJAZAH
// ══════════════════════════════════════════════════════════════
// 👹 TEST MODE — MONSTER PENCURI SKRIPSI / IJAZAH
// Alur: set quest → monster muncul di peta → teleport dekat → klik → battle
// ══════════════════════════════════════════════════════════════
function openSkripsiThiefTestMode() {
    const p = STATE.player;

    // --- 1. Setup dasar player ---
    STATE.isPrologue = false;
    STATE.screen = 'play';
    STATE.isDayChanging = false;

    // Pastikan sprite sudah terpilih
    if (!p.spriteIdle) selectGender(p.gender || 'boy', true);
    if (!p.name || !p.name.trim()) p.name = document.getElementById('hud-name')?.textContent?.trim() || 'Arsa';

    // Tutup semua dialog/modal
    const dialogBox = document.getElementById('dialogue-wrapper');
    if (dialogBox) dialogBox.style.display = 'none';
    if (typeof closeFairyVillage === 'function') closeFairyVillage();

    // --- 2. Boost stat ---
    p.hp = p.maxHp = 200;
    p.energy = 100;
    p.str   = (p.str  || 0) < 30 ? 30 : p.str;
    p.int   = (p.int  || 0) < 20 ? 20 : p.int;
    p.level = (p.level|| 1) < 5  ? 5  : p.level;
    p.role  = p.role || 'student';
    p.attackCooldown = 0; p.skillCooldown = 0;
    p.invincible = false; p.damageCooldown = 0;
    if (typeof STATE.enemies !== 'undefined') STATE.enemies = [];

    // --- 3. Set activeQuest = 'find_draft' agar monster_skripsi muncul di peta ---
    //    (renderer cek STATE.player.activeQuest, bukan p.quests)
    p.activeQuest = 'find_draft';
    if (!p.quests) p.quests = {};
    p.quests['find_draft'] = { status: 'active', day: STATE.day };

    // --- 4. Teleport ke dekat monster (x:50,y:13 di village) ---
    STATE.location = 'village';
    p.x = 47 * TILE_SIZE;
    p.y = 13 * TILE_SIZE;

    // --- 5. Update HUD & tampilkan toast petunjuk ---
    if (typeof updateHUD === 'function') updateHUD();
    showToast('👹 Monster Pencuri Naskah muncul! Dekati dan klik untuk battle!');

    // --- 6. Setelah 600ms tampilkan dialog pengantar singkat ---
    setTimeout(() => {
        showDialogue(
            '👹 TEST MODE — PENCURI NASKAH',
            '🔧 Stat sudah di-boost:\n' +
            `• HP: ${p.hp}/${p.maxHp}  STR: ${p.str}  INT: ${p.int}\n\n` +
            '👁️ Monster Pencuri Naskah sudah muncul di peta!\n' +
            'Dekati lalu klik untuk mulai battle.\n\n' +
            'Atau tekan "⚔️ Langsung Battle!" untuk skip ke arena.',
            [
                {
                    text: '⚔️ Langsung Battle!',
                    action: () => {
                        closeDialogue();
                        setTimeout(() => {
                            if (typeof window.startRuinsBattle === 'function') {
                                window.startRuinsBattle();
                            } else {
                                showToast('⚠️ startRuinsBattle tidak ditemukan!');
                            }
                        }, 200);
                    }
                },
                {
                    text: '🗺️ Oke, Cari Dulu',
                    action: () => {
                        closeDialogue();
                        showToast('📍 Monster ada di sekitar x:50, y:13 — timur laut peta!');
                    }
                }
            ],
            'images/monster-thief.png'
        );
    }, 600);
}

// ── TEST: Trigger kelahiran peri manual (dari menu Rara Wilis di test mode) ──
function testFairyBirth() {
    const fv = getFairyVillage();
    const g = Math.random() < 0.6 ? 'girl' : 'boy';
    const names = g==='girl' ? FAIRY_NAMES_GIRL : FAIRY_NAMES_BOY;
    const spriteIdx = Math.floor(Math.random() * (g==='girl'?4:2));
    const newFairy = {
        id: 'f_test_'+Date.now(),
        name: names[Math.floor(Math.random()*names.length)],
        gender:g, level:1, xp:0, happiness:80, mood:'happy',
        intel:_fairyStat(), agility:_fairyStat(), spirit:_fairyStat(),
        hp:80+Math.floor(Math.random()*20), maxHp:100,
        spriteIdx, isBorn:true,
    };
    fv.fairies.push(newFairy);
    if (typeof closeDialogue==='function') closeDialogue();
    setTimeout(()=>showFairyBirthPopup(newFairy, '🏠 Pondok Peri'), 200);
}

// ─────────────────────────────────────────────────────────────
// LEGACY STUBS
// ─────────────────────────────────────────────────────────────
function earnFairyKristal(amount){
    const fv=getFairyVillage();
    fv.resources.kristal=(fv.resources.kristal||0)+amount;
    showToast(`💎 +${amount} Kristal Brantas!`);
}

