import { flushSave } from './storage.js';

export function navigateTo(page) {
  flushSave();
  window.location.href = page;
}

export function goBack(fallback = 'index.html') {
  flushSave();
  if (document.referrer) window.history.back();
  else window.location.href = fallback;
}
