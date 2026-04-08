// ══════════════════════════════════════════════════════════════
// HUD Fairy Village + Test Mode
// File: js/27-fv-hud-testmode.js
// ══════════════════════════════════════════════════════════════
// HUD
// ─────────────────────────────────────────────────────────────
function updateFVHUD(){
    const fv=getFairyVillage(), stats=getFairyVillageStats(fv);
    const g=id=>document.getElementById(id);
    // Legacy elements (jika ada)
    if(g('fv-hud-debu'))    g('fv-hud-debu').textContent=fv.resources.debu||0;
    if(g('fv-hud-kristal')) g('fv-hud-kristal').textContent=fv.resources.kristal||0;
    if(g('fv-hud-cahaya'))  g('fv-hud-cahaya').textContent=fv.resources.cahaya||0;
    if(g('fv-hud-makanan')) g('fv-hud-makanan').textContent=fv.resources.makanan||0;
    if(g('fv-hud-pop'))     g('fv-hud-pop').textContent=`${fv.fairies.length}/${stats.totalCap}`;
    if(g('fv-hud-queue'))   g('fv-hud-queue').textContent=(fv.buildQueue||[]).length;
    // New top HUD bar
    if(g('fvbar-debu'))    g('fvbar-debu').textContent    = fv.resources.debu    || 0;
    if(g('fvbar-kristal')) g('fvbar-kristal').textContent = fv.resources.kristal || 0;
    if(g('fvbar-cahaya'))  g('fvbar-cahaya').textContent  = fv.resources.cahaya  || 0;
    if(g('fvbar-makanan')) g('fvbar-makanan').textContent = fv.resources.makanan || 0;
    if(g('fvbar-pop'))     g('fvbar-pop').textContent     = `${fv.fairies.length}/${stats.totalCap}`;
    if(g('fvbar-time-label') && typeof getFVTimeOfDay==='function'){
        const _tod3=getFVTimeOfDay(), _sea3=getFVSeason();
        const _ti={pagi:'🌅',siang:'☀️',sore:'🌤️',senja:'🌇',malam:'🌙'};
        g('fvbar-time-label').textContent=(_ti[_tod3]||'🌙')+' '+(_tod3.charAt(0).toUpperCase()+_tod3.slice(1))+'  |  '+_sea3.label;
    }
}

// ─────────────────────────────────────────────────────────────
// TEST MODE
// ─────────────────────────────────────────────────────────────
function openFairyTestMode(){
    const p=STATE.player;
    p.sylvariaQuestComplete=true;
    p.sylvariaQuest={stage:99,task1:true,task2:true,task3:true,task4:true};
    if(!p.spriteIdle) selectGender(p.gender||'boy',true);
    if(!p.name||!p.name.trim()) p.name=document.getElementById('hud-name')?.textContent?.trim()||'Arsa';

    STATE.isPrologue = false;
    STATE.screen = 'play';
    const dialogBox = document.getElementById('dialogue-wrapper');
    if (dialogBox) dialogBox.style.display = 'none';

    const fv = getFairyVillage();
    fv.resources = { debu:9999, kristal:99, cahaya:99, makanan:50 };
    fv.fairies = [
        {id:'t1',name:'Rara Wilis',gender:'girl',level:5,xp:0,happiness:100,mood:'happy',intel:28,agility:22,spirit:30,hp:100,maxHp:100},
        {id:'t2',name:'Wening',    gender:'girl',level:3,xp:0,happiness:90, mood:'happy',intel:20,agility:18,spirit:22,hp:90, maxHp:100},
        {id:'t3',name:'Sekar',     gender:'girl',level:2,xp:0,happiness:85, mood:'happy',intel:16,agility:24,spirit:15,hp:85, maxHp:100},
        {id:'t4',name:'Bening',    gender:'girl',level:1,xp:0,happiness:80, mood:'happy',intel:12,agility:15,spirit:18,hp:80, maxHp:100},
        {id:'t5',name:'Juna',      gender:'boy', level:3,xp:0,happiness:88, mood:'happy',intel:18,agility:25,spirit:14,hp:88, maxHp:100},
    ];
    // Pre-built buildings dengan beberapa worker sudah ditugaskan
    fv.buildings = [
        { slotId:'s1',  bid:'pondok_peri',   workers:['t2'] },
        { slotId:'s7',  bid:'taman_mini',    workers:['t3','t4'] },
        { slotId:'s11', bid:'kolam_kristal', workers:[] },
    ];
    fv.buildQueue = [];
    fv.isTestMode = true;         // tombol test selalu muncul di menu Rara Wilis
    fv.fvTutorialDone = false;    // reset agar tutorial jalan saat masuk
    fv.tutorialDone   = false;    // reset flag lama juga
    fv.isFirstVisit   = false;    // jangan reset resource ke starter (resource sudah di-set di atas)
    refreshFairyVillageMap();
    showToast('🧚 TEST MODE — Masuk Kahyangan Wilis!');
    openFairyVillage();
}

