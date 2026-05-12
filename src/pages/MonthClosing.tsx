import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Pencil, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Closure { id: string; sl: number; month: string; closingDate: string; fy: string; createdAt: string; createdBy: string; status: string; }
const fiscalYears = ['01 Jul 2025 to 30 Jun 2026', '01 Jul 2024 to 30 Jun 2025'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function MonthClosing() {
  const [fy, setFy] = useState(''); const [month, setMonth] = useState(''); const [search, setSearch] = useState('');
  const [list, setList] = useState<Closure[]>([
    { id: '1', sl: 1, month: 'January', closingDate: '2026-01-31', fy: fiscalYears[0], createdAt: '2026-02-01', createdBy: 'Mim', status: 'Closed' },
    { id: '2', sl: 2, month: 'February', closingDate: '2026-02-28', fy: fiscalYears[0], createdAt: '2026-03-01', createdBy: 'Mim', status: 'Closed' },
    { id: '3', sl: 3, month: 'March', closingDate: '2026-03-31', fy: fiscalYears[0], createdAt: '2026-04-01', createdBy: 'Mim', status: 'Closed' },
  ]);

  const reset = () => { setFy(''); setMonth(''); };
  const submit = () => {
    if (!fy || !month) { toast.error('Fiscal Year & Month are required'); return; }
    setList(prev => [...prev, {
      id: Date.now().toString(), sl: prev.length + 1, month, closingDate: format(new Date(), 'yyyy-MM-dd'),
      fy, createdAt: format(new Date(), 'yyyy-MM-dd'), createdBy: 'Current User', status: 'Closed',
    }]);
    toast.success('Month closed');
    reset();
  };
  const filtered = list.filter(l => !search || l.month.toLowerCase().includes(search.toLowerCase()) || l.fy.includes(search));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card><CardContent className="py-4"><nav className="text-sm"><span className="font-semibold">Periodical Process</span> / Month Closing</nav></CardContent></Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Close Month</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Fiscal Year <span className="text-destructive">*</span></Label>
                <Select value={fy} onValueChange={setFy}>
                  <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">{fiscalYears.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Month <span className="text-destructive">*</span></Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger><SelectValue placeholder="Select Month" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <Button variant="outline" onClick={() => toast.info('Cancelled')}>Cancel</Button>
              <Button variant="secondary" onClick={reset}>Reset</Button>
              <Button onClick={submit}>Submit</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Closed Months</h2>
            </div>
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold">SL No</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Month</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Closing Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Fiscal Year</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Created at</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Created By</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c, i) => (
                    <TableRow key={c.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{c.sl}</TableCell>
                      <TableCell>{c.month}</TableCell>
                      <TableCell>{c.closingDate}</TableCell>
                      <TableCell>{c.fy}</TableCell>
                      <TableCell>{c.createdAt}</TableCell>
                      <TableCell>{c.createdBy}</TableCell>
                      <TableCell><Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><Pencil className="h-4 w-4" /></Button></TableCell>
                      <TableCell><span className="text-success font-medium">{c.status}</span></TableCell>
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
