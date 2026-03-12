// Instagram 风格设计系统 - 2024-2026 现代化配色与设计规范
export const instagramColors = {
  // Instagram 经典渐变色系
  primary: '#E4405F', // Instagram 粉红
  secondary: '#F77737', // Instagram 橙色
  tertiary: '#FCAF45', // Instagram 黄色
  quaternary: '#833AB4', // Instagram 紫色
  
  // 现代渐变组合
  gradients: {
    // Instagram 经典渐变
    classic: ['#833AB4', '#C13584', '#E1306C', '#FD1D1D', '#F77737'] as const,
    // 现代简化版本
    modern: ['#E4405F', '#F77737'] as const,
    // 夜间模式渐变
    dark: ['#1A1A2E', '#16213E', '#0F3460'] as const,
    // 玻璃态渐变
    glass: ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)'] as const,
    // 卡片渐变
    card: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] as const,
  },
  
  // 背景色系
  background: {
    primary: '#000000', // 纯黑背景（Instagram 深色模式）
    secondary: '#121212', // 次级背景
    tertiary: '#1C1C1E', // 卡片背景
    surface: '#2C2C2E', // 表面色
  },
  
  // 文字色系
  text: {
    primary: '#FFFFFF', // 主要文字
    secondary: '#EBEBF5', // 次要文字
    tertiary: '#EBEBF599', // 三级文字（60% 透明度）
    muted: '#8E8E93', // 静音文字
    accent: '#007AFF', // 强调色（链接等）
  },
  
  // 功能色系
  functional: {
    success: '#30D158', // 成功色
    warning: '#FF9F0A', // 警告色
    error: '#FF3B30', // 错误色
    info: '#007AFF', // 信息色
  },
  
  // 玻璃态效果
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    heavy: 'rgba(255, 255, 255, 0.25)',
    blur: 'rgba(255, 255, 255, 0.08)',
  },
  
  // 阴影色系
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    heavy: 'rgba(0, 0, 0, 0.4)',
    colored: 'rgba(228, 64, 95, 0.3)', // 带色彩的阴影
  },
};

// Instagram 风格间距系统
export const instagramSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
};

// Instagram 风格圆角系统
export const instagramBorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
  circle: '50%' as const,
};

// Instagram 风格字体系统
export const instagramTypography = {
  // 字体大小
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    xxxxl: 28,
    xxxxxl: 32,
    title: 36,
    hero: 48,
  },
  
  // 字体粗细
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },
  
  // 行高
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Instagram 风格动画配置
export const instagramAnimations = {
  // 缓动函数
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)' as const,
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)' as const,
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)' as const,
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' as const,
  },
  
  // 持续时间
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  
  // Spring 动画配置
  spring: {
    gentle: {
      damping: 20,
      stiffness: 300,
      mass: 0.8,
    },
    bouncy: {
      damping: 15,
      stiffness: 400,
      mass: 1,
    },
    snappy: {
      damping: 25,
      stiffness: 500,
      mass: 0.6,
    },
  },
};

// Instagram 风格阴影系统
export const instagramShadows = {
  // 卡片阴影
  card: {
    shadowColor: instagramColors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // 浮动元素阴影
  floating: {
    shadowColor: instagramColors.shadow.heavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // 按钮阴影
  button: {
    shadowColor: instagramColors.shadow.colored,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // 内阴影效果（通过 border 模拟）
  inset: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
};

// 导出完整主题
export const instagramTheme = {
  colors: instagramColors,
  spacing: instagramSpacing,
  borderRadius: instagramBorderRadius,
  typography: instagramTypography,
  animations: instagramAnimations,
  shadows: instagramShadows,
} as const;

export default instagramTheme;