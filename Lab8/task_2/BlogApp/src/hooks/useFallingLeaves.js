import { useEffect } from 'react';

export function useFallingLeaves() {
  useEffect(() => {
    const container = document.getElementById('leaf-container');
    if (!container) return undefined;

    const createLeaf = () => {
      const leaf = document.createElement('div');
      leaf.className = 'falling-leaf';
      leaf.style.left = `${Math.random() * 100}vw`;
      leaf.style.animationDuration = `${10 + Math.random() * 8}s`;
      leaf.style.animationDelay = `${Math.random() * 5}s`;
      leaf.style.opacity = 0.2 + Math.random() * 0.4;
      leaf.style.transform = `scale(${0.4 + Math.random() * 0.8})`;
      leaf.innerHTML = '<svg viewBox="0 0 24 24" fill="none" width="100%" height="100%"><path d="M12 2 C 18 6, 20 14, 12 22 C 4 14, 6 6, 12 2 Z" fill="#7bc96f" opacity="0.8"/><path d="M12 4 L 12 20" stroke="#4a8f4a" stroke-width="1.2" opacity="0.6"/></svg>';
      container.appendChild(leaf);
      setTimeout(() => leaf.remove(), 18000);
    };

    const interval = setInterval(createLeaf, 1500);
    for (let i = 0; i < 5; i += 1) setTimeout(createLeaf, i * 300);

    return () => clearInterval(interval);
  }, []);
}