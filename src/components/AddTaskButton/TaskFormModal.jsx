import React, { useRef, useEffect } from 'react';
import { 
    View, 
    Modal,
    StyleSheet,
    Animated,
    Easing,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { generateId } from '@/utils/gnFunc';
import useTasks from '../../hooks/useTasks';

import TaskInputField from './TaskInputField';
import TaskOptionsBar from './TaskOptionsBar';
import CategorySelector from './CategorySelector';
import PrioritySelector from './PrioritySelector';
import DateTimeSelector from './DateTimeSelector';
import { useSelector } from 'react-redux';

const { height: screenHeight } = Dimensions.get('window');

/**
 * Main task form modal component
 * Contains all form elements and handles task creation
 */
const TaskFormModal = ({ visible, onClose, task, onUpdateTask, dispatch }) => {
    // Animation refs
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.9)).current;
    const inputFocusAnim = useRef(new Animated.Value(0)).current;

    // Selector states
    const [showPriorityOptions, setShowPriorityOptions] = React.useState(false);
    const [showInboxOptions, setShowInboxOptions] = React.useState(false);
    const [showDateTimeOptions, setShowDateTimeOptions] = React.useState(false);
    const { addTask } = useTasks();

    /**
     * Handle modal entrance animation
     */
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
                Animated.spring(slideAnim, {
                toValue: 0,
                tension: 120,
                friction: 9,
                useNativeDriver: true,
            }),
            Animated.spring(modalScale, {
                toValue: 1,
                tension: 120,
                friction: 9,
                useNativeDriver: true,
            }),
            ]).start();
        }
    }, [visible]);

    /**
     * Handle modal close with animations
     */
    const handleClose = () => {
        // Close all dropdowns first
        setShowPriorityOptions(false);
        setShowInboxOptions(false);
        setShowDateTimeOptions(false);

        // Enhanced modal exit animation
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 280,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(modalScale, {
                toValue: 0.95,
                duration: 280,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
            // Reset animations
            slideAnim.setValue(screenHeight);
            modalScale.setValue(0.95);
            inputFocusAnim.setValue(0);
        });
    };

    /**
     * Handle input focus animation
     */
    const handleInputFocus = () => {
        Animated.timing(inputFocusAnim, {
            toValue: 1,
            duration: 150,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    };

    /**
     * Handle input blur animation
     */
    const handleInputBlur = () => {
        Animated.timing(inputFocusAnim, {
            toValue: 0,
            duration: 150,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    };

    /**
     * Save task with validation
     */
    const saveTask = async () => {
    if (!task.title.trim()) {
        Alert.alert('Error', 'Please enter a task title');
        return;
    }

    try {

        const taskToSave = {
            id: generateId(),
            title: task.title.trim(),
            summary: task.summary || "",
            category: task.category || "Inbox",
            priority: task.priority || "medium",
            reminder: task.reminder || false,
            date: task.date,
            startTime: task.startTime,
            endTime: task.endTime,
            subTask: task.subTask || [],
        };

        await addTask(taskToSave);
        handleClose();
    } catch (error) {
        Alert.alert('Error', 'Failed to save task. Please try again.');
    }
};


    // Animated input border color
    const inputBorderColor = inputFocusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary],
    });

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
            statusBarTranslucent={true}
        >
            <Animated.View 
                style={[
                    styles.modalOverlay,
                    { opacity: overlayOpacity }
                ]}
            >
                <TouchableWithoutFeedback onPress={handleClose}>
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

                    <TaskInputField
                        task={task}
                        onUpdateTask={onUpdateTask}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        borderColor={inputBorderColor}
                    />

                    <TaskOptionsBar
                        task={task}
                        onUpdateTask={onUpdateTask}
                        onPriorityPress={() => setShowPriorityOptions(true)}
                        onDateTimePress={() => setShowDateTimeOptions(true)}
                        onCategoryPress={() => setShowInboxOptions(true)}
                    />

                    <CategorySelector
                        visible={showInboxOptions}
                        onClose={() => setShowInboxOptions(false)}
                        task={task}
                        onUpdateTask={onUpdateTask}
                    />

                    <PrioritySelector
                        visible={showPriorityOptions}
                        onClose={() => setShowPriorityOptions(false)}
                        task={task}
                        onUpdateTask={onUpdateTask}
                    />

                    <DateTimeSelector
                        visible={showDateTimeOptions}
                        onClose={() => setShowDateTimeOptions(false)}
                        task={task}
                        onUpdateTask={onUpdateTask}
                    />

                    {/* Send Button */}
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={saveTask}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="send"
                            size={12}
                            color={colors.white}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        paddingHorizontal: 12,
        paddingBottom: 24,
        minHeight: 210,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
    },
    modalHeader: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    modalHandle: {
        width: 32,
        height: 3,
        backgroundColor: colors.textTertiary,
        borderRadius: 2,
        opacity: 0.6,
    },
    sendButton: {
        position: 'absolute',
        bottom: 14,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
});

export default TaskFormModal;