import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    task_list: [],
    display_tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    
    setError(state, action) {
      state.error = action.payload;
    },

    setTasks(state, action) {
      state.display_tasks = action.payload;
      state.task_list = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    setDisplayTasks(state, action) {
      state.display_tasks = action.payload;
    },

    addTask(state, action) {
      const newTask = {
        ...action.payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.task_list.unshift(newTask);
      state.display_tasks.unshift(newTask);
    },

    // Consolidated toggle action
    toggleTaskComplete(state, action) {
      const taskId = action.payload;
      
      let task = state.task_list.find(task => task.id === taskId);
      if (!task) return;

      task = {
        ...task,
        is_completed: !task.is_completed,
        completed_timestamp: !task.is_completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      
      state.completed_tasks.push(task);
      state.task_list = state.task_list.filter(task => task.id !== taskId);
      state.display_tasks = state.display_tasks.filter(task => task.id !== taskId);
    },

    updateTask(state, action) {
      const updatedTask = {
        ...action.payload,
        updated_at: new Date().toISOString()
      };
      
      const updateTaskInArray = (task) => task.id === updatedTask.id ? updatedTask : task;
      
      state.task_list = state.task_list.map(updateTaskInArray);
      state.display_tasks = state.display_tasks.map(updateTaskInArray);
    },

    deleteTask(state, action) {
      const taskId = action.payload;
      state.task_list = state.task_list.filter(task => task.id !== taskId);
      state.display_tasks = state.display_tasks.filter(task => task.id !== taskId);
    },

    // Bulk operations for better performance
    bulkUpdateTasks(state, action) {
      const { taskIds, updates } = action.payload;
      const timestamp = new Date().toISOString();
      
      const updateTasks = (tasks) => tasks.map(task => 
        taskIds.includes(task.id) 
          ? { ...task, ...updates, updated_at: timestamp }
          : task
      );
      
      state.task_list = updateTasks(state.task_list);
      state.display_tasks = updateTasks(state.display_tasks);
    },
  },
});

// Export the generated actions
export const { 
  setLoading,
  setError,
  toggleTaskComplete, 
  addTask, 
  setTasks, 
  setDisplayTasks, 
  updateTask, 
  deleteTask,
  bulkUpdateTasks
} = taskSlice.actions;

// Export the reducer to be added to the store
export default taskSlice.reducer;
