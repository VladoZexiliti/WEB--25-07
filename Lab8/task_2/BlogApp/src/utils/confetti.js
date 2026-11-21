export function fireConfetti(x, y, color, count = 20) {
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.background = color;
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 120;
    piece.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    piece.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1000);
  }
}

export const BRAND_CONFETTI_COLORS = ['#ff7a52', '#4fd1b5', '#8b7ff5', '#7bc96f'];