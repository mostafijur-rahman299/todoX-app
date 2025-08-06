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
    inputFocusAnim, 
    onInputFocus, 
    onInputBlur,
    onToggleCompletion,
    onUpdateTitle,
    onUpdateSummary
}) => {
    // Animated input border color
    const inputBorderColor = inputFocusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary],
    });

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
                        task.isCompleted && styles.checkboxCompleted
                    ]}>
                        {task.isCompleted && (
                            <Ionicons name="checkmark" size={16} color={colors.white} />
                        )}
                    </View>
                </TouchableOpacity>
                
                <View style={styles.titleInputGroup}>
                    <Text style={styles.inputLabel}>Task Title</Text>
                    {isEditing ? (
                        <Animated.View style={[styles.inputContainer, { borderColor: inputBorderColor }]}>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    task.isCompleted && styles.textCompleted
                                ]}
                                placeholder="Enter task title..."
                                placeholderTextColor={colors.textSecondary}
                                value={task.title}
                                onChangeText={onUpdateTitle}
                                onFocus={onInputFocus}
                                onBlur={onInputBlur}
                                multiline={false}
                                maxLength={100}
                            />
                        </Animated.View>
                    ) : (
                        <Text style={[
                            styles.taskTitle,
                            task.isCompleted && styles.textCompleted
                        ]}>
                            {task.title}
                        </Text>
                    )}
                </View>
            </View>

            {/* Task Description Input - Made more compact */}
            {(isEditing || task.summary) && (
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Summary (Optional)</Text>
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
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        lineHeight: 18,
        paddingVertical: 8,
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