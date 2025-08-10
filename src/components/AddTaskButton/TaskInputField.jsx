import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';

/**
 * Task input field component
 * Handles task title input
 */
const TaskInputField = ({ task, onUpdateTask, onFocus, onBlur }) => {
    return (
        <View style={styles.inputContainer}>
            <View
                style={[
                    styles.checkboxInner,
                    { borderColor: colors.success },
                ]}
            />
            <TextInput
                style={styles.input}
                placeholder="Task name"
                placeholderTextColor={colors.textTertiary}
                value={task?.title || ''}
                onChangeText={(text) =>
                    onUpdateTask({ ...task, title: text })
                }
                onFocus={onFocus}
                onBlur={onBlur}
                multiline={false}
                returnKeyType="done"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: colors.background,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
    },
    checkboxInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        marginLeft: 10,
        fontWeight: '500',
    },
});

export default TaskInputField;