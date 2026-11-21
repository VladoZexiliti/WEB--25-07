import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import ProductForm from './components/ProductForm.jsx';
import ProductTable from './components/ProductTable.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import { loadProducts, saveProducts, uid } from './utils/storage.js';
import { initAudio, playSound } from './utils/audio.js';

export default function App() {
  const [products, setProducts] = useState(loadProducts);
  const [toast, setToast] = useState(null);
  const [pulse, setPulse] = useState(false);

  const toastTimer = useRef(null);

  const total = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [products]
  );
  const units = useMemo(
    () => products.reduce((sum, p) => sum + p.quantity, 0),
    [products]
  );

  const [displayTotal, setDisplayTotal] = useState(total);
  const prevTotalRef = useRef(total);

  /* ---------- localStorage ---------- */
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  /* ---------- Инициализация аудио по первому взаимодействию ---------- */
  useEffect(() => {
    const handler = () => initAudio();
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
    };
  }, []);

  /* ---------- Очистка таймера тоста ---------- */
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  /* ---------- Автофокус на поле названия ---------- */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (window.innerWidth > 700) document.getElementById('nameInput')?.focus();
    }, 300);
    return () => window.clearTimeout(timer);
  }, []);

  /* ---------- Анимация итоговой суммы ---------- */
  useEffect(() => {
    const from = prevTotalRef.current;
    const to = total;

    if (Math.abs(to - from) < 0.001) {
      setDisplayTotal(to);
      return undefined;
    }

    prevTotalRef.current = to;
    const start = performance.now();
    const duration = 420;
    let raf = 0;

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplayTotal(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(step);
      else setDisplayTotal(to);
    };

    raf = requestAnimationFrame(step);
    setPulse(true);
    const pulseTimer = window.setTimeout(() => setPulse(false), 520);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(pulseTimer);
    };
  }, [total]);

  /* ---------- Тост ---------- */
  const showToast = useCallback((message, duration = 1800) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), duration);
  }, []);

  /* ---------- CRUD ---------- */
  const handleAdd = useCallback(
    (item) => {
      setProducts((prev) => [{ id: uid(), ...item }, ...prev]);
      showToast(`Добавлено: ${item.name}`, 1400);
    },
    [showToast]
  );

  const handleSave = useCallback(
    (id, patch) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
      showToast('Обновлено', 1200);
    },
    [showToast]
  );

  const handleDelete = useCallback(
    (id) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Удалено', 1200);
    },
    [showToast]
  );

  const handleClear = useCallback(() => {
    initAudio();

    if (!products.length) {
      playSound('error');
      showToast('Список пуст', 1200);
      return;
    }

    if (!window.confirm('Удалить все продукты?')) return;

    playSound('clear');
    setProducts([]);
    showToast('Список очищен', 1500);
  }, [products.length, showToast]);

  return (
    <>
      <main className="app-card" role="main">
        <Header itemsCount={products.length} unitsCount={units} />

        <ProductForm onAdd={handleAdd} />

        <ProductTable
          products={products}
          onDelete={handleDelete}
          onSave={handleSave}
          notify={showToast}
        />

        <Footer total={displayTotal} pulse={pulse} onClear={handleClear} />
      </main>

      <Toast message={toast} />
    </>
  );
}