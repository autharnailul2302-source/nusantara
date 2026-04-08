            // --- NEW: SISTEM UJIAN MASUK KULIAH (EXAM SYSTEM) ---
            let currentExam = {
                major: null,
                score: 0,
                qIndex: 0,
                questions: [],
                timer: 0,      // NEW: Timer
                interval: null // NEW: Interval ID
            };

            // Database Soal (UPDATE: DITAMBAH JADI 10 SOAL LENGKAP PER JURUSAN)
            const EXAM_DB = {
                'teknologi': [
                    // MUDAH
                    { q: "Otak utama komputer yang memproses semua instruksi adalah?", a: "CPU", opts: ["CPU", "GPU", "Harddisk"] },
                    { q: "Apa kepanjangan dari RAM?", a: "Random Access Memory", opts: ["Read Access Memory", "Random Access Memory", "Run All Memory"] },
                    { q: "Sistem bilangan yang hanya menggunakan angka 0 dan 1 disebut?", a: "Biner", opts: ["Desimal", "Biner", "Heksadesimal"] },
                    { q: "Mana yang termasuk perangkat OUTPUT?", a: "Monitor", opts: ["Keyboard", "Mouse", "Monitor"] },
                    { q: "Tombol pintas (shortcut) untuk menyalin data adalah?", a: "Ctrl + C", opts: ["Ctrl + V", "Ctrl + C", "Ctrl + X"] },
                    { q: "Sistem operasi open-source berlambang penguin adalah?", a: "Linux", opts: ["Windows", "MacOS", "Linux"] },
                    { q: "Jaringan komputer global yang menghubungkan seluruh dunia adalah?", a: "Internet", opts: ["Intranet", "Internet", "Ethernet"] },
                    { q: "Komponen penyuplai daya listrik ke seluruh bagian PC adalah?", a: "Power Supply", opts: ["VGA Card", "Motherboard", "Power Supply"] },
                    { q: "Perangkat lunak berbahaya yang bertujuan merusak sistem disebut?", a: "Malware", opts: ["Software", "Hardware", "Malware"] },
                    { q: "Proses mematikan dan menghidupkan ulang komputer disebut?", a: "Restart", opts: ["Shutdown", "Sleep", "Restart"] },
                    // SEDANG
                    { q: "Protokol jaringan yang mengatur pengalamatan IP versi 6 menggunakan berapa bit?", a: "128 bit", opts: ["32 bit", "64 bit", "128 bit"] },
                    { q: "Tipe data yang hanya menyimpan nilai TRUE atau FALSE disebut?", a: "Boolean", opts: ["Integer", "Boolean", "Float"] },
                    { q: "Metode enkripsi yang menggunakan dua kunci (publik & privat) disebut?", a: "Asymmetric Encryption", opts: ["Symmetric Encryption", "Asymmetric Encryption", "Hashing"] },
                    { q: "Berapa nilai maksimum sebuah byte (8 bit) dalam desimal?", a: "255", opts: ["128", "255", "512"] },
                    { q: "Format file yang digunakan untuk database relasional yang paling umum adalah?", a: "SQL", opts: ["CSV", "JSON", "SQL"] },
                    { q: "Konsep pemrograman yang membungkus data dan fungsi dalam satu unit disebut?", a: "Encapsulation", opts: ["Inheritance", "Encapsulation", "Abstraction"] },
                    { q: "Shortcut keyboard untuk membuka Task Manager di Windows adalah?", a: "Ctrl + Shift + Esc", opts: ["Ctrl + Alt + Del", "Ctrl + Shift + Esc", "Win + R"] },
                    { q: "Proses mengubah kode sumber menjadi kode mesin disebut?", a: "Kompilasi", opts: ["Interpretasi", "Kompilasi", "Debugging"] },
                    { q: "Protokol keamanan yang mengenkripsi komunikasi website (https://) adalah?", a: "TLS/SSL", opts: ["FTP", "TLS/SSL", "HTTP"] },
                    { q: "Tipe serangan siber yang menipu pengguna agar mengklik tautan palsu disebut?", a: "Phishing", opts: ["Ransomware", "Phishing", "Brute Force"] },
                    // SULIT
                    { q: "Dalam konsep OOP, kemampuan kelas anak mewarisi sifat kelas induk disebut?", a: "Inheritance", opts: ["Polymorphism", "Inheritance", "Encapsulation"] },
                    { q: "Algoritma pengurutan tercepat secara rata-rata dengan kompleksitas O(n log n) adalah?", a: "Merge Sort", opts: ["Bubble Sort", "Merge Sort", "Insertion Sort"] },
                    { q: "Dalam jaringan, subnet mask 255.255.255.0 berarti ada berapa host yang tersedia?", a: "254 host", opts: ["256 host", "254 host", "128 host"] },
                    { q: "Perbedaan utama antara proses dan thread dalam sistem operasi adalah?", a: "Thread berbagi memori proses induk; proses tidak", opts: ["Thread berbagi memori proses induk; proses tidak", "Proses lebih cepat dari thread", "Thread tidak bisa berjalan bersamaan"] },
                    { q: "Teknologi virtualisasi container yang populer untuk deployment aplikasi adalah?", a: "Docker", opts: ["VMware", "Docker", "Kubernetes"] },
                    { q: "Query SQL untuk menggabungkan dua tabel berdasarkan kolom yang sama disebut?", a: "JOIN", opts: ["UNION", "JOIN", "MERGE"] },
                    { q: "Dalam keamanan jaringan, serangan Man-in-the-Middle (MITM) bertujuan untuk?", a: "Menyadap komunikasi dua pihak", opts: ["Membanjiri server", "Menyadap komunikasi dua pihak", "Mencuri password langsung"] },
                    { q: "Notasi Big-O untuk algoritma yang waktu eksekusinya konstan (tidak bergantung input) adalah?", a: "O(1)", opts: ["O(n)", "O(1)", "O(log n)"] },
                    { q: "Dalam Git, perintah untuk menggabungkan branch fitur ke branch utama adalah?", a: "git merge", opts: ["git push", "git merge", "git commit"] },
                    { q: "Konsep keamanan '3 pilar CIA' dalam siber meliputi Confidentiality, Integrity, dan?", a: "Availability", opts: ["Authentication", "Availability", "Authorization"] }
                ],
                'sejarah': [
                    // MUDAH
                    { q: "Peristiwa penculikan Soekarno-Hatta ke luar kota disebut?", a: "Rengasdengklok", opts: ["Bandung Lautan Api", "Rengasdengklok", "G30S"] },
                    { q: "Organisasi pergerakan nasional pertama yang berdiri tahun 1908 adalah?", a: "Budi Utomo", opts: ["Sarekat Islam", "Budi Utomo", "Indische Partij"] },
                    { q: "Naskah Sumpah Pemuda dibacakan pada tanggal?", a: "28 Oktober 1928", opts: ["17 Agustus 1945", "28 Oktober 1928", "1 Juni 1945"] },
                    { q: "Patih Majapahit yang terkenal dengan Sumpah Palapa adalah?", a: "Gajah Mada", opts: ["Hayam Wuruk", "Gajah Mada", "Ken Arok"] },
                    { q: "Perusahaan dagang Belanda yang memonopoli rempah-rempah adalah?", a: "VOC", opts: ["EIC", "VOC", "NATO"] },
                    { q: "Kerajaan Hindu tertua di Indonesia adalah?", a: "Kutai", opts: ["Tarumanegara", "Kutai", "Sriwijaya"] },
                    { q: "Perang Diponegoro berlangsung di pulau?", a: "Jawa", opts: ["Sumatera", "Jawa", "Sulawesi"] },
                    { q: "Jepang pertama kali mendarat di Indonesia pada tahun?", a: "1942", opts: ["1941", "1942", "1945"] },
                    { q: "Ibukota Indonesia pernah dipindahkan ke Yogyakarta pada tahun?", a: "1946", opts: ["1945", "1946", "1949"] },
                    { q: "Penjahit bendera Merah Putih pertama adalah?", a: "Fatmawati", opts: ["Kartini", "Cut Nyak Dien", "Fatmawati"] },
                    // SEDANG
                    { q: "Sistem tanam paksa (Cultuurstelsel) di Indonesia diterapkan oleh Gubernur Jenderal?", a: "Van den Bosch", opts: ["Daendels", "Van den Bosch", "Raffles"] },
                    { q: "Perjanjian yang mengakui kemerdekaan Indonesia secara de jure tahun 1949 adalah?", a: "KMB (Konferensi Meja Bundar)", opts: ["Perjanjian Linggarjati", "KMB (Konferensi Meja Bundar)", "Perjanjian Renville"] },
                    { q: "Kerajaan Sriwijaya berpusat di wilayah yang sekarang menjadi provinsi?", a: "Sumatera Selatan", opts: ["Sumatera Barat", "Sumatera Selatan", "Riau"] },
                    { q: "Serangan Umum 1 Maret 1949 di Yogyakarta dipimpin oleh?", a: "Soeharto", opts: ["Jenderal Sudirman", "Soeharto", "Sri Sultan HB IX"] },
                    { q: "Kebijakan 'Pintu Terbuka' (Open Door Policy) di Hindia Belanda diterapkan sejak?", a: "1870", opts: ["1830", "1870", "1900"] },
                    { q: "Peristiwa nasionalisasi perusahaan Belanda di Indonesia terjadi pada masa Presiden?", a: "Soekarno", opts: ["Soeharto", "Soekarno", "Habibie"] },
                    { q: "Nama asli Pangeran Diponegoro sebelum bergelar Pangeran adalah?", a: "Mustahar / Ontowiryo", opts: ["Raden Ontowiryo", "Raden Mas Said", "Raden Rangga"] },
                    { q: "Kongres Pemuda II yang melahirkan Sumpah Pemuda diselenggarakan di kota?", a: "Batavia (Jakarta)", opts: ["Surabaya", "Batavia (Jakarta)", "Bandung"] },
                    { q: "Armada laut Kerajaan Majapahit berhasil menguasai Nusantara di bawah pimpinan?", a: "Laksamana Nala", opts: ["Adityawarman", "Laksamana Nala", "Mpu Prapanca"] },
                    { q: "Kebijakan Deklarasi Djuanda tahun 1957 mempertegas bahwa Indonesia adalah negara?", a: "Kepulauan (Nusantara)", opts: ["Federal", "Kepulauan (Nusantara)", "Serikat"] },
                    // SULIT
                    { q: "Pemberontakan PRRI/Permesta tahun 1958 terjadi karena ketidakpuasan daerah terhadap pemerintah pusat dalam hal?", a: "Distribusi kekuasaan dan keuangan", opts: ["Agama dan budaya", "Distribusi kekuasaan dan keuangan", "Kebijakan pertahanan militer"] },
                    { q: "Konsep 'Bhinneka Tunggal Ika' berasal dari kitab kakawin karangan Mpu Tantular berjudul?", a: "Sutasoma", opts: ["Negarakertagama", "Sutasoma", "Pararaton"] },
                    { q: "Sistem ekonomi 'Demokrasi Terpimpin' Soekarno pada 1959 menggantikan sistem ekonomi?", a: "Sistem parlementer liberal", opts: ["Ekonomi terpusat Soviet", "Sistem parlementer liberal", "Ekonomi pasar bebas Barat"] },
                    { q: "Perjanjian Bongaya tahun 1667 yang melemahkan Kerajaan Gowa ditandatangani dengan?", a: "VOC (Belanda)", opts: ["Inggris", "VOC (Belanda)", "Portugis"] },
                    { q: "Dalam Perang Dunia II, Konferensi Postdam 1945 memutuskan bahwa Jepang menyerah kepada?", a: "Sekutu (Allied Forces)", opts: ["Amerika Serikat saja", "Sekutu (Allied Forces)", "Soviet dan Amerika"] },
                    { q: "Kebijakan politik luar negeri Indonesia yang 'bebas aktif' pertama kali dicetuskan oleh?", a: "Hatta (1948)", opts: ["Soekarno", "Hatta (1948)", "Agus Salim"] },
                    { q: "Peristiwa pemberontakan komunis pertama di Indonesia yang gagal terjadi pada tahun?", a: "1926", opts: ["1948", "1926", "1965"] },
                    { q: "Kitab Negarakertagama yang menggambarkan kejayaan Majapahit ditulis oleh?", a: "Mpu Prapanca", opts: ["Mpu Tantular", "Mpu Prapanca", "Mpu Kanwa"] },
                    { q: "Operasi Trikora tahun 1961 bertujuan untuk merebut kembali wilayah?", a: "Irian Barat (Papua)", opts: ["Timor Timur", "Irian Barat (Papua)", "Kalimantan Utara"] },
                    { q: "Krisis ekonomi parah yang memicu reformasi 1998 di Indonesia disebabkan utamanya oleh?", a: "Krisis moneter Asia & utang luar negeri", opts: ["Korupsi pejabat lokal", "Krisis moneter Asia & utang luar negeri", "Bencana alam besar-besaran"] }
                ]
            };

            // --- NEW: DATABASE SOAL KUIS TKJ (INTERAKSI BANGKU KAMPUS) ---
            const TKJ_QUIZ_DB = [
                // MUDAH
                { q: "Kepanjangan dari TKJ adalah?", a: "Teknik Komputer dan Jaringan", opts: ["Teknik Komputer dan Jaringan", "Teknologi Kecepatan Jaringan", "Teknik Komunikasi Jaringan"] },
                { q: "Perangkat yang menghubungkan dua jaringan berbeda segmen adalah?", a: "Router", opts: ["Switch", "Hub", "Router"] },
                { q: "Urutan warna kabel UTP tipe Straight pada pin 1 adalah?", a: "Putih Orange", opts: ["Putih Hijau", "Putih Orange", "Putih Biru"] },
                { q: "Port default untuk layanan HTTP web server adalah?", a: "80", opts: ["21", "80", "443"] },
                { q: "Perintah CLI di Windows untuk memeriksa konektivitas jaringan adalah?", a: "Ping", opts: ["Ping", "Ipconfig", "Tracert"] },
                { q: "Layer OSI ke-1 yang berhubungan dengan kabel dan sinyal listrik adalah?", a: "Physical Layer", opts: ["Network Layer", "Data Link Layer", "Physical Layer"] },
                { q: "IP Address 192.168.10.1 termasuk dalam kelas IP?", a: "C", opts: ["A", "B", "C"] },
                { q: "Server yang menerjemahkan nama domain menjadi IP Address adalah?", a: "DNS Server", opts: ["DHCP Server", "DNS Server", "FTP Server"] },
                { q: "Topologi jaringan dimana setiap node terhubung ke satu perangkat pusat disebut?", a: "Star", opts: ["Bus", "Ring", "Star"] },
                { q: "Protokol standar untuk mengirim email adalah?", a: "SMTP", opts: ["POP3", "IMAP", "SMTP"] },
                { q: "Alat untuk memasang konektor RJ45 ke kabel UTP disebut?", a: "Tang Crimping", opts: ["Tang Potong", "Tang Crimping", "Obeng"] },
                { q: "Jenis kabel yang menggunakan serat kaca untuk transmisi data via cahaya adalah?", a: "Fiber Optic", opts: ["Coaxial", "Fiber Optic", "Twisted Pair"] },
                // SEDANG
                { q: "VLAN (Virtual LAN) digunakan untuk?", a: "Memisahkan segmen jaringan secara logis", opts: ["Mempercepat koneksi internet", "Memisahkan segmen jaringan secara logis", "Mengenkripsi data jaringan"] },
                { q: "Perintah Linux untuk melihat daftar file dan folder di direktori aktif adalah?", a: "ls", opts: ["dir", "ls", "cd"] },
                { q: "Berapa jumlah bit dalam satu alamat IPv4?", a: "32 bit", opts: ["16 bit", "32 bit", "64 bit"] },
                { q: "Protokol yang digunakan untuk transfer file secara aman via SSH adalah?", a: "SFTP", opts: ["FTP", "SFTP", "HTTP"] },
                { q: "Dalam OSI model, layer yang bertanggung jawab untuk enkripsi dan format data adalah?", a: "Presentation Layer", opts: ["Application Layer", "Presentation Layer", "Session Layer"] },
                { q: "Tipe kabel UTP Crossover digunakan untuk menghubungkan?", a: "PC ke PC langsung (peer-to-peer)", opts: ["PC ke Switch", "PC ke PC langsung (peer-to-peer)", "Router ke Switch"] },
                { q: "Fungsi utama DHCP Server dalam jaringan adalah?", a: "Memberikan IP address otomatis ke client", opts: ["Mengatur akses internet", "Memberikan IP address otomatis ke client", "Memfilter konten website"] },
                { q: "Proses enkripsi dua arah yang membutuhkan kunci untuk dekripsi disebut?", a: "Encryption", opts: ["Hashing", "Encryption", "Compression"] },
                { q: "Perintah untuk melihat konfigurasi IP di Linux adalah?", a: "ifconfig / ip addr", opts: ["ipconfig", "ifconfig / ip addr", "netstat"] },
                { q: "Topologi jaringan yang paling toleran terhadap kegagalan node adalah?", a: "Mesh", opts: ["Bus", "Star", "Mesh"] },
                // SULIT
                { q: "Dalam subnetting, berapa jumlah subnet yang bisa dibuat dari network 192.168.1.0/26?", a: "4 subnet", opts: ["2 subnet", "4 subnet", "8 subnet"] },
                { q: "Firewall yang bekerja di layer aplikasi dan dapat memfilter konten disebut?", a: "Application Layer Firewall (WAF)", opts: ["Packet Filter", "Stateful Firewall", "Application Layer Firewall (WAF)"] },
                { q: "Protokol routing yang menggunakan algoritma Dijkstra untuk menentukan jalur terpendek adalah?", a: "OSPF", opts: ["RIP", "OSPF", "BGP"] },
                { q: "Teknik serangan jaringan yang memalsukan ARP reply untuk menyadap traffic disebut?", a: "ARP Spoofing / Poisoning", opts: ["IP Spoofing", "ARP Spoofing / Poisoning", "DNS Hijacking"] },
                { q: "Dalam protokol TCP, 'Three-Way Handshake' terdiri dari urutan?", a: "SYN → SYN-ACK → ACK", opts: ["SYN → ACK → FIN", "SYN → SYN-ACK → ACK", "HELLO → REPLY → CONFIRM"] },
                { q: "Teknologi NAT (Network Address Translation) berfungsi untuk?", a: "Menerjemahkan IP privat ke publik", opts: ["Mengenkripsi paket data", "Menerjemahkan IP privat ke publik", "Mempercepat routing"] },
                { q: "Dalam konfigurasi RAID, tipe RAID yang memberikan redundancy penuh (mirroring) adalah?", a: "RAID 1", opts: ["RAID 0", "RAID 1", "RAID 5"] },
                { q: "Perbedaan utama antara protokol TCP dan UDP adalah?", a: "TCP connection-oriented, UDP connectionless", opts: ["TCP lebih cepat dari UDP", "TCP connection-oriented, UDP connectionless", "UDP lebih aman dari TCP"] },
                { q: "Command 'tracert' (Windows) / 'traceroute' (Linux) digunakan untuk?", a: "Melacak jalur paket data ke tujuan", opts: ["Melihat IP aktif di jaringan", "Melacak jalur paket data ke tujuan", "Mengukur kecepatan internet"] }
            ];

            // --- NEW FUNCTION: START TKJ QUIZ ---
            function startTKJStudy() {
                // Cek Energi
                if (STATE.player.energy < 10) {
                    showToast("Terlalu lelah untuk belajar... (Butuh 10 Energi)");
                    return;
                }

                // Ambil soal acak
                const quiz = TKJ_QUIZ_DB[Math.floor(Math.random() * TKJ_QUIZ_DB.length)];

                // Buat opsi jawaban
                const options = quiz.opts.map(opt => ({
                    text: opt,
                    action: () => {
                        if (opt === quiz.a) {
                            // Jawaban Benar
                            STATE.player.energy -= 10;
                            STATE.player.int += 1; // Naikkan INT
                            gainExp(25); // EXP Lumayan

                            showToast("Benar! INT +1, EXP +25");
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            createParticle(STATE.player.x, STATE.player.y, '#3b82f6'); // Partikel Biru (Teknologi)

                            showDialogue("JAWABAN TEPAT! ✅", `Selamat! Jawabanmu benar: **${quiz.a}**.\n\nWawasan TKJ-mu semakin luas.`, [{ text: "Mantap", action: closeDialogue }], 'images/kursimahasiswa.png');
                        } else {
                            // Jawaban Salah
                            STATE.player.energy = Math.max(0, STATE.player.energy - 5); // Penalti energi dikit
                            showToast("Salah... (Energi -5)");
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                            showDialogue("JAWABAN SALAH ❌", `Sayang sekali, jawaban yang benar adalah: **${quiz.a}**.\n\nJangan menyerah, pelajari lagi materinya!`, [{ text: "Tutup", action: closeDialogue }], 'images/kursimahasiswa.png');
                        }
                    }
                }));

                // Acak urutan tombol agar tidak hapalan posisi
                options.sort(() => Math.random() - 0.5);
                options.push({ text: "Nanti saja", action: closeDialogue });

                showDialogue("KUIS DADAKAN TKJ 💻", `**PERTANYAAN:**\n${quiz.q}`, options, 'images/kursimahasiswa.png');
            }

            // --- FUNGSI BARU: SISTEM SELEKSI JURUSAN & BEASISWA (MISSING FIX) ---
            function selectMajor(major) {
                // Tawarkan Jalur Masuk: Reguler vs Beasiswa
                showDialogue("PILIH JALUR MASUK",
                    `Kamu memilih jurusan **${major.toUpperCase()}**.\n\nApakah kamu ingin mencoba Tes Beasiswa?\n(Syarat: Nilai 100/Benar Semua untuk Gratis UKT)`,
                    [
                        {
                            text: "Coba Tes Beasiswa (Gratis)", action: () => {
                                // UPDATE: CEK COOLDOWN JIKA GAGAL (1 MINGGU / 7 HARI)
                                if (STATE.player.lastExamFailDay && (STATE.day - STATE.player.lastExamFailDay < 7)) {
                                    const daysLeft = 7 - (STATE.day - STATE.player.lastExamFailDay);
                                    showDialogue("AKSES DITOLAK",
                                        `Sistem mencatat kamu baru saja gagal tes.\n\nKebijakan kampus mengharuskan jeda 1 MINGGU sebelum ujian ulang.\nSilakan coba lagi dalam **${daysLeft} HARI** atau masuk jalur Reguler.`,
                                        [{ text: "Baiklah", action: closeDialogue }],
                                        'images/lecture.png'
                                    );
                                    return;
                                }
                                startEntranceExam(major);
                            }
                        },
                        { text: "Jalur Reguler (Bayar nanti)", action: () => confirmMajor(major, false) }
                    ],
                    'images/lecture.png'
                );
            }

            function confirmMajor(major, isScholarship) {
                STATE.player.major = major;
                STATE.player.scholarship = isScholarship;

                // Beri Bonus Stat Awal Sesuai Jurusan
                if (major === 'teknologi') {
                    STATE.player.int += 3;
                } else if (major === 'sejarah') {
                    STATE.player.reputation += 5;
                }

                // FIX: SIMPAN DATA JURUSAN SEGERA
                manualSave();

                updateHUDInfo();
                createParticle(STATE.player.x, STATE.player.y, '#3b82f6');
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                if (isScholarship) {
                    // 🎬 CINEMATIC BEASISWA
                    setTimeout(() => {
                        playCutsceneScholarship(major, () => {
                            showToast(`🏆 Selamat! Kamu resmi mahasiswa ${major.toUpperCase()} — BEASISWA PENUH!`);
                            if (typeof updateMentorBubble === 'function') updateMentorBubble();
                        });
                    }, 400);
                } else {
                    // Dialog biasa untuk jalur reguler
                    showDialogue("PENDAFTARAN BERHASIL",
                        `Selamat! Kamu resmi menjadi mahasiswa **${major.toUpperCase()}**.\nStatus: REGULER 💰\n\nJangan lupa siapkan uang untuk UKT tahunan!`,
                        [{ text: "Siap Kuliah!", action: closeDialogue }],
                        'images/lecture.png'
                    );
                }
            }

            function startEntranceExam(major) {
                currentExam.major = major;
                currentExam.score = 0;
                currentExam.qIndex = 0;

                // UPDATE: Ambil 10 soal acak dari DB untuk ujian beasiswa
                if (!EXAM_DB[major]) {
                    console.error("Exam DB missing for", major);
                    return;
                }
                currentExam.questions = [...EXAM_DB[major]].sort(() => Math.random() - 0.5).slice(0, 10);

                // NEW: Set Timer (90 Detik untuk 10 Soal)
                currentExam.timer = 90;

                // NEW: Mulai Interval Timer
                if (currentExam.interval) clearInterval(currentExam.interval);

                currentExam.interval = setInterval(() => {
                    currentExam.timer--;

                    // Update Judul Dialog secara Real-time agar pemain melihat waktu berjalan
                    const titleEl = document.getElementById('dialogue-title');
                    if (titleEl && titleEl.innerText.includes("UJIAN BEASISWA")) {
                        titleEl.innerText = `UJIAN BEASISWA (${currentExam.qIndex + 1}/${currentExam.questions.length}) - ⏱️ ${currentExam.timer}s`;

                        // Warnai merah jika waktu < 10 detik
                        if (currentExam.timer < 10) titleEl.style.color = '#ef4444';
                        else titleEl.style.color = '#fbbf24';
                    }

                    // Cek Waktu Habis
                    if (currentExam.timer <= 0) {
                        clearInterval(currentExam.interval);
                        finishEntranceExam(true); // true = Timeout Triggered
                    }
                }, 1000);

                nextExamQuestion();
            }

            function nextExamQuestion() {
                // Cek apakah soal sudah habis
                if (currentExam.qIndex >= currentExam.questions.length) {
                    finishEntranceExam(); // Normal Finish
                    return;
                }

                const q = currentExam.questions[currentExam.qIndex];
                const opts = q.opts.map(o => ({
                    text: o,
                    action: () => answerExam(o === q.a)
                }));
                // Acak urutan jawaban
                opts.sort(() => Math.random() - 0.5);

                // Tampilkan Dialog dengan Timer di Judul Awal
                showDialogue(
                    `UJIAN BEASISWA (${currentExam.qIndex + 1}/${currentExam.questions.length}) - ⏱️ ${currentExam.timer}s`,
                    q.q,
                    opts,
                    'images/lecture.png'
                );
            }

            function answerExam(isCorrect) {
                if (isCorrect) currentExam.score++;

                // Feedback suara
                if (typeof AudioService !== 'undefined') AudioService.playSFX(isCorrect ? 'item' : 'hit');

                currentExam.qIndex++;
                // Jeda sedikit agar tidak kaget, lalu lanjut
                setTimeout(nextExamQuestion, 500);
            }

            function finishEntranceExam(isTimeout = false) {
                // Stop Timer
                if (currentExam.interval) clearInterval(currentExam.interval);

                // Syarat Beasiswa: Harus Benar Semua (Score == Jumlah Soal)
                const isPerfect = currentExam.score === currentExam.questions.length;

                let title = "";
                let msg = "";
                let options = [];

                // KONDISI 1: WAKTU HABIS
                if (isTimeout) {
                    title = "WAKTU HABIS! ⏰";
                    msg = `Maaf, waktu 90 detik telah berakhir.\nSkor Akhir: ${currentExam.score}/${currentExam.questions.length}.\n\nAnda dianggap **GAGAL** karena tidak menyelesaikan ujian tepat waktu.`;

                    // Hukuman Cooldown
                    STATE.player.lastExamFailDay = STATE.day;
                    manualSave();

                    options = [
                        { text: "Masuk Reguler", action: () => confirmMajor(currentExam.major, false) },
                        { text: "Coba Lagi Minggu Depan", action: closeDialogue }
                    ];
                }
                // KONDISI 2: LULUS SEMPURNA
                else if (isPerfect) {
                    title = "HASIL UJIAN: LULUS! 🏆";
                    msg = `Luar biasa! Skor: ${currentExam.score}/10.\nSisa Waktu: ${currentExam.timer} detik.\n\nJawabanmu sempurna. Kamu berhak mendapatkan **BEASISWA PENUH**.`;

                    options = [
                        { text: "Ambil Beasiswa", action: () => confirmMajor(currentExam.major, true) }
                    ];
                }
                // KONDISI 3: SELESAI TAPI TIDAK SEMPURNA
                else {
                    // NEW: Catat hari kegagalan dan simpan
                    STATE.player.lastExamFailDay = STATE.day;
                    manualSave();

                    title = "HASIL UJIAN: GAGAL ❌";
                    msg = `Skor: ${currentExam.score}/${currentExam.questions.length}.\nMaaf, syarat beasiswa adalah nilai sempurna (10/10).\n\n**Kamu tidak bisa mengambil tes ulang selama 1 MINGGU.**\nSilakan coba lagi minggu depan atau masuk lewat Jalur Reguler.`;

                    options = [
                        { text: "Masuk Reguler", action: () => confirmMajor(currentExam.major, false) },
                        { text: "Belajar Lagi (Minggu Depan)", action: () => {
                            closeDialogue();
                            // 💡 Tampilkan Konsekuensi Nyata setelah gagal ujian
                            setTimeout(() => showKonsekuensi('student_failed_exam'), 300);
                        }}
                    ];
                }

                showDialogue(title, msg, options, 'images/lecture.png');
            }

            // --- NEW: DATABASE SOAL SIDANG SKRIPSI (LEVEL SULIT/ADVANCED) ---
            const THESIS_DB = {
                'teknologi': [
                    { q: "Apa kompleksitas waktu (Big O) terbaik untuk algoritma Binary Search?", a: "O(log n)", opts: ["O(n)", "O(log n)", "O(n^2)"] },
                    { q: "Manakah yang BUKAN merupakan prinsip dasar OOP?", a: "Compilation", opts: ["Encapsulation", "Polymorphism", "Compilation"] },
                    { q: "Serangan siber yang membanjiri server dengan trafik palsu disebut?", a: "DDoS", opts: ["Phishing", "DDoS", "SQL Injection"] },
                    { q: "Protokol standar untuk transfer halaman web aman adalah?", a: "HTTPS", opts: ["FTP", "HTTP", "HTTPS"] },
                    { q: "Database NoSQL yang menyimpan data dalam format Document adalah?", a: "MongoDB", opts: ["MySQL", "PostgreSQL", "MongoDB"] },
                    { q: "Metode pengembangan software Agile yang menggunakan sprint 2 minggu disebut?", a: "Scrum", opts: ["Waterfall", "Scrum", "Kanban"] },
                    { q: "Dalam desain sistem, 'Load Balancer' berfungsi untuk?", a: "Mendistribusikan traffic ke beberapa server", opts: ["Mengenkripsi data", "Mendistribusikan traffic ke beberapa server", "Menyimpan cache database"] },
                    { q: "Teknik optimasi database yang membuat salinan kolom terindeks untuk mempercepat query disebut?", a: "Indexing", opts: ["Normalization", "Indexing", "Partitioning"] },
                    { q: "Dalam arsitektur microservices, komponen yang mengelola autentikasi dan routing API disebut?", a: "API Gateway", opts: ["Load Balancer", "API Gateway", "Message Broker"] },
                    { q: "Teorema CAP dalam sistem terdistribusi menyatakan bahwa sistem hanya bisa menjamin dua dari tiga: Consistency, Availability, dan?", a: "Partition Tolerance", opts: ["Performance", "Partition Tolerance", "Persistence"] },
                    { q: "Teknik keamanan yang memisahkan data input dari perintah SQL untuk mencegah injeksi disebut?", a: "Prepared Statement / Parameterized Query", opts: ["Input Sanitization biasa", "Prepared Statement / Parameterized Query", "Firewall SQL"] },
                    { q: "Dalam machine learning, 'overfitting' terjadi ketika model?", a: "Terlalu hafal data training, buruk di data baru", opts: ["Tidak cukup dilatih", "Terlalu hafal data training, buruk di data baru", "Dataset terlalu besar"] },
                    { q: "Protokol WebSocket berbeda dari HTTP karena WebSocket?", a: "Koneksi persisten dua arah (full-duplex)", opts: ["Lebih cepat untuk file besar", "Koneksi persisten dua arah (full-duplex)", "Menggunakan port 443 saja"] },
                    { q: "Dalam sistem operasi, 'deadlock' terjadi ketika?", a: "Dua proses saling menunggu resource yang dipegang lawannya", opts: ["CPU terlalu panas", "Dua proses saling menunggu resource yang dipegang lawannya", "Memori RAM habis"] },
                    { q: "Perbedaan 'stack' dan 'heap' dalam manajemen memori adalah?", a: "Stack untuk local variables (auto-managed), heap untuk dynamic allocation (manual)", opts: ["Stack lebih besar dari heap", "Stack untuk local variables (auto-managed), heap untuk dynamic allocation (manual)", "Heap lebih cepat dari stack"] }
                ],
                'sejarah': [
                    { q: "Naskah asli Proklamasi Kemerdekaan Indonesia diketik oleh?", a: "Sayuti Melik", opts: ["Sukarni", "Sayuti Melik", "Laksamana Maeda"] },
                    { q: "Kerajaan Hindu tertua di Indonesia yang terletak di Kalimantan Timur adalah?", a: "Kutai", opts: ["Tarumanegara", "Kutai", "Majapahit"] },
                    { q: "Pangeran Diponegoro ditangkap di kota mana pada tahun 1830?", a: "Magelang", opts: ["Yogyakarta", "Magelang", "Semarang"] },
                    { q: "Organisasi militer bentukan Jepang untuk membantu pertahanan adalah?", a: "PETA", opts: ["Putera", "PETA", "Seinendan"] },
                    { q: "Konferensi Meja Bundar (KMB) yang mengakui kedaulatan Indonesia diadakan di?", a: "Den Haag", opts: ["Jakarta", "Den Haag", "Amsterdam"] },
                    { q: "Konsep 'Trisakti' yang dicetuskan Soekarno terdiri dari berdaulat dalam politik, berdikari dalam ekonomi, dan?", a: "Berkepribadian dalam kebudayaan", opts: ["Merdeka dalam militer", "Berkepribadian dalam kebudayaan", "Mandiri dalam pendidikan"] },
                    { q: "Penyebab utama runtuhnya Kerajaan Majapahit menurut sejarawan adalah?", a: "Perang saudara Paregreg + penyebaran Islam", opts: ["Serangan dari Cina", "Perang saudara Paregreg + penyebaran Islam", "Bencana alam besar"] },
                    { q: "Sistem Ekonomi Gerakan Benteng (1950) bertujuan untuk?", a: "Memajukan pengusaha pribumi (bumiputera)", opts: ["Menasionalisasi perusahaan asing", "Memajukan pengusaha pribumi (bumiputera)", "Mengurangi hutang luar negeri"] },
                    { q: "Supersemar (Surat Perintah 11 Maret 1966) merupakan peralihan kekuasaan dari Soekarno kepada?", a: "Letjen Soeharto", opts: ["Sultan HB IX", "Letjen Soeharto", "Jend. A.H. Nasution"] },
                    { q: "Dalam konteks Perang Dingin, Indonesia bergabung dengan negara-negara non-blok melalui?", a: "Konferensi Asia-Afrika Bandung 1955", opts: ["PBB 1950", "Konferensi Asia-Afrika Bandung 1955", "ASEAN 1967"] },
                    { q: "Politik 'Devide et Impera' yang diterapkan Belanda di Nusantara artinya strategi?", a: "Adu domba untuk memecah belah persatuan", opts: ["Kerja paksa untuk pembangunan", "Adu domba untuk memecah belah persatuan", "Monopoli perdagangan rempah"] },
                    { q: "Akar kata 'Nusantara' dalam bahasa Sansekerta terdiri dari 'Nusa' (pulau) dan 'Antara' yang artinya?", a: "Di antara / seberang", opts: ["Besar dan luas", "Di antara / seberang", "Bangsa yang mulia"] },
                    { q: "Reformasi 1998 berhasil menumbangkan Soeharto setelah berkuasa selama?", a: "32 tahun", opts: ["20 tahun", "32 tahun", "40 tahun"] },
                    { q: "Perbedaan mendasar antara Piagam Jakarta (22 Juni 1945) dan Pembukaan UUD 1945 yang disahkan adalah?", a: "Penghapusan kalimat '...dengan kewajiban menjalankan syariat Islam...'", opts: ["Perubahan nama negara", "Penghapusan kalimat '...dengan kewajiban menjalankan syariat Islam...'", "Penambahan sila ke-6 Pancasila"] },
                    { q: "Masa pemerintahan Orde Baru (1966-1998) berhasil mencapai swasembada beras tahun 1984 melalui program?", a: "Revolusi Hijau (Green Revolution)", opts: ["REPELITA (Rencana Lima Tahun)", "Revolusi Hijau (Green Revolution)", "BIMAS dan INMAS"] }
                ]
            };

            // --- NEW: DATABASE UJIAN KOMPETENSI MANAJER (WORKER ROLE) ---
            const MANAGER_EXAM_DB = [
                // MUDAH
                { q: "Apa prinsip dasar manajemen stok barang agar tidak kadaluarsa?", a: "FIFO (First In First Out)", opts: ["LIFO (Last In First Out)", "FIFO (First In First Out)", "Random Selection"] },
                { q: "Jika pelanggan marah karena barang rusak, apa tindakan profesional pertama?", a: "Meminta maaf & dengarkan", opts: ["Meminta maaf & dengarkan", "Menyalahkan ekspedisi", "Mengusir pelanggan"] },
                { q: "Rumus dasar menghitung Laba (Profit) adalah?", a: "Pendapatan - Beban", opts: ["Aset + Hutang", "Pendapatan - Beban", "Modal x Bunga"] },
                { q: "Apa kunci utama dalam memimpin tim gudang?", a: "Komunikasi & Delegasi", opts: ["Otoriter & Keras", "Komunikasi & Delegasi", "Mengerjakan semua sendiri"] },
                { q: "Jika stok fisik tidak sesuai catatan komputer, apa yang terjadi?", a: "Selisih Stok (Shrinkage)", opts: ["Surplus Anggaran", "Selisih Stok (Shrinkage)", "Keuntungan Ganda"] },
                { q: "Etika kerja: Apa yang harus dilakukan jika melihat rekan kerja mencuri barang?", a: "Lapor ke Atasan", opts: ["Ikut mencuri", "Diam saja", "Lapor ke Atasan"] },
                { q: "Apa tujuan utama dari Stock Opname?", a: "Verifikasi fisik barang", opts: ["Menghabiskan anggaran", "Verifikasi fisik barang", "Liburan karyawan"] },
                // SEDANG
                { q: "Apa yang dimaksud dengan KPI (Key Performance Indicator)?", a: "Tolok ukur capaian kinerja karyawan/tim", opts: ["Jenis bonus gaji karyawan", "Tolok ukur capaian kinerja karyawan/tim", "Sistem absensi digital"] },
                { q: "Dalam manajemen risiko, apa prioritas pertama yang harus dilakukan?", a: "Identifikasi dan analisis risiko", opts: ["Langsung mitigasi semua risiko", "Identifikasi dan analisis risiko", "Asuransikan semua aset"] },
                { q: "Metode pengambilan keputusan yang melibatkan seluruh tim untuk mendapat konsensus disebut?", a: "Brainstorming / musyawarah mufakat", opts: ["Voting mayoritas", "Brainstorming / musyawarah mufakat", "Keputusan sepihak atasan"] },
                { q: "Dalam laporan keuangan, 'Arus Kas' (Cash Flow) penting karena?", a: "Menunjukkan likuiditas usaha secara nyata", opts: ["Menunjukkan nilai aset total perusahaan", "Menunjukkan likuiditas usaha secara nyata", "Digunakan untuk promosi ke bank"] },
                { q: "Teknik manajemen waktu yang membagi tugas jadi: Penting-Mendesak, Penting-Tidak Mendesak, dll disebut?", a: "Matriks Eisenhower", opts: ["Metode Pomodoro", "Matriks Eisenhower", "Sistem GTD (Getting Things Done)"] },
                // SULIT
                { q: "Dalam negosiasi bisnis, strategi 'BATNA' (Best Alternative To Negotiated Agreement) berarti?", a: "Alternatif terbaik jika negosiasi gagal — batas bawah kita", opts: ["Penawaran terbaik yang bisa kita buat", "Alternatif terbaik jika negosiasi gagal — batas bawah kita", "Teknik menekan lawan agar setuju"] },
                { q: "Pemutusan Hubungan Kerja (PHK) oleh perusahaan wajib memberikan pesangon sesuai?", a: "UU Ketenagakerjaan (UU No.13/2003 atau UU Cipta Kerja)", opts: ["Kebijakan internal perusahaan saja", "UU Ketenagakerjaan (UU No.13/2003 atau UU Cipta Kerja)", "Keputusan langsung HRD"] },
                { q: "Analisis SWOT perusahaan mempertimbangkan Strengths, Weaknesses, Opportunities, dan?", a: "Threats", opts: ["Targets", "Threats", "Trends"] },
                { q: "Dalam manajemen rantai pasok (Supply Chain), 'Just-In-Time' (JIT) bertujuan untuk?", a: "Meminimalkan stok berlebih dengan produksi tepat waktu", opts: ["Mempercepat pengiriman ke konsumen akhir", "Meminimalkan stok berlebih dengan produksi tepat waktu", "Menambah buffer stok sebagai cadangan"] },
                { q: "Biaya yang tidak berubah meski volume produksi naik/turun disebut?", a: "Biaya Tetap (Fixed Cost)", opts: ["Biaya Variabel", "Biaya Tetap (Fixed Cost)", "Biaya Marginal"] },
                { q: "Pemimpin yang memberi kebebasan penuh kepada tim tanpa arahan disebut gaya kepemimpinan?", a: "Laissez-Faire", opts: ["Demokratis", "Laissez-Faire", "Transformasional"] },
                { q: "Dalam konteks ISO 9001, dokumen 'SOP' (Standard Operating Procedure) berfungsi untuk?", a: "Menjamin konsistensi proses kerja yang terstandarisasi", opts: ["Menggantikan peran manajer", "Menjamin konsistensi proses kerja yang terstandarisasi", "Syarat administrasi pinjaman bank"] }
            ];

            // --- NEW: LOGIKA UJIAN MANAJER ---
            let currentManagerTest = {
                score: 0,
                qIndex: 0,
                questions: []
            };

            function startManagerExam() {
                currentManagerTest.score = 0;
                currentManagerTest.qIndex = 0;
                // Ambil 5 soal acak
                currentManagerTest.questions = [...MANAGER_EXAM_DB].sort(() => Math.random() - 0.5).slice(0, 5);

                showDialogue("UJI KOMPETENSI MANAJER",
                    "Syarat menjadi Manajer bukan hanya otot, tapi juga otak & etika.\n\nSaya akan ajukan **5 Pertanyaan Manajemen**.\nSyarat Lulus: **Benar Minimal 4**.\n\nSiap diuji?",
                    [
                        { text: "SIAP BOS! (Mulai)", action: nextManagerQuestion },
                        { text: "Belum siap mental", action: closeDialogue }
                    ],
                    'images/job.png'
                );
            }

            function nextManagerQuestion() {
                if (currentManagerTest.qIndex >= currentManagerTest.questions.length) {
                    finishManagerExam();
                    return;
                }

                const qData = currentManagerTest.questions[currentManagerTest.qIndex];
                const opts = qData.opts.map(opt => ({
                    text: opt,
                    action: () => answerManagerQuestion(opt === qData.a)
                })).sort(() => Math.random() - 0.5);

                showDialogue(`UJIAN MANAJER (${currentManagerTest.qIndex + 1}/5)`,
                    `PERTANYAAN:\n\n**"${qData.q}"**`,
                    opts,
                    'images/job.png'
                );
            }

            function answerManagerQuestion(isCorrect) {
                if (isCorrect) {
                    currentManagerTest.score++;
                    showToast("Jawaban Tepat! ✅");
                } else {
                    showToast("Jawaban Kurang Tepat ❌");
                }

                if (typeof AudioService !== 'undefined') AudioService.playSFX(isCorrect ? 'item' : 'hit');

                currentManagerTest.qIndex++;
                setTimeout(() => nextManagerQuestion(), 800);
            }

            function finishManagerExam() {
                const passed = currentManagerTest.score >= 4;

                if (passed) {
                    // PROMOTION LOGIC (MANAJER)
                    STATE.player.jobLevel++;
                    STATE.player.bossReputation += 10; // Bonus Reputasi Besar
                    STATE.player.biz += 5; // Bonus Skill Bisnis

                    // --- NEW: BERIKAN SERTIFIKAT PROFESI ---
                    addItem('sertifikat_manajer', 1);
                    showToast("🎓 DITEMUKAN: Sertifikat Profesi Manajer!");

                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(STATE.player.x, STATE.player.y, '#fbbf24');

                    showDialogue("HASIL UJIAN: LULUS!",
                        `Skor: ${currentManagerTest.score}/5.\n\nSelamat! Pengetahuanmu tentang manajemen dan etika sudah mumpuni.\n\nSaya dengan bangga menyerahkan **Sertifikat Profesi** ini dan mengangkatmu menjadi **MANAJER CABANG**!`,
                        [{
                            text: "Terima kasih Bos!", action: () => {
                                closeDialogue();
                                showToast("NAIK PANGKAT: MANAJER! 📈");
                                manualSave();
                            }
                        }],
                        'images/job.png'
                    );
                } else {
                    STATE.player.energy = Math.max(0, STATE.player.energy - 20); // Penalty kelelahan mental
                    showDialogue("HASIL UJIAN: GAGAL",
                        `Skor: ${currentManagerTest.score}/5.\n\nKamu belum siap memimpin. Pelajari lagi tentang bisnis dan etika kerja.\nSeorang Manajer tidak boleh salah ambil keputusan!`,
                        [{ text: "Maaf Bos... (Energy -20)", action: closeDialogue }],
                        'images/job.png'
                    );
                }
            }

            // --- NEW: WORKER MINIGAME LOGIC & DATA ---
            const WORK_ITEMS = [
                { name: "Apel Merah", type: "food", icon: "🍎" },
                { name: "Ikan Segar", type: "food", icon: "🐟" },
                { name: "Roti Gandum", type: "food", icon: "🍞" },
                { name: "Susu Sapi", type: "food", icon: "🥛" },
                { name: "Palu Besi", type: "tool", icon: "🔨" },
                { name: "Kapak Kayu", type: "tool", icon: "🪓" },
                { name: "Cangkul", type: "tool", icon: "⛏️" },
                { name: "Pedang Lama", type: "tool", icon: "⚔️" },
                { name: "Cincin Emas", type: "luxury", icon: "💍" },
                { name: "Kalung Mutiara", type: "luxury", icon: "📿" },
                { name: "Kain Sutra", type: "luxury", icon: "🧣" },
                { name: "Permata Biru", type: "luxury", icon: "💎" }
            ];

            let workState = {
                active: false,
                currentItem: null,
                score: 0,
                timer: 0,
                maxTime: 10, // 10 detik per sesi sortir
                interval: null
            };

            // --- NEW FUNCTION: HANDLE WORKER INTERACTION (Dipanggil dari interactObject) ---
            function handleWorkerInteraction(obj) {
                const p = STATE.player;

                // Validasi Dasar
                if (p.role !== 'worker') {
                    showToast("Hanya Staff Gudang yang boleh menyentuh ini.");
                    return;
                }

                if (!p.shiftStarted) {
                    showDialogue("Pak Hendra (Merchant)", "Kamu belum absen masuk shift! Lapor ke saya dulu baru kerja.", [{ text: "Siap Bos", action: closeDialogue }], 'images/job.png');
                    return;
                }

                // A. Interaksi Rak Gudang (Minigame Sortir)
                if (obj.type === 'shelf') {
                    showDialogue("TUGAS GUDANG", "Ada tumpukan barang baru datang. \nBantu sortir ke rak yang benar agar stok rapi.", [
                        {
                            text: "Mulai Sortir (Energy -5)", action: () => {
                                if (p.energy >= 5) {
                                    p.energy -= 5;
                                    closeDialogue();
                                    startWorkMinigame();
                                } else {
                                    showToast("Terlalu lelah untuk angkat barang...");
                                }
                            }
                        },
                        { text: "Nanti saja", action: closeDialogue }
                    ], 'images/rakbuku.png'); // Pakai gambar rak
                }

                // B. Interaksi Kasir (Event Pelanggan)
                else if (obj.type === 'counter') {
                    triggerCustomerEvent();
                }
            }

            // --- LOGIKA MINIGAME SORTIR ---
            function startWorkMinigame() {
                workState.active = true;
                workState.score = 0;
                workState.timer = workState.maxTime;

                document.getElementById('work-minigame').style.display = 'flex';
                document.getElementById('work-score-val').innerText = "0";
                STATE.screen = 'minigame';

                nextWorkItem();

                // Timer Loop
                if (workState.interval) clearInterval(workState.interval);
                workState.interval = setInterval(() => {
                    workState.timer -= 0.1;
                    const pct = (workState.timer / workState.maxTime) * 100;
                    document.getElementById('work-timer-bar').style.width = pct + "%";

                    if (workState.timer <= 0) {
                        finishWorkMinigame();
                    }
                }, 100);
            }

            function nextWorkItem() {
                const rand = Math.floor(Math.random() * WORK_ITEMS.length);
                workState.currentItem = WORK_ITEMS[rand];

                // Tampilkan Item
                const iconEl = document.getElementById('work-target-icon');
                const nameEl = document.getElementById('work-target-name');

                // Reset animasi
                iconEl.style.animation = 'none';
                iconEl.offsetHeight; /* trigger reflow */
                iconEl.style.animation = 'bounceIn 0.3s';

                iconEl.innerText = workState.currentItem.icon;
                nameEl.innerText = workState.currentItem.name;
            }

            function handleWorkSort(type) {
                if (!workState.active) return;

                if (workState.currentItem.type === type) {
                    // Benar
                    workState.score++;
                    document.getElementById('work-score-val').innerText = workState.score;
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    nextWorkItem();
                } else {
                    // Salah (Penalti Waktu)
                    workState.timer -= 2;
                    showToast("Salah Rak! (-2 Detik)");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                    // Visual shake
                    const card = document.querySelector('.work-card');
                    card.style.transform = "translateX(5px)";
                    setTimeout(() => card.style.transform = "translateX(0)", 100);
                }
            }

            function finishWorkMinigame() {
                clearInterval(workState.interval);
                workState.active = false;
                document.getElementById('work-minigame').style.display = 'none';
                STATE.screen = 'play';

                // Reward Logic
                const bonusMoney = workState.score * 100; // 100G per item
                const bonusExp = workState.score * 10;

                // --- UPDATE: WORKER PERK (TUNJANGAN LEMBUR) ---
                // Jika Role Worker, dapat bonus tambahan tetap
                let perkText = "";
                if (STATE.player.role === 'worker') {
                    bonusMoney += 500;
                    perkText = "\n(Termasuk Tunjangan Lembur +500G)";
                }

                STATE.player.money += bonusMoney;
                gainExp(bonusExp);
                STATE.player.str += 1; // Kerja fisik nambah STR

                // --- UPDATE: SKIP WAKTU KE 16:00 (PULANG KERJA) ---
                // Efek: Setelah kerja keras di minigame, waktu langsung sore dan shift selesai
                STATE.time = 1600;

                // Boss Reaction
                let reaction = "Kerja bagus. Gudang jadi rapi.";
                if (workState.score > 8) {
                    reaction = "Luar biasa! Kamu secepat kilat. Ini bonus untukmu.";
                    STATE.player.bossReputation += 2;
                } else if (workState.score < 3) {
                    reaction = "Lambat sekali... Kamu melamun ya?";
                    STATE.player.bossReputation -= 1;
                }

                showDialogue("LAPORAN KERJA",
                    `Skor: ${workState.score} Item\nBonus Minigame: ${bonusMoney} Gold\n\n(Waktu berlalu cepat saat bekerja... Tiba saatnya pulang pukul 16:00)\n\nBos: "${reaction}"`,
                    [{ text: "Absen Pulang (Terima Gaji)", action: closeDialogue }],
                    'images/job.png'
                );
            }

            function quitWorkMinigame() {
                clearInterval(workState.interval);
                workState.active = false;
                document.getElementById('work-minigame').style.display = 'none';
                STATE.screen = 'play';
            }

            // --- LOGIKA EVENT PELANGGAN (CUSTOMER SERVICE) ---
            function triggerCustomerEvent() {
                // Random Scenario
                const scenarios = [
                    {
                        type: 'angry_price',
                        npc: 'Pelanggan Ibu-ibu',
                        img: 'images/girl.png', // Placeholder
                        text: "Heh! Kenapa harga gandum di sini mahal sekali?! Di toko sebelah cuma 1000G, di sini 2000G! Kamu mau nipu ya?",
                        options: [
                            { text: "Jelaskan Kualitas (INT)", req: { stat: 'int', val: 10 }, outcome: 'success', msg: "Ibu, gandum kami impor premium. Bebas kutu dan lebih wangi.", reward: { rep: 2, tip: 0 } },
                            { text: "Beri Diskon (Rugi 500G)", action: 'discount', outcome: 'neutral', msg: "Ya sudah, khusus Ibu saya potong 500G dari gaji saya.", reward: { rep: 1, tip: 0 } },
                            { text: "Kalau gak punya uang jangan belanja bu", outcome: 'fail', msg: "Kurang ajar! Saya laporkan bosmu!", reward: { rep: -5, tip: 0 } }
                        ]
                    },
                    {
                        type: 'scam_check',
                        npc: 'Pelanggan Curiga',
                        img: 'images/peer3.png',
                        text: "Ini Pedang Besi asli bukan? Kok warnanya agak pudar? Jangan-jangan ini barang rongsokan dari Dungeon yang dicat ulang!",
                        options: [
                            { text: "Tunjukkan Cap Pabrik (BIZ)", req: { stat: 'biz', val: 10 }, outcome: 'success', msg: "Lihat cap ini Pak. Ini buatan Blacksmith Lina asli.", reward: { rep: 2, tip: 200 } },
                            { text: "Sumpah Pak, ini asli!", outcome: 'neutral', msg: "Hmm... ya sudah saya percaya. Awas kalau patah.", reward: { rep: 0, tip: 0 } },
                            { text: "Marah balik", outcome: 'fail', msg: "Pelayan kok galak! Saya gak jadi beli!", reward: { rep: -3, tip: 0 } }
                        ]
                    },
                    {
                        type: 'happy_customer',
                        npc: 'Pelanggan Kaya',
                        img: 'images/lover_matre_boy.png',
                        text: "Pelayanan di sini cepat ya. Tolong bungkuskan 10 Permata, saya buru-buru mau melamar pacar saya.",
                        options: [
                            { text: "Bungkus Rapi (STR)", req: { stat: 'str', val: 15 }, outcome: 'success', msg: "Cepat dan rapi! Ini tip buat kamu.", reward: { rep: 3, tip: 1000 } },
                            { text: "Siap Pak", outcome: 'neutral', msg: "Terima kasih. Kembaliannya ambil saja.", reward: { rep: 1, tip: 100 } }
                        ]
                    }
                ];

                const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

                // Build Options dynamically
                const dialogOpts = scenario.options.map(opt => {
                    let label = opt.text;
                    // Cek requirement stat
                    if (opt.req) label += ` [${opt.req.stat.toUpperCase()} ${opt.req.val}+]`;

                    return {
                        text: label,
                        action: () => {
                            let success = true;

                            // Cek stat requirement
                            if (opt.req) {
                                const pStat = STATE.player[opt.req.stat] || 0;
                                if (pStat < opt.req.val) {
                                    success = false;
                                    showToast(`Gagal! Butuh ${opt.req.stat.toUpperCase()} ${opt.req.val}`);
                                }
                            }

                            // Special Actions
                            if (success && opt.action === 'discount') {
                                if (STATE.player.money >= 500) {
                                    STATE.player.money -= 500;
                                    showToast("Anda menalangi 500G.");
                                } else {
                                    success = false;
                                    showToast("Uangmu tidak cukup untuk nalangin!");
                                }
                            }

                            // Result
                            if (success) {
                                // Apply Rewards
                                STATE.player.bossReputation += opt.reward.rep;
                                if (opt.reward.tip > 0) {
                                    STATE.player.money += opt.reward.tip;
                                    showToast(`Dapat Tip +${opt.reward.tip}G!`);
                                }

                                // Show outcome dialog
                                showDialogue(scenario.npc, opt.msg, [{ text: "Kembali Kerja", action: closeDialogue }], scenario.img);
                            } else {
                                // Failed stat check fallback
                                STATE.player.bossReputation -= 2;
                                showDialogue(scenario.npc, "Kamu ngomong apa sih? Gak jelas! (Pelanggan Kecewa)", [{ text: "Maaf...", action: closeDialogue }], scenario.img);
                            }
                        }
                    };
                });

                dialogOpts.push({
                    text: "Abaikan (Rep -1)", action: () => {
                        STATE.player.bossReputation -= 1;
                        closeDialogue();
                    }
                });

                showDialogue(scenario.npc, scenario.text, dialogOpts, scenario.img);
            }

            // ══════════════════════════════════════════════════════════════
            // 💥 SISTEM KONFLIK TEMPAT KERJA
            // Konflik muncul random saat shift aktif, mempengaruhi bossReputation
            // Rep tinggi → bonus gaji, promosi. Rep rendah → peringatan, pecat.
            // ══════════════════════════════════════════════════════════════

            const WORK_CONFLICTS = {
                // ── FULL-TIME: MERCHANT (boss_merchant / Pak Hendra) ──────────────
                fulltime: [
                    {
                        id: 'fc_telat',
                        title: '⏰ Terlambat Masuk',
                        text: 'Pak Hendra memanggil kamu ke ruangannya.\n\n"Kamu terlambat 30 menit hari ini. Ini bukan pertama kali. Saya butuh penjelasan!"',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🙏 Minta maaf dengan tulus dan berjanji berubah',
                                outcome: 'good',
                                msg: '"Saya hargai kejujuranmu. Tapi jangan terulang lagi! Reputasimu masih bisa saya pertahankan."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Meminta maaf dengan tulus dan berkomitmen memperbaiki diri adalah sikap profesional yang dihargai atasan.'
                            },
                            {
                                text: '📱 Beri alasan macet dan tunjukkan bukti foto',
                                req: { stat: 'int', val: 12 },
                                outcome: 'neutral',
                                msg: '"Hmm, ada buktinya. Oke, kali ini saya maklumi. Tapi cari solusi alternatif ke depannya."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Alasan yang valid perlu didukung bukti. Inisiatif mencari solusi alternatif lebih dihargai daripada sekadar alasan.'
                            },
                            {
                                text: '😤 Protes balik — "Kemarin saya lembur Pak!"',
                                outcome: 'bad',
                                msg: '"Lembur kemarin tidak ada hubungannya dengan keterlambatan hari ini! Surat peringatan pertama kamu terbit!"',
                                rep: -10, money: 0,
                                lesson: '📚 PELAJARAN: Membela diri dengan menyerang balik hanya memperburuk konflik. Di dunia kerja, timing dan cara merespons sangat penting.'
                            }
                        ]
                    },
                    {
                        id: 'fc_rekan',
                        title: '👥 Konflik dengan Rekan Kerja',
                        text: 'Pak Hendra memanggilmu.\n\n"Saya dengar kamu dan Rudi berselisih soal pembagian tugas gudang. Dia bilang kamu tidak mau membantu. Ceritakan versiku."',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🤝 Akui kesalahan dan tawarkan mediasi bersama',
                                outcome: 'good',
                                msg: '"Bagus! Karyawan yang dewasa bisa menyelesaikan konflik secara konstruktif. Saya catat ini positif."',
                                rep: +8, money: 0,
                                lesson: '📚 PELAJARAN: Menyelesaikan konflik secara dewasa dan proaktif menunjukkan kematangan emosional yang sangat dihargai di tempat kerja.'
                            },
                            {
                                text: '📋 Jelaskan pembagian tugas berdasarkan fakta',
                                req: { stat: 'int', val: 15 },
                                outcome: 'neutral',
                                msg: '"Data pembagianmu masuk akal. Saya akan bicara dengan Rudi juga. Tapi cobalah lebih komunikatif ke depannya."',
                                rep: +3, money: 0,
                                lesson: '📚 PELAJARAN: Fakta dan data membantu penyelesaian konflik secara objektif, tapi komunikasi aktif sejak awal mencegah konflik terjadi.'
                            },
                            {
                                text: '🗣️ Balik menyalahkan Rudi sepenuhnya',
                                outcome: 'bad',
                                msg: '"Ini bukan sidang! Saya tidak suka kamu lempar tanggung jawab. Kerja sama tim adalah kewajiban, bukan pilihan!"',
                                rep: -12, money: 0,
                                lesson: '📚 PELAJARAN: Menyalahkan rekan kerja hanya memperburuk hubungan tim. Atasan menghargai karyawan yang mengambil tanggung jawab, bukan yang mencari kambing hitam.'
                            }
                        ]
                    },
                    {
                        id: 'fc_stok',
                        title: '📦 Kesalahan Stok Barang',
                        text: 'Pak Hendra datang dengan wajah tegang.\n\n"Ada ketidakcocokan stok 15 unit Beras Premium. Laporan kamu kemarin bilang stok aman, tapi sekarang kosong. Apa yang terjadi?!"',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🔍 Lakukan audit dan laporkan temuan secara transparan',
                                req: { stat: 'int', val: 10 },
                                outcome: 'good',
                                msg: '"Terima kasih sudah transparan dan proaktif! Ternyata memang ada bug di sistem input. Kamu tidak bersalah, dan saya hargai inisiatifmu."',
                                rep: +10, money: 500,
                                lesson: '📚 PELAJARAN: Transparansi dan inisiatif menyelesaikan masalah adalah karakter karyawan terbaik. Atasan menghargai kejujuran meski hasilnya tidak enak.'
                            },
                            {
                                text: '😓 Minta maaf dan berjanji teliti lebih hati-hati',
                                outcome: 'neutral',
                                msg: '"Baiklah. Saya minta kamu double-check setiap laporan mulai besok. Ini jadi catatan kinerja kamu."',
                                rep: -3, money: 0,
                                lesson: '📚 PELAJARAN: Minta maaf itu penting, tapi tanpa solusi konkret hanya mengurangi kepercayaan. Selalu sertakan rencana perbaikan.'
                            },
                            {
                                text: '🤷 Bilang itu bukan tanggung jawabmu',
                                outcome: 'bad',
                                msg: '"Kamu yang bertugas input stok hari itu! Surat Peringatan resmi keluar sekarang. Jika sekali lagi, kamu saya keluarkan!"',
                                rep: -18, money: -1000,
                                lesson: '📚 PELAJARAN: Menghindari tanggung jawab adalah salah satu alasan paling umum seseorang kehilangan pekerjaan. Kepercayaan atasan dibangun dari akuntabilitas.'
                            }
                        ]
                    },
                    {
                        id: 'fc_lembur',
                        title: '🌙 Diminta Lembur Mendadak',
                        text: 'Pak Hendra menghampirimu menjelang pulang.\n\n"Kita ada kiriman besar malam ini. Kamu bisa lembur 2 jam? Ada kompensasi tentu saja."',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '✅ Setuju lembur dengan semangat',
                                outcome: 'good',
                                msg: '"Luar biasa! Ini yang saya harapkan dari karyawan terbaik. Kompensasi akan saya proses besok."',
                                rep: +10, money: 2000,
                                lesson: '📚 PELAJARAN: Fleksibilitas dan dedikasi saat dibutuhkan membangun reputasi kerja keras yang berharga untuk karir jangka panjang.'
                            },
                            {
                                text: '🤔 Minta kejelasan kompensasi dulu sebelum setuju',
                                req: { stat: 'int', val: 8 },
                                outcome: 'neutral',
                                msg: '"Pertanyaan bagus dan profesional! Lembur 2 jam = 1.500 G. Setuju? Kamu tahu hak kamu."',
                                rep: +4, money: 1500,
                                lesson: '📚 PELAJARAN: Menanyakan kompensasi lembur adalah hak karyawan yang dijamin UU. Karyawan yang paham haknya justru dihormati atasan yang profesional.'
                            },
                            {
                                text: '❌ Menolak tanpa alasan jelas',
                                outcome: 'bad',
                                msg: '"Baik, tidak apa-apa. Tapi saya catat ini dalam evaluasi kinerja kamu. Dedikasi itu penting."',
                                rep: -7, money: 0,
                                lesson: '📚 PELAJARAN: Menolak lembur boleh saja, tapi harus dengan alasan yang jelas. Komunikasi yang baik menjaga hubungan kerja tetap profesional.'
                            }
                        ]
                    },
                    {
                        id: 'fc_gosip',
                        title: '🗣️ Terseret Gosip Kantor',
                        text: 'Pak Hendra memanggilmu dengan serius.\n\n"Saya dengar kamu menyebarkan informasi tentang rencana restrukturisasi perusahaan ke karyawan lain. Apa benar?"',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '🤐 Jujur bahwa tidak sengaja dan berjanji menjaga kerahasiaan',
                                outcome: 'good',
                                msg: '"Saya menghargai kejujuranmu. Informasi internal harus dijaga. Kali ini saya maafkan, tapi ingat — kerahasiaan adalah profesionalisme."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Kerahasiaan informasi perusahaan (confidentiality) adalah kewajiban etis setiap karyawan. Melanggar dapat berujung pada pemutusan hubungan kerja.'
                            },
                            {
                                text: '🛡️ Jelaskan bahwa itu hanya diskusi umum, bukan gosip',
                                req: { stat: 'rep', val: 20 },
                                outcome: 'neutral',
                                msg: '"Hmm, reputasimu selama ini baik. Saya percaya niatmu tidak buruk. Tapi hati-hati ke depan."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Reputasi yang baik bisa jadi "tameng" dalam situasi sulit. Membangun kepercayaan sejak awal sangat penting.'
                            },
                            {
                                text: '😠 Menyangkal keras dan balik menuduh rekan lain',
                                outcome: 'bad',
                                msg: '"Kamu menyangkal fakta dan menyerang orang lain. Ini sangat tidak profesional. SP2 kamu terbit hari ini!"',
                                rep: -15, money: 0,
                                lesson: '📚 PELAJARAN: Menyangkal dan menyerang orang lain saat konfrontasi hanya memperburuk situasi. Sikap defensif menghancurkan kepercayaan atasan.'
                            }
                        ]
                    },
                    {
                        id: 'fc_promosi',
                        title: '🏆 Evaluasi Kinerja Tahunan',
                        text: 'Pak Hendra duduk bersamamu.\n\n"Waktunya evaluasi kinerja. Berdasarkan catatan saya, kamu cukup konsisten. Tapi ada hal yang perlu kita diskusikan untuk mendapat promosi..."',
                        img: 'images/job.png',
                        options: [
                            {
                                text: '📊 Presentasi pencapaian dengan data dan rencana ke depan',
                                req: { stat: 'int', val: 15 },
                                outcome: 'good',
                                msg: '"Impressive! Kamu sudah berpikir seperti seorang manajer. Saya rekomendasikan kamu untuk promosi jabatan!"',
                                rep: +20, money: 5000, promote: true,
                                lesson: '📚 PELAJARAN: Evaluasi kinerja adalah kesempatan emas. Karyawan yang datang dengan data pencapaian dan rencana jelas jauh lebih mungkin mendapat promosi.'
                            },
                            {
                                text: '😊 Berterima kasih dan minta feedback perbaikan',
                                outcome: 'neutral',
                                msg: '"Sikap yang baik! Saya suka karyawan yang mau belajar. Kamu masih perlu 1-2 bulan lagi untuk promosi, tapi kamu di jalur yang benar."',
                                rep: +10, money: 1000,
                                lesson: '📚 PELAJARAN: Meminta feedback adalah tanda kematangan profesional. Karyawan yang mau terus belajar lebih cepat berkembang dalam karir.'
                            },
                            {
                                text: '💰 Langsung tuntut kenaikan gaji tanpa diskusi',
                                outcome: 'bad',
                                msg: '"Permintaan kenaikan gaji tanpa prestasi yang mendukung? Kamu perlu introspeksi dulu sebelum tuntut lebih."',
                                rep: -8, money: 0,
                                lesson: '📚 PELAJARAN: Menuntut kenaikan gaji tanpa dasar prestasi yang jelas menunjukkan kurangnya pemahaman tentang dinamika profesional.'
                            }
                        ]
                    }
                ],
                // ── PART-TIME: BENGKEL (Bang Joko) ────────────────────────────────
                bengkel: [
                    {
                        id: 'pt_b_rusak',
                        title: '🔨 Alat Kerja Rusak',
                        text: 'Bang Joko memanggil kamu.\n\n"Palu tempa yang kamu pakai tadi kepala-nya copot dan hampir kena kaki pelanggan. Untung tidak ada yang cedera. Kamu tidak cek dulu sebelum pakai?"',
                        img: 'images/blacksmith.png',
                        options: [
                            {
                                text: '🙏 Minta maaf dan usulkan SOP pengecekan alat rutin',
                                req: { stat: 'int', val: 10 },
                                outcome: 'good',
                                msg: '"Ide yang bagus! Kalau kamu buat SOP-nya, itu inisiatif luar biasa untuk anak magang. Saya tambah bonus hari ini."',
                                rep: +8, money: 500,
                                lesson: '📚 PELAJARAN: Mengubah kesalahan menjadi perbaikan sistem menunjukkan mentalitas problem-solver yang dihargai di tempat kerja manapun.'
                            },
                            {
                                text: '😅 Minta maaf dan berjanji lebih teliti',
                                outcome: 'neutral',
                                msg: '"Oke, lain kali cek dulu kondisi alat sebelum dipakai. Keselamatan kerja bukan main-main di sini."',
                                rep: -2, money: 0,
                                lesson: '📚 PELAJARAN: Keselamatan dan kesehatan kerja (K3) adalah prioritas utama di lingkungan industri. Pengecekan alat adalah prosedur wajib.'
                            },
                            {
                                text: '🤷 "Palu-nya memang sudah longgar dari tadi Bang"',
                                outcome: 'bad',
                                msg: '"Kalau tahu sudah longgar, kenapa tidak lapor?! Ini bukan soal siapa yang salah — ini soal keselamatan orang! Saya kurangi gaji hari ini."',
                                rep: -15, money: -500,
                                lesson: '📚 PELAJARAN: Mengetahui risiko tapi tidak melaporkan adalah kelalaian serius. Di industri, ini bisa berujung pada sanksi hukum, bukan sekadar teguran.'
                            }
                        ]
                    },
                    {
                        id: 'pt_b_pesanan',
                        title: '📋 Pesanan Salah Ukuran',
                        text: 'Bang Joko cemberut.\n\n"Pelanggan tadi komplain. Pedang yang dia pesan ukuran L, tapi yang kamu kerjakan ukuran M. Ini membuang material dan waktu!"',
                        img: 'images/blacksmith.png',
                        options: [
                            {
                                text: '📝 Ambil tanggung jawab dan tawarkan mengerjakan ulang tanpa tambah biaya',
                                req: { stat: 'str', val: 10 },
                                outcome: 'good',
                                msg: '"Nah itu baru namanya bertanggung jawab! Saya suka. Pelanggan puas, reputasi toko terjaga. Bagus!"',
                                rep: +10, money: 0,
                                lesson: '📚 PELAJARAN: Service recovery yang cepat dan tulus bisa mengubah pelanggan yang kecewa menjadi pelanggan setia. Tanggung jawab adalah fondasi kepercayaan.'
                            },
                            {
                                text: '🔍 Cek ulang catatan pesanan dan tunjukkan fakta',
                                outcome: 'neutral',
                                msg: '"Hmm, ternyata catatannya memang ambigu. Kali ini kita sama-sama salah. Besok buat sistem konfirmasi ulang pesanan."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Dokumentasi yang jelas mencegah miskomunikasi. Sistem konfirmasi pesanan adalah standar profesional di bisnis manapun.'
                            },
                            {
                                text: '😤 Bilang pelanggannya yang salah pesan',
                                outcome: 'bad',
                                msg: '"Di toko saya, pelanggan selalu benar! Kamu kerja untuk melayani, bukan berdebat. Awas kalau terulang!"',
                                rep: -12, money: 0,
                                lesson: '📚 PELAJARAN: Mentalitas "pelanggan adalah raja" bukan berarti membiarkan pelanggan salah — tapi memastikan komunikasi berjalan baik sejak awal.'
                            }
                        ]
                    },
                    {
                        id: 'pt_b_senior',
                        title: '😤 Senioritas dan Tekanan',
                        text: 'Roni, pegawai senior bengkel, sering menyuruhmu mengerjakan tugas berat yang bukan bagianmu. Hari ini Bang Joko melihatnya.\n\n"Hei, ada apa ini?"',
                        img: 'images/blacksmith.png',
                        options: [
                            {
                                text: '🗣️ Ceritakan situasi dengan tenang dan objektif',
                                outcome: 'good',
                                msg: '"Terima kasih sudah lapor! Roni memang harus tahu batas. Kamu bagian dari tim ini, bukan bawahan personal siapapun."',
                                rep: +7, money: 0,
                                lesson: '📚 PELAJARAN: Senioritas bukan alasan untuk mengeksploitasi junior. Melaporkan dengan cara yang tepat adalah hak dan langkah yang benar.'
                            },
                            {
                                text: '🤝 Bilang tidak apa-apa, kamu senang membantu',
                                outcome: 'neutral',
                                msg: '"Kamu terlalu baik hati! Ingat, kerja keras itu baik, tapi kenali batasanmu agar tidak terbakar. Saya akan bicara dengan Roni."',
                                rep: +1, money: 0,
                                lesson: '📚 PELAJARAN: Menerima semua beban kerja demi dianggap "baik" bisa berujung burnout. Mengenali batasan adalah bentuk manajemen diri yang sehat.'
                            },
                            {
                                text: '😠 Konfrontasi langsung dan emosional dengan Roni',
                                outcome: 'bad',
                                msg: '"Hei! Jangan ribut di depan pelanggan! Urus masalah kalian di luar waktu kerja. Kamu dapat SP hari ini!"',
                                rep: -10, money: 0,
                                lesson: '📚 PELAJARAN: Konflik di tempat kerja harus diselesaikan melalui jalur yang tepat. Konfrontasi emosional di depan umum merusak citra profesional kamu.'
                            }
                        ]
                    }
                ],
                // ── PART-TIME: PENJAHIT (Marine) ──────────────────────────────────
                penjahit: [
                    {
                        id: 'pt_p_pelanggan',
                        title: '👗 Komplain Jahitan Tidak Rapi',
                        text: 'Marine memanggilmu.\n\n"Bu Sari mengeluh bahwa jahitan di bagian lengan baju pesanannya tidak rapi dan benangnya sudah lepas. Dia sangat kecewa."',
                        img: 'images/marine.png',
                        options: [
                            {
                                text: '🧵 Minta maaf dan segera perbaiki dengan gratis',
                                outcome: 'good',
                                msg: '"Perfect! Pelayanan seperti ini yang membuat pelanggan kembali lagi. Bu Sari malah memuji responsmu. Bagus sekali!"',
                                rep: +10, money: 300,
                                lesson: '📚 PELAJARAN: Pelayanan purna jual yang responsif adalah pembeda bisnis berkualitas. 1 pelanggan puas bisa bawa 10 pelanggan baru.'
                            },
                            {
                                text: '🔍 Periksa apakah itu jahitanmu atau jahitan orang lain',
                                req: { stat: 'int', val: 8 },
                                outcome: 'neutral',
                                msg: '"Ternyata itu hasil jahitan minggu lalu bukan kamu. Tapi kamu harus tetap bantu perbaiki ya — kita satu tim di sini."',
                                rep: +2, money: 0,
                                lesson: '📚 PELAJARAN: Meski bukan kesalahan kamu, membantu menyelesaikan masalah tim menunjukkan solidaritas dan profesionalisme.'
                            },
                            {
                                text: '😤 Bilang itu bukan jahitanmu jadi bukan tanggung jawabmu',
                                outcome: 'bad',
                                msg: '"Di sini, kita bertanggung jawab bersama! Sikap seperti itu tidak ada tempat di usahaku. Kurangi upah hari ini!"',
                                rep: -12, money: -500,
                                lesson: '📚 PELAJARAN: Tanggung jawab kolektif adalah budaya kerja yang penting. Menghindari masalah tim membuat kamu terlihat tidak kooperatif.'
                            }
                        ]
                    },
                    {
                        id: 'pt_p_deadline',
                        title: '⏰ Deadline Pesanan Mendesak',
                        text: 'Marine terlihat panik.\n\n"Ada pesanan baju pengantin yang harus selesai besok pagi, tapi kita ketinggalan! Kamu bisa bantu lembur malam ini?"',
                        img: 'images/marine.png',
                        options: [
                            {
                                text: '✅ Setuju lembur dan bagi strategi pengerjaan efisien',
                                req: { stat: 'int', val: 12 },
                                outcome: 'good',
                                msg: '"Kamu luar biasa! Strategi pembagian pola yang kamu usul memotong waktu 2 jam. Bonus khusus malam ini!"',
                                rep: +12, money: 1500,
                                lesson: '📚 PELAJARAN: Di saat krisis, karyawan yang datang dengan solusi — bukan hanya kesediaan — adalah aset terbesar.'
                            },
                            {
                                text: '✅ Setuju lembur meski lelah',
                                outcome: 'neutral',
                                msg: '"Terima kasih! Kamu tim yang solid. Pesanan selesai tepat waktu dan pelanggan sangat senang."',
                                rep: +8, money: 1000,
                                lesson: '📚 PELAJARAN: Komitmen saat dibutuhkan membangun kepercayaan yang tidak bisa dibeli dengan apapun di lingkungan kerja.'
                            },
                            {
                                text: '❌ Menolak karena sudah terlalu lelah',
                                outcome: 'bad',
                                msg: '"Saya mengerti kamu lelah... tapi pelanggan kita kecewa. Kita kehilangan kepercayaan mereka malam ini."',
                                rep: -5, money: 0,
                                lesson: '📚 PELAJARAN: Menjaga energi itu penting, tapi di momen kritis, pertimbangkan dampak ke tim dan pelanggan. Komunikasi lebih awal bisa mencegah situasi ini.'
                            }
                        ]
                    },
                    {
                        id: 'pt_p_bahan',
                        title: '🧶 Bahan Kain Habis Saat Kritis',
                        text: 'Marine menatap lemari bahan dengan cemas.\n\n"Kain batik tulis untuk pesanan Bu Mira habis! Supplier belum tentu bisa kirim sebelum besok. Kamu ada ide?"',
                        img: 'images/marine.png',
                        options: [
                            {
                                text: '💡 Usulkan alternatif kain yang similar dengan approval pelanggan',
                                req: { stat: 'int', val: 10 },
                                outcome: 'good',
                                msg: '"Ide brilian! Bu Mira setuju dengan alternatifnya malah suka lebih. Kamu sudah berpikir seperti seorang pengusaha!"',
                                rep: +10, money: 800,
                                lesson: '📚 PELAJARAN: Kreativitas dalam menyelesaikan masalah — apalagi yang melibatkan keputusan bersama pelanggan — adalah skill wirausaha tingkat tinggi.'
                            },
                            {
                                text: '📞 Hubungi supplier darurat meski mahal',
                                outcome: 'neutral',
                                msg: '"Sedikit mahal tapi pesanan tetap selesai. Lain kali kita perlu sistem monitoring stok yang lebih baik."',
                                rep: +4, money: 0,
                                lesson: '📚 PELAJARAN: Manajemen stok yang baik mencegah situasi kritis. Selalu siapkan supplier cadangan sebagai antisipasi.'
                            },
                            {
                                text: '🤷 Bilang itu bukan tanggung jawab kamu',
                                outcome: 'bad',
                                msg: '"Di sini semua adalah tanggung jawab tim! Sikap pasif seperti itu tidak berguna di saat krisis."',
                                rep: -10, money: 0,
                                lesson: '📚 PELAJARAN: Bersikap pasif di saat krisis membuat kamu tidak berharga di mata tim. Kontribusi aktif, meski kecil, selalu lebih baik.'
                            }
                        ]
                    }
                ],
                // ── PART-TIME: KLINIK (Dr. Budi) ──────────────────────────────────
                klinik: [
                    {
                        id: 'pt_k_privasi',
                        title: '🔒 Kerahasiaan Data Pasien',
                        text: 'Dr. Budi memanggilmu dengan serius.\n\n"Saya dengar kamu sempat cerita ke temanmu soal kondisi pasien yang tadi datang. Apakah benar?"',
                        img: 'images/lover1boy.png',
                        options: [
                            {
                                text: '🙏 Akui kesalahan dan minta maaf — tidak akan terulang',
                                outcome: 'good',
                                msg: '"Saya hargai kejujuranmu. Kerahasiaan pasien adalah hukum, bukan sekadar aturan. Kali ini saya maafkan. Jangan terulang."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Kerahasiaan data pasien (patient confidentiality) dilindungi oleh UU Kesehatan. Melanggarnya bisa berujung pada sanksi hukum dan pencabutan izin kerja.'
                            },
                            {
                                text: '🛡️ Jelaskan tidak ada identitas spesifik yang disebutkan',
                                req: { stat: 'int', val: 12 },
                                outcome: 'neutral',
                                msg: '"Memang ada gradasi, tapi lebih aman hindari sama sekali. Di bidang kesehatan, privasi adalah prioritas mutlak."',
                                rep: +1, money: 0,
                                lesson: '📚 PELAJARAN: Bahkan data yang "tidak identifiable" tetap bisa melanggar privasi. Standar di bidang kesehatan sangat ketat untuk alasan yang sangat penting.'
                            },
                            {
                                text: '😤 Menyangkal keras bahwa kamu tidak melakukan itu',
                                outcome: 'bad',
                                msg: '"Saya punya konfirmasi dari pihak ketiga. Berbohong membuat situasinya jauh lebih serius. SP tertulis dikeluarkan hari ini!"',
                                rep: -20, money: 0,
                                lesson: '📚 PELAJARAN: Berbohong saat dihadapkan pada bukti adalah kesalahan terbesar. Kejujuran, meski pahit, selalu lebih baik untuk reputasi jangka panjang.'
                            }
                        ]
                    },
                    {
                        id: 'pt_k_salah_obat',
                        title: '💊 Hampir Salah Siapkan Obat',
                        text: 'Dr. Budi menghentikanmu tepat waktu.\n\n"Stop! Obat yang kamu ambil itu Amoxicillin 500mg, bukan yang 250mg untuk pasien anak ini. Kamu hampir buat kesalahan serius!"',
                        img: 'images/lover1boy.png',
                        options: [
                            {
                                text: '😰 Minta maaf dengan sungguh-sungguh dan minta sistem double-check',
                                outcome: 'good',
                                msg: '"Terima kasih sudah jujur dan proaktif. Sistem double-check memang harus kita terapkan. Kamu belajar dari hampir-kesalahan, itu sikap yang benar."',
                                rep: +8, money: 0,
                                lesson: '📚 PELAJARAN: Sistem double-check dalam farmasi adalah standar internasional. Near-miss (hampir salah) harus dilaporkan dan dijadikan pembelajaran, bukan ditutupi.'
                            },
                            {
                                text: '😓 Minta maaf dan bilang masih bingung label obat',
                                outcome: 'neutral',
                                msg: '"Kalau bingung, tanya dulu! Jangan pernah ragu bertanya di bidang medis. Saya akan buatkan panduan pengelompokan obat untukmu."',
                                rep: -3, money: 0,
                                lesson: '📚 PELAJARAN: Di bidang medis, bertanya adalah kewajiban profesional. Tidak tahu dan tidak bertanya adalah kombinasi paling berbahaya.'
                            },
                            {
                                text: '🤥 Pura-pura tahu dan bilang itu tidak akan terjadi lagi',
                                outcome: 'bad',
                                msg: '"Attitude seperti ini yang berbahaya di klinik. Kamu tidak bisa pura-pura di sini. Satu kesalahan bisa renggut nyawa. Kamu saya nonaktifkan hari ini."',
                                rep: -25, money: 0,
                                lesson: '📚 PELAJARAN: Kepura-puraan kompeten (fake it till you make it) tidak berlaku di profesi yang menyangkut keselamatan jiwa. Kejujuran adalah kompetensi pertama.'
                            }
                        ]
                    },
                    {
                        id: 'pt_k_pasien_sulit',
                        title: '😡 Pasien Kasar dan Tidak Sabar',
                        text: 'Seorang pasien marah besar di depanmu.\n\n"Saya sudah nunggu 1 jam lebih! Pelayanan klinik ini payah! Kamu juga tidak ada gunanya di sini!"',
                        img: 'images/lover1boy.png',
                        options: [
                            {
                                text: '💬 Tetap tenang, empati, dan jelaskan situasi antrean',
                                req: { stat: 'reputation', val: 15 },
                                outcome: 'good',
                                msg: 'Pasien mulai tenang. Dr. Budi yang melihat dari jauh tersenyum bangga.\n"Respons terbaikmu sampai saat ini. Kamu punya bakat di bidang ini!"',
                                rep: +12, money: 500,
                                lesson: '📚 PELAJARAN: Empati dan komunikasi yang tenang saat menghadapi pasien yang emosional adalah skill kritis di bidang kesehatan. Ini disebut "de-escalation".'
                            },
                            {
                                text: '🤝 Minta maaf atas penantian dan tawarkan air minum',
                                outcome: 'neutral',
                                msg: '"Kamu berhasil menenangkan situasi. Tindakan kecil seperti menawarkan air menunjukkan kamu peduli pada kenyamanan pasien."',
                                rep: +5, money: 0,
                                lesson: '📚 PELAJARAN: Tindakan kecil yang tulus dalam melayani bisa mengubah pengalaman negatif pasien menjadi positif.'
                            },
                            {
                                text: '😤 Membalas dengan nada defensif',
                                outcome: 'bad',
                                msg: '"Tidak boleh! Di sini pasien adalah prioritas, apapun kondisinya. Attitude seperti itu bisa menghancurkan reputasi klinik!"',
                                rep: -15, money: 0,
                                lesson: '📚 PELAJARAN: Membalas emosi dengan emosi di fasilitas kesehatan adalah pelanggaran etika profesi. Pasien yang sakit secara emosional perlu lebih banyak empati, bukan perlawanan.'
                            }
                        ]
                    }
                ]
            };

            // Tracker konflik hari ini
            function getConflictKey() {
                const jobType = STATE.player.partTimeJob ? 'pt_' + STATE.player.partTimeJob : 'ft';
                return `conflict_day_${STATE.day}_${jobType}`;
            }

            function hasConflictToday() {
                return STATE.player.todayConflict && STATE.player.todayConflict === getConflictKey();
            }

            function markConflictToday() {
                STATE.player.todayConflict = getConflictKey();
            }

            // Pilih konflik random sesuai pekerjaan
            function getRandomConflict(isPartTime, jobKey) {
                let pool;
                if (isPartTime) {
                    pool = WORK_CONFLICTS[jobKey] || [];
                } else {
                    pool = WORK_CONFLICTS.fulltime || [];
                }
                if (pool.length === 0) return null;
                const idx = Math.floor(Math.random() * pool.length);
                return pool[idx];
            }

            // ── TRIGGER KONFLIK KERJA ──────────────────────────────────────────
            function triggerWorkConflict(isPartTime, jobKey) {
                if (hasConflictToday()) return; // Maksimal 1 konflik per hari

                const conflict = getRandomConflict(isPartTime, jobKey);
                if (!conflict) return;

                markConflictToday();

                const jobData = isPartTime ? (PART_TIME_JOBS[jobKey] || {}) : { img: 'images/job.png', name: 'Merchant' };
                const imgSrc = isPartTime ? (jobData.img || 'images/job.png') : 'images/job.png';
                const bossName = isPartTime ? (jobData.name || 'Bos') : 'Pak Hendra (Bos Merchant)';

                const opts = conflict.options.map(opt => {
                    let label = opt.text;
                    if (opt.req) label += ` [${opt.req.stat.toUpperCase()} ${opt.req.val}+]`;

                    return {
                        text: label,
                        action: () => {
                            let success = true;

                            // Cek stat requirement
                            if (opt.req) {
                                const statMap = { str: 'str', int: 'int', biz: 'biz', rep: 'reputation', reputation: 'reputation' };
                                const statKey = statMap[opt.req.stat] || opt.req.stat;
                                const pStat = STATE.player[statKey] || 0;
                                if (pStat < opt.req.val) {
                                    success = false;
                                }
                            }

                            const finalOutcome = success ? opt.outcome : 'bad';
                            const finalRep = success ? opt.rep : -8;
                            const finalMoney = success ? (opt.money || 0) : 0;
                            const finalMsg = success ? opt.msg : `Kemampuanmu belum cukup untuk merespons situasi ini. (Butuh ${opt.req ? opt.req.stat.toUpperCase() + ' ' + opt.req.val : '?'})\n\nBos kecewa dengan responmu.`;
                            const finalLesson = opt.lesson || '';

                            // Terapkan efek reputasi
                            STATE.player.bossReputation = Math.max(0, Math.min(100, (STATE.player.bossReputation || 50) + finalRep));

                            // Terapkan uang bonus/penalti
                            if (finalMoney !== 0) {
                                STATE.player.money = Math.max(0, STATE.player.money + finalMoney);
                                if (finalMoney > 0) showToast(`💰 Bonus Konflik: +${finalMoney.toLocaleString()} G`);
                                else showToast(`💸 Penalti: -${Math.abs(finalMoney).toLocaleString()} G`);
                            }

                            // Promosi jika ada flag
                            const doPromote = success && opt.promote;

                            // Cek ambang batas reputasi
                            const rep = STATE.player.bossReputation;
                            let repMsg = '';
                            if (rep <= 10) {
                                repMsg = '\n\n⚠️ REPUTASI SANGAT RENDAH! Bos mungkin akan memecatmu jika tidak ada perbaikan!';
                            } else if (rep <= 30) {
                                repMsg = '\n\n⚠️ Reputasimu dengan bos menurun drastis. Hati-hati!';
                            } else if (rep >= 90) {
                                repMsg = '\n\n🌟 Reputasimu luar biasa! Bos sangat puas dengan kinerjamu.';
                            }

                            // Icon berdasarkan outcome
                            const outcomeIcon = finalOutcome === 'good' ? '🎉' : finalOutcome === 'neutral' ? '😐' : '😔';

                            closeDialogue();
                            setTimeout(() => {
                                showDialogue(bossName,
                                    `${outcomeIcon} ${finalMsg}${repMsg}\n\n${finalLesson}\n\n📊 Reputasi dengan bos: ${Math.round(STATE.player.bossReputation)}/100`,
                                    [{
                                        text: doPromote ? '🏆 Promosi! Terima kasih Pak!' : 'Mengerti, terima kasih.',
                                        action: () => {
                                            closeDialogue();
                                            if (doPromote) {
                                                const maxLv = 4;
                                                if ((STATE.player.jobLevel || 1) < maxLv) {
                                                    STATE.player.jobLevel = (STATE.player.jobLevel || 1) + 1;
                                                    gainExp(100);
                                                    setTimeout(() => {
                                                        const titles = ['','Magang','Staff Senior','Kepala Gudang','Manajer Cabang'];
                                                        showDialogue('🏆 PROMOSI JABATAN!',
                                                            `Selamat! Kamu resmi dipromosikan!\n\nJabatan baru: **${titles[STATE.player.jobLevel]}**\n\nGaji harianmu otomatis naik mulai besok!\n\n🎊 +100 XP`,
                                                            [{ text: 'Terima kasih!', action: closeDialogue }], imgSrc
                                                        );
                                                    }, 400);
                                                }
                                            }
                                            checkBossReputationThreshold(isPartTime, jobKey, imgSrc, bossName);
                                        }
                                    }], imgSrc
                                );
                            }, 300);
                        }
                    };
                });

                opts.push({
                    text: '🚪 Kabur dari situasi (Rep -5)',
                    action: () => {
                        STATE.player.bossReputation = Math.max(0, (STATE.player.bossReputation || 50) - 5);
                        closeDialogue();
                        showToast('😰 Kamu menghindari konfrontasi. Rep -5');
                        checkBossReputationThreshold(isPartTime, jobKey, imgSrc, bossName);
                    }
                });

                showDialogue(`⚡ KONFLIK KERJA — ${conflict.title}`, conflict.text, opts, imgSrc);
            }

            // ── CEK AMBANG BATAS REPUTASI: BONUS / PERINGATAN / PECAT ───────────
            function checkBossReputationThreshold(isPartTime, jobKey, imgSrc, bossName) {
                const p = STATE.player;
                const rep = p.bossReputation || 50;

                // Jangan spam notifikasi — cek sudah pernah triggered hari ini
                const threshKey = `rep_thresh_${STATE.day}`;
                if (p.lastRepThreshDay === threshKey) return;

                // Dipecat jika rep <= 0
                if (rep <= 0) {
                    p.lastRepThreshDay = threshKey;
                    setTimeout(() => {
                        if (isPartTime) {
                            p.partTimeJob = null;
                            p.partTimeStatus = 'none';
                            p.partTimeShiftStarted = false;
                            showDialogue(`🚨 DIPECAT DARI PART-TIME`,
                                `"Saya sudah cukup sabar. Kamu tidak lagi cocok bekerja di sini.\n\nMulai besok, kamu tidak perlu datang lagi."\n\n💡 Kamu bisa melamar part-time di tempat lain dengan surat lamaran baru.`,
                                [{ text: 'Baik...' , action: closeDialogue }], imgSrc
                            );
                        } else {
                            p.jobStatus = 'fired';
                            p.shiftStarted = false;
                            showDialogue(`🚨 KAMU DIPECAT!`,
                                `Pak Hendra menghampirimu dengan wajah serius.\n\n"Kamu sudah diberikan banyak kesempatan, tapi tidak ada perubahan. Ini surat pemecatan resmimu."\n\n💡 Kamu bisa coba melamar kerja kembali setelah reputasimu pulih.\n\n📚 PELAJARAN: Di dunia nyata, reputasi profesional sangat sulit dibangun kembali setelah hancur. Jaga selalu sikap dan kinerjamu.`,
                                [{ text: 'Baik...' , action: closeDialogue }], imgSrc
                            );
                        }
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                    }, 500);
                    return;
                }

                // Peringatan keras jika rep antara 1–20
                if (rep > 0 && rep <= 20) {
                    p.lastRepThreshDay = threshKey;
                    setTimeout(() => {
                        showDialogue(`⚠️ PERINGATAN KERAS`,
                            `${bossName} memanggil kamu dengan ekspresi serius.\n\n"Reputasimu di sini sangat mengkhawatirkan. Ini peringatan terakhir sebelum saya mengambil keputusan."\n\n📊 Reputasi saat ini: ${Math.round(rep)}/100\n\n💡 Perbaiki sikapmu segera! Selesaikan konflik dengan baik untuk menaikkan reputasi.`,
                            [{ text: 'Saya akan berubah!', action: closeDialogue }], imgSrc
                        );
                    }, 500);
                    return;
                }

                // Bonus gaji jika rep >= 85
                if (rep >= 85) {
                    p.lastRepThreshDay = threshKey;
                    const bonusAmount = isPartTime ? 2000 : 5000;
                    p.money += bonusAmount;
                    setTimeout(() => {
                        showDialogue(`🎉 BONUS KINERJA LUAR BIASA!`,
                            `${bossName} memanggil kamu dengan senyum lebar.\n\n"Kamu adalah karyawan terbaik yang pernah saya punya! Kinerjamu konsisten dan sikapmu profesional. Ini bonus khusus untukmu!"\n\n💰 Bonus Kinerja: +${bonusAmount.toLocaleString()} G\n📊 Reputasi: ${Math.round(rep)}/100\n\n📚 PELAJARAN: Konsistensi dan sikap profesional adalah investasi terbaik dalam karir. Bonus dan promosi datang sendiri pada karyawan yang berintegritas.`,
                            [{ text: 'Terima kasih banyak!', action: closeDialogue }], imgSrc
                        );
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        gainExp(30);
                    }, 500);
                }
            }

            // ── HOOK: PANGGIL KONFLIK SAAT MULAI SHIFT ──────────────────────────
            // Dipanggil dari handleWorkerInteraction (full-time) dan showPartTimeWorkMenu
            function maybeShowWorkConflict(isPartTime, jobKey) {
                if (hasConflictToday()) return;
                // Probabilitas konflik: 65% setiap hari kerja
                const roll = Math.random();
                if (roll < 0.65) {
                    setTimeout(() => triggerWorkConflict(isPartTime, jobKey), 1500);
                }
            }

