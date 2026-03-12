import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useMealStore } from '../src/stores/mealStore';
import { instagramTheme } from '../src/constants/instagramTheme';
import { useResponsiveLayout } from '../src/utils/responsive';
import type { MealType } from '../src/types/meal';

const TYPE_OPTIONS: { value: MealType; label: string }[] = [
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
];

export default function AddScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { horizontalPadding, contentMaxWidth, isSmallScreen } = useResponsiveLayout();
  const params = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!params.id;

  const meals = useMealStore((s) => s.meals);
  const addMeal = useMealStore((s) => s.addMeal);
  const updateMeal = useMealStore((s) => s.updateMeal);

  const [name, setName] = useState('');
  const [type, setType] = useState<MealType>('lunch');
  
  const existingMeal = params.id ? meals.find((m) => m.id === params.id) : null;

  useEffect(() => {
    if (existingMeal) {
      setName(existingMeal.name);
      setType(existingMeal.type);
    }
  }, [existingMeal]);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('提示', '输入个名字呗');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isEdit && params.id) {
      await updateMeal(params.id, trimmed, type);
      router.back();
    } else {
      await addMeal(trimmed, type);
      router.back();
    }
  };

  // 动态样式 - 必须在组件内部
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.select({
        ios: Math.max(50, (insets?.top ?? 0) + 10),
        android: 50,
        web: 60,
      }),
    },
    keyboardView: {
      flex: 1,
    },
    header: {
      flexDirection: isSmallScreen ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: isSmallScreen ? 'center' : 'space-between',
      paddingHorizontal: horizontalPadding,
      marginBottom: isSmallScreen ? 20 : 28,
      gap: isSmallScreen ? 12 : 0,
      width: '100%',
      maxWidth: contentMaxWidth,
      alignSelf: 'center',
    },
    backButton: {
      borderRadius: instagramTheme.borderRadius.lg,
      overflow: 'hidden',
    },
    backGradient: {
      paddingVertical: instagramTheme.spacing.sm,
      paddingHorizontal: instagramTheme.spacing.md,
    },
    backText: {
      fontSize: instagramTheme.typography.fontSize.md,
      color: instagramTheme.colors.text.secondary,
      fontWeight: instagramTheme.typography.fontWeight.semibold,
    },
    titleGradient: {
      paddingHorizontal: isSmallScreen ? instagramTheme.spacing.md : instagramTheme.spacing.lg,
      paddingVertical: instagramTheme.spacing.sm,
      borderRadius: instagramTheme.borderRadius.lg,
    },
    title: {
      fontSize: isSmallScreen 
        ? instagramTheme.typography.fontSize.xl 
        : instagramTheme.typography.fontSize.xxl,
      fontWeight: instagramTheme.typography.fontWeight.black,
      color: instagramTheme.colors.text.primary,
      textAlign: 'center',
    },
    formBlur: {
      flex: 1,
      marginHorizontal: horizontalPadding,
      maxWidth: contentMaxWidth,
      alignSelf: 'center',
      width: '100%',
      borderRadius: instagramTheme.borderRadius.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: instagramTheme.colors.glass.medium,
    },
    form: {
      padding: isSmallScreen ? instagramTheme.spacing.xl : instagramTheme.spacing.xxxl,
    },
    label: {
      fontSize: isSmallScreen 
        ? instagramTheme.typography.fontSize.md 
        : instagramTheme.typography.fontSize.lg,
      fontWeight: instagramTheme.typography.fontWeight.bold,
      color: instagramTheme.colors.text.secondary,
      marginBottom: instagramTheme.spacing.sm,
    },
    inputContainer: {
      borderRadius: instagramTheme.borderRadius.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: instagramTheme.colors.glass.medium,
      backgroundColor: instagramTheme.colors.glass.light,
    },
    input: {
      paddingVertical: isSmallScreen ? instagramTheme.spacing.md : instagramTheme.spacing.lg,
      paddingHorizontal: instagramTheme.spacing.lg,
      fontSize: isSmallScreen 
        ? instagramTheme.typography.fontSize.md 
        : instagramTheme.typography.fontSize.lg,
      color: instagramTheme.colors.text.primary,
      fontWeight: instagramTheme.typography.fontWeight.medium,
    },
    typeRow: {
      flexDirection: 'row',
      gap: instagramTheme.spacing.sm,
    },
    typeCapsule: {
      flex: 1,
      paddingVertical: isSmallScreen ? instagramTheme.spacing.md : instagramTheme.spacing.lg,
      borderRadius: instagramTheme.borderRadius.lg,
      backgroundColor: instagramTheme.colors.glass.light,
      borderWidth: 1,
      borderColor: instagramTheme.colors.glass.medium,
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    typeCapsuleActive: {
      borderColor: instagramTheme.colors.primary,
    },
    typeActiveGradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: instagramTheme.borderRadius.xl,
    },
    typeText: {
      fontSize: isSmallScreen 
        ? instagramTheme.typography.fontSize.md 
        : instagramTheme.typography.fontSize.lg,
      fontWeight: instagramTheme.typography.fontWeight.semibold,
      color: instagramTheme.colors.text.tertiary,
      zIndex: 1,
    },
    typeTextActive: {
      color: instagramTheme.colors.text.primary,
      fontWeight: instagramTheme.typography.fontWeight.bold,
    },
    submitButton: {
      marginTop: isSmallScreen ? instagramTheme.spacing.xxl : instagramTheme.spacing.xxxxl,
      borderRadius: instagramTheme.borderRadius.lg,
      overflow: 'hidden',
      ...instagramTheme.shadows.button,
    },
    submitGradient: {
      paddingVertical: isSmallScreen ? instagramTheme.spacing.md : instagramTheme.spacing.xl,
      alignItems: 'center',
    },
    submitText: {
      fontSize: isSmallScreen 
        ? instagramTheme.typography.fontSize.lg 
        : instagramTheme.typography.fontSize.xl,
      fontWeight: instagramTheme.typography.fontWeight.heavy,
      color: instagramTheme.colors.text.primary,
    },
  });

  return (
    <LinearGradient colors={instagramTheme.colors.gradients.dark} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <LinearGradient
              colors={instagramTheme.colors.gradients.glass}
              style={styles.backGradient}
            >
              <Text style={styles.backText}>← 返回</Text>
            </LinearGradient>
          </Pressable>
          <LinearGradient
            colors={instagramTheme.colors.gradients.classic}
            style={styles.titleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.title}>{isEdit ? '编辑' : '添加'}餐点</Text>
          </LinearGradient>
        </View>

        <BlurView intensity={20} tint="dark" style={styles.formBlur}>
          <View style={styles.form}>
            <Text style={styles.label}>✨ 想吃啥？</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="麦当劳、肯德基、海底捞..."
                placeholderTextColor={instagramTheme.colors.text.muted}
                autoFocus
                maxLength={20}
                selectionColor={instagramTheme.colors.primary}
              />
            </View>

            <Text style={[styles.label, { marginTop: instagramTheme.spacing.xxl }]}>
              🍽️ 午餐 or 晚餐？
            </Text>
            <View style={styles.typeRow}>
              {TYPE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setType(opt.value)}
                  style={[
                    styles.typeCapsule,
                    type === opt.value && styles.typeCapsuleActive,
                  ]}
                >
                  {type === opt.value && (
                    <LinearGradient
                      colors={instagramTheme.colors.gradients.modern}
                      style={styles.typeActiveGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.typeText,
                      type === opt.value && styles.typeTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={instagramTheme.colors.gradients.modern}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.submitText}>
                  {isEdit ? '💾 保存' : '✨ 添加'}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
