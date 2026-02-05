// =============================================================================
// NOTIFICATION PROVIDER
// =============================================================================
// Holds NotificationItem list and groups them by date for NotificationScreen.
// notificationSections drives the "Today" / "Yesterday" / date headers.
// Tap handling should use NotificationItem.destinationRoute for navigation.
// =============================================================================

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { NotificationItem, NotificationType } from '../models/NotificationItem';

export interface NotificationSection {
  label: string;
  items: NotificationItem[];
}

interface NotificationContextType {
  notifications: NotificationItem[];
  notificationSections: NotificationSection[];
  unreadCount: number;
  markAsRead: (item: NotificationItem) => void;
  markAllAsRead: () => void;
  addNotification: (item: NotificationItem) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationProvider = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationProvider must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    // Initialize with mock notifications
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'today-1',
        title: 'Medication Reminder',
        summary: 'Time to take your Lisinopril 10mg',
        type: NotificationType.medication,
        createdAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
        isRead: false,
        taskId: '6', // Link to task ID 6 (Morning Medication)
      },
      {
        id: 'today-2',
        title: 'Task Reminder',
        summary: 'Time for your breakfast',
        type: NotificationType.generalReminder,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        taskId: '6', // Link to task ID 6
      },
      {
        id: 'today-3',
        title: 'New Message',
        summary: 'Dr. Helen Nowinski: Your test results look great!',
        type: NotificationType.message,
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: false,
      },
      {
        id: 'yesterday-1',
        title: 'Appointment Reminder',
        summary: 'Virtual appointment with Dr. Johnson tomorrow at 3:00 PM',
        type: NotificationType.appointment,
        createdAt: new Date(yesterday.getTime() + 17 * 60 * 60 * 1000),
        isRead: true,
        taskId: '3', // Link to task ID 3 (Doctor Appointment)
      },
      {
        id: 'yesterday-2',
        title: 'Health Reminder',
        summary: "Don't forget to log your blood pressure reading",
        type: NotificationType.healthReminder,
        createdAt: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000),
        isRead: false,
        taskId: '7', // Link to task ID 7 (Blood Pressure Check)
      },
      {
        id: '2-days-ago-1',
        title: 'Task Reminder',
        summary: 'Video call with Sarah Johnson (Caregiver)',
        type: NotificationType.generalReminder,
        createdAt: new Date(twoDaysAgo.getTime() + 8 * 60 * 60 * 1000),
        isRead: true,
        taskId: '8', // Link to task ID 8 (Virtual Appointment)
      },
    ];
  });

  const notificationSections = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    const byDate = new Map<number, NotificationItem[]>();
    for (const n of notifications) {
      const date = new Date(n.createdAt.getFullYear(), n.createdAt.getMonth(), n.createdAt.getDate());
      const dateKey = date.getTime();
      if (!byDate.has(dateKey)) {
        byDate.set(dateKey, []);
      }
      byDate.get(dateKey)!.push(n);
    }

    // Sort items within each date (newest first)
    for (const list of byDate.values()) {
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Sort dates (newest first)
    const dates = Array.from(byDate.keys()).sort((a, b) => b - a);
    const sections: NotificationSection[] = [];
    
    for (const dateKey of dates) {
      const items = byDate.get(dateKey)!;
      const date = new Date(dateKey);
      let label: string;
      
      if (date.getTime() === todayStart.getTime()) {
        label = 'Today';
      } else if (date.getTime() === yesterdayStart.getTime()) {
        label = 'Yesterday';
      } else {
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      
      sections.push({ label, items });
    }
    
    return sections;
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const markAsRead = useCallback((item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id && !n.isRead ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback((item: NotificationItem) => {
    setNotifications((prev) => [item, ...prev]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = {
    notifications,
    notificationSections,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
