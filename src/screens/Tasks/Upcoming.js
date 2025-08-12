import React, { useRef, useCallback, useState, useEffect, useMemo } from "react";
import {
	Animated,
	Easing,
	View,
	Alert,
	TouchableOpacity,
} from "react-native";
import {
	ExpandableCalendar,
	AgendaList,
	CalendarProvider,
	WeekCalendar,
} from "react-native-calendars";
import { useSelector } from 'react-redux';
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
import TaskDetailModal from '@/components/Tasks/TaskDetailModal';
import { convertTaskListToAgendaList } from "@/utils/gnFunc";
import useTasks from '@/hooks/useTasks';

const Upcoming = () => {
	const task_list = useSelector((state) => state.task.task_list);
	const calendarTheme = useUpcomingCalendarTheme();
	const { bulkCompleteTask, updateTask, deleteTask, loadTasksFromStorage } = useTasks();
	
	// State management for menu functionality
	const [showMenu, setShowMenu] = useState(false);
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [selectedTaskIds, setSelectedTaskIds] = useState([]);
	const [filterBy, setFilterBy] = useState('all');
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [calendarKey, setCalendarKey] = useState(0);
	const [filteredAgendaItems, setFilteredAgendaItems] = useState([]);
	const [agendaItems, setAgendaItems] = useState([]);
	
	// Task detail modal state
	const [showTaskModal, setShowTaskModal] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	
	const [weekView, setWeekView] = useState(false);
	const calendarRef = useRef(null);
	const rotation = useRef(new Animated.Value(0));

	const today = new Date().toISOString().split("T")[0];

	// Load from Redux
	const markedDates = useMemo(() => {
	const dataSource = filterBy === 'all' ? agendaItems : filteredAgendaItems;
	const newMarked = getMarkedDates(dataSource);
	return Object.keys(newMarked).length
		? newMarked
		: { [today]: { marked: true, dotColor: "#00adf5" } };
	}, [agendaItems, filteredAgendaItems, filterBy, today]);

	
	useEffect(() => {
		setAgendaItems(convertTaskListToAgendaList(task_list));
	}, [task_list]);
	 

	/**
	 * Filter agenda items based on current filter 
	 */
	const filterAgendaItems = useCallback(() => {
		// Always use agendaItems as the source for filtering
		const sourceItems = agendaItems || [];

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
	}, [filterBy, agendaItems, today]);

	/**
	 * Get total filtered tasks count
	 */
	const getFilteredTasksCount = useCallback(() => {
		const dataSource = filterBy === 'all' ? agendaItems : filteredAgendaItems;
		return dataSource.reduce((total, section) => {
			return total + section.data.filter(item => item.title && !item.title.includes("No tasks") && !item.title.includes("No ")).length;
		}, 0);
	}, [filteredAgendaItems, agendaItems, filterBy]);

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
		setIsRefreshing(true);
		await loadTasksFromStorage();
		setIsRefreshing(false);
		setDisplayTasks(task_list);
		setShowMenu(false);
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
			bulkCompleteTask(selectedTaskIds);
			setIsSelectionMode(false);
			setSelectedTaskIds([]);
		} catch (error) {
			console.error('Error completing tasks:', error);
			Alert.alert('Error', 'Failed to complete tasks. Please try again.');
		}
	};

	/**
	 * Handle task press to open detail modal
	 */
	const handleTaskPress = (task) => {
		// Find the original task from task_list using the task id
		const originalTask = task_list.find(t => t.id === task.id);
		if (originalTask) {
			setSelectedTask(originalTask);
			setShowTaskModal(true);
		}
	};

	/**
	 * Handle closing task detail modal
	 */
	const handleCloseTaskModal = () => {
		setShowTaskModal(false);
		setSelectedTask(null);
	};

	/**
	 * Handle updating a task from TaskDetailModal
	 */
	const handleUpdateTask = async (updatedTask) => {
		try {
			const success = await updateTask(updatedTask.id, updatedTask);
			
			if (success) {
				// Update selected task if it's the same one being edited
				if (selectedTask && selectedTask.id === updatedTask.id) {
					setSelectedTask(updatedTask);
				}
			} else {
				Alert.alert('Error', 'Failed to update task. Please try again.');
			}
		} catch (error) {
			console.error('Error updating task:', error);
			Alert.alert('Error', 'Failed to update task. Please try again.');
		}
	};

	/**
	 * Handle deleting a task from TaskDetailModal
	 */
	const handleDeleteTask = async (taskId) => {
		try {
			const success = await deleteTask(taskId);
			
			if (success) {
				// Close modal if the deleted task was selected
				if (selectedTask && selectedTask.id === taskId) {
					handleCloseTaskModal();
				}
			} else {
				Alert.alert('Error', 'Failed to delete task. Please try again.');
			}
		} catch (error) {
			console.error('Error deleting task:', error);
			Alert.alert('Error', 'Failed to delete task. Please try again.');
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
			bulkCompleteTask([taskId]);
		}
	}, [isSelectionMode, handleTaskSelection, bulkCompleteTask]);

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
				onTaskPress={isSelectionMode ? () => handleTaskSelection(itemId) : () => handleTaskPress(item)}
				isSelectionMode={isSelectionMode}
				isSelected={selectedTaskIds.includes(itemId)}
			/>
		);
	}, [handleToggleTaskCompletion, isSelectionMode, selectedTaskIds, handleTaskSelection, handleTaskPress]);

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
			{showMenu && (
				<TouchableOpacity
					style={upcomingStyles.menuOverlay}
					onPress={() => setShowMenu(false)}
					activeOpacity={1}
				/>
			)}

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
					onRefreshTasks={handleRefreshTasks}
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
					sections={filterBy === 'all' ? agendaItems : filteredAgendaItems}
					renderItem={renderItem}
					sectionStyle={upcomingStyles.section}
					theme={calendarTheme}
				/>
			</CalendarProvider>

			<AddTaskButton />

			<TaskDetailModal
				visible={showTaskModal}
				onClose={handleCloseTaskModal}
				task={selectedTask}
				onUpdateTask={handleUpdateTask}
				onDeleteTask={handleDeleteTask}
			/>
		</View>
	);
};

export default React.memo(Upcoming);