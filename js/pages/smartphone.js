import { bootstrapState } from '../core/storage.js';
import { getState } from '../core/state.js';
import { formatSimTime } from '../core/utils.js';
import { renderWalletApp } from '../apps/wallet.js';
import { renderFreelanceApp } from '../apps/freelance.js';

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
  await bootstrapState();
  const state = getState();

  document.getElementById('phonePageDate').textContent = formatSimTime(state.time);
  document.getElementById('phonePageTimeLarge').textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('phonePageClock').textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('phonePageWeatherText').textContent = `${state.weather.temp}°C ${state.weather.condition}`;

  renderApps();
  if (window.lucide) window.lucide.createIcons();

  document.getElementById('btnBackToHomeApps').addEventListener('click', showHome);
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

function openApp(appId) {
  const app = APPS.find(a => a.id === appId);
  if (!app) return;
  document.getElementById('phonePageHomeView').classList.add('hidden');
  const detail = document.getElementById('phonePageAppDetail');
  detail.classList.remove('hidden');
  detail.classList.add('flex');
  document.getElementById('phonePageAppDetailTitle').textContent = app.name;
  document.getElementById('phonePageAppDetailBody').innerHTML =
    `<p class="text-stone-300 text-xs">Modul aplikasi <b>${app.name}</b> belum diimplementasikan. Tambahkan di <code>js/apps/${app.id}.js</code>.</p>`;
}

function showHome() {
  document.getElementById('phonePageAppDetail').classList.add('hidden');
  document.getElementById('phonePageAppDetail').classList.remove('flex');
  document.getElementById('phonePageHomeView').classList.remove('hidden');
}

function openApp(appId) {
  const app = APPS.find(a => a.id === appId);
  if (!app) return;
  
  document.getElementById('phonePageHomeView').classList.add('hidden');
  const detail = document.getElementById('phonePageAppDetail');
  detail.classList.remove('hidden');
  detail.classList.add('flex');
  document.getElementById('phonePageAppDetailTitle').textContent = app.name;
  
  const container = document.getElementById('phonePageAppDetailBody');

  // Routing Aplikasi
  if (appId === 'wallet') {
    renderWalletApp(container);
  } else if (appId === 'freelance') {
    renderFreelanceApp(container);
  } else {
    container.innerHTML = `<p class="text-stone-300 text-xs">Modul aplikasi <b>${app.name}</b> belum diimplementasikan. Tambahkan di <code>js/apps/${app.id}.js</code>.</p>`;
  }

bootstrap().catch(err => {
  console.error('Smartphone bootstrap gagal:', err);
});
