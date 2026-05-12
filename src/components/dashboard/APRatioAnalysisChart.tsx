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
   { month: 'Aug-24', Purchase: 95000000, AverageAP: 82000000 },
   { month: 'Sep-24', Purchase: 110000000, AverageAP: 95000000 },
   { month: 'Oct-24', Purchase: 88000000, AverageAP: 76000000 },
   { month: 'Nov-24', Purchase: 125000000, AverageAP: 108000000 },
   { month: 'Dec-24', Purchase: 102000000, AverageAP: 89000000 },
   { month: 'Jan-25', Purchase: 118000000, AverageAP: 101000000 },
 ];
 
 const chartConfig = {
   Purchase: { label: 'Purchase', color: 'hsl(215, 85%, 45%)' },
   AverageAP: { label: 'Average AP', color: 'hsl(190, 75%, 50%)' },
 };
 
 export function APRatioAnalysisChart() {
   return (
     <Card>
       <CardHeader className="pb-2">
         <CardTitle className="text-sm font-medium">AP TO Ratio Analysis</CardTitle>
       </CardHeader>
       <CardContent>
         <ChartContainer config={chartConfig} className="h-[250px] w-full">
           <BarChart data={data}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="month" tick={{ fontSize: 10 }} />
             <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
             <ChartTooltip content={<ChartTooltipContent />} />
             <ChartLegend content={<ChartLegendContent />} />
             <Bar dataKey="Purchase" fill="var(--color-Purchase)" radius={[2, 2, 0, 0]} />
             <Bar dataKey="AverageAP" fill="var(--color-AverageAP)" radius={[2, 2, 0, 0]} />
           </BarChart>
         </ChartContainer>
       </CardContent>
     </Card>
   );
 }