import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import CalendarClient from "@/components/coordination/calender-client";
import CoordinationHeader from "@/components/coordination/coordination-header";

// 型定義
interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface MemberAvailability {
  [date: string]: "available" | "unavailable" | "maybe";
}

interface ScheduleData {
  tripId: string;
  tripName: string;
  members: Member[];
  availabilities: {
    [memberId: string]: MemberAvailability;
  };
}

// モックデータベース
const mockScheduleDatabase: Record<string, ScheduleData> = {
  "1": {
    tripId: "1",
    tripName: "沖縄旅行",
    members: [
      { id: "1", name: "田中太郎", avatar: "田" },
      { id: "2", name: "佐藤花子", avatar: "佐" },
      { id: "3", name: "鈴木一郎", avatar: "鈴" },
      { id: "4", name: "高橋和子", avatar: "高" },
      { id: "5", name: "伊藤誠", avatar: "伊" },
    ],
    availabilities: {
      "1": {
        "2025-07-15": "available",
        "2025-07-16": "available",
        "2025-07-17": "available",
        "2025-07-18": "unavailable",
        "2025-07-19": "available",
        "2025-07-20": "maybe",
        "2025-07-21": "unavailable",
        "2025-07-22": "available",
      },
      "2": {
        "2025-07-15": "available",
        "2025-07-16": "available",
        "2025-07-17": "available",
        "2025-07-18": "available",
        "2025-07-19": "unavailable",
        "2025-07-20": "unavailable",
        "2025-07-21": "unavailable",
        "2025-07-22": "unavailable",
      },
      "3": {
        "2025-07-15": "unavailable",
        "2025-07-16": "unavailable",
        "2025-07-17": "available",
        "2025-07-18": "available",
        "2025-07-19": "available",
        "2025-07-20": "available",
        "2025-07-21": "available",
        "2025-07-22": "unavailable",
      },
      "4": {
        "2025-07-15": "available",
        "2025-07-16": "available",
        "2025-07-17": "available",
        "2025-07-18": "available",
        "2025-07-19": "unavailable",
        "2025-07-20": "unavailable",
        "2025-07-21": "available",
        "2025-07-22": "available",
      },
      "5": {
        "2025-07-15": "unavailable",
        "2025-07-16": "available",
        "2025-07-17": "available",
        "2025-07-18": "available",
        "2025-07-19": "available",
        "2025-07-20": "available",
        "2025-07-21": "unavailable",
        "2025-07-22": "unavailable",
      },
    },
  },
  "2": {
    tripId: "2",
    tripName: "京都観光",
    members: [
      { id: "1", name: "田中太郎", avatar: "田" },
      { id: "2", name: "佐藤花子", avatar: "佐" },
      { id: "3", name: "鈴木一郎", avatar: "鈴" },
    ],
    availabilities: {
      "1": {
        "2025-08-10": "available",
        "2025-08-11": "available",
        "2025-08-12": "available",
      },
      "2": {
        "2025-08-10": "available",
        "2025-08-11": "available",
        "2025-08-12": "unavailable",
      },
      "3": {
        "2025-08-10": "maybe",
        "2025-08-11": "available",
        "2025-08-12": "available",
      },
    },
  },
  "3": {
    tripId: "3",
    tripName: "北海道スキー",
    members: [
      { id: "1", name: "田中太郎", avatar: "田" },
      { id: "2", name: "佐藤花子", avatar: "佐" },
      { id: "3", name: "鈴木一郎", avatar: "鈴" },
      { id: "4", name: "高橋和子", avatar: "高" },
      { id: "5", name: "伊藤誠", avatar: "伊" },
      { id: "6", name: "山本隆", avatar: "山" },
      { id: "7", name: "中村愛", avatar: "中" },
      { id: "8", name: "小林健", avatar: "小" },
    ],
    availabilities: {
      "1": {
        "2025-12-24": "available",
        "2025-12-25": "available",
        "2025-12-26": "available",
        "2025-12-27": "available",
      },
      "2": {
        "2025-12-24": "unavailable",
        "2025-12-25": "available",
        "2025-12-26": "available",
        "2025-12-27": "available",
      },
      "3": {
        "2025-12-24": "available",
        "2025-12-25": "available",
        "2025-12-26": "unavailable",
        "2025-12-27": "unavailable",
      },
    },
  },
};

// 静的生成用のパラメータを生成
export async function generateStaticParams() {
  // 実際の実装では、データベースから全ての旅行IDを取得
  // const trips = await prisma.trip.findMany({ select: { id: true } });
  // return trips.map((trip) => ({ id: trip.id }));

  const tripIds = Object.keys(mockScheduleDatabase);
  return tripIds.map((id) => ({ id }));
}

// データ取得関数（サーバーサイド）
async function getScheduleData(tripId: string): Promise<ScheduleData | null> {
  // 実際の実装では、データベースから日程調整データを取得
  // const scheduleData = await prisma.scheduleCoordination.findUnique({
  //   where: { tripId },
  //   include: {
  //     members: true,
  //     availabilities: true
  //   }
  // });
  // return scheduleData;

  return mockScheduleDatabase[tripId] || null;
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
