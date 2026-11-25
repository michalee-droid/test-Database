import { getState, patchState } from '../core/state.js';
import { saveState, wallet } from '../core/storage.js';
import { AREAS } from '../data/locations.js';
import { VEHICLES } from '../data/vehicles.js';

export function initTransport() {
  const btn = document.getElementById('btnOpenTransportModal');
  if (!btn) return;

  // Buat elemen Modal secara dinamis dan masukkan ke body
  const modalHTML = `
    <div id="transportLocationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300" style="opacity: 0; pointer-events: none;">
      <div class="glass-modal-transparent rounded-3xl p-5 sm:p-7 max-w-xl w-full flex flex-col transform scale-95 transition-all duration-300 border border-white/20 shadow-2xl relative max-h-[85vh] overflow-hidden">
        
        <div class="flex items-center justify-between pb-4 border-b border-white/15 mb-4 shrink-0">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-2xl bg-cyan-400/20 border border-cyan-300/30 text-cyan-200">
              <i data-lucide="navigation" class="w-6 h-6"></i>
            </div>
            <div>
              <h3 class="font-serif text-xl font-bold text-white">Pilih Transportasi</h3>
              <p class="text-xs text-stone-300">Pilih kendaraan menuju lokasi.</p>
            </div>
          </div>
          <button id="btnCloseTransport" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-stone-200 hover:text-white flex items-center justify-center cursor-pointer">✕</button>
        </div>

        <div class="overflow-y-auto pr-1 flex-1">
          <!-- Step 1: Pilih Moda -->
          <div id="stepTransportOptions" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="col-span-full text-xs font-bold text-stone-400 mb-1">Kendaraan Pribadi</div>
            <div id="pribadiGrid" class="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-2"></div>
            
            <div class="col-span-full text-xs font-bold text-stone-400 mt-2 mb-1">Transportasi Umum / Berbayar</div>
            <div id="umumGrid" class="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-2"></div>
          </div>

          <!-- Step 2: Pilih Lokasi -->
          <div id="stepLocationOptions" class="hidden flex-col gap-3">
            <div class="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10 mb-2">
              <span id="selectedVehicleLabel" class="text-xs font-bold text-cyan-300">Kendaraan: -</span>
              <button id="btnBackToTransport" class="text-[10px] text-amber-300 hover:underline cursor-pointer">Ganti Moda</button>
            </div>
            <div id="locationCardsGrid" class="grid grid-cols-2 gap-2.5"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('transportLocationModal');
  const stepTransport = document.getElementById('stepTransportOptions');
  const stepLocation = document.getElementById('stepLocationOptions');
  const pribadiGrid = document.getElementById('pribadiGrid');
  const umumGrid = document.getElementById('umumGrid');
  const locGrid = document.getElementById('locationCardsGrid');
  
  let selectedVehicle = null;

  // Buka Modal
  btn.addEventListener('click', () => {
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.querySelector('.glass-modal-transparent').style.transform = 'scale(1)';
    renderVehicles();
    showStep(1);
    if (window.lucide) window.lucide.createIcons();
  });

  // Tutup Modal
  document.getElementById('btnCloseTransport').addEventListener('click', closeModal);

  function closeModal() {
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.querySelector('.glass-modal-transparent').style.transform = 'scale(0.95)';
  }

  function showStep(step) {
    if (step === 1) {
      stepTransport.classList.remove('hidden');
      stepLocation.classList.add('hidden');
      stepLocation.classList.remove('flex');
    } else {
      stepTransport.classList.add('hidden');
      stepLocation.classList.remove('hidden');
      stepLocation.classList.add('flex');
    }
  }

  // Render Tombol Kendaraan
  function renderVehicles() {
    const state = getState();
    const currentLoc = state.location.areaId;

    pribadiGrid.innerHTML = Object.values(VEHICLES).filter(v => v.type === 'pribadi').map(v => {
      // Cek apakah user punya kendaraan ini
      const owned = state.ownedVehicles.find(ov => ov.vehicleId === v.id);
      const isHere = owned && owned.currentLocation === currentLoc;
      
      let statusText = '';
      let disabled = '';
      
      if (!owned) {
        statusText = 'Belum Dibeli';
        disabled = 'opacity-50 cursor-not-allowed';
      } else if (!isHere) {
        statusText = `Tertinggal di ${AREAS[owned.currentLocation]?.name || owned.currentLocation}`;
        disabled = 'opacity-50 cursor-not-allowed';
      } else {
        statusText = 'Siap Digunakan';
      }

      return `
        <button class="glass-panel p-3 rounded-xl text-left border border-white/10 hover:border-cyan-400/50 transition-all v-btn ${disabled}" ${disabled ? 'disabled' : `data-id="${v.id}"`}>
          <div class="flex items-center gap-2 mb-1">
            <i data-lucide="${v.icon}" class="w-4 h-4 text-cyan-300"></i>
            <span class="font-bold text-sm text-white">${v.name}</span>
          </div>
          <span class="text-[10px] text-stone-400">${statusText}</span>
        </button>
      `;
    }).join('');

    umumGrid.innerHTML = Object.values(VEHICLES).filter(v => v.type === 'umum').map(v => `
      <button class="glass-panel p-3 rounded-xl text-left border border-white/10 hover:border-emerald-400/50 transition-all v-btn" data-id="${v.id}">
        <div class="flex items-center gap-2 mb-1">
          <i data-lucide="${v.icon}" class="w-4 h-4 text-emerald-300"></i>
          <span class="font-bold text-sm text-white">${v.name}</span>
        </div>
        <span class="text-[10px] text-stone-400">Biaya: Rp ${v.cost}</span>
      </button>
    `).join('');

    // Event Listener Pilih Kendaraan
    document.querySelectorAll('.v-btn:not([disabled])').forEach(b => {
      b.addEventListener('click', (e) => {
        const vId = e.currentTarget.dataset.id;
        selectedVehicle = VEHICLES[vId];
        openLocationStep();
      });
    });
  }

  // Render Pilihan Lokasi
  function openLocationStep() {
    document.getElementById('selectedVehicleLabel').innerHTML = `Kendaraan: <span class="text-white">${selectedVehicle.name}</span>`;
    showStep(2);

    locGrid.innerHTML = Object.entries(AREAS).map(([key, area]) => {
      // Jangan tampilkan lokasi saat ini
      if (key === getState().location.areaId) return '';
      
      return `
        <button class="glass-panel p-3 rounded-xl text-left border border-white/10 hover:border-amber-400/50 transition-all loc-btn" data-loc="${key}">
          <span class="font-bold text-sm text-white block">${area.name}</span>
          <span class="text-[10px] text-stone-400 block mt-1">${area.rooms.length} Ruangan</span>
        </button>
      `;
    }).join('');

    document.querySelectorAll('.loc-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const locId = e.currentTarget.dataset.loc;
        executeTravel(locId);
      });
    });
    if (window.lucide) window.lucide.createIcons();
  }

  // Eksekusi Perjalanan
  async function executeTravel(destId) {
    const state = getState();
    
    // 1. Cek Uang (Jika kendaraan umum)
    if (selectedVehicle.cost > 0) {
      if (state.stats.uang < selectedVehicle.cost) {
        alert("Uang tidak cukup untuk naik " + selectedVehicle.name);
        return;
      }
      try {
        await wallet.transact({ type: 'expense', amount: -selectedVehicle.cost, label: `Naik ${selectedVehicle.name}` });
      } catch (err) {
        alert(err);
        return;
      }
    }

    // 2. Logika Kendaraan Pribadi (Tinggalkan kendaraan di lokasi saat ini)
    let newOwnedVehicles = [...state.ownedVehicles];
    
    if (selectedVehicle.type === 'pribadi') {
      // Cari kendaraan yang dipakai, pastikan posisinya diperbarui ke tujuan
      const vIndex = newOwnedVehicles.findIndex(v => v.vehicleId === selectedVehicle.id);
      if (vIndex !== -1) {
        newOwnedVehicles[vIndex].currentLocation = destId;
        // Kurangi kondisi kendaraan (opsional)
        newOwnedVehicles[vIndex].condition = Math.max(0, (newOwnedVehicles[vIndex].condition || 100) - 5);
      }
    } 
    // Catatan: Jika naik kendaraan umum, kendaraan pribadi otomatis ditinggal di lokasi saat ini (tidak diupdate lokasinya).

    // 3. Pindah Lokasi (Ambil ruangan pertama)
    const newArea = AREAS[destId];
    const firstRoom = newArea.rooms[0];

    patchState({
      location: { areaId: destId, roomId: firstRoom, label: `${newArea.name} • ${firstRoom}` },
      ownedVehicles: newOwnedVehicles
    });

    // 4. Simpan & Log
    saveState(true);
    window.__journal?.push({ 
      type: 'travel', 
      text: `Bepergian ke ${newArea.name} menggunakan ${selectedVehicle.name}.` 
    });

    // 5. Refresh UI Topbar & Tutup Modal
    document.getElementById('currentLocNameText').textContent = `${newArea.name} • ${firstRoom}`;
    closeModal();
  }

  // Tombol Ganti Moda
  document.getElementById('btnBackToTransport').addEventListener('click', () => {
    showStep(1);
  });
}
