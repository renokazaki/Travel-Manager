'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface Member {
  id: string;
  name: string;
}

interface BulkEditModalProps {
  tripId: string;
  members: Member[];
  saveBulkAvailability: (formData: FormData) => Promise<void>;
}

export default function BulkEditModal({ tripId, members, saveBulkAvailability }: BulkEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [status, setStatus] = useState<string>('AVAILABLE');

  const handleSave = async () => {
    if (!selectedMemberId || selectedDates.length === 0) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('tripId', tripId);
      formData.append('memberId', selectedMemberId);
      formData.append('dates', JSON.stringify(selectedDates.map(date => date.toISOString().split('T')[0])));
      formData.append('status', status);
      
      await saveBulkAvailability(formData);
      
      handleReset();
      setIsOpen(false);
      // ページをリロード
      window.location.reload();
    } catch (error) {
      alert('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedDates([]);
    setStatus('AVAILABLE');
    setSelectedMemberId('');
  };

  const handleClose = () => {
    setIsOpen(false);
    handleReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="shadow-md hover:shadow-lg transition-shadow">
          <Edit className="h-4 w-4 mr-2" />
          一括編集
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            一括日程編集
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* メンバー選択 */}
          <div className="space-y-2">
            <Label htmlFor="member-select">編集対象メンバー</Label>
            <Select 
              value={selectedMemberId} 
              onValueChange={setSelectedMemberId}
            >
              <SelectTrigger id="member-select">
                <SelectValue placeholder="メンバーを選択してください" />
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
          
          {/* 参加状況選択 */}
          <div className="space-y-2">
            <Label>設定する参加状況</Label>
            <RadioGroup 
              value={status} 
              onValueChange={setStatus} 
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
                <RadioGroupItem value="AVAILABLE" id="bulk-available" />
                <Label htmlFor="bulk-available" className="cursor-pointer flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium">参加可能</p>
                    <p className="text-xs text-muted-foreground">選択した日程すべてで参加可能に設定</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors">
                <RadioGroupItem value="MAYBE" id="bulk-maybe" />
                <Label htmlFor="bulk-maybe" className="cursor-pointer flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div>
                    <p className="font-medium">未定</p>
                    <p className="text-xs text-muted-foreground">選択した日程すべてで未定に設定</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                <RadioGroupItem value="UNAVAILABLE" id="bulk-unavailable" />
                <Label htmlFor="bulk-unavailable" className="cursor-pointer flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div>
                    <p className="font-medium">参加不可</p>
                    <p className="text-xs text-muted-foreground">選択した日程すべてで参加不可に設定</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* 日付選択 */}
          <div className="space-y-2">
            <Label>対象日程を選択 (複数選択可)</Label>
            <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-900">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => setSelectedDates(dates || [])}
                locale={ja}
                className="mx-auto"
                disabled={isLoading}
              />
            </div>
            {selectedDates.length > 0 && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">選択中: {selectedDates.length}日間</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedDates.slice(0, 10).map((date, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {format(date, 'MM/dd (E)', { locale: ja })}
                    </span>
                  ))}
                  {selectedDates.length > 10 && (
                    <span className="text-xs text-muted-foreground">
                      ...他{selectedDates.length - 10}日
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleReset} 
            type="button"
            disabled={isLoading}
          >
            リセット
          </Button>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button 
              onClick={handleSave}
              disabled={selectedDates.length === 0 || !selectedMemberId || isLoading}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              {isLoading ? '保存中...' : `${selectedDates.length}日分を保存`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}