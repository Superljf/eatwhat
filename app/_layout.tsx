import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMealStore } from '../src/stores/mealStore';

export default function RootLayout() {
  const loadMeals = useMealStore((s) => s.loadMeals);

  useEffect(() => {
    loadMeals();
    
    // Web 端注入自定义样式修复 Tab 栏
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* 合适的 Web 端 Tab 栏高度 */
        [role="tablist"] {
          min-height: 70px !important;
          height: 70px !important;
          padding-bottom: 12px !important;
          padding-top: 8px !important;
        }
        
        [role="tab"] {
          min-height: 50px !important;
          padding: 6px 8px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* Tab 栏文字样式 */
        [role="tab"] span {
          font-size: 10px !important;
          font-weight: 600 !important;
          margin-top: 2px !important;
          line-height: 1.2 !important;
        }
        
        /* Tab 栏图标样式 */
        [role="tab"] > span:first-child {
          font-size: 18px !important;
          margin-bottom: 0px !important;
        }
        
        /* 激活状态 */
        [role="tab"][aria-selected="true"] {
          color: #E4405F !important;
        }
        
        [role="tab"][aria-selected="false"] {
          color: #8E8E93 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, [loadMeals]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' },
            animation: 'slide_from_right',
          }}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
