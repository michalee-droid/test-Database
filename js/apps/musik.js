export function renderAudioApp(container) {
  const audio = document.getElementById('bgmAudio');
  const isPlaying = audio && !audio.paused;

  container.innerHTML = `
    <div class="flex flex-col items-center gap-6 mt-10 animate-slide-in">
      <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-rose-900 to-stone-900 border border-rose-500/30 flex items-center justify-center shadow-2xl ${isPlaying ? 'animate-pulse-glow' : ''}">
        <i data-lucide="music" class="w-16 h-16 text-rose-400"></i>
      </div>
      
      <div class="text-center">
        <h2 class="text-sm font-bold text-white">Garden Ambience</h2>
        <p class="text-xs text-stone-400">Life Simulator OST</p>
      </div>

      <button id="btnPlayPause" class="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-lg active:scale-95">
        <i data-lucide="${isPlaying ? 'pause' : 'play'}" class="w-6 h-6 ${isPlaying ? '' : 'ml-1'}"></i>
      </button>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons({ nodes: [container] });

  document.getElementById('btnPlayPause').addEventListener('click', () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(e => console.warn('Autoplay diblokir browser', e));
    } else {
      audio.pause();
    }
    renderAudioApp(container); // Refresh ikon
  });
}
