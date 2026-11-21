import { useEffect } from 'react';

export function useBgRipple() {
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.closest('.app-shell') || e.target.closest('.modal-content')) return;
      const ripple = document.createElement('div');
      ripple.className = 'bg-ripple';
      const size = 100 + Math.random() * 200;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - size / 2}px`;
      ripple.style.top = `${e.clientY - size / 2}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1500);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}