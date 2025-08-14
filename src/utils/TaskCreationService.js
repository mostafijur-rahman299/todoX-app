import { Alert } from 'react-native';
import { CalendarUtils } from 'react-native-calendars';

/**
 * Task Creation Service - Extracted from Timeline Event Handlers
 * Provides comprehensive task creation functionality with validation and management
 */

/**
 * Array of beautiful colors for random event assignment
 */
export const eventColors = [
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
export const getRandomEventColor = () => {
  return eventColors[Math.floor(Math.random() * eventColors.length)];
};

/**
 * Priority configuration for tasks
 */
export const priorityConfig = {
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

/**
 * Priority emoji mapping for task display
 */
export const priorityEmoji = {
  high: '🔥',
  medium: '⚡',
  low: '✅'
};

/**
 * Task format structure definition
 * This represents the complete structure of a task object in the system
 */
export const TaskStructure = {
  // Core identification
  id: 'string', // Unique identifier (e.g., 'task_1234567890_abc123')
  
  // Time properties
  start: 'string', // ISO datetime string or 'YYYY-MM-DD HH:mm:ss' format
  end: 'string',   // ISO datetime string or 'YYYY-MM-DD HH:mm:ss' format
  startTime: 'string', // Alternative time format (for compatibility)
  endTime: 'string',   // Alternative time format (for compatibility)
  
  // Content properties
  title: 'string',   // Task title/name
  summary: 'string', // Task description/details
  
  // Visual properties
  color: 'string',     // Hex color code (e.g., '#FF6B6B')
  textColor: 'string', // Text color (usually '#000000')
  
  // Classification properties
  priority: 'string',  // 'low', 'medium', 'high'
  status: 'string',    // 'draft', 'pending', 'completed', 'cancelled'
  category: 'string',  // 'general', 'work', 'personal', etc.
  
  // Metadata properties
  createdAt: 'string',  // ISO datetime string
  updatedAt: 'string',  // ISO datetime string
  isEditable: 'boolean' // Whether the task can be edited
};

/**
 * Generate a unique task ID
 */
export const generateTaskId = (prefix = 'task') => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${randomString}`;
};

/**
 * Create a new task object with default values
 */
export const createTaskObject = ({
  title = 'New Task',
  summary = 'Tap to edit details',
  start = null,
  end = null,
  priority = 'medium',
  category = 'general',
  status = 'pending',
  color = null,
  id = null
} = {}) => {
  const currentTime = new Date().toISOString();
  const taskId = id || generateTaskId();
  
  // Calculate default times if not provided
  const startTime = start || currentTime;
  const endTime = end || new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();
  
  return {
    id: taskId,
    start: startTime,
    end: endTime,
    startTime: startTime, // For compatibility
    endTime: endTime,     // For compatibility
    title: title,
    summary: summary,
    priority: priority,
    color: color || getRandomEventColor(),
    textColor: '#000000',
    status: status,
    category: category,
    createdAt: currentTime,
    updatedAt: currentTime,
    isEditable: true
  };
};

/**
 * Validate task input parameters
 */
export const validateTaskInput = (taskData) => {
  const errors = [];
  
  if (!taskData.title || !taskData.title.trim()) {
    errors.push('Task title is required');
  }
  
  if (taskData.start && isNaN(new Date(taskData.start).getTime())) {
    errors.push('Invalid start time format');
  }
  
  if (taskData.end && isNaN(new Date(taskData.end).getTime())) {
    errors.push('Invalid end time format');
  }
  
  if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Check for time conflicts between tasks
 */
export const checkTimeConflicts = (newTask, existingTasks) => {
  const newStart = new Date(newTask.start || newTask.startTime);
  const newEnd = new Date(newTask.end || newTask.endTime);
  
  return existingTasks.some(task => {
    if (task.id === newTask.id) return false; // Skip self when updating
    
    const taskStart = new Date(task.start || task.startTime);
    const taskEnd = new Date(task.end || task.endTime);
    
    return (
      (newStart >= taskStart && newStart < taskEnd) ||
      (newEnd > taskStart && newEnd <= taskEnd) ||
      (newStart <= taskStart && newEnd >= taskEnd)
    );
  });
};

/**
 * Task Creation Service Class
 */
export class TaskCreationService {
  constructor(eventsByDate, setEvents) {
    this.eventsByDate = eventsByDate;
    this.setEvents = setEvents;
  }

  /**
   * Create a new draft task on timeline long press
   */
  createDraftTask(timeString, timeObject) {
    // Validate input parameters
    if (!timeString || !timeObject || !timeObject.date) {
      Alert.alert('Error', 'Invalid time selection. Please try again.');
      return false;
    }

    // Calculate end time (1 hour after start time by default)
    const startDate = new Date(timeString);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const endTimeString = endDate.toISOString().slice(0, 19).replace('T', ' ');

    const draftTask = createTaskObject({
      id: 'draft',
      start: timeString,
      end: endTimeString,
      status: 'draft'
    });

    // Check for time conflicts
    const existingTasks = this.eventsByDate[timeObject.date] || [];
    const hasConflict = checkTimeConflicts(draftTask, existingTasks);

    if (hasConflict) {
      Alert.alert(
        'Time Conflict',
        'There is already a task scheduled at this time. Do you want to create it anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Create Anyway',
            onPress: () => this.addTaskToTimeline(draftTask, timeObject.date)
          }
        ]
      );
    } else {
      this.addTaskToTimeline(draftTask, timeObject.date);
    }

    return true;
  }

  /**
   * Add task to timeline with proper date organization
   */
  addTaskToTimeline(task, date) {
    const existingEvents = this.eventsByDate[date] || [];
    const updatedEvents = [...existingEvents, task];

    this.setEvents((prevEvents) => {
      const otherDateEvents = prevEvents.filter(
        (e) => CalendarUtils.getCalendarDateString(e.start || e.startTime) !== date
      );
      return [...otherDateEvents, ...updatedEvents];
    });
  }

  /**
   * Create final task with user input
   */
  createFinalTask(title, description, priority, timeObject) {
    if (!timeObject.date) {
      this.removeDraftTask();
      return;
    }

    const validation = validateTaskInput({ title, priority });
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    const taskId = generateTaskId();
    const currentTime = new Date().toISOString();

    this.setEvents((prevEvents) =>
      prevEvents.map((e) =>
        e.id === 'draft'
          ? {
              ...e,
              id: taskId,
              title: title.trim(),
              summary: description || 'No description provided',
              priority: priority,
              color: getRandomEventColor(),
              createdAt: currentTime,
              updatedAt: currentTime,
              status: 'pending'
            }
          : e
      )
    );

    Alert.alert(
      'Success!',
      `Task "${title}" has been created successfully.`,
      [{ text: 'OK', style: 'default' }]
    );
  }

  /**
   * Remove draft task
   */
  removeDraftTask() {
    this.setEvents((prevEvents) =>
      prevEvents.filter((e) => e.id !== 'draft')
    );
  }

  /**
   * Quick add task with minimal input
   */
  quickAddTask(title, date = null, time = null) {
    const validation = validateTaskInput({ title });
    if (!validation.isValid) {
      Alert.alert('Error', validation.errors.join('\n'));
      return;
    }

    const taskDate = date || new Date().toISOString().split('T')[0];
    const taskTime = time || new Date().toTimeString().split(' ')[0];
    const startDateTime = `${taskDate} ${taskTime}`;
    const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000)
      .toISOString().slice(0, 19).replace('T', ' ');

    const newTask = createTaskObject({
      id: generateTaskId('quick_task'),
      start: startDateTime,
      end: endDateTime,
      title: title.trim(),
      summary: 'Quick task - tap to add details'
    });

    this.setEvents((prevEvents) => [...prevEvents, newTask]);

    Alert.alert(
      'Task Created!',
      `"${title}" has been added to your timeline.`,
      [{ text: 'OK', style: 'default' }]
    );
  }

  /**
   * Add multiple tasks at once
   */
  addBulkTasks(tasksData) {
    if (!Array.isArray(tasksData) || tasksData.length === 0) {
      Alert.alert('Error', 'No tasks provided for bulk creation.');
      return;
    }

    const newTasks = tasksData.map((taskData, index) => {
      const validation = validateTaskInput(taskData);
      if (!validation.isValid) {
        console.warn(`Task ${index} validation failed:`, validation.errors);
      }

      return createTaskObject({
        ...taskData,
        id: generateTaskId('bulk_task') + `_${index}`
      });
    });

    this.setEvents((prevEvents) => [...prevEvents, ...newTasks]);

    Alert.alert(
      'Success!',
      `${newTasks.length} task(s) have been created successfully.`,
      [{ text: 'OK', style: 'default' }]
    );
  }

  /**
   * Update existing task
   */
  updateTask(taskId, updates) {
    const validation = validateTaskInput(updates);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    this.setEvents(prevEvents =>
      prevEvents.map(task =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  }

  /**
   * Delete task
   */
  deleteTask(taskId) {
    this.setEvents(prevEvents =>
      prevEvents.filter(task => task.id !== taskId)
    );
  }
}

/**
 * Save location logic - Tasks are stored in the events state
 * The save location follows this pattern:
 * 
 * 1. Tasks are stored in a flat array in the main events state
 * 2. Tasks are organized by date using CalendarUtils.getCalendarDateString()
 * 3. The eventsByDate object groups tasks by date for efficient access
 * 4. Each task maintains its own date information in start/end properties
 * 5. When saving, tasks are merged with existing events for the same date
 * 6. The setEvents function updates the global state
 * 
 * Data Flow:
 * User Input -> Validation -> Task Creation -> State Update -> UI Refresh
 * 
 * Storage Structure:
 * {
 *   events: [
 *     { id: 'task_1', start: '2024-01-01 09:00:00', ... },
 *     { id: 'task_2', start: '2024-01-01 14:00:00', ... },
 *     { id: 'task_3', start: '2024-01-02 10:00:00', ... }
 *   ],
 *   eventsByDate: {
 *     '2024-01-01': [task_1, task_2],
 *     '2024-01-02': [task_3]
 *   }
 * }
 */

export default TaskCreationService;