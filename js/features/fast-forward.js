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
    
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }

    patchState({ time: { month: nextMonth, year: nextYear } });
    window.__journal?.push({ type: 'time', text: `Waktu berlalu ke bulan ${MONTH_NAMES[nextMonth]} ${nextYear}.` });
    saveState();
  });
}
