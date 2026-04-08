// ══════════════════════════════════════════════════════════════
// Firebase Config + Init
// File: js/01-firebase-config.js
// ══════════════════════════════════════════════════════════════
            /** * FIREBASE CONFIGURATION */
            const firebaseConfig = {
                apiKey: "AIzaSyAdqApOvuUXrZUO19NfiqZCLSyUYR74w5M",
                authDomain: "waliq-ded98.firebaseapp.com",
                projectId: "waliq-ded98",
                storageBucket: "waliq-ded98.firebasestorage.app",
                messagingSenderId: "915222555864",
                appId: "1:915222555864:web:25320841c97661172e3bad",
                measurementId: "G-K51RW0YQ0M"
            };

            let db;
            let analytics;

            /** * APP FLOW LOGIC */
            const SESSION_KEY = 'sc_session_email';

            // ══════════════════════════════════════════════
