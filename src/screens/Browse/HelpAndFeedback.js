import React, { useState } from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Linking,
	Alert,
	TextInput,
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
	typography,
} from "@/constants/Colors";

/**
 * Simple Help and Feedback screen with essential features
 */
const HelpAndFeedback = () => {
	const navigation = useNavigation();
	
	const [expandedFAQ, setExpandedFAQ] = useState(null);
	const [feedbackText, setFeedbackText] = useState("");

	// Simple FAQ data
	const faqData = [
		{
			id: 1,
			question: "How do I create a task?",
			answer: "Tap the '+' button to create a new task.",
		},
		{
			id: 2,
			question: "How do I delete a task?",
			answer: "Swipe left on any task and tap delete.",
		},
	];

	// Toggle FAQ expansion
	const toggleFAQ = (id) => {
		setExpandedFAQ(current => current === id ? null : id);
	};

	// Submit feedback
	const submitFeedback = () => {
		if (!feedbackText.trim()) {
			Alert.alert("Error", "Please enter your feedback.");
			return;
		}
		Alert.alert("Thank You!", "Your feedback has been submitted.", [
			{ text: "OK", onPress: () => setFeedbackText("") }
		]);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}>
					<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
				</TouchableOpacity>
				<CustomText variant="h3" style={styles.headerTitle}>
					Help & Feedback
				</CustomText>
				<View style={styles.headerSpacer} />
			</View>

			{/* Content */}
			<ScrollView style={styles.content}>
				{/* Contact */}
				<View style={styles.section}>
					<CustomText variant="h4" style={styles.sectionTitle}>
						Contact Support
					</CustomText>
					<TouchableOpacity
						style={styles.contactOption}
						onPress={() => Linking.openURL("mailto:support@todox.com")}>
						<Ionicons name="mail" size={24} color={colors.primary} />
						<CustomText style={styles.contactText}>Email Support</CustomText>
					</TouchableOpacity>
				</View>

				{/* FAQ */}
				<View style={styles.section}>
					<CustomText variant="h4" style={styles.sectionTitle}>
						FAQ
					</CustomText>
					{faqData.map((item) => (
						<View key={item.id} style={styles.faqItem}>
							<TouchableOpacity
								style={styles.faqQuestion}
								onPress={() => toggleFAQ(item.id)}>
								<CustomText style={styles.questionText}>
									{item.question}
								</CustomText>
								<Ionicons
									name={expandedFAQ === item.id ? "chevron-up" : "chevron-down"}
									size={20}
									color={colors.textSecondary}
								/>
							</TouchableOpacity>
							{expandedFAQ === item.id && (
								<View style={styles.faqAnswer}>
									<CustomText style={styles.answerText}>
										{item.answer}
									</CustomText>
								</View>
							)}
						</View>
					))}
				</View>

				{/* Feedback */}
				<View style={styles.section}>
					<CustomText variant="h4" style={styles.sectionTitle}>
						Send Feedback
					</CustomText>
					<View style={styles.feedbackContainer}>
						<TextInput
							style={styles.feedbackInput}
							placeholder="Tell us what you think..."
							placeholderTextColor={colors.textSecondary}
							multiline
							value={feedbackText}
							onChangeText={setFeedbackText}
						/>
					</View>
					<CustomButton
						title="Submit Feedback"
						onPress={submitFeedback}
						variant="primary"
						fullWidth
						disabled={!feedbackText.trim()}
					/>
				</View>
			</ScrollView>
		</View>
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
		paddingTop: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
		paddingBottom: spacing.md,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.border,
	},
	backButton: {
		padding: spacing.sm,
		marginRight: spacing.sm,
	},
	headerTitle: {
		flex: 1,
		textAlign: "center",
		color: colors.textPrimary,
	},
	headerSpacer: {
		width: 44,
	},
	content: {
		flex: 1,
	},
	section: {
		marginTop: spacing.lg,
		paddingHorizontal: spacing.lg,
	},
	sectionTitle: {
		color: colors.textPrimary,
		marginBottom: spacing.md,
		fontWeight: '600',
	},
	contactOption: {
		flexDirection: "row",
		alignItems: "center",
		padding: spacing.md,
		backgroundColor: colors.surface,
		borderRadius: borderRadius.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	contactText: {
		marginLeft: spacing.md,
		color: colors.textPrimary,
		fontWeight: '500',
	},
	faqItem: {
		marginBottom: spacing.sm,
		backgroundColor: colors.surface,
		borderRadius: borderRadius.md,
		borderWidth: 1,
		borderColor: colors.border,
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
		fontWeight: '500',
	},
	faqAnswer: {
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.md,
		backgroundColor: colors.backgroundSecondary,
	},
	answerText: {
		color: colors.textSecondary,
	},
	feedbackContainer: {
		backgroundColor: colors.surface,
		borderRadius: borderRadius.md,
		borderWidth: 1,
		borderColor: colors.border,
		marginBottom: spacing.md,
	},
	feedbackInput: {
		padding: spacing.md,
		fontSize: typography.fontSize.base,
		color: colors.textPrimary,
		minHeight: 100,
		textAlignVertical: "top",
	},
});

export default HelpAndFeedback;
