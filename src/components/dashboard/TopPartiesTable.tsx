import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Row {
  name: string;
  amount: string;
  pct: string;
}

interface TopPartiesTableProps {
  title: string;
  asOf: string;
  nameLabel: string;
  rows: Row[];
  total: string;
  totalPct: string;
}

export function TopPartiesTable({ title, asOf, nameLabel, rows, total, totalPct }: TopPartiesTableProps) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{asOf}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left font-medium py-2 w-6">#</th>
              <th className="text-left font-medium py-2">{nameLabel}</th>
              <th className="text-right font-medium py-2">Outstanding Amount</th>
              <th className="text-right font-medium py-2">% of Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={r.name}>
                <td className="py-2 text-muted-foreground">{i + 1}</td>
                <td className="py-2 text-foreground">{r.name}</td>
                <td className="py-2 text-right font-medium tabular-nums text-foreground">{r.amount}</td>
                <td className="py-2 text-right tabular-nums text-muted-foreground">{r.pct}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-border">
              <td className="pt-2"></td>
              <td className="pt-2 font-semibold text-foreground">Total</td>
              <td className="pt-2 text-right font-bold tabular-nums text-foreground">{total}</td>
              <td className="pt-2 text-right tabular-nums font-semibold text-foreground">{totalPct}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
