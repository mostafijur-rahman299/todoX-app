import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StatusBar,
  Animated
} from 'react-native';
import groupBy from 'lodash/groupBy';
import {
  ExpandableCalendar,
  TimelineList,
  CalendarProvider,
  CalendarUtils,
} from 'react-native-calendars';
import { colors, spacing, typography, shadows } from '@/constants/Colors';
import leftArrowIcon from "@/assets/icons/previous.png";
import rightArrowIcon from "@/assets/icons/next.png";
import Ionicons from "react-native-vector-icons/Ionicons";

const today = new Date();

export const getDate = (offset = 0) =>
  CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

console.log(getDate());

const INITIAL_TIME = { hour: 1, minutes: 0 }; // Start at 1 AM

/**
 * Array of beautiful colors for random event assignment
 */
const eventColors = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky Blue
  '#96CEB4', // Mint Green
  '#FFEAA7', // Warm Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Seafoam
  '#F7DC6F', // Golden Yellow
  '#BB8FCE', // Lavender
  '#85C1E9', // Light Blue
  '#F8C471', // Peach
  '#82E0AA', // Light Green
  '#F1948A', // Salmon
  '#85C1E9', // Powder Blue
  '#D7BDE2', // Light Purple
  '#A9DFBF', // Pale Green
  '#F9E79F', // Light Yellow
  '#AED6F1', // Baby Blue
  '#F5B7B1', // Pink
  '#A3E4D7', // Aqua
];

/**
 * Get a random color from the eventColors array
 */
const getRandomEventColor = () => {
  return eventColors[Math.floor(Math.random() * eventColors.length)];
};

