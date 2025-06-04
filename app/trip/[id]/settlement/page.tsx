import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowRight, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { tripData } from "@/lib/mockdeta";

// 型定義
interface PersonSettlement {
  id: string;
  name: string;
  paid: number;
  share: number;
  avatar: string;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  status: "completed" | "pending";
}

interface SettlementData {
  totalExpenses: number;
  perPersonAverage: number;
  people: PersonSettlement[];
  transactions: Transaction[];
}

export async function generateStaticParams() {
  // 実際の実装では、データベースから全ての旅行IDを取得
  // const trips = await prisma.trip.findMany({ select: { id: true } });
  // return trips.map((trip) => ({ id: trip.id }));
  
  // モックデータから旅行IDを生成
  const tripIds = Object.keys(tripData);
  return tripIds.map((id) => ({ id }));
}

// データ取得関数
async function getSettlementData(tripId: string): Promise<SettlementData | null> {
  // 実際の実装では、データベースから精算データを取得
  // const settlementData = await prisma.settlement.findUnique({
  //   where: { tripId },
  //   include: { 
  //     expenses: true, 
  //     transactions: true,
  //     participants: true 
  //   }
  // });
  // return settlementData;
  
 
  
  // モックデータを返す
  return {
    totalExpenses: 284500,
    perPersonAverage: 56900,
    people: [
      { id: "1", name: "田中太郎", paid: 84500, share: 56900, avatar: "田" },
      { id: "2", name: "佐藤花子", paid: 72000, share: 56900, avatar: "佐" },
      { id: "3", name: "鈴木一郎", paid: 63000, share: 56900, avatar: "鈴" },
      { id: "4", name: "高橋和子", paid: 35000, share: 56900, avatar: "高" },
      { id: "5", name: "伊藤誠", paid: 30000, share: 56900, avatar: "伊" },
    ],
    transactions: [
      { id: "1", from: "田中太郎", to: "佐藤花子", amount: 5000, date: "2025-07-10", status: "completed" },
      { id: "2", from: "鈴木一郎", to: "高橋和子", amount: 3000, date: "2025-07-09", status: "pending" },
      { id: "3", from: "伊藤誠", to: "田中太郎", amount: 2500, date: "2025-07-08", status: "completed" },
    ]
  };
}

// 精算状況の計算
function getSettlementStatus(paid: number, share: number) {
  const balance = paid - share;
  const percentage = Math.min((paid / share) * 100, 100);
  
  return {
    balance,
    percentage,
    status: balance >= 0 ? "overpaid" : "underpaid",
    displayText: balance >= 0 
      ? `+¥${Math.abs(balance).toLocaleString()}（受け取り）`
      : `-¥${Math.abs(balance).toLocaleString()}（支払い）`
  };
}

// 個人精算カードコンポーネント
function PersonSettlementCard({ person }: { person: PersonSettlement }) {
  const settlement = getSettlementStatus(person.paid, person.share);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900 dark:to-teal-900 text-blue-700 dark:text-blue-300">
              {person.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{person.name}</p>
            <p className="text-sm text-muted-foreground">
              支払い済み: ¥{person.paid.toLocaleString()} / 負担額: ¥{person.share.toLocaleString()}
            </p>
            <p className={cn(
              "text-sm font-medium",
              settlement.status === "overpaid" 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            )}>
              {settlement.displayText}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            settlement.status === "overpaid" 
              ? "border-green-300 hover:bg-green-50 dark:hover:bg-green-950" 
              : "border-red-300 hover:bg-red-50 dark:hover:bg-red-950"
          )}
        >
          精算する
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <Progress 
        value={settlement.percentage} 
        className={cn(
          "h-2",
          settlement.status === "overpaid" ? "text-green-600" : "text-red-600"
        )} 
      />
    </div>
  );
}

// 取引履歴コンポーネント
function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={cn(
          "p-2 rounded-full",
          transaction.status === "completed" 
            ? "bg-green-100 dark:bg-green-900" 
            : "bg-yellow-100 dark:bg-yellow-900"
        )}>
          <ArrowRight className={cn(
            "h-4 w-4",
            transaction.status === "completed" 
              ? "text-green-600 dark:text-green-400" 
              : "text-yellow-600 dark:text-yellow-400"
          )} />
        </div>
        <div>
          <p className="font-medium">
            {transaction.from} → {transaction.to}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString('ja-JP')}
            </p>
            <span className={cn(
              "text-xs px-2 py-1 rounded",
              transaction.status === "completed" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            )}>
              {transaction.status === "completed" ? "完了" : "保留中"}
            </span>
          </div>
        </div>
      </div>
      <span className="font-semibold text-lg">¥{transaction.amount.toLocaleString()}</span>
    </div>
  );
}

// メインコンポーネント
export default async function SettlementPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // paramsをawaitして値を取得
  const { id: tripId } = await params;
  
  // データを取得
  const settlementData = await getSettlementData(tripId);
  
  // データが見つからない場合は404ページを表示
  if (!settlementData) {
    notFound();
  }

  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto pb-24 md:pb-12">
      <div className="flex flex-col space-y-6">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              精算管理
            </h1>
            <p className="text-muted-foreground mt-1">
              グループの支出を記録・精算しましょう
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            支出を追加
          </Button>
        </div>

        <div className="grid gap-6">
          {/* サマリーカード */}
          <Card className="p-6 border-l-4 border-l-blue-500">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              支出サマリー
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/50 dark:to-teal-950/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">グループ総支出</span>
                </div>
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  ¥{settlementData.totalExpenses.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium">一人当たり負担額</span>
                </div>
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                  ¥{settlementData.perPersonAverage.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* 精算状況カード */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">精算状況</h2>
            <div className="space-y-6">
              {settlementData.people.map((person) => (
                <PersonSettlementCard key={person.id} person={person} />
              ))}
            </div>
          </Card>

          {/* 取引履歴カード */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">最近の取引</h2>
            <div className="space-y-4">
              {settlementData.transactions.length > 0 ? (
                settlementData.transactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  取引履歴がありません
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}