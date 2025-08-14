import { useEffect, useState, useRef } from 'react';
import { 
    View, 
    StyleSheet,
    Animated,
    Easing,
    Platform,
    Vibration
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/store/Task/category';
import { defaultCategories } from '@/constants/GeneralData';
import { getFirstFreeSlot } from '@/utils/gnFunc';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FloatingActionButton from './FloatingActionButton';
import TaskFormModal from './TaskFormModal';

/**
 * Main AddTaskButton component that manages task creation
 * Orchestrates all sub-components for adding new tasks
 */
const AddTaskButton = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.category.categories);
    
    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    
    // Task state with today's date as default
    const [newTask, setNewTask] = useState({
        title: "",
        summary: "",
        category: "Inbox",
        priority: "medium",
        reminder: false,
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        startTime: null,
        endTime: null,
        subTask: [],
    });
    
    // Animation refs
    const addButtonScale = useRef(new Animated.Value(1)).current;
    const addButtonRotation = useRef(new Animated.Value(0)).current;
    const tasks = useSelector((state) => state.task.task_list);

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

        initializeCategories();
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

        try{
            const taskDate = newTask.date || new Date().toISOString().split('T')[0];
            const task_list = tasks.filter((item) => item.date === taskDate);
            const firstFreeSlot = getFirstFreeSlot(task_list);

            if (firstFreeSlot) {
                setNewTask({
                    ...newTask,
                    startTime: firstFreeSlot.startTime,
                    endTime: firstFreeSlot.endTime,
                });
            }
        }catch(error){
            console.log(error)
        }

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
            summary: "",
            category: "Inbox",
            priority: "medium",
            reminder: false,
            date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
            startTime: null,
            endTime: null,
            subTask: [],
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