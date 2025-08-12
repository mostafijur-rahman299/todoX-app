import React, { useEffect, useRef } from 'react';
import { 
    View, 
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
    Animated,
    Easing
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

const TaskFormModal = ({ visible, onClose, task, onUpdateTask }) => {
    // Animation refs for smooth modal transitions
    const slideAnim = useRef(new Animated.Value(400)).current; // Start below screen
    const fadeAnim = useRef(new Animated.Value(0)).current; // Start transparent
    const scaleAnim = useRef(new Animated.Value(0.95)).current; // Start slightly smaller
    const contentOpacity = useRef(new Animated.Value(0)).current; // Content fade-in

    // Selector states
    const [showPriorityOptions, setShowPriorityOptions] = React.useState(false);
    const [showInboxOptions, setShowInboxOptions] = React.useState(false);
    const [showDateTimeOptions, setShowDateTimeOptions] = React.useState(false);
    const { addTask } = useTasks();

    /**
     * Animate modal entrance when visible changes
     */
    useEffect(() => {
        if (visible) {
            // Reset animations to initial state - modal starts below screen
            slideAnim.setValue(400);
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.95);
            contentOpacity.setValue(0);

            // Animate modal entrance with fast slide from bottom
            Animated.parallel([
                // Fade in overlay quickly
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                // Slide up modal quickly from bottom
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 250,
                    easing: Easing.out(Easing.bezier(0.25, 0.46, 0.45, 0.94)), // Smooth cubic-bezier
                    useNativeDriver: true,
                }),
                // Subtle scale up modal quickly
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Fade in content quickly after modal is positioned
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 150,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }).start();
            });
        }
    }, [visible]);

    /**
     * Handle modal close with smooth exit animations
     */
    const handleClose = () => {
        // Close all dropdowns first
        setShowPriorityOptions(false);
        setShowInboxOptions(false);
        setShowDateTimeOptions(false);

        // Animate modal exit with fast slide to bottom
        Animated.parallel([
            // Fade out overlay quickly
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            // Slide down modal quickly to bottom
            Animated.timing(slideAnim, {
                toValue: 400,
                duration: 200,
                easing: Easing.in(Easing.bezier(0.55, 0.06, 0.68, 0.19)), // Smooth cubic-bezier for exit
                useNativeDriver: true,
            }),
            // Scale down modal subtly and quickly
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            // Fade out content very quickly
            Animated.timing(contentOpacity, {
                toValue: 0,
                duration: 100,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    /**
     * Handle input focus - no animation to avoid interference
     */
    const handleInputFocus = () => {
        // No animation to keep slide animation smooth
    };

    /**
     * Handle input blur - no animation to avoid interference
     */
    const handleInputBlur = () => {
        // No animation to keep slide animation smooth
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
                    {
                        opacity: fadeAnim,
                    }
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
                                { scale: scaleAnim }
                            ],
                        }
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHandle} />
                    </View>

                    <Animated.View 
                        style={[
                            styles.modalContent,
                            {
                                opacity: contentOpacity,
                            }
                        ]}
                    >
                        <TaskInputField
                            task={task}
                            onUpdateTask={onUpdateTask}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
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
                    </Animated.View>

                    {/* Send Button with bounce animation */}
                    <Animated.View
                        style={[
                            styles.sendButtonContainer,
                            {
                                opacity: contentOpacity,
                                transform: [
                                    {
                                        scale: contentOpacity.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.5, 1],
                                        })
                                    }
                                ]
                            }
                        ]}
                    >
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
    modalContent: {
        flex: 1,
    },
    sendButtonContainer: {
        position: 'absolute',
        bottom: 14,
        right: 12,
    },
    sendButton: {
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