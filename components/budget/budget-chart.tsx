"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Accommodation", value: 1500, color: "#3B82F6" },
  { name: "Transportation", value: 800, color: "#0D9488" },
  { name: "Food & Dining", value: 300, color: "#F59E0B" },
  { name: "Activities", value: 245, color: "#8B5CF6" },
  { name: "Miscellaneous", value: 0, color: "#EC4899" },
];

export function BudgetChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`$${value}`, 'Amount']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}