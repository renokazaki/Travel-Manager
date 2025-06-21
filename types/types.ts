//home
export interface FriendsDataType {
  id: string;
  name: string;
  avatar: string;
}

export interface TripScheduleDataType {
  id: string;
  time: string;
  title: string;
  location: string;
  type: "travel" | "accommodation" | "activity" | "food";
  notes?: string;
  duration: number;
  order: number;
  date: string;
}




//trip
export interface TravelGroupDataType {
  id: string;
  name: string;
  date: string;
  members: FriendsDataType[];
  image: string;
  status: string;
}

export interface RecentActivityDataType {
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
  members: FriendsDataType[];
  destination: string;
  budget: number;
  spentSoFar: number;
  image: string;
  status: "提案" | "計画中" | "確定" | "完了";
  upcomingEvents: TripEvent[];
  recentUpdates: RecentActivityDataType[];
}

export interface TripEvent {
  id: string;
  title: string;
  date: string;
  type: "travel" | "accommodation" | "activity";
}



//coordination
export interface MemberAvailability {
  [date: string]: "available" | "unavailable" | "maybe";
}

export interface CoordinationDataType {
  tripId: string;
  tripName: string;
  members: FriendsDataType[];
  availabilities: {
    [memberId: string]: MemberAvailability;
  };
}


// schedule


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

export interface ScheduleDataType {
  tripId: string;
  tripName: string;
  scheduledDays: ScheduleDay[];
  pendingEvents: PendingEvent[];
}


//settlement
export interface PaymentRecordType {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  paidFor: string[]; // 誰の分を支払ったか
  category: string;
  date: string;
  description?: string;
  isSettled: boolean;
}
