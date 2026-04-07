# 🗺️ PETA FITUR — Nusantara Arsa: Rise of Student
> Panduan cepat: **fitur apa → edit file mana → mulai dari baris berapa**

---

## 📁 Struktur File (Ringkasan)

| File | Isi Utama |
|------|-----------|
| `index.html` | Semua elemen HTML (div, button, modal, layar) |
| `style.css` | Semua tampilan / desain (warna, ukuran, animasi) |
| `js/01-firebase-init.js` | Firebase, login/logout, session, asset loader, quest popup, debug mode |
| `js/02-login-dashboard.js` | Dashboard guru & admin, monitoring siswa, ranking, grading |
| `js/03-jurnal-portofolio.js` | Jurnal siswa, portofolio, BK dashboard, reset/hapus akun, canvas+ctx |
| `js/04-game-engine.js` | Engine utama: tile map, STATE, render, player, NPC, pet, HUD, combat |
| `js/05-konflik-sistem.js` | Konflik akademik, konflik pernikahan, dialog NPC, gombal, toko item |
| `js/06-quest-karir.js` | Quest, part-time, lamaran kerja, farming, fishing, cutscene, draw() |
| `js/07-fairy-village.js` | Kahyangan Wilis, pasar grosir, bisnis peri, tutorial peri |

---

## 💍 FITUR MENIKAH / PERNIKAHAN

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Sistem konflik rumah tangga bulanan | `05-konflik-sistem.js` | 618 |
| Fungsi `getMarriageMonth()` | `05-konflik-sistem.js` | 632 |
| Fungsi `runMarriageConflictSystem()` | `05-konflik-sistem.js` | 638 |
| Event konflik per bulan (cekcok, tagihan, dll) | `05-konflik-sistem.js` | 740 |
| Dialog & proses cerai `handleDivorceSequence()` | `05-konflik-sistem.js` | 2811 |
| Finalisasi cerai `finalizeDivorce()` | `05-konflik-sistem.js` | 2840 |
| Arc NPC rival setelah menikah | `05-konflik-sistem.js` | 6796 |
| Cek konflik pernikahan tiap hari (game loop) | `04-game-engine.js` | 7029 |
| Minigame lamaran kerja (beda dari nikah!) | `06-quest-karir.js` | 2090 |
| Cutscene pernikahan `playCutsceneWedding()` | `06-quest-karir.js` | 3086 |
| Cutscene cerai `playCutsceneDivorce()` | `06-quest-karir.js` | 3143 |
| **Data save**: `married`, `spouseId`, `marriedDay`, `marriageConflictLevel` | `04-game-engine.js` | ~3100 |
| Tampilan HTML modal pernikahan / cerai | `index.html` | cari `id="wedding"` atau `id="divorce"` |

---

## 🎓 FITUR PELAJAR / AKADEMIK / KAMPUS

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Konflik akademik harian (tugas, dosen, dll) | `05-konflik-sistem.js` | 236 |
| Data konflik akademik (teks event) | `05-konflik-sistem.js` | ~1 |
| Sistem jurnal harian (pertanyaan refleksi) | `06-quest-karir.js` | 81 |
| Quest media pembelajaran & portofolio | `06-quest-karir.js` | 186 |
| Pertanyaan ujian `nextExamQuestion()` | `04-game-engine.js` | 4365 |
| Pertanyaan sidang `nextDefenseQuestion()` | `04-game-engine.js` | 6001 |
| Aksi karir per role & hari (student, guru, dll) | `05-konflik-sistem.js` | 3715 |
| Quest harian popup `showDailyQuestPopup()` | `01-firebase-init.js` | 746 |
| Isi konten quest `getQuestContent()` | `01-firebase-init.js` | 1297 |
| Hitung bonus quest selesai | `01-firebase-init.js` | 835 |
| Data skripsi / ijazah / tesis di inventory | `04-game-engine.js` | ~3100 (loadGame) |

---

## ⚔️ FITUR COMBAT / BATTLE / DUNGEON

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Battle monster utama (dungeon) | `04-game-engine.js` | lihat `update()` |
| Battle pet legendaris | `04-game-engine.js` | 2471 |
| Inisialisasi battle pet `initPetBattle()` | `04-game-engine.js` | 2491 |
| Serangan pet `petBattleAttack()` | `04-game-engine.js` | 2509 |
| Akhir battle pet `petBattleEnd()` | `04-game-engine.js` | 2542 |
| Battle monster pencuri skripsi (ruins) | `06-quest-karir.js` | 3536 |
| Cutscene masuk dungeon | `06-quest-karir.js` | 3310 |
| Konflik kerja / part-time yang mempengaruhi combat | `04-game-engine.js` | 5375 |

---

