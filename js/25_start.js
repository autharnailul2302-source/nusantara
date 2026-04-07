// ========================================================
// js/25_start.js
// ENTRY POINT — Dipanggil TERAKHIR setelah semua JS siap
// ========================================================
// Dengan `defer`, semua script sudah dieksekusi berurutan
// dan DOM sudah siap. Langsung panggil startGameSequence().

(function () {
    // Cek semua fungsi penting tersedia
    const required = ['startGameSequence', 'handleAudioChoice', 'AudioService', 'STATE'];
    const missing = required.filter(name => typeof window[name] === 'undefined' && typeof eval(name) === 'undefined');
    
    if (missing.length > 0) {
        console.error('❌ Fungsi/variabel belum tersedia:', missing);
    }
    
    try {
        startGameSequence();
        console.log('✅ Nusantara Arsa: Game sequence started.');
    } catch (err) {
        console.error('❌ CRITICAL: startGameSequence() gagal:', err);
        // Tampilkan pesan error ke layar agar user tahu
        const body = document.body;
        if (body) {
            const errDiv = document.createElement('div');
            errDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1e293b;color:#f87171;padding:20px;border-radius:12px;font-family:monospace;z-index:99999;max-width:80%;text-align:center;';
            errDiv.innerHTML = '<b>⚠️ Game Error</b><br><small>' + err.message + '</small><br><small>Cek Console (F12) untuk detail</small>';
            body.appendChild(errDiv);
        }
    }
})();
