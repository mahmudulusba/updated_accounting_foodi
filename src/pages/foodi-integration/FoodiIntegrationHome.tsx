import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, UtensilsCrossed, ShoppingCart, Store, Package, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';

const services = [
  {
    name: 'Foodi',
    icon: UtensilsCrossed,
    transactions: 12480,
    orders: 8345,
    accent: 'bg-primary/10 text-primary',
    bar: 'bg-primary',
  },
  {
    name: 'Foodi Mart',
    icon: ShoppingCart,
    transactions: 9320,
    orders: 6210,
    accent: 'bg-success/10 text-success',
    bar: 'bg-success',
  },
  {
    name: 'Foodi Shop',
    icon: Store,
    transactions: 5410,
    orders: 3870,
    accent: 'bg-warning/10 text-warning',
    bar: 'bg-warning',
  },
  {
    name: 'Foodi Parcel',
    icon: Package,
    transactions: 4180,
    orders: 2950,
    accent: 'bg-destructive/10 text-destructive',
    bar: 'bg-destructive',
  },
  {
    name: 'Foodi Ride',
    icon: Bike,
    transactions: 6720,
    orders: 5120,
    accent: 'bg-[hsl(270,70%,55%)]/10 text-[hsl(270,70%,55%)]',
    bar: 'bg-[hsl(270,70%,55%)]',
  },
];

const fmt = (n: number) => n.toLocaleString();

export default function FoodiIntegrationHome() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold">Foodi Integration Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.name} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className={cn('h-1 w-full', s.bar)} />
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={cn('p-2.5 rounded-full', s.accent)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Transactions</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{fmt(s.transactions)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Orders</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{fmt(s.orders)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
