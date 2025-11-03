import React, { useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Alert} from "react-native";
import { colors, spacing, borderRadius, shadows, typography } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomText from "@/components/UI/CustomText";
import CustomBigButton from "@/components/UI/CustomBigButton";
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Enhanced SignUpScreen with improved design, validation, and user experience
 * Features modern UI patterns, better accessibility, and comprehensive form validation
 */
const SignUpScreen = () => {
	const navigation = useNavigation();
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [focusedFields, setFocusedFields] = useState({});
	const [errors, setErrors] = useState({});

	/**
	 * Handle input field focus state
	 */
	const handleFocus = (field) => {
		setFocusedFields(prev => ({ ...prev, [field]: true }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: null }));
		}
	};

	/**
	 * Handle input field blur state
	 */
	const handleBlur = (field) => {
		setFocusedFields(prev => ({ ...prev, [field]: false }));
		validateField(field, formData[field]);
	};

	/**
	 * Update form data
	 */
	const updateFormData = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	/**
	 * Validate individual field
	 */
	const validateField = (field, value) => {
		let error = null;

		switch (field) {
			case 'fullName':
				if (!value.trim()) {
					error = "Full name is required";
				} else if (value.trim().length < 2) {
					error = "Name must be at least 2 characters";
				}
				break;
			case 'email':
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!value.trim()) {
					error = "Email is required";
				} else if (!emailRegex.test(value)) {
					error = "Please enter a valid email address";
				}
				break;
			case 'password':
				if (!value) {
					error = "Password is required";
				} else if (value.length < 6) {
					error = "Password must be at least 6 characters";
				}
				break;
			case 'confirmPassword':
				if (!value) {
					error = "Please confirm your password";
				} else if (value !== formData.password) {
					error = "Passwords do not match";
				}
				break;
		}

		setErrors(prev => ({ ...prev, [field]: error }));
		return !error;
	};

	/**
	 * Validate entire form
	 */
	const validateForm = () => {
		const fields = ['fullName', 'email', 'password', 'confirmPassword'];
		let isValid = true;

		fields.forEach(field => {
			if (!validateField(field, formData[field])) {
				isValid = false;
			}
		});

		return isValid;
	};

	/**
	 * Handle form submission
	 */
	const handleSignUp = () => {
		if (!validateForm()) {
			Alert.alert("Validation Error", "Please fix the errors and try again");
			return;
		}

		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			navigation.navigate("Verification", { email: formData.email });
		}, 1000);
	};

	/**
	 * Render input field with enhanced styling and validation
	 */
	const renderInputField = (field, placeholder, icon, options = {}) => {
		const isFocused = focusedFields[field];
		const hasError = errors[field];
		const isSecure = options.secureTextEntry && !options.showPassword;

		return (
			<View style={styles.inputGroup}>
				<CustomText variant="label" style={styles.inputLabel}>
					{placeholder}
				</CustomText>
				<View style={[
					styles.inputContainer,
					isFocused && styles.inputContainerFocused,
					hasError && styles.inputContainerError
				]}>
					<Ionicons
						name={icon}
						size={20}
						color={hasError ? colors.error : isFocused ? colors.primary : colors.textTertiary}
						style={styles.inputIcon}
					/>
					<TextInput
						style={styles.input}
						placeholder={`Enter your ${placeholder.toLowerCase()}`}
						placeholderTextColor={colors.textPlaceholder}
						value={formData[field]}
						onChangeText={(value) => updateFormData(field, value)}
						onFocus={() => handleFocus(field)}
						onBlur={() => handleBlur(field)}
						secureTextEntry={isSecure}
						autoCapitalize={options.autoCapitalize || "none"}
						keyboardType={options.keyboardType || "default"}
						autoComplete={options.autoComplete}
					/>
					{options.secureTextEntry && (
						<TouchableOpacity
							onPress={() => options.toggleShow()}
							style={styles.eyeIcon}
							hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						>
							<Ionicons
								name={options.showPassword ? "eye-off-outline" : "eye-outline"}
								size={20}
								color={colors.textTertiary}
							/>
						</TouchableOpacity>
					)}
				</View>
				{hasError && (
					<CustomText variant="error" style={styles.errorText}>
						{hasError}
					</CustomText>
				)}
			</View>
		);
	};

	return (
		<>
			<LinearGradient
				colors={[colors.background, colors.white]}
				style={styles.container}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.keyboardAvoidingView}
				>
					<ScrollView
						contentContainerStyle={styles.scrollContainer}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						{/* Header */}
						<View style={styles.headerContainer}>
							<View style={styles.logoContainer}>
								<View style={styles.logoIcon}>
									<Ionicons name="person-add" size={32} color={colors.primary} />
								</View>
							</View>
							<CustomText variant="h2" style={styles.title}>
								Create Account
							</CustomText>
							<CustomText variant="bodyLarge" style={styles.subtitle}>
								Join TodoX and start organizing your life today
							</CustomText>
						</View>

						{/* Form */}
						<View style={styles.formContainer}>
							{renderInputField(
								'fullName',
								'Full Name',
								'person-outline',
								{ autoCapitalize: 'words', autoComplete: 'name' }
							)}

							{renderInputField(
								'email',
								'Email Address',
								'mail-outline',
								{ keyboardType: 'email-address', autoComplete: 'email' }
							)}

							{renderInputField(
								'password',
								'Password',
								'lock-closed-outline',
								{
									secureTextEntry: true,
									showPassword: showPassword,
									toggleShow: () => setShowPassword(!showPassword),
									autoComplete: 'password-new'
								}
							)}

							{renderInputField(
								'confirmPassword',
								'Confirm Password',
								'lock-closed-outline',
								{
									secureTextEntry: true,
									showPassword: showConfirmPassword,
									toggleShow: () => setShowConfirmPassword(!showConfirmPassword),
									autoComplete: 'password-new'
								}
							)}

							{/* Terms and Conditions */}
							<View style={styles.termsContainer}>
								<CustomText variant="caption" style={styles.termsText}>
									By creating an account, you agree to our{" "}
									<CustomText variant="caption" style={styles.termsLink}>
										Terms of Service
									</CustomText>
									{" "}and{" "}
									<CustomText variant="caption" style={styles.termsLink}>
										Privacy Policy
									</CustomText>
								</CustomText>
							</View>

							{/* Sign Up Button */}
							<CustomBigButton
								handleSignIn={handleSignUp}
								isLoading={isLoading}
								buttonText="Create Account"
								style={styles.signUpButton}
							/>

							{/* Divider */}
							<View style={styles.dividerContainer}>
								<View style={styles.dividerLine} />
								<CustomText variant="caption" style={styles.dividerText}>
									or sign up with
								</CustomText>
								<View style={styles.dividerLine} />
							</View>

							{/* Social Login */}
							<View style={styles.socialContainer}>
								<TouchableOpacity style={styles.socialButton}>
									<Ionicons name="logo-google" size={20} color="#DB4437" />
									<CustomText style={styles.socialButtonText}>Google</CustomText>
								</TouchableOpacity>
								<TouchableOpacity style={styles.socialButton}>
									<Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
									<CustomText style={styles.socialButtonText}>Apple</CustomText>
								</TouchableOpacity>
							</View>

							{/* Sign In Link */}
							<View style={styles.signInContainer}>
								<CustomText variant="bodySmall" style={styles.signInText}>
									Already have an account?{" "}
								</CustomText>
								<TouchableOpacity
									onPress={() => navigation.navigate("SignIn")}
									hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								>
									<CustomText variant="bodySmall" style={styles.signInLink}>
										Sign In
									</CustomText>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>
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
	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.xl,
		justifyContent: "center",
		minHeight: '100%',
	},
	headerContainer: {
		alignItems: "center",
		marginBottom: spacing.xl,
	},
	logoContainer: {
		marginBottom: spacing.lg,
	},
	logoIcon: {
		width: 64,
		height: 64,
		borderRadius: borderRadius.xl,
		backgroundColor: colors.primary + '15',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: colors.textPrimary,
		textAlign: "center",
		marginBottom: spacing.sm,
	},
	subtitle: {
		color: colors.textSecondary,
		textAlign: "center",
		paddingHorizontal: spacing.md,
	},
	formContainer: {
		flex: 1,
		justifyContent: "center",
	},
	inputGroup: {
		marginBottom: spacing.lg,
	},
	inputLabel: {
		marginBottom: spacing.sm,
		color: colors.textSecondary,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		paddingHorizontal: spacing.md,
		height: 56,
		borderWidth: 1,
		borderColor: colors.border,
		...shadows.sm,
	},
	inputContainerFocused: {
		borderColor: colors.primary,
		...shadows.colored,
	},
	inputContainerError: {
		borderColor: colors.error,
	},
	inputIcon: {
		marginRight: spacing.sm,
	},
	input: {
		flex: 1,
		fontSize: typography.fontSize.base,
		color: colors.textPrimary,
		fontWeight: typography.fontWeight.medium,
	},
	eyeIcon: {
		padding: spacing.sm,
	},
	errorText: {
		marginTop: spacing.xs,
		marginLeft: spacing.sm,
	},
	termsContainer: {
		marginBottom: spacing.lg,
		paddingHorizontal: spacing.sm,
	},
	termsText: {
		textAlign: 'center',
		lineHeight: 20,
	},
	termsLink: {
		color: colors.primary,
		fontWeight: typography.fontWeight.medium,
	},
	signUpButton: {
		marginVertical: spacing.lg,
	},
	dividerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: spacing.lg,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: colors.border,
	},
	dividerText: {
		marginHorizontal: spacing.md,
		color: colors.textTertiary,
	},
	socialContainer: {
		flexDirection: 'row',
		gap: spacing.md,
		marginBottom: spacing.lg,
	},
	socialButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: spacing.md,
		borderRadius: borderRadius.lg,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		gap: spacing.sm,
		...shadows.sm,
	},
	socialButtonText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.medium,
		color: colors.textSecondary,
	},
	signInContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: spacing.lg,
	},
	signInText: {
		color: colors.textSecondary,
	},
	signInLink: {
		color: colors.primary,
		fontWeight: typography.fontWeight.semibold,
	},
});

export default SignUpScreen;
