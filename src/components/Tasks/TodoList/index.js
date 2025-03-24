import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, TextInput, StyleSheet, Alert, Platform } from 'react-native';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AddTodoModal from '../AddTodoModal';
import Filter from './Filter';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, setTasks } from '@/store/Task/task';
import UpdateTaskModal from '../UpdateTaskModal';
import { generateId } from '@/utils/gnFunc';
import { priorities, defaultCategories } from '@/constants/GeneralData';
import { storeData, getData } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';

const TodoList = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [quickAddText, setQuickAddText] = useState('');
    const [quickAddCategory, setQuickAddCategory] = useState(defaultCategories[4].name);
    const [quickAddPriority, setQuickAddPriority] = useState(priorities[0].name);
    const [showFilters, setShowFilters] = useState(false);
    const [showQuickAddOptions, setShowQuickAddOptions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [searchText, setSearchText] = useState('');
    const tasks = useSelector((state) => state.tasks.task_list);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const storedTasks = await getData('task_list') || [];
                if (storedTasks) {
                    dispatch(setTasks(storedTasks));
                }
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        };
        loadTasks();
    }, [dispatch]);

    const handleQuickAdd = () => {
        if (!quickAddText.trim()) return;

        const newTask = {
            id: generateId(),
            title: quickAddText,
            timestamp: new Date().toISOString(),
            description: "",
            category: quickAddCategory,
            priority: quickAddPriority,
            is_completed: false,
            completed_timestamp: null,
            sub_tasks: []
        };

        try {
            dispatch(addTask(newTask));
            const updatedTasks = [...tasks, newTask];
            storeData('task_list', updatedTasks);
            setQuickAddText('');
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const incompleteTasks = tasks
        ?.filter(task => !task.is_completed)
        .sort((a, b) => {
            const priorityOrder = {
                high: 1,
                medium: 2,
                low: 3,
            };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
    const completedTasks = tasks?.filter(task => task.is_completed).sort((a, b) => {
        return new Date(b.completed_timestamp) - new Date(a.completed_timestamp);
    });

    const handleClearCompleted = () => {
        const updatedTasks = tasks?.filter(task => !task.is_completed);
        dispatch(setTasks(updatedTasks));
        storeData('task_list', updatedTasks);
    };

    const handleClearAlert = () => {
        Alert.alert('Clear All Tasks', 'Are you sure you want to clear all tasks?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', onPress: handleClearCompleted },
        ]);
    };

    return (
        <LinearGradient
            colors={['#f8fafc', '#ffffff']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.headerTitle}>Task Manager</Text>
                    <View style={styles.taskCounterContainer}>
                        <View style={styles.taskCountBadge}>
                            <Ionicons name="rocket-outline" size={16} color="#6366f1" />
                            <Text style={styles.taskCounter}>
                                {incompleteTasks.length} pending
                            </Text>
                        </View>
                        <View style={[styles.taskCountBadge, styles.completedBadge]}>
                            <Ionicons name="checkmark-circle-outline" size={16} color="#22c55e" />
                            <Text style={[styles.taskCounter, styles.completedCounter]}>
                                {completedTasks.length} done
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, showFilters && styles.activeActionButton]}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Ionicons
                            name={showFilters ? 'options' : 'options-outline'}
                            size={24}
                            color={showFilters ? '#ffffff' : '#6366f1'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.addButton]}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>

            {showFilters && (
                <View style={styles.filterContainer}>
                    <Filter
                        selectedCategory={selectedCategory}
                        selectedPriority={selectedPriority}
                        setSelectedCategory={setSelectedCategory}
                        setSelectedPriority={setSelectedPriority}
                        setSearchText={setSearchText}
                        searchText={searchText}
                    />
                </View>
            )}



            <View style={styles.listContainer}>
                <FlatList
                    data={[
                        ...incompleteTasks,
                        ...(completedTasks.length > 0 ? [
                            { id: 'completed_header', type: 'header', title: 'Completed Tasks' },
                            { id: 'clear_button', type: 'clear_button' },
                            ...completedTasks,
                        ] : [])
                    ]}
                    renderItem={({ item }) => {
                        if (item.type === 'header') {
                            return (
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionHeaderLeft}>
                                        <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                                        <Text style={styles.sectionHeaderText}>{item.title}</Text>
                                    </View>
                                    {item.title === 'Completed Tasks' && (
                                        <TouchableOpacity
                                            style={styles.clearButton}
                                            onPress={handleClearAlert}
                                        >
                                            <Ionicons name="trash-outline" size={16} color="#475569" />
                                            <Text style={styles.clearButtonText}>Clear All</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        } else if (item.type === 'clear_button') return null;

                        return (
                            <TodoItem
                                key={item.id}
                                item={item}
                                tasks={tasks}
                                setSelectedTask={setSelectedTask}
                                setIsUpdateModalVisible={setIsUpdateModalVisible}
                            />
                        );
                    }}
                    keyExtractor={item => item.id?.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={styles.emptyStateIcon}>
                                <Ionicons name="rocket-outline" size={60} color="#6366f1" />
                            </View>
                            <Text style={styles.emptyStateTitle}>No Tasks Yet!</Text>
                            <Text style={styles.emptyStateText}>
                                Start adding tasks to boost your productivity
                            </Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <View style={[styles.quickAddContainer, {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                marginHorizontal: 20,
            }]}>
                <View style={styles.quickAddInputContainer}>
                    <TextInput
                        style={styles.quickAddInput}
                        placeholder="Add a new task..."
                        placeholderTextColor="#94a3b8"
                        value={quickAddText}
                        onChangeText={setQuickAddText}
                        onSubmitEditing={handleQuickAdd}
                        returnKeyType="done"
                    />
                    
                    <View style={styles.quickAddActions}>
                        <TouchableOpacity
                            style={styles.quickAddOption}
                            onPress={() => {
                                const nextIndex = defaultCategories.findIndex(c => c.name === quickAddCategory);
                                setQuickAddCategory(defaultCategories[(nextIndex + 1) % defaultCategories.length].name);
                            }}
                        >
                            <Ionicons name="bookmark-outline" size={18} color="#6366f1" />
                            <Text style={styles.quickAddOptionText}>{quickAddCategory?.charAt(0).toUpperCase() + quickAddCategory?.slice(1)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.quickAddOption, {
                                backgroundColor: quickAddPriority === "high" ? '#fee2e2' :
                                    quickAddPriority === "medium" ? '#ffedd5' : '#dcfce7'
                            }]}
                            onPress={() => {
                                const nextIndex = priorities.findIndex(p => p.name === quickAddPriority);
                                setQuickAddPriority(priorities[(nextIndex + 1) % priorities.length].name);
                            }}
                        >
                            <Ionicons name="flag-outline" size={18} color={
                                quickAddPriority === "high" ? '#ef4444' :
                                    quickAddPriority === "medium" ? '#f97316' : '#22c55e'
                            } />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.quickAddButton, !!quickAddText && styles.activeQuickAddButton]}
                            onPress={handleQuickAdd}
                            disabled={!quickAddText}
                        >
                            <Ionicons
                                name="add"
                                size={24}
                                color={!!quickAddText ? '#ffffff' : '#94a3b8'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <AddTodoModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
            />

            <UpdateTaskModal
                isModalVisible={isUpdateModalVisible}
                setIsModalVisible={setIsUpdateModalVisible}
                selectedTask={selectedTask}
                tasks={tasks}
            />
        </LinearGradient>
    );
};

