import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TodoList from '@/components/Tasks/TodoList';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/store/Task/category';
import { defaultCategories } from '@/constants/GeneralData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Today = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    const initializeCategories = async () => {
      try {
        // Try to get categories from storage
        const storedCategories = await AsyncStorage.getItem('categories');
        
        if (!storedCategories) {
          // If no stored categories, filter and save default ones
          const nonExistingCategories = defaultCategories.filter(
            category => !categories.some(c => c.name === category.name) && category.name !== 'all'
          );
          
          if (nonExistingCategories.length > 0) {
            // Save to AsyncStorage
            await AsyncStorage.setItem('categories', JSON.stringify(nonExistingCategories));
            // Update Redux store
            dispatch(setCategories(nonExistingCategories));
          }
        } else {
          // If categories exist in storage but not in state, restore them
          const parsedCategories = JSON.parse(storedCategories);
          const categoriesToAdd = parsedCategories.filter(
            category => !categories.some(c => c.name === category.name)
          );
          
          if (categoriesToAdd.length > 0) {
            dispatch(setCategories(categoriesToAdd));
          }
        }
      } catch (error) {
        console.error('Error managing default categories:', error);
      }
    };

    initializeCategories();
  }, []);
  
  return (
    <View style={styles.container}>
      <TodoList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Today;