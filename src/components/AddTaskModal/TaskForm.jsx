import { 
    View, 
    Text,
    TextInput,
    StyleSheet,
    Animated
} from 'react-native';
import { colors } from '@/constants/Colors';

/**
 * TaskForm component - Compact form inputs for task title and description
 * Handles basic task information input with animated focus states
 */
const TaskForm = ({ 
    newTask, 
    setNewTask, 
    inputFocusAnim, 
    onInputFocus, 
    onInputBlur
}) => {
    // Animated input border color
    const inputBorderColor = inputFocusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary],
    });

    return (
        <View style={styles.container}>
            {/* Task Title Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Task Title</Text>
                <Animated.View style={[styles.inputContainer, { borderColor: inputBorderColor }]}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter task title..."
                        placeholderTextColor={colors.textSecondary}
                        value={newTask.title}
                        onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                        multiline={false}
                        maxLength={100}
                    />
                </Animated.View>
            </View>

            {/* Task Description Input - Made more compact */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description (Optional)</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.textInput, styles.descriptionInput]}
                        placeholder="Add description..."
                        placeholderTextColor={colors.textSecondary}
                        value={newTask.description}
                        onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                        multiline={true}
                        numberOfLines={2}
                        maxLength={500}
                        textAlignVertical="top"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 6,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.cardBackground,
    },
    textInput: {
        fontSize: 14,
        color: colors.text,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 40,
    },
    descriptionInput: {
        minHeight: 60,
        maxHeight: 80,
    },
});

export default TaskForm;