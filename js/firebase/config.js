import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initializeFirestore, persistentLocalCache } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDQCMucHvMGTLXhaJRLTekuUiy64qmzKes",
  authDomain: "solitude-life.firebaseapp.com",
  projectId: "solitude-life",
  storageBucket: "solitude-life.firebasestorage.app",
  messagingSenderId: "545093364425",
  appId: "1:545093364425:web:a0b3df7de758669de27b18",
  measurementId: "G-SHMH2RZJYC",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Menggunakan cache lokal agar game tetap jalan saat offline (ERR_INTERNET_DISCONNECTED)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});
