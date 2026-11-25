export const JOB_SECTORS = [
  { id: 'teknologi', name: 'Teknologi & IT', icon: 'cpu', color: 'indigo' },
  { id: 'kreatif', name: 'Industri Kreatif', icon: 'palette', color: 'pink' },
  { id: 'jasa', name: 'Jasa & Pelayanan', icon: 'briefcase', color: 'emerald' },
  { id: 'fisik', name: 'Pekerjaan Fisik', icon: 'hammer', color: 'amber' }
];

export const JOBS = [
  { id: 'web-dev', sector: 'teknologi', title: 'Web Developer', salaryUSD: 50, energyCost: 20, req: { kecerdasan: 2 }, desc: 'Memperbaiki bug website klien.' },
  { id: 'data-entry', sector: 'teknologi', title: 'Data Entry', salaryUSD: 20, energyCost: 15, req: { kecerdasan: 1 }, desc: 'Input data ke sistem perusahaan.' },
  { id: 'desain-logo', sector: 'kreatif', title: 'Desainer Logo', salaryUSD: 40, energyCost: 15, req: { pesona: 1 }, desc: 'Membuat identitas visual UMKM.' },
  { id: 'penulis', sector: 'kreatif', title: 'Penulis Lepas', salaryUSD: 35, energyCost: 10, req: { kecerdasan: 2 }, desc: 'Menulis artikel blog.' },
  { id: 'kurir', sector: 'jasa', title: 'Kurir Paket', salaryUSD: 25, energyCost: 25, req: { fisik: 1 }, desc: 'Mengantar paket pelanggan.' },
  { id: 'kuli', sector: 'fisik', title: 'Kuli Bangunan', salaryUSD: 45, energyCost: 40, req: { fisik: 2 }, desc: 'Mengangkat material bangunan.' }
];
