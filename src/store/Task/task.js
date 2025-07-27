import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task', // a name used in action types
  initialState: {
    task_list: [],
    display_tasks: [],
  },
  reducers: {

    setTasks(state, action) {
      state.display_tasks = action.payload;
      state.task_list = action.payload;
    },
    setDisplayTasks(state, action) {
      state.display_tasks = action.payload;
    },

    addTask(state, action) {
      state.task_list.push(action.payload);
      state.display_tasks.push(action.payload);
    },

    toggleCompleteTask(state, action) {
      state.task_list = action.payload;
      state.display_tasks = action.payload;
    },

    // Add the missing toggleTaskComplete action
    toggleTaskComplete(state, action) {
      const taskId = action.payload;
      const updateTask = (task) => {
        if (task.id === taskId) {
          return {
            ...task,
            is_completed: !task.is_completed,
            completed_timestamp: !task.is_completed ? new Date().toISOString() : null
          };
        }
        return task;
      };
      
      state.task_list = state.task_list.map(updateTask);
      state.display_tasks = state.display_tasks.map(updateTask);
    },

    // Add action to update a specific task
    updateTask(state, action) {
      const updatedTask = action.payload;
      const updateTaskInArray = (task) => task.id === updatedTask.id ? updatedTask : task;
      
      state.task_list = state.task_list.map(updateTaskInArray);
      state.display_tasks = state.display_tasks.map(updateTaskInArray);
    },

    // Add action to delete a task
    deleteTask(state, action) {
      const taskId = action.payload;
      state.task_list = state.task_list.filter(task => task.id !== taskId);
      state.display_tasks = state.display_tasks.filter(task => task.id !== taskId);
    },
  },
});

// Export the generated actions
export const { 
  toggleCompleteTask, 
  toggleTaskComplete, 
  addTask, 
  setTasks, 
  setDisplayTasks, 
  updateTask, 
  deleteTask 
} = taskSlice.actions;

// Export the reducer to be added to the store
export default taskSlice.reducer;
