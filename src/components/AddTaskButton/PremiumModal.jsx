import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
    Platform,
    Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

const { height: screenHeight } = Dimensions.get('window');

/**
 * Premium modal component
 * Shows when user tries to access premium features like reminders
 */
const PremiumModal = ({ visible, onClose }) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.95)).current;

    /**
     * Handle modal entrance animation
     */
    useEffect(() => {
        if (visible) {
            // Enhanced modal entrance animation
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 120,
                    friction: 9,
                    useNativeDriver: true,
                }),
                Animated.spring(modalScale, {
                    toValue: 1,
                    tension: 120,
                    friction: 9,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    /**
     * Handle modal close with animation
     */
    const handleClose = () => {
        // Enhanced modal exit animation
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 280,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(modalScale, {
                toValue: 0.95,
                duration: 280,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
            // Reset animations
            slideAnim.setValue(screenHeight);
            modalScale.setValue(0.95);
        });
    };

    /**
     * Handle upgrade button press with haptic feedback
     */
    const handleUpgrade = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate([10, 50, 10]);
        }
        
        // TODO: Implement premium upgrade logic
        console.log('Upgrade to premium');
        handleClose();
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
            statusBarTranslucent={true}
        >
            <Animated.View 
                style={[
                    styles.modalOverlay,
                    { opacity: overlayOpacity }
                ]}
            >
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={styles.modalOverlayTouch} />
                </TouchableWithoutFeedback>
                
                <Animated.View
                    style={[
                        styles.modalView,
                        {
                            transform: [
                                { translateY: slideAnim },
                                { scale: modalScale },
                            ],
                        },
                    ]}>
                    
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHandle} />
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={handleClose}
                            activeOpacity={0.7}
                        >
                            <Ionicons 
                                name="close" 
                                size={20} 
                                color={colors.textSecondary} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Premium Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.premiumIcon}>
                            <Ionicons 
                                name="diamond" 
                                size={32} 
                                color={colors.warning} 
                            />
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>Upgrade to Premium</Text>
                        <Text style={styles.subtitle}>
                            Unlock reminders and many more powerful features
                        </Text>

                        {/* Features List */}
                        <View style={styles.featuresList}>
                            <View style={styles.featureItem}>
                                <Ionicons 
                                    name="notifications" 
                                    size={18} 
                                    color={colors.primary} 
                                />
                                <Text style={styles.featureText}>Smart Reminders</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons 
                                    name="sync" 
                                    size={18} 
                                    color={colors.primary} 
                                />
                                <Text style={styles.featureText}>Cloud Sync</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons 
                                    name="analytics" 
                                    size={18} 
                                    color={colors.primary} 
                                />
                                <Text style={styles.featureText}>Advanced Analytics</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons 
                                    name="color-palette" 
                                    size={18} 
                                    color={colors.primary} 
                                />
                                <Text style={styles.featureText}>Custom Themes</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.upgradeButton}
                            onPress={handleUpgrade}
                            activeOpacity={0.8}
                        >
                            <Ionicons 
                                name="diamond" 
                                size={16} 
                                color={colors.white} 
                            />
                            <Text style={styles.upgradeButtonText}>
                                Upgrade Now
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.laterButton}
                            onPress={handleClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.laterButtonText}>
                                Maybe Later
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalOverlayTouch: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalView: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 24,
        width: '100%',
        maxWidth: 340,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
    },
    modalHeader: {
        alignItems: 'center',
        paddingVertical: 16,
        position: 'relative',
    },
    modalHandle: {
        width: 36,
        height: 3,
        backgroundColor: colors.textTertiary,
        borderRadius: 2,
        opacity: 0.6,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    premiumIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.warning + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    featuresList: {
        width: '100%',
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 15,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    actionButtons: {
        gap: 12,
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.warning,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    upgradeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },
    laterButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    laterButtonText: {
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: '500',
    },
});

export default PremiumModal;