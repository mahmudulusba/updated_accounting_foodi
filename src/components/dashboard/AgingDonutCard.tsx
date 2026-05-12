import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AgingDonutCardProps {
  title: string;
  asOf: string;
  data: { name: string; value: number; color: string }[];
}

export function AgingDonutCard({ title, asOf, data }: AgingDonutCardProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{asOf}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3">
          <div className="w-[130px] h-[130px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={1}
                  dataKey="value"
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} BDT`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-1.5">
            {data.map((d) => {
              const pct = ((d.value / total) * 100).toFixed(0);
              return (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground truncate">{d.name}</span>
                  </div>
                  <span className="font-medium text-foreground tabular-nums whitespace-nowrap">
                    {(d.value / 1000).toFixed(1)}K BDT ({pct}%)
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
