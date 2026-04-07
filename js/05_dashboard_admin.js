// ========================================================
// js/05_dashboard_admin.js
// Teacher/Admin Dashboard, Stats, Monitoring
// ========================================================

            // ═══════════════════════════════════════════════════════
            // STATISTIK PLATFORM DASHBOARD — Admin Only
            // ═══════════════════════════════════════════════════════
            function renderStatsDashboard() {
                const el = document.getElementById('stats-content');
                if (!el) return;
                const users = latestStudentData || [];

                const siswaList     = users.filter(u => u.role === 'siswa');
                const umumList      = users.filter(u => u.role === 'umum');
                const guruList      = users.filter(u => u.role === 'guru');
                const activePlayers = siswaList.filter(u => u.saveData && u.saveData.day);
                const activeUmum    = umumList.filter(u => u.saveData && u.saveData.day);
                const now = Date.now();
                const onlineNow     = [...siswaList, ...umumList].filter(u => {
                    const la = u.lastActive || (u.saveData && u.saveData.lastActive) || 0;
                    return now - la < 600000;
                });
                const totalVisits   = [...siswaList, ...umumList].reduce((s,u) =>
                    s + ((u.saveData && u.saveData.arsaVisitCount) || (u.saveData ? 1 : 0)), 0);
                const avgDay        = activePlayers.length
                    ? (activePlayers.reduce((s,u) => s+(u.saveData.day||1), 0) / activePlayers.length).toFixed(1) : '0';
                const avgMoney      = activePlayers.length
                    ? Math.round(activePlayers.reduce((s,u) => s+(u.saveData.money||0), 0) / activePlayers.length) : 0;

                const roleMap = { worker:0, student:0, entrepreneur:0, family:0, none:0 };
                activePlayers.forEach(u => { const r=u.saveData.role||'none'; if(roleMap[r]!==undefined) roleMap[r]++; else roleMap.none++; });

                const genderM = activePlayers.filter(u => u.saveData.gender==='boy').length;
                const genderF = activePlayers.filter(u => u.saveData.gender==='girl').length;

                const lvlBuckets = { 'Lv.1-2':0,'Lv.3-5':0,'Lv.6-9':0,'Lv.10+':0 };
                activePlayers.forEach(u => {
                    const lv = u.saveData.level||1;
                    if (lv<=2) lvlBuckets['Lv.1-2']++;
                    else if (lv<=5) lvlBuckets['Lv.3-5']++;
                    else if (lv<=9) lvlBuckets['Lv.6-9']++;
                    else lvlBuckets['Lv.10+']++;
                });

                // Aktivitas per jam
                const hourBuckets = Array(24).fill(0);
                siswaList.forEach(u => {
                    const la = u.lastActive || (u.saveData && u.saveData.lastActive) || 0;
                    if (la > 0) hourBuckets[new Date(la).getHours()]++;
                });
                const maxHour = Math.max(...hourBuckets, 1);

                const guruSiswaMap = {};
                siswaList.forEach(u => { if(u.mentor) guruSiswaMap[u.mentor]=(guruSiswaMap[u.mentor]||0)+1; });
                const topGuru = Object.entries(guruSiswaMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

                const sekolahMap = {};
                guruList.forEach(g => { if(g.sekolah) sekolahMap[g.sekolah]=(sekolahMap[g.sekolah]||0)+1; });
                const sekolahEntries = Object.entries(sekolahMap).sort((a,b)=>b[1]-a[1]).slice(0,6);

                const married   = activePlayers.filter(u=>u.saveData.married).length;
                const hasKid    = activePlayers.filter(u=>u.saveData.kids&&u.saveData.kids.length>0).length;
                const completed = activePlayers.filter(u=>(u.saveData.day||0)>=25).length;
                const refreshTime = new Date().toLocaleString('id-ID');

                const roleColors = { worker:'#3b82f6',student:'#8b5cf6',entrepreneur:'#10b981',family:'#ec4899',none:'#94a3b8' };
                const roleNames  = { worker:'⚒️ Pekerja',student:'🎓 Akademisi',entrepreneur:'💼 Wirausaha',family:'🏠 Keluarga',none:'❓ Belum' };
                const lvlColors  = { 'Lv.1-2':'#86efac','Lv.3-5':'#4ade80','Lv.6-9':'#22c55e','Lv.10+':'#15803d' };

                function barRow(label, val, total, color) {
                    const pct = total>0 ? Math.round(val/total*100) : 0;
                    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <div style="width:88px;font-size:10px;color:#374151;text-align:right;flex-shrink:0;line-height:1.2;">${label}</div>
                        <div style="flex:1;background:#f1f5f9;border-radius:20px;height:14px;overflow:hidden;">
                            <div class="stat-bar-fill" data-pct="${pct}" style="width:0%;background:${color};height:100%;border-radius:20px;transition:width 0.8s cubic-bezier(.4,0,.2,1);"></div>
                        </div>
                        <div style="width:52px;font-size:10px;color:#1e293b;font-weight:700;flex-shrink:0;">${val} <span style="color:#94a3b8;font-weight:400;">${pct}%</span></div>
                    </div>`;
                }

                el.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
                    <div style="font-size:11px;color:#64748b;">🕐 <b>${refreshTime}</b> &nbsp;•&nbsp; <b style="color:${DataService.mode==='firebase'?'#059669':'#d97706'}">${DataService.mode==='firebase'?'☁️ Firebase':'💾 Lokal'}</b></div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="exportStatsCsv()" style="background:#0f172a;color:#34d399;border:1.5px solid #34d399;border-radius:8px;padding:6px 14px;font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito,sans-serif;">⬇️ Export CSV</button>
                        <button onclick="renderStatsDashboard()" style="background:#0f172a;color:#38bdf8;border:1.5px solid #38bdf8;border-radius:8px;padding:6px 14px;font-size:10px;font-weight:700;cursor:pointer;font-family:Nunito,sans-serif;">🔄 Refresh</button>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
                    ${[
                        {icon:'👁️',label:'Total Kunjungan',val:totalVisits.toLocaleString('id'),sub:'sesi masuk game (siswa+umum)',c:'#3b82f6',bg:'#eff6ff',bd:'#bfdbfe'},
                        {icon:'🎮',label:'Total Pemain',val:siswaList.length,sub:`akun siswa terdaftar`,c:'#7c3aed',bg:'#f5f3ff',bd:'#ddd6fe'},
                        {icon:'🌍',label:'Pemain Umum',val:umumList.length,sub:`${activeUmum.length} sudah bermain`,c:'#d97706',bg:'#fffbeb',bd:'#fde68a'},
                        {icon:'🟢',label:'Online Sekarang',val:onlineNow.length,sub:'aktif < 10 menit',c:'#059669',bg:'#f0fdf4',bd:'#bbf7d0'},
                    ].map(c=>`<div style="background:${c.bg};border:2px solid ${c.bd};border-radius:14px;padding:16px 12px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.06);position:relative;overflow:hidden;">
                        <div style="position:absolute;right:8px;top:8px;font-size:28px;opacity:0.12;">${c.icon}</div>
                        <div style="font-size:30px;font-weight:800;color:${c.c};font-family:'Fredoka',sans-serif;line-height:1;">${c.val}</div>
                        <div style="font-size:10px;font-weight:700;color:${c.c};margin-top:4px;">${c.label}</div>
                        <div style="font-size:9px;color:#94a3b8;margin-top:3px;">${c.sub}</div>
                    </div>`).join('')}
                </div>

                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;">
                    ${[
                        {l:'▶️ Sudah Mulai',v:activePlayers.length,c:'#16a34a'},
                        {l:'⏳ Belum Mulai',v:siswaList.length-activePlayers.length,c:'#dc2626'},
                        {l:'📅 Avg. Hari',v:avgDay+' hari',c:'#0369a1'},
                        {l:'💰 Avg. Gold',v:avgMoney.toLocaleString('id')+('G'),c:'#b45309'},
                        {l:'💍 Menikah',v:married,c:'#be185d'},
                        {l:'👶 Punya Anak',v:hasKid,c:'#7c3aed'},
                        {l:'🏁 Tamat (≥Hari 25)',v:completed,c:'#0f766e'},
                        {l:'🏫 Sekolah',v:Object.keys(sekolahMap).length,c:'#1d4ed8'},
                        {l:'👦👧 Boy:Girl',v:(genderM>0||genderF>0)?genderM+':'+genderF:'–',c:'#64748b'},
                        {l:'🌍 Umum Aktif',v:activeUmum.length,c:'#d97706'},
                        {l:'🔑 Umum Google',v:umumList.filter(u=>u.loginMethod==='google').length,c:'#b45309'},
                    ].map(c=>`<div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:20px;padding:5px 12px;font-size:10px;font-weight:700;color:${c.c};display:flex;align-items:center;gap:5px;">
                        ${c.l} <span style="background:${c.c};color:#fff;border-radius:10px;padding:1px 6px;font-size:9px;">${c.v}</span>
                    </div>`).join('')}
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:14px;">🗺️ Distribusi Jalur Hidup</div>
                        <div style="display:flex;gap:12px;align-items:flex-start;">
                            <div style="flex:1;">
                                ${Object.entries(roleMap).map(([k,v])=>barRow(roleNames[k]||k,v,activePlayers.length,roleColors[k]||'#94a3b8')).join('')}
                            </div>
                            <canvas id="cv-role" width="100" height="100" style="flex-shrink:0;width:100px;height:100px;display:block;"></canvas>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;">
                            ${Object.entries(roleMap).filter(([,v])=>v>0).map(([k,v])=>`<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:#475569;"><div style="width:8px;height:8px;border-radius:50%;background:${roleColors[k]};"></div>${roleNames[k]} (${v})</div>`).join('')}
                        </div>
                    </div>

                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
                            <span>⏰ Aktivitas per Jam</span>
                            <span style="font-size:9px;color:#94a3b8;font-weight:400;">berdasarkan lastActive</span>
                        </div>
                        <div style="display:flex;align-items:flex-end;gap:2px;height:90px;padding:0 2px;">
                            ${hourBuckets.map((v,h)=>{
                                const ht=Math.round((v/maxHour)*86);
                                const isNow=new Date().getHours()===h;
                                const isPeak=v===maxHour&&v>0;
                                return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;position:relative;" title="${h}:00 — ${v} pemain">
                                    ${isPeak?`<div style="position:absolute;top:-13px;font-size:7px;font-weight:700;color:#f59e0b;">${v}★</div>`:''}
                                    <div style="width:100%;background:${isNow?'#f59e0b':v>0?'#3b82f6':'#e2e8f0'};height:${Math.max(ht,v>0?3:0)}px;border-radius:3px 3px 0 0;${isNow?'box-shadow:0 0 6px #f59e0b66;':''};"></div>
                                </div>`;
                            }).join('')}
                        </div>
                        <div style="display:flex;gap:2px;margin-top:4px;padding:0 2px;">
                            ${Array(24).fill(0).map((_,h)=>h%3===0?`<div style="flex:3;font-size:8px;color:#94a3b8;">${h<10?'0'+h:h}</div>`:`<div style="flex:1;"></div>`).join('')}
                        </div>
                        <div style="margin-top:8px;font-size:9px;color:#64748b;">
                            🕐 Jam paling ramai: <b style="color:#f59e0b;">${hourBuckets.indexOf(maxHour)}:00</b> &nbsp;•&nbsp; Total aktif hari ini: <b style="color:#3b82f6;">${hourBuckets.reduce((a,b)=>a+b,0)}</b>
                        </div>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;">
                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:12px;">⭐ Distribusi Level</div>
                        ${Object.entries(lvlBuckets).map(([k,v])=>barRow(k,v,activePlayers.length,lvlColors[k]||'#4ade80')).join('')}
                        <canvas id="cv-level" width="90" height="90" style="display:block;margin:8px auto 0;width:90px;height:90px;"></canvas>
                    </div>

                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:10px;">👤 Gender Pemain</div>
                        <div style="display:flex;gap:8px;margin-bottom:14px;">
                            <div style="flex:${genderM||1};background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:10px;padding:10px;text-align:center;">
                                <div style="font-size:20px;">👦</div>
                                <div style="font-size:18px;font-weight:800;color:#1d4ed8;">${genderM}</div>
                                <div style="font-size:9px;color:#3b82f6;">${activePlayers.length>0?Math.round(genderM/activePlayers.length*100):0}%</div>
                            </div>
                            <div style="flex:${genderF||1};background:linear-gradient(135deg,#fce7f3,#fbcfe8);border-radius:10px;padding:10px;text-align:center;">
                                <div style="font-size:20px;">👧</div>
                                <div style="font-size:18px;font-weight:800;color:#be185d;">${genderF}</div>
                                <div style="font-size:9px;color:#ec4899;">${activePlayers.length>0?Math.round(genderF/activePlayers.length*100):0}%</div>
                            </div>
                        </div>
                        <div style="font-size:11px;font-weight:700;color:#475569;margin-bottom:8px;">🏆 Top Mentor</div>
                        ${topGuru.length?topGuru.map(([name,cnt],i)=>`
                            <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
                                <div style="width:16px;height:16px;border-radius:50%;background:${['#f59e0b','#94a3b8','#b45309','#e2e8f0','#e2e8f0'][i]};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:${i<3?'#fff':'#64748b'};flex-shrink:0;">${i+1}</div>
                                <div style="flex:1;font-size:10px;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
                                <div style="background:#eff6ff;color:#1d4ed8;border-radius:10px;padding:1px 7px;font-size:9px;font-weight:700;">${cnt}</div>
                            </div>
                        `).join(''):`<div style="color:#94a3b8;font-size:10px;">Belum ada data</div>`}
                    </div>

                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:12px;">🏫 Asal Sekolah Mentor</div>
                        ${sekolahEntries.length?sekolahEntries.map(([skl,cnt])=>barRow(skl,cnt,guruList.length,'#0284c7')).join('')
                            :'<div style="color:#94a3b8;font-size:10px;text-align:center;padding:16px;">Belum ada data</div>'}
                        ${Object.keys(sekolahMap).length>6?`<div style="font-size:9px;color:#94a3b8;margin-top:4px;">+${Object.keys(sekolahMap).length-6} sekolah lainnya</div>`:''}
                    </div>
                </div>

                <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;">🟢 Pemain Online Sekarang <span style="background:#dcfce7;color:#16a34a;border-radius:20px;padding:2px 8px;font-size:10px;margin-left:6px;">${onlineNow.length} aktif</span></div>
                    </div>
                    ${onlineNow.length?`<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:10px;">
                        <thead><tr style="background:#f8fafc;">
                            <th style="padding:7px 10px;text-align:left;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Nama</th>
                            <th style="padding:7px 10px;text-align:left;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Kelas</th>
                            <th style="padding:7px 10px;text-align:left;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Jalur</th>
                            <th style="padding:7px 10px;text-align:center;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Level</th>
                            <th style="padding:7px 10px;text-align:center;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Hari</th>
                            <th style="padding:7px 10px;text-align:right;color:#475569;font-weight:700;border-bottom:2px solid #e2e8f0;">Terakhir Aktif</th>
                        </tr></thead>
                        <tbody>${onlineNow.sort((a,b)=>{const la=n=>n.lastActive||(n.saveData&&n.saveData.lastActive)||0;return la(b)-la(a);}).map((u,i)=>{
                            const sd=u.saveData||{};
                            const la=u.lastActive||(sd.lastActive)||0;
                            const minsAgo=Math.floor((now-la)/60000);
                            const isUmum=u.role==='umum';
                            const rIco=isUmum?'🌍':{worker:'⚒️',student:'🎓',entrepreneur:'💼',family:'🏠'}[sd.role]||'❓';
                            const rName=isUmum?'Umum':{worker:'Pekerja',student:'Akademisi',entrepreneur:'Wirausaha',family:'Keluarga'}[sd.role]||'Belum';
                            const rColor=isUmum?'#d97706':roleColors[sd.role||'none']||'#94a3b8';
                            return `<tr style="border-bottom:1px solid #f1f5f9;${i%2===0?'background:#fafafa':''}">
                                <td style="padding:7px 10px;"><div style="display:flex;align-items:center;gap:6px;"><div style="width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 5px #22c55e;flex-shrink:0;"></div><b>${u.name||u.email}</b>${isUmum?`<span style="background:#fef3c7;color:#92400e;border-radius:6px;padding:1px 5px;font-size:8px;font-weight:700;">${u.loginMethod==='google'?'Google':'Lokal'}</span>`:''}</div></td>
                                <td style="padding:7px 10px;color:#64748b;">${u.kelas||u.details||'-'}</td>
                                <td style="padding:7px 10px;"><span style="background:${rColor+'22'};color:${rColor};border-radius:10px;padding:2px 7px;font-weight:700;">${rIco} ${rName}</span></td>
                                <td style="padding:7px 10px;text-align:center;"><span style="background:#fef3c7;color:#92400e;border-radius:8px;padding:2px 7px;font-weight:700;">Lv.${sd.level||1}</span></td>
                                <td style="padding:7px 10px;text-align:center;color:#0369a1;font-weight:700;">Hari ${sd.day||1}</td>
                                <td style="padding:7px 10px;text-align:right;color:#94a3b8;">${minsAgo===0?'baru saja':minsAgo+' mnt lalu'}</td>
                            </tr>`;
                        }).join('')}</tbody>
                    </table></div>`:`<div style="text-align:center;padding:20px;color:#94a3b8;">Tidak ada pemain online saat ini</div>`}
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
                    <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);border-radius:14px;padding:18px;color:#e2e8f0;">
                        <div style="font-size:12px;font-weight:800;color:#fbbf24;margin-bottom:12px;">📋 Rekap Sistem</div>
                        ${[['Total User (non-admin)',siswaList.length+guruList.length+umumList.length,'#38bdf8'],['Siswa terdaftar',siswaList.length,'#a78bfa'],['Pemain umum',umumList.length,'#fbbf24'],['Ratio siswa : mentor',guruList.length>0?(siswaList.length/guruList.length).toFixed(1)+' : 1':'–','#34d399'],['Tingkat partisipasi',siswaList.length>0?Math.round(activePlayers.length/siswaList.length*100)+'%':'–','#a78bfa'],['Pemain tamat (Hari 25+)',completed+' / '+activePlayers.length,'#fbbf24'],['Total sekolah terdaftar',Object.keys(sekolahMap).length,'#fb923c'],['Mode database',DataService.mode==='firebase'?'☁️ Firebase Cloud':'💾 LocalStorage','#86efac']].map(([l,v,c])=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.07);"><span style="font-size:10px;color:#94a3b8;">${l}</span><span style="font-size:11px;font-weight:700;color:${c};">${v}</span></div>`).join('')}
                    </div>
                    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:12px;font-weight:800;color:#1e3a5f;margin-bottom:12px;">💡 Insight Otomatis</div>
                        <div style="display:flex;flex-direction:column;gap:8px;">
                            ${(()=>{
                                const ins=[];
                                const tr=Object.entries(roleMap).sort((a,b)=>b[1]-a[1])[0];
                                if(tr&&tr[1]>0) ins.push({ico:'🗺️',txt:`Jalur terpopuler: <b>${roleNames[tr[0]]}</b> (${tr[1]} pemain)`,c:'#3b82f6'});
                                const ns=siswaList.length-activePlayers.length;
                                if(ns>0) ins.push({ico:'⚠️',txt:`<b>${ns} siswa</b> belum mulai bermain`,c:'#dc2626'});
                                if(onlineNow.length>0) ins.push({ico:'🟢',txt:`<b>${onlineNow.length} pemain</b> sedang aktif saat ini`,c:'#16a34a'});
                                if(completed>0) ins.push({ico:'🏁',txt:`<b>${completed} pemain</b> sudah tamat (Hari 25+)`,c:'#0f766e'});
                                if(parseFloat(avgDay)>15) ins.push({ico:'🔥',txt:`Rata-rata hari bermain <b>${avgDay}</b> — engagement tinggi!`,c:'#d97706'});
                                if(ins.length===0) ins.push({ico:'📊',txt:'Belum ada data. Refresh setelah ada siswa aktif.',c:'#94a3b8'});
                                return ins.slice(0,5).map(({ico,txt,c})=>`<div style="display:flex;align-items:flex-start;gap:8px;background:#f8fafc;border-left:3px solid ${c};border-radius:0 8px 8px 0;padding:8px 10px;"><span style="font-size:14px;">${ico}</span><span style="font-size:10px;color:#374151;line-height:1.5;">${txt}</span></div>`).join('');
                            })()}
                        </div>
                    </div>
                </div>

                <div style="background:#f8fafc;border-radius:10px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;font-size:9px;color:#94a3b8;border:1px solid #e2e8f0;">
                    <span>📊 Statistik Platform · Nusantara Arsa</span>
                    <span>Dokumen diproses: <b style="color:#475569;">${users.length}</b></span>
                </div>
                `;

                setTimeout(()=>{ document.querySelectorAll('.stat-bar-fill').forEach(b=>{ b.style.width=b.dataset.pct+'%'; }); }, 80);

                setTimeout(()=>{
                    const cv=document.getElementById('cv-role'); if(!cv) return;
                    const cx2=cv.getContext('2d');
                    const tot=Object.values(roleMap).reduce((a,b)=>a+b,0);
                    if(!tot){cx2.fillStyle='#e2e8f0';cx2.beginPath();cx2.arc(50,50,44,0,Math.PI*2);cx2.fill();return;}
                    let sa=-Math.PI/2;
                    Object.entries(roleMap).forEach(([k,v])=>{
                        if(!v) return;
                        const sl=(v/tot)*Math.PI*2;
                        cx2.beginPath();cx2.moveTo(50,50);cx2.arc(50,50,44,sa,sa+sl);cx2.closePath();
                        cx2.fillStyle=roleColors[k]||'#94a3b8';cx2.fill();sa+=sl;
                    });
                    cx2.beginPath();cx2.arc(50,50,26,0,Math.PI*2);cx2.fillStyle='#fff';cx2.fill();
                    cx2.fillStyle='#1e293b';cx2.font='bold 9px Nunito,sans-serif';cx2.textAlign='center';cx2.textBaseline='middle';
                    cx2.fillText(activePlayers.length+' aktif',50,50);
                }, 100);

                setTimeout(()=>{
                    const cv2=document.getElementById('cv-level'); if(!cv2) return;
                    const ctx2=cv2.getContext('2d');
                    const tot2=Object.values(lvlBuckets).reduce((a,b)=>a+b,0);
                    if(!tot2){ctx2.fillStyle='#e2e8f0';ctx2.beginPath();ctx2.arc(45,45,38,0,Math.PI*2);ctx2.fill();return;}
                    let sa2=-Math.PI/2;
                    const lc2=Object.values(lvlColors);
                    Object.entries(lvlBuckets).forEach(([k,v],i)=>{
                        if(!v) return;
                        const sl=(v/tot2)*Math.PI*2;
                        ctx2.beginPath();ctx2.moveTo(45,45);ctx2.arc(45,45,38,sa2,sa2+sl);ctx2.closePath();
                        ctx2.fillStyle=lc2[i]||'#4ade80';ctx2.fill();sa2+=sl;
                    });
                    ctx2.beginPath();ctx2.arc(45,45,22,0,Math.PI*2);ctx2.fillStyle='#fff';ctx2.fill();
                    ctx2.fillStyle='#15803d';ctx2.font='bold 8px sans-serif';ctx2.textAlign='center';ctx2.textBaseline='middle';
                    ctx2.fillText(tot2,45,45);
                }, 120);
            }

            function exportStatsCsv() {
                const users = latestStudentData || [];
                const siswaList = users.filter(u => u.role === 'siswa');
                const guruList  = users.filter(u => u.role === 'guru');
                const now = Date.now();
                let csv = 'SEP=,\n';
                csv += 'STATISTIK PLATFORM NUSANTARA ARSA\n';
                csv += `Diekspor pada:,${new Date().toLocaleString('id-ID')}\n`;
                csv += `Mode Database:,${DataService.mode==='firebase'?'Firebase Cloud':'LocalStorage'}\n\n`;
                csv += '=== RINGKASAN ===\n';
                csv += `Total Siswa,${siswaList.length}\n`;
                csv += `Total Guru,${guruList.length}\n`;
                csv += `Pemain Aktif,${siswaList.filter(u=>u.saveData&&u.saveData.day).length}\n`;
                csv += `Online Sekarang,${siswaList.filter(u=>{const la=u.lastActive||(u.saveData&&u.saveData.lastActive)||0;return now-la<600000;}).length}\n`;
                csv += `Total Kunjungan,${siswaList.reduce((s,u)=>s+((u.saveData&&u.saveData.arsaVisitCount)||(u.saveData?1:0)),0)}\n\n`;
                csv += '=== DISTRIBUSI JALUR ===\n';
                const rm={worker:0,student:0,entrepreneur:0,family:0,none:0};
                siswaList.filter(u=>u.saveData&&u.saveData.day).forEach(u=>{const r=u.saveData.role||'none';if(rm[r]!==undefined)rm[r]++;});
                csv += `Pekerja,${rm.worker}\nAkademisi,${rm.student}\nWirausaha,${rm.entrepreneur}\nKeluarga,${rm.family}\nBelum,${rm.none}\n\n`;
                csv += '=== DATA SISWA ===\n';
                csv += 'Nama,Email,Kelas,Mentor,Jalur,Level,Hari,Gold,Status\n';
                siswaList.forEach(u=>{
                    const sd=u.saveData||{};
                    const la=u.lastActive||(sd.lastActive)||0;
                    const isOl=now-la<600000;
                    const rl={worker:'Pekerja',student:'Akademisi',entrepreneur:'Wirausaha',family:'Keluarga',none:'Belum'}[sd.role||'none']||'Belum';
                    csv += `"${u.name||''}" ,"${u.email||''}" ,"${u.kelas||''}" ,"${u.mentor||''}" ,"${sd.day?rl:'Belum Mulai'}" ,${sd.level||'-'},${sd.day||'-'},${sd.money||'-'},"${isOl?'Online':'Offline'}"\n`;
                });
                csv += '\n=== DATA MENTOR ===\n';
                csv += 'Nama,Email,Sekolah,NIP,Jumlah Siswa\n';
                guruList.forEach(g=>{
                    const cnt=siswaList.filter(u=>u.mentor===g.name).length;
                    csv += `"${g.name||''}" ,"${g.email||''}" ,"${g.sekolah||''}" ,"${g.nip||''}" ,${cnt}\n`;
                });
                const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
                const url=URL.createObjectURL(blob);
                const a=document.createElement('a');
                a.href=url;a.download=`statistik_nusantara_arsa_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();URL.revokeObjectURL(url);
            }

            // --- NEW: RENDER DAFTAR AKUN (DATABASE) ---
            function renderAccountsList() {
                const users = latestStudentData || []; // Gunakan Cache (sekarang berisi semua user jika admin)
                const tbody = document.getElementById('accounts-body');
                if (!tbody) return;

                tbody.innerHTML = '';

                // Update Header Tabel khusus Admin
                const thead = document.querySelector('#page-accounts thead tr');
                if (thead) {
                    if (DataService.user.role === 'admin') {
                        thead.innerHTML = `
                <th style="width: 40px;">No</th>
                <th>Nama Pengguna</th>
                <th>Email / ID</th>
                <th>Role & Status</th>
                <th>Detail Info</th>
                <th>Aksi</th>
            `;
                    } else {
                        // Header Guru
                        thead.innerHTML = `
                <th style="width: 40px;">No</th>
                <th>Nama Lengkap</th>
                <th>Email (ID Login)</th>
                <th>Kelas / Detail</th>
                <th>Mentor</th>
                <th>Status Data</th>
            `;
                    }
                }

                if (users.length === 0) {
                    const sourceMode = DataService.dashboardSource === 'auto' ? (navigator.onLine ? 'CLOUD' : 'LOCAL') : DataService.dashboardSource.toUpperCase();
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#94a3b8;">
            Belum ada data ditemukan (Mode: ${sourceMode}).
        </td></tr>`;
                    return;
                }

                try {
                    const sortedUsers = [...users].sort((a, b) => {
                        // Sort by Role first (Admin > Guru > Siswa), then Name
                        const roleScore = (r) => r === 'admin' ? 3 : (r === 'guru' ? 2 : 1);
                        const scoreA = roleScore(a.role);
                        const scoreB = roleScore(b.role);

                        if (scoreA !== scoreB) return scoreB - scoreA; // Descending (Admin top)

                        const nameA = (a.name || "").toUpperCase();
                        const nameB = (b.name || "").toUpperCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    });

                    sortedUsers.forEach((u, index) => {
                        const safeName = u.name || "(Tanpa Nama)";
                        const safeEmail = u.email || "-";

                        let detailsHtml = "-";
                        let roleHtml = "";
                        let actionHtml = "";

                        // Styling berdasarkan Role
                        if (u.role === 'admin') {
                            roleHtml = `<span style="background:#fee2e2; color:#b91c1c; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:10px; border:1px solid #fca5a5;">ADMIN</span>`;
                            detailsHtml = `<span style="color:#94a3b8">System Access</span>`;
                        }
                        else if (u.role === 'guru') {
                            roleHtml = `<span style="background:#dbeafe; color:#1e40af; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:10px; border:1px solid #93c5fd;">MENTOR</span>`;
                            detailsHtml = `NIP: ${u.details || '-'}<br><small>${u.school || ''}</small>`;
                            if (DataService.user && DataService.user.role === 'admin') {
                                // FIX: Admin bisa hapus akun guru permanen
                                actionHtml = `<button class="auth-btn" style="width:auto; padding:4px 8px; font-size:9px; background:#dc2626; margin:0;" onclick="confirmDeleteStudent('${safeEmail}', '${safeName}')" title="Hapus Akun Guru">🗑️ HAPUS</button>`;
                            }
                        }
                        else { // Siswa
                            // Cek status main
                            let statusMain = '<span class="status-badge" style="background:#e2e8f0; color:#64748b;">Belum Main</span>';
                            if (u.saveData) {
                                const lvl = u.saveData.level || 1;
                                const roleInGame = (u.saveData.role && u.saveData.role !== 'none') ? u.saveData.role.toUpperCase() : 'NOVICE';
                                statusMain = `<span class="status-badge" style="background:#dcfce7; color:#166534;">Lv ${lvl} ${roleInGame}</span>`;
                            }

                            roleHtml = `<span style="background:#f0fdf4; color:#15803d; padding:2px 6px; border-radius:4px; font-size:10px; border:1px solid #86efac;">SISWA</span><br>${statusMain}`;
                            detailsHtml = `Kelas: ${u.details || '-'}<br><small>Mentor: ${u.mentor || '-'}</small>`;

                            // Tombol Aksi untuk Admin/Guru
                            actionHtml = `<button class="auth-btn" style="width:auto; padding:4px 8px; font-size:9px; margin:0; background:#475569;" onclick="inspectStudentData('${encodeURIComponent(JSON.stringify(u))}')">🔍 DATA</button>`;
                        }

                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${safeName}</strong></td>
                <td style="font-family:monospace; color:#475569; font-size:11px;">${safeEmail}</td>
                <td>${roleHtml}</td>
                <td style="font-size:11px;">${detailsHtml}</td>
                <td>${actionHtml}</td>
            `;
                        tbody.appendChild(tr);
                    });
                } catch (e) {
                    console.error("Render Error:", e);
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ef4444;">Error rendering list.</td></tr>`;
                }
            }

            // --- NEW: RENDER DASHBOARD RANKING (PODIUM + LIST) ---
            function renderRanking() { // Hapus async
                const podiumEl = document.getElementById('ranking-podium');
                const tableEl = document.getElementById('ranking-body');

                // podiumEl.innerHTML = '<p>Loading Data...</p>'; // Tidak perlu loading karena data instan
                tableEl.innerHTML = '';

                // 1. Gunakan Cache Data Live
                const students = latestStudentData;

                const ranked = students
                    .filter(s => s.saveData)
                    .map(s => ({
                        ...s,
                        score: calculateGrade(s.saveData),
                        role: s.saveData.role || 'none',
                        level: s.saveData.level || 1
                    }))
                    .sort((a, b) => b.score - a.score);

                if (ranked.length === 0) {
                    podiumEl.innerHTML = '<div style="width:100%; text-align:center; color:#94a3b8; padding:40px;">Belum ada data siswa untuk diperingkat.</div>';
                    return;
                }

                // 2. Render Podium (Top 3)
                let podiumHTML = '';
                // Urutan Podium: 2 - 1 - 3 (Kiri - Tengah - Kanan)
                const podiumOrder = [1, 0, 2];

                podiumOrder.forEach(idx => {
                    if (ranked[idx]) {
                        const s = ranked[idx];
                        const rank = idx + 1;
                        const rankClass = `rank-${rank}`;

                        // Avatar Fallback (Boy/Girl based on gender logic, default boy icon if undefined)
                        // Karena data gender ada di dalam saveData, kita coba ambil
                        const gender = s.saveData.gender || 'boy';
                        const avatarSrc = gender === 'boy' ? 'images/boy.png' : 'images/girl.png';

                        podiumHTML += `
                <div class="podium-item ${rankClass}">
                    <div class="podium-badge">${rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉')}</div>
                    <img src="${avatarSrc}" class="podium-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IiMzYjgyZjYiLz48L3N2Zz4='">
                    <div class="podium-name">${s.name.split(' ')[0]}</div>
                    <div class="podium-class">${s.details}</div>
                    <div class="podium-score">${s.score}</div>
                </div>
            `;
                    }
                });
                podiumEl.innerHTML = podiumHTML;

                // 3. Render Table List (Remaining)
                // FIX: Render semua data ke tabel list (bukan hanya sisanya, agar lengkap)
                ranked.forEach((s, index) => {
                    const rank = index + 1;
                    const role = s.role !== 'none' ? s.role.toUpperCase() : 'NOVICE';

                    // Highlight jika Top 3
                    let rowStyle = "";
                    if (rank <= 3) rowStyle = "background:rgba(251, 191, 36, 0.1); font-weight:bold;";

                    const tr = document.createElement('tr');
                    tr.style = rowStyle;
                    tr.innerHTML = `
            <td>#${rank}</td>
            <td>${s.name}</td>
            <td>${role}</td>
            <td>${s.level}</td>
            <td style="text-align:right;"><strong>${s.score}</strong></td>
        `;
                    tableEl.appendChild(tr);
                });
            } // FIX: TUTUP KURUNG KURAWAL YANG HILANG

            // UPDATE: ASYNC MONITORING (Updated to Sync Render for Listener)
            function renderMonitoringTable(students) {
                const tbody = document.getElementById('monitoring-body');
                if (!tbody) return;

                tbody.innerHTML = '';

                // --- UPDATE SUMMARY STATS ---
                const onlineCount = students.filter(s => {
                    const la = s.saveData && s.saveData.lastActive ? s.saveData.lastActive : 0;
                    return (Date.now() - la) < 60000;
                }).length;
                const totalCount = students.length;
                const offlineCount = totalCount - onlineCount;
                const pct = totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;
                const elOn = document.getElementById('summary-online');
                const elOff = document.getElementById('summary-offline');
                const elTot = document.getElementById('summary-total');
                const elPct = document.getElementById('summary-pct');
                if (elOn) elOn.innerText = onlineCount;
                if (elOff) elOff.innerText = offlineCount;
                if (elTot) elTot.innerText = totalCount;
                if (elPct) elPct.innerText = pct + '%';

                // --- ONLINE POPUP NOTIFICATION ---
                // Deteksi siswa yang baru online sejak render terakhir
                if (!window._prevOnlineSet) window._prevOnlineSet = new Set();
                students.forEach(s => {
                    const la = s.saveData && s.saveData.lastActive ? s.saveData.lastActive : 0;
                    const nowOnline = (Date.now() - la) < 60000;
                    const wasOnline = window._prevOnlineSet.has(s.email);
                    if (nowOnline && !wasOnline) {
                        // Baru saja online — tampilkan popup
                        showOnlineNotif(s);
                    }
                    if (nowOnline) window._prevOnlineSet.add(s.email);
                    else window._prevOnlineSet.delete(s.email);
                });

                if (students.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#94a3b8;">Tidak ada data siswa ditemukan di sumber ini (${DataService.dashboardSource}).</td></tr>`;
                    return;
                }

                students.forEach(s => {
                    // Cek apakah ada save data
                    const sd = s.saveData;
                    const hasSave = sd && Object.keys(sd).length > 0;

                    // Cek online status (batas toleransi 60 detik)
                    const lastActive = (sd && sd.lastActive) ? sd.lastActive : 0;
                    const isOnline = (Date.now() - lastActive) < 60000;

                    // Format Time String
                    let timeStr = "-";
                    if (lastActive > 0) {
                        const d = new Date(lastActive);
                        // Format: DD/MM HH:MM
                        timeStr = `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
                    }

                    const tr = document.createElement('tr');

                    // --- 1. LOGIKA TAMPILAN ROLE ---
                    let roleHtml = '';
                    if (!hasSave) {
                        roleHtml = `<span style="font-size:9px; color:#94a3b8; font-style:italic;">(New)</span>`;
                    } else if (!sd.role || sd.role === 'none') {
                        roleHtml = `<span style="font-size:9px; color:#64748b;">NOVICE</span>`;
                    } else {
                        let roleText = sd.role.toUpperCase();
                        if (sd.role === 'student' && sd.major) roleText += ` (${sd.major.substring(0, 3).toUpperCase()})`;
                        roleHtml = `<span style="font-size:9px; color:var(--primary); font-weight:bold;">${roleText}</span>`;
                    }

                    // --- 2. LOGIKA TAMPILAN LOKASI ---
                    let locHtml = '<span style="color:#cbd5e1">-</span>';
                    let hpStyle = "";
                    let statsHtml = '<span style="color:#cbd5e1">-</span>';

                    if (hasSave) {
                        if (sd.location) {
                            let locText = sd.location.toUpperCase();
                            if (locText.includes('INTERIOR')) locText = locText.replace('_INTERIOR', ' (DLM)');
                            locHtml = `📍 ${locText}`;
                        }
                        if ((sd.hp || 0) < 30) hpStyle = "color:#ef4444; font-weight:bold;";
                        statsHtml = `❤️ ${Math.floor(sd.hp || 0)} <br> ⚡ ${Math.floor(sd.energy || 0)}`;
                    }

                    // --- NEW: TOMBOL INSPECT DATA ---
                    // Kita simpan data siswa di atribut data agar bisa diinspect
                    const sJson = encodeURIComponent(JSON.stringify(s));

                    tr.innerHTML = `
            <td>
                <strong>${s.name}</strong><br>
                <span style="font-size:9px; color:#64748b;">${s.email}</span>
            </td>
            <td>
                <div style="font-weight:bold; font-size:11px; ${isOnline ? 'color:#16a34a' : 'color:#64748b'}">${timeStr}</div>
                <span style="font-size:9px;">Day ${sd ? (sd.day || 1) : '-'}</span>
            </td>
            <td>
                ${roleHtml}<br>
                <span class="status-badge ${isOnline ? 'online' : 'offline'}" style="font-size:8px; padding:2px 6px;">
                    ${isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
            </td>
            <td style="font-size:10px;">${locHtml}</td>
            <td style="${hpStyle}">
                ${statsHtml}
            </td>
            <td>
                <div style="display:flex; gap:5px;">
                    <!-- UPDATE: Menambahkan 'this' pada parameter promptTeacherMessage agar tombol terdeteksi akurat -->
                    <button class="auth-btn" style="width:auto; padding:4px 8px; font-size:10px; margin:0;" onclick="promptTeacherMessage('${s.email}', this)">✉️</button>
                    <button class="auth-btn" style="width:auto; padding:4px 8px; font-size:10px; margin:0; background:#475569;" onclick="inspectStudentData('${sJson}')">🔍</button>
                </div>
            </td>
        `;
                    tbody.appendChild(tr);
                });
            }

            // --- NEW: FUNGSI INSPECT DATA ---
            function inspectStudentData(encodedJson) {
                const data = JSON.parse(decodeURIComponent(encodedJson));
                const modal = document.getElementById('inspect-modal');
                const content = document.getElementById('inspect-content');

                // Format JSON agar cantik
                content.innerText = JSON.stringify(data, null, 2);
                modal.style.display = 'flex';
            }

            // FIX: Hapus fungsi renderMonitoring lama karena sudah diganti renderMonitoringTable
            async function renderMonitoring() {
                // Legacy function, redirect to listener init if needed or do nothing
                // Biarkan kosong atau hapus agar tidak dipanggil setInterval lama
            }

            // --- NEW: FUNGSI AMBIL NAMA MENTOR (DARI EMAIL) ---
            DataService.getMentorName = async function (mentorEmail) {
                if (!mentorEmail) return "Mentor Budi"; // Default

                // 1. Cek Database Lokal dulu
                const dbLocal = this.getDB();
                if (dbLocal[mentorEmail] && dbLocal[mentorEmail].name) {
                    return "Mentor " + dbLocal[mentorEmail].name;
                }

                // 2. Cek Cloud (Jika Online)
                if (this.mode === 'firebase' && typeof db !== 'undefined') {
                    try {
                        const doc = await db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(mentorEmail).get();
                        if (doc.exists && doc.data().name) {
                            return "Mentor " + doc.data().name;
                        }
                    } catch (e) {
                        console.warn("Gagal ambil nama mentor dari cloud:", e);
                    }
                }

                return "Mentor Budi"; // Fallback jika gagal
            };


            // UPDATE: SYNC GRADING (Menggunakan latestStudentData)
            function renderGrading() {
                const students = latestStudentData; // Gunakan Cache
                const tbody = document.getElementById('grading-body');
                tbody.innerHTML = '';

                students.forEach(s => {
                    const sd = s.saveData || {};
                    const score = calculateGrade(sd);
                    let rank = 'Warrior';
                    if (score > 60) rank = 'Elite';
                    if (score > 75) rank = 'Legend';
                    if (score > 90) rank = 'Mythic';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>${s.name}</td>
            <td>${sd.role === 'none' ? 'Novice' : sd.role}</td>
            <td>${(sd.reflections || []).length} Entries</td>
            <td>${(sd.money || 0).toLocaleString()}</td>
            <td><strong>${score}</strong></td>
            <td><span class="status-badge" style="background:#0f172a; color:#fbbf24; border:1px solid #fbbf24;">${rank}</span></td>
        `;
                    tbody.appendChild(tr);
                });
            }

            function calculateGrade(data) {
                if (!data) return 0;
                const consistency = Math.min(100, (data.day || 1) * 20) * 0.2;
                const quest = Math.min(100, (data.money || 0) / 1000) * 0.2;
                const role = (data.role && data.role !== 'none' ? 100 : 0) * 0.2;
                const refCount = (data.reflections || []).length;
                const reflection = Math.min(100, refCount * 33) * 0.3;
                const ethics = (data.ethics || 100) * 0.1;
                return Math.floor(consistency + quest + role + reflection + ethics);
            }

            // =====================================================================
            // FASE 1 — JURNAL SISWA LENGKAP + FILTER KELAS + RUBRIK PENILAIAN
            // =====================================================================

            // Simpan nilai guru sementara (key: "email_dayIndex")
            const _journalRatings = {}; // cache lokal sebelum disimpan ke Firebase

            function resetJurnalFilter() {
                ['filter-kelas','filter-mentor','filter-siswa'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                ['filter-role','filter-rated'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                renderReflections();
            }

            // Simpan rating guru ke Firebase (path: users/{email}/journalRatings/{dayKey})
            async function saveJournalRating(studentEmail, dayKey, ratings, catatan) {
                const ratingData = { ...ratings, catatan, updatedAt: new Date().toISOString() };
                // Simpan ke cache lokal
                _journalRatings[`${studentEmail}_${dayKey}`] = ratingData;
                // Simpan ke Firebase jika online
                if (typeof db !== 'undefined' && DataService.mode === 'firebase') {
                    try {
                        await db.collection('artifacts').doc('nusantara-arsa')
                            .collection('users').doc(studentEmail)
                            .set({ journalRatings: { [dayKey]: ratingData } }, { merge: true });
                    } catch(e) {
                        console.warn('Gagal simpan rating ke Firebase:', e);
                    }
                }
                // Update cache latestStudentData
                const s = (latestStudentData||[]).find(x => x.email === studentEmail);
                if (s) {
                    if (!s.journalRatings) s.journalRatings = {};
                    s.journalRatings[dayKey] = ratingData;
                }
                // Re-render
                renderReflections();
            }

            // Render bintang interaktif
            function renderStarInput(studentEmail, dayKey, aspect, currentVal, labelColor) {
                let html = `<div style="display:inline-flex; gap:2px; align-items:center;">`;
                for (let i = 1; i <= 5; i++) {
                    const filled = i <= currentVal;
                    html += `<span
                        onclick="setStarRating('${studentEmail}','${dayKey}','${aspect}',${i})"
                        style="font-size:16px; cursor:pointer; color:${filled ? '#f59e0b' : '#d1d5db'}; transition:color 0.1s;"
                        onmouseover="hoverStars('${studentEmail}','${dayKey}','${aspect}',${i})"
                        onmouseout="unhoverStars('${studentEmail}','${dayKey}','${aspect}')"
                        data-star="${studentEmail}|${dayKey}|${aspect}|${i}">★</span>`;
                }
                html += `</div>`;
                return html;
            }

            function hoverStars(email, dayKey, aspect, upTo) {
                for (let i = 1; i <= 5; i++) {
                    const el = document.querySelector(`[data-star="${email}|${dayKey}|${aspect}|${i}"]`);
                    if (el) el.style.color = i <= upTo ? '#fbbf24' : '#d1d5db';
                }
            }
            function unhoverStars(email, dayKey, aspect) {
                const key = `${email}_${dayKey}`;
                const saved = _journalRatings[key] || {};
                const val = saved[aspect] || 0;
                for (let i = 1; i <= 5; i++) {
                    const el = document.querySelector(`[data-star="${email}|${dayKey}|${aspect}|${i}"]`);
                    if (el) el.style.color = i <= val ? '#f59e0b' : '#d1d5db';
                }
            }
            function setStarRating(email, dayKey, aspect, val) {
                const key = `${email}_${dayKey}`;
                if (!_journalRatings[key]) _journalRatings[key] = {};
                _journalRatings[key][aspect] = val;
                // Update tampilan bintang langsung tanpa re-render full
                for (let i = 1; i <= 5; i++) {
                    const el = document.querySelector(`[data-star="${email}|${dayKey}|${aspect}|${i}"]`);
                    if (el) el.style.color = i <= val ? '#f59e0b' : '#d1d5db';
                }
                // Update total badge
                const totalEl = document.getElementById(`rating-total-${email}-${dayKey}`);
                if (totalEl) {
                    const r = _journalRatings[key];
                    const aspects = ['konsistensi','refleksi','kreativitas','relevansi','kedalaman'];
                    const filled = aspects.filter(a => (r[a]||0) > 0).length;
                    const avg = filled > 0 ? (aspects.reduce((s,a) => s+(r[a]||0),0)/filled).toFixed(1) : '-';
                    totalEl.textContent = `Rata-rata: ${avg}/5`;
                }
            }

            function submitJournalRating(btn) {
                const email    = btn.dataset.email;
                const dayKey   = btn.dataset.daykey;
                const cacheKey = btn.dataset.cachekey;
                const r = _journalRatings[cacheKey] || {};
                const catatan = document.getElementById(`catatan-${email}-${dayKey}`)?.value || '';
                const aspects = ['konsistensi','refleksi','kreativitas','relevansi','kedalaman'];
                const allFilled = aspects.every(k => (r[k]||0) > 0);
                if (!allFilled) {
                    alert('Harap isi semua 5 aspek penilaian terlebih dahulu (klik bintang ⭐).');
                    return;
                }
                btn.textContent = '⏳ Menyimpan...';
                btn.disabled = true;
                saveJournalRating(email, dayKey, r, catatan).then(() => {
                    btn.textContent = '✅ Tersimpan!';
                    btn.style.background = '#10b981';
                    setTimeout(() => {
                        btn.textContent = '💾 Simpan Penilaian Jurnal Ini';
                        btn.style.background = '#1e3a5f';
                        btn.disabled = false;
                    }, 2000);
                }).catch(() => {
                    btn.textContent = '❌ Gagal Simpan';
                    btn.style.background = '#ef4444';
                    btn.disabled = false;
                });
            }

            // UPDATE: SYNC REFLECTIONS (FASE 1 LENGKAP)
            function renderReflections() {
                const allStudents = latestStudentData || [];
                const container = document.getElementById('reflections-container');
                if (!container) return;
                container.innerHTML = '';

                // Ambil nilai filter
                const fKelas   = (document.getElementById('filter-kelas')?.value || '').toLowerCase().trim();
                const fRole    = document.getElementById('filter-role')?.value || '';
                const fMentor  = (document.getElementById('filter-mentor')?.value || '').toLowerCase().trim();
                const fSiswa   = (document.getElementById('filter-siswa')?.value || '').toLowerCase().trim();
                const fRated   = document.getElementById('filter-rated')?.value || '';

                const roleLabels = { worker:'⚔️ Pekerja', student:'🎓 Akademisi', entrepreneur:'💼 Wirausaha', family:'🏠 Keluarga', none:'❓ Belum Pilih' };
                const roleColor  = { worker:'#3b82f6', student:'#8b5cf6', entrepreneur:'#10b981', family:'#ec4899', none:'#94a3b8' };
                const aspectLabels = [
                    { key:'konsistensi', label:'Konsistensi',  desc:'Menulis jurnal setiap hari' },
                    { key:'refleksi',    label:'Refleksi',     desc:'Kedalaman introspeksi diri' },
                    { key:'kreativitas', label:'Kreativitas',  desc:'Orisinalitas ekspresi' },
                    { key:'relevansi',   label:'Relevansi',    desc:'Kesesuaian dengan pertanyaan' },
                    { key:'kedalaman',   label:'Kedalaman',    desc:'Panjang & substansi jawaban' }
                ];

                let totalSiswa = 0, totalJurnal = 0, sudahDinilai = 0, belumDinilai = 0;

                // Filter siswa
                const filtered = allStudents.filter(s => {
                    const sd = s.saveData || {};
                    const refs = Array.isArray(sd.reflections) ? sd.reflections : (Array.isArray(s.reflections) ? s.reflections : []);
                    if (refs.length === 0) return false;

                    const sName    = (s.name || '').toLowerCase();
                    const sDetails = (s.details || sd.details || '').toLowerCase();
                    const sMentor  = (s.mentor || sd.mentor || '').toLowerCase();
                    const sRole    = sd.role || 'none';

                    if (fKelas  && !sDetails.includes(fKelas))  return false;
                    if (fMentor && !sMentor.includes(fMentor))  return false;
                    if (fSiswa  && !sName.includes(fSiswa))     return false;
                    if (fRole   && sRole !== fRole)              return false;

                    if (fRated) {
                        const hasAnyRating = refs.some((r,i) => {
                            const k = `${s.email}_day${r.day||i}`;
                            const saved = _journalRatings[k] || (s.journalRatings && s.journalRatings[`day${r.day||i}`]);
                            return saved && Object.values(saved).some(v => typeof v==='number' && v > 0);
                        });
                        if (fRated === 'rated'   && !hasAnyRating) return false;
                        if (fRated === 'unrated' && hasAnyRating)  return false;
                    }
                    return true;
                });

                // Hitung ringkasan
                filtered.forEach(s => {
                    const sd = s.saveData || {};
                    const refs = Array.isArray(sd.reflections) ? sd.reflections : (Array.isArray(s.reflections) ? s.reflections : []);
                    totalSiswa++;
                    totalJurnal += refs.length;
                    const hasRating = refs.some((r,i) => {
                        const k = `${s.email}_day${r.day||i}`;
                        const saved = _journalRatings[k] || (s.journalRatings && s.journalRatings[`day${r.day||i}`]);
                        return saved && Object.values(saved).some(v => typeof v==='number' && v > 0);
                    });
                    if (hasRating) sudahDinilai++; else belumDinilai++;
                });

                // Render ringkasan
                const summaryEl = document.getElementById('journal-summary');
                const badgeEl   = document.getElementById('journal-count-badge');
                if (badgeEl) badgeEl.textContent = `${totalSiswa} siswa · ${totalJurnal} jurnal`;
                if (summaryEl) {
                    const cards = [
                        { icon:'👥', val: totalSiswa,   label:'Siswa Punya Jurnal', color:'#3b82f6', bg:'#eff6ff' },
                        { icon:'📝', val: totalJurnal,  label:'Total Entri Jurnal',  color:'#8b5cf6', bg:'#f5f3ff' },
                        { icon:'✅', val: sudahDinilai, label:'Sudah Dinilai',       color:'#10b981', bg:'#ecfdf5' },
                        { icon:'⏳', val: belumDinilai, label:'Belum Dinilai',       color:'#f59e0b', bg:'#fffbeb' },
                    ];
                    summaryEl.innerHTML = cards.map(c => `
                        <div style="background:${c.bg}; border-radius:10px; padding:14px 16px; border:1px solid ${c.color}33; text-align:center;">
                            <div style="font-size:22px;">${c.icon}</div>
                            <div style="font-size:22px; font-weight:800; color:${c.color}; line-height:1.2;">${c.val}</div>
                            <div style="font-size:10.5px; color:#64748b; margin-top:2px;">${c.label}</div>
                        </div>`).join('');
                }

                if (filtered.length === 0) {
                    container.innerHTML = `<div style="text-align:center; padding:50px; color:#cbd5e1;">
                        <div style="font-size:48px; margin-bottom:10px;">📭</div>
                        <p>Tidak ada jurnal yang cocok dengan filter.</p>
                        <p style="font-size:12px;">Total Siswa Terhubung: <strong>${allStudents.length}</strong></p>
                        <small>Coba ubah atau reset filter di atas.</small>
                    </div>`;
                    return;
                }

                // Render kartu per siswa
                filtered.forEach(s => {
                    const sd       = s.saveData || {};
                    const refs     = Array.isArray(sd.reflections) ? sd.reflections : (Array.isArray(s.reflections) ? s.reflections : []);
                    const sName    = s.name || sd.name || 'Tanpa Nama';
                    const sDetails = s.details || sd.details || '-';
                    const sMentor  = s.mentor || sd.mentor || '-';
                    const sRole    = sd.role || 'none';
                    const sEmail   = s.email || '';
                    const rColor   = roleColor[sRole] || '#94a3b8';
                    const rLabel   = roleLabels[sRole] || sRole;

                    // Hitung rata-rata nilai semua jurnal siswa ini
                    let allAvg = [];
                    refs.forEach((r, i) => {
                        const dayKey = `day${r.day||i}`;
                        const saved  = _journalRatings[`${sEmail}_${dayKey}`] || (s.journalRatings && s.journalRatings[dayKey]) || {};
                        aspectLabels.forEach(a => { if (saved[a.key] > 0) allAvg.push(saved[a.key]); });
                    });
                    const overallAvg = allAvg.length > 0 ? (allAvg.reduce((a,b)=>a+b,0)/allAvg.length).toFixed(1) : null;

                    const card = document.createElement('div');
                    card.className = 'dash-card';
                    card.style.marginBottom = '16px';

                    // ---- HEADER KARTU SISWA ----
                    let html = `
                    <div style="border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                        <div>
                            <h4 style="color:var(--primary); margin:0 0 4px 0; font-size:15px;">${sName}</h4>
                            <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; font-size:11px; color:#64748b;">
                                <span>🏫 ${sDetails}</span>
                                <span>👤 Mentor: ${sMentor}</span>
                                <span style="background:${rColor}22; color:${rColor}; padding:1px 8px; border-radius:20px; font-size:10px; font-weight:700;">${rLabel}</span>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <span class="status-badge" style="background:#eff6ff; color:#1d4ed8; font-size:12px;">${refs.length} Jurnal</span>
                            ${overallAvg ? `<div style="margin-top:4px; font-size:11px; color:#f59e0b; font-weight:700;">⭐ Nilai Rata-rata: ${overallAvg}/5</div>` : '<div style="margin-top:4px; font-size:10px; color:#94a3b8;">Belum ada penilaian</div>'}
                        </div>
                    </div>
                    <div style="max-height:600px; overflow-y:auto; padding-right:4px;">`;

                    // ---- RENDER TIAP ENTRI JURNAL ----
                    [...refs].reverse().forEach((r, idx) => {
                        const actualIdx = refs.length - 1 - idx;
                        const dayKey    = `day${r.day || actualIdx}`;
                        const cacheKey  = `${sEmail}_${dayKey}`;
                        // Load existing rating ke cache jika belum ada
                        if (!_journalRatings[cacheKey] && s.journalRatings && s.journalRatings[dayKey]) {
                            _journalRatings[cacheKey] = s.journalRatings[dayKey];
                        }
                        const saved = _journalRatings[cacheKey] || {};

                        let timeStr = '-';
                        if (r.date) {
                            try { timeStr = new Date(r.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
                            catch(e) { timeStr = r.date; }
                        }

                        const entryRole   = r.role || sRole;
                        const entryColor  = roleColor[entryRole] || rColor;
                        const entryLabel  = roleLabels[entryRole] || entryRole;
                        const rQuestion   = r.question
                            ? `<div style="font-size:11px; color:#475569; font-style:italic; margin:8px 0 6px 0; padding:6px 10px; background:#f1f5f9; border-left:3px solid ${entryColor}; border-radius:0 4px 4px 0;">❓ ${r.question}</div>`
                            : '';

                        // Hitung isi jawaban (panjang karakter sebagai proxy kedalaman)
                        const textLen = (r.text || '').length;
                        const depthColor = textLen > 200 ? '#10b981' : textLen > 80 ? '#f59e0b' : '#ef4444';
                        const depthLabel = textLen > 200 ? 'Mendalam' : textLen > 80 ? 'Cukup' : 'Singkat';

                        // Hitung rata-rata entri ini
                        const entryVals = aspectLabels.map(a => saved[a.key]||0).filter(v=>v>0);
                        const entryAvg  = entryVals.length > 0 ? (entryVals.reduce((a,b)=>a+b,0)/entryVals.length).toFixed(1) : null;
                        const isFullyRated = aspectLabels.every(a => (saved[a.key]||0) > 0);

                        html += `
                        <div style="border:1px solid #e2e8f0; border-radius:10px; margin-bottom:14px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                            <!-- Meta bar -->
                            <div style="background:${entryColor}11; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; border-bottom:1px solid ${entryColor}33;">
                                <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                                    <span style="font-weight:700; color:${entryColor}; font-size:12px;">🗓️ Game Day ${r.day || (actualIdx+1)}</span>
                                    <span style="background:${entryColor}22; color:${entryColor}; padding:1px 7px; border-radius:20px; font-size:10px;">${entryLabel}</span>
                                    <span style="font-size:10px; color:#64748b;">🕒 ${timeStr}</span>
                                    <span style="font-size:10px; background:${depthColor}22; color:${depthColor}; padding:1px 7px; border-radius:20px;">${depthLabel} (${textLen} karakter)</span>
                                </div>
                                <span id="rating-total-${sEmail}-${dayKey}" style="font-size:11px; font-weight:700; color:${isFullyRated?'#10b981':'#94a3b8'};">
                                    ${entryAvg ? `⭐ Rata-rata: ${entryAvg}/5` : (isFullyRated ? '✅ Dinilai' : '⏳ Belum Dinilai')}
                                </span>
                            </div>

                            <!-- Isi Jurnal -->
                            <div style="padding:12px 14px;">
                                ${rQuestion}
                                <p style="margin:0 0 12px 0; font-style:italic; color:#334155; font-family:'Exo 2'; line-height:1.7; white-space:pre-wrap; font-size:12.5px; background:#fafafa; padding:10px 12px; border-radius:6px;">"${r.text || ''}"</p>

                                <!-- RUBRIK PENILAIAN GURU -->
                                <details style="margin-top:4px;">
                                    <summary style="cursor:pointer; font-size:11.5px; font-weight:700; color:#1e3a5f; padding:6px 0; user-select:none;">
                                        📋 Rubrik Penilaian Guru ${isFullyRated ? '<span style="color:#10b981; margin-left:6px;">✅ Sudah Dinilai</span>' : '<span style="color:#f59e0b; margin-left:6px;">⏳ Klik untuk menilai</span>'}
                                    </summary>
                                    <div style="margin-top:10px; padding:12px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                                            ${aspectLabels.map(a => `
                                            <div style="background:#fff; padding:10px 12px; border-radius:8px; border:1px solid #e2e8f0;">
                                                <div style="font-size:11px; font-weight:700; color:#1e3a5f; margin-bottom:2px;">${a.label}</div>
                                                <div style="font-size:10px; color:#94a3b8; margin-bottom:6px;">${a.desc}</div>
                                                ${renderStarInput(sEmail, dayKey, a.key, saved[a.key]||0, entryColor)}
                                            </div>`).join('')}
                                        </div>
                                        <!-- Catatan Guru -->
                                        <div style="margin-bottom:10px;">
                                            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">💬 Catatan / Umpan Balik Guru</label>
                                            <textarea id="catatan-${sEmail}-${dayKey}"
                                                style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; resize:vertical; min-height:60px; box-sizing:border-box; font-family:'Exo 2';"
                                                placeholder="Tulis catatan atau umpan balik untuk siswa ini..."
                                            >${saved.catatan||''}</textarea>
                                        </div>
                                        <!-- Tombol Simpan -->
                                        <button onclick="submitJournalRating(this)"
                                            data-email="${sEmail}"
                                            data-daykey="${dayKey}"
                                            data-cachekey="${cacheKey}"
                                            style="background:#1e3a5f; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-size:12px; cursor:pointer; font-weight:700; width:100%;">
                                            💾 Simpan Penilaian Jurnal Ini
                                        </button>
                                    </div>
                                </details>
                            </div>
                        </div>`;
                    });

                    html += `</div>`; // tutup scroll area
                    card.innerHTML = html;
                    container.appendChild(card);
                });
            }

            // =====================================================================
            // FASE 2 — RENDER PORTOFOLIO DI DASHBOARD GURU
            // =====================================================================

            function resetPortfolioFilter() {
                ['pf-filter-siswa','pf-filter-kelas'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
                ['pf-filter-format','pf-filter-target'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
                renderPortfolio();
            }

            // Simpan catatan guru untuk karya portofolio ke Firebase
            async function savePortfolioNote(studentEmail, karya_id, note) {
                // Update local cache
                const s = (latestStudentData||[]).find(x => x.email === studentEmail);
                if (s && s.saveData && s.saveData.portfolioItems) {
                    const item = s.saveData.portfolioItems.find(i => i.id === karya_id);
                    if (item) item.teacherNote = note;
                }
                // Persist ke Firebase
                if (typeof db !== 'undefined' && DataService.mode === 'firebase') {
                    try {
                        const docRef = db.collection('artifacts').doc('nusantara-arsa').collection('users').doc(studentEmail);
                        const snap = await docRef.get();
                        if (snap.exists) {
                            const data = snap.data();
                            const saveData = data.saveData || {};
                            const items = (saveData.portfolioItems || []).map(i =>
                                i.id === karya_id ? { ...i, teacherNote: note } : i
                            );
                            await docRef.update({ 'saveData.portfolioItems': items });
                        }
                    } catch(e) { console.warn('Gagal simpan catatan portofolio:', e); }
                }
            }

            function renderPortfolio() {
                const allStudents = latestStudentData || [];
                const container   = document.getElementById('portfolio-container');
                if (!container) return;
                container.innerHTML = '';

                const fSiswa  = (document.getElementById('pf-filter-siswa')?.value || '').toLowerCase().trim();
                const fFormat = document.getElementById('pf-filter-format')?.value || '';
                const fTarget = document.getElementById('pf-filter-target')?.value || '';
                const fKelas  = (document.getElementById('pf-filter-kelas')?.value || '').toLowerCase().trim();

                const formatColors = { video:'#3b82f6', poster:'#10b981', game:'#8b5cf6', kuis:'#f59e0b', modul:'#64748b' };
                const targetColors = { kelas:'#0ea5e9', dosen:'#6366f1', lomba:'#f59e0b', online:'#10b981' };

                let totalKarya = 0, totalAP = 0, karyaLomba = 0;
                let allStudentCards = [];

                allStudents.forEach(s => {
                    const sd     = s.saveData || {};
                    const items  = sd.portfolioItems || [];
                    if (items.length === 0) return;

                    const sName   = s.name || sd.name || 'Tanpa Nama';
                    const sDetails = s.details || sd.details || '-';
                    const sEmail  = s.email || '';
                    if (fSiswa && !sName.toLowerCase().includes(fSiswa)) return;
                    if (fKelas && !sDetails.toLowerCase().includes(fKelas)) return;

                    // Filter items
                    const filtered = items.filter(i => {
                        if (fFormat && i.formatId !== fFormat) return false;
                        if (fTarget && i.targetId !== fTarget) return false;
                        return true;
                    });
                    if (filtered.length === 0) return;

                    filtered.forEach(i => {
                        totalKarya++;
                        totalAP += i.apEarned || 0;
                        if (i.targetId === 'lomba') karyaLomba++;
                    });

                    const studentAP = filtered.reduce((a, i) => a + (i.apEarned||0), 0);

                    let cardHtml = `
                    <div class="dash-card" style="margin-bottom:16px;">
                        <div style="border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                            <div>
                                <h4 style="color:var(--primary); margin:0 0 3px 0;">${sName}</h4>
                                <span style="font-size:11px; color:#64748b;">🏫 ${sDetails}</span>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:12px; font-weight:700; color:#8b5cf6;">🏅 ${studentAP} AP</div>
                                <div style="font-size:11px; color:#64748b;">${filtered.length} karya</div>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">`;

                    filtered.slice().reverse().forEach(item => {
                        const fColor = formatColors[item.formatId] || '#64748b';
                        const tColor = targetColors[item.targetId] || '#64748b';
                        const hasNote = item.teacherNote && item.teacherNote.trim().length > 0;
                        const noteId = `pf-note-${sEmail.replace(/[^a-z0-9]/gi,'_')}-${item.id}`;

                        cardHtml += `
                        <div style="border:1px solid #e2e8f0; border-radius:10px; padding:12px; background:#fafafa; position:relative;">
                            <!-- Badges -->
                            <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px;">
                                <span style="background:${fColor}22; color:${fColor}; font-size:10px; padding:2px 8px; border-radius:20px; font-weight:700;">${item.formatEmoji} ${item.formatLabel}</span>
                                <span style="background:${tColor}22; color:${tColor}; font-size:10px; padding:2px 8px; border-radius:20px;">${item.targetLabel}</span>
                                ${item.targetId==='lomba' ? '<span style="background:#fef9c3; color:#854d0e; font-size:10px; padding:2px 8px; border-radius:20px;">🏆 Lomba</span>' : ''}
                            </div>
                            <!-- Konten -->
                            <div style="font-size:13px; font-weight:700; color:#1e3a5f; margin-bottom:4px;">${item.topicEmoji} ${item.topicLabel}</div>
                            <div style="font-size:10.5px; color:#64748b; margin-bottom:8px;">📅 Game Day ${item.day} &nbsp;·&nbsp; 🏅 +${item.apEarned} AP &nbsp;·&nbsp; 🧠 INT +${item.intEarned}</div>
                            <!-- Catatan Guru -->
                            <div style="margin-top:8px; padding-top:8px; border-top:1px solid #e2e8f0;">
                                <label style="font-size:10.5px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">💬 Catatan Guru:</label>
                                <textarea id="${noteId}"
                                    style="width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; resize:vertical; min-height:45px; box-sizing:border-box; background:${hasNote?'#f0fdf4':'#fff'};"
                                    placeholder="Tulis catatan atau apresiasi..."
                                >${item.teacherNote||''}</textarea>
                                <button onclick="(function(btn){
                                    const note = document.getElementById('${noteId}')?.value || '';
                                    btn.textContent = '⏳';
                                    savePortfolioNote('${sEmail}','${item.id}', note).then(()=>{
                                        btn.textContent = '✅ Tersimpan';
                                        btn.style.background = '#10b981';
                                        document.getElementById('${noteId}').style.background = '#f0fdf4';
                                        setTimeout(()=>{ btn.textContent='💾 Simpan'; btn.style.background='#1e3a5f'; }, 2000);
                                    });
                                })(this)"
                                style="margin-top:5px; background:#1e3a5f; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:11px; cursor:pointer; width:100%;">
                                    💾 Simpan Catatan
                                </button>
                            </div>
                        </div>`;
                    });

                    cardHtml += `</div></div>`;
                    allStudentCards.push(cardHtml);
                });

                // Ringkasan
                const summaryEl = document.getElementById('portfolio-summary');
                const badgeEl   = document.getElementById('portfolio-count-badge');
                if (badgeEl) badgeEl.textContent = `${allStudentCards.length} siswa · ${totalKarya} karya`;
                if (summaryEl) {
                    summaryEl.innerHTML = [
                        { icon:'🎨', val:totalKarya,      label:'Total Karya',     color:'#8b5cf6', bg:'#f5f3ff' },
                        { icon:'🏅', val:totalAP,         label:'Total AP Kelas',  color:'#f59e0b', bg:'#fffbeb' },
                        { icon:'🏆', val:karyaLomba,      label:'Karya Lomba',     color:'#ef4444', bg:'#fef2f2' },
                        { icon:'👩‍🎨', val:allStudentCards.length, label:'Siswa Berkarya', color:'#10b981', bg:'#ecfdf5' },
                    ].map(c => `
                        <div style="background:${c.bg}; border-radius:10px; padding:14px 16px; border:1px solid ${c.color}33; text-align:center;">
                            <div style="font-size:22px;">${c.icon}</div>
                            <div style="font-size:22px; font-weight:800; color:${c.color}; line-height:1.2;">${c.val}</div>
                            <div style="font-size:10.5px; color:#64748b; margin-top:2px;">${c.label}</div>
                        </div>`).join('');
                }

                if (allStudentCards.length === 0) {
                    container.innerHTML = `<div style="text-align:center; padding:50px; color:#cbd5e1;">
                        <div style="font-size:48px; margin-bottom:10px;">🎨</div>
                        <p>Belum ada karya media pembelajaran yang dibuat.</p>
                        <small>Siswa perlu masuk ke Kampus → Bangku Kampus → "Buat Media Pembelajaran"</small>
                    </div>`;
                    return;
                }

                container.innerHTML = allStudentCards.join('');
            }

            // NEW: FUNCTION RENDER VALIDATION / COMPETENCY
            function renderValidation() { // Hapus async
                const students = latestStudentData; // Gunakan Cache
                const tbody = document.getElementById('validation-body');
                tbody.innerHTML = '';

                if (students.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada data siswa.</td></tr>';
                    return;
                }

                students.forEach(s => {
                    const sd = s.saveData || {};

                    // 1. ANALISIS DECISION MAKING (ROLE)
                    let roleScore = 0;
                    let roleText = "Belum Memilih";
                    let roleColor = "#94a3b8"; // Abu-abu

                    if (sd.role && sd.role !== 'none') {
                        roleScore = 100;
                        roleText = sd.role.toUpperCase();

                        // Warna berdasarkan role
                        if (sd.role === 'worker') roleColor = "#ef4444"; // Merah
                        else if (sd.role === 'student') roleColor = "#3b82f6"; // Biru
                        else if (sd.role === 'entrepreneur') roleColor = "#10b981"; // Hijau
                        else if (sd.role === 'family') roleColor = "#d946ef"; // Pink
                    }

                    // 2. ANALISIS FINANCIAL LITERACY
                    // Baseline: 10.000G (Modal Awal)
                    // Target: 50.000G (Bagus), 100.000G (Sangat Bagus)
                    const money = sd.money || 0;
                    let moneyScore = 0;
                    if (money >= 100000) moneyScore = 100;
                    else if (money >= 50000) moneyScore = 85;
                    else if (money >= 20000) moneyScore = 70;
                    else if (money >= 10000) moneyScore = 60; // Standar
                    else moneyScore = 40; // Defisit (Boros)

                    // 3. ANALISIS SKILL DEVELOPMENT
                    // Target Trial: Stat Utama mencapai 50
                    let skillVal = 0;
                    let skillName = "-";

                    if (sd.role === 'worker') { skillVal = sd.str || 0; skillName = "STR"; }
                    else if (sd.role === 'student') { skillVal = sd.int || 0; skillName = "INT"; }
                    else if (sd.role === 'entrepreneur') { skillVal = sd.biz || 0; skillName = "BIZ"; }
                    else if (sd.role === 'family') { skillVal = sd.reputation || 0; skillName = "REP"; }

                    // Hitung persentase skill terhadap target (50)
                    let skillScore = Math.min(100, Math.floor((skillVal / 50) * 100));

                    // Rata-rata Skor Kompetensi
                    const totalScore = Math.floor((roleScore + moneyScore + skillScore) / 3);

                    // Tentukan Grade Warna
                    let scoreColor = "#ef4444"; // Merah (Kurang)
                    if (totalScore >= 80) scoreColor = "#10b981"; // Hijau (Baik)
                    else if (totalScore >= 60) scoreColor = "#f59e0b"; // Kuning (Cukup)

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>
                <strong>${s.name}</strong><br>
                <span style="font-size:10px; color:#64748b;">${s.details}</span>
            </td>
            <td>
                <span style="font-size:11px; font-weight:bold; color:${roleColor}; border:1px solid ${roleColor}; padding:2px 6px; border-radius:4px;">${roleText}</span>
                <div style="font-size:10px; margin-top:2px;">Konsistensi: ${roleScore}%</div>
            </td>
            <td>
                <div style="font-weight:bold; color:#0f172a;">${money.toLocaleString('id-ID')} G</div>
                <div class="bar-container" style="width:80px; height:4px; margin-top:2px;">
                    <div style="width:${moneyScore}%; height:100%; background:#fbbf24;"></div>
                </div>
                <span style="font-size:9px; color:#64748b;">Literasi: ${moneyScore}/100</span>
            </td>
            <td>
                <div style="font-weight:bold; color:#0f172a;">${skillName}: ${skillVal}</div>
                <div class="bar-container" style="width:80px; height:4px; margin-top:2px;">
                    <div style="width:${skillScore}%; height:100%; background:#3b82f6;"></div>
                </div>
                <span style="font-size:9px; color:#64748b;">Progres: ${skillScore}%</span>
            </td>
            <td>
                <div style="font-size:18px; font-weight:900; color:${scoreColor};">${totalScore}</div>
            </td>
        `;
                    tbody.appendChild(tr);
                });
            }

            // NEW: FUNGSI RENDER HALAMAN RESET (ASYNC UPDATE)
            function renderResetPage() { // Hapus async
                const students = latestStudentData; // Gunakan Cache
                const tbody = document.getElementById('reset-body');
                tbody.innerHTML = '';

                if (students.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada data siswa. Pastikan siswa sudah Login dan Save setidaknya sekali.</td></tr>';
                    return;
                }

                students.forEach(s => {
                    const sd = s.saveData || {};
                    const role = sd.role && sd.role !== 'none' ? sd.role.toUpperCase() : 'BELUM PILIH';
                    const progress = `Day ${sd.day || 1} | Lv ${sd.level || 1}`;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td><strong>${s.name}</strong></td>
            <td>${s.details}</td>
            <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${role}</span></td>
            <td>${progress}</td>
            <td>
                <div style="display:flex; gap:5px;">
                    <button class="auth-btn" 
                        style="width:auto; padding:6px 12px; font-size:10px; margin:0; background:linear-gradient(90deg, #f59e0b, #d97706); border:1px solid #b45309;" 
                        onclick="confirmResetStudent('${s.email}', '${s.name}')" title="Hapus Progress (Mulai Ulang)">
                        🔄 RESET
                    </button>
                    <button class="auth-btn" 
                        style="width:auto; padding:6px 12px; font-size:10px; margin:0; background:linear-gradient(90deg, #ef4444, #b91c1c); border:1px solid #7f1d1d;" 
                        onclick="confirmDeleteStudent('${s.email}', '${s.name}')" title="Hapus Akun Permanen">
                        🗑️ HAPUS
                    </button>
                </div>
            </td>
        `;
                    tbody.appendChild(tr);
                });
            }

            // NEW: KONFIRMASI RESET (DATA)
            async function confirmResetStudent(email, name) {
                const isConfirmed = confirm(`⚠️ RESET PROGRESS? ⚠️\n\nAnda akan menghapus SAVE DATA permainan siswa:\n"${name}"\n\nSiswa akan kembali ke awal permainan (Prologue) tapi AKUN TETAP ADA.\n\nLanjutkan?`);

                if (isConfirmed) {
                    document.body.style.cursor = 'wait';
                    try {
                        const result = await DataService.adminResetStudent(email);
                        if (result.success) {
                            alert(`✅ RESET SUKSES!\nData progress ${name} telah di-reset.`);
                            if (typeof refreshDashboardData === 'function') refreshDashboardData();
                            else renderResetPage();
                        } else {
                            alert(`❌ GAGAL RESET!\n${result.msg}`);
                        }
                    } catch (e) {
                        alert("Error: " + e.message);
                    } finally {
                        document.body.style.cursor = 'default';
                    }
                }
            }

            // NEW: KONFIRMASI DELETE (AKUN)
            async function confirmDeleteStudent(email, name) {
                const isConfirmed = confirm(`⛔ HAPUS AKUN PERMANEN? ⛔\n\nAnda akan menghapus SELURUH AKUN siswa:\n\n"${name}" (${email})\n\nSiswa TIDAK BISA LOGIN LAGI dan harus daftar ulang. Semua data hilang selamanya.\n\nLanjutkan Hapus Akun?`);

                if (isConfirmed) {
                    document.body.style.cursor = 'wait';
                    try {
                        const result = await DataService.adminDeleteStudent(email);
                        if (result.success) {
                            alert(`🗑️ AKUN DIHAPUS!\nAkun ${name} telah dihapus permanen dari database.`);
                            // Refresh data dashboard secara paksa
                            if (typeof refreshDashboardData === 'function') refreshDashboardData();
                            else renderResetPage();
                        } else {
                            alert(`❌ GAGAL HAPUS!\n${result.msg}`);
                        }
                    } catch (e) {
                        alert("Error Sistem: " + e.message);
                    } finally {
                        document.body.style.cursor = 'default';
                    }
                }
            }

            // ══════════════════════════════════════════════════════
            // 🔧 DEBUG MODE — Admin Functions
            // ══════════════════════════════════════════════════════
            function renderDebugModePage() {
                const isActive = isDebugModeActive();
                const badge  = document.getElementById('debug-status-badge');
                const detail = document.getElementById('debug-detail-status');

                if (badge) {
                    if (isActive) {
                        badge.innerText = '🟢 AKTIF';
                        badge.style.background    = '#dcfce7';
                        badge.style.color         = '#166534';
                        badge.style.borderColor   = '#4ade80';
                    } else {
                        badge.innerText = '⬜ NON-AKTIF';
                        badge.style.background    = '#f1f5f9';
                        badge.style.color         = '#64748b';
                        badge.style.borderColor   = '#cbd5e1';
                    }
                }

                if (detail) {
                    detail.innerHTML = isActive
                        ? `🧪 Debug mode <b style="color:#166534">AKTIF</b> — Tombol "🧚 Test Peri" dan "👹 Test Skripsi" tampil di HUD game saat kamu main.`
                        : `🔒 Debug mode <b style="color:#64748b">NON-AKTIF</b> — Tombol testing tersembunyi. Mode aman untuk siswa.`;
                }
            }

            function toggleDebugMode(activate) {
                localStorage.setItem(DEBUG_MODE_KEY, activate ? 'true' : 'false');
                renderDebugModePage();
                applyDebugModeToHUD();

                const msg = activate
                    ? '✅ Debug Mode AKTIF!\nTombol Test Peri & Test Skripsi akan muncul di HUD saat kamu masuk game.'
                    : '🔒 Debug Mode DIMATIKAN.\nTombol testing disembunyikan dari HUD game.';
                alert(msg);
            }

