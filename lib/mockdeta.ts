import { TripScheduleDataType,FriendsDataType,TravelGroupDataType, RecentActivityDataType, CoordinationDataType, ScheduleDataType, PaymentRecordType, Trip } from "@/types/types";

//home
// 友達データ
export const FriendsData:FriendsDataType[] = [
  { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
  { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
  { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" },
  { id: "4", name: "高橋和子", avatar: "/avatars/takahashi.jpg" },
  { id: "5", name: "伊藤誠", avatar: "/avatars/ito.jpg" },
  { id: "6", name: "山田美咲", avatar: "/avatars/yamada.jpg" },
  { id: "7", name: "中村健太", avatar: "/avatars/nakamura.jpg" },
  { id: "8", name: "小林愛", avatar: "/avatars/kobayashi.jpg" }
];






// 旅行グループデータ（実際のメンバー情報付き）
export const travelGroups:TravelGroupDataType[] = [
  {
    id: "1",
    name: "沖縄旅行",
    date: "2025年7月15日 - 7月18日",
    members: [
      { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
      { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
      { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" },
      { id: "4", name: "高橋和子", avatar: "/avatars/takahashi.jpg" },
      { id: "5", name: "伊藤誠", avatar: "/avatars/ito.jpg" }
    ],
    image: "/images/okinawa.jpg",
    status: "計画中"
  },
  {
    id: "2",
    name: "京都観光",
    date: "2025年8月10日 - 8月12日",
    members: [
      { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
      { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
      { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" }
    ],
    image: "/images/kyoto.jpg",
    status: "確定"
  },
  {
    id: "3",
    name: "北海道スキー",
    date: "2025年12月24日 - 12月27日",
    members: [
      { id: "1", name: "田中太郎", avatar: "/avatars/tanaka.jpg" },
      { id: "2", name: "佐藤花子", avatar: "/avatars/sato.jpg" },
      { id: "3", name: "鈴木一郎", avatar: "/avatars/suzuki.jpg" },
      { id: "4", name: "高橋和子", avatar: "/avatars/takahashi.jpg" },
      { id: "5", name: "伊藤誠", avatar: "/avatars/ito.jpg" },
      { id: "6", name: "山田美咲", avatar: "/avatars/yamada.jpg" },
      { id: "7", name: "中村健太", avatar: "/avatars/nakamura.jpg" },
      { id: "8", name: "小林愛", avatar: "/avatars/kobayashi.jpg" }
    ],
    image: "/images/hokkaido.jpg",
    status: "計画中"
  }
];

export const recentActivities:RecentActivityDataType[] = [
  { id: "1", user: "田中太郎", action: "「沖縄旅行」に新しい予定を追加しました", time: "1時間前" },
  { id: "2", user: "佐藤花子", action: "「京都観光」の宿泊先を更新しました", time: "3時間前" },
  { id: "3", user: "鈴木一郎", action: "「北海道スキー」に参加しました", time: "1日前" },
  { id: "4", user: "高橋和子", action: "新しい支出「居酒屋 5,000円」を追加しました", time: "2日前" }
];

























//trip


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










export const TripScheduleData:TripScheduleDataType[] = [
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



































  //coordination
// モックデータベース
export const CoordinationData :CoordinationDataType[] = [
  {
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
  {
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
  {
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
];


//schedule
export const tripScheduleData:ScheduleDataType[] = [  
  {
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
      },
      {
        id: "day3",
        date: "2025-07-17",
        events: []
      },
      {
        id: "day4",
        date: "2025-07-18",
        events: []
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
      },
      {
        id: "pending6",
        title: "青の洞窟シュノーケル",
        location: "真栄田岬",
        type: "activity",
        notes: "神秘的な青の洞窟を体験",
        estimatedDuration: 180,
        priority: "high",
        suggestedBy: "田中太郎"
      }
    ]
  },
  {
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
      },
      {
        id: "day2",
        date: "2025-08-11",
        events: []
      },
      {
        id: "day3",
        date: "2025-08-12",
        events: []
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
      },
      {
        id: "pending4",
        title: "清水寺参拝",
        location: "清水寺",
        type: "activity",
        notes: "夜間ライトアップも見たい",
        estimatedDuration: 90,
        priority: "high",
        suggestedBy: "佐藤花子"
      },
      {
        id: "pending5",
        title: "伏見稲荷大社",
        location: "伏見稲荷大社",
        type: "activity",
        notes: "千本鳥居を歩く",
        estimatedDuration: 120,
        priority: "medium",
        suggestedBy: "鈴木一郎"
      }
    ]
  },
  {
    tripId: "3",
    tripName: "北海道スキー",
    scheduledDays: [
      {
        id: "day1",
        date: "2025-12-24",
        events: []
      },
      {
        id: "day2",
        date: "2025-12-25",
        events: []
      },
      {
        id: "day3",
        date: "2025-12-26",
        events: []
      },
      {
        id: "day4",
        date: "2025-12-27",
        events: []
      }
    ],
    pendingEvents: [
      {
        id: "pending1",
        title: "札幌観光",
        location: "札幌市内",
        type: "activity",
        estimatedDuration: 180,
        priority: "high",
        suggestedBy: "山本隆"
      },
      {
        id: "pending2",
        title: "海鮮丼ランチ",
        location: "札幌市場",
        type: "food",
        notes: "新鮮な海鮮丼を堪能",
        estimatedDuration: 60,
        priority: "high",
        suggestedBy: "中村愛"
      },
      {
        id: "pending3",
        title: "温泉入浴",
        location: "登別温泉",
        type: "activity",
        estimatedDuration: 120,
        priority: "medium",
        suggestedBy: "小林健"
      },
      {
        id: "pending4",
        title: "スキーレッスン",
        location: "ニセコスキー場",
        type: "activity",
        notes: "初心者向けレッスン",
        estimatedDuration: 240,
        priority: "high",
        suggestedBy: "山本隆"
      },
      {
        id: "pending5",
        title: "ジンギスカンディナー",
        location: "すすきの",
        type: "food",
        notes: "北海道名物のジンギスカン",
        estimatedDuration: 120,
        priority: "high",
        suggestedBy: "中村愛"
      }
    ]
  }
];







































//settlement
// モックデータ
export const PaymentData :PaymentRecordType[] = [
    {
      id: "pay-1",
      title: "ホテル宿泊費（全員分）",
      amount: 24000,
      paidBy: "田中太郎",
      paidFor: ["田中太郎", "佐藤花子", "鈴木一郎", "高橋和子"],
      category: "宿泊",
      date: "2025-07-15",
      description: "グランドホテル 2泊分",
      isSettled: false,
    },
    {
      id: "pay-2",
      title: "レンタカー代（全員分）",
      amount: 8000,
      paidBy: "佐藤花子",
      paidFor: ["田中太郎", "佐藤花子", "鈴木一郎", "高橋和子"],
      category: "交通",
      date: "2025-07-15",
      description: "3日間レンタル",
      isSettled: false,
    },
    {
      id: "pay-3",
      title: "ディナー代（3人分）",
      amount: 12000,
      paidBy: "鈴木一郎",
      paidFor: ["田中太郎", "佐藤花子", "鈴木一郎"],
      category: "食事",
      date: "2025-07-15",
      description: "イタリアンレストラン",
      isSettled: false,
    },
    {
      id: "pay-4",
      title: "観光地入場料（全員分）",
      amount: 4000,
      paidBy: "高橋和子",
      paidFor: ["田中太郎", "佐藤花子", "鈴木一郎", "高橋和子"],
      category: "観光",
      date: "2025-07-16",
      description: "美術館入場料",
      isSettled: false,
    },
  ] 




















































