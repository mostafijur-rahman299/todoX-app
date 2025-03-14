import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';


function Filter({ 
    setSelectedCategory, 
    setSelectedPriority,
    searchText, 
    setSearchText, 
    selectedCategory, 
    selectedPriority 
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
        <View style={styles.filterSection}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={colors.darkGray} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search tasks..."
                    placeholderTextColor={colors.darkGray}
                />
                {searchText !== '' && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <Ionicons name="close-circle" size={20} color={colors.darkGray} />
                    </TouchableOpacity>
                )}
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
    )
}

export default Filter;

const styles = StyleSheet.create({
    filterSection: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        margin: 10,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 15,
        color: colors.text,
    },
    filterGroups: {
        gap: 15,
    },
    filterGroup: {
        gap: 8,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginLeft: 4,
    },
    categorySelect: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 8,
        gap: 10,
    },
    categorySelectText: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
    },
    dropdownMenu: {
        backgroundColor: colors.background,
        borderRadius: 8,
        marginTop: 4,
        padding: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height: 150
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 6,
        gap: 10,
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
        gap: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: 'transparent',
        gap: 6,
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
