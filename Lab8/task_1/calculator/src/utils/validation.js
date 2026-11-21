const MIN_NAME = 2;
const MAX_NAME = 100;
const MAX_PRICE = 999999;
const MAX_QTY = 99999;

export function validateName(raw) {
  const value = String(raw ?? '').trim();
  if (!value) return { valid: false, value: '', error: 'Введите название' };
  if (value.length < MIN_NAME) return { valid: false, value, error: 'Минимум 2 символа' };
  if (value.length > MAX_NAME) return { valid: false, value, error: 'Максимум 100 символов' };
  return { valid: true, value, error: '' };
}

export function validatePrice(raw) {
  const str = String(raw ?? '').trim();
  if (!str) return { valid: false, value: 0, error: 'Введите цену' };

  const num = Number.parseFloat(str);
  if (Number.isNaN(num)) return { valid: false, value: 0, error: 'Не число' };
  if (num <= 0) return { valid: false, value: 0, error: 'Больше 0' };
  if (num > MAX_PRICE) return { valid: false, value: 0, error: 'Слишком много' };
  if (!/^\d+(\.\d{1,2})?$/.test(str)) return { valid: false, value: 0, error: 'Макс. 2 знака' };

  return { valid: true, value: num, error: '' };
}

export function validateQuantity(raw) {
  const str = String(raw ?? '').trim();
  if (!str) return { valid: false, value: 0, error: 'Введите кол-во' };

  const num = Number.parseInt(str, 10);
  if (Number.isNaN(num)) return { valid: false, value: 0, error: 'Не число' };
  if (num < 1) return { valid: false, value: 0, error: 'Минимум 1' };
  if (num > MAX_QTY) return { valid: false, value: 0, error: 'Слишком много' };
  if (String(num) !== str) return { valid: false, value: 0, error: 'Целое число' };

  return { valid: true, value: num, error: '' };
}