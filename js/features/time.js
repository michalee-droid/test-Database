import { subscribe } from '../core/state.js';

export function initTime() {
  // Update jam setiap detik
  setInterval(() => {
    const clockStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const phoneClock = document.getElementById('phonePageClock');
    if (phoneClock) phoneClock.textContent = clockStr;
  }, 1000);
}
