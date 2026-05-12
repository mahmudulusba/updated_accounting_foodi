import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Pencil, Trash2, Check, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  unit: string;
  subUnit: string;
  isActive: boolean;
  isBase: boolean;
}

const initial: Currency[] = [
  { id: '1', code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', unit: 'Taka', subUnit: 'Paisa', isActive: true, isBase: true },
  { id: '2', code: 'USD', name: 'US Dollar', symbol: '$', unit: 'Dollar', subUnit: 'Cent', isActive: true, isBase: false },
  { id: '3', code: 'EUR', name: 'Euro', symbol: '€', unit: 'Euro', subUnit: 'Cent', isActive: true, isBase: false },
];

const empty: Omit<Currency, 'id'> = { code: '', name: '', symbol: '', unit: '', subUnit: '', isActive: true, isBase: false };

export default function CurrencySetup() {
  const [list, setList] = useState<Currency[]>(initial);
  const [form, setForm] = useState<Omit<Currency, 'id'>>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleClear = () => { setForm({ ...empty }); setEditingId(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name) { toast.error('Currency Code & Name are required'); return; }
    if (editingId) {
      setList(prev => prev.map(c => {
        if (c.id === editingId) return { ...form, id: editingId };
        return form.isBase ? { ...c, isBase: false } : c;
      }));
      toast.success('Currency updated');
    } else {
      const id = Date.now().toString();
      setList(prev => {
        const next = form.isBase ? prev.map(c => ({ ...c, isBase: false })) : prev;
        return [...next, { ...form, id }];
      });
      toast.success('Currency added');
    }
    handleClear();
    setShowForm(false);
  };

  const handleEdit = (c: Currency) => { setEditingId(c.id); setForm({ ...c }); setShowForm(true); };
  const handleDelete = (id: string) => {
    const c = list.find(x => x.id === id);
    if (c?.isBase) { toast.error('Cannot delete base currency'); return; }
    setList(prev => prev.filter(x => x.id !== id));
    toast.success('Currency removed');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardContent className="py-4 flex items-center justify-between">
            <nav className="text-sm"><span className="font-semibold">Central Configuration</span> / Currency {showForm ? '/ Create' : '/ List'}</nav>
            {!showForm ? (
              <Button size="icon" onClick={() => { handleClear(); setShowForm(true); }} title="Add"><Plus className="h-4 w-4" /></Button>
            ) : (
              <Button size="icon" variant="destructive" onClick={() => { handleClear(); setShowForm(false); }} title="Close"><X className="h-4 w-4" /></Button>
            )}
          </CardContent>
        </Card>

        {showForm && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Currency / {editingId ? 'Edit' : 'Create'}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Currency Code <span className="text-destructive">*</span></Label>
                <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. BDT" maxLength={5} />
              </div>
              <div className="space-y-2">
                <Label>Currency Name <span className="text-destructive">*</span></Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bangladeshi Taka" />
              </div>
              <div className="space-y-2">
                <Label>Symbol</Label>
                <Input value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })} placeholder="e.g. ৳" />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="e.g. Taka" />
              </div>
              <div className="space-y-2">
                <Label>Sub Unit</Label>
                <Input value={form.subUnit} onChange={e => setForm({ ...form, subUnit: e.target.value })} placeholder="e.g. Paisa" />
              </div>
              <div className="space-y-2">
                <Label>Status <span className="text-destructive">*</span></Label>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: !!v })} id="cur-active" />
                    <Label htmlFor="cur-active" className="font-normal">Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={form.isBase} onCheckedChange={v => setForm({ ...form, isBase: !!v })} id="cur-base" />
                    <Label htmlFor="cur-base" className="font-normal">Base CUR</Label>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 flex justify-center gap-3 pt-2">
                <Button type="button" variant="destructive" onClick={handleClear}>Clear</Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Currency List</h2>
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Symbol</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Unit</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Sub Unit</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Base</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((c, i) => (
                    <TableRow key={c.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{c.code}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.symbol}</TableCell>
                      <TableCell>{c.unit}</TableCell>
                      <TableCell>{c.subUnit}</TableCell>
                      <TableCell>{c.isBase ? <Check className="h-4 w-4 text-success" /> : '-'}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 text-sm ${c.isActive ? 'text-success' : 'text-muted-foreground'}`}>
                          <span className={`w-2 h-2 rounded-full ${c.isActive ? 'bg-success' : 'bg-muted-foreground'}`} />
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => handleEdit(c)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
