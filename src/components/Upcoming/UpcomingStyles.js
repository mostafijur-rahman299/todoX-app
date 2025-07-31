import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/Colors';

/**
 * Shared styles for the Upcoming screen components
 */
export const upcomingStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	
	// Section Styling
	section: {
		backgroundColor: colors.background,
		paddingTop: spacing.xs,
	},
	
	todayButton: {
		backgroundColor: colors.primary,
		borderRadius: spacing.sm,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		textAlign: "center",
	},
	
	// Legacy styles for compatibility
	filterButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: spacing.sm,
		backgroundColor: colors.surface,
		gap: spacing.xs,
	},
	filterButtonActive: {
		backgroundColor: colors.primary,
	},
	filterButtonText: {
		fontSize: typography.fontSize.xs,
		color: colors.textSecondary,
		fontWeight: typography.fontWeight.medium,
	},
	filterButtonTextActive: {
		color: colors.white,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.sm,
		backgroundColor: colors.background,
	},
	sectionTitle: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.textPrimary,
	},
	rescheduleButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	rescheduleText: {
		fontSize: typography.fontSize.sm,
		color: colors.error,
		fontWeight: typography.fontWeight.medium,
	},
	emptyDate: {
		paddingVertical: 30,
		alignItems: "center",
	},
	emptyDateText: {
		fontSize: typography.fontSize.sm,
		color: colors.textTertiary,
		fontStyle: "italic",
	},
});