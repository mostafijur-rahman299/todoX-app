import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

const DetailModal = ({ isModalVisible, setIsModalVisible, task }) => {
    const handleDeleteTask = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        // Add delete task logic here
                        setIsModalVisible(false);
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleDeleteSubtask = (subtaskId) => {
        Alert.alert(
            "Delete Subtask",
            "Are you sure you want to delete this subtask?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        // Add delete subtask logic here
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleAddSubtask = () => {
        // Add subtask logic here
        Alert.alert("Add Subtask", "Add subtask functionality will be implemented here");
    };

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (!task) {
        return null;
    }

    return (
        <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHandle} />
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Task Details</Text>
                                    <TouchableOpacity 
                                        style={styles.closeButton}
                                        onPress={() => setIsModalVisible(false)}
                                    >
                                        <Ionicons name="close" size={24} color={colors.darkGray} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.detailSection}>
                                    <Text style={styles.label}>Title</Text>
                                    <Text style={styles.value}>{task.title}</Text>
                                </View>

                                {task.description && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.label}>Description</Text>
                                        <Text style={styles.value}>{task.description}</Text>
                                    </View>
                                )}

                                <View style={styles.row}>
                                    <View style={[styles.detailSection, styles.flex1]}>
                                        <Text style={styles.label}>Priority Level</Text>
                                        <View style={[
                                            styles.priorityBadge,
                                            { backgroundColor: task.priority === 'high' ? colors.red : task.priority === 'medium' ? colors.orange : colors.green }
                                        ]}>
                                            <Text style={styles.priorityText}>
                                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={[styles.detailSection, styles.flex1]}>
                                        <Text style={styles.label}>Category</Text>
                                        <View style={styles.categoryBadge}>
                                            <Text style={styles.categoryText}>
                                                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.detailSection}>
                                    <Text style={styles.label}>Due Date & Time</Text>
                                    <Text style={styles.dateValue}>
                                        {formatDateTime(task.timestamp)}
                                    </Text>
                                </View>

                                {task.sub_tasks && task.sub_tasks.length > 0 && (
                                    <View style={styles.detailSection}>
                                        <View style={styles.subtaskHeader}>
                                            <Text style={styles.label}>Subtasks ({task.sub_tasks.length})</Text>
                                            <TouchableOpacity 
                                                style={styles.addSubtaskButton}
                                                onPress={handleAddSubtask}
                                            >
                                                <Ionicons name="add-circle" size={20} color={colors.primary} />
                                                <Text style={styles.addSubtaskText}>Add Subtask</Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                        {task.sub_tasks.map((subTask) => (
                                            <View key={subTask.id} style={styles.subTaskItem}>
                                                <View style={styles.subTaskHeader}>
                                                    <TouchableOpacity onPress={() => handleToggleSubtask(subTask.id)}>
                                                        <Ionicons
                                                            name={subTask.is_completed ? "checkmark-circle" : "radio-button-off"}
                                                            size={20}
                                                            color={
                                                                subTask.is_completed ? colors.primary :
                                                                subTask.priority === "high" ? colors.red :
                                                                subTask.priority === "medium" ? colors.orange :
                                                                colors.green
                                                            }
                                                        />
                                                    </TouchableOpacity>
                                                    <Text style={[
                                                        styles.subTaskTitle,
                                                        subTask.is_completed && styles.completedSubTask
                                                    ]}>
                                                        {subTask.title}
                                                    </Text>
                                                    <TouchableOpacity 
                                                        onPress={() => handleDeleteSubtask(subTask.id)}
                                                        style={styles.deleteButton}
                                                    >
                                                        <Ionicons name="trash-outline" size={20} color={colors.red} />
                                                    </TouchableOpacity>
                                                </View>
                                                <Text style={styles.subTaskDate}>
                                                    Due {new Date(subTask.timestamp).toLocaleTimeString('en-US', {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity 
                                        style={styles.deleteTaskButton}
                                        onPress={handleDeleteTask}
                                >
                                    <Ionicons name="trash-outline" size={24} color="white" />
                                    <Text style={styles.deleteTaskText}>Delete Task</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.editTaskButton} onPress={() => {}}>
                                    <Ionicons name="pencil" size={20} color={colors.darkGray} />
                                    <Text style={styles.editTaskText}>Edit Task</Text>
                                </TouchableOpacity>
                                </View>

                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default DetailModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: '90%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.lightGray,
        borderRadius: 4,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
    },
    modalTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        letterSpacing: -0.5,
    },
    closeButton: {
        padding: 8,
        backgroundColor: colors.lightGray,
        borderRadius: 12,
    },
    detailSection: {
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        color: colors.darkGray,
        marginBottom: 10,
        fontWeight: '600',
        letterSpacing: -0.3,
    },
    value: {
        fontSize: 18,
        color: colors.text,
        lineHeight: 26,
    },
    dateValue: {
        fontSize: 18,
        color: colors.text,
        lineHeight: 26,
        fontWeight: '500',
    },
    priorityBadge: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    priorityText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: colors.gray,
    },
    categoryText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    subtaskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addSubtaskButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    addSubtaskText: {
        color: colors.primary,
        fontWeight: '600',
        marginLeft: 6,
    },
    subTaskItem: {
        marginBottom: 12,
        padding: 16,
        backgroundColor: colors.lightGray,
        borderRadius: 16,
    },
    subTaskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    subTaskTitle: {
        marginLeft: 12,
        fontSize: 16,
        color: colors.text,
        flex: 1,
        fontWeight: '500',
    },
    completedSubTask: {
        textDecorationLine: 'line-through',
        opacity: 0.6,
    },
    subTaskDate: {
        marginLeft: 32,
        fontSize: 14,
        color: colors.darkGray,
        fontWeight: '500',
    },
    deleteButton: {
        padding: 6,
        backgroundColor: 'rgba(255,59,48,0.1)', 
        borderRadius: 8,
    },
    deleteTaskButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.red,
        padding: 16,
        borderRadius: 16,
    },
    deleteTaskText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 8,
    },
    editTaskButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        padding: 16,
        borderRadius: 16,
    },
    editTaskText: {
        color: colors.darkGray,
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 32,
    }
});