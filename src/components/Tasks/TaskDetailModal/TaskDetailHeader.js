import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * Header component for TaskDetailModal
 * Updated to match AddTaskModal design with compact layout and styling
 */
const TaskDetailHeader = ({ 
    isEditing, 
    onClose, 
    onToggleEdit, 
    onSaveChanges
}) => {
    return (
        <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Task Details</Text>
            
            {isEditing ? (
                <TouchableOpacity onPress={onSaveChanges} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={onToggleEdit} style={styles.editButton}>
                    <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
        zIndex: 10,
    },
    closeButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    editButton: {
        padding: 4,
    },
});

export default TaskDetailHeader;