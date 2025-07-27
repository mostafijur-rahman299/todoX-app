import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { setDisplayTasks } from '@/store/Task/task';


function Filter({ openModal, closeModal }) {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [showCompletedTasks, setShowCompletedTasks] = useState(true);
    const [showActiveTasks, setShowActiveTasks] = useState(true);
    const dispatch = useDispatch();
    const retainedTasks = useSelector((state) => state.task.task_list);
    const displayTasks = useSelector((state) => state.task.display_tasks);
    const categories = useSelector((state) => state.category.categories);


    // Reset all filters
    const resetFilters = () => {
        setSelectedCategory('all');
        setSelectedPriority('all');
        setShowCompletedTasks(true);
        setShowActiveTasks(true);
    };

    // Render priority filter buttons
    const renderPriorityFilters = () => {
        const priorities = [
            { id: 'all', color: colors.text },
            { id: 'high', color: colors.red },
            { id: 'medium', color: colors.orange },
            { id: 'low', color: colors.green }
        ];

        return priorities.map(({ id, color }) => (
            <TouchableOpacity
                key={id}
                style={[
                    styles.filterButton,
                    selectedPriority === id && styles.activeFilterButton,
                    id !== 'all' && { borderColor: color }
                ]}
                onPress={() => setSelectedPriority(id)}
            >
                {id !== 'all' && (
                    <View style={[styles.priorityDot, { backgroundColor: color }]} />
                )}
                <Text style={[
                    styles.filterButtonText,
                    selectedPriority === id && styles.activeFilterButtonText
                ]}>
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                </Text>
            </TouchableOpacity>
        ));
    };

    // Handle category selection
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setShowCategoryDropdown(false);
    };

    // Toggle category dropdown
    const toggleCategoryDropdown = () => {
        setShowCategoryDropdown(!showCategoryDropdown);
    };

    // Get current category icon
    const getCurrentCategoryIcon = () => {
        return categories.find(c => c.id === selectedCategory)?.icon || 'apps';
    };

    // Format text to capitalize first letter
    const formatText = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    // Filter tasks based on selected category
    useEffect(() => {
        let filteredTasks = [...retainedTasks];
        
        // Filter by category
        if (selectedCategory !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.category === selectedCategory);
        }
        
        // Filter by priority
        if (selectedPriority !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.priority === selectedPriority);
        }
        
        // Filter by completion status
        if (showCompletedTasks && !showActiveTasks) {
            // Show only completed tasks
            filteredTasks = filteredTasks.filter(task => task.is_completed === true);
        } else if (showActiveTasks && !showCompletedTasks) {
            // Show only active tasks
            filteredTasks = filteredTasks.filter(task => task.is_completed === false);
        } else if (!showActiveTasks && !showCompletedTasks) {
            // If both are unchecked, show no tasks
            filteredTasks = [];
        }
        
        dispatch(setDisplayTasks(filteredTasks));
    }, [selectedCategory, selectedPriority, showCompletedTasks, showActiveTasks, retainedTasks, dispatch]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={openModal}
        >
            <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPress={closeModal}
            >
                <View 
                    style={styles.filterSection}
                    onStartShouldSetResponder={() => true}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <View style={styles.modalHeader}>
                        <View style={styles.handleBar} />
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={closeModal}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.filterActions} onPress={resetFilters}>
                            <Ionicons name="refresh" size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.filterGroups}>
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Category</Text>
                            <TouchableOpacity 
                                style={styles.categorySelect}
                                onPress={toggleCategoryDropdown}
                            >
                                <Ionicons 
                                    name={getCurrentCategoryIcon()} 
                                    size={20} 
                                    color={colors.text} 
                                />
                                <Text style={styles.categorySelectText}>
                                    {formatText(selectedCategory)}
                                </Text>
                                <Ionicons 
                                    name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
                                    size={20} 
                                    color={colors.darkGray} 
                                />
                            </TouchableOpacity>
                            
                            {showCategoryDropdown && (
                                <ScrollView style={styles.dropdownMenu}>
                                    {categories.map(({id, name}) => (
                                        <TouchableOpacity
                                            key={id}
                                            style={[
                                                styles.dropdownItem,
                                                selectedCategory === name && styles.selectedDropdownItem
                                            ]}
                                            onPress={() => handleCategorySelect(name)}
                                        >
                                            <Text style={[
                                                styles.dropdownItemText,
                                                selectedCategory === name && styles.selectedDropdownItemText,
                                                {color: colors.text}
                                            ]}>
                                                {formatText(name)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Priority</Text>
                            <View style={styles.filterButtonsContainer}>
                                {renderPriorityFilters()}
                            </View>
                        </View>
                        
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Task Status</Text>
                            <TouchableOpacity 
                                style={styles.toggleContainer}
                                onPress={() => setShowCompletedTasks(!showCompletedTasks)}
                            >
                                <Text style={styles.toggleText}>Show completed tasks</Text>
                                <View style={[
                                    styles.toggleSwitch, 
                                    showCompletedTasks && styles.toggleSwitchActive
                                ]}>
                                    <View style={[
                                        styles.toggleKnob, 
                                        showCompletedTasks && styles.toggleKnobActive
                                    ]} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.toggleContainer}
                                onPress={() => setShowActiveTasks(!showActiveTasks)}
                            >
                                <Text style={styles.toggleText}>Show Active tasks</Text>
                                <View style={[
                                    styles.toggleSwitch, 
                                    showActiveTasks && styles.toggleSwitchActive
                                ]}>
                                    <View style={[
                                        styles.toggleKnob, 
                                        showActiveTasks && styles.toggleKnobActive
                                    ]} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.filterStats}>
                        <Text style={styles.filterStatsText}>
                            Showing {displayTasks.length} of {retainedTasks.length} tasks
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

export default Filter;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    filterSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: -5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 20,
        height: 50,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 15,
        color: colors.text,
    },
    filterGroups: {
        gap: 24,
    },
    filterGroup: {
        gap: 12,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginLeft: 4,
    },
    categorySelect: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 14,
        borderRadius: 12,
        gap: 12,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categorySelectText: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
    },
    dropdownMenu: {
        backgroundColor: colors.background,
        borderRadius: 12,
        marginTop: 8,
        padding: 6,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        height: 180,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 10,
        gap: 12,
    },
    selectedDropdownItem: {
        backgroundColor: colors.primary,
    },
    dropdownItemText: {
        fontSize: 15,
        color: colors.text,
    },
    selectedDropdownItemText: {
        color: 'white',
    },
    filterButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: colors.background,
        borderWidth: 1.5,
        borderColor: 'transparent',
        gap: 8,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    filterButtonText: {
        fontSize: 13,
        color: colors.text,
        fontWeight: '500',
    },
    activeFilterButton: {
        backgroundColor: colors.primary,
    },
    activeFilterButtonText: {
        color: 'white',
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 14,
        borderRadius: 12,
    },
    toggleText: {
        fontSize: 15,
        color: colors.text,
    },
    toggleSwitch: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E0E0E0',
        padding: 2,
    },
    toggleSwitchActive: {
        backgroundColor: colors.primary,
    },
    toggleKnob: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleKnobActive: {
        transform: [{ translateX: 22 }],
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        gap: 5,
        paddingHorizontal: 12,
        position: 'absolute',
        right: 40,
        top: -35,
        zIndex: 1000000,
    },
    filterStats: {
        marginTop: 16,
        alignItems: 'center',
    },
    filterStatsText: {
        color: colors.darkGray,
        fontSize: 13,
    }
})
