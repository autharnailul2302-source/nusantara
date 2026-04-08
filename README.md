# 🎮 Nusantara Arsa: Rise of Student

Game edukasi berbasis browser — dipecah per fungsi agar mudah di-update dan dikelola di GitHub.

## 📁 Struktur File

```
nusantara-arsa/
├── index.html                    ← Entry point utama (HTML + referensi semua file)
├── css/
│   └── style.css                 ← Semua CSS (tema farm, HUD, modal, animasi)
├── js/
│   ├── 01_config_assets.js       ← 🔧 Firebase Config, Asset Loader, Audio
│   ├── 02_quest_system.js        ← 📋 Quest Harian / Mingguan / Bulanan / Milestone
│   ├── 03_auth_login.js          ← 🔐 Auth, Login, Mode Umum & Guru
│   ├── 04_dashboard_admin.js     ← 📊 Dashboard Admin: Stats, Ranking, Jurnal
│   ├── 05_dashboard_debug_bk.js  ← 🔧 Debug Mode & BK Dashboard
│   ├── 06_gempita_export.js      ← 🎉 Gempita Season & Export CSV
│   ├── 07_duel_minigame.js       ← ⚔️ Duel Minigame
│   ├── 08_game_init.js           ← 🎮 startGame, resize, Map Setup, initGame
│   ├── 09_kahyangan_wilis.js     ← 🧚 Kahyangan Wilis — Dunia Widadari Tersembunyi
│   ├── 10_fairy_village_map.js   ← 🗺️ Fairy Village Map Integration
│   ├── 11_game_world_events.js   ← 🌍 Welcome Anim, Konflik Kerja/Kampus/Bisnis
│   ├── 12_household_npc.js       ← 🏠 Aktivitas Rumah Tangga & Kepribadian NPC
│   ├── 13_mentor_sidequest.js    ← 🧠 Mentor Cerdas & Kisah Leluhur Quest
│   ├── 14a_ethics_system.js      ← 📊 Ethics Berdampak Nyata
│   ├── 14b_cinematic_engine.js   ← 🎬 Cinematic Engine
│   ├── 14c_dialogue_renderer.js  ← 💬 Dialogue System & Main Game Renderer
│   ├── 15_festival_sfx.js        ← 🎉 Festival Desa & SFX Global
│   └── 16_fairy_village_logic.js ← 🧚 Fairy Village Logic & Test Mode
└── images/                       ← (folder gambar — tidak berubah)
```

## 🔄 Panduan Update per Fitur

| Mau update apa? | Edit file ini |
|---|---|
| Tampilan / warna / animasi CSS | `css/style.css` |
| Quest harian, mingguan, milestone | `js/02_quest_system.js` |
| Login, auth, simpan data | `js/03_auth_login.js` |
| Dashboard guru/admin | `js/04_dashboard_admin.js` |
| Analitik / BK / debug | `js/05_dashboard_debug_bk.js` |
| Event Gempita / export | `js/06_gempita_export.js` |
| Dunia Kahyangan Wilis | `js/09_kahyangan_wilis.js` |
| Peta & bangunan Fairy Village | `js/10_fairy_village_map.js` |
| Event dunia, konflik, cuaca | `js/11_game_world_events.js` |
| Aktivitas harian, NPC relasi | `js/12_household_npc.js` |
| Mentor, quest kisah leluhur | `js/13_mentor_sidequest.js` |
| Sistem etika, cutscene | `js/14a_ethics_system.js` + `14b` |
| Dialogue & renderer utama | `js/14c_dialogue_renderer.js` |
| Festival & sound effects | `js/15_festival_sfx.js` |
| Fairy village gameplay | `js/16_fairy_village_logic.js` |

## 🚀 Cara Deploy ke GitHub Pages

1. Upload semua file ke repo GitHub
2. Aktifkan **GitHub Pages** dari Settings → Pages → Branch: `main`
3. Buka `https://[username].github.io/[repo-name]/`

> ⚠️ Pastikan folder `images/` juga di-upload karena game memerlukan aset gambar lokal.
