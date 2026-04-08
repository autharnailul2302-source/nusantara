# 🎮 Nusantara Arsa: Rise of Student

Game RPG edukasi berbasis browser — dikembangkan oleh Nailul Authar, TKJ SMKN 1 Brondong.

---

## 📁 Struktur Proyek

```
nusantara/
├── index.html              ← Entry point utama (2.800 baris)
├── css/
│   └── style.css           ← Semua styling game (5.900 baris)
├── js/
│   ├── 01-config-firebase.js   ← Konfigurasi Firebase, Asset Loader, Audio System
│   ├── 02-quest-system.js      ← Quest harian, milestone, daily reward
│   ├── 03-init-loading.js      ← Inisialisasi awal & loading bar
│   ├── 04-leaderboard-datasvc.js ← Leaderboard publik & DataService
│   ├── 05-auth-login.js        ← Google Login & alur autentikasi
│   ├── 06-admin-dashboard.js   ← Dashboard guru/admin, grading, export
│   ├── 07-maps-world.js        ← Data map, tileset, interior map
│   ├── 08-npc-calendar.js      ← Data NPC, kalender event, dialog sosial
│   ├── 09-pet-system.js        ← Katalog pet, legendary battle, pet HUD
│   ├── 10-input-movement.js    ← Sistem input touch & pergerakan player
│   ├── 11-init-game.js         ← initGame(), tutorial steps
│   ├── 12-exam-minigame.js     ← Ujian masuk kuliah, minigame worker
│   ├── 13-materi-kuliah.js     ← Database 48 topik materi kuliah
│   ├── 14-ui-hud.js            ← HUD toggle, inventory, shop UI
│   ├── 15-gameloop-core.js     ← Game loop utama, update, collision, time
│   ├── 16-journal-partime.js   ← Jurnal harian berbasis role
│   ├── 17-career-marriage.js   ← Karir, part-time, pernikahan, role
│   ├── 18-render-draw.js       ← Render: objek, NPC, musuh, canvas
│   ├── 19-minimap-warnet.js    ← Minimap, warnet, sertifikat, misc UI
│   └── 20-fairy-village.js     ← Fairy Village Minigame (Kahyangan Wilis)
└── images/                     ← Semua aset gambar (tidak termasuk di repo ini)
```

---

## ⚠️ Urutan Load JS WAJIB Dijaga

File JS sudah diberi nomor urut `01-` s.d `20-`. Urutan di `index.html` **tidak boleh diacak**
karena tiap modul bergantung pada variabel yang didefinisikan modul sebelumnya.

---

## 🔧 Cara Update per Modul

| Ingin update apa? | Edit file ini |
|---|---|
| Konfigurasi Firebase | `js/01-config-firebase.js` |
| Quest / milestone baru | `js/02-quest-system.js` |
| Dashboard guru | `js/06-admin-dashboard.js` |
| Tambah/edit NPC | `js/08-npc-calendar.js` |
| Pet baru | `js/09-pet-system.js` |
| Map / interior baru | `js/07-maps-world.js` |
| Materi kuliah | `js/13-materi-kuliah.js` |
| Fairy Village | `js/20-fairy-village.js` |
| Logika utama game | `js/15-gameloop-core.js` |
| Tampilan / CSS | `css/style.css` |
| Struktur HTML | `index.html` |

---

## 🚀 Deploy ke GitHub Pages

1. Push semua file ke repo GitHub
2. Aktifkan **Settings → Pages → Deploy from branch: `main` / folder: `root`**
3. Pastikan folder `images/` juga ter-upload (atau gunakan CDN)

