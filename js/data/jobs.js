export const JOB_SECTORS = {
  'teknologi': { name: 'Teknologi & IT', icon: 'cpu' },
  'kreatif': { name: 'Industri Kreatif', icon: 'palette' },
};

export const JOBS = [
  { 
    id: 'web-dev', 
    sector: 'teknologi', 
    title: 'Web Developer', 
    salaryUSD: 50, // Dolar per proyek
    requirements: { kecerdasan: 2, energi: 20 },
    desc: 'Membuat landing page untuk klien.' 
  },
  { 
    id: 'desain-logo', 
    sector: 'kreatif', 
    title: 'Desainer Logo', 
    salaryUSD: 30, 
    requirements: { pesona: 1, energi: 15 },
    desc: 'Membuat identitas visual UMKM.' 
  }
];
