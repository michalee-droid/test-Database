import { bootstrapState, saveState, flushSave } from '../core/storage.js';
import { subscribe } from '../core/state.js';
import { initStats } from '../features/stats.js';
import { initJournal } from '../features/journal.js';
import { initWeather } from '../features/weather.js';
import { initTime } from '../features/time.js';
import { initActivities } from '../features/activities.js';
import { initRoomNavigation } from '../features/room-navigation.js';
import { initTransport } from '../features/transport.js';
import { initFastForward } from '../features/fast-forward.js';

async function loadPartial(url) {
  const res = await fetch(url);
  return res.text();
}

async function bootstrap() {
  await bootstrapState();

  const [topbar, dock] = await Promise.all([
    loadPartial('partials/topbar.html'),
    loadPartial('partials/dock.html'),
  ]);
  document.getElementById('topBarSlot').innerHTML = topbar;
  document.getElementById('dockSlot').innerHTML = dock;
  if (window.lucide) window.lucide.createIcons();

  initStats();
  initJournal();
  initWeather();
  initTime();
  initActivities();
  initRoomNavigation();
  initTransport();
  initFastForward();

  subscribe(() => saveState());

  window.addEventListener('beforeunload', flushSave);
  window.addEventListener('pagehide', flushSave);
}

bootstrap().catch(err => {
  console.error('Bootstrap gagal:', err);
  alert('Gagal memuat data. Cek koneksi Anda.');
});
