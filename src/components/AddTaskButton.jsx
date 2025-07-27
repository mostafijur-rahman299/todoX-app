import React, { useEffect, useState, useRef } from 'react';
import { 
    View, 
    Text,
    TouchableOpacity, 
    StyleSheet,
    TextInput,
    Alert,
    Modal,
    Animated,
    Easing,
    ScrollView,
    TouchableWithoutFeedback,
    Platform,
    Dimensions,
    Vibration
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/store/Task/category';
import { addTask, setTasks } from '@/store/Task/task';
import { defaultCategories } from '@/constants/GeneralData';
import { colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '@/utils/gnFunc';
import { storeDataLocalStorage, getDataLocalStorage } from '@/utils/storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Inbox screen component - main task list view with enhanced animations
 * Displays tasks in a dark theme design with smooth transitions
 */
const AddTaskButton = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.display_tasks);
    const categories = useSelector((state) => state.category.categories);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        category: "other",
        priority: "medium",
        reminder: false,
        tag: "Inbox",
        dueDate: null,
        dueTime: null,
    });
    const [showPriorityOptions, setShowPriorityOptions] = useState(false);
    const [showInboxOptions, setShowInboxOptions] = useState(false);
    const [showDateTimeOptions, setShowDateTimeOptions] = useState(false);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState('date'); // 'date' or 'time'
    const [tempDate, setTempDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    // Enhanced animation refs with multiple values
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const prioritySlideAnim = useRef(new Animated.Value(-100)).current;
    const priorityOpacity = useRef(new Animated.Value(0)).current;
    const inboxSlideAnim = useRef(new Animated.Value(-100)).current;
    const inboxOpacity = useRef(new Animated.Value(0)).current;
    const dateTimeSlideAnim = useRef(new Animated.Value(-100)).current;
    const dateTimeOpacity = useRef(new Animated.Value(0)).current;
    const addButtonScale = useRef(new Animated.Value(1)).current;
    const addButtonRotation = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.9)).current;
    const inputFocusAnim = useRef(new Animated.Value(0)).current;

    // Available priority options with enhanced styling
    const priorityOptions = [
        {
            label: "High Priority",
            value: "high",
            color: colors.error,
            icon: "flag",
            gradient: ['#FF6B6B', '#FF5252'],
        },
        {
            label: "Medium Priority", 
            value: "medium",
            color: colors.warning,
            icon: "flag",
            gradient: ['#FFB74D', '#FF9800'],
        },
        {
            label: "Low Priority",
            value: "low",
            color: colors.success,
            icon: "flag",
            gradient: ['#81C784', '#4CAF50'],
        },
    ];

    // Enhanced inbox/tag options with colors and gradients
    const inboxOptions = [
        {
            label: "Inbox",
            value: "Inbox",
            icon: "mail-outline",
            color: colors.primary,
            gradient: ['#6366F1', '#4F46E5'],
        },
        {
            label: "Work",
            value: "Work", 
            icon: "briefcase-outline",
            color: colors.info,
            gradient: ['#06B6D4', '#0891B2'],
        },
        {
            label: "Personal",
            value: "Personal",
            icon: "person-outline",
            color: colors.success,
            gradient: ['#10B981', '#059669'],
        },
        {
            label: "Shopping",
            value: "Shopping",
            icon: "bag-outline",
            color: colors.warning,
            gradient: ['#F59E0B', '#D97706'],
        },
        {
            label: "Health",
            value: "Health",
            icon: "fitness-outline",
            color: colors.error,
            gradient: ['#EF4444', '#DC2626'],
        },
    ];

    // Enhanced datetime options with quick selections
    const dateTimeOptions = [
        {
            label: "Today",
            value: "today",
            icon: "today-outline",
            color: colors.primary,
            getDate: () => new Date(),
        },
        {
            label: "Tomorrow",
            value: "tomorrow",
            icon: "calendar-outline",
            color: colors.info,
            getDate: () => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow;
            },
        },
        {
            label: "Next Week",
            value: "next_week",
            icon: "calendar-outline",
            color: colors.warning,
            getDate: () => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                return nextWeek;
            },
        },
        {
            label: "Custom Date",
            value: "custom",
            icon: "calendar",
            color: colors.success,
            getDate: () => new Date(),
        },
    ];

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
     * Enhanced add button press with multiple animations
     */
    const handleAddPress = () => {
        // Haptic feedback
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }

        // Button press animation
        Animated.sequence([
            Animated.timing(addButtonScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(addButtonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Rotate add button
        Animated.timing(addButtonRotation, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
        }).start();

        setModalVisible(true);

        // Enhanced modal entrance animation
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.back(1.1)),
                useNativeDriver: true,
            }),
            Animated.timing(modalScale, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.back(1.1)),
                useNativeDriver: true,
            }),
        ]).start();
    };

    /**
     * Enhanced modal close with smooth animations
     */
    const closeModal = () => {
        // Reset add button rotation
        Animated.timing(addButtonRotation, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        // Close dropdowns first
        if (showPriorityOptions) {
            setShowPriorityOptions(false);
        }
        if (showInboxOptions) {
            setShowInboxOptions(false);
        }
        if (showDateTimeOptions) {
            setShowDateTimeOptions(false);
        }

        // Enhanced modal exit animation
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 250,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 350,
                easing: Easing.in(Easing.back(1.1)),
                useNativeDriver: true,
            }),
            Animated.timing(modalScale, {
                toValue: 0.9,
                duration: 350,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            setModalVisible(false);
            setNewTask({
                title: "",
                description: "",
                category: "other",
                priority: "medium",
                reminder: false,
                tag: "Inbox",
                dueDate: null,
                dueTime: null,
            });
            setShowPriorityOptions(false);
            setShowInboxOptions(false);
            setShowDateTimeOptions(false);
            
            // Reset animations
            slideAnim.setValue(screenHeight);
            modalScale.setValue(0.9);
            prioritySlideAnim.setValue(-100);
            priorityOpacity.setValue(0);
            inboxSlideAnim.setValue(-100);
            inboxOpacity.setValue(0);
            dateTimeSlideAnim.setValue(-100);
            dateTimeOpacity.setValue(0);
        });
    };

    /**
     * Enhanced priority toggle with smooth animations
     */
    const handlePriorityToggle = () => {
        if (showInboxOptions) {
            handleInboxToggle();
        }

        if (showPriorityOptions) {
            // Close priority dropdown
            Animated.parallel([
                Animated.timing(priorityOpacity, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(prioritySlideAnim, {
                    toValue: -100,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowPriorityOptions(false);
            });
        } else {
            // Open priority dropdown
            setShowPriorityOptions(true);
            Animated.parallel([
                Animated.timing(priorityOpacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(prioritySlideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.back(1.1)),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    /**
     * Enhanced inbox toggle with smooth animations
     */
    const handleInboxToggle = () => {
        if (showPriorityOptions) {
            handlePriorityToggle();
        }

        if (showInboxOptions) {
            // Close inbox dropdown
            Animated.parallel([
                Animated.timing(inboxOpacity, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(inboxSlideAnim, {
                    toValue: -100,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowInboxOptions(false);
            });
        } else {
            // Open inbox dropdown
            setShowInboxOptions(true);
            Animated.parallel([
                Animated.timing(inboxOpacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(inboxSlideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.back(1.1)),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    /**
     * Handle priority selection with haptic feedback
     */
    const handlePrioritySelect = (priority) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        setNewTask({
            ...newTask,
            priority: priority.value,
        });
        handlePriorityToggle();
    };

    /**
     * Handle reminder toggle
     */
    const handleReminderToggle = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        setNewTask({
            ...newTask,
            reminder: !newTask.reminder,
        });
    };

    /**
     * Handle inbox selection with haptic feedback
     */
    const handleInboxSelect = (inbox) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        setNewTask({
            ...newTask,
            tag: inbox.value,
        });
        handleInboxToggle();
    };

    /**
     * Enhanced datetime toggle with smooth animations
     */
    const handleDateTimeToggle = () => {
        if (showPriorityOptions) {
            handlePriorityToggle();
        }
        if (showInboxOptions) {
            handleInboxToggle();
        }

        if (showDateTimeOptions) {
            // Close datetime dropdown
            Animated.parallel([
                Animated.timing(dateTimeOpacity, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(dateTimeSlideAnim, {
                    toValue: -100,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowDateTimeOptions(false);
            });
        } else {
            // Open datetime dropdown
            setShowDateTimeOptions(true);
            Animated.parallel([
                Animated.timing(dateTimeOpacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(dateTimeSlideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.back(1.1)),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    /**
     * Handle datetime selection with haptic feedback
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
            setNewTask({
                ...newTask,
                dueDate: selectedDate.toISOString().split('T')[0],
                dueTime: selectedDate.toTimeString().split(' ')[0].substring(0, 5),
            });
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
                    // After selecting date, show time picker
                    setTimeout(() => {
                        setDatePickerMode('time');
                        setShowDateTimePicker(true);
                    }, 100);
                } else {
                    // Time selected, save both date and time
                    const finalDate = new Date(selectedDate);
                    finalDate.setHours(date.getHours());
                    finalDate.setMinutes(date.getMinutes());
                    
                    setNewTask({
                        ...newTask,
                        dueDate: finalDate.toISOString().split('T')[0],
                        dueTime: finalDate.toTimeString().split(' ')[0].substring(0, 5),
                    });
                }
            }
        } else {
            // iOS - update temp date
            if (date) {
                setTempDate(date);
            }
        }
    };

    /**
     * Handle iOS date picker confirm
     */
    const handleDatePickerConfirm = () => {
        setNewTask({
            ...newTask,
            dueDate: tempDate.toISOString().split('T')[0],
            dueTime: tempDate.toTimeString().split(' ')[0].substring(0, 5),
        });
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
     * Get formatted datetime display
     */
    const getDateTimeDisplay = () => {
        if (!newTask.dueDate) return "Set Date & Time";
        
        const date = new Date(newTask.dueDate + 'T' + (newTask.dueTime || '00:00'));
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return `Today ${newTask.dueTime || ''}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow ${newTask.dueTime || ''}`;
        } else {
            return `${date.toLocaleDateString()} ${newTask.dueTime || ''}`;
        }
    };

    /**
     * Clear datetime
     */
    const clearDateTime = () => {
        setNewTask({
            ...newTask,
            dueDate: null,
            dueTime: null,
        });
    };

    /**
     * Handle input focus animation
     */
    const handleInputFocus = () => {
        Animated.timing(inputFocusAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    /**
     * Handle input blur animation
     */
    const handleInputBlur = () => {
        Animated.timing(inputFocusAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    /**
     * Get current priority option
     */
    const getCurrentPriority = () => {
        return priorityOptions.find(p => p.value === newTask.priority) || priorityOptions[1];
    };

    /**
     * Get current inbox option
     */
    const getCurrentInbox = () => {
        return inboxOptions.find(i => i.value === newTask.tag) || inboxOptions[0];
    };

    /**
     * Enhanced save task function with validation and animations
     */
    const saveTask = async () => {
        if (!newTask.title.trim()) {
            Alert.alert('Error', 'Please enter a task title');
            return;
        }

        try {
            const taskToSave = {
                id: generateId(),
                title: newTask.title.trim(),
                description: newTask.description,
                category: newTask.category,
                priority: newTask.priority,
                reminder: newTask.reminder,
                tag: newTask.tag,
                dueDate: newTask.dueDate,
                dueTime: newTask.dueTime,
                is_completed: false,
                timestamp: new Date().toISOString(),
            };

            dispatch(addTask(taskToSave));
            
            const existingTasks = await getDataLocalStorage('task_list') || [];
            const updatedTasks = [...existingTasks, taskToSave];
            await storeDataLocalStorage('task_list', updatedTasks);

            // Haptic feedback for success
            if (Platform.OS === 'ios') {
                Vibration.vibrate([10, 50, 10]);
            }

            closeModal();
        } catch (error) {
            console.error('Error saving task:', error);
            Alert.alert('Error', 'Failed to save task. Please try again.');
        }
    };

    // Animated input border color
    const inputBorderColor = inputFocusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary],
    });

    // Add button rotation
    const addButtonRotationInterpolate = addButtonRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.container}>
            {/* Enhanced Add Button */}
            <Animated.View
                style={[
                    styles.addButtonContainer,
                    {
                        transform: [
                            { scale: addButtonScale },
                            { rotate: addButtonRotationInterpolate },
                        ],
                    },
                ]}>
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={handleAddPress}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={24} color={colors.white} />
                </TouchableOpacity>
            </Animated.View>

            {/* Enhanced Add Task Modal */}
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
                statusBarTranslucent={true}
            >
                <Animated.View 
                    style={[
                        styles.modalOverlay,
                        { opacity: overlayOpacity }
                    ]}
                >
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={styles.modalOverlayTouch} />
                    </TouchableWithoutFeedback>
                    
                    <Animated.View
                        style={[
                            styles.modalView,
                            {
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: modalScale },
                                ],
                            },
                        ]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHandle} />
                        </View>

                        <Animated.View 
                            style={[
                                styles.inputContainer,
                                { borderColor: inputBorderColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.checkboxInner,
                                    { borderColor: colors.success },
                                ]}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Task name"
                                placeholderTextColor={colors.textTertiary}
                                value={newTask.title}
                                onChangeText={(text) =>
                                    setNewTask({
                                        ...newTask,
                                        title: text,
                                    })
                                }
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                            />
                        </Animated.View>

                        <View style={styles.modalOptions}>
                            {/* Priority Option */}
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    newTask.priority !== "medium" &&
                                        styles.optionButtonActive,
                                ]}
                                onPress={handlePriorityToggle}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={getCurrentPriority().icon}
                                    size={16}
                                    color={
                                        newTask.priority !== "medium"
                                            ? getCurrentPriority().color
                                            : colors.textSecondary
                                    }
                                />
                                <Text
                                    style={[
                                        styles.optionText,
                                        newTask.priority !== "medium" &&
                                            styles.optionTextActive,
                                    ]}>
                                    Priority
                                </Text>
                            </TouchableOpacity>

                            {/* DateTime Option */}
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    newTask.dueDate &&
                                        styles.optionButtonActive,
                                ]}
                                onPress={handleDateTimeToggle}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={newTask.dueDate ? "calendar" : "calendar-outline"}
                                    size={16}
                                    color={
                                        newTask.dueDate
                                            ? colors.primary
                                            : colors.textSecondary
                                    }
                                />
                                <Text
                                    style={[
                                        styles.optionText,
                                        newTask.dueDate &&
                                            styles.optionTextActive,
                                    ]}>
                                    Date
                                </Text>
                            </TouchableOpacity>

                            {/* Reminders Option */}
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    newTask.reminder &&
                                        styles.optionButtonActive,
                                ]}
                                onPress={handleReminderToggle}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={
                                        newTask.reminder
                                            ? "notifications"
                                            : "notifications-outline"
                                    }
                                    size={16}
                                    color={
                                        newTask.reminder
                                            ? colors.warning
                                            : colors.textSecondary
                                    }
                                />
                                <Text
                                    style={[
                                        styles.optionText,
                                        newTask.reminder &&
                                            styles.optionTextActive,
                                    ]}>
                                    Reminders
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Enhanced DateTime Options Dropdown */}
                        {showDateTimeOptions && (
                            <Animated.View
                                style={[
                                    styles.dateTimeDropdown,
                                    {
                                        opacity: dateTimeOpacity,
                                        transform: [
                                            { translateY: dateTimeSlideAnim },
                                        ],
                                    },
                                ]}>
                                <ScrollView
                                    style={styles.dateTimeScrollView}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                >
                                    {dateTimeOptions.map(
                                        (dateTimeOption, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.dateTimeOption,
                                                ]}
                                                onPress={() =>
                                                    handleDateTimeSelect(
                                                        dateTimeOption,
                                                    )
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <View style={[
                                                    styles.dateTimeIconContainer,
                                                    { backgroundColor: dateTimeOption.color + '20' }
                                                ]}>
                                                    <Ionicons
                                                        name={dateTimeOption.icon}
                                                        size={18}
                                                        color={dateTimeOption.color}
                                                    />
                                                </View>
                                                <Text
                                                    style={[
                                                        styles.dateTimeOptionText,
                                                    ]}>
                                                    {dateTimeOption.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ),
                                    )}
                                </ScrollView>
                            </Animated.View>
                        )}

                        {/* DateTime Display */}
                        {newTask.dueDate && (
                            <View style={styles.dateTimeDisplay}>
                                <View style={styles.dateTimeInfo}>
                                    <Ionicons
                                        name="calendar"
                                        size={16}
                                        color={colors.primary}
                                    />
                                    <Text style={styles.dateTimeText}>
                                        {getDateTimeDisplay()}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={clearDateTime}
                                    style={styles.clearDateTimeButton}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={20}
                                        color={colors.textTertiary}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Enhanced Priority Options Dropdown */}
                        {showPriorityOptions && (
                            <Animated.View
                                style={[
                                    styles.priorityDropdown,
                                    {
                                        opacity: priorityOpacity,
                                        transform: [
                                            { translateY: prioritySlideAnim },
                                        ],
                                    },
                                ]}>
                                <ScrollView
                                    style={styles.priorityScrollView}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                >
                                    {priorityOptions.map(
                                        (priority, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.priorityOption,
                                                    newTask.priority ===
                                                        priority.value &&
                                                        styles.priorityOptionSelected,
                                                ]}
                                                onPress={() =>
                                                    handlePrioritySelect(
                                                        priority,
                                                    )
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <View style={[
                                                    styles.priorityIconContainer,
                                                    { backgroundColor: priority.color + '20' }
                                                ]}>
                                                    <Ionicons
                                                        name={priority.icon}
                                                        size={18}
                                                        color={priority.color}
                                                    />
                                                </View>
                                                <Text
                                                    style={[
                                                        styles.priorityOptionText,
                                                        newTask.priority ===
                                                            priority.value &&
                                                            styles.priorityOptionTextSelected,
                                                    ]}>
                                                    {priority.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ),
                                    )}
                                </ScrollView>
                            </Animated.View>
                        )}

                        {/* Enhanced Inbox/Category Selector */}
                        <TouchableOpacity
                            style={[
                                styles.inboxSelector,
                                newTask.tag !== "Inbox" &&
                                    styles.inboxSelectorActive,
                            ]}
                            onPress={handleInboxToggle}
                            activeOpacity={0.8}
                        >
                            <View style={[
                                styles.inboxIconContainer,
                                { backgroundColor: getCurrentInbox().color + '20' }
                            ]}>
                                <Ionicons
                                    name={getCurrentInbox().icon}
                                    size={16}
                                    color={getCurrentInbox().color}
                                />
                            </View>
                            <Text style={styles.inboxSelectorText}>
                                {getCurrentInbox().label}
                            </Text>
                            <Ionicons
                                name={
                                    showInboxOptions
                                        ? "chevron-up"
                                        : "chevron-down"
                                }
                                size={16}
                                color={colors.textTertiary}
                            />
                        </TouchableOpacity>

                        {/* Enhanced Inbox Options Dropdown */}
                        {showInboxOptions && (
                            <Animated.View
                                style={[
                                    styles.inboxDropdown,
                                    {
                                        opacity: inboxOpacity,
                                        transform: [
                                            { translateY: inboxSlideAnim },
                                        ],
                                    },
                                ]}>
                                <ScrollView
                                    style={styles.inboxScrollView}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                >
                                    {inboxOptions.map(
                                        (inbox, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.inboxOption,
                                                    newTask.tag ===
                                                        inbox.value &&
                                                        styles.inboxOptionSelected,
                                                ]}
                                                onPress={() =>
                                                    handleInboxSelect(
                                                        inbox,
                                                    )
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <View style={[
                                                    styles.inboxOptionIconContainer,
                                                    { backgroundColor: inbox.color + '20' }
                                                ]}>
                                                    <Ionicons
                                                        name={inbox.icon}
                                                        size={18}
                                                        color={inbox.color}
                                                    />
                                                </View>
                                                <Text
                                                    style={[
                                                        styles.inboxOptionText,
                                                        newTask.tag ===
                                                            inbox.value &&
                                                            styles.inboxOptionTextSelected,
                                                    ]}>
                                                    {inbox.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ),
                                    )}
                                </ScrollView>
                            </Animated.View>
                        )}

                        {/* Enhanced Send Button */}
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={saveTask}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="send"
                                size={18}
                                color={colors.white}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </Modal>

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: colors.background,
    },
    checkboxInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 30,
        right: 20,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    // Enhanced Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalOverlayTouch: {
        flex: 1,
    },
    modalView: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
        minHeight: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
    },
    modalHeader: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.textTertiary,
        borderRadius: 2,
        opacity: 0.6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: colors.background,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.border,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        marginLeft: 12,
        fontWeight: '500',
    },
    modalOptions: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: colors.background,
        gap: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    optionButtonActive: {
        backgroundColor: colors.primary + '15',
        borderColor: colors.primary + '40',
    },
    optionText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    optionTextActive: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
    priorityDropdown: {
        backgroundColor: colors.background,
        borderRadius: 16,
        marginBottom: 20,
        maxHeight: 220,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    priorityScrollView: {
        maxHeight: 200,
    },
    priorityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    priorityOptionSelected: {
        backgroundColor: colors.primary + '15',
    },
    priorityIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    priorityOptionText: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    priorityOptionTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    inboxSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: colors.background,
        borderRadius: 16,
        marginBottom: 20,
        gap: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inboxSelectorActive: {
        backgroundColor: colors.primary + '15',
        borderColor: colors.primary + '40',
    },
    inboxSelectorText: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    inboxDropdown: {
        backgroundColor: colors.background,
        borderRadius: 16,
        marginBottom: 20,
        maxHeight: 220,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    inboxScrollView: {
        maxHeight: 200,
    },
    inboxOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    inboxOptionSelected: {
        backgroundColor: colors.primary + '15',
    },
    inboxOptionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inboxOptionText: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    inboxOptionTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    sendButton: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    // DateTime styles
    dateTimeDropdown: {
        backgroundColor: colors.background,
        borderRadius: 16,
        marginBottom: 20,
        maxHeight: 220,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    dateTimeScrollView: {
        maxHeight: 200,
    },
    dateTimeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    dateTimeIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateTimeOptionText: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    dateTimeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.primary + '15',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    dateTimeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateTimeText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    clearDateTimeButton: {
        padding: 4,
    },
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    datePickerButtonText: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    datePickerContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
});

export default AddTaskButton;
