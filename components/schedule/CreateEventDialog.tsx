'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createEvent } from '@/lib/actions/schedule';
import { useSchedule } from '@/contexts/ScheduleContext';
import { EventType, Priority } from '@prisma/client';

const eventTypes = [
  { value: EventType.ACTIVITY, label: 'アクティビティ' },
  { value: EventType.FOOD, label: '食事' },
  { value: EventType.ACCOMMODATION, label: '宿泊' },
  { value: EventType.TRANSPORTATION, label: '移動' },
  { value: EventType.OTHER, label: 'その他' },
];

const priorities = [
  { value: Priority.HIGH, label: '高' },
  { value: Priority.MEDIUM, label: '中' },
  { value: Priority.LOW, label: '低' },
];

type CreateEventDialogProps = {
  children: React.ReactNode;
};

export default function CreateEventDialog({ children }: CreateEventDialogProps) {
  const { data, addNewEvent } = useSchedule();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: EventType.ACTIVITY,
    priority: Priority.MEDIUM,
    notes: '',
    durationMinutes: 60,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      type: EventType.ACTIVITY,
      priority: Priority.MEDIUM,
      notes: '',
      durationMinutes: 60,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('タイトルを入力してください');
      return;
    }

    startTransition(async () => {
      try {
        const result = await createEvent({
          tripId: data.tripId,
          title: formData.title.trim(),
          location: formData.location.trim() || undefined,
          type: formData.type,
          priority: formData.priority,
          notes: formData.notes.trim() || undefined,
          durationMinutes: formData.durationMinutes || undefined,
        });

        if (result.success && result.event) {
          addNewEvent(result.event);
          toast.success('イベントを作成しました');
          setOpen(false);
          resetForm();
        } else {
          toast.error('イベントの作成に失敗しました', {
            description: result.error
          });
        }
      } catch (error) {
        toast.error('エラーが発生しました');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新しいイベントを作成</DialogTitle>
            <DialogDescription>
              候補イベントに追加されます。後でドラッグ&ドロップで日程に移動できます。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* タイトル */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                タイトル <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="例: 美ら海水族館"
                disabled={isPending}
                required
              />
            </div>

            {/* 場所 */}
            <div className="grid gap-2">
              <Label htmlFor="location">場所</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="例: 沖縄県国頭郡"
                disabled={isPending}
              />
            </div>

            {/* タイプと優先度 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>タイプ</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: EventType) => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>優先度</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Priority) => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 所要時間 */}
            <div className="grid gap-2">
              <Label htmlFor="duration">所要時間（分）</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="1440"
                value={formData.durationMinutes}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  durationMinutes: parseInt(e.target.value) || 0 
                }))}
                disabled={isPending}
              />
            </div>

            {/* メモ */}
            <div className="grid gap-2">
              <Label htmlFor="notes">メモ</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="詳細情報があれば入力してください"
                rows={3}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>作成中...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  作成
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}