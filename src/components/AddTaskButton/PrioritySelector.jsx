import React, { useRef, useEffect } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    TouchableOpacity, 
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
    Animated,
    Easing,
    Platform,
    Vibration,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { priorityOptions } from '@/constants/GeneralData';

const { height: screenHeight } = Dimensions.get('window');

/**
 * Priority selector modal component
 * Allows users to select task priority with smooth animations
 */
const PrioritySelector = ({ visible, onClose, task, onUpdateTask }) => {
    const prioritySlideAnim = useRef(new Animated.Value(-100)).current;
    const priorityOpacity = useRef(new Animated.Value(0)).current;

    /**
     * Handle priority selection with haptic feedback
     */
    const handlePrioritySelect = (priority) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        onUpdateTask({ priority: priority.value });
        handleClose();
    };

    /**
     * Handle modal close with animation
     */
    const handleClose = () => {
        Animated.parallel([
            Animated.timing(priorityOpacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(prioritySlideAnim, {
                toValue: 100,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    /**
     * Handle modal open animation
     */
    useEffect(() => {
        if (visible) {
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
        } else {
            // Reset animation values when not visible
            prioritySlideAnim.setValue(-100);
            priorityOpacity.setValue(0);
        }
    }, [visible]);

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={handleClose}
            statusBarTranslucent={true}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.selectionModalOverlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.selectionModal,
                                {
                                    opacity: priorityOpacity,
                                    transform: [
                                        { translateY: prioritySlideAnim },
                                    ],
                                },
                            ]}>
                            <View style={styles.selectionModalHeader}>
                                <Text style={styles.selectionModalTitle}>Select Priority</Text>
                                <TouchableOpacity 
                                    onPress={handleClose}
                                    style={styles.selectionModalCloseBtn}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={22} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView
                                style={styles.selectionScrollView}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                contentContainerStyle={{ paddingBottom: 12 }}
                            >
                                {priorityOptions.map((priority, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.selectionOption,
                                            task.priority === priority.value && styles.selectionOptionSelected,
                                        ]}
                                        onPress={() => handlePrioritySelect(priority)}
                                        activeOpacity={0.7}
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
                                        {task.priority === priority.value && (
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
    );
};

const styles = StyleSheet.create({
    selectionModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    selectionModal: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        maxHeight: screenHeight * 0.7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
    },
    selectionModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        padding: 8,
        borderRadius: 12,
        backgroundColor: colors.background,
    },
    selectionScrollView: {
        maxHeight: screenHeight * 0.5,
        paddingVertical: 8,
    },
    selectionOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '20',
    },
    selectionOptionSelected: {
        backgroundColor: colors.primary + '10',
    },
    selectionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectionOptionText: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    selectionCheckmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PrioritySelector;