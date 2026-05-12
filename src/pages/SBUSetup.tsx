import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Pencil, Trash2, Check, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface SBU { id: string; code: string; name: string; email: string; active: boolean; }

const seed: SBU[] = [
  { id: '1', code: 'SBU004', name: 'Foodi - Pharma', email: 'mahbuba.mitu@foodi.com', active: true },
  { id: '2', code: 'SBU003', name: 'Foodi - Shop', email: 'mahbuba.mitu@foodi.com', active: true },
  { id: '3', code: 'SBU002', name: 'Foodi - Mart', email: 'mahbuba.mitu@foodi.com', active: true },
  { id: '4', code: 'SBU001', name: 'Foodi - Restaurant', email: 'foodi@foodi.com', active: true },
];

export default function SBUSetup() {
  const [list, setList] = useState<SBU[]>(seed);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [active, setActive] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const nextCode = () => {
    const max = list.reduce((m, s) => Math.max(m, parseInt(s.code.replace('SBU', '')) || 0), 0);
    return `SBU${String(max + 1).padStart(3, '0')}`;
  };

  const clear = () => { setName(''); setEmail(''); setActive(true); setEditing(null); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error('SBU Name required'); return; }
    if (editing) {
      setList(prev => prev.map(s => s.id === editing ? { ...s, name, email, active } : s));
      toast.success('Updated');
    } else {
      setList(prev => [{ id: Date.now().toString(), code: nextCode(), name, email, active }, ...prev]);
      toast.success('Added');
    }
    clear();
    setShowForm(false);
  };
  const edit = (s: SBU) => { setEditing(s.id); setName(s.name); setEmail(s.email); setActive(s.active); setShowForm(true); };
  const del = (id: string) => setList(prev => prev.filter(s => s.id !== id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card><CardContent className="py-4 flex items-center justify-between">
          <nav className="text-sm"><span className="font-semibold">Central Configuration</span> / SBU {showForm ? '/ Create' : '/ List'}</nav>
          {!showForm ? (
            <Button size="icon" onClick={() => { clear(); setShowForm(true); }} title="Add"><Plus className="h-4 w-4" /></Button>
          ) : (
            <Button size="icon" variant="destructive" onClick={() => { clear(); setShowForm(false); }} title="Close"><X className="h-4 w-4" /></Button>
          )}
        </CardContent></Card>

        {showForm && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">SBU / {editing ? 'Edit' : 'Create'}</h2>
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2"><Label>SBU Name <span className="text-destructive">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter SBU Name" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email" /></div>
              <div className="space-y-2"><Label>Status</Label>
                <div className="flex items-center gap-2 pt-2"><Checkbox id="sbu-act" checked={active} onCheckedChange={v => setActive(!!v)} /><Label htmlFor="sbu-act" className="font-normal">Active</Label></div>
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
                    <TableHead className="text-table-header-foreground font-semibold">SBU Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">SBU Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Email</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((s, i) => (
                    <TableRow key={s.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{s.code}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.active ? <Check className="h-4 w-4 text-success" /> : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => edit(s)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(s.id)}><Trash2 className="h-4 w-4" /></Button>
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
