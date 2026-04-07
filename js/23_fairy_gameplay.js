// ========================================================
// js/23_fairy_gameplay.js
// Fairy Village: Init, Game Loop, Build Queue, Draw
// ========================================================

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
function initFairyWorld() {
    fvCanvas = document.getElementById('fv-canvas');
    if (!fvCanvas) return;
    fvCtx = fvCanvas.getContext('2d');
    resizeFairyCanvas();

    fvPlayer = { x: (FV_RARA_POS.x+3)*TS, y: (FV_RARA_POS.y+3)*TS, facing:'down' };
    fvKeys = {};
    fvActiveDialog = null;
    fvParticles = [];
    fvJoy = { active:false, startX:0, startY:0, dx:0, dy:0 };

    const fv = getFairyVillage();
    // Tutorial lama (2 pesan singkat) dinonaktifkan — digantikan tutorial baru yang lebih lengkap
    if (!fv.tutorialDone) {
        fv.tutorialDone = true; // langsung mark agar tidak muncul, tutorial baru yang akan jalan
    }

    setupFairyInput();
    startFairyLoop();
    updateFVHUD();
}

function resizeFairyCanvas() {
    if (!fvCanvas) return;
    const modal  = document.getElementById('fairy-village-modal');
    const hud    = document.getElementById('fv-hud');
    const bottom = document.getElementById('fv-bottom-bar');
    const w = modal.clientWidth  || 360;
    const h = modal.clientHeight - (hud?.offsetHeight||50) - (bottom?.offsetHeight||110);
    fvCanvas.width  = Math.max(200, w);
    fvCanvas.height = Math.max(150, h);
}

// ═══════════════════════════════════════════════════════════════
// GAME LOOP
// ═══════════════════════════════════════════════════════════════
function startFairyLoop() {
    stopFairyLoop();
    fvLastTime = performance.now();
    FVG = requestAnimationFrame(fairyLoop);
}
function stopFairyLoop() {
    if (FVG) { cancelAnimationFrame(FVG); FVG = null; }
}

function fairyLoop(ts) {
    if (STATE.location !== 'fairyVillage') { FVG=null; return; }
    const dt = Math.min(32, ts - fvLastTime);
    fvLastTime = ts;
    checkBuildQueue();
    updateFairyPlayer(dt);
    // Cek daily tick
    const fv = getFairyVillage();
    if (fv.lastTickDay !== STATE.day) {
        fairyDailyTick(fv);
    }
    // drawFairyWorld dipanggil oleh main render loop
    FVG = requestAnimationFrame(fairyLoop);
}

// ═══════════════════════════════════════════════════════════════
// BUILD QUEUE — waktu nyata: 1 hari game = 60 detik
// ═══════════════════════════════════════════════════════════════
const BUILD_DURATION_MS = 60 * 1000; // 60 detik real per bangunan

