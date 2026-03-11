import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { MealItem } from '../../src/components/MealItem';
import { useMealStore } from '../../src/stores/mealStore';
import { colors, gradients, borderRadius, spacing } from '../../src/constants/theme';
import type { Meal } from '../../src/types/meal';

const FILTER_OPTIONS: { value: 'all' | 'lunch' | 'dinner'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
];

function renderRightActions(
  onDelete: () => void
) {
  return (
    <Pressable
      onPress={onDelete}
      style={styles.deleteAction}
    >
      <Text style={styles.deleteText}>删除</Text>
    </Pressable>
  );
}

export default function ListScreen() {
  const router = useRouter();
  const filterType = useMealStore((s) => s.filterType);
  const setFilterType = useMealStore((s) => s.setFilterType);
  const getFilteredMeals = useMealStore((s) => s.getFilteredMeals);
  const removeMeal = useMealStore((s) => s.removeMeal);
  const meals = getFilteredMeals();

  const handleDelete = (meal: Meal) => {
    Alert.alert('删除', `确定删除「${meal.name}」？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          removeMeal(meal.id);
        },
      },
    ]);
  };

  const handleEdit = (meal: Meal) => {
    router.push({ pathname: '/add', params: { id: meal.id } });
  };

  return (
    <LinearGradient colors={gradients.background as unknown as string[]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的餐点</Text>
        <Text style={styles.subtitle}>左滑删除，点击编辑</Text>
      </View>

      <View style={styles.filterRow}>
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
      </View>

      {meals.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>还没想好吃啥？</Text>
          <Text style={styles.emptySubtext}>先加几个再说</Text>
          <Pressable
            style={styles.emptyButton}
            onPress={() => router.push('/add')}
          >
            <Text style={styles.emptyButtonText}>去添加</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => renderRightActions(() => handleDelete(item))}
              overshootRight={false}
              friction={2}
            >
              <MealItem meal={item} onPress={() => handleEdit(item)} />
            </Swipeable>
          )}
        />
      )}

      <Pressable
        style={styles.fab}
        onPress={() => router.push('/add')}
      >
        <LinearGradient
          colors={gradients.primary as unknown as string[]}
          style={styles.fabGradient}
        >
          <Text style={styles.fabText}>+</Text>
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
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterCapsule: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterCapsuleActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.text,
  },
  list: {
    paddingBottom: 100,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginRight: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: '#EF4444',
    borderRadius: borderRadius.lg,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 24,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  emptyButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
});
