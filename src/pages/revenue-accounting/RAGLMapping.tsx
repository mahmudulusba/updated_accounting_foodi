import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Plus, FileCheck, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface GLMapping {
  id: string;
  eventCode: string;
  eventName: string;
  category: 'Sales' | 'Lift' | 'Cargo' | 'Interline' | 'Adjustment';
  debitGL: string;
  debitGLName: string;
  creditGL: string;
  creditGLName: string;
  active: boolean;
}

const initialMappings: GLMapping[] = [
  { id: '1', eventCode: 'POS-SALE', eventName: 'Foodi Mart POS Sale (Counter)', category: 'Sales', debitGL: '1320', debitGLName: 'POS Clearing — Receivable', creditGL: '2410', creditGLName: 'Deferred Revenue — Retail', active: true },
  { id: '2', eventCode: 'ORDER-FULFILL', eventName: 'Online Order Fulfilled / Delivered', category: 'Lift', debitGL: '2410', debitGLName: 'Deferred Revenue — Retail', creditGL: '4010', creditGLName: 'Earned Retail Revenue', active: true },
  { id: '3', eventCode: 'WHOLESALE', eventName: 'Wholesale / Bulk Delivery Issued', category: 'Cargo', debitGL: '1330', debitGLName: 'Wholesale Clearing — Receivable', creditGL: '4020', creditGLName: 'Wholesale Revenue', active: true },
  { id: '4', eventCode: 'VENDOR-STL', eventName: 'Vendor / Marketplace Settlement', category: 'Interline', debitGL: '1340', debitGLName: 'Marketplace Receivable', creditGL: '4030', creditGLName: 'Marketplace Revenue', active: true },
  { id: '5', eventCode: 'PROMO-ADJ', eventName: 'Promotion / Discount Adjustment', category: 'Adjustment', debitGL: '4010', debitGLName: 'Earned Retail Revenue', creditGL: '4030', creditGLName: 'Marketplace Revenue', active: true },
  { id: '6', eventCode: 'REFUND', eventName: 'Sales Refund', category: 'Adjustment', debitGL: '2410', debitGLName: 'Deferred Revenue — Retail', creditGL: '1320', creditGLName: 'POS Clearing — Receivable', active: true },
];

const glOptions = [
  { code: '1320', name: 'POS Clearing — Receivable' },
  { code: '1330', name: 'Wholesale Clearing — Receivable' },
  { code: '1340', name: 'Marketplace Receivable' },
  { code: '2410', name: 'Deferred Revenue — Retail' },
  { code: '4010', name: 'Earned Retail Revenue' },
  { code: '4020', name: 'Wholesale Revenue' },
  { code: '4030', name: 'Marketplace Revenue' },
];

const categoryColors: Record<GLMapping['category'], string> = {
  Sales: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Lift: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  Cargo: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Interline: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  Adjustment: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export default function RAGLMapping() {
  const [mappings, setMappings] = useState<GLMapping[]>(initialMappings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GLMapping | null>(null);
  const [form, setForm] = useState<Omit<GLMapping, 'id'>>({
    eventCode: '', eventName: '', category: 'Sales',
    debitGL: '', debitGLName: '', creditGL: '', creditGLName: '', active: true,
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ eventCode: '', eventName: '', category: 'Sales', debitGL: '', debitGLName: '', creditGL: '', creditGLName: '', active: true });
    setDialogOpen(true);
  };

  const openEdit = (m: GLMapping) => {
    setEditing(m);
    const { id, ...rest } = m;
    setForm(rest);
    setDialogOpen(true);
  };

  const setGL = (side: 'debit' | 'credit', code: string) => {
    const gl = glOptions.find(g => g.code === code);
    if (!gl) return;
    setForm(prev => ({
      ...prev,
      [side === 'debit' ? 'debitGL' : 'creditGL']: gl.code,
      [side === 'debit' ? 'debitGLName' : 'creditGLName']: gl.name,
    }));
  };

  const save = () => {
    if (!form.eventCode || !form.eventName || !form.debitGL || !form.creditGL) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (editing) {
      setMappings(prev => prev.map(m => m.id === editing.id ? { ...form, id: editing.id } : m));
      toast.success('Mapping updated');
    } else {
      setMappings(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success('Mapping added');
    }
    setDialogOpen(false);
  };

  const remove = (id: string) => {
    setMappings(prev => prev.filter(m => m.id !== id));
    toast.success('Mapping deleted');
  };

  const toggleActive = (id: string) => {
    setMappings(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Revenue Accounting</span>
              <span>›</span>
              <span>GL Mapping</span>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              GL Mapping Configuration
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
              Configure which GL accounts to debit and credit for each revenue event. Done once; drives all auto-voucher creation from Excel uploads.
            </p>
          </div>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Mapping
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Total Events</div><div className="text-2xl font-bold mt-1">{mappings.length}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Active</div><div className="text-2xl font-bold mt-1 text-emerald-600">{mappings.filter(m=>m.active).length}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Inactive</div><div className="text-2xl font-bold mt-1 text-muted-foreground">{mappings.filter(m=>!m.active).length}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Categories</div><div className="text-2xl font-bold mt-1">{new Set(mappings.map(m=>m.category)).size}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCheck className="h-5 w-5 text-primary" />
              Revenue Event Mappings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL</TableHead>
                    <TableHead>Event Code</TableHead>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Debit GL</TableHead>
                    <TableHead>Credit GL</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((m, i) => (
                    <TableRow key={m.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-mono text-xs">{m.eventCode}</TableCell>
                      <TableCell className="font-medium">{m.eventName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[m.category]}`}>{m.category}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm"><span className="font-mono">{m.debitGL}</span> · {m.debitGLName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm"><span className="font-mono">{m.creditGL}</span> · {m.creditGLName}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch checked={m.active} onCheckedChange={() => toggleActive(m.id)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Mapping' : 'Add GL Mapping'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label>Event Code *</Label>
              <Input value={form.eventCode} onChange={e => setForm({ ...form, eventCode: e.target.value.toUpperCase() })} placeholder="e.g. POS-SALE" />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v as GLMapping['category'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Lift">Lift</SelectItem>
                  <SelectItem value="Cargo">Cargo</SelectItem>
                  <SelectItem value="Interline">Interline</SelectItem>
                  <SelectItem value="Adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Event Name *</Label>
              <Input value={form.eventName} onChange={e => setForm({ ...form, eventName: e.target.value })} placeholder="e.g. Foodi Mart POS Sale (Counter)" />
            </div>
            <div className="space-y-2">
              <Label>Debit GL *</Label>
              <Select value={form.debitGL} onValueChange={v => setGL('debit', v)}>
                <SelectTrigger><SelectValue placeholder="Select GL" /></SelectTrigger>
                <SelectContent>
                  {glOptions.map(g => <SelectItem key={g.code} value={g.code}>{g.code} — {g.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Credit GL *</Label>
              <Select value={form.creditGL} onValueChange={v => setGL('credit', v)}>
                <SelectTrigger><SelectValue placeholder="Select GL" /></SelectTrigger>
                <SelectContent>
                  {glOptions.map(g => <SelectItem key={g.code} value={g.code}>{g.code} — {g.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Update' : 'Save Mapping'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
