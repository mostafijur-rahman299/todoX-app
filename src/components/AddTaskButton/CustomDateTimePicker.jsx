import React from 'react';
import { 
    Modal, 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Platform,
    Vibration
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@/constants/Colors';

/**
 * Custom date and time picker component
 * Provides platform-specific date/time selection interface
 */
const CustomDateTimePicker = ({ 
    visible, 
    onClose, 
    task, 
    onUpdateTask, 
    mode = 'datetime',
    minimumDate = new Date()
}) => {
    /**
     * Handle date/time change with haptic feedback
     */
    const handleDatePickerChange = (event, selectedDate) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }

        if (event.type === 'set' && selectedDate) {
            onUpdateTask({ 
                dueDate: selectedDate.toISOString().split('T')[0],
                dueTime: selectedDate.toTimeString().split(' ')[0].substring(0, 5)
            });
        }
    };

    /**
     * Handle date picker confirmation (Android)
     */
    const handleDatePickerConfirm = (event, selectedDate) => {
        if (selectedDate) {
            onUpdateTask({ 
                dueDate: selectedDate.toISOString().split('T')[0],
                dueTime: selectedDate.toTimeString().split(' ')[0].substring(0, 5)
            });
        }
        onClose();
    };

    /**
     * Handle date picker cancellation
     */
    const handleDatePickerCancel = () => {
        onClose();
    };

    // For iOS, render modal with date picker
    if (Platform.OS === 'ios') {
        return (
            <Modal
                transparent={true}
                visible={visible}
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={styles.datePickerModalOverlay}>
                    <View style={styles.datePickerModal}>
                        <View style={styles.datePickerHeader}>
                            <TouchableOpacity 
                                onPress={onClose}
                                style={styles.datePickerButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.datePickerButtonTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.datePickerTitle}>Select Date & Time</Text>
                            <TouchableOpacity 
                                onPress={onClose}
                                style={styles.datePickerButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.datePickerButtonTextConfirm}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            value={task.dueDate ? new Date(task.dueDate + 'T' + (task.dueTime || '00:00')) : new Date()}
                            mode={mode}
                            display="spinner"
                            onChange={handleDatePickerChange}
                            minimumDate={minimumDate}
                            textColor={colors.textPrimary}
                            style={styles.dateTimePicker}
                        />
                    </View>
                </View>
            </Modal>
        );
    }

    // For Android, render native date picker
    if (visible) {
        return (
            <DateTimePicker
                value={task.dueDate ? new Date(task.dueDate + 'T' + (task.dueTime || '00:00')) : new Date()}
                mode={mode}
                display="default"
                onChange={handleDatePickerConfirm}
                minimumDate={minimumDate}
                onTouchCancel={handleDatePickerCancel}
            />
        );
    }

    return null;
};

const styles = StyleSheet.create({
    datePickerModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    datePickerModal: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34, // Safe area padding for iOS
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    datePickerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    datePickerButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    datePickerButtonTextCancel: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    datePickerButtonTextConfirm: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
    },
    dateTimePicker: {
        height: 200,
        backgroundColor: colors.surface,
    },
});

export default CustomDateTimePicker;