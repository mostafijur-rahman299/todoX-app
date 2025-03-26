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
  },
});

// Export the generated actions
export const { toggleCompleteTask, addTask, setTasks, setDisplayTasks } = taskSlice.actions;

// Export the reducer to be added to the store
export default taskSlice.reducer;
