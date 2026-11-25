import { patchState } from '../core/state.js';
import { saveState } from '../core/storage.js';

export function initActivities() {
  const btn = document.getElementById('btnOpenActivitiesMenu');
  const modal = document.getElementById('activitiesMenuModal');
  const grid = document.getElementById('activitiesGridContainer');
  
  // Jika modal belum ada di HTML, kita buat secara dinamis untuk sementara
  if (!modal) return;

  btn.addEventListener('click', () => {
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.querySelector('.glass-modal-transparent').style.transform = 'scale(1)';
  });

  grid.innerHTML = `
    <button class="glass-panel p-4 rounded-xl text-left border border-white/10 hover:border-emerald-400/50 act-btn" data-act="tidur">
      <h4 class="font-bold text-white text-sm">Tidur</h4>
      <p class="text-[10px] text-stone-400">Memulihkan Energi (+30)</p>
    </button>
    <button class="glass-panel p-4 rounded-xl text-left border border-white/10 hover:border-emerald-400/50 act-btn" data-act="makan">
      <h4 class="font-bold text-white text-sm">Makan</h4>
      <p class="text-[10px] text-stone-400">Mengurangi Lapar (+20 Kesegaran)</p>
    </button>
  `;

  grid.querySelectorAll('.act-btn').forEach(b => {
    b.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.act;
      if (type === 'tidur') {
        patchState({ stats: { ...window.__state?.stats, energi: Math.min(100, (window.__state?.stats.energi || 0) + 30) } });
        window.__journal?.push({ type: 'tidur', text: 'Tidur sejenak, energi bertambah.' });
      } else if (type === 'makan') {
        patchState({ stats: { ...window.__state?.stats, kesegaran: Math.min(100, (window.__state?.stats.kesegaran || 0) + 20) } });
        window.__journal?.push({ type: 'makan', text: 'Makan enak, kesegaran bertambah.' });
      }
      saveState();
      // Tutup modal
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modal.querySelector('.glass-modal-transparent').style.transform = 'scale(0.95)';
    });
  });
}
