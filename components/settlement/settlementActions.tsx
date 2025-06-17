"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MoreVertical, 
  CheckCircle, 
  MessageCircle, 
  Trash2
} from "lucide-react";

interface SettlementActionsProps {
  paymentId: string;
}

export function SettlementActions({ paymentId }: SettlementActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSettledDialog, setShowSettledDialog] = useState(false);

  const handleMarkAsSettled = () => {
    setShowSettledDialog(true);
  };

  const handleConfirmSettled = () => {
    // TODO: APIコール - 支払いを精算済みにマーク
    // これにより関連する精算取引も自動で完了状態になる
    console.log("精算完了:", paymentId);
    setShowSettledDialog(false);
  };

  const handleSendReminder = () => {
    // TODO: 督促機能
    console.log("督促送信:", paymentId);
  };

  const handleDelete = () => {
    // TODO: 削除機能 - 関連する精算取引も削除される
    console.log("削除:", paymentId);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleMarkAsSettled}>
            <CheckCircle className="h-4 w-4 mr-2" />
            精算完了にする
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSendReminder}>
            <MessageCircle className="h-4 w-4 mr-2" />
            督促を送る
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 精算完了確認ダイアログ */}
      <Dialog open={showSettledDialog} onOpenChange={setShowSettledDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>精算完了の確認</DialogTitle>
            <DialogDescription>
              この支払いを精算済みにしますか？関連する精算取引も自動で完了状態になります。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">精算完了後の変更</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 支払い記録が「精算済み」状態になります</li>
                <li>• 関連する精算取引が自動で「完了」状態になります</li>
                <li>• この操作は後から取り消すことができます</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettledDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleConfirmSettled}>
              精算完了にする
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>支払い記録を削除</AlertDialogTitle>
            <AlertDialogDescription>
              この支払い記録を削除してもよろしいですか？関連する精算取引も削除されます。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}