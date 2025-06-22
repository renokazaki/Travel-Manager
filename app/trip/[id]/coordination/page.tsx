import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import CalendarClient from "@/components/coordination/calender-client";
import CoordinationHeader from "@/components/coordination/coordination-header";
import { CoordinationData } from "@/lib/mockdeta";
import { CoordinationDataType } from "@/types/types";



// データ取得関数（サーバーサイド）
async function getScheduleData(tripId: string): Promise<CoordinationDataType | null> {
  // 実際の実装では、データベースから日程調整データを取得
  // const scheduleData = await prisma.scheduleCoordination.findUnique({
  //   where: { tripId },
  //   include: {
  //     members: true,
  //     availabilities: true
  //   }
  // });
  // return scheduleData;

  return CoordinationData.find((data) => data.tripId === tripId) || null;
}

// 参加状況のアイコンとスタイル（サーバーサイドで定義）
const AvailabilityStatus = {
  available: {
    label: "参加可能",
    color: "bg-green-500",
  },
  unavailable: {
    label: "参加不可",
    color: "bg-red-500",
  },
  maybe: {
    label: "未定",
    color: "bg-yellow-500",
  },
};

// 凡例コンポーネント（サーバーコンポーネント）
function LegendCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium">凡例:</span>
          {Object.entries(AvailabilityStatus).map(([key, status]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status.color}`} />
              <span className="text-sm">{status.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// メインコンポーネント（サーバーコンポーネント）
export default async function CoordinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tripId } = await params;
  const scheduleData = await getScheduleData(tripId);

  if (!scheduleData) {
    notFound();
  }

  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto pb-24 md:pb-12">
      <div className="flex flex-col space-y-6">
        {/* ヘッダー（クライアントコンポーネント） */}
        <CoordinationHeader 
          tripName={scheduleData.tripName} 
          scheduleData={scheduleData} 
        />

        {/* 凡例（サーバーコンポーネント） */}
        <LegendCard />

        {/* カレンダー（クライアントコンポーネント） */}
        <CalendarClient scheduleData={scheduleData} />
      </div>
    </div>
  );
}
