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
     FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import CustomText from '@/components/UI/CustomText';
import { colors, spacing, borderRadius, shadows } from '@/constants/Colors';
import { storeDataLocalStorage, getDataLocalStorage } from '@/utils/storage';
import useTasks, { STORAGE_KEYS } from '../../hooks/useTasks';

/**
 * CompletedTask component - displays completed tasks with compact and modern design
 * Features: Simplified UI, quick actions, minimal selection mode
 */
const CompletedTask = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { clearAllCompletedTasks, bulkDeleteCompletedTasks, restoreTask: restoreTaskAction } = useTasks();
    
    // Component state
    const [refreshing, setRefreshing] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [completedTasks, setCompletedTasks] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState(new Set());

    /**
     * Load completed tasks from storage
     */
    useEffect(() => {
        const loadTasks = async () => {
            const tasks = await getDataLocalStorage(STORAGE_KEYS.COMPLETED_TASKS);
            setCompletedTasks(tasks || []);
        };
        loadTasks();
    }, []);

    /**
     * Simple fade-in animation
     */
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    /**
     * Handle refresh functionality
     */
    const onRefresh = async () => {
        setRefreshing(true);
        const tasks = await getDataLocalStorage(STORAGE_KEYS.COMPLETED_TASKS);
        setCompletedTasks(tasks || []);
        setRefreshing(false);
    };

    /**
     * Toggle task back to incomplete
     */
    const restoreTask = (task) => {
        setCompletedTasks(prev => prev.filter(t => t.id !== task.id));
        restoreTaskAction(task);
    };

    /**
     * Toggle selection mode
     */
    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedTasks(new Set());
    };

    /**
     * Toggle task selection
     */
    const toggleTaskSelection = (taskId) => {
        const newSelected = new Set(selectedTasks);
        if (newSelected.has(taskId)) {
            newSelected.delete(taskId);
        } else {
            newSelected.add(taskId);
        }
        setSelectedTasks(newSelected);
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
     * Delete selected tasks
     */
    const deleteSelectedTasks = () => {
        if (selectedTasks.size === 0) return;
        
        Alert.alert(
            'Delete Tasks',
            `Are you sure you want to delete ${selectedTasks.size} task(s)?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        selectedTasks.forEach(taskId => {
                            bulkDeleteCompletedTasks([taskId]);
                        });
                        setSelectedTasks(new Set());
                        setIsSelectionMode(false);
                        setCompletedTasks(completedTasks.filter(task => !selectedTasks.has(task.id)));
                    },
                },
            ]
        );
    };

    /**
     * Clear all completed tasks
     */
    const clearAllTasks = () => {
        Alert.alert(
            'Clear All Tasks',
            'Are you sure you want to delete all completed tasks?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => {
                        clearAllCompletedTasks();
                        setCompletedTasks([]);
                    },
                },
            ]
        );
    };

    /**
     * Delete a single task
     */
    const deleteTask = (taskId) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        bulkDeleteCompletedTasks([taskId]);
                        setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
                    },
                },
            ]
        );
    };

    /**
     * Format completion date in a compact way
     */
    const formatCompletionDate = (timestamp) => {
        if (!timestamp) return 'Today';
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.ceil((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    /**
     * Render compact task item
     */
    const renderTaskItem = ({ item: task }) => {
        const isSelected = selectedTasks.has(task.id);
        
        return (
            <Animated.View style={[
                styles.taskItem, 
                { opacity: fadeAnim },
                isSelected && styles.taskItemSelected
            ]}>
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => {
                        if (isSelectionMode) {
                            toggleTaskSelection(task.id);
                        } else {
                            restoreTask(task.id);
                        }
                    }}
                >
                    {isSelectionMode ? (
                        <View style={[styles.selectionCheckbox, isSelected && styles.selectionCheckboxSelected]}>
                            {isSelected && <Ionicons name="checkmark" size={16} color={colors.white} />}
                        </View>
                    ) : (
                        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.taskContent}
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
                >
                    <CustomText 
                        variant="body" 
                        weight="medium" 
                        style={styles.taskTitle}
                        numberOfLines={1}
                    >
                        {task.title}
                    </CustomText>
                    
                    <View style={styles.taskMeta}>
                        <CustomText variant="caption" style={styles.completionDate}>
                            {formatCompletionDate(task.completed_timestamp)}
                        </CustomText>
                        {task.category && (
                            <>
                                <View style={styles.metaDivider} />
                                <CustomText variant="caption" style={styles.categoryText}>
                                    {task.category}
                                </CustomText>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
                
                {!isSelectionMode && (
                    <View style={styles.itemButtonContainer}>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteTask(task.id)}
                        >
                            <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => restoreTask(task)}
                        >
                            <Ionicons name="refresh" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                    </View>
                )}
            </Animated.View>
        );
    };

    /**
     * Render simple empty state
     */
    const renderEmptyState = () => (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color={colors.primary} />
            <CustomText variant="h4" weight="semibold" style={styles.emptyTitle}>
                No Completed Tasks
            </CustomText>
            <CustomText variant="body" style={styles.emptyDescription}>
                Completed tasks will appear here
            </CustomText>
            <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => onRefresh()}
            >
                <Ionicons name="refresh" size={24} color={colors.white} />
                <CustomText variant="body" weight="medium" style={styles.refreshButtonText}>    
                    Refresh
                </CustomText>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with selection controls */}
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        if (isSelectionMode) {
                            setIsSelectionMode(false);
                            setSelectedTasks(new Set());
                        } else {
                            navigation.goBack();
                        }
                    }}
                >
                    <Ionicons 
                        name={isSelectionMode ? "close" : "arrow-back"} 
                        size={24} 
                        color={colors.textPrimary} 
                    />
                </TouchableOpacity>
                
                <View style={styles.headerCenter}>
                    <CustomText variant="h4" weight="bold" style={styles.headerTitle}>
                        {isSelectionMode ? `${selectedTasks.size} Selected` : 'Completed'}
                    </CustomText>
                </View>
                
                <View style={styles.headerRight}>
                    {isSelectionMode ? (
                        <View style={styles.selectionActions}>
                            <TouchableOpacity
                                style={styles.headerActionButton}
                                onPress={selectAllTasks}
                            >
                                <Ionicons 
                                    name={selectedTasks.size === completedTasks.length ? "checkbox" : "checkbox-outline"} 
                                    size={20} 
                                    color={colors.primary} 
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.headerActionButton, { marginLeft: spacing.sm }]}
                                onPress={deleteSelectedTasks}
                                disabled={selectedTasks.size === 0}
                            >
                                <Ionicons 
                                    name="trash-outline" 
                                    size={20} 
                                    color={selectedTasks.size > 0 ? colors.error : colors.textTertiary} 
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={styles.headerActionButton}
                                onPress={toggleSelectionMode}
                            >
                                <Ionicons name="checkmark-circle-outline" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.headerActionButton, { marginLeft: spacing.sm }]}
                                onPress={clearAllTasks}
                                disabled={completedTasks.length === 0}
                            >
                                <Ionicons 
                                    name="trash-outline" 
                                    size={20} 
                                    color={completedTasks.length > 0 ? colors.error : colors.textTertiary} 
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Animated.View>

            {/* Task list */}
            <View style={styles.content}>
                {completedTasks.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        data={completedTasks}
                        renderItem={renderTaskItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={colors.primary}
                                colors={[colors.primary]}
                            />
                        }
                    />
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
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        color: colors.textPrimary,
        marginBottom: 2,
    },
    headerRight: {
        minWidth: 80,
        alignItems: 'flex-end',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectionActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerActionButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskCount: {
        color: colors.textSecondary,
        fontSize: 11,
    },
    content: {
        flex: 1,
    },
    listContainer: {
        padding: spacing.md,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: colors.primary + '08',
    },
    checkboxContainer: {
        marginRight: spacing.md,
    },
    selectionCheckbox: {
        width: 24,
        height: 24,
        borderRadius: borderRadius.sm,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    selectionCheckboxSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
        opacity: 0.7,
        marginBottom: 2,
    },
    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completionDate: {
        color: colors.textTertiary,
        fontSize: 11,
    },
    metaDivider: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.textTertiary,
        marginHorizontal: spacing.xs,
        opacity: 0.5,
    },
    categoryText: {
        color: colors.textTertiary,
        fontSize: 11,
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.sm,
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
        fontSize: 14,
    },
    itemButtonContainer: {
        flexDirection: 'row',
    },
    itemButton: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.sm,
    },
    itemButtonText: {
        color: colors.textPrimary,
        fontSize: 14,
    },
    itemButtonDelete: {
        color: colors.error,
    },
    itemButtonRestore: {
        color: colors.success,
    },
    refreshButton: {
        flexDirection: 'row',
        marginVertical: spacing.md,
    },
    refreshButtonText: {
        color: colors.textPrimary,
        fontSize: 14,
        marginLeft: spacing.xs,
    },
});

export default CompletedTask;