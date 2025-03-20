import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task', // a name used in action types
  initialState: {
    task_list: [],
    todayTasks: [],
    upcomingTasks: [],
  },
  reducers: {

    setTasks(state, action) {
      state.task_list = action.payload;
    },

    addTask(state, action) {
      state.task_list.push(action.payload);
    },

    toggleCompleteTask(state, action) {
      state.task_list = action.payload;
    },
  },
});

// Export the generated actions
export const { toggleCompleteTask, addTask, setTasks } = taskSlice.actions;

// Export the reducer to be added to the store
export default taskSlice.reducer;
