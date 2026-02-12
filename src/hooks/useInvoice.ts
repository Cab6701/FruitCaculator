import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { FruitPreset, Invoice, InvoiceItem } from '../types/invoice';
import { saveInvoice } from '../storage/invoiceStorage';

const createEmptyItem = (partial?: Partial<InvoiceItem>): InvoiceItem => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name: '',
  pricePerKg: 0,
  weightKg: 0,
  ...partial,
});

export const useInvoice = () => {
  const [items, setItems] = useState<InvoiceItem[]>([createEmptyItem()]);
  const [isSaving, setIsSaving] = useState(false);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.pricePerKg * item.weightKg, 0),
    [items],
  );

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, createEmptyItem()]);
  }, []);

  const addItemFromPreset = useCallback((preset: FruitPreset) => {
    setItems((prev) => [
      ...prev,
      createEmptyItem({
        name: preset.name,
        pricePerKg: preset.pricePerKg,
        presetId: preset.id,
      }),
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.length === 1) {
        return [createEmptyItem()];
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const applyPresetToItem = useCallback((id: string, preset: FruitPreset) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              name: preset.name,
              pricePerKg: preset.pricePerKg,
              presetId: preset.id,
            }
          : item,
      ),
    );
  }, []);

  const updateItemField = useCallback(
    (id: string, field: keyof InvoiceItem, value: string | number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;

          if (field === 'pricePerKg') {
            const numeric =
              typeof value === 'number'
                ? value
                : parseFloat(String(value).replace(',', '.')) || 0;
            // UI nhập đơn vị nghìn đồng => lưu thành đồng/kg
            return { ...item, pricePerKg: numeric * 1000 };
          }

          if (field === 'weightKg') {
            const numeric =
              typeof value === 'number'
                ? value
                : parseFloat(String(value).replace(',', '.')) || 0;
            return { ...item, weightKg: numeric };
          }

          return { ...item, [field]: value };
        }),
      );
    },
    [],
  );

  const resetInvoice = useCallback(() => {
    setItems([createEmptyItem()]);
  }, []);

  const saveCurrentInvoice = useCallback(async () => {
    if (totalAmount <= 0 || items.every((i) => !i.name || i.pricePerKg <= 0 || i.weightKg <= 0)) {
      Alert.alert('Hoá đơn không hợp lệ', 'Vui lòng nhập ít nhất một mặt hàng hợp lệ.');
      return;
    }

    setIsSaving(true);
    try {
      const invoice: Invoice = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
        items,
        totalAmount,
      };

      await saveInvoice(invoice);
      Alert.alert('Đã lưu', 'Hoá đơn đã được lưu thành công.');
      resetInvoice();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu hoá đơn. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  }, [items, resetInvoice, totalAmount]);

  return {
    items,
    totalAmount,
    isSaving,
    addItem,
    addItemFromPreset,
    applyPresetToItem,
    removeItem,
    updateItemField,
    resetInvoice,
    saveCurrentInvoice,
  };
};

