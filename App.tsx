import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './src/screens/HomeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { InvoiceDetailScreen } from './src/screens/InvoiceDetailScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const HistoryStack = createNativeStackNavigator();

function HistoryStackNavigator() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen
        name="HistoryList"
        component={HistoryScreen}
        options={{ title: 'Lịch sử hoá đơn' }}
      />
      <HistoryStack.Screen
        name="InvoiceDetail"
        component={InvoiceDetailScreen}
        options={{ title: 'Chi tiết hoá đơn' }}
      />
    </HistoryStack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap = 'receipt-outline';

                if (route.name === 'Hoá đơn') {
                  iconName = 'receipt-outline';
                } else if (route.name === 'Lịch sử') {
                  iconName = 'time-outline';
                } else if (route.name === 'Thống kê') {
                  iconName = 'stats-chart-outline';
                } else if (route.name === 'Cài đặt') {
                  iconName = 'settings-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Hoá đơn" component={HomeScreen} />
            <Tab.Screen name="Lịch sử" component={HistoryStackNavigator} />
            <Tab.Screen name="Thống kê" component={StatsScreen} />
            <Tab.Screen name="Cài đặt" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
