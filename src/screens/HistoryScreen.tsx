import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getInvoices } from '../storage/invoiceStorage';
import { Invoice } from '../types/invoice';
import { formatCurrencyVND, formatDateTime } from '../utils/format';

export const HistoryScreen: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    const data = await getInvoices();
    setInvoices(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, [loadInvoices]),
  );

  const renderItem = ({ item }: { item: Invoice }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('InvoiceDetail', { invoice: item })}
    >
      <View style={styles.itemRow}>
        <Text style={styles.itemTitle}>{formatDateTime(item.createdAt)}</Text>
        <Text style={styles.itemAmount}>{formatCurrencyVND(item.totalAmount)}</Text>
      </View>
      <Text style={styles.itemSubtitle}>{item.items.length} mặt hàng</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : invoices.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Chưa có hoá đơn nào.</Text>
          <Text style={styles.emptySubText}>Hãy tạo hoá đơn mới ở tab Hoá đơn.</Text>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fa541c',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

