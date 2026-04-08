            // NEW FUNCTION: DRAW OBJECT (Dipisah dari loop utama draw)
            function drawObject(ctx, o) {
                ctx.fillStyle = 'rgba(0,0,0,0.3)';

                // Bayangan mengikuti ukuran objek
                const shadowW = (o.w || 1) * 12;
                const centerX = (o.x * TILE_SIZE) + ((o.w || 1) * TILE_SIZE / 2);
                const centerY = (o.y * TILE_SIZE) + ((o.h || 1) * TILE_SIZE) - 2;

                ctx.beginPath();
                ctx.ellipse(centerX, centerY, shadowW, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                // Support Gambar untuk Object
                if (o.img) {
                    if (!o.loadedImg) {
                        o.loadedImg = new Image();
                        o.loadedImg.src = o.img;

                        // --- FIX: ADD ERROR HANDLER & FALLBACK FOR OBJECT IMAGES ---
                        o.loadedImg.onerror = function () {
                            this.onerror = null;
                            const src = o.img || "";

                            // Fallback khusus untuk kotak surat (Mailbox Merah)
                            if (o.type === 'mailbox') {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTE0IDMyIEwxNCAxNSBMOSAxNSBMOSAxMCBMMjMgMTAgTDIzIDE1IEwxOCAxNSBMMTggMzIgWiIgZmlsbD0iIzU5MzgxMSIvPjxwYXRoIGQ9Ik02IDUgTDI2IDUgTDI2IDEyIEMyNiAxNCA2IDE0IDYgMTIgWiIgZmlsbD0iI0RDMjYyNiIvPjxyZWN0IHg9IjgiIHk9IjciIHdpZHRoPSIxNiIgaGVpZ2h0PSIyIiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK KASUR (Visual Bed)
                            // UPDATE: Cek juga nama file 'bed' agar fallback tetap jalan jika images/bed.png gagal load
                            else if (src.includes('kasur') || src.includes('bed')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI5NiI+PHJlY3QgeD0iNCIgeT0iMTAiIHdpZHRoPSI1NiIgaGVpZ2h0PSI4MCIgZmlsbD0iIzhCNEMzOSIgcng9IjQiLz48cmVjdCB4PSI4IiB5PSIyNSIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkZGRkZGIiByeD0iMiIvPjxyZWN0IHg9IjgiIHk9IjEyIiB3aWR0aD0iNDgiIGhlaWdodD0iMTIiIGZpbGw9IiNmZmYiIHJ4PSI0Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK MEJA BUKU (Meja Kayu + Buku Biru)
                            /* REVISI: Menambahkan 'mejabelajar' ke kondisi fallback agar tetap aman */
                            else if (src.includes('mejabuku') || src.includes('mejabelajar')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iOCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjOEU1NDJCIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjIwIiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIGZpbGw9IiMzYjgyZjYiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTI2IDQgTDI2IDIwIiBzdHJva2U9IndoaXRlIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK MEJA TELPON (Meja Kayu + Telpon Merah)
                            else if (src.includes('mejatelpon') || src.includes('telpon')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iNCIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzhFNTQyQiIgc3Ryb2tlPSIjNUQ0MDM3Ii8+PHJlY3QgeD0iMTAiIHk9IjQiIHdpZHRoPSIxMiIgaGVpZ2h0PSI4IiBmaWxsPSIjZWY0NDQ0Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK MEJA KASUR (Meja Kayu + Mesin Kasir Abu-abu)
                            else if (src.includes('mejakasir')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxNiIgZmlsbD0iIzhCNEMzOSIgc3Ryb2tlPSIjNUQ0MDM3IiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI4IiB5PSI2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTAiIGZpbGw9IiM5NDkzOTgiIHN0cm9rZT0iIzMzNDE1NSIvPjxyZWN0IHg9IjEyIiB5PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSIyIiBmaWxsPSIjMWU0MDVmIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK ORANG SAWAH (Stick Figure Sederhana)
                            else if (src.includes('orangsawah')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGxpbmUgeDE9IjE2IiB5MT0iNCIgeDI9IjE2IiB5Mj0iMzIiIHN0cm9rZT0iIzhCNEMzOSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjgiIHkxPSIxMiIgeDI9IjI0IiB5Mj0iMTIiIHN0cm9rZT0iIzhCNEMzOSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSI4IiByPSI0IiBmaWxsPSIjZmZjMTA3Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK TUNGKU (Kotak Batu dengan Api)
                            else if (src.includes('tungku')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjNDQ0MDNjIiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iNCIvPjxyZWN0IHg9IjE2IiB5PSIzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMWUxZTFlIi8+PHBhdGggZD0iTTI0IDQ4IEwzMiAzMiBMNDAgNDgiIGZpbGw9IiNlZjQ0NDQiLz48cGF0aCBkPSJNMjggNDggTDM2IDQwIEw0NCA0OCIgZmlsbD0iI2Y1OWUwYiIgb3BhY2l0eT0iMC44Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK PARON (Anvil)
                            else if (src.includes('paron')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTIgMTAgTDMwIDEwIEwyOCAxNCBMMjAgMTYgTDIwIDI2IEwyOCAyNiBMMjggMzAgTDQgMzAgTDQgMjYgTDEyIDI2IEwxMiAxNiBMNCAxMiBaIiBmaWxsPSIjNzg5MDljIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK RAK SENJATA
                            else if (src.includes('raksenjata') || src.includes('raksenajata')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iNCIvPjxsaW5lIHgxPSIxMCIgeTE9IjIwIiB4Mj0iNTQiIHkyPSIyMCIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjQiLz48bGluZSB4MT0iMTAiIHkxPSI0MCIgeDI9IjU0IiB5Mj0iNDAiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTIwIDE1IEwyMCA0NSBNNDQgMTUgTDQ0IDQ1IiBzdHJva2U9IiM1ZDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK MEJA JAHIT
                            else if (src.includes('mejajahit')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iNCIgeT0iMTIiIHdpZHRoPSI1NiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzhCNEMzOSIgc3Ryb2tlPSIjNUQ0MDM3IiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIxMCIgeT0iOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjgiIGZpbGw9IiM5NDkzOTgiLz48cGF0aCBkPSJNMzAgMjAgTDUwIDIwIEw0MCA0MCBaIiBmaWxsPSIjZTkxZTYzIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjE1IiByPSIzIiBmaWxsPSIjZmZmIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK BIJIH BESI
                            else if (src.includes('bijihbesi')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTE2IDI0IEw4IDE2IEwxNiA4IEwyNCAxNiBaIiBmaWxsPSIjNzU3NTc1IiBzdHJva2U9IiM0MjQyNDIiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik02IDI0IEwxMCAyOCBMMTggMjggTDIyIDI0IiBmaWxsPSIjNzU3NTc1IiBzdHJva2U9IiM0MjQyNDIiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK KAYU BAKAR
                            else if (src.includes('kayubakar')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGNpcmNsZSBjeD0iMTAiIGN5PSIyMCIgcj0iNiIgZmlsbD0iIzVENDAzNyIgc3Ryb2tlPSIjM2UyNzIzIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIyMiIgY3k9IjIwIiByPSI2IiBmaWxsPSIjNUQ0MDM3IiBzdHJva2U9IiMzZTI3MjMiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTIigcj0iNiIgZmlsbD0iIzVENDAzNyIgc3Ryb2tlPSIjM2UyNzIzIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK LEMARI (Wardrobe tall box)
                            else if (src.includes('lemari')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI5NiI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjkyIiBmaWxsPSIjOEU1NDJCIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjgiIHk9IjYiIHdpZHRoPSIyMiIgaGVpZ2h0PSI4NCIgZmlsbD0iIzhCNEMzOSIgc3Ryb2tlPSIjNUQ0MDM3Ii8+PHJlY3QgeD0iMzQiIHk9IjYiIHdpZHRoPSIyMiIgaGVpZ2h0PSI4NCIgZmlsbD0iIzhCNEMzOSIgc3Ryb2tlPSIjNUQ0MDM3Ii8+PGNpcmNsZSBjeD0iMjYiIGN5PSI1MCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjM4IiBjeT0iNTAiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK VAS MERAH
                            else if (src.includes('vasmerah')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTEwIDI0IEwxMCAxMiBDMTAgNiAyMiA2IDIyIDEyIEwyMiAyNCBDMjIgMzAgMTAgMzAgMTAgMjQgWiIgZmlsbD0iI2VmNDQ0NCIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIiLz48ZWxsaXBzZSBjeD0iMTYiIGN5PSI4IiByeD0iNCIgcnk9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK JARING IKAN
                            else if (src.includes('jaringikan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI2NCI+PHBhdGggZD0iTTAgMCBMOTYgNjQgTTk2IDAgTTAgNjQgTTQ8IDAgTDQ4IDY0IE0wIDMyIEw5NiAzMiBNMjQgMCBMMjQgNjQgTTcyIDAgTDcyIDY0IE0wIDE2IEw5NiAxNiBNMCA0OCBMOTYgNDgiIHN0cm9rZT0iI2EzYTNhMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK RAK PANCING
                            else if (src.includes('rakpancing')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjOEU1NDJiIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSI2IiB5MT0iMjgiIHgyPSIyNiIgeTI9IjQiIHN0cm9rZT0iIzU1NSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjEwIiB5MT0iMjgiIHgyPSIyOCIgeTI9IjEwIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyIiB5MT0iMjgiIHgyPSIyMiIgeTI9IjgiIHN0cm9rZT0iIzU1NSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK EMBER IKAN
                            else if (src.includes('emberikan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTYgMTAgTDggMjggTDI0IDI4IEwyNiAxMCBaIiBmaWxsPSIjOTBBNEFFIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik02IDEwIFExNiAyIDI2IDEwIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCA4IEw4IDQgTDEyIDQgWiIgZmlsbD0iIzY0QjVGNiIvPjxwYXRoIGQ9Ik0yMiA4IEwyMCA0IEwyNCA0IFoiIGZpbGw9IiM2NEI1RjYiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK BOXES (Kotak Biru/Coolbox)
                            else if (src.includes('boxes')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iOCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjIyIiBmaWxsPSIjNjRiNWY2IiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyIiB5MT0iMTQiIHgyPSIzMCIgeTI9IjE0IiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK KASUR NELAYAN
                            else if (src.includes('kasurnelayan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI5NiI+PHJlY3QgeD0iNCIgeT0iMTAiIHdpZHRoPSI1NiIgaGVpZ2h0PSI4MCIgZmlsbD0iIzVENEAzNyIgcng9IjQiLz48cmVjdCB4PSI4IiB5PSIyNSIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjRmNmY4IiByeD0iMiIvPjxyZWN0IHg9IjgiIHk9IjEyIiB3aWR0aD0iNDgiIGhlaWdodD0iMTIiIGZpbGw9IiNjYmQ1ZTEiIHJ4PSI0Ii8+PC9zdmc+';
                            }
                            // NEW: FALLBACK RAK PIALA IKAN
                            else if (src.includes('rakpialaikan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNNiA2IEwyNiA2IEwyNCAxNiBDMjQgMjAgMjAgMjIgMTYgMjIgQzEyIDIyIDggMjAgOCAxNiBMNiA2IFoiIGZpbGw9IiNGRkQ3MDAiIHN0cm9rZT0iI0I4ODYwQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iMTQiIHk9IjIyIiB3aWR0aD0iNCIgaGVpZ2h0PSI2IiBmaWxsPSIjQjg4NjBCIi8+PHJlY3QgeD0iMTAiIHk9IjI4IiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iIzhCNDUxMyIvPjxjaXJjbGUgY3g9IjI2IiBjeT0iMTAiIHI9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iNiIgY3k9IjEwIiByPSIzIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK MEJA MAKAN IKAN
                            else if (src.includes('mejamakanikan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMTAiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxNCIgZmlsbD0iI0EwNTIyRCIgc3Ryb2tlPSIjNUQ0MDM3IiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNiIgZmlsbD0iI0EwNTIyRCIvPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNiIgZmlsbD0iI0EwNTIyRCIvPjxlbGxpcHNlIGN4PSIxNiIgY3k9IjE2IiByeD0iOCIgcnk9IjMiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNMTIgMTYgTDIwIDE2IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK ARSIP REKAM MEDIS (Laci Besi Abu-abu)
                            else if (src.includes('arsiprekammedis')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjOTRhM2I4IiBzdHJva2U9IiM0NzU1NjkiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIyMCIgaGVpZ2h0PSI2IiBmaWxsPSIjYzFjN2Q2IiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMjAiIGhlaWdodD0iNiIgZmlsbD0iI2MxYzdkNiIgc3Ryb2tlPSIjNjQ3NDhiIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI2IiB5PSIyMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjYiIGZpbGw9IiNjMWM3ZDYiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIxIi8+PGxpbmUgeDE9IjE0IiB5MT0iOSIgeDI9IjE4IiB5Mj0iOSIgc3Ryb2tlPSIjMzM0MTU1IiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMTQiIHkxPSIxNyIgeDI9IjE4IiB5Mj0iMTciIHN0cm9rZT0iIzMzNDE1NSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjE0IiB5MT0iMjUiIHgyPSIxOCIgeTI9IjI1IiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK KEBUN AYU (Taman Bunga)
                            else if (src.includes('kebunayu')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iOTYiPjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSIxMjAiIGhlaWdodD0iODgiIGZpbGw9IiM1ZDQwMzciIHN0cm9rZT0iIzNjMjQxNSIgc3Ryb2tlLXdpZHRoPSI0Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTAiIGZpbGw9IiNlOTFlNjMiLz48Y2lyY2xlIGN4PSI2NCIgY3k9IjMwIiByPSIxMCIgZmlsbD0iI2Y1OWUwYiIvPjxjaXJjbGUgY3g9Ijk4IiBjeT0iMzAiIHI9IjEwIiBmaWxsPSIjM2I4MmY2Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSI2NCIgcj0iMTAiIGZpbGw9IiNmZmViM2IiLz48Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiByPSIxMCIgZmlsbD0iI2U5MWU2MyIvPjxjaXJjbGUgY3g9Ijk4IiBjeT0iNjQiIHI9IjEwIiBmaWxsPSIjZjU5ZTBiIi8+PC9zdmc+';
                            }
                            // NEW: FALLBACK PIALA MENTOR (Piala Emas Besar)
                            else if (src.includes('pialamentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNOCA2IEwyNCA2IEwyMiAxNiBDMjIgMjAgMTggMjIgMTYgMjIgQzE0IDIyIDEwIDIwIDEwIDE2IEw4IDYgWiIgZmlsbD0iI0ZGRDcwMCIgc3Ryb2tlPSIjQjg4NjBCIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIxNCIgeT0iMjIiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiNCODg2MEIiLz48cmVjdCB4PSI4IiB5PSIyOCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjQiIGZpbGw9IiM4QjQ1MTMiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjEwIiByPSI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjgiIGN5PSIxMCIgcj0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZDNzAwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTYgMTAgTDE2IDE2IiBzdHJva2U9IiNCODg2MEIiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK VAS MENTOR (Vas Biru Elegan)
                            else if (src.includes('vasmentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTEwIDI0IEwxMCAxMiBDMTAgNiAyMiA2IDIyIDEyIEwyMiAyNCBDMjIgMzAgMTAgMzAgMTAgMjQgWiIgZmlsbD0iIzNiODJmNiIgc3Ryb2tlPSIjMWQ0ZWQ4IiBzdHJva2Utd2lkdGg9IjIiLz48ZWxsaXBzZSBjeD0iMTYiIGN5PSI4IiByeD0iNCIgcnk9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK TUMPUKAN KERTAS (Tumpukan Dokumen Putih)
                            else if (src.includes('tumpukankertas')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iNCIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjY2JkNWUxIiBzdHJva2Utd2lkdGg9IjEiLz48bGluZSB4MT0iOCIgeTE9IjE2IiB4Mj0iMjQiIHkyPSIxNiIgc3Ryb2tlPSIjMDAwIi8+PGxpbmUgeDE9IjgiIHkxPSIyMCIgeDI9IjI0IiB5Mj0iMjAiIHN0cm9rZT0iIzAwMCIvPjwvc3ZnPg==';
                            }
                            // NEW: FALLBACK FOTO MENTOR (Bingkai Foto Kayu)
                            else if (src.includes('fotomentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI0IiBmaWxsPSIjOEU1NDJCIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjYiIHk9IjgiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjQiIGZpbGw9IiM5NDkzOTgiLz48L3N2Zz4=';
                            }
                            // Fallback: RAK BUKU (Gambar Rak dengan Buku Warna-warni) - UPDATE: Tambahkan fallback untuk lemariobat dan rakmentor
                            else if (src.includes('rakbuku') || src.includes('lemariobat') || src.includes('rakmentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjOEU1NDJiIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjUiIHk9IjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIiBmaWxsPSIjZWY0NDQ0Ii8+PHJlY3QgeD0iMTAiIHk9IjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIiBmaWxsPSIjM2I4MmY2Ii8+PHJlY3QgeD0iMTUiIHk9IjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMTBiOTgxIi8+PHJlY3QgeD0iMjAiIHk9IjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIiBmaWxsPSIjZTkxZTYzIi8+PC9zdmc+';
                            }
                            // Fallback: PAPAN TULIS (Hijau/Hitam dengan Bingkai)
                            else if (src.includes('papan')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjYwIiBoZWlnaHQ9IjI4IiBmaWxsPSIjMDY0ZTNGIiBzdHJva2U9IiM4YTUwMjUiIHN0cm9rZS13aWR0aD0iNCIvPjx0ZXh0IHg9IjMyIiB5PSIyMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjEyMzwvdGV4dD48L3N2Zz4=';
                            }
                            // Fallback: KURSI (Bentuk Kursi Kayu)
                            else if (src.includes('kursi')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTEwIDIwIEwxMCAxMCBMMjIgMTAgTDIyIDIwIEwyMiAyOCBMMjAgMjggTDIwIDIyIEwxMiAyMiBMMTIgMjggTDEwIDI4IFoiIGZpbGw9IiM4YTUwMjUiIHN0cm9rZT0iIzU5MzUxMSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
                            }
                            // Fallback: MEJA DOSEN (Meja Guru), MEJA DOKTER, ATAU MEJA MENTOR
                            else if (src.includes('mejadosen') || src.includes('mejadokter') || src.includes('mejamentor')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxMiIgZmlsbD0iIzVENDAzNyIgc3Ryb2tlPSIjM2UyNzIzIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzVENDAzNyIvPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzVENDAzNyIvPjwvc3ZnPg==';
                            }
                            // Fallback: MEJA MODIN (Meja Akad dengan Taplak Putih)
                            else if (src.includes('mejamodin')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxMiIgZmlsbD0iIzVENDAzNyIgc3Ryb2tlPSIjM2UyNzIzIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzVENDAzNyIvPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzVENDAzNyIvPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSIxNiIgaGVpZ2h0PSI0IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjkiLz48L3N2Zz4=';
                            }
                            // NEW: FALLBACK ALTAR (Gerbang/Dekorasi Bunga)
                            else if (src.includes('altar')) {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNzYiIGhlaWdodD0iNTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Q0QUYzNyIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTEwIDEwIFEgNDggLTIwIDg2IDEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjYiIGZpbGw9IiNmMjhiODIiLz48Y2lyY2xlIGN4PSI4NiIgY3k9IjEwIiByPSI2IiBmaWxsPSIjZjI4YjgyIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iNTYiIGhlaWdodD0iNDQiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==';
                            }
                            // Fallback Umum (Box Kayu)
                            else {
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjOEU1NDJiIiBzdHJva2U9IiM1RDQwMzciIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyIiB5MT0iMiIgeDI9IjMwIiB5Mj0iMzAiIHN0cm9rZT0iIzVENDAzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjMwIiB5MT0iMiIgeDI9IjIiIHkyPSIzMCIgc3Ryb2tlPSIjNUQ0MDM3IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
                            }
                        };
                    }

                    if (o.loadedImg.complete && o.loadedImg.naturalWidth !== 0) {
                        // Gambar object sesuai ukuran custom (w/h)
                        const drawW = (o.w || 1) * TILE_SIZE;
                        const drawH = (o.h || 1) * TILE_SIZE;
                        ctx.drawImage(o.loadedImg, o.x * TILE_SIZE, o.y * TILE_SIZE, drawW, drawH);
                    } else {
                        // Fallback Text Icon jika gambar benar-benar gagal
                        ctx.font = '20px Arial';
                        ctx.fillStyle = '#fff';
                        ctx.fillText(o.icon, o.x * TILE_SIZE + 5, o.y * TILE_SIZE + 25);
                    }
                } else {
                    // Default Icon Rendering
                    ctx.font = '20px Arial';
                    ctx.fillStyle = '#fff'; // Pastikan warna terlihat
                    ctx.fillText(o.icon, o.x * TILE_SIZE + 5, o.y * TILE_SIZE + 25);
                }

                // --- NEW: IDENTITAS MAILBOX MELAYANG (Agar Player Tahu Ini Pos) ---
                if (o.type === 'mailbox') {
                    const centerX = (o.x * TILE_SIZE) + (TILE_SIZE / 2);
                    const topY = (o.y * TILE_SIZE) - 15; // Di atas objek

                    // Animasi Melayang (Slow Bobbing)
                    const floatOffset = Math.sin(Date.now() / 500) * 3;

                    ctx.save();
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'center';
                    ctx.shadowColor = 'rgba(0,0,0,0.8)';
                    ctx.shadowBlur = 4;

                    // Gambar Amplop Putih
                    ctx.fillText('✉️', centerX, topY + floatOffset);

                    // Label Kecil "POS" (Opsional, agar lebih jelas)
                    ctx.font = 'bold 8px "Exo 2"';
                    ctx.fillStyle = '#fbbf24'; // Emas
                    ctx.fillText("POS", centerX, topY + floatOffset + 8);

                    ctx.restore();
                }

                // --- NEW: INDIKATOR PESAN BELUM DIBACA (KHUSUS MAILBOX) ---
                if (o.type === 'mailbox') {
                    const msgs = STATE.player.messages || [];
                    const unreadCount = msgs.filter(m => !m.read).length;

                    if (unreadCount > 0) {
                        // Gambar Notifikasi Merah Melayang (Lebih tinggi sedikit agar tidak menumpuk ikon amplop)
                        const bx = (o.x * TILE_SIZE) + (TILE_SIZE / 2) + 10; // Geser ke kanan sedikit
                        const by = (o.y * TILE_SIZE) - 25; // Lebih ke atas

                        const floatY = Math.sin(Date.now() / 200) * 3; // Animasi lebih cepat (urgensi)

                        ctx.fillStyle = '#ef4444'; // Merah
                        ctx.beginPath();
                        ctx.arc(bx, by + floatY, 7, 0, Math.PI * 2);
                        ctx.fill();

                        // Border Putih
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 1.5;
                        ctx.stroke();

                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 10px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        // Tampilkan jumlah pesan jika > 1, jika tidak tanda seru
                        const badgeText = unreadCount > 9 ? '9+' : (unreadCount > 1 ? unreadCount : '!');
                        ctx.fillText(badgeText, bx, by + floatY + 1);
                    }
                }
            }

            function drawBuilding(ctx, b) {
                // Bangunan collision-only di fairy village (sudah ada sprite NPC/gambar khusus) — skip render
                if (b.id === 'rara_wilis_bld' || b.id === 'pohon_energi_bld' || b.id === 'fv_istana_bld') return;

                // FIX: Bangunan Fairy Village — render pakai gambar tier untuk hunian, emoji untuk lainnya
                if (b.id && b.id.startsWith('fv_bld_')) {
                    const _ts = (typeof TS !== 'undefined') ? TS : 40;
                    const _vs = (typeof FV_BLDG_VISUAL_SCALE !== 'undefined') ? FV_BLDG_VISUAL_SCALE : 1.8;
                    const bx = b.x * _ts, by = b.y * _ts;
                    const bw = (b.w || 2) * _ts, bh = (b.h || 2) * _ts;
                    // Visual scale — lebih besar, anchor bawah agar nempel tanah
                    const vw = bw * _vs, vh = bh * _vs;
                    const vx = bx + bw/2 - vw/2;
                    const vy = by + bh - vh;
                    const bid2 = b._fvBid || '';

                    // Gambar bangunan dengan ukuran visual (besar, anchor bawah)
                    const _omahMap = { pondok_peri: 1, rumah_peri: 2, dalem_widadari: 3 };
                    const _omahTier = _omahMap[bid2];
                    let drawn = false;
                    if (_omahTier && typeof FV_OMAH_IMAGES !== 'undefined') {
                        const _img = FV_OMAH_IMAGES[_omahTier];
                        if (_img && _img.complete && _img.naturalWidth > 0) {
                            ctx.drawImage(_img, vx, vy, vw, vh);
                            drawn = true;
                        }
                    }
                    if (!drawn && typeof drawFVBuildingCanvas === 'function') {
                        drawFVBuildingCanvas(ctx, bid2, vx, vy, vw, vh, performance.now());
                        drawn = true;
                    }

                    // ── Label PILL di ATAS bangunan (pakai posisi visual) ──
                    if (b.name) {
                        ctx.save();
                        const labelText = (b._fvEmoji||'🏠') + ' ' + b.name.replace(/^[^ ]+ /,'');
                        ctx.font = 'bold 9px Nunito, sans-serif';
                        const tw = ctx.measureText(labelText).width;
                        const pillW = tw + 16, pillH = 18;
                        const pillX = vx + vw/2 - pillW/2;
                        const pillY = vy - 26; // di atas gambar visual
                        ctx.shadowColor='rgba(0,0,0,0.6)'; ctx.shadowBlur=6; ctx.shadowOffsetY=3;
                        ctx.fillStyle='rgba(30,5,60,0.92)';
                        ctx.beginPath(); ctx.roundRect(pillX, pillY, pillW, pillH, 5); ctx.fill();
                        ctx.shadowBlur=0; ctx.shadowOffsetY=0;
                        const tierColors=['#d97706','#2563eb','#9333ea','#ea580c','#ca8a04'];
                        ctx.strokeStyle=tierColors[b._fvTier||0]||'#9333ea'; ctx.lineWidth=1.5;
                        ctx.beginPath(); ctx.roundRect(pillX, pillY, pillW, pillH, 5); ctx.stroke();
                        ctx.fillStyle='#e9d5ff'; ctx.textAlign='center'; ctx.textBaseline='middle';
                        ctx.fillText(labelText, vx+vw/2, pillY+pillH/2);
                        ctx.textAlign='left'; ctx.textBaseline='alphabetic';
                        ctx.restore();
                    }

                    // ── Portal entrance ──
                    if (b.entrance) {
                        const ex = b.entrance.x * _ts;
                        const ey = b.entrance.y * _ts;
                        const pulse = Math.abs(Math.sin(Date.now()/300));
                        ctx.fillStyle = `rgba(6,182,212,${pulse})`;
                        ctx.beginPath(); ctx.arc(ex+_ts/2, ey+_ts/2, _ts*0.28, 0, Math.PI*2); ctx.fill();
                        ctx.strokeStyle='#fff'; ctx.lineWidth=1;
                        ctx.beginPath(); ctx.arc(ex+_ts/2, ey+_ts/2, _ts*0.28+pulse*6, 0, Math.PI*2); ctx.stroke();
                        ctx.font=`bold 8px Nunito,sans-serif`; ctx.fillStyle='#fff'; ctx.textAlign='center';
                        ctx.fillText('MASUK', ex+_ts/2, ey-4);
                        ctx.textAlign='left';
                    }
                    return;
                }

                if (b.type === 'trigger') {
                    // Trigger invisible, but usually draws entrance circle below
                } else {
                    let src = b.img;

                    if (b.id === 'player_house') {
                        // UPDATE: Jika Role Entrepreneur, ganti gambar rumah jadi Toko Player
                        if (STATE.player.role === 'entrepreneur') {
                            src = 'images/tokoplayer.png';
                        } else {
                            src = `images/houselevel${STATE.player.houseLevel}.png`;
                        }
                    }
                    if (b.id === 'merchant' && STATE.player.role === 'entrepreneur') {
                        // src = 'images/tokoplayer.png'; // REMOVED: Jangan ubah Merchant NPC
                    }
                    // PERBAIKAN: Handle Gambar Batu Dungeon
                    if (b.type === 'dungeon_rock') {
                        // Gunakan aset khusus rock (batudidungeon.png)
                        if (dungeonAssets.rock.complete && dungeonAssets.rock.naturalWidth !== 0) {
                            // Gambar batu sebagai objek
                            ctx.drawImage(dungeonAssets.rock, b.x * TILE_SIZE, b.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                        } else {
                            // Fallback jika gambar belum load (Coba pakai wall dulu atau bentuk bulat)
                            if (dungeonAssets.wall.complete && dungeonAssets.wall.naturalWidth !== 0) {
                                ctx.drawImage(dungeonAssets.wall, b.x * TILE_SIZE, b.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                            } else {
                                ctx.fillStyle = '#1e293b';
                                ctx.beginPath(); ctx.arc(b.x * TILE_SIZE + 15, b.y * TILE_SIZE + 15, 12, 0, Math.PI * 2); ctx.fill();
                            }
                        }
                        return; // Selesai gambar batu, skip sisanya
                    }

                    // --- [FIX] LOGIKA UPDATE GAMBAR DINAMIS ---
                    // Cek: Jika belum ada loadedImg ATAU src-nya sudah berubah (misal habis upgrade rumah)
                    // Maka load ulang gambar baru
                    if (!b.loadedImg || (b.loadedImg.src && !b.loadedImg.src.includes(src))) {
                        b.loadedImg = new Image();
                        b.loadedImg.src = src;
                        b.loadedImg.onerror = function () { this.error = true; };
                    }

                    if (b.loadedImg.complete && !b.loadedImg.error && b.loadedImg.naturalWidth !== 0) {
                        ctx.drawImage(b.loadedImg, b.x * TILE_SIZE, b.y * TILE_SIZE, b.w * TILE_SIZE, b.h * TILE_SIZE);
                    } else {
                        ctx.fillStyle = b.id === 'player_house' ? '#d97706' : '#475569';
                        ctx.fillRect(b.x * TILE_SIZE, b.y * TILE_SIZE, b.w * TILE_SIZE, b.h * TILE_SIZE);
                        ctx.fillStyle = '#fff';
                        ctx.font = '10px Arial';
                        ctx.fillText(b.name || "Building", b.x * TILE_SIZE, b.y * TILE_SIZE + 20);
                    }
                }

                // --- NEW: EFEK SALJU MENEMPEL DI ATAP BANGUNAN ---
                if (STATE.season === 'winter' && STATE.location === 'village' && b.type !== 'trigger' && b.type !== 'dungeon_rock') {
                    ctx.save();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Warna Salju Transparan

                    // Buat bentuk tumpukan salju di atas atap
                    const bx = b.x * TILE_SIZE;
                    const by = b.y * TILE_SIZE;
                    const bw = b.w * TILE_SIZE;

                    // Gambar Ellipse pipih di bagian atas bangunan (Atap)
                    ctx.beginPath();
                    // Pusat di tengah atas bangunan
                    ctx.ellipse(bx + bw / 2, by + 10, bw / 2 - 5, 10, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Tambahkan tetesan es (Icicles) kecil
                    ctx.fillStyle = 'rgba(200, 230, 255, 0.9)';
                    for (let i = 0; i < b.w; i++) {
                        if (i % 2 === 0) { // Selang seling
                            ctx.fillRect(bx + (i * TILE_SIZE) + 10, by + 15, 4, 8 + Math.random() * 5);
                        }
                    }

                    ctx.restore();
                }
                // --------------------------------------------------

                if (b.entrance) {
                    const ex = b.entrance.x * TILE_SIZE;
                    const ey = b.entrance.y * TILE_SIZE;
                    const pulse = Math.abs(Math.sin(Date.now() / 300));

                    // UPDATE: Warna indikator berbeda untuk Exit vs Enter
                    const isExit = b.id.includes('exit') || b.id.includes('out') || (b.name && b.name.toLowerCase().includes('keluar'));

                    // Orange untuk Masuk, Merah/Putih untuk Keluar
                    let indColor = b.id === 'player_house' ? `rgba(251, 191, 36, ${pulse})` : `rgba(6, 182, 212, ${pulse})`;
                    if (isExit) indColor = `rgba(239, 68, 68, ${pulse})`;

                    // NEW: Warna Ungu untuk Portal Next Level
                    if (b.id === 'dungeon_next') indColor = `rgba(147, 51, 234, ${pulse})`; // Purple

                    ctx.fillStyle = indColor;
                    ctx.beginPath();
                    ctx.arc(ex + 15, ey + 15, 10, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(ex + 15, ey + 15, 10 + (pulse * 5), 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.font = 'bold 8px "Exo 2"';
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';

                    // UPDATE: Teks otomatis berubah jadi KELUAR jika ID/Nama mengandung kata kunci exit/keluar
                    let label = isExit ? "KELUAR" : "MASUK";
                    if (b.id === 'dungeon_next') label = "NEXT LVL"; // Label khusus
                    if (b.id === 'papan_misi') label = "LIHAT"; // Label khusus Papan

                    ctx.fillText(label, ex + 15, ey - 5);
                }

                // --- NEW: LABEL BANGUNAN PREMIUM (PILL STYLE) ---
                if (b.name && b.type !== 'trigger' && b.type !== 'dungeon_rock') {
                    ctx.save();

                    const bx = b.x * TILE_SIZE;
                    const by = b.y * TILE_SIZE;
                    const bw = b.w * TILE_SIZE;

                    // Cek Status Buka/Tutup
                    let isClosed = false;
                    let isRenovating = false;

                    if (b.entrance && b.entrance.map && !maps[b.entrance.map]) {
                        isRenovating = true;
                    } else if (b.openTime && b.closeTime && !b.open24h) {
                        if (STATE.time < b.openTime || STATE.time >= b.closeTime) {
                            isClosed = true;
                        }
                    }

                    // --- KONFIGURASI STYLE ---
                    let labelText = b.name.toUpperCase();
                    let bgColor = 'rgba(15, 23, 42, 0.9)'; // Default: Dark Slate (Modis)
                    let borderColor = 'rgba(148, 163, 184, 0.8)'; // Border Abu-abu
                    let textColor = '#f8fafc'; // Putih
                    let icon = '';

                    // Style Khusus Bangunan Utama (Emas)
                    if (b.roleSpecific || b.id === 'player_house') {
                        bgColor = 'rgba(66, 32, 6, 0.95)'; // Coklat Tua
                        borderColor = '#fbbf24'; // Emas
                        textColor = '#fffbeb';
                    }

                    // Style Khusus Status
                    if (isRenovating) {
                        bgColor = 'rgba(113, 63, 18, 0.95)'; // Kuning Tua
                        borderColor = '#fcd34d';
                        icon = '🚧 ';
                    } else if (isClosed) {
                        bgColor = 'rgba(127, 29, 29, 0.95)'; // Merah Tua
                        borderColor = '#ef4444';
                        icon = '🔒 ';
                    } else {
                        // Ikon Bangunan Saat Buka
                        if (b.id.includes('merchant')) icon = '🛒 ';
                        else if (b.id.includes('clinic')) icon = '🏥 ';
                        else if (b.id.includes('school')) icon = '🎓 ';
                        else if (b.id.includes('guild')) icon = '⚔️ ';
                        else if (b.id.includes('blacksmith')) icon = '⚒️ ';
                        else if (b.id.includes('library')) icon = '📚 ';
                        else if (b.id.includes('wedding')) icon = '💍 '; // Sudah ada
                        else if (b.id.includes('port')) icon = '⚓ ';
                    }

                    const fullText = icon + labelText;

                    // Hitung Ukuran Label
                    ctx.font = 'bold 9px "Exo 2", sans-serif'; // Ukuran font pas
                    const textMetrics = ctx.measureText(fullText);
                    const textWidth = textMetrics.width;

                    const paddingX = 8;
                    const paddingY = 4;
                    const pillW = textWidth + (paddingX * 2);
                    const pillH = 18; // Tinggi label

                    // Posisi Label (Tengah bangunan, melayang di atas atap)
                    const pillX = bx + (bw / 2) - (pillW / 2);
                    const pillY = by - 28; // Jarak float dari atap

                    // --- DRAW SHADOW (Efek Melayang) ---
                    ctx.shadowColor = 'rgba(0,0,0,0.6)';
                    ctx.shadowBlur = 6;
                    ctx.shadowOffsetY = 3;

                    // --- DRAW PILL BACKGROUND (Rounded Rect) ---
                    ctx.fillStyle = bgColor;
                    ctx.beginPath();
                    const r = 5; // Radius sudut
                    ctx.moveTo(pillX + r, pillY);
                    ctx.lineTo(pillX + pillW - r, pillY);
                    ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + r);
                    ctx.lineTo(pillX + pillW, pillY + pillH - r);
                    ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - r, pillY + pillH);
                    ctx.lineTo(pillX + r, pillY + pillH);
                    ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - r);
                    ctx.lineTo(pillX, pillY + r);
                    ctx.quadraticCurveTo(pillX, pillY, pillX + r, pillY);
                    ctx.fill();

                    // --- DRAW BORDER ---
                    ctx.shadowBlur = 0; // Hilangkan shadow untuk border agar tajam
                    ctx.shadowOffsetY = 0;
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();

                    // --- DRAW TEXT ---
                    ctx.fillStyle = textColor;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    // Gambar teks di tengah pill
                    ctx.fillText(fullText, pillX + (pillW / 2), pillY + (pillH / 2));

                    // --- DRAW ARROW/POINTER KE BAWAH (Segitiga kecil) ---
                    ctx.fillStyle = bgColor;
                    ctx.beginPath();
                    ctx.moveTo(pillX + (pillW / 2) - 4, pillY + pillH);
                    ctx.lineTo(pillX + (pillW / 2) + 4, pillY + pillH);
                    ctx.lineTo(pillX + (pillW / 2), pillY + pillH + 4);
                    ctx.fill();

                    // Border segitiga (opsional, agar nyatu)
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(pillX + (pillW / 2) - 4, pillY + pillH);
                    ctx.lineTo(pillX + (pillW / 2), pillY + pillH + 4);
                    ctx.lineTo(pillX + (pillW / 2) + 4, pillY + pillH);
                    ctx.stroke();

                    ctx.restore();
                }
            }

            function drawPlayer(ctx, p) {
                // --- NEW: VISUAL SHIELD EFEK (TONIC KEBAL) ---
                if (p.invincible) {
                    ctx.save();
                    const pulse = 1 + Math.sin(Date.now() / 100) * 0.1;
                    ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
                    ctx.scale(pulse, pulse);

                    ctx.strokeStyle = '#60a5fa'; // Cyan/Blue Shield
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, 25, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
                    ctx.fill();
                    ctx.restore();
                }

                // [MOVED] Indikator Keringat dipindah ke bawah setelah sprite digambar

                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.beginPath();
                ctx.ellipse(p.x + 10, p.y + 28, 10, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                let sprite = p.spriteIdle;

                // FIX: Mengganti touchState (yang tidak ada) menjadi inputState.active
                let isMoving = keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight'] ||
                    keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'] ||
                    inputState.active; // Gunakan inputState dari touch controls

                // UPDATE: Prioritas Sprite (Attack > Walk > Idle)
                if (p.isAttacking && p.spriteAttack) {
                    sprite = p.spriteAttack;
                } else if (isMoving) {
                    if (p.direction === 'up' && p.spriteWalkUp) {
                        sprite = p.spriteWalkUp;
                    }
                    else if (p.direction === 'down' && p.spriteWalkDown) {
                        sprite = p.spriteWalkDown;
                    } else {
                        sprite = p.spriteWalk;
                    }
                }

                if (sprite && sprite.complete && sprite.naturalWidth !== 0) {
                    ctx.save();
                    ctx.translate(p.x + p.w / 2, p.y + p.h / 2);

                    // --- NEW: DAMAGE BLINK EFFECT (HURT ANIMATION) ---
                    // Jika sedang sakit (hurtTimer > 0), buat efek berkedip merah
                    if (p.hurtTimer > 0) {
                        p.hurtTimer--; // Kurangi timer setiap frame

                        // Efek guncangan pada sprite
                        const shakeSprite = (Math.random() - 0.5) * 4;
                        ctx.translate(shakeSprite, 0);

                        // Efek Tint Merah (Composite Operation)
                        // Kita gambar sprite normal dulu, lalu tumpuk warna merah di atasnya
                        // Menggunakan globalAlpha untuk kedip
                        if (Math.floor(Date.now() / 50) % 2 === 0) {
                            ctx.globalAlpha = 0.7; // Sedikit transparan
                            // Note: Efek merah murni agak berat di performa canvas standard, 
                            // jadi kita pakai filter sederhana atau opacity + shake sudah cukup terasa.
                            // Jika browser support filter:
                            ctx.filter = 'sepia(1) hue-rotate(-50deg) saturate(5)'; // Merah pekat
                        }
                    }

                    if (!isMoving && !p.isAttacking) {
                        // UPDATE: Efek bernapas diperhalus (0.03 -> 0.015) agar tidak terlihat naik-turun drastis
                        const breathe = 1 + Math.sin(Date.now() / 300) * 0.015;
                        ctx.scale(1, breathe);
                    }

                    if (p.direction === 'left') ctx.scale(-1, 1);

                    if (p.isAttacking) {
                        ctx.drawImage(sprite, -32, -49, 64, 64);
                    } else {
                        // UPDATE: UKURAN PLAYER DISESUAIKAN KE 38x58 (Sesuai Request)
                        // Posisi X digeser -19 (setengah dari 38)
                        // Posisi Y digeser -46 agar kaki tetap menapak pas di bayangan (y+12 dari titik tengah)
                        ctx.drawImage(sprite, -19, -46, 38, 58);
                    }

                    ctx.restore();
                } else {
                    // ... fallback rendering ...
                    ctx.fillStyle = p.color || '#fbbf24';
                    if (p.hurtTimer > 0) ctx.fillStyle = '#ef4444'; // Merah jika sakit (fallback)
                    ctx.fillRect(p.x, p.y, 20, 20);
                    // ...
                }

                // --- UPDATE: VISUAL INDIKATOR STAMINA RENDAH (KERINGAT KECIL DI KEPALA) ---
                // Dipindah ke sini agar digambar DI DEPAN player
                if (p.energy <= 25) {
                    ctx.save();
                    // Animasi naik turun (bobbing)
                    const sweatBob = Math.sin(Date.now() / 200) * 2;

                    // Posisi relatif terhadap kepala (berdasarkan offset sprite visual)
                    // Sprite digambar di y-45 dari tengah, jadi kepala ada di sekitar y-35 dari tengah logic
                    // Kita taruh di dahi sebelah kanan
                    const headX = p.x + (p.w / 2) + 8; // Sedikit di kanan tengah wajah
                    const headY = p.y + (p.h / 2) - 38 + sweatBob; // Area dahi atas

                    ctx.translate(headX, headY);

                    ctx.fillStyle = '#38bdf8'; // Biru Muda (Air)

                    // Gambar Tetesan Keringat Vector Kecil (Manual Path)
                    ctx.beginPath();
                    ctx.arc(0, 0, 2.5, 0, Math.PI * 2); // Bulatan bawah (r=2.5)
                    ctx.moveTo(-2.5, -1);
                    ctx.lineTo(0, -6); // Lancip atas (seperti tetesan air jatuh)
                    ctx.lineTo(2.5, -1);
                    ctx.fill();

                    ctx.restore();
                }

                // --- NEW: HP BAR DI ATAS KEPALA (PREMIUM STYLE) ---
                // UPDATE: SEKARANG MUNCUL DI SEMUA LOKASI (TERMASUK DUNGEON)
                // Menghapus syarat 'if (STATE.location !== 'dungeon')' agar bar melayang selalu muncul
                {
                    // Posisi sedikit lebih tinggi dari kepala sprite (y-55)
                    const barW = 36;
                    const barH = 5;
                    const barX = p.x + 10 - barW / 2;
                    const barY = p.y - 55;

                    const hpPct = Math.max(0, p.hp / p.maxHp);

                    // Warna Dinamis (Hijau -> Kuning -> Merah)
                    let colTop, colBot;
                    if (hpPct > 0.5) { colTop = '#4ade80'; colBot = '#15803d'; } // Hijau Sehat
                    else if (hpPct > 0.25) { colTop = '#facc15'; colBot = '#a16207'; } // Kuning Waspada
                    else { colTop = '#ef4444'; colBot = '#7f1d1d'; } // Merah Bahaya

                    ctx.save();

                    // 1. Shadow Background (Hitam semi-transparan untuk outline)
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    // Gambar background sedikit lebih besar dari bar (+1px border effect)
                    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

                    // 2. Bar Kosong (Abu gelap)
                    ctx.fillStyle = '#334155';
                    ctx.fillRect(barX, barY, barW, barH);

                    if (hpPct > 0) {
                        // 3. Gradient Fill
                        const grad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
                        grad.addColorStop(0, colTop);
                        grad.addColorStop(1, colBot);

                        ctx.fillStyle = grad;
                        const fillW = Math.max(0, barW * hpPct);
                        ctx.fillRect(barX, barY, fillW, barH);

                        // 4. Efek Shine (Kilap di separuh atas)
                        ctx.fillStyle = 'rgba(255,255,255,0.25)';
                        ctx.fillRect(barX, barY, fillW, barH / 2);
                    }

                    // 5. Border Halus
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(barX - 0.5, barY - 0.5, barW + 1, barH + 1);

                    ctx.restore();
                }

                // --- UPDATE: MARKER SEGITIGA (Lebih Tinggi Lagi menyesuaikan Bar baru) ---
                // Marker digeser ke y-68 agar aman di atas HP Bar
                const floatY = Math.sin(Date.now() / 150) * 5;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.moveTo(p.x + 10, p.y - 68 + floatY); // Ujung Bawah
                ctx.lineTo(p.x + 5, p.y - 78 + floatY);  // Kiri Atas
                ctx.lineTo(p.x + 15, p.y - 78 + floatY); // Kanan Atas
                ctx.fill();

                // Shadow/Glow Marker
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;

                if (p.isAttacking) {
                    ctx.save();
                    ctx.translate(p.x + 10, p.y + 10);
                    ctx.rotate(p.direction === 'left' ? -1.5 : 1.5);
                    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(0, 0, 25, -0.5, 0.5); ctx.stroke();
                    ctx.restore();
                }

                // --- DRAW PET FOLLOWER ---
                if (STATE.screen === 'play') drawPetFollower(ctx, p);
            }

            // --- NEW FUNCTION: DRAW GHOST (PEMAIN LAIN & BOT) ---
            function drawGhost(ctx, g) {
                // 1. Setup Visual Hantu (Transparan)
                ctx.save();
                ctx.globalAlpha = 0.6; // Setengah transparan agar terlihat seperti hantu/bayangan

                // Tentukan Posisi
                // (Data hantu x,y adalah koordinat murni dari database)
                const gx = g.x;
                const gy = g.y;

                // 2. Gambar Sprite (Sesuai Gender & Outfit)
                // Kita gunakan logika suffix yang sama dengan player untuk baju
                let suffix = "";
                if (g.outfit === 'wedding') suffix = "-weding";
                else if (g.outfit === 'armor') suffix = "-armor";
                else if (g.outfit === 'special') suffix = "-special";

                let spriteSrc = `images/${g.gender}-idle${suffix}.png`;

                // Karena kita tidak bisa load image sync di sini, kita coba buat Image object baru
                // Browser biasanya mengambil dari cache jika sudah pernah diload player
                const img = new Image();
                img.src = spriteSrc;

                // Default ukuran player
                const pW = 38;
                const pH = 58;

                if (img.complete && img.naturalWidth !== 0) {
                    // Gambar sprite hantu
                    // Offset disesuaikan (-19, -46) agar kaki pas di titik y
                    ctx.drawImage(img, gx, gy - 46, pW, pH);
                } else {
                    // Fallback jika gambar belum siap: Kotak Putih Hantu
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(gx, gy - 20, 20, 20);
                }

                // 3. Gambar Nama (Nametag)
                ctx.globalAlpha = 0.8; // Nama lebih jelas dikit
                ctx.font = 'bold 10px "Exo 2"';
                ctx.textAlign = 'center';

                // Background nama
                const textW = ctx.measureText(g.name).width;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(gx + 10 - (textW / 2) - 4, gy - 60, textW + 8, 14);

                // Teks Nama - UPDATE: Beda Warna untuk Bot vs Real Player
                if (g.isBot) {
                    ctx.fillStyle = '#38bdf8'; // Biru Cyan (Bot)
                } else {
                    ctx.fillStyle = '#4ade80'; // Hijau Terang (Manusia Asli)
                }
                ctx.fillText(g.name, gx + 10, gy - 50);

                // Indikator kecil untuk Real Player
                if (!g.isBot) {
                    ctx.font = '8px Arial';
                    ctx.fillStyle = '#fbbf24'; // Emas
                    ctx.fillText("● ONLINE", gx + 10, gy - 38);
                } else {
                    // Opsional: Label Bot
                    // ctx.font = '8px Arial';
                    // ctx.fillStyle = '#94a3b8';
                    // ctx.fillText("[NPC]", gx + 10, gy - 38);
                }

                ctx.restore();
            }

            // --- FIX: MENAMBAHKAN FUNGSI DRAW NPC YANG HILANG ---
            function drawNPC(ctx, n) {
                // 1. Cek Apakah NPC Aktif (Sesuai Jadwal/Syarat)
                // Jika tidak aktif, jangan gambar apapun
                if (!isNPCActive(n)) return;

                const x = n.x * TILE_SIZE;
                const y = n.y * TILE_SIZE;

                // UPDATE: Gunakan ukuran Custom jika ada, default 32x48
                const dw = n.w || 32;
                const dh = n.h || 48;

                // 2. Gambar Bayangan (Dinamis mengikuti ukuran)
                // Bayangan tetap di tanah (y asli) meskipun NPC melayang
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.beginPath();
                ctx.ellipse(x + dw / 2, y + dh - 5, dw / 3, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                // --- Floating effect untuk fairy NPCs dan dewi_roro ---
                // Rara Wilis: efek nafas saja (tidak naik-turun), yang lain tetap melayang
                let visualY = y;
                if (n.id === 'rara_wilis') {
                    // Tidak ada offset Y — Rara Wilis berdiri di tanah
                    // Efek nafas ditangani lewat alpha/scale saat render
                } else if (n.id === 'dewi_roro' || n.type === 'fairy_npc') {
                    const floatOffset = Math.sin(Date.now() / 500) * 5 - 8;
                    visualY = y + floatOffset;
                }

                // 3. Load & Gambar Sprite NPC
                // Support n.sprite (fairy NPCs) sebagai alias n.imgSrc
                if (!n.imgSrc && n.sprite) n.imgSrc = n.sprite;
                if (!n.loadedImg) {
                    n.loadedImg = new Image();
                    n.loadedImg.src = n.imgSrc || 'images/girl-idle.png';

                    // --- NEW: FALLBACK GAMBAR NPC JIKA GAGAL LOAD ---
                    n.loadedImg.onerror = function () {
                        this.onerror = null;
                        if (n.id === 'pohon_energi') this.src = 'images/pohonperi.png';
                        else if (n.id === 'rara_wilis') this.src = 'images/rarawilis.png';
                        else if (n.id === 'fv_wening' || n.id === 'peri_kecil_1') this.src = 'images/wening.png';
                        else if (n.id === 'fv_sekar'  || n.id === 'peri_kecil_2') this.src = 'images/sekar.png';
                        else if (n.id === 'fv_bening' || n.id === 'peri_kecil_3') this.src = 'images/bening.png';
                        else if (n.id === 'fv_juna') this.src = 'images/juna.png';
                        else if (n.id.includes('kaia')) this.src = 'images/girl-idle.png';
                        else if (n.id.includes('child')) this.src = 'images/boy-idle.png';
                        else if (n.id.includes('lover1girl')) this.src = 'images/girl.png';
                        else this.src = 'images/boy.png';
                        console.warn(`Fallback image loaded for NPC: ${n.name}`);
                    };
                }

                if (n.loadedImg.complete && n.loadedImg.naturalWidth !== 0) {
                    ctx.save();

                    // --- NEW: EFEK CAHAYA BULAN (KHUSUS DEWI ARSA) ---
                    if (n.id === 'dewi_arsa') {
                        // A. Aura Lingkaran Bercahaya (Gradient)
                        const cx = x + dw / 2;
                        const cy = visualY + dh / 2; // Gunakan visualY
                        const pulse = 1 + Math.sin(Date.now() / 600) * 0.15; // Denyut cahaya pelan

                        // Gradient: Putih Terang -> Kuning Pucat -> Transparan
                        const grad = ctx.createRadialGradient(cx, cy, 15, cx, cy, 55 * pulse);
                        grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
                        grad.addColorStop(0.5, 'rgba(254, 240, 138, 0.25)'); // Kuning rembulan
                        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 60, 0, Math.PI * 2);
                        ctx.fill();

                        // B. Efek Kilauan Bintang (Sparkles)
                        // Muncul acak di sekitar area tubuh
                        if (Math.random() < 0.3) { // 30% chance per frame render
                            ctx.fillStyle = '#fff';
                            // Random posisi di sekitar NPC
                            const sx = x + (Math.random() * dw * 1.5) - (dw * 0.25);
                            const sy = visualY + (Math.random() * dh * 1.2) - (dh * 0.1);

                            // Gambar bintang kecil (Cross shape)
                            const size = Math.random() * 3;
                            ctx.fillRect(sx, sy, size, 1);
                            ctx.fillRect(sx + (size / 2) - 0.5, sy - (size / 2) + 0.5, 1, size);
                        }

                        // C. Glow pada Sprite Karakter
                        ctx.shadowColor = '#fef08a'; // Kuning Muda Bercahaya
                        ctx.shadowBlur = 25;
                    }

                    // --- NEW: EFEK CAHAYA BUNGA & SPIRIT (KHUSUS DEWI RORO) ---
                    if (n.id === 'dewi_roro') {
                        // A. Aura Suci (Pink & Putih Lembut)
                        const cx = x + dw / 2;
                        const cy = visualY + dh / 2; // Aura mengikuti posisi melayang
                        const pulse = 1 + Math.sin(Date.now() / 400) * 0.1; // Denyut lebih cepat

                        const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 50 * pulse);
                        grad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
                        grad.addColorStop(0.6, 'rgba(244, 114, 182, 0.3)'); // Pink lembut
                        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 55, 0, Math.PI * 2);
                        ctx.fill();

                        // B. Spawn Partikel Bunga & Spirit Melayang
                        if (Math.random() < 0.2) { // 20% chance per frame
                            // Random: Kadang bunga (Note Icon), Kadang Spirit Orb (Lingkaran)
                            const pType = Math.random() < 0.3 ? 'note' : 'spirit_aura';

                            STATE.particles.push({
                                x: cx + (Math.random() * 50 - 25),
                                y: cy + (Math.random() * 60 - 20),
                                vx: (Math.random() - 0.5) * 0.3, // Goyang horizontal pelan
                                vy: -0.5 - Math.random(), // Naik ke atas
                                life: 80,
                                color: pType === 'note' ? '#fbcfe8' : '#ffffff', // Bunga Pink atau Spirit Putih
                                type: pType,
                                icon: '🌸', // Icon Bunga jika type note
                                size: pType === 'note' ? 10 : (2 + Math.random() * 3) // Ukuran Orb
                            });
                        }

                        // C. Glow Pink pada Karakter
                        ctx.shadowColor = '#f9a8d4'; // Pink Glow
                        ctx.shadowBlur = 20;
                    }

                    // --- BIRTHDAY CAKE ICON ABOVE NPC ON THEIR BIRTHDAY ---
                    if (isNpcBirthdayToday(n.id)) {
                        ctx.save();
                        const floatY = Math.sin(Date.now() / 350) * 4;
                        ctx.font = '18px Arial';
                        ctx.textAlign = 'center';
                        ctx.shadowColor = 'rgba(255,220,0,0.9)';
                        ctx.shadowBlur = 8;
                        ctx.fillText('🎂', x + dw / 2, visualY - 10 + floatY);
                        ctx.restore();
                    }

                    // --- NEW: RENDER IKON HATI DI ATAS KEPALA PASANGAN (JIKA MENIKAH) ---
                    if (STATE.player.married && STATE.player.spouseId === n.id) {
                        ctx.save();
                        const floatY = Math.sin(Date.now() / 400) * 3; // Animasi naik turun halus

                        ctx.font = '16px Arial';
                        ctx.textAlign = 'center';
                        ctx.shadowColor = 'rgba(255,255,255,0.8)';
                        ctx.shadowBlur = 5;

                        // Gambar Hati di atas kepala (y - 20 dari posisi kaki - tinggi sprite)
                        // Tinggi sprite rata-rata ~50px
                        ctx.fillText('💖', x + dw / 2, visualY - dh + 10 + floatY);

                        ctx.restore();
                    }

                    // UPDATE: Logika Animasi (Static vs Moving)
                    // --- EFEK NAFAS & AURA (KHUSUS RARA WILIS) ---
                    if (n.id === 'rara_wilis') {
                        const cx = x + dw / 2;
                        const cy = visualY + dh / 2;
                        // Denyut aura: sangat pelan seperti nafas
                        const breathPulse = 1 + Math.sin(Date.now() / 1200) * 0.12;
                        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 45 * breathPulse);
                        grad.addColorStop(0, 'rgba(216, 180, 254, 0.45)');   // Ungu lembut
                        grad.addColorStop(0.6, 'rgba(167, 139, 250, 0.2)');
                        grad.addColorStop(1, 'rgba(216, 180, 254, 0)');
                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 50, 0, Math.PI * 2);
                        ctx.fill();
                        // Kilau bintang kecil sesekali
                        if (Math.random() < 0.2) {
                            ctx.fillStyle = 'rgba(255,255,255,0.85)';
                            const sx3 = x + (Math.random() * dw * 1.4) - (dw * 0.2);
                            const sy3 = visualY + (Math.random() * dh * 1.1) - (dh * 0.05);
                            ctx.beginPath(); ctx.arc(sx3, sy3, Math.random()*2+0.5, 0, Math.PI*2); ctx.fill();
                        }
                        ctx.shadowColor = '#c4b5fd';
                        ctx.shadowBlur = 18;
                    }

                    // Semua NPC Darat (Static, Wander, Animal) sekarang menggunakan efek BERNAFAS yang sama
                    if (n.type !== 'swimmer') {
                        // Efek Bernapas: Scale Y berubah sedikit (1.0 hingga 1.02) agar terlihat hidup
                        const breathe = 1 + Math.sin(Date.now() / 300) * 0.02;

                        // Brightness seperti player untuk peri kecil
                        const isFairySmall = ['fv_wening','fv_sekar','fv_bening','fv_juna',
                                              'peri_kecil_1','peri_kecil_2','peri_kecil_3'].includes(n.id);
                        if (isFairySmall) ctx.filter = 'brightness(1.25) saturate(1.1)';

                        // Set Pivot ke Kaki Tengah agar tumbuh ke atas (menapak tanah)
                        ctx.translate(Math.round(x + dw / 2), Math.round(visualY + dh - 5));
                        ctx.scale(1, breathe);

                        // Cek Arah Gerak untuk Flip Horizontal
                        if (n.vx < 0) {
                            ctx.scale(-1, 1); // Hadap Kiri
                        }

                        // Gambar Image (Offset negatif karena pivot ada di bawah tengah)
                        ctx.drawImage(n.loadedImg, -dw / 2, -dh, dw, dh);

                        // Reset filter setelah draw peri
                        if (isFairySmall) ctx.filter = 'none';
                    }
                    else {
                        // Khusus NPC Perenang (Swimmer): Tetap mengapung (bobbing) di air
                        const animY = Math.sin(Date.now() / 300) * 2;

                        const drawY = y - 5 + animY;

                        if (n.vx < 0) {
                            ctx.translate(x + dw, drawY);
                            ctx.scale(-1, 1);
                            ctx.drawImage(n.loadedImg, 0, 0, dw, dh);
                        } else {
                            ctx.drawImage(n.loadedImg, x, drawY, dw, dh);
                        }
                    }

                    ctx.restore();
                } else {
                    // Fallback: Kotak Warna jika gambar belum load
                    ctx.fillStyle = '#fca5a5';
                    ctx.fillRect(x + 5, y, dw - 10, dh - 10);
                }

                // Sparkle efek di atas fairy NPC (dialogFn)
                if (n.dialogFn && Math.random() < 0.15) {
                    ctx.fillStyle = 'rgba(255,220,255,0.8)';
                    const sx2 = x + Math.random() * dw;
                    const sy2 = visualY - Math.random() * 20;
                    ctx.beginPath(); ctx.arc(sx2, sy2, 1.5, 0, Math.PI*2); ctx.fill();
                }

                // 4. Nama NPC Fairy (Tampilkan di atas kepala) — skip jika noNameTag
                if (n.dialogFn && !n.noNameTag) {
                    // Nametag pakai posisi y TETAP (bukan visualY) agar tidak ikut naik-turun
                    const nw2 = Math.max(50, (n.name || 'NPC').length * 7 + 10);
                    const ncx = x + dw/2;
                    const ncy2 = y + 4;  // posisi tetap, tidak ikut float
                    ctx.fillStyle = 'rgba(0,0,0,0.65)';
                    ctx.beginPath();
                    if(ctx.roundRect) ctx.roundRect(ncx-nw2/2, ncy2-12, nw2, 14, 4);
                    else ctx.rect(ncx-nw2/2, ncy2-12, nw2, 14);
                    ctx.fill();
                    ctx.fillStyle = '#fde68a';
                    ctx.font = 'bold 9px Nunito,Fredoka,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(n.name || '', ncx, ncy2 - 5);
                    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';

                    // Tanda "!" saat player dekat
                    const pCX2 = STATE.player.x + (STATE.player.w||38)/2;
                    const pCY2 = STATE.player.y + (STATE.player.h||58)/2;
                    const nDist = Math.hypot(pCX2 - (x + dw/2), pCY2 - (visualY + dh/2));
                    if (nDist < 90) {
                        const floatY2 = Math.sin(Date.now() / 200) * 3;
                        ctx.fillStyle = '#fbbf24';
                        ctx.font = 'bold 16px serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('!', ncx, ncy2 - 22 + floatY2);
                        ctx.textAlign = 'left';
                    }
                } else if (n.dialogFn && n.noNameTag) {
                    // Hanya tanda "!" saat player dekat — tanpa nametag
                    const pCX2 = STATE.player.x + (STATE.player.w||38)/2;
                    const pCY2 = STATE.player.y + (STATE.player.h||58)/2;
                    const nDist = Math.hypot(pCX2 - (x + dw/2), pCY2 - (visualY + dh/2));
                    if (nDist < 90) {
                        const ncx = x + dw/2;
                        const ncy2 = y + 4;
                        const floatY2 = Math.sin(Date.now() / 200) * 3;
                        ctx.fillStyle = '#fbbf24';
                        ctx.font = 'bold 16px serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('!', ncx, ncy2 - 22 + floatY2);
                        ctx.textAlign = 'left';
                    }
                }

                // 4b. Nama Warga Biasa & Indikator Quest
                /* UPDATE: LABEL NAMA NPC DIHILANGKAN SESUAI REQUEST (CUKUP BANGUNAN SAJA) */
                /*
                ctx.font = 'bold 8px "Exo 2"';
                ctx.textAlign = 'center';
                
                // Stroke Hitam untuk nama agar terbaca
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.strokeText(n.name, x + dw/2, y - 8);
                
                ctx.fillStyle = '#fff';
                ctx.fillText(n.name, x + dw/2, y - 8);
                */

                // Indikator Quest/Interaksi (Tanda Seru) jika dekat
                // Opsional: Bisa ditambahkan logika jarak jika ingin

                // ─── MENTOR NOTIFICATION BUBBLE ─────────────────────────
                if (n.id === 'mentor' && window._mentorBubble) {
                    const bx = x + dw / 2;
                    const by = visualY - dh - 14;
                    const pulse = 0.85 + Math.sin(Date.now() / 350) * 0.15; // denyut
                    ctx.save();
                    ctx.translate(bx, by);
                    ctx.scale(pulse, pulse);

                    // Balon
                    ctx.fillStyle   = window._mentorBubble.color || '#fbbf24';
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth   = 1.5;
                    ctx.beginPath();
                    ctx.roundRect(-14, -14, 28, 22, 6);
                    ctx.fill();
                    ctx.stroke();

                    // Ekor balon kecil ke bawah
                    ctx.beginPath();
                    ctx.moveTo(-4, 8); ctx.lineTo(0, 16); ctx.lineTo(4, 8);
                    ctx.closePath(); ctx.fill();

                    // Ikon teks
                    ctx.font      = 'bold 12px serif';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'white';
                    ctx.shadowColor = 'rgba(0,0,0,0.4)';
                    ctx.shadowBlur  = 3;
                    ctx.fillText(window._mentorBubble.icon || '!', 0, 2);

                    ctx.restore();
                }
            }

            // --- FIX: MENAMBAHKAN FUNGSI DRAW ENEMY YANG HILANG (INI PENYEBAB MONSTER INVISIBLE) ---
            function drawEnemy(ctx, e) {
                // 1. Gambar Bayangan
                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.beginPath();
                ctx.ellipse(e.x + e.w / 2, e.y + e.h - 2, e.w / 2 - 5, 5, 0, 0, Math.PI * 2);
                ctx.fill();

                // 2. Efek Hit Flash (Kedip saat dipukul)
                if (e.hp < e.maxHp && Math.random() < 0.1) {
                    ctx.globalAlpha = 0.7; // Transparan sebentar
                }

                // 3. Tentukan Gambar Monster (Berdasarkan Tier/Boss)
                let img = null;

                // Cek apakah monster punya key gambar spesifik (enemy1, enemy2, dst)
                if (e.imgKey && dungeonAssets[e.imgKey]) {
                    img = dungeonAssets[e.imgKey];
                }
                // Fallback untuk Boss
                else if (e.isBoss) {
                    img = dungeonAssets.boss;
                }
                // Fallback default
                else {
                    img = dungeonAssets.enemy1;
                }

                if (img && img.complete && img.naturalWidth !== 0) {
                    ctx.save();

                    // Efek Bernapas/Wobble Monster (Agar terlihat hidup)
                    const wobble = Math.sin(Date.now() / 150 + e.animOffset) * 0.05;
                    const scaleX = 1 + wobble;
                    const scaleY = 1 - wobble;

                    // Pivot di tengah monster
                    const cx = e.x + e.w / 2;
                    const cy = e.y + e.h / 2;

                    ctx.translate(cx, cy);
                    // Flip jika musuh bergerak ke kiri (mengejar player di kiri)
                    // Hitung arah berdasarkan posisi player relative
                    if (STATE.player.x < e.x) ctx.scale(-scaleX, scaleY);
                    else ctx.scale(scaleX, scaleY);

                    // Gambar sprite
                    // Pastikan drawImage menggunakan ukuran e.w dan e.h
                    ctx.drawImage(img, -e.w / 2, -e.h / 2, e.w, e.h);

                    ctx.restore();
                } else {
                    // Fallback: Kotak Merah jika gambar gagal load
                    ctx.fillStyle = e.color || '#ef4444';
                    ctx.fillRect(e.x, e.y, e.w, e.h);
                }

                ctx.globalAlpha = 1.0; // Reset Alpha

                // 4. HP Bar Monster
                const hpPct = Math.max(0, e.hp / e.maxHp);
                const barW = e.w;
                const barH = 4;

                // Background Bar
                ctx.fillStyle = '#000';
                ctx.fillRect(e.x, e.y - 10, barW, barH);

                // Fill Bar
                ctx.fillStyle = e.isBoss ? '#b91c1c' : '#fbbf24'; // Merah tua utk Boss, Kuning utk Kroco
                ctx.fillRect(e.x, e.y - 10, barW * hpPct, barH);
            }

            // --- NEW FUNCTION: RENDER INVENTORY (DENGAN ACTION KLIK) ---
            function renderInventory() {
                const grid = document.getElementById('inventory-grid');
                grid.innerHTML = '';

                const inv = STATE.player.inventory || {};
                let hasItem = false;

                // DATABASE ITEM UPDATE: Tambahkan Item Dungeon & Legendary & Consumables
                const ITEM_DB = {
                    // --- NEW: ITEM IJAZAH SARJANA ---
                    'ijazah_teknologi': { name: 'Ijazah S.Kom', icon: '🎓', desc: 'Bukti kelulusan Sarjana Teknologi.', img: 'images/ijazah-teknologi.png' },
                    'ijazah_sejarah': { name: 'Ijazah S.Hum', icon: '📜', desc: 'Bukti kelulusan Sarjana Sejarah.', img: 'images/ijazah-sejarah.png' },

                    // --- NEW: ITEM SERTIFIKAT PEKERJA ---
                    'sertifikat_manajer': { name: 'Sertifikat Profesi', icon: '👔', desc: 'Sertifikat Kompetensi Manajer Profesional (BNSP).', img: 'images/sertifikat-manajer.png' },
                    // --- [FIX] BIBIT RAFFLESIA (AGAR BISA DITANAM) ---
                    'bibit_rafflesia': {
                        name: 'Bibit Rafflesia',
                        icon: '🌰',
                        type: 'consumable',
                        action: 'plant_rafflesia', // <--- PENTING: Aksi menanam
                        desc: 'Bibit bunga legendaris. Tanam di ladang.',
                        img: 'images/biji.png'
                    },
                    // --- NEW: BUNGA RAFFLESIA ARNOLDI (HASIL PANEN) ---
                    'bunga_rafflesia': {
                        name: 'Rafflesia Arnoldi',
                        icon: '🌺',
                        desc: 'Pusaka Alam Legendaris. Hasil panen yang sangat mahal.',
                        img: 'images/rafflesia.png'
                    },


                    // --- UPDATE: IKAN-IKAN BARU ---
                    'ikan_kecil': { name: 'Ikan Kecil', img: 'images/ikankecil.png', type: 'consumable', action: 'eat_fish_small', desc: 'Makan: +10 Energi. Ikan mungil biasa.' },
                    'ikan_sedang': { name: 'Ikan Sedang', img: 'images/ikansedang.png', type: 'consumable', action: 'eat_fish_medium', desc: 'Makan: +25 Energi. Lumayan mengenyangkan.' },
                    'ikan_besar': { name: 'Ikan Besar', img: 'images/ikanbesar.png', type: 'consumable', action: 'eat_fish_large', desc: 'Makan: +50 Energi. Ikan tangkapan mantap!' },
                    'ikan_legendary': { name: 'Ikan Legendaris', img: 'images/ikanlegendary.png', type: 'consumable', action: 'eat_fish_legend', desc: 'Makan: FULL Energi. Sangat langka & mahal!' },

                    // Komoditas & Makanan (Sekarang Bisa Dimakan!)
                    'ikan_segar': { name: 'Ikan Bakar', icon: '🐟', type: 'consumable', action: 'eat_fish', desc: 'Makan: Energi +15' }, // Legacy item
                    'gandum': { name: 'Roti Gandum', icon: '🍞', type: 'consumable', action: 'eat_bread', desc: 'Makan: Energi +20' },
                    'coklat': { name: 'Coklat Bar', icon: '🍫', type: 'consumable', action: 'eat_choco', desc: 'Ngemil: Energi +10' },

                    // --- MAKANAN SIAP MAKAN (Beli di pedagang / merchant) ---
                    'nasi_bungkus': { name: 'Nasi Bungkus', icon: '🍱', type: 'consumable', action: 'eat_nasi_bungkus', desc: 'Makan: Energi +30. Nasi hangat dari warung.' },
                    'telor': { name: 'Telur Ayam', icon: '🥚', type: 'consumable', action: 'eat_telor', desc: 'Bahan masak atau dimakan langsung: Energi +12.' },
                    'tempe': { name: 'Tempe Mentah', icon: '🟫', type: 'consumable', action: 'eat_tempe', desc: 'Bahan masak bergizi. Protein nabati murah meriah.' },
                    'obat': { name: 'Obat Generik', icon: '💊', type: 'consumable', action: 'use_obat', desc: 'Sembuhkan HP +30 saat sakit.' },

                    'kain': { name: 'Kain Sutra', icon: '🧵', desc: 'Bahan tekstil halus.' },
                    'bunga': { name: 'Bunga', icon: '🌹', desc: 'Hadiah romantis.' },

                    // Item Dungeon (Tiered)
                    'besi': { name: 'Bijih Besi', icon: '⛓️', desc: 'Material dasar (Rare).' },
                    'permata': { name: 'Berlian', icon: '💎', desc: 'Batu mulia (Epic).' },
                    'scroll_exp': { name: 'Gulungan Kuno', icon: '📜', desc: 'Berisi ilmu kuno (+EXP).' },

                    // Legendary Boss Drops
                    'zirah_legend': { name: 'Zirah Abadi', icon: '🛡️', desc: 'Armor Legendaris (Pasif: Def++).' },
                    'cincin_legend': { name: 'Cincin Raja', icon: '💍', desc: 'Cincin Legendaris (Pasif: Gold++).' },

                    // --- NEW: ITEM VIRAL (SOSMED TRENDS) ---
                    'kerupuk_mentah': { name: 'Kerupuk Mentah', icon: '⚪', desc: 'Bahan Seblak Viral. Jual ke Merchant saat tren!' },
                    'biji_kopi': { name: 'Biji Kopi', icon: '🫘', desc: 'Bahan Kopi Senja. Wangi aromanya.' },
                    'bola_plastik': { name: 'Lato-lato', icon: '🧶', desc: 'Mainan viral. Tek tek tek!' },
                    'adonan_pastry': { name: 'Adonan Croffle', icon: '🥐', desc: 'Bahan kue Croffle kekinian.' },

                    // NEW: ITEM BIBIT PERTANIAN (UPDATE: DIBUAT CONSUMABLE)
                    'bibit_padi': { name: 'Bibit Padi', icon: '🌾', type: 'consumable', action: 'plant_padi', desc: 'Tanam di lahan. Panen jadi Beras.' },
                    'bibit_jagung': { name: 'Bibit Jagung', icon: '🌽', type: 'consumable', action: 'plant_jagung', desc: 'Bibit jagung manis unggulan. Panen jadi Jagung.' },
                    'bibit_tomat': { name: 'Bibit Tomat', icon: '🍅', type: 'consumable', action: 'plant_tomat', desc: 'Cepat tumbuh dan segar. Panen jadi Tomat.' },
                    'pupuk': { name: 'Pupuk', icon: '💩', type: 'consumable', action: 'use_pupuk', desc: 'Mempercepat pertumbuhan tanaman.' },

                    // --- HASIL PANEN PERTANIAN ---
                    'beras': { name: 'Beras', icon: '🌾', type: 'consumable', action: 'eat_rice', desc: 'Makan: Energi +25. Hasil panen padi.' },
                    'jagung_panen': { name: 'Jagung', icon: '🌽', type: 'consumable', action: 'eat_corn', desc: 'Makan: Energi +20. Hasil panen jagung.' },
                    'tomat_panen': { name: 'Tomat', icon: '🍅', type: 'consumable', action: 'eat_tomato', desc: 'Makan: Energi +15. Hasil panen tomat.' },

                    // NEW: ITEM CINCIN KAYU (ROLE FAMILY)
                    'cincin_kayu': { name: 'Cincin Kayu', icon: '💍', desc: 'Cincin sederhana untuk melamar pasangan.' },
                    // NEW: ITEM PAKAIAN NIKAH (ROLE FAMILY)
                    'pakaian_nikah': { name: 'Baju Pengantin', icon: '👘', desc: 'Busana sakral untuk akad nikah.' },

                    // --- DOKUMEN LAMARAN KERJA ---
                    'ijazah':            { name: 'Ijazah SMA/SMK',       icon: '🎓', desc: 'Bukti kelulusan sekolah. Wajib saat melamar kerja.' },
                    'cv':                { name: 'Curriculum Vitae',      icon: '📋', desc: 'Riwayat hidup & keahlian. Buat di Meja Belajar (500G).' },
                    'foto_3x4':          { name: 'Pas Foto 3×4',          icon: '📸', desc: 'Foto formal 3×4. Dilampirkan saat melamar.' },
                    'ktp':               { name: 'Fotokopi KTP',           icon: '🪪', desc: 'Identitas resmi. Beli di Merchant.' },
                    'surat_sehat':       { name: 'Surat Keterangan Sehat', icon: '🏥', desc: 'Dari Dr. Budi. Wajib untuk melamar di Klinik.' },
                    'skck':              { name: 'SKCK',                   icon: '🚔', desc: 'Surat Kelakuan Baik dari Kepolisian.' },
                    'sertifikat':        { name: 'Sertifikat Keahlian',    icon: '🏆', desc: 'Nilai tambah saat melamar kerja.' },
                    'portofolio':        { name: 'Portofolio Karya',       icon: '🗂️', desc: 'Kumpulan karya untuk melamar di bidang kreatif.' },
                    // Amplop Lamaran (hasil minigame meja belajar)
                    'amplop_merchant':      { name: 'Amplop Lamaran — Merchant',  icon: '📨', desc: '⚠️ Serahkan HANYA ke Pak Hendra di Toko Merchant!' },
                    'amplop_blacksmith':    { name: 'Amplop Lamaran — Bengkel',   icon: '📨', desc: '⚠️ Serahkan HANYA ke Bang Joko di Bengkel!' },
                    'amplop_marine_tailor': { name: 'Amplop Lamaran — Butik',     icon: '📨', desc: '⚠️ Serahkan HANYA ke Bu Marine di Butik!' },
                    'amplop_lover1boy':     { name: 'Amplop Lamaran — Klinik',    icon: '📨', desc: '⚠️ Serahkan HANYA ke Dr. Budi di Klinik!' },

                    // Consumables (Bisa Dipakai)
                    'tonic_stamina': { name: 'Tonic Stamina', icon: '⚡🧪', type: 'consumable', action: 'useStamina', desc: 'Pulihkan 100% Energi.' },
                    'tonic_kebal': { name: 'Tonic Kebal', icon: '🛡️🧪', type: 'consumable', action: 'useImmune', desc: 'Kebal serangan 10 detik.' },

                    // Quest Items (Gambar Dinamis via Logic di bawah)
                    'draft_proposal': { name: 'Draft Skripsi', icon: '📑', desc: 'Bahan proposal (Quest Tahun 3).' },
                    'buku_tesis': { name: 'Buku Tesis', icon: '📖', desc: 'Syarat kelulusan.' },

                    // ══════════════════════════════════════════════════════════
                    // 📜 ITEM EKSKLUSIF — KISAH LELUHUR LAMONGAN
                    // Reward khusus dari side quest folktale Ki Lamong
                    // ══════════════════════════════════════════════════════════
                    'gulungan_mbahlamong': {
                        name: 'Gulungan Mbah Lamong',
                        icon: '📜',
                        type: 'consumable',
                        action: 'baca_gulungan_mbahlamong',
                        desc: 'Tulisan bijak Mbah Lamong. Dibaca: INT+5 permanen (sekali saja).'
                    },
                    'kalung_nelayan': {
                        name: 'Kalung Nelayan Brondong',
                        icon: '🪬',
                        desc: 'Kalung keberuntungan dari Ki Lamong. Pasif: Chance ikan langka +10% saat memancing.'
                    },
                    'keris_penjaga': {
                        name: 'Keris Penjaga Cerita',
                        icon: '⚔️',
                        desc: 'Keris pusaka Ki Lamong. Reward menyelesaikan semua 4 Kisah Leluhur. Pasif: +5 semua stat. Kunci portal Kahyangan Wilis.'
                    },
                    'kalung_mutiara_laut': {
                        name: 'Kalung Mutiara Laut',
                        icon: '🪬',
                        desc: 'Kalung leluhur para peri laut. Tersimpan di palung gelap dungeon. Quest Putri Duyung.'
                    },
                    'cahaya_arsa': {
                        name: 'Cahaya Arsa',
                        icon: '✨',
                        desc: 'Cahaya kebijaksanaan dari Dewi Arsa. Reward kunjungan ke-3 Kahyangan Wilis. Dibutuhkan untuk Ritual Pemulihan Kahyangan Wilis.'
                    },
                    'mahkota_wilis': {
                        name: 'Mahkota Wilis',
                        icon: '👑',
                        desc: 'Mahkota emas-zamrud milik Ratu Widadari Rara Wilis. Diberikan sebagai tanda Bhayangkara Kahyangan Wilis. Pasif: semua stat +10.',
                        use: () => { showToast("Mahkota Wilis bersinar hangat... Kamu adalah Bhayangkara Kahyangan Wilis yang diakui. Matur nuwun! ✨"); }
                    },
                    'kristal_roro': {
                        name: 'Kristal Roro',
                        icon: '💎',
                        desc: 'Kristal biru dari Dewi Roro. Tanda terima kasih atas laporan mekarnya Rafflesia. Kualitas magic tinggi.'
                    }
                };

                for (let key in inv) {
                    if (inv[key] > 0) {
                        hasItem = true;
                        // Clone objek agar tidak merubah DB asli saat modifikasi dinamis
                        let itemData = { ...(ITEM_DB[key] || { name: key.toUpperCase(), icon: '📦', desc: 'Item.' }) };

                        // --- LOGIKA GAMBAR DINAMIS BERDASARKAN JURUSAN ---
                        const major = STATE.player.major || 'teknologi';

                        // 1. UPDATE IMAGE BUKU TESIS
                        if (key === 'buku_tesis') {
                            if (major === 'sejarah') {
                                itemData.img = 'images/buku-tesis-sejarah.png';
                                itemData.name = 'Tesis Sejarah';
                            } else {
                                itemData.img = 'images/buku-tesis-teknologi.png';
                                itemData.name = 'Tesis Teknologi';
                            }
                        }

                        // 2. UPDATE IMAGE DRAFT PROPOSAL (Konsistensi dengan Dialog)
                        if (key === 'draft_proposal') {
                            if (major === 'sejarah') {
                                itemData.img = 'images/draftskripsi-sejarah.png';
                            } else {
                                itemData.img = 'images/draftskripsi-teknologi.png';
                            }
                        }

                        const div = document.createElement('div');
                        div.className = 'inv-item';

                        // Tambahkan efek klik jika consumable
                        if (itemData.type === 'consumable') {
                            div.style.cursor = 'pointer';
                            div.style.borderColor = '#10b981'; // Green border for usable
                            div.onclick = () => useInventoryItem(key, itemData.action);
                            div.title = "KLIK UNTUK MENGGUNAKAN: " + itemData.desc;
                        } else {
                            div.title = itemData.desc || "Item Koleksi";

                            // NEW: KLIK UNTUK LIHAT INFO (PENGGANTI TOOLTIP DI HP)
                            div.onclick = () => {
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                                showDialogue(
                                    `INFO: ${itemData.name.toUpperCase()}`,
                                    itemData.desc || "Sebuah item misterius yang ditemukan di Nusantara Arsa.",
                                    [{ text: "Tutup", action: closeDialogue }],
                                    itemData.img
                                );
                            };

                        }

                        // Render Image jika ada (Prioritas), fallback ke Icon Emoji
                        let visualContent = `<div style="font-size:30px; margin-bottom:5px;">${itemData.icon}</div>`;

                        if (itemData.img) {
                            // Fallback icon jika gambar gagal load
                            const fallbackIcon = itemData.icon || '🐟';
                            visualContent = `<img src="${itemData.img}" style="width:32px; height:32px; margin-bottom:5px; object-fit:contain;" 
                                onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
                                <div style="font-size:30px; margin-bottom:5px; display:none;">${fallbackIcon}</div>`;
                        }

                        div.innerHTML = `
                <div class="inv-qty">${inv[key]}</div>
                ${visualContent}
                <span>${itemData.name}</span>
                <span style="font-size:8px; color:#94a3b8; margin-top:2px;">${itemData.type === 'consumable' ? '(Pakai/Makan)' : ''}</span>
            `;
                        grid.appendChild(div);
                    }
                }

                if (!hasItem) {
                    grid.innerHTML = '<div class="inv-empty-msg">Tas Kosong...<br>Belum ada item yang didapat.</div>';
                }
            }

            // --- NEW FUNCTION: USE ITEM LOGIC (EAT & DRINK) ---
            function useInventoryItem(id, action) {
                let consumed = false;

                // 1. TONIC STAMINA (FULL)
                if (action === 'useStamina') {
                    if (STATE.player.energy >= 100) {
                        showToast("Energi sudah penuh!");
                        return;
                    }
                    STATE.player.energy = 100;
                    showToast("⚡ STAMINA PULIH PENUH!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    createParticle(STATE.player.x, STATE.player.y, '#fbbf24');
                    spawnFloatingText(STATE.player.x, STATE.player.y - 40, "MAX ENERGY!", "#fbbf24", 16); // Visual Teks
                    consumed = true;
                }
                // 2. TONIC KEBAL
                else if (action === 'useImmune') {
                    if (STATE.player.invincible) {
                        showToast("Efek Kebal Masih Aktif!");
                        return;
                    }
                    STATE.player.invincible = true;
                    STATE.player.shieldTimer = 600; // 10 detik (60fps)
                    showToast("🛡️ MODE KEBAL AKTIF (10 Detik)!");
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    spawnFloatingText(STATE.player.x, STATE.player.y - 40, "SHIELD ON!", "#60a5fa", 16); // Visual Teks
                    consumed = true;
                }

                // 📜 GULUNGAN MBAH LAMONG (Item Folktale Ki Lamong)
                else if (action === 'baca_gulungan_mbahlamong') {
                    handleGulunganMbahLamong();
                    return; // handleGulungan sudah urus pengurangan sendiri
                }

                // 3. MAKANAN & IKAN (FISH, BREAD, CHOCO)
                else if (action.startsWith('eat_')) {
                    consumed = true;
                    const energyGain = {
                        'eat_fish': 15, 'eat_bread': 20, 'eat_choco': 10,
                        'eat_fish_small': 10, 'eat_fish_medium': 25, 'eat_fish_large': 50, 'eat_fish_legend': 100,
                        'eat_rice': 25, 'eat_corn': 20, 'eat_tomato': 15,
                        'eat_nasi_bungkus': 30, 'eat_telor': 12, 'eat_tempe': 15
                    }[action] || 10;

                    if (STATE.player.energy >= 100) {
                        showToast("Kenyang! (Energi Penuh)");
                        return;
                    }
                    STATE.player.energy = Math.min(100, STATE.player.energy + energyGain);
                    const foodNames = { 'eat_nasi_bungkus':'Nasi bungkus', 'eat_telor':'Telur', 'eat_tempe':'Tempe', 'eat_bread':'Roti', 'eat_fish':'Ikan bakar' };
                    const fn = foodNames[action] || 'Makanan';
                    showToast(`${fn} dimakan! (+${energyGain} Energi) ⚡`);
                    spawnFloatingText(STATE.player.x, STATE.player.y - 40, `+${energyGain} ⚡`, "#4ade80", 14);
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                }
                else if (action === 'use_obat') {
                    consumed = true;
                    const healAmt = 30;
                    STATE.player.hp = Math.min(STATE.player.maxHp || 100, (STATE.player.hp || 100) + healAmt);
                    showToast(`💊 Obat diminum. HP +${healAmt}`);
                    spawnFloatingText(STATE.player.x, STATE.player.y - 40, `+${healAmt} HP`, "#f87171", 14);
                }


                // --- [TAMBAHAN BARU] LOGIKA MENCANGKUL (HOE) ---
                else if (action === 'use_hoe') {
                    // 1. Cek Lokasi (Harus di Desa/Luar)
                    if (STATE.location !== 'village') {
                        showToast("Hanya bisa mencangkul di Luar Ruangan!");
                        return;
                    }

                    // 2. Cek Energi (Butuh 5)
                    if (STATE.player.energy < 5) {
                        showToast("Energi tidak cukup! (Butuh 5)");
                        return;
                    }

                    // 3. Hitung Posisi Tile di Bawah Kaki Pemain
                    const tx = Math.floor((STATE.player.x + 10) / TILE_SIZE);
                    const ty = Math.floor((STATE.player.y + 15) / TILE_SIZE);
                    const map = maps['village'];
                    const tIdx = ty * map.w + tx;

                    // 4. Cek Apakah Berdiri di Lahan Pertanian (Tile ID 5)
                    if (map.tiles[tIdx] !== 5) {
                        showToast("Ini bukan lahan pertanian! Cari tanah coklat.");
                        return;
                    }

                    // 5. Cek Status Tanah
                    const farmKey = `${tx}_${ty}`;
                    if (!STATE.player.farming) STATE.player.farming = {};

                    const crop = STATE.player.farming[farmKey];

                    if (crop && (crop.tilled || crop.type)) {
                        showToast("Tanah sudah gembur atau ada tanaman.");
                    } else {
                        // PROSES CANGKUL BERHASIL
                        STATE.player.energy -= 5;

                        // Set status tanah jadi tilled (gembur)
                        STATE.player.farming[farmKey] = { tilled: true };

                        // Efek Visual & Audio
                        createParticle(tx * TILE_SIZE, ty * TILE_SIZE, '#d97706'); // Partikel Tanah Coklat
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                        showToast("Tanah berhasil digemburkan! ⛏️");

                        // Simpan Progress
                        manualSave();
                    }

                    // Cangkul adalah ALAT, jadi tidak dikonsumsi (consumed = false)
                    return;
                }







                // --- [TAMBAHAN BARU] LOGIKA MENANAM BIBIT ---
                else if (action.startsWith('plant_')) {
                    // 1. Cek Lokasi (Harus di Desa/Luar)
                    if (STATE.location !== 'village') {
                        showToast("Hanya bisa menanam di Luar Ruangan!");
                        return;
                    }

                    // --- NEW: CEK MUSIM DINGIN (WINTER) ---
                    if (STATE.season === 'winter') {
                        showToast("❄️ Tanah membeku! Tidak bisa menanam di Musim Dingin.");
                        // Mainkan suara error jika ada
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');
                        return;
                    }
                    // --------------------------------------

                    // 2. Hitung Posisi Tile di Bawah Kaki Pemain
                    // (x+10, y+15 adalah titik tengah kaki player 20x20)
                    const tx = Math.floor((STATE.player.x + 10) / TILE_SIZE);
                    const ty = Math.floor((STATE.player.y + 15) / TILE_SIZE);

                    // 3. Cek Apakah Berdiri di Atas Lahan Pertanian (Tile ID 5)
                    const map = maps['village'];
                    const tIdx = ty * map.w + tx;
                    if (map.tiles[tIdx] !== 5) {
                        showToast("Harus berdiri di Lahan Pertanian (Tanah Coklat)!");
                        return;
                    }

                    // 4. Cek Status Tanah (Harus Tilled & Belum Ada Tanaman)
                    const farmKey = `${tx}_${ty}`;

                    // Safety init
                    if (!STATE.player.farming) STATE.player.farming = {};

                    // Ambil data tanah saat ini
                    const farmData = STATE.player.farming[farmKey];

                    // UPDATE: VALIDASI TANAH GEMBUR
                    // Jika data tanah tidak ada ATAU belum dicangkul (tilled), tolak.
                    if (!farmData || !farmData.tilled) {
                        showToast("Tanah harus dicangkul dulu! (Gunakan Cangkul ⛏️)");
                        return;
                    }

                    // Jika sudah ada tanaman (type terisi), tolak.
                    if (farmData.type) {
                        showToast("Sudah ada tanaman di sini!");
                        return;
                    }

                    // 5. PROSES TANAM
                    // Ambil tipe tanaman dari action (contoh: 'plant_padi' -> 'padi')
                    const cropType = action.split('_')[1];

                    // Update data tanah yang sudah ada (pertahankan status tilled)
                    farmData.type = cropType;
                    farmData.stage = 1;       // 1 = Benih
                    farmData.watered = false; // Reset siram saat tanam baru

                    // Efek Visual & Audio
                    createParticle(tx * TILE_SIZE, ty * TILE_SIZE, '#4ade80'); // Partikel Hijau
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    showToast(`Berhasil menanam ${cropType.toUpperCase()}! 🌱`);

                    consumed = true; // Tandai item berhasil dipakai (untuk dikurangi)

                    // Opsional: Tutup tas otomatis biar langsung kelihatan hasilnya
                    toggleInventory();
                }
                // --- LOGIKA PUPUK (INSTANT GROW) ---
                else if (action === 'use_pupuk') {
                    if (STATE.location !== 'village') {
                        showToast("Hanya bisa dipakai di ladang!");
                        return;
                    }

                    const tx = Math.floor((STATE.player.x + 10) / TILE_SIZE);
                    const ty = Math.floor((STATE.player.y + 15) / TILE_SIZE);
                    const farmKey = `${tx}_${ty}`;

                    if (STATE.player.farming && STATE.player.farming[farmKey]) {
                        const crop = STATE.player.farming[farmKey];
                        if (crop.stage < 3) {
                            crop.stage++; // Langsung tumbuh 1 tahap
                            showToast("Tanaman tumbuh instan! ✨");
                            createParticle(tx * TILE_SIZE, ty * TILE_SIZE, '#fbbf24');
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                            consumed = true;
                            toggleInventory();
                        } else {
                            showToast("Tanaman sudah siap panen!");
                        }
                    } else {
                        showToast("Tidak ada tanaman di sini.");
                    }
                }
                // --- [AKHIR TAMBAHAN] ---

                // Kurangi Item jika berhasil dikonsumsi
                if (consumed && STATE.player.inventory[id] > 0) {
                    STATE.player.inventory[id]--;
                    if (STATE.player.inventory[id] <= 0) delete STATE.player.inventory[id];
                    renderInventory(); // Refresh tampilan tas
                }
            }

            // --- NEW FUNCTION: HANDLE DROPS (BOSS & NORMAL) ---
            function handleEnemyDrop(en) {
                const lvl = STATE.dungeonLevel || 1;

                // Gold scale dengan dungeon level
                let gold = (500 + (lvl * 400)) + Math.floor(Math.random() * 500);
                let exp = 15 + (lvl * 10);

                // Bonus Cincin Raja (+50% gold)
                let ringBonusText = "";
                if ((STATE.player.inventory['cincin_legend'] || 0) > 0) {
                    gold = Math.floor(gold * 1.5);
                    ringBonusText = " 💍";
                }

                STATE.player.money += gold;
                STATE.player.reputation += 1;
                STATE.player.dailyMonsterKills = (STATE.player.dailyMonsterKills || 0) + 1;
                STATE.player.totalMonsterKills = (STATE.player.totalMonsterKills || 0) + 1; // TOTAL LIFETIME

                // --- QUEST DROP ---
                if (en.isQuestTarget) {
                    addItem('draft_proposal', 1);
                    STATE.player.activeQuest = null;
                    showDialogue("BERHASIL!", "Kamu menemukan Draft Skripsi yang dicuri!\nKembalikan ke Senior Kutubuku di Perpustakaan.", [
                        { text: "Ok, Kembali ke Desa", action: () => {
                            STATE.location = 'village';
                            STATE.player.x = 50 * TILE_SIZE; STATE.player.y = 15 * TILE_SIZE;
                            closeDialogue();
                            if (typeof AudioService !== 'undefined') AudioService.playBGM('village');
                        }}
                    ], 'images/monster-thief.png');
                    if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    return;
                }

                // --- BOSS DROP ---
                if (en.isBoss) {
                    STATE.player.str += 5; STATE.player.int += 5;
                    STATE.player.biz += 5; STATE.player.reputation += 10;
                    STATE.player.maxHp += 50;
                    STATE.player.hp = STATE.player.maxHp;
                    STATE.player.energy = 100;
                    // 🎬 CINEMATIC BOSS DEFEATED
                    const _bossLvl = STATE.dungeonLevel || 1;
                    setTimeout(() => {
                        playCutsceneBossDefeated(_bossLvl, () => {
                            showToast(`👹 BOSS LV.${_bossLvl} TAKLUK! ALL STATS +5 · MAX HP +50`);
                        });
                    }, 600);
                }

                gainExp(exp);

                // --- DROP ITEM ---
                let dropText = "";
                let floatedItem = "";

                if (en.isBoss) {
                    if (Math.random() <= 0.25) {
                        const hasArmor = (STATE.player.inventory['zirah_legend'] || 0) > 0;
                        const hasRing  = (STATE.player.inventory['cincin_legend'] || 0) > 0;
                        let rareDrop = "";

                        if (!hasArmor) {
                            rareDrop = 'zirah_legend';
                            dropText = "🔥 LEGENDARY DROP: ZIRAH ABADI!";
                            floatedItem = "ZIRAH ABADI";
                        } else if (!hasRing) {
                            rareDrop = 'cincin_legend';
                            dropText = "💍 LEGENDARY DROP: CINCIN RAJA!";
                            floatedItem = "CINCIN RAJA";
                        } else {
                            rareDrop = Math.random() < 0.5 ? 'tonic_stamina' : 'tonic_kebal';
                            dropText = `🧪 DROP LANGKA: ${rareDrop.replace('_',' ').toUpperCase()}!`;
                            floatedItem = rareDrop.replace('_',' ').toUpperCase();
                        }

                        addItem(rareDrop, 1);

                        if (rareDrop === 'zirah_legend') {
                            setTimeout(() => {
                                playCutsceneLegendaryDrop(
                                    'ZIRAH ABADI 🛡️',
                                    'Armor terkuat di seluruh Dungeon.\nPasif: Damage musuh berkurang drastis.\n\n(Cek Lemari Pakaian di rumahmu!)',
                                    () => { if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); }
                                );
                            }, 1200);
                        } else if (rareDrop === 'cincin_legend') {
                            setTimeout(() => {
                                playCutsceneLegendaryDrop(
                                    'CINCIN RAJA 💍',
                                    'Cincin keabadian milik penguasa dungeon.\nPasif: Setiap membunuh musuh, Gold yang didapat 2x lipat.',
                                    () => { if (typeof AudioService !== 'undefined') AudioService.playSFX('item'); }
                                );
                            }, 1200);
                        }
                        if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
                    } else {
                        dropText = " (Boss Defeated)";
                    }
                } else {
                    // --- NORMAL DROP POOL (themed per level) ---
                    // Chance naik tiap level: 35% base + 5% per level
                    const chance = 0.35 + (lvl * 0.05);

                    if (Math.random() < chance) {
                        // Pool item per dungeon level — makin dalam makin berharga
                        const LOOT_POOLS = {
                            1: [ 'coklat','coklat','gandum','kain','bunga' ],
                            2: [ 'kain','kain','besi','coklat','scroll_exp' ],
                            3: [ 'besi','besi','permata','scroll_exp','tonic_stamina','kalung_mutiara_laut' ],
                            4: [ 'permata','permata','besi','scroll_exp','tonic_stamina','kalung_mutiara_laut' ],
                            5: [ 'permata','scroll_exp','scroll_exp','tonic_stamina','tonic_kebal' ]
                        };
                        const pool = LOOT_POOLS[Math.min(lvl, 5)];
                        const item = pool[Math.floor(Math.random() * pool.length)];

                        // Kalung Mutiara Laut — hanya bisa dapat 1, dan hanya jika quest Putri Duyung aktif
                        if (item === 'kalung_mutiara_laut') {
                            const hasKalung = !!(STATE.player.inventory && STATE.player.inventory['kalung_mutiara_laut']);
                            const questActive = STATE.player.duyungQuestStage === 1;
                            if (!hasKalung && questActive) {
                                addItem('kalung_mutiara_laut', 1);
                                dropText = " & 🪬 KALUNG MUTIARA LAUT! (Quest Putri Duyung)";
                                floatedItem = "KALUNG MUTIARA!";
                                setTimeout(() => showToast("🧜‍♀️ Kalung Putri Duyung ditemukan! Kembalikan ke pantai..."), 1000);
                            } else {
                                // Fallback ke permata
                                addItem('permata', 1);
                                dropText = " & 💎 Berlian";
                                floatedItem = "💎 Berlian";
                            }
                        } else if (item === 'scroll_exp') {
                            gainExp(100);
                            dropText = " & 📜 Gulungan Kuno (+100 EXP)";
                            floatedItem = "+100 EXP";
                        } else {
                            addItem(item, 1);
                            const itemName = { coklat:'🍫 Coklat', gandum:'🍞 Roti', kain:'🧵 Kain Sutra',
                                bunga:'🌹 Bunga', besi:'⛓️ Bijih Besi', permata:'💎 Berlian',
                                tonic_stamina:'⚡ Tonic Stamina', tonic_kebal:'🛡️ Tonic Kebal' }[item] || item;
                            dropText = ` & ${itemName}`;
                            floatedItem = itemName;
                        }
                    }
                }

                showToast(`+${gold.toLocaleString()} G${ringBonusText}${dropText}`);
                spawnFloatingText(en.x, en.y, `+${gold} G${ringBonusText}`, '#fbbf24', 12);
                if (floatedItem) spawnFloatingText(en.x, en.y - 15, floatedItem, '#4ade80', 12);

                createParticle(en.x, en.y, '#fbbf24');
                if (typeof AudioService !== 'undefined') AudioService.playSFX('item');
            }

            function addItem(id, qty) {
                if (!STATE.player.inventory[id]) STATE.player.inventory[id] = 0;
                STATE.player.inventory[id] += qty;
            }

            // UPDATE ENEMY UNTUK CEK INVINCIBLE & DAMAGE REDUCTION
            function updateEnemies() {
                STATE.enemies.forEach((en, i) => {
                    // ... existing movement logic ...
                    en.x += en.knockback.x; en.y += en.knockback.y;
                    en.knockback.x *= 0.8; en.knockback.y *= 0.8;

                    if (Math.abs(en.knockback.x) < 0.5) {
                        const ang = Math.atan2(STATE.player.y - en.y, STATE.player.x - en.x);
                        en.angle = ang;
                        en.x += Math.cos(ang) * en.speed;
                        en.y += Math.sin(ang) * en.speed;
                    }

                    const d = Math.hypot(STATE.player.x - en.x, STATE.player.y - en.y);

                    // LOGIC HIT PEMAIN
                    if (d < 20) {
                        if (!STATE.player.invincible) {
                            // Damage Calculation dengan Zirah
                            let dmg = 0.5;
                            if (STATE.player.inventory['zirah_legend']) dmg = 0.2; // Diskon damage 60% jika punya zirah

                            STATE.player.hp -= dmg;

                            // --- NEW: TRIGGER DAMAGE EFFECTS ---
                            // Hanya trigger efek visual setiap beberapa frame agar tidak epilepsi (interval 30 frame / 0.5 detik)
                            if (!STATE.player.damageCooldown || STATE.player.damageCooldown <= 0) {

                                // 1. Set Timer Animasi Player (Sprite Merah)
                                STATE.player.hurtTimer = 15; // 15 Frame (~0.25 detik)

                                // 2. Trigger Overlay Merah (CSS Animation)
                                const dmgOverlay = document.getElementById('damage-overlay');
                                if (dmgOverlay) {
                                    dmgOverlay.classList.remove('damage-active');
                                    void dmgOverlay.offsetWidth; // Trigger Reflow
                                    dmgOverlay.classList.add('damage-active');
                                }

                                // 3. Trigger Screen Shake (CSS Animation pada Container)
                                const gameContainer = document.getElementById('game-container');
                                if (gameContainer) {
                                    gameContainer.classList.remove('shake-screen');
                                    void gameContainer.offsetWidth; // Trigger Reflow
                                    gameContainer.classList.add('shake-screen');
                                }

                                // 4. Efek Suara
                                if (typeof AudioService !== 'undefined') AudioService.playSFX('hit');

                                // 5. Partikel Darah
                                createParticle(STATE.player.x, STATE.player.y, '#ef4444');
                                createParticle(STATE.player.x, STATE.player.y, '#b91c1c');

                                // Cooldown visual agar tidak spamming
                                STATE.player.damageCooldown = 40;
                            }

                            if (STATE.player.damageCooldown > 0) STATE.player.damageCooldown--;

                            // if(Math.random()<0.1) createParticle(STATE.player.x, STATE.player.y, '#ef4444'); // Removed, replaced by deterministic particle above
                            if (STATE.player.hp <= 0) gameOver();
                        } else {
                            // Jika Kebal, Musuh Mental
                            en.knockback = { x: (en.x - STATE.player.x) * 0.5, y: (en.y - STATE.player.y) * 0.5 };
                        }
                    }

                    if (en.hp <= 0) {
                        STATE.enemies.splice(i, 1);
                        // PANGGIL DROP LOGIC BARU
                        handleEnemyDrop(en);
                    }
                });

                // --- NEW: UPDATE SHIELD TIMER ---
                if (STATE.player.shieldTimer > 0) {
                    STATE.player.shieldTimer--;
                    if (STATE.player.shieldTimer <= 0) {
                        STATE.player.invincible = false;
                        showToast("🛡️ Efek Kebal Habis.");
                    }
                }

                // CEK CLEARED CONDITION SEPERTI BIASA
                if (STATE.location === 'dungeon' && STATE.enemies.length === 0) {
                    // FIX: Semua musuh mati → pastikan dungeon ambience kembali (jika boss belum spawn)
                    if (typeof AudioService !== 'undefined' && AudioService.enabled) {
                        if (!STATE.bossSpawned && AudioService.currentTrack !== 'dungeon') {
                            AudioService.playBGM('dungeon');
                        }
                    }

                    if (STATE.dungeonLevel === 5 && !STATE.bossSpawned) {
                        spawnFinalBoss();
                        return;
                    }

                    const map = maps['dungeon'];
                    // Cek apakah portal sudah ada
                    const hasPortal = map.buildings.find(b => b.id === 'dungeon_next' || (b.id === 'dungeon_exit' && b.x === 20));

                    if (!hasPortal) {
                        if (STATE.dungeonLevel < 5) {
                            // UPDATE POSISI: Spawn Portal di Dinding Atas (Utara) agar seperti pintu
                            // Koordinat X: 19 (Tengah), Y: 1 (Lantai paling atas)
                            map.buildings.push({
                                id: 'dungeon_next',
                                x: 19, y: 1, w: 2, h: 2,
                                type: 'trigger',
                                entrance: { x: 19.5, y: 1.5, map: 'dungeon' }, // Titik tengah visual
                                name: `Portal Level ${STATE.dungeonLevel + 1}`,
                                open24h: true
                            });

                            // FIX: TAMBAHKAN EFEK SUARA SAAT PORTAL MUNCUL
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                            showToast("🌀 PORTAL TERBUKA! Lanjut ke Level Berikutnya (Cek Dinding Atas).");
                        } else {
                            // Level 5 (Boss) Selesai
                            showToast("🏆 DUNGEON CLEARED! Kamu mengalahkan BOSS!");
                            // Beri hadiah besar
                            STATE.player.money += 50000;
                            STATE.player.reputation += 50;
                            gainExp(500);
                            if (typeof AudioService !== 'undefined') AudioService.playSFX('item');

                            // NEW: Munculkan Portal Pulang di Tengah Ruangan (Karena exit di pojok sudah hilang)
                            map.buildings.push({
                                id: 'dungeon_exit',
                                x: 20, y: 15, w: 2, h: 2,
                                type: 'trigger',
                                entrance: { x: 21, y: 16 },
                                name: "KEMBALI KE DESA (MENANG)",
                                open24h: true
                            });
                        }
                    }
                }
            }

            function gameOver() {
                // UPDATE: Gunakan gambar monster atau penjaga dungeon untuk dialog Game Over
                showDialogue("DEFEAT (KALAH)", "Kamu dikalahkan oleh monster ganas...\nPandanganmu menggelap. (Gold berkurang 10%)", [{
                    text: "... (Sadar di Klinik)", action: () => {
                        STATE.player.hp = 100;
                        STATE.player.energy = 50; // Bangun lemas
                        STATE.player.money = Math.floor(STATE.player.money * 0.9);

                        // FIX: UPDATE LOKASI RESPAWN KE DALAM KLINIK (SAMAKAN DENGAN PINGSAN ENERGI)
                        // Sebelumnya: STATE.location = 'village'; (Ini yang bikin muncul di luar)
                        STATE.location = 'clinic_interior';
                        STATE.player.x = 10 * TILE_SIZE; // Samping Bed Kanan
                        STATE.player.y = 8 * TILE_SIZE;
                        STATE.player.direction = 'left';

                        // FIX: Lompati hari (karena pingsan butuh pemulihan)
                        STATE.day = parseInt(STATE.day) + 1;
                        STATE.time = 800; // Bangun jam 08:00 Pagi

                        STATE.enemies = [];
                        closeDialogue();

                        // Update UI Waktu Segera
                        const currentDayName = DAYS_OF_WEEK[(STATE.day - 1) % 7];
                        const totalDays = STATE.day - 1;
                        const year = Math.floor(totalDays / (DAYS_PER_SEASON * 4)) + 1;
                        document.getElementById('full-date-display').innerText = `${currentDayName}, D${(totalDays % DAYS_PER_SEASON) + 1} ${STATE.season.toUpperCase()} Y${year}`;
                        document.getElementById('clock-display').innerText = "08:00";

                        showToast("Dirawat Intensif oleh Dr. Budi 🏥");
                        manualSave();

                        // FIX: Munculkan Dialog Dokter Budi di Dalam Klinik
                        setTimeout(() => {
                            showDialogue("DR. BUDI", "Astaga! Kamu terluka parah di Dungeon!\n\nUntung Tim Penyelamat Guild menemukanmu tepat waktu dan membawamu ke sini.\n\nLuka-lukamu cukup serius. Saya sarankan jangan memaksakan diri melawan monster level tinggi jika belum siap.", [{ text: "Terima kasih Dok", action: closeDialogue }], 'images/lover1boy.png');
                        }, 500);

                    }
                }], 'images/monster.png');
            }

