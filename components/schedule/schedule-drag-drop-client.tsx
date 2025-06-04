"use client";
import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, Calendar } from "lucide-react";
import {
  ScheduleEvent,
  PendingEvent,
  mockScheduleData,
  Props,
} from "@/lib/mockdeta";
import { utils } from "./drag-drop/utils/drag-drop-functions";
import { DayCard, PendingEventsPanel } from "./drag-drop/pending-event";
import { useDragAndDropLogic } from "./drag-drop/utils/drag-drop-logic";

// 新しい日付追加ボタン
const AddNewDayCard = ({ onAddDay }: { onAddDay: () => void }) => {
  return (
    <Card className="min-h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center h-full">
        <div className="rounded-full bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/50 dark:to-teal-900/50 p-3 mb-4 shadow-inner">
          <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">新しい日程を追加</h3>
        <p className="text-muted-foreground mb-6 text-sm">
          旅行の日程を追加して、より詳細な計画を立てましょう
        </p>
        <Button
          onClick={onAddDay}
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" /> 日程追加
        </Button>
      </CardContent>
    </Card>
  );
};

// ドラッグオーバーレイ
const DragOverlay_Item = ({ item }: { item: ScheduleEvent | PendingEvent }) => {
  const Icon = utils.getEventIcon(item.type);
  const colors = utils.getEventColors(item.type);
  const isPending = "priority" in item;

  return (
    <div
      className={`p-3 rounded-lg border transition-all duration-200 ${colors} ${
        isPending ? "border-dashed" : ""
      } opacity-90 transform rotate-2 scale-105 shadow-xl`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        <div className="p-1 rounded">
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{item.title}</h4>
            {!isPending && (item as ScheduleEvent).time && (
              <Badge variant="outline" className="text-xs">
                {(item as ScheduleEvent).time}
              </Badge>
            )}
            {isPending && (
              <Badge
                className={utils.getPriorityColor(
                  (item as PendingEvent).priority
                )}
                variant="secondary"
              >
                {(item as PendingEvent).priority === "high"
                  ? "高"
                  : (item as PendingEvent).priority === "medium"
                  ? "中"
                  : "低"}
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground">{item.location}</p>
        </div>
      </div>
    </div>
  );
};

// メインコンポーネント
export default function CleanScheduleManager({
  scheduleData = mockScheduleData,
  onDataChange,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  const {
    data,
    activeId,
    overId,
    activeItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    addNewDay,
    removeDay,
  } = useDragAndDropLogic(scheduleData, onDataChange);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {data.tripName} - スケジュール調整
        </h1>
        <p className="text-muted-foreground">
          ドラッグ&ドロップでスケジュールを作成し、新しい日程を追加できます
        </p>
        {activeId && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              🎯 ドラッグ中: {activeItem?.title}
            </p>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* スケジュール表示エリア */}
          <div className="lg:col-span-3 space-y-6">
            {data.scheduledDays.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                events={day.events.sort((a, b) => a.order - b.order)}
                isOver={overId === day.id}
                onRemoveDay={removeDay}
              />
            ))}

            {/* 新しい日程追加ボタン */}
            <AddNewDayCard onAddDay={addNewDay} />
          </div>

          {/* 候補イベントパネル */}
          <div className="lg:col-span-1">
            <PendingEventsPanel
              events={data.pendingEvents}
              isOver={overId === "pending-events"}
            />
          </div>
        </div>

        {/* ドラッグオーバーレイ */}
        <DragOverlay>
          {activeItem ? <DragOverlay_Item item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
