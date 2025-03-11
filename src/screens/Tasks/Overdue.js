import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Overdue = () => {
  return (
    <View style={styles.container}>
        <Text>Overdue</Text>
    </View>
  );
};

export default Overdue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});