function checkBuildQueue() {
    const fv = getFairyVillage();
    if (!fv.buildQueue || fv.buildQueue.length === 0) return;
    const now = Date.now();
    const done = fv.buildQueue.filter(q => now >= q.finishTime);
    if (done.length === 0) return;
    done.forEach(q => {
        const slot = FAIRY_SLOTS.find(s=>s.id===q.slotId);
        const bDef = FAIRY_BUILDINGS[q.bid];
        const bName = bDef?.name || 'Bangunan';
        const bEmoji = bDef?.emoji || '🏠';
        if (q.isUpgrade) {
            const existing = fv.buildings.find(b => b.slotId === q.slotId);
            if (existing) {
                const oldName = FAIRY_BUILDINGS[existing.bid]?.name || existing.bid;
                existing.bid = q.bid;
                const newMax = FAIRY_BUILDINGS[q.bid]?.maxWorkers || 2;
                if ((existing.workers||[]).length > newMax) existing.workers = existing.workers.slice(0, newMax);
                if (slot && STATE.location === 'fairyVillage') createFVParticles(slot.x*TS+TS, slot.y*TS+TS, 30);
                // FIX: Pop-up upgrade selesai
                showToast(`⬆️ ${oldName} berhasil diupgrade jadi ${bName}!`);
                if (typeof showDialogue === 'function') {
                    showDialogue('✨ Upgrade Selesai!',
                        `${bEmoji} ${bName} telah selesai diupgrade!\n\nBangunan kini lebih kuat dan bisa menampung lebih banyak peri. Kunjungi Kahyangan Wilis untuk melihatnya!`,
                        [{ text: 'Mantap! 🎉', action: () => { if(typeof closeDialogue==='function') closeDialogue(); } }],
                        null);
                }
            }
        } else {
            // Bangunan baru
            fv.buildings.push({ slotId: q.slotId, bid: q.bid, workers: [] });
            if (slot && STATE.location === 'fairyVillage') createFVParticles(slot.x*TS+TS, slot.y*TS+TS, 20);
            // FIX: Pop-up bangunan selesai dengan info bangunan
            showToast(`✅ ${bName} selesai dibangun di Kahyangan Wilis!`);
            if (typeof showDialogue === 'function') {
                showDialogue(`${bEmoji} Bangunan Selesai!`,
                    `${bName} telah selesai dibangun di Kahyangan Wilis!\n\n${bDef?.desc || ''}\n\n🏗️ Tugaskan peri untuk mulai bekerja di bangunan ini agar menghasilkan sumber daya.`,
                    [{ text: '🧚 Lihat Sekarang', action: () => {
                        if(typeof closeDialogue==='function') closeDialogue();
                        if (STATE.location === 'fairyVillage' && typeof openKhModal==='function') openKhModal();
                    }},
                    { text: 'Nanti Saja', action: () => { if(typeof closeDialogue==='function') closeDialogue(); } }],
                    null);
            }
        }
    });
    fv.buildQueue = fv.buildQueue.filter(q => now < q.finishTime);
    // FIX: Refresh peta setelah bangunan selesai agar langsung muncul di peta
    if (typeof refreshFairyVillageMap === 'function') refreshFairyVillageMap();
    updateFVHUD();
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// UPDATE PLAYER DI FAIRY VILLAGE
// Player movement sudah dihandle main game loop
// Fungsi ini hanya update facing dan action button
// ═══════════════════════════════════════════════════════════════
function updateFairyPlayer(dt) {
    // Sync fvPlayer dari STATE.player
    fvPlayer.x = STATE.player.x;
    fvPlayer.y = STATE.player.y;

    // Update facing dari input (untuk animasi sprite)
    if (fvKeys['ArrowLeft'] ||fvKeys['a']) fvPlayer.facing='left';
    else if (fvKeys['ArrowRight']||fvKeys['d']) fvPlayer.facing='right';
    else if (fvKeys['ArrowUp']   ||fvKeys['w']) fvPlayer.facing='up';
    else if (fvKeys['ArrowDown'] ||fvKeys['s']) fvPlayer.facing='down';

    if (fvJoy.active) {
        const mag = Math.sqrt(fvJoy.dx*fvJoy.dx + fvJoy.dy*fvJoy.dy);
        if (mag > 8) {
            if (Math.abs(fvJoy.dx)>Math.abs(fvJoy.dy)) fvPlayer.facing = fvJoy.dx>0?'right':'left';
            else fvPlayer.facing = fvJoy.dy>0?'down':'up';
        }
    }

    updateFVActionBtn();
}

function updateFVActionBtn() {
    // fv-action-btn hanya untuk Rara Wilis & Pohon Energi
    // Bangunan sudah handle via btn-action utama (checkEntranceProximity)
    const btn = document.getElementById('fv-action-btn');
    if (!btn) return;
    const px = fvPlayer.x, py = fvPlayer.y;

    // Rara Wilis
    const rx = FV_RARA_POS.x*TS+TS, ry = FV_RARA_POS.y*TS+TS;
    if (Math.hypot(px-rx, py-ry) < TS*2.5) {
        btn.style.display='block';
        btn.textContent='💬 Bicara dengan Rara Wilis';
        btn.onclick = openRaraWilisDialog;
        return;
    }

    // Pohon Energi
    const tx = FV_POHON_POS.x*TS+TS, ty = FV_POHON_POS.y*TS+TS;
    if (Math.hypot(px-tx, py-ty) < TS*2.5) {
        btn.style.display='block';
        btn.textContent='✨ Kumpulkan Serbuk Wilis';
        btn.onclick = collectFairyDust;
        return;
    }

    // Peri NPC wandering (Wening, Sekar, Bening, Juna)
    // Posisi runtime diambil dari fvNpcRuntime karena mereka bergerak
    const _fvWanderNPCs = [
        { id:'fv_wening', label:'💬 Bicara dengan Wening',  fn: openFairyNPCDialog_fv_wening },
        { id:'fv_sekar',  label:'💬 Bicara dengan Sekar',   fn: openFairyNPCDialog_fv_sekar  },
        { id:'fv_bening', label:'💬 Bicara dengan Bening',  fn: openFairyNPCDialog_fv_bening },
        { id:'fv_juna',   label:'💬 Bicara dengan Juna',    fn: openFairyNPCDialog_fv_juna   },
    ];
    for (const npcDef of _fvWanderNPCs) {
        const rt = fvNpcRuntime[npcDef.id];
        if (!rt) continue;
        if (Math.hypot(px - (rt.px + 19), py - (rt.py + 29)) < TS * 2.5) {
            btn.style.display = 'block';
            btn.textContent = npcDef.label;
            btn.onclick = npcDef.fn;
            return;
        }
    }

    btn.style.display='none';
}

// ═══════════════════════════════════════════════════════════════
// DRAW
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// DRAW BANGUNAN KAHYANGAN — Canvas Asset per Tipe
// ═══════════════════════════════════════════════════════════════
function drawFVBuildingCanvas(ctx, bid, bx, by, bw, bh, t) {
    ctx.save();
    const cx = bx + bw/2;
    // ──────────────── HELPER ────────────────
    function wall(color, rx=0, ry=bh*0.35, rw=bw, rh=bh*0.65, r=4) {
        ctx.fillStyle=color;
        ctx.beginPath(); ctx.roundRect(bx+rx, by+ry, rw, rh, r); ctx.fill();
    }
    function roof(color, peakX=cx, peakY=by, leftX=bx-2, rightX=bx+bw+2, baseY=by+bh*0.4) {
        ctx.fillStyle=color;
        ctx.beginPath(); ctx.moveTo(leftX,baseY); ctx.lineTo(peakX,peakY); ctx.lineTo(rightX,baseY); ctx.closePath(); ctx.fill();
    }
    function door(color, dw=bw*0.22, dh=bh*0.28, dx=cx-bw*0.11) {
        ctx.fillStyle=color;
        ctx.beginPath(); ctx.roundRect(dx, by+bh-dh, dw, dh, [3,3,0,0]); ctx.fill();
    }
    function window_(color, wx_, wy_, ww=bw*0.15, wh=bh*0.13) {
        ctx.fillStyle='rgba(200,230,255,0.6)';
        ctx.beginPath(); ctx.roundRect(wx_, wy_, ww, wh, 2); ctx.fill();
        ctx.strokeStyle=color; ctx.lineWidth=1;
        ctx.beginPath(); ctx.roundRect(wx_, wy_, ww, wh, 2); ctx.stroke();
        // Cross
        ctx.beginPath(); ctx.moveTo(wx_+ww/2,wy_); ctx.lineTo(wx_+ww/2,wy_+wh);
        ctx.moveTo(wx_,wy_+wh/2); ctx.lineTo(wx_+ww,wy_+wh/2); ctx.stroke();
    }
    function outlineBldg(color) {
        ctx.strokeStyle=color; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,4); ctx.stroke();
    }

    // ──────────────── HUNIAN ────────────────
    // ──────────────── HUNIAN (pakai gambar omah-tier1/2/3.png) ────────────────
    if (bid==='pondok_peri') {
        const img1 = FV_OMAH_IMAGES[1];
        if (img1 && img1.complete && img1.naturalWidth > 0) {
            ctx.drawImage(img1, bx, by, bw, bh);
        } else {
            // Fallback canvas jika gambar belum load
            wall('#d4a96a');
            roof('#a0752a', cx, by-2, bx-3, bx+bw+3, by+bh*0.38);
            door('#7c4b1a', bw*0.24, bh*0.32);
            outlineBldg('#8b5e2a');
        }
    } else if (bid==='rumah_peri') {
        const img2 = FV_OMAH_IMAGES[2];
        if (img2 && img2.complete && img2.naturalWidth > 0) {
            ctx.drawImage(img2, bx, by, bw, bh);
        } else {
            wall('#e8d5b0');
            roof('#c0392b', cx, by-4, bx-4, bx+bw+4, by+bh*0.37);
            door('#5d3a1a', bw*0.25, bh*0.33);
            outlineBldg('#c0392b');
        }
    } else if (bid==='dalem_widadari') {
        const img3 = FV_OMAH_IMAGES[3];
        if (img3 && img3.complete && img3.naturalWidth > 0) {
            ctx.drawImage(img3, bx, by, bw, bh);
        } else {
            wall('#f5e6cc');
            roof('#8B4513', cx, by-6, bx-6, bx+bw+6, by+bh*0.32);
            roof('#a0522d', cx, by+bh*0.22, bx-2, bx+bw+2, by+bh*0.4);
            door('#4a2a0d', bw*0.26, bh*0.35);
            outlineBldg('#8B4513');
        }

    // ──────────────── TAMAN ────────────────
    } else if (bid==='taman_mini') {
        const imgT1 = FV_TAMAN_IMAGES[1];
        if (imgT1 && imgT1.complete && imgT1.naturalWidth > 0) {
            const srcAR = 700/400; const dstAR = bw/bh;
            let sx=0,sy=0,sw=700,sh=400;
            if (srcAR > dstAR) { sw=Math.round(400*dstAR); sx=Math.round((700-sw)/2); }
            else { sh=Math.round(700/dstAR); sy=Math.round((400-sh)/2); }
            ctx.drawImage(imgT1, sx,sy,sw,sh, bx,by,bw,bh);
        } else {
            // Fallback canvas
            ctx.fillStyle='#4a7c2f';
            ctx.beginPath(); ctx.roundRect(bx, by+bh*0.5, bw, bh*0.5, [0,0,4,4]); ctx.fill();
            ctx.fillStyle='#2d5a1b';
            ctx.beginPath(); ctx.roundRect(bx, by+bh*0.5, bw, bh*0.06, 0); ctx.fill();
            ctx.strokeStyle='#8b6914'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.roundRect(bx+1, by+bh*0.48, bw-2, bh*0.52, 3); ctx.stroke();
            for(let i=0;i<4;i++) {
                ctx.beginPath(); ctx.moveTo(bx+bw*0.12+i*bw*0.23, by+bh*0.48); ctx.lineTo(bx+bw*0.12+i*bw*0.23, by+bh); ctx.stroke();
            }
            const flowerColors=['#f472b6','#facc15','#fb923c','#a78bfa'];
            for(let i=0;i<5;i++) {
                const fx2=bx+bw*0.1+i*(bw*0.18), fy2=by+bh*0.62;
                ctx.fillStyle=flowerColors[i%4];
                for(let p=0;p<5;p++) {
                    const ang=p*Math.PI*2/5;
                    ctx.beginPath(); ctx.arc(fx2+Math.cos(ang)*4, fy2+Math.sin(ang)*4+Math.sin(t/800+i)*1.5, 3, 0, Math.PI*2); ctx.fill();
                }
                ctx.fillStyle='#fef08a'; ctx.beginPath(); ctx.arc(fx2, fy2+Math.sin(t/800+i)*1.5, 2.5, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle='#16a34a'; ctx.lineWidth=1.5; ctx.strokeStyle='#16a34a';
                ctx.beginPath(); ctx.moveTo(fx2, fy2+4+Math.sin(t/800+i)*1.5); ctx.lineTo(fx2, by+bh-2); ctx.stroke();
            }
        }
    } else if (bid==='taman_mekar') {
        const imgT2 = FV_TAMAN_IMAGES[2];
        if (imgT2 && imgT2.complete && imgT2.naturalWidth > 0) {
            const srcAR = 700/400; const dstAR = bw/bh;
            let sx=0,sy=0,sw=700,sh=400;
            if (srcAR > dstAR) { sw=Math.round(400*dstAR); sx=Math.round((700-sw)/2); }
            else { sh=Math.round(700/dstAR); sy=Math.round((400-sh)/2); }
            ctx.drawImage(imgT2, sx,sy,sw,sh, bx,by,bw,bh);
        } else {
            // Fallback canvas
            ctx.fillStyle='#3a6b22';
            ctx.beginPath(); ctx.roundRect(bx, by+bh*0.45, bw, bh*0.55, [0,0,4,4]); ctx.fill();
            ctx.fillStyle='#9ca3af';
            for(let i=0;i<3;i++) { ctx.beginPath(); ctx.arc(cx+(-1+i)*bw*0.2, by+bh*0.78, bw*0.07, 0, Math.PI*2); ctx.fill(); }
            [[bx+bw*0.12, by+bh*0.5],[bx+bw*0.78, by+bh*0.5]].forEach(([tx2,ty2])=>{
                ctx.fillStyle='#5c3d1e'; ctx.fillRect(tx2, ty2+bh*0.18, bw*0.06, bh*0.18);
                ctx.fillStyle='#15803d'; ctx.beginPath(); ctx.arc(tx2+bw*0.03, ty2, bw*0.1, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle='#22c55e'; ctx.beginPath(); ctx.arc(tx2+bw*0.03, ty2-bh*0.04, bw*0.07, 0, Math.PI*2); ctx.fill();
            });
            const flC=['#fde68a','#f9a8d4','#a5f3fc','#bbf7d0'];
            for(let i=0;i<8;i++) {
                const fx2=bx+bw*0.08+i*(bw*0.11), fy2=by+bh*0.62+Math.sin(i)*bh*0.06;
                ctx.fillStyle=flC[i%4]; ctx.beginPath(); ctx.arc(fx2, fy2, 4, 0, Math.PI*2); ctx.fill();
            }
            ctx.strokeStyle='#16a34a'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.roundRect(bx+1, by+bh*0.44, bw-2, bh*0.56, 4); ctx.stroke();
        }
    } else if (bid==='kebun_raya') {
        const imgT3 = FV_TAMAN_IMAGES[3];
        if (imgT3 && imgT3.complete && imgT3.naturalWidth > 0) {
            const srcAR = 700/400; const dstAR = bw/bh;
            let sx=0,sy=0,sw=700,sh=400;
            if (srcAR > dstAR) { sw=Math.round(400*dstAR); sx=Math.round((700-sw)/2); }
            else { sh=Math.round(700/dstAR); sy=Math.round((400-sh)/2); }
            ctx.drawImage(imgT3, sx,sy,sw,sh, bx,by,bw,bh);
        } else {
            // Fallback canvas
            ctx.fillStyle='#166534';
            ctx.beginPath(); ctx.roundRect(bx, by+bh*0.4, bw, bh*0.6, [0,0,4,4]); ctx.fill();
            ctx.fillStyle='#7c5c2e'; ctx.fillRect(cx-bw*0.12, by+bh*0.38, bw*0.24, bh*0.08);
            ctx.fillRect(cx-bw*0.12, by+bh*0.4, bw*0.04, bh*0.2);
            ctx.fillRect(cx+bw*0.08, by+bh*0.4, bw*0.04, bh*0.2);
            const gC=['#16a34a','#22c55e','#4ade80','#15803d'];
            for(let i=0;i<12;i++) {
                const fx2=bx+bw*0.06+i*(bw*0.08), fy2=by+bh*0.55+Math.sin(i*1.3)*bh*0.1;
                ctx.fillStyle=gC[i%4]; ctx.beginPath(); ctx.arc(fx2, fy2, 4+Math.sin(i)*1.5, 0, Math.PI*2); ctx.fill();
            }
            ctx.strokeStyle='#15803d'; ctx.lineWidth=1.5;
            ctx.beginPath(); ctx.roundRect(bx+1, by+bh*0.39, bw-2, bh*0.61, 4); ctx.stroke();
        }

    // ──────────────── KOLAM ────────────────
    } else if (bid==='kolam_kristal') {
        const imgS1 = FV_SENDANG_IMAGES[1];
        if (imgS1 && imgS1.complete && imgS1.naturalWidth > 0) {
            const srcAR=700/400,dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if(srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgS1,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            ctx.fillStyle='#e0f2fe'; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.68,bw*0.4,bh*0.28,0,0,Math.PI*2); ctx.fill();
            const shimmer=0.4+0.3*Math.sin(t/500);
            ctx.fillStyle=`rgba(56,189,248,${shimmer})`; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.68,bw*0.32,bh*0.21,0,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle='#0284c7'; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.68,bw*0.4,bh*0.28,0,0,Math.PI*2); ctx.stroke();
            for(let i=0;i<6;i++){const ang=i*Math.PI/3;ctx.fillStyle='#94a3b8';ctx.beginPath();ctx.arc(cx+Math.cos(ang)*bw*0.38,by+bh*0.68+Math.sin(ang)*bh*0.26,4,0,Math.PI*2);ctx.fill();}
            ctx.fillStyle='#7c5c2e'; ctx.beginPath(); ctx.roundRect(cx-bw*0.18,by+bh*0.32,bw*0.36,bh*0.14,3); ctx.fill();
            ctx.fillStyle='#fef9c3'; ctx.font=`bold ${bh*0.08}px Nunito,sans-serif`; ctx.textAlign='center';
            ctx.fillText('Sendang',cx,by+bh*0.42); ctx.textAlign='left';
        }
    } else if (bid==='kolam_agung') {
        const imgS2 = FV_SENDANG_IMAGES[2];
        if (imgS2 && imgS2.complete && imgS2.naturalWidth > 0) {
            const srcAR=700/400,dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if(srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgS2,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            ctx.fillStyle='#bfdbfe'; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.65,bw*0.44,bh*0.31,0,0,Math.PI*2); ctx.fill();
            const sh2=0.45+0.3*Math.sin(t/450);
            ctx.fillStyle=`rgba(14,165,233,${sh2})`; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.65,bw*0.36,bh*0.24,0,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle='#0369a1'; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.65,bw*0.44,bh*0.31,0,0,Math.PI*2); ctx.stroke();
        }
    } else if (bid==='telaga_nirmala') {
        const imgS3 = FV_SENDANG_IMAGES[3];
        if (imgS3 && imgS3.complete && imgS3.naturalWidth > 0) {
            const srcAR=700/400,dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if(srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgS3,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            const telGrd=ctx.createRadialGradient(cx,by+bh*0.62,0,cx,by+bh*0.62,bw*0.46);
            telGrd.addColorStop(0,'rgba(232,121,249,0.9)'); telGrd.addColorStop(0.4,'rgba(56,189,248,0.8)');
            telGrd.addColorStop(0.8,'rgba(74,222,128,0.6)'); telGrd.addColorStop(1,'rgba(251,191,36,0.3)');
            ctx.fillStyle=telGrd; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.62,bw*0.46,bh*0.34,0,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle='#a855f7'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.ellipse(cx,by+bh*0.62,bw*0.46,bh*0.34,0,0,Math.PI*2); ctx.stroke();
        }

    // ──────────────── SEKOLAH ────────────────
    } else if (bid==='sekolah_peri') {
        const imgSk1 = FV_SEKOLAH_IMAGES[1];
        if (imgSk1 && imgSk1.complete && imgSk1.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgSk1,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fef9c3');
            roof('#6366f1', cx, by-3, bx-3, bx+bw+3, by+bh*0.38);
            ctx.fillStyle='#4f46e5'; ctx.beginPath(); ctx.roundRect(bx-3, by+bh*0.36, bw+6, bh*0.05, 1); ctx.fill();
            ctx.fillStyle='#1e3a5f'; ctx.beginPath(); ctx.roundRect(cx-bw*0.18, by+bh*0.42, bw*0.36, bh*0.16, 2); ctx.fill();
            ctx.fillStyle='#93c5fd'; ctx.font=`${bh*0.08}px serif`; ctx.textAlign='center';
            ctx.fillText('📚', cx, by+bh*0.54); ctx.textAlign='left';
            door('#4338ca', bw*0.24, bh*0.31);
            window_('#4f46e5', bx+bw*0.08, by+bh*0.44); window_('#4f46e5', bx+bw*0.68, by+bh*0.44);
            outlineBldg('#6366f1');
        }
    } else if (bid==='sanggar_tari') {
        const imgSk2 = FV_SEKOLAH_IMAGES[2];
        if (imgSk2 && imgSk2.complete && imgSk2.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgSk2,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fdf4ff');
            roof('#9333ea', cx, by-5, bx-4, bx+bw+4, by+bh*0.36);
            ctx.fillStyle='#7e22ce'; ctx.beginPath(); ctx.roundRect(bx-4, by+bh*0.34, bw+8, bh*0.05, 1); ctx.fill();
            ctx.fillStyle='rgba(167,139,250,0.3)'; ctx.beginPath(); ctx.arc(cx, by+bh*0.55, bw*0.2, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle='#a855f7'; ctx.font=`${bh*0.2}px serif`; ctx.textAlign='center';
            ctx.fillText('🎭', cx, by+bh*0.62); ctx.textAlign='left';
            door('#6b21a8', bw*0.25, bh*0.32);
            window_('#9333ea', bx+bw*0.07, by+bh*0.44); window_('#9333ea', bx+bw*0.67, by+bh*0.44);
            outlineBldg('#9333ea');
        }
    } else if (bid==='akademi_agung') {
        const imgSk3 = FV_SEKOLAH_IMAGES[3];
        if (imgSk3 && imgSk3.complete && imgSk3.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgSk3,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fefce8');
            for(let i=0;i<4;i++){ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.roundRect(bx+bw*0.08+i*bw*0.24,by+bh*0.35,bw*0.08,bh*0.65,2);ctx.fill();}
            roof('#1d4ed8', cx, by-7, bx-5, bx+bw+5, by+bh*0.33);
            roof('#2563eb', cx, by+bh*0.2, bx-2, bx+bw+2, by+bh*0.38);
            door('#1e3a8a', bw*0.26, bh*0.36); outlineBldg('#2563eb');
        }

    // ──────────────── PASAR ────────────────
    } else if (bid==='pasar_peri') {
        const imgPs1 = FV_PASAR_IMAGES[1];
        if (imgPs1 && imgPs1.complete && imgPs1.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgPs1,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fef3c7');
            ctx.fillStyle='#dc2626'; ctx.beginPath(); ctx.moveTo(bx-2,by+bh*0.42); ctx.lineTo(cx,by+bh*0.2); ctx.lineTo(bx+bw+2,by+bh*0.42); ctx.closePath(); ctx.fill();
            ctx.fillStyle='#7c3aed'; ctx.beginPath(); ctx.roundRect(cx-bw*0.25,by+bh*0.55,bw*0.5,bh*0.18,2); ctx.fill();
            ctx.fillStyle='#fde68a'; ctx.font=`${bh*0.12}px serif`; ctx.textAlign='center';
            ctx.fillText('🛒', cx, by+bh*0.68); ctx.textAlign='left';
            outlineBldg('#dc2626');
        }
    } else if (bid==='balai_dagang') {
        const imgPs2 = FV_PASAR_IMAGES[2];
        if (imgPs2 && imgPs2.complete && imgPs2.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgPs2,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fff7ed');
            roof('#ea580c', cx, by-4, bx-3, bx+bw+3, by+bh*0.37);
            ctx.fillStyle='#1e3a5f'; ctx.beginPath(); ctx.roundRect(cx-bw*0.22,by+bh*0.4,bw*0.44,bh*0.16,3); ctx.fill();
            ctx.fillStyle='#fde68a'; ctx.font=`${bh*0.11}px serif`; ctx.textAlign='center';
            ctx.fillText('🏪', cx, by+bh*0.53); ctx.textAlign='left';
            door('#7c2d12', bw*0.24, bh*0.33); outlineBldg('#ea580c');
        }
    } else if (bid==='pusat_niaga') {
        const imgPs3 = FV_PASAR_IMAGES[3];
        if (imgPs3 && imgPs3.complete && imgPs3.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgPs3,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            wall('#fefce8');
            ctx.fillStyle='#d4a72c'; ctx.beginPath(); ctx.roundRect(bx+bw*0.1,by+bh*0.05,bw*0.8,bh*0.35,[4,4,0,0]); ctx.fill();
            ctx.fillStyle='#b45309'; ctx.beginPath(); ctx.roundRect(bx,by+bh*0.38,bw,bh*0.62,[0,0,4,4]); ctx.fill();
            ctx.fillStyle='#fbbf24'; ctx.font=`${bh*0.18}px serif`; ctx.textAlign='center';
            ctx.fillText('🏦', cx, by+bh*0.7); ctx.textAlign='left';
            outlineBldg('#b45309');
        }

    // ──────────────── MENARA ────────────────
    } else if (bid==='menara_kecil') {
        const imgMn1 = FV_MENARA_IMAGES[1];
        if (imgMn1 && imgMn1.complete && imgMn1.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgMn1,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            const mw=bw*0.45, mx2=cx-mw/2;
            ctx.fillStyle='#d1d5db'; ctx.beginPath(); ctx.roundRect(mx2,by+bh*0.25,mw,bh*0.75,3); ctx.fill();
            ctx.fillStyle='#6b7280'; ctx.beginPath(); ctx.moveTo(cx,by); ctx.lineTo(mx2-2,by+bh*0.27); ctx.lineTo(mx2+mw+2,by+bh*0.27); ctx.closePath(); ctx.fill();
            const glCandle=0.5+0.4*Math.sin(t/400);
            ctx.fillStyle=`rgba(254,240,138,${glCandle})`; ctx.beginPath(); ctx.arc(cx,by+bh*0.45,mw*0.2,0,Math.PI*2); ctx.fill();
            outlineBldg('#6b7280');
        }
    } else if (bid==='menara_wilis') {
        const imgMn2 = FV_MENARA_IMAGES[2];
        if (imgMn2 && imgMn2.complete && imgMn2.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgMn2,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            const mw=bw*0.5, mx2=cx-mw/2;
            ctx.fillStyle='#c7d2fe'; ctx.beginPath(); ctx.roundRect(mx2,by+bh*0.2,mw,bh*0.8,3); ctx.fill();
            ctx.fillStyle='#4f46e5'; ctx.beginPath(); ctx.moveTo(cx,by-2); ctx.lineTo(mx2-3,by+bh*0.22); ctx.lineTo(mx2+mw+3,by+bh*0.22); ctx.closePath(); ctx.fill();
            const glW=0.6+0.4*Math.sin(t/350);
            ctx.fillStyle=`rgba(199,210,254,${glW})`; ctx.beginPath(); ctx.arc(cx,by+bh*0.4,mw*0.22,0,Math.PI*2); ctx.fill();
            outlineBldg('#6366f1');
        }
    } else if (bid==='menara_cahaya') {
        const imgMn3 = FV_MENARA_IMAGES[3];
        if (imgMn3 && imgMn3.complete && imgMn3.naturalWidth > 0) {
            const srcAR=700/400, dstAR=bw/bh; let sx=0,sy=0,sw=700,sh=400;
            if (srcAR>dstAR){sw=Math.round(400*dstAR);sx=Math.round((700-sw)/2);}
            else{sh=Math.round(700/dstAR);sy=Math.round((400-sh)/2);}
            ctx.drawImage(imgMn3,sx,sy,sw,sh,bx,by,bw,bh);
        } else {
            const mw=bw*0.5, mx2=cx-mw/2;
            const mGrd=ctx.createLinearGradient(mx2,by,mx2+mw,by+bh);
            mGrd.addColorStop(0,'#fef9c3'); mGrd.addColorStop(1,'#fbbf24');
            ctx.fillStyle=mGrd; ctx.beginPath(); ctx.roundRect(mx2,by+bh*0.18,mw,bh*0.82,3); ctx.fill();
            ctx.fillStyle='#d97706'; ctx.beginPath(); ctx.moveTo(cx,by-5); ctx.lineTo(mx2-3,by+bh*0.2); ctx.lineTo(mx2+mw+3,by+bh*0.2); ctx.closePath(); ctx.fill();
            outlineBldg('#d97706');
        }

    // ──────────────── ISTANA / LEGACY ────────────────
    } else if (bid==='istana_mini') {
        const imgIs1 = FV_ISTANA_IMAGES[1];
        if (imgIs1 && imgIs1.complete && imgIs1.naturalWidth > 0) {
            // FIX: gambar langsung tanpa crop — sesuaikan ke ukuran slot
            ctx.drawImage(imgIs1, bx, by, bw, bh);
        } else {
            wall('#fef9c3');
            [[bx,by+bh*0.15,bw*0.22],[bx+bw*0.78,by+bh*0.15,bw*0.22]].forEach(([tx2,ty2,tw2])=>{
                ctx.fillStyle='#e2e8f0'; ctx.beginPath(); ctx.roundRect(tx2,ty2,tw2,bh*0.85,2); ctx.fill();
                ctx.fillStyle='#94a3b8'; ctx.beginPath(); ctx.moveTo(tx2,ty2); ctx.lineTo(tx2+tw2/2,by); ctx.lineTo(tx2+tw2,ty2); ctx.closePath(); ctx.fill();
            });
            wall('#fef9c3', bw*0.2, bh*0.28, bw*0.6, bh*0.72, 3);
            roof('#7c3aed', cx, by+bh*0.15, bx+bw*0.18, bx+bw*0.82, by+bh*0.35);
            door('#4c1d95', bw*0.22, bh*0.3, cx-bw*0.11);
            outlineBldg('#7c3aed');
        }
    } else {
        // Default fallback — kotak warna
        const bgC=['#fef3c7','#dbeafe','#f3e8ff','#ffedd5','#fef9c3'];
        const bdC=['#d97706','#2563eb','#9333ea','#ea580c','#ca8a04'];
        const tier=(FAIRY_BUILDINGS[bid]?.tier)||0;
        ctx.fillStyle=bgC[tier]||'#fef3c7';
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,5); ctx.fill();
        ctx.strokeStyle=bdC[tier]||'#d97706'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,5); ctx.stroke();
        ctx.font=`${Math.min(bw,bh)*0.55}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(FAIRY_BUILDINGS[bid]?.emoji||'🏠', cx, by+bh*0.5);
        ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    }

    // Nama bangunan di bawah (semua tipe)
    const bDef=FAIRY_BUILDINGS[bid];
    if (bDef) {
        const nameStr = bDef.name.replace(/^[^\s]+\s/,'').slice(0,14);
        ctx.font=`bold ${Math.max(5,bh*0.095)}px Nunito,sans-serif`;
        const nw2 = ctx.measureText(nameStr).width+6;
        ctx.fillStyle='rgba(0,0,0,0.55)';
        ctx.beginPath(); ctx.roundRect(cx-nw2/2, by+bh+1, nw2, 9, 2); ctx.fill();
        ctx.fillStyle='#fef9c3'; ctx.textAlign='center';
        ctx.fillText(nameStr, cx, by+bh+8);
        ctx.textAlign='left';
    }
    ctx.restore();
}

// ── Pohon Energi — Canvas drawn ──────────────────────────────
function drawFVPohonEnergi(ctx, px, py, TS2, t) {
    ctx.save();
    const cx2=px+TS2, cy2=py+TS2;
    // Akar / tanah
    ctx.fillStyle='rgba(74,222,128,0.2)';
    ctx.beginPath(); ctx.ellipse(cx2, py+TS2*1.9, TS2*1.4, TS2*0.45, 0, 0, Math.PI*2); ctx.fill();
    // Batang
    const trunkGrd = ctx.createLinearGradient(cx2-TS2*0.2, py, cx2+TS2*0.2, py);
    trunkGrd.addColorStop(0,'#5c3d1e'); trunkGrd.addColorStop(0.5,'#7c5c2e'); trunkGrd.addColorStop(1,'#5c3d1e');
    ctx.fillStyle=trunkGrd;
    ctx.beginPath();
    ctx.moveTo(cx2-TS2*0.22, py+TS2*1.8);
    ctx.lineTo(cx2-TS2*0.15, py+TS2*0.7);
    ctx.lineTo(cx2+TS2*0.15, py+TS2*0.7);
    ctx.lineTo(cx2+TS2*0.22, py+TS2*1.8);
    ctx.closePath(); ctx.fill();
    // Kanopi 3 lapis (dari bawah ke atas)
    const sway=Math.sin(t/1200)*2;
    [[TS2*1.15,'#14532d',0],[TS2*1.0,'#15803d',TS2*0.18],[TS2*0.78,'#22c55e',TS2*0.32]].forEach(([r,col,dy3])=>{
        const grd2=ctx.createRadialGradient(cx2+sway,cy2-dy3,0,cx2+sway,cy2-dy3,r);
        grd2.addColorStop(0,col); grd2.addColorStop(1,col+'88');
        ctx.fillStyle=grd2;
        ctx.beginPath(); ctx.arc(cx2+sway, cy2-dy3, r, 0, Math.PI*2); ctx.fill();
    });
    // Partikel debu emas mengambang
    for(let i=0;i<8;i++) {
        const ang=i*Math.PI*2/8+t/2500;
        const r2=TS2*0.7+Math.sin(t/600+i)*TS2*0.25;
        const gl=0.4+0.5*Math.sin(t/500+i*0.7);
        ctx.fillStyle=`rgba(251,191,36,${gl})`;
        ctx.beginPath(); ctx.arc(cx2+sway+Math.cos(ang)*r2, cy2-TS2*0.3+Math.sin(ang)*r2*0.5, 2+Math.sin(t/400+i), 0, Math.PI*2); ctx.fill();
    }
    // Label
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.font='bold 7px Nunito,sans-serif'; ctx.textAlign='center';
    const lw=ctx.measureText('Pohon Energi').width+6;
    ctx.fillRect(cx2-lw/2, py+TS2*2.0, lw, 10);
    ctx.fillStyle='#4ade80'; ctx.fillText('Pohon Energi', cx2, py+TS2*2.08);
    ctx.textAlign='left'; ctx.restore();
}

function drawFairyWorld(ts) {
    if (!fvCtx) return;
    const ctx = fvCtx;
    // Pakai GAME_WIDTH/GAME_HEIGHT (logical size, sudah discale main loop)
    const W = (typeof GAME_WIDTH !== 'undefined') ? GAME_WIDTH : (fvCanvas ? fvCanvas.width : 480);
    const H = (typeof GAME_HEIGHT !== 'undefined') ? GAME_HEIGHT : (fvCanvas ? fvCanvas.height : 270);
    const fv = getFairyVillage();
    const t = ts || performance.now();
    const now = Date.now();

    // ── Sinkronkan fvCam dengan STATE.camera (diupdate main loop) ──
    fvCam.x = STATE.camera.x;
    fvCam.y = STATE.camera.y;

    // ── Sinkronkan fvPlayer dengan STATE.player ──
    fvPlayer.x = STATE.player.x;
    fvPlayer.y = STATE.player.y;

    // ── LABEL WAKTU & MUSIM (screen space - kompensasi kamera) ──────
    const _tod = getFVTimeOfDay();
    const _season = getFVSeason();
    const _todLabel = { pagi:'🌅 Pagi', siang:'☀️ Siang', sore:'🌤️ Sore', senja:'🌇 Senja', malam:'🌙 Malam' };
    ctx.save();
    // Kompensasi translate kamera agar label tetap di pojok kiri atas layar
    ctx.translate(Math.floor(fvCam.x), Math.floor(fvCam.y));
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(6, 6, 170, 22);
    ctx.fillStyle = '#fef9c3';
    ctx.fillText((_todLabel[_tod]||'🌙 Malam') + '  |  ' + _season.label, 10, 10);
    ctx.restore();

    // Viewport culling (berdasarkan fvCam yang sudah sync STATE.camera)
    const visX0 = Math.floor(fvCam.x/TS)-1, visX1 = visX0+Math.ceil(W/TS)+2;
    const visY0 = Math.floor(fvCam.y/TS)-1, visY1 = visY0+Math.ceil(H/TS)+2;

    // Ground tiles — hanya tampil jika kayangan.png TIDAK berhasil dimuat
    if (!(fvBgImage && fvBgImage.complete && fvBgImage.naturalWidth > 0)) {
        for (let ty=Math.max(0,visY0); ty<Math.min(FH,visY1); ty++) {
            for (let tx=Math.max(0,visX0); tx<Math.min(FW,visX1); tx++) {
                const even=(tx+ty)%2===0;
                ctx.fillStyle = even?'#1c3a20':'#1f4024';
                ctx.fillRect(tx*TS, ty*TS, TS, TS);
            }
        }

        // Main path — jalur utama (hanya tanpa bg)
        ctx.fillStyle='#2a1e10';
        for (let tx=0;tx<FW;tx++) ctx.fillRect(tx*TS, Math.floor(FH/2)*TS, TS, TS*2);
        for (let ty=0;ty<FH;ty++) ctx.fillRect(Math.floor(FW/2)*TS, ty*TS, TS*2, TS);

        // Secondary paths
        ctx.fillStyle='#251a0c';
        [8,20,30].forEach(ty=> { for(let tx=0;tx<FW;tx++) ctx.fillRect(tx*TS,ty*TS,TS,TS); });
    }

    // Stars — hanya muncul saat senja & malam (sinkron dunia manusia)
    if (_tod === 'senja' || _tod === 'malam') {
        const _starAlpha = _tod === 'malam' ? 0.55 : 0.25; // senja redup, malam terang
        ctx.fillStyle='rgba(255,255,220,1)';
        for (let i=0;i<80;i++) {
            const sx=((i*173+20)%(FW*TS)), sy=((i*97+10)%(FH*TS));
            const pulse = 0.3+0.5*Math.sin(t/800+i*1.3);
            ctx.globalAlpha=pulse*_starAlpha; ctx.fillRect(sx,sy,2,2);
        }
        ctx.globalAlpha=1;
    }

    // Slot markers (kosong)
    const builtSlots   = new Set((fv.buildings||[]).map(b=>b.slotId));
    const queueSlots   = new Set((fv.buildQueue||[]).map(b=>b.slotId));
    FAIRY_SLOTS.forEach(slot => {
        if (builtSlots.has(slot.id) || queueSlots.has(slot.id)) return;
        ctx.strokeStyle='rgba(167,139,250,0.25)'; ctx.lineWidth=1;
        ctx.setLineDash([3,4]);
        ctx.strokeRect(slot.x*TS+1, slot.y*TS+1, TS*2-2, TS*2-2);
        ctx.setLineDash([]);
    });

    // Bangunan dalam antrian (animasi konstruksi)
    (fv.buildQueue||[]).forEach(({slotId, bid, finishTime}) => {
        const slot = FAIRY_SLOTS.find(s=>s.id===slotId); if (!slot) return;
        const b = FAIRY_BUILDINGS[bid]; if (!b) return;
        const bx=slot.x*TS, by=slot.y*TS, bw=TS*2, bh=TS*2;
        const progress = 1 - Math.max(0, (finishTime-now)/BUILD_DURATION_MS);

        // Background
        ctx.fillStyle='rgba(30,20,10,0.8)';
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,4); ctx.fill();
        ctx.strokeStyle='#f59e0b'; ctx.lineWidth=1.5;
        ctx.setLineDash([4,3]); ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,4); ctx.stroke(); ctx.setLineDash([]);

        // Progress bar
        ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(bx+3,by+bh-8,bw-6,5);
        ctx.fillStyle='#f59e0b'; ctx.fillRect(bx+3,by+bh-8,(bw-6)*progress,5);

        // Emoji + label
        ctx.font=`${TS*0.8}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.globalAlpha=0.5+0.4*Math.sin(t/400);
        ctx.fillText(b.emoji||'🏗️', bx+bw/2, by+bh/2-4);
        ctx.globalAlpha=1;
        ctx.fillStyle='#fbbf24'; ctx.font='6px sans-serif';
        const secsLeft = Math.max(0, Math.ceil((finishTime-now)/1000));
        ctx.fillText(`${secsLeft}s`, bx+bw/2, by+8);
        ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    });

    // ── Dekorasi pohon pinggir peta (render sebelum bangunan) ──
    FV_DECO_TREES.forEach(({x,y},i) => {
        if ((fv.buildings?.length||0) <= i*2) return;
        const sway = Math.sin(t/1500+i)*2;
        const ts2 = TS * 1.5; // pohon dekorasi lebih besar dari tile
        const cx = x*TS + TS*0.5, cy = y*TS + TS*0.5;
        // Batang
        ctx.fillStyle='#7c5c2e';
        ctx.fillRect(cx - ts2*0.06 + sway*0.3, cy + ts2*0.1, ts2*0.12, ts2*0.55);
        // Kanopi 3 lapis lebih besar
        [[0,'#14532d',ts2*0.52],[ts2*0.06,'#15803d',ts2*0.42],[ts2*0.13,'#22c55e',ts2*0.28]].forEach(([dy2,col,r])=>{
            ctx.fillStyle=col;
            ctx.beginPath();
            ctx.arc(cx + sway*0.5, cy - ts2*0.1 + dy2, r, 0, Math.PI*2);
            ctx.fill();
        });
    });

    // Bangunan dirender oleh main loop via drawBuilding — tidak perlu render ulang di sini

    // ── ISTANA PERI — landmark permanen, selalu tampil penuh seperti bangunan lain ──
    {
        const isHitW = TS*3, isHitH = TS*3;
        const isVS   = 2.2;
        const isVW   = isHitW * isVS, isVH = isHitH * isVS;
        const isX    = FV_ISTANA_POS.x * TS, isY = FV_ISTANA_POS.y * TS;
        const isVX   = isX + isHitW/2 - isVW/2;
        const isVY   = isY + isHitH   - isVH; // anchor bawah

        const imgIs = FV_ISTANA_IMAGES[1];
        if (imgIs && imgIs.complete && imgIs.naturalWidth > 0) {
            ctx.drawImage(imgIs, isVX, isVY, isVW, isVH);
        } else {
            // Fallback canvas — istana megah tanpa efek transparan
            const cx2 = isVX + isVW/2;
            // Badan utama
            ctx.fillStyle = '#fef9c3';
            ctx.beginPath(); ctx.roundRect(isVX + isVW*0.1, isVY + isVH*0.3, isVW*0.8, isVH*0.7, 6); ctx.fill();
            // Menara kiri-kanan
            [[isVX, isVY+isVH*0.15, isVW*0.22],[isVX+isVW*0.78, isVY+isVH*0.15, isVW*0.22]].forEach(([tx3,ty3,tw3])=>{
                ctx.fillStyle = '#e2e8f0';
                ctx.beginPath(); ctx.roundRect(tx3, ty3, tw3, isVH*0.85, 3); ctx.fill();
                ctx.fillStyle = '#7c3aed';
                ctx.beginPath(); ctx.moveTo(tx3,ty3); ctx.lineTo(tx3+tw3/2,isVY); ctx.lineTo(tx3+tw3,ty3); ctx.closePath(); ctx.fill();
            });
            // Atap tengah
            ctx.fillStyle = '#7c3aed';
            ctx.beginPath(); ctx.moveTo(isVX+isVW*0.18,isVY+isVH*0.35); ctx.lineTo(cx2,isVY+isVH*0.1); ctx.lineTo(isVX+isVW*0.82,isVY+isVH*0.35); ctx.closePath(); ctx.fill();
            // Pintu
            ctx.fillStyle = '#4c1d95';
            ctx.beginPath(); ctx.roundRect(cx2 - isVW*0.1, isVY+isVH*0.72, isVW*0.2, isVH*0.28, [4,4,0,0]); ctx.fill();
            // Jendela kiri-kanan
            ctx.fillStyle = 'rgba(200,230,255,0.8)';
            ctx.beginPath(); ctx.roundRect(isVX+isVW*0.2, isVY+isVH*0.45, isVW*0.12, isVH*0.13, 2); ctx.fill();
            ctx.beginPath(); ctx.roundRect(isVX+isVW*0.68, isVY+isVH*0.45, isVW*0.12, isVH*0.13, 2); ctx.fill();
            // Emoji
            ctx.font = `${isVH*0.22}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText('🏰', cx2, isVY + isVH*0.22);
            ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        }

        // Label nama — selalu tampil seperti bangunan lain
        ctx.font = 'bold 9px Nunito,sans-serif';
        const _iLabel = '🏰 Puri Agung Wilis';
        const _iLW = ctx.measureText(_iLabel).width + 10;
        ctx.fillStyle = 'rgba(30,5,60,0.85)';
        ctx.beginPath(); ctx.roundRect(isX + isHitW/2 - _iLW/2, isVY - 16, _iLW, 13, 4); ctx.fill();
        ctx.fillStyle = '#fde68a'; ctx.textAlign = 'center';
        ctx.fillText(_iLabel, isX + isHitW/2, isVY - 5);
        ctx.textAlign = 'left';

        // Tanda seru jika player dekat (sama seperti Pohon Energi)
        const distIs = Math.hypot(fvPlayer.x - (isX + TS), fvPlayer.y - (isY + TS));
        if (distIs < TS * 4) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('!', isX + isHitW/2, isVY - 22);
            ctx.textAlign = 'left';
        }
    }

    // ── Pohon Energi — pakai gambar pohonperi.png, paling besar di peta ──
    const poHitW = TS*3, poHitH = TS*3;
    const poVS = 3.5; // pohon paling besar
    const poVW = poHitW * poVS, poVH = poHitH * poVS;
    const poX = FV_POHON_POS.x*TS, poY = FV_POHON_POS.y*TS;
    const poVX = poX + poHitW/2 - poVW/2;
    const poVY = poY + poHitH - poVH; // anchor bawah
    if (fvPohonImg && fvPohonImg.complete && fvPohonImg.naturalWidth > 0) {
        ctx.drawImage(fvPohonImg, poVX, poVY, poVW, poVH);
    } else {
        // Fallback canvas jika gambar belum load
        drawFVPohonEnergi(ctx, poVX, poVY, poVW/2, t);
    }
    const distP = Math.hypot(fvPlayer.x-(poX+TS), fvPlayer.y-(poY+TS));
    if (distP < TS*3.5) {
        ctx.fillStyle='#fbbf24'; ctx.font='bold 22px sans-serif'; ctx.textAlign='center';
        ctx.fillText('!', poX+poHitW/2, poVY-10);
        ctx.textAlign='left';
    }

    // ── Rara Wilis aura ──
    const raraX=FV_RARA_POS.x*TS, raraY=FV_RARA_POS.y*TS;
    const aura=0.10+0.10*Math.sin(t/500);
    const raraGrd = ctx.createRadialGradient(raraX+TS,raraY+TS,0,raraX+TS,raraY+TS,TS*2);
    raraGrd.addColorStop(0,`rgba(167,139,250,${aura*2})`);
    raraGrd.addColorStop(1,'rgba(167,139,250,0)');
    ctx.fillStyle=raraGrd; ctx.beginPath();
    ctx.arc(raraX+TS, raraY+TS, TS*2, 0, Math.PI*2); ctx.fill();

    // ── Update NPC runtime positions & collect all Y-sorted drawables ──
    // Init NPC runtime jika belum ada
    const _fvMapNpcs = (typeof maps!=='undefined' && maps['fairyVillage']) ? maps['fairyVillage'].npcs : [];
    _fvMapNpcs.forEach(n => {
        if (!fvNpcRuntime[n.id]) {
            fvNpcRuntime[n.id] = {
                px: n.x * TS,
                py: n.y * TS,
                vx: (n.vx||0) * TS * 0.015,
                vy: (n.vy||0) * TS * 0.015,
                facing: 'down',
                timer: Math.random()*200
            };
        }
    });
    // Update wander NPCs
    const _fvPx = typeof fvPlayer !== 'undefined' ? fvPlayer.x : -9999;
    const _fvPy = typeof fvPlayer !== 'undefined' ? fvPlayer.y : -9999;
    _fvMapNpcs.forEach(n => {
        if (n.type !== 'wander') return;
        const rt = fvNpcRuntime[n.id];
        if (!rt) return;

        // FIX: Stop NPC saat player dekat (radius TS*2.5) — sama seperti NPC darat main game
        const _nCX = rt.px + 19, _nCY = rt.py + 29;
        const _distToPlayer = Math.hypot(_fvPx + 10 - _nCX, _fvPy + 10 - _nCY);
        if (_distToPlayer < TS * 2.5) {
            rt.vx = 0; rt.vy = 0; // berhenti
            n._rtx = rt.px / TS; n._rty = rt.py / TS;
            return;
        }

        rt.timer = (rt.timer||0) - 1;
        if (rt.timer <= 0) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 0.3 + Math.random()*0.4;
            rt.vx = Math.cos(angle)*spd;
            rt.vy = Math.sin(angle)*spd;
            rt.timer = 80 + Math.random()*160;
            if (Math.abs(rt.vx) > Math.abs(rt.vy)) rt.facing = rt.vx>0?'right':'left';
            else rt.facing = rt.vy>0?'down':'up';
        }
        const nx = rt.px + rt.vx;
        const ny = rt.py + rt.vy;
        // Bounce di batas peta
        rt.px = Math.max(TS, Math.min((FW-3)*TS, nx));
        rt.py = Math.max(TS, Math.min((FH-3)*TS, ny));
        if (nx<=TS || nx>=(FW-3)*TS) { rt.vx *= -1; rt.facing = rt.vx>0?'right':'left'; }
        if (ny<=TS || ny>=(FH-3)*TS) { rt.vy *= -1; rt.facing = rt.vy>0?'down':'up'; }
        n._rtx = rt.px / TS;
        n._rty = rt.py / TS;
    });

    // ── Y-sorted draw: Bangunan + NPC map + fairies + player ──
    const _drawables = [];

    // ── BANGUNAN: masuk ke Y-sort agar player bisa di depan/belakang bangunan ──
    const _fvMap = maps['fairyVillage'];
    if (_fvMap && _fvMap.buildings) {
        _fvMap.buildings.forEach(b => {
            if (typeof b.y !== 'number') return;
            // sortY = kaki bangunan (baris tile paling bawah)
            const sortY = (b.y + b.h) * TS;
            _drawables.push({ sortY, type: 'fv_building', b });
        });
    }

    // NPC dari maps['fairyVillage'] (Rara Wilis, peri kecil)
    _fvMapNpcs.forEach(n => {
        const rt = fvNpcRuntime[n.id];
        const px_ = rt ? rt.px : n.x * TS;
        const py_ = rt ? rt.py : n.y * TS;
        // Ukuran NPC sama dengan map utama: 38x58
        const nW = n.w || 38, nH = n.h || 58;
        _drawables.push({ sortY: py_ + nH, type:'npc', n, px:px_, py:py_, nW, nH, rt });
    });

    // Peri wandering (dari fv.fairies)
    // Skip peri default (t1–t5: Rara Wilis, Wening, Sekar, Bening, Juna)
    // karena mereka sudah dirender sebagai NPC peta (maps['fairyVillage'].npcs)
    const _DEFAULT_FAIRY_IDS = ['t1','t2','t3','t4','t5'];
    fv.fairies.forEach((f,i)=>{
        if (_DEFAULT_FAIRY_IDS.includes(f.id)) return; // sudah jadi NPC peta, skip
        if (!fvNpcRuntime['fairy_'+f.id]) {
            fvNpcRuntime['fairy_'+f.id] = {
                px: (8+i*9)*TS + (Math.random()-0.5)*TS*4,
                py: (5+i%5*7)*TS + (Math.random()-0.5)*TS*3,
                vx: (Math.random()-0.5)*0.5,
                vy: (Math.random()-0.5)*0.5,
                timer: Math.random()*180,
                facing: 'down',
                stopped: false
            };
        }
        const rt = fvNpcRuntime['fairy_'+f.id];
        // FIX: Stop saat player dekat (sama seperti NPC darat main game)
        const _bfCX = rt.px + 19, _bfCY = rt.py + 29;
        const _bfDist = Math.hypot(_fvPx + 10 - _bfCX, _fvPy + 10 - _bfCY);
        if (_bfDist < TS * 2.5) {
            rt.vx = 0; rt.vy = 0;
        } else {
            rt.timer = (rt.timer||0) - 1;
            if (rt.timer <= 0) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 0.25 + Math.random()*0.35;
                rt.vx = Math.cos(angle)*spd; rt.vy = Math.sin(angle)*spd;
                rt.timer = 100 + Math.random()*200;
                rt.facing = Math.abs(rt.vx)>Math.abs(rt.vy) ? (rt.vx>0?'right':'left') : (rt.vy>0?'down':'up');
            }
            const _bfNx = rt.px+rt.vx, _bfNy = rt.py+rt.vy;
            rt.px = Math.max(TS, Math.min((FW-3)*TS, _bfNx));
            rt.py = Math.max(TS, Math.min((FH-3)*TS, _bfNy));
            if (_bfNx<=TS || _bfNx>=(FW-3)*TS) { rt.vx*=-1; rt.facing = rt.vx>0?'right':'left'; }
            if (_bfNy<=TS || _bfNy>=(FH-3)*TS) { rt.vy*=-1; rt.facing = rt.vy>0?'down':'up'; }
        }
        _drawables.push({ sortY: rt.py+TS*1.2, type:'fairy', f, px:rt.px, py:rt.py });
    });

    // FIX: Masukkan player ke _drawables agar Y-sort bersama peri & NPC
    // Kaki player ada di: p.y + p.h/2 + 12 = p.y + 22
    _drawables.push({
        sortY: fvPlayer.y + 22,
        type: 'player_fv',
        px: fvPlayer.x,
        py: fvPlayer.y
    });

    // Sort by Y — player, peri, NPC semua diurutkan bersama
    _drawables.sort((a,b2) => a.sortY - b2.sortY);

    // Draw semua termasuk player
    _drawables.forEach(d => {
        if (d.type === 'fv_building') {
            // Render bangunan via drawBuilding (fungsi utama — sama persis map utama)
            if (typeof drawBuilding === 'function') drawBuilding(ctx, d.b);
            return;
        } else if (d.type === 'player_fv') {
            // Render player dengan drawPlayer — ukuran & animasi identik map utama (38×58)
            if (typeof drawPlayer === 'function') drawPlayer(ctx, STATE.player);
            return;
        } else if (d.type === 'npc') {
            const {n, px:nx2, py:ny2, nW, nH} = d;
            // FIX: Skip NPC yang ditandai noRender (misal trigger invisible istana)
            if (n.noRender) return;
            // Shadow di tanah (tetap di posisi kaki, tidak ikut animasi)
            ctx.fillStyle='rgba(0,0,0,0.3)';
            ctx.beginPath(); ctx.ellipse(nx2+nW/2, ny2+nH-5, nW/3, 4, 0, 0, Math.PI*2); ctx.fill();
            // Animasi nafas saja (sama seperti NPC darat di main game) — TIDAK melayang
            const _fvBreathe = 1 + Math.sin(Date.now()/300) * 0.015;
            // Load sprite
            if (!n.imgSrc && n.sprite) n.imgSrc = n.sprite;
            if (!n.loadedImg) {
                n.loadedImg = new Image();
                n.loadedImg.src = n.imgSrc || 'images/rarawilis.png';
            }
            if (n.loadedImg.complete && n.loadedImg.naturalWidth>0) {
                ctx.save();
                // Pivot di kaki tengah agar tumbuh ke atas (sama persis main game drawNPC)
                ctx.translate(Math.round(nx2+nW/2), Math.round(ny2+nH-5));
                ctx.scale(1, _fvBreathe);
                ctx.drawImage(n.loadedImg, -nW/2, -nH, nW, nH);
                ctx.restore();
            } else {
                ctx.font=`${nH*0.6}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
                ctx.fillText('🧚', nx2+nW/2, ny2+nH/2);
                ctx.textAlign='left'; ctx.textBaseline='alphabetic';
            }
            // Nametag (posisi tetap, tidak bergerak)
            if (!n.noNameTag && n.name) {
                ctx.font='bold 9px Nunito,sans-serif';
                const _nw2 = ctx.measureText(n.name).width+6;
                ctx.fillStyle='rgba(30,5,60,0.7)';
                ctx.fillRect(nx2+nW/2-_nw2/2, ny2-14, _nw2, 12);
                ctx.fillStyle='#e9d5ff'; ctx.textAlign='center';
                ctx.fillText(n.name, nx2+nW/2, ny2-4);
                ctx.textAlign='left';
            }
            // Sparkle Rara Wilis
            if (n.id==='rara_wilis') {
                const sz=0.4+0.3*Math.sin(t/300);
                ctx.fillStyle=`rgba(255,220,80,${sz})`;
                ctx.font=`${TS*0.7}px serif`; ctx.textAlign='center';
                ctx.fillText('✨', nx2+nW/2, ny2-16);
                ctx.textAlign='left';
            }
        } else if (d.type === 'fairy') {
            const {f, px:fx, py:fy} = d;
            // Animasi nafas saja — TIDAK melayang (sama seperti NPC darat)
            const _fvBreathe2 = 1 + Math.sin(Date.now()/300) * 0.015;
            // Shadow di tanah
            ctx.fillStyle='rgba(0,0,0,0.25)';
            ctx.beginPath(); ctx.ellipse(fx+19, fy+58-5, 13, 4, 0, 0, Math.PI*2); ctx.fill();
            // Sprite peri ukuran 38×58
            const imgSrc3 = _khImg(f);
            const cached3 = fvSpriteCache[imgSrc3];
            if (cached3 && cached3.complete && cached3.naturalWidth>0) {
                ctx.save();
                ctx.translate(Math.round(fx+19), Math.round(fy+53));
                ctx.scale(1, _fvBreathe2);
                ctx.drawImage(cached3, -19, -58, 38, 58);
                ctx.restore();
            } else {
                if (!cached3) { const i2=new Image(); i2.src=imgSrc3; fvSpriteCache[imgSrc3]=i2; }
                ctx.font=`38px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
                ctx.fillText(f.gender==='boy'?'🧚‍♂️':'🧚‍♀️', fx+19, fy+29);
                ctx.textAlign='left'; ctx.textBaseline='alphabetic';
            }
            // Nametag peri (posisi tetap)
            ctx.font='bold 9px Nunito,sans-serif';
            const _fw = ctx.measureText(f.name||'').width+6;
            ctx.fillStyle='rgba(30,5,60,0.7)';
            ctx.fillRect(fx+19-_fw/2, fy-14, _fw, 12);
            ctx.fillStyle='#f9a8d4'; ctx.textAlign='center';
            ctx.fillText(f.name||'', fx+19, fy-4);
            ctx.textAlign='left';
        }
    });

    // Partikel
    fvParticles = fvParticles.filter(p=>p.life>0);
    fvParticles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.06; p.life--;
        ctx.globalAlpha=p.life/p.maxLife;
        ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,3,3);
    });
    ctx.globalAlpha=1;

    // Kunang-kunang — muncul saat senja & malam
    if (_tod === 'senja' || _tod === 'malam') {
        drawFVFireflies(ctx, t);
    }

    // ── PARTIKEL MUSIM — sinkron STATE.season dunia manusia ─────
    drawFVSeasonParticles(ctx, W, H, t, _season);

    // Dialog overlay
    if (fvActiveDialog) drawFVDialog(ctx, W, H);

    // Timer bar (screen space - kompensasi kamera)
    // FIX: drawFVMinimap dihapus — minimap HTML utama (#minimap-container) yang dipakai
    ctx.save();
    ctx.translate(Math.floor(fvCam.x), Math.floor(fvCam.y));
    drawFVBuildTimerBar(ctx, W, fv, now);
    ctx.restore();
}

// ── Timer bar konstruksi ───────────────────────────────────────
function drawFVBuildTimerBar(ctx, W, fv, now) {
    if (!fv.buildQueue || fv.buildQueue.length === 0) return;
    const q = fv.buildQueue[0];
    const b = FAIRY_BUILDINGS[q.bid];
    const prog = Math.min(1, 1-(q.finishTime-now)/BUILD_DURATION_MS);
    const secsLeft = Math.max(0, Math.ceil((q.finishTime-now)/1000));

    ctx.fillStyle='rgba(0,0,0,0.65)';
    ctx.beginPath(); ctx.roundRect(10,10,200,22,6); ctx.fill();
    ctx.fillStyle='#f59e0b'; ctx.fillRect(12,18,Math.floor(196*prog),8);
    ctx.fillStyle='#1a0a00'; ctx.fillRect(12+Math.floor(196*prog),18,196-Math.floor(196*prog),8);
    ctx.fillStyle='#fde68a'; ctx.font='bold 9px sans-serif';
    ctx.fillText(`🏗️ ${b?.emoji||''} ${b?.name||'Bangunan'} — ${secsLeft}s lagi`, 14, 15);
}

// ── Dialog ─────────────────────────────────────────────────────
function drawFVDialog(ctx, W, H) {
    const d = fvActiveDialog;
    const bx=8, by=H-175, bw=W-16, bh=167;
    ctx.fillStyle='rgba(6,3,18,0.96)';
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,10); ctx.fill();
    ctx.strokeStyle='#7c3aed'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,10); ctx.stroke();

    // Portrait
    ctx.fillStyle='rgba(124,58,237,0.2)';
    ctx.beginPath(); ctx.roundRect(bx+8,by+8,48,48,8); ctx.fill();
    ctx.font='26px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(d.portrait||'👸', bx+32, by+32);

    // Name
    ctx.fillStyle='#fde68a'; ctx.font='bold 11px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    ctx.fillText(d.name, bx+62, by+20);

    // Text wrap
    ctx.fillStyle='#e2e8f0'; ctx.font='10px sans-serif';
    wrapFVText(ctx, d.text, bw-70).slice(0,6).forEach((ln,i)=> ctx.fillText(ln, bx+62, by+34+i*13));

    // Options
    if (d.options?.length) {
        d.options.forEach((opt,i)=>{
            const oy=by+bh-28+(i-d.options.length+1)*22;
            ctx.fillStyle=`rgba(124,58,237,0.3)`;
            ctx.beginPath(); ctx.roundRect(bx+8,oy,bw-16,18,5); ctx.fill();
            ctx.strokeStyle='rgba(167,139,250,0.4)'; ctx.lineWidth=0.8;
            ctx.beginPath(); ctx.roundRect(bx+8,oy,bw-16,18,5); ctx.stroke();
            ctx.fillStyle='#c4b5fd'; ctx.font='bold 9px sans-serif';
            ctx.fillText('▶ '+opt.text, bx+14, oy+13);
        });
    } else {
        ctx.fillStyle='#64748b'; ctx.font='9px sans-serif'; ctx.textAlign='right';
        ctx.fillText('Tap untuk lanjut ▶', bx+bw-10, by+bh-8);
        ctx.textAlign='left';
    }
}

function wrapFVText(ctx, text, maxW) {
    const lines=[];
    text.split('\n').forEach(para=>{
        if (!para.trim()) { lines.push(''); return; }
        const words=para.split(' '); let cur='';
        words.forEach(w=>{ const t=cur?cur+' '+w:w; if(ctx.measureText(t).width>maxW){ if(cur)lines.push(cur); cur=w; } else cur=t; });
        if(cur) lines.push(cur);
    });
    return lines;
}

function tapFVDialog(e) {
    if (!fvActiveDialog) return;
    const d=fvActiveDialog;
    if (d.options?.length) {
        const W=fvCanvas.width, H=fvCanvas.height;
        const bx=8, by=H-175, bw=W-16, bh=167;
        const rect=fvCanvas.getBoundingClientRect();
        const tapX=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
        const tapY=(e.touches?e.touches[0].clientY:e.clientY)-rect.top;
        d.options.forEach((opt,i)=>{
            const oy=by+bh-28+(i-d.options.length+1)*22;
            if(tapX>bx+8&&tapX<bx+bw-8&&tapY>oy&&tapY<oy+18){ fvActiveDialog=null; opt.action?.(); }
        });
    } else { fvActiveDialog=null; }
    e.stopPropagation();
}

function showFVDialog(name,text,options,portrait) {
    // Gunakan sistem dialogue utama (showDialogue) karena fairy village
    // berjalan di atas game canvas utama, bukan modal terpisah.
    if (typeof showDialogue === 'function') {
        // Tentukan portrait image berdasarkan nama/portrait parameter
        let imgSrc = null;
        if (portrait === '👸' || name.includes('RARA') || name.includes('Rara')) {
            imgSrc = 'images/rarawilis.png';
        } else if (portrait === '🌳' || name.includes('POHON')) {
            imgSrc = 'images/pohonperi.png';
        } else if (name === 'WENING' || name === 'Wening') {
            imgSrc = 'images/wening.png';
        } else if (name === 'SEKAR' || name === 'Sekar') {
            imgSrc = 'images/sekar.png';
        } else if (name === 'BENING' || name === 'Bening') {
            imgSrc = 'images/bening.png';
        } else if (name === 'JUNA' || name === 'Juna') {
            imgSrc = 'images/juna.png';
        } else if (portrait === '🧚‍♀️' || name.includes('WIDADARI')) {
            imgSrc = 'images/rarawilis.png';
        }
        const opts = (options||[]).map(o=>({
            text: o.text,
            action: ()=>{
                if (typeof closeDialogue === 'function') closeDialogue();
                if (typeof o.action === 'function') setTimeout(()=>o.action(), 30);
            }
        }));
        if (opts.length===0) opts.push({text:'Tutup', action: ()=>{ if(typeof closeDialogue==='function') closeDialogue(); }});
        showDialogue(name, text, opts, imgSrc);
        return;
    }
    // Fallback lama (hanya aktif jika fairy-village-modal dipakai)
    fvActiveDialog={name,text,options:options||null,portrait:portrait||'👸'};
}

// ─────────────────────────────────────────────────────────────
// DIALOG NPC PERI KECIL — FAIRY VILLAGE
// ─────────────────────────────────────────────────────────────
function openFairyNPCDialog_fv_wening() {
    showFVDialog('WENING', `Selamat datang kembali! 🌿\n\nAku Wening, Widadari penjaga hutan Wilis.\n\nDulu aku merawat ribuan pohon di lereng Gunung Wilis. Sekarang aku baru bisa merawat yang tersisa... tapi dengan bantuanmu, hutan itu perlahan tumbuh kembali.\n\n🌲 Pohon-pohon muda sudah mulai bertunas di sisi utara. Aku merasakan energinya!`,
        [{ text: 'Teruskan perjuanganmu, Wening!', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } },
         { text: 'Kembali', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } }],
        'images/wening.png');
}
function openFairyNPCDialog_fv_sekar() {
    showFVDialog('SEKAR', `Hei! 🌸\n\nNamaku Sekar — aku peri bunga. Tugasku memastikan setiap bunga di Kahyangan Wilis mekar pada waktunya.\n\nSejak Kahyangan hampir punah, bunganya pun layu. Tapi lihat — kenanga dan melati di sudut selatan mulai mekar lagi!\n\n🌺 Aku sedang menanam taman bunga baru di dekat Pohon Beringin. Doakan berhasil ya!`,
        [{ text: 'Taman bungamu pasti indah, Sekar!', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } },
         { text: 'Kembali', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } }],
        'images/sekar.png');
}
function openFairyNPCDialog_fv_bening() {
    showFVDialog('BENING', `Oh! Kamu mau bicara denganku? 💧\n\nAku Bening... Widadari air termuda di sini. Aku lahir saat Kahyangan sudah mulai pudar, jadi aku tidak pernah tahu Kahyangan yang penuh.\n\nTapi Rara Wilis dan Kak Wening sering bercerita betapa indahnya dulu...\n\n💙 Kalau Kahyangan pulih sepenuhnya, aku ingin membuka kembali Sendang Suci Selatan!`,
        [{ text: 'Aku yakin kamu bisa, Bening!', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } },
         { text: 'Kembali', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } }],
        'images/bening.png');
}
function openFairyNPCDialog_fv_juna() {
    showFVDialog('JUNA', `Hei, manusia! Jarang ada yang mau ngobrol sama peri cowok. 😄\n\nAku Juna — peri angin. Tugasku membawa serbuk bunga dan benih pohon ke seluruh penjuru Wilis lewat hembusan angin.\n\nWaktu longsor terjadi, aku sedang terbang jauh... jadi aku selamat. Tapi aku merasa bersalah tidak bisa menyelamatkan yang lain.\n\n🌬️ Kini aku kembali untuk membantu membangun Kahyangan bersama kalian!`,
        [{ text: 'Jangan menyesal, Juna. Kamu ada sekarang!', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } },
         { text: 'Kembali', action: () => { fvActiveDialog=null; if(typeof closeDialogue==='function') closeDialogue(); } }],
        'images/juna.png');
}

