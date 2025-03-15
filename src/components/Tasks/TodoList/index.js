import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AddTodoModal from '../AddTodoModal';
import Filter from './Filter';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCompleteTask } from '@/store/Task/task';
import DetailModal from '../DetailModal';

const TodoList = () => {
    // State management
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [quickAddText, setQuickAddText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [searchText, setSearchText] = useState('');
    const tasks = useSelector((state) => state.tasks.task_list);
    const [selectedTask, setSelectedTask] = useState(null);

    // Quick add task handler
    const handleQuickAdd = () => {
        if (!quickAddText.trim()) return;

        // setTasks(prevTasks => [...prevTasks, newTask]);
        // setQuickAddText('');
    };

    // Separate completed and incomplete tasks
    const incompleteTasks = tasks.filter(task => !task.is_completed).sort((a, b) => {
        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];

        return a.timestamp - b.timestamp;
    });
    const completedTasks = tasks.filter(task => task.is_completed).sort((a, b) => {
        return a.completed_timestamp - b.completed_timestamp;
    });

    // Clear completed tasks
    const handleClearCompleted = () => {
        // Add clear completed logic here
    };

    return (
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
            <FlatList
                data={[
                    ...incompleteTasks,
                    // Clear completed button and header
                    { id: 'completed_header', type: 'header', title: 'Completed Tasks' },
                    { id: 'clear_button', type: 'clear_button' },
                    ...completedTasks,
                ]}
                renderItem={({ item }) => {
                    if (item.type === 'header') {
                        if(completedTasks.length > 0) {
                            return (
                                <Text style={styles.sectionHeader}>{item.title}</Text>
                            );
                        }
                        return null;
                    } else if (item.type === 'clear_button') {
                        if(completedTasks.length > 0) {
                            return (
                                <TouchableOpacity 
                                style={styles.clearButton}
                                onPress={handleClearCompleted}
                            >
                                <Text style={styles.clearButtonText}>Clear</Text>
                            </TouchableOpacity>
                            );
                        }
                        return null;
                    }
                    return <TodoItem item={item} setSelectedTask={setSelectedTask} setIsDetailModalVisible={setIsDetailModalVisible} />;
                }}
                keyExtractor={item => item.id?.toString()}
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

        <DetailModal
            isModalVisible={isDetailModalVisible}
            setIsModalVisible={setIsDetailModalVisible}
            task={selectedTask}
         />
        </View>
    );
};

export default TodoList;

const TodoItem = ({ item, setSelectedTask, setIsDetailModalVisible }) => {
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

    const toggleComplete = (item, isSubTask = false, subItem=null) => {
        dispatch(toggleCompleteTask({ parentId: item.id, isSubTask: isSubTask, subTaskId: subItem?.id }));
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

    const handleTaskPress = () => {
        setSelectedTask(item);
        setIsDetailModalVisible(true);
    };

    return (
        <>
            <View style={[
                styles.item,
                item.is_completed && { opacity: 0.7, backgroundColor: '#fafafa' }
        ]}>
            <TouchableOpacity>
                <View style={styles.itemHeader}>
                    <View style={styles.itemHeaderLeft}>
                        <TouchableOpacity onPress={() => toggleComplete(item, false, null)}>
                            <Ionicons
                                name={item.is_completed ? "checkmark-circle" : "radio-button-off"}
                                size={24}
                                color={
                                    item.is_completed ? colors.primary :
                                        item.priority === "high" ? colors.red :
                                            item.priority === "medium" ? colors.orange :
                                                colors.green
                                }
                            />
                        </TouchableOpacity>
                        <Text
                            numberOfLines={1}
                            style={[styles.itemTitle, item.is_completed && styles.completedText]}
                            onPress={handleTaskPress}
                        >
                            {truncateText(item.title)}
                        </Text>
                        {item?.sub_tasks?.length > 0 && (
                            <Text style={styles.subTaskCount}>
                                {item?.sub_tasks?.filter(task => task.is_completed).length}/{item?.sub_tasks?.length}
                            </Text>
                        )}
                    </View>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={colors.darkGray}
                        onPress={toggleExpand}
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
                                <TouchableOpacity onPress={() => toggleComplete(item, true, subTask)}>
                                    <Ionicons
                                        name={subTask.is_completed ? "checkmark-circle" : "radio-button-off"}
                                        size={20}
                                        color={
                                            subTask.is_completed ? colors.primary :
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
                        <Text style={styles.dateText}>{formatDate(subTask.timestamp)}</Text>
                    </View>
                ))}

                <View style={styles.addSubTaskContainer}>
                    <TouchableOpacity style={styles.addSubTaskButton}>
                        <Ionicons name="trash-outline" size={20} color={colors.red} />
                        <Text style={styles.addSubTaskText}>Delete Task</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addSubTaskButton}>
                        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                        <Text style={styles.addSubTaskText}>Add Subtask</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
         </View>

         
        </>
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
        bottom: 20,
        left: 20,
        right: 20,
    },
    quickAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 6,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    quickAddInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    quickAddButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    activeQuickAddButton: {
        backgroundColor: colors.primary,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 8,
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
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        color: colors.darkGray,
        fontWeight: '500',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
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
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#fff",
        marginBottom: 14,
        borderRadius: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    itemTitle: {
        fontSize: 17,
        color: colors.text,
        fontWeight: '600',
        marginLeft: 14,
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
        marginTop: 8,
    },
    subItemText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        marginLeft: 14,
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
        color: colors.text,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 12,
    },
    clearButton: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: colors.background,
        marginTop: 12,
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    clearButtonText: {
        fontSize: 15,
        color: colors.primary,
        fontWeight: '600',
    },
});
