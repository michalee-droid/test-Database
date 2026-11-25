const params = new URLSearchParams(window.location.search);
const destination = params.get('to') || 'Tujuan';
const durationMs = parseInt(params.get('dur') || '2500', 10);

document.getElementById('travel-loading-text').textContent = `Menuju ${destination}...`;
const bar = document.getElementById('travel-progress-bar');

const start = performance.now();
function tick(now) {
  const progress = Math.min(1, (now - start) / durationMs);
  bar.style.width = `${progress * 100}%`;
  if (progress < 1) requestAnimationFrame(tick);
  else {
    const back = params.get('return') || 'index.html';
    window.location.href = back;
  }
}
requestAnimationFrame(tick);
