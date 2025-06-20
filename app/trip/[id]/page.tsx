import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  Plane,
  Plus,
  Utensils,
  Bed,
  Camera,
  Edit,
  Trash2,
} from "lucide-react";
import { Trip, tripData, ScheduleEvent } from "@/lib/mockdeta";
import Link from "next/link";

// データ取得関数（サーバーサイド）
async function getTripData(tripId: string): Promise<Trip | null> {
  return tripData[tripId] || null;
}

// スケジュールデータ取得関数（実際の実装では別のAPIから取得）
async function getTripSchedule(tripId: string): Promise<ScheduleEvent[]> {
  // 実際の実装では、スケジュールAPIから取得
  // const schedule = await fetch(`/api/trips/${tripId}/schedule`);
  // return schedule.json();

  // モックデータ
  return [
    {
      id: "1",
      time: "10:00",
      title: "羽田空港出発",
      location: "羽田空港",
      type: "travel",
      notes: "搭乗2時間前にチェックイン",
      duration: 180,
      order: 0,
      date: "2025-07-15",
    },
    {
      id: "2",
      time: "13:00",
      title: "那覇空港到着",
      location: "那覇空港",
      type: "travel",
      duration: 60,
      order: 1,
      date: "2025-07-15",
    },
    {
      id: "3",
      time: "15:00",
      title: "ホテルチェックイン",
      location: "リゾートホテル沖縄",
      type: "accommodation",
      duration: 30,
      order: 2,
      date: "2025-07-15",
    },
    {
      id: "4",
      time: "18:00",
      title: "沖縄料理ディナー",
      location: "国際通り",
      type: "food",
      notes: "ゴーヤチャンプルーとソーキそばを食べる",
      duration: 120,
      order: 3,
      date: "2025-07-15",
    },
    {
      id: "5",
      time: "09:00",
      title: "美ら海水族館",
      location: "沖縄県国頭郡",
      type: "activity",
      notes: "ジンベエザメを見る",
      duration: 180,
      order: 0,
      date: "2025-07-16",
    },
    {
      id: "6",
      time: "12:00",
      title: "ランチ",
      location: "美ら海水族館レストラン",
      type: "food",
      duration: 60,
      order: 1,
      date: "2025-07-16",
    },
  ];
}



// ステータスバッジの色を取得
function getStatusColor(status: Trip["status"]) {
  switch (status) {
    case "提案":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    case "計画中":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "確定":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "完了":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
}

// イベントタイプのアイコンを取得
function getEventIcon(type: string) {
  switch (type) {
    case "travel":
      return Plane;
    case "accommodation":
      return Bed;
    case "food":
      return Utensils;
    case "activity":
      return Camera;
    default:
      return Clock;
  }
}

// イベントタイプの色を取得
function getEventColor(type: string) {
  switch (type) {
    case "travel":
      return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400";
    case "accommodation":
      return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400";
    case "food":
      return "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400";
    case "activity":
      return "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400";
    default:
      return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400";
  }
}

// 優先度の色を取得
function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

// カウントダウン計算
function calculateCountdown(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  const daysUntilTrip = Math.ceil(
    (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const tripDuration =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (daysUntilTrip > 0) {
    return { text: `${daysUntilTrip}`, subText: "日後に出発" };
  } else if (daysUntilTrip < -tripDuration) {
    return { text: "完了", subText: "お疲れ様でした" };
  } else {
    return { text: "旅行中", subText: `${tripDuration}日間の旅` };
  }
}

// 日付でグループ化されたスケジュール表示コンポーネント
function ScheduleTimeline({
  scheduleEvents,
}: {
  scheduleEvents: ScheduleEvent[];
}) {
  // 日付でグループ化
  const groupedEvents = scheduleEvents.reduce((groups, event) => {
    const date = event.date || "未定";
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, ScheduleEvent[]>);

  // 日付順にソート
  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => {
        const events = groupedEvents[date].sort((a, b) => a.order - b.order);
        const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
          month: "long",
          day: "numeric",
          weekday: "long",
        });

        return (
          <div key={date} className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">
              {formattedDate}
            </h3>
            <div className="space-y-2">
              {events.map((event, index) => {
                const Icon = getEventIcon(event.type);
                const colorClass = getEventColor(event.type);

                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{event.title}</p>
                            {event.time && (
                              <Badge variant="outline" className="text-xs">
                                {event.time}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <MapPin className="inline h-3 w-3 mr-1" />
                            {event.location}
                          </p>
                          {event.notes && (
                            <p className="text-sm text-muted-foreground italic">
                              {event.notes}
                            </p>
                          )}
                        </div>
                        {event.duration && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.floor(event.duration / 60)}h
                            {event.duration % 60 > 0
                              ? `${event.duration % 60}m`
                              : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 静的生成用のパラメータを生成
export async function generateStaticParams() {
  const tripIds = Object.keys(tripData);
  return tripIds.map((id) => ({ id }));
}

// メインコンポーネント（サーバーコンポーネント）
export default async function TripOverview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tripId } = await params;
  const trip = await getTripData(tripId);
  const scheduleEvents = await getTripSchedule(tripId);

  // 旅行が見つからない場合は404ページを表示
  if (!trip) {
    notFound();
  }

  const countdown = calculateCountdown(trip.startDate, trip.endDate);

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{trip.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
          </div>
        </div>
        <div>
          <Card>
            <CardContent className="flex flex-row items-center justify-center text-center px-4 py-2">
              <p className="text-4xl font-bold text-red-500">{countdown.text}</p>
              <p className="text-muted-foreground">{countdown.subText}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 旅行概要とカウントダウン */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>旅行概要</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">日程</p>
                  <p className="font-medium">{trip.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">目的地</p>
                  <p className="font-medium">{trip.destination}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">参加者</p>
                  <p className="font-medium">{trip.members.length}人</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">期間</p>
                  <p className="font-medium">
                    {Math.ceil(
                      (new Date(trip.endDate).getTime() -
                        new Date(trip.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) + 1}
                    日間
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-3">参加メンバー</h3>
              <div className="flex flex-wrap gap-2">
                {trip.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 旅行スケジュールとタスク管理 */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>旅行スケジュール</CardTitle>
                <CardDescription>
                  ドラッグ&ドロップで調整されたスケジュール
                </CardDescription>
              </div>

              <Link href={`/trip/${tripId}/schedule`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  編集
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {scheduleEvents.length > 0 ? (
              <ScheduleTimeline scheduleEvents={scheduleEvents} />
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  スケジュールが設定されていません
                </p>
                <Button variant="outline" className="mt-4">
                  スケジュールを作成
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 最近の更新 */}
      <Card>
        <CardHeader>
          <CardTitle>最近の更新</CardTitle>
          <CardDescription>旅行の最新情報</CardDescription>
        </CardHeader>
        <CardContent>
          {trip.recentUpdates.length > 0 ? (
            <div className="space-y-4">
              {trip.recentUpdates.map((update) => (
                <div
                  key={update.id}
                  className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {update.user.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>
                      <span className="font-medium">{update.user}</span>さんが
                      <span className="text-muted-foreground">
                        {update.action}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {update.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">
              最近の更新はありません
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
