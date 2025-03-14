// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskSlice from './Task/task';

export const store = configureStore({
  reducer: {
    tasks: taskSlice,
  },
});
