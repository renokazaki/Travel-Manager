
// 型定義
export interface TripMember {
  id: string;
  name: string;
  avatar: string;
}

export interface TripEvent {
  id: string;
  title: string;
  date: string;
  type: "travel" | "accommodation" | "activity";
}

export interface TripUpdate {
  id: string;
  user: string;
  action: string;
  time: string;
}

export interface Trip {
  id: string;
  name: string;
  date: string;
  startDate: string;
  endDate: string;
  members: TripMember[];
  destination: string;
  budget: number;
  spentSoFar: number;
  image: string;
  status: "提案" | "計画中" | "確定" | "完了";
  upcomingEvents: TripEvent[];
  recentUpdates: TripUpdate[];
}

// モックデータ
export const tripData: Record<string, Trip> = {
  "1": {
    id: "1",
    name: "沖縄旅行",
    date: "2025年7月15日 - 7月18日",
    startDate: "2025-07-15",
    endDate: "2025-07-18",
    members: [
      { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
      { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
      { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" },
      { id: "4", name: "高橋和子", avatar: "/avatars/takahashi.jpg" },
      { id: "5", name: "伊藤誠", avatar: "/avatars/ito.jpg" }
    ],
    destination: "沖縄県那覇市",
    budget: 120000,
    spentSoFar: 45000,
    image: "/images/okinawa.jpg",
    status: "計画中",
    upcomingEvents: [
      { id: "1", title: "フライト予約", date: "2025-07-15 10:00", type: "travel" },
      { id: "2", title: "ホテルチェックイン", date: "2025-07-15 15:00", type: "accommodation" },
      { id: "3", title: "美ら海水族館", date: "2025-07-16 13:00", type: "activity" }
    ],
    recentUpdates: [
      { id: "1", user: "田中太郎", action: "フライトの予約を追加しました", time: "1時間前" },
      { id: "2", user: "佐藤花子", action: "ホテルの予約を更新しました", time: "3時間前" }
    ]
  },
  "2": {
    id: "2",
    name: "京都観光",
    date: "2025年8月10日 - 8月12日",
    startDate: "2025-08-10",
    endDate: "2025-08-12",
    members: [
      { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
      { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
      { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" }
    ],
    destination: "京都府京都市",
    budget: 80000,
    spentSoFar: 15000,
    image: "/images/kyoto.jpg",
    status: "確定",
    upcomingEvents: [
      { id: "1", title: "新幹線予約", date: "2025-08-10 08:30", type: "travel" },
      { id: "2", title: "旅館チェックイン", date: "2025-08-10 15:00", type: "accommodation" },
      { id: "3", title: "金閣寺観光", date: "2025-08-11 10:00", type: "activity" }
    ],
    recentUpdates: [
      { id: "1", user: "田中太郎", action: "新幹線の予約を追加しました", time: "2日前" }
    ]
  },
  "3": {
    id: "3",
    name: "北海道スキー",
    date: "2025年12月24日 - 12月27日",
    startDate: "2025-12-24",
    endDate: "2025-12-27",
    members: [
      { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
      { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
      { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" },
      { id: "4", name: "高橋和子", avatar: "/avatars/takahashi.jpg" },
      { id: "5", name: "伊藤誠", avatar: "/avatars/ito.jpg" },
      { id: "6", name: "山本隆", avatar: "/avatars/yamamoto.jpg" },
      { id: "7", name: "中村愛", avatar: "/avatars/nakamura.jpg" },
      { id: "8", name: "小林健", avatar: "/avatars/kobayashi.jpg" }
    ],
    destination: "北海道ニセコ",
    budget: 200000,
    spentSoFar: 0,
    image: "/images/hokkaido.jpg",
    status: "提案",
    upcomingEvents: [],
    recentUpdates: [
      { id: "1", user: "鈴木一郎", action: "旅行を作成しました", time: "1週間前" }
    ]
  }
};






// スケジュールモックデータ - 実際の実装ではAPIから取得
export const tripSchedules = {
  "1": [
    {
      id: "1",
      date: "2025-07-15",
      events: [
        { id: "1", time: "10:00", title: "那覇空港到着", location: "那覇空港", type: "travel", notes: "JAL123便" },
        { id: "2", time: "12:00", title: "レンタカー受取", location: "那覇空港レンタカーカウンター", type: "travel", notes: "予約番号: ABC123" },
        { id: "3", time: "15:00", title: "ホテルチェックイン", location: "リゾートホテル沖縄", type: "accommodation", notes: "オーシャンビュールーム" },
        { id: "4", time: "18:00", title: "夕食", location: "海鮮居酒屋うみ", type: "food", notes: "予約済み" }
      ]
    },
    {
      id: "2",
      date: "2025-07-16",
      events: [
        { id: "1", time: "09:00", title: "朝食", location: "ホテルレストラン", type: "food", notes: "" },
        { id: "2", time: "11:00", title: "美ら海水族館", location: "沖縄美ら海水族館", type: "activity", notes: "チケット購入済み" },
        { id: "3", time: "15:00", title: "古宇利島ドライブ", location: "古宇利島", type: "activity", notes: "" },
        { id: "4", time: "19:00", title: "夕食", location: "沖縄料理やんばる", type: "food", notes: "" }
      ]
    },
    {
      id: "3",
      date: "2025-07-17",
      events: [
        { id: "1", time: "09:00", title: "朝食", location: "ホテルレストラン", type: "food", notes: "" },
        { id: "2", time: "11:00", title: "首里城", location: "首里城公園", type: "activity", notes: "" },
        { id: "3", time: "14:00", title: "国際通り散策", location: "国際通り", type: "activity", notes: "お土産購入" },
        { id: "4", time: "18:00", title: "夕食", location: "琉球炉端 花火", type: "food", notes: "予約済み" }
      ]
    },
    {
      id: "4",
      date: "2025-07-18",
      events: [
        { id: "1", time: "08:00", title: "朝食", location: "ホテルレストラン", type: "food", notes: "" },
        { id: "2", time: "10:00", title: "ホテルチェックアウト", location: "リゾートホテル沖縄", type: "accommodation", notes: "" },
        { id: "3", time: "12:00", title: "レンタカー返却", location: "那覇空港レンタカーカウンター", type: "travel", notes: "" },
        { id: "4", time: "14:30", title: "那覇空港出発", location: "那覇空港", type: "travel", notes: "JAL456便" }
      ]
    }
  ],
  "2": [
    {
      id: "1",
      date: "2025-08-10",
      events: [
        { id: "1", time: "08:30", title: "新幹線出発", location: "東京駅", type: "travel", notes: "のぞみ15号" },
        { id: "2", time: "11:00", title: "京都駅到着", location: "京都駅", type: "travel", notes: "" },
        { id: "3", time: "15:00", title: "旅館チェックイン", location: "京都嵐山温泉旅館", type: "accommodation", notes: "" }
      ]
    },
    {
      id: "2",
      date: "2025-08-11",
      events: [
        { id: "1", time: "08:00", title: "朝食", location: "旅館", type: "food", notes: "" },
        { id: "2", time: "10:00", title: "金閣寺", location: "金閣寺", type: "activity", notes: "" },
        { id: "3", time: "14:00", title: "清水寺", location: "清水寺", type: "activity", notes: "" }
      ]
    },
    {
      id: "3",
      date: "2025-08-12",
      events: [
        { id: "1", time: "08:00", title: "朝食", location: "旅館", type: "food", notes: "" },
        { id: "2", time: "10:00", title: "旅館チェックアウト", location: "京都嵐山温泉旅館", type: "accommodation", notes: "" },
        { id: "3", time: "13:00", title: "新幹線出発", location: "京都駅", type: "travel", notes: "のぞみ22号" }
      ]
    }
  ],
  "3": [] // 北海道スキーはまだスケジュールが作成されていない
};






// schedule型定義
export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  type: "travel" | "accommodation" | "food" | "activity";
  notes?: string;
  duration?: number;
  order: number;
  date?: string;
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

export interface Props {
  scheduleData?: ScheduleData;
  onDataChange?: (data: ScheduleData) => void;
}

// scheduleモックデータ
export const mockScheduleData: ScheduleData = {
  tripId: "1",
  tripName: "沖縄旅行",
  scheduledDays: [
    {
      id: "day1",
      date: "2025-07-15",
      events: [
        {
          id: "scheduled-1",
          time: "10:00",
          title: "羽田空港出発",
          location: "羽田空港",
          type: "travel",
          notes: "搭乗2時間前にチェックイン",
          duration: 180,
          order: 0
        },
        {
          id: "scheduled-2",
          time: "13:00",
          title: "那覇空港到着",
          location: "那覇空港",
          type: "travel",
          duration: 60,
          order: 1
        }
      ]
    },
    {
      id: "day2",
      date: "2025-07-16",
      events: [
        {
          id: "scheduled-3",
          time: "09:00",
          title: "美ら海水族館",
          location: "沖縄県国頭郡",
          type: "activity",
          notes: "ジンベエザメを見る",
          duration: 180,
          order: 0
        }
      ]
    }
  ],
  pendingEvents: [
    {
      id: "pending-1",
      title: "首里城見学",
      location: "首里城公園",
      type: "activity",
      notes: "琉球王国の歴史を学ぶ",
      estimatedDuration: 90,
      priority: "high",
      suggestedBy: "田中太郎"
    },
    {
      id: "pending-2",
      title: "国際通りショッピング",
      location: "国際通り",
      type: "activity",
      estimatedDuration: 120,
      priority: "medium",
      suggestedBy: "佐藤花子"
    },
    {
      id: "pending-3",
      title: "ステーキディナー",
      location: "やっぱりステーキ",
      type: "food",
      notes: "沖縄の有名ステーキ店",
      estimatedDuration: 90,
      priority: "low",
      suggestedBy: "鈴木一郎"
    }
  ]
};