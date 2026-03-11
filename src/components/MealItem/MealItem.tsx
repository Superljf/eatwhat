import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import type { Meal } from '../../types/meal';
import { colors, borderRadius, spacing } from '../../constants/theme';

interface MealItemProps {
  meal: Meal;
  onPress?: () => void;
  onDelete?: () => void;
}

const typeLabel = { lunch: '午餐', dinner: '晚餐' };

export function MealItem({ meal, onPress }: MealItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <BlurView intensity={40} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {meal.name}
          </Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{typeLabel[meal.type]}</Text>
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pressed: {
    opacity: 0.9,
  },
  blur: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  typeBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: borderRadius.pill,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});
