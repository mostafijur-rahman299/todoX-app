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
      dispatch(setTasks(tasks));
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
        id: taskData.id || Date.now().toString(),
        title: taskData.title || "",
        summary: taskData.summary || "",
        category: taskData.category || "Inbox",
        priority: taskData.priority || "medium",
        reminder: taskData.reminder || false,
        date: taskData.date || new Date().toISOString().split('T')[0],
        startTime: taskData.startTime || null,
        endTime: taskData.endTime || null,
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

    let updatedTask = {
      ...task,
      is_completed: false,
      completed_timestamp: null,
      updated_at: new Date().toISOString(),
    }

      // Update Redux store
      dispatch(addTaskAction(updatedTask));
      
      // Get updated task list (including the new task)
      const updatedTasks = [updatedTask, ...task_list];
      
      // Save to AsyncStorage
      await saveTasksToStorage(updatedTasks);
      await bulkDeleteCompletedTasks([task.id]);
  }

  const bulkCompleteTask = async (taskIds) => {
      const completedTasks = await getDataLocalStorage(STORAGE_KEYS.COMPLETED_TASKS) ?? [];
      dispatch(setLoading(true));
      
      // Update Redux store
      dispatch(completeTaskAction(taskIds));
      
      // Get the task that was toggled
      const task = task_list.find(t => taskIds.includes(t.id));
      if (!task) {
        return false;
      }

      // Update task lists based on completion status
      const updatedTasks = task_list.filter(t => !taskIds.includes(t.id));

      const updatedCompletedTasks = taskIds.map(taskId => ({
        ...task_list.find(t => t.id === taskId),
        is_completed: true,
        completed_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      
      // Save to AsyncStorage
      await saveTasksToStorage([
        ...updatedCompletedTasks,
        ...completedTasks,
      ], true);
      await saveTasksToStorage(updatedTasks, false);
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