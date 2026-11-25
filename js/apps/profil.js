import { getState } from '../core/state.js';

export function renderProfilApp(container) {
  const state = getState();
  const { profile, stats } = state;

  container.innerHTML = `
    <div class="flex flex-col items-center gap-4 animate-slide-in">
      <div class="w-20 h-20 rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center mt-2 shadow-xl">
        <i data-lucide="user" class="w-10 h-10 text-slate-400"></i>
      </div>
      
      <div class="text-center">
        <h2 class="text-lg font-bold text-white">${profile.name}</h2>
        <p class="text-xs text-stone-400">${profile.gender} • ${profile.city}</p>
      </div>

      <div class="w-full glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-3 mt-2">
        <h3 class="text-xs font-bold text-slate-300 border-b border-white/10 pb-2">Statistik Karakter</h3>
        
        <div class="flex justify-between items-center text-xs">
          <span class="text-stone-400">Kecerdasan</span>
          <span class="font-bold text-purple-400">Lv. ${stats.kecerdasan?.level || 1}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-stone-400">Fisik</span>
          <span class="font-bold text-rose-400">Lv. ${stats.fisik?.level || 1}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-stone-400">Sosial</span>
          <span class="font-bold text-cyan-400">Lv. ${stats.sosial?.level || 1}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-stone-400">Pesona</span>
          <span class="font-bold text-amber-400">Lv. ${stats.pesona?.level || 1}</span>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons({ nodes: [container] });
}
