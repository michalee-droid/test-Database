import { getState, patchState } from '../core/state.js';
import { saveState } from '../core/storage.js';
import { AREAS } from '../data/locations.js';

export function renderPetaApp(container) {
  const state = getState();
  const currentLoc = state.location.areaId;

  container.innerHTML = `
    <div class="flex flex-col gap-4 animate-slide-in">
      <div class="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-400/30">
        <h3 class="text-white font-bold text-sm flex items-center gap-2">
          <i data-lucide="map-pin" class="w-4 h-4 text-emerald-400"></i> Lokasi Saat Ini
        </h3>
        <p class="text-emerald-200 text-xs mt-1">${AREAS[currentLoc]?.name || 'Area Tidak Diketahui'}</p>
      </div>

      <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider">Pilih Tujuan (Jalan Kaki)</h3>
      <div class="grid grid-cols-2 gap-2">
        ${Object.entries(AREAS).map(([key, area]) => {
          if (key === currentLoc) return '';
          return `
            <button class="glass-panel p-3 rounded-xl text-left border border-white/10 hover:border-emerald-400/50 transition-all btn-travel" data-loc="${key}">
              <span class="font-bold text-xs text-white block truncate">${area.name}</span>
            </button>
          `;
        }).join('')}
      </div>
      <p class="text-[10px] text-stone-400 text-center mt-2 italic">Gunakan menu Transportasi di Beranda Game untuk kendaraan cepat.</p>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ nodes: [container] });

  container.querySelectorAll('.btn-travel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const destId = e.currentTarget.dataset.loc;
      const destName = AREAS[destId].name;
      
      // Update lokasi state
      const firstRoom = AREAS[destId].rooms[0];
      patchState({ location: { areaId: destId, roomId: firstRoom, label: `${destName} • ${firstRoom}` } });
      saveState(true); // Simpan langsung
      window.__journal?.push({ type: 'travel', text: `Berjalan kaki menuju ${destName}.` });

      // Redirect ke halaman travel untuk animasi, lalu kembali ke index.html
      window.location.href = `travel.html?to=${encodeURIComponent(destName)}&dur=2000&return=main.html`;
    });
  });
}
