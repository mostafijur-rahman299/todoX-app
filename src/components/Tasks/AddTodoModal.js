import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet, Platform, Dimensions, Keyboard, Animated, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { priorities } from '@/constants/GeneralData';
import { generateId } from '@/utils/gnFunc';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '@/store/Task/task';
import { storeDataLocalStorage } from '@/utils/storage';

const AddTodoModal = ({ isModalVisible, setIsModalVisible }) => {
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState(null);
    const [newTask, setNewTask] = useState({
        title: "",
        timestamp: new Date(),
        description: "", 
        category: "other",
        priority: priorities[0].name,
        is_completed: false,
        completed_timestamp: null,
        sub_tasks: []
    });
    const tasks = useSelector(state => state.task.task_list);
    const [keyboardHeight] = useState(new Animated.Value(0));
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const categories = useSelector(state => state.category.categories);
    // Modify keyboard handling
    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardVisible(true);
                Animated.timing(keyboardHeight, {
                    toValue: e.endCoordinates.height,
                    duration: Platform.OS === 'ios' ? 250 : 0,
                    useNativeDriver: false,
                }).start();
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                Animated.timing(keyboardHeight, {
                    toValue: 0,
                    duration: Platform.OS === 'ios' ? 250 : 0,
                    useNativeDriver: false,
                }).start();
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

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

        storeDataLocalStorage('task_list', [...tasks, newTask]);
        
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    style={styles.container}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <Animated.View 
                        style={[
                            styles.modalContainer,
                            Platform.OS === 'ios' && { paddingBottom: keyboardHeight }
                        ]}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHandle} />
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>New Task</Text>
                                {/* <TouchableOpacity 
                                    onPress={() => setIsModalVisible(false)}
                                    style={styles.closeButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons name="close" size={22} color="#1E293B" />
                                </TouchableOpacity> */}
                            </View>

                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={styles.scrollContent}
                            >
                                <View style={[styles.inputContainer, isKeyboardVisible && styles.inputContainerFocused]}>
                                    <Ionicons name="pencil-outline" size={18} color="#4F46E5" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.titleInput}
                                        value={newTask.title}
                                        onChangeText={(text) => handleSetNewTask('title', text)}
                                        placeholder="What would you like to do?"
                                        placeholderTextColor="#94A3B8"
                                        returnKeyType="next"
                                        maxLength={100}
                                    />
                                </View>

                                <View style={[styles.inputContainer, isKeyboardVisible && styles.inputContainerFocused]}>
                                    <Ionicons name="document-text-outline" size={18} color="#4F46E5" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.descriptionInput}
                                        value={newTask.description}
                                        onChangeText={(text) => handleSetNewTask('description', text)}
                                        placeholder="Add details about your task"
                                        placeholderTextColor="#94A3B8"
                                        multiline
                                        maxLength={500}
                                        textAlignVertical="top"
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
                                                size={16} 
                                                color={newTask.priority === priority.name ? '#fff' : priority.color} 
                                            />
                                            <Text style={[
                                                styles.priorityText,
                                                newTask.priority === priority.name && { color: '#fff' }
                                            ]}>{priority.name.charAt(0).toUpperCase() + priority.name.slice(1)}</Text>
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
                                        {categories.map((category) => (
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
                                                ]}>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>

                                <Text style={styles.sectionTitle}>Set Due Date & Time</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={openPicker}
                                >
                                    <Ionicons name="time-outline" size={18} color={colors.primary} />
                                    <Text style={styles.dateButtonText}>
                                        {formatDate(newTask.timestamp)}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={18} color={colors.primary} />
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
                                    style={[
                                        styles.createButton,
                                        !newTask.title.trim() && styles.disabledButton,
                                        isKeyboardVisible && Platform.OS === 'android' && styles.keyboardVisibleButton
                                    ]}
                                    onPress={handleAddTask}
                                    disabled={!newTask.title.trim()}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.createButtonText}>Create Task</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default AddTodoModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(17, 25, 40, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#74515191',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
        maxHeight: Platform.OS === 'ios' ? '85%' : '90%',
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 6,
        alignSelf: 'center',
        marginBottom: 16,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        letterSpacing: 0.5,
        alignSelf: 'center'
    },
    closeButton: {
        padding: 6,
        borderRadius: 10,
        // backgroundColor: '#F1F5F9',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    inputContainerFocused: {
        borderColor: '#4F46E5',
        backgroundColor: '#FAFAFA',
    },
    inputIcon: {
        marginHorizontal: 8,
    },
    titleInput: {
        flex: 1,
        fontSize: 15,
        padding: 6,
        color: '#1E293B',
        fontWeight: '500',
    },
    descriptionInput: {
        flex: 1,
        fontSize: 14,
        padding: 6,
        height: 70,
        color: '#1E293B',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#3B4D6B',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    priorityContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        justifyContent: 'space-between',
        gap: 6,
    },
    priorityButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    priorityButtonActive: {
        transform: [{ scale: 1.02 }],
        borderColor: '#4F46E5',
    },
    priorityText: {
        color: '#3B4D6B',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 13,
    },
    categoryScrollView: {
        marginBottom: 16,
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
        gap: 8,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryButtonActive: {
        transform: [{ scale: 1.02 }],
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    selectedCategory: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    categoryText: {
        color: '#3B4D6B',
        fontSize: 13,
        marginLeft: 6,
        fontWeight: '600',
    },
    selectedCategoryText: {
        color: '#FFFFFF',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dateButtonText: {
        flex: 1,
        marginLeft: 8,
        color: '#1E293B',
        fontSize: 13,
        fontWeight: '500',
    },
    createButton: {
        flexDirection: 'row',
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    createButtonActive: {
        transform: [{ scale: 0.98 }],
    },
    disabledButton: {
        opacity: 0.6,
        backgroundColor: '#818CF8',
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        marginRight: 6,
        letterSpacing: 0.5,
    },
    keyboardVisibleButton: {
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        marginTop: 20,
    },
});
