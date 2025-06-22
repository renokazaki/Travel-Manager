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
  Plus,
  Utensils,
  Bed,
  Camera,
  Edit,
  Car,
  Activity,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/prisma/prisma";
import { auth } from '@clerk/nextjs/server';
import { Trip, User, Event, EventType, TripStatus } from "@prisma/client";
import AddMemberModal from "@/components/trip/add-member-modal";

// 型定義
type TripWithDetails = Trip & {
  users: User[];
  events: Event[];
  _count: {
    events: number;
    users: number;
  };
};


//TODO ユーザーの条件を追加する
// データ取得関数
async function getTripData(tripId: string, userId: string): Promise<TripWithDetails | null> {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      // users: {
      //   some: {
      //     clerkId: userId,
      //   },
      // },
    },
    include: {
      users: true,
      events: {
        where: {
          status: 'SCHEDULED',
        },
        orderBy: [
          { date: 'asc' },
          { order: 'asc' },
        ],
      },
      _count: {
        select: {
          events: true,
          users: true,
        },
      },
    },
  });

  return trip;
}

// メンバー追加のサーバーアクション
async function addMemberToTrip(formData: FormData) {
  'use server';
  
  const tripId = formData.get('tripId') as string;
  const userID = formData.get('userID') as string;

  try {
    // メールアドレスでユーザーを検索（実際の実装では、ClerkのAPIやUserテーブルの別フィールドを使用）
    const user = await prisma.user.findFirst({
      where: {
        clerkId: userID,
      },
    });

    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    // 既に参加しているかチェック
    const existingMember = await prisma.trip.findFirst({
      where: {
        id: tripId,
        users: {
          some: {
            clerkId: user.clerkId,
          },
        },
      },
    });

    if (existingMember) {
      throw new Error('このユーザーは既に参加しています');
    }

    // ユーザーをトリップに追加
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        users: {
          connect: { clerkId: user.clerkId },
        },
      },
    });

    return { success: true };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '追加に失敗しました');
  }
}

