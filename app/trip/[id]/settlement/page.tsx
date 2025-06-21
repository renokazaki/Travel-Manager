import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  ArrowRight,
  CheckCircle2,
  Edit,
  CreditCard,
  Clock,
} from "lucide-react";
import { PaymentData, Trip, tripData } from "@/lib/mockdeta";
import { SettlementActions } from "@/components/settlement/settlementActions";
import { AddExpenseModal } from "@/components/settlement/addExpenseModal";
import { PaymentRecordType } from "@/types/types";


// データ取得関数
async function getTripData(tripId: string): Promise<Trip | null> {
  return tripData[tripId] || null;
}



// ユーティリティ関数
function getCategoryColor(category: string) {
  const colors = {
    宿泊: "bg-blue-100 text-blue-800 border-blue-200",
    交通: "bg-green-100 text-green-800 border-green-200",
    食事: "bg-amber-100 text-amber-800 border-amber-200",
    観光: "bg-purple-100 text-purple-800 border-purple-200",
    その他: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[category as keyof typeof colors] || colors.その他;
}

// 支払い記録コンポーネント
function PaymentRecord({ payment }: { payment: PaymentRecordType }) {
  const perPersonAmount = payment.amount / payment.paidFor.length;

  return (
    <div
      className={`p-4 border rounded-lg transition-all hover:shadow-md ${
        payment.isSettled ? "bg-green-50 border-green-200" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-lg">{payment.title}</h4>
            <Badge
              className={getCategoryColor(payment.category)}
              variant="outline"
            >
              {payment.category}
            </Badge>
            {payment.isSettled && (
              <Badge
                className="bg-green-100 text-green-800 border-green-200"
                variant="outline"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                精算済み
              </Badge>
            )}
          </div>
          {payment.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {payment.description}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            ¥{payment.amount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            1人 ¥{Math.round(perPersonAmount).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            支払い者
          </p>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{payment.paidBy}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            対象者（{payment.paidFor.length}人）
          </p>
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
        <p className="text-sm font-medium text-muted-foreground mb-2">
          自動生成された精算
        </p>
        <div className="space-y-1">
          {payment.paidFor
            .filter((person) => person !== payment.paidBy)
            .map((person, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded"
              >
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
          {!payment.isSettled && <SettlementActions paymentId={payment.id} />}
        </div>
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
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tripId } = await params;
  const trip = await getTripData(tripId);

  if (!trip) {
    notFound();
  }

  const payments = PaymentData;
  const memberNames = trip.members.map((m) => m.name);

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

      <div className="grid grid-cols-1 gap-6">
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
                  <p className="text-muted-foreground">
                    まだ支払い記録がありません
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    支払いを追加すると、自動で精算取引が生成されます
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
