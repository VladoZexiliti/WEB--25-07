const priceFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const intFormatter = new Intl.NumberFormat('ru-RU');

export const formatPrice = (value) => `${priceFormatter.format(value || 0)} ₽`;
export const formatInt = (value) => intFormatter.format(value || 0);