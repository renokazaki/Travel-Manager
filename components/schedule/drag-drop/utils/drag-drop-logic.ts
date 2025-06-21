import { PendingEvent, ScheduleData, ScheduleDay, ScheduleEvent } from "@/types/types";
import { DragStartEvent, DragOverEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { utils } from "./drag-drop-functions";

// ドラッグ&ドロップロジック
export const useDragAndDropLogic = (initialData: ScheduleData, onDataChange?: (data: ScheduleData) => void) => {
    const [data, setData] = useState<ScheduleData>(initialData);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  
    const findContainer = (id: UniqueIdentifier): string | null => {
      if (data.pendingEvents.find(item => item.id === id)) {
        return 'pending-events';
      }
      
      for (const day of data.scheduledDays) {
        if (day.events.find(item => item.id === id)) {
          return day.id;
        }
      }
      
      return null;
    };
  
    const activeItem = useMemo(() => {
      if (!activeId) return null;
      return [...data.pendingEvents, ...data.scheduledDays.flatMap(d => d.events)]
        .find(item => item.id === activeId);
    }, [activeId, data]);
  
    const handleDragStart = (event: DragStartEvent) => {
      setActiveId(event.active.id);
    };
  
    const handleDragOver = (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) {
        setOverId(null);
        return;
      }
  
      const overContainer = over.id === 'pending-events' || data.scheduledDays.some(d => d.id === over.id) 
        ? over.id 
        : findContainer(over.id);
  
      setOverId(overContainer);
    };
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setOverId(null);
  
      if (!over) return;
  
      const activeContainer = findContainer(active.id);
      let overContainer: string | null = null;
      let insertIndex: number | null = null;
  
      if (over.id === 'pending-events' || data.scheduledDays.some(d => d.id === over.id)) {
        overContainer = over.id as string;
        insertIndex = null;
      } else {
        overContainer = findContainer(over.id);
        if (overContainer) {
          if (overContainer === 'pending-events') {
            insertIndex = data.pendingEvents.findIndex(item => item.id === over.id);
          } else {
            const day = data.scheduledDays.find(d => d.id === overContainer);
            if (day) {
              insertIndex = day.events.findIndex(item => item.id === over.id);
            }
          }
        }
      }
  
      if (!activeContainer || !overContainer) return;
  
      setData(prev => {
        const newData = { ...prev };
  
        if (activeContainer === overContainer) {
          // 同じコンテナ内での並び替え
          if (activeContainer === 'pending-events') {
            const oldIndex = newData.pendingEvents.findIndex(item => item.id === active.id);
            const newIndex = insertIndex !== null ? insertIndex : newData.pendingEvents.length - 1;
            if (oldIndex !== -1 && oldIndex !== newIndex) {
              newData.pendingEvents = arrayMove(newData.pendingEvents, oldIndex, newIndex);
            }
          } else {
            const dayIndex = newData.scheduledDays.findIndex(d => d.id === activeContainer);
            if (dayIndex !== -1) {
              const oldIndex = newData.scheduledDays[dayIndex].events.findIndex(item => item.id === active.id);
              const newIndex = insertIndex !== null ? insertIndex : newData.scheduledDays[dayIndex].events.length - 1;
              if (oldIndex !== -1 && oldIndex !== newIndex) {
                newData.scheduledDays[dayIndex].events = arrayMove(
                  newData.scheduledDays[dayIndex].events,
                  oldIndex,
                  newIndex
                );
                newData.scheduledDays[dayIndex].events.forEach((e, i) => e.order = i);
              }
            }
          }
        } else {
          // 異なるコンテナ間での移動
          let activeItem: ScheduleEvent | PendingEvent | null = null;
  
          if (activeContainer === 'pending-events') {
            const index = newData.pendingEvents.findIndex(item => item.id === active.id);
            if (index !== -1) {
              activeItem = newData.pendingEvents[index];
              newData.pendingEvents.splice(index, 1);
            }
          } else {
            const dayIndex = newData.scheduledDays.findIndex(d => d.id === activeContainer);
            if (dayIndex !== -1) {
              const eventIndex = newData.scheduledDays[dayIndex].events.findIndex(item => item.id === active.id);
              if (eventIndex !== -1) {
                activeItem = newData.scheduledDays[dayIndex].events[eventIndex];
                newData.scheduledDays[dayIndex].events.splice(eventIndex, 1);
                newData.scheduledDays[dayIndex].events.forEach((e, i) => e.order = i);
              }
            }
          }
  
          if (!activeItem) return prev;
  
          if (overContainer === 'pending-events') {
            const pendingEvent: PendingEvent = {
              id: activeItem.id,
              title: activeItem.title,
              location: activeItem.location,
              type: activeItem.type,
              notes: activeItem.notes,
              estimatedDuration: 'duration' in activeItem ? activeItem.duration : (activeItem as PendingEvent).estimatedDuration,
              priority: 'priority' in activeItem ? activeItem.priority : 'medium',
              suggestedBy: 'suggestedBy' in activeItem ? activeItem.suggestedBy : 'ユーザー'
            };
            
            if (insertIndex !== null && insertIndex >= 0) {
              newData.pendingEvents.splice(insertIndex, 0, pendingEvent);
            } else {
              newData.pendingEvents.push(pendingEvent);
            }
          } else {
            const scheduleEvent: ScheduleEvent = {
              id: activeItem.id,
              title: activeItem.title,
              location: activeItem.location,
              type: activeItem.type,
              notes: activeItem.notes,
              time: 'time' in activeItem ? activeItem.time : '',
              duration: 'duration' in activeItem ? activeItem.duration : (activeItem as PendingEvent).estimatedDuration || 60,
              order: 0
            };
            
            const dayIndex = newData.scheduledDays.findIndex(d => d.id === overContainer);
            if (dayIndex !== -1) {
              if (insertIndex !== null && insertIndex >= 0) {
                newData.scheduledDays[dayIndex].events.splice(insertIndex, 0, scheduleEvent);
              } else {
                newData.scheduledDays[dayIndex].events.push(scheduleEvent);
              }
              newData.scheduledDays[dayIndex].events.forEach((e, i) => e.order = i);
            }
          }
        }
  
        return newData;
      });
  
      onDataChange?.(data);
    }
    const addNewDay = () => {
      const newDayId = utils.generateNewDayId(data.scheduledDays);
      const newDate = utils.generateNewDate(data.scheduledDays);
      
      const newDay: ScheduleDay = {
        id: newDayId,
        date: newDate,
        events: []
      };
  
      setData(prev => ({
        ...prev,
        scheduledDays: [...prev.scheduledDays, newDay]
      }));
  
      onDataChange?.({
        ...data,
        scheduledDays: [...data.scheduledDays, newDay]
      });
    };
  
    const removeDay = (dayId: string) => {
      setData(prev => ({
        ...prev,
        scheduledDays: prev.scheduledDays.filter(day => day.id !== dayId)
      }));
  
      onDataChange?.({
        ...data,
        scheduledDays: data.scheduledDays.filter(day => day.id !== dayId)
      });
    };
  
    return {
      data,
      activeId,
      overId,
      activeItem,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
      addNewDay,
      removeDay
    };
  };