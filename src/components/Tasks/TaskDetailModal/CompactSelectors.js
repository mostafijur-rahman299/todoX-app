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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { priorityOptions, categoryOptions } from '@/constants/GeneralData';

const CompactSelectors = ({ 
    task,
    isEditing,
    onUpdateTask
}) => {
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [showInboxModal, setShowInboxModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    console.log(task)

    const getCurrentPriority = () => {
        return priorityOptions.find(p => p.value === task.priority) || priorityOptions[1];
    };

    const getCurrentInbox = () => {
        return categoryOptions.find(i => i.value === task.category) || categoryOptions[0];
    };

    /**
     * Handle selector press with haptic feedback
     */
    const handleSelectorPress = (onPress) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        onPress();
    };

    /**
     * Handle priority selection
     */
    const handlePrioritySelect = (priority) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        onUpdateTask({ ...task, priority: priority.value });
        setShowPriorityModal(false);
    };

    /**
     * Handle inbox selection
     */
    const handleInboxSelect = (inbox) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        onUpdateTask({ ...task, category: inbox.value });
        setShowInboxModal(false);
    };

    /**
     * Toggle reminder
     */
    const handleReminderToggle = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        onUpdateTask({ ...task, reminder: !task.reminder });
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {        
        if (!dateString) return 'Select Date';
        
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date();
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
     * Format time for display
     */
    const formatTime = (timeString) => {
        if (!timeString) return 'Select';
        
        const time = new Date(`2000-01-01T${timeString}`);
        return time.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
        });
    };

    /**
     * Handle date selection
     */
    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (event.type === 'set' && date) {
            if (Platform.OS === 'ios') {
                Vibration.vibrate(10);
            }
            const dateString = date.toISOString().split('T')[0];
            onUpdateTask({ 
                ...task, 
                date: dateString
            });
        }
    };

    /**
     * Handle start time selection
     */
    const handleStartTimeChange = (event, time) => {
        setShowStartTimePicker(false);
        if (event.type === 'set' && time) {
            if (Platform.OS === 'ios') {
                Vibration.vibrate(10);
            }
            const timeString = time.toTimeString().split(' ')[0].substring(0, 5);
            onUpdateTask({ 
                ...task, 
                startTime: timeString,
                // If end time is before start time, clear it
                endTime: task.endTime && task.endTime <= timeString 
                    ? null 
                    : task.endTime
            });
        }
    };

    /**
     * Handle end time selection
     */
    const handleEndTimeChange = (event, time) => {
        setShowEndTimePicker(false);
        if (event.type === 'set' && time) {
            if (Platform.OS === 'ios') {
                Vibration.vibrate(10);
            }
            const timeString = time.toTimeString().split(' ')[0].substring(0, 5);
            onUpdateTask({ 
                ...task, 
                endTime: timeString,
                // If start time is after end time, clear it
                startTime: task.startTime && task.startTime >= timeString 
                    ? null 
                    : task.startTime
            });
        }
    };

    /**
     * Clear date and times
     */
    const clearDate = () => {
        onUpdateTask({ 
            ...task, 
            date: null,
            startTime: null,
            endTime: null
        });
    };

    /**
     * Clear start time
     */
    const clearStartTime = () => {
        onUpdateTask({ ...task, startTime: null });
    };

    /**
     * Clear end time
     */
    const clearEndTime = () => {
        onUpdateTask({ ...task, endTime: null });
    };

    /**
     * Create Date object for time picker
     */
    const createTimeDate = (timeString) => {
        if (!timeString) return new Date();
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return date;
    };

    /**
     * Get minimum time for end time picker
     */
    const getMinimumEndTime = () => {
        if (!task.startTime) return new Date();
        const [hours, minutes] = task.startTime.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes) + 1, 0, 0);
        return date;
    };

    const currentPriority = getCurrentPriority();
    const currentInbox = getCurrentInbox();

    return (
        <View style={styles.container}>
            {/* First Row: Priority, Category (Inbox), and Reminder */}
            <View style={styles.selectorsRow}>
                {/* Priority Selector */}
                <TouchableOpacity
                    style={styles.compactSelector}
                    onPress={isEditing ? () => {
                        handleSelectorPress(() => setShowPriorityModal(true));
                    } : null}
                    disabled={!isEditing}
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
                    {isEditing && (
                        <Ionicons 
                            name="chevron-down" 
                            size={14} 
                            color={colors.textSecondary} 
                        />
                    )}
                </TouchableOpacity>

                {/* Inbox Selector */}
                <TouchableOpacity
                    style={styles.compactSelector}
                    onPress={isEditing ? () => {
                        handleSelectorPress(() => setShowInboxModal(true));
                    } : null}
                    disabled={!isEditing}
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
                    {isEditing && (
                        <Ionicons 
                            name="chevron-down" 
                            size={14} 
                            color={colors.textSecondary} 
                        />
                    )}
                </TouchableOpacity>

                {/* Reminder Toggle */}
                <TouchableOpacity
                    style={styles.reminderSelector}
                    onPress={isEditing ? handleReminderToggle : null}
                    disabled={!isEditing}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={task.reminder ? "notifications" : "notifications-outline"} 
                        size={16} 
                        color={task.reminder ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                        styles.selectorText, 
                        { color: task.reminder ? colors.primary : colors.textSecondary }
                    ]}>
                        Reminder
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Date & Time Section */}
            <View style={styles.dateTimeSection}>
                <Text style={styles.sectionLabel}>Date & Time</Text>
                
                {/* Date Selector */}
                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>Date</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={isEditing ? () => setShowDatePicker(true) : null}
                        disabled={!isEditing}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name="calendar-outline" 
                            size={16} 
                            color={task.date ? colors.primary : colors.textSecondary} 
                        />
                        <Text style={[
                            styles.dateText,
                            { color: task.date ? colors.primary : colors.textSecondary }
                        ]}>
                            {formatDate(task.date)}
                        </Text>
                        {task.date && isEditing && (
                            <TouchableOpacity
                                onPress={clearDate}
                                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            >
                                <Ionicons 
                                    name="close-circle" 
                                    size={16} 
                                    color={colors.textSecondary} 
                                />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Time Range Selectors */}
                {task.date && (
                    <View style={styles.timeRow}>
                        {/* Start Time Selector */}
                        <View style={styles.timeSelector}>
                            <Text style={styles.timeLabel}>Start Time</Text>
                            <TouchableOpacity
                                style={styles.timeButton}
                                onPress={isEditing ? () => setShowStartTimePicker(true) : null}
                                disabled={!isEditing}
                                activeOpacity={0.7}
                            >
                                <Ionicons 
                                    name="time-outline" 
                                    size={14} 
                                    color={task.startTime ? colors.primary : colors.textSecondary} 
                                />
                                <Text style={[
                                    styles.timeText,
                                    { color: task.startTime ? colors.primary : colors.textSecondary }
                                ]}>
                                    {formatTime(task.startTime)}
                                </Text>
                                {task.startTime && isEditing && (
                                    <TouchableOpacity
                                        onPress={clearStartTime}
                                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                    >
                                        <Ionicons 
                                            name="close-circle" 
                                            size={14} 
                                            color={colors.textSecondary} 
                                        />
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Time Range Connector */}
                        <View style={styles.timeConnector}>
                            <View style={styles.connectorLine} />
                        </View>

                        {/* End Time Selector */}
                        <View style={styles.timeSelector}>
                            <Text style={styles.timeLabel}>End Time</Text>
                            <TouchableOpacity
                                style={styles.timeButton}
                                onPress={isEditing ? () => setShowEndTimePicker(true) : null}
                                disabled={!isEditing}
                                activeOpacity={0.7}
                            >
                                <Ionicons 
                                    name="time-outline" 
                                    size={14} 
                                    color={task.endTime ? colors.primary : colors.textSecondary} 
                                />
                                <Text style={[
                                    styles.timeText,
                                    { color: task.endTime ? colors.primary : colors.textSecondary }
                                ]}>
                                    {formatTime(task.endTime)}
                                </Text>
                                {task.endTime && isEditing && (
                                    <TouchableOpacity
                                        onPress={clearEndTime}
                                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                    >
                                        <Ionicons 
                                            name="close-circle" 
                                            size={14} 
                                            color={colors.textSecondary} 
                                        />
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
                                                task.priority === priority.value && styles.selectedOption
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
                                                {task.priority === priority.value && (
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
                                                task.category === inbox.value && styles.selectedOption
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
                                                {task.category === inbox.value && (
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

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={task.date ? new Date(task.date) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    themeVariant="light"
                    accentColor={colors.primary}
                />
            )}

            {/* Start Time Picker */}
            {showStartTimePicker && (
                <DateTimePicker
                    value={createTimeDate(task.startTime)}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleStartTimeChange}
                    themeVariant="light"
                    accentColor={colors.primary}
                />
            )}

            {/* End Time Picker */}
            {showEndTimePicker && (
                <DateTimePicker
                    value={createTimeDate(task.endTime)}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEndTimeChange}
                    minimumDate={task.startTime ? getMinimumEndTime() : new Date()}
                    themeVariant="light"
                    accentColor={colors.primary}
                />
            )}
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
        marginBottom: 16,
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
    dateTimeSection: {
        marginTop: 8,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    dateContainer: {
        marginBottom: 12,
    },
    dateLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 8,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timeSelector: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
        textAlign: 'center',
    },
    timeButton: {
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
    timeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    timeConnector: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    connectorLine: {
        width: 20,
        height: 1,
        backgroundColor: colors.border,
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