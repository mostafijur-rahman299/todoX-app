import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';


function Filter({ 
    setSelectedCategory, 
    setSelectedPriority,
    searchText, 
    setSearchText, 
    selectedCategory, 
    selectedPriority,
    openModal,
    closeModal
}) {

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const categories = [
        { id: 'all', icon: 'apps' },
        { id: 'work', icon: 'briefcase' },
        { id: 'shopping', icon: 'cart' },
        { id: 'other', icon: 'ellipsis-horizontal' }
    ];

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
                    </View>
                    <View style={styles.filterGroups}>
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Category</Text>
                            <TouchableOpacity 
                                style={styles.categorySelect}
                                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                <Ionicons 
                                    name={categories.find(c => c.id === selectedCategory)?.icon || 'apps'} 
                                    size={20} 
                                    color={colors.text} 
                                />
                                <Text style={styles.categorySelectText}>
                                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                                </Text>
                                <Ionicons 
                                    name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
                                    size={20} 
                                    color={colors.darkGray} 
                                />
                            </TouchableOpacity>
                            
                            {showCategoryDropdown && (
                                <ScrollView style={styles.dropdownMenu}>
                                    {categories.map(({id, icon}) => (
                                        <TouchableOpacity
                                            key={id}
                                            style={[
                                                styles.dropdownItem,
                                                selectedCategory === id && styles.selectedDropdownItem
                                            ]}
                                            onPress={() => {
                                                setSelectedCategory(id);
                                                setShowCategoryDropdown(false);
                                            }}
                                        >
                                            <Ionicons name={icon} size={20} color={selectedCategory === id ? 'white' : colors.text} />
                                            <Text style={[
                                                styles.dropdownItemText,
                                                selectedCategory === id && styles.selectedDropdownItemText
                                            ]}>
                                                {id.charAt(0).toUpperCase() + id.slice(1)}
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
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
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
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
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
    }
})
