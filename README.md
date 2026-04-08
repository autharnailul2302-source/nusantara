# 🎮 Nusantara Arsa: Rise of Student

Game RPG edukasi berbasis web — dipecah per modul agar mudah diupdate.

## Struktur File

```
index.html              ← Entry point utama
css/
└── styles.css          ← Semua CSS (~5.900 baris)
js/
├── 01-firebase-config.js                ← Firebase Config + Init
├── 02-debug-milestone.js                ← Debug Mode + Milestone Quest Tahunan
├── 03-admin-google-login.js             ← Google Login + Admin Dashboard
├── 04-jurnal-portfolio.js               ← Jurnal Siswa + Portofolio Guru
├── 05-bk-analitik-gempita.js            ← Dashboard BK + Analitik Prediktif + Gempita Season
├── 06-kahyangan-widadari.js             ← Kahyangan Wilis / Dunia Widadari
├── 07-pet-system.js                     ← Sistem Peliharaan (PET_CATALOG)
├── 08-maps-data.js                      ← Data Peta + Fairy Village Map
├── 09-animasi-welcome.js                ← Animasi Selamat Datang
├── 10-konflik-kerja.js                  ← Sistem Konflik Tempat Kerja
├── 11-konflik-akademik.js               ← Sistem Konflik Akademik (Mahasiswa)
├── 12-konflik-bisnis.js                 ← Sistem Konflik Wirausaha (Entrepreneur)
├── 13-rumah-tangga.js                   ← Aktivitas Rumah Tangga
├── 14-npc-mentor.js                     ← NPC Kepribadian + Mentor Cerdas
├── 15-quest-sidequest.js                ← Side Quest + Ritual Kahyangan + Ethics
├── 16-jurnal-refleksi.js                ← Jurnal Refleksi + Quest Media
├── 17-kerja-parttime.js                 ← Sistem Part-Time
├── 18-minigame-lamaran.js               ← Minigame Lamaran Kerja + Lowongan DB
├── 19-cinematic-festival.js             ← Cinematic Engine + Festival Desa
├── 20-sfx-pasar-audio.js                ← SFX Global + Logika Pasar Grosir
├── 21-fv-world-map.js                   ← Fairy Village World Map (BoF4 Style)
├── 22-fv-tutorial.js                    ← Tutorial Kahyangan Wilis
├── 23-fv-map-refresh.js                 ← Refresh + Init Fairy Village Map
├── 24-fv-gameloop-draw.js               ← Game Loop + Build Queue + Draw Fairy Village
├── 25-fv-dialog-npc.js                  ← Dialog NPC Peri + Rara Wilis + Istana
├── 26-fv-collect-partikel.js            ← Collect Dust + Partikel Effect
├── 27-fv-hud-testmode.js                ← HUD Fairy Village + Test Mode
```

## Cara Update Modul

Setiap file JS diberi nomor urut dan nama fungsi. Kalau mau update:
- **Tambah fitur konflik kerja** → edit `js/10-konflik-kerja.js`
- **Update sistem peri** → edit `js/21-27-fv-*.js`
- **Ubah tampilan** → edit `css/styles.css`
- **Update koneksi Firebase** → edit `js/01-firebase-config.js`

> ⚠️ Jangan ubah urutan `<script>` di `index.html` — modul saling bergantung!

## Deploy ke GitHub Pages

1. Push semua file ke repo GitHub
2. Aktifkan GitHub Pages dari Settings → Pages → branch `main` / folder `/root`
3. Akses game di `https://<username>.github.io/<repo>/`
