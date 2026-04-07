// ========================================================
// js/17_festival_sfx.js
// Festival Sistem & SFX Global
// ========================================================

            // ══════════════════════════════════════════════════════════════
            // 🎉 SISTEM FESTIVAL DESA — GATHERING WARGA & ANIMASI AMBIENT
            // Festival = hari libur semua aktivitas (kerja, kuliah, part-time)
            // NPC berkumpul di alun-alun, partikel khusus, dialog festival
            // ══════════════════════════════════════════════════════════════

            // Titik kumpul alun-alun (di sekitar patung desa, tile coords)
            const FESTIVAL_GATHER_SPOTS = [
                { x: 22, y: 21 }, { x: 24, y: 21 }, { x: 26, y: 21 },
                { x: 22, y: 23 }, { x: 24, y: 23 }, { x: 26, y: 23 },
                { x: 21, y: 22 }, { x: 27, y: 22 }, { x: 23, y: 22 },
                { x: 25, y: 22 }, { x: 22, y: 20 }, { x: 26, y: 20 }
            ];

            // Data festival: partikel, warna, dekorasi, suasana, NPC dialogues
            const FESTIVAL_DATA = {
                'Tahun Baru': {
                    particles: ['🎆','🎇','✨','🌟','💫'],
                    colors: ['#facc15','#f472b6','#60a5fa','#4ade80','#fb923c'],
                    ambient: 'fireworks',
                    suasana: '🎆 Kembang api mewarnai langit desa! Warga bersorak dan saling berpelukan menyambut tahun baru.',
                    npcDialogues: [
                        'Selamat tahun baru! Semoga resolusimu terwujud ya!',
                        'Wah kembang apinya bagus banget! Saya tiap tahun nonton di sini.',
                        'Tahun baru, semangat baru! Kamu sudah buat resolusi belum?',
                        'Alhamdulillah, masih diberi kesempatan menyambut tahun baru bareng warga desa!',
                        'Hei, ingat — tahun baru bukan cuma soal kembang api. Tapi soal menjadi versi lebih baik dari dirimu!',
                        '💡 HINT: Setelah festival, toko-toko kembali buka. Cek Merchant untuk barang diskon tahun baru!',
                    ],
                    hint: '💡 Kamu mendapat Angpao Tahun Baru! Uang awal yang baik untuk memulai tahun.',
                },
                'Festival Bunga': {
                    particles: ['🌸','🌺','🌹','💐','🌼'],
                    colors: ['#f472b6','#fb923c','#e879f9','#fb7185','#fbbf24'],
                    ambient: 'petals',
                    suasana: '🌸 Kelopak bunga beterbangan di udara! Pasangan-pasangan saling memberikan bunga, anak-anak berlarian.',
                    npcDialogues: [
                        'Hari ini hari kasih sayang! Sudah beri bunga untuk orang tersayang?',
                        'Katanya kalau dapat bunga di festival ini, hubungannya akan lebih kuat!',
                        'Lihat tuh, Ayu dan cowoknya lagi berduaan di pojok sana. Imut banget!',
                        'Aku sengaja beli 10 bunga sebelum festival dimulai. Dijual lagi 3x lipat hehe!',
                        'Festival bunga itu pengingat: jangan tunjukkan cintamu cuma sekali setahun!',
                        '🧚 HINT PERI: Widadari Kahyangan Wilis sangat menyukai bunga! Kembangkan Taman di Kahyangan untuk mengundang lebih banyak peri saat musim semi.',
                        '💡 HINT: Berikan bunga ke pasangan/calon pasangan hari ini — efek +Love DOUBLE!',
                    ],
                    hint: '💡 Efek pemberian hadiah ke love interest hari ini 2x lipat! 🧚 Peri suka bunga — kembangkan Taman di Kahyangan Wilis!',
                },
                'Lomba Pacuan Kuda': {
                    particles: ['🐎','💨','🏆','⚡','🌟'],
                    colors: ['#78350f','#fbbf24','#dc2626','#16a34a','#2563eb'],
                    ambient: 'dust',
                    suasana: '🐎 Derap kaki kuda menggemuruh! Penonton berteriak mendukung jagoan masing-masing. Tanah bergetar penuh semangat.',
                    npcDialogues: [
                        'Si Halilintar yang coklat itu favorit saya! Larinya kayak angin!',
                        'Awas judi! Duit segitu mending buat modal usaha daripada taruhan kuda!',
                        'Tahun lalu saya taruhan Si Kancil dan menang 3x lipat. Tahun ini mau coba lagi!',
                        'Ayah saya dulu joki kuda terkenal. Makanya saya paham kuda yang bagus dari gaya jalannya.',
                        'Kamu tahu tidak, pacuan kuda itu olahraga, seni, dan strategi sekaligus!',
                        '💡 HINT: Taruhan lebih dari 1000G dengan peluang 1/3 menang — strategi atau gambling?',
                    ],
                    hint: '💡 Ada 3 kuda dengan peluang menang sama. Pilih bijak!',
                },
                'Lomba Memasak': {
                    particles: ['🍳','🍲','🌶️','🧄','✨'],
                    colors: ['#f97316','#dc2626','#fbbf24','#16a34a','#fff'],
                    ambient: 'smoke',
                    suasana: '🍳 Aroma masakan wangi memenuhi desa! Para juru masak sibuk di depan tungku. Juri berjalan mencicipi tiap hidangan.',
                    npcDialogues: [
                        'Kamu harus coba soto buatan Bu Marina — kalahkan soto mana pun se-desa!',
                        'Masak itu seni. Bukan soal bahan mahal, tapi soal rasa dan cinta yang dimasukkan.',
                        'Saya pernah juara 1 tiga tahun berturut-turut. Rahasianya? Garam secukupnya!',
                        'Anak muda sekarang jarang bisa masak. Belajar masak itu skill hidup penting lho!',
                        'Ada yang bilang makanan terenak adalah yang dimasak dengan tangan sendiri untuk orang yang kamu cintai.',
                        '💡 HINT: Siapkan Ikan Segar sebelum festival untuk ikut lomba masak!',
                    ],
                    hint: '💡 Butuh Ikan Segar + INT tinggi untuk menang lomba memasak!',
                },
                'Buka Giling': {
                    particles: ['🌾','🌽','🍅','🌻','✨'],
                    colors: ['#fbbf24','#84cc16','#f97316','#16a34a','#78350f'],
                    ambient: 'leaves',
                    suasana: '🌾 Seluruh desa bergotong-royong! Suara giling beras dan tawa warga berpadu menjadi simfoni panen raya yang menggembirakan.',
                    npcDialogues: [
                        'Alhamdulillah, panen tahun ini melimpah! Semoga tahun depan lebih baik lagi.',
                        'Waktu kecil saya suka ikut bapak ke sawah saat panen. Nostalgia sekali...',
                        'Kalau panennya bagus, artinya kerjasama desa kita kompak. Itu yang penting!',
                        'Gorki si kurcaci tani terlihat di utara! Katanya dia cuma muncul setahun sekali saat panen raya.',
                        'Jual hasil panen ke Kepala Desa hari ini — harganya lebih tinggi dari biasanya!',
                        '🧚 HINT PERI: Saat panen melimpah, Widadari Kahyangan Wilis turun dari lereng Gunung Wilis! Buka menu Kahyangan untuk mengumpulkan Serbuk Wilis bonus panen hari ini.',
                        '💡 HINT: Setor minimal 5 hasil panen ke Kepala Desa untuk dapat bonus Gold dan Reputasi!',
                    ],
                    hint: '💡 Kurcaci Gorki muncul di area utara hanya saat Panen Raya! 🧚 Kumpulkan Serbuk Wilis bonus di Kahyangan Wilis hari ini!',
                },
                'Festival Ayam': {
                    particles: ['🐔','🥚','🌟','🏆','🎊'],
                    colors: ['#f97316','#fbbf24','#dc2626','#fff','#84cc16'],
                    ambient: 'feathers',
                    suasana: '🐔 Ayam-ayam cantik dipajang di kandang dekorasi! Penonton menilai postur, bulu, dan suara kokok. Berisik tapi seru!',
                    npcDialogues: [
                        'Ayam Bekisar milik Pak Darmo itu keren banget! Suara kokoknya merdu!',
                        'Festival ayam bukan soal aduan — ini soal perawatan dan keindahan ternak.',
                        'Di Jawa, Ayam Bekisar itu simbol kebanggaan. Punya satu saja sudah prestis!',
                        'Kamu punya ayam? Rawat baik-baik, nanti menang kontes bisa dapat hadiah bagus.',
                        'Harga ayam unggul bisa sampai 10x lipat ayam biasa. Itu bisnis yang menjanjikan!',
                        '💡 HINT: Rawat peliharaan ayam sebelum festival untuk bonus kontes!',
                    ],
                    hint: '💡 Rawat hewan peliharaan tiap hari untuk meningkatkan peluang menang kontes!',
                },
                'Lomba Berenang': {
                    particles: ['💧','🏊','🌊','⚡','🏆'],
                    colors: ['#0ea5e9','#38bdf8','#7dd3fc','#fff','#fbbf24'],
                    ambient: 'bubbles',
                    suasana: '🏊 Pantai desa berubah jadi arena olahraga! Penonton berjajar di tepi pantai, berteriak menyemangati perenang.',
                    npcDialogues: [
                        'Pak Nelayan selalu menang lomba renang ini. Tapi tahun ini kayaknya ada saingan baru!',
                        'Renang itu olahraga paling lengkap — melatih semua otot tubuh secara bersamaan.',
                        'Hati-hati ombaknya! Tahun lalu ada yang kram di tengah jalan — untung tertolong.',
                        'Kalau kamu STR-nya tinggi, coba ikut lomba. Hadiahnya berlian lho!',
                        'Saya tidak bisa renang. Makanya saya hanya nonton sambil makan jagung bakar di pinggir.',
                        '🧚 HINT PERI: Ada yang bilang pernah melihat cahaya ungu di permukaan air malam ini... mungkin itu Widadari dari Kahyangan Wilis yang ikut menyaksikan festival! Kunjungi Kahyangan-mu setelah festival.',
                        '💡 HINT: Butuh STR 15+ dan energi 50 untuk mengalahkan Pak Nelayan!',
                    ],
                    hint: '💡 Tingkatkan STR dengan kerja keras sebelum festival berenang! 🧚 Kunjungi Kahyangan Wilis setelah festival untuk kejutan dari para Widadari!',
                },
                'Festival Kembang Api': {
                    particles: ['🎆','🎇','✨','💥','🌟'],
                    colors: ['#facc15','#f472b6','#60a5fa','#4ade80','#fb923c'],
                    ambient: 'fireworks',
                    suasana: '🎆 Langit malam penuh warna! Satu per satu kembang api meledak membentuk pola indah. Wajah warga berseri-seri.',
                    npcDialogues: [
                        'Kembang api ini biayanya mahal lho — ditanggung swadaya warga. Itu namanya gotong royong!',
                        'Setiap warna kembang api punya makna berbeda. Emas = kemakmuran, Merah = keberanian!',
                        'Waktu kecil saya takut suara kembang api. Sekarang malah jadi yang paling semangat nonton!',
                        'Lihat yang itu! Berbentuk bunga! Siapa yang desain ya?',
                        'Momen indah itu perlu dinikmati. Jangan terus-terusan kerja — sesekali berhenti dan lihat ke atas.',
                        '💡 HINT: Beli kembang api kecil dari Merchant untuk acara spesial pribadimu!',
                    ],
                    hint: '💡 Festival ini terbaik dinikmati bersama orang tersayang — ajak love interest-mu!',
                },
                'Festival Musik': {
                    particles: ['🎵','🎶','🎸','🎺','✨'],
                    colors: ['#a855f7','#ec4899','#3b82f6','#fbbf24','#10b981'],
                    ambient: 'notes',
                    suasana: '🎵 Musik mengalun dari segala arah! Ada band dadakan di panggung utama, pengamen di pojok, dan anak-anak menari spontan.',
                    npcDialogues: [
                        'Penyanyi malam ini kabarnya punya suara emas. Jangan lewatkan penampilannya!',
                        'Musik itu bahasa universal — semua orang bisa merasakannya tanpa perlu kata-kata.',
                        'Saya dulu bercita-cita jadi musisi. Tapi ternyata susah hidup dari musik... Tapi aku tidak menyesal mencoba!',
                        'Ada slot penampil dadakan! Kalau berani naik panggung, bisa dapat reputasi besar!',
                        'REP-mu tinggi? Coba naik panggung dan nyanyi. Kamu mungkin berbakat!',
                        '🧚 HINT PERI: Konon suara musik festival bisa terdengar sampai ke Kahyangan Wilis di lereng Gunung Wilis! Para Widadari menari mengikuti alunan. Buka Kahyangan-mu dan kumpulkan Serbuk Wilis — ada bonus kebahagiaan peri hari ini!',
                        '💡 HINT: Butuh REP 10+ untuk naik panggung. Hadiahnya Reputasi besar!',
                    ],
                    hint: '💡 REP tinggi membuka peluang tampil di panggung utama festival! 🧚 Cek Kahyangan Wilis — peri ikut berbahagia saat festival musik!',
                },
                'Pesta Panen Anggur': {
                    particles: ['🍇','🍷','🌿','✨','🌟'],
                    colors: ['#7c3aed','#9333ea','#c084fc','#fbbf24','#dc2626'],
                    ambient: 'leaves',
                    suasana: '🍇 Anggur ungu memerah di seluruh kebun! Warga memetik bersama sambil bernyanyi. Jus anggur segar dibagikan gratis.',
                    npcDialogues: [
                        'Panen anggur tahun ini terbaik dalam 5 tahun terakhir! Lihat warnanya — sempurna!',
                        'Anggur desa kita terkenal di kota karena dirawat dengan cara tradisional.',
                        'Jus anggur ini bisa meningkatkan energimu — minum satu gelas dan coba deh!',
                        'Dari satu pohon anggur bisa dapat puluhan buah. Pertanian itu investasi jangka panjang.',
                        'Kalau musim panen, semua warga bantu memanen. Ini gotong-royong sejati!',
                        '🧚 HINT PERI: Para Widadari Kahyangan Wilis sangat suka Kristal Brantas yang terbentuk dari embun pagi hari panen anggur! Rajin kunjungi Kahyangan dan bangun bangunan untuk mengundang lebih banyak peri berbakat.',
                        '💡 HINT: Energi bertambah setelah minum jus anggur gratis di festival ini!',
                    ],
                    hint: '💡 Energi +20 gratis dari jus anggur festival! 🧚 Panen anggur menghasilkan Kristal Brantas langka di Kahyangan Wilis!',
                },
                'Festival Domba': {
                    particles: ['🐑','🌿','🎊','🌟','⭐'],
                    colors: ['#fff','#f1f5f9','#fbbf24','#84cc16','#60a5fa'],
                    ambient: 'petals',
                    suasana: '🐑 Domba-domba berbulu lebat berjalan anggun melewati penonton. Warga bertepuk tangan dan tertawa melihat tingkah laku lucu mereka.',
                    npcDialogues: [
                        'Domba Pak Hasan yang putih itu juara tiga tahun berturut-turut. Rahasianya? Dimandikan susu!',
                        'Wool dari domba desa bisa dibuat kain yang hangat dan mahal. Bisnis yang menjanjikan!',
                        'Aku suka domba karena matanya yang lembut. Tidak pernah terlihat marah.',
                        'Festival domba ini juga ajang silaturahmi peternak dari desa tetangga.',
                        'Merawat hewan itu mengajarkan tanggung jawab. Bagus untuk karakter seseorang.',
                        '💡 HINT: Punya peliharaan hewan? Rawat setiap hari untuk unlock event khusus!',
                    ],
                    hint: '💡 Peliharaan yang terawat membuka dialog dan bonus event khusus!',
                },
                'Malam Hantu': {
                    particles: ['👻','🎃','🕷️','🦇','💀'],
                    colors: ['#7c3aed','#f97316','#1e293b','#64748b','#a855f7'],
                    ambient: 'dark_sparks',
                    suasana: '🎃 Lentera labu menyala di sepanjang jalan! Anak-anak berpakaian monster berlarian. Ada yang menjerit kaget di pojok gelap.',
                    npcDialogues: [
                        'Trick or Treat! Kasih permen atau aku ganggu tidurmu! 👻',
                        'Katanya malam ini roh leluhur desa mengunjungi kita. Jadi berbuat baiklah!',
                        'Saya tidak percaya hantu. Tapi malam ini... ada yang aneh di arah candi kuno...',
                        'Kostum hantuku bagus kan? Beli dari penjahit Marine — recommended!',
                        'Jangan sendirian ke arah dungeon malam ini. Beneran, bukan bercanda.',
                        '💡 HINT: Beri Coklat ke anak-anak untuk dapat hadiah misterius!',
                    ],
                    hint: '💡 Beri Coklat ke anak-anak = dapat hadiah acak!',
                },
                'Lomba Mancing Es': {
                    particles: ['🎣','❄️','🐟','💎','⛄'],
                    colors: ['#bae6fd','#e0f2fe','#fff','#60a5fa','#38bdf8'],
                    ambient: 'snow',
                    suasana: '❄️ Danau membeku dengan indah! Para pemancing duduk rapi di tepi lubang es, menunggu dengan sabar. Napas mereka mengepul di udara dingin.',
                    npcDialogues: [
                        'Mancing di es itu butuh kesabaran ekstra. Ikan di bawah lebih lambat geraknya karena dingin.',
                        'Katanya ikan paling besar di danau ini belum pernah tertangkap selama 20 tahun!',
                        'Bawa minimal 3 ikan untuk ikut kompetisi. Aku sudah punya 7!',
                        'Suhu hari ini sangat dingin — jaga energimu. Minum teh hangat dulu sebelum mancing.',
                        'Juara mancing Es tahun lalu dapat Scroll EXP langka. Kamu mau coba menangi itu?',
                        '💡 HINT: Kumpulkan 3+ ikan (besar/biasa/legendaris) untuk ikut kompetisi!',
                    ],
                    hint: '💡 Ikan Legendaris memberi poin tertinggi di kompetisi mancing!',
                },
                'Pesta Sup Hangat': {
                    particles: ['🍲','♨️','🌿','✨','🌟'],
                    colors: ['#f97316','#fbbf24','#dc2626','#84cc16','#fff'],
                    ambient: 'smoke',
                    suasana: '🍲 Aroma sup mengepul dari panci-panci besar! Warga duduk melingkar di meja panjang, berbagi makanan hangat di musim dingin.',
                    npcDialogues: [
                        'Sup hangat di musim dingin seperti ini adalah kebahagiaan paling sederhana!',
                        'Resep sup desa ini sudah diwariskan 7 generasi. Tidak berubah sekalipun.',
                        'Makan bersama adalah ikatan sosial yang paling kuat. Lebih kuat dari kontrak manapun.',
                        'Saya sumbang 10 bahan herbal untuk sup malam ini. Kontribusi kecil untuk kebersamaan.',
                        'Di kampung asal saya, pesta seperti ini namanya kenduri. Sama maknanya — berbagi.',
                        '💡 HINT: Energi dan kesehatan pulih penuh setelah ikut pesta sup bersama!',
                    ],
                    hint: '💡 Energi full setelah makan sup bersama warga!',
                },
                'Malam Bintang': {
                    particles: ['🌟','⭐','✨','🌙','💫'],
                    colors: ['#fbbf24','#fff','#e0f2fe','#a855f7','#60a5fa'],
                    ambient: 'snow',
                    suasana: '🌟 Pohon Natal dan bintang-bintang menghiasi alun-alun! Lagu-lagu damai mengalun pelan. Ada kehangatan di setiap sudut desa.',
                    npcDialogues: [
                        'Selamat Malam Bintang! Semoga kebaikan mengisi hatimu hari ini!',
                        'Kado di bawah pohon itu untuk semua warga. Sudah ambil belum?',
                        'Malam ini adalah tentang syukur dan kebersamaan — apapun latar belakangmu.',
                        'Bintang di langit malam ini sangat terang. Katanya itu pertanda tahun depan akan baik.',
                        'Aku simpan satu kado untuk orang yang paling baik hatiku kenal. Itu kamu!',
                        '🧚 HINT PERI: Di Malam Bintang, Cahaya Wilis — sumber daya paling langka Kahyangan — dapat turun dari bintang-bintang! Cek Pohon Kehidupan di Kahyangan Wilis malam ini jika sudah kamu bangun.',
                        '💡 HINT: Buka kado misterius di bawah pohon — hadiah berganti tiap tahun!',
                    ],
                    hint: '💡 Buka kado tahunan misterius — hadiahnya berganti tiap tahun! 🧚 Malam Bintang = kesempatan langka dapat Cahaya Wilis di Kahyangan!',
                },
                'Malam Akhir Tahun': {
                    particles: ['🎆','🎇','🕛','✨','🌟'],
                    colors: ['#facc15','#f472b6','#60a5fa','#4ade80','#fb923c'],
                    ambient: 'fireworks',
                    suasana: '🕛 Hitungan mundur 10... 9... 8...! Seluruh desa berkumpul menunggu detik pergantian tahun. Ada rasa haru dan harapan bercampur.',
                    npcDialogues: [
                        'Tahun yang penuh pelajaran akan berlalu malam ini. Apa pelajaran terbesar yang kamu dapat?',
                        'Resolusiku tahun depan: lebih banyak menabung dan kurang jajan impulsif!',
                        'Lihat! Kembang api dari kota bisa kelihatan dari sini. Indah sekali!',
                        '10... 9... 8... Sebentar lagi! Siap-siap ya!',
                        'Waktu itu tidak bisa dikembalikan. Tapi kita bisa memilih apa yang kita lakukan dengan waktu yang tersisa.',
                        '💡 HINT: Pergantian tahun membawa reset resolusi dan bonus awal tahun baru besok!',
                    ],
                    hint: '💡 Besok adalah Tahun Baru — angpao menunggu di festival!',
                },
            };

            // Helper: ambil data festival hari ini
            function getTodayFestivalData() {
                const dayInSeason = ((STATE.day - 1) % DAYS_PER_SEASON) + 1;
                const calEvent = CALENDAR_EVENTS[STATE.season]?.[dayInSeason];
                if (!calEvent || calEvent.type !== 'festival') return null;
                // Cari matching FESTIVAL_DATA
                const festName = calEvent.name;
                for (const key of Object.keys(FESTIVAL_DATA)) {
                    if (festName.includes(key)) return { ...FESTIVAL_DATA[key], name: calEvent.name, icon: calEvent.icon };
                }
                // Fallback generic
                return { name: calEvent.name, icon: calEvent.icon, particles:['🎉','✨','🌟'], colors:['#fbbf24','#f472b6','#60a5fa'], ambient:'generic', suasana:'🎉 Warga desa berkumpul merayakan festival bersama!', npcDialogues:['Selamat festival!','Senangnya hari ini!','Ikut merayakan yuk!'], hint:'💡 Nikmati festival bersama warga desa!' };
            }

            // State festival aktif
            STATE.festivalActive = false;
            STATE.festivalNPCPositions = {}; // simpan posisi NPC asli
            STATE.festivalParticleTimer = 0;

            // ── AKTIFKAN FESTIVAL: pindahkan NPC ke alun-alun ──────────────
            function activateFestivalGathering(festData) {
                if (STATE.festivalActive) return;
                STATE.festivalActive = true;

                const map = STATE.maps['village'];
                if (!map || !map.npcs) return;

                // Simpan posisi asli & pindahkan NPC ke spot berkumpul
                map.npcs.forEach((npc, i) => {
                    if (npc.x < 0) return; // Skip hidden NPC
                    STATE.festivalNPCPositions[npc.id] = { x: npc.x, y: npc.y, type: npc.type, schedule: npc.schedule };
                    const spot = FESTIVAL_GATHER_SPOTS[i % FESTIVAL_GATHER_SPOTS.length];
                    npc.x = spot.x + (Math.random() > 0.5 ? 1 : -1); // sedikit variasi
                    npc.y = spot.y + (Math.random() > 0.5 ? 1 : -1);
                    npc.type = 'static'; // berhenti wandering
                });

                // Update dialog NPC dengan dialog festival
                STATE.activeFestivalData = festData;

                // Notif opening ceremony
                setTimeout(() => {
                    showDialogue(`${festData.icon} FESTIVAL DIMULAI! — ${festData.name}`,
                        `${festData.suasana}\n\n` +
                        `🔔 Seluruh aktivitas hari ini LIBUR:\n` +
                        `• Shift kerja ditangguhkan\n• Kuliah diliburkan\n• Part-time tidak ada\n\n` +
                        `Gunakan waktu ini untuk menikmati festival bersama warga!\n\n${festData.hint}`,
                        [
                            { text: '🎉 Bergabung ke Alun-alun!', action: () => {
                                closeDialogue();
                                STATE.player.x = 24 * TILE_SIZE;
                                STATE.player.y = 22 * TILE_SIZE;
                                showToast(`${festData.icon} Selamat datang di ${festData.name}!`);
                                // Burst particles
                                for (let i = 0; i < 15; i++) {
                                    setTimeout(() => {
                                        createParticle(
                                            STATE.player.x + (Math.random()-0.5)*100,
                                            STATE.player.y + (Math.random()-0.5)*60,
                                            festData.colors[Math.floor(Math.random()*festData.colors.length)]
                                        );
                                    }, i * 80);
                                }
                            }},
                            { text: '📅 Lihat Acara Festival', action: () => {
                                closeDialogue();
                                // Buka startFestivalEvent
                                const dayInSeason = ((STATE.day - 1) % DAYS_PER_SEASON) + 1;
                                const calEvent = CALENDAR_EVENTS[STATE.season]?.[dayInSeason];
                                if (calEvent) startFestivalEvent(calEvent);
                            }},
                        ], null
                    );
                }, 1200);
            }

            // ── NONAKTIFKAN FESTIVAL: kembalikan NPC ke posisi asal ────────
            function deactivateFestivalGathering() {
                if (!STATE.festivalActive) return;
                STATE.festivalActive = false;
                const map = STATE.maps['village'];
                if (!map || !map.npcs) return;
                map.npcs.forEach(npc => {
                    const saved = STATE.festivalNPCPositions[npc.id];
                    if (saved) {
                        npc.x = saved.x;
                        npc.y = saved.y;
                        npc.type = saved.type;
                        npc.schedule = saved.schedule;
                    }
                });
                STATE.festivalNPCPositions = {};
                STATE.activeFestivalData = null;
            }

            // ── PARTIKEL AMBIENT FESTIVAL (dipanggil dari game loop) ────────
            function updateFestivalAmbientParticles() {
                if (!STATE.festivalActive || !STATE.activeFestivalData) return;
                if (STATE.location !== 'village') return;
                STATE.festivalParticleTimer = (STATE.festivalParticleTimer || 0) + 1;

                const fest = STATE.activeFestivalData;
                const ambient = fest.ambient || 'generic';
                const colors = fest.colors || ['#fbbf24','#f472b6','#60a5fa'];
                const cam = STATE.camera || { x: 0, y: 0 };
                const W = 480, H = 320;

                // Spawn partikel sesuai tipe
                if (STATE.festivalParticleTimer % 8 === 0) { // setiap 8 frame
                    const numSpawn = 3;
                    for (let i = 0; i < numSpawn; i++) {
                        const px = cam.x + Math.random() * W;
                        const py = cam.y + Math.random() * H * 0.6; // mostly upper half

                        if (ambient === 'fireworks') {
                            // Kembang api: meledak dari bawah
                            if (Math.random() < 0.15) { // burst sesekali
                                const burstX = cam.x + Math.random() * W;
                                const burstY = cam.y + Math.random() * H * 0.4;
                                for (let j = 0; j < 8; j++) {
                                    STATE.particles.push({
                                        x: burstX, y: burstY,
                                        vx: (Math.random()-0.5)*6,
                                        vy: (Math.random()-0.5)*6,
                                        life: 25 + Math.random()*10,
                                        color: colors[Math.floor(Math.random()*colors.length)],
                                        size: 3
                                    });
                                }
                            }
                        } else if (ambient === 'petals') {
                            // Kelopak bunga: jatuh perlahan dengan sedikit drift
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y - 10,
                                vx: (Math.random()-0.5)*1.5,
                                vy: 0.8 + Math.random()*0.8,
                                life: 60 + Math.random()*30,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 4,
                                drift: true
                            });
                        } else if (ambient === 'snow') {
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y - 10,
                                vx: (Math.random()-0.5)*1.2,
                                vy: 0.6 + Math.random()*0.6,
                                life: 80,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 3
                            });
                        } else if (ambient === 'leaves') {
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y - 10,
                                vx: (Math.random()-0.5)*2.5,
                                vy: 1.0 + Math.random()*1.5,
                                life: 50,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 5,
                                spin: true
                            });
                        } else if (ambient === 'notes') {
                            // Musik notes melayang naik
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y + H * 0.8,
                                vx: (Math.random()-0.5)*1.5,
                                vy: -(0.8 + Math.random()*1.2),
                                life: 50,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 4
                            });
                        } else if (ambient === 'bubbles') {
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y + H,
                                vx: (Math.random()-0.5)*1.2,
                                vy: -(1.0 + Math.random()*1.0),
                                life: 45,
                                color: '#7dd3fc',
                                size: 5 + Math.random()*4
                            });
                        } else if (ambient === 'dark_sparks') {
                            // Halloween — gelap + percikan ungu/oranye
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y + Math.random() * H,
                                vx: (Math.random()-0.5)*3,
                                vy: (Math.random()-0.5)*3,
                                life: 20 + Math.random()*15,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 2 + Math.random()*3
                            });
                        } else if (ambient === 'smoke') {
                            // Asap memasak — melayang ke atas
                            STATE.particles.push({
                                x: cam.x + Math.random() * W * 0.5 + W * 0.25,
                                y: cam.y + H * 0.7,
                                vx: (Math.random()-0.5)*0.8,
                                vy: -(0.5 + Math.random()*0.5),
                                life: 70,
                                color: 'rgba(200,200,200,0.4)',
                                size: 7 + Math.random()*5
                            });
                        } else if (ambient === 'dust') {
                            // Debu pacuan kuda
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y + H * 0.8 + Math.random() * H * 0.2,
                                vx: 2 + Math.random()*2,
                                vy: -(0.3 + Math.random()*0.5),
                                life: 25,
                                color: '#d97706',
                                size: 4 + Math.random()*4
                            });
                        } else {
                            // Generic — confetti
                            STATE.particles.push({
                                x: cam.x + Math.random() * W,
                                y: cam.y - 10,
                                vx: (Math.random()-0.5)*2,
                                vy: 1 + Math.random()*1.5,
                                life: 50,
                                color: colors[Math.floor(Math.random()*colors.length)],
                                size: 4
                            });
                        }
                    }
                }
            }

            // ── HOOK: NPC DIALOG SAAT FESTIVAL ─────────────────────────────
            function getFestivalNPCDialogue(npcId) {
                if (!STATE.festivalActive || !STATE.activeFestivalData) return null;
                const dialogues = STATE.activeFestivalData.npcDialogues || [];
                if (dialogues.length === 0) return null;
                // Pilih dialog berdasarkan NPC ID hash (deterministik per hari)
                const hash = (npcId || '').split('').reduce((a,c) => a + c.charCodeAt(0), 0);
                return dialogues[(hash + STATE.day) % dialogues.length];
            }

            // ── TRIGGER FESTIVAL DI AWAL HARI ──────────────────────────────
            // ── REMINDER FESTIVAL H-1 via Sistem Pesan HP ─────────────────
            function checkFestivalReminder() {
                const totalDays = STATE.day - 1; // hari ke-0 based
                const dayInSeason = (totalDays % DAYS_PER_SEASON) + 1;
                const seasonIdx = Math.floor((totalDays % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
                const season = SEASONS[seasonIdx];

                // Cek hari BESOK
                const nextDayInSeason = (dayInSeason % DAYS_PER_SEASON) + 1;
                const nextSeasonEvents = CALENDAR_EVENTS[season] || {};
                const tomorrowEvent = nextSeasonEvents[nextDayInSeason];

                if (!tomorrowEvent || tomorrowEvent.type !== 'festival') return;

                // Hindari duplikat reminder di hari yang sama
                const reminderKey = `reminder_${season}_${nextDayInSeason}`;
                if (STATE.player[reminderKey]) return;
                STATE.player[reminderKey] = true;

                // Petunjuk persiapan per festival
                const hints = {
                    'Memasak':   '🐟 Siapkan Ikan Segar di inventory untuk ikut lomba!',
                    'Berenang':  '💪 Pastikan STR kamu ≥15 untuk bisa menang!',
                    'Bunga':     '🌹 Beli bunga dari toko sebelum festival dimulai!',
                    'Panen':     '🌾 Kumpulkan hasil panen untuk disetor ke Kepala Desa!',
                    'Musik':     '🎤 REP ≥10 dibutuhkan untuk tampil di panggung!',
                    'Mancing':   '🎣 Kumpulkan 3 ikan dulu sebelum festival besok!',
                    'Kuda':      '💰 Siapkan 500G untuk taruhan pacuan kuda!',
                    'Ayam':      '🐔 Rawat hewan peliharaan hari ini untuk bonus kontes!',
                    'Tahun Baru':'🎆 Besok libur total — nikmati kembang api bersama warga!',
                };
                let hint = '✨ Hadir di alun-alun untuk bergabung dengan warga!';
                for (const [key, val] of Object.entries(hints)) {
                    if (tomorrowEvent.name.includes(key)) { hint = val; break; }
                }

                // Kirim ke sistem pesan HP yang sudah ada
                if (!STATE.player.messages) STATE.player.messages = [];
                STATE.player.messages.push({
                    from: '📅 Kalender Desa',
                    text: `${tomorrowEvent.icon} BESOK: ${tomorrowEvent.name}!\n\n${hint}\n\nJangan sampai ketinggalan — festival hanya berlangsung 1 hari!`,
                    time: Date.now(),
                    read: false
                });

                // Toast notification
                showToast(`🔔 Reminder: Besok ada ${tomorrowEvent.icon} ${tomorrowEvent.name}! Cek HP untuk tips persiapan.`);
            }

            function checkAndStartFestival() {
                const fest = getTodayFestivalData();
                if (!fest) {
                    // Bukan festival — deactivate jika masih aktif
                    if (STATE.festivalActive) deactivateFestivalGathering();
                    return;
                }
                // Cek apakah sudah pernah start hari ini
                if (STATE.lastFestivalDay === STATE.day) return;
                STATE.lastFestivalDay = STATE.day;
                activateFestivalGathering(fest);
            }

            // ── BLOK SHIFT/KULIAH SAAT FESTIVAL ────────────────────────────
            function isFestivalDayToday() {
                return !!getTodayFestivalData();
            }

            // ── BLOK SHIFT/KULIAH SAAT FESTIVAL ────────────────────────────
            function isFestivalDayToday() {
                return !!getTodayFestivalData();
            }

            // ── HELPER: BUAT OPSI FESTIVAL KHUSUS ROLE ─────────────────────
            function getRoleFestivalOption(festivalType) {
                const p = STATE.player;
                const role = p.role;
                if (role === 'none') return null;

                const options = {
                    'Musik': {
                        'student': {
                            req: p.int >= 12,
                            text: `🎓 [SISWA] Baca Puisi di Panggung (INT ${p.int})`,
                            reqLabel: 'INT 12+',
                            action: () => {
                                const score = (p.int || 0) + Math.floor(Math.random() * 25);
                                if (score >= 22) {
                                    p.reputation = (p.reputation || 0) + 15; p.int = (p.int || 0) + 2;
                                    showDialogue('🎤 STANDING OVATION!',
                                        'Puisimu tentang tekanan akademik menyentuh hati semua orang!\n\n+15 REP · +2 INT\n\n📚 Keberanian berekspresi di depan umum membangun kepercayaan diri yang tak ternilai.',
                                        [{ text: 'Terharu!', action: closeDialogue }]);
                                } else {
                                    p.reputation = (p.reputation || 0) + 5;
                                    showDialogue('🎵 Penampilan Lumayan',
                                        'Kamu grogi tapi tetap selesai tampil. Penonton bertepuk tangan sopan.\n\n+5 REP\n\n📚 Berani mencoba sudah setengah keberhasilan!',
                                        [{ text: 'Lumayan!', action: closeDialogue }]);
                                }
                            }
                        },
                        'entrepreneur': {
                            req: p.biz >= 8,
                            text: `💼 [WIRAUSAHA] Buka Lapak Merchandise (BIZ ${p.biz})`,
                            reqLabel: 'BIZ 8+',
                            action: () => {
                                const profit = 400 + (p.biz || 0) * 60;
                                p.money += profit; p.biz = (p.biz || 0) + 2;
                                showToast(`💰 Lapak merchandise laris! +${profit} G · +2 BIZ`);
                                closeDialogue();
                            }
                        },
                        'worker': {
                            req: p.str >= 10,
                            text: `⚔️ [PEKERJA] Jadi Security Festival (STR ${p.str})`,
                            reqLabel: 'STR 10+',
                            action: () => {
                                p.money += 350; p.str = (p.str || 0) + 1;
                                showToast('💪 Tugas security selesai! +350G · +1 STR');
                                closeDialogue();
                            }
                        },
                        'family': {
                            req: (p.reputation || 0) >= 15,
                            text: `🏠 [KELUARGA] Ajak Keluarga Nonton Bersama`,
                            reqLabel: 'REP 15+',
                            action: () => {
                                p.reputation = (p.reputation || 0) + 10;
                                const spouseId = p.spouseId;
                                if (spouseId && p.relationships) p.relationships[spouseId] = Math.min(100, (p.relationships[spouseId] || 0) + 8);
                                showToast('❤️ Momen indah bersama keluarga! +10 REP · +8 Love');
                                closeDialogue();
                            }
                        }
                    },
                    'Memasak': {
                        'student': {
                            req: (p.int || 0) >= 15 && (p.inventory['ikan_segar'] || 0) > 0,
                            text: `🎓 [SISWA] Presentasi Teknik Masak (INT ${p.int})`,
                            reqLabel: 'INT 15+ & Ikan',
                            action: () => {
                                p.inventory['ikan_segar'] = (p.inventory['ikan_segar'] || 1) - 1;
                                const score = (p.int || 0) + Math.floor(Math.random() * 20);
                                if (score >= 30) {
                                    p.int = (p.int || 0) + 3; addItem('scroll_exp', 1);
                                    showDialogue('🏆 JUARA INOVASI!', 'Teknik masakmu berbasis sains bikin juri kagum!\n\n+3 INT · Gulungan EXP', [{ text: 'Mantap!', action: closeDialogue }]);
                                } else {
                                    p.int = (p.int || 0) + 1;
                                    showDialogue('📚 Pengalaman Berharga', 'Eksperimenmu menarik meski belum sempurna.\n\n+1 INT', [{ text: 'Belajar terus!', action: closeDialogue }]);
                                }
                            }
                        },
                        'entrepreneur': {
                            req: (p.biz || 0) >= 5,
                            text: `💼 [WIRAUSAHA] Jual Bumbu Rahasia (BIZ ${p.biz})`,
                            reqLabel: 'BIZ 5+',
                            action: () => {
                                const profit = 300 + (p.biz || 0) * 80;
                                p.money += profit; p.biz = (p.biz || 0) + 1;
                                showToast(`🌶️ Bumbu laris! +${profit} G · +1 BIZ`);
                                closeDialogue();
                            }
                        },
                        'worker': {
                            req: (p.str || 0) >= 12,
                            text: `⚔️ [PEKERJA] Jadi Tukang Angkut Peralatan (STR ${p.str})`,
                            reqLabel: 'STR 12+',
                            action: () => {
                                p.money += 400; p.str = (p.str || 0) + 2; p.energy = Math.max(0, p.energy - 20);
                                showToast('💪 Kerja keras terbayar! +400G · +2 STR');
                                closeDialogue();
                            }
                        },
                        'family': {
                            req: true,
                            text: `🏠 [KELUARGA] Masak Bersama Pasangan`,
                            reqLabel: '',
                            action: () => {
                                p.energy = Math.min(100, p.energy + 30); p.reputation = (p.reputation || 0) + 8;
                                const spouseId = p.spouseId;
                                if (spouseId && p.relationships) p.relationships[spouseId] = Math.min(100, (p.relationships[spouseId] || 0) + 12);
                                showToast('❤️ Masak bareng pasangan! +30 Energi · +8 REP · +12 Love');
                                closeDialogue();
                            }
                        }
                    },
                    'Panen': {
                        'student': {
                            req: (p.int || 0) >= 10,
                            text: `🎓 [SISWA] Dokumentasi Proses Panen (INT ${p.int})`,
                            reqLabel: 'INT 10+',
                            action: () => {
                                gainExp(30); p.int = (p.int || 0) + 1;
                                p.achievementPoints = (p.achievementPoints || 0) + 5;
                                showToast('📸 Dokumentasi panen untuk portofolio! +30 EXP · +1 INT · +5 AP');
                                closeDialogue();
                            }
                        },
                        'entrepreneur': {
                            req: (p.biz || 0) >= 5,
                            text: `💼 [WIRAUSAHA] Buka Lapak Dadakan Hasil Panen (BIZ ${p.biz})`,
                            reqLabel: 'BIZ 5+',
                            action: () => {
                                const items = Object.entries(p.inventory || {}).filter(([k,v]) => ['beras','jagung_panen','tomat_panen'].includes(k) && v > 0);
                                if (items.length === 0) { showToast('Tidak ada hasil panen di inventory!'); return; }
                                let totalProfit = 0;
                                items.forEach(([k, v]) => {
                                    const price = k === 'beras' ? 80 : k === 'jagung_panen' ? 60 : 70;
                                    totalProfit += price * v * 2; // Harga festival 2x lipat!
                                    p.inventory[k] = 0;
                                });
                                p.money += totalProfit; p.biz = (p.biz || 0) + 2;
                                showDialogue('🛒 LAPAK LARIS!',
                                    `Semua hasil panenmu terjual dengan harga festival (2x lipat)!\n\n+${totalProfit} G · +2 BIZ\n\n📚 Festival adalah momen pasar terbaik — supply sedikit, demand tinggi!`,
                                    [{ text: 'Cuan!', action: closeDialogue }]);
                            }
                        },
                        'worker': {
                            req: (p.str || 0) >= 8,
                            text: `⚔️ [PEKERJA] Bantu Angkut Hasil Panen (STR ${p.str})`,
                            reqLabel: 'STR 8+',
                            action: () => {
                                const wage = 300 + (p.str || 0) * 40;
                                p.money += wage; p.str = (p.str || 0) + 1;
                                showToast(`💪 Bantu panen selesai! +${wage} G · +1 STR`);
                                closeDialogue();
                            }
                        },
                        'family': {
                            req: true,
                            text: `🏠 [KELUARGA] Gotong Royong Bersama Tetangga`,
                            reqLabel: '',
                            action: () => {
                                p.reputation = (p.reputation || 0) + 15;
                                addItem('beras', 3);
                                showToast('🤝 Gotong royong! +15 REP · +3 Beras');
                                closeDialogue();
                            }
                        }
                    },
                    'Bunga': {
                        'student': {
                            req: (p.int || 0) >= 8,
                            text: `🎓 [SISWA] Tulis Puisi Cinta (INT ${p.int})`,
                            reqLabel: 'INT 8+',
                            action: () => {
                                p.int = (p.int || 0) + 1; p.reputation = (p.reputation || 0) + 8;
                                const spouseId = p.spouseId;
                                if (spouseId && p.relationships) p.relationships[spouseId] = Math.min(100, (p.relationships[spouseId] || 0) + 20);
                                showToast('✍️ Puisi cintamu menyentuh hati! +1 INT · +8 REP · +20 Love');
                                closeDialogue();
                            }
                        },
                        'entrepreneur': {
                            req: (p.inventory['bunga'] || 0) > 0 || (p.biz || 0) >= 5,
                            text: `💼 [WIRAUSAHA] Jual Bunga Harga Festival (3x)`,
                            reqLabel: 'Punya Bunga atau BIZ 5+',
                            action: () => {
                                const jumlah = p.inventory['bunga'] || 0;
                                if (jumlah > 0) {
                                    const profit = jumlah * 300; // 3x harga normal
                                    p.inventory['bunga'] = 0; p.money += profit; p.biz = (p.biz || 0) + 1;
                                    showToast(`🌸 Bunga terjual 3x lipat! +${profit} G · +1 BIZ`);
                                } else {
                                    showToast('Tidak ada bunga di inventory!');
                                }
                                closeDialogue();
                            }
                        },
                        'worker': {
                            req: true,
                            text: `⚔️ [PEKERJA] Bantu Dekorasi Venue Festival`,
                            reqLabel: '',
                            action: () => {
                                p.money += 250; p.reputation = (p.reputation || 0) + 5;
                                showToast('🎀 Dekorasi selesai! +250G · +5 REP');
                                closeDialogue();
                            }
                        },
                        'family': {
                            req: !!p.spouseId,
                            text: `🏠 [KELUARGA] Rayakan Bersama Pasangan (Love 2x)`,
                            reqLabel: 'Sudah menikah',
                            action: () => {
                                const spouseId = p.spouseId;
                                if (spouseId && p.relationships) {
                                    p.relationships[spouseId] = Math.min(100, (p.relationships[spouseId] || 0) + 25);
                                }
                                p.reputation = (p.reputation || 0) + 10;
                                showToast('❤️ Momen romantis! +25 Love · +10 REP');
                                closeDialogue();
                            }
                        }
                    }
                };

                const festOpts = options[festivalType];
                if (!festOpts) return null;
                const roleOpt = festOpts[role];
                if (!roleOpt) return null;

                const reqMet = roleOpt.req;
                const label = reqMet
                    ? roleOpt.text
                    : `${roleOpt.text} [Butuh: ${roleOpt.reqLabel}] 🔒`;

                return {
                    text: label,
                    action: reqMet ? roleOpt.action : () => {
                        showToast(`Butuh ${roleOpt.reqLabel} untuk pilihan ini!`);
                    }
                };
            }

            // 2. LOGIKA EVENT FESTIVAL
            function startFestivalEvent(eventData) {
                const p = STATE.player;
                const name = eventData.name;

                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                createParticle(p.x, p.y, '#facc15');
                createParticle(p.x + 10, p.y - 10, '#f472b6');
                createParticle(p.x - 10, p.y - 10, '#60a5fa');

                // 1. TAHUN BARU
                if (name.includes("Tahun Baru")) {
                    showDialogue("FESTIVAL TAHUN BARU",
                        "Kembang api menghiasi langit siang ini! (Imajiner)\nKepala Desa membagikan **Angpao** untuk modal awal tahun.",
                        [{
                            text: "Terima Angpao (+2000 G)",
                            action: () => {
                                p.money += 2000;
                                showToast("Dapat Angpao 2000G! 🧧");
                                closeDialogue();
                            }
                        }], 'images/statue.png');
                }
                // 2. VALENTINE
                else if (name.includes("Valentine") || name.includes("Bunga")) {
                    const roleOpt = getRoleFestivalOption('Bunga');
                    const bungaOpts = [
                        {
                            text: "Beli Bunga Spesial (100 G)",
                            action: () => {
                                if (p.money >= 100) {
                                    p.money -= 100;
                                    addItem('bunga', 3);
                                    showToast("Dapat 3 Bunga Mawar! 🌹");
                                    showDialogue("ROMANTIS", "Berikan bunga ini pada orang yang kamu sukai. Efek cintanya 2x lipat hari ini!", [{ text: "Siap!", action: closeDialogue }], 'images/bunga.png');
                                } else showToast("Uang tidak cukup.");
                            }
                        },
                        roleOpt,
                        { text: "Hanya melihat-lihat", action: closeDialogue }
                    ].filter(Boolean);
                    showDialogue("FESTIVAL KASIH SAYANG",
                        `Hari ini adalah hari terbaik untuk mengungkapkan perasaan.\nBunga Mawar dijual murah khusus hari ini!\n\n✨ Role ${(p.role||'none').toUpperCase()} punya cara spesial merayakan festival ini!`,
                        bungaOpts, 'images/bunga.png');
                }
                // 3. PACUAN KUDA
                else if (name.includes("Pacuan Kuda")) {
                    const horses = ["Si Kancil (Hitam)", "Bintang (Putih)", "Halilintar (Coklat)"];
                    const opts = horses.map(h => ({
                        text: `Taruhan: ${h} (500 G)`,
                        action: () => {
                            if (p.money >= 500) {
                                p.money -= 500;
                                const winnerIdx = Math.floor(Math.random() * horses.length);
                                const winnerName = horses[winnerIdx];
                                if (h === winnerName) {
                                    const prize = 2000;
                                    p.money += prize;
                                    showDialogue("MENANG BESAR! 🏆", `Kudamu **${h}** finish di posisi pertama!\nHadiah: ${prize} G`, [{ text: "Yesss!", action: closeDialogue }], 'images/kuda.png');
                                } else {
                                    showDialogue("KALAH...", `Pemenangnya adalah **${winnerName}**.\nKudamu finish di posisi terakhir. Uang hangus.`, [{ text: "Sial...", action: closeDialogue }], 'images/kuda.png');
                                }
                            } else showToast("Uang kurang.");
                        }
                    }));
                    opts.push({ text: "Nonton saja", action: closeDialogue });
                    showDialogue("PACUAN KUDA DESA", "Ayo dukung kuda jagoanmu! Tiket taruhan 500 G.", opts, 'images/kuda.png');
                }
                // 4. LOMBA MEMASAK
                else if (name.includes("Memasak")) {
                    const roleOpt = getRoleFestivalOption('Memasak');
                    const opts = [
                        {
                            text: "Ikut Lomba (Butuh Ikan + INT)",
                            action: () => {
                                if ((p.inventory['ikan_segar'] || 0) > 0) {
                                    p.inventory['ikan_segar']--;
                                    const score = Math.floor(Math.random() * 50) + p.int;
                                    if (score > 60) {
                                        addItem('tonic_stamina', 3);
                                        showDialogue("JUARA 1! 👨‍🍳", `Rasanya sempurna! Juri menangis terharu.\nHadiah: **3 Tonic Stamina**.`, [{ text: "Hore!", action: closeDialogue }], 'images/dapurayaayu.png');
                                    } else if (score > 30) {
                                        addItem('gandum', 2);
                                        showDialogue("JUARA HARAPAN", "Rasanya lumayan, tapi kurang asin.\nHadiah: **2 Gandum**.", [{ text: "Lumayan", action: closeDialogue }], 'images/dapurayaayu.png');
                                    } else {
                                        showDialogue("GOSONG...", "Masakanmu gosong. Juri sakit perut. Kamu didiskualifikasi.", [{ text: "Maaf...", action: closeDialogue }], 'images/tungku.png');
                                    }
                                } else {
                                    showToast("Kamu tidak punya Ikan Segar!");
                                }
                            }
                        },
                        roleOpt,
                        {
                            text: "Jadi Penonton (Makan Gratis)", action: () => {
                                p.energy = 100;
                                showToast("Kenyang makan tester! Energi Full.");
                                closeDialogue();
                            }
                        }
                    ].filter(Boolean);
                    showDialogue("KITCHEN STADIUM", `Tema tahun ini: **Sup Ikan**. Juri akan menilai bahan dan skill memasakmu.\n\n✨ Role kamu (${(p.role||'none').toUpperCase()}) punya cara tersendiri untuk berpartisipasi!`, opts, 'images/dapurayaayu.png');
                }
                // 5. FESTIVAL AYAM
                else if (name.includes("Ayam")) {
                    const hasPetChicken = p.dailyTalkCount > 0;
                    if (hasPetChicken) {
                        showDialogue("KONTES AYAM", "Ayam milikmu terlihat sehat dan bahagia! Juri terkesan.", [{
                            text: "Terima Hadiah Telur Emas (500G)",
                            action: () => {
                                p.money += 500;
                                showToast("Hadiah Juara: 500 G");
                                closeDialogue();
                            }
                        }], 'images/ayam.png');
                    } else {
                        showDialogue("KONTES AYAM", "Kamu tidak membawa ayam atau belum merawat ayam hari ini.\nNonton saja ya.", [{ text: "Oke", action: closeDialogue }], 'images/ayam.png');
                    }
                }
                // 6. LOMBA BERENANG
                else if (name.includes("Berenang")) {
                    showDialogue("LOMBA RENANG PANTAI", "Siapa yang paling kuat menahan napas dan berenang ke tengah laut?",
                        [{
                            text: "Ikut Lomba (Butuh 50 Energi)",
                            action: () => {
                                if (p.energy >= 50) {
                                    p.energy -= 40;
                                    if (p.str >= 15) {
                                        addItem('permata', 1);
                                        showDialogue("JUARA RENANG! 🏊", "Ototmu luar biasa! Kamu mengalahkan Pak Nelayan.\nHadiah: **1 Berlian**.", [{ text: "Segar!", action: closeDialogue }], 'images/pantai-boy.png');
                                    } else {
                                        showDialogue("KALAH...", "Kamu kram di tengah jalan dan harus ditolong tim SAR.\nLatih lagi STR-mu.", [{ text: "Malu...", action: closeDialogue }], 'images/pantai-boy.png');
                                    }
                                } else showToast("Energimu kurang untuk lomba.");
                            }
                        }, { text: "Batal", action: closeDialogue }], 'images/pantai-girl.png');
                }
                // 7. HALLOWEEN
                else if (name.includes("Hantu") || name.includes("Halloween")) {
                    showDialogue("MALAM HANTU 🎃", "Anak-anak berkeliaran pakai kostum. 'Trick or Treat!'",
                        [
                            {
                                text: "Beri Permen (Coklat) -> Dapat Hadiah",
                                action: () => {
                                    if ((p.inventory['coklat'] || 0) > 0) {
                                        p.inventory['coklat']--;
                                        const rewards = ['besi', 'kain', 'gandum'];
                                        const reward = rewards[Math.floor(Math.random() * rewards.length)];
                                        addItem(reward, 2);
                                        showDialogue("TRICK OR TREAT!", `Anak-anak senang! Mereka memberimu **2 ${reward.toUpperCase()}** sebagai balasan.`, [{ text: "Seru!", action: closeDialogue }], 'images/anakkecil1.png');
                                    } else {
                                        showToast("Kamu tidak punya Coklat!");
                                    }
                                }
                            },
                            {
                                text: "Minta Permen (Dikasih Sampah)",
                                action: () => {
                                    showDialogue("ZONK", "Kamu kan sudah gede! Nih dikasih bungkusnya aja.", [{ text: "Pelit...", action: closeDialogue }], 'images/monster.png');
                                }
                            }
                        ], 'images/monster.png');
                }
                // 8. MANCING ES
                else if (name.includes("Mancing")) {
                    showDialogue("TURNAMEN MANCING ES", "Danau membeku, ikan-ikan bersembunyi di dalam. Siapa dapat ikan paling banyak?",
                        [{
                            text: "Setor Ikan (Dari Tas)",
                            action: () => {
                                const fish = (p.inventory['ikan_segar'] || 0) + (p.inventory['ikan_besar'] || 0) + (p.inventory['ikan_legendary'] || 0);
                                if (fish >= 3) {
                                    addItem('scroll_exp', 1);
                                    showDialogue("PEMANCING HANDAL 🎣", `Kamu membawa ${fish} ikan! Juri takjub.\nHadiah: **Gulungan Kuno (+EXP)**.`, [{ text: "Mantap", action: closeDialogue }], 'images/rakpialaikan.png');
                                } else {
                                    showDialogue("KURANG...", "Minimal bawa 3 ikan untuk ikut penilaian.", [{ text: "Aku mancing dulu", action: closeDialogue }], 'images/emberikan.png');
                                }
                            }
                        }, { text: "Batal", action: closeDialogue }], 'images/rakpancing.png');
                }
                // 9. NATAL
                else if (name.includes("Natal") || name.includes("Bintang")) {
                    showDialogue("MALAM BINTANG 🌟", "Pohon Natal raksasa berdiri di alun-alun. Ada kado di bawahnya untukmu.",
                        [{
                            text: "Buka Kado Misterius 🎁",
                            action: () => {
                                const year = Math.ceil(STATE.day / 120);
                                if (p.lastXmasYear !== year) {
                                    p.lastXmasYear = year;
                                    const randGift = Math.random() < 0.5 ? 'cincin_kayu' : 'baju_hangat';
                                    if (randGift === 'cincin_kayu') {
                                        addItem('cincin_kayu', 1);
                                        showDialogue("SELAMAT NATAL!", "Kamu mendapat **Cincin Kayu**! Bisa dipakai melamar seseorang.", [{ text: "Terima kasih Santa!", action: closeDialogue }], 'images/lemari.png');
                                    } else {
                                        addItem('kain', 3);
                                        showDialogue("SELAMAT NATAL!", "Kamu mendapat **3 Kain Sutra**! Hangat sekali.", [{ text: "Terima kasih!", action: closeDialogue }], 'images/lemari.png');
                                    }
                                } else {
                                    showToast("Kamu sudah ambil kado tahun ini!");
                                    closeDialogue();
                                }
                            }
                        }], 'images/statue.png');
                }
                // 9. NATAL
                else if (name.includes("Natal") || name.includes("Bintang")) {
                    showDialogue("MALAM BINTANG 🌟", "Pohon Natal raksasa berdiri di alun-alun. Ada kado di bawahnya untukmu.",
                        [{
                            text: "Buka Kado Misterius 🎁",
                            action: () => {
                                const year = Math.ceil(STATE.day / 120);
                                if (p.lastXmasYear !== year) {
                                    p.lastXmasYear = year;
                                    const randGift = Math.random() < 0.5 ? 'cincin_kayu' : 'baju_hangat';
                                    if (randGift === 'cincin_kayu') {
                                        addItem('cincin_kayu', 1);
                                        showDialogue("SELAMAT NATAL!", "Kamu mendapat **Cincin Kayu**! Bisa dipakai melamar seseorang.", [{ text: "Terima kasih Santa!", action: closeDialogue }], 'images/lemari.png');
                                    } else {
                                        addItem('kain', 3);
                                        showDialogue("SELAMAT NATAL!", "Kamu mendapat **3 Kain Sutra**! Hangat sekali.", [{ text: "Terima kasih!", action: closeDialogue }], 'images/lemari.png');
                                    }
                                } else {
                                    showToast("Kamu sudah ambil kado tahun ini!");
                                    closeDialogue();
                                }
                            }
                        }], 'images/statue.png');
                }
                // 10. PANEN RAYA / BUKA GILING
                else if (name.includes("Panen Raya") || name.includes("Buka Giling")) {
                    const kurcaciHint = STATE.player.hiredDwarf
                        ? "✅ Kurcaci Gorki sudah bekerja di ladangmu! Temui dia di area ladang untuk hadiah tahunan 🌾"
                        : "💡 **Kurcaci Tani Gorki** ada di sini hari ini! Cari dia di utara desa — dia hanya muncul setahun sekali!";
                    const roleOpt = getRoleFestivalOption('Panen');
                    const panenOpts = [
                        {
                            text: "Setor Panen (Beras/Jagung/Tomat)",
                            action: () => {
                                const berasQty = p.inventory['beras'] || 0;
                                const jagungQty = p.inventory['jagung_panen'] || 0;
                                const tomatQty = p.inventory['tomat_panen'] || 0;
                                const total = berasQty + jagungQty + tomatQty;
                                if (total >= 5) {
                                    p.inventory['beras'] = 0; p.inventory['jagung_panen'] = 0; p.inventory['tomat_panen'] = 0;
                                    const reward = Math.floor(total * 150);
                                    p.money += reward;
                                    gainExp(30);
                                    p.reputation = (p.reputation || 0) + 10;
                                    showDialogue("🏆 JUARA PANEN!", `Kepala Desa kagum! Kamu menyetor ${total} hasil panen.\n\nHadiah: **+${reward} Gold** + **30 EXP** + **Reputasi +10**\n\n"Petani sejati ada di hatimu, Nak!"`, [{ text: "Hore! 🌾", action: closeDialogue }], 'images/statue.png');
                                } else {
                                    showDialogue("KURANG...", `Kamu perlu minimal 5 hasil panen (Beras/Jagung/Tomat) untuk ikut kompetisi.\n\nPanenmu sekarang: ${total} buah.`, [{ text: "Baik, nanti lagi", action: closeDialogue }], 'images/statue.png');
                                }
                            }
                        },
                        roleOpt,
                        {
                            text: "🕺 Ikut Tarian Panen (Gratis!)",
                            action: () => {
                                p.energy = Math.min((p.energy || 0) + 30, 100);
                                p.reputation = (p.reputation || 0) + 3;
                                gainExp(5);
                                showToast("Energi +30, Reputasi +3! Ikut menari itu menyenangkan! 🎶");
                                closeDialogue();
                            }
                        }
                    ].filter(Boolean);
                    showDialogue("🌾 FESTIVAL PANEN RAYA", `Seluruh desa bergotong-royong memanen hasil bumi!\n\n${kurcaciHint}\n\n✨ Role ${(p.role||'none').toUpperCase()} punya cara tersendiri berkontribusi di sini!`, panenOpts, 'images/orangsawah.png');
                }
                // 11. FESTIVAL MUSIK
                else if (name.includes("Musik")) {
                    const roleOpt = getRoleFestivalOption('Musik');
                    const musikOpts = [
                        {
                            text: "🎤 Naik Panggung! (Butuh REP 10+)",
                            action: () => {
                                if ((p.reputation || 0) >= 10) {
                                    const roll = Math.random();
                                    if (roll > 0.4) {
                                        p.reputation = (p.reputation || 0) + 15;
                                        gainExp(20);
                                        p.money += 1000;
                                        showDialogue("BINTANG MALAM INI ⭐", "Penonton bersorak! Namamu mulai dikenal.\n\n**+15 Reputasi + 20 EXP + 1000 Gold**\n\nKamu mendapat undangan manggung lagi minggu depan!", [{ text: "Terima kasih!", action: closeDialogue }], 'images/penyanyi.png');
                                    } else {
                                        p.reputation = Math.max(0, (p.reputation || 0) - 5);
                                        showDialogue("OFF-KEY... 😬", "Kamu sedikit nervous dan fals. Penonton bersimpati.\n**Reputasi -5**.\nJangan menyerah, latih terus!", [{ text: "Latihan lagi...", action: closeDialogue }], 'images/penyanyi.png');
                                    }
                                } else {
                                    showToast("Kamu butuh Reputasi minimal 10 untuk berani naik panggung!");
                                }
                            }
                        },
                        roleOpt,
                        {
                            text: "🎧 Nikmati Konser (Energi +40)",
                            action: () => {
                                p.energy = Math.min((p.energy || 0) + 40, 100);
                                gainExp(5);
                                showToast("Jiwa tenang setelah menikmati musik. Energi +40! 🎵");
                                closeDialogue();
                            }
                        }
                    ].filter(Boolean);
                    showDialogue("🎵 FESTIVAL MUSIK DESA", `Penyanyi berbakat dari seluruh kota tampil malam ini. Ada slot untuk penampil dadakan!\n\n✨ Role ${(p.role||'none').toUpperCase()} punya cara istimewa menikmati festival ini!`, musikOpts, 'images/penyanyi.png');
                }
                // 12. PESTA PANEN ANGGUR
                else if (name.includes("Anggur")) {
                    const periHint = STATE.player.hiredFairy
                        ? "✅ Peri Sylva sudah bekerja di kebunmu! Temui dia di area ladang untuk hadiah tahunan 🧚‍♀️"
                        : "💡 **Peri Panen Sylva** ada di sini hari ini! Cari dia di utara desa — dia hanya muncul setahun sekali di festival ini!";
                    showDialogue("🍇 PESTA PANEN ANGGUR", `Anggur terbaik dari kebun desa dipamerkan!\n\n${periHint}\n\nAda juga lomba mencicip anggur untuk menebak varietasnya.`,
                        [
                            {
                                text: "🍷 Ikut Lomba Cicip (50G)",
                                action: () => {
                                    if (p.money >= 50) {
                                        p.money -= 50;
                                        const roll = Math.floor(Math.random() * 3);
                                        if (roll === 0) {
                                            addItem('tomat_panen', 5);
                                            p.money += 500;
                                            showDialogue("SOMMELIER HANDAL! 🍷", "Lidahmu sangat peka! Juri takjub.\n\n**Hadiah: 500 Gold + 5 Tomat Segar**", [{ text: "Lezat!", action: closeDialogue }], 'images/dapurayaayu.png');
                                        } else if (roll === 1) {
                                            addItem('gandum', 3);
                                            showDialogue("HAMPIR BENAR!", "Dua dari tiga varian kamu tebak dengan tepat.\n\n**Hadiah: 3 Gandum**", [{ text: "Lumayan!", action: closeDialogue }], 'images/dapurayaayu.png');
                                        } else {
                                            showDialogue("SALAH SEMUA 😅", "Ternyata lidahmu masih perlu dilatih. Uang Pendaftaran hangus.", [{ text: "Hehe...", action: closeDialogue }], 'images/dapurayaayu.png');
                                        }
                                    } else {
                                        showToast("Butuh 50 Gold untuk ikut!");
                                    }
                                }
                            },
                            {
                                text: "🥂 Minum Gratis (Energi +25)",
                                action: () => {
                                    p.energy = Math.min((p.energy || 0) + 25, 100);
                                    showToast("Minuman anggur segar. Energi +25! 🍇");
                                    closeDialogue();
                                }
                            }
                        ], 'images/dapurayaayu.png');
                }
                // 13. FESTIVAL DOMBA
                else if (name.includes("Domba")) {
                    showDialogue("🐑 FESTIVAL DOMBA MUSIM GUGUR", "Para peternak memamerkan domba-domba gemuk mereka. Lomba mencukur domba paling cepat juga digelar!",
                        [
                            {
                                text: "✂️ Ikut Lomba Cukur Domba",
                                action: () => {
                                    if ((p.str || 0) >= 10) {
                                        addItem('kain', 4);
                                        gainExp(15);
                                        showDialogue("TANGAN EMAS! ✂️", "Kamu mencukur domba dalam 45 detik — rekor baru desa!\n\n**Hadiah: 4 Kain Wol + 15 EXP**", [{ text: "Haha seru!", action: closeDialogue }], 'images/statue.png');
                                    } else {
                                        showDialogue("LAMBAT...", "Dombamu kabur sebelum selesai dicukur. Kamu kalah.\nLatih STR-mu lebih keras!", [{ text: "Oke...", action: closeDialogue }], 'images/statue.png');
                                    }
                                }
                            },
                            {
                                text: "🛍️ Beli Wol Murah (3 Kain, 200G)",
                                action: () => {
                                    if (p.money >= 200) {
                                        p.money -= 200;
                                        addItem('kain', 3);
                                        showToast("Dapat 3 Kain Wol murah! 🐑");
                                        closeDialogue();
                                    } else { showToast("Uang tidak cukup."); }
                                }
                            },
                            { text: "Lihat-lihat saja", action: () => { p.energy = Math.min((p.energy||0)+10,100); showToast("Suasana seru! Energi +10"); closeDialogue(); } }
                        ], 'images/statue.png');
                }
                // 14. PESTA SUP HANGAT
                else if (name.includes("Sup Hangat") || name.includes("Sup")) {
                    showDialogue("🍲 PESTA SUP HANGAT MUSIM DINGIN", "Warga desa berkumpul menghangatkan diri. Nenek tua berbagi resep sup ajaib yang bisa memulihkan energi dan semangat.",
                        [
                            {
                                text: "🥣 Minum Sup Ajaib (Gratis!)",
                                action: () => {
                                    const year = Math.ceil(STATE.day / 120);
                                    if (p.lastSoupYear !== year) {
                                        p.lastSoupYear = year;
                                        p.energy = 100;
                                        p.hp = Math.min((p.hp || 100) + 30, 100);
                                        gainExp(10);
                                        showDialogue("SUP NENEK ✨", "Hangat dan nikmat sekali! Sup itu mengandung rempah legendaris.\n\n**Energi PENUH + HP +30 + 10 EXP**\n\n'Nak, hiduplah dengan penuh semangat!'", [{ text: "Terima kasih, Nek!", action: closeDialogue }], 'images/statue.png');
                                    } else {
                                        showToast("Kamu sudah minum sup tahun ini. Ingat, yang berlebihan tidak baik!");
                                        closeDialogue();
                                    }
                                }
                            },
                            {
                                text: "🫂 Duduk Bersama Warga (+REP)",
                                action: () => {
                                    p.reputation = (p.reputation || 0) + 8;
                                    p.energy = Math.min((p.energy || 0) + 20, 100);
                                    showToast("Menghangatkan hati. Reputasi +8, Energi +20 🍲");
                                    closeDialogue();
                                }
                            }
                        ], 'images/statue.png');
                }
                // 15. MALAM AKHIR TAHUN
                else if (name.includes("Akhir Tahun")) {
                    showDialogue("🕛 MALAM AKHIR TAHUN", "Detik-detik pergantian tahun! Warga berkumpul di alun-alun. Semua orang merenungkan perjalanan setahun terakhir.",
                        [
                            {
                                text: "🎆 Nyalakan Kembang Api (500G)",
                                action: () => {
                                    if (p.money >= 500) {
                                        p.money -= 500;
                                        createParticle(p.x, p.y, '#facc15');
                                        createParticle(p.x+20, p.y-20, '#f472b6');
                                        createParticle(p.x-20, p.y-20, '#60a5fa');
                                        p.reputation = (p.reputation || 0) + 12;
                                        gainExp(20);
                                        showDialogue("SELAMAT TAHUN BARU! 🎇", "Kembang api ciptaanmu menerangi langit malam. Warga bersorak!\n\n**Reputasi +12 + 20 EXP**\n\nTahun baru, semangat baru!", [{ text: "YEAY! 🎉", action: closeDialogue }], 'images/statue.png');
                                    } else { showToast("Butuh 500 Gold untuk beli kembang api!"); }
                                }
                            },
                            {
                                text: "📝 Tulis Resolusi Tahun Baru",
                                action: () => {
                                    const year = Math.ceil(STATE.day / 120);
                                    if (p.lastResolutionYear !== year) {
                                        p.lastResolutionYear = year;
                                        STATE.player.achievementPoints = (STATE.player.achievementPoints || 0) + 10;
                                        showDialogue("RESOLUSI DITULIS ✍️", "Kamu menuliskan mimpi dan targetmu untuk tahun depan.\n\n**+10 AP (Achievement Points)**\n\n'Langkah pertama menuju sukses adalah menuliskan tujuanmu.'", [{ text: "Siap menjalani tahun baru!", action: closeDialogue }], 'images/statue.png');
                                    } else {
                                        showToast("Resolusimu sudah ditulis tahun ini!");
                                        closeDialogue();
                                    }
                                }
                            },
                            {
                                text: "🤝 Kumpul Bersama Teman",
                                action: () => {
                                    p.energy = 100;
                                    p.reputation = (p.reputation || 0) + 5;
                                    showToast("Kebersamaan adalah kekuatan. Energi PENUH + Reputasi +5 🌟");
                                    closeDialogue();
                                }
                            }
                        ], 'images/statue.png');
                }
                // 16. BULAN PURNAMA MERAH (SPECIAL)
                else if (name.includes("Purnama")) {
                    showDialogue("🌕 BULAN PURNAMA MERAH", "Malam ini langit berwarna merah saga. Fenomena langka ini konon memberikan kekuatan misterius bagi yang berani keluar malam.",
                        [
                            {
                                text: "🌙 Meditasi di Bawah Purnama",
                                action: () => {
                                    const bonusStat = Math.floor(Math.random() * 4);
                                    const stats = ['str', 'int', 'reputation', 'biz'];
                                    const statNames = ['STR', 'INT', 'Reputasi', 'BIZ'];
                                    const bonus = 3 + Math.floor(Math.random() * 3);
                                    p[stats[bonusStat]] = (p[stats[bonusStat]] || 0) + bonus;
                                    gainExp(25);
                                    showDialogue("KEKUATAN MISTERIUS ✨", `Cahaya purnama meresap ke dalam dirimu...\n\n**${statNames[bonusStat]} +${bonus}** dan **25 EXP**\n\n"Kamu merasakan sesuatu yang berubah dalam dirimu."`, [{ text: "Luar biasa!", action: closeDialogue }], 'images/statue.png');
                                }
                            },
                            {
                                text: "🏃 Lari di Bawah Bulan (STR+)",
                                action: () => {
                                    p.str = (p.str || 0) + 5;
                                    p.energy = Math.max(0, (p.energy || 100) - 30);
                                    showToast("Berlari di malam purnama! STR +5, Energi -30 🌕");
                                    closeDialogue();
                                }
                            }
                        ], 'images/statue.png');
                }
                // DEFAULT
                else {
                    showDialogue(`MERAYAKAN ${name.toUpperCase()}`,
                        "Kamu menikmati suasana festival yang meriah. Makan enak, musik asik, teman baik.",
                        [{
                            text: "Nikmati (Energi Penuh)",
                            action: () => {
                                p.energy = 100;
                                p.reputation += 2;
                                showToast("Energi Pulih & Reputasi +2");
                                closeDialogue();
                            }
                        }], 'images/statue.png');
                }
            }

            // --- [AKHIR KODE PERTANIAN] ---

            // --- NEW: PWA SERVICE WORKER (FITUR SIMPAN ASET OFFLINE) ---
            // Kode ini membuat browser menyimpan gambar secara agresif agar tidak download ulang
            // [UPDATE] Dinonaktifkan sementara karena Blob URL tidak didukung di lingkungan preview ini
            /*
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                    // Kita gunakan Blob untuk membuat Service Worker tanpa file eksternal (Single File Magic)
                    const swCode = `
                        const CACHE_NAME = 'nusantara-arsa-cache-v1';
                        
                        self.addEventListener('install', event => {
                            self.skipWaiting(); // Langsung aktifkan
                        });
            
                        self.addEventListener('fetch', event => {
                            event.respondWith(
                                caches.match(event.request)
                                    .then(response => {
                                        // 1. Jika ada di Cache, gunakan itu (Hemat Kuota)
                                        if (response) {
                                            return response;
                                        }
                                        // 2. Jika tidak, download dari internet lalu simpan ke Cache
                                        return fetch(event.request).then(
                                            function(networkResponse) {
                                                // Cek validitas respon
                                                if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                                                    return networkResponse;
                                                }
                                                
                                                // Filter: Hanya cache file Gambar dan Audio
                                                if(event.request.url.match(/\\.(png|jpg|jpeg|svg|mp3)$/)) {
                                                    var responseToCache = networkResponse.clone();
                                                    caches.open(CACHE_NAME)
                                                        .then(function(cache) {
                                                            cache.put(event.request, responseToCache);
                                                        });
                                                }
                                                return networkResponse;
                                            }
                                        );
                                    })
                            );
                        });
                    `;
                    
                    // Buat URL virtual untuk script Service Worker
                    const blob = new Blob([swCode], {type: 'text/javascript'});
                    const swUrl = URL.createObjectURL(blob);
                    
                    navigator.serviceWorker.register(swUrl).then(function(registration) {
                        console.log('ServiceWorker PWA registered with scope:', registration.scope);
                    }).catch(function(err) {
                        console.log('ServiceWorker registration failed:', err);
                    });
                });
            }
            */

            // Fungsi untuk memaksa masuk Full Screen kembali
            function resumeFullscreen() {
                var elem = document.documentElement;

                // 1. Minta Fullscreen
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().then(() => {
                        // 2. SETELAH Fullscreen Berhasil, BARU Paksa Landscape
                        // Ini kunci agar layar HP otomatis miring
                        if (screen.orientation && screen.orientation.lock) {
                            screen.orientation.lock('landscape').catch(e => console.log(e));
                        }
                    }).catch(err => {
                        console.log("Gagal Fullscreen: ", err);
                    });
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }

                // 3. Hilangkan layar hitam
                document.getElementById('resume-overlay').style.display = 'none';
            }

            // Event Listener: Mata-mata yang memantau apakah kita pindah tab/aplikasi
            document.addEventListener("visibilitychange", function () {
                // Jika halaman sedang AKTIF (Kita kembali ke tab Chrome ini)
                if (!document.hidden) {
                    console.log("Pengguna kembali ke game.");

                    // Cek: Apakah Fullscreen-nya lepas?
                    // (Biasanya 'null' kalau lepas)
                    if (!document.fullscreenElement && !document.webkitFullscreenElement) {

                        // JIKA LEPAS: Munculkan layar hitam agar user menekan tombol lagi
                        document.getElementById('resume-overlay').style.display = 'flex';
                    }
                }
            });

