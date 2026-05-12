import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Search, Download, ArrowLeft, Minus, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Row {
  id: string;
  category: string;
  budgetCode: string;
  budgetHead: string;
  initial: number;
  adjusted: number;
  total: number;
}

const seed: Row[] = [
  { id: '1', category: 'Cost Budget', budgetCode: 'BH-001', budgetHead: 'Admin Rent', initial: 1200000, adjusted: 100000, total: 1300000 },
  { id: '2', category: 'Cost Budget', budgetCode: 'BH-002', budgetHead: 'Conveyance', initial: 500000, adjusted: -50000, total: 450000 },
  { id: '3', category: 'Fixed Asset Budget', budgetCode: 'BH-003', budgetHead: 'IT Equipment', initial: 2500000, adjusted: 0, total: 2500000 },
];

export default function BudgetCostHeadAmountSetup() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [rows, setRows] = useState<Row[]>(seed);
  const [filterOpen, setFilterOpen] = useState(false);
  const [formRows, setFormRows] = useState([{ budgetHead: '', initial: '', adjusted: '', remarks: '' }]);

  const addRow = () => setFormRows([...formRows, { budgetHead: '', initial: '', adjusted: '', remarks: '' }]);
  const removeRow = (i: number) => setFormRows(formRows.filter((_, idx) => idx !== i));

  if (view === 'form') {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-1" /> Back</Button>
            <h1 className="text-xl font-bold">Budget Cost Head Wise Amount Setup</h1>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Header</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div><Label>Fiscal Year *</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="2025-26">2025-2026</SelectItem><SelectItem value="2024-25">2024-2025</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Budget Category *</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="cost">Cost Budget</SelectItem><SelectItem value="fa">Fixed Asset Budget</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Parent GL *</Label><Input /></div>
                <div><Label>Branch</Label><Input /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Amount Lines</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="font-semibold">SL</TableHead>
                    <TableHead className="font-semibold">Budget Head *</TableHead>
                    <TableHead className="font-semibold">Initial Amount *</TableHead>
                    <TableHead className="font-semibold">Adjusted Amount</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Remarks</TableHead>
                    <TableHead className="font-semibold w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formRows.map((r, i) => {
                    const total = (parseFloat(r.initial) || 0) + (parseFloat(r.adjusted) || 0);
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell><Input value={r.budgetHead} onChange={(e) => { const c = [...formRows]; c[i].budgetHead = e.target.value; setFormRows(c); }} /></TableCell>
                        <TableCell><Input type="number" value={r.initial} onChange={(e) => { const c = [...formRows]; c[i].initial = e.target.value; setFormRows(c); }} /></TableCell>
                        <TableCell><Input type="number" value={r.adjusted} onChange={(e) => { const c = [...formRows]; c[i].adjusted = e.target.value; setFormRows(c); }} /></TableCell>
                        <TableCell className="font-semibold tabular-nums">{total.toLocaleString()}</TableCell>
                        <TableCell><Input value={r.remarks} onChange={(e) => { const c = [...formRows]; c[i].remarks = e.target.value; setFormRows(c); }} /></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {i === formRows.length - 1 && <Button size="icon" variant="outline" className="h-8 w-8" onClick={addRow}><Plus size={14} /></Button>}
                            {formRows.length > 1 && <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => removeRow(i)}><Minus size={14} /></Button>}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>
          <div className="flex gap-2 justify-end">
            <Button variant="outline">Clear</Button>
            <Button onClick={() => { toast.success('Saved'); setView('list'); }}>Save</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Budget Cost Head Wise Amount Setup</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)}><Search size={14} className="mr-1" /> Search</Button>
            <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Export</Button>
            <Button size="sm" onClick={() => setView('form')}><Plus size={14} className="mr-1" /> Create</Button>
          </div>
        </div>
        {filterOpen && (
          <Card><CardContent className="pt-4">
            <div className="grid grid-cols-4 gap-3">
              <div><Label>Parent GL</Label><Input /></div>
              <div><Label>Fiscal Year</Label><Input /></div>
              <div><Label>Budget Category</Label><Input /></div>
              <div><Label>Budget Head</Label><Input /></div>
            </div>
            <div className="flex gap-2 mt-3"><Button size="sm"><Search size={14} className="mr-1" /> Search</Button><Button size="sm" variant="outline">Clear</Button></div>
          </CardContent></Card>
        )}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="font-semibold">SL</TableHead>
                  <TableHead className="font-semibold">Budget Category</TableHead>
                  <TableHead className="font-semibold">Budget Code</TableHead>
                  <TableHead className="font-semibold">Budget Cost Head</TableHead>
                  <TableHead className="font-semibold text-right">Initial Amount</TableHead>
                  <TableHead className="font-semibold text-right">Adjusted Amount</TableHead>
                  <TableHead className="font-semibold text-right">Total Amount</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell className="font-mono">{r.budgetCode}</TableCell>
                    <TableCell>{r.budgetHead}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.initial.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.adjusted.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{r.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Eye size={14} /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setView('form')}><Pencil size={14} /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { setRows(rows.filter(x => x.id !== r.id)); toast.success('Deleted'); }}><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}