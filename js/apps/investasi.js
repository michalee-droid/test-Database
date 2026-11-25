import { getState, patchState } from '../core/state.js';
import { saveState } from '../core/storage.js';

export function renderInvestasiApp(container) {
  const state = getState();
  const market = state.marketPrices || {};
  const portfolio = state.portfolio || [];

  container.innerHTML = `
    <div class="flex flex-col gap-4">
      <div class="bg-gradient-to-r from-cyan-900/60 to-stone-900/80 p-4 rounded-2xl border border-cyan-400/30">
        <h3 class="text-white font-bold text-sm">Pasar Modal</h3>
        <p class="text-[10px] text-stone-300 mt-1">Harga berfluktuasi setiap bulan.</p>
      </div>

      <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider">Daftar Aset</h3>
      <div class="flex flex-col gap-2">
        ${[
          { id: 'BBCA', name: 'Bank Central Asia', type: 'Saham' },
          { id: 'BTC', name: 'Bitcoin', type: 'Crypto' }
        ].map(asset => {
          const price = market[asset.id] || 0;
          return `
            <div class="glass-panel p-3 rounded-xl flex items-center justify-between border border-white/10">
              <div>
                <p class="text-xs font-bold text-white">${asset.name} <span class="text-[9px] text-stone-400">(${asset.id})</span></p>
                <p class="text-[10px] text-cyan-300 font-mono mt-0.5">Rp ${price.toLocaleString('id-ID')}</p>
              </div>
              <div class="flex gap-1">
                <button class="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg btn-trade" data-action="buy" data-id="${asset.id}">Beli</button>
                <button class="px-3 py-1 bg-rose-600/80 hover:bg-rose-500 text-white text-[10px] font-bold rounded-lg btn-trade" data-action="sell" data-id="${asset.id}">Jual</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${portfolio.length > 0 ? `
        <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider mt-4">Portofolio Anda</h3>
        <div class="flex flex-col gap-2">
          ${portfolio.map(p => `
            <div class="bg-black/30 p-3 rounded-xl flex justify-between items-center border border-white/5">
              <div>
                <span class="text-xs font-bold text-white">${p.assetId}</span>
                <span class="text-[10px] text-stone-400 block">${p.qty} Lembar</span>
              </div>
              <span class="text-[10px] text-stone-400">Avg: Rp ${p.avgPrice.toLocaleString('id-ID')}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  container.querySelectorAll('.btn-trade').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.dataset.action;
      const assetId = e.currentTarget.dataset.id;
      const price = market[assetId];
      
      if (action === 'buy') {
        const qty = 1; // Simulasi beli 1 lembar
        const cost = price * qty;
        if (state.stats.uang < cost) return alert('Uang tidak cukup!');
        
        const newPortfolio = [...portfolio];
        const existing = newPortfolio.find(p => p.assetId === assetId);
        if (existing) {
          existing.qty += qty;
          existing.avgPrice = (existing.avgPrice + price) / 2;
        } else {
          newPortfolio.push({ assetId, qty, avgPrice: price });
        }

        patchState({ stats: { ...state.stats, uang: state.stats.uang - cost }, portfolio: newPortfolio });
        window.__journal?.push({ type: 'investasi', text: `Membeli ${qty} lembar ${assetId}.` });
        saveState();
        renderInvestasiApp(container);
      } else {
        const existing = portfolio.find(p => p.assetId === assetId);
        if (!existing) return alert('Anda tidak punya aset ini!');
        
        const revenue = price * existing.qty;
        const newPortfolio = portfolio.filter(p => p.assetId !== assetId);
        
        patchState({ stats: { ...state.stats, uang: state.stats.uang + revenue }, portfolio: newPortfolio });
        window.__journal?.push({ type: 'investasi', text: `Menjual ${existing.qty} lembar ${assetId} seharga Rp ${revenue.toLocaleString('id-ID')}.` });
        saveState();
        renderInvestasiApp(container);
      }
    });
  });
}
