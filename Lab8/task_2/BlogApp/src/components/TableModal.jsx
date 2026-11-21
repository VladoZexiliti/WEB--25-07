import { useState } from 'react';

export default function TableModal({ onClose, onInsert }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(2);

  const handleInsert = () => {
    onInsert(
      Math.min(5, Math.max(1, rows)),
      Math.min(4, Math.max(1, cols))
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Создать таблицу</h3>
        <p className="modal-sub">Выберите размер (строки: 1-5, столбцы: 1-4)</p>

        <div className="table-controls">
          <div className="control-group">
            <label htmlFor="table-rows">Строки</label>
            <input
              id="table-rows"
              type="number"
              min="1"
              max="5"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value, 10) || 1)}
            />
          </div>
          <div className="control-group">
            <label htmlFor="table-cols">Столбцы</label>
            <input
              id="table-cols"
              type="number"
              min="1"
              max="4"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value, 10) || 1)}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Отмена</button>
          <button type="button" className="btn btn-primary" onClick={handleInsert}>Вставить</button>
        </div>
      </div>
    </div>
  );
}