import { useEffect, useRef, useState } from 'react';
import { formatInt, formatPrice } from '../utils/format.js';
import { validateName, validatePrice, validateQuantity } from '../utils/validation.js';
import { playSound } from '../utils/audio.js';

export default function ProductRow({ product, onDelete, onSave, notify }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [draft, setDraft] = useState({ name: '', price: '', quantity: '' });
  const [invalidField, setInvalidField] = useState('');

  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const qtyRef = useRef(null);

  useEffect(() => {
    if (!editing) return;
    const input = nameRef.current;
    if (input) {
      input.focus();
      input.select();
    }
  }, [editing]);

  const startEdit = () => {
    if (editing || deleting) return;
    setDraft({
      name: product.name,
      price: String(product.price),
      quantity: String(product.quantity),
    });
    setInvalidField('');
    setEditing(true);
    playSound('edit');
  };

  const cancelEdit = () => {
    setEditing(false);
    setInvalidField('');
    playSound('click');
  };

  const handleDraftChange = (field) => (event) => {
    const { value } = event.target;
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (invalidField === field) setInvalidField('');
  };

  const fieldError = (field, message, ref) => {
    setInvalidField(field);
    playSound('error');
    notify?.(message, 1500);
    ref.current?.focus();
  };

  const save = () => {
    const name = validateName(draft.name);
    if (!name.valid) {
      fieldError('name', 'Название: 2–100 символов', nameRef);
      return;
    }

    const price = validatePrice(draft.price);
    if (!price.valid) {
      fieldError('price', 'Цена: число > 0', priceRef);
      return;
    }

    const quantity = validateQuantity(draft.quantity);
    if (!quantity.valid) {
      fieldError('quantity', 'Кол-во: целое ≥ 1', qtyRef);
      return;
    }

    playSound('add');
    onSave(product.id, {
      name: name.value,
      price: price.value,
      quantity: quantity.value,
    });
    setEditing(false);
    setInvalidField('');
  };

  const handleKeyDown = (field) => (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      save();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    } else if (event.key === 'Tab' && !event.shiftKey && field === 'quantity') {
      event.preventDefault();
      save();
    }
  };

  const handleDelete = () => {
    if (deleting) return;
    playSound('delete');
    setDeleting(true);
    window.setTimeout(() => onDelete(product.id), 220);
  };

  const handleDoubleClick = (event) => {
    if (event.target.closest('input, button')) return;
    startEdit();
  };

  const draftPrice = Number.parseFloat(draft.price);
  const draftQty = Number.parseInt(draft.quantity, 10);
  const draftTotal =
    (Number.isNaN(draftPrice) ? 0 : draftPrice) * (Number.isNaN(draftQty) ? 0 : draftQty);

  if (editing) {
    return (
      <tr className="product-row editing" data-id={product.id}>
        <td className="col-name" data-label="Продукт">
          <input
            ref={nameRef}
            className={`cell-input${invalidField === 'name' ? ' invalid' : ''}`}
            type="text"
            maxLength={100}
            value={draft.name}
            onChange={handleDraftChange('name')}
            onKeyDown={handleKeyDown('name')}
            aria-label="Название"
          />
        </td>

        <td className="col-num" data-label="Цена">
          <input
            ref={priceRef}
            className={`cell-input num${invalidField === 'price' ? ' invalid' : ''}`}
            type="number"
            step="0.01"
            min="0.01"
            max="999999"
            value={draft.price}
            onChange={handleDraftChange('price')}
            onKeyDown={handleKeyDown('price')}
            aria-label="Цена"
          />
        </td>

        <td className="col-num" data-label="Кол-во">
          <input
            ref={qtyRef}
            className={`cell-input num${invalidField === 'quantity' ? ' invalid' : ''}`}
            type="number"
            step="1"
            min="1"
            max="99999"
            value={draft.quantity}
            onChange={handleDraftChange('quantity')}
            onKeyDown={handleKeyDown('quantity')}
            aria-label="Количество"
          />
        </td>

        <td className="col-num col-sum" data-label="Сумма">
          <span className="cell-text num strong">{formatPrice(draftTotal)}</span>
        </td>

        <td className="col-actions">
          <div className="row-actions">
            <button
              type="button"
              className="action-btn save"
              title="Сохранить"
              aria-label="Сохранить"
              onClick={save}
            >
              <svg className="icon"><use href="#i-check" /></svg>
            </button>
            <button
              type="button"
              className="action-btn cancel"
              title="Отменить"
              aria-label="Отменить"
              onClick={cancelEdit}
            >
              <svg className="icon"><use href="#i-x" /></svg>
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      className={`product-row${deleting ? ' deleting' : ''}`}
      data-id={product.id}
      onDoubleClick={handleDoubleClick}
    >
      <td className="col-name" data-label="Продукт">
        <span className="cell-text">{product.name}</span>
      </td>

      <td className="col-num" data-label="Цена">
        <span className="cell-text num">{formatPrice(product.price)}</span>
      </td>

      <td className="col-num" data-label="Кол-во">
        <span className="cell-text num">{formatInt(product.quantity)}</span>
      </td>

      <td className="col-num col-sum" data-label="Сумма">
        <span className="cell-text num strong">
          {formatPrice(product.price * product.quantity)}
        </span>
      </td>

      <td className="col-actions">
        <div className="row-actions">
          <button
            type="button"
            className="action-btn edit"
            title="Редактировать"
            aria-label="Редактировать"
            onClick={startEdit}
          >
            <svg className="icon"><use href="#i-pencil" /></svg>
            <span className="btn-label">Править</span>
          </button>
          <button
            type="button"
            className="action-btn delete"
            title="Удалить"
            aria-label="Удалить"
            onClick={handleDelete}
          >
            <svg className="icon"><use href="#i-trash" /></svg>
            <span className="btn-label">Удалить</span>
          </button>
        </div>
      </td>
    </tr>
  );
}