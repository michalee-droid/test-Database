import { getState } from '../core/state.js';
import { wallet } from '../core/storage.js';

export async function renderWalletApp(container) {
  const state = getState();
  const history = await wallet.history(20); 

  container.innerHTML = `
    <div class="flex flex-col gap-4">
      <div class="bg-gradient-to-br from-amber-600 to-amber-900 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-4 -top-4 opacity-20"><i data-lucide="credit-card" class="w-32 h-32"></i></div>
        <span class="text-xs text-amber-200 font-semibold tracking-wider uppercase">Saldo Tersedia</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Rp ${state.stats.uang.toLocaleString('id-ID')}</h2>
        <div class="flex gap-2 mt-4 relative z-10">
          <button id="btnTarik" class="flex-1 py-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-xl text-xs font-bold text-white transition-all">Tarik Tunai</button>
          <button id="btnSetor" class="flex-1 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold text-white transition-all">Setor</button>
        </div>
      </div>

      <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider">Riwayat Mutasi</h3>
      <div class="flex flex-col gap-2">
        ${history.length === 0 ? '<p class="text-xs text-stone-500 text-center py-4">Belum ada transaksi.</p>' : ''}
        ${history.map(tx => {
          const isIncome = tx.amount > 0;
          return `
            <div class="glass-panel p-3 rounded-xl flex items-center justify-between border border-white/5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full ${isIncome ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} flex items-center justify-center">
                  <i data-lucide="${isIncome ? 'arrow-down-left' : 'arrow-up-right'}" class="w-4 h-4"></i>
                </div>
                <div>
                  <p class="text-xs font-bold text-white">${tx.label}</p>
                  <p class="text-[9px] text-stone-400">${tx.ts ? new Date(tx.ts.toDate()).toLocaleString('id-ID') : 'Baru saja'}</p>
                </div>
              </div>
              <span class="text-xs font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}">
                ${isIncome ? '+' : ''}Rp ${tx.amount.toLocaleString('id-ID')}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  document.getElementById('btnSetor').addEventListener('click', async () => {
    try {
      await wallet.transact({ type: 'income', amount: 500, label: 'Setor Tunai' });
      renderWalletApp(container);
    } catch (e) { alert(e); }
  });

  document.getElementById('btnTarik').addEventListener('click', async () => {
    if (state.stats.uang < 100) return alert('Saldo kurang dari Rp 100');
    try {
      await wallet.transact({ type: 'expense', amount: -100, label: 'Tarik Tunai' });
      renderWalletApp(container);
    } catch (e) { alert(e); }
  });

  if (window.lucide) window.lucide.createIcons({ nodes: [container] });
}
