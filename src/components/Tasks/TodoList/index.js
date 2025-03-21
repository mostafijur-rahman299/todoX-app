import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, TextInput, StyleSheet, Alert } from 'react-native';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AddTodoModal from '../AddTodoModal';
import Filter from './Filter';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, setTasks } from '@/store/Task/task';
import DetailModal from '../DetailModal';
import { generateId } from '@/utils/gnFunc';
import { priorities, defaultCategories } from '@/constants/GeneralData';
import { storeData, getData } from '@/utils/storage';


const TodoList = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [quickAddText, setQuickAddText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [searchText, setSearchText] = useState('');
    const tasks = useSelector((state) => state.tasks.task_list);
    const [selectedTask, setSelectedTask] = useState(null);
    const dispatch = useDispatch();

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

    // Quick add task handler
    const handleQuickAdd = () => {
        if (!quickAddText.trim()) return;

        const newTask = {
            id: generateId(),
            title: quickAddText,
            timestamp: new Date().toISOString(),
            description: "",
            category: defaultCategories[4].name,
            priority: priorities[0].name,
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

    // Separate completed and incomplete tasks
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

    // Clear completed tasks
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
        <>
            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>Tasks</Text>
                        <Text style={styles.headerSubtitle}>
                            {incompleteTasks.length} remaining{tasks.length > 0 && ` of ${tasks.length}`}
                        </Text>
                    </View>

                    {/* Header Buttons */}
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setIsModalVisible(true)}
                        >
                            <Ionicons name="add" size={18} color="white" />
                            <Text style={styles.addButtonText}>New</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterToggleButton, showFilters && styles.activeFilterToggleButton]}
                            onPress={() => setShowFilters(!showFilters)}
                        >
                            <Ionicons name="filter" size={18} color={showFilters ? 'white' : colors.text} />
                            <Text style={[styles.filterToggleText, showFilters && styles.activeFilterToggleText]}>
                                Filters
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filter Section */}
                {showFilters && (
                    <Filter
                        selectedCategory={selectedCategory}
                        selectedPriority={selectedPriority}
                        setSelectedCategory={setSelectedCategory}
                        setSelectedPriority={setSelectedPriority}
                        setSearchText={setSearchText}
                        searchText={searchText} />
                )}

                {/* Tasks List */}
                <View style={{ flex: 1, marginTop: 10 }}>
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
                                return <Text key={item.id} style={styles.sectionHeader}>{item.title}</Text>;
                            } else if (item.type === 'clear_button') {
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.clearButton}
                                        onPress={handleClearAlert}
                                    >
                                        <Text style={styles.clearButtonText}>Clear</Text>
                                    </TouchableOpacity>
                                );
                            }
                            return <TodoItem
                                key={item.id}
                                quickAddText={quickAddText}
                                setQuickAddText={setQuickAddText}
                                handleQuickAdd={handleQuickAdd}
                                item={item}
                                tasks={tasks}
                                setSelectedTask={setSelectedTask}
                                setIsDetailModalVisible={setIsDetailModalVisible} />;
                        }}
                        keyExtractor={item => item.id?.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.listContent,
                            (!incompleteTasks.length && !completedTasks.length) && { flex: 1, justifyContent: 'center' }
                        ]}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                Hi there! You don't have any tasks yet. Start task and take control of your day.
                            </Text>
                        }
                        extraData={[incompleteTasks, completedTasks, tasks]}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}
                    />
                </View>

                {/* Quick Add Input */}
                <View style={styles.quickAddWrapper}>
                    <View style={styles.quickAddContainer}>
                        <TextInput
                            style={styles.quickAddInput}
                            value={quickAddText}
                            onChangeText={setQuickAddText}
                            placeholder="Quick add task..."
                            placeholderTextColor={colors.darkGray}
                            onSubmitEditing={handleQuickAdd}
                            returnKeyType="done"
                        />
                        <TouchableOpacity
                            style={[
                                styles.quickAddButton,
                                quickAddText.trim() && styles.activeQuickAddButton
                            ]}
                            onPress={handleQuickAdd}
                            disabled={!quickAddText.trim()}
                        >
                            <Ionicons
                                name="add"
                                size={20}
                                color={quickAddText.trim() ? 'white' : colors.darkGray}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Add Task Modal */}
                <AddTodoModal
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                />

                <DetailModal
                    isModalVisible={isDetailModalVisible}
                    setIsModalVisible={setIsDetailModalVisible}
                    selectedTask={selectedTask}
                    tasks={tasks}
                />
            </View>
        </>
    );
};

export default TodoList;

