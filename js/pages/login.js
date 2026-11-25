import { auth, db } from '../firebase/config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { defaultState } from '../core/default-state.js';

let isRegister = false;

// Elemen UI
const form = document.getElementById('authForm');
const btnSubmit = document.getElementById('btnSubmitAuth');
const btnToggle = document.getElementById('btnToggleAuth');
const registerFields = document.getElementById('registerFields');
const authImage = document.getElementById('authImage');
const genderSelect = document.getElementById('regGender');

// Cek jika sudah login
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = 'main.html';
});

// Toggle Register/Login
btnToggle.addEventListener('click', () => {
  isRegister = !isRegister;
  if (isRegister) {
    registerFields.classList.remove('hidden');
    registerFields.classList.add('flex');
    btnSubmit.textContent = 'Daftar Akun';
    btnToggle.innerHTML = 'Sudah punya akun? <span class="font-bold underline text-amber-200">Masuk di sini</span>';
  } else {
    registerFields.classList.add('hidden');
    registerFields.classList.remove('flex');
    btnSubmit.textContent = 'Masuk';
    btnToggle.innerHTML = 'Belum punya akun? <span class="font-bold underline text-amber-200">Daftar sekarang</span>';
  }
});

// Ganti Gambar berdasarkan Gender
genderSelect.addEventListener('change', (e) => {
  if (e.target.value === 'Laki-Laki') {
    authImage.src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop'; // Gambar Pria
  } else {
    authImage.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop'; // Gambar Wanita
  }
});

// Submit Form
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Memproses...';

  try {
    if (isRegister) {
      // 1. Buat Auth User
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // 2. Simpan Profil ke Firestore
      const newState = structuredClone(defaultState);
      newState.profile = {
        name: document.getElementById('regName').value || 'Pemain Baru',
        city: document.getElementById('regCity').value,
        gender: document.getElementById('regGender').value
      };

      await setDoc(doc(db, 'users', uid), {
        ...newState,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      window.location.href = 'main.html';
    } else {
      // Login
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'main.html';
    }
  } catch (error) {
    alert("Error: " + error.message);
    btnSubmit.disabled = false;
    btnSubmit.textContent = isRegister ? 'Daftar Akun' : 'Masuk';
  }
});
