'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import BulkEditDialog, { AvailabilityStatus } from "./bulk-edit-dialog";

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

interface CoordinationHeaderProps {
  tripName: string;
  scheduleData: ScheduleData;
  onBulkUpdate?: (memberId: string, dates: string[], status: AvailabilityStatus) => void;
}

export default function CoordinationHeader({ tripName, scheduleData, onBulkUpdate }: CoordinationHeaderProps) {
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);

  const handleBulkEdit = () => {
    setIsBulkEditOpen(true);
  };

  const handleCloseBulkEdit = () => {
    setIsBulkEditOpen(false);
  };

  const handleSaveBulkEdit = (memberId: string, dates: Date[], status: AvailabilityStatus) => {
    // 日付をISO文字列に変換
    const dateStrings = dates.map(date => date.toISOString().split('T')[0]);

    // 親コンポーネントに更新を通知
    if (onBulkUpdate) {
      onBulkUpdate(memberId, dateStrings, status);
    } else {
      // モックデータを直接更新（実際のアプリケーションではこの部分はサーバーサイドで処理）
      console.log(`一括更新: メンバーID ${memberId}, 日付 ${dateStrings.join(', ')}, 状態: ${status}`);

      // 既存のavailabilitiesを取得
      const memberAvailabilities = scheduleData.availabilities[memberId] || {};

      // 新しいavailabilitiesオブジェクトを作成
      const updatedAvailabilities = {
        ...scheduleData.availabilities,
        [memberId]: {
          ...memberAvailabilities,
          ...Object.fromEntries(dateStrings.map(date => [date, status]))
        }
      };

      // 更新されたデータでUIを更新
      scheduleData.availabilities = updatedAvailabilities;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            日程調整カレンダー
          </h1>
          <p className="text-muted-foreground mt-1">
            {tripName} - みんなの空き状況を一目で確認・編集できます
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBulkEdit}>
            <Edit className="h-4 w-4 mr-2" />
            一括編集
          </Button>

        </div>
      </div>

      {/* 一括編集ダイアログ */}
      <BulkEditDialog
        isOpen={isBulkEditOpen}
        onClose={handleCloseBulkEdit}
        onSave={handleSaveBulkEdit}
        members={scheduleData.members}
      />
    </>
  );
}