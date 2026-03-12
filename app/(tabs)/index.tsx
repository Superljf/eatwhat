import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { RouletteWheel } from '../../src/components/RouletteWheel';
import { useMealStore } from '../../src/stores/mealStore';
import { instagramTheme } from '../../src/constants/instagramTheme';
import { useResponsiveLayout } from '../../src/utils/responsive';
import type { Meal } from '../../src/types/meal';

const FILTER_OPTIONS: { value: 'all' | 'lunch' | 'dinner'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
];

export default function HomeScreen() {
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
  const meals = getFilteredMeals();

  const bottomSafeArea = Platform.select({
    ios: Math.max(90, (insets?.bottom ?? 0) + 70 + 20),
    android: 90+30,
    web: 90 + 30,
  });

  const handleSpinComplete = (meal: Meal) => {
    Alert.alert('就它了！', `今天吃：${meal.name}`, [{ text: '好嘞' }]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.select({
        ios: Math.max(44, (insets?.top ?? 0) + 8),
        android: 44,
        web: 52,
      }),
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: horizontalPadding,
      paddingBottom: bottomSafeArea,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      alignSelf: 'center',
      width: '100%',
      maxWidth: contentMaxWidth,
      marginBottom: verticalPadding * 2,
    },
    titleGradient: {
      paddingHorizontal: horizontalPadding,
      paddingVertical: instagramTheme.spacing.sm,
      borderRadius: instagramTheme.borderRadius.lg,
      marginBottom: instagramTheme.spacing.sm,
      alignSelf: 'center',
    },
    title: {
      fontSize: isSmallScreen ? 26 : 32,
      fontWeight: instagramTheme.typography.fontWeight.black,
      color: instagramTheme.colors.text.primary,
      letterSpacing: 1,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: isSmallScreen ? 12 : 14,
      fontWeight: instagramTheme.typography.fontWeight.medium,
      color: instagramTheme.colors.text.secondary,
      textAlign: 'center',
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: verticalPadding * 2,
      width: '100%',
      maxWidth: contentMaxWidth,
      alignSelf: 'center',
    },
    filterBlur: {
      flexDirection: 'row',
      flex: 1,
      borderRadius: instagramTheme.borderRadius.pill,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: instagramTheme.colors.glass.medium,
      backgroundColor: instagramTheme.colors.glass.light,
    },
    filterCapsule: {
      flex: 1,
      paddingVertical: isSmallScreen ? 10 : 12,
      paddingHorizontal: isSmallScreen ? 12 : 16,
      position: 'relative',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterCapsuleActive: {
      borderRadius: instagramTheme.borderRadius.pill,
    },
    filterActiveGradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: instagramTheme.borderRadius.pill,
    },
    filterText: {
      fontSize: isSmallScreen ? 12 : 14,
      fontWeight: instagramTheme.typography.fontWeight.semibold,
      color: instagramTheme.colors.text.tertiary,
      zIndex: 1,
    },
    filterTextActive: {
      color: instagramTheme.colors.text.primary,
      fontWeight: instagramTheme.typography.fontWeight.bold,
    },
    wheelContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalPadding * 2,
      minHeight: 280,
    },
    addButton: {
      alignSelf: 'center',
      borderRadius: instagramTheme.borderRadius.xl,
      overflow: 'hidden',
      marginTop: verticalPadding,
      ...instagramTheme.shadows.button,
    },
    addButtonGradient: {
      paddingVertical: isSmallScreen ? 14 : 16,
      paddingHorizontal: isSmallScreen ? 28 : 36,
    },
    addButtonText: {
      fontSize: isSmallScreen ? 15 : 16,
      fontWeight: instagramTheme.typography.fontWeight.bold,
      color: instagramTheme.colors.text.primary,
      textAlign: 'center',
    },
  });

  return (
    <LinearGradient colors={instagramTheme.colors.gradients.dark} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={instagramTheme.colors.gradients.classic}
            style={styles.titleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.title}>吃什么</Text>
          </LinearGradient>
          <Text style={styles.subtitle}>✨ 转一转，烦恼全没 ✨</Text>
        </View>

        <View style={styles.filterRow}>
          <BlurView intensity={40} tint="dark" style={styles.filterBlur}>
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
            colors={instagramTheme.colors.gradients.modern}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.addButtonText}>+ 再加一个</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
