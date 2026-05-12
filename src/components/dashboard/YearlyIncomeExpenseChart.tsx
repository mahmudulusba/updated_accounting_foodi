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
   { month: 'Jul', Income: 650, Expense: 280 },
   { month: 'Aug', Income: 720, Expense: 350 },
   { month: 'Sep', Income: 580, Expense: 290 },
   { month: 'Oct', Income: 890, Expense: 420 },
   { month: 'Nov', Income: 760, Expense: 380 },
   { month: 'Dec', Income: 920, Expense: 450 },
 ];
 
 const chartConfig = {
   Income: { label: 'Income', color: 'hsl(215, 85%, 45%)' },
   Expense: { label: 'Expense', color: 'hsl(142, 76%, 36%)' },
 };
 
 export function YearlyIncomeExpenseChart() {
   return (
     <Card>
       <CardHeader className="pb-2">
         <CardTitle className="text-sm font-medium">Yearly Income-Expense</CardTitle>
       </CardHeader>
       <CardContent>
         <ChartContainer config={chartConfig} className="h-[250px] w-full">
           <BarChart data={data}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="month" tick={{ fontSize: 10 }} />
             <YAxis tick={{ fontSize: 10 }} />
             <ChartTooltip content={<ChartTooltipContent />} />
             <ChartLegend content={<ChartLegendContent />} />
             <Bar dataKey="Income" fill="var(--color-Income)" radius={[2, 2, 0, 0]} />
             <Bar dataKey="Expense" fill="var(--color-Expense)" radius={[2, 2, 0, 0]} />
           </BarChart>
         </ChartContainer>
       </CardContent>
     </Card>
   );
 }