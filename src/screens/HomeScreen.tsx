import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInvoice } from '../hooks/useInvoice';
import { InvoiceItemRow } from '../components/InvoiceItemRow';
import { formatCurrencyVND } from '../utils/format';
import { FruitPreset } from '../types/invoice';
import { getFruitPresets } from '../storage/fruitPresetStorage';

export const HomeScreen: React.FC = () => {
  const {
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
  } = useInvoice();

  const [presets, setPresets] = useState<FruitPreset[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTargetId, setPickerTargetId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getFruitPresets();
      setPresets(data);
    };
    load();
  }, []);

  const openFruitPicker = (id: string) => {
    if (!presets.length) return;
    setPickerTargetId(id);
    setPickerVisible(true);
  };

  const closePicker = () => {
    setPickerVisible(false);
    setPickerTargetId(null);
  };

  const handleSelectPresetForItem = (preset: FruitPreset) => {
    if (!pickerTargetId) return;
    applyPresetToItem(pickerTargetId, preset);
    closePicker();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Hoá đơn hoa quả</Text>

        {presets.length > 0 && (
          <View style={styles.presetsSection}>
            <Text style={styles.presetsLabel}>Danh sách quả đã cài đặt</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetsRow}
            >
              {presets.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.presetChip}
                  onPress={() => addItemFromPreset(preset)}
                >
                  <Text style={styles.presetName}>{preset.name}</Text>
                  <Text style={styles.presetPrice}>
                    {formatCurrencyVND(preset.pricePerKg)}/kg
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <InvoiceItemRow
              {...({
                item,
                hasPresets: presets.length > 0,
                onPressChooseFruit: openFruitPicker,
                onChangeName: (id: string, value: string) => updateItemField(id, 'name', value),
                onChangePricePerKg: (id: string, value: string) =>
                  updateItemField(id, 'pricePerKg', value),
                onChangeWeightKg: (id: string, value: string) =>
                  updateItemField(id, 'weightKg', value),
                onRemove: removeItem,
              } as any)}
            />
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.addRowButton} onPress={addItem}>
              <Text style={styles.addRowText}>+ Thêm mặt hàng</Text>
            </TouchableOpacity>
          }
        />

        <Modal visible={pickerVisible} transparent animationType="slide" onRequestClose={closePicker}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn loại quả</Text>
              <ScrollView style={styles.modalList}>
                {presets.map((preset) => (
                  <TouchableOpacity
                    key={preset.id}
                    style={styles.modalItem}
                    onPress={() => handleSelectPresetForItem(preset)}
                  >
                    <Text style={styles.modalItemName}>{preset.name}</Text>
                    <Text style={styles.modalItemPrice}>
                      {formatCurrencyVND(preset.pricePerKg)}/kg
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closePicker}>
                <Text style={styles.modalCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng tiền:</Text>
            <Text style={styles.totalValue}>{formatCurrencyVND(totalAmount)}</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetInvoice}>
              <Text style={styles.secondaryButtonText}>Làm mới</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={saveCurrentInvoice}
              disabled={isSaving}
            >
              <Text style={styles.primaryButtonText}>
                {isSaving ? 'Đang lưu...' : 'Lưu hoá đơn'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  presetsSection: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  presetsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  presetsRow: {
    paddingBottom: 4,
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#e6f4ff',
    marginRight: 8,
  },
  presetName: {
    fontSize: 12,
    fontWeight: '600',
  },
  presetPrice: {
    fontSize: 11,
    color: '#555',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  addRowButton: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1890ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRowText: {
    color: '#1890ff',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalList: {
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemName: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalItemPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1890ff',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fa541c',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1890ff',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

