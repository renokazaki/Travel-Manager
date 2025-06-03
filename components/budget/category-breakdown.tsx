"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const categoryData = [
  {
    category: "Accommodation",
    items: [
      { name: "Airbnb Rental", amount: 1200, paidBy: "Alex Kim" },
      { name: "Resort Deposit", amount: 300, paidBy: "Jamie Chen" },
    ],
    total: 1500,
    budget: 2000,
  },
  {
    category: "Transportation",
    items: [
      { name: "Flight Tickets", amount: 500, paidBy: "Taylor Wong" },
      { name: "Rental Car", amount: 300, paidBy: "Morgan Liu" },
    ],
    total: 800,
    budget: 1000,
  },
  {
    category: "Food & Dining",
    items: [
      { name: "Grocery Shopping", amount: 150, paidBy: "Jordan Park" },
      { name: "Restaurant Booking", amount: 150, paidBy: "Alex Kim" },
    ],
    total: 300,
    budget: 1000,
  },
  {
    category: "Activities",
    items: [
      { name: "Museum Tickets", amount: 120, paidBy: "Jamie Chen" },
      { name: "Boat Tour", amount: 125, paidBy: "Morgan Liu" },
    ],
    total: 245,
    budget: 800,
  },
  {
    category: "Miscellaneous",
    items: [],
    total: 0,
    budget: 200,
  },
];

const chartData = categoryData.map(item => ({
  name: item.category,
  spent: item.total,
  budget: item.budget,
}));

export default function CategoryBreakdown() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData.map((category) => (
                  <TableRow key={category.category}>
                    <TableCell className="font-medium">{category.category}</TableCell>
                    <TableCell>${category.total}</TableCell>
                    <TableCell>${category.budget}</TableCell>
                    <TableCell className="text-right">${category.budget - category.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="chart">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar dataKey="spent" name="Spent" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}