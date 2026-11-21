import { useRef } from 'react';
import { formatInt } from '../utils/format.js';
import { initAudio, playSound } from '../utils/audio.js';
import { burstConfetti } from '../utils/confetti.js';

export default function Header({ itemsCount, unitsCount }) {
  const titleRef = useRef(null);

  const handleTitleClick = () => {
    initAudio();
    playSound('edit');
    const el = titleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
  };

  return (
    <header className="header">
      <div
        className="title-group"
        ref={titleRef}
        onClick={handleTitleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleTitleClick();
          }
        }}
      >
        <span className="fire" aria-hidden="true">🔥</span>
        <h1>
          <span className="title-text">Калькулятор покупок</span>
        </h1>
      </div>

      <div className="stats">
        <div className="stat-badge" title="Позиций в списке">
          <svg className="icon"><use href="#i-box" /></svg>
          <span className="num">{formatInt(itemsCount)}</span>
          <span className="lbl">POS</span>
        </div>
        <div className="stat-badge" title="Суммарное количество">
          <svg className="icon"><use href="#i-cart" /></svg>
          <span className="num">{formatInt(unitsCount)}</span>
          <span className="lbl">UNIT</span>
        </div>
      </div>
    </header>
  );
}