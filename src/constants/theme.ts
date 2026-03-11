// Design Tokens - 年轻化、时尚、潮流
export const colors = {
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  pink: '#EC4899',
  cyan: '#06B6D4',
  background: '#0F0F12',
  backgroundLight: '#1A1A1F',
  card: 'rgba(255, 255, 255, 0.06)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
};

export const gradients = {
  primary: ['#8B5CF6', '#EC4899'] as const,
  cyan: ['#06B6D4', '#8B5CF6'] as const,
  background: ['#0F0F12', '#1A1A1F', '#0F0F12'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
};
