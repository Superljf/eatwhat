import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { MealItem } from '../../src/components/MealItem';
import { useMealStore } from '../../src/stores/mealStore';
import { instagramTheme } from '../../src/constants/instagramTheme';
import { useResponsiveLayout } from '../../src/utils/responsive';
import type { Meal } from '../../src/types/meal';

const FILTER_OPTIONS: { value: 'all' | 'lunch' | 'dinner'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
];

export default function ListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    horizontalPadding,
    verticalPadding,
    contentMaxWidth,
    isSmallScreen,
  } = useResponsiveLayout();

  const filterType = useMealStore((s) => s.filterType);
  const setFilterType = useMealStore((s) => s.setFilterType);
  const getFilteredMeals = useMealStore((s) => s.getFilteredMeals);
  const removeMeal = useMealStore((s) => s.removeMeal);
  const meals = getFilteredMeals();

  const bottomSafeArea = Platform.select({
    ios: Math.max(90, (insets?.bottom ?? 0) + 70 + 20),
    android: 90,
    web: 90,
  });

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

  const renderRightActions = (onDelete: () => void) => (
    <Pressable onPress={onDelete} style={styles.deleteAction}>
      <LinearGradient colors={['#FF3B30', '#FF6B6B']} style={styles.deleteGradient}>
        <Text style={styles.deleteText}>删除</Text>
      </LinearGradient>
    </Pressable>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.select({
        ios: Math.max(44, (insets?.top ?? 0) + 8),
        android: 44,
        web: 52,
      }),
    },
    header: {
      alignItems: 'center',
      alignSelf: 'center',
      width: '100%',
      maxWidth: contentMaxWidth,
      marginBottom: verticalPadding * 2,
      paddingHorizontal: horizontalPadding,
    },
    titleGradient: {
      paddingHorizontal: horizontalPadding,
      paddingVertical: instagramTheme.spacing.sm,
      borderRadius: instagramTheme.borderRadius.lg,
      marginBottom: instagramTheme.spacing.sm,
      alignSelf: 'center',
    },
    title: {
      fontSize: isSmallScreen ? 22 : 26,
      fontWeight: instagramTheme.typography.fontWeight.black,
      color: instagramTheme.colors.text.primary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 11,
      fontWeight: instagramTheme.typography.fontWeight.medium,
      color: instagramTheme.colors.text.tertiary,
      textAlign: 'center',
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: isSmallScreen ? 6 : 8,
      marginBottom: verticalPadding * 2,
      paddingHorizontal: horizontalPadding,
      width: '100%',
      maxWidth: contentMaxWidth,
      alignSelf: 'center',
    },
    filterCapsule: {
      flex: 1,
      paddingVertical: isSmallScreen ? 10 : 12,
      paddingHorizontal: isSmallScreen ? 10 : 14,
      borderRadius: instagramTheme.borderRadius.pill,
      backgroundColor: instagramTheme.colors.glass.light,
      borderWidth: 1,
      borderColor: instagramTheme.colors.glass.medium,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    filterCapsuleActive: {
      borderColor: instagramTheme.colors.primary,
    },
    filterActiveGradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: instagramTheme.borderRadius.pill,
    },
    filterText: {
      fontSize: isSmallScreen ? 11 : 12,
      fontWeight: instagramTheme.typography.fontWeight.semibold,
      color: instagramTheme.colors.text.tertiary,
      zIndex: 1,
    },
    filterTextActive: {
      color: instagramTheme.colors.text.primary,
      fontWeight: instagramTheme.typography.fontWeight.bold,
    },
    list: {
      paddingTop: verticalPadding,
      paddingHorizontal: horizontalPadding,
    },
    deleteAction: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      marginRight: instagramTheme.spacing.md,
      marginBottom: instagramTheme.spacing.md,
      borderRadius: instagramTheme.borderRadius.xl,
      overflow: 'hidden',
    },
    deleteGradient: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteText: {
      color: instagramTheme.colors.text.primary,
      fontWeight: instagramTheme.typography.fontWeight.bold,
      fontSize: instagramTheme.typography.fontSize.sm,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalPadding * 4,
      paddingHorizontal: horizontalPadding,
      minHeight: 200,
    },
    emptyGradient: {
      width: '100%',
      maxWidth: contentMaxWidth,
      alignItems: 'center',
      padding: verticalPadding * 3,
      borderRadius: instagramTheme.borderRadius.xxl,
      borderWidth: 2,
      borderColor: instagramTheme.colors.glass.medium,
      borderStyle: 'dashed',
    },
    emptyText: {
      fontSize: instagramTheme.typography.fontSize.xl,
      fontWeight: instagramTheme.typography.fontWeight.bold,
      color: instagramTheme.colors.text.secondary,
      marginBottom: instagramTheme.spacing.sm,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: instagramTheme.typography.fontSize.md,
      fontWeight: instagramTheme.typography.fontWeight.medium,
      color: instagramTheme.colors.text.tertiary,
      marginBottom: instagramTheme.spacing.xxl,
      textAlign: 'center',
    },
    emptyButton: {
      borderRadius: instagramTheme.borderRadius.xl,
      overflow: 'hidden',
      ...instagramTheme.shadows.button,
    },
    emptyButtonGradient: {
      paddingVertical: instagramTheme.spacing.md,
      paddingHorizontal: instagramTheme.spacing.xl,
    },
    emptyButtonText: {
      color: instagramTheme.colors.text.primary,
      fontWeight: instagramTheme.typography.fontWeight.bold,
      fontSize: instagramTheme.typography.fontSize.md,
    },
    fab: {
      position: 'absolute',
      right: horizontalPadding + 8,
      borderRadius: 32,
      overflow: 'hidden',
      ...instagramTheme.shadows.floating,
    },
    fabGradient: {
      width: isSmallScreen ? 56 : 64,
      height: isSmallScreen ? 56 : 64,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fabText: {
      fontSize: isSmallScreen 
        ? instagramTheme.typography.fontSize.xxl 
        : instagramTheme.typography.fontSize.xxxl,
      fontWeight: instagramTheme.typography.fontWeight.light,
      color: instagramTheme.colors.text.primary,
    },
  });

  return (
    <LinearGradient colors={instagramTheme.colors.gradients.dark} style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={instagramTheme.colors.gradients.classic}
          style={styles.titleGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.title}>我的餐点</Text>
        </LinearGradient>
        <Text style={styles.subtitle}>✨ 左滑删除，点击编辑 ✨</Text>
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
            {filterType === opt.value && (
              <LinearGradient
                colors={instagramTheme.colors.gradients.modern}
                style={styles.filterActiveGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
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
          <LinearGradient
            colors={instagramTheme.colors.gradients.glass}
            style={styles.emptyGradient}
          >
            <Text style={styles.emptyText}>还没想好吃啥？</Text>
            <Text style={styles.emptySubtext}>先加几个再说 ✨</Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => router.push('/add')}
            >
              <LinearGradient
                colors={instagramTheme.colors.gradients.modern}
                style={styles.emptyButtonGradient}
              >
                <Text style={styles.emptyButtonText}>去添加</Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: bottomSafeArea }]}
          showsVerticalScrollIndicator={false}
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
        style={[styles.fab, { bottom: bottomSafeArea }]}
        onPress={() => router.push('/add')}
      >
        <LinearGradient
          colors={instagramTheme.colors.gradients.modern}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
      </Pressable>
    </LinearGradient>
  );
}
