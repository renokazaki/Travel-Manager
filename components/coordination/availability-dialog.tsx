'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type AvailabilityStatus = "available" | "unavailable" | "maybe";

interface AvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: AvailabilityStatus) => void;
  selectedDate: string | null;
}

export default function AvailabilityDialog({
  isOpen,
  onClose,
  onSave,
  selectedDate,
}: AvailabilityDialogProps) {
  const [status, setStatus] = useState<AvailabilityStatus>("maybe");

  const handleSave = () => {
    onSave(status);
    onClose();
  };

  // 日付のフォーマット
  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>日程の登録</DialogTitle>
        </DialogHeader>
        
        {selectedDate && (
          <div className="py-4">
            <h3 className="font-medium text-lg mb-4">{formatDisplayDate(selectedDate)}</h3>
            
            <RadioGroup value={status} onValueChange={(value) => setStatus(value as AvailabilityStatus)} className="space-y-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="available" id="available" />
                <Label htmlFor="available" className="cursor-pointer flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  参加可能
                </Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="maybe" id="maybe" />
                <Label htmlFor="maybe" className="cursor-pointer flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  未定
                </Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="unavailable" id="unavailable" />
                <Label htmlFor="unavailable" className="cursor-pointer flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  参加不可
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>キャンセル</Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
