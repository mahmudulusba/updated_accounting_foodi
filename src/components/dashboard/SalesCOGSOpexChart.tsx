 import React from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
   ChartLegend,
   ChartLegendContent,
 } from '@/components/ui/chart';
 import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
 
 const data = [
   { month: 'Aug-24', Sale: 180000, COGS: 95000, Opex: 45000, NetProfit: 40000 },
   { month: 'Sep-24', Sale: 220000, COGS: 110000, Opex: 52000, NetProfit: 58000 },
   { month: 'Oct-24', Sale: 195000, COGS: 98000, Opex: 48000, NetProfit: 49000 },
   { month: 'Nov-24', Sale: 240000, COGS: 125000, Opex: 55000, NetProfit: 60000 },
   { month: 'Dec-24', Sale: 210000, COGS: 105000, Opex: 50000, NetProfit: 55000 },
   { month: 'Jan-25', Sale: 250000, COGS: 130000, Opex: 58000, NetProfit: 62000 },
 ];
 
 const chartConfig = {
   Sale: { label: 'Sale', color: 'hsl(215, 85%, 45%)' },
   COGS: { label: 'COGS', color: 'hsl(142, 76%, 36%)' },
   Opex: { label: 'Opex', color: 'hsl(38, 92%, 50%)' },
   NetProfit: { label: 'Net Profit', color: 'hsl(330, 70%, 60%)' },
 };
 
 export function SalesCOGSOpexChart() {
   return (
     <Card>
       <CardHeader className="pb-2">
         <CardTitle className="text-sm font-medium">Sale, COGS, Opex, Net Profit Analysis</CardTitle>
       </CardHeader>
       <CardContent>
         <ChartContainer config={chartConfig} className="h-[250px] w-full">
           <BarChart data={data}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="month" tick={{ fontSize: 10 }} />
             <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
             <ChartTooltip content={<ChartTooltipContent />} />
             <ChartLegend content={<ChartLegendContent />} />
             <Bar dataKey="Sale" fill="var(--color-Sale)" radius={[2, 2, 0, 0]} />
             <Bar dataKey="COGS" fill="var(--color-COGS)" radius={[2, 2, 0, 0]} />
             <Bar dataKey="Opex" fill="var(--color-Opex)" radius={[2, 2, 0, 0]} />
             <Bar dataKey="NetProfit" fill="var(--color-NetProfit)" radius={[2, 2, 0, 0]} />
           </BarChart>
         </ChartContainer>
       </CardContent>
     </Card>
   );
 }