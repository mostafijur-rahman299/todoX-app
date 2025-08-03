import { useRef, useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    Alert,
    Platform,
    Vibration,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Easing,
} from 'react-native';
import { colors } from '@/constants/Colors';

// Import component modules
import TaskDetailHeader from './TaskDetailHeader';
import TaskForm from './TaskForm';
import CompactSelectors from './CompactSelectors';
import SubTasksSection from './SubTasksSection';
import DeleteButton from './DeleteButton';

const { height: screenHeight } = Dimensions.get('window');

const TaskDetailModal = ({ 
    visible, 
    onClose, 
    task, 
    onUpdateTask,
    onDeleteTask,
    onAddSubTask 
}) => {
    // Enhanced animation refs to match AddTaskModal
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.9)).current;
    const inputFocusAnim = useRef(new Animated.Value(0)).current;
    
    // State management
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({});
    const [subTasks, setSubTasks] = useState([]);
    const [showAddSubTask, setShowAddSubTask] = useState(false);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

    // Initialize edited task when task changes
    useEffect(() => {
        if (task) {
            setEditedTask({
                ...task,
                title: task.title || '',
                summary: task.summary || '',
                priority: task.priority || 'medium',
                category: task.category || 'Personal',
                date: task.date || null,
                startTime: task.startTime || null,
                endTime: task.endTime || null,
            });
            setSubTasks(task.subTasks || []);
        }
    }, [task]);

    // Enhanced animation effects to match AddTaskModal
    useEffect(() => {
        if (visible) {
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
     * Enhanced modal close with smooth animations to match AddTaskModal
     */
    const closeModal = () => {
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
            setIsEditing(false);
            setShowAddSubTask(false);
            setNewSubTaskTitle('');
            onClose();
            
            // Reset animations
            slideAnim.setValue(screenHeight);
            modalScale.setValue(0.9);
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
     * Save changes to the task with haptic feedback
     */
    const handleSaveChanges = () => {
        if (onUpdateTask && editedTask.title.trim()) {
            const updatedTask = {
                ...editedTask,
                subTasks: subTasks
            };
            onUpdateTask(updatedTask);
            setIsEditing(false);
            
            // Haptic feedback for success
            if (Platform.OS === 'ios') {
                Vibration.vibrate([10, 50, 10]);
            }
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
            summary: task.description || '',
            priority: task.priority || 'medium',
            category: task.category || 'Personal',
            date: task.date || null,
            startTime: task.startTime || null,
            endTime: task.endTime || null,
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
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={handleClose}>
                    <Animated.View 
                        style={[
                            styles.overlay,
                            { opacity: overlayOpacity }
                        ]}
                    >
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
                                <TaskDetailHeader
                                    isEditing={isEditing}
                                    onClose={handleClose}
                                    onToggleEdit={toggleEditMode}
                                    onSaveChanges={handleSaveChanges}
                                    onCancelEdit={handleCancelEdit}
                                />

                                {/* Task Content */}
                                <ScrollView 
                                    style={styles.modalContent}
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    {/* Compact Task Form */}
                                    <TaskForm
                                        task={editedTask}
                                        isEditing={isEditing}
                                        inputFocusAnim={inputFocusAnim}
                                        onInputFocus={handleInputFocus}
                                        onInputBlur={handleInputBlur}
                                        onToggleCompletion={toggleTaskCompletion}
                                        onUpdateTitle={(text) => updateTaskField('title', text)}
                                        onUpdateDescription={(text) => updateTaskField('description', text)}
                                    />

                                    {/* Compact Selectors Row */}
                                    <CompactSelectors
                                        task={editedTask}
                                        isEditing={isEditing}
                                        onUpdateTask={setEditedTask}
                                    />

                                    {/* Sub-tasks Section */}
                                    <SubTasksSection
                                        subTasks={subTasks}
                                        isEditing={isEditing}
                                        showAddSubTask={showAddSubTask}
                                        newSubTaskTitle={newSubTaskTitle}
                                        onToggleSubTaskCompletion={toggleSubTaskCompletion}
                                        onDeleteSubTask={deleteSubTask}
                                        onShowAddSubTask={() => setShowAddSubTask(true)}
                                        onHideAddSubTask={() => {
                                            setShowAddSubTask(false);
                                            setNewSubTaskTitle('');
                                        }}
                                        onUpdateNewSubTaskTitle={setNewSubTaskTitle}
                                        onAddSubTask={handleAddSubTask}
                                    />

                                    {/* Delete Button */}
                                    {isEditing && (
                                        <DeleteButton onDelete={handleDeleteTask} />
                                    )}
                                </ScrollView>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
        maxHeight: screenHeight * 0.75, // Compact height like AddTaskModal
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    modalContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
});

export default TaskDetailModal;