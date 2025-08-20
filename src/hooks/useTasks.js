import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  addTask as addTaskAction, 
  updateTask as updateTaskAction, 
  deleteTask as deleteTaskAction,
  completeTask as completeTaskAction,
  setTasks,
  setLoading,
  setError,
  bulkUpdateTasks
} from '../store/Task/task';
import { storeDataLocalStorage, getDataLocalStorage } from '../utils/storage';

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
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
    loading, 
    error 
  } = useSelector(state => state.task);

  const loadTasksFromStorage = async () => {
      const tasks = await getDataLocalStorage(STORAGE_KEYS.TASKS);
      dispatch(setTasks(tasks || []));
  }

  const saveTasksToStorage = useCallback(async (tasks, isCompletedTask = false) => {
    try {
      
      if (isCompletedTask) {
        await storeDataLocalStorage(STORAGE_KEYS.COMPLETED_TASKS, tasks);
      } else{
        await storeDataLocalStorage(STORAGE_KEYS.TASKS, tasks);
      }
      return true;
    } catch (error) {
      dispatch(setError('Failed to save tasks to storage'));
      return false;
    }
  }, [dispatch]);

  const addTask = useCallback(async (taskData) => {
    try {
      dispatch(setLoading(true));
      
      // Create new task with proper data structure
      const newTask = {
        id: taskData.id,
        title: taskData.title,
        summary: taskData.summary,
        category: taskData.category,
        priority: taskData.priority,
        reminder: taskData.reminder || false,
        date: taskData.date || new Date().toISOString().split('T')[0],
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        subTask: taskData.subTask || [],
        is_completed: false,
        completed_timestamp: null,
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
      
      // Find the existing task to preserve all fields
      const existingTask = task_list.find(task => task.id === taskId);
      if (!existingTask) {
        throw new Error('Task not found');
      }
      
      const updatedTask = {
        ...existingTask,
        ...updates,
        id: taskId,
        title: updates.title !== undefined ? updates.title : existingTask.title,
        summary: updates.summary !== undefined ? updates.summary : existingTask.summary,
        category: updates.category !== undefined ? updates.category : existingTask.category,
        priority: updates.priority !== undefined ? updates.priority : existingTask.priority,
        reminder: updates.reminder !== undefined ? updates.reminder : existingTask.reminder,
        date: updates.date !== undefined ? updates.date : existingTask.date,
        startTime: updates.startTime !== undefined ? updates.startTime : existingTask.startTime,
        endTime: updates.endTime !== undefined ? updates.endTime : existingTask.endTime,
        subTask: updates.subTask !== undefined ? updates.subTask : existingTask.subTask,
        updated_at: new Date().toISOString(),
      };

      // Update Redux store
      dispatch(updateTaskAction(updatedTask));
      
      // Get updated task list
      const updatedTasks = task_list.map(task => 
        task.id === taskId ? updatedTask : task
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
      const updatedTasks = (task_list || []).filter(task => task.id !== taskId);
      
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

  const clearAllCompletedTasks = async () => {
      await storeDataLocalStorage(STORAGE_KEYS.COMPLETED_TASKS, []);
  }

  const bulkDeleteCompletedTasks = async (taskIds) => {
    try {
      const completedTasks = await getDataLocalStorage(STORAGE_KEYS.COMPLETED_TASKS) ?? [];
      const updatedCompletedTasks = completedTasks.filter(task => !taskIds.includes(task.id));
      await storeDataLocalStorage(STORAGE_KEYS.COMPLETED_TASKS, updatedCompletedTasks);
      return true;
    } catch (error) {
      return false;
    }
  }

  const restoreTask = async (task) => {
    try {
      dispatch(setLoading(true));
      
      // Validate task parameter
      if (!task || !task.id) {
        console.warn('restoreTask: Invalid task provided');
        dispatch(setError('Invalid task provided'));
        return false;
      }

      // Create updated task with restored status
      const updatedTask = {
        ...task,
        is_completed: false,
        isCompleted: false,
        completed_timestamp: null,
        updated_at: new Date().toISOString(),
      };

      // Update Redux store
      dispatch(addTaskAction(updatedTask));
      
      // Get updated task list (including the restored task)
      const updatedTasks = [updatedTask, ...(task_list || [])];
      
      // Save to AsyncStorage with error handling
      const saveActiveSuccess = await saveTasksToStorage(updatedTasks);
      const removeCompletedSuccess = await bulkDeleteCompletedTasks([task.id]);
      
      if (!saveActiveSuccess || !removeCompletedSuccess) {
        throw new Error('Failed to save task restoration to storage');
      }
      
      dispatch(setError(null));
      return true;
    } catch (error) {
      console.error('Error restoring task:', error);
      dispatch(setError('Failed to restore task'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  const bulkCompleteTask = async (taskIds) => {
    try {
      dispatch(setLoading(true));
      
      // Handle undefined task_list
      if (!task_list || !Array.isArray(task_list)) {
        console.warn('bulkCompleteTask: task_list is undefined or not an array');
        dispatch(setError('Task list is not available'));
        return false;
      }

      // Validate that all tasks exist
      const tasksToComplete = task_list.filter(t => taskIds.includes(t.id));
      if (tasksToComplete.length === 0) {
        console.warn('bulkCompleteTask: No valid tasks found to complete');
        dispatch(setError('No valid tasks found to complete'));
        return false;
      }

      // Get existing completed tasks
      const existingCompletedTasks = await getDataLocalStorage(STORAGE_KEYS.COMPLETED_TASKS) ?? [];
      
      // Update Redux store
      dispatch(completeTaskAction(taskIds));
      
      // Create completed tasks with proper timestamps
      const updatedCompletedTasks = tasksToComplete.map(task => ({
        ...task,
        is_completed: true,
        isCompleted: true,
        completed_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      
      // Remove completed tasks from active tasks
      const remainingTasks = task_list.filter(t => !taskIds.includes(t.id));
      
      // Save to AsyncStorage with proper error handling
      const saveActiveSuccess = await saveTasksToStorage(remainingTasks, false);
      const saveCompletedSuccess = await storeDataLocalStorage(
        STORAGE_KEYS.COMPLETED_TASKS, 
        [...updatedCompletedTasks, ...existingCompletedTasks]
      );
      
      if (!saveActiveSuccess || !saveCompletedSuccess) {
        throw new Error('Failed to save task completion to storage');
      }
      
      dispatch(setError(null));
      return true;
    } catch (error) {
      console.error('Error completing tasks:', error);
      dispatch(setError('Failed to complete tasks'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

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
    loading,
    error,
    
    // Operations
    addTask,
    updateTask,
    deleteTask,
    bulkCompleteTask,
    bulkUpdateTasks: bulkUpdateTasksHook,
    clearAllTasks,
    loadTasksFromStorage,
    clearAllCompletedTasks,
    bulkDeleteCompletedTasks,
    restoreTask,
    
    // Utility
    refreshTasks: loadTasksFromStorage,
  };
};

export default useTasks;