import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet, Platform, Dimensions, Keyboard, Animated, KeyboardAvoidingView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { priorities, defaultLabels, reminderOptions, quickActions } from '@/constants/GeneralData';
import { generateId } from '@/utils/gnFunc';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '@/store/Task/task';
import { storeDataLocalStorage } from '@/utils/storage';

/**
 * Enhanced AddTodoModal component with labels, locations, reminders, and quick actions
 */
const AddTodoModal = ({ isModalVisible, setIsModalVisible }) => {
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState(null);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        timestamp: new Date(),
        description: "", 
        category: "other",
        priority: priorities[0].name,
        is_completed: false,
        completed_timestamp: null,
        sub_tasks: [],
        labels: [],
        location: "",
        reminder: null,
        hasDeadline: false,
        hasLocation: false
    });
    const tasks = useSelector(state => state.task.task_list);
    const [keyboardHeight] = useState(new Animated.Value(0));
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const categories = useSelector(state => state.category.categories);

    // Keyboard handling
    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardVisible(true);
                Animated.timing(keyboardHeight, {
                    toValue: e.endCoordinates.height,
                    duration: Platform.OS === 'ios' ? 250 : 0,
                    useNativeDriver: false,
                }).start();
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                Animated.timing(keyboardHeight, {
                    toValue: 0,
                    duration: Platform.OS === 'ios' ? 250 : 0,
                    useNativeDriver: false,
                }).start();
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    /**
     * Handle task property updates
     */
    const handleSetNewTask = (key, value) => {
        setNewTask(prev => ({ ...prev, [key]: value }));
    };

    /**
     * Handle quick action buttons
     */
    const handleQuickAction = (action) => {
        switch (action) {
            case 'setToday':
                const today = new Date();
                today.setHours(23, 59, 0, 0);
                handleSetNewTask('timestamp', today);
                break;
            case 'setPriority':
                const currentPriorityIndex = priorities.findIndex(p => p.name === newTask.priority);
                const nextPriority = priorities[(currentPriorityIndex + 1) % priorities.length];
                handleSetNewTask('priority', nextPriority.name);
                break;
            case 'setReminder':
                handleSetNewTask('reminder', reminderOptions[0]);
                break;
        }
    };

    /**
     * Handle label toggle
     */
    const handleToggleLabel = (label) => {
        const isSelected = newTask.labels.some(l => l.id === label.id);
        if (isSelected) {
            handleSetNewTask('labels', newTask.labels.filter(l => l.id !== label.id));
        } else {
            handleSetNewTask('labels', [...newTask.labels, label]);
        }
    };

    /**
     * Handle task creation
     */
    const handleAddTask = () => {
        if (!newTask.title.trim()) return;

        const taskData = {
            ...newTask,
            id: generateId(),
            timestamp: newTask.timestamp.toISOString(),
            title: newTask.title.trim(),
            description: newTask.description.trim()
        };

        dispatch(addTask(taskData));
        storeDataLocalStorage('task_list', [...tasks, taskData]);
        
        setIsModalVisible(false);
        resetForm();
    };

    /**
     * Reset form to initial state
     */
    const resetForm = () => {
        setNewTask({
            title: "",
            timestamp: new Date(),
            description: "", 
            category: "other",
            priority: priorities[0].name,
            is_completed: false,
            completed_timestamp: null,
            sub_tasks: [],
            labels: [],
            location: "",
            reminder: null,
            hasDeadline: false,
            hasLocation: false
        });
        setShowMoreOptions(false);
    };

    /**
     * Format date for display
     */
    const formatDate = (date) => {
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
    };

    /**
     * Handle date/time picker changes
     */
    const handleDateTimeChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            if (!selectedDate) {
                setPickerMode(null);
                setShowDatePicker(false);
                return;
            }

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
            if (selectedDate) {
                handleSetNewTask('timestamp', selectedDate);
            }
            setShowDatePicker(false);
        }
    };

    /**
     * Open date/time picker
     */
    const openPicker = () => {
        if (Platform.OS === 'android') {
            setPickerMode('date');
        }
        setShowDatePicker(true);
    };

    /**
     * Show PRO feature alert
     */
    const showProAlert = (feature) => {
        Alert.alert(
            `${feature} - PRO Feature`,
            `Upgrade to PRO to unlock ${feature.toLowerCase()} functionality.`,
            [
                { text: 'Maybe Later', style: 'cancel' },
                { text: 'Upgrade Now', onPress: () => console.log('Navigate to upgrade') }
            ]
        );
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
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <Animated.View 
                        style={[
                            styles.modalContainer,
                            Platform.OS === 'ios' && { paddingBottom: keyboardHeight }
                        ]}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHandle} />
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>New Task</Text>
                                <TouchableOpacity 
                                    onPress={() => setIsModalVisible(false)}
                                    style={styles.closeButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons name="close" size={22} color="#1E293B" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={styles.scrollContent}
                            >
                                {/* Task Title Input */}
                                <View style={[styles.inputContainer, isKeyboardVisible && styles.inputContainerFocused]}>
                                    <Ionicons name="pencil-outline" size={18} color="#4F46E5" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.titleInput}
                                        value={newTask.title}
                                        onChangeText={(text) => handleSetNewTask('title', text)}
                                        placeholder="Task name"
                                        placeholderTextColor="#94A3B8"
                                        returnKeyType="next"
                                        maxLength={100}
                                    />
                                </View>

                                {/* Task Description Input */}
                                <View style={[styles.inputContainer, isKeyboardVisible && styles.inputContainerFocused]}>
                                    <Ionicons name="document-text-outline" size={18} color="#4F46E5" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.descriptionInput}
                                        value={newTask.description}
                                        onChangeText={(text) => handleSetNewTask('description', text)}
                                        placeholder="Description"
                                        placeholderTextColor="#94A3B8"
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
                                            onPress={() => handleQuickAction(action.action)}
                                        >
                                            <Ionicons name={action.icon} size={16} color={action.color} />
                                            <Text style={[styles.quickActionText, { color: action.color }]}>
                                                {action.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                    <TouchableOpacity
                                        style={styles.moreOptionsButton}
                                        onPress={() => setShowMoreOptions(!showMoreOptions)}
                                    >
                                        <Ionicons 
                                            name={showMoreOptions ? "ellipsis-horizontal" : "ellipsis-horizontal-outline"} 
                                            size={16} 
                                            color="#64748b" 
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* More Options Menu */}
                                {showMoreOptions && (
                                    <View style={styles.moreOptionsMenu}>
                                        <TouchableOpacity 
                                            style={styles.optionItem}
                                            onPress={() => setShowMoreOptions(false)}
                                        >
                                            <Ionicons name="pricetag-outline" size={20} color="#64748b" />
                                            <Text style={styles.optionText}>Labels</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            style={styles.optionItem}
                                            onPress={() => showProAlert('Deadline')}
                                        >
                                            <Ionicons name="time-outline" size={20} color="#64748b" />
                                            <Text style={styles.optionText}>Deadline</Text>
                                            <View style={styles.proTag}>
                                                <Text style={styles.proTagText}>PRO</Text>
                                            </View>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            style={styles.optionItem}
                                            onPress={() => showProAlert('Location')}
                                        >
                                            <Ionicons name="location-outline" size={20} color="#64748b" />
                                            <Text style={styles.optionText}>Location</Text>
                                            <View style={styles.proTag}>
                                                <Text style={styles.proTagText}>PRO</Text>
                                            </View>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.optionItem}>
                                            <Ionicons name="create-outline" size={20} color="#64748b" />
                                            <Text style={styles.optionText}>Edit task actions</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Labels Section */}
                                <Text style={styles.sectionTitle}>Labels</Text>
                                <ScrollView 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.labelsScrollView}
                                >
                                    <View style={styles.labelsContainer}>
                                        {defaultLabels.map((label) => {
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
                                                        size={16} 
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
                                </ScrollView>

                                {/* Priority Section */}
                                <Text style={styles.sectionTitle}>Set Priority Level</Text>
                                <View style={styles.priorityContainer}>
                                    {priorities.map((priority) => (
                                        <TouchableOpacity
                                            key={priority.name}
                                            style={[
                                                styles.priorityButton,
                                                newTask.priority === priority.name && { backgroundColor: priority.color }
                                            ]}
                                            onPress={() => handleSetNewTask('priority', priority.name)}
                                        >
                                            <Ionicons 
                                                name={newTask.priority === priority.name ? "flag" : "flag-outline"} 
                                                size={16} 
                                                color={newTask.priority === priority.name ? '#fff' : priority.color} 
                                            />
                                            <Text style={[
                                                styles.priorityText,
                                                newTask.priority === priority.name && { color: '#fff' }
                                            ]}>{priority.name.charAt(0).toUpperCase() + priority.name.slice(1)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Category Section */}
                                <Text style={styles.sectionTitle}>Choose Category</Text>
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
                                            >
                                                <Ionicons 
                                                    name={category.icon || "bookmark-outline"} 
                                                    size={18} 
                                                    color={newTask.category === category.name ? '#fff' : colors.primary} 
                                                />
                                                <Text style={[
                                                    styles.categoryText,
                                                    newTask.category === category.name && styles.selectedCategoryText
                                                ]}>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>

                                {/* Due Date Section */}
                                <Text style={styles.sectionTitle}>Set Due Date & Time</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={openPicker}
                                >
                                    <Ionicons name="time-outline" size={18} color={colors.primary} />
                                    <Text style={styles.dateButtonText}>
                                        {formatDate(newTask.timestamp)}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={18} color={colors.primary} />
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

                                {/* Create Button */}
                                <TouchableOpacity
                                    style={[
                                        styles.createButton,
                                        !newTask.title.trim() && styles.disabledButton,
                                        isKeyboardVisible && Platform.OS === 'android' && styles.keyboardVisibleButton
                                    ]}
                                    onPress={handleAddTask}
                                    disabled={!newTask.title.trim()}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.createButtonText}>Create Task</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default AddTodoModal;

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
        alignSelf: 'center'
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
    inputContainerFocused: {
        borderColor: '#4F46E5',
        backgroundColor: '#FAFAFA',
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
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
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
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    moreOptionsMenu: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 12,
    },
    optionText: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
    },
    proTag: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    proTagText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#3B4D6B',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    labelsScrollView: {
        marginBottom: 16,
    },
    labelsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    labelButton: {
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
    labelText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 8,
    },
    priorityButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 6,
    },
    priorityText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    categoryScrollView: {
        marginBottom: 16,
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
        color: '#374151',
    },
    selectedCategoryText: {
        color: '#FFFFFF',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
    },
    dateButtonText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        marginLeft: 8,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4F46E5',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#94A3B8',
    },
    keyboardVisibleButton: {
        marginBottom: 20,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
