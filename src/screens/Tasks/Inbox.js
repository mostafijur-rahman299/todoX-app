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
    Dimensions,
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Inbox screen component - main task list view with enhanced animations
 * Displays tasks in a dark theme design with smooth transitions
 */
const Inbox = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.display_tasks);
    const categories = useSelector((state) => state.category.categories);
    const [showMenu, setShowMenu] = useState(false);
    const [showPriorityOptions, setShowPriorityOptions] = useState(false);
    const [showInboxOptions, setShowInboxOptions] = useState(false);
    
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 100,
    },
    taskItemContainer: {
        marginBottom: 12,
    },
    taskItem: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    taskContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 12,
        padding: 4,
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
    },
    checkedBox: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    taskDetails: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    taskDate: {
        fontSize: 12,
        color: colors.textTertiary,
        fontWeight: '500',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: colors.textTertiary,
    },
    priorityIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 8,
    },
});

/**
 * Separate TaskItem component to handle individual task animations
 * This fixes the hook call issue by moving animations to component level
 */
const TaskItem = React.memo(({ item, index, onToggleComplete, getPriorityColor }) => {
    const itemAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.timing(itemAnim, {
            toValue: 1,
            duration: 300,
            delay: index * 50,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [itemAnim, index]);

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
                    ],
                },
            ]}>
            <TouchableOpacity style={styles.taskItem} activeOpacity={0.8}>
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
                        <Text style={styles.taskDate}>
                            {new Date(item.timestamp).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                            })}
                        </Text>
                    </View>
                    
                    <View style={[
                        styles.priorityIndicator,
                        { backgroundColor: getPriorityColor(item.priority) }
                    ]} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
});

export default Inbox;