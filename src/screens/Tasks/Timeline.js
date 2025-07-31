import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
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

// Import Timeline components
import { 
  getDate,
  timelineEvents 
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
  const [showMenu, setShowMenu] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('timeline');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs for calendar and animation
  const calendarRef = useRef(null);
  const rotation = useRef(new Animated.Value(0));

  // Memoized calculations for performance
  const eventsByDate = useMemo(
    () => groupBy(events, (e) => CalendarUtils.getCalendarDateString(e.start)),
    [events]
  );

  /**
   * Filter events based on current filter
   */
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
    handleEventPress,
    handleDateChanged: onDateChanged,
    handleMonthChange,
  } = useTimelineEventHandlers(filteredEventsByDate, setEvents);

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
   * Handle view mode change
   */
  const handleViewChange = (mode) => {
    setViewMode(mode);
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
          viewMode={viewMode}
        />

        <TimelineMenuDropdown
          showMenu={showMenu}
          filterBy={filterBy}
          isRefreshing={isRefreshing}
          onRefreshEvents={handleRefreshEvents}
          onFilterChange={handleFilterChange}
          onViewChange={handleViewChange}
          viewMode={viewMode}
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
        </CalendarProvider>
      </View>
    </SafeAreaView>
  );
};

export default TimelineCalendarScreen;