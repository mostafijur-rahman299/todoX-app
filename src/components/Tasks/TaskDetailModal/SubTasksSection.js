import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * Sub-tasks section component with compact design
 * Handles sub-task display, editing, and management matching AddTaskModal style
 */
const SubTasksSection = ({ 
    subTasks,
    isEditing,
    showAddSubTask,
    newSubTaskTitle,
    onToggleSubTaskCompletion,
    onDeleteSubTask,
    onShowAddSubTask,
    onHideAddSubTask,
    onUpdateNewSubTaskTitle,
    onAddSubTask
}) => {
    if (subTasks.length === 0 && !isEditing) return null;

    return (
        <View style={styles.subTasksSection}>
            <Text style={styles.sectionTitle}>Sub-tasks</Text>
            
            {subTasks.map((subTask) => (
                <View key={subTask.id} style={styles.subTaskItem}>
                    <TouchableOpacity 
                        style={styles.subTaskCheckbox}
                        onPress={() => onToggleSubTaskCompletion(subTask.id)}
                    >
                        <View style={[
                            styles.checkbox,
                            subTask.isCompleted && styles.checkboxCompleted
                        ]}>
                            {subTask.isCompleted && (
                                <Ionicons name="checkmark" size={12} color={colors.white} />
                            )}
                        </View>
                    </TouchableOpacity>
                    
                    <Text style={[
                        styles.subTaskTitle,
                        subTask.isCompleted && styles.subTaskTitleCompleted
                    ]}>
                        {subTask.title}
                    </Text>
                    
                    {isEditing && (
                        <TouchableOpacity 
                            style={styles.deleteSubTaskButton}
                            onPress={() => onDeleteSubTask(subTask.id)}
                        >
                            <Ionicons name="trash-outline" size={16} color={colors.error} />
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            {/* Add Sub-task */}
            {isEditing && (
                <View style={styles.addSubTaskContainer}>
                    {showAddSubTask ? (
                        <View style={styles.addSubTaskInput}>
                            <TextInput
                                style={styles.subTaskInput}
                                value={newSubTaskTitle}
                                onChangeText={onUpdateNewSubTaskTitle}
                                placeholder="Sub-task title"
                                placeholderTextColor={colors.textSecondary}
                                autoFocus
                                onSubmitEditing={onAddSubTask}
                            />
                            <TouchableOpacity 
                                style={styles.addSubTaskConfirm}
                                onPress={onAddSubTask}
                            >
                                <Ionicons name="checkmark" size={16} color={colors.success} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.addSubTaskCancel}
                                onPress={onHideAddSubTask}
                            >
                                <Ionicons name="close" size={16} color={colors.error} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            style={styles.addSubTaskButton}
                            onPress={onShowAddSubTask}
                        >
                            <Ionicons name="add" size={20} color={colors.primary} />
                            <Text style={styles.addSubTaskText}>Add sub-task</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    subTasksSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    subTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 6,
        minHeight: 40,
    },
    subTaskCheckbox: {
        marginRight: 10,
    },
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    subTaskTitle: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
        lineHeight: 18,
    },
    subTaskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    deleteSubTaskButton: {
        padding: 4,
    },
    addSubTaskContainer: {
        marginTop: 6,
    },
    addSubTaskButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    addSubTaskText: {
        fontSize: 14,
        color: colors.primary,
        marginLeft: 6,
        fontWeight: '500',
    },
    addSubTaskInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    subTaskInput: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
        paddingVertical: 6,
        minHeight: 32,
    },
    addSubTaskConfirm: {
        padding: 6,
        marginLeft: 6,
    },
    addSubTaskCancel: {
        padding: 6,
    },
});

export default SubTasksSection;