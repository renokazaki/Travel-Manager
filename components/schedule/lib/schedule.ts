'use server';

import { prisma } from '@/prisma/prisma';
import { revalidatePath } from 'next/cache';
import { EventStatus } from '@prisma/client';
import type { ScheduleData, SaveScheduleData, ScheduleEvent } from '../types/type';

// スケジュールデータを取得
export async function getScheduleData(tripId: string): Promise<ScheduleData> {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        events: {
          orderBy: [
            { status: 'asc' },
            { date: 'asc' },
            { order: 'asc' }
          ]
        }
      }
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    // イベントデータを変換
    const allEvents: ScheduleEvent[] = trip.events.map(event => ({
      id: event.id,
      title: event.title,
      location: event.location,
      type: event.type,
      priority: event.priority,
      notes: event.notes,
      durationMinutes: event.durationMinutes,
      status: event.status,
      order: event.order,
      date: event.date ? event.date.toISOString().split('T')[0] : null
    }));

    // PENDINGイベントを分離
    const pendingEvents = allEvents.filter(event => event.status === EventStatus.PENDING);

    // SCHEDULEDイベントを日付でグループ化
    const scheduledEvents = allEvents.filter(event => event.status === EventStatus.SCHEDULED);
    const eventsByDate = new Map<string, ScheduleEvent[]>();

    scheduledEvents.forEach(event => {
      if (event.date) {
        const dateKey = event.date;
        if (!eventsByDate.has(dateKey)) {
          eventsByDate.set(dateKey, []);
        }
        eventsByDate.get(dateKey)!.push(event);
      }
    });

    // 日程データを作成
    const scheduledDays = Array.from(eventsByDate.entries()).map(([date, events]) => ({
      id: `day-${date}`,
      date,
      events: events.sort((a, b) => (a.order || 0) - (b.order || 0))
    }));

    return {
      tripId: trip.id,
      tripName: trip.name,
      pendingEvents,
      scheduledDays
    };

  } catch (error) {
    console.error('Error fetching schedule data:', error);
    throw new Error('スケジュールデータの取得に失敗しました');
  }
}

// スケジュールを保存
export async function saveScheduleData(data: SaveScheduleData) {
  try {
    await prisma.$transaction(async (tx) => {
      for (const update of data.eventUpdates) {
        await tx.event.update({
          where: { id: update.id },
          data: {
            status: update.status,
            date: update.date ? new Date(update.date) : null,
            order: update.order
          }
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving schedule:', error);
    return { 
      success: false, 
      error: 'スケジュールの保存に失敗しました' 
    };
  }
}

// ページの再検証
export async function revalidateSchedule(tripId: string) {
  revalidatePath(`/trip/${tripId}/schedule`);
}