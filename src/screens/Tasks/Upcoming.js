import React, { useRef, useCallback, useState, useMemo } from "react";
import {
	Animated,
	Easing,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import {
	ExpandableCalendar,
	AgendaList,
	CalendarProvider,
	WeekCalendar,
} from "react-native-calendars";
import isEmpty from "lodash/isEmpty";
import { colors, spacing, typography } from "@/constants/Colors";
import leftArrowIcon from "@/assets/icons/previous.png";
import rightArrowIcon from "@/assets/icons/next.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {getFutureDates, getPastDate, getMarkedDates, getPriorityColor} from "@/utils/gnFunc";
import TaskFilterModal from "@/components/Tasks/TaskFilterModal";

/**
 * Ultra-clean agenda item component with refined aesthetics
 */
const AgendaItem = React.memo(({ item }) => {
	const buttonPressed = useCallback(() => {
		Alert.alert("Show me more");
	}, []);

	const itemPressed = useCallback(() => {
		Alert.alert(item.title);
	}, [item]);

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
			style={styles.taskItem} 
			activeOpacity={0.85}
			onPress={itemPressed}
		>
			<View style={styles.taskContent}>
				<TouchableOpacity
					style={styles.checkboxContainer}
					onPress={() => toggleTaskCompletion(item.id)}
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

const today = new Date().toISOString().split("T")[0];
const pastDate = getPastDate(3);
const futureDates = getFutureDates(12);
const dates = [pastDate, today, ...futureDates];

const agendaItems = [
	{
		title: dates[0],
		data: [
			{
				is_completed: false,
				priority: "low",
				category: "inbox",
				title: "Long Yoga",
				itemCustomHeightType: "LongEvent",
				time: "10:00 Pm"
			},
		],
	},
	{
		title: dates[1],
		data: [
			{
				is_completed: false,
				priority: "low",
				category: "inbox",
				title: "Pilates ABC",
				time: "11:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Vinyasa Yoga",
				time: "12:00 Pm"
			},
		],
	},
	{
		title: dates[2],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
				time: "10:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Deep Stretches",
				time: "11:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Private Yoga",
				time: "12:00 Pm"
			},	
		],
	},
	{
		title: dates[3],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
				time: "09:30 Pm"
			},
		],
	},
	{ title: dates[4], data: [{}] },
	{
		title: dates[5],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Middle Yoga",
				time: "10:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga",
				time: "11:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "TRX",
				time: "12:00 AM"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Running Group",
				time: "12:00 PM"
			},
		],
	},
	{
		title: dates[6],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
				time: "09:30 Pm"
			},
		],
	},
	{ title: dates[7], data: [{}] },
	{
		title: dates[8],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Pilates Reformer",
				time: "10:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga",
				time: "11:00 Pm"
			}
		],
	},
	{
		title: dates[9],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Deep Stretches",
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Private Yoga",
			},
		],
	},
	{
		title: dates[10],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Last Yoga",
			},
		],
	},
	{
		title: dates[11],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Deep Stretches",
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Private Yoga",
			},
		],
	},
	{
		title: dates[12],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Last Yoga",
			},
		],
	},
	{
		title: dates[13],
		data: [{ is_completed: false, title: "Last Yoga" }],
	},
];

