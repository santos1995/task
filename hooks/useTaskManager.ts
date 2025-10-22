import { useState, useEffect, useCallback } from 'react';
import { Task, NewTask } from '../types';

const LOCAL_STORAGE_KEY = 'intellitask-tasks';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const storedTasks = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Error reading tasks from local storage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to local storage', error);
    }
  }, [tasks]);

  const addTask = useCallback((newTaskData: NewTask) => {
    const task: Task = {
      ...newTaskData,
      id: self.crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [...prevTasks, task]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const isCompleted = !task.completed;
          return {
            ...task,
            completed: isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  }, []);

  return { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion };
};