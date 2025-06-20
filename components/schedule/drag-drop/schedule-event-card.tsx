import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { utils } from "./utils/drag-drop-functions";
import { ScheduleEvent, PendingEvent } from "@/lib/mockdeta";
import { GripVertical, Edit, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// スケジュール済みイベントカード（再設計版）
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
    animateLayoutChanges: () => false
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
      {/* シンプルな横並びレイアウト（全サイズ共通） */}
      <div className="flex items-center gap-2">
        {/* 左側：ドラッグハンドル */}
        <div className="flex mt-0.5">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        
        {/* アイコン */}
        <div className="flex-shrink-0 p-1 rounded">
          <Icon className="h-4 w-4" />
        </div>
        
        {/* メインコンテンツエリア */}
        <div className="flex-1 min-w-0">
          {/* タイトル行 */}
          <div className="flex md:items-center gap-2 mb-1 md:flex-wrap">
            <h4 className="font-medium text-sm break-words flex-1 min-w-0">
              {event.title}
            </h4>

          </div>
          
          {/* 場所 */}
          <p className="text-xs text-muted-foreground break-words mb-1">
            {event.location}
          </p>
          
          {/* ノート */}
          {event.notes && (
            <p className="text-xs text-muted-foreground italic break-words">
              {event.notes}
            </p>
          )}
        </div>
        <div>
           {event.time && (
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                {event.time}
              </Badge>
            )}
        {/* 右側：アクションボタン */}
        <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}