export const timelineEvents = [
  {
    start: `${getDate()} 01:00:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Night Shift',
    summary: 'Hi every one this is me from bangladesh so we have todo so many things so be prepare and make happy of people',
    color: '#6366F1', // Indigo
    priority: 'high',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 03:00:00`,
    end: `${getDate()} 04:00:00`,
    title: 'Security Round',
    summary: '3ᵃᵐ - 4ᵃᵐ\n★ Building\nSecurity Check',
    color: '#64748B', // Slate
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  
  // Morning (7 AM - 12 PM)
  {
    start: `${getDate()} 07:00:00`,
    end: `${getDate()} 08:30:00`,
    title: 'Palomorfologia',
    summary: '7ᵃᵐ - 8:30ᵃᵐ\n★ 12\nSzpital Kliniczny im. Heliodora Święcickiego',
    color: '#8B5CF6', // Purple
    priority: 'high',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 09:00:00`,
    end: `${getDate()} 10:30:00`,
    title: 'Dermatologia',
    summary: '9ᵃᵐ - 10:30ᵃᵐ\n★ AULA\nSzpital Kliniczny',
    color: '#10B981', // Emerald
    priority: 'high',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 11:00:00`,
    end: `${getDate()} 12:30:00`,
    title: 'Kardiologia',
    summary: '11ᵃᵐ - 12:30ᵖᵐ\n★ 15\nCentrum Medyczne',
    color: '#F59E0B', // Amber
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  
  // Afternoon (1 PM - 6 PM)
  {
    start: `${getDate()} 13:00:00`,
    end: `${getDate()} 14:30:00`,
    title: 'Neurologia',
    summary: '1ᵖᵐ - 2:30ᵖᵐ\n★ 8\nSzpital Uniwersytecki',
    color: '#3B82F6', // Blue
    priority: 'high',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 15:00:00`,
    end: `${getDate()} 16:30:00`,
    title: 'Pediatria',
    summary: '3ᵖᵐ - 4:30ᵖᵐ\n★ 22\nKlinika Dziecięca',
    color: '#EF4444', // Red
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 17:00:00`,
    end: `${getDate()} 18:00:00`,
    title: 'Consultation',
    summary: '5ᵖᵐ - 6ᵖᵐ\n★ 45\nPrivate Practice',
    color: '#EC4899', // Pink
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  
  // Evening (7 PM - 11 PM)
  {
    start: `${getDate()} 19:00:00`,
    end: `${getDate()} 20:30:00`,
    title: 'Evening Clinic',
    summary: '7ᵖᵐ - 8:30ᵖᵐ\n★ 12\nEvening Shift',
    color: '#F97316', // Orange
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 21:00:00`,
    end: `${getDate()} 22:30:00`,
    title: 'Emergency Call',
    summary: '9ᵖᵐ - 10:30ᵖᵐ\n★ ER\nEmergency Department',
    color: '#DC2626', // Red
    priority: 'high',
    textColor: '#000000', // Black text
  },
  
  // Late Night (11 PM - 12 AM)
  {
    start: `${getDate()} 23:00:00`,
    end: `${getDate()} 23:59:00`,
    title: 'Night Preparation',
    summary: '11ᵖᵐ - 12ᵃᵐ\n★ Office\nEnd of Day Tasks',
    color: '#475569', // Slate
    priority: 'low',
    textColor: '#000000', // Black text
  },
];

/**
 * Professional Timeline Calendar Component
 * Displays tasks and events in a beautiful timeline view with enhanced design
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
   * Create new event on timeline long press with random color
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
      color: getRandomEventColor(), // Use random color
      priority: 'medium',
      textColor: '#000000', // Black text for readability
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
   * Approve and finalize new event creation with random color
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
                        color: getRandomEventColor(), // Assign new random color
                        summary: 'Created via timeline',
                        textColor: '#000000', // Black text for readability
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

  /**
   * Handle event/task click to show detailed information
   */
  const handleEventPress = useCallback((event) => {
    const startTime = new Date(event.start).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    const endTime = new Date(event.end).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    const priorityEmoji = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };

    Alert.alert(
      `${priorityEmoji[event.priority]} ${event.title}`,
      `📅 Time: ${startTime} - ${endTime}\n\n📝 Details:\n${event.summary}\n\n⚡ Priority: ${event.priority.toUpperCase()}`,
      [
        {
          text: 'Edit',
          style: 'default',
          onPress: () => {
            // Handle edit functionality
            Alert.prompt(
              'Edit Task',
              'Update task title:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Save',
                  onPress: (newTitle) => {
                    if (newTitle && newTitle.trim()) {
                      setEvents(prevEvents =>
                        prevEvents.map(e =>
                          e.id === event.id
                            ? { ...e, title: newTitle.trim() }
                            : e
                        )
                      );
                    }
                  }
                }
              ],
              'plain-text',
              event.title
            );
          }
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Task',
              'Are you sure you want to delete this task?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    setEvents(prevEvents =>
                      prevEvents.filter(e => e.id !== event.id)
                    );
                  }
                }
              ]
            );
          }
        },
        {
          text: 'Close',
          style: 'cancel'
        }
      ]
    );
  }, []);

  // Ultra-premium timeline configuration with luxury design
  const timelineProps = useMemo(
    () => ({
      theme: {
        timelineContainer: {
          marginBottom: 90,
        },
        event: {
          borderRadius: 10,
          paddingLeft: 10,
          paddingRight: 10,
          marginLeft: 5,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 12,
          borderWidth: 1,
          borderColor: '#F1F5F9',
        },
        timeLabel: {
          color: 'white',
          fontSize: 10,
          fontWeight: '800',
          paddingHorizontal: 5,
          paddingVertical: 3,
          backgroundColor: colors.primary,
          borderRadius: 5,
          marginVertical: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 5,
          elevation: 6,
          borderWidth: 1.5,
          borderColor: '#E2E8F0',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        },
        verticalLine: {
          width: 2,
          backgroundColor: '#CBD5E0',
          borderRadius: 2,
          shadowColor: '#94A3B8',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 2,
        },
        nowIndicatorLine: {
          backgroundColor: colors.primary,
          width: 3,
          borderRadius: 3,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 12,
          elevation: 8,
        },
        nowIndicatorKnob: {
          backgroundColor: colors.primary,
          width: 15,
          height: 15,
          borderRadius: 10,
          borderWidth: 3,
          borderColor: '#FFFFFF',
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.6,
          shadowRadius: 12,
          elevation: 10,
        },
        // Ultra-premium timeline text styling
        eventTitle: {
          color: '#0F172A',
          fontSize: 15,
          fontWeight: '700',
          letterSpacing: -0.3,
        },
        eventSummary: {
          color: '#475569',
          fontSize: 13,
          fontWeight: '500',
          letterSpacing: 0.2,
        },
        eventText: {
         paddingHorizontal: 10,
         paddingVertical: 5
        },
      },
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
      
      renderEvent: renderEvent,
    }),
    [createNewEvent, approveNewEvent, handleEventPress, renderEvent]
  );

  // Ultra-premium custom render function for events with luxury design
  const renderEvent = useCallback((event) => {
    const priorityConfig = {
      high: { 
        color: '#DC2626', 
        bgColor: '#FEF2F2', 
        accentColor: '#EF4444',
        icon: '⚡', 
        label: 'URGENT',
        gradient: ['#FEF2F2', '#FFFFFF'],
        glowColor: '#DC262620'
      },
      medium: { 
        color: '#D97706', 
        bgColor: '#FFFBEB', 
        accentColor: '#F59E0B',
        icon: '⏰', 
        label: 'NORMAL',
        gradient: ['#FFFBEB', '#FFFFFF'],
        glowColor: '#D9770620'
      },
      low: { 
        color: '#059669', 
        bgColor: '#F0FDF4', 
        accentColor: '#10B981',
        icon: '✓', 
        label: 'LOW',
        gradient: ['#F0FDF4', '#FFFFFF'],
        glowColor: '#05966920'
      }
    };
    
    const priority = priorityConfig[event.priority] || priorityConfig.medium;

    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: 24,
          marginHorizontal: 20,
          marginVertical: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 12,
          borderWidth: 1,
          borderColor: '#F1F5F9',
          position: 'relative',
          overflow: 'hidden',
          // Glass morphism effect
          backdropFilter: 'blur(10px)',
        }}
        onPress={() => handleEventPress(event)}
        activeOpacity={0.88}
      >
        {/* Ultra-premium glass morphism overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundColor: `${priority.glowColor}`,
            opacity: 0.4,
          }}
        />
        
        {/* Luxury gradient accent bar with glow */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: priority.color,
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            shadowColor: priority.color,
            shadowOffset: { width: 3, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 4,
          }}
        />

        {/* Premium floating priority badge */}
        <View
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: priority.bgColor,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1.5,
            borderColor: `${priority.color}25`,
            shadowColor: priority.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text style={{ 
            fontSize: 12, 
            marginRight: 6,
            color: priority.color
          }}>
            {priority.icon}
          </Text>
          <Text style={{ 
            fontSize: 10, 
            color: priority.color, 
            fontWeight: '800',
            letterSpacing: 1,
            textTransform: 'uppercase'
          }}>
            {priority.label}
          </Text>
        </View>

        {/* Luxury event content with enhanced typography */}
        <View style={{ paddingRight: 100, paddingLeft: 16 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: 10,
              lineHeight: 26,
              letterSpacing: -0.3,
              textShadowColor: 'rgba(0,0,0,0.05)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
            numberOfLines={2}
          >
            {event.title}
          </Text>
          
          {event.summary && (
            <Text
              style={{
                fontSize: 15,
                color: '#475569',
                lineHeight: 22,
                fontWeight: '500',
                letterSpacing: 0.2,
                opacity: 0.9,
              }}
              numberOfLines={3}
            >
              {event.summary}
            </Text>
          )}
        </View>

        {/* Ultra-premium time indicator with glass effect */}
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: 'rgba(248, 250, 252, 0.9)',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: 'rgba(226, 232, 240, 0.8)',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 3,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Text style={{ 
            fontSize: 12, 
            color: '#64748B', 
            fontWeight: '700',
            letterSpacing: 0.5
          }}>
            {event.start?.split(' ')[1] || ''}
          </Text>
        </View>

        {/* Luxury shimmer highlight */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 24,
            right: 24,
            height: 2,
            backgroundColor: priority.accentColor,
            opacity: 0.3,
            borderRadius: 1,
          }}
        />

        {/* Premium corner accent */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 40,
            height: 40,
            backgroundColor: `${priority.color}08`,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: 20,
          }}
        />
      </TouchableOpacity>
    );
  }, [handleEventPress]);

  const toggleCalendarExpansion = useCallback(() => {
		const isOpen = calendarRef.current?.toggleCalendarPosition();
		Animated.timing(rotation.current, {
			toValue: isOpen ? 1 : 0,
			duration: 250,
			useNativeDriver: true,
			easing: Easing.bezier(0.4, 0.0, 0.2, 1),
		}).start();
	}, []);

  const calendarRef = useRef(null);
	const rotation = useRef(new Animated.Value(0));

  const renderHeader = useCallback(
		(date) => {			
			return (
				<View style={styles.calendarHeaderContainer}>
					<TouchableOpacity
						style={styles.calendarHeader}
						onPress={toggleCalendarExpansion}
						activeOpacity={0.9}>
						<Text style={styles.calendarHeaderTitle}>
							{date?.toString("MMMM yyyy")}
						</Text>
					</TouchableOpacity>
				</View>
			);
		},
		[toggleCalendarExpansion],
	);

  // Premium calendar theme for professional design
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

  // Enhanced custom render function for day with priority indicators
  const renderDay = useCallback(
    (date, item) => {
      const day = date.day;
      const eventCount = item.eventCount || 0;
      const isSelected = item.selected || false;
      const isToday = date.dateString === getDate();
      const hasHighPriority = item.hasHighPriority || false;

      return (
        <View style={styles.dayContainer}>
          <View style={[
            styles.dayWrapper,
            isSelected && styles.selectedDayWrapper,
            isToday && styles.todayWrapper,
            hasHighPriority && styles.highPriorityDayWrapper,
          ]}>
            <Text
              style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
                isToday && styles.todayText,
              ]}
            >
              {day}
            </Text>
            
            {/* Event count indicator with modern design */}
            {eventCount > 0 && (
              <View style={[
                styles.eventCountContainer,
                hasHighPriority && styles.highPriorityIndicator,
                isSelected && styles.selectedEventCount,
              ]}>
                <Text style={[
                  styles.eventCountText,
                  isSelected && styles.selectedEventCountText,
                ]}>
                  {eventCount}
                </Text>
              </View>
            )}
          </View>
          
          {/* Priority indicator dot */}
          {hasHighPriority && (
            <View style={[
              styles.priorityDot,
              isSelected && styles.selectedPriorityDot,
            ]} />
          )}
        </View>
      );
    },
    []
  );

  const onCalendarToggled = useCallback((isOpen) => {
		rotation.current.setValue(isOpen ? 1 : 0);
	}, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
				<Text style={styles.headerTitle}>Timeline</Text>
				<View style={styles.headerActions}>
					<TouchableOpacity style={styles.headerButton}>
						<Ionicons
							name="ellipsis-vertical"
							size={20}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>
				</View>
			</View>

      <CalendarProvider
        date={currentDate}
        onDateChanged={handleDateChanged}
        onMonthChange={handleMonthChange}
        showTodayButton
        disabledOpacity={0.6}
        theme={calendarTheme}
        todayButtonStyle={styles.todayButton}
      >
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
        <View style={styles.timelineContainer}>
          <TimelineList
            events={eventsByDate}
            timelineProps={timelineProps}
            showNowIndicator
            scrollToFirst
            initialTime={INITIAL_TIME}
            theme={calendarTheme}
            style={styles.timeline}
          />
        </View>
      </CalendarProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.sm,
		backgroundColor: colors.background,
	},
	headerTitle: {
		fontSize: typography.fontSize["xl"],
		fontWeight: typography.fontWeight.semibold,
		color: colors.textSecondary,
	},
	headerActions: {
		flexDirection: "row",
		gap: spacing.sm,
		alignItems: "center",
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

  selectedEventCount: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#4ECDC4',
  },
  highPriorityIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  eventCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  selectedEventCountText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '900',
  },
  // Ultra-premium priority dots
  priorityDot: {
    position: 'absolute',
    bottom: 3,
    alignSelf: 'center',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPriorityDot: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  todayButton: {
		backgroundColor: colors.primary,
		borderRadius: spacing.sm,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		textAlign: "center",
    color: 'white'
	},
  calendarHeaderContainer: {
		// backgroundColor: colors.surface,
	},
	calendarHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	calendarHeaderTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.medium,
		color: colors.textPrimary,
		letterSpacing: -0.3,
	},
});

export default TimelineCalendarScreen;
