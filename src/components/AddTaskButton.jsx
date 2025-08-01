import React, { useState, useRef } from 'react';
import { 
    View, 
    TouchableOpacity, 
    StyleSheet,
    Animated,
    Easing,
    Platform,
    Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import AddTaskModal from './AddTaskModal/AddTaskModal'; // Fixed: Changed from named import to default import

/**
 * AddTaskButton component - Floating action button for adding new tasks
 * Displays a simple button that opens the AddTaskModal when pressed
 */
const AddTaskButton = () => {
    const [modalVisible, setModalVisible] = useState(false);
    
    // Animation refs
    const addButtonScale = useRef(new Animated.Value(1)).current;
    const addButtonRotation = useRef(new Animated.Value(0)).current;

    /**
     * Handle add button press with animations and haptic feedback
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
     * Handle modal close and reset button rotation
     */
    const handleModalClose = () => {
        // Reset add button rotation
        Animated.timing(addButtonRotation, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        setModalVisible(false);
    };

    // Add button rotation interpolation
    const addButtonRotationInterpolate = addButtonRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.container}>
            {/* Enhanced Add Button */}
            <Animated.View
                style={[
                    styles.addButton,
                    {
                        transform: [
                            { scale: addButtonScale },
                            { rotate: addButtonRotationInterpolate }
                        ]
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.addButtonTouchable}
                    onPress={handleAddPress}
                    activeOpacity={0.8}
                >
                    <Ionicons 
                        name="add" 
                        size={28} 
                        color={colors.white} 
                    />
                </TouchableOpacity>
            </Animated.View>

            {/* Add Task Modal */}
            <AddTaskModal 
                visible={modalVisible} 
                onClose={handleModalClose} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        zIndex: 1000,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    addButtonTouchable: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AddTaskButton;