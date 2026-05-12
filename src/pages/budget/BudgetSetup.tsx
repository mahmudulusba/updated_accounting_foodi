import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Download, ArrowLeft, Minus } from 'lucide-react';
import AmountLinesTree from '@/components/lease/AmountLinesTree';
import { toast } from 'sonner';

interface BudgetRow {
  id: string;
  glNo: string;
  glName: string;
  budgetHead: string;
  budgetHeadName: string;
  budgetCategory: string;
  glType: string;
  parentGL: string;
  status: 'Active' | 'Inactive';
}

const seed: BudgetRow[] = [
  { id: '1', glNo: '50101', glName: 'Office Rent', budgetHead: 'BH-001', budgetHeadName: 'Admin Rent', budgetCategory: 'Cost Budget', glType: 'Expense', parentGL: 'Operating Expense', status: 'Active' },
  { id: '2', glNo: '50205', glName: 'Conveyance Expenses', budgetHead: 'BH-002', budgetHeadName: 'Conveyance', budgetCategory: 'Cost Budget', glType: 'Expense', parentGL: 'Operating Expense', status: 'Active' },
  { id: '3', glNo: '12010', glName: 'Office Equipment', budgetHead: 'BH-003', budgetHeadName: 'IT Equipment', budgetCategory: 'Fixed Asset Budget', glType: 'Asset', parentGL: 'Property, Plant & Equipment', status: 'Active' },
];

export default function BudgetSetup() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [rows, setRows] = useState<BudgetRow[]>(seed);
  const [filterOpen, setFilterOpen] = useState(false);
  const [formRows, setFormRows] = useState([{ glNo: '', budgetHead: '', budgetHeadName: '', remarks: '' }]);
  const [category, setCategory] = useState('');
  const [glType, setGlType] = useState('');
  const [parentGL, setParentGL] = useState('');
  const [status, setStatus] = useState(true);

  const addFormRow = () => setFormRows([...formRows, { glNo: '', budgetHead: '', budgetHeadName: '', remarks: '' }]);
  const removeFormRow = (i: number) => setFormRows(formRows.filter((_, idx) => idx !== i));

  if (view === 'form') {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-1" /> Back</Button>
              <h1 className="text-xl font-bold text-foreground">Budget Setup</h1>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Header</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Budget Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cost">Cost Budget</SelectItem>
                      <SelectItem value="fa">Fixed Asset Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>GL Type *</Label>
                  <Select value={glType} onValueChange={setGlType}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset">Asset</SelectItem>
                      <SelectItem value="liability">Liability</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Parent GL *</Label>
                  <Select value={parentGL} onValueChange={setParentGL}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opex">Operating Expense</SelectItem>
                      <SelectItem value="ppe">Property, Plant & Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Label>Status</Label>
                  <Switch checked={status} onCheckedChange={setStatus} />
                  <span className="text-sm">{status ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Amount Lines</CardTitle></CardHeader>
            <CardContent>
              <AmountLinesTree />
            </CardContent>
          </Card>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setFormRows([{ glNo: '', budgetHead: '', budgetHeadName: '', remarks: '' }]); }}>Clear</Button>
            <Button onClick={() => { toast.success('Budget saved'); setView('list'); }}>Save</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Budget Setup</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)}><Search size={14} className="mr-1" /> Search</Button>
            <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Export</Button>
            <Button size="sm" onClick={() => setView('form')}><Plus size={14} className="mr-1" /> Create</Button>
          </div>
        </div>
        {filterOpen && (
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-3">
                <div><Label>GL Type</Label><Input /></div>
                <div><Label>Parent GL</Label><Input /></div>
                <div><Label>GL</Label><Input /></div>
                <div><Label>Budget Category</Label><Input /></div>
                <div><Label>Budget Head</Label><Input /></div>
                <div><Label>Status</Label>
                  <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-3"><Button size="sm"><Search size={14} className="mr-1" /> Search</Button><Button size="sm" variant="outline">Clear</Button></div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="font-semibold">SL</TableHead>
                  <TableHead className="font-semibold">GL No</TableHead>
                  <TableHead className="font-semibold">GL Name</TableHead>
                  <TableHead className="font-semibold">Budget Head</TableHead>
                  <TableHead className="font-semibold">Budget Head Name</TableHead>
                  <TableHead className="font-semibold">Budget Category</TableHead>
                  <TableHead className="font-semibold">GL Type</TableHead>
                  <TableHead className="font-semibold">Parent GL</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-mono">{r.glNo}</TableCell>
                    <TableCell>{r.glName}</TableCell>
                    <TableCell className="font-mono">{r.budgetHead}</TableCell>
                    <TableCell>{r.budgetHeadName}</TableCell>
                    <TableCell>{r.budgetCategory}</TableCell>
                    <TableCell>{r.glType}</TableCell>
                    <TableCell>{r.parentGL}</TableCell>
                    <TableCell><Badge variant={r.status === 'Active' ? 'default' : 'secondary'}>{r.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
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