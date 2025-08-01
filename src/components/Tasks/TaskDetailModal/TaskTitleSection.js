import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * Task title section component with checkbox and editable title
 * Handles task completion toggle and title editing
 */
const TaskTitleSection = ({ 
    task, 
    isEditing, 
    onToggleCompletion, 
    onUpdateTitle 
}) => {
    return (
        <View style={styles.taskTitleContainer}>
            <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={onToggleCompletion}
            >
                <View style={[
                    styles.checkbox,
                    task.is_completed && styles.checkboxCompleted
                ]}>
                    {task.is_completed && (
                        <Ionicons name="checkmark" size={16} color={colors.white} />
                    )}
                </View>
            </TouchableOpacity>
            
            {isEditing ? (
                <TextInput
                    style={[
                        styles.taskTitle,
                        styles.taskTitleInput,
                        task.is_completed && styles.taskTitleCompleted
                    ]}
                    value={task.title}
                    onChangeText={onUpdateTitle}
                    placeholder="Task title"
                    placeholderTextColor={colors.textTertiary}
                    multiline
                />
            ) : (
                <Text style={[
                    styles.taskTitle,
                    task.is_completed && styles.taskTitleCompleted
                ]}>
                    {task.title}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    taskTitleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    checkboxContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    taskTitle: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        lineHeight: 18,
    },
    taskTitleInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.cardBackground,
        fontSize: 14,
        minHeight: 40,
    },
    taskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
});

export default TaskTitleSection;