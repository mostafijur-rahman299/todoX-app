import React from 'react';
import { 
    Modal, 
    View, 
    StyleSheet, 
    TouchableOpacity, 
    TouchableWithoutFeedback,
    Animated,
    Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import { colors, spacing, borderRadius, shadows } from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Custom Alert component with beautiful design and animations
 * Provides consistent styling across the app with multiple alert types
 */
const CustomAlert = ({
    visible,
    title,
    message,
    type = 'info', // 'info', 'success', 'warning', 'error', 'coming-soon'
    icon,
    buttons = [],
    onDismiss,
    showCloseButton = true,
    animationType = 'fade'
}) => {
    const [scaleAnim] = React.useState(new Animated.Value(0));
    const [opacityAnim] = React.useState(new Animated.Value(0));

    /**
     * Handle animation when modal visibility changes
     */
    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    /**
     * Get alert configuration based on type
     * Returns icon, colors, and styling for different alert types
     */
    const getAlertConfig = () => {
        switch (type) {
            case 'success':
                return {
                    iconName: 'checkmark-circle',
                    iconColor: colors.success,
                    gradientColors: [colors.success + '10', colors.success + '05'],
                    borderColor: colors.success + '20'
                };
            case 'warning':
                return {
                    iconName: 'warning',
                    iconColor: colors.warning,
                    gradientColors: [colors.warning + '10', colors.warning + '05'],
                    borderColor: colors.warning + '20'
                };
            case 'error':
                return {
                    iconName: 'close-circle',
                    iconColor: colors.error,
                    gradientColors: [colors.error + '10', colors.error + '05'],
                    borderColor: colors.error + '20'
                };
            case 'coming-soon':
                return {
                    iconName: 'time',
                    iconColor: colors.primary,
                    gradientColors: colors.gradients.primary.map(color => color + '10'),
                    borderColor: colors.primary + '20'
                };
            default: // info
                return {
                    iconName: 'information-circle',
                    iconColor: colors.primary,
                    gradientColors: [colors.primary + '10', colors.primary + '05'],
                    borderColor: colors.primary + '20'
                };
        }
    };

    const config = getAlertConfig();
    const alertIcon = icon || config.iconName;

    /**
     * Handle backdrop press to dismiss modal
     */
    const handleBackdropPress = () => {
        if (onDismiss) {
            onDismiss();
        }
    };

    /**
     * Render alert buttons based on configuration
     * Supports single button, multiple buttons, or default OK button
     */
    const renderButtons = () => {
        if (buttons.length === 0) {
            return (
                <CustomButton
                    title="OK"
                    onPress={onDismiss}
                    variant="primary"
                    size="small"
                    style={styles.singleButton}
                />
            );
        }

        if (buttons.length === 1) {
            return (
                <CustomButton
                    title={buttons[0].text}
                    onPress={buttons[0].onPress || onDismiss}
                    variant={buttons[0].style || "primary"}
                    size="small"
                    style={styles.singleButton}
                />
            );
        }

        return (
            <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                    <CustomButton
                        key={index}
                        title={button.text}
                        onPress={button.onPress || onDismiss}
                        variant={button.style || (index === 0 ? "outline" : "primary")}
                        size="small"
                        style={[
                            styles.multiButton,
                            index === 0 && styles.firstButton
                        ]}
                    />
                ))}
            </View>
        );
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType={animationType}
            onRequestClose={onDismiss}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <Animated.View 
                    style={[
                        styles.overlay,
                        { opacity: opacityAnim }
                    ]}
                >
                    <TouchableWithoutFeedback>
                        <Animated.View 
                            style={[
                                styles.alertContainer,
                                { 
                                    transform: [{ scale: scaleAnim }],
                                    borderColor: config.borderColor 
                                }
                            ]}
                        >
                            <LinearGradient
                                colors={config.gradientColors}
                                style={styles.gradient}
                            >
                                {/* Close Button */}
                                {showCloseButton && (
                                    <TouchableOpacity 
                                        style={styles.closeButton}
                                        onPress={onDismiss}
                                    >
                                        <Ionicons 
                                            name="close" 
                                            size={20} 
                                            color={colors.textTertiary} 
                                        />
                                    </TouchableOpacity>
                                )}

                                {/* Icon */}
                                <View style={[styles.iconContainer, { backgroundColor: config.iconColor + '15' }]}>
                                    <Ionicons 
                                        name={alertIcon} 
                                        size={32} 
                                        color={config.iconColor} 
                                    />
                                </View>

                                {/* Content */}
                                <View style={styles.content}>
                                    <CustomText variant="h5" weight="semibold" style={styles.title}>
                                        {title}
                                    </CustomText>
                                    
                                    {message && (
                                        <CustomText 
                                            variant="body" 
                                            color={colors.textSecondary}
                                            style={styles.message}
                                            align="center"
                                        >
                                            {message}
                                        </CustomText>
                                    )}
                                </View>

                                {/* Buttons */}
                                <View style={styles.buttonsWrapper}>
                                    {renderButtons()}
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    alertContainer: {
        width: screenWidth - (spacing.xl * 2),
        maxWidth: 340,
        backgroundColor: colors.surface,
        borderRadius: borderRadius['2xl'],
        borderWidth: 1,
        overflow: 'hidden',
        ...shadows.lg,
    },
    gradient: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    content: {
        alignItems: 'center',
        marginBottom: spacing.lg, // Reduced margin to accommodate smaller buttons
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.sm,
        color: colors.textPrimary,
    },
    message: {
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonsWrapper: {
        width: '100%',
        paddingHorizontal: spacing.sm, // Added padding for better spacing
    },
    singleButton: {
        width: '85%', // Slightly smaller width for a more compact look
        alignSelf: 'center',
        paddingVertical: spacing.xs, // Reduced padding for smaller buttons
        borderRadius: borderRadius.lg, // Smoother corners
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.sm, // Reduced gap for smaller buttons
        justifyContent: 'center',
    },
    multiButton: {
        flex: 1,
        maxWidth: '45%', // Limit width for multiple buttons
        paddingVertical: spacing.xs, // Smaller padding for compact buttons
        borderRadius: borderRadius.lg, // Rounded corners for a nicer look
    },
    firstButton: {
        marginRight: spacing.xs, // Smaller margin for tighter spacing
    },
});

export default CustomAlert;