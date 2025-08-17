# Timeline Event Handlers with Task Management Integration

This document explains how to use the enhanced `useTimelineEventHandlers` hook that integrates with the `useTasks` hook for persistent storage.

## Overview

The `useTimelineEventHandlers` hook now provides comprehensive task management capabilities with persistent storage using React Native's AsyncStorage. All timeline events are automatically saved to local storage and synchronized with the app's task management system.

## Key Features

- **Persistent Storage**: All timeline events are saved to local storage using the `useTasks` hook
- **Automatic Synchronization**: Events are synced between timeline view and task management system
- **CRUD Operations**: Create, read, update, and delete timeline events with storage persistence
- **Error Handling**: Comprehensive error handling for storage operations
- **Loading States**: Access to loading and error states from task management

## Usage Example

```javascript
import React, { useState, useEffect } from 'react';
import { useTimelineEventHandlers } from './TimelineEventHandlers';

const TimelineComponent = () => {
  const [events, setEvents] = useState([]);
  const [eventsByDate, setEventsByDate] = useState({});

  // Initialize the enhanced timeline event handlers
  const {
    createNewEvent,
    approveNewEvent,
    handleDateChanged,
    handleMonthChange,
    loadTimelineEvents,
    syncTimelineEvents,
    deleteTimelineEvent,
    updateTimelineEvent,
    taskList,
    isLoading,
    taskError,
  } = useTimelineEventHandlers(eventsByDate, setEvents);

  // Load existing timeline events on component mount
  useEffect(() => {
    loadTimelineEvents();
  }, [loadTimelineEvents]);

  // Handle creating new event on timeline long press
  const handleTimelineLongPress = async (timeString, timeObject) => {
    await createNewEvent(timeString, timeObject);
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId) => {
    await deleteTimelineEvent(eventId);
  };

  // Handle event updates
  const handleUpdateEvent = async (eventId, updates) => {
    await updateTimelineEvent(eventId, updates);
  };

  // Sync events when needed (e.g., on app focus)
  const handleSync = async () => {
    await syncTimelineEvents();
  };

  return (
    <View>
      {/* Your timeline component JSX */}
      {isLoading && <LoadingIndicator />}
      {taskError && <ErrorMessage error={taskError} />}
      
      {/* Timeline events display */}
      {events.map(event => (
        <TimelineEvent
          key={event.id}
          event={event}
          onDelete={() => handleDeleteEvent(event.id)}
          onUpdate={(updates) => handleUpdateEvent(event.id, updates)}
        />
      ))}
    </View>
  );
};
```

## API Reference

### Returned Functions

#### `createNewEvent(timeString, timeObject)`
- **Purpose**: Creates a new timeline event with persistent storage
- **Parameters**:
  - `timeString`: The time string for the event
  - `timeObject`: Object containing date, hour, and minutes
- **Returns**: Promise that resolves when event is created and saved
- **Storage**: Automatically saves to AsyncStorage via `useTasks` hook

#### `approveNewEvent(timeString, timeObject)`
- **Purpose**: Shows prompt to finalize event creation with custom title
- **Parameters**: Same as `createNewEvent`
- **Storage**: Updates the draft event in persistent storage

#### `loadTimelineEvents()`
- **Purpose**: Loads all timeline events from persistent storage
- **Returns**: Promise that resolves when events are loaded
- **Usage**: Call on component mount or when refreshing data

#### `syncTimelineEvents()`
- **Purpose**: Synchronizes timeline events with stored tasks
- **Returns**: Promise that resolves when sync is complete
- **Usage**: Call when app regains focus or periodically

#### `deleteTimelineEvent(eventId)`
- **Purpose**: Deletes an event from both timeline and persistent storage
- **Parameters**: `eventId` - The ID of the event to delete
- **Returns**: Promise that resolves when deletion is complete

#### `updateTimelineEvent(eventId, updates)`
- **Purpose**: Updates an event in both timeline and persistent storage
- **Parameters**:
  - `eventId` - The ID of the event to update
  - `updates` - Object containing the fields to update
- **Returns**: Promise that resolves when update is complete

### Returned State

#### `taskList`
- **Type**: Array
- **Description**: Current list of all tasks from the task management system
- **Usage**: Access to all tasks, including timeline events

#### `isLoading`
- **Type**: Boolean
- **Description**: Loading state from the task management system
- **Usage**: Show loading indicators during task operations

#### `taskError`
- **Type**: String | null
- **Description**: Error message from task management operations
- **Usage**: Display error messages to users

## Storage Structure

Timeline events are stored as tasks with the following structure:

```javascript
{
  id: 'unique-event-id',
  title: 'Event Title',
  summary: 'Event Description',
  category: 'timeline', // Special category for timeline events
  priority: 'medium',
  date: '2024-01-15',
  startTime: '2024-01-15 10:00:00',
  endTime: '2024-01-15 11:00:00',
  reminder: false,
  subTask: [],
  is_completed: false,
  created_at: '2024-01-15T10:00:00.000Z',
  updated_at: '2024-01-15T10:00:00.000Z'
}
```

## Error Handling

All functions include comprehensive error handling:

- Storage operation failures are logged to console
- Failed operations fall back to local state updates when possible
- Error states are exposed through the `taskError` property
- Loading states are managed automatically

## Best Practices

1. **Load Events on Mount**: Always call `loadTimelineEvents()` when the component mounts
2. **Handle Loading States**: Use `isLoading` to show appropriate UI feedback
3. **Error Handling**: Display `taskError` messages to users when operations fail
4. **Sync Regularly**: Call `syncTimelineEvents()` when the app regains focus
5. **Await Async Operations**: Always await the async functions for proper error handling

## Integration with Existing Task System

Timeline events are fully integrated with the existing task management system:

- Events appear in the main task list with `category: 'timeline'`
- All task management features (completion, deletion, updates) work with timeline events
- Storage is handled by the same `useTasks` hook used throughout the app
- Events are synchronized with Redux store and AsyncStorage