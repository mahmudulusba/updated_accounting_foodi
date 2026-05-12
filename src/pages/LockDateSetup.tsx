import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Lock, Unlock, ChevronRight, Home, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface LockDateRow {
  id: number;
  fiscalYear: string;
  month: string;
  year: string;
  lockDate: string;
  isActive: boolean;
}

const fiscalYearOptions = ['2024-2025', '2025-2026', '2026-2027'];
const monthOptions = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDisplay(iso: string) {
  if (!iso) return '';
  const [y, m, dd] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${dd}-${months[parseInt(m, 10) - 1]}-${y}`;
}

export default function LockDateSetup() {
  const [tab, setTab] = useState<'active' | 'inactive'>('active');
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [rows, setRows] = useState<LockDateRow[]>([
    { id: 1, fiscalYear: '2024-2025', month: 'January', year: '2025', lockDate: '2025-02-05', isActive: true },
  ]);
  const [nextId, setNextId] = useState(2);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formFY, setFormFY] = useState('');
  const [formMonth, setFormMonth] = useState('');
  const [formDate, setFormDate] = useState(todayISO());

  const resetForm = () => {
    setFormFY('');
    setFormMonth('');
    setFormDate(todayISO());
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (row: LockDateRow) => {
    setEditingId(row.id);
    setFormFY(row.fiscalYear);
    setFormMonth(row.month);
    setFormDate(row.lockDate);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!formFY || !formMonth || !formDate) {
      toast.error('Please fill all required fields');
      return;
    }
    const year = formDate.split('-')[0];
    if (editingId !== null) {
      setRows(prev => prev.map(r => r.id === editingId ? { ...r, fiscalYear: formFY, month: formMonth, year, lockDate: formDate } : r));
      toast.success('Lock date updated');
    } else {
      setRows(prev => [...prev, { id: nextId, fiscalYear: formFY, month: formMonth, year, lockDate: formDate, isActive: true }]);
      setNextId(nextId + 1);
      toast.success('Lock date added');
    }
    setOpen(false);
    resetForm();
  };

  const toggleActive = (id: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const filtered = rows.filter(r => r.isActive === (tab === 'active') &&
    (!search || r.fiscalYear.toLowerCase().includes(search.toLowerCase())));

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Home size={14} />
          <ChevronRight size={14} />
          <span>Config</span>
          <ChevronRight size={14} />
          <span>Lock Date</span>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">List</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Lock Date</h1>
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="icon" onClick={() => setShowFilter(v => !v)} title="Filter">
              <Filter size={16} />
            </Button>
            <Button variant="destructive" size="icon" onClick={openCreate} title="Create">
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {showFilter && (
          <div className="flex justify-center">
            <Input
              placeholder="Search by Fiscal Year"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'inactive')}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="border rounded-lg">
          <TableWithSearch>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">SN</TableHead>
                <TableHead>Fiscal Year Name</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Lock Date</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">No records</TableCell>
                </TableRow>
              ) : filtered.map((r, idx) => (
                <TableRow key={r.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{r.fiscalYear}</TableCell>
                  <TableCell>{r.month}</TableCell>
                  <TableCell>{r.year}</TableCell>
                  <TableCell>{formatDisplay(r.lockDate)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(r)} className="text-primary hover:text-primary/80" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => toggleActive(r.id)} className="text-amber-600 hover:text-amber-700" title={r.isActive ? 'Deactivate' : 'Activate'}>
                        {r.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWithSearch>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId !== null ? 'Edit Lock Date' : 'Add Lock Date'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Financial Year<span className="text-destructive">*</span></Label>
              <Select value={formFY} onValueChange={setFormFY}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {fiscalYearOptions.map(fy => <SelectItem key={fy} value={fy}>{fy}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Month<span className="text-destructive">*</span></Label>
              <Select value={formMonth} onValueChange={setFormMonth}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {monthOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lock Date<span className="text-destructive">*</span></Label>
              <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Reset</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}