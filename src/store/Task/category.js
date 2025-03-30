import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
        state.categories = [action.payload, ...state.categories];
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    },
  },
});

export const { addCategory, deleteCategory, setCategories } = categorySlice.actions;
export default categorySlice.reducer;
