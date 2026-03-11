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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useMealStore } from '../src/stores/mealStore';
import { colors, gradients, borderRadius, spacing } from '../src/constants/theme';
import type { MealType } from '../src/types/meal';

const TYPE_OPTIONS: { value: MealType; label: string }[] = [
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
];

export default function AddScreen() {
  const router = useRouter();
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

  return (
    <LinearGradient colors={gradients.background as unknown as string[]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← 返回</Text>
          </Pressable>
          <Text style={styles.title}>{isEdit ? '编辑' : '添加'}餐点</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>想吃啥？</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="麦当劳、肯德基..."
            placeholderTextColor={colors.textMuted}
            autoFocus
            maxLength={20}
          />

          <Text style={[styles.label, { marginTop: spacing.lg }]}>午餐 or 晚餐？</Text>
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
              colors={gradients.primary as unknown as string[]}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>{isEdit ? '保存' : '添加'}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  backText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  form: {
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    color: colors.text,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeCapsule: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  typeCapsuleActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: colors.text,
  },
  submitButton: {
    marginTop: spacing.xl * 2,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
});