const Upcoming = ({ weekView }) => {
	const marked = useRef(getMarkedDates(agendaItems));
	const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

	/**
	 * Handle opening the filter modal
	 */
	const handleOpenFilterModal = useCallback(() => {
		setIsFilterModalVisible(true);
	}, []);

	/**
	 * Handle closing the filter modal
	 */
	const handleCloseFilterModal = useCallback(() => {
		setIsFilterModalVisible(false);
	}, []);

	/**
	 * Handle applying filters from the modal
	 */
	const handleApplyFilters = useCallback((filters) => {
		console.log('Applied filters:', filters);
		// Implement filter logic here
	}, []);

	const renderItem = useCallback(({ item }) => {
		return <AgendaItem item={item} />;
	}, []);

	const calendarRef = useRef(null);
	const rotation = useRef(new Animated.Value(0));

	/**
	 * Smooth and refined calendar toggle animation
	 */
	const toggleCalendarExpansion = useCallback(() => {
		const isOpen = calendarRef.current?.toggleCalendarPosition();
		Animated.timing(rotation.current, {
			toValue: isOpen ? 1 : 0,
			duration: 250,
			useNativeDriver: true,
			easing: Easing.bezier(0.4, 0.0, 0.2, 1),
		}).start();
	}, []);

	const renderHeader = useCallback(
		(date) => {			
			return (
				<View style={styles.calendarHeaderContainer}>
					<TouchableOpacity
						style={styles.calendarHeader}
						onPress={toggleCalendarExpansion}
						activeOpacity={0.9}>
						<Text style={styles.calendarHeaderTitle}>
							{date?.toString("MMMM yyyy")}
						</Text>
					</TouchableOpacity>
				</View>
			);
		},
		[toggleCalendarExpansion],
	);

	const onCalendarToggled = useCallback((isOpen) => {
		rotation.current.setValue(isOpen ? 1 : 0);
	}, []);

	const calendarTheme = useMemo(
    () => ({
      backgroundColor: colors.background,
      calendarBackground: colors.background,
      textSectionTitleColor: colors.textSecondary,
      selectedDayBackgroundColor: colors.primary,
      selectedDayTextColor: colors.white,
      todayTextColor: colors.primary,
      dayTextColor: colors.textPrimary,
      textDisabledColor: colors.textTertiary,
      dotColor: colors.primary,
      selectedDotColor: colors.white,
      arrowColor: colors.primary,
      monthTextColor: colors.textPrimary,
      indicatorColor: colors.primary,
      textDayFontFamily: 'System',
      textMonthFontFamily: 'System',
      textDayHeaderFontFamily: 'System',
      textDayFontWeight: '600',
      textMonthFontWeight: '700',
      textDayHeaderFontWeight: '600',
      textDayFontSize: 16,
      textMonthFontSize: 20,
      textDayHeaderFontSize: 13,
      agendaDayTextColor: colors.textPrimary,
      agendaDayNumColor: colors.textSecondary,
      agendaTodayColor: colors.primary,
      agendaKnobColor: colors.primary,
      // Modern calendar styling
      'stylesheet.calendar.header': {
        week: {
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: colors.surface,
          borderRadius: 12,
          marginHorizontal: 16,
          paddingVertical: 8,
        },
      },
    }),
    []
  );
	
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Upcoming</Text>
				<View style={styles.headerActions}>
					<TouchableOpacity 
						style={styles.headerButton}
						onPress={handleOpenFilterModal}>
						<MaterialCommunityIcons
							name="timeline-text-outline"
							size={20}
							color={colors.textSecondary}
						/>
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

			<CalendarProvider
				date={agendaItems[1]?.title}
				showTodayButton
				todayButtonStyle={styles.todayButton}
				theme={calendarTheme}>
				{weekView ? (
					<WeekCalendar
						testID="week_calendar"
						firstDay={1}
						markedDates={marked.current}
					/>
				) : (
					<ExpandableCalendar
						testID="expandable_calendar"
						renderHeader={renderHeader}
						ref={calendarRef}
						onCalendarToggled={onCalendarToggled}
						theme={calendarTheme}
						firstDay={1}
						markedDates={marked.current}
						leftArrowImageSource={leftArrowIcon}
						rightArrowImageSource={rightArrowIcon}
					/>
				)}
				<AgendaList
					sections={agendaItems}
					renderItem={renderItem}
					sectionStyle={styles.section}
					theme={calendarTheme}
				/>
			</CalendarProvider>

			<TaskFilterModal
				visible={isFilterModalVisible}
				onClose={handleCloseFilterModal}
				onApply={handleApplyFilters}
			/>
		</View>
	);
};

export default Upcoming;

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
	
	// Section Styling
	section: {
		backgroundColor: colors.background,
		paddingTop: spacing.xs,
	},
	
	// Ultra-clean Task Item Design
	taskItem: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.xs,
		backgroundColor: colors.surface,
		borderRadius: spacing.sm,
	},
	taskContent: {
		flexDirection: "row",
		alignItems: "flex-start",
		padding: spacing.md,
		gap: spacing.sm,
	},
	todayButton: {
		backgroundColor: colors.primary,
		borderRadius: spacing.sm,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		textAlign: "center",
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
	
	// Legacy styles for compatibility
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
