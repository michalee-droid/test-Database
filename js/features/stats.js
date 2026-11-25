import { subscribe } from '../core/state.js';
import { formatSimTime } from '../core/utils.js';

export function initStats() {
  subscribe(state => {
    // Amankan data dengan nilai default jika undefined
    const stats = state.stats || {};
    const profile = state.profile || {};
    const time = state.time || { month: 0, year: 2026 };
    const weather = state.weather || { temp: 28, condition: 'Cerah' };
    
    document.getElementById('charNameDisplay').textContent = profile.name || 'Pemain';
    document.getElementById('charMetaDisplay').textContent = `${profile.gender || 'Laki-Laki'} • ${profile.city || 'Jakarta'}`;
    
    // PERBAIKAN: Pastikan uang tidak undefined sebelum toLocaleString
    const uang = stats.uang !== undefined ? stats.uang : 0;
    document.getElementById('statUangVal').textContent = `Rp ${uang.toLocaleString('id-ID')}`;
    
    // Tampilkan Tanggal dan Jam (Format: 12 Jan 2026 - 14:00) const jamFormat = `${time.hour.toString().padStart(2, '0')}:00`; document.getElementById('simTimeDisplay').textContent = `${time.day} ${MONTH_NAMES[time.month]} ${time.year} - ${jamFormat}`;
    document.getElementById('weatherBadgeText').textContent = `${weather.temp}°C ${weather.condition}`;
    document.getElementById('currentLocNameText').textContent = state.location?.label || 'Lokasi';

    const container = document.getElementById('statRingsContainer');
    if (!container.innerHTML.trim()) {
      container.innerHTML = `
        ${createRing('energi', 'zap', 'amber', stats.energi || 0)}
        ${createRing('kesegaran', 'sparkles', 'emerald', stats.kesegaran || 0)}
        ${createRing('kebahagiaan', 'smile', 'pink', stats.kebahagiaan || 0)}
        <div class="h-8 w-px bg-white/15 mx-0.5"></div>
        ${createRing('fisik', 'activity', 'rose', stats.fisik?.level || 1)}
        ${createRing('kecerdasan', 'brain', 'purple', stats.kecerdasan?.level || 1)}
        ${createRing('sosial', 'users', 'cyan', stats.sosial?.level || 1)}
        ${createRing('pesona', 'sparkles', 'amber', stats.pesona?.level || 1)}
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  });
}

function createRing(id, icon, color, val) {
  const isLevel = ['fisik', 'kecerdasan', 'sosial', 'pesona'].includes(id);
  const dash = isLevel ? Math.min(100, val * 10) : val; 
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
