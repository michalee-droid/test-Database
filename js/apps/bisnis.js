import { getState, patchState } from '../core/state.js';
import { saveState, getUid } from '../core/storage.js';
import { buyProperty } from '../firebase/firestore.js';

const USD_TO_IDR = 15000;

export async function renderBisnisApp(container) {
  const state = getState();
  const properties = state.properties || [];

  container.innerHTML = `
    <div class="flex flex-col gap-4">
      <div class="bg-gradient-to-r from-indigo-900/60 to-stone-900/80 p-4 rounded-2xl border border-indigo-400/30">
        <h3 class="text-white font-bold text-sm">Portofolio Properti</h3>
        <p class="text-xs text-stone-300 mt-1">Total Aset: <span class="text-emerald-400 font-bold">${properties.length} Unit</span></p>
      </div>

      <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider">Pasar Properti (Harga USD)</h3>
      <div class="flex flex-col gap-3">
        ${[
          { id: 'kos', name: 'Kos-Kosan Mahasiswa', priceUSD: 500, rentUSD: 50, type: 'Hunian' },
          { id: 'ruko', name: 'Ruko Pertokoan', priceUSD: 20000, rentUSD: 1500, type: 'Bisnis' },
          { id: 'mansion', name: 'Mansion Mewah', priceUSD: 500000, rentUSD: 20000, type: 'Hunian' }
        ].map(p => `
          <div class="glass-panel p-4 rounded-2xl flex flex-col gap-2 border border-white/10">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-sm text-white">${p.name}</h4>
                <span class="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md mt-1 inline-block">${p.type}</span>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-amber-300 block">$${p.priceUSD.toLocaleString('en-US')}</span>
                <span class="text-[9px] text-stone-400">~ Rp ${(p.priceUSD * USD_TO_IDR).toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div class="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
              <span class="text-[10px] text-stone-300">Sewa/bulan: <span class="text-emerald-400 font-bold">$${p.rentUSD}</span></span>
              <button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all btn-buy-prop" data-id="${p.id}" data-price="${p.priceUSD * USD_TO_IDR}" data-name="${p.name}" data-rent="${p.rentUSD}">Beli</button>
            </div>
          </div>
        `).join('')}
      </div>

      ${properties.length > 0 ? `
        <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider mt-4">Properti Anda</h3>
        <div class="flex flex-col gap-2">
          ${properties.map(p => `
            <div class="bg-black/30 p-3 rounded-xl flex justify-between items-center border border-white/5">
              <span class="text-xs text-white">${p.name}</span>
              <span class="text-[10px] text-emerald-400">+ $${p.rentUSD}/bln</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  container.querySelectorAll('.btn-buy-prop').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const price = parseInt(e.currentTarget.dataset.price);
      const name = e.currentTarget.dataset.name;
      const rent = parseInt(e.currentTarget.dataset.rent);
      
      if (state.stats.uang < price) return alert('Uang tidak mencukupi!');

      try {
        await buyProperty(getUid(), { id: e.currentTarget.dataset.id, name, rentUSD: rent }, price);
        
        patchState({ stats: { ...state.stats, uang: state.stats.uang - price } });
        window.__journal?.push({ type: 'bisnis', text: `Membeli properti ${name} seharga $${price / USD_TO_IDR}` });
        alert(`Berhasil membeli ${name}!`);
        renderBisnisApp(container); // Refresh UI
      } catch (err) { alert(err); }
    });
  });
}
