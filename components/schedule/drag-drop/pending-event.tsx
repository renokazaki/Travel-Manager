import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { utils } from "./utils/drag-drop-functions";
import { CalendarDays, GripVertical, Plus, Star, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";
import ScheduledEventCard from "./schedule-event-card";
import { Button } from "@/components/ui/button";
import { PendingEvent, ScheduleDay, ScheduleEvent } from "@/types/types";
// 候補イベントカード（レスポンシブ対応）
export default function PendingEventCard({ event }: { event: PendingEvent }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: event.id,
    // ドラッグの感度を調整
    animateLayoutChanges: () => false // レイアウト変更時のアニメーションを無効化して軽量化
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // トランジションを最適化
    willChange: 'transform',
    touchAction: 'none'
  };

  const Icon = utils.getEventIcon(event.type);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-2 sm:p-3 rounded-lg border border-dashed transition-all duration-100 cursor-grab active:cursor-grabbing bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 ${
        isDragging ? "opacity-30" : "hover:shadow-sm hover:border-solid"
      }`}
    >
      {/* モバイル: 縦レイアウト、デスクトップ: 横レイアウト */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
        {/* ヘッダー部分（アイコン、タイトル、優先度） */}
        <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto">
          {/* ドラッグハンドル */}
          <div className="flex-shrink-0">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          
          {/* アイコン */}
          <div className="flex-shrink-0 p-1 rounded">
            <Icon className="h-4 w-4" />
          </div>
          
          {/* タイトルと優先度バッジ */}
          <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm truncate max-w-[100px] sm:max-w-none">
              {event.title}
            </h4>
       
          </div>
        </div>
        
        {/* 詳細情報（モバイルでは下に配置） */}
        <div className="w-full md:flex-1 lg:min-w-0 pl-6 md:pl-0 space-y-1">
          {/* 場所 */}
          <p className="text-xs text-muted-foreground truncate md:break-words">
            {event.location}
          </p>
          
          {/* 提案者 */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{event.suggestedBy}</span>
          </div>
          
          {/* ノート */}
          {event.notes && (
            <p className="text-xs text-muted-foreground italic line-clamp-2 sm:line-clamp-none break-words">
              {event.notes}
            </p>
          )}
        </div>
        <Badge 
              className={`${utils.getPriorityColor(event.priority)} flex-shrink-0 whitespace-nowrap`} 
              variant="secondary"
            >
              {event.priority === 'high' ? '高' : event.priority === 'medium' ? '中' : '低'}
            </Badge>
            
      </div>
    </div>
  );
}

// 日程カード（レスポンシブ対応）
export const DayCard = ({ 
  day, 
  events, 
  isOver,
  onRemoveDay
}: { 
  day: ScheduleDay; 
  events: ScheduleEvent[]; 
  isOver: boolean;
  onRemoveDay: (dayId: string) => void;
}) => {
  const { setNodeRef } = useDroppable({
    id: day.id,
  });

  const eventIds = useMemo(() => events.map(e => e.id), [events]);

  return (
    <Card className={`min-h-[200px] transition-all duration-200 ${
      isOver ? 'ring-2 ring-blue-400 ring-opacity-75 bg-blue-50/50' : ''
    }`}>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg truncate pr-2">
            {utils.formatDate(day.date)}
          </CardTitle>
          {events.length === 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-red-500 flex-shrink-0"
              onClick={() => onRemoveDay(day.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div ref={setNodeRef}>
          <SortableContext items={eventIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 min-h-[120px] p-2 rounded-lg">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground border-2 border-dashed rounded-lg">
                  <CalendarDays className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                  <p className="text-xs sm:text-sm text-center px-2">
                    イベントをここにドラッグ
                  </p>
                </div>
              ) : (
                events.map((event) => (
                  <ScheduledEventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
};

// 候補イベントパネル（レスポンシブ対応）
export const PendingEventsPanel = ({ 
  events, 
  isOver    
}: { 
  events: PendingEvent[]; 
  isOver: boolean;
}) => {
  const { setNodeRef } = useDroppable({
    id: 'pending-events',
  });

  const eventIds = useMemo(() => events.map(e => e.id), [events]);

  return (
    <Card className={`sticky top-6 transition-all duration-200 ${
      isOver ? 'ring-2 ring-blue-400 ring-opacity-75 bg-blue-50/50' : ''
    }`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
          <span className="truncate">候補イベント ({events.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div ref={setNodeRef}>
          <SortableContext items={eventIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 sm:space-y-3 min-h-[100px] p-2 rounded-lg">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-20 text-muted-foreground">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 mb-2" />
                  <p className="text-xs sm:text-sm text-center">
                    候補イベントがありません
                  </p>
                </div>
              ) : (
                events.map((event) => (
                  <PendingEventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
};