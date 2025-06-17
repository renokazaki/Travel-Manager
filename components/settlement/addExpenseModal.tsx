"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, DollarSign, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddExpenseModalProps {
  memberNames: string[];
}

export function AddExpenseModal({ memberNames }: AddExpenseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    paidBy: "",
    paidFor: [] as string[],
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  const categories = ["宿泊", "交通", "食事", "観光", "その他"];

  const handleMemberToggle = (member: string) => {
    setFormData(prev => ({
      ...prev,
      paidFor: prev.paidFor.includes(member)
        ? prev.paidFor.filter(m => m !== member)
        : [...prev.paidFor, member]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      paidFor: memberNames
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 支払い記録を保存（実際のAPIコール）
    console.log("新しい支払い記録:", formData);
    
    // 自動で精算取引が生成されることをユーザーに通知
    const perPersonAmount = Number(formData.amount) / formData.paidFor.length;
    const settlementTransactions = formData.paidFor
      .filter(person => person !== formData.paidBy)
      .map(person => ({
        from: person,
        to: formData.paidBy,
        amount: Math.round(perPersonAmount)
      }));
    
    console.log("自動生成される精算取引:", settlementTransactions);
    
    setIsOpen(false);
    // フォームリセット
    setFormData({
      title: "",
      amount: "",
      paidBy: "",
      paidFor: [],
      category: "",
      date: new Date().toISOString().split('T')[0],
      description: ""
    });
  };

  // 精算取引のプレビュー
  const getSettlementPreview = () => {
    if (!formData.amount || !formData.paidBy || formData.paidFor.length === 0) {
      return null;
    }

    const perPersonAmount = Number(formData.amount) / formData.paidFor.length;
    const settlements = formData.paidFor
      .filter(person => person !== formData.paidBy)
      .map(person => ({
        from: person,
        to: formData.paidBy,
        amount: Math.round(perPersonAmount)
      }));

    return settlements;
  };

  const settlementPreview = getSettlementPreview();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
          <Plus className="mr-2 h-4 w-4" />
          支払いを追加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新しい支払いを記録</DialogTitle>
          <DialogDescription>
            支払い記録を追加すると、自動で精算取引が生成されます
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* 支払い内容 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                内容 *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="例: ホテル宿泊費"
                className="col-span-3"
                required
              />
            </div>

            {/* 金額 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                金額 *
              </Label>
              <div className="col-span-3 relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* 支払った人 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paidBy" className="text-right">
                支払った人 *
              </Label>
              <Select
                value={formData.paidBy}
                onValueChange={(value) => setFormData(prev => ({ ...prev, paidBy: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="支払った人を選択" />
                </SelectTrigger>
                <SelectContent>
                  {memberNames.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 対象者 */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                対象者 *
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    誰の分を支払ったかを選択してください
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    全員選択
                  </Button>
                </div>
                {memberNames.map((member) => (
                  <div key={member} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member}`}
                      checked={formData.paidFor.includes(member)}
                      onCheckedChange={() => handleMemberToggle(member)}
                    />
                    <Label
                      htmlFor={`member-${member}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {member}
                      {member === formData.paidBy && " (支払者)"}
                    </Label>
                  </div>
                ))}
                {formData.paidFor.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    1人あたり: ¥{formData.amount ? Math.round(Number(formData.amount) / formData.paidFor.length).toLocaleString() : 0}
                  </p>
                )}
              </div>
            </div>

            {/* 精算取引プレビュー */}
            {settlementPreview && settlementPreview.length > 0 && (
              <div className="col-span-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">自動生成される精算取引:</p>
                      {settlementPreview.map((settlement, index) => (
                        <div key={index} className="text-sm bg-blue-50 p-2 rounded flex justify-between">
                          <span>
                            <span className="font-medium">{settlement.from}</span>
                            {" → "}
                            <span className="font-medium">{settlement.to}</span>
                          </span>
                          <span className="font-bold text-blue-600">
                            ¥{settlement.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* カテゴリ */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                カテゴリ *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 日付 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                日付 *
              </Label>
              <div className="col-span-3 relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* 説明 */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                説明
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="詳細な説明（任意）"
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              キャンセル
            </Button>
            <Button 
              type="submit"
              disabled={!formData.title || !formData.amount || !formData.paidBy || formData.paidFor.length === 0 || !formData.category}
            >
              記録する
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
