import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";
import AddEventDialog from "@/components/schedule/dialog/add-event-dialog";
import { tripData } from "@/lib/mockdeta";
import ScheduleDragDropClient from "@/components/schedule/schedule-drag-drop-client";

// 型定義
export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  type: "travel" | "accommodation" | "food" | "activity";
  notes?: string;
  duration?: number; // 所要時間（分）
  order: number; // 表示順序
}

export interface ScheduleDay {
  id: string;
  date: string;
  events: ScheduleEvent[];
}

export interface PendingEvent {
  id: string;
  title: string;
  location: string;
  type: "travel" | "accommodation" | "food" | "activity";
  notes?: string;
  estimatedDuration?: number;
  priority: "high" | "medium" | "low";
  suggestedBy: string;
}

export interface ScheduleData {
  tripId: string;
  tripName: string;
  scheduledDays: ScheduleDay[];
  pendingEvents: PendingEvent[];
}

// モックデータ
const tripScheduleData: Record<string, ScheduleData> = {
  "1": {
    tripId: "1",
    tripName: "沖縄旅行",
    scheduledDays: [
      {
        id: "day1",
        date: "2025-07-15",
        events: [
          {
            id: "1",
            time: "10:00",
            title: "羽田空港出発",
            location: "羽田空港",
            type: "travel",
            notes: "搭乗2時間前にチェックイン",
            duration: 180,
            order: 0
          },
          {
            id: "2",
            time: "13:00",
            title: "那覇空港到着",
            location: "那覇空港",
            type: "travel",
            duration: 60,
            order: 1
          },
          {
            id: "3",
            time: "15:00",
            title: "ホテルチェックイン",
            location: "リゾートホテル沖縄",
            type: "accommodation",
            duration: 30,
            order: 2
          },
          {
            id: "4",
            time: "18:00",
            title: "沖縄料理ディナー",
            location: "国際通り",
            type: "food",
            notes: "ゴーヤチャンプルーとソーキそばを食べる",
            duration: 120,
            order: 3
          }
        ]
      },
      {
        id: "day2",
        date: "2025-07-16",
        events: [
          {
            id: "5",
            time: "09:00",
            title: "美ら海水族館",
            location: "沖縄県国頭郡",
            type: "activity",
            notes: "ジンベエザメを見る",
            duration: 180,
            order: 0
          },
          {
            id: "6",
            time: "12:00",
            title: "ランチ",
            location: "美ら海水族館レストラン",
            type: "food",
            duration: 60,
            order: 1
          },
          {
            id: "7",
            time: "14:00",
            title: "古宇利島観光",
            location: "古宇利島",
            type: "activity",
            duration: 120,
            order: 2
          }
        ]
      }
    ],
    pendingEvents: [
      {
        id: "pending1",
        title: "首里城見学",
        location: "首里城公園",
        type: "activity",
        notes: "琉球王国の歴史を学ぶ",
        estimatedDuration: 90,
        priority: "high",
        suggestedBy: "田中太郎"
      },
      {
        id: "pending2",
        title: "国際通りショッピング",
        location: "国際通り",
        type: "activity",
        estimatedDuration: 120,
        priority: "medium",
        suggestedBy: "佐藤花子"
      },
      {
        id: "pending3",
        title: "ステーキディナー",
        location: "やっぱりステーキ",
        type: "food",
        notes: "沖縄の有名ステーキ店",
        estimatedDuration: 90,
        priority: "low",
        suggestedBy: "鈴木一郎"
      },
      {
        id: "pending4",
        title: "ビーチリゾート",
        location: "万座ビーチ",
        type: "activity",
        notes: "マリンスポーツを楽しむ",
        estimatedDuration: 240,
        priority: "high",
        suggestedBy: "高橋和子"
      },
      {
        id: "pending5",
        title: "沖縄そば朝食",
        location: "地元そば屋",
        type: "food",
        estimatedDuration: 45,
        priority: "medium",
        suggestedBy: "伊藤誠"
      }
    ]
  },
  "2": {
    tripId: "2",
    tripName: "京都観光",
    scheduledDays: [
      {
        id: "day1",
        date: "2025-08-10",
        events: [
          {
            id: "1",
            time: "08:30",
            title: "東京駅出発",
            location: "東京駅",
            type: "travel",
            duration: 165,
            order: 0
          },
          {
            id: "2",
            time: "11:15",
            title: "京都駅到着",
            location: "京都駅",
            type: "travel",
            duration: 30,
            order: 1
          },
          {
            id: "3",
            time: "15:00",
            title: "旅館チェックイン",
            location: "祇園旅館",
            type: "accommodation",
            duration: 30,
            order: 2
          }
        ]
      }
    ],
    pendingEvents: [
      {
        id: "pending1",
        title: "金閣寺参拝",
        location: "金閣寺",
        type: "activity",
        estimatedDuration: 60,
        priority: "high",
        suggestedBy: "田中太郎"
      },
      {
        id: "pending2",
        title: "嵐山竹林散策",
        location: "嵐山",
        type: "activity",
        estimatedDuration: 90,
        priority: "medium",
        suggestedBy: "佐藤花子"
      },
      {
        id: "pending3",
        title: "湯豆腐ランチ",
        location: "嵐山湯豆腐店",
        type: "food",
        estimatedDuration: 60,
        priority: "medium",
        suggestedBy: "鈴木一郎"
      }
    ]
  }
};

// 静的生成用のパラメータを生成
export async function generateStaticParams() {
  const tripIds = Object.keys(tripData);
  return tripIds.map((id) => ({ id }));
}

// データ取得関数
async function getScheduleData(tripId: string): Promise<ScheduleData | null> {
  // 実際の実装では以下のようになります：
  // const scheduleData = await prisma.schedule.findUnique({
  //   where: { tripId },
  //   include: { 
  //     scheduledDays: {
  //       include: { events: true },
  //       orderBy: { date: 'asc' }
  //     },
  //     pendingEvents: true
  //   }
  // });
  // return scheduleData;
  
  return tripScheduleData[tripId] || null;
}

// 日付をフォーマットする関数
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  };
  return date.toLocaleDateString('ja-JP', options);
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

// ヘッダーコンポーネント
function ScheduleHeader({ tripName, pendingCount }: { tripName: string; pendingCount: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          {tripName} - スケジュール調整
        </h2>
        <p className="text-muted-foreground mt-1">
          候補イベントをドラッグ&ドロップして最適なスケジュールを作成しましょう
        </p>
      </div>
      <div className="flex items-center gap-3">
      
        <AddEventDialog 
          triggerButton={
            <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
              <Plus className="mr-2 h-4 w-4" /> イベント追加
            </Button>
          }
        />
      </div>
    </div>
  );
}

// 使用方法説明コンポーネント
function DragDropInstructions() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              ドラッグ&ドロップでスケジュール調整
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              • 候補イベントを日程カードにドラッグしてスケジュールに追加<br/>
              • スケジュール内でイベントをドラッグして順序を変更<br/>
              • 日程間でイベントを移動させることも可能
            </p>
          </div>
        </div>
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
      {/* ヘッダー */}
      <ScheduleHeader 
        tripName={scheduleData.tripName}
        pendingCount={scheduleData.pendingEvents.length}
      />

      {/* 使用方法説明 */}
      <DragDropInstructions />

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