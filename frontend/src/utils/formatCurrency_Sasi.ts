export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPrice(amount: number, isFree: boolean): string {
  if (isFree) return 'Free';
  return formatCurrency(amount);
}
