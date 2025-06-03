import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowRight } from "lucide-react";

export default function SettlementPage() {
  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto pb-24 md:pb-12">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Settlement</h1>
            <p className="text-muted-foreground mt-1">Track and settle group expenses</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Group Expenses</span>
                <span className="text-xl font-semibold">$2,845</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Per Person (Average)</span>
                <span className="text-xl font-semibold">$569</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Settlement Status</h2>
            <div className="space-y-6">
              {[
                { name: "Alex Kim", paid: 845, share: 569, avatar: "A" },
                { name: "Jamie Chen", paid: 720, share: 569, avatar: "J" },
                { name: "Taylor Wong", paid: 630, share: 569, avatar: "T" },
                { name: "Morgan Liu", paid: 350, share: 569, avatar: "M" },
                { name: "Jordan Park", paid: 300, share: 569, avatar: "J" },
              ].map((person, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{person.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Paid ${person.paid} / Share ${person.share}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Settle Up
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                  <Progress value={(person.paid / person.share) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {[
                { from: "Alex Kim", to: "Jamie Chen", amount: 50, date: "2025-07-10" },
                { from: "Taylor Wong", to: "Morgan Liu", amount: 30, date: "2025-07-09" },
                { from: "Jordan Park", to: "Alex Kim", amount: 25, date: "2025-07-08" },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">
                        {transaction.from} <ArrowRight className="inline h-4 w-4 mx-2" /> {transaction.to}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">${transaction.amount}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}