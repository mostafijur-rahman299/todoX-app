import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { priorities, defaultCategories } from '@/constants/GeneralData';
import { generateId } from '@/utils/gnFunc';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '@/store/Task/task';
import { storeData } from '@/utils/storage';

const AddTodoModal = ({ isModalVisible, setIsModalVisible }) => {
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState(null);
    const [newTask, setNewTask] = useState({
        title: "",
        timestamp: new Date(),
        description: "", 
        category: defaultCategories[4].name, // "Other" category
        priority: priorities[0].name, // "High" priority
        is_completed: false,
        completed_timestamp: null,
        sub_tasks: []
    });
    const tasks = useSelector(state => state.tasks.task_list);

    const handleSetNewTask = (key, value) => {
        setNewTask(prev => ({ ...prev, [key]: value }));
    };

    const handleAddTask = () => {
        if (!newTask.title.trim()) return;

        dispatch(addTask({
            ...newTask,
            id: generateId(),
            timestamp: newTask.timestamp.toISOString()
        }));

        storeData('task_list', [...tasks, newTask]);
        
        setIsModalVisible(false);
        setNewTask({
            title: "",
            timestamp: new Date(),
            description: "", 
            category: defaultCategories[4].name,
            priority: priorities[0].name,
            is_completed: false,
            completed_timestamp: null,
            sub_tasks: []
        });
    };

    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
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
            if (!selectedDate) {
                setPickerMode(null);
                setShowDatePicker(false);
                return;
            }

            if (pickerMode === 'date') {
                const currentTime = new Date(newTask.timestamp);
                const updatedTimestamp = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    currentTime.getHours(),
                    currentTime.getMinutes()
                );
                handleSetNewTask('timestamp', updatedTimestamp);
                setPickerMode('time');
            } else if (pickerMode === 'time') {
                const currentDate = new Date(newTask.timestamp);
                const updatedTimestamp = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    selectedDate.getHours(),
                    selectedDate.getMinutes()
                );
                handleSetNewTask('timestamp', updatedTimestamp);
                setPickerMode(null);
                setShowDatePicker(false);
            }
        } else {
            if (selectedDate) {
                handleSetNewTask('timestamp', selectedDate);
            }
            setShowDatePicker(false);
        }
    };

    const openPicker = () => {
        if (Platform.OS === 'android') {
            setPickerMode('date');
        }
        setShowDatePicker(true);
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
                                    onChangeText={(text) => handleSetNewTask('title', text)}
                                    placeholder="Task title"
                                    placeholderTextColor={colors.darkGray}
                                />

                                <TextInput
                                    style={styles.descriptionInput}
                                    value={newTask.description}
                                    onChangeText={(text) => handleSetNewTask('description', text)}
                                    placeholder="Description (optional)"
                                    placeholderTextColor={colors.darkGray}
                                    multiline
                                    numberOfLines={4}
                                />

                                <Text style={styles.sectionTitle}>Priority</Text>
                                <View style={styles.priorityContainer}>
                                    {priorities.map((priority) => (
                                        <TouchableOpacity
                                            key={priority.name}
                                            style={[
                                                styles.priorityButton,
                                                newTask.priority === priority.name && { backgroundColor: priority.color }
                                            ]}
                                            onPress={() => handleSetNewTask('priority', priority.name)}
                                        >
                                            <Text style={[
                                                styles.priorityText,
                                                newTask.priority === priority.name && { color: '#fff' }
                                            ]}>{priority.name?.charAt(0).toUpperCase() + priority.name?.slice(1)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={styles.sectionTitle}>Category</Text>
                                <View style={styles.categoryContainer}>
                                    {defaultCategories.map((category) => (
                                        <TouchableOpacity
                                            key={category.name}
                                            style={[
                                                styles.categoryButton,
                                                newTask.category === category.name && styles.selectedCategory,
                                            ]}
                                            onPress={() => handleSetNewTask('category', category.name)}
                                        >
                                            <Text style={[
                                                styles.categoryText,
                                                newTask.category === category.name && styles.selectedCategoryText
                                            ]}>{category.name?.charAt(0).toUpperCase() + category.name?.slice(1)}</Text>
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
                                        minimumDate={new Date()}
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
                                        style={[styles.createButton, !newTask.title.trim() && styles.disabledButton]}
                                        onPress={handleAddTask}
                                        disabled={!newTask.title.trim()}
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
        backgroundColor: '#f9f9f9',
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
