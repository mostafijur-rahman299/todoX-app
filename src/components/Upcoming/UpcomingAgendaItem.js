import React, { useCallback } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, spacing, typography } from '@/constants/Colors';
import { getPriorityColor } from '@/utils/gnFunc';

/**
 * Ultra-clean agenda item component with refined aesthetics and selection support
 */
const UpcomingAgendaItem = React.memo(({ 
	item, 
	onToggleCompletion, 
	isSelectionMode = false, 
	isSelected = false 
}) => {
	/**
	 * Handle item press to show details or toggle selection
	 */
	const itemPressed = useCallback(() => {
		if (isSelectionMode) {
			if (onToggleCompletion) {
				onToggleCompletion(item.id);
			}
		} else {
			Alert.alert(item.title);
		}
	}, [item, isSelectionMode, onToggleCompletion]);

	/**
	 * Handle task completion toggle
	 */
	const handleToggleCompletion = useCallback(() => {
		if (onToggleCompletion) {
			onToggleCompletion(item.id);
		}
	}, [item.id, onToggleCompletion]);

	// Render empty state for days with no tasks
	if (isEmpty(item)) {
		return (
			<View style={styles.emptyItem}>
				<View style={styles.emptyIconContainer}>
					<Ionicons
						name="calendar-clear-outline"
						size={16}
						color={colors.textTertiary}
					/>
				</View>
				<Text style={styles.emptyItemText}>
					No tasks today
				</Text>
			</View>
		);
	}

	const priorityColor = !item.is_completed
		? getPriorityColor(item.priority || "low")
		: colors.success;

	return (
		<TouchableOpacity 
			style={[
				styles.taskItem,
				isSelected && styles.selectedTaskItem
			]} 
			activeOpacity={0.85}
			onPress={itemPressed}
		>
			<View style={styles.taskContent}>
				{isSelectionMode ? (
					<TouchableOpacity
						style={styles.selectionCheckbox}
						onPress={handleToggleCompletion}
						activeOpacity={0.7}>
						<View
							style={[
								styles.selectionCheckboxInner,
								isSelected && styles.selectedCheckbox,
							]}>
							{isSelected && (
								<Ionicons
									name="checkmark"
									size={12}
									color={colors.white}
								/>
							)}
						</View>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						style={styles.checkboxContainer}
						onPress={handleToggleCompletion}
						activeOpacity={0.7}>
						<View
							style={[
								styles.checkbox,
								{ borderColor: priorityColor },
								item.is_completed && {
									backgroundColor: priorityColor,
									borderColor: priorityColor,
								},
							]}>
							{item.is_completed && (
								<Ionicons
									name="checkmark"
									size={9}
									color={colors.white}
								/>
							)}
						</View>
					</TouchableOpacity>
				)}

				<View style={styles.taskDetails}>
					<View style={styles.taskTitleRow}>
						<Text
							style={[
								styles.taskTitle,
								item.is_completed && styles.completedText,
							]}
							numberOfLines={1}>
							{item.title || "Untitled Task"}
						</Text>
						<View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
					</View>
					
					{(item.time || item.category) && (
						<View style={styles.taskMeta}>
							{item.time && (
								<Text style={styles.timeText}>
									{item.time}
								</Text>
							)}
							
							{item.time && item.category && (
								<View style={styles.separator} />
							)}
							
							{item.category && (
								<Text style={styles.categoryText}>
									{item.category}
								</Text>
							)}
						</View>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	// Ultra-clean Task Item Design
	taskItem: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.xs,
		backgroundColor: colors.surface,
		borderRadius: spacing.sm,
	},
	selectedTaskItem: {
		backgroundColor: colors.primary + '10',
		borderWidth: 1,
		borderColor: colors.primary + '30',
	},
	taskContent: {
		flexDirection: "row",
		alignItems: "flex-start",
		padding: spacing.md,
		gap: spacing.sm,
	},
	
	// Refined Checkbox
	checkboxContainer: {
		paddingTop: 1,
	},
	checkbox: {
		width: 14,
		height: 14,
		borderRadius: 7,
		borderWidth: 1.5,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: 'transparent',
	},
	
	// Selection Mode Checkbox
	selectionCheckbox: {
		paddingTop: 1,
	},
	selectionCheckboxInner: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: 'transparent',
	},
	selectedCheckbox: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	
	// Clean Task Details
	taskDetails: {
		flex: 1,
		gap: spacing.xs,
	},
	taskTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	taskTitle: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.medium,
		color: colors.textPrimary,
		flex: 1,
		lineHeight: 18,
		letterSpacing: -0.1,
	},
	taskMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	timeText: {
		fontSize: typography.fontSize.xs,
		color: colors.primary,
		fontWeight: typography.fontWeight.medium,
	},
	categoryText: {
		fontSize: typography.fontSize.xs,
		color: colors.textTertiary,
		fontWeight: typography.fontWeight.normal,
		textTransform: 'capitalize',
	},
	separator: {
		width: 2,
		height: 2,
		borderRadius: 1,
		backgroundColor: colors.textTertiary,
		opacity: 0.4,
	},
	
	// Beautiful Priority Dot
	priorityDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		marginLeft: spacing.sm,
	},
	
	// Completed Task Style
	completedText: {
		textDecorationLine: "line-through",
		color: colors.textTertiary,
		opacity: 0.5,
	},
	
	// Refined Empty State
	emptyItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.lg,
		gap: spacing.sm,
		marginHorizontal: spacing.lg,
		marginBottom: spacing.xs,
	},
	emptyIconContainer: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emptyItemText: {
		fontSize: typography.fontSize.xs,
		color: colors.textTertiary,
		fontWeight: typography.fontWeight.medium,
	},
});

export default UpcomingAgendaItem;