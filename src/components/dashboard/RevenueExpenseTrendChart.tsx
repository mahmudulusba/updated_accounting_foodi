import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const data = [
  { month: 'Apr 2023', Revenue: 720000, Expenses: 480000 },
  { month: 'May 2023', Revenue: 680000, Expenses: 510000 },
  { month: 'Jun 2023', Revenue: 850000, Expenses: 540000 },
  { month: 'Jul 2023', Revenue: 790000, Expenses: 530000 },
  { month: 'Aug 2023', Revenue: 920000, Expenses: 600000 },
  { month: 'Sep 2023', Revenue: 880000, Expenses: 610000 },
  { month: 'Oct 2023', Revenue: 1050000, Expenses: 680000 },
  { month: 'Nov 2023', Revenue: 980000, Expenses: 660000 },
  { month: 'Dec 2023', Revenue: 1180000, Expenses: 720000 },
  { month: 'Jan 2024', Revenue: 1100000, Expenses: 700000 },
  { month: 'Feb 2024', Revenue: 1250000, Expenses: 780000 },
  { month: 'Apr 2024', Revenue: 1234567, Expenses: 823456 },
];

const chartConfig = {
  Revenue: { label: 'Revenue', color: 'hsl(215, 85%, 45%)' },
  Expenses: { label: 'Expenses', color: 'hsl(0, 75%, 60%)' },
};

export function RevenueExpenseTrendChart() {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Revenue vs Expenses Trend</CardTitle>
        <Select defaultValue="12m">
          <SelectTrigger className="h-7 text-xs w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12m">Last 12 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(v) => v.split(' ')[0]} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
            <Line type="monotone" dataKey="Revenue" stroke="var(--color-Revenue)" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Expenses" stroke="var(--color-Expenses)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
