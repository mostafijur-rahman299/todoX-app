import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Platform, RefreshControl, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddTodoModal from '../AddTodoModal';
import Filter from './Filter';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, setTasks } from '@/store/Task/task';
import UpdateTaskModal from '../UpdateTaskModal';
import { generateId } from '@/utils/gnFunc';
import { priorities, defaultCategories } from '@/constants/GeneralData';
import { storeData, getData } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const TodoList = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [quickAddText, setQuickAddText] = useState('');
    const [quickAddCategory, setQuickAddCategory] = useState(defaultCategories[4].name);
    const [quickAddPriority, setQuickAddPriority] = useState(priorities[0].name);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const dispatch = useDispatch();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const tasks = useSelector((state) => state.tasks.display_tasks);

    // Load tasks from storage
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

            // Provide haptic feedback if available
            if (Platform.OS === 'ios' && window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'hapticFeedback', style: 'light' }));
            }
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
        Alert.alert('Clear All Tasks', 'Are you sure you want to clear all completed tasks?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', onPress: handleClearCompleted },
        ]);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate a refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    // Memoize the render item function to improve performance
    const renderItem = useCallback(({ item }) => {
        if (item.type === 'header') {
            return (
                <View style={styles.sectionHeader} key={item.id}>
                    <View style={styles.sectionHeaderLeft}>
                        <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                        <Text style={styles.sectionHeaderText}>{item.title}</Text>
                    </View>
                    {completedTasks.length > 0 && (
                        <TouchableOpacity style={styles.clearButton} onPress={handleClearAlert}>
                            <Ionicons name="trash-outline" size={16} color="#475569" />
                            <Text style={styles.clearButtonText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            );
        }
        return (
            <TodoItem
                key={item.id}
                item={item}
                setSelectedTask={setSelectedTask}
                setIsUpdateModalVisible={setIsUpdateModalVisible}
                tasks={tasks}
            />
        );
    }, [completedTasks.length]);

    // Memoize the keyExtractor function to improve performance
    const keyExtractor = useCallback((item) => item.id?.toString(), []);

    const handleOutsidePress = () => {
        if (isInputFocused) {
            Keyboard.dismiss();
            setIsInputFocused(false);
        }
        if (showCategoryTooltip) {
            setShowCategoryTooltip(false);
        }
    };

    // Prepare data for FlatList with getItemLayout for better performance
    const listData = [
        ...incompleteTasks,
        ...(completedTasks.length > 0 ? [
            { id: 'completed_header', type: 'header', title: 'Completed Tasks' },
            ...completedTasks.map(task => ({...task, id: `completed-${task.id}`}))
        ] : [])
    ];

    // Optimize FlatList with getItemLayout
    const getItemLayout = useCallback((data, index) => ({
        length: 80, // Approximate height of each item
        offset: 80 * index,
        index,
    }), []);

    return (
        <>
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.mainContainer}>
                    <LinearGradient
                        colors={['#f8fafc', '#ffffff']}
                        style={styles.gradientContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.contentContainer}>
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
                                        style={[styles.actionButton, styles.activeActionButton]}
                                        onPress={() => setShowFilterModal(true)}
                                    >
                                        <Ionicons
                                            name='options'
                                            size={24}
                                            color='#ffffff'
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

                            <View style={styles.listContainer}>
                                {tasks.length === 0 ? (
                                    <View style={styles.emptyState}>
                                        <LottieView
                                            source={require('@/assets/animations/empty-tasks.json')}
                                            autoPlay
                                            loop
                                            style={styles.emptyStateAnimation}
                                        />
                                        <Text style={styles.emptyStateTitle}>No tasks yet</Text>
                                        <Text style={styles.emptyStateText}>
                                            Add your first task using the quick add bar below or the + button
                                        </Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                                tintColor="#6366f1"
                                                colors={['#6366f1']}
                                                progressViewOffset={20}
                                            />
                                        }
                                        data={listData}
                                        renderItem={renderItem}
                                        keyExtractor={keyExtractor}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                        getItemLayout={getItemLayout}
                                        removeClippedSubviews={Platform.OS === 'android'}
                                        initialNumToRender={10}
                                        maxToRenderPerBatch={5}
                                        windowSize={3}
                                        keyboardDismissMode="on-drag"
                                        keyboardShouldPersistTaps="handled"
                                    />
                                )}
                            </View>
                        </View>

                        <View style={styles.quickAddContainer}>
                            <View style={styles.quickAddGradient}>
                                <View style={styles.quickAddInputContainer}>
                                    <View style={[
                                        styles.quickAddInputWrapper,
                                        isInputFocused && styles.quickAddInputWrapperFocused
                                    ]}>
                                        <Ionicons name="add-circle-outline" size={18} color="#6366f1" style={styles.quickAddIcon} />
                                        <TextInput
                                            style={styles.quickAddInput}
                                            placeholder="Add a new task..."
                                            placeholderTextColor="#94a3b8"
                                            value={quickAddText}
                                            onChangeText={setQuickAddText}
                                            onSubmitEditing={handleQuickAdd}
                                            onFocus={() => {
                                                setIsInputFocused(true);
                                            }}
                                            onBlur={() => {
                                                setIsInputFocused(false);
                                            }}
                                            returnKeyType="done"
                                            multiline
                                            numberOfLines={2}
                                        />
                                    </View>

                                    <View style={styles.quickAddActions}>
                                        <View style={styles.actionButtonsContainer}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.quickAddOption,
                                                    showCategoryTooltip && styles.quickAddOptionActive
                                                ]}
                                                onPress={() => setShowCategoryTooltip(!showCategoryTooltip)}
                                            >
                                                <Ionicons name="bookmark" size={14} color="#6366f1" />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.quickAddOption,
                                                    {
                                                        backgroundColor: quickAddPriority === "high" ? '#fef2f2' :
                                                            quickAddPriority === "medium" ? '#fff7ed' : '#f0fdf4'
                                                    }
                                                ]}
                                                onPress={() => {
                                                    const nextIndex = priorities.findIndex(p => p.name === quickAddPriority);
                                                    setQuickAddPriority(priorities[(nextIndex + 1) % priorities.length].name);
                                                }}
                                            >
                                                <Ionicons
                                                    name="flag"
                                                    size={14}
                                                    color={
                                                        quickAddPriority === "high" ? '#ef4444' :
                                                            quickAddPriority === "medium" ? '#f97316' : '#22c55e'
                                                    }
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.quickAddButton,
                                                    !!quickAddText && styles.activeQuickAddButton
                                                ]}
                                                onPress={handleQuickAdd}
                                                disabled={!quickAddText}
                                            >
                                                <Ionicons
                                                    name="arrow-up"
                                                    size={18}
                                                    color={!!quickAddText ? '#ffffff' : '#94a3b8'}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        {showCategoryTooltip && (
                                            <View style={styles.categoryTooltip}>
                                                {defaultCategories.map((category) => (
                                                    <TouchableOpacity
                                                        key={category.name}
                                                        style={[
                                                            styles.categoryTooltipItem,
                                                            category.name === quickAddCategory && styles.categoryTooltipItemActive
                                                        ]}
                                                        onPress={() => {
                                                            setQuickAddCategory(category.name);
                                                            setShowCategoryTooltip(false);
                                                        }}
                                                    >
                                                        <Ionicons
                                                            name="bookmark"
                                                            size={14}
                                                            color={category.name === quickAddCategory ? '#6366f1' : '#64748b'}
                                                        />
                                                        <Text style={[
                                                            styles.categoryTooltipText,
                                                            category.name === quickAddCategory && styles.categoryTooltipTextActive
                                                        ]}>
                                                            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
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
                </View>
            </TouchableWithoutFeedback>


            <Filter
                openModal={showFilterModal}
                closeModal={() => setShowFilterModal(false)}
            />

        </>
    );
};

export default memo(TodoList);

const TodoItem = memo(({ item, setSelectedTask, setIsUpdateModalVisible, tasks }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();

    const toggleExpand = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

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
                        <View
                            style={[
                                styles.checkboxInner,
                                item.is_completed && styles.checkedBox
                            ]}
                        >
                            {item.is_completed && (
                                <Ionicons name="checkmark" size={12} color="#ffffff" />
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.taskTitleContainer}>
                        <Text style={[styles.taskTitle, item.is_completed && styles.completedText]}>
                            {truncateText(item.title)}
                        </Text>
                        <View style={styles.taskTags}>
                            <View style={styles.categoryTag}>
                                <Ionicons name="bookmark-outline" size={9} color="#64748b" />
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
                                size={14}
                                color="#64748b"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {isExpanded && (
                    <View style={styles.subTasksContainer}>
                        {item.sub_tasks?.map(subTask => (
                            <View key={subTask.id} style={styles.subTaskItem}>
                                <TouchableOpacity
                                    style={styles.subTaskCheckbox}
                                    onPress={() => toggleComplete(item, true, subTask)}
                                >
                                    <View style={[styles.checkboxInner, subTask.is_completed && styles.checkedBox]}>
                                        {subTask.is_completed && (
                                            <Ionicons name="checkmark" size={10} color="#ffffff" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <Text style={[styles.subTaskText, subTask.is_completed && styles.completedText]}>
                                    {subTask.title}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    gradientContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerContainer: {
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
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
    filterContainer: {
        marginTop: 16,
        marginBottom: 8,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    listContainer: {
        flex: 1,
        marginTop: 8,
    },
    quickAddContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    quickAddGradient: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    quickAddInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    quickAddInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    quickAddInputWrapperFocused: {
        borderColor: '#6366f1',
        shadowColor: '#6366f1',
        shadowOpacity: 0.1,
    },
    quickAddIcon: {
        marginRight: 6,
    },
    quickAddInput: {
        flex: 1,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '500',
        height: '100%',
        paddingVertical: 12,
    },
    quickAddActions: {
        position: 'relative',
        zIndex: 999,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
        zIndex: 998,
    },
    quickAddOption: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    quickAddOptionActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#6366f1',
    },
    categoryTooltip: {
        position: 'absolute',
        bottom: 48,
        right: 82,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 8,
        width: 160,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 999,
    },
    categoryTooltipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 8,
        borderRadius: 8,
    },
    categoryTooltipItemActive: {
        backgroundColor: '#eff6ff',
    },
    categoryTooltipText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    categoryTooltipTextActive: {
        color: '#6366f1',
        fontWeight: '600',
    },
    quickAddButton: {
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    activeQuickAddButton: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
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
        width: 3,
        borderRadius: 2,
        marginRight: 8,
    },
    taskContent: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxInner: {
        width: 24,
        height: 24,
        borderRadius: 8,
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
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 2,
    },
    taskTags: {
        flexDirection: 'row',
        gap: 6,
    },
    categoryTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 4,
    },
    categoryTagText: {
        fontSize: 10,
        color: '#64748b',
        fontWeight: '500',
    },
    subTasksContainer: {
        marginTop: 6,
        marginLeft: 26,
    },
    subTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    subTaskCheckbox: {
        marginRight: 6,
    },
    subTaskText: {
        fontSize: 12,
        color: '#475569',
        flex: 1,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingLeft: 6,
    },
    subTaskCountContainer: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 8,
    },
    subTaskCount: {
        fontSize: 10,
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
    emptyStateAnimation: {
        width: 200,
        height: 200,
        marginBottom: 20,
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
    listContent: {
        paddingBottom: Platform.OS === 'ios' ? 90 : 80,
    },
});
