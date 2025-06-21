import { CalendarDays, MapPin, Utensils, Clock } from "lucide-react";
import { ScheduleDay } from "@/types/types";

// ユーティリティ関数
export const utils = {
  getEventIcon: (type: string) => {
    const icons = {
      travel: CalendarDays,
      accommodation: MapPin,
      food: Utensils,
      activity: Clock,
    };
    return icons[type as keyof typeof icons] || Clock;
  },

  getEventColors: (type: string) => {
    const colors = {
      travel: 'bg-blue-50 border-blue-200 text-blue-600',
      accommodation: 'bg-green-50 border-green-200 text-green-600',
      food: 'bg-amber-50 border-amber-200 text-amber-600',
      activity: 'bg-purple-50 border-purple-200 text-purple-600',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 border-gray-200 text-gray-600';
  },

  getPriorityColor: (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  },

  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    });
  },

  generateNewDayId: (existingDays: ScheduleDay[]): string => {
    const maxDayNum = existingDays.reduce((max, day) => {
      const num = parseInt(day.id.replace('day', '')) || 0;
      return Math.max(max, num);
    }, 0);
    return `day${maxDayNum + 1}`;
  },

  generateNewDate: (existingDays: ScheduleDay[]): string => {
    if (existingDays.length === 0) {
      return new Date().toISOString().split('T')[0];
    }
    
    const lastDate = new Date(Math.max(...existingDays.map(d => new Date(d.date).getTime())));
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate.toISOString().split('T')[0];
  }
};






