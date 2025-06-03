"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock expense data
const expenses = [
  {
    id: 1,
    name: "Airbnb Rental",
    amount: 1200,
    category: "Accommodation",
    date: "2025-07-01",
    paidBy: "Alex Kim",
  },
  {
    id: 2,
    name: "Flight Tickets",
    amount: 500,
    category: "Transportation",
    date: "2025-06-15",
    paidBy: "Taylor Wong",
  },
  {
    id: 3,
    name: "Resort Deposit",
    amount: 300,
    category: "Accommodation",
    date: "2025-06-20",
    paidBy: "Jamie Chen",
  },
  {
    id: 4,
    name: "Rental Car",
    amount: 300,
    category: "Transportation",
    date: "2025-06-25",
    paidBy: "Morgan Liu",
  },
  {
    id: 5,
    name: "Grocery Shopping",
    amount: 150,
    category: "Food & Dining",
    date: "2025-07-05",
    paidBy: "Jordan Park",
  },
  {
    id: 6,
    name: "Restaurant Booking",
    amount: 150,
    category: "Food & Dining",
    date: "2025-07-10",
    paidBy: "Alex Kim",
  },
  {
    id: 7,
    name: "Museum Tickets",
    amount: 120,
    category: "Activities",
    date: "2025-07-03",
    paidBy: "Jamie Chen",
  },
  {
    id: 8,
    name: "Boat Tour",
    amount: 125,
    category: "Activities",
    date: "2025-07-08",
    paidBy: "Morgan Liu",
  },
];

// Category color mapping
const categoryColors: Record<string, string> = {
  "Accommodation": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Transportation": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  "Food & Dining": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "Activities": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Miscellaneous": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
};

export default function ExpenseList() {
  const [filter, setFilter] = useState("all");
  
  const filteredExpenses = filter === "all" 
    ? expenses 
    : expenses.filter(expense => expense.category === filter);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Expenses</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4 overflow-auto pb-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          {Object.keys(categoryColors).map(category => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex items-start justify-between p-4 rounded-lg border">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{expense.paidBy.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{expense.name}</h4>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className={categoryColors[expense.category]}>
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Paid by {expense.paidBy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${expense.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}