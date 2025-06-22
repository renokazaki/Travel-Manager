'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Search } from "lucide-react";
import { useState } from "react";

interface AddMemberModalProps {
  tripId: string;
  addMemberToTrip: (formData: FormData) => Promise<{ success: boolean }>;
  children?: React.ReactNode;
}

export default function AddMemberModal({ tripId, addMemberToTrip, children }: AddMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userID.trim()) {
      setError('ユーザー名を入力してください');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('tripId', tripId);
      formData.append('userID', userID.trim());
      
      const result = await addMemberToTrip(formData);
      
      if (result.success) {
        setUserID('');
        setIsOpen(false);
        // ページをリロード
        window.location.reload();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'メンバーの追加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setUserID('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            メンバー追加
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            メンバーを追加
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userID">ユーザーID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="userID"
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                placeholder="友達のユーザーIDを入力"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              追加したい友達のユーザーIDを入力してください
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                💡 ヒント
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                追加されたメンバーは旅行の予定や精算を共有できるようになります
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !userID.trim()}
              className="bg-gradient-to-r from-blue-600 to-teal-600"
            >
              {isLoading ? '追加中...' : '追加'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}