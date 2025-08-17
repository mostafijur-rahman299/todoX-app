import { useCallback } from 'react';
import { Alert } from 'react-native';
import { CalendarUtils } from 'react-native-calendars';
import { getRandomEventColor } from './TimelineConstants';
import { generateId } from '../../utils/gnFunc';
import useTasks from '../../hooks/useTasks';

/**
 * Custom hook for timeline event handlers with task management integration
 */
export const useTimelineEventHandlers = (eventsByDate, setEvents, reduxTaskList) => {
  // Initialize task management hook for persistent storage
  const { addTask, updateTask, deleteTask, loading, error } = useTasks();
  // Use Redux task_list passed as parameter to avoid undefined errors
  const task_list = reduxTaskList;
  /**
   * Create new event on timeline long press with random color and persistent storage
   */
  const createNewEvent = useCallback(async (timeString, timeObject) => {
    const hourString = String(timeObject.hour + 1).padStart(2, '0');
    const minutesString = String(timeObject.minutes).padStart(2, '0');
    const eventId = generateId();

    // Format proper datetime strings for timeline display
    const startDateTime = `${timeObject.date} ${String(timeObject.hour).padStart(2, '0')}:${String(timeObject.minutes).padStart(2, '0')}:00`;
    const endDateTime = `${timeObject.date} ${hourString}:${minutesString}:00`;
    
    // Extract time components for storage
    const startTime = `${String(timeObject.hour).padStart(2, '0')}:${String(timeObject.minutes).padStart(2, '0')}`;
    const endTime = `${hourString}:${minutesString}`;

    const newEvent = {
      id: eventId,
      start: startDateTime, // Proper datetime format for timeline
      end: endDateTime, // Proper datetime format for timeline
      title: 'New Task',
      summary: 'Tap to edit details',
      color: getRandomEventColor(), // Use random color
      priority: 'medium',
      textColor: '#000000', // Black text for readability
    };

    // Create task data structure for persistent storage
    const taskData = {
      id: eventId,
      title: newEvent.title,
      summary: newEvent.summary,
      category: 'timeline',
      priority: newEvent.priority,
      date: timeObject.date,
      startTime: startTime, // Store time only
      endTime: endTime, // Store time only
      reminder: false,
      subTask: [],
    };

    try {
      // Save to persistent storage using useTasks hook
      const success = await addTask(taskData);
      
      if (success && timeObject.date) {
        // Update local events state for immediate UI feedback
        setEvents((prevEvents) => {
          // Remove any existing events with the same ID (in case of duplicates)
          const filteredEvents = prevEvents.filter(e => e.id !== eventId);
          return [...filteredEvents, newEvent];
        });
        
        console.log('New timeline event created successfully:', newEvent);
      } else {
        console.error('Failed to save task to persistent storage');
        // Fallback: still show the event locally even if storage fails
        setEvents((prevEvents) => {
          const filteredEvents = prevEvents.filter(e => e.id !== eventId);
          return [...filteredEvents, newEvent];
        });
      }
    } catch (error) {
      console.error('Error creating new event:', error);
      // Fallback: still show the event locally even if storage fails
      setEvents((prevEvents) => {
        const filteredEvents = prevEvents.filter(e => e.id !== eventId);
        return [...filteredEvents, newEvent];
      });
    }
  }, [eventsByDate, setEvents, addTask]);

  /**
   * Approve and finalize new event creation with random color and persistent storage
   */
  const approveNewEvent = useCallback((_timeString, timeObject) => {
    // This function is called after createNewEvent, so we don't need to create another prompt
    // The event has already been created and stored, this is just for the timeline library callback
    console.log('Event creation approved for:', timeObject);
  }, []);


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

  /**
   * Load timeline events from persistent storage - optimized to prevent unnecessary re-renders
   */
  const loadTimelineEvents = useCallback(async () => {
    try {
      // Handle undefined or null task_list
      if (!task_list || !Array.isArray(task_list)) {
        console.warn('loadTimelineEvents: task_list is undefined or not an array, received:', typeof task_list, task_list);
        return;
      }

      // Filter tasks that belong to timeline category and have required time data
      const timelineTasks = task_list.filter(task => 
        task.category === 'timeline' && 
        task.date && 
        task.startTime && 
        task.endTime
      );
      
      // Only update if there are actual timeline tasks to avoid unnecessary state updates
      if (timelineTasks.length === 0) {
        console.log('No timeline events found in storage');
        return;
      }
      
      // Convert tasks to timeline events format with proper datetime strings
      const timelineEvents = timelineTasks.map(task => {
        // Combine date with start and end times to create proper datetime strings
        const startDateTime = `${task.date} ${task.startTime}:00`;
        const endDateTime = `${task.date} ${task.endTime}:00`;
        
        return {
          id: task.id,
          start: startDateTime, // Proper datetime format for timeline
          end: endDateTime, // Proper datetime format for timeline
          title: task.title || 'Untitled Task',
          summary: task.summary || '',
          color: getRandomEventColor(), // Assign random color for display
          priority: task.priority || 'medium',
          textColor: '#000000',
        };
      });

      // Update events state with loaded timeline events
      setEvents(timelineEvents);
      console.log(`Loaded ${timelineEvents.length} timeline events from storage`);
    } catch (error) {
      console.error('Error loading timeline events from storage:', error);
      console.error('task_list at error time:', typeof task_list, task_list);
    }
  }, [task_list, setEvents]);

  /**
   * Sync timeline events with stored tasks
   */
  const syncTimelineEvents = useCallback(async () => {
    await loadTimelineEvents();
  }, [loadTimelineEvents]);

  /**
   * Delete timeline event and remove from persistent storage
   */
  const deleteTimelineEvent = useCallback(async (eventId) => {
    try {
      // Remove from persistent storage
      const success = await deleteTask(eventId);
      
      if (success) {
        // Remove from local events state
        setEvents((prevEvents) => 
          prevEvents.filter(event => event.id !== eventId)
        );
      } else {
        console.error('Failed to delete task from persistent storage');
      }
    } catch (error) {
      console.error('Error deleting timeline event:', error);
    }
  }, [deleteTask, setEvents]);

  /**
   * Update timeline event and sync with persistent storage
   */
  const updateTimelineEvent = useCallback(async (eventId, updates) => {
    try {
      // Update in persistent storage
      const success = await updateTask(eventId, updates);
      
      if (success) {
        // Update local events state
        setEvents((prevEvents) => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, ...updates }
              : event
          )
        );
      } else {
        console.error('Failed to update task in persistent storage');
      }
    } catch (error) {
      console.error('Error updating timeline event:', error);
    }
  }, [updateTask, setEvents]);

  return {
    createNewEvent,
    approveNewEvent,
    handleDateChanged,
    handleMonthChange,
    loadTimelineEvents,
    syncTimelineEvents,
    deleteTimelineEvent,
    updateTimelineEvent,
    // Expose task management state for external use
    taskList: task_list,
    isLoading: loading,
    taskError: error,
  };
};