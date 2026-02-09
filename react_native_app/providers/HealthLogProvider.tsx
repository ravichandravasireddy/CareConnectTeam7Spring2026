// =============================================================================
// HEALTH LOG PROVIDER
// =============================================================================
// Holds all HealthLog entries; used by Health Logs screen and Health Log Add.
// latestByType drives "Latest by type" cards (today only).
// =============================================================================

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { HealthLog, HealthLogType } from '../models/HealthLog';
import { AppColors } from '../constants/theme';

export const DEFAULT_WATER_GOAL_OZ = 64;

interface HealthLogContextType {
  logs: HealthLog[];
  latestByType: Record<HealthLogType, HealthLog | undefined>;
  addLog: (log: HealthLog) => void;
  removeLog: (id: string) => void;
  waterTotalForDate: (date: Date) => number;
  typeColors: (type: HealthLogType) => { bg: string; fg: string };
}

const HealthLogContext = createContext<HealthLogContextType | undefined>(undefined);

export const useHealthLogProvider = () => {
  const context = useContext(HealthLogContext);
  if (!context) throw new Error('useHealthLogProvider must be used within HealthLogProvider');
  return context;
};

function todayStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function dateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function typeColors(type: HealthLogType): { bg: string; fg: string } {
  switch (type) {
    case HealthLogType.mood:
      return { bg: AppColors.success100, fg: AppColors.success700 };
    case HealthLogType.symptoms:
      return { bg: AppColors.error100, fg: AppColors.error700 };
    case HealthLogType.meals:
      return { bg: AppColors.warning100, fg: AppColors.warning700 };
    case HealthLogType.water:
      return { bg: AppColors.info100, fg: AppColors.info700 };
    case HealthLogType.exercise:
      return { bg: AppColors.secondary100, fg: AppColors.secondary700 };
    case HealthLogType.sleep:
      return { bg: AppColors.accent100, fg: AppColors.accent600 };
    case HealthLogType.general:
      return { bg: AppColors.gray100, fg: AppColors.gray700 };
    case HealthLogType.bloodPressure:
      return { bg: AppColors.error100, fg: AppColors.error700 };
    case HealthLogType.heartRate:
      return { bg: AppColors.primary100, fg: AppColors.primary700 };
  }
}

interface HealthLogProviderProps {
  children: ReactNode;
}

export const HealthLogProvider: React.FC<HealthLogProviderProps> = ({ children }) => {
  const [logs, setLogs] = useState<HealthLog[]>(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const mockLogs: HealthLog[] = [
      {
        id: 'mood-1',
        type: HealthLogType.mood,
        description: 'Happy',
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
        emoji: '😊',
        note: 'Feeling energized this morning.',
      },
      {
        id: 'meal-1',
        type: HealthLogType.meals,
        description: 'Oatmeal with berries',
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 15),
      },
      {
        id: 'water-1',
        type: HealthLogType.water,
        description: 'Added 48 oz. Total 48 oz',
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 45),
        waterTotal: 48,
        waterDelta: 48,
        waterGoal: DEFAULT_WATER_GOAL_OZ,
      },
      {
        id: 'symptom-1',
        type: HealthLogType.symptoms,
        description: 'Mild headache',
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      },
      {
        id: 'blood-pressure-1',
        type: HealthLogType.bloodPressure,
        description: 'Blood Pressure: 120/80 mmHg',
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        systolic: 120,
        diastolic: 80,
      },
    ];
    return mockLogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  const today = useMemo(() => todayStart(), []);

  const latestByType = useMemo(() => {
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const map: Partial<Record<HealthLogType, HealthLog>> = {};
    logs.forEach((log) => {
      const logDay = dateOnly(log.createdAt).getTime();
      if (logDay !== todayOnly) return;
      const existing = map[log.type];
      if (!existing || log.createdAt.getTime() > existing.createdAt.getTime()) {
        map[log.type] = log;
      }
    });
    return map as Record<HealthLogType, HealthLog | undefined>;
  }, [logs, today]);

  const addLog = useCallback((log: HealthLog) => {
    setLogs((prev) => [log, ...prev].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  }, []);

  const removeLog = useCallback((id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const waterTotalForDate = useCallback((date: Date) => {
    const day = dateOnly(date).getTime();
    const waterLogs = logs
      .filter((l) => l.type === HealthLogType.water && dateOnly(l.createdAt).getTime() === day)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (waterLogs.length === 0) return 0;
    return waterLogs[0].waterTotal ?? 0;
  }, [logs]);

  const value: HealthLogContextType = {
    logs,
    latestByType,
    addLog,
    removeLog,
    waterTotalForDate,
    typeColors,
  };

  return <HealthLogContext.Provider value={value}>{children}</HealthLogContext.Provider>;
};
