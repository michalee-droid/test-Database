export const JOB_SECTORS = [
  { id: 'teknologi', name: 'Teknologi & IT', icon: 'cpu', color: 'indigo' },
  { id: 'kreatif', name: 'Industri Kreatif', icon: 'palette', color: 'pink' },
  { id: 'jasa', name: 'Jasa & Pelayanan', icon: 'briefcase', color: 'emerald' },
  { id: 'fisik', name: 'Pekerjaan Fisik', icon: 'hammer', color: 'amber' }
];

export const JOBS = [
  // Teknologi
  { 
    id: 'web-dev', sector: 'teknologi', title: 'Web Developer', 
    salaryUSD: 50, energyCost: 20, req: { kecerdasan: 2 }, 
    desc: 'Membuat landing page dan memperbaiki bug pada website klien.' 
  },
  { 
    id: 'data-entry', sector: 'teknologi', title: 'Data Entry', 
    salaryUSD: 20, energyCost: 15, req: { kecerdasan: 1 }, 
    desc: 'Memasukkan data ke dalam sistem perusahaan.' 
  },
  // Kreatif
  { 
    id: 'desain-logo', sector: 'kreatif', title: 'Desainer Logo', 
    salaryUSD: 40, energyCost: 15, req: { pesona: 1, kecerdasan: 1 }, 
    desc: 'Membuat identitas visual (logo) untuk UMKM.' 
  },
  { 
    id: 'penulis', sector: 'kreatif', title: 'Penulis Lepas', 
    salaryUSD: 35, energyCost: 10, req: { kecerdasan: 2 }, 
    desc: 'Menulis artikel blog atau konten media sosial.' 
  },
  // Jasa
  { 
    id: 'kurir', sector: 'jasa', title: 'Kurir Paket', 
    salaryUSD: 25, energyCost: 25, req: { fisik: 1 }, 
    desc: 'Mengantar paket ke alamat pelanggan menggunakan motor.' 
  },
  { 
    id: 'kasir', sector: 'jasa', title: 'Kasir Toko', 
    salaryUSD: 30, energyCost: 20, req: { sosial: 1, pesona: 1 }, 
    desc: 'Melayani pembayaran dan menyapa pelanggan di minimarket.' 
  },
  // Fisik
  { 
    id: 'kuli-bangunan', sector: 'fisik', title: 'Kuli Bangunan', 
    salaryUSD: 45, energyCost: 40, req: { fisik: 2 }, 
    desc: 'Mengangkat material dan membantu pembangunan gedung.' 
  },
  { 
    id: 'bersih-bersih', sector: 'fisik', title: 'Petugas Kebersihan', 
    salaryUSD: 15, energyCost: 30, req: { fisik: 1 }, 
    desc: 'Menyapu jalan dan membersihkan area publik.' 
  }
];
