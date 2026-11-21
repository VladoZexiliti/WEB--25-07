import { IconPlus } from './icons.jsx';

export default function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        <svg className="empty-sprout" viewBox="0 0 120 120">
          <path d="M60 110 L60 50" stroke="#7bc96f" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 70 Q32 68 26 42 Q54 46 60 70 Z" fill="#a8e8d8" />
          <path d="M60 60 Q88 56 94 30 Q66 36 60 60 Z" fill="#7bc96f" />
          <ellipse cx="60" cy="112" rx="34" ry="5" fill="#d6f3e6" />
        </svg>
      </div>
      <h3 className="empty-title">Пока пусто</h3>
      <p className="empty-text">Первая запись всегда самая тёплая.</p>
      <a className="btn btn-primary" href="#/new">
        <IconPlus /> Написать пост
      </a>
    </div>
  );
}