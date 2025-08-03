import React, { useEffect, useState, useRef } from 'react';
import { 
    View, 
    StyleSheet,
    Animated,
    Easing,
    Platform,
    Vibration,
    Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/store/Task/category';
import { addTask, setTasks } from '@/store/Task/task';
import { defaultCategories } from '@/constants/GeneralData';
import { colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeDataLocalStorage, getDataLocalStorage } from '@/utils/storage';

import FloatingActionButton from './FloatingActionButton';
import TaskFormModal from './TaskFormModal';

const { height: screenHeight } = Dimensions.get('window');

/**
 * Main AddTaskButton component that manages task creation
 * Orchestrates all sub-components for adding new tasks
 */
const AddTaskButton = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.display_tasks);
    const categories = useSelector((state) => state.category.categories);
    
    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    
    // Task state with today's date as default
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        category: "Inbox",
        priority: "medium",
        reminder: false,
        tag: "Inbox",
        dueDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        dueTime: null,
    });
    
    // Animation refs
    const addButtonScale = useRef(new Animated.Value(1)).current;
    const addButtonRotation = useRef(new Animated.Value(0)).current;

    /**
     * Initialize categories and load tasks on component mount
     */
    useEffect(() => {
        const initializeCategories = async () => {
            try {
                const storedCategories = await AsyncStorage.getItem('categories');
                
                if (!storedCategories) {
                    const nonExistingCategories = defaultCategories.filter(
                        category => !categories.some(c => c.name === category.name) && category.name !== 'all'
                    );
                    
                    if (nonExistingCategories.length > 0) {
                        await AsyncStorage.setItem('categories', JSON.stringify(nonExistingCategories));
                        dispatch(setCategories(nonExistingCategories));
                    }
                } else {
                    const parsedCategories = JSON.parse(storedCategories);
                    const categoriesToAdd = parsedCategories.filter(
                        category => !categories.some(c => c.name === category.name)
                    );
                    
                    if (categoriesToAdd.length > 0) {
                        dispatch(setCategories(categoriesToAdd));
                    }
                }
            } catch (error) {
                console.error('Error managing default categories:', error);
            }
        };

        const loadTasks = async () => {
            try {
                const storedTasks = await getDataLocalStorage('task_list') || [];
                if (storedTasks && storedTasks.length > 0) {
                    dispatch(setTasks(storedTasks));
                }
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        };

        initializeCategories();
        loadTasks();
    }, [dispatch]);

    /**
     * Handle add button press with animations
     */
    const handleAddPress = () => {
        // Haptic feedback
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }

        // Button press animation
        Animated.sequence([
            Animated.timing(addButtonScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(addButtonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Rotate add button
        Animated.timing(addButtonRotation, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
        }).start();

        setModalVisible(true);
    };

    /**
     * Handle modal close with animations
     */
    const handleCloseModal = () => {
        // Reset add button rotation
        Animated.timing(addButtonRotation, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        setModalVisible(false);
        
        // Reset task state with today's date as default
        setNewTask({
            title: "",
            description: "",
            category: "Inbox",
            priority: "medium",
            reminder: false,
            tag: "Inbox",
            dueDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
            dueTime: null,
        });
    };

    /**
     * Update task state
     */
    const updateTask = (updates) => {
        setNewTask(prev => ({ ...prev, ...updates }));
    };

    // Add button rotation interpolation
    const addButtonRotationInterpolate = addButtonRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.container}>
            <FloatingActionButton
                onPress={handleAddPress}
                scale={addButtonScale}
                rotation={addButtonRotationInterpolate}
            />
            
            <TaskFormModal
                visible={modalVisible}
                onClose={handleCloseModal}
                task={newTask}
                onUpdateTask={updateTask}
                dispatch={dispatch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Container styles if needed
    },
});

export default AddTaskButton;