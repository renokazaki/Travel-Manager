'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export type AvailabilityStatus = "available" | "unavailable" | "maybe";

interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface BulkEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberId: string, dates: Date[], status: AvailabilityStatus) => void;
  members: Member[];
}

export default function BulkEditDialog({
  isOpen,
  onClose,
  onSave,
  members
}: BulkEditDialogProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || "");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [status, setStatus] = useState<AvailabilityStatus>("available");

  const handleSave = () => {
    if (selectedMemberId && selectedDates.length > 0) {
      onSave(selectedMemberId, selectedDates, status);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setSelectedDates([]);
    setStatus("available");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>一括日程編集</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* メンバー選択 */}
          <div className="space-y-2">
            <Label htmlFor="member-select">メンバー</Label>
            <Select 
              value={selectedMemberId} 
              onValueChange={setSelectedMemberId}
            >
              <SelectTrigger id="member-select">
                <SelectValue placeholder="メンバーを選択" />
              </SelectTrigger>
              <SelectContent>
                {members.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* 日付選択 */}
          <div className="space-y-2">
            <Label>日付を選択 (複数選択可)</Label>
            <div className="border rounded-md p-3">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={setSelectedDates as any}
                locale={ja}
                className="mx-auto"
              />
            </div>
            {selectedDates.length > 0 && (
              <div className="text-sm text-muted-foreground">
                選択中: {selectedDates.length}日
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedDates.map((date, i) => (
                    <span key={i} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                      {format(date, 'MM/dd (E)', { locale: ja })}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 参加状況選択 */}
          <div className="space-y-2">
            <Label>参加状況</Label>
            <RadioGroup value={status} onValueChange={(value) => setStatus(value as AvailabilityStatus)} className="space-y-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="available" id="bulk-available" />
                <Label htmlFor="bulk-available" className="cursor-pointer flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  参加可能
                </Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="maybe" id="bulk-maybe" />
                <Label htmlFor="bulk-maybe" className="cursor-pointer flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  未定
                </Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="unavailable" id="bulk-unavailable" />
                <Label htmlFor="bulk-unavailable" className="cursor-pointer flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  参加不可
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleReset} type="button">
            リセット
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>キャンセル</Button>
            <Button 
              onClick={handleSave}
              disabled={selectedDates.length === 0 || !selectedMemberId}
            >
              保存
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
