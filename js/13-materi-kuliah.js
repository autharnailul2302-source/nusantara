            // --- NEW: DATABASE MATERI KULIAH (EXPANDED TO 48 TOPICS - 2 YEARS FULL) ---
            // Logika: 1 Tahun = 120 Hari. Kuliah Spesial tiap 5 hari. Total = 24 Materi/Tahun.
            // UPDATE: MATERI LENGKAP & LEBIH MENDALAM (TEORI ASLI)
            const COURSE_MATERIALS = {
                'teknologi': [
                    // --- TAHUN PERTAMA (BASIC & DEV) ---
                    // SEMESTER 1 (Basic Computer Science)
                    {
                        t: "Algoritma & Pemrograman Dasar",
                        c: "DEFINISI:\nUrutan langkah logis penyelesaian masalah yang disusun secara sistematis.\n\n3 SYARAT ALGORITMA:\n1. Finiteness: Harus berhenti setelah sejumlah langkah.\n2. Definiteness: Setiap langkah harus jelas/tidak ambigu.\n3. Effectiveness: Langkah harus sederhana dan dapat dikerjakan.\n\nNOTASI:\n- Pseudocode (Kode semu)\n- Flowchart (Diagram alir)"
                    },
                    {
                        t: "Struktur Data (Data Structures)",
                        c: "KONSEP:\nCara penyimpanan, penyusunan, dan pengaturan data di dalam media penyimpanan komputer.\n\nTIPE DASAR:\n1. Array: Kumpulan data sejenis dengan indeks statis.\n2. Linked List: Rangkaian node yang saling menunjuk (dinamis).\n3. Stack: Tumpukan (LIFO - Last In First Out).\n4. Queue: Antrean (FIFO - First In First Out)."
                    },
                    {
                        t: "Basis Data (Database SQL)",
                        c: "RDBMS (Relational Database):\nPenyimpanan data dalam bentuk tabel yang saling berelasi.\n\nKUNCI UTAMA:\n- Primary Key (PK): Identitas unik setiap baris data.\n- Foreign Key (FK): Kunci tamu untuk menghubungkan antar tabel.\n\nNORMALISASI:\nProses pengelompokan atribut data untuk menghilangkan redundansi dan anomali data."
                    },
                    {
                        t: "Jaringan Komputer Dasar",
                        c: "MODEL OSI (7 LAYER):\n1. Physical (Kabel/Sinyal)\n2. Data Link (MAC Address)\n3. Network (IP Address/Routing)\n4. Transport (TCP/UDP)\n5. Session\n6. Presentation\n7. Application (HTTP/FTP)\n\nIP ADDRESS:\nAlamat unik perangkat dalam jaringan. IPv4 (32-bit) dan IPv6 (128-bit)."
                    },
                    {
                        t: "Keamanan Siber (Cyber Security)",
                        c: "CIA TRIAD:\n1. Confidentiality (Kerahasiaan): Data hanya boleh diakses yang berhak.\n2. Integrity (Keutuhan): Data tidak boleh diubah oleh pihak tak berwenang.\n3. Availability (Ketersediaan): Data harus bisa diakses saat dibutuhkan.\n\nANCAMAN UMUM:\n- Phishing (Pencurian info via manipulasi)\n- Malware (Virus/Ransomware)\n- DDoS (Serangan membanjiri trafik)"
                    },
                    {
                        t: "Kecerdasan Buatan (AI Basics)",
                        c: "DEFINISI:\nSimulasi kecerdasan manusia dalam mesin yang diprogram untuk berpikir dan meniru tindakannya.\n\nCABANG AI:\n1. Machine Learning: Mesin belajar dari data tanpa diprogram eksplisit.\n2. Neural Networks: Meniru cara kerja neuron otak manusia.\n3. NLP: Pemrosesan bahasa alami (teks/suara).\n4. Computer Vision: Analisis gambar/video."
                    },

                    // SEMESTER 2 (Development Skills)
                    {
                        t: "Pemrograman Web (Frontend & Backend)",
                        c: "ARSITEKTUR WEB:\n- Client-Side (Frontend): HTML (Struktur), CSS (Gaya), JS (Interaksi).\n- Server-Side (Backend): Node.js, PHP, Python, Database.\n\nHTTP REQUEST METHODS:\n- GET: Mengambil data.\n- POST: Mengirim data baru.\n- PUT: Update data.\n- DELETE: Hapus data."
                    },
                    {
                        t: "Pemrograman Mobile (Android/iOS)",
                        c: "NATIVE VS HYBRID:\n- Native: Java/Kotlin (Android), Swift (iOS). Performa tinggi, akses hardware penuh.\n- Hybrid/Cross-Platform: Flutter, React Native. Satu kode untuk semua platform.\n\nLIFECYCLE AKTIVITAS:\nCreate -> Start -> Resume -> Pause -> Stop -> Destroy."
                    },
                    {
                        t: "Cloud Computing",
                        c: "LAYANAN CLOUD:\n1. IaaS (Infrastructure): Sewa server/storage virtual (AWS EC2).\n2. PaaS (Platform): Lingkungan development siap pakai (Heroku).\n3. SaaS (Software): Aplikasi jadi via internet (Google Docs).\n\nMANFAAT:\nSkalabilitas (bisa diperbesar kapan saja) dan Efisiensi Biaya (Pay-as-you-go)."
                    },
                    {
                        t: "Internet of Things (IoT)",
                        c: "KONSEP:\nJaringan objek fisik yang tertanam dengan sensor, software, dan teknologi lain untuk bertukar data via internet.\n\nKOMPONEN UTAMA:\n1. Sensor/Actuator (Pengambil data/Penggerak).\n2. Connectivity (Wi-Fi, Bluetooth, Zigbee).\n3. Data Processing (Cloud/Edge).\n4. User Interface (Dashboard/App)."
                    },
                    {
                        t: "Teknologi Blockchain",
                        c: "PRINSIP DASAR:\nBuku besar (ledger) digital yang terdesentralisasi, terdistribusi, dan tidak dapat diubah (immutable).\n\nCARA KERJA:\nTransaksi dicatat dalam 'blok', dienkripsi (hash), dan dirangkai ke blok sebelumnya (chain). Jika satu blok diubah, seluruh rantai rusak (terdeteksi palsu)."
                    },
                    {
                        t: "Big Data Analytics",
                        c: "KARAKTERISTIK 3V:\n1. Volume: Jumlah data sangat besar.\n2. Velocity: Kecepatan data masuk sangat tinggi (real-time).\n3. Variety: Jenis data beragam (teks, video, log).\n\nTUJUAN:\nMenemukan pola tersembunyi, korelasi pasar, dan preferensi pelanggan untuk keputusan bisnis."
                    },

                    // --- TAHUN KEDUA (ADVANCED & SPECIALIZATION) ---
                    // SEMESTER 3 (Engineering & Ethics)
                    {
                        t: "User Interface (UI) & User Experience (UX)",
                        c: "UI (Tampilan):\nFokus pada estetika, warna, tipografi, dan tata letak visual.\n\nUX (Pengalaman):\nFokus pada kemudahan penggunaan, alur pengguna (user flow), dan kepuasan interaksi.\n\nPRINSIP DESAIN:\nKonsistensi, Feedback yang jelas, dan Minimalisir beban kognitif pengguna."
                    },
                    {
                        t: "Software Engineering (RPL)",
                        c: "SDLC (System Development Life Cycle):\n1. Planning (Perencanaan)\n2. Analysis (Analisis Kebutuhan)\n3. Design (Perancangan)\n4. Implementation (Coding)\n5. Testing (Pengujian)\n6. Maintenance (Pemeliharaan)\n\nMODEL:\nWaterfall (Sekuensial) vs Agile (Iteratif/Fleksibel)."
                    },
                    {
                        t: "Sistem Operasi (OS)",
                        c: "FUNGSI UTAMA OS:\n1. Manajemen Proses (Scheduling CPU).\n2. Manajemen Memori (RAM & Virtual Memory).\n3. Manajemen File (File System).\n4. Manajemen I/O (Input Output).\n\nKERNEL:\nInti dari OS yang menghubungkan software aplikasi dengan hardware komputer."
                    },
                    {
                        t: "Arsitektur & Organisasi Komputer",
                        c: "UNIT UTAMA (Von Neumann):\n1. CPU (ALU + Control Unit): Otak pemroses.\n2. Memory: Penyimpanan instruksi/data.\n3. I/O Devices: Perangkat masukan/keluaran.\n\nFETCH-DECODE-EXECUTE:\nSiklus CPU mengambil instruksi dari memori, menerjemahkannya, dan menjalankannya."
                    },
                    {
                        t: "Etika Profesi IT",
                        c: "PRINSIP ETIKA:\n1. Privasi: Menjaga kerahasiaan data pengguna.\n2. Akurasi: Tidak memanipulasi data/fakta.\n3. Properti: Menghargai Hak Kekayaan Intelektual (HAKI).\n4. Akses: Tidak membatasi akses informasi secara diskriminatif.\n\nKASUS:\nPlagiarisme kode, penyebaran malware, penyalahgunaan data user."
                    },
                    {
                        t: "Digital Marketing & SEO",
                        c: "SEO (Search Engine Optimization):\nOptimasi website agar muncul di halaman pertama pencarian organik (Google).\n\nSEM (Search Engine Marketing):\nPemasaran berbayar (Iklan/Ads) di mesin pencari.\n\nMETRIK PENTING:\n- CTR (Click Through Rate)\n- Conversion Rate\n- Bounce Rate"
                    },

                    // SEMESTER 4 (Advanced Tech)
                    {
                        t: "Pengembangan Game (Game Dev)",
                        c: "GAME LOOP:\nSiklus tak berujung: Input -> Update Logika -> Render Grafis.\n\nKOMPONEN:\n- Sprite/Mesh (Visual)\n- Collider/Rigidbody (Fisika)\n- Script (Logika)\n- Audio (Suara)\n\nGENRE:\nRPG, FPS, Platformer, Simulation, Strategy."
                    },
                    {
                        t: "Virtual Reality (VR) & AR",
                        c: "VR (Virtual Reality):\nPengguna masuk sepenuhnya ke dunia digital (Immersive) menggunakan headset.\n\nAR (Augmented Reality):\nMenambahkan objek digital ke dunia nyata (contoh: Filter kamera, Pokemon GO).\n\nMR (Mixed Reality):\nInteraksi objek digital dan fisik secara real-time."
                    },
                    {
                        t: "E-Commerce Systems",
                        c: "MODEL BISNIS:\n- B2B (Business to Business)\n- B2C (Business to Consumer)\n- C2C (Consumer to Consumer - Marketplace)\n\nKEAMANAN TRANSAKSI:\nEnkripsi SSL/TLS, Payment Gateway, dan Two-Factor Authentication (2FA) untuk mencegah penipuan."
                    },
                    {
                        t: "Manajemen Startup Digital",
                        c: "TAHAPAN STARTUP:\n1. Ideation: Validasi ide masalah & solusi.\n2. MVP (Minimum Viable Product): Produk dasar untuk tes pasar.\n3. Product-Market Fit: Produk disukai dan dibutuhkan pasar.\n4. Scaling: Ekspansi pertumbuhan pengguna.\n\nLEAN STARTUP:\nBuild - Measure - Learn (Buat - Ukur - Pelajari)."
                    },
                    {
                        t: "Manajemen Proyek (Agile/Scrum)",
                        c: "AGILE MANIFESTO:\nLebih menghargai individu & interaksi daripada proses & alat. Merespon perubahan daripada mengikuti rencana kaku.\n\nSCRUM FRAMEWORK:\n- Sprint: Siklus kerja pendek (2-4 minggu).\n- Daily Standup: Rapat harian singkat.\n- Roles: Product Owner, Scrum Master, Dev Team."
                    },
                    {
                        t: "Teknologi Masa Depan (Futurism)",
                        c: "TREN MENDATANG:\n1. Quantum Computing: Komputer super cepat berbasis Qubit.\n2. Biotechnology: Integrasi teknologi dengan biologi (Biohacking).\n3. Autonomous Systems: Robot/Kendaraan mandiri.\n4. Green Tech: Teknologi ramah lingkungan untuk keberlanjutan bumi."
                    },

                    // --- TAHUN KETIGA (EXPERT & SPECIALIZATION) ---
                    // SEMESTER 5 (Cloud & DevOps Architecture)
                    {
                        t: "Microservices Architecture",
                        c: "KONSEP:\nMemecah aplikasi besar (Monolith) menjadi layanan-layanan kecil yang independen dan saling berkomunikasi via API.\n\nKELEBIHAN:\n- Independensi Deployment\n- Skalabilitas per fitur\n- Bebas memilih teknologi per service\n\nKEKURANGAN:\nKompleksitas manajemen jaringan dan data."
                    },
                    {
                        t: "Docker & Containerization",
                        c: "CONTAINER:\nUnit standar perangkat lunak yang mengemas kode dan dependensinya agar aplikasi berjalan cepat dan andal di lingkungan komputasi yang berbeda.\n\nDOCKER:\nPlatform terbuka untuk mengembangkan, mengirim, dan menjalankan aplikasi dalam kontainer. Memisahkan aplikasi dari infrastruktur."
                    },
                    {
                        t: "Kubernetes (K8s)",
                        c: "ORCHESTRATION:\nSistem open-source untuk mengotomatisasi deployment, scaling, dan manajemen aplikasi terkontainerisasi.\n\nFITUR UTAMA:\n- Self-healing (Restart container mati)\n- Load balancing (Distribusi trafik)\n- Automated rollouts/rollbacks (Update otomatis)"
                    },
                    {
                        t: "CI/CD Pipeline",
                        c: "CI (Continuous Integration):\nPengembang sering menggabungkan kode ke repositori pusat (Shared Repo). Otomatisasi build dan test.\n\nCD (Continuous Delivery/Deployment):\nOtomatisasi rilis aplikasi ke lingkungan produksi. Memastikan software selalu siap dirilis ke user."
                    },
                    {
                        t: "DevOps Culture",
                        c: "DEFINISI:\nGabungan filosofi budaya, praktik, dan alat yang meningkatkan kemampuan organisasi untuk mengirimkan aplikasi dengan kecepatan tinggi.\n\nTUJUAN:\nMenghapus silo (tembok pemisah) antara tim Development (Pengembang) dan Operations (Operasional IT) agar kolaborasi lebih efisien."
                    },
                    {
                        t: "Cloud Security Architecture",
                        c: "SHARED RESPONSIBILITY:\nPenyedia Cloud (AWS/Google) bertanggung jawab atas keamanan 'of the cloud' (infrastruktur fisik).\nPelanggan bertanggung jawab atas keamanan 'in the cloud' (data, akses, konfigurasi).\n\nBEST PRACTICE:\nEnkripsi data at rest & in transit, IAM (Identity Access Management)."
                    },

                    // SEMESTER 6 (AI & Data Science Deep Dive)
                    {
                        t: "Deep Learning & Neural Networks",
                        c: "NEURAL NETWORK:\nModel komputasi yang terinspirasi dari struktur otak manusia (neuron dan sinapsis).\n\nDEEP LEARNING:\nPembelajaran mesin dengan banyak lapisan (hidden layers) untuk mengekstrak fitur tingkat tinggi dari data mentah. Contoh: Pengenalan wajah, mobil otonom."
                    },
                    {
                        t: "Natural Language Processing (NLP)",
                        c: "FUNGSI:\nMemampukan komputer untuk memahami, menafsirkan, dan memanipulasi bahasa manusia.\n\nAPLIKASI:\n- Chatbot & Virtual Assistant\n- Terjemahan Bahasa (Google Translate)\n- Analisis Sentimen (Cek respon positif/negatif di sosmed)\n- Peringkasan Teks Otomatis."
                    },
                    {
                        t: "Computer Vision",
                        c: "DEFINISI:\nBidang AI yang melatih komputer untuk menafsirkan dan memahami dunia visual (gambar/video).\n\nTEKNOLOGI:\n- Image Classification (Kucing vs Anjing)\n- Object Detection (Deteksi mobil di jalan)\n- Facial Recognition (Kunci HP wajah)\n- Medical Imaging (Deteksi tumor dari X-Ray)."
                    },
                    {
                        t: "Predictive Analytics",
                        c: "METODE:\nMenggunakan data historis, algoritma statistik, dan teknik machine learning untuk mengidentifikasi kemungkinan hasil masa depan.\n\nCONTOH:\n- Prediksi harga saham\n- Prediksi cuaca\n- Rekomendasi produk (Netflix/Spotify)\n- Deteksi potensi kerusakan mesin (Maintenance)."
                    },
                    {
                        t: "Ethical Hacking (Pentesting)",
                        c: "DEFINISI:\nPeretasan yang dilakukan dengan izin untuk menemukan kelemahan keamanan sistem sebelum dieksploitasi oleh peretas jahat.\n\nTAHAPAN:\n1. Reconnaissance (Pengumpulan info)\n2. Scanning (Pemindaian celah)\n3. Gaining Access (Eksploitasi)\n4. Maintaining Access\n5. Clearing Tracks (Hapus jejak)."
                    },
                    {
                        t: "Digital Forensics",
                        c: "TUJUAN:\nMengidentifikasi, memelihara, memulihkan, menganalisis, dan menyajikan fakta tentang bukti digital dalam kasus hukum.\n\nPROSES:\n- Seizure (Penyitaan perangkat)\n- Acquisition (Duplikasi data bit-by-bit)\n- Analysis (Mencari bukti tersembunyi/terhapus)\n- Reporting (Laporan hukum)."
                    },

                    // SEMESTER 7 (Modern Web & Management)
                    {
                        t: "Serverless Computing",
                        c: "KONSEP:\nModel eksekusi cloud di mana penyedia cloud mengelola server secara dinamis. Developer hanya fokus menulis kode fungsi (FaaS - Function as a Service).\n\nKEUNTUNGAN:\n- Tidak perlu manajemen server\n- Scaling otomatis dari nol ke ribuan request\n- Bayar hanya saat kode dijalankan."
                    },
                    {
                        t: "Progressive Web Apps (PWA)",
                        c: "FITUR:\nAplikasi web yang menggunakan fitur browser modern untuk memberikan pengalaman seperti aplikasi native (mobile app).\n\nKELEBIHAN:\n- Bisa diinstall di Home Screen\n- Bisa jalan Offline (Service Workers)\n- Push Notifications\n- Ringan dan cepat."
                    },
                    {
                        t: "GraphQL API",
                        c: "DEFINISI:\nBahasa query untuk API dan runtime untuk memenuhi query tersebut dengan data yang ada.\n\nBEDA DENGAN REST:\n- REST: Banyak endpoint, data fixed (over-fetching/under-fetching).\n- GraphQL: Satu endpoint, client minta data spesifik yang dibutuhkan saja (efisien)."
                    },
                    {
                        t: "Tech Leadership (CTO Role)",
                        c: "TANGGUNG JAWAB:\n- Menentukan visi teknologi perusahaan.\n- Memilih stack teknologi yang tepat.\n- Membangun dan memimpin tim engineering.\n- Menjembatani kebutuhan bisnis dengan solusi teknis.\n\nSKILL:\nKomunikasi, Manajemen Krisis, Mentoring."
                    },
                    {
                        t: "Startup Valuation & Funding",
                        c: "VALUASI:\nNilai ekonomis dari sebuah bisnis startup. Dipengaruhi oleh tim, traksi, ukuran pasar, dan teknologi.\n\nTAHAP PENDANAAN:\n- Bootstrapping (Modal sendiri)\n- Angel Investor\n- Seed Funding\n- Series A, B, C (Venture Capital)\n- IPO (Saham Publik)."
                    },
                    {
                        t: "Hukum IT & HAKI",
                        c: "UU ITE (Indonesia):\nMengatur informasi dan transaksi elektronik. Pasal karet, pencemaran nama baik, akses ilegal.\n\nHAKI (Hak Kekayaan Intelektual):\n- Hak Cipta (Copyright): Kode program, desain UI.\n- Paten: Penemuan teknologi baru.\n- Merek Dagang: Logo/Brand startup."
                    },

                    // SEMESTER 8 (Global Impact & Ethics)
                    {
                        t: "Green Computing",
                        c: "TUJUAN:\nMengurangi dampak lingkungan dari teknologi komputer. Hemat energi dan kurangi limbah elektronik (e-waste).\n\nSTRATEGI:\n- Virtualisasi server (kurangi hardware fisik)\n- Algoritma efisien (kurangi beban CPU/listrik)\n- Daur ulang perangkat keras\n- Data center bertenaga terbarukan."
                    },
                    {
                        t: "Bioinformatics",
                        c: "GABUNGAN:\nBiologi molekuler + Ilmu Komputer + Statistik.\n\nFUNGSI:\nMengelola dan menganalisis data biologis kompleks, seperti sekuensing DNA/RNA.\n\nMANFAAT:\nPenemuan obat baru, pemetaan gen manusia, personalisasi pengobatan medis."
                    },
                    {
                        t: "Smart Cities Implementation",
                        c: "DEFINISI:\nKota yang menggunakan teknologi IoT dan data untuk meningkatkan kualitas layanan publik dan kesejahteraan warga.\n\nCONTOH:\n- Smart Traffic (Lampu merah adaptif)\n- Smart Waste (Tempat sampah lapor penuh)\n- E-Gov (Layanan administrasi online)\n- Smart Energy (Grid listrik efisien)."
                    },
                    {
                        t: "Space Technology Software",
                        c: "TANTANGAN:\nSoftware di luar angkasa harus sangat andal (zero-failure), tahan radiasi, dan beroperasi real-time dengan latensi tinggi.\n\nCONTOH:\n- Sistem navigasi roket (SpaceX)\n- Kontrol rover Mars (NASA)\n- Komunikasi satelit."
                    },
                    {
                        t: "Quantum Computing Advance",
                        c: "QUBIT:\nUnit dasar informasi kuantum. Berbeda dengan Bit (0 atau 1), Qubit bisa 0 dan 1 sekaligus (Superposisi).\n\nPOTENSI:\nMemecahkan masalah yang butuh ribuan tahun bagi superkomputer klasik dalam hitungan detik (contoh: simulasi molekul, pemecahan enkripsi RSA)."
                    },
                    {
                        t: "Transhumanism & Future Ethics",
                        c: "FILOSOFI:\nGerakan yang mendukung penggunaan teknologi untuk meningkatkan kemampuan fisik dan mental manusia (Human 2.0).\n\nISU ETIKA:\n- Kesenjangan sosial (hanya orang kaya yang 'upgrade').\n- Hilangnya esensi kemanusiaan.\n- Chip implan otak (Neuralink)."
                    }
                ],
                'sejarah': [
                    // --- TAHUN PERTAMA (NUSANTARA BASIC) ---
                    // ZAMAN KUNO
                    {
                        t: "Zaman Prasejarah Nusantara",
                        c: "MANUSIA PURBA:\n1. Meganthropus (Manusia Raksasa): Paling tua.\n2. Pithecanthropus (Manusia Kera): Erectus (berjalan tegak).\n3. Homo Sapiens (Manusia Cerdas): Leluhur manusia modern.\n\nKEBUDAYAAN:\n- Paleolitikum (Batu Tua): Nomaden, berburu.\n- Neolitikum (Batu Muda): Menetap, bercocok tanam."
                    },
                    {
                        t: "Kerajaan Kutai Martadipura",
                        c: "LOKASI:\nSungai Mahakam, Kalimantan Timur. Kerajaan Hindu tertua di Indonesia (Abad 4 M).\n\nBUKTI SEJARAH:\n7 Prasasti Yupa (Tiang batu pengikat hewan kurban) bertuliskan huruf Pallawa bahasa Sanskerta.\n\nRAJA TERKENAL:\n- Kudungga (Pendiri)\n- Aswawarman (Pembentuk Wangsa)\n- Mulawarman (Masa Kejayaan, kurban 20.000 sapi)."
                    },
                    {
                        t: "Kemaritiman Sriwijaya",
                        c: "LOKASI:\nPalembang, Sumatera Selatan (Abad 7-13 M). Kerajaan Buddha terbesar.\n\nKEJAYAAN:\n- Menguasai Selat Malaka (Jalur perdagangan dunia).\n- Pusat studi agama Buddha (Dikunjungi I-Tsing).\n- Armada laut yang sangat kuat.\n\nPRASASTI:\nKedukan Bukit, Talang Tuo, Kota Kapur."
                    },
                    {
                        t: "Majapahit & Sumpah Palapa",
                        c: "LOKASI:\nTrowulan, Jawa Timur (1293-1500 M). Kerajaan Hindu-Buddha terbesar pemersatu Nusantara.\n\nTOKOH:\n- Raden Wijaya (Pendiri)\n- Hayam Wuruk (Raja Masa Emas)\n- Gajah Mada (Mahapatih).\n\nSUMPAH PALAPA:\nSumpah Gajah Mada untuk tidak menikmati kemewahan duniawi sebelum menyatukan seluruh pulau Nusantara."
                    },
                    {
                        t: "Masuknya Islam ke Nusantara",
                        c: "TEORI MASUKNYA:\n1. Teori Gujarat (India)\n2. Teori Mekkah (Arab)\n3. Teori Persia (Iran)\n\nSALURAN PENYEBARAN:\n- Perdagangan (Pedagang Muslim)\n- Perkawinan\n- Pendidikan (Pesantren)\n- Kesenian (Wayang Sunan Kalijaga)\n- Tasawuf."
                    },
                    {
                        t: "Kesultanan Demak",
                        c: "SEJARAH:\nKerajaan Islam pertama di Jawa (1478 M). Didirikan oleh Raden Patah (putra Majapahit).\n\nPERAN:\n- Pusat penyebaran Islam di Jawa (Wali Songo).\n- Penyerangan ke Portugis di Malaka (oleh Pati Unus / Pangeran Sabrang Lor).\n\nPENINGGALAN:\nMasjid Agung Demak (Soko Tatal)."
                    },

                    // ZAMAN KOLONIAL
                    {
                        t: "Kolonialisme Portugis & Spanyol",
                        c: "MOTIVASI 3G:\n1. Gold (Kekayaan/Rempah)\n2. Glory (Kejayaan/Wilayah)\n3. Gospel (Penyebaran Agama)\n\nPERISTIWA:\n- 1511: Portugis (Alfonso de Albuquerque) menaklukkan Malaka.\n- 1512: Sampai di Maluku (Pusat Rempah).\n- Perjanjian Saragosa: Pembagian wilayah Spanyol & Portugis."
                    },
                    {
                        t: "VOC (Vereenigde Oostindische Compagnie)",
                        c: "DEFINISI:\nKongsi Dagang Hindia Timur Belanda (1602). Perusahaan multinasional pertama di dunia.\n\nHAK OKTROI (Istimewa):\n- Hak monopoli dagang.\n- Hak mencetak uang.\n- Hak memelihara tentara & perang.\n- Hak memerintah (negara dalam negara).\n\nKEBANGKRUTAN (1799):\nKorupsi pegawai, biaya perang, persaingan dagang."
                    },
                    {
                        t: "Perang Diponegoro (Perang Jawa)",
                        c: "WAKTU:\n1825 - 1830 (5 Tahun).\n\nPENYEBAB:\n- Belanda mematok tanah makam leluhur Pangeran Diponegoro.\n- Penderitaan rakyat akibat pajak.\n\nAKHIR PERANG:\nDiponegoro ditipu saat perundingan di Magelang, ditangkap, dan diasingkan ke Makassar. Perang ini membuat kas Belanda kosong."
                    },
                    {
                        t: "Politik Etis (Balas Budi)",
                        c: "LATAR BELAKANG:\nKritik Van Deventer atas eksploitasi Belanda terhadap pribumi (Tanam Paksa).\n\nTRILOGI VAN DEVENTER:\n1. Irigasi (Pengairan sawah)\n2. Emigrasi (Pemerataan penduduk)\n3. Edukasi (Pendidikan) -> Paling berdampak, melahirkan golongan terpelajar Indonesia."
                    },
                    {
                        t: "Kebangkitan Nasional (1908)",
                        c: "BUDI UTOMO:\nOrganisasi modern pertama (20 Mei 1908) oleh Dr. Sutomo & Wahidin Sudirohusodo.\n\nMAKNA:\nPerubahan pola perjuangan dari:\n- Fisik (Senjata) -> Diplomasi/Intelektual\n- Kedaerahan -> Nasional\n- Tergantung pemimpin -> Terorganisir."
                    },
                    {
                        t: "Sumpah Pemuda (1928)",
                        c: "KONGRES PEMUDA II:\n27-28 Oktober 1928 di Jakarta.\n\nISI SUMPAH:\n1. Bertumpah darah satu: Tanah Indonesia.\n2. Berbangsa satu: Bangsa Indonesia.\n3. Menjunjung bahasa persatuan: Bahasa Indonesia.\n\nLAGU KEBANGSAAN:\nIndonesia Raya pertama kali diperdengarkan oleh W.R. Supratman (biola)."
                    },

                    // ZAMAN KEMERDEKAAN
                    {
                        t: "Pendudukan Jepang (1942-1945)",
                        c: "PROPAGANDA 3A:\nJepang Cahaya, Pelindung, Pemimpin Asia.\n\nDAMPAK NEGATIF:\n- Romusha (Kerja Paksa)\n- Kelaparan & Perampasan hasil bumi\n\nDAMPAK POSITIF:\n- Pelatihan Militer (PETA, Heiho)\n- Penggunaan Bahasa Indonesia\n- Pembentukan BPUPKI & PPKI."
                    },
                    {
                        t: "Perumusan Dasar Negara (BPUPKI)",
                        c: "SIDANG BPUPKI:\nMerumuskan dasar negara Indonesia Merdeka.\n\nLAHIRNYA PANCASILA (1 Juni 1945):\nPidato Ir. Soekarno mengusulkan 5 sila dasar.\n\nPIAGAM JAKARTA (22 Juni):\nRumusan awal Pancasila oleh Panitia Sembilan. Sila 1 kemudian diubah demi persatuan bangsa."
                    },
                    {
                        t: "Proklamasi Kemerdekaan",
                        c: "PERISTIWA RENGASDENGKLOK:\nGolongan Muda menculik Soekarno-Hatta agar segera memproklamasikan kemerdekaan, lepas dari pengaruh Jepang.\n\nDETIK-DETIK PROKLAMASI:\n- Tanggal: 17 Agustus 1945, pukul 10.00 WIB.\n- Lokasi: Jl. Pegangsaan Timur 56, Jakarta.\n- Bendera: Dijahit Fatmawati.\n- Teks: Diketik Sayuti Melik."
                    },
                    {
                        t: "Pertempuran 10 November",
                        c: "LOKASI:\nSurabaya. Perang terbuka terbesar pasca kemerdekaan melawan Sekutu (Inggris).\n\nPENYEBAB:\nTewasnya Jenderal Mallaby dan ultimatum Inggris agar rakyat menyerahkan senjata.\n\nTOKOH:\nBung Tomo (Membakar semangat lewat radio). Diperingati sebagai Hari Pahlawan."
                    },
                    {
                        t: "Diplomasi Mempertahankan Kemerdekaan",
                        c: "PERJUANGAN MEJA PERUNDINGAN:\n1. Linggarjati: Pengakuan de facto Jawa, Sumatera, Madura.\n2. Renville: Wilayah RI makin sempit.\n3. Roem-Roijen: Gencatan senjata.\n4. KMB (Konferensi Meja Bundar): Belanda mengakui kedaulatan Indonesia (RIS)."
                    },
                    {
                        t: "Republik Indonesia Serikat (RIS)",
                        c: "KONSEP:\nIndonesia berubah menjadi negara serikat/federal hasil KMB (1949). Terdiri dari negara-negara bagian buatan Belanda (Boneka).\n\nKEMBALI KE NKRI (1950):\nRakyat menolak RIS dan menuntut kembali ke Negara Kesatuan Republik Indonesia melalui Mosi Integral Natsir."
                    },

                    // --- TAHUN KEDUA ---
                    // SEMESTER 3 (Zaman Modern & Isu Global)
                    {
                        t: "Demokrasi Liberal (1950-1959)",
                        c: "CIRI KHAS:\n- Sistem Parlementer (PM memimpin pemerintahan, Presiden simbol negara).\n- Banyak Partai Politik.\n- Kabinet Jatuh Bangun (7 Kabinet dalam 9 tahun).\n\nDAMPAK:\nKetidakstabilan politik dan pembangunan terhambat, tapi kebebasan pers tinggi."
                    },
                    {
                        t: "Dekrit Presiden 5 Juli 1959",
                        c: "LATAR BELAKANG:\nKegagalan Konstituante menyusun UUD baru dan ketidakstabilan politik.\n\nISI DEKRIT:\n1. Pembubaran Konstituante.\n2. Kembali ke UUD 1945 (UUDS 1950 tidak berlaku).\n3. Pembentukan MPRS dan DPAS.\n\nMenandai dimulainya Demokrasi Terpimpin."
                    },
                    {
                        t: "Peristiwa G30S/PKI (1965)",
                        c: "TRAGEDI NASIONAL:\nPenculikan dan pembunuhan 6 Jenderal dan 1 Perwira TNI AD pada malam 30 September 1965.\n\nDAMPAK:\n- Krisis politik dan ekonomi.\n- Pembubaran PKI.\n- Lahirnya Supersemar (Surat Perintah 11 Maret).\n- Peralihan kekuasaan dari Orde Lama ke Orde Baru."
                    },
                    {
                        t: "Masa Orde Baru (1966-1998)",
                        c: "KEPEMIMPINAN SOEHARTO:\nFokus pada Stabilitas Politik dan Pertumbuhan Ekonomi (Trilogi Pembangunan).\n\nKEBIJAKAN:\n- Repelita (Rencana Pembangunan Lima Tahun).\n- Swasembada Beras.\n- Keluarga Berencana (KB).\n- Dwifungsi ABRI.\n\nAKHIR:\nKrisis Moneter 1997 dan Reformasi 1998."
                    },
                    {
                        t: "Reformasi 1998",
                        c: "PENYEBAB:\n- Krisis Ekonomi (Rupiah anjlok).\n- KKN (Korupsi, Kolusi, Nepotisme).\n- Tuntutan Demokrasi Mahasiswa.\n\nAGENDA REFORMASI:\n1. Adili Soeharto & kroninya.\n2. Amandemen UUD 1945.\n3. Otonomi Daerah.\n4. Penghapusan Dwifungsi ABRI.\n5. Kebebasan Pers."
                    },
                    {
                        t: "Sejarah Kontemporer & Globalisasi",
                        c: "TANTANGAN MASA KINI:\n- Revolusi Industri 4.0.\n- Menjaga identitas bangsa di era digital.\n- Toleransi dan Radikalisme.\n- Peran Indonesia di G20 dan kancah global.\n\nSejarah terus berjalan, dan kitalah penulis bab selanjutnya."
                    },

                    // SEMESTER 4 (Sejarah Tematik)
                    {
                        t: "Sejarah Jalur Rempah",
                        c: "JALUR SUTRA MARITIM:\nJaringan rute perdagangan laut kuno yang menghubungkan Timur (Nusantara/China) dan Barat (Eropa/Timur Tengah).\n\nKOMODITAS:\nCengkeh (Ternate), Pala (Ambon), Lada. Dulu harganya lebih mahal dari emas di Eropa.\n\nDAMPAK:\nNusantara menjadi incaran kolonialisme bangsa Eropa."
                    },
                    {
                        t: "Revolusi Industri Dunia",
                        c: "TAHAPAN:\n1.0: Mesin Uap (Abad 18) - Mekanisasi.\n2.0: Listrik & Assembly Line (Abad 19) - Produksi Massal.\n3.0: Komputer & Otomasi (Abad 20) - IT.\n4.0: Cyber-Physical (Sekarang) - IoT, AI, Big Data.\n\nDAMPAK SOSIAL:\nUrbanisasi, perubahan struktur kerja, dan kesenjangan ekonomi."
                    },
                    {
                        t: "Perang Dunia I (1914-1918)",
                        c: "PENYEBAB:\nPembunuhan Pangeran Franz Ferdinand (Austria) dan sistem aliansi negara Eropa.\n\nPIHAK TERLIBAT:\n- Blok Sekutu (Inggris, Perancis, Rusia, AS).\n- Blok Sentral (Jerman, Austria-Hungaria, Ottoman).\n\nAKIBAT:\nRuntuhnya 4 kekaisaran besar dan lahirnya LBB (Liga Bangsa-Bangsa)."
                    },
                    {
                        t: "Perang Dunia II (1939-1945)",
                        c: "PEMICU:\nInvasi Jerman ke Polandia.\n\nPIHAK:\n- Poros (Jerman, Jepang, Italia).\n- Sekutu (AS, Inggris, Uni Soviet, China).\n\nPERISTIWA KUNCI:\n- Holocaust (Genosida Yahudi).\n- Bom Atom Hiroshima & Nagasaki.\n- Lahirnya PBB (Perserikatan Bangsa-Bangsa)."
                    },
                    {
                        t: "Perang Dingin (Cold War)",
                        c: "DEFINISI:\nKetegangan geopolitik antara Blok Barat (AS - Kapitalis) dan Blok Timur (Uni Soviet - Komunis) tanpa perang fisik langsung (1947-1991).\n\nBENTUK PERSAINGAN:\n- Perlombaan Senjata Nuklir.\n- Perlombaan Luar Angkasa (Space Race).\n- Proxy War (Perang Korea, Vietnam).\n- Spionase (CIA vs KGB)."
                    },
                    {
                        t: "Konferensi Asia Afrika (KAA 1955)",
                        c: "LOKASI:\nGedung Merdeka, Bandung.\n\nTUJUAN:\nMempererat solidaritas negara-negara Asia-Afrika melawan kolonialisme dan neokolonialisme.\n\nHASIL:\nDasasila Bandung. Menjadi cikal bakal Gerakan Non-Blok (GNB).\n\nPERAN INDONESIA:\nTuan rumah dan pelopor (PM Ali Sastroamidjojo)."
                    },

                    // SEMESTER 5 (Sejarah Diplomasi & Regional)
                    {
                        t: "Gerakan Non-Blok (GNB)",
                        c: "PRINSIP:\nTidak memihak Blok Barat maupun Blok Timur dalam Perang Dingin.\n\nPENDIRI:\nSoekarno (Indonesia), Tito (Yugoslavia), Nasser (Mesir), Nehru (Mesir), Nkrumah (Ghana).\n\nTUJUAN:\nMeredakan ketegangan dunia dan memperjuangkan kemerdekaan negara terjajah."
                    },
                    {
                        t: "Sejarah ASEAN",
                        c: "PENDIRIAN:\n8 Agustus 1967 di Bangkok. Oleh 5 Menlu (Adam Malik - Indonesia).\n\nTUJUAN:\nMempercepat pertumbuhan ekonomi, kemajuan sosial, dan perdamaian regional Asia Tenggara.\n\nPRINSIP:\nNon-intervensi (tidak ikut campur urusan dalam negeri anggota)."
                    },
                    {
                        t: "Sejarah Perserikatan Bangsa-Bangsa (PBB)",
                        c: "PENDIRIAN:\n24 Oktober 1945 pasca PD II, menggantikan LBB.\n\nORGAN UTAMA:\n- Majelis Umum\n- Dewan Keamanan (5 Anggota Tetap punya Hak Veto)\n- Mahkamah Internasional\n- Sekretariat.\n\nINDONESIA DI PBB:\nPernah keluar (1965) saat konfrontasi Malaysia, lalu masuk kembali (1966)."
                    },
                    {
                        t: "Integrasi Timor Timur",
                        c: "SEJARAH:\n- 1975: Operasi Seroja, integrasi ke Indonesia (Provinsi ke-27) pasca ditinggal Portugal.\n- 1999: Referendum/Jajak Pendapat di masa Presiden Habibie.\n- Hasil: Mayoritas memilih merdeka -> Lepas menjadi negara Timor Leste."
                    },
                    {
                        t: "Konflik Laut China Selatan",
                        c: "ISU UTAMA:\nKlaim tumpang tindih wilayah perairan dan kepulauan (Spratly & Paracel) oleh China, Vietnam, Filipina, Malaysia, Brunei.\n\nPOSISI INDONESIA:\nBukan negara pengklaim (non-claimant), namun menjaga kedaulatan ZEE di Natuna Utara berdasarkan UNCLOS 1982."
                    },
                    {
                        t: "Sejarah Palestina & Israel",
                        c: "AKAR KONFLIK:\nPerebutan wilayah tanah suci pasca runtuhnya Ottoman dan Mandat Inggris (1948). Deklarasi negara Israel memicu perang Arab-Israel.\n\nISU KUNCI:\nStatus Yerusalem, perbatasan, pengungsi, dan permukiman ilegal.\n\nSIKAP RI:\nMendukung kemerdekaan Palestina (Solusi Dua Negara)."
                    },

                    // SEMESTER 6 (Sejarah Kebudayaan & Sosial)
                    {
                        t: "Sistem Subak Bali (Warisan Dunia)",
                        c: "DEFINISI:\nSistem pengairan sawah (irigasi) tradisional Bali yang berbasis masyarakat dan filosofi Tri Hita Karana (Tuhan, Manusia, Alam).\n\nNILAI:\nDemokratis, adil, dan egaliter. Petani di hilir tetap mendapat air meski di hulu bisa memonopoli. Diakui UNESCO 2012."
                    },
                    {
                        t: "Sejarah Batik Indonesia",
                        c: "MAKNA:\nSeni melukis kain dengan lilin (malam). Setiap motif memiliki filosofi (contoh: Parang = kekuasaan/raja).\n\nPENGAKUAN:\nUNESCO menetapkan Batik sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi pada 2 Oktober 2009 (Hari Batik Nasional)."
                    },
                    {
                        t: "Sejarah Bahasa Indonesia",
                        c: "ASAL USUL:\nBerasal dari Bahasa Melayu Riau (Lingua Franca perdagangan Nusantara).\n\nSUMPAH PEMUDA:\nDiangkat menjadi bahasa persatuan, bukan bahasa Jawa (mayoritas) demi kesetaraan.\n\nPERKEMBANGAN:\nEjaan Van Ophuijsen -> Soewandi -> EYD -> PUEBI."
                    },
                    {
                        t: "Gerakan Emansipasi Wanita",
                        c: "TOKOH:\n- R.A. Kartini (Jepara): Habis Gelap Terbitlah Terang. Pendidikan wanita.\n- Dewi Sartika (Bandung): Sekolah Istri.\n- Cut Nyak Dien (Aceh): Perjuangan fisik perang.\n- Rasuna Said (Padang): Politik dan Pers.\n\nTUJUAN:\nKesetaraan hak pendidikan dan sosial bagi perempuan."
                    },
                    {
                        t: "Sejarah Pendidikan Nasional",
                        c: "ERA KOLONIAL:\nSekolah hanya untuk bangsawan/Eropa (ELS, HIS, STOVIA).\n\nTAMAN SISWA (1922):\nKi Hajar Dewantara mendirikan sekolah untuk rakyat jelata. Semboyan: Ing Ngarso Sung Tulodo, Ing Madyo Mangun Karso, Tut Wuri Handayani.\n\nERA MERDEKA:\nPendidikan untuk semua (Wajib Belajar)."
                    },
                    {
                        t: "Pelestarian Cagar Budaya",
                        c: "DEFINISI:\nWarisan budaya bersifat kebendaan (Benda, Bangunan, Struktur, Situs, Kawasan) yang perlu dilestarikan.\n\nCONTOH:\nCandi Borobudur, Situs Sangiran, Kota Tua Jakarta.\n\nTANTANGAN:\nPencurian artefak, vandalisme, bencana alam, dan pembangunan modern yang merusak situs."
                    }
                ]
            };

            // ... existing selectMajor, startEntranceExam functions ...

            // --- NEW: LOGIKA SIDANG SKRIPSI (THESIS DEFENSE) ---
            let currentDefense = {
                major: null,
                score: 0,
                qIndex: 0,
                questions: []
            };

            function startThesisDefense(major) {
                currentDefense.major = major;
                currentDefense.score = 0;
                currentDefense.qIndex = 0;
                currentDefense.questions = [...THESIS_DB[major]];

                // Acak urutan soal sidang agar tidak hapalan mati
                currentDefense.questions.sort(() => Math.random() - 0.5);

                showDialogue("DOSEN PENGUJI UTAMA",
                    "Selamat datang di Sidang Akhir Skripsi. \n\nSaya akan mengajukan **5 Pertanyaan Kunci** terkait bidang studimu. \n\nSyarat Kelulusan: **Benar Minimal 4 Soal**. \nJika gagal, kamu harus merevisi draft-mu (mengulang sidang nanti).\n\nApakah kamu siap mempertanggungjawabkan karyamu?",
                    [
                        { text: "SAYA SIAP! (Mulai Sidang)", action: nextDefenseQuestion },
                        { text: "Saya baca buku dulu...", action: closeDialogue }
                    ],
                    'images/lecture.png'
                );
            }

            function nextDefenseQuestion() {
                if (currentDefense.qIndex >= currentDefense.questions.length) {
                    finishDefense();
                    return;
                }

                const qData = currentDefense.questions[currentDefense.qIndex];

                const opts = qData.opts.map(opt => {
                    return {
                        text: opt,
                        action: () => answerDefense(opt === qData.a)
                    };
                });

                // Acak posisi jawaban
                opts.sort(() => Math.random() - 0.5);

                // Tampilkan Soal
                showDialogue(
                    `SIDANG SKRIPSI (${currentDefense.qIndex + 1}/5)`,
                    `PERTANYAAN PENGUJI:\n\n**"${qData.q}"**`,
                    opts,
                    'images/lecture.png'
                );
            }

            function answerDefense(isCorrect) {
                if (isCorrect) {
                    currentDefense.score++;
                    showToast("Penguji Mengangguk... (Benar) ✅");
                } else {
                    showToast("Penguji Mengerutkan Dahi... (Salah) ❌");
                    // Hukuman mental (Energy turun dikit)
                    STATE.player.energy = Math.max(0, STATE.player.energy - 5);
                }

                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                currentDefense.qIndex++;
                setTimeout(() => nextDefenseQuestion(), 800);
            }

            function finishDefense() {
                const passed = currentDefense.score >= 4; // Syarat: Benar 4 dari 5

                if (passed) {
                    let reaction = `Nilai Sidang: **${currentDefense.score * 20}** (A).\n\nSelamat! Kamu berhasil mempertahankan skripsimu dengan sangat baik. \n\nSaya dengan bangga menyatakan kamu **LULUS SIDANG SKRIPSI**!`;
                    if (currentDefense.score === 5) reaction += "\n(Nilai Sempurna! Dosen terkesan!)";

                    showDialogue("DOSEN PEMBIMBING", reaction, [{
                        text: "Alhamdulillah! (Terima Ijazah & Gelar)",
                        action: () => {
                            // CONSUME DRAFT
                            if (STATE.player.inventory['draft_proposal'] > 0) {
                                STATE.player.inventory['draft_proposal']--;
                                if (STATE.player.inventory['draft_proposal'] <= 0) delete STATE.player.inventory['draft_proposal'];
                            }

                            // BERI HADIAH KELULUSAN
                            addItem('buku_tesis', 1);

                            const major = currentDefense.major;
                            if (major === 'teknologi') {
                                addItem('ijazah_teknologi', 1);
                            } else {
                                addItem('ijazah_sejarah', 1);
                            }

                            STATE.player.reputation += 50;
                            STATE.player.money += 5000;
                            gainExp(5000);

                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                            closeDialogue();

                            // 🎬 CINEMATIC WISUDA
                            setTimeout(() => {
                                const isScholar = STATE.player.scholarship || false;
                                playCutsceneWisuda(major, isScholar, () => {
                                    // Setelah wisuda, tampilkan toast selamat & update mentor
                                    const gelar = major === 'teknologi' ? 'S.Kom' : 'S.Hum';
                                    showToast(`🎓 Selamat ${gelar}! Kamu telah wisuda!`);
                                    if (typeof updateMentorBubble === 'function') updateMentorBubble();
                                    // Confetti game partikel tambahan
                                    for (let i = 0; i < 30; i++) {
                                        const angle = Math.random() * Math.PI * 2;
                                        STATE.particles.push({
                                            x: STATE.player.x, y: STATE.player.y,
                                            vx: Math.cos(angle) * (2 + Math.random() * 5),
                                            vy: Math.sin(angle) * (2 + Math.random() * 5),
                                            life: 50 + Math.random() * 30,
                                            color: ['#fbbf24','#86efac','#f9a8d4','#ffffff'][Math.floor(Math.random()*4)]
                                        });
                                    }
                                });
                            }, 500);
                        }
                    }], 'images/lecture.png');
                } else {
                    showDialogue("DOSEN PENGUJI",
                        `Skor: ${currentDefense.score}/5. (Tidak Lulus)\n\nMaaf, penguasaan materimu masih kurang. Jawabanmu banyak yang meleset dari teori.\n\n**STATUS: REVISI MAJOR**\nSilakan pelajari lagi materinya dan ajukan sidang ulang nanti.`,
                        [{
                            text: "Siap Pak, saya akan belajar lagi. (Energy -30)", action: () => {
                                STATE.player.energy = Math.max(0, STATE.player.energy - 30);
                                closeDialogue();
                            }
                        }],
                        'images/lecture.png'
                    );
                }
            }

            function finalizeRoleSetup() {
                updateHUDInfo();

                // UPDATE: Karena penjelasan fitur sudah di awal (startWakeUpSequence), 
                // Mentor Budi sekarang hanya memberikan motivasi penutup agar tidak repetitif.
                showDialogue(STATE.mentorName,
                    "Persiapan selesai! Status dasarmu telah ditetapkan.\n\nIngat pesan saya: Rajinlah menulis **Jurnal Refleksi** setiap hari di rumah agar Gurumu bisa menilai perkembanganmu.",
                    [{
                        text: "Siap, Terima Kasih Mentor!",
                        action: () => {
                            // FIX: KEMBALIKAN MENTOR KE POSISI ASAL (HILANG DARI DEPAN RUMAH)
                            // Agar tidak menghalangi jalan atau terlihat aneh setelah tutorial selesai
                            const villMap = maps['village'];
                            const mentor = villMap.npcs.find(n => n.id === 'mentor');
                            if (mentor) {
                                // UPDATE: Pindahkan ke -99 (Hilang dari map desa)
                                mentor.x = -99;
                                mentor.y = -99;
                                // Reset kecepatan gerak jika perlu
                                mentor.vx = 0;
                                mentor.vy = 0;
                            }

                            // FIX: BUKA KUNCI JURNAL (Akhiri Status Prologue)
                            STATE.isPrologue = false;

                            closeDialogue();

                            // FIX: SIMPAN ULANG SETELAH DIALOG DITUTUP (DATA FINAL)
                            manualSave();

                            // Optional: Buka jurnal untuk Worker/Other roles agar sadar misi
                            setTimeout(() => showDailyQuestPopup(), 500);
                        }
                    }],
                    'images/mentor.png'
                );
            }

            function updateHUDInfo() {
                const p = STATE.player;
                const name = DataService.user ? DataService.user.name : "Player";

                // Update Name & Level
                let roleDisplay = "?";
                if (p.role !== 'none') {
                    roleDisplay = p.role.toUpperCase();
                    // Tampilkan jurusan jika ada
                    if (p.role === 'student' && p.major) {
                        roleDisplay += ` (${p.major.substring(0, 3).toUpperCase()})`;
                    }
                }

                // Tampilkan di area nama atau tooltip (opsional, saat ini pakai nama saja di UI)
                document.getElementById('hud-name').innerText = name.length > 8 ? name.substring(0, 6) + ".." : name;
                document.getElementById('level-display').innerText = p.level;

                // FIX: UPDATE MONEY DISPLAY AGAR SINKRON
                // Menggunakan locale 'id-ID' agar format ribuan menggunakan titik (contoh: 36.000)
                document.getElementById('money-display').innerText = p.money.toLocaleString('id-ID');

                // Update Bars Width
                const hpPct = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
                const enPct = Math.max(0, Math.min(100, (p.energy / 100) * 100)); // Energy max is static 100 usually
                const expPct = Math.max(0, Math.min(100, (p.exp / p.maxExp) * 100));

                // UPDATE: TARGET ELEMENT HUD BARU
                const hudHpBar = document.getElementById('hud-hp-bar');
                if (hudHpBar) hudHpBar.style.width = hpPct + "%";

                document.getElementById('energy-bar').style.width = enPct + "%";
                document.getElementById('exp-bar').style.width = expPct + "%";

                // Text inside bars
                const hudHpText = document.getElementById('hud-hp-text');
                if (hudHpText) hudHpText.innerText = Math.floor(p.hp);

                document.getElementById('energy-text').innerText = Math.floor(p.energy);

                // UPDATE: HAPUS LOGIKA COMBAT HUD LAMA
                /*
                const combatHud = document.getElementById('combat-hud');
                if(STATE.location === 'dungeon') {
                    combatHud.style.display = 'flex';
                } else {
                    combatHud.style.display = 'none';
                }
                */

                // ALWAYS UPDATE BAG ICON
                updateBagIcon();
            }

            // --- NEW FUNCTION: UPDATE BAG ICON ---
            function updateBagIcon() {
                const inv = STATE.player.inventory || {};
                // Hitung total item yang jumlahnya > 0
                let totalItems = 0;
                for (let key in inv) {
                    if (inv[key] > 0) totalItems += inv[key];
                }

                const bagBtn = document.getElementById('bag-btn');
                if (totalItems > 0) {
                    bagBtn.style.backgroundImage = "url('images/tas-isi.png')";
                } else {
                    bagBtn.style.backgroundImage = "url('images/tas-kosong.png')";
                }
            }