## 🌾 FITUR FARMING / PERTANIAN

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Interaksi lahan sawah `handleFarmingInteraction()` | `06-quest-karir.js` | 7831 |
| Panen hasil `harvestCrop()` | `06-quest-karir.js` | 7965 |
| Aset gambar lahan (lahan-liar, kurcacitani, dll) | `01-firebase-init.js` | ~279 |
| Tile sawah di peta desa | `04-game-engine.js` | cari `farm` di maps |

---

## 🎣 FITUR MEMANCING / FISHING

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Minigame mancing `startFishingMinigame()` | `06-quest-karir.js` | 616 |
| Logika cek hasil pancing `checkFishing()` | `06-quest-karir.js` | 658 |
| Overlay UI mancing di fairy village | `07-fairy-village.js` | 583 |
| Tombol mancing `handleFishingBtnClick()` | `07-fairy-village.js` | 621 |

---

## 💼 FITUR PART-TIME / KERJA

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Menu daftar part-time `openPartTimeMenu()` | `06-quest-karir.js` | 1460 |
| Daftar part-time `applyPartTime()` | `06-quest-karir.js` | 1499 |
| Keluar part-time `resignPartTime()` | `06-quest-karir.js` | 1520 |
| Tampilan menu shift `showPartTimeWorkMenu()` | `06-quest-karir.js` | 1537 |
| Cek pekerjaan yang diketahui `knowsJob()` | `06-quest-karir.js` | 1678 |
| Temukan lowongan `discoverJob()` | `06-quest-karir.js` | 1683 |
| Panel lowongan yang diketahui | `06-quest-karir.js` | 1726 |
| Cari kerja dari papan `searchJobFromBoard()` | `06-quest-karir.js` | 1785 |
| Konflik di tempat kerja `triggerWorkConflict()` | `04-game-engine.js` | 5388 |
| Cek reputasi bos `checkBossReputationThreshold()` | `04-game-engine.js` | 5497 |
| Aksi karir harian per role | `05-konflik-sistem.js` | 3715 |

---

## 🧚 FITUR KAHYANGAN WILIS / FAIRY VILLAGE

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Data state peri `getFairyVillage()` | `07-fairy-village.js` | 2099 |
| Popup kelahiran peri `showFairyBirthPopup()` | `07-fairy-village.js` | 2143 |
| Konfirmasi lahir `confirmFairyBirth()` | `07-fairy-village.js` | 2232 |
| Tutorial kahyangan `startFairyVillageTutorial()` | `07-fairy-village.js` | 2333 |
| Harga pasar grosir `generateMarketPrices()` | `07-fairy-village.js` | 15 |
| Buka pasar `openPasar()` | `07-fairy-village.js` | 30 |
| Render UI pasar `renderPasarUI()` | `07-fairy-village.js` | 54 |
| Beli item pasar `buyTradeItem()` | `07-fairy-village.js` | 94 |
| Jual item `sellTradeItem()` | `07-fairy-village.js` | 107 |
| Beli bisnis peri `buyBusiness()` | `07-fairy-village.js` | 449 |
| Inisialisasi map kahyangan | `04-game-engine.js` | 2798 |
| Render dunia kahyangan `drawFairyWorld()` | `06-quest-karir.js` | 4978 |

---

## 🏪 FITUR TOKO / PASAR / JUAL BELI

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Toko hewan peliharaan `openPetShop()` | `04-game-engine.js` | 2317 |
| Menu beli pet `showPetBuyMenu()` | `04-game-engine.js` | 2344 |
| Beli item toko biasa `buyItem()` | `05-konflik-sistem.js` | 7054 |
| Transaksi pasar grosir `executeTrade()` | `05-konflik-sistem.js` | 7654 |
| Toko dokumen / sertifikat `openDocumentShop()` | `06-quest-karir.js` | 2668 |
| Beli furnitur rumah `buyFurniture()` | `06-quest-karir.js` | 3443 |

---

## 💬 FITUR NPC / DIALOG / RELASI

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Cek NPC aktif/ada `isNPCActive()` | `05-konflik-sistem.js` | 2149 |
| Mini-game gombal `startGombalGame()` | `05-konflik-sistem.js` | 2722 |
| Proses pilihan gombal | `05-konflik-sistem.js` | 2749 |
| Obrolan random NPC `getRandomChat()` | `05-konflik-sistem.js` | 2797 |
| Ulang tahun NPC `isNpcBirthdayToday()` | `04-game-engine.js` | 1597 |
| Beri hadiah ulang tahun | `04-game-engine.js` | 1606 |
| Duel suit `startDuel()` | `03-jurnal-portofolio.js` | 1540 |
| Data NPC (nama, posisi, dialog, imgSrc) | `04-game-engine.js` | cari `npcs:` di maps |

---

