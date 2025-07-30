import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/store/Task/category';
import { setTasks, toggleTaskComplete } from '@/store/Task/task';
import { defaultCategories } from '@/constants/GeneralData';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeDataLocalStorage, getDataLocalStorage } from '@/utils/storage';
import AddTaskButton from '@/components/AddTaskButton';
import TaskDetailModal from '@/components/Tasks/TaskDetailModal';

/**
 * Empty state component to display when no tasks are available
 */
const EmptyState = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.emptyStateContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.emptyStateIconContainer}>
        <Ionicons 
          name="checkmark-circle-outline" 
          size={80} 
          color={colors.primary} 
          style={styles.emptyStateIcon}
        />
      </View>
      <Text style={styles.emptyStateTitle}>All caught up!</Text>
      <Text style={styles.emptyStateSubtitle}>
        You have no pending tasks.{'\n'}
        Tap the + button to add a new task.
      </Text>
    </Animated.View>
  );
};

const Inbox = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.display_tasks);
  const categories = useSelector((state) => state.category.categories);
  const [showMenu, setShowMenu] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const headerOpacity = useRef(new Animated.Value(0)).current;

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
  }, [dispatch, categories]);

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
   * Render individual task item
   */
  const renderTaskItem = useCallback(
    ({ item, index }) => (
      <TaskItem
        item={item}
        index={index}
        onToggleComplete={handleToggleComplete}
        onTaskPress={handleTaskPress}
        getPriorityColor={getPriorityColor}
      />
    ),
    [getPriorityColor]
  );

  const incompleteTasks = tasks?.filter((task) => !task.is_completed) || [];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Inbox</Text>
            <Text style={styles.headerSubtitle}>
              {incompleteTasks.length} {incompleteTasks.length === 1 ? 'task' : 'tasks'} remaining
            </Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenu(!showMenu)}
            activeOpacity={0.7}
          >
            <View style={styles.menuButtonInner}>
              <Ionicons name="ellipsis-vertical" size={16} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {incompleteTasks.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={incompleteTasks}
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
        onUpdateTask={(updatedTask) => {
          console.log('Update task:', updatedTask);
        }}
        onDeleteTask={(taskId) => {
          console.log('Delete task:', taskId);
        }}
      />
    </SafeAreaView>
  );
};

const TaskItem = React.memo(({ item, index, onToggleComplete, onTaskPress, getPriorityColor }) => {
  const itemAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(itemAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      easing: Easing.out(Easing.bezier(0.25, 0.46, 0.45, 0.94)),
      useNativeDriver: true,
    }).start();
  }, [itemAnim, index]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        tension: 400,
        friction: 10,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 400,
        friction: 10,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Med';
      case 'low':
        return 'Low';
      default:
        return '';
    }
  };

  const getPriorityLabelColor = (priority) => {
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
  };

  const getTaskTag = () => {
    if (item.category && item.category !== 'inbox') {
      return item.category;
    }
    if (item.priority) {
      return item.priority;
    }
    return 'task';
  };

  const getPriorityGradient = (priority) => {
    switch (priority) {
      case 'high':
        return [colors.error + '80', colors.error + '20'];
      case 'medium':
        return [colors.warning + '80', colors.warning + '20'];
      case 'low':
        return [colors.success + '80', colors.success + '20'];
      default:
        return [colors.textTertiary + '40', colors.textTertiary + '10'];
    }
  };

  const animatedShadowStyle = {
    shadowOpacity: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.06, 0.15],
    }),
    elevation: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 8],
    }),
  };

  return (
    <Animated.View
      style={[
        styles.taskItemContainer,
        {
          opacity: itemAnim,
          transform: [
            {
              translateY: itemAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Animated.View style={[styles.taskItem, animatedShadowStyle]}>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onTaskPress(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ flex: 1 }}
        >
          <View style={styles.taskContent}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => onToggleComplete(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxInner, item.is_completed && styles.checkedBox]}>
                {item.is_completed && <Ionicons name="checkmark" size={14} color={colors.white} />}
              </View>
            </TouchableOpacity>
            <View style={styles.taskDetails}>
              <Text
                style={[styles.taskTitle, item.is_completed && styles.completedText]}
              >
                {item.title}
              </Text>
              <View style={styles.taskMeta}>
                <Text style={styles.taskDate}>
                  {new Date(item.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year:
                      new Date(item.timestamp).getFullYear() !== new Date().getFullYear()
                        ? 'numeric'
                        : undefined,
                  })}
                </Text>
                <View style={styles.taskTag}>
                  <Text style={styles.taskTagText}>{getTaskTag()}</Text>
                </View>
              </View>
            </View>
            <View style={styles.prioritySection}>
              <View
                style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]}
              />
              {item.priority && (
                <Text
                  style={[styles.priorityLabel, { color: getPriorityLabelColor(item.priority) }]}
                >
                  {getPriorityLabel(item.priority)}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
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
  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
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