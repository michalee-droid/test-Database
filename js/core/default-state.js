export const defaultState = {
  profile: { name: 'Pemain', gender: 'Laki-Laki', city: 'Jakarta' },
  stats: {
    uang: 150,
    energi: 100,
    kesegaran: 80,
    kebahagiaan: 75,
    kelaparan: 100, // BARU: Makin rendah makin lapar
    kebersihan: 100, // BARU: Makin rendah mempengaruhi pesona
    fisik: { level: 1, xp: 0 },
    kecerdasan: { level: 1, xp: 0 },
    sosial: { level: 1, xp: 0 },
    pesona: { level: 1, xp: 0 },
  },
  time: { month: 0, year: 2026 },
  weather: { temp: 28, condition: 'Cerah', icon: 'sun' },
  location: { areaId: 'rumah', roomId: 'kamar-tidur', label: 'Rumah Saya • Kamar Tidur' },
  ownedVehicles: [], // { vehicleId: 'motor', currentLocation: 'lapangan', condition: 100 }
  properties: [],
  portfolio: [],
  marketPrices: { 'BBCA': 9000, 'BTC': 900000000 } // BARU: Harga saham/crypto dinamis
};
