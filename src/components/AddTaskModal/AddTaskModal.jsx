import { useEffect, useState, useRef } from 'react';
import { 
    View, 
    Text,
    TouchableOpacity, 
    StyleSheet,
    Alert,
    Modal,
    Animated,
    Easing,
    ScrollView,
    TouchableWithoutFeedback,
    Platform,
    Dimensions,
    Vibration,
    KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/store/Task/category';
import { addTask, setTasks } from '@/store/Task/task';
import { defaultCategories } from '@/constants/GeneralData';
import { colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '@/utils/gnFunc';
import { storeDataLocalStorage, getDataLocalStorage } from '@/utils/storage';

import TaskForm from './TaskForm';
import CompactSelectors from './CompactSelectors';
import CompactDateSelector from './CompactDateSelector';
import CustomAlert from '../UI/CustomAlert';

const { height: screenHeight } = Dimensions.get('window');

/**
 * AddTaskModal component - Compact modal for creating new tasks
 * Displays a compact form with inline selectors and date range
 */
const AddTaskModal = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.display_tasks);
    const categories = useSelector((state) => state.category.categories);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    
    const [newTask, setNewTask] = useState({
        id: "", // optional: for internal reference or React keys
        title: "",
        summary: "",
        category: "personal", // or: "work", "personal", etc.
        priority: "medium", // "low" | "medium" | "high"
        reminder: false,
        date: null, // e.g., "2025-08-01"
        start_time: null, // e.g., "14:00"
        end_time: null     // e.g., "14:30"
    });
    
    // Enhanced animation refs
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.9)).current;
    const inputFocusAnim = useRef(new Animated.Value(0)).current;

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

    useEffect(() => {
        if (visible) {
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
        }
    }, [visible]);

    /**
     * Enhanced modal close with smooth animations
     */
    const closeModal = () => {
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
            onClose();
            setNewTask({
                title: "",
                description: "",
                category: "other",
                priority: "medium",
                reminder: false,
                tag: "Inbox",
                startDate: null,
                endDate: null,
            });
            
            // Reset animations
            slideAnim.setValue(screenHeight);
            modalScale.setValue(0.9);
        });
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
     * Enhanced save task function with validation and animations
     */
    const saveTask = async () => {
        if (!newTask.title.trim()) {
            setAlertVisible(true);
            setAlertTitle('Error');
            setAlertMessage('Please enter a task title');
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
                startDate: newTask.startDate,
                endDate: newTask.endDate,
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

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={closeModal}
            statusBarTranslucent={true}
        >
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <Animated.View
                                style={[
                                    styles.modalContainer,
                                    {
                                        transform: [
                                            { translateY: slideAnim },
                                            { scale: modalScale }
                                        ]
                                    }
                                ]}
                            >
                                {/* Compact Modal Header */}
                                <View style={styles.modalHeader}>
                                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                        <Ionicons name="close" size={20} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                    <Text style={styles.modalTitle}>New Task</Text>
                                    <TouchableOpacity onPress={saveTask} style={styles.saveButton}>
                                        <Text style={styles.saveButtonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView 
                                    style={styles.modalContent} 
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    {/* Compact Task Form */}
                                    <TaskForm
                                        newTask={newTask}
                                        setNewTask={setNewTask}
                                        inputFocusAnim={inputFocusAnim}
                                        onInputFocus={handleInputFocus}
                                        onInputBlur={handleInputBlur}
                                    />

                                    {/* Compact Selectors Row */}
                                    <CompactSelectors
                                        newTask={newTask}
                                        setNewTask={setNewTask}
                                        onReminderToggle={handleReminderToggle}
                                    />

                                    {/* Compact Date Range Selector */}
                                    <CompactDateSelector
                                        newTask={newTask}
                                        setNewTask={setNewTask}
                                    />
                                </ScrollView>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onDismiss={() => setAlertVisible(false)}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: screenHeight * 0.75, // Made smaller
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16, // Reduced padding
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    closeButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 16, // Smaller font
        fontWeight: '600',
        color: colors.text,
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 14, // Smaller font
        fontWeight: '600',
    },
    modalContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
});

export default AddTaskModal;