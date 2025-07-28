import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from './CustomText';
import { colors, spacing, borderRadius, shadows } from '@/constants/Colors';

/**
 * Enhanced CustomButton component with refined design and versatile usage
 * Supports primary, secondary, outline, ghost, and danger variants with rounded options
 */
const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false, // New prop for pill-shaped buttons
  ...props 
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    rounded && styles.rounded, // Apply rounded style if prop is true
    disabled && styles.disabled,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle
  ];

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primary} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconWrapper}>
              {icon}
            </View>
          )}
          <CustomText style={textStyles}>{title}</CustomText>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconWrapper}>
              {icon}
            </View>
          )}
        </>
      )}
    </>
  );

  if (variant === 'primary' || variant === 'danger') {
    const gradientColors = variant === 'primary' 
      ? colors.gradients.primary 
      : [colors.error, colors.errorDark];

    return (
      <Pressable 
        style={({ pressed }) => [
          buttonStyles,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        android_ripple={{ 
          color: colors.white + '30', // Softer ripple effect
          borderless: false 
        }}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        accessibilityLabel={title}
        {...props}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, rounded && styles.roundedGradient]}
        >
          {renderContent()}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable 
      style={({ pressed }) => [
        buttonStyles,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ 
        color: colors.primary + '30', // Softer ripple effect
        borderless: false 
      }}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={title}
      {...props}
    >
      {renderContent()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadows.sm, // Slightly stronger shadow for better depth
  },
  
  // Variants
  primary: {
    ...shadows.colored,
  },
  secondary: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border + '80', // Slightly more opaque border
    ...shadows.sm,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.primary + 'CC', // Slightly translucent primary color
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  danger: {
    ...shadows.md,
  },
  
  // Sizes
  small: {
    paddingHorizontal: spacing.sm, // More compact padding
    paddingVertical: spacing.xs,
    minHeight: 32, // Smaller height
  },
  medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40, // Slightly smaller than before
  },
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  
  // States
  disabled: {
    opacity: 0.5, // Slightly less opacity for better contrast
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    transform: [{ scale: 0.95 }], // More pronounced press effect
  },
  fullWidth: {
    width: '100%',
  },
  rounded: {
    borderRadius: 999, // Pill-shaped buttons
  },
  
  // Gradient container
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40, // Match medium size
  },
  roundedGradient: {
    borderRadius: 999, // Ensure gradient matches rounded style
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.textPrimary,
  },
  text_outline: {
    color: colors.primary,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_danger: {
    color: colors.white,
  },
  text_small: {
    fontSize: 13, // Slightly smaller font
  },
  text_medium: {
    fontSize: 15,
  },
  text_large: {
    fontSize: 17,
  },
  textDisabled: {
    color: colors.disabledText,
  },
  
  // Icon wrapper for consistent spacing
  iconWrapper: {
    marginHorizontal: spacing.xs, // Consistent spacing for icons
  },
});

export default CustomButton;