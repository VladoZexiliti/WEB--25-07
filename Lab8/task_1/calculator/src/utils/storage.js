const STORAGE_KEY = 'product-calculator-v1';

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const isValidProduct = (p) =>
  p &&
  typeof p.id === 'string' &&
  typeof p.name === 'string' &&
  typeof p.price === 'number' &&
  typeof p.quantity === 'number' &&
  p.price > 0 &&
  p.quantity > 0;

export function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidProduct);
  } catch {
    return [];
  }
}

export function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    /* хранилище недоступно — молча игнорируем */
  }
}