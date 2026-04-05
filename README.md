# Nusantara Arsa: Rise of Student

Game simulasi RPG berbasis web untuk pembelajaran SMK/SMA/MA.

## 📁 Struktur Folder

```
/
├── index.html          ← Entry point utama (HTML + link ke CSS & JS)
├── css/
│   └── style.css       ← Semua styling (~6.000 baris)
├── js/
│   ├── config.js       ← Firebase, aset, audio, variabel global
│   ├── quest.js        ← Sistem quest, milestone, daily/weekly/monthly
│   ├── ui.js           ← UI helpers: dialogue, toast, HUD, popup
│   ├── dashboard.js    ← Dashboard guru BK + Festival Gempita
│   ├── game.js         ← Game loop, renderer, peta, kamera
│   ├── npc.js          ← initGame, interaksi NPC & objek dunia
│   ├── worker.js       ← Sistem pekerjaan & shift kerja
│   ├── akademi.js      ← Sistem kuliah & akademik
│   ├── world.js        ← Interaksi dunia, keluarga, wirausaha
│   ├── battle.js       ← Sistem battle & dungeon
│   ├── save.js         ← PWA service worker, save/load Firebase
│   └── fairy.js        ← Fairy Village (Kahyangan Wilis)
└── images/             ← Semua aset gambar
```

## ⚠️ Aturan Penting

### Urutan `<script>` di index.html TIDAK BOLEH diubah
Setiap file bergantung pada variabel yang didefinisikan di file sebelumnya:
```
config.js → quest.js → ui.js → dashboard.js → game.js
→ npc.js → worker.js → akademi.js → world.js → battle.js
→ save.js → fairy.js
```

### Menambahkan fitur baru
- **Fitur pekerjaan baru** → edit `js/worker.js`
- **Fitur kuliah baru** → edit `js/akademi.js`
- **Fitur fairy village** → edit `js/fairy.js`
- **Quest/misi baru** → edit `js/quest.js`
- **NPC baru** → edit `js/npc.js`
- **Variabel global baru** → tambahkan di `js/config.js`

### Variabel global (dari config.js)
Variabel berikut tersedia di semua file:
- `STATE` — state game utama (player, screen, location, dll)
- `TILE_SIZE` — ukuran tile
- `AudioService` — sistem audio
- `db`, `analytics` — Firebase

## 🚀 Deploy ke GitHub Pages

1. Upload semua folder ke repository GitHub
2. Aktifkan GitHub Pages dari Settings → Pages
3. Pilih branch `main`, folder `/ (root)`
4. Akses via `https://username.github.io/nama-repo/`

## 📝 Catatan Pengembangan

Setiap kali menambah fitur baru:
```bash
git add js/nama-file.js
git commit -m "tambah fitur: deskripsi singkat"
git push
```
GitHub hanya upload file yang berubah — jauh lebih cepat dari sebelumnya!
