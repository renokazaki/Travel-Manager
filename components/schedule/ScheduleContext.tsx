'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ScheduleData, ScheduleEvent, ScheduleDay } from './types/type';
import { EventStatus } from '@prisma/client';

type ScheduleContextType = {
  data: ScheduleData;
  updateData: (newData: ScheduleData) => void;
  moveEventToPending: (eventId: string) => void;
  moveEventToDay: (eventId: string, dayId: string, insertIndex?: number) => void;
  reorderEventsInDay: (dayId: string, startIndex: number, endIndex: number) => void;
  reorderPendingEvents: (startIndex: number, endIndex: number) => void;
  addNewDay: () => void;
  removeDayIfEmpty: (dayId: string) => void;
  hasUnsavedChanges: () => boolean;
  getUpdatesForSave: () => { eventUpdates: { id: string; status: EventStatus; date: string | null; order: number | null; }[] };
};

const ScheduleContext = createContext<ScheduleContextType | null>(null);

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within ScheduleProvider');
  }
  return context;
}

type ScheduleProviderProps = {
  children: ReactNode;
  initialData: ScheduleData;
};

export function ScheduleProvider({ children, initialData }: ScheduleProviderProps) {
  const [data, setData] = useState<ScheduleData>(initialData);
  const [originalData] = useState<ScheduleData>(initialData);

  const updateData = useCallback((newData: ScheduleData) => {
    setData(newData);
  }, []);

  // イベントを候補リストに移動
  const moveEventToPending = useCallback((eventId: string) => {
    setData(current => {
      const newData = { ...current };
      let eventToMove: ScheduleEvent | null = null;

      // 日程からイベントを削除
      newData.scheduledDays = newData.scheduledDays.map(day => ({
        ...day,
        events: day.events.filter(event => {
          if (event.id === eventId) {
            eventToMove = { ...event, status: EventStatus.PENDING, date: null, order: null };
            return false;
          }
          return true;
        }).map((event, index) => ({ ...event, order: index }))
      }));

      // 候補リストに追加
      if (eventToMove) {
        newData.pendingEvents = [...newData.pendingEvents, eventToMove];
      }

      return newData;
    });
  }, []);

  // イベントを日程に移動
  const moveEventToDay = useCallback((eventId: string, dayId: string, insertIndex?: number) => {
    setData(current => {
      const newData = { ...current };
      let eventToMove: ScheduleEvent | null = null;
      const targetDate = dayId.replace('day-', '');

      // 候補リストからイベントを削除
      newData.pendingEvents = newData.pendingEvents.filter(event => {
        if (event.id === eventId) {
          eventToMove = { ...event, status: EventStatus.SCHEDULED, date: targetDate };
          return false;
        }
        return true;
      });

      // 他の日程からイベントを削除（既にスケジュール済みの場合）
      if (!eventToMove) {
        newData.scheduledDays = newData.scheduledDays.map(day => ({
          ...day,
          events: day.events.filter(event => {
            if (event.id === eventId) {
              eventToMove = { ...event, status: EventStatus.SCHEDULED, date: targetDate };
              return false;
            }
            return true;
          }).map((event, index) => ({ ...event, order: index }))
        }));
      }

      // 目標の日程に追加
      newData.scheduledDays = newData.scheduledDays.map(day => {
        if (day.id === dayId && eventToMove) {
          const newEvents = [...day.events];
          if (insertIndex !== undefined && insertIndex >= 0) {
            newEvents.splice(insertIndex, 0, eventToMove);
          } else {
            newEvents.push(eventToMove);
          }
          return {
            ...day,
            events: newEvents.map((event, index) => ({ ...event, order: index }))
          };
        }
        return day;
      });

      return newData;
    });
  }, []);

  // 日程内でイベントを並び替え
  const reorderEventsInDay = useCallback((dayId: string, startIndex: number, endIndex: number) => {
    setData(current => {
      const newData = { ...current };
      
      newData.scheduledDays = newData.scheduledDays.map(day => {
        if (day.id === dayId) {
          const newEvents = [...day.events];
          const [movedEvent] = newEvents.splice(startIndex, 1);
          newEvents.splice(endIndex, 0, movedEvent);
          
          return {
            ...day,
            events: newEvents.map((event, index) => ({ ...event, order: index }))
          };
        }
        return day;
      });

      return newData;
    });
  }, []);

  // 候補イベントを並び替え
  const reorderPendingEvents = useCallback((startIndex: number, endIndex: number) => {
    setData(current => {
      const newEvents = [...current.pendingEvents];
      const [movedEvent] = newEvents.splice(startIndex, 1);
      newEvents.splice(endIndex, 0, movedEvent);
      
      return {
        ...current,
        pendingEvents: newEvents
      };
    });
  }, []);

  // 新しい日程を追加
  const addNewDay = useCallback(() => {
    setData(current => {
      const today = new Date().toISOString().split('T')[0];
      const existingDates = current.scheduledDays.map(day => day.date);
      
      let newDate = today;
      let counter = 0;
      while (existingDates.includes(newDate)) {
        counter++;
        const date = new Date(today);
        date.setDate(date.getDate() + counter);
        newDate = date.toISOString().split('T')[0];
      }

      const newDay: ScheduleDay = {
        id: `day-${newDate}`,
        date: newDate,
        events: []
      };

      return {
        ...current,
        scheduledDays: [...current.scheduledDays, newDay]
      };
    });
  }, []);

  // 空の日程を削除
  const removeDayIfEmpty = useCallback((dayId: string) => {
    setData(current => {
      const dayToRemove = current.scheduledDays.find(day => day.id === dayId);
      if (dayToRemove && dayToRemove.events.length === 0) {
        return {
          ...current,
          scheduledDays: current.scheduledDays.filter(day => day.id !== dayId)
        };
      }
      return current;
    });
  }, []);

  // 未保存の変更があるかチェック
  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(data) !== JSON.stringify(originalData);
  }, [data, originalData]);

  // 保存用のデータを取得
  const getUpdatesForSave = useCallback(() => {
    const updates: { id: string; status: EventStatus; date: string | null; order: number | null; }[] = [];

    // 候補イベント
    data.pendingEvents.forEach(event => {
      updates.push({
        id: event.id,
        status: EventStatus.PENDING,
        date: null,
        order: null
      });
    });

    // スケジュール済みイベント
    data.scheduledDays.forEach(day => {
      day.events.forEach(event => {
        updates.push({
          id: event.id,
          status: EventStatus.SCHEDULED,
          date: day.date,
          order: event.order
        });
      });
    });

    return { eventUpdates: updates };
  }, [data]);

  const value: ScheduleContextType = {
    data,
    updateData,
    moveEventToPending,
    moveEventToDay,
    reorderEventsInDay,
    reorderPendingEvents,
    addNewDay,
    removeDayIfEmpty,
    hasUnsavedChanges,
    getUpdatesForSave
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}