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
 
 const apData = [
   { day: 'Day 1', Amount: 4200 },
   { day: 'Day 2', Amount: 5800 },
   { day: 'Day 3', Amount: 3600 },
   { day: 'Day 4', Amount: 6100 },
   { day: 'Day 5', Amount: 4500 },
   { day: 'Day 6', Amount: 5200 },
   { day: 'Day 7', Amount: 4800 },
 ];
 
 const arData = [
   { day: 'Day 1', Amount: 3800 },
   { day: 'Day 2', Amount: 4200 },
   { day: 'Day 3', Amount: 5100 },
   { day: 'Day 4', Amount: 3900 },
   { day: 'Day 5', Amount: 4600 },
   { day: 'Day 6', Amount: 5800 },
   { day: 'Day 7', Amount: 4100 },
 ];
 
 const apChartConfig = {
   Amount: { label: 'Amount', color: 'hsl(215, 85%, 45%)' },
 };
 
 const arChartConfig = {
   Amount: { label: 'Amount', color: 'hsl(142, 76%, 36%)' },
 };
 
 export function APOf7DaysChart() {
   return (
     <Card>
       <CardHeader className="pb-2">
         <CardTitle className="text-sm font-medium">AP of 7 Days</CardTitle>
       </CardHeader>
       <CardContent>
         <ChartContainer config={apChartConfig} className="h-[200px] w-full">
           <BarChart data={apData}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="day" tick={{ fontSize: 9 }} />
             <YAxis tick={{ fontSize: 9 }} />
             <ChartTooltip content={<ChartTooltipContent />} />
             <ChartLegend content={<ChartLegendContent />} />
             <Bar dataKey="Amount" fill="var(--color-Amount)" radius={[2, 2, 0, 0]} />
           </BarChart>
         </ChartContainer>
       </CardContent>
     </Card>
   );
 }
 
 export function AROf7DaysChart() {
   return (
     <Card>
       <CardHeader className="pb-2">
         <CardTitle className="text-sm font-medium">AR of 7 Days</CardTitle>
       </CardHeader>
       <CardContent>
         <ChartContainer config={arChartConfig} className="h-[200px] w-full">
           <BarChart data={arData}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="day" tick={{ fontSize: 9 }} />
             <YAxis tick={{ fontSize: 9 }} />
             <ChartTooltip content={<ChartTooltipContent />} />
             <ChartLegend content={<ChartLegendContent />} />
             <Bar dataKey="Amount" fill="var(--color-Amount)" radius={[2, 2, 0, 0]} />
           </BarChart>
         </ChartContainer>
       </CardContent>
     </Card>
   );
 }