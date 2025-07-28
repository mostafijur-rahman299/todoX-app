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
    Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/store/Task/category';
import { setTasks, toggleTaskComplete } from '@/store/Task/task';
import { defaultCategories } from '@/constants/GeneralData';
import { colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeDataLocalStorage, getDataLocalStorage } from '@/utils/storage';
import AddTaskButton from '@/components/AddTaskButton';
import TaskDetailModal from '@/components/Tasks/TaskDetailModal';

const Inbox = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.display_tasks);
    const categories = useSelector((state) => state.category.categories);
    const [showMenu, setShowMenu] = useState(false);
    const [showPriorityOptions, setShowPriorityOptions] = useState(false);
    const [showInboxOptions, setShowInboxOptions] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    
    // Enhanced animation refs with multiple values
    const prioritySlideAnim = useRef(new Animated.Value(-100)).current;
    const priorityOpacity = useRef(new Animated.Value(0)).current;
    const inboxSlideAnim = useRef(new Animated.Value(-100)).current;
    const inboxOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const initializeCategories = async () => {
            try {
                const storedCategories = await AsyncStorage.getItem('categories');
                
                if (!storedCategories) {
                    const nonExistingCategories = defaultCategories.filter(
                        category => !categories.some(c => c.name === category.name) && category.name !== 'all'
                    );
                    
                    if (nonExistingCategories.length > 0) {
                        await AsyncStorage.setItem('categories', JSON.stringify(nonExistingCategories));
                        dispatch(setCategories(nonExistingCategories));
                    }
                } else {
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

        const loadTasks = async () => {
            try {
                const storedTasks = await getDataLocalStorage('task_list') || [];
                if (storedTasks && storedTasks.length > 0) {
                    dispatch(setTasks(storedTasks));
                }
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        };

        initializeCategories();
        loadTasks();
    }, [dispatch]);

    /**
     * Enhanced priority toggle with smooth animations
     */
    const handlePriorityToggle = () => {
        if (showInboxOptions) {
            handleInboxToggle();
        }

        if (showPriorityOptions) {
            // Close priority dropdown
            Animated.parallel([
                Animated.timing(priorityOpacity, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(prioritySlideAnim, {
                    toValue: -100,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowPriorityOptions(false);
            });
        } else {
            // Open priority dropdown
            setShowPriorityOptions(true);
            Animated.parallel([
                Animated.timing(priorityOpacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(prioritySlideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.back(1.1)),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    /**
     * Enhanced inbox toggle with smooth animations
     */
    const handleInboxToggle = () => {
        if (showPriorityOptions) {
            handlePriorityToggle();
        }

        if (showInboxOptions) {
            // Close inbox dropdown
            Animated.parallel([
                Animated.timing(inboxOpacity, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(inboxSlideAnim, {
                    toValue: -100,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowInboxOptions(false);
            });
        } else {
            // Open inbox dropdown
            setShowInboxOptions(true);
            Animated.parallel([
                Animated.timing(inboxOpacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(inboxSlideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.back(1.1)),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    /**
     * Handle task click to show detail modal
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
     * Handle task completion toggle
     */
    const handleToggleComplete = async (taskId) => {
        try {
            dispatch(toggleTaskComplete(taskId));
            
            const existingTasks = await getDataLocalStorage('task_list') || [];
            const updatedTasks = existingTasks.map(task =>
                task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
            );
            await storeDataLocalStorage('task_list', updatedTasks);
        } catch (error) {
            console.error('Error toggling task completion:', error);
            Alert.alert('Error', 'Failed to update task. Please try again.');
        }
    };

    /**
     * Render individual task item with enhanced animations
     * Fixed: Moved animation logic outside of render function
     */
    const renderTaskItem = useCallback(({ item, index }) => {
        return (
            <TaskItem 
                item={item} 
                index={index} 
                onToggleComplete={handleToggleComplete}
                onTaskPress={handleTaskPress}
                getPriorityColor={getPriorityColor}
            />
        );
    }, []);

    /**
     * Get priority color based on priority level
     */
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return colors.error;
            case 'medium': return colors.warning;
            case 'low': return colors.success;
            default: return colors.textTertiary;
        }
    };

    const incompleteTasks = tasks?.filter(task => !task.is_completed) || [];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Inbox</Text>
                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => setShowMenu(!showMenu)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Task List */}
            <FlatList
                data={incompleteTasks}
                renderItem={renderTaskItem}
                keyExtractor={(item) => item?.id?.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            <AddTaskButton />

            {/* Task Detail Modal */}
            <TaskDetailModal
                visible={showTaskModal}
                onClose={handleCloseTaskModal}
                task={selectedTask}
                onUpdateTask={(updatedTask) => {
                    // Handle task update logic here
                    console.log('Update task:', updatedTask);
                }}
                onDeleteTask={(taskId) => {
                    // Handle task deletion logic here
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    menuButton: {
        padding: 8,
        borderRadius: 8,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
    },
    taskItemContainer: {
        marginBottom: 10,
    },
    taskItem: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 14,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: { 
            width: 0, 
            height: 2 
        },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border + '20',
    },
    taskContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 12,
        padding: 2,
    },
    checkboxInner: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    checkedBox: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        transform: [{ scale: 1.05 }],
    },
    taskDetails: {
        flex: 1,
        paddingRight: 8,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
        lineHeight: 20,
        letterSpacing: -0.1,
    },
    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        gap: 8,
    },
    taskDate: {
        fontSize: 12,
        color: colors.textTertiary,
        fontWeight: '500',
        backgroundColor: colors.background,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        overflow: 'hidden',
    },
    taskTag: {
        backgroundColor: colors.primary + '15',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.primary + '25',
    },
    taskTagText: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: colors.textTertiary,
        opacity: 0.6,
    },
    prioritySection: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 6,
    },
    priorityIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 1,
    },
    priorityLabel: {
        fontSize: 9,
        fontWeight: '600',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    categoryTag: {
        backgroundColor: colors.primary + '15',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    categoryText: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});

/**
 * Enhanced TaskItem component with reduced height and inline tags
 */
const TaskItem = React.memo(({ item, index, onToggleComplete, onTaskPress, getPriorityColor }) => {
    const itemAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    useEffect(() => {
        Animated.timing(itemAnim, {
            toValue: 1,
            duration: 350,
            delay: index * 60,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [itemAnim, index]);

    /**
     * Handle press animation with scale effect
     */
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    /**
     * Get priority label text
     */
    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return 'High';
            case 'medium': return 'Med';
            case 'low': return 'Low';
            default: return '';
        }
    };

    /**
     * Get priority label color
     */
    const getPriorityLabelColor = (priority) => {
        switch (priority) {
            case 'high': return colors.error;
            case 'medium': return colors.warning;
            case 'low': return colors.success;
            default: return colors.textTertiary;
        }
    };

    /**
     * Get task tag based on category or other properties
     */
    const getTaskTag = () => {
        if (item.category && item.category !== 'inbox') {
            return item.category;
        }
        if (item.priority) {
            return item.priority;
        }
        return 'task';
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
                                outputRange: [20, 0],
                            }),
                        },
                        {
                            scale: scaleAnim,
                        },
                    ],
                },
            ]}>
            <TouchableOpacity 
                style={styles.taskItem} 
                activeOpacity={0.9}
                onPress={() => onTaskPress(item)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <View style={styles.taskContent}>
                    <TouchableOpacity 
                        style={styles.checkbox}
                        onPress={() => onToggleComplete(item.id)}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.checkboxInner,
                            item.is_completed && styles.checkedBox
                        ]}>
                            {item.is_completed && (
                                <Ionicons name="checkmark" size={14} color={colors.white} />
                            )}
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.taskDetails}>
                        <Text style={[
                            styles.taskTitle,
                            item.is_completed && styles.completedText
                        ]}>
                            {item.title}
                        </Text>
                        
                        <View style={styles.taskMeta}>
                            <Text style={styles.taskDate}>
                                {new Date(item.timestamp).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: new Date(item.timestamp).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                })}
                            </Text>
                            
                            {/* Tag beside the date */}
                            <View style={styles.taskTag}>
                                <Text style={styles.taskTagText}>
                                    {getTaskTag()}
                                </Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.prioritySection}>
                        <View style={[
                            styles.priorityIndicator,
                            { backgroundColor: getPriorityColor(item.priority) }
                        ]} />
                        {item.priority && (
                            <Text style={[
                                styles.priorityLabel,
                                { color: getPriorityLabelColor(item.priority) }
                            ]}>
                                {getPriorityLabel(item.priority)}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
});

export default Inbox;