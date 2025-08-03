import { useState } from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Vibration
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * CompactDateSelector component - Date selector with time range for start and end times
 * Displays date selector and time range selectors for a specific date
 */
const CompactDateSelector = ({ 
    newTask, 
    setNewTask 
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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
            setNewTask({ 
                ...newTask, 
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
            const timeString = time.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
            setNewTask({ 
                ...newTask, 
                startTime: timeString,
                // If end time is before start time, clear it
                endTime: newTask.endTime && newTask.endTime <= timeString 
                    ? null 
                    : newTask.endTime
            });
        }

        console.log("called=====")
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
            const timeString = time.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
            setNewTask({ 
                ...newTask, 
                endTime: timeString,
                // If start time is after end time, clear it
                startTime: newTask.startTime && newTask.startTime >= timeString 
                    ? null 
                    : newTask.startTime
            });
        }
    };

    /**
     * Clear date
     */
    const clearDate = () => {
        setNewTask({ 
            ...newTask, 
            date: null,
            startTime: null,
            endTime: null
        });
    };

    /**
     * Clear start time
     */
    const clearStartTime = () => {
        setNewTask({ ...newTask, startTime: null });
    };

    /**
     * Clear end time
     */
    const clearEndTime = () => {
        setNewTask({ ...newTask, endTime: null });
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
        if (!newTask.startTime) return new Date();
        const [hours, minutes] = newTask.startTime.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes) + 1, 0, 0); // 1 minute after start time
        return date;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionLabel}>Date & Time</Text>
            
            {/* Date Selector */}
            <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Date</Text>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name="calendar-outline" 
                        size={16} 
                        color={newTask.date ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                        styles.dateText,
                        { color: newTask.date ? colors.primary : colors.textSecondary }
                    ]}>
                        {formatDate(newTask.date)}
                    </Text>
                    {newTask.date && (
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
            {newTask.date && (
                <View style={styles.timeRow}>
                    {/* Start Time Selector */}
                    <View style={styles.timeSelector}>
                        <Text style={styles.timeLabel}>Start Time</Text>
                        <TouchableOpacity
                            style={styles.timeButton}
                            onPress={() => setShowStartTimePicker(true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons 
                                name="time-outline" 
                                size={14} 
                                color={newTask.startTime ? colors.primary : colors.textSecondary} 
                            />
                            <Text style={[
                                styles.timeText,
                                { color: newTask.startTime ? colors.primary : colors.textSecondary }
                            ]}>
                                {formatTime(newTask.startTime)}
                            </Text>
                            {newTask.startTime && (
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
                            onPress={() => setShowEndTimePicker(true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons 
                                name="time-outline" 
                                size={14} 
                                color={newTask.endTime ? colors.primary : colors.textSecondary} 
                            />
                            <Text style={[
                                styles.timeText,
                                { color: newTask.endTime ? colors.primary : colors.textSecondary }
                            ]}>
                                {formatTime(newTask.endTime)}
                            </Text>
                            {newTask.endTime && (
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

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={newTask.date ? new Date(newTask.date) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {/* Start Time Picker */}
            {showStartTimePicker && (
                <DateTimePicker
                    value={createTimeDate(newTask.startTime)}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleStartTimeChange}
                />
            )}

            {/* End Time Picker */}
            {showEndTimePicker && (
                <DateTimePicker
                    value={createTimeDate(newTask.endTime)}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEndTimeChange}
                    minimumDate={newTask.startTime ? getMinimumEndTime() : new Date()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
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
});

export default CompactDateSelector;