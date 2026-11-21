import { navigate } from '../hooks/useRoute.js';
import { fireConfetti, BRAND_CONFETTI_COLORS } from '../utils/confetti.js';

export default function TopNav({ route }) {
  const handleBrandClick = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    fireConfetti(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      BRAND_CONFETTI_COLORS[Math.floor(Math.random() * BRAND_CONFETTI_COLORS.length)],
      20
    );
    navigate('/');
  };

  return (
    <header className="top-nav">
      <a className="brand" href="#/" onClick={handleBrandClick}>
        <span className="brand-dot" />
        <span className="brand-name">Тихая лента</span>
      </a>
      <nav className="nav-links">
        <a href="#/" className={`nav-link${route.name === 'home' ? ' active' : ''}`}>Лента</a>
        <a href="#/new" className={`nav-link${route.name === 'new' ? ' active' : ''}`}>Написать</a>
      </nav>
    </header>
  );
}