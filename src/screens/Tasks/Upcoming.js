import React, { useState, useMemo, useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	Animated,
	Easing,
	Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
	AgendaList,
	CalendarProvider,
	ExpandableCalendar,
} from "react-native-calendars";
import { colors, spacing, typography } from "@/constants/Colors";
import AddTaskButton from '@/components/AddTaskButton';
import { toggleTaskComplete } from '@/store/Task/task';

const Upcoming = () => {
	const dispatch = useDispatch();
	const tasks = useSelector((state) => state.task.display_tasks);
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0],
	);
	const [showPriorityOptions, setShowPriorityOptions] = useState(false);
	const [showInboxOptions, setShowInboxOptions] = useState(false);
	const [showActiveOnly, setShowActiveOnly] = useState(true);
	const prioritySlideAnim = useRef(new Animated.Value(-50)).current;
	const inboxSlideAnim = useRef(new Animated.Value(-50)).current;

	/**
	 * Get section header for date
	 */
	const getSectionHeader = (date) => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		const selectedDateObj = new Date(date);

		if (date === today.toISOString().split("T")[0]) {
			return "Today";
		} else if (date === tomorrow.toISOString().split("T")[0]) {
			return "Tomorrow";
		} else {
			return selectedDateObj.toLocaleDateString("en-US", {
				weekday: "long",
				month: "short",
				day: "numeric",
			});
		}
	};

	/**
	 * Filter tasks based on selected date and active status
	 */
	const filteredTasks = useMemo(() => {
		if (!tasks) return [];
		
		return tasks.filter((task) => {
			// Filter by timestamp validity
			if (!task.timestamp || isNaN(new Date(task.timestamp).getTime())) {
				return false;
			}
			
			// Filter by active status (show only incomplete tasks if showActiveOnly is true)
			if (showActiveOnly && task.is_completed) {
				return false;
			}
			
			return true;
		});
	}, [tasks, showActiveOnly]);

	/**
	 * Transform tasks data into AgendaList sections format with date filtering
	 */
	const sections = useMemo(() => {
		const todayStr = new Date().toISOString().split("T")[0];
		
		// If a specific date is selected, show only tasks for that date
		if (selectedDate && selectedDate !== todayStr) {
			const selectedTasks = filteredTasks.filter((task) => {
				const taskDateStr = new Date(task.timestamp)
					.toISOString()
					.split("T")[0];
				return taskDateStr === selectedDate;
			});

			if (selectedTasks.length === 0) {
				return [];
			}

			return [{
				title: getSectionHeader(selectedDate),
				data: selectedTasks.map((task) => ({ ...task, height: 80 })),
			}];
		}

		// Default view: show overdue and upcoming tasks
		const overdueTasks = filteredTasks
			.filter((task) => {
				const taskDateStr = new Date(task.timestamp)
					.toISOString()
					.split("T")[0];
				return taskDateStr < todayStr;
			})
			.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

		// Group remaining tasks by date
		const items = {};
		filteredTasks.forEach((task) => {
			const dateString = new Date(task.timestamp)
				.toISOString()
				.split("T")[0];
			if (dateString >= todayStr) {
				if (!items[dateString]) items[dateString] = [];
				items[dateString].push(task);
			}
		});

		// Create sections array
		const secs = [];
		if (overdueTasks.length > 0) {
			secs.push({
				title: "Overdue",
				data: overdueTasks.map((task) => ({
					...task,
					height: 80,
					isOverdue: true,
				})),
			});
		}

		const futureDates = Object.keys(items).sort();
		futureDates.forEach((date) => {
			secs.push({
				title: getSectionHeader(date),
				data: items[date].map((task) => ({ ...task, height: 80 })),
			});
		});

		return secs;
	}, [filteredTasks, selectedDate]);

	/**
	 * Get marked dates for calendar with task indicators
	 */
	const markedDatesBase = useMemo(() => {
		const marked = {};
		const today = new Date().toISOString().split("T")[0];

		filteredTasks?.forEach((task) => {
			if (task.timestamp && !isNaN(new Date(task.timestamp).getTime())) {
				const date = new Date(task.timestamp)
					.toISOString()
					.split("T")[0];
				marked[date] = {
					marked: true,
					dotColor: date < today ? colors.error : colors.primary,
				};
			}
		});

		if (marked[today]) {
			marked[today].today = true;
		}

		return marked;
	}, [filteredTasks]);

	const markedDates = useMemo(
		() => ({
			...markedDatesBase,
			[selectedDate]: {
				...markedDatesBase[selectedDate],
				selected: true,
				selectedColor: colors.primary,
			},
		}),
		[markedDatesBase, selectedDate],
	);

	/**
	 * Get priority color based on priority level
	 */
	const getPriorityColor = (priority) => {
		switch (priority) {
			case "priority1":
				return colors.error;
			case "priority3":
				return colors.warning;
			case "priority5":
				return colors.info;
			case "priority4":
				return colors.textTertiary;
			case "high":
				return colors.error;
			case "medium":
				return colors.warning;
			case "low":
				return colors.success;
			default:
				return colors.textTertiary;
		}
	};

	/**
	 * Handle task completion toggle
	 */
	const toggleTaskCompletion = (taskId) => {
		dispatch(toggleTaskComplete(taskId));
	};

	/**
	 * Toggle between showing all tasks and active tasks only
	 */
	const toggleActiveFilter = () => {
		setShowActiveOnly(!showActiveOnly);
	};

	/**
	 * Handle priority toggle with responsive animation
	 */
	const handlePriorityToggle = () => {
		// Close inbox options if open
		if (showInboxOptions) {
			handleInboxToggle();
		}

		if (showPriorityOptions) {
			// Hide dropdown
			Animated.timing(prioritySlideAnim, {
				toValue: -50,
				duration: 200,
				easing: Easing.out(Easing.ease),
				useNativeDriver: true,
			}).start(() => setShowPriorityOptions(false));
		} else {
			// Show dropdown
			setShowPriorityOptions(true);
			Animated.timing(prioritySlideAnim, {
				toValue: 0,
				duration: 200,
				easing: Easing.out(Easing.ease),
				useNativeDriver: true,
			}).start();
		}
	};

	/**
	 * Handle inbox/category toggle with smooth animation
	 */
	const handleInboxToggle = () => {
		// Close priority options if open
		if (showPriorityOptions) {
			handlePriorityToggle();
		}

		if (showInboxOptions) {
			// Hide dropdown
			Animated.timing(inboxSlideAnim, {
				toValue: -50,
				duration: 200,
				easing: Easing.out(Easing.ease),
				useNativeDriver: true,
			}).start(() => setShowInboxOptions(false));
		} else {
			// Show dropdown
			setShowInboxOptions(true);
			Animated.timing(inboxSlideAnim, {
				toValue: 0,
				duration: 200,
				easing: Easing.out(Easing.ease),
				useNativeDriver: true,
			}).start();
		}
	};

	/**
	 * Handle date selection
	 */
	const onDateChanged = (date) => {
		setSelectedDate(date);
	};

	/**
	 * Render individual task item
	 */
	const renderTaskItem = (item) => {
		if (!item || !item.timestamp) return null;

		const priorityColor =
			item.isOverdue && !item.is_completed
				? colors.error
				: item.is_completed
				? colors.success
				: getPriorityColor(item.priority || "low");

		return (
			<TouchableOpacity style={styles.taskItem}>
				<View style={styles.taskContent}>
					<TouchableOpacity
						style={styles.checkbox}
						onPress={() => toggleTaskCompletion(item.id)}>
						<View
							style={[
								styles.checkboxInner,
								{ borderColor: priorityColor },
								item.is_completed && {
									backgroundColor: priorityColor,
								},
							]}>
							{item.is_completed && (
								<Ionicons
									name="checkmark"
									size={12}
									color={colors.white}
								/>
							)}
						</View>
					</TouchableOpacity>

					<View style={styles.taskDetails}>
						<Text
							style={[
								styles.taskTitle,
								item.is_completed && styles.completedText,
							]}>
							{item.title || "Untitled Task"}
						</Text>
						<View style={styles.taskMeta}>
							<View style={styles.taskTimeContainer}>
								<Ionicons
									name="calendar-outline"
									size={12}
									color={colors.error}
								/>
								<Text style={styles.taskTime}>
									{new Date(
										item.timestamp,
									).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})}
								</Text>
							</View>
							<View style={styles.inboxTag}>
								<Ionicons
									name="mail-outline"
									size={12}
									color={colors.textTertiary}
								/>
								<Text style={styles.inboxText}>
									{item.tag || "Inbox"}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	/**
	 * Render section header with reschedule button for overdue
	 */
	const renderSectionHeader = (section) => {
		const isOverdue = section.title === "Overdue";

		return (
			<View style={styles.sectionHeader}>
				<Text style={styles.sectionTitle}>{section.title}</Text>
				{isOverdue && (
					<TouchableOpacity
						style={styles.rescheduleButton}
						onPress={() =>
							Alert.alert(
								"Reschedule",
								"Reschedule overdue tasks functionality",
							)
						}>
						<Text style={styles.rescheduleText}>Reschedule</Text>
						<Ionicons
							name="chevron-up"
							size={16}
							color={colors.error}
						/>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	/**
	 * Render empty day component
	 */
	const renderEmptyDate = () => {
		return (
			<View style={styles.emptyDate}>
				<Text style={styles.emptyDateText}>No tasks for this day</Text>
			</View>
		);
	};



	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Upcoming</Text>
				<View style={styles.headerActions}>
					<TouchableOpacity 
						style={[styles.filterButton, showActiveOnly && styles.filterButtonActive]}
						onPress={toggleActiveFilter}
					>
						<Ionicons
							name={showActiveOnly ? "eye" : "eye-off"}
							size={18}
							color={showActiveOnly ? colors.white : colors.textSecondary}
						/>
						<Text style={[styles.filterButtonText, showActiveOnly && styles.filterButtonTextActive]}>
							Active Only
						</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.headerButton}>
						<Ionicons
							name="ellipsis-vertical"
							size={20}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>
				</View>
			</View>

			{/* Calendar Provider with ExpandableCalendar and AgendaList */}
			<CalendarProvider
				date={selectedDate}
				onDateChanged={onDateChanged}
				theme={{
					backgroundColor: colors.background,
					calendarBackground: colors.surface,
					textSectionTitleColor: colors.textSecondary,
					selectedDayBackgroundColor: colors.primary,
					selectedDayTextColor: colors.white,
					todayTextColor: colors.primary,
					dayTextColor: colors.textPrimary,
					textDisabledColor: colors.textTertiary,
					dotColor: colors.primary,
					selectedDotColor: colors.white,
					arrowColor: colors.textSecondary,
					monthTextColor: colors.textPrimary,
					indicatorColor: colors.primary,
				}}>
				<ExpandableCalendar
					markedDates={markedDates}
					theme={{
						calendarBackground: colors.surface,
						todayTextColor: colors.primary,
						selectedDayBackgroundColor: colors.primary,
						dayTextColor: colors.textPrimary,
						textDisabledColor: colors.textTertiary,
						arrowColor: colors.textSecondary,
					}}
				/>
				<AgendaList
					sections={sections}
					renderItem={({ item }) => renderTaskItem(item)}
					renderSectionHeader={renderSectionHeader}
					renderEmptyDate={renderEmptyDate}
					sectionStyle={styles.section}
					theme={{
						backgroundColor: colors.background,
						agendaKnobColor: colors.textTertiary,
						agendaDayTextColor: colors.textPrimary,
						agendaDayNumColor: colors.textPrimary,
						agendaTodayColor: colors.primary,
						reservationsBackgroundColor: colors.background,
					}}
				/>
			</CalendarProvider>

			<AddTaskButton />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		backgroundColor: colors.background,
	},
	headerTitle: {
		fontSize: typography.fontSize["2xl"],
		fontWeight: typography.fontWeight.semibold,
		color: colors.textSecondary,
	},
	headerActions: {
		flexDirection: "row",
		gap: spacing.sm,
		alignItems: "center",
	},
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
	headerButton: {
		padding: spacing.sm,
	},
	section: {
		backgroundColor: colors.background,
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
	taskItem: {
		backgroundColor: colors.background,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.sm,
	},
	taskContent: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
	},
	checkbox: {
		marginTop: 2,
	},
	checkboxInner: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
	},
	taskDetails: {
		flex: 1,
	},
	taskTitle: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.medium,
		color: colors.textPrimary,
		marginBottom: 6,
	},
	taskMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	taskTimeContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	taskTime: {
		fontSize: typography.fontSize.xs,
		color: colors.error,
		fontWeight: typography.fontWeight.medium,
	},
	inboxTag: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	inboxText: {
		fontSize: typography.fontSize.xs,
		color: colors.textTertiary,
	},
	completedText: {
		textDecorationLine: "line-through",
		color: colors.textTertiary,
	},
	emptyDate: {
		paddingVertical: 30,
		alignItems: "center",
	},
	emptyDateText: {
		fontSize: typography.fontSize.sm,
		color: colors.textTertiary,
		fontStyle: "italic",
	}
});

export default Upcoming;
