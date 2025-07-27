import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '@/components/UI/CustomText';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/Colors';

/**
 * Enhanced CustomBigButton component for prominent call-to-action buttons
 * Features improved gradients, animations, and accessibility
 */
const CustomBigButton = ({ 
  handleSignIn, 
  isLoading, 
  buttonText,
  variant = 'primary',
  disabled = false,
  icon,
  style,
  textStyle,
  ...props 
}) => {
  const gradientColors = variant === 'primary' 
    ? colors.gradients.primary 
    : variant === 'secondary'
    ? colors.gradients.secondary
    : colors.gradients.primary;

  return (
    <View style={[styles.buttonContainer, style]}>
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isLoading || disabled}
        style={[
          styles.signInButton,
          (isLoading || disabled) && styles.disabled
        ]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={buttonText}
        accessibilityState={{ 
          disabled: isLoading || disabled,
          busy: isLoading 
        }}
        {...props}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.white} />
              <CustomText style={[styles.buttonText, styles.loadingText]}>
                Loading...
              </CustomText>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <CustomText style={[styles.buttonText, textStyle]}>
                {buttonText}
              </CustomText>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: spacing.lg,
  },
  signInButton: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...shadows.colored,
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  gradientButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  buttonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
});

export default CustomBigButton;