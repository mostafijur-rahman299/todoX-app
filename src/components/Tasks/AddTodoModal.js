import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { priorities, defaultCategories } from '@/constants/GeneralData';
import { generateId } from '@/utils/gnFunc';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '@/store/Task/task';
import { storeData } from '@/utils/storage';

const { width, height } = Dimensions.get('window');

const AddTodoModal = ({ isModalVisible, setIsModalVisible }) => {
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState(null);
    const [newTask, setNewTask] = useState({
        title: "",
        timestamp: new Date(),
        description: "", 
        category: defaultCategories[4].name,
        priority: priorities[0].name,
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
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Create New Task</Text>
                                <TouchableOpacity 
                                    onPress={() => setIsModalVisible(false)}
                                    style={styles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color={colors.text} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="pencil-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.titleInput}
                                        value={newTask.title}
                                        onChangeText={(text) => handleSetNewTask('title', text)}
                                        placeholder="What would you like to do?"
                                        placeholderTextColor={colors.darkGray}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="document-text-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.descriptionInput}
                                        value={newTask.description}
                                        onChangeText={(text) => handleSetNewTask('description', text)}
                                        placeholder="Add details about your task"
                                        placeholderTextColor={colors.darkGray}
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>

                                <Text style={styles.sectionTitle}>Set Priority Level</Text>
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
                                            <Ionicons 
                                                name={newTask.priority === priority.name ? "flag" : "flag-outline"} 
                                                size={18} 
                                                color={newTask.priority === priority.name ? '#fff' : priority.color} 
                                            />
                                            <Text style={[
                                                styles.priorityText,
                                                newTask.priority === priority.name && { color: '#fff' }
                                            ]}>{priority.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={styles.sectionTitle}>Choose Category</Text>
                                <ScrollView 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.categoryScrollView}
                                >
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
                                                <Ionicons 
                                                    name={category.icon || "bookmark-outline"} 
                                                    size={18} 
                                                    color={newTask.category === category.name ? '#fff' : colors.primary} 
                                                />
                                                <Text style={[
                                                    styles.categoryText,
                                                    newTask.category === category.name && styles.selectedCategoryText
                                                ]}>{category.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>

                                <Text style={styles.sectionTitle}>Set Due Date & Time</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={openPicker}
                                >
                                    <Ionicons name="time-outline" size={20} color={colors.primary} />
                                    <Text style={styles.dateButtonText}>
                                        {formatDate(newTask.timestamp)}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={20} color={colors.primary} />
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

                                <TouchableOpacity
                                    style={[styles.createButton, !newTask.title.trim() && styles.disabledButton]}
                                    onPress={handleAddTask}
                                    disabled={!newTask.title.trim()}
                                >
                                    <Text style={styles.createButtonText}>Create Task</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                                </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        maxHeight: height * 0.85,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
    },
    closeButton: {
        padding: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 12,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    titleInput: {
        flex: 1,
        fontSize: 16,
        padding: 12,
        color: colors.text,
    },
    descriptionInput: {
        flex: 1,
        fontSize: 14,
        padding: 12,
        height: 80,
        textAlignVertical: 'top',
        color: colors.text,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: colors.text,
        marginTop: 8,
    },
    priorityContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    priorityButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        backgroundColor: '#f8f9fa',
    },
    priorityText: {
        color: colors.text,
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 14,
    },
    categoryScrollView: {
        marginBottom: 20,
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        marginRight: 8,
    },
    selectedCategory: {
        backgroundColor: colors.primary,
    },
    categoryText: {
        color: colors.text,
        fontSize: 14,
        marginLeft: 6,
    },
    selectedCategoryText: {
        color: '#fff',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 20,
    },
    dateButtonText: {
        flex: 1,
        marginLeft: 8,
        color: colors.text,
        fontSize: 14,
    },
    createButton: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.6,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
});
