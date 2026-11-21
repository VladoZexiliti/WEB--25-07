import { useEffect } from 'react';

export function useMouseParallax() {
  useEffect(() => {
    const container = document.getElementById('wave-container');
    if (!container) return undefined;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
      container.style.setProperty('--rot-x', `${x * 0.1}deg`);
      container.style.setProperty('--rot-y', `${y * 0.1}deg`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
}