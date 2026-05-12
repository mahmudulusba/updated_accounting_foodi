import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Pencil, Trash2, Check, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface Dept { id: string; sbu: string; code: string; name: string; active: boolean; }
const SBUS = ['Foodi', 'US-Bangla Airlines', 'Mart', 'Pharma', 'Restaurant'];


const seed: Dept[] = [
  { id: '1', sbu: 'Foodi', code: 'DEPT08', name: 'dept1', active: true },
  { id: '2', sbu: 'Mart', code: 'DEPT07', name: 'Commercial - Mart', active: true },
  { id: '3', sbu: 'Foodi', code: 'DEPT06', name: 'HR', active: true },
  { id: '4', sbu: 'Foodi', code: 'DEPT05', name: 'Finance & Accounts', active: true },
  { id: '5', sbu: 'Foodi', code: 'DEPT02', name: 'Foodi - Revenue', active: true },
  { id: '6', sbu: 'Foodi', code: 'DEPT01', name: 'Foodi - Expenses', active: true },
];

export default function DepartmentSetup() {
  const [list, setList] = useState<Dept[]>(seed);
  const [sbu, setSbu] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const clear = () => { setSbu(''); setCode(''); setName(''); setActive(true); setEditing(null); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sbu || !code || !name) { toast.error('SBU, Code & Name required'); return; }
    if (editing) { setList(prev => prev.map(d => d.id === editing ? { ...d, sbu, code, name, active } : d)); toast.success('Updated'); }
    else { setList(prev => [{ id: Date.now().toString(), sbu, code, name, active }, ...prev]); toast.success('Added'); }
    clear();
    setShowForm(false);
  };
  const edit = (d: Dept) => { setEditing(d.id); setSbu(d.sbu); setCode(d.code); setName(d.name); setActive(d.active); setShowForm(true); };
  const del = (id: string) => setList(prev => prev.filter(d => d.id !== id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card><CardContent className="py-4 flex items-center justify-between">
          <nav className="text-sm"><span className="font-semibold">Central Configuration</span> / Department {showForm ? '/ Create' : '/ List'}</nav>
          {!showForm ? (
            <Button size="icon" onClick={() => { clear(); setShowForm(true); }} title="Add"><Plus className="h-4 w-4" /></Button>
          ) : (
            <Button size="icon" variant="destructive" onClick={() => { clear(); setShowForm(false); }} title="Close"><X className="h-4 w-4" /></Button>
          )}
        </CardContent></Card>

        {showForm && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Department / {editing ? 'Edit' : 'Create'}</h2>
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2"><Label>SBU <span className="text-destructive">*</span></Label>
                <Select value={sbu} onValueChange={setSbu}>
                  <SelectTrigger><SelectValue placeholder="Select SBU" /></SelectTrigger>
                  <SelectContent>{SBUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Department Code <span className="text-destructive">*</span></Label><Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. DEPT09" /></div>
              <div className="space-y-2"><Label>Department Name <span className="text-destructive">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Status</Label>
                <div className="flex items-center gap-2 pt-2"><Checkbox id="dep-act" checked={active} onCheckedChange={v => setActive(!!v)} /><Label htmlFor="dep-act" className="font-normal">Active</Label></div>
              </div>
              <div className="md:col-span-3 flex justify-end gap-3">
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
                    <TableHead className="text-table-header-foreground font-semibold">SBU</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Department Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Department Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((d, i) => (
                    <TableRow key={d.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{d.sbu}</TableCell>
                      <TableCell className="font-medium">{d.code}</TableCell>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>{d.active ? <Check className="h-4 w-4 text-success" /> : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => edit(d)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(d.id)}><Trash2 className="h-4 w-4" /></Button>
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
