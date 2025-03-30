// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskSlice from './Task/task';
import categorySlice from './Task/category';

export const store = configureStore({
  reducer: {
    task: taskSlice,
    category: categorySlice,
  },
});
