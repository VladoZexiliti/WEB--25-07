const STORAGE_KEY = 'soft-posts-v7-final';

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function loadPosts(seedFactory) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedFactory();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedFactory();
  } catch {
    return seedFactory();
  }
}

export function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* ignore */
  }
}