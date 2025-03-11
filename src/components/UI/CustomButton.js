import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

const CustomButton = ({ title, onPress, style, textStyle }) => {
  return (
    <Pressable 
      style={[styles.button, style]} 
      onPress={onPress}
      android_ripple={{ color: '#fdf2f278' }}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomButton;
