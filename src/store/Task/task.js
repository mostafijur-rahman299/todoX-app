import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task', // a name used in action types
  initialState: {
    task_list: [
      {
          id: 1,
          title: "1",
          timestamp: "2025-03-11 10:00:00",
          description: "Buy groceries for the week and some fruits and vegetables", 
          category: "shopping",
          priority: "high",
          is_completed: true,
          completed_timestamp: null,
          sub_tasks: [
              {
                  id: 1,
                  title: "Buy bread",
                  is_completed: false,
                  completed_timestamp: null,
                  description: "Buy bread for the week",
                  category: "shopping",
                  priority: "high",
                  timestamp: "2025-03-11 10:00:00",
              },
              {
                  id: 2,
                  title: "Buy milk",
                  is_completed: false,
                  completed_timestamp: null,
                  description: "Buy milk for the week",
                  category: "shopping",
                  priority: "high",
                  timestamp: "2025-03-11 10:00:00",
              },
              {
                  id: 3,
                  title: "Buy eggs",
                  is_completed: false,
                  completed_timestamp: null,
                  description: "Buy eggs for the week",
                  category: "shopping",
                  priority: "high",
                  timestamp: "2025-03-11 10:00:00",
              }
          ]
      },
      {
          id: 2,
          title: "2",
          timestamp: "2025-03-11 10:00:00",
          description: "Have a meeting with the team",
          category: "work",
          priority: "medium",
          is_completed: false,
          completed_timestamp: null,
          sub_tasks: [
              {
                  id: 1,
                  title: "Have a meeting with the team",
                  is_completed: false,
                  completed_timestamp: null,
                  description: "Have a meeting with the team",
                  category: "work",
                  priority: "high",
                  timestamp: "2025-03-11 10:00:00",
              },
              {
                  id: 2,
                  title: "Have a meeting with the team",
                  is_completed: false,
                  completed_timestamp: null,
                  description: "Have a meeting with the team",
                  category: "work",
                  priority: "high",
                  timestamp: "2025-03-11 10:00:00",
              }
          ]
      },
      {
          id: 3,
          title: "3",
          timestamp: "2025-03-11 10:00:00",
          description: "Meet with the client",
          category: "work",
          priority: "high",
          is_completed: false,
          completed_timestamp: null,
          sub_tasks: [
              {
                  id: 1,
                  title: "Meet with the client",
                  is_completed: false,
                  completed_timestamp: null,
                  description: "Meet with the client",
                  category: "work",
                  priority: "high",
                  is_deleted: false,
                  timestamp: "2025-03-11 10:00:00",
                  is_completed: false,
              }
          ]
      },
      {
          id: 4,
          title: "4",
          timestamp: "2025-03-11 10:00:00",
          description: "Spend time with family",
          category: "family",
          priority: "medium",
          is_completed: false,
          completed_timestamp: null,
          sub_tasks: [
              {
                  id: 1,
                  title: "Take a walk with the family",
                  is_completed: true,
                  completed_timestamp: null,
                  description: "Take a walk with the family",
                  category: "family",
                  priority: "medium",
                  timestamp: "2025-03-11 10:00:00",
              },
              {
                  id: 2,
                  title: "Play board games with the family",
                  is_completed: false,
                  completed_timestamp: null,
                  description: "Play board games with the family",
                  category: "family",
                  priority: "low",
                  timestamp: "2025-03-11 10:00:00",
              }
          ]
      },
      {
          id: 5,
          title: "5",
          timestamp: "2025-03-11 10:00:00",
          description: "Go to the gym",
          category: "fitness",
          priority: "low",
          is_completed: false,
          completed_timestamp: null,
          sub_tasks: [
          ]
      },
      {
          id: 6,
          title: "6",
          timestamp: "2025-03-11 10:00:00",
          description: "Go with the family to the park",
          category: "family",
          priority: "low",
          is_completed: true,
          completed_timestamp: null,
          sub_tasks: [
          ]
      },
      {
          id: 7,
          title: "7",
          timestamp: "2025-03-11 10:00:00",
          description: "Have a meeting with the team",
          category: "work",
          priority: "high",
          is_completed: false,
          completed_timestamp: null,
          sub_tasks: [
              {
                  id: 1,
                  title: "Have a meeting with the team",
                  description: "Have a meeting with the team",
                  category: "work",
                  priority: "high",
                  timestamp: "2025-03-11 10:00:00",
                  is_completed: true,
                  completed_timestamp: null,
              },
              {
                  id: 2,
                  title: "Have a meeting with the team",
                  description: "Have a meeting with the team",
                  category: "work",
                  priority: "high",
                  timestamp: "2025-03-11 10:00:00",
                  is_completed: false,
                  completed_timestamp: null,
              }
          ]
      }
    ],
    todayTasks: [],
    upcomingTasks: [],
  },
  reducers: {
    addTask(state, action) {
      state.task_list.push(action.payload);
    },

    toggleCompleteTask(state, action) {
      const { parentId, isSubTask, subTaskId } = action.payload;

      state.task_list = state.task_list.map(task => {
        if (task.id === parentId) {
          if (isSubTask === true) {
            task["sub_tasks"] = task.sub_tasks.map(subTask => {
              if (subTask.id === subTaskId) {
                return {
                  ...subTask,
                  is_completed: !subTask.is_completed,
                  completed_timestamp: new Date().toISOString()
                };
              }
              return subTask;
            });
          } else {
            task.is_completed = !task.is_completed;
            task.completed_timestamp = new Date().toISOString();
          }
        }
        return task;
      })
    },
  },
});

// Export the generated actions
export const { toggleCompleteTask, addTask } = taskSlice.actions;

// Export the reducer to be added to the store
export default taskSlice.reducer;