const TodoItem = ({ item, setSelectedTask, setIsDetailModalVisible, tasks }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();
    const animatedHeight = new Animated.Value(isExpanded ? 1 : 0);
    const translateX = new Animated.Value(0);

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
        setIsDetailModalVisible(true);
    };

    return (
        <View style={styles.itemContent}>
            <TouchableOpacity onPress={handleTaskPress}>
                <View style={styles.itemHeader}>
                    <View style={styles.itemHeaderLeft}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => toggleComplete(item, false, null)}
                        >
                            <Ionicons
                                name={item.is_completed ? "checkmark-circle" : "ellipse-outline"}
                                size={26}
                                color={
                                    item.is_completed ? colors.success :
                                        item.priority === "high" ? colors.red :
                                            item.priority === "medium" ? colors.orange :
                                                colors.green
                                }
                            />
                        </TouchableOpacity>
                        <View style={styles.taskDetails}>
                            <Text
                                numberOfLines={1}
                                style={[styles.itemTitle, item.is_completed && styles.completedText]}
                            >
                                {truncateText(item.title)}
                            </Text>
                            {item?.sub_tasks?.length > 0 && (
                                <Text style={styles.subTaskCount}>
                                    {item?.sub_tasks?.filter(task => task.is_completed).length}/{item?.sub_tasks?.length} subtasks
                                </Text>
                            )}
                        </View>
                    </View>
                    {item?.sub_tasks?.length > 0 && (
                        <TouchableOpacity
                            style={styles.expandButton}
                            onPress={toggleExpand}
                        >
                            <Ionicons
                                name={isExpanded ? "chevron-up" : "chevron-down"}
                                size={22}
                                color={colors.darkGray}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles.itemBody,
                    {
                        maxHeight: animatedHeight.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1000]
                        }),
                        opacity: animatedHeight
                    }
                ]}
            >
                {item.sub_tasks && item.sub_tasks.map((subTask) => (
                    <View key={subTask.id} style={styles.subItem}>
                        <View style={styles.subItemHeader}>
                            <TouchableOpacity
                                style={styles.subCheckboxContainer}
                                onPress={() => toggleComplete(item, true, subTask)}
                            >
                                <Ionicons
                                    name={subTask.is_completed ? "checkmark-circle" : "ellipse-outline"}
                                    size={22}
                                    color={
                                        subTask.is_completed ? colors.success :
                                            subTask.priority === "high" ? colors.red :
                                                subTask.priority === "medium" ? colors.orange :
                                                    colors.green
                                    }
                                />
                            </TouchableOpacity>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.subItemText,
                                    subTask.is_completed && styles.completedText
                                ]}
                            >
                                {truncateText(subTask.title)}
                            </Text>
                        </View>
                    </View>
                ))}
            </Animated.View>
        </View>
    );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: colors.background,
    },
    quickAddWrapper: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
    },
    quickAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 5,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },
    quickAddInput: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    quickAddButton: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    activeQuickAddButton: {
        backgroundColor: colors.primary,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: colors.darkGray,
        fontWeight: '500',
        marginTop: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 14,
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 15,
    },
    listContent: {
        paddingBottom: 120,
    },
    item: {
        marginBottom: 2,
        position: 'relative',
    },
    itemContent: {
        zIndex: 1,
        backgroundColor: colors.background,
    },
    itemTitle: {
        fontSize: 17,
        color: colors.text,
        fontWeight: '600',
        marginLeft: 8,
        flex: 1,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemBody: {
        marginTop: 14,
        overflow: 'hidden'
    },
    subItem: {
        marginLeft: 38,
        marginBottom: 12
    },
    subItemText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        marginLeft: 8,
        flex: 1,
    },
    subTaskCount: {
        fontSize: 13,
        color: colors.darkGray,
        marginLeft: 10,
        backgroundColor: colors.background,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: '600',
    },
    addSubTaskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
    },
    addSubTaskButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 38,
        marginTop: 14,
        padding: 14,
        borderRadius: 10,
    },
    addSubTaskText: {
        color: colors.primary,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 13,
        color: colors.darkGray,
        marginTop: 8,
        marginLeft: 38,
        fontWeight: '500',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: colors.darkGray,
        opacity: 0.7,
    },
    emptyText: {
        fontSize: 16,
        color: colors.darkGray,
        textAlign: 'center',
        marginTop: 100,
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    filterToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: colors.background,
        gap: 6,
    },
    activeFilterToggleButton: {
        backgroundColor: colors.primary,
    },
    filterToggleText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    activeFilterToggleText: {
        color: 'white',
    },
    sectionHeader: {
        fontSize: 18,
        color: colors.gray,
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 12,
    },
    clearButton: {
        marginBottom: 12,
        alignSelf: 'flex-end',
    },
    clearButtonText: {
        fontSize: 15,
        color: colors.gray,
        fontWeight: '600',
    }
});
