import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Plane, Globe, Users, Home, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const STAT_CARDS = [
  { title: 'Total Flights Today', value: 6, sub: 'Scheduled departures', change: '+12% from yesterday', icon: Plane, bg: 'bg-primary', iconBg: 'bg-white/20' },
  { title: 'Live Aircraft', value: 1, sub: 'Currently in-flight', icon: Plane, bg: 'bg-success', iconBg: 'bg-white/20' },
  { title: 'Total Pax Boarding', value: '1,288', sub: 'All passengers today', change: '+8% from yesterday', icon: Users, bg: 'bg-[hsl(270,70%,50%)]', iconBg: 'bg-white/20' },
  { title: 'Domestic Pax', value: 394, sub: 'Boarding domestic', icon: Home, bg: 'bg-warning', iconBg: 'bg-white/20' },
  { title: 'International Pax', value: 894, sub: 'Boarding international', icon: Globe, bg: 'bg-destructive', iconBg: 'bg-white/20' },
];

const FLIGHTS = [
  { flight: 'BG201', aircraft: 'B738', aircraftName: 'Boeing 737-800', reg: 'S2-AHV', route: 'DAC → CGP', std: '08:00', sta: '09:15', atd: '08:05', ata: '–', pax: 162, type: 'DOM', status: 'In-flight' },
  { flight: 'BG401', aircraft: 'B788', aircraftName: 'Boeing 787-8', reg: 'S2-AJS', route: 'DAC → LHR', std: '09:30', sta: '15:45', atd: '–', ata: '–', pax: 248, type: 'INT', status: 'On-time' },
  { flight: 'BG205', aircraft: 'DH8D', aircraftName: 'De Havilland Dash 8', reg: 'S2-AKJ', route: 'DAC → ZYL', std: '07:15', sta: '08:00', atd: '07:20', ata: '08:10', pax: 74, type: 'DOM', status: 'Landed' },
  { flight: 'BG609', aircraft: 'B77W', aircraftName: 'Boeing 777-300ER', reg: 'S2-AFP', route: 'DAC → DXB', std: '22:00', sta: '01:30', atd: '–', ata: '–', pax: 356, type: 'INT', status: 'On-time' },
  { flight: 'BG203', aircraft: 'B738', aircraftName: 'Boeing 737-800', reg: 'S2-AHO', route: 'CGP → DAC', std: '10:30', sta: '11:45', atd: '10:55', ata: '–', pax: 158, type: 'DOM', status: 'Delayed' },
  { flight: 'BG347', aircraft: 'B789', aircraftName: 'Boeing 787-9', reg: 'S2-AJT', route: 'DAC → JFK', std: '11:00', sta: '16:30', atd: '–', ata: '–', pax: 290, type: 'INT', status: 'On-time' },
];

const OPEX_DATA = [
  { name: 'Ground Handling', value: 2.8, pct: 42.5, trend: -3.2, color: 'hsl(var(--success))' },
  { name: 'Airport Authority', value: 1.8, pct: 27.0, trend: -2.1, color: 'hsl(270, 70%, 50%)' },
  { name: 'Overflight Charges', value: 1.4, pct: 21.0, trend: -1.5, color: 'hsl(var(--destructive))' },
  { name: 'Other Operational', value: 0.637, pct: 9.5, trend: 0, color: 'hsl(var(--warning))' },
];

const statusColors: Record<string, string> = {
  'In-flight': 'bg-warning/10 text-warning border-warning/30',
  'On-time': 'bg-success/10 text-success border-success/30',
  'Landed': 'bg-success/10 text-success border-success/30',
  'Delayed': 'bg-destructive/10 text-destructive border-destructive/30',
};

export default function GHHomepage() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Real-time flight operations overview</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {time.toLocaleTimeString()}
          </div>
        </div>

        {/* Consistent solid-color stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STAT_CARDS.map(card => (
            <Card key={card.title} className="overflow-hidden border-0 shadow-lg">
              <CardContent className={`p-5 ${card.bg} text-white relative`}>
                <div className={`absolute top-3 right-3 p-2 rounded-full ${card.iconBg}`}>
                  <card.icon className="h-5 w-5 text-white/90" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
                <div className="mt-2 pt-2 border-t border-white/20">
                  <p className="text-xs text-white/70">{card.sub}</p>
                  {card.change && <p className="text-xs mt-0.5 text-white/90 font-medium">↗ {card.change}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cost Performance */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Cost Performance Analysis</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Operational Expense Distribution</p>
            </div>
            <div className="text-center mb-4">
              <p className="text-lg">Total OpEx: <span className="text-success font-bold text-xl">$6.7M</span></p>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={OPEX_DATA} innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                      {OPEX_DATA.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-success">43%</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Ground Handling</p>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                {OPEX_DATA.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="font-semibold">${item.value}M</span>
                      <span>{item.pct}%</span>
                      <span className={item.trend < 0 ? 'text-destructive' : item.trend === 0 ? 'text-muted-foreground' : 'text-success'}>
                        {item.trend < 0 ? `↘${Math.abs(item.trend)}%` : item.trend === 0 ? '– 0%' : `↗${item.trend}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Flights */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">Today's Flights</h2>
                <p className="text-sm text-muted-foreground">Real-time flight status and details</p>
              </div>
              <span className="text-sm text-primary font-medium">{FLIGHTS.length} flights</span>
            </div>
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/30 uppercase text-xs">
                  <TableHead>Flight</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>STD</TableHead>
                  <TableHead>STA</TableHead>
                  <TableHead>ATD</TableHead>
                  <TableHead>ATA</TableHead>
                  <TableHead>PAX</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FLIGHTS.map(f => (
                  <TableRow key={f.flight}>
                    <TableCell className="font-semibold">{f.flight}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{f.aircraft}</p>
                        <p className="text-xs text-muted-foreground">{f.aircraftName}</p>
                      </div>
                    </TableCell>
                    <TableCell>{f.reg}</TableCell>
                    <TableCell className="font-medium">{f.route}</TableCell>
                    <TableCell className="font-mono text-sm">{f.std}</TableCell>
                    <TableCell className="font-mono text-sm">{f.sta}</TableCell>
                    <TableCell className="font-mono text-sm">{f.atd}</TableCell>
                    <TableCell className="font-mono text-sm">{f.ata}</TableCell>
                    <TableCell className="font-semibold">{f.pax}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={f.type === 'DOM' ? 'text-primary border-primary' : 'text-success border-success'}>
                        {f.type === 'DOM' ? '🏠' : '🌐'} {f.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[f.status]}>
                        {f.status === 'In-flight' && '● '}{f.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="py-3 text-center">
          <p className="text-sm text-muted-foreground">
            Copyright © Designed & Developed by <span className="text-primary font-medium">Foodi</span> 2026
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
