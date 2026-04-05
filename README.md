# Nusantara Arsa: Rise of Student
## Struktur Proyek (Setelah Dipecah)

File asli `index183.html` (~2.9 MB, 48.455 baris) sudah dipecah menjadi beberapa file agar ringan dan bisa di-upload ke GitHub tanpa error.

---

## Struktur Folder

```
/
├── index.html                  (~200 KB) — Kerangka HTML utama
├── style.css                   (~197 KB) — Semua CSS
├── images/                               — Aset gambar (tidak berubah)
└── js/
    ├── 01-firebase-init.js     (~197 KB) — Firebase config, login page, sesi
    ├── 02-login-dashboard.js   (~134 KB) — Google login, dashboard admin/guru
    ├── 03-jurnal-portofolio.js (~104 KB) — Jurnal siswa, portofolio, Gempita
    ├── 04-game-engine.js       (~515 KB) — Engine game: TILE, STATE, rendering, pet
    ├── 05-konflik-sistem.js    (~606 KB) — Konflik akademik & pernikahan dini
    ├── 06-quest-karir.js       (~570 KB) — Quest, part-time, lowongan, minigame
    └── 07-fairy-village.js     (~284 KB) — Pasar grosir, Kahyangan Wilis, peri
```

## ⚠️ PENTING: Urutan Script

Urutan `<script>` di `index.html` **WAJIB** dipertahankan karena setiap file bergantung pada variabel/fungsi dari file sebelumnya:

```
01 → 02 → 03 → 04 → 05 → 06 → 07
```

## Cara Deploy ke GitHub Pages

1. Upload semua file ke repo GitHub (pertahankan struktur folder)
2. Aktifkan GitHub Pages dari Settings → Pages → Branch: `main`
3. Pastikan folder `images/` juga ter-upload

## Cara Jalankan Lokal

Butuh web server lokal (tidak bisa buka `index.html` langsung via file://):

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Lalu buka: `http://localhost:8080`