export default TodoList;

const TodoItem = ({ item, setSelectedTask, setIsUpdateModalVisible, tasks }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();
    const animatedHeight = new Animated.Value(isExpanded ? 1 : 0);

    const toggleExpand = () => {
        const newValue = !isExpanded;
        setIsExpanded(newValue);
        Animated.spring(animatedHeight, {
            toValue: newValue ? 1 : 0,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    };

    const toggleComplete = (item, isSubTask = false, subItem = null) => {
        const updatedTasks = tasks?.map(task => {
            if (task.id === item.id) {
                if (isSubTask === true) {
                    return {
                        ...task,
                        sub_tasks: task.sub_tasks.map(subTask => {
                            if (subTask.id === subItem.id) {
                                return {
                                    ...subTask,
                                    is_completed: !subTask.is_completed,
                                    completed_timestamp: new Date().toISOString()
                                };
                            }
                            return subTask;
                        })
                    };
                } else {
                    return {
                        ...task,
                        is_completed: !task.is_completed,
                        completed_timestamp: new Date().toISOString()
                    };
                }
            }
            return task;
        });

        dispatch(setTasks(updatedTasks));
        storeData('task_list', updatedTasks);
    }

    const truncateText = (text, maxLength = 40) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleTaskPress = () => {
        setSelectedTask(item);
        setIsUpdateModalVisible(true);
    };

    return (
        <TouchableOpacity
            style={[styles.taskItem, item.is_completed && styles.completedTask]}
            onPress={handleTaskPress}
            activeOpacity={0.7}
        >
            <View style={[styles.priorityIndicator, {
                backgroundColor: item.priority === "high" ? '#ef4444' :
                    item.priority === "medium" ? '#f97316' : '#22c55e'
            }]} />

            <View style={styles.taskContent}>
                <View style={styles.taskHeader}>
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => toggleComplete(item, false, null)}
                    >
                        <View style={[styles.checkboxInner, item.is_completed && styles.checkedBox]}>
                            {item.is_completed && (
                                <Ionicons name="checkmark" size={16} color="#ffffff" />
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.taskTitleContainer}>
                        <Text style={[styles.taskTitle, item.is_completed && styles.completedText]}>
                            {truncateText(item.title)}
                        </Text>
                        <View style={styles.taskTags}>
                            <View style={styles.categoryTag}>
                                <Ionicons name="bookmark-outline" size={12} color="#64748b" />
                                <Text style={styles.categoryTagText}>{item.category}</Text>
                            </View>
                        </View>
                    </View>

                    {item?.sub_tasks?.length > 0 && (
                        <TouchableOpacity
                            style={styles.expandButton}
                            onPress={toggleExpand}
                        >
                            <View style={styles.subTaskCountContainer}>
                                <Text style={styles.subTaskCount}>
                                    {item.sub_tasks.filter(t => t.is_completed).length}/{item.sub_tasks.length}
                                </Text>
                            </View>
                            <Ionicons
                                name={isExpanded ? "chevron-up" : "chevron-down"}
                                size={18}
                                color="#64748b"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <Animated.View style={[
                    styles.subTasksContainer,
                    {
                        maxHeight: animatedHeight.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1000]
                        }),
                        opacity: animatedHeight
                    }
                ]}>
                    {item.sub_tasks?.map(subTask => (
                        <View key={subTask.id} style={styles.subTaskItem}>
                            <TouchableOpacity
                                style={styles.subTaskCheckbox}
                                onPress={() => toggleComplete(item, true, subTask)}
                            >
                                <View style={[styles.checkboxInner, subTask.is_completed && styles.checkedBox]}>
                                    {subTask.is_completed && (
                                        <Ionicons name="checkmark" size={14} color="#ffffff" />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <Text style={[styles.subTaskText, subTask.is_completed && styles.completedText]}>
                                {subTask.title}
                            </Text>
                        </View>
                    ))}
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    taskCounterContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    taskCountBadge: {
        backgroundColor: '#6366f110',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    completedBadge: {
        backgroundColor: '#22c55e10',
    },
    taskCounter: {
        fontSize: 14,
        color: '#6366f1',
        fontWeight: '600',
    },
    completedCounter: {
        color: '#22c55e',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionButton: {
        backgroundColor: '#f1f5f9',
        padding: 12,
        borderRadius: 12,
    },
    addButton: {
        backgroundColor: '#6366f1',
    },
    activeActionButton: {
        backgroundColor: '#6366f1',
    },
    quickAddContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    quickAddInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quickAddInput: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        height: 44,
        paddingHorizontal: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
    },
    quickAddActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quickAddOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
    },
    quickAddOptionText: {
        fontSize: 12,
        color: '#6366f1',
        fontWeight: '600',
    },
    quickAddButton: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeQuickAddButton: {
        backgroundColor: '#6366f1',
    },
    listContainer: {
        flex: 1,
        marginTop: 5
    },
    taskItem: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 12,
        padding: 16,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    completedTask: {
        backgroundColor: '#f8fafc',
    },
    priorityIndicator: {
        width: 4,
        borderRadius: 2,
        marginRight: 12,
    },
    taskContent: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        marginRight: 12,
    },
    checkboxInner: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedBox: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    },
    taskTitleContainer: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
    },
    taskTags: {
        flexDirection: 'row',
        gap: 8,
    },
    categoryTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoryTagText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    subTasksContainer: {
        marginTop: 12,
        marginLeft: 36,
    },
    subTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    subTaskCheckbox: {
        marginRight: 10,
    },
    subTaskText: {
        fontSize: 14,
        color: '#475569',
        flex: 1,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 12,
    },
    subTaskCountContainer: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    subTaskCount: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderColor: '#f1f5f9',
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#475569',
    },
    clearButton: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    clearButtonText: {
        color: '#475569',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateIcon: {
        backgroundColor: '#6366f110',
        padding: 24,
        borderRadius: 30,
        marginBottom: 24,
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 40,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#94a3b8',
    },
});
