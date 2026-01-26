// ============================================
// FORMAT HELPERS
// ============================================

export function formatCurrency(amount: number, currency: string = 'ARS'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `$${safeAmount.toFixed(2)}`;
  }
}
