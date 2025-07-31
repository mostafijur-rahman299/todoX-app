import { useCallback } from 'react';
import { Alert } from 'react-native';
import { CalendarUtils } from 'react-native-calendars';
import { getRandomEventColor, priorityEmoji } from './TimelineConstants';

/**
 * Custom hook for timeline event handlers
 */
export const useTimelineEventHandlers = (eventsByDate, setEvents) => {
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
  }, [eventsByDate, setEvents]);

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
  }, [setEvents]);

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
  }, [setEvents]);

  /**
   * Handle date change in calendar
   */
  const handleDateChanged = useCallback((date, source) => {
    console.log('Timeline date changed:', date, source);
  }, []);

  /**
   * Handle month change in calendar
   */
  const handleMonthChange = useCallback((month, updateSource) => {
    console.log('Timeline month changed:', month, updateSource);
  }, []);

  return {
    createNewEvent,
    approveNewEvent,
    handleEventPress,
    handleDateChanged,
    handleMonthChange,
  };
};