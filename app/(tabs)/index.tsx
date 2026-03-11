import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { RouletteWheel } from '../../src/components/RouletteWheel';
import { useMealStore } from '../../src/stores/mealStore';
import { colors, gradients, borderRadius, spacing } from '../../src/constants/theme';
import type { Meal } from '../../src/types/meal';

const FILTER_OPTIONS: { value: 'all' | 'lunch' | 'dinner'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
];

export default function HomeScreen() {
  const router = useRouter();
  const filterType = useMealStore((s) => s.filterType);
  const setFilterType = useMealStore((s) => s.setFilterType);
  const getFilteredMeals = useMealStore((s) => s.getFilteredMeals);
  const meals = getFilteredMeals();

  const handleSpinComplete = (meal: Meal) => {
    Alert.alert('就它了！', `今天吃：${meal.name}`, [{ text: '好嘞' }]);
  };

  return (
    <LinearGradient colors={gradients.background as unknown as string[]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>吃什么</Text>
        <Text style={styles.subtitle}>转一转，烦恼全没</Text>
      </View>

      {/* 筛选胶囊 */}
      <View style={styles.filterRow}>
        <BlurView intensity={60} tint="dark" style={styles.filterBlur}>
          {FILTER_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setFilterType(opt.value)}
              style={[
                styles.filterCapsule,
                filterType === opt.value && styles.filterCapsuleActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filterType === opt.value && styles.filterTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </BlurView>
      </View>

      <View style={styles.wheelContainer}>
        <RouletteWheel meals={meals} onSpinComplete={handleSpinComplete} />
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/add')}
      >
        <LinearGradient
          colors={gradients.primary as unknown as string[]}
          style={styles.addButtonGradient}
        >
          <Text style={styles.addButtonText}>再加一个</Text>
        </LinearGradient>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  filterBlur: {
    flexDirection: 'row',
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterCapsule: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterCapsuleActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
    borderRadius: borderRadius.pill,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.text,
  },
  wheelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    alignSelf: 'center',
    marginBottom: 100,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
