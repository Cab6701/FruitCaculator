import AsyncStorage from '@react-native-async-storage/async-storage';
import { FruitPreset } from '../types/invoice';

const STORAGE_KEY = 'fruit_presets';

export const getFruitPresets = async (): Promise<FruitPreset[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FruitPreset[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn('Failed to load fruit presets', error);
    return [];
  }
};

export const saveFruitPresets = async (presets: FruitPreset[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.warn('Failed to save fruit presets', error);
    throw error;
  }
};

