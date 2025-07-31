import React, { useRef, useCallback, useState } from "react";
import {
	Animated,
	Easing,
	View,
} from "react-native";
import {
	ExpandableCalendar,
	AgendaList,
	CalendarProvider,
	WeekCalendar,
} from "react-native-calendars";
import leftArrowIcon from "@/assets/icons/previous.png";
import rightArrowIcon from "@/assets/icons/next.png";
import { getMarkedDates } from "@/utils/gnFunc";
import TaskFilterModal from "@/components/Tasks/TaskFilterModal";
import {
	UpcomingHeader,
	UpcomingAgendaItem,
	UpcomingCalendarHeader,
	useUpcomingCalendarTheme,
	agendaItems,
	upcomingStyles,
} from "@/components/Upcoming";

const Upcoming = ({ weekView }) => {
	const marked = useRef(getMarkedDates(agendaItems));
	const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
	const calendarTheme = useUpcomingCalendarTheme();

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

	/**
	 * Handle menu button press
	 */
	const handleMenuPress = useCallback(() => {
		// Implement menu functionality here
	}, []);

	/**
	 * Handle task completion toggle
	 */
	const handleToggleTaskCompletion = useCallback((taskId) => {
		// Implement task completion toggle logic here
		console.log('Toggle task completion:', taskId);
	}, []);

	/**
	 * Render agenda item component
	 */
	const renderItem = useCallback(({ item }) => {
		return (
			<UpcomingAgendaItem 
				item={item} 
				onToggleCompletion={handleToggleTaskCompletion}
			/>
		);
	}, [handleToggleTaskCompletion]);

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

	/**
	 * Render calendar header component
	 */
	const renderHeader = useCallback(
		(date) => {			
			return (
				<UpcomingCalendarHeader 
					date={date}
					onToggleExpansion={toggleCalendarExpansion}
				/>
			);
		},
		[toggleCalendarExpansion],
	);

	/**
	 * Handle calendar toggle animation
	 */
	const onCalendarToggled = useCallback((isOpen) => {
		rotation.current.setValue(isOpen ? 1 : 0);
	}, []);
	
	return (
		<View style={upcomingStyles.container}>
			<UpcomingHeader 
				onFilterPress={handleOpenFilterModal}
				onMenuPress={handleMenuPress}
			/>

			<CalendarProvider
				date={agendaItems[1]?.title}
				showTodayButton
				todayButtonStyle={upcomingStyles.todayButton}
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
					sectionStyle={upcomingStyles.section}
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