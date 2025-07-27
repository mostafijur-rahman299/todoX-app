/**
 * Enhanced color system for TodoX app
 * Dark theme design matching the provided screenshots
 */

export const colors = {
  // Dark theme primary colors
  primary: '#FF6B6B', // Red accent color from screenshots
  primaryDark: '#E55555',
  primaryLight: '#FF8E8E',
  secondary: '#4ECDC4', // Teal accent
  secondaryDark: '#3BB5AD',
  secondaryLight: '#6FD5CE',
  
  // Dark theme backgrounds
  background: '#1A1A1A', // Main dark background
  backgroundSecondary: '#2A2A2A', // Secondary dark background
  surface: '#2D2D2D', // Card/surface background
  surfaceElevated: '#3A3A3A', // Elevated surface
  overlay: 'rgba(0, 0, 0, 0.8)',
  
  // Dark theme text colors
  textPrimary: '#FFFFFF', // Primary white text
  textSecondary: '#B0B0B0', // Secondary gray text
  textTertiary: '#808080', // Tertiary gray text
  textQuaternary: '#606060', // Quaternary gray text
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textPlaceholder: '#666666',
  
  // Status colors for dark theme
  success: '#4CAF50',
  successLight: '#81C784',
  successDark: '#388E3C',
  warning: '#FF9800',
  warningLight: '#FFB74D',
  warningDark: '#F57C00',
  error: '#F44336',
  errorLight: '#E57373',
  errorDark: '#D32F2F',
  info: '#2196F3',
  infoLight: '#64B5F6',
  infoDark: '#1976D2',
  
  // Border and divider colors for dark theme
  border: '#404040',
  borderLight: '#505050',
  borderDark: '#303030',
  divider: '#404040',
  
  // Task status colors
  completed: '#4CAF50',
  completedBg: 'rgba(76, 175, 80, 0.1)',
  pending: '#FF9800',
  pendingBg: 'rgba(255, 152, 0, 0.1)',
  overdue: '#F44336',
  overdueBg: 'rgba(244, 67, 54, 0.1)',
  
  // Priority colors with dark theme backgrounds
  highPriority: '#F44336',
  highPriorityBg: 'rgba(244, 67, 54, 0.1)',
  mediumPriority: '#FF9800',
  mediumPriorityBg: 'rgba(255, 152, 0, 0.1)',
  lowPriority: '#4CAF50',
  lowPriorityBg: 'rgba(76, 175, 80, 0.1)',
  
  // Interactive states for dark theme
  hover: 'rgba(255, 255, 255, 0.08)',
  pressed: 'rgba(255, 255, 255, 0.12)',
  focus: 'rgba(255, 107, 107, 0.16)',
  disabled: '#404040',
  disabledText: '#606060',
  
  // Shadows for dark theme
  shadow: {
    light: 'rgba(0, 0, 0, 0.2)',
    medium: 'rgba(0, 0, 0, 0.3)',
    heavy: 'rgba(0, 0, 0, 0.4)',
    colored: 'rgba(255, 107, 107, 0.3)',
  },
  
  // Gradient combinations for dark theme
  gradients: {
    primary: ['#FF6B6B', '#FF8E8E'],
    secondary: ['#4ECDC4', '#6FD5CE'],
    success: ['#4CAF50', '#81C784'],
    warm: ['#FF9800', '#FFB74D'],
    cool: ['#2196F3', '#64B5F6'],
    sunset: ['#FF5722', '#FF8A65'],
    ocean: ['#00BCD4', '#4DD0E1'],
  },
  
  // Utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Category colors for dark theme
  categories: {
    work: '#2196F3',
    personal: '#E91E63',
    health: '#4CAF50',
    finance: '#FF9800',
    education: '#9C27B0',
    shopping: '#F44336',
    travel: '#00BCD4',
    other: '#607D8B',
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
 * Shadow presets for dark theme
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

