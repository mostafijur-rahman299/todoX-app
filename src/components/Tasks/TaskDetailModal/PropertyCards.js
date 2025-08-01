import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * Property cards component for date, priority, and category
 * Displays task properties in card format with edit capabilities
 */
const PropertyCards = ({ 
    task,
    isEditing,
    currentPriority,
    currentInbox,
    dateTimeDisplay,
    onDateTimeToggle,
    onPriorityToggle,
    onInboxToggle,
    onClearDateTime
}) => {
    return (
        <View style={styles.propertyCards}>
            {/* Compact Selectors Row */}
            <View style={styles.selectorsRow}>
                {/* Date Selector */}
                <TouchableOpacity 
                    style={[
                        styles.compactSelector,
                        task.dueDate && styles.selectorActive
                    ]}
                    onPress={isEditing ? onDateTimeToggle : null}
                    disabled={!isEditing}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name="calendar-outline" 
                        size={16} 
                        color={task.dueDate ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                        styles.selectorText, 
                        { color: task.dueDate ? colors.primary : colors.textSecondary }
                    ]}>
                        {dateTimeDisplay}
                    </Text>
                    {task.dueDate && (
                        <TouchableOpacity
                            onPress={onClearDateTime}
                            style={styles.clearButton}
                        >
                            <Ionicons
                                name="close-circle"
                                size={14}
                                color={colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>

                {/* Priority Selector */}
                <TouchableOpacity 
                    style={styles.compactSelector}
                    onPress={isEditing ? onPriorityToggle : null}
                    disabled={!isEditing}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name="flag-outline" 
                        size={16} 
                        color={currentPriority.color} 
                    />
                    <Text style={[styles.selectorText, { color: currentPriority.color }]}>
                        {currentPriority.value[0].toUpperCase() + currentPriority.value.slice(1)}
                    </Text>
                    {isEditing && (
                        <Ionicons 
                            name="chevron-down" 
                            size={14} 
                            color={colors.textSecondary} 
                        />
                    )}
                </TouchableOpacity>

                {/* Category Selector */}
                <TouchableOpacity 
                    style={styles.compactSelector}
                    onPress={isEditing ? onInboxToggle : null}
                    disabled={!isEditing}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={currentInbox.icon} 
                        size={16} 
                        color={currentInbox.color} 
                    />
                    <Text style={[styles.selectorText, { color: currentInbox.color }]}>
                        {currentInbox.label}
                    </Text>
                    {isEditing && (
                        <Ionicons 
                            name="chevron-down" 
                            size={14} 
                            color={colors.textSecondary} 
                        />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    propertyCards: {
        marginBottom: 16,
    },
    selectorsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    compactSelector: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 10,
        paddingHorizontal: 8,
        gap: 6,
    },
    selectorActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    selectorText: {
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
        textAlign: 'center',
    },
    clearButton: {
        padding: 2,
    },
});

export default PropertyCards;