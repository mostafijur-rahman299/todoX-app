import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTodoModal = ({ isModalVisible, setIsModalVisible, tasks, setTasks }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        timestamp: new Date(),
    });

    const priorities = ['low', 'medium', 'high'];
    const categories = ['work', 'personal', 'shopping', 'health', 'other'];

    const handleAddTask = () => {
        if (!newTask.title) return;

        setTasks([...tasks, { 
            ...newTask, 
            id: Date.now(),
            completed: false,
            createdAt: new Date()
        }]);

        setIsModalVisible(false);
        setNewTask({
            title: '',
            description: '',
            priority: 'medium', 
            category: '',
            timestamp: new Date(),
        });
    };

    return (
        <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            statusBarTranslucent
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHandle} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalTitle}>Create New Task</Text>

                        <Text style={styles.inputLabel}>Title</Text>
                        <TextInput
                            style={styles.input}
                            value={newTask.title}
                            onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                            placeholder="What needs to be done?"
                            placeholderTextColor={colors.darkGray}
                        />

                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={newTask.description}
                            onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                            placeholder="Add details about your task..."
                            placeholderTextColor={colors.darkGray}
                            multiline
                            numberOfLines={4}
                        />

                        <Text style={styles.inputLabel}>Priority Level</Text>
                        <View style={styles.priorityContainer}>
                            {priorities.map((priority) => (
                                <TouchableOpacity
                                    key={priority}
                                    style={[
                                        styles.priorityButton,
                                        newTask.priority === priority && styles.selectedPriority,
                                        { backgroundColor: priority === 'high' ? colors.red : priority === 'medium' ? colors.orange : colors.green }
                                    ]}
                                    onPress={() => setNewTask({ ...newTask, priority })}
                                >
                                    <Text style={styles.priorityText}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.inputLabel}>Category</Text>
                        <View style={styles.categoryContainer}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryButton,
                                        newTask.category === category && styles.selectedCategory
                                    ]}
                                    onPress={() => setNewTask({ ...newTask, category })}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        newTask.category === category && styles.selectedCategoryText
                                    ]}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.inputLabel}>Due Date & Time</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                            <Text style={styles.dateButtonText}>
                                {newTask.timestamp.toLocaleString()}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={newTask.timestamp}
                                mode="datetime"
                                onChange={(event, date) => {
                                    setShowDatePicker(false);
                                    if (date) setNewTask({ ...newTask, timestamp: date });
                                }}
                            />
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.addTaskButton]}
                                onPress={handleAddTask}
                            >
                                <Text style={styles.buttonText}>Create Task</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

export default AddTodoModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '90%',
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.lightGray,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        color: colors.text,
    },
    input: {
        borderWidth: 1.5,
        borderColor: colors.lightGray,
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        color: colors.text,
        fontSize: 16,
        backgroundColor: '#FAFAFA',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    inputLabel: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 8,
        fontWeight: '600',
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    priorityButton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        marginHorizontal: 6,
        alignItems: 'center',
        opacity: 0.8,
    },
    selectedPriority: {
        opacity: 1,
        transform: [{scale: 1.05}],
    },
    priorityText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    selectedCategory: {
        backgroundColor: colors.primary,
        transform: [{scale: 1.05}],
    },
    categoryText: {
        color: colors.primary,
        fontWeight: '500',
    },
    selectedCategoryText: {
        color: 'white',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1.5,
        borderColor: colors.lightGray,
        borderRadius: 12,
        marginBottom: 24,
        backgroundColor: '#FAFAFA',
    },
    dateButtonText: {
        marginLeft: 12,
        color: colors.text,
        fontSize: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 6,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1.5,
        borderColor: colors.lightGray,
    },
    addTaskButton: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelButtonText: {
        color: colors.darkGray,
    }
});