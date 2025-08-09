import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    task_list: [],
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
      state.task_list = action.payload;
      state.loading = false;
      state.error = null;
    },

    addTask(state, action) {
      const newTask = {
        ...action.payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.task_list.unshift(newTask);
    },

    // Consolidated toggle action
    completeTask(state, action) {
      state.task_list = state.task_list.filter(task => !action.payload.includes(task.id));
    },

    updateTask(state, action) {
      const updatedTask = {
        ...action.payload,
        title: action.payload.title || "",
        summary: action.payload.summary || "",
        category: action.payload.category || "Inbox",
        priority: action.payload.priority || "medium",
        reminder: action.payload.reminder || false,
        date: action.payload.date || new Date().toISOString().split('T')[0],
        startTime: action.payload.startTime || null,
        endTime: action.payload.endTime || null,
        subTask: action.payload.subTask || [],
        updated_at: new Date().toISOString()
      };
      
      const updateTaskInArray = (task) => task.id === updatedTask.id ? updatedTask : task;
      
      state.task_list = state.task_list.map(updateTaskInArray);
    },

    deleteTask(state, action) {
      const taskId = action.payload;
      state.task_list = state.task_list.filter(task => task.id !== taskId);
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
    },
  },
});

// Export the generated actions
export const { 
  setLoading,
  setError,
  completeTask, 
  addTask, 
  setTasks, 
  updateTask, 
  deleteTask,
  bulkUpdateTasks
} = taskSlice.actions;

// Export the reducer to be added to the store
export default taskSlice.reducer;
