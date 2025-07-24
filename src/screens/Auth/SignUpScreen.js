import React, { useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Alert
} from "react-native";
import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomText from "@/components/UI/CustomText";
import CustomBigButton from "@/components/UI/CustomBigButton";

const SignInScreen = () => {
	const navigation = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

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
		<View style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoidingView}>
				<ScrollView
					contentContainerStyle={styles.scrollContainer}
					showsVerticalScrollIndicator={false}>
					<View
						style={styles.headerContainer}>
						<CustomText style={styles.title}>
							Create Account
						</CustomText>
						<CustomText style={styles.subtitle}>
							Sign up to streamline your day
						</CustomText>
					</View>

					<View
						style={styles.contentContainer}>
						<View style={styles.inputContainer}>
							<Ionicons
								name="mail-outline"
								size={24}
								color={colors.primary}
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Email Address"
								placeholderTextColor="#9ca3af"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
						</View>

						<View style={styles.inputContainer}>
							<Ionicons
								name="lock-closed-outline"
								size={24}
								color={colors.primary}
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Password"
								placeholderTextColor="#9ca3af"
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
							/>
							<TouchableOpacity
								onPress={() => setShowPassword(!showPassword)}
								style={styles.eyeIcon}>
								<Ionicons
									name={
										showPassword
											? "eye-off-outline"
											: "eye-outline"
									}
									size={24}
									color={colors.primary}
								/>
							</TouchableOpacity>
						</View>

						<CustomBigButton
							handleSignIn={handleSignIn}
							isLoading={isLoading}
							buttonText="Sign Up"
						/>

						<View
							style={styles.signupContainer}>
							<CustomText style={styles.signupText}>
								Already have an account?{" "}
							</CustomText>
							<TouchableOpacity
								onPress={() => navigation.navigate("SignIn")}>
								<CustomText style={styles.signupLink}>
									Sign In
								</CustomText>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 28,
		paddingVertical: 80,
		justifyContent: "center",
	},
	headerContainer: {
		alignItems: "center",
		marginBottom: 64,
	},
	title: {
		fontSize: 38,
		fontWeight: "900",
		color: colors.primary, // Deep neutral gray
		letterSpacing: 0.4,
		marginBottom: 12,
		fontFamily: "System", // Use system font for a modern look
	},
	subtitle: {
		fontSize: 16,
		color: "#6b7280", // Muted gray
		textAlign: "center",
		lineHeight: 24,
		fontWeight: "400",
		paddingHorizontal: 16,
	},
	contentContainer: {
		flex: 1,
		justifyContent: "center",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f8fafc", // Very subtle gray
		borderRadius: 24,
		marginBottom: 20,
		paddingHorizontal: 20,
		height: 64,
		borderWidth: 1,
		borderColor: "#e2e8f0", // Light border
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 3,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		height: "100%",
		fontSize: 16,
		color: "#111827",
		fontWeight: "500",
		fontFamily: "System",
	},
	eyeIcon: {
		padding: 10,
	},
	gradientButton: {
		paddingVertical: 20,
		paddingHorizontal: 48,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 6,
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "700",
		color: "#ffffff",
		letterSpacing: 0.6,
		textTransform: "uppercase",
		fontFamily: "System",
	},
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 32,
	},
	signupText: {
		fontSize: 15,
		color: "#6b7280",
		fontWeight: "500",
		fontFamily: "System",
	},
	signupLink: {
		fontSize: 15,
		fontWeight: "700",
		color: colors.primary,
		textDecorationLine: "underline",
		fontFamily: "System",
	},
});

export default SignInScreen;
