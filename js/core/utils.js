export const MONTH_NAMES = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

export function formatRupiah(n) {
  return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
}

export function formatSimTime({ month, year }) {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function formatClock(date = new Date()) {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
