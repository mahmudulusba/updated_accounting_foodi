 import React from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
   ChartLegend,
   ChartLegendContent,
 } from '@/components/ui/chart';
 import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
 
 const data = [
   { month: 'Aug-24', Asset: 350000000, Liability: 120000000, Equity: 80000000 },
   { month: 'Sep-24', Asset: 320000000, Liability: 150000000, Equity: 70000000 },
   { month: 'Oct-24', Asset: 280000000, Liability: 100000000, Equity: 90000000 },
   { month: 'Nov-24', Asset: 390000000, Liability: 180000000, Equity: 60000000 },
   { month: 'Dec-24', Asset: 340000000, Liability: 130000000, Equity: 85000000 },
   { month: 'Jan-25', Asset: 370000000, Liability: 160000000, Equity: 75000000 },
 ];
 
 const chartConfig = {
   Asset: { label: 'Asset', color: 'hsl(142, 76%, 36%)' },
   Liability: { label: 'Liability', color: 'hsl(38, 92%, 50%)' },
   Equity: { label: 'Equity', color: 'hsl(330, 70%, 60%)' },
 };
 
 export function AssetLiabilityEquityChart() {
   return (
     <Card>
       <CardHeader className="pb-2">
         <CardTitle className="text-sm font-medium">Asset, Liability and Equity Analysis</CardTitle>
       </CardHeader>
       <CardContent>
         <ChartContainer config={chartConfig} className="h-[250px] w-full">
           <BarChart data={data}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="month" tick={{ fontSize: 10 }} />
             <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
             <ChartTooltip content={<ChartTooltipContent />} />
             <ChartLegend content={<ChartLegendContent />} />
             <Bar dataKey="Asset" fill="var(--color-Asset)" radius={[2, 2, 0, 0]} />
             <Bar dataKey="Liability" fill="var(--color-Liability)" radius={[2, 2, 0, 0]} />
             <Bar dataKey="Equity" fill="var(--color-Equity)" radius={[2, 2, 0, 0]} />
           </BarChart>
         </ChartContainer>
       </CardContent>
     </Card>
   );
 }