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
import { colors, spacing, borderRadius, shadows } from '@/constants/Colors';
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
    const [recentlyDeleted, setRecentlyDeleted] = useState([]);
    const [undoTimeout, setUndoTimeout] = useState(null);

    /**
     * Initialize component with fade-in animation
     */
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
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

    /**
     * Toggle selection mode
     */
    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedTasks(new Set());
    };

    /**
     * Handle task selection
     */
    const toggleTaskSelection = (taskId) => {
        const newSelectedTasks = new Set(selectedTasks);
        if (newSelectedTasks.has(taskId)) {
            newSelectedTasks.delete(taskId);
        } else {
            newSelectedTasks.add(taskId);
        }
        setSelectedTasks(newSelectedTasks);
    };

    /**
     * Select all tasks
     */
    const selectAllTasks = () => {
        if (selectedTasks.size === completedTasks.length) {
            setSelectedTasks(new Set());
        } else {
            setSelectedTasks(new Set(completedTasks.map(task => task.id)));
        }
    };

    /**
     * Uncomplete a single task (mark as incomplete)
     */
    const uncompleteTask = (taskId) => {
        dispatch(toggleTaskComplete(taskId));
        
        // Update local storage
        const updatedTasks = allTasks.map(task => 
            task.id === taskId 
                ? { ...task, is_completed: false, completed_timestamp: null }
                : task
        );
        storeDataLocalStorage('tasks', updatedTasks);
    };

    /**
     * Uncomplete selected tasks
     */
    const uncompleteSelectedTasks = () => {
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

    /**
     * Show undo notification with auto-dismiss
     */
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

    /**
     * Undo recent deletion
     */
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

    /**
     * Delete selected tasks with undo option
     */
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

    /**
     * Delete all completed tasks with undo option
     */
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

    /**
     * Format completion date
     */
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

    /**
     * Get priority color
     */
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return colors.highPriority;
            case 'medium': return colors.mediumPriority;
            case 'low': return colors.lowPriority;
            default: return colors.textTertiary;
        }
    };

    /**
     * Render individual completed task item
     */
    const renderTaskItem = (task) => {
        const isSelected = selectedTasks.has(task.id);
        
        return (
            <TouchableOpacity
                key={task.id}
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
                activeOpacity={0.7}
            >
                {/* Selection checkbox */}
                {isSelectionMode && (
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => toggleTaskSelection(task.id)}
                    >
                        <View style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected
                        ]}>
                            {isSelected && (
                                <Ionicons name="checkmark" size={16} color={colors.white} />
                            )}
                        </View>
                    </TouchableOpacity>
                )}

                {/* Task content */}
                <View style={styles.taskContent}>
                    {/* Task header */}
                    <View style={styles.taskHeader}>
                        <View style={styles.taskTitleContainer}>
                            <TouchableOpacity
                                style={styles.completedIconContainer}
                                onPress={() => uncompleteTask(task.id)}
                            >
                                <Ionicons 
                                    name="checkmark-circle" 
                                    size={20} 
                                    color={colors.success} 
                                    style={styles.completedIcon}
                                />
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
                            <View style={[
                                styles.priorityIndicator,
                                { backgroundColor: getPriorityColor(task.priority) }
                            ]} />
                        )}
                    </View>

                    {/* Task description */}
                    {task.description && (
                        <CustomText 
                            variant="caption" 
                            style={styles.taskDescription}
                            numberOfLines={2}
                        >
                            {task.description}
                        </CustomText>
                    )}

                    {/* Task metadata */}
                    <View style={styles.taskMetadata}>
                        {/* Category */}
                        {task.category && (
                            <View style={styles.categoryContainer}>
                                <Ionicons 
                                    name="pricetag" 
                                    size={12} 
                                    color={colors.textTertiary} 
                                />
                                <CustomText variant="overline" style={styles.categoryText}>
                                    {task.category}
                                </CustomText>
                            </View>
                        )}

                        {/* Completion date */}
                        <CustomText variant="overline" style={styles.completionDate}>
                            {formatCompletionDate(task.completed_timestamp)}
                        </CustomText>
                    </View>
                </View>

                {/* Quick action button */}
                {!isSelectionMode && (
                    <TouchableOpacity
                        style={styles.quickActionButton}
                        onPress={() => uncompleteTask(task.id)}
                    >
                        <Ionicons name="refresh" size={18} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    /**
     * Render undo notification bar
     */
    const renderUndoNotification = () => {
        if (recentlyDeleted.length === 0) return null;

        return (
            <Animated.View style={styles.undoContainer}>
                <View style={styles.undoContent}>
                    <Ionicons name="trash" size={20} color={colors.textPrimary} />
                    <CustomText variant="body" style={styles.undoText}>
                        {recentlyDeleted.length} task{recentlyDeleted.length > 1 ? 's' : ''} deleted
                    </CustomText>
                </View>
                <TouchableOpacity
                    style={styles.undoButton}
                    onPress={undoDelete}
                >
                    <CustomText variant="body" weight="semibold" color={colors.primary}>
                        UNDO
                    </CustomText>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    /**
     * Render empty state
     */
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons 
                name="checkmark-circle-outline" 
                size={80} 
                color={colors.textTertiary} 
            />
            <CustomText variant="h4" weight="semibold" style={styles.emptyTitle}>
                No Completed Tasks
            </CustomText>
            <CustomText variant="body" style={styles.emptyDescription}>
                Complete some tasks to see them here. Your achievements will be displayed in this section.
            </CustomText>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <CustomText variant="h3" weight="semibold" style={styles.headerTitle}>
                        Completed Tasks
                    </CustomText>
                </View>

                {completedTasks.length > 0 && (
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={toggleSelectionMode}
                        >
                            <Ionicons 
                                name={isSelectionMode ? "close" : "checkmark-done"} 
                                size={20} 
                                color={colors.textPrimary} 
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Selection toolbar */}
            {isSelectionMode && (
                <Animated.View style={[styles.selectionToolbar, { opacity: fadeAnim }]}>
                    <View style={styles.selectionInfo}>
                        <CustomText variant="body" weight="medium">
                            {selectedTasks.size} of {completedTasks.length} selected
                        </CustomText>
                        <TouchableOpacity
                            style={styles.selectAllButton}
                            onPress={selectAllTasks}
                        >
                            <CustomText variant="body" color={colors.primary}>
                                {selectedTasks.size === completedTasks.length ? 'Deselect All' : 'Select All'}
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                    
                    {selectedTasks.size > 0 && (
                        <View style={styles.selectionActions}>
                            <TouchableOpacity
                                style={styles.uncompleteButton}
                                onPress={uncompleteSelectedTasks}
                            >
                                <Ionicons name="refresh" size={18} color={colors.primary} />
                                <CustomText variant="body" color={colors.primary} style={styles.actionButtonText}>
                                    Uncomplete
                                </CustomText>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.deleteSelectedButton}
                                onPress={deleteSelectedTasks}
                            >
                                <Ionicons name="trash" size={18} color={colors.error} />
                                <CustomText variant="body" color={colors.error} style={styles.actionButtonText}>
                                    Delete
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            )}

            {/* Task count and actions */}
            {completedTasks.length > 0 && !isSelectionMode && (
                <View style={styles.taskCountContainer}>
                    <CustomText variant="caption" style={styles.taskCount}>
                        {completedTasks.length} completed task{completedTasks.length !== 1 ? 's' : ''}
                    </CustomText>
                    <View style={styles.taskActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                Alert.alert(
                                    'Mark All as Incomplete',
                                    `Mark all ${completedTasks.length} completed tasks as incomplete?`,
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Mark Incomplete',
                                            onPress: () => {
                                                completedTasks.forEach(task => {
                                                    dispatch(toggleTaskComplete(task.id));
                                                });
                                                
                                                const updatedTasks = allTasks.map(task => 
                                                    task.is_completed
                                                        ? { ...task, is_completed: false, completed_timestamp: null }
                                                        : task
                                                );
                                                storeDataLocalStorage('tasks', updatedTasks);
                                            }
                                        }
                                    ]
                                );
                            }}
                        >
                            <Ionicons name="refresh-outline" size={16} color={colors.primary} />
                            <CustomText variant="caption" color={colors.primary}>
                                Uncomplete All
                            </CustomText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={deleteAllCompletedTasks}
                        >
                            <Ionicons name="trash-outline" size={16} color={colors.error} />
                            <CustomText variant="caption" color={colors.error}>
                                Delete All
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Undo notification */}
            {renderUndoNotification()}

            {/* Task list */}
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
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
            </Animated.View>
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
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        padding: spacing.sm,
        marginRight: spacing.sm,
        borderRadius: borderRadius.md,
    },
    headerTitle: {
        color: colors.textPrimary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: spacing.sm,
        borderRadius: borderRadius.md,
    },
    selectionToolbar: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    selectionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    selectAllButton: {
        padding: spacing.xs,
    },
    selectionActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    uncompleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary + '20',
        flex: 1,
        marginRight: spacing.sm,
        justifyContent: 'center',
    },
    deleteSelectedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.errorLight + '20',
        flex: 1,
        marginLeft: spacing.sm,
        justifyContent: 'center',
    },
    actionButtonText: {
        marginLeft: spacing.xs,
    },
    taskCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
    },
    taskCount: {
        color: colors.textSecondary,
    },
    taskActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        marginLeft: spacing.sm,
    },
    undoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    undoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    undoText: {
        marginLeft: spacing.sm,
        color: colors.textPrimary,
    },
    undoButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary + '20',
    },
    content: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    taskList: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    taskItemSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    checkboxContainer: {
        marginRight: spacing.sm,
        marginTop: spacing.xs,
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
        marginBottom: spacing.xs,
    },
    taskTitleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    completedIconContainer: {
        padding: 2,
        borderRadius: borderRadius.sm,
    },
    completedIcon: {
        marginRight: spacing.sm,
    },
    taskTitle: {
        flex: 1,
        color: colors.textPrimary,
        textDecorationLine: 'line-through',
        opacity: 0.8,
    },
    priorityIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: spacing.sm,
        marginTop: 6,
    },
    taskDescription: {
        color: colors.textSecondary,
        marginLeft: 32,
        marginBottom: spacing.sm,
        opacity: 0.7,
    },
    taskMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 32,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryText: {
        marginLeft: spacing.xs,
        color: colors.textTertiary,
    },
    completionDate: {
        color: colors.textTertiary,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
        color: colors.textPrimary,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptyDescription: {
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    bottomSpacer: {
        height: spacing.xl,
    },
});

export default CompletedTask;