import AsyncStorage from '@react-native-async-storage/async-storage';
import { Invoice } from '../types/invoice';

const STORAGE_KEY = 'invoices';

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Invoice[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn('Failed to load invoices', error);
    return [];
  }
};

export const saveInvoice = async (invoice: Invoice): Promise<void> => {
  try {
    const existing = await getInvoices();
    const updated = [invoice, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save invoice', error);
    throw error;
  }
};

export const clearAllInvoices = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear invoices', error);
    throw error;
  }
};

export const deleteInvoiceById = async (id: string): Promise<void> => {
  try {
    const existing = await getInvoices();
    const updated = existing.filter((invoice) => invoice.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to delete invoice', error);
    throw error;
  }
};

export const deleteInvoicesByDate = async (date: string): Promise<void> => {
  try {
    const existing = await getInvoices();
    const updated = existing.filter((invoice) => invoice.createdAt.slice(0, 10) !== date);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to delete invoices by date', error);
    throw error;
  }
};

