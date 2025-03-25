import React, { useState, useEffect, memo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { priorities, defaultCategories } from '@/constants/GeneralData';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '@/store/Task/task';
import { storeData } from '@/utils/storage';
import { generateId } from '@/utils/gnFunc';

const UpdateTaskModal = memo(({ isModalVisible, setIsModalVisible, selectedTask }) => {
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState(null);
    const [newSubTask, setNewSubTask] = useState('');
    const [newTask, setNewTask] = useState({
        title: "",
        timestamp: new Date(),
        description: "",
        category: defaultCategories[4]?.name || 'other',
        priority: priorities[0]?.name || 'low',
        is_completed: false,
        completed_timestamp: null,
        sub_tasks: []
    });
    const tasks = useSelector(state => state.tasks.task_list);

    useEffect(() => {
        if (isModalVisible && selectedTask) {
            setNewTask({
                ...selectedTask,
                timestamp: new Date(selectedTask.timestamp),
                category: selectedTask.category || defaultCategories[4]?.name || 'other',
                priority: selectedTask.priority || priorities[0]?.name || 'low',
                sub_tasks: selectedTask.sub_tasks || []
            });
        }
    }, [selectedTask, isModalVisible]);

    const handleSetNewTask = (key, value) => {
        if (!key || value === undefined) return;
        setNewTask(prev => ({ ...prev, [key]: value }));
    };

    const handleAddSubTask = () => {
        if (!newSubTask?.trim()) return;

        const subTask = {
            id: generateId(),
            title: newSubTask.trim(),
            is_completed: false,
            completed_timestamp: null
        };

        setNewTask(prev => ({
            ...prev,
            sub_tasks: [...(prev.sub_tasks || []), subTask]
        }));
        setNewSubTask('');
    };

    const handleDeleteSubTask = (subTaskId) => {
        if (!subTaskId) return;
        setNewTask(prev => ({
            ...prev,
            sub_tasks: prev.sub_tasks.filter(task => task.id !== subTaskId)
        }));
    };

    const handleUpdateSubTask = (subTaskId, newTitle) => {
        if (!subTaskId || !newTitle?.trim()) return;
        setNewTask(prev => ({
            ...prev,
            sub_tasks: prev.sub_tasks.map(task => 
                task.id === subTaskId ? { ...task, title: newTitle.trim() } : task
            )
        }));
    };

    const handleToggleSubTask = (subTaskId) => {
        if (!subTaskId) return;
        setNewTask(prev => {
            if (!prev?.sub_tasks?.length) return prev;
            
            return {
                ...prev,
                sub_tasks: prev.sub_tasks.map(task => {
                    if (task.id === subTaskId) {
                        const isCompleted = !task.is_completed;
                        return {
                            ...task,
                            is_completed: isCompleted,
                            completed_timestamp: isCompleted ? new Date().toISOString() : null
                        };
                    }
                    return task;
                })
            };
        });
    };

    const handleDeleteTask = () => {
        if (!newTask?.id) return;
        const updatedTasks = tasks.filter(task => task.id !== newTask.id);
        storeData('task_list', updatedTasks);
        dispatch(setTasks(updatedTasks));
        setIsModalVisible(false);
    };

    const handleAddTask = () => {
        if (!newTask?.title?.trim()) return;

        const data = {
            ...newTask,
            title: newTask.title.trim(),
            description: newTask.description?.trim() || "",
            timestamp: newTask.timestamp.toISOString()
        };

        const updatedTasks = tasks.map(task => task.id === newTask.id ? data : task);
        storeData('task_list', updatedTasks);
        dispatch(setTasks(updatedTasks));
        
        setIsModalVisible(false);
        setNewTask({
            title: "",
            timestamp: new Date(),
            description: "",
            category: defaultCategories[4]?.name || 'other',
            priority: priorities[0]?.name || 'low',
            is_completed: false,
            completed_timestamp: null,
            sub_tasks: []
        });
    };

    const formatDate = (date) => {
        try {
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid Date';
        }
    };

    const handleDateTimeChange = (event, selectedDate) => {
        if (!selectedDate) {
            setPickerMode(null);
            setShowDatePicker(false);
            return;
        }

        if (Platform.OS === 'android') {
            if (pickerMode === 'date') {
                const currentTime = new Date(newTask.timestamp);
                const updatedTimestamp = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    currentTime.getHours(),
                    currentTime.getMinutes()
                );
                handleSetNewTask('timestamp', updatedTimestamp);
                setPickerMode('time');
            } else if (pickerMode === 'time') {
                const currentDate = new Date(newTask.timestamp);
                const updatedTimestamp = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    selectedDate.getHours(),
                    selectedDate.getMinutes()
                );
                handleSetNewTask('timestamp', updatedTimestamp);
                setPickerMode(null);
                setShowDatePicker(false);
            }
        } else {
            handleSetNewTask('timestamp', selectedDate);
            setShowDatePicker(false);
        }
    };

    const openPicker = () => {
        if (Platform.OS === 'android') {
            setPickerMode('date');
        }
        setShowDatePicker(true);
    };

    if (!selectedTask) return null;

    return (
        <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            statusBarTranslucent
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHandle} />
                    <View style={styles.headerContainer}>
                        <Text style={styles.modalTitle}>Update Task</Text>
                        <View style={styles.headerButtons}>
                            <TouchableOpacity
                                onPress={handleDeleteTask}
                                style={styles.headerButton}
                                accessibilityLabel="Delete task"
                            >
                                <Ionicons name="trash-outline" size={24} color={colors.red} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                style={styles.headerButton}
                            >
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled={true}
                    >
                        <View style={styles.inputContainer}>
                            <Ionicons name="pencil-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.titleInput}
                                value={newTask.title}
                                onChangeText={(text) => handleSetNewTask('title', text)}
                                placeholder="Task title"
                                placeholderTextColor={colors.darkGray}
                                maxLength={100}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="document-text-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.descriptionInput}
                                value={newTask.description}
                                onChangeText={(text) => handleSetNewTask('description', text)}
                                placeholder="Description (optional)"
                                placeholderTextColor={colors.darkGray}
                                multiline
                                numberOfLines={4}
                                maxLength={500}
                            />
                        </View>

                        <Text style={styles.sectionTitle}>Priority</Text>
                        <View style={styles.priorityContainer}>
                            {priorities.map((priority) => (
                                <TouchableOpacity
                                    key={priority.name}
                                    style={[
                                        styles.priorityButton,
                                        newTask.priority === priority.name && { backgroundColor: priority.color }
                                    ]}
                                    onPress={() => handleSetNewTask('priority', priority.name)}
                                    accessibilityLabel={`Set priority to ${priority.name}`}
                                >
                                    <Ionicons 
                                        name={newTask.priority === priority.name ? "flag" : "flag-outline"}
                                        size={20} 
                                        color={newTask.priority === priority.name ? '#fff' : priority.color} 
                                    />
                                    <Text style={[
                                        styles.priorityText,
                                        newTask.priority === priority.name && { color: '#fff' }
                                    ]}>
                                        {priority.name?.charAt(0).toUpperCase() + priority.name?.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.sectionTitle}>Category</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryScrollView}
                        >
                            <View style={styles.categoryContainer}>
                                {defaultCategories.map((category) => (
                                    <TouchableOpacity
                                        key={category.name}
                                        style={[
                                            styles.categoryButton,
                                            newTask.category === category.name && styles.selectedCategory,
                                        ]}
                                        onPress={() => handleSetNewTask('category', category.name)}
                                        accessibilityLabel={`Set category to ${category.name}`}
                                    >
                                        <Ionicons 
                                            name={category.icon} 
                                            size={20} 
                                            color={newTask.category === category.name ? '#fff' : colors.text} 
                                        />
                                        <Ionicons 
                                            name="bookmark-outline" 
                                            size={20} 
                                            color={newTask.category === category.name ? '#fff' : colors.text}
                                            style={styles.categoryBookmark} 
                                        />
                                        <Text style={[
                                            styles.categoryText,
                                            newTask.category === category.name && styles.selectedCategoryText
                                        ]}>
                                            {category.name?.charAt(0).toUpperCase() + category.name?.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <Text style={styles.sectionTitle}>Due Date</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={openPicker}
                            accessibilityLabel="Select due date"
                        >
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                            <Text style={styles.dateButtonText}>
                                {formatDate(newTask.timestamp)}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={colors.darkGray} />
                        </TouchableOpacity>
                        
                        {showDatePicker && (
                            <DateTimePicker
                                value={newTask.timestamp}
                                mode={Platform.OS === 'android' ? pickerMode : 'datetime'}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateTimeChange}
                                minimumDate={new Date()}
                            />
                        )}

                        <Text style={styles.sectionTitle}>Subtasks</Text>
                        <View style={styles.subTaskContainer}>
                            <View style={styles.subTaskInputContainer}>
                                <TextInput
                                    style={styles.subTaskInput}
                                    value={newSubTask}
                                    onChangeText={setNewSubTask}
                                    placeholder="Add a subtask"
                                    placeholderTextColor={colors.darkGray}
                                    onSubmitEditing={handleAddSubTask}
                                    maxLength={100}
                                />
                                <TouchableOpacity
                                    style={[styles.addSubTaskButton, !newSubTask.trim() && styles.disabledButton]}
                                    onPress={handleAddSubTask}
                                    disabled={!newSubTask.trim()}
                                    accessibilityLabel="Add subtask"
                                >
                                    <Ionicons name="add-circle" size={24} color={newSubTask.trim() ? colors.primary : colors.darkGray} />
                                </TouchableOpacity>
                            </View>

                            {newTask.sub_tasks?.map((subTask) => (
                                <View key={subTask.id} style={styles.subTaskItem}>
                                    <TouchableOpacity
                                        style={styles.checkboxContainer}
                                        onPress={() => handleToggleSubTask(subTask.id)}
                                    >
                                        <Ionicons 
                                            name={subTask.is_completed ? "checkmark-circle" : "ellipse-outline"} 
                                            size={24} 
                                            color={subTask.is_completed ? colors.primary : colors.darkGray} 
                                        />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[
                                            styles.subTaskEditInput,
                                            subTask.is_completed && styles.completedSubTask
                                        ]}
                                        value={subTask.title}
                                        onChangeText={(text) => handleUpdateSubTask(subTask.id, text)}
                                        maxLength={100}
                                    />
                                    <TouchableOpacity
                                        style={styles.deleteSubTaskButton}
                                        onPress={() => handleDeleteSubTask(subTask.id)}
                                        accessibilityLabel="Delete subtask"
                                    >
                                        <Ionicons name="close-circle" size={24} color={colors.red} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.createButton, !newTask?.title?.trim() && styles.disabledButton]}
                            onPress={handleAddTask}
                            disabled={!newTask?.title?.trim()}
                            accessibilityLabel="Update task"
                        >
                            <Text style={styles.createButtonText}>Update Task</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
});

export default UpdateTaskModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(17, 25, 40, 0.6)',
        justifyContent: 'flex-end',
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#F8FAFF',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        padding: 24,
        maxHeight: '88%',
    },
    modalHandle: {
        width: 45,
        height: 5,
        backgroundColor: '#E2E8F0',
        borderRadius: 6,
        alignSelf: 'center',
        marginBottom: 24,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
        marginLeft: 8,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    inputIcon: {
        marginHorizontal: 10,
    },
    titleInput: {
        flex: 1,
        fontSize: 16,
        padding: 8,
        color: '#1E293B',
        fontWeight: '500',
    },
    descriptionInput: {
        flex: 1,
        fontSize: 15,
        padding: 8,
        height: 90,
        textAlignVertical: 'top',
        color: '#1E293B',
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#3B4D6B',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    priorityContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        justifyContent: 'space-between',
        gap: 8,
    },
    priorityButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    priorityText: {
        color: '#3B4D6B',
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 14,
    },
    categoryScrollView: {
        marginBottom: 20,
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingVertical: 6,
        gap: 10,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryBookmark: {
        marginLeft: 6,
    },
    selectedCategory: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    categoryText: {
        color: '#3B4D6B',
        fontSize: 14,
        marginLeft: 8,
        fontWeight: '600',
    },
    selectedCategoryText: {
        color: '#FFFFFF',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dateButtonText: {
        flex: 1,
        marginLeft: 10,
        color: '#1E293B',
        fontSize: 14,
        fontWeight: '500',
    },
    subTaskContainer: {
        marginBottom: 20,
    },
    subTaskInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    subTaskInput: {
        flex: 1,
        fontSize: 14,
        padding: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        color: '#1E293B',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        fontWeight: '500',
    },
    addSubTaskButton: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    subTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    checkboxContainer: {
        marginRight: 12,
    },
    subTaskEditInput: {
        flex: 1,
        fontSize: 14,
        padding: 6,
        color: '#1E293B',
        fontWeight: '500',
    },
    completedSubTask: {
        textDecorationLine: 'line-through',
        color: '#94A3B8',
    },
    deleteSubTaskButton: {
        padding: 6,
        backgroundColor: '#FEF2F2',
        borderRadius: 10,
    },
    createButton: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 10,
    },
    disabledButton: {
        opacity: 0.6,
        backgroundColor: '#818CF8',
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
        letterSpacing: 0.5,
    },
});
