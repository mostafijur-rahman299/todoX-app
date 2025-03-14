import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AddTodoModal from '../AddTodoModal';
import Filter from './Filter';
import { useSelector, useDispatch } from 'react-redux';
import { completeTask, sortTasks } from '@/store/Task/task';


const TodoList = () => {
    // State management
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [quickAddText, setQuickAddText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [searchText, setSearchText] = useState('');
    const tasks = useSelector((state) => state.tasks.task);

    // Quick add task handler
    const handleQuickAdd = () => {
        if (!quickAddText.trim()) return;

        const newTask = {
            id: Date.now(),
            title: quickAddText,
            timestamp: new Date(),
            description: '',
            category: 'other',
            priority: 'medium',
            is_completed: false
        };

        // setTasks(prevTasks => [...prevTasks, newTask]);
        // setQuickAddText('');
    };

    // Task filtering logic
    const filteredTasks = tasks.filter(task => {
        const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
        const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
        const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesPriority && matchesSearch;
    });

    // Task sorting logic 
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        // Sort by completion status first
        if (a.is_completed !== b.is_completed) {
            return a.is_completed ? 1 : -1;
        }

        // Then by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (a.priority !== b.priority) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        // Finally by timestamp
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Tasks</Text>
                    <Text style={styles.headerSubtitle}>
                        {tasks.filter(t => !t.is_completed).length} remaining{tasks.length > 0 && ` of ${tasks.length}`}
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
            <FlatList
                data={sortedTasks}
                renderItem={({ item }) => <TodoItem item={item} />}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Hi there! You don't have any tasks yet. Start task and take control of your day.
                    </Text>
                }
                style={{ marginTop: 10 }}
            />

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
                // tasks={tasks}
                // setTasks={setTasks}
            />
        </View>
    );
};

export default TodoList;

const TodoItem = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCompleted, setIsCompleted] = useState(item.is_completed);
    const [subTasksCompleted, setSubTasksCompleted] = useState(
        item.sub_tasks?.map(task => task.is_completed) || []
    );
    const dispatch = useDispatch();
    const animatedHeight = new Animated.Value(isExpanded ? 1 : 0);
    const subTaskCount = item.sub_tasks?.length || 0;

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

    const toggleComplete = (item, isSubTask = false, subTaskId = null) => {
        if (item.is_completed) {
            // dispatch(completeTask({ id: item.id, isSubTask: false }));
        } else {
            dispatch(completeTask({ parentId: item.id, isSubTask: isSubTask, subTaskId: subTaskId }));
            dispatch(sortTasks());
        }
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    const truncateText = (text, maxLength = 40) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <View style={[
            styles.item,
            isCompleted && { opacity: 0.7, backgroundColor: '#fafafa' }
        ]}>
            <TouchableOpacity onPress={toggleExpand}>
                <View style={styles.itemHeader}>
                    <View style={styles.itemHeaderLeft}>
                        <TouchableOpacity onPress={() => toggleComplete(item, false, null)}>
                            <Ionicons
                                name={isCompleted ? "checkmark-circle" : "radio-button-off"}
                                size={24}
                                color={
                                    isCompleted ? colors.primary :
                                        item.priority === "high" ? colors.red :
                                            item.priority === "medium" ? colors.orange :
                                                colors.green
                                }
                            />
                        </TouchableOpacity>
                        <Text
                            numberOfLines={1}
                            style={[styles.itemTitle, isCompleted && styles.completedText]}
                        >
                            {truncateText(item.title)}
                        </Text>
                        {subTaskCount > 0 && (
                            <Text style={styles.subTaskCount}>
                                {subTasksCompleted.filter(Boolean).length}/{subTaskCount}
                            </Text>
                        )}
                    </View>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={colors.darkGray}
                    />
                </View>
            </TouchableOpacity>

            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>

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
                {item.sub_tasks && item.sub_tasks.map((subTask, index) => (
                    <View key={subTask.id} style={styles.subItem}>
                        <View style={styles.itemHeader}>
                            <View style={styles.itemHeaderLeft}>
                                <TouchableOpacity onPress={() => toggleComplete(item, true, subTask.id)}>
                                    <Ionicons
                                        name={subTasksCompleted[index] ? "checkmark-circle" : "radio-button-off"}
                                        size={20}
                                        color={
                                            subTasksCompleted[index] ? colors.primary :
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
                                        subTasksCompleted[index] && styles.completedText
                                    ]}
                                >
                                    {truncateText(subTask.title)}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.dateText}>{formatDate(subTask.timestamp)}</Text>
                    </View>
                ))}
                <TouchableOpacity style={styles.addSubTaskButton}>
                    <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                    <Text style={styles.addSubTaskText}>Add Subtask</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: colors.lightGray,
    },
    quickAddWrapper: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
    },
    quickAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    quickAddInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 15,
        color: colors.text,
        fontWeight: '400',
    },
    quickAddButton: {
        padding: 8,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    activeQuickAddButton: {
        backgroundColor: colors.primary,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingVertical: 4,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.darkGray,
        fontWeight: '500',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 4,
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 100,
    },
    item: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "#fff",
        marginBottom: 12,
        borderRadius: 5,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemTitle: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
        marginLeft: 12,
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
        marginTop: 12,
        overflow: 'hidden'
    },
    subItem: {
        marginLeft: 36,
        marginTop: 10,
        padding: 14,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    subItemText: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
        marginLeft: 12,
        flex: 1,
    },
    subTaskCount: {
        fontSize: 12,
        color: colors.darkGray,
        marginLeft: 8,
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        fontWeight: '600',
    },
    addSubTaskButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 36,
        marginTop: 12,
        padding: 12,
        backgroundColor: colors.background,
        borderRadius: 12,
    },
    addSubTaskText: {
        color: colors.primary,
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 12,
        color: colors.darkGray,
        marginTop: 6,
        marginLeft: 36,
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
    },
    filterToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: colors.lightGray,
        marginRight: 8,
        gap: 4,
    },
    activeFilterToggleButton: {
        backgroundColor: colors.primary,
    },
    filterToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    activeFilterToggleText: {
        color: 'white',
    },
});


