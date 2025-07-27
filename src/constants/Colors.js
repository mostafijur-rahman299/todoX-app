/**
 * Enhanced color system for TodoX app
 * Provides consistent, accessible, and modern color palette
 * with support for light/dark themes and semantic color usage
 */

export const colors = {
  // Primary brand colors - Modern gradient-friendly palette
  primary: '#6366F1', // Indigo - more modern and professional
  primaryDark: '#4F46E5',
  primaryLight: '#8B5CF6',
  secondary: '#EC4899', // Pink accent for gradients
  secondaryDark: '#DB2777',
  secondaryLight: '#F472B6',
  
  // Neutral colors - Improved contrast and readability
  background: '#FAFBFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  overlay: 'rgba(15, 23, 42, 0.6)',
  
  // Text colors - Better hierarchy and accessibility
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textQuaternary: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textPlaceholder: '#94A3B8',
  
  // Semantic colors - Status and feedback
  success: '#059669',
  successLight: '#D1FAE5',
  successDark: '#047857',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  warningDark: '#B45309',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  errorDark: '#B91C1C',
  info: '#0284C7',
  infoLight: '#E0F2FE',
  infoDark: '#0369A1',
  
  // Border and divider colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',
  divider: '#F1F5F9',
  
  // Task status colors
  completed: '#059669',
  completedBg: '#D1FAE5',
  pending: '#D97706',
  pendingBg: '#FEF3C7',
  overdue: '#DC2626',
  overdueBg: '#FEE2E2',
  
  // Priority colors with backgrounds
  highPriority: '#DC2626',
  highPriorityBg: '#FEE2E2',
  mediumPriority: '#D97706',
  mediumPriorityBg: '#FEF3C7',
  lowPriority: '#059669',
  lowPriorityBg: '#D1FAE5',
  
  // Interactive states
  hover: 'rgba(99, 102, 241, 0.08)',
  pressed: 'rgba(99, 102, 241, 0.12)',
  focus: 'rgba(99, 102, 241, 0.16)',
  disabled: '#F1F5F9',
  disabledText: '#CBD5E1',
  
  // Shadows and elevation
  shadow: {
    light: 'rgba(15, 23, 42, 0.04)',
    medium: 'rgba(15, 23, 42, 0.08)',
    heavy: 'rgba(15, 23, 42, 0.12)',
    colored: 'rgba(99, 102, 241, 0.2)',
  },
  
  // Gradient combinations
  gradients: {
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#EC4899', '#F472B6'],
    success: ['#059669', '#10B981'],
    warm: ['#F59E0B', '#EAB308'],
    cool: ['#0284C7', '#0EA5E9'],
    sunset: ['#F97316', '#FB923C'],
    ocean: ['#0891B2', '#06B6D4'],
  },
  
  // Utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Category colors - for task categorization
  categories: {
    work: '#6366F1',
    personal: '#EC4899',
    health: '#059669',
    finance: '#D97706',
    education: '#7C3AED',
    shopping: '#DC2626',
    travel: '#0284C7',
    other: '#64748B',
  },
};

/**
 * Spacing system for consistent layout
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

/**
 * Typography scale for consistent text sizing
 */
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

/**
 * Border radius scale for consistent rounded corners
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

/**
 * Shadow presets for consistent elevation
 */
export const shadows = {
  sm: {
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow.heavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  colored: {
    shadowColor: colors.shadow.colored,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
};

