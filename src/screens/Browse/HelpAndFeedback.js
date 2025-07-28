import React, { useState, useRef } from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Animated,
	Linking,
	Alert,
	TextInput,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomText from "@/components/UI/CustomText";
import CustomButton from "@/components/UI/CustomButton";
import {
	colors,
	spacing,
	borderRadius,
	shadows,
	typography,
} from "@/constants/Colors";
import CustomAlert from "@/components/UI/CustomAlert";

/**
 * Help and Feedback screen with comprehensive support options and feedback functionality
 * Features FAQ, contact options, app info, and feedback form
 */
const HelpAndFeedback = () => {
	const navigation = useNavigation();
	const [expandedFAQ, setExpandedFAQ] = useState(null);
	const [feedbackText, setFeedbackText] = useState("");
	const [feedbackType, setFeedbackType] = useState("general");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const [alertConfig, setAlertConfig] = useState({
		visible: false,
		title: "",
		message: "",
		type: "info",
		icon: null,
		buttons: [],
	});

	React.useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 600,
			useNativeDriver: true,
		}).start();
	}, []);

	const showComingSoonAlert = (featureName, description) => {
		showAlert({
			title: `${featureName} Coming Soon!`,
			message:
				description ||
				`We're working hard to bring you ${featureName.toLowerCase()}. Stay tuned for updates!`,
			type: "coming-soon",
			icon: "rocket",
			buttons: [
				{
					text: "Got it!",
					style: "primary",
					onPress: hideAlert,
				},
			],
		});
	};

	const showAlert = (config) => {
		setAlertConfig({
			visible: true,
			...config,
		});
	};

  const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

	// FAQ data
	const faqData = [
		{
			id: 1,
			question: "How do I create a new task?",
			answer: 'Tap the "+" button on the main screen, fill in the task details including title, description, due date, and priority level, then tap "Save" to create your task.',
		},
		{
			id: 2,
			question: "How can I set task priorities?",
			answer: "When creating or editing a task, you can select from High, Medium, or Low priority levels. High priority tasks will appear with a red indicator, medium with orange, and low with green.",
		},
		{
			id: 3,
			question: "Can I organize tasks by categories?",
			answer: "Yes! You can create custom categories like Work, Personal, Health, etc. Assign tasks to categories to keep them organized and easily filter your task list.",
		},
		{
			id: 4,
			question: "How do notifications work?",
			answer: "TodoX sends push notifications for upcoming deadlines and overdue tasks. You can customize notification settings in the app settings to choose when and how you want to be reminded.",
		},
		{
			id: 5,
			question: "Is my data synced across devices?",
			answer: "Yes, when you sign in with your account, your tasks and settings are automatically synced across all your devices. You can access your tasks anywhere, anytime.",
		},
		{
			id: 6,
			question: "How do I delete completed tasks?",
			answer: "Swipe left on any completed task to reveal the delete option, or use the bulk actions in the task list to delete multiple completed tasks at once.",
		},
	];

	// Feedback types
	const feedbackTypes = [
		{
			id: "general",
			label: "General Feedback",
			icon: "chatbubble-outline",
		},
		{ id: "bug", label: "Report a Bug", icon: "bug-outline" },
		{ id: "feature", label: "Feature Request", icon: "bulb-outline" },
		{
			id: "improvement",
			label: "Improvement Suggestion",
			icon: "trending-up-outline",
		},
	];

	/**
	 * Toggle FAQ item expansion
	 */
	const toggleFAQ = (id) => {
		setExpandedFAQ(expandedFAQ === id ? null : id);
	};

	/**
	 * Handle external link opening
	 */
	const openLink = async (url) => {
		try {
			const supported = await Linking.canOpenURL(url);
			if (supported) {
				await Linking.openURL(url);
			} else {
				Alert.alert("Error", "Unable to open this link");
			}
		} catch (error) {
			Alert.alert("Error", "An error occurred while opening the link");
		}
	};

	/**
	 * Handle feedback submission
	 */
	const submitFeedback = async () => {
		if (!feedbackText.trim()) {
			showComingSoonAlert("Feedback Submission", "We're working on this feature. Please check back later.");
			return;
		}

		setIsSubmitting(true);

		try {
			// Simulate API call - replace with actual implementation
			await new Promise((resolve) => setTimeout(resolve, 2000));

			showComingSoonAlert("Feedback Submission", "We're working on this feature. Please check back later.");
		} catch (error) {
			showComingSoonAlert("Feedback Submission", "We're working on this feature. Please check back later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	/**
	 * Render FAQ item component
	 */
	const renderFAQItem = ({ item }) => (
		<View key={item.id} style={styles.faqItem}>
			<TouchableOpacity
				style={styles.faqQuestion}
				onPress={() => toggleFAQ(item.id)}
				activeOpacity={0.7}>
				<CustomText variant="h6" style={styles.questionText}>
					{item.question}
				</CustomText>
				<Ionicons
					name={
						expandedFAQ === item.id ? "chevron-up" : "chevron-down"
					}
					size={20}
					color={colors.textSecondary}
				/>
			</TouchableOpacity>
			{expandedFAQ === item.id && (
				<View style={styles.faqAnswer}>
					<CustomText variant="body" style={styles.answerText}>
						{item.answer}
					</CustomText>
				</View>
			)}
		</View>
	);

	/**
	 * Render contact option component
	 */
	const renderContactOption = ({ icon, title, subtitle, onPress }) => (
		<TouchableOpacity
			style={styles.contactOption}
			onPress={onPress}
			activeOpacity={0.7}>
			<View style={styles.contactIconContainer}>
				<Ionicons name={icon} size={24} color={colors.primary} />
			</View>
			<View style={styles.contactContent}>
				<CustomText variant="h6" style={styles.contactTitle}>
					{title}
				</CustomText>
				<CustomText variant="caption" style={styles.contactSubtitle}>
					{subtitle}
				</CustomText>
			</View>
			<Ionicons
				name="chevron-forward"
				size={20}
				color={colors.textTertiary}
			/>
		</TouchableOpacity>
	);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}>

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
					activeOpacity={0.7}>
					<Ionicons
						name="arrow-back"
						size={24}
						color={colors.textPrimary}
					/>
				</TouchableOpacity>
				<CustomText variant="h3" style={styles.headerTitle}>
					Help & Feedback
				</CustomText>
				<View style={styles.headerSpacer} />
			</View>

			<Animated.View style={[styles.content, { opacity: fadeAnim }]}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}>
					{/* Quick Actions */}
					<View style={styles.section}>
						<CustomText variant="h4" style={styles.sectionTitle}>
							Quick Help
						</CustomText>
						<View style={styles.quickActions}>
							{renderContactOption({
								icon: "mail-outline",
								title: "Email Support",
								subtitle: "Get help via email",
								onPress: () =>
									openLink("mailto:support@todox.app"),
							})}
							{renderContactOption({
								icon: "chatbubbles-outline",
								title: "Live Chat",
								subtitle: "Chat with our support team",
								onPress: () => showComingSoonAlert("Live Chat", "We're working on this feature. Please check back later."),
							})}
							{renderContactOption({
								icon: "document-text-outline",
								title: "User Guide",
								subtitle: "Learn how to use TodoX",
								onPress: () =>
									showComingSoonAlert("User Guide", "We're working on this feature. Please check back later."),
							})}
						</View>
					</View>

					{/* FAQ Section */}
					<View style={styles.section}>
						<CustomText variant="h4" style={styles.sectionTitle}>
							Frequently Asked Questions
						</CustomText>
						<View style={styles.faqContainer}>
							{faqData.map((item) => renderFAQItem({ item }))}
						</View>
					</View>

					{/* Feedback Section */}
					<View style={styles.section}>
						<CustomText variant="h4" style={styles.sectionTitle}>
							Send Feedback
						</CustomText>

						{/* Feedback Type Selection */}
						<View style={styles.feedbackTypes}>
							{feedbackTypes.map((type) => (
								<TouchableOpacity
									key={type.id}
									style={[
										styles.feedbackType,
										feedbackType === type.id &&
											styles.feedbackTypeActive,
									]}
									onPress={() => setFeedbackType(type.id)}
									activeOpacity={0.7}>
									<Ionicons
										name={type.icon}
										size={20}
										color={
											feedbackType === type.id
												? colors.primary
												: colors.textSecondary
										}
									/>
									<CustomText
										variant="bodySmall"
										style={[
											styles.feedbackTypeText,
											feedbackType === type.id &&
												styles.feedbackTypeTextActive,
										]}>
										{type.label}
									</CustomText>
								</TouchableOpacity>
							))}
						</View>

						{/* Feedback Input */}
						<View style={styles.feedbackInputContainer}>
							<TextInput
								style={styles.feedbackInput}
								placeholder="Tell us what you think or report an issue..."
								placeholderTextColor={colors.textPlaceholder}
								multiline
								numberOfLines={6}
								value={feedbackText}
								onChangeText={setFeedbackText}
								textAlignVertical="top"
							/>
						</View>

						{/* Submit Button */}
						<CustomButton
							title="Submit Feedback"
							onPress={submitFeedback}
							variant="primary"
							size="large"
							fullWidth
							loading={isSubmitting}
							disabled={!feedbackText.trim()}
							style={styles.submitButton}
              textStyle={{color: colors.textPrimary}}
						/>
					</View>

					{/* App Info Section */}
					<View style={styles.section}>
						<CustomText variant="h4" style={styles.sectionTitle}>
							App Information
						</CustomText>
						<View style={styles.appInfo}>
							<View style={styles.infoRow}>
								<CustomText
									variant="body"
									style={styles.infoLabel}>
									Version
								</CustomText>
								<CustomText
									variant="body"
									style={styles.infoValue}>
									1.0.0
								</CustomText>
							</View>
							<View style={styles.infoRow}>
								<CustomText
									variant="body"
									style={styles.infoLabel}>
									Build
								</CustomText>
								<CustomText
									variant="body"
									style={styles.infoValue}>
									2024.01.15
								</CustomText>
							</View>
							<TouchableOpacity
								style={styles.infoRow}
								onPress={() => showComingSoonAlert("Privacy Policy", "We're working on this feature. Please check back later.")}
								activeOpacity={0.7}>
								<CustomText
									variant="body"
									style={styles.infoLabel}>
									Privacy Policy
								</CustomText>
								<Ionicons
									name="open-outline"
									size={16}
									color={colors.primary}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.infoRow}
								onPress={() => showComingSoonAlert("Terms of Service", "We're working on this feature. Please check back later.")}
								activeOpacity={0.7}>
								<CustomText
									variant="body"
									style={styles.infoLabel}>
									Terms of Service
								</CustomText>
								<Ionicons
									name="open-outline"
									size={16}
									color={colors.primary}
								/>
							</TouchableOpacity>
						</View>
					</View>

					{/* Social Links */}
					<View style={styles.section}>
						<CustomText variant="h4" style={styles.sectionTitle}>
							Connect With Us
						</CustomText>
						<View style={styles.socialLinks}>
							<TouchableOpacity
								style={styles.socialLink}
								onPress={() =>
									openLink("https://twitter.com/todoxapp")
								}
								activeOpacity={0.7}>
								<Ionicons
									name="logo-twitter"
									size={24}
									color={colors.info}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.socialLink}
								onPress={() =>
									openLink("https://facebook.com/todoxapp")
								}
								activeOpacity={0.7}>
								<Ionicons
									name="logo-facebook"
									size={24}
									color={colors.info}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.socialLink}
								onPress={() =>
									openLink("https://instagram.com/todoxapp")
								}
								activeOpacity={0.7}>
								<Ionicons
									name="logo-instagram"
									size={24}
									color={colors.primary}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.socialLink}
								onPress={() =>
									openLink("https://github.com/todoxapp")
								}
								activeOpacity={0.7}>
								<Ionicons
									name="logo-github"
									size={24}
									color={colors.textPrimary}
								/>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</Animated.View>

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
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.md,
		backgroundColor: colors.background,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	backButton: {
		padding: spacing.xs,
		marginRight: spacing.sm,
	},
	headerTitle: {
		flex: 1,
		textAlign: "center",
		color: colors.textPrimary,
	},
	headerSpacer: {
		width: 40,
	},
	content: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: spacing.xl,
	},
	section: {
		marginTop: spacing.lg,
		paddingHorizontal: spacing.lg,
	},
	sectionTitle: {
		color: colors.textPrimary,
		marginBottom: spacing.md,
	},

	// Quick Actions
	quickActions: {
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		overflow: "hidden",
		...shadows.sm,
	},
	contactOption: {
		flexDirection: "row",
		alignItems: "center",
		padding: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	contactIconContainer: {
		width: 40,
		height: 40,
		borderRadius: borderRadius.md,
		backgroundColor: colors.primary + "20",
		alignItems: "center",
		justifyContent: "center",
		marginRight: spacing.md,
	},
	contactContent: {
		flex: 1,
	},
	contactTitle: {
		color: colors.textPrimary,
		marginBottom: 2,
	},
	contactSubtitle: {
		color: colors.textSecondary,
	},

	// FAQ
	faqContainer: {
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		overflow: "hidden",
		...shadows.sm,
	},
	faqItem: {
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	faqQuestion: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: spacing.md,
	},
	questionText: {
		flex: 1,
		color: colors.textPrimary,
		marginRight: spacing.sm,
	},
	faqAnswer: {
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.md,
		backgroundColor: colors.backgroundSecondary,
	},
	answerText: {
		color: colors.textSecondary,
		lineHeight: 22,
	},

	// Feedback
	feedbackTypes: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: spacing.md,
		gap: spacing.xs,
	},
	feedbackType: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.md,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		marginRight: spacing.xs,
		marginBottom: spacing.xs,
	},
	feedbackTypeActive: {
		backgroundColor: colors.primary + "20",
		borderColor: colors.primary,
	},
	feedbackTypeText: {
		marginLeft: spacing.xs,
		color: colors.textSecondary,
		fontSize: typography.fontSize.xs,
	},
	feedbackTypeTextActive: {
		color: colors.primary,
	},
	feedbackInputContainer: {
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		borderColor: colors.border,
		marginBottom: spacing.md,
		...shadows.sm,
	},
	feedbackInput: {
		padding: spacing.md,
		fontSize: typography.fontSize.base,
		color: colors.textPrimary,
		minHeight: 120,
		textAlignVertical: "top",
	},
	submitButton: {
		marginTop: spacing.sm,
	},

	// App Info
	appInfo: {
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		overflow: "hidden",
		...shadows.sm,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	infoLabel: {
		color: colors.textSecondary,
	},
	infoValue: {
		color: colors.textPrimary,
	},

	// Social Links
	socialLinks: {
		flexDirection: "row",
		justifyContent: "center",
		gap: spacing.lg,
	},
	socialLink: {
		width: 50,
		height: 50,
		borderRadius: borderRadius.full,
		backgroundColor: colors.surface,
		alignItems: "center",
		justifyContent: "center",
		...shadows.sm,
	},
});

export default HelpAndFeedback;
