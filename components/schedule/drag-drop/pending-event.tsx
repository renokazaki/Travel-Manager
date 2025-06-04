import { PendingEvent, ScheduleDay, ScheduleEvent } from "@/lib/mockdeta";
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

// 候補イベントカード
export default function PendingEventCard({ event }: { event: PendingEvent }) {
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

  const Icon = utils.getEventIcon(event.type);
  const colors = utils.getEventColors(event.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg border border-dashed transition-all duration-200 cursor-grab bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 ${
        isDragging ? "opacity-30" : "hover:shadow-sm hover:border-solid"
      }`}
    >
      <div className="flex items-start gap-3">
        <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="p-1 rounded">
          <Icon className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{event.title}</h4>
            <Badge className={utils.getPriorityColor(event.priority)} variant="secondary">
              {event.priority === 'high' ? '高' : event.priority === 'medium' ? '中' : '低'}
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground">{event.location}</p>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <User className="h-3 w-3" />
            <span>{event.suggestedBy}</span>
          </div>
          
          {event.notes && (
            <p className="text-xs text-muted-foreground mt-1 italic">{event.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
};



// 日程カード
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
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{utils.formatDate(day.date)}</CardTitle>
          {events.length === 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-red-500"
              onClick={() => onRemoveDay(day.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef}>
          <SortableContext items={eventIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 min-h-[120px] p-2 rounded-lg">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground border-2 border-dashed rounded-lg">
                  <CalendarDays className="h-8 w-8 mb-2" />
                  <p className="text-sm">イベントをここにドラッグ</p>
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

// 候補イベントパネル
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
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          候補イベント ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef}>
          <SortableContext items={eventIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 min-h-[100px] p-2 rounded-lg">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-20 text-muted-foreground">
                  <Plus className="h-6 w-6 mb-2" />
                  <p className="text-sm">候補イベントがありません</p>
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

