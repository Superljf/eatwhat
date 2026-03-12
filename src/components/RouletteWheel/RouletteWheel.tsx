import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { Meal } from '../../types/meal';
import { instagramTheme } from '../../constants/instagramTheme';
import { getWheelSize } from '../../utils/responsive';

// Instagram 风格扇区颜色
const SEGMENT_COLORS = [
  instagramTheme.colors.primary,
  instagramTheme.colors.secondary,
  instagramTheme.colors.tertiary,
  instagramTheme.colors.quaternary,
  '#C13584', // Instagram 中紫
  '#FD1D1D', // Instagram 红
  '#F77737', // Instagram 橙
  '#FCAF45', // Instagram 黄
];

function createSegmentPath(
  startAngle: number,
  endAngle: number,
  cx: number,
  cy: number,
  r: number
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const start = toRad(startAngle - 90);
  const end = toRad(endAngle - 90);
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function getLabelPosition(
  index: number,
  total: number,
  cx: number,
  cy: number,
  r: number
) {
  const angle = ((index + 0.5) / total) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const labelR = r * 0.65;
  return {
    x: cx + labelR * Math.cos(rad),
    y: cy + labelR * Math.sin(rad),
    rotation: (index + 0.5) / total * 360,
  };
}

interface RouletteWheelProps {
  meals: Meal[];
  onSpinComplete?: (meal: Meal) => void;
}

export function RouletteWheel({ meals, onSpinComplete }: RouletteWheelProps) {
  const { width, height } = useWindowDimensions();
  const wheelSize = useMemo(() => getWheelSize(width, height), [width, height]);
  const center = wheelSize / 2;
  const radius = center - 8;

  const rotation = useSharedValue(0);
  const isSpinning = useSharedValue(false);

  const spin = useCallback(() => {
    if (meals.length === 0 || isSpinning.value) return;

    isSpinning.value = true;
    const randomIndex = Math.floor(Math.random() * meals.length);
    const segmentAngle = 360 / meals.length;
    const baseRotation = randomIndex * segmentAngle + segmentAngle / 2;
    const fullRotations = 5 + Math.random() * 3;
    const targetRotation = rotation.value + fullRotations * 360 + (360 - baseRotation);

    rotation.value = withSpring(targetRotation, {
      damping: 15,
      stiffness: 50,
      mass: 0.8,
    }, (finished) => {
      if (finished) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        onSpinComplete?.(meals[randomIndex]);
        isSpinning.value = false;
      }
    });
  }, [meals, onSpinComplete, rotation, isSpinning]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (meals.length === 0) {
    return (
      <View style={[styles.emptyContainer, { width: wheelSize, height: wheelSize, borderRadius: wheelSize / 2 }]}>
        <LinearGradient
          colors={instagramTheme.colors.gradients.glass}
          style={styles.emptyGradient}
        >
          <Text style={styles.emptyText}>还没想好吃啥？</Text>
          <Text style={styles.emptySubtext}>先加几个再说 ✨</Text>
        </LinearGradient>
      </View>
    );
  }

  const segmentAngle = 360 / meals.length;

  return (
    <View style={[styles.container, { width: wheelSize }]}>
      {/* 指针：在转盘上方，尖端朝下指向转盘 */}
      <View style={styles.pointer} />
      <View style={[styles.wheelWrapper, { width: wheelSize, height: wheelSize, borderRadius: wheelSize / 2 }]}>
        <Animated.View style={[styles.wheel, { width: wheelSize, height: wheelSize }, animatedStyle]}>
          <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
            <G>
              {meals.map((_, i) => {
                const startAngle = i * segmentAngle;
                const endAngle = (i + 1) * segmentAngle;
                const d = createSegmentPath(startAngle, endAngle, center, center, radius);
                const fill = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
                return <Path key={i} d={d} fill={fill} stroke={instagramTheme.colors.glass.medium} strokeWidth={1.5} />;
              })}
            </G>
          </Svg>
          <View style={styles.labelsOverlay} pointerEvents="none">
            {meals.map((meal, i) => {
              const pos = getLabelPosition(i, meals.length, center, center, radius);
              return (
                <View
                  key={meal.id}
                  style={[
                    styles.labelWrapper,
                    {
                      left: pos.x - 40,
                      top: pos.y - 12,
                      transform: [{ rotate: `${-pos.rotation}deg` }],
                    },
                  ]}
                >
                  <Text style={styles.labelText} numberOfLines={1}>
                    {meal.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </View>
      <PressableButton onPress={spin} disabled={meals.length === 0} />
    </View>
  );
}

const PressableButton = ({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) => {
  const scale = useSharedValue(1);
  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <Animated.View style={[styles.buttonWrapper, animatedBtnStyle]}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        style={({ pressed }) => [pressed && { opacity: 0.9 }]}
      >
        <LinearGradient
          colors={instagramTheme.colors.gradients.modern}
          style={styles.spinButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.spinButtonText}>开转！</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointer: {
    position: 'absolute',
    top: 1, // 转盘上方合适位置
    left: '50%',
    marginLeft: -14, // 水平居中 (三角形宽 28)
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: instagramTheme.colors.primary,
    transform: [{ rotate: '180deg' }], // 旋转 180° 使尖端朝下
    zIndex: 10,
    shadowColor: instagramTheme.colors.shadow.colored,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  wheelWrapper: {
    overflow: 'hidden',
    backgroundColor: instagramTheme.colors.background.secondary,
    borderWidth: 2,
    borderColor: instagramTheme.colors.glass.medium,
    ...instagramTheme.shadows.floating,
  },
  wheel: {},
  labelsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelWrapper: {
    position: 'absolute',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    color: instagramTheme.colors.text.primary,
    fontSize: instagramTheme.typography.fontSize.sm,
    fontWeight: instagramTheme.typography.fontWeight.bold,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonWrapper: {
    marginTop: instagramTheme.spacing.xxxl,
  },
  spinButton: {
    paddingVertical: instagramTheme.spacing.lg,
    paddingHorizontal: instagramTheme.spacing.xxxxl,
    borderRadius: instagramTheme.borderRadius.xl,
    overflow: 'hidden',
    ...instagramTheme.shadows.button,
  },
  spinButtonText: {
    fontSize: instagramTheme.typography.fontSize.xl,
    fontWeight: instagramTheme.typography.fontWeight.heavy,
    color: instagramTheme.colors.text.primary,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: instagramTheme.spacing.xxl,
    borderWidth: 2,
    borderColor: instagramTheme.colors.glass.medium,
    borderStyle: 'dashed',
  },
  emptyGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
});
