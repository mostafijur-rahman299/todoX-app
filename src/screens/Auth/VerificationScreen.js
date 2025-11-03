import React, { useState, useEffect, useRef } from 'react';
import { 
	View, 
	StyleSheet, 
	TouchableOpacity, 
	TextInput, 
	KeyboardAvoidingView, 
	Platform, 
	ActivityIndicator,
	StatusBar,
	Animated,
	Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/UI/CustomText';
import CustomButton from '@/components/UI/CustomButton';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/Colors';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

/**
 * Enhanced VerificationScreen with improved design, animations, and user experience
 * Features modern OTP input, better visual feedback, and enhanced accessibility
 */
const VerificationScreen = ({ route, navigation }) => {
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [timer, setTimer] = useState(30);
	const [isResendActive, setIsResendActive] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(0);
	const inputRefs = useRef([]);
	const { login } = useAuth();
	const shakeAnimation = useRef(new Animated.Value(0)).current;
	const fadeAnimation = useRef(new Animated.Value(0)).current;
	
	// Get email from route params or use a default
	const email = route?.params?.email || 'user@example.com';

	useEffect(() => {
		// Entrance animation
		Animated.timing(fadeAnimation, {
			toValue: 1,
			duration: 600,
			useNativeDriver: true,
		}).start();

		// Focus first input
		setTimeout(() => {
			inputRefs.current[0]?.focus();
		}, 300);
	}, []);

	useEffect(() => {
		let interval = null;
		if (timer > 0) {
			interval = setInterval(() => {
				setTimer((prevTimer) => prevTimer - 1);
			}, 1000);
		} else {
			setIsResendActive(true);
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [timer]);

	/**
	 * Handle OTP input change with improved UX
	 */
	const handleCodeChange = (text, index) => {
		// Only allow numeric input
		const numericText = text.replace(/[^0-9]/g, '');
		
		if (numericText.length <= 1) {
			const newCode = [...code];
			newCode[index] = numericText;
			setCode(newCode);

			// Auto-focus next input
			if (numericText.length === 1 && index < 5) {
				inputRefs.current[index + 1]?.focus();
				setFocusedIndex(index + 1);
			}

			// Auto-verify when all fields are filled
			if (index === 5 && numericText.length === 1) {
				const fullCode = [...newCode];
				fullCode[5] = numericText;
				if (fullCode.every(digit => digit !== '')) {
					setTimeout(() => handleVerify(fullCode.join('')), 300);
				}
			}
		}
	};

	/**
	 * Handle backspace and navigation
	 */
	const handleKeyPress = (e, index) => {
		if (e.nativeEvent.key === 'Backspace') {
			if (code[index] === '' && index > 0) {
				// Move to previous input if current is empty
				inputRefs.current[index - 1]?.focus();
				setFocusedIndex(index - 1);
			} else {
				// Clear current input
				const newCode = [...code];
				newCode[index] = '';
				setCode(newCode);
			}
		}
	};

	/**
	 * Handle input focus
	 */
	const handleFocus = (index) => {
		setFocusedIndex(index);
	};

	/**
	 * Shake animation for invalid code
	 */
	const triggerShakeAnimation = () => {
		Animated.sequence([
			Animated.timing(shakeAnimation, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(shakeAnimation, {
				toValue: -10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(shakeAnimation, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(shakeAnimation, {
				toValue: 0,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();
	};

	/**
	 * Handle resend code
	 */
	const handleResend = () => {
		if (isResendActive) {
			setCode(['', '', '', '', '', '']);
			setTimer(30);
			setIsResendActive(false);
			inputRefs.current[0]?.focus();
			setFocusedIndex(0);
		}
	};

	/**
	 * Handle verification
	 */
	const handleVerify = async (verificationCode = null) => {
		const codeToVerify = verificationCode || code.join('');
		
		if (codeToVerify.length !== 6) {
			triggerShakeAnimation();
			return;
		}

		setIsVerifying(true);
		
		try {
			// Simulate verification delay
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// In a real app, verify with backend
			if (codeToVerify === '123456' || codeToVerify.length === 6) {
				await login();
			} else {
				triggerShakeAnimation();
				setCode(['', '', '', '', '', '']);
				inputRefs.current[0]?.focus();
				setFocusedIndex(0);
			}
		} catch (error) {
			console.error('Verification error:', error);
			triggerShakeAnimation();
		} finally {
			setIsVerifying(false);
		}
	};

	/**
	 * Format timer display
	 */
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	/**
	 * Mask email for privacy
	 */
	const maskEmail = (email) => {
		const [username, domain] = email.split('@');
		const maskedUsername = username.length > 2 
			? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
			: username;
		return `${maskedUsername}@${domain}`;
	};

	return (
		<>
			<LinearGradient
				colors={colors.gradients.primary}
				style={styles.container}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={styles.keyboardAvoidingView}
				>
					<Animated.View 
						style={[
							styles.contentContainer,
							{ opacity: fadeAnimation }
						]}
					>
						{/* Header */}
						<View style={styles.headerContainer}>
							<TouchableOpacity 
								style={styles.backButton}
								onPress={() => navigation.goBack()}
								hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
							>
								<Ionicons name="arrow-back" size={24} color={colors.white} />
							</TouchableOpacity>
							
							<View style={styles.iconContainer}>
								<View style={styles.verificationIcon}>
									<Ionicons name="mail" size={32} color={colors.primary} />
								</View>
							</View>

							<CustomText variant="h2" style={styles.title}>
								Check Your Email
							</CustomText>
							<CustomText variant="bodyLarge" style={styles.subtitle}>
								We've sent a 6-digit verification code to{'\n'}
								<CustomText variant="bodyLarge" weight="semibold" style={styles.emailText}>
									{maskEmail(email)}
								</CustomText>
							</CustomText>
						</View>
						
						{/* OTP Input */}
						<Animated.View 
							style={[
								styles.codeContainer,
								{ transform: [{ translateX: shakeAnimation }] }
							]}
						>
							{code.map((digit, index) => (
								<TextInput
									key={index}
									ref={(ref) => (inputRefs.current[index] = ref)}
									style={[
										styles.codeInput,
										focusedIndex === index && styles.codeInputFocused,
										digit !== '' && styles.codeInputFilled
									]}
									value={digit}
									onChangeText={(text) => handleCodeChange(text, index)}
									onKeyPress={(e) => handleKeyPress(e, index)}
									onFocus={() => handleFocus(index)}
									keyboardType="number-pad"
									maxLength={1}
									selectTextOnFocus
									editable={!isVerifying}
								/>
							))}
						</Animated.View>
						
						{/* Timer */}
						<View style={styles.timerContainer}>
							<Ionicons name="time-outline" size={16} color={colors.white + '80'} />
							<CustomText variant="bodySmall" style={styles.timerText}>
								Resend code in {formatTime(timer)}
							</CustomText>
						</View>
						
						{/* Action Buttons */}
						<View style={styles.actionContainer}>
							<CustomButton
								title={isVerifying ? "Verifying..." : "Verify Code"}
								onPress={() => handleVerify()}
								variant="secondary"
								size="large"
								fullWidth
								disabled={isVerifying || code.join('').length !== 6}
								style={styles.verifyButton}
								textStyle={styles.verifyButtonText}
								icon={isVerifying ? (
									<ActivityIndicator size="small" color={colors.primary} />
								) : (
									<Ionicons name="checkmark-circle" size={20} color={colors.primary} />
								)}
							/>
							
							<TouchableOpacity 
								onPress={handleResend} 
								disabled={!isResendActive}
								style={[
									styles.resendButton,
									!isResendActive && styles.resendButtonDisabled
								]}
							>
								<Ionicons 
									name="refresh" 
									size={16} 
									color={isResendActive ? colors.white : colors.white + '50'} 
								/>
								<CustomText style={[
									styles.resendButtonText,
									!isResendActive && styles.resendButtonTextDisabled
								]}>
									Resend Code
								</CustomText>
							</TouchableOpacity>
						</View>

						{/* Help Text */}
						<View style={styles.helpContainer}>
							<CustomText variant="caption" style={styles.helpText}>
								Didn't receive the code? Check your spam folder or{'\n'}
								make sure the email address is correct.
							</CustomText>
						</View>
					</Animated.View>
				</KeyboardAvoidingView>
			</LinearGradient>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	contentContainer: {
		flex: 1,
		paddingHorizontal: spacing.lg,
		paddingTop: StatusBar.currentHeight + spacing.xl,
		paddingBottom: spacing.xl,
	},
	headerContainer: {
		alignItems: 'center',
		marginBottom: spacing.xl,
	},
	backButton: {
		position: 'absolute',
		top: 0,
		left: 0,
		padding: spacing.sm,
		zIndex: 1,
	},
	iconContainer: {
		marginBottom: spacing.lg,
		marginTop: spacing.xl,
	},
	verificationIcon: {
		width: 80,
		height: 80,
		borderRadius: borderRadius.xl,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		...shadows.lg,
	},
	title: {
		color: colors.white,
		textAlign: 'center',
		marginBottom: spacing.md,
	},
	subtitle: {
		color: colors.white + 'E6',
		textAlign: 'center',
		lineHeight: 24,
	},
	emailText: {
		color: colors.white,
	},
	codeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: spacing.xl,
		paddingHorizontal: spacing.md,
	},
	codeInput: {
		width: (width - spacing.lg * 2 - spacing.md * 2 - spacing.sm * 5) / 6,
		height: 56,
		borderRadius: borderRadius.lg,
		backgroundColor: colors.white + '20',
		borderWidth: 2,
		borderColor: colors.white + '30',
		textAlign: 'center',
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.white,
	},
	codeInputFocused: {
		borderColor: colors.white,
		backgroundColor: colors.white + '30',
	},
	codeInputFilled: {
		backgroundColor: colors.white + '40',
		borderColor: colors.white,
	},
	timerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: spacing.xl,
		gap: spacing.xs,
	},
	timerText: {
		color: colors.white + '80',
	},
	actionContainer: {
		gap: spacing.md,
		marginBottom: spacing.lg,
	},
	verifyButton: {
		backgroundColor: colors.white,
		...shadows.lg,
	},
	verifyButtonText: {
		color: colors.primary,
		fontWeight: typography.fontWeight.bold,
	},
	resendButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: spacing.md,
		gap: spacing.sm,
	},
	resendButtonDisabled: {
		opacity: 0.5,
	},
	resendButtonText: {
		color: colors.white,
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.medium,
	},
	resendButtonTextDisabled: {
		color: colors.white + '50',
	},
	helpContainer: {
		alignItems: 'center',
		paddingHorizontal: spacing.md,
	},
	helpText: {
		color: colors.white + '80',
		textAlign: 'center',
		lineHeight: 18,
	},
});

export default VerificationScreen;