
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID').format(date);
};
