import { formatCurrencyVND, formatDateTime, formatDateOnly } from '../format';

describe('formatCurrencyVND', () => {
  it('formats positive number as VND', () => {
    expect(formatCurrencyVND(10000)).toMatch(/\d[\d.,]*\s*₫/);
    // Intl may use different space (e.g. U+00A0), so match pattern instead of exact string
    expect(formatCurrencyVND(0)).toMatch(/0\s*₫/);
  });

  it('returns zero VND for NaN and Infinity', () => {
    expect(formatCurrencyVND(NaN)).toMatch(/0\s*₫/);
    expect(formatCurrencyVND(Infinity)).toMatch(/0\s*₫/);
    expect(formatCurrencyVND(-Infinity)).toMatch(/0\s*₫/);
  });
});

describe('formatDateTime', () => {
  it('formats valid ISO string', () => {
    const result = formatDateTime('2025-02-13T10:30:00.000Z');
    expect(result).toMatch(/\d/);
    expect(result).not.toBe('2025-02-13T10:30:00.000Z');
  });

  it('returns original string for invalid date', () => {
    expect(formatDateTime('not-a-date')).toBe('not-a-date');
  });
});

describe('formatDateOnly', () => {
  it('formats valid ISO string to date only', () => {
    const result = formatDateOnly('2025-02-13T10:30:00.000Z');
    expect(result).toMatch(/\d/);
  });

  it('returns original string for invalid date', () => {
    expect(formatDateOnly('invalid')).toBe('invalid');
  });
});
