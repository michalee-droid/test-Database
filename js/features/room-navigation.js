export function initRoomNavigation() {
  // Sementara kita bypass dulu karena fitur room butuh data statis
  const btn = document.getElementById('btnOpenRoomMenu');
  if (btn) {
    btn.addEventListener('click', () => alert('Fitur Navigasi Ruangan segera hadir!'));
  }
}
