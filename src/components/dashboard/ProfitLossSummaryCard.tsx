import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown } from 'lucide-react';

const rows = [
  { label: 'Total Revenue', value: '1,234,567 BDT', up: true },
  { label: 'Cost of Goods Sold', value: '456,789 BDT', up: false },
  { label: 'Gross Profit', value: '777,778 BDT', up: true, bold: true },
  { label: 'Total Expenses', value: '366,667 BDT', up: false },
  { label: 'Operating Profit', value: '411,111 BDT', up: true },
  { label: 'Other Income', value: '20,000 BDT', up: true },
  { label: 'Net Profit', value: '431,111 BDT', up: true, bold: true },
];

export function ProfitLossSummaryCard() {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Profit &amp; Loss Summary</CardTitle>
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
      <CardContent className="pt-0">
        <div className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between py-2.5">
              <span className={`text-sm ${r.bold ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {r.label}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-sm tabular-nums ${r.bold ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>
                  {r.value}
                </span>
                {r.up ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
