import React, { useRef, useCallback, useState, useEffect } from "react";
import {
	Animated,
	Easing,
	View,
	Alert,
} from "react-native";
import {
	ExpandableCalendar,
	AgendaList,
	CalendarProvider,
	WeekCalendar,
} from "react-native-calendars";
import { useDispatch, useSelector } from 'react-redux';
import leftArrowIcon from "@/assets/icons/previous.png";
import rightArrowIcon from "@/assets/icons/next.png";
import { getMarkedDates } from "@/utils/gnFunc";

import {
	UpcomingHeader,
	UpcomingAgendaItem,
	UpcomingCalendarHeader,
	UpcomingMenuDropdown,
	useUpcomingCalendarTheme,
	agendaItems,
	upcomingStyles,
} from "@/components/Upcoming";
import AddTaskButton from '@/components/AddTaskButton';

const Upcoming = ({ weekView }) => {
	const dispatch = useDispatch();
	const tasks = useSelector((state) => state.task.display_tasks);
	const marked = useRef(getMarkedDates(agendaItems));
	const calendarTheme = useUpcomingCalendarTheme();
	
	// State management for menu functionality
	const [showMenu, setShowMenu] = useState(false);
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [selectedTaskIds, setSelectedTaskIds] = useState([]);
	const [filterBy, setFilterBy] = useState('all');
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [filteredAgendaItems, setFilteredAgendaItems] = useState(agendaItems);

	/**
	 * Filter agenda items based on current filter
	 */
	const filterAgendaItems = useCallback(() => {
		if (filterBy === 'all') {
			setFilteredAgendaItems(agendaItems);
			return;
		}

		const filtered = agendaItems.map(section => ({
			...section,
			data: section.data.filter(item => {
				// Skip empty items
				if (!item.title) return false;
				return item.priority === filterBy;
			})
		})).filter(section => section.data.length > 0);

		setFilteredAgendaItems(filtered);
	}, [filterBy]);

	/**
	 * Get total filtered tasks count
	 */
	const getFilteredTasksCount = useCallback(() => {
		return filteredAgendaItems.reduce((total, section) => {
			return total + section.data.filter(item => item.title).length;
		}, 0);
	}, [filteredAgendaItems]);

	/**
	 * Apply filters when filterBy changes
	 */
	useEffect(() => {
		filterAgendaItems();
	}, [filterAgendaItems]);

	/**
	 * Handle entering selection mode
	 */
	const handleEnterSelectionMode = () => {
		setIsSelectionMode(true);
		setSelectedTaskIds([]);
		setShowMenu(false);
	};

	/**
	 * Handle exiting selection mode
	 */
	const handleExitSelectionMode = () => {
		setIsSelectionMode(false);
		setSelectedTaskIds([]);
	};

	/**
	 * Handle refresh tasks from storage
	 */
	const handleRefreshTasks = async () => {
		// setIsRefreshing(true);
		// try {
		// 	const storedTasks = await getDataLocalStorage('task_list') || [];
		// 	dispatch(setTasks(storedTasks));
		// 	Alert.alert('Success', 'Tasks refreshed successfully');
		// } catch (error) {
		// 	console.error('Error refreshing tasks:', error);
		// 	Alert.alert('Error', 'Failed to refresh tasks. Please try again.');
		// } finally {
		// 	setIsRefreshing(false);
		// 	setShowMenu(false);
		// }
	};

	/**
	 * Handle task selection in selection mode
	 */
	const handleTaskSelection = (taskId) => {
		if (selectedTaskIds.includes(taskId)) {
			setSelectedTaskIds(selectedTaskIds.filter(id => id !== taskId));
		} else {
			setSelectedTaskIds([...selectedTaskIds, taskId]);
		}
	};

	/**
	 * Handle bulk actions on selected tasks
	 */
	const handleBulkComplete = async () => {
		try {
			// Implement bulk complete logic here
			Alert.alert('Success', `${selectedTaskIds.length} tasks completed`);
			setIsSelectionMode(false);
			setSelectedTaskIds([]);
		} catch (error) {
			console.error('Error completing tasks:', error);
			Alert.alert('Error', 'Failed to complete tasks. Please try again.');
		}
	};

	/**
	 * Handle filter change
	 */
	const handleFilterChange = (filter) => {
		setFilterBy(filter);
		setShowMenu(false);
	};

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
		setShowMenu(!showMenu);
	}, [showMenu]);

	/**
	 * Handle menu close (for outside click)
	 */
	const handleMenuClose = useCallback(() => {
		setShowMenu(false);
	}, []);

	/**
	 * Handle task completion toggle
	 */
	const handleToggleTaskCompletion = useCallback((taskId) => {
		if (isSelectionMode) {
			handleTaskSelection(taskId);
		} else {
			// Implement task completion toggle logic here
			console.log('Toggle task completion:', taskId);
		}
	}, [isSelectionMode, selectedTaskIds]);

	/**
	 * Render agenda item component
	 */
	const renderItem = useCallback(({ item }) => {
		// Generate a unique ID for agenda items if they don't have one
		const itemId = item.id || `${item.title}_${item.time || 'no-time'}`;
		
		return (
			<UpcomingAgendaItem 
				item={{ ...item, id: itemId }} 
				onToggleCompletion={handleToggleTaskCompletion}
				isSelectionMode={isSelectionMode}
				isSelected={selectedTaskIds.includes(itemId)}
			/>
		);
	}, [handleToggleTaskCompletion, isSelectionMode, selectedTaskIds]);

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
			<View style={{ position: 'relative' }}>
				<UpcomingHeader 
					filteredTasksCount={getFilteredTasksCount()}
					filterBy={filterBy}
					showMenu={showMenu}
					setShowMenu={setShowMenu}
					isSelectionMode={isSelectionMode}
					selectedTaskIds={selectedTaskIds}
					onExitSelectionMode={handleExitSelectionMode}
					onBulkComplete={handleBulkComplete}
				/>

				<UpcomingMenuDropdown
					showMenu={showMenu}
					filterBy={filterBy}
					isRefreshing={isRefreshing}
					onEnterSelectionMode={handleEnterSelectionMode}
					onRefreshTasks={handleRefreshTasks}
					onFilterChange={handleFilterChange}
					onClose={handleMenuClose}
				/>
			</View>

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
					sections={filteredAgendaItems}
					renderItem={renderItem}
					sectionStyle={upcomingStyles.section}
					theme={calendarTheme}
				/>
			</CalendarProvider>

			<AddTaskButton />
		</View>
	);
};

export default Upcoming;