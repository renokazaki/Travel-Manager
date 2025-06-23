'use client';

import { useState, useTransition } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSchedule } from './ScheduleContext';
import { DayContainer, PendingContainer } from './DroppableContainer';
import EventCard from './EventCard';
import { saveScheduleData, revalidateSchedule } from './lib/schedule';
import type { ScheduleEvent } from './types/type';

export default function ScheduleClient() {
  const {
    data,
    moveEventToPending,
    moveEventToDay,
    reorderEventsInDay,
    reorderPendingEvents,
    addNewDay,
    removeDayIfEmpty,
    hasUnsavedChanges,
    getUpdatesForSave
  } = useSchedule();

  const [activeEvent, setActiveEvent] = useState<ScheduleEvent | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ドラッグセンサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // アクティブなイベントを探す
  const findActiveEvent = (id: string): ScheduleEvent | null => {
    // 候補イベントから探す
    const pendingEvent = data.pendingEvents.find(event => event.id === id);
    if (pendingEvent) return pendingEvent;

    // 日程のイベントから探す
    for (const day of data.scheduledDays) {
      const event = day.events.find(event => event.id === id);
      if (event) return event;
    }

    return null;
  };

  // コンテナIDを探す
  const findContainer = (id: string): string | null => {
    if (data.pendingEvents.some(event => event.id === id)) {
      return 'pending-events';
    }

    for (const day of data.scheduledDays) {
      if (day.events.some(event => event.id === id)) {
        return day.id;
      }
    }

    return null;
  };

  // ドラッグ開始
  const handleDragStart = (event: DragStartEvent) => {
    const activeEvent = findActiveEvent(event.active.id as string);
    setActiveEvent(activeEvent);
  };

  // ドラッグオーバー
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    if (over) {
      // 直接コンテナにオーバーしている場合
      if (over.id === 'pending-events' || over.id.toString().startsWith('day-')) {
        setOverId(over.id as string);
      } else {
        // イベントの上にオーバーしている場合、そのコンテナを特定
        const containerId = findContainer(over.id as string);
        setOverId(containerId);
      }
    } else {
      setOverId(null);
    }
  };

  // ドラッグ終了
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveEvent(null);
    setOverId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // アクティブなコンテナを特定
    const activeContainer = findContainer(activeId);
    if (!activeContainer) return;

    // オーバーしているコンテナを特定
    let overContainer: string;
    if (overId === 'pending-events' || overId.startsWith('day-')) {
      overContainer = overId;
    } else {
      overContainer = findContainer(overId) || 'pending-events';
    }

    // 同じコンテナ内での並び替え
    if (activeContainer === overContainer) {
      if (activeContainer === 'pending-events') {
        const oldIndex = data.pendingEvents.findIndex(event => event.id === activeId);
        const newIndex = data.pendingEvents.findIndex(event => event.id === overId);
        
        if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
          reorderPendingEvents(oldIndex, newIndex);
        }
      } else {
        // 日程内での並び替え
        const day = data.scheduledDays.find(d => d.id === activeContainer);
        if (day) {
          const oldIndex = day.events.findIndex(event => event.id === activeId);
          const newIndex = day.events.findIndex(event => event.id === overId);
          
          if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
            reorderEventsInDay(activeContainer, oldIndex, newIndex);
          }
        }
      }
    } else {
      // 異なるコンテナ間での移動
      if (overContainer === 'pending-events') {
        moveEventToPending(activeId);
      } else {
        // 日程への移動
        let insertIndex: number | undefined;
        
        // 特定のイベントの上にドロップした場合、その位置に挿入
        if (overId !== overContainer) {
          const targetDay = data.scheduledDays.find(d => d.id === overContainer);
          if (targetDay) {
            insertIndex = targetDay.events.findIndex(event => event.id === overId);
          }
        }
        
        moveEventToDay(activeId, overContainer, insertIndex);
      }
    }
  };

  // 保存処理
  const handleSave = () => {
    if (!hasUnsavedChanges()) {
      toast.info('変更がありません');
      return;
    }

    startTransition(async () => {
      try {
        const updates = getUpdatesForSave();
        const result = await saveScheduleData(updates);
        
        if (result.success) {
          toast.success('スケジュールを保存しました');
          await revalidateSchedule(data.tripId);
        } else {
          toast.error('保存に失敗しました', {
            description: result.error
          });
        }
      } catch (error) {
        toast.error('保存中にエラーが発生しました');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{data.tripName} - スケジュール調整</h1>
          <p className="text-gray-600 mt-1">
            ドラッグ&ドロップでイベントを整理し、「これで登録」ボタンで保存します
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges() && (
            <span className="text-sm text-orange-600 font-medium">
              未保存の変更があります
            </span>
          )}
          
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges() || isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            これで登録
          </Button>
        </div>
      </div>

      {/* ドラッグ&ドロップコンテキスト */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 候補イベント */}
          <div className="lg:col-span-1">
            <PendingContainer
              events={data.pendingEvents}
              isOver={overId === 'pending-events'}
              onAddDay={addNewDay}
            />
          </div>

          {/* スケジュール */}
          <div className="lg:col-span-3 space-y-4">
            {data.scheduledDays.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">日程がありません</p>
                <Button onClick={addNewDay} variant="outline">
                  最初の日程を追加
                </Button>
              </div>
            ) : (
              data.scheduledDays.map((day) => (
                <DayContainer
                  key={day.id}
                  day={day}
                  isOver={overId === day.id}
                  onRemove={removeDayIfEmpty}
                />
              ))
            )}
          </div>
        </div>

        {/* ドラッグオーバーレイ */}
        <DragOverlay>
          {activeEvent ? (
            <div className="transform rotate-3 scale-105">
              <EventCard event={activeEvent} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}