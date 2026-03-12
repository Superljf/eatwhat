import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { instagramTheme } from '../../constants/instagramTheme';

interface InstagramCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'glass' | 'gradient' | 'solid';
  style?: ViewStyle;
  pressable?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function InstagramCard({ 
  children, 
  onPress, 
  variant = 'glass',
  style,
  pressable = true 
}: InstagramCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!pressable) return;
    scale.value = withSpring(0.98, instagramTheme.animations.spring.gentle);
    opacity.value = withTiming(0.9, { duration: instagramTheme.animations.duration.fast });
  };

  const handlePressOut = () => {
    if (!pressable) return;
    scale.value = withSpring(1, instagramTheme.animations.spring.bouncy);
    opacity.value = withTiming(1, { duration: instagramTheme.animations.duration.fast });
  };

  const renderCardContent = () => {
    switch (variant) {
      case 'gradient':
        return (
          <LinearGradient
            colors={instagramTheme.colors.gradients.card}
            style={[styles.cardBase, styles.gradientCard]}
          >
            {children}
          </LinearGradient>
        );
      
      case 'solid':
        return (
          <View style={[styles.cardBase, styles.solidCard]}>
            {children}
          </View>
        );
      
      case 'glass':
      default:
        return (
          <BlurView intensity={20} tint="dark" style={[styles.cardBase, styles.glassCard]}>
            <View style={styles.glassOverlay}>
              {children}
            </View>
          </BlurView>
        );
    }
  };

  if (!pressable || !onPress) {
    return (
      <Animated.View style={[styles.container, style, animatedStyle]}>
        {renderCardContent()}
      </Animated.View>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, style, animatedStyle]}
    >
      {renderCardContent()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: instagramTheme.spacing.md,
    marginBottom: instagramTheme.spacing.md,
    borderRadius: instagramTheme.borderRadius.xl,
    overflow: 'hidden',
  },
  cardBase: {
    borderRadius: instagramTheme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: instagramTheme.colors.glass.light,
  },
  glassCard: {
    backgroundColor: 'transparent',
  },
  glassOverlay: {
    backgroundColor: instagramTheme.colors.glass.medium,
    borderRadius: instagramTheme.borderRadius.xl,
  },
  gradientCard: {
    borderColor: instagramTheme.colors.glass.medium,
  },
  solidCard: {
    backgroundColor: instagramTheme.colors.background.tertiary,
    borderColor: instagramTheme.colors.glass.light,
  },
});