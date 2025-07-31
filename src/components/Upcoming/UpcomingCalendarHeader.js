import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/Colors';

/**
 * Calendar header component for the Upcoming screen
 */
const UpcomingCalendarHeader = ({ date, onToggleExpansion }) => {
	return (
		<View style={styles.calendarHeaderContainer}>
			<TouchableOpacity
				style={styles.calendarHeader}
				onPress={onToggleExpansion}
				activeOpacity={0.9}>
				<Text style={styles.calendarHeaderTitle}>
					{date?.toString("MMMM yyyy")}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	calendarHeaderContainer: {
		// backgroundColor: colors.surface,
	},
	calendarHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	calendarHeaderTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.medium,
		color: colors.textPrimary,
		letterSpacing: -0.3,
	},
});

export default UpcomingCalendarHeader;