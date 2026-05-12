import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Operating Activities', value: 612111, color: 'hsl(142, 76%, 40%)' },
  { name: 'Investing Activities', value: 120000, color: 'hsl(0, 75%, 60%)' },
  { name: 'Financing Activities', value: 61000, color: 'hsl(215, 85%, 50%)' },
];

export function CashFlowOverviewChart() {
  const netCashFlow = '431,111 BDT';
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Cash Flow Overview</CardTitle>
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
        <div className="flex items-center gap-4">
          <div className="relative w-[140px] h-[140px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} BDT`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-base font-bold text-foreground">{netCashFlow}</span>
              <span className="text-[10px] text-muted-foreground">Net Cash Flow</span>
            </div>
          </div>
          <div className="flex-1 space-y-2.5">
            {data.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-semibold text-foreground tabular-nums">
                  {d.name === 'Operating Activities' ? '' : '-'}{d.value.toLocaleString()} BDT
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
