            // ═══════════════════════════════════════════════════════════════
            // SISTEM DEBUG GLOBAL — dikendalikan via Admin Panel
            // Cara pakai: if (window.GAME_DEBUG) console.log(...)
            // ═══════════════════════════════════════════════════════════════

            var _DEBUG_STORAGE_KEY = 'nusantara_debug_mode';

            // Baca state dari localStorage saat halaman dimuat
            window.GAME_DEBUG = localStorage.getItem(_DEBUG_STORAGE_KEY) === 'true';

            // PENTING: JANGAN override console.log/warn di sini karena akan
            // merusak Firebase SDK dan library lain yang butuh console saat init.
            // Console filtering hanya berlaku untuk log game buatan kita sendiri.
            // Gunakan pola:  if (window.GAME_DEBUG) console.log("...")

            function setDebugMode(enabled) {
                window.GAME_DEBUG = !!enabled;
                localStorage.setItem(_DEBUG_STORAGE_KEY, window.GAME_DEBUG ? 'true' : 'false');

                // Sinkron ke Firestore
                if (typeof db !== 'undefined' && db) {
                    db.collection('artifacts').doc('nusantara-arsa')
                      .set({ debugMode: window.GAME_DEBUG }, { merge: true })
                      .catch(function(e) { console.warn('Debug sync fail:', e); });
                }

                // Update HUD badge
                var badge = document.getElementById('debug-hud-badge');
                if (badge) badge.style.display = window.GAME_DEBUG ? 'flex' : 'none';

                // Tampilkan / sembunyikan tombol TEST MODE di HUD
                ['fairy-test-btn', 'skripsi-test-btn'].forEach(function(id) {
                    var btn = document.getElementById(id);
                    if (btn) btn.style.display = window.GAME_DEBUG ? 'flex' : 'none';
                });

                // Update tampilan panel debug
                renderDebugPage();
            }

            function renderDebugPage() {
                var container = document.getElementById('debug-page-content');
                if (!container) return;

                var isOn = window.GAME_DEBUG;
                var statusColor = isOn ? '#4ade80' : '#f87171';
                var statusText  = isOn ? 'AKTIF' : 'NON-AKTIF';
                var statusBg    = isOn ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)';
                var btnOnActive  = isOn  ? 'opacity:0.6; cursor:default;' : 'cursor:pointer;';
                var btnOffActive = !isOn ? 'opacity:0.6; cursor:default;' : 'cursor:pointer;';

                var html = '';
                html += '<div style="background:' + statusBg + '; border:2px solid ' + statusColor + '; border-radius:16px; padding:20px 24px; margin-bottom:20px; display:flex; align-items:center; gap:16px; flex-wrap:wrap;">';
                html += '  <div style="font-size:40px;">' + (isOn ? '🟢' : '🔴') + '</div>';
                html += '  <div style="flex:1;">';
                html += '    <div style="font-size:18px; font-weight:800; color:' + statusColor + '; font-family:Fredoka,sans-serif;">DEBUG MODE ' + statusText + '</div>';
                html += '    <div style="font-size:11px; color:#64748b; margin-top:4px;">' + (isOn ? 'Console log aktif · Map boundary tampil · HUD badge tampil' : 'Game berjalan bersih untuk siswa') + '</div>';
                html += '  </div>';
                html += '</div>';

                html += '<div style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap;">';
                html += '  <button onclick="setDebugMode(true)" style="' + btnOnActive + ' background:linear-gradient(135deg,#16a34a,#15803d); border:2px solid #4ade80; color:#fff; padding:14px 28px; font-size:14px; font-family:Fredoka,sans-serif; font-weight:700; border-radius:12px; min-width:160px;">🟢 Aktifkan Debug</button>';
                html += '  <button onclick="setDebugMode(false)" style="' + btnOffActive + ' background:linear-gradient(135deg,#374151,#4b5563); border:2px solid #6b7280; color:#d1d5db; padding:14px 28px; font-size:14px; font-family:Fredoka,sans-serif; font-weight:700; border-radius:12px; min-width:160px;">⛔ Matikan Debug</button>';
                html += '</div>';

                html += '<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:12px; margin-bottom:24px;">';
                html += '  <div style="background:#fff; border-radius:12px; padding:16px; border:2px solid #e2e8f0;"><div style="font-size:20px; margin-bottom:8px;">📋</div><div style="font-weight:700; color:#1e293b; font-size:12px; margin-bottom:4px;">Console Log</div><div style="font-size:11px; color:#64748b; line-height:1.6;">' + (isOn ? '✅ console.log & console.warn tampil di DevTools' : '⛔ Sembunyikan log — pakai if(GAME_DEBUG) sendiri') + '</div></div>';
                html += '  <div style="background:#fff; border-radius:12px; padding:16px; border:2px solid #e2e8f0;"><div style="font-size:20px; margin-bottom:8px;">🗺️</div><div style="font-weight:700; color:#1e293b; font-size:12px; margin-bottom:4px;">Map Boundaries</div><div style="font-size:11px; color:#64748b; line-height:1.6;">' + (isOn ? '✅ Garis collision tampil di peta' : '⛔ Boundary tersembunyi') + '</div></div>';
                html += '  <div style="background:#fff; border-radius:12px; padding:16px; border:2px solid #e2e8f0;"><div style="font-size:20px; margin-bottom:8px;">🏷️</div><div style="font-weight:700; color:#1e293b; font-size:12px; margin-bottom:4px;">Debug HUD Badge</div><div style="font-size:11px; color:#64748b; line-height:1.6;">' + (isOn ? '✅ Badge DEBUG ON tampil di kiri atas' : '⛔ Badge tersembunyi') + '</div></div>';
                html += '  <div style="background:#fff; border-radius:12px; padding:16px; border:2px solid #e2e8f0;"><div style="font-size:20px; margin-bottom:8px;">🔧</div><div style="font-weight:700; color:#1e293b; font-size:12px; margin-bottom:4px;">Test Mode Buttons</div><div style="font-size:11px; color:#64748b; line-height:1.6;">' + (isOn ? '✅ Tombol 🧚 Test Peri & 👹 Test Skripsi muncul di HUD' : '⛔ Test mode disembunyikan dari siswa') + '</div></div>';
                html += '</div>';

                html += '<div style="background:#0f172a; border-radius:12px; padding:16px; font-family:monospace;">';
                html += '  <div style="color:#94a3b8; font-size:10px; margin-bottom:10px; letter-spacing:1px;">▶ LIVE STATE SNAPSHOT</div>';
                html += '  <div id="debug-snapshot" style="font-size:11px; color:#a3e635; line-height:1.9;"></div>';
                html += '</div>';

                container.innerHTML = html;
                updateDebugSnapshot();
            }

            function updateDebugSnapshot() {
                var el = document.getElementById('debug-snapshot');
                if (!el) return;
                try {
                    var p = (typeof STATE !== 'undefined') ? STATE.player : null;
                    var lines = [];
                    lines.push('window.GAME_DEBUG = ' + window.GAME_DEBUG);
                    if (p) {
                        lines.push('STATE.screen     = "' + STATE.screen + '"');
                        lines.push('STATE.location   = "' + STATE.location + '"');
                        lines.push('STATE.day        = ' + STATE.day + ' | season: ' + STATE.season);
                        lines.push('player.level     = ' + p.level + ' | hp: ' + p.hp + '/' + p.maxHp);
                        lines.push('player.role      = "' + p.role + '" | money: ' + p.money);
                        lines.push('DataService.mode = "' + (typeof DataService !== 'undefined' ? DataService.mode : 'n/a') + '"');
                    } else {
                        lines.push('STATE belum tersedia (game belum dimulai)');
                    }
                    el.innerText = lines.join('\n');
                } catch(e) {
                    el.innerText = 'Error membaca STATE: ' + e.message;
                }
            }

            // Refresh snapshot tiap 2 detik saat halaman debug terbuka
            setInterval(function() {
                var page = document.getElementById('page-debug');
                if (page && !page.classList.contains('hidden')) {
                    updateDebugSnapshot();
                }
            }, 2000);

            /** * FIREBASE CONFIGURATION */
            const firebaseConfig = {
                apiKey: "AIzaSyAdqApOvuUXrZUO19NfiqZCLSyUYR74w5M",
                authDomain: "waliq-ded98.firebaseapp.com",
                projectId: "waliq-ded98",
                storageBucket: "waliq-ded98.firebasestorage.app",
                messagingSenderId: "915222555864",
                appId: "1:915222555864:web:25320841c97661172e3bad",
                measurementId: "G-K51RW0YQ0M"
            };

            let db;
            let analytics;

            /** * APP FLOW LOGIC */
            const SESSION_KEY = 'sc_session_email';

            // --- GLOBAL LOOP CONTROLLERS (FIX: Mencegah Loop Ganda via Window Object) ---
            // UPDATE: Menggunakan window.variable agar persist saat script reload
            if (window.gameLoopId === undefined) window.gameLoopId = null;
            if (window.saveIntervalId === undefined) window.saveIntervalId = null;

            // --- ASSET LOADER (UPDATED FOR NEW BG & TREES) ---
            // REMOVED: tileset.png loader (deprecated)

            const treeAssets = {
                // shadow: new Image(), // SHADOW DIHAPUS (Tidak diload)
                trunk: new Image(),
                canopy: new Image(),
                sakuraTrunk: new Image(),
                sakuraCanopy: new Image()
            };

            // Fallback Base64 (Jika file gambar tidak ditemukan)
            const treeFallbacks = {
                trunk: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMTIiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjNWQ0MDM3Ii8+PC9zdmc+',
                canopy: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjgiIGZpbGw9IiMxNmEzNGEiIHN0cm9rZT0iIzE0NTMyZCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
                sakuraTrunk: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMTIiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjNWQ0MDM3Ii8+PC9zdmc+',
                sakuraCanopy: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjgiIGZpbGw9IiZmNDcyYjYiIHN0cm9rZT0iI2RiMjc3NyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'
            };

            // NEW: ASSET TAS (Load gambar tas)
            const bagAssets = {
                empty: new Image(),
                full: new Image()
            };
            // Set src
            bagAssets.empty.src = 'images/tas-kosong.png';
            bagAssets.full.src = 'images/tas-isi.png';
            // Fallback visual tas jika gambar tidak ada
            const bagFallback = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHBhdGggZD0iTTIwIDIwIEw0NCAyMCBMNTQgNTAgTDEwIDUwIFoiIGZpbGw9IiM3ODM1MGYiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTI2IDIwIEwyNiAxMCBZMzggMTAgTDM4IDIwIiBzdHJva2U9IiNmZmYiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==';

            bagAssets.empty.onerror = function () { this.src = bagFallback; };
            bagAssets.full.onerror = function () { this.src = bagFallback; }; // Bisa dibedakan warnanya nanti jika mau

            // Load Images (Trunk & Canopy Only)
            ['trunk', 'canopy', 'sakuraTrunk', 'sakuraCanopy'].forEach(key => {
                treeAssets[key].onerror = function () {
                    this.onerror = null; // Anti-loop fix
                    console.warn(`Gagal memuat aset pohon ${key}, menggunakan fallback.`);
                    this.src = treeFallbacks[key];
                };

                // Set src asli
                if (key === 'trunk') treeAssets[key].src = 'images/pohon-trunk.png';
                if (key === 'canopy') treeAssets[key].src = 'images/pohon-kanopi.png';
                if (key === 'sakuraTrunk') treeAssets[key].src = 'images/batang-sakura.png';
                if (key === 'sakuraCanopy') treeAssets[key].src = 'images/pohon-sakura.png';
            });

            // --- NEW: GRASS & PLANT ASSETS ---
            const grassAssets = {
                grass1: new Image(),
                grass2: new Image(),
                flower: new Image()
            };

            // Fallback untuk rumput/bunga (Hijau dan Merah Muda)
            const grassFallbacks = {
                grass1: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMWU0MDVmIi8+PHBhdGggZD0iTTEwIDIwIEwxNSAxMCBMMjAgMjAiIGZpbGw9IiMxNTgwM2QiLz48L3N2Zz4=',
                grass2: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMWU0MDVmIi8+PHBhdGggZD0iTTUgMjUgTDEwIDE1IEwxNSAyNSBNMjAgMjUgTDI1IDE1IEwzMCAyNSIgZmlsbD0iIzE1ODAzZCIvPjwvc3ZnPg==',
                flower: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGNpcmNsZSBjeD0iMTYiIGN5PSIzMCIgcj0iMiIgZmlsbD0iIzE1ODAzZCIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMjQiIHI9IjQiIGZpbGw9IiNmNDcyYjYiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjI0IiByPSIyIiBmaWxsPSIjZmZjMTA3Ii8+PC9zdmc+'
            };

            ['grass1', 'grass2', 'flower'].forEach(key => {
                // ANTI-LOOP FIX
                grassAssets[key].onerror = function () {
                    this.onerror = null; // CRITICAL FIX: Hentikan loop error
                    this.src = grassFallbacks[key];
                };
                if (key === 'grass1') grassAssets[key].src = 'images/rumput.png';
                if (key === 'grass2') grassAssets[key].src = 'images/rumput2.png';
                if (key === 'flower') grassAssets[key].src = 'images/bunga.png';
            });

            // --- NEW: MISC ASSETS (SALJU) ---
            const miscAssets = {
                snowman: new Image()
            };
            miscAssets.snowman.src = 'images/snowman.png';

            // Fallback SVG (Gambar Boneka Salju Sederhana)
            miscAssets.snowman.onerror = function () {
                this.onerror = null;
                // Gambar SVG: Dua bola putih + Hidung Oren + Mata Hitam
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI2NCI+PGNpcmNsZSBjeD0iMTYiIGN5PSI0OCIgcj0iMTQiIGZpbGw9IiNmMmYyZjIiIHN0cm9rZT0iI2RiZTYWZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSIyNCIgcj0iMTAiIGZpbGw9IiNmZmYiIHN0cm9rZT0iI2RiZTYWZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTMiIGN5PSIyMiIgcj0iMSIgZmlsbD0iIzAwMCIvPjxjaXJjbGUgY3g9IjE5IiBjeT0iMjIiIHI9IjEiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNMTY 2NCBMMyA3NiBMNiA2NCIgZmlsbD0iI2Y5NzMwNiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMzYiIHI9IjIiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjQ0IiByPSIyIiBmaWxsPSIjMzMzIi8+PC9zdmc+';
            };

            // --- NEW: FARM ASSETS (LAHAN PERTANIAN) ---
            const farmAssets = {
                lahanLiar: new Image()
            };
            farmAssets.lahanLiar.src = 'images/lahan-liar.png';
            // Fallback visual tanah kotor (SVG Pattern) jika gambar gagal load
            farmAssets.lahanLiar.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjOGI0NTEzIi8+PHBhdGggZD0iTTUgNSBMMjUgMjUgTTEwIDI1IEwyMCA1IiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+';
            };

            // --- NEW: CANDI ASSETS (LANTAI KHUSUS) ---
            const candiAssets = {
                floor: new Image(),
                redFloor: new Image() // NEW: Lantai Merah Candi
            };
            candiAssets.floor.src = 'images/lantaicandi.png';
            candiAssets.redFloor.src = 'images/lantaimerahcandi.png';

            // Fallback visual jika gambar gagal load (Warna Batu Tua)
            candiAssets.floor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNDQ0MDNjIi8+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSJub25lIiBzdHJva2U9IiM1NzUzNGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
            };
            // NEW: Fallback visual lantai merah
            candiAssets.redFloor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjOTkxYjFiIi8+PHBhdGggZD0iTTAgMCBMMzIgMzIgTTE2IDAgTDMyIDE2IE0wIDEwIEwyMiAzMiIgc3Ryb2tlPSIjN2YxZDFkIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==';
            };

            // --- NEW: RUINS ASSETS (LANTAI & TEMBOK RERUNTUHAN) ---
            const ruinsAssets = {
                floor: new Image(),
                wall: new Image() // NEW: Aset Tembok
            };
            ruinsAssets.floor.src = 'images/lantai-reruntuhan.png';
            ruinsAssets.wall.src = 'images/tembok-reruntuhan.png'; // NEW: Set Source Tembok

            // Fallback visual batu pecah/kuno jika gambar gagal load
            ruinsAssets.floor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjN2M3YzdmIi8+PHBhdGggZD0iTTAgMCBMMzIgMzIgTTE2IDAgTDMyIDE2IE0wIDEwIEwyMiAzMiIgc3Ryb2tlPSIjNTA1MDU1IiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==';
            };
            // NEW: Fallback visual tembok reruntuhan
            ruinsAssets.wall.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNDQ0MDNjIi8+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjN2M3YzdmIi8+PHJlY3QgeD0iMTgiIHk9IjE4IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiM3YzdjN2YiLz48cGF0aCBkPSJNMCAzMiBMMzIgMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==';
            };

            // NEW: LOAD SEASONAL BACKGROUNDS
            const bgSeasons = {
                spring: new Image(),
                summer: new Image(),
                autumn: new Image(),
                winter: new Image()
            };

            // Set Sources
            bgSeasons.spring.src = 'images/bg-pulau.png';
            bgSeasons.summer.src = 'images/bg-pulau-panas.png';
            bgSeasons.autumn.src = 'images/bg-pulau-gugur.png';
            bgSeasons.winter.src = 'images/bg-pulau-salju.png';

            // NEW: LOAD HOUSE INTERIORS (LEVEL 1-5)
            const houseBgAssets = {
                level1: new Image(),
                level2: new Image(),
                level3: new Image(),
                level4: new Image(),
                level5: new Image()
            };
            houseBgAssets.level1.src = 'images/rumahindoor_level1.png';
            houseBgAssets.level2.src = 'images/rumahindoor_level2.png';
            houseBgAssets.level3.src = 'images/rumahindoor_level3.png';
            houseBgAssets.level4.src = 'images/rumahindoor_level4.png';
            houseBgAssets.level5.src = 'images/rumahindoor_level5.png';

            // NEW: DUNGEON & MONSTER ASSETS (PREPARATION)
            const dungeonAssets = {
                wall: new Image(),
                floor: new Image(),
                rock: new Image(),
                // UPDATE: Asset Monster Berjenjang
                enemy1: new Image(),
                enemy2: new Image(),
                enemy3: new Image(),
                enemy4: new Image(),
                enemy5: new Image(), // NEW: Monster Level 5
                thief: new Image(),  // NEW: Monster Pencuri Skripsi
                boss: new Image()
            };
            dungeonAssets.wall.src = 'images/dungeon_wall.png';   // Ukuran 30x30
            dungeonAssets.floor.src = 'images/dungeon_floor.png'; // Ukuran 30x30
            dungeonAssets.rock.src = 'images/batudidungeon.png';  // Set gambar batu khusus

            // Load Monster Images
            dungeonAssets.enemy1.src = 'images/monster.png';
            dungeonAssets.enemy2.src = 'images/monster-lvl2.png';
            dungeonAssets.enemy3.src = 'images/monster-lvl3.png';
            dungeonAssets.enemy4.src = 'images/monster-lvl4.png';
            dungeonAssets.enemy5.src = 'images/monster-lvl5.png';
            dungeonAssets.thief.src = 'images/monster-thief.png'; // Monster Skripsi
            dungeonAssets.boss.src = 'images/monster-boss.png';

            // NEW: WALL ASSETS (Custom Walls)
            const wallAssets = {
                school: new Image(),
                schoolFloor: new Image(), // NEW: Aset Lantai Kampus
                libraryFloor: new Image(), // NEW: Aset Lantai Perpus
                libraryWall: new Image(),   // NEW: Aset Tembok Perpus
                guildFloor: new Image(),    // NEW: Aset Lantai Guild
                guildWall: new Image(),      // NEW: Aset Tembok Guild
                houseWall: new Image(),       // NEW: Aset Tembok Rumah Player
                houseWallBottom: new Image(),  // NEW: Aset Tembok Bawah Rumah Player
                blacksmithWall: new Image()   // NEW: Aset Tembok Blacksmith
            };
            wallAssets.school.src = 'images/tiletembokkampus.png';
            wallAssets.schoolFloor.src = 'images/tilelantaikampus.png';
            wallAssets.libraryFloor.src = 'images/tilelantaiperpus.png';
            wallAssets.libraryWall.src = 'images/tiletembokperpus.png';
            wallAssets.guildFloor.src = 'images/tilelantaiguild.png';
            wallAssets.guildWall.src = 'images/tiletembokguild.png';
            wallAssets.houseWall.src = 'images/tiletembokrumahplayer.png';
            wallAssets.houseWallBottom.src = 'images/titletembokbawahplayer.png';
            wallAssets.blacksmithWall.src = 'images/tiletembokblacksmith.png'; // Set Source Baru

            // --- NEW: CLINIC ASSETS (LANTAI KLINIK) ---
            const clinicAssets = {
                floor: new Image()
            };
            clinicAssets.floor.src = 'images/lantaiklinik.png';
            // Fallback visual lantai putih bersih jika gambar gagal load
            clinicAssets.floor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZjFmNWY5Ii8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMmU4ZjAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==';
            };

            // --- NEW: MENTOR ASSETS (LANTAI RUMAH MENTOR) ---
            const mentorAssets = {
                floor: new Image()
            };
            mentorAssets.floor.src = 'images/lantaimentor.png';
            // Fallback visual lantai kayu klasik/elegan jika gambar gagal load
            mentorAssets.floor.onerror = function () {
                this.onerror = null;
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNmM0YTNmIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==';
            };

            let bgLoadedCount = 0;
            const onBgLoad = () => {
                bgLoadedCount++;
                console.log(`Background loaded: ${bgLoadedCount}/4`);
            };

            // Attach listeners
            Object.values(bgSeasons).forEach(img => {
                img.onload = onBgLoad;
                img.onerror = () => console.error("Gagal memuat background musiman");
            });

            // --- AUDIO SYSTEM (UPDATED: SEASONAL MUSIC) ---
            const AudioService = {
                enabled: false,
                tracks: {
                    opening: new Audio('audio/opening.mp3'),
                    village: new Audio('audio/audiopulau.mp3'), // Musik Default
                    sea: new Audio('audio/laut.mp3'),
                    rain: new Audio('audio/hujan.mp3'),
                    bird: new Audio('audio/burung.mp3'),
                    night: new Audio('audio/malam.mp3'),

                    // --- NEW: MUSIK MUSIMAN ---
                    spring: new Audio('audio/spring.mp3'),   // Musim Semi
                    summer: new Audio('audio/summer.mp3'),   // Musim Panas
                    autumn: new Audio('audio/fall.mp3'),     // Musim Gugur (Fall)
                    winter: new Audio('audio/winter.mp3'),   // Musim Dingin

                    // Audio Hewan & SFX
                    kambing: new Audio('audio/kambing.mp3'),
                    sapi: new Audio('audio/sapi.mp3'),
                    ayam: new Audio('audio/ayam.mp3'),
                    kuda: new Audio('audio/kuda.mp3'),
                    door: new Audio('audio/door.mp3'),
                    hit: new Audio('audio/pukul.mp3'),
                    item: new Audio('audio/item.mp3'),
                    bg: new Audio('audio/bg.mp3'),
                    chat: new Audio('audio/chat.mp3'),
                    inside: new Audio('audio/inside.mp3'),
                    dungeon: new Audio('audio/dungeon.mp3'),
                    boss: new Audio('audio/boss.mp3'),
                    battle: new Audio('audio/battle.mp3'),       // FIX: BGM battle/combat di dungeon
                    knock: new Audio('audio/knock.mp3'),
                    wedding: new Audio('audio/wedding.mp3'),
                    pulauperi: new Audio('audio/pulauperi.mp3'),
                    insideperi: new Audio('audio/insideperi.mp3') // FIX: Musik dalam bangunan pulau peri
                },
                currentTrack: null,
                currentAmbience: null, // NEW: Track Ambience (Suara Latar)

                init: function () {
                    try {
                        // Set Looping untuk Musik Latar
                        if (this.tracks.opening) this.tracks.opening.loop = true;
                        if (this.tracks.village) this.tracks.village.loop = true;
                        if (this.tracks.night) this.tracks.night.loop = true;
                        if (this.tracks.sea) this.tracks.sea.loop = true;
                        if (this.tracks.rain) this.tracks.rain.loop = true;
                        if (this.tracks.inside) this.tracks.inside.loop = true;
                        if (this.tracks.dungeon) this.tracks.dungeon.loop = true;
                        if (this.tracks.boss) this.tracks.boss.loop = true;
                        if (this.tracks.wedding) this.tracks.wedding.loop = true;

                        // --- MUSIK KAHYANGAN WILIS ---
                        if (this.tracks.pulauperi) this.tracks.pulauperi.loop = true;
                        if (this.tracks.insideperi) this.tracks.insideperi.loop = true;  // FIX: loop dalam bangunan peri
                        if (this.tracks.battle) this.tracks.battle.loop = true;           // FIX: loop battle music

                        // --- NEW: SETTING MUSIK MUSIM ---
                        if (this.tracks.spring) this.tracks.spring.loop = true;
                        if (this.tracks.summer) this.tracks.summer.loop = true;
                        if (this.tracks.autumn) this.tracks.autumn.loop = true;
                        if (this.tracks.winter) this.tracks.winter.loop = true;

                        // Set Volume Default
                        if (this.tracks.opening) this.tracks.opening.volume = 0.5;
                        if (this.tracks.village) this.tracks.village.volume = 0.5;
                        // Ambience Volume (Agak kecil agar tidak menutupi musik)
                        if (this.tracks.night) this.tracks.night.volume = 0.6;
                        if (this.tracks.sea) this.tracks.sea.volume = 0.0;
                        if (this.tracks.rain) this.tracks.rain.volume = 0.4;
                        if (this.tracks.bird) this.tracks.bird.volume = 0.3;

                        // --- NEW: VOLUME MUSIK MUSIM ---
                        if (this.tracks.spring) this.tracks.spring.volume = 0.5;
                        if (this.tracks.summer) this.tracks.summer.volume = 0.5;
                        if (this.tracks.autumn) this.tracks.autumn.volume = 0.5;
                        if (this.tracks.winter) this.tracks.winter.volume = 0.5;

                        // Volume SFX
                        if (this.tracks.kambing) this.tracks.kambing.volume = 0.6;
                        if (this.tracks.sapi) this.tracks.sapi.volume = 0.6;
                        if (this.tracks.ayam) this.tracks.ayam.volume = 0.4;
                        if (this.tracks.kuda) this.tracks.kuda.volume = 0.6;
                        if (this.tracks.door) this.tracks.door.volume = 0.8;
                        if (this.tracks.hit) this.tracks.hit.volume = 0.7;
                        if (this.tracks.item) this.tracks.item.volume = 0.8;
                        if (this.tracks.bg) this.tracks.bg.volume = 0.8;
                        if (this.tracks.chat) this.tracks.chat.volume = 0.8;
                        if (this.tracks.inside) this.tracks.inside.volume = 0.5;
                        if (this.tracks.dungeon) this.tracks.dungeon.volume = 0.6;
                        if (this.tracks.boss) this.tracks.boss.volume = 0.8;
                        if (this.tracks.battle) this.tracks.battle.volume = 0.75;         // FIX: volume battle
                        if (this.tracks.knock) this.tracks.knock.volume = 1.0;
                        if (this.tracks.wedding) this.tracks.wedding.volume = 0.8;
                        if (this.tracks.pulauperi) this.tracks.pulauperi.volume = 0.55;
                        if (this.tracks.insideperi) this.tracks.insideperi.volume = 0.6;  // FIX: volume insideperi
                    } catch (e) {
                        console.warn("Audio Init Error (Non-Fatal):", e);
                    }
                },

                playBGM: function (trackName) {
                    if (!this.enabled) return;
                    // FIX: Jika track sama tapi sudah pause (gagal main sebelumnya), coba play ulang
                    if (this.currentTrack === trackName) {
                        const t = this.tracks[trackName];
                        if (t && t.paused) {
                            t.play().catch(() => {});
                        }
                        return;
                    }

                    // Stop track sebelumnya
                    if (this.currentTrack && this.tracks[this.currentTrack]) {
                        this.tracks[this.currentTrack].pause();
                        this.tracks[this.currentTrack].currentTime = 0;
                    }

                    // Mainkan track baru
                    this.currentTrack = trackName;
                    if (this.tracks[trackName]) {
                        const playPromise = this.tracks[trackName].play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                // console.log("Audio play prevented/interrupted:", error);
                            });
                        }
                    }
                },


                // --- NEW: FUNGSI AMBIENCE (SUARA LATAR) ---
                playAmbience: function (trackName) {
                    if (!this.enabled) return;
                    if (this.currentAmbience === trackName) return;

                    // Stop ambience sebelumnya
                    this.stopAmbience();

                    this.currentAmbience = trackName;
                    if (this.tracks[trackName]) {
                        this.tracks[trackName].play().catch(() => { });
                    }
                },

                stopAmbience: function () {
                    if (this.currentAmbience && this.tracks[this.currentAmbience]) {
                        this.tracks[this.currentAmbience].pause();
                        this.tracks[this.currentAmbience].currentTime = 0;
                    }
                    this.currentAmbience = null;
                },




                playSFX: function (trackName) {
                    if (!this.enabled) return;
                    const track = this.tracks[trackName];
                    if (track) {
                        track.currentTime = 0;
                        track.loop = false;
                        const playPromise = track.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(() => { });
                        }
                    }
                },

                stopBGM: function () {
                    if (this.currentTrack && this.tracks[this.currentTrack]) {
                        this.tracks[this.currentTrack].pause();
                        this.tracks[this.currentTrack].currentTime = 0;
                        this.currentTrack = null;
                    }
                },

                update: function () {
                    if (!this.enabled) return;

                    // 1. UPDATE BGM UTAMA
                    // FIX: Juga update saat screen === 'cutscene' agar musik dungeon/boss
                    // tidak berhenti ketika cutscene dimainkan
                    const _scr = STATE.screen;
                    if (_scr === 'title' || _scr === 'login' || _scr === 'prologue') {
                        this.playBGM('opening');
                    } else if (_scr === 'play' || _scr === 'cutscene') {
                        if (STATE.location === 'village') {
                            // Hanya update musik saat screen benar-benar play (bukan cutscene)
                            if (_scr === 'play') {
                                if (STATE.season === 'spring') {
                                    this.playBGM('spring');
                                } else if (STATE.season === 'summer') {
                                    this.playBGM('summer');
                                } else if (STATE.season === 'autumn') {
                                    this.playBGM('autumn');
                                } else if (STATE.season === 'winter') {
                                    this.playBGM('winter');
                                } else {
                                    this.playBGM('village');
                                }
                                if (STATE.time >= 1800 || STATE.time < 500) {
                                    this.playAmbience('night');
                                } else {
                                    this.stopAmbience();
                                }
                            }
                        } else if (STATE.location === 'dungeon') {
                            this.stopAmbience();
                            if (STATE.bossSpawned) {
                                this.playBGM('boss');
                            } else if (this.tracks.battle && this.tracks.battle.src &&
                                       this.tracks.battle.src !== window.location.href &&
                                       this.tracks.battle.readyState > 0) {
                                this.playBGM('battle');
                            } else {
                                this.playBGM('dungeon');
                            }
                        } else if (STATE.location === 'ruins_battle') {
                            // Monster Pencuri Skripsi — selalu pakai boss music
                            this.stopAmbience();
                            this.playBGM('boss');
                        } else if (STATE.location === 'fairyVillage') {
                            this.stopAmbience();
                            // Jangan override insideperi saat popup interior bangunan sedang terbuka
                            const _fvInteriorOpen = !!document.getElementById('fv-building-interior');
                            if (!_fvInteriorOpen) {
                                this.playBGM('pulauperi');
                            }
                        } else {
                            this.stopAmbience();
                            if (STATE.location === 'wedding_interior') {
                                this.playBGM('wedding');
                            } else {
                                this.playBGM('inside');
                            }
                        }
                    }

                    // 2. UPDATE SFX HUJAN
                    if ((STATE.weather === 'rain' || STATE.weather === 'snow') && STATE.location === 'village') {
                        if (this.tracks.rain && this.tracks.rain.paused) this.tracks.rain.play().catch(() => { });
                    } else {
                        if (this.tracks.rain && !this.tracks.rain.paused) this.tracks.rain.pause();
                    }

                    // 3. UPDATE SFX LAUT (Hanya jika di desa)
                    if (STATE.location === 'village' && this.tracks.sea) {
                        const margin = 15 * TILE_SIZE;
                        const mapW = ISLAND_W * TILE_SIZE;
                        const mapH = ISLAND_H * TILE_SIZE;

                        const distLeft = STATE.player.x;
                        const distRight = mapW - STATE.player.x;
                        const distTop = STATE.player.y;
                        const distBottom = mapH - STATE.player.y;

                        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

                        if (minDist < margin) {
                            if (this.tracks.sea.paused) {
                                const p = this.tracks.sea.play();
                                if (p !== undefined) p.catch(() => { });
                            }
                            const vol = Math.max(0, 1 - (minDist / margin)) * 0.8;
                            this.tracks.sea.volume = vol;
                        } else {
                            if (!this.tracks.sea.paused) {
                                this.tracks.sea.pause();
                                this.tracks.sea.currentTime = 0;
                            }
                        }

                        // 4. UPDATE SFX BURUNG
                        if (STATE.time > 400 && STATE.time < 1800 && STATE.weather === 'clear') {
                            if (Math.random() < 0.005) {
                                if (this.tracks.bird && this.tracks.bird.paused) {
                                    this.tracks.bird.currentTime = 0;
                                    this.tracks.bird.play().catch(() => { });
                                }
                            }
                        }

                    } else {
                        if (this.tracks.sea) this.tracks.sea.pause();
                        if (this.tracks.bird) this.tracks.bird.pause();
                    }
                }
            };

            // KONFIGURASI UKURAN TILE
            const SRC_TILE_SIZE = 32;

            // TILESET MAPPING (ATLAS)
            const TILE_ATLAS = {
                0: { x: 2, y: 0 }, // Water
                1: { x: 0, y: 0 }, // Grass
                5: { x: 1, y: 0 }, // Earth
                6: { x: 3, y: 0 }, // Magic Floor
                4: { x: 4, y: 0 }, // Dungeon Floor
                10: { x: 5, y: 0 } // Wood Floor
            };
            // --- END ASSET LOADER ---

            // --- NEW FUNCTION: SHOW DAILY QUEST ---
            let currentQuestTab = 'daily'; // Track active tab

            function showDailyQuestPopup() {
                // Jangan munculkan di Prologue atau Cutscene
                if (STATE.isPrologue || STATE.screen === 'cutscene') return;

                // UPDATE: Ganti 'bg' ke 'item' agar suara lebih terdengar jelas (klik)
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const popup = document.getElementById('daily-quest-popup');
                const title = document.getElementById('quest-day-title');
                const sub = document.getElementById('quest-season-subtitle');

                // Update Text Header
                title.innerText = `HARI KE-${STATE.day}`;
                // 1 Tahun = 120 Hari (4 Musim x 30 Hari)
                const year = Math.floor((STATE.day - 1) / 120) + 1;
                sub.innerText = `${STATE.season.toUpperCase()} - TAHUN KE-${year}`;

                // Render Content Default (Last Active Tab)
                switchQuestTab(currentQuestTab);

                // Show
                popup.style.display = 'flex';
                STATE.screen = 'modal'; // Pause game input
            }

            // Helper untuk Toggle via Tombol
            function toggleDailyQuest() {
                const popup = document.getElementById('daily-quest-popup');
                if (popup.style.display === 'flex') {
                    closeDailyQuest();
                } else {
                    showDailyQuestPopup();
                }
            }

            // FIX: Menambahkan fungsi closeDailyQuest yang sebelumnya hilang
            function closeDailyQuest() {
                // NEW: Tambahkan SFX saat menutup jurnal agar ada feedback
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                const popup = document.getElementById('daily-quest-popup');
                if (popup) popup.style.display = 'none';
                STATE.screen = 'play'; // Resume game
            }

            function switchQuestTab(tabName) {
                currentQuestTab = tabName;

                // Update UI Tabs
                document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
                const activeBtn = document.getElementById('tab-' + tabName);
                if (activeBtn) activeBtn.classList.add('active');

                // Update Content
                const content = document.getElementById('quest-list-content');
                content.innerHTML = getQuestContent(tabName);
            }

            // --- DAILY COMPLETION CHECK (diperbarui sesuai quest baru) ---
            function checkDailyCompletion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;

                // Syarat Wajib Umum
                const condGeneral    = p.energy < 100;
                const hasJournal     = p.reflections && p.reflections.some(r => r.day === STATE.day);
                const hasTalked      = (p.dailyTalkCount || 0) >= 1;
                const hasMonsterKill = (p.dailyMonsterKills || 0) >= 2;
                const hasFishing     = (p.dailyFishingCount || 0) >= 1;

                // Syarat Role Spesifik
                let condRole = false;
                if (role === 'worker') {
                    const isSunday = ((STATE.day - 1) % 7 === 6);
                    condRole = isSunday ? p.energy < 70 : (p.shiftStarted || p.energy < 60);
                } else if (role === 'student') {
                    condRole = (p.lastAttendanceDay === STATE.day) || p.energy < 70 || STATE.location === 'library_interior';
                } else if (role === 'entrepreneur') {
                    const hasStock = Object.values(p.inventory).some(v => v > 0);
                    condRole = hasStock || p.biz >= (p.level * 2);
                } else if (role === 'family') {
                    condRole = p.energy < 80 || (p.dailyTalkCount || 0) >= 2;
                }

                return condGeneral && condRole && hasJournal && hasFishing && hasMonsterKill && hasTalked;
            }

            // --- CEK BERAPA BONUS QUEST YANG SELESAI HARI INI ---
            function countBonusQuestsDone() {
                const p = STATE.player;
                const role = p.role;
                const day = STATE.day;
                const BONUS_POOL_CHECK = {
                    worker: [
                        () => (p.inventory['tonic_stamina'] || 0) >= 1 || (p.inventory['obat'] || 0) >= 1,
                        () => (p.dailyMonsterKills || 0) >= 1,
                        () => (p.dailyTalkCount || 0) >= 3,
                        () => p.money >= 2000,
                        () => (p.furniture || []).length >= 1,
                        () => (p.dailyFishingCount || 0) >= 2,
                        () => p.level >= 1,
                    ],
                    student: [
                        () => Object.keys(p.inventory).some(k => k.includes('buku')),
                        () => STATE.location === 'library_interior',
                        () => (p.inventory['coklat'] || 0) >= 1,
                        () => (p.dailySelfStudy || 0) >= 2,
                        () => (p.dailyTalkCount || 0) >= 2,
                        () => (p.dailyFishingCount || 0) >= 1,
                        () => p.money >= 5000,
                    ],
                    entrepreneur: [
                        () => STATE.location === 'merchant_interior',
                        () => Object.values(p.inventory).some(v => v > 0),
                        () => p.money >= 10000,
                        () => (p.houseLevel || 1) >= 2,
                        () => (p.dailySellCount || 0) >= 1,
                        () => (p.dailyTalkCount || 0) >= 3,
                        () => (p.dailyFishingCount || 0) >= 1,
                    ],
                    family: [
                        () => (p.dailyTalkCount || 0) >= 3,
                        () => Object.values(p.inventory).some(v => v > 0),
                        () => STATE.location === 'guild_interior' || STATE.location === 'merchant_interior',
                        () => STATE.player.farming && Object.values(STATE.player.farming).some(c => c && c.watered),
                        () => (p.dailyFishingCount || 0) >= 1,
                        () => p.money >= 3000,
                        () => (p.dailyMonsterKills || 0) >= 1,
                    ],
                };
                const pool = BONUS_POOL_CHECK[role] || [];
                if (pool.length < 2) return 0;
                const bq1Done = pool[(day - 1) % pool.length]();
                const idx2 = day % pool.length;
                const bq2Done = (idx2 !== (day - 1) % pool.length) && pool[idx2]();
                return (bq1Done ? 1 : 0) + (bq2Done ? 1 : 0);
            }

            // --- NEW HELPER: CHECK WEEKLY COMPLETION ---
            function checkWeeklyCompletion() {
                const p = STATE.player;
                const week = Math.ceil(STATE.day / 7);
                const role = p.role;

                if (role === 'none') return false;

                // 1. Syarat Umum
                const weekLvlTarget = week * 2;
                const condLevel = p.level >= weekLvlTarget;
                const condItem = (p.inventory['ikan_segar'] || 0) >= 1;

                // 2. Syarat Role
                let condRole = false;
                if (role === 'worker') {
                    const targetStr = p.level * 2 + 10;
                    condRole = p.str >= targetStr;
                } else if (role === 'student') {
                    const targetInt = p.level * 2 + 10;
                    const hasSnack = (p.inventory['coklat'] || 0) >= 1;
                    condRole = p.int >= targetInt && hasSnack;
                } else if (role === 'entrepreneur') {
                    const targetBiz = p.level + 5;
                    condRole = p.biz >= targetBiz;
                } else if (role === 'family') {
                    const friendTarget = Math.min(5, Math.ceil(week / 2));
                    const currentFriends = Object.keys(p.relationships).length;
                    condRole = currentFriends >= friendTarget;
                }

                return condLevel && condItem && condRole;
            }

            // --- NEW HELPER: CHECK MONTHLY COMPLETION ---
            function checkMonthlyCompletion() {
                const p = STATE.player;
                const month = Math.ceil(STATE.day / 30);
                const role = p.role;

                if (role === 'none') return false;

                // 1. Syarat Tabungan
                const monthlyMoneyTarget = month * 10000;
                const condMoney = p.money >= monthlyMoneyTarget;

                // 2. Syarat Role
                let condRole = false;
                if (role === 'worker') condRole = p.bossReputation >= 70;
                else if (role === 'student') condRole = Object.keys(p.inventory).some(k => k.includes('buku'));
                else if (role === 'entrepreneur') condRole = p.money >= monthlyMoneyTarget * 1.5;
                else if (role === 'family') condRole = p.reputation >= month * 10;

                // 3. Syarat Musim (Opsional, tapi kita masukkan agar menantang)
                // Sederhana: Harus punya item khas musim atau progress tertentu
                let condSeason = false;
                if (STATE.season === 'spring') condSeason = (p.inventory['bunga'] || 0) > 0;
                else if (STATE.season === 'summer') condSeason = (p.inventory['ikan_segar'] || 0) >= 5;
                else if (STATE.season === 'autumn') condSeason = p.money >= 50000;
                else if (STATE.season === 'winter') condSeason = STATE.dungeonLevel >= 2;

                return condMoney && condRole && condSeason;
            }

            // ═══════════════════════════════════════════════════════════
            // 🏆 SISTEM MILESTONE QUEST TAHUNAN (TAHUN 1 s/d 5)
            // Setiap tahun = 120 hari (30 hari × 4 musim)
            // ═══════════════════════════════════════════════════════════

            // Helper: dapatkan tahun game saat ini
            function getGameYear() {
                return Math.floor((STATE.day - 1) / 120) + 1;
            }

            // --- CEK MILESTONE TAHUN 1 (Fondasi Awal) ---
            function checkYear1Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasTalked5   = (p.totalTalkCount || p.dailyTalkCount || 0) >= 1;
                const hasJournal   = p.reflections && p.reflections.length >= 3;
                const hasMonster   = (p.totalMonsterKills || 0) >= 5;
                const hasFish      = (p.totalFishingCount || 0) >= 3;
                const levelOK      = p.level >= 5;
                if (role === 'worker')      return levelOK && p.str >= 15 && p.money >= 20000 && hasJournal && hasMonster;
                if (role === 'student')     return levelOK && p.int >= 15 && hasJournal && hasFish;
                if (role === 'entrepreneur')return levelOK && p.biz >= 15 && p.money >= 25000 && hasJournal;
                if (role === 'family')      return levelOK && p.reputation >= 15 && Object.keys(p.relationships).length >= 2 && hasJournal;
                return false;
            }

            // --- CEK MILESTONE TAHUN 2 (Berkembang) ---
            function checkYear2Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasJournal5  = p.reflections && p.reflections.length >= 10;
                const hasMonster10 = (p.totalMonsterKills || 0) >= 20;
                const levelOK      = p.level >= 10;
                const hasFarmed    = p.farming && Object.values(p.farming).some(c => c && c.harvested);
                if (role === 'worker')       return levelOK && p.str >= 30 && p.money >= 60000 && p.bossReputation >= 50 && hasJournal5;
                if (role === 'student')      return levelOK && p.int >= 30 && p.major && hasJournal5 && hasFarmed;
                if (role === 'entrepreneur') return levelOK && p.biz >= 30 && p.money >= 80000 && (p.houseLevel || 1) >= 2 && hasJournal5;
                if (role === 'family')       return levelOK && p.reputation >= 30 && Object.keys(p.relationships).length >= 4 && hasJournal5;
                return false;
            }

            // --- CEK MILESTONE TAHUN 3 (Ujian Nyata — LEBIH SULIT) ---
            function checkLifeTrialCompletion() {
                return checkYear3Completion();
            }
            function checkYear3Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasJournal15 = p.reflections && p.reflections.length >= 20;
                const hasMonster30 = (p.totalMonsterKills || 0) >= 50;
                const levelOK      = p.level >= 18;
                const hasFish10    = (p.totalFishingCount || 0) >= 10;
                const hasAP        = (p.achievementPoints || 0) >= 30;
                if (role === 'worker') {
                    return levelOK && p.str >= 50 && p.money >= 120000
                        && p.bossReputation >= 70 && hasJournal15 && hasMonster30
                        && (p.jobStatus === 'promoted' || p.bossReputation >= 80);
                }
                if (role === 'student') {
                    const hasBook = Object.keys(p.inventory).some(k => k.includes('buku') && !k.includes('tesis'));
                    return levelOK && p.int >= 50 && hasBook && hasJournal15 && hasFish10
                        && p.major && hasAP;
                }
                if (role === 'entrepreneur') {
                    return levelOK && p.biz >= 50 && p.money >= 150000
                        && (p.houseLevel || 1) >= 2 && hasJournal15
                        && (p.dailySellCount || p.totalSellCount || 0) >= 10;
                }
                if (role === 'family') {
                    return levelOK && p.reputation >= 50
                        && Object.keys(p.relationships).length >= 6
                        && hasJournal15 && hasFish10
                        && (p.married || Object.values(p.relationships).some(r => r >= 70));
                }
                return false;
            }

            // --- CEK MILESTONE TAHUN 4 (Menjelang Puncak — SANGAT SULIT) ---
            function checkYear4Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasJournal30 = p.reflections && p.reflections.length >= 35;
                const hasAP60      = (p.achievementPoints || 0) >= 60;
                const hasMonster60 = (p.totalMonsterKills || 0) >= 80;
                const levelOK      = p.level >= 25;
                if (role === 'worker') {
                    return levelOK && p.str >= 70 && p.money >= 300000
                        && p.bossReputation >= 90 && hasJournal30 && hasAP60
                        && hasMonster60;
                }
                if (role === 'student') {
                    const hasTesisDraft = !!(p.inventory && (p.inventory['buku_tesis'] || p.inventory['draft_tesis']));
                    return levelOK && p.int >= 70 && hasTesisDraft
                        && hasJournal30 && hasAP60 && p.major;
                }
                if (role === 'entrepreneur') {
                    return levelOK && p.biz >= 70 && p.money >= 400000
                        && (p.houseLevel || 1) >= 3 && hasJournal30 && hasAP60;
                }
                if (role === 'family') {
                    return levelOK && p.reputation >= 70 && p.married
                        && Object.keys(p.relationships).length >= 8
                        && hasJournal30 && hasAP60;
                }
                return false;
            }

            // --- CEK MILESTONE TAHUN 5 (Kelulusan Sejati — ULTRA SULIT) ---
            function checkYear5Completion() {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return false;
                const hasJournal50 = p.reflections && p.reflections.length >= 50;
                const hasAP100     = (p.achievementPoints || 0) >= 100;
                const hasMonster   = (p.totalMonsterKills || 0) >= 120;
                const levelOK      = p.level >= 30;
                const hasAllFishing= (p.totalFishingCount || 0) >= 20;
                if (role === 'worker') {
                    return levelOK && p.str >= 90 && p.money >= 1000000
                        && p.bossReputation >= 100 && hasJournal50 && hasAP100
                        && hasMonster && hasAllFishing
                        && (p.jobTitle === 'manager' || p.bossReputation >= 100);
                }
                if (role === 'student') {
                    const hasTesis = !!(p.inventory && p.inventory['buku_tesis']);
                    return levelOK && p.int >= 90 && hasTesis && p.major
                        && hasJournal50 && hasAP100 && hasMonster && hasAllFishing;
                }
                if (role === 'entrepreneur') {
                    return levelOK && p.biz >= 90 && p.money >= 1000000
                        && (p.houseLevel || 1) >= 5 && hasJournal50 && hasAP100
                        && hasMonster && hasAllFishing;
                }
                if (role === 'family') {
                    const hasKid = p.children && p.children.length >= 1;
                    return levelOK && p.reputation >= 90 && p.married && hasKid
                        && Object.keys(p.relationships).length >= 10
                        && hasJournal50 && hasAP100 && hasAllFishing;
                }
                return false;
            }

            // --- NEW FUNCTION: CLAIM REWARDS (GENERIC) ---
            function claimReward(type) {
                const p = STATE.player;

                // --- WEEKLY ---
                if (type === 'weekly') {
                    const currentWeek = Math.ceil(STATE.day / 7);
                    if (p.lastWeeklyClaim === currentWeek) {
                        showToast("Reward Minggu ini sudah diambil!");
                        return;
                    }
                    if (!checkWeeklyCompletion()) {
                        showToast("Syarat Mingguan belum terpenuhi!");
                        return;
                    }
                    p.lastWeeklyClaim = currentWeek;
                    p.money += 5000;
                    gainExp(200);
                    addItem('tonic_stamina', 1);
                    showToast("🎁 WEEKLY REWARD: 5000G + 200EXP + Tonic!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#a855f7');
                }

                // --- MONTHLY ---
                else if (type === 'monthly') {
                    const currentMonth = Math.ceil(STATE.day / 30);
                    if (p.lastMonthlyClaim === currentMonth) {
                        showToast("Reward Bulan ini sudah diambil!");
                        return;
                    }
                    if (!checkMonthlyCompletion()) {
                        showToast("Syarat Bulanan belum terpenuhi!");
                        return;
                    }
                    p.lastMonthlyClaim = currentMonth;
                    p.money += 20000;
                    gainExp(1000);
                    addItem('permata', 2);
                    showToast("🎁 MONTHLY REWARD: 20.000G + 1000EXP + 2 Berlian!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#22d3ee');
                }

                // --- MILESTONE TAHUN 1 ---
                else if (type === 'year1') {
                    if (p.claimedYear1) { showToast("Milestone Tahun 1 sudah diklaim!"); return; }
                    if (!checkYear1Completion()) { showToast("Syarat Milestone Tahun 1 belum terpenuhi!"); return; }
                    p.claimedYear1 = true;
                    p.money += 30000;
                    gainExp(1500);
                    addItem('tonic_stamina', 2);
                    p.achievementPoints = (p.achievementPoints || 0) + 15;
                    showToast("🌱 MILESTONE TAHUN 1: 30.000G + 1500EXP + 2 Tonic + 15AP!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#4ade80');
                }

                // --- MILESTONE TAHUN 2 ---
                else if (type === 'year2') {
                    if (p.claimedYear2) { showToast("Milestone Tahun 2 sudah diklaim!"); return; }
                    if (!checkYear2Completion()) { showToast("Syarat Milestone Tahun 2 belum terpenuhi!"); return; }
                    p.claimedYear2 = true;
                    p.money += 60000;
                    gainExp(2500);
                    addItem('tonic_kebal', 1);
                    addItem('permata', 2);
                    p.achievementPoints = (p.achievementPoints || 0) + 25;
                    showToast("🌿 MILESTONE TAHUN 2: 60.000G + 2500EXP + Tonic Kebal + 2 Berlian + 25AP!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#22d3ee');
                }

                // --- MILESTONE TAHUN 3 (life_trial alias) ---
                else if (type === 'life_trial' || type === 'year3') {
                    if (p.claimedLifeTrial) { showToast("Milestone Tahun 3 sudah diklaim!"); return; }
                    if (!checkYear3Completion()) { showToast("Syarat Trial 3 Tahun belum tercapai! Masih banyak yang harus diselesaikan."); return; }
                    p.claimedLifeTrial = true;
                    p.claimedYear3 = true;
                    p.money += 120000;
                    gainExp(5000);
                    addItem('tonic_kebal', 3);
                    addItem('permata', 3);
                    p.achievementPoints = (p.achievementPoints || 0) + 50;
                    showToast("🏆 MILESTONE 3 TAHUN: 120.000G + 5000EXP + 3 Tonic Kebal + 3 Berlian + 50AP!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#e11d48');
                }

                // --- MILESTONE TAHUN 4 ---
                else if (type === 'year4') {
                    if (p.claimedYear4) { showToast("Milestone Tahun 4 sudah diklaim!"); return; }
                    if (!checkYear4Completion()) { showToast("Syarat Milestone Tahun 4 belum terpenuhi! Kamu perlu lebih keras lagi!"); return; }
                    p.claimedYear4 = true;
                    p.money += 250000;
                    gainExp(8000);
                    addItem('tonic_kebal', 5);
                    addItem('permata', 5);
                    p.achievementPoints = (p.achievementPoints || 0) + 80;
                    // Bonus spesial: naikkan semua stat +5
                    p.str = (p.str || 0) + 5;
                    p.int = (p.int || 0) + 5;
                    p.biz = (p.biz || 0) + 5;
                    p.reputation = (p.reputation || 0) + 5;
                    showToast("💎 MILESTONE 4 TAHUN: 250.000G + 8000EXP + All Stat+5 + 80AP!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#a855f7');
                }

                // --- MILESTONE TAHUN 5 (TAMAT SEJATI) ---
                else if (type === 'year5') {
                    if (p.claimedYear5) { showToast("Milestone Tahun 5 sudah diklaim!"); return; }
                    if (!checkYear5Completion()) { showToast("Syarat Kelulusan 5 Tahun belum terpenuhi! Ini ujian terberat — kamu harus sempurna!"); return; }
                    p.claimedYear5 = true;
                    p.money += 500000;
                    gainExp(15000);
                    addItem('tonic_kebal', 10);
                    addItem('permata', 10);
                    p.achievementPoints = (p.achievementPoints || 0) + 200;
                    // Bonus: Gelar Kehormatan
                    const honorTitles = {
                        worker: 'Manajer Senior Berprestasi',
                        student: 'Sarjana Teladan Nusantara',
                        entrepreneur: 'Pengusaha Sukses Pulau Arsa',
                        family: 'Tokoh Masyarakat Terpuji'
                    };
                    p.honorTitle = honorTitles[p.role] || 'Warga Teladan';
                    showToast(`👑 LULUS 5 TAHUN! 500.000G + 15.000EXP + Gelar: ${p.honorTitle}!`);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(p.x, p.y, '#fbbf24');
                    // Trigger game ending cinematic
                    setTimeout(() => {
                        showDialogue("🌟 SELAMAT! KAMU TELAH LULUS!", 
                            `"${p.name}, kamu telah menjalani 5 tahun penuh keputusan, perjuangan, dan pertumbuhan.\n\nKamu bukan lagi pemuda yang datang dengan tangan kosong. Kamu adalah ${p.honorTitle}.\n\nPerjuanganmu menginspirasi generasi berikutnya di Pulau Arsa."\n\n— Mentor Budi`,
                            [{ text: "🏆 Lihat Potret Masa Depanku", action: () => { closeDialogue(); openPotretModal(); } },
                             { text: "Lanjutkan Petualangan (Free Roam)", action: closeDialogue }],
                            'images/mentorbudi.png');
                    }, 1500);
                }

                // Refresh UI
                showDailyQuestPopup();
                manualSave();
            }

            // --- CLAIM DAILY REWARD (UPGRADE: Skala naik + bonus quest reward) ---
            function claimDailyReward() {
                if (STATE.player.lastDailyClaim === STATE.day) {
                    showToast("Sudah diklaim hari ini!");
                    return;
                }
                if (!checkDailyCompletion()) {
                    showToast("Selesaikan semua misi wajib dulu!");
                    return;
                }

                const p = STATE.player;
                const role = p.role;

                // Base reward naik seiring hari & level
                const dayBonus   = Math.floor(STATE.day / 7) * 200;     // +200G per minggu
                const levelBonus = p.level * 150;                        // +150G per level
                let goldReward   = 1000 + dayBonus + levelBonus;
                let expReward    = 50 + (p.level * 5);

                // Bonus per role
                const roleBonus = { worker: 500, student: 300, entrepreneur: 700, family: 400 };
                goldReward += roleBonus[role] || 0;

                // Bonus item per role
                const roleItems = {
                    worker:       { id: 'tonic_stamina', qty: 1, label: '+ Tonic Stamina' },
                    student:      { id: 'coklat',        qty: 1, label: '+ Coklat Belajar' },
                    entrepreneur: { id: 'permata',       qty: 1, label: '+ 1 Berlian'      },
                    family:       { id: 'bunga',         qty: 2, label: '+ 2 Bunga'        },
                };
                const bonusItem = roleItems[role];
                if (bonusItem) addItem(bonusItem.id, bonusItem.qty);

                // Bonus quest tambahan (+300G per quest bonus yang selesai)
                const bonusDone = countBonusQuestsDone();
                const bonusGold = bonusDone * 300;
                goldReward += bonusGold;

                // Terapkan reward
                p.money += goldReward;
                gainExp(expReward);
                p.lastDailyClaim = STATE.day;

                // Efek
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                createParticle(p.x, p.y, '#fbbf24');
                if (bonusDone > 0) createParticle(p.x, p.y, '#a855f7');

                const bonusItemLabel = bonusItem ? bonusItem.label : '';
                const bonusQuestLabel = bonusDone > 0 ? ` + ${bonusGold}G Bonus Quest` : '';
                showToast(`🎁 REWARD HARIAN: ${goldReward.toLocaleString('id-ID')}G + ${expReward}XP ${bonusItemLabel}${bonusQuestLabel}!`);

                showDailyQuestPopup();
                manualSave();
            }

            function getQuestContent(tabType) {
                const p = STATE.player;
                const day = STATE.day;
                const season = STATE.season;
                const role = p.role;

                // Helpers Visual
                const check = (cond) => cond ? '<span style="color:#4ade80">✅</span>' : '<span style="color:#94a3b8">⬜</span>';
                const prog = (cur, target, unit = '') => `<span style="font-size:10px; color:#fbbf24; margin-left:4px;">(${cur}/${target}${unit})</span>`;
                // Helper Header Section
                const section = (title, color = '#0284c7') => `<div style="
        background: linear-gradient(90deg, #f1f5f9, transparent);
        color: ${color};
        padding: 6px 8px;
        font-weight: 800;
        font-size: 11px;
        margin: 8px 0 4px 0;
        border-left: 4px solid ${color};
        text-transform: uppercase;
        letter-spacing: 1px;
        border-radius: 4px;
    ">${title}</div>`;

                // Helper Button Generator
                const createClaimBtn = (label, action, isComplete, isClaimed, rewardText) => {
                    let btnStyle = "width:100%; margin-top:10px; padding:10px; font-weight:bold; border-radius:8px; cursor:pointer; font-size:12px; border:none;";
                    let btnText = "";
                    let btnAttr = "";

                    if (isClaimed) {
                        btnStyle += "background:#e2e8f0; color:#94a3b8; cursor:not-allowed; border:1px solid #cbd5e1;";
                        btnText = "✅ SUDAH DIKLAIM";
                    } else if (isComplete) {
                        btnStyle += "background:linear-gradient(90deg, #f59e0b, #d97706); color:white; box-shadow:0 4px 6px rgba(245,158,11,0.3); animation: pulse 1s infinite;";
                        btnText = `🎁 KLAIM ${label}`;
                        btnAttr = `onclick="${action}"`;
                    } else {
                        btnStyle += "background:#f1f5f9; color:#94a3b8; border:1px dashed #cbd5e1; cursor:not-allowed;";
                        btnText = "🔒 SELESAIKAN MISI DULU";
                    }

                    let html = `<button style="${btnStyle}" ${btnAttr} ${isClaimed || !isComplete ? 'disabled' : ''}>${btnText}</button>`;
                    if (!isClaimed) html += `<div style="text-align:center; font-size:10px; color:#d97706; margin-top:4px; font-weight:bold;">${rewardText}</div>`;
                    return html;
                };

                // Data Waktu
                const week = Math.ceil(day / 7);
                const month = Math.ceil(day / 30);

                let html = "";

                // --- 0. STATUS AWAL (Jika Belum Pilih Role) ---
                if (role === 'none') {
                    const mentorFound = p.dailyTalkCount > 0; // Sudah ngobrol = mungkin sudah ketemu mentor
                    return `
            ${section('🛑 MISI AWAL: TENTUKAN JALAN HIDUPMU', '#ef4444')}
            <div style="font-size:10.5px; color:#475569; margin-bottom:8px; line-height:1.5;">
                Kamu baru tiba di Pulau Arsa. Sebelum memulai petualangan sungguhan,<br>
                kamu harus memilih <b>Jalur Karir</b> yang akan menentukan hidupmu di sini!
            </div>
            ${check(mentorFound)} <b>Langkah 1:</b> Temui <b>Mentor Budi</b> di tengah Desa Arsa<br>
            ${check(false)} <b>Langkah 2:</b> Jelajahi Desa — lihat Kampus, Toko, Dermaga<br>
            ${check(false)} <b>Langkah 3:</b> Pulang ke Rumah & <b>Tidur</b> → Pilih Jalurmu<br>
            <div style="margin-top:8px; background:rgba(250,204,21,0.1); border:1px solid #fbbf24; border-radius:6px; padding:6px 8px; font-size:10px; line-height:1.6;">
                <b>✨ 4 Jalur Karir tersedia:</b><br>
                ⚔️ <b>Pekerja</b> — Kerja di toko, kumpulkan gaji, naik jabatan<br>
                🎓 <b>Akademisi</b> — Kuliah, raih beasiswa, selesaikan skripsi<br>
                💼 <b>Wirausaha</b> — Buka usaha, berdagang, kaya dari bisnis<br>
                🏠 <b>Keluarga</b> — Bangun relasi, cari jodoh, hidup bahagia
            </div>
        `;
                }

                // --- TAB 1: HARIAN (DAILY) ---
                if (tabType === 'daily') {
                    html += section('📅 Quest Harian (Reset Tiap Hari)', '#fbbf24');

                    // --- MISI ONBOARDING (tampil prioritas sesuai status role saat ini) ---
                    let onboardingMsg = "";

                    // ── PEKERJA: Belum kerja ──────────────────────────────────────
                    if (role === 'worker' && p.jobStatus === 'unemployed') {
                        onboardingMsg = `<div style="background:rgba(239,68,68,0.12); padding:8px 10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #ef4444; font-size:11px;">
                    <div style="font-weight:800; color:#ef4444; margin-bottom:4px;">⚔️ MISI AWAL PEKERJA: LAMAR KERJA</div>
                    <div style="color:#475569; line-height:1.6;">
                        ${check(false)} Pergi ke <b>Toko Merchant</b> (arah <b>Selatan</b> dari rumah)<br>
                        ${check(false)} Temui <b>Bos / Pak Hendra</b> dan ajukan lamaran kerja<br>
                        ${check(false)} Setelah diterima, masuk <b>Shift jam 08:00</b> setiap hari<br>
                    </div>
                    <div style="font-size:10px; color:#f59e0b; margin-top:4px;">💡 Gaji harian otomatis masuk jika kamu rajin masuk shift!</div>
                </div>`;

                    // ── PEKERJA: Sudah kerja — ingatkan tugas rutin ─────────────
                    } else if (role === 'worker' && p.jobStatus === 'employed') {
                        const dayIdx = (day - 1) % 7;
                        const isSunday = dayIdx === 6;
                        if (!p.shiftStarted && !isSunday) {
                            onboardingMsg = `<div style="background:rgba(239,68,68,0.08); padding:6px 10px; border-radius:6px; margin-bottom:6px; border-left:3px solid #ef4444; font-size:11px; color:#7f1d1d;">
                        ⏰ <b>Shift belum dimulai!</b> Segera ke <b>Toko Merchant</b> sebelum jam 08:00 agar tidak kena sanksi Bos.
                    </div>`;
                        }

                    // ── AKADEMISI: Belum daftar jurusan ─────────────────────────
                    } else if (role === 'student' && !p.major) {
                        onboardingMsg = `<div style="background:rgba(59,130,246,0.12); padding:8px 10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #3b82f6; font-size:11px;">
                    <div style="font-weight:800; color:#3b82f6; margin-bottom:4px;">🎓 MISI AWAL AKADEMISI: DAFTAR KULIAH</div>
                    <div style="color:#475569; line-height:1.6;">
                        ${check(false)} Pergi ke <b>Gedung Kampus</b> (arah <b>Timur</b> dari desa)<br>
                        ${check(false)} Temui <b>Pak Dosen / Bu Dosen</b> di dalam gedung<br>
                        ${check(false)} Pilih <b>jurusan kuliahmu</b> (IPA / IPS / Teknik / dst)<br>
                    </div>
                    <div style="font-size:10px; color:#f59e0b; margin-top:4px;">💡 Kuliah dimulai jam 08:00 setiap hari kerja. Jangan bolos ya!</div>
                </div>`;

                    // ── AKADEMISI: Sudah kuliah — ingatkan jadwal ───────────────
                    } else if (role === 'student' && p.major) {
                        const dayIdx2 = (STATE.day - 1) % 7;
                        const isWeekend = dayIdx2 === 5 || dayIdx2 === 6;
                        if (!isWeekend && p.lastAttendanceDay !== STATE.day) {
                            onboardingMsg = `<div style="background:rgba(59,130,246,0.08); padding:6px 10px; border-radius:6px; margin-bottom:6px; border-left:3px solid #3b82f6; font-size:11px; color:#1e3a8a;">
                        📚 <b>Kuliah belum diabsen hari ini!</b> Segera ke <b>Gedung Kampus</b> jam 08:00 agar tidak dihitung absen.
                    </div>`;
                        }

                    // ── WIRAUSAHA: Belum punya stok barang ──────────────────────
                    } else if (role === 'entrepreneur' && !Object.values(p.inventory).some(v => v > 0)) {
                        onboardingMsg = `<div style="background:rgba(16,185,129,0.12); padding:8px 10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #10b981; font-size:11px;">
                    <div style="font-weight:800; color:#065f46; margin-bottom:4px;">💼 MISI AWAL WIRAUSAHA: BUKA USAHA</div>
                    <div style="color:#475569; line-height:1.6;">
                        ${check(false)} Pergi ke <b>Toko Pedagang</b> (Selatan Desa) — beli modal awal<br>
                        ${check(false)} Pantau <b>Harga Pasar</b> lewat HP (menu Sosmed/Tren Viral)<br>
                        ${check(false)} Jual barang ke <b>Merchant</b> saat harga naik untuk cuan besar!<br>
                    </div>
                    <div style="font-size:10px; color:#f59e0b; margin-top:4px;">💡 Beli murah → jual mahal. Pantau tren viral di HP-mu setiap hari!</div>
                </div>`;

                    // ── WIRAUSAHA: Sudah punya barang — reminder ────────────────
                    } else if (role === 'entrepreneur' && Object.values(p.inventory).some(v => v > 0)) {
                        const hasTrend = STATE.viral && STATE.viral.active;
                        if (hasTrend) {
                            onboardingMsg = `<div style="background:rgba(16,185,129,0.08); padding:6px 10px; border-radius:6px; margin-bottom:6px; border-left:3px solid #10b981; font-size:11px; color:#065f46;">
                        🔥 <b>Ada tren viral hari ini!</b> Cek <b>HP → Sosmed</b> dan manfaatkan harga spesial sekarang!
                    </div>`;
                        }

                    // ── KELUARGA: Quest Modin aktif ──────────────────────────────
                    } else if (role === 'family' && p.activeQuest === 'meet_modin') {
                        onboardingMsg = `<div style="background:rgba(217,70,239,0.12); padding:8px 10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #d946ef; font-size:11px;">
                    <div style="font-weight:800; color:#86198f; margin-bottom:4px;">💍 MISI AKTIF: RESTU PENGHULU</div>
                    <div style="color:#475569; line-height:1.6;">
                        ${check(false)} Pergi ke <b>Balai Pernikahan</b> (arah <b>Selatan</b> Desa)<br>
                        ${check(false)} Temui <b>Bapak Modin</b> (Penghulu Desa) di dalam balai<br>
                        ${check(false)} Dapatkan restu untuk melanjutkan perjalanan keluargamu<br>
                    </div>
                    <div style="font-size:10px; color:#f59e0b; margin-top:4px;">💡 Reputasi (REP) harus cukup tinggi sebelum Pak Modin mau bertemu!</div>
                </div>`;

                    // ── KELUARGA: Belum punya cukup teman ───────────────────────
                    } else if (role === 'family' && Object.keys(p.relationships || {}).length < 2) {
                        onboardingMsg = `<div style="background:rgba(217,70,239,0.08); padding:6px 10px; border-radius:6px; margin-bottom:6px; border-left:3px solid #d946ef; font-size:11px; color:#701a75;">
                        👋 <b>Kamu butuh lebih banyak teman!</b> Sapa warga desa dan bantu mereka untuk membangun reputasimu.
                    </div>`;
                    }

                    if (onboardingMsg) html += onboardingMsg;

                    // =======================================
                    // BONUS QUEST HARIAN BERPUTAR (per hari)
                    // Pool berbeda tiap role, bergilir agar tidak bosan
                    // =======================================
                    const BONUS_QUEST_POOL = {
                        worker: [
                            { label: 'Beli Obat/Tonic di Toko', key: 'bq_tonic', check: () => (p.inventory['tonic_stamina'] || 0) >= 1 || (p.inventory['obat'] || 0) >= 1 },
                            { label: 'Kunjungi Dungeon (Combat)', key: 'bq_dungeon', check: () => (p.dailyMonsterKills || 0) >= 1 },
                            { label: 'Sapa 3 Warga Berbeda', key: 'bq_talk3', check: () => (p.dailyTalkCount || 0) >= 3 },
                            { label: 'Kumpulkan 2.000 Gold hari ini', key: 'bq_gold', check: () => p.money >= 2000 },
                            { label: 'Perbaiki Rumah (Furniture)', key: 'bq_house', check: () => (p.furniture || []).length >= 1 },
                            { label: 'Mancing 2x hari ini 🎣', key: 'bq_fish2', check: () => (p.dailyFishingCount || 0) >= 2 },
                            { label: 'Naik Level (Leveling)', key: 'bq_level', check: () => p.level >= (p.dailyStartLevel || p.level) },
                        ],
                        student: [
                            { label: 'Beli Buku Baru di Toko', key: 'bq_book', check: () => Object.keys(p.inventory).some(k => k.includes('buku')) },
                            { label: 'Kunjungi Perpustakaan', key: 'bq_lib', check: () => STATE.location === 'library_interior' },
                            { label: 'Beli Snack Belajar (Coklat)', key: 'bq_snack', check: () => (p.inventory['coklat'] || 0) >= 1 },
                            { label: 'Belajar Mandiri 2x', key: 'bq_study', check: () => (p.dailySelfStudy || 0) >= 2 },
                            { label: 'Sosialisasi di Kampus', key: 'bq_social', check: () => (p.dailyTalkCount || 0) >= 2 },
                            { label: 'Mancing Santai 🎣', key: 'bq_fish', check: () => (p.dailyFishingCount || 0) >= 1 },
                            { label: 'Kumpulkan 5.000 Gold (UKT)', key: 'bq_ukt', check: () => p.money >= 5000 },
                        ],
                        entrepreneur: [
                            { label: 'Pantau Harga Pasar (ke Merchant)', key: 'bq_market', check: () => STATE.location === 'merchant_interior' },
                            { label: 'Punya Stok Barang Dagangan', key: 'bq_stock', check: () => Object.values(p.inventory).some(v => v > 0) },
                            { label: 'Kumpulkan 10.000 Gold', key: 'bq_10k', check: () => p.money >= 10000 },
                            { label: 'Upgrade Rumah/Toko', key: 'bq_upgrade', check: () => (p.houseLevel || 1) >= 2 },
                            { label: 'Jual Barang ke Merchant', key: 'bq_sell', check: () => (p.dailySellCount || 0) >= 1 },
                            { label: 'Ngobrol 3 Warga (Networking)', key: 'bq_net', check: () => (p.dailyTalkCount || 0) >= 3 },
                            { label: 'Mancing & Jual Ikan 🎣', key: 'bq_fishsell', check: () => (p.dailyFishingCount || 0) >= 1 },
                        ],
                        family: [
                            { label: 'Sapa 3 Warga Desa', key: 'bq_greet', check: () => (p.dailyTalkCount || 0) >= 3 },
                            { label: 'Bawa Hadiah untuk Warga', key: 'bq_gift', check: () => Object.values(p.inventory).some(v => v > 0) },
                            { label: 'Kunjungi Balai Warga', key: 'bq_hall', check: () => STATE.location === 'guild_interior' || STATE.location === 'merchant_interior' },
                            { label: 'Siram Tanaman Keluarga 🌱', key: 'bq_water', check: () => STATE.player.farming && Object.values(STATE.player.farming).some(c => c && c.watered) },
                            { label: 'Mancing Bersama 🎣', key: 'bq_fishfam', check: () => (p.dailyFishingCount || 0) >= 1 },
                            { label: 'Kumpulkan 3.000 Gold (Nafkah)', key: 'bq_nafkah', check: () => p.money >= 3000 },
                            { label: 'Kalahkan Monster (Jaga Desa) ⚔️', key: 'bq_protect', check: () => (p.dailyMonsterKills || 0) >= 1 },
                        ],
                        none: [],
                    };
                    const bqPool = BONUS_QUEST_POOL[role] || [];
                    // Pilih 2 bonus quest berdasarkan hari (deterministik, berputar)
                    const bq1 = bqPool.length > 0 ? bqPool[(day - 1) % bqPool.length] : null;
                    const bq2 = bqPool.length > 1 ? bqPool[day % bqPool.length] : null;

                    // --- QUEST WAJIB UMUM ---
                    html += `<strong style="font-size:11px;">[✅ Wajib Umum]</strong><br>`;
                    html += `${check(p.energy < 100)} Gunakan Energi (Beraktivitas)<br>`;
                    const hasJournal = p.reflections && p.reflections.some(r => r.day === day);
                    html += `${check(hasJournal)} Tulis Jurnal Refleksi 📔<br>`;
                    const talkCount = p.dailyTalkCount || 0;
                    html += `${check(talkCount >= 1)} Sosialisasi (Sapa Warga) ${prog(talkCount, 1)} 🗣️<br>`;
                    const monsterKills = p.dailyMonsterKills || 0;
                    html += `${check(monsterKills >= 2)} Kalahkan Monster ${prog(monsterKills, 2)} ⚔️<br>`;
                    const hasFishing = (p.dailyFishingCount || 0) >= 1;
                    html += `${check(hasFishing)} Mancing Ikan (1x) 🎣<br>`;

                    // Pertanian (opsional jika punya lahan)
                    const hasFarming = STATE.player.farming && Object.values(STATE.player.farming).some(c => c && c.type);
                    if (hasFarming) {
                        const hasWatered = Object.values(STATE.player.farming).some(c => c && c.type && c.watered);
                        const hasHarvested = (p.dailyHarvestCount || 0) >= 1;
                        html += `${check(hasWatered || hasHarvested)} Rawat Tanaman (Siram/Panen) 🌱<br>`;
                    }

                    // --- QUEST ROLE SPESIFIK ---
                    html += `<strong style="font-size:11px;">[🎯 Role: ${role.toUpperCase()}]</strong><br>`;
                    if (role === 'worker') {
                        const dayIndex = (day - 1) % 7;
                        const isSunday = (dayIndex === 6);
                        if (isSunday) {
                            html += `🚫 <span style="color:#64748b; text-decoration:line-through;">Masuk Shift</span> <span style="color:#fbbf24; font-size:10px;">(Libur Ahad)</span><br>`;
                        } else {
                            html += `${check(p.shiftStarted)} Masuk Shift Kerja (08:00-16:00)<br>`;
                        }
                        html += `${check(p.energy < 50)} Kerja Keras (Energy < 50) ${prog(p.energy > 50 ? '⬜' : '✅', '⚡')}<br>`;
                        html += `${check((p.bossReputation || 0) > 0)} Jaga Reputasi Boss ${prog(p.bossReputation || 0, 100)}<br>`;
                        // PART-TIME CHECKLIST
                        if (p.partTimeStatus === 'working') {
                            const ptName = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'Part-Time';
                            html += isSunday
                                ? `🚫 <span style="color:#64748b; text-decoration:line-through;">Part-Time ${ptName}</span> <span style="color:#fbbf24; font-size:10px;">(Libur)</span><br>`
                                : `${check(p.partTimeLastWorkedDay === STATE.day)} Part-Time ${ptName} (15:00-19:00)<br>`;
                        }
                    } else if (role === 'student') {
                        const dayIndex = (STATE.day - 1) % 7;
                        const isWeekend = (dayIndex === 5 || dayIndex === 6);
                        if (isWeekend) {
                            html += `🚫 <span style="color:#64748b; text-decoration:line-through;">Hadir Kuliah</span> <span style="color:#fbbf24; font-size:10px;">(Libur Weekend)</span><br>`;
                        } else {
                            html += `${check(p.lastAttendanceDay === STATE.day)} Hadir Kuliah (08:00-14:00)<br>`;
                        }
                        html += `${check(p.energy < 70)} Belajar Mandiri (Gunakan Buku)<br>`;
                        html += `${check(STATE.location === 'library_interior')} Kunjungi Perpustakaan 📚<br>`;
                        if (p.partTimeStatus === 'working') {
                            const ptNameS = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'Part-Time';
                            html += isWeekend
                                ? `🚫 <span style="color:#64748b; text-decoration:line-through;">Part-Time ${ptNameS}</span> <span style="color:#fbbf24; font-size:10px;">(Libur)</span><br>`
                                : `${check(p.partTimeLastWorkedDay === STATE.day)} Part-Time ${ptNameS} (15:00-19:00)<br>`;
                        }
                    } else if (role === 'entrepreneur') {
                        html += `${check(STATE.location === 'merchant_interior')} Pantau Harga Pasar (Merchant)<br>`;
                        html += `${check(Object.values(p.inventory).some(v => v > 0))} Punya Stok Barang Dagangan<br>`;
                        const targetBiz = p.level * 2;
                        html += `${check(p.biz >= targetBiz)} Asah Skill Bisnis ${prog(p.biz, targetBiz, ' BIZ')}<br>`;
                        if (p.partTimeStatus === 'working') {
                            const ptNameE = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'Part-Time';
                            const dayIdxE = (STATE.day - 1) % 7;
                            html += dayIdxE === 6
                                ? `🚫 <span style="color:#64748b; text-decoration:line-through;">Part-Time ${ptNameE}</span> <span style="color:#fbbf24; font-size:10px;">(Libur)</span><br>`
                                : `${check(p.partTimeLastWorkedDay === STATE.day)} Part-Time ${ptNameE} (15:00-19:00)<br>`;
                        }
                    } else if (role === 'family') {
                        html += `${check(p.energy < 80)} Bantu Tetangga (Beraktivitas)<br>`;
                        html += `${check((p.dailyTalkCount || 0) >= 2)} Sapa 2 Warga Berbeda ${prog(Math.min(p.dailyTalkCount || 0, 2), 2)}<br>`;
                        html += `${check((p.reputation || 0) > 0)} Jaga Reputasi Sosial ${prog(p.reputation || 0, 100)}<br>`;
                        if (p.partTimeStatus === 'working') {
                            const ptNameF = PART_TIME_JOBS[p.partTimeJob] ? PART_TIME_JOBS[p.partTimeJob].name : 'Part-Time';
                            const dayIdxF = (STATE.day - 1) % 7;
                            html += dayIdxF === 6
                                ? `🚫 <span style="color:#64748b; text-decoration:line-through;">Part-Time ${ptNameF}</span> <span style="color:#fbbf24; font-size:10px;">(Libur)</span><br>`
                                : `${check(p.partTimeLastWorkedDay === STATE.day)} Part-Time ${ptNameF} (15:00-19:00)<br>`;
                        }
                    }

                    // --- BONUS QUEST HARIAN (berputar tiap hari) ---
                    if (bq1 || bq2) {
                        html += `<strong style="font-size:11px; color:#a855f7;">[⭐ Bonus Hari Ini]</strong> <span style="font-size:9px; color:#94a3b8;">(Berubah tiap hari)</span><br>`;
                        if (bq1) html += `${check(bq1.check())} ${bq1.label} <span style="font-size:9px; color:#a855f7;">(+300G bonus)</span><br>`;
                        if (bq2 && bq2.key !== bq1.key) html += `${check(bq2.check())} ${bq2.label} <span style="font-size:9px; color:#a855f7;">(+300G bonus)</span><br>`;
                    }

                    // --- KISAH LELUHUR REMINDER (harian, jika belum selesai) ---
                    const _c1h = p.kilamong_c1 || false;
                    const _c2h = p.kilamong_c2 || false;
                    const _c3h = p.kilamong_c3 || false;
                    const _c4h = p.kilamong_c4 || false;
                    const _totalH = [_c1h,_c2h,_c3h,_c4h].filter(Boolean).length;
                    const _kerisH = !!(p.inventory && p.inventory['keris_penjaga']);
                    if (_totalH < 4 || !_kerisH) {
                        html += section('📜 Side Quest: Kisah Leluhur', '#92400e');
                        if (_totalH === 0) {
                            html += `<span style="font-size:10px; color:#78350f;">Belum mulai! Temui <b>Ki Lamong</b> di dekat Candi Kuno (Timur Laut) untuk mendengar kisah leluhur Lamongan.</span><br>`;
                        } else if (_totalH < 4) {
                            html += `<span style="font-size:10px; color:#78350f;">Progress: <b>${_totalH}/4</b> kisah. Lanjutkan ke Ki Lamong!</span><br>`;
                            html += `${check(_c1h)} Kisah Mbah Lamong<br>`;
                            html += `${check(_c2h)} Legenda Nelayan Brondong<br>`;
                            html += `${check(_c3h)} Perjalanan Joko Tingkir<br>`;
                            html += `${check(_c4h)} Tradisi Kupatan Lamongan<br>`;
                        } else {
                            html += `✅ Semua kisah selesai! <br>`;
                            html += `${check(_kerisH)} Ambil <b>Keris Penjaga</b> dari Ki Lamong<br>`;
                        }
                    }

                    // --- REWARD BUTTON DAILY ---
                    const isComplete = checkDailyCompletion();
                    const isClaimed = (p.lastDailyClaim === STATE.day);
                    // Hitung perkiraan reward secara dinamis untuk ditampilkan
                    const _dayBonus = Math.floor(day / 7) * 200;
                    const _lvlBonus = p.level * 150;
                    const _roleBonus = { worker: 500, student: 300, entrepreneur: 700, family: 400 };
                    const _estGold = 1000 + _dayBonus + _lvlBonus + (_roleBonus[role] || 0);
                    const _roleItemLabel = { worker: '+ Tonic', student: '+ Coklat', entrepreneur: '+ Berlian', family: '+ Bunga' };
                    html += createClaimBtn("HARIAN", "claimDailyReward()", isComplete, isClaimed,
                        `🏆 ${_estGold.toLocaleString('id-ID')}G+ · ${50 + p.level * 5}XP ${_roleItemLabel[role] || ''} · +600G jika Bonus Quest selesai`);
                }

                // --- TAB 2: MINGGUAN (WEEKLY) ---
                else if (tabType === 'weekly') {
                    html += section(`🗓️ Quest Mingguan (Minggu ke-${week})`, '#a855f7');

                    // Umum
                    const weekLvlTarget = week * 2;
                    html += `${check(p.level >= weekLvlTarget)} Capai Level ${weekLvlTarget} ${prog(p.level, weekLvlTarget)}<br>`;
                    html += `${check(p.inventory['ikan_segar'] >= 1)} Stok Makanan (Ikan) ${prog(p.inventory['ikan_segar'] || 0, 1)}<br>`;

                    // Role Spesifik
                    if (role === 'worker') {
                        const targetStr = p.level * 2 + 10;
                        html += `${check(p.str >= targetStr)} Latihan Intensif (STR) ${prog(p.str, targetStr)}<br>`;
                    } else if (role === 'student') {
                        const targetInt = p.level * 2 + 10;
                        html += `${check(p.int >= targetInt)} Riset Pustaka (INT) ${prog(p.int, targetInt)}<br>`;
                        // ADDED: QUEST LOGISTIK MAHASISWA
                        html += `${check(p.inventory['coklat'] >= 1)} Beli Snack Belajar (Coklat)<br>`;
                    } else if (role === 'entrepreneur') {
                        const targetBiz = p.level + 5;
                        html += `${check(p.biz >= targetBiz)} Analisa Pasar (BIZ) ${prog(p.biz, targetBiz)}<br>`;
                    } else if (role === 'family') {
                        const friendTarget = Math.min(5, Math.ceil(week / 2));
                        const currentFriends = Object.keys(p.relationships).length;
                        html += `${check(currentFriends >= friendTarget)} Cari ${friendTarget} Teman ${prog(currentFriends, friendTarget)}<br>`;
                    }

                    // --- REWARD BUTTON WEEKLY ---
                    const isComplete = checkWeeklyCompletion();
                    const isClaimed = (p.lastWeeklyClaim === week);
                    html += createClaimBtn("MINGGUAN", "claimReward('weekly')", isComplete, isClaimed, "Reward: 5000G + 200 XP + Tonic");
                }

                // --- TAB 3: BULANAN (MONTHLY & SEASONAL) ---
                else if (tabType === 'monthly') {
                    // Bulanan
                    html += section(`🌙 Quest Bulanan (Bulan ke-${month})`, '#22d3ee');
                    const monthlyMoneyTarget = month * 10000;
                    html += `${check(p.money >= monthlyMoneyTarget)} Tabungan ${monthlyMoneyTarget / 1000}k Gold ${prog((p.money / 1000).toFixed(1) + 'k', (monthlyMoneyTarget / 1000) + 'k')}<br>`;

                    if (role === 'worker') html += `${check(p.bossReputation >= 70)} Jadi Pegawai Teladan (Rep Boss 70+)<br>`;
                    if (role === 'student') html += `${check(Object.keys(p.inventory).some(k => k.includes('buku')))} Koleksi Buku Baru<br>`;
                    if (role === 'entrepreneur') html += `${check(p.money >= monthlyMoneyTarget * 1.5)} Omset Dagang Tinggi<br>`;
                    if (role === 'family') html += `${check(p.reputation >= month * 10)} Reputasi Warga Baik ${prog(p.reputation, month * 10)}<br>`;

                    // Musiman (Digabung ke tab Bulanan biar hemat tempat)
                    let seasonColor = '#4ade80';
                    let seasonQuest = "Nikmati keindahan bunga sakura.";
                    let seasonTarget = "";

                    if (season === 'spring') {
                        seasonColor = '#f472b6';
                        seasonQuest = "Waktunya Mencari Bunga & Cinta";
                        seasonTarget = `${check(p.inventory['bunga'] > 0)} Cari Bunga Liar`;
                    } else if (season === 'summer') {
                        seasonColor = '#facc15';
                        seasonQuest = "Waktunya Memancing & Eksplorasi";
                        seasonTarget = `${check(p.inventory['ikan_segar'] >= 5)} Tangkap 5 Ikan`;
                    } else if (season === 'autumn') {
                        seasonColor = '#fb923c';
                        seasonQuest = "Waktunya Panen & Berdagang";
                        seasonTarget = `${check(p.money >= 50000)} Kumpulkan Modal Besar`;
                    } else if (season === 'winter') {
                        seasonColor = '#60a5fa';
                        seasonQuest = "Waktunya Bertahan Hidup (Dungeon)";
                        seasonTarget = `${check(STATE.dungeonLevel >= 2)} Jelajahi Dungeon Lt.2`;
                    }

                    html += section(`🍂 Misi Musim ${season.toUpperCase()}`, seasonColor);
                    html += `<i>"${seasonQuest}"</i><br>`;
                    html += `${seasonTarget}<br>`;

                    // --- REWARD BUTTON MONTHLY ---
                    const isComplete = checkMonthlyCompletion();
                    const isClaimed = (p.lastMonthlyClaim === month);
                    html += createClaimBtn("BULANAN", "claimReward('monthly')", isComplete, isClaimed, "Reward: 20k G + 1000 XP + 2 Berlian");
                }

                // --- TAB 4: JANGKA PANJANG (LIFE TARGETS) ---
                else if (tabType === 'life') {
                    const currentYear = getGameYear();
                    const totalMonsterKills = (p.totalMonsterKills || 0);
                    const totalFishing      = (p.totalFishingCount || 0);
                    const totalJournals     = p.reflections ? p.reflections.length : 0;
                    const totalAP           = p.achievementPoints || 0;

                    // ─── MILESTONE TAHUN 1 ───────────────────────────────────────
                    const y1Done     = p.claimedYear1;
                    const y1Complete = checkYear1Completion();
                    html += section('🌱 MILESTONE TAHUN 1 — Fondasi Awal', y1Done ? '#4ade80' : '#65a30d');
                    html += `<div style="font-size:10px; color:#78350f; margin-bottom:6px; background:rgba(101,163,13,0.08); padding:6px 8px; border-radius:6px; border-left:3px solid #65a30d;">
                        Buktikan kamu bisa bertahan di Pulau Arsa. Selesaikan misi dasar sebelum tahun pertama berakhir.
                    </div>`;
                    html += `${check(p.level >= 5)} Level 5+ ${prog(p.level, 5)}<br>`;
                    html += `${check(totalJournals >= 3)} Tulis 3 Jurnal Refleksi ${prog(totalJournals, 3)}<br>`;
                    html += `${check(totalMonsterKills >= 5)} Kalahkan 5 Monster ${prog(totalMonsterKills, 5)}<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 15)} STR 15+ ${prog(p.str, 15)}<br>`;
                        html += `${check(p.money >= 20000)} Tabung 20.000G ${prog((p.money/1000).toFixed(1)+'k', '20k')}<br>`;
                    } else if (role === 'student') {
                        html += `${check(p.int >= 15)} INT 15+ ${prog(p.int, 15)}<br>`;
                        html += `${check(totalFishing >= 3)} Pancing 3x ${prog(totalFishing, 3)}<br>`;
                    } else if (role === 'entrepreneur') {
                        html += `${check(p.biz >= 15)} BIZ 15+ ${prog(p.biz, 15)}<br>`;
                        html += `${check(p.money >= 25000)} Tabung 25.000G ${prog((p.money/1000).toFixed(1)+'k', '25k')}<br>`;
                    } else if (role === 'family') {
                        html += `${check(p.reputation >= 15)} REP 15+ ${prog(p.reputation, 15)}<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 2)} Punya 2 Teman ${prog(Object.keys(p.relationships).length, 2)}<br>`;
                    }
                    html += createClaimBtn("TAHUN 1", "claimReward('year1')", y1Complete, y1Done, "🌱 Reward: 30.000G + 1500EXP + 2 Tonic + 15AP");

                    // ─── MILESTONE TAHUN 2 ───────────────────────────────────────
                    const y2Done     = p.claimedYear2;
                    const y2Complete = checkYear2Completion();
                    const hasFarmed  = p.farming && Object.values(p.farming).some(c => c && c.harvested);
                    html += section('🌿 MILESTONE TAHUN 2 — Mulai Berkembang', y2Done ? '#4ade80' : '#0ea5e9');
                    html += `<div style="font-size:10px; color:#78350f; margin-bottom:6px; background:rgba(14,165,233,0.08); padding:6px 8px; border-radius:6px; border-left:3px solid #0ea5e9;">
                        Sudah setahun berlalu. Kini saatnya membuktikan dirimu bisa berkembang lebih jauh dari rata-rata.
                    </div>`;
                    html += `${check(p.level >= 10)} Level 10+ ${prog(p.level, 10)}<br>`;
                    html += `${check(totalJournals >= 10)} Tulis 10 Jurnal Refleksi ${prog(totalJournals, 10)}<br>`;
                    html += `${check(totalMonsterKills >= 20)} Kalahkan 20 Monster ${prog(totalMonsterKills, 20)}<br>`;
                    html += `${check(hasFarmed)} Berhasil Panen Tanaman 1x<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 30)} STR 30+ ${prog(p.str, 30)}<br>`;
                        html += `${check(p.money >= 60000)} Tabung 60.000G ${prog((p.money/1000).toFixed(1)+'k', '60k')}<br>`;
                        html += `${check(p.bossReputation >= 50)} Reputasi Bos 50+ ${prog(p.bossReputation || 0, 50)}<br>`;
                    } else if (role === 'student') {
                        html += `${check(p.int >= 30)} INT 30+ ${prog(p.int, 30)}<br>`;
                        html += `${check(!!p.major)} Sudah Daftar Jurusan<br>`;
                    } else if (role === 'entrepreneur') {
                        html += `${check(p.biz >= 30)} BIZ 30+ ${prog(p.biz, 30)}<br>`;
                        html += `${check(p.money >= 80000)} Tabung 80.000G ${prog((p.money/1000).toFixed(1)+'k', '80k')}<br>`;
                        html += `${check((p.houseLevel||1) >= 2)} Upgrade Rumah Lv 2 ${prog(p.houseLevel||1, 2)}<br>`;
                    } else if (role === 'family') {
                        html += `${check(p.reputation >= 30)} REP 30+ ${prog(p.reputation, 30)}<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 4)} Punya 4 Teman ${prog(Object.keys(p.relationships).length, 4)}<br>`;
                    }
                    html += createClaimBtn("TAHUN 2", "claimReward('year2')", y2Complete, y2Done, "🌿 Reward: 60.000G + 2500EXP + Tonic Kebal + 2 Berlian + 25AP");

                    // ─── MILESTONE TAHUN 3 ───────────────────────────────────────
                    const y3Done     = p.claimedLifeTrial || p.claimedYear3;
                    const y3Complete = checkYear3Completion();
                    html += section('⚔️ MILESTONE TAHUN 3 — Ujian Nyata (SULIT)', y3Done ? '#4ade80' : '#f59e0b');
                    html += `<div style="font-size:10px; color:#7c3a0e; margin-bottom:6px; background:rgba(245,158,11,0.12); padding:6px 8px; border-radius:6px; border-left:3px solid #f59e0b;">
                        ⚠️ Ini bukan sekadar bertahan — kamu harus benar-benar membuktikan diri. Semua jalur punya syarat keras di tahun ini.
                    </div>`;
                    html += `${check(p.level >= 18)} Level 18+ ${prog(p.level, 18)}<br>`;
                    html += `${check(totalJournals >= 20)} Tulis 20 Jurnal Refleksi ${prog(totalJournals, 20)}<br>`;
                    html += `${check(totalMonsterKills >= 50)} Kalahkan 50 Monster ${prog(totalMonsterKills, 50)}<br>`;
                    html += `${check(totalFishing >= 10)} Pancing 10x ${prog(totalFishing, 10)}<br>`;
                    html += `${check(totalAP >= 30)} Achievement Points 30+ ${prog(totalAP, 30)}<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 50)} STR 50+ ${prog(p.str, 50)}<br>`;
                        html += `${check(p.money >= 120000)} Tabung 120.000G ${prog((p.money/1000).toFixed(1)+'k','120k')}<br>`;
                        html += `${check(p.bossReputation >= 70)} Reputasi Bos 70+ ${prog(p.bossReputation||0, 70)}<br>`;
                        html += `${check((p.jobStatus==='promoted'||p.bossReputation>=80))} Naik Jabatan / Rep ≥80<br>`;
                    } else if (role === 'student') {
                        const hasBook = Object.keys(p.inventory).some(k => k.includes('buku') && !k.includes('tesis'));
                        html += `${check(p.int >= 50)} INT 50+ ${prog(p.int, 50)}<br>`;
                        html += `${check(!!p.major)} Sudah Pilih Jurusan<br>`;
                        html += `${check(hasBook)} Punya Buku Referensi<br>`;
                    } else if (role === 'entrepreneur') {
                        const totalSell = p.totalSellCount || p.dailySellCount || 0;
                        html += `${check(p.biz >= 50)} BIZ 50+ ${prog(p.biz, 50)}<br>`;
                        html += `${check(p.money >= 150000)} Tabung 150.000G ${prog((p.money/1000).toFixed(1)+'k','150k')}<br>`;
                        html += `${check((p.houseLevel||1) >= 2)} Rumah Lv 2+ ${prog(p.houseLevel||1, 2)}<br>`;
                        html += `${check(totalSell >= 10)} Total 10x Jual Barang ${prog(totalSell, 10)}<br>`;
                    } else if (role === 'family') {
                        const hasLove = Object.values(p.relationships||{}).some(r => r >= 70);
                        html += `${check(p.reputation >= 50)} REP 50+ ${prog(p.reputation, 50)}<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 6)} Punya 6 Teman ${prog(Object.keys(p.relationships).length, 6)}<br>`;
                        html += `${check(p.married || hasLove)} Menikah / Relasi Cinta ≥70<br>`;
                    }
                    html += createClaimBtn("TAHUN 3", "claimReward('year3')", y3Complete, y3Done, "⚔️ Reward: 120.000G + 5000EXP + 3 Tonic Kebal + 3 Berlian + 50AP");

                    // ─── MILESTONE TAHUN 4 ───────────────────────────────────────
                    const y4Done     = p.claimedYear4;
                    const y4Complete = checkYear4Completion();
                    html += section('💎 MILESTONE TAHUN 4 — Menjelang Puncak (SANGAT SULIT)', y4Done ? '#4ade80' : '#8b5cf6');
                    html += `<div style="font-size:10px; color:#4c1d95; margin-bottom:6px; background:rgba(139,92,246,0.10); padding:6px 8px; border-radius:6px; border-left:3px solid #8b5cf6;">
                        🔥 Hampir sampai. Tapi jalan menuju puncak adalah yang paling terjal. Hanya yang benar-benar siap yang bisa melangkah lebih jauh.
                    </div>`;
                    html += `${check(p.level >= 25)} Level 25+ ${prog(p.level, 25)}<br>`;
                    html += `${check(totalJournals >= 35)} Tulis 35 Jurnal Refleksi ${prog(totalJournals, 35)}<br>`;
                    html += `${check(totalMonsterKills >= 80)} Kalahkan 80 Monster ${prog(totalMonsterKills, 80)}<br>`;
                    html += `${check(totalAP >= 60)} Achievement Points 60+ ${prog(totalAP, 60)}<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 70)} STR 70+ ${prog(p.str, 70)}<br>`;
                        html += `${check(p.money >= 300000)} Tabung 300.000G ${prog((p.money/1000).toFixed(1)+'k','300k')}<br>`;
                        html += `${check(p.bossReputation >= 90)} Reputasi Bos 90+ ${prog(p.bossReputation||0, 90)}<br>`;
                    } else if (role === 'student') {
                        const hasTesisDraft = !!(p.inventory && (p.inventory['buku_tesis'] || p.inventory['draft_tesis']));
                        html += `${check(p.int >= 70)} INT 70+ ${prog(p.int, 70)}<br>`;
                        html += `${check(hasTesisDraft)} Punya Draft / Buku Tesis<br>`;
                        html += `${check(!!p.major)} Jurusan Aktif<br>`;
                    } else if (role === 'entrepreneur') {
                        html += `${check(p.biz >= 70)} BIZ 70+ ${prog(p.biz, 70)}<br>`;
                        html += `${check(p.money >= 400000)} Tabung 400.000G ${prog((p.money/1000).toFixed(1)+'k','400k')}<br>`;
                        html += `${check((p.houseLevel||1) >= 3)} Rumah Lv 3+ ${prog(p.houseLevel||1, 3)}<br>`;
                    } else if (role === 'family') {
                        html += `${check(p.reputation >= 70)} REP 70+ ${prog(p.reputation, 70)}<br>`;
                        html += `${check(p.married)} Sudah Menikah<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 8)} Punya 8 Teman ${prog(Object.keys(p.relationships).length, 8)}<br>`;
                    }
                    html += createClaimBtn("TAHUN 4", "claimReward('year4')", y4Complete, y4Done, "💎 Reward: 250.000G + 8000EXP + All Stat+5 + 5 Tonic + 5 Berlian + 80AP");

                    // ─── MILESTONE TAHUN 5 ───────────────────────────────────────
                    const y5Done     = p.claimedYear5;
                    const y5Complete = checkYear5Completion();
                    html += section('👑 MILESTONE TAHUN 5 — KELULUSAN SEJATI (ULTRA SULIT)', y5Done ? '#4ade80' : '#e11d48');
                    html += `<div style="font-size:10px; color:#7f1d1d; margin-bottom:6px; background:rgba(225,29,72,0.08); padding:6px 8px; border-radius:6px; border-left:3px solid #e11d48;">
                        🌟 Inilah momen yang kamu tunggu. 5 tahun perjalanan, keputusan, dan perjuangan berujung di sini. Tidak ada jalan pintas — hanya yang sungguh-sungguh yang layak menyandang gelar kehormatan.
                    </div>`;
                    html += `${check(p.level >= 30)} Level 30+ ${prog(p.level, 30)}<br>`;
                    html += `${check(totalJournals >= 50)} Tulis 50 Jurnal Refleksi ${prog(totalJournals, 50)}<br>`;
                    html += `${check(totalMonsterKills >= 120)} Kalahkan 120 Monster ${prog(totalMonsterKills, 120)}<br>`;
                    html += `${check(totalFishing >= 20)} Pancing 20x ${prog(totalFishing, 20)}<br>`;
                    html += `${check(totalAP >= 100)} Achievement Points 100+ ${prog(totalAP, 100)}<br>`;
                    if (role === 'worker') {
                        html += `${check(p.str >= 90)} STR 90+ ${prog(p.str, 90)}<br>`;
                        html += `${check(p.money >= 1000000)} Aset 1.000.000G ${prog((p.money/1000).toFixed(1)+'k','1000k')}<br>`;
                        html += `${check(p.bossReputation >= 100)} Reputasi Bos 100 (Manajer) ${prog(p.bossReputation||0, 100)}<br>`;
                        html += `${check(p.jobTitle === 'manager' || p.bossReputation >= 100)} Gelar Manajer Senior<br>`;
                    } else if (role === 'student') {
                        const hasTesis = !!(p.inventory && p.inventory['buku_tesis']);
                        html += `${check(p.int >= 90)} INT 90+ ${prog(p.int, 90)}<br>`;
                        html += `${check(hasTesis)} Selesaikan Tesis/Skripsi<br>`;
                        html += `${check(!!p.major)} Jurusan Aktif<br>`;
                    } else if (role === 'entrepreneur') {
                        html += `${check(p.biz >= 90)} BIZ 90+ ${prog(p.biz, 90)}<br>`;
                        html += `${check(p.money >= 1000000)} Aset 1.000.000G ${prog((p.money/1000).toFixed(1)+'k','1000k')}<br>`;
                        html += `${check((p.houseLevel||1) >= 5)} Rumah Mewah Lv 5 ${prog(p.houseLevel||1, 5)}<br>`;
                    } else if (role === 'family') {
                        const hasKid = p.children && p.children.length >= 1;
                        html += `${check(p.reputation >= 90)} REP 90+ ${prog(p.reputation, 90)}<br>`;
                        html += `${check(p.married)} Sudah Menikah<br>`;
                        html += `${check(hasKid)} Punya Anak<br>`;
                        html += `${check(Object.keys(p.relationships).length >= 10)} Punya 10 Teman ${prog(Object.keys(p.relationships).length, 10)}<br>`;
                    }
                    html += createClaimBtn("TAHUN 5 — TAMAT", "claimReward('year5')", y5Complete, y5Done,
                        "👑 Reward MEGA: 500.000G + 15.000EXP + 10 Tonic + 10 Berlian + 200AP + GELAR KEHORMATAN");

                    if (p.honorTitle) {
                        html += `<div style="text-align:center; margin-top:8px; background:rgba(251,191,36,0.15); border:2px solid #fbbf24; border-radius:10px; padding:8px; font-size:12px; color:#78350f; font-weight:800;">
                            👑 GELARMU: "${p.honorTitle}"
                        </div>`;
                    }

                    // ── KISAH LELUHUR (Side Quest Permanen) ──
                    const c1l = p.kilamong_c1 || false;
                    const c2l = p.kilamong_c2 || false;
                    const c3l = p.kilamong_c3 || false;
                    const c4l = p.kilamong_c4 || false;
                    const totalL   = [c1l,c2l,c3l,c4l].filter(Boolean).length;
                    const kerisL   = !!(p.inventory && p.inventory['keris_penjaga']);
                    const gulungL  = !!(p.inventory && (p.inventory['gulungan_mbahlamong'] || p.gulunganDibaca));
                    const kalungL  = !!(p.inventory && p.inventory['kalung_nelayan']);
                    const allDoneL = totalL === 4;

                    html += section('📜 Side Quest: Kisah Leluhur Lamongan', '#92400e');
                    html += `<div style="font-size:10px; color:#78350f; margin-bottom:6px; line-height:1.5;">
                        Temui <b>Ki Lamong</b> di dekat <b>Candi Kuno (Timur Laut)</b> untuk mendengarkan semua kisah leluhur dan meraih Keris Penjaga yang legendaris.
                    </div>`;

                    const pctL = Math.round((totalL / 4) * 100);
                    html += `<div style="background:#f1f5f9; border-radius:6px; height:8px; margin-bottom:6px; overflow:hidden;">
                        <div style="background:linear-gradient(90deg,#d97706,#fbbf24); width:${pctL}%; height:100%; border-radius:6px; transition:width .3s;"></div>
                    </div>`;
                    html += `<div style="text-align:right; font-size:9px; color:#92400e; margin-bottom:4px; font-weight:700;">${totalL}/4 Kisah · ${pctL}%</div>`;

                    html += `${check(c1l)} <b>Kisah Mbah Lamong</b> <span style="font-size:9px; color:#4ade80;">${c1l ? '✓ INT+3' : '→ Reward: INT+3'}</span><br>`;
                    if (c1l) html += `&nbsp;&nbsp;&nbsp;${check(gulungL)} <span style="font-size:10px;">Ambil Gulungan Mbah Lamong (INT+5)</span><br>`;
                    html += `${check(c2l)} <b>Legenda Nelayan Brondong</b> <span style="font-size:9px; color:#4ade80;">${c2l ? '✓ REP+5' : '→ Reward: REP+5'}</span><br>`;
                    if (c2l) html += `&nbsp;&nbsp;&nbsp;${check(kalungL)} <span style="font-size:10px;">Ambil Kalung Nelayan (Mancing +10%)</span><br>`;
                    html += `${check(c3l)} <b>Perjalanan Joko Tingkir</b> <span style="font-size:9px; color:#4ade80;">${c3l ? '✓ STR+2,INT+2' : '→ Reward: STR+2, INT+2'}</span><br>`;
                    html += `${check(c4l)} <b>Tradisi Kupatan Lamongan</b> <span style="font-size:9px; color:#4ade80;">${c4l ? '✓ Happy+10' : '→ Reward: Happiness+10'}</span><br>`;

                    html += `<div style="margin-top:6px; background:${allDoneL && kerisL ? 'rgba(251,191,36,0.15)' : 'rgba(241,245,249,1)'}; border:1px solid ${allDoneL ? '#fbbf24' : '#e2e8f0'}; border-radius:8px; padding:6px 8px;">`;
                    if (allDoneL && kerisL) {
                        html += `<div style="font-size:11px; font-weight:800; color:#92400e;">🏅 PENJAGA CERITA LAMONGAN</div>`;
                        html += `<div style="font-size:10px; color:#78350f;">⚔️ Keris Penjaga aktif: STR+5 · INT+5 · SPD+5 · BIZ+5<br><i>"Pohon yang berakar kuat, tumbuh paling tinggi."</i></div>`;
                    } else if (allDoneL && !kerisL) {
                        html += `<div style="font-size:11px; font-weight:800; color:#d97706;">⚔️ Keris Penjaga menunggumu!</div>`;
                        html += `<div style="font-size:10px; color:#78350f;">${check(false)} Temui Ki Lamong & klaim <b>Keris Penjaga</b> (semua stat +5)</div>`;
                    } else {
                        html += `<div style="font-size:10px; color:#94a3b8;">⚔️ <b>Keris Penjaga</b> (semua stat +5) — klaim setelah semua kisah selesai</div>`;
                    }
                    html += `</div>`;
                }

                // --- TAB 5: RELASI NPC ---
                else if (tabType === 'relasi') {
                    html += section('💞 Status Relasi Warga Desa', '#e11d48');
                    html += `<div style="font-size:10px; color:#78350f; margin-bottom:8px; background:rgba(225,29,72,0.07); padding:7px 9px; border-radius:8px; border-left:3px solid #e11d48; line-height:1.5;">
                        Sapa warga secara rutin agar hubungan tidak mendingin. NPC dengan <b>kepribadian Dingin/Formal</b> butuh lebih banyak usaha untuk bersahabat.<br>
                        <span style="color:#ef4444;">⚠️ Merah = sudah lama tidak disapa!</span>
                    </div>`;
                    html += getRelationPanelHTML();
                }

                return html;
            }

            // --- NEW: SYSTEM PRELOADER ASSET (FIX GAMBAR LAMA MUNCUL DI MOBILE) ---
            async function preloadAllGameAssets() {
                const imagesToLoad = [];

                // 1. Kumpulkan URL dari Aset Global (Variable Global)
                // Helper untuk mengambil src dari objek aset
                const collectGlobal = (collection) => {
                    Object.values(collection).forEach(img => {
                        if (img && img.src) imagesToLoad.push({ src: img.src }); // Hanya butuh src untuk cache browser
                    });
                };

                collectGlobal(treeAssets);
                collectGlobal(bagAssets);
                collectGlobal(bgSeasons);
                collectGlobal(houseBgAssets);
                collectGlobal(dungeonAssets);
                collectGlobal(wallAssets);
                collectGlobal(grassAssets);
                collectGlobal(farmAssets); // Add Farm Assets to Preloader
                collectGlobal(ruinsAssets); // NEW: Add Ruins Assets
                collectGlobal(candiAssets); // NEW: Add Candi Assets
                collectGlobal(clinicAssets); // NEW: Add Clinic Assets
                collectGlobal(mentorAssets); // NEW: Add Mentor Assets

                // 2. Kumpulkan semua gambar dari Peta (Bangunan, NPC, Objek)
                // FIX: Bungkus dalam Try-Catch dan Cek 'maps' agar tidak error jika map belum siap
                try {
                    if (typeof maps !== 'undefined') {
                        for (const [mapName, mapData] of Object.entries(maps)) {
                            // Buildings
                            if (mapData.buildings) {
                                mapData.buildings.forEach(b => {
                                    if (b.img) imagesToLoad.push({ src: b.img, element: b });
                                });
                            }
                            // NPCs
                            if (mapData.npcs) {
                                mapData.npcs.forEach(n => {
                                    if (n.imgSrc) imagesToLoad.push({ src: n.imgSrc, element: n });
                                });
                            }
                            // Objects
                            if (mapData.objects) {
                                mapData.objects.forEach(o => {
                                    if (o.img) imagesToLoad.push({ src: o.img, element: o });
                                });
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Aset Peta dilewati (Maps belum siap):", e);
                }

                // 3. Tambahkan Aset Player (Gender & Kostum) & UI Penting SECARA MANUAL
                // Agar tidak blank saat ganti baju atau pertama login
                const manualAssets = [
                    // UI & Backgrounds
                    'images/bg.png', 'images/landinggame.png', 'images/lobby.png', 'images/leaderboard.png',
                    'images/tas-isi.png', 'images/tas-kosong.png', 'images/quest-scroll.png',
                    'images/logosmk.png', 'images/loganailul.png', 'images/logotkj.png',

                    // Player Boy
                    'images/boy.png', 'images/boy-idle.png', 'images/boy-walk.png',
                    'images/boy-atas.png', 'images/boy-bawah.png', 'images/boy-pukul.png',
                    'images/boy-idle-weding.png', 'images/boy-walk-weding.png',

                    // Player Girl
                    'images/girl.png', 'images/girl-idle.png', 'images/girl-walk.png',
                    'images/girl-atas.png', 'images/girl-bawah.png', 'images/girl-pukul.png',
                    'images/girl-idle-weding.png', 'images/girl-walk-weding.png',

                    // Item Icons (Penting)
                    'images/ikankecil.png', 'images/ikansedang.png', 'images/ikanbesar.png', 'images/ikanlegendary.png',
                    'images/buku.png', 'images/buku-tesis-teknologi.png', 'images/buku-tesis-sejarah.png',
                    'images/draftskripsi-teknologi.png', 'images/draftskripsi-sejarah.png',
                    'images/sertifikat-manajer.png', 'images/ijazah-teknologi.png', 'images/ijazah-sejarah.png',
                    // NEW: ASSET KURCACI TANI & PERI PANEN
                    'images/kurcacitani.png', 'images/peripanen.png',
                    // NEW: ASSET ORANG SAWAH
                    'images/orangsawah.png',
                    // NEW: ASSET RAFFLESIA ARNOLDI
                    'images/rafflesia.png',
                    // NEW: ASSET RERUNTUHAN (FIX AGAR TIDAK KOSONG)
                    'images/tembok-reruntuhan.png',
                    'images/lantai-reruntuhan.png',
                    // NEW: ASSET LANTAI CANDI
                    'images/lantaicandi.png',
                    'images/lantaimerahcandi.png', // NEW
                    // NEW: ASSET ARCA & GUCI CANDI
                    'images/arcacandi.png',
                    'images/gucicandi.png',
                    // NEW: ASSET LILIN ABADI
                    'images/lilinabadi.png',
                    // NEW: ASSET PRASASTI CANDI
                    'images/prasasticandi.png',
                    // NEW: ASSET MEJA ALTAR CANDI
                    'images/mejaaltar.png',
                    // NEW: ASSET JARING IKAN
                    'images/jaringikan.png',
                    // NEW: ASSET RAK PANCING
                    'images/rakpancing.png',
                    // NEW: ASSET EMBER IKAN
                    'images/emberikan.png',
                    // NEW: ASSET BOXES (BOX ES)
                    'images/boxes.png',
                    // NEW: ASSET KASUR NELAYAN
                    'images/kasurnelayan.png',
                    // NEW: ASSET RAK PIALA IKAN
                    'images/rakpialaikan.png',
                    // NEW: ASSET MEJA MAKAN IKAN
                    'images/mejamakanikan.png',
                    // NEW: ASSET KLINIK BARU
                    'images/mejadokter.png',
                    'images/lemariobat.png',
                    'images/arsiprekammedis.png',
                    // NEW: ASSET KEBUN AYU
                    'images/kebunayu.png',
                    // NEW: ASSET KASUR AYU
                    'images/kasurayaayu.png',
                    // NEW: ASSET LEMARI AYU
                    'images/lemariayaayu.png',
                    // NEW: ASSET MEJA AYU
                    'images/mejaayaayu.png',
                    // NEW: ASSET DAPUR AYU
                    'images/dapurayaayu.png',
                    // NEW: ASSET KAIA & ANAK KECIL (TAMBAHAN MANUAL AGAR TIDAK HILANG)
                    'images/kaia.png',
                    'images/anakkecil1.png',
                    'images/anakkecil2.png',
                    // NEW: ASSET TUMPUKAN KERTAS
                    'images/tumpukankertas.png',
                    // NEW: ASSET FOTO MENTOR
                    'images/fotomentor.png',
                    // NEW: ASSET ALTAR PERNIKAHAN
                    'images/altar.png',
                    // NEW: ASSET TUNGKU
                    'images/tungku.png',
                    // NEW: ASSET PARON
                    'images/paron.png',
                    // NEW: ASSET RAK SENJATA
                    'images/raksenajata.png',
                    // NEW: ASSET MEJA JAHIT
                    'images/mejajahit.png',
                    // NEW: ASSET BIJIH BESI
                    'images/bijihbesi.png',
                    // NEW: ASSET KAYU BAKAR
                    'images/kayubakar.png', // <--- TAMBAHAN KOMA DI SINI
                    // NEW: ASSET BONEKA SALJU
                    'images/snowman.png',

                    // --- [FIX] TAMBAHAN ASET RUMAH AGAR TIDAK BLANK SAAT LOGIN ---
                    'images/warnet.png', // <--- TAMBAHAN BARU: WARNET
                    'images/penjagawarnet.png', // <--- BARU: PENJAGA
                    'images/maidwarnet.png',    // <--- BARU: MAID
                    'images/houselevel1.png',
                    'images/houselevel2.png',
                    'images/houselevel3.png',
                    'images/houselevel4.png',
                    'images/houselevel5.png',
                    'images/tokoplayer.png',
                    'images/player-race.png', // <--- NEW: ASSET MOBIL BALAP
                    // --- NEW: ASSET MUSUH BALAP ---
                    'images/taxi-race.png',
                    'images/bike-race.png',
                    'images/truck-race.png',
                    'images/suv-race.png'
                ];

                // FIX: TAMBAHKAN ASET PROLOGUE AGAR TIDAK BLACK SCREEN SAAT MULAI
                for (let i = 1; i <= 10; i++) {
                    manualAssets.push(`images/scene-${i}.png`);
                }

                manualAssets.forEach(src => imagesToLoad.push({ src: src }));

                // Hilangkan duplikat agar loading lebih efisien
                const uniqueImages = [];
                const seenSrc = new Set();
                imagesToLoad.forEach(item => {
                    // Normalisasi src (kadang browser nambahin base url)
                    // Kita pakai raw src string untuk cek duplikasi
                    if (item.src && !seenSrc.has(item.src)) {
                        seenSrc.add(item.src);
                        uniqueImages.push(item);
                    } else if (item.element) {
                        // Jika duplikat tapi ada referensi elemen map, tetap perlu di-handle referensinya
                        uniqueImages.push(item);
                    }
                });

                const total = uniqueImages.length;
                let loaded = 0;
                const loadingBar = document.getElementById('loading-bar');
                const loadingText = document.getElementById('loading-text');

                // Jika tidak ada aset (aneh), langsung selesai
                if (total === 0) return;

                console.log(`Memulai Preload untuk ${total} Aset Gambar...`);

                // Fungsi Load Satu Gambar
                const loadImage = (item) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();

                        // FIX: PASANG LISTENER DULU SEBELUM SET SRC
                        img.onload = () => {
                            loaded++;
                            const pct = Math.floor((loaded / total) * 100);
                            if (loadingBar) loadingBar.style.width = pct + "%";
                            // Tampilkan nama file di akhir agar tidak terasa beku
                            const fname = item.src ? item.src.split('/').pop() : '...';
                            const phase = pct < 20 ? '🖼️ Aset Utama'
                                        : pct < 50 ? '🎨 Karakter & Peta'
                                        : pct < 80 ? '🌿 Lingkungan'
                                        : pct < 95 ? '✨ Finishing...'
                                        : '🏁 Hampir Selesai!';
                            if (loadingText) loadingText.innerText = `${phase}  (${loaded}/${total}) ${pct}%`;

                            // Jika ini elemen map, simpan referensi gambar yang SUDAH DILOAD
                            if (item.element) {
                                item.element.loadedImg = img;
                            }
                            resolve();
                        };

                        img.onerror = () => {
                            console.warn("Gagal memuat:", item.src);
                            loaded++;
                            const pct = Math.floor((loaded / total) * 100);
                            if (loadingBar) loadingBar.style.width = pct + "%";
                            const phase = pct < 95 ? '⚠️ Melewati aset...' : '🏁 Hampir Selesai!';
                            if (loadingText) loadingText.innerText = `${phase}  (${loaded}/${total}) ${pct}%`;

                            // Jangan reject agar game tetap jalan (gunakan fallback nanti)
                            resolve();
                        };

                        // SET SRC TERAKHIR
                        img.src = item.src;
                    });
                };

                // ─────────────────────────────────────────────────────────
                // OPTIMASI: BATCHED LOADING (ganti Promise.all sekaligus)
                //
                // Masalah Promise.all biasa: semua 200 request dikirim bersamaan.
                // Browser punya limit ~6 koneksi per domain → aset ke-7 dst antri
                // → progress bar "stuck" di 90% karena 150 aset masih dalam antrian.
                //
                // Solusi: kirim dalam batch kecil (BATCH_SIZE aset per gelombang).
                // Ini menjaga antrian browser tidak terlalu panjang sehingga
                // progress bar bergerak lebih merata & tidak terasa macet di akhir.
                // ─────────────────────────────────────────────────────────
                const BATCH_SIZE = 12; // 12 = sweet spot: tidak terlalu lambat, tidak flood browser

                // Pisahkan aset kritis (UI, player, bg) agar dimuat di batch pertama
                const CRITICAL_KEYWORDS = [
                    'bg.png', 'landinggame', 'lobby', 'boy.png', 'girl.png',
                    'boy-idle', 'girl-idle', 'boy-walk', 'girl-walk',
                    'scene-1', 'scene-2', 'scene-3',
                ];
                const criticalImages = uniqueImages.filter(item =>
                    CRITICAL_KEYWORDS.some(k => item.src && item.src.includes(k))
                );
                const normalImages = uniqueImages.filter(item =>
                    !CRITICAL_KEYWORDS.some(k => item.src && item.src.includes(k))
                );
                const orderedImages = [...criticalImages, ...normalImages];

                // Fungsi bantu: proses array dalam batch berurutan
                async function loadInBatches(items, batchSize) {
                    for (let i = 0; i < items.length; i += batchSize) {
                        const batch = items.slice(i, i + batchSize);
                        await Promise.all(batch.map(item => loadImage(item)));
                    }
                }

                await loadInBatches(orderedImages, BATCH_SIZE);
            }

            // UPDATE: FUNGSI INIT PERTAMA KALI
            function startGameSequence() {
                try {
                    // ── INIT DEBUG MODE dari localStorage (jalankan sebelum apapun) ──
                    // Ini memastikan tombol test & badge langsung muncul jika debug sudah ON
                    // dari sesi admin sebelumnya tanpa perlu buka panel lagi.
                    (function _initDebugVisuals() {
                        const isDebug = window.GAME_DEBUG;
                        const badge = document.getElementById('debug-hud-badge');
                        if (badge) badge.style.display = isDebug ? 'flex' : 'none';
                        ['fairy-test-btn', 'skripsi-test-btn'].forEach(id => {
                            const el = document.getElementById(id);
                            if (el) el.style.display = isDebug ? 'flex' : 'none';
                        });
                    })();

                    // Cek sesi login terakhir untuk prefill
                    try {
                        let lastUser = localStorage.getItem(SESSION_KEY);
                        if (lastUser) {
                            // FIX: Jika data berupa JSON (Sesi Admin Lama), HAPUS dan jangan tampilkan agar tidak error
                            if (lastUser.trim().startsWith('{')) {
                                localStorage.removeItem(SESSION_KEY); // Bersihkan sesi rusak
                                lastUser = null;
                            }

                            if (lastUser) {
                                const elSiswa = document.getElementById('siswa-email');
                                const elGuru = document.getElementById('guru-email');
                                if (elSiswa) elSiswa.value = lastUser;
                                if (elGuru) elGuru.value = lastUser;
                            }
                        }
                    } catch (e) { console.warn("Local storage/DOM Access Error:", e); }

                    // Pastikan Audio Prompt muncul duluan, Splash sembunyi
                    const audioPrompt = document.getElementById('audio-prompt');
                    const splash = document.getElementById('splash-screen');

                    // FIX: Pastikan Layar Login & Title sembunyi di awal untuk mencegah glitch visual
                    const loginScreen = document.getElementById('login-screen');
                    const titleScreen = document.getElementById('title-screen');
                    if (loginScreen) loginScreen.style.display = 'none';
                    if (titleScreen) titleScreen.classList.add('hidden');

                    if (audioPrompt) audioPrompt.style.display = 'flex';
                    if (splash) splash.style.display = 'none';

                } catch (err) {
                    console.error("CRITICAL INIT ERROR:", err);
                }
            };

            // Jalankan saat HTML sudah siap (Lebih cepat dari window.onload)
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startGameSequence);
            } else {
                startGameSequence();
            }

            // UPDATE: HANDLE PILIHAN AUDIO -> LANJUT KE LOADING ASET
            function handleAudioChoice(enable) {
                // Browser butuh interaksi user untuk fullscreen, jadi ini tempat terbaik.
                toggleFullScreen();

                AudioService.enabled = enable;

                // 1. Sembunyikan Audio Prompt
                document.getElementById('audio-prompt').style.display = 'none';

                // 2. Tampilkan Splash Screen (Loading)
                const splash = document.getElementById('splash-screen');
                if (splash) {
                    splash.style.display = 'flex';
                    splash.style.opacity = 1;
                }

                // 3. Init Audio Context (Karena sudah ada interaksi user, audio bisa jalan)
                if (typeof AudioService !== 'undefined') {
                    AudioService.init();
                    if (enable) {
                        AudioService.playBGM('opening');
                    }
                }

                // 4. Mulai Loading Aset
                startAssetLoading();
            }

            // NEW: FUNGSI LOADING ASET (WAJIB 100%)
            function startAssetLoading() {
                console.log("Memulai Asset Loading...");
                const loadingText = document.getElementById('loading-text');
                const loadingBar = document.getElementById('loading-bar');
                const loadingContainer = document.getElementById('loading-container');
                const startBtn = document.getElementById('splash-start-btn');

                // UPDATE: HAPUS "Promise.race" dan "setTimeout".
                // Sekarang kita murni menunggu preloadAllGameAssets selesai sepenuhnya.

                preloadAllGameAssets().then(() => {
                    // Kode di dalam sini HANYA akan jalan setelah semua aset selesai (Resolusi 100%)
                    console.log("Assets Ready: 100%");

                    // Pastikan visual bar penuh
                    if (loadingBar) loadingBar.style.width = '100%';
                    if (loadingText) loadingText.innerText = 'ASET SIAP! 100%';

                    // Beri jeda sedikit (500ms) agar pemain sempat melihat tulisan "100%"
                    setTimeout(() => {
                        // Sembunyikan Loading Bar & Teks
                        if (loadingContainer) loadingContainer.style.display = 'none';
                        if (loadingText) loadingText.style.display = 'none';

                        // Tampilkan Tombol Mulai
                        if (startBtn) {
                            startBtn.style.display = 'block';
                            // Tambahkan efek animasi masuk
                            startBtn.style.animation = "pulse 1s infinite";

                            startBtn.onclick = () => {
                                // Sembunyikan tombol biar gak diklik 2x
                                startBtn.style.display = 'none';

                                // Efek Suara (Jika ada)
                                if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                                    AudioService.playSFX('item');
                                }

                                enterMainMenu();
                            };
                        }
                    }, 500);

                }).catch(err => {
                    console.error("Preload Error:", err);
                    // Fallback jika terjadi error fatal pada sistem loading (jarang terjadi)
                    if (loadingText) loadingText.innerText = "TERJADI KESALAHAN MEMUAT.";

                    if (startBtn) {
                        startBtn.innerText = "⚠️ REFRESH HALAMAN";
                        startBtn.style.display = 'block';
                        startBtn.onclick = () => location.reload();
                    }
                });
            }

            // Helper untuk Masuk Menu Utama
            function enterMainMenu() {
                const splash = document.getElementById('splash-screen');
                if (typeof resize === 'function') resize();

                // Fade Out Splash -> Masuk Title Screen / Cek Session
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        if (splash) {
                            splash.style.opacity = 0; // Trigger CSS transition fadeOut
                            setTimeout(() => {
                                splash.style.display = 'none';

                                // Cek Session setelah loading selesai
                                const title = document.getElementById('title-screen');
                                checkSession(title);

                            }, 500); // Hapus elemen setelah animasi CSS selesai
                        } else {
                            const title = document.getElementById('title-screen');
                            checkSession(title);
                        }
                    }, 200);
                });
            }

            function togglePassword(fieldId, iconId) {
                const input = document.getElementById(fieldId);
                const icon = document.getElementById(iconId);
                if (input.type === "password") {
                    input.type = "text";
                    icon.innerText = "🔓";
                } else {
                    input.type = "password";
                    icon.innerText = "👁️";
                }
            }

            function checkSession(titleEl) {
                try {
                    const sessionData = localStorage.getItem(SESSION_KEY);
                    if (sessionData) {
                        // FIX: Legacy Support - Jika masih ada user yang menyimpan JSON, handle gracefuly
                        // Tapi idealnya kita sudah bersihkan di startGameSequence
                        if (sessionData.trim().startsWith('{')) {
                            try {
                                const adminUser = JSON.parse(sessionData);
                                // Migrasi otomatis ke format baru (String Email)
                                localStorage.setItem(SESSION_KEY, adminUser.email || "admin@system.local");
                                DataService.user = adminUser;
                                initTeacherDashboard();
                                return;
                            } catch (e) {
                                localStorage.removeItem(SESSION_KEY); // Corrupt, hapus
                                return;
                            }
                        }

                        // --- LOGIKA STANDAR (Admin/Guru/Siswa sekarang diperlakukan sama) ---
                        const dbLocal = DataService.getDB();
                        const user = dbLocal[sessionData];

                        if (user) {
                            DataService.user = { email: sessionData, ...user };

                            // Cek Role untuk Redirect
                            if (user.role === 'admin') {
                                // Sembunyikan layar lain
                                document.getElementById('login-screen').style.display = 'none';
                                document.getElementById('title-screen').classList.add('hidden');
                                initTeacherDashboard();
                            }
                            else if (user.role === 'guru') {
                                initTeacherDashboard();
                            }
                            else {
                                // Logic Siswa
                                document.getElementById('welcome-name').innerText = user.name || "Siswa";
                                document.getElementById('welcome-class').innerText = user.details || "Umum";
                                if (user.mentor) document.getElementById('welcome-mentor').innerText = "Mentor Active";
                                document.getElementById('login-screen').style.display = 'none';

                                if (!user.saveData) {
                                    startPrologue();
                                } else {
                                    document.getElementById('start-screen').classList.remove('hidden');
                                }
                            }
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Session Check Error:", e);
                    localStorage.removeItem(SESSION_KEY);
                }

                if (titleEl) titleEl.classList.remove('hidden');
                STATE.screen = 'title';
            }

            // NEW: FUNCTION TOGGLE FULLSCREEN & FORCE LANDSCAPE
            function toggleFullScreen() {
                const elem = document.documentElement;

                // --- UPDATE: FUNGSI MEMAKSA ORIENTASI LANDSCAPE (ANDROID/CHROME) ---
                // Ini memungkinkan game berputar otomatis meskipun "Auto-Rotate" di HP dimatikan
                const forceLandscape = () => {
                    if (screen.orientation && screen.orientation.lock) {
                        screen.orientation.lock('landscape')
                            .then(() => console.log("Orientation locked to Landscape"))
                            .catch((err) => {
                                // Beberapa browser/OS (terutama iOS Safari) mungkin menolak ini
                                console.warn("Orientation lock failed/not supported:", err);
                            });
                    }
                };

                // Cek apakah browser sudah dalam mode fullscreen?
                const isFullscreen = document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement;

                if (!isFullscreen) {
                    // KONDISI 1: BELUM FULLSCREEN -> Request Fullscreen dulu, baru Lock Landscape
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen().then(forceLandscape).catch(err => console.log(err));
                    } else if (elem.webkitRequestFullscreen) { /* Safari */
                        elem.webkitRequestFullscreen();
                        setTimeout(forceLandscape, 500); // Coba lock setelah delay di Safari
                    } else if (elem.msRequestFullscreen) { /* IE11 */
                        elem.msRequestFullscreen();
                        setTimeout(forceLandscape, 500);
                    }
                } else {
                    // KONDISI 2: SUDAH FULLSCREEN -> Langsung Paksa Lock Landscape
                    // (Berguna jika pemain tidak sengaja memutar HP kembali ke potrait)
                    forceLandscape();
                }
            }

            // logout() defined below

            function goToLogin() {
                // FITUR OTOMATIS FULLSCREEN: Trigger saat klik tombol Start
                toggleFullScreen();

                document.getElementById('title-screen').classList.add('hidden');
                document.getElementById('login-screen').style.display = 'flex';
                STATE.screen = 'login';
            }

            function goToTitle() {
                document.getElementById('login-screen').style.display = 'none';
                const gcCanvas = document.getElementById('gameCanvas');
                if (gcCanvas) gcCanvas.style.display = 'none';
                document.getElementById('title-screen').classList.remove('hidden');
                STATE.screen = 'title';
            }

            // --- NEW: PUBLIC LEADERBOARD LOGIC ---
            async function showLeaderboard() {
                // 1. Tampilkan Overlay Loading
                const overlay = document.getElementById('leaderboard-overlay');
                const list = document.getElementById('lb-list');
                overlay.style.display = 'flex';
                list.innerHTML = '<div style="padding:20px; color:#78350f; font-weight:bold;">🔄 Sinkronisasi Data...</div>';

                try {
                    // FIX: Paksa Init Koneksi Cloud dulu agar data terbaru diambil
                    await DataService.init(true);

                    // 2. Ambil Data Global dari Server
                    let students = await DataService.getAllStudents();

                    // 3. OPTIMISTIC UPDATE (Gabungkan Data Lokal Pemain jika Lebih Baru)
                    // Ini memastikan skor pemain sendiri terlihat update meski server delay
                    const currentUserEmail = localStorage.getItem(SESSION_KEY);
                    if (currentUserEmail) {
                        const dbLocal = DataService.getDB();
                        const localUserData = dbLocal[currentUserEmail];

                        // Cek apakah user punya data lokal yang valid
                        if (localUserData && localUserData.saveData) {
                            // Cari data user ini di list server
                            const serverIndex = students.findIndex(s => s.email === currentUserEmail);

                            if (serverIndex !== -1) {
                                // Jika ketemu, bandingkan timestamp (lastActive)
                                const serverSave = students[serverIndex].saveData || {};
                                const localSave = localUserData.saveData;

                                // Jika lokal lebih baru dari server, TIMPA data server di memori tampilan
                                if ((localSave.lastActive || 0) > (serverSave.lastActive || 0)) {
                                    students[serverIndex] = { ...students[serverIndex], ...localUserData };
                                    console.log("Leaderboard: Menggunakan data lokal (lebih baru) untuk user ini.");
                                }
                            } else {
                                // Jika user belum ada di server (baru main offline), masukkan ke list manual
                                if (localUserData.role === 'siswa') {
                                    students.push({ email: currentUserEmail, ...localUserData });
                                }
                            }
                        }
                    }

                    // 4. Filter & Sort
                    // Hanya siswa yang punya saveData valid
                    let validStudents = students.filter(s => s.saveData && s.saveData.day);

                    // Sort berdasarkan Score Tertinggi
                    validStudents.sort((a, b) => {
                        const scoreA = calculateGrade(a.saveData);
                        const scoreB = calculateGrade(b.saveData);
                        return scoreB - scoreA;
                    });

                    // Ambil Top 10
                    const top10 = validStudents.slice(0, 10);

                    // 5. Render
                    list.innerHTML = '';

                    if (top10.length === 0) {
                        list.innerHTML = '<div style="padding:20px; color:#78350f;">Belum ada data petualang. <br>Jadilah yang pertama!</div>';
                        return;
                    }

                    top10.forEach((s, index) => {
                        const rank = index + 1;
                        const score = calculateGrade(s.saveData);
                        const role = s.saveData.role !== 'none' ? s.saveData.role.toUpperCase() : 'NOVICE';
                        const lvl = s.saveData.level || 1;

                        // Style khusus 3 besar
                        let rankClass = '';
                        let icon = `#${rank}`;
                        let bgStyle = '';

                        if (rank === 1) { rankClass = 'top-1'; icon = '🥇'; bgStyle = 'background:#fef9c3; border-left: 4px solid #d97706;'; }
                        else if (rank === 2) { rankClass = 'top-2'; icon = '🥈'; }
                        else if (rank === 3) { rankClass = 'top-3'; icon = '🥉'; }

                        // Highlight User Sendiri (Update Style Terang)
                        if (s.email === currentUserEmail) {
                            bgStyle = 'background:#dbeafe; border: 2px solid #3b82f6;';
                            s.name += " (Kamu)";
                        }

                        list.innerHTML += `
                <div class="lb-item" style="${bgStyle}">
                    <div class="lb-rank ${rankClass}">${icon}</div>
                    <div class="lb-info">
                        <div class="lb-name">${s.name}</div>
                        <div class="lb-detail">${role} | Lv ${lvl}</div>
                    </div>
                    <div class="lb-score">${score}</div>
                </div>
            `;
                    });

                } catch (err) {
                    console.error("Leaderboard Error:", err);
                    list.innerHTML = `<div style="padding:20px; color:#ef4444;">Gagal memuat data server.<br><small>${err.message}</small></div>`;
                }
            }

            function closeLeaderboard() {
                document.getElementById('leaderboard-overlay').style.display = 'none';
            }

            // PROLOGUE LOGIC
            const prologueTexts = [
                "Di usia delapan belas tahun, setiap manusia berdiri di gerbang kehidupannya sendiri.",
                "Tidak ada peta yang benar. Tidak ada jalan yang pasti.",
                "Di Nusantara Arsa, kamu dikirim ke pulau ini bukan untuk dihukum, melainkan untuk ditempa.",
                "Di sini, kamu akan menghadapi realita. Kamu bukan lagi anak-anak, kamu adalah arsitek masa depan.",
                "Pilihanmu adalah kekuatanmu. Bekerja, Belajar, Membangun Usaha, atau Mencintai...",
                "Bahkan gagal dan bangkit kembali. Tidak ada jalan yang salah, hanya konsekuensi.",
                "Tidak semua akan berhasil. Dunia ini kejam bagi yang malas, tapi emas bagi yang berusaha.",
                "Namun mereka yang mampu bertahan, akan membawa pulang hal paling berharga: Pemahaman Hidup.",
                "Selamat datang di Nusantara Arsa.",
                "Hidupmu. Pilihanmu. Bangkitlah!"
            ];

            let prologueTimeout; // Variable to hold the timer
            let prologueIndex = 0; // Track index globally for skipping

            function startPrologue() {
                document.getElementById('login-screen').style.display = 'none';
                const screen = document.getElementById('prologue-screen');
                const textEl = document.getElementById('prologue-text');
                const skipBtn = document.getElementById('skip-prologue-btn');
                const nextBtn = document.getElementById('next-prologue-btn');

                screen.style.display = 'flex';
                skipBtn.style.display = 'block';
                if (nextBtn) nextBtn.style.display = 'block'; // Tampilkan tombol LANJUT
                STATE.screen = 'prologue';

                prologueIndex = 0;

                function showNextLine() {
                    if (prologueIndex >= prologueTexts.length) {
                        skipPrologue(); // Done naturally
                        return;
                    }

                    // Fade Out Text
                    textEl.style.opacity = 0;

                    // Hentikan timer sebelumnya jika ada (Safety)
                    if (prologueTimeout) clearTimeout(prologueTimeout);

                    // Tunggu fade out selesai (500ms)
                    prologueTimeout = setTimeout(() => {
                        // FIX: SYNC GAMBAR & TEKS
                        // Preload gambar dulu, baru tampilkan teks setelah gambar siap
                        const imgNum = prologueIndex + 1;
                        const imgSrc = `images/scene-${imgNum}.png`;
                        const img = new Image();

                        let isRendered = false; // Flag agar tidak jalan 2x

                        // Fungsi untuk menampilkan scene (Gambar + Teks)
                        const renderScene = () => {
                            if (isRendered) return;
                            isRendered = true;

                            // Cek jika user keburu skip saat loading
                            if (STATE.screen !== 'prologue') return;

                            // 1. Update Text
                            textEl.innerText = prologueTexts[prologueIndex];

                            // 2. Update Background (Gambar sudah ter-cache browser karena preload)
                            screen.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imgSrc}')`;

                            // 3. Fade In Text
                            textEl.style.opacity = 1;

                            prologueIndex++;

                            // 4. Update tombol LANJUT dengan nomor scene
                            const _nb = document.getElementById('next-prologue-btn');
                            if (_nb) {
                                const total = prologueTexts.length;
                                _nb.textContent = prologueIndex < total ? `LANJUT ▶  ${prologueIndex}/${total}` : 'LANJUT ▶';
                            }

                            // 5. Jadwalkan baris berikutnya (5 Detik)
                            prologueTimeout = setTimeout(showNextLine, 5000);
                        };

                        // Event Listeners
                        img.onload = renderScene;
                        img.onerror = () => {
                            console.warn(`Scene image missing/error: ${imgSrc}`);
                            renderScene(); // Tetap jalan walau gambar error (Fallback)
                        };

                        // Mulai Download Gambar
                        img.src = imgSrc;

                        // SAFETY TIMEOUT: Jika gambar loading > 3 detik (koneksi lambat), paksa jalan
                        setTimeout(() => {
                            if (!isRendered) {
                                console.log("Image load timeout (Slow Connection), forcing text display.");
                                renderScene();
                            }
                        }, 3000);

                    }, 500); // Waktu transisi fade out text
                }

                // Expose showNextLine agar tombol LANJUT bisa memanggilnya
                window._prologueNext = () => {
                    if (STATE.screen !== 'prologue') return;
                    if (prologueTimeout) clearTimeout(prologueTimeout);
                    showNextLine();
                };

                // Mulai sequence
                showNextLine();
            }

            function nextPrologue() {
                if (window._prologueNext) window._prologueNext();
            }

            function skipPrologue() {
                clearTimeout(prologueTimeout); // Stop animation
                window._prologueNext = null;   // Bersihkan referensi

                // Sembunyikan tombol LANJUT
                const nextBtn = document.getElementById('next-prologue-btn');
                if (nextBtn) nextBtn.style.display = 'none';

                // Reset style background prologue agar tidak mengganggu screen lain (just in case)
                document.getElementById('prologue-screen').style.backgroundImage = 'none';

                document.getElementById('prologue-screen').style.display = 'none';
                document.getElementById('gender-screen').style.display = 'flex';
            }

            function selectGender(gender, fromSave = false) {
                STATE.player.gender = gender;

                const avatarImg = document.getElementById('hud-avatar-img');
                if (gender === 'boy') {
                    avatarImg.src = 'images/boy.png';
                    avatarImg.onerror = function () {
                        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IiMzYjgyZjYiLz48L3N2Zz4=';
                    };
                    document.getElementById('hud-avatar-img').src = 'images/boy.png';
                } else {
                    avatarImg.src = 'images/girl.png';
                    avatarImg.onerror = function () {
                        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IiNlYzlhOWEiLz48L3N2Zz4=';
                    };
                    document.getElementById('hud-avatar-img').src = 'images/girl.png';
                }


                if (gender === 'boy') {
                    STATE.player.spriteIdle = new Image(); STATE.player.spriteIdle.src = 'images/boy-idle.png';
                    STATE.player.spriteWalk = new Image(); STATE.player.spriteWalk.src = 'images/boy-walk.png';
                    // NEW: Load Up Sprite for Boy
                    STATE.player.spriteWalkUp = new Image(); STATE.player.spriteWalkUp.src = 'images/boy-atas.png';
                    // NEW: Load Down Sprite for Boy
                    STATE.player.spriteWalkDown = new Image(); STATE.player.spriteWalkDown.src = 'images/boy-bawah.png';
                    // NEW: Load Attack Sprite for Boy
                    STATE.player.spriteAttack = new Image(); STATE.player.spriteAttack.src = 'images/boy-pukul.png';
                } else {
                    STATE.player.spriteIdle = new Image(); STATE.player.spriteIdle.src = 'images/girl-idle.png';
                    STATE.player.spriteWalk = new Image(); STATE.player.spriteWalk.src = 'images/girl-walk.png';
                    // NEW: Load Up Sprite for Girl
                    STATE.player.spriteWalkUp = new Image(); STATE.player.spriteWalkUp.src = 'images/girl-atas.png';
                    // NEW: Load Down Sprite for Girl
                    STATE.player.spriteWalkDown = new Image(); STATE.player.spriteWalkDown.src = 'images/girl-bawah.png';
                    // NEW: Load Attack Sprite for Girl
                    STATE.player.spriteAttack = new Image(); STATE.player.spriteAttack.src = 'images/girl-pukul.png';
                }

                if (!fromSave) {
                    document.getElementById('gender-screen').style.display = 'none';
                    document.getElementById('start-screen').classList.remove('hidden');
                }
            }

            /** * DATA SERVICE (UPDATED FOR DASHBOARD SUPPORT) */
            const DataService = {
                mode: 'local',
                user: null,
                dbKey: 'na_users_db',
                unsubscribeMsg: null, // Listener reference

                // NEW: Dashboard Source Control
                dashboardSource: 'auto', // 'auto', 'cloud', 'local'

                init: async function (useFirebase) {
                    // FAST CHECK: Jika navigator offline, langsung set local
                    if (!navigator.onLine) {
                        this.mode = 'local';
                        console.log("Mode Offline Terdeteksi via Navigator");
                        return false;
                    }

                    // FIX: Default ke local dulu, baru switch ke firebase jika sukses load
                    this.mode = 'local';
                    try {
                        if (typeof firebase !== 'undefined' && firebase.apps && !firebase.apps.length) {
                            firebase.initializeApp(firebaseConfig);
                            if (!db) db = firebase.firestore();
                            if (!analytics) analytics = firebase.analytics();

                            // Jika sampai sini tanpa error, berarti Firebase siap
                            this.mode = 'firebase';
                        } else if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
                            // Sudah init sebelumnya
                            if (!db) db = firebase.firestore();
                            this.mode = 'firebase';
                        }
                        return true;
                    } catch (e) {
                        console.error("Firebase Init Error:", e);
                        this.mode = 'local';
                        return false;
                    }
                },

                // NEW: Function to toggle source
                toggleDashboardSource: function () {
                    if (this.dashboardSource === 'auto') this.dashboardSource = 'cloud';
                    else if (this.dashboardSource === 'cloud') this.dashboardSource = 'local';
                    else this.dashboardSource = 'auto';

                    return this.dashboardSource;
                },

                getDB: function () {
                    try {
                        const raw = localStorage.getItem(this.dbKey);
                        return raw ? JSON.parse(raw) : {};
                    } catch (e) {
                        console.error("Database Corrupt! Resetting...", e);
                        localStorage.removeItem(this.dbKey);
                        return {};
                    }
                },

                saveDB: function (db) {
                    localStorage.setItem(this.dbKey, JSON.stringify(db));
                },

                // --- FIX: RESET DATA SEKARANG MEMBERSIHKAN CLOUD DAN LOCAL STORAGE ---
                resetSaveData: async function () {
                    if (!this.user) return;

                    // 1. Reset Cloud (Jika Mode Firebase/Online)
                    if (this.mode === 'firebase' && db) {
                        try {
                            // UPDATE: Kirim "Tiket Reset" dengan timestamp TERBARU.
                            // Ini memaksa semua device lain (yang punya data lama) untuk sadar bahwa data ini sudah di-wipe.
                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(this.user.email).set({
                                saveData: { isReset: true, lastActive: Date.now() }
                            }, { merge: true });
                        } catch (e) {
                            console.error("Gagal reset data cloud:", e);
                        }
                    }

                    // 2. Reset Local Storage (WAJIB DILAKUKAN AGAR CHECK SESSION SAAT RELOAD BERSIH)
                    const dbLocal = this.getDB();
                    if (dbLocal[this.user.email]) {
                        dbLocal[this.user.email].saveData = null;
                        this.saveDB(dbLocal);
                    }

                    // 3. Reset Memory
                    if (this.user) this.user.saveData = null;
                },

                /* FIX: PERBAIKAN FUNGSI RESET DATA SISWA (ADMIN) AGAR LEBIH ROBUST */
                adminResetStudent: async function (studentEmail) {
                    // 1. Coba paksa koneksi Cloud dulu agar yakin tidak offline
                    await this.init(true);

                    if (this.mode === 'firebase' && db) {
                        try {
                            // UPDATE: Jangan delete field, tapi timpa dengan OBJECT RESET + TIMESTAMP BARU.
                            // Tujuannya agar 'lastActive' di cloud menjadi LEBIH BARU dari data lokal siswa.
                            // Saat siswa login, sistem sync akan melihat Cloud lebih baru -> mengambil object reset -> menghapus data lokal.
                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail).update({
                                saveData: { isReset: true, lastActive: Date.now() }
                            });
                            return { success: true, type: 'cloud' };
                        } catch (e) {
                            console.error("Gagal reset data cloud:", e);

                            // --- DETEKSI ERROR PERMISSION (RULES EXPIRED) ---
                            if (e.code === 'permission-denied') {
                                return {
                                    success: false,
                                    msg: "⛔ AKSES DITOLAK FIREBASE!\n\nKemungkinan 'Test Mode' database Anda sudah kadaluwarsa (Expired 30 Hari).\n\nSOLUSI: Buka Firebase Console -> Firestore Database -> Tab 'Rules', lalu ubah menjadi:\n\nallow read, write: if true;"
                                };
                            }

                            // Fallback: Jika dokumen tidak ada atau update gagal, coba set merge null
                            try {
                                await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail).set({ saveData: { isReset: true, lastActive: Date.now() } }, { merge: true });
                                return { success: true, type: 'cloud_fallback' };
                            } catch (e2) {
                                return { success: false, msg: "Koneksi Cloud Gagal: " + e.message };
                            }
                        }
                    }
                    else {
                        // Fallback ke Local jika mode offline
                        const dbLocal = this.getDB();
                        if (dbLocal[studentEmail]) {
                            dbLocal[studentEmail].saveData = null;
                            this.saveDB(dbLocal);
                            return { success: true, type: 'local' };
                        }
                        return { success: false, msg: "User tidak ditemukan di Local Storage & Cloud tidak terhubung." };
                    }
                },

                /* NEW: FUNGSI HAPUS AKUN SISWA (ADMIN - PERMANEN) */
                adminDeleteStudent: async function (studentEmail) {
                    await this.init(true);

                    // FIX: Selalu hapus dari localStorage dulu (mencegah login ulang via cache lokal)
                    const dbLocal = this.getDB();
                    if (dbLocal[studentEmail]) {
                        delete dbLocal[studentEmail];
                        this.saveDB(dbLocal);
                    }
                    // Juga bersihkan session jika yang dihapus adalah user yang sedang login
                    try {
                        const sess = localStorage.getItem('sc_session_email');
                        if (sess === studentEmail) localStorage.removeItem('sc_session_email');
                    } catch(e) {}

                    if (this.mode === 'firebase' && db) {
                        try {
                            // Hapus dokumen user dari Firestore juga
                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail).delete();
                            return { success: true, type: 'cloud+local' };
                        } catch (e) {
                            console.error("Gagal hapus akun cloud:", e);
                            // localStorage sudah terhapus — kembalikan sukses parsial
                            return { success: true, type: 'local_only', msg: 'Lokal terhapus. Cloud gagal: ' + e.message };
                        }
                    } else {
                        if (dbLocal[studentEmail] !== undefined || true) {
                            return { success: true, type: 'local' };
                        }
                        return { success: false, msg: 'User tidak ditemukan.' };
                    }
                },

                getAllStudents: async function () {
                    // UPDATE: Logika pengambilan data berdasarkan Role User yang Login
                    // Jika Admin: Ambil SEMUA user (Guru & Siswa, kecuali akun admin)
                    // Jika Guru: Ambil HANYA Siswa
                    // FIX: Pakai DataService.user langsung agar tidak kehilangan context 'this'
                    const currentUser = DataService.user;
                    const isAdmin = currentUser && currentUser.role === 'admin';

                    if (this.mode === 'local') {
                        const dbLocal = this.getDB();
                        if (isAdmin) {
                            // Admin: semua kecuali akun admin sendiri
                            return Object.values(dbLocal).filter(u => u.role === 'siswa' || u.role === 'guru');
                        } else {
                            return Object.values(dbLocal).filter(u => u.role === 'siswa');
                        }
                    } else {
                        try {
                            let query = db.collection('artifacts').doc('nusantara-arsa').collection('users');

                            // Admin ambil semua (tanpa filter) — guru hanya siswa
                            if (!isAdmin) {
                                query = query.where('role', '==', 'siswa');
                            }

                            const snapshot = await query.get();
                            let users = snapshot.docs.map(doc => ({ email: doc.id, ...doc.data() }));
                            // Sembunyikan akun admin dari daftar
                            if (isAdmin) users = users.filter(u => u.role !== 'admin');
                            return users;
                        } catch (e) {
                            console.error("Gagal mengambil data users:", e);
                            const dbLocal = this.getDB();
                            if (isAdmin) return Object.values(dbLocal).filter(u => u.role === 'siswa' || u.role === 'guru');
                            return Object.values(dbLocal).filter(u => u.role === 'siswa');
                        }
                    }
                },

                // --- FIX: SEND MESSAGE (HYBRID SUPPORT) ---
                sendMessage: async function (studentEmail, msg) {
                    const msgObj = {
                        text: msg, read: false, time: Date.now()
                    };

                    if (this.mode === 'local' || !navigator.onLine) {
                        const dbLocal = this.getDB();
                        if (dbLocal[studentEmail]) {
                            if (!dbLocal[studentEmail].inbox) dbLocal[studentEmail].inbox = [];
                            dbLocal[studentEmail].inbox.push(msgObj);
                            this.saveDB(dbLocal);
                            return true;
                        }
                        return false;
                    } else {
                        try {
                            // Gunakan arrayUnion untuk atomicity di Firebase
                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail).update({
                                inbox: firebase.firestore.FieldValue.arrayUnion(msgObj)
                            });
                            return true;
                        } catch (e) {
                            console.warn("Gagal kirim pesan cloud, fallback ke local storage", e);
                            // FIX: Jangan langsung gagal — simpan ke lokal sebagai cadangan
                            const dbLocal = this.getDB();
                            if (dbLocal[studentEmail]) {
                                if (!dbLocal[studentEmail].inbox) dbLocal[studentEmail].inbox = [];
                                dbLocal[studentEmail].inbox.push(msgObj);
                                this.saveDB(dbLocal);
                                return true; // Berhasil via fallback lokal
                            }
                            return false;
                        }
                    }
                },

                // --- NEW: LISTENER PESAN UNTUK SISWA (UPDATED: SUPPORT LOCAL POLLING & REMOTE RESET) ---
                startMessageListener: function () {
                    if (!this.user || this.user.role !== 'siswa') return;

                    // Hentikan listener lama jika ada
                    if (this.unsubscribeMsg) {
                        if (typeof this.unsubscribeMsg === 'function') this.unsubscribeMsg();
                        else clearInterval(this.unsubscribeMsg);
                        this.unsubscribeMsg = null;
                    }

                    // FIX: Pastikan db instance tersedia jika firebase sudah init
                    if (navigator.onLine && typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && !db) {
                        try { db = firebase.firestore(); this.mode = 'firebase'; } catch(e) {}
                    }

                    console.log(`Memulai Listener Pesan & Sync (${this.mode})...`);

                    if ((this.mode === 'firebase' || navigator.onLine) && db) {
                        // --- MODE CLOUD: REALTIME SNAPSHOT ---
                        this.unsubscribeMsg = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(this.user.email).onSnapshot(async (doc) => {
                            const data = doc.data();

                            // --- DETEKSI REMOTE RESET (hanya jika ada flag isReset eksplisit) ---
                            // FIX BUG LOOP: Hanya trigger reset jika saveData.isReset === true (flag eksplisit dari guru)
                            // Bukan setiap kali saveData null/kosong, karena bisa terjadi saat data belum tersimpan
                            const _isRemoteReset = data && data.saveData && data.saveData.isReset === true;
                            if (_isRemoteReset && typeof STATE !== 'undefined' && STATE.screen !== 'splash' && STATE.screen !== 'title' && !STATE.isPrologue) {
                                console.warn("⚠️ REMOTE RESET DETECTED! GURU MENGHAPUS DATA.");

                                // 1. Hentikan Auto Save agar tidak menimpa penghapusan guru
                                if (window.saveIntervalId) clearInterval(window.saveIntervalId);

                                // 2. FIX BUG LOOP: Hapus flag isReset dari Firestore SEBELUM reload
                                //    agar saat login berikutnya tidak terpicu lagi
                                try {
                                    const _uRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(DataService.user.email);
                                    await _uRef.update({ 'saveData': firebase.firestore.FieldValue.delete() });
                                } catch(e) { console.warn('Gagal clear reset flag:', e); }

                                // 3. Hapus sesi lokal agar bersih total
                                localStorage.removeItem(SESSION_KEY);
                                DataService.user = null;

                                // 4. Tampilkan Pesan & Reload
                                alert("⚠️ PERINGATAN SISTEM ⚠️\n\nData permainan Anda telah di-reset oleh Guru/Admin.\nGame akan dimuat ulang ke awal.");
                                location.reload();
                                return;
                            }

                            this.processInbox(data);
                        });
                    } else {
                        // --- MODE LOCAL: POLLING INTERVAL ---
                        this.unsubscribeMsg = setInterval(() => {
                            const dbLocal = this.getDB();
                            const myData = dbLocal[this.user.email];

                            // Cek Reset Lokal — FIX BUG LOOP: hanya trigger jika isReset === true
                            if (myData && myData.saveData && myData.saveData.isReset === true && typeof STATE !== 'undefined' && STATE.screen === 'play' && !STATE.isPrologue) {
                                if (window.saveIntervalId) clearInterval(window.saveIntervalId);
                                // Hapus flag reset dari localStorage sebelum reload
                                try {
                                    const _db2 = this.getDB();
                                    if (_db2[this.user.email]) {
                                        _db2[this.user.email].saveData = null;
                                        this.saveDB(_db2);
                                    }
                                } catch(e) {}
                                alert("⚠️ Data lokal hilang/reset. Game akan dimuat ulang.");
                                location.reload();
                                return;
                            }

                            this.processInbox(myData);
                        }, 3000);
                    }
                },

                // --- NEW: LISTENER MULTIPLAYER (HANTU) ---
                startGhostListener: function () {
                    // --- DATA BOT HANTU (BAYANGAN) - POPULASI DESA ---
                    // Akan selalu muncul untuk meramaikan suasana
                    const BOT_GHOSTS = [
                        // --- HANTU LAMA ---
                        { email: 'bot_radian', name: 'Radian', gender: 'boy', outfit: 'default', x: 15 * 30, y: 20 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },
                        { email: 'bot_edy', name: 'Edy', gender: 'boy', outfit: 'armor', x: 35 * 30, y: 15 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },
                        { email: 'bot_rizka', name: 'Rizka', gender: 'girl', outfit: 'default', x: 25 * 30, y: 30 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },
                        { email: 'bot_manohara', name: 'Manohara', gender: 'girl', outfit: 'wedding', x: 45 * 30, y: 10 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },

                        // --- HANTU BARU (BOYS) ---
                        { email: 'bot_authar', name: 'Authar', gender: 'boy', outfit: 'special', x: 12 * 30, y: 12 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Papan Misi
                        { email: 'bot_fani', name: 'Fani', gender: 'boy', outfit: 'default', x: 42 * 30, y: 25 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },   // Dekat Guild
                        { email: 'bot_budi_s', name: 'Budi', gender: 'boy', outfit: 'default', x: 38 * 30, y: 18 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Perpus
                        { email: 'bot_andy', name: 'Andy', gender: 'boy', outfit: 'armor', x: 48 * 30, y: 20 * 30, location: 'village', isBot: true, vx: 0, vy: 0 },     // Dekat Dungeon

                        // --- HANTU BARU (GIRLS) ---
                        { email: 'bot_citra', name: 'Citra', gender: 'girl', outfit: 'special', x: 26 * 30, y: 24 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Merchant
                        { email: 'bot_milea', name: 'Milea', gender: 'girl', outfit: 'default', x: 20 * 30, y: 28 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Patung
                        { email: 'bot_ancika', name: 'Ancika', gender: 'girl', outfit: 'default', x: 43 * 30, y: 35 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }, // Dekat Dermaga
                        { email: 'bot_luna', name: 'Luna', gender: 'girl', outfit: 'wedding', x: 20 * 30, y: 15 * 30, location: 'village', isBot: true, vx: 0, vy: 0 }    // Dekat Klinik
                    ];

                    console.log("📡 Mengaktifkan Radar Multiplayer & Bot Crowd...");

                    // Fungsi Helper untuk Update State
                    const updateGhostsState = (realPlayers = []) => {
                        if (typeof STATE !== 'undefined') {
                            // Gabungkan Pemain Asli + Semua Bot
                            STATE.ghosts = [...realPlayers, ...BOT_GHOSTS];
                            // console.log(`Ghosts Updated: ${realPlayers.length} Real + ${BOT_GHOSTS.length} Bots`);
                        }
                    };

                    if (this.mode !== 'firebase' || !db) {
                        // JIKA OFFLINE: Tetap tampilkan Bot agar tidak sepi
                        updateGhostsState([]);
                        return;
                    }

                    // JIKA ONLINE: Dengarkan DB
                    try {
                        this.unsubscribeGhosts = db.collection('artifacts').doc('nusantara-arsa').collection('users')
                            .where('role', '==', 'siswa')
                            .onSnapshot((snapshot) => {
                                const now = Date.now();
                                const onlineGhosts = [];

                                snapshot.forEach(doc => {
                                    // Jangan masukkan diri sendiri
                                    if (this.user && doc.id === this.user.email) return;

                                    const data = doc.data();
                                    if (!data.saveData) return;

                                    const lastActive = data.lastActive || (data.saveData ? data.saveData.lastActive : 0);

                                    // Cek Online: Aktif dalam 2 menit terakhir (Dilonggarkan biar awet)
                                    if (now - lastActive < 120000) {
                                        onlineGhosts.push({
                                            email: doc.id,
                                            name: data.name || "Siswa",
                                            x: data.saveData.x || 0,
                                            y: data.saveData.y || 0,
                                            location: data.saveData.location || 'village',
                                            gender: data.saveData.gender || 'boy',
                                            outfit: data.saveData.outfit || 'default',
                                            role: data.saveData.role || 'none',
                                            isBot: false
                                        });
                                    }
                                });

                                updateGhostsState(onlineGhosts);
                            });
                    } catch (e) {
                        console.warn("Gagal init multiplayer, fallback ke bot only:", e);
                        updateGhostsState([]);
                    }
                },



                // Helper untuk memproses pesan masuk (Digunakan oleh Cloud & Local)
                processInbox: function (data) {
                    // Cek apakah ada pesan baru di 'inbox'
                    if (data && data.inbox && data.inbox.length > 0) {
                        const newMsgs = data.inbox;
                        console.log("Pesan diterima:", newMsgs);

                        // Masukkan ke State Game
                        if (typeof STATE !== 'undefined' && STATE.player) {
                            if (!STATE.player.messages) STATE.player.messages = [];

                            // FIX DUPLIKAT: Hanya tambah pesan yang belum ada (cek berdasarkan waktu kirim)
                            const existingTimes = new Set(STATE.player.messages.map(m => m.time));
                            const uniqueNewMsgs = newMsgs.filter(m => !existingTimes.has(m.time));
                            if (uniqueNewMsgs.length === 0) return; // Semua sudah ada, skip
                            STATE.player.messages.push(...uniqueNewMsgs);

                            // Notifikasi UI
                            showToast(`📩 ${newMsgs.length} PESAN BARU DARI GURU!`);
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                            // Update Badge Kotak Surat jika terlihat
                            // (Logic drawObject akan menangani visualnya di frame berikutnya)

                            // BERSIHKAN INBOX DI SUMBER DATA (Agar tidak didownload ulang)
                            if (this.mode === 'firebase' && db) {
                                db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(this.user.email).update({
                                    inbox: firebase.firestore.FieldValue.delete()
                                }).catch(err => console.log("Gagal clear cloud inbox", err));
                            } else {
                                // Bersihkan Local Storage Inbox
                                const dbLocal = this.getDB();
                                if (dbLocal[this.user.email]) {
                                    dbLocal[this.user.email].inbox = [];
                                    this.saveDB(dbLocal);
                                }
                            }

                            // Trigger Auto Save Game untuk menyimpan pesan permanen di saveData pemain
                            if (typeof manualSave === 'function') manualSave();
                        }
                    }
                },

                getTeachers: async function () {
                    // Helper dedup: hilangkan duplikat berdasarkan email
                    const _dedup = (list) => {
                        const seen = new Set();
                        return list.filter(g => {
                            const k = (g.email || '').toLowerCase().trim();
                            if (!k || seen.has(k)) return false;
                            seen.add(k); return true;
                        });
                    };

                    if (this.mode === 'local' || !navigator.onLine) {
                        const dbLocal = this.getDB();
                        const list = Object.entries(dbLocal)
                            .filter(([, u]) => u.role === 'guru')
                            .map(([guruEmail, u]) => ({
                                email: guruEmail,
                                name: u.name,
                                school: u.school || 'Unknown School'
                            }));
                        return _dedup(list);
                    } else {
                        try {
                            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
                            const snapshot = await Promise.race([
                                db.collection('artifacts').doc('nusantara-arsa').collection('users').where('role', '==', 'guru').get(),
                                timeout
                            ]);
                            const list = snapshot.docs.map(doc => {
                                const d = doc.data();
                                return { email: doc.id, name: d.name, school: d.school || 'Unknown School' };
                            });
                            return _dedup(list);
                        } catch (e) {
                            console.warn("Gagal fetch guru cloud, fallback local");
                            const dbLocal = this.getDB();
                            const list = Object.entries(dbLocal)
                                .filter(([, u]) => u.role === 'guru')
                                .map(([guruEmail, u]) => ({
                                    email: guruEmail,
                                    name: u.name,
                                    school: u.school || 'Unknown'
                                }));
                            return _dedup(list);
                        }
                    }
                },

                register: async function (role, data) {
                    const userData = {
                        role: role,
                        password: data.password,
                        name: data.name,
                        details: data.details,
                        school: data.school || null,
                        mentor: data.mentor || null,
                        saveData: null
                    };

                    if (this.mode === 'local' || !navigator.onLine) {
                        const dbLocal = this.getDB();
                        if (dbLocal[data.email]) return { success: false, msg: "Email already registered (Local)!" };
                        dbLocal[data.email] = userData;
                        this.saveDB(dbLocal);
                        return { success: true, msg: "Registrasi Lokal Berhasil!" };
                    } else {
                        try {
                            const docRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(data.email);

                            // TIMEOUT DIPERCEPAT: 3 Detik
                            const timeout = new Promise((_, reject) =>
                                setTimeout(() => reject(new Error("Koneksi Timeout (Terlalu Lama)")), 3000)
                            );

                            const doc = await Promise.race([docRef.get(), timeout]);

                            if (doc.exists) return { success: false, msg: "Email already registered in Cloud!" };
                            await docRef.set(userData);
                            return { success: true, msg: "Cloud Registration Success!" };
                        } catch (e) {
                            console.warn("Cloud Register Failed, Fallback Local", e);
                            const dbLocal = this.getDB();
                            if (dbLocal[data.email]) return { success: false, msg: "Email already registered (Local)!" };
                            dbLocal[data.email] = userData;
                            this.saveDB(dbLocal);
                            this.mode = 'local';
                            return { success: true, msg: "Server Sibuk. Akun dibuat secara LOKAL (Offline)." };
                        }
                    }
                },

                login: async function (email, password) {
                    // 1. Cek Koneksi Fisik Browser
                    if (!navigator.onLine) this.mode = 'local';

                    // Ambil data lokal untuk perbandingan nanti
                    const dbLocal = this.getDB();
                    const localUser = dbLocal[email];

                    // FIX: Pastikan DB ada jika mode firebase. Jika tidak, paksa local.
                    if (this.mode === 'firebase' && !db) {
                        console.warn("Mode Firebase aktif tapi DB tidak terhubung. Fallback ke Local.");
                        this.mode = 'local';
                    }

                    if (this.mode === 'local') {
                        const user = localUser;
                        if (!user) return { success: false, msg: "User tidak ditemukan di data lokal (Offline)!" };
                        if (user.password !== password) return { success: false, msg: "Password salah!" };
                        this.user = { email: email, ...user };
                        return { success: true, user: this.user };
                    } else {
                        try {
                            // PERBAIKAN: Timeout dikurangi drastis jadi 2.5 Detik agar 'fail-fast'
                            const docRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(email);

                            const timeout = new Promise((_, reject) =>
                                setTimeout(() => reject(new Error("Server Timeout")), 2500)
                            );

                            // Balapan antara ambil data vs timeout
                            const doc = await Promise.race([docRef.get(), timeout]);

                            if (!doc.exists) return { success: false, msg: "Akun tidak ditemukan di Server!" };

                            let cloudUser = doc.data();
                            if (cloudUser.password !== password) return { success: false, msg: "Password salah!" };

                            // --- NEW: SMART SYNC (CLOUD vs LOCAL CONFLICT RESOLUTION) ---
                            // Cek data mana yang lebih baru berdasarkan 'lastActive' timestamp
                            let finalUser = cloudUser;
                            let useLocal = false;

                            if (localUser && localUser.saveData) {
                                const localTime = localUser.saveData.lastActive || 0;
                                const cloudTime = (cloudUser.saveData && cloudUser.saveData.lastActive) || 0;

                                // FIX: CEK APAKAH CLOUD ADALAH DATA RESET?
                                // Jika Cloud punya flag 'isReset', maka Cloud SELALU MENANG (karena itu perintah wipe).
                                const isCloudReset = cloudUser.saveData && cloudUser.saveData.isReset;

                                if (!isCloudReset && localTime > cloudTime) {
                                    console.log("⚠️ Konflik Data: Menggunakan Data LOKAL (Lebih Baru)");
                                    finalUser = localUser;
                                    useLocal = true;

                                    // Auto-Sync balik ke Cloud secara background
                                    docRef.set({
                                        ...localUser,
                                        lastActive: Date.now()
                                    }, { merge: true }).catch(e => console.warn("Background sync failed:", e));

                                } else {
                                    console.log("✅ Data Cloud Sinkron/Lebih Baru/Reset. Update Lokal.");

                                    // FIX: JIKA DATA CLOUD ADALAH 'RESET TICKET', BERSIHKAN LOCAL & CLOUD
                                    if (isCloudReset) {
                                        console.log("🧹 MENDETEKSI PERINTAH RESET DARI CLOUD!");
                                        cloudUser.saveData = null; // Hapus flag reset dari memori user aktif
                                        // FIX BUG LOOP: Hapus isReset dari Firestore agar tidak terpicu terus
                                        try {
                                            await docRef.update({ 'saveData': firebase.firestore.FieldValue.delete() });
                                            console.log("✅ Flag isReset berhasil dihapus dari Cloud.");
                                        } catch(e) {
                                            console.warn("Gagal hapus flag reset dari cloud:", e);
                                        }
                                    }

                                    // Update Local Storage agar sinkron dengan Cloud terbaru
                                    dbLocal[email] = cloudUser;
                                    this.saveDB(dbLocal);
                                    finalUser = cloudUser; // Pastikan pakai cloud (yang sudah null/bersih)
                                }
                            } else {
                                // Tidak ada data lokal, simpan data cloud ke lokal
                                // Cek juga reset flag disini
                                if (cloudUser.saveData && cloudUser.saveData.isReset) {
                                    cloudUser.saveData = null;
                                }

                                console.log("📥 Mengunduh Save Data dari Cloud...");
                                dbLocal[email] = cloudUser;
                                this.saveDB(dbLocal);
                                finalUser = cloudUser;
                            }

                            this.user = { email: email, ...finalUser };
                            return { success: true, user: this.user };

                        } catch (e) {
                            console.warn("Login Error / Offline, trying local fallback...", e);

                            // FITUR ANTI-STUCK: Cek Local Storage jika Server Error/Offline
                            if (localUser && localUser.password === password) {
                                this.mode = 'local'; // Paksa pindah ke Local Mode
                                this.user = { email: email, ...localUser };
                                return { success: true, user: this.user, msg: "⚠️ Masuk dalam Mode Offline (Server tidak terjangkau)" };
                            }

                            // Jika di local juga tidak ada, berarti memang belum register
                            return { success: false, msg: "Gagal Login: Koneksi bermasalah atau Akun belum terdaftar." };
                        }
                    }
                },

                saveGame: async function (gameState) {
                    if (!this.user) return;

                    // Pastikan timestamp selalu terupdate saat save
                    gameState.lastActive = Date.now();

                    const dbLocal = this.getDB();
                    if (!dbLocal[this.user.email]) {
                        dbLocal[this.user.email] = { ...this.user, saveData: gameState };
                    } else {
                        const existing = dbLocal[this.user.email].saveData || {};
                        dbLocal[this.user.email].saveData = { ...existing, ...gameState, lastActive: Date.now() };
                    }
                    this.saveDB(dbLocal);

                    if (navigator.onLine) {
                        try {
                            const syncData = {
                                saveData: gameState,
                                role: this.user.role,
                                name: this.user.name,
                                details: this.user.details,
                                email: this.user.email,
                                password: this.user.password,
                                lastActive: Date.now()
                            };

                            if (this.user.mentor) syncData.mentor = this.user.mentor;
                            if (this.user.school) syncData.school = this.user.school;

                            await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(this.user.email).set(syncData, { merge: true });

                            if (this.mode === 'local') {
                                console.log("Koneksi Kembali: Auto-Sync ke Cloud Berhasil!");
                                this.mode = 'firebase';
                                // Restart listener jika koneksi kembali
                                if (this.user.role === 'siswa') this.startMessageListener();
                            }
                        } catch (e) {
                            this.mode = 'local';
                        }
                    } else {
                        this.mode = 'local';
                    }
                },

                loadGame: function () {
                    if (!this.user || !this.user.saveData) return null;
                    return this.user.saveData;
                },

                // --- NEW: REAL-TIME MONITORING LISTENER ---
                subscribeToStudents: function (onUpdate) {
                    let useCloud = false;

                    // FIX: Jika db belum siap tapi firebase sudah init, coba ambil instance lagi
                    if (navigator.onLine && typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && !db) {
                        try { db = firebase.firestore(); } catch(e) { console.warn("Gagal ambil db instance:", e); }
                    }

                    // NEW: Logic Source Selection
                    if (this.dashboardSource === 'cloud') {
                        useCloud = true;
                    } else if (this.dashboardSource === 'local') {
                        useCloud = false;
                    } else {
                        // AUTO: Gunakan Cloud jika tersedia
                        useCloud = (navigator.onLine && typeof firebase !== 'undefined' && !!db);
                    }

                    // Update UI Status Koneksi di Dashboard
                    const statusEl = document.getElementById('dash-connection-status');
                    if (statusEl) {
                        if (useCloud) {
                            statusEl.innerHTML = '🟢 CLOUD ONLINE<br><span style="font-weight:normal; opacity:0.8;">Data Server</span>';
                            statusEl.style.color = '#4ade80'; // Hijau
                            statusEl.style.border = '1px solid #22c55e';
                        } else {
                            statusEl.innerHTML = '🟠 LOCAL VIEW<br><span style="font-weight:normal; opacity:0.8;">Data Lokal</span>';
                            statusEl.style.color = '#fbbf24'; // Kuning/Orange
                            statusEl.style.border = '1px solid #f59e0b';
                        }
                    }

                    // FIX BUG GURU: Simpan referensi DataService.user ke variabel lokal
                    // agar tidak kehilangan context 'this' saat dipanggil sebagai callback
                    const currentUser = DataService.user;
                    const isAdmin = currentUser && currentUser.role === 'admin';

                    // DEBUG: log untuk verifikasi isAdmin
                    console.log('[subscribeToStudents] user:', currentUser && currentUser.email, 'isAdmin:', isAdmin);

                    if (!useCloud) {
                        // Fallback untuk mode offline/lokal: Gunakan Polling Interval
                        const interval = setInterval(() => {
                            const dbLocal = this.getDB();
                            let users = Object.values(dbLocal);

                            // Filter jika bukan admin — admin dapat semua termasuk guru
                            if (!isAdmin) {
                                users = users.filter(u => u.role === 'siswa');
                            } else {
                                // Admin: tampilkan guru & siswa, kecuali admin itu sendiri
                                users = users.filter(u => u.role === 'siswa' || u.role === 'guru');
                            }

                            // Tambahkan flag source untuk UI
                            users.forEach(s => s._source = 'local');
                            onUpdate(users);
                        }, 2000); // Update tiap 2 detik
                        return () => clearInterval(interval); // Return fungsi unsubscribe
                    } else {
                        // Firebase Real-time Listener (onSnapshot)
                        try {
                            let query = db.collection('artifacts').doc('nusantara-arsa').collection('users');

                            // FIX: Admin ambil SEMUA user (siswa + guru), guru hanya siswa
                            // Admin: tidak filter sama sekali
                            // Guru: filter hanya role siswa
                            if (!isAdmin) {
                                query = query.where('role', '==', 'siswa');
                            }
                            // Jika isAdmin: tidak ada .where() — ambil semua dokumen

                            return query.onSnapshot((snapshot) => {
                                let users = snapshot.docs.map(doc => ({ email: doc.id, ...doc.data(), _source: 'cloud' }));
                                // Filter out akun admin itu sendiri dari daftar agar tidak muncul
                                if (isAdmin) {
                                    users = users.filter(u => u.role !== 'admin');
                                }
                                onUpdate(users);
                            }, (error) => {
                                console.error("Monitoring Error:", error);
                                // Jika error permission/koneksi, fallback ke lokal
                                if (statusEl) {
                                    statusEl.innerHTML = '⚠️ KONEKSI TERPUTUS';
                                    statusEl.style.color = '#ef4444';
                                }
                            });
                        } catch (e) {
                            console.warn("Snapshot failed, fallback to local polling", e);
                            return () => { };
                        }
                    }
                }
            };

            /** UI LOGIC FOR LOGIN */
            // --- FIX: MENAMBAHKAN VARIABEL DAN FUNGSI SWITCH ROLE YANG HILANG ---
            let authMode = 'login';
            let currentRole = 'siswa';
            let teacherMonitorUnsub = null; // Variabel global untuk menyimpan unsubscribe listener monitoring
            let latestStudentData = []; // NEW: Cache Data Siswa Live untuk Dashboard

            // ============================================
