import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ children, style }) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

export default CustomText;


const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000',
  },
});

