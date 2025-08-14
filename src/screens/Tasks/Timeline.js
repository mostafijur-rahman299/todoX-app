import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  Easing,
  TouchableOpacity,
  Alert,
} from 'react-native';
import groupBy from 'lodash/groupBy';
import {
  ExpandableCalendar,
  TimelineList,
  CalendarProvider,
  CalendarUtils,
} from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
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

/**
 * Auto-hiding help text component for timeline instructions
 */
const TimelineHelpText = () => {
  const [isVisible, setIsVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  /**
   * Handle closing the help text with smooth animation
   */
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }),
      Animated.timing(slideAnim, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        helpTextStyles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [-50, 0, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={helpTextStyles.contentContainer}>
        <View style={helpTextStyles.helpItem}>
          <Ionicons name="hand-left-outline" size={16} color={colors.textSecondary} />
          <Text style={helpTextStyles.helpText}>
            Long press on timeline to add a task
          </Text>
        </View>
        <View style={helpTextStyles.separator} />
        <View style={helpTextStyles.helpItem}>
          <Ionicons name="add-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={helpTextStyles.helpText}>
            Or use the add button
          </Text>
        </View>
      </View>
      
      {/* Close Button */}
      <TouchableOpacity 
        style={helpTextStyles.closeButton}
        onPress={handleClose}
        hitSlop={{ top: 12, bottom: 12, left: 20, right: 20 }}
      >
        <Ionicons name="close" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

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

  useEffect(() => {
    const convertedEvents = convertTaskListToTimelineList(task_list);
    setEvents(convertedEvents);
    setCalendarKey(new Date());
  }, [task_list]);

  const getFilteredEvents = useCallback(() => {
    let filtered = events || [];
    
    if (filterBy !== 'all') {
      filtered = filtered.filter(event => event.priority === filterBy);
    }
    
    return filtered;
  }, [events, filterBy]);

  const filteredEvents = getFilteredEvents();
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

  // Event handlers from custom hook
  const {
    createNewEvent,
    approveNewEvent,
    handleEventPress: originalHandleEventPress,
    handleDateChanged: onDateChanged,
    handleMonthChange,
  } = useTimelineEventHandlers(filteredEventsByDate, setEvents);

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
      onBackgroundLongPress: createNewEvent,
      onBackgroundLongPressOut: approveNewEvent,
      onEventPress: handleTaskPress,
      unavailableHours: [],
      overlapEventsSpacing: 28,
      rightEdgeSpacing: 36,
      scrollToFirst: true,
      start: 0,
      end: 24,
    }),
    [createNewEvent, approveNewEvent, handleTaskPress, timelineTheme]
  );

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
          key={calendarKey}
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
          
          {/* Auto-hiding Help Text */}
          <TimelineHelpText />
          
          {/* Timeline Container with proper flex and overflow handling */}
          <View style={[timelineStyles.timelineContainer]}>
            <TimelineList
              key={calendarKey}
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