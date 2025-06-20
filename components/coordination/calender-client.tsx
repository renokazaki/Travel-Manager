// ===== CalendarClient.tsx の簡素化版 =====
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
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

// 参加状況のシンボルと色
const StatusConfig = {
  available: { symbol: "〇", color: "text-green-600", bg: "bg-green-50" },
  unavailable: { symbol: "×", color: "text-red-600", bg: "bg-red-50" },
  maybe: { symbol: "?", color: "text-yellow-600", bg: "bg-yellow-50" },
  none: { symbol: "-", color: "text-gray-400", bg: "bg-gray-50" }
};

// 日付フォーマット関数
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateDisplay(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  return `${month}/${day}(${dayNames[date.getDay()]})`;
}

// 月の日付を取得
function getMonthDates(year: number, month: number): Date[] {
  const days: Date[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= lastDay; day++) {
    days.push(new Date(year, month, day));
  }
  return days;
}

// ===== 統合されたマトリックス表コンポーネント =====
function MatrixView({ 
  dates,
  members, 
  availabilities,
  onDateClick,
  onMemberClick,
  isMobile = false
}: {
  dates: Date[];
  members: Member[];
  availabilities: ScheduleData['availabilities'];
  onDateClick: (date: string) => void;
  onMemberClick: (date: string, memberId: string) => void;
  isMobile?: boolean;
}) {
  // レスポンシブ対応のサイズ設定
  const sizes = isMobile 
    ? { dateCol: "w-20", memberCol: "w-16", cellHeight: "h-12", padding: "p-4" }
    : { dateCol: "w-32", memberCol: "w-24", cellHeight: "h-20", padding: "p-6" };

  return (
    <div className={sizes.padding}>
      {/* 使い方説明 */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span className={cn("font-medium text-blue-800", isMobile ? "text-sm" : "text-base")}>
            使い方
          </span>
        </div>
        <div className={cn("text-blue-700", isMobile ? "text-xs" : "text-sm")}>
          横スクロールで全メンバー確認 • セルタップで状況変更
        </div>
      </div>

      {/* 凡例 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className={cn("flex items-center justify-around", isMobile ? "text-xs" : "text-sm")}>
          {Object.entries(StatusConfig).slice(0, 3).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1">
              <span className={cn("font-bold", config.color, isMobile ? "text-base" : "text-xl")}>
                {config.symbol}
              </span>
              <span>{key === 'available' ? '参加可能' : key === 'unavailable' ? '参加不可' : '未定'}</span>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <span className={cn("font-bold text-gray-400", isMobile ? "text-base" : "text-xl")}>-</span>
            <span>未回答</span>
          </div>
        </div>
      </div>

      {/* マトリックス表 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* ヘッダー */}
        <div className="flex bg-gray-100 border-b border-gray-200">
          <div className={cn(sizes.dateCol, "p-3 border-r border-gray-200 text-center font-semibold", isMobile ? "text-xs" : "text-sm")}>
            日付
          </div>
          <div className="flex overflow-x-auto min-w-0">
            {members.map((member) => (
              <div key={member.id} className={cn(sizes.memberCol, "p-2 border-r border-gray-200 last:border-r-0 flex flex-col items-center gap-1")}>
                <div className={cn("bg-blue-600 text-white rounded-full flex items-center justify-center font-bold", 
                  isMobile ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm")}>
                  {member.avatar}
                </div>
                <div className={cn("font-medium text-center truncate w-full", isMobile ? "text-xs" : "text-sm")}>
                  {isMobile && member.name.length > 4 ? member.name.substring(0, 3) + '...' : member.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* データ行 */}
        <div className="max-h-[50vh] overflow-y-auto">
          {dates.map((date, dateIndex) => {
            const dateStr = formatDate(date);
            const availableCount = members.filter(member => 
              availabilities[member.id]?.[dateStr] === 'available'
            ).length;

            return (
              <div key={dateIndex} className="flex hover:bg-gray-50">
                {/* 日付列 */}
                <div 
                  className={cn(sizes.dateCol, "p-2 border-r border-gray-200 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors")}
                  onClick={() => onDateClick(dateStr)}
                >
                  <div className={cn("font-medium text-center", isMobile ? "text-xs" : "text-sm")}>
                    {formatDateDisplay(date)}
                  </div>
                  <div className={cn("text-center mt-1 text-gray-500", isMobile ? "text-xs" : "text-sm")}>
                    {availableCount}/{members.length}人
                  </div>
                </div>
                
                {/* メンバー列 */}
                <div className="flex overflow-x-auto min-w-0">
                  {members.map((member) => {
                    const status = availabilities[member.id]?.[dateStr] as keyof typeof StatusConfig;
                    const config = StatusConfig[status] || StatusConfig.none;
                    
                    return (
                      <div 
                        key={member.id}
                        className={cn(
                          sizes.memberCol, sizes.cellHeight,
                          "flex items-center justify-center border-r border-gray-200 border-b border-gray-100 last:border-r-0 cursor-pointer transition-all hover:bg-blue-50",
                          config.bg
                        )}
                        onClick={() => onMemberClick(dateStr, member.id)}
                      >
                        <span className={cn("font-bold", config.color, isMobile ? "text-lg" : "text-2xl")}>
                          {config.symbol}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===== メインコンポーネント =====
export default function CalendarClient({ scheduleData }: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDates = getMonthDates(year, month);
  
  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];
  
  // 月移動
  const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1));
  
  // クリックハンドラー
  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedMemberId("1"); // デフォルトユーザー
    setIsDialogOpen(true);
  };

  const handleMemberClick = (dateStr: string, memberId: string) => {
    setSelectedDate(dateStr);
    setSelectedMemberId(memberId);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMemberId(null);
  };
  
  // 状況保存
  const handleSaveAvailability = (status: DialogAvailabilityStatus) => {
    if (!selectedDate || !selectedMemberId) return;
    
    console.log(`保存: ${selectedDate} - メンバー: ${selectedMemberId} - 状態: ${status}`);
    
    scheduleData.availabilities = {
      ...scheduleData.availabilities,
      [selectedMemberId]: {
        ...scheduleData.availabilities[selectedMemberId],
        [selectedDate]: status
      }
    };
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl">
              {year}年 {monthNames[month]}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* モバイル版 */}
          <div className="block md:hidden">
            <MatrixView
              dates={monthDates}
              members={scheduleData.members}
              availabilities={scheduleData.availabilities}
              onDateClick={handleDateClick}
              onMemberClick={handleMemberClick}
              isMobile={true}
            />
          </div>

          {/* デスクトップ版 */}
          <div className="hidden md:block">
            <MatrixView
              dates={monthDates}
              members={scheduleData.members}
              availabilities={scheduleData.availabilities}
              onDateClick={handleDateClick}
              onMemberClick={handleMemberClick}
              isMobile={false}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* ダイアログ */}
      <AvailabilityDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveAvailability}
        selectedDate={selectedDate}
      />
    </>
  );
}