import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import EventCard from './EventCard';
import type { ScheduleEvent, ScheduleDay } from './types/type';

type DroppableContainerProps = {
  id: string;
  title: string;
  events: ScheduleEvent[];
  isOver?: boolean;
  onRemove?: () => void;
  showAddButton?: boolean;
  onAdd?: () => void;
};

export default function DroppableContainer({ 
  id, 
  title, 
  events, 
  isOver = false,
  onRemove,
  showAddButton = false,
  onAdd
}: DroppableContainerProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      className={`
        min-h-[200px] p-4 rounded-lg border-2 border-dashed
        transition-all duration-200
        ${isOver 
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'
        }
      `}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-lg">{title}</h3>
          <span className="text-sm text-gray-500">({events.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          {showAddButton && onAdd && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAdd}
              className="h-8 w-8 p-0"
            >
              日付を追加
              <Plus className="h-4 w-4" />
            </Button>
          )}
          
          {onRemove && events.length === 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ドロップエリア */}
      <div ref={setNodeRef} className="min-h-[120px]">
        <SortableContext items={events.map(e => e.id)} strategy={verticalListSortingStrategy}>
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Calendar className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">イベントをここにドラッグ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

// 日程専用のコンテナ
type DayContainerProps = {
  day: ScheduleDay;
  isOver?: boolean;
  onRemove: (dayId: string) => void;
};

export function DayContainer({ day, isOver, onRemove }: DayContainerProps) {
  const formattedDate = new Date(day.date).toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <DroppableContainer
      id={day.id}
      title={formattedDate}
      events={day.events}
      isOver={isOver}
      onRemove={day.events.length === 0 ? () => onRemove(day.id) : undefined}
    />
  );
}

// 候補イベント専用のコンテナ
type PendingContainerProps = {
  events: ScheduleEvent[];
  isOver?: boolean;
  onAddDay: () => void;
};

export function PendingContainer({ events, isOver, onAddDay }: PendingContainerProps) {
  return (
    <DroppableContainer
      id="pending-events"
      title="候補イベント"
      events={events}
      isOver={isOver}
      showAddButton={true}
      onAdd={onAddDay}
    />
  );
}