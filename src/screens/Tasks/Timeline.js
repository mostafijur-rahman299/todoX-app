import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import {
  ExpandableCalendar,
  TimelineList,
  CalendarProvider,
  CalendarUtils,
} from 'react-native-calendars';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';

const today = new Date();

export const getDate = (offset = 0) =>
  CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));


const INITIAL_TIME = { hour: 1, minutes: 0 }; // Start at 1 AM


export const timelineEvents = [
  {
    start: `${getDate()} 01:00:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Night Shift',
    summary: '1ᵃᵐ - 2:30ᵃᵐ\n★ Emergency\nNight Duty',
    color: '#3F51B5', // Indigo for night
    priority: 'high',
  },
  {
    start: `${getDate()} 03:00:00`,
    end: `${getDate()} 04:00:00`,
    title: 'Security Round',
    summary: '3ᵃᵐ - 4ᵃᵐ\n★ Building\nSecurity Check',
    color: '#424242', // Dark grey for security
    priority: 'medium',
  },
  
  // Morning (7 AM - 12 PM)
  {
    start: `${getDate()} 07:00:00`,
    end: `${getDate()} 08:30:00`,
    title: 'Palomorfologia',
    summary: '7ᵃᵐ - 8:30ᵃᵐ\n★ 12\nSzpital Kliniczny im. Heliodora Święcickiego',
    color: '#8E24AA', // Modern purple
    priority: 'high',
  },
  {
    start: `${getDate()} 09:00:00`,
    end: `${getDate()} 10:30:00`,
    title: 'Dermatologia',
    summary: '9ᵃᵐ - 10:30ᵃᵐ\n★ AULA\nSzpital Kliniczny',
    color: '#66BB6A', // Modern green
    priority: 'high',
  },
  {
    start: `${getDate()} 11:00:00`,
    end: `${getDate()} 12:30:00`,
    title: 'Kardiologia',
    summary: '11ᵃᵐ - 12:30ᵖᵐ\n★ 15\nCentrum Medyczne',
    color: '#FF7043', // Modern orange
    priority: 'medium',
  },
  
  // Afternoon (1 PM - 6 PM)
  {
    start: `${getDate()} 13:00:00`,
    end: `${getDate()} 14:30:00`,
    title: 'Neurologia',
    summary: '1ᵖᵐ - 2:30ᵖᵐ\n★ 8\nSzpital Uniwersytecki',
    color: '#42A5F5', // Modern blue
    priority: 'high',
  },
  {
    start: `${getDate()} 15:00:00`,
    end: `${getDate()} 16:30:00`,
    title: 'Pediatria',
    summary: '3ᵖᵐ - 4:30ᵖᵐ\n★ 22\nKlinika Dziecięca',
    color: '#EF5350', // Modern red
    priority: 'medium',
  },
  {
    start: `${getDate()} 17:00:00`,
    end: `${getDate()} 18:00:00`,
    title: 'Consultation',
    summary: '5ᵖᵐ - 6ᵖᵐ\n★ 45\nPrivate Practice',
    color: '#AB47BC', // Purple variant
    priority: 'medium',
  },
  
  // Evening (7 PM - 11 PM)
  {
    start: `${getDate()} 19:00:00`,
    end: `${getDate()} 20:30:00`,
    title: 'Evening Clinic',
    summary: '7ᵖᵐ - 8:30ᵖᵐ\n★ 12\nEvening Shift',
    color: '#FF9800', // Orange for evening
    priority: 'medium',
  },
  {
    start: `${getDate()} 21:00:00`,
    end: `${getDate()} 22:30:00`,
    title: 'Emergency Call',
    summary: '9ᵖᵐ - 10:30ᵖᵐ\n★ ER\nEmergency Department',
    color: '#F44336', // Red for emergency
    priority: 'high',
  },
  
  // Late Night (11 PM - 12 AM)
  {
    start: `${getDate()} 23:00:00`,
    end: `${getDate()} 23:59:00`,
    title: 'Night Preparation',
    summary: '11ᵖᵐ - 12ᵃᵐ\n★ Office\nEnd of Day Tasks',
    color: '#607D8B', // Blue-grey for late night
    priority: 'low',
  },
];

// const INITIAL_TIME = { hour: 24, minutes: 0 };

/**
 * Professional Timeline Calendar Component
 * Displays tasks and events in a beautiful timeline view
 */
const TimelineCalendarScreen = () => {
  // State management with hooks
  const [currentDate, setCurrentDate] = useState(getDate());
  const [events, setEvents] = useState(timelineEvents);

  // Memoized calculations for performance
  const eventsByDate = useMemo(
    () => groupBy(events, (e) => CalendarUtils.getCalendarDateString(e.start)),
    [events]
  );

  // Updated markedDates to include event count
  const markedDates = useMemo(() => {
    const marked = {};
    Object.keys(eventsByDate).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: colors.primary,
        selectedColor: colors.primary,
        eventCount: eventsByDate[date].length, // Store the number of events
      };
    });
    marked[currentDate] = {
      ...marked[currentDate],
      selected: true,
      selectedColor: colors.primary,
    };
    return marked;
  }, [eventsByDate, currentDate]);

  /**
   * Handle date change in calendar
   */
  const handleDateChanged = useCallback((date, source) => {
    console.log('Timeline date changed:', date, source);
    setCurrentDate(date);
  }, []);

  /**
   * Handle month change in calendar
   */
  const handleMonthChange = useCallback((month, updateSource) => {
    console.log('Timeline month changed:', month, updateSource);
  }, []);

  /**
   * Create new event on timeline long press
   */
  const createNewEvent = useCallback((timeString, timeObject) => {
    const hourString = String(timeObject.hour + 1).padStart(2, '0');
    const minutesString = String(timeObject.minutes).padStart(2, '0');

    const newEvent = {
      id: 'draft',
      start: timeString,
      end: `${timeObject.date} ${hourString}:${minutesString}:00`,
      title: 'New Task',
      summary: 'Tap to edit details',
      color: colors.surface,
      priority: 'medium',
    };

    if (timeObject.date) {
      const existingEvents = eventsByDate[timeObject.date] || [];
      const updatedEvents = [...existingEvents, newEvent];

      setEvents((prevEvents) => {
        const otherDateEvents = prevEvents.filter(
          (e) => CalendarUtils.getCalendarDateString(e.start) !== timeObject.date
        );
        return [...otherDateEvents, ...updatedEvents];
      });
    }
  }, [eventsByDate]);

  /**
   * Approve and finalize new event creation
   */
  const approveNewEvent = useCallback((_timeString, timeObject) => {
    Alert.prompt(
      'Create New Task',
      'Enter task title and details',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            if (timeObject.date) {
              setEvents((prevEvents) =>
                prevEvents.filter((e) => e.id !== 'draft')
              );
            }
          },
        },
        {
          text: 'Create',
          style: 'default',
          onPress: (eventTitle) => {
            if (timeObject.date && eventTitle) {
              setEvents((prevEvents) =>
                prevEvents.map((e) =>
                  e.id === 'draft'
                    ? {
                        ...e,
                        id: Date.now().toString(),
                        title: eventTitle || 'New Task',
                        color: colors.success,
                        summary: 'Created via timeline',
                      }
                    : e
                )
              );
            } else {
              setEvents((prevEvents) =>
                prevEvents.filter((e) => e.id !== 'draft')
              );
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  }, []);

  // Modern timeline configuration with enhanced styling
  // Complete 24-hour timeline configuration (1 AM to 12 AM)
  const timelineProps = useMemo(
    () => ({
      theme: {
        timelineContainer: {
          marginBottom: 90,
        //   paddingHorizontal: 16,
        },
        // Modern event styling
        event: {
          borderRadius: 12,
          marginHorizontal: 8,
          marginVertical: 2,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        // Modern time label styling
        // timeLabel: {
        //   fontSize: 12,
        //   fontWeight: '600',
        //   color: colors.textSecondary,
        //   backgroundColor: colors.surface,
        //   paddingHorizontal: 8,
        //   paddingVertical: 4,
        //   borderRadius: 8,
        //   marginRight: 12,
        //   minWidth: 50,
        //   textAlign: 'center',
        // },
        // Timeline line styling
        verticalLine: {
          backgroundColor: colors.border,
          width: 2,
          borderRadius: 1,
        },
        
      },
      format24h: false, // Use 12-hour format to show AM/PM
      onBackgroundLongPress: createNewEvent,
      onBackgroundLongPressOut: approveNewEvent,
      unavailableHours: [
        // Remove all unavailable hours to show complete 24-hour timeline
        // No hours are hidden - showing 1 AM to 12 AM (complete day)
      ],
      overlapEventsSpacing: 10, // Increased spacing for modern look
      rightEdgeSpacing: 24,
      scrollToFirst: true,
      start: 0,  // Start at 1 AM
      end: 23,   // End at 12 AM (midnight) - shows complete 24 hours
      // Modern event text styling
      eventTitleStyle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: 0.3,
      },
      eventSummaryStyle: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.9,
        lineHeight: 16,
        fontWeight: '500',
      },
    }),
    [createNewEvent, approveNewEvent]
  );

  // Enhanced calendar theme with modern styling
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

  // Custom render function for day to show event count
  const renderDay = useCallback(
    (date, item) => {
      const day = date.day;
      const eventCount = item.eventCount || 0;
      const isSelected = item.selected || false;

      return (
        <View style={styles.dayContainer}>
          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              date.dateString === getDate() && styles.todayText,
            ]}
          >
            {day}
          </Text>
          {eventCount > 0 && (
            <View style={styles.eventCountContainer}>
              <Text style={styles.eventCountText}>{eventCount}</Text>
            </View>
          )}
        </View>
      );
    },
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <CalendarProvider
        date={currentDate}
        onDateChanged={handleDateChanged}
        onMonthChange={handleMonthChange}
        showTodayButton
        disabledOpacity={0.6}
        theme={calendarTheme}
      >
        <ExpandableCalendar
          firstDay={1}
          markedDates={markedDates}
          theme={calendarTheme}
          style={styles.calendar}
          hideKnob={false}
          initialPosition="closed"
          calendarStyle={styles.calendarStyle}
          headerStyle={styles.calendarHeader}
          renderDay={renderDay}
        />
        <View style={styles.timelineContainer}>
          <TimelineList
            events={eventsByDate}
            timelineProps={timelineProps}
            showNowIndicator
            scrollToFirst
            initialTime={INITIAL_TIME}
            theme={calendarTheme}
          />
        </View>
      </CalendarProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  calendar: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  calendarStyle: {
    backgroundColor: colors.background,
  },
  calendarHeader: {
    backgroundColor: colors.background,
  },
  timelineContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    elevation: 8,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  selectedDayText: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
  },
  todayText: {
    color: colors.primary,
    fontWeight: '600',
  },
  eventCountContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCountText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
});

export default TimelineCalendarScreen;
