import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Edit,
  CreditCard,
  Clock,
  UserCheck
} from "lucide-react";
import { Trip, tripData } from "@/lib/mockdeta";
import { SettlementActions } from "@/components/settlement/settlementActions";
import { AddExpenseModal } from "@/components/settlement/addExpenseModal";

// データ型定義
interface PaymentRecord {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  paidFor: string[]; // 誰の分を支払ったか
  category: string;
  date: string;
  description?: string;
  isSettled: boolean;
}

interface SettlementTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'completed' | 'confirmed';
  paymentMethod?: string;
  completedAt?: string;
  relatedPayments: string[]; // 関連する支払いID
}

// データ取得関数
async function getTripData(tripId: string): Promise<Trip | null> {
  return tripData[tripId] || null;
}

// モックデータ
const mockPaymentData = {
  payments: [
    {
      id: "pay-1",
      title: "ホテル宿泊費（全員分）",
      amount: 24000,
      paidBy: "田中太郎",
      paidFor: ["田中太郎", "佐藤花子", "鈴木一郎", "高橋和子"],
      category: "宿泊",
      date: "2025-07-15",
      description: "グランドホテル 2泊分",
      isSettled: false
    },
    {
      id: "pay-2", 
      title: "レンタカー代（全員分）",
      amount: 8000,
      paidBy: "佐藤花子",
      paidFor: ["田中太郎", "佐藤花子", "鈴木一郎", "高橋和子"],
      category: "交通",
      date: "2025-07-15",
      description: "3日間レンタル",
      isSettled: false
    },
    {
      id: "pay-3",
      title: "ディナー代（3人分）",
      amount: 12000,
      paidBy: "鈴木一郎", 
      paidFor: ["田中太郎", "佐藤花子", "鈴木一郎"],
      category: "食事",
      date: "2025-07-15",
      description: "イタリアンレストラン",
      isSettled: false
    },
    {
      id: "pay-4",
      title: "観光地入場料（全員分）",
      amount: 4000,
      paidBy: "高橋和子",
      paidFor: ["田中太郎", "佐藤花子", "鈴木一郎", "高橋和子"],
      category: "観光",
      date: "2025-07-16",
      description: "美術館入場料",
      isSettled: false
    }
  ] as PaymentRecord[]
};

// ユーティリティ関数
function getCategoryColor(category: string) {
  const colors = {
    宿泊: 'bg-blue-100 text-blue-800 border-blue-200',
    交通: 'bg-green-100 text-green-800 border-green-200', 
    食事: 'bg-amber-100 text-amber-800 border-amber-200',
    観光: 'bg-purple-100 text-purple-800 border-purple-200',
    その他: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[category as keyof typeof colors] || colors.その他;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'pending': return 'bg-red-100 text-red-800 border-red-200';
    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'completed': return '精算完了';
    case 'pending': return '精算待ち';
    case 'confirmed': return '確認済み';
    default: return '不明';
  }
}

// 支払い記録から精算取引を自動生成する関数
function generateSettlementTransactions(payments: PaymentRecord[]): SettlementTransaction[] {
  const settlements: SettlementTransaction[] = [];
  let settlementIdCounter = 1;

  payments.forEach(payment => {
    const perPersonAmount = payment.amount / payment.paidFor.length;
    
    // 支払った人以外の参加者に対して精算取引を生成
    payment.paidFor.forEach(person => {
      if (person !== payment.paidBy) {
        settlements.push({
          id: `set-${settlementIdCounter++}`,
          from: person,
          to: payment.paidBy,
          amount: Math.round(perPersonAmount),
          status: payment.isSettled ? 'completed' : 'pending',
          relatedPayments: [payment.id],
          ...(payment.isSettled && {
            completedAt: new Date().toISOString(),
            paymentMethod: "現金" // デフォルト値
          })
        });
      }
    });
  });

  return settlements;
}

// 精算取引を統合する関数（同じペア間の取引をまとめる）
function consolidateSettlements(settlements: SettlementTransaction[]): SettlementTransaction[] {
  const consolidatedMap = new Map<string, SettlementTransaction>();

  settlements.forEach(settlement => {
    const key = `${settlement.from}-${settlement.to}`;
    
    if (consolidatedMap.has(key)) {
      const existing = consolidatedMap.get(key)!;
      existing.amount += settlement.amount;
      existing.relatedPayments.push(...settlement.relatedPayments);
      // ステータスは最も進んでいないものを採用
      if (existing.status === 'completed' && settlement.status !== 'completed') {
        existing.status = settlement.status;
        delete existing.completedAt;
        delete existing.paymentMethod;
      }
    } else {
      consolidatedMap.set(key, { ...settlement });
    }
  });

  return Array.from(consolidatedMap.values());
}

