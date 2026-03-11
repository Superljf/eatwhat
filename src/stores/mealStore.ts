import { create } from 'zustand';
import type { Meal, MealType } from '../types/meal';
import { loadMeals, saveMeals } from '../utils/storage';

interface MealState {
  meals: Meal[];
  filterType: MealType | 'all';
  isLoading: boolean;
  loadMeals: () => Promise<void>;
  addMeal: (name: string, type: MealType) => Promise<void>;
  updateMeal: (id: string, name: string, type: MealType) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  setFilterType: (type: MealType | 'all') => void;
  getFilteredMeals: () => Meal[];
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],
  filterType: 'all',
  isLoading: false,

  loadMeals: async () => {
    set({ isLoading: true });
    const meals = await loadMeals();
    set({ meals, isLoading: false });
  },

  addMeal: async (name: string, type: MealType) => {
    const meal: Meal = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      type,
      createdAt: Date.now(),
    };
    const meals = [...get().meals, meal];
    set({ meals });
    await saveMeals(meals);
  },

  updateMeal: async (id: string, name: string, type: MealType) => {
    const meals = get().meals.map((m) =>
      m.id === id ? { ...m, name: name.trim(), type } : m
    );
    set({ meals });
    await saveMeals(meals);
  },

  removeMeal: async (id: string) => {
    const meals = get().meals.filter((m) => m.id !== id);
    set({ meals });
    await saveMeals(meals);
  },

  setFilterType: (filterType) => set({ filterType }),

  getFilteredMeals: () => {
    const { meals, filterType } = get();
    if (filterType === 'all') return meals;
    return meals.filter((m) => m.type === filterType);
  },
}));
