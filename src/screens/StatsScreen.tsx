import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getInvoices } from '../storage/invoiceStorage';
import { Invoice } from '../types/invoice';
import { formatCurrencyVND, formatDateOnly } from '../utils/format';

type DayStat = {
  date: string;
  total: number;
  count: number;
};

export const StatsScreen: React.FC = () => {
  const [stats, setStats] = useState<DayStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const computeStats = (invoices: Invoice[]): DayStat[] => {
    const map = new Map<string, { total: number; count: number }>();

    invoices.forEach((inv) => {
      const dateKey = inv.createdAt.slice(0, 10);
      const existing = map.get(dateKey) || { total: 0, count: 0 };
      existing.total += inv.totalAmount;
      existing.count += 1;
      map.set(dateKey, existing);
    });

    return Array.from(map.entries())
      .map(([date, value]) => ({ date, total: value.total, count: value.count }))
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const loadStats = useCallback(async () => {
    setLoading(true);
    const invoices = await getInvoices();
    setStats(computeStats(invoices));
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const invoices = await getInvoices();
    setStats(computeStats(invoices));
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }: { item: DayStat }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemRow}>
        <Text style={styles.dateText}>{formatDateOnly(item.date)}</Text>
        <Text style={styles.amountText}>{formatCurrencyVND(item.total)}</Text>
      </View>
      <Text style={styles.countText}>{item.count} hoá đơn</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Thống kê theo ngày</Text>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : stats.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>Chưa có dữ liệu thống kê.</Text>
            <Text style={styles.emptySubText}>
              Hãy lưu vài hoá đơn để xem tổng thu theo ngày.
            </Text>
          </View>
        ) : (
          <FlatList
            data={stats}
            keyExtractor={(item) => item.date}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
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
    paddingBottom: 4,
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
  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fa541c',
  },
  countText: {
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

