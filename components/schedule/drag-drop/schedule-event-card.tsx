import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { utils } from "./utils/drag-drop-functions";
import { ScheduleEvent } from "@/lib/mockdeta";
import { GripVertical,Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// スケジュール済みイベントカード
export default function ScheduledEventCard({ event }: { event: ScheduleEvent }) {
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
  const colors = utils.getEventColors(event.type);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-3 rounded-lg border transition-all duration-100 cursor-grab active:cursor-grabbing ${colors} ${
        isDragging ? "opacity-30" : "hover:shadow-md"
      }`}
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
            <h4 className="font-medium text-sm">{event.title}</h4>
            {event.time && (
              <Badge variant="outline" className="text-xs">{event.time}</Badge>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground">{event.location}</p>
          
          {event.notes && (
            <p className="text-xs text-muted-foreground mt-1 italic">
              {event.notes}
            </p>
          )}
        </div>
        
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};