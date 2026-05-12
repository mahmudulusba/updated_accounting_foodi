import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, ChevronRight, LucideIcon } from 'lucide-react';

interface StatCardWithIconProps {
  title: string;
  value: string;
  change: number;
  comparedTo: string;
  icon: LucideIcon;
  iconColor: 'green' | 'red' | 'blue' | 'purple' | 'amber' | 'cyan';
  className?: string;
}

const iconColorMap = {
  green: 'bg-success/15 text-success',
  red: 'bg-destructive/15 text-destructive',
  blue: 'bg-primary/15 text-primary',
  purple: 'bg-[hsl(270,70%,55%)]/15 text-[hsl(270,70%,55%)]',
  amber: 'bg-warning/15 text-warning',
  cyan: 'bg-[hsl(190,80%,45%)]/15 text-[hsl(190,80%,45%)]',
};

export function StatCardWithIcon({
  title,
  value,
  change,
  comparedTo,
  icon: Icon,
  iconColor,
  className,
}: StatCardWithIconProps) {
  const isPositive = change >= 0;
  return (
    <Card className={cn('overflow-hidden hover:shadow-md transition-shadow cursor-pointer', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className={cn('p-2.5 rounded-full', iconColorMap[iconColor])}>
            <Icon className="h-5 w-5" />
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50 mt-2" />
        </div>
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-bold mt-1 text-foreground">{value}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className={cn(
              'flex items-center text-xs font-semibold',
              isPositive ? 'text-success' : 'text-destructive'
            )}>
              {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-muted-foreground">{comparedTo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
