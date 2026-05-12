import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedCalendar as Calendar } from '@/components/ui/enhanced-calendar';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { CalendarIcon, Plus, Trash2, Download } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Holiday { id: string; name: string; start: Date; end: Date; days: number; }

const fiscalYears = ['01 Jul 2025 to 30 Jun 2026', '01 Jul 2024 to 30 Jun 2025', '01 Jul 2023 to 30 Jun 2024'];

export default function HolidaySetup() {
  const [fy, setFy] = useState(fiscalYears[0]);
  const [list, setList] = useState<Holiday[]>([
    { id: '1', name: 'Eid-ul-Fitr', start: new Date('2026-03-31'), end: new Date('2026-04-02'), days: 3 },
    { id: '2', name: 'Independence Day', start: new Date('2026-03-26'), end: new Date('2026-03-26'), days: 1 },
  ]);
  const [name, setName] = useState('');
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();

  const add = () => {
    if (!name || !start || !end) { toast.error('All fields required'); return; }
    const days = differenceInDays(end, start) + 1;
    setList(prev => [...prev, { id: Date.now().toString(), name, start, end, days }]);
    setName(''); setStart(undefined); setEnd(undefined);
    toast.success('Holiday added');
  };
  const remove = (id: string) => setList(prev => prev.filter(h => h.id !== id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card><CardContent className="py-4">
          <nav className="text-sm"><span className="font-semibold">Central Configuration</span> / Holiday</nav>
        </CardContent></Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Holiday / Create</h2>
              <Button variant="default" size="icon"><Download className="h-4 w-4" /></Button>
            </div>

            <div className="grid gap-3 md:grid-cols-5 items-end">
              <div className="space-y-2">
                <Label>Financial Year Name <span className="text-destructive">*</span></Label>
                <Select value={fy} onValueChange={setFy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {fiscalYears.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Holiday Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Holiday name" /></div>
              <div className="space-y-2"><Label>Start Date</Label>
                <Popover><PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start font-normal", !start && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />{start ? format(start, 'dd-MMM-yyyy') : 'Select'}
                  </Button>
                </PopoverTrigger><PopoverContent className="w-auto p-0 z-[9999] bg-popover"><Calendar mode="single" selected={start} onSelect={setStart} /></PopoverContent></Popover>
              </div>
              <div className="space-y-2"><Label>End Date</Label>
                <Popover><PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start font-normal", !end && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />{end ? format(end, 'dd-MMM-yyyy') : 'Select'}
                  </Button>
                </PopoverTrigger><PopoverContent className="w-auto p-0 z-[9999] bg-popover"><Calendar mode="single" selected={end} onSelect={setEnd} /></PopoverContent></Popover>
              </div>
              <Button variant="destructive" onClick={add} className="w-full"><Plus className="h-4 w-4 mr-1" />Add</Button>
            </div>

            <div className="rounded-md border overflow-hidden mt-6">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold">Holiday Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Start Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">End Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">No Of Days</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Remove</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((h, i) => (
                    <TableRow key={h.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{h.name}</TableCell>
                      <TableCell>{format(h.start, 'dd-MMM-yyyy')}</TableCell>
                      <TableCell>{format(h.end, 'dd-MMM-yyyy')}</TableCell>
                      <TableCell>{h.days}</TableCell>
                      <TableCell><Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(h.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                  {list.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No holidays added</TableCell></TableRow>
                  )}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
