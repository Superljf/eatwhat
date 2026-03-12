import { Tabs } from 'expo-router';
import { Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { instagramTheme } from '../../src/constants/instagramTheme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {name}
    </Text>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  // 计算合适的底部高度
  const tabBarHeight = Platform.select({
    ios: Math.max(70, 60 + insets.bottom), // iOS 需要额外的安全区域，最小70px
    android: 70,
    web: 70, // Web端合适高度70px
  });

  // 计算底部内边距
  const bottomPadding = Platform.select({
    ios: Math.max(12, insets.bottom + 4), // iOS 底部安全区域 + 4px 内边距，最小12px
    android: 12,
    web: 12,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          {
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderTopWidth: 0,
            height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          paddingHorizontal: 8,
            borderTopLeftRadius: instagramTheme.borderRadius.xl,
            borderTopRightRadius: instagramTheme.borderRadius.xl,
            shadowColor: instagramTheme.colors.shadow.heavy,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
          },
          // Web 端强制样式
          Platform.OS === 'web' && {
            minHeight: '85px !important' as any,
            height: '85px !important' as any,
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.3)',
          },
        ],
        tabBarActiveTintColor: instagramTheme.colors.primary,
        tabBarInactiveTintColor: instagramTheme.colors.text.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: { 
          fontSize: instagramTheme.typography.fontSize.xs,
          fontWeight: instagramTheme.typography.fontWeight.semibold,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '转盘',
          tabBarIcon: ({ focused }) => <TabIcon name="🎡" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: '列表',
          tabBarIcon: ({ focused }) => <TabIcon name="📋" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: instagramTheme.typography.fontSize.xl, // 合适的图标大小
    opacity: 0.7,
    marginBottom: 0,
  },
  tabIconFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
});
