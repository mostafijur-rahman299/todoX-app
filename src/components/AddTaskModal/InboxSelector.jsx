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
import { inboxOptions } from '@/constants/GeneralData';

/**
 * InboxSelector component - Dropdown selector for task inbox/category
 * Displays inbox options with smooth animations and haptic feedback
 */
const InboxSelector = ({ currentTag, showOptions, onToggle, onSelect }) => {
    const inboxSlideAnim = useRef(new Animated.Value(-100)).current;
    const inboxOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showOptions) {
            // Open inbox modal
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
        } else {
            // Close inbox modal
            Animated.parallel([
                Animated.timing(inboxOpacity, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(inboxSlideAnim, {
                    toValue: 100,
                    duration: 200,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showOptions]);

    /**
     * Get current inbox option
     */
    const getCurrentInbox = () => {
        return inboxOptions.find(i => i.value === currentTag) || inboxOptions[0];
    };

    /**
     * Handle inbox selection with haptic feedback
     */
    const handleInboxSelect = (inbox) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        onSelect(inbox);
    };

    const currentInboxOption = getCurrentInbox();

    return (
        <View style={styles.container}>
            {/* Inbox Selector Button */}
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <View style={styles.selectorContent}>
                    <View style={styles.selectorLeft}>
                        <Ionicons 
                            name={currentInboxOption.icon} 
                            size={20} 
                            color={currentInboxOption.color} 
                        />
                        <Text style={styles.selectorLabel}>Inbox</Text>
                    </View>
                    <View style={styles.selectorRight}>
                        <Text style={[styles.selectorValue, { color: currentInboxOption.color }]}>
                            {currentInboxOption.label}
                        </Text>
                        <Ionicons 
                            name={showOptions ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color={colors.textSecondary} 
                        />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Inbox Options Dropdown */}
            {showOptions && (
                <Animated.View
                    style={[
                        styles.optionsContainer,
                        {
                            opacity: inboxOpacity,
                            transform: [{ translateY: inboxSlideAnim }]
                        }
                    ]}
                >
                    {inboxOptions.map((inbox, index) => (
                        <TouchableOpacity
                            key={inbox.value}
                            style={[
                                styles.optionItem,
                                index === inboxOptions.length - 1 && styles.lastOptionItem,
                                currentTag === inbox.value && styles.selectedOption
                            ]}
                            onPress={() => handleInboxSelect(inbox)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.optionContent}>
                                <View style={styles.optionLeft}>
                                    <Ionicons 
                                        name={inbox.icon} 
                                        size={20} 
                                        color={inbox.color} 
                                    />
                                    <Text style={[styles.optionText, { color: inbox.color }]}>
                                        {inbox.label}
                                    </Text>
                                </View>
                                {currentTag === inbox.value && (
                                    <Ionicons 
                                        name="checkmark" 
                                        size={20} 
                                        color={inbox.color} 
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
        marginRight: 8,
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

export default InboxSelector;