// ステータスバッジの色を取得
function getStatusBadge(status: TripStatus) {
  switch (status) {
    case "PLANNING":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">計画中</Badge>;
    case "CONFIRMED":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">確定</Badge>;
    case "COMPLETED":
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">完了</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// イベントタイプのアイコンを取得
function getEventIcon(type: EventType | null) {
  switch (type) {
    case "TRANSPORTATION":
      return Car;
    case "ACCOMMODATION":
      return Bed;
    case "FOOD":
      return Utensils;
    case "ACTIVITY":
      return Camera;
    case "OTHER":
      return Activity;
    default:
      return Clock;
  }
}

// イベントタイプの色を取得
function getEventColor(type: EventType | null) {
  switch (type) {
    case "TRANSPORTATION":
      return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400";
    case "ACCOMMODATION":
      return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400";
    case "FOOD":
      return "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400";
    case "ACTIVITY":
      return "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400";
    case "OTHER":
      return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400";
    default:
      return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400";
  }
}

// カウントダウン計算
function calculateCountdown(startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) {
    return { text: "未定", subText: "日程を設定してください" };
  }

  const today = new Date();
  const daysUntilTrip = Math.ceil(
    (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const tripDuration =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (daysUntilTrip > 0) {
    return { text: `${daysUntilTrip}`, subText: "日後に出発" };
  } else if (daysUntilTrip < -tripDuration) {
    return { text: "完了", subText: "お疲れ様でした" };
  } else {
    return { text: "旅行中", subText: `${tripDuration}日間の旅` };
  }
}

// 期間計算
function calculateTripDuration(startDate: Date | null, endDate: Date | null): number {
  if (!startDate || !endDate) return 0;
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

// 日付でグループ化されたスケジュール表示
function ScheduleTimeline({ events }: { events: Event[] }) {
  // 日付でグループ化
  const groupedEvents = events.reduce((groups, event) => {
    const dateKey = event.date ? event.date.toISOString().split('T')[0] : "未定";
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {} as Record<string, Event[]>);

  // 日付順にソート
  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => {
        const dayEvents = groupedEvents[dateKey].sort((a, b) => (a.order || 0) - (b.order || 0));
        const date = dateKey === "未定" ? null : new Date(dateKey);
        
        const formattedDate = date 
          ? date.toLocaleDateString("ja-JP", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })
          : "未定";

        return (
          <div key={dateKey} className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">
              {formattedDate}
            </h3>
            <div className="space-y-2">
              {dayEvents.map((event) => {
                const Icon = getEventIcon(event.type);
                const colorClass = getEventColor(event.type);

                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{event.title}</p>
                            {event.startTime && (
                              <Badge variant="outline" className="text-xs">
                                {new Date(event.startTime).toLocaleTimeString('ja-JP', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Badge>
                            )}
                          </div>
                          {event.location && (
                            <p className="text-sm text-muted-foreground mb-1">
                              <MapPin className="inline h-3 w-3 mr-1" />
                              {event.location}
                            </p>
                          )}
                          {event.notes && (
                            <p className="text-sm text-muted-foreground italic">
                              {event.notes}
                            </p>
                          )}
                        </div>
                        {event.durationMinutes && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.floor(event.durationMinutes / 60)}h
                            {event.durationMinutes % 60 > 0
                              ? `${event.durationMinutes % 60}m`
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

// メインコンポーネント
export default async function TripOverview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    notFound();
  }

  const { id: tripId } = await params;
  const trip = await getTripData(tripId, userId);

  if (!trip) {
    notFound();
  }

  const countdown = calculateCountdown(trip.startDate, trip.endDate);
  const tripDuration = calculateTripDuration(trip.startDate, trip.endDate);

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl space-y-8">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            {trip.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(trip.status)}
            <Badge variant="outline" className="text-sm">
              {trip._count?.users || 0}人参加
            </Badge>
          </div>
        </div>
        <Card className="sm:w-auto">
          <CardContent className="flex items-center justify-center text-center px-6 py-4">
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {countdown.text}
              </p>
              <p className="text-muted-foreground text-sm">{countdown.subText}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 旅行概要 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            旅行概要
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">日程</p>
                <p className="font-medium">
                  {trip.startDate && trip.endDate 
                    ? `${trip.startDate.toLocaleDateString()} - ${trip.endDate.toLocaleDateString()}`
                    : "未定"
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">目的地</p>
                <p className="font-medium">{trip.destination}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">参加者</p>
                <p className="font-medium">{trip.users.length}人</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950">
              <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">期間</p>
                <p className="font-medium">
                  {tripDuration > 0 ? `${tripDuration}日間` : "未定"}
                </p>
              </div>
            </div>
          </div>

          {/* メンバー管理 */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">参加メンバー</h3>
              <AddMemberModal tripId={tripId} addMemberToTrip={addMemberToTrip}>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  メンバー追加
                </Button>
              </AddMemberModal>
            </div>
            <div className="flex flex-wrap gap-2">
              {trip.users.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.profileImage || ""} alt={member.displayName} />
                    <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                      {member.displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{member.displayName}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 旅行スケジュール */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                旅行スケジュール
              </CardTitle>
              <CardDescription>
                確定されたスケジュール（{trip.events.length}件）
              </CardDescription>
            </div>
            <Link href={`/trip/${tripId}/schedule`}>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {trip.events.length > 0 ? (
            <ScheduleTimeline events={trip.events} />
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                スケジュールが設定されていません
              </h3>
              <p className="text-muted-foreground mb-6">
                スケジュールを作成して旅行の計画を立てましょう
              </p>
              <Link href={`/trip/${tripId}/schedule`}>
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600">
                  <Plus className="h-4 w-4 mr-2" />
                  スケジュールを作成
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}