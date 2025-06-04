'use client';

import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";

interface CoordinationHeaderProps {
  tripName: string;
}

export default function CoordinationHeader({ tripName }: CoordinationHeaderProps) {
  const handleBulkEdit = () => {
    // TODO: 一括編集ダイアログを開く
    console.log("Bulk edit clicked");
  };

  const handleAddMember = () => {
    // TODO: メンバー追加ダイアログを開く
    console.log("Add member clicked");
  };

  return (
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
        <Button 
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          onClick={handleAddMember}
        >
          <Plus className="h-4 w-4 mr-2" />
          メンバー追加
        </Button>
      </div>
    </div>
  );
}