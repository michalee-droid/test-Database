/**
 * TARGET ROOMS: 
 * Rumah: 'Kamar Tidur', 'Dapur', 'Kamar Mandi'
 * Warung: 'Meja Makan'
 * Kafe: 'Area Indoor', 'Area Outdoor'
 * Lapangan: 'Area Utama'
 * Kampus: 'Perpustakaan'
 */

export const ACTIVITIES_DATA = [
  // --- RUMAH ---
  {
    id: 'tidur', name: 'Tidur', icon: 'bed',
    desc: 'Tidur nyenyak untuk memulihkan tenaga.',
    targetRooms: ['Kamar Tidur'],
    timeCost: 8, // Menghabiskan 8 jam
    cost: 0,
    effects: { energi: 100, kelaparan: -20 } // Energi penuh, tapi lapar
  },
  {
    id: 'mandi', name: 'Mandi', icon: 'droplets',
    desc: 'Membersihkan diri agar lebih segar.',
    targetRooms: ['Kamar Mandi'],
    timeCost: 1,
    cost: 0,
    effects: { kebersihan: 100, kesegaran: 20 }
  },
  {
    id: 'masak', name: 'Masak', icon: 'chef-hat',
    desc: 'Memasak makanan sendiri lebih hemat.',
    targetRooms: ['Dapur'],
    timeCost: 1,
    cost: 10, // Biaya bahan makanan
    effects: { kelaparan: 50, energi: 10 }
  },

  // --- TEMPAT MAKAN ---
  {
    id: 'makan_warung', name: 'Makan di Warung', icon: 'utensils',
    desc: 'Makan sederhana yang mengenyangkan.',
    targetRooms: ['Meja Makan', 'Area Outdoor'],
    timeCost: 1,
    cost: 25,
    effects: { kelaparan: 60, kebahagiaan: 5 }
  },
  {
    id: 'makan_kafe', name: 'Ngopi & Makan', icon: 'coffee',
    desc: 'Makan di kafe untuk suasana yang lebih baik.',
    targetRooms: ['Area Indoor'],
    timeCost: 2,
    cost: 75,
    effects: { kelaparan: 40, kebahagiaan: 15, energi: 20 }
  },

  // --- PENDIDIKAN ---
  {
    id: 'belajar', name: 'Belajar / Baca Buku', icon: 'book-open',
    desc: 'Meningkatkan kecerdasan.',
    targetRooms: ['Perpustakaan', 'Ruang Kelas'],
    timeCost: 3,
    cost: 0,
    effects: { kecerdasanXP: 20, energi: -20, kelaparan: -10 }
  },

  // --- OLAHRAGA ---
  {
    id: 'jogging', name: 'Jogging', icon: 'activity',
    desc: 'Berlari santai mengelilingi lapangan.',
    targetRooms: ['Area Utama', 'Jalur Jogging'],
    timeCost: 2,
    cost: 0,
    effects: { fisikXP: 20, energi: -30, kebersihan: -30, kelaparan: -20 }
  }
];
