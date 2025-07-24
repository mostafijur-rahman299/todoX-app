import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '@/components/UI/CustomText';
import { colors } from '@/constants/Colors';

const CustomBigButton = ({ handleSignIn, isLoading, buttonText }) => {
  return (
    <View
      style={[styles.buttonContainer]}
    >
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isLoading}
        style={styles.signInButton}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={buttonText}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <CustomText style={styles.buttonText}>{buttonText}</CustomText>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 28,
  },
  signInButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 20,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

export default CustomBigButton;