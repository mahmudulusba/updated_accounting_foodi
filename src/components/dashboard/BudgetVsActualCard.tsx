import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const items = [
  { label: 'Revenue', actual: '1.23M BDT', budget: '1.10M BDT', pct: 112, color: 'bg-success' },
  { label: 'Expenses', actual: '366K BDT', budget: '400K BDT', pct: 92, color: 'bg-warning' },
  { label: 'Net Profit', actual: '431K BDT', budget: '350K BDT', pct: 123, color: 'bg-primary' },
];

export function BudgetVsActualCard() {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">Budget vs Actual</CardTitle>
        <p className="text-xs text-muted-foreground">This Month</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((i) => (
          <div key={i.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-foreground">{i.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground tabular-nums">{i.actual} / {i.budget}</span>
                <span className="font-semibold text-foreground tabular-nums">{i.pct}%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${i.color}`} style={{ width: `${Math.min(i.pct, 100)}%` }} />
            </div>
          </div>
        ))}
        <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline pt-1">
          View Budget Report <ArrowRight className="h-3 w-3" />
        </button>
      </CardContent>
    </Card>
  );
}
