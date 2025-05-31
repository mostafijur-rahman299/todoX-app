import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/Colors';

const CustomText = ({ children, style, fontWeight }) => {
  // Determine the font family based on fontWeight prop
  let fontFamily = Platform.select({
    ios: 'System',
    android: 'sans-serif',
  });

  if (fontWeight === 'bold') {
    fontFamily = Platform.select({
      ios: 'System-Bold', // iOS often uses 'System-Semibold' or 'System-Bold'
      android: 'sans-serif-bold', // Android might use 'Roboto-Bold' or 'sans-serif-condensed-bold'
    });
  } else if (fontWeight === 'medium') {
    fontFamily = Platform.select({
      ios: 'System-Medium', // iOS specific weight
      android: 'sans-serif-medium', // Android specific weight
    });
  }
  // Add more conditions for other weights if needed e.g. light, thin

  return <Text style={[styles.text, { fontFamily }, style]}>{children}</Text>;
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: colors.text, // Use the new text color from our palette
  },
});
