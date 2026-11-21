const COLORS = ['#ff7a1a', '#ff4500', '#ffb347', '#ffffff', '#5b8def', '#8aa7f0'];

export function burstConfetti(x, y, count = 25) {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const size = 4 + Math.random() * 8;
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;
    piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.borderRadius = Math.random() > 0.7 ? '50%' : '1px';

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 220;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 80;
    const rot = (Math.random() - 0.5) * 900;

    piece.style.setProperty('--tx', `${tx}px`);
    piece.style.setProperty('--ty', `${ty}px`);
    piece.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1400);
  }
}