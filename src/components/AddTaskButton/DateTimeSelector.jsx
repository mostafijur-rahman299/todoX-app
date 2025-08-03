import { useRef, useEffect, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { dateTimeOptions } from '@/constants/GeneralData';

const { height: screenHeight } = Dimensions.get('window');

/**
 * Date and time selector modal component
 * Allows users to select predefined date/time options or custom date/time with start and end times
 */
const DateTimeSelector = ({ visible, onClose, task, onUpdateTask, onOpenDatePicker }) => {
    const dateTimeSlideAnim = useRef(new Animated.Value(-100)).current;
    const dateTimeOpacity = useRef(new Animated.Value(0)).current;
    
    // State for custom date/time selection flow
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDateRangeSelector, setShowDateRangeSelector] = useState(false);
    const [timePickerMode, setTimePickerMode] = useState('start'); // 'start' or 'end'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [duration, setDuration] = useState(30); // Default 30 minutes

    /**
     * Handle date/time option selection with haptic feedback
     */
    const handleDateTimeSelect = (option) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }

        const now = new Date();
        let initialDate = new Date();

        // Set initial date based on selected option
        switch (option.value) {
            case 'today':
                initialDate.setHours(9, 0, 0, 0);
                break;
            case 'tomorrow':
                initialDate.setDate(now.getDate() + 1);
                initialDate.setHours(9, 0, 0, 0);
                break;
            case 'next_week':
                initialDate.setDate(now.getDate() + 7);
                initialDate.setHours(9, 0, 0, 0);
                break;
            case 'next_month':
                initialDate.setMonth(now.getMonth() + 1);
                initialDate.setHours(9, 0, 0, 0);
                break;
            case 'custom':
                initialDate = new Date();
                break;
            default:
                initialDate = null;
        }

        if (initialDate) {
            // Set the selected date (single date for all options)
            setSelectedDate(new Date(initialDate));
            
            // Set start time
            setStartTime(new Date(initialDate));
            
            // Set end time (1 hour later by default)
            const endDateTime = new Date(initialDate.getTime() + duration * 60 * 1000);
            setEndTime(new Date(endDateTime));
            
            // Show single date time selector for all options
            setShowDateRangeSelector(true);
        } else {
            // Clear selection
            onUpdateTask({ 
                dueDate: null,
                dueTime: null,
                startTime: null,
                endTime: null
            });
            handleClose();
        }
    };

    /**
     * Handle single date picker change
     */
    const handleDateRangeChange = (event, date) => {
        if (Platform.OS === 'android') {
            setShowCustomDatePicker(false);
            if (event.type === 'set' && date) {
                // Update the selected date for both start and end
                setSelectedDate(date);
                
                // Update start time to match the new date
                const newStartTime = new Date(date);
                newStartTime.setHours(startTime.getHours(), startTime.getMinutes());
                setStartTime(newStartTime);
                
                // Update end time based on duration
                const newEndTime = new Date(newStartTime.getTime() + duration * 60 * 1000);
                setEndTime(newEndTime);
            }
        } else if (date) {
            // Update the selected date for both start and end
            setSelectedDate(date);
            
            // Update start time to match the new date
            const newStartTime = new Date(date);
            newStartTime.setHours(startTime.getHours(), startTime.getMinutes());
            setStartTime(newStartTime);
            
            // Update end time based on duration
            const newEndTime = new Date(newStartTime.getTime() + duration * 60 * 1000);
            setEndTime(newEndTime);
        }
    };

    /**
     * Handle duration change
     */
    const handleDurationChange = (newDuration) => {
        setDuration(newDuration);
        // Update end time based on new duration
        const newEndTime = new Date(startTime.getTime() + newDuration * 60 * 1000);
        setEndTime(newEndTime);
    };

    /**
     * Complete single date with time range selection
     */
    const completeDateRangeSelection = () => {
        onUpdateTask({
            dueDate: selectedDate.toISOString().split('T')[0],
            dueTime: startTime.toTimeString().split(' ')[0].substring(0, 5),
            startTime: startTime.toTimeString().split(' ')[0].substring(0, 5),
            endTime: endTime.toTimeString().split(' ')[0].substring(0, 5),
            duration: duration
        });
        handleClose();
    };

    /**
     * Handle time picker change
     */
    const handleTimeChange = (event, time) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
            if (event.type === 'set' && time) {
                if (timePickerMode === 'start') {
                    setStartTime(time);
                    // After selecting start time, show end time picker
                    setTimePickerMode('end');
                    setShowTimePicker(true);
                } else {
                    setEndTime(time);
                    // Complete the selection
                    completeCustomSelection(time);
                }
            }
        } else if (time) {
            if (timePickerMode === 'start') {
                setStartTime(time);
            } else {
                setEndTime(time);
            }
        }
    };

    /**
     * Complete custom date/time selection
     */
    const completeCustomSelection = (finalEndTime = endTime) => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const startTimeStr = startTime.toTimeString().split(' ')[0].substring(0, 5);
        const endTimeStr = finalEndTime.toTimeString().split(' ')[0].substring(0, 5);
        
        onUpdateTask({
            dueDate: dateStr,
            dueTime: startTimeStr, // Keep dueTime for backward compatibility
            startTime: startTimeStr,
            endTime: endTimeStr
        });
        
        handleClose();
    };

    /**
     * Handle modal close with animation
     */
    const handleClose = () => {
        // First close any open sub-modals
        setShowCustomDatePicker(false);
        setShowTimePicker(false);
        setShowDateRangeSelector(false);
        
        // Then animate the main modal close
        Animated.parallel([
            Animated.timing(dateTimeOpacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(dateTimeSlideAnim, {
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
                Animated.timing(dateTimeOpacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(dateTimeSlideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.back(1.1)),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Reset animation values when not visible
            dateTimeSlideAnim.setValue(-100);
            dateTimeOpacity.setValue(0);
        }
    }, [visible]);

    /**
     * Reset state when modal is closed
     */
    useEffect(() => {
        if (!visible) {
            // Reset all states when modal is completely closed
            setTimePickerMode('start');
            setDuration(30);
            setShowCustomDatePicker(false);
            setShowTimePicker(false);
            setShowDateRangeSelector(false);
        }
    }, [visible]);

    /**
     * Get formatted date/time display
     */
    const getDateTimeDisplay = () => {
        if (!task.dueDate) return null;
        
        const date = new Date(task.dueDate + 'T' + (task.dueTime || '00:00'));
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        let dateStr;
        if (taskDate.getTime() === today.getTime()) {
            dateStr = 'Today';
        } else if (taskDate.getTime() === tomorrow.getTime()) {
            dateStr = 'Tomorrow';
        } else {
            dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
        
        // Check if we have start and end times
        if (task.startTime && task.endTime) {
            const startDate = new Date(task.dueDate + 'T' + task.startTime);
            const endDate = new Date(task.dueDate + 'T' + task.endTime);
            
            const startTimeStr = startDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            const endTimeStr = endDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            return `${dateStr} from ${startTimeStr} to ${endTimeStr}`;
        } else {
            const timeStr = date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            return `${dateStr} at ${timeStr}`;
        }
    };

    /**
     * Clear selected date/time
     */
    const clearDateTime = () => {
        onUpdateTask({ 
            dueDate: null,
            dueTime: null,
            startTime: null,
            endTime: null
        });
        handleClose();
    };

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
                                    opacity: dateTimeOpacity,
                                    transform: [
                                        { translateY: dateTimeSlideAnim },
                                    ],
                                },
                            ]}>
                            <View style={styles.selectionModalHeader}>
                                <Text style={styles.selectionModalTitle}>Select Date & Time</Text>
                                <TouchableOpacity 
                                    onPress={handleClose}
                                    style={styles.selectionModalCloseBtn}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={18} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Current Selection Display */}
                            {task.dueDate && (
                                <View style={styles.currentSelectionContainer}>
                                    <View style={styles.currentSelection}>
                                        <Ionicons name="time" size={20} color={colors.primary} />
                                        <Text style={styles.currentSelectionText}>
                                            {getDateTimeDisplay()}
                                        </Text>
                                        <TouchableOpacity 
                                            onPress={clearDateTime}
                                            style={styles.clearButton}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            <ScrollView
                                style={styles.selectionScrollView}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                contentContainerStyle={{ paddingBottom: 12 }}
                            >
                                {dateTimeOptions.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.selectionOption}
                                        onPress={() => handleDateTimeSelect(option)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[
                                            styles.selectionIconContainer,
                                            { backgroundColor: option.color + '20' }
                                        ]}>
                                            <Ionicons
                                                name={option.icon}
                                                size={18}
                                                color={option.color}
                                            />
                                        </View>
                                        <View style={styles.selectionTextContainer}>
                                            <Text style={styles.selectionOptionText}>
                                                {option.label}
                                            </Text>
                                            {option.description && (
                                                <Text style={styles.selectionOptionDescription}>
                                                    {option.description}
                                                </Text>
                                            )}
                                        </View>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={16}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                ))}
                    </ScrollView>
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    </TouchableWithoutFeedback>

    {/* Custom Date Picker Modal */}
    {showCustomDatePicker && (
        <Modal
            transparent={true}
            visible={showCustomDatePicker}
            animationType="fade"
            onRequestClose={() => setShowCustomDatePicker(false)}
        >
            <View style={styles.datePickerOverlay}>
                <View style={styles.datePickerContainer}>
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateRangeChange}
                        minimumDate={new Date()}
                        textColor={colors.textPrimary}
                        style={styles.datePicker}
                    />
                </View>
            </View>
        </Modal>
    )}

    {/* Time Picker Modal */}
    {showTimePicker && (
        <Modal
            transparent={true}
            visible={showTimePicker}
            animationType="fade"
            onRequestClose={() => setShowTimePicker(false)}
        >
            <View style={styles.datePickerOverlay}>
                <View style={styles.datePickerContainer}>
                    <DateTimePicker
                        value={timePickerMode === 'start' ? startTime : endTime}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={showDateRangeSelector ? (event, time) => {
                            if (Platform.OS === 'android') {
                                setShowTimePicker(false);
                                if (event.type === 'set' && time) {
                                    if (timePickerMode === 'start') {
                                        setStartTime(time);
                                        // Update end time based on duration
                                        const newEndTime = new Date(time.getTime() + duration * 60 * 1000);
                                        setEndTime(newEndTime);
                                    } else {
                                        setEndTime(time);
                                    }
                                }
                            } else if (time) {
                                if (timePickerMode === 'start') {
                                    setStartTime(time);
                                    // Update end time based on duration
                                    const newEndTime = new Date(time.getTime() + duration * 60 * 1000);
                                    setEndTime(newEndTime);
                                } else {
                                    setEndTime(time);
                                }
                            }
                        } : handleTimeChange}
                        textColor={colors.textPrimary}
                        style={styles.datePicker}
                    />
                </View>
            </View>
        </Modal>
    )}

    {/* Date Range Selector Modal */}
    {showDateRangeSelector && (
        <Modal
            transparent={true}
            visible={showDateRangeSelector}
            animationType="fade"
            onRequestClose={() => setShowDateRangeSelector(false)}
        >
            <View style={styles.datePickerOverlay}>
                <View style={styles.dateRangeContainer}>
                    <View style={styles.datePickerHeader}>
                        <TouchableOpacity 
                            onPress={() => setShowDateRangeSelector(false)}
                            style={styles.datePickerButton}
                        >
                            <Text style={styles.datePickerButtonCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.datePickerTitle}>Set Date & Time</Text>
                        <TouchableOpacity 
                            onPress={completeDateRangeSelection}
                            style={styles.datePickerButton}
                        >
                            <Text style={styles.datePickerButtonConfirm}>Done</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.dateRangeContent} showsVerticalScrollIndicator={false}>
                        {/* Duration Selection */}
                        <View style={styles.durationSection}>
                            <Text style={styles.sectionTitle}>Duration</Text>
                            <View style={styles.durationOptions}>
                                {[15, 30, 60, 120, 240].map((minutes) => (
                                    <TouchableOpacity
                                        key={minutes}
                                        style={[
                                            styles.durationOption,
                                            duration === minutes && styles.durationOptionSelected
                                        ]}
                                        onPress={() => handleDurationChange(minutes)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.durationOptionText,
                                            duration === minutes && styles.durationOptionTextSelected
                                        ]}>
                                            {minutes < 60 ? `${minutes}m` : `${minutes / 60}h`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Date Selection */}
                        <View style={styles.dateTimeSection}>
                            <Text style={styles.sectionTitle}>Date</Text>
                            <TouchableOpacity
                                style={styles.dateTimeSelector}
                                onPress={() => {
                                    setShowCustomDatePicker(true);
                                }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="calendar" size={20} color={colors.primary} />
                                <Text style={styles.dateTimeSelectorText}>
                                    {selectedDate.toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })}
                                </Text>
                                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Time Range */}
                        <View style={styles.dateTimeSection}>
                            <Text style={styles.sectionTitle}>Time Range</Text>
                            <TouchableOpacity
                                style={styles.dateTimeSelector}
                                onPress={() => {
                                    setTimePickerMode('start');
                                    setShowTimePicker(true);
                                }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="time" size={20} color={colors.primary} />
                                <Text style={styles.dateTimeSelectorText}>
                                    Start: {startTime.toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                    })}
                                </Text>
                                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dateTimeSelector}
                                onPress={() => {
                                    setTimePickerMode('end');
                                    setShowTimePicker(true);
                                }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="time" size={20} color={colors.primary} />
                                <Text style={styles.dateTimeSelectorText}>
                                    End: {endTime.toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                    })}
                                </Text>
                                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Summary */}
                        <View style={styles.summarySection}>
                            <Text style={styles.sectionTitle}>Summary</Text>
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryText}>
                                    {selectedDate.toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </Text>
                                <Text style={styles.summaryTimeText}>
                                    {startTime.toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                    })} - {endTime.toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                    })}
                                </Text>
                                <Text style={styles.summaryDurationText}>
                                    Duration: {duration < 60 ? `${duration} minutes` : `${duration / 60} hour${duration / 60 > 1 ? 's' : ''}`}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )}
