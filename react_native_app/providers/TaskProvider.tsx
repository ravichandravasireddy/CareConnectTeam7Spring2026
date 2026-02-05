// =============================================================================
// TASK PROVIDER
// =============================================================================
// Holds all Task entries; used by Calendar screen and HealthTimelineProvider.
// Use getScheduledTasksForDate / hasScheduledTasksForDate for calendar (excludes
// completed tasks). Use getTasksForDate when completed tasks should be included.
// =============================================================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Task, getTaskDateOnly, areDatesEqual, isTaskCompleted } from '../models/Task';
import { AppColors } from '../constants/theme';

interface TaskContextType {
  tasks: Task[];
  getTasksForDate: (date: Date) => Task[];
  getScheduledTasksForDate: (date: Date) => Task[];
  hasTasksForDate: (date: Date) => boolean;
  hasScheduledTasksForDate: (date: Date) => boolean;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  updateTask: (task: Task) => void;
  markCompleted: (taskId: string, at?: Date) => void;
  clearTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskProvider = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskProvider must be used within TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Initialize with mock tasks
    const now = new Date();
    
    return [
      {
        id: '1',
        title: 'Morning Medication',
        description: 'Administer morning dose with water and log adherence.',
        date: new Date(now.getFullYear(), now.getMonth(), 5, 9, 0),
        patientName: 'Mary Johnson',
        icon: 'medication',
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      },
      {
        id: '2',
        title: 'Physical Therapy',
        description: 'Guide light stretching and mobility exercises.',
        date: new Date(now.getFullYear(), now.getMonth(), 5, 10, 30),
        patientName: 'Robert Williams',
        icon: 'fitness-center',
        iconBackground: AppColors.success100,
        iconColor: AppColors.success700,
      },
      {
        id: '3',
        title: 'Doctor Appointment',
        description: 'Prepare questions and bring updated medication list.',
        date: new Date(now.getFullYear(), now.getMonth(), 12, 14, 0),
        patientName: 'Maya Patel',
        icon: 'local-hospital',
        iconBackground: AppColors.error100,
        iconColor: AppColors.error700,
      },
      {
        id: '4',
        title: 'Lab Results Review',
        description: 'Review latest lab results and note follow-up actions.',
        date: new Date(now.getFullYear(), now.getMonth(), 12, 11, 0),
        patientName: 'James Carter',
        icon: 'science',
        iconBackground: AppColors.info100,
        iconColor: AppColors.info700,
      },
      {
        id: '5',
        title: 'Medication Refill',
        description: 'Contact pharmacy and confirm refill pickup time.',
        date: new Date(now.getFullYear(), now.getMonth(), 18, 15, 0),
        patientName: 'Mary Johnson',
        icon: 'medication-liquid',
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      },
      {
        id: '6',
        title: 'Morning Medication',
        description: 'Check dosage schedule and record completion.',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
        patientName: 'Robert Williams',
        icon: 'medication',
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      },
      {
        id: '7',
        title: 'Blood Pressure Check',
        description: 'Measure BP and upload readings to the care plan.',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
        patientName: 'Maya Patel',
        icon: 'monitor-heart',
        iconBackground: AppColors.error100,
        iconColor: AppColors.error700,
      },
      {
        id: '8',
        title: 'Virtual Appointment',
        description: 'Join video consult and summarize key outcomes.',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0),
        patientName: 'Mary Johnson',
        icon: 'videocam',
        iconBackground: AppColors.accent100,
        iconColor: AppColors.accent600,
      },
      {
        id: '9',
        title: 'Follow-up Call',
        description: 'Call clinic to confirm next steps and reminders.',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0),
        patientName: 'Robert Williams',
        icon: 'phone',
        iconBackground: AppColors.warning100,
        iconColor: AppColors.warning700,
      },
      {
        id: '10',
        title: 'Follow-up Call',
        description: 'Confirm care plan updates and document notes.',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
        patientName: 'James Carter',
        icon: 'phone',
        iconBackground: AppColors.warning100,
        iconColor: AppColors.warning700,
        completedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0),
      },
      {
        id: '11',
        title: 'Video Call with Maya',
        description: 'Discuss today\'s care updates and share next steps.',
        date: new Date(now.getFullYear(), now.getMonth(), 12, 11, 0),
        patientName: 'Maya Patel',
        icon: 'phone',
        iconBackground: AppColors.warning100,
        iconColor: AppColors.warning700,
        completedAt: new Date(now.getFullYear(), now.getMonth(), 12, 11, 0),
      },
    ];
  });

  const getTasksForDate = useCallback((date: Date): Task[] => {
    const dateOnly = getTaskDateOnly(date);
    return tasks
      .filter((task) => areDatesEqual(getTaskDateOnly(task.date), dateOnly))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [tasks]);

  const getScheduledTasksForDate = useCallback((date: Date): Task[] => {
    const dateOnly = getTaskDateOnly(date);
    return tasks
      .filter(
        (task) =>
          areDatesEqual(getTaskDateOnly(task.date), dateOnly) &&
          !isTaskCompleted(task)
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [tasks]);

  const hasTasksForDate = useCallback((date: Date): boolean => {
    const dateOnly = getTaskDateOnly(date);
    return tasks.some((task) => areDatesEqual(getTaskDateOnly(task.date), dateOnly));
  }, [tasks]);

  const hasScheduledTasksForDate = useCallback((date: Date): boolean => {
    const dateOnly = getTaskDateOnly(date);
    return tasks.some(
      (task) =>
        areDatesEqual(getTaskDateOnly(task.date), dateOnly) &&
        !isTaskCompleted(task)
    );
  }, [tasks]);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const markCompleted = useCallback((taskId: string, at?: Date) => {
    const when = at ?? new Date();
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completedAt: when } : task
      )
    );
  }, []);

  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const value: TaskContextType = {
    tasks,
    getTasksForDate,
    getScheduledTasksForDate,
    hasTasksForDate,
    hasScheduledTasksForDate,
    addTask,
    removeTask,
    updateTask,
    markCompleted,
    clearTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
