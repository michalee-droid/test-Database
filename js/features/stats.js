import { subscribe } from '../core/state.js';
import { formatSimTime } from '../core/utils.js';

export function initStats() {
  subscribe(state => {
    // Update Topbar Text
    document.getElementById('charNameDisplay').textContent = state.profile.name;
    document.getElementById('charMetaDisplay').textContent = `${state.profile.gender} • ${state.profile.city}`;
    document.getElementById('statUangVal').textContent = `Rp ${state.stats.uang.toLocaleString('id-ID')}`;
    document.getElementById('simTimeDisplay').textContent = formatSimTime(state.time);
    document.getElementById('weatherBadgeText').textContent = `${state.weather.temp}°C ${state.weather.condition}`;
    document.getElementById('currentLocNameText').textContent = state.location.label;

    // Render Stat Rings jika belum ada
    const container = document.getElementById('statRingsContainer');
    if (!container.innerHTML.trim()) {
      container.innerHTML = `
        ${createRing('energi', 'zap', 'amber', state.stats.energi)}
        ${createRing('kesegaran', 'sparkles', 'emerald', state.stats.kesegaran)}
        ${createRing('kebahagiaan', 'smile', 'pink', state.stats.kebahagiaan)}
        <div class="h-8 w-px bg-white/15 mx-0.5"></div>
        ${createRing('fisik', 'activity', 'rose', state.stats.fisik.level)}
        ${createRing('kecerdasan', 'brain', 'purple', state.stats.kecerdasan.level)}
        ${createRing('sosial', 'users', 'cyan', state.stats.sosial.level)}
        ${createRing('pesona', 'sparkles', 'amber', state.stats.pesona.level)}
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  });
}

function createRing(id, icon, color, val) {
  const isLevel = ['fisik', 'kecerdasan', 'sosial', 'pesona'].includes(id);
  const dash = isLevel ? Math.min(100, val * 10) : val; // Konversi level ke visual bar
  return `
    <div class="stat-ring-container flex flex-col items-center gap-1 cursor-pointer group" title="${id}">
      <div class="relative w-10 h-10 flex items-center justify-center">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path class="text-black/40" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path class="text-${color}-400 transition-all duration-500" stroke-dasharray="${dash}, 100" stroke-width="3.5" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center text-${color}-300 group-hover:scale-110 transition-transform">
          <i data-lucide="${icon}" class="w-4 h-4"></i>
        </div>
      </div>
      <span class="text-[9px] font-bold text-${color}-200">${isLevel ? 'Lv.' + val : val}</span>
    </div>
  `;
}
