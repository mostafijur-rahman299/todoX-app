import React, { useState } from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Vibration,
    Modal,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { priorityOptions, categoryOptions } from '@/constants/GeneralData';

/**
 * CompactSelectors component - Compact one-line selectors for priority, inbox, and reminder
 * Displays all selectors in a single row to save space
 */
const CompactSelectors = ({ 
    newTask, 
    setNewTask, 
    onReminderToggle 
}) => {
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [showInboxModal, setShowInboxModal] = useState(false);

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
        return categoryOptions.find(i => i.value === newTask.category) || categoryOptions[0];
    };

    /**
     * Handle priority selection with haptic feedback
     */
    const handlePrioritySelect = (priority) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        setNewTask({ ...newTask, priority: priority.value });
        setShowPriorityModal(false);
    };

    /**
     * Handle inbox selection with haptic feedback
     */
    const handleInboxSelect = (inbox) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        setNewTask({ ...newTask, category: inbox.value });
        setShowInboxModal(false);
    };

    const currentPriority = getCurrentPriority();
    const currentInbox = getCurrentInbox();

    return (
        <View style={styles.container}>
            {/* Compact Selectors Row */}
            <View style={styles.selectorsRow}>
                {/* Priority Selector */}
                <TouchableOpacity
                    style={styles.compactSelector}
                    onPress={() => setShowPriorityModal(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name="flag-outline" 
                        size={16} 
                        color={currentPriority.color} 
                    />
                    <Text style={[styles.selectorText, { color: currentPriority.color }]}>
                        {currentPriority.value[0].toUpperCase() + currentPriority.value.slice(1)}
                    </Text>
                    <Ionicons 
                        name="chevron-down" 
                        size={14} 
                        color={colors.textSecondary} 
                    />
                </TouchableOpacity>

                {/* Inbox Selector */}
                <TouchableOpacity
                    style={styles.compactSelector}
                    onPress={() => setShowInboxModal(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={currentInbox.icon} 
                        size={16} 
                        color={currentInbox.color} 
                    />
                    <Text style={[styles.selectorText, { color: currentInbox.color }]}>
                        {currentInbox.label}
                    </Text>
                    <Ionicons 
                        name="chevron-down" 
                        size={14} 
                        color={colors.textSecondary} 
                    />
                </TouchableOpacity>

                {/* Reminder Toggle */}
                <TouchableOpacity
                    style={styles.reminderSelector}
                    onPress={onReminderToggle}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={newTask.reminder ? "notifications" : "notifications-outline"} 
                        size={16} 
                        color={newTask.reminder ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                        styles.selectorText, 
                        { color: newTask.reminder ? colors.primary : colors.textSecondary }
                    ]}>
                        Reminder
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Priority Modal */}
            <Modal
                visible={showPriorityModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPriorityModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowPriorityModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Priority</Text>
                                <ScrollView style={styles.optionsList}>
                                    {priorityOptions.map((priority) => (
                                        <TouchableOpacity
                                            key={priority.value}
                                            style={[
                                                styles.optionItem,
                                                newTask.priority === priority.value && styles.selectedOption
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
                                                {newTask.priority === priority.value && (
                                                    <Ionicons 
                                                        name="checkmark" 
                                                        size={20} 
                                                        color={priority.color} 
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Inbox Modal */}
            <Modal
                visible={showInboxModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowInboxModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowInboxModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Category</Text>
                                <ScrollView style={styles.optionsList}>
                                    {categoryOptions.map((inbox) => (
                                        <TouchableOpacity
                                            key={inbox.value}
                                            style={[
                                                styles.optionItem,
                                                newTask.category === inbox.value && styles.selectedOption
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
                                                {newTask.category === inbox.value && (
                                                    <Ionicons 
                                                        name="checkmark" 
                                                        size={20} 
                                                        color={inbox.color} 
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    selectorsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    compactSelector: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 10,
        paddingHorizontal: 8,
        gap: 4,
    },
    reminderSelector: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 10,
        paddingHorizontal: 8,
        gap: 4,
    },
    selectorText: {
        fontSize: 12,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 20,
        width: '80%',
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    optionsList: {
        maxHeight: 300,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 4,
    },
    selectedOption: {
        backgroundColor: colors.primaryLight + '20',
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
    priorityIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});

export default CompactSelectors;