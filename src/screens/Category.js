import React, { useState, memo, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory, deleteCategory } from '@/store/Task/category';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { randomColor, generateId } from '@/utils/gnFunc';

const Categories = () => {
  const categoriesData = useSelector((state) => state.category.categories || []);
  const tasks = useSelector((state) => state.task.task_list || []);
  const [newCategory, setNewCategory] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const dispatch = useDispatch();

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const newCategoryItem = {
        id: generateId(),
        name: newCategory,
        color: randomColor()
      };
      
      try {
        dispatch(addCategory(newCategoryItem));
        
        const existingCategories = await AsyncStorage.getItem('categories');
        const parsedCategories = existingCategories ? JSON.parse(existingCategories) : [];
        const updatedCategories = [...parsedCategories, newCategoryItem];
        await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        
        setNewCategory('');
      } catch (error) {
        console.error('Error saving category:', error);
      }
    }
  };

  const handleDeleteClick = async (categoryId, categoryName) => {
    if (!tasks) return;
    
    const hasAssociatedTasks = tasks.some(task => task.category === categoryName);
    
    if (hasAssociatedTasks) {
      setCategoryToDelete(categoryId);
      setShowWarning(true);
    } else {
      // Pass the categoryId to handleConfirmDelete since categoryToDelete isn't set yet
      await handleConfirmDelete(categoryId);
    }
  };

  const handleConfirmDelete = async (categoryId = null) => {
      try {
        // Use the passed categoryId if available, otherwise use the state value
        const idToDelete = categoryId || categoryToDelete;
        
        const existingCategories = await AsyncStorage.getItem('categories');
        if (existingCategories) {
          const parsedCategories = JSON.parse(existingCategories);
          const updatedCategories = parsedCategories.filter(
            category => category.id !== idToDelete
          );
          await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        }
        
        dispatch(deleteCategory(idToDelete));
        setShowWarning(false);
        setCategoryToDelete(null);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
  };

  const renderCategoryItem = useCallback(({ item, index }) => (
    <View style={styles.categoryItem}>
      <LinearGradient
        colors={index % 4 === 0 ? ['#4f46e5', '#4338ca'] : 
               index % 4 === 1 ? ['#7c3aed', '#6d28d9'] : 
               index % 4 === 2 ? ['#ec4899', '#be185d'] :
               ['#0891b2', '#0e7490']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.categoryGradient}
      >
        <View style={styles.categoryContent}>
          <View style={styles.categoryMainInfo}>
            <Text style={styles.categoryText}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
            <View style={styles.taskCountContainer}>
              <Text style={styles.taskCount}>
                {tasks?.filter(task => task.category === item.name)?.length || 0}
              </Text>
              <Text style={styles.taskLabel}>Tasks</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => handleDeleteClick(item.id, item.name)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            
      <View style={styles.mainContent}>
        {categoriesData?.length > 0 ? (
          <FlatList
            data={categoriesData}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id?.toString()}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No categoriesData yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first category using the field below
            </Text>
          </View>
        )}
      </View>

      {/* Add Section at Bottom */}
      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={['rgba(248, 250, 252, 0)', 'rgba(248, 250, 252, 0)']}
          style={styles.bottomGradient}
        >
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Text style={styles.inputIcon}>+</Text>
              </View>
              <TextInput
                style={styles.input}
                value={newCategory}
                onChangeText={setNewCategory}
                placeholder="Create new category"
                placeholderTextColor="#94a3b8"
                returnKeyType="done"
                onSubmitEditing={handleAddCategory}
                maxLength={30}
              />
              {newCategory.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setNewCategory('')}
                >
                  <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              onPress={handleAddCategory}
              disabled={!newCategory.trim()}
              style={[
                styles.addButton,
                !newCategory.trim() && styles.disabledButton,
              ]}
            >
              <LinearGradient
                colors={['#4f46e5', '#4338ca']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>Create</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {showWarning && (
        <Modal
          visible={true}
          transparent={true}
          animationType="none"
          onRequestClose={() => setShowWarning(false)}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowWarning(false)}
          >
            <View 
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
              onTouchEnd={e => e.stopPropagation()}
            >
              <LinearGradient
                colors={['#1e1b4b', '#312e81']}
                style={styles.modalHeader}
              >
                <Text style={styles.modalTitle}>Delete Category</Text>
              </LinearGradient>
              <Text style={styles.modalText}>
                This category has associated tasks. Are you sure you want to delete it?
                All associated tasks will be updated to have no category.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  onPress={() => setShowWarning(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleConfirmDelete}
                  style={styles.confirmButton}
                >
                  <LinearGradient
                    colors={['#dc2626', '#b91c1c']}
                    style={styles.confirmButtonGradient}
                  >
                    <Text style={styles.confirmButtonText}>Delete</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mainContent: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bottomGradient: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputIconContainer: {
    padding: 12,
    paddingLeft: 16,
  },
  inputIcon: {
    fontSize: 24,
    color: '#4f46e5',
    fontWeight: '300',
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  clearButtonText: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '300',
    lineHeight: 20,
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  categoryItem: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  categoryGradient: {
    padding: 24,
  },
  categoryContent: {
    gap: 16,
  },
  categoryMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    letterSpacing: 0.5,
  },
  taskCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  taskCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  taskLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: width * 0.85,
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalText: {
    padding: 24,
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default memo(Categories);
