import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/Colors';

/**
 * Enhanced CustomText component with improved typography system
 * Supports multiple variants, weights, and semantic color usage
 */
const CustomText = ({ 
  children, 
  style, 
  variant = 'body',
  weight = 'normal',
  color,
  align = 'left',
  numberOfLines,
  ellipsizeMode = 'tail',
  ...props 
}) => {
  return (
    <Text 
      style={[
        styles.base,
        styles[variant],
        styles[`weight_${weight}`],
        { textAlign: align },
        color && { color: typeof color === 'string' ? color : colors[color] },
        style
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
    fontFamily: 'System',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  
  // Font weights
  weight_normal: {
    fontWeight: typography.fontWeight.normal,
  },
  weight_medium: {
    fontWeight: typography.fontWeight.medium,
  },
  weight_semibold: {
    fontWeight: typography.fontWeight.semibold,
  },
  weight_bold: {
    fontWeight: typography.fontWeight.bold,
  },
  weight_extrabold: {
    fontWeight: typography.fontWeight.extrabold,
  },
  
  // Typography variants
  display: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.fontSize['5xl'] * typography.lineHeight.tight,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['4xl'] * typography.lineHeight.tight,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
  },
  h4: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },
  h5: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
  },
  h6: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
  
  // Legacy variants (for backward compatibility)
  heading: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
    marginBottom: 8,
  },
  subheading: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
    marginBottom: 4,
  },
  body: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  caption: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  overline: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
  },
  
  // Semantic variants
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  helper: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    lineHeight: typography.fontSize.xs * typography.lineHeight.relaxed,
  },
  error: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  success: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  warning: {
    fontSize: typography.fontSize.sm,
    color: colors.warning,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
});

