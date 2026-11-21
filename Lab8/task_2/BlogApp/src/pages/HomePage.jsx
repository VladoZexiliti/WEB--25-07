import PostsList from '../components/PostsList.jsx';
import { IconPlus } from '../components/icons.jsx';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">пространство для заметок</span>
          <h1>Пишите мягко,<br />читайте <span className="accent">спокойно</span></h1>
          <svg className="wave-underline" viewBox="0 0 240 14" preserveAspectRatio="none">
            <path
              d="M2 9 C 22 2, 42 2, 62 9 S 102 16, 122 9 S 162 2, 182 9 S 222 16, 238 9"
              fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
            />
          </svg>
          <p className="hero-sub">
            Лента, которая не торопит. Добавьте пару тёплых мыслей — и они аккуратно лягут в общий поток.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#/new"><IconPlus /> Новый пост</a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => document.getElementById('posts-list')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Смотреть ленту
            </button>
          </div>
        </div>
        <div className="hero-art">
          <svg viewBox="0 0 320 320">
            <defs>
              <linearGradient id="blobGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffe3d6" />
                <stop offset="50%" stopColor="#ffc4ae" />
                <stop offset="100%" stopColor="#c4efdc" />
              </linearGradient>
            </defs>
            <g className="float">
              <path d="M170 16c66-4 130 42 128 122-2 82-52 148-134 154C82 298 20 242 22 158 24 76 100 20 170 16z" fill="url(#blobGrad)" />
              <path d="M46 190c26-34 54 6 84-22s52 6 82-22 42-14 62-26" fill="none" stroke="#ff7a52" strokeWidth="3" strokeLinecap="round" opacity=".7" />
              <path d="M46 224c26-34 54 6 84-22s52 6 82-22 42-14 62-26" fill="none" stroke="#4fd1b5" strokeWidth="2.5" strokeLinecap="round" opacity=".55" />
              <g transform="translate(240, 60) rotate(20)"><path d="M0 0 C 10 6, 12 14, 0 22 C -12 14, -10 6, 0 0 Z" fill="#7bc96f" /></g>
              <g transform="translate(60, 100) rotate(-30)"><path d="M0 0 C 8 5, 10 12, 0 18 C -10 12, -8 5, 0 0 Z" fill="#4fd1b5" /></g>
            </g>
          </svg>
        </div>
      </section>

      <PostsList />
    </div>
  );
}