## 🔊 FITUR AUDIO / MUSIK

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Pilihan audio saat mulai `handleAudioChoice()` | `01-firebase-init.js` | 2282 |
| Toggle musik dari profil | `04-game-engine.js` | 6369 |
| Update tombol musik `updateMusicBtn()` | `04-game-engine.js` | 6389 |
| SFX klik & efek suara | `06-quest-karir.js` | 9506 |
| Data AudioService (bgm tracks, volume) | `01-firebase-init.js` | cari `AudioService` |

---

## 🖥️ FITUR HUD / UI / INVENTORY

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Update HUD (HP, energy, uang, level) | `04-game-engine.js` | cari `function updateHUD` |
| Ikon tas inventory `updateBagIcon()` | `04-game-engine.js` | cari `updateBagIcon` |
| HUD pet aktif `updatePetHUD()` | `04-game-engine.js` | cari `updatePetHUD` |
| Toggle sembunyikan HUD `toggleHUD()` | `04-game-engine.js` | cari `toggleHUD` |
| Resize canvas `resize()` | `04-game-engine.js` | 4 |
| Render seluruh game `draw()` | `06-quest-karir.js` | 4081 |
| Update logika game `update()` | `04-game-engine.js` | ~6722 |
| Element HTML HUD (div hp, energy, dll) | `index.html` | cari `id="hud"` atau `id="ui-layer"` |

---

## 💾 FITUR SAVE / LOAD / DATA

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Load semua data save saat masuk game | `04-game-engine.js` | 3068 |
| Fungsi `saveGame()` ke Firebase & localStorage | `01-firebase-init.js` | 3255 |
| Fungsi `loadGame()` dari cache | `01-firebase-init.js` | 3301 |
| Login & sinkron data `DataService.login()` | `01-firebase-init.js` | 3141 |
| Reset data siswa (admin) | `03-jurnal-portofolio.js` | 664 |
| Hapus akun siswa (admin) | `03-jurnal-portofolio.js` | 687 |
| Export data ke CSV | `03-jurnal-portofolio.js` | 1511 |

---

## 🛠️ FITUR DEBUG / ADMIN

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Toggle debug mode ON/OFF `setDebugMode()` | `01-firebase-init.js` | ~60 |
| Render halaman debug admin `renderDebugPage()` | `01-firebase-init.js` | ~60 |
| Snapshot live STATE game | `01-firebase-init.js` | ~139 |
| Nav debug di sidebar admin (HTML) | `index.html` | cari `nav-debug` |
| Halaman debug (HTML) | `index.html` | cari `page-debug` |
| Tombol test peri di HUD (HTML) | `index.html` | cari `fairy-test-btn` |
| Tombol test skripsi di HUD (HTML) | `index.html` | cari `skripsi-test-btn` |

---

## 📊 FITUR DASHBOARD GURU & ADMIN

| Yang Ingin Diubah | File | Baris |
|---|---|---|
| Halaman welcome admin `renderAdminWelcomePage()` | `02-login-dashboard.js` | 836 |
| Monitoring siswa live | `02-login-dashboard.js` | 1973 |
| Tabel monitoring `renderMonitoringTable()` | `02-login-dashboard.js` | 1837 |
| Inspeksi data siswa | `02-login-dashboard.js` | 1962 |
| Grading / penilaian `renderGrading()` | `02-login-dashboard.js` | 2005 |
| Ranking kelas `renderRanking()` | `02-login-dashboard.js` | 1759 |
| Daftar akun `renderAccountsList()` | `02-login-dashboard.js` | 1648 |
| Statistik platform `renderStatsDashboard()` | `02-login-dashboard.js` | 1319 |
| Jurnal siswa (guru baca) `renderReflections()` | `03-jurnal-portofolio.js` | 125 |
| Portofolio siswa `renderPortfolio()` | `03-jurnal-portofolio.js` | 395 |
| Validasi kompetensi `renderValidation()` | `03-jurnal-portofolio.js` | 529 |
| Dashboard BK `renderBKDashboard()` | `03-jurnal-portofolio.js` | 732 |
| Notifikasi siswa online `showOnlineNotif()` | `02-login-dashboard.js` | 1154 |

---

## 🗂️ Cara Cepat Cari di VS Code / Text Editor

```
Ctrl+Shift+F  →  cari nama fungsi atau keyword di seluruh folder
Ctrl+G        →  langsung ke nomor baris
Ctrl+F        →  cari di file yang sedang terbuka
```

**Tips pencarian:**
- Mau ubah teks dialog NPC? → cari nama NPC-nya (misal `"Sekar"`, `"Juna"`)
- Mau ubah harga item? → cari nama item (misal `"buku"`, `"ijazah"`)
- Mau ubah stat pernikahan? → cari `marriageConflictLevel` atau `marriedDay`
- Mau ubah reward quest? → cari nama quest-nya di `getQuestContent`
