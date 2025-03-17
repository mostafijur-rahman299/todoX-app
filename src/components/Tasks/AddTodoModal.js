import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { priorities, defaultCategories } from '@/constants/GeneralData';

const AddTodoModal = ({ isModalVisible, setIsModalVisible, tasks, setTasks }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    // For Android, pickerMode will be either 'date' or 'time'; on iOS we use "datetime" directly
    const [pickerMode, setPickerMode] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        timestamp: new Date(),
    });

    const categories = defaultCategories;

    const handleAddTask = () => {
        if (!newTask.title) return;

        setTasks([
            ...tasks,
            { 
                ...newTask, 
                id: Date.now(),
                completed: false,
                createdAt: new Date()
            }
        ]);

        setIsModalVisible(false);
        setNewTask({
            title: '',
            description: '',
            priority: 'medium', 
            category: '',
            timestamp: new Date(),
        });
    };

    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleDateTimeChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            if (event.type === 'dismissed') {
                // If the user dismisses the picker, cancel the flow.
                setPickerMode(null);
                setShowDatePicker(false);
                return;
            }
            if (pickerMode === 'date') {
                // Update the date portion while preserving the current time.
                const currentDate = selectedDate || newTask.timestamp;
                const updatedTimestamp = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    newTask.timestamp.getHours(),
                    newTask.timestamp.getMinutes()
                );
                setNewTask({ ...newTask, timestamp: updatedTimestamp });
                // Now switch to time picker.
                setPickerMode('time');
                setShowDatePicker(true);
            } else if (pickerMode === 'time') {
                // Update the time portion while preserving the date.
                const currentTime = selectedDate || newTask.timestamp;
                const updatedTimestamp = new Date(
                    newTask.timestamp.getFullYear(),
                    newTask.timestamp.getMonth(),
                    newTask.timestamp.getDate(),
                    currentTime.getHours(),
                    currentTime.getMinutes()
                );
                setNewTask({ ...newTask, timestamp: updatedTimestamp });
                setPickerMode(null);
                setShowDatePicker(false);
            }
        } else {
            // For iOS, use the datetime mode.
            if (selectedDate) {
                setNewTask({ ...newTask, timestamp: selectedDate });
            }
            setShowDatePicker(false);
        }
    };

    const openPicker = () => {
        if (Platform.OS === 'android') {
            // For Android, start with the date picker.
            setPickerMode('date');
            setShowDatePicker(true);
        } else {
            setShowDatePicker(true);
        }
    };

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
                                <Text style={styles.modalTitle}>New Task</Text>

                                <TextInput
                                    style={styles.titleInput}
                                    value={newTask.title}
                                    onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                                    placeholder="Task title"
                                    placeholderTextColor={colors.darkGray}
                                />

                                <TextInput
                                    style={styles.descriptionInput}
                                    value={newTask.description}
                                    onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                                    placeholder="Description (optional)"
                                    placeholderTextColor={colors.darkGray}
                                    multiline
                                    numberOfLines={4}
                                />

                                <Text style={styles.sectionTitle}>Priority</Text>
                                <View style={styles.priorityContainer}>
                                    {Object.values(priorities).map((priority) => (
                                        <TouchableOpacity
                                            key={priority.id}
                                            style={[
                                                styles.priorityButton,
                                                newTask.priority === priority.id ? { backgroundColor: priority.color } : { backgroundColor: priority.colorLight },
                                            ]}
                                            onPress={() => setNewTask({ ...newTask, priority: priority.id })}
                                        >
                                            <Text style={styles.priorityText}>{priority.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={styles.sectionTitle}>Category</Text>
                                <View style={styles.categoryContainer}>
                                    {Object.values(categories).map((category) => (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[
                                                styles.categoryButton,
                                                newTask.category === category.id && styles.selectedCategory,
                                            ]}
                                            onPress={() => setNewTask({ ...newTask, category: category.id })}
                                        >
                                            <Text style={[
                                                styles.categoryText,
                                                newTask.category === category.id && styles.selectedCategoryText
                                            ]}>{category.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={styles.sectionTitle}>Due Date</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={openPicker}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                                    <Text style={styles.dateButtonText}>
                                        {formatDate(newTask.timestamp)}
                                    </Text>
                                </TouchableOpacity>
                                
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={newTask.timestamp}
                                        mode={Platform.OS === 'android' ? pickerMode : 'datetime'}
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleDateTimeChange}
                                    />
                                )}

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setIsModalVisible(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.createButton, !newTask.title && styles.disabledButton]}
                                        onPress={handleAddTask}
                                        disabled={!newTask.title}
                                    >
                                        <Text style={styles.createButtonText}>Create Task</Text>
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

export default AddTodoModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHandle: {
        width: 60,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        color: colors.text,
        textAlign: 'center',
    },
    titleInput: {
        fontSize: 18,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 15,
        color: colors.text,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    descriptionInput: {
        fontSize: 16,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 20,
        height: 100,
        textAlignVertical: 'top',
        color: colors.text,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: colors.text,
    },
    priorityContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
        opacity: 0.8,
    },
    priorityText: {
        color: colors.text,
        fontWeight: '600',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f9f9f9',
        margin: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedCategory: {
        backgroundColor: colors.primary,
    },
    categoryText: {
        color: colors.text,
        fontSize: 14,
    },
    selectedCategoryText: {
        color: '#fff',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dateButtonText: {
        marginLeft: 10,
        color: colors.text,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        marginRight: 5,
    },
    cancelButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    createButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
        marginLeft: 5,
    },
    disabledButton: {
        opacity: 0.5,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
