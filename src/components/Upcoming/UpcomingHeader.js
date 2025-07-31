import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/Colors';

/**
 * Header component for the Upcoming screen with title and action buttons
 */
const UpcomingHeader = ({ onFilterPress, onMenuPress }) => {
	return (
		<View style={styles.header}>
			<Text style={styles.headerTitle}>Upcoming</Text>
			<View style={styles.headerActions}>
				<TouchableOpacity 
					style={styles.headerButton}
					onPress={onFilterPress}>
					<MaterialCommunityIcons
						name="timeline-text-outline"
						size={20}
						color={colors.textSecondary}
					/>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.headerButton}
					onPress={onMenuPress}>
					<Ionicons
						name="ellipsis-vertical"
						size={20}
						color={colors.textSecondary}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		backgroundColor: colors.background,
	},
	headerTitle: {
		fontSize: typography.fontSize["xl"],
		fontWeight: typography.fontWeight.semibold,
		color: colors.textSecondary,
	},
	headerActions: {
		flexDirection: "row",
		gap: spacing.sm,
		alignItems: "center",
	},
	headerButton: {
		padding: spacing.sm,
	},
});

export default UpcomingHeader;