import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import groupBy from 'lodash/groupBy';
import {
  ExpandableCalendar,
  TimelineList,
  CalendarProvider,
  CalendarUtils,
} from 'react-native-calendars';
import { colors } from '@/constants/Colors';
import leftArrowIcon from "@/assets/icons/previous.png";
import rightArrowIcon from "@/assets/icons/next.png";
import { Timeline } from "react-native-calendars";
import { useSelector } from 'react-redux';

// Import Timeline components
import { 
  getDate 
} from '@/components/Timeline/TimelineConstants';
import TimelineCalendarHeader from '@/components/Timeline/TimelineCalendarHeader';
import TimelineCalendarDay from '@/components/Timeline/TimelineCalendarDay';
import TimelineHeader from '@/components/Timeline/TimelineHeader';
import TimelineMenuDropdown from '@/components/Timeline/TimelineMenuDropdown';
import { useTimelineEventHandlers } from '@/components/Timeline/TimelineEventHandlers';
import { 
  timelineStyles, 
  getTimelineTheme, 
  getCalendarTheme 
} from '@/components/Timeline/TimelineStyles';
import AddTaskButton from '@/components/AddTaskButton';
import TaskDetailModal from '@/components/Tasks/TaskDetailModal';
import { convertTaskListToTimelineList } from '@/utils/gnFunc';
import useTasks from '@/hooks/useTasks';

