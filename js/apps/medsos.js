import { getState, patchState } from '../core/state.js';
import { saveState } from '../core/storage.js';

export function renderMedsosApp(container) {
  const state = getState();
  
  // Simulasi feed statis
  const feed = [
    { user: 'Budi', text: 'Cuaca hari ini panas sekali ya!', time: '2 jam lalu', likes: 12 },
    { user: 'Siti', text: 'Baru saja beli motor baru, mampir yuk ke rumah!', time: '5 jam lalu', likes: 45 },
  ];

  container.innerHTML = `
    <div class="flex flex-col gap-4 animate-slide-in">
      <!-- Form Posting -->
      <div class="glass-panel p-3 rounded-2xl border border-white/10 flex flex-col gap-2">
        <textarea id="postInput" class="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-pink-400/50 resize-none" rows="2" placeholder="Apa yang Anda pikirkan?"></textarea>
        <button id="btnPost" class="self-end px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition-all">Posting</button>
      </div>

      <!-- Feed -->
      <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider mt-2">Beranda</h3>
      <div class="flex flex-col gap-3">
        ${feed.map(f => `
          <div class="glass-panel p-3 rounded-2xl border border-white/5">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded-full bg-stone-600 flex items-center justify-center text-[10px] text-white font-bold">${f.user[0]}</div>
              <div>
                <span class="text-xs font-bold text-white block">${f.user}</span>
                <span class="text-[9px] text-stone-400">${f.time}</span>
              </div>
            </div>
            <p class="text-xs text-stone-200">${f.text}</p>
            <div class="flex items-center gap-1 mt-2 text-[10px] text-pink-400">
              <i data-lucide="heart" class="w-3 h-3"></i> ${f.likes} Suka
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ nodes: [container] });

  document.getElementById('btnPost').addEventListener('click', () => {
    const text = document.getElementById('postInput').value.trim();
    if (!text) return alert('Tulis sesuatu!');
    
    // Efek post: Tambah sosial & kebahagiaan
    patchState({ stats: { 
      ...state.stats, 
      sosial: { ...state.stats.sosial, xp: state.stats.sosial.xp + 10 },
      kebahagiaan: Math.min(100, state.stats.kebahagiaan + 5) 
    }});
    
    window.__journal?.push({ type: 'medsos', text: 'Memposting sesuatu di Medsos (+5 Kebahagiaan)' });
    saveState();
    alert('Postingan berhasil dibagikan! Kebahagiaan bertambah.');
    renderMedsosApp(container); // Refresh
  });
}
