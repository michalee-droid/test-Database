import { getState, patchState } from '../core/state.js';
import { getUid } from '../core/storage.js';
import { applyForJob } from '../firebase/firestore.js';
import { JOB_SECTORS, JOBS } from '../data/jobs.js';

const USD_TO_IDR = 15000;

export function renderFreelanceApp(container) {
  renderSectors();

  function renderSectors() {
    container.innerHTML = `
      <div class="flex flex-col gap-4 animate-slide-in">
        <p class="text-xs text-stone-300">Pilih sektor pekerjaan:</p>
        <div class="grid grid-cols-2 gap-3">
          ${JOB_SECTORS.map(sec => `
            <button data-sector="${sec.id}" class="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 hover:border-${sec.color}-400/60 transition-all cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-${sec.color}-950/70 border border-${sec.color}-400/40 text-${sec.color}-300 flex items-center justify-center">
                <i data-lucide="${sec.icon}" class="w-5 h-5"></i>
              </div>
              <span class="font-bold text-xs text-white">${sec.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ nodes: [container] });

    container.querySelectorAll('[data-sector]').forEach(btn => {
      btn.addEventListener('click', () => renderJobsList(btn.dataset.sector));
    });
  }

  function renderJobsList(sectorId) {
    const jobs = JOBS.filter(j => j.sector === sectorId);
    const sector = JOB_SECTORS.find(s => s.id === sectorId);

    container.innerHTML = `
      <div class="flex flex-col gap-4 animate-slide-in">
        <button id="btnBackSector" class="text-xs text-amber-300 font-semibold flex items-center gap-1 mb-2 cursor-pointer">
          <i data-lucide="chevron-left" class="w-4 h-4"></i> Kembali
        </button>
        <h3 class="font-serif text-lg font-bold text-white border-b border-white/10 pb-2">${sector.name}</h3>
        
        <div class="flex flex-col gap-3">
          ${jobs.map(job => `
            <div class="glass-panel p-4 rounded-2xl flex flex-col gap-3 border border-white/10">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-sm text-white">${job.title}</h4>
                  <p class="text-[10px] text-stone-400 mt-1">${job.desc}</p>
                </div>
                <span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-lg">$${job.salaryUSD}</span>
              </div>
              <div class="flex items-center justify-between text-[10px] text-stone-300 bg-black/30 p-2 rounded-lg">
                <span class="text-amber-400">-${job.energyCost} Energi</span>
                <span class="text-cyan-400">Butuh Lv.${job.req.kecerdasan||job.req.fisik||job.req.sosial}</span>
              </div>
              <button class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl btn-apply" data-id="${job.id}">Lamar</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ nodes: [container] });
    document.getElementById('btnBackSector').addEventListener('click', renderSectors);

    container.querySelectorAll('.btn-apply').forEach(btn => {
      btn.addEventListener('click', () => handleApply(btn.dataset.id, job => renderJobsList(job.sector)));
    });
  }

  async function handleApply(jobId, refreshCallback) {
    const state = getState();
    const job = JOBS.find(j => j.id === jobId);
    
    if (state.stats.energi < job.energyCost) return alert('Energi tidak cukup!');
    if (state.stats.kelaparan < 10) return alert('Anda lapar, silakan makan dulu!');

    try {
      const gajiIDR = job.salaryUSD * USD_TO_IDR;
      await applyForJob(getUid(), { salary: gajiIDR, jobId: job.id });
      
      patchState({ stats: { 
        ...state.stats, 
        energi: state.stats.energi - job.energyCost, 
        kelaparan: Math.max(0, state.stats.kelaparan - 10), 
        uang: state.stats.uang + gajiIDR 
      }});
      
      window.__journal?.push({ type: 'kerja', text: `Menyelesaikan ${job.title}. Gaji: Rp ${gajiIDR.toLocaleString('id-ID')}` });
      alert(`Sukses! Gaji Rp ${gajiIDR.toLocaleString('id-ID')} masuk ke dompet.`);
      refreshCallback(job);
    } catch (error) { alert('Gagal: ' + error); }
  }
}
