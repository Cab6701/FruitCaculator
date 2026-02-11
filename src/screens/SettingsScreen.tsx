import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FruitPreset } from '../types/invoice';
import { getFruitPresets, saveFruitPresets } from '../storage/fruitPresetStorage';

const createEmptyPreset = (): FruitPreset => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name: '',
  pricePerKg: 0,
});

export const SettingsScreen: React.FC = () => {
  const [presets, setPresets] = useState<FruitPreset[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getFruitPresets();
      if (data.length === 0) {
        setPresets([createEmptyPreset()]);
      } else {
        setPresets(data);
      }
    };
    load();
  }, []);

  const updatePresetField = useCallback(
    (id: string, field: keyof FruitPreset, value: string) => {
      setPresets((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          if (field === 'pricePerKg') {
            const numeric = parseFloat(value) || 0;
            // giá nhập là nghìn đồng => nhân 1000 để lưu
            return { ...p, pricePerKg: numeric * 1000 };
          }
          return { ...p, [field]: value };
        }),
      );
    },
    [],
  );

  const addPreset = useCallback(() => {
    setPresets((prev) => [...prev, createEmptyPreset()]);
  }, []);

  const removePreset = useCallback((id: string) => {
    setPresets((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length === 0) return [createEmptyPreset()];
      return filtered;
    });
  }, []);

  const handleSave = useCallback(async () => {
    const cleaned = presets.filter((p) => p.name.trim() && p.pricePerKg > 0);
    if (cleaned.length === 0) {
      Alert.alert('Danh sách rỗng', 'Vui lòng nhập ít nhất một loại quả hợp lệ.');
      return;
    }

    setSaving(true);
    try {
      await saveFruitPresets(cleaned);
      Alert.alert('Đã lưu', 'Đã lưu danh sách quả mặc định.');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu danh sách. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }, [presets]);

  const renderItem = ({ item }: { item: FruitPreset }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>Tên quả</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => removePreset(item.id)}>
          <Text style={styles.deleteText}>X</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Ví dụ: Táo, Cam, Nho..."
        value={item.name}
        onChangeText={(text) => updatePresetField(item.id, 'name', text)}
      />

      <Text style={[styles.label, { marginTop: 8 }]}>Giá / kg (nghìn đồng)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ví dụ: 10 nghĩa là 10.000đ/kg"
        keyboardType="decimal-pad"
        value={item.pricePerKg ? String(item.pricePerKg / 1000) : ''}
        onChangeText={(text) => updatePresetField(item.id, 'pricePerKg', text)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Cài đặt danh sách quả</Text>
        <Text style={styles.subtitle}>
          Thiết lập sẵn tên quả và giá/kg (đơn vị nghìn đồng). Khi tạo hoá đơn, bạn chỉ cần chọn
          quả và nhập số kg.
        </Text>

        <FlatList
          data={presets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={addPreset}>
            <Text style={styles.addButtonText}>+ Thêm loại quả</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Đang lưu...' : 'Lưu danh sách'}</Text>
          </TouchableOpacity>
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
    paddingTop: 12,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  itemContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#ff4d4f',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addButton: {
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1890ff',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButtonText: {
    color: '#1890ff',
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1890ff',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

