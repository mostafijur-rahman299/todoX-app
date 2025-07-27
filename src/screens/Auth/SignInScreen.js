import React, { useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Alert,
	StatusBar
} from "react-native";
import { colors, spacing, borderRadius, shadows, typography } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomText from "@/components/UI/CustomText";
import CustomBigButton from "@/components/UI/CustomBigButton";
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Enhanced SignInScreen with improved design, accessibility, and user experience
 */
const SignInScreen = () => {
	const navigation = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [emailFocused, setEmailFocused] = useState(false);
	const [passwordFocused, setPasswordFocused] = useState(false);

	const handleSignIn = () => {
		if (!email.trim()) {
			Alert.alert("Error", "Please enter your email");
			return;
		}

		if (!password.trim()) {
			Alert.alert("Error", "Please enter your password");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			Alert.alert("Error", "Please enter a valid email address");
			return;
		}

		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			navigation.navigate("Verification", { email });
		}, 1000);
	};

	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor={colors.background} />
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
									<Ionicons name="checkmark-circle" size={32} color={colors.primary} />
								</View>
							</View>
							<CustomText variant="h2" style={styles.title}>
								Welcome Back
							</CustomText>
							<CustomText variant="bodyLarge" style={styles.subtitle}>
								Sign in to continue your productivity journey
							</CustomText>
						</View>

						{/* Form */}
						<View style={styles.formContainer}>
							{/* Email Input */}
							<View style={styles.inputGroup}>
								<CustomText variant="label" style={styles.inputLabel}>
									Email Address
								</CustomText>
								<View style={[
									styles.inputContainer,
									emailFocused && styles.inputContainerFocused
								]}>
									<Ionicons
										name="mail-outline"
										size={20}
										color={emailFocused ? colors.primary : colors.textTertiary}
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="Enter your email"
										placeholderTextColor={colors.textPlaceholder}
										value={email}
										onChangeText={setEmail}
										keyboardType="email-address"
										autoCapitalize="none"
										autoComplete="email"
										onFocus={() => setEmailFocused(true)}
										onBlur={() => setEmailFocused(false)}
									/>
								</View>
							</View>

							{/* Password Input */}
							<View style={styles.inputGroup}>
								<CustomText variant="label" style={styles.inputLabel}>
									Password
								</CustomText>
								<View style={[
									styles.inputContainer,
									passwordFocused && styles.inputContainerFocused
								]}>
									<Ionicons
										name="lock-closed-outline"
										size={20}
										color={passwordFocused ? colors.primary : colors.textTertiary}
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="Enter your password"
										placeholderTextColor={colors.textPlaceholder}
										value={password}
										onChangeText={setPassword}
										secureTextEntry={!showPassword}
										autoComplete="password"
										onFocus={() => setPasswordFocused(true)}
										onBlur={() => setPasswordFocused(false)}
									/>
									<TouchableOpacity
										onPress={() => setShowPassword(!showPassword)}
										style={styles.eyeIcon}
										hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
									>
										<Ionicons
											name={showPassword ? "eye-off-outline" : "eye-outline"}
											size={20}
											color={colors.textTertiary}
										/>
									</TouchableOpacity>
								</View>
							</View>

							{/* Forgot Password */}
							<TouchableOpacity style={styles.forgotPasswordContainer}>
								<CustomText variant="bodySmall" style={styles.forgotPasswordText}>
									Forgot your password?
								</CustomText>
							</TouchableOpacity>

							{/* Sign In Button */}
							<CustomBigButton
								handleSignIn={handleSignIn}
								isLoading={isLoading}
								buttonText="Sign In"
								style={styles.signInButton}
							/>

							{/* Divider */}
							<View style={styles.dividerContainer}>
								<View style={styles.dividerLine} />
								<CustomText variant="caption" style={styles.dividerText}>
									or continue with
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

							{/* Sign Up Link */}
							<View style={styles.signupContainer}>
								<CustomText variant="bodySmall" style={styles.signupText}>
									New to TodoX?{" "}
								</CustomText>
								<TouchableOpacity
									onPress={() => navigation.navigate("SignUp")}
									hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								>
									<CustomText variant="bodySmall" style={styles.signupLink}>
										Create Account
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
	forgotPasswordContainer: {
		alignItems: 'flex-end',
		marginBottom: spacing.lg,
	},
	forgotPasswordText: {
		color: colors.primary,
		fontWeight: typography.fontWeight.medium,
	},
	signInButton: {
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
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: spacing.lg,
	},
	signupText: {
		color: colors.textSecondary,
	},
	signupLink: {
		color: colors.primary,
		fontWeight: typography.fontWeight.semibold,
	},
});

export default SignInScreen;
