export function initTransport() {
  // Bypass sementara
  const btn = document.getElementById('btnOpenTransportModal');
  if (btn) {
    btn.addEventListener('click', () => {
      // Arahkan ke travel.html
      window.location.href = 'travel.html?to=Pasar&dur=2000';
    });
  }
}
