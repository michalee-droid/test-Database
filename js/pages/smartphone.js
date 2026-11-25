import { bootstrapState } from '../core/storage.js';
import { getState } from '../core/state.js';
import { formatSimTime } from '../core/utils.js';

// Import semua modul aplikasi
import { renderWalletApp } from '../apps/wallet.js';
import { renderFreelanceApp } from '../apps/freelance.js';
import { renderBisnisApp } from '../apps/bisnis.js';
import { renderInvestasiApp } from '../apps/investasi.js';
// Catatan: Aplikasi di bawah ini akan kita buat pada tahap selanjutnya (Bagian 2)
import { renderPetaApp } from '../apps/peta.js';
import { renderMedsosApp } from '../apps/medsos.js';
import { renderChatApp } from '../apps/chat.js';
import { renderProfilApp } from '../apps/profil.js';
import { renderAudioApp } from '../apps/musik.js';

const APPS = [
  { id: 'peta',      icon: 'compass',     color: 'emerald', name: 'Travel',    desc: 'GPS & Peta Area' },
  { id: 'wallet',    icon: 'credit-card', color: 'amber',   name: 'Finansial', desc: 'Saldo & Kas' },
  { id: 'bisnis',    icon: 'building-2',  color: 'indigo',  name: 'Bisnis',    desc: 'Manajemen Properti' },
  { id: 'investasi', icon: 'line-chart',  color: 'cyan',    name: 'Investasi', desc: 'Pasar Modal' },
  { id: 'freelance', icon: 'briefcase',   color: 'purple',  name: 'Karir',     desc: 'Lowongan Kerja' },
  { id: 'medsos',    icon: 'share-2',     color: 'pink',    name: 'Medsos',    desc: 'Jaringan Publik' },
  { id: 'chat',      icon: 'message-square', color: 'blue', name: 'Pesan',     desc: 'Obrolan Singkat' },
  { id: 'profil',    icon: 'fingerprint', color: 'slate',   name: 'Profil',    desc: 'Identitas Diri' },
  { id: 'musik',     icon: 'disc',        color: 'rose',    name: 'Audio',     desc: 'Musik Latar' },
];

async function bootstrap() {
  try {
    // 1. Ambil state terbaru dari Firebase
    await bootstrapState();
    const state = getState();

    // 2. Setup Header & Widget HP
    document.getElementById('phonePageDate').textContent = formatSimTime(state.time);
    document.getElementById('phonePageTimeLarge').textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('phonePageClock').textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const weather = state.weather || { temp: 28, condition: 'Cerah' };
    document.getElementById('phonePageWeatherText').textContent = `${weather.temp}°C ${weather.condition}`;
    
    // Update icon cuaca jika ada
    const weatherIcon = document.getElementById('phonePageWeatherIcon');
    if (weatherIcon && weather.icon) {
      weatherIcon.setAttribute('data-lucide', weather.icon);
    }

    // 3. Render Grid Aplikasi
    renderApps();
    if (window.lucide) window.lucide.createIcons();

    // 4. Pasang Event Listener Kembali ke Game (simpan state dulu)
    document.getElementById('btnBackToGame').addEventListener('click', (e) => {
      e.preventDefault();
      // Import router secara dinamis atau langsung redirect
      window.location.href = 'index.html';
    });

  } catch (error) {
    console.error('Smartphone bootstrap gagal:', error);
    alert('Gagal memuat data HP. Cek koneksi internet Anda.');
  }
}

function renderApps() {
  const grid = document.getElementById('appsGrid');
  grid.innerHTML = APPS.map(app => `
    <button data-app="${app.id}" class="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2.5 hover:border-${app.color}-400/60 hover:bg-${app.color}-500/10 transition-all cursor-pointer group">
      <div class="w-12 h-12 rounded-2xl bg-${app.color}-950/70 border border-${app.color}-400/40 p-2.5 text-${app.color}-300 group-hover:scale-110 transition-transform flex items-center justify-center">
        <i data-lucide="${app.icon}" class="w-6 h-6"></i>
      </div>
      <div>
        <span class="font-bold text-xs text-white block">${app.name}</span>
        <span class="text-[10px] text-stone-400 block mt-0.5">${app.desc}</span>
      </div>
    </button>
  `).join('');

  grid.querySelectorAll('[data-app]').forEach(btn => {
    btn.addEventListener('click', () => openApp(btn.dataset.app));
  });
}

async function openApp(appId) {
  const app = APPS.find(a => a.id === appId);
  if (!app) return;
  
  // Sembunyikan Home, Tampilkan Container Detail
  document.getElementById('phonePageHomeView').classList.add('hidden');
  const detail = document.getElementById('phonePageAppDetail');
  detail.classList.remove('hidden');
  detail.classList.add('flex');
  document.getElementById('phonePageAppDetailTitle').textContent = app.name;
  
  const container = document.getElementById('phonePageAppDetailBody');
  container.innerHTML = '<div class="flex justify-center py-10"><div class="w-8 h-8 rounded-full border-2 border-amber-300/30 border-t-amber-300 animate-spin"></div></div>'; // Loading state

  // Routing Aplikasi
  try {
    switch (appId) {
      case 'wallet': 
        await renderWalletApp(container); 
        break;
      case 'freelance': 
        renderFreelanceApp(container); 
        break;
      case 'bisnis': 
        await renderBisnisApp(container); 
        break;
      case 'investasi': 
        renderInvestasiApp(container); 
        break;
        
      // Aplikasi Bagian 2
      case 'peta': 
        if (typeof renderPetaApp === 'function') renderPetaApp(container); 
        else throw new Error('Modul Peta belum siap');
        break;
      case 'medsos': 
        if (typeof renderMedsosApp === 'function') renderMedsosApp(container); 
        else throw new Error('Modul Medsos belum siap');
        break;
      case 'chat': 
        if (typeof renderChatApp === 'function') renderChatApp(container); 
        else throw new Error('Modul Chat belum siap');
        break;
      case 'profil': 
        if (typeof renderProfilApp === 'function') renderProfilApp(container); 
        else throw new Error('Modul Profil belum siap');
        break;
      case 'musik': 
        if (typeof renderAudioApp === 'function') renderAudioApp(container); 
        else throw new Error('Modul Audio belum siap');
        break;
        
      default:
        container.innerHTML = `<p class="text-stone-300 text-xs">Aplikasi <b>${app.name}</b> belum tersedia.</p>`;
    }
  } catch (err) {
    console.warn(err);
    container.innerHTML = `<p class="text-stone-400 text-xs italic">Modul aplikasi <b>${app.name}</b> sedang dalam tahap pengembangan.</p>`;
  }
}

function showHome() {
  document.getElementById('phonePageAppDetail').classList.add('hidden');
  document.getElementById('phonePageAppDetail').classList.remove('flex');
  document.getElementById('phonePageHomeView').classList.remove('hidden');
}

// Pasang event listener untuk tombol Back (Kembali ke Home Apps)
document.getElementById('btnBackToHomeApps').addEventListener('click', showHome);

// Jalankan bootstrap
bootstrap();
