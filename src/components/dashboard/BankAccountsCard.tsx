import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const accounts = [
  { name: 'Main Checking', value: '534,567 BDT' },
  { name: 'Savings Account', value: '345,000 BDT' },
  { name: 'Payroll Account', value: '123,450 BDT' },
  { name: 'Petty Cash', value: '5,550 BDT' },
];

export function BankAccountsCard() {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">Bank Accounts</CardTitle>
        <p className="text-xs text-muted-foreground">As of 30 Apr, 2024</p>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {accounts.map((a) => (
          <div key={a.name} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{a.name}</span>
            <span className="font-semibold text-foreground tabular-nums">{a.value}</span>
          </div>
        ))}
        <div className="border-t border-border pt-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Total</span>
          <span className="text-sm font-bold text-foreground tabular-nums">1,008,567 BDT</span>
        </div>
        <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
          View All Accounts <ArrowRight className="h-3 w-3" />
        </button>
      </CardContent>
    </Card>
  );
}
