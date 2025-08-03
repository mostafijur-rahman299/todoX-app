import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * Floating Action Button component for adding new tasks
 * Features animated scaling and rotation effects
 */
const FloatingActionButton = ({ onPress, scale, rotation }) => {
    return (
        <Animated.View
            style={[
                styles.addButtonContainer,
                {
                    transform: [
                        { scale: scale },
                        { rotate: rotation },
                    ],
                },
            ]}>
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={24} color={colors.white} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    addButtonContainer: {
        position: 'absolute',
        bottom: 30,
        right: 20,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
});

export default FloatingActionButton;