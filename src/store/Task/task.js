import { createSlice } from '@reduxjs/toolkit';

function sortTasksFunc(tasks) {
  return tasks.sort((a, b) => {
    // sort by is_completed false first
    return a.timestamp - b.timestamp;

    // sort by is_completed false first
    if (a.is_completed === b.is_completed) {
      return a.is_completed - b.is_completed;
    }

    // sort by completed_timestamp
    return a.completed_timestamp - b.completed_timestamp;

    if (a.sub_tasks.length > 0 && b.sub_tasks.length > 0) {
      a.sub_tasks.sort((aa, bb) => {
        return aa.timestamp - bb.timestamp;

        if (aa.is_completed === bb.is_completed) {
          return aa.is_completed - bb.is_completed;
        }

        // sort by completed_timestamp
        if (aa.completed_timestamp !== null && bb.completed_timestamp !== null) {
          return aa.completed_timestamp - bb.completed_timestamp;
        }
      });
    }
  });
}

const taskSlice = createSlice({
  name: 'task', // a name used in action types
  initialState: { 
    task: sortTasksFunc([
      {
          id: 1,
          title: "Buy groceries for the week and some fruits and vegetables",
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
          title: "Have a meeting with the team",
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
          title: "Meet with the client",
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
          title: "Spend time with family",
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
          title: "Go to the gym",
          timestamp: "2025-03-11 10:00:00",
          description: "Go to the gym",
          category: "fitness",
          priority: "low",
          is_completed: false,
          completed_timestamp: null
      },
      {
          id: 6,
          title: "Go with the family to the park",
          timestamp: "2025-03-11 10:00:00",
          description: "Go with the family to the park",
          category: "family",
          priority: "low",
          is_completed: true,
          completed_timestamp: null,
      },
      {
          id: 7,
          title: "Have a meeting with the team",
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
    ]),
    todayTasks: [],
    upcomingTasks: [],
  },
  reducers: {
    sortTasks(state) {
      state.task = sortTasksFunc(state.task);
    },
    completeTask(state, action) {
      const { parentId, isSubTask, subTaskId } = action.payload;
      const task = state.task.find(task => task.id === parentId);
      if (task) {
        if (isSubTask) {
          task.sub_tasks = task.sub_tasks.map(subTask => {
            if (subTask.id === subTaskId) {
              subTask.is_completed = true;
              subTask.completed_timestamp = new Date().toISOString();
            }
            return subTask;
          });
        } else {
          task.is_completed = true;
          task.completed_timestamp = new Date().toISOString();

          // Complete all sub tasks
          task.sub_tasks = task.sub_tasks.map(subTask => {
            subTask.is_completed = true;
            subTask.completed_timestamp = new Date().toISOString();
            return subTask;
          });
        }
      }
    },
  },
});

// Export the generated actions
export const { completeTask, sortTasks } = taskSlice.actions;

// Export the reducer to be added to the store
export default taskSlice.reducer;
