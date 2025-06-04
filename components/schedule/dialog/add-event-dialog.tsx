'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CalendarDays, Clock, MapPin, Utensils } from "lucide-react";

interface AddEventDialogProps {
  date?: string;
  triggerButton: React.ReactNode;
}

interface EventFormData {
  time: string;
  title: string;
  location: string;
  type: "travel" | "accommodation" | "food" | "activity";
  notes: string;
}

const eventTypes = [
  { value: "travel", label: "移動", icon: CalendarDays, color: "text-blue-600" },
  { value: "accommodation", label: "宿泊", icon: MapPin, color: "text-green-600" },
  { value: "food", label: "食事", icon: Utensils, color: "text-amber-600" },
  { value: "activity", label: "アクティビティ", icon: Clock, color: "text-purple-600" }
];

export default function AddEventDialog({ date, triggerButton }: AddEventDialogProps) {
  const params = useParams();
  const router = useRouter();
  const tripId = params?.id as string;
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    time: "",
    title: "",
    location: "",
    type: "activity",
    notes: ""
  });

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    };
    return date.toLocaleDateString('ja-JP', options);
  };

  // フォームリセット
  const resetForm = () => {
    setFormData({
      time: "",
      title: "",
      location: "",
      type: "activity",
      notes: ""
    });
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.time || !formData.title || !formData.location) {
      toast.error("必須項目を入力してください");
      return;
    }

    setIsLoading(true);

    try {
      // 実際の実装では、APIエンドポイントに送信
      // const response = await fetch(`/api/trips/${tripId}/schedule/events`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     date: date || new Date().toISOString().split('T')[0],
      //     tripId
      //   })
      // });
      
      // if (!response.ok) throw new Error('Failed to add event');

      // モックAPI呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("イベントを追加しました", {
        description: `${formData.title}を${formData.time}に追加しました`
      });
      
      setIsOpen(false);
      resetForm();
      router.refresh(); // サーバーコンポーネントを再レンダリング
      
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error("イベントの追加に失敗しました", {
        description: "しばらく時間をおいて再度お試しください"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ダイアログが閉じられた時の処理
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent text-xl">
            イベントを追加
          </DialogTitle>
          <DialogDescription className="text-base">
            {date ? `${formatDate(date)}のスケジュールにイベントを追加します。` : "新しいイベントを追加します。"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 py-4">
            {/* 時間入力 */}
            <div className="grid gap-2">
              <Label htmlFor="event-time" className="text-sm font-medium">
                時間 <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="event-time" 
                type="time" 
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500" 
                required
              />
            </div>

            {/* タイトル入力 */}
            <div className="grid gap-2">
              <Label htmlFor="event-title" className="text-sm font-medium">
                タイトル <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="event-title" 
                placeholder="例: 美ら海水族館"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500" 
                required
              />
            </div>

            {/* 場所入力 */}
            <div className="grid gap-2">
              <Label htmlFor="event-location" className="text-sm font-medium">
                場所 <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="event-location" 
                placeholder="例: 沖縄県国頭郡"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500" 
                required
              />
            </div>

            {/* タイプ選択 */}
            <div className="grid gap-2">
              <Label htmlFor="event-type" className="text-sm font-medium">
                タイプ
              </Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: EventFormData['type']) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500">
                  <SelectValue placeholder="イベントタイプを選択" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${type.color}`} />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* メモ入力 */}
            <div className="grid gap-2">
              <Label htmlFor="event-notes" className="text-sm font-medium">
                メモ
              </Label>
              <Textarea 
                id="event-notes" 
                placeholder="追加情報があれば入力してください"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 min-h-[80px]" 
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="min-w-[80px]"
            >
              キャンセル
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 min-w-[80px]"
            >
              {isLoading ? "追加中..." : "追加"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}