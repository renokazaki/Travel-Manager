'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";

interface AvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: string) => void;
  selectedDate: string | null;
  currentStatus: string;
}

export default function AvailabilityDialog({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  currentStatus,
}: AvailabilityDialogProps) {
  const [status, setStatus] = useState(currentStatus);

  // ダイアログが開くたびに現在の状況をセット
  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  const handleSave = () => {
    onSave(status);
  };

  // 日付フォーマット
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    });
  };

  // 曜日の色を取得
  const getDayColor = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDay();
    
    if (day === 0) return "text-red-600"; // 日曜日
    if (day === 6) return "text-blue-600"; // 土曜日
    return "text-gray-900 dark:text-gray-100"; // 平日
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            参加状況の設定
          </DialogTitle>
        </DialogHeader>
        
        {selectedDate && (
          <div className="py-4">
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className={`font-semibold text-lg ${getDayColor(selectedDate)}`}>
                {formatDate(selectedDate)}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                この日程での参加可能性を選択してください
              </p>
            </div>
            
            <RadioGroup 
              value={status} 
              onValueChange={setStatus}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
                <RadioGroupItem value="AVAILABLE" id="available" />
                <Label htmlFor="available" className="cursor-pointer flex items-center gap-3 flex-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm" />
                  <div>
                    <p className="font-medium">参加可能</p>
                    <p className="text-sm text-muted-foreground">この日程で参加できます</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors">
                <RadioGroupItem value="MAYBE" id="maybe" />
                <Label htmlFor="maybe" className="cursor-pointer flex items-center gap-3 flex-1">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm" />
                  <div>
                    <p className="font-medium">未定</p>
                    <p className="text-sm text-muted-foreground">まだ確定していません</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                <RadioGroupItem value="UNAVAILABLE" id="unavailable" />
                <Label htmlFor="unavailable" className="cursor-pointer flex items-center gap-3 flex-1">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm" />
                  <div>
                    <p className="font-medium">参加不可</p>
                    <p className="text-sm text-muted-foreground">この日程では参加できません</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="text-sm text-muted-foreground">
            💡 いつでも変更可能です
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              保存
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}