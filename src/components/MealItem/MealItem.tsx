import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InstagramCard } from '../InstagramCard';
import type { Meal } from '../../types/meal';
import { instagramTheme } from '../../constants/instagramTheme';

interface MealItemProps {
  meal: Meal;
  onPress?: () => void;
  onDelete?: () => void;
}

const typeLabel = { lunch: '午餐', dinner: '晚餐' };
const typeGradients = {
  lunch: instagramTheme.colors.gradients.modern,
  dinner: ['#833AB4', '#C13584'] as const,
};

export function MealItem({ meal, onPress }: MealItemProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 390;
  
  return (
    <InstagramCard onPress={onPress} variant="glass">
      <View style={[styles.content, isSmallScreen && styles.contentSmall]}>
        <View style={styles.leftSection}>
          <Text style={[styles.name, isSmallScreen && styles.nameSmall]} numberOfLines={1}>
            {meal.name}
          </Text>
          <Text style={[styles.subtitle, isSmallScreen && styles.subtitleSmall]}>
            轻触编辑 • {new Date(meal.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <LinearGradient
          colors={typeGradients[meal.type]}
          style={[styles.typeBadge, isSmallScreen && styles.typeBadgeSmall]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.typeText, isSmallScreen && styles.typeTextSmall]}>
            {typeLabel[meal.type]}
          </Text>
        </LinearGradient>
      </View>
    </InstagramCard>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: instagramTheme.spacing.lg,
    paddingHorizontal: instagramTheme.spacing.xl,
  },
  contentSmall: {
    paddingVertical: instagramTheme.spacing.md,
    paddingHorizontal: instagramTheme.spacing.lg,
  },
  leftSection: {
    flex: 1,
    marginRight: instagramTheme.spacing.md,
  },
  name: {
    fontSize: instagramTheme.typography.fontSize.lg,
    fontWeight: instagramTheme.typography.fontWeight.semibold,
    color: instagramTheme.colors.text.primary,
    marginBottom: instagramTheme.spacing.xs,
  },
  nameSmall: {
    fontSize: instagramTheme.typography.fontSize.md,
    marginBottom: instagramTheme.spacing.xs / 2,
  },
  subtitle: {
    fontSize: instagramTheme.typography.fontSize.sm,
    fontWeight: instagramTheme.typography.fontWeight.regular,
    color: instagramTheme.colors.text.tertiary,
  },
  subtitleSmall: {
    fontSize: instagramTheme.typography.fontSize.xs,
  },
  typeBadge: {
    paddingVertical: instagramTheme.spacing.xs,
    paddingHorizontal: instagramTheme.spacing.md,
    borderRadius: instagramTheme.borderRadius.pill,
    shadowColor: instagramTheme.colors.shadow.colored,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  typeBadgeSmall: {
    paddingVertical: instagramTheme.spacing.xs / 2,
    paddingHorizontal: instagramTheme.spacing.sm,
  },
  typeText: {
    fontSize: instagramTheme.typography.fontSize.sm,
    fontWeight: instagramTheme.typography.fontWeight.semibold,
    color: instagramTheme.colors.text.primary,
  },
  typeTextSmall: {
    fontSize: instagramTheme.typography.fontSize.xs,
  },
});
