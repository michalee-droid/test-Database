import { patchState, getState } from '../core/state.js';
import { saveState } from '../core/storage.js';
import { MONTH_NAMES } from '../core/utils.js';

export function initFastForward() {
  const btn = document.getElementById('btnFastForwardMonth');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const state = getState();
    let nextMonth = state.time.month + 1;
    let nextYear = state.time.year;
    
    if (nextMonth > 11) { nextMonth = 0; nextYear++; }

    // 1. Update Waktu
    const newTime = { month: nextMonth, year: nextYear };
    
    // 2. Dynamic Market (Fluktuasi Saham/Crypto -5% s/d +10%)
    const newMarketPrices = { ...state.marketPrices };
    for (const asset in newMarketPrices) {
      const changePercent = (Math.random() * 0.15) - 0.05; 
      newMarketPrices[asset] = Math.round(newMarketPrices[asset] * (1 + changePercent));
    }

    // 3. Penurunan Stat karena Waktu (Kelaparan & Kebersihan)
    const newStats = { ...state.stats };
    newStats.kelaparan = Math.max(0, newStats.kelaparan - 40); // Setiap bulan kurang makan
    newStats.kebersihan = Math.max(0, newStats.kebersihan - 30);

    patchState({ 
      time: newTime, 
      marketPrices: newMarketPrices,
      stats: newStats
    });

    window.__journal?.push({ 
      type: 'time', 
      text: `Waktu berlalu ke ${MONTH_NAMES[nextMonth]} ${nextYear}. Pasar berfluktuasi.` 
    });

    // 4. Random Events (Peluang 30% terjadi sesuatu)
    if (Math.random() < 0.3) {
      setTimeout(() => {
        triggerRandomEvent();
      }, 1000); // Beri jeda 1 detik setelah update UI
    }

    saveState();
  });
}

function triggerRandomEvent() {
  const state = getState();
  const events = [
    { 
      text: "Kecopetan di jalan! Uang berkurang Rp 50.", 
      effect: () => patchState({ stats: { ...state.stats, uang: Math.max(0, state.stats.uang - 50) } }) 
    },
    { 
      text: "Menemukan dompet di jalan! Mendapat Rp 100.", 
      effect: () => patchState({ stats: { ...state.stats, uang: state.stats.uang + 100 } }) 
    },
    { 
      text: "Sakit karena kehujanan. Energi berkurang 20.", 
      effect: () => patchState({ stats: { ...state.stats, energi: Math.max(0, state.stats.energi - 20) } }) 
    }
  ];

  const ev = events[Math.floor(Math.random() * events.length)];
  ev.effect();
  window.__journal?.push({ type: 'event', text: ev.text });
  saveState();
}
