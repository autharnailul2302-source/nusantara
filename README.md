# 🎮 Nusantara Arsa: Rise of Student

Game edukasi berbasis web (HTML/CSS/JS) + Firebase.

## 📁 Struktur File

```
nusantara-arsa/
├── index.html              ← Entry point utama (HTML + load semua JS/CSS)
├── css/
│   └── style.css           ← Semua styling game (tema farm, kartun, UI)
├── js/                     ← Dipecah per fungsi agar mudah update
│   ├── 00_config_debug.js  ← Firebase config, asset loader, sound system, debug mode
│   ├── 01_quest_system.js  ← Quest harian/mingguan/bulanan/tahunan
│   ├── 02_asset_preload.js ← Preload & manajemen aset gambar
│   ├── 03_auth_menu.js     ← Login, register, auth, DataService, main menu
│   ├── 04_mode_umum.js     ← Mode Umum (main tanpa akun / localStorage)
│   ├── 05_dashboard_admin.js← Dashboard guru/admin, statistik, monitoring
│   ├── 06_dashboard_bk.js  ← Dashboard BK + analitik prediktif
│   ├── 07_gempita_event.js ← Gempita Season Event tahunan
│   ├── 08_fairy_village_ui.js← Kahyangan Wilis UI & peta peri
│   ├── 09_game_init.js     ← Inisialisasi game, animasi selamat datang
│   ├── 10_tutorial.js      ← Sistem tutorial (step by step)
│   ├── 11_conflict_system.js← Konflik kerja, akademik, wirausaha
│   ├── 12_home_activities.js← Menu aktivitas rumah tangga
│   ├── 13_npc_mentor.js    ← NPC personality, relasi, mentor cerdas, Ki Lamong
│   ├── 14_side_quest.js    ← Side quest: Kisah Leluhur Lamongan
│   ├── 15_ethics_system.js ← Ethics system & dampak nyata
│   ├── 16_cinematic_festival.js← Cinematic engine & festival desa
│   ├── 17_festival_sfx.js  ← Festival sistem & SFX global
│   ├── 18_fishing_misc.js  ← Fishing, konsekuensi nyata, career check
│   ├── 19_report_engine.js ← Potret masa depanku / laporan akhir
│   ├── 20_fairy_core.js    ← Fairy village world map core
│   ├── 21_fairy_tutorial.js← Tutorial kahyangan wilis
│   ├── 22_fairy_map.js     ← Fairy village map refresh
│   ├── 23_fairy_gameplay.js← Fairy village: game loop, build queue, draw
│   └── 24_fairy_dialog.js  ← Dialog Rara Wilis, test modes, stubs
└── images/                 ← Folder aset gambar (tidak berubah)
```

## 🔧 Cara Update per Fungsi

| Ingin update apa? | Edit file ini |
|---|---|
| Tampilan / tema warna | `css/style.css` |
| Login / register / auth | `js/03_auth_menu.js` |
| Quest & reward | `js/01_quest_system.js` |
| Dashboard guru / admin | `js/05_dashboard_admin.js` |
| Dashboard BK | `js/06_dashboard_bk.js` |
| Tutorial pertama main | `js/10_tutorial.js` |
| Dialog NPC / mentor | `js/13_npc_mentor.js` |
| Sistem konflik | `js/11_conflict_system.js` |
| Kahyangan Wilis (peri) | `js/20_fairy_core.js` - `js/24_fairy_dialog.js` |
| Festival desa | `js/16_cinematic_festival.js` |
| Fishing minigame | `js/18_fishing_misc.js` |
| Laporan akhir siswa | `js/19_report_engine.js` |

## ⚡ Deploy ke GitHub Pages

1. Upload semua file ke repo GitHub
2. Enable GitHub Pages dari Settings → Pages → Branch: main
3. Buka `https://username.github.io/repo-name/`

> **Catatan:** File `index184.html` original (~2.9MB, 48K baris) sudah dipecah menjadi
> 25 file JS + 1 CSS, masing-masing di bawah 6000 baris. GitHub limit per file = 100MB,
> tapi agar mudah review, tiap file dijaga <6000 baris.
