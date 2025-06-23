import { Event, EventType, Priority, EventStatus } from "@prisma/client";

// 基本のイベント型（PrismaのEventをベース）
export type ScheduleEvent = {
  id: string;
  title: string;
  location: string | null;
  type: EventType | null;
  priority: Priority | null;
  notes: string | null;
  durationMinutes: number | null;
  status: EventStatus;
  order: number | null;
  date: string | null; // YYYY-MM-DD形式
};

// 日程グループ
export type ScheduleDay = {
  id: string;
  date: string; // YYYY-MM-DD形式
  events: ScheduleEvent[];
};

// スケジュール全体のデータ
export type ScheduleData = {
  tripId: string;
  tripName: string;
  pendingEvents: ScheduleEvent[]; // status: PENDING
  scheduledDays: ScheduleDay[]; // status: SCHEDULED
};

// 保存用のデータ型
export type SaveScheduleData = {
  eventUpdates: {
    id: string;
    status: EventStatus;
    date: string | null;
    order: number | null;
  }[];
};

// API応答型
export type ScheduleResponse = {
  success: boolean;
  data?: ScheduleData;
  error?: string;
};