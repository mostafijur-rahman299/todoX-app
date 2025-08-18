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
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '@/components/UI/CustomAlert';

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
        // {
        //     id: 'projects',
        //     title: 'Projects',
        //     subtitle: 'Organize your workflow',
        //     icon: 'folder-outline',
        //     count: 3,
        //     color: colors.info,
        // },
        // {
        //     id: 'labels',
        //     title: 'Labels',
        //     subtitle: 'Tag and categorize',
        //     icon: 'pricetag-outline',
        //     count: 5,
        //     color: colors.secondary,
        // },
        {
            id: 'completed',
            title: 'Completed',
            subtitle: 'View finished tasks',
            icon: 'checkmark-circle-outline',
            color: colors.success,
        },
        // {
        //     id: 'trash',
        //     title: 'Trash',
        //     subtitle: 'Recover deleted items',
        //     icon: 'trash-outline',
        //     isPremium: true,
        //     color: colors.error,
        // },
    ];

    const settingsItems = [
        // {
        //     id: 'settings',
        //     title: 'Settings',
        //     subtitle: 'App preferences',
        //     icon: 'settings-outline',
        //     color: colors.textSecondary,
        // },
        {
            id: 'help',
            title: 'Help & Feedback',
            subtitle: 'Get support',
            icon: 'help-circle-outline',
            color: colors.textSecondary,
        },
        {
            id: 'upgrade',
            title: 'Upgrade to Pro',
            subtitle: 'Unlock premium features',
            icon: 'star-outline',
            isPro: true,
            color: colors.warning,
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
     * Render professional menu item with enhanced design
     */
    const renderMenuItem = (item) => (
        <TouchableOpacity 
            key={item.id} 
            style={[
                styles.menuItem,
                item.isPro && styles.proMenuItem,
                item.isPremium && styles.premiumMenuItem
            ]}
            onPress={() => handleMenuItemPress(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons 
                        name={item.icon} 
                        size={22} 
                        color={item.isPro ? colors.warning : item.color} 
                    />
                </View>
                <View style={styles.menuItemTextContainer}>
                    <Text style={[
                        styles.menuItemTitle,
                        item.isPro && styles.proText
                    ]}>
                        {item.title}
                        {item.isPremium && (
                            <View style={styles.premiumBadge}>
                                <Ionicons name="diamond" size={12} color={colors.warning} />
                            </View>
                        )}
                    </Text>
                    {item.subtitle && (
                        <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                </View>
            </View>
            <View style={styles.menuItemRight}>
                {item.count && (
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{item.count}</Text>
                    </View>
                )}
                <Ionicons 
                    name="chevron-forward" 
                    size={18} 
                    color={colors.textTertiary} 
                />
            </View>
        </TouchableOpacity>
    );

    /**
     * Render section header with professional styling
     */
    const renderSectionHeader = (title, subtitle) => (
        <View style={styles.sectionHeader}>
            {/* <Text style={styles.sectionTitle}>{title}</Text>
            {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>} */}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Professional Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>TodoX</Text>
                    <Text style={styles.headerSubtitle}>Explore your workspace</Text>
                </View>
            </View>

            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Main Menu Section */}
                {renderSectionHeader('Workspace', 'Manage your tasks and projects')}
                <View style={styles.section}>
                    {menuItems.map(renderMenuItem)}
                </View>

                {/* Settings Section */}
                {renderSectionHeader('Preferences', 'App settings and support')}
                <View style={styles.section}>
                    {settingsItems.map(renderMenuItem)}
                </View>

                {/* Enhanced App Info */}
                <View style={styles.appInfo}>
                    <View style={styles.appLogoContainer}>
                        <View style={styles.appLogo}>
                            <Ionicons name="checkmark-circle" size={32} color={colors.primary} />
                        </View>
                        <Text style={styles.appName}>TodoX</Text>
                        <Text style={styles.appTagline}>Professional Task Management</Text>
                    </View>
                    
                    <View style={styles.appDetails}>
                        <View style={styles.appDetailItem}>
                            <Text style={styles.appVersion}>Version 1.0.0</Text>
                            <Text style={styles.appBuild}>Build 2024.1</Text>
                        </View>
                        <Text style={styles.appDescription}>
                            Streamline your productivity with intelligent task organization and seamless workflow management.
                        </Text>
                    </View>
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
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerContent: {
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: typography.fontSize['lg'],
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    headerSubtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.lg,
    },
    sectionHeader: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    sectionSubtitle: {
        fontSize: typography.fontSize.xs,
        color: colors.textTertiary,
        fontWeight: typography.fontWeight.medium,
    },
    section: {
        paddingHorizontal: spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    proMenuItem: {
        borderColor: colors.warning,
        backgroundColor: `${colors.warning}08`,
    },
    premiumMenuItem: {
        borderColor: colors.error,
        backgroundColor: `${colors.error}08`,
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    menuItemTextContainer: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: typography.fontSize.sm,
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemSubtitle: {
        fontSize: typography.fontSize.xs,
        color: colors.textTertiary,
        fontWeight: typography.fontWeight.medium,
    },
    proText: {
        color: colors.warning,
    },
    premiumBadge: {
        marginLeft: spacing.xs,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    countBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        fontSize: typography.fontSize.xs,
        color: colors.white,
        fontWeight: typography.fontWeight.semibold,
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.md,
        marginTop: spacing.md,
    },
    appLogoContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    appLogo: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.xl,
        backgroundColor: `${colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    appName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    appTagline: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    appDetails: {
        alignItems: 'center',
        width: '100%',
    },
    appDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    appVersion: {
        fontSize: typography.fontSize.xs,
        color: colors.textTertiary,
        fontWeight: typography.fontWeight.medium,
    },
    appBuild: {
        fontSize: typography.fontSize.xs,
        color: colors.textTertiary,
        fontWeight: typography.fontWeight.medium,
        opacity: 0.7,
    },
    appDescription: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.fontSize.xs * 1.4,
        fontWeight: typography.fontWeight.medium,
        maxWidth: '90%',
    },
});

export default BrowseMenu;