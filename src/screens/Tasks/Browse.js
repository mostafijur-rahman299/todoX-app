import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';

/**
 * Browse screen component - navigation and menu options
 * Provides access to different sections and settings
 */
const Browse = () => {
    const navigation = useNavigation();

    const menuItems = [
        {
            id: 'projects',
            title: 'Projects',
            icon: 'folder-outline',
            count: 3,
        },
        {
            id: 'labels',
            title: 'Labels',
            icon: 'pricetag-outline',
            count: 5,
        },
        {
            id: 'filters',
            title: 'Filters & Labels',
            icon: 'funnel-outline',
        },
        {
            id: 'completed',
            title: 'Completed',
            icon: 'checkmark-circle-outline',
        },
        {
            id: 'trash',
            title: 'Trash',
            icon: 'trash-outline',
        },
    ];

    const settingsItems = [
        {
            id: 'settings',
            title: 'Settings',
            icon: 'settings-outline',
        },
        {
            id: 'help',
            title: 'Help & Feedback',
            icon: 'help-circle-outline',
        },
        {
            id: 'upgrade',
            title: 'Upgrade to Pro',
            icon: 'star-outline',
            isPro: true,
        },
    ];

    /**
     * Handle menu item navigation
     */
    const handleMenuItemPress = (itemId) => {
        switch (itemId) {
            case 'projects':
                // Navigate to projects screen (to be implemented)
                Alert.alert('Projects', 'Projects feature coming soon!');
                break;
            case 'labels':
                // Navigate to labels screen (to be implemented)
                Alert.alert('Labels', 'Labels feature coming soon!');
                break;
            case 'filters':
                // Navigate to filters screen (to be implemented)
                Alert.alert('Filters', 'Advanced filters coming soon!');
                break;
            case 'completed':
                // Navigate to completed tasks
                navigation.navigate('tasks', { screen: 'Inbox', params: { filter: 'completed' } });
                break;
            case 'trash':
                // Navigate to trash screen (to be implemented)
                Alert.alert('Trash', 'Trash feature coming soon!');
                break;
            case 'settings':
                // Navigate to settings screen (to be implemented)
                Alert.alert('Settings', 'Settings screen coming soon!');
                break;
            case 'help':
                // Navigate to help screen
                navigation.navigate('feedback');
                break;
            case 'upgrade':
                // Navigate to upgrade screen (to be implemented)
                Alert.alert('Upgrade to Pro', 'Pro features coming soon!');
                break;
            default:
                break;
        }
    };

    /**
     * Render menu item with navigation handler
     */
    const renderMenuItem = (item) => (
        <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item.id)}
        >
            <View style={styles.menuItemLeft}>
                <Ionicons 
                    name={item.icon} 
                    size={20} 
                    color={item.isPro ? colors.warning : colors.textSecondary} 
                />
                <Text style={[
                    styles.menuItemText,
                    item.isPro && styles.proText
                ]}>
                    {item.title}
                </Text>
            </View>
            <View style={styles.menuItemRight}>
                {item.count && (
                    <Text style={styles.countText}>{item.count}</Text>
                )}
                <Ionicons 
                    name="chevron-forward" 
                    size={16} 
                    color={colors.textTertiary} 
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Browse</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Main Menu Section */}
                <View style={styles.section}>
                    {menuItems.map(renderMenuItem)}
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Settings Section */}
                <View style={styles.section}>
                    {settingsItems.map(renderMenuItem)}
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appName}>TodoX</Text>
                    <Text style={styles.appVersion}>Version 1.0.0</Text>
                    <Text style={styles.appDescription}>
                        Organize your tasks and boost productivity
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    menuButton: {
        padding: 5,
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 16,
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 8,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuItemText: {
        fontSize: 16,
        color: colors.textPrimary,
        marginLeft: 12,
        fontWeight: '500',
    },
    proText: {
        color: colors.warning,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countText: {
        fontSize: 14,
        color: colors.textTertiary,
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 14,
        color: colors.textTertiary,
        marginBottom: 8,
    },
    appDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default Browse;