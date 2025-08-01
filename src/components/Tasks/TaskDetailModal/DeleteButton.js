import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * Delete button component for task deletion
 * Only visible in editing mode
 */
const DeleteButton = ({ onDelete }) => {
    return (
        <TouchableOpacity 
            style={styles.deleteButton}
            onPress={onDelete}
        >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <Text style={styles.deleteButtonText}>Delete Task</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        marginTop: 16,
        marginBottom: 40
    },
    deleteButtonText: {
        fontSize: 14,
        color: colors.error,
        marginLeft: 8,
        fontWeight: '500',
    },
});

export default DeleteButton;