'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteEventButtonProps {
  eventId: string;
  eventTitle?: string;
  className?: string;
}

export default function DeleteEventButton({ 
  eventId, 
  eventTitle = "このイベント",
  className = "" 
}: DeleteEventButtonProps) {
  const params = useParams();
  const router = useRouter();
  const tripId = params?.id as string;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 削除処理
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // 実際の実装では、APIエンドポイントに削除リクエストを送信
      // const response = await fetch(`/api/trips/${tripId}/schedule/events/${eventId}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) throw new Error('Failed to delete event');

      // モックAPI呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("イベントを削除しました", {
        description: `${eventTitle}を削除しました`
      });
      
      setIsOpen(false);
      router.refresh(); // サーバーコンポーネントを再レンダリング
      
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error("イベントの削除に失敗しました", {
        description: "しばらく時間をおいて再度お試しください"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 ${className}`}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="sm:max-w-[425px] backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg">イベントを削除しますか？</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-base leading-relaxed pt-2">
            <span className="font-medium text-foreground">「{eventTitle}」</span>を削除します。
            <br />
            この操作は取り消すことができません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="gap-2 pt-4">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="min-w-[80px]"
          >
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 min-w-[80px]"
          >
            {isDeleting ? "削除中..." : "削除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}