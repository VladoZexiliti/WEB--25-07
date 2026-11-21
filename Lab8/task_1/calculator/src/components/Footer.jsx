import { formatPrice } from '../utils/format.js';

export default function Footer({ total, pulse, onClear }) {
  return (
    <footer className="footer">
      <button type="button" className="clear-btn" onClick={onClear}>
        <svg className="icon"><use href="#i-trash" /></svg>
        <span>Очистить всё</span>
      </button>

      <div className="total-block">
        <span className="total-label">
          <svg className="icon"><use href="#i-coin" /></svg>
          Итого
        </span>
        <span className={`total-value${pulse ? ' pulse' : ''}`}>
          {formatPrice(total)}
        </span>
      </div>
    </footer>
  );
}