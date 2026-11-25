import { getState, patchState } from '../core/state.js';
import { saveState } from '../core/storage.js';
import { JOB_SECTORS, JOBS } from '../data/jobs.js';
import { applyForJob } from '../firebase/firestore.js';
import { getUid } from '../core/storage.js';

const USD_TO_IDR = 15000; // Kurs simulasi

export function renderFreelanceApp(container) {
  renderSectors(container);

  function renderSectors(container) {
    container.innerHTML = `
      <div class="flex flex-col gap-4">
        <p class="text-xs text-stone-300">Pilih sektor pekerjaan yang ingin Anda tekuni:</p>
        <div class="grid grid-cols-2 gap-3">
          ${JOB_SECTORS.map(sec => `
            <button data-sector="${sec.id}" class="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 hover:border-${sec.color}-400/60 hover:bg-${sec.color}-500/10 transition-all cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-${sec.color}-950/70 border border-${sec.color}-400/40 p-2 text-${sec.color}-300 flex items-center justify-center">
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
      btn.addEventListener('click', () => renderJobsList(container, btn.dataset.sector));
    });
  }

  function renderJobsList(container, sectorId) {
    const jobs = JOBS.filter(j => j.sector === sectorId);
    const sector = JOB_SECTORS.find(s => s.id === sectorId);

    container.innerHTML = `
      <div class="flex flex-col gap-4 animate-slide-in">
        <button id="btnBackSector" class="text-xs text-amber-300 font-semibold flex items-center gap-1 mb-2">
          <i data-lucide="chevron-left" class="w-4 h-4"></i> Kembali ke Sektor
        </button>
        <h3 class="font-serif text-lg font-bold text-white border-b border-white/10 pb-2">Lowongan: ${sector.name}</h3>
        
        <div class="flex flex-col gap-3">
          ${jobs.map(job => `
            <div class="glass-panel p-4 rounded-2xl flex flex-col gap-3 border border-white/10">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-sm text-white">${job.title}</h4>
                  <p class="text-[10px] text-stone-400 mt-1">${job.desc}</p>
                </div>
                <span class="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded-lg border border-emerald-500/30">$${job.salaryUSD}</span>
              </div>
              <div class="flex items-center justify-between text-[10px] text-stone-300 bg-black/30 p-2 rounded-lg">
                <span class="flex items-center gap-1"><i data-lucide="zap" class="w-3 h-3 text-amber-400"></i> -${job.energyCost} Energi</span>
                <span class="flex items-center gap-1"><i data-lucide="lock" class="w-3 h-3 text-cyan-400"></i> Syarat: Lv.${job.req.kecerdasan||job.req.fisik||job.req.sosial} ${job.req.kecerdasan?'Kecerdasan':(job.req.fisik?'Fisik':'Sosial')}</span>
              </div>
              <button class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all btn-apply" data-id="${job.id}">Lamar Pekerjaan</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ nodes: [container] });

    document.getElementById('btnBackSector').addEventListener('click', () => renderSectors(container));

    container.querySelectorAll('.btn-apply').forEach(btn => {
      btn.addEventListener('click', () => handleApply(btn.dataset.id, container));
    });
  }

  async function handleApply(jobId, container) {
    const state = getState();
    const job = JOBS.find(j => j.id === jobId);
    
    // Validasi Syarat
    if (state.stats.energi < job.energyCost) return alert('Energi tidak cukup!');
    if (state.stats.kelaparan < 10) return alert('Anda terlalu lapar untuk bekerja!');
    
    // Validasi Level (contoh cek kecerdasan)
    if (job.req.kecerdasan && state.stats.kecerdasan.level < job.req.kecerdasan) {
      return alert(`Butuh Kecerdasan Level ${job.req.kecerdasan}!`);
    }
    if (job.req.fisik && state.stats.fisik.level < job.req.fisik) {
      return alert(`Butuh Fisik Level ${job.req.fisik}!`);
    }

    try {
      const gajiIDR = job.salaryUSD * USD_TO_IDR;
      
      // Panggil Firebase (potong energi, tambah uang)
      await applyForJob(getUid(), { salary: gajiIDR, jobId: job.id });
      
      // Update State Lokal
      patchState({
        stats: {
          ...state.stats,
          energi: state.stats.energi - job.energyCost,
          kelaparan: Math.max(0, state.stats.kelaparan - 10),
          uang: state.stats.uang + gajiIDR
        }
      });
      
      window.__journal?.push({ type: 'kerja', text: `Menyelesaikan pekerjaan ${job.title}. Mendapat $${job.salaryUSD} (Rp ${gajiIDR.toLocaleString('id-ID')}).` });
      alert(`Berhasil! Anda mendapatkan Rp ${gajiIDR.toLocaleString('id-ID')}`);
      
      renderJobsList(container, job.sector); // Refresh UI
    } catch (error) {
      alert('Gagal bekerja: ' + error);
    }
  }
}
