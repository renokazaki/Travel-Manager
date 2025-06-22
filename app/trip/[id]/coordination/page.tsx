import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import { prisma } from "@/prisma/prisma";
import { auth } from '@clerk/nextjs/server';
import BulkEditModal from "@/components/coordination/bulk-edit-dialog";
import CalendarMatrix from "@/components/coordination/calender-matrix";

// データ取得関数
async function getCoordinationData(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      users: { some: { clerkId: userId } },
    },
    include: { users: true },
  });

  if (!trip) return null;

  const availabilities = await prisma.memberAvailability.findMany({
    where: { tripId },
  });

  // データを整理
  const availabilityMap: Record<string, Record<string, string>> = {};
  availabilities.forEach((avail) => {
    const dateKey = avail.date.toISOString().split('T')[0];
    if (!availabilityMap[avail.clerkId]) {
      availabilityMap[avail.clerkId] = {};
    }
    availabilityMap[avail.clerkId][dateKey] = avail.status;
  });

  return {
    trip,
    members: trip.users.map(user => ({
      id: user.clerkId,
      name: user.displayName,
    })),
    availabilities: availabilityMap,
  };
}

// 参加状況保存のサーバーアクション
async function saveAvailability(formData: FormData) {
  'use server';
  
  const tripId = formData.get('tripId') as string;
  const memberId = formData.get('memberId') as string;
  const date = formData.get('date') as string;
  const status = formData.get('status') as string;

  await prisma.memberAvailability.upsert({
    where: {
      tripId_clerkId_date: {
        tripId,
        clerkId: memberId,
        date: new Date(date),
      },
    },
    update: { status: status as any },
    create: {
      tripId,
      clerkId: memberId,
      date: new Date(date),
      status: status as any,
    },
  });
}

// 一括保存のサーバーアクション
async function saveBulkAvailability(formData: FormData) {
  'use server';
  
  const tripId = formData.get('tripId') as string;
  const memberId = formData.get('memberId') as string;
  const dates = formData.get('dates') as string; // JSON文字列
  const status = formData.get('status') as string;

  const dateList = JSON.parse(dates);
  
  // 複数の日付を一括で更新
  for (const date of dateList) {
    await prisma.memberAvailability.upsert({
      where: {
        tripId_clerkId_date: {
          tripId,
          clerkId: memberId,
          date: new Date(date),
        },
      },
      update: { status: status as any },
      create: {
        tripId,
        clerkId: memberId,
        date: new Date(date),
        status: status as any,
      },
    });
  }
}

// 凡例コンポーネント
function Legend() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium">凡例:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">参加可能</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">未定</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">参加不可</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


// メインコンポーネント
export default async function CoordinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) notFound();

  const { id: tripId } = await params;
  const data = await getCoordinationData(tripId, userId);
  if (!data) notFound();

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
      {/* ヘッダー */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              日程調整
            </h1>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {data.trip.name}
            </p>
            <p className="text-muted-foreground">
              みんなの空き状況を一目で確認・編集できます
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <BulkEditModal 
              tripId={tripId}
              members={data.members}
              saveBulkAvailability={saveBulkAvailability}
            />
          </div>
        </div>
        
        {/* 旅行情報 */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{data.trip.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{data.members.length}人参加</span>
          </div>
          {data.trip.startDate && data.trip.endDate && (
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {data.trip.startDate.toLocaleDateString('ja-JP')} - {data.trip.endDate.toLocaleDateString('ja-JP')}
              </span>
            </div>
          )}
          <Badge variant="outline">
            {data.trip.status === 'PLANNING' ? '計画中' : 
             data.trip.status === 'CONFIRMED' ? '確定' : '完了'}
          </Badge>
        </div>
      </div>



      {/* 凡例 */}
      <Legend />

      {/* カレンダー */}
      <CalendarMatrix 
        tripId={tripId}
        currentUserId={userId}
        members={data.members}
        availabilities={data.availabilities}
        saveAvailability={saveAvailability}
      />
    </div>
  );
}