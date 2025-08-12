import { createSlice } from '@reduxjs/toolkit';


function convertTasks(tasks) {
		const grouped = tasks.reduce((acc, task) => {
			const taskDate = task.date || today;
			if (!acc[taskDate]) acc[taskDate] = [];
			
			acc[taskDate].push({
				id: task.id || `${task.title}_${taskDate}_${Date.now()}`,
				is_completed: task.is_completed || false,
				priority: task.priority || "low",
				category: task.category?.toLowerCase() || "inbox",
				title: task.title || "Untitled Task",
				time: task.time || task.startTime,
				startTime: task.startTime,
				endTime: task.endTime,
				itemCustomHeightType: "LongEvent",
			});
			return acc;
		}, {});

		return Object.entries(grouped)
			.sort(([a], [b]) => new Date(a) - new Date(b))
			.map(([date, data]) => ({
				title: date,
				data: data.sort((a, b) => {
					// Sort by time if available
					if (a.time && b.time) {
						return a.time.localeCompare(b.time);
					}
					return 0;
				})
			}));
	}
  

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    task_list: [],
    calendar_list: [],
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
      state.calendar_list = convertTasks(action.payload);
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
        // Normalize completion status
        is_completed: action.payload.isCompleted || action.payload.is_completed || false,
        isCompleted: action.payload.isCompleted || action.payload.is_completed || false,
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
