import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Meal } from '../types/meal';

const STORAGE_KEY = '@eatwhat/meals';

export async function loadMeals(): Promise<Meal[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveMeals(meals: Meal[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}
