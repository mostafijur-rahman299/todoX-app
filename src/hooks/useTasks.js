import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { 
  addTask as addTaskAction, 
  updateTask as updateTaskAction, 
  deleteTask as deleteTaskAction,
  toggleTaskComplete as toggleTaskCompleteAction,
  setTasks,
  setLoading,
  setError,
  bulkUpdateTasks
} from '../store/Task/task';
import StorageManager from '../utils/storage';

// Storage keys for AsyncStorage
const STORAGE_KEYS = {
  TASKS: 'tasks',
  COMPLETED_TASKS: 'completed_tasks',
};

/**
 * Custom hook for managing tasks with Redux and AsyncStorage synchronization
 * Provides CRUD operations that automatically sync between Redux store and local storage
 */
const useTasks = () => {
  const dispatch = useDispatch();
  
  // Get task state from Redux store
  const { 
    task_list, 
    display_tasks, 
    completed_tasks, 
    loading, 
    error 
  } = useSelector(state => state.task);

  const loadTasksFromStorage = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      const storedTasks = await Promise.all(
        StorageManager.getData(STORAGE_KEYS.TASKS)
      );

      if (storedTasks) {
        dispatch(setTasks(storedTasks));
      }
      
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError('Failed to load tasks from storage'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const saveTasksToStorage = useCallback(async (tasks, completedTasks = null) => {
    try {
      const savePromises = [
        StorageManager.storeData(STORAGE_KEYS.TASKS, tasks)
      ];
      
      if (completedTasks) {
        savePromises.push(
          StorageManager.storeData(STORAGE_KEYS.COMPLETED_TASKS, completedTasks)
        );
      }
      
      await Promise.all(savePromises);
      return true;
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
      dispatch(setError('Failed to save tasks to storage'));
      return false;
    }
  }, [dispatch]);

  const addTask = useCallback(async (taskData) => {
    try {
      dispatch(setLoading(true));
      
      // Generate unique ID if not provided
      const newTask = {
        ...taskData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update Redux store
      dispatch(addTaskAction(newTask));
      
      // Get updated task list (including the new task)
      const updatedTasks = [newTask, ...task_list];
      
      // Save to AsyncStorage
      const success = await saveTasksToStorage(updatedTasks);
      
      if (success) {
        dispatch(setError(null));
        return true;
      }
      
      return false;
    } catch (error) {
      dispatch(setError('Failed to add task'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, task_list, saveTasksToStorage]);

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      dispatch(setLoading(true));
      
      const updatedTask = {
        ...updates,
        id: taskId,
        updated_at: new Date().toISOString(),
      };

      // Update Redux store
      dispatch(updateTaskAction(updatedTask));
      
      // Get updated task list
      const updatedTasks = task_list.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      );
      
      // Save to AsyncStorage
      const success = await saveTasksToStorage(updatedTasks);
      
      if (success) {
        dispatch(setError(null));
        return true;
      }
      
      return false;
    } catch (error) {
      dispatch(setError('Failed to update task'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, task_list, saveTasksToStorage]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      dispatch(setLoading(true));
      
      // Update Redux store
      dispatch(deleteTaskAction(taskId));
      
      // Get updated task list (without the deleted task)
      const updatedTasks = task_list.filter(task => task.id !== taskId);
      
      // Save to AsyncStorage
      const success = await saveTasksToStorage(updatedTasks);
      
      if (success) {
        dispatch(setError(null));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      dispatch(setError('Failed to delete task'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, task_list, saveTasksToStorage]);

  const toggleTaskComplete = useCallback(async (taskId) => {
    try {
      dispatch(setLoading(true));
      
      // Update Redux store
      dispatch(toggleTaskCompleteAction(taskId));
      
      // Get the task that was toggled
      const task = task_list.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      
      // Update task lists based on completion status
      const updatedTasks = task_list.filter(t => t.id !== taskId);
      const updatedCompletedTasks = [
        ...completed_tasks,
        {
          ...task,
          is_completed: !task.is_completed,
          completed_timestamp: !task.is_completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        }
      ];
      
      // Save to AsyncStorage
      const success = await saveTasksToStorage(updatedTasks, updatedCompletedTasks);
      
      if (success) {
        dispatch(setError(null));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error toggling task completion:', error);
      dispatch(setError('Failed to toggle task completion'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, task_list, completed_tasks, saveTasksToStorage]);

  const bulkUpdateTasksHook = useCallback(async (taskIds, updates) => {
    try {
      dispatch(setLoading(true));
      
      // Update Redux store
      dispatch(bulkUpdateTasks({ taskIds, updates }));
      
      // Get updated task list
      const timestamp = new Date().toISOString();
      const updatedTasks = task_list.map(task => 
        taskIds.includes(task.id) 
          ? { ...task, ...updates, updated_at: timestamp }
          : task
      );
      
      // Save to AsyncStorage
      const success = await saveTasksToStorage(updatedTasks);
      
      if (success) {
        dispatch(setError(null));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error bulk updating tasks:', error);
      dispatch(setError('Failed to bulk update tasks'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, task_list, saveTasksToStorage]);
 
  const clearAllTasks = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      // Clear Redux store
      dispatch(setTasks([]));
      
      // Clear AsyncStorage
      await Promise.all([
        StorageManager.removeData(STORAGE_KEYS.TASKS),
        StorageManager.removeData(STORAGE_KEYS.COMPLETED_TASKS)
      ]);
      
      dispatch(setError(null));
      return true;
    } catch (error) {
      console.error('Error clearing all tasks:', error);
      dispatch(setError('Failed to clear all tasks'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Return all the task operations and state
  return {
    // State
    tasks: task_list,
    displayTasks: display_tasks,
    completedTasks: completed_tasks,
    loading,
    error,
    
    // Operations
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    bulkUpdateTasks: bulkUpdateTasksHook,
    clearAllTasks,
    loadTasksFromStorage,
    
    // Utility
    refreshTasks: loadTasksFromStorage,
  };
};

export default useTasks;