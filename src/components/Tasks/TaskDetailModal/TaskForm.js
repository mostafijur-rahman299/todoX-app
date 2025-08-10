import React from 'react';
import { 
    View, 
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * TaskForm component - Compact form inputs for task title and description
 * Handles task information input with animated focus states and completion toggle
 * Updated to match AddTaskModal design patterns
 */
const TaskForm = ({ 
    task,
    isEditing,
    onInputFocus, 
    onInputBlur,
    onToggleCompletion,
    onUpdateTitle,
    onUpdateSummary
}) => {

    // Normalize completion status for display
    const isCompleted = task.isCompleted || task.is_completed || false;

    return (
        <View style={styles.container}>
            {/* Task Title with Checkbox */}
            <View style={styles.titleContainer}>
                <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={onToggleCompletion}
                >
                    <View style={[
                        styles.checkbox,
                        isCompleted && styles.checkboxCompleted
                    ]}>
                        {isCompleted && (
                            <Ionicons name="checkmark" size={16} color={colors.white} />
                        )}
                    </View>
                </TouchableOpacity>
                
                <View style={styles.titleInputGroup}>
                    <Text style={styles.inputLabel}>Task Title</Text>
                    {isEditing ? (
                        <Animated.View style={[
                            styles.inputContainer,
                            // { borderColor: inputBorderColor }
                        ]}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter task title..."
                                placeholderTextColor={colors.textSecondary}
                                value={task.title}
                                onChangeText={onUpdateTitle}
                                onFocus={onInputFocus}
                                onBlur={onInputBlur}
                                multiline={true}
                                numberOfLines={2}
                                maxLength={200}
                            />
                        </Animated.View>
                    ) : (
                        <Text style={[
                            styles.taskTitle,
                            isCompleted && styles.taskTitleCompleted
                        ]}>
                            {task.title}
                        </Text>
                    )}
                </View>
            </View>

            {/* Task Summary */}
            {(task.summary || isEditing) && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.inputLabel}>Summary</Text>
                    {isEditing ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.textInput, styles.descriptionInput]}
                                placeholder="Add summary..."
                                placeholderTextColor={colors.textSecondary}
                                value={task.summary}
                                onChangeText={onUpdateSummary}
                                multiline={true}
                                numberOfLines={2}
                                maxLength={500}
                                textAlignVertical="top"
                            />
                        </View>
                    ) : (
                        <Text style={styles.taskDescription}>
                            {task.summary}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    checkboxContainer: {
        marginRight: 12,
        marginTop: 8,
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
    titleInputGroup: {
        flex: 1,
    },
    inputGroup: {
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
    textInput: {
        fontSize: 14,
        color: colors.text,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 40,
    },
    descriptionInput: {
        minHeight: 60,
        maxHeight: 80,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        lineHeight: 20,
        paddingVertical: 8,
    },
    taskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    taskDescription: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 18,
        paddingVertical: 4,
    },
    textCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
});

export default TaskForm;