import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Completed = () => {
  return (
    <View style={styles.container}>
        <Text>Completed</Text>
    </View>
  );
};

export default Completed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});