import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TodoList from '@/components/Tasks/TodoList';

const Today = () => {
  return (
    <View style={styles.container}>
      <TodoList />
    </View>
  );
};

export default Today;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});