// 支払い記録コンポーネント
function PaymentRecord({ payment }: { payment: PaymentRecord }) {
  const perPersonAmount = payment.amount / payment.paidFor.length;
  
  return (
    <div className={`p-4 border rounded-lg transition-all hover:shadow-md ${
      payment.isSettled ? 'bg-green-50 border-green-200' : 'bg-white'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-lg">{payment.title}</h4>
            <Badge className={getCategoryColor(payment.category)} variant="outline">
              {payment.category}
            </Badge>
            {payment.isSettled && (
              <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                精算済み
              </Badge>
            )}
          </div>
          {payment.description && (
            <p className="text-sm text-muted-foreground mb-2">{payment.description}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">¥{payment.amount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            1人 ¥{Math.round(perPersonAmount).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">支払い者</p>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{payment.paidBy}</span>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">対象者（{payment.paidFor.length}人）</p>
          <div className="flex flex-wrap gap-1">
            {payment.paidFor.map((person, index) => (
              <Badge 
                key={index} 
                variant={person === payment.paidBy ? "default" : "secondary"}
                className="text-xs"
              >
                {person}
                {person === payment.paidBy && " (支払)"}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 自動生成された精算取引の表示 */}
      <div className="mt-4 pt-3 border-t">
        <p className="text-sm font-medium text-muted-foreground mb-2">自動生成された精算</p>
        <div className="space-y-1">
          {payment.paidFor
            .filter(person => person !== payment.paidBy)
            .map((person, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded">
                <span>
                  <span className="font-medium">{person}</span>
                  <ArrowRight className="inline mx-1 h-3 w-3" />
                  <span className="font-medium">{payment.paidBy}</span>
                </span>
                <span className="font-bold text-blue-600">
                  ¥{Math.round(perPersonAmount).toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {payment.date}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            編集
          </Button>
          {!payment.isSettled && (
            <SettlementActions paymentId={payment.id} />
          )}
        </div>
      </div>
    </div>
  );
}

// 精算取引コンポーネント
function SettlementTransaction({ settlement }: { settlement: SettlementTransaction }) {
  return (
    <div className={`p-4 border rounded-lg transition-all hover:shadow-md ${
      settlement.status === 'completed' 
        ? 'bg-green-50 border-green-200' 
        : settlement.status === 'confirmed'
        ? 'bg-blue-50 border-blue-200'
        : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {settlement.status === 'completed' ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : settlement.status === 'confirmed' ? (
            <UserCheck className="h-6 w-6 text-blue-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-red-600" />
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{settlement.from}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{settlement.to}</span>
            </div>
            <Badge className={getStatusColor(settlement.status)} variant="outline">
              {getStatusText(settlement.status)}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">¥{settlement.amount.toLocaleString()}</p>
          {settlement.paymentMethod && (
            <p className="text-xs text-muted-foreground">{settlement.paymentMethod}</p>
          )}
        </div>
      </div>

      {/* 関連支払いの表示 */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1">関連する支払い:</p>
        <div className="flex flex-wrap gap-1">
          {settlement.relatedPayments.map((paymentId, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {paymentId}
            </Badge>
          ))}
        </div>
      </div>
      
      {settlement.completedAt && (
        <div className="text-xs text-muted-foreground mb-3">
          完了日時: {new Date(settlement.completedAt).toLocaleString('ja-JP')}
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        {settlement.status === 'pending' && (
          <>
            <Button variant="outline" size="sm">
              督促
            </Button>
            <Button size="sm">
              完了マーク
            </Button>
          </>
        )}
        {settlement.status === 'confirmed' && (
          <Button size="sm">
            精算確定
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

  const payments = mockPaymentData.payments;
  const memberNames = trip.members.map(m => m.name);
  
  // 支払い記録から精算取引を自動生成
  const generatedSettlements = generateSettlementTransactions(payments);
  const consolidatedSettlements = consolidateSettlements(generatedSettlements);
  
  const totalExpenses = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingSettlements = consolidatedSettlements.filter(s => s.status === 'pending');
  const unsettledPayments = payments.filter(p => !p.isSettled);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{trip.name} - 精算管理</h1>
          <p className="text-muted-foreground">
            支払い記録を追加すると、自動で精算取引が生成されます
          </p>
        </div>
        <AddExpenseModal memberNames={memberNames} />
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Receipt className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">¥{totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">総支出</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertCircle className="h-8 w-8 text-amber-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{unsettledPayments.length}</p>
              <p className="text-sm text-muted-foreground">未精算支払い</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <ArrowRight className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{pendingSettlements.length}</p>
              <p className="text-sm text-muted-foreground">精算待ち取引</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 支払い記録 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              支払い記録
            </CardTitle>
            <CardDescription>
              誰が誰の分を支払ったかの詳細記録（精算取引が自動生成されます）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <PaymentRecord key={payment.id} payment={payment} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">まだ支払い記録がありません</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    支払いを追加すると、自動で精算取引が生成されます
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 精算取引（自動生成） */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              精算取引（自動生成）
            </CardTitle>
            <CardDescription>
              支払い記録から自動で生成された精算取引
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consolidatedSettlements.length > 0 ? (
                consolidatedSettlements.map((settlement) => (
                  <SettlementTransaction key={settlement.id} settlement={settlement} />
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-muted-foreground">精算取引がありません</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    支払い記録を追加すると、ここに精算取引が表示されます
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}