// ══════════════════════════════════════════════════════════════
// 👹 TEST MODE — MONSTER PENCURI SKRIPSI / IJAZAH
// ══════════════════════════════════════════════════════════════
// 👹 TEST MODE — MONSTER PENCURI SKRIPSI / IJAZAH
// Alur: set quest → monster muncul di peta → teleport dekat → klik → battle
// ══════════════════════════════════════════════════════════════
function openSkripsiThiefTestMode() {
    const p = STATE.player;

    // --- 1. Setup dasar player ---
    STATE.isPrologue = false;
    STATE.screen = 'play';
    STATE.isDayChanging = false;

    // Pastikan sprite sudah terpilih
    if (!p.spriteIdle) selectGender(p.gender || 'boy', true);
    if (!p.name || !p.name.trim()) p.name = document.getElementById('hud-name')?.textContent?.trim() || 'Arsa';

    // Tutup semua dialog/modal
    const dialogBox = document.getElementById('dialogue-wrapper');
    if (dialogBox) dialogBox.style.display = 'none';
    if (typeof closeFairyVillage === 'function') closeFairyVillage();

    // --- 2. Boost stat ---
    p.hp = p.maxHp = 200;
    p.energy = 100;
    p.str   = (p.str  || 0) < 30 ? 30 : p.str;
    p.int   = (p.int  || 0) < 20 ? 20 : p.int;
    p.level = (p.level|| 1) < 5  ? 5  : p.level;
    p.role  = p.role || 'student';
    p.attackCooldown = 0; p.skillCooldown = 0;
    p.invincible = false; p.damageCooldown = 0;
    if (typeof STATE.enemies !== 'undefined') STATE.enemies = [];

    // --- 3. Set activeQuest = 'find_draft' agar monster_skripsi muncul di peta ---
    //    (renderer cek STATE.player.activeQuest, bukan p.quests)
    p.activeQuest = 'find_draft';
    if (!p.quests) p.quests = {};
    p.quests['find_draft'] = { status: 'active', day: STATE.day };

    // --- 4. Teleport ke dekat monster (x:50,y:13 di village) ---
    STATE.location = 'village';
    p.x = 47 * TILE_SIZE;
    p.y = 13 * TILE_SIZE;

    // --- 5. Update HUD & tampilkan toast petunjuk ---
    if (typeof updateHUD === 'function') updateHUD();
    showToast('👹 Monster Pencuri Naskah muncul! Dekati dan klik untuk battle!');

    // --- 6. Setelah 600ms tampilkan dialog pengantar singkat ---
    setTimeout(() => {
        showDialogue(
            '👹 TEST MODE — PENCURI NASKAH',
            '🔧 Stat sudah di-boost:\n' +
            `• HP: ${p.hp}/${p.maxHp}  STR: ${p.str}  INT: ${p.int}\n\n` +
            '👁️ Monster Pencuri Naskah sudah muncul di peta!\n' +
            'Dekati lalu klik untuk mulai battle.\n\n' +
            'Atau tekan "⚔️ Langsung Battle!" untuk skip ke arena.',
            [
                {
                    text: '⚔️ Langsung Battle!',
                    action: () => {
                        closeDialogue();
                        setTimeout(() => {
                            if (typeof window.startRuinsBattle === 'function') {
                                window.startRuinsBattle();
                            } else {
                                showToast('⚠️ startRuinsBattle tidak ditemukan!');
                            }
                        }, 200);
                    }
                },
                {
                    text: '🗺️ Oke, Cari Dulu',
                    action: () => {
                        closeDialogue();
                        showToast('📍 Monster ada di sekitar x:50, y:13 — timur laut peta!');
                    }
                }
            ],
            'images/monster-thief.png'
        );
    }, 600);
}

// ── TEST: Trigger kelahiran peri manual (dari menu Rara Wilis di test mode) ──
function testFairyBirth() {
    const fv = getFairyVillage();
    const g = Math.random() < 0.6 ? 'girl' : 'boy';
    const names = g==='girl' ? FAIRY_NAMES_GIRL : FAIRY_NAMES_BOY;
    const spriteIdx = Math.floor(Math.random() * (g==='girl'?4:2));
    const newFairy = {
        id: 'f_test_'+Date.now(),
        name: names[Math.floor(Math.random()*names.length)],
        gender:g, level:1, xp:0, happiness:80, mood:'happy',
        intel:_fairyStat(), agility:_fairyStat(), spirit:_fairyStat(),
        hp:80+Math.floor(Math.random()*20), maxHp:100,
        spriteIdx, isBorn:true,
    };
    fv.fairies.push(newFairy);
    if (typeof closeDialogue==='function') closeDialogue();
    setTimeout(()=>showFairyBirthPopup(newFairy, '🏠 Pondok Peri'), 200);
}

// ─────────────────────────────────────────────────────────────
// LEGACY STUBS
// ─────────────────────────────────────────────────────────────
function earnFairyKristal(amount){
    const fv=getFairyVillage();
    fv.resources.kristal=(fv.resources.kristal||0)+amount;
    showToast(`💎 +${amount} Kristal Brantas!`);
}

