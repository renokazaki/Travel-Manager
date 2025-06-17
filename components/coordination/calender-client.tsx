'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import AvailabilityDialog, { AvailabilityStatus as DialogAvailabilityStatus } from "./availability-dialog";

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

interface CalendarClientProps {
  scheduleData: ScheduleData;
}

// 参加状況のアイコンとスタイル
const AvailabilityStatus = {
  available: {
    icon: <div className="w-3 h-3 bg-green-500 rounded-full" />,
    label: "参加可能",
    color: "bg-green-500"
  },
  unavailable: {
    icon: <div className="w-3 h-3 bg-red-500 rounded-full" />,
    label: "参加不可",
    color: "bg-red-500"
  },
  maybe: {
    icon: <div className="w-3 h-3 bg-yellow-500 rounded-full" />,
    label: "未定",
    color: "bg-yellow-500"
  }
};

// 日付ユーティリティ関数
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  
  // 月の最初の週の空白日を追加
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  
  // 月の日付を追加
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }
  
  // 月の最後の週の空白日を追加
  const endPadding = 7 - (days.length % 7);
  if (endPadding < 7) {
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }
  
  return days;
}

// セルコンポーネント
function CalendarCell({ 
  date, 
  currentMonth, 
  members, 
  availabilities,
  onDateClick 
}: {
  date: Date;
  currentMonth: number;
  members: Member[];
  availabilities: ScheduleData['availabilities'];
  onDateClick: (date: string) => void;
}) {
  const dateStr = formatDate(date);
  const isCurrentMonth = date.getMonth() === currentMonth;
  
  // 参加状況の集計
  const statusCounts = { available: 0, unavailable: 0, maybe: 0 };
  members.forEach(member => {
    const status = availabilities[member.id]?.[dateStr];
    if (status) {
      statusCounts[status]++;
    }
  });
  
  return (
    <div
      className={cn(
        "min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
        !isCurrentMonth && "bg-gray-50 dark:bg-gray-900 text-muted-foreground",
      )}
      onClick={() => onDateClick(dateStr)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "text-sm font-medium",
        )}>
          {date.getDate()}
        </span>
      </div>
      
      {/* メンバーの参加状況 */}
      <div className="space-y-1">
        {members.map(member => {
          const status = availabilities[member.id]?.[dateStr];
          if (!status) return null;
          
          return (
            <div key={member.id} className="flex items-center gap-1">
              {AvailabilityStatus[status].icon}
              <span className="text-xs truncate">{member.name}</span>
            </div>
          );
        })}
      </div>
      
      {/* 参加可能人数サマリー */}
      {(statusCounts.available > 0 || statusCounts.unavailable > 0) && (
        <div className="mt-2 text-xs text-muted-foreground">
          〇{statusCounts.available} ×{statusCounts.unavailable}
          {statusCounts.maybe > 0 && ` ?${statusCounts.maybe}`}
        </div>
      )}
    </div>
  );
}

// カレンダークライアントコンポーネント
export default function CalendarClient({ scheduleData }: CalendarClientProps) {
  // 初期月を現在の月に設定
  const getInitialDate = () => {
    return new Date(); // 現在の月
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  
  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];
  
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  
  // 月の移動
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };
  
  // 特定の月にジャンプ
  const jumpToMonth = (targetYear: number, targetMonth: number) => {
    setCurrentDate(new Date(targetYear, targetMonth));
  };
  
  // ダイアログの状態管理
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // 日付クリック処理
  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsDialogOpen(true);
  };
  
  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  // 空き状況を保存する
  const handleSaveAvailability = (status: DialogAvailabilityStatus) => {
    if (!selectedDate) return;
    
    // 実際のアプリケーションではAPIを呼び出してデータを保存
    console.log(`保存: ${selectedDate} - 状態: ${status}`);
    
    // モックデータを更新（実際のアプリケーションではこの部分はサーバーサイドで処理）
    const currentUserId = "1"; // 仮のユーザーID
    
    // 新しいavailabilitiesオブジェクトを作成
    const updatedAvailabilities = {
      ...scheduleData.availabilities,
      [currentUserId]: {
        ...scheduleData.availabilities[currentUserId],
        [selectedDate]: status
      }
    };
    
    // 更新されたデータでUIを更新
    scheduleData.availabilities = updatedAvailabilities;
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl">
              {year}年 {monthNames[month]}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* カレンダーグリッド */}
          <div className="grid grid-cols-7">
            {/* 曜日ヘッダー */}
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-medium bg-gray-100 dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700">
                {day}
              </div>
            ))}
            
            {/* 日付セル */}
            {daysInMonth.map((date, index) => (
              <CalendarCell
                key={index}
                date={date}
                currentMonth={month}
                members={scheduleData.members}
                availabilities={scheduleData.availabilities}
                onDateClick={handleDateClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* 空き状況登録ダイアログ */}
      <AvailabilityDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveAvailability}
        selectedDate={selectedDate}
      />
    </>
  );
}