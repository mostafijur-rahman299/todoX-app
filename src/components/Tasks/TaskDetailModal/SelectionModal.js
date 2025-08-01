import React from 'react';
import { 
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    ScrollView, 
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * Generic selection modal component matching AddTaskModal design
 * Used for priority, inbox, and datetime selection with modern styling
 */
const SelectionModal = ({ 
    visible,
    title,
    options,
    selectedValue,
    onClose,
    onSelect
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <ScrollView style={styles.optionsList}>
                                {options.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.optionItem,
                                            selectedValue === option.value && styles.selectedOption
                                        ]}
                                        onPress={() => onSelect(option)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.optionContent}>
                                            <View style={styles.optionLeft}>
                                                {option.color && (
                                                    <View style={[styles.priorityIndicator, { backgroundColor: option.color }]} />
                                                )}
                                                <Ionicons 
                                                    name={option.icon} 
                                                    size={20} 
                                                    color={option.color} 
                                                />
                                                <Text style={[styles.optionText, { color: option.color }]}>
                                                    {option.label}
                                                </Text>
                                            </View>
                                            {selectedValue === option.value && (
                                                <Ionicons 
                                                    name="checkmark" 
                                                    size={20} 
                                                    color={option.color} 
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
    );
};

const styles = StyleSheet.create({
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
        marginRight: 8,
    },
});

export default SelectionModal;