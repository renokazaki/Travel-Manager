import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator,
  DollarSign,
  Users,
  Receipt,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Edit,
  Trash2
} from "lucide-react";
import { Trip, tripData } from "@/lib/mockdeta";

// データ取得関数
async function getTripData(tripId: string): Promise<Trip | null> {
  return tripData[tripId] || null;
}

// 精算データのモック
const mockSettlementData = {
  expenses: [
    {
      id: "exp-1",
      title: "ホテル宿泊費",
      amount: 24000,
      paidBy: "田中太郎",
      participants: ["田中太郎", "佐藤花子", "鈴木一郎", "高橋和子"],
      date: "2025-07-15",
      category: "宿泊"
    },
    {
      id: "exp-2", 
      title: "レンタカー代",
      amount: 8000,
      paidBy: "佐藤花子",
      participants: ["田中太郎", "佐藤花子", "鈴木一郎", "高橋和子"],
      date: "2025-07-15",
      category: "交通"
    },
    {
      id: "exp-3",
      title: "ディナー代",
      amount: 12000,
      paidBy: "鈴木一郎", 
      participants: ["田中太郎", "佐藤花子", "鈴木一郎"],
      date: "2025-07-15",
      category: "食事"
    },
    {
      id: "exp-4",
      title: "お土産代",
      amount: 6000,
      paidBy: "高橋和子",
      participants: ["高橋和子"],
      date: "2025-07-16",
      category: "個人"
    }
  ],
  settlements: [
    {
      from: "佐藤花子",
      to: "田中太郎", 
      amount: 4000,
      status: "未精算" as const
    },
    {
      from: "鈴木一郎",
      to: "田中太郎",
      amount: 2000,
      status: "完了" as const
    },
    {
      from: "高橋和子", 
      to: "田中太郎",
      amount: 6000,
      status: "未精算" as const
    }
  ]
};

// カテゴリの色を取得
function getCategoryColor(category: string) {
  const colors = {
    宿泊: 'bg-blue-100 text-blue-800',
    交通: 'bg-green-100 text-green-800', 
    食事: 'bg-amber-100 text-amber-800',
    個人: 'bg-purple-100 text-purple-800',
    その他: 'bg-gray-100 text-gray-800'
  };
  return colors[category as keyof typeof colors] || colors.その他;
}

// ステータスの色を取得
function getStatusColor(status: string) {
  switch (status) {
    case '完了': return 'bg-green-100 text-green-800';
    case '未精算': return 'bg-red-100 text-red-800';
    case '確認中': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// 精算計算
function calculateSettlement(expenses: typeof mockSettlementData.expenses, members: string[]) {
  const memberBalances: Record<string, number> = {};
  
  // 各メンバーの初期残高を0に設定
  members.forEach(member => {
    memberBalances[member] = 0;
  });

  // 支出を計算
  expenses.forEach(expense => {
    const perPersonAmount = expense.amount / expense.participants.length;
    
    // 支払った人にプラス
    memberBalances[expense.paidBy] += expense.amount;
    
    // 参加者全員からマイナス
    expense.participants.forEach(participant => {
      memberBalances[participant] -= perPersonAmount;
    });
  });

  return memberBalances;
}

// 支出項目コンポーネント
function ExpenseItem({ expense }: { expense: typeof mockSettlementData.expenses[0] }) {
  return (
    <div className="flex items-start justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-medium">{expense.title}</h4>
          <Badge className={getCategoryColor(expense.category)} variant="secondary">
            {expense.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-1">
          支払い: {expense.paidBy}
        </p>
        <p className="text-sm text-muted-foreground">
          参加者: {expense.participants.join(', ')}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {expense.date}
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold">¥{expense.amount.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">
          1人 ¥{Math.round(expense.amount / expense.participants.length).toLocaleString()}
        </p>
        <div className="flex gap-1 mt-2">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// 精算項目コンポーネント
function SettlementItem({ settlement }: { settlement: typeof mockSettlementData.settlements[0] }) {
  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${
      settlement.status === '完了' ? 'bg-green-50' : 'bg-white'
    }`}>
      <div className="flex items-center gap-3">
        {settlement.status === '完了' ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600" />
        )}
        <div>
          <p className="font-medium">
            {settlement.from}
            <ArrowRight className="inline mx-2 h-4 w-4" />
            {settlement.to}
          </p>
          <Badge className={getStatusColor(settlement.status)} variant="secondary">
            {settlement.status}
          </Badge>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold">¥{settlement.amount.toLocaleString()}</p>
        {settlement.status === '未精算' && (
          <Button size="sm" className="mt-2">
            精算完了
          </Button>
        )}
      </div>
    </div>
  );
}

// 静的生成用のパラメータを生成
export async function generateStaticParams() {
  const tripIds = Object.keys(tripData);
  return tripIds.map((id) => ({ id }));
}

// メインコンポーネント
export default async function TripSettlement({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id: tripId } = await params;
  const trip = await getTripData(tripId);

  if (!trip) {
    notFound();
  }

  const expenses = mockSettlementData.expenses;
  const settlements = mockSettlementData.settlements;
  const memberNames = trip.members.map(m => m.name);
  const balances = calculateSettlement(expenses, memberNames);
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingSettlements = settlements.filter(s => s.status === '未精算');

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{trip.name} - 精算</h1>
          <p className="text-muted-foreground">旅行の支出と精算を管理</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
          <Plus className="mr-2 h-4 w-4" />
          支出を追加
        </Button>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">¥{totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">総支出</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">¥{Math.round(totalExpenses / memberNames.length).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">1人あたり</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Calculator className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{pendingSettlements.length}</p>
              <p className="text-sm text-muted-foreground">未精算項目</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 支出一覧 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              支出一覧
            </CardTitle>
            <CardDescription>旅行での全ての支出記録</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">支出記録がありません</p>
                  <Button variant="outline" className="mt-4">
                    最初の支出を追加
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 精算状況 */}
        <div className="space-y-6">
          {/* 残高 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                メンバー別残高
              </CardTitle>
              <CardDescription>各メンバーの貸し借り状況</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(balances).map(([member, balance]) => (
                  <div key={member} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="font-medium">{member}</span>
                    <span className={`font-bold ${
                      balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {balance > 0 ? '+' : ''}¥{Math.round(balance).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 精算項目 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                精算項目
              </CardTitle>
              <CardDescription>必要な精算の一覧</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settlements.length > 0 ? (
                  settlements.map((settlement, index) => (
                    <SettlementItem key={index} settlement={settlement} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">全ての精算が完了しています</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}