 import React from 'react';
 import { Card, CardContent } from '@/components/ui/card';
 import { cn } from '@/lib/utils';
 
 interface DashboardStatCardProps {
   title: string;
   value: string | number;
   subtitle?: string;
   variant?: 'primary' | 'success' | 'warning' | 'destructive' | 'purple';
   className?: string;
 }
 
 const variantStyles = {
   primary: 'bg-primary text-primary-foreground',
   success: 'bg-success text-success-foreground',
   warning: 'bg-warning text-warning-foreground',
   destructive: 'bg-destructive text-destructive-foreground',
   purple: 'bg-[hsl(270,70%,50%)] text-white',
 };
 
 export function DashboardStatCard({
   title,
   value,
   subtitle,
   variant = 'primary',
   className,
 }: DashboardStatCardProps) {
   return (
     <Card className={cn('overflow-hidden', className)}>
       <CardContent className={cn('p-4', variantStyles[variant])}>
         <p className="text-sm font-medium opacity-90">{title}</p>
         <p className="text-2xl font-bold mt-1">{value}</p>
         {subtitle && (
           <p className="text-xs opacity-75 mt-1">{subtitle}</p>
         )}
       </CardContent>
     </Card>
   );
 }