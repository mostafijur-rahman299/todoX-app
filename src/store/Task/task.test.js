import taskReducer, { setTasks, setDisplayTasks, addTask, toggleCompleteTask } from './task';

describe('taskSlice reducers', () => {
  const initialState = {
    task_list: [],
    display_tasks: [],
  };

  const sampleTask1 = { id: '1', title: 'Task 1', is_completed: false, completed_timestamp: null, sub_tasks: [] };
  const sampleTask2 = { id: '2', title: 'Task 2', is_completed: false, completed_timestamp: null, sub_tasks: [] };
  const sampleTask1Completed = { ...sampleTask1, is_completed: true, completed_timestamp: expect.any(String) };


  // --- Test setTasks ---
  describe('setTasks', () => {
    it('should set both task_list and display_tasks with the provided tasks', () => {
      const tasksToSet = [sampleTask1, sampleTask2];
      const action = setTasks(tasksToSet);
      const newState = taskReducer(initialState, action);
      expect(newState.task_list).toEqual(tasksToSet);
      expect(newState.display_tasks).toEqual(tasksToSet);
    });

    it('should overwrite existing tasks', () => {
      const previousState = {
        task_list: [sampleTask1],
        display_tasks: [sampleTask1],
      };
      const tasksToSet = [sampleTask2];
      const action = setTasks(tasksToSet);
      const newState = taskReducer(previousState, action);
      expect(newState.task_list).toEqual(tasksToSet);
      expect(newState.display_tasks).toEqual(tasksToSet);
    });

    it('should set tasks to an empty array if an empty array is passed', () => {
      const previousState = {
        task_list: [sampleTask1, sampleTask2],
        display_tasks: [sampleTask1, sampleTask2],
      };
      const action = setTasks([]);
      const newState = taskReducer(previousState, action);
      expect(newState.task_list).toEqual([]);
      expect(newState.display_tasks).toEqual([]);
    });
  });

  // --- Test setDisplayTasks ---
  describe('setDisplayTasks', () => {
    it('should only set display_tasks, leaving task_list unchanged', () => {
      const masterList = [sampleTask1, sampleTask2];
      const previousState = {
        task_list: masterList,
        display_tasks: masterList,
      };
      const tasksToDisplay = [sampleTask1];
      const action = setDisplayTasks(tasksToDisplay);
      const newState = taskReducer(previousState, action);
      expect(newState.display_tasks).toEqual(tasksToDisplay);
      expect(newState.task_list).toEqual(masterList); // Should remain unchanged
    });

    it('should set display_tasks to an empty array', () => {
      const masterList = [sampleTask1, sampleTask2];
      const previousState = {
        task_list: masterList,
        display_tasks: masterList,
      };
      const action = setDisplayTasks([]);
      const newState = taskReducer(previousState, action);
      expect(newState.display_tasks).toEqual([]);
      expect(newState.task_list).toEqual(masterList);
    });
  });

  // --- Test addTask ---
  describe('addTask', () => {
    it('should add a new task to both task_list and display_tasks when initially empty', () => {
      const action = addTask(sampleTask1);
      const newState = taskReducer(initialState, action);
      expect(newState.task_list).toEqual([sampleTask1]);
      expect(newState.display_tasks).toEqual([sampleTask1]);
    });

    it('should add a new task to existing lists', () => {
      const previousState = {
        task_list: [sampleTask1],
        display_tasks: [sampleTask1],
      };
      const action = addTask(sampleTask2);
      const newState = taskReducer(previousState, action);
      expect(newState.task_list).toEqual([sampleTask1, sampleTask2]);
      expect(newState.display_tasks).toEqual([sampleTask1, sampleTask2]);
    });
  });

  // --- Test toggleCompleteTask ---
  describe('toggleCompleteTask', () => {
    it('should toggle is_completed status and update completed_timestamp for a task in both lists', () => {
      const previousState = {
        task_list: [sampleTask1, sampleTask2],
        display_tasks: [sampleTask1, sampleTask2],
      };
      const action = toggleCompleteTask(sampleTask1.id);
      const newState = taskReducer(previousState, action);

      // Check task_list
      expect(newState.task_list.find(t => t.id === sampleTask1.id)?.is_completed).toBe(true);
      expect(newState.task_list.find(t => t.id === sampleTask1.id)?.completed_timestamp).toEqual(expect.any(String));
      expect(newState.task_list.find(t => t.id === sampleTask2.id)?.is_completed).toBe(false); // Unchanged

      // Check display_tasks
      expect(newState.display_tasks.find(t => t.id === sampleTask1.id)?.is_completed).toBe(true);
      expect(newState.display_tasks.find(t => t.id === sampleTask1.id)?.completed_timestamp).toEqual(expect.any(String));
      expect(newState.display_tasks.find(t => t.id === sampleTask2.id)?.is_completed).toBe(false); // Unchanged
    });

    it('should toggle a completed task back to incomplete and nullify timestamp', () => {
      const task1CompletedWithTimestamp = {
        ...sampleTask1,
        is_completed: true,
        completed_timestamp: new Date().toISOString()
      };
      const previousState = {
        task_list: [task1CompletedWithTimestamp, sampleTask2],
        display_tasks: [task1CompletedWithTimestamp, sampleTask2],
      };
      const action = toggleCompleteTask(sampleTask1.id);
      const newState = taskReducer(previousState, action);

      expect(newState.task_list.find(t => t.id === sampleTask1.id)?.is_completed).toBe(false);
      expect(newState.task_list.find(t => t.id === sampleTask1.id)?.completed_timestamp).toBeNull();
      expect(newState.display_tasks.find(t => t.id === sampleTask1.id)?.is_completed).toBe(false);
      expect(newState.display_tasks.find(t => t.id === sampleTask1.id)?.completed_timestamp).toBeNull();
    });

    it('should do nothing if task ID is not found', () => {
      const previousState = {
        task_list: [sampleTask1],
        display_tasks: [sampleTask1],
      };
      const action = toggleCompleteTask('nonexistent-id');
      const newState = taskReducer(previousState, action);
      expect(newState).toEqual(previousState); // State should be unchanged
    });

    it('should correctly toggle a task if display_tasks is a subset of task_list', () => {
        const previousState = {
          task_list: [sampleTask1, sampleTask2], // master list
          display_tasks: [sampleTask1],        // filtered list
        };
        const action = toggleCompleteTask(sampleTask1.id);
        const newState = taskReducer(previousState, action);

        // Check task_list
        expect(newState.task_list.find(t => t.id === sampleTask1.id)?.is_completed).toBe(true);
        expect(newState.task_list.find(t => t.id === sampleTask1.id)?.completed_timestamp).toEqual(expect.any(String));
        // Check display_tasks
        expect(newState.display_tasks.find(t => t.id === sampleTask1.id)?.is_completed).toBe(true);
        expect(newState.display_tasks.find(t => t.id === sampleTask1.id)?.completed_timestamp).toEqual(expect.any(String));
        // Ensure task2 in task_list is untouched
        expect(newState.task_list.find(t => t.id === sampleTask2.id)?.is_completed).toBe(false);
      });
  });
});
