import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { Meal } from '../../types/meal';
import { colors } from '../../constants/theme';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width - 48, 320);
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 8;

// 扇区颜色（渐变感）
const SEGMENT_COLORS = [
  '#8B5CF6',
  '#A78BFA',
  '#EC4899',
  '#F472B6',
  '#06B6D4',
  '#22D3EE',
  '#8B5CF6',
  '#A78BFA',
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
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>还没想好吃啥？</Text>
        <Text style={styles.emptySubtext}>先加几个再说</Text>
      </View>
    );
  }

  const segmentAngle = 360 / meals.length;

  return (
    <View style={styles.container}>
      {/* 指针 */}
      <View style={styles.pointer} />
      <View style={styles.wheelWrapper}>
        <Animated.View style={[styles.wheel, animatedStyle]}>
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            <G>
              {meals.map((_, i) => {
                const startAngle = i * segmentAngle;
                const endAngle = (i + 1) * segmentAngle;
                const d = createSegmentPath(startAngle, endAngle, CENTER, CENTER, RADIUS);
                const fill = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
                return <Path key={i} d={d} fill={fill} stroke={colors.cardBorder} strokeWidth={1} />;
              })}
            </G>
          </Svg>
          <View style={styles.labelsOverlay} pointerEvents="none">
            {meals.map((meal, i) => {
              const pos = getLabelPosition(i, meals.length, CENTER, CENTER, RADIUS);
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
        style={({ pressed }) => [styles.spinButton, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.spinButtonText}>开转！</Text>
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
    top: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.pink,
    zIndex: 10,
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: colors.backgroundLight,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
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
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonWrapper: {
    marginTop: 32,
  },
  spinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  spinButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  emptyContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
  },
});
