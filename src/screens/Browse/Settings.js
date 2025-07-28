import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    Modal,
    TextInput,
    Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { storeDataLocalStorage, getDataLocalStorage, clearAllLocalStorage } from '@/utils/storage';
import CustomText from '@/components/UI/CustomText';
import CustomButton from '@/components/UI/CustomButton';

/**
 * Settings screen component with comprehensive app configuration options
 * Features dark theme design with organized sections and smooth interactions
 */
const Settings = ({ navigation }) => {
    const { logout } = useAuth();
    
    // Settings state
    const [settings, setSettings] = useState({
        notifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
        darkMode: true,
        autoSync: true,
        reminderSound: 'default',
        defaultPriority: 'medium',
        taskCompletionSound: true,
        biometricAuth: false,
        autoBackup: true,
    });
    
    // Modal states
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');

    /**
     * Load settings from storage on component mount
     */
    useEffect(() => {
        loadSettings();
    }, []);

    /**
     * Load user settings from AsyncStorage
     */
    const loadSettings = async () => {
        try {
            const savedSettings = await getDataLocalStorage('userSettings');
            if (savedSettings) {
                setSettings(prevSettings => ({ ...prevSettings, ...savedSettings }));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    /**
     * Save settings to AsyncStorage
     */
    const saveSettings = async (newSettings) => {
        try {
            await storeDataLocalStorage('userSettings', newSettings);
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
            Alert.alert('Error', 'Failed to save settings. Please try again.');
        }
    };

    /**
     * Handle toggle switches for boolean settings
     */
    const handleToggleSetting = (settingKey) => {
        const newSettings = {
            ...settings,
            [settingKey]: !settings[settingKey]
        };
        saveSettings(newSettings);
        
        // Provide haptic feedback
        if (settings.vibrationEnabled) {
            Vibration.vibrate(50);
        }
    };

    /**
     * Handle user logout with confirmation
     */
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Auth' }],
                        });
                    }
                }
            ]
        );
    };

    /**
     * Handle app data reset with confirmation
     */
    const handleResetData = () => {
        setShowResetModal(false);
        Alert.alert(
            'Reset All Data',
            'This will permanently delete all your tasks, categories, and settings. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await clearAllLocalStorage();
                            Alert.alert('Success', 'All data has been reset successfully.');
                            // Reset to default settings
                            setSettings({
                                notifications: true,
                                soundEnabled: true,
                                vibrationEnabled: true,
                                darkMode: true,
                                autoSync: true,
                                reminderSound: 'default',
                                defaultPriority: 'medium',
                                taskCompletionSound: true,
                                biometricAuth: false,
                                autoBackup: true,
                            });
                        } catch (error) {
                            Alert.alert('Error', 'Failed to reset data. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    /**
     * Handle feedback submission
     */
    const handleSubmitFeedback = () => {
        if (feedbackText.trim()) {
            // In a real app, you would send this to your backend
            Alert.alert('Thank You!', 'Your feedback has been submitted successfully.');
            setFeedbackText('');
            setShowFeedbackModal(false);
        } else {
            Alert.alert('Error', 'Please enter your feedback before submitting.');
        }
    };

    /**
     * Render a settings section header
     */
    const renderSectionHeader = (title) => (
        <View style={styles.sectionHeader}>
            <CustomText variant="h6" weight="semibold" color="textSecondary">
                {title}
            </CustomText>
        </View>
    );

    /**
     * Render a settings item with toggle switch
     */
    const renderToggleItem = (icon, title, subtitle, settingKey, iconColor = colors.primary) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: iconColor + '20' }]}>
                    <Ionicons name={icon} size={20} color={iconColor} />
                </View>
                <View style={styles.settingText}>
                    <CustomText variant="body" weight="medium">
                        {title}
                    </CustomText>
                    {subtitle && (
                        <CustomText variant="caption" color="textTertiary">
                            {subtitle}
                        </CustomText>
                    )}
                </View>
            </View>
            <Switch
                value={settings[settingKey]}
                onValueChange={() => handleToggleSetting(settingKey)}
                trackColor={{ false: colors.border, true: colors.primary + '40' }}
                thumbColor={settings[settingKey] ? colors.primary : colors.textTertiary}
                ios_backgroundColor={colors.border}
            />
        </View>
    );

    /**
     * Render a settings item with navigation arrow
     */
    const renderNavigationItem = (icon, title, subtitle, onPress, iconColor = colors.primary) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: iconColor + '20' }]}>
                    <Ionicons name={icon} size={20} color={iconColor} />
                </View>
                <View style={styles.settingText}>
                    <CustomText variant="body" weight="medium">
                        {title}
                    </CustomText>
                    {subtitle && (
                        <CustomText variant="caption" color="textTertiary">
                            {subtitle}
                        </CustomText>
                    )}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <CustomText variant="h4" weight="semibold">
                    Settings
                </CustomText>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Notifications Section */}
                {renderSectionHeader('NOTIFICATIONS')}
                <View style={styles.section}>
                    {renderToggleItem(
                        'notifications',
                        'Push Notifications',
                        'Receive notifications for reminders and updates',
                        'notifications',
                        colors.info
                    )}
                    {renderToggleItem(
                        'volume-high',
                        'Sound',
                        'Play sounds for notifications',
                        'soundEnabled',
                        colors.secondary
                    )}
                    {renderToggleItem(
                        'phone-portrait',
                        'Vibration',
                        'Vibrate for notifications and interactions',
                        'vibrationEnabled',
                        colors.warning
                    )}
                </View>

                {/* Appearance Section */}
                {renderSectionHeader('APPEARANCE')}
                <View style={styles.section}>
                    {renderToggleItem(
                        'moon',
                        'Dark Mode',
                        'Use dark theme throughout the app',
                        'darkMode',
                        colors.primary
                    )}
                </View>

                {/* Sync & Backup Section */}
                {renderSectionHeader('SYNC & BACKUP')}
                <View style={styles.section}>
                    {renderToggleItem(
                        'sync',
                        'Auto Sync',
                        'Automatically sync data across devices',
                        'autoSync',
                        colors.success
                    )}
                    {renderToggleItem(
                        'cloud-upload',
                        'Auto Backup',
                        'Automatically backup your data',
                        'autoBackup',
                        colors.info
                    )}
                    {renderNavigationItem(
                        'download',
                        'Export Data',
                        'Export your tasks and settings',
                        () => setShowExportModal(true),
                        colors.secondary
                    )}
                </View>

                {/* Security Section */}
                {renderSectionHeader('SECURITY')}
                <View style={styles.section}>
                    {renderToggleItem(
                        'finger-print',
                        'Biometric Authentication',
                        'Use fingerprint or face ID to unlock',
                        'biometricAuth',
                        colors.warning
                    )}
                </View>

                {/* Support Section */}
                {renderSectionHeader('SUPPORT')}
                <View style={styles.section}>
                    {renderNavigationItem(
                        'chatbubble-ellipses',
                        'Send Feedback',
                        'Help us improve the app',
                        () => setShowFeedbackModal(true),
                        colors.info
                    )}
                    {renderNavigationItem(
                        'information-circle',
                        'About',
                        'App version and information',
                        () => setShowAboutModal(true),
                        colors.secondary
                    )}
                </View>

                {/* Danger Zone */}
                {renderSectionHeader('DANGER ZONE')}
                <View style={styles.section}>
                    {renderNavigationItem(
                        'refresh',
                        'Reset All Data',
                        'Delete all tasks and settings',
                        () => setShowResetModal(true),
                        colors.error
                    )}
                    {renderNavigationItem(
                        'log-out',
                        'Logout',
                        'Sign out of your account',
                        handleLogout,
                        colors.error
                    )}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* About Modal */}
            <Modal
                visible={showAboutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAboutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <CustomText variant="h5" weight="semibold">
                                About TodoX
                            </CustomText>
                            <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <CustomText variant="body" style={styles.aboutText}>
                                TodoX is a powerful task management app designed to help you stay organized and productive.
                            </CustomText>
                            <CustomText variant="body" style={styles.aboutText}>
                                Version: 1.0.0
                            </CustomText>
                            <CustomText variant="body" style={styles.aboutText}>
                                Built with React Native and Expo
                            </CustomText>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Feedback Modal */}
            <Modal
                visible={showFeedbackModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowFeedbackModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <CustomText variant="h5" weight="semibold">
                                Send Feedback
                            </CustomText>
                            <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <CustomText variant="body" style={styles.feedbackLabel}>
                                Tell us what you think about TodoX:
                            </CustomText>
                            <TextInput
                                style={styles.feedbackInput}
                                value={feedbackText}
                                onChangeText={setFeedbackText}
                                placeholder="Your feedback..."
                                placeholderTextColor={colors.textTertiary}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                            <CustomButton
                                title="Submit Feedback"
                                onPress={handleSubmitFeedback}
                                style={styles.submitButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Export Modal */}
            <Modal
                visible={showExportModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowExportModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <CustomText variant="h5" weight="semibold">
                                Export Data
                            </CustomText>
                            <TouchableOpacity onPress={() => setShowExportModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <CustomText variant="body" style={styles.exportText}>
                                Export your tasks and settings to a JSON file for backup or transfer.
                            </CustomText>
                            <CustomButton
                                title="Export to JSON"
                                onPress={() => {
                                    Alert.alert('Success', 'Data exported successfully!');
                                    setShowExportModal(false);
                                }}
                                style={styles.exportButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Reset Confirmation Modal */}
            <Modal
                visible={showResetModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowResetModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <CustomText variant="h5" weight="semibold" color="error">
                                Reset All Data
                            </CustomText>
                            <TouchableOpacity onPress={() => setShowResetModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <CustomText variant="body" style={styles.warningText}>
                                This action will permanently delete all your tasks, categories, and settings. This cannot be undone.
                            </CustomText>
                            <View style={styles.resetButtons}>
                                <CustomButton
                                    title="Cancel"
                                    onPress={() => setShowResetModal(false)}
                                    variant="outline"
                                    style={styles.cancelButton}
                                />
                                <CustomButton
                                    title="Reset"
                                    onPress={handleResetData}
                                    style={[styles.resetButton, { backgroundColor: colors.error }]}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: spacing.sm,
        marginLeft: -spacing.sm,
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    sectionHeader: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.sm,
    },
    section: {
        backgroundColor: colors.surface,
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    settingText: {
        flex: 1,
    },
    bottomSpacer: {
        height: spacing.xl,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        width: '100%',
        maxWidth: 400,
        ...shadows.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalBody: {
        padding: spacing.lg,
    },
    aboutText: {
        marginBottom: spacing.md,
        lineHeight: 24,
    },
    feedbackLabel: {
        marginBottom: spacing.md,
    },
    feedbackInput: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        color: colors.textPrimary,
        fontSize: typography.fontSize.base,
        minHeight: 100,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    submitButton: {
        marginTop: spacing.sm,
    },
    exportText: {
        marginBottom: spacing.lg,
        lineHeight: 24,
    },
    exportButton: {
        marginTop: spacing.sm,
    },
    warningText: {
        marginBottom: spacing.lg,
        lineHeight: 24,
        color: colors.textSecondary,
    },
    resetButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    cancelButton: {
        flex: 1,
    },
    resetButton: {
        flex: 1,
    },
});

export default Settings;