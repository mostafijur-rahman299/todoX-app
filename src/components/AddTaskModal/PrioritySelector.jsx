import React, { useRef, useEffect } from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    Platform,
    Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { priorityOptions } from '@/constants/GeneralData';

/**
 * PrioritySelector component - Dropdown selector for task priority
 * Displays priority options with smooth animations and haptic feedback
 */
const PrioritySelector = ({ currentPriority, showOptions, onToggle, onSelect }) => {
    const prioritySlideAnim = useRef(new Animated.Value(-100)).current;
    const priorityOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showOptions) {
            // Open priority modal
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
            // Close priority modal
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
            ]).start();
        }
    }, [showOptions]);

    /**
     * Get current priority option
     */
    const getCurrentPriority = () => {
        return priorityOptions.find(p => p.value === currentPriority) || priorityOptions[1];
    };

    /**
     * Handle priority selection with haptic feedback
     */
    const handlePrioritySelect = (priority) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        onSelect(priority);
    };

    const currentPriorityOption = getCurrentPriority();

    return (
        <View style={styles.container}>
            {/* Priority Selector Button */}
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <View style={styles.selectorContent}>
                    <View style={styles.selectorLeft}>
                        <Ionicons 
                            name="flag-outline" 
                            size={20} 
                            color={currentPriorityOption.color} 
                        />
                        <Text style={styles.selectorLabel}>Priority</Text>
                    </View>
                    <View style={styles.selectorRight}>
                        <View style={[styles.priorityIndicator, { backgroundColor: currentPriorityOption.color }]} />
                        <Text style={[styles.selectorValue, { color: currentPriorityOption.color }]}>
                            {currentPriorityOption.label}
                        </Text>
                        <Ionicons 
                            name={showOptions ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color={colors.textSecondary} 
                        />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Priority Options Dropdown */}
            {showOptions && (
                <Animated.View
                    style={[
                        styles.optionsContainer,
                        {
                            opacity: priorityOpacity,
                            transform: [{ translateY: prioritySlideAnim }]
                        }
                    ]}
                >
                    {priorityOptions.map((priority, index) => (
                        <TouchableOpacity
                            key={priority.value}
                            style={[
                                styles.optionItem,
                                index === priorityOptions.length - 1 && styles.lastOptionItem,
                                currentPriority === priority.value && styles.selectedOption
                            ]}
                            onPress={() => handlePrioritySelect(priority)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.optionContent}>
                                <View style={styles.optionLeft}>
                                    <View style={[styles.priorityIndicator, { backgroundColor: priority.color }]} />
                                    <Text style={[styles.optionText, { color: priority.color }]}>
                                        {priority.label}
                                    </Text>
                                </View>
                                {currentPriority === priority.value && (
                                    <Ionicons 
                                        name="checkmark" 
                                        size={20} 
                                        color={priority.color} 
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    selectorButton: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    selectorContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    selectorLabel: {
        fontSize: 16,
        color: colors.text,
        marginLeft: 12,
        fontWeight: '500',
    },
    selectorRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectorValue: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        marginRight: 8,
    },
    priorityIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    optionsContainer: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: 8,
        overflow: 'hidden',
    },
    optionItem: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    lastOptionItem: {
        borderBottomWidth: 0,
    },
    selectedOption: {
        backgroundColor: colors.primaryLight,
    },
    optionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
});

export default PrioritySelector;