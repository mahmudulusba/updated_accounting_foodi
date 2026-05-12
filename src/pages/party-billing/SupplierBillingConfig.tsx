import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Row { id: number; code: string; name: string; shop: string; method: 'Auto' | 'Manual'; }

const seed: Row[] = [
  { id: 1, code: 'SLC00009470', name: 'Khan Nazmul Islam', shop: 'Digital Pack', method: 'Auto' },
  { id: 2, code: 'SLC00009721', name: 'Search DEV', shop: 'Search DEV', method: 'Auto' },
  { id: 3, code: 'SLC00009720', name: 'Test_Test', shop: 'Hut', method: 'Auto' },
  { id: 4, code: 'SLC00009718', name: 'Pranto', shop: "Pranto's Shop", method: 'Manual' },
  { id: 5, code: 'SLC00009688', name: 'Fahmida Islam', shop: 'Sugarblush', method: 'Auto' },
  { id: 6, code: 'SLC00009704', name: 'Maksura Rahman', shop: 'ki ki lagbe', method: 'Auto' },
  { id: 7, code: 'SLC00009701', name: 'Supplier Signup Testing', shop: 'Supplier Signup Testing 2026', method: 'Auto' },
  { id: 8, code: 'SLC00009700', name: 'Toufiq', shop: 'Toufiq Shop', method: 'Auto' },
  { id: 9, code: 'SLC00009699', name: 'Sajeeb Sarkar', shop: 'Nextrio Venture', method: 'Auto' },
  { id: 10, code: 'SLC00009656', name: 'Fahmida Islam', shop: 'Lucky Dragon', method: 'Manual' },
];

export default function SupplierBillingConfig() {
  const [rows, setRows] = useState<Row[]>(seed);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Row | null>(null);
  const [method, setMethod] = useState<'Auto' | 'Manual'>('Auto');

  const filtered = rows.filter(r =>
    !search || r.code.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase())
  );

  const open = (r: Row) => { setEditing(r); setMethod(r.method); };
  const submit = () => {
    if (!editing) return;
    setRows(rows.map(r => r.id === editing.id ? { ...r, method } : r));
    toast.success('Billing method updated');
    setEditing(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          Supplier Billing / <span className="text-primary font-medium">Supplier Billing Config</span> / List
        </nav>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Supplier Billing Config List</h2>
              <div className="flex gap-2">
                <Input placeholder="Search by Supplier Code, Name..." value={search} onChange={e => setSearch(e.target.value)} className="w-72" />
                <Button variant="outline" onClick={() => setSearch('')}>Reset</Button>
              </div>
            </div>
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-16">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Supplier Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Supplier Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Shop Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Billing Method</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => (
                    <TableRow key={r.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{r.code}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.shop}</TableCell>
                      <TableCell><Badge variant={r.method === 'Auto' ? 'default' : 'secondary'}>{r.method}</Badge></TableCell>
                      <TableCell><Button variant="outline" size="sm" onClick={() => open(r)}>Change Billing Method</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Showing {filtered.length} of 5551</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editing} onOpenChange={o => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Billing Method</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Supplier: {editing?.name} ({editing?.code})</Label>
            <RadioGroup value={method} onValueChange={v => setMethod(v as 'Auto' | 'Manual')}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Auto" id="auto" /><Label htmlFor="auto">Auto</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Manual" id="manual" /><Label htmlFor="manual">Manual</Label></div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMethod(editing?.method || 'Auto')}>Reset</Button>
            <Button onClick={submit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}