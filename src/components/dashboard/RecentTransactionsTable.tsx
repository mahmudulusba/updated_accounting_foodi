import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const rows = [
  { date: '30 Apr, 2024', ref: 'INV-1001', desc: 'Consulting Services', amount: '15,000 BDT', type: 'Income' },
  { date: '29 Apr, 2024', ref: 'BILL-2001', desc: 'Office Supplies', amount: '2,350 BDT', type: 'Expense' },
  { date: '29 Apr, 2024', ref: 'PAY-3001', desc: 'Vendor Payment', amount: '5,750 BDT', type: 'Payment' },
  { date: '28 Apr, 2024', ref: 'INV-1000', desc: 'Product Sales', amount: '8,500 BDT', type: 'Income' },
  { date: '27 Apr, 2024', ref: 'JE-4001', desc: 'Depreciation Expense', amount: '1,850 BDT', type: 'Expense' },
];

const typeStyle: Record<string, string> = {
  Income: 'bg-success/15 text-success',
  Expense: 'bg-destructive/15 text-destructive',
  Payment: 'bg-primary/15 text-primary',
};

export function RecentTransactionsTable() {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left font-medium py-2">Date</th>
              <th className="text-left font-medium py-2">Reference No.</th>
              <th className="text-left font-medium py-2">Description</th>
              <th className="text-right font-medium py-2">Amount</th>
              <th className="text-right font-medium py-2">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.ref}>
                <td className="py-2 text-muted-foreground whitespace-nowrap">{r.date}</td>
                <td className="py-2 text-primary font-medium">{r.ref}</td>
                <td className="py-2 text-foreground">{r.desc}</td>
                <td className="py-2 text-right font-semibold tabular-nums text-foreground">{r.amount}</td>
                <td className="py-2 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeStyle[r.type]}`}>
                    {r.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mt-3 text-xs text-primary font-medium flex items-center gap-1 hover:underline">
          View All Transactions <ArrowRight className="h-3 w-3" />
        </button>
      </CardContent>
    </Card>
  );
}
