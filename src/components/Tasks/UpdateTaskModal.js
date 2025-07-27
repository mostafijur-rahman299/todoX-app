import React, { useState, useEffect, memo } from 'react';
import { Modal, View, Text, TextInput, 
    TouchableOpacity, ScrollView, StyleSheet, Platform, 
    KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Animated, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { priorities, defaultCategories } from '@/constants/GeneralData';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask } from '@/store/Task/task';
import { storeDataLocalStorage } from '@/utils/storage';
import { generateId } from '@/utils/gnFunc';

const UpdateTaskModal = memo(({ isModalVisible, setIsModalVisible, selectedTask }) => {
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState(null);
    const [newSubTask, setNewSubTask] = useState('');
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        timestamp: new Date(),
        description: "",
        category: "other",
        priority: priorities[0]?.name || 'low',
        is_completed: false,
        completed_timestamp: null,
        sub_tasks: [],
        labels: [],
        location: "",
        reminders: [],
        hasDeadline: false,
        hasLocation: false
    });
    const tasks = useSelector(state => state.task.task_list);
    const categories = useSelector(state => state.category.categories);

    // Available labels for tasks
    const availableLabels = [
        { id: 1, name: 'Important', color: '#FF6B6B', icon: 'star' },
        { id: 2, name: 'Urgent', color: '#FF8E53', icon: 'flash' },
        { id: 3, name: 'Work', color: '#4ECDC4', icon: 'briefcase' },
        { id: 4, name: 'Personal', color: '#45B7D1', icon: 'person' },
        { id: 5, name: 'Health', color: '#96CEB4', icon: 'fitness' },
        { id: 6, name: 'Learning', color: '#FFEAA7', icon: 'school' }
    ];

    // Quick action buttons data
    const quickActions = [
        { 
            id: 'today', 
            label: 'Today', 
            icon: 'today', 
            color: '#22C55E',
            action: () => handleSetNewTask('timestamp', new Date())
        },
        { 
            id: 'priority', 
            label: 'Priority', 
            icon: 'flag', 
            color: '#EF4444',
            action: () => handleSetNewTask('priority', 'high')
        },
        { 
            id: 'reminders', 
            label: 'Reminders', 
            icon: 'notifications', 
            color: '#8B5CF6',
            action: () => setShowMoreOptions(true)
        }
    ];

    useEffect(() => {
        if (isModalVisible && selectedTask) {
            setNewTask({
                ...selectedTask,
                timestamp: new Date(selectedTask.timestamp),
                category: selectedTask.category || "other",
                priority: selectedTask.priority || priorities[0]?.name || 'low',
                sub_tasks: selectedTask.sub_tasks || [],
                labels: selectedTask.labels || [],
                location: selectedTask.location || "",
                reminders: selectedTask.reminders || [],
                hasDeadline: selectedTask.hasDeadline || false,
                hasLocation: selectedTask.hasLocation || false
            });
        }
    }, [selectedTask, isModalVisible]);

    const handleSetNewTask = (key, value) => {
        if (!key || value === undefined) return;
        setNewTask(prev => ({ ...prev, [key]: value }));
    };

    /**
     * Handle adding/removing labels from task
     */
    const handleToggleLabel = (label) => {
        setNewTask(prev => {
            const isSelected = prev.labels.some(l => l.id === label.id);
            if (isSelected) {
                return {
                    ...prev,
                    labels: prev.labels.filter(l => l.id !== label.id)
                };
            } else {
                return {
                    ...prev,
                    labels: [...prev.labels, label]
                };
            }
        });
    };

    /**
     * Handle enabling/disabling deadline feature
     */
    const handleToggleDeadline = () => {
        setNewTask(prev => ({
            ...prev,
            hasDeadline: !prev.hasDeadline
        }));
    };

    /**
     * Handle enabling/disabling location feature
     */
    const handleToggleLocation = () => {
        setNewTask(prev => ({
            ...prev,
            hasLocation: !prev.hasLocation
        }));
    };

    /**
     * Show more options menu
     */
    const handleMoreOptions = () => {
        setShowMoreOptions(true);
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

    /**
     * Handle task update with proper Redux action
     */
    const handleAddTask = () => {
        if (!newTask?.title?.trim()) return;
    
        const data = {
            ...newTask,
            title: newTask.title.trim(),
            description: newTask.description?.trim() || "",
            timestamp: newTask.timestamp.toISOString()
        };
    
        // Use Redux action for updating task
        dispatch(updateTask(data));
        
        // Update local storage
        const updatedTasks = tasks.map(task => task.id === newTask.id ? data : task);
        storeDataLocalStorage('task_list', updatedTasks);
        
        setIsModalVisible(false);
    };
    
    /**
     * Handle task deletion with proper Redux action
     */
    const handleDeleteTask = () => {
        if (!newTask?.id) return;
        
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => {
                        // Use Redux action for deleting task
                        dispatch(deleteTask(newTask.id));
                        
                        // Update local storage
                        const updatedTasks = tasks.filter(task => task.id !== newTask.id);
                        storeDataLocalStorage('task_list', updatedTasks);
                        
                        setIsModalVisible(false);
                    }
                }
            ]
        );
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

    return (
        <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    style={styles.container}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHandle} />
                            
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Task</Text>
                                <View style={styles.headerActions}>
                                    <TouchableOpacity 
                                        style={styles.deleteButton}
                                        onPress={handleDeleteTask}
                                        accessibilityLabel="Delete task"
                                    >
                                        <Ionicons name="trash-outline" size={20} color={colors.red} />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => setIsModalVisible(false)}
                                        style={styles.closeButton}
                                    >
                                        <Ionicons name="close" size={22} color="#1E293B" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={styles.scrollContent}
                            >
                                {/* Task Title Input */}
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

                                {/* Task Description Input */}
                                <View style={styles.inputContainer}>
                                    <Ionicons name="document-text-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.descriptionInput}
                                        value={newTask.description}
                                        onChangeText={(text) => handleSetNewTask('description', text)}
                                        placeholder="Description (optional)"
                                        placeholderTextColor={colors.darkGray}
                                        multiline
                                        maxLength={500}
                                        textAlignVertical="top"
                                    />
                                </View>

                                {/* Quick Action Buttons */}
                                <View style={styles.quickActionsContainer}>
                                    {quickActions.map((action) => (
                                        <TouchableOpacity
                                            key={action.id}
                                            style={[styles.quickActionButton, { borderColor: action.color }]}
                                            onPress={action.action}
                                        >
                                            <Ionicons name={action.icon} size={16} color={action.color} />
                                            <Text style={[styles.quickActionText, { color: action.color }]}>
                                                {action.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                    <TouchableOpacity
                                        style={styles.moreOptionsButton}
                                        onPress={handleMoreOptions}
                                    >
                                        <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>

                                {/* Priority Selection */}
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

                                {/* Category Selection */}
                                <Text style={styles.sectionTitle}>Category</Text>
                                <ScrollView 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.categoryScrollView}
                                >
                                    <View style={styles.categoryContainer}>
                                        {categories.map((category) => (
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
                                                    name={category.icon || "bookmark-outline"} 
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

                                {/* Labels Section */}
                                <Text style={styles.sectionTitle}>
                                    <Ionicons name="pricetag-outline" size={16} color="#3B4D6B" /> Labels
                                </Text>
                                <View style={styles.labelsContainer}>
                                    {availableLabels.map((label) => {
                                        const isSelected = newTask.labels.some(l => l.id === label.id);
                                        return (
                                            <TouchableOpacity
                                                key={label.id}
                                                style={[
                                                    styles.labelButton,
                                                    isSelected && { backgroundColor: label.color }
                                                ]}
                                                onPress={() => handleToggleLabel(label)}
                                            >
                                                <Ionicons 
                                                    name={label.icon} 
                                                    size={14} 
                                                    color={isSelected ? '#fff' : label.color} 
                                                />
                                                <Text style={[
                                                    styles.labelText,
                                                    isSelected && { color: '#fff' }
                                                ]}>{label.name}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {/* Due Date */}
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

                                {/* Advanced Features */}
                                <View style={styles.advancedFeaturesContainer}>
                                    {/* Deadline Feature */}
                                    <TouchableOpacity
                                        style={styles.featureButton}
                                        onPress={handleToggleDeadline}
                                    >
                                        <View style={styles.featureLeft}>
                                            <Ionicons name="alarm-outline" size={20} color="#6B7280" />
                                            <Text style={styles.featureText}>Deadline</Text>
                                            <View style={styles.proBadge}>
                                                <Text style={styles.proText}>PRO</Text>
                                            </View>
                                        </View>
                                        <Ionicons 
                                            name={newTask.hasDeadline ? "toggle" : "toggle-outline"} 
                                            size={24} 
                                            color={newTask.hasDeadline ? "#22C55E" : "#D1D5DB"} 
                                        />
                                    </TouchableOpacity>

                                    {/* Location Feature */}
                                    <TouchableOpacity
                                        style={styles.featureButton}
                                        onPress={handleToggleLocation}
                                    >
                                        <View style={styles.featureLeft}>
                                            <Ionicons name="location-outline" size={20} color="#6B7280" />
                                            <Text style={styles.featureText}>Location</Text>
                                            <View style={styles.proBadge}>
                                                <Text style={styles.proText}>PRO</Text>
                                            </View>
                                        </View>
                                        <Ionicons 
                                            name={newTask.hasLocation ? "toggle" : "toggle-outline"} 
                                            size={24} 
                                            color={newTask.hasLocation ? "#22C55E" : "#D1D5DB"} 
                                        />
                                    </TouchableOpacity>

                                    {/* Edit Task Actions */}
                                    <TouchableOpacity
                                        style={styles.featureButton}
                                        onPress={() => Alert.alert('Edit Task Actions', 'This feature allows you to set custom actions for your tasks.')}
                                    >
                                        <View style={styles.featureLeft}>
                                            <Ionicons name="create-outline" size={20} color="#6B7280" />
                                            <Text style={styles.featureText}>Edit task actions</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                                    </TouchableOpacity>
                                </View>

                                {/* Location Input (if enabled) */}
                                {newTask.hasLocation && (
                                    <View style={styles.locationInputContainer}>
                                        <Ionicons name="location" size={18} color="#4F46E5" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.locationInput}
                                            value={newTask.location}
                                            onChangeText={(text) => handleSetNewTask('location', text)}
                                            placeholder="Enter location"
                                            placeholderTextColor="#94A3B8"
                                        />
                                    </View>
                                )}

                                {/* Sub-tasks Section */}
                                <Text style={styles.sectionTitle}>Sub-tasks</Text>
                                <View style={styles.subTaskContainer}>
                                    {newTask.sub_tasks?.map((subTask) => (
                                        <View key={subTask.id} style={styles.subTaskItem}>
                                            <TouchableOpacity
                                                style={styles.subTaskCheckbox}
                                                onPress={() => handleToggleSubTask(subTask.id)}
                                                accessibilityLabel={`Toggle subtask ${subTask.title}`}
                                            >
                                                <Ionicons 
                                                    name={subTask.is_completed ? "checkmark-circle" : "ellipse-outline"} 
                                                    size={24} 
                                                    color={subTask.is_completed ? colors.primary : colors.darkGray} 
                                                />
                                            </TouchableOpacity>
                                            <TextInput
                                                style={[
                                                    styles.subTaskText,
                                                    subTask.is_completed && styles.completedSubTaskText
                                                ]}
                                                value={subTask.title}
                                                onChangeText={(text) => handleUpdateSubTask(subTask.id, text)}
                                                placeholder="Sub-task"
                                                placeholderTextColor={colors.darkGray}
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

                                    <View style={styles.subTaskInputContainer}>
                                        <TextInput
                                            style={styles.subTaskInput}
                                            value={newSubTask}
                                            onChangeText={setNewSubTask}
                                            placeholder="Add a sub-task..."
                                            placeholderTextColor={colors.darkGray}
                                            onSubmitEditing={handleAddSubTask}
                                        />
                                        <TouchableOpacity
                                            style={styles.addSubTaskButton}
                                            onPress={handleAddSubTask}
                                            disabled={!newSubTask.trim()}
                                            accessibilityLabel="Add subtask"
                                        >
                                            <Ionicons name="add" size={24} color={newSubTask.trim() ? colors.primary : colors.darkGray} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={newTask.timestamp}
                                        mode={Platform.OS === 'android' ? pickerMode : 'datetime'}
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleDateTimeChange}
                                        minimumDate={new Date()}
                                    />
                                )}

                                <TouchableOpacity
                                    style={[styles.createButton, !newTask?.title?.trim() && styles.disabledButton]}
                                    onPress={handleAddTask}
                                    disabled={!newTask?.title?.trim()}
                                    accessibilityLabel="Update task"
                                >
                                    <Text style={styles.createButtonText}>Update Task</Text>
                                    <Ionicons name="checkmark" size={18} color="#fff" />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
});

export default UpdateTaskModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(17, 25, 40, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
        maxHeight: Platform.OS === 'ios' ? '85%' : '90%',
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 6,
        alignSelf: 'center',
        marginBottom: 16,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: 0.5,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    deleteButton: {
        padding: 6,
        borderRadius: 10,
        backgroundColor: '#FEF2F2',
    },
    closeButton: {
        padding: 6,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    inputIcon: {
        marginHorizontal: 8,
    },
    titleInput: {
        flex: 1,
        fontSize: 15,
        padding: 6,
        color: '#1E293B',
        fontWeight: '500',
    },
    descriptionInput: {
        flex: 1,
        fontSize: 14,
        padding: 6,
        height: 70,
        color: '#1E293B',
        lineHeight: 20,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    quickActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '500',
    },
    moreOptionsButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#3B4D6B',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    priorityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 6,
    },
    priorityText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },
    categoryScrollView: {
        marginBottom: 8,
    },
    categoryContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 6,
    },
    selectedCategory: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },
    selectedCategoryText: {
        color: '#fff',
    },
    categoryBookmark: {
        marginLeft: 6,
    },
    labelsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    labelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 4,
    },
    labelText: {
        fontSize: 11,