const TimelineCalendarScreen = () => {
  // State management with hooks
  const [currentDate, setCurrentDate] = useState(getDate());
  const [events, setEvents] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const task_list = useSelector((state) => state.task.task_list);
  const [calendarKey, setCalendarKey] = useState(0);
  
  // Task management hooks
  const { updateTask, deleteTask } = useTasks();

  // Refs for calendar and animation
  const calendarRef = useRef(null);
  const rotation = useRef(new Animated.Value(0));

  // Update events from Redux task_list and trigger calendar re-render when necessary
  useEffect(() => {
    const convertedEvents = convertTaskListToTimelineList(task_list);
    setEvents(convertedEvents);
    // Update calendar key to force re-render when events change
    if (convertedEvents.length > 0) {
      setCalendarKey(Date.now());
    }
  }, [task_list]);

  // Update calendar key when filter changes to ensure proper re-rendering
  useEffect(() => {
    setCalendarKey(Date.now());
  }, [filterBy]);

  // Memoize filtered events to prevent unnecessary recalculations
  const filteredEvents = useMemo(() => {
    let filtered = events || [];
    
    if (filterBy !== 'all') {
      filtered = filtered.filter(event => event.priority === filterBy);
    }
    
    return filtered;
  }, [events, filterBy]);

  // Memoize grouped events by date with stable reference
  const filteredEventsByDate = useMemo(
    () => groupBy(filteredEvents, (e) => CalendarUtils.getCalendarDateString(e.start)),
    [filteredEvents]
  );

  // Enhanced markedDates with gradient indicators
  const markedDates = useMemo(() => {
    const marked = {};
    Object.keys(filteredEventsByDate).forEach((date) => {
      const dayEvents = filteredEventsByDate[date];
      marked[date] = {
        marked: true,
        dotColor: colors.primary,
        selectedColor: colors.primary,
        eventCount: dayEvents.length,
        // Add priority indicator
        hasHighPriority: dayEvents.some(event => event.priority === 'high'),
      };
    });
    marked[currentDate] = {
      ...marked[currentDate],
      selected: true,
      selectedColor: colors.primary,
    };
    return marked;
  }, [filteredEventsByDate, currentDate]);

  // Event handlers from custom hook - pass Redux task_list to avoid undefined errors
  const {
    createNewEvent,
    approveNewEvent,
    handleDateChanged: onDateChanged,
    handleMonthChange,
    loadTimelineEvents,
    syncTimelineEvents,
    taskList,
    isLoading: timelineLoading,
    taskError,
  } = useTimelineEventHandlers(filteredEventsByDate, setEvents, task_list || []);

  // Load timeline events only when task_list is available and events are empty
  useEffect(() => {
    // Only load timeline events if we have task_list and no events from Redux yet
    if (task_list && Array.isArray(task_list) && events.length === 0) {
      loadTimelineEvents();
    }
  }, [task_list, events.length, loadTimelineEvents]); // Depend on task_list availability

  // Enhanced createNewEvent with user feedback - memoized to prevent recreation
  const handleTimelineLongPress = useCallback(async (timeString, timeObject) => {
    try {
      await createNewEvent(timeString, timeObject);
      // Show success feedback could be added here if needed
    } catch (error) {
      console.error('Failed to create timeline event:', error);
      Alert.alert(
        'Error',
        'Failed to create timeline event. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [createNewEvent]);

  // Show error alert when taskError changes - with ref to prevent unnecessary re-renders
  const lastErrorRef = useRef(null);
  useEffect(() => {
    if (taskError && taskError !== lastErrorRef.current) {
      lastErrorRef.current = taskError;
      Alert.alert(
        'Timeline Error',
        `An error occurred: ${taskError}`,
        [{ text: 'OK' }]
      );
    }
  }, [taskError]);

  /**
   * Handle task press to open detail modal
   */
  const handleTaskPress = (task) => {
    // Find the original task from task_list using the task id
    const originalTask = task_list.find(t => t.id === task.id);
    if (originalTask) {
      setSelectedTask(originalTask);
      setShowTaskModal(true);
    } else {
      // If not found in task_list, it might be a timeline-created event
      // Convert timeline event to task format
      const timelineTask = {
        id: task.id,
        title: task.title,
        summary: task.summary || '',
        priority: task.priority || 'medium',
        category: 'Timeline',
        date: task.start ? task.start.split(' ')[0] : new Date().toISOString().split('T')[0],
        startTime: task.start ? task.start.split(' ')[1] : null,
        endTime: task.end ? task.end.split(' ')[1] : null,
        is_completed: false,
        subTask: [],
        reminder: false,
      };
      setSelectedTask(timelineTask);
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
   * Handle date change in calendar with state update
   */
  const handleDateChanged = useCallback((date, source) => {
    setCurrentDate(date);
    onDateChanged(date, source);
  }, [onDateChanged]);

  /**
   * Handle filter change
   */
  const handleFilterChange = (filter) => {
    setFilterBy(filter);
    setShowMenu(false);
  };

  /**
   * Handle refresh events
   */
  const handleRefreshEvents = async () => {
    setIsRefreshing(true);
    setShowMenu(false);
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Here you would typically reload events from your data source
      console.log('Events refreshed');
    } catch (error) {
      console.error('Error refreshing events:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Handle closing menu
   */
  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  /**
   * Toggle calendar expansion with animation
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
   * Render custom calendar header
   */
  const renderHeader = useCallback(
    (date) => {
      return (
        <TimelineCalendarHeader 
          date={date} 
          onToggle={toggleCalendarExpansion} 
        />
      );
    },
    [toggleCalendarExpansion],
  );

  /**
   * Render custom calendar day
   */
  const renderDay = useCallback(
    (date, item) => {
      return <TimelineCalendarDay date={date} item={item} />;
    },
    []
  );

  /**
   * Handle calendar toggle animation
   */
  const onCalendarToggled = useCallback((isOpen) => {
    rotation.current.setValue(isOpen ? 1 : 0);
  }, []);

  // Memoized theme configurations
  const calendarTheme = useMemo(() => getCalendarTheme(colors), []);
  const timelineTheme = useMemo(() => getTimelineTheme(colors), []);

  // Ultra-premium timeline configuration with luxury design
  const timelineProps = useMemo(
    () => ({
      theme: timelineTheme,
      format24h: false,
      onBackgroundLongPress: handleTimelineLongPress,
      onBackgroundLongPressOut: approveNewEvent,
      onEventPress: handleTaskPress,
      unavailableHours: [],
      overlapEventsSpacing: 28,
      rightEdgeSpacing: 36,
      scrollToFirst: true,
      start: 0,
      end: 24,
    }),
    [handleTimelineLongPress, approveNewEvent, handleTaskPress, timelineTheme]
  )

  const renderItem = useCallback((timelineProps, info) => {
    // Extract key from props to avoid spreading it into JSX
    const { key, ...restProps } = timelineProps;
    
    return (
      <Timeline
        key={key || `timeline-${info?.date || 'default'}`}
        {...restProps}
        renderEvent={(event) => (
          <View 
            style={{ 
              backgroundColor: event.color, 
              height: "100%", 
              width: "100%",
              padding: 8,
              borderRadius: 4
            }} 
            key={event.end}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {event.title}
            </Text>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {event.summary}
            </Text>
          </View>
        )}
      />
    );
  }, []);

  return (
    <SafeAreaView style={timelineStyles.container}>
      {/* Enhanced Header with Dropdown */}
      <View style={timelineStyles.headerWrapper}>
        <TimelineHeader
          filteredEventsCount={filteredEvents.length}
          filterBy={filterBy}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />

        <TimelineMenuDropdown
          showMenu={showMenu}
          filterBy={filterBy}
          isRefreshing={isRefreshing}
          onRefreshEvents={handleRefreshEvents}
          onFilterChange={handleFilterChange}
          onClose={handleCloseMenu}
        />
      </View>

      {/* Calendar and Timeline Container with proper flex constraints */}
      <View style={{ flex: 1 }}>
        <CalendarProvider
          date={currentDate}
          onDateChanged={handleDateChanged}
          onMonthChange={handleMonthChange}
          showTodayButton
          disabledOpacity={0.6}
          theme={calendarTheme}
          todayButtonStyle={timelineStyles.todayButton}
        >
          {/* Calendar with constrained height */}
          <View>
            <ExpandableCalendar
              key={calendarKey}
              ref={calendarRef}
              firstDay={1}
              markedDates={markedDates}
              theme={calendarTheme}
              hideKnob={false}
              initialPosition="closed"
              renderDay={renderDay}
              leftArrowImageSource={leftArrowIcon}
              rightArrowImageSource={rightArrowIcon}
              renderHeader={renderHeader}
              onCalendarToggled={onCalendarToggled}
            />
          </View>
          
          
          {/* Timeline Container with proper flex and overflow handling */}
          <View style={[timelineStyles.timelineContainer]}>
            <TimelineList
              events={filteredEventsByDate}
              timelineProps={timelineProps}
              renderItem={renderItem}
              showNowIndicator
            />
          </View>
          <AddTaskButton />
        </CalendarProvider>
      </View>

      <TaskDetailModal
        visible={showTaskModal}
        onClose={handleCloseTaskModal}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </SafeAreaView>
  );
};

// Styles for the help text component
const helpTextStyles = {
  container: {
    position: 'absolute',
    top: 115,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: 5,
  },
  closeButton: {
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4
  },
};

export default TimelineCalendarScreen;