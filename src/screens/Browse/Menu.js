import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '@/components/UI/CustomAlert';

/**
 * Browse screen component - navigation and menu options
 * Provides access to different sections and settings
 */
const BrowseMenu = () => {
    const navigation = useNavigation();
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        icon: null,
        buttons: []
    });

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
            isPremium: true,
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
     * Show custom alert with configuration
     */
    const showAlert = (config) => {
        setAlertConfig({
            visible: true,
            ...config
        });
    };

    /**
     * Hide custom alert
     */
    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    /**
     * Show coming soon alert for features under development
     */
    const showComingSoonAlert = (featureName, description) => {
        showAlert({
            title: `${featureName} Coming Soon!`,
            message: description || `We're working hard to bring you ${featureName.toLowerCase()}. Stay tuned for updates!`,
            type: 'coming-soon',
            icon: 'rocket',
            buttons: [
                {
                    text: 'Got it!',
                    style: 'primary',
                    onPress: hideAlert
                }
            ]
        });
    };

    /**
     * Show pro feature alert
     */
    const showProAlert = (featureName) => {
        showAlert({
            title: 'Pro Feature',
            message: `${featureName} is available in TodoX Pro. Upgrade now to unlock advanced features and boost your productivity!`,
            type: 'warning',
            icon: 'star',
            buttons: [
                {
                    text: 'Maybe Later',
                    style: 'outline',
                    onPress: hideAlert
                },
                {
                    text: 'Upgrade Now',
                    style: 'primary',
                    onPress: () => {
                        hideAlert();
                        // Navigate to upgrade screen when implemented
                        setTimeout(() => {
                            showComingSoonAlert('Pro Upgrade', 'The upgrade system is being finalized. You\'ll be notified when it\'s ready!');
                        }, 300);
                    }
                }
            ]
        });
    };

    /**
     * Handle menu item navigation
     */
    const handleMenuItemPress = (itemId) => {
        switch (itemId) {
            case 'projects':
                showComingSoonAlert('Projects', 'Organize your tasks into projects for better workflow management.');
                break;
            case 'labels':
                showComingSoonAlert('Labels', 'Tag and categorize your tasks with custom labels for easy filtering.');
                break;
            case 'filters':
                showComingSoonAlert('Advanced Filters', 'Create custom filters to view exactly the tasks you need.');
                break;
            case 'completed':
                // Navigate to completed tasks
                navigation.navigate('CompletedTask');
                break;
            case 'trash':
                showComingSoonAlert('Trash', 'Recover accidentally deleted tasks from the trash.');
                break;
            case 'settings':
                navigation.navigate('Settings');
                break;
            case 'help':
                // Navigate to help screen
                navigation.navigate('HelpAndFeedback');
                break;
            case 'upgrade':
                showProAlert('TodoX Pro');
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
                {/* <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
                </TouchableOpacity> */}
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

            {/* Custom Alert */}
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                icon={alertConfig.icon}
                buttons={alertConfig.buttons}
                onDismiss={hideAlert}
            />
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

export default BrowseMenu;