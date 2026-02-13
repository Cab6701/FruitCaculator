jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getInvoices,
  saveInvoice,
  clearAllInvoices,
  deleteInvoiceById,
  deleteInvoicesByDate,
} from '../invoiceStorage';
import type { Invoice } from '../../types/invoice';

const STORAGE_KEY = 'invoices'; // must match invoiceStorage.ts

const sampleInvoice: Invoice = {
  id: 'inv-1',
  createdAt: '2025-02-13T10:00:00.000Z',
  items: [
    { id: 'i1', name: 'Táo', pricePerKg: 20000, weightKg: 2 },
  ],
  totalAmount: 40000,
};

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

beforeEach(() => {
  mockGetItem.mockReset();
  mockSetItem.mockReset();
  mockRemoveItem.mockReset();
});

describe('getInvoices', () => {
  it('returns empty array when no data', async () => {
    mockGetItem.mockResolvedValue(null);
    expect(await getInvoices()).toEqual([]);
    expect(mockGetItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('returns parsed array when data exists', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify([sampleInvoice]));
    const result = await getInvoices();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('inv-1');
    expect(result[0].totalAmount).toBe(40000);
  });

  it('returns empty array when parse fails', async () => {
    mockGetItem.mockResolvedValue('invalid json');
    expect(await getInvoices()).toEqual([]);
  });
});

describe('saveInvoice', () => {
  it('prepends new invoice to existing list', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify([sampleInvoice]));
    const newInv: Invoice = {
      ...sampleInvoice,
      id: 'inv-2',
      totalAmount: 10000,
    };
    await saveInvoice(newInv);
    expect(mockSetItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify([newInv, sampleInvoice]),
    );
  });

  it('saves single invoice when storage empty', async () => {
    mockGetItem.mockResolvedValue(null);
    await saveInvoice(sampleInvoice);
    expect(mockSetItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify([sampleInvoice]),
    );
  });
});

describe('clearAllInvoices', () => {
  it('removes storage key', async () => {
    await clearAllInvoices();
    expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEY);
  });
});

describe('deleteInvoiceById', () => {
  it('removes invoice with given id', async () => {
    const inv2 = { ...sampleInvoice, id: 'inv-2' };
    mockGetItem.mockResolvedValue(JSON.stringify([sampleInvoice, inv2]));
    await deleteInvoiceById('inv-1');
    expect(mockSetItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify([inv2]),
    );
  });
});

describe('deleteInvoicesByDate', () => {
  it('removes invoices matching date', async () => {
    const inv2 = { ...sampleInvoice, id: 'inv-2', createdAt: '2025-02-14T10:00:00.000Z' };
    mockGetItem.mockResolvedValue(JSON.stringify([sampleInvoice, inv2]));
    await deleteInvoicesByDate('2025-02-13');
    expect(mockSetItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify([inv2]),
    );
  });
});
