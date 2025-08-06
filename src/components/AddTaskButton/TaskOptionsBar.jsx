import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Vibration, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { priorityOptions, categoryOptions } from '@/constants/GeneralData';
import PremiumModal from './PremiumModal';

/**
 * Task options bar component
 * Contains priority, date/time, category, and reminder toggle buttons in horizontal scrolling layout
 */
const TaskOptionsBar = ({ task, onUpdateTask, onPriorityPress, onDateTimePress, onCategoryPress }) => {
    const [showPremiumModal, setShowPremiumModal] = useState(false);


    /**
     * Get current priority option
     */
    const getCurrentPriority = () => {
        return priorityOptions.find(p => p.value === task.priority) || priorityOptions[1];
    };

    /**
     * Get current category option
     */
    const getCurrentCategory = () => {
        return categoryOptions.find(c => c.value === task.category) || categoryOptions[0];
    };

    /**
     * Format date for display
     */
    const formatDate = () => {
        if (!task.date) return 'Today';
        
        const date = new Date(task.date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    };

    /**
     * Handle reminder toggle - show premium modal for premium feature
     */
    const handleReminderToggle = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        // Show premium modal instead of toggling reminder
        setShowPremiumModal(true);
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modalOptions}
                style={styles.scrollView}
            >
                {/* Priority Option */}
                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        task.priority !== "" && styles.optionButtonActive,
                    ]}
                    onPress={onPriorityPress}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={getCurrentPriority().icon}
                        size={16}
                        color={
                            task.priority !== ""
                                ? getCurrentPriority().color
                                : colors.textSecondary
                        }
                    />
                    <Text
                        style={[
                            styles.optionText,
                            task.priority !== "" && styles.optionTextActive,
                        ]}>
                        {task.priority !== "" ? task.priority[0].toUpperCase() + task.priority.slice(1) : 'Priority'}
                    </Text>
                </TouchableOpacity>

                {/* DateTime Option */}
                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        styles.optionButtonActive, // Always active since we default to today
                    ]}
                    onPress={onDateTimePress}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="calendar"
                        size={16}
                        color={colors.primary}
                    />
                    <Text
                        style={[
                            styles.optionText,
                            styles.optionTextActive,
                        ]}>
                        {formatDate()}
                    </Text>
                </TouchableOpacity>

                {/* Category Option */}
                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        task.category !== "" && styles.optionButtonActive,
                    ]}
                    onPress={onCategoryPress}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={getCurrentCategory().icon}
                        size={16}
                        color={
                            task.category !== ""
                                ? getCurrentCategory().color
                                : colors.textSecondary
                        }
                    />
                    <Text
                        style={[
                            styles.optionText,
                            task.category !== "" && styles.optionTextActive,
                        ]}>
                        {task.category !== "" ? task.category[0].toUpperCase() + task.category.slice(1) : 'Category'}
                    </Text>
                </TouchableOpacity>

                {/* Reminders Option - Premium Feature */}
                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        styles.premiumButton,
                    ]}
                    onPress={handleReminderToggle}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="notifications-outline"
                        size={16}
                        color={colors.textSecondary}
                    />
                    <Text style={styles.optionText}>
                        Reminder
                    </Text>
                    <Ionicons
                        name="diamond"
                        size={12}
                        color={colors.warning}
                    />
                </TouchableOpacity>
            </ScrollView>
            
            {/* Premium Modal */}
            <PremiumModal
                visible={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 18,
    },
    scrollView: {
        flexGrow: 0,
    },
    modalOptions: {
        flexDirection: 'row',
        paddingHorizontal: 4,
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
        gap: 6,
        borderWidth: 1,
        borderColor: colors.border,
        minWidth: 75,
        justifyContent: 'center',
    },
    optionButtonActive: {
        backgroundColor: colors.primary + '15',
        borderColor: colors.primary + '40',
    },
    premiumButton: {
        backgroundColor: colors.warning + '10',
        borderColor: colors.warning + '30',
    },
    optionText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
        textAlign: 'center',
    },
    optionTextActive: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
});

export default TaskOptionsBar;