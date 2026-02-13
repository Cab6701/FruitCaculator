import type { InvoiceItem } from '../types/invoice';

/**
 * Same formula as useInvoice totalAmount
 */
function computeTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.pricePerKg * item.weightKg, 0);
}

/**
 * Same validation as useInvoice saveCurrentInvoice
 */
function isInvoiceValid(
  items: InvoiceItem[],
  totalAmount: number,
): boolean {
  return (
    totalAmount > 0 &&
    items.every(
      (i) => !!i.name && i.pricePerKg > 0 && i.weightKg > 0,
    )
  );
}

describe('invoice total calculation', () => {
  it('sums line totals correctly', () => {
    const items: InvoiceItem[] = [
      { id: '1', name: 'A', pricePerKg: 10000, weightKg: 2 },
      { id: '2', name: 'B', pricePerKg: 20000, weightKg: 0.5 },
    ];
    expect(computeTotal(items)).toBe(20000 + 10000);
  });

  it('returns 0 for empty items', () => {
    expect(computeTotal([])).toBe(0);
  });
});

describe('invoice validation', () => {
  it('valid when all fields filled and total > 0', () => {
    const items: InvoiceItem[] = [
      { id: '1', name: 'Táo', pricePerKg: 20000, weightKg: 1 },
    ];
    expect(isInvoiceValid(items, 20000)).toBe(true);
  });

  it('invalid when total is 0', () => {
    const items: InvoiceItem[] = [
      { id: '1', name: 'Táo', pricePerKg: 20000, weightKg: 0 },
    ];
    expect(isInvoiceValid(items, 0)).toBe(false);
  });

  it('invalid when name missing', () => {
    const items: InvoiceItem[] = [
      { id: '1', name: '', pricePerKg: 20000, weightKg: 1 },
    ];
    expect(isInvoiceValid(items, 20000)).toBe(false);
  });

  it('invalid when pricePerKg is 0', () => {
    const items: InvoiceItem[] = [
      { id: '1', name: 'Táo', pricePerKg: 0, weightKg: 1 },
    ];
    expect(isInvoiceValid(items, 0)).toBe(false);
  });
});
