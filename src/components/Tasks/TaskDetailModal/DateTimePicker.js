import React from 'react';
import { 
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    StyleSheet,
    Platform
} from 'react-native';
import DateTimePickerComponent from '@react-native-community/datetimepicker';
import { colors } from '@/constants/Colors';

/**
 * Custom DateTime picker component
 * Handles both iOS and Android date/time selection
 */
const DateTimePicker = ({ 
    visible,
    mode,
    value,
    onConfirm,
    onCancel,
    onChange
}) => {
    if (Platform.OS === 'ios') {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onCancel}
            >
                <View style={styles.datePickerOverlay}>
                    <TouchableWithoutFeedback onPress={onCancel}>
                        <View style={styles.datePickerOverlayTouch} />
                    </TouchableWithoutFeedback>
                    <View style={styles.datePickerContainer}>
                        <View style={styles.datePickerHeader}>
                            <TouchableOpacity
                                onPress={onCancel}
                                style={styles.datePickerButton}
                            >
                                <Text style={styles.datePickerButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.datePickerTitle}>Select Date & Time</Text>
                            <TouchableOpacity
                                onPress={onConfirm}
                                style={styles.datePickerButton}
                            >
                                <Text style={[styles.datePickerButtonText, { color: colors.primary }]}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.datePickerContent}>
                            <DateTimePickerComponent
                                value={value}
                                mode="datetime"
                                display="wheels"
                                onChange={onChange}
                                minimumDate={new Date()}
                                textColor={colors.textPrimary}
                                themeVariant="dark"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Android DateTimePicker
    if (visible) {
        return (
            <DateTimePickerComponent
                value={value}
                mode={mode}
                display="default"
                onChange={onChange}
                minimumDate={new Date()}
            />
        );
    }

    return null;
};

const styles = StyleSheet.create({
    datePickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    datePickerOverlayTouch: {
        flex: 1,
    },
    datePickerContainer: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    datePickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    datePickerButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    datePickerContent: {
        paddingVertical: 20,
    },
});

export default DateTimePicker;