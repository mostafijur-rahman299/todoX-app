import React, { useState, useMemo, useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	Platform,
	Modal,
	TextInput,
	Animated,
	Easing,
	Alert,
	ScrollView,
	Dimensions,
	TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import {
	AgendaList,
	CalendarProvider,
	ExpandableCalendar,
} from "react-native-calendars";
import { colors, spacing, typography, borderRadius } from "@/constants/Colors";

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

/**
 * Upcoming screen component - calendar and upcoming tasks view using AgendaList
 * Displays tasks organized by date with calendar integration
 */
const Upcoming = () => {
	const tasks = useSelector((state) => state.task.display_tasks);
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0],
	);
	const [modalVisible, setModalVisible] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [selectedDateTime, setSelectedDateTime] = useState(new Date());
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		date: new Date().toISOString().split("T")[0],
		time: new Date().toTimeString().slice(0, 5),
		priority: "none",
		reminder: false,
		tag: "Inbox",
		isToday: false,
	});
	const [showPriorityOptions, setShowPriorityOptions] = useState(false);
	const [showInboxOptions, setShowInboxOptions] = useState(false);
	const slideAnim = useRef(new Animated.Value(300)).current;
	const prioritySlideAnim = useRef(new Animated.Value(-50)).current;
	const inboxSlideAnim = useRef(new Animated.Value(-50)).current; // Added animation for inbox
	const [showDateTimeModal, setShowDateTimeModal] = useState(false);

	// Available priority options - Updated to match exact design
	const priorityOptions = [
		{
			label: "Priority 1",
			value: "priority1",
			color: colors.error,
			icon: "flag",
		},
		{
			label: "Priority 3",
			value: "priority3",
			color: colors.warning,
			icon: "flag",
		},
		{
			label: "Priority 5",
			value: "priority5",
			color: colors.info,
			icon: "flag",
		},
		{
			label: "Priority 4",
			value: "priority4",
			color: colors.textTertiary,
			icon: "flag",
		},
	];

	// Enhanced inbox/tag options with colors
	const inboxOptions = [
		{
			label: "Inbox",
			value: "Inbox",
			icon: "mail-outline",
			color: colors.primary,
		},
		{
			label: "Work",
			value: "Work",
			icon: "briefcase-outline",
			color: colors.info,
		},
		{
			label: "Personal",
			value: "Personal",
			icon: "person-outline",
			color: colors.success,
		},
		{
			label: "Shopping",
			value: "Shopping",
			icon: "bag-outline",
			color: colors.warning,
		},
		{
			label: "Health",
			value: "Health",
			icon: "fitness-outline",
			color: colors.error,
		},
		{
			label: "Study",
			value: "Study",
			icon: "book-outline",
			color: colors.secondary,
		},
		{
			label: "Travel",
			value: "Travel",
			icon: "airplane-outline",
			color: colors.accent,
		},
		{
			label: "Finance",
			value: "Finance",
			icon: "card-outline",
			color: colors.tertiary,
		},
	];

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
	 * Transform tasks data into AgendaList sections format with Overdue handling
	 */
	const sections = useMemo(() => {
		const todayStr = new Date().toISOString().split("T")[0];
		const allTasks =
			tasks?.filter(
				(task) =>
					task.timestamp &&
					!isNaN(new Date(task.timestamp).getTime()),
			) || [];

		// Collect overdue (past unfinished tasks)
		const overdueTasks = allTasks
			.filter((task) => {
				const taskDateStr = new Date(task.timestamp)
					.toISOString()
					.split("T")[0];
				return !task.is_completed && taskDateStr < todayStr;
			})
			.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

		// Group remaining tasks by date
		const items = {};
		allTasks.forEach((task) => {
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
	}, [tasks]);

	/**
	 * Get marked dates for calendar with task indicators
	 */
	const markedDatesBase = useMemo(() => {
		const marked = {};
		const today = new Date().toISOString().split("T")[0];

		tasks?.forEach((task) => {
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
	}, [tasks]);

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
		console.log(`Toggling completion for task: ${taskId}`);
	};

	/**
	 * Handle add button press with animation
	 */
	const handleAddPress = () => {
		setModalVisible(true);
		Animated.timing(slideAnim, {
			toValue: 0,
			duration: 300,
			easing: Easing.out(Easing.ease),
			useNativeDriver: true,
		}).start();
	};

	/**
	 * Close modal with animation
	 */
	const closeModal = () => {
		Animated.timing(slideAnim, {
			toValue: 300,
			duration: 300,
			easing: Easing.in(Easing.ease),
			useNativeDriver: true,
		}).start(() => {
			setModalVisible(false);
			setNewTask({
				title: "",
				description: "",
				date: new Date().toISOString().split("T")[0],
				time: new Date().toTimeString().slice(0, 5),
				priority: "none",
				reminder: false,
				tag: "Inbox",
				isToday: false,
			});
			setShowPriorityOptions(false);
			setShowInboxOptions(false);
			setShowDateTimeModal(false);
		});
	};

	/**
	 * Handle Today option - now opens date/time modal
	 */
	const handleTodayToggle = () => {
		setShowDateTimeModal(true);
	};

	/**
	 * Handle date change from date picker
	 */
	const handleDateChange = (event, selectedDate) => {
		if (Platform.OS === "android") {
			setShowDatePicker(false);
		}
		if (selectedDate) {
			const newDateTime = new Date(selectedDateTime);
			newDateTime.setFullYear(selectedDate.getFullYear());
			newDateTime.setMonth(selectedDate.getMonth());
			newDateTime.setDate(selectedDate.getDate());
			setSelectedDateTime(newDateTime);
		}
	};

	/**
	 * Handle time change from time picker
	 */
	const handleTimeChange = (event, selectedTime) => {
		if (Platform.OS === "android") {
			setShowTimePicker(false);
		}
		if (selectedTime) {
			const newDateTime = new Date(selectedDateTime);
			newDateTime.setHours(selectedTime.getHours());
			newDateTime.setMinutes(selectedTime.getMinutes());
			setSelectedDateTime(newDateTime);
		}
	};

	/**
	 * Confirm date and time selection
	 */
	const confirmDateTime = () => {
		const today = new Date().toISOString().split("T")[0];
		const selectedDateStr = selectedDateTime.toISOString().split("T")[0];

		setNewTask((prev) => ({
			...prev,
			date: selectedDateStr,
			time: selectedDateTime.toTimeString().slice(0, 5),
			isToday: selectedDateStr === today,
		}));
		setShowDateTimeModal(false);
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
	 * Handle Priority option selection
	 */
	const handlePrioritySelect = (priority) => {
		setNewTask((prev) => ({ ...prev, priority: priority.value }));
		Animated.timing(prioritySlideAnim, {
			toValue: -50,
			duration: 200,
			easing: Easing.in(Easing.ease),
			useNativeDriver: true,
		}).start(() => setShowPriorityOptions(false));
	};

	/**
	 * Handle Reminder toggle
	 */
	const handleReminderToggle = () => {
		setNewTask((prev) => ({ ...prev, reminder: !prev.reminder }));
		if (!newTask.reminder) {
			Alert.alert(
				"Reminder Set",
				"You will be reminded about this task.",
				[{ text: "OK" }],
			);
		}
	};

	/**
	 * Handle Inbox/Tag selection with smooth animation
	 */
	const handleInboxSelect = (inbox) => {
		setNewTask((prev) => ({ ...prev, tag: inbox.value }));
		Animated.timing(inboxSlideAnim, {
			toValue: -50,
			duration: 200,
			easing: Easing.in(Easing.ease),
			useNativeDriver: true,
		}).start(() => setShowInboxOptions(false));
	};

	/**
	 * Save new task
	 */
	const saveTask = () => {
		if (!newTask.title.trim()) {
			Alert.alert("Error", "Please enter a task name");
			return;
		}

		console.log("Saving task:", newTask);
		Alert.alert(
			"Task Created",
			`Task "${newTask.title}" has been created successfully!`,
			[{ text: "OK", onPress: closeModal }],
		);
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

	/**
	 * Get current priority option
	 */
	const getCurrentPriority = () => {
		return (
			priorityOptions.find((p) => p.value === newTask.priority) || {
				label: "Priority",
				value: "none",
				color: colors.textTertiary,
				icon: "flag-outline",
			}
		);
	};

	/**
	 * Get current inbox option
	 */
	const getCurrentInbox = () => {
		return (
			inboxOptions.find((i) => i.value === newTask.tag) || inboxOptions[0]
		);
	};

	/**
	 * Format selected date and time for display
	 */
	const getDateTimeDisplay = () => {
		if (newTask.isToday) {
			return `Today at ${newTask.time}`;
		}
		const date = new Date(newTask.date);
		return `${date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		})} at ${newTask.time}`;
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Upcoming</Text>
				<View style={styles.headerActions}>
					<TouchableOpacity style={styles.headerButton}>
						<Ionicons
							name="reorder-four"
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

			{/* Add Button */}
			<TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
				<Ionicons name="add" size={24} color={colors.white} />
			</TouchableOpacity>

			{/* Add Task Modal */}
			<Modal
				animationType="none"
				transparent={true}
				visible={modalVisible}
				onRequestClose={closeModal}>
				<TouchableWithoutFeedback onPress={closeModal}>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback onPress={() => {}}>
							<Animated.View
								style={[
									styles.modalView,
									{ transform: [{ translateY: slideAnim }] },
								]}>
								<View style={styles.modalHeader}>
									<View style={styles.modalHandle} />
								</View>

								<View style={styles.inputContainer}>
									<View
										style={[
											styles.checkboxInner,
											{ borderColor: colors.success },
										]}
									/>
									<TextInput
										style={styles.input}
										placeholder="Task name"
										placeholderTextColor={
											colors.textTertiary
										}
										value={newTask.title}
										onChangeText={(text) =>
											setNewTask({
												...newTask,
												title: text,
											})
										}
									/>
								</View>

								<View style={styles.modalOptions}>
									{/* Today Option - Enhanced with date/time display */}
									<TouchableOpacity
										style={[
											styles.optionButton,
											(newTask.isToday ||
												newTask.date !==
													new Date()
														.toISOString()
														.split("T")[0]) &&
												styles.optionButtonActive,
										]}
										onPress={handleTodayToggle}>
										<Ionicons
											name="calendar-outline"
											size={16}
											color={
												newTask.isToday ||
												newTask.date !==
													new Date()
														.toISOString()
														.split("T")[0]
													? colors.success
													: colors.textSecondary
											}
										/>
										<Text
											style={[
												styles.optionText,
												(newTask.isToday ||
													newTask.date !==
														new Date()
															.toISOString()
															.split("T")[0]) &&
													styles.optionTextActive,
											]}>
											{newTask.isToday ||
											newTask.date !==
												new Date()
													.toISOString()
													.split("T")[0]
												? getDateTimeDisplay()
												: "Today"}
										</Text>
									</TouchableOpacity>

									{/* Priority Option */}
									<TouchableOpacity
										style={[
											styles.optionButton,
											newTask.priority !== "none" &&
												styles.optionButtonActive,
										]}
										onPress={handlePriorityToggle}>
										<Ionicons
											name={getCurrentPriority().icon}
											size={16}
											color={
												newTask.priority !== "none"
													? getCurrentPriority().color
													: colors.textSecondary
											}
										/>
										<Text
											style={[
												styles.optionText,
												newTask.priority !== "none" &&
													styles.optionTextActive,
											]}>
											Priority
										</Text>
									</TouchableOpacity>

									{/* Reminders Option */}
									<TouchableOpacity
										style={[
											styles.optionButton,
											newTask.reminder &&
												styles.optionButtonActive,
										]}
										onPress={handleReminderToggle}>
										<Ionicons
											name={
												newTask.reminder
													? "notifications"
													: "notifications-outline"
											}
											size={16}
											color={
												newTask.reminder
													? colors.warning
													: colors.textSecondary
											}
										/>
										<Text
											style={[
												styles.optionText,
												newTask.reminder &&
													styles.optionTextActive,
											]}>
											Reminders
										</Text>
									</TouchableOpacity>
								</View>

								{/* Priority Options Dropdown */}
								{showPriorityOptions && (
									<Animated.View
										style={[
											styles.priorityDropdown,
											{
												transform: [
													{
														translateY:
															prioritySlideAnim,
													},
												],
											},
										]}>
										<ScrollView
											style={styles.priorityScrollView}
											showsVerticalScrollIndicator={false}
											nestedScrollEnabled={true}>
											{priorityOptions.map(
												(priority, index) => (
													<TouchableOpacity
														key={index}
														style={[
															styles.priorityOption,
															newTask.priority ===
																priority.value &&
																styles.priorityOptionSelected,
														]}
														onPress={() =>
															handlePrioritySelect(
																priority,
															)
														}
														activeOpacity={0.7}>
														<Ionicons
															name={priority.icon}
															size={20}
															color={
																priority.color
															}
														/>
														<Text
															style={[
																styles.priorityOptionText,
																newTask.priority ===
																	priority.value &&
																	styles.priorityOptionTextSelected,
															]}>
															{priority.label}
														</Text>
													</TouchableOpacity>
												),
											)}
										</ScrollView>
									</Animated.View>
								)}

								{/* Enhanced Inbox/Category Selector */}
								<TouchableOpacity
									style={[
										styles.inboxSelector,
										newTask.tag !== "Inbox" &&
											styles.inboxSelectorActive,
									]}
									onPress={handleInboxToggle}>
									<Ionicons
										name={getCurrentInbox().icon}
										size={16}
										color={
											getCurrentInbox().color ||
											colors.textTertiary
										}
									/>
									<Text style={styles.inboxSelectorText}>
										{getCurrentInbox().label}
									</Text>
									<Ionicons
										name={
											showInboxOptions
												? "chevron-up"
												: "chevron-down"
										}
										size={16}
										color={colors.textTertiary}
									/>
								</TouchableOpacity>

								{/* Enhanced Inbox Options Dropdown */}
								{showInboxOptions && (
									<Animated.View
										style={[
											styles.inboxDropdown,
											{
												transform: [
													{
														translateY:
															inboxSlideAnim,
													},
												],
											}, // Added animation
										]}>
										<ScrollView
											style={styles.inboxScrollView}
											showsVerticalScrollIndicator={false}
											nestedScrollEnabled={true}>
											{inboxOptions.map(
												(inbox, index) => (
													<TouchableOpacity
														key={index}
														style={[
															styles.inboxOption,
															newTask.tag ===
																inbox.value &&
																styles.inboxOptionSelected,
														]}
														onPress={() =>
															handleInboxSelect(
																inbox,
															)
														}
														activeOpacity={0.7}>
														<Ionicons
															name={inbox.icon}
															size={20}
															color={
																inbox.color ||
																colors.textSecondary
															}
														/>
														<Text
															style={[
																styles.inboxOptionText,
																newTask.tag ===
																	inbox.value &&
																	styles.inboxOptionTextSelected,
															]}>
															{inbox.label}
														</Text>
													</TouchableOpacity>
												),
											)}
										</ScrollView>
									</Animated.View>
								)}

								{/* Send Button */}
								<TouchableOpacity
									style={styles.sendButton}
									onPress={saveTask}>
									<Ionicons
										name="send"
										size={18}
										color={colors.white}
									/>
								</TouchableOpacity>
							</Animated.View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</Modal>

			{/* Date Time Selection Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={showDateTimeModal}
				onRequestClose={() => setShowDateTimeModal(false)}>
				<View style={styles.dateTimeModalOverlay}>
					<View style={styles.dateTimeModalView}>
						<View style={styles.dateTimeHeader}>
							<TouchableOpacity
								onPress={() => setShowDateTimeModal(false)}>
								<Text style={styles.cancelButton}>Cancel</Text>
							</TouchableOpacity>
							<Text style={styles.dateTimeTitle}>
								Select Date & Time
							</Text>
							<TouchableOpacity onPress={confirmDateTime}>
								<Text style={styles.confirmButton}>Done</Text>
							</TouchableOpacity>
						</View>

						<ScrollView style={styles.dateTimeContent}>
							{/* Date Selection */}
							<View style={styles.dateTimeSection}>
								<Text style={styles.sectionLabel}>Date</Text>
								<TouchableOpacity
									style={styles.dateTimeButton}
									onPress={() => setShowDatePicker(true)}>
									<Ionicons
										name="calendar-outline"
										size={20}
										color={colors.primary}
									/>
									<Text style={styles.dateTimeButtonText}>
										{selectedDateTime.toLocaleDateString(
											"en-US",
											{
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											},
										)}
									</Text>
								</TouchableOpacity>
							</View>

							{/* Time Selection */}
							<View style={styles.dateTimeSection}>
								<Text style={styles.sectionLabel}>Time</Text>
								<TouchableOpacity
									style={styles.dateTimeButton}
									onPress={() => setShowTimePicker(true)}>
									<Ionicons
										name="time-outline"
										size={20}
										color={colors.primary}
									/>
									<Text style={styles.dateTimeButtonText}>
										{selectedDateTime.toLocaleTimeString(
											"en-US",
											{
												hour: "2-digit",
												minute: "2-digit",
											},
										)}
									</Text>
								</TouchableOpacity>
							</View>

							{/* Quick Date Options */}
							<View style={styles.dateTimeSection}>
								<Text style={styles.sectionLabel}>
									Quick Select
								</Text>
								<View style={styles.quickDateOptions}>
									<TouchableOpacity
										style={styles.quickDateButton}
										onPress={() =>
											setSelectedDateTime(new Date())
										}>
										<Text style={styles.quickDateText}>
											Today
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.quickDateButton}
										onPress={() => {
											const tomorrow = new Date();
											tomorrow.setDate(
												tomorrow.getDate() + 1,
											);
											setSelectedDateTime(tomorrow);
										}}>
										<Text style={styles.quickDateText}>
											Tomorrow
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.quickDateButton}
										onPress={() => {
											const nextWeek = new Date();
											nextWeek.setDate(
												nextWeek.getDate() + 7,
											);
											setSelectedDateTime(nextWeek);
										}}>
										<Text style={styles.quickDateText}>
											Next Week
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</View>
				</View>
			</Modal>

			{/* Date Picker */}
			{showDatePicker && (
				<DateTimePicker
					value={selectedDateTime}
					mode="date"
					display={Platform.OS === "ios" ? "spinner" : "default"}
					onChange={handleDateChange}
					minimumDate={new Date()}
				/>
			)}

			{/* Time Picker */}
			{showTimePicker && (
				<DateTimePicker
					value={selectedDateTime}
					mode="time"
					display={Platform.OS === "ios" ? "spinner" : "default"}
					onChange={handleTimeChange}
				/>
			)}
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
	},
	addButton: {
		position: "absolute",
		bottom: 30,
		right: spacing.lg,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		...Platform.select({
			ios: {
				shadowColor: colors.shadow.medium,
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.3,
				shadowRadius: 8,
			},
			android: {
				elevation: 8,
			},
		}),
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: colors.overlay,
		justifyContent: "flex-end",
	},
	modalView: {
		backgroundColor: colors.surface,
		borderTopLeftRadius: borderRadius.xl,
		borderTopRightRadius: borderRadius.xl,
		padding: spacing.lg,
		maxHeight: "90%",
	},
	modalHeader: {
		alignItems: "center",
		marginBottom: spacing.lg,
	},
	modalHandle: {
		width: 40,
		height: 4,
		backgroundColor: colors.textTertiary,
		borderRadius: borderRadius.sm,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.lg,
	},
	input: {
		flex: 1,
		fontSize: typography.fontSize.lg,
		color: colors.textPrimary,
		marginLeft: spacing.sm,
		paddingVertical: spacing.sm,
	},
	descriptionLabel: {
		fontSize: typography.fontSize.sm,
		color: colors.textTertiary,
		marginBottom: spacing.lg,
	},
	modalOptions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginBottom: spacing.lg,
		flexWrap: "wrap",
		position: "relative",
	},
	optionButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.sm,
		backgroundColor: colors.background,
		borderRadius: borderRadius.md,
		borderWidth: 1,
		borderColor: "transparent",
		maxWidth: screenWidth * 0.4,
	},
	optionButtonActive: {
		backgroundColor: colors.surface,
		borderColor: colors.primary,
	},
	optionText: {
		fontSize: typography.fontSize.sm,
		color: colors.textSecondary,
		fontWeight: typography.fontWeight.medium,
		flexShrink: 1,
	},
	optionTextActive: {
		color: colors.textPrimary,
	},
	moreButton: {
		padding: spacing.sm,
		backgroundColor: colors.background,
		borderRadius: borderRadius.md,
	},
	// Enhanced Priority Dropdown Styles
	priorityDropdown: {
		position: "absolute",
		top: 50,
		left: 0,
		right: 0,
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		paddingVertical: spacing.sm,
		marginHorizontal: spacing.sm,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
		zIndex: 1000,
		maxHeight: Math.min(200, screenHeight * 0.25),
		borderWidth: 1,
		borderColor: colors.border,
	},
	priorityScrollView: {
		maxHeight: Math.min(180, screenHeight * 0.22),
	},
	priorityOption: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		borderRadius: borderRadius.md,
		marginHorizontal: spacing.sm,
		marginVertical: 2,
		minHeight: 44,
	},
	priorityOptionSelected: {
		backgroundColor: colors.backgroundSecondary,
	},
	priorityOptionText: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.medium,
		color: colors.textPrimary,
		marginLeft: spacing.sm,
		flex: 1,
	},
	priorityOptionTextSelected: {
		color: colors.primary,
		fontWeight: typography.fontWeight.semibold,
	},
	// Enhanced Inbox Selector Styles
	inboxSelector: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.sm,
		backgroundColor: colors.background,
		borderRadius: borderRadius.md,
		alignSelf: "flex-start",
		borderWidth: 0.5,
		borderColor: colors.border,
		maxWidth: screenWidth * 0.5,
		position: "relative",
	},
	inboxSelectorActive: {
		backgroundColor: colors.surface,
		borderColor: colors.primary,
	},
	inboxSelectorText: {
		fontSize: typography.fontSize.sm,
		color: colors.textPrimary,
		fontWeight: typography.fontWeight.medium,
		flexShrink: 1,
		flex: 1,
	},

	// New Inbox Dropdown Styles (matching priority dropdown)
	inboxDropdown: {
		position: "absolute",
		bottom: 80, // Position above the inbox selector
		left: 0,
		right: 0,
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		paddingVertical: spacing.sm,
		marginHorizontal: spacing.sm,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
		zIndex: 1000,
		maxHeight: Math.min(280, screenHeight * 0.35),
		borderWidth: 1,
		borderColor: colors.border,
	},
	inboxScrollView: {
		maxHeight: Math.min(260, screenHeight * 0.32),
	},
	inboxOption: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		borderRadius: borderRadius.md,
		marginHorizontal: spacing.sm,
		marginVertical: 2,
		minHeight: 44,
	},
	inboxOptionSelected: {
		backgroundColor: colors.backgroundSecondary,
	},
	inboxOptionText: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.medium,
		color: colors.textPrimary,
		marginLeft: spacing.sm,
		flex: 1,
	},
	inboxOptionTextSelected: {
		color: colors.primary,
		fontWeight: typography.fontWeight.semibold,
	},
	sendButton: {
		position: "absolute",
		bottom: spacing.lg,
		right: spacing.lg,
		width: 40,
		height: 40,
		borderRadius: 24,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},
	// Date Time Modal Styles
	dateTimeModalOverlay: {
		flex: 1,
		backgroundColor: colors.overlay,
		justifyContent: "center",
		alignItems: "center",
	},
	dateTimeModalView: {
		backgroundColor: colors.surface,
		borderRadius: borderRadius.xl,
		width: screenWidth * 0.9,
		maxHeight: screenHeight * 0.7,
		overflow: "hidden",
	},
	dateTimeHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	dateTimeTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.semibold,
		color: colors.textPrimary,
	},
	cancelButton: {
		fontSize: typography.fontSize.base,
		color: colors.textSecondary,
		fontWeight: typography.fontWeight.medium,
	},
	confirmButton: {
		fontSize: typography.fontSize.base,
		color: colors.primary,
		fontWeight: typography.fontWeight.semibold,
	},
	dateTimeContent: {
		padding: spacing.lg,
	},
	dateTimeSection: {
		marginBottom: spacing.xl,
	},
	sectionLabel: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	dateTimeButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.md,
		backgroundColor: colors.background,
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		borderColor: colors.border,
	},
	dateTimeButtonText: {
		fontSize: typography.fontSize.base,
		color: colors.textPrimary,
		fontWeight: typography.fontWeight.medium,
	},
	quickDateOptions: {
		flexDirection: "row",
		gap: spacing.sm,
		flexWrap: "wrap",
	},
	quickDateButton: {
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		backgroundColor: colors.background,
		borderRadius: borderRadius.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	quickDateText: {
		fontSize: typography.fontSize.sm,
		color: colors.textSecondary,
		fontWeight: typography.fontWeight.medium,
	},
});

export default Upcoming;
