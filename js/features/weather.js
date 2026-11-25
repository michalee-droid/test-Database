export function initWeather() {
  const canvas = document.getElementById('weatherCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Partikel hujan ringan
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: 3 + Math.random() * 2,
      r: 1 + Math.random(),
      alpha: 0.1 + Math.random() * 0.3
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#b4dfff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
}
