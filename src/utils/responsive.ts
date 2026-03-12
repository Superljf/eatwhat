/**
 * 响应式布局工具 - 基于 React Native 官方规范
 * 参考: useWindowDimensions, Flexbox justifyContent/alignItems
 */

import { useWindowDimensions } from 'react-native';

// 屏幕尺寸断点 (参考主流手机型号)
export const BREAKPOINTS = {
  xs: 320,   // iPhone SE, 小屏
  sm: 375,   // iPhone 12 mini
  md: 390,   // iPhone 12/13
  lg: 414,   // iPhone Plus
  xl: 428,   // iPhone Pro Max
  xxl: 600,  // 平板/折叠屏
} as const;

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * 响应式布局 Hook - 使用 useWindowDimensions 自动响应屏幕变化
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const screenSize: ScreenSize =
    width >= BREAKPOINTS.xxl ? 'xxl' :
    width >= BREAKPOINTS.xl ? 'xl' :
    width >= BREAKPOINTS.lg ? 'lg' :
    width >= BREAKPOINTS.md ? 'md' :
    width >= BREAKPOINTS.sm ? 'sm' : 'xs';

  const isSmallScreen = width < BREAKPOINTS.md;
  const isMediumScreen = width >= BREAKPOINTS.md && width < BREAKPOINTS.xxl;
  const isLargeScreen = width >= BREAKPOINTS.xxl;

  // 响应式内边距 - 基于屏幕宽度百分比
  const horizontalPadding = Math.max(16, width * 0.05);
  const verticalPadding = Math.max(12, height * 0.02);

  // 内容最大宽度 - 保持居中且不过宽
  const contentMaxWidth = Math.min(width - horizontalPadding * 2, 400);

  // 响应式字体缩放系数
  const fontScale = width < BREAKPOINTS.sm ? 0.9 : width < BREAKPOINTS.md ? 0.95 : 1;

  return {
    width,
    height,
    screenSize,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    horizontalPadding,
    verticalPadding,
    contentMaxWidth,
    fontScale,
  };
}

/**
 * 计算转盘尺寸 - 响应式
 */
export function getWheelSize(width: number, height: number): number {
  const minDimension = Math.min(width, height);
  if (width < BREAKPOINTS.sm) {
    return Math.min(minDimension - 48, 220);
  }
  if (width < BREAKPOINTS.md) {
    return Math.min(minDimension - 64, 260);
  }
  if (width < BREAKPOINTS.xxl) {
    return Math.min(minDimension - 80, 300);
  }
  return Math.min(minDimension - 100, 320);
}
