export function renderChatApp(container) {
  const chats = [
    { name: 'Ibu', msg: 'Kapan pulang ke rumah nak?', time: '10:30', unread: 2 },
    { name: 'HRD Perusahaan', msg: 'Selamat, lamaran Anda diterima.', time: 'Kemarin', unread: 0 },
    { name: 'Teman Kampus', msg: 'Ayo nongkrong di kafe nanti sore!', time: 'Kemarin', unread: 0 },
  ];

  container.innerHTML = `
    <div class="flex flex-col gap-2 animate-slide-in">
      ${chats.map(c => `
        <div class="glass-panel p-3 rounded-xl flex items-center justify-between border border-white/10 hover:bg-white/5 cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-blue-900/50 text-blue-300 flex items-center justify-center font-bold">
              ${c.name[0]}
            </div>
            <div>
              <span class="text-xs font-bold text-white block">${c.name}</span>
              <span class="text-[10px] text-stone-400 block max-w-[150px] truncate">${c.msg}</span>
            </div>
          </div>
          <div class="text-right flex flex-col items-end gap-1">
            <span class="text-[9px] text-stone-500">${c.time}</span>
            ${c.unread > 0 ? `<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">${c.unread}</span>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
