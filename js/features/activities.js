import { patchState, getState } from '../core/state.js';
import { saveState } from '../core/storage.js';
import { ACTIVITIES_DATA } from '../data/activities.js';

export function initActivities() {
  const btn = document.getElementById('btnOpenActivitiesMenu');
  const modal = document.getElementById('activitiesMenuModal');
  const grid = document.getElementById('activitiesGridContainer');
  
  if (!modal) return;

  btn.addEventListener('click', () => {
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.querySelector('.glass-modal-transparent').style.transform = 'scale(1)';
    renderActivities(); // Render ulang setiap kali modal dibuka
  });

  function renderActivities() {
    const state = getState();
    const currentRoom = state.location.roomId; // Mengambil nama ruangan saat ini
    
    // Filter aktivitas yang hanya tersedia di ruangan ini
    const availableActivities = ACTIVITIES_DATA.filter(act => 
      act.targetRooms.includes(currentRoom)
    );

    if (availableActivities.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-6">
          <i data-lucide="map-pin" class="w-10 h-10 text-stone-500 mx-auto mb-2 opacity-50"></i>
          <p class="text-sm font-bold text-stone-300">Tidak Ada Aktivitas</p>
          <p class="text-xs text-stone-500 mt-1">Anda tidak bisa melakukan apa-apa di <b>${currentRoom}</b>. Silakan pindah ruangan.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons({ nodes: [grid] });
      return;
    }

    grid.innerHTML = availableActivities.map(act => `
      <button class="glass-panel p-4 rounded-xl text-left border border-white/10 hover:border-emerald-400/50 act-btn" data-id="${act.id}">
        <div class="flex items-center gap-2 mb-1">
          <i data-lucide="${act.icon}" class="w-4 h-4 text-emerald-300"></i>
          <h4 class="font-bold text-white text-sm">${act.name}</h4>
        </div>
        <p class="text-[10px] text-stone-400 mb-2">${act.desc}</p>
        <div class="flex justify-between items-center text-[9px] font-bold">
          <span class="text-amber-300">Waktu: ${act.timeCost} Jam</span>
          <span class="${act.cost > 0 ? 'text-rose-400' : 'text-emerald-400'}">
            ${act.cost > 0 ? 'Biaya: Rp ' + act.cost : 'Gratis'}
          </span>
        </div>
      </button>
    `).join('');

    if (window.lucide) window.lucide.createIcons({ nodes: [grid] });

    // Pasang Event Listener
    grid.querySelectorAll('.act-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        executeActivity(e.currentTarget.dataset.id);
      });
    });
  }

  function executeActivity(activityId) {
    const state = getState();
    const act = ACTIVITIES_DATA.find(a => a.id === activityId);
    
    // 1. Validasi Uang
    if (act.cost > 0 && state.stats.uang < act.cost) {
      return alert(`Uang tidak cukup! Butuh Rp ${act.cost}.`);
    }

    // 2. Hitung Efek Stat
    const newStats = { ...state.stats };
    
    if (act.effects.energi) newStats.energi = Math.max(0, Math.min(100, newStats.energi + act.effects.energi));
    if (act.effects.kesegaran) newStats.kesegaran = Math.max(0, Math.min(100, newStats.kesegaran + act.effects.kesegaran));
    if (act.effects.kebahagiaan) newStats.kebahagiaan = Math.max(0, Math.min(100, newStats.kebahagiaan + act.effects.kebahagiaan));
    if (act.effects.kelaparan) newStats.kelaparan = Math.max(0, Math.min(100, newStats.kelaparan + act.effects.kelaparan));
    if (act.effects.kebersihan) newStats.kebersihan = Math.max(0, Math.min(100, newStats.kebersihan + act.effects.kebersihan));
    
    // Handle XP (Naik Level Sederhana)
    if (act.effects.kecerdasanXP) {
      newStats.kecerdasan.xp += act.effects.kecerdasanXP;
      if (newStats.kecerdasan.xp >= 100) { newStats.kecerdasan.level++; newStats.kecerdasan.xp = 0; }
    }
    if (act.effects.fisikXP) {
      newStats.fisik.xp += act.effects.fisikXP;
      if (newStats.fisik.xp >= 100) { newStats.fisik.level++; newStats.fisik.xp = 0; }
    }

    // 3. Kurangi Uang
    newStats.uang -= act.cost;

    // 4. Hitung Waktu Baru
    const newTime = { ...state.time };
    newTime.hour += act.timeCost;
    
    // Jika lewat tengah malam, ganti hari
    while (newTime.hour >= 24) {
      newTime.hour -= 24;
      newTime.day += 1;
      // Jika lewat 30 hari, ganti bulan
      if (newTime.day > 30) {
        newTime.day = 1;
        newTime.month += 1;
        if (newTime.month > 11) {
          newTime.month = 0;
          newTime.year += 1;
        }
      }
    }

    // 5. Simpan Perubahan
    patchState({ stats: newStats, time: newTime });
    saveState();
    
    window.__journal?.push({ 
      type: act.id, 
      text: `Melakukan ${act.name} di ${state.location.roomId}. Waktu berlalu ${act.timeCost} jam.` 
    });

    // Tutup modal & beri notifikasi
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.querySelector('.glass-modal-transparent').style.transform = 'scale(0.95)';
    alert(`Berhasil melakukan ${act.name}!`);
  }
}
