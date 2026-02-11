import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { InvoiceItem } from '../types/invoice';
import { formatCurrencyVND } from '../utils/format';

type Props = {
  item: InvoiceItem;
  onChangeName: (id: string, value: string) => void;
  onChangePricePerKg: (id: string, value: string) => void;
  onChangeWeightKg: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  hasPresets?: boolean;
  onPressChooseFruit?: (id: string) => void;
};

export const InvoiceItemRow: React.FC<Props> = ({
  item,
  onChangeName,
  onChangePricePerKg,
  onChangeWeightKg,
  onRemove,
  hasPresets,
  onPressChooseFruit,
}) => {
  const lineTotal = item.pricePerKg * item.weightKg;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {hasPresets && onPressChooseFruit ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.input, styles.nameInput, styles.dropdownInput]}
            onPress={() => onPressChooseFruit(item.id)}
          >
            <Text
              style={[
                styles.dropdownText,
                !item.name && styles.placeholderText,
              ]}
              numberOfLines={1}
            >
              {item.name || 'Chọn loại quả'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Loại quả"
            value={item.name}
            onChangeText={(text) => onChangeName(item.id, text)}
          />
        )}
        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.fieldHalf}>
          {item.presetId ? (
            <>
              <Text style={styles.label}>Giá/kg (theo cài đặt)</Text>
              <Text style={styles.readonlyPrice}>{formatCurrencyVND(item.pricePerKg)}/kg</Text>
            </>
          ) : (
            <>
              <Text style={styles.label}>Giá/kg (nghìn đồng)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="decimal-pad"
                value={item.pricePerKg ? String(item.pricePerKg / 1000) : ''}
                onChangeText={(text) => onChangePricePerKg(item.id, text)}
              />
            </>
          )}
        </View>
        <View style={styles.fieldHalf}>
          <Text style={styles.label}>Số kg</Text>
          <TextInput
            style={[styles.input, styles.weightInput]}
            placeholder="0"
            keyboardType="decimal-pad"
            value={item.weightKg ? String(item.weightKg) : ''}
            onChangeText={(text) => onChangeWeightKg(item.id, text)}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>Thành tiền</Text>
          <Text style={styles.totalText}>{formatCurrencyVND(lineTotal)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  field: {
    flex: 1,
    marginRight: 8,
  },
  fieldHalf: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
  },
  readonlyPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  weightInput: {
    fontSize: 18,
    fontWeight: '700',
  },
  nameInput: {
    flex: 1,
  },
  dropdownInput: {
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#222',
  },
  placeholderText: {
    color: '#999',
  },
  deleteButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ff4d4f',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
});

