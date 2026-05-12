import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Salaries & Wages', value: 147333, color: 'hsl(0, 75%, 60%)' },
  { name: 'Rent & Utilities', value: 68200, color: 'hsl(215, 85%, 50%)' },
  { name: 'Marketing', value: 46600, color: 'hsl(38, 92%, 55%)' },
  { name: 'Depreciation', value: 37800, color: 'hsl(142, 70%, 42%)' },
  { name: 'Other Expenses', value: 66734, color: 'hsl(270, 60%, 60%)' },
];

export function ExpenseBreakdownChart() {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Card>
      <CardHeader className="pb-1 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Expense Breakdown</CardTitle>
        <Select defaultValue="month">
          <SelectTrigger className="h-7 text-xs w-[110px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3">
          <div className="w-[140px] h-[140px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                  {data.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} BDT`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-1.5">
            {data.map((d) => {
              const pct = ((d.value / total) * 100).toFixed(1);
              return (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-medium text-foreground tabular-nums">
                    {pct}% {(d.value / 1000).toFixed(1)}K BDT
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-border mt-3 pt-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Total</span>
          <span className="text-sm font-bold text-foreground tabular-nums">{total.toLocaleString()} BDT</span>
        </div>
      </CardContent>
    </Card>
  );
}
