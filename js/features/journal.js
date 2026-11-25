import { journal } from '../core/storage.js';
import { subscribe } from '../core/state.js';

export function initJournal() {
  const stack = document.getElementById('journalStack');
  const clearBtn = document.getElementById('btnClearLogs');

  function renderEntry(entry, prepend = true) {
    const el = document.createElement('div');
    el.className = 'journal-entry glass-panel px-3 py-2 rounded-xl text-[11px] text-stone-100 flex items-start gap-2 animate-slide-in';
    el.innerHTML = `
      <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-300 mt-0.5 shrink-0"></i>
      <div class="flex-1">
        <p>${entry.text}</p>
        <span class="text-[9px] text-stone-400">${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    `;
    if (prepend) stack.prepend(el);
    else stack.append(el);
    if (window.lucide) window.lucide.createIcons({ nodes: [el] });
  }

  // Load awal
  journal.recent(20).then(entries => {
    stack.innerHTML = '';
    entries.reverse().forEach(e => renderEntry(e, false));
  });

  clearBtn.addEventListener('click', async () => {
    if (!confirm('Hapus semua catatan jurnal?')) return;
    await journal.clear();
    stack.innerHTML = '';
  });

  window.__journal = {
    push: async (entry) => {
      const saved = await journal.add(entry);
      renderEntry({ ...entry, id: saved?.id });
    }
  };
}
