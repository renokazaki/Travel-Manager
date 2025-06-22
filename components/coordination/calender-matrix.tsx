'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import AvailabilityDialog from "@/components/coordination/availability-dialog";
import { useState } from "react";

interface Member {
  id: string;
  name: string;
}

interface CalendarMatrixProps {
  tripId: string;
  currentUserId: string;
  members: Member[];
  availabilities: Record<string, Record<string, string>>;
  saveAvailability: (formData: FormData) => Promise<void>;
}

// 状況の表示設定
const STATUS_CONFIG = {
  AVAILABLE: { symbol: "○", color: "text-green-600", bg: "bg-green-50" },
  UNAVAILABLE: { symbol: "×", color: "text-red-600", bg: "bg-red-50" },
  MAYBE: { symbol: "?", color: "text-yellow-600", bg: "bg-yellow-50" },
  default: { symbol: "-", color: "text-gray-400", bg: "bg-gray-50" },
};

// 月の日付を取得
function getMonthDates(year: number, month: number): Date[] {
  const dates: Date[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= lastDay; day++) {
    dates.push(new Date(year, month, day));
  }
  return dates;
}

// 日付フォーマット
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateDisplay(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  return `${month}/${day}(${dayNames[date.getDay()]})`;
}

export default function CalendarMatrix({ 
  tripId, 
  currentUserId, 
  members, 
  availabilities, 
  saveAvailability 
}: CalendarMatrixProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    date: string | null;
    memberId: string | null;
  }>({ isOpen: false, date: null, memberId: null });

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

  // セルクリック（自分の分のみ変更可能）
  const handleCellClick = (date: string, memberId: string) => {
    if (memberId !== currentUserId) return; // 自分の分のみ変更可能
    
    setDialogState({
      isOpen: true,
      date,
      memberId,
    });
  };

  // 日付セルクリック（一括設定用）
  const handleDateClick = (date: string) => {
    setDialogState({
      isOpen: true,
      date,
      memberId: currentUserId, // 自分のデフォルト
    });
  };

  // ダイアログを閉じる
  const closeDialog = () => {
    setDialogState({ isOpen: false, date: null, memberId: null });
  };

  // 状況保存
  const handleSaveAvailability = async (status: string) => {
    if (!dialogState.date || !dialogState.memberId) return;

    const formData = new FormData();
    formData.append('tripId', tripId);
    formData.append('memberId', dialogState.memberId);
    formData.append('date', dialogState.date);
    formData.append('status', status);
    
    try {
      await saveAvailability(formData);
      closeDialog();
      // ページをリロード
      window.location.reload();
    } catch (error) {
      alert('保存に失敗しました');
    }
  };

  // 現在の状況を取得
  const getCurrentStatus = (): string => {
    if (!dialogState.date || !dialogState.memberId) return 'MAYBE';
    return availabilities[dialogState.memberId]?.[dialogState.date] || 'MAYBE';
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              {year}年 {monthNames[month]} の日程調整
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">前月</span>
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <span className="hidden sm:inline mr-1">次月</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* 使い方説明 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">使い方</span>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              • 自分の列のセルをクリックして参加状況を設定
              • 日付列をクリックして特定の日の状況を設定  
              • 一括編集ボタンで複数日をまとめて設定
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* ヘッダー */}
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <th className="w-28 p-3 border text-center font-semibold sticky left-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                    日付
                  </th>
                  {members.map((member) => (
                    <th key={member.id} className="w-20 p-3 border text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          member.id === currentUserId 
                            ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white' 
                            : 'bg-gray-400 text-white'
                        }`}>
                          {member.name.substring(0, 2)}
                        </div>
                        <div className="text-xs font-medium truncate w-full text-center">
                          {member.name}
                        </div>
                        {member.id === currentUserId && (
                          <div className="text-xs text-blue-600 font-semibold">(あなた)</div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              {/* データ */}
              <tbody>
                {monthDates.map((date) => {
                  const dateStr = formatDate(date);
                  const availableCount = members.filter(member => 
                    availabilities[member.id]?.[dateStr] === 'AVAILABLE'
                  ).length;

                  return (
                    <tr key={dateStr} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td 
                        className="p-3 border text-center sticky left-0 bg-white dark:bg-gray-950 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                        onClick={() => handleDateClick(dateStr)}
                        title="クリックしてこの日の状況を設定"
                      >
                        <div className="text-sm font-medium">
                          {formatDateDisplay(date)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {availableCount}/{members.length}人
                        </div>
                        {availableCount === members.length && members.length > 0 && (
                          <div className="text-xs bg-green-100 text-green-800 px-1 rounded mt-1">
                            全員OK
                          </div>
                        )}
                      </td>
                      {members.map((member) => {
                        const status = availabilities[member.id]?.[dateStr];
                        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.default;
                        const isCurrentUser = member.id === currentUserId;
                        
                        return (
                          <td
                            key={member.id}
                            className={`p-2 border h-16 text-center transition-all ${
                              isCurrentUser 
                                ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 hover:scale-105' 
                                : 'cursor-default'
                            } ${config.bg}`}
                            onClick={() => handleCellClick(dateStr, member.id)}
                            title={
                              isCurrentUser 
                                ? 'クリックして状況を変更' 
                                : `${member.name}の状況: ${
                                    status === 'AVAILABLE' ? '参加可能' :
                                    status === 'UNAVAILABLE' ? '参加不可' :
                                    status === 'MAYBE' ? '未定' : '未回答'
                                  }`
                            }
                          >
                            <div className="flex items-center justify-center h-full">
                              <span className={`text-2xl font-bold ${config.color} ${
                                isCurrentUser ? 'transform hover:scale-110 transition-transform' : ''
                              }`}>
                                {config.symbol}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ダイアログ */}
      <AvailabilityDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onSave={handleSaveAvailability}
        selectedDate={dialogState.date}
        currentStatus={getCurrentStatus()}
      />
    </>
  );
}