import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Animated,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import CustomText from '@/components/UI/CustomText';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/Colors';
import { deleteTask, toggleTaskComplete, setTasks } from '@/store/Task/task';
import { storeDataLocalStorage } from '@/utils/storage';

/**
 * CompletedTask component - displays completed tasks with selection and deletion functionality
 * Features: Multiple selection, delete selected, delete all, task restoration, undo functionality
 */
const CompletedTask = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    
    // Get completed tasks from Redux store
    const allTasks = useSelector((state) => state.task.task_list);
    const completedTasks = allTasks.filter(task => task.is_completed);
    
    // Component state
    const [selectedTasks, setSelectedTasks] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(-50));
    const [recentlyDeleted, setRecentlyDeleted] = useState([]);
    const [undoTimeout, setUndoTimeout] = useState(null);

    /**
     * Initialize component with enhanced animations
     */
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    /**
     * Cleanup undo timeout on unmount
     */
    useEffect(() => {
        return () => {
            if (undoTimeout) {
                clearTimeout(undoTimeout);
            }
        };
    }, [undoTimeout]);

    /**
     * Handle refresh functionality
     */
    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh delay
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedTasks(new Set());
    };

    const toggleTaskSelection = (taskId) => {
        const newSelectedTasks = new Set(selectedTasks);
        if (newSelectedTasks.has(taskId)) {
            newSelectedTasks.delete(taskId);
        } else {
            newSelectedTasks.add(taskId);
        }
        setSelectedTasks(newSelectedTasks);
    };

    const selectAllTasks = () => {
        if (selectedTasks.size === completedTasks.length) {
            setSelectedTasks(new Set());
        } else {
            setSelectedTasks(new Set(completedTasks.map(task => task.id)));
        }
    };

    const clearAllTask = (taskId) => {
        dispatch(toggleTaskComplete(taskId));
        
        // Update local storage
        const updatedTasks = allTasks.map(task => 
            task.id === taskId 
                ? { ...task, is_completed: false, completed_timestamp: null }
                : task
        );
        storeDataLocalStorage('tasks', updatedTasks);
    };

    const clearSelectedTask = () => {
        if (selectedTasks.size === 0) return;

        Alert.alert(
            'Mark as Incomplete',
            `Mark ${selectedTasks.size} task${selectedTasks.size > 1 ? 's' : ''} as incomplete?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Mark Incomplete',
                    style: 'default',
                    onPress: () => {
                        selectedTasks.forEach(taskId => {
                            dispatch(toggleTaskComplete(taskId));
                        });
                        
                        // Update local storage
                        const updatedTasks = allTasks.map(task => 
                            selectedTasks.has(task.id)
                                ? { ...task, is_completed: false, completed_timestamp: null }
                                : task
                        );
                        storeDataLocalStorage('tasks', updatedTasks);
                        
                        setSelectedTasks(new Set());
                        setIsSelectionMode(false);
                    },
                },
            ]
        );
    };

    const showUndoNotification = (deletedTasks) => {
        setRecentlyDeleted(deletedTasks);
        
        // Clear existing timeout
        if (undoTimeout) {
            clearTimeout(undoTimeout);
        }
        
        // Set new timeout to clear undo option
        const timeout = setTimeout(() => {
            setRecentlyDeleted([]);
        }, 5000); // 5 seconds to undo
        
        setUndoTimeout(timeout);
    };

    const undoDelete = () => {
        if (recentlyDeleted.length === 0) return;
        
        // Restore deleted tasks
        const restoredTasks = [...allTasks, ...recentlyDeleted];
        dispatch(setTasks(restoredTasks));
        storeDataLocalStorage('tasks', restoredTasks);
        
        // Clear undo state
        setRecentlyDeleted([]);
        if (undoTimeout) {
            clearTimeout(undoTimeout);
            setUndoTimeout(null);
        }
    };

    const deleteSelectedTasks = () => {
        if (selectedTasks.size === 0) return;

        Alert.alert(
            'Delete Selected Tasks',
            `Are you sure you want to delete ${selectedTasks.size} completed task${selectedTasks.size > 1 ? 's' : ''}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // Store deleted tasks for undo
                        const tasksToDelete = allTasks.filter(task => selectedTasks.has(task.id));
                        
                        selectedTasks.forEach(taskId => {
                            dispatch(deleteTask(taskId));
                        });
                        
                        // Update local storage
                        const updatedTasks = allTasks.filter(task => !selectedTasks.has(task.id));
                        storeDataLocalStorage('tasks', updatedTasks);
                        
                        setSelectedTasks(new Set());
                        setIsSelectionMode(false);
                        
                        // Show undo notification
                        showUndoNotification(tasksToDelete);
                    },
                },
            ]
        );
    };

    const deleteAllCompletedTasks = () => {
        if (completedTasks.length === 0) return;

        Alert.alert(
            'Delete All Completed Tasks',
            `Are you sure you want to delete all ${completedTasks.length} completed tasks?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: () => {
                        // Store deleted tasks for undo
                        const tasksToDelete = [...completedTasks];
                        
                        completedTasks.forEach(task => {
                            dispatch(deleteTask(task.id));
                        });
                        
                        // Update local storage
                        const updatedTasks = allTasks.filter(task => !task.is_completed);
                        storeDataLocalStorage('tasks', updatedTasks);
                        
                        setSelectedTasks(new Set());
                        setIsSelectionMode(false);
                        
                        // Show undo notification
                        showUndoNotification(tasksToDelete);
                    },
                },
            ]
        );
    };

    const formatCompletionDate = (timestamp) => {
        if (!timestamp) return 'Recently completed';
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString();
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return colors.highPriority;
            case 'medium': return colors.mediumPriority;
            case 'low': return colors.lowPriority;
            default: return colors.textTertiary;
        }
    };

    const renderTaskItem = (task) => {
        const isSelected = selectedTasks.has(task.id);
        
        return (
            <Animated.View
                key={task.id}
                style={[
                    styles.taskItemWrapper,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.taskItem,
                        isSelected && styles.taskItemSelected,
                    ]}
                    onPress={() => {
                        if (isSelectionMode) {
                            toggleTaskSelection(task.id);
                        }
                    }}
                    onLongPress={() => {
                        if (!isSelectionMode) {
                            setIsSelectionMode(true);
                            toggleTaskSelection(task.id);
                        }
                    }}
                    activeOpacity={0.8}
                >                    

                    {/* Task content */}
                    <View style={styles.taskContent}>
                        {/* Task header */}
                        <View style={styles.taskHeader}>
                            <View style={styles.taskTitleContainer}>
                                <TouchableOpacity
                                    style={styles.completedIconContainer}
                                    onPress={() => clearAllTask(task.id)}
                                >
                                    <View style={styles.completedIconBg}>
                                        <Ionicons 
                                            name="checkmark-circle" 
                                            size={20} 
                                            color={colors.success} 
                                        />
                                    </View>
                                </TouchableOpacity>
                                <CustomText 
                                    variant="body" 
                                    weight="medium" 
                                    style={styles.taskTitle}
                                    numberOfLines={2}
                                >
                                    {task.title}
                                </CustomText>
                            </View>
                            
                            {/* Priority indicator */}
                            {task.priority && (
                                <View style={styles.priorityContainer}>
                                    <View style={[
                                        styles.priorityIndicator,
                                        { backgroundColor: getPriorityColor(task.priority) }
                                    ]} />
                                    <CustomText variant="overline" style={[
                                        styles.priorityText,
                                        { color: getPriorityColor(task.priority) }
                                    ]}>
                                        {task.priority.toUpperCase()}
                                    </CustomText>
                                </View>
                            )}
                        </View>

                        {/* Task summary */}
                        {task.summary && (
                            <CustomText 
                                variant="caption" 
                                style={styles.taskDescription}
                                numberOfLines={2}
                            >
                                {task.summary}
                            </CustomText>
                        )}

                        {/* Task metadata */}
                        <View style={styles.taskMetadata}>
                            {/* Category */}
                            {task.category && (
                                <View style={styles.categoryContainer}>
                                    <View style={styles.categoryDot} />
                                    <CustomText variant="overline" style={styles.categoryText}>
                                        {task.category}
                                    </CustomText>
                                </View>
                            )}

                            {/* Completion date */}
                            <View style={styles.completionDateContainer}>
                                <Ionicons 
                                    name="time-outline" 
                                    size={12} 
                                    color={colors.textTertiary} 
                                />
                                <CustomText variant="overline" style={styles.completionDate}>
                                    {formatCompletionDate(task.completed_timestamp)}
                                </CustomText>
                            </View>
                        </View>
                    </View>

                    {/* Quick action button */}
                    {!isSelectionMode && (
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => clearAllTask(task.id)}
                        >
                            <Ionicons name="refresh-outline" size={18} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    /**
     * Render enhanced undo notification bar
     */
    const renderUndoNotification = () => {
        if (recentlyDeleted.length === 0) return null;

        return (
            <Animated.View style={[styles.undoContainer, { opacity: fadeAnim }]}>
                <View style={styles.undoContent}>
                    <View style={styles.undoIconContainer}>
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                    </View>
                    <CustomText variant="body" style={styles.undoText}>
                        {recentlyDeleted.length} task{recentlyDeleted.length > 1 ? 's' : ''} deleted
                    </CustomText>
                </View>
                <TouchableOpacity
                    style={styles.undoButton}
                    onPress={undoDelete}
                >
                    <CustomText variant="body" weight="semibold" style={styles.undoButtonText}>
                        UNDO
                    </CustomText>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    /**
     * Render enhanced empty state
     */
    const renderEmptyState = () => (
        <Animated.View 
            style={[styles.emptyContainer, { opacity: fadeAnim }]}
        >
            <View style={styles.emptyIconContainer}>
                <Ionicons 
                    name="checkmark-done-circle-outline" 
                    size={80} 
                    color={colors.textTertiary} 
                />
            </View>
            <CustomText variant="h4" weight="semibold" style={styles.emptyTitle}>
                All Caught Up!
            </CustomText>
            <CustomText variant="body" style={styles.emptyDescription}>
                No completed tasks yet. When you finish tasks, they'll appear here for you to review your accomplishments.
            </CustomText>
            <View style={styles.emptyActionContainer}>
                <TouchableOpacity 
                    style={styles.emptyActionButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                    <CustomText variant="body" weight="medium" style={styles.emptyActionText}>
                        Add New Task
                    </CustomText>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container}>            
            {/* Enhanced Header */}
            <Animated.View 
                style={[styles.header, { opacity: fadeAnim }]}
            >
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <CustomText variant="h3" weight="bold" style={styles.headerTitle}>
                            Completed
                        </CustomText>
                        {completedTasks.length > 0 && (
                            <View style={styles.taskCountBadge}>
                                <CustomText variant="caption" weight="semibold" style={styles.taskCountBadgeText}>
                                    {completedTasks.length}
                                </CustomText>
                            </View>
                        )}
                    </View>
                </View>

                {completedTasks.length > 0 && (
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={[styles.headerButton, isSelectionMode && styles.headerButtonActive]}
                            onPress={toggleSelectionMode}
                        >
                            <Ionicons 
                                name={isSelectionMode ? "close" : "checkmark-done-outline"} 
                                size={20} 
                                color={isSelectionMode ? colors.error : colors.textPrimary} 
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </Animated.View>

            {/* Enhanced Selection toolbar */}
            {isSelectionMode && (
                <Animated.View style={[styles.selectionToolbar, { opacity: fadeAnim }]}>
                    <View style={styles.selectionInfo}>
                        <CustomText variant="body" weight="medium" style={styles.selectionText}>
                            {selectedTasks.size} of {completedTasks.length} selected
                        </CustomText>
                        <TouchableOpacity
                            style={styles.selectAllButton}
                            onPress={selectAllTasks}
                        >
                            <CustomText variant="body" weight="semibold" style={styles.selectAllText}>
                                {selectedTasks.size === completedTasks.length ? 'Deselect All' : 'Select All'}
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                    
                    {selectedTasks.size > 0 && (
                        <View style={styles.selectionActions}>
                            <TouchableOpacity
                                style={styles.uncompleteButton}
                                onPress={clearSelectedTask}
                            >
                                <Ionicons name="refresh-outline" size={18} color={colors.primary} />
                                <CustomText variant="body" weight="medium" style={styles.uncompleteButtonText}>
                                    Restore
                                </CustomText>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.deleteSelectedButton}
                                onPress={deleteSelectedTasks}
                            >
                                <Ionicons name="trash-outline" size={18} color={colors.error} />
                                <CustomText variant="body" weight="medium" style={styles.deleteButtonText}>
                                    Delete
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            )}

            {/* Task count and actions */}
            {completedTasks.length > 0 && !isSelectionMode && (
                <Animated.View style={[styles.taskCountContainer, { opacity: fadeAnim }]}>
                    <View style={styles.taskCountInfo}>
                        <CustomText variant="caption" style={styles.taskCount}>
                            {completedTasks.length} completed task{completedTasks.length !== 1 ? 's' : ''}
                        </CustomText>
                    </View>
                    <View style={styles.taskActions}>
                        <TouchableOpacity
                            style={styles.clearAllButton}
                            onPress={deleteAllCompletedTasks}
                        >
                            <Ionicons name="trash-outline" size={16} color={colors.error} />
                            <CustomText variant="caption" weight="medium" style={styles.clearAllText}>
                                Clear All
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {/* Undo notification */}
            {renderUndoNotification()}

            {/* Task list */}
            <View style={styles.content}>
                {completedTasks.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={colors.primary}
                                colors={[colors.primary]}
                            />
                        }
                    >
                        <View style={styles.taskList}>
                            {completedTasks.map(renderTaskItem)}
                        </View>
                        <View style={styles.bottomSpacer} />
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        ...shadows.sm,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: colors.textPrimary,
        marginRight: spacing.sm,
    },
    taskCountBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskCountBadgeText: {
        color: colors.white,
        fontSize: 12,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerButtonActive: {
        backgroundColor: colors.errorLight + '20',
    },
    selectionToolbar: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surfaceElevated,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    selectionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    selectionText: {
        color: colors.textPrimary,
    },
    selectAllButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary + '20',
    },
    selectAllText: {
        color: colors.primary,
    },
    selectionActions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    uncompleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary + '15',
        flex: 1,
        justifyContent: 'center',
        gap: spacing.xs,
    },
    uncompleteButtonText: {
        color: colors.primary,
    },
    deleteSelectedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.error + '15',
        flex: 1,
        justifyContent: 'center',
        gap: spacing.xs,
    },
    deleteButtonText: {
        color: colors.error,
    },
    taskCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    taskCountInfo: {
        flex: 1,
    },
    taskCount: {
        color: colors.textSecondary,
    },
    taskActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.error + '10',
        gap: spacing.xs,
    },
    clearAllText: {
        color: colors.error,
    },
    undoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surfaceElevated,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        ...shadows.sm,
    },
    undoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    undoIconContainer: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.md,
        backgroundColor: colors.error + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    undoText: {
        color: colors.textPrimary,
    },
    undoButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
    },
    undoButtonText: {
        color: colors.white,
    },
    content: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    taskList: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    taskItemWrapper: {
        marginBottom: spacing.md,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
    },
    taskItemSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '08',
        ...shadows.colored,
    },
    checkboxContainer: {
        marginRight: spacing.md,
        marginTop: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: borderRadius.sm,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    checkboxSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    taskContent: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    taskTitleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    completedIconContainer: {
        marginRight: spacing.md,
    },
    completedIconBg: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.md,
        backgroundColor: colors.success + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskTitle: {
        flex: 1,
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
        opacity: 0.8,
        lineHeight: 22,
    },
    priorityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        gap: spacing.xs,
    },
    priorityIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    priorityText: {
        fontSize: 9,
        fontWeight: '600',
    },
    taskDescription: {
        color: colors.textTertiary,
        marginLeft: 44,
        marginBottom: spacing.md,
        opacity: 0.8,
        lineHeight: 18,
    },
    taskMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 44,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        gap: spacing.xs,
    },
    categoryDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.secondary,
    },
    categoryText: {
        color: colors.textTertiary,
        fontSize: 11,
        fontWeight: '500',
    },
    completionDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    completionDate: {
        color: colors.textTertiary,
        fontSize: 11,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: borderRadius['2xl'],
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        ...shadows.lg,
    },
    emptyTitle: {
        color: colors.textPrimary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    emptyDescription: {
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    emptyActionContainer: {
        width: '100%',
        alignItems: 'center',
    },
    emptyActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.primary + '20',
        borderWidth: 1,
        borderColor: colors.primary + '40',
        gap: spacing.sm,
    },
    emptyActionText: {
        color: colors.primary,
    },
    bottomSpacer: {
        height: spacing.xl,
    },
    quickActionButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.md,
    },
});

export default CompletedTask;