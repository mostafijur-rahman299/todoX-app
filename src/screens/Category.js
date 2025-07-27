import React, { useState, memo, useCallback, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory, deleteCategory } from '@/store/Task/category';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/Colors';
import { randomColor, generateId } from '@/utils/gnFunc';
import CustomText from '@/components/UI/CustomText';
import CustomButton from '@/components/UI/CustomButton';

const { width } = Dimensions.get('window');

/**
 * Enhanced Categories screen with modern UI/UX design
 * Features improved animations, better category management, and enhanced accessibility
 */
const Categories = () => {
  const categoriesData = useSelector((state) => state.category.categories || []);
  const tasks = useSelector((state) => state.task.task_list || []);
  const [newCategory, setNewCategory] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [focusedInput, setFocusedInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  /**
   * Handles adding a new category with validation
   */
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    // Check for duplicate category names
    const isDuplicate = categoriesData.some(
      category => category.name.toLowerCase() === newCategory.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      Alert.alert('Duplicate Category', 'A category with this name already exists.');
      return;
    }

    setIsLoading(true);

    try {
      const newCategoryItem = {
        id: generateId(),
        name: newCategory.trim(),
        color: randomColor(),
        icon: 'bookmark-outline'
      };
      
      dispatch(addCategory(newCategoryItem));
      
      const existingCategories = await AsyncStorage.getItem('categories');
      const parsedCategories = existingCategories ? JSON.parse(existingCategories) : [];
      const updatedCategories = [...parsedCategories, newCategoryItem];
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      
      setNewCategory('');
      
      // Success animation
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true })
      ]).start();
      
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert('Error', 'Failed to create category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles category deletion with task validation
   */
  const handleDeleteClick = async (categoryId, categoryName) => {
    if (!tasks) return;
    
    const hasAssociatedTasks = tasks.some(task => task.category === categoryName);
    
    if (hasAssociatedTasks) {
      setCategoryToDelete(categoryId);
      setShowWarning(true);
    } else {
      await handleConfirmDelete(categoryId);
    }
  };

  /**
   * Confirms and executes category deletion
   */
  const handleConfirmDelete = async (categoryId = null) => {
    try {
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
      Alert.alert('Error', 'Failed to delete category. Please try again.');
    }
  };

  /**
   * Renders individual category item with enhanced design
   */
  const renderCategoryItem = useCallback(({ item, index }) => {
    const taskCount = tasks?.filter(task => task.category === item.name)?.length || 0;
    
    return (
      <Animated.View 
        style={[
          styles.categoryItem,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <LinearGradient
          colors={[
            colors.gradients.primary[0],
            colors.gradients.primary[1]
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryGradient}
        >
          <View style={styles.categoryContent}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIconContainer}>
                <Ionicons 
                  name={item.icon || 'bookmark'} 
                  size={24} 
                  color={colors.surface} 
                />
              </View>
              <View style={styles.categoryInfo}>
                <CustomText 
                  variant="h5" 
                  weight="bold" 
                  color="surface"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </CustomText>
                <View style={styles.taskCountBadge}>
                  <CustomText variant="caption" weight="medium" color="surface">
                    {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}
                  </CustomText>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => handleDeleteClick(item.id, item.name)}
              style={styles.deleteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }, [tasks, fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <CustomText variant="h2" weight="bold" color="textPrimary">
          Categories
        </CustomText>
        <CustomText variant="body" color="textSecondary">
          Organize your tasks by category
        </CustomText>
      </Animated.View>
            
      {/* Main Content */}
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
          <Animated.View 
            style={[
              styles.emptyState,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <View style={styles.emptyIconContainer}>
              <Ionicons name="folder-open-outline" size={64} color={colors.textTertiary} />
            </View>
            <CustomText variant="h4" weight="semibold" color="textPrimary" style={styles.emptyTitle}>
              No Categories Yet
            </CustomText>
            <CustomText variant="body" color="textSecondary" style={styles.emptySubtitle}>
              Create your first category to organize your tasks better
            </CustomText>
          </Animated.View>
        )}
      </View>

      {/* Add Category Section */}
      <Animated.View 
        style={[
          styles.bottomContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <LinearGradient
          colors={[colors.background + '00', colors.background]}
          style={styles.bottomGradient}
        >
          <View style={styles.inputContainer}>
            <View style={[
              styles.inputWrapper,
              focusedInput && styles.inputWrapperFocused
            ]}>
              <View style={styles.inputIconContainer}>
                <Ionicons 
                  name="add" 
                  size={20} 
                  color={focusedInput ? colors.primary : colors.textTertiary} 
                />
              </View>
              <TextInput
                style={styles.input}
                value={newCategory}
                onChangeText={setNewCategory}
                placeholder="Create new category"
                placeholderTextColor={colors.textTertiary}
                returnKeyType="done"
                onSubmitEditing={handleAddCategory}
                maxLength={30}
                onFocus={() => setFocusedInput(true)}
                onBlur={() => setFocusedInput(false)}
              />
              {newCategory.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setNewCategory('')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
            
            <CustomButton
              title="Create"
              onPress={handleAddCategory}
              disabled={!newCategory.trim() || isLoading}
              loading={isLoading}
              variant="primary"
              size="medium"
              style={styles.createButton}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Delete Confirmation Modal */}
      {showWarning && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowWarning(false)}
        >
          <View style={styles.modalBackdrop}>
            <Animated.View style={styles.modalContent}>
              <LinearGradient
                colors={[colors.surface, colors.surfaceVariant]}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconContainer}>
                    <Ionicons name="warning" size={32} color={colors.warning} />
                  </View>
                  <CustomText variant="h4" weight="bold" color="textPrimary" style={styles.modalTitle}>
                    Delete Category
                  </CustomText>
                </View>
                
                <CustomText variant="body" color="textSecondary" style={styles.modalText}>
                  This category has associated tasks. Are you sure you want to delete it? 
                  All associated tasks will be moved to "Other" category.
                </CustomText>
                
                <View style={styles.modalButtons}>
                  <CustomButton
                    title="Cancel"
                    onPress={() => setShowWarning(false)}
                    variant="outline"
                    size="medium"
                    style={styles.modalButton}
                  />
                  <CustomButton
                    title="Delete"
                    onPress={async () => await handleConfirmDelete()}
                    variant="danger"
                    size="medium"
                    style={styles.modalButton}
                  />
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default memo(Categories);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  mainContent: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  categoryItem: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  categoryGradient: {
    padding: spacing.lg,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  taskCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomContainer: {
    backgroundColor: colors.background,
  },
  bottomGradient: {
    paddingTop: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    ...shadows.medium,
  },
  inputIconContainer: {
    padding: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  clearButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceVariant,
  },
  createButton: {
    minWidth: 80,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.large,
  },
  modalGradient: {
    padding: spacing.xl,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalIconContainer: {
    marginBottom: spacing.md,
  },
  modalTitle: {
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
