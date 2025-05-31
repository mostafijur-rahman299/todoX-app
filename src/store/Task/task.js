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
      // Consider if display_tasks should always get the new task,
      // or if it should be re-derived based on current filters.
      // For now, adding to both as per original logic.
      state.display_tasks.push(action.payload);
    },

    toggleCompleteTask(state, action) {
      const taskId = action.payload; // Assuming payload is the taskId
      const toggle = (task) => {
        if (task.id === taskId) {
          task.is_completed = !task.is_completed;
          task.completed_timestamp = task.is_completed ? new Date().toISOString() : null;
        }
      };
      state.task_list.forEach(toggle);
      state.display_tasks.forEach(toggle); // Also toggle in display_tasks for consistency here.
                                          // A more robust solution might involve re-filtering.
    },
  },
});

// Export the generated actions
export const { toggleCompleteTask, addTask, setTasks, setDisplayTasks } = taskSlice.actions;

// Export the reducer to be added to the store
export default taskSlice.reducer;
