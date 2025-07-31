import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions
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
import Ionicons from "@expo/vector-icons/Ionicons";
import { Timeline } from "react-native-calendars";

// Import Timeline components
import { 
  getDate,
  timelineEvents 
} from '@/components/Timeline/TimelineConstants';
import TimelineCalendarHeader from '@/components/Timeline/TimelineCalendarHeader';
import TimelineCalendarDay from '@/components/Timeline/TimelineCalendarDay';
import { useTimelineEventHandlers } from '@/components/Timeline/TimelineEventHandlers';
import { 
  timelineStyles, 
  getTimelineTheme, 
  getCalendarTheme 
} from '@/components/Timeline/TimelineStyles';

/**
 * Professional Timeline Calendar Component
 * Displays tasks and events in a beautiful timeline view with enhanced design
 */
const TimelineCalendarScreen = () => {
  // Get screen dimensions for responsive design
  const { height: screenHeight } = Dimensions.get('window');
  
  // State management with hooks
  const [currentDate, setCurrentDate] = useState(getDate());
  const [events, setEvents] = useState(timelineEvents);

  // Refs for calendar and animation
  const calendarRef = useRef(null);
  const rotation = useRef(new Animated.Value(0));

  // Memoized calculations for performance
  const eventsByDate = useMemo(
    () => groupBy(events, (e) => CalendarUtils.getCalendarDateString(e.start)),
    [events]
  );

  // Enhanced markedDates with gradient indicators
  const markedDates = useMemo(() => {
    const marked = {};
    Object.keys(eventsByDate).forEach((date) => {
      const dayEvents = eventsByDate[date];
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
  }, [eventsByDate, currentDate]);

  // Event handlers from custom hook
  const {
    createNewEvent,
    approveNewEvent,
    handleEventPress,
    handleDateChanged: onDateChanged,
    handleMonthChange,
  } = useTimelineEventHandlers(eventsByDate, setEvents);

  /**
   * Handle date change in calendar with state update
   */
  const handleDateChanged = useCallback((date, source) => {
    setCurrentDate(date);
    onDateChanged(date, source);
  }, [onDateChanged]);

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
      onEventPress: handleEventPress,
      unavailableHours: [],
      overlapEventsSpacing: 28,
      rightEdgeSpacing: 36,
      scrollToFirst: true,
      start: 0,
      end: 24,
    }),
    [createNewEvent, approveNewEvent, handleEventPress, timelineTheme]
  );

  /**
   * Render timeline item with proper prop handling
   * Extracts key from props to avoid React key spreading error
   */
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
          </View>
        )}
      />
    );
  }, []);

  return (
    <SafeAreaView style={timelineStyles.container}>
      {/* Fixed Header */}
      <View style={timelineStyles.header}>
        <Text style={timelineStyles.headerTitle}>Timeline</Text>
        <View style={timelineStyles.headerActions}>
          <TouchableOpacity style={timelineStyles.headerButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
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
          <View style={{ maxHeight: screenHeight * 0.4 }}>
            <ExpandableCalendar
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
          <View style={[timelineStyles.timelineContainer, { flex: 1, minHeight: 0 }]}>
            <TimelineList
              events={eventsByDate}
              timelineProps={timelineProps}
              renderItem={renderItem}
              showNowIndicator
            />
          </View>
        </CalendarProvider>
      </View>
    </SafeAreaView>
  );
};

export default TimelineCalendarScreen;