</Modal>
    );
};

const styles = StyleSheet.create({
    smartSuggestionsContainer: {
        backgroundColor: colors.background,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border + '30',
    },
    smartSuggestionsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    smartSuggestionsTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    smartSuggestionsScroll: {
        flexDirection: 'row',
    },
    smartSuggestionPill: {
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 6,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    smartSuggestionText: {
        fontSize: 10,
        fontWeight: '500',
        color: colors.textPrimary,
        marginBottom: 1,
    },
    smartSuggestionTime: {
        fontSize: 9,
        color: colors.textSecondary,
    },
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
        maxWidth: 350,
        maxHeight: screenHeight * 0.6,
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
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    selectionModalTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    selectionModalCloseBtn: {
        padding: 6,
        borderRadius: 10,
        backgroundColor: colors.background,
    },
    currentSelectionContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '20',
    },
    currentSelection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary + '10',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 8,
    },
    currentSelectionText: {
        flex: 1,
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
    },
    clearButton: {
        padding: 4,
    },
    selectionScrollView: {
        maxHeight: screenHeight * 0.4,
        paddingVertical: 6,
    },
    selectionOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '20',
    },
    selectionIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectionTextContainer: {
        flex: 1,
    },
    selectionOptionText: {
        fontSize: 15,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    selectionOptionDescription: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 1,
    },
    // Custom Date/Time Picker Styles
    datePickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    datePickerContainer: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        width: '90%',
        maxWidth: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    datePickerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    datePickerButton: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
    },
    datePickerButtonCancel: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    datePickerButtonConfirm: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    datePicker: {
        height: 160,
        backgroundColor: colors.surface,
    },
    // Date Range Selector Styles
    dateRangeContainer: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        width: '95%',
        maxWidth: 350,
        maxHeight: screenHeight * 0.7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
    },
    dateRangeContent: {
        maxHeight: screenHeight * 0.5,
        paddingBottom: 16,
    },
    durationSection: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '20',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    durationOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    durationOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    durationOptionSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    durationOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    durationOptionTextSelected: {
        color: colors.surface,
    },
    dateTimeSection: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '20',
    },
    dateTimeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: colors.background,
        borderRadius: 8,
        marginBottom: 4,
        gap: 8,
    },
    dateTimeSelectorText: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    summarySection: {
        padding: 16,
    },
    summaryCard: {
        backgroundColor: colors.primary + '10',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    summaryText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    summaryTimeText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 4,
    },
    summaryDurationText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
});

export default DateTimeSelector;