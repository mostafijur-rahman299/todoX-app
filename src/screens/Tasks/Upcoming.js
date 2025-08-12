import React, { useRef, useCallback, useState, useEffect, useMemo } from "react";
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
	upcomingStyles,
} from "@/components/Upcoming";
import AddTaskButton from '@/components/AddTaskButton';

const Upcoming = () => {
	const dispatch = useDispatch();
	const task_list = useSelector((state) => state.task.calendar_list);
	const marked = useRef(getMarkedDates([]));
	const calendarTheme = useUpcomingCalendarTheme();
	
	// State management for menu functionality
	const [showMenu, setShowMenu] = useState(false);
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [selectedTaskIds, setSelectedTaskIds] = useState([]);
	const [filterBy, setFilterBy] = useState('all');
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [calendarKey, setCalendarKey] = useState(0);
	const [filteredAgendaItems, setFilteredAgendaItems] = useState([]);
	
	const [weekView, setWeekView] = useState(false);
	const calendarRef = useRef(null);
	const rotation = useRef(new Animated.Value(0));

	const today = new Date().toISOString().split("T")[0];

	/** 
	 * Convert tasks from Redux store to agenda items format
	 */
	function convertTasks(tasks) {
		const grouped = tasks.reduce((acc, task) => {
			const taskDate = task.date || today;
			if (!acc[taskDate]) acc[taskDate] = [];
			
			acc[taskDate].push({
				id: task.id || `${task.title}_${taskDate}_${Date.now()}`,
				is_completed: task.is_completed || false,
				priority: task.priority || "low",
				category: task.category?.toLowerCase() || "inbox",
				title: task.title || "Untitled Task",
				time: task.time || task.startTime,
				startTime: task.startTime,
				endTime: task.endTime,
				itemCustomHeightType: "LongEvent",
			});
			return acc;
		}, {});

		return Object.entries(grouped)
			.sort(([a], [b]) => new Date(a) - new Date(b))
			.map(([date, data]) => ({
				title: date,
				data: data.sort((a, b) => {
					// Sort by time if available
					if (a.time && b.time) {
						return a.time.localeCompare(b.time);
					}
					return 0;
				})
			}));
	}

	// Load from Redux
	const markedDates = useMemo(() => {
	const newMarked = getMarkedDates(task_list);
	return Object.keys(newMarked).length
		? newMarked
		: { [today]: { marked: true, dotColor: "#00adf5" } };
	}, [task_list]);

	 

	/**
	 * Filter agenda items based on current filter 
	 */
	const filterAgendaItems = useCallback(() => {
		let sourceItems = [];
		
		// Use task_list if available, otherwise use agendaItems as fallback
		if (task_list && task_list.length > 0) {
			sourceItems = convertTasks(task_list);
		} else {
			sourceItems = filteredAgendaItems;
		}

		if (filterBy === 'all') {
			setFilteredAgendaItems(sourceItems);
			return;
		}

		const filtered = sourceItems.map(section => ({
			...section,
			data: section.data.filter(item => {
				// Skip empty items
				if (!item.title || item.title === "No tasks today") return false;
				return item.priority === filterBy;
			})
		})).filter(section => section.data.length > 0);

		// If no filtered items, show empty state
		if (filtered.length === 0) {
			filtered.push({
				title: today,
				data: [{ id: "no-filtered-tasks", title: `No ${filterBy} priority tasks` }],
			});
		}

		setFilteredAgendaItems(filtered);
	}, [filterBy, task_list, today]);

	/**
	 * Get total filtered tasks count
	 */
	const getFilteredTasksCount = useCallback(() => {
		return filteredAgendaItems.reduce((total, section) => {
			return total + section.data.filter(item => item.title && !item.title.includes("No tasks") && !item.title.includes("No ")).length;
		}, 0);
	}, [filteredAgendaItems]);

	/**
	 * Apply filters when filterBy changes
	 */
	useEffect(() => {
		filterAgendaItems();
		setCalendarKey(Date.now());
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
			// TODO: Dispatch action to toggle task completion in Redux store
		}
	}, [isSelectionMode, selectedTaskIds, handleTaskSelection]);

	/**
	 * Render agenda item component
	 */
	const renderItem = useCallback(({ item }) => {
		// Generate a unique ID for agenda items if they don't have one
		const itemId = item.id || `${item.title}_${item.time || 'no-time'}`;
		
		return (
			<UpcomingAgendaItem 
				item={{ ...item, id: itemId }} 
				// onToggleCompletion={handleToggleTaskCompletion}
				isSelectionMode={isSelectionMode}
				isSelected={selectedTaskIds.includes(itemId)}
			/>
		);
	}, [ isSelectionMode, selectedTaskIds]);

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

	/**
	 * Toggle between week and month view
	 */
	const toggleWeekView = useCallback(() => {
		setWeekView(!weekView);
		setCalendarKey(Date.now());
	}, [weekView]);
	
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
					weekView={weekView}
					onToggleWeekView={toggleWeekView}
				/>

				<UpcomingMenuDropdown
					showMenu={showMenu}
					filterBy={filterBy}
					isRefreshing={isRefreshing}
					onEnterSelectionMode={handleEnterSelectionMode}
					onFilterChange={handleFilterChange}
					onClose={handleMenuClose}
				/>
			</View>

			<CalendarProvider
				date={today}
				showTodayButton
				todayButtonStyle={upcomingStyles.todayButton}
				theme={calendarTheme}>
				{weekView ? (
					<WeekCalendar
						testID="week_calendar"
						firstDay={1}
						markedDates={markedDates}
					/>
				) : (
					<ExpandableCalendar
						key={calendarKey}
						renderHeader={renderHeader}
						ref={calendarRef}
						onCalendarToggled={onCalendarToggled}
						theme={calendarTheme}
						firstDay={1}
						markedDates={markedDates}
						leftArrowImageSource={leftArrowIcon}
						rightArrowImageSource={rightArrowIcon}
					/> 
				)}
				<AgendaList
					sections={task_list}
					renderItem={renderItem}
					sectionStyle={upcomingStyles.section}
					theme={calendarTheme}
				/>
			</CalendarProvider>

			<AddTaskButton />
		</View>
	);
};

export default React.memo(Upcoming);