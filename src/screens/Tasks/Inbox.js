import { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/store/Task/category';
import { setTasks, toggleTaskComplete } from '@/store/Task/task';
import { defaultCategories } from '@/constants/GeneralData';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeDataLocalStorage, getDataLocalStorage } from '@/utils/storage';
import AddTaskButton from '@/components/AddTaskButton';
import TaskDetailModal from '@/components/Tasks/TaskDetailModal';

// Import new components
import EmptyState from '@/components/Inbox/EmptyState';
import InboxHeader from '@/components/Inbox/InboxHeader';
import MenuDropdown from '@/components/Inbox/MenuDropdown';
import TaskItem from '@/components/Inbox/TaskItem';

/**
 * Main Inbox component for displaying and managing tasks
 */
const Inbox = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.display_tasks);
  const categories = useSelector((state) => state.category.categories);
  const [showMenu, setShowMenu] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [filterBy, setFilterBy] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;

  /**
   * Get priority color based on priority level
   */
  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textTertiary;
    }
  }, []);

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    /**
     * Initialize categories from storage or use defaults
     */
    const initializeCategories = async () => {
      try {
        const storedCategories = await AsyncStorage.getItem('categories');
        let categoriesToSet = storedCategories ? JSON.parse(storedCategories) : defaultCategories;

        categoriesToSet = categoriesToSet.filter(
          (category) => !categories.some((c) => c.name === category.name) && category.name !== 'all'
        );

        if (categoriesToSet.length > 0) {
          await AsyncStorage.setItem('categories', JSON.stringify(categoriesToSet));
          dispatch(setCategories(categoriesToSet));
        }
      } catch (error) {
        console.error('Error managing categories:', error);
      }
    };

    /**
     * Load tasks from local storage
     */
    const loadTasks = async () => {
      try {
        const storedTasks = await getDataLocalStorage('task_list') || [];
        if (storedTasks.length > 0) {
          dispatch(setTasks(storedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    initializeCategories();
    loadTasks();

    return () => {
      headerOpacity.stopAnimation();
    };
  }, [dispatch, categories, headerOpacity]);

  /**
   * Handle task press to open detail modal
   */
  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  /**
   * Handle closing task detail modal
   */
  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  /**
   * Toggle task completion status
   */
  const handleToggleComplete = async (taskId) => {
    try {
      dispatch(toggleTaskComplete(taskId));
      const existingTasks = await getDataLocalStorage('task_list') || [];
      const updatedTasks = existingTasks.map((task) =>
        task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
      );
      await storeDataLocalStorage('task_list', updatedTasks);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  /**
   * Handle refresh tasks from storage
   */
  const handleRefreshTasks = async () => {
    setIsRefreshing(true);
    try {
      const storedTasks = await getDataLocalStorage('task_list') || [];
      dispatch(setTasks(storedTasks));
      Alert.alert('Success', 'Tasks refreshed successfully');
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      Alert.alert('Error', 'Failed to refresh tasks. Please try again.');
    } finally {
      setIsRefreshing(false);
      setShowMenu(false);
    }
  };

  /**
   * Handle entering selection mode
   */
  const handleEnterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedTaskIds([]);
    setShowMenu(false);
  };

  /**
   * Handle exiting selection mode
   */
  const handleExitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedTaskIds([]);
  };

  /**
   * Handle task selection in selection mode
   */
  const handleTaskSelection = (taskId) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter(id => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };

  /**
   * Handle bulk actions on selected tasks
   */
  const handleBulkComplete = async () => {
    try {
      const existingTasks = await getDataLocalStorage('task_list') || [];
      const updatedTasks = existingTasks.map((task) =>
        selectedTaskIds.includes(task.id) ? { ...task, is_completed: true } : task
      );
      await storeDataLocalStorage('task_list', updatedTasks);
      dispatch(setTasks(updatedTasks));
      handleExitSelectionMode();
      Alert.alert('Success', `${selectedTaskIds.length} tasks marked as complete`);
    } catch (error) {
      console.error('Error completing tasks:', error);
      Alert.alert('Error', 'Failed to complete tasks. Please try again.');
    }
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (filter) => {
    setFilterBy(filter);
    setShowMenu(false);
  };

  /**
   * Filter tasks based on current filter
   */
  const getFilteredTasks = useCallback(() => {
    let filtered = tasks?.filter((task) => !task.is_completed) || [];
    
    if (filterBy !== 'all') {
      filtered = filtered.filter((task) => task.priority === filterBy);
    }
    
    return filtered;
  }, [tasks, filterBy]);

  /**
   * Render individual task item
   */
  const renderTaskItem = useCallback(
    ({ item, index }) => (
      <TaskItem
        item={item}
        index={index}
        onToggleComplete={handleToggleComplete}
        onTaskPress={isSelectionMode ? () => handleTaskSelection(item.id) : () => handleTaskPress(item)}
        getPriorityColor={getPriorityColor}
        isSelectionMode={isSelectionMode}
        isSelected={selectedTaskIds.includes(item.id)}
      />
    ),
    [getPriorityColor, isSelectionMode, selectedTaskIds, handleToggleComplete, handleTaskPress, handleTaskSelection]
  );

  const filteredTasks = getFilteredTasks();

  const handleUpdateTask = () => {

  }

  return (
    <SafeAreaView style={styles.container}>
      {showMenu && (
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        />
      )}

      <View style={styles.headerWrapper}>
        <InboxHeader
          filteredTasksCount={filteredTasks.length}
          filterBy={filterBy}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          isSelectionMode={isSelectionMode}
          selectedTaskIds={selectedTaskIds}
          onExitSelectionMode={handleExitSelectionMode}
          onBulkComplete={handleBulkComplete}
        />

        <MenuDropdown
          showMenu={showMenu}
          filterBy={filterBy}
          isRefreshing={isRefreshing}
          onEnterSelectionMode={handleEnterSelectionMode}
          onRefreshTasks={handleRefreshTasks}
          onFilterChange={handleFilterChange}
        />
      </View>

      {filteredTasks.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item?.id?.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.taskSeparator} />}
        />
      )}

      <AddTaskButton />

      <TaskDetailModal
        visible={showTaskModal}
        onClose={handleCloseTaskModal}
        task={selectedTask}
        onUpdateTask={(updatedTask) => handleUpdateTask(updatedTask)}
        onDeleteTask={(taskId) => {
          console.log('Delete task:', taskId);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    zIndex: 1000, // Elevate headerContainer to ensure its children are above other elements
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textTertiary,
    letterSpacing: 0.2,
  },
  menuContainer: {
    position: 'relative',
    zIndex: 2000, // Ensure menuContainer is above other elements
  },
  menuButton: {
    padding: spacing.xs,
  },
  menuButtonInner: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 999,
  },
  menuDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    minWidth: 200,
    ...shadows.md,
    zIndex: 2500, // Higher than menuOverlay and other components
    elevation: 10, // Ensure visibility on Android
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  menuItemText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  activeMenuItem: {
    backgroundColor: colors.primary + '15',
  },
  menuSeparator: {
    height: 1,
    backgroundColor: colors.textTertiary + '20',
    marginVertical: spacing.sm,
  },
  menuSectionTitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  disabledText: {
    color: colors.textTertiary,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    flex: 1,
    zIndex: 1000, // Ensure selection header is above list but below menu
  },
  selectionButton: {
    padding: spacing.xs,
  },
  selectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    zIndex: 500, // Lower than menu elements
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  emptyStateIcon: {
    opacity: 0.8,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * 1.5,
    maxWidth: 280,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: 100,
    zIndex: 500, // Lower than menu elements
  },
  taskSeparator: {
    height: spacing.sm,
  },
  taskItemContainer: {
    marginBottom: 0,
  },
  taskItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: 2,
    ...shadows.sm,
    overflow: 'hidden',
    zIndex: 600, // Above list container but below menu
  },
  selectedTaskItem: {
    backgroundColor: colors.primary + '15',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  taskItemGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: spacing.xs,
  },
  checkbox: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    ...shadows.sm,
  },
  checkedBox: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },
  selectionCheckbox: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  selectionCheckboxInner: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  selectedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  taskDetails: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  taskTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: typography.fontSize.md * 1.2,
    letterSpacing: -0.1,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  taskDate: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: typography.fontWeight.medium,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  taskTag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  taskTagText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
    opacity: 0.6,
  },
  prioritySection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: spacing.xs,
    paddingTop: 2,
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  priorityLabel: {
    fontSize: 8,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default Inbox;