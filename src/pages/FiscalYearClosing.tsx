import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Pencil, Search } from 'lucide-react';
import { Input as UIInput } from '@/components/ui/input';
import { toast } from 'sonner';

interface ClosedFY {
  id: string;
  sl: number;
  fyName: string;
  startDate: string;
  endDate: string;
  closingDate: string;
  createdBy: string;
  status: 'Closed' | 'Reopened';
}

export default function FiscalYearClosing() {
  const [action, setAction] = useState<'close' | 'reopen'>('close');
  const [fyName, setFyName] = useState('01 Jul 2022 to 30 Jun 2023');
  const [startDate, setStartDate] = useState('2022-07-01');
  const [endDate, setEndDate] = useState('2023-06-30');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [closedList, setClosedList] = useState<ClosedFY[]>([
    { id: '1', sl: 1, fyName: '01 Jul 2021 to 30 Jun 2022', startDate: '2021-07-01', endDate: '2022-06-30', closingDate: '2022-07-15', createdBy: 'Mim', status: 'Closed' },
    { id: '2', sl: 2, fyName: '01 Jul 2020 to 30 Jun 2021', startDate: '2020-07-01', endDate: '2021-06-30', closingDate: '2021-07-12', createdBy: 'Mim', status: 'Closed' },
    { id: '3', sl: 3, fyName: '01 Jul 2019 to 30 Jun 2020', startDate: '2019-07-01', endDate: '2020-06-30', closingDate: '2020-07-10', createdBy: 'Mim', status: 'Closed' },
  ]);

  const onProcess = () => {
    if (action === 'reopen' && editingId) {
      setClosedList(prev => prev.map(c => c.id === editingId ? { ...c, status: 'Reopened' } : c));
      toast.success('Fiscal Year Reopened successfully');
      setEditingId(null);
      setAction('close');
      setFyName('01 Jul 2022 to 30 Jun 2023');
      setStartDate('2022-07-01');
      setEndDate('2023-06-30');
      return;
    }
    if (action === 'close') {
      setClosedList(prev => [...prev, {
        id: Date.now().toString(), sl: prev.length + 1, fyName, startDate, endDate,
        closingDate: new Date().toISOString().split('T')[0], createdBy: 'Current User', status: 'Closed',
      }]);
    }
    toast.success(`Fiscal Year ${action === 'close' ? 'Closed' : 'Reopened'} successfully`);
  };

  const onEdit = (row: ClosedFY) => {
    if (row.status !== 'Closed') {
      toast.error('Only Closed fiscal years can be reopened');
      return;
    }
    setAction('reopen');
    setFyName(row.fyName);
    setStartDate(row.startDate);
    setEndDate(row.endDate);
    setEditingId(row.id);
    toast.info('Reopen mode enabled. Click Process to confirm.');
  };

  const filtered = closedList.filter(c => !search || c.fyName.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardContent className="py-4">
            <nav className="text-sm">
              <span className="font-semibold">Periodical Process</span> / Fiscal Year{' '}
              <span className="px-2 py-0.5 bg-muted rounded text-xs">Processing</span>
            </nav>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6 space-y-6">
            <div className="flex items-center gap-2 border-b pb-3">
              <h2 className="text-lg font-semibold">Fiscal Year</h2>
              <span className="px-2 py-0.5 bg-muted rounded text-xs">Processing</span>
            </div>

            <RadioGroup
              value={action}
              onValueChange={(v) => setAction(v as 'close' | 'reopen')}
              className="flex items-center gap-8"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="close" id="close" disabled={!!editingId} />
                <Label htmlFor="close" className="cursor-pointer">Year Close</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="reopen" id="reopen" />
                <Label htmlFor="reopen" className="cursor-pointer">Year Reopen</Label>
              </div>
            </RadioGroup>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Financial Year Name</Label>
                <Input value={fyName} readOnly className="bg-muted" />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={startDate} readOnly className="bg-muted" />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={endDate} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={onProcess} className="px-10">Process</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Closed Fiscal Years</h2>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <UIInput className="pl-8" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold">SL No</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Fiscal Year</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Start Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">End Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Closing Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Created By</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c, i) => (
                    <TableRow key={c.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{c.sl}</TableCell>
                      <TableCell>{c.fyName}</TableCell>
                      <TableCell>{c.startDate}</TableCell>
                      <TableCell>{c.endDate}</TableCell>
                      <TableCell>{c.closingDate}</TableCell>
                      <TableCell>{c.createdBy}</TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary disabled:opacity-40"
                          disabled={c.status !== 'Closed'}
                          onClick={() => onEdit(c)}
                          title={c.status === 'Closed' ? 'Reopen this fiscal year' : 'Already reopened'}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <span className={c.status === 'Closed' ? 'text-success font-medium' : 'text-warning font-medium'}>{c.status}</span>
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
