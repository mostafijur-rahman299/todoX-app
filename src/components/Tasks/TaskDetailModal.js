import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    TextInput,
    ScrollView,
    StatusBar,
    Alert,
    TouchableWithoutFeedback,
    Platform,
    Vibration,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { priorityOptions, inboxOptions, dateTimeOptions } from '@/constants/GeneralData';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

/**
 * Enhanced TaskDetailModal component with full editing capabilities
 * Features: Modal selectors for date, priority, category, sub-tasks, and clean design
 */
const TaskDetailModal = ({ 
    visible, 
    onClose, 
    task, 
    onUpdateTask,
    onDeleteTask,
    onAddSubTask 
}) => {
    // Animation refs
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const prioritySlideAnim = useRef(new Animated.Value(-100)).current;
    const priorityOpacity = useRef(new Animated.Value(0)).current;
    const inboxSlideAnim = useRef(new Animated.Value(-100)).current;
    const inboxOpacity = useRef(new Animated.Value(0)).current;
    const dateTimeSlideAnim = useRef(new Animated.Value(-100)).current;
    const dateTimeOpacity = useRef(new Animated.Value(0)).current;
    
    // State management
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({});
    const [subTasks, setSubTasks] = useState([]);
    const [showAddSubTask, setShowAddSubTask] = useState(false);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
    const [commentText, setCommentText] = useState('');
    
    // Modal states
    const [showPriorityOptions, setShowPriorityOptions] = useState(false);
    const [showInboxOptions, setShowInboxOptions] = useState(false);
    const [showDateTimeOptions, setShowDateTimeOptions] = useState(false);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState('date');
    const [tempDate, setTempDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Initialize edited task when task changes
    useEffect(() => {
        if (task) {
            setEditedTask({
                ...task,
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                tag: task.tag || 'Inbox',
                dueDate: task.dueDate || null,
                dueTime: task.dueTime || null,
            });
            setSubTasks(task.subTasks || []);
        }
    }, [task]);

    // Animation effects
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: screenHeight,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    /**
     * Handle closing the modal with unsaved changes check
     */
    const handleClose = () => {
        if (isEditing) {
            Alert.alert(
                "Unsaved Changes",
                "You have unsaved changes. Do you want to save them before closing?",
                [
                    { text: "Don't Save", onPress: () => closeModal() },
                    { text: "Cancel", style: "cancel" },
                    { text: "Save", onPress: () => handleSaveChanges() }
                ]
            );
        } else {
            closeModal();
        }
    };

    /**
     * Close modal with animation
     */
    const closeModal = () => {
        // Close any open modals first
        setShowPriorityOptions(false);
        setShowInboxOptions(false);
        setShowDateTimeOptions(false);
        setShowDateTimePicker(false);
        
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsEditing(false);
            setShowAddSubTask(false);
            setNewSubTaskTitle('');
            setCommentText('');
            onClose();
        });
    };

    /**
     * Toggle editing mode
     */
    const toggleEditMode = () => {
        if (isEditing) {
            handleSaveChanges();
        } else {
            setIsEditing(true);
        }
    };

    /**
     * Save changes to the task
     */
    const handleSaveChanges = () => {
        if (onUpdateTask && editedTask.title.trim()) {
            const updatedTask = {
                ...editedTask,
                subTasks: subTasks
            };
            onUpdateTask(updatedTask);
            setIsEditing(false);
        } else if (!editedTask.title.trim()) {
            Alert.alert("Error", "Task title cannot be empty");
        }
    };

    /**
     * Cancel editing and revert changes
     */
    const handleCancelEdit = () => {
        setEditedTask({
            ...task,
            title: task.title || '',
            description: task.description || '',
            priority: task.priority || 'medium',
            tag: task.tag || 'Inbox',
            dueDate: task.dueDate || null,
            dueTime: task.dueTime || null,
        });
        setSubTasks(task.subTasks || []);
        setIsEditing(false);
        setShowAddSubTask(false);
        setNewSubTaskTitle('');
    };

    /**
     * Update task field
     */
    const updateTaskField = (field, value) => {
        setEditedTask(prev => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * Toggle task completion status
     */
    const toggleTaskCompletion = () => {
        const updatedTask = {
            ...editedTask,
            is_completed: !editedTask.is_completed
        };
        setEditedTask(updatedTask);
        if (onUpdateTask) {
            onUpdateTask(updatedTask);
        }
    };

    /**
     * Handle priority modal toggle with animation
     */
    const handlePriorityToggle = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        if (showPriorityOptions) {
            Animated.parallel([
                Animated.timing(priorityOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(prioritySlideAnim, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowPriorityOptions(false);
            });
        } else {
            setShowPriorityOptions(true);
            Animated.parallel([
                Animated.timing(priorityOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(prioritySlideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    /**
     * Handle priority selection
     */
    const handlePrioritySelect = (priority) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        updateTaskField('priority', priority.value);
        handlePriorityToggle();
    };

    /**
     * Handle inbox modal toggle with animation
     */
    const handleInboxToggle = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        if (showInboxOptions) {
            Animated.parallel([
                Animated.timing(inboxOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(inboxSlideAnim, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowInboxOptions(false);
            });
        } else {
            setShowInboxOptions(true);
            Animated.parallel([
                Animated.timing(inboxOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(inboxSlideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    /**
     * Handle inbox selection
     */
    const handleInboxSelect = (inbox) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        updateTaskField('tag', inbox.value);
        handleInboxToggle();
    };

    /**
     * Handle datetime modal toggle with animation
     */
    const handleDateTimeToggle = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        if (showDateTimeOptions) {
            Animated.parallel([
                Animated.timing(dateTimeOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(dateTimeSlideAnim, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowDateTimeOptions(false);
            });
        } else {
            setShowDateTimeOptions(true);
            Animated.parallel([
                Animated.timing(dateTimeOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(dateTimeSlideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    /**
     * Handle datetime selection
     */
    const handleDateTimeSelect = (dateTimeOption) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        if (dateTimeOption.value === 'custom') {
            setSelectedDate(new Date());
            setTempDate(new Date());
            setDatePickerMode('date');
            setShowDateTimePicker(true);
        } else {
            const selectedDate = dateTimeOption.getDate();
            updateTaskField('dueDate', selectedDate.toISOString().split('T')[0]);
            updateTaskField('dueTime', selectedDate.toTimeString().split(' ')[0].substring(0, 5));
        }
        handleDateTimeToggle();
    };

    /**
     * Handle date picker change
     */
    const handleDatePickerChange = (event, date) => {
        if (Platform.OS === 'android') {
            setShowDateTimePicker(false);
            if (event.type === 'set' && date) {
                if (datePickerMode === 'date') {
                    setSelectedDate(date);
                    setTempDate(date);
                    setTimeout(() => {
                        setDatePickerMode('time');
                        setShowDateTimePicker(true);
                    }, 100);
                } else {
                    const finalDate = new Date(selectedDate);
                    finalDate.setHours(date.getHours());
                    finalDate.setMinutes(date.getMinutes());
                    
                    updateTaskField('dueDate', finalDate.toISOString().split('T')[0]);
                    updateTaskField('dueTime', finalDate.toTimeString().split(' ')[0].substring(0, 5));
                }
            }
        } else {
            if (date) {
                setTempDate(date);
            }
        }
    };

    /**
     * Handle iOS date picker confirm
     */
    const handleDatePickerConfirm = () => {
        updateTaskField('dueDate', tempDate.toISOString().split('T')[0]);
        updateTaskField('dueTime', tempDate.toTimeString().split(' ')[0].substring(0, 5));
        setShowDateTimePicker(false);
    };

    /**
     * Handle iOS date picker cancel
     */
    const handleDatePickerCancel = () => {
        setShowDateTimePicker(false);
        setTempDate(selectedDate);
    };

    /**
     * Get current priority option
     */
    const getCurrentPriority = () => {
        return priorityOptions.find(p => p.value === editedTask.priority) || priorityOptions[1];
    };

    /**
     * Get current inbox option
     */
    const getCurrentInbox = () => {
        return inboxOptions.find(i => i.value === editedTask.tag) || inboxOptions[0];
    };

    /**
     * Get formatted datetime display
     */
    const getDateTimeDisplay = () => {
        if (!editedTask.dueDate) return "Set Date & Time";
        
        const date = new Date(editedTask.dueDate + 'T' + (editedTask.dueTime || '00:00'));
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return `Today ${editedTask.dueTime || ''}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow ${editedTask.dueTime || ''}`;
        } else {
            return `${date.toLocaleDateString()} ${editedTask.dueTime || ''}`;
        }
    };

    /**
     * Clear datetime
     */
    const clearDateTime = () => {
        updateTaskField('dueDate', null);
        updateTaskField('dueTime', null);
    };

    /**
     * Add new sub-task
     */
    const handleAddSubTask = () => {
        if (newSubTaskTitle.trim()) {
            const newSubTask = {
                id: Date.now(),
                title: newSubTaskTitle.trim(),
                is_completed: false
            };
            setSubTasks(prev => [...prev, newSubTask]);
            setNewSubTaskTitle('');
            setShowAddSubTask(false);
        }
    };

    /**
     * Toggle sub-task completion
     */
    const toggleSubTaskCompletion = (subTaskId) => {
        setSubTasks(prev => 
            prev.map(subTask => 
                subTask.id === subTaskId 
                    ? { ...subTask, is_completed: !subTask.is_completed }
                    : subTask
            )
        );
    };

    /**
     * Delete sub-task
     */
    const deleteSubTask = (subTaskId) => {
        setSubTasks(prev => prev.filter(subTask => subTask.id !== subTaskId));
    };

    /**
     * Delete main task
     */
    const handleDeleteTask = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: () => {
                        if (onDeleteTask) {
                            onDeleteTask(task.id);
                        }
                        closeModal();
                    }
                }
            ]
        );
    };

    if (!task) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent={true}
        >
            <StatusBar backgroundColor="rgba(0,0,0,0.8)" barStyle="light-content" />
            <Animated.View 
                style={[
                    styles.overlay,
                    { opacity: overlayOpacity }
                ]}
            >
                <TouchableOpacity 
                    style={styles.overlayTouch}
                    activeOpacity={1}
                    onPress={handleClose}
                />
                
                <Animated.View 
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View 
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity 
                                onPress={handleClose}
                                style={styles.backButton}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                            
                            <View style={styles.headerCenter}>
                                <Text style={styles.headerTitle}>Task Details</Text>
                            </View>
                            
                            <View style={styles.headerRight}>
                                {isEditing ? (
                                    <>
                                        <TouchableOpacity 
                                            style={styles.headerIconButton}
                                            onPress={handleCancelEdit}
                                        >
                                            <Ionicons name="close" size={22} color={colors.textSecondary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.headerIconButton}
                                            onPress={handleSaveChanges}
                                        >
                                            <Ionicons name="checkmark" size={22} color={colors.success} />
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity 
                                        style={styles.headerIconButton}
                                        onPress={toggleEditMode}
                                    >
                                        <Ionicons name="create-outline" size={24} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Task Content */}
                        <ScrollView style={styles.taskContent}>
                            {/* Task Title */}
                            <View style={styles.taskTitleContainer}>
                                <TouchableOpacity 
                                    style={styles.checkboxContainer}
                                    onPress={toggleTaskCompletion}
                                >
                                    <View style={[
                                        styles.checkbox,
                                        editedTask.is_completed && styles.checkboxCompleted
                                    ]}>
                                        {editedTask.is_completed && (
                                            <Ionicons name="checkmark" size={16} color={colors.white} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                                
                                {isEditing ? (
                                    <TextInput
                                        style={[
                                            styles.taskTitle,
                                            styles.taskTitleInput,
                                            editedTask.is_completed && styles.taskTitleCompleted
                                        ]}
                                        value={editedTask.title}
                                        onChangeText={(text) => updateTaskField('title', text)}
                                        placeholder="Task title"
                                        placeholderTextColor={colors.textTertiary}
                                        multiline
                                    />
                                ) : (
                                    <Text style={[
                                        styles.taskTitle,
                                        editedTask.is_completed && styles.taskTitleCompleted
                                    ]}>
                                        {editedTask.title}
                                    </Text>
                                )}
                            </View>

                            {/* Task Description */}
                            {(isEditing || editedTask.description) && (
                                <View style={styles.descriptionContainer}>
                                    {isEditing ? (
                                        <TextInput
                                            style={[styles.taskDescription, styles.taskDescriptionInput]}
                                            value={editedTask.description}
                                            onChangeText={(text) => updateTaskField('description', text)}
                                            placeholder="Add description..."
                                            placeholderTextColor={colors.textTertiary}
                                            multiline
                                        />
                                    ) : (
                                        <Text style={styles.taskDescription}>
                                            {editedTask.description}
                                        </Text>
                                    )}
                                </View>
                            )}

                            {/* Property Cards */}
                            <View style={styles.propertyCards}>
                                {/* Date Card */}
                                <TouchableOpacity 
                                    style={[
                                        styles.propertyCard,
                                        editedTask.dueDate && styles.propertyCardActive
                                    ]}
                                    onPress={isEditing ? handleDateTimeToggle : null}
                                    disabled={!isEditing}
                                >
                                    <View style={styles.propertyCardLeft}>
                                        <View style={[
                                            styles.propertyIcon,
                                            { backgroundColor: colors.info + '20' }
                                        ]}>
                                            <Ionicons 
                                                name="calendar-outline" 
                                                size={16} 
                                                color={colors.info} 
                                            />
                                        </View>
                                        <Text style={styles.propertyLabel}>
                                            {getDateTimeDisplay()}
                                        </Text>
                                    </View>
                                    {editedTask.dueDate && (
                                        <TouchableOpacity
                                            onPress={clearDateTime}
                                            style={styles.clearButton}
                                        >
                                            <Ionicons
                                                name="close-circle"
                                                size={20}
                                                color={colors.textTertiary}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </TouchableOpacity>

                                {/* Priority Card */}
                                <TouchableOpacity 
                                    style={styles.propertyCard}
                                    onPress={isEditing ? handlePriorityToggle : null}
                                    disabled={!isEditing}
                                >
                                    <View style={styles.propertyCardLeft}>
                                        <View style={[
                                            styles.propertyIcon,
                                            { backgroundColor: getCurrentPriority().color + '20' }
                                        ]}>
                                            <Ionicons 
                                                name={getCurrentPriority().icon} 
                                                size={16} 
                                                color={getCurrentPriority().color} 
                                            />
                                        </View>
                                        <Text style={styles.propertyLabel}>
                                            {getCurrentPriority().label}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Category Card */}
                                <TouchableOpacity 
                                    style={styles.propertyCard}
                                    onPress={isEditing ? handleInboxToggle : null}
                                    disabled={!isEditing}
                                >
                                    <View style={styles.propertyCardLeft}>
                                        <View style={[
                                            styles.propertyIcon,
                                            { backgroundColor: getCurrentInbox().color + '20' }
                                        ]}>
                                            <Ionicons 
                                                name={getCurrentInbox().icon} 
                                                size={16} 
                                                color={getCurrentInbox().color} 
                                            />
                                        </View>
                                        <Text style={styles.propertyLabel}>
                                            {getCurrentInbox().label}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Sub-tasks Section */}
                            {(subTasks.length > 0 || isEditing) && (
                                <View style={styles.subTasksSection}>
                                    <Text style={styles.sectionTitle}>Sub-tasks</Text>
                                    
                                    {subTasks.map((subTask) => (
                                        <View key={subTask.id} style={styles.subTaskItem}>
                                            <TouchableOpacity 
                                                style={styles.subTaskCheckbox}
                                                onPress={() => toggleSubTaskCompletion(subTask.id)}
                                            >
                                                <View style={[
                                                    styles.checkbox,
                                                    styles.subTaskCheckboxStyle,
                                                    subTask.is_completed && styles.checkboxCompleted
                                                ]}>
                                                    {subTask.is_completed && (
                                                        <Ionicons name="checkmark" size={12} color={colors.white} />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                            
                                            <Text style={[
                                                styles.subTaskTitle,
                                                subTask.is_completed && styles.subTaskTitleCompleted
                                            ]}>
                                                {subTask.title}
                                            </Text>
                                            
                                            {isEditing && (
                                                <TouchableOpacity 
                                                    style={styles.deleteSubTaskButton}
                                                    onPress={() => deleteSubTask(subTask.id)}
                                                >
                                                    <Ionicons name="trash-outline" size={16} color={colors.error} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ))}

                                    {/* Add Sub-task */}
                                    {isEditing && (
                                        <View style={styles.addSubTaskContainer}>
                                            {showAddSubTask ? (
                                                <View style={styles.addSubTaskInput}>
                                                    <TextInput
                                                        style={styles.subTaskInput}
                                                        value={newSubTaskTitle}
                                                        onChangeText={setNewSubTaskTitle}
                                                        placeholder="Sub-task title"
                                                        placeholderTextColor={colors.textTertiary}
                                                        autoFocus
                                                        onSubmitEditing={handleAddSubTask}
                                                    />
                                                    <TouchableOpacity 
                                                        style={styles.addSubTaskConfirm}
                                                        onPress={handleAddSubTask}
                                                    >
                                                        <Ionicons name="checkmark" size={16} color={colors.success} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity 
                                                        style={styles.addSubTaskCancel}
                                                        onPress={() => {
                                                            setShowAddSubTask(false);
                                                            setNewSubTaskTitle('');
                                                        }}
                                                    >
                                                        <Ionicons name="close" size={16} color={colors.error} />
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <TouchableOpacity 
                                                    style={styles.addSubTaskButton}
                                                    onPress={() => setShowAddSubTask(true)}
                                                >
                                                    <Ionicons name="add" size={20} color={colors.primary} />
                                                    <Text style={styles.addSubTaskText}>Add sub-task</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Delete Button */}
                            {isEditing && (
                                <TouchableOpacity 
                                    style={styles.deleteButton}
                                    onPress={handleDeleteTask}
                                >
                                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                                    <Text style={styles.deleteButtonText}>Delete Task</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>
                </Animated.View>

                {/* Priority Selection Modal */}
                {showPriorityOptions && (
                    <Modal
                        transparent={true}
                        visible={showPriorityOptions}
                        animationType="fade"
                        onRequestClose={handlePriorityToggle}
                        statusBarTranslucent={true}
                    >
                        <TouchableWithoutFeedback onPress={handlePriorityToggle}>
                            <View style={styles.selectionModalOverlay}>
                                <TouchableWithoutFeedback>
                                    <Animated.View
                                        style={[
                                            styles.selectionModal,
                                            {
                                                opacity: priorityOpacity,
                                                transform: [{ translateY: prioritySlideAnim }],
                                            },
                                        ]}
                                    >
                                        <View style={styles.selectionModalHeader}>
                                            <Text style={styles.selectionModalTitle}>Select Priority</Text>
                                            <TouchableOpacity 
                                                onPress={handlePriorityToggle}
                                                style={styles.selectionModalCloseBtn}
                                            >
                                                <Ionicons name="close" size={22} color={colors.textSecondary} />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView
                                            style={styles.selectionScrollView}
                                            showsVerticalScrollIndicator={false}
                                        >
                                            {priorityOptions.map((priority, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={[
                                                        styles.selectionOption,
                                                        editedTask.priority === priority.value && styles.selectionOptionSelected,
                                                    ]}
                                                    onPress={() => handlePrioritySelect(priority)}
                                                >
                                                    <View style={[
                                                        styles.selectionIconContainer,
                                                        { backgroundColor: priority.color + '20' }
                                                    ]}>
                                                        <Ionicons
                                                            name={priority.icon}
                                                            size={22}
                                                            color={priority.color}
                                                        />
                                                    </View>
                                                    <Text style={styles.selectionOptionText}>
                                                        {priority.label}
                                                    </Text>
                                                    {editedTask.priority === priority.value && (
                                                        <View style={styles.selectionCheckmark}>
                                                            <Ionicons
                                                                name="checkmark"
                                                                size={16}
                                                                color={colors.white}
                                                            />
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </Animated.View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                )}

                {/* Inbox Selection Modal */}
                {showInboxOptions && (
                    <Modal
                        transparent={true}
                        visible={showInboxOptions}
                        animationType="fade"
                        onRequestClose={handleInboxToggle}
                        statusBarTranslucent={true}
                    >
                        <TouchableWithoutFeedback onPress={handleInboxToggle}>
                            <View style={styles.selectionModalOverlay}>
                                <TouchableWithoutFeedback>
                                    <Animated.View
                                        style={[
                                            styles.selectionModal,
                                            {
                                                opacity: inboxOpacity,
                                                transform: [{ translateY: inboxSlideAnim }],
                                            },
                                        ]}
                                    >
                                        <View style={styles.selectionModalHeader}>
                                            <Text style={styles.selectionModalTitle}>Select Category</Text>
                                            <TouchableOpacity 
                                                onPress={handleInboxToggle}
                                                style={styles.selectionModalCloseBtn}
                                            >
                                                <Ionicons name="close" size={22} color={colors.textSecondary} />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView
                                            style={styles.selectionScrollView}
                                            showsVerticalScrollIndicator={false}
                                        >
                                            {inboxOptions.map((inbox, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={[
                                                        styles.selectionOption,
                                                        editedTask.tag === inbox.value && styles.selectionOptionSelected,
                                                    ]}
                                                    onPress={() => handleInboxSelect(inbox)}
                                                >
                                                    <View style={[
                                                        styles.selectionIconContainer,
                                                        { backgroundColor: inbox.color + '20' }
                                                    ]}>
                                                        <Ionicons
                                                            name={inbox.icon}
                                                            size={22}
                                                            color={inbox.color}
                                                        />
                                                    </View>
                                                    <Text style={styles.selectionOptionText}>
                                                        {inbox.label}
                                                    </Text>
                                                    {editedTask.tag === inbox.value && (
                                                        <View style={styles.selectionCheckmark}>
                                                            <Ionicons
                                                                name="checkmark"
                                                                size={16}
                                                                color={colors.white}
                                                            />
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </Animated.View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                )}

                {/* DateTime Selection Modal */}
                {showDateTimeOptions && (
                    <Modal
                        transparent={true}
                        visible={showDateTimeOptions}
                        animationType="fade"
                        onRequestClose={handleDateTimeToggle}
                        statusBarTranslucent={true}
                    >
                        <TouchableWithoutFeedback onPress={handleDateTimeToggle}>
                            <View style={styles.selectionModalOverlay}>
                                <TouchableWithoutFeedback>
                                    <Animated.View
                                        style={[
                                            styles.selectionModal,
                                            {
                                                opacity: dateTimeOpacity,
                                                transform: [{ translateY: dateTimeSlideAnim }],
                                            },
                                        ]}
                                    >
                                        <View style={styles.selectionModalHeader}>
                                            <Text style={styles.selectionModalTitle}>Select Date & Time</Text>
                                            <TouchableOpacity 
                                                onPress={handleDateTimeToggle}
                                                style={styles.selectionModalCloseBtn}
                                            >
                                                <Ionicons name="close" size={22} color={colors.textSecondary} />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView
                                            style={styles.selectionScrollView}
                                            showsVerticalScrollIndicator={false}
                                        >
                                            {dateTimeOptions.map((dateTimeOption, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.selectionOption}
                                                    onPress={() => handleDateTimeSelect(dateTimeOption)}
                                                >
                                                    <View style={[
                                                        styles.selectionIconContainer,
                                                        { backgroundColor: dateTimeOption.color + '20' }
                                                    ]}>
                                                        <Ionicons
                                                            name={dateTimeOption.icon}
                                                            size={22}
                                                            color={dateTimeOption.color}
                                                        />
                                                    </View>
                                                    <Text style={styles.selectionOptionText}>
                                                        {dateTimeOption.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </Animated.View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                )}

                {/* Custom DateTime Picker Modal */}
                {showDateTimePicker && (
                    <>
                        {Platform.OS === 'ios' ? (
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={showDateTimePicker}
                                onRequestClose={handleDatePickerCancel}
                            >
                                <View style={styles.datePickerOverlay}>
                                    <TouchableWithoutFeedback onPress={handleDatePickerCancel}>
                                        <View style={styles.datePickerOverlayTouch} />
                                    </TouchableWithoutFeedback>
                                    <View style={styles.datePickerContainer}>
                                        <View style={styles.datePickerHeader}>
                                            <TouchableOpacity
                                                onPress={handleDatePickerCancel}
                                                style={styles.datePickerButton}
                                            >
                                                <Text style={styles.datePickerButtonText}>Cancel</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.datePickerTitle}>Select Date & Time</Text>
                                            <TouchableOpacity
                                                onPress={handleDatePickerConfirm}
                                                style={styles.datePickerButton}
                                            >
                                                <Text style={[styles.datePickerButtonText, { color: colors.primary }]}>Done</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.datePickerContent}>
                                            <DateTimePicker
                                                value={tempDate}
                                                mode="datetime"
                                                display="wheels"
                                                onChange={handleDatePickerChange}
                                                minimumDate={new Date()}
                                                textColor={colors.textPrimary}
                                                themeVariant="dark"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        ) : (
                            <DateTimePicker
                                value={datePickerMode === 'date' ? selectedDate : tempDate}
                                mode={datePickerMode}
                                display="default"
                                onChange={handleDatePickerChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </>
                )}
            </Animated.View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'flex-end',
    },
    overlayTouch: {
        flex: 1,
    },
    modalContainer: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: screenHeight * 0.9,
        minHeight: screenHeight * 0.6,
    },
    scrollView: {
        flex: 1,
    },
    
    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: 3,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerIconButton: {
        padding: 8,
        borderRadius: 8,
    },
    
    // Task Content Styles
    taskContent: {
        padding: 20,
    },
    taskTitleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    checkboxContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    taskTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        lineHeight: 20,
    },
    taskTitleInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.surface,
    },
    taskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textTertiary,
    },
    descriptionContainer: {
        marginLeft: 36,
    },
    taskDescription: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    taskDescriptionInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.surface,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    
    // Property Cards Styles
    propertyCards: {
        gap: 12,
        marginBottom: 32,
        marginTop: 30
    },
    propertyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 2,
        paddingHorizontal: 16,
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    propertyCardActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    propertyCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    propertyIcon: {
        width: 35,
        height: 35,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginVertical: 3
    },
    propertyLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.textPrimary,
        flex: 1,
    },
    clearButton: {
        padding: 4,
    },
    // Sub-tasks Styles
    subTasksSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    subTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginBottom: 8,
    },
    subTaskCheckbox: {
        marginRight: 12,
    },
    subTaskCheckboxStyle: {
        width: 18,
        height: 18,
        borderRadius: 10,
    },
    subTaskTitle: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
    },
    subTaskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textTertiary,
    },
    deleteSubTaskButton: {
        padding: 4,
    },
    addSubTaskContainer: {
        marginTop: 8,
    },
    addSubTaskButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    addSubTaskText: {
        fontSize: 16,
        color: colors.primary,
        marginLeft: 8,
        fontWeight: '500',
    },
    addSubTaskInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    subTaskInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        paddingVertical: 8,
    },
    addSubTaskConfirm: {
        padding: 8,
        marginLeft: 8,
    },
    addSubTaskCancel: {
        padding: 8,
    },

    // Delete Button Styles
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        marginTop: 16,
        marginBottom: 40
    },
    deleteButtonText: {
        fontSize: 14,
        color: colors.error,
        marginLeft: 8,
        fontWeight: '500',
    },
    
    // Selection Modal Styles
    selectionModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    selectionModal: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        width: '100%',
        maxHeight: screenHeight * 0.6,
        overflow: 'hidden',
    },
    selectionModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    selectionModalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    selectionModalCloseBtn: {
        padding: 4,
    },
    selectionScrollView: {
        maxHeight: screenHeight * 0.4,
    },
    selectionOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    selectionOptionSelected: {
        backgroundColor: colors.primary + '10',
    },
    selectionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    selectionOptionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    selectionCheckmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    // Date Picker Styles
    datePickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    datePickerOverlayTouch: {
        flex: 1,
    },
    datePickerContainer: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    datePickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    datePickerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    datePickerButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    datePickerButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    datePickerContent: {
        paddingVertical: 20,
    },
});

export default TaskDetailModal;