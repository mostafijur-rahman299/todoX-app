import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';

/**
 * Task description section component
 * Handles description display and editing
 */
const TaskDescriptionSection = ({ 
    description, 
    isEditing, 
    onUpdateDescription 
}) => {
    if (!isEditing && !description) return null;

    return (
        <View style={styles.descriptionContainer}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            {isEditing ? (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.taskDescription, styles.taskDescriptionInput]}
                        value={description}
                        onChangeText={onUpdateDescription}
                        placeholder="Add description..."
                        placeholderTextColor={colors.textSecondary}
                        multiline
                        numberOfLines={2}
                        maxLength={500}
                        textAlignVertical="top"
                    />
                </View>
            ) : (
                <Text style={styles.taskDescription}>
                    {description}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    descriptionContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 6,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.cardBackground,
    },
    taskDescription: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 18,
    },
    taskDescriptionInput: {
        fontSize: 14,
        color: colors.text,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 60,
        maxHeight: 80,
    },
});

export default TaskDescriptionSection;