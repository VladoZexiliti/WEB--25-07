import { useEffect, useState } from 'react';

function parseHash() {
  const path = window.location.hash.replace(/^#/, '') || '/';
  if (path === '/') return { name: 'home', path };
  if (path === '/new') return { name: 'new', path };
  const m = path.match(/^\/post\/(.+)$/);
  if (m) return { name: 'post', id: decodeURIComponent(m[1]), path };
  return { name: 'notfound', path };
}

export function useRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return route;
}

export const navigate = (path) => {
  window.location.hash = path;
};