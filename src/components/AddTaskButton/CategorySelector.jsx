import React from 'react';
import { 
    Modal, 
    View, 
    Text, 
    TouchableOpacity, 
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
    Platform,
    Vibration,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { categoryOptions } from '@/constants/GeneralData';

const { height: screenHeight } = Dimensions.get('window');

/**
 * Category/Inbox selector modal component
 * Allows users to select task categories with smooth animations
 */
const CategorySelector = ({ visible, onClose, task, onUpdateTask }) => {
    /**
     * Handle category selection with haptic feedback
     */
    const handleInboxSelect = (category) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }
        
        onUpdateTask({ 
            category: category.value,
            categoryColor: category.color,
            categoryIcon: category.icon 
        });
        onClose();
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            
            <TouchableWithoutFeedback>
                <View style={styles.selectionModal}>
                    <View style={styles.selectionModalHeader}>
                        <Text style={styles.selectionModalTitle}>Select Category</Text>
                        <TouchableOpacity 
                            onPress={onClose}
                            style={styles.selectionModalCloseBtn}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        style={styles.selectionScrollView}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        contentContainerStyle={{ paddingBottom: 12 }}
                    >
                        {categoryOptions.map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.selectionOption,
                                    task.category === category.value && styles.selectionOptionSelected,
                                ]}
                                onPress={() => handleInboxSelect(category)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.selectionIconContainer,
                                    { backgroundColor: category.color + '20' }
                                ]}>
                                    <Ionicons
                                        name={category.icon}
                                        size={22}
                                        color={category.color}
                                    />
                                </View>
                                <View style={styles.selectionTextContainer}>
                                    <Text style={styles.selectionOptionText}>
                                        {category.label}
                                    </Text>
                                </View>
                                {task.category === category.value && (
                                    <View style={styles.selectionCheckmark}>
                                        <Ionicons
                                            name="checkmark"
                                            size={16}
                                            color={colors.white}
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
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
        paddingHorizontal: 20,
    },
    selectionModal: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        maxHeight: screenHeight * 0.7,
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    selectionModalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    selectionModalCloseBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: colors.background,
    },
    selectionScrollView: {
        maxHeight: screenHeight * 0.5,
        paddingVertical: 8,
    },
    selectionOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '20',
    },
    selectionOptionSelected: {
        backgroundColor: colors.primary + '10',
    },
    selectionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectionTextContainer: {
        flex: 1,
    },
    selectionOptionText: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    selectionOptionDescription: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    selectionCheckmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CategorySelector;