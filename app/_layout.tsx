import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMealStore } from '../src/stores/mealStore';

export default function RootLayout() {
  const loadMeals = useMealStore((s) => s.loadMeals);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F0F12' },
          animation: 'slide_from_right',
        }}
      />
    </GestureHandlerRootView>
  );
}
