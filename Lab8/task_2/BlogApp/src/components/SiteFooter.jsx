export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <svg className="footer-sprout" viewBox="0 0 60 30">
        <path d="M30 28 L30 14" stroke="#7bc96f" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 18 Q18 17 14 8 Q26 10 30 18 Z" fill="#a8e8d8" />
        <path d="M30 12 Q42 10 46 2 Q34 5 30 12 Z" fill="#7bc96f" />
      </svg>
      <p>Сделано мягко · {new Date().getFullYear()}</p>
    </footer>
  );
}