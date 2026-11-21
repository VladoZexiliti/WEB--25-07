import { useRef, useState } from 'react';
import { validateName, validatePrice, validateQuantity } from '../utils/validation.js';
import { initAudio, playSound } from '../utils/audio.js';
import { burstConfetti } from '../utils/confetti.js';

const EMPTY_VALUES = { name: '', price: '', quantity: '' };
const EMPTY_ERRORS = { name: '', price: '', quantity: '' };

const VALIDATORS = {
  name: validateName,
  price: validatePrice,
  quantity: validateQuantity,
};

export default function ProductForm({ onAdd }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [shake, setShake] = useState(false);

  const formRef = useRef(null);
  const nameRef = useRef(null);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      const result = VALIDATORS[field](value);
      setErrors((prev) => ({ ...prev, [field]: result.valid ? '' : result.error }));
    }
  };

  const handleBlur = (field) => () => {
    if (!values[field].trim()) return;
    const result = VALIDATORS[field](values[field]);
    setErrors((prev) => ({ ...prev, [field]: result.valid ? '' : result.error }));
  };

  const triggerShake = () => {
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    window.setTimeout(() => setShake(false), 420);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    initAudio();

    const name = validateName(values.name);
    const price = validatePrice(values.price);
    const quantity = validateQuantity(values.quantity);

    setErrors({ name: name.error, price: price.error, quantity: quantity.error });

    if (!name.valid || !price.valid || !quantity.valid) {
      playSound('error');
      triggerShake();
      return;
    }

    onAdd({ name: name.value, price: price.value, quantity: quantity.value });

    setValues(EMPTY_VALUES);
    setErrors(EMPTY_ERRORS);
    playSound('add');
    nameRef.current?.focus();

    const rect = formRef.current?.getBoundingClientRect();
    if (rect) {
      burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
    }
  };

  return (
    <form
      ref={formRef}
      className={`add-form${shake ? ' shake' : ''}`}
      id="addForm"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div className="form-group name-group">
        <label className="field-label" htmlFor="nameInput">Продукт</label>
        <input
          ref={nameRef}
          id="nameInput"
          name="name"
          type="text"
          placeholder="Например: Молоко"
          maxLength={100}
          value={values.name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
          className={errors.name ? 'invalid' : ''}
        />
        <span className={`error-msg${errors.name ? ' show' : ''}`}>{errors.name}</span>
      </div>

      <div className="form-group price-group">
        <label className="field-label" htmlFor="priceInput">Цена (₽)</label>
        <input
          id="priceInput"
          name="price"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0.01"
          max="999999"
          value={values.price}
          onChange={handleChange('price')}
          onBlur={handleBlur('price')}
          className={errors.price ? 'invalid' : ''}
        />
        <span className={`error-msg${errors.price ? ' show' : ''}`}>{errors.price}</span>
      </div>

      <div className="form-group qty-group">
        <label className="field-label" htmlFor="qtyInput">Кол-во</label>
        <input
          id="qtyInput"
          name="quantity"
          type="number"
          placeholder="1"
          step="1"
          min="1"
          max="99999"
          value={values.quantity}
          onChange={handleChange('quantity')}
          onBlur={handleBlur('quantity')}
          className={errors.quantity ? 'invalid' : ''}
        />
        <span className={`error-msg${errors.quantity ? ' show' : ''}`}>{errors.quantity}</span>
      </div>

      <button type="submit" className="add-btn">
        <svg className="icon"><use href="#i-plus" /></svg>
        <span>Добавить</span>
      </button>
    </form>
  );
}