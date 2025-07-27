import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView,
    TextInput,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/store/Task/category';
import { addTask, setTasks, toggleTaskComplete } from '@/store/Task/task';
import { defaultCategories } from '@/constants/GeneralData';
import { colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '@/utils/gnFunc';
import { storeDataLocalStorage, getDataLocalStorage } from '@/utils/storage';

/**
 * Inbox screen component - main task list view
 * Displays tasks in a dark theme design matching the screenshots
 */
const Inbox = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.display_tasks);
    const categories = useSelector((state) => state.category.categories);
    const [showMenu, setShowMenu] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');

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
     * Handle adding a new task
     */
    const handleAddTask = async () => {
        if (!newTaskText.trim()) return;

        const newTask = {
            id: generateId(),
            title: newTaskText.trim(),
            timestamp: new Date().toISOString(),
            description: "",
            category: "other",
            priority: "medium",
            is_completed: false,
            completed_timestamp: null,
            sub_tasks: []
        };

        try {
            dispatch(addTask(newTask));
            const updatedTasks = [...tasks, newTask];
            await storeDataLocalStorage('task_list', updatedTasks);
            setNewTaskText('');
        } catch (error) {
            console.error('Error saving task:', error);
            Alert.alert('Error', 'Failed to save task. Please try again.');
        }
    };

    /**
     * Handle task completion toggle
     */
    const handleToggleComplete = async (taskId) => {
        try {
            dispatch(toggleTaskComplete(taskId));
            // Get updated tasks from Redux state after dispatch
            const updatedTasks = tasks.map(task => 
                task.id === taskId 
                    ? { 
                        ...task, 
                        is_completed: !task.is_completed, 
                        completed_timestamp: !task.is_completed ? new Date().toISOString() : null 
                    }
                    : task
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
    const renderTaskItem = ({ item }) => (
        <TouchableOpacity style={styles.taskItem}>
            <View style={styles.taskContent}>
                <TouchableOpacity 
                    style={styles.checkbox}
                    onPress={() => handleToggleComplete(item.id)}
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
    );

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

            {/* Add Task Input */}
            <View style={styles.addTaskContainer}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                    <Ionicons name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TextInput
                    style={styles.addTaskInput}
                    placeholder="Add a comment"
                    placeholderTextColor={colors.textTertiary}
                    value={newTaskText}
                    onChangeText={setNewTaskText}
                    onSubmitEditing={handleAddTask}
                />
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="attach" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
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
        padding: 5,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    taskItem: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
    },
    taskContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 12,
    },
    checkboxInner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontWeight: '500',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    taskDate: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: colors.textTertiary,
    },
    priorityIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    addTaskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
    },
    addButton: {
        marginRight: 12,
    },
    addTaskInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        paddingVertical: 8,
    },
    attachButton: {
        marginLeft: 12,
    },
});

export default Inbox;