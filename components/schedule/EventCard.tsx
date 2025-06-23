import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ScheduleEvent } from './types/type';
import { EventType, Priority } from '@prisma/client';

type EventCardProps = {
  event: ScheduleEvent;
};

// イベントタイプのアイコンとカラー
const getEventTypeInfo = (type: EventType | null) => {
  switch (type) {
    case EventType.ACCOMMODATION:
      return { icon: MapPin, color: 'bg-green-100 text-green-800 border-green-200' };
    case EventType.FOOD:
      return { icon: Clock, color: 'bg-orange-100 text-orange-800 border-orange-200' };
    case EventType.ACTIVITY:
      return { icon: Clock, color: 'bg-purple-100 text-purple-800 border-purple-200' };
    case EventType.TRANSPORTATION:
      return { icon: MapPin, color: 'bg-blue-100 text-blue-800 border-blue-200' };
    default:
      return { icon: Clock, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};

// 優先度のカラー
const getPriorityColor = (priority: Priority | null) => {
  switch (priority) {
    case Priority.HIGH:
      return 'bg-red-100 text-red-800';
    case Priority.MEDIUM:
      return 'bg-yellow-100 text-yellow-800';
    case Priority.LOW:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function EventCard({ event }: EventCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { icon: Icon, color } = getEventTypeInfo(event.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative p-4 rounded-lg border cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200
        ${color}
        ${isDragging ? 'opacity-50 scale-105 shadow-lg' : ''}
      `}
    >
      {/* ドラッグハンドル */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* メインコンテンツ */}
      <div className="space-y-2">
        {/* タイトル行 */}
        <div className="flex items-start gap-2">
          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight truncate">
              {event.title}
            </h3>
            {event.location && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {event.location}
              </p>
            )}
          </div>
        </div>

        {/* バッジエリア */}
        <div className="flex items-center gap-2 flex-wrap">
          {event.priority && (
            <Badge 
              variant="secondary" 
              className={`text-xs ${getPriorityColor(event.priority)}`}
            >
              {event.priority === Priority.HIGH ? '高' : 
               event.priority === Priority.MEDIUM ? '中' : '低'}
            </Badge>
          )}
          
          {event.durationMinutes && (
            <Badge variant="outline" className="text-xs">
              {event.durationMinutes}分
            </Badge>
          )}
        </div>

        {/* ノート */}
        {event.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {event.notes}
          </p>
        )}
      </div>
    </div>
  );
}