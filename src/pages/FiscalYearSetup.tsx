import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedCalendar as Calendar } from '@/components/ui/enhanced-calendar';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { CalendarIcon, Search, Pencil, Trash2, Check, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FY { id: string; name: string; from: Date; to: Date; glCode: string; glName: string; active: boolean; }

const seed: FY[] = [
  { id: '1', name: '01 Jul 2023 to 30 Jun 2024', from: new Date('2023-07-01'), to: new Date('2024-06-30'), glCode: '32101001', glName: 'Retained Earnings', active: true },
  { id: '2', name: '01 Jul 2022 to 30 Jun 2023', from: new Date('2022-07-01'), to: new Date('2023-06-30'), glCode: '32101001', glName: 'Retained Earnings', active: true },
];

export default function FiscalYearSetup() {
  const [list, setList] = useState<FY[]>(seed);
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [name, setName] = useState('');
  const [glCode, setGlCode] = useState('');
  const [glName, setGlName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const autoName = (f?: Date, t?: Date) => f && t ? `${format(f, 'dd-MMM-yyyy')} to ${format(t, 'dd-MMM-yyyy')}` : '';

  const onFrom = (d?: Date) => { setFrom(d); setName(autoName(d, to)); };
  const onTo = (d?: Date) => { setTo(d); setName(autoName(from, d)); };

  const clear = () => { setFrom(undefined); setTo(undefined); setName(''); setGlCode(''); setGlName(''); setEditing(null); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !glCode) { toast.error('From, To Date & GL Code are required'); return; }
    const item: FY = { id: editing || Date.now().toString(), name, from, to, glCode, glName, active: true };
    setList(prev => editing ? prev.map(x => x.id === editing ? item : x) : [item, ...prev]);
    toast.success(editing ? 'Fiscal Year updated' : 'Fiscal Year added');
    clear();
    setShowForm(false);
  };

  const edit = (f: FY) => { setEditing(f.id); setFrom(f.from); setTo(f.to); setName(f.name); setGlCode(f.glCode); setGlName(f.glName); setShowForm(true); };
  const del = (id: string) => { setList(prev => prev.filter(x => x.id !== id)); toast.success('Removed'); };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card><CardContent className="py-4 flex items-center justify-between">
          <nav className="text-sm"><span className="font-semibold">Central Configuration</span> / Fiscal Year {showForm ? '/ Create' : '/ List'}</nav>
          {!showForm ? (
            <Button size="icon" onClick={() => { clear(); setShowForm(true); }} title="Add"><Plus className="h-4 w-4" /></Button>
          ) : (
            <Button size="icon" variant="destructive" onClick={() => { clear(); setShowForm(false); }} title="Close"><X className="h-4 w-4" /></Button>
          )}
        </CardContent></Card>

        {showForm && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Fiscal Year / {editing ? 'Edit' : 'Create'}</h2>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>From Date <span className="text-destructive">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !from && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {from ? format(from, 'dd-MMM-yyyy') : 'dd-MMM-yyyy'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[9999] bg-popover"><Calendar mode="single" selected={from} onSelect={onFrom} /></PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>To Date <span className="text-destructive">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !to && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {to ? format(to, 'dd-MMM-yyyy') : 'dd-MMM-yyyy'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[9999] bg-popover"><Calendar mode="single" selected={to} onSelect={onTo} /></PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Fiscal Year Name <span className="text-destructive">*</span></Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Auto Fill / Edit" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">GL Code Mapping For Retained Earnings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>GL Code</Label>
                    <div className="flex gap-2">
                      <Input value={glCode} onChange={e => setGlCode(e.target.value)} placeholder="Enter GL Code" />
                      <Button type="button" variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>GL Name</Label>
                    <Input value={glName} readOnly placeholder="GL Name (auto)" className="bg-muted" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="destructive" onClick={clear}>Clear</Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Financial Year Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Start Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">End Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((f, i) => (
                    <TableRow key={f.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{f.name}</TableCell>
                      <TableCell>{format(f.from, 'dd-MMM-yyyy')}</TableCell>
                      <TableCell>{format(f.to, 'dd-MMM-yyyy')}</TableCell>
                      <TableCell><Check className="h-4 w-4 text-success" /></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => edit(f)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(f.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
