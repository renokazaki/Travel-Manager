import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";
import AddEventDialog from "@/components/schedule/dialog/add-event-dialog";
import {  tripScheduleData } from "@/lib/mockdeta";
import ScheduleDragDropClient from "@/components/schedule/schedule-drag-drop-client";
import { ScheduleDataType } from "@/types/types";




//TODO prismaからデータを取得する。
// データ取得関数
async function getScheduleData(tripId: string): Promise<ScheduleDataType | null> {

  
  return tripScheduleData.find((data) => data.tripId === tripId) || null;
}



// 空のスケジュール表示コンポーネント
function EmptySchedule() {
  return (
    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/50 dark:to-teal-900/50 p-3 mb-4 shadow-inner">
          <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">スケジュールがまだありません</h3>
        <p className="text-muted-foreground mb-6">候補イベントを日程にドラッグして計画を始めましょう</p>
        <AddEventDialog 
          triggerButton={
            <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" /> 最初のイベントを追加
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}





// メインコンポーネント（サーバーコンポーネント）
export default async function TripSchedule({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id: tripId } = await params;
  const scheduleData = await getScheduleData(tripId);

  // スケジュールが見つからない場合は404ページを表示
  if (!scheduleData) {
    notFound();
  }

  const hasScheduledEvents = scheduleData.scheduledDays.some(day => day.events.length > 0);

  return (
    <div className="space-y-6">

      {hasScheduledEvents || scheduleData.pendingEvents.length > 0 ? (
        // ドラッグ&ドロップクライアントコンポーネント
        <ScheduleDragDropClient scheduleData={scheduleData} />
      ) : (
        // 空のスケジュール表示
        <EmptySchedule />
      )}
    </div>
  );
}