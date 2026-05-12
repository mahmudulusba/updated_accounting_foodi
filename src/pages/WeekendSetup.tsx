import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Weekend { id: string; fy: string; days: string[]; }
const fiscalYears = ['01 Jul 2025 to 30 Jun 2026', '01 Jul 2024 to 30 Jun 2025', '01 Jul 2023 to 30 Jun 2024', '01 Jul 2022 to 30 Jun 2023'];
const dayList = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

export default function WeekendSetup() {
  const [list, setList] = useState<Weekend[]>([
    { id: '1', fy: '01 Jul 2022 to 30 Jun 2023', days: ['Fri'] },
  ]);
  const [fy, setFy] = useState(fiscalYears[0]);
  const [days, setDays] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  const toggle = (d: string) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const clear = () => { setDays([]); setEditing(null); setFy(fiscalYears[0]); };
  const submit = () => {
    if (days.length === 0) { toast.error('Select at least one day'); return; }
    const orderedMerge = (a: string[], b: string[]) =>
      dayList.filter(d => a.includes(d) || b.includes(d));
    setList(prev => {
      if (editing) {
        return prev.map(x => x.id === editing ? { ...x, fy, days } : x);
      }
      const existing = prev.find(x => x.fy === fy);
      if (existing) {
        return prev.map(x => x.id === existing.id
          ? { ...x, days: orderedMerge(x.days, days) }
          : x);
      }
      return [...prev, { id: Date.now().toString(), fy, days: orderedMerge([], days) }];
    });
    toast.success(editing ? 'Updated' : 'Saved');
    clear();
  };
  const edit = (w: Weekend) => { setEditing(w.id); setFy(w.fy); setDays(w.days); };
  const del = (id: string) => setList(prev => prev.filter(w => w.id !== id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card><CardContent className="py-4"><nav className="text-sm"><span className="font-semibold">Central Configuration</span> / Weekend</nav></CardContent></Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Weekend / {editing ? 'Edit' : 'Create'}</h2>
            <div className="space-y-5">
              <div className="space-y-2 max-w-md">
                <Label>Fiscal Year <span className="text-destructive">*</span></Label>
                <Select value={fy} onValueChange={setFy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">{fiscalYears.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-2">Weekend Info — Select Day <span className="text-destructive">*</span></Label>
                <div className="flex flex-wrap gap-2">
                  {dayList.map(d => (
                    <button type="button" key={d} onClick={() => toggle(d)}
                      className={`px-4 py-2 rounded-md border text-sm transition ${days.includes(d) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="destructive" onClick={clear}>Clear</Button>
                <Button onClick={submit}>Submit</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Fiscal Year</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Weekend Per Week</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((w, i) => (
                    <TableRow key={w.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{w.fy}</TableCell>
                      <TableCell>{w.days.join(', ')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => edit(w)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(w.id)}><Trash2 className="h-4 w-4" /></Button>
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
